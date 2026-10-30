import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
import {createIdleActionController} from './dist/idle-action-controller.js';
import {commitGameTransaction,SAVE_KEY} from './dist/storage.js';
import {markVictory} from './current-combat-test-fixture.mjs';
let now=1700000000000,s,fail=false,raw,c;
function setup(){s=E.fresh('human');s.lastSeen=now;E.normalizeHealth(s,now);E.normalizeExpedition(s);s.areaProgress.human={unlocked:[1,2,3],cleared:[1,2]};raw=JSON.stringify(s);fail=false;c=createIdleActionController({read:()=>s,now:()=>now,commit:f=>{const tx=commitGameTransaction({getItem:()=>raw,setItem:(k,v)=>{if(fail)throw Error('quota');raw=v;}},s,f,{now});if(tx.ok)s=tx.game;return tx;}});}
setup();assert.equal(c.request({action:n=>E.travelToArea(n,'human.a02',now)}).status,'applied');assert.equal(s.running,false);assert.equal(s.siteId,'human.a02');
setup();E.startInstanceEncounter(s,'human.a01.field',now);const encounter=JSON.stringify(s.activeEncounter);assert.equal(c.request({action:n=>E.travelToArea(n,'human.a02',now)}).status,'queued');assert.equal(JSON.stringify(s.activeEncounter),encounter);assert.equal(c.request({action:()=>true}).status,'busy');markVictory(s.activeEncounter);E.reward(s,s.activeEncounter,now);const gold=s.gold,ready=s.nextBattleAt;assert.equal(c.pump().status,'applied');assert.equal(s.running,true);assert.equal(s.nextBattleAt,ready);assert.equal(s.gold,gold);assert.equal(s.siteId,'human.a02');assert(E.validSave(s));
setup();s.running=true;const before=structuredClone(s);fail=true;assert.equal(c.request({action:n=>E.travelToArea(n,'human.a02',now)}).status,'rejected');assert.deepEqual(s,before);fail=false;
setup();s.running=true;assert.equal(c.request({action:()=>false}).status,'rejected');assert.equal(s.running,false);
setup();s.running=true;assert.equal(c.request({action:()=>true,hold:true}).status,'applied');assert.equal(s.running,false);assert(c.held);assert.equal(c.request({action:()=>true,hold:true}).status,'applied');assert(c.held);assert.equal(c.release().resumed,true);assert.equal(s.running,true);
setup();s.running=true;c.request({action:()=>true,hold:true});c.cancel();assert.equal(c.release().status,'idle');assert.equal(s.running,false);
setup();E.startInstanceEncounter(s,'human.a01.field',now);E.setMultiPaused(s,true,now);const paused=structuredClone(s);assert.equal(c.request({action:()=>true}).reason,'paused-battle');assert.deepEqual(s,paused);
setup();E.startInstanceEncounter(s,'human.a01.field',now);c.request({action:()=>true});E.startRest(s,now,true);assert.equal(c.pump().reason,'rest');assert.equal(s.running,true);assert.equal(s.restResume,true);
setup();s.running=true;s.nextBattleAt=now+1800;assert.equal(c.request({action:()=>true,waitForReady:true}).status,'queued');now+=1800;assert.equal(c.pump().status,'applied');assert.equal(s.running,true);
setup();s.running=true;let called=0;assert.equal(c.request({execute:()=>{called++;return {ok:true,value:42};}}).status,'applied');assert.equal(called,1);assert.equal(s.running,true);
setup();s.running=true;assert.equal(c.request({execute:()=>({ok:false,reason:'not-ready'})}).status,'rejected');assert.equal(s.running,false);
console.log('PASS idle action controller: runtime queue, reward boundary, normal delay, no idle autostart, hold/release/cancel, paused rejection, rest cancellation, failed writes and sealed transactions');
