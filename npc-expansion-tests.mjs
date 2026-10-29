import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as E from './dist/engine.js';
import {RACIAL_NPCS,RACIAL_NPC_EVENTS,RACIAL_NPC_BY_ID} from './dist/racial-npc-event-content.js';
import {NPC_EVENTS,beginNpcEvent,chooseNpcEventResponse,npcEventReady,recordNpcEventExploration,validNpcEventState,npcEventIsModern,npcEventObjective,investigateNpcEvent,npcEventObjectiveProgress} from './dist/npc-events.js';
import {claimTaskReward} from './dist/task-reward-transaction.js';
import {renderNpcEventBoard} from './dist/npc-event-ui.js';
import {NPC_PORTRAIT_REGISTRY} from './dist/npc-portrait-registry.js';
import {RETURN_RING_EVENTS} from './dist/return-ring-content.js';
import {NPC_OBJECTIVE_CONTENT} from './dist/npc-objective-content.js';
const old=JSON.parse(fs.readFileSync('content/racial-npc-events/v1-preserved.json','utf8'));
assert.equal(RACIAL_NPCS.length,30);assert.equal(RACIAL_NPC_EVENTS.length,60);assert.equal(new Set(RACIAL_NPCS.map(n=>n.name)).size,30);
for(const n of old.npcs)for(const [k,v]of Object.entries(n))if(k!=='portraitStatus')assert.deepEqual(RACIAL_NPC_BY_ID[n.id][k],v,'preserved NPC '+n.id+' '+k);
// Authorized prose edits may change presentation, never historical contracts.
const contract=e=>{const {description,dialogue,completion,...rest}=e;return {...rest,choices:e.choices.map(({label,dialogue,outcome,...choice})=>choice)};};
for(const e of old.events)assert.deepEqual(contract(RACIAL_NPC_EVENTS.find(x=>x.id===e.id)),contract(e),'original event IDs, choices, objectives, rewards, conditions and progress remain exact');
for(const r of RETURN_RING_EVENTS){assert(RACIAL_NPC_BY_ID[r.npcId]);assert(NPC_PORTRAIT_REGISTRY[r.npcId]);}
const now=Date.now();
function fixture(d){const s=E.fresh(d.race);E.normalizeHealth(s,now);E.normalizeAreaProgress(s);E.normalizeExpedition(s);s.areaProgress[d.race]={unlocked:Array.from({length:10},(_,i)=>i+1),cleared:Array.from({length:9},(_,i)=>i+1)};s.siteId=d.areaId;s.location=E.AREAS[d.areaId].number-1;s.expedition.fieldId=d.areaId+'.field';return s;}
// Explicit production-v0.75 active contract: no modern marker/progress sidecar.
// This is historical compatibility coverage, not a fresh accept under the new rules.
function legacyActive(s,id,at){
 s.npcEvents??={version:1,entries:{}};
 s.npcEvents.entries[id]={status:'active',count:0,cycle:0,readyAt:0,acceptedAt:at,lastEncounterId:null,choiceId:null};
 assert(validNpcEventState(s));return true;
}
const explorations=Object.values(NPC_EVENTS).filter(d=>d.objective.kind==='exploration');assert.equal(explorations.length,5);
for(const d of explorations){
 const s=fixture(d),node=d.objective.nodeIds[0];
 // Existing exploration and node previews never backfill this fresh objective.
 s.regionNavigation={version:1,exploredNodeIds:[node],favoriteNodeIds:[],discoveredMaterialIds:[]};
 assert(legacyActive(s,d.id,now));chooseNpcEventResponse(s,d.id,d.choices[0].id);assert.equal(s.npcEvents.entries[d.id].count,0);assert(!npcEventReady(s,d.id));
 const before=structuredClone(s);renderNpcEventBoard(s,{race:d.race,areaId:d.areaId,now});assert.deepEqual(s,before);
 // An object resembling a visit is not a receipt if not the active encounter.
 assert(!recordNpcEventExploration(s,{id:'fake',instanceId:node,areaId:d.areaId},now));assert.equal(s.npcEvents.entries[d.id].count,0);
 const e=E.startInstanceEncounter(s,node,now+1);assert(e);assert.equal(s.npcEvents.entries[d.id].count,1);assert.equal(s.npcEvents.entries[d.id].lastEncounterId,e.id);
 assert(!recordNpcEventExploration(s,e,now+1),'same real entry is counted once');assert(!npcEventReady(s,d.id),'must stop expedition and finish encounter before report');
 const reloaded=JSON.parse(JSON.stringify(s));assert(E.validSave(reloaded));assert.equal(reloaded.npcEvents.entries[d.id].count,1);
 for(const u of e.enemies){u.hp=1;u.control.stunUntil=s.lastHealthClock+1e8;}for(let i=0;i<50&&!e.done;i++)E.step(s,e);assert(e.win);E.reward(s,e);s.running=false;
 assert(npcEventReady(s,d.id));const storage={raw:JSON.stringify(s),getItem(){return this.raw;},setItem(k,v){this.raw=v;}};
 const result=claimTaskReward(storage,s,d.id,{now:now+10000});assert(result.ok);assert.equal(result.game.npcEvents.entries[d.id].choiceId,d.choices[0].id);assert(!beginNpcEvent(result.game,d.id,now+999999),'explorations are one-offs, no free reward loop');
}
// Registered mainline encounters share node construction, but must not credit local exploration.
const {reachStoryScene}=await import('./story-event-test-fixture.mjs');
for(const [race,scene,id,scenario]of [['elf','C02.E02.elf','local.elf.echo_bird_roost',null],['ashen','C05.EA01.ashen','local.ashen.airflow_walk','story.c05.ashen-duel']]){
 const s=reachStoryScene(race,scene),at=Math.max(s.lastSeen,s.lastHealthClock,s.nextBattleAt??0)+2000;assert(legacyActive(s,id,at));chooseNpcEventResponse(s,id,'option_1');
 const battle=scenario?E.startStoryScenario(s,scenario,at+1):E.startStoryFieldEncounter(s,scene,at+1);assert(battle);assert.equal(s.npcEvents.entries[id].count,0,'registered mainline never supplies exploration receipt');
}
// A production save with all original completed records remains valid without migration/reset.
const history=fixture(NPC_EVENTS['local.dwarf.lamp_labels']);history.npcEvents={version:1,entries:{}};history.taskRewardClaims=[];
for(const d of old.events){history.npcEvents.entries[d.id]={status:'resolved',count:d.objective.count??0,cycle:0,readyAt:d.repeatable?now+300000:0,acceptedAt:now,lastEncounterId:d.objective.kind==='victory'?'historic-real-victory':null,choiceId:d.choices[1].id};history.taskRewardClaims.push(d.repeatable?d.id+'.cycle-0':d.id);}
assert(validNpcEventState(history));assert(E.validSave(history));const serialized=JSON.stringify(history);assert.equal(JSON.stringify(JSON.parse(serialized)),serialized);assert.equal(history.npcEvents.entries['local.dwarf.lamp_labels'].choiceId,'option_2');
// Every material-paying ordinary event stays ready at full capacity; no paid cost/reward/record can partially commit.
const inventoryKeys=Object.keys(E.MATERIALS).filter(k=>!E.MATERIALS[k].storyOnly).flatMap(k=>[0,1,2,3].map(q=>E.materialKey(k,q)).filter(Boolean));
for(const d of Object.values(NPC_EVENTS).filter(d=>!d.requiresStoryFlag&&d.rewards.length)){
 const s=fixture(d),rewardKey=d.rewards[0].key,costKey=d.materials[0]?.key;
 const fillers=inventoryKeys.filter(k=>k!==rewardKey&&k!==costKey).slice(0,costKey?99:100);s.materialStacks=Object.fromEntries(fillers.map(k=>[k,1]));if(costKey)s.materialStacks[costKey]=d.materials[0].quantity+1;
 assert(legacyActive(s,d.id,now));chooseNpcEventResponse(s,d.id,d.choices[0].id);
 if(d.objective.kind==='victory'){const battle=E.startInstanceEncounter(s,d.objective.nodeIds[0],now+1);assert(battle);for(const u of battle.enemies){u.hp=1;u.control.stunUntil=s.lastHealthClock+1e8;}for(let i=0;i<50&&!battle.done;i++)E.step(s,battle);assert(battle.win);E.reward(s,battle);s.running=false;delete s.materialStacks[rewardKey]; // battle reward must not pre-open this capacity test's reward slot
 s.materialStacks=Object.fromEntries(fillers.map(k=>[k,1]));}
 assert(npcEventReady(s,d.id));const before=JSON.stringify(s),storage={raw:before,getItem(){return this.raw;},setItem(k,v){this.raw=v;}};
 let tx=claimTaskReward(storage,s,d.id,{now:now+10000});assert.equal(tx.reason,'reward-unavailable',d.id);assert.equal(JSON.stringify(s),before);assert.equal(storage.raw,before);
 delete s.materialStacks[fillers[0]];storage.raw=JSON.stringify(s);tx=claimTaskReward(storage,s,d.id,{now:now+10000});assert(tx.ok,d.id);assert.equal(tx.game.materialStacks[rewardKey],1);assert.equal(tx.game.npcEvents.entries[d.id].status,'resolved');
}
// Cards render only current area's registered cast and never preload all thirty.
for(const d of Object.values(NPC_EVENTS).filter(d=>!d.requiresStoryFlag)){
 const html=renderNpcEventBoard(fixture(d),{race:d.race,areaId:d.areaId,now});assert(html.includes(NPC_PORTRAIT_REGISTRY[d.npcId].file));assert(html.includes(RACIAL_NPC_BY_ID[d.npcId].role));
 for(const src of html.matchAll(/src="([^"]+)"/g))assert(Object.values(NPC_EVENTS).some(x=>x.areaId===d.areaId&&NPC_PORTRAIT_REGISTRY[x.npcId]?.file===src[1]));assert(html.includes('loading="lazy"'));
}
console.log('PASS legacy expansion: original 15 identities and 30 event mechanical contracts preserved; all old completion records remain valid; five real post-accept exploration receipts, no preview/history backfill, reload/idempotence/return gates; area-only lazy portraits and Ring identity reuse.');

