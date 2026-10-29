import assert from 'node:assert/strict';
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {POTION_RECIPE_CATALOG,potionInventoryKey,potionRecipeAllows} from './dist/potion-catalog.js';
import {WORLD_MATERIALS,worldInventoryKey} from './dist/world-materials.js';
import {fresh,learnRecipe,quotePotionRecipe,craftPotionRecipe,validSave,MATERIALS} from './dist/engine.js';
import {renderPotionRecipe} from './dist/potion-recipe-ui.js';
execFileSync(process.execPath,['tools/sync-material-recipe-expansion.mjs','--check'],{stdio:'inherit'});
const baseline=JSON.parse(fs.readFileSync('fixtures/material-recipe-baseline.json'));
const {mappings}=JSON.parse(fs.readFileSync('content/material-recipe-expansion.json'));
const expected=structuredClone(baseline);
for(const m of mappings)expected[m.recipe].roles.find(r=>r.role==='aux').materialIds.push(m.material);
assert.deepEqual(POTION_RECIPE_CATALOG,expected,'Only the exact nine approved auxiliary IDs may change; all prior material IDs and every other field retained');
for(const m of mappings){
 const meta=WORLD_MATERIALS[m.material];assert(meta&&!meta.storyOnly&&!meta.uniqueHeld&&meta.kind!=='宝石');assert(meta.sources.some(s=>s.endsWith('.field')));assert.equal(meta.name,m.name);
 assert(potionRecipeAllows(m.recipe,'aux',m.material));assert(!potionRecipeAllows(m.recipe,'main',m.material),'do not widen main role');
 const main=potionInventoryKey(baseline[m.recipe].roles.find(r=>r.role==='main').materialIds[0]);assert(MATERIALS[main]);
 for(let q=0;q<4;q++){
  const s=fresh();s.gold=1000;s.materialStacks={};learnRecipe(s,m.recipe);const mainKey=main+'|'+q,auxKey=m.material+'|'+q;s.materialStacks[mainKey]=3;s.materialStacks[auxKey]=3;
  const quote=quotePotionRecipe(s,m.recipe,q,{mainKey,auxKey,quantity:3});assert(quote);assert.equal(quote.gold,baseline[m.recipe].craftGoldByQuality[q]*3);assert.equal(quote.inputs.reduce((sum,r)=>sum+r.quantity,0),6);
  assert(renderPotionRecipe(s,{id:m.recipe,quality:q,mainKey,auxKey,quote}).includes(m.name));
  const before=JSON.stringify(s);assert.equal(quotePotionRecipe(s,m.recipe,q,{mainKey,auxKey:m.material+'|'+((q+1)%4)}),null);assert.equal(JSON.stringify(s),before);
  assert(craftPotionRecipe(s,quote));assert.equal(s.materialStacks[auxKey],0);assert.equal(s.materialStacks[mainKey],0);assert.equal(s.potionStacks[POTION_RECIPE_CATALOG[m.recipe].potionType+'|'+q],3);assert(validSave(s));assert.equal(craftPotionRecipe(s,quote),null,'stale quote cannot double consume');
 }
}
for(const m of Object.values(WORLD_MATERIALS).filter(m=>m.storyOnly||m.uniqueHeld||m.kind==='宝石'))for(const recipe of Object.keys(POTION_RECIPE_CATALOG))for(const role of ['main','aux'])assert(!potionRecipeAllows(recipe,role,worldInventoryKey(m.id)),m.id+' must remain excluded');
assert.deepEqual(POTION_RECIPE_CATALOG['potion-luck'],baseline['potion-luck'],'five-race early luck materials untouched');
console.log('PASS nine material auxiliary expansions × four qualities: exact pre-change catalog plus approved IDs, old ingredients/effects/costs retained, 10 protected materials excluded, atomic batch and UI choices.');
