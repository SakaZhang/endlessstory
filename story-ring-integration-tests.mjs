import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
import {completeStory,visitSceneSite} from './story-event-test-fixture.mjs';
import {RETURN_RING_EVENTS,RETURN_RING_MATERIALS} from './dist/return-ring-content.js';
import {beginNpcEvent,npcEventReady} from './dist/npc-events.js';
import {syncReturnRingRecipe,returnRingRareBonus} from './dist/return-ring-state.js';
import {createReturnRingCraftService} from './dist/return-ring-crafting.js';
import {claimTaskReward} from './dist/task-reward-transaction.js';
import {SAVE_KEY,loadProgress} from './dist/storage.js';

const clone=structuredClone,races=['human','dwarf','elf','goblin','ashen'];
function memory(game){let raw=JSON.stringify(game);return {fail:false,get length(){return 1},key:()=>SAVE_KEY,getItem:k=>k===SAVE_KEY?raw:null,setItem(k,value){assert.equal(k,SAVE_KEY);if(this.fail)throw Error('quota');raw=value},removeItem(){}};}
function fight(s,e=s.activeEncounter){
 assert(e);let turns=0;while(!e.done&&turns++<3000)E.step(s,e,s.nextActionAt);
 assert(e.done&&e.win,'real victory '+e.instanceId+' stage '+e.dungeonStage+' HP '+e.heroHp+' round '+e.round);E.reward(s,e,s.lastHealthClock);s.running=false;s.lastSeen=s.lastHealthClock;assert(E.validSave(s));return e;
}
function enter(s,node){s.running=false;const t=Math.max(s.lastSeen,s.lastHealthClock??0,s.nextBattleAt??0)+2000;assert(E.chooseAdventureNode(s,node,{start:true},t),'enter '+node);return s.activeEncounter;}
function unlockSix(s,race){
 assert(E.startRest(s,Math.max(s.lastSeen,s.lastHealthClock??0)+2000));assert(E.settleRest(s,s.restUntil));s.lastSeen=s.lastHealthClock;
 enter(s,race+'.a05.dungeon');let stages=0;
 do{fight(s);if(s.dungeonRun)assert(E.startInstanceEncounter(s,race+'.a05.dungeon',s.nextBattleAt+2000));}while(s.dungeonRun&&stages++<20);
 assert(s.areaProgress[race].unlocked.includes(6),'actual dungeon progression unlocks '+race+' area6');
}

// Every playable POV reaches all five optional material flags through actual
// canonical scene actions/encounters, never through a fabricated flag-only save.
const completed=new Map();
for(const race of races){
 const s=completeStory(race);assert(RETURN_RING_EVENTS.every(d=>s.story.flags.includes(d.requiresStoryFlag)),race+' can find all five materials');
 assert(!s.returnRing);assert(syncReturnRingRecipe(s),'mandatory C06 recipe '+race);assert(!syncReturnRingRecipe(s));
 assert(RETURN_RING_MATERIALS.every(m=>E.materialCount(s,m.material,3)===0),'recipe is independent of owning optional materials');
 assert(E.validSave(s));const restored=loadProgress(memory(s));assert(!restored.blocked);assert.deepEqual(restored.game.story,s.story);assert.deepEqual(restored.game.returnRing,s.returnRing);completed.set(race,s);
}

