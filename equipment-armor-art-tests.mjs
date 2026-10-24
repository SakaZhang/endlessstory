import assert from 'node:assert/strict';
import {renderArmorPixels} from './dist/equipment-armor-art.js';
import {EQUIPMENT_TEMPLATES as ALL_EQUIPMENT_TEMPLATES} from './dist/equipment-templates.js';
// This historical renderer fixture covers the original dwarf pixel/raster collection.
const EQUIPMENT_TEMPLATES=ALL_EQUIPMENT_TEMPLATES.filter(t=>t.originRace==='dwarf');
const slots=new Set(['helm','armor','gloves','boots']);
const expected=EQUIPMENT_TEMPLATES.filter(t=>slots.has(t.slot));
assert.equal(expected.length,28);
assert.equal(expected.filter(t=>t.kind==='scatter').length,16);
assert.equal(expected.filter(t=>t.kind==='set').length,12);
const geometries=new Map();
let primitives=0;
for(const t of EQUIPMENT_TEMPLATES){
 const before=JSON.stringify(t),art=renderArmorPixels(t);
 assert.equal(JSON.stringify(t),before,`${t.id}: metadata must not mutate`);
 if(!slots.has(t.slot)){assert.equal(art,null,`${t.id}: honest supported IDs only`);continue;}
 assert.equal(typeof art,'string');
 assert.ok(art.length>400,`${t.id}: should have intentional details`);
 assert.ok(!/<(?:svg|image|script|foreignObject|g|path|text)\b|(?:href|style|transform|onload)=/.test(art),`${t.id}: only safe native pixel primitives`);
 assert.ok(!/undefined|NaN|Infinity/.test(art));
 const tags=[...art.matchAll(/<(rect|polygon)\b([^>]+)\/>/g)];
 assert.equal(tags.map(m=>m[0]).join(''),art,`${t.id}: no wrapper or injected content`);
 for(const [,type,attrs]of tags){
  const a=Object.fromEntries([...attrs.matchAll(/([a-z]+)="([^"]*)"/g)].map(x=>[x[1],x[2]]));
  assert.match(a.fill,/^#[0-9a-f]{6}$/i);
  if(type==='rect'){
   assert.deepEqual(Object.keys(a).sort(),['fill','height','width','x','y']);
   const [x,y,w,h]=['x','y','width','height'].map(k=>Number(a[k]));
   assert.ok([x,y,w,h].every(Number.isInteger),`${t.id}: integer grid`);
   assert.ok(x>=0&&y>=0&&w>0&&h>0&&x+w<=32&&y+h<=32,`${t.id}: rect bounds ${[x,y,w,h]}`);
  }else{
   assert.deepEqual(Object.keys(a).sort(),['fill','points']);
   const points=a.points.split(' ').map(q=>q.split(',').map(Number));
   assert.ok(points.length>=3);
   for(const xy of points)assert.ok(xy.length===2&&xy.every(n=>Number.isInteger(n)&&n>=0&&n<=32),`${t.id}: polygon grid/bounds`);
  }
  primitives++;
 }
 const shape=art.replace(/ fill="[^"]+"/g,'');
 assert.ok(!geometries.has(shape),`${t.id}: geometry duplicated from ${geometries.get(shape)}; recolor-only art forbidden`);
 geometries.set(shape,t.id);
 // Deliberately dispatch only known template.id, never arbitrary appearance metadata.
 assert.equal(renderArmorPixels({id:t.id}),art);
 assert.equal(renderArmorPixels({...t,visualVariant:'unknown',pixelAppearance:'<script>'}),art);
 assert.equal(renderArmorPixels(t,{rarity:99,frame:'purple',seed:Math.random()}),art);
}
for(const invalid of [null,undefined,{},[],0,'dwarf_set_anvil_helm',{id:'__proto__'},{id:'constructor'},{id:'toString'},{id:'dwarf_set_legendary_helm'},{id:'dwarf_scatter_mineguard_helm<script>'},{visualVariant:'dwarf_set_guard_helm'},{id:1}])assert.equal(renderArmorPixels(invalid),null);
for(const slot of slots)assert.equal(expected.filter(t=>t.slot===slot&&t.kind==='scatter').length,4);
for(const setId of ['anvil','rune','guard'])assert.equal(expected.filter(t=>t.setId===setId).length,4);
console.log(`PASS: 28 unique color-independent armor geometries, 16 scatter + 12 set, ${primitives} bounded integer primitives; exact IDs, safe unknowns, immutable metadata and option-independent output.`);
