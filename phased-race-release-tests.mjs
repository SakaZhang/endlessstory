import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
import {getSkillTreeDefinition,PLAYABLE_RACES} from './dist/race-registry.js';
import {DWARF_EXPANDED_DEFINITION} from './dist/dwarf-skill-expansion.js';
for(const race of PLAYABLE_RACES){const state=E.fresh(race),tree=getSkillTreeDefinition(state);assert(E.validSave(state));assert.equal(tree.nodes.length,30);assert.equal(tree.nodes.reduce((n,x)=>n+x.cost,0),99);assert.equal(state.skillTree.presets.length,3);assert(E.validSave(JSON.parse(JSON.stringify(state))));}
assert.equal(getSkillTreeDefinition('dwarf'),DWARF_EXPANDED_DEFINITION);
console.log('PASS all five active30-node99-point trees, fresh schema4 and JSON reload; no development-save migration.');
