// Pure guarded receipt seam: importing engine/factory here creates a race-registry cycle.
// Only the story controller consumes this receipt and atomically receives/equips the item.
export const ASHEN_STORY_CORE_ID='ashen-primal-core';
export const ASHEN_STORY_CORE_QUESTS=Object.freeze(['C05.EA02.ashen']);
export function grantAshenStoryCore(state,{questId}={}){
 if(state?.race!=='ashen')return {ok:false,reason:'wrong-race'};
 if((state.inventory??[]).some(item=>item.legendaryId===ASHEN_STORY_CORE_ID)||(state.storyRewards??[]).includes(ASHEN_STORY_CORE_ID)||state.taskRewardClaims?.includes('story.ashen-primal-core'))return {ok:false,reason:'already-granted'};
 const st=state.story,a=st?.activeScene,receipt=st?.encounters?.find(e=>e.sceneId==='C05.EA01.ashen');
 if(!ASHEN_STORY_CORE_QUESTS.includes(questId)||state.version!==6||st?.version!==1||st.pov!=='ashen'||a?.id!==questId||!a.choiceId||!st.completedScenes?.includes('C05.EA01.ashen')||receipt?.scenarioId!=='story.c05.ashen-duel'||receipt.result!=='ashen-victory'||state.siteId!=='ashen.a04'||state.running||state.activeEncounter&&!state.activeEncounter.rewarded)return {ok:false,reason:'story-unavailable'};
 const level=st.acceptedLevels?.['C05.EA01.ashen'];if(!Number.isSafeInteger(level)||level<1||level>=100000)return {ok:false,reason:'invalid-state'};
 return {ok:true,questId,claimId:'story.ashen-primal-core',id:'story-ashen-primal-core',legendaryId:ASHEN_STORY_CORE_ID,level};
}
