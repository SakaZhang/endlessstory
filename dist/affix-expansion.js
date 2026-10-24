// Additive schema. Importing this module does NOT activate any production roll pool.
const freeze=x=>{if(x&&typeof x==='object'){Object.values(x).forEach(freeze);Object.freeze(x);}return x;};
const nonnegative=n=>Number.isFinite(n)&&n>=0&&n<=1e12;
const clock=n=>Number.isFinite(n)&&n>=0&&n<=1e15;
const id=x=>typeof x==='string'&&x.length>0&&x.length<=200;
export const ORDINARY_AFFIX_CANDIDATES=freeze({
 lifesteal:{name:'吸血',suffix:'',unit:'rating',min:3,max:8,sourceApproved:true,mechanicsReady:true,enabled:true},
 luck:{name:'幸运',suffix:'',unit:'rating',min:1,max:3,sourceApproved:true,mechanicsReady:true,enabled:true}
});
export const SPECIAL_AFFIX_EXPANSION=freeze({
 shelter:{name:'护佑',desc:'开战获得15%最大生命护盾。',sourceApproved:true,mechanicsReady:true,enabled:true,openingShieldFraction:.15},
 nirvana:{name:'涅槃',desc:'每场战斗一次，死亡时满血复活；不重置冷却、护盾或其他计数。',sourceApproved:true,mechanicsReady:true,enabled:true},
 reaper:{name:'死神',desc:'每个命中段、每个仍存活目标独立2%判定；首领同样有效。',chance:.02,sourceApproved:true,mechanicsReady:true,enabled:true},
 multicast:{name:'多重施法',desc:'主动技能后15%概率追加一次，不递归、不额外消耗或重置冷却；算一次真实主动施法，无存活敌人则不追加。',chance:.15,sourceApproved:true,mechanicsReady:true,enabled:true}
});
// Player lifesteal: every 10 rating converts 1% of eligible actual HP damage.
// Only missing HP limits recovery; no diminishing returns or per-cast HP ceiling.
export const LIFESTEAL_CANDIDATE_CONFIG=freeze({enabled:true,ratingScale:1000,eligibleSources:['basic','active']});
// Already-effective equipment rating may include divine's approved normal-affix modifier.
// No clock is read internally: the caller supplies the simulation clock for online/offline parity.
export function effectiveLuck({talent=0,equipment=0,potion=null,now=0}={}){
 if(!nonnegative(talent)||!nonnegative(equipment)||!clock(now))return null;
 let active=0;if(potion!==null){if(!potion||!nonnegative(potion.value)||!clock(potion.endAt))return null;if(potion.endAt>now)active=potion.value;}
 const total=talent+equipment+active;return nonnegative(total)?total:null;
}
export function calculateLifesteal({rating,maxHp,currentHp,hits},config=LIFESTEAL_CANDIDATE_CONFIG){
 if(!nonnegative(rating)||!nonnegative(maxHp)||maxHp<=0||!nonnegative(currentHp)||currentHp>maxHp||!Array.isArray(hits)||!config||typeof config.enabled!=='boolean'||!nonnegative(config.ratingScale)||config.ratingScale<=0||!Array.isArray(config.eligibleSources))return null;
 const seen=new Set();let actualHpDamage=0;
 for(const h of hits){if(!h||!id(h.hitId)||seen.has(h.hitId)||!nonnegative(h.hpBefore)||!nonnegative(h.hpAfter)||typeof h.source!=='string')return null;seen.add(h.hitId);if(config.eligibleSources.includes(h.source))actualHpDamage+=Math.max(0,h.hpBefore-h.hpAfter);}
 if(!Number.isFinite(actualHpDamage))return null;
 const rate=config.enabled?rating/config.ratingScale:0,cap=maxHp-currentHp;
 return {heal:currentHp<=0?0:Math.min(cap,actualHpDamage*rate),actualHpDamage,rate,cap};
}
export function openingShelterShield({hasShelter,maxHp,flatBonus=0,alreadyApplied=false}){
 if(typeof hasShelter!=='boolean'||typeof alreadyApplied!=='boolean'||!nonnegative(maxHp)||!nonnegative(flatBonus))return null;
 return hasShelter&&!alreadyApplied?Math.floor(maxHp*.15)+flatBonus:0;
}
// Caller owns battleId lifetime (individual encounter vs dungeon run remains an integration policy).
export function createBattleAffixState(battleId){return id(battleId)?{version:1,battleId,nirvanaUsed:false,lastReaperCastId:null,reaperHits:[]}:null;}
export function validBattleAffixState(s){return !!s&&s.version===1&&id(s.battleId)&&typeof s.nirvanaUsed==='boolean'&&(s.lastReaperCastId===undefined||s.lastReaperCastId===null||id(s.lastReaperCastId))&&Array.isArray(s.reaperHits)&&s.reaperHits.length<=4096&&new Set(s.reaperHits).size===s.reaperHits.length&&s.reaperHits.every(x=>typeof x==='string'&&x.length<=1000);}
export function tryNirvana(s,{battleId,hasNirvana,hp,maxHp}){
 if(!validBattleAffixState(s)||battleId!==s.battleId||typeof hasNirvana!=='boolean'||!Number.isFinite(hp)||!nonnegative(maxHp)||maxHp<=0)return null;
 const revived=hasNirvana&&hp<=0&&!s.nirvanaUsed;return {state:{...s,reaperHits:[...s.reaperHits],nirvanaUsed:s.nirvanaUsed||revived},revived,hp:revived?maxHp:hp};
}
export function tryReaperHit(s,{battleId,castId,hitIndex,targetId,hit,targetHp,hasReaper},random=Math.random){
 if(!validBattleAffixState(s)||battleId!==s.battleId||!id(castId)||!id(targetId)||!Number.isSafeInteger(hitIndex)||hitIndex<0||typeof hit!=='boolean'||typeof hasReaper!=='boolean'||!nonnegative(targetHp)||typeof random!=='function')return null;
 const key=JSON.stringify([hitIndex,targetId]),hits=s.lastReaperCastId===castId?s.reaperHits:[];if(hits.includes(key))return {state:s,triggered:false,targetHp,reason:'already-processed'};
 if(hits.length>=4096)return null;const state={...s,lastReaperCastId:castId,reaperHits:[...hits,key]};if(!hasReaper||!hit||targetHp===0)return {state,triggered:false,targetHp,reason:'ineligible'};
 let roll;try{roll=random();}catch{return null;}if(!Number.isFinite(roll)||roll<0||roll>=1)return null;
 const triggered=roll<SPECIAL_AFFIX_EXPANSION.reaper.chance;return {state,triggered,targetHp:triggered?0:targetHp,roll};
}
// Approved: one extra active cast, no recursion or cooldown payment; caller executes original skill.
export function tryMulticast(context,{enabled=true,eligibleSources=['active'],allowTriggeredCasts=false,countAsActiveCast=true}={},random=Math.random){
 if(!enabled)return {triggered:false,reason:'policy-disabled'};
 if(!context||!Array.isArray(eligibleSources)||typeof allowTriggeredCasts!=='boolean'||countAsActiveCast!==true||allowTriggeredCasts!==false||typeof context.triggered!=='boolean'||typeof context.hasLivingEnemies!=='boolean'||typeof random!=='function')return null;
 if(!context.hasLivingEnemies||!eligibleSources.includes(context.source)||context.triggered&&!allowTriggeredCasts)return {triggered:false,reason:'ineligible'};
 let roll;try{roll=random();}catch{return null;}if(!Number.isFinite(roll)||roll<0||roll>=1)return null;
 return {triggered:roll<.15,roll,countAsActiveCast};
}

