import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
import {POTION_BUFF_KEYS} from './dist/potion-catalog.js';
import {commitGameTransaction} from './dist/storage.js';
const T=1700000000000,clone=x=>JSON.parse(JSON.stringify(x));
function fresh(){const s=E.fresh();E.normalizeHealth(s,T);E.normalizePotions(s);s.heroHp=1;return s;}
for(const type of POTION_BUFF_KEYS)for(let q=0;q<4;q++){
 const s=fresh(),key=`${type}|${q}`;s.potionStacks[key]=10;s.potionReadyAt=T+10000;for(const k of POTION_BUFF_KEYS)s.potionFunctionCooldowns[k]=T+10000;
 assert.equal(E.potionCooldownUntil(s,key),0);assert(E.drinkPotions(s,key,3,T));assert.equal(s.potionStacks[key],7);assert.equal(s.potionBuffs[type].endAt,T+900000);assert.equal(s.potionReadyAt,T+10000);
 const st=E.stats(s);assert(E.drinkPotions(s,key,2,T));assert.equal(s.potionBuffs[type].endAt,T+1500000);assert.deepEqual(E.stats(s),st);assert(E.validSave(clone(s)));
 const before=clone(s);for(const n of [0,-1,1.5,NaN,Infinity,6,Number.MAX_SAFE_INTEGER])assert(!E.drinkPotions(s,key,n,T));assert.deepEqual(s,before);
 assert.equal(E.maxPotionUseQuantity(s,key,T),5);
}
const s=fresh();s.potionStacks={'strength|0':8,'strength|3':8,'healing|0':8};assert(E.drinkPotions(s,'strength|0',5,T));assert(E.drinkPotions(s,'strength|3',2,T));assert.equal(s.potionBuffs.strength.endAt,T+600000);assert.equal(s.potionBuffs.strength.quality,3);let before=clone(s);assert(!E.drinkPotions(s,'strength|0',2,T));assert.deepEqual(s,before);assert.equal(E.maxPotionUseQuantity(s,'strength|0',T),0);
assert(!E.drinkPotions(s,'healing|0',2,T));assert(E.drinkPotion(s,'healing|0',T));assert(!E.drinkPotion(s,'healing|0',T));assert(E.drinkPotions(s,'strength|3',2,T));assert.equal(s.potionReadyAt,T+10000);
const edge=fresh();edge.potionStacks['luck|0']=9;edge.potionBuffs.luck={quality:0,endAt:1e15-600000};assert.equal(E.maxPotionUseQuantity(edge,'luck|0',T),2);assert(!E.drinkPotions(edge,'luck|0',3,T));assert(E.drinkPotions(edge,'luck|0',2,T));assert.equal(edge.potionBuffs.luck.endAt,1e15);assert.equal(E.maxPotionUseQuantity(edge,'luck|0',T),0);
for(const running of [true,false]){const c=fresh();c.potionStacks={'luck|0':6,'strength|0':6,'healing|0':2};const e=E.startRoutedEncounter(c,T);c.running=running;assert(E.drinkPotions(c,'luck|0',3,T,e));assert(E.drinkPotions(c,'strength|0',3,T,null));c.potionSlot.auto=true;assert(E.autoDrinkPotion(c,e,T));assert(!E.autoDrinkPotion(c,e,T));assert(E.validSave(c));}
const old=fresh();old.potionStacks={'luck|0':3};delete old.potionFunctionCooldowns;old.potionReadyAt=T+5000;assert(E.drinkPotions(old,'luck|0',3,T));assert.equal(old.potionReadyAt,T+5000);assert(E.validSave(old));
const txs=fresh();txs.potionStacks={'luck|0':6};before=clone(txs);const fail=commitGameTransaction({setItem(){throw Error('quota');}},txs,d=>E.drinkPotions(d,'luck|0',4,T),{now:T});assert(!fail.ok);assert.deepEqual(txs,before);let raw;const ok=commitGameTransaction({setItem(k,v){raw=v;}},txs,d=>E.drinkPotions(d,'luck|0',4,T),{now:T});assert(ok.ok);const saved=JSON.parse(raw);assert.equal(saved.potionStacks['luck|0'],2);assert.equal(saved.potionBuffs.luck.endAt,T+1200000);assert(E.validSave(saved));assert.deepEqual(txs,before);
console.log('PASS bulk all14types×4qualities, no function cooldown, healing retained, quality policy, exact duration/count, legacy timers, combat/paused, safe time ceiling and save failure atomicity');

for(const badNow of [NaN,Infinity,-1,1e15+1])assert.equal(E.maxPotionUseQuantity(txs,'luck|0',badNow),0);
