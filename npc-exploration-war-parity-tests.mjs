import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
import {NPC_EVENTS,beginNpcEvent,chooseNpcEventResponse,npcEventReady} from './dist/npc-events.js';
import {claimTaskReward} from './dist/task-reward-transaction.js';
const originalNow=Date.now,originalRandom=Math.random,start=1800000000000;let now=start;Date.now=()=>now;
const seeded=()=>{let z=123456;Math.random=()=>((z=(Math.imul(z,1664525)+1013904223)>>>0)/4294967296);};
try {
 const s=E.fresh('human'),d=NPC_EVENTS['local.dwarf.meal_route'];
 E.normalizeHealth(s,start);E.normalizeExpedition(s);E.normalizeAreaProgress(s);s.lastSeen=start;s.level=1000;s.heroHp=E.stats(s).hp;
 s.areaProgress.dwarf={unlocked:Array.from({length:10},(_,i)=>i+1),cleared:Array.from({length:9},(_,i)=>i+1)};
 s.siteId=d.areaId;s.location=7;s.expedition.fieldId=d.areaId+'.field';s.worldEvents={version:1,lastProcessedAt:start,nextWarCheckAt:start+600000,rngState:1,serial:0};
 // Shipped v0.75 active exploration contract must retain its old receipt semantics.
 s.npcEvents={version:1,entries:{[d.id]:{status:'active',count:0,cycle:0,readyAt:0,acceptedAt:start,lastEncounterId:null,choiceId:null}}};assert(chooseNpcEventResponse(s,d.id,'option_1'));assert(E.validSave(s));s.running=true;s.stopAfterBattle=true;
 const online=structuredClone(s),off=structuredClone(s);seeded();const encounter=E.startRoutedEncounter(online,start);assert(encounter);
 let at=start;while(!encounter.done){at=online.nextActionAt;assert(at<start+600000);now=at;E.step(online,encounter,at);}assert(encounter.win);E.reward(online,encounter,at);
 now=start+1200000;E.advanceWorldEvents(online,now);seeded();const report=E.offline(off,now);
 assert.equal(report.kills,1,'genuine battle admitted and won before later war');assert.equal(off.npcEvents.entries[d.id].count,1,'historical entry remains credited while resume territory is locked');
 const receipt=x=>({...x.npcEvents.entries[d.id],lastEncounterId:null});assert.deepEqual(receipt(off),receipt(online),'actual online/offline objective state agrees');assert.equal(online.npcEvents.entries[d.id].lastEncounterId,encounter.id);assert.match(off.npcEvents.entries[d.id].lastEncounterId,new RegExp('^m2-'+start+'-[0-9]+$'),'offline receipt uses genuine entry time and unique encounter ID');assert.deepEqual(off.diplomacy,online.diplomacy);assert.equal(off.gold,online.gold);assert.deepEqual(off.materialStacks,online.materialStacks);assert(E.validSave(off));
 assert(!E.territoryAccess(off,'dwarf').allowed);assert(!npcEventReady(off,d.id));
 const storage={raw:JSON.stringify(off),getItem(){return this.raw},setItem(k,v){this.raw=v}},before=storage.raw;
 assert.equal(claimTaskReward(storage,off,d.id,{now:start+1}).reason,'not-ready','forged old submission timestamp cannot bypass CURRENT reward access');assert.equal(storage.raw,before);
 assert(!beginNpcEvent(off,'local.dwarf.lamp_labels',start+1),'old acceptance timestamp cannot bypass live war');assert.equal(E.startInstanceEncounter(off,d.areaId+'.field'),null,'ordinary current-time entry remains blocked');
 now=off.diplomacy.wars[0].expiresAt;E.advanceWorldEvents(off,now);E.normalizeHealth(off,now);const restored=JSON.parse(JSON.stringify(off));assert(E.validSave(restored));assert(npcEventReady(restored,d.id));storage.raw=JSON.stringify(restored);
 const tx=claimTaskReward(storage,restored,d.id,{now});assert(tx.ok,'saved exploration can be reported only after current access resumes');assert.equal(tx.game.npcEvents.entries[d.id].status,'resolved');assert.equal(claimTaskReward(storage,tx.game,d.id,{now}).reason,'already-claimed');
 console.log('PASS cross-race NPC exploration: genuine pre-war online/offline receipt equality, later live lock still denies ordinary entry/forged old-time claims, reload and once-only report after expiry.');
} finally {Date.now=originalNow;Math.random=originalRandom;}
