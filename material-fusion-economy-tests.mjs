import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {materialFusionQualityWeights,favorableQualityProbabilities,materialFusionSlotBias} from './dist/material-fusion-policy.js';
import {fresh,forge,fusionQualityWeights,fusionWeights,previewMaterialFusion,MATERIALS,validSave} from './dist/engine.js';
import {renderMaterialFusionPreview} from './dist/material-fusion-ui.js';
import {WORLD_MATERIALS,worldInventoryKey} from './dist/world-materials.js';
const anchors=[[30,50,17,3],[27,49,20,4],[0,35,55,10],[0,0,70,30]];
for(let q=0;q<4;q++)assert.deepEqual(fusionQualityWeights(Array(5).fill('铁屑|'+q)),anchors[q]);
let upgrades=0;
for(let code=0;code<1024;code++){
 const qs=Array.from({length:5},(_,i)=>(code>>2*i)&3),a=materialFusionQualityWeights(qs);assert(Math.abs(a.reduce((s,w)=>s+w)-100)<1e-10);
 for(let j=0;j<5;j++)if(qs[j]<3){const next=[...qs];next[j]++;const b=materialFusionQualityWeights(next);for(let k=0;k<3;k++)assert(b.slice(0,k+1).reduce((s,w)=>s+w)<=a.slice(0,k+1).reduce((s,w)=>s+w)+1e-10);upgrades++;}
}
for(let n=1;n<5;n++)for(let code=0;code<4**n;code++){const q=Array.from({length:n},(_,i)=>(code>>2*i)&3),a=q.reduce((s,v)=>s+v)/n;assert.deepEqual(materialFusionQualityWeights(q),[50-4*n-3*a,40+2*n-a,9+1.6*n+3*a,1+.4*n+a]);}
assert.deepEqual(fusionWeights(['铁屑']).slots,{weapon:4,helm:3,armor:4,gloves:3,boots:3,ring:2,amulet:2,core:2});
for(const m of Object.values(WORLD_MATERIALS)){
 if(m.storyOnly||m.uniqueHeld||m.kind==='宝石')assert.equal(materialFusionSlotBias(m),null);
 else if(!['铁屑','炉火晶','灰根草','誓约残片'].includes(worldInventoryKey(m.id)))assert(materialFusionSlotBias(m),m.id+' needs meaningful direction');
}
assert(fusionWeights(['human.mat.03']).slots.gloves>fusionWeights(['human.mat.03']).slots.helm);
assert(fusionWeights(['goblin.mat.02']).slots.weapon>fusionWeights(['goblin.mat.02']).slots.ring);
const s=fresh('human');s.materialStacks['铁屑|3']=5;s.gold=100;
const original=Math.random;Math.random=()=>{throw Error('preview must not roll');};
let preview;try{const before=JSON.stringify(s);preview=previewMaterialFusion(s,Array(5).fill('铁屑|3'));assert.equal(JSON.stringify(s),before);assert.equal(preview.minimumQuality,2);assert(Math.abs(preview.qualityProbabilities[3]-.3)<1e-12);assert.equal(preview.gold,36);assert.equal(previewMaterialFusion(s,[{kind:'equipment',id:'x'}]),null);}finally{Math.random=original;}
for(const race of ['human','dwarf','elf','goblin','ashen']){const p=previewMaterialFusion(fresh(race),Array(5).fill('灰根草|3'));assert.equal(p.potionChance,.85);assert(Math.abs(Object.values(p.slotProbabilities).reduce((a,b)=>a+b)-1)<1e-12);assert.equal(Object.hasOwn(p.slotProbabilities,'core'),race==='ashen');}
const html=renderMaterialFusionPreview(preview);assert(html.includes('本次最低优良'));assert(html.includes('30%'));assert(html.includes('当前纯材料融合预览'));
assert(readFileSync(new URL('./dist/app.js',import.meta.url),'utf8').includes('renderMaterialFusionPreview(previewMaterialFusion(s,selection))'));
// Production Monte Carlo: actual item creation, independent luck draw and consumption, no legendary/set source changes.
let seed=29348;Math.random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/2**32);
const samples=[];
try{for(const q of [0,1,2,3]){const save=fresh('human');save.gold=1e8;save.materialStacks={['铁屑|'+q]:60000};const counts=[0,0,0,0];for(let i=0;i<10000;i++){const out=forge(save,Array(5).fill('铁屑|'+q));assert(out&&!out.set&&!out.legendaryId);counts[out.rarity]++;save.inventory=[];}assert.equal(save.materialStacks['铁屑|'+q],10000);assert.equal(save.gold,1e8-360000);for(let i=0;i<4;i++){const p=anchors[q][i]/100,sigma=Math.sqrt(10000*p*(1-p));assert(Math.abs(counts[i]-10000*p)<=6*sigma+1);}assert(validSave(save));samples.push({q,counts});}}
finally{Math.random=original;}
console.log(JSON.stringify(samples));
console.log('PASS material fusion: 1024 combinations, '+upgrades+' monotonic upgrades, legacy 1–4 inputs, directions/protected metadata, read-only exact preview.');
