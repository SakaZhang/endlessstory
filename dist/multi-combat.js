import {emitCombatDisplay,combatDisplayHealthSnapshot,emitCombatDisplayRecovery} from './combat-display-bridge.js';
import {skillTreeNode} from './skill-tree-definition.js';
import {resolveTreePassives,derivePassiveStats,passiveDamageMultiplier,passiveReceivedHeal,passiveNegativeDuration} from './skill-tree-passives.js';
import {skillTreeHeroStats,skillTreeEnemyAttributes} from './skill-tree-attributes.js';
import {createTreeEffectHost} from './skill-tree-effect-host.js';
import {validSkillEffectState} from './skill-tree-effects.js';
import {validSkillPoison,createSkillPoison,applySkillPoison,advanceSkillPoison} from './skill-tree-poison.js';
import {executeTreeSkillTurn,planTreeSkill,resolveSetLinkedHit,resolveSetLinkedEffect,TREE_ACTIVE_SKILL_IDS} from './skill-tree-consumer.js';
import {advanceLegendaryCombat} from './legendary-combat.js';
import {createPlayerShieldLayers,expirePlayerShieldLayers,grantPlayerShieldLayer,absorbPlayerShieldDamage} from './player-shield-layers.js';
import {WORLD_MONSTERS as DWARF_MONSTERS} from './world-content.js';
import {validDwarfActor,expireDwarfShield,nextDwarfAction,applyDwarfDot,tickDwarfDots,validDwarfDots} from './dwarf-effects.js';
import {createBattleAffixState,validBattleAffixState,tryNirvana,tryReaperHit,calculateLifesteal,tryMulticast} from './affix-expansion.js';
import {createControl,validControl,advanceControlClock,controlAllowsAction,beginPreparing,claimCompletedCast,interruptPreparing,applyStun,preparingProgress} from './multi-control.js';
export const PROTOTYPE_MONSTERS=['grayflag-raider','rogue-mine-golem','oathless-soldier'];
const n=x=>Number.isFinite(x)&&x>=0&&x<=1e12;
const int=x=>Number.isSafeInteger(x)&&x>=0;
let rngOwner=null;
export function multiItemId(){return rngOwner?`${rngOwner.id}-loot-${++rngOwner.itemSerial}`:null;}
export function withMultiRng(e,fn){const random=Math.random,old=rngOwner;rngOwner=e;Math.random=()=>{e.rngState=(Math.imul(e.rngState,1664525)+1013904223)>>>0;e.rngDraws++;return e.rngState/2**32;};try{return fn();}finally{Math.random=random;rngOwner=old;}}
export function makeMultiUnit(id,location,sourceInstanceId,l,now,profile={}){
 return {id,monsterId:PROTOTYPE_MONSTERS[location],definitionId:PROTOTYPE_MONSTERS[location],sourceInstanceId,origin:'initial',main:false,location,name:l.enemy,hp:l.hp,max:l.hp,atk:l.atk,armor:l.armor,shield:profile.shield??0,burn:0,broken:0,blunt:0,scorch:0,stun:0,round:0,nextHeavy:4,heavyDelayed:false,cd:{},control:createControl(id,now),profile:structuredClone(profile)};
}
export function validMultiProfile(p){if(!p||typeof p!=='object'||Array.isArray(p)||!Object.keys(p).every(k=>['shield','counterRatio','lifestealRatio','lifestealCap','castDuration','castCooldown','castMultiplier','summonCount','controlReduction','interruptStop'].includes(k))||!Object.values(p).every(n))return false;return Number.isSafeInteger(p.interruptStop??1100)&&(p.controlReduction??0)<=1&&(p.counterRatio??0)<=1&&(p.lifestealRatio??0)<=1&&Number.isInteger(p.summonCount??0)&&(p.summonCount??0)<=3&&(!(p.castDuration>0)||(Number.isSafeInteger(p.castDuration)&&Number.isSafeInteger(p.castCooldown)&&p.castCooldown>=0&&p.castMultiplier>0));}
export function validMultiEncounter(e,instances){
 if(e.multiVersion===undefined)return e.enemies===undefined&&e.targetId===undefined;
 const planned=e.contentVersion==='dwarf-m2-v1';
 if(e.multiVersion!==1||(!planned&&(e.developmentFixture!==true||e.kind!=='field'||e.boss))||(planned&&(!instances[e.instanceId]?.contentVersion||e.developmentFixture===true||!validDwarfDots(e.typedDots)))||typeof e.id!=='string'||!e.id||e.id.length>100||!int(e.rngState)||e.rngState>0xffffffff||!int(e.rngDraws)||!int(e.itemSerial)||!int(e.summonSerial)||!int(e.activeCastCount)||!Array.isArray(e.enemies)||e.enemies.length<(planned?1:2)||e.enemies.length>100000||new Set(e.enemies.map(u=>u?.id)).size!==e.enemies.length)return false;
 if(planned){
  if(e.fixtureAction!==undefined&&e.fixtureAction!==null)return false;
  if(!['field','dungeon','boss'].includes(e.kind)||e.boss!==(e.kind==='boss')||typeof e.fieldGroup!=='boolean'||e.fieldGroup&&e.kind!=='field'||!n(e.rewardGold)||!n(e.rewardXp)||!e.enemies.some(u=>u.definitionId===e.rewardDefinitionId&&u.main))return false;
  const rank=e.boss?'boss':e.kind==='dungeon'&&e.dungeonStage===3?'elite':'normal';
  if(e.enemies.some(u=>DWARF_MONSTERS[u.definitionId]?.rank!==rank))return false;
  if(e.clearRewards!==undefined&&e.clearRewards!==null){const c=e.clearRewards;if(!['gold','xp'].every(k=>n(c[k]))||!Number.isInteger(c.materialRounds)||c.materialRounds<0||c.materialRounds>3||!['gearChance','markChance'].every(k=>Number.isFinite(c[k])&&c[k]>=0&&c[k]<=1))return false;}
 }
 for(const key of ['pendingBasicDelayMs','basicMicroElapsed'])if(e[key]!==undefined&&e[key]!==165)return false;
 if((e.pendingBasicAt===undefined)!==(e.pendingBasicDelayMs===undefined))return false;
 if(e.nextBasicSlow!==undefined&&e.nextBasicSlow!==1.15)return false;
 for(const key of ['pendingBasicAt','nextRegularAt','lastCombatEventAt'])if(e[key]!==undefined&&(!Number.isSafeInteger(e[key])||e[key]<0||e[key]>1e15))return false;
 if(e.pendingBasicAt!==undefined&&e.nextRegularAt!==undefined&&e.pendingBasicAt>=e.nextRegularAt)return false;
 if(e.treeCombatClock!==undefined&&(!Number.isSafeInteger(e.treeCombatClock)||e.treeCombatClock<0||e.treeCombatClock>1e15))return false;
 if(e.treeEffects!==undefined&&(!validSkillEffectState(e.treeEffects)||!Object.keys(e.treeEffects.enemies).every(id=>e.enemies.some(u=>u.id===id))))return false;
 if(e.treePoison!==undefined&&(!e.treePoison||typeof e.treePoison!=='object'||Array.isArray(e.treePoison)||Object.keys(e.treePoison).length>100||!Object.entries(e.treePoison).every(([id,p])=>e.enemies.some(u=>u.id===id)&&validSkillPoison(p)&&p.enemyId===id)))return false;
 if(e.treePoisonReceipts!==undefined&&(!e.treePoisonReceipts||typeof e.treePoisonReceipts!=='object'||Array.isArray(e.treePoisonReceipts)||!Object.entries(e.treePoisonReceipts).every(([id,r])=>e.enemies.some(u=>u.id===id)&&r&&Object.keys(r).length===2&&typeof r.tickId==='string'&&r.tickId.length<=1000&&Number.isSafeInteger(r.at)&&r.at>=0&&r.at<=1e15)))return false;
 if(e.treeSkillCooldowns!==undefined&&(!e.treeSkillCooldowns||typeof e.treeSkillCooldowns!=='object'||Array.isArray(e.treeSkillCooldowns)||!Object.entries(e.treeSkillCooldowns).every(([key,value])=>TREE_ACTIVE_SKILL_IDS.includes(key)&&Number.isInteger(value)&&value>=0&&value<=100)))return false;
 if(e.affixState!==undefined&&(!validBattleAffixState(e.affixState)||e.affixState.battleId!==e.id))return false;
 const initial=e.enemies.filter(u=>u.origin==='initial');if(planned&&e.fieldGroup&&initial.length<2)return false;if(initial.length<(planned?1:2)||initial.length>3)return false;
 if(!e.enemies.every(u=>u&&typeof u.id==='string'&&u.id.length<200&&['initial','summoned'].includes(u.origin)&&u.sourceInstanceId===e.instanceId&&(planned||instances[u.sourceInstanceId]?.kind==='field')&&instances[u.sourceInstanceId]?.enabled&&u.location===e.location&&(planned?u.location===DWARF_MONSTERS[u.definitionId]?.area-1:[0,1,2].includes(u.location))&&(planned?validDwarfActor(u):u.monsterId===PROTOTYPE_MONSTERS[u.location]&&u.definitionId===u.monsterId)&&typeof u.name==='string'&&u.name.length<150&&typeof u.main==='boolean'&&['hp','max','atk','armor','shield','burn','broken','blunt','scorch','stun','round','nextHeavy'].every(k=>n(u[k]))&&u.max>0&&u.hp<=u.max&&typeof u.heavyDelayed==='boolean'&&u.cd&&typeof u.cd==='object'&&Object.values(u.cd).every(n)&&validControl(u.control)&&u.control.unitId===u.id&&validMultiProfile(u.profile)&&Array.isArray(u.elementTags)&&new Set(u.elementTags).size===u.elementTags.length&&u.elementTags.every(k=>['earth','water','fire','wind','light','dark'].includes(k))&&u.elementResistance&&Object.keys(u.elementResistance).length===6&&['earth','water','fire','wind','light','dark'].every(k=>n(u.elementResistance[k]))))return false;
 if(e.pauseAt!==undefined&&(!Number.isSafeInteger(e.pauseAt)||e.pauseAt<0||e.pauseAt>1e15||!Number.isFinite(e.pauseRemainingAction)||e.pauseRemainingAction<0||e.pauseRemainingAction>1100))return false;
 if(e.pauseAt===undefined&&e.pauseRemainingAction!==undefined)return false;
 if(e.lastCast!==undefined&&!validMultiCastRecord(e.lastCast,e.enemies))return false;
 if(e.lastCast?.hits?.some(h=>(h.hitIndex!==undefined&&!int(h.hitIndex))||['hpBefore','hpAfter','actualHpLost','killProcHpLost'].some(k=>h[k]!==undefined&&!n(h[k]))||(h.hpBefore!==undefined&&h.hpAfter>h.hpBefore)||(h.actualHpLost!==undefined&&h.actualHpLost>h.hpBefore)||(h.killProcHpLost!==undefined&&h.killProcHpLost>h.hpAfter)))return false;
 if(e.lastCast?.lifesteal!==undefined&&!n(e.lastCast.lifesteal))return false;
 if(e.fixtureAction!==undefined&&e.fixtureAction!==null&&!validFixtureAction(e.fixtureAction))return false;
 if(e.rewardRoundSources!==undefined&&(!Array.isArray(e.rewardRoundSources)||e.rewardRoundSources.length!==2||!e.rewardRoundSources.every(id=>initial.some(u=>u.id===id))))return false;
 return e.done?(e.targetId===null&&(!e.win||e.enemies.every(u=>u.hp===0))):e.enemies.some(u=>u.id===e.targetId&&u.hp>0);
}
// Version 2 records preserve distinct hit events for the paid skill-tree consumer.
// Legacy records retain their original one-hit-per-target bound; this is not an action grant.
export function validMultiCastRecord(c,enemies){
 if(!c||typeof c!=='object'||Array.isArray(c)||typeof c.id!=='string'||!c.id||c.id.length>500||!['single','all','self'].includes(c.scope)||typeof c.skillId!=='string'||!Array.isArray(c.hits)||!Array.isArray(enemies))return false;
 const multihit=c.recordVersion===2;if(c.recordVersion!==undefined&&!multihit)return false;
 if(c.hits.length>enemies.length*(multihit?3:1))return false;
 const ids=new Set(),segments=new Set();
 for(const h of c.hits){
  if(!h||typeof h.id!=='string'||!h.id||h.id.length>700||typeof h.hit!=='boolean'||!enemies.some(u=>u.id===h.targetId))return false;
  if(multihit){if(!Number.isSafeInteger(h.hitIndex)||h.hitIndex<0||h.hitIndex>2||ids.has(h.id))return false;const segment=h.targetId+':'+h.hitIndex;if(segments.has(segment))return false;ids.add(h.id);segments.add(segment);}
 }
 return true;
}
export function validFixtureAction(a){return a&&typeof a==='object'&&['single','all'].includes(a.scope)&&['damage','stun'].includes(a.kind)&&n(a.amount)&&(a.kind==='damage'||(Number.isSafeInteger(a.amount)&&a.amount>0&&!!applyStun(createControl('validation',0),{...a.control,now:0,baseDuration:a.amount,reduction:0})));}
export function syncMultiTarget(e){
 const alive=e.enemies.filter(u=>u.hp>0);if(!alive.some(u=>u.id===e.targetId))e.targetId=alive[0]?.id??null;
 if(e.done)e.targetId=null;const target=e.enemies.find(u=>u.id===e.targetId)??e.enemies[0];
 for(const k of ['name','max','atk','armor','burn','broken','blunt','scorch','stun','nextHeavy','heavyDelayed','elementTags','elementResistance'])e[k]=structuredClone(target[k]);e.hp=e.done&&e.win?0:target.hp;
}
export function selectMultiTarget(e,id){if(e.done||!e.enemies.some(u=>u.id===id&&u.hp>0))return false;e.targetId=id;syncMultiTarget(e);return true;}
export function multiTargetRows(e,now){return e.enemies.map(u=>({...u,selected:u.id===e.targetId,preparing:preparingProgress(u.control,Math.max(e.pauseAt??now??u.control.clock,u.control.clock))}));}
const physical=(raw,armor)=>Math.max(1,Math.round(raw*100/(100+Math.max(0,armor))));
function hitEnemy(u,amount,e,display={}){const beforeHp=u.hp,beforeShield=u.shield;const absorbed=Math.min(u.shield,amount);u.shield-=absorbed;const hpLost=Math.min(u.hp,amount-absorbed);u.hp-=hpLost;if(e)emitCombatDisplay(e,{targetId:u.id,element:'physical',hpDelta:u.hp-beforeHp,shieldDelta:u.shield-beforeShield,...display});return hpLost;}
function end(e,win,source){e.done=true;e.win=win;e.killSource=source;e.heroHp=Math.max(0,e.heroHp);e.targetId=null;syncMultiTarget(e);}
function cleared(e,source){if(e.enemies.every(u=>u.hp<=0)){end(e,true,source);return true;}return false;}
function mirrorLayers(e){if(!e.playerShieldLayers)return;const layers=e.playerShieldLayers.layers;e.shield=layers.find(l=>l.source==='shelter')?.remaining??0;e.barrierShield=layers.find(l=>l.source==='barrier')?.remaining??0;e.legendaryShield=layers.filter(l=>l.source.startsWith('reactor:')).reduce((n,l)=>n+l.remaining,0);}
function syncLayers(e){if(!e.playerShieldLayers)return;for(const [source,value,duration]of [['shelter',e.shield,null],['barrier',e.barrierShield,Math.max(0,e.barrier??0)*1100]]){const old=e.playerShieldLayers.layers.find(l=>l.source===source);if((old?.remaining??0)!==(value??0)){const r=grantPlayerShieldLayer(e.playerShieldLayers,{source,capacity:value??0,durationMs:duration,clock:e.playerShieldLayers.clock,hp:e.heroHp});if(r)e.playerShieldLayers=r.state;}}}
function hitHero(e,amount,display={}){const before=combatDisplayHealthSnapshot(e);const report=()=>{const after=combatDisplayHealthSnapshot(e);emitCombatDisplay(e,{sourceId:'enemy',targetId:'hero',element:'physical',hpDelta:after.hp-before.hp,shieldDelta:after.shield-before.shield,...display});};if(e.playerShieldLayers){syncLayers(e);const r=absorbPlayerShieldDamage(e.playerShieldLayers,{damage:amount,hp:e.heroHp,clock:e.playerShieldLayers.clock});e.playerShieldLayers=r.state;e.heroHp=r.hpAfter;mirrorLayers(e);report();return r.hpDamage;}let absorbed=Math.min(e.barrierShield,amount);e.barrierShield-=absorbed;amount-=absorbed;absorbed=Math.min(e.shield,amount);e.shield-=absorbed;amount-=absorbed;const loss=Math.min(e.heroHp,amount);e.heroHp-=loss;report();return loss;}
function treePassiveContext(ctx){
 const t=ctx.treeSkills;if(!t)return null;
 const selected=t.passive??[null,null];if(!selected.some(Boolean)&&!t.passiveConfig)return null;
 const c=resolveTreePassives({passive:selected,unlocked:t.unlocked,weaponType:t.weaponType,config:t.passiveConfig??{}});if(!c)throw Error('Invalid passive configuration');return c;
}
function treePassiveStats(base,e,context){
 if(!context)return base;const clock=e.playerShieldLayers?.clock??0,layers=e.playerShieldLayers??{version:1,clock,layers:[['shelter',e.shield??0],['barrier',e.barrierShield??0],['legacy-reactor',e.legendaryShield??0]].filter(([,remaining])=>remaining>0).map(([source,remaining])=>({source,capacity:remaining,remaining,expiresAt:null}))};const r=derivePassiveStats(base,context,{shieldLayers:layers,combatClock:clock,currentHp:e.heroHp});if(!r)throw Error('Invalid passive stats');return r.stats;
}
function treeDamage(context,type,kind='skill'){return context?passiveDamageMultiplier(context,{damageType:type,source:{kind}}):1;}
function treeHeal(context,e,amount,maxHp){return context?passiveReceivedHeal(context,{amount,currentHp:e.heroHp,maxHp}):Math.min(amount,Math.max(0,maxHp-e.heroHp));}
export function stepMulti(s,e,turn,ctx){
 const {stats,SKILLS,skillUnlocked,resolveElementDamage,now,makeSummon}=ctx,passives=treePassiveContext(ctx),baseStats=stats(s),st=treePassiveStats(baseStats,e,passives),logs=[];if(!ctx.basicOnly)e.round++;else {delete e.pendingBasicAt;delete e.pendingBasicDelayMs;}
 const refreshStats=()=>Object.assign(st,treePassiveStats(e.treeEffects?skillTreeHeroStats(baseStats,e.treeEffects,ctx.treeSkills.attributeConfig):baseStats,e,passives));
 e.affixState??=createBattleAffixState(e.id);
 if(ctx.treeSkills){const beforeClock=e.treeEffects?.clock??e.treeCombatClock??0;if(e.treePoison)advanceTreePoisons(e,beforeClock+(ctx.combatDeltaMs??1100),now,logs);runTreePlayerPhase(s,e,{...ctx,treeTimersOnly:true,onDamageAction:()=>{},onHeroDeath:()=>false},logs);if(e.done){advanceLegendaryCombat(s,{combatDeltaMs:Math.max(0,(e.treeCombatClock??beforeClock)-beforeClock),alive:e.heroHp>0,hasTargets:false,deferProcs:true,resolve:()=>({stop:true})});return logs;}}
 for(const u of e.enemies){expireDwarfShield(u,now);if(u.timedReflect?.endsAt<=now)delete u.timedReflect;}
 if(e.playerShieldLayers||(s.inventory??[]).some(it=>it.legendaryId==='everburning-reactor'&&Object.values(s.equip??{}).includes(it.id))){e.playerShieldLayers??=createPlayerShieldLayers();syncLayers(e);e.playerShieldLayers=expirePlayerShieldLayers(e.playerShieldLayers,ctx.treeSkills?(e.treeCombatClock??e.playerShieldLayers.clock):e.playerShieldLayers.clock+(ctx.combatDeltaMs??1100));mirrorLayers(e);}
 refreshStats();
 const legendaryProc=proc=>{
  const beforeRecovery=combatDisplayHealthSnapshot(e);refreshStats();
  if(e.heroHp<=0||!e.enemies.some(u=>u.hp>0))return {stop:true};
  const targets=proc.kind==='reactor'?e.enemies.filter(u=>u.hp>0):[e.enemies.find(u=>u.id===e.targetId&&u.hp>0)??e.enemies.find(u=>u.hp>0)],hits=[];
  for(const u of targets){const crit=Math.random()<st.crit,raw=st.atk*proc.coefficient*(crit?st.critDamage:1)*treeDamage(passives,proc.kind==='reactor'?'fire':'physical','legendary'),damage=proc.kind==='reactor'?resolveElementDamage(raw,'fire',st.elementAttack.fire,u.elementResistance.fire,u.elementTags):physical(raw,Math.max(0,u.armor*(u.broken?.75:1)*(1-proc.penetration)-st.penetration));const before=u.hp;hitEnemy(u,damage,e,{kind:'legend',sourceId:proc.itemId,skillId:proc.kind,element:proc.kind==='reactor'?'fire':'physical',crit});hits.push({hitId:proc.itemId+':'+e.round+':'+u.id,hpBefore:before,hpAfter:u.hp,source:'active'});logs.push((proc.kind==='reactor'?'余热循环':'祖王回响')+' → '+u.name+' · '+Number(damage.toFixed(1)));}
  const heal=calculateLifesteal({rating:st.lifesteal??0,maxHp:st.hp,currentHp:e.heroHp,hits},ctx.lifestealConfig);if(heal?.heal>0)e.heroHp+=treeHeal(passives,e,heal.heal,st.hp);
  if(proc.kind==='reactor'&&e.heroHp>0){e.playerShieldLayers??=createPlayerShieldLayers();const r=grantPlayerShieldLayer(e.playerShieldLayers,{source:'reactor:'+proc.itemId,ownerItemId:proc.itemId,capacity:st.hp*proc.shieldFraction+(st.shieldBonus??0),durationMs:proc.shieldMs,clock:e.playerShieldLayers.clock,hp:e.heroHp});if(r)e.playerShieldLayers=r.state;mirrorLayers(e);}
  emitCombatDisplayRecovery(e,beforeRecovery,{sourceId:proc.itemId,skillId:proc.kind});return {stop:cleared(e,'legendary')};
 };
 const advanceLegends=options=>advanceLegendaryCombat(s,{...options,alive:e.heroHp>0,hasTargets:e.enemies.some(u=>u.hp>0),resolve:legendaryProc});
 advanceLegends({combatDeltaMs:ctx.combatDeltaMs??1100});if(e.done)return logs;

 const heroDied=()=>{if(e.heroHp>0)return false;const revived=tryNirvana(e.affixState,{battleId:e.id,hasNirvana:!!st.specials.nirvana,hp:e.heroHp,maxHp:st.hp});if(revived){e.affixState=revived.state;if(revived.revived){const recovered=revived.hp-e.heroHp;e.heroHp=revived.hp;emitCombatDisplay(e,{kind:'heal',skillId:'nirvana',hpDelta:recovered});logs.push('涅槃 · 满血复生');return false;}}s.momentum=0;end(e,false,null);return true;};
 if(!ctx.basicOnly)for(const k in e.cd)e.cd[k]=Math.max(0,e.cd[k]-1);
 if(!ctx.basicOnly)for(const k in e.treeSkillCooldowns??{})e.treeSkillCooldowns[k]=Math.max(0,e.treeSkillCooldowns[k]-1);
 for(const u of e.enemies){u.control=advanceControlClock(u.control,now);u.cd=Object.fromEntries(Object.entries(u.control.cooldowns).map(([k,v])=>[k,Math.max(0,Math.ceil((v-now)/1100))]));}
 const treePhase=ctx.treeSkills&&!ctx.basicOnly?runTreePlayerPhase(s,e,{...ctx,treeTimersPrepared:true,onDamageAction:()=>advanceLegends({damageAction:true}),onHeroDeath:heroDied},logs):null;
 if(e.done)return logs;
 if(treePhase?.stats)Object.assign(st,treePhase.stats);refreshStats();
 if(!treePhase?.acted){
 let target=e.enemies.find(u=>u.id===e.targetId);const charging=()=>!!target.control.preparing||(!target.typedProfile&&e.round>=target.nextHeavy);
 const usable=k=>!(k==='warcry'&&e.warcry>0)&&!(k==='ironcoat'&&e.ironcoat>0)&&!(k==='blunt'&&target.blunt>0)&&!(k==='scorch'&&target.scorch>0)&&!(k==='guard'&&e.guard>0)&&!(k==='barrier'&&(e.barrier>0||e.barrierShield>0))&&!(k==='mend'&&e.heroHp>=st.hp)&&!(k==='cleanse'&&!e.heroBurn&&!e.weakness&&!(e.typedDots?.length))&&!(k==='delay'&&(!charging()||target.heavyDelayed));
 const k=(ctx.treeSkills||ctx.basicOnly?null:s.skills.find((key,i)=>key!==null&&SKILLS[key]&&skillUnlocked(s,key)&&!e.cd[key]&&usable(key)&&(s.conditions[i]!=='low'||e.heroHp<st.hp*.6)&&(s.conditions[i]!=='charge'||charging())&&(s.conditions[i]!=='burn'||target.burn>0)))??null,fixture=!ctx.basicOnly&&e.developmentFixture===true?e.fixtureAction:null;if(!ctx.basicOnly)e.fixtureAction=null;
 if(k&&!fixture)e.cd[k]=SKILLS[k].cd;
 const executeCast=(extra=false)=>{if(k||fixture)e.activeCastCount++;
 target=e.enemies.find(u=>u.id===e.targetId&&u.hp>0)??e.enemies.find(u=>u.hp>0);if(!target)return true;
 const castId=e.id+':'+e.round+(extra?':extra':''); emitCombatDisplay(e,{kind:'cast',castId,skillId:fixture?'developer-fixture':k??'basic',targetId:target.id,outcome:'none'});e.lastCast={id:castId,skillId:fixture?'developer-fixture':k??'basic',scope:fixture?.scope??(['warcry','ironcoat','barrier','mend','cleanse'].includes(k)?'self':'single'),hits:[]};const utility=['warcry','ironcoat','delay','barrier','mend','cleanse'].includes(k)&&!fixture;
 if(utility){const beforeUtility=combatDisplayHealthSnapshot(e);
  if(k==='warcry')e.warcry=3+(st.count.anvil>=2?1:0);
  if(k==='ironcoat')e.ironcoat=3+(st.count.guard>=2?1:0);
  if(k==='delay'){if(target.control.preparing)target.control.preparing.completesAt+=1100;else target.nextHeavy++;target.heavyDelayed=true;}
  if(k==='barrier'){e.barrier=3;e.barrierShield=Math.floor(st.hp*.2)+st.shieldBonus;if(e.playerShieldLayers){const r=grantPlayerShieldLayer(e.playerShieldLayers,{source:'barrier',capacity:e.barrierShield,durationMs:3300,clock:e.playerShieldLayers.clock,hp:e.heroHp});if(r)e.playerShieldLayers=r.state;}if(st.count.guard>=4)e.guard=Math.max(e.guard,2);}
  if(k==='mend'){const heal=Math.min(st.hp-e.heroHp,Math.floor(st.hp*.35),Math.min(Math.floor(st.hp*.2),Math.round(st.atk*.7+15))+st.healingBonus);e.heroHp+=heal;emitCombatDisplay(e,{kind:'heal',skillId:'mend',hpDelta:heal});logs.push('回炉息 · 恢复 '+heal);}
  if(k==='cleanse'){e.heroBurn=0;e.heroBurnPower=0;e.weakness=0;e.typedDots=[];}
  if(k!=='mend'){emitCombatDisplayRecovery(e,beforeUtility,{castId,skillId:k});logs.push(SKILLS[k].name+' · 生效');}
 }else{
  const targets=fixture?.scope==='all'?e.enemies.filter(u=>u.hp>0):[target];let countered=false,counterReaction=null;const lifestealHits=[];
  for(const u of targets){if(u.hp<=0)continue;const hitIndex=0,hitId=castId+':'+hitIndex+':'+u.id,hit=Math.random()<st.hit,hitRecord={id:hitId,hitIndex,targetId:u.id,hit,hpBefore:u.hp,hpAfter:u.hp,actualHpLost:0,killProcHpLost:0};e.lastCast.hits.push(hitRecord);if(!hit){emitCombatDisplay(e,{castId,hitId,skillId:k??'basic',targetId:u.id,outcome:'miss',segmentIndex:hitIndex});logs.push(u.name+' · 未命中');continue;}
   if(fixture?.kind==='stun'){
    const c=fixture.control,r=applyStun(u.control,{...c,now,baseDuration:fixture.amount,reduction:u.profile.controlReduction??0});if(r){u.control=r.state;logs.push(u.name+' · 测试眩晕 '+r.duration+'ms');}continue;
   }
   let raw=fixture?fixture.amount:st.atk*(e.warcry>0?1.25:1)*(e.weakness>0?.8:1);
   if(!fixture){
    if(k==='break'){raw*=1.2*(st.count.anvil>=2?1.25:1);u.broken=6;}
    if(k==='heavy')raw*=2.2*(u.broken?1.25:1)*(st.count.anvil>=4?1.35:1);
    if(k==='mark'){raw*=.9;u.burn=5;}
    if(k==='ignite')raw*=(u.burn?2.4:1.6)*(st.count.rune>=4?1.35:1);
    if(k==='guard'){raw*=st.count.guard>=2?1.3:1;e.guard=3;}
    if(k==='interrupt'){raw*=1.15;const r=interruptPreparing(u.control,{now,briefStop:u.profile.interruptStop??1100});if(r){u.control=r.state;if(r.interrupted)logs.push(u.name+' · 读条被打断');}if(!u.typedProfile&&e.round>=u.nextHeavy&&!u.control.preparing)u.stun=1;}
    if(k==='blunt'){raw*=.6;u.blunt=3;}
    if(k==='scorch'){raw*=.5;u.scorch=4+(st.count.rune>=2?1:0);}
    if((k==='mark'||k==='ignite')&&u.scorch>0)raw*=1.25;
    if(!k&&ctx.treeSkills&&['axe','hammer'].includes(ctx.treeSkills.weaponType))raw*=1.1;
    if(!k&&s.momentum){raw*=1.35;s.momentum=0;logs.push('余势：普攻增强');}
   }
   const crit=Math.random()<st.crit,fire=!fixture&&(k==='mark'||k==='ignite'),base=raw*(crit?st.critDamage:1)*treeDamage(passives,fire?'fire':'physical',k?'skill':'basic'),dealt=fire?resolveElementDamage(base,'fire',st.elementAttack.fire,u.elementResistance.fire,u.elementTags):physical(base,Math.max(0,u.armor*(u.broken?.75:1)-st.penetration));
   const hpBefore=u.hp,hpLost=hitEnemy(u,dealt,e,{castId,hitId,skillId:k??'basic',crit,element:fire?'fire':'physical',segmentIndex:hitIndex});Object.assign(hitRecord,{hpBefore,hpAfter:u.hp,actualHpLost:hpLost});lifestealHits.push({hitId,hpBefore,hpAfter:u.hp,source:k||fixture?'active':'basic'});
   const execute=tryReaperHit(e.affixState,{battleId:e.id,castId,hitIndex,targetId:u.id,hit:true,targetHp:u.hp,hasReaper:!!st.specials.reaper});if(execute){e.affixState=execute.state;if(execute.triggered){hitRecord.killProcHpLost=u.hp;emitCombatDisplay(e,{castId,hitId:hitId+':reaper',skillId:'reaper',targetId:u.id,hpDelta:-u.hp,element:null});u.hp=0;logs.push('死神 → '+u.name);}}
   logs.push((fixture?'开发测试范围攻击':k?SKILLS[k].name:'普通攻击')+' → '+u.name+' · '+Number(dealt.toFixed(1))+(fire?'（火）':''));
   if(u.hp===0&&st.specials.momentum)s.momentum=1;
   if(!countered){counterReaction=typedEnemyReaction(u,hpLost,{...st,ironcoatActive:e.ironcoat>0},now,resolveElementDamage);if(counterReaction)countered=true;}
   if(u.hp>0&&hpLost>0&&u.profile.counterRatio>0&&!countered){countered=true;counterReaction={sourceId:u.id,name:u.name,amount:hpLost*u.profile.counterRatio};}
  }
  if(counterReaction){const loss=hitHero(e,counterReaction.amount,{kind:'counter',sourceId:counterReaction.sourceId,element:counterReaction.element??'physical'});logs.push(counterReaction.name+' · 反伤 '+Number(loss.toFixed(1)));}
  if(e.heroHp>0){const recovery=calculateLifesteal({rating:st.lifesteal??0,maxHp:st.hp,currentHp:e.heroHp,hits:lifestealHits},ctx.lifestealConfig);if(recovery?.heal>0){const received=treeHeal(passives,e,recovery.heal,st.hp);e.heroHp+=received;emitCombatDisplay(e,{kind:'heal',skillId:'lifesteal',hpDelta:received});e.lastCast.lifesteal=received;logs.push('吸血 · 恢复 '+Number(recovery.heal.toFixed(2)));}}
  if(heroDied())return true;
  advanceLegends({damageAction:true});if(e.done)return true;
  if(cleared(e,'active'))return true;
 }
 return false;};
 const deferBasic=!ctx.basicOnly&&!k&&!fixture&&(e.nextBasicSlow??1)>1;
 if(deferBasic){e.pendingBasicDelayMs=Math.round(1100*(e.nextBasicSlow-1));e.pendingBasicAt=now+e.pendingBasicDelayMs;delete e.nextBasicSlow;}
 else if(executeCast())return logs;
 if(k&&!fixture&&st.specials.multicast&&tryMulticast({source:'active',triggered:false,hasLivingEnemies:e.enemies.some(u=>u.hp>0)})?.triggered){logs.push('多重施法 · '+SKILLS[k].name);if(executeCast(true))return logs;}
 } // legacy/basic player branch; actual enemy phase is shared with the tree consumer.
 if(!ctx.basicOnly){
 // Each enemy owns its DOT/debuff state. Player self-DOT retains its saved source and bypasses shields.
 for(const u of e.enemies.filter(u=>u.hp>0))if(u.burn>0){const dot=resolveElementDamage(st.atk*(e.warcry>0?1.25:1)*(e.weakness>0?.8:1)*.32*(st.count.rune>=2?1.3:1)*(u.scorch>0?1.25:1)*treeDamage(passives,'fire','dot'),'fire',st.elementAttack.fire,u.elementResistance.fire,u.elementTags);hitEnemy(u,dot,e,{kind:'dot',skillId:'mark',element:'fire'});u.burn--;logs.push(u.name+' · 炉火灼烧 '+Number(dot.toFixed(1)));}
 if(cleared(e,'burn'))return logs;
 if(e.heroBurn>0){const dot=resolveElementDamage(e.heroBurnPower,'fire',0,st.elementResistance.fire,[]);const beforeDot=e.heroHp;e.heroHp-=dot;emitCombatDisplay(e,{kind:'dot',sourceId:'enemy-burn',targetId:'hero',element:'fire',hpDelta:-Math.min(beforeDot,dot)});e.heroBurn--;turn.burnTicked=true;logs.push('灼烧侵蚀 · -'+Number(dot.toFixed(1)));if(heroDied())return logs;}
 }
 tickDwarfDots(e,now,dot=>{const amount=dot.type==='physical'?physical(dot.raw,st.armor):resolveElementDamage(dot.raw,dot.type,0,st.elementResistance[dot.type],[]);const beforeDot=e.heroHp;e.heroHp-=amount;emitCombatDisplay(e,{kind:'dot',sourceId:dot.key,targetId:'hero',element:dot.type,hpDelta:-Math.min(beforeDot,amount)});logs.push('持续侵蚀 · -'+Number(amount.toFixed(1)));});if(heroDied())return logs;
 if(ctx.basicOnly){if(!cleared(e,'active'))syncMultiTarget(e);return logs;}
 const treeCounterReady=()=>!!ctx.treeSkills&&e.treeEffects?.hero.sources.some(x=>x.counterEligible===true&&x.endAt>e.treeEffects.clock)&&((e.playerShieldLayers?.layers.reduce((n,l)=>n+l.remaining,0)??((e.shield??0)+(e.barrierShield??0)))>0);
 const treeCounter=(u,ready,hpLoss)=>{if(!ready||hpLoss<=0||e.heroHp<=0||u.hp<=0)return;const coefficient=ctx.treeSkills.counterCoefficient;if(!Number.isFinite(coefficient)||coefficient<0)throw Error('Missing iron vigil counter coefficient');refreshStats();const damage=physical(st.atk*coefficient*treeDamage(passives,'physical','counter'),Math.max(0,u.armor-st.penetration));hitEnemy(u,damage,e,{kind:'counter',skillId:'iron_vigil'});logs.push('铁幕反击 → '+u.name+' · '+damage);};
 const acting=[...e.enemies];
 for(const u of acting){if(u.hp<=0)continue;refreshStats();u.round++;const enemyCastId=e.id+':enemy:'+u.id+':'+u.round;let multiplier=1,perform=true;
  const treeEnemy=ctx.treeSkills&&e.treeEffects?skillTreeEnemyAttributes(u,e.treeEffects,{hasStatus:(id,status)=>e.treeEffects.enemies[id]?.sources.some(x=>x.status===status&&x.endAt>e.treeEffects.clock)}):null,enemyAtk=treeEnemy?.atk??u.atk;
  const avoidRating=(treeEnemy?.hitDownRating??0)+(st.dodgeRating??0),enemyHitChance=1-(ctx.treeSkills?.attributeConfig?.dodgeCap??0)*avoidRating/(100+avoidRating);
  const missed=()=>avoidRating>0&&Math.random()>=enemyHitChance;
  if(u.typedProfile){
   const action=nextDwarfAction(u,now);if(!action)continue;emitCombatDisplay(e,{kind:'cast',sourceId:u.id,targetId:'hero',skillId:action.id,castId:enemyCastId,outcome:'none'});let direct=false,actionHpLoss=0;
   for(const effect of action.effects){
    if(action.requiresHitForEffects&&effect.type!=='damage'&&effect.type!=='shield'&&!direct)continue;
    if(effect.type==='shield'){const beforeShield=u.shield;u.shield=u.max*effect.fraction;emitCombatDisplay(e,{kind:'shield',castId:enemyCastId,sourceId:u.id,targetId:u.id,skillId:action.id,shieldDelta:Math.max(0,u.shield-beforeShield)});u.shieldUntil=now+effect.seconds*1000;logs.push(u.name+' · '+action.name);}
    if(effect.type==='reflect'){u.timedReflect={skillId:action.id,endsAt:now+effect.seconds*1000,charges:effect.charges};logs.push(u.name+' · '+action.name);}
    if(effect.type==='next_basic_slow'){e.nextBasicSlow=Math.max(e.nextBasicSlow??1,effect.multiplier);logs.push(u.name+' · 下一次普攻减速');}
    if(effect.type==='dot')applyDwarfDot(e,u,action,passives?{...effect,seconds:passiveNegativeDuration(passives,effect.seconds*1000)/1000}:effect,now);
    if(effect.type==='damage'){refreshStats();if(missed()){emitCombatDisplay(e,{castId:enemyCastId,sourceId:u.id,targetId:'hero',outcome:'miss'});logs.push(u.name+' · 未命中');continue;}direct=true;const raw=(effect.powerBasis==='atk'?enemyAtk:u[effect.powerBasis])*(u.blunt>0?.8:1)*effect.coefficient;
     let hurt=(effect.damageType==='physical'?physical(raw,st.armor*(e.ironcoat>0?1.4:1)):resolveElementDamage(raw,effect.damageType,0,st.elementResistance[effect.damageType],[]))*(e.guard>0?.6:1);
     if(st.block>0&&Math.random()<st.block)hurt*=.7;const counterReady=treeCounterReady(),loss=hitHero(e,hurt,{castId:enemyCastId,sourceId:u.id,skillId:typeof action!=='undefined'?action.id:'basic',element:typeof effect!=='undefined'?effect.damageType:'physical'});actionHpLoss+=loss;treeCounter(u,counterReady,loss);logs.push(u.name+' · '+action.name+' -'+Number(loss.toFixed(1)));if(heroDied())return logs;if(u.hp<=0)break;
    }
   }
   const drain=action.effects.find(f=>f.type==='lifesteal')??DWARF_MONSTERS[u.definitionId]?.trait;if(drain?.type==='lifesteal'&&u.hp>0&&actionHpLoss>0){const heal=Math.max(0,Math.min(u.max-u.hp,actionHpLoss*drain.fraction,u.max*drain.perActionCap,u.max*drain.encounterCap-(u.lifestealHealed??0)));u.hp+=heal;u.lifestealHealed=(u.lifestealHealed??0)+heal;emitCombatDisplay(e,{kind:'heal',castId:enemyCastId,sourceId:u.id,targetId:u.id,skillId:'lifesteal',hpDelta:heal});}
   if(direct&&e.heroHp>0&&e.guard>0){const counter=physical(st.atk*(e.warcry>0?1.25:1)*(e.weakness>0?.8:1)*(st.count.guard>=4?1:.6)*treeDamage(passives,'physical','counter'),Math.max(0,u.armor-st.penetration));hitEnemy(u,counter,e,{kind:'counter',skillId:'guard'});logs.push('坚守反击 → '+u.name+' · '+counter);}
   continue;
  }
  if(u.stun){u.stun=0;perform=false;logs.push(u.name+' · 蓄力被打断');}
  else if(!controlAllowsAction(u.control,now))perform=false;
  else if(u.profile.castDuration>0){
   if(u.control.preparing){const complete=claimCompletedCast(u.control,now);if(complete){u.control=complete.state;u.heavyDelayed=false;multiplier=u.profile.castMultiplier;if(u.profile.summonCount){for(let i=0;i<u.profile.summonCount;i++){const added=makeSummon(u,++e.summonSerial);added.origin='summoned';e.enemies.push(added);}logs.push(u.name+' · 召唤随从');perform=false;}}else perform=false;}
   else if((u.control.cooldowns['fixture-cast']??0)<=now){u.control=beginPreparing(u.control,{skillId:'fixture-cast',duration:u.profile.castDuration,cooldownDuration:u.profile.castCooldown,now});logs.push(u.name+' · 开始读条');perform=false;}
  }else if(e.round>=u.nextHeavy){multiplier=2;u.nextHeavy=e.round+4;u.heavyDelayed=false;}
  if(perform){
   emitCombatDisplay(e,{kind:'cast',sourceId:u.id,targetId:'hero',skillId:'basic',castId:enemyCastId,outcome:'none'});
   if(missed()){emitCombatDisplay(e,{castId:enemyCastId,sourceId:u.id,targetId:'hero',outcome:'miss'});logs.push(u.name+' · 未命中');continue;}
   let hurt=Math.max(1,Math.round(physical(enemyAtk*(u.blunt>0?.8:1)*multiplier,st.armor*(e.ironcoat>0?1.4:1))*(e.guard>0?.6:1)));
   if(st.block>0&&Math.random()<st.block)hurt=Math.max(1,Math.round(hurt*.7));
   const counterReady=treeCounterReady(),loss=hitHero(e,hurt,{castId:enemyCastId,sourceId:u.id,skillId:typeof action!=='undefined'?action.id:'basic',element:typeof effect!=='undefined'?effect.damageType:'physical'});treeCounter(u,counterReady,loss);logs.push(u.name+' · 攻击 -'+Number(loss.toFixed(1)));
   if(u.profile.lifestealRatio>0){const heal=Math.min(u.max-u.hp,loss*u.profile.lifestealRatio,u.profile.lifestealCap??0);u.hp+=heal;emitCombatDisplay(e,{kind:'heal',sourceId:u.id,targetId:u.id,skillId:'lifesteal',hpDelta:heal});}
   if(heroDied())return logs;
   if(e.heroHp>0&&e.guard>0){const counter=physical(st.atk*(e.warcry>0?1.25:1)*(e.weakness>0?.8:1)*(st.count.guard>=4?1:.6)*treeDamage(passives,'physical','counter'),Math.max(0,u.armor-st.penetration));hitEnemy(u,counter,e,{kind:'counter',skillId:'guard'});logs.push('坚守反击 → '+u.name+' · '+counter);}
   if(u.location===1&&u.round%5===0){e.heroBurn=Math.max(1,Math.ceil((3-st.resolveReduction)*(passives?passiveNegativeDuration(passives,1):1)));e.heroBurnPower=Math.max(2,Math.round(u.atk*.05));}
   if(u.location===2&&u.round%6===0)e.weakness=Math.max(1,Math.ceil((2-st.resolveReduction)*(passives?passiveNegativeDuration(passives,1):1)))+1;
  }
  if(heroDied())return logs;
 }
 for(const u of e.enemies)for(const key of ['broken','blunt','scorch'])u[key]=Math.max(0,u[key]-1);
 if(!cleared(e,'counter'))syncMultiTarget(e);return logs;
}

