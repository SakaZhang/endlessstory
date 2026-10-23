import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
import {commitGameTransaction} from './dist/storage.js';
import {normalizeSkillTree} from './dist/skill-tree-state.js';
const old=E.fresh({legacySkillModel:true});assert.equal(old.skillTree,undefined);assert(E.validSave(JSON.parse(JSON.stringify(old))));assert.equal(E.SKILL_TREE_DEFINITION.nodes.reduce((n,x)=>n+x.cost,0),99);assert(Object.isFrozen(E.SKILL_TREE_DEFINITION.nodes));
const quote=E.quoteSkillTreePreparation(old,{type:'prepare'});assert(quote);assert.equal(old.skillTree,undefined);const prepared=E.prepareSkillTreePreparation(old,quote);assert(prepared);assert.equal(prepared.game.skillTree.mode,'prepared');assert(E.validSave(prepared.game));assert.deepEqual(prepared.game.skills,old.skills);assert.deepEqual(prepared.game.talents,old.talents);
for(const patch of [s=>s.skillTree.configId='caller-config',s=>s.skillTree.presets[0].unlocked=['fake'],s=>s.skillTree.presets[0].unlocked=['fault_sweep'],s=>s.skillTree.legacy.skills=['fake'],s=>s.skillTree.extra=true]){const bad=structuredClone(prepared.game);patch(bad);assert(!E.validSave(bad));}
assert.equal(E.quoteSkillTreePreparation(prepared.game,{type:'activate',confirm:true}),null);const tampered=structuredClone(quote);tampered.after.mode='active';assert.equal(E.prepareSkillTreePreparation(old,tampered),null);
const raw=JSON.stringify(old);const failed=commitGameTransaction({setItem(){throw Error('quota');}},old,next=>{const p=E.prepareSkillTreePreparation(next,quote);if(!p)return false;next.skillTree=p.game.skillTree;return p.result;});assert(!failed.ok);assert.equal(JSON.stringify(old),raw);
const store={setItem(k,v){this.raw=v;}};const success=commitGameTransaction(store,old,next=>{const p=E.prepareSkillTreePreparation(next,quote);if(!p)return false;next.skillTree=p.game.skillTree;return p.result;});assert(success.ok);assert(E.validSave(JSON.parse(store.raw)));assert.equal(old.skillTree,undefined);
const wrong=E.fresh({legacySkillModel:true});normalizeSkillTree(wrong,{...E.SKILL_TREE_DEFINITION,id:'arbitrary-caller-tree'});assert(!E.validSave(wrong));
console.log('PASS engine preparation fixed99candidate trust root, oldmissing accepted, prepared persisted, preparation API cannot silently activate, malformed/importconfig rejected, atomicquota rollback');
