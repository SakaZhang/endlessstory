import assert from 'node:assert/strict';
import * as A from './dist/races/ashen/skills.js';
import * as E from './dist/engine.js';
import {applyRaceRuntimeEffect,raceRuntimeContext} from './dist/race-runtime.js';
import {applyEquipmentRuntimeChange,validEquipmentRuntime} from './dist/equipment-runtime.js';
const clone=x=>structuredClone(x),normal=(resource,amount,operation='add')=>({type:'raceResource',resource,amount,operation}),bonus=resource=>({...normal(resource,resource==='heat'?5:1),setSource:resource==='heat'?'ashen.caldera':'ashen.strata',sourceId:resource==='heat'?'ashen.kindle':'ashen.mantle'});
let r=A.createRuntime();assert(A.validRuntime(r));assert.deepEqual(A.reconcileRuntimeSets(r,{}),r);
for(const resource of ['heat','shards']){
 const cap=resource==='heat'?100:6,max=resource==='heat'?25:2,field=resource==='heat'?'setHeat':'setShards';
 r=A.applyRaceEffects(A.createRuntime(),[normal(resource,999)]);assert.equal(r[resource],cap);
 for(let i=0;i<20;i++)r=A.applyRaceEffects(r,[bonus(resource)]);
 assert.equal(r[resource],cap+max);assert.equal(r[field],max);
 r=A.applyRaceEffects(r,[normal(resource,999)]);assert.equal(r[resource],cap+max);assert.equal(r[field],max);
 const saved=JSON.stringify(r);assert(A.validRuntime(JSON.parse(saved)));assert.deepEqual(A.reconcileRuntimeSets(r,{'ashen.caldera':2,'ashen.strata':2}),r);
 const drained=A.applyRaceEffects(r,[normal(resource,max+1,'spend')]);assert.equal(drained[resource],cap-1);assert.equal(drained[field],0);
 const removed=A.reconcileRuntimeSets(r,{});assert.equal(removed[resource],cap);assert(!Object.hasOwn(removed,field));assert.deepEqual(A.reconcileRuntimeSets(removed,{'ashen.caldera':4,'ashen.strata':4}),removed);
 const low=A.applyRaceEffects(A.createRuntime(),[bonus(resource),normal(resource,1)]);assert.equal(low[field],bonus(resource).amount);assert.equal(low[resource],bonus(resource).amount+1);
 const malformed=clone(r);malformed[field]=null;assert(!A.validRuntime(malformed));malformed[field]=max+1;assert(!A.validRuntime(malformed));delete malformed[field];assert(!A.validRuntime(malformed));
 assert.equal(A.applyRaceEffects(r,[{...bonus(resource),setSource:'wrong'}]),null);assert.equal(A.applyRaceEffects(r,[{...bonus(resource),sourceId:'ashen.salve'}]),null);
 assert.equal(A.applyRaceEffects(r,[normal(resource,cap+max+1,'spend')]),null);
}
const stats={atk:100,hp:1000,armor:100,count:{'ashen.strata':4}},full={...A.createRuntime(),shards:8,setShards:2,heat:125,setHeat:25};
const plan=(key,counts=stats.count)=>A.planSkill({skillId:'ashen.'+key,castId:'test',weaponType:'armguard',selectedTargetId:'enemy',targets:[{id:'enemy',alive:true,baseAtk:100,baseArmor:100}],stats:{...stats,count:counts},context:{runtime:full}});
for(const [key,n]of [['fracture',8],['cleave',3],['rebuild',3],['overload',70],['vent',40],['anneal',30]])assert.equal(plan(key).actions.flatMap(a=>a.effects??[]).find(e=>e.operation==='spend').amount,n);
assert.equal(plan('fracture',{'ashen.strata':2}).actions.flatMap(a=>a.effects??[]).find(e=>e.operation==='spend').amount,6);
for(const key of ['kindle','surge','temper','mantle']){
 const p=A.modifySkillPlan(plan(key),{setCounts:{'ashen.caldera':2,'ashen.strata':2}}),effects=p.actions.flatMap(a=>a.effects??[]).filter(e=>e.type==='raceResource');assert.equal(effects.length,2);assert(!effects[0].setSource);assert(effects[1].setSource);assert(A.applyRaceEffects(A.createRuntime(),effects));
}
// Equipment lifecycle: stale/invalid map cannot mutate resources; replacement below threshold destroys only reserve.
const s=E.fresh('ashen');for(const slot of ['helm','armor']){const it=E.item(slot,90,'ashen.strata',3,{originRace:'ashen'});s.inventory.push(it);assert(E.equipItem(s,it.id));}
s.activeEncounter={raceRuntime:{race:'ashen',state:clone(full)}};delete s.activeEncounter.raceRuntime.state.setHeat;s.activeEncounter.raceRuntime.state.heat=100;assert(validEquipmentRuntime(s));
const old=clone(s),next={...s.equip,helm:null};assert.equal(applyEquipmentRuntimeChange(s,{...s.equip,helm:'nope'},next),false);assert.deepEqual(s,old);
assert(applyEquipmentRuntimeChange(s,s.equip,next));s.equip=next;assert.equal(s.activeEncounter.raceRuntime.state.shards,6);assert.equal(s.activeEncounter.raceRuntime.state.heat,100);assert(validEquipmentRuntime(s));
const restored={...s.equip,helm:old.equip.helm};assert(applyEquipmentRuntimeChange(s,s.equip,restored));s.equip=restored;assert.equal(s.activeEncounter.raceRuntime.state.shards,6);assert(!Object.hasOwn(s.activeEncounter.raceRuntime.state,'setShards'));
console.log('PASS v088 source-tagged ashen reserves: base caps, bonus caps, spend, fracture8, swap clearing/readd no free value, reload, malformed ledgers/effects, unchanged other spend limits.');

