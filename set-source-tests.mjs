import {merchantEquipmentPrice} from './dist/engine.js';
import {fresh} from './dist/engine.js';
import {LEGACY_INSTANCES} from './dist/location-schema.js';
import assert from 'node:assert/strict';
import {forge,ensureMerchant,item,validSave,purchaseEquipment,isMerchantEquipmentSellable,rollSourceSet,claimForgeResult,applyForgeFavor,saveLoadout,equipItem,reforge,resolveReforge,stats,sellValue,normalizeHealth,startInstanceEncounter,startRoutedEncounter,reward,INSTANCES,SET_SLOTS} from './dist/engine.js';
const original=Math.random;let seed=5102;const rng=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/2**32;};Math.random=rng;
try{
 const s=fresh();s.gold=1e9;s.materialStacks['铁屑|0']=100000;let gods=0;const qualities=new Set();
 for(let i=0;i<20000;i++){const gold=s.gold,it=forge(s,['铁屑|0']);assert.equal(it.set,null);assert.equal(s.gold,gold-40);qualities.add(it.rarity);gods+=!!it.divine;s.inventory.pop();}assert.equal(qualities.size,4);assert(gods>450&&gods<750);
 let equipment=0,fruit=0,token=0,books=0,materials=0;for(let i=0;i<20000;i++){const p=fresh(),m=ensureMerchant(p,1000);assert.equal(m.offers.length,8);books+=m.offers.filter(o=>o.type==='recipe').length;materials+=m.offers.filter(o=>o.type==='material').length;fruit+=m.offers.some(o=>o.consumable==='memoryFruit');token+=m.offers.some(o=>o.consumable==='reforgeToken');for(const o of m.offers.filter(o=>o.type==='equipment')){equipment++;assert.equal(o.item.set,null);assert(isMerchantEquipmentSellable(o));}}
 // Fifteen unknown books use the existing 1–2-book slots (formerly capped by one enabled book).
 assert.equal(equipment+books+materials+fruit+token,20000*8);assert(books>29000&&books<31000);assert(equipment>70000&&equipment<85000);assert.equal(fruit,0);assert(token>1750&&token<2250);
 // Source policy is independent of concrete instance availability.
 for(const kind of ['dungeon','boss']){let count=0;const sets=new Set(),slots=new Set();for(let i=0;i<20000;i++){const result=rollSourceSet({source:'drop',kind,areaNumber:3,race:'dwarf',clear:true},rng);if(result){count++;sets.add(result.set);slots.add(result.slot);assert.equal(result.rarity,3);assert(SET_SLOTS.includes(result.slot));}}assert.equal(sets.size,3);assert.equal(slots.size,4);assert(count>(kind==='boss'?2100:1350)&&count<(kind==='boss'?2700:1850));}
 let draws=0;const zero=()=>{draws++;return 0;};
 for(const source of ['forge','merchant','drop'])for(const areaNumber of [1,2,3])for(const kind of ['field','dungeon','boss']){
  if(source==='drop'&&areaNumber===3&&kind!=='field')continue;const before=draws;assert.equal(rollSourceSet({source,kind,areaNumber,race:'dwarf'},zero),null);assert.equal(draws,before);
 }
 assert.deepEqual(rollSourceSet({source:'drop',kind:'boss',areaNumber:3,race:'elf'},zero),{set:'elf_arrow',slot:'helm',rarity:3});assert.equal(rollSourceSet({source:'drop',kind:'boss',areaNumber:3,race:'unknown'},zero),null);
 Math.random=()=>0;const forced=fresh();assert.equal(forge(forced,['铁屑|0']).set,null);assert(ensureMerchant(fresh(),1000).offers.filter(o=>o.type==='equipment').every(o=>!o.item.set));
 // Retired prototype nodes cannot be started in the current generation.
 for(const instance of Object.values(LEGACY_INSTANCES)){const p=fresh(),before=JSON.stringify(p);assert.equal(startInstanceEncounter(p,instance.id,0),null);assert.equal(JSON.stringify(p),before);}
 // Old pre-generated set stock remains unchanged, but cannot be purchased.
 const merchant=fresh();merchant.gold=10000;const m=ensureMerchant(merchant,1000),offer=m.offers.find(o=>o.type==='equipment');offer.item=item('helm',offer.item.level,'anvil',3,{levelSource:'merchant'});offer.price=merchantEquipmentPrice(offer.item);const snapshot=JSON.stringify(merchant);assert(validSave(merchant));assert(!isMerchantEquipmentSellable(offer));assert(!purchaseEquipment(merchant,offer.offerId,m.revision,1001));assert.equal(JSON.stringify(merchant),snapshot);
 // Previously paid, pending set output remains claimable with the same ID/divine data.
 const old=fresh(),legacySet=item('helm',1,'rune',3,{levelSource:'material'});applyForgeFavor(legacySet);old.pendingForgeClaim={kind:'equipment',item:legacySet};const identity=JSON.stringify(legacySet);assert(validSave(old));const paid=JSON.parse(JSON.stringify(old));assert.equal(JSON.stringify(claimForgeResult(paid)),identity);assert(validSave(paid));assert.equal(claimForgeResult(paid),null);
 assert(equipItem(paid,legacySet.id));assert(saveLoadout(paid,0,'保留旧套装'));const target=paid.inventory.find(i=>i.id===legacySet.id),base=JSON.stringify(target),beforeStats=JSON.stringify(stats(paid));paid.gold=1000;assert(reforge(paid,target.id,'value',0));assert.equal(JSON.stringify(target),base);assert.equal(JSON.stringify(stats(paid)),beforeStats);assert(resolveReforge(paid,false));assert.equal(JSON.stringify(target),base);assert.equal(paid.loadouts[0].equip.helm,target.id);assert(validSave(paid));
 console.log('Set sources: 20k forge +20k merchant batches zero sets, retired nodes rejected, synthetic area3 racial/slot/quality policy, old stock no-charge rejection and paid pending/owned sets preserved:',{gods,equipment,fruit,token});
}finally{Math.random=original;}
