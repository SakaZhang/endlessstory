import {EXPANSION_PACKS} from './race-packs.js';
// Independent legendary settlement policy, used by the production boss reward adapter.
// Item generation and inventory acceptance are injected and independently validated.
export const LEGENDARY_DROP_BASE_PROBABILITY=.05;
export const LEGENDARY_DROP_CANDIDATES=Object.freeze({...Object.fromEntries(EXPANSION_PACKS.map(p=>[p.id,p.legendaries.filter(d=>!d.questOnly).map(d=>({id:d.id,weight:1,registration:'race-content'}))])),dwarf:Object.freeze([
 Object.freeze({id:'first-forge-oathhammer',weight:1,registration:'candidate'}),
 Object.freeze({id:'everburning-reactor',weight:1,registration:'candidate'})
])});
const clone=structuredClone;
const freeze=x=>{if(x&&typeof x==='object'){Object.values(x).forEach(freeze);Object.freeze(x);}return x;};
const id=x=>typeof x==='string'&&x.length>0&&x.length<=200&&!['__proto__','constructor','prototype'].includes(x);
const probability=x=>Number.isFinite(x)&&x>=0&&x<=1;
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
function canonicalEvent(e){if(!e||!id(e.settlementId)||!id(e.nodeId)||!id(e.regionRace)||!['boss','field','dungeon','merchant','forge'].includes(e.kind)||typeof e.won!=='boolean')return null;return {settlementId:e.settlementId,nodeId:e.nodeId,regionRace:e.regionRace,kind:e.kind,won:e.won};}
function eligible(e){return e.kind==='boss'&&e.won&&Object.hasOwn(LEGENDARY_DROP_CANDIDATES,e.regionRace);}
function draw(random){const n=random();if(!Number.isFinite(n)||n<0||n>=1)throw new RangeError('RNG must be finite in [0,1)');return n;}
export function validLegendaryDropReceipt(r,validateItem){
 try{
  if(!r||r.version!==1||!['prepared','delivered'].includes(r.status)||!probability(r.probability)||!same(r.event,canonicalEvent(r.event))||!['ineligible','miss','hit'].includes(r.outcome))return false;
  if(r.outcome==='ineligible')return !eligible(r.event)&&r.legendaryId===null&&r.item===null;
  if(!eligible(r.event))return false;
  if(r.outcome==='miss')return r.legendaryId===null&&r.item===null;
  if(!LEGENDARY_DROP_CANDIDATES[r.event.regionRace].some(x=>x.id===r.legendaryId))return false;
  return r.item===null||(typeof validateItem==='function'&&validateItem(r.item,{legendaryId:r.legendaryId,event:clone(r.event)})===true);
 }catch{return false;}
}
// Exactly one probability check, then (only on success) one conditional pool draw.
// No ownership/pity inputs. The caller supplies its already approved effective chance.
export function prepareLegendaryDrop(event,{probability:chance,random=Math.random,previous=null,generateItem=null,validateItem=null}={}){
 const e=canonicalEvent(event);if(!e||!probability(chance)||typeof random!=='function')return null;
 if(previous){if(!validLegendaryDropReceipt(previous,validateItem)||!same(previous.event,e))return null;return freeze(clone(previous));}
 try{
  const receipt={version:1,status:'prepared',event:e,probability:chance,outcome:'ineligible',legendaryId:null,item:null};
  if(eligible(e)){
   receipt.outcome='miss';
   if(draw(random)<chance){const pool=LEGENDARY_DROP_CANDIDATES[e.regionRace],roll=draw(random)*pool.reduce((n,x)=>n+x.weight,0);let sum=0;const chosen=pool.find(x=>(sum+=x.weight)>roll);receipt.outcome='hit';receipt.legendaryId=chosen.id;}
  }
  const prepared=freeze(receipt);return generateItem?materializeLegendaryDrop(prepared,{generateItem,validateItem}):prepared;
 }catch{return null;}
}
// Optional separate generator step; no fabricated equipment, coefficients or overflow rules.
export function materializeLegendaryDrop(prepared,{generateItem,validateItem}={}){
 if(!validLegendaryDropReceipt(prepared,validateItem))return null;
 if(prepared.outcome!=='hit'||prepared.item!==null)return freeze(clone(prepared));
 if(typeof generateItem!=='function'||typeof validateItem!=='function')return null;
 try{const next=clone(prepared),item=generateItem({legendaryId:next.legendaryId,event:clone(next.event)});if(!item||validateItem(item,{legendaryId:next.legendaryId,event:clone(next.event)})!==true)return null;next.item=clone(item);return freeze(next);}catch{return null;}
}
// receive operates only on a fresh clone, and decides approved inventory/pending delivery.
// The host must bind the receipt to its actual still-current victorious settlement.
// A failed persist never adopts state. Retry passes the SAME prepared receipt/item.
export function commitLegendaryDrop(current,prepared,{isCurrentSettlement,receive,persist,validateItem}={}){
 const failed=reason=>({ok:false,reason,game:current,prepared});
 if(!validLegendaryDropReceipt(prepared,validateItem)||typeof isCurrentSettlement!=='function'||typeof persist!=='function')return failed('invalid-receipt');
 try{
  if(!isCurrentSettlement(current,clone(prepared.event)))return failed('stale-settlement');
  const ledger=current.legendaryDropLedger??{};if(!ledger||typeof ledger!=='object'||Array.isArray(ledger))return failed('invalid-ledger');
  const old=Object.hasOwn(ledger,prepared.event.settlementId)?ledger[prepared.event.settlementId]:null;
  if(old){if(!validLegendaryDropReceipt(old,validateItem)||old.status!=='delivered'||!same({...old,status:'prepared'},{...prepared,status:'prepared'}))return failed('receipt-conflict');return {ok:true,applied:false,game:current,prepared:freeze(clone(old))};}
  if(prepared.status==='delivered')return failed('missing-delivery-ledger');
  if(prepared.outcome==='hit'&&(prepared.item===null||typeof receive!=='function'))return failed('missing-item-adapter');
  const next=clone(current);
  if(prepared.outcome==='hit'&&receive(next,clone(prepared.item),clone(prepared.event))!==true)return failed('delivery-unavailable');
  next.legendaryDropLedger={...(next.legendaryDropLedger??{}),[prepared.event.settlementId]:{...clone(prepared),status:'delivered'}};
  persist(next);return {ok:true,applied:true,game:next,prepared:freeze(clone(next.legendaryDropLedger[prepared.event.settlementId]))};
 }catch{return failed('transaction-failed');}
}
