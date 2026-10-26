import {WORLD_MONSTERS as DWARF_MONSTERS} from './world-content.js';
import {beginPreparing,claimCompletedCast,controlAllowsAction} from './multi-control.js';
const elements=['earth','water','fire','wind','light','dark'];
const lifestealCap=d=>Math.max(d.trait?.type==='lifesteal'?d.trait.encounterCap:0,...d.skills.flatMap(s=>s.effects.filter(e=>e.type==='lifesteal').map(e=>e.encounterCap)));
export function initializeDwarfActor(unit,definition,parameters,now,{share=1,follower=false}={}){
 Object.assign(unit,{monsterId:definition.id,definitionId:definition.id,elementalPower:parameters.elementalPower*share,atk:parameters.atk*share,armor:parameters.armor,max:parameters.hp*share,hp:parameters.hp*share,name:follower?definition.trait.name:definition.name,elementTags:[...definition.elementTags],elementResistance:Object.fromEntries(elements.map(k=>[k,parameters.elementResistance?.[k]??0])),parameterSetId:parameters.parameterSetId,basicIntervalMs:parameters.basicIntervalMs,nextBasicAt:now+parameters.basicIntervalMs,skillUses:{},follower,typedProfile:true,shieldUntil:0,reflectReadyAt:0});
 if(lifestealCap(definition)>0)unit.lifestealHealed=0;
 for(const skill of definition.skills)unit.control.cooldowns[skill.id]=now+skill.firstAtMs;
 const openingShield=definition.trait?.type==='openingShield'?definition.trait:definition.trait?.openingShield;
 if(!follower&&openingShield){unit.shield=unit.max*openingShield.fraction;unit.shieldUntil=now+openingShield.durationMs;}
 unit.skillOverrides=Object.fromEntries(definition.skills.filter(s=>parameters.skillOverrides?.[s.id]).map(s=>[s.id,structuredClone(parameters.skillOverrides[s.id])]));unit.profile.controlReduction=parameters.controlReduction??0;unit.profile.interruptStop=parameters.interruptStopMs??1100;
 return unit;
}
function validTimedReflect(u,d){
 if(u.timedReflect===undefined)return true;
 const r=u.timedReflect,effect=d.skills.find(s=>s.id===r?.skillId)?.effects.find(e=>e.type==='reflect');
 return !!effect&&r&&Object.keys(r).length===3&&['skillId','endsAt','charges'].every(k=>Object.hasOwn(r,k))&&Number.isSafeInteger(r.endsAt)&&r.endsAt>=0&&r.endsAt<=1e15+60000&&Number.isInteger(r.charges)&&r.charges>=0&&r.charges<=effect.charges;
}
export function validDwarfActor(u){const d=DWARF_MONSTERS[u.definitionId];return !!d&&validTimedReflect(u,d)&&(lifestealCap(d)===0||Number.isFinite(u.lifestealHealed)&&u.lifestealHealed>=0&&u.lifestealHealed<=u.max*lifestealCap(d)+1e-9)&&d.nodes.includes(u.sourceInstanceId)&&u.monsterId===d.id&&u.typedProfile===true&&typeof u.parameterSetId==='string'&&typeof u.follower==='boolean'&&(!u.follower||d.trait?.type==='followers')&&(u.followerMonsterId===undefined||u.follower&&u.followerMonsterId===d.trait?.followerMonsterId&&!!DWARF_MONSTERS[u.followerMonsterId]&&DWARF_MONSTERS[u.followerMonsterId].area===d.area&&u.independentRewards===false)&&Number.isFinite(u.elementalPower)&&u.elementalPower>=0&&u.elementalPower<=1e12&&Number.isSafeInteger(u.basicIntervalMs)&&u.basicIntervalMs>=100&&u.basicIntervalMs<=60000&&['nextBasicAt','shieldUntil','reflectReadyAt'].every(k=>Number.isFinite(u[k])&&u[k]>=0&&u[k]<=1e15+60000)&&(u.skillOverrides===undefined||u.skillOverrides&&Object.entries(u.skillOverrides).every(([id,x])=>d.skills.some(s=>s.id===id)&&x&&Object.keys(x).length===1&&Number.isSafeInteger(x.castMs)&&x.castMs>=0&&x.castMs<=60000))&&u.skillUses&&typeof u.skillUses==='object'&&!Array.isArray(u.skillUses)&&Object.entries(u.skillUses).every(([k,n])=>d.skills.some(s=>s.id===k)&&Number.isSafeInteger(n)&&n>=0);}
export function expireDwarfShield(u,now){if(u.typedProfile&&u.shieldUntil>0&&now>=u.shieldUntil){u.shield=0;u.shieldUntil=0;}}
// Timed DOT keeps source power and type, never newly-selected enemy attack.
export function applyDwarfDot(e,u,skill,effect,now){
 e.typedDots??=[];const raw=u[effect.powerBasis]*effect.coefficientPerSecond,existing=e.typedDots.find(d=>d.key===skill.id&&d.sourceId===u.id);
 if(existing){existing.raw=Math.max(existing.raw,raw);existing.endAt=Math.max(existing.endAt,now+effect.seconds*1000);}
 else e.typedDots.push({key:skill.id,sourceId:u.id,type:effect.damageType,raw,nextAt:now+1000,endAt:now+effect.seconds*1000});
}
export function tickDwarfDots(e,now,damage){
 for(const dot of e.typedDots??[]){while(dot.nextAt<=now&&dot.nextAt<=dot.endAt){damage(dot);dot.nextAt+=1000;if(e.heroHp<=0)return;}}
 e.typedDots=(e.typedDots??[]).filter(dot=>dot.nextAt<=dot.endAt);
}
export function validDwarfDots(dots){return dots===undefined||(Array.isArray(dots)&&dots.length<=20&&new Set(dots.map(d=>JSON.stringify([d.key,d.sourceId??null]))).size===dots.length&&dots.every(d=>(d.sourceId===undefined||typeof d.sourceId==='string'&&d.sourceId.length>0&&d.sourceId.length<=200)&&typeof d.key==='string'&&['physical',...elements].includes(d.type)&&Number.isFinite(d.raw)&&d.raw>=0&&d.raw<=1e12&&['nextAt','endAt'].every(k=>Number.isFinite(d[k])&&d[k]>=0&&d[k]<=1e15+60000)));}
// Returns a typed action, shared by online/offline. Numerical damage goes through
// production physical / elemental resolvers in multi-combat, not a second formula.
export function nextDwarfAction(u,now){
 const original=DWARF_MONSTERS[u.definitionId],d=original?{...original,skills:original.skills.map(skill=>({...skill,...u.skillOverrides?.[skill.id]}))}:null;if(!d||u.hp<=0||!controlAllowsAction(u.control,now))return null;
 if(u.storyActorRace){if(now<u.nextBasicAt)return null;u.nextBasicAt=Math.max(u.nextBasicAt+u.basicIntervalMs,now+1);return {id:'basic',name:'普通攻击',effects:[{type:'damage',damageType:'physical',powerBasis:'atk',coefficient:1}]};}
 if(u.control.preparing){const result=claimCompletedCast(u.control,now);if(!result)return null;const skill=d.skills.find(s=>s.id===u.control.preparing.skillId);u.control=result.state;u.heavyDelayed=false;if(!skill)return null;u.skillUses[skill.id]=(u.skillUses[skill.id]??0)+1;u.nextBasicAt=now+u.basicIntervalMs;return skill;}
 if(!u.follower){
  const available=skill=>(u.skillUses[skill.id]??0)<(skill.maxCasts??Infinity)&&(skill.trigger==='hp_below_50_once'?u.hp<=u.max*.5:(u.control.cooldowns[skill.id]??0)<=now);
  const skill=d.skills.find(s=>s.trigger==='hp_below_50_once'&&available(s))??d.skills.find(available);
  if(skill){if(skill.castMs>0){const preparing=beginPreparing(u.control,{skillId:skill.id,duration:skill.castMs,cooldownDuration:skill.cooldownMs,now});if(preparing){u.control=preparing;u.heavyDelayed=false;}return null;}u.control.cooldowns[skill.id]=now+skill.cooldownMs;u.skillUses[skill.id]=(u.skillUses[skill.id]??0)+1;u.nextBasicAt=now+u.basicIntervalMs;return skill;}
 }
 if(now<u.nextBasicAt)return null;u.nextBasicAt=Math.max(u.nextBasicAt+u.basicIntervalMs,now+1);return {id:'basic',name:'普通攻击',effects:[{type:'damage',damageType:u.follower?'physical':(d.basicAttackType??'physical'),powerBasis:!u.follower&&d.basicAttackType&&d.basicAttackType!=='physical'?'elementalPower':'atk',coefficient:1}]};
}
