import {EXPANSION_PACKS} from './race-packs.js';
const plain=x=>!!x&&typeof x==='object'&&!Array.isArray(x),time=x=>Number.isFinite(x)&&x>=0&&x<=1e15;
export function legendaryRuntimeOwner(id){return EXPANSION_PACKS.find(p=>p.legendaries.some(d=>d.id===id)&&p.createLegendaryState&&p.validLegendaryState&&p.reduceLegendaryEvent)??null;}
export function validRacialLegendaryRuntime(s){const r=s?.legendaryRuntime;if(r===undefined)return true;if(!plain(r)||Object.keys(r).length!==2||r.version!==1||!plain(r.byId))return false;const equipped=new Set(Object.values(s.equip??{}));return Object.entries(r.byId).every(([id,row])=>{const item=s.inventory?.find(i=>i.id===id),p=legendaryRuntimeOwner(item?.legendaryId);return equipped.has(id)&&p&&plain(row)&&Object.keys(row).length===3&&row.legendaryId===item.legendaryId&&time(row.clock)&&p.validLegendaryState(row.legendaryId,row.state)===true;});}
export function clearRemovedRacialLegendaryRuntime(s,nextIds){if(s.legendaryRuntime)for(const id of Object.keys(s.legendaryRuntime.byId))if(!nextIds.has(id))delete s.legendaryRuntime.byId[id];}
export function advanceRacialLegendaryClock(s,delta){if(!time(delta)||delta>14400000)throw Error('Invalid legendary combat delta');if(!validRacialLegendaryRuntime(s))throw Error('Invalid legendary ledger');for(const row of Object.values(s.legendaryRuntime?.byId??{}))row.clock+=delta;}
function validCommand(c){if(!plain(c)||typeof c.type!=='string')return false;switch(c.type){case 'reflectDamage':return typeof c.targetId==='string'&&c.targetId.length>0&&Number.isFinite(c.amount)&&c.amount>=0&&c.amount<=1e15&&c.crit===false&&c.lifesteal===false&&c.reaperEligible===false&&c.multicastEligible===false&&c.activeCastCount===0&&c.recursive===false;case 'heal':return Number.isFinite(c.amount)&&c.amount>=0;case 'damage':return typeof c.targetId==='string'&&Number.isFinite(c.coefficient)&&c.coefficient>=0&&c.coefficient<=100&&['physical','earth','water','fire','wind','light','dark'].includes(c.damageType);case 'stealShield':return typeof c.targetId==='string'&&Number.isFinite(c.amount)&&c.amount>=0&&time(c.durationMs)&&c.durationMs>0;case 'dot':return typeof c.targetId==='string'&&Number.isFinite(c.amount)&&c.amount>=0&&c.status==='bleed'&&c.damageType==='physical'&&time(c.durationMs)&&c.durationMs>0&&time(c.tickIntervalMs)&&c.tickIntervalMs>0;case 'shield':return Number.isFinite(c.capacity)&&c.capacity>=0&&time(c.durationMs)&&c.durationMs>0;case 'healOverTime':return Number.isFinite(c.amount)&&c.amount>=0&&time(c.durationMs)&&c.durationMs>0&&time(c.tickIntervalMs)&&c.tickIntervalMs>0;case 'resourceRefund':return ['heat','shards','resonance'].includes(c.resource)&&Number.isSafeInteger(c.amount)&&c.amount>=0;case 'cooldownReduce':return typeof c.skillId==='string'&&Number.isSafeInteger(c.rounds)&&c.rounds>=0;default:return false;}}
// Reducers are pure. State and all commands validate before any ledger mutation.
export function dispatchRacialLegendaryEvent(s,event,context={}){if(!validRacialLegendaryRuntime(s)||!plain(event)||typeof event.type!=='string')throw Error('Invalid legendary event');const ids=new Set(Object.values(s.equip??{})),pending=[];for(const item of s.inventory??[]){const p=ids.has(item.id)&&legendaryRuntimeOwner(item.legendaryId);if(!p)continue;const previous=s.legendaryRuntime?.byId?.[item.id]??{legendaryId:item.legendaryId,clock:0,state:p.createLegendaryState(item.legendaryId)};const result=p.reduceLegendaryEvent({legendaryId:item.legendaryId,state:structuredClone(previous.state),event:structuredClone(event),context:{...context,clock:previous.clock,itemId:item.id}});if(!result||!p.validLegendaryState(item.legendaryId,result.state)||!Array.isArray(result.commands)||!result.commands.every(validCommand))throw Error('Invalid legendary reduction '+item.legendaryId);pending.push({itemId:item.id,row:{...previous,state:structuredClone(result.state)},commands:result.commands.map(c=>({...structuredClone(c),ownerItemId:item.id,legendaryId:item.legendaryId}))});}if(pending.length){s.legendaryRuntime??={version:1,byId:{}};for(const p of pending)s.legendaryRuntime.byId[p.itemId]=p.row;}return pending.flatMap(p=>p.commands);}

