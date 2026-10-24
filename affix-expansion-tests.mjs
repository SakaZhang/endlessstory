import assert from 'node:assert/strict';
import {ORDINARY_AFFIX_CANDIDATES,SPECIAL_AFFIX_EXPANSION,LIFESTEAL_CANDIDATE_CONFIG,effectiveLuck,calculateLifesteal,openingShelterShield,createBattleAffixState,tryNirvana,tryReaperHit,tryMulticast} from './dist/affix-expansion.js';
assert.equal(ORDINARY_AFFIX_CANDIDATES.lifesteal.enabled,true);assert.equal(SPECIAL_AFFIX_EXPANSION.multicast.enabled,true);
assert.equal(effectiveLuck({talent:10,equipment:4,potion:{value:3,endAt:100},now:99}),17);assert.equal(effectiveLuck({talent:10,equipment:4,potion:{value:3,endAt:100},now:100}),14);assert.equal(effectiveLuck({equipment:NaN}),null);
const hit={hitId:'cast1:a:0',hpBefore:100,hpAfter:50,source:'active'},cfg={...LIFESTEAL_CANDIDATE_CONFIG,enabled:true};
assert.equal(calculateLifesteal({rating:100,maxHp:100,currentHp:1,hits:[hit]},{...LIFESTEAL_CANDIDATE_CONFIG,enabled:false}).heal,0);
assert.equal(calculateLifesteal({rating:100,maxHp:100,currentHp:1,hits:[hit]},cfg).heal,5);
assert.equal(calculateLifesteal({rating:100,maxHp:100,currentHp:1,hits:[hit,{...hit,hitId:'cast1:b:0',hpBefore:1000,hpAfter:0}]},cfg).heal,99);
assert.equal(calculateLifesteal({rating:100,maxHp:100,currentHp:99,hits:[hit]},cfg).heal,1);
assert.equal(calculateLifesteal({rating:100,maxHp:100,currentHp:1,hits:[{...hit,hpAfter:100}]},cfg).heal,0);
assert.equal(calculateLifesteal({rating:100,maxHp:100,currentHp:1,hits:[hit,hit]},cfg),null);
assert.equal(openingShelterShield({hasShelter:true,maxHp:100}),15);assert.equal(openingShelterShield({hasShelter:true,maxHp:100,alreadyApplied:true}),0);
let s=createBattleAffixState('battle1');const hero={hp:0,cd:{break:4},shield:8,legendCounter:3};const revival=tryNirvana(s,{battleId:'battle1',hasNirvana:true,hp:hero.hp,maxHp:100});assert(revival.revived);assert.equal(revival.hp,100);assert.deepEqual(hero,{hp:0,cd:{break:4},shield:8,legendCounter:3});assert(!tryNirvana(revival.state,{battleId:'battle1',hasNirvana:true,hp:0,maxHp:100}).revived);assert.equal(tryNirvana(s,{battleId:'other',hasNirvana:true,hp:0,maxHp:100}),null);
let calls=0;const rng=()=>{calls++;return .01;};
for(const [targetId,hitIndex] of [['boss',0],['minion',0],['boss',1]]){const r=tryReaperHit(s,{battleId:'battle1',castId:'cast1',hitIndex,targetId,hit:true,targetHp:100,hasReaper:true},rng);assert(r.triggered);s=r.state;}
assert.equal(calls,3);const duplicate=tryReaperHit(s,{battleId:'battle1',castId:'cast1',hitIndex:0,targetId:'boss',hit:true,targetHp:100,hasReaper:true},rng);assert(!duplicate.triggered);assert.equal(calls,3);
const dead=tryReaperHit(s,{battleId:'battle1',castId:'cast1',hitIndex:2,targetId:'boss',hit:true,targetHp:0,hasReaper:true},rng);assert(!dead.triggered);assert.equal(calls,3);
assert.equal(tryMulticast({},{enabled:false},()=>{throw Error('disabled must not roll');}).reason,'policy-disabled');assert.equal(tryMulticast({source:'active',triggered:false,hasLivingEnemies:true},{enabled:true,eligibleSources:['active'],allowTriggeredCasts:false,countAsActiveCast:true},()=>.1).triggered,true);
console.log('Affix expansion pure schema: approved rating definitions, additive timed luck, actual-HP bounded lifesteal, shelter15%, once-battle full revival, per-hit/target boss reaper2% and approved nonrecursive multicast passed');

assert.equal(calculateLifesteal({rating:100,maxHp:100,currentHp:0,hits:[hit]},cfg).heal,0,'dead hero cannot lifesteal revive');
assert.equal(effectiveLuck({talent:1,equipment:2,potion:{value:3,endAt:1800000000100},now:1800000000000}),6,'real wall clock supported');
{
 let state=createBattleAffixState('long');for(let i=0;i<13100;i++){const r=tryReaperHit(state,{battleId:'long',castId:'c'+i,hitIndex:0,targetId:'boss',hit:true,targetHp:100,hasReaper:true},()=>.5);state=r.state;assert.equal(state.reaperHits.length,1);}assert.equal(state.lastReaperCastId,'c13099');
}
console.log('Reaper state bounded to current cast across13,100 rounds; clock-safe effective luck passed');
assert(!tryMulticast({source:'active',triggered:true,hasLivingEnemies:true},undefined,()=>{throw Error('recursive roll');}).triggered);
assert(!tryMulticast({source:'active',triggered:false,hasLivingEnemies:false},undefined,()=>{throw Error('dead enemies roll');}).triggered);
assert.equal(tryMulticast({source:'active',triggered:false,hasLivingEnemies:true},undefined,()=>.149).countAsActiveCast,true);
assert(!tryMulticast({source:'active',triggered:false,hasLivingEnemies:true},undefined,()=>.15).triggered);
{
 const {applyNirvana,lifestealHeal,lifestealRate,rollReaper}=await import('./dist/affix-expansion.js');const e={affixState:createBattleAffixState('stage1'),heroHp:-7,cd:{break:5},shield:23,activeCastCount:8};const before=structuredClone(e);assert(applyNirvana(e,200,{nirvana:true},[]));assert.equal(e.heroHp,200);assert.deepEqual(e.cd,before.cd);assert.equal(e.shield,23);assert.equal(e.activeCastCount,8);e.heroHp=0;assert(!applyNirvana(e,200,{nirvana:true},[]));assert.equal(e.heroHp,0);
 assert.equal(lifestealRate(100),.1);assert.equal(lifestealHeal({rating:100,damage:1000,maxHp:100,currentHp:20,alreadyHealed:6}),80);assert.equal(lifestealHeal({rating:100,damage:1000,maxHp:100,currentHp:0}),0);
 assert(rollReaper({hit:true,targetAlive:true,equipped:true},()=>.019));assert(!rollReaper({hit:true,targetAlive:true,equipped:true},()=>.02));assert(!rollReaper({hit:true,targetAlive:true,equipped:true},()=>-1));assert(!rollReaper({hit:true,targetAlive:false,equipped:true},()=>{throw Error('no roll on dead');}));
}
