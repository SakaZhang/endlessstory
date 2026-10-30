import assert from 'node:assert/strict';
import fs from 'node:fs';
import {POTION_RECIPE_CATALOG,potionRecipeAllows} from './dist/potion-catalog.js';
import {materialInventoryKey} from './dist/material-catalog.js';
import {MATERIALS,materialKey,MATERIAL_QUALITIES} from './dist/engine.js';
import {freshMaterialBrowser,browseMaterials,renderMaterialBrowserControls,materialBrowserTags} from './dist/material-browser.js';
const rows=Object.keys(MATERIALS).flatMap((material,i)=>[0,1,2,3].filter(q=>materialKey(material,q)).map(quality=>Object.freeze({material,quality,key:materialKey(material,quality),count:(i%7+1)*10})));Object.freeze(rows);
assert(rows.length>100);const before=JSON.stringify(rows),opts=freshMaterialBrowser();
const oldRandom=Math.random;Math.random=()=>{throw Error('Browsing must not consume RNG');};
for(const sort of ['name-asc','name-desc','quality-asc','quality-desc','count-asc','count-desc']){
 const sorted=browseMaterials(rows,MATERIALS,{sort});assert.equal(sorted.length,rows.length);assert.deepEqual(sorted,browseMaterials([...rows].reverse(),MATERIALS,{sort}),'ties independent of input order');
 const [key,direction]=sort.split('-'),value=m=>key==='name'?(MATERIALS[m.material]?.name??m.material):m[key];for(let i=1;i<sorted.length;i++){const a=value(sorted[i-1]),b=value(sorted[i]),cmp=typeof a==='string'?a.localeCompare(b,'zh-CN'):a-b;assert(direction==='asc'?cmp<=0:cmp>=0);}
}
assert.deepEqual(browseMaterials([2,100,10].map((count,i)=>({...rows[i],count})),MATERIALS,{sort:'count-asc'}).map(row=>row.count),[2,10,100]);
for(let quality=0;quality<4;quality++)assert(browseMaterials(rows,MATERIALS,{quality:String(quality)}).every(row=>row.quality===quality));
assert.equal(browseMaterials(rows,MATERIALS,{search:'  铁屑  '}).length,4);
assert.equal(browseMaterials(rows,MATERIALS,{search:'不存在的材料'}).length,0);
for(const [tag] of materialBrowserTags(MATERIALS)){const result=browseMaterials(rows,MATERIALS,{tag});assert(result.length);for(const row of result){const meta=MATERIALS[row.material];assert(tag.startsWith('tag:')?meta.tags.includes(tag.slice(4)):(tag==='use:base'&&meta.functionalTags?.includes('recoveryBase')||Object.values(POTION_RECIPE_CATALOG).some(r=>r.enabled&&r.id!=='potion-healing'&&potionRecipeAllows(r.id,tag==='use:base'?'main':'aux',row.material))));}}
for(const purpose of ['base','aux']){
 const actual=new Set(browseMaterials(rows,MATERIALS,{tag:'use:'+purpose}).map(row=>row.material));
 for(const [key,meta] of Object.entries(MATERIALS)){
  const allowed=!!(purpose==='base'&&meta.functionalTags?.includes('recoveryBase')||Object.values(POTION_RECIPE_CATALOG).some(r=>r.enabled&&r.id!=='potion-healing'&&potionRecipeAllows(r.id,purpose==='base'?'main':'aux',key)));
  assert.equal(actual.has(key),allowed,'authoritative role parity: '+key+' '+purpose);
  if(meta.storyOnly||meta.uniqueHeld)assert(!actual.has(key),'no protected materials falsely offered as potion inputs');
 }
}
const auxiliary=new Set(browseMaterials(rows,MATERIALS,{tag:'use:aux'}).map(row=>row.material));
for(const mapping of JSON.parse(fs.readFileSync(new URL('./content/material-recipe-expansion.json',import.meta.url))).mappings)assert(auxiliary.has(materialInventoryKey(mapping.material)),'expanded auxiliary '+mapping.name);
for(const material of JSON.parse(fs.readFileSync(new URL('./content/luck-potion-early-materials.json',import.meta.url))).materials)for(const tag of ['use:base','use:aux'])assert(browseMaterials(rows,MATERIALS,{tag}).some(row=>row.material===material.inventoryKey),'early luck dual role '+material.name);
assert(browseMaterials(rows,MATERIALS,{search:'铁',quality:'3',tag:'use:aux'}).some(row=>row.material==='goblin.mat.02'),'旧铆铁 is a valid earth resistance auxiliary');
const html=renderMaterialBrowserControls('bag',{search:'"><script>&\''},MATERIALS,MATERIAL_QUALITIES);assert(!html.includes('<script>'));assert(html.includes('&quot;&gt;&lt;script&gt;&amp;&#39;'));assert(html.includes('value="3"'));assert(!html.includes('传说'));
assert.deepEqual(opts,freshMaterialBrowser());assert.equal(JSON.stringify(rows),before);Math.random=oldRandom;
console.log('PASS material browser: >100 stacks, all six sorts + deterministic ties, four qualities, Chinese name search, real tags/purposes, empty result, HTML escaping, no input mutation/RNG.');
