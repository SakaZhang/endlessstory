import {DWARF_EXPANDED_SKILLS,DWARF_ADDED_PASSIVE_METADATA,DWARF_NEW_ACTIVE_IDS,planDwarfExpansion,dwarfExpansionConfigs} from './dwarf-skill-expansion.js';
import {EXPANSION_PACKS} from './race-packs.js';
import {SKILL_TREE_DEFINITION} from './skill-tree-definition.js';
import {SKILL_TREE_DESCRIPTIONS} from './skill-tree-descriptions.js';
import {TREE_TUNING} from './skill-tree-tuning.js';
const dwarf={id:'dwarf',name:'矮人',heroName:'布洛克',weapons:['axe','hammer'],tree:SKILL_TREE_DEFINITION,skills:DWARF_EXPANDED_SKILLS,passives:DWARF_ADDED_PASSIVE_METADATA,tuning:TREE_TUNING};
export const RACE_PACKS=Object.freeze({dwarf,...Object.fromEntries(EXPANSION_PACKS.map(p=>[p.id,p]))});
export const PLAYABLE_RACES=Object.freeze(Object.keys(RACE_PACKS));
export function getRacePack(race){return RACE_PACKS[typeof race==='string'?race:race?.race]??null;}
export function getSkillTreeDefinition(raceOrState='dwarf'){return getRacePack(raceOrState)?.tree??null;}
export function getSkillMetadata(id){for(const pack of Object.values(RACE_PACKS)){const metadata=pack.skills?.[id]??pack.passives?.[id]??pack.tree.nodes.find(n=>n.id===id);if(metadata){const node=pack.tree.nodes.find(n=>n.id===id);return {...node,...metadata,kind:node?.kind??metadata.kind};}}return null;}
export function getSkillOwner(id){return Object.values(RACE_PACKS).find(p=>p.skills?.[id]||p.passives?.[id]||p.tree.nodes.some(n=>n.id===id))??null;}
export function getRaceSkillPlanner(id){return DWARF_NEW_ACTIVE_IDS.includes(id)?planDwarfExpansion:getSkillOwner(id)?.planSkill??null;}
export function getRaceTuning(race){const p=getRacePack(race);if(!p)return null;if(p.id==='dwarf')return {...TREE_TUNING,configs:stats=>({...TREE_TUNING.configs(stats),...dwarfExpansionConfigs(stats)}),passiveConfig:{...TREE_TUNING.passiveConfig,...DWARF_ADDED_PASSIVE_METADATA}};return {...TREE_TUNING,configs:Object.fromEntries(Object.entries(p.skills??{}).map(([id,s])=>[id,{cooldownMs:s.cooldownMs}])),passiveConfig:p.passives??{},counterCoefficient:p.id==='human'?.5:TREE_TUNING.counterCoefficient,race:p.id};}
export function raceSockets(race){return ['weapon','helm','armor','gloves','boots','ring1','ring2','amulet',...(race==='ashen'?['core']:[])];}
