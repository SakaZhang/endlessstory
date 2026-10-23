import {PRODUCTION_DWARF_PARAMETERS} from './dwarf-parameters.js';
// Typed A01–A10 source definitions; descriptions are never parsed at runtime.
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
 } ,
 "dwarf.a04.normal.1": {
  "id": "dwarf.a04.normal.1",
  "name": "渣火蜥",
  "area": 4,
  "rank": "normal",
  "nodes": [
   "dwarf.a04.field",
   "dwarf.a04.dungeon"
  ],
  "elementTags": [
   "fire"
  ],
  "basicAttackType": "physical",
  "skills": [
   {
    "id": "dwarf.a04.normal.1:0",
    "name": "吐烬",
    "cooldownMs": 9000,
    "firstAtMs": 3000,
    "castMs": 0,
    "effects": [
     {
      "type": "damage",
      "coefficient": 1.05,
      "damageType": "fire",
      "powerBasis": "elementalPower"
     },
     {
      "type": "dot",
      "damageType": "fire",
      "powerBasis": "elementalPower",
      "coefficientPerSecond": 0.1,
      "seconds": 3,
      "refresh": "same_skill",
      "mitigation": "resistance_only"
     }
    ],
    "requiresHitForEffects": true,
    "trigger": null,
    "maxCasts": null
   }
  ],
  "trait": null
 },
 "dwarf.a04.normal.2": {
  "id": "dwarf.a04.normal.2",
  "name": "烟囱灰蝠",
  "area": 4,
  "rank": "normal",
  "nodes": [
   "dwarf.a04.field",
   "dwarf.a04.dungeon"
  ],
  "elementTags": [
   "wind",
   "fire"
  ],
  "basicAttackType": "wind",
  "skills": [
   {
    "id": "dwarf.a04.normal.2:0",
    "name": "灰翼突袭",
    "cooldownMs": 8000,
    "firstAtMs": 3000,
    "castMs": 0,
    "effects": [
     {
      "type": "damage",
      "coefficient": 1.2,
      "damageType": "wind",
      "powerBasis": "elementalPower"
     }
    ],
    "requiresHitForEffects": true,
    "trigger": null,
    "maxCasts": null
   }
  ],
  "trait": null
 },
 "dwarf.a04.normal.3": {
  "id": "dwarf.a04.normal.3",
  "name": "积盐炉壳",
  "area": 4,
  "rank": "normal",
  "nodes": [
   "dwarf.a04.field",
   "dwarf.a04.dungeon"
  ],
  "elementTags": [
   "earth",
   "fire"
  ],
  "basicAttackType": "earth",
  "skills": [
   {
    "id": "dwarf.a04.normal.3:0",
    "name": "热盐撞击",
    "cooldownMs": 12000,
    "firstAtMs": 3000,
    "castMs": 0,
    "effects": [
     {
      "type": "damage",
      "coefficient": 1.4,
      "damageType": "fire",
      "powerBasis": "elementalPower"
     }
    ],
    "requiresHitForEffects": true,
    "trigger": null,
    "maxCasts": null
   }
  ],
  "trait": null
 },
 "dwarf.a04.elite": {
  "id": "dwarf.a04.elite",
  "name": "鼓风监炉官",
  "area": 4,
  "rank": "elite",
  "nodes": [
   "dwarf.a04.dungeon"
  ],
  "elementTags": [
   "fire",
   "wind"
  ],
  "basicAttackType": "fire",
  "skills": [
   {
    "id": "dwarf.a04.elite:0",
    "name": "鼓风喷焰",
    "cooldownMs": 12000,
    "firstAtMs": 4000,
    "castMs": 0,
    "effects": [
     {
      "type": "damage",
      "coefficient": 1.45,
      "damageType": "fire",
      "powerBasis": "elementalPower"
     }
    ],
    "requiresHitForEffects": true,
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
 "dwarf.a05.normal.1": {
  "id": "dwarf.a05.normal.1",
  "name": "泉壁苔兽",
  "area": 5,
  "rank": "normal",
  "nodes": [
   "dwarf.a05.field",
   "dwarf.a05.dungeon"
  ],
  "elementTags": [
   "water",
   "earth"
  ],
  "basicAttackType": "earth",
  "skills": [
   {
    "id": "dwarf.a05.normal.1:0",
    "name": "寒泉喷吐",
    "cooldownMs": 9000,
    "firstAtMs": 3000,
    "castMs": 0,
    "effects": [
     {
      "type": "damage",
      "coefficient": 1.2,
      "damageType": "water",
      "powerBasis": "elementalPower"
     },
     {
      "type": "next_basic_slow",
      "multiplier": 1.15,
      "charges": 1
     }
    ],
    "requiresHitForEffects": true,
    "trigger": null,
    "maxCasts": null
   }
  ],
  "trait": null
 },
 "dwarf.a05.normal.2": {
  "id": "dwarf.a05.normal.2",
  "name": "冷雾晶蛾",
  "area": 5,
  "rank": "normal",
  "nodes": [
   "dwarf.a05.field",
   "dwarf.a05.dungeon"
  ],
  "elementTags": [
   "water",
   "wind"
  ],
  "basicAttackType": "water",
  "skills": [
   {
    "id": "dwarf.a05.normal.2:0",
    "name": "凝露针",
    "cooldownMs": 8000,
    "firstAtMs": 3000,
    "castMs": 0,
    "effects": [
     {
      "type": "damage",
      "coefficient": 1.15,
      "damageType": "water",
      "powerBasis": "elementalPower"
     }
    ],
    "requiresHitForEffects": true,
    "trigger": null,
    "maxCasts": null
   }
  ],
  "trait": null
 },
 "dwarf.a05.normal.3": {
  "id": "dwarf.a05.normal.3",
  "name": "石胆菌甲虫",
  "area": 5,
  "rank": "normal",
  "nodes": [
   "dwarf.a05.field",
   "dwarf.a05.dungeon"
  ],
  "elementTags": [
   "earth"
  ],
  "basicAttackType": "physical",
  "skills": [
   {
    "id": "dwarf.a05.normal.3:0",
    "name": "合壳",
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
    "requiresHitForEffects": false,
    "trigger": null,
    "maxCasts": null
   }
  ],
  "trait": null
 },
 "dwarf.a05.elite": {
  "id": "dwarf.a05.elite",
  "name": "寒泉汲髓兽",
  "area": 5,
  "rank": "elite",
  "nodes": [
   "dwarf.a05.dungeon"
  ],
  "elementTags": [
   "water"
  ],
  "basicAttackType": "water",
  "skills": [
   {
    "id": "dwarf.a05.elite:0",
    "name": "汲髓咬",
    "cooldownMs": 10000,
    "firstAtMs": 4000,
    "castMs": 0,
    "effects": [
     {
      "type": "damage",
      "coefficient": 1.35,
      "damageType": "water",
      "powerBasis": "elementalPower"
     }
    ],
    "requiresHitForEffects": true,
    "trigger": null,
    "maxCasts": null
   }
  ],
  "trait": {
   "type": "lifesteal",
   "fraction": 0.12,
   "perActionCap": 0.02,
   "encounterCap": 0.15
  }
 },
 "dwarf.a06.normal.1": {
  "id": "dwarf.a06.normal.1",
  "name": "炉池铸渣兵",
  "area": 6,
  "rank": "normal",
  "nodes": [
   "dwarf.a06.field",
   "dwarf.a06.dungeon"
  ],
  "elementTags": [
   "fire",
   "earth"
  ],
  "basicAttackType": "physical",
  "skills": [
   {
    "id": "dwarf.a06.normal.1:0",
    "name": "烙铁斩",
    "cooldownMs": 9000,
    "firstAtMs": 3000,
    "castMs": 0,
    "effects": [
     {
      "type": "damage",
      "coefficient": 1.25,
      "damageType": "fire",
      "powerBasis": "elementalPower"
     }
    ],
    "requiresHitForEffects": true,
    "trigger": null,
    "maxCasts": null
   }
  ],
  "trait": null
 },
 "dwarf.a06.normal.2": {
  "id": "dwarf.a06.normal.2",
  "name": "汽压游魂",
  "area": 6,
  "rank": "normal",
  "nodes": [
   "dwarf.a06.field",
   "dwarf.a06.dungeon"
  ],
  "elementTags": [
   "water",
   "wind"
  ],
  "basicAttackType": "wind",
  "skills": [
   {
    "id": "dwarf.a06.normal.2:0",
    "name": "汽流切割",
    "cooldownMs": 8000,
    "firstAtMs": 3000,
    "castMs": 0,
    "effects": [
     {
      "type": "damage",
      "coefficient": 1.15,
      "damageType": "water",
      "powerBasis": "elementalPower"
     }
    ],
    "requiresHitForEffects": true,
    "trigger": null,
    "maxCasts": null
   }
  ],
  "trait": null
 },
 "dwarf.a06.normal.3": {
  "id": "dwarf.a06.normal.3",
  "name": "沉炉搬运傀",
  "area": 6,
  "rank": "normal",
  "nodes": [
   "dwarf.a06.field",
   "dwarf.a06.dungeon"
  ],
  "elementTags": [
   "earth",
   "fire"
  ],
  "basicAttackType": "physical",
  "skills": [
   {
    "id": "dwarf.a06.normal.3:0",
    "name": "坠罐",
    "cooldownMs": 12000,
    "firstAtMs": 3000,
    "castMs": 0,
    "effects": [
     {
      "type": "damage",
      "coefficient": 1.45,
      "damageType": "physical",
      "powerBasis": "atk"
     }
    ],
    "requiresHitForEffects": true,
    "trigger": null,
    "maxCasts": null
   }
  ],
  "trait": null
 },
 "dwarf.a06.elite": {
  "id": "dwarf.a06.elite",
  "name": "沉炉督造傀",
  "area": 6,
  "rank": "elite",
  "nodes": [
   "dwarf.a06.dungeon"
  ],
  "elementTags": [
   "earth",
   "fire"
  ],
  "basicAttackType": "physical",
  "skills": [
   {
    "id": "dwarf.a06.elite:0",
    "name": "双锤合铸",
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
    "requiresHitForEffects": true,
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
   "name": "铸渣小工"
  }
 },
 "dwarf.a06.boss": {
  "id": "dwarf.a06.boss",
  "name": "炉心守卫 · 断铸",
  "area": 6,
  "rank": "boss",
  "nodes": [
   "dwarf.a06.boss"
  ],
  "elementTags": [
   "fire",
   "earth"
  ],
  "basicAttackType": "physical",
  "skills": [
   {
    "id": "dwarf.a06.boss:0",
    "name": "炉口喷流",
    "cooldownMs": 12000,
    "firstAtMs": 6000,
    "castMs": 0,
    "effects": [
     {
      "type": "damage",
      "coefficient": 1.55,
      "damageType": "fire",
      "powerBasis": "elementalPower"
     },
     {
      "type": "dot",
      "damageType": "fire",
      "powerBasis": "elementalPower",
      "coefficientPerSecond": 0.12,
      "seconds": 4,
      "refresh": "same_skill",
      "mitigation": "resistance_only"
     }
    ],
    "requiresHitForEffects": true,
    "trigger": null,
    "maxCasts": null
   },
   {
    "id": "dwarf.a06.boss:1",
    "name": "沉砧坠击",
    "cooldownMs": 18000,
    "firstAtMs": 10000,
    "castMs": 2000,
    "effects": [
     {
      "type": "damage",
      "coefficient": 2.0,
      "damageType": "earth",
      "powerBasis": "elementalPower"
     }
    ],
    "requiresHitForEffects": true,
    "trigger": null,
    "maxCasts": null
   },
   {
    "id": "dwarf.a06.boss:2",
    "name": "冷凝炉壳",
    "cooldownMs": 24000,
    "firstAtMs": 18000,
    "castMs": 0,
    "effects": [
     {
      "type": "shield",
      "fraction": 0.08,
      "seconds": 6
     }
    ],
    "requiresHitForEffects": false,
    "trigger": "cooldown_limited_two_casts",
    "maxCasts": 2
   }
  ],
  "trait": null
 },
 "dwarf.a07.normal.1": {
  "id": "dwarf.a07.normal.1",
  "name": "银须钻虫",
  "area": 7,
  "rank": "normal",
  "nodes": [
   "dwarf.a07.field",
   "dwarf.a07.dungeon"
  ],
  "elementTags": [
   "earth"
  ],
  "basicAttackType": "physical",
  "skills": [
   {
    "id": "dwarf.a07.normal.1:0",
    "name": "钻颚",
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
    "requiresHitForEffects": true,
    "trigger": null,
    "maxCasts": null
   }
  ],
  "trait": null
 },
 "dwarf.a07.normal.2": {
  "id": "dwarf.a07.normal.2",
  "name": "霜纹晶蛛",
  "area": 7,
  "rank": "normal",
  "nodes": [
   "dwarf.a07.field",
   "dwarf.a07.dungeon"
  ],
  "elementTags": [
   "water"
  ],
  "basicAttackType": "water",
  "skills": [
   {
    "id": "dwarf.a07.normal.2:0",
    "name": "冰丝针",
    "cooldownMs": 8000,
    "firstAtMs": 3000,
    "castMs": 0,
    "effects": [
     {
      "type": "damage",
      "coefficient": 1.15,
      "damageType": "water",
      "powerBasis": "elementalPower"
     }
    ],
    "requiresHitForEffects": true,
    "trigger": null,
    "maxCasts": null
   }
  ],
  "trait": null
 },
 "dwarf.a07.normal.3": {
  "id": "dwarf.a07.normal.3",
  "name": "无主铭文像",
  "area": 7,
  "rank": "normal",
  "nodes": [
   "dwarf.a07.field",
   "dwarf.a07.dungeon"
  ],
  "elementTags": [
   "light",
   "earth"
  ],
  "basicAttackType": "light",
  "skills": [
   {
    "id": "dwarf.a07.normal.3:0",
    "name": "封纹",
    "cooldownMs": 15000,
    "firstAtMs": 3000,
    "castMs": 0,
    "effects": [
     {
      "type": "shield",
      "fraction": 0.09,
      "seconds": 6
     }
    ],
    "requiresHitForEffects": false,
    "trigger": null,
    "maxCasts": null
   }
  ],
  "trait": null
 },
 "dwarf.a07.elite": {
  "id": "dwarf.a07.elite",
  "name": "银纹反震像",
  "area": 7,
  "rank": "elite",
  "nodes": [
   "dwarf.a07.dungeon"
  ],
  "elementTags": [
   "earth",
   "light"
  ],
  "basicAttackType": "earth",
  "skills": [
   {
    "id": "dwarf.a07.elite:0",
    "name": "铭震",
    "cooldownMs": 12000,
    "firstAtMs": 4000,
    "castMs": 0,
    "effects": [
     {
      "type": "damage",
      "coefficient": 1.45,
      "damageType": "earth",
      "powerBasis": "elementalPower"
     }
    ],
    "requiresHitForEffects": true,
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
 "dwarf.a08.normal.1": {
  "id": "dwarf.a08.normal.1",
  "name": "黑曜刃蜥",
  "area": 8,
  "rank": "normal",
  "nodes": [
   "dwarf.a08.field",
   "dwarf.a08.dungeon"
  ],
  "elementTags": [
   "earth",
   "dark"
  ],
  "basicAttackType": "physical",
  "skills": [
   {
    "id": "dwarf.a08.normal.1:0",
    "name": "侧脊斩",
    "cooldownMs": 8000,
    "firstAtMs": 3000,
    "castMs": 0,
    "effects": [
     {
      "type": "damage",
      "coefficient": 1.25,
      "damageType": "physical",
      "powerBasis": "atk"
     },
     {
      "type": "dot",
      "damageType": "physical",
      "powerBasis": "atk",
      "coefficientPerSecond": 0.08,
      "seconds": 3,
      "refresh": "same_skill",
      "mitigation": "armor_only"
     }
    ],
    "requiresHitForEffects": true,
    "trigger": null,
    "maxCasts": null
   }
  ],
  "trait": null
 },
 "dwarf.a08.normal.2": {
  "id": "dwarf.a08.normal.2",
  "name": "岩脂伏行兽",
  "area": 8,
  "rank": "normal",
  "nodes": [
   "dwarf.a08.field",
   "dwarf.a08.dungeon"
  ],
  "elementTags": [
   "earth"
  ],
  "basicAttackType": "physical",
  "skills": [
   {
    "id": "dwarf.a08.normal.2:0",
    "name": "黏脂撞击",
    "cooldownMs": 9000,
    "firstAtMs": 3000,
    "castMs": 0,
    "effects": [
     {
      "type": "damage",
      "coefficient": 1.25,
      "damageType": "earth",
      "powerBasis": "elementalPower"
     }
    ],
    "requiresHitForEffects": true,
    "trigger": null,
    "maxCasts": null
   }
  ],
  "trait": null
 },
 "dwarf.a08.normal.3": {
  "id": "dwarf.a08.normal.3",
  "name": "断索升降傀",
  "area": 8,
  "rank": "normal",
  "nodes": [
   "dwarf.a08.field",
   "dwarf.a08.dungeon"
  ],
  "elementTags": [
   "earth"
  ],
  "basicAttackType": "physical",
  "skills": [
   {
    "id": "dwarf.a08.normal.3:0",
    "name": "链索抽打",
    "cooldownMs": 12000,
    "firstAtMs": 3000,
    "castMs": 0,
    "effects": [
     {
      "type": "damage",
      "coefficient": 1.45,
      "damageType": "physical",
      "powerBasis": "atk"
     }
    ],
    "requiresHitForEffects": true,
    "trigger": null,
    "maxCasts": null
   }
  ],
  "trait": null
 },
 "dwarf.a08.elite": {
  "id": "dwarf.a08.elite",
  "name": "裂谷锁链监工",
  "area": 8,
  "rank": "elite",
  "nodes": [
   "dwarf.a08.dungeon"
  ],
  "elementTags": [
   "earth",
   "dark"
  ],
  "basicAttackType": "physical",
  "skills": [
   {
    "id": "dwarf.a08.elite:0",
    "name": "拖链横扫",
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
    "requiresHitForEffects": true,
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
   "name": "裂谷钻兽"
  }
 },
 "dwarf.a09.normal.1": {
  "id": "dwarf.a09.normal.1",
  "name": "晶髓噬者",
  "area": 9,
  "rank": "normal",
  "nodes": [
   "dwarf.a09.field",
   "dwarf.a09.dungeon"
  ],
  "elementTags": [
   "water",
   "dark"
  ],
  "basicAttackType": "water",
  "skills": [
   {
    "id": "dwarf.a09.normal.1:0",
    "name": "汲晶刺",
    "cooldownMs": 10000,
    "firstAtMs": 3000,
    "castMs": 0,
    "effects": [
     {
      "type": "damage",
      "coefficient": 1.1,
      "damageType": "water",
      "powerBasis": "elementalPower"
     },
     {
      "type": "lifesteal",
      "fraction": 0.15,
      "perActionCap": 0.02,
      "encounterCap": 0.15
     }
    ],
    "requiresHitForEffects": true,
    "trigger": null,
    "maxCasts": null
   }
  ],
  "trait": null
 },
 "dwarf.a09.normal.2": {
  "id": "dwarf.a09.normal.2",
  "name": "折光晶蛾",
  "area": 9,
  "rank": "normal",
  "nodes": [
   "dwarf.a09.field",
   "dwarf.a09.dungeon"
  ],
  "elementTags": [
   "light",
   "wind"
  ],
  "basicAttackType": "light",
  "skills": [
   {
    "id": "dwarf.a09.normal.2:0",
    "name": "折光束",
    "cooldownMs": 8000,
    "firstAtMs": 3000,
    "castMs": 0,
    "effects": [
     {
      "type": "damage",
      "coefficient": 1.2,
      "damageType": "light",
      "powerBasis": "elementalPower"
     }
    ],
    "requiresHitForEffects": true,
    "trigger": null,
    "maxCasts": null
   }
  ],
  "trait": null
 },
 "dwarf.a09.normal.3": {
  "id": "dwarf.a09.normal.3",
  "name": "符骨守卷像",
  "area": 9,
  "rank": "normal",
  "nodes": [
   "dwarf.a09.field",
   "dwarf.a09.dungeon"
  ],
  "elementTags": [
   "earth",
   "light"
  ],
  "basicAttackType": "earth",
  "skills": [
   {
    "id": "dwarf.a09.normal.3:0",
    "name": "石卷压印",
    "cooldownMs": 12000,
    "firstAtMs": 3000,
    "castMs": 0,
    "effects": [
     {
      "type": "damage",
      "coefficient": 1.45,
      "damageType": "earth",
      "powerBasis": "elementalPower"
     }
    ],
    "requiresHitForEffects": true,
    "trigger": null,
    "maxCasts": null
   }
  ],
  "trait": null
 },
 "dwarf.a09.elite": {
  "id": "dwarf.a09.elite",
  "name": "符骨藏锋者",
  "area": 9,
  "rank": "elite",
  "nodes": [
   "dwarf.a09.dungeon"
  ],
  "elementTags": [
   "light",
   "water"
  ],
  "basicAttackType": "light",
  "skills": [
   {
    "id": "dwarf.a09.elite:0",
    "name": "开卷光刃",
    "cooldownMs": 12000,
    "firstAtMs": 4000,
    "castMs": 0,
    "effects": [
     {
      "type": "damage",
      "coefficient": 1.5,
      "damageType": "light",
      "powerBasis": "elementalPower"
     }
    ],
    "requiresHitForEffects": true,
    "trigger": null,
    "maxCasts": null
   }
  ],
  "trait": {
   "type": "reflect",
   "chance": 0.15,
   "coefficient": 0.3,
   "cooldownMs": 5000,
   "openingShield": {
    "fraction": 0.08,
    "durationMs": 8000
   }
  }
 },
 "dwarf.a10.normal.1": {
  "id": "dwarf.a10.normal.1",
  "name": "地心铸卫",
  "area": 10,
  "rank": "normal",
  "nodes": [
   "dwarf.a10.field",
   "dwarf.a10.dungeon"
  ],
  "elementTags": [
   "earth",
   "fire"
  ],
  "basicAttackType": "physical",
  "skills": [
   {
    "id": "dwarf.a10.normal.1:0",
    "name": "熔核重斩",
    "cooldownMs": 9000,
    "firstAtMs": 3000,
    "castMs": 0,
    "effects": [
     {
      "type": "damage",
      "coefficient": 1.3,
      "damageType": "fire",
      "powerBasis": "elementalPower"
     }
    ],
    "requiresHitForEffects": true,
    "trigger": null,
    "maxCasts": null
   }
  ],
  "trait": null
 },
 "dwarf.a10.normal.2": {
  "id": "dwarf.a10.normal.2",
  "name": "暗脉裂影",
  "area": 10,
  "rank": "normal",
  "nodes": [
   "dwarf.a10.field",
   "dwarf.a10.dungeon"
  ],
  "elementTags": [
   "dark"
  ],
  "basicAttackType": "dark",
  "skills": [
   {
    "id": "dwarf.a10.normal.2:0",
    "name": "裂影穿刺",
    "cooldownMs": 8000,
    "firstAtMs": 3000,
    "castMs": 0,
    "effects": [
     {
      "type": "damage",
      "coefficient": 1.2,
      "damageType": "dark",
      "powerBasis": "elementalPower"
     }
    ],
    "requiresHitForEffects": true,
    "trigger": null,
    "maxCasts": null
   }
  ],
  "trait": null
 },
 "dwarf.a10.normal.3": {
  "id": "dwarf.a10.normal.3",
  "name": "岩脂巨壳",
  "area": 10,
  "rank": "normal",
  "nodes": [
   "dwarf.a10.field",
   "dwarf.a10.dungeon"
  ],
  "elementTags": [
   "earth",
   "water"
  ],
  "basicAttackType": "earth",
  "skills": [
   {
    "id": "dwarf.a10.normal.3:0",
    "name": "沉壳震击",
    "cooldownMs": 12000,
    "firstAtMs": 3000,
    "castMs": 0,
    "effects": [
     {
      "type": "damage",
      "coefficient": 1.5,
      "damageType": "earth",
      "powerBasis": "elementalPower"
     }
    ],
    "requiresHitForEffects": true,
    "trigger": null,
    "maxCasts": null
   }
  ],
  "trait": null
 },
 "dwarf.a10.elite": {
  "id": "dwarf.a10.elite",
  "name": "永铸试作体",
  "area": 10,
  "rank": "elite",
  "nodes": [
   "dwarf.a10.dungeon"
  ],
  "elementTags": [
   "earth",
   "fire"
  ],
  "basicAttackType": "physical",
  "skills": [
   {
    "id": "dwarf.a10.elite:0",
    "name": "核火贯击",
    "cooldownMs": 12000,
    "firstAtMs": 4000,
    "castMs": 0,
    "effects": [
     {
      "type": "damage",
      "coefficient": 1.6,
      "damageType": "physical",
      "powerBasis": "atk"
     }
    ],
    "requiresHitForEffects": true,
    "trigger": null,
    "maxCasts": null
   }
  ],
  "trait": {
   "type": "lifesteal",
   "fraction": 0.08,
   "perActionCap": 0.02,
   "encounterCap": 0.15,
   "openingShield": {
    "fraction": 0.08,
    "durationMs": 8000
   }
  }
 },
 "dwarf.a09.boss": {
  "id": "dwarf.a09.boss",
  "name": "符骨档主 · 赫铎",
  "area": 9,
  "rank": "boss",
  "nodes": [
   "dwarf.a09.boss"
  ],
  "elementTags": [
   "light",
   "water"
  ],
  "basicAttackType": "light",
  "skills": [
   {
    "id": "dwarf.a09.boss:0",
    "name": "裂卷光矛",
    "cooldownMs": 12000,
    "firstAtMs": 6000,
    "castMs": 0,
    "effects": [
     {
      "type": "damage",
      "coefficient": 1.8,
      "damageType": "light",
      "powerBasis": "elementalPower"
     }
    ],
    "requiresHitForEffects": true,
    "trigger": null,
    "maxCasts": null
   },
   {
    "id": "dwarf.a09.boss:1",
    "name": "寒镜折射",
    "cooldownMs": 18000,
    "firstAtMs": 10000,
    "castMs": 0,
    "effects": [
     {
      "type": "damage",
      "coefficient": 1.5,
      "damageType": "water",
      "powerBasis": "elementalPower"
     },
     {
      "type": "reflect",
      "coefficient": 0.45,
      "damageType": "light",
      "powerBasis": "elementalPower",
      "seconds": 6,
      "charges": 1,
      "requiresHpDamage": true,
      "recursive": false
     }
    ],
    "requiresHitForEffects": true,
    "trigger": null,
    "maxCasts": null
   },
   {
    "id": "dwarf.a09.boss:2",
    "name": "封库石印",
    "cooldownMs": 24000,
    "firstAtMs": 18000,
    "castMs": 0,
    "effects": [
     {
      "type": "shield",
      "fraction": 0.08,
      "seconds": 6
     }
    ],
    "requiresHitForEffects": false,
    "trigger": "cooldown_limited_two_casts",
    "maxCasts": 2
   }
  ],
  "trait": null
 },
 "dwarf.a10.boss": {
  "id": "dwarf.a10.boss",
  "name": "永铸炉王 · 乌尔铎",
  "area": 10,
  "rank": "boss",
  "nodes": [
   "dwarf.a10.boss"
  ],
  "elementTags": [
   "earth",
   "fire",
   "dark"
  ],
  "basicAttackType": "physical",
  "skills": [
   {
    "id": "dwarf.a10.boss:0",
    "name": "地脉断铸",
    "cooldownMs": 15000,
    "firstAtMs": 6000,
    "castMs": 2000,
    "effects": [
     {
      "type": "damage",
      "coefficient": 2.1,
      "damageType": "earth",
      "powerBasis": "elementalPower"
     }
    ],
    "requiresHitForEffects": true,
    "trigger": null,
    "maxCasts": null
   },
   {
    "id": "dwarf.a10.boss:1",
    "name": "黑炉潮汐",
    "cooldownMs": 18000,
    "firstAtMs": 10000,
    "castMs": 0,
    "effects": [
     {
      "type": "damage",
      "coefficient": 1.6,
      "damageType": "fire",
      "powerBasis": "elementalPower"
     },
     {
      "type": "dot",
      "damageType": "fire",
      "powerBasis": "elementalPower",
      "coefficientPerSecond": 0.12,
      "seconds": 4,
      "refresh": "same_skill",
      "mitigation": "resistance_only"
     }
    ],
    "requiresHitForEffects": true,
    "trigger": null,
    "maxCasts": null
   },
   {
    "id": "dwarf.a10.boss:2",
    "name": "回收敕令",
    "cooldownMs": 24000,
    "firstAtMs": 18000,
    "castMs": 0,
    "effects": [
     {
      "type": "damage",
      "coefficient": 1.35,
      "damageType": "dark",
      "powerBasis": "elementalPower"
     },
     {
      "type": "lifesteal",
      "fraction": 0.3,
      "perActionCap": 0.03,
      "encounterCap": 0.15
     }
    ],
    "requiresHitForEffects": true,
    "trigger": "cooldown_limited_two_casts",
    "maxCasts": 2
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
 const areas=config.areas??[1,2,3];
 if(!Array.isArray(areas)||!areas.length||new Set(areas).size!==areas.length||!areas.every(a=>Number.isInteger(a)&&a>=1&&a<=10)||![1,2,3].every(a=>areas.includes(a)))return false;
 for(const id of Object.keys(DWARF_MONSTERS).filter(id=>areas.includes(DWARF_MONSTERS[id].area))){const p=config.monsters[id];if(!p||!['hp','atk','armor','elementalPower','rewardGold','rewardXp'].every(k=>Number.isFinite(p[k])&&p[k]>=0&&p[k]<=1e9)||p.hp<=0||!Number.isSafeInteger(p.basicIntervalMs)||p.basicIntervalMs<100||p.basicIntervalMs>60000||p.elementResistance!==undefined&&(!p.elementResistance||!['earth','water','fire','wind','light','dark'].every(k=>Number.isFinite(p.elementResistance[k])&&p.elementResistance[k]>=0&&p.elementResistance[k]<=1e9)))return false;}
 if(!config.clearRewards||!areas.every(a=>{const c=config.clearRewards[a];return c&&['gold','xp'].every(k=>Number.isFinite(c[k])&&c[k]>=0&&c[k]<=1e9)&&Number.isInteger(c.materialRounds)&&c.materialRounds>=0&&c.materialRounds<=3&&['gearChance','markChance'].every(k=>Number.isFinite(c[k])&&c[k]>=0&&c[k]<=1);}))return false;
 const skills=new Set(Object.values(DWARF_MONSTERS).flatMap(d=>d.skills.map(s=>s.id)));
 if(config.skillOverrides!==undefined&&(!config.skillOverrides||Object.entries(config.skillOverrides).some(([id,x])=>!skills.has(id)||!x||Object.keys(x).length!==1||!Number.isSafeInteger(x.castMs)||x.castMs<0||x.castMs>60000)))return false;
 if(config.controlReduction!==undefined&&(!config.controlReduction||Object.entries(config.controlReduction).some(([rank,x])=>!['normal','elite','boss'].includes(rank)||!Number.isFinite(x)||x<0||x>=1)))return false;
 if(config.interruptStopMs!==undefined&&(!Number.isSafeInteger(config.interruptStopMs)||config.interruptStopMs<1||config.interruptStopMs>60000))return false;
 parameterSet=structuredClone(config);return true;
}
export function dwarfParameterSet(){return parameterSet?structuredClone(parameterSet):null;}
export function dwarfParameters(id){const p=parameterSet&&(parameterSet.areas??[1,2,3]).includes(DWARF_MONSTERS[id]?.area)?parameterSet.monsters[id]:null;return p?{...structuredClone(p),parameterSetId:parameterSet.id,skillOverrides:structuredClone(parameterSet.skillOverrides??{}),controlReduction:parameterSet.controlReduction?.[DWARF_MONSTERS[id].rank]??0,interruptStopMs:parameterSet.interruptStopMs??1100}:null;}
export function dwarfBudgetReady(areaNumber){return parameterSet!==null&&(areaNumber===undefined||(parameterSet.areas??[1,2,3]).includes(areaNumber));}
export function dwarfGroupChance(){return parameterSet?.fieldGroupChance??0;}
export function dwarfEligibleMonsters(nodeId,rank){return Object.values(DWARF_MONSTERS).filter(m=>m.nodes.includes(nodeId)&&m.rank===rank&&dwarfBudgetReady(m.area));}

// Invalid or absent parameter sets never fall back to prototype monster numbers.
if(!configureDwarfParameters(PRODUCTION_DWARF_PARAMETERS))throw new Error('Invalid approved dwarf parameter set');
