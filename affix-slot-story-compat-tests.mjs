import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as E from './dist/engine.js';
import {ordinaryAffixKeys} from './dist/affix-slot-pools.js';
import {completePersonalArc} from './personal-arc-test-fixture.mjs';
// Frozen with git HEAD v0.72 engine/legendary factory, not today's generation seam.
const goldens=JSON.parse(fs.readFileSync(new URL('./fixtures/affix-slot-v072-personal-rewards.json',import.meta.url)));
const clone=structuredClone,store=s=>({raw:JSON.stringify(s),writes:0,failAt:0,getItem(){return this.raw;},setItem(k,v){this.writes++;if(this.writes===this.failAt)throw Error('quota');this.raw=v;}});
const now=s=>Math.max(s.lastSeen,s.lastHealthClock??0)+1000;
const states=new Map();
for(const race of new Set(goldens.map(r=>r.race)))states.set(race,completePersonalArc(race));
let oldOffSlot=0;
for(const {race,id,p} of goldens){
 assert(p.item.affixes.length===4);oldOffSlot+=p.item.affixes.filter(a=>!ordinaryAffixKeys(p.slot).includes(a.stat)).length;
 for(const materialized of [false,true]){
  const s=clone(states.get(race)),pending=clone(p);pending.reservedAt=s.lastSeen;if(!materialized)delete pending.item;
  s.personalArcRewards={[id]:pending};assert(E.validSave(s),`old ${race}/${p.slot} stage ${materialized?2:1}`);
  const st=store(s),gold=s.gold,materials=clone(s.materialStacks),consumables=clone(s.consumables),random=Math.random;
  let result;Math.random=()=>{throw Error('Old reserved reward must not draw fresh randomness');};
  try{result=E.claimPersonalArcReward(st,s,id,undefined,{now:now(s)});}finally{Math.random=random;}
  assert(result.ok,result.reason);assert(E.validSave(result.game));assert.deepEqual(result.game.inventory.find(i=>i.id===p.item.id),p.item,'old ID/value/source preserved exactly');
  assert.equal(result.game.gold,gold);assert.deepEqual(result.game.materialStacks,materials);assert.deepEqual(result.game.consumables,consumables);
  assert.equal(st.writes,materialized?1:2);assert.equal(E.claimPersonalArcReward(st,JSON.parse(st.raw),id,undefined,{now:now(result.game)}).reason,'already-claimed');
 }
 // Fail the materialization write, then reload the durable new reservation.
 const s=clone(states.get(race)),st=store(s);st.failAt=2;
 const reserved=E.claimPersonalArcReward(st,s,id,p.slot,{now:now(s)});assert.equal(reserved.reason,'storage');
 const reload=JSON.parse(st.raw);assert.equal(reload.personalArcRewards[id].version,3);assert.equal(reload.personalArcRewards[id].item,undefined);assert(E.validSave(reload));
 st.failAt=0;const result=E.claimPersonalArcReward(st,reload,id,undefined,{now:now(reload)});assert(result.ok,result.reason);
 const it=result.game.inventory.find(i=>i.id===result.value.itemId);assert.equal(it.slot,p.slot);assert.equal(it.affixes.length,4);assert(it.affixes.every(a=>ordinaryAffixKeys(p.slot).includes(a.stat)));assert(E.validSave(result.game));
}
assert(oldOffSlot>0,'goldens must exercise off-slot legacy rolls');
console.log(`PASS slot story compatibility: ${goldens.length} race/slot goldens, v1 reserved/materialized exact preservation, no fresh RNG/cost, v3 reservation reload slot generation.`);
