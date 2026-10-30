import {reconcileOtherworldStone} from './otherworld-entitlement.js';
import {storyDialogueComplete,storyKnowledgeMatches} from './story-copy-compatibility.js';
import {personalActions,personalSceneIsLate,personalSceneSite,personalSceneRuntimeAvailable} from './personal-story-registry.js';
import {storyCorridorExitAvailable} from './war-travel-boundary.js';
import {STORY_SCENARIOS} from './story-scenario-registry.js';
import {resolveStoryToolEncounter,finalizeStoryScenario} from './story-scenario-combat.js';
import {territoryAccess} from './war-diplomacy.js';
import {applyStoryWarTransition,storyTerritoryAccess} from './story-war-bridge.js';
import {STORY_SCENES,STORY_POVS} from './story-event-registry.js';
import {AREAS,INSTANCES} from './location-schema.js';
import {validSave,effectiveLuck,materialCount,AFFIX_DEFS,receiveBattleLoot,equipItem,startStoryScenario,startStoryFieldEncounter,retreatWarTerritory} from './engine.js';
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
const personalState=s=>s.personalStoryProgress??{version:1,steps:{},lateIds:[],paused:{}};
const ensurePersonal=s=>s.personalStoryProgress??={version:1,steps:{},lateIds:[],paused:{}};
export const personalSceneActions=(s,d)=>personalActions(d,s.story?.activeScene?.id===d?.id?s.story.activeScene.choiceId:s.story?.choices?.[d?.id],personalState(s).lateIds.includes(d?.id));
export const personalActionsDone=(s,d)=>!d?.personal||(personalState(s).steps[d.id]??0)===personalSceneActions(s,d).length;
const needsEncounter=(s,d)=>d.encounter;
const expectedResult=d=>STORY_SCENARIOS[d.encounter?.scenarioId]?.result;
function receiptFor(st,d){return st.encounters.find(r=>r.sceneId===d.id);}
export function validStoryEventState(s){
 try{
  if(!object(s)||!STORY_POVS.includes(s.race))return false;
  if(s.story===undefined)return s.personalStoryProgress===undefined;
  const st=s.story,pp=personalState(s);
  if(st.activeScene!==null&&!object(st.activeScene))return false;
  if(!exact(pp,['version','steps','lateIds','paused'])||pp.version!==1||!object(pp.steps)||!ids(pp.lateIds)||!object(pp.paused))return false;
  const paused=Object.values(pp.paused);
  if(Object.entries(pp.paused).some(([id,a])=>id!==a?.id||!scene(id)?.personal)||paused.some(a=>a.id===st.activeScene?.id))return false;
  if(!exact(st,['version','pov','completedScenes','flags','knowledge','choices','acceptedLevels','activeScene','encounters'])||st.version!==1||st.pov!==s.race||!ids(st.completedScenes)||!st.completedScenes.every(id=>ownScene(id,s.race))||!object(st.choices)||!object(st.acceptedLevels)||!ids(st.flags)||!Array.isArray(st.knowledge)||st.knowledge.length>512||!Array.isArray(st.encounters)||st.encounters.length>256)return false;
  if(!same(Object.keys(st.choices).sort(),[...st.completedScenes].sort())||Object.entries(st.choices).some(([id,c])=>!choice(scene(id),c)))return false;
  const visited=[...st.completedScenes,...(st.activeScene?[st.activeScene.id]:[]),...Object.keys(pp.paused)];
  const personalIds=visited.filter(id=>scene(id)?.personal);
  if(!same(Object.keys(pp.steps).sort(),[...personalIds].sort())||pp.lateIds.some(id=>!personalIds.includes(id)||scene(id).chapter>=9||!st.completedScenes.slice(0,st.completedScenes.includes(id)?st.completedScenes.indexOf(id):undefined).some(main=>/^C\d\d\./.test(main)&&Number(main.slice(1,3))>scene(id).chapter)))return false;
  for(const id of personalIds){const d=scene(id),a=st.activeScene?.id===id?st.activeScene:pp.paused[id],c=a?.choiceId??st.choices[id],actions=personalActions(d,c,pp.lateIds.includes(id)),n=pp.steps[id];if(st.completedScenes.includes(id)&&!c)return false;if(!Number.isInteger(n)||n<0||n>actions.length||st.completedScenes.includes(id)&&n!==actions.length)return false;}
  if(!same(Object.keys(st.acceptedLevels).sort(),visited.sort())||Object.values(st.acceptedLevels).some(x=>!Number.isSafeInteger(x)||x<1||x>=100000))return false;
  const walked=blank(s.race);
  for(const id of st.completedScenes){const d=scene(id);if(!prerequisites(walked,d))return false;walked.completedScenes.push(id);walked.choices[id]=st.choices[id];Object.assign(walked,derived(walked));}
  const canonical=derived(st);if(!same(st.flags,canonical.flags)||!storyKnowledgeMatches(st.knowledge,canonical.knowledge))return false;
  const receiptIds=new Set(),encounterIds=new Set();
  for(const r of st.encounters){
   const d=scene(r?.sceneId);
   if(!exact(r,['sceneId','encounterId','nodeId','scenarioId','result'])||!d||d.pov!==s.race||!d.encounter||!visited.includes(d.id)||typeof r.encounterId!=='string'||!r.encounterId||r.encounterId.length>160||receiptIds.has(r.sceneId)||encounterIds.has(r.encounterId)||r.nodeId!==d.encounter.nodeId||r.scenarioId!==(d.encounter.scenarioId??null)||r.result!==(d.encounter.kind==='scenario'?expectedResult(d):'victory'))return false;
   receiptIds.add(r.sceneId);encounterIds.add(r.encounterId);
  }
  for(const id of st.completedScenes)if(needsEncounter(s,scene(id))&&!receiptFor(st,scene(id)))return false;
  for(const a of [...paused,...(st.activeScene?[st.activeScene]:[])]){
   const d=scene(a?.id);if(!exact(a,['id','cursor','choiceId','encounterId'])||!d||d.pov!==s.race||st.completedScenes.includes(a.id)||!prerequisites(st,d)||!Number.isSafeInteger(a.cursor)||a.cursor<0||(a.cursor>d.lines.length&&!storyDialogueComplete(d,a))||!(a.choiceId===null||choice(d,a.choiceId))||(a.choiceId!==null&&!storyDialogueComplete(d,a))||!(a.encounterId===null||(typeof a.encounterId==='string'&&a.encounterId.length>0&&a.encounterId.length<=160)))return false;
   if(a.encounterId!==null&&!d.encounter)return false;if(receiptFor(st,d)&&a.encounterId!==receiptFor(st,d).encounterId)return false;
  }
  if(st.completedScenes.includes('C05.EA02.ashen')&&!s.taskRewardClaims?.includes('story.ashen-primal-core'))return false;
  if(s.taskRewardClaims?.includes('story.ashen-primal-core')&&!st.completedScenes.includes('C05.EA02.ashen'))return false;
  return true;
 }catch{return false;}
}
export function storySafeToInteract(s){return s?.version===6&&s.developmentEquipmentSandbox!==true&&!s.running&&!s.dungeonRun&&(!s.activeEncounter||s.activeEncounter.rewarded===true)&&!(s.restUntil>Math.max(s.lastHealthClock??0,s.lastSeen??0));}
export function storySceneLocationAvailable(s,d){
 const siteId=personalSceneSite(s,d);if(!d||!personalSceneRuntimeAvailable(s,d)||s.siteId!==siteId||!AREAS[siteId]||!storyTerritoryAccess(s,d.id).allowed)return false;
 const area=AREAS[siteId],progress=s.areaProgress?.[area.race];return (progress?progress.unlocked?.includes(area.number):area.number===1)||(!d.optional&&storyTerritoryAccess(s,d.id).storyOnly===true);
}
function sceneAreaUnlocked(s,d){const area=AREAS[personalSceneSite(s,d)],progress=area&&s.areaProgress?.[area.race];return !!area&&(progress?progress.unlocked?.includes(area.number):area.number===1);}
export function canEnterWarStoryScene(s,id){
 if(!validStoryEventState(s)||!storySafeToInteract(s))return false;
 const d=scene(id),st=state(s),access=storyTerritoryAccess(s,id);
 return !!d&&d.pov===s.race&&!st.completedScenes.includes(id)&&(!st.activeScene||st.activeScene.id===id)&&prerequisites(st,d)&&(sceneAreaUnlocked(s,d)||!d.optional&&access.storyOnly===true)&&access.allowed&&access.storyOnly===true&&s.siteId!==d.siteId;
}
export function enterWarStoryScene(s,id){
 if(!canEnterWarStoryScene(s,id))return false;const next=structuredClone(s),d=scene(id),area=AREAS[d.siteId];
 next.siteId=d.siteId;next.location=area.number-1;next.atCamp=true;next.running=false;next.restResume=false;next.stopAfterBattle=false;next.stopAfterDungeon=false;
 next.expedition={...next.expedition,mode:'field',fieldId:d.siteId+'.field',targetInstanceId:null,loop:false};
 if(!next.story?.activeScene&&!beginStoryScene(next,id))return false;
 if(!validSave(next))return false;Object.assign(s,next);return {sceneId:id,entered:true,storyOnly:true};
}
export function warWithdrawalAvailable(s){return validSave(s)&&(territoryAccess(s,AREAS[s.siteId]?.race).code==='war'||storyCorridorExitAvailable(s))&&(!s.activeEncounter||s.activeEncounter.rewarded===true);}
export function availableStoryScenes(s){
 if(!validStoryEventState(s))return [];
 const st=state(s);if(st.activeScene)return [];
 return Object.values(STORY_SCENES).filter(d=>d.pov===s.race&&!st.completedScenes.includes(d.id)&&prerequisites(st,d)&&personalSceneRuntimeAvailable(s,d)).sort((a,b)=>Number(!!a.personal)-Number(!!b.personal)).map(d=>({...structuredClone(d),siteId:personalSceneSite(s,d),atLocation:storySceneLocationAvailable(s,d),available:storySafeToInteract(s)&&storySceneLocationAvailable(s,d),entryAvailable:canEnterWarStoryScene(s,d.id)}));
}
export function beginStoryScene(s,id){
 if(!validStoryEventState(s)||!storySafeToInteract(s))return false;
 const d=scene(id),st=state(s);if(!d||d.pov!==s.race||st.activeScene||st.completedScenes.includes(id)||!prerequisites(st,d)||!storySceneLocationAvailable(s,d))return false;
 s.story??=blank(s.race);if(d.personal){const pp=ensurePersonal(s);if(pp.paused[id]){s.story.activeScene=pp.paused[id];delete pp.paused[id];if(!pp.lateIds.includes(id)&&personalSceneIsLate(s,d)&&!receiptFor(s.story,d)){pp.lateIds.push(id);pp.steps[id]=0;}return {sceneId:id,resumed:true};}pp.steps[id]=0;if(personalSceneIsLate(s,d))pp.lateIds.push(id);}s.story.activeScene={id,cursor:0,choiceId:null,encounterId:null};s.story.acceptedLevels[id]=s.level;return {sceneId:id};
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
 const a=s.story?.activeScene,d=scene(id);if(!a||a.id!==id||!storySceneLocationAvailable(s,d)||!storyDialogueComplete(d,a)||!choice(d,a.choiceId)||needsEncounter(s,d)&&!receiptFor(s.story,d)||!personalActionsDone(s,d))return false;
 return (d.materialConditions??[]).every(row=>materialCount(s,row.material,row.quality)>=row.quantity);
}
export function bindStoryScenario(s,e){
 if(!validStoryEventState(s)||s.activeEncounter!==e||!e?.storyScenario||e.done||e.rewarded)return false;
 const a=s.story?.activeScene,d=scene(a?.id);if(!a||!d||d.encounter?.kind!=='scenario'||!storyDialogueComplete(d,a)||!a.choiceId||a.encounterId!==null||!storySceneLocationAvailable(s,d)||e.instanceId!==d.encounter.nodeId||e.storyScenario.id!==d.encounter.scenarioId||e.storyScenario.sceneId!==d.id||e.storyScenario.pov!==s.race)return false;
 a.encounterId=e.id;return true;
}
export function recordStoryScenarioResult(s,e){
 if(!validStoryEventState(s)||s.activeEncounter!==e||!e?.storyScenario||!e.done||!e.rewarded)return false;
 const st=s.story,a=st?.activeScene,d=scene(a?.id),m=e.storyScenario;
 if(!a||!d||d.encounter?.kind!=='scenario'||a.encounterId!==e.id||receiptFor(st,d)||!storyDialogueComplete(d,a)||!a.choiceId||!storySceneLocationAvailable(s,d)||e.instanceId!==d.encounter.nodeId||m.id!==d.encounter.scenarioId||m.sceneId!==d.id||m.pov!==s.race||m.result!==expectedResult(d)||!Number.isInteger(m.resolvedRound)||m.resolvedRound<(STORY_SCENARIOS[m.id]?.mode==='tool'?0:1))return false;
 st.encounters.push({sceneId:d.id,encounterId:e.id,nodeId:e.instanceId,scenarioId:m.id,result:m.result});return true;
}
export function recordStoryEncounterVictory(s,e){
 if(!validStoryEventState(s)||s.activeEncounter!==e||!e||e.developmentFixture||e.storyScenario||!e.done||!e.win||!e.rewarded||!e.enemies?.length||!e.enemies.every(u=>u.hp===0)||e.multiVersion!==1)return false;
 const st=s.story,a=st?.activeScene,d=scene(a?.id);
 if(!a||!d||d.personal&&a.encounterId===null||d.encounter?.kind!=='victory'||(a.encounterId!==null&&a.encounterId!==e.id)||!storyDialogueComplete(d,a)||!a.choiceId||receiptFor(st,d)||!storySceneLocationAvailable(s,d)||e.instanceId!==d.encounter.nodeId||e.kind!=='field'||INSTANCES[e.instanceId]?.areaId!==s.siteId)return false;
 a.encounterId=e.id;st.encounters.push({sceneId:d.id,encounterId:e.id,nodeId:e.instanceId,scenarioId:null,result:'victory'});return true;
}
export function finishStoryScene(s,id,now=s.lastHealthClock??s.lastSeen??Date.now()){
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
 if(!applyStoryWarTransition(next,id,now)?.ok)return false;
 if(!validStoryEventState(next))return false;
 reconcileOtherworldStone(next);
 for(const key of Object.keys(s))if(!Object.hasOwn(next,key))delete s[key];Object.assign(s,next);return {sceneId:id,completed:true};
}
export function applyStoryEvent(s,action,{now=Date.now()}={}){
 if(!object(action))return false;
 if(action.type==='personal-step')return advancePersonalAction(s,action);
 if(action.type==='personal-pause')return pausePersonalScene(s,action.sceneId);
 if(action.type==='use-tool')return useStoryQuestTool(s,action,now);
 if(action.type==='enter')return enterWarStoryScene(s,action.sceneId);
 if(action.type==='retreat'&&warWithdrawalAvailable(s))return retreatWarTerritory(s,action.returnSiteId);
 if(action.type==='begin')return beginStoryScene(s,action.sceneId);
 if(action.type==='next'&&Number.isSafeInteger(action.cursor)&&action.cursor===s.story?.activeScene?.cursor)return advanceStoryDialogue(s,action.sceneId);
 if(action.type==='choice')return chooseStoryResponse(s,action.sceneId,action.choiceId);
 if(action.type==='finish')return finishStoryScene(s,action.sceneId,now);
 if(action.type==='scenario'&&s.story?.activeScene?.id===action.sceneId&&canStartStoryScenario(s,action.scenarioId))return startStoryScenario(s,action.scenarioId,now);
 if(action.type==='encounter'&&s.story?.activeScene?.id===action.sceneId&&canStartStoryFieldEncounter(s,action.nodeId)){const e=startStoryFieldEncounter(s,action.sceneId,now);if(!e)return false;s.story.activeScene.encounterId=e.id;s.stopAfterBattle=true;return {sceneId:action.sceneId,encounterId:e.id};}
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
 return {valid:true,active:d?{...structuredClone(d),...structuredClone(a),siteId:personalSceneSite(s,d),personalDeferred:!personalSceneRuntimeAvailable(s,d),personalStep:personalState(s).steps[d.id]??0,personalLate:personalState(s).lateIds.includes(d.id),personalActions:personalSceneActions(s,d),needsEncounter:!!needsEncounter(s,d),line:storyDialogueComplete(d,a)?null:d.lines[a.cursor]??null,receipt:structuredClone(receiptFor(st,d)??null),ready:storySceneReady(s,d.id),safe:storySafeToInteract(s),atLocation:storySceneLocationAvailable(s,d),entryAvailable:canEnterWarStoryScene(s,d.id)}:null,available:availableStoryScenes(s),knowledge:structuredClone(st.knowledge),complete:st.flags.includes('C06_COMPLETE'),warDeclared:st.flags.includes('WAR_DECLARED'),warOpeningComplete:st.flags.includes('C07_OPENING_COMPLETE'),invasionBegan:st.flags.includes('INVASION_BEGAN'),chapter8Complete:st.flags.includes('C08_COMPLETE'),completedCount:st.completedScenes.length};
}
export function canStartStoryScenario(s,scenarioId){
 if(!validStoryEventState(s)||!storySafeToInteract(s))return false;
 const a=s.story?.activeScene,d=scene(a?.id);return !!d&&d.encounter?.kind==='scenario'&&needsEncounter(s,d)&&personalActionsDone(s,d)&&d.encounter.scenarioId===scenarioId&&storyDialogueComplete(d,a)&&!!choice(d,a.choiceId)&&!receiptFor(s.story,d)&&a.encounterId===null&&(!d.questTool||storyQuestToolAvailable(s,d.questTool))&&storySceneLocationAvailable(s,d);
}
export function canStartStoryFieldEncounter(s,nodeId){
 if(!validStoryEventState(s)||!storySafeToInteract(s))return false;
 const a=s.story?.activeScene,d=scene(a?.id);return !!d&&d.encounter?.kind==='victory'&&needsEncounter(s,d)&&personalActionsDone(s,d)&&d.encounter.nodeId===nodeId&&storyDialogueComplete(d,a)&&!!choice(d,a.choiceId)&&!receiptFor(s.story,d)&&storySceneLocationAvailable(s,d);
}

