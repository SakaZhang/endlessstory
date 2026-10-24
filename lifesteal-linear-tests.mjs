import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
import {lifestealRate,lifestealHeal,calculateLifesteal} from './dist/affix-expansion.js';
import {currentAffix} from './current-equipment-test-fixture.mjs';
for(const rating of [0,1,10,50,100,1000,2000]){
 assert.equal(lifestealRate(rating),rating/1000);
 const input={rating,maxHp:10000,currentHp:1,hits:[{hitId:'a',hpBefore:100,hpAfter:0,source:'active'}]};
 assert.equal(calculateLifesteal(input).heal,100*rating/1000);
 assert.equal(lifestealHeal({rating,damage:100,maxHp:10000,currentHp:1}),100*rating/1000);
}
for(const source of ['poison','dot','counter','execute'])assert.equal(calculateLifesteal({rating:100,maxHp:100,currentHp:1,hits:[{hitId:source,hpBefore:100,hpAfter:0,source}]}).heal,0);
function actual({damage=100,targetHp=10000,shield=0,missing=50}={}){
 const s=E.fresh();s.lastSeen=s.lastHealthClock=10000;s.restUntil=0;s.nextBattleAt=0;s.skills=[null,null,null,null];
 for(const socket of ['ring1','ring2']){const item=E.item('ring',1,null,0);item.special=null;item.affixes=[currentAffix('lifesteal',5)];s.inventory.push(item);assert(E.equipItem(s,item.id,socket));}
 assert.equal(E.stats(s).lifesteal,10);assert.equal(E.stats(s).lifestealRate,.01);
 s.heroHp=E.stats(s).hp-missing;
 const e=E.startDeveloperGroup(s,{count:2,seed:551},10000);assert(e);
 for(const u of e.enemies){u.hp=u.max=targetHp;u.shield=shield;u.armor=0;u.atk=0;u.control.stunUntil=999999;}
 const before=e.heroHp,inventory=JSON.stringify(s.inventory);assert(E.queueDeveloperAction(s,{scope:'single',kind:'damage',amount:damage}));
 E.step(s,e,s.nextActionAt);
 assert.equal(JSON.stringify(s.inventory),inventory,'combat must not reroll equipment');
 assert.equal(e.lastCast.hits[0].actualHpLost,Math.min(targetHp,Math.max(0,damage-shield)));
 assert(Math.abs(e.heroHp-before-Math.min(missing,Math.min(targetHp,Math.max(0,damage-shield))*.01))<1e-9);
 return e.heroHp-before;
}
assert.equal(actual(),1,'real E.step: 10 lifesteal / 100 HP damage = 1 HP');
assert.equal(actual({shield:1000}),0);
assert.equal(actual({targetHp:25}),.25,'overkill excluded');
assert.equal(actual({missing:.5}),.5,'missing HP clamps recovery');
assert.equal(actual({damage:5000,missing:100}),50,'no old 8% max-HP-per-cast ceiling');
console.log('PASS linear lifesteal ratings 0/1/10/50/100/1000/2000; actual E.step 100 damage→1 HP, shield-only, overkill, missingHP, high-damage uncapped recovery, unchanged equipment, ineligible sources.');
