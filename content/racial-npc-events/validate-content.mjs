import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {RACIAL_NPCS as npcs,RACIAL_NPC_EVENTS as events,RACIAL_NPC_EVENT_META as meta} from './racial-npc-events.mjs';
const root=process.argv[2]??path.resolve(path.dirname(new URL(import.meta.url).pathname),'../..');
const load=f=>import(pathToFileURL(path.join(root,'dist',f)).href);
const [{WORLD_MATERIALS:materials,worldInventoryKey},{AREAS:areas,PLANNED_INSTANCES:nodes,instanceCooldownMs},{WORLD_MONSTERS:monsters}]=await Promise.all([load('world-materials.js'),load('location-schema.js'),load('world-content.js')]);
const races=['dwarf','human','elf','goblin','ashen'];let assertions=0;
const check=(value,why)=>{assert(value,why);assertions++;};
check(npcs.length===30,'30 NPCs');check(events.length===60,'60 events');
check(new Set(npcs.map(x=>x.id)).size===30,'NPC IDs unique');check(new Set(events.map(x=>x.id)).size===60,'event IDs unique');
for(const race of races){
 const ns=npcs.filter(x=>x.race===race),es=events.filter(x=>x.race===race);
 check(ns.length===6,race+' 6 NPCs');check(es.length===12,race+' 12 events');
 check(es.filter(e=>e.repeatable).length===4,race+' 4 repeatables');
 check(es.some(e=>e.objective.kind==='choice'),race+' at least one noncombat');
}
for(const n of npcs){
 check(areas[n.areaId]?.race===n.race,n.id+' real home area');check(events.filter(e=>e.npcId===n.id).length===2,n.id+' two events');check(n.appearance&&n.voice&&n.plotRelation,n.id+' complete character brief');
}
for(const e of events){
 const n=npcs.find(n=>n.id===e.npcId);
 check(n&&n.race===e.race,e.id+' NPC/race match');check(n.areaId===e.areaId,e.id+' real current home');
 check(e.repeatable ? e.narrativeOnly===false&&e.rewards.length===1 : e.narrativeOnly&&e.rewards.length===0,e.id+' bounded designed economy rewards');
 check(e.dialogue.length>=2&&e.dialogue.every(s=>typeof s==='string'&&s.length<=45),e.id+' short dialogue');
 check(e.choices.length===2&&new Set(e.choices.map(c=>c.id)).size===2,e.id+' choice identity');
 check(e.choices.every(c=>c.dialogue.length<=45&&c.outcome&&c.effects.every(f=>f.flag.startsWith('local.'))),e.id+' local-only meaningful outcomes');
 check(e.conditions.requiredStoryFlags.length===0,e.id+' no invented mainline prerequisite');
 check(e.conditions.accessPolicy==='territoryAccess(save, race).allowed',e.id+' access hook');
 const costs=e.materials??[];
 if(e.objective.kind==='materials')check(JSON.stringify(costs)===JSON.stringify(e.objective.materials),e.id+' single canonical costs aliased in both schema shapes');
 for(const row of costs){
  const id=row.materialId,m=materials[id];
  check(!!m&&!m.storyOnly&&!m.uniqueHeld,e.id+' renewable non-special material');check(row.quantity===(e.repeatable?2:1),e.id+' bounded cost');
  check(row.key.endsWith('|0'),e.id+' no silent high-quality consumption');
  // Critical inventory alias check: dwarf legacy materials do not use catalog ID keys.
  check(worldInventoryKey(id)+'|0'===row.key,e.id+' exact canonical inventory key');
  check(m.sources.some(s=>s.startsWith(e.areaId+'.')),e.id+' material source exists in same area');
 }
 for(const row of e.rewards){ const m=materials[row.materialId]; check(m&&!m.storyOnly&&!m.uniqueHeld&&m.rarity==='常见',e.id+' common renewable reward'); check(row.quantity===1&&row.key===worldInventoryKey(row.materialId)+'|0',e.id+' exact Q0 single reward'); check(!costs.some(c=>c.materialId===row.materialId),e.id+' no reflexive exchange'); check(m.sources.some(s=>s.startsWith(e.areaId+'.'))||(e.race==='dwarf'&&row.materialId==='dwarf.ashroot')||(e.id==='local.elf.loom_padding'&&row.materialId==='elf.spiral_vine'),e.id+' existing local/racial supply'); }
 if(['victory','exploration'].includes(e.objective.kind)){
  check(e.objective.count===1,e.id+' one fresh local victory');
  for(const id of e.objective.nodeIds){check(nodes[id]?.areaId===e.areaId,e.id+' objective in own area');check(Object.values(monsters).some(m=>m.nodes.includes(id)),e.id+' real enemies');}
 }
 if(e.repeatable){
  check(costs.length>0||e.objective.kind==='victory',e.id+' no repeatable free choice');
  check(e.cooldownMs===instanceCooldownMs({kind:'dungeon'}),e.id+' existing cooldown');
  check(e.recurrence.requiresFreshObjective&&e.recurrence.requiresManualReaccept&&e.recurrence.sameCycleClaimIdempotent,e.id+' bounded recurrence');
 }
}
for(const p of meta.ringNpcPostings){check(npcs.some(n=>n.id===p.npcId),'Ring NPC is reused');check(!!areas[p.areaId],'Ring posting is real');}
const json=JSON.parse(fs.readFileSync(new URL('./racial-npc-events.json',import.meta.url),'utf8'));
check(JSON.stringify(json.npcs)===JSON.stringify(npcs)&&JSON.stringify(json.events)===JSON.stringify(events),'JSON/module parity');
check(Object.isFrozen(npcs)&&Object.isFrozen(events)&&Object.isFrozen(events[0].choices[0].effects),'deep frozen');
console.log(JSON.stringify({ok:true,assertions,npcs:npcs.length,events:events.length,races:races.length,oneTime:events.filter(e=>!e.repeatable).length,repeatable:events.filter(e=>e.repeatable).length,boundedRewardEvents:events.filter(e=>e.rewards.length===1).length,sourceCommit:meta.sourceCommit,root},null,2));

