import {returnRingExperienceBonus} from './return-ring-state.js';
export const CHARACTER_LEVEL_CAP=100;
export const CHARACTER_SAFE_LEVEL_CAP=99999;
export const POST_100_XP=7920;
export function getXpRequirement(progressOrLevel){const level=typeof progressOrLevel==='number'?progressOrLevel:progressOrLevel?.level;return level>=100?POST_100_XP:level*80;}
export function isLevelCapped(s){return s.level>=CHARACTER_SAFE_LEVEL_CAP||s.level>=CHARACTER_LEVEL_CAP&&s.otherworld?.stoneUsed!==true;}
// Receipt accounting must use the same piecewise curve as the award loop.
export function totalEarnedXp(s){const l=s.level;return (l<=100||s.otherworld?.stoneUsed!==true?40*l*(l-1):396000+(l-100)*POST_100_XP)+s.xp;}
export function planExperience(progress,amount){
 const {level,xp}=progress??{};
 if(!Number.isSafeInteger(level)||level<1||level>=100000||!Number.isFinite(xp)||xp<0||xp>1e12||!Number.isFinite(amount)||amount<0||amount>1e12)throw new RangeError('Invalid experience progression');
 if(isLevelCapped(progress))return {level,xp,acceptedXp:0,ignoredXp:amount,levelsGained:0,reachedCap:false,capped:true};
 if(xp+amount>1e12)throw new RangeError('Experience overflow');
 const cap=progress.otherworld?.stoneUsed===true?CHARACTER_SAFE_LEVEL_CAP:CHARACTER_LEVEL_CAP;
 let nextLevel=level,nextXp=xp+amount;
 while(nextLevel<cap&&nextXp>=getXpRequirement(nextLevel)){nextXp-=getXpRequirement(nextLevel);nextLevel++;}
 return {level:nextLevel,xp:nextXp,acceptedXp:amount,ignoredXp:0,levelsGained:nextLevel-level,reachedCap:nextLevel===cap,capped:nextLevel>=cap};
}
export function applyExperience(progress,amount){
 const base=planExperience(progress,amount),bonus=returnRingExperienceBonus(progress);
 const result=bonus&&base.acceptedXp>0?planExperience(progress,Math.floor(amount*(1+bonus))):base;
 progress.level=result.level;progress.xp=result.xp;return result;
}
