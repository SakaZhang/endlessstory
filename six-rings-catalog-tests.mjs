import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {EQUIPMENT_TEMPLATES,listEquipmentTemplates,selectEquipmentTemplate,validateEquipmentTemplates} from './dist/equipment-templates.js';
import {fusionOriginTemplates} from './dist/fusion-origin.js';
import {equipmentRasterSource} from './dist/equipment-raster-art.js';
import {equipmentIcon} from './dist/equipment-art.js';
import {deriveNewItemBudget} from './dist/equipment-budget-adapter.js';
import {fresh,item,forge,ensureMerchant,MERCHANT_CYCLE_MS} from './dist/engine.js';
const races=['dwarf','human','elf','goblin','ashen'];
assert(validateEquipmentTemplates());
const all=new Set();
for(const race of races){
 const rings=listEquipmentTemplates({originRace:race,slot:'ring'});assert.equal(rings.length,6,race);
 assert.deepEqual(listEquipmentTemplates({originRace:race,slot:'ring1'}),rings);assert.deepEqual(listEquipmentTemplates({originRace:race,slot:'ring2'}),rings);
 assert.deepEqual(fusionOriginTemplates(race,{slot:'ring'}),rings);
 const hashes=new Set();for(const [i,t] of rings.entries()){
  all.add(t.id);assert.equal(t.kind,'scatter');assert.equal(t.setId,null);assert(['ring_attack','ring_element','ring_survival'].includes(t.baseVariant));
  assert.equal(selectEquipmentTemplate({originRace:race,slot:'ring'},()=>(i+.5)/6),t);
  for(const size of [32,48,64]){const path=equipmentRasterSource(t,size);assert(path,t.id);assert(fs.existsSync('dist/'+path));assert(equipmentIcon(t,{size}).includes(t.id));if(size===64)hashes.add(createHash('sha256').update(fs.readFileSync('dist/'+path)).digest('hex'));}
 }assert.equal(hashes.size,6,`${race} unique ring images`);
}
const original=Math.random;let seed=37219;Math.random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/2**32);
try{
 for(const race of races){
  const drops=new Set(),fusion=new Set(),s=fresh(race);s.gold=1e8;
  for(let n=0;n<700;n++){
   const it=item('ring',20,null,0,{originRace:race,levelSource:'drop'});drops.add(it.templateId);
   const budget=deriveNewItemBudget({slot:'ring',baseVariant:it.baseVariant,level:20,quality:0});for(const k of ['atk','armor','hp'])assert.equal(it[k],budget[k]);
   s.inventory.push(it);const out=forge(s,[{kind:'equipment',id:it.id}]);assert(out);if(out.slot==='ring')fusion.add(out.templateId);s.inventory=s.inventory.filter(x=>x.id!==out.id);
  }
  assert.equal(drops.size,6,`${race} drop item generator`);assert.equal(fusion.size,6,`${race} actual fusion outputs`);
 }
 const merchant=fresh(),seen=new Set();for(let n=0;n<4500&&seen.size<30;n++){const m=ensureMerchant(merchant,1000+n*MERCHANT_CYCLE_MS);assert(m);for(const o of m.offers)if(o.type==='equipment'&&o.item.slot==='ring'){assert(all.has(o.item.templateId));seen.add(o.item.templateId);}}
 assert.equal(seen.size,30,'all thirty ring templates available in actual trader rolls');
}finally{Math.random=original;}
const engine=fs.readFileSync('dist/engine.js','utf8');assert(engine.includes('originRace:area.race'),'battle drop routes area origin into shared item generator');
console.log('PASS exactly six ordinary rings per race; generic family/socket normalization; unique raster icons; unchanged budget families; drop generation, actual fusion and trader availability.');
