import {specialDivineMultiplier} from './special-divine.js';
// Permanent progress belongs to the individual special affix, never the hero.
// Stats callers add these flat earned values only for currently equipped items.
const freeze=x=>{if(x&&typeof x==='object'){Object.values(x).forEach(freeze);Object.freeze(x);}return x;};
const object=x=>!!x&&typeof x==='object'&&!Array.isArray(x);
const id=x=>typeof x==='string'&&x.length>0&&x.length<=200;
const MAX_ENCOUNTER_UNITS=100000;
export const GROWTH_SPECIAL_DEFS=freeze({
 harvester:{name:'收割者',desc:'装备时每击杀一个单位永久积累1点攻击力，每件最多400点；多件可叠加，卸下保留进度但不提供加成。',stat:'atk',unit:'flat',maxKills:400,divisor:1,sourceApproved:true,mechanicsReady:true,enabled:true},
 blesser:{name:'祝福者',desc:'装备时每击杀一个单位永久积累0.1点幸运，每件最多20点；多件可叠加，卸下保留进度但不提供加成。',stat:'luck',unit:'rating',maxKills:200,divisor:10,sourceApproved:true,mechanicsReady:true,enabled:true},
 glutton:{name:'暴食者',desc:'装备时每击杀一个单位永久积累1点吸血，每件最多200点；多件可叠加，卸下保留进度但不提供加成。',stat:'lifesteal',unit:'rating',maxKills:200,divisor:1,sourceApproved:true,mechanicsReady:true,enabled:true}
});
export function validGrowthSpecial(special){
 if(special===undefined||special===null)return true;
 if(!object(special)||!id(special.id))return false;
 const definition=Object.hasOwn(GROWTH_SPECIAL_DEFS,special.id)?GROWTH_SPECIAL_DEFS[special.id]:null;
 if(!Object.hasOwn(special,'growthKills'))return true;
 return !!definition&&Number.isSafeInteger(special.growthKills)&&special.growthKills>=0&&special.growthKills<=definition.maxKills;
}
export function specialAffixProgress(item){
 const special=item?.special,definition=special&&Object.hasOwn(GROWTH_SPECIAL_DEFS,special.id)?GROWTH_SPECIAL_DEFS[special.id]:null;
 if(!definition||!validGrowthSpecial(special))return null;
 const kills=special.growthKills??0;
 return {id:special.id,kills,maxKills:definition.maxKills,value:kills/definition.divisor*specialDivineMultiplier(item),maxValue:definition.maxKills/definition.divisor*specialDivineMultiplier(item),stat:definition.stat,unit:definition.unit};
}
export function growthBonuses(item){
 const bonus={atk:0,luck:0,lifesteal:0},progress=specialAffixProgress(item);
 if(progress)bonus[progress.stat]=progress.value;
 return bonus;
}
// Full reforge preserves earned progress only when the same special survives.
// A new special starts at zero; neither the old counter nor a candidate counter
// may be transferred into a different special.
export function rerollGrowthSpecial(oldSpecial,newSpecial){
 if(!validGrowthSpecial(oldSpecial)||!validGrowthSpecial(newSpecial))return null;
 if(newSpecial===undefined||newSpecial===null)return null;
 const next={...newSpecial};delete next.growthKills;
 if(oldSpecial?.id===newSpecial.id&&Object.hasOwn(GROWTH_SPECIAL_DEFS,newSpecial.id)&&Object.hasOwn(oldSpecial,'growthKills'))next.growthKills=oldSpecial.growthKills;
 return next;
}
export function validGrowthKillLedger(encounter){
 if(!object(encounter))return false;
 if(encounter.growthKillIds===undefined)return true;
 const rows=encounter.enemies,ledger=encounter.growthKillIds;
 if(!Array.isArray(rows)||rows.length>MAX_ENCOUNTER_UNITS||!Array.isArray(ledger)||ledger.length>rows.length||new Set(ledger).size!==ledger.length)return false;
 const deadIds=new Set(rows.filter(u=>object(u)&&id(u.id)&&u.hp===0).map(u=>u.id));
 return ledger.every(unitId=>id(unitId)&&deadIds.has(unitId));
}
// Caller supplies IDs that transitioned alive -> dead through player damage.
// The persisted encounter receipt prevents duplicate awards across resume,
// repeated settlement, multiple damage segments, and capped equipment.
export function recordGrowthKills(save,encounter,unitIds){
 if(!object(save)||!Array.isArray(save.inventory)||!object(save.equip)||!validGrowthKillLedger(encounter)||!Array.isArray(encounter.enemies)||encounter.enemies.length>MAX_ENCOUNTER_UNITS||!Array.isArray(unitIds)||unitIds.length>MAX_ENCOUNTER_UNITS)return null;
 const units=new Map();
 for(const unit of encounter.enemies){if(!object(unit)||!id(unit.id)||units.has(unit.id))return null;units.set(unit.id,unit);}
 if(!unitIds.every(unitId=>id(unitId)&&units.get(unitId)?.hp===0))return null;
 const seen=new Set(encounter.growthKillIds??[]),fresh=[...new Set(unitIds)].filter(unitId=>!seen.has(unitId));
 if(!fresh.length)return 0;
 const equippedIds=new Set(Object.values(save.equip).filter(value=>value!==null&&value!==undefined)),gear=[];
 for(const itemId of equippedIds){
  if(!id(itemId))return null;
  const matches=save.inventory.filter(item=>item?.id===itemId);
  if(matches.length!==1||!validGrowthSpecial(matches[0].special))return null;
  const item=matches[0],progress=specialAffixProgress(item);
  if(progress)gear.push({item,kills:Math.min(progress.maxKills,progress.kills+fresh.length)});
 }
 for(const {item,kills} of gear)item.special={...item.special,growthKills:kills};
 encounter.growthKillIds=[...seen,...fresh];
 return fresh.length;
}
