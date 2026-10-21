import assert from 'node:assert/strict';
import {fresh,item,reforge,resolveReforge,getReforgeCost,stats,validSave,isProtected,applyForgeFavor,equipItem,saveLoadout} from './dist/engine.js';
const rng=Math.random;Math.random=()=>.99;
try{
 for(const mode of ['value','replace','all']){
  const s=fresh();s.gold=10000;s.materialStacks={'铁屑|0':100,'炉火晶|0':100};const it=item('weapon',1,null,2);it.affixes=[{stat:'atk',value:3},{stat:'hp',value:15},{stat:'crit',value:5}];it.special={id:'knowledge'};it.locked=true;applyForgeFavor(it);s.inventory.push(it);equipItem(s,it.id);saveLoadout(s,0,'a');saveLoadout(s,1,'b');
  const old=structuredClone(it),oldStats=stats(s),gold=s.gold,cost=getReforgeCost(it,mode),r=reforge(s,it.id,mode,0);
  assert(r?.pending);assert.deepEqual(it,old);assert.deepEqual(stats(s),oldStats);assert.equal(s.gold,gold-cost.gold);assert(isProtected(s,it.id));assert(validSave(s));
  const snapshot=JSON.stringify(s);assert.equal(reforge(s,it.id,mode,0),null);assert.equal(JSON.stringify(s),snapshot);
  const restored=JSON.parse(snapshot);assert(validSave(restored));assert.deepEqual(restored.pendingReforge.newAffixes,r.after);
  assert.equal(resolveReforge(restored,true,'stale'),null);assert.equal(JSON.stringify(restored),snapshot);
  restored.running=true;assert.equal(resolveReforge(restored,true,r.operationId),null);restored.running=false;
  assert(resolveReforge(restored,true,r.operationId));assert.equal(restored.gold,gold-cost.gold);assert.deepEqual(restored.inventory.find(x=>x.id===it.id).affixes,r.after);assert.equal(restored.inventory.find(x=>x.id===it.id).special.id,'knowledge');
  assert.equal(restored.loadouts[0].equip.weapon,restored.loadouts[1].equip.weapon);assert.equal(restored.inventory.filter(x=>x.id===it.id).length,1);
  const accepted=JSON.stringify(restored);assert.equal(resolveReforge(restored,true,r.operationId),null);assert.equal(JSON.stringify(restored),accepted);assert(validSave(restored));
  s.running=true;assert(resolveReforge(s,false,r.operationId));assert.deepEqual(it,old);assert.equal(s.gold,gold-cost.gold);
  for(const mutate of [
   x=>x.pendingReforge.oldAffixes[0].value++,
   x=>x.pendingReforge.newAffixes[0].value=999,
   x=>x.pendingReforge.newAffixes[0].stat='bad',
   x=>x.pendingReforge.cost.gold=0,
   x=>x.pendingReforge.itemId='missing',
   x=>x.pendingReforge.newAffixes.pop()
  ]){const bad=JSON.parse(snapshot);mutate(bad);assert(!validSave(bad));}
 }
 const x=fresh();assert(validSave(x));assert.equal(resolveReforge(x,true),null);
}finally{Math.random=rng;}
console.log('Pending reforge: once-only costs, persistent candidate, old stats until choice, stale/double guards, combat acceptance gate, divine/shared IDs and malformed save rejection: PASS');
