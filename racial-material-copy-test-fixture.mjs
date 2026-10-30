import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

// Exact, reviewed field-level amendments only. Keep the original full-catalog
// hash authoritative; never strip prose wholesale or rewrite historical facts.
export const MATERIAL_COPY_AMENDMENTS=JSON.parse(readFileSync(new URL('./fixtures/racial-material-copy-amendments.json',import.meta.url)));
export function beforeMaterialCopy(materials){
 const historical=structuredClone(materials);
 for(const {id,field,before,after} of MATERIAL_COPY_AMENDMENTS){
  assert(['sourceNote','sourcePolicy','hiddenUsage','use'].includes(field),'only reviewed prose fields');
  assert.equal(typeof before,'string');assert.equal(typeof after,'string');
  assert.equal(historical[id]?.[field],after,`${id}.${field}: expected exact reviewed copy`);
  historical[id][field]=before;
 }
 return historical;
}

// User-authorized early lucky-potion role expansion, independent of copy edits.
// Validate the exact new tags BEFORE undoing them for the unchanged v0.65 hash.
export const EARLY_LUCK_TAG_IDS=Object.freeze(['dwarf.ashroot','human.mat.02','elf.dew_crown','goblin.mat.01','ashen.salt_shell']);
export function beforeEarlyLuckTags(materials){
 const historical=structuredClone(materials);
 for(const id of EARLY_LUCK_TAG_IDS){
  assert.deepEqual(historical[id]?.functionalTags,['recoveryBase','luckBase','luckAux'],id+': exact approved early-luck tags');
  historical[id].functionalTags=['recoveryBase'];
 }
 return historical;
}

// v080 authorizes exactly five source appends, not arbitrary source changes.
export const HUMAN_ENDGAME_MATERIAL_IDS=Object.freeze(['human.mat.11','human.mat.12','human.mat.15','human.mat.16','human.mat.17']);
export function beforeHumanEndgameSources(materials){
 const historical=structuredClone(materials),node='human.a10.boss';
 assert.deepEqual(Object.values(historical).filter(m=>m.sources?.includes(node)).map(m=>m.id).sort(),[...HUMAN_ENDGAME_MATERIAL_IDS].sort());
 for(const id of HUMAN_ENDGAME_MATERIAL_IDS){assert.equal(historical[id].sources.at(-1),node);assert.equal(historical[id].sources.filter(n=>n===node).length,1);historical[id].sources.pop();}
 return historical;
}
