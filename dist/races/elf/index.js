import {createLegendaryState,validLegendaryState,reduceLegendaryEvent} from './legendary.js';
export {createLegendaryState,validLegendaryState,reduceLegendaryEvent} from './legendary.js';
import {ACTION_FRAMES} from './art-actions.js';
import {CLEAN_EXTRACTION} from './art-clean.js';
import {areas,monsters,parameters,materials,materialPools,art} from './content.js';
import {equipment,sets,legendaries,equipmentArt,legendaryPolicy} from './equipment.js';
import {tree,skills,passives,ELEMENTS,planSkill,modifySkillPlan,createRuntime,validRuntime} from './skills.js';
export {planSkill,modifySkillPlan,createRuntime,validRuntime} from './skills.js';
// Source pools are probability distributions, not raw material preference weights.
for(const pool of Object.values(materialPools))for(const channel of pool.channels){const total=channel.entries.reduce((sum,e)=>sum+e.weight,0);if(total>0)for(const entry of channel.entries)entry.weight/=total;}
parameters.reviewed=false;parameters.testOnly=true;
for(const [id,meta] of Object.entries(CLEAN_EXTRACTION)){art.monsters[id].facing=meta.facing;art.monsters[id].frames[0].alphaBBox=meta.alphaBBox;art.monsters[id].frames[0].facing=meta.facing;art.monsters[id].headY=68;art.monsters[id].healthBarAnchor=[96,58];}
for(const manifest of Object.values(art.hero)){manifest.headY=80;manifest.healthBarAnchor=[96,70];manifest.animations.death=[manifest.frames[7].id];delete manifest.animations.guard;}
for(const [id,frames] of Object.entries(ACTION_FRAMES)){const sprite=art.monsters[id];sprite.frames.push(...frames);sprite.animations.attack=[frames[0].id,frames[1].id,sprite.frames[0].id];sprite.animations.hurt=[frames[2].id,sprite.frames[0].id];sprite.animations.death=[frames[3].id];}
const skillArt=Object.fromEntries(Object.keys({...skills,...passives}).map((id,i)=>[id,`races/elf/assets/icon-${String(32+i%16).padStart(2,'0')}.png`]));
export const RACE_PACK={createLegendaryState,validLegendaryState,reduceLegendaryEvent,planSkill,modifySkillPlan,createRuntime,validRuntime,id:'elf',name:'精灵',heroName:'年轻祭司',heroDescription:'由大祭司培养的接班人，兼修仪式弓术与法杖。',weapons:['bow','staff'],areas,monsters,parameters,materials,materialPools,equipment,sets,legendaries,tree,skills,passives,art:{...art,equipment:equipmentArt,skills:skillArt},innate:{elementAttack:Object.fromEntries(ELEMENTS.map(e=>[e,4])),elementResistance:Object.fromEntries(ELEMENTS.map(e=>[e,4]))},legendaryPolicy,materialAliases:Object.fromEntries(Object.keys(materials).map((id,i)=>['elf.mat.'+String(i+1).padStart(2,'0'),id])),balanceStatus:'candidate-awaiting-actual-host-four-hour-life-consumption',storyPolicy:{singlePlayableHero:true,otherHeroesAreNPCs:true,mainlineUnchanged:true,returnTokenReserved:true},cooldownPolicy:{dungeonSuccessMs:300000,bossSuccessMs:1800000,defeatCampMs:300000}};
