import {legendaryDivineMultiplier} from '../../legendary-divine.js';
// Item-owned, combat-clock state. Pending tuning is deliberately inert.
const ids=new Set(['ashen-molten-core','ashen-stone-core','ashen-crystal-core','ashen-primal-core']);
const plain=x=>!!x&&typeof x==='object'&&!Array.isArray(x),time=x=>Number.isFinite(x)&&x>=0&&x<=1e15;
export function createLegendaryState(id){return id==='ashen-molten-core'?{version:1,readyAt:0,stacks:0,expiresAt:0,remainder:0}:ids.has(id)?{version:1,readyAt:id==='ashen-crystal-core'?30000:0}:null;}
export function validLegendaryState(id,s){if(!ids.has(id)||!plain(s)||s.version!==1||!time(s.readyAt))return false;return id==='ashen-molten-core'?Object.keys(s).length===5&&Number.isInteger(s.stacks)&&s.stacks>=0&&s.stacks<=3&&time(s.expiresAt)&&Number.isInteger(s.remainder)&&s.remainder>=0&&s.remainder<30:Object.keys(s).length===2;}
export function reduceLegendaryEvent({legendaryId,state,event,context={}}={}){
 if(!validLegendaryState(legendaryId,state)||!plain(event)||typeof event.type!=='string'||!time(context.clock))return null;
 const next=structuredClone(state),commands=[],power=legendaryDivineMultiplier(context.item);
 if(legendaryId==='ashen-molten-core'){
  if(context.clock>=next.expiresAt){next.stacks=0;next.expiresAt=0;}
  if(event.type==='resourceSpend'&&event.resource==='heat'&&Number.isSafeInteger(event.amount)&&event.amount>0&&event.amount<=1e6){const total=next.remainder+event.amount,triggers=Math.floor(total/30);next.remainder=total%30;if(triggers){next.stacks=Math.min(3,next.stacks+triggers);next.expiresAt=Math.max(context.clock,next.expiresAt)+triggers*6000;}}
 }

 if(legendaryId==='ashen-stone-core'&&event.type==='shieldBreak'&&event.sourceKind==='enemy-direct'&&event.broken===true&&context.clock>=next.readyAt&&Number.isFinite(context.maxHp)&&context.maxHp>0&&context.heroAlive!==false){
  commands.push({type:'resourceRefund',resource:'shards',amount:2*power},{type:'heal',amount:context.maxHp*.04*power});next.readyAt=context.clock+8000;
 }
 return {state:next,commands};
}
