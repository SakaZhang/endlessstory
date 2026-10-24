const dagger='goblin-silent-ration',spring='goblin-returning-spring';
const time=n=>Number.isFinite(n)&&n>=0&&n<=1e15,id=s=>typeof s==='string'&&s.length>0&&s.length<=250;
export function createLegendaryState(legendaryId){return legendaryId===dagger?{version:1,seenTargetIds:[]}:legendaryId===spring?{version:1,nextReadyAt:0}:null;}
export function validLegendaryState(legendaryId,state){if(!state||typeof state!=='object'||Array.isArray(state)||state.version!==1||Object.keys(state).length!==2)return false;if(legendaryId===dagger)return Array.isArray(state.seenTargetIds)&&state.seenTargetIds.length<=100&&state.seenTargetIds.every(id)&&new Set(state.seenTargetIds).size===state.seenTargetIds.length;if(legendaryId===spring)return time(state.nextReadyAt);return false;}
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
 if(legendaryId===spring&&event.type==='enemyMiss'&&(context.clock??0)>=next.nextReadyAt){
  const equipped=Array.isArray(context.activeSkillIds)?context.activeSkillIds:[],cd=context.cooldowns??{};let chosen=null,remaining=0;
  for(const skillId of equipped){if(!id(skillId))continue;const value=cd[skillId];if(Number.isSafeInteger(value)&&value>remaining){chosen=skillId;remaining=value;}}
  if(chosen){commands.push({type:'cooldownReduce',skillId:chosen,rounds:Math.min(2,remaining)});next.nextReadyAt=(context.clock??0)+6600;}
 }
 return {state:next,commands};
}
