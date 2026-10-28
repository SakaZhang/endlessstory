import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
import * as T from './dist/skill-tree-state.js';
import {SKILL_CONDITION_CHOICES,validSkillCondition,skillConditionMatches as matches} from './dist/skill-conditions.js';
import {createSkillEffectState,applySkillEffect} from './dist/skill-tree-effects.js';
import {createSkillPoison,applySkillPoison} from './dist/skill-tree-poison.js';
import {renderLoadouts} from './dist/loadout-ui.js';
const ids=SKILL_CONDITION_CHOICES.map(([id])=>id);
assert.equal(new Set(ids).size,ids.length);for(const bad of ['freeze','silence','constructor','__proto__',null])assert(!validSkillCondition(bad));
const fixture=()=>({heroHp:100,treeEffects:createSkillEffectState(['a','b'],1000),treeCombatClock:1000,enemies:[{id:'a',hp:100,control:{}},{id:'b',hp:100,control:{}}]});
const add=(e,who,type,extra={})=>{const r=applySkillEffect(e.treeEffects,who,{type,sourceId:'test',amount:1,durationMs:5000,...extra});assert(r);e.treeEffects=r.state;};
const check=(e,id,t=e.enemies[0])=>matches(id,{encounter:e,target:t,maxHp:100,now:1000});
for(const [condition,type] of [['bleed','bleed'],['burn','burn']]){const e=fixture();add(e,'b','dot',{status:type,damageType:'physical',tickIntervalMs:2000});assert(!check(e,condition));assert(check(e,condition,e.enemies[1]));e.treeEffects.clock=6000;assert(!check(e,condition,e.enemies[1]));}
for(const type of ['armorDown','attackDown','hitDown','fireResistDown','elementResistDown']){const e=fixture();add(e,'a',type,type==='elementResistDown'?{damageType:'water'}:{});assert(check(e,type));assert(!check(e,type,e.enemies[1]));e.treeEffects.clock=6000;assert(!check(e,type));}
{const e=fixture();add(e,'a','fireResistDown',{requiresStatus:'burn'});assert(!check(e,'fireResistDown'));add(e,'a','dot',{status:'burn',damageType:'fire',tickIntervalMs:2000});assert(check(e,'fireResistDown'));}
for(const type of ['attackUp','critUp','penetrationUp','defenseUp','dodgeUp','lifestealUp','healOverTime']){const e=fixture();add(e,'b',type,type==='healOverTime'?{tickIntervalMs:2000}:{});assert(!check(e,'self_'+type));add(e,'self',type,type==='healOverTime'?{tickIntervalMs:2000}:{});assert(check(e,'self_'+type));e.treeEffects.clock=6000;assert(!check(e,'self_'+type));}
{const e=fixture();e.treePoison={a:{layers:[{expiresAt:1001}]}};assert(check(e,'poison'));assert(!check(e,'poison',e.enemies[1]));e.treePoison.a.layers[0].expiresAt=1000;assert(!check(e,'poison'));}
{const e=fixture();assert(check(e,'always'));assert(!check(e,'low'));e.heroHp=59;assert(check(e,'low'));e.enemies[0].control={preparing:{},stunUntil:1001,interruptUntil:1001};for(const id of ['charge','stun'])assert(check(e,id));e.enemies[0].control={stunUntil:1000,interruptUntil:1000};for(const id of ['charge','stun'])assert(!check(e,id));}
{const e=fixture();e.heroBurn=1;for(const id of ['selfBurn','selfDot','selfDebuff'])assert(check(e,id));assert(!check(e,'burn'));e.heroBurn=0;add(e,'self','dot',{status:'bleed',damageType:'physical',tickIntervalMs:2000});for(const id of ['selfBleed','selfDot','selfDebuff'])assert(check(e,id));assert(!check(e,'bleed'));e.weakness=1;assert(check(e,'selfWeakness'));e.nextBasicSlow=1.4;assert(check(e,'selfSlow'));}
{const e=fixture();e.typedDots=[{endAt:1001}];assert(check(e,'selfDot'));assert(check(e,'selfDebuff'));e.typedDots[0].endAt=1000;assert(!check(e,'selfDot'));assert(!check(e,'selfDebuff'));}
{const e=fixture();e.enemies[0].shield=1;assert(check(e,'targetShield'));assert(!check(e,'selfShield'));assert(check(e,'selfNoShield'));e.playerShieldLayers={clock:1000,layers:[{remaining:0,expiresAt:9000}]};assert(!check(e,'selfShield'));e.playerShieldLayers.layers[0].remaining=1;assert(check(e,'selfShield'));assert(!check(e,'selfNoShield'));e.playerShieldLayers.clock=9000;assert(!check(e,'selfShield'));}
{const e=fixture();e.enemies[0].scorch=1;e.enemies[0].stun=1;assert(check(e,'scorch'));assert(check(e,'stun'));assert(!check(e,'fireResistDown'));}
// Every registered choice survives validation, all five racial trees, loadouts and JSON.
for(const race of ['dwarf','human','elf','goblin','ashen'])for(const id of ids){const s=E.fresh(race);s.skillTree.presets[0].conditions[0]=id;s.conditions[0]=id;assert(E.validSave(s),race+id);assert(E.saveLoadout(s,0,'条件'));assert(E.validSave(JSON.parse(JSON.stringify(s))));assert(E.applyLoadout(s,0));assert.equal(s.conditions[0],id);assert(renderLoadouts(s,{wardrobeIds:E.wardrobeIds,bagItems:E.bagItems}).includes(SKILL_CONDITION_CHOICES.find(x=>x[0]===id)[1]));}
function ready(condition,multi=false){let s=E.fresh();s.level=30;for(const change of [{type:'unlock',skillId:'fracture_strike'},{type:'slots',active:['fracture_strike',null,null,null],conditions:[condition,'always','always','always']}]){const q=T.quoteSkillTreeChange(s,E.SKILL_TREE_DEFINITION,change);assert(q);s=T.prepareSkillTreeChange(s,q,E.SKILL_TREE_DEFINITION).game;}s.heroHp=E.stats(s).hp;s.lastHealthClock=s.lastSeen=10000;s.restUntil=0;s.nextBattleAt=0;const e=E.startRoutedEncounter(s,10000);if(multi&&e.enemies.length===1){const u=structuredClone(e.enemies[0]);u.id+='-second';u.control.unitId=u.id;u.main=false;e.enemies.push(u);}for(const u of e.enemies)u.hp=u.max=100000;e.treeEffects=createSkillEffectState(e.enemies.map(u=>u.id),0);e.treeCombatClock=0;return {s,e};}
// Actual production selector, not only predicates: absent/present/expired + reload parity.
for(const condition of ['burn','bleed','poison','armorDown','attackDown','hitDown','fireResistDown','elementResistDown','self_attackUp','self_critUp','self_penetrationUp','self_defenseUp','self_dodgeUp','self_lifestealUp','self_healOverTime'])for(const present of [false,true]){
 const {s,e}=ready(condition),target=e.enemies.find(u=>u.id===e.targetId)??e.enemies[0];
 if(present){if(condition==='poison'){const config={tickIntervalMs:2000,layerDurationMs:8000,maxLayers:5,refreshPolicy:'earliest-expiry',schedule:'per-layer',expiryTick:'inclusive'};e.treePoison={[target.id]:applySkillPoison(createSkillPoison(target.id,config,0),{enemyId:target.id,sourceId:'test',combatClock:0})};}else if(['burn','bleed'].includes(condition))add(e,target.id,'dot',{status:condition,damageType:'physical',tickIntervalMs:2000});else {const type=condition.replace('self_','');add(e,condition.startsWith('self_')?'self':target.id,type,{...(type==='elementResistDown'?{damageType:'water'}:{}),...(type==='healOverTime'?{tickIntervalMs:2000}:{})});}}
 assert(E.validSave(s),condition+' before');const resumed=JSON.parse(JSON.stringify(s));assert.deepEqual(E.step(s,e,11100),E.step(resumed,resumed.activeEncounter,11100));assert.equal(e.lastCast?.skillId==='fracture_strike',true,'unsupported old '+condition+' falls back without stalling');assert.deepEqual(s,resumed);assert(E.validSave(s),condition+' after');
}
{const {s,e}=ready('bleed');const target=e.enemies.find(u=>u.id===e.targetId)??e.enemies[0];add(e,target.id,'dot',{status:'bleed',damageType:'physical',tickIntervalMs:1000,durationMs:1100});E.step(s,e,11100);assert.equal(e.lastCast?.skillId,'fracture_strike');}
{const {s,e}=ready('bleed',true);add(e,e.enemies[1].id,'dot',{status:'bleed',damageType:'physical',tickIntervalMs:2000});assert(E.validSave(s));E.step(s,e,11100);assert.equal(e.lastCast?.skillId,'fracture_strike','unsupported legacy gate falls back');assert(E.setCombatTarget(s,e.enemies[1].id));const resumed=JSON.parse(JSON.stringify(s));assert.deepEqual(E.step(s,e,12200),E.step(resumed,resumed.activeEncounter,12200));assert.notEqual(e.lastCast?.skillId,'fracture_strike','fallback already cast and is on cooldown');assert.deepEqual(s,resumed);assert(E.validSave(s));}
console.log('PASS shared skill conditions: legacy registry compatibility plus contextual fallback, five-race saves/loadouts, selected target/self isolation, effect dependencies, expiry, real selector and JSON replay');

