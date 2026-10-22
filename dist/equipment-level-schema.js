export const EQUIPMENT_LEVEL_SOURCES=Object.freeze(['legacy','generated','starter','drop','material','merchant','equipment']);
export function validEquipmentLevelMetadata(it){
 if(!it||typeof it!=='object')return false;
 if(it.baseLevel===undefined&&it.levelSource===undefined)return true;
 return Number.isFinite(it.baseLevel)&&it.baseLevel>=0&&it.baseLevel<=1e12&&EQUIPMENT_LEVEL_SOURCES.includes(it.levelSource);
}
export function normalizeEquipmentLevels(s){
 if(!s||!Array.isArray(s.inventory)||(s.merchant!==undefined&&(!s.merchant||!Array.isArray(s.merchant.offers))))return false;
 const items=[...(s?.inventory??[]),...(s?.merchant?.offers??[]).filter(o=>o?.type==='equipment').map(o=>o.item)];
 if(!items.every(it=>it&&Number.isFinite(it.level)&&it.level>=0&&it.level<=1e12&&validEquipmentLevelMetadata(it)))return false;
 for(const it of items)if(it.baseLevel===undefined&&it.levelSource===undefined){it.baseLevel=it.level;it.levelSource='legacy';}
 return true;
}
function rollWithin(baseLevel,range,random,levelSource){
 if(!Number.isFinite(baseLevel)||baseLevel<0||baseLevel>1e12||!Array.isArray(range)||range.length!==2||!range.every(Number.isFinite))return null;
 const min=Math.max(1,Math.ceil(baseLevel-2),Math.ceil(range[0])),max=Math.min(Math.floor(baseLevel+2),Math.floor(range[1]));
 if(min>max)return null;
 const roll=random();if(!Number.isFinite(roll)||roll<0||roll>=1)return null;
 return {baseLevel,level:min+Math.floor(roll*(max-min+1)),levelSource};
}
export function rollDropEquipmentLevel(baseLevel,areaRange,random=Math.random){
 return rollWithin(baseLevel,areaRange,random,'drop');
}
// Pure level calculation shared with equipment-input fusion. Consumption and
// quality choice stay in the engine; offsets never become the next baseline.
export function rollEquipmentFusionLevel(items,random=Math.random){
 if(!Array.isArray(items)||!items.length||items.length>5||!items.every(it=>it&&validEquipmentLevelMetadata(it)&&Number.isFinite(it.baseLevel??it.level)&&(it.baseLevel??it.level)>=0&&(it.baseLevel??it.level)<=1e12))return null;
 const baseLevel=Math.max(...items.map(it=>it.baseLevel??it.level));
 return rollWithin(baseLevel,[1,1e12],random,'equipment');
}
