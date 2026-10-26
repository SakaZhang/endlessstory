import {WORLD_MONSTERS,monsterParameters} from './world-content.js';
import {makeMultiUnit,syncMultiTarget} from './multi-combat.js';
import {initializeDwarfActor} from './dwarf-effects.js';

const freeze=value=>{for(const child of Object.values(value))if(child&&typeof child==='object')freeze(child);return Object.freeze(value)};
// Named, nonlethal authored scenes. The source monster ID is a numerical budget,
// never the character's identity, a codex discovery, or a loot source.
export const STORY_SCENARIOS=freeze({
 'story.c01.human-chase':{sceneId:'C01.H01.human',race:'human',siteId:'goblin.a01',budgetId:'goblin.a01.normal.1',actorRace:'goblin',actorWeapon:'dagger',actorName:'奇克',rounds:4,result:'chase-transition',objective:'截住奇克，交手四轮后追入石道；本场不杀死对方。',outcome:'奇克钻入旧石道。罗什福尔追了进去。'},
 'story.c01.goblin-escape':{sceneId:'C01.G01.goblin',race:'goblin',siteId:'goblin.a01',budgetId:'goblin.a01.normal.1',actorRace:'human',actorWeapon:'sword_shield',actorName:'罗什福尔',rounds:4,result:'chase-transition',objective:'撑过四轮拦截，找到撤离口；本场不杀死对方。',outcome:'窄口的旧阶断开。奇克钻入石道，罗什福尔紧随其后。'},
 'story.c05.elf-duel':{sceneId:'C05.EA01.elf',race:'elf',siteId:'ashen.a04',budgetId:'ashen.a04.normal.1',actorRace:'ashen',actorWeapon:'armguard',actorName:'砾恩',rounds:4,result:'elf-defeated',objective:'交手四轮，确认核心变化；升级后莱姆斯将败退，不以杀死砾恩为目标。',outcome:'核心的光稳定下来。莱姆斯被逼退，武器落在石面；砾恩没有追击。'},
 'story.c05.ashen-duel':{sceneId:'C05.EA01.ashen',race:'ashen',siteId:'ashen.a04',budgetId:'ashen.a04.normal.1',actorRace:'elf',actorWeapon:'staff',actorName:'莱姆斯',rounds:4,result:'ashen-victory',objective:'交手四轮，稳住核心并突破拦截；击退对方也会转场，不杀死莱姆斯。',outcome:'核心的光稳定下来。砾恩击退莱姆斯，留下了离开的路。'}
});
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
 initializeDwarfActor(u,def,p,s.lastHealthClock);u.main=true;u.name=d.actorName;u.storyActorRace=d.actorRace;u.storyActorWeapon=d.actorWeapon;
 // No creature traits or spells impersonate the named hero. Only the existing
 // region's normal-actor HP/attack/armor/basic cadence are reused.
 u.shield=0;u.shieldUntil=0;u.control.cooldowns={};u.skillOverrides={};
 e.enemies=[u];e.fieldGroup=false;e.rewardDefinitionId=def.id;e.rewardGold=0;e.rewardXp=0;e.targetId=u.id;e.typedDots=[];
 e.storyScenario={version:1,id,sceneId:d.sceneId,pov:s.race,initialHeroHp,returnAtCamp,result:null,resolvedRound:null};
 a.encounterId=e.id;syncMultiTarget(e);return e;
}
export function validStoryScenarioState(s){
 const e=s?.activeEncounter;if(!e)return true;
 if(e.storyScenario===undefined)return !(e.enemies??[]).some(u=>u.storyActorRace!==undefined||u.storyActorWeapon!==undefined);
 const x=e.storyScenario,d=plain(x)&&Object.hasOwn(STORY_SCENARIOS,x.id)?STORY_SCENARIOS[x.id]:null,a=s.story?.activeScene;
 if(!d||Object.keys(x).length!==8||x.version!==1||x.sceneId!==d.sceneId||x.pov!==d.race||s.race!==d.race||s.siteId!==d.siteId||a?.id!==d.sceneId||a.encounterId!==e.id||e.instanceId!==d.siteId+'.field'||e.kind!=='field'||e.boss||e.developmentFixture||e.fieldGroup||e.rewardGold!==0||e.rewardXp!==0||e.rewardDefinitionId!==d.budgetId||!finite(x.initialHeroHp)||x.initialHeroHp<=0||typeof x.returnAtCamp!=='boolean'||!Array.isArray(e.enemies)||e.enemies.length!==1)return false;
 const u=e.enemies[0];if(u.definitionId!==d.budgetId||u.name!==d.actorName||u.storyActorRace!==d.actorRace||u.storyActorWeapon!==d.actorWeapon||u.follower||!u.main||u.origin!=='initial')return false;
 if(x.result===null)return x.resolvedRound===null&&!e.done&&!e.rewarded&&e.round<d.rounds;
 return [d.result,'retry'].includes(x.result)&&Number.isSafeInteger(x.resolvedRound)&&x.resolvedRound>0&&x.resolvedRound===e.round&&e.done===true&&e.win===false&&e.rewarded===true;
}
// Must run after a real engine step and before ordinary death/rest settlement.
// No UI action accepts a result or a round count.
export function advanceStoryScenario(s,e){
 if(s.activeEncounter!==e||!e?.storyScenario||e.storyScenario.result!==null)return null;
 const x=e.storyScenario,d=STORY_SCENARIOS[x.id];
 if(!d||s.story?.activeScene?.encounterId!==e.id||s.story.activeScene.id!==d.sceneId||!Number.isSafeInteger(e.round)||e.round<1||e.lastCombatEventAt!==s.lastHealthClock)return null;
 const failed=e.heroHp<=0,decisive=e.done&&e.win===true;
 if(!failed&&!decisive&&e.round<d.rounds)return null;
 x.result=failed?'retry':d.result;x.resolvedRound=e.round;e.done=true;e.win=false;e.rewarded=true;e.targetId=null;e.killSource=null;
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
export function storyScenarioObjective(e){const d=STORY_SCENARIOS[e?.storyScenario?.id];return d?{id:e.storyScenario.id,objective:d.objective,rounds:Math.min(d.rounds,e.round),requiredRounds:d.rounds,result:e.storyScenario.result,outcome:e.storyScenario.result==='retry'?'返回安全点，可重试。':e.storyScenario.result?d.outcome:null}:null;}

const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function renderStoryScenarioNotice(e){const row=storyScenarioObjective(e);if(!row)return '';return `<section class="storyScenarioNotice" aria-label="剧情交手目标"><b>剧情交手 · 非致死 · 无战利品</b><p>${esc(row.objective)}</p><p>即死效果不处决剧情人物；普通战斗规则不变。</p><small>交手 ${row.rounds}/${row.requiredRounds} 轮</small>${row.outcome?'<p>'+esc(row.outcome)+'</p>':''}</section>`;}
