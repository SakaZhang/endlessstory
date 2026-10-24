const dagger='goblin-silent-ration',boots='goblin-silent-steps';
const time=n=>Number.isFinite(n)&&n>=0&&n<=1e15,id=s=>typeof s==='string'&&s.length>0&&s.length<=250;
export function createLegendaryState(legendaryId){return legendaryId===dagger?{version:1,seenTargetIds:[]}:legendaryId===boots?{version:1,passive:true}:null;}
export function validLegendaryState(legendaryId,state){if(!state||typeof state!=='object'||Array.isArray(state)||state.version!==1||Object.keys(state).length!==2)return false;if(legendaryId===dagger)return Array.isArray(state.seenTargetIds)&&state.seenTargetIds.length<=100&&state.seenTargetIds.every(id)&&new Set(state.seenTargetIds).size===state.seenTargetIds.length;if(legendaryId===boots)return state.passive===true;return false;}
export function reduceLegendaryEvent({legendaryId,state,event,context={}}={}){
 if(!validLegendaryState(legendaryId,state)||!event||typeof event.type!=='string'||!time(context.clock??0))return null;const next=structuredClone(state),commands=[];
 if(legendaryId===dagger){
  if(event.type==='encounterStart')next.seenTargetIds=[];
  else if(event.type==='beforeDirectHit'&&event.hit===true&&['basic','skill'].includes(event.sourceKind)&&id(context.targetId)&&!next.seenTargetIds.includes(context.targetId)&&next.seenTargetIds.length<100){
   if(!time(event.shieldBefore)||!Number.isFinite(context.maxHp)||context.maxHp<=0)return null;
   next.seenTargetIds.push(context.targetId);
   if(event.shieldBefore>0)commands.push({type:'stealShield',targetId:context.targetId,amount:Math.min(event.shieldBefore*.4,context.maxHp*.08),durationMs:6000});
   else commands.push({type:'damage',targetId:context.targetId,coefficient:.7,damageType:'physical',crit:true,lifesteal:true,reaperEligible:false,multicastEligible:false,activeCastCount:0,recursiveLegend:false});
  }
 }

 return {state:next,commands};
}