export function storyQuestToolAvailable(s,id){return id==='old-wedge'&&validStoryEventState(s)&&s.story?.flags.includes('E_WEDGE_LEARNED')&&s.story.flags.includes('E_WEDGE_AVAILABLE')&&!s.story.flags.includes('E_WEDGE_USED');}
export function useStoryQuestTool(s,action,now){
 if(!validSave(s)||!storyQuestToolAvailable(s,'old-wedge')||s.race!=='elf'||action.sceneId!=='C08.E03.elf'||s.story?.activeScene?.id!==action.sceneId)return false;
 const e=s.activeEncounter;if(!e||e.id!==action.encounterId||e.enemies[0]?.id!==action.targetId||e.storyScenario?.id!==STORY_SCENES[action.sceneId].encounter.scenarioId||e.done||e.rewarded)return false;
 const next=structuredClone(s),battle=next.activeEncounter;
 if(!resolveStoryToolEncounter(next,battle)||!recordStoryScenarioResult(next,battle)||!finalizeStoryScenario(next,battle)||!finishStoryScene(next,action.sceneId,now)||!validSave(next))return false;
 Object.assign(s,next);return {sceneId:action.sceneId,encounterId:e.id,toolUsed:'old-wedge',completed:true};
}

export function advancePersonalAction(s,action){
 if(!validStoryEventState(s)||!storySafeToInteract(s))return false;
 const a=s.story?.activeScene,d=scene(action.sceneId),pp=personalState(s);
 if(!d?.personal||a?.id!==d.id||!a.choiceId||!storySceneLocationAvailable(s,d)||action.step!==pp.steps[d.id])return false;
 const step=personalSceneActions(s,d)[action.step],option=step?.options.find(o=>o.id===action.optionId);
 if(!option)return false;
 if(!option.correct)return {sceneId:d.id,retry:true,hint:'尚未完成目标：'+step.prompt+' 请核实来源、安全条件与本人同意后重试。'};
 pp.steps[d.id]++;return {sceneId:d.id,step:pp.steps[d.id],message:step.result};
}
export function pausePersonalScene(s,id){
 if(!validStoryEventState(s)||!storySafeToInteract(s)||s.activeEncounter?.storyScenario)return false;
 const a=s.story?.activeScene,d=scene(id);if(!d?.personal||a?.id!==id)return false;
 ensurePersonal(s).paused[id]=structuredClone(a);s.story.activeScene=null;return {sceneId:id,paused:true};
}
