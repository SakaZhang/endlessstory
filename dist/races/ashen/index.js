import {areas,monsters,parameters,materials,materialPools} from './world.js';
import {equipment,sets,legendaries,coreVariants,weaponVariants,modifyLegendaryPlan} from './equipment.js';
import {tree,skills,passives,planSkill,modifySkillPlan,createRuntime,validRuntime,applyRaceEffects} from './skills.js';
import {art} from './art.js';
export {planSkill,modifySkillPlan,createRuntime,validRuntime,applyRaceEffects,modifyLegendaryPlan};
export const RACE_PACK={id:'ashen',name:'烬裔',heroName:'醒石行者',description:'有知觉的矿石之躯，沿荒原矿脉寻找属于自己的道路。',weapons:['armguard','hammer'],areas,monsters,parameters,materials,materialPools,equipment,sets,legendaries,tree,skills,passives,art,coreVariants,weaponVariants,planSkill,modifySkillPlan,modifyLegendaryPlan,createRuntime,validRuntime,applyRaceEffects};
