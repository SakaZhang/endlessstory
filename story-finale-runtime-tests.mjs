import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
import * as C from './dist/story-event-controller.js';
import {STORY_SCENES} from './dist/story-event-registry.js';
import {FINALE_ASSIGNMENTS} from './dist/story-finale-scenes.js';
import {reachStoryScene,playActiveStoryEncounter} from './story-event-test-fixture.mjs';
import {SAVE_KEY} from './dist/storage.js';
const races=['human','dwarf','elf','goblin','ashen'],codes={human:'H',dwarf:'D',elf:'E',goblin:'G',ashen:'A'};
const now=s=>Math.max(s.lastSeen,s.lastHealthClock??0,s.nextBattleAt??0)+2000;
const economy=s=>JSON.stringify({inventory:s.inventory,gold:s.gold,xp:s.xp,kills:s.kills,materials:s.materialStacks,claims:s.taskRewardClaims});
function storeFor(s,quota=false){let raw=JSON.stringify(s),writes=0;return {get raw(){return raw},get writes(){return writes},getItem:k=>k===SAVE_KEY?raw:null,setItem(k,v){assert.equal(k,SAVE_KEY);if(quota)throw Error('quota');raw=v;writes++}};}
for(const race of races){
 const d=STORY_SCENES['C10.X07.'+race];assert.equal(new Set(FINALE_ASSIGNMENTS[race]).size,4);assert(!FINALE_ASSIGNMENTS[race].includes(race));
 let s=reachStoryScene(race,'C09.A01.'+race);assert(s.story.flags.includes('PRIEST_DIED_BACKLASH'));assert(s.story.flags.includes('RITUAL_SUCCEEDED'));assert(!s.story.flags.includes('R4_TEMPLE_CONFIRMED'));assert(!C.finishStoryScene(s,s.story.activeScene.id));
 s=reachStoryScene(race,'C10.X05.'+race);const before=economy(s),identity=s.hero;s.level=99999;const e=playActiveStoryEncounter(s);assert(e.enemies[0].hp>0);assert(!s.story.flags.includes('MAIN_STORY_CLEAR'));assert(!s.story.flags.includes('SUPPORT_1_DOWN'));assert.equal(economy(s),before);assert.equal(s.hero,identity);
 s=reachStoryScene(race,d.id);assert([1,2,3,4].every(i=>s.story.flags.includes('SUPPORT_'+i+'_DOWN')));assert(s.story.flags.includes('PORTAL_CLOSED'));assert(!s.story.flags.includes('MAIN_STORY_CLEAR'));
 // Death is a retry, with all four distinct saved nodes still down.
 s.heroHp=1;const ledger=JSON.stringify(s.story.completedScenes),econ=economy(s);assert(C.applyStoryEvent(s,{type:'scenario',sceneId:d.id,scenarioId:d.encounter.scenarioId},{now:now(s)}));let battle=s.activeEncounter;let n=0;while(!battle.done&&n++<3000)E.step(s,battle,s.nextActionAt);assert.equal(battle.storyScenario.result,'retry');assert.equal(s.restUntil,0);assert.equal(s.story.activeScene.encounterId,null);assert.equal(JSON.stringify(s.story.completedScenes),ledger);assert.equal(economy(s),econ);assert(E.validSave(JSON.parse(JSON.stringify(s))));
 // Win, then independently commit the witnessed completion once. Neither a
 // forged finish nor a stale/newer-save overwrite can manufacture completion.
 s.heroHp=E.stats(s).hp;playActiveStoryEncounter(s);assert(!s.story.flags.includes('MAIN_STORY_CLEAR'));let storage=storeFor(s,true),snap=JSON.stringify(s);let tx=C.transactStoryEvent(storage,s,{type:'finish',sceneId:d.id},{now:now(s)});assert.equal(tx.reason,'storage');assert.equal(JSON.stringify(s),snap);
 storage=storeFor(s);tx=C.transactStoryEvent(storage,s,{type:'finish',sceneId:d.id},{now:now(s)});assert(tx.ok);assert(tx.game.story.flags.includes('MAIN_STORY_CLEAR'));assert(E.validSave(JSON.parse(storage.raw)));assert.equal(C.transactStoryEvent(storage,s,{type:'finish',sceneId:d.id},{now:now(s)}).reason,'stale-state');assert.equal(storage.writes,1);const tampered=structuredClone(tx.game);tampered.story.flags=tampered.story.flags.filter(f=>f!=='SUPPORT_4_DOWN');assert(!E.validSave(tampered));
 const end=reachStoryScene(race,'END.'+codes[race]+'01.'+race,{spring:'skip',finishTarget:true});assert(end.story.flags.includes('EPILOGUE_COMPLETE'));assert.equal(end.version,6);assert.equal(end.race,race);assert(end.story.knowledge.every(k=>STORY_SCENES[k.sourceScene].pov===race));assert(!end.story.knowledge.filter(k=>k.sourceScene.includes('X06')).some(k=>/这次不跟|水道留着|现在可以/.test(k.text)),'no remote private dialogue in journal');if(race==='ashen')assert.equal(end.inventory.filter(i=>i.legendaryId==='ashen-primal-core').length,1);
 const old=JSON.stringify(end.story);assert(E.chooseAdventureNode(end,race+'.a01.field',{start:true},now(end)));assert(!end.activeEncounter.storyScenario);assert.equal(JSON.stringify(end.story),old,'ordinary content remains playable in same save');
}
console.log('PASS finale five POVs, full source gates, no phantom ending, damageable first boss checkpoint, saved four distinct altars, death/retry persistence, strict quota/stale/reload/once-only completion, no farm/remote knowledge/core duplication, optional-quest fallback and same-save normal content.');
