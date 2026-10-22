import {DWARF_MONSTERS} from './dwarf-content.js';
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
 if(e.affixState!==undefined&&(!validBattleAffixState(e.affixState)||e.affixState.battleId!==e.id))return false;
 const initial=e.enemies.filter(u=>u.origin==='initial');if(planned&&e.fieldGroup&&initial.length<2)return false;if(initial.length<(planned?1:2)||initial.length>3)return false;
 if(!e.enemies.every(u=>u&&typeof u.id==='string'&&u.id.length<200&&['initial','summoned'].includes(u.origin)&&u.sourceInstanceId===e.instanceId&&(planned||instances[u.sourceInstanceId]?.kind==='field')&&instances[u.sourceInstanceId]?.enabled&&u.location===e.location&&[0,1,2].includes(u.location)&&(planned?validDwarfActor(u):u.monsterId===PROTOTYPE_MONSTERS[u.location]&&u.definitionId===u.monsterId)&&typeof u.name==='string'&&u.name.length<150&&typeof u.main==='boolean'&&['hp','max','atk','armor','shield','burn','broken','blunt','scorch','stun','round','nextHeavy'].every(k=>n(u[k]))&&u.max>0&&u.hp<=u.max&&typeof u.heavyDelayed==='boolean'&&u.cd&&typeof u.cd==='object'&&Object.values(u.cd).every(n)&&validControl(u.control)&&u.control.unitId===u.id&&validMultiProfile(u.profile)&&Array.isArray(u.elementTags)&&new Set(u.elementTags).size===u.elementTags.length&&u.elementTags.every(k=>['earth','water','fire','wind','light','dark'].includes(k))&&u.elementResistance&&Object.keys(u.elementResistance).length===6&&['earth','water','fire','wind','light','dark'].every(k=>n(u.elementResistance[k]))))return false;
 if(e.pauseAt!==undefined&&(!Number.isSafeInteger(e.pauseAt)||e.pauseAt<0||e.pauseAt>1e15||!Number.isFinite(e.pauseRemainingAction)||e.pauseRemainingAction<0||e.pauseRemainingAction>1100))return false;
 if(e.pauseAt===undefined&&e.pauseRemainingAction!==undefined)return false;
 if(e.lastCast!==undefined&&(!e.lastCast||typeof e.lastCast.id!=='string'||!['single','all','self'].includes(e.lastCast.scope)||typeof e.lastCast.skillId!=='string'||!Array.isArray(e.lastCast.hits)||e.lastCast.hits.length>e.enemies.length||!e.lastCast.hits.every(h=>typeof h.id==='string'&&typeof h.hit==='boolean'&&e.enemies.some(u=>u.id===h.targetId))))return false;
 if(e.lastCast?.hits?.some(h=>(h.hitIndex!==undefined&&!int(h.hitIndex))||['hpBefore','hpAfter','actualHpLost','killProcHpLost'].some(k=>h[k]!==undefined&&!n(h[k]))||(h.hpBefore!==undefined&&h.hpAfter>h.hpBefore)||(h.actualHpLost!==undefined&&h.actualHpLost>h.hpBefore)||(h.killProcHpLost!==undefined&&h.killProcHpLost>h.hpAfter)))return false;
 if(e.lastCast?.lifesteal!==undefined&&!n(e.lastCast.lifesteal))return false;
 if(e.fixtureAction!==undefined&&e.fixtureAction!==null&&!validFixtureAction(e.fixtureAction))return false;
 if(e.rewardRoundSources!==undefined&&(!Array.isArray(e.rewardRoundSources)||e.rewardRoundSources.length!==2||!e.rewardRoundSources.every(id=>initial.some(u=>u.id===id))))return false;
 return e.done?(e.targetId===null&&(!e.win||e.enemies.every(u=>u.hp===0))):e.enemies.some(u=>u.id===e.targetId&&u.hp>0);
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
function hitEnemy(u,amount){const absorbed=Math.min(u.shield,amount);u.shield-=absorbed;const hpLost=Math.min(u.hp,amount-absorbed);u.hp-=hpLost;return hpLost;}
function end(e,win,source){e.done=true;e.win=win;e.killSource=source;e.heroHp=Math.max(0,e.heroHp);e.targetId=null;syncMultiTarget(e);}
function cleared(e,source){if(e.enemies.every(u=>u.hp<=0)){end(e,true,source);return true;}return false;}
function hitHero(e,amount){let absorbed=Math.min(e.barrierShield,amount);e.barrierShield-=absorbed;amount-=absorbed;absorbed=Math.min(e.shield,amount);e.shield-=absorbed;amount-=absorbed;const loss=Math.min(e.heroHp,amount);e.heroHp-=loss;return loss;}
export function stepMulti(s,e,turn,ctx){
 const {stats,SKILLS,skillUnlocked,resolveElementDamage,now,makeSummon}=ctx,st=stats(s),logs=[];e.round++;
 e.affixState??=createBattleAffixState(e.id);
 const heroDied=()=>{if(e.heroHp>0)return false;const revived=tryNirvana(e.affixState,{battleId:e.id,hasNirvana:!!st.specials.nirvana,hp:e.heroHp,maxHp:st.hp});if(revived){e.affixState=revived.state;if(revived.revived){e.heroHp=revived.hp;logs.push('涅槃 · 满血复生');return false;}}s.momentum=0;end(e,false,null);return true;};
 for(const k in e.cd)e.cd[k]=Math.max(0,e.cd[k]-1);
 for(const u of e.enemies){expireDwarfShield(u,now);u.control=advanceControlClock(u.control,now);u.cd=Object.fromEntries(Object.entries(u.control.cooldowns).map(([k,v])=>[k,Math.max(0,Math.ceil((v-now)/1100))]));}
 let target=e.enemies.find(u=>u.id===e.targetId);const charging=()=>!!target.control.preparing||(!target.typedProfile&&e.round>=target.nextHeavy);
 const usable=k=>!(k==='warcry'&&e.warcry>0)&&!(k==='ironcoat'&&e.ironcoat>0)&&!(k==='blunt'&&target.blunt>0)&&!(k==='scorch'&&target.scorch>0)&&!(k==='guard'&&e.guard>0)&&!(k==='barrier'&&(e.barrier>0||e.barrierShield>0))&&!(k==='mend'&&e.heroHp>=st.hp)&&!(k==='cleanse'&&!e.heroBurn&&!e.weakness&&!(e.typedDots?.length))&&!(k==='delay'&&(!charging()||target.heavyDelayed));
 const k=s.skills.find((key,i)=>key!==null&&SKILLS[key]&&skillUnlocked(s,key)&&!e.cd[key]&&usable(key)&&(s.conditions[i]!=='low'||e.heroHp<st.hp*.6)&&(s.conditions[i]!=='charge'||charging())&&(s.conditions[i]!=='burn'||target.burn>0))??null,fixture=e.developmentFixture===true?e.fixtureAction:null;e.fixtureAction=null;
 if(k&&!fixture)e.cd[k]=SKILLS[k].cd;
 const executeCast=(extra=false)=>{if(k||fixture)e.activeCastCount++;
 target=e.enemies.find(u=>u.id===e.targetId&&u.hp>0)??e.enemies.find(u=>u.hp>0);if(!target)return true;
 const castId=e.id+':'+e.round+(extra?':extra':''); e.lastCast={id:castId,skillId:fixture?'developer-fixture':k??'basic',scope:fixture?.scope??(['warcry','ironcoat','barrier','mend','cleanse'].includes(k)?'self':'single'),hits:[]};const utility=['warcry','ironcoat','delay','barrier','mend','cleanse'].includes(k)&&!fixture;
 if(utility){
  if(k==='warcry')e.warcry=3+(st.count.anvil>=2?1:0);
  if(k==='ironcoat')e.ironcoat=3+(st.count.guard>=2?1:0);
  if(k==='delay'){if(target.control.preparing)target.control.preparing.completesAt+=1100;else target.nextHeavy++;target.heavyDelayed=true;}
  if(k==='barrier'){e.barrier=3;e.barrierShield=Math.floor(st.hp*.2)+st.shieldBonus;if(st.count.guard>=4)e.guard=Math.max(e.guard,2);}
  if(k==='mend'){const heal=Math.min(st.hp-e.heroHp,Math.floor(st.hp*.35),Math.min(Math.floor(st.hp*.2),Math.round(st.atk*.7+15))+st.healingBonus);e.heroHp+=heal;logs.push('回炉息 · 恢复 '+heal);}
  if(k==='cleanse'){e.heroBurn=0;e.heroBurnPower=0;e.weakness=0;e.typedDots=[];}
  if(k!=='mend')logs.push(SKILLS[k].name+' · 生效');
 }else{
  const targets=fixture?.scope==='all'?e.enemies.filter(u=>u.hp>0):[target];let countered=false,counterReaction=null;const lifestealHits=[];
  for(const u of targets){if(u.hp<=0)continue;const hitIndex=0,hitId=castId+':'+hitIndex+':'+u.id,hit=Math.random()<st.hit,hitRecord={id:hitId,hitIndex,targetId:u.id,hit,hpBefore:u.hp,hpAfter:u.hp,actualHpLost:0,killProcHpLost:0};e.lastCast.hits.push(hitRecord);if(!hit){logs.push(u.name+' · 未命中');continue;}
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
    if(!k&&s.momentum){raw*=1.35;s.momentum=0;logs.push('余势：普攻增强');}
   }
   const crit=Math.random()<st.crit,fire=!fixture&&(k==='mark'||k==='ignite'),base=raw*(crit?st.critDamage:1),dealt=fire?resolveElementDamage(base,'fire',st.elementAttack.fire,u.elementResistance.fire,u.elementTags):physical(base,Math.max(0,u.armor*(u.broken?.75:1)-st.penetration));
   const hpBefore=u.hp,hpLost=hitEnemy(u,dealt);Object.assign(hitRecord,{hpBefore,hpAfter:u.hp,actualHpLost:hpLost});lifestealHits.push({hitId,hpBefore,hpAfter:u.hp,source:k||fixture?'active':'basic'});
   const execute=tryReaperHit(e.affixState,{battleId:e.id,castId,hitIndex,targetId:u.id,hit:true,targetHp:u.hp,hasReaper:!!st.specials.reaper});if(execute){e.affixState=execute.state;if(execute.triggered){hitRecord.killProcHpLost=u.hp;u.hp=0;logs.push('死神 → '+u.name);}}
   logs.push((fixture?'开发测试范围攻击':k?SKILLS[k].name:'普通攻击')+' → '+u.name+' · '+Number(dealt.toFixed(1))+(fire?'（火）':''));
   if(u.hp===0&&st.specials.momentum)s.momentum=1;
   const reflect=DWARF_MONSTERS[u.definitionId]?.trait;if(u.typedProfile&&reflect?.type==='reflect'&&u.hp>0&&hpLost>0&&!countered&&now>=u.reflectReadyAt&&Math.random()<reflect.chance){countered=true;u.reflectReadyAt=now+reflect.cooldownMs;counterReaction={name:u.name,amount:physical(u.atk*reflect.coefficient,st.armor*(e.ironcoat>0?1.4:1))};}
   if(u.hp>0&&hpLost>0&&u.profile.counterRatio>0&&!countered){countered=true;counterReaction={name:u.name,amount:hpLost*u.profile.counterRatio};}
  }
  if(counterReaction){const loss=hitHero(e,counterReaction.amount);logs.push(counterReaction.name+' · 反伤 '+Number(loss.toFixed(1)));}
  if(e.heroHp>0){const recovery=calculateLifesteal({rating:st.lifesteal??0,maxHp:st.hp,currentHp:e.heroHp,hits:lifestealHits},ctx.lifestealConfig);if(recovery?.heal>0){e.heroHp+=recovery.heal;e.lastCast.lifesteal=recovery.heal;logs.push('吸血 · 恢复 '+Number(recovery.heal.toFixed(2)));}}
  if(heroDied())return true;
  if(cleared(e,'active'))return true;
 }
 return false;};
 if(executeCast())return logs;
 if(k&&!fixture&&st.specials.multicast&&tryMulticast({source:'active',triggered:false,hasLivingEnemies:e.enemies.some(u=>u.hp>0)})?.triggered){logs.push('多重施法 · '+SKILLS[k].name);if(executeCast(true))return logs;}
 // Each enemy owns its DOT/debuff state. Player self-DOT retains its saved source and bypasses shields.
 for(const u of e.enemies.filter(u=>u.hp>0))if(u.burn>0){const dot=resolveElementDamage(st.atk*(e.warcry>0?1.25:1)*(e.weakness>0?.8:1)*.32*(st.count.rune>=2?1.3:1)*(u.scorch>0?1.25:1),'fire',st.elementAttack.fire,u.elementResistance.fire,u.elementTags);hitEnemy(u,dot);u.burn--;logs.push(u.name+' · 炉火灼烧 '+Number(dot.toFixed(1)));}
 if(cleared(e,'burn'))return logs;
 if(e.heroBurn>0){const dot=resolveElementDamage(e.heroBurnPower,'fire',0,st.elementResistance.fire,[]);e.heroHp-=dot;e.heroBurn--;turn.burnTicked=true;logs.push('灼烧侵蚀 · -'+Number(dot.toFixed(1)));if(heroDied())return logs;}
 tickDwarfDots(e,now,dot=>{const amount=dot.type==='physical'?physical(dot.raw,st.armor):resolveElementDamage(dot.raw,dot.type,0,st.elementResistance[dot.type],[]);e.heroHp-=amount;logs.push('持续侵蚀 · -'+Number(amount.toFixed(1)));});if(heroDied())return logs;
 const acting=[...e.enemies];
 for(const u of acting){if(u.hp<=0)continue;u.round++;let multiplier=1,perform=true;
  if(u.typedProfile){
   const action=nextDwarfAction(u,now);if(!action)continue;let direct=false;
   for(const effect of action.effects){
    if(effect.type==='shield'){u.shield=u.max*effect.fraction;u.shieldUntil=now+effect.seconds*1000;logs.push(u.name+' · '+action.name);}
    if(effect.type==='dot')applyDwarfDot(e,u,action,effect,now);
    if(effect.type==='damage'){direct=true;const raw=u[effect.powerBasis]*(u.blunt>0?.8:1)*effect.coefficient;
     let hurt=(effect.damageType==='physical'?physical(raw,st.armor*(e.ironcoat>0?1.4:1)):resolveElementDamage(raw,effect.damageType,0,st.elementResistance[effect.damageType],[]))*(e.guard>0?.6:1);
     if(st.block>0&&Math.random()<st.block)hurt*=.7;const loss=hitHero(e,hurt);logs.push(u.name+' · '+action.name+' -'+Number(loss.toFixed(1)));if(heroDied())return logs;
    }
   }
   if(direct&&e.heroHp>0&&e.guard>0){const counter=physical(st.atk*(e.warcry>0?1.25:1)*(e.weakness>0?.8:1)*(st.count.guard>=4?1:.6),Math.max(0,u.armor-st.penetration));hitEnemy(u,counter);logs.push('坚守反击 → '+u.name+' · '+counter);}
   continue;
  }
  if(u.stun){u.stun=0;perform=false;logs.push(u.name+' · 蓄力被打断');}
  else if(!controlAllowsAction(u.control,now))perform=false;
  else if(u.profile.castDuration>0){
   if(u.control.preparing){const complete=claimCompletedCast(u.control,now);if(complete){u.control=complete.state;u.heavyDelayed=false;multiplier=u.profile.castMultiplier;if(u.profile.summonCount){for(let i=0;i<u.profile.summonCount;i++){const added=makeSummon(u,++e.summonSerial);added.origin='summoned';e.enemies.push(added);}logs.push(u.name+' · 召唤随从');perform=false;}}else perform=false;}
   else if((u.control.cooldowns['fixture-cast']??0)<=now){u.control=beginPreparing(u.control,{skillId:'fixture-cast',duration:u.profile.castDuration,cooldownDuration:u.profile.castCooldown,now});logs.push(u.name+' · 开始读条');perform=false;}
  }else if(e.round>=u.nextHeavy){multiplier=2;u.nextHeavy=e.round+4;u.heavyDelayed=false;}
  if(perform){
   let hurt=Math.max(1,Math.round(physical(u.atk*(u.blunt>0?.8:1)*multiplier,st.armor*(e.ironcoat>0?1.4:1))*(e.guard>0?.6:1)));
   if(st.block>0&&Math.random()<st.block)hurt=Math.max(1,Math.round(hurt*.7));
   const loss=hitHero(e,hurt);logs.push(u.name+' · 攻击 -'+Number(loss.toFixed(1)));
   if(u.profile.lifestealRatio>0){const heal=Math.min(u.max-u.hp,loss*u.profile.lifestealRatio,u.profile.lifestealCap??0);u.hp+=heal;}
   if(heroDied())return logs;
   if(e.heroHp>0&&e.guard>0){const counter=physical(st.atk*(e.warcry>0?1.25:1)*(e.weakness>0?.8:1)*(st.count.guard>=4?1:.6),Math.max(0,u.armor-st.penetration));hitEnemy(u,counter);logs.push('坚守反击 → '+u.name+' · '+counter);}
   if(u.location===1&&u.round%5===0){e.heroBurn=Math.max(1,3-st.resolveReduction);e.heroBurnPower=Math.max(2,Math.round(u.atk*.05));}
   if(u.location===2&&u.round%6===0)e.weakness=Math.max(1,2-st.resolveReduction)+1;
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
 e.enemies.forEach((u,i)=>{u.control=controls[i];if(u.typedProfile){for(const k of ['nextBasicAt','shieldUntil','reflectReadyAt'])if(u[k]>0)u[k]+=elapsed;}});for(const dot of e.typedDots??[]){dot.nextAt+=elapsed;dot.endAt+=elapsed;}s.nextActionAt=clock+e.pauseRemainingAction;delete e.pauseAt;delete e.pauseRemainingAction;s.running=true;return true;
}