// Fresh accepts across all60 use the real contract with no response selection.
for(const d of RACIAL_NPC_EVENTS){
 const s=fixture(d),overlay=NPC_OBJECTIVE_CONTENT[d.id];assert(overlay);assert.equal(overlay.taskRewards.length,1,'all new tasks offer tangible reward');assert(beginNpcEvent(s,d.id,now));assert(npcEventIsModern(s,d.id));
 assert.deepEqual(npcEventObjective(s,d.id),overlay.taskObjective);assert.equal(chooseNpcEventResponse(s,d.id,d.choices[0].id),false);assert.equal(s.npcEvents.entries[d.id].choiceId,null);assert(E.validSave(s));
 if(overlay.taskObjective.kind==='investigate'){
  assert(!npcEventReady(s,d.id));const before=JSON.stringify(s);renderNpcEventBoard(s,{race:d.race,areaId:d.areaId,now});assert.equal(JSON.stringify(s),before,'render never investigates');
  for(const p of overlay.taskObjective.checkpoints){s.siteId=p.areaId;s.location=E.AREAS[p.areaId].number-1;s.expedition.fieldId=p.areaId+'.field';assert(investigateNpcEvent(s,d.id,p.id,now+1));assert.equal(investigateNpcEvent(s,d.id,p.id,now+2),false,'same evidence cannot count twice');}
  assert.equal(npcEventObjectiveProgress(s,d.id).count,2);s.siteId=d.areaId;s.location=E.AREAS[d.areaId].number-1;s.expedition.fieldId=d.areaId+'.field';assert(npcEventReady(s,d.id));assert(E.validSave(JSON.parse(JSON.stringify(s))));
 }
}
assert.deepEqual(Object.values(NPC_OBJECTIVE_CONTENT).reduce((out,d)=>(out[d.taskObjective.kind]=(out[d.taskObjective.kind]??0)+1,out),{}),{investigate:20,collect:20,kill:20});
console.log('PASS actionable expansion: all60 fresh accepts are version2/no choice;20kill,20collect,20investigate;40 distinct evidence interactions with persisted unique progress; original15identities/30event contracts and legacy active reward/exploration remain exact.');
