// Per-equipped-item pure reducers. Host clock advances only combat time and survives fields/stages.
// Source events are supplied after shield-first HP settlement; these commands never count as casts.
const sword='human-oathblade',banner='human-banner-armor';
const finite=x=>Number.isFinite(x)&&x>=0&&x<=1e15;
const plain=x=>!!x&&typeof x==='object'&&!Array.isArray(x);
const exact=(x,keys)=>plain(x)&&Object.keys(x).length===keys.length&&keys.every(k=>Object.hasOwn(x,k));
export function createLegendaryState(id){return id===sword?{version:1,targetId:null,markedAt:0,expiresAt:0,lastCastId:null,nextReadyAt:0}:id===banner?{version:1}:null;}
export function validLegendaryState(id,s){if(id===sword)return exact(s,['version','targetId','markedAt','expiresAt','lastCastId','nextReadyAt'])&&s.version===1&&(s.targetId===null||typeof s.targetId==='string'&&s.targetId.length>0)&&(s.lastCastId===null||typeof s.lastCastId==='string'&&s.lastCastId.length>0)&&[s.markedAt,s.expiresAt,s.nextReadyAt].every(finite)&&s.expiresAt>=s.markedAt&&(s.targetId===null?s.lastCastId===null:s.lastCastId!==null);return id===banner&&exact(s,['version'])&&s.version===1;}
const clearMark=s=>Object.assign(s,{targetId:null,markedAt:0,expiresAt:0,lastCastId:null});
export function reduceLegendaryEvent({legendaryId,state,event,context={}}={}){
 if(!validLegendaryState(legendaryId,state)||!plain(event)||typeof event.type!=='string'||!finite(context.clock))return null;
 const s=structuredClone(state),commands=[],clock=context.clock;
 if(legendaryId===sword){
  if(event.type==='encounterStart'||event.type==='encounterEnd'||event.type==='targetEnd'&&event.targetId===s.targetId)clearMark(s);
  if(s.targetId!==null&&clock>s.expiresAt)clearMark(s);
  if(event.type==='directHit'&&event.hit===true&&event.sourceKind==='skill'&&event.damageType==='physical'&&event.recursive!==true&&clock>=s.nextReadyAt){
   const targetId=event.targetId??context.targetId,castId=event.castId??context.castId;
   if(typeof targetId!=='string'||!targetId||typeof castId!=='string'||!castId||!Number.isFinite(context.stats?.atk)||context.stats.atk<0)return null;
   if(event.hpAfter===0){if(s.targetId===targetId)clearMark(s);return {state:s,commands};}
   if(s.targetId===targetId&&s.lastCastId!==castId&&clock-s.markedAt>=2200&&clock<=s.expiresAt){
    commands.push({type:'damage',targetId,coefficient:.8,damageType:'physical',crit:true,lifesteal:true,reaperEligible:false,multicastEligible:false,activeCastCount:0,recursive:false});
    commands.push({type:'dot',targetId,amount:.08*context.stats.atk,durationMs:6000,tickIntervalMs:2000,damageType:'physical',status:'bleed',sourceKind:'equipment',reaperEligible:false,multicastEligible:false,activeCastCount:0,recursive:false});
    clearMark(s);s.nextReadyAt=clock+10000;
   }else if(s.targetId!==targetId||s.targetId===null){s.targetId=targetId;s.markedAt=clock;s.expiresAt=clock+6000;s.lastCastId=castId;}
  }
 }
 // Received segments are already mitigated and capped to actual shield + HP loss.
 // A lethal segment still reflects before the host resolves death/Nirvana.
 if(legendaryId===banner&&event.type==='enemyDamageSegment'&&event.recursive!==true&&['enemy-direct','enemy-dot'].includes(event.sourceKind)&&typeof event.attackerId==='string'&&event.attackerId&&finite(event.actualHpLost)&&finite(event.actualShieldAbsorbed)){
  const amount=(event.actualHpLost+event.actualShieldAbsorbed)*.5;
  if(amount>0)commands.push({type:'reflectDamage',targetId:event.attackerId,amount,crit:false,lifesteal:false,reaperEligible:false,multicastEligible:false,activeCastCount:0,recursive:false});
 }
 return {state:s,commands};
}
