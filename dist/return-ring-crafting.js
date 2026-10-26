import {RETURN_RING_ID,RETURN_RING_MATERIALS,RETURN_RING_DROP_POLICY} from './return-ring-content.js';
import {validReturnRingState,returnRingRecipeKnown,validReturnRingDropPolicy} from './return-ring-state.js';
import {validSave,legendaryItem,materialCount,normalizeMaterials,racialGoldCost,receiveBattleLoot,canReceiveEquipment,normalizeCodexCollection} from './engine.js';
import {rollMaterialFusionLevel} from './equipment-level-schema.js';
import {commitGameTransaction,SAVE_KEY} from './storage.js';
const keys=Object.freeze(RETURN_RING_MATERIALS.map(m=>m.material+'|3'));
function reason(s,inputs,policy){
 if(!validSave(s)||!validReturnRingState(s)||s.developmentEquipmentSandbox)return 'invalid-state';
 if(!returnRingRecipeKnown(s))return 'recipe-unknown';if(s.returnRing.crafted)return 'already-crafted';
 if(!validReturnRingDropPolicy(policy))return 'balance-unconfirmed';
 if(s.pendingForgeClaim)return 'pending-forge';
 if(s.activeEncounter&&!s.activeEncounter.done||s.running)return 'in-battle';
 if(!Array.isArray(inputs)||inputs.length!==5||new Set(inputs).size!==5||!keys.every(k=>inputs.includes(k)))return 'ingredients';
 if(RETURN_RING_MATERIALS.some(m=>materialCount(s,m.material,3)<1))return 'materials';
 if(s.gold<racialGoldCost(s,40))return 'gold';return null;
}
export function quoteReturnRingCraft(s,inputs=keys){const error=reason(s,inputs,RETURN_RING_DROP_POLICY);return {ok:!error,reason:error,inputs:[...keys],gold:racialGoldCost(s,40)};}
const fingerprint=s=>{const x=structuredClone(s);delete x.lastSeen;delete x.offlineLuck;delete x.lastHealthClock;return JSON.stringify(x);};
// Trusted test/config seam only, not re-exported by Engine or passed by the UI.
// Prepared output stays fixed through storage failures; a full equipment bag uses
// the existing single pending forge slot and records manufacturing immediately.
export function createReturnRingCraftService(policy=RETURN_RING_DROP_POLICY){
 const approved=structuredClone(policy);let prepared=null;
 return function craftReturnRing(storage,game,inputs=keys,{now=Date.now()}={}){
  const fail=why=>({ok:false,game,value:null,reason:why});
  if(!Number.isFinite(now)||now<0||now>1e15)return fail('invalid-clock');
  const why=reason(game,inputs,approved);if(why)return fail(why);
  try{const stored=JSON.parse(storage.getItem(SAVE_KEY));if(!validSave(stored))return fail('invalid-saved-state');if(stored.returnRing?.crafted)return fail('already-crafted');if(JSON.stringify(stored)!==JSON.stringify(game))return fail('stale-state');}catch{return fail('storage-read');}
  const key=fingerprint(game);
  if(!prepared||prepared.key!==key){const lv=rollMaterialFusionLevel(game.level),item=lv&&legendaryItem(RETURN_RING_ID,lv.level,lv);if(!item)return fail('item-unavailable');prepared={key,item};}
  const item=structuredClone(prepared.item);
  const tx=commitGameTransaction(storage,game,next=>{
   if(reason(next,inputs,approved))return false;
   normalizeMaterials(next);for(const key of keys)next.materialStacks[key]--;
   next.gold-=racialGoldCost(next,40);next.returnRing.crafted=true;next.returnRing.craftedItemId=item.id;
   const filters=next.lootFilters;next.lootFilters={equipment:[],materials:[],items:[]};
   if(canReceiveEquipment(next,item)){if(!receiveBattleLoot(next,{kind:'equipment',item}))return false;}
   else next.pendingForgeClaim={kind:'equipment',item};
   if(filters===undefined)delete next.lootFilters;else next.lootFilters=filters;
   normalizeCodexCollection(next);if(!validSave(next))return false;return item;
  },{now});
  if(tx.ok)prepared=null;return tx;
 };
}
export const craftReturnRing=createReturnRingCraftService();
