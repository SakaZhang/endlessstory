import {nextEncounterRoute,validSave} from './engine.js';

// Browser-session-only intent. No callbacks, queues or resume tokens enter a save.
// The host MUST pump before starting the next encounter, and cancel on explicit
// Stop, withdrawal, import/restart or leaving the page. Existing battles and
// complete dungeon runs are never paused, discarded or reconstructed here.
export function idleActionBoundary(s,now=Date.now()){
 if(s.developmentEquipmentSandbox||s.activeEncounter?.developmentFixture)return 'sandbox';
 if(s.activeEncounter?.storyScenario&&!s.activeEncounter.rewarded)return 'story-combat';
 if((s.restUntil??0)>now||s.heroHp<=0)return 'rest';
 if(s.activeEncounter&&!s.activeEncounter.rewarded||s.dungeonRun)return s.running?'battle':'paused-battle';
 return 'ready';
}
function canResume(s,now){return !s.story?.activeScene&&!s.stopAfterBattle&&!s.stopAfterDungeon&&idleActionBoundary(s,now)==='ready'&&!!nextEncounterRoute(s,now);}
export function createIdleActionController({read,commit,now=()=>Date.now(),onResult=()=>{}}){
 let pending=null,held=null,serial=0,busy=false;
 const result=(status,extra={})=>({status,...extra});
 const notify=r=>{onResult(r);return r;};
 function cancel(){const changed=!!pending||!!held;pending=null;held=null;serial++;return result(changed?'canceled':'idle');}
 function stopAfterFailure(){
  try{return commit(next=>{next.running=false;next.restResume=false;return true;});}catch{return {ok:false,reason:'storage'};}
 }
 function pump(){
  if(!pending||busy)return result(pending?'busy':'idle');
  const state=read(),at=now(),boundary=idleActionBoundary(state,at);
  if(['sandbox','story-combat','paused-battle','rest'].includes(boundary)){const label=pending.label;cancel();if(boundary==='rest')stopAfterFailure();return notify(result('rejected',{label,reason:boundary}));}
  if(boundary!=='ready'||pending.waitForReady&&at<(state.nextBattleAt??0))return result('queued',{label:pending.label});
  const job={...pending,resume:pending.resume&&!state.stopAfterBattle&&!state.stopAfterDungeon},version=serial;busy=true;let tx;
  try{if(job.execute){
   tx=commit(next=>{if(idleActionBoundary(next,at)!=='ready')return false;next.running=false;next.restResume=false;return true;});
   if(tx?.ok){
    const executed=job.execute();
    if(executed&&typeof executed.then==='function')throw new Error('Idle actions must be synchronous');
    tx=executed?.ok?{ok:true,value:{value:executed.value,resume:job.resume,held:job.hold}}:{ok:false,reason:executed?.reason??'operation'};
    if(tx.ok&&version===serial&&!job.hold&&job.resume&&canResume(read(),at)){const resumed=commit(next=>{if(!canResume(next,at))return false;next.running=true;return true;});if(!resumed?.ok)tx.resumeReason=resumed?.reason??'storage';}
   }
  }else tx=commit(next=>{
   if(idleActionBoundary(next,at)!=='ready')return false;
   // A real stop or war boundary wins over a remembered continuation.
   const resume=job.resume&&!next.stopAfterBattle&&!next.stopAfterDungeon;
   next.running=false;next.restResume=false;
   const value=job.action(next,at);if(!value)return false;
   if(job.hold){if(!next.activeEncounter&&!next.dungeonRun)next.running=false;}
   else if(resume&&canResume(next,at))next.running=true;
   if(!validSave(next))return false;
   return {value,resume,held:job.hold};
  });}catch{tx={ok:false,reason:'operation'};}finally{busy=false;}
  if(version!==serial)return result('canceled');
  pending=null;
  if(!tx?.ok){held=null;if(!['storage','storage-blocked'].includes(tx?.reason))stopAfterFailure();return notify(result('rejected',{label:job.label,reason:tx?.reason??'operation'}));}
  if(job.hold||read().story?.activeScene&&tx.value.resume)held={resume:!!tx.value.resume,label:job.label};else held=null;
  return notify(result('applied',{label:job.label,value:tx.value.value,held:!!held,resumeReason:tx.resumeReason}));
 }
 function request({key='',label='',action,execute,hold=false,resume=true,waitForReady=false}={}){
  if(typeof action!=='function'&&typeof execute!=='function')return result('rejected',{reason:'invalid-action'});
  if(pending||busy)return result('busy',{label:pending?.label});
  const s=read(),boundary=idleActionBoundary(s,now());
  if(!['ready','battle'].includes(boundary))return result('rejected',{reason:boundary,label});
  const continuation=held?.resume??(!!s.running&&!s.stopAfterBattle&&!s.stopAfterDungeon);
  pending={key,label,action,execute,waitForReady:!!waitForReady,hold:!!hold,resume:!!resume&&continuation};serial++;
  return pump();
 }
 function release(){
  if(pending||busy)return result('busy');if(!held)return result('idle');
  const token=held;if(read().story?.activeScene)return result('held',{resumed:false,reason:'story-active'});held=null;
  if(!token.resume)return result('released',{resumed:false});
  const at=now(),s=read();if(!canResume(s,at))return result('released',{resumed:false});
  const tx=commit(next=>{if(!canResume(next,at))return false;next.running=true;next.restResume=false;return true;});
  return notify(result(tx?.ok?'released':'rejected',{resumed:!!tx?.ok,reason:tx?.reason}));
 }
 return {request,pump,release,cancel,get pending(){return pending?{key:pending.key,label:pending.label}:null;},get held(){return !!held;}};
}
