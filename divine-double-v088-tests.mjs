import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
import {currentAffix} from './current-equipment-test-fixture.mjs';
import {growthBonuses} from './dist/special-affix-growth.js';
const clone=structuredClone;
function oldDivine(it){it.divine={id:'forge-favor',name:'神赐·炉火眷顾',model:'raw-v1',bonus:{atk:it.atk/10,armor:it.armor/10,hp:it.hp/10,affixes:it.affixes.map(a=>({stat:a.stat,value:a.value/10}))}};return it;}
function setup(race='human',legacy=false){const s=E.fresh(race);s.gold=100000;s.consumables.reforgeToken=10;const it=E.item('weapon',30,null,3,{originRace:race});it.special={id:'harvester',growthKills:123};s.inventory.push(it);if(legacy)oldDivine(it);else E.applyForgeFavor(it);return {s,it};}
function fixed(fn){const old=Math.random;Math.random=()=>.4;try{return fn();}finally{Math.random=old;}}
// Formula order and exclusions, independent of item budget generation.
for(const model of ['raw-v1','raw-v2']){
 const it={atk:120,hp:106,armor:20,affixes:[{stat:'crit',value:10}],enhancement:{version:2,model:'equipment-budget-m2-v1',level:3}};
 if(model==='raw-v1')oldDivine(it);else E.applyForgeFavor(it);
 const before=JSON.stringify(it);assert.equal(E.divineMultiplier(it),2);assert.deepEqual(E.itemTotals(it),{atk:276,hp:244,armor:46});assert.equal(it.affixes[0].value*E.divineMultiplier(it),20);
 for(let i=0;i<5;i++){assert.equal(E.itemTotals(JSON.parse(JSON.stringify(it))).atk,276);assert.equal(E.applyForgeFavor(it),false);}assert.equal(JSON.stringify(it),before);
}
for(const model of ['bad','raw-v0',undefined])assert.equal(E.divineMultiplier({divine:{id:'forge-favor',model}}),1);
for(const race of ['dwarf','human','elf','goblin','ashen'])for(const legacy of [false,true]){
 const {s,it}=setup(race,legacy);assert(E.validSave(s));for(const key of Object.keys(s.equip))s.equip[key]=null;s.equip.weapon=it.id;
 const withGrowth=E.stats(s);it.special={id:'harvester',growthKills:0};const without=E.stats(s);assert.equal(withGrowth.atk-without.atk,246,'v090 divine doubles effective growth without rewriting counters');it.special={id:'harvester',growthKills:123};
 const expected={};for(const a of it.affixes)expected[a.stat]=(expected[a.stat]??0)+a.value*2;for(const [key,value]of Object.entries(expected))if(!['atk','luck','lifesteal'].includes(key))assert.equal(E.baseStats(s).bonus[key],value);
 const before=JSON.stringify(it);const stored=JSON.parse(JSON.stringify(s));assert(E.validSave(stored));assert.deepEqual(E.stats(stored),E.stats(s));assert.equal(JSON.stringify(it),before);
}
// Historical pending snapshots remain acceptable and never pay a second time.
for(const legacy of [false,true])for(const mode of ['all','value'])for(const accept of [false,true]){
 const {s,it}=setup('human',legacy);s.materialStacks['铁屑|0']=100;
 if(mode==='value'){const quote=E.getReforgeCost(it,mode,s);for(const name of Object.keys(quote.materials))s.materialStacks[`${name}|0`]=100;}
 const result=fixed(()=>E.reforge(s,it.id,mode,0));assert(result,`prepare ${mode}/${legacy}`);
 if(legacy&&mode==='all'){
  const candidate=clone(it);candidate.affixes=clone(s.pendingReforge.newAffixes);oldDivine(candidate);s.pendingReforge.oldDivine=clone(it.divine);s.pendingReforge.newDivine=clone(candidate.divine);
 }
 assert(E.validPendingReforge(s));assert(E.validSave(s));const before=clone(it),cost=JSON.stringify({gold:s.gold,materials:s.materialStacks,tokens:s.consumables});
 const restored=JSON.parse(JSON.stringify(s)),candidate=E.getPendingReforgeCandidate(restored);assert(candidate);assert.equal(E.itemTotals(candidate).atk,E.itemTotals(it).atk);assert.deepEqual(candidate.special,it.special);
 assert(E.resolveReforge(restored,accept,restored.pendingReforge.operationId));const adopted=restored.inventory.find(x=>x.id===it.id);assert.equal(E.divineMultiplier(adopted),2);assert.deepEqual(adopted.special,before.special);assert.equal(adopted.atk,before.atk);assert.equal(JSON.stringify({gold:restored.gold,materials:restored.materialStacks,tokens:restored.consumables}),cost);assert(E.validSave(restored));if(!accept)assert.deepEqual(adopted,before);
 assert.equal(E.resolveReforge(restored,true,'stale'),null);
}
// Exact donor inheritance remains raw, with one multiplier on the recipient.
for(const legacy of [false,true]){
 const {s,it}=setup('human',legacy),donor=clone(it);donor.id+='-donor';delete donor.divine;donor.special={id:'knowledge'};s.inventory.push(donor);
 const raw=clone(donor.affixes[0]);assert(fixed(()=>E.reforge(s,it.id,'replace',0,donor.id)));assert(E.validSave(s));assert.deepEqual(s.pendingReforge.newAffixes[0],raw);assert(E.resolveReforge(s,true));assert.deepEqual(it.affixes[0],raw);assert.equal(E.divineMultiplier(it),2);assert.deepEqual(it.special,{id:'harvester',growthKills:123});assert(E.validSave(s));
}
for(const [id,kills,stat,expected]of [['harvester',123,'atk',123],['blesser',123,'luck',12.3],['glutton',123,'lifesteal',123]]){
 const {it}=setup();it.special={id,growthKills:kills};assert.equal(growthBonuses(it)[stat],expected*2);const prior=clone(it.special);E.itemTotals(it);assert.deepEqual(it.special,prior);
}
// Preserve exact historical /10 receipt arithmetic after single-affix operations.
{
 const s=E.fresh('human');s.gold=100000;s.materialStacks['铁屑|0']=100;s.consumables.reforgeToken=10;
 const it=E.item('gloves',1,null,0),donor=E.item('gloves',1,null,0);it.affixes=[currentAffix('atk',3)];donor.affixes=[currentAffix('atk',3)];oldDivine(it);s.inventory.push(it,donor);
 assert(fixed(()=>E.reforge(s,it.id,'replace',0,donor.id)));assert(E.resolveReforge(s,true));assert.equal(it.divine.bonus.affixes[0].value,.3);assert(fixed(()=>E.reforge(s,it.id,'all')),'legacy donor apply must not block later full reforge');assert(E.resolveReforge(s,false));
}
// Applying divine cannot alter fixed set/exclusive payloads.
for(const props of [{set:'sentinel-set'},{legendaryId:'infinity-gauntlet',exclusive:{id:'infinity',percent:50}}]){
 const it={atk:120,hp:106,armor:20,affixes:[{stat:'crit',value:10}],...props};const before=clone(props);E.applyForgeFavor(it);for(const key of Object.keys(props))assert.deepEqual(it[key],before[key]);assert.equal(E.itemTotals(it).atk,240);
}
console.log('PASS v088 divine doubled: formula order, old/new raw formats, all5race aggregates, effective growth, reload idempotence, legacy pending accept/keep and resource conservation');
