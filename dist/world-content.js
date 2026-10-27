import {balanceMonsterParameters} from './monster-balance.js';
import {EXPANSION_PACKS} from './race-packs.js';
import {DWARF_MONSTERS,dwarfParameters,dwarfParameterSet,dwarfBudgetReady,dwarfGroupChance} from './dwarf-content.js';
export const WORLD_MONSTERS=Object.freeze({...DWARF_MONSTERS,...Object.assign({},...EXPANSION_PACKS.map(p=>p.monsters))});
const packOf=id=>EXPANSION_PACKS.find(p=>p.id===String(id).split('.')[0]);
export function monsterParameters(id){if(id?.startsWith('dwarf.'))return balanceMonsterParameters(WORLD_MONSTERS[id],dwarfParameters(id));const pack=packOf(id),d=WORLD_MONSTERS[id],p=pack?.parameters?.monsters?.[id];return p&&d?balanceMonsterParameters(d,{...structuredClone(p),parameterSetId:pack.parameters.id,skillOverrides:structuredClone(pack.parameters.skillOverrides??{}),controlReduction:pack.parameters.controlReduction?.[d.rank]??0,interruptStopMs:pack.parameters.interruptStopMs??1100}):null;}
export function raceParameterSet(race='dwarf'){return race==='dwarf'?dwarfParameterSet():structuredClone(packOf(race)?.parameters??null);}
export function areaBudgetReady(area,race='dwarf'){return race==='dwarf'?dwarfBudgetReady(area):packOf(race)?.parameters?.areas?.includes(area)===true;}
export function raceGroupChance(race='dwarf'){return race==='dwarf'?dwarfGroupChance():packOf(race)?.parameters?.fieldGroupChance??0;}
export function eligibleMonsters(nodeId,rank){return Object.values(WORLD_MONSTERS).filter(m=>m.nodes.includes(nodeId)&&m.rank===rank&&monsterParameters(m.id));}
