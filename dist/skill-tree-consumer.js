import {getRaceSkillPlanner,getSkillOwner,RACE_PACKS} from './race-registry.js';
import {validPoisonTiming,isGoblinPoisonTiming,isGoblinPoisonSource} from './skill-tree-poison.js';
// Production adapter plans for the new tree. No live registry activation or numeric defaults.
// Approved action shapes; host owns combat math and state mutation.
const clone=x=>structuredClone(x),freeze=x=>{if(x&&typeof x==='object'){Object.values(x).forEach(freeze);Object.freeze(x);}return x;};
const all=new Set(['fault_sweep','furnace_wave','scatter_ash','repelling_wave']),self=new Set(['anvil_cry','iron_vigil','forge_breath','purifying_bulwark']);
export const APPROVED_SKILLS=Object.freeze(['fault_sweep','breach_followup','anvil_cry','breaking_intercept','ember_brand','furnace_wave','cinder_barrage','furnace_etch','scatter_ash','iron_vigil','bastion_blow','repelling_wave','forge_breath','purifying_bulwark']);
const elements=['earth','water','fire','wind','light','dark'];
function planApprovedSkill({skillId,castId,weaponType,selectedTargetId,targets=[],hero={},config}={}){
 try{
 if(!APPROVED_SKILLS.includes(skillId)||typeof castId!=='string'||!castId||!config||!Array.isArray(targets)||new Set(targets.map(t=>t.id)).size!==targets.length)return null;
 const n=k=>{const v=config[k];if(!Number.isFinite(v)||v<0)throw Error('missing numeric fixture '+k);return v;};
 const scope=self.has(skillId)?'self':all.has(skillId)?'all':'single',branch=['axe','hammer'].includes(weaponType)?weaponType:'generic';
 const live=targets.filter(t=>typeof t.id==='string'&&t.id&&t.alive===true),chosen=scope==='all'?live:scope==='single'?live.filter(t=>t.id===selectedTargetId):[];
 if(scope!=='self'&&!chosen.length)return null;if(skillId==='anvil_cry'&&hero.activeBuffIds?.includes(skillId))return null;
 if(skillId==='forge_breath'&&(!Number.isFinite(hero.hp)||!Number.isFinite(hero.maxHp)||hero.hp>=hero.maxHp))return null;
 if(skillId==='purifying_bulwark'&&!hero.eligibleDebuffIds?.length)return null;
 const actions=[],effect=(type,amount,duration,extra={})=>({type,amount,durationMs:duration,sourceId:skillId,stacking:'refresh-source',...extra});
 const direct=(t,index,damageType,coefficient,effects=[],extra={})=>actions.push({kind:'hit',castId,hitId:`${castId}:${t.id}:${index}`,targetId:t.id,hitIndex:index,damageType,coefficient,independentHit:true,independentCrit:true,reaperEligible:true,effects,...extra});
 const burn=duration=>effect('dot',n('burnPower'),duration,{status:'burn',damageType:'fire',reaperEligible:false,activeCastCount:0});
 for(const t of chosen){
 if(skillId==='bastion_blow'){const defenseContribution=Math.min(n('defenseCoefficient')*Math.max(0,hero.defense??0),n('defenseContributionCap'));direct(t,0,'physical',n('coefficient')+(branch==='hammer'&&hero.shield>0?n('shieldBonus'):0),[],{flatDefenseContribution:defenseContribution,afterAttackEffects:branch==='axe'?[effect('defenseUp',n('defenseUp'),n('durationMs'),{target:'self'})]:[]});}
 if(skillId==='repelling_wave')direct(t,0,'physical',n('coefficient'),[effect('stun',0,n('durationMs')+(branch==='hammer'?n('hammerDurationBonus'):0),{pausePreparing:true,bossScale:'host-control-policy',minimumPositive:true}),...(branch==='axe'?[effect('dodgeUp',n('dodgeUp'),n('durationMs'),{target:'self',oncePerCast:true})]:[])]);
 if(skillId==='fault_sweep')direct(t,0,'physical',n('coefficient'),branch==='axe'?[effect('dot',n('bleedPower'),n('durationMs'),{status:'bleed',damageType:'physical',reaperEligible:false,activeCastCount:0})]:branch==='hammer'?[effect('attackDown',n('attackDown'),n('durationMs'))]:[]);
 if(skillId==='breach_followup'){direct(t,0,'physical',n('coefficient')+(branch==='hammer'&&t.armorBroken?n('brokenBonus'):0));if(branch==='axe'&&t.bleeding)direct(t,1,'physical',n('extraCoefficient'));}
 if(skillId==='breaking_intercept')direct(t,0,'physical',n('coefficient'),[{type:'interrupt',sourceId:skillId,requiresPreparing:true,onSuccess:branch==='axe'?[effect('attackUp',n('attackUp'),n('durationMs'),{target:'self'})]:branch==='hammer'?[effect('stun',0,n('durationMs'),{bossScale:'host-control-policy',minimumPositive:true})]:[]}]);
 if(skillId==='ember_brand'){const duration=n('durationMs')+(branch==='axe'?n('axeDurationBonus'):0);direct(t,0,'fire',n('coefficient'),[burn(duration),...(branch==='hammer'?[effect('fireResistDown',n('fireResistDown'),duration,{requiresStatus:'burn',aggregation:'strongest'})]:[])]);}
 if(skillId==='furnace_wave')direct(t,0,'fire',n('coefficient')+(branch==='hammer'&&t.burning?n('burnBonus'):0),branch==='axe'?[{...burn(n('durationMs')),chance:n('burnChance')}]:[],{consumeStatusOnHit:branch==='hammer'&&t.burning?'burn':null});
 if(skillId==='cinder_barrage')for(let i=0;i<(branch==='axe'?3:2);i++)direct(t,i,'fire',n('coefficient')+(branch==='hammer'&&i===1&&t.burning?n('burnBonus'):0));
 if(skillId==='furnace_etch'){const duration=branch==='axe'?n('axeDurationMs'):branch==='hammer'?n('hammerDurationMs'):n('durationMs'),strength=branch==='hammer'?n('hammerMultiplier'):1;actions.push({kind:'effects',targetId:t.id,effects:[effect('armorDown',n('armorDown')*strength,duration,{aggregation:'strongest'}),effect('fireResistDown',n('fireResistDown')*strength,duration,{aggregation:'strongest'})]});}
 if(skillId==='scatter_ash'){const effects=[effect('hitDown',n('hitDown'),n('durationMs'))];if(branch==='hammer')effects.push(effect('armorDown',n('armorDown'),n('durationMs'),{aggregation:'strongest'}));if(branch==='axe'){effects.push({type:'poison',status:'poison',sourceId:skillId,damageKind:'percent-max-hp',fractionPerLayer:.02,element:null,mechanicsReady:true,requiresHit:true,timing:clone(config.poisonTiming),shieldPolicy:'absorb-shield-before-hp',globalDamageMultiplierApplies:false,chance:n('poisonChance'),reaperEligible:false,activeCastCount:0});}actions.push({kind:'effects',targetId:t.id,effects});}
 }
 if(skillId==='anvil_cry')actions.push({kind:'effects',targetId:'self',effects:[effect('attackUp',n('attackUp'),n('durationMs')),...(branch==='axe'?[effect('critUp',n('critUp'),n('durationMs'))]:branch==='hammer'?[effect('penetrationUp',n('penetrationUp'),n('durationMs'))]:[])]});
 if(skillId==='forge_breath')actions.push({kind:'effects',targetId:'self',effects:[effect('heal',n('heal'),0),...(branch==='hammer'?[effect('healOverTime',n('healingPower'),n('durationMs'))]:branch==='axe'?[effect('lifestealUp',n('lifestealUp'),n('durationMs'))]:[])]});
 if(skillId==='purifying_bulwark')actions.push({kind:'effects',targetId:'self',effects:[{type:'cleanse',count:branch==='hammer'?2:1,eligibleIds:[...hero.eligibleDebuffIds],sourceId:skillId,onSuccess:branch==='axe'?[effect('attackUp',n('attackUp'),n('durationMs'))]:[]},effect('shield',n('shield'),n('durationMs'))]});
 if(skillId==='iron_vigil')actions.push({kind:'effects',targetId:'self',effects:[effect('shield',n('shield')*(branch==='hammer'?n('hammerMultiplier'):1),n('durationMs'),{counterEligible:branch==='axe',differentSources:'independent'})]});
 if(actions.some(a=>a.effects?.some(e=>e.chance!==undefined&&e.chance>1)))return null;
 return freeze({skillId,castId,scope,branch,cooldownMs:n('cooldownMs'),activeCastCount:1,damageActionCount:actions.some(a=>a.kind==='hit')?1:0,actions});
 }catch{return null;}
}
// Independent source expiries, strongest active reduction only; weaker sources survive.
export function putTimedSource(sources,{sourceId,attribute,amount,endAt}){
 if(!Array.isArray(sources)||!sources.every(validTimedSource)||!validTimedSource({sourceId,attribute,amount,endAt}))return null;
 return [...sources.filter(x=>x.sourceId!==sourceId||x.attribute!==attribute),{sourceId,attribute,amount,endAt}];
}
export function strongestTimedSource(sources,attribute,now){if(!Array.isArray(sources)||!sources.every(validTimedSource)||typeof attribute!=='string'||!Number.isFinite(now)||now<0)return null;return sources.reduce((value,x)=>x.attribute===attribute&&x.endAt>now?Math.max(value,x.amount):value,0);}
export function validTimedSource(s){return !!s&&typeof s==='object'&&!Array.isArray(s)&&typeof s.sourceId==='string'&&s.sourceId.length>0&&s.sourceId.length<=250&&typeof s.attribute==='string'&&s.attribute.length>0&&s.attribute.length<=100&&[s.amount,s.endAt].every(x=>Number.isFinite(x)&&x>=0&&x<=1e15);}
export function ironVigilCounterEligible({weaponType,shieldBefore,directEnemyHit,actualHpLost,heroAlive,alreadyCountered=false}){return weaponType==='axe'&&Number.isFinite(shieldBefore)&&shieldBefore>0&&directEnemyHit===true&&Number.isFinite(actualHpLost)&&actualHpLost>0&&heroAlive===true&&!alreadyCountered;}
export const IRON_VIGIL_COUNTER_PROVENANCE=freeze({reaperEligible:false,multicastEligible:false,activeCastCount:0,recursiveCounter:false});

