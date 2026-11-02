import {reconcileRuntimeSets} from './races/ashen/skills.js';
import {validRacialLegendaryRuntime,clearRemovedRacialLegendaryRuntime,legendaryRuntimeOwner} from './racial-legendary-runtime.js';
import {validPlayerShieldLayers,removePlayerShieldLayersByOwner} from './player-shield-layers.js';
/** Per-item accumulation lifecycle; effect consumers live in legendary-combat.js.
 * Runtime counters survive saves, pauses, and encounter transitions. Only a true
 * equipped-ID removal clears its record; socket movement is not removal.
 * Every operation validates before writing and touches no encounter flags.
 */
const SOCKET_TYPE={weapon:'weapon',helm:'helm',armor:'armor',gloves:'gloves',boots:'boots',ring1:'ring',ring2:'ring',amulet:'amulet',core:'core'};
const FIELDS=['combatMs','attackCount','castCount'];
const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const exact=(x,keys)=>object(x)&&Object.keys(x).length===keys.length&&keys.every(k=>Object.hasOwn(x,k));
const counter=(x,integer=false)=>Number.isFinite(x)&&x>=0&&x<=Number.MAX_SAFE_INTEGER&&(!integer||Number.isSafeInteger(x));
const zero=()=>({combatMs:0,attackCount:0,castCount:0});
function equippedIds(s,equip){
 if(!exact(equip,Object.keys(SOCKET_TYPE).filter(k=>k!=='core'||s.race==='ashen'))||!Array.isArray(s?.inventory))return null;
 const owned=new Map();for(const it of s.inventory){if(!it||typeof it.id!=='string'||!it.id||owned.has(it.id))return null;owned.set(it.id,it);}
 const ids=new Set();for(const [socket,id]of Object.entries(equip)){
  if(id===null)continue;const it=owned.get(id);if(typeof id!=='string'||!it||it.slot!==SOCKET_TYPE[socket]||ids.has(id))return null;ids.add(id);
 }return ids;
}
function validRuntime(runtime,ids){
 if(runtime===undefined)return true;
 if(!exact(runtime,['version','byId'])||runtime.version!==1||!object(runtime.byId))return false;
 return Object.entries(runtime.byId).every(([id,r])=>ids.has(id)&&exact(r,FIELDS)&&counter(r.combatMs)&&counter(r.attackCount,true)&&counter(r.castCount,true));
}
function normalized(runtime,ids){return {version:1,byId:Object.fromEntries([...ids].map(id=>[id,runtime&&Object.hasOwn(runtime.byId,id)?{...runtime.byId[id]}:zero()]))};}
function validShields(s,ids){const ledger=s.activeEncounter?.playerShieldLayers;return ledger===undefined||(validPlayerShieldLayers(ledger)&&ledger.layers.every(layer=>layer.ownerItemId==null||ids.has(layer.ownerItemId)));}
function validCarry(s,ids){const ledger=s.equipmentShieldCarry;return ledger===undefined||(validPlayerShieldLayers(ledger)&&ledger.layers.every(layer=>typeof layer.ownerItemId==='string'&&ids.has(layer.ownerItemId)&&s.inventory.some(it=>it.id===layer.ownerItemId&&(layer.source==='reactor:'+layer.ownerItemId&&it.legendaryId==='everburning-reactor'||layer.source==='legendary:'+layer.ownerItemId&&!!legendaryRuntimeOwner(it.legendaryId)))));}
function ashenSetRuntime(s,ids){
 if(s.race!=='ashen')return [];const counts={};for(const id of ids){const set=s.inventory.find(it=>it.id===id)?.set;if(set)counts[set]=(counts[set]??0)+1;}
 const rows=[];for(const holder of [s.activeEncounter,s.dungeonRun?.carry])if(holder?.raceRuntime){const state=reconcileRuntimeSets(holder.raceRuntime.state,counts);if(!state)return null;rows.push({holder,state});}return rows;
}
function validAshenSetRuntime(s,ids){const rows=ashenSetRuntime(s,ids);return !!rows&&rows.every(({holder,state})=>state.heat===holder.raceRuntime.state.heat&&state.shards===holder.raceRuntime.state.shards);}
export function validEquipmentRuntime(s){const ids=equippedIds(s,s?.equip);return !!ids&&validAshenSetRuntime(s,ids)&&validRacialLegendaryRuntime(s)&&validRuntime(s.equipmentRuntime,ids)&&validShields(s,ids)&&validCarry(s,ids);}
export function normalizeEquipmentRuntime(s){const ids=equippedIds(s,s?.equip);if(!ids||!validRuntime(s.equipmentRuntime,ids)||!validShields(s,ids)||!validCarry(s,ids))return false;s.equipmentRuntime=normalized(s.equipmentRuntime,ids);return true;}
/** Call before changing s.equip. A stale beforeEquip is rejected atomically. */
export function applyEquipmentRuntimeChange(s,beforeEquip,nextEquip){
 const before=equippedIds(s,beforeEquip),next=equippedIds(s,nextEquip);
 if(!before||!next||!validRacialLegendaryRuntime(s)||!Object.keys(SOCKET_TYPE).filter(k=>k!=='core'||s.race==='ashen').every(k=>s.equip?.[k]===beforeEquip[k])||!validRuntime(s.equipmentRuntime,before)||!validShields(s,before)||!validCarry(s,before))return false;
 let shields=s.activeEncounter?.playerShieldLayers;if(shields!==undefined&&!validPlayerShieldLayers(shields))return false;
 for(const id of before)if(!next.has(id)&&shields!==undefined){shields=removePlayerShieldLayersByOwner(shields,id);if(!shields)return false;}
 let carry=s.equipmentShieldCarry;for(const id of before)if(!next.has(id)&&carry!==undefined){carry=removePlayerShieldLayersByOwner(carry,id);if(!carry)return false;}
 const current=normalized(s.equipmentRuntime,before),byId=Object.fromEntries([...next].map(id=>[id,before.has(id)?current.byId[id]:zero()]));
 const ashenNext=ashenSetRuntime(s,next);if(ashenNext===null)return false;for(const {holder,state}of ashenNext)holder.raceRuntime.state=state;
 clearRemovedRacialLegendaryRuntime(s,next);s.equipmentRuntime={version:1,byId};if(shields!==undefined)s.activeEncounter.playerShieldLayers=shields;if(carry!==undefined)s.equipmentShieldCarry=carry;return true;
}
