import assert from 'node:assert/strict';
import * as E from '../../../dist/engine.js';
import {RACE_PACK as P} from '../../../dist/races/ashen/index.js';
import {createSkillEffectState,applySkillEffect,advanceSkillEffectState} from '../../../dist/skill-tree-effects.js';
import {skillTreeHeroStats,skillTreeEnemyAttributes} from '../../../dist/skill-tree-attributes.js';
import {derivePassiveStats} from '../../../dist/skill-tree-passives.js';
const close=(a,b)=>assert(Math.abs(a-b)<1e-8,`${a} != ${b}`), attr={dodgeCap:.35};
const specs={temper:['attackUp',6500],fault:['armorDown',6000],rebuild:['defenseUp',6000],quarry:['attackDown',5000]};
const enemy=(id,atk,armor)=>({id,alive:true,atk,armor,baseAtk:atk,baseArmor:armor,elementResistance:{fire:0}});
// Numeric 100 contract through the actual shared flat-stat host, including target-specific AoE.
for(const key of Object.keys(specs))for(const shards of key==='rebuild'?[0,1,2,3,6]:[0]){
 const base={...E.baseStats(E.fresh('ashen')),atk:100,armor:100},targets=[enemy('a',100,100),enemy('b',250,300)];
 const plan=P.planSkill({skillId:'ashen.'+key,castId:'numeric',selectedTargetId:'a',targets,stats:{...base,atk:900,armor:900},snapshotStats:base,context:{runtime:{...P.createRuntime(),shards}}});
 const hits=plan.actions.filter(a=>a.kind==='hit');
 if(key==='fault'||key==='quarry'){assert.equal(hits.length,key==='fault'?1:2);for(const hit of hits){assert.equal(hit.coefficient,key==='fault'?.95:.85);assert.equal(hit.damageType,key==='fault'?'physical':'earth');}}
 if(key==='rebuild')close(plan.actions.flatMap(a=>a.effects??[]).find(e=>e.type==='heal').amount,base.hp*(.04+Math.min(shards,3)*.022));
 let effects=createSkillEffectState(['a','b']);
 const apply=()=>{for(const a of plan.actions)for(const effect of a.effects??[])if(effect.type===specs[key][0])effects=applySkillEffect(effects,a.targetId,effect).state;};
 apply();apply(); // same source replaces, never stacks
 const hero=skillTreeHeroStats(base,effects,attr),a=skillTreeEnemyAttributes(targets[0],effects),b=skillTreeEnemyAttributes(targets[1],effects);
 if(key==='temper')close(hero.atk,112);
 if(key==='rebuild')close(hero.armor,112+2.5*Math.min(shards,3));
 if(key==='fault'){close(a.armor,88);close(b.armor,300);}
 if(key==='quarry'){close(a.atk,90);close(b.atk,225);}
 effects=advanceSkillEffectState(effects,1000).state;apply();
 const source=(effects.hero.sources[0]??effects.enemies.a.sources[0]);assert.equal(source.endAt,1000+specs[key][1]);
 effects=advanceSkillEffectState(effects,source.endAt).state;
 close(skillTreeHeroStats(base,effects,attr).atk,100);close(skillTreeHeroStats(base,effects,attr).armor,100);close(skillTreeEnemyAttributes(targets[0],effects).atk,100);close(skillTreeEnemyAttributes(targets[0],effects).armor,100);
}
function fixture(key,shards=0,passives=false){
 const s=E.fresh('ashen');s.level=100;s.skillTree.presets[0].unlocked=P.tree.nodes.map(n=>n.id);s.skillTree.presets[0].active=['ashen.'+key,null,null,null];s.skillTree.presets[0].passive=passives?['ashen.thermal','ashen.laminate']:[null,null];s.lastSeen=s.lastHealthClock=1000;E.normalizeHealth(s,1000);s.heroHp=E.stats(s).hp;s.restUntil=0;s.nextBattleAt=0;
 const e=E.startRoutedEncounter(s,1000);e.enemies=e.enemies.slice(0,1);const first=e.enemies[0];e.targetId=first.id;
 const second=structuredClone(first);second.id+='-second';second.control.unitId=second.id;e.enemies.push(second);
 for(const [i,u]of e.enemies.entries()){u.hp=u.max=1e7;u.atk=[100,250][i];u.armor=[100,300][i];u.elementalPower=0;u.nextAttackAt=1e12;u.control.preparing=null;}
 e.raceRuntime={race:'ashen',state:{...P.createRuntime(),shards}};
 return {s,e};
}
function effective(s,e){const b=skillTreeHeroStats(E.baseStats(s),e.treeEffects,attr),p=E.treePassiveContext(s);return p?derivePassiveStats(b,p,{currentHp:e.heroHp}).stats:b;}
function cast(s,e,key){e.treeSkillCooldowns??={};e.treeSkillCooldowns['ashen.'+key]=0;e.rngState=12345;E.step(s,e,s.nextActionAt);assert.equal(e.lastCast.skillId,'ashen.'+key);}
for(const key of Object.keys(specs))for(const passives of [false,true])for(const shards of key==='rebuild'?[0,1,2,3,6]:[0]){
 const {s,e}=fixture(key,shards,passives),base=E.stats(s),raw=E.baseStats(s),ratio=.12+Math.min(shards,3)*.025;
 for(let n=0;n<3;n++){
  if(key==='rebuild')e.raceRuntime.state.shards=shards;
  cast(s,e,key);const st=effective(s,e);
  if(key==='temper'){close(st.atk,base.atk*1.12);close(e.treeEffects.hero.sources.find(x=>x.type==='attackUp').amount,raw.atk*.12);assert.equal(e.raceRuntime.state.heat,25*(n+1));}
  if(key==='rebuild'){close(st.armor,base.armor*(1+ratio));assert.equal(e.raceRuntime.state.shards,Math.max(0,shards-3));}
  for(const [i,u]of e.enemies.entries()){const a=skillTreeEnemyAttributes(u,e.treeEffects);if(key==='fault')close(a.armor,u.armor*(i===0?.88:1));if(key==='quarry')close(a.atk,u.atk*.9);}
  const sources=[...e.treeEffects.hero.sources,...Object.values(e.treeEffects.enemies).flatMap(x=>x.sources)].filter(x=>x.type===specs[key][0]);assert.equal(sources.length,key==='quarry'?2:1);for(const source of sources)assert.equal(source.endAt-e.treeEffects.clock,specs[key][1]);
 }
 s.skillTree.presets[0].active=[null,null,null,null];for(let i=0;i<7;i++)E.step(s,e,s.nextActionAt);
 close(effective(s,e).atk,base.atk);close(effective(s,e).armor,base.armor);for(const u of e.enemies){close(skillTreeEnemyAttributes(u,e.treeEffects).atk,u.atk);close(skillTreeEnemyAttributes(u,e.treeEffects).armor,u.armor);}
}
// Real scheduler continuation: four separate builds ensure each approved skill recasts offline.
for(const key of Object.keys(specs)){
 const {s,e}=fixture(key,6,true);for(const u of e.enemies)u.atk=0;cast(s,e,key);s.lastSeen=s.lastHealthClock;
 const online=JSON.parse(JSON.stringify(s)),offline=JSON.parse(JSON.stringify(s)),end=s.lastSeen+60000;
 while(online.nextActionAt<=end)E.step(online,online.activeEncounter,online.nextActionAt);
 E.settleRest(online,end);online.lastSeen=end;const report=E.offline(offline,end);assert(report.rounds>0);
 for(const field of ['heroHp','gold','xp','kills'])assert.deepEqual(online[field],offline[field],key+':'+field);
 for(const field of ['raceRuntime','treeEffects','treeCombatClock','treeSkillCooldowns','enemies'])assert.deepEqual(online.activeEncounter[field],offline.activeEncounter[field],key+':'+field);
 assert(online.activeEncounter.activeCastCount>1);
 assert(E.validSave(online));assert(E.validSave(offline));
}
for(const [key,percent]of [['temper','12%'],['fault','12%'],['rebuild','19.5%'],['quarry','10%']])assert(P.skills['ashen.'+key].description.includes(percent));
console.log('PASS Ashen percentages: flat host 100, 0–3/6 shards, real casts with/without passives, differing target stats, refresh/expiry, nonrecursive recasts, four 60s online/offline continuations.');
