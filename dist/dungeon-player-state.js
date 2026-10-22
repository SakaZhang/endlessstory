import {validDwarfDots} from './dwarf-effects.js';
// Only player-owned per-turn combat state crosses normal-dungeon stages.
// HP and timed potions remain authoritative on the saved hero state.
export const DUNGEON_PLAYER_FIELDS=Object.freeze([
 'shield','guard','warcry','ironcoat','barrier','barrierShield','heroBurn','heroBurnPower','weakness'
]);
export function validDungeonCarry(carry,skillDefinitions){
 if(carry===undefined)return true;
 if(!carry||typeof carry!=='object'||Array.isArray(carry)||Object.keys(carry).length!==DUNGEON_PLAYER_FIELDS.length+2+(carry.typedDots!==undefined?1:0)||!validDwarfDots(carry.typedDots))return false;
 if(!DUNGEON_PLAYER_FIELDS.every(k=>Number.isFinite(carry[k])&&carry[k]>=0&&carry[k]<=1e12)||typeof carry.shelterUsed!=='boolean')return false;
 return carry.cd&&typeof carry.cd==='object'&&!Array.isArray(carry.cd)&&Object.entries(carry.cd).every(([key,n])=>Object.hasOwn(skillDefinitions,key)&&Number.isFinite(n)&&n>=0&&n<=100);
}
export function captureDungeonPlayerState(encounter){
 return {...Object.fromEntries(DUNGEON_PLAYER_FIELDS.map(k=>[k,encounter[k]??(k==='heroBurnPower'&&encounter.heroBurn>0?Math.max(2,Math.round(encounter.atk*.05)):0)])),...(encounter.typedDots!==undefined?{typedDots:structuredClone(encounter.typedDots)}:{}),shelterUsed:!!encounter.shelterUsed,cd:{...encounter.cd}};
}
export function applyDungeonPlayerState(encounter,carry){
 if(!carry)return;
 for(const key of DUNGEON_PLAYER_FIELDS)encounter[key]=carry[key];
 if(carry.typedDots!==undefined)encounter.typedDots=structuredClone(carry.typedDots);
 encounter.shelterUsed=carry.shelterUsed;encounter.cd={...carry.cd};
}
