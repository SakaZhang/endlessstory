// Read-only batch limits; the existing engine quote and paid transaction remain authoritative.
import {RECIPES,RECOVERY_RECIPE_CONFIG,eligibleRecoveryMaterials,eligiblePotionRecipeMaterials,canReceiveItem,recipeKnown} from './engine.js';
export function receivablePotionQuantity(s,type,quality,limit=999){
 let low=0,high=Math.max(0,Math.min(999,Math.floor(limit)));const key=type+'|'+quality;
 while(low<high){const middle=Math.ceil((low+high)/2);if(canReceiveItem(s,key,middle))low=middle;else high=middle-1;}
 return low;
}
export function maxPotionRecipeBatch(s,id,quality,{mainKey,auxKey}={}){
 const recipe=RECIPES[id];if(!recipe||!recipeKnown(s,id)||s.pendingForgeClaim||!Number.isInteger(quality)||quality<0||quality>3)return 0;
 const main=eligiblePotionRecipeMaterials(s,id,'main',quality).find(m=>m.key===mainKey),aux=eligiblePotionRecipeMaterials(s,id,'aux',quality).find(m=>m.key===auxKey);if(!main||!aux)return 0;
 const stock=mainKey===auxKey?Math.floor(main.count/2):Math.min(main.count,aux.count),gold=Math.floor(s.gold/recipe.craftGoldByQuality[quality]);
 return receivablePotionQuantity(s,recipe.potionType,quality,Math.min(999,stock,gold));
}
export function maxRecoveryBatch(s,quality){
 if(!recipeKnown(s,'potion-healing')||s.pendingForgeClaim||!Number.isInteger(quality)||quality<0||quality>3)return 0;
 const stock=eligibleRecoveryMaterials(s,quality).reduce((sum,m)=>sum+m.count,0),gold=Math.floor(s.gold/RECOVERY_RECIPE_CONFIG.coinCosts[quality]);
 return receivablePotionQuantity(s,'healing',quality,Math.min(RECOVERY_RECIPE_CONFIG.maxBatch,stock,gold));
}
export function recoveryBatchQuantities(s,quality,quantity,preferred={}){
 if(!Number.isSafeInteger(quantity)||quantity<0||quantity>RECOVERY_RECIPE_CONFIG.maxBatch)return null;
 const rows=eligibleRecoveryMaterials(s,quality).sort((a,b)=>Number(!!preferred[b.key])-Number(!!preferred[a.key])||a.key.localeCompare(b.key)),out={};let left=quantity;
 for(const row of rows){const count=Math.min(left,row.count);if(count){out[row.key]=count;left-=count;}if(!left)break;}
 return left?null:out;
}
