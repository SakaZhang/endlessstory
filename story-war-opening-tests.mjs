import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
import * as C from './dist/story-event-controller.js';
import {STORY_SCENES} from './dist/story-event-registry.js';
import {STORY_WAR_ID,validStoryWarState,applyStoryWarTransition,STORY_WAR_ENDINGS} from './dist/story-war-bridge.js';
import {territoryAccess,validDiplomacy} from './dist/war-diplomacy.js';
import {reachStoryScene,playActiveStoryEncounter,readAndChooseStoryScene} from './story-event-test-fixture.mjs';
import {SAVE_KEY} from './dist/storage.js';
import {renderStoryEventBoard} from './dist/story-event-ui.js';
assert.deepEqual(STORY_WAR_ENDINGS,['human','dwarf','elf','goblin','ashen'].map(race=>'C08.X04.'+race));
for(const race of ['human','dwarf','elf','goblin','ashen']){
 const id=race==='elf'?'C07.E01.elf':race==='ashen'?'C07.A01.ashen':'C07.O01.'+race;
 let s=reachStoryScene(race,id);assert(s.story.flags.includes('return-ring.recipe-revealed'));assert(!s.story.flags.includes('WAR_DECLARED'));assert.equal(s.diplomacy?.wars?.length??0,0);assert.equal(C.finishStoryScene(s,id),false,'no click-to-declare before actual route protection');
 playActiveStoryEncounter(s);const before=JSON.stringify(s),now=s.lastSeen;const quota={getItem:k=>k===SAVE_KEY?before:null,setItem(){throw Error('quota')}};
 let tx=C.transactStoryEvent(quota,s,{type:'finish',sceneId:id},{now});assert.equal(tx.ok,false);assert.equal(tx.reason,'storage');assert.equal(JSON.stringify(s),before);assert.equal(s.diplomacy?.wars?.length??0,0);
 let raw=before,writes=0;const store={getItem:k=>k===SAVE_KEY?raw:null,setItem(k,v){assert.equal(k,SAVE_KEY);raw=v;writes++}};
 tx=C.transactStoryEvent(store,s,{type:'finish',sceneId:id},{now});assert(tx.ok,'finish '+id);s=tx.game;assert(E.validSave(s));assert(validStoryWarState(s));assert(validDiplomacy(s));assert(s.story.flags.includes('WAR_DECLARED'));assert(s.story.flags.includes('C07_OPENING_COMPLETE'));assert.equal(s.diplomacy.wars.length,1);assert.equal(s.diplomacy.wars[0].id,STORY_WAR_ID);assert.equal(s.diplomacy.wars[0].status,'active');assert.equal(s.diplomacy.revision,1);assert.equal(writes,1);
 const reloaded=JSON.parse(raw);assert(validStoryWarState(reloaded));assert.deepEqual(reloaded.story,s.story);assert.equal(C.transactStoryEvent(store,s,{type:'finish',sceneId:id},{now}).ok,false);assert.equal(writes,1);assert.equal(C.beginStoryScene(s,id),false);
 for(const target of ['human','dwarf','elf','goblin','ashen'])assert.equal(territoryAccess(s,target).allowed,!(race==='elf'&&target==='ashen'||race==='ashen'&&target==='elf'));
 const malformed=structuredClone(s);delete malformed.diplomacy;assert.equal(validStoryWarState(malformed),false);
 assert(!JSON.stringify(s.story.knowledge).includes('惧死'));assert(!s.story.flags.includes('CHIEFTAIN_KILLED'));assert(!s.story.flags.includes('E_SEALED'));
 if(['elf','ashen'].includes(race)){
  const d=STORY_SCENES['C07.X01.'+race];s.areaProgress[race]={unlocked:[1,2,3,4,5,6],cleared:[1,2,3,4,5]};readAndChooseStoryScene(s,d);assert.equal(C.finishStoryScene(s,d.id),false);playActiveStoryEncounter(s);assert(C.finishStoryScene(s,d.id));assert.equal(s.diplomacy.revision,1);assert(s.story.flags.includes(race==='elf'?'E_WAR_ATTRITION_SEEN':'A_WAR_ATTRITION_SEEN'));assert.match(renderStoryEventBoard(s),/尚未开放/);
 }else assert.match(renderStoryEventBoard(s),/尚未开放/);
 assert.equal(applyStoryWarTransition(s,'made-up.scene',now),false);
}
console.log('PASS five canonical C07 openings: genuine first-front encounters then atomic declaration/war; recipe-before-war; quota rollback, reload/replay, two-sided enemy locks and neutral access, continued E/A attrition, no seal/ritual/ending or secret leakage.');
