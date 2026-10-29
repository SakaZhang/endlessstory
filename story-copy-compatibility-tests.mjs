import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as E from './dist/engine.js';
import * as C from './dist/story-event-controller.js';
import {STORY_SCENES} from './dist/story-event-registry.js';
import {renderStoryEventBoard} from './dist/story-event-ui.js';
import {completePersonalArc} from './personal-arc-test-fixture.mjs';
const old=JSON.parse(fs.readFileSync('fixtures/v070-active-story.json')).cases;
const finale=JSON.parse(fs.readFileSync('fixtures/v070-active-finale.json')).cases;
for(const sample of [...old,...finale]){
 const s=structuredClone(sample.state),raw=JSON.stringify(s),a=s.story.activeScene,d=STORY_SCENES[a.id];assert(E.validSave(s));assert(C.validStoryEventState(s));assert.equal(C.storyEventView(s).active.line,null,'historical selected response is not pushed back into new prose');renderStoryEventBoard(s,{race:s.race,areaId:s.siteId});assert.equal(JSON.stringify(s),raw,'validation/view never migrates stored cursor/knowledge/actors');
 for(const cursor of [-1,d.lines.length+1,0]){const bad=structuredClone(s);bad.story.activeScene.cursor=cursor;assert(!E.validSave(bad),'noncanonical chosen endpoint rejected');}
 if(s.story.knowledge.length)for(const change of [k=>k.text+=' forged',k=>k.mode='forged',k=>k.sourceScene='C01.G01.goblin',k=>k.id+=' forged']){const bad=structuredClone(s);change(bad.story.knowledge[0]);assert(!E.validSave(bad),'unknown text or knowledge provenance rejected');}
}
// An old numeric endpoint with no chosen response cannot bypass new dialogue,
// choose early, start a battle or claim completion.
const pending=structuredClone(old[0].state);pending.activeEncounter=null;pending.running=false;pending.story.activeScene.encounterId=null;pending.story.activeScene.choiceId=null;
const a=pending.story.activeScene,d=STORY_SCENES[a.id];assert(a.cursor<d.lines.length);assert(E.validSave(pending));
assert(!C.chooseStoryResponse(pending,d.id,d.choices[0].id));assert(!C.canStartStoryScenario(pending,d.encounter.scenarioId));assert(!C.finishStoryScene(pending,d.id));
while(a.cursor<d.lines.length)assert(C.advanceStoryDialogue(pending,d.id));assert(C.chooseStoryResponse(pending,d.id,d.choices[0].id));assert(C.canStartStoryScenario(pending,d.encounter.scenarioId));
// Old personal selections also survive pause/reload/resume without resetting
// action progress or becoming a new reward claim.
const p=completePersonalArc('dwarf',{stopAt:'personal.dwarf.coup.01'}),id=p.story.activeScene.id;p.story.activeScene.cursor=2;assert(E.validSave(p));
const actions=C.personalSceneActions(p,STORY_SCENES[id]);assert(C.advancePersonalAction(p,{sceneId:id,step:0,optionId:actions[0].options[0].id}));assert(C.pausePersonalScene(p,id));const restored=JSON.parse(JSON.stringify(p));assert(E.validSave(restored));assert(C.beginStoryScene(restored,id));assert.equal(restored.story.activeScene.cursor,2);assert.equal(restored.personalStoryProgress.steps[id],1);assert.equal(C.storyEventView(restored).active.line,null);assert(!C.advancePersonalAction(restored,{sceneId:id,step:0,optionId:actions[0].options[0].id}));
assert(C.advancePersonalAction(restored,{sceneId:id,step:1,optionId:actions[1].options[0].id}));assert(C.finishStoryScene(restored,id));const finished=JSON.stringify(restored);assert(!C.finishStoryScene(restored,id));assert.equal(JSON.stringify(restored),finished);
console.log('PASS copy compatibility: 38 immutable legacy saves, exact old endpoints, read-only rendering, knowledge-text/provenance tamper rejection, no early-choice bypass, personal pause/reload/action receipt and one-time finish.');
