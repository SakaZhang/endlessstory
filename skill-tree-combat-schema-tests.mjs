import assert from 'node:assert/strict';
import {validMultiCastRecord} from './dist/multi-combat.js';
import * as E from './dist/engine.js';
const enemies=[{id:'a'},{id:'b'}];
const record={recordVersion:2,id:'cast',skillId:'cinder_barrage',scope:'all',hits:enemies.flatMap(u=>Array.from({length:3},(_,hitIndex)=>({id:`cast:${u.id}:${hitIndex}`,targetId:u.id,hitIndex,hit:true})))};
assert(validMultiCastRecord(record,enemies));
for(const mutate of [c=>c.recordVersion=3,c=>c.hits.push({...c.hits[0]}),c=>c.hits[1].id=c.hits[0].id,c=>c.hits[1].hitIndex=0,c=>c.hits[0].hitIndex=3,c=>c.hits[0].targetId='missing',c=>c.hits[0].hitIndex=.5]){const c=structuredClone(record);mutate(c);assert(!validMultiCastRecord(c,enemies));}
const legacy={...record};delete legacy.recordVersion;assert(!validMultiCastRecord(legacy,enemies));legacy.hits=legacy.hits.slice(0,1);assert(validMultiCastRecord(legacy,enemies));
const s=E.fresh();s.heroHp=E.stats(s).hp;s.restUntil=0;s.nextActionAt=0;s.nextBattleAt=0;s.lastSeen=s.lastHealthClock=10000;const e=E.startDeveloperGroup(s,{count:2,seed:9},10000);assert(e);
e.lastCast={...record,hits:e.enemies.flatMap(u=>Array.from({length:3},(_,hitIndex)=>({id:`cast:${u.id}:${hitIndex}`,targetId:u.id,hitIndex,hit:true,hpBefore:u.hp,hpAfter:u.hp,actualHpLost:0,killProcHpLost:0})))};
assert(E.validSave(s));assert(E.validSave(JSON.parse(JSON.stringify(s))));
e.lastCast.hits[0].hitIndex=3;assert(!E.validSave(s));
console.log('Skill tree combat schema: bounded three-segment records, stable unique hit identities, legacy bounds, actual save/reload validation PASS');
