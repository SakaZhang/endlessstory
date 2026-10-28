// Ordinary random affixes only. Owned/paid legacy records and authored exclusive
// effects are deliberately not validated against these generation pools.
import {ELEMENT_KEYS} from './element-schema.js';
const attacks=ELEMENT_KEYS.map(key=>key+'Atk');
const resists=ELEMENT_KEYS.map(key=>key+'Resist');
export const SLOT_AFFIX_POOLS=Object.freeze(Object.fromEntries(Object.entries({
 weapon:['atk','hit','crit','critDamage','lifesteal',...attacks],
 helm:['hp','armor','hit','crit',...resists],
 armor:['hp','armor',...resists],
 gloves:['atk','armor','hit','crit','critDamage','lifesteal'],
 boots:['hp','armor','hit','luck',...resists],
 ring:['atk','hit','crit','critDamage','lifesteal','luck',...attacks],
 amulet:['hp','armor','lifesteal','luck',...resists],
 core:['hp','armor',...attacks,...resists]
}).map(([slot,keys])=>[slot,Object.freeze(keys)])));
export function ordinaryAffixKeys(slot){
 if(!Object.hasOwn(SLOT_AFFIX_POOLS,slot))throw new RangeError('Unsupported ordinary affix slot');
 return SLOT_AFFIX_POOLS[slot];
}
