import assert from 'node:assert/strict';
import {historicalDwarfProvider} from './historical-dwarf-provider-fixture.mjs';
import {execFileSync} from 'node:child_process';
import * as E from './dist/engine.js';
import {PRODUCTION_DWARF_PARAMETERS as P,DWARF_PARAMETER_PROVENANCE as META} from './dist/dwarf-parameters.js';
import {dwarfParameterSet} from './dist/dwarf-content.js';
// Deliberately no configureDwarfParameters call: this is a release gate, not candidate evidence.
assert.deepEqual(P.areas,[1,2,3,4,5,6,7,8,9,10],'WAITING: reviewed default 44-monster provider must be activated');
assert.equal(P.reviewed,true);assert(!('testOnly' in P));assert.equal(Object.keys(P.monsters).length,44);assert.deepEqual(dwarfParameterSet(),P);
const {provider:approved,provenance}=historicalDwarfProvider('m4');assert.deepEqual(META,provenance.approval);assert.deepEqual(P,approved,'exact released provider including approval metadata');const numerical=x=>{const y=structuredClone(x);for(const key of ['reviewed','status','testOnly'])delete y[key];return y;};assert.deepEqual(numerical(P),numerical(approved),'exact approved numerical provider');
const oldSource=execFileSync('git',['show','4e1a6a5:dist/dwarf-parameters.js'],{cwd:new URL('.',import.meta.url),encoding:'utf8'});
const old=JSON.parse(oldSource.split('PRODUCTION_DWARF_PARAMETERS=freeze(')[1].split(');')[0]);assert.equal(Object.keys(old.monsters).length,26);
for(const [id,p] of Object.entries(old.monsters))assert.deepEqual(P.monsters[id],p,'unchanged prior26 '+id);
for(const [area,p] of Object.entries(old.clearRewards))assert.deepEqual(P.clearRewards[area],p,'unchanged prior clear '+area);
function setup(){
 const s=E.fresh();s.level=100;E.normalizeHealth(s,s.lastSeen);E.normalizeExpedition(s);s.heroHp=E.stats(s).hp;
 s.areaProgress.dwarf={unlocked:[1,2,3,4,5,6],cleared:[1,2,3,4,5]};return s;
}
// Only encounter HP/shield/defense are reduced to isolate routing/settlement from balance.
// The imported default provider and its parameter table are never injected or modified.
function win(s,e){
 assert(e);assert(e.enemies.every(u=>u.parameterSetId===P.id));
 for(const u of e.enemies){u.hp=1;u.shield=0;u.shieldUntil=0;u.armor=0;u.atk=0;u.elementalPower=0;}
 for(let n=0;n<80&&!e.done;n++)E.step(s,e,s.nextActionAt);
 assert(e.done&&e.win);assert(E.validSave(s));return e;
}
const fresh=E.fresh();E.normalizeHealth(fresh,fresh.lastSeen);E.normalizeExpedition(fresh);
assert.equal(fresh.gold,100);assert.equal(fresh.supportGrantEligible,undefined);
const nodes=E.plannedNodes(fresh).filter(n=>n.id.startsWith('dwarf.'));assert.equal(nodes.length,24);assert.equal(new Set(nodes.map(n=>n.areaNumber)).size,10);assert(nodes.every(n=>n.budgetReady));
assert.deepEqual(nodes.filter(n=>n.kind==='boss').map(n=>n.areaNumber),[3,6,9,10]);
assert.equal(E.startInstanceEncounter(fresh,'dwarf.a07.field',fresh.lastSeen),null,'fresh save cannot skip unlock');
const s=setup();
for(const area of [6,7,8,9,10]){
 const id='dwarf.a'+String(area).padStart(2,'0')+'.dungeon';
 if(area<10)assert(!s.areaProgress.dwarf.unlocked.includes(area+1));
 for(let stage=1;stage<=3;stage++){
  const at=Math.max(s.lastHealthClock,s.nextBattleAt??0);
  const e=E.startInstanceEncounter(s,id,at);assert(e,id+' stage '+stage);assert.equal(e.dungeonStage,stage);
  win(s,e);E.reward(s,e,s.lastHealthClock);assert(e.rewarded);assert(E.validSave(s));
  if(stage<3&&area<10)assert(!s.areaProgress.dwarf.unlocked.includes(area+1),'early stage cannot unlock');
 }
 assert(s.areaProgress.dwarf.cleared.includes(area));if(area<10)assert(s.areaProgress.dwarf.unlocked.includes(area+1));
}
assert.deepEqual(s.areaProgress.dwarf.unlocked,[1,2,3,4,5,6,7,8,9,10]);assert(!s.areaProgress.dwarf.unlocked.includes(11));
assert.equal(E.startInstanceEncounter(s,'dwarf.a11.field',s.lastHealthClock),null);
for(const area of [7,8,9,10]){
 const x=setup();x.areaProgress.dwarf={unlocked:[1,2,3,4,5,6,7,8,9,10],cleared:[1,2,3,4,5,6,7,8,9]};const id='dwarf.a'+String(area).padStart(2,'0')+'.field';
 const e=E.startInstanceEncounter(x,id,x.lastHealthClock);assert(e);assert.equal(x.location,area-1);assert(E.validSave(x));const restored=JSON.parse(JSON.stringify(x));E.step(restored,restored.activeEncounter,restored.nextActionAt);assert(E.validSave(restored));
}
const c=setup(),t=c.lastHealthClock;c.areaProgress.dwarf={unlocked:[1,2,3,4,5,6,7,8,9,10],cleared:[1,2,3,4,5,6,7,8,9]};
c.instanceCooldowns={'dwarf.a09.dungeon':t+300000,'dwarf.a10.boss':t+1800000};
for(const id of ['dwarf.a09.dungeon','dwarf.a10.boss'])assert.equal(E.startInstanceEncounter(structuredClone(c),id,t),null);
for(const id of ['dwarf.a09.boss','dwarf.a10.dungeon','dwarf.a08.dungeon','dwarf.a10.field'])assert(E.startInstanceEncounter(structuredClone(c),id,t),id+' independent cooldown');
assert(E.startInstanceEncounter(structuredClone(c),'dwarf.a10.boss',t+1800000));
assert.deepEqual(dwarfParameterSet(),P,'no candidate provider injected');
console.log('PASS M4 DEFAULT approved44, old26/clear unchanged,10areas24nodes, actual A06→A10 full dungeon unlock/no11, independent CD and JSON+step');
