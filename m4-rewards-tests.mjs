import {MONSTER_BALANCE_ID} from './dist/monster-balance.js';
import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
import {PRODUCTION_DWARF_PARAMETERS as P} from './dist/dwarf-parameters.js';
import {dwarfParameterSet} from './dist/dwarf-content.js';
// Production-entry acceptance: never configure/inject candidate parameters.
assert.deepEqual(P.areas,[1,2,3,4,5,6,7,8,9,10],'WAITING: reviewed default 44-monster provider must be activated');
assert.equal(P.reviewed,true);assert(!('testOnly' in P));assert.deepEqual(dwarfParameterSet(),P);
function setup(){
 const s=E.fresh();s.level=100;s.xp=17;E.normalizeHealth(s,s.lastSeen);E.normalizeExpedition(s);s.heroHp=E.stats(s).hp;
 s.areaProgress.dwarf={unlocked:[1,2,3,4,5,6,7,8,9,10],cleared:[1,2,3,4,5,6,7,8,9]};return s;
}
function victory(s,id,at=s.lastHealthClock){
 const e=E.startInstanceEncounter(s,id,at);assert(e,id);assert(e.enemies.every(u=>u.parameterSetId===MONSTER_BALANCE_ID));
 // Explicit encounter-only test reduction, not a balance or provider override.
 for(const u of e.enemies){u.hp=1;u.shield=0;u.shieldUntil=0;u.armor=0;u.atk=0;u.elementalPower=0;}
 for(let n=0;n<80&&!e.done;n++)E.step(s,e,s.nextActionAt);
 assert(e.done&&e.win,id);assert(E.validSave(s));return e;
}
for(const area of [7,8,9,10])for(const kind of ['field','dungeon',...([9,10].includes(area)?['boss']:[])]){
 const s=setup(),id='dwarf.a'+String(area).padStart(2,'0')+'.'+kind;
 if(kind==='dungeon')s.dungeonRun={instanceId:id,runId:'m4-rewards',stage:3};
 victory(s,id);
 let foundGear=false,foundSet=false,foundCoexist=false,firstLegend=null;
 for(let seed=1;seed<=1000;seed++){
  const x=structuredClone(s),e=x.activeEncounter;e.rngState=seed;const before=new Set(x.inventory.map(i=>i.id)),gold=x.gold;
  E.reward(x,e,x.lastHealthClock);assert(e.rewarded);assert(E.validSave(x),id);assert.equal(x.level,100);assert.equal(x.xp,17);assert.equal(e.acceptedXp,0);assert(x.gold>=gold);
  const loot=x.inventory.filter(i=>!before.has(i.id));
  for(const it of loot){assert(it.level>=(area-1)*10+1&&it.level<=area*10);assert.equal(it.originRace,'dwarf');foundGear=true;if(it.set)foundSet=true;}
  if(kind!=='boss'){assert(!loot.some(i=>i.legendaryId));assert(!e.legendaryDropReceipt,'nonboss has no legendary roll');}
  if(kind==='field'){assert(!loot.some(i=>i.set));assert(x.running,'Lv100 field keeps running');}
  if(kind==='boss'){
   const legends=loot.filter(i=>i.legendaryId);assert(legends.length<=1);
   if(legends.length&&!firstLegend)firstLegend={state:x,legendaryId:legends[0].legendaryId};
   if(legends.length&&loot.some(i=>!i.legendaryId))foundCoexist=true;
   assert.equal(x.instanceCooldowns[id],x.lastHealthClock+1800000);
  }
  if(kind==='dungeon'){assert.equal(x.instanceCooldowns[id],x.lastHealthClock+300000);assert(x.areaProgress.dwarf.cleared.includes(area));assert(!x.areaProgress.dwarf.unlocked.includes(11));}
  const fingerprint=JSON.stringify(x);E.reward(x,e,x.lastHealthClock);assert.equal(JSON.stringify(x),fingerprint,'settle once');
  if(foundGear&&(kind==='field'||foundSet)&&(kind!=='boss'||foundCoexist&&firstLegend))break;
 }
 assert(foundGear,id+' ordinary gear');if(kind!=='field')assert(foundSet,id+' source sets');
 if(kind==='boss'){
  assert(foundCoexist,id+' independent ordinary+legendary coexist');assert(firstLegend,id+' first local legend');
  const owned=firstLegend.state,nextAt=owned.instanceCooldowns[id];assert.equal(E.startInstanceEncounter(structuredClone(owned),id,nextAt-1),null);
  owned.heroHp=E.stats(owned).hp;victory(owned,id,nextAt);let repeated=false;
  for(let seed=1;seed<=1000&&!repeated;seed++){
   const x=structuredClone(owned);x.activeEncounter.rngState=seed;E.reward(x,x.activeEncounter,x.lastHealthClock);assert(E.validSave(x));
   repeated=x.inventory.filter(i=>i.legendaryId===firstLegend.legendaryId).length>=2;
  }
  assert(repeated,id+' same racial legend repeat allowed');
 }
}
assert.deepEqual(dwarfParameterSet(),P);
console.log('PASS M4 DEFAULT rewards: A07–10 loot/source bounds, nonboss no legend, A09/A10 repeated same-race legend+ordinary coexist, CD/idempotence, Lv100 no XP gain or field stop');
