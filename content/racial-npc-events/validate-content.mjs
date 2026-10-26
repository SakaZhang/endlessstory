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
