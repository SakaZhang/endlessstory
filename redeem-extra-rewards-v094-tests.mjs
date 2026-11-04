import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
import {TEST_REDEEM_CODES,quoteRedeemCode,redeemCode} from './dist/redeem-codes.js';
import {createLegendaryEquipment,validLegendaryEquipmentMetadata} from './dist/legendary-equipment.js';
import {commitGameTransaction,loadProgress,SAVE_KEY} from './dist/storage.js';
import {BAG_LIMITS,INVENTORY_SAVE_LIMIT} from './dist/inventory-schema.js';
const copy=structuredClone;
const dice=(id,level=1)=>createLegendaryEquipment({id,legendaryId:'lucky-dice',level,baseLevel:level,levelSource:'generated',affixDefs:E.AFFIX_DEFS});
const originalRandom=Math.random;
try{
 for(const race of ['dwarf','elf','human','goblin','ashen'])for(const level of [1,33,100,99999]){
  const s=E.fresh(race);s.level=level;delete s.codexCollection;delete s.casino;
  assert(E.validSave(s),'pre-code saves remain valid');
  const before=copy(s);Math.random=()=>{throw Error('Test codes must not consume RNG');};
  for(const code of ['  gold100k\n','  luckydice\n'])assert(quoteRedeemCode(s,code).ok);
  assert.deepEqual(s,before,'quoting is pure');
  assert(redeemCode(s,'  gold100k\n'));assert.equal(s.gold,before.gold+100000);
  assert.deepEqual(s,{...before,gold:before.gold+100000},'gold only changes gold');
  assert(redeemCode(s,'  luckydice\n'));
  const it=s.inventory.at(-1);assert(validLegendaryEquipmentMetadata(it,E.AFFIX_DEFS));
  assert.deepEqual(it,dice(it.id,level));assert.equal(it.name,'幸运骰子');assert.equal(it.level,level);
  assert.equal(it.baseLevel,level);assert.equal(it.levelSource,'generated');assert.equal(it.exclusive.id,'lucky-dice-roll');
  assert.deepEqual([it.atk,it.hp,it.armor,it.affixes,it.special,it.set],[33,333,0,[],null,null]);
  assert.deepEqual(s.equip,before.equip,'never auto-equips');assert(s.codexCollection.legendaries.includes('lucky-dice'));
  assert.equal(s.casino,undefined,'no new casino or redeem ledger');assert(E.validSave(s));
  for(let n=0;n<9;n++){assert(redeemCode(s,'GOLD100K'));assert(redeemCode(s,'LUCKYDICE'));}
  assert.equal(s.gold,before.gold+1000000);assert.equal(s.inventory.length,before.inventory.length+10);
  assert.equal(new Set(s.inventory.map(it=>it.id)).size,s.inventory.length);assert(E.validSave(s));
  Math.random=originalRandom;
 }
 assert(Object.isFrozen(TEST_REDEEM_CODES));
 for(const code of ['GOLD100K','LUCKYDICE']){assert(TEST_REDEEM_CODES[code].testOnly);assert(TEST_REDEEM_CODES[code].repeatable);assert(Object.isFrozen(TEST_REDEEM_CODES[code]));}
 let s=E.fresh();s.gold=1e12-100000;assert(redeemCode(s,'GOLD100K'));assert.equal(s.gold,1e12);
 for(const gold of [1e12-99999,1e12]){s=E.fresh();s.gold=gold;const before=copy(s);assert.equal(quoteRedeemCode(s,'GOLD100K').reason,'gold-limit');assert(!redeemCode(s,'GOLD100K'));assert.deepEqual(s,before);}
 for(const gold of [NaN,Infinity,-1,1e12+1]){s=E.fresh();s.gold=gold;const before=copy(s);assert.equal(quoteRedeemCode(s,'GOLD100K').reason,'invalid-state');assert(!redeemCode(s,'GOLD100K'));assert.deepEqual(s,before);}
 s=E.fresh();s.inventory=Array.from({length:BAG_LIMITS.equipment-1},(_,i)=>dice('test-lucky-dice-'+(i+1)));
 assert(E.validSave(s));assert(redeemCode(s,'LUCKYDICE'));assert.equal(s.inventory.at(-1).id,'test-lucky-dice-50');
 let before=copy(s);assert.equal(quoteRedeemCode(s,'LUCKYDICE').reason,'amulet-capacity');assert(!redeemCode(s,'LUCKYDICE'));assert.deepEqual(s,before);assert(redeemCode(s,'GOLD100K'),'full amulet bag permits gold');
 s=E.fresh();const ring=E.item('ring',1,null,0);s.inventory=Array.from({length:INVENTORY_SAVE_LIMIT},(_,i)=>({...copy(ring),id:'ring-'+i}));
 assert(E.validSave(s));before=copy(s);assert.equal(quoteRedeemCode(s,'LUCKYDICE').reason,'amulet-capacity');assert(!redeemCode(s,'LUCKYDICE'));assert.deepEqual(s,before);
 s=E.fresh();s.pendingForgeClaim={kind:'equipment',item:dice('test-lucky-dice-1')};assert(E.validSave(s));assert(redeemCode(s,'LUCKYDICE'));assert.equal(s.inventory.at(-1).id,'test-lucky-dice-2');assert(E.validSave(s));
 for(const code of ['GOLD100K','LUCKYDICE']){
  for(const mode of ['rest','battle']){
   s=E.fresh();if(mode==='rest')E.startRest(s,1000);else assert(E.startRoutedEncounter(s,1000));
   before=copy(s);assert(redeemCode(s,code));
   for(const key of Object.keys(before).filter(k=>!['inventory','gold','codexCollection'].includes(k)))assert.deepEqual(s[key],before[key],mode+' '+key+' unchanged');
   assert(E.validSave(s));
  }
  s=E.fresh();delete s.codexCollection;const store=new Map([[SAVE_KEY,JSON.stringify(s)]]);let fail=true,candidate=null;
  const storage={getItem:k=>store.get(k)??null,setItem:(k,v)=>{if(fail){candidate=JSON.parse(v);throw Error('QuotaExceededError');}store.set(k,v);},removeItem:k=>store.delete(k),get length(){return store.size;},key:i=>[...store.keys()][i]};
  before=copy(s);const raw=store.get(SAVE_KEY);let tx=commitGameTransaction(storage,s,draft=>redeemCode(draft,code));
  assert(!tx.ok);assert.equal(tx.reason,'storage');assert.strictEqual(tx.game,s);assert.deepEqual(s,before);assert.equal(store.get(SAVE_KEY),raw);assert(E.validSave(candidate));
  fail=false;tx=commitGameTransaction(storage,s,draft=>redeemCode(draft,code));assert(tx.ok);assert(E.validSave(tx.game));
  const loaded=loadProgress(storage);assert(!loaded.blocked);assert(E.validSave(loaded.game));
  assert.equal(loaded.game.gold,before.gold+(code==='GOLD100K'?100000:0));assert.equal(loaded.game.inventory.length,before.inventory.length+(code==='LUCKYDICE'?1:0));
 }
 for(const code of ['',null,undefined,{},'GOLD10K','LUCKYDICE2','__proto__','constructor','<img onerror=alert(1)>']){s=E.fresh();before=copy(s);assert(!redeemCode(s,code));assert.deepEqual(s,before);}
 for(const code of ['GOLD100K','LUCKYDICE']){s=E.fresh();s.developmentEquipmentSandbox=true;before=copy(s);assert(!redeemCode(s,code));assert.deepEqual(s,before);}
 console.log('PASS v094 extra test codes: five races/four levels, canonical Dice and collection, no RNG, unlimited unique repeats, exact gold cap, amulet/global capacity, reserved IDs, unchanged rest/battle, old optional fields, quota rollback/retry/reload, invalid codes/state.');
}finally{Math.random=originalRandom;}
