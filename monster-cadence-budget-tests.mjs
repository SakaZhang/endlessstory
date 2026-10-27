import assert from 'node:assert/strict';
import {WORLD_MONSTERS,monsterParameters} from './dist/world-content.js';
import {monsterCoefficientRate} from './dist/monster-balance.js';
import {makeMultiUnit} from './dist/multi-combat.js';
import {initializeDwarfActor,nextDwarfAction,tickDwarfDots,applyDwarfDot} from './dist/dwarf-effects.js';
import {advanceControlClock} from './dist/multi-control.js';
let tested=0;
for(const d of Object.values(WORLD_MONSTERS)){
 const p=monsterParameters(d.id);if(!p)continue;
 const shares=d.trait?.type==='followers'?d.trait.shares:[1];
 const units=shares.map((share,i)=>initializeDwarfActor(makeMultiUnit('cadence-'+i,d.area-1,d.nodes[0],{enemy:d.name,hp:100,atk:1,armor:0},0,{}),d,{...p,hp:100,atk:1,elementalPower:1},0,{share,follower:i>0}));
 const e={heroHp:1e9};let total=0;
 for(let now=1100;now<=66000;now+=1100){tickDwarfDots(e,now,dot=>{total+=dot.raw;});for(const u of units){u.control=advanceControlClock(u.control,now);if(now>=33000)u.hp=u.max*.49;const action=nextDwarfAction(u,now);if(!action)continue;for(const effect of action.effects){if(effect.type==='damage')total+=effect.coefficient*u[effect.powerBasis];else if(effect.type==='dot')applyDwarfDot(e,u,action,effect,now);}}}
 // Random reflection is a separately documented threat allowance, not a scheduler action.
 const reflection=d.trait?.type==='reflect'?d.trait.chance*d.trait.coefficient/(d.trait.cooldownMs/1000):0;
 const actual=total/66,estimate=monsterCoefficientRate(d,p)-reflection;
 assert(Math.abs(actual-estimate)<1e-9,`${d.id}: actual ${actual}, budget ${estimate}`);tested++;
}
assert(tested>=200);console.log(`PASS ${tested} authored actors: exact 66s production scheduler coefficients, raw interval catch-up, cast-completion cooldown, DOT and follower shares.`);
