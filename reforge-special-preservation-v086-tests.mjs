import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
import {GROWTH_SPECIAL_DEFS} from './dist/special-affix-growth.js';
import {makeAffixSourceRange} from './dist/affix-range.js';
const clone=structuredClone,serialize=x=>JSON.parse(JSON.stringify(x));
const rng=Math.random;let seed=860021;Math.random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/2**32;};
function setup(special=null,quality=3){const s=E.fresh();s.consumables.reforgeToken=100;s.gold=1e7;s.materialStacks={'铁屑|0':1000,'炉火晶|0':1000,'誓约残片|0':100};let it;do{it=E.item('gloves',10,null,quality);}while(!it.affixes.length);it.special=clone(special);it.locked=true;it.enhancement={version:1,model:'development-budget-v1',level:3};s.inventory.push(it);assert(E.validSave(s),'valid initial fixture');return {s,it};}
function invariant(it){const {affixes,divine,...rest}=it;return rest;}
function noRandom(fn){const prev=Math.random;Math.random=()=>{throw Error('preview or decision must not reroll');};try{return fn();}finally{Math.random=prev;}}
let cases=0;
try{
 // Every currently generated special, retired owned special, and all progress boundaries.
 const specials=[null,...Object.getOwnPropertyNames(E.SPECIALS).map(id=>({id}))];
 for(const [id,def] of Object.entries(GROWTH_SPECIAL_DEFS))for(const growthKills of [0,1,Math.floor(def.maxKills/2),def.maxKills-1,def.maxKills])specials.push({id,growthKills});
 for(const special of specials)for(const accept of [false,true]){
  const {s,it}=setup(special);E.applyForgeFavor(it);const before=clone(it),cost=E.getReforgeCost(it,'all'),token=s.consumables.reforgeToken;
  const result=E.reforge(s,it.id,'all');assert(result);assert.deepEqual(it,before,'pending target is immutable');assert.deepEqual(result.oldSpecial,special);assert.deepEqual(result.newSpecial,special,'candidate result preserves special');assert.equal(s.pendingReforge.ruleVersion,10);assert.deepEqual(s.pendingReforge.newSpecial,special);assert.equal(s.consumables.reforgeToken,token-cost.consumables.reforgeToken);
  assert(E.validPendingReforge(s));assert(E.validSave(s));const restored=serialize(s),owned=restored.inventory.find(x=>x.id===it.id);const beforeChoice=JSON.stringify(restored);
  const preview=noRandom(()=>E.getPendingReforgeCandidate(restored));assert(preview);assert.deepEqual(preview.special,special);assert.deepEqual(invariant(preview),invariant(before));assert.equal(preview.affixes.length,4);assert.equal(new Set(preview.affixes.map(a=>a.stat)).size,4);assert.deepEqual(preview.affixes,restored.pendingReforge.newAffixes);
  if(preview.special)preview.special.id='mutated-preview';assert.deepEqual(owned.special,special,'preview is a detached copy');assert.equal(JSON.stringify(restored),beforeChoice);
  assert.equal(E.reforge(restored,it.id,'all'),null);assert.equal(JSON.stringify(restored),beforeChoice);assert.equal(E.resolveReforge(restored,true,'stale'),null);assert.equal(JSON.stringify(restored),beforeChoice);
  assert(noRandom(()=>E.resolveReforge(restored,accept,result.operationId)));assert.deepEqual(owned.special,special);assert.deepEqual(invariant(owned),invariant(before));if(!accept)assert.deepEqual(owned,before);else assert.deepEqual(owned.affixes,result.after);
  assert(E.validSave(restored));assert.equal(restored.consumables.reforgeToken,token-1);const done=JSON.stringify(restored);assert.equal(E.resolveReforge(restored,true,result.operationId),null);assert.equal(JSON.stringify(restored),done);
  assert(E.reforge(restored,it.id,'all'));assert.deepEqual(restored.pendingReforge.newSpecial,special);assert(E.resolveReforge(restored,true));assert.deepEqual(owned.special,special);assert.equal(restored.consumables.reforgeToken,token-2);assert(E.validSave(restored));cases++;
 }
 // Quality retains ordinary-slot counts: do not silently grant four affixes to low quality.
 for(let quality=0;quality<4;quality++){const {s,it}=setup(null,quality),count=it.affixes.length;assert.equal(count,quality===0?1:quality+1);assert(E.reforge(s,it.id,'all'));assert.equal(E.getPendingReforgeCandidate(s).affixes.length,count);assert(E.resolveReforge(s,true));assert.equal(it.affixes.length,count);assert.equal(it.special,null);assert(E.validSave(s));}
 // Sets and legendary exclusives retain their fixed identity and no-special behavior.
 for(const kind of ['set','legendary','fixed-legendary']){
  const s=E.fresh();s.consumables.reforgeToken=3;const it=kind==='set'?E.item('gloves',10,'anvil',3):E.legendaryItem(kind==='legendary'?'first-forge-oathhammer':'lucky-dice',10);s.inventory.push(it);assert(E.validSave(s));const before=clone(it);
  if(kind==='fixed-legendary'){const snapshot=JSON.stringify(s);assert.equal(E.reforge(s,it.id,'all'),null);assert.equal(JSON.stringify(s),snapshot);continue;}
  assert(E.reforge(s,it.id,'all'));assert.deepEqual(E.getPendingReforgeCandidate(s).special,before.special);assert(E.resolveReforge(s,true));assert.deepEqual(invariant(it),invariant(before));assert(E.validSave(s));
 }
 // Historical paid candidates may contain a formerly rerolled special. Retain the owned original.
 for(const oldSpecial of [null,{id:'knowledge'},{id:'harvester',growthKills:213}])for(const version of [6,7,8,9]){
  const {s,it}=setup(oldSpecial);assert(E.reforge(s,it.id,'all'));s.pendingReforge.ruleVersion=version;s.pendingReforge.newSpecial={id:'glutton'};if(version===6){s.pendingReforge.newAffixes=s.pendingReforge.newAffixes.map(a=>{const sourceRange=makeAffixSourceRange(E.AFFIX_DEFS[a.stat],it.rarity);return {stat:a.stat,value:sourceRange.min,sourceRange};});s.pendingReforge.newDivine=null;}const snapshot=JSON.stringify(s),tokens=s.consumables.reforgeToken;assert(E.validSave(s),'historical paid record remains readable');
  const restored=serialize(s);const preview=noRandom(()=>E.getPendingReforgeCandidate(restored));assert.deepEqual(preview.special,oldSpecial,'old preview cannot offer special reroll');assert.equal(JSON.stringify(s),snapshot);
  assert(noRandom(()=>E.resolveReforge(restored,true,restored.pendingReforge.operationId)));assert.deepEqual(restored.inventory.find(x=>x.id===it.id).special,oldSpecial);assert.equal(restored.consumables.reforgeToken,tokens);assert(E.validSave(restored));
 }
 // Rule10 binds both the special identity and its persistent counter, including null.
 for(const special of [null,{id:'knowledge'},{id:'harvester',growthKills:123}]){
  const {s,it}=setup(special);assert(E.reforge(s,it.id,'all'));for(const mutate of [
   x=>x.pendingReforge.newSpecial={id:'glutton'},
   x=>x.pendingReforge.oldSpecial={id:'glutton'},
   x=>{x.pendingReforge.newSpecial={id:'harvester',growthKills:124};},
   x=>{x.pendingReforge.newSpecial={id:'harvester',growthKills:401};},
   x=>{x.pendingReforge.newSpecial={...(special??{id:'knowledge'}),extra:true};},
   x=>{x.pendingReforge.cost.consumables.reforgeToken=0;},
  ]){const bad=clone(s);mutate(bad);const snapshot=JSON.stringify(bad);assert(!E.validPendingReforge(bad));assert(!E.validSave(bad));assert.equal(E.getPendingReforgeCandidate(bad),null);assert.equal(E.resolveReforge(bad,true),null);assert.equal(JSON.stringify(bad),snapshot);}
 }
 // Growth earned while a candidate is pending belongs to the owned affix, not a stale preview.
 {const {s,it}=setup({id:'harvester',growthKills:123});assert(E.reforge(s,it.id,'all'));it.special.growthKills=124;assert(E.validSave(s));assert.deepEqual(E.getPendingReforgeCandidate(s).special,it.special);assert(E.resolveReforge(s,true));assert.equal(it.special.growthKills,124);assert(E.validSave(s));}
 console.log(`v086 special-preserving reforge PASS: ${cases} special/decision cases, quality slots, sets/legendary identities, historical candidates, strict tamper rejection, pending growth, repeated/atomic once-only costs.`);
}finally{Math.random=rng;}
