import assert from 'node:assert/strict';
import {fresh,normalizeAreaProgress,getAreaProgress,getMerchantEquipmentLevelRange,areaLevelRange,validSave,normalizeHealth,configureExpedition,startRoutedEncounter,startInstanceEncounter,step,reward,ensureMerchant,paidRefreshMerchant,offline,INSTANCES} from './dist/engine.js';
const dungeon='dwarf-blackforge-1-dungeon',random=Math.random;let seed=1917;Math.random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/2**32;};
const ready=()=>{const s=fresh();s.lastSeen=0;normalizeHealth(s,0);assert(configureExpedition(s,{mode:'dungeon',targetInstanceId:dungeon,fieldId:'blackforge-road-field',loop:false}));return s;};
const win=(s,e,time)=>{e.done=true;e.win=true;return reward(s,e,time);};
const complete=(s,start=0)=>{let e;for(let i=0;i<3;i++){e=startRoutedEncounter(s,start+i*2000);assert(e);win(s,e,start+i*2000+100);}return e;};
try{
 const old=fresh();old.level=137;old.normalWins=[999,999,999];old.bossWins=[999,999,999];old.chapters=[0,1,2];old.instanceCooldowns={[dungeon]:100000};assert(validSave(old));assert(normalizeAreaProgress(old));assert.deepEqual(getAreaProgress(old),{unlocked:[1],cleared:[]});assert.deepEqual(getMerchantEquipmentLevelRange(old),[1,10]);assert.equal(old.level,137);const once=JSON.stringify(old);assert(normalizeAreaProgress(old));assert.equal(JSON.stringify(old),once);
 for(const race of ['human','elf','goblin','ashen'])assert.deepEqual(getAreaProgress(old,race),{unlocked:[],cleared:[]});
 const s=ready();s.gold=10000;const shop=ensureMerchant(s,0),stock=JSON.stringify(shop);assert(shop.offers.filter(o=>o.type==='equipment').every(o=>o.item.level>=1&&o.item.level<=10));
 let e=startRoutedEncounter(s,0);win(s,e,100);assert.deepEqual(getAreaProgress(s),{unlocked:[1],cleared:[]});e=startRoutedEncounter(s,2000);win(s,e,2100);assert.deepEqual(getAreaProgress(s).cleared,[]);
 e=startRoutedEncounter(s,4000);const foreign=structuredClone(e);foreign.instanceId='fake';foreign.done=true;foreign.win=true;assert.equal(reward(s,foreign,4100),null);assert.deepEqual(getAreaProgress(s).cleared,[]);
 win(s,e,4100);assert.deepEqual(getAreaProgress(s),{unlocked:[1,2],cleared:[1]});assert.deepEqual(getMerchantEquipmentLevelRange(s),[11,20]);assert.equal(JSON.stringify(ensureMerchant(s,4200)),stock);const done=JSON.stringify(s);reward(s,e,4200);assert.equal(JSON.stringify(s),done);assert(validSave(JSON.parse(done)));
 assert(!Object.values(INSTANCES).some(i=>i.areaId.endsWith('-2')));assert.equal(startInstanceEncounter(s,'dwarf-blackforge-2-dungeon',5000),null);
 assert(paidRefreshMerchant(s,5000,0));assert(s.merchant.offers.filter(o=>o.type==='equipment').every(o=>o.item.level>=11&&o.item.level<=20));assert.equal(s.merchant.nextRefreshAt,1800000);
 complete(s,304100);assert.deepEqual(getAreaProgress(s),{unlocked:[1,2],cleared:[1]});
 const reloaded=JSON.parse(JSON.stringify(s));assert(validSave(reloaded));assert.deepEqual(getMerchantEquipmentLevelRange(reloaded),[11,20]);assert(ensureMerchant(reloaded,1800000).offers.filter(o=>o.type==='equipment').every(o=>o.item.level>=11&&o.item.level<=20));
 // Actual offline battle completion records the same unlock; no cap/truncation.
 const off=ready();off.level=137;off.heroHp=10000;off.running=true;const report=offline(off,60000);assert.equal(report.kills,3);assert.deepEqual(getAreaProgress(off),{unlocked:[1,2],cleared:[1]});assert.equal(off.level,137);
 const failed=ready();const fe=startRoutedEncounter(failed,0);failed.heroHp=fe.heroHp=1;fe.hp=fe.atk=1e8;step(failed,fe,1100);assert.deepEqual(getAreaProgress(failed),{unlocked:[1],cleared:[]});
 const ranges=new Set();for(let i=0;i<1000;i++){const x=fresh();x.level=i%2?1:999;const m=ensureMerchant(x,0);for(const o of m.offers.filter(o=>o.type==='equipment')){assert(o.item.level>=1&&o.item.level<=10);ranges.add(o.item.level);}}assert.equal(ranges.size,10);
 const cap=fresh();normalizeAreaProgress(cap);cap.areaProgress.dwarf={unlocked:Array.from({length:10},(_,i)=>i+1),cleared:Array.from({length:10},(_,i)=>i+1)};assert(validSave(cap));assert.deepEqual(getMerchantEquipmentLevelRange(cap),[91,100]);assert.equal(areaLevelRange(11),null);
 for(const mutate of [x=>x.areaProgress.dwarf.unlocked.push(11),x=>x.areaProgress.dwarf.cleared=[2],x=>x.areaProgress.dwarf.unlocked=[1,3],x=>x.areaProgress.elf.unlocked=[1],x=>x.areaProgress.fake={unlocked:[1],cleared:[]}]){
  const bad=structuredClone(s);mutate(bad);assert(!validSave(bad));
 }
 console.log('Area progression: true final-clear-only/idempotent/offline unlock, no fabricated legacy progress, isolated races, max10 bands, merchant1–10→11–20 only on refresh, no hero scaling/cap: PASS');
}finally{Math.random=random;}
