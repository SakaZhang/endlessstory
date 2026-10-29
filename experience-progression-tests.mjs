import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as E from './dist/engine.js';
import {WORLD_MONSTERS,monsterParameters,raceParameterSet} from './dist/world-content.js';
import {FIELD_EXPERIENCE_BY_AREA} from './dist/monster-balance.js';
import {setup} from './boss-growth-test-fixture.mjs';
assert.deepEqual(FIELD_EXPERIENCE_BY_AREA,[6,28,38,48,58,68,78,88,98,108]);
for(const d of Object.values(WORLD_MONSTERS)){
 const field=FIELD_EXPERIENCE_BY_AREA[d.area-1],old=d.rank==='normal'?(d.area===1?4:12+4*d.area):d.rank==='elite'?[55,66,79,92,106,119,132,145,158,172][d.area-1]:156+52*d.area;
 assert.equal(monsterParameters(d.id).rewardXp,d.rank==='normal'?field:Math.max(old,field*(d.rank==='elite'?4:12)));
}
const random=Math.random,now=Date.now;Date.now=()=>1700000000000;
// Hydration never recomputes old encounter XP, even when a fresh monster now gives more.
for(const kind of ['field','dungeon','boss']){
 const s=setup('dwarf',30,0,739,true);s.siteId=kind==='boss'?'elf.a08':'dwarf.a01';s.location=kind==='boss'?7:0;s.expedition.fieldId=s.siteId+'.field';
 const e=E.startInstanceEncounter(s,s.siteId+'.'+kind,s.lastSeen);assert(e);e.rewardXp=7;
 const saved=JSON.parse(JSON.stringify(s));assert(E.validSave(saved));E.normalizeHealth(saved,saved.lastSeen);assert.equal(saved.activeEncounter.rewardXp,7);
 for(const u of saved.activeEncounter.enemies){u.hp=1;u.control.stunUntil=saved.lastHealthClock+1e8;}
 const old=saved.activeEncounter;while(!old.done)E.step(saved,old,saved.nextActionAt);assert(old.win);E.reward(saved,old,saved.lastHealthClock);assert.equal(old.acceptedXp,7*(old.fieldGroup?2:1));const xp=saved.xp;E.reward(saved,old,saved.lastHealthClock);assert.equal(saved.xp,xp);
}
// Force the authored 5% knowledge roll on each dungeon stage, including the clear.
{
 const s=setup('dwarf',30,0,739,true);s.siteId='dwarf.a01';s.location=0;s.expedition.fieldId=s.siteId+'.field';
 const amulet=E.item('amulet',30,null,3);amulet.special={id:'knowledge'};s.inventory.push(amulet);assert(E.equipItem(s,amulet.id,'amulet'));
 const ring=E.legendaryItem('return-ring',1);s.inventory.push(ring);s.returnRing={version:1,recipeLearned:true,crafted:true,craftedItemId:ring.id};assert(E.equipItem(s,ring.id,'ring1'));assert(E.validSave(s));
 for(let stage=1;stage<=3;stage++){
  const e=E.startInstanceEncounter(s,s.siteId+'.dungeon',Math.max(s.lastHealthClock,s.nextBattleAt??0));assert(e);for(const u of e.enemies){u.hp=1;u.control.stunUntil=s.lastHealthClock+1e8;}
  while(!e.done)E.step(s,e,s.nextActionAt);assert(e.win);
  let seed=0;while(((Math.imul(seed,1664525)+1013904223)>>>0)/4294967296>=.05)seed++;e.rngState=seed;
  E.reward(s,e,s.lastHealthClock)
  assert.equal(e.acceptedXp,Math.floor((e.rewardXp*2+(stage===3?e.clearRewards.xp:0))*1.2),'knowledge doubles base only; clear + ring calculated exactly once');
 }
}
// Full 4-hour replay at Lv90: actual combat, no potions, no gear upgrading or XP bonus.
const s=setup('dwarf',90,0,739,true);s.siteId='dwarf.a10';s.location=9;s.expedition.fieldId='dwarf.a10.field';s.running=true;s.potionSlot.auto=false;
let rng=1739;Math.random=()=>((rng=Math.imul(rng,1664525)+1013904223>>>0)/4294967296);
const before=structuredClone(s),four=E.offline(s,s.lastSeen+4*3600000),eight=structuredClone(before);rng=1739;const capped=E.offline(eight,eight.lastSeen+8*3600000);
assert(four&&capped);assert.equal(four.minutes,240);assert.equal(capped.capped,true);assert.equal(four.xp,capped.xp);assert.equal(four.kills,capped.kills);assert.equal(s.level,eight.level);assert(s.level>=95&&s.level<=100);assert(E.validSave(s));
const report={startLevel:90,endLevel:s.level,endXp:s.xp,...four};fs.writeFileSync('/tmp/experience-offline.json',JSON.stringify(report,null,2));console.log(JSON.stringify({level:s.level,xp:four.xp,kills:four.kills,rests:four.rests,rounds:four.rounds}));
Math.random=random;Date.now=now;
console.log('PASS fixed five-race XP progression, saved rewards, exactly-once settlement, actual four-hour offline replay and eight-hour cap parity.');
