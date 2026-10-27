import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
import {RANDOM_WAR_RULES as R} from './dist/random-world-events.js';
const HOUR=3600000,START=1700172800000;
// Exact scheduler snapshot from a valid, naturally earned 48h human save.
// Autosave can persist lastSeen before the world scheduler handles this deadline.
function checkpoint(offset=0){
 const s=E.fresh('human');s.lastSeen=START+offset;E.normalizeHealth(s,s.lastSeen);E.normalizeExpedition(s);
 s.worldEvents={version:1,lastProcessedAt:1700172200155,nextWarCheckAt:START,rngState:615444475,serial:0};
 assert(E.validSave(s));return s;
}
for(const offset of [0,1,599999]){
 const initial=checkpoint(offset),start=initial.lastSeen,end=start+4*HOUR;
 const online=structuredClone(initial),offline=structuredClone(initial),capped=structuredClone(initial);
 let checks=E.advanceWorldEvents(online,start).checks;
 for(let t=START+R.checkIntervalMs;t<=end;t+=R.checkIntervalMs)checks+=E.advanceWorldEvents(online,t).checks;
 E.advanceWorldEvents(online,end);
 const report=E.offline(offline,end);
 assert.equal(checks,25);assert.equal(report.worldEvents.checks,25);assert.equal(report.minutes,240);
 assert.deepEqual(offline.worldEvents,online.worldEvents);assert.deepEqual(offline.diplomacy,online.diplomacy);
 if(offset===0)assert.equal(offline.worldEvents.rngState,1605216752);
 const cap=E.offline(capped,start+8*HOUR);
 assert.equal(cap.minutes,240);assert.equal(cap.capped,true);assert.equal(cap.worldEvents.checks,25);
 assert.equal(capped.worldEvents.rngState,offline.worldEvents.rngState);
 assert(cap.worldEvents.declared.every(w=>w.startedAt<=end));
 assert.equal(capped.worldEvents.nextWarCheckAt,start+8*HOUR+R.checkIntervalMs);
 const world=JSON.stringify(capped.worldEvents),diplomacy=JSON.stringify(capped.diplomacy);
 assert.equal(E.offline(capped,start+8*HOUR),null);
 assert.equal(JSON.stringify(capped.worldEvents),world);assert.equal(JSON.stringify(capped.diplomacy),diplomacy);
 assert.equal(E.advanceWorldEvents(capped,start+8*HOUR).checks,0);
 const rng=capped.worldEvents.rngState;assert(E.advanceWorldEvents(capped,start-1).clockRollback);
 assert.equal(capped.worldEvents.rngState,rng);assert(E.validSave(capped));
}
// A declaration on the owed starting deadline is replayed at that original
// instant (not at return), preserving foreign-territory access and its expiry.
{const initial=checkpoint();initial.worldEvents.rngState=1;const online=structuredClone(initial),offline=structuredClone(initial);
 const first=E.advanceWorldEvents(online,START);assert.equal(first.declared.length,1);assert.equal(first.declared[0].startedAt,START);
 assert(!E.territoryAccess(online,'dwarf',START).allowed);
 for(let t=START+R.checkIntervalMs;t<=START+4*HOUR;t+=R.checkIntervalMs)E.advanceWorldEvents(online,t);
 const report=E.offline(offline,START+4*HOUR);assert.equal(report.worldEvents.declared[0].startedAt,START);
 assert.deepEqual(offline.worldEvents,online.worldEvents);assert.deepEqual(offline.diplomacy,online.diplomacy);assert(E.territoryAccess(offline,'dwarf',START+4*HOUR).allowed);}
// A genuinely stale backlog does NOT gain an extra check or unlimited catch-up.
{const s=checkpoint(2*R.checkIntervalMs),report=E.offline(s,s.lastSeen+8*HOUR);assert.equal(report.worldEvents.checks,24);assert(report.worldEvents.declared.every(w=>w.startedAt<=START+4*HOUR));assert(E.validSave(s));}
// Ordinary fresh start still grants only 24 checks, not a global cap increase.
{const s=checkpoint();s.worldEvents.lastProcessedAt=START;s.worldEvents.nextWarCheckAt=START+R.checkIntervalMs;const r=E.offline(s,START+8*HOUR);assert.equal(r.worldEvents.checks,24);assert.equal(r.minutes,240);assert(E.validSave(s));}
console.log('PASS saved pending-deadline world parity: exact natural checkpoint, 25 inclusive boundary checks, 4h/8h cap, sub-interval autosave, bounded backlog, repeated calls and rollback');
