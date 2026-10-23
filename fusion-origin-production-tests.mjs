import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
const original=Math.random;let seed=123;const rng=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/2**32;};Math.random=rng;
try{
 for(let i=0;i<200;i++){const s=E.fresh();s.gold=1000;s.materialStacks['铁屑|0']=20;const it=E.forge(s,['铁屑']);assert(it);assert.equal(it.originRace,'dwarf');assert.equal(it.level,s.level);assert(!it.set&&!it.legendaryId);assert(E.validSave(s));}
 const s=E.fresh();s.gold=1000;const a=E.item('weapon',30,null,3);s.inventory.push(a);s.race='elf';const it=E.forge(s,[{kind:'equipment',id:a.id}]);assert.equal(it.originRace,'dwarf','input origin does not become the future hero race');assert.equal(it.baseLevel,30);assert(!it.set&&!it.legendaryId);
 const bad=E.fresh();bad.gold=1000;const unknown=E.item('ring',1,null,0);delete unknown.templateId;delete unknown.visualVariant;unknown.originRace='elf';bad.inventory.push(unknown);const before=JSON.stringify(bad);Math.random=()=>{throw Error('must reject before RNG');};assert.equal(E.forge(bad,[{kind:'equipment',id:unknown.id}]),null);assert.equal(JSON.stringify(bad),before);
 console.log('PASS actual forge origin: live dwarf templates, pure-material exact hero level, historical legacy dwarf even different fixture hero, unregistered source rejected before RNG/cost.');
}finally{Math.random=original;}
