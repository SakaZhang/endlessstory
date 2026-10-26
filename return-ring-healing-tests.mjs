import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
import {applyReturnRingVictory,returnRingRareBonus} from './dist/return-ring-state.js';
import {preparedStoryGame} from './story-event-test-fixture.mjs';
import {SAVE_KEY,loadProgress} from './dist/storage.js';
const clone=structuredClone,originalRandom=Math.random;let seed=0x715eab1;Math.random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/2**32;};
const near=(a,b,label='')=>assert(Math.abs(a-b)<1e-8,`${label}: ${a} != ${b}`);
function equipped(race='dwarf'){
 const s=preparedStoryGame(race);for(const [socket,id] of Object.entries(s.equip)){const old=s.inventory.find(it=>it.id===id),gear=E.item(old.slot,s.level,null,2,{originRace:race});s.inventory.push(gear);assert(E.equipItem(s,gear.id,socket));}const ring=E.legendaryItem('return-ring',1);s.inventory.push(ring);s.returnRing={version:1,recipeLearned:true,crafted:true,craftedItemId:ring.id};assert(E.equipItem(s,ring.id,'ring1'));E.normalizePotions(s);s.potionSlot.auto=false;assert(E.validSave(s));return s;
}
function finish(s,e){let n=0;while(!e.done&&n++<3000)E.step(s,e,s.nextActionAt);assert(e.done&&e.win,e.instanceId+' actual victory');const before=s.heroHp,potions=clone(s.potionStacks),cd=s.potionReadyAt;assert(E.validSave(s),'valid pre-reward '+e.instanceId);E.reward(s,e,s.lastHealthClock);assert(e.rewarded,'actual settlement '+e.instanceId);near(s.heroHp,Math.min(E.stats(s).hp,before+E.stats(s).hp*.15),e.instanceId);near(e.heroHp,s.heroHp);assert.deepEqual(s.potionStacks,potions);assert.equal(s.potionReadyAt,cd);assert(E.validSave(s));return before;}
function start(s,node){s.running=false;const e=E.startInstanceEncounter(s,node,Math.max(s.lastHealthClock,s.nextBattleAt??0)+2000);assert(e,node);return e;}
function memory(s){const raw=JSON.stringify(s);return {get length(){return 1},key:()=>SAVE_KEY,getItem:k=>k===SAVE_KEY?raw:null};}
// Numeric edge tests are pure unit fixtures; they cannot manufacture live rewards.
function unit(hp,max=100){const ring={id:'ring',legendaryId:'return-ring',exclusive:{id:'return-home'}},e={done:true,win:true,rewarded:true,heroHp:hp},s={inventory:[ring],equip:{ring1:ring.id},heroHp:hp,activeEncounter:e};return {s,e,max};}
for(const [hp,max,expected] of [[10,100,25],[95,100,100],[.01,1,.16],[.9,1,1],[10.25,101,25.4]]){
 const {s,e}=unit(hp,max);assert(applyReturnRingVictory(s,e,max));near(s.heroHp,expected);near(e.heroHp,expected);assert.equal(e.rewardNotes.length,1);
}
for(const hp of [0,-1,NaN,Infinity,100,101]){const {s,e,max}=unit(hp),before=clone(s);assert(!applyReturnRingVictory(s,e,max));assert.deepEqual(s,before,'no revival/invalid HP/overheal');}
for(const max of [0,-1,NaN,Infinity]){const {s,e}=unit(1),before=clone(s);assert(!applyReturnRingVictory(s,e,max));assert.deepEqual(s,before);}
for(const alter of [s=>{s.equip={};},s=>{s.activeEncounter={...s.activeEncounter};},s=>{s.activeEncounter.done=false;},s=>{s.activeEncounter.win=false;},s=>{s.activeEncounter.rewarded=false;},s=>{s.activeEncounter.developmentFixture=true;}]){
 const {s,e,max}=unit(10);alter(s);const before=clone(s);assert(!applyReturnRingVictory(s,e,max));assert.deepEqual(s,before);
}
// All five races use the same final settlement; group/loot rounds do not multiply it.
for(const race of ['dwarf','human','elf','goblin','ashen'])for(const kind of ['field','boss']){
 const s=equipped(race);s.heroHp=E.stats(s).hp*.6;const node=kind==='boss'?Object.values(E.INSTANCES).find(x=>x.kind==='boss'&&x.id.startsWith(race+'.')).id:race+'.a01.field',e=start(s,node);finish(s,e);
 const after=s.heroHp,notes=clone(e.rewardNotes);E.reward(s,e,s.lastHealthClock+2000);assert.equal(s.heroHp,after);assert.deepEqual(e.rewardNotes,notes);assert(e.rewardNotes.filter(x=>x.startsWith('归途之环')).length<=1);
 assert.equal(returnRingRareBonus(s,'material-gem'),.03);assert.equal(returnRingRareBonus(s,'material-special'),.03);assert.equal(returnRingRareBonus(s,'boss-legendary'),.03);
 assert.equal(loadProgress(memory(s)).game.heroHp,after,'reload gives no extra recovery');
}
// Every ordinary-dungeon stage carries the reduced, fractional result to the next.
{
 const s=equipped();s.heroHp=E.stats(s).hp*.4;
 for(let stage=1;stage<=3;stage++){const before=s.heroHp,e=start(s,'dwarf.a01.dungeon');assert.equal(e.dungeonStage,stage);near(e.heroHp,before);finish(s,e);if(stage<3)assert(s.dungeonRun.carry);else assert.equal(s.dungeonRun,null);}
}
// Final post-XP maximum and passively increased HP form the base. Flat healing,
// received-heal multipliers and potion stock/CD are deliberately not applied.
{
 const s=equipped();s.skillTree.presets[0].unlocked.push('mountain_vitality');s.skillTree.presets[0].passive=['mountain_vitality',null];s.talents.healing=10;s.level=60;s.xp=60*80-1;assert(E.validSave(s));
 assert(E.stats(s).hp>E.baseStats(s).hp);assert(E.stats(s).healingBonus>0);s.heroHp=E.stats(s).hp*.4;const e=start(s,'dwarf.a01.field'),oldMax=E.stats(s).hp;finish(s,e);assert.equal(s.level,61);assert(E.stats(s).hp>oldMax);
}
// Nirvana remains its separate once-per-battle full revival. Ring neither resets
// its counter nor revives a loss, and still grants only 15% after the later win.
{
 const s=equipped(),amulet=E.item('amulet',1,null,3);amulet.special={id:'nirvana'};s.inventory.push(amulet);assert(E.equipItem(s,amulet.id,'amulet'));s.heroHp=1;const e=start(s,'dwarf.a01.field');
 for(const u of e.enemies){u.hp=u.max=1e8;u.atk=0;u.control.stunUntil=s.lastHealthClock+1e8;}e.enemies[0].atk=1e8;e.enemies[0].control.stunUntil=0;
 let n=0;while(!e.affixState.nirvanaUsed&&!e.done&&n++<10)E.step(s,e,s.nextActionAt);assert(e.affixState.nirvanaUsed,'real lethal hit invokes Nirvana');assert(!e.done);
 e.heroHp=s.heroHp=E.stats(s).hp*.4;for(const u of e.enemies){u.hp=1;u.atk=0;u.control.stunUntil=s.lastHealthClock+1e8;}
 finish(s,e);assert(e.affixState.nirvanaUsed);assert(s.heroHp<E.stats(s).hp,'victory no longer restores full HP');
}
// A real defeat remains dead/resting even while wearing the Ring.
{
 const s=equipped();s.heroHp=1;const e=start(s,'dwarf.a01.field');for(const u of e.enemies){u.hp=u.max=1e8;u.atk=1e8;}
 let n=0;while(!e.done&&n++<20)E.step(s,e,s.nextActionAt);assert(e.done&&!e.win);assert.equal(s.heroHp,0);const rest=s.restUntil;assert(rest>s.lastHealthClock);E.reward(s,e,s.lastHealthClock);assert.equal(s.heroHp,0);assert.equal(s.restUntil,rest);assert(!(e.rewardNotes??[]).some(x=>x.startsWith('归途之环')));assert(E.validSave(s));
}
// One identical admitted encounter produces exactly the same online/offline
// result, including the fractional recovery and no repeat from a later refresh.
{
 const initial=equipped();initial.heroHp=E.stats(initial).hp*.4;start(initial,'dwarf.a01.field');initial.stopAfterBattle=true;initial.lastSeen=initial.lastHealthClock;
 const online=clone(initial),offline=clone(initial);finish(online,online.activeEncounter);const report=E.offline(offline,initial.lastSeen+60000);assert.equal(report.kills,1);
 for(const key of ['gold','xp','level','kills','heroHp','materialStacks','potionStacks','potionReadyAt'])assert.deepEqual(offline[key],online[key],key);
 const hp=offline.heroHp;assert(hp<E.stats(offline).hp);E.offline(offline,initial.lastSeen+120000);assert.equal(offline.heroHp,hp);assert(E.validSave(offline));
}
Math.random=originalRandom;
console.log('PASS Ring 15%-max recovery: fractional/capped/zero boundaries, all-five field/boss real settlements, all dungeon stages/carry, post-XP/passive max but no healing multipliers, Nirvana separation, potions unchanged, replay/reload and online/offline parity.');
