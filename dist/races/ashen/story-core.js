// Future main-story reward seam. No quest is registered until the actual story is authored.
// This is not a player claim endpoint, free grant, boss drop, recipe, or merchant offer.
export const ASHEN_STORY_CORE_ID='ashen-primal-core';
export const ASHEN_STORY_CORE_QUESTS=Object.freeze([]);
export function grantAshenStoryCore(state,{questId}={}){
 if(state?.race!=='ashen')return {ok:false,reason:'wrong-race'};
 if((state.inventory??[]).some(item=>item.legendaryId===ASHEN_STORY_CORE_ID)||(state.storyRewards??[]).includes(ASHEN_STORY_CORE_ID))return {ok:false,reason:'already-granted'};
 if(!ASHEN_STORY_CORE_QUESTS.includes(questId))return {ok:false,reason:'story-unavailable'};
 // A real quest completion validator and atomic unique receipt must be integrated here,
 // before a future quest may be added to the registry. Fail closed in this release.
 return {ok:false,reason:'story-unavailable'};
}
