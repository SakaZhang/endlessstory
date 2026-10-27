import assert from 'node:assert/strict';
import * as M from './dist/monster-codex-schema.js';
import * as U from './dist/monster-codex-ui.js';
import {DWARF_MONSTER_INFO} from './dist/dwarf-material-catalog.js';
const s={monsterLedger:{version:1,encountered:{'grayflag-raider':true}}};
assert.equal(Object.keys(M.MONSTER_CATALOG).length,224);assert.equal(Object.keys(M.MONSTER_CATALOG).filter(id=>id.startsWith('dwarf.')).length,44);assert(M.validMonsterLedger(s));
for(const m of DWARF_MONSTER_INFO){assert.deepEqual(M.monsterCodexEntry(s,m.id),{id:m.id,encountered:false});const html=U.renderMonsterDetail(s,m.id);assert(!html.includes(m.name));}
const e={contentVersion:'dwarf-m2-v1',instanceId:'dwarf.a01.field',enemies:[{definitionId:'dwarf.a01.normal.1',sourceInstanceId:'dwarf.a01.field'}]};
assert.deepEqual(M.recordEncounteredMonsters(s,e),['dwarf.a01.normal.1']);assert(M.monsterCodexEntry(s,'dwarf.a01.normal.1').encountered);assert(s.monsterLedger.encountered['grayflag-raider']);
const state=JSON.stringify(s);M.recordEncounteredMonsters(s,{...e,instanceId:'dwarf.a02.field',enemies:[{definitionId:'dwarf.a01.normal.2'}]});assert.equal(JSON.stringify(s),state);M.recordEncounteredMonsters(s,{...e,developmentFixture:true,enemies:[{definitionId:'dwarf.a01.normal.2'}]});assert.equal(JSON.stringify(s),state);
const details=U.renderMonsterDetail(s,'dwarf.a01.normal.1');assert(details.includes('灰旗劫掠者'));assert(details.includes('劈肩斧'));assert(details.includes('山心赤晶'));assert(!details.includes('炉火晶'));
assert(M.materialMonsterSources(s,'dwarf.furnace_crystal').filter(r=>r.instanceId.startsWith('dwarf.a')).every(r=>!r.instanceId.startsWith('dwarf.a01')));
assert(M.materialMonsterSources(s,'dwarf.ashroot').some(r=>r.instanceId==='dwarf.a03.boss'));
assert.equal(M.materialMonsterSources(s,'dwarf.return_token_dwarf').length,0);
const old=JSON.parse(state);assert(M.validMonsterLedger(old));assert(M.monsterCodexEntry(old,'grayflag-raider').encountered);
const routes=U.renderMaterialSources(s,'dwarf.blackvein_ore');assert(routes.includes('黑脉矿 · 获取途径'));assert(!routes.includes('dwarf.blackvein_ore · 获取途径'));
console.log('PASS M2 monster codex:44 dwarf +173 expansion +7 legacy, encounter-only unlock, fixture/wrong source rejected, actual per-monster material routes and Chinese names, A03 boss recovery valid, no story random source, old ledger retained.');
