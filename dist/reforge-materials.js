import {DWARF_MATERIALS,toDwarfInventoryKey} from './dwarf-material-catalog.js';
import {PLANNED_AREAS} from './location-schema.js';
// Existing repeatable regular-channel minerals only. A10 remains the terminal tier.
export const REFORGE_MATERIAL_IDS=Object.freeze([
 'dwarf.iron_filings','dwarf.iron_filings','dwarf.blackvein_ore',
 'dwarf.furnace_ash_salt','dwarf.furnace_crystal','dwarf.furnace_ash_salt',
 'dwarf.silverthread_ore','dwarf.obsidian_flake','dwarf.frostgrain_quartz','dwarf.deep_seam_oil'
]);
export function reforgeMaterialForLevel(level){
 if(!Number.isSafeInteger(level)||level<1)return null;
 const tier=Math.min(10,Math.ceil(level/10)),id=REFORGE_MATERIAL_IDS[tier-1],sourceAreaId=`dwarf.a${String(tier).padStart(2,'0')}`;
 return {id,key:toDwarfInventoryKey(id),name:DWARF_MATERIALS[id].name,quality:0,qualityName:'普通',quantity:1,tier,sourceAreaId,sourceAreaName:PLANNED_AREAS[sourceAreaId].name,sourceNodeId:sourceAreaId+'.field'};
}
