import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
import * as C from './dist/story-event-controller.js';
import {NPC_EVENTS,beginNpcEvent,chooseNpcEventResponse,npcEventAccess,npcEventReady} from './dist/npc-events.js';
import {claimTaskReward} from './dist/task-reward-transaction.js';
import {STORY_WAR_ID} from './dist/story-war-bridge.js';
import {reachStoryScene,playActiveStoryEncounter} from './story-event-test-fixture.mjs';
const originalNow=Date.now;let now=1800000000000;Date.now=()=>now;
const storage=s=>({raw:JSON.stringify(s),getItem(){return this.raw},setItem(k,v){this.raw=v}});
try {
 for(const race of ['elf','ashen']){
  let s=reachStoryScene(race,'C08.X04.'+race),opponent=race==='elf'?'ashen':'elf';now=Math.max(s.lastSeen,s.lastHealthClock)+2000;
  const def=Object.values(NPC_EVENTS).find(d=>d.race===opponent&&!d.requiresStoryFlag&&d.objective.kind==='choice'&&!d.conditions?.requiredEventIds?.length&&!d.conditions?.requiredStoryFlags?.length);
  assert(def);const denied=structuredClone(s);denied.siteId=def.areaId;assert.equal(npcEventAccess(denied,def.id).code,'war');assert(!beginNpcEvent(denied,def.id,now));
  assert(E.startRandomWar(s,{id:'random.cross.'+race,races:[race,'human'],durationMs:3600000},now));
  playActiveStoryEncounter(s);now=Math.max(s.lastSeen,s.lastHealthClock)+2000;assert.equal(s.diplomacy.wars.find(w=>w.id===STORY_WAR_ID).status,'active');
  const tx=C.transactStoryEvent(storage(s),s,{type:'finish',sceneId:'C08.X04.'+race},{now});assert(tx.ok);s=tx.game;
  assert.equal(s.diplomacy.wars.find(w=>w.id===STORY_WAR_ID).status,'ended');assert.equal(s.diplomacy.wars.find(w=>w.id==='random.cross.'+race).status,'active','C08 ends exactly the narrative pair, not unrelated random incidents');assert(!E.territoryAccess(s,'human').allowed);assert.equal(E.startInstanceEncounter(s,'human.a01.field',now),null);
  assert(E.territoryAccess(s,opponent).allowed);assert(E.chooseAdventureNode(s,def.areaId+'.field',{start:true},now));const e=s.activeEncounter;s.stopAfterBattle=true;let turns=0;while(!e.done&&turns++<3000){now=s.nextActionAt;E.step(s,e,now);}assert(e.win);E.reward(s,e,now);s.running=false;
  assert(beginNpcEvent(s,def.id,now));assert(chooseNpcEventResponse(s,def.id,def.choices[0].id));assert(npcEventReady(s,def.id));const claim=claimTaskReward(storage(s),s,def.id,{now});assert(claim.ok,'opponent ordinary local event resumes after real invasion completion');assert(E.validSave(JSON.parse(JSON.stringify(claim.game))));
 }
 console.log('PASS actual C08 invasion reopens opponent ordinary field and NPC reporting, while unrelated random war remains locked; story receipt alone cannot end war.');
} finally {Date.now=originalNow;}
