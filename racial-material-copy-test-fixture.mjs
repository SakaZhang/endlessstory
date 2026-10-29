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
