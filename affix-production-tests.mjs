import {prepareM2TestRoute} from './m2-test-budget-fixture.mjs';
import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
const clone=x=>structuredClone(x);
function randomWith(values,fn,fallback=0){const old=Math.random;let n=0;Math.random=()=>values[n++]??fallback;try{return{result:fn(),calls:n};}finally{Math.random=old;}}
function state(){const s=E.fresh();delete s.siteId;delete s.expedition;delete s.contentMigration;delete s.skillRulesVersion;delete s.skillAccess;s.heroHp=E.stats(s).hp;s.restUntil=0;s.lastSeen=s.lastHealthClock=10000;s.gold=100000;s.skills=[null,null,null,null];s.conditions=['always','always','always','always'];return s;}
function gear(s,special,slot='ring',socket){const it=E.item(slot,1,null,3);it.special=special?{id:special}:null;it.affixes=[{stat:'atk',value:3},{stat:'armor',value:2},{stat:'hp',value:15},{stat:'hit',value:5}];s.inventory.push(it);assert(E.equipItem(s,it.id,socket));return it;}
assert.equal(E.ACTIVE_AFFIX_KEYS.length,20);assert.equal(E.ACTIVE_SPECIAL_KEYS.length,7);assert.equal(E.SPECIALS.shelter.name,'护佑');
// Force every acquisition branch, not merely registry presence.
for(let index=0;index<E.ACTIVE_SPECIAL_KEYS.length;index++){
 const expected=E.ACTIVE_SPECIAL_KEYS[index],values=Array(10).fill(0);values.push((index+.1)/7);const {result:it}=randomWith(values,()=>E.item('weapon',1,null,3));assert.equal(it.special.id,expected,'item generation '+expected);
 const s=state(),target=E.item('gloves',1,null,3);target.special=null;s.inventory.push(target);s.consumables.reforgeToken=1;const rolls=Array(12).fill(.4);rolls.push((index+.1)/7); /* Four type/value/favor gates; .4 does not request a second value roll. */const {result:p}=randomWith(rolls,()=>E.reforge(s,target.id,'all'));assert(p);assert.equal(s.pendingReforge.newSpecial.id,expected,'full reforge '+expected);assert(E.resolveReforge(s,true));assert.equal(target.special.id,expected);
}
for(const [stat,value] of [['luck',3],['lifesteal',8]]){
 const s=state(),target=E.item('gloves',1,null,1),donor=E.item('ring',1,null,0);target.affixes=[{stat:'atk',value:3},{stat:'hp',value:15}];donor.affixes=[{stat,value}];E.applyForgeFavor(donor);s.inventory.push(target,donor);assert(E.reforge(s,target.id,'replace',0,donor.id));assert.equal(s.pendingReforge.newAffixes[0].value,value);assert.equal(s.pendingReforge.newAffixes[0].stat,stat);assert(E.resolveReforge(s,true));assert.equal(target.affixes[0].value,value);
}
{
 const s=state();const e=E.encounter(s);e.hp=e.max=1e6;e.atk=0;const {calls}=randomWith([],()=>E.step(s,e,11100),.5);assert.equal(calls,2,'no-special basic retains only hit+crit RNG');
}
{
 const s=state();gear(s,'multicast','ring','ring1');gear(s,'multicast','ring','ring2');assert.equal(E.stats(s).specials.multicast,true);s.skills=['break',null,null,null];const e=E.encounter(s);e.hp=e.max=1e6;e.atk=0;const {calls,result:logs}=randomWith([],()=>E.step(s,e,11100));assert.equal(e.activeCastCount,2);assert.equal(e.cd.break,E.SKILLS.break.cd);assert.equal(calls,5,'duplicate same special not stacked and extra cast cannot recurse');assert.equal(logs.filter(x=>x.includes('多重施法')).length,1);
 const t=state();gear(t,'multicast');t.skills=['break',null,null,null];const b=E.encounter(t);b.hp=1;const kill=randomWith([],()=>E.step(t,b,11100));assert(b.win);assert.equal(b.activeCastCount,1);assert.equal(kill.calls,2,'no living enemy means no multicast roll');
}
{
 const s=state();gear(s,'shelter');s.talents.shield=2;const max=E.stats(s).hp,e=E.encounter(s);assert.equal(e.shield,Math.floor(max*.15)+8);e.shield=2;const saved=clone(s);E.encounter(saved);assert.equal(saved.activeEncounter.shield,2,'refresh does not refill opening shield');
}
{
 const s=state();gear(s,'nirvana');const e=E.encounter(s);e.hp=e.max=1e6;e.heroHp=s.heroHp=1;e.atk=1e9;e.shield=7;e.cd.heavy=8;e.activeCastCount=7;randomWith([],()=>E.step(s,e,11100),.5);assert(!e.done);assert.equal(e.heroHp,E.stats(s).hp);assert(e.affixState.nirvanaUsed);assert.equal(e.cd.heavy,7);assert.equal(e.activeCastCount,7);assert.equal(e.shield,0);const restored=clone(s);randomWith([],()=>E.step(restored,restored.activeEncounter,12200),.5);assert.equal(restored.heroHp,0);assert(restored.restUntil>12200,'second lethal hit does not revive');
}
{
 const s=state();const it=gear(s,'reaper');it.affixes=[{stat:'lifesteal',value:8},{stat:'hp',value:15},{stat:'armor',value:2},{stat:'hit',value:5}];const e=E.encounter(s,true);e.hp=e.max=1e6;e.heroHp=s.heroHp=20;e.atk=0;const before=e.heroHp,logs=randomWith([0,.99,0],()=>E.step(s,e,11100)).result;assert(e.win,'reaper executes boss');assert(logs.some(x=>x.includes('死神')));assert(e.heroHp>before);assert(e.heroHp-before<E.stats(s).hp*.08,'execute HP loss not counted as huge lifesteal');
}
{
 const s=state();gear(s,'shelter');gear(s,'nirvana','amulet');const id=Object.values(E.INSTANCES).find(x=>x.kind==='dungeon'&&x.enabled).id;const battleIds=[];
 for(let stage=1;stage<=3;stage++){const e=E.startInstanceEncounter(s,id,s.lastHealthClock+2000);assert(e);assert.equal(e.dungeonStage,stage);assert.equal(e.shield,Math.floor(E.stats(s).hp*.15));assert.equal(e.affixState.nirvanaUsed,false);battleIds.push(e.affixState.battleId);e.affixState.nirvanaUsed=true;e.shield=0;e.hp=0;e.done=true;e.win=true;E.reward(s,e,s.lastHealthClock);}
 assert.equal(new Set(battleIds).size,3,'each stage gets own one-use effect state');
}
console.log('Actual single engine affixes:20/7 pools, forced7 acquisition+fullreforge, raw donor values, no extra baseline RNG, duplicate-safe multicast/CD, shelter/revival/persistence/stages, boss execute and bounded lifesteal passed');
{
 const template=state();gear(template,'multicast','ring','ring1');gear(template,'reaper','ring','ring2');gear(template,'nirvana','amulet');const armor=gear(template,'shelter','armor');armor.affixes=[{stat:'lifesteal',value:8},{stat:'luck',value:3},{stat:'hp',value:15},{stat:'armor',value:2}];template.skills=['break','mark','guard','interrupt'];template.conditions=['always','always','always','charge'];template.running=true;template.offlineLuck=E.effectiveLuck(template);template.heroHp=E.stats(template).hp;prepareM2TestRoute(template,10000);const online=clone(template),batch=clone(template),end=190000;
 const rng=()=>{let seed=551;return()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/2**32;};};let old=Math.random;
 try{Math.random=rng();E.offline(batch,end);Math.random=rng();let time=10000;
 while(time<end&&online.running){if(online.restUntil>0){if(online.restUntil>end)break;time=online.restUntil;E.settleRest(online,time);continue;}time=Math.max(time,online.nextBattleAt??0);if(time>=end)break;const e=online.activeEncounter??E.encounter(online,false,time);if(!e)break;time=online.nextActionAt;if(time>end)break;E.step(online,e,time);if(e.done&&e.win)E.reward(online,e,time);}
 E.settleRest(online,end);
 }finally{Math.random=old;}
 for(const key of ['gold','xp','level','heroHp','kills','materialStacks'])assert.deepEqual(batch[key],online[key],'actual affix online/offline '+key);for(const key of ['hp','heroHp','round','cd','shield','activeCastCount'])assert.deepEqual(batch.activeEncounter?.[key],online.activeEncounter?.[key],key+' active encounter parity');assert.equal(batch.activeEncounter?.affixState.nirvanaUsed,online.activeEncounter?.affixState.nirvanaUsed);assert(E.validSave(batch));assert(E.validSave(online));
}
console.log('Actual M2 engine3min seeded online/offline parity with all4 combat specials +lifesteal/luck passed');
{
 const s=state(),it=gear(s,'multicast');it.affixes=[{stat:'luck',value:3},{stat:'lifesteal',value:8},{stat:'hp',value:15},{stat:'armor',value:2}];E.applyForgeFavor(it);s.talents.luck=5;assert.equal(E.effectiveLuck(s),8.3);assert.equal(E.stats(s).lifestealRating,8.8);s.skills=['warcry',null,null,null];const e=E.encounter(s);e.hp=e.max=1e6;e.atk=0;const logs=randomWith([],()=>E.step(s,e,11100)).result;assert.equal(e.activeCastCount,2,'utility extra cast counts too');assert.equal(e.cd.warcry,E.SKILLS.warcry.cd);assert.equal(logs.filter(x=>x.includes('砧誓战吼')).length,2);assert.equal(e.warcry,2,'duration ticks once not per multicast');
}
console.log('Actual effective equipment+talent luck/divine once and utility multicast count/duration passed');
{
 for(const value of [NaN,Infinity,-1,1001]){const s=state();s.offlineLuck=value;assert(!E.validSave(s),'reject offlineLuck '+value);}for(const value of [0,36.4,1000]){const s=state();s.offlineLuck=value;assert(E.validSave(s),'accept offlineLuck '+value);}
}
{
 const template=state();template.location=2;template.bonusTalentPoints=10;template.talents.luck=10;
 const specials=['knowledge','scavenger','shelter','momentum','nirvana','multicast','reaper',null];
 E.SOCKETS.forEach((socket,i)=>{const it=gear(template,specials[i],E.SOCKET_TYPE[socket],socket);it.affixes=[{stat:'lifesteal',value:8},{stat:'luck',value:3},{stat:'hp',value:15},{stat:'hit',value:5}];E.applyForgeFavor(it);});
 template.skills=['break','mark','guard','interrupt'];template.conditions=['always','always','always','charge'];template.running=true;template.offlineLuck=E.effectiveLuck(template);template.heroHp=1;assert(Math.abs(template.offlineLuck-36.4)<1e-9);assert(Math.abs(E.stats(template).lifestealRating-70.4)<1e-9);assert(E.validSave(template));
 prepareM2TestRoute(template,10000);E.normalizePotions(template);const online=clone(template),batch=JSON.parse(JSON.stringify(template)),end=10000+4*3600000;const rng=()=>{let seed=77011;return()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/2**32;};};const old=Math.random;let report,rounds=0,revives=0,time=10000;
 try{Math.random=rng();report=E.offline(batch,end);Math.random=rng();
 while(time<end&&online.running){if(online.restUntil>0){if(online.restUntil>end)break;time=online.restUntil;E.settleRest(online,time);continue;}time=Math.max(time,online.nextBattleAt??0);if(time>=end)break;const e=online.activeEncounter??E.encounter(online,false,time);if(!e)break;time=online.nextActionAt;if(time>end)break;const logs=E.step(online,e,time);rounds++;revives+=logs.filter(x=>x.startsWith('涅槃')).length;if(e.done&&e.win)E.reward(online,e,time);}
 E.settleRest(online,end);
 }finally{Math.random=old;}
 for(const key of ['gold','xp','level','heroHp','kills','materialStacks'])assert.deepEqual(batch[key],online[key],'4h actual affix parity '+key);assert.equal(report.rounds,rounds);assert.deepEqual(batch.potionStacks,online.potionStacks);for(const key of ['hp','heroHp','round','cd','shield','activeCastCount'])assert.deepEqual(batch.activeEncounter?.[key],online.activeEncounter?.[key],'4h '+key);assert(E.validSave(batch));assert(E.validSave(online));
 console.log('AFFIX_4H_ACTUAL_EVIDENCE '+JSON.stringify({durationMs:4*3600000,rounds,revives,kills:online.kills,heroHp:online.heroHp,level:online.level,gold:online.gold,offlineRestCount:report.rests,effectiveLuck:template.offlineLuck,lifestealRating:E.stats(template).lifestealRating,onlineOfflineEqual:true,validSaveBoth:true}));
}
