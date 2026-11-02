import {INFINITY_GAUNTLET_ID,INFINITY_GAUNTLET_MATERIALS} from './infinity-gauntlet-content.js';
import {validInfinityGauntletState} from './infinity-gauntlet-state.js';
import {validSave,legendaryItem,materialCount,normalizeMaterials,racialGoldCost,receiveBattleLoot,canReceiveEquipment,normalizeCodexCollection} from './engine.js';
import {rollMaterialFusionLevel} from './equipment-level-schema.js';
import {commitGameTransaction,SAVE_KEY} from './storage.js';
const keys=Object.freeze(INFINITY_GAUNTLET_MATERIALS.map(m=>m.material+'|3'));
function reason(s,inputs){
 if(!validSave(s)||!validInfinityGauntletState(s)||s.developmentEquipmentSandbox)return 'invalid-state';
 if(s.infinityGauntlet?.crafted)return 'already-crafted';
 if(s.pendingForgeClaim)return 'pending-forge';
 if(s.activeEncounter&&!s.activeEncounter.done||s.running)return 'in-battle';
 if(!Array.isArray(inputs)||inputs.length!==5||new Set(inputs).size!==5||!keys.every(k=>inputs.includes(k)))return 'ingredients';
 if(INFINITY_GAUNTLET_MATERIALS.some(m=>materialCount(s,m.material,3)<1))return 'materials';
 if(s.gold<racialGoldCost(s,40))return 'gold';return null;
}
export function quoteInfinityGauntletCraft(s,inputs=keys){const error=reason(s,inputs);return {ok:!error,reason:error,inputs:[...keys],gold:racialGoldCost(s,40)};}
const fingerprint=s=>{const x=structuredClone(s);delete x.lastSeen;delete x.offlineLuck;delete x.lastHealthClock;return JSON.stringify(x);};
// Service owns a fixed prepared result across failed storage writes.
// Prepared output stays fixed through storage failures; a full equipment bag uses
// the existing single pending forge slot and records manufacturing immediately.
export function createInfinityGauntletCraftService(){
 let prepared=null;
 return function craftInfinityGauntlet(storage,game,inputs=keys,{now=Date.now()}={}){
  const fail=why=>({ok:false,game,value:null,reason:why});
  if(!Number.isFinite(now)||now<0||now>1e15)return fail('invalid-clock');
  const why=reason(game,inputs);if(why)return fail(why);
  try{const stored=JSON.parse(storage.getItem(SAVE_KEY));if(!validSave(stored))return fail('invalid-saved-state');if(stored.infinityGauntlet?.crafted)return fail('already-crafted');if(JSON.stringify(stored)!==JSON.stringify(game))return fail('stale-state');}catch{return fail('storage-read');}
  const key=fingerprint(game);
  if(!prepared||prepared.key!==key){const lv=rollMaterialFusionLevel(game.level),item=lv&&legendaryItem(INFINITY_GAUNTLET_ID,lv.level,lv);if(!item)return fail('item-unavailable');prepared={key,item};}
  const item=structuredClone(prepared.item);
  const tx=commitGameTransaction(storage,game,next=>{
   if(reason(next,inputs))return false;
   normalizeMaterials(next);for(const key of keys)next.materialStacks[key]--;
   next.gold-=racialGoldCost(next,40);next.infinityGauntlet??={version:1,recipeLearned:true,crafted:false,craftedItemId:null};next.infinityGauntlet.crafted=true;next.infinityGauntlet.craftedItemId=item.id;
   const filters=next.lootFilters;next.lootFilters={equipment:[],materials:[],items:[]};
   if(canReceiveEquipment(next,item)){if(!receiveBattleLoot(next,{kind:'equipment',item}))return false;}
   else next.pendingForgeClaim={kind:'equipment',item};
   if(filters===undefined)delete next.lootFilters;else next.lootFilters=filters;
   normalizeCodexCollection(next);if(!validSave(next))return false;return item;
  },{now});
  if(tx.ok)prepared=null;return tx;
 };
}
export const craftInfinityGauntlet=createInfinityGauntletCraftService();
