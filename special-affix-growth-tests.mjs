import assert from 'node:assert/strict';
import {GROWTH_SPECIAL_DEFS,validGrowthSpecial,specialAffixProgress,growthBonuses,rerollGrowthSpecial,validGrowthKillLedger,recordGrowthKills} from './dist/special-affix-growth.js';

const gear=(id,specialId,growthKills)=>({id,special:{id:specialId,...(growthKills===undefined?{}:{growthKills})}});
const encounter=(count=3)=>({enemies:Array.from({length:count},(_,i)=>({id:'unit-'+i,hp:0}))});
const save=(inventory,equip)=>({inventory,equip});
assert.deepEqual(Object.keys(GROWTH_SPECIAL_DEFS),['harvester','blesser','glutton']);
assert(Object.isFrozen(GROWTH_SPECIAL_DEFS));assert(Object.values(GROWTH_SPECIAL_DEFS).every(Object.isFrozen));
for(const [specialId,cap,stat,value,unit] of [['harvester',400,'atk',400,'flat'],['blesser',200,'luck',20,'rating'],['glutton',200,'lifesteal',200,'rating']]){
 assert(validGrowthSpecial({id:specialId}));assert(validGrowthSpecial({id:specialId,growthKills:0}));assert(validGrowthSpecial({id:specialId,growthKills:cap}));
 for(const invalid of [-1,.1,cap+1,Infinity,NaN,'1',null,undefined])assert(!validGrowthSpecial({id:specialId,growthKills:invalid}));
 assert.deepEqual(specialAffixProgress(gear('a',specialId,cap)),{id:specialId,kills:cap,maxKills:cap,value,maxValue:value,stat,unit});
 const bonus={atk:0,luck:0,lifesteal:0};bonus[stat]=value;assert.deepEqual(growthBonuses(gear('a',specialId,cap)),bonus);
}
assert(validGrowthSpecial(null));assert(validGrowthSpecial(undefined));assert(validGrowthSpecial({id:'knowledge'}));
for(const special of [false,[],{},{id:4},{id:''},{id:'knowledge',growthKills:0}])assert(!validGrowthSpecial(special));
assert.equal(specialAffixProgress(gear('a','knowledge')),null);assert.equal(specialAffixProgress(gear('a','harvester',401)),null);
assert.deepEqual(growthBonuses(gear('a','harvester',401)),{atk:0,luck:0,lifesteal:0});
assert.equal(growthBonuses(gear('a','blesser',3)).luck,.3,'division avoids repeated floating-point accumulation');
const divine=gear('divine','harvester',100);divine.divine={id:'forge-favor',bonus:{atk:300}};assert.equal(growthBonuses(divine).atk,100,'unrecognized legacy marker without raw model does not amplify growth');
for(const model of ['raw-v1','raw-v2']){const valid=structuredClone(divine);valid.divine.model=model;assert.equal(growthBonuses(valid).atk,200);assert.equal(valid.special.growthKills,100);}

