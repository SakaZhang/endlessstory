import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const {createCanvas,loadImage,GlobalFonts}=createRequire(import.meta.url)('@napi-rs/canvas');
import {mkdirSync,writeFileSync} from 'node:fs';
import {equipmentIcon} from './dist/equipment-art.js';
import {EQUIPMENT_TEMPLATES} from './dist/equipment-templates.js';
GlobalFonts.registerFromPath('/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc','LegendCJK');
const entries=[{legendaryId:'first-forge-oathhammer',name:'王统·初炉誓锤',slot:'weapon',weaponType:'hammer',rarity:3},{legendaryId:'everburning-reactor',name:'不熄之炉',slot:'amulet',rarity:3}];
for(const it of entries)for(const size of [32,48]){const svg=equipmentIcon(it,{size});assert(svg.includes(`data-equipment-art="${it.legendaryId}"`));assert(svg.includes(`width="${size}" height="${size}"`));assert(svg.includes('data-equipment-quality="3"'));assert(svg.includes('data-equipment-set="false"'));assert(svg.includes('#682d36'));assert(!svg.includes('data-equipment-template='));}
assert.notEqual(equipmentIcon(entries[0]),equipmentIcon({slot:'weapon',weaponType:'hammer',rarity:3}));assert.notEqual(equipmentIcon(entries[1]),equipmentIcon({slot:'amulet',rarity:3}));
for(const t of EQUIPMENT_TEMPLATES)assert(equipmentIcon(t).includes(t.id));
const canvas=createCanvas(600,210),ctx=canvas.getContext('2d');ctx.fillStyle='#131a23';ctx.fillRect(0,0,600,210);ctx.imageSmoothingEnabled=false;ctx.font='16px LegendCJK';ctx.fillStyle='#e3c785';ctx.fillText('传奇装备 · 实际 equipmentIcon 输出',18,26);
for(let i=0;i<entries.length;i++){const it=entries[i],x=20+i*290;for(const [j,size] of [32,48].entries()){const svg=equipmentIcon(it,{size}),img=await loadImage(Buffer.from(svg));ctx.drawImage(img,x+j*90,55,size,size);ctx.fillStyle='#9cafbf';ctx.font='12px LegendCJK';ctx.fillText(`${size}px`,x+j*90,123);}ctx.fillStyle='#ead8b4';ctx.font='17px LegendCJK';ctx.fillText(it.name,x,163);ctx.fillStyle='#9cafbf';ctx.font='12px LegendCJK';ctx.fillText('原品质背景 · 中性边框 · 独立传奇造型',x,190);}
mkdirSync('/workspace/shared/legendary-art',{recursive:true});writeFileSync('/workspace/shared/legendary-art/contact-sheet.png',canvas.toBuffer('image/png'));
console.log('PASS legendary art: actual production icons32/48, distinct identities, unchanged quality/frame and48templates; /workspace/shared/legendary-art/contact-sheet.png');