// Only combat time is suspended. Wall-clock potions/rest remain outside this adapter.
export function pauseMulti(s,paused,now){
 const e=s.activeEncounter;if(e?.multiVersion!==1||e.done||typeof paused!=='boolean'||!Number.isSafeInteger(now)||now<0||now>1e15)return false;
 const clock=Math.max(now,s.lastHealthClock??now,...e.enemies.map(u=>u.control.clock));
 if(paused){if(e.pauseAt!==undefined)return false;e.pauseAt=clock;e.pauseRemainingAction=Math.max(0,Math.min(1100,(s.nextActionAt??clock)-clock));s.running=false;return true;}
 if(e.pauseAt===undefined)return false;const elapsed=Math.max(0,clock-e.pauseAt),controls=e.enemies.map(u=>{
  const c=structuredClone(u.control);c.clock+=elapsed;
  for(const key of ['stunUntil','interruptUntil'])if(c[key]>0)c[key]+=elapsed;
  if(c.lastStunEnd!==null)c.lastStunEnd+=elapsed;
  for(const k of Object.keys(c.cooldowns))if(c.cooldowns[k]>0)c.cooldowns[k]+=elapsed;
  if(c.preparing){c.preparing.startedAt+=elapsed;c.preparing.completesAt+=elapsed;}
  return c;
 });if(!controls.every(validControl))return false;
 e.enemies.forEach((u,i)=>{u.control=controls[i];if(u.typedProfile){for(const k of ['nextBasicAt','shieldUntil','reflectReadyAt'])if(u[k]>0)u[k]+=elapsed;if(u.timedReflect)u.timedReflect.endsAt+=elapsed;}});for(const dot of e.typedDots??[]){dot.nextAt+=elapsed;dot.endAt+=elapsed;}for(const key of ['pendingBasicAt','nextRegularAt','lastCombatEventAt'])if(e[key]!==undefined)e[key]+=elapsed;s.nextActionAt=clock+e.pauseRemainingAction;delete e.pauseAt;delete e.pauseRemainingAction;s.running=true;return true;
}

