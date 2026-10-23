import {SLOTS,SLOTNAME} from './engine.js';
import {emptySlotIcon} from './pixel-inventory.js';
export function renderForgeSlotPicker(s,selected,action,{busy=false}={}){
 if(!['modify-slot','enhance-slot'].includes(action))return '';
 return `<nav class="forgeSlotPicker" aria-label="选择装备部位">${SLOTS.map(slot=>{const count=s.inventory.filter(it=>it.slot===slot).length;return `<button data-${action}="${slot}" aria-pressed="${selected===slot}" ${busy?'disabled':''}>${emptySlotIcon(slot)}<span>${SLOTNAME[slot]}</span><small>${count}</small></button>`;}).join('')}</nav>`;
}
export function forgeSlotItems(s,slot,items=s.inventory){
 const equipped=new Set(Object.values(s.equip)),seen=new Set();
 return items.filter(it=>it.slot===slot&&!seen.has(it.id)&&seen.add(it.id)).sort((a,b)=>Number(equipped.has(b.id))-Number(equipped.has(a.id)));
}
