// Level cap is independent of story completion and never stops an expedition.
export const CHARACTER_LEVEL_CAP=100;
export function planExperience(progress,amount){
 const {level,xp}=progress??{};
 if(!Number.isSafeInteger(level)||level<1||level>=100000||!Number.isFinite(xp)||xp<0||xp>1e12||!Number.isFinite(amount)||amount<0||amount>1e12)throw new RangeError('Invalid experience progression');
 if(level>=CHARACTER_LEVEL_CAP)return {level,xp,acceptedXp:0,ignoredXp:amount,levelsGained:0,reachedCap:false,capped:true};
 if(xp+amount>1e12)throw new RangeError('Experience overflow');
 let nextLevel=level,nextXp=xp+amount;
 while(nextLevel<CHARACTER_LEVEL_CAP&&nextXp>=nextLevel*80){nextXp-=nextLevel*80;nextLevel++;}
 return {level:nextLevel,xp:nextXp,acceptedXp:amount,ignoredXp:0,levelsGained:nextLevel-level,reachedCap:nextLevel===CHARACTER_LEVEL_CAP,capped:nextLevel>=CHARACTER_LEVEL_CAP};
}
export function applyExperience(progress,amount){const result=planExperience(progress,amount);progress.level=result.level;progress.xp=result.xp;return result;}