// New-tree production host. It shares this module's actual mitigation/HP/shield helpers.
// The authoritative tree selector will call it once configuration is activated. No save field
// enables this entry; numeric/configuration and effect hooks must be supplied explicitly.
// A timed reflect is consumed only by a living enemy taking actual HP damage.
// It is one reaction within the player's cast, not an active attack/proc chain.
function typedEnemyReaction(u,hpLost,st,now,resolveElementDamage){
 if(!u.typedProfile||u.hp<=0||hpLost<=0)return null;
 const d=DWARF_MONSTERS[u.definitionId],timed=u.timedReflect;
 if(timed&&timed.endsAt<=now)delete u.timedReflect;
 if(u.timedReflect?.charges>0){
  const fx=d?.skills.find(k=>k.id===timed.skillId)?.effects.find(x=>x.type==='reflect');
  if(fx){timed.charges--;const raw=u[fx.powerBasis]*fx.coefficient,amount=fx.damageType==='physical'?physical(raw,st.armor*(st.ironcoatActive?1.4:1)):resolveElementDamage(raw,fx.damageType,0,st.elementResistance[fx.damageType],[]);return {sourceId:u.id,name:u.name,amount,element:fx.damageType};}
 }
 const trait=d?.trait;if(trait?.type==='reflect'&&now>=u.reflectReadyAt&&Math.random()<trait.chance){u.reflectReadyAt=now+trait.cooldownMs;return {sourceId:u.id,name:u.name,amount:physical(u.atk*trait.coefficient,st.armor*(st.ironcoatActive?1.4:1)),element:'physical'};}
 return null;
}

