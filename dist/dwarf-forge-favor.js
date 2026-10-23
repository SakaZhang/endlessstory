// Racial policy only. No RNG, item mutation, costs, eligibility override or live defaults.
import {affixOwnRange} from './affix-range.js';
const probability=x=>Number.isFinite(x)&&x>=0&&x<=1;
const clamp=x=>Math.min(1,Math.max(0,x));
const raceValid=race=>typeof race==='string'&&race.length>0;
/** Merge two opportunities into ONE best-of-two decision; never apply a third draw. */
export function combinedFavorableRollChance(luckChance,race,config,{eligible=true}={}){
 if(!probability(luckChance)||!raceValid(race)||typeof eligible!=='boolean')return null;
 if(!eligible)return 0;if(race!=='dwarf')return luckChance;
 if(!probability(config?.secondRollChance))return null;
 return clamp(1-(1-luckChance)*(1-config.secondRollChance));
}
/** Input already includes the existing luck multiplier. Eligibility zero stays zero. */
export function dwarfDivineChance(afterLuckBase,race,config){
 if(!probability(afterLuckBase)||!raceValid(race))return null;if(afterLuckBase===0||race!=='dwarf')return afterLuckBase;
 if(!Number.isFinite(config?.divineRelativeBonus)||config.divineRelativeBonus<0)return null;
 return clamp(afterLuckBase*(1+config.divineRelativeBonus));
}
/** Only probability changes. No luck argument, price, enhancement amount or failure policy. */
export function dwarfEnhancementChance(base,race,config){
 if(!probability(base)||!raceValid(race))return null;if(base===0||race!=='dwarf')return base;
 if(!probability(config?.enhancementBonus))return null;
 return clamp(base+config.enhancementBonus);
}
/** Raw source provenance, never target quality or displayed divine-enhanced value. */
export function donorSourcePercentile(affix,defs){
 try{
  if(!Number.isFinite(affix?.value))return .5;
  const range=affixOwnRange(affix,defs);
  if(!range||!Number.isFinite(range.min)||!Number.isFinite(range.max)||range.max<=range.min)return .5;
  return clamp((affix.value-range.min)/(range.max-range.min));
 }catch{return .5;}
}
export function donorFavorWeight(affix,defs,race,config){
 if(!raceValid(race))return null;if(race!=='dwarf')return 1;
 if(!Number.isFinite(config?.donorTilt)||config.donorTilt<0||config.donorTilt>1e6)return null;
 // Positive baseline keeps EVERY already-eligible source possible.
 return 1+config.donorTilt*donorSourcePercentile(affix,defs);
}
/** Caller supplies the one existing selection roll; singleton needs no random input. */
export function weightedDonorIndex(affixes,defs,race,config,unitRoll){
 if(!Array.isArray(affixes)||!affixes.length||affixes.length>100||Array.from(affixes).some(a=>!a||typeof a!=='object'||Array.isArray(a)))return null;
 const weights=affixes.map(a=>donorFavorWeight(a,defs,race,config));if(weights.some(w=>w===null))return null;
 if(affixes.length===1)return 0;
 if(!Number.isFinite(unitRoll)||unitRoll<0||unitRoll>=1)return null;
 let target=unitRoll*weights.reduce((a,b)=>a+b,0);
 for(let i=0;i<weights.length;i++){target-=weights[i];if(target<0)return i;}
 return weights.length-1;
}
/** Eligible special occurrence on NEW forge outputs only; caller gates source and eligibility.
 * Deliberately independent of divineRelativeBonus. Guaranteed occurrence stays guaranteed.
 */
export function dwarfForgeOccurrenceChance(afterLuckBase,race,config){
 if(!probability(afterLuckBase)||!raceValid(race))return null;
 if(afterLuckBase===0||race!=='dwarf')return afterLuckBase;
 const bonus=config?.occurrenceRelativeBonus;
 if(!Number.isFinite(bonus)||bonus<0||bonus>1e6)return null;
 return clamp(afterLuckBase*(1+bonus));
}
