import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
import {reachStoryScene} from './story-event-test-fixture.mjs';
const s=reachStoryScene('human','END.H01.human',{finishTarget:true,level:100,spring:'skip'});s.running=false;s.heroHp=E.stats(s).hp;s.otherworld.stoneUsed=true;s.xp=7890;assert(E.enterOtherworld(s,s.lastHealthClock+2000));let e=E.startRoutedEncounter(s,s.lastHealthClock+4000);e.rngState=12345;s.lastSeen=s.lastHealthClock;s.stopAfterBattle=true;
const online=structuredClone(s),offline=structuredClone(s),end=s.lastSeen+120000;let n=0;while(!online.activeEncounter.done&&n++<1000)E.step(online,online.activeEncounter,online.nextActionAt);assert(online.activeEncounter.win);E.reward(online,online.activeEncounter,online.lastHealthClock);
const result=E.offline(offline,end);assert.equal(result.kills,1);assert.equal(result.xp,108);assert.equal(result.gold,0);assert.equal(result.mat,0);assert.equal(offline.level,101);assert.equal(offline.xp,78);assert.equal(offline.level,online.level);assert.equal(offline.xp,online.xp);assert.deepEqual(offline.inventory,online.inventory);assert.deepEqual(offline.otherworld,online.otherworld);assert(E.validSave(offline));
// Actual combat once; replay only the independent reward RNG against cloned won state.
while(!e.done)E.step(s,e,s.nextActionAt);assert(e.win);const sets=new Set(),rarities=new Set(),slots=new Set();let rolledSets=0;
for(let i=1;i<=600;i++){
 const c=structuredClone(s),battle=c.activeEncounter,oldIds=new Set(c.inventory.map(x=>x.id));battle.rngState=Math.imul(i,2654435761)>>>0;
 assert(E.reward(c,battle,c.lastHealthClock));const drops=c.inventory.filter(x=>!oldIds.has(x.id));assert(drops.length>=1&&drops.length<=2);const ordinary=drops.find(x=>!x.set);assert(ordinary);rarities.add(ordinary.rarity);slots.add(ordinary.slot);
 for(const it of drops){assert([1,2,3].includes(it.rarity)&&it.level===100&&it.baseLevel===100&&it.levelSource==='drop'&&!it.legendaryId);if(it.set){sets.add(it.set);rolledSets++;assert.equal(it.rarity,3);}}
 assert.equal(c.gold,s.gold);assert.deepEqual(c.materialStacks,s.materialStacks);assert.deepEqual(c.consumables,s.consumables);assert(E.validSave(c));
 // Every quality filter removes ordinary equipment, never protected set drops.
 const filtered=structuredClone(s);filtered.activeEncounter.rngState=Math.imul(i,2654435761)>>>0;E.setLootFilter(filtered,'equipment',[0,1,2,3,4]);const before=filtered.inventory.length;assert(E.reward(filtered,filtered.activeEncounter,filtered.lastHealthClock));assert.equal(filtered.inventory.length-before,drops.filter(x=>x.set).length);
}
assert.deepEqual([...sets].sort(),E.BUILD.map(x=>x.id).sort());assert.deepEqual([...rarities].sort(),[1,2,3]);assert.deepEqual([...slots].sort(),E.SLOTS.filter(k=>k!=='core').sort());
// Selected farm floor survives offline death/rest, not silently advancing.
const farm=structuredClone(s);farm.activeEncounter=null;farm.running=false;farm.otherworld.highestCleared=499;delete farm.divineStones;farm.otherworld.floor=500;farm.otherworld.autoAdvance=false;farm.heroHp=1;farm.running=true;farm.lastSeen=farm.lastHealthClock;const death=E.offline(farm,farm.lastSeen+900000);assert(death.rests>0);assert.equal(farm.otherworld.floor,500);assert.equal(farm.otherworld.highestCleared,499);assert.equal(death.kills,0);assert(E.validSave(farm));
console.log(`PASS online/offline crossing100→101 parity,108XP/no currency/material, all15 sets/all ordinary slots/qualities over600 deterministic settlements (${rolledSets} set rolls), protected sets+filters, offline farm defeat/rest.`);
