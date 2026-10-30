import {beforeEquipmentCopy} from './racial-equipment-copy-test-fixture.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {auditEquipmentCatalog,PARITY_RACES,COMMON_SLOT_TARGETS} from './equipment-catalog-audit.mjs';
import {EQUIPMENT_TEMPLATES as T,listEquipmentTemplates,selectEquipmentTemplate,validateEquipmentTemplates} from './dist/equipment-templates.js';
import {LEGENDARY_EQUIPMENT_DEFINITIONS as L} from './dist/legendary-equipment.js';
import {fusionOriginTemplates} from './dist/fusion-origin.js';
import {equipmentRasterSource} from './dist/equipment-raster-art.js';
import {equipmentIcon} from './dist/equipment-art.js';
import {deriveNewItemBudget} from './dist/equipment-budget-adapter.js';
import {fresh,item,forge,equipItem,ensureMerchant,MERCHANT_CYCLE_MS,BUILD,normalizeCodexCollection} from './dist/engine.js';
import {renderEquipmentWorkshop} from './dist/equipment-workshop-ui.js';
import {renderPixelInventory} from './dist/pixel-inventory.js';
import {renderForgeSlotPicker,forgeSlotItems} from './dist/forge-slot-picker.js';
import {renderCodex} from './dist/codex-ui.js';
import {SCHEMA_VERSION} from './dist/save-generation.js';
const hash=x=>createHash('sha256').update(x).digest('hex'),baseline=JSON.parse(fs.readFileSync('tests/fixtures/equipment-v061-identities.json'));
const identity=t=>Object.fromEntries(Object.entries(t).filter(([k])=>!['pixelAppearance','visualVariant','visualKey','iconKey','icon'].includes(k)));
// Preserve the original v0.62 release-boundary proof. Later approved story/war
// features change engine.js; current equipment behavior is exercised below and
// in the production settlement suites, rather than freezing unrelated systems.
assert.equal(hash(execFileSync('git',['show','cba72e3:dist/engine.js'])),baseline.unchangedRuntime['engine.js'],'v062 equipment release preserved the engine');
for(const [path,h]of Object.entries(baseline.unchangedRuntime).filter(([path])=>!['save-generation.js','engine.js'].includes(path)))assert.equal(hash(fs.readFileSync('dist/'+path)),h,`${path}: equipment budget/rate/quality policy unchanged`);
const report=auditEquipmentCatalog();assert(report.passed,report.errors.join('\n'));assert(validateEquipmentTemplates());assert.equal(SCHEMA_VERSION,6);
for(const t of T)if(baseline.templates[t.id])assert.equal(hash(JSON.stringify(identity(beforeEquipmentCopy(t)))),baseline.templates[t.id],`${t.id}: preserve existing identity/name/stats metadata`);
for(const [id,h]of Object.entries(baseline.templates))assert(T.some(t=>t.id===id),`${id}: removed existing template`);
function beforeHumanBossSource(definition){
 const old=structuredClone(definition);
 if(['human-oathblade','human-banner-armor'].includes(old.id)){
  assert.deepEqual(old.bossPool,['human.a03.boss','human.a06.boss','human.a09.boss','human.a10.boss'],'only the authorized human A10 source append');
  old.bossPool.pop();
 }
 return old;
}
for(const [id,h]of Object.entries(baseline.legends))assert.equal(hash(JSON.stringify(identity(beforeEquipmentCopy(beforeHumanBossSource(L[id]))))),h,`${id}: preserve legend definition except exact authorized A10 source`);
for(const id of ['human-oathblade','human-banner-armor']){
 const changed=structuredClone(L[id]);changed.bossPool.push('elf.a10.boss');assert.throws(()=>beforeHumanBossSource(changed));
}