const fractureFinite=(x,min=0)=>Number.isFinite(x)&&x>=min;
export const SKILL_SLOT_CONTRACT=freeze({activeSlots:4,passiveSlots:2,allocationScope:'per-loadout',allocationCosts:'reviewed-initial-99'});
function planFractureStrike({castId,targetId,weaponType,config}={}){
 if(typeof castId!=='string'||!castId||typeof targetId!=='string'||!targetId||!config||!fractureFinite(config.cooldownMs)||!fractureFinite(config.genericCoefficient)||!Array.isArray(config.axeCoefficients)||config.axeCoefficients.length!==2||!config.axeCoefficients.every(x=>fractureFinite(x))||config.axeCoefficients[1]<=config.axeCoefficients[0]||!fractureFinite(config.hammerCoefficient)||!config.armorBreak||!fractureFinite(config.armorBreak.amount)||!fractureFinite(config.armorBreak.durationMs,Number.MIN_VALUE)||!['before-hit','after-hit'].includes(config.armorBreak.timing))return null;
 const branch=weaponType==='axe'?'axe':weaponType==='hammer'?'hammer':'generic';
 const coefficients=branch==='axe'?config.axeCoefficients:[branch==='hammer'?config.hammerCoefficient:config.genericCoefficient];
 return freeze({skillId:'fracture_strike',castId,targetId,scope:'single',branch,activeCastCount:1,cooldownMs:config.cooldownMs,hits:coefficients.map((coefficient,index)=>({castId,hitId:`${castId}:${index}:${targetId}`,hitIndex:index,targetId,damageType:'physical',coefficient,independentHit:true,independentCrit:true,reaperEligible:true})),armorBreak:branch==='hammer'?{...config.armorBreak,requiresHit:true,targetId}:null});
}
// Approved set transformations. Input damage is supplied by the one host resolver.
const setFinite=x=>Number.isFinite(x)&&x>=0;
const validCount=n=>Number.isInteger(n)&&n>=0&&n<=4;

