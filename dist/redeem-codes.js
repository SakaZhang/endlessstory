// Local test convenience, not an account service or a protected paid-code system.
import {INFINITY_GAUNTLET_MATERIALS} from './infinity-gauntlet-content.js';
import {MATERIALS,validSave,normalizeMaterials} from './engine.js';
import {BAG_LIMITS,bagCounts} from './inventory-schema.js';
import {recordMaterialDiscovered} from './region-navigation-state.js';
export const TEST_REDEEM_CODES=Object.freeze({INFINITY5:Object.freeze({testOnly:true,unlocksInfinityGauntletRecipe:false,rewards:Object.freeze(INFINITY_GAUNTLET_MATERIALS.map(({material})=>Object.freeze({material,quality:3,count:1,key:material+'|3',name:MATERIALS[material].name})))})});
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
 return {ok:true,reason:null,code,rewards,unlocksInfinityGauntletRecipe:entry.unlocksInfinityGauntletRecipe};
}
// Preflight the whole bundle before any mutation. Caller persists a clone before adoption.
export function redeemCode(s,input){
 const quote=quoteRedeemCode(s,input);if(!quote.ok)return false;
 normalizeMaterials(s);
 for(const r of quote.rewards)s.materialStacks[r.key]=(s.materialStacks[r.key]??0)+r.count;
 for(const r of quote.rewards)recordMaterialDiscovered(s,r.material);
 if(quote.unlocksInfinityGauntletRecipe){
  s.infinityGauntlet??={version:1,recipeLearned:true,crafted:false,craftedItemId:null};
  s.infinityGauntlet.recipeLearned=true;
 }
 return quote;
}
