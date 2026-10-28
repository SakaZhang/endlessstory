import assert from 'node:assert/strict';
import {fresh,item,ensureMerchant,merchantEquipmentPrice,MERCHANT_QUALITY_MULTIPLIERS,MERCHANT_PRICING_VERSION,merchantMaterialKeys,materialPrice,racialGoldCost,sellValue,validSave,purchaseEquipment,purchaseConsumable,purchaseRecipe,buyMaterial,materialKey,paidRefreshMerchant} from './dist/engine.js';
const original=Math.random;let seed=72071,calls=0;Math.random=()=>{calls++;seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/2**32;};
function legacyShop(race='dwarf'){
 const s=fresh(race);s.gold=100000;const m=ensureMerchant(s,1000);delete m.pricingVersion;
 for(const o of m.offers)if(o.type==='equipment')o.price=racialGoldCost(s,15+sellValue(o.item)*4+o.item.level*3);
 assert(validSave(s));return s;
}
try{
 assert.deepEqual(MERCHANT_QUALITY_MULTIPLIERS,[1,1.5,2.5,4]);
 for(const race of ['dwarf','human','elf','goblin','ashen'])for(const level of [1,3,10,30,100,1000]){
  const prices=[];for(let rarity=0;rarity<4;rarity++){
   const it={level,rarity},base=23+3*level+4*Math.floor(level/3),price=racialGoldCost({race},merchantEquipmentPrice(it));prices.push(price);
   assert.equal(price,racialGoldCost({race},Math.ceil(base*MERCHANT_QUALITY_MULTIPLIERS[rarity])));
   assert(price>sellValue(it),'No immediate buy/sell arbitrage');
   if(rarity===0)assert.equal(price,racialGoldCost({race},15+sellValue(it)*4+level*3),'Ordinary prices unchanged');
  }
  assert(prices.every((p,i)=>!i||p>prices[i-1]));
 }
 assert.deepEqual([0,1,2,3].map(rarity=>merchantEquipmentPrice({level:1,rarity})),[26,39,65,104]);
 for(const material of merchantMaterialKeys())for(const race of ['human','dwarf']){
  const prices=[0,1,2,3].map(q=>racialGoldCost({race},materialPrice(material,q)));
  assert(prices.every((p,i)=>p>0&&(!i||p>prices[i-1])));
 }
 for(const race of ['dwarf','human','elf','goblin','ashen']){
  const s=legacyShop(race),before=structuredClone(s),n=calls,m=ensureMerchant(s,1100);
  assert.equal(calls,n,'Repricing must never reroll');assert.equal(m.pricingVersion,MERCHANT_PRICING_VERSION);assert.equal(m.revision,before.merchant.revision+1);
  for(const field of ['cycleStart','nextRefreshAt','generatedAt','paidRefreshes'])assert.equal(m[field],before.merchant[field]);
  assert.deepEqual(s.inventory,before.inventory);assert.equal(s.gold,before.gold);
  for(let i=0;i<m.offers.length;i++){
   const o=m.offers[i],old=before.merchant.offers[i];assert.deepEqual({...o,price:old.price},old);
   assert.equal(o.price,o.type==='equipment'?racialGoldCost(s,merchantEquipmentPrice(o.item)):old.price);
  }
  const snapshot=JSON.stringify(s);assert(validSave(s));assert(validSave(JSON.parse(snapshot)));ensureMerchant(s,1200);assert.equal(JSON.stringify(s),snapshot);assert.equal(calls,n);
  const loaded=JSON.parse(snapshot);ensureMerchant(loaded,1300);assert.equal(JSON.stringify(loaded),snapshot);
  const gear=m.offers.find(o=>o.type==='equipment'),gold=s.gold;assert(!purchaseEquipment(s,gear.offerId,before.merchant.revision,1300));assert.equal(s.gold,gold);
  assert(purchaseEquipment(s,gear.offerId,m.revision,1400));assert.equal(s.gold,gold-gear.price);assert.deepEqual(s.inventory.at(-1),gear.item);assert(validSave(s));
 }
 // Every transaction rejects its pre-migration quote, without charging or changing stock.
 for(const action of ['gear','material','refresh','recipe','consumable']){
  let s;for(let i=0;i<100;i++){s=legacyShop();if(action!=='consumable'||s.merchant.offers.some(o=>o.type==='consumable'))break;}
  const m=s.merchant,old=structuredClone(s),rev=m.revision,gear=m.offers.find(o=>o.type==='equipment'),mat=m.offers.find(o=>o.type==='material'),recipe=m.offers.find(o=>o.type==='recipe'),cons=m.offers.find(o=>o.type==='consumable');
  const result=action==='gear'?purchaseEquipment(s,gear.offerId,rev,1100):action==='material'?buyMaterial(s,materialKey(mat.material,mat.quality),2,rev,1100):action==='refresh'?paidRefreshMerchant(s,1100,rev):action==='recipe'?purchaseRecipe(s,recipe.offerId,rev,1100):purchaseConsumable(s,cons.offerId,rev,1100);
  assert.equal(result,false);assert.equal(s.gold,old.gold);assert.deepEqual(s.inventory,old.inventory);assert.deepEqual(m.offers.map(o=>o.stock),old.merchant.offers.map(o=>o.stock));assert.equal(m.revision,rev+1);
 }
 const s=legacyShop(),m=ensureMerchant(s,1100),o=m.offers.find(o=>o.type==='equipment');o.price--;
 assert(!validSave(s));assert.equal(ensureMerchant(s,1200),null);const snapshot=JSON.stringify(s);assert(!purchaseEquipment(s,o.offerId,m.revision,1200));assert.equal(JSON.stringify(s),snapshot);
 console.log('PASS merchant quality tiers, all-race discounts/no arbitrage, ordinary affordability, in-place legacy repricing/reload, stale transactions, tampered-price rejection');
}finally{Math.random=original;}
