import assert from 'node:assert/strict';
import {fresh,item,stats,itemTotals,validSave,applyForgeFavor,quoteDeveloperEnhancement,prepareDeveloperEnhancement,attemptDeveloperEnhancement,enhancedItemBase,DEVELOPMENT_ENHANCEMENT_CONFIG} from './dist/engine.js';
import {commitGameTransaction} from './dist/storage.js';
const clone=x=>structuredClone(x);
// Synthetic raw-base edge cases model pre-M2 owned gear, not altered formal budgets.
const legacyBudget=it=>{for(const key of ['baseBudgetModel','budgetLevel','budgetSourceLevel','budgetCompatibility'])delete it[key];return it;};
function setup(){const s=fresh();s.developmentEquipmentSandbox=true;s.gold=10000;return s;}
{
 const s=fresh(),it=s.inventory[0];it.bless=0;const before=clone(it),tot=itemTotals(it);assert.equal(quoteDeveloperEnhancement(s,it.id).ok,false);assert.deepEqual(itemTotals(it),tot);assert.deepEqual(it,before);assert(validSave(s));
}
{
 const s=setup(),it=s.inventory[0];it.bless=0;it.locked=true;applyForgeFavor(it);const raw=clone(it),formal=itemTotals(it),affix=clone(it.affixes);let previous=stats(s).atk;
 for(let level=0;level<5;level++){const q=quoteDeveloperEnhancement(s,it.id);assert(q.ok);assert.equal(q.successRate,DEVELOPMENT_ENHANCEMENT_CONFIG.successRates[level]);const gold=s.gold;const receipt=attemptDeveloperEnhancement(s,q,()=>0);assert(receipt.success);assert.equal(it.enhancement,undefined,'original object remains untouched by clone adoption');const owned=s.inventory[0];assert.equal(owned.enhancement.level,level+1);assert.equal(s.gold,gold-q.cost.gold);assert.equal(owned.atk,raw.atk);assert.equal(owned.armor,raw.armor);assert.equal(owned.hp,raw.hp);assert.deepEqual(owned.affixes,affix);assert.equal(owned.bless,0);assert.deepEqual(itemTotals(owned),formal,'formal default ignores candidate');assert(stats(s).atk>=previous);previous=stats(s).atk;assert.equal(attemptDeveloperEnhancement(s,q,()=>0),null);assert(validSave(s));}
 assert(!quoteDeveloperEnhancement(s,it.id).ok);assert.equal(enhancedItemBase({...s.inventory[0],armor:0},{development:true}).armor,0);const saved=JSON.parse(JSON.stringify(s));assert.deepEqual(stats(saved),stats(s),'reload never compounds');assert.deepEqual(saved.inventory[0].divine,raw.divine);
}
{
 const s=setup(),id=s.inventory[0].id;for(const level of [0,1,4]){s.inventory[0].enhancement={version:1,model:'development-budget-v1',level};const q=quoteDeveloperEnhancement(s,id),gold=s.gold,r=attemptDeveloperEnhancement(s,q,()=>.999);assert(!r.success);assert.equal(r.toLevel,Math.max(0,level-1));assert.equal(s.gold,gold-q.cost.gold);}
 s.pendingReforge={itemId:id};assert(!quoteDeveloperEnhancement(s,id).ok);delete s.pendingReforge;s.running=true;assert(!quoteDeveloperEnhancement(s,id).ok);
}
{
 const s=setup(),id=s.inventory[0].id,q=quoteDeveloperEnhancement(s,id);let calls=0,fail=true,raw;const rng=()=>{calls++;return .01;},storage={setItem(k,v){if(fail)throw Error('quota');raw=v;}};const original=clone(s);
 let tx=commitGameTransaction(storage,s,x=>attemptDeveloperEnhancement(x,q,rng));assert(!tx.ok);assert.deepEqual(s,original);assert.equal(calls,1);fail=false;tx=commitGameTransaction(storage,s,x=>attemptDeveloperEnhancement(x,q,rng));assert(tx.ok);assert.equal(calls,1,'retry reuses prepared roll');assert.equal(tx.game.inventory[0].enhancement.level,1);assert.equal(JSON.parse(raw).inventory[0].enhancement.level,1);assert.equal(attemptDeveloperEnhancement(tx.game,q,rng),null);
 const stale=clone(s);stale.inventory[0].atk++;assert(!prepareDeveloperEnhancement(stale,q,()=>{throw Error('must not roll');}).ok);
}
console.log('Developer enhancement: formal current raw untouched,5 probabilities/failure downgrade/cost once/raw zeros/divine-affix preservation/reload/atomic retry passed');
{
 const s=setup(),q=quoteDeveloperEnhancement(s,s.inventory[0].id);let count=0;const rng=()=>{count++;return .05;};const first=prepareDeveloperEnhancement(s,q,rng);assert(first.ok);s.lastSeen+=30000;s.lastHealthClock=(s.lastHealthClock??0)+30000;s.heroHp=17;s.inventory.push(item('ring'));const second=prepareDeveloperEnhancement(s,q,rng);assert(second.ok);assert.equal(count,1);assert.equal(second.state.lastSeen,s.lastSeen);assert.equal(second.state.lastHealthClock,s.lastHealthClock);assert.equal(second.state.heroHp,17);assert.equal(second.state.inventory.length,s.inventory.length);assert.deepEqual(second.receipt,first.receipt);
}
console.log('Enhancement quote survives unrelated clocks/HP/loot and cached retry rebases without rollback');
{
 const s=fresh();for(const it of s.inventory){legacyBudget(it);for(const key of ['templateId','baseVariant','weaponType','originRace','visualKey','visualVariant','iconKey'])delete it[key];}const before=clone(s);assert(!validSave(s));assert.deepEqual(s,before);
 const bad=fresh();bad.inventory[0].enhancement={version:1,model:'development-budget-v1',level:6};assert(!validSave(bad));
}
console.log('Retired equipment metadata rejected without mutation; current candidate metadata remains bounded');
