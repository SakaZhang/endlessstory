import {RETURN_RING_DEFINITION} from './return-ring-content.js';
import {EXPANSION_PACKS} from './race-packs.js';
// Registered legendary factory. Reward-source eligibility remains in the engine.
// Fixed identity and budget are separate from transferable ordinary affixes.
import {CONFIG,deriveEquipmentBase,affixRange} from './equipment-budget.js';
import {validAffixSource} from './affix-range.js';
export const LEGENDARY_EQUIPMENT_DEFINITIONS=Object.freeze({
 'return-ring':RETURN_RING_DEFINITION,...Object.fromEntries(EXPANSION_PACKS.flatMap(p=>p.legendaries.map(d=>[d.id,d]))),
 'first-forge-oathhammer':Object.freeze({id:'first-forge-oathhammer',ready:true,name:'王统·初炉誓锤',slot:'weapon',baseVariant:'hammer_balanced',weaponType:'hammer',originRace:'dwarf',exclusiveId:'ancestor-echo'}),
 'everburning-reactor':Object.freeze({id:'everburning-reactor',ready:true,name:'不熄之炉',slot:'amulet',baseVariant:'amulet_survival',originRace:'dwarf',exclusiveId:'residual-heat-cycle'})
});
const copy=x=>structuredClone(x);
function draw(random){const r=random();if(!Number.isFinite(r)||r<0||r>=1)throw new RangeError('invalid RNG');return r;}
export function createLegendaryEquipment({id,legendaryId,level,baseLevel=level,levelSource='drop',definition=LEGENDARY_EQUIPMENT_DEFINITIONS[legendaryId],affixDefs,random=Math.random,rollValue=null}={}){
 try{
  if(typeof id!=='string'||!id||typeof legendaryId!=='string'||!legendaryId||!definition||definition.id!==legendaryId||definition.ready!==true||typeof definition.name!=='string'||!definition.name||typeof definition.exclusiveId!=='string'||!definition.exclusiveId||!Number.isSafeInteger(level)||level<1||level>1e12||!Number.isSafeInteger(baseLevel)||baseLevel<1||baseLevel>1e12||!['drop','material','equipment','generated','merchant','legacy','starter'].includes(levelSource))return null;
  const count=definition.ordinaryAffixCount??4;const keys=Object.keys(affixDefs??{});if(keys.length<count||(rollValue!==null&&typeof rollValue!=='function'))return null;
  // Validate the full injected pool before drawing; no partial RNG consumption on bad definitions.
  for(const key of keys)affixRange(affixDefs[key],4);
  const raw=deriveEquipmentBase({slot:definition.slot,baseVariant:definition.baseVariant,level:Math.min(level,100),quality:4,enhancement:0});
  const affixes=[];const pool=[...keys];
  for(let i=0;i<count;i++){
   const stat=pool.splice(Math.floor(draw(random)*pool.length),1)[0],range=affixRange(affixDefs[stat],4);
   const value=rollValue?rollValue({...range},random):range.min+Math.floor(draw(random)*(range.max-range.min+1));
   if(!Number.isSafeInteger(value)||value<range.min||value>range.max)return null;
   affixes.push({stat,value,sourceRange:{model:'quality-v1',quality:4,...range}});
  }
  return {id,legendaryId,name:definition.name,slot:definition.slot,rarity:3,budgetQuality:4,baseVariant:definition.baseVariant,level,baseLevel,levelSource,...raw,affixes,special:null,set:null,exclusive:{id:definition.exclusiveId},locked:false,bless:0,legendaryBudget:{model:CONFIG.id,quality:4,budgetLevel:Math.min(level,100),sourceLevel:level},...(definition.weaponType?{weaponType:definition.weaponType}:{}),originRace:definition.originRace??null};
 }catch{return null;}
}
// Ordinary refines may replace ordinary affixes only. Never transfer this identity payload.
export function legendaryIdentitySnapshot(item){
 if(!item?.legendaryId||!item?.exclusive)return null;
 return copy({legendaryId:item.legendaryId,exclusive:item.exclusive,budgetQuality:item.budgetQuality,legendaryBudget:item.legendaryBudget});
}

// Strict identity/base validation; caller supplies the live ordinary affix registry.
// This does not register or enable the legendary's combat effect or acquisition source.
export function validLegendaryEquipmentMetadata(it,affixDefs=null){
 try{
  const d=typeof it?.legendaryId==='string'&&Object.hasOwn(LEGENDARY_EQUIPMENT_DEFINITIONS,it.legendaryId)?LEGENDARY_EQUIPMENT_DEFINITIONS[it.legendaryId]:null;
  if(!d||it.rarity!==3||it.budgetQuality!==4||it.name!==d.name||it.slot!==d.slot||it.baseVariant!==d.baseVariant||it.originRace!==d.originRace||it.weaponType!==d.weaponType||it.set!==null||it.special!==null||!it.exclusive||Array.isArray(it.exclusive)||Object.keys(it.exclusive).length!==1||it.exclusive.id!==d.exclusiveId)return false;
  if(!Number.isSafeInteger(it.level)||it.level<1||it.level>1e12||['baseBudgetModel','budgetLevel','budgetSourceLevel','budgetCompatibility'].some(k=>it[k]!==undefined))return false;
  const b=it.legendaryBudget;
  if(!b||Array.isArray(b)||Object.keys(b).length!==4||b.model!==CONFIG.id||b.quality!==4||b.budgetLevel!==Math.min(100,it.level)||b.sourceLevel!==it.level)return false;
  const raw=deriveEquipmentBase({slot:d.slot,baseVariant:d.baseVariant,level:b.budgetLevel,quality:4,enhancement:0});
  if(!['atk','armor','hp'].every(k=>it[k]===raw[k])||!Array.isArray(it.affixes)||it.affixes.length!==(d.ordinaryAffixCount??4)||new Set(it.affixes.map(a=>a?.stat)).size!==(d.ordinaryAffixCount??4))return false;
  return it.affixes.every(a=>typeof a?.stat==='string'&&Number.isSafeInteger(a.value)&&(affixDefs?validAffixSource(a,affixDefs):a.value>=0));
 }catch{return false;}
}
