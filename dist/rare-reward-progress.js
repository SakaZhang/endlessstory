// v2 counts generated dungeon equipment, never clears. v1 unearned progress is retired.
export const RARE_REWARD_RULES=Object.freeze({dungeonPity:20,pendingSetLimit:1000,pendingFruitLimit:1e9});
export function freshRareRewardProgress(){return {version:2,dungeonDryStreak:0,pendingSets:[],pendingFruit:0};}
export function normalizeRareRewardProgress(s){
 const p=s.rareRewardProgress;
 if(!p)return s.rareRewardProgress=freshRareRewardProgress();
 if(p.version===1){p.version=2;p.dungeonDryStreak=0;delete p.fruitProgress;}
 return p;
}
export function validRareRewardProgress(s,validItem){
 const p=s.rareRewardProgress;if(p===undefined)return true;
 const int=(n,max)=>Number.isSafeInteger(n)&&n>=0&&n<=max;
 const keys=p?.version===1?['version','dungeonDryStreak','fruitProgress','pendingSets','pendingFruit']:['version','dungeonDryStreak','pendingSets','pendingFruit'];
 if(!p||typeof p!=='object'||![1,2].includes(p.version)||Object.keys(p).length!==keys.length||!keys.every(k=>Object.hasOwn(p,k))||!int(p.dungeonDryStreak,19)||(p.version===1&&!int(p.fruitProgress,19))||!int(p.pendingFruit,RARE_REWARD_RULES.pendingFruitLimit)||!Array.isArray(p.pendingSets)||p.pendingSets.length>RARE_REWARD_RULES.pendingSetLimit)return false;
 const ids=new Set((s.inventory??[]).map(it=>it.id));
 return p.pendingSets.every(it=>{if(!it?.set||it.rarity!==3||!validItem(it)||ids.has(it.id))return false;ids.add(it.id);return true;});
}
// Reserve room for both an equipment-event replacement and independent clear set.
export function rareRewardStorageBlocked(s){const p=s.rareRewardProgress;return !!p&&(p.pendingSets.length>RARE_REWARD_RULES.pendingSetLimit-2||p.pendingFruit>=RARE_REWARD_RULES.pendingFruitLimit);}
