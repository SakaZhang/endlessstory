import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {BUILD,SET_CODEX,fresh,item,normalizeCodexCollection,stats} from './dist/engine.js';
import {renderSetEffects,equippedSetCount} from './dist/set-effects.js';
import {renderCodex} from './dist/codex-ui.js';
import {planTreeSkill} from './dist/skill-tree-consumer.js';
import {getRacePack} from './dist/race-registry.js';
const near=(actual,expected)=>assert(Math.abs(actual-expected)<1e-9,`${actual} != ${expected}`);
assert.equal(BUILD.length,15);
for(const def of BUILD){
 assert.deepEqual(def.effects.map(e=>e.pieces),[2,4],def.id);
 assert(def.effects.every(e=>/\d/.test(e.description)),def.id+' concrete effects');
 assert.equal(SET_CODEX.find(x=>x.id===def.id).bonus,def.bonus);
 const s=fresh(),parts=['helm','armor','gloves','boots'].map(slot=>item(slot,20,def.id,3));
 s.inventory.push(...parts);normalizeCodexCollection(s);
 for(const n of [0,1,2,3,4]){
  s.equip={};for(const it of parts.slice(0,n))s.equip[it.slot]=it.id;
  const before=JSON.stringify(s),html=renderSetEffects(s,def),codex=renderCodex(s,{selectedSet:def.id});
  assert.equal(equippedSetCount(s,def.id),n);assert.equal(stats(s).count[def.id]??0,n);
  assert.match(html,new RegExp(`当前已穿戴 ${n} / 4 件`));
  for(const threshold of [2,4])assert(html.includes(`data-set-pieces="${threshold}" data-set-active="${n>=threshold}"`));
  for(const effect of def.effects)assert(codex.includes(effect.description));
  assert.equal(JSON.stringify(s),before,'render is read only');
 }
 s.equip.extra=parts[0].id;assert.equal(equippedSetCount(s,def.id),4,'duplicate socket ID does not count twice');
 s.equip={};assert.match(renderCodex(s,{selectedSet:def.id}),/当前已穿戴 0 \/ 4 件/,'collection is not equipment');
}
// Follow the actual active skill-tree planner, not a second damage calculation.
const elf=getRacePack('elf');
function plan(key,count={},runtime=elf.createRuntime(),weaponType='bow'){
 const skillId='elf.'+key;
 const out=planTreeSkill({skillId,castId:'test',weaponType,config:{cooldownMs:elf.skills[skillId].cooldownMs},stats:{atk:100,hp:1000,armor:100,count},context:{runtime},hero:{hp:500,maxHp:1000,eligibleDebuffIds:['burn']},selectedTargetId:'a',targets:['a','b'].map(id=>({id,alive:true,hp:100,maxHp:100,baseAtk:100}))});
 assert(out,key);return out;
}
for(const key of ['twin_arrow','thread_volley','hunter_mark','pursuit','moon_finisher','swift_draw'])for(const weapon of ['bow','staff']){
 const base=plan(key,{},undefined,weapon),two=plan(key,{elf_arrow:2},undefined,weapon),four=plan(key,{elf_arrow:4},undefined,weapon);
 base.actions.forEach((a,i)=>{if(a.kind==='hit'){near(two.actions[i].baseCoefficient,a.baseCoefficient*1.1);near(four.actions[i].baseCoefficient,a.baseCoefficient*1.1*(a.hitIndex>=1?1.18:1));}else assert.deepEqual(four.actions[i],a,'buffs unchanged');});
}
for(const key of ['sixfold_shift','wind_prism','sixfold_chorus'])for(const previous of [null,'wind']){
 const runtime={...elf.createRuntime(),lastElement:previous},base=plan(key,{},runtime),full=plan(key,{elf_prism:4},runtime);
 base.actions.forEach((a,i)=>{if(a.kind==='hit')near(full.actions[i].baseCoefficient,a.baseCoefficient*1.1*(previous&&a.damageType!==previous?1.15:1));});
}
for(const key of ['root_strike','resonant_guard','leaf_ward']){
 const base=plan(key),full=plan(key,{elf_root:4});
 base.actions.forEach((a,i)=>{if(a.kind==='hit')near(full.actions[i].baseCoefficient,a.baseCoefficient*1.1*(a.damageType==='physical'?1:1.2));else a.effects.forEach((e,j)=>near(full.actions[i].effects[j].amount,e.amount*(key==='resonant_guard'&&e.type==='shield'?1.2:1)));});
}
// Focused audit of every other racial set's documented numeric hook.
const modify=(race,id,set,actions,targets=[])=>getRacePack(race).modifySkillPlan({skillId:race+'.'+id,actions},{setCounts:{[set]:4},targets});
const hit=(effects=[])=>({kind:'hit',targetId:'a',coefficient:1,effects});
let p=modify('human','sever','human_blood_oath',[hit([{type:'dot',status:'bleed',amount:10,durationMs:6000}])],[{id:'a',bleeding:true}]);near(p.actions[0].coefficient,1.55);assert.equal(p.actions[0].effects[0].amount,12);assert.equal(p.actions[0].effects[0].durationMs,8000);
p=modify('human','opening','human_royal_edge',[hit([{type:'critUp',amount:16,durationMs:6600}])]);assert.equal(p.actions[0].effects[0].amount,16);assert.equal(p.actions[0].effects[0].durationMs,8800);assert.equal(p.actions[0].effects.find(e=>e.type==='setSkillCrit').amount,.03);assert.equal(p.actions[0].effects.find(e=>e.type==='setSkillCrit').durationMs,8800);
p=modify('human','decisive','human_royal_edge',[hit()],[{id:'a',armorBroken:true}]);near(p.actions[0].coefficient,1.6);
p=modify('human','return_cut','human_last_bastion',[hit([{type:'shield',amount:100},{type:'heal',amount:100}])]);near(p.actions[0].coefficient,1.5);near(p.actions[0].effects[0].amount,120);near(p.actions[0].effects[1].amount,115);
p=modify('goblin','venom_cut','goblin_spore',[hit([{type:'poison'},{type:'armorDown',durationMs:6000}])]);assert.equal(p.actions[0].effects.filter(e=>e.type==='poison').length,2);assert.equal(p.actions[0].effects[1].durationMs,8000);
for(const [key,ratio,triggers] of [['opening_cut',.75,false],['opening_cut',.76,true],['finish_cut',.3,false],['finish_cut',.29,true]]){p=modify('goblin',key,'goblin_ambush',[hit()],[{id:'a',hp:ratio*100,maxHp:100}]);near(p.actions[0].coefficient,1.08*(triggers?1.25:1));}
p=modify('goblin','snare_wire','goblin_snare',[hit([{type:'raceReactive',hitDown:10,attackDown:20,charges:2,coefficient:1}])]);assert.deepEqual(p.actions[0].effects[0],{type:'raceReactive',hitDown:11.5,attackDown:23,charges:3,coefficient:.85});
for(const [set,key,effect,expected] of [['caldera','kindle',{type:'raceResource',resource:'heat',operation:'add',amount:10},15],['caldera','anneal',{type:'shield',amount:100},120],['strata','mantle',{type:'raceResource',resource:'shards',amount:2},3],['strata','rebuild',{type:'heal',amount:100},120],['prism','chorus',{type:'shield',amount:100},120],['prism','mend',{type:'heal',amount:100},120]]){p=modify('ashen',key,'ashen.'+set,[hit([effect])]);if(effect.type==='raceResource'){near(p.actions[0].effects[0].amount,effect.amount);near(p.actions[0].effects.reduce((n,e)=>n+e.amount,0),expected);assert.equal(p.actions[0].effects[1].setSource,'ashen.'+set);}else near(p.actions[0].effects[0].amount,expected);}
for(const [set,keys,multiplier] of [['caldera',['vent','overload'],1.15],['strata',['cleave','fracture'],1.15],['prism',['tap','dawn','dusk'],1.08],['prism',['resound'],1.15]])for(const key of keys)near(modify('ashen',key,'ashen.'+set,[hit()]).actions[0].coefficient,multiplier);
for(const file of ['app.js','codex-ui.js','character-stats-ui.js'])assert.match(readFileSync('./dist/'+file,'utf8'),/renderSetEffects\(s,/);
console.log('PASS 15 set descriptions, 0–4 equipped activation, immutable rendering, collection distinction, active elf planner and all racial set hooks.');
