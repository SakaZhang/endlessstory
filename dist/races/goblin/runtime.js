export const createRuntime=()=>({version:1,clock:0,traps:[],serial:0});
const num=x=>Number.isFinite(x)&&x>=0&&x<=1e15;
export function validRuntime(r){return !!r&&r.version===1&&num(r.clock)&&Number.isSafeInteger(r.serial)&&r.serial>=0&&Array.isArray(r.traps)&&r.traps.length<=8&&new Set(r.traps.map(t=>t.sourceId)).size===r.traps.length&&r.traps.every(t=>typeof t.sourceId==='string'&&t.sourceId.length>0&&t.sourceId.length<=200&&num(t.expiresAt)&&Number.isInteger(t.charges)&&t.charges>=1&&t.charges<=3&&[t.coefficient,t.hitDown,t.attackDown].every(num)&&t.coefficient<=10&&t.hitDown<=100000&&t.attackDown<=1e12&&typeof t.splash==='boolean');}
export function applyReactiveEffect(runtime,effect,clock){
 if(!validRuntime(runtime)||!num(clock)||clock<runtime.clock||effect?.type!=='raceReactive'||!Number.isFinite(effect.durationMs)||effect.durationMs<=0||effect.durationMs>30000||!Number.isInteger(effect.charges)||effect.charges<1||effect.charges>3||![effect.coefficient,effect.hitDown,effect.attackDown].every(num))return null;
 const r=structuredClone(runtime);r.clock=clock;r.traps=r.traps.filter(t=>t.expiresAt>clock&&t.sourceId!==effect.sourceId);r.traps.push({sourceId:effect.sourceId,expiresAt:clock+effect.durationMs,charges:effect.charges,coefficient:effect.coefficient,hitDown:effect.hitDown,attackDown:effect.attackDown,splash:!!effect.splash});return validRuntime(r)?r:null;
}
export function onEnemyAction({runtime,event,hero,targets=[]}={}){
 if(!validRuntime(runtime)||!num(event?.clock)||event.clock<runtime.clock)return null;
 const r=structuredClone(runtime);r.clock=event.clock;r.traps=r.traps.filter(t=>t.expiresAt>r.clock);const actions=[];
 if(event.direct!==true||event.recursive||hero?.hp<=0)return {runtime:r,actions};
 const attacker=targets.find(t=>t.id===event.attackerId&&t.alive);if(!attacker)return {runtime:r,actions};
 for(const trap of r.traps){
  const chosen=trap.splash?targets.filter(t=>t.alive):[attacker],castId=`goblin-reactive:${r.serial++}`;
  for(const target of chosen){
   const effects=[];for(const [type,amount]of [['hitDown',trap.hitDown],['attackDown',Math.min(trap.attackDown,Number.isFinite(target.baseAtk)&&target.baseAtk>=0?target.baseAtk*.25:0)]])if(amount>0)effects.push({type,amount,durationMs:5000,sourceId:trap.sourceId});
   actions.push({kind:'hit',castId,hitId:`${castId}:${target.id}`,targetId:target.id,hitIndex:0,damageType:'physical',coefficient:trap.coefficient,independentHit:true,independentCrit:false,reaperEligible:false,multicastEligible:false,recursiveCounter:false,activeCastCount:0,effects});
  }trap.charges--;
 }
 r.traps=r.traps.filter(t=>t.charges>0);return {runtime:r,actions};
}
