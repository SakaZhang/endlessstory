import {STORY_SCENES,STORY_POVS} from './story-event-registry.js';
import {AREAS,INSTANCES} from './location-schema.js';
import {validSave,effectiveLuck,materialCount,AFFIX_DEFS,receiveBattleLoot,equipItem,startStoryScenario,startInstanceEncounter} from './engine.js';
import {commitGameTransaction,SAVE_KEY} from './storage.js';
import {createLegendaryEquipment} from './legendary-equipment.js';
import {grantAshenStoryCore} from './races/ashen/story-core.js';

const object=o=>!!o&&typeof o==='object'&&!Array.isArray(o);
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const ids=(a,max=256)=>Array.isArray(a)&&a.length<=max&&Array.from(a).every(x=>typeof x==='string'&&x.length>0&&x.length<=160)&&new Set(a).size===a.length;
const scene=id=>typeof id==='string'&&Object.hasOwn(STORY_SCENES,id)?STORY_SCENES[id]:null;
const exact=(o,keys)=>object(o)&&same(Object.keys(o).sort(),[...keys].sort());
const ownScene=(id,race)=>scene(id)?.pov===race;
const blank=race=>({version:1,pov:race,completedScenes:[],flags:[],knowledge:[],choices:{},acceptedLevels:{},activeScene:null,encounters:[]});
const state=s=>s.story??blank(s.race);
const choice=(d,id)=>d.choices.find(c=>c.id===id);
function prerequisites(st,d){
 const has=id=>id.startsWith('flag:')?st.flags.includes(id.slice(5)):st.completedScenes.includes(id);
 return d.requires.every(has)&&(d.requiresFlags??[]).every(f=>st.flags.includes(f))&&(!d.requiresAny||d.requiresAny.some(list=>list.every(has)));
}
function derived(st){
 const flags=[],knowledge=[];
 for(const id of st.completedScenes){const d=scene(id),c=choice(d,st.choices[id]);for(const f of [...d.flags,...(c?.flags??[])])if(!flags.includes(f))flags.push(f);for(const k of [...d.knowledge,...(c?.knowledge??[])])knowledge.push({...k,sourceScene:id});}
 return {flags,knowledge};
}
const expectedResult=d=>({'story.c01.human-chase':'chase-transition','story.c01.goblin-escape':'chase-transition','story.c05.elf-duel':'elf-defeated','story.c05.ashen-duel':'ashen-victory'})[d.encounter?.scenarioId];
function receiptFor(st,d){return st.encounters.find(r=>r.sceneId===d.id);}
export function validStoryEventState(s){
 try{
  if(!object(s)||!STORY_POVS.includes(s.race))return false;
  if(s.story===undefined)return true;
  const st=s.story;
  if(!exact(st,['version','pov','completedScenes','flags','knowledge','choices','acceptedLevels','activeScene','encounters'])||st.version!==1||st.pov!==s.race||!ids(st.completedScenes)||!st.completedScenes.every(id=>ownScene(id,s.race))||!object(st.choices)||!object(st.acceptedLevels)||!ids(st.flags)||!Array.isArray(st.knowledge)||st.knowledge.length>512||!Array.isArray(st.encounters)||st.encounters.length>256)return false;
  if(!same(Object.keys(st.choices).sort(),[...st.completedScenes].sort())||Object.entries(st.choices).some(([id,c])=>!choice(scene(id),c)))return false;
  const visited=[...st.completedScenes,...(st.activeScene?[st.activeScene.id]:[])];
  if(!same(Object.keys(st.acceptedLevels).sort(),visited.sort())||Object.values(st.acceptedLevels).some(x=>!Number.isSafeInteger(x)||x<1||x>=100000))return false;
  const walked=blank(s.race);
  for(const id of st.completedScenes){const d=scene(id);if(!prerequisites(walked,d))return false;walked.completedScenes.push(id);walked.choices[id]=st.choices[id];Object.assign(walked,derived(walked));}
  const canonical=derived(st);if(!same(st.flags,canonical.flags)||!same(st.knowledge,canonical.knowledge))return false;
  const receiptIds=new Set(),encounterIds=new Set();
  for(const r of st.encounters){
   const d=scene(r?.sceneId);
   if(!exact(r,['sceneId','encounterId','nodeId','scenarioId','result'])||!d||d.pov!==s.race||!d.encounter||!visited.includes(d.id)||typeof r.encounterId!=='string'||!r.encounterId||r.encounterId.length>160||receiptIds.has(r.sceneId)||encounterIds.has(r.encounterId)||r.nodeId!==d.encounter.nodeId||r.scenarioId!==(d.encounter.scenarioId??null)||r.result!==(d.encounter.kind==='scenario'?expectedResult(d):'victory'))return false;
   receiptIds.add(r.sceneId);encounterIds.add(r.encounterId);
  }
  for(const id of st.completedScenes)if(scene(id).encounter&&!receiptFor(st,scene(id)))return false;
  const a=st.activeScene;
  if(a!==null){
   const d=scene(a?.id);if(!exact(a,['id','cursor','choiceId','encounterId'])||!d||d.pov!==s.race||st.completedScenes.includes(a.id)||!prerequisites(st,d)||!Number.isSafeInteger(a.cursor)||a.cursor<0||a.cursor>d.lines.length||!(a.choiceId===null||choice(d,a.choiceId))||(a.choiceId!==null&&a.cursor!==d.lines.length)||!(a.encounterId===null||(typeof a.encounterId==='string'&&a.encounterId.length>0&&a.encounterId.length<=160)))return false;
   if(a.encounterId!==null&&!d.encounter)return false;if(receiptFor(st,d)&&a.encounterId!==receiptFor(st,d).encounterId)return false;
  }
  if(st.completedScenes.includes('C05.EA02.ashen')&&!s.taskRewardClaims?.includes('story.ashen-primal-core'))return false;
  if(s.taskRewardClaims?.includes('story.ashen-primal-core')&&!st.completedScenes.includes('C05.EA02.ashen'))return false;
  return true;
 }catch{return false;}
}
export function storySafeToInteract(s){return s?.version===6&&s.developmentEquipmentSandbox!==true&&!s.running&&!s.dungeonRun&&(!s.activeEncounter||s.activeEncounter.rewarded===true)&&!(s.restUntil>Math.max(s.lastHealthClock??0,s.lastSeen??0));}
export function storySceneLocationAvailable(s,d){
 if(!d||s.siteId!==d.siteId||!AREAS[d.siteId])return false;
 const area=AREAS[d.siteId],progress=s.areaProgress?.[area.race];return progress?progress.unlocked?.includes(area.number):area.number===1;
}
export function availableStoryScenes(s){
 if(!validStoryEventState(s))return [];
 const st=state(s);if(st.activeScene)return [];
 return Object.values(STORY_SCENES).filter(d=>d.pov===s.race&&!st.completedScenes.includes(d.id)&&prerequisites(st,d)).map(d=>({...structuredClone(d),atLocation:storySceneLocationAvailable(s,d),available:storySafeToInteract(s)&&storySceneLocationAvailable(s,d)}));
}
export function beginStoryScene(s,id){
 if(!validStoryEventState(s)||!storySafeToInteract(s))return false;
 const d=scene(id),st=state(s);if(!d||d.pov!==s.race||st.activeScene||st.completedScenes.includes(id)||!prerequisites(st,d)||!storySceneLocationAvailable(s,d))return false;
 s.story??=blank(s.race);s.story.activeScene={id,cursor:0,choiceId:null,encounterId:null};s.story.acceptedLevels[id]=s.level;return {sceneId:id};
}
export function advanceStoryDialogue(s,id){
 if(!validStoryEventState(s)||!storySafeToInteract(s))return false;
 const a=s.story?.activeScene,d=scene(id);if(!a||a.id!==id||!storySceneLocationAvailable(s,d)||a.cursor>=d.lines.length||a.choiceId!==null)return false;
 a.cursor++;return {sceneId:id,cursor:a.cursor};
}
export function chooseStoryResponse(s,id,choiceId){
 if(!validStoryEventState(s)||!storySafeToInteract(s))return false;
 const a=s.story?.activeScene,d=scene(id);if(!a||a.id!==id||!storySceneLocationAvailable(s,d)||a.cursor!==d.lines.length||a.choiceId!==null||!choice(d,choiceId))return false;
 a.choiceId=choiceId;return {sceneId:id,choiceId};
}
export function storySceneReady(s,id){
 if(!validStoryEventState(s)||!storySafeToInteract(s))return false;
 const a=s.story?.activeScene,d=scene(id);if(!a||a.id!==id||!storySceneLocationAvailable(s,d)||a.cursor!==d.lines.length||!choice(d,a.choiceId)||d.encounter&&!receiptFor(s.story,d))return false;
 return (d.materialConditions??[]).every(row=>materialCount(s,row.material,row.quality)>=row.quantity);
}
export function bindStoryScenario(s,e){
 if(!validStoryEventState(s)||s.activeEncounter!==e||!e?.storyScenario||e.done||e.rewarded)return false;
 const a=s.story?.activeScene,d=scene(a?.id);if(!a||!d||d.encounter?.kind!=='scenario'||a.cursor!==d.lines.length||!a.choiceId||a.encounterId!==null||!storySceneLocationAvailable(s,d)||e.instanceId!==d.encounter.nodeId||e.storyScenario.id!==d.encounter.scenarioId||e.storyScenario.sceneId!==d.id||e.storyScenario.pov!==s.race)return false;
 a.encounterId=e.id;return true;
}
export function recordStoryScenarioResult(s,e){
 if(!validStoryEventState(s)||s.activeEncounter!==e||!e?.storyScenario||!e.done||!e.rewarded)return false;
 const st=s.story,a=st?.activeScene,d=scene(a?.id),m=e.storyScenario;
 if(!a||!d||d.encounter?.kind!=='scenario'||a.encounterId!==e.id||receiptFor(st,d)||a.cursor!==d.lines.length||!a.choiceId||!storySceneLocationAvailable(s,d)||e.instanceId!==d.encounter.nodeId||m.id!==d.encounter.scenarioId||m.sceneId!==d.id||m.pov!==s.race||m.result!==expectedResult(d)||!Number.isInteger(m.resolvedRound)||m.resolvedRound<1)return false;
 st.encounters.push({sceneId:d.id,encounterId:e.id,nodeId:e.instanceId,scenarioId:m.id,result:m.result});return true;
}
export function recordStoryEncounterVictory(s,e){
 if(!validStoryEventState(s)||s.activeEncounter!==e||!e||e.developmentFixture||e.storyScenario||!e.done||!e.win||!e.rewarded||!e.enemies?.length||!e.enemies.every(u=>u.hp===0)||e.multiVersion!==1)return false;
 const st=s.story,a=st?.activeScene,d=scene(a?.id);
 if(!a||!d||d.encounter?.kind!=='victory'||(a.encounterId!==null&&a.encounterId!==e.id)||a.cursor!==d.lines.length||!a.choiceId||receiptFor(st,d)||!storySceneLocationAvailable(s,d)||e.instanceId!==d.encounter.nodeId||e.kind!=='field'||INSTANCES[e.instanceId]?.areaId!==s.siteId)return false;
 a.encounterId=e.id;st.encounters.push({sceneId:d.id,encounterId:e.id,nodeId:e.instanceId,scenarioId:null,result:'victory'});return true;
}
export function finishStoryScene(s,id){
 if(!storySceneReady(s,id))return false;
 const next=structuredClone(s),st=next.story,d=scene(id),a=st.activeScene;
 if(d.grant==='ashen-primal-core'){
  const receipt=grantAshenStoryCore(next,{questId:id});if(!receipt.ok)return false;
  const item=createLegendaryEquipment({id:receipt.id,legendaryId:receipt.legendaryId,level:receipt.level,baseLevel:receipt.level,levelSource:'generated',affixDefs:AFFIX_DEFS,random:()=>{throw Error('Story core must not roll');}});if(!item)return false;
  const filters=next.lootFilters;next.lootFilters={equipment:[],materials:[],items:[]};
  if(!receiveBattleLoot(next,{kind:'equipment',item})||!equipItem(next,item.id,'core'))return false;
  if(filters===undefined)delete next.lootFilters;else next.lootFilters=filters;
  next.taskRewardClaims=[...(next.taskRewardClaims??[]),receipt.claimId];
 }
 st.completedScenes.push(id);st.choices[id]=a.choiceId;st.activeScene=null;Object.assign(st,derived(st));
 if(!validStoryEventState(next))return false;
 for(const key of Object.keys(s))if(!Object.hasOwn(next,key))delete s[key];Object.assign(s,next);return {sceneId:id,completed:true};
}
export function applyStoryEvent(s,action,{now=Date.now()}={}){
 if(!object(action))return false;
 if(action.type==='begin')return beginStoryScene(s,action.sceneId);
 if(action.type==='next'&&Number.isSafeInteger(action.cursor)&&action.cursor===s.story?.activeScene?.cursor)return advanceStoryDialogue(s,action.sceneId);
 if(action.type==='choice')return chooseStoryResponse(s,action.sceneId,action.choiceId);
 if(action.type==='finish')return finishStoryScene(s,action.sceneId);
 if(action.type==='scenario'&&s.story?.activeScene?.id===action.sceneId&&canStartStoryScenario(s,action.scenarioId))return startStoryScenario(s,action.scenarioId,now);
 if(action.type==='encounter'&&s.story?.activeScene?.id===action.sceneId&&canStartStoryFieldEncounter(s,action.nodeId)){const e=startInstanceEncounter(s,action.nodeId,now);if(!e)return false;s.story.activeScene.encounterId=e.id;s.stopAfterBattle=true;return {sceneId:action.sceneId,encounterId:e.id};}
 return false;
}
const failure=(game,reason)=>({ok:false,game,value:null,reason});
export function transactStoryEvent(storage,game,action,{now=Date.now(),afterCommitCandidate=null}={}){
 if(!Number.isFinite(now)||now<0||now>1e15)return failure(game,'invalid-clock');
 if(!validSave(game)||!validStoryEventState(game)||game.developmentEquipmentSandbox)return failure(game,'invalid-state');
 try{const saved=JSON.parse(storage.getItem(SAVE_KEY));if(!validSave(saved)||!validStoryEventState(saved))return failure(game,'invalid-saved-state');if(!same(saved,game))return failure(game,'stale-state');}catch{return failure(game,'storage-read');}
 return commitGameTransaction(storage,game,next=>{const result=applyStoryEvent(next,action,{now});if(!result)return false;if(afterCommitCandidate!==null&&afterCommitCandidate(next)===false)return false;next.lastSeen=now;next.offlineLuck=effectiveLuck(next);return validSave(next)&&validStoryEventState(next)?result:false;},{now});
}
export function storyEventView(s){
 if(!validStoryEventState(s))return {valid:false,active:null,available:[],knowledge:[],complete:false};
 const st=state(s),a=st.activeScene,d=scene(a?.id);
 return {valid:true,active:d?{...structuredClone(d),...structuredClone(a),line:d.lines[a.cursor]??null,receipt:structuredClone(receiptFor(st,d)??null),ready:storySceneReady(s,d.id),safe:storySafeToInteract(s),atLocation:storySceneLocationAvailable(s,d)}:null,available:availableStoryScenes(s),knowledge:structuredClone(st.knowledge),complete:st.flags.includes('C06_COMPLETE'),completedCount:st.completedScenes.length};
}
export function canStartStoryScenario(s,scenarioId){
 if(!validStoryEventState(s)||!storySafeToInteract(s))return false;
 const a=s.story?.activeScene,d=scene(a?.id);return !!d&&d.encounter?.kind==='scenario'&&d.encounter.scenarioId===scenarioId&&a.cursor===d.lines.length&&!!choice(d,a.choiceId)&&!receiptFor(s.story,d)&&a.encounterId===null&&storySceneLocationAvailable(s,d);
}
export function canStartStoryFieldEncounter(s,nodeId){
 if(!validStoryEventState(s)||!storySafeToInteract(s))return false;
 const a=s.story?.activeScene,d=scene(a?.id);return !!d&&d.encounter?.kind==='victory'&&d.encounter.nodeId===nodeId&&a.cursor===d.lines.length&&!!choice(d,a.choiceId)&&!receiptFor(s.story,d)&&storySceneLocationAvailable(s,d);
}
