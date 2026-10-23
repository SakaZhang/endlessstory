// Display-only ephemeral queue. Never serialize with gameplay state.
// No RNG, wall clock, game clock, log parsing, mutation of supplied records or assets.
const kinds=new Set(['cast','hit','dot','poison','legend','heal','counter','shield']);
const elements=new Set(['physical','earth','water','fire','wind','light','dark']);
const id=x=>typeof x==='string'&&x.length>0&&x.length<=240;
const number=x=>Number.isFinite(x)&&Math.abs(x)<=1e12;
const clone=x=>structuredClone(x);
export function validDisplayEvent(e){
 if(!e||typeof e!=='object'||Array.isArray(e)||!id(e.eventId)||!id(e.battleId)||!id(e.castId)||!id(e.sourceId)||!id(e.targetId)||!kinds.has(e.kind))return false;
 if(e.hitId!==null&&!id(e.hitId)||e.skillId!==null&&!id(e.skillId)||e.element!==null&&!elements.has(e.element))return false;
 if(typeof e.crit!=='boolean'||!['hit','miss','none'].includes(e.outcome)||!Number.isSafeInteger(e.segmentIndex)||e.segmentIndex<0||e.segmentIndex>1000)return false;
 if(!number(e.hpDelta)||!number(e.shieldDelta)||!number(e.combatAt)||e.combatAt<0)return false;
 if(e.kind==='cast'&&(e.hpDelta!==0||e.shieldDelta!==0||e.outcome!=='none'||e.crit))return false;
 if(e.outcome==='miss'&&(e.hpDelta!==0||e.shieldDelta!==0||e.crit))return false;
 if(e.kind==='poison'&&(e.element!==null||e.crit))return false;
 if(e.kind==='heal'&&(e.hpDelta<0||e.shieldDelta!==0))return false;
 if(e.kind==='shield'&&(e.hpDelta!==0||e.shieldDelta<0))return false;
 if(['hit','dot','poison','legend','counter'].includes(e.kind)&&(e.hpDelta>0||e.shieldDelta>0))return false;
 return true;
}
/** Single UI consumer, explicit battle/session lifecycle. Returned events are detached copies.
 * emitBatch is atomic. Duplicate event IDs are ignored until endBattle/session reset.
 * No hidden FIFO trimming: if pending limit is exceeded, reject whole batch and expose reason.
 */
export function createCombatDisplayQueue({maxPending=4096,segmentDelayMs=70}={}){
 if(!Number.isInteger(maxPending)||maxPending<1||!Number.isInteger(segmentDelayMs)||segmentDelayMs<0||segmentDelayMs>1000)throw Error('Invalid display queue options');
 let battleId=null,pending=[],seen=new Set(),sequence=0,suppressed=false;
 const clear=()=>{pending=[];seen.clear();sequence=0;};
 return Object.freeze({
  beginBattle(idValue,{offline=false}={}){if(!id(idValue))return false;clear();battleId=idValue;suppressed=!!offline;return true;},
  emitBatch(events){
   if(!Array.isArray(events)||!battleId||!events.every(e=>validDisplayEvent(e)&&e.battleId===battleId))return {ok:false,reason:'invalid-event',accepted:0};
   if(suppressed)return {ok:true,reason:'offline-suppressed',accepted:0};
   const unique=[],batchIds=new Set();for(const event of events)if(!seen.has(event.eventId)&&!batchIds.has(event.eventId)){batchIds.add(event.eventId);unique.push(event);}
   if(pending.length+unique.length>maxPending)return {ok:false,reason:'display-capacity',accepted:0};
   for(const event of unique){const next=clone(event);next.sequence=++sequence;next.displayDelayMs=event.segmentIndex*segmentDelayMs;seen.add(event.eventId);pending.push(next);}
   return {ok:true,accepted:unique.length};
  },
  consume(){const batch=pending;pending=[];return clone(batch);},
  discardPending(){pending=[];},
  endBattle(){clear();battleId=null;suppressed=false;},
  // Restore/import/offline catch-up never restores or reconstructs historical visuals.
  resetSession(){clear();battleId=null;suppressed=false;},
  get pendingCount(){return pending.length;},
 });
}
