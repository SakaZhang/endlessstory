import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
import {DWARF_MATERIAL_SOURCE_POOLS} from './dist/dwarf-material-catalog.js';
import {EXPANSION_PACKS} from './dist/race-packs.js';

const races=[['dwarf',DWARF_MATERIAL_SOURCE_POOLS],...EXPANSION_PACKS.map(p=>[p.id,p.materialPools])];
const seeded=n=>()=>((n=(Math.imul(n,1664525)+1013904223)>>>0)/2**32);
const oldRandom=Math.random,oldNow=Date.now;Date.now=()=>1800000000000;
const results=[];
try{
 for(const [race,pools] of races)for(const kind of ['field','dungeon','boss']){
  const candidates=Object.values(pools).filter(p=>p.nodeId.endsWith('.'+kind)).sort((a,b)=>a.nodeId.localeCompare(b.nodeId));
  const node=candidates.at(-1).nodeId;
  Math.random=seeded(20261026);
  const state=E.fresh(race);state.level=100;E.normalizeHealth(state,state.lastSeen);E.normalizeExpedition(state);
  state.areaProgress[race]={unlocked:[1,2,3,4,5,6,7,8,9,10],cleared:[1,2,3,4,5,6,7,8,9]};state.heroHp=E.stats(state).hp;
  if(kind==='field')Math.random=()=>2000/2**32; // Real multi-monster field generation, not an invented reward fixture.
  const e=E.startInstanceEncounter(state,node,state.lastHealthClock);assert(e,node);assert.notEqual(e.developmentFixture,true);if(kind==='field')assert(e.fieldGroup&&e.enemies.length>1);e.luck=0;
  // Keep the real production encounter/skill/reward path, shortening combat only.
  for(const enemy of e.enemies){enemy.hp=1;enemy.shield=0;enemy.shieldUntil=0;enemy.armor=0;enemy.atk=0;enemy.elementalPower=0;}
  for(let n=0;n<100&&!e.done;n++)E.step(state,e,state.nextActionAt);
  assert(e.done&&e.win,node+' real combat victory');assert(E.validSave(state));
  E.normalizePotions(state);state.running=true;state.stopAfterBattle=true;state.lastSeen=state.lastHealthClock;
  // Find a fixed-sequence seed that positively exercises a base-rate gem award.
  // No threshold, pool or receiver is replaced by a test double.
  let online,receipt,chosenSeed;
  for(let seed=1;seed<=20000;seed++){
   const trial=structuredClone(state),encounter=trial.activeEncounter;encounter.rngState=(Math.imul(seed,7919))>>>0;
   E.reward(trial,encounter,trial.lastHealthClock);
   if(encounter.materialLoot?.some(row=>row.channel==='gem')){online=trial;receipt=encounter;chosenSeed=seed;break;}
  }
  assert(online,node+' seeded gem award');assert(receipt.rewarded);assert.equal(receipt.materialLoot.filter(row=>row.channel==='gem').length,1,'multiple rounds cannot duplicate a held gem');
  const gem=receipt.materialLoot.find(row=>row.channel==='gem');assert.equal(gem.quality,3);assert.equal(gem.count,1);
  const held=structuredClone(state),heldEncounter=held.activeEncounter;held.materialStacks[gem.key]=1;heldEncounter.rngState=(Math.imul(chosenSeed,7919))>>>0;E.reward(held,heldEncounter,held.lastHealthClock);assert(!heldEncounter.materialLoot.some(row=>row.channel==='gem'));assert.equal(E.materialCount(held,gem.material,3),1);
  const offline=JSON.parse(JSON.stringify(state));offline.activeEncounter.rngState=(Math.imul(chosenSeed,7919))>>>0;
  const offEncounter=offline.activeEncounter,result=E.offline(offline,offline.lastSeen+1);
  assert(result&&result.kills===1);assert(offEncounter.rewarded);assert.deepEqual(offEncounter,receipt,'persisted online/offline reward receipt and RNG identical');
  for(const key of ['heroHp','kills','gold','xp','level','materialStacks','potionStacks','nextActionAt','nextBattleAt','normalWins','bossWins','areaProgress','dungeonRun','instanceCooldowns'])assert.deepEqual(offline[key],online[key],node+' '+key);
  const metadata=s=>s.inventory.map(({id,...rest})=>rest);assert.deepEqual(metadata(offline),metadata(online));
  assert(E.validSave(online));assert(E.validSave(offline));assert.equal(E.materialCount(offline,gem.material,3),1);
  const before=JSON.stringify(online);E.reward(online,receipt,online.lastHealthClock);assert.equal(JSON.stringify(online),before,'settlement cannot replay a gem');
  results.push({race,node,seed:chosenSeed,gem:gem.material,judgments:receipt.fieldGroup?2:1});
 }
}finally{Math.random=oldRandom;Date.now=oldNow;}
console.log('PASS 15 real production gem awards, all five races × field/dungeon/existing boss: exact online/offline JSON continuation, Q3 held-one, inventory acceptance and idempotent replay.',JSON.stringify(results));