// A single visible option; old persisted IDs remain a safe, non-resetting alias.
assert(ids.includes('elementResistDown'));
assert(!ids.includes('fireResistDown'));
assert(validSkillCondition('fireResistDown'));
for(const type of ['fireResistDown','elementResistDown'])for(const element of type==='elementResistDown'?['earth','water','fire','wind','light','dark']:[null]){
 const e=fixture(),extra=element?{damageType:element}:{};
 add(e,'b',type,{...extra,requiresStatus:'burn'});
 for(const condition of ['elementResistDown','fireResistDown']){
  assert(!check(e,condition,e.enemies[1]),'inactive dependency');
  add(e,'a','dot',{status:'burn',damageType:'fire',tickIntervalMs:2000});
  assert(!check(e,condition,e.enemies[1]),'other target burn cannot activate debuff');
 }
 add(e,'b','dot',{status:'burn',damageType:'fire',tickIntervalMs:2000,durationMs:1000});
 for(const condition of ['elementResistDown','fireResistDown']){assert(check(e,condition,e.enemies[1]));assert(!check(e,condition),'other target debuff cannot trigger');}
 e.treeEffects.clock=2000;
 assert(!check(e,'elementResistDown',e.enemies[1]),'expired dependency');
 const z=fixture();add(z,'a',type,{...extra,amount:0});assert(!check(z,'elementResistDown'),'zero reduction is not effective');
}
// Production selector recognizes both source schemas through either saved condition ID.
for(const condition of ['elementResistDown','fireResistDown'])for(const type of ['fireResistDown','elementResistDown'])for(const expired of [false,true]){
 const {s,e}=ready(condition),target=e.enemies.find(u=>u.id===e.targetId)??e.enemies[0];
 add(e,target.id,type,{...(type==='elementResistDown'?{damageType:'dark'}:{}),durationMs:expired?1100:5000});
 const resumed=JSON.parse(JSON.stringify(s));assert(E.validSave(resumed));
 assert.deepEqual(E.step(s,e,11100),E.step(resumed,resumed.activeEncounter,11100));
 assert.equal(e.lastCast?.skillId==='fracture_strike',true);assert.deepEqual(s,resumed);
}
const {mountSkillTree}=await import('./dist/skill-tree-ui.js');
const {getSkillTreeDefinition}=await import('./dist/race-registry.js');
for(const race of ['dwarf','human','elf','goblin','ashen']){
 const s=E.fresh(race);s.conditions[0]='fireResistDown';
 for(const p of s.skillTree.presets)p.conditions[0]='fireResistDown';
 assert(E.saveLoadout(s,0,'旧方案'));assert(E.validSave(JSON.parse(JSON.stringify(s))));assert(E.applyLoadout(s,0));
 const before=structuredClone(s),listeners={},host={innerHTML:'',contains:t=>t.owner===host,addEventListener(k,f){listeners[k]=f;},removeEventListener(k){delete listeners[k];}};
 const ui=mountSkillTree(host,{getState:()=>s,getDefinition:getSkillTreeDefinition,commit:async()=>({ok:false})});
 assert(host.innerHTML.includes('<option value="always" selected>可用即施放</option>'));assert(host.innerHTML.includes('暂按可用即施放'));assert(!host.innerHTML.includes('value="elementResistDown"'));
 assert(!host.innerHTML.includes('value="fireResistDown"'));assert(!host.innerHTML.includes('目标火抗削弱'));
 const html=renderLoadouts(s,{wardrobeIds:E.wardrobeIds,bagItems:E.bagItems});assert(html.includes('目标元素抗性削弱'));assert(!html.includes('目标火抗削弱'));
 await listeners.click({target:{closest:()=>({owner:host,dataset:{treeAction:'cancel'}})}});
 assert.deepEqual(s,before,'display and cancel do not rewrite or reset old save');ui.dispose();
}
// Use the actual dwarf and elf planners, not merely hand-authored effect schemas.
const {planTreeSkill}=await import('./dist/skill-tree-consumer.js');
const {skillConfigs}=await import('./dist/skill-tree-tuning.js');
const {planSkill:elfPlan}=await import('./dist/races/elf/skills.js');
const stats={atk:100,hp:100,armor:10},input={castId:'resist-test',weaponType:'hammer',selectedTargetId:'a',targets:[{id:'a',alive:true}],stats};
const plans=[planTreeSkill({...input,skillId:'furnace_etch',config:skillConfigs(stats).furnace_etch}),...['elf.ember_bloom','elf.root_eclipse'].map(skillId=>elfPlan({...input,skillId}))];
for(const plan of plans){assert(plan);const e=fixture(),effect=plan.actions.flatMap(a=>a.effects??[]).find(x=>['fireResistDown','elementResistDown'].includes(x.type));assert(effect);add(e,'a',effect.type,effect);assert(check(e,'elementResistDown'),plan.skillId);assert(check(e,'fireResistDown'),plan.skillId);e.treeEffects.clock=1000+effect.durationMs;assert(!check(e,'elementResistDown'),plan.skillId+' expiry');}
console.log('PASS unified resistance condition: both actual racial sources, all six elements, dependency/expiry/target isolation, selector replay, five-race old saves and canonical editor/loadout display');
