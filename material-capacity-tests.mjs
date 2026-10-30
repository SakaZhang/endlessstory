import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
import {emptyLootSummary} from './dist/inventory-schema.js';
import {loadProgress,SAVE_KEY} from './dist/storage.js';
import {setup} from './boss-growth-test-fixture.mjs';
const originalRandom=Math.random;
const keys=Object.keys(E.MATERIALS).flatMap(m=>[0,1,2,3].map(q=>E.materialKey(m,q)).filter(Boolean));
assert.deepEqual(E.BAG_LIMITS,{equipment:50,materials:1000,items:100});
assert(keys.length>100&&keys.length<E.BAG_LIMITS.materials);
assert.equal(new Set(keys).size,keys.length);
// Every real registered name × valid quality can coexist, preserving unit counts.
const all=E.fresh();all.materialStacks={};
for(const key of keys)assert(E.receiveBattleLoot(all,{kind:'material',key,quantity:7}),key);
assert.equal(E.bagCounts(all).materials,keys.length);assert(E.validSave(all));
const saved=JSON.stringify(all),storage={getItem:k=>k===SAVE_KEY?saved:null,get length(){return 1},key:()=>SAVE_KEY};
const loaded=loadProgress(storage);assert(!loaded.blocked);assert.equal(JSON.stringify(loaded.game),saved);
assert(E.normalizeMaterials(loaded.game));assert(E.normalizeInventoryState(loaded.game));assert.deepEqual(loaded.game.materialStacks,all.materialStacks);
// Existing saves above the old limit load intact; zero-count rows use no capacity.
all.materialStacks[keys[0]]=0;assert.equal(E.bagCounts(all).materials,keys.length-1);
assert(E.receiveBattleLoot(all,{kind:'material',key:keys[0],quantity:2000}));assert.equal(all.materialStacks[keys[0]],2000);
// Future-stack capacity is tested only at the generic schema boundary, never as valid catalog content.
const generic={materialStacks:Object.fromEntries(Array.from({length:E.BAG_LIMITS.materials},(_,i)=>['future-'+i+'|0',i+1]))};
assert.equal(E.bagCounts(generic).materials,1000);assert(!E.canReceiveMaterial(generic,'new|0'));
assert(E.canReceiveMaterial(generic,'future-0|0',5000));generic.materialStacks['future-1|0']=0;assert(E.canReceiveMaterial(generic,'new|0'));
generic.materialStacks['future-1|0']=2;generic.materialStacks['legacy-extra|0']=12345;
const before=structuredClone(generic.materialStacks);assert(E.normalizeInventoryState(generic));assert.deepEqual(generic.materialStacks,before);
assert(!E.canReceiveMaterial(generic,'new|0'));assert(E.canReceiveMaterial(generic,'legacy-extra|0'));assert.equal(E.bagCounts(generic).materials,1001);
// Unit bound remains distinct from stack capacity; rejection is atomic and accurately reported.
all.materialStacks[keys[0]]=1e12;const summary=emptyLootSummary();assert(!E.receiveBattleLoot(all,{kind:'material',key:keys[0],quantity:2},summary));assert.equal(all.materialStacks[keys[0]],1e12);assert.equal(summary.overflow.materials,2);
all.materialStacks[keys[0]]-=2;assert(E.receiveBattleLoot(all,{kind:'material',key:keys[0],quantity:2}));
// Merchant admission is no longer blocked by the old 100-stack threshold.
const buyer=E.fresh();buyer.gold=10000;const shop=E.ensureMerchant(buyer,1000),offer=shop.offers.find(o=>o.type==='material'),buyKey=E.materialKey(offer.material,offer.quality);
buyer.materialStacks=Object.fromEntries(keys.filter(k=>k!==buyKey).slice(0,120).map(k=>[k,1]));assert(E.buyMaterial(buyer,buyKey,1,shop.revision,1001));assert.equal(E.bagCounts(buyer).materials,121);assert(E.validSave(buyer));
// Crafting with the expanded bag preserves every unrelated stack and pending-output semantics.
const craft=structuredClone(loaded.game);craft.gold=1000;E.normalizePotions(craft);craft.potionStacks['healing|0']=1e9;E.learnRecipe(craft,'potion-healing');
const input='灰根草|0',prior=structuredClone(craft.materialStacks),quote=E.quoteRecoveryRecipe(craft,0,[{key:input,quantity:2}]);assert(quote);
const result=E.craftRecoveryRecipe(craft,quote);assert(result);assert(craft.pendingForgeClaim);assert.equal(E.claimForgeResult(craft),null);
prior[input]-=2;assert.deepEqual(craft.materialStacks,prior);assert(E.validSave(craft));
const pending=JSON.parse(JSON.stringify(craft));pending.potionStacks['healing|0']-=2;assert.deepEqual(E.claimForgeResult(pending),result);assert.equal(E.claimForgeResult(pending),null);assert.deepEqual(pending.materialStacks,prior);
// Offline actual settlements admit new common-quality stacks with >100 stacks already held.
try{
 const s=setup('dwarf',100,3,74,false);s.siteId='dwarf.a01';s.location=0;s.expedition={mode:'dungeon',targetInstanceId:'dwarf.a01.dungeon',fieldId:'dwarf.a01.field',loop:false};s.running=true;
 s.materialStacks=Object.fromEntries(keys.filter(k=>!E.MATERIALS[E.parseMaterialKey(k).material].storyOnly&&E.parseMaterialKey(k).quality>=2).slice(0,120).map(k=>[k,1]));assert.equal(E.bagCounts(s).materials,120);
 const report=E.offline(s,s.lastSeen+120000);assert.equal(report.kills,3);assert.equal(report.lootSummary.overflow.materials,0);assert(E.bagCounts(s).materials>120);assert(E.validSave(s));
}finally{Math.random=originalRandom;}
console.log(`PASS material capacity: ${Object.keys(E.MATERIALS).length} names / ${keys.length} canonical stacks; 1000-stack boundary, replenishment, non-truncating old-save load, quantity ceiling, merchant and offline new-stack admission; gear50/items100 unchanged.`);
