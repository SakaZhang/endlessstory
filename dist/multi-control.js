// Isolated control policy. Time uses the caller's integer simulation clock.
// No production durations, boss modifiers, skill definitions or automatic cast resolution.
const clone=x=>structuredClone(x), max=Number.MAX_SAFE_INTEGER/4;
const time=n=>Number.isSafeInteger(n)&&n>=0&&n<=max;
const id=s=>typeof s==='string'&&s.length>0&&s.length<256&&!['__proto__','constructor','prototype'].includes(s);
const obj=x=>!!x&&typeof x==='object'&&!Array.isArray(x);
export function validControl(s){return obj(s)&&s.version===1&&id(s.unitId)&&time(s.clock)&&time(s.stunUntil)&&time(s.interruptUntil)&&Number.isSafeInteger(s.stunChain)&&s.stunChain>=0&&(s.lastStunEnd===null||time(s.lastStunEnd))&&obj(s.cooldowns)&&Object.entries(s.cooldowns).every(([k,v])=>id(k)&&time(v))&&(s.preparing===null||obj(s.preparing)&&id(s.preparing.skillId)&&time(s.preparing.startedAt)&&time(s.preparing.completesAt)&&s.preparing.completesAt>s.preparing.startedAt&&time(s.preparing.cooldownDuration)&&time(s.preparing.duration)&&s.preparing.duration>0);}
export function createControl(unitId,now){const s={version:1,unitId,clock:now,stunUntil:0,interruptUntil:0,stunChain:0,lastStunEnd:null,cooldowns:{},preparing:null};return validControl(s)?s:null;}
export function restoreControl(s){return validControl(s)?clone(s):null;}
export function advanceControlClock(s,now){if(!validControl(s)||!time(now)||now<s.clock)return null;const next=clone(s);if(next.preparing&&next.preparing.completesAt>s.clock){const paused=Math.max(0,Math.min(now,s.stunUntil)-s.clock);if(!time(next.preparing.completesAt+paused))return null;next.preparing.completesAt+=paused;}next.clock=now;return next;}
export function controlAllowsAction(s,now){return validControl(s)&&time(now)&&now>=s.clock&&now>=s.stunUntil&&now>=s.interruptUntil;}
export function beginPreparing(s,{skillId,duration,cooldownDuration,now}){
 const next=advanceControlClock(s,now);if(!next||!id(skillId)||!time(duration)||duration===0||!time(cooldownDuration)||!time(now+duration)||!controlAllowsAction(next,now)||next.preparing||(next.cooldowns[skillId]??0)>now)return null;
 next.preparing={skillId,duration,startedAt:now,completesAt:now+duration,cooldownDuration};return next;
}
export function interruptPreparing(s,{now,briefStop}){
 const next=advanceControlClock(s,now);if(!next||!time(briefStop)||!time(now+briefStop))return null;
 // A cast at or beyond its completion boundary cannot retroactively be interrupted.
 if(!next.preparing||now>=next.preparing.completesAt)return {state:next,interrupted:false};
 const cast=next.preparing,end=now+cast.cooldownDuration;if(!time(end))return null;
 next.preparing=null;next.cooldowns[cast.skillId]=Math.max(next.cooldowns[cast.skillId]??0,end);next.interruptUntil=Math.max(next.interruptUntil,now+briefStop);
 return {state:next,interrupted:true,skillId:cast.skillId};
}
export function applyStun(s,{now,baseDuration,reduction,diminishingFactors,recoveryWindow,minDuration,refreshMode}){
 const next=advanceControlClock(s,now);
 if(!next||!time(baseDuration)||baseDuration===0||!Number.isFinite(reduction)||reduction<0||reduction>1||!Array.isArray(diminishingFactors)||!diminishingFactors.length||diminishingFactors[0]!==1||!diminishingFactors.every((v,i)=>Number.isFinite(v)&&v>0&&v<=1&&(!i||v<=diminishingFactors[i-1]))||!time(recoveryWindow)||!recoveryWindow||!time(minDuration)||!minDuration||minDuration>baseDuration||!['max','replace'].includes(refreshMode))return null;
 const reset=next.lastStunEnd===null||now-next.lastStunEnd>=recoveryWindow;
 const chain=reset?0:next.stunChain,index=Math.min(chain,diminishingFactors.length-1);
 const duration=Math.max(minDuration,Math.ceil(baseDuration*(1-reduction)*diminishingFactors[index]));
 if(!time(now+duration))return null;
 next.stunUntil=refreshMode==='max'?Math.max(next.stunUntil,now+duration):now+duration;
 next.lastStunEnd=next.stunUntil;next.stunChain=Math.min(index+1,diminishingFactors.length);
 // advanceControlClock pauses preparation once per elapsed stunned interval; stun never writes skill cooldown.
 return {state:next,duration,chain:index+1,recovered:reset};
}
export function interruptHitTargets(states,hits,options){
 if(!Array.isArray(states)||!states.every(validControl)||new Set(states.map(s=>s.unitId)).size!==states.length||!Array.isArray(hits)||!hits.every(h=>obj(h)&&id(h.targetId)&&typeof h.hit==='boolean')||new Set(hits.map(h=>h.targetId)).size!==hits.length||hits.some(h=>!states.some(s=>s.unitId===h.targetId)))return null;
 const out=states.map(clone),events=[];for(const hit of hits){if(!hit.hit)continue;const i=out.findIndex(s=>s.unitId===hit.targetId),result=interruptPreparing(out[i],options);if(!result)return null;out[i]=result.state;if(result.interrupted)events.push({targetId:hit.targetId,skillId:result.skillId});}return {states:out,events};
}

export function claimCompletedCast(s,now){
 const next=advanceControlClock(s,now);if(!next||!next.preparing||next.preparing.completesAt>now||!controlAllowsAction(next,now))return null;
 const cast=next.preparing,end=cast.completesAt+cast.cooldownDuration;if(!time(end))return null;next.preparing=null;next.cooldowns[cast.skillId]=Math.max(next.cooldowns[cast.skillId]??0,end);return {state:next,skillId:cast.skillId,completedAt:cast.completesAt};
}

export function preparingProgress(s,now){const next=advanceControlClock(s,now);if(!next||!next.preparing)return null;return {skillId:next.preparing.skillId,remaining:Math.max(0,next.preparing.completesAt-now),fraction:Math.min(1,Math.max(0,1-(next.preparing.completesAt-now)/next.preparing.duration)),paused:now<next.stunUntil};}
