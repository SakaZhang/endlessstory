import assert from 'node:assert/strict';
import {E,pack,ARMOR,T,setup,tick,stableAffixes,captureCombatDisplay,reflections,received,exactSegments} from './reflect-fixture.mjs';
import {applyEnemyDamageSegment,applyTreePoisonTick} from '../../../dist/multi-combat.js';
import {applyDwarfDot} from '../../../dist/dwarf-effects.js';
import {dispatchRacialLegendaryEvent} from '../../../dist/racial-legendary-runtime.js';
for(const shield of [0,40,100000]){
 const f=setup(),st=E.stats(f.s),u=f.e.enemies[0];u.atk=200;u.nextBasicAt=f.s.nextActionAt;f.e.shield=shield;
 const b=tick(f),hits=exactSegments(b);assert.equal(hits.length,1);assert(-(hits[0].hpDelta+hits[0].shieldDelta)<200,'reflection is after armor/block mitigation');if(shield===100000)assert.equal(hits[0].hpDelta,0);assert.equal(f.e.activeCastCount,0);assert(!b.events.some(x=>x.kind==='heal'&&x.skillId===ARMOR));
}
console.log('PASS actual equipped armor: normal hits, mitigation, partial/full shield and no extra cast.');
// No production enemy currently defines multiple damage effects per skill.
// Exercise the exact production segment adapter with an actual equipped item
// and one shared cast identity; no definition mutation or test-only engine path.
{
 const f=setup(),u=f.e.enemies[0],st=E.stats(f.s),b=captureCombatDisplay(f.e,()=>{
  for(const amount of [40,25,13])applyEnemyDamageSegment(f.s,f.e,amount,{sourceId:u.id,castId:'multi-segment',skillId:'fixture-multihit',element:'physical'},{st});
 });assert.equal(exactSegments(b).length,3);assert.equal(new Set(received(b).map(x=>x.castId)).size,1);assert.equal(f.e.activeCastCount,0);assert(E.validSave(f.s));
}
console.log('PASS 3 shared-cast segments in production adapter each return exactly 50%, no new cast.');
{
 let f,u;for(let i=0;i<100;i++){f=setup();u=f.e.enemies.find(x=>pack.monsters[x.definitionId].skills.some(s=>s.effects.some(f=>f.type==='dot')));if(u)break;}assert(u);const skill=pack.monsters[u.definitionId].skills.find(s=>s.effects.some(f=>f.type==='dot'));u.atk=100;u.control.cooldowns[skill.id]=0;tick(f);assert.equal(f.e.typedDots[0].sourceId,u.id);u.nextBasicAt=T+1e8;u.control.cooldowns[skill.id]=T+1e8;
 const other=structuredClone(u);other.id+='-other';other.control.unitId=other.id;other.origin='summoned';other.main=false;f.e.enemies.push(other);f.e.targetId=other.id;const b=tick(f);const hits=exactSegments(b);assert(hits.some(x=>x.kind==='dot'));assert(hits.every(x=>x.sourceId===u.id));
 // A same-skill DOT from another actor retains its own source instead of merging.
 const fx=skill.effects.find(x=>x.type==='dot');applyDwarfDot(f.e,other,skill,fx,f.s.lastHealthClock);assert.equal(new Set(f.e.typedDots.map(d=>d.sourceId)).size,2);assert(E.validSave(f.s));
 const noSource=structuredClone(f);noSource.e=noSource.s.activeEncounter;noSource.e.typedDots[0].sourceId=undefined;noSource.e.typedDots=noSource.e.typedDots.slice(0,1);const no=tick(noSource);assert(received(no).length);assert.equal(reflections(no).length,0);
}
console.log('PASS actual skill applies source-aware DOT; target changes do not redirect, same-skill actors separate, source-less DOT never invents target.');
for(const nirvana of [false,true]){
 const f=setup(),u=f.e.enemies[0];if(nirvana){const ring=E.item('ring',100,null,3,{originRace:'human'});stableAffixes(ring);ring.special={id:'nirvana'};f.s.inventory.push(ring);assert(E.equipItem(f.s,ring.id,'ring1'));}
 f.e.heroHp=f.s.heroHp=7;f.e.shield=11;u.atk=1e7;u.nextBasicAt=f.s.nextActionAt;
 const b=tick(f),hits=exactSegments(b);assert.equal(hits.length,1);assert.equal(-(reflections(b)[0].hpDelta+reflections(b)[0].shieldDelta),9,'overkill capped to 7 HP + 11 shield');
 if(nirvana){assert(f.e.heroHp>0);assert(f.e.affixState.nirvanaUsed);const reflectionIndex=b.events.indexOf(reflections(b)[0]),reviveIndex=b.events.findIndex(x=>x.skillId==='nirvana'&&x.hpDelta>0);assert(reviveIndex>reflectionIndex);u.nextBasicAt=f.s.nextActionAt;tick(f);assert(f.e.done&&!f.e.win);assert.equal(f.e.heroHp,0);}else{assert(f.e.done&&!f.e.win);assert.equal(f.e.heroHp,0);assert(!b.events.some(x=>x.kind==='heal'));}
}
console.log('PASS lethal hit returns actual bounded loss before death/Nirvana; no resurrection or second Nirvana.');
{
 const f=setup('human.a09.boss'),u=f.e.enemies[0];u.atk=60;u.nextBasicAt=f.s.nextActionAt;assert.equal(exactSegments(tick(f)).length,1);
 const before=JSON.stringify(f.s.legendaryRuntime);assert.deepEqual(dispatchRacialLegendaryEvent(f.s,{type:'enemyDamageSegment',sourceKind:'reflection',attackerId:u.id,actualHpLost:100,actualShieldAbsorbed:0},{maxHp:E.stats(f.s).hp,stats:E.stats(f.s)}),[]);assert.equal(JSON.stringify(f.s.legendaryRuntime),before);
}
console.log('PASS boss target valid; explicit reflected-origin event cannot recurse.');

