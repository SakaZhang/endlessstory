// Run after fresh() is switched to the approved active-tree starter.
import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
import {skillPointBudget,draftSkillTreePresetPayload,quoteSkillTreeDraft,prepareSkillTreeDraft} from './dist/skill-tree-state.js';
const fresh=E.fresh();assert.equal(fresh.level,1);assert.equal(skillPointBudget(fresh),0);assert.equal(fresh.skillTree.mode,'active');assert.equal(fresh.skillTree.presets.length,3);
for(const p of fresh.skillTree.presets){assert.deepEqual(p.unlocked,[]);assert.deepEqual(p.active,[null,null,null,null]);assert.deepEqual(p.passive,[null,null]);}
assert(E.validSave(fresh));assert(E.validSave(JSON.parse(JSON.stringify(fresh))));assert(fresh.skills.every(x=>x===null),'new starter must not gift old four skills');
const legacy=structuredClone(fresh);delete legacy.skillTree;legacy.skills=['break','mark','guard','interrupt'];legacy.conditions=['always','always','always','charge'];legacy.level=10;
const before=structuredClone(legacy);assert(E.validSave(legacy));E.normalizeSkillProgression(legacy);assert.equal(legacy.skillTree,undefined,'legacy load never implicitly converts');assert.deepEqual(legacy.skills,before.skills);
const oldQuote=E.quoteSkillTreePreparation(legacy,{type:'prepare'});assert(oldQuote);const prepared=E.prepareSkillTreePreparation(legacy,oldQuote);assert(prepared);assert.equal(prepared.game.skillTree.mode,'prepared');assert.deepEqual(prepared.game.skillTree.legacy.skills,before.skills);
const draft=draftSkillTreePresetPayload(prepared.game,E.SKILL_TREE_DEFINITION,{baseState:structuredClone(prepared.game),presets:prepared.game.skillTree.presets,selectedPreset:0,activate:true,confirm:true});assert(draft);
const quote=quoteSkillTreeDraft(prepared.game,draft,E.SKILL_TREE_DEFINITION,{confirm:true});assert(quote);prepared.game.gold+=123;prepared.game.heroHp=1;
const activated=prepareSkillTreeDraft(prepared.game,quote,E.SKILL_TREE_DEFINITION);assert(activated);assert.equal(activated.game.gold,prepared.game.gold);assert.equal(activated.game.heroHp,1);assert.deepEqual(activated.game.skills,before.skills);assert.deepEqual(activated.game.skillTree.legacy.skills,before.skills);assert.deepEqual(activated.game.skillTree.presets[0].unlocked,[]);
for(const activeEncounter of [{done:false,skillResolver:'legacy'},{done:true,rewarded:false,skillResolver:'legacy'}]){const blocked={...prepared.game,activeEncounter};assert.equal(prepareSkillTreeDraft(blocked,quote,E.SKILL_TREE_DEFINITION),null);assert.equal(blocked.activeEncounter.skillResolver,'legacy');}
console.log('PASS fresh active Lv1 zero-point empty slots, legacy no auto conversion, explicit empty migration snapshot and resource conservation, pending legacy battle blocks conversion');

const levelled=E.fresh();levelled.level=55;assert.deepEqual(E.collectSkillUnlockNotices(levelled),[],'new tree must not announce old14 auto unlock');assert.equal(skillPointBudget(levelled),54);
