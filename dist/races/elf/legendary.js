// Pure per-item state transitions. Shared equipment host owns clocks, save persistence,
// hit/crit/lifesteal, shield layers, and reset on actual unequip.
const elements=['earth','water','fire','wind','light','dark'];
const staff='elf-sixfold-heartwood',amulet='elf-dew-covenant';
const plain=x=>!!x&&typeof x==='object'&&!Array.isArray(x),id=x=>x===null||typeof x==='string'&&x.length>0&&x.length<800;
export function createLegendaryState(legendaryId){if(legendaryId===staff)return {seenElements:[],ready:false,pendingCastId:null,pendingTargetId:null,lastCastId:null};if(legendaryId===amulet)return {nextWardAt:0};return null;}
export function validLegendaryState(legendaryId,s){if(!plain(s))return false;if(legendaryId===staff)return Object.keys(s).length===5&&Array.isArray(s.seenElements)&&s.seenElements.length<=3&&new Set(s.seenElements).size===s.seenElements.length&&s.seenElements.every(e=>elements.includes(e))&&typeof s.ready==='boolean'&&s.ready===(s.seenElements.length===3)&&[s.pendingCastId,s.pendingTargetId,s.lastCastId].every(id)&&(s.pendingCastId===null)===(s.pendingTargetId===null);if(legendaryId===amulet)return Object.keys(s).length===1&&Number.isFinite(s.nextWardAt)&&s.nextWardAt>=0&&s.nextWardAt<=1e15;return false;}
export function reduceLegendaryEvent({legendaryId,state,event,context={}}={}){
 if(!validLegendaryState(legendaryId,state)||!plain(event)||!Number.isFinite(context.clock)||context.clock<0)return null;
 const next=structuredClone(state),commands=[],kind=event.type??event.kind;
 if(legendaryId===staff){
  if(kind==='beforeCast'&&context.committed===true&&typeof context.castId==='string'&&context.castId!==next.lastCastId){
   next.lastCastId=context.castId;
   // Read readiness before any hit in this cast, never retroactively trigger it.
   if(next.ready&&context.weaponType==='staff'&&context.damageActionCount>0&&typeof context.targetId==='string'){
    next.seenElements=[];next.ready=false;next.pendingCastId=context.castId;next.pendingTargetId=context.targetId;
   }
  }
  if(kind==='directHit'&&event.sourceKind==='skill'&&elements.includes(event.damageType)&&Number.isFinite(event.hpLost)&&Number.isFinite(event.shieldLost)&&event.hpLost+event.shieldLost>0&&!next.ready&&!next.seenElements.includes(event.damageType)){
   next.seenElements.push(event.damageType);next.ready=next.seenElements.length===3;
  }
  if(kind==='castEnd'&&next.pendingCastId===context.castId){
   for(const damageType of elements)commands.push({type:'damage',targetId:next.pendingTargetId,coefficient:.18,damageType,crit:true,lifesteal:true,hitCheck:true,sourceKind:'equipmentProc',procId:`${context.castId}:elf-sixfold-echo`,reaperEligible:false,multicastEligible:false,activeCastCount:0});
   next.pendingCastId=null;next.pendingTargetId=null;
  }
 }
 if(legendaryId===amulet&&kind==='cleanseResult'&&Number.isSafeInteger(event.removedCount)&&event.removedCount>0&&context.clock>=next.nextWardAt&&Number.isFinite(context.maxHp)&&context.maxHp>0){
  commands.push({type:'shield',capacity:context.maxHp*Math.min(.18,.10+.04*(event.removedCount-1)),durationMs:8000,sourceId:'elf-dewguard'});next.nextWardAt=context.clock+12000;
 }
 return validLegendaryState(legendaryId,next)?{state:next,commands}:null;
}
