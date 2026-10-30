// Casino state is independent of encounter, loot and luck RNG. Old saves acquire
// a deterministic initial seed before their first wager; rejected writes cannot
// reroll it. The full-period uint32 stream uses rejection sampling, not % bias.
const record=x=>!!x&&typeof x==='object'&&!Array.isArray(x);
const keys=(x,list)=>record(x)&&Object.keys(x).length===list.length&&list.every(k=>Object.hasOwn(x,k));
const uint=x=>Number.isSafeInteger(x)&&x>=0&&x<=0xffffffff;
const label=x=>typeof x==='string'&&x.length>0&&x.length<=240;
export const CASINO_COST=100;
export const CASINO_MAX_WAGERS=1e9;
export const CASINO_OUTCOMES=Object.freeze(['downgrade','upgrade','same','legendary']);
export function casinoOutcome(ticket){return Number.isInteger(ticket)&&ticket>=0&&ticket<100?(ticket<33?'downgrade':ticket<66?'upgrade':ticket<99?'same':'legendary'):null;}
export function casinoHash(value){let n=2166136261;for(const c of String(value)){n^=c.charCodeAt(0);n=Math.imul(n,16777619)>>>0;}return n;}
export function validCasinoState(s){
 const c=s?.casino;if(c===undefined)return true;
 if(!keys(c,['version','rng','revision','lastReceipt'])||c.version!==1||!uint(c.rng)||!Number.isSafeInteger(c.revision)||c.revision<0||c.revision>CASINO_MAX_WAGERS)return false;
 const r=c.lastReceipt;if(r===null)return c.revision===0;
 return keys(r,['revision','at','outcome','inputKind','inputId','inputName','fromQuality','toQuality','rewardId','rewardName'])&&r.revision===c.revision&&r.revision>0&&Number.isSafeInteger(r.at)&&r.at>=0&&r.at<=1e15&&CASINO_OUTCOMES.includes(r.outcome)&&['material','equipment'].includes(r.inputKind)&&label(r.inputId)&&label(r.inputName)&&Number.isInteger(r.fromQuality)&&r.fromQuality>=0&&r.fromQuality<=3&&r.toQuality===(r.outcome==='legendary'?4:r.outcome==='upgrade'?Math.min(3,r.fromQuality+1):r.outcome==='downgrade'?Math.max(0,r.fromQuality-1):r.fromQuality)&&label(r.rewardId)&&label(r.rewardName);
}
export function normalizeCasinoState(s){
 if(!validCasinoState(s))return false;
 s.casino??={version:1,rng:casinoHash([s.race,s.hero,s.lastSeen,...(s.inventory??[]).map(it=>it.id)].join('|')),revision:0,lastReceipt:null};return true;
}
export function drawCasinoTicket(c){
 if(!c||!uint(c.rng))throw new RangeError('Invalid casino RNG');
 let n;do{n=c.rng=(Math.imul(c.rng,1664525)+1013904223)>>>0;}while(n>=4294967200);
 return n%100;
}
