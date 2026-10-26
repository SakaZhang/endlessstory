import {RETURN_RING_ID,RETURN_RING_RECIPE_FLAG,RETURN_RING_MATERIALS,RETURN_RING_DROP_POLICY} from './return-ring-content.js';
const plain=o=>!!o&&typeof o==='object'&&!Array.isArray(o);
export function returnRingRecipeKnown(s){return s?.returnRing?.recipeLearned===true;}
export function validReturnRingState(s){
 if(!plain(s))return false;const state=s.returnRing;
 const rings=[...(s.inventory??[]),...(s.pendingForgeClaim?.item?[s.pendingForgeClaim.item]:[])].filter(it=>it.legendaryId===RETURN_RING_ID);
 if(rings.length>1)return false;
 if(state===undefined)return rings.length===0;
 return plain(state)&&Object.keys(state).length===4&&state.version===1&&state.recipeLearned===true&&typeof state.crafted==='boolean'&&(state.crafted?typeof state.craftedItemId==='string'&&state.craftedItemId.length>0&&state.craftedItemId.length<=160:state.craftedItemId===null)&&(!rings.length||state.crafted&&rings[0].id===state.craftedItemId);
}
// Called from a real story result/restore only. No optional branch or item needed.
export function syncReturnRingRecipe(s){
 if(!validReturnRingState(s)||!Array.isArray(s.story?.flags)||!s.story.flags.includes(RETURN_RING_RECIPE_FLAG)||returnRingRecipeKnown(s))return false;
 s.returnRing={version:1,recipeLearned:true,crafted:false,craftedItemId:null};return true;
}
export function returnRingMaterialUsage(s,material){return returnRingRecipeKnown(s)&&RETURN_RING_MATERIALS.some(m=>m.material===material)?'归途之环配方材料':null;}
export function equippedReturnRing(s){
 const ids=new Set([s.equip?.ring1,s.equip?.ring2].filter(Boolean));return (s.inventory??[]).find(it=>ids.has(it.id)&&it.legendaryId===RETURN_RING_ID&&it.exclusive?.id==='return-home')??null;
}
export function applyReturnRingVictory(s,e,maxHp){
 if(!equippedReturnRing(s)||s.activeEncounter!==e||!e?.done||!e.win||!e.rewarded||e.developmentFixture||!Number.isFinite(maxHp)||maxHp<=0)return false;
 s.heroHp=maxHp;e.heroHp=maxHp;e.rewardNotes??=[];e.rewardNotes.push('归途之环 · 生命已回满');return true;
}
export function validReturnRingDropPolicy(policy){return !!policy&&policy.approved===true&&Number.isFinite(policy.bonusPP)&&policy.bonusPP>=0&&policy.bonusPP<=1&&Array.isArray(policy.pools)&&policy.pools.length>0&&new Set(policy.pools).size===policy.pools.length&&policy.pools.every(p=>['boss-legendary','material-special','material-gem'].includes(p));}
export function returnRingRareBonus(s,pool,policy=RETURN_RING_DROP_POLICY){return equippedReturnRing(s)&&validReturnRingDropPolicy(policy)&&policy.pools.includes(pool)?policy.bonusPP:0;}
