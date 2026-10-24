import {areas,monsters,parameters,materials,materialPools,art} from './content.js';
import {equipment,sets,legendaries,equipmentArt,legendaryPolicy} from './equipment.js';
import {tree,skills,passives,ELEMENTS,planSkill,modifySkillPlan,createRuntime,validRuntime} from './skills.js';
export {planSkill,modifySkillPlan,createRuntime,validRuntime} from './skills.js';
// Source pools are probability distributions, not raw material preference weights.
for(const pool of Object.values(materialPools))for(const channel of pool.channels){const total=channel.entries.reduce((sum,e)=>sum+e.weight,0);if(total>0)for(const entry of channel.entries)entry.weight/=total;}
parameters.reviewed=false;parameters.testOnly=true;
const skillArt=Object.fromEntries(Object.keys({...skills,...passives}).map((id,i)=>[id,`races/elf/assets/icon-${String(32+i%16).padStart(2,'0')}.png`]));
export const RACE_PACK={planSkill,modifySkillPlan,createRuntime,validRuntime,id:'elf',name:'精灵',heroName:'暮枝巡林者',weapons:['bow','staff'],areas,monsters,parameters,materials,materialPools,equipment,sets,legendaries,tree,skills,passives,art:{...art,equipment:equipmentArt,skills:skillArt},innate:{elementAttack:Object.fromEntries(ELEMENTS.map(e=>[e,4])),elementResistance:Object.fromEntries(ELEMENTS.map(e=>[e,4]))},legendaryPolicy,balanceStatus:'candidate-awaiting-actual-host-four-hour-life-consumption',storyPolicy:{singlePlayableHero:true,otherHeroesAreNPCs:true,mainlineUnchanged:true,returnTokenReserved:true},cooldownPolicy:{dungeonSuccessMs:300000,bossSuccessMs:1800000,defeatCampMs:300000}};
