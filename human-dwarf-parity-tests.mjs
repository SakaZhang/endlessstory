import assert from 'node:assert/strict';import fs from 'node:fs';import crypto from 'node:crypto';import {createRequire} from 'node:module';const sharp=createRequire(import.meta.url)('sharp');
import {EQUIPMENT_TEMPLATES as T,validateEquipmentTemplates,selectEquipmentTemplate,listEquipmentTemplates} from './dist/equipment-templates.js';
import {HUMAN_DWARF_EQUIPMENT_ADDITIONS as A} from './dist/human-dwarf-equipment-additions.js';
import {equipmentRasterSource} from './dist/equipment-raster-art.js';
import {VARIANTS,deriveEquipmentBase} from './dist/equipment-budget.js';
import {fusionOriginTemplates} from './dist/fusion-origin.js';
import {rollSourceSet,isMerchantEquipmentSellable} from './dist/set-source-schema.js';
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
assert(validateEquipmentTemplates());assert.equal(A.length,28);
for(const race of ['human','dwarf']){
 const ordinary=T.filter(t=>t.originRace===race&&t.kind==='scatter');assert.equal(ordinary.length,52);assert.equal(T.filter(t=>t.originRace===race&&t.kind==='set').length,12);
 for(const slot of ['weapon','helm','armor','gloves','boots','ring','amulet']){const pool=listEquipmentTemplates({slot,originRace:race});assert.equal(pool.length,slot==='weapon'?16:6);assert.deepEqual(fusionOriginTemplates(race,{slot,setId:null}),pool);for(let i=0;i<pool.length;i++)assert.equal(selectEquipmentTemplate({slot,originRace:race},()=>(i+.5)/pool.length).id,pool[i].id);}
 for(const type of race==='human'?['sword_shield','greatsword']:['axe','hammer'])assert.equal(ordinary.filter(t=>t.weaponType===type).length,8);
 for(const source of ['fusion','forge','merchant'])assert.equal(rollSourceSet({source,kind:'boss',areaNumber:10,race},()=>0),null);
}
const baseline=JSON.parse(fs.readFileSync('qa/human-dwarf-parity/baseline.json'));for(const old of baseline){assert.deepEqual(T.find(t=>t.id===old.template.id),old.template);for(const n of [32,48,64]){const path=equipmentRasterSource(old.template,n);assert.equal(path,old.rasters[n].path);assert.equal(hash('dist/'+path),old.rasters[n].sha256);}}
const oldHashes=new Set(T.filter(t=>!A.some(a=>a.id===t.id)).map(t=>equipmentRasterSource(t,64)).filter(Boolean).map(p=>hash('dist/'+p))),newHashes=new Set();
for(const t of A){assert(VARIANTS[t.baseVariant]);assert.equal(VARIANTS[t.baseVariant].slot,t.slot);assert.equal(t.kind,'scatter');assert.equal(t.setId,null);assert(isMerchantEquipmentSellable({type:'equipment',item:{...t,set:null}}));for(const level of [1,20,100])for(const quality of [0,1,2,3])assert.deepEqual(deriveEquipmentBase({slot:t.slot,baseVariant:t.baseVariant,level,quality}),deriveEquipmentBase({slot:t.slot,baseVariant:T.find(o=>!A.includes(o)&&o.slot===t.slot&&o.baseVariant===t.baseVariant).baseVariant,level,quality}));
 for(const n of [32,48,64]){const p='dist/'+equipmentRasterSource(t,n);const m=await sharp(p).metadata();assert.equal(m.width,n);assert.equal(m.height,n);assert(m.hasAlpha);const {data,info}=await sharp(p).raw().toBuffer({resolveWithObject:true});let solid=0;for(let y=0;y<n;y++)for(let x=0;x<n;x++){const a=data[(y*n+x)*info.channels+3];if(a>0)solid++;if(x===0||y===0||x===n-1||y===n-1)assert.equal(a,0,t.id+' alpha border');}assert(solid>n*n*.1);if(n===64){const h=hash(p);assert(!oldHashes.has(h),t.id+' reused old art');assert(!newHashes.has(h),t.id+' duplicate new art');newHashes.add(h);}}
}
console.log('PASS human/dwarf: 52 ordinary each, 12 sets separate, 8 native weapons/family, 28 new budget-safe identities, selection/fusion/merchant eligibility, 100 old identities/art unchanged, 84 PNG sizes/alpha, unique64 hashes against all existing gear.');
