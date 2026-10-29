import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
import {completeStory} from './story-event-test-fixture.mjs';
import {RETURN_RING_EVENTS} from './dist/return-ring-content.js';
import {beginNpcEvent,investigateNpcEvent,npcEventObjectiveProgress,npcEventReady,declineNpcEvent,validNpcEventState} from './dist/npc-events.js';
import {claimTaskReward} from './dist/task-reward-transaction.js';
import {SAVE_KEY,loadProgress} from './dist/storage.js';
const now=Date.now();
function storage(s){let raw=JSON.stringify(s);return {getItem:()=>raw,setItem:(k,v)=>raw=v};}
function fixture(d){const s=completeStory(d.race);E.normalizeHealth(s,now);E.normalizeAreaProgress(s);E.normalizeExpedition(s);s.areaProgress[d.race]={unlocked:[1,2,3,4,5,6],cleared:[1,2,3,4,5]};s.siteId=d.areaId;s.location=E.AREAS[d.areaId].number-1;s.expedition.fieldId=d.areaId+'.field';s.running=false;assert(E.validSave(s));return s;}
function battle(s,node,defer=false){s.running=false;s.nextBattleAt=0;s.restUntil=0;if(!node.endsWith('.field'))s.instanceCooldowns[node]=0;if(node.endsWith('.field'))s.expedition={...s.expedition,mode:'field',targetInstanceId:null};s.heroHp=E.stats(s).hp;const e=E.startInstanceEncounter(s,node,Math.max(now,s.lastHealthClock)+2000);assert(e,node+JSON.stringify({npc:validNpcEventState(s),progress:s.npcObjectiveProgress,entry:s.npcEvents,run:s.dungeonRun,valid:E.validSave(s),rest:s.restUntil,exp:s.expedition,active:s.activeEncounter?.rewarded,clock:s.lastHealthClock}));for(const u of e.enemies){u.hp=1;u.control.stunUntil=s.lastHealthClock+1e8;}if(defer)return e;for(let n=0;n<100&&!e.done;n++)E.step(s,e,s.lastHealthClock+1100);assert(e.win);E.reward(s,e,s.lastHealthClock);s.running=false;assert(E.validSave(s));return e;}
function investigate(s,d,point){s.restUntil=0;assert(investigateNpcEvent(s,d.id,point.id,Math.max(now,s.lastHealthClock)));assert(E.validSave(s));}
for(const d of RETURN_RING_EVENTS){let s=fixture(d);const [trace,clear,recover]=d.taskObjective.checkpoints;
 battle(s,d.areaId+'.dungeon');battle(s,d.areaId+'.dungeon');battle(s,d.areaId+'.dungeon');s.restUntil=0;
 assert(beginNpcEvent(s,d.id,Math.max(now,s.lastHealthClock)));assert(!npcEventReady(s,d.id));assert(!investigateNpcEvent(s,d.id,recover.id,s.lastHealthClock));assert(!investigateNpcEvent(s,d.id,clear.id,s.lastHealthClock));
 battle(s,d.areaId+'.field');assert.equal(npcEventObjectiveProgress(s,d.id).count,0);
 investigate(s,d,trace);battle(s,d.areaId+'.dungeon');assert.equal(npcEventObjectiveProgress(s,d.id).count,1);battle(s,d.areaId+'.dungeon');assert.equal(npcEventObjectiveProgress(s,d.id).count,1);
 s=JSON.parse(JSON.stringify(s));assert(E.validSave(s));const e=battle(s,d.areaId+'.dungeon');assert.equal(npcEventObjectiveProgress(s,d.id).count,2);E.reward(s,e,s.lastHealthClock);assert.equal(npcEventObjectiveProgress(s,d.id).count,2);assert(!npcEventReady(s,d.id));
 investigate(s,d,recover);assert(npcEventReady(s,d.id));const tx=claimTaskReward(storage(s),s,d.id,{now:s.lastHealthClock});assert(tx.ok,tx.reason);s=tx.game;assert(E.validSave(s));assert.equal(s.materialStacks[d.rewards[0].key],1);assert(!beginNpcEvent(s,d.id,s.lastHealthClock));
 const declined=fixture(d);assert(declineNpcEvent(declined,d.id));assert(!beginNpcEvent(declined,d.id,now));assert(E.validSave(declined));
}
// Joining a dungeon after its first two stages never substitutes for a full run.
{const d=RETURN_RING_EVENTS[0],s=fixture(d),[trace,clear,recover]=d.taskObjective.checkpoints;
 battle(s,clear.nodeId);battle(s,clear.nodeId);s.restUntil=0;assert(beginNpcEvent(s,d.id,s.lastHealthClock));investigate(s,d,trace);battle(s,clear.nodeId);
 assert.equal(npcEventObjectiveProgress(s,d.id).count,1);assert(!investigateNpcEvent(s,d.id,recover.id,s.lastHealthClock));
 for(let stage=1;stage<=3;stage++)battle(s,clear.nodeId);assert.equal(npcEventObjectiveProgress(s,d.id).count,2);
 const corrupt=structuredClone(s);corrupt.npcObjectiveProgress.entries[d.id].receipts.reverse();assert(!E.validSave(corrupt));
}
// Final-stage progress uses identical receipts during bounded offline replay.
{const d=RETURN_RING_EVENTS[0],s=fixture(d),[trace,clear]=d.taskObjective.checkpoints;
 assert(beginNpcEvent(s,d.id,s.lastHealthClock));investigate(s,d,trace);battle(s,clear.nodeId);battle(s,clear.nodeId);battle(s,clear.nodeId,true);
 s.stopAfterBattle=true;s.lastSeen=s.lastHealthClock;const online=structuredClone(s),offline=structuredClone(s),end=s.lastHealthClock+60000;
 while(!online.activeEncounter.done)E.step(online,online.activeEncounter,online.nextActionAt);E.reward(online,online.activeEncounter,online.lastHealthClock);
 E.offline(offline,end);assert.deepEqual(offline.npcObjectiveProgress,online.npcObjectiveProgress);assert.equal(npcEventObjectiveProgress(offline,d.id).count,2);assert(E.validSave(offline));const before=structuredClone(offline.npcObjectiveProgress);E.offline(offline,end);assert.deepEqual(offline.npcObjectiveProgress,before);
}
console.log('PASS all five return-ring contracts: investigation, genuine full dungeon, ordered recovery, reload, duplicate, historical victory exclusion, one-time rewards, permanent declines preserved');