{
 const f=setup(),u=f.e.enemies[0];u.profile.counterRatio=.5;const before=f.e.heroHp,b=tick(f);assert(b.events.some(x=>x.kind==='counter'&&x.sourceId===u.id&&x.hpDelta<0));assert(f.e.heroHp<before);assert.equal(reflections(b).length,0,'enemy reflected damage is not reflected again');assert.equal(f.e.activeCastCount,0);
 const guard=setup();guard.e.guard=3;guard.e.enemies[0].atk=60;guard.e.enemies[0].nextBasicAt=guard.s.nextActionAt;const c=tick(guard);assert.equal(reflections(c).length,1);assert(c.events.some(x=>x.kind==='counter'&&x.skillId==='guard'),'ordinary guard counter is retained separately');
}
{
 const f=setup(),u=f.e.enemies[0];u.shield=100000;u.shieldUntil=T+100000;
 const hp=u.hp,casts=f.e.activeCastCount,rng=f.e.rngState,t={tickId:'armor-poison-proof',enemyId:u.id,at:3000,layers:1,damage:u.max*.02,damageKind:'percent-max-hp',element:null,canCrit:false,reaperEligible:false,activeCastCount:0};
 const b=captureCombatDisplay(f.e,()=>applyTreePoisonTick(f.e,t,{now:T+3000}));assert.equal(b.result.shieldLost,100000);assert.equal(b.result.hpLost,t.damage-100000);assert.equal(f.e.activeCastCount,casts);assert.equal(f.e.rngState,rng);assert.equal(reflections(b).length,0);assert(E.validSave(f.s));
 const full=setup(),v=full.e.enemies[0];v.shield=300000;v.shieldUntil=T+100000;const r=applyTreePoisonTick(full.e,{...t,enemyId:v.id},{now:T+3000});assert.equal(r.hpLost,0);assert.equal(r.shieldLost,t.damage);
}
{
 const f=setup(),u=f.e.enemies[0];f.e.shield=80;f.e.heroHp=f.s.heroHp=7;f.e.heroBurn=1;f.e.heroBurnPower=10000;f.e.heroBurnSourceId=u.id;const b=tick(f);assert.equal(f.e.shield,80,'burn keeps prior HP-only settlement');assert.equal(reflections(b)[0].hpDelta,-3.5,'burn overkill counts actual HP only');assert.equal(f.e.heroHp,0);assert(f.e.done&&!f.e.win);
}
console.log('PASS real enemy counter cannot recurse; ordinary guard unchanged; armor does not alter poison shield-first or burn HP-only contract.');

{
 const f=setup(),u=f.e.enemies[0],st=E.stats(f.s);u.shield=100;u.shieldUntil=T+100000;u.armor=1000000;const rng=f.e.rngState,casts=f.e.activeCastCount;
 const b=captureCombatDisplay(f.e,()=>applyEnemyDamageSegment(f.s,f.e,80,{sourceId:u.id,element:'physical'},{st}));assert.equal(reflections(b)[0].shieldDelta,-40,'returned fixed amount hits shield, no second armor mitigation');assert.equal(reflections(b)[0].hpDelta,0);assert.equal(f.e.rngState,rng);assert.equal(f.e.activeCastCount,casts);
 f.e.heroHp=0;f.e.shield=20;const dead=captureCombatDisplay(f.e,()=>applyEnemyDamageSegment(f.s,f.e,80,{sourceId:u.id},{st}));assert.equal(dead.events.length,0);assert.equal(f.e.shield,20);assert.equal(f.e.heroHp,0);
}
console.log('PASS reflection consumes recipient shield at fixed 50%, no second mitigation/RNG; corpse cannot receive new return procs.');
