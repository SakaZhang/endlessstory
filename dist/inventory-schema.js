export const EQUIPMENT_BAG_TYPES=Object.freeze(['weapon','helm','armor','gloves','boots','ring','amulet','core']);
export const BAG_LIMITS=Object.freeze({equipment:50,materials:100,items:100});
export const INVENTORY_SAVE_LIMIT=10000;
export const LOOT_CATEGORIES=Object.freeze(['equipment','materials','items']);
const wardrobe=s=>new Set((s.loadouts??[]).filter(Boolean).flatMap(l=>Object.values(l.equip??{})).filter(Boolean));
const materialStacks=s=>s.materialStacks??Object.fromEntries(Object.entries(s.materials??{}).map(([k,v])=>[k+'|0',v]));
const potionStacks=s=>s.potionStacks??Object.fromEntries(Object.entries(s.potions??{}).map(([k,v])=>[k+'|0',v]));
export function bagCounts(s){
 const refs=wardrobe(s),equipment=Object.fromEntries(EQUIPMENT_BAG_TYPES.map(k=>[k,0]));
 for(const it of s.inventory??[])if(!refs.has(it.id)&&Object.hasOwn(equipment,it.slot))equipment[it.slot]++;
 return {equipment,materials:Object.values(materialStacks(s)).filter(n=>n>0).length,items:Object.values(potionStacks(s)).filter(n=>n>0).length+['memoryFruit','reforgeToken'].filter(k=>(s.consumables?.[k]??0)>0).length};
}
export function canReceiveEquipment(s,itemOrSlot){
 const slot=typeof itemOrSlot==='string'?itemOrSlot:itemOrSlot?.slot;
 return EQUIPMENT_BAG_TYPES.includes(slot)&&(s.inventory?.length??0)<INVENTORY_SAVE_LIMIT&&bagCounts(s).equipment[slot]<BAG_LIMITS.equipment;
}
export function canReceiveMaterial(s,key,qty=1){
 const current=materialStacks(s)[key]??0;
 return Number.isSafeInteger(qty)&&qty>0&&Number.isSafeInteger(current)&&current>=0&&current+qty<=1e12&&(current>0||bagCounts(s).materials<BAG_LIMITS.materials);
}
export function canReceiveItem(s,key,qty=1){
 const current=['memoryFruit','reforgeToken'].includes(key)?s.consumables?.[key]??0:potionStacks(s)[key]??0;
 return Number.isSafeInteger(qty)&&qty>0&&Number.isSafeInteger(current)&&current>=0&&current+qty<=1e9&&(current>0||bagCounts(s).items<BAG_LIMITS.items);
}
export function validLootFilters(s){
 const f=s.lootFilters;if(f===undefined)return true;
 return f&&typeof f==='object'&&!Array.isArray(f)&&Object.keys(f).length===3&&LOOT_CATEGORIES.every(k=>Array.isArray(f[k])&&f[k].length<=(k==='equipment'?5:4)&&new Set(f[k]).size===f[k].length&&Array.from(f[k]).every(q=>Number.isInteger(q)&&q>=0&&q<=(k==='equipment'?4:3)));
}
export function normalizeInventoryState(s){
 if(!validLootFilters(s))return false;
 s.lootFilters??={equipment:[],materials:[],items:[]};return true;
}
export function setLootFilter(s,category,qualities){
 if(!LOOT_CATEGORIES.includes(category)||!Array.isArray(qualities)||!validLootFilters({...s,lootFilters:{...(s.lootFilters??{equipment:[],materials:[],items:[]}),[category]:qualities}}))return false;
 normalizeInventoryState(s);s.lootFilters[category]=[...qualities].sort((a,b)=>a-b);return true;
}
export function shouldDiscardLoot(s,category,quality){
 return Number.isInteger(quality)&&quality>=0&&quality<=(category==='equipment'?4:3)&&s.lootFilters?.[category]?.includes(quality)===true;
}
export function emptyLootSummary(){return {discarded:{equipment:0,materials:0,items:0},overflow:{equipment:0,materials:0,items:0}};}
export function validLootSummary(value){
 return value&&typeof value==='object'&&Object.keys(value).length===2&&['discarded','overflow'].every(k=>value[k]&&typeof value[k]==='object'&&Object.keys(value[k]).length===3&&LOOT_CATEGORIES.every(c=>Number.isSafeInteger(value[k][c])&&value[k][c]>=0&&value[k][c]<=1e12));
}
export function mergeLootSummary(target,source){
 if(source)for(const action of ['discarded','overflow'])for(const category of LOOT_CATEGORIES)target[action][category]+=source[action][category];
 return target;
}