// One real character visits and claims all five one-time events, with canonical
// story receipts, real movement, area6 unlocks and post-acceptance combat.
let s=clone(completed.get('dwarf'));
// A level-60 test character receives valid level-matched gear through the real
// generator/equip APIs; encounter HP, enemies and settlement are never forged.
for(const [socket,id] of Object.entries(s.equip)){const old=s.inventory.find(i=>i.id===id),gear=E.item(old.slot,s.level,null,2,{originRace:s.race});s.inventory.push(gear);assert(E.equipItem(s,gear.id,socket));}
assert(E.validSave(s));
unlockSix(s,'goblin');unlockSix(s,'ashen');
for(const def of RETURN_RING_EVENTS){
 visitSceneSite(s,{id:def.id,siteId:def.areaId});const beforeKills=s.kills;
 assert(beginNpcEvent(s,def.id,s.lastSeen));assert(!npcEventReady(s,def.id),'old travel kill never counts');
 fight(s,E.startInstanceEncounter(s,def.areaId+'.field',s.nextBattleAt+2000));assert.equal(s.kills,beforeKills+1);assert(npcEventReady(s,def.id));
 const store=memory(s),before=clone(s),raw=store.getItem(SAVE_KEY);store.fail=true;
 assert.equal(claimTaskReward(store,s,def.id,{now:s.lastSeen}).reason,'storage');assert.deepEqual(s,before);assert.equal(store.getItem(SAVE_KEY),raw);
 store.fail=false;const tx=claimTaskReward(store,s,def.id,{now:s.lastSeen});assert(tx.ok);s=tx.game;
 assert.equal(E.materialCount(s,def.rewards[0].key.split('|')[0],3),1);assert.equal(claimTaskReward(store,s,def.id,{now:s.lastSeen}).reason,'already-claimed');
 const restored=loadProgress(store);assert(!restored.blocked);s=restored.game;
}
assert.equal(s.taskRewardClaims.filter(id=>id.startsWith('npc.return-ring.')).length,5);
const craft=createReturnRingCraftService(),store=memory(s),beforeCraft=clone(s);store.fail=true;
assert.equal(craft(store,s,undefined,{now:s.lastSeen}).reason,'storage');assert.deepEqual(s,beforeCraft);store.fail=false;
const tx=craft(store,s,undefined,{now:s.lastSeen});assert(tx.ok);s=tx.game;const ring=tx.value;
assert(s.returnRing.crafted);assert(RETURN_RING_MATERIALS.every(m=>E.materialCount(s,m.material,3)===0));assert.equal(craft(store,s,undefined,{now:s.lastSeen}).reason,'already-crafted');

// Real saved equipment plans toggle the identity-driven bonus, not ownership.
assert(E.saveLoadout(s,0,'without ring'));assert(E.equipItem(s,ring.id,'ring2'));assert(E.saveLoadout(s,1,'return home'));
assert.equal(returnRingRareBonus(s,'material-gem'),.03);assert(E.applyLoadout(s,0));assert.equal(returnRingRareBonus(s,'material-gem'),0);assert(E.applyLoadout(s,1));
let restored=loadProgress(memory(s));assert(!restored.blocked);s=restored.game;assert.equal(returnRingRareBonus(s,'material-special'),.03);

// Field, intermediate dungeon stage and boss wins heal exactly once, and a
// subsequent loadout swap/refresh/replayed reward never grants another heal.
for(const node of ['dwarf.a01.field','dwarf.a01.dungeon','dwarf.a03.boss']){
 const trial=clone(s);trial.heroHp=E.stats(trial).hp-7;const e=enter(trial,node);fight(trial,e);
 assert.equal(trial.heroHp,E.stats(trial).hp,node);assert.equal(e.heroHp,E.stats(trial).hp,node);
 if(node.endsWith('.dungeon')){const next=E.startInstanceEncounter(trial,node,trial.nextBattleAt+2000);assert(next&&next.dungeonStage>e.dungeonStage);assert.equal(next.heroHp,E.stats(trial).hp);}
 else {trial.heroHp=5;E.reward(trial,e,trial.lastSeen+2000);assert.equal(trial.heroHp,5,'replay cannot heal');assert(E.applyLoadout(trial,0));assert(E.applyLoadout(trial,1));assert.equal(trial.heroHp,5,'loadout cannot heal');assert.equal(loadProgress(memory(trial)).game.heroHp,5,'reload cannot heal');}
}

// The same admitted battle settles identically online/offline with the Ring.
const initial=clone(s);initial.heroHp=E.stats(initial).hp-11;enter(initial,'dwarf.a01.field');initial.stopAfterBattle=true;
const online=clone(initial),off=clone(initial);fight(online);const report=E.offline(off,initial.lastSeen+60000);
assert.equal(report.kills,1);for(const key of ['gold','xp','level','kills','heroHp'])assert.equal(off[key],online[key],key);
assert.deepEqual(off.materialStacks,online.materialStacks);assert.deepEqual(off.returnRing,online.returnRing);assert.deepEqual(off.story,online.story);assert.deepEqual(off.npcEvents,online.npcEvents);assert.deepEqual(off.loadouts,online.loadouts);assert.equal(off.heroHp,E.stats(off).hp);assert(E.validSave(off));

console.log('PASS integrated five-POV C06 recipe + one-character five real optional claims, actual area6 unlocks, storage rollback/reload, exact five-input once craft, loadout-gated bonus, field/stage/boss one-time heal, and online/offline settlement parity.');
