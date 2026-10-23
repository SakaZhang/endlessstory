import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import * as E from './dist/engine.js';
import {DWARF_MONSTERS,configureDwarfParameters,dwarfParameterSet,dwarfParameters,dwarfBudgetReady,dwarfEligibleMonsters} from './dist/dwarf-content.js';
import {initializeDwarfActor,nextDwarfAction,validDwarfActor} from './dist/dwarf-effects.js';
import {createControl} from './dist/multi-control.js';
const original=dwarfParameterSet(),additions=Object.values(DWARF_MONSTERS).filter(d=>d.area>=7);
assert.equal(Object.keys(DWARF_MONSTERS).length,44);assert.equal(additions.length,18);
assert.equal(new Set(Object.values(DWARF_MONSTERS).flatMap(d=>d.nodes)).size,24);
assert.deepEqual(additions.filter(d=>d.rank==='boss').map(d=>d.area),[9,10]);
const prior=execFileSync('git',['show','4e1a6a5:dist/dwarf-content.js'],{cwd:new URL('.',import.meta.url),encoding:'utf8'});
const oldDefs=JSON.parse(prior.split('export const DWARF_MONSTERS=')[1].split(';\n// One replaceable')[0]);
assert.equal(Object.keys(oldDefs).length,26);
for(const [id,d] of Object.entries(oldDefs))assert.deepEqual(DWARF_MONSTERS[id],d,'prior definition '+id);
const expected=[["dwarf.a07.normal.1", "银须钻虫", "physical", [["钻颚", 1.3, "physical", 9000, 3000, 0]]], ["dwarf.a07.normal.2", "霜纹晶蛛", "water", [["冰丝针", 1.15, "water", 8000, 3000, 0]]], ["dwarf.a07.normal.3", "无主铭文像", "light", [["封纹", 0, null, 15000, 3000, 0]]], ["dwarf.a07.elite", "银纹反震像", "earth", [["铭震", 1.45, "earth", 12000, 4000, 0]]], ["dwarf.a08.normal.1", "黑曜刃蜥", "physical", [["侧脊斩", 1.25, "physical", 8000, 3000, 0]]], ["dwarf.a08.normal.2", "岩脂伏行兽", "physical", [["黏脂撞击", 1.25, "earth", 9000, 3000, 0]]], ["dwarf.a08.normal.3", "断索升降傀", "physical", [["链索抽打", 1.45, "physical", 12000, 3000, 0]]], ["dwarf.a08.elite", "裂谷锁链监工", "physical", [["拖链横扫", 1.5, "physical", 12000, 4000, 0]]], ["dwarf.a09.normal.1", "晶髓噬者", "water", [["汲晶刺", 1.1, "water", 10000, 3000, 0]]], ["dwarf.a09.normal.2", "折光晶蛾", "light", [["折光束", 1.2, "light", 8000, 3000, 0]]], ["dwarf.a09.normal.3", "符骨守卷像", "earth", [["石卷压印", 1.45, "earth", 12000, 3000, 0]]], ["dwarf.a09.elite", "符骨藏锋者", "light", [["开卷光刃", 1.5, "light", 12000, 4000, 0]]], ["dwarf.a10.normal.1", "地心铸卫", "physical", [["熔核重斩", 1.3, "fire", 9000, 3000, 0]]], ["dwarf.a10.normal.2", "暗脉裂影", "dark", [["裂影穿刺", 1.2, "dark", 8000, 3000, 0]]], ["dwarf.a10.normal.3", "岩脂巨壳", "earth", [["沉壳震击", 1.5, "earth", 12000, 3000, 0]]], ["dwarf.a10.elite", "永铸试作体", "physical", [["核火贯击", 1.6, "physical", 12000, 4000, 0]]], ["dwarf.a09.boss", "符骨档主 · 赫铎", "light", [["裂卷光矛", 1.8, "light", 12000, 6000, 0], ["寒镜折射", 1.5, "water", 18000, 10000, 0], ["封库石印", 0, null, 24000, 18000, 0]]], ["dwarf.a10.boss", "永铸炉王 · 乌尔铎", "physical", [["地脉断铸", 2.1, "earth", 15000, 6000, 2000], ["黑炉潮汐", 1.6, "fire", 18000, 10000, 0], ["回收敕令", 1.35, "dark", 24000, 18000, 0]]]];
for(const [id,name,basic,skills] of expected){
 const d=DWARF_MONSTERS[id];assert.equal(d.name,name);assert.equal(d.basicAttackType,basic);assert.equal(d.skills.length,skills.length);
 for(let i=0;i<skills.length;i++){
  const [name,coef,type,cd,first,cast]=skills[i],s=d.skills[i];assert.equal(s.name,name);assert.equal(s.cooldownMs,cd);assert.equal(s.firstAtMs,first);assert.equal(s.castMs,cast);
  if(type)assert.deepEqual(s.effects[0],{type:'damage',coefficient:coef,damageType:type,powerBasis:type==='physical'?'atk':'elementalPower'});
  else assert.equal(s.effects[0].type,'shield');
  assert(s.effects.every(e=>['damage','shield','dot','lifesteal','reflect'].includes(e.type)));
 }
}
const fixture={id:'m4-content-test-only',testOnly:true,reviewed:false,areas:[1,2,3,4,5,6,7,8,9,10],fieldGroupChance:0,
 monsters:Object.fromEntries(Object.keys(DWARF_MONSTERS).map(id=>[id,{hp:100000,atk:1,armor:100000,elementalPower:10,basicIntervalMs:2200,rewardGold:4,rewardXp:20}])),
 clearRewards:Object.fromEntries(Array.from({length:10},(_,i)=>[i+1,{gold:20,xp:40,materialRounds:0,gearChance:0,markChance:0}]))};