export const NEW_ORDINARY_AFFIX_DEFS=ORDINARY_AFFIX_CANDIDATES;
export const NEW_SPECIAL_DEFS=SPECIAL_AFFIX_EXPANSION;
export const READY_SPECIAL_KEYS=Object.freeze(Object.keys(NEW_SPECIAL_DEFS).filter(k=>NEW_SPECIAL_DEFS[k].mechanicsReady&&NEW_SPECIAL_DEFS[k].enabled));
export function lifestealRate(rating){return nonnegative(rating)?rating/LIFESTEAL_CANDIDATE_CONFIG.ratingScale:0;}
export function lifestealHeal({rating,damage,maxHp,currentHp,alreadyHealed=0}){
 if(![rating,damage,maxHp,currentHp,alreadyHealed].every(nonnegative)||maxHp<=0||currentHp<=0||currentHp>maxHp)return 0;
 return Math.min(maxHp-currentHp,damage*lifestealRate(rating));
}
// Convenience adapters for a caller that already processes each hit exactly once.
export function rollReaper({hit,targetAlive,equipped},random=Math.random){if(!equipped||hit!==true||targetAlive!==true||typeof random!=='function')return false;let roll;try{roll=random();}catch{return false;}return Number.isFinite(roll)&&roll>=0&&roll<.02;}
export function applyNirvana(encounter,maxHp,specials,logs=[]){
 if(!encounter||!validBattleAffixState(encounter.affixState))return false;
 const result=tryNirvana(encounter.affixState,{battleId:encounter.affixState.battleId,hasNirvana:!!specials?.nirvana,hp:encounter.heroHp,maxHp});
 if(!result?.revived)return false;encounter.affixState=result.state;encounter.heroHp=result.hp;logs.push('涅槃 · 满血复活（本场已使用）');return true;
}
