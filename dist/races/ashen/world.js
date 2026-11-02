import {buildMaterialPools} from '../../material-loot-profile.js';
// Candidate numeric calibration; canonical identities and source whitelists retained.
export const areas=[
  {
    "id": "ashen.a01",
    "race": "ashen",
    "number": 1,
    "name": "醒石边地",
    "levelRange": [
      1,
      10
    ],
    "boss": false,
    "description": "风吹开覆在石脊上的旧灰，盐壳下仍能找到可饮的矿露。"
  },
  {
    "id": "ashen.a02",
    "race": "ashen",
    "number": 2,
    "name": "盐风台地",
    "levelRange": [
      11,
      20
    ],
    "boss": false,
    "description": "白盐台地悬在风道之上，薄云母沿崖壁发出细响。"
  },
  {
    "id": "ashen.a03",
    "race": "ashen",
    "number": 3,
    "name": "冷烬浅谷",
    "levelRange": [
      21,
      30
    ],
    "boss": false,
    "description": "冷灰浅谷里凝露汇成短溪，晶芽在阴影中舒展。"
  },
  {
    "id": "ashen.a04",
    "race": "ashen",
    "number": 4,
    "name": "琉砂洼地",
    "levelRange": [
      31,
      40
    ],
    "boss": true,
    "description": "琉砂像退潮后的水面凝住，红色矿脉从洼地穿过。"
  },
  {
    "id": "ashen.a05",
    "race": "ashen",
    "number": 5,
    "name": "热脉裂原",
    "levelRange": [
      41,
      50
    ],
    "boss": false,
    "description": "地表裂口间升起暖雾，兽群循着热脉迁移。"
  },
  {
    "id": "ashen.a06",
    "race": "ashen",
    "number": 6,
    "name": "鸣晶断层",
    "levelRange": [
      51,
      60
    ],
    "boss": false,
    "description": "层叠晶壁将每一次脚步放大成遥远的回声。"
  },
  {
    "id": "ashen.a07",
    "race": "ashen",
    "number": 7,
    "name": "黑曜风口",
    "levelRange": [
      61,
      70
    ],
    "boss": true,
    "description": "黑玻断崖切开长风，白盐沿背风面堆积。"
  },
  {
    "id": "ashen.a08",
    "race": "ashen",
    "number": 8,
    "name": "白盐古盆",
    "levelRange": [
      71,
      80
    ],
    "boss": false,
    "description": "古盆底部覆着柔白盐层，陶石环列如沉默的路标。"
  },
  {
    "id": "ashen.a09",
    "race": "ashen",
    "number": 9,
    "name": "沉辉石海",
    "levelRange": [
      81,
      90
    ],
    "boss": false,
    "description": "无边晶砂在阴影中发亮，余炭埋在岩浪之间。"
  },
  {
    "id": "ashen.a10",
    "race": "ashen",
    "number": 10,
    "name": "初火深层",
    "levelRange": [
      91,
      100
    ],
    "boss": true,
    "description": "温热矿流绕过高耸晶柱，深处传来缓慢的震动。"
  }
];
export const monsters={
  "ashen.a01.normal.1": {
    "id": "ashen.a01.normal.1",
    "name": "烬砂伏蟹",
    "description": "醒石边地的烬砂伏蟹，以夹砂钳保卫栖息地。",
    "area": 1,
    "rank": "normal",
    "nodes": [
      "ashen.a01.field",
      "ashen.a01.dungeon"
    ],
    "elementTags": [
      "water"
    ],
    "skills": [
      {
        "id": "ashen.a01.normal.1:0",
        "name": "夹砂钳",
        "cooldownMs": 8000,
        "firstAtMs": 3000,
        "castMs": 0,
        "effects": [
          {
            "type": "damage",
            "coefficient": 1.12,
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
  "ashen.a01.normal.2": {
    "id": "ashen.a01.normal.2",
    "name": "盐壳钻甲",
    "description": "醒石边地的盐壳钻甲，以盐屑钻保卫栖息地。",
    "area": 1,
    "rank": "normal",
    "nodes": [
      "ashen.a01.field",
      "ashen.a01.dungeon"
    ],
    "elementTags": [
      "fire"
    ],
    "skills": [
      {
        "id": "ashen.a01.normal.2:0",
        "name": "盐屑钻",
        "cooldownMs": 10000,
        "firstAtMs": 3700,
        "castMs": 0,
        "effects": [
          {
            "type": "damage",
            "coefficient": 1.2200000000000002,
            "damageType": "fire",
            "powerBasis": "elementalPower"
          },
          {
            "type": "dot",
            "damageType": "fire",
            "powerBasis": "elementalPower",
            "coefficientPerSecond": 0.055,
            "seconds": 3,
            "refresh": "same_skill",
            "mitigation": "resistance_only"
          }
        ],
        "trigger": null,
        "maxCasts": null
      }
    ],
    "trait": null
  },
  "ashen.a01.normal.3": {
    "id": "ashen.a01.normal.3",
    "name": "玄石掘行兽",
    "description": "醒石边地的玄石掘行兽，以掘岩突保卫栖息地。",
    "area": 1,
    "rank": "normal",
    "nodes": [
      "ashen.a01.field",
      "ashen.a01.dungeon"
    ],
    "elementTags": [
      "wind"
    ],
    "skills": [
      {
        "id": "ashen.a01.normal.3:0",
        "name": "掘岩突",
        "cooldownMs": 12000,
        "firstAtMs": 4400,
        "castMs": 0,
        "effects": [
          {
            "type": "damage",
            "coefficient": 1.32,
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
  "ashen.a01.elite": {
    "id": "ashen.a01.elite",
    "name": "醒石角鹿",
    "description": "醒石边地的醒石角鹿，以踏岩震保卫栖息地。",
    "area": 1,
    "rank": "elite",
    "nodes": [
      "ashen.a01.dungeon"
    ],
    "elementTags": [
      "light"
    ],
    "skills": [
      {
        "id": "ashen.a01.elite:0",
        "name": "踏岩震",
        "cooldownMs": 14000,
        "firstAtMs": 5100,
        "castMs": 1200,
        "effects": [
          {
            "type": "damage",
            "coefficient": 1.4200000000000002,
            "damageType": "light",
            "powerBasis": "elementalPower"
          }
        ],
        "trigger": null,
        "maxCasts": null
      }
    ],
    "trait": {
      "type": "openingShield",
      "fraction": 0.08,
      "durationMs": 6000
    }
  },
  "ashen.a02.normal.1": {
    "id": "ashen.a02.normal.1",
    "name": "盐风秃鹫",
    "description": "盐风台地的盐风秃鹫，以风刃俯冲保卫栖息地。",
    "area": 2,
    "rank": "normal",
    "nodes": [
      "ashen.a02.field",
      "ashen.a02.dungeon"
    ],
    "elementTags": [
      "fire"
    ],
    "skills": [
      {
        "id": "ashen.a02.normal.1:0",
        "name": "风刃俯冲",
        "cooldownMs": 9000,
        "firstAtMs": 3000,
        "castMs": 0,
        "effects": [
          {
            "type": "damage",
            "coefficient": 1.12,
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
  "ashen.a02.normal.2": {
    "id": "ashen.a02.normal.2",
    "name": "云母伏蜥",
    "description": "盐风台地的云母伏蜥，以云片尾扫保卫栖息地。",
    "area": 2,
    "rank": "normal",
    "nodes": [
      "ashen.a02.field",
      "ashen.a02.dungeon"
    ],
    "elementTags": [
      "wind"
    ],
    "skills": [
      {
        "id": "ashen.a02.normal.2:0",
        "name": "云片尾扫",
        "cooldownMs": 11000,
        "firstAtMs": 3700,
        "castMs": 0,
        "effects": [
          {
            "type": "damage",
            "coefficient": 1.2200000000000002,
            "damageType": "wind",
            "powerBasis": "elementalPower"
          },
          {
            "type": "dot",
            "damageType": "wind",
            "powerBasis": "elementalPower",
            "coefficientPerSecond": 0.055,
            "seconds": 3,
            "refresh": "same_skill",
            "mitigation": "resistance_only"
          }
        ],
        "trigger": null,
        "maxCasts": null
      }
    ],
    "trait": null
  },
  "ashen.a02.normal.3": {
    "id": "ashen.a02.normal.3",
    "name": "盐柱巡守",
    "description": "盐风台地的盐柱巡守，以盐柱压保卫栖息地。",
    "area": 2,
    "rank": "normal",
    "nodes": [
      "ashen.a02.field",
      "ashen.a02.dungeon"
    ],
    "elementTags": [
      "light"
    ],
    "skills": [
      {
        "id": "ashen.a02.normal.3:0",
        "name": "盐柱压",
        "cooldownMs": 13000,
        "firstAtMs": 4400,
        "castMs": 0,
        "effects": [
          {
            "type": "damage",
            "coefficient": 1.32,
            "damageType": "light",
            "powerBasis": "elementalPower"
          }
        ],
        "trigger": null,
        "maxCasts": null
      }
    ],
    "trait": null
  },
  "ashen.a02.elite": {
    "id": "ashen.a02.elite",
    "name": "风蚀石羊",
    "description": "盐风台地的风蚀石羊，以逆风冲角保卫栖息地。",
    "area": 2,
    "rank": "elite",
    "nodes": [
      "ashen.a02.dungeon"
    ],
    "elementTags": [
      "dark"
    ],
    "skills": [
      {
        "id": "ashen.a02.elite:0",
        "name": "逆风冲角",
        "cooldownMs": 15000,
        "firstAtMs": 5100,
        "castMs": 1200,
        "effects": [
          {
            "type": "damage",
            "coefficient": 1.4200000000000002,
            "damageType": "dark",
            "powerBasis": "elementalPower"
          }
        ],
        "trigger": null,
        "maxCasts": null
      }
    ],
    "trait": {
      "type": "openingShield",
      "fraction": 0.08,
      "durationMs": 6000
    }
  },
  "ashen.a03.normal.1": {
    "id": "ashen.a03.normal.1",
    "name": "冷烬狐",
    "description": "冷烬浅谷的冷烬狐，以冷灰扑保卫栖息地。",
    "area": 3,
    "rank": "normal",
    "nodes": [
      "ashen.a03.field",
      "ashen.a03.dungeon"
    ],
    "elementTags": [
      "wind"
    ],
    "skills": [
      {
        "id": "ashen.a03.normal.1:0",
        "name": "冷灰扑",
        "cooldownMs": 7000,
        "firstAtMs": 3000,
        "castMs": 0,
        "effects": [
          {
            "type": "damage",
            "coefficient": 1.12,
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
  "ashen.a03.normal.2": {
    "id": "ashen.a03.normal.2",
    "name": "凝露壳蜗",
    "description": "冷烬浅谷的凝露壳蜗，以凝露吐息保卫栖息地。",
    "area": 3,
    "rank": "normal",
    "nodes": [
      "ashen.a03.field",
      "ashen.a03.dungeon"
    ],
    "elementTags": [
      "light"
    ],
    "skills": [
      {
        "id": "ashen.a03.normal.2:0",
        "name": "凝露吐息",
        "cooldownMs": 9000,
        "firstAtMs": 3700,
        "castMs": 0,
        "effects": [
          {
            "type": "damage",
            "coefficient": 1.2200000000000002,
            "damageType": "light",
            "powerBasis": "elementalPower"
          },
          {
            "type": "dot",
            "damageType": "light",
            "powerBasis": "elementalPower",
            "coefficientPerSecond": 0.055,
            "seconds": 3,
            "refresh": "same_skill",
            "mitigation": "resistance_only"
          }
        ],
        "trigger": null,
        "maxCasts": null
      }
    ],
    "trait": null
  },
  "ashen.a03.normal.3": {
    "id": "ashen.a03.normal.3",
    "name": "琉砂蛇",
    "description": "冷烬浅谷的琉砂蛇，以琉纹绞保卫栖息地。",
    "area": 3,
    "rank": "normal",
    "nodes": [
      "ashen.a03.field",
      "ashen.a03.dungeon"
    ],
    "elementTags": [
      "dark"
    ],
    "skills": [
      {
        "id": "ashen.a03.normal.3:0",
        "name": "琉纹绞",
        "cooldownMs": 11000,
        "firstAtMs": 4400,
        "castMs": 0,
        "effects": [
          {
            "type": "damage",
            "coefficient": 1.32,
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
  "ashen.a03.elite": {
    "id": "ashen.a03.elite",
    "name": "活脉晶丛",
    "description": "冷烬浅谷的活脉晶丛，以晶芽刺保卫栖息地。",
    "area": 3,
    "rank": "elite",
    "nodes": [
      "ashen.a03.dungeon"
    ],
    "elementTags": [
      "earth"
    ],
    "skills": [
      {
        "id": "ashen.a03.elite:0",
        "name": "晶芽刺",
        "cooldownMs": 13000,
        "firstAtMs": 5100,
        "castMs": 1200,
        "effects": [
          {
            "type": "damage",
            "coefficient": 1.4200000000000002,
            "damageType": "earth",
            "powerBasis": "elementalPower"
          }
        ],
        "trigger": null,
        "maxCasts": null
      }
    ],
    "trait": {
      "type": "openingShield",
      "fraction": 0.08,
      "durationMs": 6000
    }
  },
  "ashen.a04.normal.1": {
    "id": "ashen.a04.normal.1",
    "name": "琉背泽鳄",
    "description": "琉砂洼地的琉背泽鳄，以琉背摆尾保卫栖息地。",
    "area": 4,
    "rank": "normal",
    "nodes": [
      "ashen.a04.field",
      "ashen.a04.dungeon"
    ],
    "elementTags": [
      "light"
    ],
    "skills": [
      {
        "id": "ashen.a04.normal.1:0",
        "name": "琉背摆尾",
        "cooldownMs": 8000,
        "firstAtMs": 3000,
        "castMs": 0,
        "effects": [
          {
            "type": "damage",
            "coefficient": 1.12,
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
  "ashen.a04.normal.2": {
    "id": "ashen.a04.normal.2",
    "name": "赤脉针蝎",
    "description": "琉砂洼地的赤脉针蝎，以红脉针保卫栖息地。",
    "area": 4,
    "rank": "normal",
    "nodes": [
      "ashen.a04.field",
      "ashen.a04.dungeon"
    ],
    "elementTags": [
      "dark"
    ],
    "skills": [
      {
        "id": "ashen.a04.normal.2:0",
        "name": "红脉针",
        "cooldownMs": 10000,
        "firstAtMs": 3700,
        "castMs": 0,
        "effects": [
          {
            "type": "damage",
            "coefficient": 1.2200000000000002,
            "damageType": "dark",
            "powerBasis": "elementalPower"
          },
          {
            "type": "dot",
            "damageType": "dark",
            "powerBasis": "elementalPower",
            "coefficientPerSecond": 0.055,
            "seconds": 3,
            "refresh": "same_skill",
            "mitigation": "resistance_only"
          }
        ],
        "trigger": null,
        "maxCasts": null
      }
    ],
    "trait": null
  },
  "ashen.a04.normal.3": {
    "id": "ashen.a04.normal.3",
    "name": "盐洼游影",
    "description": "琉砂洼地的盐洼游影，以盐雾蚀保卫栖息地。",
    "area": 4,
    "rank": "normal",
    "nodes": [
      "ashen.a04.field",
      "ashen.a04.dungeon"
    ],
    "elementTags": [
      "earth"
    ],
    "skills": [
      {
        "id": "ashen.a04.normal.3:0",
        "name": "盐雾蚀",
        "cooldownMs": 12000,
        "firstAtMs": 4400,
        "castMs": 0,
        "effects": [
          {
            "type": "damage",
            "coefficient": 1.32,
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
  "ashen.a04.elite": {
    "id": "ashen.a04.elite",
    "name": "玻璃壳卫",
    "description": "琉砂洼地的玻璃壳卫，以玻壳冲保卫栖息地。",
    "area": 4,
    "rank": "elite",
    "nodes": [
      "ashen.a04.dungeon"
    ],
    "elementTags": [
      "water"
    ],
    "skills": [
      {
        "id": "ashen.a04.elite:0",
        "name": "玻壳冲",
        "cooldownMs": 14000,
        "firstAtMs": 5100,
        "castMs": 1200,
        "effects": [
          {
            "type": "damage",
            "coefficient": 1.4200000000000002,
            "damageType": "water",
            "powerBasis": "elementalPower"
          }
        ],
        "trigger": null,
        "maxCasts": null
      }
    ],
    "trait": {
      "type": "openingShield",
      "fraction": 0.08,
      "durationMs": 6000
    }
  },
  "ashen.a04.boss": {
    "id": "ashen.a04.boss",
    "name": "琉心巨龟 · 折潮",
    "description": "守在矿脉汇流处的古老巨兽。",
    "area": 4,
    "rank": "boss",
    "nodes": [
      "ashen.a04.boss"
    ],
    "elementTags": [
      "earth",
      "dark"
    ],
    "skills": [
      {
        "id": "ashen.a04.boss:0",
        "name": "琉岸震裂",
        "cooldownMs": 13000,
        "firstAtMs": 5000,
        "castMs": 1800,
        "effects": [
          {
            "type": "damage",
            "coefficient": 1.8,
            "damageType": "earth",
            "powerBasis": "elementalPower"
          }
        ],
        "trigger": null,
        "maxCasts": null
      },
      {
        "id": "ashen.a04.boss:1",
        "name": "折光琉幕",
        "cooldownMs": 22000,
        "firstAtMs": 14000,
        "castMs": 0,
        "effects": [
          {
            "type": "shield",
            "fraction": 0.1,
            "seconds": 7
          }
        ],
        "trigger": "cooldown_limited_two_casts",
        "maxCasts": 2
      },
      {
        "id": "ashen.a04.boss:2",
        "name": "矿脉搏动",
        "cooldownMs": 25000,
        "firstAtMs": 19000,
        "castMs": 1000,
        "effects": [
          {
            "type": "damage",
            "coefficient": 1.3,
            "damageType": "physical",
            "powerBasis": "atk"
          },
          {
            "type": "dot",
            "damageType": "earth",
            "powerBasis": "elementalPower",
            "coefficientPerSecond": 0.08,
            "seconds": 4,
            "refresh": "same_skill",
            "mitigation": "resistance_only"
          }
        ],
        "trigger": "hp_below_50_once",
        "maxCasts": 1
      }
    ],
    "trait": null
  },
  "ashen.a05.normal.1": {
    "id": "ashen.a05.normal.1",
    "name": "热脉狼",
    "description": "热脉裂原的热脉狼，以热裂噬保卫栖息地。",
    "area": 5,
    "rank": "normal",
    "nodes": [
      "ashen.a05.field",
      "ashen.a05.dungeon"
    ],
    "elementTags": [
      "dark"
    ],
    "skills": [
      {
        "id": "ashen.a05.normal.1:0",
        "name": "热裂噬",
        "cooldownMs": 9000,
        "firstAtMs": 3000,
        "castMs": 0,
        "effects": [
          {
            "type": "damage",
            "coefficient": 1.12,
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
  "ashen.a05.normal.2": {
    "id": "ashen.a05.normal.2",
    "name": "孔岩巨熊",
    "description": "热脉裂原的孔岩巨熊，以孔岩拍保卫栖息地。",
    "area": 5,
    "rank": "normal",
    "nodes": [
      "ashen.a05.field",
      "ashen.a05.dungeon"
    ],
    "elementTags": [
      "earth"
    ],
    "skills": [
      {
        "id": "ashen.a05.normal.2:0",
        "name": "孔岩拍",
        "cooldownMs": 11000,
        "firstAtMs": 3700,
        "castMs": 0,
        "effects": [
          {
            "type": "damage",
            "coefficient": 1.2200000000000002,
            "damageType": "earth",
            "powerBasis": "elementalPower"
          },
          {
            "type": "dot",
            "damageType": "earth",
            "powerBasis": "elementalPower",
            "coefficientPerSecond": 0.055,
            "seconds": 3,
            "refresh": "same_skill",
            "mitigation": "resistance_only"
          }
        ],
        "trigger": null,
        "maxCasts": null
      }
    ],
    "trait": null
  },
  "ashen.a05.normal.3": {
    "id": "ashen.a05.normal.3",
    "name": "赤矿甲虫",
    "description": "热脉裂原的赤矿甲虫，以赤甲顶保卫栖息地。",
    "area": 5,
    "rank": "normal",
    "nodes": [
      "ashen.a05.field",
      "ashen.a05.dungeon"
    ],
    "elementTags": [
      "water"
    ],
    "skills": [
      {
        "id": "ashen.a05.normal.3:0",
        "name": "赤甲顶",
        "cooldownMs": 13000,
        "firstAtMs": 4400,
        "castMs": 0,
        "effects": [
          {
            "type": "damage",
            "coefficient": 1.32,
            "damageType": "water",
            "powerBasis": "elementalPower"
          }
        ],
        "trigger": null,
        "maxCasts": null
      }
    ],
    "trait": null
  },
  "ashen.a05.elite": {
    "id": "ashen.a05.elite",
    "name": "裂原断臂者",
    "description": "热脉裂原的裂原断臂者，以断臂震地保卫栖息地。",
    "area": 5,
    "rank": "elite",
    "nodes": [
      "ashen.a05.dungeon"
    ],
    "elementTags": [
      "fire"
    ],
    "skills": [
      {
        "id": "ashen.a05.elite:0",
        "name": "断臂震地",
        "cooldownMs": 15000,
        "firstAtMs": 5100,
        "castMs": 1200,
        "effects": [
          {
            "type": "damage",
            "coefficient": 1.4200000000000002,
            "damageType": "fire",
            "powerBasis": "elementalPower"
          }
        ],
        "trigger": null,
        "maxCasts": null
      }
    ],
    "trait": {
      "type": "openingShield",
      "fraction": 0.08,
      "durationMs": 6000
    }
  },
  "ashen.a06.normal.1": {
    "id": "ashen.a06.normal.1",
    "name": "鸣晶螳螂",
    "description": "鸣晶断层的鸣晶螳螂，以鸣刃斩保卫栖息地。",
    "area": 6,
    "rank": "normal",
    "nodes": [
      "ashen.a06.field",
      "ashen.a06.dungeon"
    ],
    "elementTags": [
      "earth"
    ],
    "skills": [
      {
        "id": "ashen.a06.normal.1:0",
        "name": "鸣刃斩",
        "cooldownMs": 7000,
        "firstAtMs": 3000,
        "castMs": 0,
        "effects": [
          {
            "type": "damage",
            "coefficient": 1.12,
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
  "ashen.a06.normal.2": {
    "id": "ashen.a06.normal.2",
    "name": "黑玻羽隼",
    "description": "鸣晶断层的黑玻羽隼，以黑羽掠保卫栖息地。",
    "area": 6,
    "rank": "normal",
    "nodes": [
      "ashen.a06.field",
      "ashen.a06.dungeon"
    ],
    "elementTags": [
      "water"
    ],
    "skills": [
      {
        "id": "ashen.a06.normal.2:0",
        "name": "黑羽掠",
        "cooldownMs": 9000,
        "firstAtMs": 3700,
        "castMs": 0,
        "effects": [
          {
            "type": "damage",
            "coefficient": 1.2200000000000002,
            "damageType": "water",
            "powerBasis": "elementalPower"
          },
          {
            "type": "dot",
            "damageType": "water",
            "powerBasis": "elementalPower",
            "coefficientPerSecond": 0.055,
            "seconds": 3,
            "refresh": "same_skill",
            "mitigation": "resistance_only"
          }
        ],
        "trigger": null,
        "maxCasts": null
      }
    ],
    "trait": null
  },
  "ashen.a06.normal.3": {
    "id": "ashen.a06.normal.3",
    "name": "共鸣晶蛛",
    "description": "鸣晶断层的共鸣晶蛛，以振丝缚保卫栖息地。",
    "area": 6,
    "rank": "normal",
    "nodes": [
      "ashen.a06.field",
      "ashen.a06.dungeon"
    ],
    "elementTags": [
      "fire"
    ],
    "skills": [
      {
        "id": "ashen.a06.normal.3:0",
        "name": "振丝缚",
        "cooldownMs": 11000,
        "firstAtMs": 4400,
        "castMs": 0,
        "effects": [
          {
            "type": "damage",
            "coefficient": 1.32,
            "damageType": "fire",
            "powerBasis": "elementalPower"
          }
        ],
        "trigger": null,
        "maxCasts": null
      }
    ],
    "trait": null
  },
  "ashen.a06.elite": {
    "id": "ashen.a06.elite",
    "name": "棱背石蜥",
    "description": "鸣晶断层的棱背石蜥，以棱光穿保卫栖息地。",
    "area": 6,
    "rank": "elite",
    "nodes": [
      "ashen.a06.dungeon"
    ],
    "elementTags": [
      "wind"
    ],
    "skills": [
      {
        "id": "ashen.a06.elite:0",
        "name": "棱光穿",
        "cooldownMs": 13000,
        "firstAtMs": 5100,
        "castMs": 1200,
        "effects": [
          {
            "type": "damage",
            "coefficient": 1.4200000000000002,
            "damageType": "wind",
            "powerBasis": "elementalPower"
          }
        ],
        "trigger": null,
        "maxCasts": null
      }
    ],
    "trait": {
      "type": "followers",
      "shares": [
        0.52,
        0.12,
        0.12,
        0.12,
        0.12
      ],
      "followerMonsterId": "ashen.a06.normal.3"
    }
  },
  "ashen.a07.normal.1": {
    "id": "ashen.a07.normal.1",
    "name": "黑曜刀卫",
    "description": "黑曜风口的黑曜刀卫，以黑曜横切保卫栖息地。",
    "area": 7,
    "rank": "normal",
    "nodes": [
      "ashen.a07.field",
      "ashen.a07.dungeon"
    ],
    "elementTags": [
      "water"
    ],
    "skills": [
      {
        "id": "ashen.a07.normal.1:0",
        "name": "黑曜横切",
        "cooldownMs": 8000,
        "firstAtMs": 3000,
        "castMs": 0,
        "effects": [
          {
            "type": "damage",
            "coefficient": 1.12,
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
  "ashen.a07.normal.2": {
    "id": "ashen.a07.normal.2",
    "name": "白盐夜蛾",
    "description": "黑曜风口的白盐夜蛾，以白盐粉保卫栖息地。",
    "area": 7,
    "rank": "normal",
    "nodes": [
      "ashen.a07.field",
      "ashen.a07.dungeon"
    ],
    "elementTags": [
      "fire"
    ],
    "skills": [
      {
        "id": "ashen.a07.normal.2:0",
        "name": "白盐粉",
        "cooldownMs": 10000,
        "firstAtMs": 3700,
        "castMs": 0,
        "effects": [
          {
            "type": "damage",
            "coefficient": 1.2200000000000002,
            "damageType": "fire",
            "powerBasis": "elementalPower"
          },
          {
            "type": "dot",
            "damageType": "fire",
            "powerBasis": "elementalPower",
            "coefficientPerSecond": 0.055,
            "seconds": 3,
            "refresh": "same_skill",
            "mitigation": "resistance_only"
          }
        ],
        "trigger": null,
        "maxCasts": null
      }
    ],
    "trait": null
  },
  "ashen.a07.normal.3": {
    "id": "ashen.a07.normal.3",
    "name": "云母风龙",
    "description": "黑曜风口的云母风龙，以风口吐息保卫栖息地。",
    "area": 7,
    "rank": "normal",
    "nodes": [
      "ashen.a07.field",
      "ashen.a07.dungeon"
    ],
    "elementTags": [
      "wind"
    ],
    "skills": [
      {
        "id": "ashen.a07.normal.3:0",
        "name": "风口吐息",
        "cooldownMs": 12000,
        "firstAtMs": 4400,
        "castMs": 0,
        "effects": [
          {
            "type": "damage",
            "coefficient": 1.32,
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
  "ashen.a07.elite": {
    "id": "ashen.a07.elite",
    "name": "黑风羽兽",
    "description": "黑曜风口的黑风羽兽，以黑风振翼保卫栖息地。",
    "area": 7,
    "rank": "elite",
    "nodes": [
      "ashen.a07.dungeon"
    ],
    "elementTags": [
      "light"
    ],
    "skills": [
      {
        "id": "ashen.a07.elite:0",
        "name": "黑风振翼",
        "cooldownMs": 14000,
        "firstAtMs": 5100,
        "castMs": 1200,
        "effects": [
          {
            "type": "damage",
            "coefficient": 1.4200000000000002,
            "damageType": "light",
            "powerBasis": "elementalPower"
          }
        ],
        "trigger": null,
        "maxCasts": null
      }
    ],
    "trait": {
      "type": "openingShield",
      "fraction": 0.08,
      "durationMs": 6000
    }
  },
  "ashen.a07.boss": {
    "id": "ashen.a07.boss",
    "name": "黑曜翼王 · 逆岚",
    "description": "守在矿脉汇流处的古老巨兽。",
    "area": 7,
    "rank": "boss",
    "nodes": [
      "ashen.a07.boss"
    ],
    "elementTags": [
      "wind",
      "dark"
    ],
    "skills": [
      {
        "id": "ashen.a07.boss:0",
        "name": "逆岚断翼",
        "cooldownMs": 13000,
        "firstAtMs": 5000,
        "castMs": 1800,
        "effects": [
          {
            "type": "damage",
            "coefficient": 1.8,
            "damageType": "wind",
            "powerBasis": "elementalPower"
          }
        ],
        "trigger": null,
        "maxCasts": null
      },
      {
        "id": "ashen.a07.boss:1",
        "name": "黑风晶幕",
        "cooldownMs": 22000,
        "firstAtMs": 14000,
        "castMs": 0,
        "effects": [
          {
            "type": "shield",
            "fraction": 0.1,
            "seconds": 7
          }
        ],
        "trigger": "cooldown_limited_two_casts",
        "maxCasts": 2
      },
      {
        "id": "ashen.a07.boss:2",
        "name": "矿脉搏动",
        "cooldownMs": 25000,
        "firstAtMs": 19000,
        "castMs": 1000,
        "effects": [
          {
            "type": "damage",
            "coefficient": 1.3,
            "damageType": "physical",
            "powerBasis": "atk"
          },
          {
            "type": "dot",
            "damageType": "wind",
            "powerBasis": "elementalPower",
            "coefficientPerSecond": 0.08,
            "seconds": 4,
            "refresh": "same_skill",
            "mitigation": "resistance_only"
          }
        ],
        "trigger": "hp_below_50_once",
        "maxCasts": 1
      }
    ],
    "trait": null
  },
  "ashen.a08.normal.1": {
    "id": "ashen.a08.normal.1",
    "name": "盐骨百足",
    "description": "白盐古盆的盐骨百足，以盐骨缠保卫栖息地。",
    "area": 8,
    "rank": "normal",
    "nodes": [
      "ashen.a08.field",
      "ashen.a08.dungeon"
    ],
    "elementTags": [
      "fire"
    ],
    "skills": [
      {
        "id": "ashen.a08.normal.1:0",
        "name": "盐骨缠",
        "cooldownMs": 9000,
        "firstAtMs": 3000,
        "castMs": 0,
        "effects": [
          {
            "type": "damage",
            "coefficient": 1.12,
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
  "ashen.a08.normal.2": {
    "id": "ashen.a08.normal.2",
    "name": "柔白晶像",
    "description": "白盐古盆的柔白晶像，以晶髓掌保卫栖息地。",
    "area": 8,
    "rank": "normal",
    "nodes": [
      "ashen.a08.field",
      "ashen.a08.dungeon"
    ],
    "elementTags": [
      "wind"
    ],
    "skills": [
      {
        "id": "ashen.a08.normal.2:0",
        "name": "晶髓掌",
        "cooldownMs": 11000,
        "firstAtMs": 3700,
        "castMs": 0,
        "effects": [
          {
            "type": "damage",
            "coefficient": 1.2200000000000002,
            "damageType": "wind",
            "powerBasis": "elementalPower"
          },
          {
            "type": "dot",
            "damageType": "wind",
            "powerBasis": "elementalPower",
            "coefficientPerSecond": 0.055,
            "seconds": 3,
            "refresh": "same_skill",
            "mitigation": "resistance_only"
          }
        ],
        "trigger": null,
        "maxCasts": null
      }
    ],
    "trait": null
  },
  "ashen.a08.normal.3": {
    "id": "ashen.a08.normal.3",
    "name": "陶石犀",
    "description": "白盐古盆的陶石犀，以陶角冲保卫栖息地。",
    "area": 8,
    "rank": "normal",
    "nodes": [
      "ashen.a08.field",
      "ashen.a08.dungeon"
    ],
    "elementTags": [
      "light"
    ],
    "skills": [
      {
        "id": "ashen.a08.normal.3:0",
        "name": "陶角冲",
        "cooldownMs": 13000,
        "firstAtMs": 4400,
        "castMs": 0,
        "effects": [
          {
            "type": "damage",
            "coefficient": 1.32,
            "damageType": "light",
            "powerBasis": "elementalPower"
          }
        ],
        "trigger": null,
        "maxCasts": null
      }
    ],
    "trait": null
  },
  "ashen.a08.elite": {
    "id": "ashen.a08.elite",
    "name": "古盆盐偶",
    "description": "白盐古盆的古盆盐偶，以盆地震鸣保卫栖息地。",
    "area": 8,
    "rank": "elite",
    "nodes": [
      "ashen.a08.dungeon"
    ],
    "elementTags": [
      "dark"
    ],
    "skills": [
      {
        "id": "ashen.a08.elite:0",
        "name": "盆地震鸣",
        "cooldownMs": 15000,
        "firstAtMs": 5100,
        "castMs": 1200,
        "effects": [
          {
            "type": "damage",
            "coefficient": 1.4200000000000002,
            "damageType": "dark",
            "powerBasis": "elementalPower"
          }
        ],
        "trigger": null,
        "maxCasts": null
      }
    ],
    "trait": {
      "type": "openingShield",
      "fraction": 0.08,
      "durationMs": 6000
    }
  },
  "ashen.a09.normal.1": {
    "id": "ashen.a09.normal.1",
    "name": "沉辉浮母",
    "description": "沉辉石海的沉辉浮母，以沉辉鞭保卫栖息地。",
    "area": 9,
    "rank": "normal",
    "nodes": [
      "ashen.a09.field",
      "ashen.a09.dungeon"
    ],
    "elementTags": [
      "wind"
    ],
    "skills": [
      {
        "id": "ashen.a09.normal.1:0",
        "name": "沉辉鞭",
        "cooldownMs": 7000,
        "firstAtMs": 3000,
        "castMs": 0,
        "effects": [
          {
            "type": "damage",
            "coefficient": 1.12,
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
  "ashen.a09.normal.2": {
    "id": "ashen.a09.normal.2",
    "name": "悬晶魔眼",
    "description": "沉辉石海的悬晶魔眼，以暗晶凝视保卫栖息地。",
    "area": 9,
    "rank": "normal",
    "nodes": [
      "ashen.a09.field",
      "ashen.a09.dungeon"
    ],
    "elementTags": [
      "light"
    ],
    "skills": [
      {
        "id": "ashen.a09.normal.2:0",
        "name": "暗晶凝视",
        "cooldownMs": 9000,
        "firstAtMs": 3700,
        "castMs": 0,
        "effects": [
          {
            "type": "damage",
            "coefficient": 1.2200000000000002,
            "damageType": "light",
            "powerBasis": "elementalPower"
          },
          {
            "type": "dot",
            "damageType": "light",
            "powerBasis": "elementalPower",
            "coefficientPerSecond": 0.055,
            "seconds": 3,
            "refresh": "same_skill",
            "mitigation": "resistance_only"
          }
        ],
        "trigger": null,
        "maxCasts": null
      }
    ],
    "trait": null
  },
  "ashen.a09.normal.3": {
    "id": "ashen.a09.normal.3",
    "name": "余炭岩虎",
    "description": "沉辉石海的余炭岩虎，以炭牙扑保卫栖息地。",
    "area": 9,
    "rank": "normal",
    "nodes": [
      "ashen.a09.field",
      "ashen.a09.dungeon"
    ],
    "elementTags": [
      "dark"
    ],
    "skills": [
      {
        "id": "ashen.a09.normal.3:0",
        "name": "炭牙扑",
        "cooldownMs": 11000,
        "firstAtMs": 4400,
        "castMs": 0,
        "effects": [
          {
            "type": "damage",
            "coefficient": 1.32,
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
  "ashen.a09.elite": {
    "id": "ashen.a09.elite",
    "name": "暮辉晶骑",
    "description": "沉辉石海的暮辉晶骑，以暮辉骑枪保卫栖息地。",
    "area": 9,
    "rank": "elite",
    "nodes": [
      "ashen.a09.dungeon"
    ],
    "elementTags": [
      "earth"
    ],
    "skills": [
      {
        "id": "ashen.a09.elite:0",
        "name": "暮辉骑枪",
        "cooldownMs": 13000,
        "firstAtMs": 5100,
        "castMs": 1200,
        "effects": [
          {
            "type": "damage",
            "coefficient": 1.4200000000000002,
            "damageType": "earth",
            "powerBasis": "elementalPower"
          }
        ],
        "trigger": null,
        "maxCasts": null
      }
    ],
    "trait": {
      "type": "followers",
      "shares": [
        0.52,
        0.12,
        0.12,
        0.12,
        0.12
      ],
      "followerMonsterId": "ashen.a09.normal.2"
    }
  },
  "ashen.a10.normal.1": {
    "id": "ashen.a10.normal.1",
    "name": "深火蝾螈",
    "description": "初火深层的深火蝾螈，以深焰吐保卫栖息地。",
    "area": 10,
    "rank": "normal",
    "nodes": [
      "ashen.a10.field",
      "ashen.a10.dungeon"
    ],
    "elementTags": [
      "light"
    ],
    "skills": [
      {
        "id": "ashen.a10.normal.1:0",
        "name": "深焰吐",
        "cooldownMs": 8000,
        "firstAtMs": 3000,
        "castMs": 0,
        "effects": [
          {
            "type": "damage",
            "coefficient": 1.12,
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
  "ashen.a10.normal.2": {
    "id": "ashen.a10.normal.2",
    "name": "余烬角兽",
    "description": "初火深层的余烬角兽，以火角撞保卫栖息地。",
    "area": 10,
    "rank": "normal",
    "nodes": [
      "ashen.a10.field",
      "ashen.a10.dungeon"
    ],
    "elementTags": [
      "dark"
    ],
    "skills": [
      {
        "id": "ashen.a10.normal.2:0",
        "name": "火角撞",
        "cooldownMs": 10000,
        "firstAtMs": 3700,
        "castMs": 0,
        "effects": [
          {
            "type": "damage",
            "coefficient": 1.2200000000000002,
            "damageType": "dark",
            "powerBasis": "elementalPower"
          },
          {
            "type": "dot",
            "damageType": "dark",
            "powerBasis": "elementalPower",
            "coefficientPerSecond": 0.055,
            "seconds": 3,
            "refresh": "same_skill",
            "mitigation": "resistance_only"
          }
        ],
        "trigger": null,
        "maxCasts": null
      }
    ],
    "trait": null
  },
  "ashen.a10.normal.3": {
    "id": "ashen.a10.normal.3",
    "name": "耐焰陶卫",
    "description": "初火深层的耐焰陶卫，以陶片散射保卫栖息地。",
    "area": 10,
    "rank": "normal",
    "nodes": [
      "ashen.a10.field",
      "ashen.a10.dungeon"
    ],
    "elementTags": [
      "earth"
    ],
    "skills": [
      {
        "id": "ashen.a10.normal.3:0",
        "name": "陶片散射",
        "cooldownMs": 12000,
        "firstAtMs": 4400,
        "castMs": 0,
        "effects": [
          {
            "type": "damage",
            "coefficient": 1.32,
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
  "ashen.a10.elite": {
    "id": "ashen.a10.elite",
    "name": "初火巨兽",
    "description": "初火深层的初火巨兽，以原焰践踏保卫栖息地。",
    "area": 10,
    "rank": "elite",
    "nodes": [
      "ashen.a10.dungeon"
    ],
    "elementTags": [
      "water"
    ],
    "skills": [
      {
        "id": "ashen.a10.elite:0",
        "name": "原焰践踏",
        "cooldownMs": 14000,
        "firstAtMs": 5100,
        "castMs": 1200,
        "effects": [
          {
            "type": "damage",
            "coefficient": 1.4200000000000002,
            "damageType": "water",
            "powerBasis": "elementalPower"
          }
        ],
        "trigger": null,
        "maxCasts": null
      }
    ],
    "trait": {
      "type": "openingShield",
      "fraction": 0.08,
      "durationMs": 6000
    }
  },
  "ashen.a10.boss": {
    "id": "ashen.a10.boss",
    "name": "初火晶龙 · 熔冠",
    "description": "守在矿脉汇流处的古老巨兽。",
    "area": 10,
    "rank": "boss",
    "nodes": [
      "ashen.a10.boss"
    ],
    "elementTags": [
      "fire",
      "dark"
    ],
    "skills": [
      {
        "id": "ashen.a10.boss:0",
        "name": "熔冠坠星",
        "cooldownMs": 13000,
        "firstAtMs": 5000,
        "castMs": 1800,
        "effects": [
          {
            "type": "damage",
            "coefficient": 1.8,
            "damageType": "fire",
            "powerBasis": "elementalPower"
          }
        ],
        "trigger": null,
        "maxCasts": null
      },
      {
        "id": "ashen.a10.boss:1",
        "name": "冷凝火冠",
        "cooldownMs": 22000,
        "firstAtMs": 14000,
        "castMs": 0,
        "effects": [
          {
            "type": "shield",
            "fraction": 0.1,
            "seconds": 7
          }
        ],
        "trigger": "cooldown_limited_two_casts",
        "maxCasts": 2
      },
      {
        "id": "ashen.a10.boss:2",
        "name": "矿脉搏动",
        "cooldownMs": 25000,
        "firstAtMs": 19000,
        "castMs": 1000,
        "effects": [
          {
            "type": "damage",
            "coefficient": 1.3,
            "damageType": "physical",
            "powerBasis": "atk"
          },
          {
            "type": "dot",
            "damageType": "fire",
            "powerBasis": "elementalPower",
            "coefficientPerSecond": 0.08,
            "seconds": 4,
            "refresh": "same_skill",
            "mitigation": "resistance_only"
          }
        ],
        "trigger": "hp_below_50_once",
        "maxCasts": 1
      }
    ],
    "trait": {
      "type": "followers",
      "shares": [
        0.64,
        0.12,
        0.12,
        0.12
      ],
      "followerMonsterId": "ashen.a10.normal.3"
    }
  }
};
export const parameters={
  "id": "ashen-a01-a10-candidate-v1",
  "reviewed": true,
  "testOnly": false,
  "status": "initial-budget-reviewed-matched-host-evidence",
  "fieldGroupChance": 0.04,
  "clearRewards": {
    "1": {
      "gold": 6,
      "xp": 32,
      "materialRounds": 0,
      "gearChance": 0.35,
      "markChance": 0.02
    },
    "2": {
      "gold": 8,
      "xp": 40,
      "materialRounds": 0,
      "gearChance": 0.35,
      "markChance": 0.02
    },
    "3": {
      "gold": 8,
      "xp": 48,
      "materialRounds": 0,
      "gearChance": 0.35,
      "markChance": 0.02
    },
    "4": {
      "gold": 8,
      "xp": 56,
      "materialRounds": 0,
      "gearChance": 0.35,
      "markChance": 0.02
    },
    "5": {
      "gold": 8,
      "xp": 64,
      "materialRounds": 0,
      "gearChance": 0.35,
      "markChance": 0.02
    },
    "6": {
      "gold": 10,
      "xp": 72,
      "materialRounds": 0,
      "gearChance": 0.35,
      "markChance": 0.02
    },
    "7": {
      "gold": 10,
      "xp": 80,
      "materialRounds": 0,
      "gearChance": 0.35,
      "markChance": 0.02
    },
    "8": {
      "gold": 12,
      "xp": 88,
      "materialRounds": 0,
      "gearChance": 0.35,
      "markChance": 0.02
    },
    "9": {
      "gold": 12,
      "xp": 96,
      "materialRounds": 0,
      "gearChance": 0.35,
      "markChance": 0.02
    },
    "10": {
      "gold": 14,
      "xp": 104,
      "materialRounds": 0,
      "gearChance": 0.35,
      "markChance": 0.02
    }
  },
  "monsters": {
    "ashen.a01.normal.1": {
      "hp": 600,
      "atk": 3,
      "armor": 12,
      "elementalPower": 2,
      "basicIntervalMs": 2200,
      "rewardGold": 2,
      "rewardXp": 16,
      "elementResistance": {
        "earth": 3,
        "water": 3,
        "fire": 3,
        "wind": 3,
        "light": 3,
        "dark": 3
      }
    },
    "ashen.a01.normal.2": {
      "hp": 450,
      "atk": 2,
      "armor": 8,
      "elementalPower": 2,
      "basicIntervalMs": 1800,
      "rewardGold": 2,
      "rewardXp": 16,
      "elementResistance": {
        "earth": 12,
        "water": 3,
        "fire": 3,
        "wind": 3,
        "light": 3,
        "dark": 3
      }
    },
    "ashen.a01.normal.3": {
      "hp": 780,
      "atk": 4,
      "armor": 16,
      "elementalPower": 2,
      "basicIntervalMs": 2800,
      "rewardGold": 2,
      "rewardXp": 16,
      "elementResistance": {
        "earth": 12,
        "water": 3,
        "fire": 3,
        "wind": 3,
        "light": 3,
        "dark": 3
      }
    },
    "ashen.a01.elite": {
      "hp": 2000,
      "atk": 48,
      "armor": 22,
      "elementalPower": 14,
      "basicIntervalMs": 2200,
      "rewardGold": 10,
      "rewardXp": 55,
      "elementResistance": {
        "earth": 13,
        "water": 3,
        "fire": 3,
        "wind": 3,
        "light": 3,
        "dark": 3
      }
    },
    "ashen.a02.normal.1": {
      "hp": 1100,
      "atk": 3,
      "armor": 19,
      "elementalPower": 2,
      "basicIntervalMs": 2200,
      "rewardGold": 3,
      "rewardXp": 20,
      "elementResistance": {
        "earth": 15,
        "water": 4,
        "fire": 4,
        "wind": 4,
        "light": 4,
        "dark": 4
      }
    },
    "ashen.a02.normal.2": {
      "hp": 850,
      "atk": 2,
      "armor": 13,
      "elementalPower": 2,
      "basicIntervalMs": 1800,
      "rewardGold": 3,
      "rewardXp": 20,
      "elementResistance": {
        "earth": 4,
        "water": 4,
        "fire": 4,
        "wind": 15,
        "light": 4,
        "dark": 4
      }
    },
    "ashen.a02.normal.3": {
      "hp": 1430,
      "atk": 4,
      "armor": 26,
      "elementalPower": 2,
      "basicIntervalMs": 2800,
      "rewardGold": 3,
      "rewardXp": 20,
      "elementResistance": {
        "earth": 15,
        "water": 4,
        "fire": 4,
        "wind": 4,
        "light": 4,
        "dark": 4
      }
    },
    "ashen.a02.elite": {
      "hp": 4200,
      "atk": 80,
      "armor": 32,
      "elementalPower": 22,
      "basicIntervalMs": 2200,
      "rewardGold": 12,
      "rewardXp": 66,
      "elementResistance": {
        "earth": 16,
        "water": 4,
        "fire": 4,
        "wind": 4,
        "light": 4,
        "dark": 4
      }
    },
    "ashen.a03.normal.1": {
      "hp": 1800,
      "atk": 5,
      "armor": 26,
      "elementalPower": 3,
      "basicIntervalMs": 2200,
      "rewardGold": 3,
      "rewardXp": 24,
      "elementResistance": {
        "earth": 5,
        "water": 5,
        "fire": 5,
        "wind": 5,
        "light": 5,
        "dark": 18
      }
    },
    "ashen.a03.normal.2": {
      "hp": 1440,
      "atk": 4,
      "armor": 18,
      "elementalPower": 3,
      "basicIntervalMs": 1800,
      "rewardGold": 3,
      "rewardXp": 24,
      "elementResistance": {
        "earth": 18,
        "water": 5,
        "fire": 5,
        "wind": 5,
        "light": 5,
        "dark": 5
      }
    },
    "ashen.a03.normal.3": {
      "hp": 2340,
      "atk": 6,
      "armor": 36,
      "elementalPower": 3,
      "basicIntervalMs": 2800,
      "rewardGold": 3,
      "rewardXp": 24,
      "elementResistance": {
        "earth": 18,
        "water": 5,
        "fire": 5,
        "wind": 5,
        "light": 18,
        "dark": 5
      }
    },
    "ashen.a03.elite": {
      "hp": 7200,
      "atk": 110,
      "armor": 42,
      "elementalPower": 32,
      "basicIntervalMs": 2200,
      "rewardGold": 14,
      "rewardXp": 79,
      "elementResistance": {
        "earth": 19,
        "water": 6,
        "fire": 6,
        "wind": 6,
        "light": 6,
        "dark": 19
      }
    },
    "ashen.a04.normal.1": {
      "hp": 2380,
      "atk": 4,
      "armor": 28,
      "elementalPower": 2,
      "basicIntervalMs": 2200,
      "rewardGold": 4,
      "rewardXp": 28,
      "elementResistance": {
        "earth": 6,
        "water": 6,
        "fire": 20,
        "wind": 6,
        "light": 6,
        "dark": 6
      }
    },
    "ashen.a04.normal.2": {
      "hp": 1918,
      "atk": 4,
      "armor": 19,
      "elementalPower": 2,
      "basicIntervalMs": 1800,
      "rewardGold": 4,
      "rewardXp": 28,
      "elementResistance": {
        "earth": 6,
        "water": 6,
        "fire": 20,
        "wind": 20,
        "light": 6,
        "dark": 6
      }
    },
    "ashen.a04.normal.3": {
      "hp": 3076,
      "atk": 5,
      "armor": 39,
      "elementalPower": 2,
      "basicIntervalMs": 2800,
      "rewardGold": 4,
      "rewardXp": 28,
      "elementResistance": {
        "earth": 20,
        "water": 6,
        "fire": 20,
        "wind": 6,
        "light": 6,
        "dark": 6
      }
    },
    "ashen.a04.elite": {
      "hp": 9146,
      "atk": 161,
      "armor": 45,
      "elementalPower": 40,
      "basicIntervalMs": 2200,
      "rewardGold": 18,
      "rewardXp": 92,
      "elementResistance": {
        "earth": 7,
        "water": 7,
        "fire": 20,
        "wind": 20,
        "light": 7,
        "dark": 7
      }
    },
    "ashen.a04.boss": {
      "hp": 15000,
      "atk": 110,
      "armor": 48,
      "elementalPower": 45,
      "basicIntervalMs": 2200,
      "rewardGold": 45,
      "rewardXp": 312,
      "elementResistance": {
        "earth": 19,
        "water": 6,
        "fire": 6,
        "wind": 6,
        "light": 6,
        "dark": 19
      }
    },
    "ashen.a05.normal.1": {
      "hp": 2989,
      "atk": 7,
      "armor": 30,
      "elementalPower": 3,
      "basicIntervalMs": 2200,
      "rewardGold": 4,
      "rewardXp": 32,
      "elementResistance": {
        "earth": 21,
        "water": 21,
        "fire": 7,
        "wind": 7,
        "light": 7,
        "dark": 7
      }
    },
    "ashen.a05.normal.2": {
      "hp": 2406,
      "atk": 5,
      "armor": 21,
      "elementalPower": 3,
      "basicIntervalMs": 1800,
      "rewardGold": 4,
      "rewardXp": 32,
      "elementResistance": {
        "earth": 7,
        "water": 21,
        "fire": 7,
        "wind": 21,
        "light": 7,
        "dark": 7
      }
    },
    "ashen.a05.normal.3": {
      "hp": 3839,
      "atk": 8,
      "armor": 42,
      "elementalPower": 3,
      "basicIntervalMs": 2800,
      "rewardGold": 4,
      "rewardXp": 32,
      "elementResistance": {
        "earth": 21,
        "water": 7,
        "fire": 7,
        "wind": 7,
        "light": 7,
        "dark": 7
      }
    },
    "ashen.a05.elite": {
      "hp": 11190,
      "atk": 230,
      "armor": 49,
      "elementalPower": 50,
      "basicIntervalMs": 2200,
      "rewardGold": 18,
      "rewardXp": 106,
      "elementResistance": {
        "earth": 8,
        "water": 22,
        "fire": 8,
        "wind": 8,
        "light": 8,
        "dark": 8
      }
    },
    "ashen.a06.normal.1": {
      "hp": 3740,
      "atk": 9,
      "armor": 32,
      "elementalPower": 4,
      "basicIntervalMs": 2200,
      "rewardGold": 5,
      "rewardXp": 36,
      "elementResistance": {
        "earth": 22,
        "water": 8,
        "fire": 22,
        "wind": 8,
        "light": 8,
        "dark": 8
      }
    },
    "ashen.a06.normal.2": {
      "hp": 3031,
      "atk": 7,
      "armor": 22,
      "elementalPower": 4,
      "basicIntervalMs": 1800,
      "rewardGold": 5,
      "rewardXp": 36,
      "elementResistance": {
        "earth": 8,
        "water": 22,
        "fire": 8,
        "wind": 22,
        "light": 8,
        "dark": 8
      }
    },
    "ashen.a06.normal.3": {
      "hp": 4777,
      "atk": 11,
      "armor": 45,
      "elementalPower": 4,
      "basicIntervalMs": 2800,
      "rewardGold": 5,
      "rewardXp": 36,
      "elementResistance": {
        "earth": 22,
        "water": 8,
        "fire": 22,
        "wind": 8,
        "light": 8,
        "dark": 8
      }
    },
    "ashen.a06.elite": {
      "hp": 13854,
      "atk": 327,
      "armor": 52,
      "elementalPower": 61,
      "basicIntervalMs": 2200,
      "rewardGold": 23,
      "rewardXp": 119,
      "elementResistance": {
        "earth": 23,
        "water": 8,
        "fire": 23,
        "wind": 8,
        "light": 8,
        "dark": 8
      }
    },
    "ashen.a07.normal.1": {
      "hp": 4609,
      "atk": 15,
      "armor": 34,
      "elementalPower": 5,
      "basicIntervalMs": 2200,
      "rewardGold": 5,
      "rewardXp": 40,
      "elementResistance": {
        "earth": 24,
        "water": 9,
        "fire": 9,
        "wind": 9,
        "light": 9,
        "dark": 9
      }
    },
    "ashen.a07.normal.2": {
      "hp": 3732,
      "atk": 12,
      "armor": 24,
      "elementalPower": 5,
      "basicIntervalMs": 1800,
      "rewardGold": 5,
      "rewardXp": 40,
      "elementResistance": {
        "earth": 9,
        "water": 24,
        "fire": 9,
        "wind": 9,
        "light": 9,
        "dark": 9
      }
    },
    "ashen.a07.normal.3": {
      "hp": 5856,
      "atk": 18,
      "armor": 48,
      "elementalPower": 5,
      "basicIntervalMs": 2800,
      "rewardGold": 5,
      "rewardXp": 40,
      "elementResistance": {
        "earth": 24,
        "water": 9,
        "fire": 9,
        "wind": 9,
        "light": 24,
        "dark": 9
      }
    },
    "ashen.a07.elite": {
      "hp": 16663,
      "atk": 459,
      "armor": 55,
      "elementalPower": 74,
      "basicIntervalMs": 2200,
      "rewardGold": 23,
      "rewardXp": 132,
      "elementResistance": {
        "earth": 24,
        "water": 9,
        "fire": 9,
        "wind": 9,
        "light": 24,
        "dark": 9
      }
    },
    "ashen.a07.boss": {
      "hp": 29774,
      "atk": 327,
      "armor": 60,
      "elementalPower": 85,
      "basicIntervalMs": 2200,
      "rewardGold": 75,
      "rewardXp": 468,
      "elementResistance": {
        "earth": 23,
        "water": 8,
        "fire": 23,
        "wind": 8,
        "light": 8,
        "dark": 8
      }
    },
    "ashen.a08.normal.1": {
      "hp": 4558,
      "atk": 17,
      "armor": 25,
      "elementalPower": 6,
      "basicIntervalMs": 1800,
      "rewardGold": 6,
      "rewardXp": 44,
      "elementResistance": {
        "earth": 25,
        "water": 10,
        "fire": 10,
        "wind": 10,
        "light": 10,
        "dark": 25
      }
    },
    "ashen.a08.normal.2": {
      "hp": 5591,
      "atk": 21,
      "armor": 36,
      "elementalPower": 6,
      "basicIntervalMs": 2200,
      "rewardGold": 6,
      "rewardXp": 44,
      "elementResistance": {
        "earth": 25,
        "water": 10,
        "fire": 10,
        "wind": 10,
        "light": 10,
        "dark": 10
      }
    },
    "ashen.a08.normal.3": {
      "hp": 7114,
      "atk": 25,
      "armor": 50,
      "elementalPower": 6,
      "basicIntervalMs": 2800,
      "rewardGold": 6,
      "rewardXp": 44,
      "elementResistance": {
        "earth": 25,
        "water": 10,
        "fire": 10,
        "wind": 10,
        "light": 10,
        "dark": 10
      }
    },
    "ashen.a08.elite": {
      "hp": 19877,
      "atk": 651,
      "armor": 59,
      "elementalPower": 89,
      "basicIntervalMs": 2200,
      "rewardGold": 27,
      "rewardXp": 145,
      "elementResistance": {
        "earth": 26,
        "water": 10,
        "fire": 10,
        "wind": 10,
        "light": 10,
        "dark": 26
      }
    },
    "ashen.a09.normal.1": {
      "hp": 6809,
      "atk": 29,
      "armor": 38,
      "elementalPower": 7,
      "basicIntervalMs": 2200,
      "rewardGold": 6,
      "rewardXp": 48,
      "elementResistance": {
        "earth": 10,
        "water": 26,
        "fire": 10,
        "wind": 10,
        "light": 10,
        "dark": 26
      }
    },
    "ashen.a09.normal.2": {
      "hp": 5544,
      "atk": 24,
      "armor": 27,
      "elementalPower": 7,
      "basicIntervalMs": 1800,
      "rewardGold": 6,
      "rewardXp": 48,
      "elementResistance": {
        "earth": 10,
        "water": 10,
        "fire": 10,
        "wind": 26,
        "light": 26,
        "dark": 10
      }
    },
    "ashen.a09.normal.3": {
      "hp": 8618,
      "atk": 36,
      "armor": 53,
      "elementalPower": 7,
      "basicIntervalMs": 2800,
      "rewardGold": 6,
      "rewardXp": 48,
      "elementResistance": {
        "earth": 26,
        "water": 10,
        "fire": 10,
        "wind": 10,
        "light": 26,
        "dark": 10
      }
    },
    "ashen.a09.elite": {
      "hp": 23764,
      "atk": 921,
      "armor": 62,
      "elementalPower": 108,
      "basicIntervalMs": 2200,
      "rewardGold": 27,
      "rewardXp": 158,
      "elementResistance": {
        "earth": 11,
        "water": 27,
        "fire": 11,
        "wind": 11,
        "light": 27,
        "dark": 11
      }
    },
    "ashen.a10.normal.1": {
      "hp": 8182,
      "atk": 43,
      "armor": 41,
      "elementalPower": 9,
      "basicIntervalMs": 2200,
      "rewardGold": 7,
      "rewardXp": 52,
      "elementResistance": {
        "earth": 27,
        "water": 11,
        "fire": 27,
        "wind": 11,
        "light": 11,
        "dark": 11
      }
    },
    "ashen.a10.normal.2": {
      "hp": 6753,
      "atk": 34,
      "armor": 28,
      "elementalPower": 9,
      "basicIntervalMs": 1800,
      "rewardGold": 7,
      "rewardXp": 52,
      "elementResistance": {
        "earth": 11,
        "water": 11,
        "fire": 11,
        "wind": 11,
        "light": 11,
        "dark": 27
      }
    },
    "ashen.a10.normal.3": {
      "hp": 10377,
      "atk": 51,
      "armor": 56,
      "elementalPower": 9,
      "basicIntervalMs": 2800,
      "rewardGold": 7,
      "rewardXp": 52,
      "elementResistance": {
        "earth": 27,
        "water": 27,
        "fire": 11,
        "wind": 11,
        "light": 11,
        "dark": 11
      }
    },
    "ashen.a10.elite": {
      "hp": 28371,
      "atk": 1315,
      "armor": 66,
      "elementalPower": 131,
      "basicIntervalMs": 2200,
      "rewardGold": 32,
      "rewardXp": 172,
      "elementResistance": {
        "earth": 28,
        "water": 12,
        "fire": 28,
        "wind": 12,
        "light": 12,
        "dark": 12
      }
    },
    "ashen.a10.boss": {
      "hp": 63658,
      "atk": 1315,
      "armor": 75,
      "elementalPower": 184,
      "basicIntervalMs": 2200,
      "rewardGold": 105,
      "rewardXp": 676,
      "elementResistance": {
        "earth": 28,
        "water": 12,
        "fire": 28,
        "wind": 12,
        "light": 12,
        "dark": 28
      }
    }
  },
  "skillOverrides": {
    "dwarf.a02.elite:0": {
      "castMs": 1100
    },
    "dwarf.a03.elite:0": {
      "castMs": 1600
    },
    "dwarf.a03.boss:0": {
      "castMs": 2200
    },
    "dwarf.a03.boss:1": {
      "castMs": 1600
    }
  },
  "controlReduction": {
    "normal": 0,
    "elite": 0.2,
    "boss": 0.4
  },
  "interruptStopMs": 1100,
  "areas": [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10
  ]
};
export const materials={
  "ashen.cold_ash_sand": {
    "id": "ashen.cold_ash_sand",
    "name": "冷烬砂",
    "description": "失去余热的细灰夹着晶砂，沉降后会分出深浅两层。",
    "kind": "矿物",
    "rarity": "常见",
    "category": "常规",
    "icon": "ore",
    "tags": [
      "矿物"
    ],
    "functionalTags": [],
    "sources": [
      "ashen.a01.field",
      "ashen.a02.field",
      "ashen.a03.field",
      "ashen.a01.dungeon",
      "ashen.a02.dungeon",
      "ashen.a03.dungeon",
      "ashen.a04.boss"
    ],
    "qualityRange": [
      0,
      1,
      2,
      3
    ],
    "uniqueHeld": false,
    "storyOnly": false,
    "usage": "基础锻造填料；融合偏向防御。",
    "sourceNote": "可在所列产地反复获取"
  },
  "ashen.salt_shell": {
    "id": "ashen.salt_shell",
    "name": "盐壳碎片",
    "description": "薄盐壳一层层包住石面，研碎后能分离出清透颗粒。",
    "kind": "盐类",
    "rarity": "常见",
    "category": "常规",
    "icon": "ore",
    "tags": [
      "盐类"
    ],
    "functionalTags": ["recoveryBase","luckBase","luckAux"],
    "sources": [
      "ashen.a01.field",
      "ashen.a02.field",
      "ashen.a04.field",
      "ashen.a01.dungeon",
      "ashen.a02.dungeon",
      "ashen.a04.dungeon",
      "ashen.a04.boss"
    ],
    "qualityRange": [
      0,
      1,
      2,
      3
    ],
    "uniqueHeld": false,
    "storyOnly": false,
    "usage": "水元素抗性药剂的矿盐基料；生命药剂主原料（通过炼金提纯盐壳内层精华，制成恢复矿液）。",
    "sourceNote": "可在所列产地反复获取"
  },
  "ashen.porous_basalt": {
    "id": "ashen.porous_basalt",
    "name": "孔纹玄石",
    "description": "多孔黑石外轻内密，孔道能分散局部的冲击。",
    "kind": "矿物",
    "rarity": "常见",
    "category": "常规",
    "icon": "ore",
    "tags": [
      "矿物"
    ],
    "functionalTags": [],
    "sources": [
      "ashen.a01.field",
      "ashen.a03.field",
      "ashen.a05.field",
      "ashen.a01.dungeon",
      "ashen.a03.dungeon",
      "ashen.a05.dungeon",
      "ashen.a04.boss"
    ],
    "qualityRange": [
      0,
      1,
      2,
      3
    ],
    "uniqueHeld": false,
    "storyOnly": false,
    "usage": "护甲与核心外壳锻造；融合偏向生命。",
    "sourceNote": "可在所列产地反复获取"
  },
  "ashen.weathered_mica": {
    "id": "ashen.weathered_mica",
    "name": "风蚀云母",
    "description": "被长年风沙磨成薄片的云母，片缘仍保持细密层理。",
    "kind": "矿物",
    "rarity": "常见",
    "category": "常规",
    "icon": "ore",
    "tags": [
      "矿物"
    ],
    "functionalTags": [],
    "sources": [
      "ashen.a02.field",
      "ashen.a04.field",
      "ashen.a07.field",
      "ashen.a02.dungeon",
      "ashen.a04.dungeon",
      "ashen.a07.dungeon",
      "ashen.a04.boss",
      "ashen.a07.boss"
    ],
    "qualityRange": [
      0,
      1,
      2,
      3
    ],
    "uniqueHeld": false,
    "storyOnly": false,
    "usage": "风元素抗性药剂；鞋靴轻质衬片。",
    "sourceNote": "可在所列产地反复获取"
  },
  "ashen.dew_salt": {
    "id": "ashen.dew_salt",
    "name": "凝露盐",
    "description": "盐粒表面总凝着极薄的水膜，密封后会逐渐变得透明。",
    "kind": "盐类",
    "rarity": "少见",
    "category": "常规",
    "icon": "ore",
    "tags": [
      "盐类"
    ],
    "functionalTags": [
      "recoveryBase"
    ],
    "sources": [
      "ashen.a03.field",
      "ashen.a04.field",
      "ashen.a05.field",
      "ashen.a03.dungeon",
      "ashen.a04.dungeon",
      "ashen.a05.dungeon",
      "ashen.a04.boss"
    ],
    "qualityRange": [
      0,
      1,
      2,
      3
    ],
    "uniqueHeld": false,
    "storyOnly": false,
    "usage": "生命恢复药剂的矿盐路线；生命药剂主原料（提取凝露与盐中精华制成恢复矿液）。",
    "sourceNote": "可在所列产地反复获取"
  },
  "ashen.glass_grain": {
    "id": "ashen.glass_grain",
    "name": "琉砂晶粒",
    "description": "半透明颗粒夹着熔流留下的弧纹，加热后可重新黏合。",
    "kind": "矿物",
    "rarity": "常见",
    "category": "常规",
    "icon": "ore",
    "tags": [
      "矿物"
    ],
    "functionalTags": [],
    "sources": [
      "ashen.a03.field",
      "ashen.a04.field",
      "ashen.a06.field",
      "ashen.a03.dungeon",
      "ashen.a04.dungeon",
      "ashen.a06.dungeon",
      "ashen.a04.boss"
    ],
    "qualityRange": [
      0,
      1,
      2,
      3
    ],
    "uniqueHeld": false,
    "storyOnly": false,
    "usage": "护符与戒指晶托；融合偏向命中。",
    "sourceNote": "可在所列产地反复获取"
  },
  "ashen.red_vein_ore": {
    "id": "ashen.red_vein_ore",
    "name": "赤脉矿",
    "description": "红褐色矿脉沿细裂缝分布，磨开的断面会显出暗红光泽。",
    "kind": "矿石",
    "rarity": "常见",
    "category": "常规",
    "icon": "ore",
    "tags": [
      "矿石"
    ],
    "functionalTags": [
      "recoveryBase"
    ],
    "sources": [
      "ashen.a04.field",
      "ashen.a05.field",
      "ashen.a06.field",
      "ashen.a04.dungeon",
      "ashen.a05.dungeon",
      "ashen.a06.dungeon",
      "ashen.a04.boss"
    ],
    "qualityRange": [
      0,
      1,
      2,
      3
    ],
    "uniqueHeld": false,
    "storyOnly": false,
    "usage": "火元素增幅药剂的矿基；火元素装备融合；生命药剂主原料（通过炼金分离赤脉内的滋养矿精，制成恢复矿液）。",
    "sourceNote": "可在所列产地反复获取"
  },
  "ashen.singing_crystal": {
    "id": "ashen.singing_crystal",
    "name": "鸣晶薄片",
    "description": "晶片受压时发出轻鸣，声音会随裂纹方向改变。",
    "kind": "矿物",
    "rarity": "少见",
    "category": "常规",
    "icon": "ore",
    "tags": [
      "矿物"
    ],
    "functionalTags": [],
    "sources": [
      "ashen.a05.field",
      "ashen.a06.field",
      "ashen.a07.field",
      "ashen.a05.dungeon",
      "ashen.a06.dungeon",
      "ashen.a07.dungeon",
      "ashen.a07.boss"
    ],
    "qualityRange": [
      0,
      1,
      2,
      3
    ],
    "uniqueHeld": false,
    "storyOnly": false,
    "usage": "风元素增幅药剂；风元素技能装备融合。",
    "sourceNote": "可在所列产地反复获取"
  },
  "ashen.obsidian_glass": {
    "id": "ashen.obsidian_glass",
    "name": "黑曜玻璃",
    "description": "冷凝形成的黑色玻璃，厚处不透光，薄缘泛着烟紫。",
    "kind": "矿物",
    "rarity": "常见",
    "category": "常规",
    "icon": "ore",
    "tags": [
      "矿物"
    ],
    "functionalTags": [],
    "sources": [
      "ashen.a06.field",
      "ashen.a07.field",
      "ashen.a08.field",
      "ashen.a06.dungeon",
      "ashen.a07.dungeon",
      "ashen.a08.dungeon",
      "ashen.a07.boss"
    ],
    "qualityRange": [
      0,
      1,
      2,
      3
    ],
    "uniqueHeld": false,
    "storyOnly": false,
    "usage": "武器刃部；暗元素抗性药剂的矿基。",
    "sourceNote": "可在所列产地反复获取"
  },
  "ashen.white_salt_marrow": {
    "id": "ashen.white_salt_marrow",
    "name": "白盐髓",
    "description": "盐层深处凝成的柔白晶髓，不带表层盐壳的粗粝。",
    "kind": "盐类",
    "rarity": "少见",
    "category": "常规",
    "icon": "ore",
    "tags": [
      "盐类"
    ],
    "functionalTags": [
      "recoveryBase"
    ],
    "sources": [
      "ashen.a07.field",
      "ashen.a08.field",
      "ashen.a09.field",
      "ashen.a07.dungeon",
      "ashen.a08.dungeon",
      "ashen.a09.dungeon",
      "ashen.a07.boss"
    ],
    "qualityRange": [
      0,
      1,
      2,
      3
    ],
    "uniqueHeld": false,
    "storyOnly": false,
    "usage": "光元素抗性药剂；生命类装备数值洗练材料；生命药剂主原料（提纯柔白晶髓制成恢复矿液）。",
    "sourceNote": "可在所列产地反复获取"
  },
  "ashen.dim_crystal_sand": {
    "id": "ashen.dim_crystal_sand",
    "name": "沉辉晶砂",
    "description": "看似灰白的晶砂在阴影中才显出一层柔和的微光。",
    "kind": "矿物",
    "rarity": "少见",
    "category": "常规",
    "icon": "ore",
    "tags": [
      "矿物"
    ],
    "functionalTags": [
      "recoveryBase"
    ],
    "sources": [
      "ashen.a08.field",
      "ashen.a09.field",
      "ashen.a10.field",
      "ashen.a08.dungeon",
      "ashen.a09.dungeon",
      "ashen.a10.dungeon",
      "ashen.a10.boss"
    ],
    "qualityRange": [
      0,
      1,
      2,
      3
    ],
    "uniqueHeld": false,
    "storyOnly": false,
    "usage": "光元素增幅药剂；光元素相关护符融合；生命药剂主原料（通过炼金提取晶砂内的凝辉精华，制成恢复矿液）。",
    "sourceNote": "可在所列产地反复获取"
  },
  "ashen.refractory_stone": {
    "id": "ashen.refractory_stone",
    "name": "耐焰陶石",
    "description": "经历反复冷热变化的石质结块，细裂纹已被矿液填实。",
    "kind": "矿物",
    "rarity": "常见",
    "category": "常规",
    "icon": "ore",
    "tags": [
      "矿物"
    ],
    "functionalTags": [],
    "sources": [
      "ashen.a08.field",
      "ashen.a09.field",
      "ashen.a10.field",
      "ashen.a08.dungeon",
      "ashen.a09.dungeon",
      "ashen.a10.dungeon",
      "ashen.a10.boss"
    ],
    "qualityRange": [
      0,
      1,
      2,
      3
    ],
    "uniqueHeld": false,
    "storyOnly": false,
    "usage": "手套与核心隔热层；火元素抗性药剂基料。",
    "sourceNote": "可在所列产地反复获取"
  },
  "ashen.living_vein_bud": {
    "id": "ashen.living_vein_bud",
    "name": "活脉晶芽",
    "description": "从无人占据的矿脉中自行萌出的晶芽，会随温差微微舒张。",
    "kind": "晶核",
    "rarity": "珍奇",
    "category": "特殊",
    "icon": "ore",
    "tags": [
      "晶核"
    ],
    "functionalTags": [],
    "sources": [
      "ashen.a03.field",
      "ashen.a04.field",
      "ashen.a03.dungeon",
      "ashen.a04.dungeon",
      "ashen.a04.boss"
    ],
    "qualityRange": [
      0,
      1,
      2,
      3
    ],
    "uniqueHeld": false,
    "storyOnly": false,
    "usage": "烬裔专属核心融合材料；偏向生命与恢复。",
    "sourceNote": "可在所列产地反复获取"
  },
  "ashen.upwind_salt": {
    "id": "ashen.upwind_salt",
    "name": "逆风盐结",
    "description": "盐晶在石隙中逆着风口生长，断口呈细密的羽状。",
    "kind": "盐类",
    "rarity": "珍奇",
    "category": "特殊",
    "icon": "ore",
    "tags": [
      "盐类"
    ],
    "functionalTags": [],
    "sources": [
      "ashen.a06.field",
      "ashen.a07.field",
      "ashen.a06.dungeon",
      "ashen.a07.dungeon",
      "ashen.a07.boss"
    ],
    "qualityRange": [
      0,
      1,
      2,
      3
    ],
    "uniqueHeld": false,
    "storyOnly": false,
    "usage": "高品质风元素抗性药剂的特殊基料；速度类装备洗练材料。",
    "sourceNote": "可在所列产地反复获取"
  },
  "ashen.refracted_glassheart": {
    "id": "ashen.refracted_glassheart",
    "name": "折辉琉心",
    "description": "琉璃结块中心悬着数层彩边，内外纹理无法完全对齐。",
    "kind": "矿物",
    "rarity": "珍奇",
    "category": "特殊",
    "icon": "ore",
    "tags": [
      "矿物"
    ],
    "functionalTags": [],
    "sources": [
      "ashen.a08.field",
      "ashen.a09.field",
      "ashen.a08.dungeon",
      "ashen.a09.dungeon",
      "ashen.a07.boss"
    ],
    "qualityRange": [
      0,
      1,
      2,
      3
    ],
    "uniqueHeld": false,
    "storyOnly": false,
    "usage": "幸运药剂的特殊基料；护符及戒指的高品质融合材料。",
    "sourceNote": "可在所列产地反复获取"
  },
  "ashen.undying_ember": {
    "id": "ashen.undying_ember",
    "name": "不熄余炭",
    "description": "矿炭内部保留着极缓慢的热流，外壳摸起来却并不灼手。",
    "kind": "矿物",
    "rarity": "珍奇",
    "category": "特殊",
    "icon": "ore",
    "tags": [
      "矿物"
    ],
    "functionalTags": [],
    "sources": [
      "ashen.a09.field",
      "ashen.a10.field",
      "ashen.a09.dungeon",
      "ashen.a10.dungeon",
      "ashen.a10.boss"
    ],
    "qualityRange": [
      0,
      1,
      2,
      3
    ],
    "uniqueHeld": false,
    "storyOnly": false,
    "usage": "高品质火元素增幅药剂的特殊基料；火元素词条数值洗练材料。",
    "sourceNote": "可在所列产地反复获取"
  },
  "ashen.infinity_gem_ashen": {
    "id": "ashen.infinity_gem_ashen",
    "name": "初醒金髓",
    "description": "金色晶髓里延伸着天然的细脉，像尚未落定的一次心跳。",
    "kind": "宝石",
    "rarity": "珍奇",
    "category": "特殊",
    "icon": "gem",
    "tags": [
      "宝石"
    ],
    "functionalTags": [],
    "sources": [
      "ashen.a01.field",
      "ashen.a02.field",
      "ashen.a03.field",
      "ashen.a04.field",
      "ashen.a05.field",
      "ashen.a06.field",
      "ashen.a07.field",
      "ashen.a08.field",
      "ashen.a09.field",
      "ashen.a10.field",
      "ashen.a01.dungeon",
      "ashen.a02.dungeon",
      "ashen.a03.dungeon",
      "ashen.a04.dungeon",
      "ashen.a05.dungeon",
      "ashen.a06.dungeon",
      "ashen.a07.dungeon",
      "ashen.a08.dungeon",
      "ashen.a09.dungeon",
      "ashen.a10.dungeon",
      "ashen.a04.boss",
      "ashen.a07.boss",
      "ashen.a10.boss"
    ],
    "qualityRange": [
      3
    ],
    "uniqueHeld": true,
    "storyOnly": false,
    "hiddenUsage": "无限手套固定融合的烬裔宝石。",
    "sourceNote": "本族全区；高区概率更高；同区野外＜普通＜首领；同种最多1颗、丢失可重刷"
  },
  "ashen.silent_crystal": {
    "id": "ashen.silent_crystal",
    "name": "沉默的晶片",
    "description": "无光的晶片有一道平缓缺口，贴近耳边也听不见矿石的鸣动。",
    "kind": "旧物",
    "rarity": "珍奇",
    "category": "特殊",
    "icon": "ore",
    "tags": [
      "旧物"
    ],
    "functionalTags": [],
    "sources": [],
    "qualityRange": [
      3
    ],
    "uniqueHeld": true,
    "storyOnly": true,
    "hiddenUsage": "归途之环隐藏配方材料。",
    "sourceNote": "鸣晶断层的砾露事件奖励；仅可领取一次。"
  }
};
export const materialAssociations={
  "ashen.a01.normal.1|ashen.a01.field": {
    "monsterId": "ashen.a01.normal.1",
    "nodeId": "ashen.a01.field",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "ashen.cold_ash_sand",
            "weight": 0.3333333333333333
          },
          {
            "materialId": "ashen.salt_shell",
            "weight": 0.3333333333333333
          },
          {
            "materialId": "ashen.porous_basalt",
            "weight": 0.3333333333333333
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "ashen.salt_shell",
            "weight": 1
          }
        ]
      },
      {
        "channel": "special",
        "entries": []
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "ashen.infinity_gem_ashen",
            "weight": 1
          }
        ]
      }
    ]
  },
  "ashen.a01.normal.1|ashen.a01.dungeon": {
    "monsterId": "ashen.a01.normal.1",
    "nodeId": "ashen.a01.dungeon",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "ashen.cold_ash_sand",
            "weight": 0.3333333333333333
          },
          {
            "materialId": "ashen.salt_shell",
            "weight": 0.3333333333333333
          },
          {
            "materialId": "ashen.porous_basalt",
            "weight": 0.3333333333333333
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "ashen.salt_shell",
            "weight": 1
          }
        ]
      },
      {
        "channel": "special",
        "entries": []
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "ashen.infinity_gem_ashen",
            "weight": 1
          }
        ]
      }
    ]
  },
  "ashen.a01.normal.2|ashen.a01.field": {
    "monsterId": "ashen.a01.normal.2",
    "nodeId": "ashen.a01.field",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "ashen.cold_ash_sand",
            "weight": 0.3333333333333333
          },
          {
            "materialId": "ashen.salt_shell",
            "weight": 0.3333333333333333
          },
          {
            "materialId": "ashen.porous_basalt",
            "weight": 0.3333333333333333
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "ashen.salt_shell",
            "weight": 1
          }
        ]
      },
      {
        "channel": "special",
        "entries": []
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "ashen.infinity_gem_ashen",
            "weight": 1
          }
        ]
      }
    ]
  },
  "ashen.a01.normal.2|ashen.a01.dungeon": {
    "monsterId": "ashen.a01.normal.2",
    "nodeId": "ashen.a01.dungeon",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "ashen.cold_ash_sand",
            "weight": 0.3333333333333333
          },
          {
            "materialId": "ashen.salt_shell",
            "weight": 0.3333333333333333
          },
          {
            "materialId": "ashen.porous_basalt",
            "weight": 0.3333333333333333
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "ashen.salt_shell",
            "weight": 1
          }
        ]
      },
      {
        "channel": "special",
        "entries": []
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "ashen.infinity_gem_ashen",
            "weight": 1
          }
        ]
      }
    ]
  },
  "ashen.a01.normal.3|ashen.a01.field": {
    "monsterId": "ashen.a01.normal.3",
    "nodeId": "ashen.a01.field",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "ashen.cold_ash_sand",
            "weight": 0.3333333333333333
          },
          {
            "materialId": "ashen.salt_shell",
            "weight": 0.3333333333333333
          },
          {
            "materialId": "ashen.porous_basalt",
            "weight": 0.3333333333333333
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "ashen.salt_shell",
            "weight": 1
          }
        ]
      },
      {
        "channel": "special",
        "entries": []
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "ashen.infinity_gem_ashen",
            "weight": 1
          }
        ]
      }
    ]
  },
  "ashen.a01.normal.3|ashen.a01.dungeon": {
    "monsterId": "ashen.a01.normal.3",
    "nodeId": "ashen.a01.dungeon",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "ashen.cold_ash_sand",
            "weight": 0.3333333333333333
          },
          {
            "materialId": "ashen.salt_shell",
            "weight": 0.3333333333333333
          },
          {
            "materialId": "ashen.porous_basalt",
            "weight": 0.3333333333333333
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "ashen.salt_shell",
            "weight": 1
          }
        ]
      },
      {
        "channel": "special",
        "entries": []
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "ashen.infinity_gem_ashen",
            "weight": 1
          }
        ]
      }
    ]
  },
  "ashen.a01.elite|ashen.a01.dungeon": {
    "monsterId": "ashen.a01.elite",
    "nodeId": "ashen.a01.dungeon",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "ashen.cold_ash_sand",
            "weight": 0.3333333333333333
          },
          {
            "materialId": "ashen.salt_shell",
            "weight": 0.3333333333333333
          },
          {
            "materialId": "ashen.porous_basalt",
            "weight": 0.3333333333333333
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "ashen.salt_shell",
            "weight": 1
          }
        ]
      },
      {
        "channel": "special",
        "entries": []
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "ashen.infinity_gem_ashen",
            "weight": 1
          }
        ]
      }
    ]
  },
  "ashen.a02.normal.1|ashen.a02.field": {
    "monsterId": "ashen.a02.normal.1",
    "nodeId": "ashen.a02.field",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "ashen.cold_ash_sand",
            "weight": 0.3333333333333333
          },
          {
            "materialId": "ashen.salt_shell",
            "weight": 0.3333333333333333
          },
          {
            "materialId": "ashen.weathered_mica",
            "weight": 0.3333333333333333
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "ashen.salt_shell",
            "weight": 1
          }
        ]
      },
      {
        "channel": "special",
        "entries": []
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "ashen.infinity_gem_ashen",
            "weight": 1
          }
        ]
      }
    ]
  },
  "ashen.a02.normal.1|ashen.a02.dungeon": {
    "monsterId": "ashen.a02.normal.1",
    "nodeId": "ashen.a02.dungeon",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "ashen.cold_ash_sand",
            "weight": 0.3333333333333333
          },
          {
            "materialId": "ashen.salt_shell",
            "weight": 0.3333333333333333
          },
          {
            "materialId": "ashen.weathered_mica",
            "weight": 0.3333333333333333
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "ashen.salt_shell",
            "weight": 1
          }
        ]
      },
      {
        "channel": "special",
        "entries": []
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "ashen.infinity_gem_ashen",
            "weight": 1
          }
        ]
      }
    ]
  },
  "ashen.a02.normal.2|ashen.a02.field": {
    "monsterId": "ashen.a02.normal.2",
    "nodeId": "ashen.a02.field",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "ashen.cold_ash_sand",
            "weight": 0.3333333333333333
          },
          {
            "materialId": "ashen.salt_shell",
            "weight": 0.3333333333333333
          },
          {
            "materialId": "ashen.weathered_mica",
            "weight": 0.3333333333333333
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "ashen.salt_shell",
            "weight": 1
          }
        ]
      },
      {
        "channel": "special",
        "entries": []
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "ashen.infinity_gem_ashen",
            "weight": 1
          }
        ]
      }
    ]
  },
  "ashen.a02.normal.2|ashen.a02.dungeon": {
    "monsterId": "ashen.a02.normal.2",
    "nodeId": "ashen.a02.dungeon",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "ashen.cold_ash_sand",
            "weight": 0.3333333333333333
          },
          {
            "materialId": "ashen.salt_shell",
            "weight": 0.3333333333333333
          },
          {
            "materialId": "ashen.weathered_mica",
            "weight": 0.3333333333333333
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "ashen.salt_shell",
            "weight": 1
          }
        ]
      },
      {
        "channel": "special",
        "entries": []
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "ashen.infinity_gem_ashen",
            "weight": 1
          }
        ]
      }
    ]
  },
  "ashen.a02.normal.3|ashen.a02.field": {
    "monsterId": "ashen.a02.normal.3",
    "nodeId": "ashen.a02.field",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "ashen.cold_ash_sand",
            "weight": 0.3333333333333333
          },
          {
            "materialId": "ashen.salt_shell",
            "weight": 0.3333333333333333
          },
          {
            "materialId": "ashen.weathered_mica",
            "weight": 0.3333333333333333
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "ashen.salt_shell",
            "weight": 1
          }
        ]
      },
      {
        "channel": "special",
        "entries": []
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "ashen.infinity_gem_ashen",
            "weight": 1
          }
        ]
      }
    ]
  },
  "ashen.a02.normal.3|ashen.a02.dungeon": {
    "monsterId": "ashen.a02.normal.3",
    "nodeId": "ashen.a02.dungeon",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "ashen.cold_ash_sand",
            "weight": 0.3333333333333333
          },
          {
            "materialId": "ashen.salt_shell",
            "weight": 0.3333333333333333
          },
          {
            "materialId": "ashen.weathered_mica",
            "weight": 0.3333333333333333
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "ashen.salt_shell",
            "weight": 1
          }
        ]
      },
      {
        "channel": "special",
        "entries": []
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "ashen.infinity_gem_ashen",
            "weight": 1
          }
        ]
      }
    ]
  },
  "ashen.a02.elite|ashen.a02.dungeon": {
    "monsterId": "ashen.a02.elite",
    "nodeId": "ashen.a02.dungeon",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "ashen.cold_ash_sand",
            "weight": 0.3333333333333333
          },
          {
            "materialId": "ashen.salt_shell",
            "weight": 0.3333333333333333
          },
          {
            "materialId": "ashen.weathered_mica",
            "weight": 0.3333333333333333
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "ashen.salt_shell",
            "weight": 1
          }
        ]
      },
      {
        "channel": "special",
        "entries": []
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "ashen.infinity_gem_ashen",
            "weight": 1
          }
        ]
      }
    ]
  },
  "ashen.a03.normal.1|ashen.a03.field": {
    "monsterId": "ashen.a03.normal.1",
    "nodeId": "ashen.a03.field",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "ashen.cold_ash_sand",
            "weight": 0.25
          },
          {
            "materialId": "ashen.porous_basalt",
            "weight": 0.25
          },
          {
            "materialId": "ashen.dew_salt",
            "weight": 0.25
          },
          {
            "materialId": "ashen.glass_grain",
            "weight": 0.25
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "ashen.dew_salt",
            "weight": 1
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "ashen.living_vein_bud",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "ashen.infinity_gem_ashen",
            "weight": 1
          }
        ]
      }
    ]
  },
  "ashen.a03.normal.1|ashen.a03.dungeon": {
    "monsterId": "ashen.a03.normal.1",
    "nodeId": "ashen.a03.dungeon",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "ashen.cold_ash_sand",
            "weight": 0.25
          },
          {
            "materialId": "ashen.porous_basalt",
            "weight": 0.25
          },
          {
            "materialId": "ashen.dew_salt",
            "weight": 0.25
          },
          {
            "materialId": "ashen.glass_grain",
            "weight": 0.25
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "ashen.dew_salt",
            "weight": 1
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "ashen.living_vein_bud",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "ashen.infinity_gem_ashen",
            "weight": 1
          }
        ]
      }
    ]
  },
  "ashen.a03.normal.2|ashen.a03.field": {
    "monsterId": "ashen.a03.normal.2",
    "nodeId": "ashen.a03.field",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "ashen.cold_ash_sand",
            "weight": 0.25
          },
          {
            "materialId": "ashen.porous_basalt",
            "weight": 0.25
          },
          {
            "materialId": "ashen.dew_salt",
            "weight": 0.25
          },
          {
            "materialId": "ashen.glass_grain",
            "weight": 0.25
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "ashen.dew_salt",
            "weight": 1
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "ashen.living_vein_bud",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "ashen.infinity_gem_ashen",
            "weight": 1
          }
        ]
      }
    ]
  },
  "ashen.a03.normal.2|ashen.a03.dungeon": {
    "monsterId": "ashen.a03.normal.2",
    "nodeId": "ashen.a03.dungeon",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "ashen.cold_ash_sand",
            "weight": 0.25
          },
          {
            "materialId": "ashen.porous_basalt",
            "weight": 0.25
          },
          {
            "materialId": "ashen.dew_salt",
            "weight": 0.25
          },
          {
            "materialId": "ashen.glass_grain",
            "weight": 0.25
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "ashen.dew_salt",
            "weight": 1
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "ashen.living_vein_bud",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "ashen.infinity_gem_ashen",
            "weight": 1
          }
        ]
      }
    ]
  },
  "ashen.a03.normal.3|ashen.a03.field": {
    "monsterId": "ashen.a03.normal.3",
    "nodeId": "ashen.a03.field",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "ashen.cold_ash_sand",
            "weight": 0.25
          },
          {
            "materialId": "ashen.porous_basalt",
            "weight": 0.25
          },
          {
            "materialId": "ashen.dew_salt",
            "weight": 0.25
          },
          {
            "materialId": "ashen.glass_grain",
            "weight": 0.25
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "ashen.dew_salt",
            "weight": 1
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "ashen.living_vein_bud",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "ashen.infinity_gem_ashen",
            "weight": 1
          }
        ]
      }
    ]
  },
  "ashen.a03.normal.3|ashen.a03.dungeon": {
    "monsterId": "ashen.a03.normal.3",
    "nodeId": "ashen.a03.dungeon",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "ashen.cold_ash_sand",
            "weight": 0.25
          },
          {
            "materialId": "ashen.porous_basalt",
            "weight": 0.25
          },
          {
            "materialId": "ashen.dew_salt",
            "weight": 0.25
          },
          {
            "materialId": "ashen.glass_grain",
            "weight": 0.25
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "ashen.dew_salt",
            "weight": 1
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "ashen.living_vein_bud",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "ashen.infinity_gem_ashen",
            "weight": 1
          }
        ]
      }
    ]
  },
  "ashen.a03.elite|ashen.a03.dungeon": {
    "monsterId": "ashen.a03.elite",
    "nodeId": "ashen.a03.dungeon",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "ashen.cold_ash_sand",
            "weight": 0.25
          },
          {
            "materialId": "ashen.porous_basalt",
            "weight": 0.25
          },
          {
            "materialId": "ashen.dew_salt",
            "weight": 0.25
          },
          {
            "materialId": "ashen.glass_grain",
            "weight": 0.25
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "ashen.dew_salt",
            "weight": 1
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "ashen.living_vein_bud",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "ashen.infinity_gem_ashen",
            "weight": 1
          }
        ]
      }
    ]
  },
  "ashen.a04.normal.1|ashen.a04.field": {
    "monsterId": "ashen.a04.normal.1",
    "nodeId": "ashen.a04.field",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "ashen.salt_shell",
            "weight": 0.2
          },
          {
            "materialId": "ashen.weathered_mica",
            "weight": 0.2
          },
          {
            "materialId": "ashen.dew_salt",
            "weight": 0.2
          },
          {
            "materialId": "ashen.glass_grain",
            "weight": 0.2
          },
          {
            "materialId": "ashen.red_vein_ore",
            "weight": 0.2
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "ashen.salt_shell",
            "weight": 0.3333333333333333
          },
          {
            "materialId": "ashen.dew_salt",
            "weight": 0.3333333333333333
          },
          {
            "materialId": "ashen.red_vein_ore",
            "weight": 0.3333333333333333
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "ashen.living_vein_bud",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "ashen.infinity_gem_ashen",
            "weight": 1
          }
        ]
      }
    ]
  },
  "ashen.a04.normal.1|ashen.a04.dungeon": {
    "monsterId": "ashen.a04.normal.1",
    "nodeId": "ashen.a04.dungeon",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "ashen.salt_shell",
            "weight": 0.2
          },
          {
            "materialId": "ashen.weathered_mica",
            "weight": 0.2
          },
          {
            "materialId": "ashen.dew_salt",
            "weight": 0.2
          },
          {
            "materialId": "ashen.glass_grain",
            "weight": 0.2
          },
          {
            "materialId": "ashen.red_vein_ore",
            "weight": 0.2
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "ashen.salt_shell",
            "weight": 0.3333333333333333
          },
          {
            "materialId": "ashen.dew_salt",
            "weight": 0.3333333333333333
          },
          {
            "materialId": "ashen.red_vein_ore",
            "weight": 0.3333333333333333
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "ashen.living_vein_bud",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "ashen.infinity_gem_ashen",
            "weight": 1
          }
        ]
      }
    ]
  },
  "ashen.a04.normal.2|ashen.a04.field": {
    "monsterId": "ashen.a04.normal.2",
    "nodeId": "ashen.a04.field",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "ashen.salt_shell",
            "weight": 0.2
          },
          {
            "materialId": "ashen.weathered_mica",
            "weight": 0.2
          },
          {
            "materialId": "ashen.dew_salt",
            "weight": 0.2
          },
          {
            "materialId": "ashen.glass_grain",
            "weight": 0.2
          },
          {
            "materialId": "ashen.red_vein_ore",
            "weight": 0.2
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "ashen.salt_shell",
            "weight": 0.3333333333333333
          },
          {
            "materialId": "ashen.dew_salt",
            "weight": 0.3333333333333333
          },
          {
            "materialId": "ashen.red_vein_ore",
            "weight": 0.3333333333333333
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "ashen.living_vein_bud",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "ashen.infinity_gem_ashen",
            "weight": 1
          }
        ]
      }
    ]
  },
  "ashen.a04.normal.2|ashen.a04.dungeon": {
    "monsterId": "ashen.a04.normal.2",
    "nodeId": "ashen.a04.dungeon",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "ashen.salt_shell",
            "weight": 0.2
          },
          {
            "materialId": "ashen.weathered_mica",
            "weight": 0.2
          },
          {
            "materialId": "ashen.dew_salt",
            "weight": 0.2
          },
          {
            "materialId": "ashen.glass_grain",
            "weight": 0.2
          },
          {
            "materialId": "ashen.red_vein_ore",
            "weight": 0.2
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "ashen.salt_shell",
            "weight": 0.3333333333333333
          },
          {
            "materialId": "ashen.dew_salt",
            "weight": 0.3333333333333333
          },
          {
            "materialId": "ashen.red_vein_ore",
            "weight": 0.3333333333333333
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "ashen.living_vein_bud",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "ashen.infinity_gem_ashen",
            "weight": 1
          }
        ]
      }
    ]
  },
  "ashen.a04.normal.3|ashen.a04.field": {
    "monsterId": "ashen.a04.normal.3",
    "nodeId": "ashen.a04.field",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "ashen.salt_shell",
            "weight": 0.2
          },
          {
            "materialId": "ashen.weathered_mica",
            "weight": 0.2
          },
          {
            "materialId": "ashen.dew_salt",
            "weight": 0.2
          },
          {
            "materialId": "ashen.glass_grain",
            "weight": 0.2
          },
          {
            "materialId": "ashen.red_vein_ore",
            "weight": 0.2
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "ashen.salt_shell",
            "weight": 0.3333333333333333
          },
          {
            "materialId": "ashen.dew_salt",
            "weight": 0.3333333333333333
          },
          {
            "materialId": "ashen.red_vein_ore",
            "weight": 0.3333333333333333
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "ashen.living_vein_bud",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "ashen.infinity_gem_ashen",
            "weight": 1
          }
        ]
      }
    ]
  },
  "ashen.a04.normal.3|ashen.a04.dungeon": {
    "monsterId": "ashen.a04.normal.3",
    "nodeId": "ashen.a04.dungeon",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "ashen.salt_shell",
            "weight": 0.2
          },
          {
            "materialId": "ashen.weathered_mica",
            "weight": 0.2
          },
          {
            "materialId": "ashen.dew_salt",
            "weight": 0.2
          },
          {
            "materialId": "ashen.glass_grain",
            "weight": 0.2
          },
          {
            "materialId": "ashen.red_vein_ore",
            "weight": 0.2
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "ashen.salt_shell",
            "weight": 0.3333333333333333
          },
          {
            "materialId": "ashen.dew_salt",
            "weight": 0.3333333333333333
          },
          {
            "materialId": "ashen.red_vein_ore",
            "weight": 0.3333333333333333
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "ashen.living_vein_bud",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "ashen.infinity_gem_ashen",
            "weight": 1
          }
        ]
      }
    ]
  },
  "ashen.a04.elite|ashen.a04.dungeon": {
    "monsterId": "ashen.a04.elite",
    "nodeId": "ashen.a04.dungeon",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "ashen.salt_shell",
            "weight": 0.2
          },
          {
            "materialId": "ashen.weathered_mica",
            "weight": 0.2
          },
          {
            "materialId": "ashen.dew_salt",
            "weight": 0.2
          },
          {
            "materialId": "ashen.glass_grain",
            "weight": 0.2
          },
          {
            "materialId": "ashen.red_vein_ore",
            "weight": 0.2
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "ashen.salt_shell",
            "weight": 0.3333333333333333
          },
          {
            "materialId": "ashen.dew_salt",
            "weight": 0.3333333333333333
          },
          {
            "materialId": "ashen.red_vein_ore",
            "weight": 0.3333333333333333
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "ashen.living_vein_bud",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "ashen.infinity_gem_ashen",
            "weight": 1
          }
        ]
      }
    ]
  },
  "ashen.a04.boss|ashen.a04.boss": {
    "monsterId": "ashen.a04.boss",
    "nodeId": "ashen.a04.boss",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "ashen.cold_ash_sand",
            "weight": 0.14285714285714285
          },
          {
            "materialId": "ashen.salt_shell",
            "weight": 0.14285714285714285
          },
          {
            "materialId": "ashen.porous_basalt",
            "weight": 0.14285714285714285
          },
          {
            "materialId": "ashen.weathered_mica",
            "weight": 0.14285714285714285
          },
          {
            "materialId": "ashen.dew_salt",
            "weight": 0.14285714285714285
          },
          {
            "materialId": "ashen.glass_grain",
            "weight": 0.14285714285714285
          },
          {
            "materialId": "ashen.red_vein_ore",
            "weight": 0.14285714285714285
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "ashen.salt_shell",
            "weight": 0.3333333333333333
          },
          {
            "materialId": "ashen.dew_salt",
            "weight": 0.3333333333333333
          },
          {
            "materialId": "ashen.red_vein_ore",
            "weight": 0.3333333333333333
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "ashen.living_vein_bud",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "ashen.infinity_gem_ashen",
            "weight": 1
          }
        ]
      }
    ]
  },
  "ashen.a05.normal.1|ashen.a05.field": {
    "monsterId": "ashen.a05.normal.1",
    "nodeId": "ashen.a05.field",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "ashen.porous_basalt",
            "weight": 0.25
          },
          {
            "materialId": "ashen.dew_salt",
            "weight": 0.25
          },
          {
            "materialId": "ashen.red_vein_ore",
            "weight": 0.25
          },
          {
            "materialId": "ashen.singing_crystal",
            "weight": 0.25
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "ashen.dew_salt",
            "weight": 0.5
          },
          {
            "materialId": "ashen.red_vein_ore",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "special",
        "entries": []
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "ashen.infinity_gem_ashen",
            "weight": 1
          }
        ]
      }
    ]
  },
  "ashen.a05.normal.1|ashen.a05.dungeon": {
    "monsterId": "ashen.a05.normal.1",
    "nodeId": "ashen.a05.dungeon",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "ashen.porous_basalt",
            "weight": 0.25
          },
          {
            "materialId": "ashen.dew_salt",
            "weight": 0.25
          },
          {
            "materialId": "ashen.red_vein_ore",
            "weight": 0.25
          },
          {
            "materialId": "ashen.singing_crystal",
            "weight": 0.25
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "ashen.dew_salt",
            "weight": 0.5
          },
          {
            "materialId": "ashen.red_vein_ore",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "special",
        "entries": []
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "ashen.infinity_gem_ashen",
            "weight": 1
          }
        ]
      }
    ]
  },
  "ashen.a05.normal.2|ashen.a05.field": {
    "monsterId": "ashen.a05.normal.2",
    "nodeId": "ashen.a05.field",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "ashen.porous_basalt",
            "weight": 0.25
          },
          {
            "materialId": "ashen.dew_salt",
            "weight": 0.25
          },
          {
            "materialId": "ashen.red_vein_ore",
            "weight": 0.25
          },
          {
            "materialId": "ashen.singing_crystal",
            "weight": 0.25
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "ashen.dew_salt",
            "weight": 0.5
          },
          {
            "materialId": "ashen.red_vein_ore",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "special",
        "entries": []
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "ashen.infinity_gem_ashen",
            "weight": 1
          }
        ]
      }
    ]
  },
  "ashen.a05.normal.2|ashen.a05.dungeon": {
    "monsterId": "ashen.a05.normal.2",
    "nodeId": "ashen.a05.dungeon",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "ashen.porous_basalt",
            "weight": 0.25
          },
          {
            "materialId": "ashen.dew_salt",
            "weight": 0.25
          },
          {
            "materialId": "ashen.red_vein_ore",
            "weight": 0.25
          },
          {
            "materialId": "ashen.singing_crystal",
            "weight": 0.25
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "ashen.dew_salt",
            "weight": 0.5
          },
          {
            "materialId": "ashen.red_vein_ore",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "special",
        "entries": []
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "ashen.infinity_gem_ashen",
            "weight": 1
          }
        ]
      }
    ]
  },
  "ashen.a05.normal.3|ashen.a05.field": {
    "monsterId": "ashen.a05.normal.3",
    "nodeId": "ashen.a05.field",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "ashen.porous_basalt",
            "weight": 0.25
          },
          {
            "materialId": "ashen.dew_salt",
            "weight": 0.25
          },
          {
            "materialId": "ashen.red_vein_ore",
            "weight": 0.25
          },
          {
            "materialId": "ashen.singing_crystal",
            "weight": 0.25
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "ashen.dew_salt",
            "weight": 0.5
          },
          {
            "materialId": "ashen.red_vein_ore",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "special",
        "entries": []
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "ashen.infinity_gem_ashen",
            "weight": 1
          }
        ]
      }
    ]
  },
  "ashen.a05.normal.3|ashen.a05.dungeon": {
    "monsterId": "ashen.a05.normal.3",
    "nodeId": "ashen.a05.dungeon",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "ashen.porous_basalt",
            "weight": 0.25
          },
          {
            "materialId": "ashen.dew_salt",
            "weight": 0.25
          },
          {
            "materialId": "ashen.red_vein_ore",
            "weight": 0.25
          },
          {
            "materialId": "ashen.singing_crystal",
            "weight": 0.25
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "ashen.dew_salt",
            "weight": 0.5
          },
          {
            "materialId": "ashen.red_vein_ore",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "special",
        "entries": []
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "ashen.infinity_gem_ashen",
            "weight": 1
          }
        ]
      }
    ]
  },
  "ashen.a05.elite|ashen.a05.dungeon": {
    "monsterId": "ashen.a05.elite",
    "nodeId": "ashen.a05.dungeon",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "ashen.porous_basalt",
            "weight": 0.25
          },
          {
            "materialId": "ashen.dew_salt",
            "weight": 0.25
          },
          {
            "materialId": "ashen.red_vein_ore",
            "weight": 0.25
          },
          {
            "materialId": "ashen.singing_crystal",
            "weight": 0.25
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "ashen.dew_salt",
            "weight": 0.5
          },
          {
            "materialId": "ashen.red_vein_ore",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "special",
        "entries": []
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "ashen.infinity_gem_ashen",
            "weight": 1
          }
        ]
      }
    ]
  },
  "ashen.a06.normal.1|ashen.a06.field": {
    "monsterId": "ashen.a06.normal.1",
    "nodeId": "ashen.a06.field",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "ashen.glass_grain",
            "weight": 0.25
          },
          {
            "materialId": "ashen.red_vein_ore",
            "weight": 0.25
          },
          {
            "materialId": "ashen.singing_crystal",
            "weight": 0.25
          },
          {
            "materialId": "ashen.obsidian_glass",
            "weight": 0.25
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "ashen.red_vein_ore",
            "weight": 1
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "ashen.upwind_salt",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "ashen.infinity_gem_ashen",
            "weight": 1
          }
        ]
      }
    ]
  },
  "ashen.a06.normal.1|ashen.a06.dungeon": {
    "monsterId": "ashen.a06.normal.1",
    "nodeId": "ashen.a06.dungeon",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "ashen.glass_grain",
            "weight": 0.25
          },
          {
            "materialId": "ashen.red_vein_ore",
            "weight": 0.25
          },
          {
            "materialId": "ashen.singing_crystal",
            "weight": 0.25
          },
          {
            "materialId": "ashen.obsidian_glass",
            "weight": 0.25
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "ashen.red_vein_ore",
            "weight": 1
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "ashen.upwind_salt",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "ashen.infinity_gem_ashen",
            "weight": 1
          }
        ]
      }
    ]
  },
  "ashen.a06.normal.2|ashen.a06.field": {
    "monsterId": "ashen.a06.normal.2",
    "nodeId": "ashen.a06.field",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "ashen.glass_grain",
            "weight": 0.25
          },
          {
            "materialId": "ashen.red_vein_ore",
            "weight": 0.25
          },
          {
            "materialId": "ashen.singing_crystal",
            "weight": 0.25
          },
          {
            "materialId": "ashen.obsidian_glass",
            "weight": 0.25
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "ashen.red_vein_ore",
            "weight": 1
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "ashen.upwind_salt",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "ashen.infinity_gem_ashen",
            "weight": 1
          }
        ]
      }
    ]
  },
  "ashen.a06.normal.2|ashen.a06.dungeon": {
    "monsterId": "ashen.a06.normal.2",
    "nodeId": "ashen.a06.dungeon",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "ashen.glass_grain",
            "weight": 0.25
          },
          {
            "materialId": "ashen.red_vein_ore",
            "weight": 0.25
          },
          {
            "materialId": "ashen.singing_crystal",
            "weight": 0.25
          },
          {
            "materialId": "ashen.obsidian_glass",
            "weight": 0.25
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "ashen.red_vein_ore",
            "weight": 1
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "ashen.upwind_salt",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "ashen.infinity_gem_ashen",
            "weight": 1
          }
        ]
      }
    ]
  },
  "ashen.a06.normal.3|ashen.a06.field": {
    "monsterId": "ashen.a06.normal.3",
    "nodeId": "ashen.a06.field",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "ashen.glass_grain",
            "weight": 0.25
          },
          {
            "materialId": "ashen.red_vein_ore",
            "weight": 0.25
          },
          {
            "materialId": "ashen.singing_crystal",
            "weight": 0.25
          },
          {
            "materialId": "ashen.obsidian_glass",
            "weight": 0.25
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "ashen.red_vein_ore",
            "weight": 1
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "ashen.upwind_salt",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "ashen.infinity_gem_ashen",
            "weight": 1
          }
        ]
      }
    ]
  },
  "ashen.a06.normal.3|ashen.a06.dungeon": {
    "monsterId": "ashen.a06.normal.3",
    "nodeId": "ashen.a06.dungeon",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "ashen.glass_grain",
            "weight": 0.25
          },
          {
            "materialId": "ashen.red_vein_ore",
            "weight": 0.25
          },
          {
            "materialId": "ashen.singing_crystal",
            "weight": 0.25
          },
          {
            "materialId": "ashen.obsidian_glass",
            "weight": 0.25
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "ashen.red_vein_ore",
            "weight": 1
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "ashen.upwind_salt",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "ashen.infinity_gem_ashen",
            "weight": 1
          }
        ]
      }
    ]
  },
  "ashen.a06.elite|ashen.a06.dungeon": {
    "monsterId": "ashen.a06.elite",
    "nodeId": "ashen.a06.dungeon",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "ashen.glass_grain",
            "weight": 0.25
          },
          {
            "materialId": "ashen.red_vein_ore",
            "weight": 0.25
          },
          {
            "materialId": "ashen.singing_crystal",
            "weight": 0.25
          },
          {
            "materialId": "ashen.obsidian_glass",
            "weight": 0.25
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "ashen.red_vein_ore",
            "weight": 1
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "ashen.upwind_salt",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "ashen.infinity_gem_ashen",
            "weight": 1
          }
        ]
      }
    ]
  },
  "ashen.a07.normal.1|ashen.a07.field": {
    "monsterId": "ashen.a07.normal.1",
    "nodeId": "ashen.a07.field",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "ashen.weathered_mica",
            "weight": 0.25
          },
          {
            "materialId": "ashen.singing_crystal",
            "weight": 0.25
          },
          {
            "materialId": "ashen.obsidian_glass",
            "weight": 0.25
          },
          {
            "materialId": "ashen.white_salt_marrow",
            "weight": 0.25
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "ashen.white_salt_marrow",
            "weight": 1
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "ashen.upwind_salt",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "ashen.infinity_gem_ashen",
            "weight": 1
          }
        ]
      }
    ]
  },
  "ashen.a07.normal.1|ashen.a07.dungeon": {
    "monsterId": "ashen.a07.normal.1",
    "nodeId": "ashen.a07.dungeon",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "ashen.weathered_mica",
            "weight": 0.25
          },
          {
            "materialId": "ashen.singing_crystal",
            "weight": 0.25
          },
          {
            "materialId": "ashen.obsidian_glass",
            "weight": 0.25
          },
          {
            "materialId": "ashen.white_salt_marrow",
            "weight": 0.25
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "ashen.white_salt_marrow",
            "weight": 1
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "ashen.upwind_salt",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "ashen.infinity_gem_ashen",
            "weight": 1
          }
        ]
      }
    ]
  },
  "ashen.a07.normal.2|ashen.a07.field": {
    "monsterId": "ashen.a07.normal.2",
    "nodeId": "ashen.a07.field",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "ashen.weathered_mica",
            "weight": 0.25
          },
          {
            "materialId": "ashen.singing_crystal",
            "weight": 0.25
          },
          {
            "materialId": "ashen.obsidian_glass",
            "weight": 0.25
          },
          {
            "materialId": "ashen.white_salt_marrow",
            "weight": 0.25
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "ashen.white_salt_marrow",
            "weight": 1
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "ashen.upwind_salt",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "ashen.infinity_gem_ashen",
            "weight": 1
          }
        ]
      }
    ]
  },
  "ashen.a07.normal.2|ashen.a07.dungeon": {
    "monsterId": "ashen.a07.normal.2",
    "nodeId": "ashen.a07.dungeon",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "ashen.weathered_mica",
            "weight": 0.25
          },
          {
            "materialId": "ashen.singing_crystal",
            "weight": 0.25
          },
          {
            "materialId": "ashen.obsidian_glass",
            "weight": 0.25
          },
          {
            "materialId": "ashen.white_salt_marrow",
            "weight": 0.25
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "ashen.white_salt_marrow",
            "weight": 1
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "ashen.upwind_salt",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "ashen.infinity_gem_ashen",
            "weight": 1
          }
        ]
      }
    ]
  },
  "ashen.a07.normal.3|ashen.a07.field": {
    "monsterId": "ashen.a07.normal.3",
    "nodeId": "ashen.a07.field",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "ashen.weathered_mica",
            "weight": 0.25
          },
          {
            "materialId": "ashen.singing_crystal",
            "weight": 0.25
          },
          {
            "materialId": "ashen.obsidian_glass",
            "weight": 0.25
          },
          {
            "materialId": "ashen.white_salt_marrow",
            "weight": 0.25
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "ashen.white_salt_marrow",
            "weight": 1
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "ashen.upwind_salt",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "ashen.infinity_gem_ashen",
            "weight": 1
          }
        ]
      }
    ]
  },
  "ashen.a07.normal.3|ashen.a07.dungeon": {
    "monsterId": "ashen.a07.normal.3",
    "nodeId": "ashen.a07.dungeon",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "ashen.weathered_mica",
            "weight": 0.25
          },
          {
            "materialId": "ashen.singing_crystal",
            "weight": 0.25
          },
          {
            "materialId": "ashen.obsidian_glass",
            "weight": 0.25
          },
          {
            "materialId": "ashen.white_salt_marrow",
            "weight": 0.25
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "ashen.white_salt_marrow",
            "weight": 1
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "ashen.upwind_salt",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "ashen.infinity_gem_ashen",
            "weight": 1
          }
        ]
      }
    ]
  },
  "ashen.a07.elite|ashen.a07.dungeon": {
    "monsterId": "ashen.a07.elite",
    "nodeId": "ashen.a07.dungeon",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "ashen.weathered_mica",
            "weight": 0.25
          },
          {
            "materialId": "ashen.singing_crystal",
            "weight": 0.25
          },
          {
            "materialId": "ashen.obsidian_glass",
            "weight": 0.25
          },
          {
            "materialId": "ashen.white_salt_marrow",
            "weight": 0.25
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "ashen.white_salt_marrow",
            "weight": 1
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "ashen.upwind_salt",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "ashen.infinity_gem_ashen",
            "weight": 1
          }
        ]
      }
    ]
  },
  "ashen.a07.boss|ashen.a07.boss": {
    "monsterId": "ashen.a07.boss",
    "nodeId": "ashen.a07.boss",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "ashen.weathered_mica",
            "weight": 0.25
          },
          {
            "materialId": "ashen.singing_crystal",
            "weight": 0.25
          },
          {
            "materialId": "ashen.obsidian_glass",
            "weight": 0.25
          },
          {
            "materialId": "ashen.white_salt_marrow",
            "weight": 0.25
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "ashen.white_salt_marrow",
            "weight": 1
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "ashen.upwind_salt",
            "weight": 0.5
          },
          {
            "materialId": "ashen.refracted_glassheart",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "ashen.infinity_gem_ashen",
            "weight": 1
          }
        ]
      }
    ]
  },
  "ashen.a08.normal.1|ashen.a08.field": {
    "monsterId": "ashen.a08.normal.1",
    "nodeId": "ashen.a08.field",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "ashen.obsidian_glass",
            "weight": 0.25
          },
          {
            "materialId": "ashen.white_salt_marrow",
            "weight": 0.25
          },
          {
            "materialId": "ashen.dim_crystal_sand",
            "weight": 0.25
          },
          {
            "materialId": "ashen.refractory_stone",
            "weight": 0.25
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "ashen.white_salt_marrow",
            "weight": 0.5
          },
          {
            "materialId": "ashen.dim_crystal_sand",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "ashen.refracted_glassheart",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "ashen.infinity_gem_ashen",
            "weight": 1
          }
        ]
      }
    ]
  },
  "ashen.a08.normal.1|ashen.a08.dungeon": {
    "monsterId": "ashen.a08.normal.1",
    "nodeId": "ashen.a08.dungeon",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "ashen.obsidian_glass",
            "weight": 0.25
          },
          {
            "materialId": "ashen.white_salt_marrow",
            "weight": 0.25
          },
          {
            "materialId": "ashen.dim_crystal_sand",
            "weight": 0.25
          },
          {
            "materialId": "ashen.refractory_stone",
            "weight": 0.25
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "ashen.white_salt_marrow",
            "weight": 0.5
          },
          {
            "materialId": "ashen.dim_crystal_sand",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "ashen.refracted_glassheart",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "ashen.infinity_gem_ashen",
            "weight": 1
          }
        ]
      }
    ]
  },
  "ashen.a08.normal.2|ashen.a08.field": {
    "monsterId": "ashen.a08.normal.2",
    "nodeId": "ashen.a08.field",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "ashen.obsidian_glass",
            "weight": 0.25
          },
          {
            "materialId": "ashen.white_salt_marrow",
            "weight": 0.25
          },
          {
            "materialId": "ashen.dim_crystal_sand",
            "weight": 0.25
          },
          {
            "materialId": "ashen.refractory_stone",
            "weight": 0.25
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "ashen.white_salt_marrow",
            "weight": 0.5
          },
          {
            "materialId": "ashen.dim_crystal_sand",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "ashen.refracted_glassheart",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "ashen.infinity_gem_ashen",
            "weight": 1
          }
        ]
      }
    ]
  },
  "ashen.a08.normal.2|ashen.a08.dungeon": {
    "monsterId": "ashen.a08.normal.2",
    "nodeId": "ashen.a08.dungeon",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "ashen.obsidian_glass",
            "weight": 0.25
          },
          {
            "materialId": "ashen.white_salt_marrow",
            "weight": 0.25
          },
          {
            "materialId": "ashen.dim_crystal_sand",
            "weight": 0.25
          },
          {
            "materialId": "ashen.refractory_stone",
            "weight": 0.25
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "ashen.white_salt_marrow",
            "weight": 0.5
          },
          {
            "materialId": "ashen.dim_crystal_sand",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "ashen.refracted_glassheart",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "ashen.infinity_gem_ashen",
            "weight": 1
          }
        ]
      }
    ]
  },
  "ashen.a08.normal.3|ashen.a08.field": {
    "monsterId": "ashen.a08.normal.3",
    "nodeId": "ashen.a08.field",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "ashen.obsidian_glass",
            "weight": 0.25
          },
          {
            "materialId": "ashen.white_salt_marrow",
            "weight": 0.25
          },
          {
            "materialId": "ashen.dim_crystal_sand",
            "weight": 0.25
          },
          {
            "materialId": "ashen.refractory_stone",
            "weight": 0.25
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "ashen.white_salt_marrow",
            "weight": 0.5
          },
          {
            "materialId": "ashen.dim_crystal_sand",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "ashen.refracted_glassheart",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "ashen.infinity_gem_ashen",
            "weight": 1
          }
        ]
      }
    ]
  },
  "ashen.a08.normal.3|ashen.a08.dungeon": {
    "monsterId": "ashen.a08.normal.3",
    "nodeId": "ashen.a08.dungeon",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "ashen.obsidian_glass",
            "weight": 0.25
          },
          {
            "materialId": "ashen.white_salt_marrow",
            "weight": 0.25
          },
          {
            "materialId": "ashen.dim_crystal_sand",
            "weight": 0.25
          },
          {
            "materialId": "ashen.refractory_stone",
            "weight": 0.25
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "ashen.white_salt_marrow",
            "weight": 0.5
          },
          {
            "materialId": "ashen.dim_crystal_sand",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "ashen.refracted_glassheart",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "ashen.infinity_gem_ashen",
            "weight": 1
          }
        ]
      }
    ]
  },
  "ashen.a08.elite|ashen.a08.dungeon": {
    "monsterId": "ashen.a08.elite",
    "nodeId": "ashen.a08.dungeon",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "ashen.obsidian_glass",
            "weight": 0.25
          },
          {
            "materialId": "ashen.white_salt_marrow",
            "weight": 0.25
          },
          {
            "materialId": "ashen.dim_crystal_sand",
            "weight": 0.25
          },
          {
            "materialId": "ashen.refractory_stone",
            "weight": 0.25
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "ashen.white_salt_marrow",
            "weight": 0.5
          },
          {
            "materialId": "ashen.dim_crystal_sand",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "ashen.refracted_glassheart",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "ashen.infinity_gem_ashen",
            "weight": 1
          }
        ]
      }
    ]
  },
  "ashen.a09.normal.1|ashen.a09.field": {
    "monsterId": "ashen.a09.normal.1",
    "nodeId": "ashen.a09.field",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "ashen.white_salt_marrow",
            "weight": 0.3333333333333333
          },
          {
            "materialId": "ashen.dim_crystal_sand",
            "weight": 0.3333333333333333
          },
          {
            "materialId": "ashen.refractory_stone",
            "weight": 0.3333333333333333
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "ashen.white_salt_marrow",
            "weight": 0.5
          },
          {
            "materialId": "ashen.dim_crystal_sand",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "ashen.refracted_glassheart",
            "weight": 0.5
          },
          {
            "materialId": "ashen.undying_ember",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "ashen.infinity_gem_ashen",
            "weight": 1
          }
        ]
      }
    ]
  },
  "ashen.a09.normal.1|ashen.a09.dungeon": {
    "monsterId": "ashen.a09.normal.1",
    "nodeId": "ashen.a09.dungeon",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "ashen.white_salt_marrow",
            "weight": 0.3333333333333333
          },
          {
            "materialId": "ashen.dim_crystal_sand",
            "weight": 0.3333333333333333
          },
          {
            "materialId": "ashen.refractory_stone",
            "weight": 0.3333333333333333
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "ashen.white_salt_marrow",
            "weight": 0.5
          },
          {
            "materialId": "ashen.dim_crystal_sand",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "ashen.refracted_glassheart",
            "weight": 0.5
          },
          {
            "materialId": "ashen.undying_ember",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "ashen.infinity_gem_ashen",
            "weight": 1
          }
        ]
      }
    ]
  },
  "ashen.a09.normal.2|ashen.a09.field": {
    "monsterId": "ashen.a09.normal.2",
    "nodeId": "ashen.a09.field",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "ashen.white_salt_marrow",
            "weight": 0.3333333333333333
          },
          {
            "materialId": "ashen.dim_crystal_sand",
            "weight": 0.3333333333333333
          },
          {
            "materialId": "ashen.refractory_stone",
            "weight": 0.3333333333333333
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "ashen.white_salt_marrow",
            "weight": 0.5
          },
          {
            "materialId": "ashen.dim_crystal_sand",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "ashen.refracted_glassheart",
            "weight": 0.5
          },
          {
            "materialId": "ashen.undying_ember",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "ashen.infinity_gem_ashen",
            "weight": 1
          }
        ]
      }
    ]
  },
  "ashen.a09.normal.2|ashen.a09.dungeon": {
    "monsterId": "ashen.a09.normal.2",
    "nodeId": "ashen.a09.dungeon",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "ashen.white_salt_marrow",
            "weight": 0.3333333333333333
          },
          {
            "materialId": "ashen.dim_crystal_sand",
            "weight": 0.3333333333333333
          },
          {
            "materialId": "ashen.refractory_stone",
            "weight": 0.3333333333333333
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "ashen.white_salt_marrow",
            "weight": 0.5
          },
          {
            "materialId": "ashen.dim_crystal_sand",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "ashen.refracted_glassheart",
            "weight": 0.5
          },
          {
            "materialId": "ashen.undying_ember",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "ashen.infinity_gem_ashen",
            "weight": 1
          }
        ]
      }
    ]
  },
  "ashen.a09.normal.3|ashen.a09.field": {
    "monsterId": "ashen.a09.normal.3",
    "nodeId": "ashen.a09.field",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "ashen.white_salt_marrow",
            "weight": 0.3333333333333333
          },
          {
            "materialId": "ashen.dim_crystal_sand",
            "weight": 0.3333333333333333
          },
          {
            "materialId": "ashen.refractory_stone",
            "weight": 0.3333333333333333
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "ashen.white_salt_marrow",
            "weight": 0.5
          },
          {
            "materialId": "ashen.dim_crystal_sand",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "ashen.refracted_glassheart",
            "weight": 0.5
          },
          {
            "materialId": "ashen.undying_ember",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "ashen.infinity_gem_ashen",
            "weight": 1
          }
        ]
      }
    ]
  },
  "ashen.a09.normal.3|ashen.a09.dungeon": {
    "monsterId": "ashen.a09.normal.3",
    "nodeId": "ashen.a09.dungeon",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "ashen.white_salt_marrow",
            "weight": 0.3333333333333333
          },
          {
            "materialId": "ashen.dim_crystal_sand",
            "weight": 0.3333333333333333
          },
          {
            "materialId": "ashen.refractory_stone",
            "weight": 0.3333333333333333
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "ashen.white_salt_marrow",
            "weight": 0.5
          },
          {
            "materialId": "ashen.dim_crystal_sand",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "ashen.refracted_glassheart",
            "weight": 0.5
          },
          {
            "materialId": "ashen.undying_ember",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "ashen.infinity_gem_ashen",
            "weight": 1
          }
        ]
      }
    ]
  },
  "ashen.a09.elite|ashen.a09.dungeon": {
    "monsterId": "ashen.a09.elite",
    "nodeId": "ashen.a09.dungeon",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "ashen.white_salt_marrow",
            "weight": 0.3333333333333333
          },
          {
            "materialId": "ashen.dim_crystal_sand",
            "weight": 0.3333333333333333
          },
          {
            "materialId": "ashen.refractory_stone",
            "weight": 0.3333333333333333
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "ashen.white_salt_marrow",
            "weight": 0.5
          },
          {
            "materialId": "ashen.dim_crystal_sand",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "ashen.refracted_glassheart",
            "weight": 0.5
          },
          {
            "materialId": "ashen.undying_ember",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "ashen.infinity_gem_ashen",
            "weight": 1
          }
        ]
      }
    ]
  },
  "ashen.a10.normal.1|ashen.a10.field": {
    "monsterId": "ashen.a10.normal.1",
    "nodeId": "ashen.a10.field",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "ashen.dim_crystal_sand",
            "weight": 0.5
          },
          {
            "materialId": "ashen.refractory_stone",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "ashen.dim_crystal_sand",
            "weight": 1
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "ashen.undying_ember",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "ashen.infinity_gem_ashen",
            "weight": 1
          }
        ]
      }
    ]
  },
  "ashen.a10.normal.1|ashen.a10.dungeon": {
    "monsterId": "ashen.a10.normal.1",
    "nodeId": "ashen.a10.dungeon",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "ashen.dim_crystal_sand",
            "weight": 0.5
          },
          {
            "materialId": "ashen.refractory_stone",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "ashen.dim_crystal_sand",
            "weight": 1
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "ashen.undying_ember",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "ashen.infinity_gem_ashen",
            "weight": 1
          }
        ]
      }
    ]
  },
  "ashen.a10.normal.2|ashen.a10.field": {
    "monsterId": "ashen.a10.normal.2",
    "nodeId": "ashen.a10.field",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "ashen.dim_crystal_sand",
            "weight": 0.5
          },
          {
            "materialId": "ashen.refractory_stone",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "ashen.dim_crystal_sand",
            "weight": 1
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "ashen.undying_ember",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "ashen.infinity_gem_ashen",
            "weight": 1
          }
        ]
      }
    ]
  },
  "ashen.a10.normal.2|ashen.a10.dungeon": {
    "monsterId": "ashen.a10.normal.2",
    "nodeId": "ashen.a10.dungeon",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "ashen.dim_crystal_sand",
            "weight": 0.5
          },
          {
            "materialId": "ashen.refractory_stone",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "ashen.dim_crystal_sand",
            "weight": 1
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "ashen.undying_ember",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "ashen.infinity_gem_ashen",
            "weight": 1
          }
        ]
      }
    ]
  },
  "ashen.a10.normal.3|ashen.a10.field": {
    "monsterId": "ashen.a10.normal.3",
    "nodeId": "ashen.a10.field",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "ashen.dim_crystal_sand",
            "weight": 0.5
          },
          {
            "materialId": "ashen.refractory_stone",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "ashen.dim_crystal_sand",
            "weight": 1
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "ashen.undying_ember",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "ashen.infinity_gem_ashen",
            "weight": 1
          }
        ]
      }
    ]
  },
  "ashen.a10.normal.3|ashen.a10.dungeon": {
    "monsterId": "ashen.a10.normal.3",
    "nodeId": "ashen.a10.dungeon",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "ashen.dim_crystal_sand",
            "weight": 0.5
          },
          {
            "materialId": "ashen.refractory_stone",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "ashen.dim_crystal_sand",
            "weight": 1
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "ashen.undying_ember",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "ashen.infinity_gem_ashen",
            "weight": 1
          }
        ]
      }
    ]
  },
  "ashen.a10.elite|ashen.a10.dungeon": {
    "monsterId": "ashen.a10.elite",
    "nodeId": "ashen.a10.dungeon",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "ashen.dim_crystal_sand",
            "weight": 0.5
          },
          {
            "materialId": "ashen.refractory_stone",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "ashen.dim_crystal_sand",
            "weight": 1
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "ashen.undying_ember",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "ashen.infinity_gem_ashen",
            "weight": 1
          }
        ]
      }
    ]
  },
  "ashen.a10.boss|ashen.a10.boss": {
    "monsterId": "ashen.a10.boss",
    "nodeId": "ashen.a10.boss",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "ashen.dim_crystal_sand",
            "weight": 0.5
          },
          {
            "materialId": "ashen.refractory_stone",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "ashen.dim_crystal_sand",
            "weight": 1
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "ashen.undying_ember",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "ashen.infinity_gem_ashen",
            "weight": 1
          }
        ]
      }
    ]
  }
};
export const materialPools=buildMaterialPools({materials,monsters,associations:materialAssociations});
