import assert from 'node:assert/strict';
import {fresh,startDeveloperGroup,setCombatTarget,queueDeveloperAction,step,reward,validSave,offline,stats,LOCS} from './dist/engine.js';
const clone=x=>JSON.parse(JSON.stringify(x));
function game(seed=9,count=3){let s=fresh();s.heroHp=stats(s).hp;s.restUntil=0;s.lastSeen=s.lastHealthClock=10000;s.nextActionAt=0;s.nextBattleAt=0;startDeveloperGroup(s,{count,seed},10000);assert(validSave(s));return s;}
{
 const s=game(),e=s.activeEncounter;assert(setCombatTarget(s,e.enemies[1].id));assert(!setCombatTarget(s,'missing'));assert.equal(e.targetId,e.enemies[1].id);
 assert(queueDeveloperAction(s,{scope:'single',kind:'damage',amount:1e6}));assert(!queueDeveloperAction(s,{scope:'all',kind:'damage',amount:1}));step(s,e,11100);assert.equal(e.enemies[1].hp,0);assert(!e.done);assert.notEqual(e.targetId,e.enemies[1].id);assert(validSave(s));assert.equal(e.activeCastCount,1);
 const resumed=clone(s);assert(validSave(resumed));assert.equal(resumed.activeEncounter.targetId,e.targetId);
 assert(queueDeveloperAction(s,{scope:'all',kind:'damage',amount:1e6}));step(s,e,12200);for(let i=0;i<10&&!e.done;i++){queueDeveloperAction(s,{scope:'all',kind:'damage',amount:1e6});step(s,e,s.nextActionAt);}assert(e.win);assert(e.enemies.every(u=>u.hp===0));const gold=s.gold,kills=s.kills;reward(s,e,12200);assert.equal(s.gold-gold,LOCS[0].reward*2);assert.equal(s.kills,kills+1);assert.equal(e.rewardRoundSources.length,2);const stable=JSON.stringify(s);reward(s,e,12200);assert.equal(JSON.stringify(s),stable);assert(validSave(s));
}
{
 const a=game(24,2),b=clone(a);while(a.running){const e=a.activeEncounter;step(a,e,a.nextActionAt);if(e.done&&e.win)reward(a,e,a.lastHealthClock);}
 offline(b,10000+3600000);for(const k of ['inventory','materialStacks','gold','xp','kills','heroHp'])assert.deepEqual(b[k],a[k],k+' offline parity');
}
{
 const s=game(),e=s.activeEncounter;s.skills=[null,null,null,null];e.heroBurn=2;e.heroBurnPower=10;e.shield=1000;e.barrier=5;e.barrierShield=1000;const hp=e.heroHp;step(s,e,11100);assert(e.heroHp<hp,'self burn bypasses shields');assert(e.shield>0);
}
{
 const s=game(),e=s.activeEncounter;e.enemies.forEach(u=>{u.hp=u.max=1e6;u.profile.counterRatio=.5;});e.shield=10000;assert(queueDeveloperAction(s,{scope:'all',kind:'damage',amount:10}));const logs=step(s,e,11100);assert.equal(logs.filter(x=>x.includes('反伤')).length,1);assert.equal(e.activeCastCount,1);assert(validSave(s));
}
{
 const s=fresh();s.heroHp=stats(s).hp;s.restUntil=0;s.lastSeen=s.lastHealthClock=10000;const e=startDeveloperGroup(s,{count:2,profiles:[{castDuration:2200,castCooldown:4400,castMultiplier:2},{}]},10000);s.skills=[null,null,null,null];e.enemies.forEach(u=>u.hp=u.max=1e6);step(s,e,11100);assert(e.enemies[0].control.preparing);queueDeveloperAction(s,{scope:'single',kind:'stun',amount:2200,control:{diminishingFactors:[1,.5],recoveryWindow:10000,minDuration:1,refreshMode:'max'}});step(s,e,12200);assert(e.enemies[0].control.stunUntil>12200);const finish=e.enemies[0].control.preparing.completesAt;step(s,e,13300);assert(e.enemies[0].control.preparing.completesAt>finish);assert(validSave(s));
}
console.log('Production multi enemy: target/save/all-clear/2-round settlement/RNG offline/burn/counter/control passed');
{
 const s=fresh();s.heroHp=stats(s).hp;s.restUntil=0;s.lastSeen=s.lastHealthClock=10000;const e=startDeveloperGroup(s,{count:2,seed:88,profiles:[{castDuration:1100,castCooldown:100000,castMultiplier:1,summonCount:2},{}]},10000);s.skills=[null,null,null,null];e.enemies.forEach(u=>u.hp=u.max=1e6);
 step(s,e,11100);step(s,e,12200);assert.equal(e.enemies.length,4);assert.equal(e.enemies.filter(u=>u.origin==='summoned').length,2);assert.equal(e.enemies[2].round,0,'new summons do not act immediately');assert(validSave(s));
 for(let i=0;i<20&&!e.done;i++){queueDeveloperAction(s,{scope:'all',kind:'damage',amount:1e9});step(s,e,s.nextActionAt);}assert(e.win);reward(s,e,s.lastHealthClock);assert.equal(e.rewardRoundSources.length,2);assert(e.rewardRoundSources.every(id=>e.enemies.find(u=>u.id===id).origin==='initial'));assert(validSave(s));
}
{
 const s=fresh();s.heroHp=stats(s).hp;s.restUntil=0;s.lastSeen=s.lastHealthClock=10000;const e=startDeveloperGroup(s,{count:2,seed:1,profiles:[{castDuration:5500,castCooldown:6600,castMultiplier:2},{}]},10000);s.skills=[null,null,null,null];e.enemies.forEach(u=>u.hp=u.max=1e6);step(s,e,11100);assert(e.enemies[0].control.preparing);
 s.skills=['interrupt',null,null,null];s.conditions=['always','always','always','always'];step(s,e,12200);assert.equal(e.enemies[0].control.preparing,null);assert.equal(e.enemies[0].control.cooldowns['fixture-cast'],18800);assert.equal(e.enemies[1].control.preparing,null);assert(validSave(s));
}
{
 const s=game();s.activeEncounter.heroHp=stats(s).hp-1;s.heroHp=s.activeEncounter.heroHp;s.skills=['mend',null,null,null];s.conditions=['always','always','always','always'];delete s.skillRulesVersion;delete s.skillAccess;
 const logs=step(s,s.activeEncounter,11100);assert(logs.some(x=>x.includes('回炉息')),'any HP gap useful under always');
}
console.log('Production multi extra: summons/initial-only loot/interrupt cooldown/any-gap healing passed');
for(const condition of ['low','charge','burn']){
 const s=game(),e=s.activeEncounter;delete s.skillRulesVersion;delete s.skillAccess;s.skills=['mend','break',null,null];s.conditions=[condition,'always','always','always'];e.heroHp=stats(s).hp-1;s.heroHp=e.heroHp;
 step(s,e,11100);assert.equal(e.lastCast.skillId,'break',condition+' explicit guard skips unusable first slot');
}
console.log('Explicit per-slot conditions remain additional guards');
// Retired single-enemy 14-skill equivalence: current tree consumer/host suites cover live formulas.

