import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
import * as C from './dist/story-event-controller.js';
import {STORY_SCENES} from './dist/story-event-registry.js';
import {STORY_WAR_ID,STORY_WAR_ENTRANCES,storyTerritoryAccess} from './dist/story-war-bridge.js';
import {AREAS} from './dist/location-schema.js';
import {NPC_EVENTS,npcEventAccess,beginNpcEvent} from './dist/npc-events.js';
import {reachStoryScene,playActiveStoryEncounter} from './story-event-test-fixture.mjs';
import {SAVE_KEY} from './dist/storage.js';
const now=s=>Math.max(s.lastSeen,s.lastHealthClock??0,s.nextBattleAt??0)+2000;
// This invariant reviews exact current canonical bindings, not a runtime wildcard
// granting future or forged scenes permission to cross hostile territory.
for(const d of Object.values(STORY_SCENES))if(AREAS[d.siteId].race!==d.pov)assert.equal(STORY_WAR_ENTRANCES[d.id],d.siteId,d.id);
const priorNow=Date.now;
try{
 // Actual C07 declaration supersedes a same-pair random event atomically.
 let s=reachStoryScene('elf','C07.E01.elf'),clock=now(s);Date.now=()=>Math.max(clock,s.lastSeen,s.lastHealthClock??0);
 assert(E.startRandomWar(s,{id:'random.c07.same-pair',races:['elf','ashen'],durationMs:3600000},clock));
 playActiveStoryEncounter(s);assert(C.finishStoryScene(s,'C07.E01.elf',now(s)));assert.equal(s.diplomacy.wars.find(w=>w.id==='random.c07.same-pair').endReason,'story-superseded');assert.equal(s.diplomacy.wars.find(w=>w.id===STORY_WAR_ID).status,'active');assert(E.validSave(s));
 for(const race of ['human','dwarf','goblin']){
  Date.now=priorNow;s=reachStoryScene(race,'C08.X04.'+race);clock=now(s);Date.now=()=>Math.max(clock,s.lastSeen,s.lastHealthClock??0);
  const id='C08.X04.'+race,randomId='random.c08.'+race;assert(E.startRandomWar(s,{id:randomId,races:[race,'ashen'],durationMs:3600000},clock));
  assert.equal(E.territoryAccess(s,'ashen').warKind,'random');assert(storyTerritoryAccess(s,id).storyOnly);
  const story=JSON.stringify(s.story),hp=s.heroHp,gold=s.gold;assert(C.applyStoryEvent(s,{type:'retreat',returnSiteId:race+'.a01'},{now:clock}));assert.equal(s.heroHp,hp);assert.equal(s.gold,gold);assert.equal(JSON.stringify(s.story),story);
  assert(C.canEnterWarStoryScene(s,id));assert(!C.canEnterWarStoryScene(s,'C08.X05.'+race),'no premature next scene');assert(C.applyStoryEvent(s,{type:'enter',sceneId:id},{now:clock}));assert.equal(s.siteId,'ashen.a07');assert.equal(JSON.stringify(s.story),story);
  assert.equal(E.startInstanceEncounter(s,'ashen.a07.field',clock),null);assert.equal(E.startInstanceEncounter(s,'ashen.a07.dungeon',clock),null);assert.equal(E.startInstanceEncounter(s,'ashen.a07.boss',clock),null);assert.equal(E.nextEncounterRoute(s,clock),null);
  for(const d of Object.values(NPC_EVENTS).filter(d=>d.race==='ashen')){assert.equal(npcEventAccess(s,d.id).code,'war');assert.equal(beginNpcEvent(s,d.id,clock),false);}
  const kills=s.kills,economy=JSON.stringify({gold:s.gold,xp:s.xp,materials:s.materialStacks,inventory:s.inventory});playActiveStoryEncounter(s);assert.equal(s.kills,kills);assert.equal(JSON.stringify({gold:s.gold,xp:s.xp,materials:s.materialStacks,inventory:s.inventory}),economy);
  assert.equal(s.diplomacy.wars.find(w=>w.id===STORY_WAR_ID).status,'active','receipt alone cannot end story war');const before=JSON.stringify(s);
  const quota={getItem:k=>k===SAVE_KEY?before:null,setItem(){throw Error('quota')}};assert.equal(C.transactStoryEvent(quota,s,{type:'finish',sceneId:id},{now:now(s)}).reason,'storage');assert.equal(JSON.stringify(s),before);
  let raw=before,writes=0;const store={getItem:k=>k===SAVE_KEY?raw:null,setItem(k,v){raw=v;writes++;}};const tx=C.transactStoryEvent(store,s,{type:'finish',sceneId:id},{now:now(s)});assert(tx.ok);s=tx.game;
  assert.equal(s.diplomacy.wars.find(w=>w.id===STORY_WAR_ID).status,'ended');const random=s.diplomacy.wars.find(w=>w.id===randomId);assert.equal(random.status,'active','invasion ends only the canonical story war');assert.equal(E.territoryAccess(s,'ashen').warKind,'random');assert(E.territoryAccess(s,'ashen',random.expiresAt).allowed);assert(E.validSave(JSON.parse(raw)));assert.equal(C.transactStoryEvent(store,s,{type:'finish',sceneId:id},{now:now(s)}).ok,false);assert.equal(writes,1);
 }
}finally{Date.now=priorNow;}
console.log('PASS all canonical cross-border scene bindings; real random-war C07 supersession and three neutral C08 wartime entrances, no ordinary/NPC farming, exact invasion-only story ending, independent random expiry, quota/replay and no duplicate reward.');
