import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {PRODUCTION_DWARF_PARAMETERS as P} from './dist/dwarf-parameters.js';
import {DWARF_MATERIAL_SOURCE_POOLS} from './dist/dwarf-material-catalog.js';
const historicalSource=execFileSync('git',['show','4e1a6a5:dist/dwarf-parameters.js'],{encoding:'utf8'});const META=JSON.parse(historicalSource.split('DWARF_PARAMETER_PROVENANCE=freeze(')[1].split(');')[0]);
assert.equal(P.reviewed,true);assert(!Object.hasOwn(P,'testOnly'));assert.equal(P.fieldGroupChance,.04);assert.equal(P.skillOverrides['dwarf.a03.boss:0'].castMs,2200);assert.equal(Object.keys(P.monsters).filter(id=>Number(id.split('.')[1].slice(1))<=3).length,13);
const restored=structuredClone(Object.values(DWARF_MATERIAL_SOURCE_POOLS).filter(row=>Number(row.nodeId.split('.')[1].slice(1))<=3));let count=0;for(const row of restored)for(const c of row.channels)if(c.channel==='recovery'){assert.equal(c.quantity,1);c.quantity=3;count++;}assert.equal(count,22);assert.equal(createHash('sha256').update(JSON.stringify(restored)).digest('hex'),META.unpatchedMaterialRowsSha256,'exact22 quantity-only edits, all probability/quality/regular pools unchanged');
// A fresh JS realm is essential: earlier tests intentionally inject/clear providers.
const code=`
import assert from 'node:assert/strict';
import * as E from ${JSON.stringify(new URL('./dist/engine.js',import.meta.url).href)};
import {dwarfParameterSet} from ${JSON.stringify(new URL('./dist/dwarf-content.js',import.meta.url).href)};
const initial=E.fresh();E.normalizeHealth(initial,0);assert(E.dwarfBudgetReady());assert.equal(initial.supportGrantEligible,undefined);const rows=E.plannedNodes(initial).filter(n=>n.areaNumber<=3);assert.equal(rows.length,7);assert(rows.every(x=>x.budgetReady));
const original=Math.random;Math.random=()=>.5;const e=E.startRoutedEncounter(initial,0);assert(e);for(let i=0;i<300&&!e.done;i++)E.step(initial,e,initial.nextActionAt);assert(e.win);const gold=initial.gold;E.reward(initial,e,initial.lastHealthClock);assert(initial.gold>gold);assert(E.validSave(initial));
let grouped=false;for(let seed=0;seed<10000&&!grouped;seed++){Math.random=()=>seed/10000;const s=E.fresh();E.normalizeHealth(s,0);const battle=E.startRoutedEncounter(s,0);if(battle.fieldGroup){assert([2,3].includes(battle.enemies.length));assert(E.validSave(s));grouped=true;}}assert(grouped,'real default4% group can spawn');Math.random=original;
for(const row of rows){const s=E.fresh();s.level=30;E.normalizeHealth(s,0);E.normalizeExpedition(s);s.areaProgress.dwarf={unlocked:[1,2,3],cleared:[1,2]};assert(E.startInstanceEncounter(s,row.id,0),row.id);assert(E.validSave(s));}
const b=E.fresh();b.level=30;E.normalizeHealth(b,0);E.normalizeExpedition(b);b.areaProgress.dwarf={unlocked:[1,2,3],cleared:[1,2]};b.skills=[null,null,null,null];const boss=E.startInstanceEncounter(b,'dwarf.a03.boss',0),u=boss.enemies[0];u.control.cooldowns['dwarf.a03.boss:0']=0;E.step(b,boss,b.nextActionAt);assert.equal(u.control.preparing.duration,2200);assert.equal(u.control.preparing.completesAt-u.control.preparing.startedAt,2200);
E.configureDwarfParameters(null);const missing=E.fresh();E.normalizeHealth(missing,0);assert.equal(E.startRoutedEncounter(missing,0),null);assert(E.plannedNodes(missing).every(x=>!x.budgetReady));
console.log('PASS isolated default production boot, real fresh fight/reward, nonzero group,7nodes,2200msboss cast, no missing-provider fallback');
`;
process.stdout.write(execFileSync(process.execPath,['--input-type=module','-e',code],{encoding:'utf8'}));
console.log('PASS M2 approved provider13/sourceSHA and exact22 recovery quantity3→1, all other material fields preserved');
