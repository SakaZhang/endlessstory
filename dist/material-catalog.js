// Acquisition-neutral catalogue. Registration never adds a material to monster drop pools.
import {WORLD_MATERIALS as DWARF_MATERIALS,worldMaterialId as resolveDwarfMaterialId,worldInventoryKey as toDwarfInventoryKey} from './world-materials.js';
import {POTION_IMPORT_MATERIALS} from './potion-catalog.js';
export const MATERIAL_CATALOG=Object.freeze({...POTION_IMPORT_MATERIALS,...DWARF_MATERIALS});
export function resolveMaterialId(key){return typeof key==='string'?(Object.hasOwn(POTION_IMPORT_MATERIALS,key)?key:resolveDwarfMaterialId(key)):null;}
export function materialInventoryKey(id){return Object.hasOwn(POTION_IMPORT_MATERIALS,id)?id:toDwarfInventoryKey(id);}
