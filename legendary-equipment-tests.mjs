import {levelAffixRange} from './dist/affix-level-budget.js';
import assert from 'node:assert/strict';
import {createLegendaryEquipment as create,legendaryIdentitySnapshot} from './dist/legendary-equipment.js';
import {deriveEquipmentBase,affixRange} from './dist/equipment-budget.js';
const definition={id:'fixture-hammer',ready:true,name:'测试锤',slot:'weapon',baseVariant:'hammer_balanced',exclusiveId:'fixture-echo',originRace:'dwarf',weaponType:'hammer'};
const affixDefs={hp:{min:15,max:40},atk:{min:2,max:7},armor:{min:3,max:8},luck:{min:1,max:3},crit:{min:3,max:9}};
const args={id:'owned-1',legendaryId:'fixture-hammer',level:137,definition,affixDefs,random:()=>.99};
const it=create(args);assert(it);assert.equal(it.rarity,3);assert.equal(it.budgetQuality,4);assert.equal(it.affixes.length,4);assert.equal(new Set(it.affixes.map(a=>a.stat)).size,4);assert.equal(it.special,null);assert.equal(it.set,null);assert.equal(it.divine,undefined);assert.equal(it.enhancement,undefined);
const raw=deriveEquipmentBase({slot:'weapon',baseVariant:'hammer_balanced',level:100,quality:4});for(const k of ['atk','armor','hp'])assert.equal(it[k],raw[k]);
for(const a of it.affixes){assert.equal(a.sourceRange.quality,4);assert.deepEqual({min:a.sourceRange.min,max:a.sourceRange.max},levelAffixRange(affixDefs[a.stat],a.stat,137,4));assert.equal(a.value,a.sourceRange.max);}
const snap=legendaryIdentitySnapshot(it);snap.exclusive.id='mutated';assert.equal(it.exclusive.id,'fixture-echo');
let calls=0;const invalid={...args,random:()=>{calls++;return 0;}};
for(const patch of [{definition:{...definition,ready:false}},{level:NaN},{affixDefs:{only:{min:1,max:2}}},{definition:{...definition,baseVariant:'invalid'}},{legendaryId:'unregistered'}])assert.equal(create({...invalid,...patch}),null);assert.equal(calls,0);
assert.equal(create({...args,random:()=>NaN}),null);assert.equal(create({...args,random:()=>1}),null);
assert.equal(it.level,137);assert.equal(it.legendaryBudget.budgetLevel,100);assert.equal(it.baseLevel,137);
console.log('PASS isolated legendary factory: injected ready definitions, 4 q4 ordinary sources, fixed identity, existing q4 raw budget, no production activation');
const {LEGENDARY_EQUIPMENT_DEFINITIONS,validLegendaryEquipmentMetadata}=await import('./dist/legendary-equipment.js');
const {validItemBudgetMetadata}=await import('./dist/equipment-budget-adapter.js');
const {validAffixSource,affixOwnRange}=await import('./dist/affix-range.js');
for(const legendaryId of Object.keys(LEGENDARY_EQUIPMENT_DEFINITIONS)){
 const owned=create({id:'canonical-'+legendaryId,legendaryId,level:30,affixDefs,random:()=>.5});
 assert(owned);assert(validLegendaryEquipmentMetadata(owned,affixDefs));assert(validItemBudgetMetadata(owned));
 for(const mutate of [x=>x.budgetQuality=3,x=>x.hp++,x=>x.exclusive.id='fake',x=>x.special={id:'reaper'},x=>x.set='anvil',x=>x.legendaryBudget.budgetLevel=29,x=>x.affixes.push(x.affixes[0])]){const bad=structuredClone(owned);mutate(bad);assert(!validLegendaryEquipmentMetadata(bad,affixDefs));}
 if(owned.affixes.length===0)continue;const transferred=structuredClone(owned.affixes[0]);assert(validAffixSource(transferred,affixDefs));assert.equal(affixOwnRange(transferred,affixDefs).max,transferred.sourceRange.max);transferred.sourceRange.max++;assert(!validAffixSource(transferred,affixDefs));
}
for(const field of ['budgetQuality','legendaryBudget','exclusive'])assert(!validItemBudgetMetadata({[field]:4}));
console.log('PASS canonical legendary identities, q4 source transferable, raw budget and exclusive tamper rejected');
let valueCalls=0,randomCalls=0;const withValue=create({...args,random:()=>{randomCalls++;return .5;},rollValue:(range,random)=>{valueCalls++;assert.equal(typeof random,'function');return range.max;}});assert(withValue);assert.equal(valueCalls,4);assert.equal(randomCalls,4);assert(withValue.affixes.every(a=>a.value===a.sourceRange.max));
for(const value of [NaN,Infinity,-1,1.5,1e9])assert.equal(create({...args,rollValue:()=>value}),null);
assert.equal(create({...args,rollValue:42}),null);
console.log('PASS injected value roller: exactly4 calls, no extra discarded value draws, strict integer/range checks');
