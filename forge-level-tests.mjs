import {fresh} from './dist/engine.js';
import assert from 'node:assert/strict';
import {forge,validSave,materialCount} from './dist/engine.js';
const original=Math.random;let seed=312042;Math.random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/2**32);
let sets=0,divine=0,qualities=new Set();
try{
 for(const level of [1,7,40,100,137])for(const quality of [0,1,2,3])for(let draw=0;draw<100;draw++){
  const s=fresh();s.level=level;s.gold=100;s.materialStacks={['铁屑|'+quality]:5};s.talents.luck=Math.min(draw%11,level-1);
  const it=forge(s,Array(5).fill('铁屑|'+quality));assert(it);assert(Number.isInteger(it.level)&&it.level>=Math.max(1,level-2)&&it.level<=level+2);assert.equal(it.baseLevel,level);assert.equal(it.levelSource,'material');assert.equal(s.level,level);assert.equal(s.gold,60);assert.equal(materialCount(s,'铁屑',quality),0);assert.equal(s.inventory.length,1);assert(validSave(s));sets+=!!it.set;divine+=!!it.divine;qualities.add(it.rarity);
 }
 assert.equal(sets,0);assert(divine>0);assert.equal(qualities.size,4);
 console.log('Material forge ±2 current-level variance: 2000 draws at levels1/7/40/100/137, all material qualities, no new sets/divine retained, cost40 and input counts unchanged; no level cap: PASS');
}finally{Math.random=original;}
