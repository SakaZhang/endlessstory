export const RECOVERY_RECIPE_CONFIG=Object.freeze({maxBatch:999,outputPerUnit:1,coinCosts:Object.freeze([1,2,3,4]),fieldChance:.6,dungeonChance:.75,supplyUnits:3,clearExtra:2});
// Functional materials can substitute by tag, never by name or by a higher quality.
export function recoveryInputPlan(quality,inputs,registry){
 if(!Number.isInteger(quality)||quality<0||quality>3||!Array.isArray(inputs)||!inputs.length||inputs.length>RECOVERY_RECIPE_CONFIG.maxBatch)return null;
 const keys=new Set(),rows=[];let quantity=0;
 for(const row of inputs){
  if(!row||typeof row!=='object'||Array.isArray(row)||Object.keys(row).length!==2||typeof row.key!=='string'||!Number.isSafeInteger(row.quantity)||row.quantity<1)return null;
  const parts=row.key.split('|');if(parts.length!==2||parts[1]!==String(quality)||!registry[parts[0]]?.functionalTags?.includes('recoveryBase')||keys.has(row.key))return null;
  keys.add(row.key);quantity+=row.quantity;if(quantity>RECOVERY_RECIPE_CONFIG.maxBatch)return null;rows.push({key:row.key,quantity:row.quantity});
 }
 rows.sort((a,b)=>a.key.localeCompare(b.key));
 return {recipeId:'potion-healing',quality,quantity:quantity*RECOVERY_RECIPE_CONFIG.outputPerUnit,gold:RECOVERY_RECIPE_CONFIG.coinCosts[quality]*quantity,inputs:rows};
}
export function recoverySourceEligible(instance,area){
 return !!instance?.enabled&&area?.race==='dwarf'&&(['field','dungeon'].includes(instance.kind)?[1,2,3].includes(area.number):instance.kind==='boss'&&area.number===3);
}
export function rollRecoverySupply(instance,area,clear=false,random=Math.random){
 if(!recoverySourceEligible(instance,area)||instance.kind==='boss')return 0; // Area 3 boss content/rate is not implemented.
 if(random()>=(instance.kind==='field'?RECOVERY_RECIPE_CONFIG.fieldChance:RECOVERY_RECIPE_CONFIG.dungeonChance))return 0;
 return RECOVERY_RECIPE_CONFIG.supplyUnits+(instance.kind==='dungeon'&&clear?RECOVERY_RECIPE_CONFIG.clearExtra:0);
}