export function executeTreePlayerAction(s,e,ctx){
 const {stats,resolveElementDamage,now,input,effects,onDamageAction,onHeroDeath}=ctx??{};
 if(!e||e.done||!Array.isArray(e.enemies)||typeof stats!=='function'||typeof resolveElementDamage!=='function'||!Number.isFinite(now)||!effects||typeof effects.apply!=='function'||typeof onDamageAction!=='function'||typeof onHeroDeath!=='function')return null;
 const baseStats=stats(s),passives=treePassiveContext(ctx),st=treePassiveStats(e.treeEffects?skillTreeHeroStats(baseStats,e.treeEffects,ctx.attributeConfig):baseStats,e,passives),logs=[],byId=id=>e.enemies.find(u=>u.id===id);if(!st)return null;
 const build=(castId)=>({...input,castId,selectedTargetId:e.enemies.some(u=>u.id===e.targetId&&u.hp>0)?e.targetId:e.enemies.find(u=>u.hp>0)?.id,targets:e.enemies.map(u=>({id:u.id,alive:u.hp>0,burning:u.burn>0||effects.has?.(u.id,'burn')===true,bleeding:effects.has?.(u.id,'bleed')===true,armorBroken:u.broken>0||effects.get?.(u.id,'armorDown')>0})),hero:{hp:e.heroHp,maxHp:st.hp,defense:st.armor,shield:e.playerShieldLayers?.layers.reduce((n,l)=>n+l.remaining,0)??((e.shield??0)+(e.barrierShield??0)+(e.legendaryShield??0)),activeBuffIds:effects.activeBuffIds?.()??[],eligibleDebuffIds:effects.eligibleDebuffIds?.()??[]}});
 const original=build(input?.castId),initialPlan=planTreeSkill(original);if(!initialPlan)return null;
 if(ctx.setConfig&&initialPlan.actions.some(a=>a.kind==='hit'&&!resolveSetLinkedHit({...a,baseDamage:0,conditionalBonus:0},st.count,ctx.setConfig)))return null;
 let counter=null,lifestealHits=[];
 const host={
  heroAlive:()=>e.heroHp>0,isAlive:id=>(byId(id)?.hp??0)>0,hasLivingTargets:()=>e.enemies.some(u=>u.hp>0),random:()=>Math.random(),
  consumeCooldown:({skillId,cooldownMs})=>{if((e.treeSkillCooldowns?.[skillId]??0)>0||cooldownMs>110000)return false;e.treeSkillCooldowns??={};e.treeSkillCooldowns[skillId]=Math.ceil(cooldownMs/1100);return true;},
  onActiveCast:event=>{emitCombatDisplay(e,{kind:'cast',castId:event.castId,skillId:event.skillId,targetId:e.targetId??'hero',outcome:'none'});counter=null;lifestealHits=[];e.activeCastCount++;if(planTreeSkill(build(event.castId)).actions.every(a=>a.kind!=='hit'))logs.push('施放 · '+(skillTreeNode(event.skillId)?.name??event.skillId));e.lastCast={recordVersion:2,id:event.castId,skillId:event.skillId,scope:planTreeSkill(build(event.castId)).scope,hits:[]};},
  applyEffect:(target,effect,event)=>effects.apply(target,effect,event),
  resolveEffectHit:action=>{const u=byId(action.targetId),hit=Math.random()<st.hit,record={id:action.hitId,targetId:u.id,hitIndex:action.hitIndex,hit,hpBefore:u.hp,hpAfter:u.hp,actualHpLost:0,killProcHpLost:0};e.lastCast.hits.push(record);emitCombatDisplay(e,{castId:action.castId??e.lastCast.id,hitId:action.hitId,targetId:u.id,skillId:action.skillId??e.lastCast.skillId,outcome:hit?'hit':'miss',segmentIndex:action.hitIndex??0});if(!hit)logs.push(u.name+' · 未命中');return record;},
  applyPoison:(target,descriptor)=>{const clock=e.treeCombatClock??e.treeEffects?.clock??0;e.treePoison??={};let ledger=e.treePoison[target]??createSkillPoison(target,descriptor.timing,clock);if(ledger.clock!==clock){const advanced=advanceSkillPoison(ledger,{enemyId:target,combatClock:clock,targetMaxHp:byId(target).max});if(!advanced||advanced.ticks.length)throw Error('Unsettled poison before application');ledger=advanced.state;}const next=applySkillPoison(ledger,{enemyId:target,sourceId:descriptor.sourceId,combatClock:clock});if(!next)throw Error('Invalid poison application');e.treePoison[target]=next;logs.push(byId(target).name+' · 中毒 '+next.layers.length+'层');},
  applyArmorBreak:effect=>effects.applyArmorBreak?.(effect),
  consumeStatus:(target,status,event)=>effects.consume?.(target,status,event),
  interrupt:(target,effect)=>{const u=byId(target),r=interruptPreparing(u.control,{now,briefStop:u.profile.interruptStop??1100});if(!r)return false;u.control=r.state;return r.interrupted===true;},
  cleanse:(ids,count,effect)=>effects.cleanse?.(ids,count,effect)??0,
  resolveHit:(action,event)=>{
   const u=byId(action.targetId),hit=Math.random()<st.hit,record={id:action.hitId,targetId:u.id,hitIndex:action.hitIndex,hit,hpBefore:u.hp,hpAfter:u.hp,actualHpLost:0,killProcHpLost:0};e.lastCast.hits.push(record);
   if(!hit){emitCombatDisplay(e,{castId:event.castId,hitId:action.hitId,skillId:event.skillId,targetId:u.id,outcome:'miss',segmentIndex:action.hitIndex,element:action.damageType});logs.push(u.name+' · 未命中');return record;}
   action.beforeMitigation?.();
   const power=st.atk*(e.warcry>0?1.25:1)*(e.weakness>0?.8:1),baseDamage=power*action.baseCoefficient+(action.flatDefenseContribution??0),conditionalBonus=power*action.conditionalCoefficient;
   const linked=ctx.setConfig?resolveSetLinkedHit({...action,baseDamage,conditionalBonus},st.count,ctx.setConfig):{totalDamage:baseDamage+conditionalBonus};if(!linked)throw Error('Incomplete set tuning');
   const adjusted=e.treeEffects?skillTreeEnemyAttributes(u,e.treeEffects,{hasStatus:effects.has}):null,enemyArmor=adjusted?.armor??u.armor,enemyResistance=adjusted?.elementResistance??u.elementResistance;
   const crit=Math.random()<st.crit,raw=linked.totalDamage*(crit?st.critDamage:1)*treeDamage(passives,action.damageType),dealt=action.damageType==='physical'?physical(raw,Math.max(0,enemyArmor*(u.broken?.75:1)-st.penetration)):resolveElementDamage(raw,action.damageType,st.elementAttack[action.damageType],enemyResistance[action.damageType],u.elementTags);
   const hpBefore=u.hp,hpLost=hitEnemy(u,dealt,e,{castId:event.castId,hitId:action.hitId,skillId:event.skillId,crit,element:action.damageType,segmentIndex:action.hitIndex});Object.assign(record,{hpBefore,hpAfter:u.hp,actualHpLost:hpLost});lifestealHits.push({hitId:action.hitId,hpBefore,hpAfter:u.hp,source:'active'});
   const execute=tryReaperHit(e.affixState,{battleId:e.id,castId:event.castId,hitIndex:action.hitIndex,targetId:u.id,hit:true,targetHp:u.hp,hasReaper:!!st.specials.reaper});if(execute){e.affixState=execute.state;if(execute.triggered){record.killProcHpLost=u.hp;emitCombatDisplay(e,{castId:event.castId,hitId:action.hitId+':reaper',skillId:'reaper',targetId:u.id,hpDelta:-u.hp,element:null});u.hp=0;logs.push('死神 → '+u.name);}}
   logs.push((skillTreeNode(event.skillId)?.name??event.skillId)+' → '+u.name+' · '+Number(dealt.toFixed(1)));if(u.hp===0&&st.specials.momentum)s.momentum=1;
   if(!counter)counter=typedEnemyReaction(u,hpLost,{...st,ironcoatActive:e.ironcoat>0},now,resolveElementDamage);
   if(!counter&&u.hp>0&&hpLost>0&&u.profile.counterRatio>0)counter={sourceId:u.id,name:u.name,amount:hpLost*u.profile.counterRatio};
   return record;
  },
  onCastEnd:event=>{
   if(counter&&(byId(counter.sourceId)?.hp??0)>0){const loss=hitHero(e,counter.amount,{kind:'counter',sourceId:counter.sourceId,element:counter.element??'physical'});logs.push(counter.name+' · 反伤 '+Number(loss.toFixed(1)));}
   if(e.heroHp>0){const recovery=calculateLifesteal({rating:st.lifesteal??0,maxHp:st.hp,currentHp:e.heroHp,hits:lifestealHits},ctx.lifestealConfig);if(recovery?.heal>0){const received=treeHeal(passives,e,recovery.heal,st.hp);e.heroHp+=received;emitCombatDisplay(e,{kind:'heal',skillId:'lifesteal',hpDelta:received});e.lastCast.lifesteal=received;}}
   if(e.heroHp<=0){onHeroDeath();if(e.heroHp<=0)return;}
   if(event.damageActionCount)onDamageAction(event);
   if(!e.done)cleared(e,'active');if(!e.done)syncMultiTarget(e);
  }
 };
 // Require real effect support rather than silently dropping an approved effect.
 const first=planTreeSkill(original);if(first.actions.some(a=>a.armorBreak)&&typeof effects.applyArmorBreak!=='function'||first.actions.some(a=>a.consumeStatusOnHit)&&typeof effects.consume!=='function'||first.actions.some(a=>a.effects.some(x=>x.type==='cleanse'))&&typeof effects.cleanse!=='function')return null;
 e.affixState??=createBattleAffixState(e.id);
 const result=executeTreeSkillTurn(original,host,{shouldMulticast:()=>!!st.specials.multicast&&tryMulticast({source:'active',triggered:false,hasLivingEnemies:host.hasLivingTargets()})?.triggered===true,rebuildInput:()=>build(original.castId+':extra')});
 return result?{...result,logs}:null;
}

