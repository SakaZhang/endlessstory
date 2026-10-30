import assert from 'node:assert/strict';
import fs from 'node:fs';
import {RACE_PACK as p,planSkill,modifySkillPlan,createRuntime,validRuntime,applyReactiveEffect,onEnemyAction} from './dist/races/goblin/index.js';
import {createTreeEffectHost} from './dist/skill-tree-effect-host.js';
import {createSkillPoison,applySkillPoison,advanceSkillPoison} from './dist/skill-tree-poison.js';
import {poisonTiming} from './dist/races/goblin/skills.js';
assert.equal(p.areas.length,10);assert.equal(Object.keys(p.monsters).length,43);assert.equal(Object.keys(p.materials).length,18);assert.equal(p.equipment.filter(x=>x.kind==='scatter').length,52);assert.equal(p.equipment.filter(x=>x.kind==='set').length,12);assert.equal(p.legendaries.length,2);
assert.equal(p.tree.nodes.length,30);assert.equal(p.tree.nodes.filter(n=>n.kind==='active').length,21);assert.equal(p.tree.nodes.reduce((n,x)=>n+x.cost,0),99);
for(const branch of ['poison','ambush','contraption']){const nodes=p.tree.nodes.filter(n=>n.branch===branch);assert.equal(nodes.reduce((n,x)=>n+x.cost,0),26);assert.equal(nodes.filter(n=>n.kind==='active').length,6);}
for(const n of p.tree.nodes)for(const pre of n.requires)assert(p.tree.nodes.some(n=>n.id===pre));
for(const pool of Object.values(p.materialPools))for(const c of pool.channels){assert(c.hitProbability>=0&&c.hitProbability<=1);if(c.entries.length)assert(Math.abs(c.entries.reduce((n,x)=>n+x.weight,0)-1)<1e-8);for(const row of c.entries){assert(p.materials[row.materialId].sources.includes(pool.nodeId));assert(!p.materials[row.materialId].storyOnly);}}
for(const area of p.areas)for(const kind of ['field','dungeon']){const node=area.id+'.'+kind;assert(Object.values(p.materials).some(m=>m.functionalTags.includes('recoveryBase')&&m.sources.includes(node)));assert(p.materials['goblin.infinity_gem_goblin'].sources.includes(node));}
let plans=0,effects=0;
for(const skillId of Object.keys(p.skills))for(const weaponType of ['dagger','sword','hammer']){
 const targets=[{id:'a',alive:true,hp:85,maxHp:100,poisonLayers:5},{id:'b',alive:true,hp:20,maxHp:100,poisonLayers:1}];const hero={hp:60,maxHp:100,eligibleDebuffIds:['legacy:heroBurn']};const plan=planSkill({skillId,castId:skillId+weaponType,weaponType,selectedTargetId:'a',targets,hero,stats:{atk:100,hp:100,armor:50}});assert(plan,skillId);plans++;
 const s={heroHp:60},e={heroHp:60,enemies:targets.map(t=>({...t})),heroBurn:1};const host=createTreeEffectHost(s,e,{stats:{hp:100},combatClock:0,applyStun:()=>true,interrupt:()=>true});assert(host);let runtime=createRuntime();
 for(const action of plan.actions)for(const effect of action.effects??[]){if(effect.type==='poison'){assert.equal(effect.fractionPerLayer,.03);assert.equal(effect.timing.maxLayers,5);}else if(effect.type==='raceReactive'){runtime=applyReactiveEffect(runtime,effect,0);assert(validRuntime(runtime));}else {assert.notEqual(host.applyEffect(action.targetId,effect),false,skillId+' '+effect.type);effects++;}}
 const linked=modifySkillPlan(plan,{setCounts:{goblin_spore:4,goblin_ambush:4,goblin_snare:4},targets});assert(linked);assert.equal(JSON.stringify(plan),JSON.stringify(planSkill({skillId,castId:skillId+weaponType,weaponType,selectedTargetId:'a',targets,hero,stats:{atk:100,hp:100,armor:50}})));
}
let poison=createSkillPoison('a',poisonTiming,0);for(let i=0;i<8;i++)poison=applySkillPoison(poison,{enemyId:'a',sourceId:'goblin.venom_cut',combatClock:0});assert.equal(poison.layers.length,5);const tick=advanceSkillPoison(poison,{enemyId:'a',combatClock:3000,targetMaxHp:1000});assert.equal(tick.ticks[0].damage,150);assert.equal(tick.ticks[0].canCrit,false);assert.equal(tick.ticks[0].globalDamageMultiplierApplies,false);
const trap=planSkill({skillId:'goblin.rattle_decoy',castId:'trap',hero:{hp:100},stats:{atk:100,hp:100}}).actions[0].effects[0];let runtime=applyReactiveEffect(createRuntime(),trap,0);
for(let n=0;n<2;n++){const out=onEnemyAction({runtime:JSON.parse(JSON.stringify(runtime)),event:{direct:true,attackerId:'a',clock:1000+n*1000},hero:{hp:100},targets:[{id:'a',alive:true}]});assert.equal(out.actions.length,1);assert.equal(out.actions[0].reaperEligible,false);runtime=out.runtime;}assert.equal(runtime.traps.length,0);
for(const [id,row]of Object.entries(p.art.monsters)){assert.equal(row.frames.length,9);assert.equal(row.facing,'left');for(const f of row.frames)assert(fs.existsSync('dist/'+f.file),id);}
assert.equal(new Set(Object.values(p.art.monsters).map(r=>r.sourceAtlas+':'+r.sourceRow)).size,43);
for(const kind of ['equipment','skills','materials','areas'])for(const row of Object.values(p.art[kind]))assert(fs.existsSync('dist/'+row.file));
console.log(`PASS goblin: 43 unique monster rows, 18 canonical materials, 10 recovery/gem regions, 52+12 equipment, 2 legends, 99 points; ${plans} plans / ${effects} actual effect-host applications; capped poison and finite reactive save roundtrip.`);
for(const id of ['goblin.a06.elite','goblin.a07.elite','goblin.a09.boss']){const trait=p.monsters[id].trait;assert.equal(trait.type,'followers');assert(Math.abs(trait.shares.reduce((a,b)=>a+b,0)-1)<1e-10);assert.equal(trait.shares.length,id.endsWith('boss')?4:5);assert(p.art.monsters[trait.followerMonsterId]);assert.equal(p.monsters[trait.followerMonsterId].area,p.monsters[id].area);}
console.log('PASS Goblin retinues: A06/A07 elite5targets, A09boss4targets, budgetshares sum1, samearea ordinarynativeart.');
for(const baseAtk of [0,1,20,100,10000]){
 const plan=planSkill({skillId:'goblin.venom_cut',castId:'cap'+baseAtk,weaponType:'sword',selectedTargetId:'a',targets:[{id:'a',alive:true,baseAtk}],stats:{atk:100,hp:100}}),fx=plan.actions[0].effects.find(e=>e.type==='attackDown');assert.equal(fx.amount,Math.min(8,baseAtk*.25));
 const host=createTreeEffectHost({heroHp:100},{heroHp:100,enemies:[{id:'a',hp:100}]},{stats:{hp:100}});assert(host.applyEffect('a',fx));assert(host.applyEffect('a',fx));assert.equal(host.get('a','attackDown'),fx.amount);
 const trap=planSkill({skillId:'goblin.snare_wire',castId:'trapcap',stats:{atk:100,hp:100}}).actions[0].effects[0],runtime=applyReactiveEffect(createRuntime(),trap,0),r=onEnemyAction({runtime,event:{direct:true,attackerId:'a',clock:1000},hero:{hp:100},targets:[{id:'a',alive:true,baseAtk}]});const down=r.actions[0].effects.find(e=>e.type==='attackDown');assert.equal(down?.amount??0,Math.min(12,baseAtk*.25));
}
console.log('PASS Goblin-only25%baseATK weakeningcap: zero/low/high/bossbaselines, repeatedsource noadditivepile, reactiveper-target cap.');
