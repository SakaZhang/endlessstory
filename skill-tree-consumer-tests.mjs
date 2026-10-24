import assert from 'node:assert/strict';
import {planTreeSkill as plan,executeTreeSkill as execute,executeTreeSkillTurn as turn,TREE_ACTIVE_SKILL_IDS,validTreeSkillPlan,resolveSetLinkedHit,resolveSetLinkedEffect,putTimedSource,strongestTimedSource} from './dist/skill-tree-consumer.js';
// Explicit test-only values, never production defaults or a balance claim.
const config={genericCoefficient:1,axeCoefficients:[.6,.9],hammerCoefficient:1.2,armorBreak:{amount:7,durationMs:2200,timing:'after-hit'},coefficient:1,extraCoefficient:.4,brokenBonus:.3,burnBonus:.5,cooldownMs:4400,durationMs:2200,axeDurationMs:3300,hammerDurationMs:1100,hammerMultiplier:1.5,bleedPower:2,attackDown:5,attackUp:6,critUp:3,penetrationUp:4,burnPower:2,axeDurationBonus:1100,fireResistDown:6,burnChance:.5,armorDown:7,hitDown:4,poisonChance:.5,poisonPower:2,shield:20,defenseCoefficient:.2,defenseContributionCap:50,defenseUp:5,shieldBonus:.4,hammerDurationBonus:1100,dodgeUp:5,heal:20,healingPower:2,lifestealUp:4};
const targets=Array.from({length:5},(_,i)=>({id:'t'+i,alive:true,burning:true,bleeding:true,armorBroken:true}));
const hero={hp:50,maxHp:100,shield:10,defense:1000,eligibleDebuffIds:['burn','weak'],activeBuffIds:[]};
const input=(skillId,weaponType='generic',patch={})=>({skillId,castId:'cast',selectedTargetId:'t0',weaponType,targets,hero,config,...patch});
function harness({miss=false,kill=false}={}){
 const hp=new Map(targets.map(t=>[t.id,100])),events=[],effects=[];let alive=true;
 const host={isAlive:id=>hp.get(id)>0,heroAlive:()=>alive,hasLivingTargets:()=>[...hp.values()].some(v=>v>0),consumeCooldown:e=>events.push(['cd',e]),onActiveCast:e=>events.push(['cast',e]),onCastEnd:e=>events.push(['end',e]),resolveHit(a){events.push(['hit',a]);const before=hp.get(a.targetId);if(!miss){a.beforeMitigation?.();hp.set(a.targetId,kill?0:Math.max(0,before-5));}return {hit:!miss,hpBefore:before,hpAfter:hp.get(a.targetId),actualHpLost:miss?0:before-hp.get(a.targetId)};},applyEffect:(id,e)=>effects.push([id,e]),applyArmorBreak:e=>effects.push([e.targetId,{type:'armorBreak'}]),interrupt:()=>true,cleanse:()=>1,consumeStatus:(id,k)=>events.push(['consume',id,k]),random:()=>0};
 return {host,hp,events,effects,setDead(){alive=false;}};
}
// This fixed synthetic configuration covers the original fifteen mechanics.
// Added racial skills are tested with their own complete explicit configs.
for(const id of TREE_ACTIVE_SKILL_IDS.filter(id=>['fracture_strike','fault_sweep','breach_followup','anvil_cry','breaking_intercept','ember_brand','furnace_wave','cinder_barrage','furnace_etch','scatter_ash','iron_vigil','bastion_blow','repelling_wave','forge_breath','purifying_bulwark'].includes(id)))for(const weapon of ['axe','hammer','sword']){
 const p=plan(input(id,weapon));if(id==='scatter_ash'&&weapon==='axe'){assert.equal(p,null);continue;}assert(p,id+weapon);assert(validTreeSkillPlan(p));assert(Object.isFrozen(p));assert.deepEqual(JSON.parse(JSON.stringify(p)),p);const h=harness();assert(execute(p,h.host).cast,id+weapon);assert.equal(h.events.filter(e=>e[0]==='cast').length,1);assert.equal(h.events.filter(e=>e[0]==='cd').length,1);assert.equal(h.events.filter(e=>e[0]==='end').length,1);
}
assert.equal(plan(input('fault_sweep','axe',{config:{}})),null);assert.equal(plan(input('fault_sweep','axe',{config:{...config,cooldownMs:0}})),null);
assert.equal(plan(input('scatter_ash','axe',{config:{...config,poisonDamageType:'earth'}})),null,'no invented elemental poison');
let p=plan(input('cinder_barrage','axe'));let h=harness({kill:true});let r=execute(p,h.host);assert.equal(r.hits.length,1,'dead target never receives remaining segments');assert.equal(h.events.filter(e=>e[0]==='cast').length,1);
p=plan(input('fault_sweep','axe'));h=harness();r=execute(p,h.host);assert.equal(r.hits.length,5,'all means all, not max three');assert.equal(new Set(r.hits.map(x=>x.hitId)).size,5);assert(h.effects.every(([id,e])=>e.status==='bleed'&&e.reaperEligible===false&&e.source.kind==='skill'));
// Every segment uses the existing resolver exactly once; independent hit/crit/reaper flags supplied.
h=harness();p=plan(input('cinder_barrage','axe'));r=execute(p,h.host);assert.equal(r.hits.length,3);assert.deepEqual(r.hits.map(x=>x.hitIndex),[0,1,2]);assert(h.events.filter(e=>e[0]==='hit').every(([,a])=>a.independentHit&&a.independentCrit&&a.reaperEligible));
// Current target death selects next legal target only on the distinct multicast cast, never mid-segment.
h=harness({kill:true});let checks=0;r=turn(input('fracture_strike','axe'),h.host,{shouldMulticast(){checks++;return true;},rebuildInput:old=>input(old.skillId,'axe',{castId:old.castId+':extra',selectedTargetId:'t1',targets:targets.map(t=>({...t,alive:h.hp.get(t.id)>0}))})});assert(r.original.cast&&r.extra.cast);assert.equal(checks,1);assert.equal(h.events.filter(e=>e[0]==='cd').length,1);assert.equal(h.events.filter(e=>e[0]==='cast').length,2);assert.equal(h.events.filter(e=>e[0]==='cast')[1][1].multicastEligible,false);assert.equal(r.original.hits.length,1);assert.equal(r.extra.hits[0].targetId,'t1');
h=harness({kill:true});checks=0;r=turn(input('fault_sweep'),h.host,{shouldMulticast(){checks++;return true;},rebuildInput(){throw Error('clear means no extra');}});assert.equal(checks,0);assert.equal(r.extra,null);
h=harness();h.setDead();assert.equal(execute(plan(input('forge_breath')),h.host).cast,false);assert.equal(h.events.length,0);
h=harness();delete h.host.interrupt;assert.equal(execute(plan(input('breaking_intercept')),h.host),null);assert.equal(h.events.length,0,'preflight missing hook before paying cooldown');
h=harness();h.host.consumeCooldown=()=>false;assert.equal(execute(plan(input('fracture_strike')),h.host).cast,false);assert.equal(h.events.length,0);
for(const timing of ['before-hit','after-hit'])for(const hit of [true,false]){h=harness({miss:!hit});p=plan(input('fracture_strike','hammer',{config:{...config,armorBreak:{...config.armorBreak,timing}}}));execute(p,h.host);assert.equal(h.effects.length,hit?1:0);}
// Approved phrase is attack-after DEF, unlike explicitly hit-gated dodge and success-gated cleanse.
h=harness({miss:true});execute(plan(input('bastion_blow','axe')),h.host);assert.equal(h.effects[0][1].type,'defenseUp');
h=harness({miss:true});execute(plan(input('repelling_wave','axe')),h.host);assert.equal(h.effects.length,0);
h=harness();execute(plan(input('repelling_wave','axe')),h.host);assert.equal(h.effects.filter(([,e])=>e.type==='dodgeUp').length,1);
for(const interrupted of [false,true]){h=harness();h.host.interrupt=()=>interrupted;execute(plan(input('breaking_intercept','axe')),h.host);assert.equal(h.effects.length,interrupted?1:0);}
for(const removed of [0,1]){h=harness();h.host.cleanse=()=>removed;execute(plan(input('purifying_bulwark','axe')),h.host);assert.equal(h.effects.some(([,e])=>e.type==='attackUp'),removed>0);}
assert.equal(plan(input('forge_breath','axe',{hero:{...hero,hp:100}})),null);assert.equal(plan(input('purifying_bulwark','axe',{hero:{...hero,eligibleDebuffIds:[]}})),null);
h=harness();execute(plan(input('furnace_wave','hammer')),h.host);assert.equal(h.events.filter(e=>e[0]==='consume').length,5);
h=harness({miss:true});execute(plan(input('furnace_wave','hammer')),h.host);assert.equal(h.events.filter(e=>e[0]==='consume').length,0);
const malformed=structuredClone(plan(input('fracture_strike','axe')));malformed.actions[1].hitId=malformed.actions[0].hitId;assert(!validTreeSkillPlan(malformed));
const sets={anvilTwoBonus:.1,anvilAxeExtraBonus:.2,anvilHammerConditionBonus:.3,anvilGenericBonus:.1,runeConsumeBonus:.2,runeGenericBonus:.1,runeBurnBonus:.2,runeBurnChanceBonus:.15,guardShieldedBonus:.2,guardGenericBonus:.1,guardSkillShieldBonus:.2,guardAxeDefenseBonus:.3};
p=plan(input('breach_followup','hammer'));assert.equal(p.actions[0].conditionalCoefficient,.3);const hit={...p.actions[0],baseDamage:100*p.actions[0].baseCoefficient,conditionalBonus:100*p.actions[0].conditionalCoefficient};r=resolveSetLinkedHit(hit,{anvil:4},sets);assert(r.totalDamage>130);assert.equal(r.hitId,hit.hitId);assert.equal(resolveSetLinkedHit({...hit,targetBleeding:true,targetBroken:true},{anvil:2},sets).totalDamage,resolveSetLinkedHit({...hit,targetBleeding:false,targetBroken:true},{anvil:2},sets).totalDamage);
for(const kind of ['equipment','unknown'])assert.equal(resolveSetLinkedEffect({type:'shield',amount:50,source:{kind}},{guard:2},sets).amount,50);assert.equal(resolveSetLinkedEffect({type:'shield',amount:50,source:{kind:'skill'}},{guard:2},sets).amount,60);
let sources=[];sources=putTimedSource(sources,{sourceId:'weak',attribute:'armor',amount:5,endAt:5000});sources=putTimedSource(sources,{sourceId:'strong',attribute:'armor',amount:9,endAt:2000});assert.equal(strongestTimedSource(sources,'armor',1000),9);assert.equal(strongestTimedSource(sources,'armor',2000),5);assert.equal(strongestTimedSource(sources,'armor',5000),0);
console.log('PASS tree consumer: 44 complete weapon plans, explicit missing-config gates, 15 IDs, per-hit resolver hooks, single-cast accounting, multicast cooldown/recursion bounds, live retarget, effects and set provenance, source expiration, pending poison blocked');

