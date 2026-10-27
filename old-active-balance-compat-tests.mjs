import assert from 'node:assert/strict';import fs from 'node:fs';
import * as E from './dist/engine.js';import {MONSTER_BALANCE_ID} from './dist/monster-balance.js';
const root=new URL('./fixtures/v070-active-balance/',import.meta.url),manifest=JSON.parse(fs.readFileSync(new URL('manifest.json',root)));
assert.equal(manifest.sourceCommit,'9f56c77996038f929d390a35ac48167250f1475d');assert.equal(manifest.rows.length,25);
for(const row of manifest.rows){const s=JSON.parse(fs.readFileSync(new URL(row.name,root))),before=JSON.stringify(s),e=s.activeEncounter;assert(E.validSave(s),row.name+' old save valid');assert(e&&!e.done&&e.pauseAt!==undefined);assert(e.enemies.every(u=>u.parameterSetId!==MONSTER_BALANCE_ID));
 const actors=JSON.stringify(e.enemies);assert(E.normalizeHealth(s,s.lastHealthClock));assert.equal(JSON.stringify(e.enemies),actors,'hydration never rerolls old actor');assert.deepEqual(E.step(s,e,s.lastHealthClock+5500),[],'paused stays paused');assert.equal(JSON.stringify(e.enemies),actors);assert.equal(JSON.stringify(s),before,'read/paused action preserves exact old save');
 assert(E.setMultiPaused(s,false,s.lastHealthClock));for(let i=0;i<1000&&!e.done;i++){E.step(s,e,s.nextActionAt);assert(E.validSave(s),row.name+' each resumed action');}assert(e.done&&e.win,row.name+' completes');E.reward(s,e,s.lastHealthClock);assert(e.rewarded);assert(E.validSave(s));
 if(row.kind==='dungeon'&&row.stage<3){const next=E.startInstanceEncounter(s,row.id,s.nextBattleAt);assert(next&&E.validSave(s));assert(next.enemies.every(u=>u.parameterSetId===MONSTER_BALANCE_ID),'only fresh next actor takes new regional budget');}
}
console.log('PASS exact v0.70 five-race field / three-stage dungeon / boss snapshots hydrate, pause, resume, settle; old actors unchanged, new stage adopts new budget.');
