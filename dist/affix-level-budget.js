// Level-scaled additive affixes. These are immutable item-source ranges, never
// live wearer stats. Rating/element/luck/lifesteal policies stay quality-only.
import {affixRange} from './equipment-budget.js';
export const LEVEL_AFFIX_MODEL='level-quality-v2';
export const LEVEL_AFFIX_CONFIG=Object.freeze({version:1,maxBudgetLevel:100,qualityScales:Object.freeze([1,1.04,1.08,1.12,1.232]),anchors:Object.freeze({atk:Object.freeze([3,6]),hp:Object.freeze([20,40]),armor:Object.freeze([3,6])})});
function reference(level){const b=40*1.025**(level-20);return {atk:14+3*level+2*b,hp:120+14*level+13*b,armor:105+level+2*b};}
const anchorReference=reference(20);
export function levelAffixRange(def,stat,sourceLevel,quality){
 // Reuse the existing definition/quality checks even for the three scaled keys.
 const old=affixRange(def,quality);
 if(typeof stat!=='string'||!stat||!Number.isSafeInteger(sourceLevel)||sourceLevel<1||sourceLevel>1e12)throw new RangeError('Invalid affix source level/stat');
 if(!Object.hasOwn(LEVEL_AFFIX_CONFIG.anchors,stat))return old;
 const scale=reference(Math.min(sourceLevel,100))[stat]/anchorReference[stat]*LEVEL_AFFIX_CONFIG.qualityScales[quality],bounds=LEVEL_AFFIX_CONFIG.anchors[stat];
 return {min:Math.max(1,Math.round(bounds[0]*scale)),max:Math.max(1,Math.round(bounds[1]*scale))};
}
