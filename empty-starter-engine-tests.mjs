import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
import {raceSockets} from './dist/race-registry.js';
import {captureCombatDisplay} from './dist/combat-display-bridge.js';
// v0.81.2 user target includes naked Goblin growth: HP107.2/armor4.2, ATK17.
// Other races retain the original134HP/6armor; no starter equipment is added.
for(const race of E.RACE_KEYS){
 const s=E.fresh(race);assert.equal(s.inventory.length,0);assert.deepEqual(Object.keys(s.equip),raceSockets(race));assert(Object.values(s.equip).every(x=>x===null));assert.equal(s.gold,100);assert.equal(E.stats(s).hp,134*(race==='goblin'?.8:1));assert.equal(E.stats(s).atk,17);assert.equal(E.stats(s).armor,6*(race==='goblin'?.7:1));assert(E.validSave(s));
 assert.deepEqual(s.materialStacks,race==='dwarf'?{'铁屑|0':5,'炉火晶|0':2,'誓约残片|0':1}:{});
 E.normalizeHealth(s,s.lastSeen);const e=E.startInstanceEncounter(s,race+'.a01.field',s.lastSeen);assert(e);let outgoing=0;
 for(let i=0;i<20&&!e.done;i++){const {events}=captureCombatDisplay(e,()=>E.step(s,e,s.nextActionAt));outgoing+=events.filter(x=>x.sourceId==='hero'&&x.hpDelta<0).length;}
 assert(outgoing>0,'unarmed basic attack works');assert(E.validSave(s));
 // Existing owned equipment is neither deleted nor rerolled by hydration/normalization.
 const owned=E.fresh(race);for(const socket of raceSockets(race)){const it=E.item(E.SOCKET_TYPE[socket]??socket,1,null,0,{originRace:race,levelSource:'starter'});owned.inventory.push(it);assert(E.equipItem(owned,it.id,socket));}
 const restored=JSON.parse(JSON.stringify(owned)),before=JSON.stringify({inventory:restored.inventory,equip:restored.equip});assert(E.validSave(restored));E.normalizeHealth(restored,restored.lastSeen);E.normalizeInventoryState(restored);assert.equal(JSON.stringify({inventory:restored.inventory,equip:restored.equip}),before);assert(E.validSave(restored));
}
console.log('PASS five races: truly empty new characters, preserved starting resources, unarmed production basic, equipped-save normalization unchanged.');