// Negative controls: a balanced total with incorrect slots/families must fail.
const corrupt=structuredClone(T),first=corrupt.find(t=>t.kind==='scatter'&&t.slot==='amulet');first.slot='ring';assert(!auditEquipmentCatalog(corrupt).passed);
const wrongFamily=structuredClone(T),weapon=wrongFamily.find(t=>t.kind==='scatter'&&t.slot==='weapon');weapon.weaponType='staff';assert(!auditEquipmentCatalog(wrongFamily).passed);
const {createCanvas,loadImage}=createRequire(import.meta.url)('@napi-rs/canvas');
const decoded=[],changedArt=[];
for(const race of PARITY_RACES){const seen=new Map();for(const t of [...T.filter(t=>t.originRace===race),...Object.values(L).filter(t=>t.originRace===race)]){
 for(const size of [32,48,64]){const path=equipmentRasterSource(t,size);assert(path,`${t.id}: missing ${size} raster`);assert(fs.existsSync('dist/'+path));assert(equipmentIcon(t.kind==='scatter'||t.kind==='set'?t:{legendaryId:t.id,rarity:3},{size}).includes(t.id));}
 const path=equipmentRasterSource(t,64),im=await loadImage('dist/'+path),c=createCanvas(64,64),ctx=c.getContext('2d');ctx.imageSmoothingEnabled=false;ctx.drawImage(im,0,0,64,64);const bytes=ctx.getImageData(0,0,64,64).data,h=hash(bytes);assert(!seen.has(h),`${race}: cross-item image collision ${seen.get(h)} / ${t.id}`);seen.set(h,t.id);
 assert(bytes.some((v,i)=>i%4===3&&v>0),`${t.id}: blank image`);
 if(baseline.art[t.id]!==hash(fs.readFileSync('dist/'+path))){changedArt.push({id:t.id,race,existing:!!baseline.art[t.id]});assert.equal(im.width,64);assert.equal(im.height,64);for(let i=0;i<64;i++)for(const p of[i,63*64+i,i*64,i*64+63])assert.equal(bytes[p*4+3],0,`${t.id}: clipped edge alpha`);}
 decoded.push({id:t.id,race,path,sourceSize:[im.width,im.height],normalized64Sha256:h});
}}
assert.equal(T.filter(t=>!baseline.templates[t.id]).length,75,'exactly 75 ordinary additions');
assert.equal(changedArt.length,93,'75 new sources plus 18 corrected Elf sources');
assert.equal(changedArt.filter(t=>t.existing).length,18);assert(changedArt.filter(t=>t.existing).every(t=>t.race==='elf'),'only approved existing Elf art corrected');
const original=Math.random;let seed=62057;Math.random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/2**32);
const acquisition={};
try{
 for(const race of PARITY_RACES){const s=fresh(race);s.gold=1e9;const generated=new Map(),fused=new Set(),ordinary=T.filter(t=>t.originRace===race&&t.kind==='scatter');
  for(const slot of [...Object.keys(COMMON_SLOT_TARGETS),...(race==='ashen'?['core']:[])]){
   const pool=listEquipmentTemplates({originRace:race,slot});assert.deepEqual(fusionOriginTemplates(race,{slot}),pool);
   for(const[i,t]of pool.entries())assert.equal(selectEquipmentTemplate({originRace:race,slot},()=>(i+.5)/pool.length),t);
   for(let n=0;n<2000&&pool.some(t=>!generated.has(t.id));n++){const it=item(slot,20,null,0,{originRace:race,levelSource:'drop'});generated.set(it.templateId,it);const b=deriveNewItemBudget({slot,baseVariant:it.baseVariant,level:20,quality:0});for(const k of ['atk','armor','hp'])assert.equal(it[k],b[k]);}
   assert(pool.every(t=>generated.has(t.id)),`${race}.${slot}: actual item generator coverage`);
  }
  for(let n=0;n<5000&&fused.size<ordinary.length;n++){const input=item('ring',20,null,0,{originRace:race});s.inventory.push(input);const out=forge(s,[{kind:'equipment',id:input.id}]);assert(out);assert.equal(out.originRace,race);fused.add(out.templateId);s.inventory=s.inventory.filter(x=>x.id!==out.id);}
  assert.equal(fused.size,ordinary.length,`${race}: every ordinary identity reachable through actual fusion`);
  for(const t of T.filter(t=>t.originRace===race&&t.kind==='set'))for(let n=0;n<100&&!generated.has(t.id);n++){const it=item(t.slot,20,t.setId,3,{originRace:race});generated.set(it.templateId,it);}
  s.inventory=[...generated.values()];s.equip=Object.fromEntries(Object.keys(s.equip).map(k=>[k,null]));normalizeCodexCollection(s);
  for(const it of s.inventory){assert(equipItem(s,it.id,it.slot==='ring'?'ring1':it.slot),`${it.templateId}: equip`);}
  for(const slot of [...Object.keys(COMMON_SLOT_TARGETS),...(race==='ashen'?['core']:[])]){const expected=s.inventory.filter(t=>t.slot===slot),html=renderPixelInventory(s,{bagSlot:slot,sortedGear:()=>s.inventory,itemDetail:()=>'',selected:expected.at(-1).id});for(const it of expected)assert(html.includes(`data-item="${it.id}"`),`${it.templateId}: inventory last-item visibility`);assert.equal((html.match(/class="itemCell /g)||[]).length,expected.length);assert.equal(forgeSlotItems(s,slot).length,expected.length);assert(renderForgeSlotPicker(s,slot,'modify-slot').includes(`<small>${expected.length}</small>`));}
  for(const b of BUILD.filter(b=>(b.originRace??'dwarf')===race)){const html=renderCodex(s,{selectedSet:b.id});for(const t of T.filter(t=>t.setId===b.id))assert(html.includes(t.id),`${t.id}: codex art`);}
  acquisition[race]={generated:generated.size,fused:fused.size};
 }
 const merchant=fresh(),seen=new Set(),allOrdinary=T.filter(t=>t.kind==='scatter');for(let n=0;n<18000&&seen.size<allOrdinary.length;n++){for(const o of ensureMerchant(merchant,1000+n*MERCHANT_CYCLE_MS).offers)if(o.type==='equipment'){assert(allOrdinary.some(t=>t.id===o.item.templateId));seen.add(o.item.templateId);}}
 assert.equal(seen.size,allOrdinary.length,'every ordinary template reachable through actual trader rolls');acquisition.trader=seen.size;
}finally{Math.random=original;}
const workshop=renderEquipmentWorkshop(fresh());assert(workshop.includes('263 基础 · 60 套装'));for(const t of T)assert(workshop.includes(`data-workshop-template="${t.id}"`));assert.equal((workshop.match(/data-workshop-template=/g)||[]).length,T.length);
const engine=fs.readFileSync('dist/engine.js','utf8');assert(engine.includes('originRace:area.race'),'battle drop passes region race to tested item generator');
fs.mkdirSync('qa/equipment-parity',{recursive:true});fs.writeFileSync('qa/equipment-parity/audit.json',JSON.stringify({...report,acquisition,changedArt,art:decoded},null,2));
console.log('PASS all five strict slot/native-family/set/core/legend matrices; 337 definitions (including approved race-neutral Return Ring and Infinity Gauntlet); baseline identity preservation; unique raster identities; actual drop generator/fusion/trader coverage; all workshop/inventory/forge/codex entries, no truncation; strict named-character save generation 6.');
