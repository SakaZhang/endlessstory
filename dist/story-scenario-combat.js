import {WORLD_MONSTERS,monsterParameters} from './world-content.js';
import {makeMultiUnit,syncMultiTarget} from './multi-combat.js';
import {initializeDwarfActor} from './dwarf-effects.js';

import {STORY_SCENARIOS,storyScenarioMode,storyScenarioNonlethal} from './story-scenario-registry.js';
export {STORY_SCENARIOS,storyScenarioMode,storyScenarioNonlethal} from './story-scenario-registry.js';
const plain=x=>!!x&&typeof x==='object'&&!Array.isArray(x);
const finite=(x,max=1e12)=>Number.isFinite(x)&&x>=0&&x<=max;
export function storyScenarioForStart(s,id){
 const d=Object.hasOwn(STORY_SCENARIOS,id)?STORY_SCENARIOS[id]:null,a=s?.story?.activeScene;
 if(!d||s?.race!==d.race||s.siteId!==d.siteId||!plain(s.story)||s.story.pov!==s.race||!Array.isArray(s.story.completedScenes)||!Array.isArray(s.story.encounters)||!a||a.id!==d.sceneId||a.encounterId!==null||s.story.completedScenes?.includes(d.sceneId)||s.story.encounters?.some(r=>r.sceneId===d.sceneId&&r.scenarioId===id)||s.running||s.activeEncounter&&!s.activeEncounter.rewarded||s.dungeonRun||s.developmentEquipmentSandbox===true)return null;
 return d;
}
// Engine-only setup, called on a cloned candidate after real instance creation.
export function attachStoryScenario(s,e,id,{initialHeroHp,returnAtCamp}={}){
 const d=STORY_SCENARIOS[id],a=s.story?.activeScene,def=d&&WORLD_MONSTERS[d.budgetId],p=def&&monsterParameters(def.id);
 if(!d||!def||!p||s.activeEncounter!==e||s.race!==d.race||s.siteId!==d.siteId||a?.id!==d.sceneId||a.encounterId!==null||e.instanceId!==d.siteId+'.field'||e.done||!finite(initialHeroHp)||initialHeroHp<=0||typeof returnAtCamp!=='boolean')return false;
 const u=makeMultiUnit(e.id+'-story-actor',e.location,e.instanceId,{enemy:d.actorName,hp:p.hp,atk:p.atk,armor:p.armor},s.lastHealthClock,{});
 initializeDwarfActor(u,def,p,s.lastHealthClock);u.main=true;u.name=d.actorName;u.storyActorRace=d.actorRace;u.storyActorWeapon=d.actorWeapon;if(d.actorId)u.storyActorId=d.actorId;
 // No creature traits or spells impersonate the named hero. Only the existing
 // region's normal-actor HP/attack/armor/basic cadence are reused.
 u.shield=0;u.shieldUntil=0;u.control.cooldowns={};u.skillOverrides={};
 e.enemies=[u];e.fieldGroup=false;e.rewardDefinitionId=def.id;e.rewardGold=0;e.rewardXp=0;e.targetId=u.id;e.typedDots=[];
 e.storyScenario={version:1,id,sceneId:d.sceneId,pov:s.race,initialHeroHp,returnAtCamp,result:null,resolvedRound:null};
 a.encounterId=e.id;if(d.mode==='tool')s.running=false;syncMultiTarget(e);return e;
}
export function validStoryScenarioState(s){
 const e=s?.activeEncounter;if(!e)return true;
 if(e.storyScenario===undefined)return !(e.enemies??[]).some(u=>u.storyActorRace!==undefined||u.storyActorWeapon!==undefined||u.storyActorId!==undefined);
 const x=e.storyScenario,d=plain(x)&&Object.hasOwn(STORY_SCENARIOS,x.id)?STORY_SCENARIOS[x.id]:null,a=s.story?.activeScene;
 if(!d||Object.keys(x).length!==8||x.version!==1||x.sceneId!==d.sceneId||x.pov!==d.race||s.race!==d.race||s.siteId!==d.siteId||a?.id!==d.sceneId||a.encounterId!==e.id||e.instanceId!==d.siteId+'.field'||e.kind!=='field'||e.boss||e.developmentFixture||e.fieldGroup||e.rewardGold!==0||e.rewardXp!==0||e.rewardDefinitionId!==d.budgetId||!finite(x.initialHeroHp)||x.initialHeroHp<=0||typeof x.returnAtCamp!=='boolean'||!Array.isArray(e.enemies)||e.enemies.length!==1)return false;
 const u=e.enemies[0];if(u.definitionId!==d.budgetId||u.name!==d.actorName||u.storyActorRace!==d.actorRace||u.storyActorWeapon!==d.actorWeapon||u.storyActorId!==d.actorId||u.follower||!u.main||u.origin!=='initial')return false;
 if(x.result===null)return x.resolvedRound===null&&!e.done&&!e.rewarded&&(d.mode==='clear'||d.mode==='tool'||e.round<d.rounds);
 return [d.result,'retry'].includes(x.result)&&Number.isSafeInteger(x.resolvedRound)&&x.resolvedRound>=(d.mode==='tool'?0:1)&&x.resolvedRound===e.round&&e.done===true&&e.win===false&&e.rewarded===true;
}
// Must run after a real engine step and before ordinary death/rest settlement.
// No UI action accepts a result or a round count.
export function advanceStoryScenario(s,e){
 if(s.activeEncounter!==e||!e?.storyScenario||e.storyScenario.result!==null||storyScenarioMode(e)==='tool')return null;
 const x=e.storyScenario,d=STORY_SCENARIOS[x.id];
 if(!d||s.story?.activeScene?.encounterId!==e.id||s.story.activeScene.id!==d.sceneId||!Number.isSafeInteger(e.round)||e.round<1||e.lastCombatEventAt!==s.lastHealthClock)return null;
 const heroDown=e.heroHp<=0,failed=heroDown&&!d.defeatIsOutcome,decisive=e.done&&e.win===true;
 if(!heroDown&&!decisive&&(d.mode==='clear'||e.round<d.rounds))return null;
 x.result=failed?'retry':d.result;x.resolvedRound=e.round;e.done=true;e.win=false;e.rewarded=true;e.targetId=null;e.killSource=null;
 // The real hit has already been processed. At the authored nonlethal cut,
 // keep named actors visibly alive; this never changes ordinary combat damage.
 if(d.mode==='nonlethal')for(const actor of e.enemies)actor.hp=Math.max(1,actor.hp);
 e.rewardNotes=[failed?'未能通过这一段。返回本场安全点，可重新交手。':d.outcome,'剧情交手不结算金币、经验、掉落或副本冷却。'];
 syncMultiTarget(e);return {completed:!failed,result:x.result};
}
export function finalizeStoryScenario(s,e){
 if(s.activeEncounter!==e||!e?.storyScenario||!e.done||!e.rewarded||!e.storyScenario.result)return false;
 const x=e.storyScenario;if(!STORY_SCENARIOS[x.id])return false;
 // Only the pre-scene health is restored; this cannot exceed the entry snapshot.
 s.heroHp=x.initialHeroHp;s.atCamp=x.returnAtCamp;s.restUntil=0;s.restResume=false;s.running=false;s.stopAfterBattle=false;s.stopAfterDungeon=false;s.activeEncounter=null;
 s.nextBattleAt=s.lastHealthClock+1800;s.nextActionAt=s.nextBattleAt;
 if(x.result==='retry'&&s.story?.activeScene?.encounterId===e.id)s.story.activeScene.encounterId=null;
 return true;
}
export function storyScenarioObjective(e){const d=STORY_SCENARIOS[e?.storyScenario?.id];return d?{id:e.storyScenario.id,objective:d.objective,mode:d.mode,rounds:d.rounds?Math.min(d.rounds,e.round):e.round,requiredRounds:d.rounds??null,result:e.storyScenario.result,outcome:e.storyScenario.result==='retry'?'返回安全点，可重试。':e.storyScenario.result?d.outcome:null}:null;}

