import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
import {DWARF_MONSTERS,configureDwarfParameters,dwarfParameterSet,dwarfParameters,dwarfBudgetReady,dwarfEligibleMonsters} from './dist/dwarf-content.js';
import {initializeDwarfActor,nextDwarfAction,validDwarfActor} from './dist/dwarf-effects.js';
import {createControl} from './dist/multi-control.js';
const original=dwarfParameterSet();
const additions=Object.values(DWARF_MONSTERS).filter(d=>d.area>=4&&d.area<=6);
assert.equal(Object.keys(DWARF_MONSTERS).length,44);
assert.equal(additions.length,13);assert.equal(dwarfEligibleMonsters('dwarf.a07.field','normal').length,0);
const expected=[
 ['dwarf.a04.normal.1','渣火蜥','fire',1.05],['dwarf.a04.normal.2','烟囱灰蝠','wind',1.2],['dwarf.a04.normal.3','积盐炉壳','fire',1.4],['dwarf.a04.elite','鼓风监炉官','fire',1.45],
 ['dwarf.a05.normal.1','泉壁苔兽','water',1.2],['dwarf.a05.normal.2','冷雾晶蛾','water',1.15],['dwarf.a05.normal.3','石胆菌甲虫',null,0],['dwarf.a05.elite','寒泉汲髓兽','water',1.35],
 ['dwarf.a06.normal.1','炉池铸渣兵','fire',1.25],['dwarf.a06.normal.2','汽压游魂','water',1.15],['dwarf.a06.normal.3','沉炉搬运傀','physical',1.45],['dwarf.a06.elite','沉炉督造傀','physical',1.5],['dwarf.a06.boss','炉心守卫 · 断铸','fire',1.55]
];
for(const [id,name,type,coef] of expected){
 const d=DWARF_MONSTERS[id];assert.equal(d.name,name,id);
 if(type)assert.deepEqual(d.skills[0].effects[0],{type:'damage',coefficient:coef,damageType:type,powerBasis:type==='physical'?'atk':'elementalPower'});
 else assert.deepEqual(d.skills[0].effects,[{type:'shield',fraction:.08,seconds:6}]);
}
const fixture={id:'m3-content-explicit-test-only',testOnly:true,reviewed:false,areas:[1,2,3,4,5,6],fieldGroupChance:0,
 monsters:Object.fromEntries(Object.keys(DWARF_MONSTERS).map(id=>[id,{hp:100000,atk:1,armor:100000,elementalPower:10,basicIntervalMs:2200,rewardGold:4,rewardXp:20}])),
 clearRewards:Object.fromEntries([1,2,3,4,5,6].map(a=>[a,{gold:20,xp:40,materialRounds:1,gearChance:.35,markChance:.02}]))};
