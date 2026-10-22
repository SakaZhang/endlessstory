import assert from 'node:assert/strict';
import {fresh,forge,ensureMerchant,item,validSave,purchaseEquipment,isMerchantEquipmentSellable,rollSourceSet,claimForgeResult,applyForgeFavor,saveLoadout,equipItem,reforge,resolveReforge,stats,sellValue,normalizeHealth,startInstanceEncounter,startRoutedEncounter,reward,INSTANCES,SET_SLOTS} from './dist/engine.js';
const original=Math.random;let seed=5102;const rng=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/2**32;};Math.random=rng;
try{
 const s=fresh();s.gold=1e9;s.materialStacks['铁屑|0']=100000;let gods=0;const qualities=new Set();
 for(let i=0;i<20000;i++){const gold=s.gold,it=forge(s,['铁屑|0']);assert.equal(it.set,null);assert.equal(s.gold,gold-40);qualities.add(it.rarity);gods+=!!it.divine;s.inventory.pop();}assert.equal(qualities.size,4);assert(gods>450&&gods<750);
 let equipment=0,fruit=0,token=0;for(let i=0;i<20000;i++){const p=fresh(),m=ensureMerchant(p,1000);assert.equal(m.offers.length,8);fruit+=m.offers.some(o=>o.consumable==='memoryFruit');token+=m.offers.some(o=>o.consumable==='reforgeToken');for(const o of m.offers.filter(o=>o.type==='equipment')){equipment++;assert.equal(o.item.set,null);assert(isMerchantEquipmentSellable(o));}}
 assert(equipment>80000);assert(fruit>450&&fruit<750);assert(token>1750&&token<2250);
 // Future policy is exercised synthetically; no future playable location is registered.
 for(const kind of ['dungeon','boss']){let count=0;const sets=new Set(),slots=new Set();for(let i=0;i<20000;i++){const result=rollSourceSet({source:'drop',kind,areaNumber:3,race:'dwarf'},rng);if(result){count++;sets.add(result.set);slots.add(result.slot);assert.equal(result.rarity,3);assert(SET_SLOTS.includes(result.slot));}}assert.equal(sets.size,3);assert.equal(slots.size,4);assert(count>(kind==='boss'?800:450)&&count<(kind==='boss'?1200:750));}
 let draws=0;const zero=()=>{draws++;return 0;};
 for(const source of ['forge','merchant','drop'])for(const areaNumber of [1,2,3])for(const kind of ['field','dungeon','boss']){
  if(source==='drop'&&areaNumber===3&&kind!=='field')continue;const before=draws;assert.equal(rollSourceSet({source,kind,areaNumber,race:'dwarf'},zero),null);assert.equal(draws,before);
 }
 assert.equal(rollSourceSet({source:'drop',kind:'boss',areaNumber:3,race:'elf'},zero),null);
 Math.random=()=>0;const forced=fresh();assert.equal(forge(forced,['铁屑|0']).set,null);assert(ensureMerchant(fresh(),1000).offers.filter(o=>o.type==='equipment').every(o=>!o.item.set));
 // Every actual field, normal stage and boss is area1 and yields no sets.
 for(const instance of Object.values(INSTANCES)){const p=fresh();normalizeHealth(p,0);let e=startInstanceEncounter(p,instance.id,0),time=100;assert(e);for(let stage=1;stage<=(instance.kind==='dungeon'?3:1);stage++){e.done=true;e.win=true;const drop=reward(p,e,time);assert(drop);assert.equal(drop.set,null);if(stage<3&&instance.kind==='dungeon'){time+=1900;e=startRoutedEncounter(p,time);assert(e);}}assert(validSave(p));}
 // Old pre-generated set stock remains unchanged, but cannot be purchased.
 const merchant=fresh();merchant.gold=10000;const m=ensureMerchant(merchant,1000),offer=m.offers.find(o=>o.type==='equipment');offer.item=item('helm',offer.item.level,'anvil',3,{levelSource:'merchant'});offer.price=15+sellValue(offer.item)*4+offer.item.level*3;const snapshot=JSON.stringify(merchant);assert(validSave(merchant));assert(!isMerchantEquipmentSellable(offer));assert(!purchaseEquipment(merchant,offer.offerId,m.revision,1001));assert.equal(JSON.stringify(merchant),snapshot);
 // Previously paid, pending set output remains claimable with the same ID/divine data.
 const old=fresh(),legacySet=item('helm',1,'rune',3,{levelSource:'material'});applyForgeFavor(legacySet);old.pendingForgeClaim={kind:'equipment',item:legacySet};const identity=JSON.stringify(legacySet);assert(validSave(old));const paid=JSON.parse(JSON.stringify(old));assert.equal(JSON.stringify(claimForgeResult(paid)),identity);assert(validSave(paid));assert.equal(claimForgeResult(paid),null);
 assert(equipItem(paid,legacySet.id));assert(saveLoadout(paid,0,'保留旧套装'));const target=paid.inventory.find(i=>i.id===legacySet.id),base=JSON.stringify(target),beforeStats=JSON.stringify(stats(paid));paid.gold=1000;assert(reforge(paid,target.id,'value',0));assert.equal(JSON.stringify(target),base);assert.equal(JSON.stringify(stats(paid)),beforeStats);assert(resolveReforge(paid,false));assert.equal(JSON.stringify(target),base);assert.equal(paid.loadouts[0].equip.helm,target.id);assert(validSave(paid));
 console.log('Set sources: 20k forge +20k merchant batches zero sets, current all nodes zero, synthetic area3 racial/slot/quality policy, old stock no-charge rejection and paid pending/owned sets preserved:',{gods,equipment,fruit,token});
}finally{Math.random=original;}