function setup(){
 const s=E.fresh();E.normalizeHealth(s,s.lastSeen);E.normalizeExpedition(s);E.normalizeContentMigration(s);
 s.areaProgress.dwarf.unlocked=[1,2,3,4,5,6,7,8,9,10];s.areaProgress.dwarf.cleared=[1,2,3,4,5,6,7,8,9];s.contentMigration.reselectRequired=false;
 s.expedition={mode:'field',fieldId:'dwarf.a01.field',targetInstanceId:null,loop:false};return s;
}
const actor=d=>initializeDwarfActor({id:d.id,sourceInstanceId:d.nodes.at(-1),control:createControl(d.id,0),profile:{}},d,dwarfParameters(d.id),0);
try{
 assert(configureDwarfParameters({...original,areas:[1,2,3,4,5,6]}));assert(dwarfBudgetReady(6));assert(!dwarfBudgetReady(7));assert.equal(dwarfParameters('dwarf.a07.normal.1'),null);
 assert.equal(E.startInstanceEncounter(setup(),'dwarf.a07.field',Date.now()),null);assert.equal(dwarfEligibleMonsters('dwarf.a07.field','normal').length,0);
 assert(configureDwarfParameters(fixture));
 assert.equal(configureDwarfParameters({...fixture,areas:[1,2,3,11]}),false);
 assert.equal(configureDwarfParameters({...fixture,monsters:{...fixture.monsters,'dwarf.a10.boss':undefined}}),false);
 assert.equal(configureDwarfParameters({...fixture,clearRewards:{...fixture.clearRewards,10:undefined}}),false);
 let rng=91407;const random=Math.random;Math.random=()=>{rng=(Math.imul(rng,1664525)+1013904223)>>>0;return rng/2**32;};
 try{
  for(const d of additions){
   const u=actor(d),s0=d.skills[0];assert(validDwarfActor(u));
   assert.equal(nextDwarfAction(u,2200).effects[0].damageType,d.basicAttackType);
   const a=nextDwarfAction(u,s0.firstAtMs);
   if(s0.castMs){assert.equal(a,null);assert.equal(nextDwarfAction(u,s0.firstAtMs+s0.castMs).id,s0.id);}else assert.equal(a.id,s0.id);
   for(const skill of d.skills){
    const unit=actor(d);for(const other of d.skills)unit.control.cooldowns[other.id]=100000;
    unit.control.cooldowns[skill.id]=skill.firstAtMs;unit.nextBasicAt=100000;
    const selected=nextDwarfAction(unit,skill.firstAtMs);
    if(skill.castMs){assert.equal(selected,null);assert.equal(nextDwarfAction(unit,skill.firstAtMs+skill.castMs).id,skill.id);}else assert.equal(selected.id,skill.id);
    if(skill.maxCasts===2){assert.equal(nextDwarfAction(unit,skill.firstAtMs+skill.cooldownMs).id,skill.id);assert.notEqual(nextDwarfAction(unit,skill.firstAtMs+skill.cooldownMs*2)?.id,skill.id);}
   }
   if(d.trait?.openingShield){assert.equal(u.shield,8000);assert.equal(u.shieldUntil,8000);}
   let s,e;
   // Exercise the real random factory without rewriting definitions or actor IDs.
   for(let attempt=0;attempt<120;attempt++){
    s=setup();if(d.rank==='elite')s.dungeonRun={instanceId:d.nodes[0],runId:'m4-test',stage:3};
    e=E.startInstanceEncounter(s,d.nodes.at(-1),s.lastSeen);assert(e,'factory '+d.id);
    if(e.rewardDefinitionId===d.id)break;
   }
   assert.equal(e.rewardDefinitionId,d.id,'sampled factory '+d.id);assert(E.validSave(s),'factory save '+d.id);
   if(d.id==='dwarf.a08.elite'){
    assert.equal(e.enemies.length,3);assert.deepEqual(e.enemies.map(x=>x.hp),[60000,20000,20000]);assert.deepEqual(e.enemies.map(x=>x.atk),[.6,.2,.2]);
    for(const f of e.enemies.slice(1)){assert(f.follower);assert.equal(nextDwarfAction(f,s.lastSeen+3000).id,'basic');}
   }
   s.skills=[null,null,null,null];const leader=e.enemies[0];leader.control.cooldowns[s0.id]=s.lastSeen;leader.nextBasicAt=s.lastSeen+60000;
   E.step(s,e,s.nextActionAt);if(s0.castMs)for(let n=0;n<3&&!leader.skillUses[s0.id];n++)E.step(s,e,s.nextActionAt);
   assert.equal(leader.skillUses[s0.id],1,'production action '+d.id);assert(E.validSave(JSON.parse(JSON.stringify(s))),'post action save '+d.id);
   if(d.id==='dwarf.a08.elite'){
    for(const x of e.enemies)x.hp=1;
    for(let i=0;i<50&&!e.done;i++)E.step(s,e,s.nextActionAt);
    assert(e.done&&e.win,'real shared-budget encounter victory');assert.equal(e.targetId,null);assert(E.validSave(s),'actual terminal encounter save');
    const gold=s.gold,kills=s.kills;E.reward(s,e,s.lastHealthClock);assert(e.rewarded);assert.equal(s.gold-gold,24);assert.equal(s.kills-kills,1);
    const saved=JSON.stringify(s);E.reward(s,e,s.lastHealthClock);assert.equal(JSON.stringify(s),saved,'one reward per follower encounter');
   }
  }
 }finally{Math.random=random;}
 const reflected=actor(DWARF_MONSTERS['dwarf.a09.boss']);
 reflected.timedReflect={skillId:'dwarf.a09.boss:1',endsAt:6000,charges:1};assert(validDwarfActor(reflected));
 for(const r of [{...reflected.timedReflect,charges:2},{...reflected.timedReflect,endsAt:Infinity},{...reflected.timedReflect,skillId:'dwarf.a09.boss:0'},{...reflected.timedReflect,coefficient:999}]){
  assert(!validDwarfActor({...reflected,timedReflect:r}));
 }
 for(const id of ['dwarf.a09.normal.1','dwarf.a10.elite','dwarf.a10.boss']){
  const u=actor(DWARF_MONSTERS[id]);assert.equal(u.lifestealHealed,0);u.lifestealHealed=u.max*.15+.01;assert(!validDwarfActor(u));
 }
 console.log('PASS M4 exact18/44 monsters/24nodes, old26 unchanged, staged gates, all18 real factories/actions/saves, follower shared budget/reward, reflect and drain validation');
}finally{configureDwarfParameters(original);}
