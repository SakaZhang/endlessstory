// Regenerate only against the exact released v0.81.1 runtime, never the candidate.
import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {pathToFileURL} from 'node:url';import {createHash} from 'node:crypto';
const root=process.env.BASELINE_ENGINE_ROOT;if(!root)throw Error('Set BASELINE_ENGINE_ROOT to the extracted 812e4e35 runtime');
const digest=file=>createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex');
assert.equal(digest('dist/engine.js'),'051cc2c890a303af267c2f94c2cf1b3b3e675d951d5c1d83d7338d9558c00b5d','baseline engine must be exact812e4e35');
const E=await import(pathToFileURL(path.join(root,'dist/engine.js')));
Date.now=()=>1700000000000;let rng=812;Math.random=()=>((rng=Math.imul(rng,1664525)+1013904223>>>0)/2**32);
const levels=[1,20,60,100,101,150,250,1000],profiles=['naked','q2','goblin_spore','goblin_ambush','goblin_snare','legends','talents','mixed','passives','divine'],rows=[];
function fixture(race,level,profile){const s=E.fresh(race);s.level=level;if(profile!=='naked')for(const [n,socket] of Object.keys(s.equip).entries()){
 const slot=E.SOCKET_TYPE[socket],originRace=slot==='core'?'ashen':profile==='mixed'?['human','dwarf','elf','goblin'][n%4]:'goblin',set=profile.startsWith('goblin_')&&E.SET_SLOTS.includes(slot)?profile:null;
 const legend=profile==='legends'?(slot==='weapon'?'goblin-silent-ration':slot==='boots'?'goblin-silent-steps':null):null;
 const it=legend?E.legendaryItem(legend,level):E.item(slot,level,set,set?3:2,{originRace});it.special=null;
 if(profile==='divine'){E.applyForgeFavor(it);it.enhancement={version:2,model:'equipment-budget-m2-v1',level:5};}
 s.inventory.push(it);assert(E.equipItem(s,it.id,socket));}
 if(profile==='talents'){s.talents.heart=Math.floor((level-1)/2);s.talents.steel=level-1-s.talents.heart;}
 if(profile==='passives'&&level>=7){s.skillTree.presets[0].unlocked=['goblin.copper_brace','goblin.tendon_knots'];s.skillTree.presets[0].passive=[...s.skillTree.presets[0].unlocked];}
 E.normalizeHealth(s,s.lastSeen);assert(E.validSave(s),race+'/'+level+'/'+profile);return s;}
for(const level of levels)for(const profile of profiles){const state=fixture('goblin',level,profile);rows.push({race:'goblin',level,profile,state,base:E.baseStats(state),stats:E.stats(state)});}
for(const race of ['dwarf','human','elf','ashen'])for(const level of levels)for(const profile of ['naked','q2','legends','mixed']){const state=fixture(race,level,profile);rows.push({race,level,profile,state,base:E.baseStats(state),stats:E.stats(state)});}
const out=process.argv[2]??'fixtures/goblin-total-survival-v0812-baseline.json';const sourceHashes=Object.fromEntries(['dist/equipment-budget.js','dist/equipment-budget-adapter.js','dist/equipment-templates.js','dist/legendary-equipment.js','dist/equipment-enhancement.js','dist/races/goblin/equipment.js','dist/races/goblin/skills.js','dist/skill-tree-poison.js','dist/skill-tree-passives.js'].map(file=>[file,digest(file)]));fs.writeFileSync(out,JSON.stringify({sourceCommit:'812e4e35',method:'Exact released v0.81.1 engine-generated valid states and base/final stats. Deterministic clocks/RNG; Goblin 10 profiles x8 levels plus4 other-race controls x4 profiles x8 levels; no item/save migration.',rows,sourceHashes}).replace(/[^\x00-\x7f]/g,c=>'\\u'+c.charCodeAt(0).toString(16).padStart(4,'0'))+'\n');console.log(rows.length,fs.statSync(out).size,out);
