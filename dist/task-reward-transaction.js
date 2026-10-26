import {NPC_TASK_REWARD_REGISTRY} from './npc-events.js';
import {validSave,effectiveLuck,normalizeMaterials,parseMaterialKey,materialCount,MATERIALS,receiveBattleLoot} from './engine.js';
import {commitGameTransaction,SAVE_KEY} from './storage.js';

// Sealed authored content only; callers cannot inject a reward or eligibility.
export const TASK_REWARD_REGISTRY=NPC_TASK_REWARD_REGISTRY;
const idValid=id=>typeof id==='string'&&/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,127}$/.test(id);
export function validTaskRewardState(s){
 if(!s||typeof s!=='object'||Array.isArray(s))return false;
 const claims=s.taskRewardClaims;
 return claims===undefined||(Array.isArray(claims)&&claims.length<=10000&&Array.from(claims).every(idValid)&&new Set(claims).size===claims.length);
}
const failure=(game,reason)=>({ok:false,game,value:null,reason});

/** Internal content registration seam. Only trusted, approved definitions belong here.
 * A definition has isEligible(save), materials:[{key,quantity}], rewards:[loot].
 * Rewards are fixed records, not factories; no rerolls on capacity/storage retry.
 * Production registry stays empty until story specifications are approved.
 */
export function createTaskRewardService(registry=TASK_REWARD_REGISTRY){
 const definitions=Object.freeze(Object.fromEntries(Object.entries(registry).map(([id,def])=>[id,{
  isEligible:def.isEligible,
  materials:structuredClone(def.materials??[]),
  rewards:structuredClone(def.rewards??[]),
  narrativeOnly:def.narrativeOnly===true,claimKey:def.claimKey,onClaim:def.onClaim
 }])));
 return function claimTaskReward(storage,game,id,{now=Date.now()}={}){
  if(!idValid(id)||!Object.hasOwn(definitions,id))return failure(game,'not-available');
  if(!Number.isFinite(now)||now<0||now>1e15)return failure(game,'invalid-clock');
  if(!validTaskRewardState(game)||!validSave(game)||game.developmentEquipmentSandbox===true)return failure(game,'invalid-state');
  const def=definitions[id],claimId=typeof def.claimKey==='function'?def.claimKey(structuredClone(game)):id;
  if(!idValid(claimId))return failure(game,'invalid-definition');
  if(game.taskRewardClaims?.includes(claimId))return failure(game,'already-claimed');
  // Reject an already stale snapshot at submission. This synchronous localStorage
  // check is not cross-tab compare-and-swap or multi-writer serialization.
  // Callers must persist unsaved gameplay changes before submitting a task claim.
  try{
   const saved=JSON.parse(storage.getItem(SAVE_KEY));
   if(!validTaskRewardState(saved)||!validSave(saved))return failure(game,'invalid-saved-state');
   if(saved.taskRewardClaims?.includes(claimId))return failure(game,'already-claimed');
   if(JSON.stringify(saved)!==JSON.stringify(game))return failure(game,'stale-state');
  }catch{return failure(game,'storage-read');}
  let rejected='invalid-definition';
  const tx=commitGameTransaction(storage,game,next=>{
   if(typeof def.isEligible!=='function'||!Array.isArray(def.materials)||!Array.isArray(def.rewards)||(!def.rewards.length&&!(def.narrativeOnly&&typeof def.onClaim==='function')))return false;
   // Eligibility cannot mutate the candidate, and is re-evaluated at submission.
   if(def.isEligible(structuredClone(next))!==true){rejected='not-ready';return false;}
   if(!normalizeMaterials(next)){rejected='invalid-state';return false;}
   const costs=new Map();
   for(const row of def.materials){
    if(parseMaterialKey(row?.key)?.key!==row.key||!Number.isSafeInteger(row.quantity)||row.quantity<1)return false;
    const count=(costs.get(row.key)??0)+row.quantity;if(!Number.isSafeInteger(count))return false;costs.set(row.key,count);
   }
   for(const [key,count]of costs){if((next.materialStacks[key]??0)<count){rejected='materials';return false;}}
   for(const [key,count]of costs)next.materialStacks[key]-=count;
   // Task rewards ignore battle auto-discard; use the shared item validation,
   // capacity, collection and material-discovery paths on the isolated candidate.
   const filters=next.lootFilters;next.lootFilters={equipment:[],materials:[],items:[]};
   for(const record of def.rewards){
    const loot=structuredClone(record),qty=loot?.quantity??1;
    if(loot?.kind==='material'){
     const parsed=parseMaterialKey(loot.key);
     if(parsed&&MATERIALS[parsed.material]?.uniqueHeld&&
       (qty!==1||[0,1,2,3].some(q=>materialCount(next,parsed.material,q)>0))){rejected='unique-held';return false;}
    }
    if(!receiveBattleLoot(next,loot)){rejected='reward-unavailable';return false;}
   }
   if(filters===undefined)delete next.lootFilters;else next.lootFilters=filters;
   if(typeof def.onClaim==='function'&&def.onClaim(next,{now})!==true)return false;
   next.taskRewardClaims=[...(next.taskRewardClaims??[]),claimId];
   // Validate the exact metadata values the storage transaction will persist.
   next.lastSeen=now;next.offlineLuck=effectiveLuck(next);
   if(!validTaskRewardState(next)||!validSave(next)){rejected='invalid-state';return false;}
   return {taskId:id,claimId};
  },{now});
  return !tx.ok&&tx.reason==='rejected'?{...tx,reason:rejected}:tx;
 };
}
export const claimTaskReward=createTaskRewardService();
