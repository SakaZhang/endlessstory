import {addTestEquipment} from './equipped-test-fixture.mjs';
import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
import {commitGameTransaction} from './dist/storage.js';
import {craftReturnRing} from './dist/return-ring-crafting.js';
import {craftInfinityGauntlet} from './dist/infinity-gauntlet-crafting.js';
const clone=structuredClone;
const identities=[['return-ring','returnRing'],['infinity-gauntlet','infinityGauntlet']];
for(const [legendaryId,ledger] of identities){
 const base=E.fresh();base.gold=10000;const it=E.legendaryItem(legendaryId,10);assert(it,legendaryId+' must be registered');base.inventory.push(it);base[ledger]={version:1,recipeLearned:true,crafted:true,craftedItemId:it.id};assert(E.validSave(base));
 assert(E.isUniqueCraftedEquipment(it));const q=E.quoteBatchSale(base,it.slot,[0,1,2,3,4]);assert(q);assert(!q.entries.some(x=>x.id===it.id));
 for(const action of ['sell','discard']){
  const s=clone(base),before=clone(s),gold=s.gold;let raw=JSON.stringify(s),fail=true;const storage={setItem(k,v){if(fail)throw Error('quota');raw=v}};
  let tx=commitGameTransaction(storage,s,next=>E.disposeEquipment(next,it.id,action));assert.equal(tx.reason,'storage');assert.deepEqual(s,before);assert.deepEqual(JSON.parse(raw),before);fail=false;
  tx=commitGameTransaction(storage,s,next=>E.disposeEquipment(next,it.id,action));assert(tx.ok);assert(!tx.game.inventory.some(x=>x.id===it.id));assert.deepEqual(tx.game[ledger],before[ledger]);assert.equal(tx.game.gold,gold+(action==='sell'?E.sellValue(it):0));assert(E.validSave(JSON.parse(raw)));assert.equal((legendaryId==='return-ring'?craftReturnRing:craftInfinityGauntlet)(storage,tx.game).reason,'already-crafted');assert.equal(E.disposeEquipment(tx.game,it.id,action),null);
 }
 for(const mutate of [s=>s.inventory.find(x=>x.id===it.id).locked=true,s=>E.equipItem(s,it.id),s=>{E.equipItem(s,it.id);E.saveLoadout(s,0,'保护');addTestEquipment(s,{socket:it.slot})}]){
  const s=clone(base);mutate(s);for(const action of ['sell','discard']){const before=clone(s);assert.equal(E.disposeEquipment(s,it.id,action),null);assert.deepEqual(s,before);}
 }
 const pending=clone(base),cost=E.getReforgeCost(it,'value',pending);for(const [key,n] of Object.entries(cost.materials??{}))pending.materialStacks[E.materialKey(key,0)]=(pending.materialStacks[E.materialKey(key,0)]??0)+n;assert(E.reforge(pending,it.id,'value',0));assert(pending.pendingReforge);for(const action of ['sell','discard']){const before=clone(pending);assert.equal(E.disposeEquipment(pending,it.id,action),null);assert.deepEqual(pending,before);}
 const s=clone(base),out=E.forge(s,[{kind:'equipment',id:it.id}]);assert(out);assert(!out.legendaryId);assert.equal(out.rarity,3);assert.deepEqual(s[ledger],base[ledger]);assert(!s.inventory.some(x=>x.id===it.id));assert(E.validSave(s));
}
const ordinary=E.fresh(),unworn=E.item('ring',1);ordinary.inventory.push(unworn);assert.equal(E.disposeEquipment(ordinary,unworn.id,'discard'),null,'no expanded ordinary discard scope');
console.log('PASS unique crafted disposal: manual sale/discard atomic, no repeat proceeds, locked/equipped/loadout protected; bulk excludes both identities; existing legendary forge consumption preserves permanent ledger.');
