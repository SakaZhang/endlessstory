import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {createRequire} from 'node:module';const {createCanvas,loadImage,GlobalFonts}=createRequire(import.meta.url)('@napi-rs/canvas');
import {EQUIPMENT_TEMPLATES} from './dist/equipment-templates.js';
import {equipmentIcon,renderEquipmentPixels,equipmentArtTemplate} from './dist/equipment-art.js';
import {icon} from './dist/icons.js';
GlobalFonts.registerFromPath('/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc','Equipment CJK');
const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
const order=['weapon','helm','armor','gloves','boots','ring','amulet'];
const templates=[...EQUIPMENT_TEMPLATES].sort((a,b)=>order.indexOf(a.slot)-order.indexOf(b.slot)||String(a.weaponType||'').localeCompare(String(b.weaponType||''))||String(a.setId||'').localeCompare(String(b.setId||'')));
assert.equal(templates.length,48);const geometries=new Set(),renders=new Set();
for(const t of templates){const before=JSON.stringify(t),svg=equipmentIcon(t),inner=renderEquipmentPixels(t);assert(inner);assert(!/NaN|undefined|<script|onload|https?:\/\//.test(inner));assert(svg.includes(`data-equipment-visual="${t.id}"`));assert(svg.includes(`aria-label="${t.name}"`));assert.equal(equipmentArtTemplate({templateId:t.id}),t);assert.equal(equipmentArtTemplate({visualVariant:t.id}),t);assert.equal(JSON.stringify(t),before);geometries.add(hash(inner.replace(/fill="[^"]*"/g,'fill="x"')));renders.add(hash(svg));for(const points of inner.matchAll(/points="([^"]*)"/g))for(const v of points[1].split(/[ ,]+/).filter(Boolean)){assert(Number.isInteger(Number(v)));assert(Number(v)>=0&&Number(v)<=32);}
for(const n of inner.matchAll(/(?:x|y|width|height)="([\d.]+)"/g))assert(Number.isInteger(Number(n[1])));}
assert.equal(geometries.size,48,'every template needs a distinct geometry, not only recolor');assert.equal(renders.size,48);
const legacy={name:'旧物',slot:'weapon',set:'rune',rarity:2};assert.equal(equipmentIcon(legacy),icon('weapon','rune',2));assert(!equipmentIcon(legacy).includes('data-equipment-visual'));assert.equal(equipmentIcon({visualVariant:'<script>',slot:'ring'}),icon('ring','anvil',1));
const out='/workspace/shared/equipment-art-v027';fs.mkdirSync(out,{recursive:true});
const colors=['#c1c4c3','#6da5f0','#b18ce6','#e66c70'];
async function sheet(size,cols,file){const w=250,h=size+82,c=createCanvas(cols*w,Math.ceil(48/cols)*h),g=c.getContext('2d');g.fillStyle='#101820';g.fillRect(0,0,c.width,c.height);g.imageSmoothingEnabled=false;
 for(let i=0;i<templates.length;i++){const t=templates[i],x=(i%cols)*w,y=Math.floor(i/cols)*h;g.fillStyle='#19252c';g.fillRect(x+7,y+7,w-14,h-14);g.strokeStyle=t.setId?'#6aaf70':colors[i%4];g.lineWidth=2;g.strokeRect(x+(w-size)/2-4,y+12,size+8,size+8);const img=await loadImage(Buffer.from(equipmentIcon(t,{size})));g.drawImage(img,x+(w-size)/2,y+16,size,size);g.textAlign='center';g.fillStyle='#e6dfc9';g.font='16px "Equipment CJK"';g.fillText(t.name,x+w/2,y+size+42);g.fillStyle='#94a7ab';g.font='12px "Equipment CJK"';g.fillText(`${t.setId?'套装 · ':''}${t.weaponType||t.slot} · ${size}px`,x+w/2,y+size+63);}
 fs.writeFileSync(`${out}/${file}`,c.toBuffer('image/png'));}
await sheet(48,6,'equipment-48px.png');await sheet(128,6,'equipment-128px.png');await sheet(32,6,'equipment-32px.png');
fs.writeFileSync(`${out}/template-order.json`,JSON.stringify(templates.map(x=>({id:x.id,name:x.name,slot:x.slot})),null,2));
console.log('PASS: 48 actual facade SVGs; 48 unique non-color geometries; legacy fallback; integer coordinates; zero mutation; real 32/48/128px labeled native raster sheets.');
