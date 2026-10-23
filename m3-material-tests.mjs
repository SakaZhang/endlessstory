import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {DWARF_MATERIAL_SOURCE_POOLS as pools,DWARF_MONSTER_INFO as monsters,DWARF_MATERIALS as materials,validDwarfMaterialPool,rollMonsterMaterials,toDwarfInventoryKey} from './dist/dwarf-material-catalog.js';
import {recoveryInputPlan} from './dist/recovery-recipe-schema.js';
const prior=execFileSync('git',['show','319ca607:dist/dwarf-material-catalog.js'],{encoding:'utf8'});
const old=JSON.parse(prior.match(/DWARF_MATERIAL_SOURCE_POOLS=freeze\(Object.fromEntries\((\[.*?\])\.map/)[1]);
for(const row of old)assert.deepEqual(pools[row.monsterId+'|'+row.nodeId],row);
assert.equal(Object.values(pools).filter(r=>Number(r.nodeId.split('.')[1].slice(1))<=6).length,44);assert.equal(monsters.filter(m=>m.area<=6).length,26);assert.equal(Object.keys(materials).length,18);
const rows=Object.values(pools).filter(p=>/^dwarf\.a0[456]\./.test(p.monsterId));assert.equal(rows.length,22);
const registry=Object.fromEntries(Object.values(materials).map(m=>[toDwarfInventoryKey(m.id),m]));
for(const row of rows){assert(validDwarfMaterialPool(row));for(const c of row.channels){if(c.channel==='recovery')assert.equal(c.quantity,1);for(const x of c.entries){assert(materials[x.materialId].sources.includes(row.nodeId));assert(!materials[x.materialId].storyOnly);if(c.channel==='recovery')for(let q=0;q<4;q++)assert(recoveryInputPlan(q,[{key:toDwarfInventoryKey(x.materialId)+'|'+q,quantity:1}],registry));}}}
const pool=rows.find(p=>p.channels.some(c=>c.channel==='gem'&&c.entries.length)),s={owned:new Set()},e={contentVersion:'dwarf-m2-v1',instanceId:pool.nodeId},u={definitionId:pool.monsterId};let receipts=[];
const options={random:()=>0,rollQuality:()=>0,owned:(s,id)=>s.owned.has(id),receive:(s,row)=>{receipts.push(row);s.owned.add(row.materialId);return true;}};
assert(rollMonsterMaterials(s,e,u,options).ok);const gem=receipts.find(x=>materials[x.materialId].uniqueHeld);assert(gem);assert.equal(gem.quality,3);assert(rollMonsterMaterials(s,e,u,options).ok);assert.equal(receipts.filter(x=>x.materialId===gem.materialId).length,1);
assert.equal(rollMonsterMaterials({}, {...e,instanceId:'dwarf.a01.boss'},u,options).ok,false);
assert.equal(rollMonsterMaterials(s,e,{...u,origin:'summoned'},options).ok,false);
console.log('PASS M3 22 source rows/13 monster codex additions, M2 pools unchanged, strict node eligibility, local same-quality recovery substitutes, unique gem second-round ownership recheck');
