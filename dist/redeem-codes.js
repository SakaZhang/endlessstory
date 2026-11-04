// Local test convenience, not an account service or a protected paid-code system.
import {INFINITY_GAUNTLET_MATERIALS} from './infinity-gauntlet-content.js';
import {MATERIALS,AFFIX_DEFS,validSave,normalizeMaterials,recordCollectedEquipment} from './engine.js';
import {BAG_LIMITS,bagCounts,canReceiveEquipment} from './inventory-schema.js';
import {createLegendaryEquipment} from './legendary-equipment.js';
import {LUCKY_DICE_DEFINITION} from './lucky-dice.js';
import {recordMaterialDiscovered} from './region-navigation-state.js';
const noMaterials=Object.freeze([]);
export const TEST_REDEEM_CODES=Object.freeze({
 INFINITY5:Object.freeze({testOnly:true,repeatable:true,unlocksInfinityGauntletRecipe:false,rewards:Object.freeze(INFINITY_GAUNTLET_MATERIALS.map(({material})=>Object.freeze({material,quality:3,count:1,key:material+'|3',name:MATERIALS[material].name})))}),
 GOLD100K:Object.freeze({testOnly:true,repeatable:true,gold:100000,rewards:noMaterials}),
 LUCKYDICE:Object.freeze({testOnly:true,repeatable:true,equipment:Object.freeze({legendaryId:LUCKY_DICE_DEFINITION.id,name:LUCKY_DICE_DEFINITION.name,slot:LUCKY_DICE_DEFINITION.slot,count:1}),rewards:noMaterials})
});
export function checkRedeemCapacity(s,rewards=TEST_REDEEM_CODES.INFINITY5.rewards){
 const stacks=s.materialStacks??{};
 if(rewards.some(r=>!Number.isSafeInteger(stacks[r.key]??0)||(stacks[r.key]??0)<0||(stacks[r.key]??0)+r.count>1e12))return 'quantity-limit';
 const newStacks=rewards.filter(r=>!(stacks[r.key]>0)).length;
 return newStacks>0&&bagCounts(s).materials+newStacks>BAG_LIMITS.materials?'capacity':null;
}
export function quoteRedeemCode(s,input){
 const code=typeof input==='string'?input.trim().toUpperCase():'';
 const entry=Object.hasOwn(TEST_REDEEM_CODES,code)?TEST_REDEEM_CODES[code]:null;
 const fail=reason=>({ok:false,reason,code,rewards:[]});
 if(!entry)return fail('invalid-code');
 if(!validSave(s)||s.developmentEquipmentSandbox)return fail('invalid-state');
 const rewards=entry.rewards,error=checkRedeemCapacity(s,rewards);if(error)return fail(error);
 const gold=entry.gold??0;
 if(gold&&(!Number.isFinite(s.gold+gold)||s.gold+gold>1e12))return fail('gold-limit');
 if(entry.equipment&&!canReceiveEquipment(s,entry.equipment.slot))return fail('amulet-capacity');
 const equipment=entry.equipment?{...entry.equipment,level:s.level,baseLevel:s.level,levelSource:'generated'}:null;
 return {ok:true,reason:null,code,rewards,gold,equipment,unlocksInfinityGauntletRecipe:entry.unlocksInfinityGauntletRecipe??false};
}
// No random ID draw or new save ledger: keep current and reserved item IDs distinct.
function nextTestEquipmentId(s){
 const reserved=[...s.inventory,...(s.merchant?.offers??[]).map(o=>o.item),s.pendingForgeClaim?.item,...(s.otherworld?.pendingEquipment??[]),...(s.rareRewardProgress?.pendingSets??[])];
 const ids=new Set(reserved.filter(Boolean).map(it=>it.id));let serial=1;
 while(ids.has('test-lucky-dice-'+serial))serial++;
 return 'test-lucky-dice-'+serial;
}
// Preflight the whole bundle before any mutation. Caller persists a clone before adoption.
export function redeemCode(s,input){
 const quote=quoteRedeemCode(s,input);if(!quote.ok)return false;
 const equipment=quote.equipment?createLegendaryEquipment({id:nextTestEquipmentId(s),...quote.equipment,affixDefs:AFFIX_DEFS}):null;
 if(quote.equipment&&!equipment)return false;
 if(quote.rewards.length)normalizeMaterials(s);
 for(const r of quote.rewards)s.materialStacks[r.key]=(s.materialStacks[r.key]??0)+r.count;
 for(const r of quote.rewards)recordMaterialDiscovered(s,r.material);
 if(quote.gold)s.gold+=quote.gold;
 if(equipment){s.inventory.push(equipment);recordCollectedEquipment(s,equipment);}
 if(quote.unlocksInfinityGauntletRecipe){
  s.infinityGauntlet??={version:1,recipeLearned:true,crafted:false,craftedItemId:null};
  s.infinityGauntlet.recipeLearned=true;
 }
 return quote;
}
