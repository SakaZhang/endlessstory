import {racialGoldCost} from './race-economy.js';
import {dwarfEnhancementChance} from './dwarf-forge-favor.js';
import {DWARF_FORGE_FAVOR_CONFIG} from './dwarf-forge-favor-config.js';
import {validLegendaryEquipmentMetadata} from './legendary-equipment.js';
import {CONFIG as FORMAL_BUDGET,enhanceRawBase,enhancementFee} from './equipment-budget.js';
// Candidate magnitude/cost are explicit developer configuration, never formal defaults.
export const DEVELOPMENT_ENHANCEMENT_CONFIG=Object.freeze({id:'development-budget-v1',successRates:Object.freeze([.9,.8,.6,.4,.2]),qualityOffsets:Object.freeze([0,3,7,10]),targetCostWeights:Object.freeze([1,2,3,5,8]),budgetPerLevel:.8,maxLevel:5});
const copy=x=>structuredClone(x),number=x=>Number.isFinite(x)&&x>=0&&x<=1e12;
const freeze=x=>{if(x&&typeof x==='object'){Object.values(x).forEach(freeze);Object.freeze(x);}return x;};
const prepared=new WeakMap(),bad=reason=>({ok:false,reason});
export function validEnhancementMetadata(it){if(!it||typeof it!=='object'||Array.isArray(it))return false;const e=it.enhancement;return e===undefined||!!e&&typeof e==='object'&&!Array.isArray(e)&&Object.keys(e).length===3&&((e.version===1&&e.model===DEVELOPMENT_ENHANCEMENT_CONFIG.id)||(e.version===2&&e.model===FORMAL_BUDGET.id))&&Number.isInteger(e.level)&&e.level>=0&&e.level<=5;}
export function enhancementLevel(it){return validEnhancementMetadata(it)?it.enhancement?.level??0:null;}
export function enhancedItemBase(it,{development=false,level=enhancementLevel(it)}={}){
 if(!it||!['atk','armor','hp'].every(k=>number(it[k]))||!Number.isInteger(level)||level<0||level>5)return null;
 if(it.enhancement?.model===FORMAL_BUDGET.id){try{const base=enhanceRawBase(Object.fromEntries(['atk','armor','hp'].map(k=>[k,it[k]])),level);return Object.values(base).every(number)?base:null;}catch{return null;}}
 let multiplier=1;if(development){if(!number(it.level)||!Number.isInteger(it.rarity)||it.rarity<0||it.rarity>3)return null;multiplier+=.8*level/(it.level+10+DEVELOPMENT_ENHANCEMENT_CONFIG.qualityOffsets[it.rarity]);}
 const base=Object.fromEntries(['atk','armor','hp'].map(k=>[k,it[k]*multiplier]));return Object.values(base).every(number)?base:null;
}
function businessFingerprint(s,id){const it=s?.inventory?.find(i=>i.id===id);return JSON.stringify({item:it,gold:s?.gold,development:s?.developmentEquipmentSandbox===true,running:!!s?.running,active:!!s?.activeEncounter&&!s.activeEncounter.done,pending:s?.pendingReforge?.itemId===id});}
function allowed(s,it){return s?.developmentEquipmentSandbox===true&&it&&!it.legendaryId&&!s.running&&!(s.activeEncounter&&!s.activeEncounter.done)&&s.pendingReforge?.itemId!==it.id&&validEnhancementMetadata(it);}
export function quoteDeveloperEnhancement(s,itemId){
 const it=s?.inventory?.find(i=>i.id===itemId);if(!allowed(s,it))return bad('unavailable');if(it.enhancement?.model===FORMAL_BUDGET.id)return bad('formal-model');const level=enhancementLevel(it);if(level===5)return bad('at-maximum');
 const cost={gold:Math.ceil((2+it.level/10)*(1+.25*it.rarity))*DEVELOPMENT_ENHANCEMENT_CONFIG.targetCostWeights[level],materials:[]};if(!Number.isSafeInteger(cost.gold)||cost.gold<1||!number(s.gold)||s.gold<cost.gold)return bad('insufficient-gold');
 const bases={current:enhancedItemBase(it,{development:true}),success:enhancedItemBase(it,{development:true,level:level+1}),failure:enhancedItemBase(it,{development:true,level:Math.max(0,level-1)})};if(Object.values(bases).some(x=>!x))return bad('invalid-base');
 return freeze({ok:true,version:1,model:DEVELOPMENT_ENHANCEMENT_CONFIG.id,itemId,fromLevel:level,targetLevel:level+1,successRate:DEVELOPMENT_ENHANCEMENT_CONFIG.successRates[level],cost,bases,stateFingerprint:businessFingerprint(s,itemId)});
}
export function prepareDeveloperEnhancement(s,quote,random=Math.random){
 if(!quote?.ok||typeof random!=='function'||businessFingerprint(s,quote.itemId)!==quote.stateFingerprint)return bad('stale-quote');const current=quoteDeveloperEnhancement(s,quote.itemId);if(!current.ok||JSON.stringify(current)!==JSON.stringify(quote))return bad('stale-quote');
 let receipt=prepared.get(quote);
 if(!receipt){let roll;try{roll=random();}catch{return bad('random-failed');}if(!Number.isFinite(roll)||roll<0||roll>=1)return bad('invalid-random');const success=roll<quote.successRate;receipt=freeze({itemId:quote.itemId,fromLevel:quote.fromLevel,toLevel:success?quote.targetLevel:Math.max(0,quote.fromLevel-1),success,cost:copy(quote.cost),roll});prepared.set(quote,receipt);}
 // Rebase the cached outcome onto current unrelated state: clocks/HP/other loot are never rolled back.
 const state=copy(s),it=state.inventory.find(x=>x.id===quote.itemId);state.gold-=quote.cost.gold;it.enhancement={version:1,model:DEVELOPMENT_ENHANCEMENT_CONFIG.id,level:receipt.toLevel};return freeze({ok:true,state,receipt:copy(receipt)});
}
export function attemptDeveloperEnhancement(s,quote,random=Math.random){const result=prepareDeveloperEnhancement(s,quote,random);if(!result.ok)return null;Object.assign(s,copy(result.state));return copy(result.receipt);}

