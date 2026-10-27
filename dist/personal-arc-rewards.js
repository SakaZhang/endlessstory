import {validSave,item,SLOTS,receiveBattleLoot,effectiveLuck} from './engine.js';
import {createTaskRewardService} from './task-reward-transaction.js';
import {withMultiRng} from './multi-combat.js';
import {commitGameTransaction,SAVE_KEY} from './storage.js';

export const PERSONAL_ARC_REWARDS=Object.freeze(Object.fromEntries([
 ['dwarf','coup','08'],['human','duty','06'],['elf','heir','06'],['goblin','family','04'],['ashen','agency','06']
].map(([race,name,end])=>{const id=`personal.${race}.${name}`;return [id,Object.freeze({id,race,finalSceneId:`${id}.${end}`,claimId:`personal.reward.${id}`})];})));
// One identical budget per branch; finals use the separate slot-selectable gear claim.
export const PERSONAL_EVENT_REWARDS=Object.freeze(Object.fromEntries(Object.values(PERSONAL_ARC_REWARDS).flatMap(d=>{
 const end=Number(d.finalSceneId.split('.').at(-1));
 return Array.from({length:end-1},(_,i)=>{
  const number=i+1,id=`${d.id}.${String(number).padStart(2,'0')}`;
  const stage=d.race==='dwarf'?number===4:d.race!=='goblin'&&number===3;
  return [id,Object.freeze({id,race:d.race,tier:stage?'stage':'small',claimId:`personal.event.reward.${id}`,rewards:Object.freeze([Object.freeze(stage?{kind:'consumable',key:'reforgeToken',quantity:1}:{kind:'potion',key:'healing|0',quantity:2})])})];
 });
})));
export const personalArcRewardSlots=game=>SLOTS.filter(slot=>slot!=='core'||game?.race==='ashen');
const eligible=(s,d)=>s?.race===d.race&&s.story?.completedScenes?.includes(d.finalSceneId)===true;
const fail=(game,reason)=>({ok:false,game,value:null,reason});
const clockValid=(s,now)=>Number.isSafeInteger(now)&&now>=0&&now<=1e15&&now>=Math.max(s?.lastSeen??0,s?.lastHealthClock??0);
// Use the same ordinary item generator and its existing synchronous seeded RNG
// boundary as combat. No special reward stat tables or global crafting changes.
function generate(d,p){
 const rng={id:`arc-${d.id}-${p.seed}`,rngState:p.seed,rngDraws:0,itemSerial:0};
 return withMultiRng(rng,()=>{
  const min=Math.max(1,p.baseLevel-2),level=min+Math.floor(Math.random()*(p.baseLevel+2-min+1));
  return item(p.slot,level,null,3,{baseLevel:p.baseLevel,levelSource:'generated',originRace:d.race});
 });
}
export function validPersonalArcRewardState(s){
 try{
  const rows=s.personalArcRewards;
  if(rows!==undefined&&(!rows||typeof rows!=='object'||Array.isArray(rows)||Object.keys(rows).length>5))return false;
  const knownClaims=new Set([...Object.values(PERSONAL_ARC_REWARDS),...Object.values(PERSONAL_EVENT_REWARDS)].map(d=>d.claimId));
  if(s.taskRewardClaims?.some(id=>typeof id==='string'&&(id.startsWith('personal.reward.')||id.startsWith('personal.event.reward.'))&&!knownClaims.has(id)))return false;
  const ids=new Set();
  for(const [id,p] of Object.entries(rows??{})){
   const d=Object.hasOwn(PERSONAL_ARC_REWARDS,id)?PERSONAL_ARC_REWARDS[id]:null;
   if(!d||!eligible(s,d)||!p||typeof p!=='object'||Array.isArray(p)||Object.keys(p).some(k=>!['version','slot','baseLevel','seed','reservedAt','item'].includes(k))||p.version!==1||!personalArcRewardSlots(s).includes(p.slot)||!Number.isSafeInteger(p.baseLevel)||p.baseLevel<1||p.baseLevel>=100000||p.baseLevel>s.level||!Number.isSafeInteger(p.seed)||p.seed<0||p.seed>0xffffffff||!Number.isSafeInteger(p.reservedAt)||p.reservedAt<0||p.reservedAt>1e15||p.reservedAt>s.lastSeen||s.taskRewardClaims?.includes(d.claimId))return false;
   const expected=generate(d,p);
   if(p.item!==undefined&&JSON.stringify(p.item)!==JSON.stringify(expected))return false;
   if(ids.has(expected.id)||s.inventory?.some(it=>it.id===expected.id)||s.pendingForgeClaim?.item?.id===expected.id||s.merchant?.offers?.some(o=>o.stock===1&&o.item?.id===expected.id))return false;
   ids.add(expected.id);
  }
  for(const d of Object.values(PERSONAL_EVENT_REWARDS))if(s.taskRewardClaims?.includes(d.claimId)&&(s.race!==d.race||!s.story?.completedScenes?.includes(d.id)))return false;
  for(const d of Object.values(PERSONAL_ARC_REWARDS))if(s.taskRewardClaims?.includes(d.claimId)&&!eligible(s,d))return false;
  return true;
 }catch{return false;}
}
export function personalArcRewardStatus(game,id){
 const d=Object.hasOwn(PERSONAL_ARC_REWARDS,id)?PERSONAL_ARC_REWARDS[id]:null;if(!d||!eligible(game,d))return {status:'locked'};
 if(game.taskRewardClaims?.includes(d.claimId))return {status:'claimed'};
 const pending=game.personalArcRewards?.[id];
 return {status:pending?'pending':'ready',slot:pending?.slot,item:pending?.item?structuredClone(pending.item):null,baseLevel:pending?.baseLevel};
}
function current(storage,game,d){
 try{
  const saved=JSON.parse(storage.getItem(SAVE_KEY));
  if(!validSave(saved))return 'invalid-saved-state';
  if(saved.taskRewardClaims?.includes(d.claimId))return 'already-claimed';
  if(JSON.stringify(saved)!==JSON.stringify(game))return 'stale-state';
 }catch{return 'storage-read';}
 return null;
}
/** Always adopt result.game, including failure: reservation/result can have been
 * durably saved before a full bag or a later storage failure. Never auto-save the
 * pre-call snapshot over it. Caller must flush gameplay before invoking this API.
 * This is synchronous localStorage snapshot checking, not cross-tab CAS.
 */
