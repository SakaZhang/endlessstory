import {INFINITY_GAUNTLET_ID,INFINITY_GAUNTLET_MATERIALS,INFINITY_RECIPE_DROP_CHANCE} from './infinity-gauntlet-content.js';
const plain=o=>!!o&&typeof o==='object'&&!Array.isArray(o);
export function infinityRecipeKnown(s){return s?.infinityGauntlet?.recipeLearned===true;}
export function validInfinityGauntletState(s){
 if(!plain(s))return false;
 const state=s.infinityGauntlet,items=[...(s.inventory??[]),...(s.pendingForgeClaim?.item?[s.pendingForgeClaim.item]:[])].filter(it=>it.legendaryId===INFINITY_GAUNTLET_ID);
 if(items.length>1)return false;
 if(state===undefined)return items.length===0;
 return plain(state)&&Object.keys(state).length===4&&state.version===1&&state.recipeLearned===true&&typeof state.crafted==='boolean'&&(state.crafted?typeof state.craftedItemId==='string'&&state.craftedItemId.length>0&&state.craftedItemId.length<=160:state.craftedItemId===null)&&(!items.length||state.crafted&&items[0].id===state.craftedItemId);
}
export function infinityMaterialUsage(s,material){return infinityRecipeKnown(s)&&INFINITY_GAUNTLET_MATERIALS.some(m=>m.material===material)?'无限手套配方材料':null;}
// Called inside the validated production settlement's seeded RNG scope.
export function settleInfinityRecipe(s,e,{random=Math.random,instances}={}){
 const node=instances?.[e?.instanceId];
 if(!validInfinityGauntletState(s)||infinityRecipeKnown(s)||s.developmentEquipmentSandbox||s.activeEncounter!==e||!e?.done||!e.win||!e.rewarded||e.developmentFixture||e.storyScenario||e.kind!=='dungeon'||e.dungeonStage!==3||!node||node.kind!=='dungeon'||node.areaId!==e.areaId||e.infinityRecipeRolled)return false;
 const roll=random();if(!Number.isFinite(roll)||roll<0||roll>=1)return false;
 e.infinityRecipeRolled=true;
 if(roll>=INFINITY_RECIPE_DROP_CHANCE)return false;
 s.infinityGauntlet={version:1,recipeLearned:true,crafted:false,craftedItemId:null};
 e.rewardNotes??=[];e.rewardNotes.push('永久学会 · 无限手套图样');return true;
}
