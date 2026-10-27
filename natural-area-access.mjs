/** Earn foreign-area access with ordinary dungeon clears, never edit unlocks.
 * In-memory QA helper: caller owns persistence of the returned actual state.
 */
import assert from 'node:assert/strict';import * as DefaultEngine from './dist/engine.js';
export function earnAreaAccess(s,race,target,{now=Math.max(s.lastSeen,s.lastHealthClock??0),maxSimulatedHours=12,engine=DefaultEngine}={}){
 const E=engine;
 assert(E.validSave(s));assert(E.RACE_KEYS.includes(race)&&Number.isInteger(target)&&target>=1&&target<=10);const start=now,receipt={race,target,from:Math.max(...E.getAreaProgress(s,race).unlocked),dungeons:[],victories:0,rests:0,rounds:0};
 while(!E.getAreaProgress(s,race).unlocked.includes(target)){
  const area=Math.max(...E.getAreaProgress(s,race).unlocked),site=`${race}.a${String(area).padStart(2,'0')}`,node=site+'.dungeon';
  const access=E.nodeAccess(s,node,now);if(!access.allowed)return {ok:false,reason:'territory-locked',node,access,now,receipt};
  s.running=false;s.restResume=false;E.startRest(s,now,false);now=Math.max(now+E.REST_DURATION_MS,s.restUntil??0);E.settleRest(s,now);s.lastSeen=now;
  const selected=E.chooseAdventureNode(s,node,{start:true,loop:false,fieldId:site+'.field'},now);if(!selected)return {ok:false,reason:'production-node-admission-rejected',node,now,receipt};
  const clearedBefore=E.getAreaProgress(s,race).cleared.includes(area);
  while(s.running){
   if(now-start>maxSimulatedHours*3600000)return {ok:false,reason:'bounded-natural-clear-not-achieved',node,now,receipt};
   if(E.worldEventsDue(s,now))E.advanceWorldEvents(s,now);
   if(s.restUntil>0){receipt.rests++;now=Math.max(now,s.restUntil);E.settleRest(s,now);continue;}
   now=Math.max(now,s.nextBattleAt??now);let e=s.activeEncounter??E.startRoutedEncounter(s,now);if(!e)return {ok:false,reason:'production-route-stopped',node,now,receipt};
   now=Math.max(now,s.nextActionAt??now+1100);E.step(s,e,now);receipt.rounds++;if(e.done&&e.win){E.reward(s,e,now);receipt.victories++;}
  }
  if(!E.getAreaProgress(s,race).cleared.includes(area))return {ok:false,reason:'dungeon-not-cleared',node,now,receipt};
  receipt.dungeons.push({node,firstClear:!clearedBefore,at:now});
 }
 s.lastSeen=now;assert(E.validSave(s));return {ok:true,now,simulatedMinutes:(now-start)/60000,receipt};
}
