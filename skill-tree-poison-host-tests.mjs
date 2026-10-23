import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
import {applyTreePoisonTick} from './dist/multi-combat.js';
import {createSkillPoison,applySkillPoison,advanceSkillPoison} from './dist/skill-tree-poison.js';
// Time values remain a candidate fixture. Shield semantics and 2% per layer are approved.
const timing={tickIntervalMs:3000,layerDurationMs:9000,maxLayers:5,refreshPolicy:'earliest-expiry',schedule:'per-layer',expiryTick:'inclusive'};
function game(){const s=E.fresh();s.heroHp=E.stats(s).hp;s.restUntil=0;s.lastSeen=s.lastHealthClock=10000;s.nextBattleAt=0;const e=E.startDeveloperGroup(s,{count:2,seed:47},10000);for(const u of e.enemies)u.hp=u.max=1000;return {s,e};}
{
 const {s,e}=game(),u=e.enemies[0];u.shield=75;let p=createSkillPoison(u.id,timing,0);for(let i=0;i<5;i++)p=applySkillPoison(p,{enemyId:u.id,sourceId:'scatter_ash',combatClock:0});
 const due=advanceSkillPoison(p,{enemyId:u.id,combatClock:3000,targetMaxHp:u.max}),rng=e.rngState,casts=e.activeCastCount,hp=e.heroHp;
 const r=applyTreePoisonTick(e,due.ticks[0],{now:13000});assert.equal(r.damage,100);assert.equal(r.shieldLost,75);assert.equal(r.hpLost,25);assert.equal(e.rngState,rng);assert.equal(e.activeCastCount,casts);assert.equal(e.heroHp,hp);assert.equal(applyTreePoisonTick(e,due.ticks[0],{now:13000}),null);assert(E.validSave(s));const reload=JSON.parse(JSON.stringify(s));assert.equal(applyTreePoisonTick(reload.activeEncounter,due.ticks[0],{now:13000}),null);
 const one=advanceSkillPoison(due.state,{enemyId:u.id,combatClock:9000,targetMaxHp:u.max});for(const tick of one.ticks)applyTreePoisonTick(e,tick,{now:10000+tick.at});
 let pp=due.state;for(const time of [6000,9000]){const next=advanceSkillPoison(pp,{enemyId:u.id,combatClock:time,targetMaxHp:u.max});for(const tick of next.ticks)applyTreePoisonTick(reload.activeEncounter,tick,{now:10000+tick.at});pp=next.state;}
 assert.deepEqual(reload.activeEncounter,e,'due catchup equals separately scheduled ticks after JSON');
}
{
 const {s,e}=game();e.enemies[1].hp=0;const u=e.enemies[0];u.hp=10;u.shield=5;const tick={tickId:'kill',at:3000,enemyId:u.id,layers:1,damage:20,damageKind:'percent-max-hp',element:null,canCrit:false,reaperEligible:false,activeCastCount:0};
 assert(applyTreePoisonTick(e,tick,{now:13000}).killed);assert(e.win);assert.equal(e.killSource,'poison');assert(E.validSave(s));assert.equal(applyTreePoisonTick(e,tick,{now:13000}),null);
}
console.log('PASS poison real host: actual shield before HP, maxHP percent, no element/RNG/procs/casts/heal, duplicate receipt/JSON, scheduled catchup parity, lethal once and legal save');
{
 const {s,e}=game(),u=e.enemies[0];u.shield=25;const tick={tickId:'global-damage',at:3000,enemyId:u.id,layers:1,damage:20,damageKind:'percent-max-hp',element:null,canCrit:false,reaperEligible:false,activeCastCount:0};
 const r=applyTreePoisonTick(e,tick,{now:13000,globalDamageMultiplier:1.5});assert.equal(r.damage,20);assert.equal(r.shieldLost,20);assert.equal(r.hpLost,0);assert(E.validSave(s));
}
console.log('PASS poison excludes global/axe all-damage and elemental modifiers');