for(const mutate of [p=>p.actions[1].hitIndex=0,p=>p.actions[0].source.kind="equipment",p=>p.actions[0].source.skillId="other"]){const p=structuredClone(plan(input("fracture_strike","axe")));mutate(p);const h=harness();assert.equal(execute(p,h.host),null);assert.equal(h.events.length,0);}
// Explicit time candidate; no timing constant silently added to the production planner.
const poisonTiming={tickIntervalMs:3000,layerDurationMs:9000,maxLayers:5,refreshPolicy:'earliest-expiry',schedule:'per-layer',expiryTick:'inclusive'};
const poisonInput=patch=>input('scatter_ash','axe',{config:{...config,poisonTiming},...patch});
for(const hit of [true,false])for(const roll of [0,.9]){
 const h=harness(),applied=[];let rolls=0,checks=0;
 h.host.resolveEffectHit=(a,event)=>{checks++;assert.equal(a.reaperEligible,false);assert.equal(a.damageActionCount,0);return {hit};};
 h.host.applyPoison=(id,ef,event)=>applied.push({id,ef,event});h.host.random=()=>{rolls++;return roll;};
 const result=execute(plan(poisonInput()),h.host);assert(result.cast);assert.equal(checks,5);assert.equal(rolls,hit?5:0);assert.equal(applied.length,hit&&roll<.5?5:0);assert.equal(result.damageActionCount,0);assert.equal(result.hits.length,5);
 assert(applied.every(a=>a.ef.element===null&&a.ef.fractionPerLayer===.02&&a.ef.timing.layerDurationMs===9000));
}
{
 const h=harness(),applied=[];h.host.resolveEffectHit=()=>({hit:true});h.host.applyPoison=(id,ef,event)=>applied.push([id,event.castId]);
 const result=turn(poisonInput(),h.host,{shouldMulticast:()=>true,rebuildInput:p=>poisonInput({castId:p.castId+':extra'})});assert(result.extra.cast);assert.equal(applied.length,10);assert.equal(new Set(applied.map(x=>x[1])).size,2);assert.equal(h.events.filter(e=>e[0]==='cd').length,1);
}
{
 const h=harness();assert.equal(execute(plan(poisonInput()),h.host),null);assert.equal(h.events.length,0,'poison hooks required before CD');
 const p=structuredClone(plan(poisonInput()));p.actions[0].effects[1].element='earth';assert.equal(execute(p,h.host),null);
}
console.log('PASS configured axe scatter: per-target hit then probability, miss no roll, real extra cast reapplication/no extra CD, explicit time only and non-elemental percent descriptor');
