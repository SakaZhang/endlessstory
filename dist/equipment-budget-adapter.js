import {validLegendaryEquipmentMetadata} from './legendary-equipment.js';
import {CONFIG,deriveEquipmentBase} from './equipment-budget.js';
export const EQUIPMENT_BUDGET_MODEL=CONFIG.id;
const budgetKeys=['baseBudgetModel','budgetLevel','budgetSourceLevel','budgetCompatibility'];
// New-generation only: never call as an owned-inventory migration.
export function deriveNewItemBudget({slot,baseVariant,level,quality}){
 if(!Number.isSafeInteger(level)||level<1||level>1e12||!Number.isInteger(quality)||quality<0||quality>3)throw new RangeError('Unsupported item generation level/quality');
 const budgetLevel=Math.min(100,level);
 return {...deriveEquipmentBase({slot,baseVariant,level:budgetLevel,quality,enhancement:0}),baseBudgetModel:CONFIG.id,budgetLevel,budgetSourceLevel:level,...(level>100?{budgetCompatibility:'level-cap-100'}:{})};
}
export function validItemBudgetMetadata(it){
 if(!it||typeof it!=='object'||Array.isArray(it))return false;
 if(it.legendaryId)return validLegendaryEquipmentMetadata(it);
 if(it.budgetQuality!==undefined||it.legendaryBudget!==undefined||it.exclusive!==undefined)return false;
 if(it.baseBudgetModel===undefined)return budgetKeys.every(key=>it[key]===undefined);
 if(it.baseBudgetModel!==CONFIG.id||!Number.isSafeInteger(it.level)||it.level<1||it.level>1e12||it.budgetSourceLevel!==it.level||it.budgetLevel!==Math.min(100,it.level)||it.budgetCompatibility!==(it.level>100?'level-cap-100':undefined))return false;
 try{const expected=deriveNewItemBudget({slot:it.slot,baseVariant:it.baseVariant,level:it.level,quality:it.rarity});return ['atk','armor','hp'].every(k=>it[k]===expected[k]);}catch{return false;}
}
export function equipmentBudgetNotice(it){return it?.baseBudgetModel===CONFIG.id&&it.budgetSourceLevel>100?'基础数值采用100级封顶预算，显示等级与来源记录保留。':'';}
