import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {WORLD_MATERIALS} from './dist/world-materials.js';
import {beforeHumanEndgameSources,beforeEarlyLuckTags,beforeMaterialCopy,MATERIAL_COPY_AMENDMENTS} from './racial-material-copy-test-fixture.mjs';
const baseline=JSON.parse(readFileSync(new URL('./fixtures/infinity-gem-base-before-v065.json',import.meta.url)));
const sha=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
const original=JSON.stringify(WORLD_MATERIALS);
assert.equal(sha(beforeMaterialCopy(beforeEarlyLuckTags(beforeHumanEndgameSources(WORLD_MATERIALS)))),baseline.materialsSha256,'the original complete material hash remains authoritative');
assert.equal(JSON.stringify(WORLD_MATERIALS),original,'normalization cannot mutate runtime data');
assert.equal(MATERIAL_COPY_AMENDMENTS.length,42);
assert.equal(new Set(MATERIAL_COPY_AMENDMENTS.map(x=>`${x.id}.${x.field}`)).size,42);
// A new copy change is NOT silently accepted by the historical projection.
const changedCopy=structuredClone(WORLD_MATERIALS),amendment=MATERIAL_COPY_AMENDMENTS[0];
changedCopy[amendment.id][amendment.field]+='未经审阅';
assert.throws(()=>beforeMaterialCopy(changedCopy),/expected exact reviewed copy/);
// Negative controls: preserve all source IDs, quality, flags and money fields,
// including fields newly added in the future, not just a schema allowlist.
const id=Object.keys(WORLD_MATERIALS).find(id=>WORLD_MATERIALS[id].sources?.length);
for(const edit of [
 m=>m[id].sources[0]='invented.a01.field',
 m=>m[id].qualityRange[0]=999,
 m=>m[id].uniqueHeld=!m[id].uniqueHeld,
 m=>m[id].storyOnly=!m[id].storyOnly,
 m=>m[id].id='invented.material',
 m=>m[id].merchantBasePrice=(m[id].merchantBasePrice??0)+1,
 m=>m[id].name+=' altered',
 m=>m[id].futureMechanic=123,
 m=>delete m[id].sources,
]){
 const changed=structuredClone(WORLD_MATERIALS);edit(changed);
 assert.notEqual(sha(beforeMaterialCopy(beforeEarlyLuckTags(beforeHumanEndgameSources(changed)))),baseline.materialsSha256,'non-copy mutations must remain visible to the exact hash');
}
console.log('PASS material copy compatibility: 42 exact field amendments, unchanged original full hash, runtime immutability, 9 mechanic/identity negative controls.');

for(const tags of [['recoveryBase'],['recoveryBase','luckBase','luckAux','strengthBase'],['luckBase','luckAux']]){
 const changed=structuredClone(WORLD_MATERIALS);changed['dwarf.ashroot'].functionalTags=tags;
 assert.throws(()=>beforeEarlyLuckTags(changed),/exact approved early-luck tags/);
}
const unauthorized=structuredClone(WORLD_MATERIALS);unauthorized['dwarf.iron_filings'].functionalTags.push('luckBase');
assert.notEqual(sha(beforeMaterialCopy(beforeEarlyLuckTags(beforeHumanEndgameSources(unauthorized)))),baseline.materialsSha256,'nonapproved materials cannot acquire luck tags');
console.log('PASS exact five-material authorized tag projection and four unauthorized-tag negative controls; original v0.65 fixture untouched.');

for(const edit of [m=>m['human.mat.11'].sources.pop(),m=>m['human.mat.11'].sources.push('human.a10.boss'),m=>m['human.mat.02'].sources.push('human.a10.boss')]){const changed=structuredClone(WORLD_MATERIALS);edit(changed);assert.throws(()=>beforeHumanEndgameSources(changed));}
console.log('PASS exact A10 source append projection rejects missing, duplicate and extra material eligibility.');
// v0.85 changes only the four gem usage labels; guard every new/revised field.
for(const [id,field] of [['ashen.infinity_gem_ashen','hiddenUsage'],['goblin.infinity_gem_goblin','use'],['elf.infinity_gem_elf','uses'],['human.mat.17','uses']]){
 const changed=structuredClone(WORLD_MATERIALS);changed[id][field]+='未经审阅';assert.throws(()=>beforeMaterialCopy(changed),/expected exact reviewed copy/);
}
console.log('PASS exact four v085 infinity-fusion usage labels reject any additional prose change.');
