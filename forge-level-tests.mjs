import {legacyFresh as fresh} from './legacy-skill-test-fixture.mjs';
import assert from 'node:assert/strict';
import {forge,validSave,materialCount} from './dist/engine.js';
const original=Math.random;let seed=312042;Math.random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/2**32);
let sets=0,divine=0,qualities=new Set();
try{
 for(const level of [1,7,40,100,137])for(const quality of [0,1,2,3])for(let draw=0;draw<100;draw++){
  const s=fresh();s.level=level;s.gold=100;s.bonusTalentPoints=30;s.testGrants={v081support:true};s.materialStacks={['铁屑|'+quality]:5};s.talents.luck=draw%11;
  const it=forge(s,Array(5).fill('铁屑|'+quality));assert(it);assert.equal(it.level,level);assert.equal(s.level,level);assert.equal(s.gold,60);assert.equal(materialCount(s,'铁屑',quality),0);assert.equal(s.inventory.length,9);assert(validSave(s));sets+=!!it.set;divine+=!!it.divine;qualities.add(it.rarity);
 }
 assert(sets>0&&divine>0);assert.equal(qualities.size,4);
 console.log('Material forge exact current level: 2000 draws at levels1/7/40/100/137, all material qualities, sets/divine retained, cost40 and input counts unchanged; no level cap: PASS');
}finally{Math.random=original;}
