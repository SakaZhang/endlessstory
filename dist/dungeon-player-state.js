import {validRaceRuntime} from './race-runtime.js';
import {carryHeroSkillEffects,restoreHeroSkillEffects} from './skill-tree-effects.js';
import {TREE_ACTIVE_SKILL_IDS} from './skill-tree-consumer.js';
import {validPlayerShieldLayers,createPlayerShieldLayers} from './player-shield-layers.js';
import {validDwarfDots} from './dwarf-effects.js';
// Only player-owned per-turn combat state crosses normal-dungeon stages.
// HP and timed potions remain authoritative on the saved hero state.
export const DUNGEON_PLAYER_FIELDS=Object.freeze([
 'shield','guard','warcry','ironcoat','barrier','barrierShield','heroBurn','heroBurnPower','weakness'
]);
export function validDungeonCarry(carry,skillDefinitions){
 if(carry===undefined)return true;
 if(!carry||typeof carry!=='object'||Array.isArray(carry)||Object.keys(carry).length!==DUNGEON_PLAYER_FIELDS.length+2+['raceRuntime','typedDots','treeSkillCooldowns','treeCombatClock','treeEffects','treeSkillShieldLayers'].filter(k=>carry[k]!==undefined).length||!validDwarfDots(carry.typedDots))return false;
 if(!validTreeCarry(carry)||!validRaceRuntime(carry.raceRuntime))return false;
 if(!DUNGEON_PLAYER_FIELDS.every(k=>Number.isFinite(carry[k])&&carry[k]>=0&&carry[k]<=1e12)||typeof carry.shelterUsed!=='boolean')return false;
 return carry.cd&&typeof carry.cd==='object'&&!Array.isArray(carry.cd)&&Object.entries(carry.cd).every(([key,n])=>Object.hasOwn(skillDefinitions,key)&&Number.isFinite(n)&&n>=0&&n<=100);
}
export function captureDungeonPlayerState(encounter){
 const tree=encounter.treeEffects?carryHeroSkillEffects(encounter.treeEffects):null;
 const extra={};if(encounter.raceRuntime!==undefined)extra.raceRuntime=structuredClone(encounter.raceRuntime);if(encounter.treeSkillCooldowns!==undefined)extra.treeSkillCooldowns=structuredClone(encounter.treeSkillCooldowns);if(encounter.treeCombatClock!==undefined)extra.treeCombatClock=encounter.treeCombatClock;if(tree)extra.treeEffects=tree;
 if(encounter.playerShieldLayers)extra.treeSkillShieldLayers={version:1,clock:encounter.playerShieldLayers.clock,layers:encounter.playerShieldLayers.layers.filter(x=>x.source.startsWith('skill:')&&!x.ownerItemId).map(x=>structuredClone(x))};
 return {...extra,...Object.fromEntries(DUNGEON_PLAYER_FIELDS.map(k=>[k,encounter[k]??(k==='heroBurnPower'&&encounter.heroBurn>0?Math.max(2,Math.round(encounter.atk*.05)):0)])),...(encounter.typedDots!==undefined?{typedDots:structuredClone(encounter.typedDots)}:{}),shelterUsed:!!encounter.shelterUsed,cd:{...encounter.cd}};
}
export function applyDungeonPlayerState(encounter,carry){
 if(!carry)return;if(carry.raceRuntime!==undefined)encounter.raceRuntime=structuredClone(carry.raceRuntime);
 for(const key of DUNGEON_PLAYER_FIELDS)encounter[key]=carry[key];
 if(carry.typedDots!==undefined)encounter.typedDots=structuredClone(carry.typedDots);
 if(carry.treeSkillCooldowns!==undefined)encounter.treeSkillCooldowns=structuredClone(carry.treeSkillCooldowns);
 if(carry.treeCombatClock!==undefined)encounter.treeCombatClock=carry.treeCombatClock;
 if(carry.treeEffects!==undefined)encounter.treeEffects=restoreHeroSkillEffects(carry.treeEffects,(encounter.enemies??[]).map(u=>u.id));
 encounter.shelterUsed=carry.shelterUsed;encounter.cd={...carry.cd};
}

function validTreeCarry(carry){
 if(carry.treeCombatClock!==undefined&&(!Number.isSafeInteger(carry.treeCombatClock)||carry.treeCombatClock<0||carry.treeCombatClock>1e15))return false;
 if(carry.treeSkillCooldowns!==undefined&&(!carry.treeSkillCooldowns||typeof carry.treeSkillCooldowns!=='object'||Array.isArray(carry.treeSkillCooldowns)||!Object.entries(carry.treeSkillCooldowns).every(([key,n])=>TREE_ACTIVE_SKILL_IDS.includes(key)&&Number.isInteger(n)&&n>=0&&n<=100)))return false;
 if(carry.treeEffects!==undefined&&(!restoreHeroSkillEffects(carry.treeEffects)||carry.treeCombatClock!==undefined&&carry.treeEffects.clock!==carry.treeCombatClock))return false;
 return carry.treeSkillShieldLayers===undefined||(validPlayerShieldLayers(carry.treeSkillShieldLayers)&&carry.treeSkillShieldLayers.layers.every(x=>x.source.startsWith('skill:')&&x.source.length>6&&!x.ownerItemId));
}
// Call after encounter equipment/opening-shield initialization. This does not grant anew.
export function restoreDungeonSkillShieldLayers(encounter,carry){
 if(!carry||!validTreeCarry(carry))return false;if(carry.treeSkillShieldLayers===undefined)return true;
 const saved=carry.treeSkillShieldLayers,current=encounter.playerShieldLayers??createPlayerShieldLayers(saved.clock);if(!validPlayerShieldLayers(current))return false;
 // Two ledgers can have different origins; retain each skill layer's remaining lifetime.
 const clock=Math.max(current.clock,saved.clock),ids=new Set(current.layers.map(x=>x.source));
 const layers=current.layers.map(x=>({...structuredClone(x),expiresAt:x.expiresAt===null?null:x.expiresAt+(clock-current.clock)}));
 for(const layer of saved.layers)if(!ids.has(layer.source)&&layer.remaining>0&&(layer.expiresAt===null||layer.expiresAt>saved.clock))layers.push({...structuredClone(layer),expiresAt:layer.expiresAt===null?null:layer.expiresAt+(clock-saved.clock)});
 const next={version:1,clock,layers};if(!validPlayerShieldLayers(next))return false;encounter.playerShieldLayers=next;return true;
}
