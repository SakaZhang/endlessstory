import assert from 'node:assert/strict';
import {equipmentPresentation,EQUIPMENT_QUALITY_BACKGROUNDS,EQUIPMENT_NEUTRAL_FRAME,EQUIPMENT_SET_FRAME} from './dist/equipment-presentation.js';
import {equipmentIcon} from './dist/equipment-art.js';
import {EQUIPMENT_TEMPLATES} from './dist/equipment-templates.js';
import {icon} from './dist/icons.js';
const random=Math.random;Math.random=()=>{throw Error('Presentation must not consume RNG');};
try{
 for(const t of EQUIPMENT_TEMPLATES)for(let q=0;q<4;q++){const item={...t,rarity:q,set:t.setId},before=JSON.stringify(item),p=equipmentPresentation(item),svg=equipmentIcon(item);assert.equal(p.quality,t.setId?3:q);assert.equal(p.background,EQUIPMENT_QUALITY_BACKGROUNDS[p.quality]);assert.equal(p.border,t.setId?EQUIPMENT_SET_FRAME:EQUIPMENT_NEUTRAL_FRAME);assert(svg.includes(`data-equipment-quality="${p.quality}"`));assert(svg.startsWith('<span class="equipmentRaster"'));assert(svg.includes(`--equipment-bg:${p.background}`));assert(svg.includes(`--equipment-frame:${p.border}`));assert(svg.includes(`/48/${t.id}.png`));assert.equal(JSON.stringify(item),before);}
 for(let q=0;q<4;q++)for(const set of [null,'anvil']){const old={name:'旧存档装备',slot:'weapon',rarity:q,set},before=JSON.stringify(old),raw=icon('weapon',set||'anvil',q),inner=raw.slice(raw.indexOf('>')+1,raw.lastIndexOf('</svg>')),svg=equipmentIcon(old);assert(svg.includes(inner));assert(svg.includes(`data-equipment-quality="${set?3:q}"`));assert(!svg.includes('data-equipment-visual'));assert.equal(JSON.stringify(old),before);}
 assert.equal(equipmentPresentation({rarity:NaN}).quality,0);assert.equal(equipmentPresentation({rarity:Infinity}).quality,0);
}finally{Math.random=random;}
console.log('PASS quality presentation: all48 × four qualities; backgrounds independent of neutral/set frames; supreme red set background; legacy geometry/fallback retained; no state/RNG mutation.');
