import {currentAffix} from './current-equipment-test-fixture.mjs';
import {prepareM2TestRoute} from './m2-test-budget-fixture.mjs';
import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
const clone=x=>structuredClone(x);
function randomWith(values,fn,fallback=0){const old=Math.random;let n=0;Math.random=()=>values[n++]??fallback;try{return{result:fn(),calls:n};}finally{Math.random=old;}}
function state(){const s=E.fresh();s.heroHp=E.stats(s).hp;s.restUntil=0;s.lastSeen=s.lastHealthClock=10000;s.gold=100000;s.skills=[null,null,null,null];s.conditions=['always','always','always','always'];return s;}
function gear(s,special,slot='ring',socket){const it=E.item(slot,1,null,3);it.special=special?{id:special}:null;it.affixes=[currentAffix('atk',3),currentAffix('armor',2),currentAffix('hp',15),currentAffix('hit',5)];s.inventory.push(it);assert(E.equipItem(s,it.id,socket));return it;}
assert.equal(E.ACTIVE_AFFIX_KEYS.length,20);assert.equal(E.ACTIVE_SPECIAL_KEYS.length,9);assert.equal(E.SPECIALS.shelter.name,'护佑');
// Force every acquisition branch, not merely registry presence.
for(let index=0;index<E.ACTIVE_SPECIAL_KEYS.length;index++){
 const expected=E.ACTIVE_SPECIAL_KEYS[index],values=Array(10).fill(0);values.push((index+.1)/E.ACTIVE_SPECIAL_KEYS.length);const {result:it}=randomWith(values,()=>E.item('weapon',1,null,3));assert.equal(it.special.id,expected,'item generation '+expected);
 const s=state(),target=E.item('gloves',1,null,3);target.special=null;s.inventory.push(target);s.consumables.reforgeToken=1;const rolls=Array(12).fill(.4);rolls.push((index+.1)/E.ACTIVE_SPECIAL_KEYS.length); /* Four type/value/favor gates; .4 does not request a second value roll. */const {result:p}=randomWith(rolls,()=>E.reforge(s,target.id,'all'));assert(p);assert.equal(s.pendingReforge.newSpecial.id,expected,'full reforge '+expected);assert(E.resolveReforge(s,true));assert.equal(target.special.id,expected);
}
for(const [stat,value] of [['luck',3],['lifesteal',8]]){
 const s=state(),target=E.item('gloves',1,null,1),donor=E.item('gloves',1,null,0);target.affixes=[currentAffix('atk',3),currentAffix('hp',15)];donor.affixes=[currentAffix(stat,value)];E.applyForgeFavor(donor);s.inventory.push(target,donor);assert(E.reforge(s,target.id,'replace',0,donor.id));assert.equal(s.pendingReforge.newAffixes[0].value,value);assert.equal(s.pendingReforge.newAffixes[0].stat,stat);assert(E.resolveReforge(s,true));assert.equal(target.affixes[0].value,value);
}
// Retired single-target exact-roll cases replaced by current multi-affix/host suites.
{
 const template=state();gear(template,'multicast','ring','ring1');gear(template,'reaper','ring','ring2');gear(template,'nirvana','amulet');const armor=gear(template,'shelter','armor');armor.affixes=[currentAffix('lifesteal',8),currentAffix('luck',3),currentAffix('hp',15),currentAffix('armor',2)];template.level=100;template.skillTree.presets[0].unlocked=E.SKILL_TREE_DEFINITION.nodes.map(n=>n.id);template.skillTree.presets[0].active=['fracture_strike','ember_brand','iron_vigil','breaking_intercept'];template.skillTree.presets[0].conditions=['always','always','always','charge'];template.running=true;template.offlineLuck=E.effectiveLuck(template);template.heroHp=E.stats(template).hp;prepareM2TestRoute(template,10000);const online=clone(template),batch=clone(template),end=190000;
 const rng=()=>{let seed=551;return()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/2**32;};};let old=Math.random;
 try{Math.random=rng();E.offline(batch,end);Math.random=rng();let time=10000;
 while(time<end&&online.running){if(online.restUntil>0){if(online.restUntil>end)break;time=online.restUntil;E.settleRest(online,time);continue;}time=Math.max(time,online.nextBattleAt??0);if(time>=end)break;const e=online.activeEncounter??E.encounter(online,false,time);if(!e)break;time=online.nextActionAt;if(time>end)break;E.step(online,e,time);if(e.done&&e.win)E.reward(online,e,time);}
 E.settleRest(online,end);
 }finally{Math.random=old;}
 for(const key of ['gold','xp','level','heroHp','kills','materialStacks'])assert.deepEqual(batch[key],online[key],'actual affix online/offline '+key);for(const key of ['hp','heroHp','round','cd','shield','activeCastCount'])assert.deepEqual(batch.activeEncounter?.[key],online.activeEncounter?.[key],key+' active encounter parity');assert.equal(batch.activeEncounter?.affixState.nirvanaUsed,online.activeEncounter?.affixState.nirvanaUsed);assert(E.validSave(batch));assert(E.validSave(online));
}
console.log('Actual M2 engine3min seeded online/offline parity with all4 combat specials +lifesteal/luck passed');
{const s=state();s.level=100;s.talents.luck=10;const it=gear(s,null);it.affixes=[currentAffix('luck',3),currentAffix('lifesteal',8),currentAffix('hp',15),currentAffix('atk',3)];E.applyForgeFavor(it);assert.equal(E.effectiveLuck(s),13.3);assert.equal(E.stats(s).lifestealRating,8.8);}
{
 for(const value of [NaN,Infinity,-1,1001]){const s=state();s.offlineLuck=value;assert(!E.validSave(s),'reject offlineLuck '+value);}for(const value of [0,36.4,1000]){const s=state();s.offlineLuck=value;assert(E.validSave(s),'accept offlineLuck '+value);}
}
{
 const template=state();template.level=100;template.talents.luck=10;
 const specials=['knowledge','harvester','shelter','momentum','nirvana','multicast','reaper',null];
 E.SOCKETS.forEach((socket,i)=>{const it=gear(template,specials[i],E.SOCKET_TYPE[socket],socket);it.affixes=[currentAffix('lifesteal',8),currentAffix('luck',3),currentAffix('hp',15),currentAffix('hit',5)];E.applyForgeFavor(it);});
 template.level=100;template.skillTree.presets[0].unlocked=E.SKILL_TREE_DEFINITION.nodes.map(n=>n.id);template.skillTree.presets[0].active=['fracture_strike','ember_brand','iron_vigil','breaking_intercept'];template.skillTree.presets[0].conditions=['always','always','always','charge'];template.running=true;template.offlineLuck=E.effectiveLuck(template);template.heroHp=1;assert(Math.abs(template.offlineLuck-36.4)<1e-9);assert(Math.abs(E.stats(template).lifestealRating-70.4)<1e-9);assert(E.validSave(template));
 prepareM2TestRoute(template,10000);E.normalizePotions(template);const online=clone(template),batch=JSON.parse(JSON.stringify(template)),end=10000+4*3600000;const rng=()=>{let seed=77011;return()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/2**32;};};const old=Math.random;let report,rounds=0,revives=0,time=10000;
 try{Math.random=rng();report=E.offline(batch,end);Math.random=rng();
 while(time<end&&online.running){if(online.restUntil>0){if(online.restUntil>end)break;time=online.restUntil;E.settleRest(online,time);continue;}time=Math.max(time,online.nextBattleAt??0);if(time>=end)break;const e=online.activeEncounter??E.encounter(online,false,time);if(!e)break;time=online.nextActionAt;if(time>end)break;const logs=E.step(online,e,time);rounds++;revives+=logs.filter(x=>x.startsWith('涅槃')).length;if(e.done&&e.win)E.reward(online,e,time);}
 E.settleRest(online,end);
 }finally{Math.random=old;}
 for(const key of ['gold','xp','level','heroHp','kills','materialStacks'])assert.deepEqual(batch[key],online[key],'4h actual affix parity '+key);assert.equal(report.rounds,rounds);assert.deepEqual(batch.potionStacks,online.potionStacks);for(const key of ['hp','heroHp','round','cd','shield','activeCastCount'])assert.deepEqual(batch.activeEncounter?.[key],online.activeEncounter?.[key],'4h '+key);assert(E.validSave(batch));assert(E.validSave(online));
 console.log('AFFIX_4H_ACTUAL_EVIDENCE '+JSON.stringify({durationMs:4*3600000,rounds,revives,kills:online.kills,heroHp:online.heroHp,level:online.level,gold:online.gold,offlineRestCount:report.rests,effectiveLuck:template.offlineLuck,lifestealRating:E.stats(template).lifestealRating,onlineOfflineEqual:true,validSaveBoth:true}));
}
