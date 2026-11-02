import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
import {settleInfinityRecipe} from './dist/infinity-gauntlet-state.js';
import {INFINITY_GAUNTLET_MATERIALS} from './dist/infinity-gauntlet-content.js';
for(const race of ['dwarf','human','elf','goblin','ashen']){
 const s=E.fresh(race);s.gold=1000;const keys=INFINITY_GAUNTLET_MATERIALS.map(m=>m.material+'|3');for(const k of keys)s.materialStacks[k]=1;
 const raw=JSON.stringify(s);let draws=0;assert.equal(settleInfinityRecipe(s,{instanceId:race+'.a01.dungeon',kind:'dungeon',done:true,win:true,dungeonStage:3,rewarded:true},{random:()=>{draws++;return 0},instances:E.INSTANCES}),false);assert.equal(draws,0);assert.equal(JSON.stringify(s),raw);
 const item=E.forge(s,keys);assert.equal(item.legendaryId,'infinity-gauntlet');assert(E.validSave(s));assert(s.infinityGauntlet.crafted);assert.equal(E.forge(s,keys),null);
}
console.log('PASS retired Infinity recipe: no recipe RNG/loot or state mutation; all five races fuse directly without learned recipe.');
