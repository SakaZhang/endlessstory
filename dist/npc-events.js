import {RACIAL_NPC_EVENTS} from './racial-npc-event-content.js';
import {worldInventoryKey} from './world-materials.js';
import {RETURN_RING_EVENTS} from './return-ring-content.js';
import {CHIK_FAMILY_EVENTS} from './chik-family-events.js';
import {AREAS,INSTANCES,instanceCooldownMs} from './location-schema.js';
import {territoryAccess,nodeAccess} from './war-diplomacy.js';
const freeze=o=>{if(o&&typeof o==='object'){Object.values(o).forEach(freeze);Object.freeze(o);}return o;};
const canonicalRows=rows=>rows.map(row=>({...row,key:(worldInventoryKey(row.key.split('|')[0])??row.key.split('|')[0])+'|'+row.key.split('|')[1]}));
const content=[...RETURN_RING_EVENTS,...RACIAL_NPC_EVENTS,...CHIK_FAMILY_EVENTS].map(d=>({...d,materials:canonicalRows(d.materials??(d.objective?.kind==='materials'?d.objective.materials??[]:[])),rewards:(d.rewards??[]).map(row=>row.kind==='material'?{...row,key:(worldInventoryKey(row.key.split('|')[0])??row.key.split('|')[0])+'|'+row.key.split('|')[1]}:row)}));
export const NPC_EVENTS=freeze(Object.fromEntries(content.map(d=>[d.id,d])));
export const npcEventCosts=def=>def.materials??[];
const plain=o=>!!o&&typeof o==='object'&&!Array.isArray(o);
const time=n=>Number.isSafeInteger(n)&&n>=0&&n<=1e15;
const known=id=>typeof id==='string'&&Object.hasOwn(NPC_EVENTS,id);
export function hasStoryFlag(s,flag){return Array.isArray(s?.story?.flags)&&s.story.flags.includes(flag);}
// Definition-only gates. No new save field or quest-state version is needed.
const scenePrerequisites=(s,def)=>(def.conditions?.requiredStorySceneIds??[]).every(id=>s.story?.completedScenes?.includes(id));
const personalHistoryValid=(s,id,e)=>{
 const def=NPC_EVENTS[id];if(!def?.playerRace)return true;
 return s.race===def.playerRace&&scenePrerequisites(s,def)&&hasStoryFlag(s,def.requiresStoryFlag)&&(e.status!=='resolved'||def.choices.some(c=>c.id===e.choiceId));
};
export function npcClaimKey(s,id){const def=NPC_EVENTS[id],entry=s.npcEvents?.entries?.[id];return def?.repeatable?id+'.cycle-'+(entry?.cycle??0):id;}
export function validNpcEventState(s){
 if(!plain(s))return false;if(s.npcEvents===undefined)return true;
 const n=s.npcEvents;if(!plain(n)||Object.keys(n).length!==2||n.version!==1||!plain(n.entries)||Object.keys(n.entries).length>Object.keys(NPC_EVENTS).length)return false;
 return Object.entries(n.entries).every(([id,e])=>known(id)&&plain(e)&&Object.keys(e).length===7&&['active','resolved','declined'].includes(e.status)&&Number.isSafeInteger(e.count)&&e.count>=0&&e.count<= (NPC_EVENTS[id].objective?.count??0)&&Number.isSafeInteger(e.cycle)&&e.cycle>=0&&e.cycle<=9999&&time(e.readyAt)&&time(e.acceptedAt)&&(e.lastEncounterId===null||typeof e.lastEncounterId==='string'&&e.lastEncounterId.length<=160)&&(!NPC_EVENTS[id].repeatable?e.cycle===0:true)&&(e.choiceId===null||NPC_EVENTS[id].choices?.some(c=>c.id===e.choiceId))&&(e.status==='resolved')===(s.taskRewardClaims?.includes(npcClaimKey(s,id))===true)&&personalHistoryValid(s,id,e));
}
export function npcEventAccess(s,id){
 if(!known(id)||!validNpcEventState(s))return {allowed:false,reason:'事件不可用'};
 const def=NPC_EVENTS[id],access=territoryAccess(s,def.race);if(!access.allowed)return access;
 if(def.playerRace&&s.race!==def.playerRace)return {allowed:false,reason:'这是奇克与家人的私事'};
 if(def.requiresStoryFlag&&!hasStoryFlag(s,def.requiresStoryFlag))return {allowed:false,reason:'尚未到这段行程'};
 if(!scenePrerequisites(s,def))return {allowed:false,reason:'先完成这次回家的主线交谈'};
 if((def.conditions?.forbiddenStoryFlags??[]).some(flag=>hasStoryFlag(s,flag)))return {allowed:false,reason:'旧住处的家人小事暂缓；已有选择和记录仍保留'};
 if(!(s.areaProgress?.[def.race]?.unlocked??[1]).includes(AREAS[def.areaId]?.number))return {allowed:false,reason:'此地尚未开放'};
 if((def.conditions?.requiredEventIds??[]).some(key=>s.npcEvents?.entries?.[key]?.status!=='resolved')||(def.conditions?.requiredStoryFlags??[]).some(flag=>!hasStoryFlag(s,flag)))return {allowed:false,reason:'前事尚未完成'};
 if(s.siteId!==def.areaId)return {allowed:false,reason:'先前往'+(AREAS[def.areaId]?.name??def.areaId)};
 if(s.activeEncounter&&!s.activeEncounter.done||s.running)return {allowed:false,reason:'先结束当前远征'};
 if((s.restUntil??0)>(s.lastHealthClock??0))return {allowed:false,reason:'休息结束后再来交谈'};
 if(s.developmentEquipmentSandbox===true)return {allowed:false,reason:'测试角色不能领取任务'};
 if(def.rewardPolicyId&&def.rewardPolicyApproved!==true)return {allowed:false,reason:'家人事件的奖励方案待确认，暂不开放接取与结算'};
 return {allowed:true,reason:''};
}
export function npcEventReady(s,id){
 const def=NPC_EVENTS[id],e=s.npcEvents?.entries?.[id];if(!def||e?.status!=='active'||!npcEventAccess(s,id).allowed)return false;
 if(def.choices?.length&&!def.choices.some(c=>c.id===e.choiceId))return false;
 if(['victory','exploration'].includes(def.objective?.kind)&&e.count<def.objective.count)return false;
 const costs=npcEventCosts(def),totals={};for(const row of costs)totals[row.key]=(totals[row.key]??0)+row.quantity;
 return Object.entries(totals).every(([key,n])=>(s.materialStacks?.[key]??0)>=n);
}
export function beginNpcEvent(s,id,now=Date.now()){
 if(!time(now)||!npcEventAccess(s,id).allowed)return false;
 const def=NPC_EVENTS[id],old=s.npcEvents?.entries?.[id];
 if(old?.cycle>=9999)return false;
 if(old&&(old.status==='active'||old.status==='declined'||!def.repeatable||now<old.readyAt))return false;
 if(!old&&s.taskRewardClaims?.includes(id))return false;
 s.npcEvents??={version:1,entries:{}};
 s.npcEvents.entries[id]={status:'active',count:0,cycle:old?old.cycle+1:0,readyAt:0,acceptedAt:now,lastEncounterId:null,choiceId:null};return true;
}
export function declineNpcEvent(s,id){
 if(!npcEventAccess(s,id).allowed||s.taskRewardClaims?.includes(npcClaimKey(s,id)))return false;
 if(NPC_EVENTS[id].decline?.permanent===false||!NPC_EVENTS[id].requiresStoryFlag)return true;
 const old=s.npcEvents?.entries?.[id];if(old?.status==='declined'||old?.status==='resolved')return false;
 s.npcEvents??={version:1,entries:{}};s.npcEvents.entries[id]={status:'declined',count:0,cycle:old?.cycle??0,readyAt:0,acceptedAt:old?.acceptedAt??0,lastEncounterId:null,choiceId:null};return true;
}
export function chooseNpcEventResponse(s,id,choiceId){const def=NPC_EVENTS[id],row=s.npcEvents?.entries?.[id];if(!npcEventAccess(s,id).allowed||row?.status!=='active'||!def?.choices?.some(c=>c.id===choiceId))return false;row.choiceId=choiceId;return true;}
// Called once by the genuine node-entry lifecycle inside the same candidate save as travel.
// A map preview, a historical explored-node ledger, or a story staging move never calls this.
// Only this genuine entry receipt uses the engine event time (including bounded offline replay).
// Acceptance/readiness/reward claims above retain current-time territory gates.
export function recordNpcEventExploration(s,e,now){
 if(!time(now)||!validNpcEventState(s)||!s.npcEvents||s.activeEncounter!==e||!s.running||e?.developmentFixture||e?.storyScenario||e?.done||e?.rewarded||!INSTANCES[e?.instanceId]||e.areaId!==INSTANCES[e.instanceId].areaId||!nodeAccess(s,e.instanceId,now).allowed)return false;
 let changed=false;for(const [id,entry]of Object.entries(s.npcEvents.entries)){
  const def=NPC_EVENTS[id];if(entry.status!=='active'||def.objective?.kind!=='exploration'||entry.acceptedAt>now||!def.objective.nodeIds.includes(e.instanceId)||entry.lastEncounterId===e.id||entry.count>=def.objective.count)continue;
  entry.count++;entry.lastEncounterId=e.id;changed=true;
 }return changed;
}
// Called only by the actual successful settlement after its once-only reward guard.
// One victory counts once, not once per loot round, summoned unit or follower.
export function recordNpcEventVictory(s,e){
 if(!validNpcEventState(s)||!s.npcEvents||s.activeEncounter!==e||e?.developmentFixture||e?.storyScenario||!e?.done||!e?.win||!e?.rewarded||!INSTANCES[e.instanceId]||!e.enemies?.every(u=>u.hp===0))return false;
 let changed=false;for(const [id,entry]of Object.entries(s.npcEvents.entries)){
  const def=NPC_EVENTS[id];if(entry.status!=='active'||def.objective?.kind!=='victory'||!def.objective.nodeIds.includes(e.instanceId)||entry.lastEncounterId===e.id||entry.count>=def.objective.count)continue;
  entry.count++;entry.lastEncounterId=e.id;changed=true;
 }return changed;
}
export const NPC_TASK_REWARD_REGISTRY=freeze(Object.fromEntries(Object.values(NPC_EVENTS).map(def=>[def.id,{
 isEligible:s=>npcEventReady(s,def.id),materials:npcEventCosts(def),rewards:def.rewards??[],narrativeOnly:def.narrativeOnly===true,
 claimKey:s=>npcClaimKey(s,def.id),
 onClaim:(s,{now})=>{const e=s.npcEvents?.entries?.[def.id];if(!e||e.status!=='active')return false;e.status='resolved';e.readyAt=def.repeatable?now+instanceCooldownMs({kind:'dungeon'}):0;return true;}
}])));
