import assert from 'node:assert/strict';
import {fresh,MATERIALS,validSave,startRest} from './dist/engine.js';
import {INFINITY_GAUNTLET_MATERIALS} from './dist/infinity-gauntlet-content.js';
import {TEST_REDEEM_CODES,checkRedeemCapacity,quoteRedeemCode,redeemCode} from './dist/redeem-codes.js';
import {commitGameTransaction,SAVE_KEY} from './dist/storage.js';
const rewards=TEST_REDEEM_CODES.INFINITY5.rewards,keys=rewards.map(r=>r.key);
assert.deepEqual(rewards.map(r=>r.material),INFINITY_GAUNTLET_MATERIALS.map(r=>r.material));
assert(rewards.every(r=>r.quality===3&&r.count===1&&r.name===MATERIALS[r.material].name));
let s=fresh(),before=structuredClone(s);const originalRandom=Math.random;Math.random=()=>{throw Error('redemption must not use RNG')};
assert(quoteRedeemCode(s,'  infinity5\n').ok);assert.deepEqual(s,before);
for(const code of ['',null,'INFINITY6','__proto__','<img src=x onerror=alert(1)>']){assert(!redeemCode(s,code));assert.deepEqual(s,before);}
assert(redeemCode(s,'INFINITY5'));assert(redeemCode(s,' infinity5 '));assert(keys.every(k=>s.materialStacks[k]===2));
assert.equal(s.gold,before.gold);assert.deepEqual(s.inventory,before.inventory);assert.deepEqual(s.infinityGauntlet,before.infinityGauntlet);assert(validSave(s));
// All real catalog stacks fit today; future generic stack boundary is checked separately.
const allKeys=Array.from({length:1000},(_,i)=>'future-'+i+'|0');
s={materialStacks:Object.fromEntries(allKeys.slice(0,997).map(k=>[k,1]))};s.materialStacks[keys[0]]=1;before=structuredClone(s);assert.equal(checkRedeemCapacity(s),'capacity');assert.deepEqual(s,before);
s.materialStacks=Object.fromEntries(allKeys.slice(0,995).map(k=>[k,1]));assert.equal(checkRedeemCapacity(s),null);for(const k of keys)s.materialStacks[k]=1;assert.equal(checkRedeemCapacity(s),null,'full bag permits existing stacks');
s=fresh();
s.materialStacks[keys[4]]=1e12;before=structuredClone(s);assert.equal(quoteRedeemCode(s,'INFINITY5').reason,'quantity-limit');assert(!redeemCode(s,'INFINITY5'));assert.deepEqual(s,before);
s=fresh();startRest(s,1000);before=structuredClone(s);assert(redeemCode(s,'INFINITY5'));for(const key of Object.keys(before).filter(k=>!['materialStacks','regionNavigation'].includes(k)))assert.deepEqual(s[key],before[key],key+' unchanged');
const store=new Map([[SAVE_KEY,JSON.stringify(s)]]),storage={setItem(){throw Error('QuotaExceededError')}};before=structuredClone(s);let tx=commitGameTransaction(storage,s,draft=>redeemCode(draft,'INFINITY5'));assert.equal(tx.reason,'storage');assert.strictEqual(tx.game,s);assert.deepEqual(s,before);
storage.setItem=(k,v)=>store.set(k,v);tx=commitGameTransaction(storage,s,draft=>redeemCode(draft,'INFINITY5'));assert(tx.ok);assert(keys.every(k=>JSON.parse(store.get(SAVE_KEY)).materialStacks[k]===2));assert(validSave(tx.game));Math.random=originalRandom;
console.log('PASS redemption catalog, normalization, invalid/RNG purity, repeat, capacity bundle, quantity ceiling, rest, quota rollback and reload.');
