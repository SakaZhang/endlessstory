import assert from 'node:assert/strict';
import {E,setup,stableAffixes,captureCombatDisplay,exactSegments} from './tests/races/human/reflect-fixture.mjs';
import {applyEnemyDamageSegment} from './dist/multi-combat.js';
import {racialLegendaryHitModifiers,dispatchRacialLegendaryEvent} from './dist/racial-legendary-runtime.js';
// Real factory items from three races occupy distinct slots on a Human host.
const f=setup();
for(const id of ['elf-sixfold-heartwood','goblin-silent-steps']){
 const item=stableAffixes(E.legendaryItem(id,100));f.s.inventory.push(item);assert(E.equipItem(f.s,item.id));
}
const st=E.stats(f.s),staff=f.s.inventory.find(i=>i.id===f.s.equip.weapon);
assert.equal(st.dodgeRating,100);assert.equal(st.dodge,.25);
assert.equal(racialLegendaryHitModifiers(f.s,{sourceKind:'skill',damageType:'fire'}).damageMultiplier,1.3);
dispatchRacialLegendaryEvent(f.s,{type:'battleStart'},{stats:st,maxHp:st.hp});
const state=f.s.legendaryRuntime.byId[staff.id].state;state.pendingCastId='combined-cast';state.pendingTargetId=f.e.enemies[0].id;
assert.equal(racialLegendaryHitModifiers(f.s,{sourceKind:'skill',damageType:'fire',castId:'combined-cast'}).damageMultiplier,2.6);
assert.equal(racialLegendaryHitModifiers(f.s,{sourceKind:'skill',damageType:'physical',castId:'combined-cast'}).damageMultiplier,2);
assert.equal(racialLegendaryHitModifiers(f.s,{sourceKind:'dot',damageType:'fire',castId:'combined-cast'}).damageMultiplier,1.3);
const before=structuredClone(state),rng=f.e.rngState,casts=f.e.activeCastCount,u=f.e.enemies[0];
f.e.shield=20;
const batch=captureCombatDisplay(f.e,()=>applyEnemyDamageSegment(f.s,f.e,80,{sourceId:u.id,element:'fire'},{st}));
assert.equal(exactSegments(batch).length,1);assert.equal(batch.events.find(x=>x.skillId==='human-banner-armor').hpDelta,-40);
assert.deepEqual(f.s.legendaryRuntime.byId[staff.id].state,before,'reflection does not consume or build staff charge');assert.equal(f.e.rngState,rng);assert.equal(f.e.activeCastCount,casts);
f.s.legendaryRuntime.byId[staff.id].state.pendingCastId=null;f.s.legendaryRuntime.byId[staff.id].state.pendingTargetId=null;assert(E.validSave(f.s));assert(E.validSave(JSON.parse(JSON.stringify(f.s))));
console.log('PASS combined cross-race real armor/staff/boots: +100 diminishing dodge, cast-only x2/x2.6, fixed unboosted reflection, independent ledgers, no RNG/cast recursion, JSON validity.');
