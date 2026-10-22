import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
import {enableM2TestBudget} from './m2-test-budget-fixture.mjs';
enableM2TestBudget();
for(const level of [99,100,137]){const s=E.fresh();s.level=level;s.xp=level===99?99*80-1:17;s.skills=['break',null,null,null];s.lastSeen=0;E.normalizeHealth(s,0);const e=E.startInstanceEncounter(s,'dwarf.a01.field',0);assert(e);for(let i=0;i<100&&!e.done;i++)E.step(s,e,s.nextActionAt);assert(e.win);const before={level:s.level,xp:s.xp};E.reward(s,e,s.lastHealthClock);assert(E.validSave(s));if(level>=100){assert.equal(e.acceptedXp,0);assert.deepEqual({level:s.level,xp:s.xp},before);assert(s.running);assert(!e.rewardNotes.some(x=>x.includes('额外基础经验')));}else{assert.equal(s.level,100);assert(e.acceptedXp>0);assert.equal(s.xp,e.acceptedXp-1);}}
E.configureDwarfParameters(null);console.log('PASS M2 actual reward level100 cap/arrival remainder, legacy137 unchanged, auto continues and capped XP receipt zero');
