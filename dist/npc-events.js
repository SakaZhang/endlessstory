import {RACIAL_NPC_EVENTS} from './racial-npc-event-content.js';
import {NPC_OBJECTIVE_CONTENT} from './npc-objective-content.js';
import {worldInventoryKey} from './world-materials.js';
import {RETURN_RING_EVENTS} from './return-ring-content.js';
import {CHIK_FAMILY_EVENTS} from './chik-family-events.js';
import {CHIK_FAMILY_REWARD_POLICY,CHIK_FAMILY_MILESTONE} from './chik-family-event-rewards.js';
import {AREAS,INSTANCES,instanceCooldownMs} from './location-schema.js';
import {territoryAccess,nodeAccess} from './war-diplomacy.js';
const freeze=o=>{if(o&&typeof o==='object'){Object.values(o).forEach(freeze);Object.freeze(o);}return o;};
const canonicalRows=rows=>rows.map(row=>({...row,key:(worldInventoryKey(row.key.split('|')[0])??row.key.split('|')[0])+'|'+row.key.split('|')[1]}));
const content=[...RETURN_RING_EVENTS,...RACIAL_NPC_EVENTS,...CHIK_FAMILY_EVENTS].map(d=>({...d,...(NPC_OBJECTIVE_CONTENT[d.id]??{}),materials:canonicalRows(d.materials??(d.objective?.kind==='materials'?d.objective.materials??[]:[])),rewards:(d.rewards??[]).map(row=>row.kind==='material'?{...row,key:(worldInventoryKey(row.key.split('|')[0])??row.key.split('|')[0])+'|'+row.key.split('|')[1]}:row)}));
export const NPC_EVENTS=freeze(Object.fromEntries(content.map(d=>[d.id,d])));
// New objective contracts live beside, never overwrite, the shipped seven-key ledger.
// A save without an objective record is an old active contract until its next cycle.
const MODERN_CONTRACT_MARKER='npc-objective-contract:v2';
export const npcEventIsModern=(s,id)=>s?.npcEvents?.entries?.[id]?.lastEncounterId===MODERN_CONTRACT_MARKER&&s?.npcObjectiveProgress?.entries?.[id]?.version===2;
const previewModern=(s,id)=>NPC_EVENTS[id]?.objectiveVersion===2&&(!s?.npcEvents?.entries?.[id]||npcEventIsModern(s,id));
export const npcEventDefinition=(s,id)=>{const d=NPC_EVENTS[id];return d&&previewModern(s,id)?{...d,objective:d.taskObjective,materials:d.taskObjective.kind==='collect'?canonicalRows(d.taskObjective.materials):[],rewards:npcEventRewards(d,s),description:d.taskDescription??d.description,dialogue:d.taskDialogue??d.dialogue,completion:d.taskCompletion??d.completion,choices:[],modern:true}:d;};
export const npcEventObjective=(s,id)=>npcEventDefinition(s,id)?.objective;
export const npcEventCosts=(def,s)=>s&&previewModern(s,def.id)?(def.taskObjective?.kind==='collect'?canonicalRows(def.taskObjective.materials):[]):def.materials??[];
export const npcEventRewards=(def,s)=>(s&&previewModern(s,def.id)?def.taskRewards??def.rewards??[]:def.rewards??[]).map(row=>row.kind==='material'?{...row,key:(worldInventoryKey(row.key.split('|')[0])??row.key.split('|')[0])+'|'+row.key.split('|')[1]}:row);
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
const hasTaskClaim=(s,id)=>Array.isArray(s.taskRewardClaims)&&s.taskRewardClaims.includes(id);
export const completedFamilyEventCount=s=>CHIK_FAMILY_MILESTONE.requiresEventIds.filter(id=>s.npcEvents?.entries?.[id]?.status==='resolved'&&NPC_EVENTS[id].choices.some(c=>c.id===s.npcEvents.entries[id].choiceId)&&hasTaskClaim(s,id)).length;
export function npcClaimKey(s,id){const def=NPC_EVENTS[id],entry=s.npcEvents?.entries?.[id];return def?.repeatable?id+'.cycle-'+(entry?.cycle??0):id;}
const exactKeys=(o,keys)=>plain(o)&&Object.keys(o).length===keys.length&&keys.every(k=>Object.hasOwn(o,k));
const uniqueStrings=(rows,max)=>Array.isArray(rows)&&rows.length<=max&&new Set(rows).size===rows.length&&Array.from(rows).every(x=>typeof x==='string'&&x.length>0&&x.length<=160);
function validNpcObjectiveProgress(s){
 const state=s.npcObjectiveProgress;
 if(Object.values(s.npcEvents?.entries??{}).some(e=>e?.lastEncounterId===MODERN_CONTRACT_MARKER)&&state===undefined)return false;
 if(state===undefined)return true;
 if(Object.entries(s.npcEvents?.entries??{}).some(([id,e])=>e?.lastEncounterId===MODERN_CONTRACT_MARKER&&!Object.hasOwn(state?.entries??{},id)))return false;
 if(!exactKeys(state,['version','entries'])||state.version!==1||!plain(state.entries)||Object.keys(state.entries).length>Object.keys(NPC_EVENTS).length)return false;
 return Object.entries(state.entries).every(([id,p])=>{
  const d=NPC_EVENTS[id],e=s.npcEvents?.entries?.[id],o=d?.taskObjective;
  if(!e||d.objectiveVersion!==2||!o||!exactKeys(p,['version','cycle','count','checkpoints','receipts'])||p.version!==2||p.cycle!==e.cycle||!Number.isSafeInteger(p.count)||p.count<0||e.choiceId!==null||e.count!==0||e.lastEncounterId!==MODERN_CONTRACT_MARKER||!uniqueStrings(p.checkpoints,o.checkpoints?.length??0)||!uniqueStrings(p.receipts,o.kind==='kill'?o.count:0))return false;
  if(o.kind==='kill')return p.count<=o.count&&p.count>=p.receipts.length&&p.count<=p.receipts.length*3&&(!p.count||p.receipts.length>0)&&(e.status!=='resolved'||p.count===o.count);
  if(o.kind==='investigate')return p.count===p.checkpoints.length&&p.checkpoints.every(id=>o.checkpoints.some(c=>c.id===id))&&(e.status!=='resolved'||p.count===o.checkpoints.length);
  return o.kind==='collect'&&p.count===0;
 });
}
// Persisted combat receipt is produced only by engine start/step, never by UI.
// It captures both the accepted cycle and the exact initial units; summoned and
// follower units cannot be inserted, and a mock victory without a receipt is inert.
function validNpcEncounterReceipt(s){
 const e=s.activeEncounter,r=e?.npcObjectiveReceipt;if(r===undefined)return true;
 if(!exactKeys(r,['version','startedAt','tasks','initialUnitIds','defeatedUnitIds'])||r.version!==1||!time(r.startedAt)||!plain(r.tasks)||Object.keys(r.tasks).length>Object.keys(NPC_EVENTS).length||!uniqueStrings(r.initialUnitIds,3)||!uniqueStrings(r.defeatedUnitIds,3)||!Array.isArray(e.enemies)||e.developmentFixture||e.storyScenario||e.contentVersion!=='dwarf-m2-v1')return false;
 if(!r.initialUnitIds.every(id=>e.enemies.some(u=>u.id===id&&u.origin==='initial'&&!u.follower&&u.sourceInstanceId===e.instanceId))||!r.defeatedUnitIds.every(id=>r.initialUnitIds.includes(id)&&e.enemies.some(u=>u.id===id&&u.hp===0)))return false;
 return Object.entries(r.tasks).every(([id,row])=>{const d=NPC_EVENTS[id],p=s.npcObjectiveProgress?.entries?.[id],entry=s.npcEvents?.entries?.[id];return d?.taskObjective?.kind==='kill'&&p&&entry?.status==='active'&&exactKeys(row,['cycle','acceptedAt'])&&row.cycle===p.cycle&&row.acceptedAt===entry.acceptedAt&&row.acceptedAt<=r.startedAt&&d.taskObjective.nodeIds.includes(e.instanceId);});
}
export function npcEventObjectiveProgress(s,id){
 const d=NPC_EVENTS[id],entry=s.npcEvents?.entries?.[id],modern=previewModern(s,id),o=npcEventObjective(s,id),p=s.npcObjectiveProgress?.entries?.[id];
 if(!d||!o)return {modern:false,kind:null,count:0,target:0,complete:false,checkpoints:[],materials:[]};
 const materials=npcEventCosts(d,s).map(row=>({...row,owned:s.materialStacks?.[row.key]??0})),checkpoints=(o.checkpoints??[]).map(c=>({...c,complete:p?.checkpoints.includes(c.id)??false}));
 const target=o.kind==='investigate'?checkpoints.length:o.kind==='collect'?materials.reduce((n,r)=>n+r.quantity,0):o.count??0;
 const count=o.kind==='collect'?materials.reduce((n,r)=>n+Math.min(r.owned,r.quantity),0):modern?p?.count??0:entry?.count??0;
 const complete=modern?(o.kind==='collect'?materials.every(r=>r.owned>=r.quantity):count>=target):(!d.choices?.length||d.choices.some(c=>c.id===entry?.choiceId))&&(!['victory','exploration'].includes(o.kind)||count>=target)&&materials.every(r=>r.owned>=r.quantity);
 return {modern,kind:o.kind,count,target,complete,checkpoints,materials};
}
export function npcInvestigationAccess(s,id,checkpointId,now=Date.now()){
 if(!time(now)||!validNpcEventState(s)||!npcEventIsModern(s,id)||s.npcEvents.entries[id]?.status!=='active')return {allowed:false,reason:'先接取这项调查'};
 const d=NPC_EVENTS[id],o=d.taskObjective,p=s.npcObjectiveProgress.entries[id],checkpoint=o.kind==='investigate'&&o.checkpoints.find(c=>c.id===checkpointId);
 if(!checkpoint)return {allowed:false,reason:'调查点不可用'};
 if(p.checkpoints.includes(checkpointId))return {allowed:false,reason:'此处已调查'};
 if(s.npcEvents.entries[id].acceptedAt>now)return {allowed:false,reason:'任务时间尚未到达'};
 const area=AREAS[checkpoint.areaId??INSTANCES[checkpoint.nodeId]?.areaId];
 if(!area||checkpoint.nodeId&&!INSTANCES[checkpoint.nodeId]?.enabled)return {allowed:false,reason:'调查点尚未开放'};
 // Investigation is a present-time explicit action, never historical replay.
 const access=territoryAccess(s,area.race);if(!access.allowed)return access;
 if(!(s.areaProgress?.[area.race]?.unlocked??[1]).includes(area.number))return {allowed:false,reason:'调查区域尚未开放'};
 if(s.siteId!==area.id)return {allowed:false,reason:'先前往'+area.name};
 if(s.activeEncounter&&!s.activeEncounter.done||s.running||(s.restUntil??0)>(s.lastHealthClock??0)||s.developmentEquipmentSandbox)return {allowed:false,reason:'结束远征并休息完，再仔细调查'};
 return {allowed:true,reason:''};
}
export function investigateNpcEvent(s,id,checkpointId,now=Date.now()){
 if(!npcInvestigationAccess(s,id,checkpointId,now).allowed)return false;
 const p=s.npcObjectiveProgress.entries[id];p.checkpoints.push(checkpointId);p.count=p.checkpoints.length;return true;
}
export function validNpcEventState(s){
 if(!plain(s)||!validNpcObjectiveProgress(s)||!validNpcEncounterReceipt(s))return false;
 // Newly authored family claims always require their matching resolved source.
 // Leave unrelated historical/unknown claim compatibility unchanged.
 if(CHIK_FAMILY_MILESTONE.requiresEventIds.some(id=>hasTaskClaim(s,id)&&s.npcEvents?.entries?.[id]?.status!=='resolved'))return false;
 if(hasTaskClaim(s,CHIK_FAMILY_MILESTONE.id)&&completedFamilyEventCount(s)!==CHIK_FAMILY_MILESTONE.requiresEventIds.length)return false;
 if(s.npcEvents===undefined)return true;
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
 if(!npcEventIsModern(s,id)&&def.choices?.length&&!def.choices.some(c=>c.id===e.choiceId))return false;
 if(!npcEventIsModern(s,id)&&['victory','exploration'].includes(def.objective?.kind)&&e.count<def.objective.count)return false;
 if(npcEventIsModern(s,id))return npcEventObjectiveProgress(s,id).complete;
 const costs=npcEventCosts(def,s),totals={};for(const row of costs)totals[row.key]=(totals[row.key]??0)+row.quantity;
 return Object.entries(totals).every(([key,n])=>(s.materialStacks?.[key]??0)>=n);
}
export function beginNpcEvent(s,id,now=Date.now()){
 if(!time(now)||!npcEventAccess(s,id).allowed)return false;
 const def=NPC_EVENTS[id],old=s.npcEvents?.entries?.[id];
 if(old?.cycle>=9999)return false;
 if(old&&(old.status==='active'||old.status==='declined'||!def.repeatable||now<old.readyAt))return false;
 // Historical paid ledgers may lack an entry. Never recreate a paid first
 // cycle (or invent a new cycle without its cooldown/history record).
 if(!old&&s.taskRewardClaims?.some(claim=>claim===id||def.repeatable&&claim.startsWith(id+'.cycle-')))return false;
 s.npcEvents??={version:1,entries:{}};
 s.npcEvents.entries[id]={status:'active',count:0,cycle:old?old.cycle+1:0,readyAt:0,acceptedAt:now,lastEncounterId:null,choiceId:null};
 if(def.objectiveVersion===2&&def.taskObjective){s.npcEvents.entries[id].lastEncounterId=MODERN_CONTRACT_MARKER;s.npcObjectiveProgress??={version:1,entries:{}};s.npcObjectiveProgress.entries[id]={version:2,cycle:s.npcEvents.entries[id].cycle,count:0,checkpoints:[],receipts:[]};}
 return true;
}
export function declineNpcEvent(s,id){
 if(!npcEventAccess(s,id).allowed||s.taskRewardClaims?.includes(npcClaimKey(s,id)))return false;
 if(NPC_EVENTS[id].decline?.permanent===false||!NPC_EVENTS[id].requiresStoryFlag)return true;
 const old=s.npcEvents?.entries?.[id];if(old?.status==='declined'||old?.status==='resolved')return false;
 s.npcEvents??={version:1,entries:{}};s.npcEvents.entries[id]={status:'declined',count:0,cycle:old?.cycle??0,readyAt:0,acceptedAt:old?.acceptedAt??0,lastEncounterId:npcEventIsModern(s,id)?MODERN_CONTRACT_MARKER:null,choiceId:null};return true;
}
export function chooseNpcEventResponse(s,id,choiceId){const def=NPC_EVENTS[id],row=s.npcEvents?.entries?.[id];if(!npcEventAccess(s,id).allowed||row?.status!=='active'||npcEventIsModern(s,id)||!def?.choices?.some(c=>c.id===choiceId))return false;row.choiceId=choiceId;return true;}
// Called once by the genuine node-entry lifecycle inside the same candidate save as travel.
// A map preview, a historical explored-node ledger, or a story staging move never calls this.
// Only this genuine entry receipt uses the engine event time (including bounded offline replay).
// Acceptance/readiness/reward claims above retain current-time territory gates.
export function recordNpcEventExploration(s,e,now){
 if(!time(now)||!validNpcEventState(s)||!s.npcEvents||s.activeEncounter!==e||!s.running||e?.developmentFixture||e?.storyScenario||e?.done||e?.rewarded||!INSTANCES[e?.instanceId]||e.areaId!==INSTANCES[e.instanceId].areaId||!nodeAccess(s,e.instanceId,now).allowed)return false;
 let changed=false;for(const [id,entry]of Object.entries(s.npcEvents.entries)){
  const def=NPC_EVENTS[id];if(entry.status!=='active'||npcEventIsModern(s,id)||def.objective?.kind!=='exploration'||entry.acceptedAt>now||!def.objective.nodeIds.includes(e.instanceId)||entry.lastEncounterId===e.id||entry.count>=def.objective.count)continue;
  entry.count++;entry.lastEncounterId=e.id;changed=true;
 }return changed;
}
// Called only by the actual successful settlement after its once-only reward guard.
// One victory counts once, not once per loot round, summoned unit or follower.
export function recordNpcEventVictory(s,e){
 if(!validNpcEventState(s)||!s.npcEvents||s.activeEncounter!==e||e?.developmentFixture||e?.storyScenario||!e?.done||!e?.win||!e?.rewarded||!INSTANCES[e.instanceId]||!e.enemies?.every(u=>u.hp===0))return false;
 let changed=false;for(const [id,entry]of Object.entries(s.npcEvents.entries)){
  const def=NPC_EVENTS[id];if(entry.status!=='active'||npcEventIsModern(s,id)||def.objective?.kind!=='victory'||!def.objective.nodeIds.includes(e.instanceId)||entry.lastEncounterId===e.id||entry.count>=def.objective.count)continue;
  entry.count++;entry.lastEncounterId=e.id;changed=true;
 }return changed;
}
// A separate sealed claim avoids losing an earned token if its item stack is
// full when the sixth scene completes. It is not a seventh quest/character.
export function familyMilestoneAccess(s){
 if(!validNpcEventState(s)||s.race!=='goblin'||!CHIK_FAMILY_REWARD_POLICY.approved)return {allowed:false,reason:'阶段补给不可用'};
 if(s.taskRewardClaims?.includes(CHIK_FAMILY_MILESTONE.id))return {allowed:false,reason:'阶段补给已领取'};
 if(completedFamilyEventCount(s)!==CHIK_FAMILY_MILESTONE.requiresEventIds.length)return {allowed:false,reason:'先完成六件家人小事'};
 const access=territoryAccess(s,'goblin');if(!access.allowed)return access;
 if(!['goblin.a01','goblin.a04'].includes(s.siteId)||!(s.areaProgress?.goblin?.unlocked??[1]).includes(AREAS[s.siteId]?.number))return {allowed:false,reason:'返回本族已开放的家人事件区域领取已整理的补给'};
 if(s.activeEncounter&&!s.activeEncounter.done||s.running||(s.restUntil??0)>(s.lastHealthClock??0)||s.developmentEquipmentSandbox)return {allowed:false,reason:'结束远征并休息完，再整理行囊'};
 return {allowed:true,reason:''};
}
export const NPC_TASK_REWARD_REGISTRY=freeze({...Object.fromEntries(Object.values(NPC_EVENTS).map(def=>[def.id,{
 isEligible:s=>npcEventReady(s,def.id),materials:s=>npcEventCosts(def,s),rewards:s=>npcEventRewards(def,s),narrativeOnly:s=>npcEventIsModern(s,def.id)?npcEventRewards(def,s).length===0:def.narrativeOnly===true,
 claimKey:s=>npcClaimKey(s,def.id),
 onClaim:(s,{now})=>{const e=s.npcEvents?.entries?.[def.id];if(!e||e.status!=='active')return false;e.status='resolved';e.readyAt=def.repeatable?now+instanceCooldownMs({kind:'dungeon'}):0;return true;}
}])),[CHIK_FAMILY_MILESTONE.id]:{
 isEligible:s=>familyMilestoneAccess(s).allowed,materials:[],rewards:CHIK_FAMILY_MILESTONE.rewards,narrativeOnly:false,
 onClaim:s=>familyMilestoneAccess(s).allowed
}});