{
 const a=gear('a','harvester',399),b=gear('b','harvester',7),c=gear('c','blesser',199),d=gear('d','glutton',199),spare=gear('spare','harvester',20),s=save([a,b,c,d,spare],{weapon:'a',helm:'a',armor:'b',ring1:'c',ring2:'d',amulet:null}),e=encounter();
 assert.equal(recordGrowthKills(s,e,['unit-0','unit-0','unit-1']),2);
 assert.deepEqual([a,b,c,d,spare].map(i=>i.special.growthKills),[400,9,200,200,20]);
 assert.deepEqual(e.growthKillIds,['unit-0','unit-1']);assert(validGrowthKillLedger(e));
 assert.equal(recordGrowthKills(s,e,['unit-0','unit-1']),0);assert.equal(b.special.growthKills,9,'duplicate receipt cannot grow an item');
 assert.equal(recordGrowthKills(s,e,['unit-2']),1);assert.equal(a.special.growthKills,400);assert.equal(b.special.growthKills,10);
 const total=[a,b,c,d].map(growthBonuses).reduce((sum,row)=>({atk:sum.atk+row.atk,luck:sum.luck+row.luck,lifesteal:sum.lifesteal+row.lifesteal}),{atk:0,luck:0,lifesteal:0});
 assert.deepEqual(total,{atk:410,luck:20,lifesteal:200},'each distinct equipped item stacks');
 s.equip.armor=null;const next=encounter();assert.equal(recordGrowthKills(s,next,['unit-0']),1);assert.equal(b.special.growthKills,10,'unequipped items retain progress but do not grow');
 s.equip.armor='b';assert.equal(recordGrowthKills(s,next,['unit-1']),1);assert.equal(b.special.growthKills,11,'reequip resumes existing progress');
 const resumed=JSON.parse(JSON.stringify({s,e:next}));assert.equal(recordGrowthKills(resumed.s,resumed.e,['unit-0','unit-1']),0,'save/resume receipt is idempotent');
}
{
 const s=save([gear('a','harvester')],{weapon:null}),e=encounter();assert.equal(recordGrowthKills(s,e,['unit-0']),1);s.equip.weapon='a';assert.equal(recordGrowthKills(s,e,['unit-0']),0);assert.equal(s.inventory[0].special.growthKills,undefined,'equipping later cannot retroactively collect a kill');
 assert.equal(recordGrowthKills(s,e,['unit-1']),1);assert.equal(s.inventory[0].special.growthKills,1);
}
{
 const s=save([gear('a','harvester',100)],{weapon:'a'}),e=encounter();e.enemies[1].hp=1;
 for(const ids of [['missing'],['unit-0','unit-1'],[null],null]){const before=JSON.stringify({s,e});assert.equal(recordGrowthKills(s,e,ids),null);assert.equal(JSON.stringify({s,e}),before,'invalid input must be atomic');}
 for(const ledger of [null,{},['unit-0','unit-0'],['unit-1'],['missing'],['unit-0','unit-1','unit-2','unit-3']])assert(!validGrowthKillLedger({...e,growthKillIds:ledger}));
 assert(validGrowthKillLedger({...e,growthKillIds:[]}));assert(validGrowthKillLedger({...e,growthKillIds:['unit-0']}));
 const invalid=save([gear('a','harvester',100),gear('a','harvester',100)],{weapon:'a'});assert.equal(recordGrowthKills(invalid,e,['unit-0']),null,'ambiguous item IDs cannot collect');
 const malformed=save([gear('a','harvester',401)],{weapon:'a'});assert.equal(recordGrowthKills(malformed,e,['unit-0']),null,'out-of-range growth cannot be silently normalized');
 const deadCopy={enemies:[{id:'unit-0',hp:0},{id:'unit-0',hp:0}]};assert.equal(recordGrowthKills(s,deadCopy,['unit-0']),null,'duplicate unit IDs cannot collect');
}
{
 assert.deepEqual(rerollGrowthSpecial({id:'harvester',growthKills:240},{id:'harvester'}),{id:'harvester',growthKills:240});
 assert.deepEqual(rerollGrowthSpecial({id:'harvester',growthKills:240},{id:'blesser',growthKills:180}),{id:'blesser'},'different special cannot inherit either old or candidate growth');
 assert.deepEqual(rerollGrowthSpecial({id:'harvester',growthKills:240},{id:'knowledge'}),{id:'knowledge'});
 assert.deepEqual(rerollGrowthSpecial({id:'knowledge'},{id:'harvester'}),{id:'harvester'});
 assert.equal(rerollGrowthSpecial({id:'harvester',growthKills:401},{id:'harvester'}),null);
 assert.equal(rerollGrowthSpecial({id:'harvester',growthKills:200},null),null);
}
console.log('Special-affix growth passed: item-bound integer counters, exact stored kill caps, no unknown-marker scaling, equipped deduplication, multi-item stacking, persistent kill receipts, atomic validation, unequip and same/different-affix reroll.');
