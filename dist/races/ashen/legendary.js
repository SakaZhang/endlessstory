// Candidate effects: host owns actual damage/resource eligibility, combat-only clocks,
// item-ID ledger, shield amplification and reset on unequip. No RNG or recursive events.
const hammer='ashen-veinbreaker',amulet='ashen-dusk-prism';
const plain=x=>!!x&&typeof x==='object'&&!Array.isArray(x),time=x=>Number.isFinite(x)&&x>=0&&x<=1e15,num=x=>Number.isFinite(x)&&x>=0&&x<=1e12;
export function createLegendaryState(id){return id===hammer?{version:1,readyAt:0,lastCastId:null}:id===amulet?{version:1,readyAt:0,stored:0}:null;}
export function validLegendaryState(id,s){if(!plain(s)||s.version!==1||!time(s.readyAt)||Object.keys(s).length!==3)return false;return id===hammer?Object.hasOwn(s,'lastCastId')&&(s.lastCastId===null||typeof s.lastCastId==='string'&&s.lastCastId.length>0&&s.lastCastId.length<=1000):id===amulet&&Object.hasOwn(s,'stored')&&num(s.stored);}
export function reduceLegendaryEvent({legendaryId,state,event,context={}}={}){
 if(!validLegendaryState(legendaryId,state)||!plain(event)||typeof event.type!=='string'||!time(context.clock))return null;
 const next=structuredClone(state),commands=[],castId=context.castId??event.castId;
 if(legendaryId===hammer&&event.type==='resourceSpend'&&context.clock>=next.readyAt&&typeof castId==='string'&&castId&&castId!==next.lastCastId&&['heat','shards','resonance'].includes(event.resource)&&Number.isSafeInteger(event.amount)&&event.amount>0){
  const amount=event.resource==='heat'?Math.floor(event.amount*.25):event.amount>=2?1:0;
  if(amount>0){commands.push({type:'resourceRefund',resource:event.resource,amount});next.readyAt=context.clock+8000;next.lastCastId=castId;}
 }
 if(legendaryId===amulet&&num(context.maxHp)&&context.maxHp>0){
  // A shield-only hit, own attack, periodic damage and reflection are not eligible.
  if(event.type==='incomingDirectHit'&&event.sourceKind==='enemy-direct'&&['earth','water','fire','wind','light','dark'].includes(event.damageType)&&num(event.actualHpLost)&&event.actualHpLost>0)next.stored=Math.min(context.maxHp*.20,next.stored+event.actualHpLost*.30);
  // beforeCast is dispatched ONLY after a real active cast consumed its cooldown.
  if(event.type==='beforeCast'&&typeof castId==='string'&&castId&&context.clock>=next.readyAt&&next.stored>0){const capacity=Math.min(next.stored,context.maxHp*.20);if(capacity>0){commands.push({type:'shield',capacity,durationMs:6000,sourceId:'ashen-afterglow'});next.stored=0;next.readyAt=context.clock+6000;}}
 }
 return {state:next,commands};
}
