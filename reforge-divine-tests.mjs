import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
const clone=structuredClone;
const setup=()=>{const s=E.fresh();s.consumables.reforgeToken=5;const it=E.item('gloves',15,null,3);it.bless=2;it.enhancement={version:1,model:'development-budget-v1',level:3};s.inventory.push(it);return {s,it};};
function rolls(values,fn){const old=Math.random;let calls=0;Math.random=()=>{const n=values[calls++]??.9;return n;};try{return {value:fn(),calls};}finally{Math.random=old;}}
// Dwarf q3 all: 4 types + 4 values + 4 combined-opportunity checks + 1 special, then one independent divine roll.
for(const accept of [false,true])for(const hit of [false,true]){
 const {s,it}=setup(),before=clone(it);const r=rolls([...Array(13).fill(.4),hit?.02:.033],()=>E.reforge(s,it.id,'all'));
 assert(r.value);assert.equal(r.calls,14);assert.equal(s.pendingReforge.ruleVersion,6);assert.equal(s.pendingReforge.oldDivine,null);assert.equal(!!s.pendingReforge.newDivine,hit);assert.deepEqual(it,before);assert.equal(s.consumables.reforgeToken,4);
 const loaded=JSON.parse(JSON.stringify(s));assert(E.validPendingReforge(loaded));assert(E.validSave(loaded));const preview=E.getPendingReforgeCandidate(loaded);assert.equal(!!preview.divine,hit);assert.notEqual(preview,loaded.inventory.at(-1));
 rolls([],()=>{const old=Math.random;Math.random=()=>{throw Error('decision must not roll');};try{assert(E.resolveReforge(loaded,accept,loaded.pendingReforge.operationId));}finally{Math.random=old;}});
 const result=loaded.inventory.find(x=>x.id===it.id);assert.equal(!!result.divine,accept&&hit);assert.equal(loaded.consumables.reforgeToken,4);assert.equal(E.resolveReforge(loaded,true,'stale'),null);
 for(const key of ['id','level','baseLevel','levelSource','slot','baseVariant','templateId','rarity','bless','enhancement','atk','armor','hp','legendaryId'])assert.deepEqual(result[key],before[key]);
 if(!accept)assert.deepEqual(result,before);if(accept&&hit){assert.equal(result.divine.bonus.atk,result.atk/10);result.affixes.forEach((a,i)=>assert.equal(result.divine.bonus.affixes[i].value,a.value/10));assert.equal(E.itemTotals(result).atk,result.atk*1.1+result.bless*2);}
}
{
 const {s,it}=setup();E.applyForgeFavor(it);const before=clone(it);const r=rolls(Array(13).fill(.4),()=>E.reforge(s,it.id,'all'));assert.equal(r.calls,13);assert(E.validPendingReforge(s));assert(E.resolveReforge(s,true,s.pendingReforge.operationId));assert.equal(it.atk,before.atk);assert.equal(it.divine.bonus.atk,it.atk/10);assert.equal(it.divine.bonus.affixes[0].value,it.affixes[0].value/10);
}
// v0.37: value opportunity merged once; divine gets its existing luck then one racial multiplier.
for(const luck of [0,10])for(const delta of [-.000001,0,.000001]){
 const threshold=.03*(1+.20*luck/(luck+5))*1.10,favor=threshold+delta;
 const {s,it}=setup();s.talents.luck=luck;s.bonusTalentPoints=10;const count=13;
 const r=rolls([...Array(count).fill(.9),favor],()=>E.reforge(s,it.id,'all'));assert.equal(r.calls,count+1);assert.equal(!!s.pendingReforge.newDivine,delta<0);
}
// Old pending all records preserve their original semantics and never acquire new favor.
for(const legacy of [undefined,2]){
 const {s,it}=setup();const legacyAffix=a=>({stat:a.stat,value:Math.min(E.AFFIX_DEFS[a.stat].max,Math.max(E.AFFIX_DEFS[a.stat].min,a.value))});it.affixes=it.affixes.map(legacyAffix);rolls(Array(10).fill(.9),()=>E.reforge(s,it.id,'all'));s.pendingReforge.newAffixes=s.pendingReforge.newAffixes.map(legacyAffix);s.pendingReforge.ruleVersion=legacy;delete s.pendingReforge.oldDivine;delete s.pendingReforge.newDivine;
 if(legacy===undefined)s.pendingReforge.cost={gold:110,materials:{'铁屑':3,'炉火晶':2}};
 assert(E.validPendingReforge(s));const old=Math.random;Math.random=()=>{throw Error('legacy must not reroll');};try{assert(E.resolveReforge(s,true,s.pendingReforge.operationId));assert(!it.divine);}finally{Math.random=old;}
}
// Strict metadata and old-side binding: a modified raw bonus or mismatched target is invalid.
{
 const {s,it}=setup();rolls(Array(18).fill(0),()=>E.reforge(s,it.id,'all'));assert(s.pendingReforge.newDivine);
 for(const mutate of [p=>p.newDivine.bonus.atk*=2,p=>p.newDivine.bonus.affixes[0].value+=1,p=>p.newDivine.multiplier=100,p=>p.oldDivine=clone(p.newDivine),p=>p.newDivine.model='boosted',p=>p.ruleVersion=4]){
  const bad=clone(s);mutate(bad.pendingReforge);assert(!E.validPendingReforge(bad));assert(!E.validSave(bad));assert.equal(E.getPendingReforgeCandidate(bad),null);assert.equal(E.resolveReforge(bad,true,bad.pendingReforge.operationId),null);
 }
 const bad=clone(s);bad.inventory.find(x=>x.id===it.id).atk++;assert(!E.validPendingReforge(bad));
}
console.log('PASS production rule5 divine: hit/miss, independent luck, existing no roll, immutable pending target, accept/keep/reload/legacy, raw metadata validation, identity and enhancement preserved');
