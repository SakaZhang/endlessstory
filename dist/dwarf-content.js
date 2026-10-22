import {PRODUCTION_DWARF_PARAMETERS} from './dwarf-parameters.js';
// Typed A01–A03 source definitions; descriptions are never parsed at runtime.
export const DWARF_MONSTERS={
 "dwarf.a01.normal.1": {
  "id": "dwarf.a01.normal.1",
  "name": "灰旗劫掠者",
  "area": 1,
  "rank": "normal",
  "nodes": [
   "dwarf.a01.field",
   "dwarf.a01.dungeon"
  ],
  "elementTags": [],
  "skills": [
   {
    "id": "dwarf.a01.normal.1:0",
    "name": "劈肩斧",
    "cooldownMs": 9000,
    "firstAtMs": 3000,
    "castMs": 0,
    "effects": [
     {
      "type": "damage",
      "coefficient": 1.25,
      "damageType": "physical",
      "powerBasis": "atk"
     }
    ],
    "trigger": null,
    "maxCasts": null
   }
  ],
  "trait": null
 },
 "dwarf.a01.normal.2": {
  "id": "dwarf.a01.normal.2",
  "name": "裂齿坑鼠",
  "area": 1,
  "rank": "normal",
  "nodes": [
   "dwarf.a01.field",
   "dwarf.a01.dungeon"
  ],
  "elementTags": [
   "earth"
  ],
  "skills": [
   {
    "id": "dwarf.a01.normal.2:0",
    "name": "扑咬",
    "cooldownMs": 6000,
    "firstAtMs": 3000,
    "castMs": 0,
    "effects": [
     {
      "type": "damage",
      "coefficient": 1.1,
      "damageType": "physical",
      "powerBasis": "atk"
     }
    ],
    "trigger": null,
    "maxCasts": null
   }
  ],
  "trait": null
 },
 "dwarf.a01.normal.3": {
  "id": "dwarf.a01.normal.3",
  "name": "失控矿傀",
  "area": 1,
  "rank": "normal",
  "nodes": [
   "dwarf.a01.field",
   "dwarf.a01.dungeon"
  ],
  "elementTags": [
   "earth"
  ],
  "skills": [
   {
    "id": "dwarf.a01.normal.3:0",
    "name": "碎石臂",
    "cooldownMs": 12000,
    "firstAtMs": 3000,
    "castMs": 0,
    "effects": [
     {
      "type": "damage",
      "coefficient": 1.35,
      "damageType": "earth",
      "powerBasis": "elementalPower"
     }
    ],
    "trigger": null,
    "maxCasts": null
   }
  ],
  "trait": null
 },
 "dwarf.a01.elite": {
  "id": "dwarf.a01.elite",
  "name": "灰旗盾长",
  "area": 1,
  "rank": "elite",
  "nodes": [
   "dwarf.a01.dungeon"
  ],
  "elementTags": [
   "earth"
  ],
  "skills": [
   {
    "id": "dwarf.a01.elite:0",
    "name": "盾缘推击",
    "cooldownMs": 10000,
    "firstAtMs": 4000,
    "castMs": 0,
    "effects": [
     {
      "type": "damage",
      "coefficient": 1.35,
      "damageType": "physical",
      "powerBasis": "atk"
     }
    ],
    "trigger": null,
    "maxCasts": null
   }
  ],
  "trait": {
   "type": "openingShield",
   "fraction": 0.12,
   "durationMs": 8000
  }
 },
 "dwarf.a02.normal.1": {
  "id": "dwarf.a02.normal.1",
  "name": "褐背岩蜥",
  "area": 2,
  "rank": "normal",
  "nodes": [
   "dwarf.a02.field",
   "dwarf.a02.dungeon"
  ],
  "elementTags": [
   "earth"
  ],
  "skills": [
   {
    "id": "dwarf.a02.normal.1:0",
    "name": "甩尾",
    "cooldownMs": 9000,
    "firstAtMs": 3000,
    "castMs": 0,
    "effects": [
     {
      "type": "damage",
      "coefficient": 1.3,
      "damageType": "physical",
      "powerBasis": "atk"
     }
    ],
    "trigger": null,
    "maxCasts": null
   }
  ],
  "trait": null
 },
 "dwarf.a02.normal.2": {
  "id": "dwarf.a02.normal.2",
  "name": "裂隙翼蝠",
  "area": 2,
  "rank": "normal",
  "nodes": [
   "dwarf.a02.field",
   "dwarf.a02.dungeon"
  ],
  "elementTags": [
   "wind"
  ],
  "skills": [
   {
    "id": "dwarf.a02.normal.2:0",
    "name": "回旋风刃",
    "cooldownMs": 8000,
    "firstAtMs": 3000,
    "castMs": 0,
    "effects": [
     {
      "type": "damage",
      "coefficient": 1.15,
      "damageType": "wind",
      "powerBasis": "elementalPower"
     }
    ],
    "trigger": null,
    "maxCasts": null
   }
  ],
  "trait": null
 },
 "dwarf.a02.normal.3": {
  "id": "dwarf.a02.normal.3",
  "name": "铁喉穴蟹",
  "area": 2,
  "rank": "normal",
  "nodes": [
   "dwarf.a02.field",
   "dwarf.a02.dungeon"
  ],
  "elementTags": [
   "earth"
  ],
  "skills": [
   {
    "id": "dwarf.a02.normal.3:0",
    "name": "铁钳合拢",
    "cooldownMs": 12000,
    "firstAtMs": 3000,
    "castMs": 0,
    "effects": [
     {
      "type": "damage",
      "coefficient": 1.4,
      "damageType": "physical",
      "powerBasis": "atk"
     }
    ],
    "trigger": null,
    "maxCasts": null
   }
  ],
  "trait": null
 },
 "dwarf.a02.elite": {
  "id": "dwarf.a02.elite",
  "name": "育巢岩蜥",
  "area": 2,
  "rank": "elite",
  "nodes": [
   "dwarf.a02.dungeon"
  ],
  "elementTags": [
   "earth"
  ],
  "skills": [
   {
    "id": "dwarf.a02.elite:0",
    "name": "护巢尾扫",
    "cooldownMs": 12000,
    "firstAtMs": 4000,
    "castMs": 0,
    "effects": [
     {
      "type": "damage",
      "coefficient": 1.35,
      "damageType": "physical",
      "powerBasis": "atk"
     }
    ],
    "trigger": null,
    "maxCasts": null
   }
  ],
  "trait": {
   "type": "followers",
   "shares": [
    0.6,
    0.2,
    0.2
   ],
   "name": "褐背幼蜥"
  }
 },
 "dwarf.a03.normal.1": {
  "id": "dwarf.a03.normal.1",
  "name": "失誓卫兵",
  "area": 3,
  "rank": "normal",
  "nodes": [
   "dwarf.a03.field",
   "dwarf.a03.dungeon"
  ],
  "elementTags": [
   "dark"
  ],
  "skills": [
   {
    "id": "dwarf.a03.normal.1:0",
    "name": "折誓刺",
    "cooldownMs": 9000,
    "firstAtMs": 3000,
    "castMs": 0,
    "effects": [
     {
      "type": "damage",
      "coefficient": 1.25,
      "damageType": "dark",
      "powerBasis": "elementalPower"
     }
    ],
    "trigger": null,
    "maxCasts": null
   }
  ],
  "trait": null
 },
 "dwarf.a03.normal.2": {
  "id": "dwarf.a03.normal.2",
  "name": "刻碑噬蜥",
  "area": 3,
  "rank": "normal",
  "nodes": [
   "dwarf.a03.field",
   "dwarf.a03.dungeon"
  ],
  "elementTags": [
   "earth"
  ],
  "skills": [
   {
    "id": "dwarf.a03.normal.2:0",
    "name": "破石跃击",
    "cooldownMs": 8000,
    "firstAtMs": 3000,
    "castMs": 0,
    "effects": [
     {
      "type": "damage",
      "coefficient": 1.2,
      "damageType": "physical",
      "powerBasis": "atk"
     }
    ],
    "trigger": null,
    "maxCasts": null
   }
  ],
  "trait": null
 },
 "dwarf.a03.normal.3": {
  "id": "dwarf.a03.normal.3",
  "name": "残铭石偶",
  "area": 3,
  "rank": "normal",
  "nodes": [
   "dwarf.a03.field",
   "dwarf.a03.dungeon"
  ],
  "elementTags": [
   "earth",
   "light"
  ],
  "skills": [
   {
    "id": "dwarf.a03.normal.3:0",
    "name": "残铭护壳",
    "cooldownMs": 15000,
    "firstAtMs": 3000,
    "castMs": 0,
    "effects": [
     {
      "type": "shield",
      "fraction": 0.08,
      "seconds": 6
     }
    ],
    "trigger": null,
    "maxCasts": null
   }
  ],
  "trait": null
 },
 "dwarf.a03.elite": {
  "id": "dwarf.a03.elite",
  "name": "石牌执刑者",
  "area": 3,
  "rank": "elite",
  "nodes": [
   "dwarf.a03.dungeon"
  ],
  "elementTags": [
   "earth",
   "dark"
  ],
  "skills": [
   {
    "id": "dwarf.a03.elite:0",
    "name": "断誓槌",
    "cooldownMs": 12000,
    "firstAtMs": 4000,
    "castMs": 0,
    "effects": [
     {
      "type": "damage",
      "coefficient": 1.5,
      "damageType": "physical",
      "powerBasis": "atk"
     }
    ],
    "trigger": null,
    "maxCasts": null
   }
  ],
  "trait": {
   "type": "reflect",
   "chance": 0.2,
   "coefficient": 0.35,
   "cooldownMs": 4000
  }
 },
 "dwarf.a03.boss": {
  "id": "dwarf.a03.boss",
  "name": "守誓者 · 莫尔",
  "area": 3,
  "rank": "boss",
  "nodes": [
   "dwarf.a03.boss"
  ],
  "elementTags": [
   "earth",
   "dark"
  ],
  "skills": [
   {
    "id": "dwarf.a03.boss:0",
    "name": "断誓重槌",
    "cooldownMs": 12000,
    "firstAtMs": 6000,
    "castMs": 0,
    "effects": [
     {
      "type": "damage",
      "coefficient": 1.85,
      "damageType": "physical",
      "powerBasis": "atk"
     }
    ],
    "trigger": null,
    "maxCasts": null
   },
   {
    "id": "dwarf.a03.boss:1",
    "name": "碎碑回响",
    "cooldownMs": 18000,
    "firstAtMs": 10000,
    "castMs": 0,
    "effects": [
     {
      "type": "damage",
      "coefficient": 1.35,
      "damageType": "dark",
      "powerBasis": "elementalPower"
     },
     {
      "type": "dot",
      "damageType": "dark",
      "powerBasis": "elementalPower",
      "coefficientPerSecond": 0.1,
      "seconds": 4,
      "refresh": "same_skill",
      "mitigation": "resistance_only"
     }
    ],
    "trigger": null,
    "maxCasts": null
   },
   {
    "id": "dwarf.a03.boss:2",
    "name": "最后碑甲",
    "cooldownMs": 24000,
    "firstAtMs": 18000,
    "castMs": 0,
    "effects": [
     {
      "type": "shield",
      "fraction": 0.12,
      "seconds": 10
     }
    ],
    "trigger": "hp_below_50_once",
    "maxCasts": 1
   }
  ],
  "trait": null
 }
};
// One replaceable absolute parameter layer. No fallback to withdrawn proxy/legacy LOCS.
let parameterSet=null;
export function configureDwarfParameters(config){
 if(config===null){parameterSet=null;return true;}
 if(!config||typeof config.id!=='string'||(config.reviewed!==true&&config.testOnly!==true)||!config.monsters||!Number.isFinite(config.fieldGroupChance)||config.fieldGroupChance<0||config.fieldGroupChance>1)return false;
 for(const id of Object.keys(DWARF_MONSTERS)){const p=config.monsters[id];if(!p||!['hp','atk','armor','elementalPower','rewardGold','rewardXp'].every(k=>Number.isFinite(p[k])&&p[k]>=0&&p[k]<=1e9)||p.hp<=0||!Number.isSafeInteger(p.basicIntervalMs)||p.basicIntervalMs<100||p.basicIntervalMs>60000||p.elementResistance!==undefined&&(!p.elementResistance||!['earth','water','fire','wind','light','dark'].every(k=>Number.isFinite(p.elementResistance[k])&&p.elementResistance[k]>=0&&p.elementResistance[k]<=1e9)))return false;}
 if(!config.clearRewards||![1,2,3].every(a=>{const c=config.clearRewards[a];return c&&['gold','xp'].every(k=>Number.isFinite(c[k])&&c[k]>=0&&c[k]<=1e9)&&Number.isInteger(c.materialRounds)&&c.materialRounds>=0&&c.materialRounds<=3&&['gearChance','markChance'].every(k=>Number.isFinite(c[k])&&c[k]>=0&&c[k]<=1);}))return false;
 const skills=new Set(Object.values(DWARF_MONSTERS).flatMap(d=>d.skills.map(s=>s.id)));
 if(config.skillOverrides!==undefined&&(!config.skillOverrides||Object.entries(config.skillOverrides).some(([id,x])=>!skills.has(id)||!x||Object.keys(x).length!==1||!Number.isSafeInteger(x.castMs)||x.castMs<0||x.castMs>60000)))return false;
 if(config.controlReduction!==undefined&&(!config.controlReduction||Object.entries(config.controlReduction).some(([rank,x])=>!['normal','elite','boss'].includes(rank)||!Number.isFinite(x)||x<0||x>=1)))return false;
 if(config.interruptStopMs!==undefined&&(!Number.isSafeInteger(config.interruptStopMs)||config.interruptStopMs<1||config.interruptStopMs>60000))return false;
 parameterSet=structuredClone(config);return true;
}
export function dwarfParameterSet(){return parameterSet?structuredClone(parameterSet):null;}
export function dwarfParameters(id){const p=parameterSet?.monsters[id];return p?{...structuredClone(p),parameterSetId:parameterSet.id,skillOverrides:structuredClone(parameterSet.skillOverrides??{}),controlReduction:parameterSet.controlReduction?.[DWARF_MONSTERS[id].rank]??0,interruptStopMs:parameterSet.interruptStopMs??1100}:null;}
export function dwarfBudgetReady(){return parameterSet!==null;}
export function dwarfGroupChance(){return parameterSet?.fieldGroupChance??0;}
export function dwarfEligibleMonsters(nodeId,rank){return Object.values(DWARF_MONSTERS).filter(m=>m.nodes.includes(nodeId)&&m.rank===rank);}

// Invalid or absent parameter sets never fall back to prototype monster numbers.
if(!configureDwarfParameters(PRODUCTION_DWARF_PARAMETERS))throw new Error('Invalid approved dwarf parameter set');
