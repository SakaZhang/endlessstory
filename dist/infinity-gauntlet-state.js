import {INFINITY_GAUNTLET_ID,INFINITY_GAUNTLET_MATERIALS} from './infinity-gauntlet-content.js';
const plain=o=>!!o&&typeof o==='object'&&!Array.isArray(o);
export function infinityRecipeKnown(s){return s?.infinityGauntlet?.recipeLearned===true;}
export function validInfinityGauntletState(s){
 if(!plain(s))return false;
 const state=s.infinityGauntlet,items=[...(s.inventory??[]),...(s.pendingForgeClaim?.item?[s.pendingForgeClaim.item]:[])].filter(it=>it.legendaryId===INFINITY_GAUNTLET_ID);
 if(items.length>1)return false;
 if(state===undefined)return items.length===0;
 return plain(state)&&Object.keys(state).length===4&&state.version===1&&state.recipeLearned===true&&typeof state.crafted==='boolean'&&(state.crafted?typeof state.craftedItemId==='string'&&state.craftedItemId.length>0&&state.craftedItemId.length<=160:state.craftedItemId===null)&&(!items.length||state.crafted&&items[0].id===state.craftedItemId);
}
export function infinityMaterialUsage(s,material){return INFINITY_GAUNTLET_MATERIALS.some(m=>m.material===material)?'五族至臻宝石各1颗，在熔炉融合固定获得无限手套；无需配方。':null;}
// Legacy exports and learned records remain readable; fusion no longer drops or requires a recipe.
export function settleInfinityRecipe(){return false;}
