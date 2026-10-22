import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {createRequire} from 'node:module';const {createCanvas,loadImage,GlobalFonts}=createRequire(import.meta.url)('@napi-rs/canvas');
import {EQUIPMENT_TEMPLATES} from './dist/equipment-templates.js';
import {equipmentIcon,renderEquipmentPixels,equipmentArtTemplate} from './dist/equipment-art.js';
import {icon} from './dist/icons.js';
import {equipmentPresentation,EQUIPMENT_QUALITY_BACKGROUNDS,EQUIPMENT_NEUTRAL_FRAME,EQUIPMENT_SET_FRAME} from './dist/equipment-presentation.js';
GlobalFonts.registerFromPath('/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc','Equipment CJK');
const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
const order=['weapon','helm','armor','gloves','boots','ring','amulet'];
const templates=[...EQUIPMENT_TEMPLATES].sort((a,b)=>order.indexOf(a.slot)-order.indexOf(b.slot)||String(a.weaponType||'').localeCompare(String(b.weaponType||''))||String(a.setId||'').localeCompare(String(b.setId||'')));
assert.equal(templates.length,48);const geometries=new Set(),renders=new Set();
for(const t of templates){const before=JSON.stringify(t),svg=equipmentIcon(t),inner=renderEquipmentPixels(t);assert(inner);assert(!/NaN|undefined|<script|onload|https?:\/\//.test(inner));assert(svg.includes(`data-equipment-visual="${t.id}"`));assert(svg.includes(`aria-label="${t.name}"`));assert.equal(equipmentArtTemplate({templateId:t.id}),t);assert.equal(equipmentArtTemplate({visualVariant:t.id}),t);assert.equal(JSON.stringify(t),before);geometries.add(hash(inner.replace(/fill="[^"]*"/g,'fill="x"')));renders.add(hash(svg));for(const points of inner.matchAll(/points="([^"]*)"/g))for(const v of points[1].split(/[ ,]+/).filter(Boolean)){assert(Number.isInteger(Number(v)));assert(Number(v)>=0&&Number(v)<=32);}
for(const n of inner.matchAll(/(?:x|y|width|height)="([\d.]+)"/g))assert(Number.isInteger(Number(n[1])));}
assert.equal(geometries.size,48,'every template needs a distinct geometry, not only recolor');assert.equal(renders.size,48);
const legacy={name:'旧物',slot:'weapon',set:'rune',rarity:2};assert(equipmentIcon(legacy).includes(icon('weapon','rune',2).replace(/^<svg[^>]*>/,'').replace(/<\/svg>$/,'')));assert.equal(equipmentPresentation(legacy).background,EQUIPMENT_QUALITY_BACKGROUNDS[3]);assert(!equipmentIcon(legacy).includes('data-equipment-visual'));assert(equipmentIcon({visualVariant:'<script>',slot:'ring'}).includes(icon('ring','anvil',1).replace(/^<svg[^>]*>/,'').replace(/<\/svg>$/,'')));
const out='/workspace/shared/equipment-art-v0271';fs.mkdirSync(out,{recursive:true});
const qualityNames=['普通','稀有','优良','至臻'];
async function sheet(size,cols,file){const w=250,h=size+82,c=createCanvas(cols*w,Math.ceil(48/cols)*h),g=c.getContext('2d');g.fillStyle='#101820';g.fillRect(0,0,c.width,c.height);g.imageSmoothingEnabled=false;
 for(let i=0;i<templates.length;i++){const t=templates[i],x=(i%cols)*w,y=Math.floor(i/cols)*h;g.fillStyle='#19252c';g.fillRect(x+7,y+7,w-14,h-14);const item={...t,rarity:i%4};const presentation=equipmentPresentation(item);assert.equal(presentation.border,t.setId?EQUIPMENT_SET_FRAME:EQUIPMENT_NEUTRAL_FRAME);const img=await loadImage(Buffer.from(equipmentIcon(item,{size})));g.drawImage(img,x+(w-size)/2,y+16,size,size);g.textAlign='center';g.fillStyle='#e6dfc9';g.font='16px "Equipment CJK"';g.fillText(t.name,x+w/2,y+size+42);g.fillStyle='#94a7ab';g.font='12px "Equipment CJK"';g.fillText(`${t.setId?'套装 · ':''}${qualityNames[presentation.quality]} · ${size}px`,x+w/2,y+size+63);}
 fs.writeFileSync(`${out}/${file}`,c.toBuffer('image/png'));}
await sheet(48,6,'equipment-48px.png');await sheet(128,6,'equipment-128px.png');await sheet(32,6,'equipment-32px.png');
fs.writeFileSync(`${out}/template-order.json`,JSON.stringify(templates.map(x=>({id:x.id,name:x.name,slot:x.slot})),null,2));
console.log('PASS: 48 actual facade SVGs; 48 unique non-color geometries; legacy fallback; integer coordinates; zero mutation; real 32/48/128px labeled native raster sheets.');

const comparison=[...[0,1,2,3].map(rarity=>({item:{...templates[0],rarity},label:qualityNames[rarity]})),{item:{...templates.find(t=>t.slot==='helm'&&!t.setId),rarity:3},label:'至臻散件 · 中性框'},{item:{...templates.find(t=>t.slot==='helm'&&t.setId),rarity:3},label:'至臻套装 · 绿色框'},{item:legacy,label:'旧制套装 · 保留图形'}];
const c=createCanvas(1400,240),g=c.getContext('2d');g.fillStyle='#101820';g.fillRect(0,0,c.width,c.height);g.imageSmoothingEnabled=false;for(const [i,{item,label}]of comparison.entries()){const svg=equipmentIcon(item,{size:128}),p=equipmentPresentation(item);assert(svg.includes(`fill="${p.background}"`));assert(svg.includes(`stroke="${p.border}"`));const img=await loadImage(Buffer.from(svg));g.drawImage(img,i*200+36,18,128,128);g.fillStyle='#e6dfc9';g.textAlign='center';g.font='15px "Equipment CJK"';g.fillText(label,i*200+100,180);g.fillText(p.background,i*200+100,207);}fs.writeFileSync(`${out}/quality-background-comparison.png`,c.toBuffer('image/png'));
