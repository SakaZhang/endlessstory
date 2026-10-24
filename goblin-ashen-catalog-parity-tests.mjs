import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import * as goblin from './dist/races/goblin/equipment.js';
import * as ashen from './dist/races/ashen/equipment.js';
import {listEquipmentTemplates,selectEquipmentTemplate,validateEquipmentTemplates} from './dist/equipment-templates.js';
import {fusionOriginTemplates} from './dist/fusion-origin.js';
import {equipmentRasterSource} from './dist/equipment-raster-art.js';
import {equipmentIcon} from './dist/equipment-art.js';
import {deriveNewItemBudget} from './dist/equipment-budget-adapter.js';
import {fresh,item,forge,ensureMerchant,MERCHANT_CYCLE_MS} from './dist/engine.js';
const {createCanvas,loadImage}=createRequire(import.meta.url)('@napi-rs/canvas');
const baseline=JSON.parse(fs.readFileSync(new URL('./fixtures/goblin-ashen-equipment-before-parity.json',import.meta.url)));
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const slots=['weapon','helm','armor','gloves','boots','ring','amulet'];
assert(validateEquipmentTemplates());
for(const [path,digest] of Object.entries(baseline.preservedFiles))assert.equal(hash(fs.readFileSync(path)),digest,`untouched ${path}`);
const added=[];
for(const [race,pack] of Object.entries({goblin,ashen})){
 const old=baseline.races[race];
 for(const t of old.equipment)assert.deepEqual(pack.equipment.find(x=>x.id===t.id),t,`stable old identity ${t.id}`);
 for(const key of ['sets','legendaries',...(race==='ashen'?['coreVariants','weaponVariants']:[])])assert.deepEqual(pack[key],old[key],`${race} ${key} unchanged`);
 const common=pack.equipment.filter(t=>t.kind==='scatter'&&t.slot!=='core');
 assert.equal(common.length,52);assert.equal(new Set(pack.equipment.map(t=>t.name)).size,pack.equipment.length,'unique old and new names');assert.equal(pack.equipment.filter(t=>t.kind==='set').length,12);
 assert.equal(pack.equipment.filter(t=>t.slot==='core').length,race==='ashen'?3:0);
 for(const slot of slots){const ts=listEquipmentTemplates({originRace:race,slot});assert.equal(ts.length,slot==='weapon'?16:6,`${race}/${slot}`);assert.deepEqual(fusionOriginTemplates(race,{slot}),ts);ts.forEach((t,i)=>assert.equal(selectEquipmentTemplate({originRace:race,slot},()=>(i+.5)/ts.length),t));}
 for(const family of race==='goblin'?['dagger','sword']:['armguard','hammer'])assert.equal(common.filter(t=>t.weaponType===family).length,8,`${race}/${family}`);
 const prior=new Set(old.equipment.map(t=>t.id));const newItems=pack.equipment.filter(t=>!prior.has(t.id));assert.equal(newItems.length,race==='goblin'?15:18);added.push(...newItems);
 for(const t of newItems){assert.equal(t.kind,'scatter');assert.equal(t.setId,null);assert.equal(t.raceRestriction,undefined);assert(old.equipment.some(x=>x.baseVariant===t.baseVariant),`${t.id} reuses existing budget`);assert(t.description.length>20);assert(!/\p{Extended_Pictographic}/u.test(t.name+t.description));}
}
assert.equal(new Set(added.map(t=>t.name)).size,33);
const skipArt=process.argv.includes('--catalog-only');
const paths=new Set(),hashes=new Set(),pixelHashes=new Set(),silhouetteHashes=new Set();
for(const t of skipArt?[]:added){const path=equipmentRasterSource(t,64);assert(path,`${t.id} raster route`);assert(equipmentIcon(t,{size:64}).includes(path));paths.add(path);const bytes=fs.readFileSync('dist/'+path);hashes.add(hash(bytes));const img=await loadImage(bytes);assert.equal(img.width,64);assert.equal(img.height,64);const canvas=createCanvas(64,64),ctx=canvas.getContext('2d');ctx.drawImage(img,0,0);const px=ctx.getImageData(0,0,64,64).data;pixelHashes.add(hash(px));silhouetteHashes.add(hash(Uint8Array.from({length:4096},(_,i)=>px[i*4+3]>127?255:0)));let transparent=0,visible=0;for(let i=3;i<px.length;i+=4){if(px[i]===0)transparent++;if(px[i]>0)visible++;}assert(transparent>400&&visible>100,`${t.id} usable alpha silhouette`);}
if(!skipArt){assert.equal(paths.size,33);assert.equal(hashes.size,33);assert.equal(pixelHashes.size,33,'distinct decoded pixels');assert.equal(silhouetteHashes.size,33,'distinct silhouettes, not recolor-only');}
const original=Math.random;let seed=37219;Math.random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/2**32);
try{
 for(const race of ['goblin','ashen']){
  const s=fresh(race);s.gold=1e10;
  for(const slot of [...slots,...race==='ashen'?['core']:[]]){
   const ts=listEquipmentTemplates({originRace:race,slot}),drops=new Set(),fusion=new Set();
   for(let n=0;n<1200;n++){
    const it=item(slot,20,null,0,{originRace:race,levelSource:'drop'});drops.add(it.templateId);const budget=deriveNewItemBudget({slot,baseVariant:it.baseVariant,level:20,quality:0});for(const k of ['atk','armor','hp'])assert.equal(it[k],budget[k],`${it.templateId}/${k}`);
    s.inventory.push(it);const out=forge(s,[{kind:'equipment',id:it.id}]);assert(out);if(out.slot===slot)fusion.add(out.templateId);s.inventory=s.inventory.filter(x=>x.id!==out.id);
   }
   assert.deepEqual([...drops].sort(),ts.map(t=>t.id).sort(),`${race}/${slot} actual drop generation`);assert.deepEqual([...fusion].sort(),ts.map(t=>t.id).sort(),`${race}/${slot} actual fusion outputs`);
  }
 }
 const merchant=fresh(),wanted=new Set(added.map(t=>t.id)),seen=new Set();for(let n=0;n<30000&&seen.size<wanted.size;n++){const m=ensureMerchant(merchant,1000+n*MERCHANT_CYCLE_MS);for(const o of m.offers)if(o.type==='equipment'&&wanted.has(o.item.templateId))seen.add(o.item.templateId);}
 assert.deepEqual([...seen].sort(),[...wanted].sort(),'all 33 new items in actual trader rolls');
}finally{Math.random=original;}
assert(fs.readFileSync('dist/engine.js','utf8').includes('originRace:area.race'),'battle drops pass their area race to shared item generator');
console.log(skipArt?'PASS catalog/source-only (new raster checks intentionally skipped)': 'PASS Goblin/Ashen: 52 common each; 8+8 native weapons; six per ordinary armor/accessory slot; 12 sets each; Ashen three extra cores; all old IDs/data/art/skills/legends unchanged; 33 unique 64px alpha sprites; actual drop/fusion/trader coverage and existing budgets.');