// Approved percentage poison: no element, crit, lifesteal, execute or active-cast hooks.
// The scheduled ledger determines tick times; now is the corresponding encounter timestamp.
export function applyTreePoisonTick(e,tick,{now}={}){
 if(!e||e.done||e.heroHp<=0||!tick||typeof tick.tickId!=='string'||!tick.tickId||tick.tickId.length>1000||!Number.isSafeInteger(tick.at)||tick.at<0||tick.at>1e15||!Number.isFinite(now)||now<0||!Number.isInteger(tick.layers)||tick.layers<1||tick.layers>5||tick.damageKind!=='percent-max-hp'||tick.element!==null||tick.canCrit!==false||tick.reaperEligible!==false||tick.activeCastCount!==0)return null;
 const u=e.enemies.find(u=>u.id===tick.enemyId&&u.hp>0);if(!u)return null;
 const prior=e.treePoisonReceipts?.[u.id];if(prior&&tick.at<=prior.at)return null;
 const damage=u.max*.02*tick.layers;if(!Number.isFinite(damage)||Math.abs(damage-tick.damage)>1e-8*Math.max(1,damage))return null;
 expireDwarfShield(u,now);const beforeHp=u.hp,beforeShield=u.shield;hitEnemy(u,damage,e,{kind:'poison',hitId:tick.tickId,skillId:'scatter_ash',element:null,combatAt:tick.at});
 e.treePoisonReceipts??={};e.treePoisonReceipts[u.id]={tickId:tick.tickId,at:tick.at};
 if(!cleared(e,'poison'))syncMultiTarget(e);
 return {enemyId:u.id,damage,shieldLost:beforeShield-u.shield,hpLost:beforeHp-u.hp,killed:u.hp===0};
}

