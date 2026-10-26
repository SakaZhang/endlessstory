import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
import * as C from './dist/story-event-controller.js';
import {STORY_SCENES} from './dist/story-event-registry.js';
import {STORY_WAR_ID,STORY_WAR_ENDINGS,storyTerritoryAccess} from './dist/story-war-bridge.js';
import {renderStoryEventBoard,storyActionFromDataset} from './dist/story-event-ui.js';
import {preparedStoryGame,reachStoryScene} from './story-event-test-fixture.mjs';
import {SAVE_KEY} from './dist/storage.js';
const memory=s=>({raw:JSON.stringify(s),writes:0,getItem(k){return k===SAVE_KEY?this.raw:null},setItem(k,v){assert.equal(k,SAVE_KEY);this.raw=v;this.writes++}});
const startWar=s=>{assert(E.startWar(s,{id:'test.authored-access',races:['human',s.race==='human'?'goblin':s.race]},s.lastSeen));};
const now=s=>Math.max(s.lastSeen,s.lastHealthClock??0,s.nextBattleAt??0)+2000;
const transact=(store,s,action)=>C.transactStoryEvent(store,s,action,{now:now(s)});
assert.deepEqual(STORY_WAR_ENDINGS,[]);
// Sealed story war cannot be invented or ended via generic events without its actual scene.
{const s=preparedStoryGame('elf');assert.equal(E.startWar(s,{id:STORY_WAR_ID,races:['elf','ashen']},s.lastSeen),null);assert(E.validSave(s));}
// Explicit registered entrance only; no prerequisite/unlock/POV/ordinary-entry bypass.
let s=preparedStoryGame('human'),id='C01.H01.human';startWar(s);const store=memory(s),before=JSON.stringify(s);
assert(C.canEnterWarStoryScene(s,id));assert(renderStoryEventBoard(s).includes('data-story-action="enter"'));
for(const bad of ['C05.EA01.elf','C03.X01.human','made.up','human.a01.field'])assert.equal(C.applyStoryEvent(s,{type:'enter',sceneId:bad}),false);
assert.equal(E.chooseAdventureNode(s,'goblin.a01.field',{start:true},now(s)),null);assert.equal(JSON.stringify(s),before);
const missing=structuredClone(s);missing.areaProgress.goblin={unlocked:[],cleared:[]};assert.equal(C.canEnterWarStoryScene(missing,id),false);
const quota={getItem:k=>k===SAVE_KEY?before:null,setItem(){throw Error('quota')}};assert.equal(transact(quota,s,{type:'enter',sceneId:id}).ok,false);assert.equal(JSON.stringify(s),before);
let tx=transact(store,s,{type:'enter',sceneId:id});assert(tx.ok);s=tx.game;assert.equal(s.siteId,'goblin.a01');assert.equal(s.story.activeScene.id,id);assert.equal(s.running,false);assert.equal(s.kills,0);assert.equal(E.startInstanceEncounter(s,'goblin.a01.field',now(s)),null);assert.equal(E.startInstanceEncounter(s,'goblin.a01.dungeon',now(s)),null);assert.equal(E.nextEncounterRoute(s,now(s)),null);assert.equal(E.territoryAccess(s,'goblin').allowed,false,'scene entrance never changes NPC/general access');assert.equal(transact(store,s,{type:'enter',sceneId:id}).ok,false,'repeat does not replay entry');
// Withdrawal is explicit; no auto-teleport/rest/heal/reward changes. Story snapshot persists.
const story=JSON.stringify(s.story),hp=s.heroHp,gold=s.gold,cd=JSON.stringify(s.instanceCooldowns),rest=s.restUntil;
assert(renderStoryEventBoard(s).includes('撤回本族起始营地'));assert.deepEqual(storyActionFromDataset({storyAction:'retreat',storyReturnSite:'human.a01'}),{type:'retreat',returnSiteId:'human.a01'});
let raw=store.raw;assert.equal(transact({getItem:k=>k===SAVE_KEY?raw:null,setItem(){throw Error('quota')}},s,{type:'retreat',returnSiteId:'human.a01'}).ok,false);assert.equal(s.siteId,'goblin.a01');
for(const bad of ['goblin.a01','elf.a01','human.a10','none'])assert.equal(C.applyStoryEvent(s,{type:'retreat',returnSiteId:bad}),null);
tx=transact(store,s,{type:'retreat',returnSiteId:'human.a01'});assert(tx.ok);s=tx.game;assert.equal(s.siteId,'human.a01');assert.equal(s.heroHp,hp);assert.equal(s.restUntil,rest);assert.equal(s.gold,gold);assert.equal(JSON.stringify(s.instanceCooldowns),cd);assert.equal(JSON.stringify(s.story),story);assert.equal(transact(store,s,{type:'retreat',returnSiteId:'human.a01'}).ok,false);
tx=transact(store,s,{type:'enter',sceneId:id});assert(tx.ok);s=tx.game;assert.equal(JSON.stringify(s.story),story,'return resumes exact saved dialogue');
for(let i=0;i<STORY_SCENES[id].lines.length;i++)assert(C.advanceStoryDialogue(s,id));assert(C.chooseStoryResponse(s,id,'pursue'));
const active=E.startStoryScenario(s,'story.c01.human-chase',now(s));assert(active);assert.equal(C.warWithdrawalAvailable(s),false);const inBattle=JSON.stringify(s);assert.equal(C.applyStoryEvent(s,{type:'retreat',returnSiteId:'human.a01'}),false);assert.equal(JSON.stringify(s),inBattle);assert.equal(E.startStoryFieldEncounter(s,'C03.G01.goblin',now(s)),null);
const named=active;while(!named.done)E.step(s,named,s.nextActionAt);assert.equal(s.siteId,'goblin.a01','no forced teleport on settlement');assert.equal(s.running,false);assert.equal(s.kills,0);assert(s.story.encounters.some(r=>r.sceneId===id));assert.equal(E.startStoryScenario(s,'story.c01.human-chase',now(s)),null);assert(C.finishStoryScene(s,id));assert.equal(C.canEnterWarStoryScene(s,id),false);assert(E.validSave(s));
// Ordinary scene combat has a dedicated exact node gate, one receipt and one reward;
// online/offline complete the admitted battle only, never continue farming.
{let base=reachStoryScene('goblin','C03.G01.goblin');startWar(base);assert.equal(E.startInstanceEncounter(base,'human.a02.field',now(base)),null);assert(storyTerritoryAccess(base,'C03.G01.goblin').storyOnly);assert.equal(E.startStoryFieldEncounter(base,'C03.X01.dwarf',now(base)),null);const e=E.startStoryFieldEncounter(base,'C03.G01.goblin',now(base));assert(e);for(const u of e.enemies){u.hp=1;u.nextBasicAt=now(base)+1e9;}assert(E.validSave(base));const offline=JSON.parse(JSON.stringify(base)),online=structuredClone(base),kills=base.kills;const report=E.offline(offline,now(base)+4*3600000);const fight=online.activeEncounter;while(!fight.done)E.step(online,fight,online.nextActionAt);assert(fight.win);E.reward(online,fight,online.lastHealthClock);assert.equal(report.kills,1);assert.equal(offline.kills,kills+1);assert.equal(offline.kills,online.kills);assert.equal(offline.gold,online.gold);assert.deepEqual(offline.materialStacks,online.materialStacks);assert.deepEqual(offline.story.encounters,online.story.encounters);assert.equal(offline.running,false);assert.equal(offline.siteId,'human.a02');assert.equal(E.startStoryFieldEncounter(offline,'C03.G01.goblin',now(offline)),null);assert.equal(E.startInstanceEncounter(offline,'human.a02.field',now(offline)),null);const before=JSON.stringify(online);assert.equal(E.reward(online,fight,now(online)),null);assert.equal(JSON.stringify(online),before);assert(C.finishStoryScene(offline,'C03.G01.goblin'));assert(E.validSave(offline));}
console.log('PASS sealed war/story bridge, exact registered entrance, strict prerequisites/unlock/POV, no ordinary/NPC access grant, manual no-penalty withdrawal, storage rollback/replay, resumed dialogue, admitted battle protection and one-result online/offline field/scenario access. Ending remains sealed unavailable.');
