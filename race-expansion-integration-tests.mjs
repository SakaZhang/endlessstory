import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as E from './dist/engine.js';
import {RACE_PACKS} from './dist/race-registry.js';
import {WORLD_MATERIALS,validWorldMaterialPool} from './dist/world-materials.js';
import {extendBattleManifest} from './dist/race-art.js';
import {potionRecipeAllows} from './dist/potion-catalog.js';
const root=new URL('./dist/',import.meta.url);
for(const [race,p] of Object.entries(RACE_PACKS)){
 const s=E.fresh(race);assert(E.validSave(s),race+' fresh');assert(E.validSave(JSON.parse(JSON.stringify(s))),race+' JSON');
 if(race==='dwarf')continue;
 assert.equal(p.tree.nodes.length,30);assert.equal(p.tree.nodes.reduce((n,x)=>n+x.cost,0),99);
 assert.equal(p.areas.length,10);assert.equal(Object.keys(p.materials).length,18);
 for(const [id,pool]of Object.entries(p.materialPools))assert(validWorldMaterialPool(pool),id);
 for(const item of s.inventory)assert.equal(item.originRace,race);
 for(const node of E.plannedNodes(s).filter(n=>n.id.startsWith(race+'.'))){const save=E.fresh(race);save.level=100;E.normalizeAreaProgress(save);save.areaProgress[race]={unlocked:[1,2,3,4,5,6,7,8,9,10],cleared:[1,2,3,4,5,6,7,8,9,10]};E.normalizeHealth(save,10000);const e=E.startInstanceEncounter(save,node.id,10000);assert(e,node.id);assert(e.enemies.every(u=>u.definitionId.startsWith(race+'.')));assert(E.validSave(save),node.id);}
 for(const d of p.legendaries){const item=E.legendaryItem(d.id,40);assert(item,d.id);const save=E.fresh(race);save.inventory.push(item);assert(E.equipItem(save,item.id));assert(E.validSave(save),d.id);}
}
assert(potionRecipeAllows('potion-healing','main','elf.dew_crown'));
const elf=E.baseStats(E.fresh('elf'));assert(Object.values(elf.elementAttack).every(x=>x===12));assert(Object.values(elf.elementResistance).every(x=>x===12));
assert.equal(E.racialGoldCost({race:'human'},40),36);assert.equal(E.racialGoldCost({race:'dwarf'},40),40);assert.equal(E.racialGoldCost({race:'human'},1),1);
const old=E.fresh('dwarf');E.normalizeAreaProgress(old);for(const r of ['human','elf','goblin','ashen'])old.areaProgress[r]={unlocked:[],cleared:[]};assert(E.normalizeAreaProgress(old));assert.equal(old.areaProgress.human.unlocked[0],1);assert(E.validSave(old));
const manifest=extendBattleManifest({});for(const [id,sprite]of Object.entries(manifest.sprites))for(const frame of sprite.frames)assert(fs.existsSync(new URL(frame.file,new URL('battle-assets/',root))),id+': '+frame.file);
for(const bg of manifest.backgrounds)assert(fs.existsSync(new URL(bg.file,new URL('battle-assets/',root))),bg.id);
console.log('PASS five real fresh saves; 40 regions and all node routing; 72 material catalogs/source pools; 8 race legends equip; aliases/innate/economy; retained old progress; native art references. Candidate balance/art approval separate.');
