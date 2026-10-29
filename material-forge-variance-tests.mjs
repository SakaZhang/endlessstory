import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fresh,forge,item,validSave,equipItem,rollMaterialFusionLevel,rollEquipmentFusionLevel} from './dist/engine.js';
import {deriveNewItemBudget} from './dist/equipment-budget-adapter.js';
const app=readFileSync(new URL('./dist/app.js',import.meta.url),'utf8');
assert(app.includes('纯材料炼出的装备以角色当前等级为基准上下浮动，最低1级'));
assert(!app.includes('纯材料锻造仍为角色当前等级'));
const original=Math.random;
try{
 // Same established integer ±2 policy, clipped at 1; equipment has no level-100 cap.
 for(const baseLevel of [1,2,50,100]){
  const min=Math.max(1,baseLevel-2),max=baseLevel+2,seen=new Set();
  for(let i=0;i<100;i++){
   const result=rollMaterialFusionLevel(baseLevel,()=>i/100);
   assert.deepEqual(result,{baseLevel,level:min+Math.floor(i/100*(max-min+1)),levelSource:'material'});
   assert(Number.isSafeInteger(result.level));seen.add(result.level);
  }
  assert.deepEqual([...seen],Array.from({length:max-min+1},(_,i)=>min+i));
  for(const random of [()=>0,()=>.5,()=>.999999]){
   const material=rollMaterialFusionLevel(baseLevel,random);
   const gear=rollEquipmentFusionLevel([{baseLevel,level:baseLevel+2,levelSource:'equipment'}],random);
   assert.equal(material.level,gear.level);assert.equal(material.baseLevel,gear.baseLevel);
  }
 }
 for(const random of [()=>-1,()=>1,()=>NaN])assert.equal(rollMaterialFusionLevel(10,random),null);
 for(const base of [-1,Infinity,NaN])assert.equal(rollMaterialFusionLevel(base,()=>.5),null);
 // Exercise production generation at both endpoints; metadata retains hero baseline,
 // while raw base stats use the rolled level, not that baseline.
 for(const heroLevel of [1,50,100])for(const draw of [0,.999999]){
  Math.random=original;const s=fresh();s.level=heroLevel;s.gold=100;s.materialStacks={'铁屑|0':1};
  Math.random=()=>draw;const out=forge(s,['铁屑|0']);
  assert.equal(out.level,draw===0?Math.max(1,heroLevel-2):heroLevel+2);
  assert.equal(out.baseLevel,heroLevel);assert.equal(out.levelSource,'material');assert.equal(s.level,heroLevel);
  const expected=deriveNewItemBudget({slot:out.slot,baseVariant:out.baseVariant,level:out.level,quality:out.rarity});
  for(const stat of ['atk','armor','hp'])assert.equal(out[stat],expected[stat]);
  assert.equal(out.budgetSourceLevel,out.level);assert.equal(out.budgetLevel,Math.min(100,out.level));
  if(heroLevel===50){const baseline=deriveNewItemBudget({slot:out.slot,baseVariant:out.baseVariant,level:heroLevel,quality:out.rarity});assert(['atk','armor','hp'].some(stat=>out[stat]!==baseline[stat]));}
  assert.equal(s.gold,60);assert.equal(s.materialStacks['铁屑|0'],0);assert(validSave(s));
  const loaded=JSON.parse(JSON.stringify(s));assert(validSave(loaded));assert.deepEqual(loaded.inventory.find(it=>it.id===out.id),out);
  assert(equipItem(loaded,out.id),'rolled equipment has no equip-level requirement');
  // Equipment-input fusion ignores hero level and keeps the original material baseline.
  loaded.gold=100;loaded.equip=structuredClone(s.equip);
  const fused=forge(loaded,[{kind:'equipment',id:out.id}]);assert(fused);assert.equal(fused.baseLevel,heroLevel);assert.equal(fused.level,out.level);assert.equal(fused.levelSource,'equipment');
 }
 // Mixed gear/material uses gear baseline, not hero baseline.
 Math.random=original;const mixed=fresh();mixed.level=100;mixed.gold=100;const donor=item('weapon',12,null,0,{baseLevel:10,levelSource:'equipment'});mixed.inventory.push(donor);
 Math.random=()=>.999999;const result=forge(mixed,[{kind:'equipment',id:donor.id},'铁屑|0']);assert.equal(result.level,12);assert.equal(result.baseLevel,10);assert.equal(result.levelSource,'equipment');assert(validSave(mixed));
 // Potion branch returns before any equipment-level RNG draw. Fixed RNG gives
 // the same potion, cost, consumption and draw count regardless of hero level.
 const potions=[];
 for(const heroLevel of [1,100]){
  Math.random=original;const s=fresh();s.level=heroLevel;s.gold=100;s.materialStacks={'灰根草|0':1};let draws=0;Math.random=()=>{draws++;return 0;};
  const out=forge(s,['灰根草|0']);assert.equal(out.kind,'potion');assert(!Object.hasOwn(out,'level'));assert.equal(s.gold,60);assert.equal(s.materialStacks['灰根草|0'],0);assert(validSave(s));potions.push({out,draws});
 }
 assert.deepEqual(potions[0],potions[1]);assert.equal(potions[0].draws,5);
 console.log('PASS material fusion: deterministic ±2, 1/100 boundaries, rolled raw stats, reload/equip, gear provenance, potion early return unchanged');
}finally{Math.random=original;}
