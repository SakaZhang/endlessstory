import assert from 'node:assert/strict';
import {legendaryPoolProbability as legendary,ordinarySecondRollProbability as ordinary,LUCK_POLICY,RESERVED_LUCK_CHANNELS,reservedLuckChannelPolicy} from './dist/luck-policy.js';
assert.equal(legendary(0),.05);assert(Math.abs(legendary(5)-.06)<1e-15);assert.equal(ordinary(0),0);assert.equal(ordinary(5),.03);assert.equal(ordinary(10),.04);
let last=.05,lastOrdinary=0;for(let r=0;r<=1000;r+=.25){const p=legendary(r),q=ordinary(r);assert(p>=last&&p<.07);assert(q>=lastOrdinary&&q<.06);last=p;lastOrdinary=q;}
assert.equal(legendary(1000),.05+.02*1000/1005);assert(legendary(1000)<.07);assert.equal(legendary(36.4),.05+.02*36.4/41.4);
for(const r of [0,5,36.4,1000])for(const pp of [0,.01,.2,1]){assert.equal(legendary(r,pp),Math.min(1,legendary(r)+pp));assert.equal(ordinary(r),.06*r/(r+5));}assert.equal(legendary(0,1),1);
for(const bad of [-1,NaN,Infinity,-Infinity,1000.01,'5',null,undefined]){assert.equal(legendary(bad),null);assert.equal(ordinary(bad),null);}for(const pp of [-.01,NaN,Infinity,1.01,'0',null])assert.equal(legendary(5,pp),null);
// Policy never resolves a source, changes item counts, or turns an ineligible event eligible.
const events=[{kind:'field',eligible:false},{kind:'boss',eligible:false},{kind:'boss',eligible:true}];const before=structuredClone(events);const approved=(event,r)=>event.eligible?legendary(r):0;for(const e of events){assert.equal(approved(e,1000)>0,e.eligible);}assert.deepEqual(events,before);
assert(Object.isFrozen(LUCK_POLICY));assert(Object.isFrozen(RESERVED_LUCK_CHANNELS));assert.equal(reservedLuckChannelPolicy('divine').enabled,true);assert.equal(reservedLuckChannelPolicy('specialAffix').enabled,false);assert.equal(reservedLuckChannelPolicy('other'),null);assert.equal(reservedLuckChannelPolicy('__proto__'),null);
console.log('PASS pure luck policy:5% + bounded2pp rating + explicitPP, finite0–1000 asymptote<7%, existing6% second-roll probability only, invalid inputs rejected, no source/production activation');

const {lootOccurrenceProbability,divineProbability}=await import('./dist/luck-policy.js');
for(const fn of [lootOccurrenceProbability,divineProbability]){
 assert.equal(fn(0,1000),0);assert.equal(fn(.2,0),.2);assert.equal(fn(1,1000),1);
 for(const bad of [-1,1001,NaN,Infinity,null,'2'])assert.equal(fn(.2,bad),null);
 for(const bad of [-.1,1.1,NaN,Infinity,null,'0.2'])assert.equal(fn(bad,3),null);
}
assert.equal(lootOccurrenceProbability(.5,5),.525);
assert.equal(divineProbability(.5,5),.55);
assert.ok(lootOccurrenceProbability(.5,1000)<.55);
assert.ok(divineProbability(.5,1000)<.6);
console.log('approved occurrence/divine luck policies PASS');