function setup(){
 const s=E.fresh();E.normalizeHealth(s,s.lastSeen);E.normalizeExpedition(s);E.normalizeContentMigration(s);
 s.areaProgress.dwarf.unlocked=[1,2,3,4,5,6];s.areaProgress.dwarf.cleared=[1,2,3,4,5];s.contentMigration.reselectRequired=false;
 s.expedition={mode:'field',fieldId:'dwarf.a01.field',targetInstanceId:null,loop:false};return s;
}
try{
 const old={...original,areas:[1,2,3]};assert(configureDwarfParameters(old));assert(dwarfBudgetReady(1));assert(!dwarfBudgetReady(4));
 assert.equal(dwarfParameters('dwarf.a04.normal.1'),null);assert.equal(dwarfEligibleMonsters('dwarf.a04.field','normal').length,0);
 assert.equal(E.startInstanceEncounter(setup(),'dwarf.a04.field',Date.now()),null);
 assert(E.startInstanceEncounter(setup(),'dwarf.a01.field',Date.now()));
 assert(configureDwarfParameters(fixture));
 for(const bad of [{...fixture,areas:[1,2,3,11]},{...fixture,areas:[1,2,3,4,4]},{...fixture,monsters:{...fixture.monsters,'dwarf.a04.elite':undefined}},{...fixture,clearRewards:{...fixture.clearRewards,4:undefined}}])assert.equal(configureDwarfParameters(bad),false);
 for(const d of additions){
  assert(dwarfBudgetReady(d.area));assert(dwarfEligibleMonsters(d.nodes.at(-1),d.rank).some(x=>x.id===d.id));
  const p=dwarfParameters(d.id),u=initializeDwarfActor({id:d.id,sourceInstanceId:d.nodes.at(-1),control:createControl(d.id,0),profile:{}},d,p,0);
  assert(validDwarfActor(u));
  const a=nextDwarfAction(u,d.skills[0].firstAtMs);assert.equal(a.id,d.skills[0].id);
  const basicUnit=initializeDwarfActor({id:d.id,sourceInstanceId:d.nodes.at(-1),control:createControl(d.id,0),profile:{}},d,p,0);
  const basic=nextDwarfAction(basicUnit,2200);assert.equal(basic.id,'basic');assert.equal(basic.effects[0].damageType,d.basicAttackType);assert.equal(basic.effects[0].powerBasis,d.basicAttackType==='physical'?'atk':'elementalPower');
  for(const skill of d.skills)assert.equal(skill.requiresHitForEffects,skill.effects.some(x=>x.type==='damage'));
  if(d.trait?.type==='lifesteal'){assert.equal(u.lifestealHealed,0);u.lifestealHealed=u.max*.15+.01;assert(!validDwarfActor(u));}

  // Actual production factory, not a proxy. Force one eligible species so every new ID is constructed.
  const s=setup();if(d.rank==='elite')s.dungeonRun={instanceId:d.nodes[0],runId:'m3-test',stage:3};
  const others=Object.values(DWARF_MONSTERS).filter(x=>x.id!==d.id&&x.nodes.includes(d.nodes.at(-1))&&x.rank===d.rank),nodes=others.map(x=>x.nodes);
  let e;try{others.forEach(x=>x.nodes=[]);e=E.startInstanceEncounter(s,d.nodes.at(-1),s.lastSeen);}finally{others.forEach((x,i)=>x.nodes=nodes[i]);}
  assert(e,'factory '+d.id);assert.equal(e.rewardDefinitionId,d.id);assert(e.enemies.every(x=>validDwarfActor(x)));assert(E.validSave(s),'factory save '+d.id);
  if(d.id==='dwarf.a06.elite'){assert.equal(e.enemies.length,3);assert.deepEqual(e.enemies.map(x=>x.hp),[60000,20000,20000]);assert.deepEqual(e.enemies.map(x=>x.atk),[.6,.2,.2]);}
  s.skills=[null,null,null,null];const leader=e.enemies[0];leader.control.cooldowns[d.skills[0].id]=s.lastSeen;leader.nextBasicAt=s.lastSeen+60000;
  E.step(s,e,s.nextActionAt);assert.equal(leader.skillUses[d.skills[0].id],1,'production typed action '+d.id);if(d.id==='dwarf.a05.normal.1')assert.equal(e.nextBasicSlow,1.15,'actual typed slow host');assert(E.validSave(JSON.parse(JSON.stringify(s))),'post-action save '+d.id);
 }
 // Source boss windup suppresses basics; bounded shield is not an HP trigger or priority cast.
 const d=DWARF_MONSTERS['dwarf.a06.boss'],u=initializeDwarfActor({id:d.id,sourceInstanceId:d.nodes[0],control:createControl(d.id,0),profile:{}},d,dwarfParameters(d.id),0);
 u.control.cooldowns[d.skills[0].id]=100000;
 assert.equal(nextDwarfAction(u,10000),null);assert.equal(u.control.preparing.completesAt,12000);
 assert.equal(nextDwarfAction(u,11000),null);assert.equal(nextDwarfAction(u,12000).id,d.skills[1].id);
 assert.equal(nextDwarfAction(u,18000).id,d.skills[2].id);assert.equal(nextDwarfAction(u,42000),null);assert.equal(nextDwarfAction(u,44000).id,d.skills[1].id);
 // Explicitly isolate cooldown-limited shield for its second and forbidden third casts.
 u.control.cooldowns[d.skills[1].id]=100000;
 assert.equal(nextDwarfAction(u,44001).id,d.skills[2].id);
 assert.notEqual(nextDwarfAction(u,68001)?.id,d.skills[2].id);assert.equal(u.skillUses[d.skills[2].id],2);
 console.log('PASS M3: exact13 typed definitions, inactive-area gate, 13 production factories, followers, boss windup and shield limit');
}finally{configureDwarfParameters(original);}
