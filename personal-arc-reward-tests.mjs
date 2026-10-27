import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
import {completePersonalArc} from './personal-arc-test-fixture.mjs';
import {validPersonalArcRewardState} from './dist/personal-arc-rewards.js';
const clone=structuredClone;
const store=s=>({raw:JSON.stringify(s),writes:0,failAt:0,getItem(){return this.raw;},setItem(k,v){assert.equal(k,'ashencrown-v6');this.writes++;if(this.writes===this.failAt)throw Error('quota');this.raw=v;}});
const now=s=>Math.max(s.lastSeen,s.lastHealthClock??0)+1000;
const persist=(st,s)=>{st.raw=JSON.stringify(s);};
const assertOrdinary=(it,race,slot,level)=>{assert.equal(it.slot,slot);assert.equal(it.originRace,race);assert.equal(it.rarity,3);assert.equal(it.set,null);assert.equal(it.legendaryId,null);assert.equal(it.affixes.length,4);assert.equal(it.baseLevel,level);assert(it.level>=Math.max(1,level-2)&&it.level<=level+2);assert.equal(E.EQUIPMENT_TEMPLATE_BY_ID[it.templateId].kind,'scatter');};
const seeds=new Map();
for(const d of Object.values(E.PERSONAL_ARC_REWARDS)){
 const s=completePersonalArc(d.race);assert(E.validSave(s));assert(s.story.completedScenes.includes(d.finalSceneId));seeds.set(d.race,s);
 assert.equal(E.personalArcRewardStatus(s,d.id).status,'ready');
 assert.deepEqual(E.personalArcRewardSlots(s),E.SLOTS.filter(x=>x!=='core'||d.race==='ashen'));
 for(const level of [1,100])for(const slot of E.personalArcRewardSlots(s)){
  const candidate=clone(s);candidate.level=level;assert(E.validSave(candidate));const st=store(candidate),before=st.raw;
  const tx=E.claimPersonalArcReward(st,candidate,d.id,slot,{now:now(candidate)});assert(tx.ok,tx.reason);assert.equal(JSON.stringify(candidate),before);assert.equal(st.writes,3);assert(E.validSave(tx.game));
  const it=tx.game.inventory.find(x=>x.id===tx.value.itemId);assertOrdinary(it,d.race,slot,level);
  const reload=JSON.parse(st.raw);assert.equal(E.claimPersonalArcReward(st,reload,d.id,slot,{now:now(reload)}).reason,'already-claimed');assert.equal(reload.taskRewardClaims.filter(x=>x===d.claimId).length,1);
  assert.equal(E.claimPersonalArcReward(st,candidate,d.id,slot,{now:now(candidate)}).reason,'already-claimed');assert.equal(st.writes,3);
 }
 const fresh=E.fresh(d.race),st=store(fresh);assert.equal(E.claimPersonalArcReward(st,fresh,d.id,'weapon',{now:now(fresh)}).reason,'not-ready');assert.equal(st.writes,0);
 const fake=clone(fresh);fake.story={completedScenes:[d.finalSceneId]};assert(!E.validSave(fake));
 for(const other of Object.values(E.PERSONAL_ARC_REWARDS).filter(x=>x.race!==d.race))assert.equal(E.claimPersonalArcReward(store(s),s,other.id,'weapon',{now:now(s)}).reason,'not-ready');
}
const d=E.PERSONAL_ARC_REWARDS['personal.goblin.family'],seed=seeds.get('goblin');
function fullBag(){const s=clone(seed);while(E.bagCounts(s).equipment.weapon<50)s.inventory.push(E.item('weapon',1,null,0,{originRace:'goblin'}));assert(E.validSave(s));return s;}
let s=fullBag(),st=store(s),tx=E.claimPersonalArcReward(st,s,d.id,'weapon',{now:now(s)});
assert.equal(tx.reason,'reward-unavailable');assert.equal(st.writes,2);assert(E.validSave(tx.game));let pending=clone(tx.game.personalArcRewards[d.id]);assert(pending.item);assert.equal(s.personalArcRewards,undefined);
const fixed=JSON.stringify(pending.item);s=JSON.parse(st.raw);s.level=100;persist(st,s);
const globalRandom=Math.random;Math.random=()=>{throw Error('retry must not draw fresh randomness');};try{assert.equal(E.claimPersonalArcReward(st,s,d.id,undefined,{now:now(s)}).reason,'reward-unavailable');}finally{Math.random=globalRandom;}
assert.equal(E.claimPersonalArcReward(st,s,d.id,'ring',{now:now(s)}).reason,'slot-locked');
assert.equal(E.claimPersonalArcReward(st,s,d.id,undefined,{now:now(s)}).reason,'reward-unavailable');assert.equal(JSON.stringify(JSON.parse(st.raw).personalArcRewards[d.id].item),fixed);
s.inventory.splice(s.inventory.findIndex(it=>it.slot==='weapon'&&!Object.values(s.equip).includes(it.id)),1);persist(st,s);tx=E.claimPersonalArcReward(st,s,d.id,undefined,{now:now(s)});assert(tx.ok,tx.reason);assert.equal(JSON.stringify(tx.game.inventory.find(it=>it.id===pending.item.id)),fixed);
// The task reward never touches a forge result and bypasses only its own filter.
{const independent=clone(seed);independent.pendingForgeClaim={kind:'equipment',item:E.item('helm',12,null,2,{originRace:'goblin'})};independent.lootFilters={equipment:[3],materials:[],items:[]};const local=store(independent),result=E.claimPersonalArcReward(local,independent,d.id,'ring',{now:now(independent)});assert(result.ok,result.reason);assert.deepEqual(result.game.pendingForgeClaim,independent.pendingForgeClaim);assert.deepEqual(result.game.lootFilters,independent.lootFilters);}
// Losing/selling a claimed item never makes it claimable again.
s=clone(tx.game);s.inventory=s.inventory.filter(it=>it.id!==pending.item.id);persist(st,s);assert.equal(E.claimPersonalArcReward(st,s,d.id,'weapon',{now:now(s)}).reason,'already-claimed');
// Failure at EACH durable boundary, followed by actual reload recovery.
for(const failAt of [1,2,3]){
 s=clone(seed);st=store(s);st.failAt=failAt;const original=st.raw;tx=E.claimPersonalArcReward(st,s,d.id,'ring',{now:now(s)});assert.equal(tx.reason,'storage');assert.equal(JSON.stringify(s),original);assert.equal(JSON.stringify(tx.game),st.raw);
 let reload=JSON.parse(st.raw);assert(E.validSave(reload));const reservation=clone(reload.personalArcRewards?.[d.id]);
 if(failAt===1)assert.equal(reservation,undefined);else{assert.equal(reservation.slot,'ring');assert.equal(reservation.baseLevel,s.level);assert.equal(E.claimPersonalArcReward(st,reload,d.id,'helm',{now:now(reload)}).reason,'slot-locked');}
 if(failAt===2)assert.equal(reservation.item,undefined);if(failAt===3)assert(reservation.item);
 let expectedItem=null;if(reservation){const alternate=clone(reload),alternateStore=store(alternate);const result=E.claimPersonalArcReward(alternateStore,alternate,d.id,'ring',{now:now(alternate)});assert(result.ok,result.reason);expectedItem=result.game.inventory.find(it=>it.id===result.value.itemId);reload.level=100;persist(st,reload);}
 st.failAt=0;tx=E.claimPersonalArcReward(st,reload,d.id,'ring',{now:now(reload)});assert(tx.ok,tx.reason);if(expectedItem)assert.deepEqual(tx.game.inventory.find(it=>it.id===tx.value.itemId),expectedItem);if(reservation?.item)assert.deepEqual(tx.game.inventory.find(it=>it.id===tx.value.itemId),reservation.item);assert.equal(tx.game.taskRewardClaims.filter(x=>x===d.claimId).length,1);
}
// A newer save and failed read cannot be overwritten by an old UI snapshot.
s=clone(seed);st=store(s);const newer=clone(s);newer.gold++;persist(st,newer);assert.equal(E.claimPersonalArcReward(st,s,d.id,'ring',{now:now(s)}).reason,'stale-state');assert.equal(st.writes,0);assert.equal(st.raw,JSON.stringify(newer));
assert.equal(E.claimPersonalArcReward({getItem(){throw Error('read');}},s,d.id,'ring',{now:now(s)}).reason,'storage-read');
// Safe clock boundary, unknown IDs, and non-Ashen core requests do not write.
for(const time of [-1,NaN,Infinity,1e15+1,now(s)+.5,s.lastSeen-1]){st=store(s);assert.equal(E.claimPersonalArcReward(st,s,d.id,'ring',{now:time}).reason,'invalid-clock');assert.equal(st.writes,0);}
st=store(s);assert.equal(E.claimPersonalArcReward(st,s,d.id,'core',{now:now(s)}).reason,'invalid-slot');assert.equal(st.writes,0);
for(const id of ['__proto__','constructor','family.milestone.six-moments'])assert.equal(E.claimPersonalArcReward(st,s,id,'ring',{now:now(s)}).reason,'not-available');
// Serialized reservation integrity and provenance fail closed.
s=fullBag();st=store(s);tx=E.claimPersonalArcReward(st,s,d.id,'weapon',{now:now(s)});const reserved=tx.game;
for(const mutate of [p=>p.seed=-1,p=>p.seed=2**32,p=>p.baseLevel=0,p=>p.slot='core',p=>p.reservedAt=NaN,p=>p.version=2,p=>p.extra=true,p=>p.item.level++,p=>p.item.affixes[0].value++,p=>p.item.id='replacement',p=>p.item.set='guard',p=>p.item.legendaryId='ashen-primal-core']){const bad=clone(reserved);mutate(bad.personalArcRewards[d.id]);assert(!validPersonalArcRewardState(bad));assert(!E.validSave(bad));}
for(const mutate of [x=>x.personalArcRewards=null,x=>x.personalArcRewards=[],x=>x.taskRewardClaims=[...(x.taskRewardClaims??[]),d.claimId],x=>x.inventory.push(clone(x.personalArcRewards[d.id].item)),x=>x.story.completedScenes=x.story.completedScenes.filter(id=>id!==d.finalSceneId)]){const bad=clone(reserved);mutate(bad);assert(!E.validSave(bad));}
// Fixed small/stage budgets: all 25 source scenes, both tiers, atomic failed save.
for(const event of Object.values(E.PERSONAL_EVENT_REWARDS)){
 s=clone(seeds.get(event.race));const capped=clone(s);if(event.tier==='stage')capped.consumables.reforgeToken=1e9;else{E.normalizePotions(capped);capped.potionStacks['healing|0']=1e9;}const capStore=store(capped);assert.equal(E.claimPersonalEventReward(capStore,capped,event.id,{now:now(capped)}).reason,'reward-unavailable');assert.equal(capStore.writes,0);assert.equal(capStore.raw,JSON.stringify(capped));
 st=store(s);st.failAt=1;assert.equal(E.claimPersonalEventReward(st,s,event.id,{now:now(s)}).reason,'storage');assert.equal(st.raw,JSON.stringify(s));st.failAt=0;
 tx=E.claimPersonalEventReward(st,s,event.id,{now:now(s)});assert(tx.ok,tx.reason);assert(E.validSave(tx.game));assert.equal(tx.game.taskRewardClaims.filter(id=>id===event.claimId).length,1);assert.equal(E.claimPersonalEventReward(st,tx.game,event.id,{now:now(tx.game)}).reason,'already-claimed');
 if(event.tier==='stage')assert.equal(tx.game.consumables.reforgeToken,(s.consumables.reforgeToken??0)+1);else assert.equal(tx.game.potionStacks['healing|0'],(s.potionStacks?.['healing|0']??0)+2);
 const forged=E.fresh(event.race);forged.taskRewardClaims=[event.claimId];assert(!E.validSave(forged));
}
console.log('PASS personal rewards: real five-line completion, all race/slot choices and 1/100 levels, three durable write failures, full bag fixed retry/reload, slot lock, current level, source/protagonist integrity, no duplicates, 25 fixed early/stage budgets, clock and newer-save guards.');