export function resolveSetLinkedHit(hit,counts,config){
 if(!hit||![hit.baseDamage,hit.conditionalBonus??0].every(setFinite)||!counts||!config||!['anvil','rune','guard'].every(k=>validCount(counts[k]??0)))return null;
 const n=k=>{const x=config[k];if(!setFinite(x))throw Error('missing fixture '+k);return x;};
 try{
 let base=hit.baseDamage,bonus=hit.conditionalBonus??0;const qualifyingState=hit.targetBleeding===true||hit.targetBroken===true,skill=hit.source?.kind==='skill'&&hit.direct===true;
 if(skill&&hit.damageType==='physical'&&(counts.anvil??0)>=2&&qualifyingState){const factor=1+n('anvilTwoBonus');base*=factor;bonus*=factor;}
 if(skill&&hit.skillId==='breach_followup'&&(counts.anvil??0)>=4){
  if(hit.weaponType==='axe'&&hit.hitIndex===1&&hit.targetBleeding)base*=1+n('anvilAxeExtraBonus');
  else if(hit.weaponType==='hammer'&&hit.targetBroken)bonus*=1+n('anvilHammerConditionBonus');
  else if(!['axe','hammer'].includes(hit.weaponType)&&qualifyingState)base*=1+n('anvilGenericBonus');
 }
 if(skill&&hit.skillId==='furnace_wave'&&(counts.rune??0)>=4){if(hit.weaponType==='hammer'&&hit.targetBurning)bonus*=1+n('runeConsumeBonus');else if(!['axe','hammer'].includes(hit.weaponType))base*=1+n('runeGenericBonus');}
 if(skill&&hit.skillId==='bastion_blow'&&(counts.guard??0)>=4){if(hit.weaponType==='hammer'&&hit.heroShielded)bonus*=1+n('guardShieldedBonus');else if(!['axe','hammer'].includes(hit.weaponType))base*=1+n('guardGenericBonus');}
 return {...clone(hit),baseDamage:base,conditionalBonus:bonus,totalDamage:base+bonus};
 }catch{return null;}
}
export function resolveSetLinkedEffect(effect,counts,config){
 if(!effect||!setFinite(effect.amount??0)||!counts||!config||!['anvil','rune','guard'].every(k=>validCount(counts[k]??0)))return null;
 const out=clone(effect),n=k=>{const x=config[k];if(!setFinite(x))throw Error('missing fixture '+k);return x;};
 try{
 if(effect.type==='dot'&&effect.status==='burn'&&(counts.rune??0)>=2)out.amount*=1+n('runeBurnBonus');
 if(effect.skillId==='furnace_wave'&&effect.weaponType==='axe'&&effect.status==='burn'&&(counts.rune??0)>=4){if(!setFinite(effect.chance)||effect.chance>1)return null;out.chance=Math.min(1,effect.chance+n('runeBurnChanceBonus'));}
 if(effect.type==='shield'&&effect.source?.kind==='skill'&&(counts.guard??0)>=2)out.amount*=1+n('guardSkillShieldBonus');
 if(effect.type==='defenseUp'&&effect.source?.kind==='skill'&&effect.skillId==='bastion_blow'&&effect.weaponType==='axe'&&(counts.guard??0)>=4)out.amount*=1+n('guardAxeDefenseBonus');
 return out;
 }catch{return null;}
}