// The shipped v2 catalog above remains immutable for historical contracts.
// New accepts use a separately authored actual-objective overlay.
const [{NPC_OBJECTIVE_CONTENT:actual},{NPC_EVENTS:runtime},{getWorldMaterialPool}]=await Promise.all([load('npc-objective-content.js'),load('npc-events.js'),load('world-materials.js')]);
check(Object.keys(actual).length===60,'all 60 ordinary errands receive the new objective contract');
for(const kind of ['kill','collect','investigate'])check(Object.values(actual).filter(x=>x.taskObjective.kind===kind).length===20,kind+' 20 authored objectives');
for(const n of npcs)check(new Set(events.filter(e=>e.npcId===n.id).map(e=>actual[e.id].taskObjective.kind)).size===2,n.id+' two different gameplay types');
const checkpointIds=new Set();
for(const e of events){
 const row=actual[e.id],o=row.taskObjective;
 check(row.objectiveVersion===2,e.id+' versioned new-accept contract');
 for(const key of ['objective','choices','rewards'])check(JSON.stringify(runtime[e.id][key])===JSON.stringify(e[key]),e.id+' untouched legacy '+key);
 check(row.taskDescription&&row.taskDialogue.length>=2&&row.taskCompletion.length>=1,e.id+' full action instructions and authored turn-in');
 check(!row.taskDialogue.some(s=>/先选|还是|二选一/.test(s)),e.id+' no disguised choice in new task instructions');
 if(o.kind==='kill'){
  check(o.count===3&&o.monsterIds.length===2,e.id+' actual counted target units');
  check(o.nodeIds.length===1&&o.nodeIds[0]===e.areaId+'.field',e.id+' exact existing field');
  for(const id of o.monsterIds)check(monsters[id]?.nodes.includes(o.nodeIds[0])&&id.includes('.normal.'),e.id+' registered normal enemy '+id);
 }
 if(o.kind==='collect'){
  check(o.ownedAllowed===true&&o.materials.length===1,e.id+' owned actual inventory accepted');
  const cost=o.materials[0],m=materials[cost.materialId];
  check(m&&!m.storyOnly&&!m.uniqueHeld&&m.rarity==='常见',e.id+' existing common renewable collection');
  check([1,2].includes(cost.quantity)&&cost.key===worldInventoryKey(cost.materialId)+'|0',e.id+' exact bounded Q0 consumption');
  check(cost.sourceNodeIds.length>0&&cost.sourceNodeIds.every(id=>areas[nodes[id]?.areaId]?.race===e.race&&areas[nodes[id]?.areaId]?.number<=areas[e.areaId].number&&m.sources.includes(id)),e.id+' real source hints in accessible current/earlier area');
  check(cost.sourceNodeIds.some(nodeId=>Object.values(monsters).filter(x=>x.nodes.includes(nodeId)).some(x=>getWorldMaterialPool(x.id,nodeId)?.channels.some(c=>c.hitProbability>0&&c.entries.some(v=>v.materialId===m.id&&v.weight>0&&v.qualityWeights[0]>0)))),e.id+' attainable Q0 in actual drop pool');
  if(e.objective.kind==='materials')check(JSON.stringify(o.materials.map(({sourceNodeIds,...v})=>v))===JSON.stringify(e.materials.map(({key,quantity,materialId})=>({materialId,key,quantity}))),e.id+' old material amounts/types unchanged');
  else check(row.taskRewards.length===1&&!row.taskRewards.some(r=>r.materialId===cost.materialId),e.id+' new one-off material hand-in compensated with different common reward');
 }
 if(o.kind==='investigate'){
  check(o.checkpoints.length===2&&o.count===2,e.id+' two separate evidence actions');
  check(new Set(o.checkpoints.map(p=>p.label)).size===2,e.id+' physically distinct named locations');
  for(const p of o.checkpoints){
   check(!checkpointIds.has(p.id),e.id+' globally unique evidence identity');checkpointIds.add(p.id);
   check(areas[p.areaId]?.race===e.race&&areas[p.areaId].number<=areas[e.areaId].number,e.id+' no future locked region prerequisite');
   check(p.description&&p.evidence&&p.actionLabel&&p.evidence!==p.description,e.id+' evidence result distinct from action');
  }
 }
 for(const reward of row.taskRewards){const m=materials[reward.materialId];check(m&&!m.storyOnly&&!m.uniqueHeld&&m.rarity==='常见'&&reward.quantity===1&&reward.key===worldInventoryKey(m.id)+'|0',e.id+' bounded common task reward');}
 check(row.taskRewards.length===1,e.id+' every new task has one tangible material reward');
 if(e.repeatable||e.rewards.length)check(JSON.stringify(row.taskRewards)===JSON.stringify(e.rewards),e.id+' existing rewarded contract preserved');
}
const supplements=JSON.parse(fs.readFileSync(new URL('./actionable-objectives.json',import.meta.url),'utf8')).oneTimeRewardSupplements;
check(Object.keys(supplements).length===22,'22 formerly unpaid modern one-offs now compensated');
for(const [id,reward]of Object.entries(supplements)){
 const e=events.find(e=>e.id===id);check(!e.repeatable&&e.rewards.length===0,id+' legacy unpaid one-off unchanged');
 check(actual[id].taskRewards[0].materialId===reward.materialId&&actual[id].taskCompletion.join('').includes(reward.completion),id+' reward and NPC work context agree');
 check(reward.sourceNodeIds.every(nodeId=>materials[reward.materialId].sources.includes(nodeId)&&Object.values(monsters).filter(x=>x.nodes.includes(nodeId)).some(x=>getWorldMaterialPool(x.id,nodeId)?.channels.some(c=>c.hitProbability>0&&c.entries.some(v=>v.materialId===reward.materialId&&v.weight>0&&v.qualityWeights[0]>0)))),id+' supplemented reward exists in actual nonzero Q0 pool');
 check(reward.sourceNodeIds.every(nodeId=>nodes[nodeId].areaId===e.areaId)||(id==='local.dwarf.uncertain_branch'&&reward.sourceNodeIds.every(nodeId=>nodes[nodeId].areaId==='dwarf.a06')),id+' local source or explicit adjacent survey supply');
}
check(checkpointIds.size===40,'40 distinct registered evidence points');
check(Object.keys(actual).every(id=>id.startsWith('local.')),'no Ring, family, mainline or personal-arc rewrites');
console.log(JSON.stringify({ok:true,assertions,objectiveOverlay:60,kill:20,collect:20,investigate:20,registeredEvidencePoints:checkpointIds.size},null,2));
