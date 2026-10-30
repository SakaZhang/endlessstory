import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
import {reachStoryScene} from './story-event-test-fixture.mjs';
const s=reachStoryScene('human','END.H01.human',{finishTarget:true,level:100,spring:'skip'});s.running=false;s.heroHp=E.stats(s).hp;assert(E.enterOtherworld(s,s.lastHealthClock+2000));let e=E.startRoutedEncounter(s,s.lastHealthClock+4000);e.rngState=12345;s.lastSeen=s.lastHealthClock;const live=structuredClone(s);
while(!e.done)E.step(s,e,s.nextActionAt);assert(e.win&&!e.rewarded);
for(const size of [31,32]){
 const c=JSON.parse(JSON.stringify(s));c.otherworld.pendingEquipment=Array.from({length:size},()=>E.item('weapon',100,null,1,{baseLevel:100,levelSource:'drop',originRace:'human'}));c.lastSeen=c.lastHealthClock;const before=JSON.stringify(c.otherworld.pendingEquipment),id=c.activeEncounter.id,oldKills=c.kills,oldFloor=c.otherworld.floor;assert(E.validSave(c));
 const result=E.offline(c,c.lastSeen+100000);assert.equal(result.kills,0);assert.equal(c.kills,oldKills);assert.equal(c.otherworld.floor,oldFloor);assert.equal(c.running,false);assert.equal(c.activeEncounter.id,id);assert(c.activeEncounter.win&&!c.activeEncounter.rewarded);assert.equal(JSON.stringify(c.otherworld.pendingEquipment),before);assert(E.validSave(c));
 c.inventory=c.inventory.filter(it=>Object.values(c.equip).includes(it.id));assert.equal(E.claimPendingOtherworldEquipment(c).claimed,size);c.running=true;const resumed=E.offline(c,c.lastSeen+1);assert.equal(resumed.kills,1);assert.equal(c.kills,oldKills+1);assert.equal(c.otherworld.floor,oldFloor+1);assert.equal(c.activeEncounter,null);assert(E.validSave(c));
 const again=E.offline(c,c.lastSeen);assert.equal(again,null);assert.equal(c.kills,oldKills+1);
}
// Rejection at the post-step settlement path must not report a fictitious kill.
{
 const c=structuredClone(live);c.kills=1e12;c.lastSeen=c.lastHealthClock;const id=c.activeEncounter.id;assert(E.validSave(c));const result=E.offline(c,c.lastSeen+120000);assert.equal(result.kills,0);assert.equal(c.kills,1e12);assert.equal(c.running,false);assert.equal(c.activeEncounter.id,id);assert(c.activeEncounter.done&&c.activeEncounter.win&&!c.activeEncounter.rewarded);assert.equal(c.otherworld.highestCleared,0);assert(E.validSave(c));
}
console.log('PASS valid JSON pending31/32+won tower pauses with0falsekills, exact pending/victory retained, claim/resume settles once; post-step rejected settlement also pauses with0falsekills.');
