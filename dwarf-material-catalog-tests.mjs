import assert from 'node:assert/strict';
import * as D from './dist/dwarf-material-catalog.js';
import {recoveryInputPlan} from './dist/recovery-recipe-schema.js';
assert.equal(Object.keys(D.DWARF_MATERIALS).length,18);assert.equal(D.DWARF_MONSTER_INFO.length,13);
for(const [key,id]of Object.entries(D.LEGACY_MATERIAL_IDS)){assert.equal(D.resolveDwarfMaterialId(key),id);assert.equal(D.toDwarfInventoryKey(id),key);assert.equal(D.DWARF_MATERIAL_REGISTRY[key].catalogId,id);}
assert.equal(D.resolveDwarfMaterialId('unknown'),null);assert.equal(D.getDwarfMaterialPool('dwarf.a01.normal.1','dwarf.a03.boss'),null);
for(const pool of Object.values(D.DWARF_MATERIAL_SOURCE_POOLS)){assert(D.validDwarfMaterialPool(pool),pool.monsterId+' '+pool.nodeId);for(const c of pool.channels)for(const e of c.entries){assert(D.DWARF_MATERIALS[e.materialId].sources.includes(pool.nodeId));assert(!D.DWARF_MATERIALS[e.materialId].storyOnly);}}
let draws=0;const state={counts:{}};const options={random:()=>{draws++;return 0;},luck:7,rollQuality:(weights,luck)=>{assert.equal(luck,7);return weights.findIndex(n=>n>0)},owned:(s,id)=>(s.counts[id]??0)>0,receive:(s,row)=>{s.counts[row.materialId]=(s.counts[row.materialId]??0)+row.quantity;return true;}};
const e={contentVersion:'dwarf-m2-v1',instanceId:'dwarf.a01.field'},unit={definitionId:'dwarf.a01.normal.1'};
assert(!D.rollMonsterMaterials(state,e,{definitionId:'unknown'},options).ok);assert.equal(draws,0);assert(!D.rollMonsterMaterials(state,{...e,instanceId:'dwarf.a02.field'},unit,options).ok);assert.equal(draws,0);
const first=D.rollMonsterMaterials(state,e,unit,options);assert(first.ok);assert(first.drops.some(d=>d.channel==='regular'));assert(first.drops.some(d=>d.channel==='recovery'));assert(first.drops.some(d=>d.channel==='gem'&&d.quality===3));const second=D.rollMonsterMaterials(state,e,unit,options);assert(second.ok);assert(!second.drops.some(d=>d.channel==='gem'));assert.equal(state.counts['dwarf.infinity_gem_dwarf'],1);
delete state.counts['dwarf.infinity_gem_dwarf'];assert(D.rollMonsterMaterials(state,e,unit,options).drops.some(d=>d.channel==='gem'));
assert(!D.rollMonsterMaterials(state,e,{...unit,origin:'summoned'},options).ok);
const sourceMaterials=new Set(first.drops.map(d=>d.materialId));assert(!sourceMaterials.has('dwarf.furnace_crystal'));assert(!sourceMaterials.has('dwarf.oath_fragment'));
const recovery=Object.entries(D.DWARF_MATERIAL_REGISTRY).filter(([,m])=>m.functionalTags.includes('recoveryBase'));assert(recovery.length>=4);
for(const [key]of recovery)for(let quality=0;quality<4;quality++){const plan=recoveryInputPlan(quality,[{key:key+'|'+quality,quantity:3}],D.DWARF_MATERIAL_REGISTRY);assert(plan);assert.equal(plan.quantity,3);assert.equal(plan.gold,(quality+1)*3);assert.equal(recoveryInputPlan(quality,[{key:key+'|'+((quality+1)%4),quantity:3}],D.DWARF_MATERIAL_REGISTRY),null);}
assert.equal(recoveryInputPlan(0,[{key:'铁屑|0',quantity:1}],D.DWARF_MATERIAL_REGISTRY),null);
console.log('PASS dwarf materials:18 registry/13 identities, strict all source pairs, no invented fallback, old4 keys, independent channels, sequential gem ownership/reacquire, no summons/story materials, same-quality recovery substitution.');

assert.equal(Object.values(D.DWARF_MATERIAL_REGISTRY).filter(m=>m.merchantAllowed).length,6);
assert.equal(D.DWARF_MATERIAL_REGISTRY['dwarf.blackvein_ore'].merchantBasePrice,3);
assert.equal(D.DWARF_MATERIAL_REGISTRY['dwarf.rock_lizard_sinew'].merchantBasePrice,8);
for(const id of ['dwarf.infinity_gem_dwarf','dwarf.return_token_dwarf','dwarf.cold_spring_moss'])assert.equal(D.DWARF_MATERIAL_REGISTRY[id].merchantAllowed,false);
console.log('PASS explicit merchant pool: old4 unchanged + blackvein3/sinew8, no gem/story/unopened material.');
