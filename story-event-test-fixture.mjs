// Test-only fixture. No production flag setters. Every scene is traversed through
// the real controller and every encounter through the actual combat engine.
import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
import * as C from './dist/story-event-controller.js';
export function preparedStoryGame(race,{level=60,now=1800000000000}={}){
 const s=E.fresh(race);s.level=level;s.lastSeen=now;E.normalizeHealth(s,now);E.normalizeAreaProgress(s);E.normalizeExpedition(s);
 for(const r of ['human','dwarf','elf','goblin','ashen'])s.areaProgress[r]={unlocked:[1,2,3,4,5],cleared:[1,2,3,4]};
 assert(E.validSave(s));return s;
}
export function visitSceneSite(s,d){
 const now=Math.max(s.lastSeen,s.lastHealthClock??0,s.nextBattleAt??0)+2000;s.running=false;
 if(s.siteId!==d.siteId){assert(E.chooseAdventureNode(s,d.siteId+'.field',{start:true},now),'navigate '+d.id);const e=s.activeEncounter;s.stopAfterBattle=true;let rounds=0;while(!e.done&&rounds++<3000)E.step(s,e,s.nextActionAt);assert(e.done&&e.win,'travel clear '+d.id);E.reward(s,e,s.lastHealthClock);s.running=false;}
 s.lastSeen=Math.max(now,s.lastHealthClock??0);return s.lastSeen;
}
export function readAndChooseStoryScene(s,d,selected){
 visitSceneSite(s,d);assert(C.beginStoryScene(s,d.id),'begin '+d.id);
 for(let i=0;i<d.lines.length;i++)assert(C.advanceStoryDialogue(s,d.id),'dialogue '+d.id);
 const id=selected??d.choices[0].id;assert(C.chooseStoryResponse(s,d.id,id),'choice '+d.id);assert(E.validSave(s));return id;
}
export function playActiveStoryEncounter(s,{reload=true}={}){
 let d=C.storyEventView(s).active;assert(d?.encounter);const type=d.encounter.kind==='scenario'?'scenario':'encounter';
 assert(C.applyStoryEvent(s,{type,sceneId:d.id,scenarioId:d.encounter.scenarioId,nodeId:d.encounter.nodeId},{now:Math.max(s.lastHealthClock??0,s.nextBattleAt??0)+2000}),'start '+d.id);
 let e=s.activeEncounter;assert(e);let rounds=0;
 while(!e.done&&rounds++<3000){E.step(s,e,s.nextActionAt);assert(E.validSave(s),'valid actual combat '+d.id);if(!e.done&&reload&&rounds===1){const restored=JSON.parse(JSON.stringify(s));Object.assign(s,restored);e=s.activeEncounter;}}
 assert(e.done,'combat finite '+d.id);if(!e.storyScenario){assert(e.win,'ordinary clear '+d.id);E.reward(s,e,s.lastHealthClock);}else assert.notEqual(e.storyScenario.result,'retry','story clear '+d.id);
 s.running=false;s.lastSeen=s.lastHealthClock;assert(E.validSave(s),'valid settlement '+d.id);assert(C.storyEventView(s).active.receipt,'recorded '+d.id);return e;
}
export function reachStoryScene(race,target,{spring='full',level=60,finishTarget=false}={}){
 const s=preparedStoryGame(race,{level});let steps=0;
 while(steps++<100){
  const offers=C.availableStoryScenes(s);let d=offers.find(x=>x.id===target)??offers.find(x=>spring==='skip'?!x.optional:true)??offers[0];assert(d,'reachable '+target);
  const choose=d.id==='C02.E01.elf'?(spring==='skip'?'later':'help'):undefined;
  readAndChooseStoryScene(s,d,choose);
  if(d.id===target&&!finishTarget)return s;
  if(d.encounter)playActiveStoryEncounter(s);
  assert(C.finishStoryScene(s,d.id),'finish '+d.id);assert(E.validSave(s));
  if(d.id===target)return s;
 }
 throw Error('route did not reach '+target);
}
export function completeStory(race,options={}){return reachStoryScene(race,'C06.RR01.'+race,{...options,finishTarget:true});}