export const TREE_ACTIVE_SKILL_IDS=Object.freeze(['fracture_strike',...APPROVED_SKILLS,...Object.values(RACE_PACKS).flatMap(p=>Object.values(p.skills??{}).filter(n=>n.kind==='active'||p.tree.nodes.some(t=>t.id===n.id&&t.kind==='active')).map(n=>n.id)).filter(id=>!['fracture_strike',...APPROVED_SKILLS].includes(id))]);
export const TREE_MAX_HITS_PER_TARGET=8;
const validId=x=>typeof x==='string'&&x.length>0&&x.length<=250;
const plain=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
/** Build only with explicit complete numeric tuning. Pending poison has no production fallback.
 * targets: [{id,alive,burning,bleeding,armorBroken}], hero: {hp,maxHp,shield,defense,
 * eligibleDebuffIds,activeBuffIds}; all facts are captured from the current live cast.
 */
export function planTreeSkill(input={}){
 if(!plain(input)||(!TREE_ACTIVE_SKILL_IDS.includes(input.skillId)&&input.skillId!=='ashen-prism-beam')||!validId(input.castId)||!plain(input.config)||!Array.isArray(input.targets)||input.targets.length>100000||input.targets.some(t=>!plain(t)||!validId(t.id)||typeof t.alive!=='boolean')||new Set(input.targets.map(t=>t.id)).size!==input.targets.length)return null;
 // Poison is approved as a separate percentage effect, NOT an elemental damage type.
 // Legacy poison remains2%; goblin v081 explicitly opts into3%/2s. Both remain shield-first.
 if(input.skillId==='scatter_ash'&&input.weaponType==='axe'&&(!validPoisonTiming(input.config.poisonTiming)||input.config.poisonTiming.maxLayers!==5))return null;
 if(!Number.isFinite(input.config.cooldownMs)||input.config.cooldownMs<=0)return null;
 let plan;
 const external=getRaceSkillPlanner(input.skillId);
 if(input.skillId==='ashen-prism-beam'){
  if(!input.context?.equippedLegends?.some(x=>x.legendaryId==='ashen-crystal-core')||input.config.cooldownMs!==30000||!input.targets.some(t=>t.id===input.selectedTargetId&&t.alive))return null;
  plan={skillId:input.skillId,castId:input.castId,scope:'single',branch:'equipment',cooldownMs:30000,activeCastCount:1,damageActionCount:1,actions:[{kind:'hit',castId:input.castId,hitId:input.castId+':beam',targetId:input.selectedTargetId,hitIndex:0,damageType:'light',coefficient:2,independentHit:true,independentCrit:true,reaperEligible:true,ignoreArmor:true,ignoreElementResistance:true,effects:[]}]};
 }else if(external){plan=external(input);if(!plan)return null;plan=clone(plan);const owner=getSkillOwner(input.skillId);if(owner?.modifySkillPlan)plan=owner.modifySkillPlan(plan,{...input,stats:input.stats,setCounts:input.stats?.count??{}});if(!plan)return null;}
 else if(input.skillId==='fracture_strike'){
  if(!input.targets.some(t=>t.id===input.selectedTargetId&&t.alive))return null;
  const p=planFractureStrike({...input,targetId:input.selectedTargetId});if(!p)return null;
  plan={...p,damageActionCount:1,actions:p.hits.map(h=>({...h,kind:'hit',effects:[],armorBreak:p.armorBreak?clone(p.armorBreak):null}))};delete plan.hits;delete plan.armorBreak;
 }else{plan=planApprovedSkill(input);if(!plan)return null;plan=clone(plan);}
 for(const pack of Object.values(RACE_PACKS))if(pack.modifyLegendaryPlan&&!pack.createLegendaryState)plan=pack.modifyLegendaryPlan(plan,{...input,...input.context});

 for(const a of plan.actions){
  a.source={kind:'skill',skillId:plan.skillId};a.skillId=plan.skillId;a.weaponType=input.weaponType??'generic';
  if(a.kind==='hit'){
   a.baseCoefficient=a.coefficient;a.conditionalCoefficient=0;
   const t=input.targets.find(t=>t.id===a.targetId),c=input.config;
   if(plan.branch==='hammer'){
    if(plan.skillId==='breach_followup'&&t.armorBroken)a.conditionalCoefficient=c.brokenBonus;
    if(plan.skillId==='furnace_wave'&&t.burning)a.conditionalCoefficient=c.burnBonus;
    if(plan.skillId==='cinder_barrage'&&a.hitIndex===1&&t.burning)a.conditionalCoefficient=c.burnBonus;
    if(plan.skillId==='bastion_blow'&&input.hero?.shield>0)a.conditionalCoefficient=c.shieldBonus;
   }
   a.baseCoefficient-=a.conditionalCoefficient;
   a.direct=true;a.targetBleeding=t?.bleeding===true;a.targetBroken=t?.armorBroken===true;a.targetBurning=t?.burning===true;a.heroShielded=input.hero?.shield>0;
  }
  const annotate=e=>({...e,source:{kind:'skill',skillId:plan.skillId},skillId:plan.skillId,weaponType:input.weaponType??'generic',...(e.onSuccess?{onSuccess:e.onSuccess.map(annotate)}:{})});
  a.effects=(a.effects??[]).map(annotate);if(a.afterAttackEffects)a.afterAttackEffects=a.afterAttackEffects.map(annotate);
 }
 if(!validTreeSkillPlan(plan))return null;
 return freeze(plan);
}
/** The plan is internal, not a substitute for save/allocation validation. Validate before hooks fire. */
export function validTreeSkillPlan(p){
 if(!plain(p)||(!TREE_ACTIVE_SKILL_IDS.includes(p.skillId)&&p.skillId!=='ashen-prism-beam')||!validId(p.castId)||!['single','all','self'].includes(p.scope)||!Number.isFinite(p.cooldownMs)||p.cooldownMs<=0||!Array.isArray(p.actions)||p.actions.length>300000||p.activeCastCount!==1||![0,1].includes(p.damageActionCount))return false;
 const ids=new Set(),positions=new Set();let direct=0;const perTarget=new Map();
 const effectValid=e=>plain(e)&&typeof e.type==='string'&&(!('amount'in e)||Number.isFinite(e.amount)&&e.amount>=0)&&(!('durationMs'in e)||Number.isFinite(e.durationMs)&&e.durationMs>=0)&&(!('chance'in e)||Number.isFinite(e.chance)&&e.chance>=0&&e.chance<=1)&&e.mechanicsReady!==false&&(e.type!=='poison'||(isGoblinPoisonTiming(e.timing)?isGoblinPoisonSource(p.skillId)&&e.sourceId===p.skillId&&e.fractionPerLayer===.03:e.fractionPerLayer===.02)&&e.element===null&&e.globalDamageMultiplierApplies===false&&e.shieldPolicy==='absorb-shield-before-hp'&&e.requiresHit===true&&validPoisonTiming(e.timing)&&e.timing.maxLayers===5&&(e.setBonus===undefined||e.setBonus===true&&p.skillId==='goblin.venom_cut'&&isGoblinPoisonTiming(e.timing)))&&(!e.onSuccess||Array.isArray(e.onSuccess)&&e.onSuccess.every(effectValid));
 for(const a of p.actions){
  if(!plain(a)||!['hit','effects'].includes(a.kind)||a.skillId!==p.skillId||a.source?.kind!=='skill'||a.source?.skillId!==p.skillId||!validId(a.targetId)||!Array.isArray(a.effects)||!a.effects.every(effectValid)||a.afterAttackEffects&&!a.afterAttackEffects.every(effectValid))return false;
  if(a.armorBreak&&(!plain(a.armorBreak)||a.armorBreak.targetId!==a.targetId||!['before-hit','after-hit'].includes(a.armorBreak.timing)||!Number.isFinite(a.armorBreak.amount)||a.armorBreak.amount<0||!Number.isFinite(a.armorBreak.durationMs)||a.armorBreak.durationMs<=0))return false;
  if(a.kind==='hit'){
   if(!validId(a.hitId)||ids.has(a.hitId)||positions.has(JSON.stringify([a.targetId,a.hitIndex]))||a.castId!==p.castId||!Number.isSafeInteger(a.hitIndex)||a.hitIndex<0||a.hitIndex>=TREE_MAX_HITS_PER_TARGET||!['physical',...elements].includes(a.damageType)||!Number.isFinite(a.coefficient)||a.coefficient<0)return false;
   ids.add(a.hitId);positions.add(JSON.stringify([a.targetId,a.hitIndex]));direct++;const count=(perTarget.get(a.targetId)??0)+1;if(count>TREE_MAX_HITS_PER_TARGET)return false;perTarget.set(a.targetId,count);
  }
 }
 return p.damageActionCount===(direct>0?1:0);
}
/** Adapter contract: caller executes against its transaction/encounter clone and persisted RNG.
 * resolveHit performs the existing hit -> optional beforeMitigation -> crit/mitigation -> shield/HP
 * -> reaper pipeline. It returns {hit:boolean,...}; do NOT roll those here a second time.
 * onCastEnd is once per original/extra cast: aggregate actual HP lifesteal and at most one enemy
 * counter, then existing legendary action bookkeeping/clear resolution. No automatic recursion.
 */
