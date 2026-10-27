// Real controller, travel and combat fixture. No fabricated flags or receipts.
import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
import * as C from './dist/story-event-controller.js';
import {PERSONAL_ARC_REWARDS} from './dist/personal-arc-rewards.js';
import {preparedStoryGame,readAndChooseStoryScene,playActiveStoryEncounter} from './story-event-test-fixture.mjs';
export function completePersonalArc(race,{branch=0,late=false,skipEarly=false,onPersonalReady=null,stopAt=null}={}){
 const s=preparedStoryGame(race),arc=Object.values(PERSONAL_ARC_REWARDS).find(a=>a.race===race);
 for(let i=0;i<150;i++){
  const available=C.availableStoryScenes(s);
  const personal=available.filter(d=>d.personal&&(!skipEarly||!['personal.dwarf.coup.01','personal.dwarf.coup.02'].includes(d.id)));
  const main=available.filter(d=>!d.personal);
  const d=(!late||s.story?.flags.includes('MAIN_STORY_CLEAR')?personal[0]:null)??main[0];
  assert(d,'reachable arc '+race);readAndChooseStoryScene(s,d,d.personal?d.choices[branch].id:undefined);
  if(d.personal){
   onPersonalReady?.(structuredClone(s),d);if(stopAt===d.id)return s;
   let actions=C.personalSceneActions(s,d);
   for(let step=0;step<actions.length;step++){
    assert(C.applyStoryEvent(s,{type:'personal-step',sceneId:d.id,step,optionId:actions[step].options[0].id}));
    assert(E.validSave(s));Object.assign(s,JSON.parse(JSON.stringify(s)));
   }
  }
  if(d.encounter){
   if(d.chapter<9){assert(E.startRest(s,Math.max(s.lastSeen,s.lastHealthClock??0)+2000));const wake=s.restUntil+1;assert(E.settleRest(s,wake));s.lastSeen=wake;}
   playActiveStoryEncounter(s);
  }
  if(!s.story.completedScenes.includes(d.id))assert(C.finishStoryScene(s,d.id),'finish '+d.id);
  assert(E.validSave(s),'valid '+d.id);if(d.id===arc.finalSceneId)return s;
 }
 throw Error('did not complete arc '+race);
}
