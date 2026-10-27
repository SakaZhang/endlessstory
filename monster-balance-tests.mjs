import assert from 'node:assert/strict';
import {WORLD_MONSTERS,monsterParameters} from './dist/world-content.js';
import {MONSTER_BALANCE_ID,balanceMonsterParameters} from './dist/monster-balance.js';
import {dwarfParameters} from './dist/dwarf-content.js';
import * as E from './dist/engine.js';
for(const d of Object.values(WORLD_MONSTERS)){
 const before=JSON.stringify(d),p=monsterParameters(d.id);assert(p);assert.equal(p.parameterSetId,MONSTER_BALANCE_ID);for(const k of ['hp','atk','armor','elementalPower','rewardXp','rewardGold'])assert(Number.isFinite(p[k])&&p[k]>=0,`${d.id} ${k}`);assert.equal(p.basicIntervalMs>0,true);assert.equal(JSON.stringify(d),before,'authored skills/traits not mutated');assert.deepEqual(monsterParameters(d.id),p,'fixed content independent of hero');
}
for(const race of E.RACE_KEYS){for(let n=1;n<=3;n++){const a=monsterParameters(`${race}.a03.normal.${n}`),b=monsterParameters(`${race}.a04.normal.${n}`);assert(b.atk>=a.atk,`${race} A3/A4 attack no inversion`);assert(b.hp>a.hp);}
 const s=E.fresh(race);E.normalizeHealth(s,s.lastSeen);const e=E.startInstanceEncounter(s,race+'.a01.field',s.lastSeen);assert(e&&E.validSave(s));assert(e.enemies.every(u=>u.parameterSetId===MONSTER_BALANCE_ID));
 for(let k=0;k<80&&!e.done;k++)E.step(s,e,s.nextActionAt);assert(e.done&&e.win,'unarmed first field is viable');assert(E.validSave(s));
}
const raw=dwarfParameters('dwarf.a10.elite'),copy=JSON.stringify(raw);balanceMonsterParameters(WORLD_MONSTERS['dwarf.a10.elite'],raw);assert.equal(JSON.stringify(raw),copy,'legacy provider immutable');
for(let area=1;area<=10;area++){const code=String(area).padStart(2,'0');const rows=E.RACE_KEYS.map(r=>monsterParameters(`${r}.a${code}.normal.1`));assert(rows.every(p=>p.rewardXp===rows[0].rewardXp&&p.rewardGold===rows[0].rewardGold),'same-tier ordinary reward parity');const elites=E.RACE_KEYS.map(r=>monsterParameters(`${r}.a${code}.elite`));assert(elites.every(p=>p.rewardXp===elites[0].rewardXp&&p.rewardGold===elites[0].rewardGold),'same-tier elite reward parity');}
console.log('PASS fixed regional threat budgets, viable empty start, immutable authored mechanics/providers, A3→A4 growth, five-race reward parity.');
