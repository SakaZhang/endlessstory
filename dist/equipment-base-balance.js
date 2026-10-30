import {EQUIPMENT_TEMPLATE_BY_ID} from './equipment-templates.js';
import {LEGENDARY_EQUIPMENT_DEFINITIONS} from './legendary-equipment.js';

// Effective +0 base policy, not an inventory rewrite or a second item budget.
// Stored raw M2 values stay immutable and strictly validated. Catalog origin,
// never wearer race, selects the policy for both owned and newly generated gear.
export const GOBLIN_EQUIPMENT_BASE_BALANCE=Object.freeze({hp:.8,armor:.8});
export function balancedItemBase(it){
 const base={atk:it.atk,armor:it.armor,hp:it.hp};
 const catalog=it.legendaryId?LEGENDARY_EQUIPMENT_DEFINITIONS:EQUIPMENT_TEMPLATE_BY_ID,id=it.legendaryId??it.templateId;
 const definition=Object.hasOwn(catalog,id)?catalog[id]:null;
 if(definition?.originRace!=='goblin'||it.originRace!=='goblin'||it.slot!==definition.slot||it.baseVariant!==definition.baseVariant)return base;
 for(const [stat,multiplier]of Object.entries(GOBLIN_EQUIPMENT_BASE_BALANCE))base[stat]=base[stat]===0?0:Math.max(1,Math.round(base[stat]*multiplier));
 return base;
}
