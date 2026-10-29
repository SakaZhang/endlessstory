import {completeStory} from './story-event-test-fixture.mjs';
import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
import {SAVE_KEY,loadProgress} from './dist/storage.js';
import {RETURN_RING_EVENTS,RETURN_RING_MATERIALS} from './dist/return-ring-content.js';
import {beginNpcEvent as beginCurrentNpcEvent,declineNpcEvent,npcEventReady,recordNpcEventVictory,validNpcEventState} from './dist/npc-events.js';
import {claimTaskReward} from './dist/task-reward-transaction.js';
import {renderNpcEventBoard} from './dist/npc-event-ui.js';
import {syncReturnRingRecipe,returnRingMaterialUsage,returnRingRecipeKnown,returnRingRareBonus} from './dist/return-ring-state.js';
import {craftReturnRing,createReturnRingCraftService} from './dist/return-ring-crafting.js';
const clone=structuredClone,now=Date.now(),storyFixtures=new Map();
// Recreate the pre-update accepted ledger to retain historical contract coverage.
function beginNpcEvent(s,id,now){const ok=beginCurrentNpcEvent(s,id,now);if(ok){delete s.npcObjectiveProgress.entries[id];s.npcEvents.entries[id].lastEncounterId=null;}return ok;}
function storyFixture(race){if(!storyFixtures.has(race))storyFixtures.set(race,completeStory(race));return clone(storyFixtures.get(race));}
function storage(game){let raw=JSON.stringify(game);return {fail:false,writes:0,get length(){return 1},key:()=>SAVE_KEY,getItem:k=>k===SAVE_KEY?raw:null,setItem(k,v){if(this.fail)throw Error('quota');assert.equal(k,SAVE_KEY);this.writes++;raw=v},removeItem(){}};}
function at(def){const s=storyFixture(def.race);E.normalizeHealth(s,now);E.normalizeAreaProgress(s);E.normalizeExpedition(s);s.areaProgress[def.race]={unlocked:[1,2,3,4,5,6],cleared:[1,2,3,4,5]};s.siteId=def.areaId;s.location=E.AREAS[def.areaId].number-1;s.expedition.fieldId=def.areaId+'.field';assert(E.validSave(s));return s;}
function victory(s,def){const e=E.startInstanceEncounter(s,def.areaId+'.field',Math.max(now,s.lastHealthClock??now)+2000);assert(e);for(const u of e.enemies){u.hp=1;u.control.stunUntil=s.lastHealthClock+1e8;}for(let n=0;n<50&&!e.done;n++)E.step(s,e);assert(e.win);E.reward(s,e,Math.max(now,s.lastHealthClock??now)+2100);s.running=false;assert(E.validSave(s));return e;}
for(const def of RETURN_RING_EVENTS){
 let s=at(def),store=storage(s);const hidden=clone(s);delete hidden.story;assert(!beginNpcEvent(hidden,def.id,now));assert(!renderNpcEventBoard(hidden,{race:def.race,areaId:def.areaId}).includes(def.id));
 assert(beginNpcEvent(s,def.id,now));assert(!npcEventReady(s,def.id));store=storage(s);assert.equal(claimTaskReward(store,s,def.id).reason,'not-ready');
 // Only actual post-acceptance settlement counts, not repeats/summons/old history.
 const e=victory(s,def);assert.equal(s.npcEvents.entries[def.id].count,1);assert(!recordNpcEventVictory(s,e));assert(npcEventReady(s,def.id));
 E.setLootFilter(s,'materials',[3]);store=storage(s);const before=clone(s),raw=store.getItem(SAVE_KEY);store.fail=true;assert.equal(claimTaskReward(store,s,def.id,{now}).reason,'storage');assert.deepEqual(s,before);assert.equal(store.getItem(SAVE_KEY),raw);store.fail=false;
 const result=claimTaskReward(store,s,def.id,{now});assert(result.ok);s=result.game;assert.equal(s.materialStacks[def.rewards[0].key],1);assert.equal(s.npcEvents.entries[def.id].status,'resolved');assert.deepEqual(s.lootFilters,before.lootFilters);assert(E.validSave(s));assert(!loadProgress(store).blocked);
 assert.equal(claimTaskReward(store,s,def.id).reason,'already-claimed');assert.equal(claimTaskReward(store,before,def.id).reason,'already-claimed');assert(!beginNpcEvent(s,def.id,now+999999));
 // Ordinary loss does not reset completion, trigger a warning, or produce another.
 delete s.materialStacks[def.rewards[0].key];store=storage(s);assert.equal(claimTaskReward(store,s,def.id).reason,'already-claimed');assert.equal(returnRingMaterialUsage(s,def.rewards[0].key.split('|')[0]),null);
 const declined=at(def);assert(declineNpcEvent(declined,def.id));assert(!beginNpcEvent(declined,def.id,now));assert(E.validSave(declined));
}
// Real full material bag: no completion, cost/reward mutation or lost reward on failure.
const def=RETURN_RING_EVENTS[0];let s=at(def);beginNpcEvent(s,def.id,now);victory(s,def);
const keys=Object.keys(E.MATERIALS).filter(k=>!E.MATERIALS[k].storyOnly).flatMap(k=>[0,1,2,3].map(q=>E.materialKey(k,q)).filter(Boolean));s.materialStacks=Object.fromEntries(keys.slice(0,100).map(k=>[k,1]));let store=storage(s),before=clone(s);assert.equal(claimTaskReward(store,s,def.id).reason,'reward-unavailable');assert.deepEqual(s,before);delete s.materialStacks[keys[99]];store=storage(s);assert(claimTaskReward(store,s,def.id).ok);
// Remote, live combat and war gates cannot be bypassed by button/action calls.
s=at(def);s.siteId='dwarf.a01';s.location=0;assert(!beginNpcEvent(s,def.id,now));s=at(def);s.running=true;assert(!beginNpcEvent(s,def.id,now));
// Guaranteed recipe depends only on the real mandatory flag, not token ownership.
s=E.fresh();assert(!syncReturnRingRecipe(s));s=storyFixture('dwarf');assert(syncReturnRingRecipe(s));assert(returnRingRecipeKnown(s));assert(!syncReturnRingRecipe(s));assert.equal(returnRingMaterialUsage(s,RETURN_RING_MATERIALS[0].material),'归途之环配方材料');
for(const m of RETURN_RING_MATERIALS)s.materialStacks[m.material+'|3']=1;s.gold=1000;store=storage(s);before=clone(s);assert.equal(createReturnRingCraftService({approved:false,bonusPP:.03,pools:[]})(store,s).reason,'balance-unconfirmed');assert.deepEqual(s,before);
// Trusted approved-policy fixture verifies the real manufacturing transaction; no
// production policy is assigned by this test. Exactly five inputs, once ledger.
const craft=createReturnRingCraftService({approved:true,bonusPP:.03,pools:['boss-legendary']});const ingredients=RETURN_RING_MATERIALS.map(m=>m.material+'|3');
assert.equal(craft(store,s,ingredients.slice(1)).reason,'ingredients');store.fail=true;const oldRandom=Math.random;let draws=0;Math.random=()=>{draws++;return .42};assert.equal(craft(store,s,ingredients,{now}).reason,'storage');const firstDraws=draws;store.fail=false;let made=craft(store,s,ingredients,{now});Math.random=oldRandom;assert(made.ok);assert.equal(draws,firstDraws,'retry retains exact rolled result');s=made.game;const ring=made.value;assert(s.returnRing.crafted);assert.equal(s.returnRing.craftedItemId,ring.id);assert.equal(s.gold,960);assert(ingredients.every(k=>s.materialStacks[k]===0));assert(E.validSave(s));assert.equal(craft(store,s).reason,'already-crafted');
assert(E.equipItem(s,ring.id,'ring1'));assert.equal(returnRingRareBonus(s,'boss-legendary'),.03,'approved runtime adds three percentage points');assert.equal(returnRingRareBonus(s,'boss-legendary',{approved:true,bonusPP:.03,pools:['boss-legendary']}),.03);assert.equal(returnRingRareBonus(s,'gem',{approved:true,bonusPP:.03,pools:['boss-legendary']}),0);
// Fixed 15%-max recovery executes in actual settlement before dungeon carry.
for(const kind of ['field','dungeon']){s.running=false;s.nextBattleAt=0;const e=E.startInstanceEncounter(s,'dwarf.a01.'+kind,Math.max(now,s.lastHealthClock??now)+5000);assert(e);for(const u of e.enemies){u.hp=1;u.control.stunUntil=s.lastHealthClock+1e8;}e.heroHp=1;s.heroHp=1;for(let n=0;n<50&&!e.done;n++)E.step(s,e);assert(e.win);const hpBefore=s.heroHp;E.reward(s,e,Math.max(now,s.lastHealthClock??now)+5100);const healedHp=Math.min(E.stats(s).hp,hpBefore+E.stats(s).hp*.15);assert.equal(s.heroHp,healedHp);assert.equal(e.heroHp,healedHp);if(kind==='dungeon'){const next=clone(s);next.nextBattleAt=0;const nextStage=E.startInstanceEncounter(next,'dwarf.a01.dungeon',next.lastHealthClock+5000);assert(nextStage);assert.equal(nextStage.heroHp,healedHp);}assert(E.validSave(s));s.dungeonRun=null;}
s.running=false;E.equipItem(s,s.inventory.find(i=>i.slot==='ring'&&!i.legendaryId).id,'ring1');
// Standard value-refine changes only ordinary affixes, never the fixed identity.
const identity=clone(ring.exclusive),cost=E.getReforgeCost(ring,'value',s);s.gold+=cost.gold;for(const [key,n]of Object.entries(cost.materials??{}))s.materialStacks[E.materialKey(key,0)]=(s.materialStacks[E.materialKey(key,0)]??0)+n;assert(E.reforge(s,ring.id,'value',0));assert(E.resolveReforge(s,true,s.pendingReforge.operationId));assert.deepEqual(s.inventory.find(i=>i.id===ring.id).exclusive,identity);assert.equal(s.inventory.find(i=>i.id===ring.id).affixes.length,4);
const consumed=E.forge(s,[{kind:'equipment',id:ring.id}]);assert(consumed);assert(!consumed.legendaryId);assert.equal(consumed.rarity,3);assert(!s.inventory.some(i=>i.id===ring.id));store=storage(s);assert(s.returnRing.crafted);assert.equal(craft(store,s).reason,'already-crafted');assert(E.validSave(s));
// Imported malformed event and unique ledgers fail save validation.
for(const value of [null,{},[],{version:1,entries:{'bad.event':{}}}]){const state=E.fresh();state.npcEvents=value;assert(!validNpcEventState(state));assert(!E.validSave(state));}
console.log('PASS Return Ring: five canonical Q3 scenes; real victory objectives, closed story/recipe flags, full-bag/save retry, filters, decline/loss permanence, idempotency, fixed craft retry, one-craft ledger, field/dungeon 15%-max recovery and explicit unapproved-policy safety gate and approved +3pp runtime.');