function advanceTreePoisons(e,nextClock,now,logs){
 const due=[];for(const [id,ledger]of Object.entries(e.treePoison??{})){const u=e.enemies.find(u=>u.id===id);if(!u||u.hp<=0){delete e.treePoison[id];continue;}const result=advanceSkillPoison(ledger,{enemyId:id,combatClock:nextClock,targetMaxHp:u.max});if(!result||!result.caughtUp)throw Error('Poison clock incomplete');e.treePoison[id]=result.state;due.push(...result.ticks);}
 due.sort((a,b)=>a.at-b.at||a.enemyId.localeCompare(b.enemyId));for(const tick of due){if(e.done)break;const result=applyTreePoisonTick(e,tick,{now:now-(nextClock-tick.at)});if(result)logs.push(e.enemies.find(u=>u.id===tick.enemyId).name+' · 中毒 '+Number(result.damage.toFixed(1)));}
}
function runTreePlayerPhase(s,e,ctx,logs){
 const rules=ctx.treeSkills;if(!rules||!Array.isArray(rules.active)||rules.active.length!==4||!Array.isArray(rules.conditions)||rules.conditions.length!==4||!Array.isArray(rules.unlocked)||!rules.attributeConfig||!rules.configs)throw Error('Incomplete tree context');
 const passives=treePassiveContext(ctx),base=ctx.stats(s),oldClock=e.treeEffects?.clock??e.treeCombatClock??0,nextClock=oldClock+(ctx.treeTimersPrepared?0:(ctx.combatDeltaMs??1100));let view=treePassiveStats(base,e,passives);
 const host=createTreeEffectHost(s,e,{stats:()=>view,combatClock:oldClock,shieldBonus:base.shieldBonus??0,onHeal:r=>{if(r.received>0)emitCombatDisplay(e,{kind:'heal',skillId:r.sourceId,hpDelta:r.received,combatAt:r.clock});},onShield:r=>{if(r.received>0)emitCombatDisplay(e,{kind:'shield',skillId:r.sourceId,shieldDelta:r.received,combatAt:r.clock});},receivedHeal:amount=>treeHeal(passives,e,amount,view.hp),negativeDuration:ms=>passives?passiveNegativeDuration(passives,ms):ms,tickIntervalMs:effect=>effect.type==='healOverTime'?rules.periodic.healingTickMs:effect.status==='bleed'?rules.periodic.bleedTickMs:rules.periodic.burnTickMs,
  resolveDot({targetId,source,clock}){const u=e.enemies.find(u=>u.id===targetId&&u.hp>0);if(!u)return;expireDwarfShield(u,ctx.now-(nextClock-clock));const current=treePassiveStats(skillTreeHeroStats(base,e.treeEffects,rules.attributeConfig),e,passives),adjusted=skillTreeEnemyAttributes(u,e.treeEffects,{hasStatus:host.has});const raw=source.amount*treeDamage(passives,source.damageType,'dot');const damage=source.damageType==='physical'?physical(raw,adjusted.armor):ctx.resolveElementDamage(raw,source.damageType,current.elementAttack[source.damageType],adjusted.elementResistance[source.damageType],u.elementTags);hitEnemy(u,damage,e,{kind:'dot',skillId:source.sourceId,element:source.damageType,combatAt:clock});logs.push(u.name+' · '+(source.status==='bleed'?'流血':'灼烧')+' '+Number(damage.toFixed(1)));},
  applyStun(id,effect){if(!rules.controlPolicy)return false;const u=e.enemies.find(u=>u.id===id),r=applyStun(u.control,{...rules.controlPolicy,now:ctx.now,baseDuration:effect.durationMs,reduction:u.profile.controlReduction??0});if(!r)return false;u.control=r.state;return true;}
 });if(!host)throw Error('Invalid tree effect state');
 let advanced=host.advance(nextClock);if(!advanced)throw Error('Missing periodic tuning');e.treeCombatClock=e.treeEffects.clock;
 while(advanced.stopped&&e.heroHp>0){host.removeDeadTargets();if(cleared(e,'burn'))return {acted:true};advanced=host.advance(nextClock);if(!advanced)throw Error('Invalid resumed effect clock');e.treeCombatClock=e.treeEffects.clock;}
 e.treeCombatClock=e.treeEffects.clock;view=treePassiveStats(skillTreeHeroStats(base,e.treeEffects,rules.attributeConfig),e,passives);if(!view)throw Error('Invalid tree attribute config');if(ctx.treeTimersOnly||e.done)return {acted:false,stats:view};
 const target=e.enemies.find(u=>u.id===e.targetId&&u.hp>0)??e.enemies.find(u=>u.hp>0);if(!target)return {acted:true,stats:view};
 const selected=rules.active.find((id,index)=>{
  if(!id||!rules.unlocked.includes(id)||!TREE_ACTIVE_SKILL_IDS.includes(id)||(e.treeSkillCooldowns?.[id]??0)>0||!rules.configs[id])return false;
  const condition=rules.conditions[index];if(!['always','low','charge','burn'].includes(condition)||condition==='low'&&e.heroHp>=view.hp*.6||condition==='charge'&&!target.control.preparing||condition==='burn'&&!(target.burn>0||host.has(target.id,'burn')))return false;
  if(id==='anvil_cry'&&host.activeBuffIds().includes(id))return false;if(id==='iron_vigil'&&e.playerShieldLayers?.layers.some(l=>l.source==='skill:iron_vigil'&&l.remaining>0&&(l.expiresAt===null||l.expiresAt>e.playerShieldLayers.clock)))return false;
  return !!planTreeSkill({skillId:id,castId:e.id+':tree:'+e.round,weaponType:rules.weaponType,config:rules.configs[id],selectedTargetId:target.id,targets:e.enemies.map(u=>({id:u.id,alive:u.hp>0,burning:u.burn>0||host.has(u.id,'burn'),bleeding:host.has(u.id,'bleed'),armorBroken:u.broken>0||host.get(u.id,'armorDown')>0})),hero:{hp:e.heroHp,maxHp:view.hp,defense:view.armor,shield:e.playerShieldLayers?.layers.reduce((sum,l)=>sum+l.remaining,0)??0,activeBuffIds:host.activeBuffIds(),eligibleDebuffIds:host.eligibleDebuffIds()}});
 });
 if(!selected)return {acted:false,stats:view};
 const effectApply=(id,effect)=>{const linked=rules.setConfig?resolveSetLinkedEffect(effect,base.count,rules.setConfig):effect;if(!linked||host.applyEffect(id,linked)===false)throw Error('Unimplemented tree effect '+effect.type);};
 const result=executeTreePlayerAction(s,e,{...ctx,input:{skillId:selected,castId:e.id+':tree:'+e.round,weaponType:rules.weaponType,config:rules.configs[selected]},attributeConfig:rules.attributeConfig,setConfig:rules.setConfig,effects:{apply:effectApply,has:host.has,get:host.get,activeBuffIds:host.activeBuffIds,eligibleDebuffIds:host.eligibleDebuffIds,cleanse:host.cleanse,consume:host.consumeStatus,applyArmorBreak:effect=>effectApply(effect.targetId,{type:'armorDown',amount:effect.amount,durationMs:effect.durationMs,sourceId:'fracture_strike',source:{kind:'skill',skillId:'fracture_strike'}})}});
 if(!result)throw Error('Tree consumer failed after selection');logs.push(...result.logs);return {acted:result.original?.cast===true,stats:treePassiveStats(skillTreeHeroStats(base,e.treeEffects,rules.attributeConfig),e,passives)};
}
