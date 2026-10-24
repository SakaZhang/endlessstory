import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
import {getRacePack} from './dist/race-registry.js';
import {racialLegendaryStatBonuses} from './dist/racial-legendary-runtime.js';
import {skillTreeHeroStats} from './dist/skill-tree-attributes.js';
import {createSkillEffectState,applySkillEffect} from './dist/skill-tree-effects.js';
import {captureCombatDisplay} from './dist/combat-display-bridge.js';
import {prepareLegendaryDrop,LEGENDARY_DROP_BASE_PROBABILITY,LEGENDARY_DROP_CANDIDATES} from './dist/legendary-drop.js';
import {affixRange} from './dist/equipment-budget.js';
const id='goblin-silent-steps',def=getRacePack('goblin').legendaries.find(d=>d.id===id);
assert.equal(def.slot,'boots');assert.match(def.description,/盗贼/);assert.doesNotMatch(def.description,/信使/);assert.match(def.exclusiveDescription,/闪避\+100/);assert.equal(E.legendaryItem('goblin-returning-spring',100),null);
for(const race of ['dwarf','human','elf','goblin','ashen']){
 const s=E.fresh(race),before=E.stats(s),prior=s.equip.boots,boots=E.legendaryItem(id,100);s.inventory.push(boots);
 assert.equal(E.stats(s).dodgeRating,before.dodgeRating,'inventory grants nothing');assert.equal(boots.affixes.length,4);assert.equal(new Set(boots.affixes.map(a=>a.stat)).size,4);
 for(const a of boots.affixes){assert.equal(a.sourceRange.quality,4);assert(a.sourceRange.max>affixRange(E.AFFIX_DEFS[a.stat],3).max);}
 assert(E.equipItem(s,boots.id));assert.equal(E.stats(s).dodgeRating-before.dodgeRating,100);assert.equal(E.stats(s).dodge,.25);assert(E.validSave(s));assert(E.validSave(JSON.parse(JSON.stringify(s))));
 const duplicate=structuredClone(boots);duplicate.id+='duplicate';s.inventory.push(duplicate);assert.equal(racialLegendaryStatBonuses(s).dodgeRating,100);assert.equal(racialLegendaryStatBonuses({...s,equip:{...s.equip,extra:duplicate.id}}).dodgeRating,100,'same legend does not stack even in synthetic duplicate equipment input');
 boots.fixedEffect={type:'statBonus',stats:{dodgeRating:999999}};assert.equal(E.stats(s).dodgeRating,100,'never trusts mutable item payload');delete boots.fixedEffect;
 let effects=createSkillEffectState([]);effects=applySkillEffect(effects,'self',{type:'dodgeUp',amount:100,durationMs:10000,sourceId:'test-dodge'}).state;
 const augmented=skillTreeHeroStats(E.stats(s),effects,{dodgeCap:.5});assert.equal(augmented.dodgeRating,200);assert.equal(augmented.dodge,1/3,'same diminishing pool, not flat +25%');
 assert(E.equipItem(s,prior));assert.equal(E.stats(s).dodgeRating,before.dodgeRating);assert(E.validSave(s));
}
assert.equal(LEGENDARY_DROP_BASE_PROBABILITY,.05);assert.deepEqual(LEGENDARY_DROP_CANDIDATES.goblin.map(d=>d.id),['goblin-silent-ration',id]);
for(let run=0;run<2;run++){
 const draws=[.049,.75];const receipt=prepareLegendaryDrop({settlementId:'repeat-'+run,nodeId:'goblin.a09.boss',regionRace:'goblin',kind:'boss',won:true},{probability:.05,random:()=>draws.shift()});assert.equal(receipt.legendaryId,id);
}
assert.equal(prepareLegendaryDrop({settlementId:'miss',nodeId:'goblin.a09.boss',regionRace:'goblin',kind:'boss',won:true},{probability:.05,random:()=>.05}).outcome,'miss');
for(const race of ['human','elf','ashen','dwarf'])assert(!LEGENDARY_DROP_CANDIDATES[race].some(d=>d.id===id));
// Measure real engine enemy hit/miss events across independent seeded encounter continuations.
const s=E.fresh('goblin');s.level=100;const boots=E.legendaryItem(id,100);s.inventory.push(boots);E.equipItem(s,boots.id);E.normalizeHealth(s,s.lastSeen);E.normalizeExpedition(s);s.areaProgress.goblin={unlocked:[1,2,3,4,5,6,7,8,9,10],cleared:[1,2,3,4,5,6,7,8,9]};s.heroHp=E.stats(s).hp;
const e=E.startInstanceEncounter(s,'goblin.a09.boss',s.lastSeen);assert(e);let miss=0,hit=0;
for(let seed=1;seed<=800;seed++){
 const trial=structuredClone(s),enc=trial.activeEncounter;enc.rngState=seed*7919;let measured=false;
 for(let turn=0;turn<8&&!enc.done&&!measured;turn++){
  const batch=captureCombatDisplay(enc,()=>E.step(trial,enc,trial.nextActionAt));
  const event=batch.events.find(v=>v.targetId==='hero'&&['hit','miss'].includes(v.outcome)&&enc.enemies.some(u=>u.id===v.sourceId));
  if(event){if(event.outcome==='miss')miss++;else hit++;measured=true;}
 }
 assert(measured,'actual enemy attack found');assert(E.validSave(trial));assert.deepEqual(trial.legendaryRuntime.byId[boots.id].state,{version:1,passive:true});
}
const rate=miss/(hit+miss);assert(rate>.20&&rate<.30,`observed miss ${rate}`);console.log('PASS boots equipped-only / all races / fixed100 / duplicate / ordinary quality4 / diminishing pool / repeat 5% boss pool / actual hit-miss:',{hit,miss,rate});
