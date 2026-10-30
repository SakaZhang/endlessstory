import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
import {loadProgress,SAVE_KEY} from './dist/storage.js';
import {DWARF_MATERIALS} from './dist/dwarf-material-catalog.js';
const races=['dwarf','human','elf','goblin','ashen'];
const economy=s=>structuredClone({gold:s.gold,xp:s.xp,inventory:s.inventory,materialStacks:s.materialStacks,potionStacks:s.potionStacks,consumables:s.consumables});
function storage(game,fail=false){const map=new Map([[SAVE_KEY,JSON.stringify(game)]]);return {writes:0,fail,get length(){return map.size},key:i=>[...map.keys()][i],getItem:k=>map.get(k)??null,setItem(k,v){if(this.fail)throw Error('quota');this.writes++;map.set(k,v)},removeItem:k=>map.delete(k)};}
for(const race of races){
 const s=E.fresh(race);assert(E.validSave(s));assert.deepEqual(s.learnedRecipes,['potion-healing']);assert(!E.recipeKnown(s,'potion-strength'));const initial=economy(s);
 const old=structuredClone(s);delete old.learnedRecipes;old.gold=321;old.potionStacks={'healing|0':7};old.learnedRecipes=['potion-strength'];const m=E.ensureMerchant(old,1000);
 old.learnedRecipes=['potion-strength'];const slot=m.offers.find(o=>o.type==='equipment');Object.keys(slot).forEach(k=>{if(k!=='offerId')delete slot[k]});Object.assign(slot,{type:'recipe',recipeId:'potion-healing',price:E.racialGoldCost(old,E.RECIPES['potion-healing'].price),stock:1});assert(E.validSave(old));
 const before=structuredClone(old),econ=economy(old),store=storage(old,true),failed=loadProgress(store);
 assert(failed.blocked);assert.deepEqual(failed.game,before);assert.deepEqual(JSON.parse(store.getItem(SAVE_KEY)),before);
 store.fail=false;const loaded=loadProgress(store);assert(!loaded.blocked);assert.deepEqual(economy(loaded.game),econ);assert.deepEqual(loaded.game.learnedRecipes,['potion-strength','potion-healing']);assert.equal(loaded.game.merchant.offers.length,8);
 assert.deepEqual(loaded.game.merchant.offers,before.merchant.offers.map(o=>o.recipeId==='potion-healing'?{...o,stock:0}:o));assert.equal(store.writes,1);
 const again=loadProgress(store);assert(!again.blocked);assert.deepEqual(again.game,loaded.game);assert.equal(store.writes,1);
 const forged=structuredClone(before);assert.equal(E.purchaseRecipe(forged,slot.offerId,m.revision,1001),false);assert.deepEqual(economy(forged),econ);assert.equal(forged.merchant.offers.find(o=>o.offerId===slot.offerId).stock,0);
 const stale=structuredClone(before);stale.merchant.offers.find(o=>o.offerId===slot.offerId).price++;const staleSnapshot=structuredClone(stale);assert(!E.purchaseRecipe(stale,slot.offerId,m.revision,1001));assert.deepEqual(stale,staleSnapshot);
 const known=storage(s);assert(!loadProgress(known).blocked);assert.equal(known.writes,0);assert.deepEqual(economy(s),initial);
 // Use a real first-region ingredient; supplying one fixture drop is not a starter grant.
 const ingredient=race==='dwarf'?'灰根草':Object.entries(E.MATERIALS).find(([k,v])=>v.functionalTags?.includes('recoveryBase')&&v.sources?.includes(race+'.a01.field'))?.[0];
 assert(ingredient,race);if(race==='dwarf')assert(DWARF_MATERIALS['dwarf.ashroot'].sources.includes('dwarf.a01.field'));
 s.materialStacks[ingredient+'|0']=1;const gold=s.gold,q=E.quoteRecoveryRecipe(s,0,[{key:ingredient+'|0',quantity:1}]);assert(q);assert(E.craftRecoveryRecipe(s,q));assert.equal(E.potionCount(s,'healing',0),1);assert.equal(s.gold,gold-q.gold);assert.equal(s.materialStacks[ingredient+'|0'],0);
}
let seed=8127;const random=Math.random;Math.random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
try{for(let n=0;n<1000;n++){const s=E.fresh(races[n%5]),m=E.ensureMerchant(s,1000);const refreshed=E.ensureMerchant(s,m.nextRefreshAt);assert.equal(refreshed.offers.length,8);assert(!refreshed.offers.some(o=>o.recipeId==='potion-healing'||o.consumable==='memoryFruit'));assert(E.validSave(s));}}finally{Math.random=random;}
const invalid=E.fresh();invalid.learnedRecipes=['potion-recovery'];const copy=structuredClone(invalid);assert(!E.normalizeRecipes(invalid));assert.deepEqual(invalid,copy);assert(!E.validSave(invalid));
console.log('PASS default healing: five races, atomic restore/quota/retry/idempotence, economy preserved, retired stored slot/free forged rejection, actual early ingredient craft, 1000 refreshes/eight slots/no book/no fruit, strict IDs.');
// Both automatic entitlements share one transaction; neither leaks on quota failure.
{
 const {reachStoryScene}=await import('./story-event-test-fixture.mjs');
 const s=reachStoryScene('human','END.H01.human',{spring:'skip',finishTarget:true});delete s.otherworld;delete s.learnedRecipes;
 assert(E.validSave(s));const before=structuredClone(s),store=storage(s,true),failed=loadProgress(store);
 assert(failed.blocked);assert.deepEqual(failed.game,before);assert.deepEqual(JSON.parse(store.getItem(SAVE_KEY)),before);
 store.fail=false;const restored=loadProgress(store);assert(!restored.blocked);assert(restored.game.otherworld.stoneGranted);assert(E.recipeKnown(restored.game,'potion-healing'));assert.deepEqual(economy(restored.game),economy(before));assert.equal(store.writes,1);
 assert(!loadProgress(store).blocked);assert.equal(store.writes,1);
}
console.log('PASS combined healing/otherworld restore: one write, atomic quota rollback, reload idempotence.');
