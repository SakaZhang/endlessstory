// Explicit owned-gear scenario setup, never a replacement for production fresh().
// Call only in regressions whose subject requires previously acquired equipment.
import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
export function addTestEquipment(s,{socket='weapon',level=1,quality=0,clean=true,equip=true}={}){
 const slot=E.SOCKET_TYPE[socket]??socket;
 const it=E.item(slot,level,null,quality,{originRace:s.race,levelSource:'generated'});
 assert(it,'test fixture uses the actual item factory');
 if(clean){assert.equal(quality,0,'clean fixture is only legal ordinary gear');it.affixes=[];it.special=null;}
 s.inventory.push(it);if(equip)assert(E.equipItem(s,it.id,socket));
 assert(E.validSave(s),'explicit acquired-equipment fixture must be a legal save');
 return it;
}
export function equipTestLoadout(s,options={}){
 for(const socket of Object.keys(s.equip))addTestEquipment(s,{...options,socket});
 return s;
}