const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function resolveStoryToolEncounter(s,e){
 if(s.activeEncounter!==e||storyScenarioMode(e)!=='tool'||e.storyScenario.result!==null||e.done||e.rewarded)return false;
 const d=STORY_SCENARIOS[e.storyScenario.id];for(const u of e.enemies)u.hp=0;e.hp=0;e.done=true;e.win=false;e.rewarded=true;e.killSource=null;e.targetId=null;e.storyScenario.result=d.result;e.storyScenario.resolvedRound=e.round;e.rewardNotes=[d.outcome,'任务道具仅在本次解封保存成功后消耗。'];syncMultiTarget(e);return true;
}
export function renderStoryScenarioNotice(e){const row=storyScenarioObjective(e);if(!row)return '';const tool=row.mode==='tool',nonlethal=row.mode==='nonlethal';return `<section class="storyScenarioNotice" aria-label="剧情遭遇目标"><b>${tool?'封印核心 · 任务道具解除':nonlethal?'剧情交手 · 非致死':'剧情遭遇'} · 无战利品</b><p>${esc(row.objective)}</p>${nonlethal?'<p>即死效果不处决剧情人物；普通战斗规则不变。</p>':tool?'<p>核心封闭，普通攻击无法解除。旧制楔钉受到任务保护，使用成功后消耗一次。</p>':'<p>按现场目标完成遭遇；失败返回本层安全点，已有层次不重打。</p>'}${row.requiredRounds?`<small>交手 ${row.rounds}/${row.requiredRounds} 轮</small>`:''}${tool&&!row.result?`<button type="button" data-story-action="use-tool" data-story-scene="${esc(e.storyScenario.sceneId)}" data-story-encounter="${esc(e.id)}" data-story-target="${esc(e.enemies[0].id)}">使用旧制楔钉击破核心（消耗1件）</button>`:''}${row.outcome?'<p>'+esc(row.outcome)+'</p>':''}</section>`;}
