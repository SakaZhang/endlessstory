import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as E from './dist/engine.js';
import {listEquipmentTemplates} from './dist/equipment-templates.js';

const baseline=JSON.parse(fs.readFileSync(new URL('./fixtures/goblin-ashen-equipment-before-parity.json',import.meta.url)));
// Exercise the production reward -> rollDrop -> item -> receiveBattleLoot path.
// Generator-only checks cannot cover regional routing, inventory acceptance, or replay guards.
for(const race of ['goblin','ashen']){
 const state=E.fresh(race);state.level=100;
 E.normalizeHealth(state,state.lastSeen);E.normalizeExpedition(state);state.heroHp=E.stats(state).hp;
 const encounter=E.startInstanceEncounter(state,`${race}.a01.field`,state.lastHealthClock);
 assert(encounter);assert.equal(encounter.contentVersion,'dwarf-m2-v1');assert.notEqual(encounter.developmentFixture,true);
 // Encounter-local reduction only: use the production combat and reward implementations.
 for(const enemy of encounter.enemies){enemy.hp=1;enemy.shield=0;enemy.shieldUntil=0;enemy.armor=0;enemy.atk=0;enemy.elementalPower=0;}
 for(let n=0;n<100&&!encounter.done;n++)E.step(state,encounter,state.nextActionAt);
 assert(encounter.done&&encounter.win,`${race} production victory`);assert(E.validSave(state));
 const historical=new Set(baseline.races[race].equipment.map(t=>t.id));
 const wanted=new Set(['weapon','helm','armor','gloves','boots','amulet'].flatMap(slot=>listEquipmentTemplates({originRace:race,slot})).filter(t=>!historical.has(t.id)).map(t=>t.id));
 assert.equal(wanted.size,race==='goblin'?15:18);
 const seen=new Set(),allOrdinary=new Set();let settlements=0,accepted=0;
 for(let seed=1;seed<=20000&&seen.size<wanted.size;seed++){
  // Clone the valid completed encounter: each trial starts from the same small inventory,
  // so overflow cannot silently hide a template. A distinct settlement ID matters because
  // production item IDs (and thus template selection) derive from encounter ID, not RNG alone.
  const trial=structuredClone(state),e=trial.activeEncounter;
  e.id=`parity-${race}-${seed}`;if(e.affixState)e.affixState.battleId=e.id;
  e.rngState=(Math.imul(seed,7919))>>>0;
  assert(E.validSave(trial),`${race}/${seed} valid distinct settlement fixture`);
  const before=new Set(trial.inventory.map(it=>it.id)),kills=trial.kills;
  E.reward(trial,e,trial.lastHealthClock);settlements++;
  assert(e.rewarded);assert.equal(trial.kills,kills+1);
  assert(E.validSave(trial),`${race}/${seed} accepted loot remains valid`);
  for(const it of trial.inventory.filter(it=>!before.has(it.id))){
   assert.equal(it.originRace,race);assert.equal(it.levelSource,'drop');assert.equal(it.set,null);assert.equal(it.legendaryId,null);
   assert(listEquipmentTemplates({originRace:race,slot:it.slot}).some(t=>t.id===it.templateId));
   assert.equal(it.slot==='core'&&race!=='ashen',false);
   allOrdinary.add(it.templateId);accepted++;if(wanted.has(it.templateId))seen.add(it.templateId);
  }
  assert.equal(e.lootSummary.overflow.equipment,0);
  const snapshot=JSON.stringify(trial);E.reward(trial,e,trial.lastHealthClock);assert.equal(JSON.stringify(trial),snapshot,'reward must be idempotent');
 }
 assert.deepEqual([...seen].sort(),[...wanted].sort(),`${race} every new item accepted by actual regional battle settlement`);
 console.log('PASS production drop settlement',JSON.stringify({race,settlements,accepted,newTemplates:seen.size,totalOrdinaryTemplates:allOrdinary.size}));
}