export function executeTreeSkill(plan,host={},options={}){
 if(!validTreeSkillPlan(plan)||!plain(host)||!['isAlive','heroAlive','hasLivingTargets','resolveHit','applyEffect','onActiveCast','onCastEnd'].every(k=>typeof host[k]==='function')||options.extra!==undefined&&typeof options.extra!=='boolean')return null;
 const extra=options.extra===true;
 if(!extra&&typeof host.consumeCooldown!=='function')return null;
 const allEffects=plan.actions.flatMap(a=>[...(a.effects??[]),...(a.afterAttackEffects??[])]),walk=es=>es.flatMap(e=>[e,...walk(e.onSuccess??[])]),effects=walk(allEffects);
 if(effects.some(e=>e.type==='poison')&&(!host.applyPoison||typeof host.applyPoison!=='function'||typeof host.resolveEffectHit!=='function'))return null;
 if(effects.some(e=>e.type==='interrupt')&&typeof host.interrupt!=='function'||effects.some(e=>e.type==='cleanse')&&typeof host.cleanse!=='function'||effects.some(e=>e.chance!==undefined)&&typeof host.random!=='function'||plan.actions.some(a=>a.consumeStatusOnHit)&&typeof host.consumeStatus!=='function'||plan.actions.some(a=>a.armorBreak)&&typeof host.applyArmorBreak!=='function')return null;
 if(!host.heroAlive()||!host.hasLivingTargets()||plan.scope!=='self'&&!plan.actions.some(a=>host.isAlive(a.targetId)))return {cast:false,hits:[],activeCastCount:0};
 if(!extra&&host.consumeCooldown({skillId:plan.skillId,cooldownMs:plan.cooldownMs,castId:plan.castId})===false)return {cast:false,hits:[],activeCastCount:0};
 const event={castId:plan.castId,skillId:plan.skillId,source:'active',extra,activeCastCount:1,damageActionCount:plan.damageActionCount,multicastEligible:!extra,...(plan.runtimePatch?{runtimePatch:clone(plan.runtimePatch)}:{})};
 host.onActiveCast({...event});
 const hits=[],once=new Set();
 const apply=(e,target)=>{
  if(!host.heroAlive())return;if(e.target==='self')target='self';
  if(target!=='self'&&!host.isAlive(target))return;
  const key=e.sourceId+':'+e.type;if(e.oncePerCast&&once.has(key))return;
  if(e.type==='poison'){const hitId=`${plan.castId}:poison:${target}`,hit=host.resolveEffectHit({targetId:target,hitId,hitIndex:0,source:'skill-effect',reaperEligible:false,damageActionCount:0},event);if(!hit||typeof hit.hit!=='boolean')throw Error('resolveEffectHit must return {hit:boolean}');hits.push({...hit,id:hitId,hitId,targetId:target,hitIndex:0});if(!hit.hit)return;}
  if(e.chance!==undefined){const r=host.random();if(!Number.isFinite(r)||r<0||r>=1)throw Error('persisted RNG must return [0,1)');if(r>=e.chance)return;}
  if(e.type==='poison')host.applyPoison(target,clone(e),event);
  else if(e.type==='interrupt'){if(host.interrupt(target,e)===true)for(const b of e.onSuccess??[])apply(b,b.target==='self'?'self':target);}
  else if(e.type==='cleanse'){const removed=host.cleanse(e.eligibleIds,e.count,e);if(Number.isSafeInteger(removed)&&removed>0)for(const b of e.onSuccess??[])apply(b,'self');}
  else host.applyEffect(target,clone(e),event);
  if(e.oncePerCast)once.add(key);
 };
 for(const a of plan.actions){
  if(!host.heroAlive())break;if(a.targetId!=='self'&&!host.isAlive(a.targetId))continue;
  if(a.kind==='hit'){
   const beforeMitigation=a.armorBreak?.timing==='before-hit'?()=>host.applyArmorBreak({...clone(a.armorBreak),castId:plan.castId,hitId:a.hitId}):undefined;
   const r=host.resolveHit({...clone(a),beforeMitigation},event);if(!r||typeof r.hit!=='boolean')throw Error('resolveHit must return {hit:boolean}');
   hits.push({...r,id:a.hitId,hitId:a.hitId,targetId:a.targetId,hitIndex:a.hitIndex});
   for(const e of a.afterAttackEffects??[])apply(e,'self');
   if(!r.hit)continue;
   if(a.consumeStatusOnHit)host.consumeStatus(a.targetId,a.consumeStatusOnHit,event);
   if(a.armorBreak?.timing==='after-hit'&&host.isAlive(a.targetId))host.applyArmorBreak({...clone(a.armorBreak),castId:plan.castId,hitId:a.hitId});
  }
  for(const e of a.effects)apply(e,a.targetId);
 }
 const result={cast:true,hits,activeCastCount:1,damageActionCount:plan.damageActionCount,extra};host.onCastEnd({...event,hits});return result;
}
/** Host decides the existing 15% roll. Rebuild extra from current living targets/statuses.
 * An extra is a full new cast (+ legendary counts), but never pays CD or tests multicast again.
 */
export function executeTreeSkillTurn(input,host,{shouldMulticast,rebuildInput}={}){
 const p=planTreeSkill(input);if(!p)return null;
 const original=executeTreeSkill(p,host);if(!original?.cast)return {original,extra:null};
 if(!host.heroAlive()||!host.hasLivingTargets()||typeof shouldMulticast!=='function'||typeof rebuildInput!=='function'||!shouldMulticast({skillId:p.skillId,castId:p.castId,source:'active',triggered:false}))return {original,extra:null};
 const next=rebuildInput(p);if(!next||next.castId===p.castId||next.skillId!==p.skillId)return {original,extra:null};
 const extraPlan=planTreeSkill(next);return {original,extra:extraPlan?executeTreeSkill(extraPlan,host,{extra:true}):null};
}