const live=E.fresh('ashen');live.level=100;
for(const [slot,set]of [['helm','ashen.caldera'],['armor','ashen.caldera'],['gloves','ashen.strata'],['boots','ashen.strata']]){const it=E.item(slot,90,set,3,{originRace:'ashen'});live.inventory.push(it);assert(E.equipItem(live,it.id));}
E.normalizeHealth(live,live.lastSeen);E.normalizeExpedition(live);live.heroHp=E.stats(live).hp;
const enc=E.startInstanceEncounter(live,'ashen.a01.field',live.lastHealthClock);assert(enc);raceRuntimeContext(enc,'ashen');
for(const res of ['heat','shards']){applyRaceRuntimeEffect(enc,'ashen',normal(res,1000));for(let i=0;i<10;i++)applyRaceRuntimeEffect(enc,'ashen',bonus(res));}
assert.equal(enc.raceRuntime.state.heat,125);assert.equal(enc.raceRuntime.state.shards,8);assert(E.validSave(live),'production save accepts both source-tagged ledgers');
assert(E.validSave(JSON.parse(JSON.stringify(live))),'reload accepts new runtime');
const oldRuntime=clone(live);oldRuntime.activeEncounter.raceRuntime.state=A.createRuntime();assert(E.validSave(oldRuntime),'legacy v1 runtime remains legal');
const badSave=clone(live);delete badSave.activeEncounter.raceRuntime.state.setShards;assert(!E.validSave(badSave),'untagged excessive resource rejected');
const beforeAction=JSON.stringify(enc.raceRuntime);const clock=live.lastSeen;live.running=false;E.offline(live,clock+1000);assert.equal(JSON.stringify(enc.raceRuntime),beforeAction,'paused elapsed wall time cannot generate resource');
const oldGloves=live.equip.gloves;const ordinary=E.item('gloves',90,null,3,{originRace:'ashen'});live.inventory.push(ordinary);assert(E.equipItem(live,ordinary.id));assert.equal(enc.raceRuntime.state.shards,6);assert.equal(enc.raceRuntime.state.heat,125);assert(E.validSave(live));assert(E.equipItem(live,oldGloves));assert.equal(enc.raceRuntime.state.shards,6);assert(E.validSave(live));
console.log('PASS production active encounter/validSave and JSON reload accept tagged reserves, reject untagged excess, paused time unchanged, gear replacement clears only own reserve.');
const {planTreeSkill,validTreeSkillPlan}=await import('./dist/skill-tree-consumer.js');
for(const key of ['kindle','surge','temper','mantle','fracture']){
 const skillId='ashen.'+key,p=planTreeSkill({skillId,castId:'production-plan',weaponType:'armguard',config:{cooldownMs:A.skills[skillId].cooldownMs},stats:{...stats,count:{'ashen.caldera':2,'ashen.strata':4}},context:{runtime:full},hero:{hp:500,maxHp:1000,eligibleDebuffIds:[]},selectedTargetId:'enemy',targets:[{id:'enemy',alive:true,hp:100,maxHp:100,baseAtk:100,baseArmor:100}]});
 assert(p&&validTreeSkillPlan(p),key+' production planner');const holder={raceRuntime:{race:'ashen',state:clone(full)}};for(const fx of p.actions.flatMap(a=>a.effects??[]).filter(e=>e.type==='raceResource'))assert(applyRaceRuntimeEffect(holder,'ashen',fx));assert(A.validRuntime(holder.raceRuntime.state));
 if(key==='fracture'){assert.equal(holder.raceRuntime.state.shards,0);assert.equal(holder.raceRuntime.state.setShards,0);assert(Math.abs(p.actions.find(a=>a.kind==='hit').coefficient-2.944)<1e-9);}
}
console.log('PASS actual planTreeSkill -> validTreeSkillPlan -> applyRaceRuntimeEffect integrates tagged adds and 8-shard fracture.');

const carried=clone(old);carried.dungeonRun={carry:{raceRuntime:clone(carried.activeEncounter.raceRuntime)}};delete carried.activeEncounter;assert(validEquipmentRuntime(carried));const carriedEquip={...carried.equip,helm:null};assert(applyEquipmentRuntimeChange(carried,carried.equip,carriedEquip));carried.equip=carriedEquip;assert.equal(carried.dungeonRun.carry.raceRuntime.state.shards,6);assert(!Object.hasOwn(carried.dungeonRun.carry.raceRuntime.state,'setShards'));assert(validEquipmentRuntime(carried));const refilled=clone(carried);refilled.dungeonRun.carry.raceRuntime.state.shards=8;refilled.dungeonRun.carry.raceRuntime.state.setShards=2;assert(!validEquipmentRuntime(refilled));
console.log('PASS dormant dungeon carry reserve cleared on unequip and cannot resurrect after stage transition.');
