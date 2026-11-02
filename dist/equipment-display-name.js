import {EQUIPMENT_TEMPLATES,EQUIPMENT_TEMPLATE_BY_ID} from './equipment-templates.js';
import {EXPANSION_PACKS} from './race-packs.js';
// Presentation-only set names. Stored template identities and paid reward snapshots
// retain their exact historical names; no save or transaction fingerprint is rewritten.
const SET_DISPLAY_NAMES=Object.freeze({anvil:'碎砧',rune:'炉纹',guard:'守冢',...Object.fromEntries(EXPANSION_PACKS.flatMap(p=>p.sets.map(s=>[s.id,s.name])))});
function setPieceName(setId,name){
 const prefix=SET_DISPLAY_NAMES[setId];if(!prefix||typeof name!=='string'||!name)return name;
 if(name.startsWith(prefix+'·'))return name;
 return prefix+'·'+(name.startsWith(prefix)?name.slice(prefix.length):name);
}
const KNOWN_SET_NAME_ALIASES=new Map(EQUIPMENT_TEMPLATES.filter(t=>t.kind==='set').map(t=>[t.name,setPieceName(t.setId,t.name)]));
/** Exact equipment-name aliases only; never replace arbitrary prose or item types. */
export function equipmentNameFromReceipt(name){return KNOWN_SET_NAME_ALIASES.get(name)??name;}
export function equipmentDisplayName(item){
 if(!item||typeof item!=='object')return '';
 const name=typeof item.name==='string'?item.name:'',setId=item.set??item.setId;
 if(item.legendaryId||!SET_DISPLAY_NAMES[setId])return name;
 const template=EQUIPMENT_TEMPLATE_BY_ID[item.templateId??item.id];
 if(template&&template.setId===setId&&template.slot===item.slot)return setPieceName(setId,template.name);
 // Pre-template legacy equipment has a real set ID but may have its own piece name.
 return setPieceName(setId,name);
}
