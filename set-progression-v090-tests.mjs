import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as E from './dist/engine.js';
import {setDropProbability,rollSourceSet} from './dist/set-source-schema.js';
import {OTHERWORLD_LOOT_POLICY} from './dist/otherworld-state.js';
import {renderLuckRates} from './dist/rare-loot-ui.js';
import {setup} from './boss-growth-test-fixture.mjs';
import {SETS} from './dist/skill-tree-tuning.js';
import {resolveSetLinkedHit,resolveSetLinkedEffect} from './dist/skill-tree-consumer.js';
let seed=123456;const random=()=>((seed=Math.imul(seed,1664525)+1013904223>>>0)/2**32);
assert.equal(OTHERWORLD_LOOT_POLICY.setChance,.2);
for(const kind of ['field','dungeon','boss']){
 const base={field:.03,dungeon:.15,boss:.25}[kind];assert.equal(setDropProbability(kind,0),base);assert.equal(setDropProbability(kind,5),base*1.1);
 let yes=0;for(let i=0;i<60000;i++)yes+=!!rollSourceSet({source:'drop',kind,areaNumber:3,race:'human',clear:true},random);assert(Math.abs(yes/60000-base)<.008);
 for(const areaNumber of [1,2,11])assert.equal(rollSourceSet({source:'drop',kind,areaNumber,race:'human',clear:true},()=>0),null);
}
assert.equal(rollSourceSet({source:'drop',kind:'dungeon',areaNumber:3,race:'human',clear:false},()=>0),null);
assert.equal(rollSourceSet({source:'forge',kind:'field',areaNumber:3,race:'human'},()=>0),null);
assert.match(renderLuckRates(E.fresh()),/野外 <b>3%<\/b>/);
const hit={baseDamage:100,conditionalBonus:20,source:{kind:'skill'},direct:true,damageType:'physical'};
for(const weaponType of ['axe','hammer','staff']){
 const h={...hit,weaponType,hitIndex:1,targetBleeding:true,targetBroken:true,targetBurning:true,heroShielded:true};
 assert(resolveSetLinkedHit({...h,skillId:'breach_followup'},{anvil:4},SETS).totalDamage>resolveSetLinkedHit({...h,skillId:'breach_followup'},{anvil:0},SETS).totalDamage);
}
assert.equal(resolveSetLinkedEffect({type:'dot',status:'burn',amount:100},{rune:2},SETS).amount,145);
assert.equal(resolveSetLinkedEffect({type:'shield',amount:100,source:{kind:'skill'}},{guard:2},SETS).amount,135);
const original=Math.random,now=Date.now;Date.now=()=>1700000000000;Math.random=random;
try{
 for(const race of E.RACE_KEYS){
  const s=setup(race,100,0,1);s.heroHp=E.stats(s).hp;E.normalizeHealth(s,s.lastSeen);assert(E.travelToArea(s,race+'.a03',s.lastSeen));
  const e=E.startInstanceEncounter(s,race+'.a03.field',s.lastSeen);assert(e);for(let n=0;n<3000&&!e.done;n++)E.step(s,e,s.nextActionAt);assert(e.win);
  let found=0;const sets=new Set();
  for(let i=1;i<=400;i++){const c=structuredClone(s);c.activeEncounter.rngState=Math.imul(i,2654435761)>>>0;const before=new Set(c.inventory.map(it=>it.id));E.reward(c,c.activeEncounter,c.lastHealthClock);const drops=c.inventory.filter(it=>!before.has(it.id)&&it.set);assert(drops.length<=1,'one independent set per victory, including group');for(const it of drops){found++;sets.add(it.set);assert.equal(it.originRace,race);assert.equal(it.rarity,3);assert(it.level>=21&&it.level<=30);}assert(E.validSave(c));const after=JSON.stringify(c);E.reward(c,c.activeEncounter,c.lastHealthClock);assert.equal(JSON.stringify(c),after);}
  assert(found>0,race+' actual A3 field produces sets');console.log('actual field set reward',race,found,[...sets]);
 }
}finally{Math.random=original;Date.now=now;}
console.log('PASS v090 field3/dungeon15/boss25, existing luck, A3+ gates, unchanged20% otherworld, 5-race actual field wins + 2000 settlements, one roll, native level and repeat safety, dwarf effects');