export function claimPersonalArcReward(storage,game,id,slot,{now=Date.now()}={}){
 const d=Object.hasOwn(PERSONAL_ARC_REWARDS,id)?PERSONAL_ARC_REWARDS[id]:null;if(!d)return fail(game,'not-available');
 if(!clockValid(game,now))return fail(game,'invalid-clock');
 if(!validSave(game)||game.developmentEquipmentSandbox)return fail(game,'invalid-state');
 if(game.taskRewardClaims?.includes(d.claimId))return fail(game,'already-claimed');
 let reason=current(storage,game,d);if(reason)return fail(game,reason);
 if(!eligible(game,d))return fail(game,'not-ready');
 if(game.running||game.dungeonRun||(game.activeEncounter&&!game.activeEncounter.rewarded)||game.story?.activeScene||(game.restUntil??0)>now)return fail(game,'busy');
 let p=game.personalArcRewards?.[id];
 if(p&&slot!==undefined&&slot!==p.slot)return fail(game,'slot-locked');
 if(!p&&!personalArcRewardSlots(game).includes(slot))return fail(game,'invalid-slot');
 // Reserve first. No equipment is rolled or revealed until its seed, selected
 // slot and CURRENT hero level are durable. A failed reservation reveals no roll.
 if(!p){
  const tx=commitGameTransaction(storage,game,next=>{
   next.lastSeen=now;next.personalArcRewards??={};next.personalArcRewards[id]={version:1,slot,baseLevel:next.level,seed:Math.floor(Math.random()*2**32),reservedAt:now};
   return validSave(next)&&{arcId:id,reserved:true};
  },{now});
  if(!tx.ok)return tx;game=tx.game;p=game.personalArcRewards[id];
 }
 // Materialize before even inspecting capacity. Reload after either intermediate
 // write reconstructs exactly the same result, never another RNG roll.
 if(!p.item){
  reason=current(storage,game,d);if(reason)return fail(game,reason);
  const tx=commitGameTransaction(storage,game,next=>{
   next.personalArcRewards[id].item=generate(d,next.personalArcRewards[id]);
   return validSave(next)&&{arcId:id,prepared:true};
  },{now});
  if(!tx.ok)return tx;game=tx.game;p=game.personalArcRewards[id];
 }
 reason=current(storage,game,d);if(reason)return fail(game,reason);
 const tx=commitGameTransaction(storage,game,next=>{
  const filters=next.lootFilters;next.lootFilters={equipment:[],materials:[],items:[]};
  if(!receiveBattleLoot(next,{kind:'equipment',item:structuredClone(p.item)}))return false;
  if(filters===undefined)delete next.lootFilters;else next.lootFilters=filters;
  delete next.personalArcRewards[id];
  next.taskRewardClaims=[...(next.taskRewardClaims??[]),d.claimId];
  next.lastSeen=now;next.offlineLuck=effectiveLuck(next);
  return validSave(next)&&{arcId:id,claimId:d.claimId,itemId:p.item.id};
 },{now});
 return !tx.ok&&tx.reason==='rejected'?{...tx,reason:'reward-unavailable'}:tx;
}

const eventService=createTaskRewardService(Object.fromEntries(Object.values(PERSONAL_EVENT_REWARDS).map(d=>[d.id,{
 isEligible:s=>s.race===d.race&&s.story?.completedScenes?.includes(d.id)===true,
 claimKey:()=>d.claimId,materials:[],rewards:d.rewards
}])));
export function claimPersonalEventReward(storage,game,eventId,{now=Date.now()}={}){
 if(!Object.hasOwn(PERSONAL_EVENT_REWARDS,eventId))return fail(game,'not-available');
 if(!clockValid(game,now))return fail(game,'invalid-clock');
 if(!validSave(game)||game.developmentEquipmentSandbox)return fail(game,'invalid-state');
 if(game.running||game.dungeonRun||(game.activeEncounter&&!game.activeEncounter.rewarded)||game.story?.activeScene||(game.restUntil??0)>now)return fail(game,'busy');
 return eventService(storage,game,eventId,{now});
}
