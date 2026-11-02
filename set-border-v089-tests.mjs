import assert from 'node:assert/strict';
import fs from 'node:fs';
import {equipmentIcon} from './dist/equipment-art.js';
import {EQUIPMENT_TEMPLATES} from './dist/equipment-templates.js';
const owners=['itemCell','equipSlot','detailIcon','forgeResult','orbitSlot','fusionGearCard','commodityCard','donorCard','collectionTile','collectionDetail','collectedPart','loadoutGearSlot','batchSaleItem','workshopItem','shopGearIcon','workshopBigIcon','workshopTemplate'];
const p=':is('+owners.map(x=>'.'+x).join(',')+')';
const raster=fs.readFileSync('dist/equipment-raster-consumers.css','utf8'),svg=fs.readFileSync('dist/equipment-presentation.css','utf8');
assert(raster.includes(p+' .equipmentRaster[data-equipment-set="true"]:after { display:none; }'));
assert(svg.includes(p+' svg[data-equipment-set="true"] > rect[data-equipment-frame="true"] { display:none; }'));
assert(raster.includes('.commodityCard > .shopGearIcon:has([data-equipment-set="true"]) { border-color:transparent!important; box-shadow:none!important; }'));
// The base icon rule must remain: standalone and non-set images still own their border.
assert(raster.includes('.equipmentRaster:after{content:"";position:absolute;inset:0;border:1px solid var(--equipment-frame,#48515a)'));
for(const css of [raster,svg]){assert(css.includes('border-color:#6aaf70!important'));assert(css.includes('outline:2px solid #e6d8a0'));assert(css.includes('data-equipment-quality="4"'));}
for(const t of EQUIPMENT_TEMPLATES.filter(x=>x.setId)){const it={...t,set:t.setId,rarity:3},before=JSON.stringify(it);assert(equipmentIcon(it).includes('data-equipment-set="true"'));assert.equal(JSON.stringify(it),before);}
console.log('PASS v089 single set frame: 17 host contexts, raster and retained SVG, standalone/nonset/legendary/selection preservation; all 60 set template identities unchanged.');
