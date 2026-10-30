import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
import {reachStoryScene} from './story-event-test-fixture.mjs';
import {createIdleActionController} from './dist/idle-action-controller.js';
const at=s=>Math.max(s.lastSeen,s.lastHealthClock??0,s.nextBattleAt??0)+2000;
let s=reachStoryScene('human','END.H01.human',{finishTarget:true,level:100,spring:'skip'});s.running=false;s.heroHp=E.stats(s).hp;
assert(E.travelToArea(s,'dwarf.a01',at(s)));assert(E.setExpeditionAutomation(s,'boss',true));assert(E.setExpeditionAutomation(s,'dungeon',true));const original=JSON.stringify([s.siteId,s.location,s.expedition]);assert(E.enterOtherworld(s,at(s)));let e=E.startRoutedEncounter(s,at(s));assert(e.otherworld);assert.equal(JSON.stringify([s.siteId,s.location,s.expedition]),original);
let tick=at(s),applied=0;const controller=createIdleActionController({read:()=>s,now:()=>tick,commit:action=>{const next=structuredClone(s),value=action(next);if(!value||!E.validSave(next))return {ok:false};s=next;return {ok:true,value};}});
assert.equal(controller.request({key:'test-equip',label:'装备',action:next=>{applied++;return E.equipItem(next,next.equip.weapon,'weapon');}}).status,'queued');
while(!e.done)E.step(s,e,s.nextActionAt);assert(e.win);E.reward(s,e,s.lastHealthClock);tick=at(s);assert.equal(controller.pump().status,'applied');assert.equal(applied,1);assert(s.running&&s.otherworld.active);assert.equal(E.nextEncounterRoute(s,tick).kind,'otherworld');assert.equal(JSON.stringify([s.siteId,s.location,s.expedition]),original);
// A random war involving the retained return region does not stop the tower.
assert(E.startRandomWar(s,{id:'tower-return-war',races:['human','dwarf'],durationMs:3600000},tick));assert(s.running);assert(!E.retreatWarTerritory(s,'human.a01'));assert.equal(JSON.stringify([s.siteId,s.location,s.expedition]),original);
e=E.startRoutedEncounter(s,tick+2000);assert(e.otherworld);s.stopAfterBattle=true;while(!e.done)E.step(s,e,s.nextActionAt);assert(e.win);E.reward(s,e,s.lastHealthClock);assert.equal(s.running,false);assert(E.exitOtherworld(s));assert.equal(s.running,false);assert.equal(E.nextEncounterRoute(s,at(s)),null);assert.equal(JSON.stringify([s.siteId,s.location,s.expedition]),original);assert(E.validSave(s));
// Saturated valid active queue pauses before offline can spin on a reward.
assert(E.enterOtherworld(s,at(s)));e=E.startRoutedEncounter(s,at(s));assert(e);const bad=structuredClone(s);bad.otherworld.pendingEquipment=Array.from({length:31},()=>E.item('weapon',100,null,1,{baseLevel:100,levelSource:'drop',originRace:'human'}));assert(E.validSave(bad));assert.equal(E.offline(bad,at(bad)+100000).kills,0);assert.equal(bad.running,false);assert(bad.activeEncounter);
console.log('PASS tower overrides ordinary boss/dungeon automation, idle equip resumes same mode, war does not interrupt tower, safe blocked return remains stopped, saturated active queue paused safely.');
