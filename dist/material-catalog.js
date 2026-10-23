// Acquisition-neutral catalogue. Registration never adds a material to monster drop pools.
import {DWARF_MATERIALS,resolveDwarfMaterialId,toDwarfInventoryKey} from './dwarf-material-catalog.js';
import {POTION_IMPORT_MATERIALS} from './potion-catalog.js';
export const MATERIAL_CATALOG=Object.freeze({...DWARF_MATERIALS,...POTION_IMPORT_MATERIALS});
export function resolveMaterialId(key){return typeof key==='string'?(Object.hasOwn(POTION_IMPORT_MATERIALS,key)?key:resolveDwarfMaterialId(key)):null;}
export function materialInventoryKey(id){return Object.hasOwn(POTION_IMPORT_MATERIALS,id)?id:toDwarfInventoryKey(id);}
