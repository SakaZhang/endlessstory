import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as E from './dist/engine.js';
import {reachStoryScene} from './story-event-test-fixture.mjs';
import {STORY_SCENES} from './dist/story-event-registry.js';
import {advanceStoryScenario} from './dist/story-scenario-combat.js';
const rows=[];
for(const race of ['human','dwarf','elf','goblin','ashen'])for(const phase of ['X05','X07']){
 const baseline=reachStoryScene(race,'C10.'+phase+'.'+race);
 for(const level of [20,40,60,100]){
  const s=structuredClone(baseline);s.level=level;
  // Actual start-of-save equipment; no synthetic max-tier items or point grants.
  // Remove Ashen story core from the equipped slot only, preserving its ledger.
  if(race==='ashen'){const original=s.inventory.find(x=>x.slot==='core'&&!x.legendaryId);assert(original);assert(E.equipItem(s,original.id,'core'));}
  s.heroHp=E.stats(s).hp;const d=STORY_SCENES[s.story.activeScene.id];assert(E.validSave(s));const e=E.startStoryScenario(s,d.encounter.scenarioId,Math.max(s.lastHealthClock,s.nextBattleAt??0)+2000);assert(e);e.rngState=12345;
  const initial={hp:e.enemies[0].max,atk:e.enemies[0].atk,armor:e.enemies[0].armor,enemies:e.enemies.length};let actions=0;while(!e.done&&actions++<3000)E.step(s,e,s.nextActionAt);assert(e.done,'finite battle, no healing/DPS lock');if(phase==='X05')assert(e.round<=6,'bounded holdout');if(level>=60)assert.notEqual(e.storyScenario.result,'retry','starter gear level60+ is viable: '+race+' '+phase);
  rows.push({race,phase,level,hero:E.stats(s).hp,initial,rounds:e.round,result:e.storyScenario.result,equipment:'fresh initial gear; Ashen story core unequipped; default selected skills',rng:12345});
 }
}
fs.mkdirSync('qa/story-finale',{recursive:true});fs.writeFileSync('qa/story-finale/balance.json',JSON.stringify({status:'candidate tuning, not final balance acceptance',rows},null,2));console.table(rows.map(({race,phase,level,rounds,result})=>({race,phase,level,rounds,result})));console.log('PASS bounded holdout at all sampled levels; five-race level60/100 fresh-gear final clear; low-level failures remain honest retries. Candidate tuning only.');
