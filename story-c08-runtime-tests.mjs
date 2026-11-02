import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
import * as C from './dist/story-event-controller.js';
import {STORY_SCENES} from './dist/story-event-registry.js';
import {STORY_SCENARIOS} from './dist/story-scenario-registry.js';
import {STORY_WAR_ID} from './dist/story-war-bridge.js';
import {territoryAccess} from './dist/war-diplomacy.js';
import {reachStoryScene,playActiveStoryEncounter} from './story-event-test-fixture.mjs';
import {SAVE_KEY} from './dist/storage.js';
import {renderStoryKnowledge,renderStoryEventBoard} from './dist/story-event-ui.js';
assert.match(STORY_SCENARIOS['story.c07-ea02-ashen'].objective,/突破沿路的阻拦，赶往族长所在处/);assert.match(STORY_SCENARIOS['story.c07-ea02-elf'].objective,/去左翼/);
const economic=s=>JSON.stringify({inventory:s.inventory,gold:s.gold,xp:s.xp,kills:s.kills,materials:s.materialStacks,claims:s.taskRewardClaims});
const war=s=>s.diplomacy.wars.find(w=>w.id===STORY_WAR_ID);
const nextTime=s=>Math.max(s.lastSeen,s.lastHealthClock??0,s.nextBattleAt??0)+2000;
function storeFor(s,quota=false){let raw=JSON.stringify(s),writes=0;return {get raw(){return raw},get writes(){return writes},getItem:k=>k===SAVE_KEY?raw:null,setItem(k,v){assert.equal(k,SAVE_KEY);if(quota)throw Error('quota');raw=v;writes++}};}
for(const race of ['human','dwarf','elf','goblin','ashen']){
 let s=reachStoryScene(race,'C08.X04.'+race),hero=s.hero,core=s.inventory.find(i=>i.legendaryId==='ashen-primal-core');assert.equal(war(s).status,'active');assert(!s.story.flags.includes('INVASION_BEGAN'));assert(s.story.flags.includes('RITUAL_CAST_INTERRUPTED'));assert(!s.story.flags.includes('ASHEN_ORIGIN_CORROBORATED'));
 const economy=economic(s);const e=playActiveStoryEncounter(s);assert.equal(economic(s),economy,'escape has no farm reward');assert.equal(s.hero,hero);assert.equal(war(s).status,'active','battle receipt alone does not end war');
 const snapshot=JSON.stringify(s),failed=C.transactStoryEvent(storeFor(s,true),s,{type:'finish',sceneId:'C08.X04.'+race},{now:nextTime(s)});assert.equal(failed.ok,false);assert.equal(failed.reason,'storage');assert.equal(JSON.stringify(s),snapshot);
 const storage=storeFor(s),tx=C.transactStoryEvent(storage,s,{type:'finish',sceneId:'C08.X04.'+race},{now:nextTime(s)});assert(tx.ok);s=tx.game;assert.equal(war(s).status,'ended');assert(s.story.flags.includes('INVASION_BEGAN'));assert(s.story.flags.includes('RITUAL_SUCCEEDED'));assert(s.story.flags.includes('PRIEST_DIED_BACKLASH'));assert(E.validSave(JSON.parse(storage.raw)));for(const r of ['elf','ashen'])assert(territoryAccess(s,r).allowed);assert.equal(C.transactStoryEvent(storage,s,{type:'finish',sceneId:'C08.X04.'+race},{now:nextTime(s)}).ok,false);assert.equal(storage.writes,1);
 if(race==='ashen'){assert.equal(s.inventory.filter(i=>i.legendaryId==='ashen-primal-core').length,1);assert.equal(s.inventory.find(i=>i.id===core.id).legendaryId,'ashen-primal-core');}
 const complete=reachStoryScene(race,'C08.X05.'+race,{finishTarget:true});assert(complete.story.flags.includes('C08_COMPLETE'));assert.match(renderStoryEventBoard(complete),/变了的旧座/);assert(!complete.story.flags.includes('R4_TEMPLE_CONFIRMED'));assert.equal(complete.race,race);assert(complete.story.knowledge.every(k=>STORY_SCENES[k.sourceScene].pov===race));
 const origin=complete.story.knowledge.find(k=>k.sourceScene==='C08.X03.'+race);assert.equal(origin.mode,'heard');assert.match(origin.text,/宣称/);assert(!complete.story.knowledge.some(k=>k.mode==='confirmed'&&/创造烬裔/.test(k.text)));
 if(!['elf','ashen'].includes(race))assert(!complete.story.knowledge.some(k=>k.sourceScene.startsWith('C07.EA')),'absent POV never gets private priest dialogue');
}
// Two winnable layers preserve progress. A failed second-layer attempt is not a
// five-minute rest and cannot rewind first-layer completion or mint rewards.
let s=reachStoryScene('elf','C08.E02.elf');assert(s.story.flags.includes('E_SEAL_FIRST_CLEARED'));const firstLedger=structuredClone(s.story.completedScenes);s.heroHp=1;assert(C.applyStoryEvent(s,{type:'scenario',sceneId:'C08.E02.elf',scenarioId:STORY_SCENES['C08.E02.elf'].encounter.scenarioId},{now:nextTime(s)}));let e=s.activeEncounter;e.rngState=1;let count=0;while(!e.done&&count++<1000)E.step(s,e,s.nextActionAt);assert.equal(e.storyScenario.result,'retry');assert.equal(s.restUntil,0);assert.deepEqual(s.story.completedScenes,firstLedger);assert.equal(s.story.activeScene.encounterId,null);assert(!s.story.flags.includes('E_SEAL_SECOND_CLEARED'));assert(C.storyQuestToolAvailable(s,'old-wedge'));
// Priest superiority is a disclosed authored defeat even after a decisive hit,
// not a mutation of ordinary combat or a route to kill him before the ritual.
s=reachStoryScene('elf','C07.EA03.elf');s.level=99999;const before=economic(s);assert(C.applyStoryEvent(s,{type:'scenario',sceneId:'C07.EA03.elf',scenarioId:STORY_SCENES['C07.EA03.elf'].encounter.scenarioId},{now:nextTime(s)}));e=s.activeEncounter;e.rngState=1;E.step(s,e,s.nextActionAt);assert.equal(e.storyScenario.result,'elf-sealed');assert.equal(e.enemies[0].hp,1);assert.equal(e.enemies[0].storyActorId,'high-priest');assert.equal(economic(s),before);assert(!s.story.flags.includes('PRIEST_DIED_BACKLASH'));
// Actual defeat also advances the explicitly unavoidable priest sealing; it is not a softlock.
s=reachStoryScene('elf','C07.EA03.elf');s.heroHp=1;assert(C.applyStoryEvent(s,{type:'scenario',sceneId:'C07.EA03.elf',scenarioId:STORY_SCENES['C07.EA03.elf'].encounter.scenarioId},{now:nextTime(s)}));e=s.activeEncounter;count=0;while(!e.done&&count++<1000)E.step(s,e,s.nextActionAt);assert.equal(e.storyScenario.result,'elf-sealed');assert(C.storyEventView(s).active.receipt);assert.equal(s.restUntil,0);
// The third layer is a real encounter. Only its exact tool target can resolve it.
s=reachStoryScene('elf','C08.E03.elf');assert(C.storyQuestToolAvailable(s,'old-wedge'));assert(s.story.flags.includes('E_SEAL_FIRST_CLEARED'));assert(s.story.flags.includes('E_SEAL_SECOND_CLEARED'));
assert(C.applyStoryEvent(s,{type:'scenario',sceneId:'C08.E03.elf',scenarioId:STORY_SCENES['C08.E03.elf'].encounter.scenarioId},{now:nextTime(s)}));e=s.activeEncounter;const action={type:'use-tool',sceneId:'C08.E03.elf',encounterId:e.id,targetId:e.enemies[0].id},initial=JSON.stringify(s);E.step(s,e,s.nextActionAt);assert.equal(JSON.stringify(s),initial,'normal attacks do not bypass the sealed-core mechanic');assert.equal(E.reward(s,e),null);
for(const change of [{encounterId:'stale'},{targetId:'other'},{sceneId:'C08.E02.elf'}]){assert.equal(C.applyStoryEvent(s,{...action,...change},{now:nextTime(s)}),false);assert.equal(JSON.stringify(s),initial);}
let tx=C.transactStoryEvent(storeFor(s,true),s,action,{now:nextTime(s)});assert.equal(tx.ok,false);assert.equal(tx.reason,'storage');assert.equal(JSON.stringify(s),initial);assert(C.storyQuestToolAvailable(s,'old-wedge'));
const old=s,storage=storeFor(s);tx=C.transactStoryEvent(storage,s,action,{now:nextTime(s)});assert(tx.ok);s=tx.game;assert.equal(s.activeEncounter,null);assert(s.story.completedScenes.includes('C08.E03.elf'));assert(s.story.flags.includes('E_WEDGE_USED'));assert(!C.storyQuestToolAvailable(s,'old-wedge'));assert.equal(s.story.encounters.filter(r=>r.sceneId==='C08.E03.elf').length,1);assert.equal(C.transactStoryEvent(storage,old,action,{now:nextTime(old)}).reason,'stale-state');assert.equal(C.transactStoryEvent(storage,s,action,{now:nextTime(s)}).ok,false);assert.equal(storage.writes,1);assert.match(renderStoryKnowledge(s),/已在解除封印核心时消耗/);assert(!renderStoryKnowledge(s).includes('不可出售、消耗'));
assert(E.validSave(JSON.parse(storage.raw)));const malformed=structuredClone(s);malformed.story.flags=malformed.story.flags.filter(f=>f!=='E_WEDGE_USED');assert.equal(E.validSave(malformed),false);
// Existing C04+ current-generation ledgers already own the tool; no migration or
// inventory material is required and arbitrary inventory discard cannot remove it.
s=reachStoryScene('elf','C05.EA01.elf');const existing=JSON.parse(JSON.stringify(s));assert(E.validSave(existing));assert(C.storyQuestToolAvailable(existing,'old-wedge'));existing.materialStacks={};assert(C.storyQuestToolAvailable(existing,'old-wedge'));
console.log('PASS C07–C08 five-POV real routes, distinct cores, truthful knowledge, genuine winnable seal layers + targeted consumed-tool core, forced priest outcome, no farm/retry rest, atomic invasion/war ending, old current tool ledgers, quota/stale/reload/duplicate guards.');
