import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
import {applyExperience} from './dist/character-progression.js';
import {returnRingExperienceBonus} from './dist/return-ring-state.js';
import {preparedStoryGame} from './story-event-test-fixture.mjs';
const ring={id:'old-ring',legendaryId:'return-ring',exclusive:{id:'return-home'}};
function unit(){return {level:1,xp:0,equip:{ring1:ring.id},inventory:[structuredClone(ring)]};}
for(const n of [0,1,4,5,11,101,10000]){const s=unit();assert.equal(E.gainXp(s,n).acceptedXp,Math.floor(n*1.2));}
let s=unit();s.equip.ring2=ring.id;assert.equal(applyExperience(s,101).acceptedXp,121);assert.equal(returnRingExperienceBonus(s),.2);s.equip={};assert.equal(E.gainXp(s,101).acceptedXp,101);assert.equal(returnRingExperienceBonus(s),0);s=unit();s.level=100;assert.equal(E.gainXp(s,101).acceptedXp,0);assert.equal(s.xp,0);
for(const n of [-1,NaN,Infinity])assert.throws(()=>E.gainXp(unit(),n));
function equipped(){const s=preparedStoryGame('dwarf');const ring=E.legendaryItem('return-ring',1);s.inventory.push(ring);s.returnRing={version:1,recipeLearned:true,crafted:true,craftedItemId:ring.id};assert(E.equipItem(s,ring.id,'ring1'));s.potionSlot.auto=false;assert(E.validSave(s));return s;}
function start(s,node){s.running=false;const e=E.startInstanceEncounter(s,node,Math.max(s.lastHealthClock,s.nextBattleAt??0)+2000);assert(e);for(const u of e.enemies){u.hp=1;u.control.stunUntil=s.lastHealthClock+1e8;}return e;}
function finish(s,e){while(!e.done)E.step(s,e,s.nextActionAt);assert(e.win);E.reward(s,e,s.lastHealthClock);assert(E.validSave(s));const knowledge=e.rewardNotes.some(x=>x.startsWith('求知：'));const base=e.rewardXp*(e.fieldGroup?2:1)*(knowledge?2:1)+(e.dungeonStage===3?(e.clearRewards?.xp??0):0);assert.equal(e.acceptedXp,Math.floor(base*1.2));const xp=s.xp;E.reward(s,e,s.lastHealthClock);assert.equal(s.xp,xp);}
s=equipped();finish(s,start(s,'dwarf.a01.field'));for(let i=0;i<3;i++)finish(s,start(s,'dwarf.a01.dungeon'));
s=equipped();start(s,'dwarf.a01.field');s.stopAfterBattle=true;s.lastSeen=s.lastHealthClock;const online=structuredClone(s),offline=structuredClone(s);finish(online,online.activeEncounter);E.offline(offline,s.lastHealthClock+60000);assert.equal(offline.xp,online.xp);assert.equal(offline.level,online.level);const xp=offline.xp;E.offline(offline,s.lastHealthClock+60000);assert.equal(offline.xp,xp);
console.log('PASS equipped legacy ring +20% XP: floor once, equip/unequip, duplicate sockets, cap, field, all dungeon stages+clear, repeated settlement, online/offline parity');
