// Optional v1 state: old saves start at zero, never infer historical rewards.
export const RARE_REWARD_RULES=Object.freeze({fruitPoints:20,dungeonPoints:1,bossPoints:3,dungeonPity:20,pendingSetLimit:1000,pendingFruitLimit:1e9});
export function freshRareRewardProgress(){return {version:1,dungeonDryStreak:0,fruitProgress:0,pendingSets:[],pendingFruit:0};}
export function validRareRewardProgress(s,validItem){
 const p=s.rareRewardProgress;if(p===undefined)return true;
 const int=(n,max)=>Number.isSafeInteger(n)&&n>=0&&n<=max;
 if(!p||typeof p!=='object'||Object.keys(p).length!==5||p.version!==1||!int(p.dungeonDryStreak,19)||!int(p.fruitProgress,19)||!int(p.pendingFruit,RARE_REWARD_RULES.pendingFruitLimit)||!Array.isArray(p.pendingSets)||p.pendingSets.length>RARE_REWARD_RULES.pendingSetLimit)return false;
 const ids=new Set((s.inventory??[]).map(it=>it.id));
 return p.pendingSets.every(it=>{if(!it?.set||it.rarity!==3||!validItem(it)||ids.has(it.id))return false;ids.add(it.id);return true;});
}
export function rareRewardStorageBlocked(s){const p=s.rareRewardProgress;return !!p&&(p.pendingSets.length>=RARE_REWARD_RULES.pendingSetLimit||p.pendingFruit>=RARE_REWARD_RULES.pendingFruitLimit);}
