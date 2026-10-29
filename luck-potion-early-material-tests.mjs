import assert from 'node:assert/strict';
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
execFileSync(process.execPath,['tools/sync-luck-potion-early-materials.mjs','--check'],{stdio:'inherit'});
import {createHash} from 'node:crypto';
import * as E from './dist/engine.js';
import {EXPANSION_PACKS} from './dist/race-packs.js';
import {DWARF_MATERIAL_SOURCE_POOLS,DWARF_MATERIALS} from './dist/dwarf-material-catalog.js';
import {WORLD_MONSTERS} from './dist/world-content.js';
import {POTION_CATALOG,POTION_RECIPE_CATALOG,potionRecipeAllows} from './dist/potion-catalog.js';
import {renderPotionRecipe} from './dist/potion-recipe-ui.js';
import {materialQualityWeights} from './dist/material-loot-profile.js';
const originalRandom=Math.random;let randomSeed=123456;Math.random=()=>((randomSeed=(Math.imul(randomSeed,1664525)+1013904223)>>>0)/4294967296);
const source=JSON.parse(fs.readFileSync('content/luck-potion-early-materials.json'));
const digest=x=>createHash('sha256').update(JSON.stringify(x)).digest('hex');
// Authorized material-economy expansion may add role materialIds; every other recipe field stays pinned to the pre-expansion digest.
const recipeNonMaterialFields=Object.fromEntries(Object.entries(POTION_RECIPE_CATALOG).filter(([id])=>id!=='potion-luck').map(([id,r])=>[id,{...r,roles:r.roles.map(({materialIds,...fields})=>fields)}]));
assert.equal(digest(recipeNonMaterialFields),'2bf4254b8111c4afcd3319fb0397464ecbc599b36770d8328cc463b4397b0c7d','other recipe effects, costs, quantities, tags and policy unchanged');
assert.equal(digest(POTION_CATALOG),'3d2f1d866e9594bbfc058195f9f782a006bb25e24ac582c0bffbf54465d4c80a','all potion strengths unchanged');
const recipe=POTION_RECIPE_CATALOG['potion-luck'];assert.deepEqual(recipe.craftGoldByQuality,[6,8,10,12]);assert.equal(recipe.price,100);assert.equal(recipe.outputPerCraft,1);assert.equal(recipe.qualityPolicy,'same-quality');assert(recipe.roles.every(r=>r.unitsPerBottle===1));
for(const id of ['human.mat.12','human.mat.16','elf.mat.12','ashen.mat.15'])assert(potionRecipeAllows(recipe.id,'main',id));for(const id of ['elf.mat.14','human.mat.12'])assert(potionRecipeAllows(recipe.id,'aux',id));
// Existing learned recipe and old canonical inventory survive JSON reload unchanged.
const old=E.fresh('elf');old.gold=1000;old.learnedRecipes=[recipe.id];old.materialStacks={'human.mat.12|2':4};old.potionStacks={'luck|1':7};
const reloaded=JSON.parse(JSON.stringify(old));assert(E.validSave(reloaded));assert.deepEqual(reloaded,old);
const oldQuote=E.quotePotionRecipe(reloaded,recipe.id,2,{mainKey:'human.mat.12|2',auxKey:'human.mat.12|2'});assert(oldQuote);
const snapshot=JSON.stringify(reloaded);assert.equal(E.craftPotionRecipe(reloaded,{...oldQuote,gold:6}),null,'forged lower-quality price rejected');assert.equal(JSON.stringify(reloaded),snapshot);
assert(E.craftPotionRecipe(reloaded,oldQuote));assert.equal(reloaded.materialStacks['human.mat.12|2'],2);assert.equal(reloaded.potionStacks['luck|1'],7);assert.equal(reloaded.potionStacks['luck|2'],1);assert.deepEqual(reloaded.learnedRecipes,[recipe.id]);
const proofs=[];
for(const m of source.materials){
 const pack=m.race==='dwarf'?{materials:DWARF_MATERIALS,materialPools:DWARF_MATERIAL_SOURCE_POOLS}:EXPANSION_PACKS.find(p=>p.id===m.race);
 assert(pack.materials[m.id].functionalTags.includes('luckBase'));assert(pack.materials[m.id].functionalTags.includes('luckAux'));
 const supply=[];
 for(const area of [1,2])for(const kind of ['field','dungeon']){
  const nodeId=`${m.race}.a0${area}.${kind}`;
  const pools=Object.values(pack.materialPools).filter(p=>p.nodeId===nodeId&&WORLD_MONSTERS[p.monsterId]?.rank==='normal');
  assert(pools.length);const rows=pools.flatMap(p=>p.channels.filter(c=>['regular','recovery'].includes(c.channel)).flatMap(c=>c.entries.filter(e=>e.materialId===m.id).map(e=>({monster:p.monsterId,name:WORLD_MONSTERS[p.monsterId].name,nodeId,channel:c.channel,probability:c.hitProbability*e.weight,quality:e.qualityWeights}))));
  assert(rows.length,'ordinary repeatable creature supplies '+nodeId);
  assert(rows.some(r=>r.probability>=.3),'stable source '+nodeId);
  for(const r of rows)assert(r.quality.every((v,i)=>Math.abs(v-materialQualityWeights(area,kind)[i])<1e-12));
  supply.push(...rows);
 }
 for(let q=0;q<4;q++){
  const s=E.fresh(m.race);s.gold=1000;s.materialStacks={};s.potionStacks={};assert(E.learnRecipe(s,recipe.id));
  const key=m.inventoryKey+'|'+q;s.materialStacks[key]=2;
  const args={mainKey:key,auxKey:key,quantity:1},quote=E.quotePotionRecipe(s,recipe.id,q,args);
  assert(quote);assert.deepEqual(quote.inputs,[{key,quantity:2}]);assert.equal(quote.gold,E.racialGoldCost(s,[6,8,10,12][q]));
  const html=renderPotionRecipe(s,{id:recipe.id,quality:q,...args,quote});assert(html.includes(m.name));assert.equal((html.match(new RegExp('value="'+key.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'"','g'))??[]).length,2,'candidate appears in both dropdowns');
  const beforeGold=s.gold;assert(E.craftPotionRecipe(s,quote));assert.equal(s.gold,beforeGold-quote.gold);assert.equal(s.materialStacks[key],0);assert.equal(s.potionStacks['luck|'+q],1);assert(E.recipeKnown(s,recipe.id));assert(E.validSave(s));
  s.materialStacks[key]=1;let before=JSON.stringify(s);assert.equal(E.quotePotionRecipe(s,recipe.id,q,args),null);assert.equal(JSON.stringify(s),before);
  s.materialStacks[key]=4;const batch=E.quotePotionRecipe(s,recipe.id,q,{...args,quantity:2});assert(batch);assert.equal(batch.inputs[0].quantity,4);assert.equal(batch.gold,E.racialGoldCost(s,[6,8,10,12][q]*2));
  const other=m.inventoryKey+'|'+((q+1)%4);s.materialStacks[other]=10;assert.equal(E.quotePotionRecipe(s,recipe.id,q,{...args,auxKey:other}),null,'mixed quality rejected');
  if(q>0){s.materialStacks[key]=0;s.materialStacks[m.inventoryKey+'|0']=100;assert.equal(E.quotePotionRecipe(s,recipe.id,q,args),null,'ordinary materials cannot substitute higher quality');s.materialStacks[key]=2;s.gold=[6,8,10,12][q]-3;assert.equal(E.quotePotionRecipe(s,recipe.id,q,args),null,'higher quality cost not downgraded');}
 }
 // Actual production fight -> reward settlement, starting with zero materials.
 const base=E.fresh(m.race);base.level=100;base.materialStacks={};base.potionStacks={};base.gold=1000;E.learnRecipe(base,recipe.id);E.normalizeHealth(base,base.lastSeen);E.normalizeExpedition(base);base.heroHp=E.stats(base).hp;
 const encounter=E.startInstanceEncounter(base,`${m.race}.a01.field`,base.lastHealthClock);assert(encounter);
 for(const enemy of encounter.enemies){enemy.hp=1;enemy.shield=0;enemy.shieldUntil=0;enemy.armor=0;enemy.atk=0;enemy.elementalPower=0;}
 for(let n=0;n<100&&!encounter.done;n++)E.step(base,encounter,base.nextActionAt);assert(encounter.done&&encounter.win);
 let obtained=null,earned={};
 for(let seed=1;seed<=100&&!obtained;seed++){
  const trial=structuredClone(base),e=trial.activeEncounter;trial.materialStacks={...earned};e.id=`early-luck-${m.race}-${seed}`;if(e.affixState)e.affixState.battleId=e.id;e.rngState=Math.imul(seed,7919)>>>0;
  E.reward(trial,e,trial.lastHealthClock);earned={...trial.materialStacks};
  if(E.materialCount(trial,m.inventoryKey,0)>=2)obtained=trial;
 }
 assert(obtained,'actual A1 production settlement can supply two ordinary units: '+m.race+' '+JSON.stringify(encounter.enemies.map(e=>e.definitionId)));const key=m.inventoryKey+'|0';assert(E.craftPotionRecipe(obtained,E.quotePotionRecipe(obtained,recipe.id,0,{mainKey:key,auxKey:key})));assert.equal(obtained.potionStacks['luck|0'],1);assert(E.validSave(obtained));
 proofs.push({race:m.race,material:m.name,supply});
}
fs.mkdirSync('qa/luck-potion',{recursive:true});fs.writeFileSync('qa/luck-potion/early-supply-proof.json',JSON.stringify(proofs,null,2)+'\n');
console.log('PASS five-race A1/A2 ordinary-monster pools and qualities; production A1 settlement -> craft; 20 race-quality quotes/crafts; both UI dropdowns; two-unit dual-role/batch; insufficient/mixed/low-grade rejects; costs, old materials, learned recipe/save and all other recipes/effects preserved.');

Math.random=originalRandom;