// Fixed effects come from registered definitions, never mutable item/save metadata.
export function racialLegendaryStatBonuses(s){
 const equipped=new Set(Object.values(s.equip??{})),seen=new Set(),bonus={dodgeRating:0,attackMultiplier:1};
 for(const item of s.inventory??[]){
  if(!equipped.has(item.id)||seen.has(item.legendaryId))continue;
  const definition=EXPANSION_PACKS.flatMap(p=>p.legendaries).find(d=>d.id===item.legendaryId);
  if(!definition||definition.slot!==item.slot)continue;
  if(definition.fixedEffect?.type==='unskilledAttackMultiplier'&&s.race==='ashen'&&s.equip.core===item.id){const preset=s.skillTree?.presets?.[s.skillTree.selectedPreset];if(preset&&preset.active.length===4&&preset.passive.length===2&&preset.active.every(x=>x===null)&&preset.passive.every(x=>x===null))bonus.attackMultiplier*=definition.fixedEffect.multiplier;}
  if(definition.fixedEffect?.type==='moltenAttackStacks'&&s.race==='ashen'&&s.equip.core===item.id){const row=s.legendaryRuntime?.byId?.[item.id];if(row&&row.state.expiresAt>row.clock)bonus.attackMultiplier*=1+.2*row.state.stacks;}
  if(definition.fixedEffect?.type!=='statBonus')continue;
  seen.add(item.legendaryId);
  const rating=definition.fixedEffect.stats?.dodgeRating;
  if(Number.isFinite(rating)&&rating>=0)bonus.dodgeRating+=rating;
 }
 return bonus;
}

// Direct damage modifiers are queried after committed beforeCast, before mitigation.
// Never mutate charge here: a multihit cast shares one pendingCastId.
export function racialLegendaryHitModifiers(s,{castId,weaponType,sourceKind,damageType,isFinalPhysicalSegment=false}={}){
 const item=s.inventory?.find(i=>i.id===s.equip?.weapon),type=weaponType??item?.weaponType;
 let damageMultiplier=1,armorMultiplier=1;
 if(item?.legendaryId==='elf-sixfold-heartwood'&&type==='staff'){
  if(['earth','water','fire','wind','light','dark'].includes(damageType))damageMultiplier*=1.3;
  if(sourceKind==='skill'&&['physical','earth','water','fire','wind','light','dark'].includes(damageType)&&typeof castId==='string'&&s.legendaryRuntime?.byId?.[item.id]?.state.pendingCastId===castId)damageMultiplier*=2;
 }
 if(item?.legendaryId==='elf-last-string'&&type==='bow'&&sourceKind==='skill'&&damageType==='physical'){
  armorMultiplier=.7;if(isFinalPhysicalSegment)damageMultiplier*=1.5;
 }
 return {damageMultiplier,armorMultiplier};
}
