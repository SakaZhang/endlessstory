import {addTestEquipment} from './equipped-test-fixture.mjs';
import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
import {normalizeSkillTree} from './dist/skill-tree-state.js';
import {countInfinityCast} from './dist/infinity-gauntlet-combat.js';
import {ready,storage} from './infinity-gauntlet-tests.mjs';
import {craftInfinityGauntlet} from './dist/infinity-gauntlet-crafting.js';
function setup(skill='bellows_ward',node='dwarf.a01.field'){
 let s=ready();const tx=craftInfinityGauntlet(storage(s),s);assert(tx.ok);s=tx.game;const id=tx.value.id;assert(E.equipItem(s,id));s.level=100;normalizeSkillTree(s,E.SKILL_TREE_DEFINITION);const p=s.skillTree.presets[0];p.unlocked=E.SKILL_TREE_DEFINITION.nodes.map(n=>n.id);p.active=[skill,null,null,null];p.passive=[null,null];E.normalizeAreaProgress(s);s.areaProgress.dwarf={unlocked:[1,2,3,4,5,6,7,8,9,10],cleared:[1,2,3,4,5,6,7,8,9]};s.lastSeen=s.lastHealthClock=1000;s.nextBattleAt=0;s.restUntil=0;s.heroHp=E.stats(s).hp;
 const old=Math.random;Math.random=()=>2000/2**32;let e;try{e=E.startInstanceEncounter(s,node,1000);}finally{Math.random=old;}assert(e);e.rngState=123;e.rngDraws=0;for(const u of e.enemies){u.hp=u.max=1e7;u.atk=0;u.shield=0;u.control.stunUntil=1e9;}assert(E.validSave(s));return {s,e,id,skill};
}
function cast(f){f.e.treeSkillCooldowns={};if(f.e.treeEffects)f.e.treeEffects.hero.sources=[];if(f.e.playerShieldLayers)f.e.playerShieldLayers.layers=[];const logs=E.step(f.s,f.e,f.s.nextActionAt);assert(E.validSave(f.s));return logs;}
for(const node of ['dwarf.a01.field','dwarf.a03.boss']){
 const f=setup('bellows_ward',node),u=f.e.enemies[0];for(let i=1;i<=4;i++){cast(f);assert.equal(f.s.equipmentRuntime.byId[f.id].castCount,i);assert.equal(u.hp,1e7);}
 const saved=JSON.parse(JSON.stringify(f.s)),copy={...f,s:saved,e:saved.activeEncounter};assert.deepEqual(cast(f),cast(copy));assert.equal(u.hp,5e6);assert.equal(f.s.equipmentRuntime.byId[f.id].castCount,0);assert.deepEqual(f.s,copy.s);
 // A cooldown-blocked active attempt falls back to basic, never counts.
 const count=f.s.equipmentRuntime.byId[f.id].castCount;E.step(f.s,f.e,f.s.nextActionAt);assert.equal(f.s.equipmentRuntime.byId[f.id].castCount,count);
}
// Switch current targets at four casts: only newly selected target is affected.
{const f=setup();assert(f.e.enemies.length>1);for(let i=0;i<4;i++)cast(f);assert(E.setCombatTarget(f.s,f.e.enemies[1].id));cast(f);assert.equal(f.e.enemies[0].hp,1e7);assert.equal(f.e.enemies[1].hp,5e6);}
// Fifth active killing its bound target must not redirect to another enemy.
{const f=setup('fracture_strike');f.s.equipmentRuntime.byId[f.id].castCount=4;f.e.enemies[0].hp=1;f.e.enemies[0].armor=0;f.e.rngState=1;const logs=cast(f);assert.equal(f.e.enemies[0].hp,0);assert.equal(f.e.enemies[1].hp,1e7);assert(!logs.some(x=>x.startsWith('无限 ·')));assert.equal(f.s.equipmentRuntime.byId[f.id].castCount,0);}
// Active multi-hit does not add counts; a blocked/automatic/passive cast doesn't.
{const f=setup('cinder_barrage');cast(f);assert.equal(f.s.equipmentRuntime.byId[f.id].castCount,1);assert.equal(countInfinityCast(f.s,f.e,{extra:true,castId:'passive'},{activeSkill:true}),null);assert.equal(countInfinityCast(f.s,f.e,{extra:false,castId:'auto'},{activeSkill:false}),null);assert.equal(f.s.equipmentRuntime.byId[f.id].castCount,1);}
// Real equipment swap removes the count, restoring the item begins at zero.
{const f=setup();for(let i=0;i<3;i++)cast(f);f.e.done=true;f.e.win=false;f.s.activeEncounter=null;f.s.running=false;const other=addTestEquipment(f.s,{socket:'gloves',equip:false});assert(E.equipItem(f.s,other.id));assert(!f.s.equipmentRuntime.byId[f.id]);assert(E.equipItem(f.s,f.id));assert.equal(f.s.equipmentRuntime.byId[f.id].castCount,0);}
// Same equipped item carries partial counts across real dungeon stage transition.
{const f=setup('bellows_ward','dwarf.a01.dungeon');cast(f);assert.equal(f.s.equipmentRuntime.byId[f.id].castCount,1);for(const u of f.e.enemies)u.hp=1;f.s.skillTree.presets[0].active=['fracture_strike',null,null,null];f.e.rngState=1;cast(f);assert(f.e.done);E.reward(f.s,f.e,f.s.lastHealthClock);const count=f.s.equipmentRuntime.byId[f.id].castCount,e2=E.startInstanceEncounter(f.s,'dwarf.a01.dungeon',f.s.nextBattleAt);assert(e2);assert.equal(f.s.equipmentRuntime.byId[f.id].castCount,count);assert(E.validSave(f.s));}
// Online and offline use the exact same saved RNG and count trajectory.
{const f=setup('fracture_strike'),online=structuredClone(f.s),offline=structuredClone(f.s),end=61000;E.normalizePotions(online);E.normalizePotions(offline);let clock=1000;while(clock<end&&online.running){clock=online.nextActionAt;if(clock>end)break;const e=online.activeEncounter;E.step(online,e,clock);if(e.done){E.reward(online,e,clock);break;}}E.offline(offline,end);for(const key of ['equipmentRuntime','heroHp','kills','gold','xp'])assert.deepEqual(online[key],offline[key],key);assert.equal(online.activeEncounter?.rngState,offline.activeEncounter?.rngState);assert(E.validSave(offline));}
console.log('PASS Infinity real combat: self/multihit active, fifth50% field/boss, target swap/killing target, blocked/basic excluded, JSON and online/offline parity, equipment reset and dungeon continuity.');
