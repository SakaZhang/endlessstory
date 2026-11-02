import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
import * as C from './dist/story-event-controller.js';
import {STORY_SCENES} from './dist/story-event-registry.js';
import {STORY_SCENARIOS,storyScenarioNonlethal} from './dist/story-scenario-registry.js';
import {renderStoryScenarioNotice} from './dist/story-scenario-combat.js';
import {renderEnemyRoster,normalizeBattleEnemies} from './dist/multi-battle-ui.js';
import {reachStoryScene,playActiveStoryEncounter,readAndChooseStoryScene} from './story-event-test-fixture.mjs';
import {SAVE_KEY} from './dist/storage.js';
const now=s=>Math.max(s.lastSeen,s.lastHealthClock??0,s.nextBattleAt??0)+2000;
const econ=s=>JSON.stringify({gold:s.gold,xp:s.xp,kills:s.kills,inventory:s.inventory,materials:s.materialStacks,claims:s.taskRewardClaims});
const start=(s,id)=>{assert(C.applyStoryEvent(s,{type:'scenario',sceneId:id,scenarioId:STORY_SCENES[id].encounter.scenarioId},{now:now(s)}));return s.activeEncounter;};
const store=(s,fail=false)=>{let raw=JSON.stringify(s),writes=0;return {get writes(){return writes},get raw(){return raw},getItem:k=>k===SAVE_KEY?raw:null,setItem(k,v){if(fail)throw Error('quota');raw=v;writes++;}};};
for(const race of ['human','dwarf','goblin','ashen']){
 for(const n of ['11','12']){
  const id='C08.O'+n+'.'+race,s=reachStoryScene(race,id),economic=econ(s);assert(!s.story.flags.includes('E_UNSEALED'));
  const e=start(s,id);assert(storyScenarioNonlethal(e));assert.equal(e.enemies[0].name,'被封印的莱姆斯');assert.equal(e.enemies[0].storyActorRace,'elf');assert.equal(e.enemies[0].storyActorWeapon,'staff');
  const ui=renderEnemyRoster(e);assert(ui.includes('data-story-actor="elf"'));assert(ui.includes('封印束缚'));assert(!ui.includes('data-monster-detail'));
  let rounds=0;while(!e.done&&rounds++<3000)E.step(s,e,s.nextActionAt);assert(e.done);assert.notEqual(e.storyScenario.result,'retry');assert(e.enemies[0].hp>=1);assert.equal(econ(s),economic);assert(E.validSave(s));assert(C.finishStoryScene(s,id,now(s)));assert(!s.story.flags.includes('E_UNSEALED'));
 }
 let s=reachStoryScene(race,'C08.O13.'+race),economic=econ(s);assert(!C.storyQuestToolAvailable(s,'old-wedge'));assert(C.storyQuestToolAvailable(s,'lemus-old-wedge'));
 const id='C08.O13.'+race,e=start(s,id),action={type:'use-tool',sceneId:id,encounterId:e.id,targetId:e.enemies[0].id};
 assert(renderStoryScenarioNotice(e).includes('由莱姆斯持有'));assert(renderStoryScenarioNotice(e).includes('协助莱姆斯使用旧制楔钉'));
 const original=JSON.stringify(s);E.step(s,e,s.nextActionAt);assert.equal(JSON.stringify(s),original,'normal attacks cannot open core');
 for(const bad of [{targetId:'other'},{encounterId:'stale'},{sceneId:'C08.E03.elf'}])assert.equal(C.applyStoryEvent(s,{...action,...bad},{now:now(s)}),false);
 assert.equal(C.transactStoryEvent(store(s,true),s,action,{now:now(s)}).reason,'storage');assert.equal(JSON.stringify(s),original);assert(C.storyQuestToolAvailable(s,'lemus-old-wedge'));
 const storage=store(s),tx=C.transactStoryEvent(storage,s,action,{now:now(s)});assert(tx.ok);s=tx.game;assert(s.story.flags.includes('E_UNSEALED'));assert(s.story.flags.includes('E_RESCUE_WEDGE_USED'));assert(!C.storyQuestToolAvailable(s,'lemus-old-wedge'));assert.equal(econ(s),economic);assert(E.validSave(JSON.parse(storage.raw)));assert.equal(C.transactStoryEvent(storage,s,action,{now:now(s)}).ok,false);assert.equal(storage.writes,1);
 assert(C.availableStoryScenes(s).some(d=>d.id==='C08.X01.'+race));assert(!C.availableStoryScenes(s).some(d=>d.id==='C08.O01.'+race));assert.equal(C.beginStoryScene(s,'C08.O01.'+race),false);
 // Historical pending O01 is the exact previously shipped state shape. It may
 // finish normally; neither a new rescue route nor a completed ledger is forced back.
 const legacy=reachStoryScene(race,'C08.O11.'+race),old='C08.O01.'+race;delete legacy.story.acceptedLevels[legacy.story.activeScene.id];legacy.story.activeScene={id:old,cursor:STORY_SCENES[old].lines.length,choiceId:'proceed',encounterId:null};legacy.story.acceptedLevels[old]=legacy.level;assert(E.validSave(legacy));
 start(legacy,old);assert(E.validSave(JSON.parse(JSON.stringify(legacy))));let n=0,b=legacy.activeEncounter;while(!b.done&&n++<3000)E.step(legacy,b,legacy.nextActionAt);assert(C.finishStoryScene(legacy,old,now(legacy)));assert(E.validSave(legacy));assert(!C.availableStoryScenes(legacy).some(d=>d.id.startsWith('C08.O1')));readAndChooseStoryScene(legacy,STORY_SCENES['C08.X01.'+race]);assert(C.finishStoryScene(legacy,'C08.X01.'+race,now(legacy)));assert(E.validSave(JSON.parse(JSON.stringify(legacy))));
 // Failure at inner layer preserves the outer stage and grants no final tool use.
 const retry=reachStoryScene(race,'C08.O12.'+race);retry.heroHp=1;const before=JSON.stringify(retry.story.completedScenes);b=start(retry,'C08.O12.'+race);b.rngState=1;n=0;while(!b.done&&n++<3000)E.step(retry,b,retry.nextActionAt);assert.equal(b.storyScenario.result,'retry');assert.equal(JSON.stringify(retry.story.completedScenes),before);assert.equal(retry.story.activeScene.encounterId,null);assert(!C.storyQuestToolAvailable(retry,'lemus-old-wedge'));assert.equal(retry.restUntil,0);assert(E.validSave(retry));
}
for(const id of ['C08.E01.elf','C08.E02.elf']){const s=reachStoryScene('elf',id),e=start(s,id),copy=JSON.stringify(e);assert.equal(normalizeBattleEnemies(e)[0].storyActorId,'seal-core');const ui=renderEnemyRoster(e);assert(ui.includes('story-assets/seal-core.png'));assert(!ui.includes('data-monster-detail'));assert.equal(JSON.stringify(e),copy,'presentation cannot mutate legacy save');}
console.log('PASS seal rescue: four non-elf two-stage nonlethal routes + explicit cooperative item core; elf seal visuals; no fauna/details/rewards; quota, wrong targets, duplicate, retry, reload and legacy O01 compatibility.');
