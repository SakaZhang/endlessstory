import assert from 'node:assert/strict';
import vm from 'node:vm';
import {fresh,item,quoteBatchSale,executeBatchSale,validSave,equipItem,saveLoadout,reforge,claimForgeResult,codexSetState,sellValue} from './dist/engine.js';
import {commitGameTransaction} from './dist/storage.js';
const original=Math.random;Math.random=()=>.5;
const add=(s,slot='ring',rarity=0,set=null)=>{const it=item(slot,3,set,rarity);s.inventory.push(it);return it;};
try{
 const s=fresh(),gold=s.gold;for(let q=0;q<4;q++)add(s,'ring',q);add(s,'weapon',0);const locked=add(s);locked.locked=true;
 assert.equal(quoteBatchSale(s,'ring',[]).count,0);assert.equal(executeBatchSale(s,quoteBatchSale(s,'ring',[])),null);for(const bad of [[0,0],[-1],[4],null,['0'],Array(1)])assert.equal(quoteBatchSale(s,'ring',bad),null);assert.equal(quoteBatchSale(s,'ring1',[0]),null);
 const beforeQuote=JSON.stringify(s),quote=quoteBatchSale(s,'ring',[3,0,2,1]);assert.equal(JSON.stringify(s),beforeQuote);assert.deepEqual(quote.qualities,[0,1,2,3]);assert.equal(quote.count,4);assert.equal(quote.total,quote.entries.reduce((n,e)=>n+e.value,0));assert(quote.entries.every(e=>e.fingerprint.includes('"slot":"ring"')));
 const later=add(s,'ring',0),soldIds=quote.entries.map(e=>e.id),out=executeBatchSale(s,quote);assert(out.ok);assert.equal(out.count,4);assert.equal(out.total,quote.total);assert.equal(s.gold,gold+quote.total);assert(s.inventory.some(it=>it.id===later.id));assert(s.inventory.some(it=>it.id===locked.id));assert(soldIds.every(id=>!s.inventory.some(it=>it.id===id)));assert(validSave(s));const once=JSON.stringify(s);assert.equal(executeBatchSale(s,quote),null);assert.equal(JSON.stringify(s),once);
 // A set is not blanket-excluded; history is captured before the old piece disappears.
 const sets=fresh(),piece=add(sets,'gloves',3,'rune');const setQuote=quoteBatchSale(sets,'gloves',[3]);assert.equal(setQuote.count,1);assert.equal(sets.codexCollection,undefined);assert(executeBatchSale(sets,setQuote));assert(!sets.inventory.some(it=>it.id===piece.id));assert.deepEqual(codexSetState(sets,'rune').parts,['gloves']);assert(validSave(sets));
 // Equipped, loadout and pending-reforge references are all protected.
 const protectedState=fresh(),equipped=add(protectedState,'helm'),cabinet=add(protectedState,'boots'),pending=add(protectedState,'weapon',1);assert(equipItem(protectedState,equipped.id));assert(equipItem(protectedState,cabinet.id));assert(saveLoadout(protectedState,0,'柜'));assert(equipItem(protectedState,protectedState.inventory.find(i=>i.slot==='boots'&&i.id!==cabinet.id).id));assert(reforge(protectedState,pending.id,'value',0));assert(!quoteBatchSale(protectedState,'helm',[0]).entries.some(e=>e.id===equipped.id));assert(!quoteBatchSale(protectedState,'boots',[0]).entries.some(e=>e.id===cabinet.id));assert(!quoteBatchSale(protectedState,'weapon',[1]).entries.some(e=>e.id===pending.id));
 // Any one stale item invalidates the whole quote, not a hidden subset.
 for(const mutate of [
  (p,it)=>it.atk++,(p,it)=>it.name+='改',(p,it)=>it.affixes.push({stat:'hp',value:15}),(p,it)=>it.locked=true,
  (p,it)=>it.level+=3,(p,it)=>it.bless++,(p,it)=>{p.inventory=p.inventory.filter(x=>x.id!==it.id);},
  (p,it)=>equipItem(p,it.id),(p,it)=>{equipItem(p,it.id);saveLoadout(p,0,'新保护');}
 ]){
  const p=fresh(),first=add(p),second=add(p);const q=quoteBatchSale(p,'ring',[0]);mutate(p,first);const before=JSON.stringify(p);assert.equal(executeBatchSale(p,q),null);assert.equal(JSON.stringify(p),before);assert(p.inventory.some(x=>x.id===second.id));
 }
 for(const mutate of [
  q=>q.entries.push({...q.entries[0]}),q=>q.entries[0].value++,q=>q.total++,q=>q.count++,q=>q.slot='weapon',q=>q.qualities=[1],
  q=>q.entries[0].fingerprint+='x',q=>q.version=2,q=>q.extra=true,q=>q.entries[0].id='missing',q=>q.entries[0].value=NaN,q=>{q.entries=Array(1);q.count=1;q.total=0;}
 ]){
  const p=fresh();add(p);const q=quoteBatchSale(p,'ring',[0]);mutate(q);const before=JSON.stringify(p);assert.equal(executeBatchSale(p,q),null);assert.equal(JSON.stringify(p),before);
 }
 const serial=fresh(),optional=add(serial,'weapon');optional.divine=undefined;optional.extraOptional=undefined;assert(quoteBatchSale(serial,'weapon',[0]));const crossRealm=vm.runInNewContext('JSON.parse(raw)',{raw:JSON.stringify(serial)});assert(quoteBatchSale(crossRealm,'weapon',[0]));assert.equal(JSON.stringify(quoteBatchSale(serial,'weapon',[0]).entries),JSON.stringify(quoteBatchSale(crossRealm,'weapon',[0]).entries));
 const overflow=fresh();add(overflow);overflow.gold=1e12;const oq=quoteBatchSale(overflow,'ring',[0]),overflowBefore=JSON.stringify(overflow);assert.equal(executeBatchSale(overflow,oq),null);assert.equal(JSON.stringify(overflow),overflowBefore);
 // Save failure adopts neither proceeds/removal nor newly backfilled ledger; retry same quote works.
 let fail=true,raw=null;const storage={setItem(k,value){if(fail)throw Error('quota');raw=value;}};
 const atomic=fresh(),oldSet=add(atomic,'boots',3,'guard'),aq=quoteBatchSale(atomic,'boots',[3]),originalState=JSON.stringify(atomic);
 let tx=commitGameTransaction(storage,atomic,p=>executeBatchSale(p,aq),{now:100});assert(!tx.ok);assert.equal(tx.reason,'storage');assert.equal(JSON.stringify(atomic),originalState);assert.equal(atomic.codexCollection,undefined);assert.equal(raw,null);
 fail=false;tx=commitGameTransaction(storage,atomic,p=>executeBatchSale(p,aq),{now:100});assert(tx.ok);assert.equal(JSON.stringify(atomic),originalState);assert(!tx.game.inventory.some(it=>it.id===oldSet.id));assert.deepEqual(codexSetState(tx.game,'guard').parts,['boots']);assert.equal(tx.game.gold,atomic.gold+sellValue(oldSet));assert(validSave(JSON.parse(raw)));
 // Claim-ledger persistence regression: failed save cannot adopt a collection discovery.
 const claim=fresh();claim.pendingForgeClaim={kind:'equipment',item:item('helm',1,'anvil',3)};const claimBefore=JSON.stringify(claim);fail=true;const denied=commitGameTransaction(storage,claim,p=>claimForgeResult(p),{now:100});assert(!denied.ok);assert.equal(JSON.stringify(claim),claimBefore);assert(!codexSetState(claim,'anvil').discovered);fail=false;const accepted=commitGameTransaction(storage,claim,p=>claimForgeResult(p),{now:100});assert(accepted.ok);assert.deepEqual(codexSetState(accepted.game,'anvil').parts,['helm']);
 console.log('Batch sale: current family/qualities only, full fingerprints and exact quoted IDs, all protections, late loot preserved, stale/malformed/overflow all-or-nothing, set codex retention, save-failure rollback/retry; claim ledger atomicity: PASS');
}finally{Math.random=original;}