// Formal enhancement is a paid transaction on the same item, never a reroll preview.
export const FORMAL_ENHANCEMENT_CONFIG=FORMAL_BUDGET;
const formalPrepared=new WeakMap();
function formalFingerprint(s,id){return JSON.stringify({race:s?.race,item:s?.inventory?.find(i=>i.id===id),gold:s?.gold,equipped:Object.values(s?.equip??{}).includes(id),running:!!s?.running,active:!!s?.activeEncounter&&!s.activeEncounter.done,pending:s?.pendingReforge?.itemId===id});}
function formalBase(it,level){try{const base=enhanceRawBase(Object.fromEntries(['atk','armor','hp'].map(k=>[k,it[k]])),level);return Object.values(base).every(number)?base:null;}catch{return null;}}
export function quoteEnhancement(s,itemId){
 const it=s?.inventory?.find(i=>i.id===itemId),equipped=Object.values(s?.equip??{}).includes(itemId);
 if(!it||(it.legendaryId&&!validLegendaryEquipmentMetadata(it))||!validEnhancementMetadata(it)||it.enhancement?.model===DEVELOPMENT_ENHANCEMENT_CONFIG.id||s?.pendingReforge?.itemId===itemId||equipped&&(s.running||s.activeEncounter&&!s.activeEncounter.done))return bad('unavailable');
 const level=enhancementLevel(it);if(level===5)return bad('at-maximum');
 let gold;try{gold=racialGoldCost(s,enhancementFee({level:it.level,quality:it.legendaryId?4:it.rarity,target:level+1}));}catch{return bad('invalid-item');}
 if(!Number.isSafeInteger(gold)||gold<1||gold>1e12||!number(s.gold)||s.gold<gold)return bad('insufficient-gold');
 const bases={current:formalBase(it,level),success:formalBase(it,level+1),failure:formalBase(it,Math.max(0,level-1))};if(Object.values(bases).some(x=>!x))return bad('invalid-base');
 return freeze({ok:true,version:2,model:FORMAL_BUDGET.id,itemId,fromLevel:level,targetLevel:level+1,baseSuccessRate:FORMAL_BUDGET.successRates[level],successRate:dwarfEnhancementChance(FORMAL_BUDGET.successRates[level],s.race??'legacy',DWARF_FORGE_FAVOR_CONFIG),finalSuccessRate:dwarfEnhancementChance(FORMAL_BUDGET.successRates[level],s.race??'legacy',DWARF_FORGE_FAVOR_CONFIG),cost:{gold,materials:[]},bases,stateFingerprint:formalFingerprint(s,itemId)});
}
export function prepareEnhancement(s,quote,random=Math.random){
 if(!quote?.ok||quote.version!==2||typeof random!=='function'||formalFingerprint(s,quote.itemId)!==quote.stateFingerprint)return bad('stale-quote');
 const current=quoteEnhancement(s,quote.itemId);if(!current.ok||JSON.stringify(current)!==JSON.stringify(quote))return bad('stale-quote');
 let receipt=formalPrepared.get(quote);if(!receipt){let roll;try{roll=random();}catch{return bad('random-failed');}if(!Number.isFinite(roll)||roll<0||roll>=1)return bad('invalid-random');const success=roll<quote.successRate;receipt=freeze({itemId:quote.itemId,fromLevel:quote.fromLevel,toLevel:success?quote.targetLevel:Math.max(0,quote.fromLevel-1),success,cost:copy(quote.cost),roll});formalPrepared.set(quote,receipt);}
 const state=copy(s),it=state.inventory.find(x=>x.id===quote.itemId);state.gold-=quote.cost.gold;it.enhancement={version:2,model:FORMAL_BUDGET.id,level:receipt.toLevel};return freeze({ok:true,state,receipt:copy(receipt)});
}
export function attemptEnhancement(s,quote,random=Math.random){const result=prepareEnhancement(s,quote,random);if(!result.ok)return null;Object.assign(s,copy(result.state));return copy(result.receipt);}
