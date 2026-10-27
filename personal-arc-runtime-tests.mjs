import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
import * as C from './dist/story-event-controller.js';
import {STORY_SCENES} from './dist/story-event-registry.js';
import {PERSONAL_STORY_SCENES} from './dist/personal-story-registry.js';
import {renderStoryEventBoard} from './dist/story-event-ui.js';
import {SAVE_KEY} from './dist/storage.js';
import {completePersonalArc} from './personal-arc-test-fixture.mjs';
import {readAndChooseStoryScene,playActiveStoryEncounter,visitSceneSite} from './story-event-test-fixture.mjs';
const races=['dwarf','human','elf','goblin','ashen'];
assert.equal(Object.keys(PERSONAL_STORY_SCENES).length,30);
assert.equal(Object.values(PERSONAL_STORY_SCENES).filter(d=>d.encounter).length,8);
const snapshots=[];
for(const race of races)for(const branch of [0,1])for(const late of [false,true]){
 const s=completePersonalArc(race,{branch,late,onPersonalReady:(g,d)=>{if(!late)snapshots.push([g,d]);}});
 const rows=Object.values(PERSONAL_STORY_SCENES).filter(d=>d.pov===race);
 assert.equal(rows.filter(d=>s.story.completedScenes.includes(d.id)).length,rows.length);
 assert.equal(s.story.encounters.filter(r=>r.sceneId.startsWith('personal.')).length,rows.filter(d=>d.encounter).length,'late does not waive real field proof');
 for(const d of rows){assert.equal(s.story.choices[d.id],d.choices[branch].id);assert.equal(s.personalStoryProgress.steps[d.id],2);}
 assert.equal(s.version,6);assert(E.validSave(JSON.parse(JSON.stringify(s))));
 for(const invalid of [false,0,'']){const bad=structuredClone(s);bad.story.activeScene=invalid;assert(!E.validSave(bad));}
 if(race==='goblin')assert(!s.npcEvents,'six optional family household events are not a final-arc tax');
}
for(const [s,d]of snapshots){
 assert(!C.finishStoryScene(s,d.id),'cannot skip site actions');
 const before=JSON.stringify(s),action={type:'personal-step',sceneId:d.id,step:0,optionId:C.personalSceneActions(s,d)[0].options[0].id};
 const store={raw:before,getItem(){return this.raw;},setItem(){throw Error('quota');}};
 assert.equal(C.transactStoryEvent(store,s,action,{now:s.lastSeen+1}).reason,'storage');assert.equal(JSON.stringify(s),before);
 store.setItem=function(k,v){this.raw=v;};const tx=C.transactStoryEvent(store,s,action,{now:s.lastSeen+1});assert(tx.ok);assert.equal(tx.game.personalStoryProgress.steps[d.id],1);
 assert.equal(C.transactStoryEvent(store,tx.game,action,{now:tx.game.lastSeen+1}).ok,false,'stale step duplicate');
 const other=structuredClone(s);other.race=races.find(r=>r!==s.race);assert(!C.beginStoryScene(other,d.id));
 const remote=structuredClone(s);remote.siteId=s.race+'.a01';if(remote.siteId===d.siteId)remote.siteId=s.race+'.a02';assert(!C.applyStoryEvent(remote,action));
 assert.match(renderStoryEventBoard(s),/个人线行动目标/);assert.equal(C.personalSceneActions(s,d)[0].options.length,1,'operation, not moral quiz');
}
// Direct post-invasion P03 entry: P01/P02 stay unexperienced and unrewarded.
const skip=completePersonalArc('dwarf',{late:true,skipEarly:true});assert(!skip.story.completedScenes.includes('personal.dwarf.coup.01'));assert(!skip.story.completedScenes.includes('personal.dwarf.coup.02'));assert(skip.story.completedScenes.includes('personal.dwarf.coup.08'));
// A paused early route converts to current work after invasion without losing mainline access.
const paused=completePersonalArc('dwarf',{stopAt:'personal.dwarf.coup.02'}),id=paused.story.activeScene.id;
assert(!paused.personalStoryProgress.lateIds.includes(id));assert(C.pausePersonalScene(paused,id));assert(!paused.story.activeScene);
for(let n=0;n<70&&!paused.story.flags.includes('C08_COMPLETE');n++){
 const d=C.availableStoryScenes(paused).find(d=>!d.personal);assert(d);readAndChooseStoryScene(paused,d);if(d.encounter)playActiveStoryEncounter(paused);if(!paused.story.completedScenes.includes(d.id))assert(C.finishStoryScene(paused,d.id));
}
assert(paused.story.flags.includes('C08_COMPLETE'));assert(E.validSave(paused));visitSceneSite(paused,STORY_SCENES[id]);assert(C.beginStoryScene(paused,id));assert(paused.personalStoryProgress.lateIds.includes(id));assert.equal(paused.personalStoryProgress.steps[id],0);assert(C.storyEventView(paused).active.needsEncounter,'late still needs current route proof');
console.log('PASS personal30 /60 distinct branch paths, early+late real battles, no quizzes, current-location actions, atomic checkpoints, no-double-step, race isolation, P03 late entry without forced earlier rewards, paused resume conversion, malformed state rejection.');
const familyPaused=completePersonalArc('goblin',{stopAt:'personal.goblin.family.01'}),familyId=familyPaused.story.activeScene.id;
assert.equal(familyPaused.siteId,'goblin.a04');assert(C.pausePersonalScene(familyPaused,familyId));
for(let n=0;n<80&&!familyPaused.story.flags.includes('G_FAMILY_SAFE');n++){
 if(familyPaused.story.flags.includes('INVASION_BEGAN'))assert(!C.availableStoryScenes(familyPaused).some(d=>d.id===familyId),'no fictional early safe relocation');
 const d=C.availableStoryScenes(familyPaused).find(d=>!d.personal);assert(d);readAndChooseStoryScene(familyPaused,d);if(d.encounter)playActiveStoryEncounter(familyPaused);if(!familyPaused.story.completedScenes.includes(d.id))assert(C.finishStoryScene(familyPaused,d.id));
}
const familyOffer=C.availableStoryScenes(familyPaused).find(d=>d.id===familyId);assert.equal(familyOffer.siteId,'goblin.a02');visitSceneSite(familyPaused,familyOffer);assert(C.beginStoryScene(familyPaused,familyId));assert(C.storySceneLocationAvailable(familyPaused,STORY_SCENES[familyId]));assert(familyPaused.personalStoryProgress.lateIds.includes(familyId));
console.log('PASS deferred Goblin preparation resumes only at mainline-confirmed a02 safe camp after actual C10 family rescue.');