{
 const s=game(),original=JSON.stringify(s);assert(!queueDeveloperAction(s,{scope:'self',kind:'damage',amount:100}));assert(!queueDeveloperAction(s,{scope:'all',kind:'stun',amount:1,control:{}}));assert.equal(JSON.stringify(s),original);
 for(const change of [e=>e.rngState=-1,e=>e.targetId='unknown',e=>e.enemies[0].sourceInstanceId='fake-field',e=>e.enemies[0].control.preparing={skillId:'bad'}]){const bad=clone(s);change(bad.activeEncounter);assert(!validSave(bad));}
 assert.equal(s.monsterLedger?.seen?.length??0,0,'developer discovery excluded');
}
console.log('Multi snapshot validation and invalid action atomicity passed');
{
 const s=fresh();delete s.monsterLedger;assert(validSave(s),'legacy missing monster ledger remains valid');
 for(const ledger of [{version:1,encountered:{'fake-monster':true}},{version:2,encountered:{}},{version:1,encountered:{'grayflag-raider':false}},{version:1,encountered:[]},[]]){const bad=clone(s);bad.monsterLedger=ledger;assert(!validSave(bad),'invalid monster ledger rejected');}
}
console.log('Monster ledger malformed save gate: missing legacy valid, unknown/version/false/arrays rejected');
{
 const {setMultiPaused,combatTargets}=await import('./dist/engine.js');const s=fresh();s.heroHp=stats(s).hp;s.restUntil=0;s.lastSeen=s.lastHealthClock=10000;
 const e=startDeveloperGroup(s,{count:2,profiles:[{castDuration:5500,castCooldown:6600,castMultiplier:2},{}]},10000);s.skills=[null,null,null,null];e.enemies.forEach(u=>u.hp=u.max=1e6);step(s,e,11100);
 const c=e.enemies[0].control;c.stunUntil=14000;c.lastStunEnd=14000;c.interruptUntil=13000;c.cooldowns.other=18000;
 assert(setMultiPaused(s,true,11500));const paused=clone(s),before=clone(c),view=combatTargets(e,11500);assert(validSave(s));assert.deepEqual(combatTargets(e,41500),view,'paused progress view stays fixed');assert.deepEqual(step(s,e,41500),[]);
 offline(paused,41500);assert.equal(paused.activeEncounter.pauseAt,11500);assert(setMultiPaused(paused,false,41500));const resumed=paused.activeEncounter.enemies[0].control;
 assert.equal(resumed.preparing.completesAt,before.preparing.completesAt+30000);assert.equal(resumed.preparing.startedAt,before.preparing.startedAt+30000);for(const k of ['clock','stunUntil','interruptUntil','lastStunEnd'])assert.equal(resumed[k],before[k]+30000,k);assert.equal(resumed.cooldowns.other,48000);assert.equal(paused.nextActionAt,42200);assert(validSave(paused));assert(!setMultiPaused(paused,false,41500));
}
console.log('Paused multi cast/stun/cooldown/action remainder survive30s and JSON/offline without time skipping');
