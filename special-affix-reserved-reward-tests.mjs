import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as E from './dist/engine.js';
import {withMultiRng} from './dist/multi-combat.js';
import {completePersonalArc} from './personal-arc-test-fixture.mjs';
const frozen=JSON.parse(fs.readFileSync(new URL('./fixtures/affix-special-v0812-personal-rewards.json',import.meta.url)));
assert.equal(frozen.baselineCommit,'4d60f7536fe7d28a4cee8429a320a9ce032a3bc1');
const clone=structuredClone,store=s=>({raw:JSON.stringify(s),writes:0,failAt:0,getItem(){return this.raw;},setItem(_k,v){this.writes++;if(this.writes===this.failAt)throw Error('quota');this.raw=v;}}),now=s=>Math.max(s.lastSeen,s.lastHealthClock??0)+1000;
const states=new Map();for(const race of new Set(frozen.rows.map(r=>r.race)))states.set(race,completePersonalArc(race));
// Both durable phases preserve every byte of the v0.81.2 factory result. These
// fixtures were generated from git4d60f753, not from today's compatibility seam.
for(const {race,id,p} of frozen.rows)for(const materialized of [false,true]){
 const s=clone(states.get(race)),reserved=clone(p);reserved.reservedAt=s.lastSeen;if(!materialized)delete reserved.item;s.personalArcRewards={[id]:reserved};assert(E.validSave(s),`${race}/${p.item.special.id}/phase${materialized?2:1}`);
 const storage=store(s),oldRandom=Math.random;let result;Math.random=()=>{throw Error('Committed reward must not draw new randomness');};try{result=E.claimPersonalArcReward(storage,s,id,undefined,{now:now(s)});}finally{Math.random=oldRandom;}
 assert(result.ok,result.reason);assert.deepEqual(result.game.inventory.find(i=>i.id===p.item.id),p.item);assert(E.validSave(result.game));assert.equal(storage.writes,materialized?1:2);assert.equal(E.claimPersonalArcReward(storage,JSON.parse(storage.raw),id,undefined,{now:now(result.game)}).reason,'already-claimed');
}
assert.deepEqual(new Set(frozen.rows.map(r=>r.p.item.special.id)),new Set(['knowledge','scavenger','momentum','shelter','nirvana','reaper','multicast']));
assert(!E.ACTIVE_SPECIAL_KEYS.includes('scavenger'));
// Newly reserved rewards write v3 and use the CURRENT nine-entry pool. A failed
// materialization/reload keeps that version, seed and newly rolled growth affix.
const s0=states.get('dwarf'),id='personal.dwarf.coup',seeds=new Map();
for(let seed=1;seed<10000&&seeds.size<3;seed++){
 const rng={id:`arc-${id}-${seed}`,rngState:seed,rngDraws:0,itemSerial:0},it=withMultiRng(rng,()=>{const min=Math.max(1,s0.level-2),level=min+Math.floor(Math.random()*(s0.level+2-min+1));return E.item('weapon',level,null,3,{baseLevel:s0.level,levelSource:'generated',originRace:'dwarf'});});
 if(['harvester','blesser','glutton'].includes(it.special?.id)&&!seeds.has(it.special.id))seeds.set(it.special.id,{seed,it});
}
assert.equal(seeds.size,3);
for(const [special,{seed,it}] of seeds){
 const s=clone(s0),storage=store(s);storage.failAt=2;const oldRandom=Math.random;let result;Math.random=()=>seed/2**32;try{result=E.claimPersonalArcReward(storage,s,id,'weapon',{now:now(s)});}finally{Math.random=oldRandom;}
 assert.equal(result.reason,'storage');const reserved=JSON.parse(storage.raw);assert.equal(reserved.personalArcRewards[id].version,3);assert.equal(reserved.personalArcRewards[id].seed,seed);assert.equal(reserved.personalArcRewards[id].item,undefined);storage.failAt=0;
 result=E.claimPersonalArcReward(storage,reserved,id,undefined,{now:now(reserved)});assert(result.ok,result.reason);const received=result.game.inventory.find(x=>x.id===it.id);assert.deepEqual(received,it);assert.equal(received.special.id,special);assert.equal(E.specialAffixProgress(received).kills,0);assert(E.validSave(result.game));
}
console.log(`PASS reserved special pools: ${frozen.rows.length} baseline v2 rewards ×2 durable phases exact, no new RNG, old scavenger inert/not generated; v3 current growth pool survives storage failure/reload.`);
