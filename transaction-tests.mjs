import {legacyFresh as fresh} from './legacy-skill-test-fixture.mjs';
import assert from 'node:assert/strict';
import {commitGameTransaction,SAVE_KEY} from './dist/storage.js';
import {RECIPES,ensureMerchant,purchaseRecipe,craftRecipe,recipeKnown,forge,validSave} from './dist/engine.js';
const original=Math.random,registry=structuredClone(RECIPES);Math.random=()=>.2;
let raw=null,fail=false,writes=0;const storage={setItem(k,v){assert.equal(k,SAVE_KEY);if(fail)throw new Error('quota');raw=v;writes++;}};
try{
 let s=fresh();s.gold=1000;let before=structuredClone(s);fail=true;
 let tx=commitGameTransaction(storage,s,x=>forge(x,['铁屑|0']),{now:100});assert(!tx.ok);assert.equal(tx.reason,'storage');assert.strictEqual(tx.game,s);assert.deepEqual(s,before);assert.equal(raw,null);
 fail=false;tx=commitGameTransaction(storage,s,x=>forge(x,['铁屑|0']),{now:100});assert(tx.ok);assert.equal(tx.game.gold,960);assert.deepEqual(s,before);assert.equal(JSON.parse(raw).inventory.length,9);assert.equal(tx.game.lastSeen,100);assert(validSave(tx.game));
 const n=writes;tx=commitGameTransaction(storage,s,()=>false);assert(!tx.ok);assert.equal(writes,n);tx=commitGameTransaction(storage,s,x=>{x.gold=0;throw new Error('invalid')});assert.equal(tx.reason,'operation');assert.deepEqual(s,before);
 // Disabled recipe definitions are enabled only as isolated test fixtures, never shipped as content.
 const id='potion-healing';Object.assign(RECIPES[id],{functionalTag:null,enabled:true,price:100,craftGold:40,ingredients:[{material:'灰根草',count:2},{material:'铁屑',count:1}]});
 s=fresh();s.gold=1000;const shop=ensureMerchant(s,1000),offer=shop.offers.find(x=>x.type==='recipe'&&x.recipeId===id);assert(offer);before=structuredClone(s);fail=true;
 tx=commitGameTransaction(storage,s,x=>purchaseRecipe(x,offer.offerId,shop.revision,1001),{commitOnNoop:true,now:1001});assert(!tx.ok);assert(!recipeKnown(s,id));assert.deepEqual(s,before);
 fail=false;tx=commitGameTransaction(storage,s,x=>purchaseRecipe(x,offer.offerId,shop.revision,1001),{commitOnNoop:true,now:1001});assert(tx.ok&&tx.value);s=tx.game;assert(recipeKnown(s,id));assert.equal(s.gold,900);assert(validSave(s));
 s.materialStacks={'灰根草|0':2,'铁屑|0':1};before=structuredClone(s);fail=true;
 tx=commitGameTransaction(storage,s,x=>craftRecipe(x,id,['灰根草|0','灰根草|0','铁屑|0']),{now:1002});assert(!tx.ok);assert.deepEqual(s,before);
 fail=false;tx=commitGameTransaction(storage,s,x=>craftRecipe(x,id,['灰根草|0','灰根草|0','铁屑|0']),{now:1002});assert(tx.ok);assert.equal(tx.game.gold,860);assert.equal(tx.value.potionType,'healing');assert(validSave(tx.game));
 // Stale quote may commit only the scheduled fresh stock, without buying anything.
 s=fresh();s.gold=1000;ensureMerchant(s,1000);const rev=s.merchant.revision;
 tx=commitGameTransaction(storage,s,x=>{ensureMerchant(x,1801000);return false;},{commitOnNoop:true,now:1801000});assert(tx.ok&&!tx.value);assert.equal(tx.game.gold,1000);assert.equal(tx.game.merchant.revision,rev+1);assert.equal(JSON.parse(raw).merchant.revision,rev+1);
 console.log('Transactional persistence: clone-before-mutation, storage failure rollback, no false success, hidden recipe purchase/craft fixture, scheduled refresh no-charge persistence: PASS');
}finally{Math.random=original;for(const [id,r]of Object.entries(registry))Object.assign(RECIPES[id],r);}
