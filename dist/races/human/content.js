// Numeric values are initial candidates, pending integrated long-run calibration.
export const HUMAN_AREAS=[
  {
    "id": "human.a01",
    "race": "human",
    "number": 1,
    "name": "田垄边境",
    "levelRange": [
      1,
      10
    ],
    "boss": false,
    "description": "风车与低石墙围起麦田，旧灌渠贯穿田垄。"
  },
  {
    "id": "human.a02",
    "race": "human",
    "number": 2,
    "name": "旧驿道",
    "levelRange": [
      11,
      20
    ],
    "boss": false,
    "description": "废弃驿站沿青石路散落，风铃蓟从车辙中冒出。"
  },
  {
    "id": "human.a03",
    "race": "human",
    "number": 3,
    "name": "礼钟丘陵",
    "levelRange": [
      21,
      30
    ],
    "boss": true,
    "description": "礼钟残塔立于缓丘，裂钟余音沿地下石室传播。"
  },
  {
    "id": "human.a04",
    "race": "human",
    "number": 4,
    "name": "盐泉谷地",
    "levelRange": [
      31,
      40
    ],
    "boss": false,
    "description": "盐泉将石壁浸成浅蓝，泉桥连接层叠矿盐台地。"
  },
  {
    "id": "human.a05",
    "race": "human",
    "number": 5,
    "name": "圣烛林缘",
    "levelRange": [
      41,
      50
    ],
    "boss": false,
    "description": "圣烛树胶照亮林缘，废军械被树根缠住。"
  },
  {
    "id": "human.a06",
    "race": "human",
    "number": 6,
    "name": "断旗战地",
    "levelRange": [
      51,
      60
    ],
    "boss": true,
    "description": "破旗与赤色泥土覆盖旧战场，军营药圃仍有余烬椒。"
  },
  {
    "id": "human.a07",
    "race": "human",
    "number": 7,
    "name": "失守关隘",
    "levelRange": [
      61,
      70
    ],
    "boss": false,
    "description": "断桥横过关隘，失守守军把关门改成伏击阵地。"
  },
  {
    "id": "human.a08",
    "race": "human",
    "number": 8,
    "name": "夜鸦高地",
    "levelRange": [
      71,
      80
    ],
    "boss": false,
    "description": "夜鸦在黑松间盘旋，白色石髓从高崖裂缝析出。"
  },
  {
    "id": "human.a09",
    "race": "human",
    "number": 9,
    "name": "旧王垒",
    "levelRange": [
      81,
      90
    ],
    "boss": true,
    "description": "古王垒的残灯照着中庭，银纹草漫过裂砖。"
  },
  {
    "id": "human.a10",
    "race": "human",
    "number": 10,
    "name": "荒冠内境",
    "levelRange": [
      91,
      100
    ],
    "boss": false,
    "description": "空旷宫柱内不再有王座，银籽在荒庭石缝萌生。"
  }
];
export const HUMAN_MATERIAL_POOLS={
  "human.a01.normal.1|human.a01.field": {
    "monsterId": "human.a01.normal.1",
    "nodeId": "human.a01.field",
    "channels": [
      {
        "id": "main",
        "hitProbability": 0.72,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.02",
            "weight": 0.6,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.03",
            "weight": 0.4,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "main"
      },
      {
        "id": "gem",
        "hitProbability": 0.0001,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.17",
            "weight": 1,
            "qualityWeights": [
              0,
              0,
              0,
              1
            ]
          }
        ],
        "channel": "gem"
      }
    ]
  },
  "human.a01.normal.1|human.a01.dungeon": {
    "monsterId": "human.a01.normal.1",
    "nodeId": "human.a01.dungeon",
    "channels": [
      {
        "id": "main",
        "hitProbability": 0.72,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.02",
            "weight": 0.6,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.03",
            "weight": 0.4,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "main"
      },
      {
        "id": "gem",
        "hitProbability": 0.0002,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.17",
            "weight": 1,
            "qualityWeights": [
              0,
              0,
              0,
              1
            ]
          }
        ],
        "channel": "gem"
      }
    ]
  },
  "human.a01.normal.2|human.a01.field": {
    "monsterId": "human.a01.normal.2",
    "nodeId": "human.a01.field",
    "channels": [
      {
        "id": "main",
        "hitProbability": 0.72,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.01",
            "weight": 0.4,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.02",
            "weight": 0.6,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "main"
      },
      {
        "id": "gem",
        "hitProbability": 0.0001,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.17",
            "weight": 1,
            "qualityWeights": [
              0,
              0,
              0,
              1
            ]
          }
        ],
        "channel": "gem"
      }
    ]
  },
  "human.a01.normal.2|human.a01.dungeon": {
    "monsterId": "human.a01.normal.2",
    "nodeId": "human.a01.dungeon",
    "channels": [
      {
        "id": "main",
        "hitProbability": 0.72,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.01",
            "weight": 0.4,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.02",
            "weight": 0.6,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "main"
      },
      {
        "id": "gem",
        "hitProbability": 0.0002,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.17",
            "weight": 1,
            "qualityWeights": [
              0,
              0,
              0,
              1
            ]
          }
        ],
        "channel": "gem"
      }
    ]
  },
  "human.a01.normal.3|human.a01.field": {
    "monsterId": "human.a01.normal.3",
    "nodeId": "human.a01.field",
    "channels": [
      {
        "id": "main",
        "hitProbability": 0.72,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.02",
            "weight": 1,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "main"
      },
      {
        "id": "gem",
        "hitProbability": 0.0001,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.17",
            "weight": 1,
            "qualityWeights": [
              0,
              0,
              0,
              1
            ]
          }
        ],
        "channel": "gem"
      }
    ]
  },
  "human.a01.normal.3|human.a01.dungeon": {
    "monsterId": "human.a01.normal.3",
    "nodeId": "human.a01.dungeon",
    "channels": [
      {
        "id": "main",
        "hitProbability": 0.72,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.02",
            "weight": 1,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "main"
      },
      {
        "id": "gem",
        "hitProbability": 0.0002,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.17",
            "weight": 1,
            "qualityWeights": [
              0,
              0,
              0,
              1
            ]
          }
        ],
        "channel": "gem"
      }
    ]
  },
  "human.a01.elite|human.a01.field": {
    "monsterId": "human.a01.elite",
    "nodeId": "human.a01.field",
    "channels": [
      {
        "id": "main",
        "hitProbability": 0.72,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.01",
            "weight": 0.4,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.02",
            "weight": 0.6,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "main"
      },
      {
        "id": "gem",
        "hitProbability": 0.0001,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.17",
            "weight": 1,
            "qualityWeights": [
              0,
              0,
              0,
              1
            ]
          }
        ],
        "channel": "gem"
      }
    ]
  },
  "human.a01.elite|human.a01.dungeon": {
    "monsterId": "human.a01.elite",
    "nodeId": "human.a01.dungeon",
    "channels": [
      {
        "id": "main",
        "hitProbability": 0.72,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.01",
            "weight": 0.4,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.02",
            "weight": 0.6,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "main"
      },
      {
        "id": "gem",
        "hitProbability": 0.0002,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.17",
            "weight": 1,
            "qualityWeights": [
              0,
              0,
              0,
              1
            ]
          }
        ],
        "channel": "gem"
      }
    ]
  },
  "human.a02.normal.1|human.a02.field": {
    "monsterId": "human.a02.normal.1",
    "nodeId": "human.a02.field",
    "channels": [
      {
        "id": "main",
        "hitProbability": 0.72,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.02",
            "weight": 0.6,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.03",
            "weight": 0.4,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "main"
      },
      {
        "id": "gem",
        "hitProbability": 0.00012000000000000002,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.17",
            "weight": 1,
            "qualityWeights": [
              0,
              0,
              0,
              1
            ]
          }
        ],
        "channel": "gem"
      }
    ]
  },
  "human.a02.normal.1|human.a02.dungeon": {
    "monsterId": "human.a02.normal.1",
    "nodeId": "human.a02.dungeon",
    "channels": [
      {
        "id": "main",
        "hitProbability": 0.72,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.02",
            "weight": 0.6,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.03",
            "weight": 0.4,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "main"
      },
      {
        "id": "gem",
        "hitProbability": 0.00024000000000000003,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.17",
            "weight": 1,
            "qualityWeights": [
              0,
              0,
              0,
              1
            ]
          }
        ],
        "channel": "gem"
      }
    ]
  },
  "human.a02.normal.2|human.a02.field": {
    "monsterId": "human.a02.normal.2",
    "nodeId": "human.a02.field",
    "channels": [
      {
        "id": "main",
        "hitProbability": 0.72,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.01",
            "weight": 0.4,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.02",
            "weight": 0.6,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "main"
      },
      {
        "id": "gem",
        "hitProbability": 0.00012000000000000002,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.17",
            "weight": 1,
            "qualityWeights": [
              0,
              0,
              0,
              1
            ]
          }
        ],
        "channel": "gem"
      }
    ]
  },
  "human.a02.normal.2|human.a02.dungeon": {
    "monsterId": "human.a02.normal.2",
    "nodeId": "human.a02.dungeon",
    "channels": [
      {
        "id": "main",
        "hitProbability": 0.72,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.01",
            "weight": 0.4,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.02",
            "weight": 0.6,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "main"
      },
      {
        "id": "gem",
        "hitProbability": 0.00024000000000000003,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.17",
            "weight": 1,
            "qualityWeights": [
              0,
              0,
              0,
              1
            ]
          }
        ],
        "channel": "gem"
      }
    ]
  },
  "human.a02.normal.3|human.a02.field": {
    "monsterId": "human.a02.normal.3",
    "nodeId": "human.a02.field",
    "channels": [
      {
        "id": "main",
        "hitProbability": 0.72,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.02",
            "weight": 0.6,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.04",
            "weight": 0.4,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "main"
      },
      {
        "id": "special",
        "hitProbability": 0.012,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.13",
            "weight": 1,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "special"
      },
      {
        "id": "gem",
        "hitProbability": 0.00012000000000000002,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.17",
            "weight": 1,
            "qualityWeights": [
              0,
              0,
              0,
              1
            ]
          }
        ],
        "channel": "gem"
      }
    ]
  },
  "human.a02.normal.3|human.a02.dungeon": {
    "monsterId": "human.a02.normal.3",
    "nodeId": "human.a02.dungeon",
    "channels": [
      {
        "id": "main",
        "hitProbability": 0.72,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.02",
            "weight": 0.6,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.04",
            "weight": 0.4,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "main"
      },
      {
        "id": "special",
        "hitProbability": 0.035,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.13",
            "weight": 1,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "special"
      },
      {
        "id": "gem",
        "hitProbability": 0.00024000000000000003,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.17",
            "weight": 1,
            "qualityWeights": [
              0,
              0,
              0,
              1
            ]
          }
        ],
        "channel": "gem"
      }
    ]
  },
  "human.a02.elite|human.a02.field": {
    "monsterId": "human.a02.elite",
    "nodeId": "human.a02.field",
    "channels": [
      {
        "id": "main",
        "hitProbability": 0.72,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.01",
            "weight": 0.4,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.02",
            "weight": 0.6,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "main"
      },
      {
        "id": "special",
        "hitProbability": 0.012,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.13",
            "weight": 1,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "special"
      },
      {
        "id": "gem",
        "hitProbability": 0.00012000000000000002,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.17",
            "weight": 1,
            "qualityWeights": [
              0,
              0,
              0,
              1
            ]
          }
        ],
        "channel": "gem"
      }
    ]
  },
  "human.a02.elite|human.a02.dungeon": {
    "monsterId": "human.a02.elite",
    "nodeId": "human.a02.dungeon",
    "channels": [
      {
        "id": "main",
        "hitProbability": 0.72,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.01",
            "weight": 0.4,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.02",
            "weight": 0.6,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "main"
      },
      {
        "id": "special",
        "hitProbability": 0.035,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.13",
            "weight": 1,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "special"
      },
      {
        "id": "gem",
        "hitProbability": 0.00024000000000000003,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.17",
            "weight": 1,
            "qualityWeights": [
              0,
              0,
              0,
              1
            ]
          }
        ],
        "channel": "gem"
      }
    ]
  },
  "human.a03.normal.1|human.a03.field": {
    "monsterId": "human.a03.normal.1",
    "nodeId": "human.a03.field",
    "channels": [
      {
        "id": "main",
        "hitProbability": 0.72,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.02",
            "weight": 0.375,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.03",
            "weight": 0.25,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.05",
            "weight": 0.375,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "main"
      },
      {
        "id": "gem",
        "hitProbability": 0.00014000000000000001,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.17",
            "weight": 1,
            "qualityWeights": [
              0,
              0,
              0,
              1
            ]
          }
        ],
        "channel": "gem"
      }
    ]
  },
  "human.a03.normal.1|human.a03.dungeon": {
    "monsterId": "human.a03.normal.1",
    "nodeId": "human.a03.dungeon",
    "channels": [
      {
        "id": "main",
        "hitProbability": 0.72,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.02",
            "weight": 0.375,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.03",
            "weight": 0.25,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.05",
            "weight": 0.375,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "main"
      },
      {
        "id": "gem",
        "hitProbability": 0.00028000000000000003,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.17",
            "weight": 1,
            "qualityWeights": [
              0,
              0,
              0,
              1
            ]
          }
        ],
        "channel": "gem"
      }
    ]
  },
  "human.a03.normal.2|human.a03.field": {
    "monsterId": "human.a03.normal.2",
    "nodeId": "human.a03.field",
    "channels": [
      {
        "id": "main",
        "hitProbability": 0.72,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.02",
            "weight": 0.3,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.04",
            "weight": 0.2,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.05",
            "weight": 0.3,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.06",
            "weight": 0.2,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "main"
      },
      {
        "id": "special",
        "hitProbability": 0.012,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.13",
            "weight": 1,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "special"
      },
      {
        "id": "gem",
        "hitProbability": 0.00014000000000000001,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.17",
            "weight": 1,
            "qualityWeights": [
              0,
              0,
              0,
              1
            ]
          }
        ],
        "channel": "gem"
      }
    ]
  },
  "human.a03.normal.2|human.a03.dungeon": {
    "monsterId": "human.a03.normal.2",
    "nodeId": "human.a03.dungeon",
    "channels": [
      {
        "id": "main",
        "hitProbability": 0.72,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.02",
            "weight": 0.3,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.04",
            "weight": 0.2,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.05",
            "weight": 0.3,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.06",
            "weight": 0.2,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "main"
      },
      {
        "id": "special",
        "hitProbability": 0.035,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.13",
            "weight": 1,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "special"
      },
      {
        "id": "gem",
        "hitProbability": 0.00028000000000000003,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.17",
            "weight": 1,
            "qualityWeights": [
              0,
              0,
              0,
              1
            ]
          }
        ],
        "channel": "gem"
      }
    ]
  },
  "human.a03.normal.3|human.a03.field": {
    "monsterId": "human.a03.normal.3",
    "nodeId": "human.a03.field",
    "channels": [
      {
        "id": "main",
        "hitProbability": 0.72,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.01",
            "weight": 0.25,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.02",
            "weight": 0.375,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.05",
            "weight": 0.375,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "main"
      },
      {
        "id": "gem",
        "hitProbability": 0.00014000000000000001,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.17",
            "weight": 1,
            "qualityWeights": [
              0,
              0,
              0,
              1
            ]
          }
        ],
        "channel": "gem"
      }
    ]
  },
  "human.a03.normal.3|human.a03.dungeon": {
    "monsterId": "human.a03.normal.3",
    "nodeId": "human.a03.dungeon",
    "channels": [
      {
        "id": "main",
        "hitProbability": 0.72,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.01",
            "weight": 0.25,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.02",
            "weight": 0.375,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.05",
            "weight": 0.375,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "main"
      },
      {
        "id": "gem",
        "hitProbability": 0.00028000000000000003,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.17",
            "weight": 1,
            "qualityWeights": [
              0,
              0,
              0,
              1
            ]
          }
        ],
        "channel": "gem"
      }
    ]
  },
  "human.a03.elite|human.a03.field": {
    "monsterId": "human.a03.elite",
    "nodeId": "human.a03.field",
    "channels": [
      {
        "id": "main",
        "hitProbability": 0.72,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.02",
            "weight": 0.3,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.04",
            "weight": 0.2,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.05",
            "weight": 0.3,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.06",
            "weight": 0.2,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "main"
      },
      {
        "id": "special",
        "hitProbability": 0.012,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.13",
            "weight": 1,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "special"
      },
      {
        "id": "gem",
        "hitProbability": 0.00014000000000000001,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.17",
            "weight": 1,
            "qualityWeights": [
              0,
              0,
              0,
              1
            ]
          }
        ],
        "channel": "gem"
      }
    ]
  },
  "human.a03.elite|human.a03.dungeon": {
    "monsterId": "human.a03.elite",
    "nodeId": "human.a03.dungeon",
    "channels": [
      {
        "id": "main",
        "hitProbability": 0.72,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.02",
            "weight": 0.3,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.04",
            "weight": 0.2,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.05",
            "weight": 0.3,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.06",
            "weight": 0.2,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "main"
      },
      {
        "id": "special",
        "hitProbability": 0.035,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.13",
            "weight": 1,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "special"
      },
      {
        "id": "gem",
        "hitProbability": 0.00028000000000000003,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.17",
            "weight": 1,
            "qualityWeights": [
              0,
              0,
              0,
              1
            ]
          }
        ],
        "channel": "gem"
      }
    ]
  },
  "human.a04.normal.1|human.a04.field": {
    "monsterId": "human.a04.normal.1",
    "nodeId": "human.a04.field",
    "channels": [
      {
        "id": "main",
        "hitProbability": 0.72,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.05",
            "weight": 0.6,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.07",
            "weight": 0.4,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "main"
      },
      {
        "id": "gem",
        "hitProbability": 0.00016,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.17",
            "weight": 1,
            "qualityWeights": [
              0,
              0,
              0,
              1
            ]
          }
        ],
        "channel": "gem"
      }
    ]
  },
  "human.a04.normal.1|human.a04.dungeon": {
    "monsterId": "human.a04.normal.1",
    "nodeId": "human.a04.dungeon",
    "channels": [
      {
        "id": "main",
        "hitProbability": 0.72,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.05",
            "weight": 0.6,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.07",
            "weight": 0.4,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "main"
      },
      {
        "id": "gem",
        "hitProbability": 0.00032,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.17",
            "weight": 1,
            "qualityWeights": [
              0,
              0,
              0,
              1
            ]
          }
        ],
        "channel": "gem"
      }
    ]
  },
  "human.a04.normal.2|human.a04.field": {
    "monsterId": "human.a04.normal.2",
    "nodeId": "human.a04.field",
    "channels": [
      {
        "id": "main",
        "hitProbability": 0.72,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.05",
            "weight": 1,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "main"
      },
      {
        "id": "gem",
        "hitProbability": 0.00016,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.17",
            "weight": 1,
            "qualityWeights": [
              0,
              0,
              0,
              1
            ]
          }
        ],
        "channel": "gem"
      }
    ]
  },
  "human.a04.normal.2|human.a04.dungeon": {
    "monsterId": "human.a04.normal.2",
    "nodeId": "human.a04.dungeon",
    "channels": [
      {
        "id": "main",
        "hitProbability": 0.72,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.05",
            "weight": 1,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "main"
      },
      {
        "id": "gem",
        "hitProbability": 0.00032,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.17",
            "weight": 1,
            "qualityWeights": [
              0,
              0,
              0,
              1
            ]
          }
        ],
        "channel": "gem"
      }
    ]
  },
  "human.a04.normal.3|human.a04.field": {
    "monsterId": "human.a04.normal.3",
    "nodeId": "human.a04.field",
    "channels": [
      {
        "id": "main",
        "hitProbability": 0.72,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.04",
            "weight": 0.2857142857142857,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.05",
            "weight": 0.42857142857142855,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.06",
            "weight": 0.2857142857142857,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "main"
      },
      {
        "id": "gem",
        "hitProbability": 0.00016,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.17",
            "weight": 1,
            "qualityWeights": [
              0,
              0,
              0,
              1
            ]
          }
        ],
        "channel": "gem"
      }
    ]
  },
  "human.a04.normal.3|human.a04.dungeon": {
    "monsterId": "human.a04.normal.3",
    "nodeId": "human.a04.dungeon",
    "channels": [
      {
        "id": "main",
        "hitProbability": 0.72,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.04",
            "weight": 0.2857142857142857,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.05",
            "weight": 0.42857142857142855,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.06",
            "weight": 0.2857142857142857,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "main"
      },
      {
        "id": "gem",
        "hitProbability": 0.00032,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.17",
            "weight": 1,
            "qualityWeights": [
              0,
              0,
              0,
              1
            ]
          }
        ],
        "channel": "gem"
      }
    ]
  },
  "human.a04.elite|human.a04.field": {
    "monsterId": "human.a04.elite",
    "nodeId": "human.a04.field",
    "channels": [
      {
        "id": "main",
        "hitProbability": 0.72,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.05",
            "weight": 1,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "main"
      },
      {
        "id": "gem",
        "hitProbability": 0.00016,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.17",
            "weight": 1,
            "qualityWeights": [
              0,
              0,
              0,
              1
            ]
          }
        ],
        "channel": "gem"
      }
    ]
  },
  "human.a04.elite|human.a04.dungeon": {
    "monsterId": "human.a04.elite",
    "nodeId": "human.a04.dungeon",
    "channels": [
      {
        "id": "main",
        "hitProbability": 0.72,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.05",
            "weight": 1,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "main"
      },
      {
        "id": "gem",
        "hitProbability": 0.00032,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.17",
            "weight": 1,
            "qualityWeights": [
              0,
              0,
              0,
              1
            ]
          }
        ],
        "channel": "gem"
      }
    ]
  },
  "human.a05.normal.1|human.a05.field": {
    "monsterId": "human.a05.normal.1",
    "nodeId": "human.a05.field",
    "channels": [
      {
        "id": "main",
        "hitProbability": 0.72,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.05",
            "weight": 0.375,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.07",
            "weight": 0.25,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.09",
            "weight": 0.375,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "main"
      },
      {
        "id": "gem",
        "hitProbability": 0.00018,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.17",
            "weight": 1,
            "qualityWeights": [
              0,
              0,
              0,
              1
            ]
          }
        ],
        "channel": "gem"
      }
    ]
  },
  "human.a05.normal.1|human.a05.dungeon": {
    "monsterId": "human.a05.normal.1",
    "nodeId": "human.a05.dungeon",
    "channels": [
      {
        "id": "main",
        "hitProbability": 0.72,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.05",
            "weight": 0.375,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.07",
            "weight": 0.25,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.09",
            "weight": 0.375,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "main"
      },
      {
        "id": "gem",
        "hitProbability": 0.00036,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.17",
            "weight": 1,
            "qualityWeights": [
              0,
              0,
              0,
              1
            ]
          }
        ],
        "channel": "gem"
      }
    ]
  },
  "human.a05.normal.2|human.a05.field": {
    "monsterId": "human.a05.normal.2",
    "nodeId": "human.a05.field",
    "channels": [
      {
        "id": "main",
        "hitProbability": 0.72,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.05",
            "weight": 0.375,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.08",
            "weight": 0.25,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.09",
            "weight": 0.375,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "main"
      },
      {
        "id": "gem",
        "hitProbability": 0.00018,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.17",
            "weight": 1,
            "qualityWeights": [
              0,
              0,
              0,
              1
            ]
          }
        ],
        "channel": "gem"
      }
    ]
  },
  "human.a05.normal.2|human.a05.dungeon": {
    "monsterId": "human.a05.normal.2",
    "nodeId": "human.a05.dungeon",
    "channels": [
      {
        "id": "main",
        "hitProbability": 0.72,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.05",
            "weight": 0.375,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.08",
            "weight": 0.25,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.09",
            "weight": 0.375,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "main"
      },
      {
        "id": "gem",
        "hitProbability": 0.00036,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.17",
            "weight": 1,
            "qualityWeights": [
              0,
              0,
              0,
              1
            ]
          }
        ],
        "channel": "gem"
      }
    ]
  },
  "human.a05.normal.3|human.a05.field": {
    "monsterId": "human.a05.normal.3",
    "nodeId": "human.a05.field",
    "channels": [
      {
        "id": "main",
        "hitProbability": 0.72,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.05",
            "weight": 0.375,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.08",
            "weight": 0.25,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.09",
            "weight": 0.375,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "main"
      },
      {
        "id": "gem",
        "hitProbability": 0.00018,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.17",
            "weight": 1,
            "qualityWeights": [
              0,
              0,
              0,
              1
            ]
          }
        ],
        "channel": "gem"
      }
    ]
  },
  "human.a05.normal.3|human.a05.dungeon": {
    "monsterId": "human.a05.normal.3",
    "nodeId": "human.a05.dungeon",
    "channels": [
      {
        "id": "main",
        "hitProbability": 0.72,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.05",
            "weight": 0.375,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.08",
            "weight": 0.25,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.09",
            "weight": 0.375,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "main"
      },
      {
        "id": "gem",
        "hitProbability": 0.00036,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.17",
            "weight": 1,
            "qualityWeights": [
              0,
              0,
              0,
              1
            ]
          }
        ],
        "channel": "gem"
      }
    ]
  },
  "human.a05.elite|human.a05.field": {
    "monsterId": "human.a05.elite",
    "nodeId": "human.a05.field",
    "channels": [
      {
        "id": "main",
        "hitProbability": 0.72,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.05",
            "weight": 0.375,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.08",
            "weight": 0.25,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.09",
            "weight": 0.375,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "main"
      },
      {
        "id": "special",
        "hitProbability": 0.012,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.14",
            "weight": 1,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "special"
      },
      {
        "id": "gem",
        "hitProbability": 0.00018,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.17",
            "weight": 1,
            "qualityWeights": [
              0,
              0,
              0,
              1
            ]
          }
        ],
        "channel": "gem"
      }
    ]
  },
  "human.a05.elite|human.a05.dungeon": {
    "monsterId": "human.a05.elite",
    "nodeId": "human.a05.dungeon",
    "channels": [
      {
        "id": "main",
        "hitProbability": 0.72,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.05",
            "weight": 0.375,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.08",
            "weight": 0.25,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.09",
            "weight": 0.375,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "main"
      },
      {
        "id": "special",
        "hitProbability": 0.035,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.14",
            "weight": 1,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "special"
      },
      {
        "id": "gem",
        "hitProbability": 0.00036,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.17",
            "weight": 1,
            "qualityWeights": [
              0,
              0,
              0,
              1
            ]
          }
        ],
        "channel": "gem"
      }
    ]
  },
  "human.a06.normal.1|human.a06.field": {
    "monsterId": "human.a06.normal.1",
    "nodeId": "human.a06.field",
    "channels": [
      {
        "id": "main",
        "hitProbability": 0.72,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.07",
            "weight": 0.2857142857142857,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.09",
            "weight": 0.42857142857142855,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.10",
            "weight": 0.2857142857142857,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "main"
      },
      {
        "id": "gem",
        "hitProbability": 0.00020000000000000004,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.17",
            "weight": 1,
            "qualityWeights": [
              0,
              0,
              0,
              1
            ]
          }
        ],
        "channel": "gem"
      }
    ]
  },
  "human.a06.normal.1|human.a06.dungeon": {
    "monsterId": "human.a06.normal.1",
    "nodeId": "human.a06.dungeon",
    "channels": [
      {
        "id": "main",
        "hitProbability": 0.72,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.07",
            "weight": 0.2857142857142857,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.09",
            "weight": 0.42857142857142855,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.10",
            "weight": 0.2857142857142857,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "main"
      },
      {
        "id": "gem",
        "hitProbability": 0.0004000000000000001,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.17",
            "weight": 1,
            "qualityWeights": [
              0,
              0,
              0,
              1
            ]
          }
        ],
        "channel": "gem"
      }
    ]
  },
  "human.a06.normal.2|human.a06.field": {
    "monsterId": "human.a06.normal.2",
    "nodeId": "human.a06.field",
    "channels": [
      {
        "id": "main",
        "hitProbability": 0.72,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.08",
            "weight": 0.4,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.09",
            "weight": 0.6,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "main"
      },
      {
        "id": "gem",
        "hitProbability": 0.00020000000000000004,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.17",
            "weight": 1,
            "qualityWeights": [
              0,
              0,
              0,
              1
            ]
          }
        ],
        "channel": "gem"
      }
    ]
  },
  "human.a06.normal.2|human.a06.dungeon": {
    "monsterId": "human.a06.normal.2",
    "nodeId": "human.a06.dungeon",
    "channels": [
      {
        "id": "main",
        "hitProbability": 0.72,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.08",
            "weight": 0.4,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.09",
            "weight": 0.6,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "main"
      },
      {
        "id": "gem",
        "hitProbability": 0.0004000000000000001,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.17",
            "weight": 1,
            "qualityWeights": [
              0,
              0,
              0,
              1
            ]
          }
        ],
        "channel": "gem"
      }
    ]
  },
  "human.a06.normal.3|human.a06.field": {
    "monsterId": "human.a06.normal.3",
    "nodeId": "human.a06.field",
    "channels": [
      {
        "id": "main",
        "hitProbability": 0.72,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.09",
            "weight": 0.6,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.10",
            "weight": 0.4,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "main"
      },
      {
        "id": "gem",
        "hitProbability": 0.00020000000000000004,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.17",
            "weight": 1,
            "qualityWeights": [
              0,
              0,
              0,
              1
            ]
          }
        ],
        "channel": "gem"
      }
    ]
  },
  "human.a06.normal.3|human.a06.dungeon": {
    "monsterId": "human.a06.normal.3",
    "nodeId": "human.a06.dungeon",
    "channels": [
      {
        "id": "main",
        "hitProbability": 0.72,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.09",
            "weight": 0.6,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.10",
            "weight": 0.4,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "main"
      },
      {
        "id": "gem",
        "hitProbability": 0.0004000000000000001,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.17",
            "weight": 1,
            "qualityWeights": [
              0,
              0,
              0,
              1
            ]
          }
        ],
        "channel": "gem"
      }
    ]
  },
  "human.a06.elite|human.a06.field": {
    "monsterId": "human.a06.elite",
    "nodeId": "human.a06.field",
    "channels": [
      {
        "id": "main",
        "hitProbability": 0.72,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.08",
            "weight": 0.4,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.09",
            "weight": 0.6,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "main"
      },
      {
        "id": "special",
        "hitProbability": 0.012,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.14",
            "weight": 1,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "special"
      },
      {
        "id": "gem",
        "hitProbability": 0.00020000000000000004,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.17",
            "weight": 1,
            "qualityWeights": [
              0,
              0,
              0,
              1
            ]
          }
        ],
        "channel": "gem"
      }
    ]
  },
  "human.a06.elite|human.a06.dungeon": {
    "monsterId": "human.a06.elite",
    "nodeId": "human.a06.dungeon",
    "channels": [
      {
        "id": "main",
        "hitProbability": 0.72,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.08",
            "weight": 0.4,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.09",
            "weight": 0.6,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "main"
      },
      {
        "id": "special",
        "hitProbability": 0.035,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.14",
            "weight": 1,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "special"
      },
      {
        "id": "gem",
        "hitProbability": 0.0004000000000000001,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.17",
            "weight": 1,
            "qualityWeights": [
              0,
              0,
              0,
              1
            ]
          }
        ],
        "channel": "gem"
      }
    ]
  },
  "human.a07.normal.1|human.a07.field": {
    "monsterId": "human.a07.normal.1",
    "nodeId": "human.a07.field",
    "channels": [
      {
        "id": "main",
        "hitProbability": 0.72,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.08",
            "weight": 0.4,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.09",
            "weight": 0.6,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "main"
      },
      {
        "id": "gem",
        "hitProbability": 0.00022000000000000003,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.17",
            "weight": 1,
            "qualityWeights": [
              0,
              0,
              0,
              1
            ]
          }
        ],
        "channel": "gem"
      }
    ]
  },
  "human.a07.normal.1|human.a07.dungeon": {
    "monsterId": "human.a07.normal.1",
    "nodeId": "human.a07.dungeon",
    "channels": [
      {
        "id": "main",
        "hitProbability": 0.72,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.08",
            "weight": 0.4,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.09",
            "weight": 0.6,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "main"
      },
      {
        "id": "gem",
        "hitProbability": 0.00044000000000000007,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.17",
            "weight": 1,
            "qualityWeights": [
              0,
              0,
              0,
              1
            ]
          }
        ],
        "channel": "gem"
      }
    ]
  },
  "human.a07.normal.2|human.a07.field": {
    "monsterId": "human.a07.normal.2",
    "nodeId": "human.a07.field",
    "channels": [
      {
        "id": "main",
        "hitProbability": 0.72,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.08",
            "weight": 0.4,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.09",
            "weight": 0.6,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "main"
      },
      {
        "id": "gem",
        "hitProbability": 0.00022000000000000003,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.17",
            "weight": 1,
            "qualityWeights": [
              0,
              0,
              0,
              1
            ]
          }
        ],
        "channel": "gem"
      }
    ]
  },
  "human.a07.normal.2|human.a07.dungeon": {
    "monsterId": "human.a07.normal.2",
    "nodeId": "human.a07.dungeon",
    "channels": [
      {
        "id": "main",
        "hitProbability": 0.72,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.08",
            "weight": 0.4,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.09",
            "weight": 0.6,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "main"
      },
      {
        "id": "gem",
        "hitProbability": 0.00044000000000000007,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.17",
            "weight": 1,
            "qualityWeights": [
              0,
              0,
              0,
              1
            ]
          }
        ],
        "channel": "gem"
      }
    ]
  },
  "human.a07.normal.3|human.a07.field": {
    "monsterId": "human.a07.normal.3",
    "nodeId": "human.a07.field",
    "channels": [
      {
        "id": "main",
        "hitProbability": 0.72,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.09",
            "weight": 0.6,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.10",
            "weight": 0.4,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "main"
      },
      {
        "id": "gem",
        "hitProbability": 0.00022000000000000003,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.17",
            "weight": 1,
            "qualityWeights": [
              0,
              0,
              0,
              1
            ]
          }
        ],
        "channel": "gem"
      }
    ]
  },
  "human.a07.normal.3|human.a07.dungeon": {
    "monsterId": "human.a07.normal.3",
    "nodeId": "human.a07.dungeon",
    "channels": [
      {
        "id": "main",
        "hitProbability": 0.72,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.09",
            "weight": 0.6,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.10",
            "weight": 0.4,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "main"
      },
      {
        "id": "gem",
        "hitProbability": 0.00044000000000000007,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.17",
            "weight": 1,
            "qualityWeights": [
              0,
              0,
              0,
              1
            ]
          }
        ],
        "channel": "gem"
      }
    ]
  },
  "human.a07.elite|human.a07.field": {
    "monsterId": "human.a07.elite",
    "nodeId": "human.a07.field",
    "channels": [
      {
        "id": "main",
        "hitProbability": 0.72,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.08",
            "weight": 0.4,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.09",
            "weight": 0.6,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "main"
      },
      {
        "id": "gem",
        "hitProbability": 0.00022000000000000003,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.17",
            "weight": 1,
            "qualityWeights": [
              0,
              0,
              0,
              1
            ]
          }
        ],
        "channel": "gem"
      }
    ]
  },
  "human.a07.elite|human.a07.dungeon": {
    "monsterId": "human.a07.elite",
    "nodeId": "human.a07.dungeon",
    "channels": [
      {
        "id": "main",
        "hitProbability": 0.72,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.08",
            "weight": 0.4,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.09",
            "weight": 0.6,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "main"
      },
      {
        "id": "gem",
        "hitProbability": 0.00044000000000000007,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.17",
            "weight": 1,
            "qualityWeights": [
              0,
              0,
              0,
              1
            ]
          }
        ],
        "channel": "gem"
      }
    ]
  },
  "human.a08.normal.1|human.a08.field": {
    "monsterId": "human.a08.normal.1",
    "nodeId": "human.a08.field",
    "channels": [
      {
        "id": "main",
        "hitProbability": 0.72,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.10",
            "weight": 0.4,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.12",
            "weight": 0.6,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "main"
      },
      {
        "id": "gem",
        "hitProbability": 0.00024000000000000003,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.17",
            "weight": 1,
            "qualityWeights": [
              0,
              0,
              0,
              1
            ]
          }
        ],
        "channel": "gem"
      }
    ]
  },
  "human.a08.normal.1|human.a08.dungeon": {
    "monsterId": "human.a08.normal.1",
    "nodeId": "human.a08.dungeon",
    "channels": [
      {
        "id": "main",
        "hitProbability": 0.72,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.10",
            "weight": 0.4,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.12",
            "weight": 0.6,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "main"
      },
      {
        "id": "gem",
        "hitProbability": 0.00048000000000000007,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.17",
            "weight": 1,
            "qualityWeights": [
              0,
              0,
              0,
              1
            ]
          }
        ],
        "channel": "gem"
      }
    ]
  },
  "human.a08.normal.2|human.a08.field": {
    "monsterId": "human.a08.normal.2",
    "nodeId": "human.a08.field",
    "channels": [
      {
        "id": "main",
        "hitProbability": 0.72,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.11",
            "weight": 0.4,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.12",
            "weight": 0.6,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "main"
      },
      {
        "id": "special",
        "hitProbability": 0.012,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.15",
            "weight": 1,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "special"
      },
      {
        "id": "gem",
        "hitProbability": 0.00024000000000000003,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.17",
            "weight": 1,
            "qualityWeights": [
              0,
              0,
              0,
              1
            ]
          }
        ],
        "channel": "gem"
      }
    ]
  },
  "human.a08.normal.2|human.a08.dungeon": {
    "monsterId": "human.a08.normal.2",
    "nodeId": "human.a08.dungeon",
    "channels": [
      {
        "id": "main",
        "hitProbability": 0.72,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.11",
            "weight": 0.4,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.12",
            "weight": 0.6,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "main"
      },
      {
        "id": "special",
        "hitProbability": 0.035,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.15",
            "weight": 1,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "special"
      },
      {
        "id": "gem",
        "hitProbability": 0.00048000000000000007,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.17",
            "weight": 1,
            "qualityWeights": [
              0,
              0,
              0,
              1
            ]
          }
        ],
        "channel": "gem"
      }
    ]
  },
  "human.a08.normal.3|human.a08.field": {
    "monsterId": "human.a08.normal.3",
    "nodeId": "human.a08.field",
    "channels": [
      {
        "id": "main",
        "hitProbability": 0.72,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.12",
            "weight": 1,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "main"
      },
      {
        "id": "special",
        "hitProbability": 0.012,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.15",
            "weight": 1,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "special"
      },
      {
        "id": "gem",
        "hitProbability": 0.00024000000000000003,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.17",
            "weight": 1,
            "qualityWeights": [
              0,
              0,
              0,
              1
            ]
          }
        ],
        "channel": "gem"
      }
    ]
  },
  "human.a08.normal.3|human.a08.dungeon": {
    "monsterId": "human.a08.normal.3",
    "nodeId": "human.a08.dungeon",
    "channels": [
      {
        "id": "main",
        "hitProbability": 0.72,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.12",
            "weight": 1,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "main"
      },
      {
        "id": "special",
        "hitProbability": 0.035,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.15",
            "weight": 1,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "special"
      },
      {
        "id": "gem",
        "hitProbability": 0.00048000000000000007,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.17",
            "weight": 1,
            "qualityWeights": [
              0,
              0,
              0,
              1
            ]
          }
        ],
        "channel": "gem"
      }
    ]
  },
  "human.a08.elite|human.a08.field": {
    "monsterId": "human.a08.elite",
    "nodeId": "human.a08.field",
    "channels": [
      {
        "id": "main",
        "hitProbability": 0.72,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.11",
            "weight": 0.4,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.12",
            "weight": 0.6,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "main"
      },
      {
        "id": "special",
        "hitProbability": 0.012,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.15",
            "weight": 1,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "special"
      },
      {
        "id": "gem",
        "hitProbability": 0.00024000000000000003,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.17",
            "weight": 1,
            "qualityWeights": [
              0,
              0,
              0,
              1
            ]
          }
        ],
        "channel": "gem"
      }
    ]
  },
  "human.a08.elite|human.a08.dungeon": {
    "monsterId": "human.a08.elite",
    "nodeId": "human.a08.dungeon",
    "channels": [
      {
        "id": "main",
        "hitProbability": 0.72,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.11",
            "weight": 0.4,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.12",
            "weight": 0.6,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "main"
      },
      {
        "id": "special",
        "hitProbability": 0.035,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.15",
            "weight": 1,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "special"
      },
      {
        "id": "gem",
        "hitProbability": 0.00048000000000000007,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.17",
            "weight": 1,
            "qualityWeights": [
              0,
              0,
              0,
              1
            ]
          }
        ],
        "channel": "gem"
      }
    ]
  },
  "human.a09.normal.1|human.a09.field": {
    "monsterId": "human.a09.normal.1",
    "nodeId": "human.a09.field",
    "channels": [
      {
        "id": "main",
        "hitProbability": 0.72,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.11",
            "weight": 0.4,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.12",
            "weight": 0.6,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "main"
      },
      {
        "id": "special",
        "hitProbability": 0.012,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.15",
            "weight": 0.5,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.16",
            "weight": 0.5,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "special"
      },
      {
        "id": "gem",
        "hitProbability": 0.00026000000000000003,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.17",
            "weight": 1,
            "qualityWeights": [
              0,
              0,
              0,
              1
            ]
          }
        ],
        "channel": "gem"
      }
    ]
  },
  "human.a09.normal.1|human.a09.dungeon": {
    "monsterId": "human.a09.normal.1",
    "nodeId": "human.a09.dungeon",
    "channels": [
      {
        "id": "main",
        "hitProbability": 0.72,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.11",
            "weight": 0.4,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.12",
            "weight": 0.6,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "main"
      },
      {
        "id": "special",
        "hitProbability": 0.035,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.15",
            "weight": 0.5,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.16",
            "weight": 0.5,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "special"
      },
      {
        "id": "gem",
        "hitProbability": 0.0005200000000000001,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.17",
            "weight": 1,
            "qualityWeights": [
              0,
              0,
              0,
              1
            ]
          }
        ],
        "channel": "gem"
      }
    ]
  },
  "human.a09.normal.2|human.a09.field": {
    "monsterId": "human.a09.normal.2",
    "nodeId": "human.a09.field",
    "channels": [
      {
        "id": "main",
        "hitProbability": 0.72,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.12",
            "weight": 1,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "main"
      },
      {
        "id": "special",
        "hitProbability": 0.012,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.15",
            "weight": 0.5,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.16",
            "weight": 0.5,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "special"
      },
      {
        "id": "gem",
        "hitProbability": 0.00026000000000000003,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.17",
            "weight": 1,
            "qualityWeights": [
              0,
              0,
              0,
              1
            ]
          }
        ],
        "channel": "gem"
      }
    ]
  },
  "human.a09.normal.2|human.a09.dungeon": {
    "monsterId": "human.a09.normal.2",
    "nodeId": "human.a09.dungeon",
    "channels": [
      {
        "id": "main",
        "hitProbability": 0.72,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.12",
            "weight": 1,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "main"
      },
      {
        "id": "special",
        "hitProbability": 0.035,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.15",
            "weight": 0.5,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.16",
            "weight": 0.5,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "special"
      },
      {
        "id": "gem",
        "hitProbability": 0.0005200000000000001,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.17",
            "weight": 1,
            "qualityWeights": [
              0,
              0,
              0,
              1
            ]
          }
        ],
        "channel": "gem"
      }
    ]
  },
  "human.a09.normal.3|human.a09.field": {
    "monsterId": "human.a09.normal.3",
    "nodeId": "human.a09.field",
    "channels": [
      {
        "id": "main",
        "hitProbability": 0.72,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.12",
            "weight": 1,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "main"
      },
      {
        "id": "special",
        "hitProbability": 0.012,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.15",
            "weight": 0.5,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.16",
            "weight": 0.5,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "special"
      },
      {
        "id": "gem",
        "hitProbability": 0.00026000000000000003,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.17",
            "weight": 1,
            "qualityWeights": [
              0,
              0,
              0,
              1
            ]
          }
        ],
        "channel": "gem"
      }
    ]
  },
  "human.a09.normal.3|human.a09.dungeon": {
    "monsterId": "human.a09.normal.3",
    "nodeId": "human.a09.dungeon",
    "channels": [
      {
        "id": "main",
        "hitProbability": 0.72,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.12",
            "weight": 1,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "main"
      },
      {
        "id": "special",
        "hitProbability": 0.035,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.15",
            "weight": 0.5,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.16",
            "weight": 0.5,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "special"
      },
      {
        "id": "gem",
        "hitProbability": 0.0005200000000000001,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.17",
            "weight": 1,
            "qualityWeights": [
              0,
              0,
              0,
              1
            ]
          }
        ],
        "channel": "gem"
      }
    ]
  },
  "human.a09.elite|human.a09.field": {
    "monsterId": "human.a09.elite",
    "nodeId": "human.a09.field",
    "channels": [
      {
        "id": "main",
        "hitProbability": 0.72,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.11",
            "weight": 0.4,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.12",
            "weight": 0.6,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "main"
      },
      {
        "id": "special",
        "hitProbability": 0.012,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.15",
            "weight": 0.5,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.16",
            "weight": 0.5,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "special"
      },
      {
        "id": "gem",
        "hitProbability": 0.00026000000000000003,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.17",
            "weight": 1,
            "qualityWeights": [
              0,
              0,
              0,
              1
            ]
          }
        ],
        "channel": "gem"
      }
    ]
  },
  "human.a09.elite|human.a09.dungeon": {
    "monsterId": "human.a09.elite",
    "nodeId": "human.a09.dungeon",
    "channels": [
      {
        "id": "main",
        "hitProbability": 0.72,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.11",
            "weight": 0.4,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.12",
            "weight": 0.6,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "main"
      },
      {
        "id": "special",
        "hitProbability": 0.035,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.15",
            "weight": 0.5,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.16",
            "weight": 0.5,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "special"
      },
      {
        "id": "gem",
        "hitProbability": 0.0005200000000000001,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.17",
            "weight": 1,
            "qualityWeights": [
              0,
              0,
              0,
              1
            ]
          }
        ],
        "channel": "gem"
      }
    ]
  },
  "human.a10.normal.1|human.a10.field": {
    "monsterId": "human.a10.normal.1",
    "nodeId": "human.a10.field",
    "channels": [
      {
        "id": "main",
        "hitProbability": 0.72,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.11",
            "weight": 0.4,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.12",
            "weight": 0.6,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "main"
      },
      {
        "id": "special",
        "hitProbability": 0.012,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.16",
            "weight": 1,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "special"
      },
      {
        "id": "gem",
        "hitProbability": 0.00028000000000000003,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.17",
            "weight": 1,
            "qualityWeights": [
              0,
              0,
              0,
              1
            ]
          }
        ],
        "channel": "gem"
      }
    ]
  },
  "human.a10.normal.1|human.a10.dungeon": {
    "monsterId": "human.a10.normal.1",
    "nodeId": "human.a10.dungeon",
    "channels": [
      {
        "id": "main",
        "hitProbability": 0.72,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.11",
            "weight": 0.4,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.12",
            "weight": 0.6,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "main"
      },
      {
        "id": "special",
        "hitProbability": 0.035,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.16",
            "weight": 1,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "special"
      },
      {
        "id": "gem",
        "hitProbability": 0.0005600000000000001,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.17",
            "weight": 1,
            "qualityWeights": [
              0,
              0,
              0,
              1
            ]
          }
        ],
        "channel": "gem"
      }
    ]
  },
  "human.a10.normal.2|human.a10.field": {
    "monsterId": "human.a10.normal.2",
    "nodeId": "human.a10.field",
    "channels": [
      {
        "id": "main",
        "hitProbability": 0.72,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.12",
            "weight": 1,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "main"
      },
      {
        "id": "special",
        "hitProbability": 0.012,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.16",
            "weight": 1,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "special"
      },
      {
        "id": "gem",
        "hitProbability": 0.00028000000000000003,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.17",
            "weight": 1,
            "qualityWeights": [
              0,
              0,
              0,
              1
            ]
          }
        ],
        "channel": "gem"
      }
    ]
  },
  "human.a10.normal.2|human.a10.dungeon": {
    "monsterId": "human.a10.normal.2",
    "nodeId": "human.a10.dungeon",
    "channels": [
      {
        "id": "main",
        "hitProbability": 0.72,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.12",
            "weight": 1,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "main"
      },
      {
        "id": "special",
        "hitProbability": 0.035,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.16",
            "weight": 1,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "special"
      },
      {
        "id": "gem",
        "hitProbability": 0.0005600000000000001,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.17",
            "weight": 1,
            "qualityWeights": [
              0,
              0,
              0,
              1
            ]
          }
        ],
        "channel": "gem"
      }
    ]
  },
  "human.a10.normal.3|human.a10.field": {
    "monsterId": "human.a10.normal.3",
    "nodeId": "human.a10.field",
    "channels": [
      {
        "id": "main",
        "hitProbability": 0.72,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.11",
            "weight": 0.4,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.12",
            "weight": 0.6,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "main"
      },
      {
        "id": "gem",
        "hitProbability": 0.00028000000000000003,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.17",
            "weight": 1,
            "qualityWeights": [
              0,
              0,
              0,
              1
            ]
          }
        ],
        "channel": "gem"
      }
    ]
  },
  "human.a10.normal.3|human.a10.dungeon": {
    "monsterId": "human.a10.normal.3",
    "nodeId": "human.a10.dungeon",
    "channels": [
      {
        "id": "main",
        "hitProbability": 0.72,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.11",
            "weight": 0.4,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.12",
            "weight": 0.6,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "main"
      },
      {
        "id": "gem",
        "hitProbability": 0.0005600000000000001,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.17",
            "weight": 1,
            "qualityWeights": [
              0,
              0,
              0,
              1
            ]
          }
        ],
        "channel": "gem"
      }
    ]
  },
  "human.a10.elite|human.a10.field": {
    "monsterId": "human.a10.elite",
    "nodeId": "human.a10.field",
    "channels": [
      {
        "id": "main",
        "hitProbability": 0.72,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.11",
            "weight": 0.4,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.12",
            "weight": 0.6,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "main"
      },
      {
        "id": "special",
        "hitProbability": 0.012,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.16",
            "weight": 1,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "special"
      },
      {
        "id": "gem",
        "hitProbability": 0.00028000000000000003,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.17",
            "weight": 1,
            "qualityWeights": [
              0,
              0,
              0,
              1
            ]
          }
        ],
        "channel": "gem"
      }
    ]
  },
  "human.a10.elite|human.a10.dungeon": {
    "monsterId": "human.a10.elite",
    "nodeId": "human.a10.dungeon",
    "channels": [
      {
        "id": "main",
        "hitProbability": 0.72,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.11",
            "weight": 0.4,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.12",
            "weight": 0.6,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "main"
      },
      {
        "id": "special",
        "hitProbability": 0.035,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.16",
            "weight": 1,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "special"
      },
      {
        "id": "gem",
        "hitProbability": 0.0005600000000000001,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.17",
            "weight": 1,
            "qualityWeights": [
              0,
              0,
              0,
              1
            ]
          }
        ],
        "channel": "gem"
      }
    ]
  },
  "human.a03.boss|human.a03.boss": {
    "monsterId": "human.a03.boss",
    "nodeId": "human.a03.boss",
    "channels": [
      {
        "id": "main",
        "hitProbability": 1,
        "quantity": 2,
        "entries": [
          {
            "materialId": "human.mat.02",
            "weight": 0.3,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.04",
            "weight": 0.2,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.05",
            "weight": 0.3,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.06",
            "weight": 0.2,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "main"
      },
      {
        "id": "special",
        "hitProbability": 0.14,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.13",
            "weight": 1,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "special"
      },
      {
        "id": "gem",
        "hitProbability": 0.0007000000000000001,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.17",
            "weight": 1,
            "qualityWeights": [
              0,
              0,
              0,
              1
            ]
          }
        ],
        "channel": "gem"
      }
    ]
  },
  "human.a06.boss|human.a06.boss": {
    "monsterId": "human.a06.boss",
    "nodeId": "human.a06.boss",
    "channels": [
      {
        "id": "main",
        "hitProbability": 1,
        "quantity": 2,
        "entries": [
          {
            "materialId": "human.mat.08",
            "weight": 0.4,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.09",
            "weight": 0.6,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "main"
      },
      {
        "id": "special",
        "hitProbability": 0.14,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.14",
            "weight": 1,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "special"
      },
      {
        "id": "gem",
        "hitProbability": 0.0010000000000000002,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.17",
            "weight": 1,
            "qualityWeights": [
              0,
              0,
              0,
              1
            ]
          }
        ],
        "channel": "gem"
      }
    ]
  },
  "human.a09.boss|human.a09.boss": {
    "monsterId": "human.a09.boss",
    "nodeId": "human.a09.boss",
    "channels": [
      {
        "id": "main",
        "hitProbability": 1,
        "quantity": 2,
        "entries": [
          {
            "materialId": "human.mat.11",
            "weight": 0.4,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.12",
            "weight": 0.6,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "main"
      },
      {
        "id": "special",
        "hitProbability": 0.14,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.15",
            "weight": 0.5,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          },
          {
            "materialId": "human.mat.16",
            "weight": 0.5,
            "qualityWeights": [
              0.75,
              0.2,
              0.045,
              0.005
            ]
          }
        ],
        "channel": "special"
      },
      {
        "id": "gem",
        "hitProbability": 0.0013000000000000002,
        "quantity": 1,
        "entries": [
          {
            "materialId": "human.mat.17",
            "weight": 1,
            "qualityWeights": [
              0,
              0,
              0,
              1
            ]
          }
        ],
        "channel": "gem"
      }
    ]
  }
};
export const HUMAN_MONSTERS={
  "human.a01.normal.1": {
    "id": "human.a01.normal.1",
    "name": "棘背幼兽",
    "area": 1,
    "rank": "normal",
    "nodes": [
      "human.a01.field",
      "human.a01.dungeon"
    ],
    "elementTags": [],
    "skills": [
      {
        "id": "human.a01.normal.1:0",
        "name": "棘角冲撞",
        "cooldownMs": 8000,
        "firstAtMs": 3500,
        "castMs": 0,
        "effects": [
          {
            "type": "damage",
            "coefficient": 1.1,
            "damageType": "physical",
            "powerBasis": "atk"
          },
          {
            "type": "dot",
            "damageType": "physical",
            "powerBasis": "atk",
            "coefficientPerSecond": 0.08,
            "seconds": 4,
            "refresh": "same_skill",
            "mitigation": "armor_only"
          }
        ],
        "trigger": null,
        "maxCasts": null
      }
    ],
    "trait": null
  },
  "human.a01.normal.2": {
    "id": "human.a01.normal.2",
    "name": "割穗盗兵",
    "area": 1,
    "rank": "normal",
    "nodes": [
      "human.a01.field",
      "human.a01.dungeon"
    ],
    "elementTags": [],
    "skills": [
      {
        "id": "human.a01.normal.2:0",
        "name": "割穗横斩",
        "cooldownMs": 9200,
        "firstAtMs": 4300,
        "castMs": 0,
        "effects": [
          {
            "type": "damage",
            "coefficient": 1.2000000000000002,
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
  "human.a01.normal.3": {
    "id": "human.a01.normal.3",
    "name": "麦秆行尸",
    "area": 1,
    "rank": "normal",
    "nodes": [
      "human.a01.field",
      "human.a01.dungeon"
    ],
    "elementTags": [],
    "skills": [
      {
        "id": "human.a01.normal.3:0",
        "name": "缠脚荆枝",
        "cooldownMs": 10400,
        "firstAtMs": 5100,
        "castMs": 0,
        "effects": [
          {
            "type": "damage",
            "coefficient": 1.3,
            "damageType": "physical",
            "powerBasis": "atk"
          },
          {
            "type": "next_basic_slow",
            "multiplier": 1.15,
            "charges": 1
          }
        ],
        "trigger": null,
        "maxCasts": null
      }
    ],
    "trait": null
  },
  "human.a01.elite": {
    "id": "human.a01.elite",
    "name": "田垄劫掠头目",
    "area": 1,
    "rank": "elite",
    "nodes": [
      "human.a01.field",
      "human.a01.dungeon"
    ],
    "elementTags": [],
    "skills": [
      {
        "id": "human.a01.elite:0",
        "name": "精锐破阵斩",
        "cooldownMs": 11600,
        "firstAtMs": 5900,
        "castMs": 1100,
        "effects": [
          {
            "type": "damage",
            "coefficient": 1.65,
            "damageType": "physical",
            "powerBasis": "atk"
          },
          {
            "type": "shield",
            "fraction": 0.08,
            "seconds": 5
          }
        ],
        "trigger": null,
        "maxCasts": null
      }
    ],
    "trait": {
      "type": "openingShield",
      "fraction": 0.08,
      "durationMs": 5000
    }
  },
  "human.a02.normal.1": {
    "id": "human.a02.normal.1",
    "name": "驿道棘兽",
    "area": 2,
    "rank": "normal",
    "nodes": [
      "human.a02.field",
      "human.a02.dungeon"
    ],
    "elementTags": [],
    "skills": [
      {
        "id": "human.a02.normal.1:0",
        "name": "刺背扑袭",
        "cooldownMs": 8000,
        "firstAtMs": 3500,
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
  "human.a02.normal.2": {
    "id": "human.a02.normal.2",
    "name": "断辕刀客",
    "area": 2,
    "rank": "normal",
    "nodes": [
      "human.a02.field",
      "human.a02.dungeon"
    ],
    "elementTags": [],
    "skills": [
      {
        "id": "human.a02.normal.2:0",
        "name": "断辕快刀",
        "cooldownMs": 9200,
        "firstAtMs": 4300,
        "castMs": 0,
        "effects": [
          {
            "type": "damage",
            "coefficient": 1.2000000000000002,
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
  "human.a02.normal.3": {
    "id": "human.a02.normal.3",
    "name": "风蓟稻卫",
    "area": 2,
    "rank": "normal",
    "nodes": [
      "human.a02.field",
      "human.a02.dungeon"
    ],
    "elementTags": [],
    "skills": [
      {
        "id": "human.a02.normal.3:0",
        "name": "风蓟飞刺",
        "cooldownMs": 10400,
        "firstAtMs": 5100,
        "castMs": 0,
        "effects": [
          {
            "type": "damage",
            "coefficient": 1.3,
            "damageType": "physical",
            "powerBasis": "atk"
          },
          {
            "type": "next_basic_slow",
            "multiplier": 1.15,
            "charges": 1
          }
        ],
        "trigger": null,
        "maxCasts": null
      }
    ],
    "trait": null
  },
  "human.a02.elite": {
    "id": "human.a02.elite",
    "name": "蒙面驿路队长",
    "area": 2,
    "rank": "elite",
    "nodes": [
      "human.a02.field",
      "human.a02.dungeon"
    ],
    "elementTags": [],
    "skills": [
      {
        "id": "human.a02.elite:0",
        "name": "精锐破阵斩",
        "cooldownMs": 11600,
        "firstAtMs": 5900,
        "castMs": 1100,
        "effects": [
          {
            "type": "damage",
            "coefficient": 1.65,
            "damageType": "physical",
            "powerBasis": "atk"
          },
          {
            "type": "shield",
            "fraction": 0.08,
            "seconds": 5
          }
        ],
        "trigger": null,
        "maxCasts": null
      }
    ],
    "trait": {
      "type": "openingShield",
      "fraction": 0.08,
      "durationMs": 5000
    }
  },
  "human.a03.normal.1": {
    "id": "human.a03.normal.1",
    "name": "丘陵棘兽",
    "area": 3,
    "rank": "normal",
    "nodes": [
      "human.a03.field",
      "human.a03.dungeon"
    ],
    "elementTags": [],
    "skills": [
      {
        "id": "human.a03.normal.1:0",
        "name": "裂蹄冲撞",
        "cooldownMs": 8000,
        "firstAtMs": 3500,
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
  "human.a03.normal.2": {
    "id": "human.a03.normal.2",
    "name": "裂钟侍从",
    "area": 3,
    "rank": "normal",
    "nodes": [
      "human.a03.field",
      "human.a03.dungeon"
    ],
    "elementTags": [],
    "skills": [
      {
        "id": "human.a03.normal.2:0",
        "name": "礼钟轻敲",
        "cooldownMs": 9200,
        "firstAtMs": 4300,
        "castMs": 0,
        "effects": [
          {
            "type": "damage",
            "coefficient": 1.2000000000000002,
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
  "human.a03.normal.3": {
    "id": "human.a03.normal.3",
    "name": "盐泉石蟹",
    "area": 3,
    "rank": "normal",
    "nodes": [
      "human.a03.field",
      "human.a03.dungeon"
    ],
    "elementTags": [
      "light"
    ],
    "skills": [
      {
        "id": "human.a03.normal.3:0",
        "name": "盐壳夹击",
        "cooldownMs": 10400,
        "firstAtMs": 5100,
        "castMs": 0,
        "effects": [
          {
            "type": "damage",
            "coefficient": 1.3,
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
  "human.a03.elite": {
    "id": "human.a03.elite",
    "name": "无声礼钟卫",
    "area": 3,
    "rank": "elite",
    "nodes": [
      "human.a03.field",
      "human.a03.dungeon"
    ],
    "elementTags": [],
    "skills": [
      {
        "id": "human.a03.elite:0",
        "name": "精锐破阵斩",
        "cooldownMs": 11600,
        "firstAtMs": 5900,
        "castMs": 1100,
        "effects": [
          {
            "type": "damage",
            "coefficient": 1.65,
            "damageType": "physical",
            "powerBasis": "atk"
          },
          {
            "type": "shield",
            "fraction": 0.08,
            "seconds": 5
          }
        ],
        "trigger": null,
        "maxCasts": null
      }
    ],
    "trait": {
      "type": "openingShield",
      "fraction": 0.08,
      "durationMs": 5000
    }
  },
  "human.a04.normal.1": {
    "id": "human.a04.normal.1",
    "name": "赤鬃幼兽",
    "area": 4,
    "rank": "normal",
    "nodes": [
      "human.a04.field",
      "human.a04.dungeon"
    ],
    "elementTags": [],
    "skills": [
      {
        "id": "human.a04.normal.1:0",
        "name": "赤鬃扑咬",
        "cooldownMs": 8000,
        "firstAtMs": 3500,
        "castMs": 0,
        "effects": [
          {
            "type": "damage",
            "coefficient": 1.1,
            "damageType": "physical",
            "powerBasis": "atk"
          },
          {
            "type": "dot",
            "damageType": "physical",
            "powerBasis": "atk",
            "coefficientPerSecond": 0.08,
            "seconds": 4,
            "refresh": "same_skill",
            "mitigation": "armor_only"
          }
        ],
        "trigger": null,
        "maxCasts": null
      }
    ],
    "trait": null
  },
  "human.a04.normal.2": {
    "id": "human.a04.normal.2",
    "name": "盐壳蟹",
    "area": 4,
    "rank": "normal",
    "nodes": [
      "human.a04.field",
      "human.a04.dungeon"
    ],
    "elementTags": [],
    "skills": [
      {
        "id": "human.a04.normal.2:0",
        "name": "盐沫喷吐",
        "cooldownMs": 9200,
        "firstAtMs": 4300,
        "castMs": 0,
        "effects": [
          {
            "type": "damage",
            "coefficient": 1.2000000000000002,
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
  "human.a04.normal.3": {
    "id": "human.a04.normal.3",
    "name": "烛脂行卫",
    "area": 4,
    "rank": "normal",
    "nodes": [
      "human.a04.field",
      "human.a04.dungeon"
    ],
    "elementTags": [
      "light"
    ],
    "skills": [
      {
        "id": "human.a04.normal.3:0",
        "name": "烛脂敲击",
        "cooldownMs": 10400,
        "firstAtMs": 5100,
        "castMs": 0,
        "effects": [
          {
            "type": "damage",
            "coefficient": 1.3,
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
  "human.a04.elite": {
    "id": "human.a04.elite",
    "name": "盐泉重甲卫",
    "area": 4,
    "rank": "elite",
    "nodes": [
      "human.a04.field",
      "human.a04.dungeon"
    ],
    "elementTags": [],
    "skills": [
      {
        "id": "human.a04.elite:0",
        "name": "精锐破阵斩",
        "cooldownMs": 11600,
        "firstAtMs": 5900,
        "castMs": 1100,
        "effects": [
          {
            "type": "damage",
            "coefficient": 1.65,
            "damageType": "physical",
            "powerBasis": "atk"
          },
          {
            "type": "shield",
            "fraction": 0.08,
            "seconds": 5
          }
        ],
        "trigger": null,
        "maxCasts": null
      }
    ],
    "trait": {
      "type": "openingShield",
      "fraction": 0.08,
      "durationMs": 5000
    }
  },
  "human.a05.normal.1": {
    "id": "human.a05.normal.1",
    "name": "赤鬃猎兽",
    "area": 5,
    "rank": "normal",
    "nodes": [
      "human.a05.field",
      "human.a05.dungeon"
    ],
    "elementTags": [],
    "skills": [
      {
        "id": "human.a05.normal.1:0",
        "name": "猎兽撕咬",
        "cooldownMs": 8000,
        "firstAtMs": 3500,
        "castMs": 0,
        "effects": [
          {
            "type": "damage",
            "coefficient": 1.1,
            "damageType": "physical",
            "powerBasis": "atk"
          },
          {
            "type": "dot",
            "damageType": "physical",
            "powerBasis": "atk",
            "coefficientPerSecond": 0.08,
            "seconds": 4,
            "refresh": "same_skill",
            "mitigation": "armor_only"
          }
        ],
        "trigger": null,
        "maxCasts": null
      }
    ],
    "trait": null
  },
  "human.a05.normal.2": {
    "id": "human.a05.normal.2",
    "name": "烛林遗兵",
    "area": 5,
    "rank": "normal",
    "nodes": [
      "human.a05.field",
      "human.a05.dungeon"
    ],
    "elementTags": [],
    "skills": [
      {
        "id": "human.a05.normal.2:0",
        "name": "余誓突刺",
        "cooldownMs": 9200,
        "firstAtMs": 4300,
        "castMs": 0,
        "effects": [
          {
            "type": "damage",
            "coefficient": 1.2000000000000002,
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
  "human.a05.normal.3": {
    "id": "human.a05.normal.3",
    "name": "余烬采掠者",
    "area": 5,
    "rank": "normal",
    "nodes": [
      "human.a05.field",
      "human.a05.dungeon"
    ],
    "elementTags": [
      "light"
    ],
    "skills": [
      {
        "id": "human.a05.normal.3:0",
        "name": "椒烟散射",
        "cooldownMs": 10400,
        "firstAtMs": 5100,
        "castMs": 0,
        "effects": [
          {
            "type": "damage",
            "coefficient": 1.3,
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
  "human.a05.elite": {
    "id": "human.a05.elite",
    "name": "血誓巡骑",
    "area": 5,
    "rank": "elite",
    "nodes": [
      "human.a05.field",
      "human.a05.dungeon"
    ],
    "elementTags": [],
    "skills": [
      {
        "id": "human.a05.elite:0",
        "name": "精锐破阵斩",
        "cooldownMs": 11600,
        "firstAtMs": 5900,
        "castMs": 1100,
        "effects": [
          {
            "type": "damage",
            "coefficient": 1.65,
            "damageType": "physical",
            "powerBasis": "atk"
          },
          {
            "type": "shield",
            "fraction": 0.08,
            "seconds": 5
          }
        ],
        "trigger": null,
        "maxCasts": null
      }
    ],
    "trait": {
      "type": "openingShield",
      "fraction": 0.08,
      "durationMs": 5000
    }
  },
  "human.a06.normal.1": {
    "id": "human.a06.normal.1",
    "name": "赤鬃战兽",
    "area": 6,
    "rank": "normal",
    "nodes": [
      "human.a06.field",
      "human.a06.dungeon"
    ],
    "elementTags": [],
    "skills": [
      {
        "id": "human.a06.normal.1:0",
        "name": "战兽践踏",
        "cooldownMs": 8000,
        "firstAtMs": 3500,
        "castMs": 0,
        "effects": [
          {
            "type": "damage",
            "coefficient": 1.1,
            "damageType": "physical",
            "powerBasis": "atk"
          },
          {
            "type": "dot",
            "damageType": "physical",
            "powerBasis": "atk",
            "coefficientPerSecond": 0.08,
            "seconds": 4,
            "refresh": "same_skill",
            "mitigation": "armor_only"
          }
        ],
        "trigger": null,
        "maxCasts": null
      }
    ],
    "trait": null
  },
  "human.a06.normal.2": {
    "id": "human.a06.normal.2",
    "name": "断旗枪兵",
    "area": 6,
    "rank": "normal",
    "nodes": [
      "human.a06.field",
      "human.a06.dungeon"
    ],
    "elementTags": [],
    "skills": [
      {
        "id": "human.a06.normal.2:0",
        "name": "断旗贯枪",
        "cooldownMs": 9200,
        "firstAtMs": 4300,
        "castMs": 0,
        "effects": [
          {
            "type": "damage",
            "coefficient": 1.2000000000000002,
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
  "human.a06.normal.3": {
    "id": "human.a06.normal.3",
    "name": "拾骨夜鸦",
    "area": 6,
    "rank": "normal",
    "nodes": [
      "human.a06.field",
      "human.a06.dungeon"
    ],
    "elementTags": [
      "fire"
    ],
    "skills": [
      {
        "id": "human.a06.normal.3:0",
        "name": "鸦群啄击",
        "cooldownMs": 10400,
        "firstAtMs": 5100,
        "castMs": 0,
        "effects": [
          {
            "type": "damage",
            "coefficient": 1.3,
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
  "human.a06.elite": {
    "id": "human.a06.elite",
    "name": "断旗黑骑",
    "area": 6,
    "rank": "elite",
    "nodes": [
      "human.a06.field",
      "human.a06.dungeon"
    ],
    "elementTags": [],
    "skills": [
      {
        "id": "human.a06.elite:0",
        "name": "精锐破阵斩",
        "cooldownMs": 11600,
        "firstAtMs": 5900,
        "castMs": 1100,
        "effects": [
          {
            "type": "damage",
            "coefficient": 1.65,
            "damageType": "physical",
            "powerBasis": "atk"
          },
          {
            "type": "shield",
            "fraction": 0.08,
            "seconds": 5
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
      "name": "断旗枪兵",
      "followerMonsterId": "human.a06.normal.2"
    }
  },
  "human.a07.normal.1": {
    "id": "human.a07.normal.1",
    "name": "关隘枪兵",
    "area": 7,
    "rank": "normal",
    "nodes": [
      "human.a07.field",
      "human.a07.dungeon"
    ],
    "elementTags": [],
    "skills": [
      {
        "id": "human.a07.normal.1:0",
        "name": "关门突刺",
        "cooldownMs": 8000,
        "firstAtMs": 3500,
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
  "human.a07.normal.2": {
    "id": "human.a07.normal.2",
    "name": "余烬守卒",
    "area": 7,
    "rank": "normal",
    "nodes": [
      "human.a07.field",
      "human.a07.dungeon"
    ],
    "elementTags": [],
    "skills": [
      {
        "id": "human.a07.normal.2:0",
        "name": "余烬投火",
        "cooldownMs": 9200,
        "firstAtMs": 4300,
        "castMs": 0,
        "effects": [
          {
            "type": "damage",
            "coefficient": 1.2000000000000002,
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
  "human.a07.normal.3": {
    "id": "human.a07.normal.3",
    "name": "裂翼夜鸦",
    "area": 7,
    "rank": "normal",
    "nodes": [
      "human.a07.field",
      "human.a07.dungeon"
    ],
    "elementTags": [
      "fire"
    ],
    "skills": [
      {
        "id": "human.a07.normal.3:0",
        "name": "裂翼旋袭",
        "cooldownMs": 10400,
        "firstAtMs": 5100,
        "castMs": 0,
        "effects": [
          {
            "type": "damage",
            "coefficient": 1.3,
            "damageType": "fire",
            "powerBasis": "elementalPower"
          },
          {
            "type": "next_basic_slow",
            "multiplier": 1.15,
            "charges": 1
          }
        ],
        "trigger": null,
        "maxCasts": null
      }
    ],
    "trait": null
  },
  "human.a07.elite": {
    "id": "human.a07.elite",
    "name": "失守关门长",
    "area": 7,
    "rank": "elite",
    "nodes": [
      "human.a07.field",
      "human.a07.dungeon"
    ],
    "elementTags": [],
    "skills": [
      {
        "id": "human.a07.elite:0",
        "name": "精锐破阵斩",
        "cooldownMs": 11600,
        "firstAtMs": 5900,
        "castMs": 1100,
        "effects": [
          {
            "type": "damage",
            "coefficient": 1.65,
            "damageType": "physical",
            "powerBasis": "atk"
          },
          {
            "type": "shield",
            "fraction": 0.08,
            "seconds": 5
          }
        ],
        "trigger": null,
        "maxCasts": null
      }
    ],
    "trait": {
      "type": "openingShield",
      "fraction": 0.08,
      "durationMs": 5000
    }
  },
  "human.a08.normal.1": {
    "id": "human.a08.normal.1",
    "name": "高地夜鸦",
    "area": 8,
    "rank": "normal",
    "nodes": [
      "human.a08.field",
      "human.a08.dungeon"
    ],
    "elementTags": [],
    "skills": [
      {
        "id": "human.a08.normal.1:0",
        "name": "夜羽啄刺",
        "cooldownMs": 8000,
        "firstAtMs": 3500,
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
  "human.a08.normal.2": {
    "id": "human.a08.normal.2",
    "name": "石髓翼卫",
    "area": 8,
    "rank": "normal",
    "nodes": [
      "human.a08.field",
      "human.a08.dungeon"
    ],
    "elementTags": [],
    "skills": [
      {
        "id": "human.a08.normal.2:0",
        "name": "石翼重击",
        "cooldownMs": 9200,
        "firstAtMs": 4300,
        "castMs": 0,
        "effects": [
          {
            "type": "damage",
            "coefficient": 1.2000000000000002,
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
  "human.a08.normal.3": {
    "id": "human.a08.normal.3",
    "name": "逆灯侍从",
    "area": 8,
    "rank": "normal",
    "nodes": [
      "human.a08.field",
      "human.a08.dungeon"
    ],
    "elementTags": [
      "fire"
    ],
    "skills": [
      {
        "id": "human.a08.normal.3:0",
        "name": "逆灯微光",
        "cooldownMs": 10400,
        "firstAtMs": 5100,
        "castMs": 0,
        "effects": [
          {
            "type": "damage",
            "coefficient": 1.3,
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
  "human.a08.elite": {
    "id": "human.a08.elite",
    "name": "夜鸦黑刃卫",
    "area": 8,
    "rank": "elite",
    "nodes": [
      "human.a08.field",
      "human.a08.dungeon"
    ],
    "elementTags": [],
    "skills": [
      {
        "id": "human.a08.elite:0",
        "name": "精锐破阵斩",
        "cooldownMs": 11600,
        "firstAtMs": 5900,
        "castMs": 1100,
        "effects": [
          {
            "type": "damage",
            "coefficient": 1.65,
            "damageType": "physical",
            "powerBasis": "atk"
          },
          {
            "type": "shield",
            "fraction": 0.08,
            "seconds": 5
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
      "name": "高地夜鸦",
      "followerMonsterId": "human.a08.normal.1"
    }
  },
  "human.a09.normal.1": {
    "id": "human.a09.normal.1",
    "name": "王垒石卫",
    "area": 9,
    "rank": "normal",
    "nodes": [
      "human.a09.field",
      "human.a09.dungeon"
    ],
    "elementTags": [],
    "skills": [
      {
        "id": "human.a09.normal.1:0",
        "name": "石垒盾击",
        "cooldownMs": 8000,
        "firstAtMs": 3500,
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
  "human.a09.normal.2": {
    "id": "human.a09.normal.2",
    "name": "银籽守尸",
    "area": 9,
    "rank": "normal",
    "nodes": [
      "human.a09.field",
      "human.a09.dungeon"
    ],
    "elementTags": [],
    "skills": [
      {
        "id": "human.a09.normal.2:0",
        "name": "银穗缠根",
        "cooldownMs": 9200,
        "firstAtMs": 4300,
        "castMs": 0,
        "effects": [
          {
            "type": "damage",
            "coefficient": 1.2000000000000002,
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
  "human.a09.normal.3": {
    "id": "human.a09.normal.3",
    "name": "逆光持灯者",
    "area": 9,
    "rank": "normal",
    "nodes": [
      "human.a09.field",
      "human.a09.dungeon"
    ],
    "elementTags": [
      "dark"
    ],
    "skills": [
      {
        "id": "human.a09.normal.3:0",
        "name": "逆光照射",
        "cooldownMs": 10400,
        "firstAtMs": 5100,
        "castMs": 0,
        "effects": [
          {
            "type": "damage",
            "coefficient": 1.3,
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
  "human.a09.elite": {
    "id": "human.a09.elite",
    "name": "旧王近卫",
    "area": 9,
    "rank": "elite",
    "nodes": [
      "human.a09.field",
      "human.a09.dungeon"
    ],
    "elementTags": [],
    "skills": [
      {
        "id": "human.a09.elite:0",
        "name": "精锐破阵斩",
        "cooldownMs": 11600,
        "firstAtMs": 5900,
        "castMs": 1100,
        "effects": [
          {
            "type": "damage",
            "coefficient": 1.65,
            "damageType": "physical",
            "powerBasis": "atk"
          },
          {
            "type": "shield",
            "fraction": 0.08,
            "seconds": 5
          }
        ],
        "trigger": null,
        "maxCasts": null
      }
    ],
    "trait": {
      "type": "openingShield",
      "fraction": 0.08,
      "durationMs": 5000
    }
  },
  "human.a10.normal.1": {
    "id": "human.a10.normal.1",
    "name": "荒庭石像",
    "area": 10,
    "rank": "normal",
    "nodes": [
      "human.a10.field",
      "human.a10.dungeon"
    ],
    "elementTags": [],
    "skills": [
      {
        "id": "human.a10.normal.1:0",
        "name": "荒庭崩拳",
        "cooldownMs": 8000,
        "firstAtMs": 3500,
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
  "human.a10.normal.2": {
    "id": "human.a10.normal.2",
    "name": "银穗枯卫",
    "area": 10,
    "rank": "normal",
    "nodes": [
      "human.a10.field",
      "human.a10.dungeon"
    ],
    "elementTags": [],
    "skills": [
      {
        "id": "human.a10.normal.2:0",
        "name": "枯穗缠绕",
        "cooldownMs": 9200,
        "firstAtMs": 4300,
        "castMs": 0,
        "effects": [
          {
            "type": "damage",
            "coefficient": 1.2000000000000002,
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
  "human.a10.normal.3": {
    "id": "human.a10.normal.3",
    "name": "无冠巡卫",
    "area": 10,
    "rank": "normal",
    "nodes": [
      "human.a10.field",
      "human.a10.dungeon"
    ],
    "elementTags": [
      "dark"
    ],
    "skills": [
      {
        "id": "human.a10.normal.3:0",
        "name": "无冠断斩",
        "cooldownMs": 10400,
        "firstAtMs": 5100,
        "castMs": 0,
        "effects": [
          {
            "type": "damage",
            "coefficient": 1.3,
            "damageType": "dark",
            "powerBasis": "elementalPower"
          },
          {
            "type": "next_basic_slow",
            "multiplier": 1.15,
            "charges": 1
          }
        ],
        "trigger": null,
        "maxCasts": null
      }
    ],
    "trait": null
  },
  "human.a10.elite": {
    "id": "human.a10.elite",
    "name": "荒冠执剑者",
    "area": 10,
    "rank": "elite",
    "nodes": [
      "human.a10.field",
      "human.a10.dungeon"
    ],
    "elementTags": [],
    "skills": [
      {
        "id": "human.a10.elite:0",
        "name": "精锐破阵斩",
        "cooldownMs": 11600,
        "firstAtMs": 5900,
        "castMs": 1100,
        "effects": [
          {
            "type": "damage",
            "coefficient": 1.65,
            "damageType": "physical",
            "powerBasis": "atk"
          },
          {
            "type": "shield",
            "fraction": 0.08,
            "seconds": 5
          }
        ],
        "trigger": null,
        "maxCasts": null
      }
    ],
    "trait": {
      "type": "openingShield",
      "fraction": 0.08,
      "durationMs": 5000
    }
  },
  "human.a03.boss": {
    "id": "human.a03.boss",
    "name": "裂钟司祭 · 赫伦",
    "area": 3,
    "rank": "boss",
    "nodes": [
      "human.a03.boss"
    ],
    "elementTags": [
      "light"
    ],
    "skills": [
      {
        "id": "human.a03.boss:0",
        "name": "裂钟震响",
        "effects": [
          {
            "type": "damage",
            "coefficient": 1.6,
            "damageType": "light",
            "powerBasis": "elementalPower"
          }
        ],
        "castMs": 1500,
        "cooldownMs": 12000,
        "firstAtMs": 6000,
        "trigger": null,
        "maxCasts": null
      },
      {
        "id": "human.a03.boss:1",
        "name": "静默敲击",
        "effects": [
          {
            "type": "damage",
            "coefficient": 1.3,
            "damageType": "physical",
            "powerBasis": "atk"
          },
          {
            "type": "next_basic_slow",
            "multiplier": 1.2,
            "charges": 1
          }
        ],
        "castMs": 900,
        "cooldownMs": 17000,
        "firstAtMs": 11000,
        "trigger": null,
        "maxCasts": null
      },
      {
        "id": "human.a03.boss:2",
        "name": "钟壁残光",
        "effects": [
          {
            "type": "shield",
            "fraction": 0.12,
            "seconds": 7
          }
        ],
        "castMs": 800,
        "cooldownMs": 22000,
        "firstAtMs": 16000,
        "trigger": "hp_below_50_once",
        "maxCasts": 1
      }
    ],
    "trait": null
  },
  "human.a06.boss": {
    "id": "human.a06.boss",
    "name": "断旗统领 · 罗德",
    "area": 6,
    "rank": "boss",
    "nodes": [
      "human.a06.boss"
    ],
    "elementTags": [],
    "skills": [
      {
        "id": "human.a06.boss:0",
        "name": "断旗重斩",
        "effects": [
          {
            "type": "damage",
            "coefficient": 1.85,
            "damageType": "physical",
            "powerBasis": "atk"
          },
          {
            "type": "dot",
            "damageType": "physical",
            "powerBasis": "atk",
            "coefficientPerSecond": 0.08,
            "seconds": 4,
            "refresh": "same_skill",
            "mitigation": "armor_only"
          }
        ],
        "castMs": 1500,
        "cooldownMs": 12000,
        "firstAtMs": 6000,
        "trigger": null,
        "maxCasts": null
      },
      {
        "id": "human.a06.boss:1",
        "name": "血誓突进",
        "effects": [
          {
            "type": "damage",
            "coefficient": 1.35,
            "damageType": "physical",
            "powerBasis": "atk"
          },
          {
            "type": "lifesteal",
            "fraction": 0.2,
            "perActionCap": 0.025,
            "encounterCap": 0.12
          }
        ],
        "castMs": 900,
        "cooldownMs": 17000,
        "firstAtMs": 11000,
        "trigger": null,
        "maxCasts": null
      },
      {
        "id": "human.a06.boss:2",
        "name": "最后军旗",
        "effects": [
          {
            "type": "shield",
            "fraction": 0.1,
            "seconds": 8
          }
        ],
        "castMs": 800,
        "cooldownMs": 22000,
        "firstAtMs": 16000,
        "trigger": "hp_below_50_once",
        "maxCasts": 1
      }
    ],
    "trait": null
  },
  "human.a09.boss": {
    "id": "human.a09.boss",
    "name": "旧王守垒者 · 艾德兰",
    "area": 9,
    "rank": "boss",
    "nodes": [
      "human.a09.boss"
    ],
    "elementTags": [
      "light"
    ],
    "skills": [
      {
        "id": "human.a09.boss:0",
        "name": "王垒断剑",
        "effects": [
          {
            "type": "damage",
            "coefficient": 1.9,
            "damageType": "physical",
            "powerBasis": "atk"
          }
        ],
        "castMs": 1600,
        "cooldownMs": 12000,
        "firstAtMs": 6000,
        "trigger": null,
        "maxCasts": null
      },
      {
        "id": "human.a09.boss:1",
        "name": "逆光盾锋",
        "effects": [
          {
            "type": "damage",
            "coefficient": 1.15,
            "damageType": "light",
            "powerBasis": "elementalPower"
          },
          {
            "type": "reflect",
            "coefficient": 0.35,
            "damageType": "light",
            "powerBasis": "elementalPower",
            "seconds": 5,
            "charges": 1,
            "requiresHpDamage": true,
            "recursive": false
          }
        ],
        "castMs": 1100,
        "cooldownMs": 17000,
        "firstAtMs": 11000,
        "trigger": null,
        "maxCasts": null
      },
      {
        "id": "human.a09.boss:2",
        "name": "荒庭守誓",
        "effects": [
          {
            "type": "shield",
            "fraction": 0.12,
            "seconds": 8
          }
        ],
        "castMs": 900,
        "cooldownMs": 22000,
        "firstAtMs": 16000,
        "trigger": "hp_below_50_once",
        "maxCasts": 1
      }
    ],
    "trait": {
      "type": "followers",
      "shares": [
        0.55,
        0.15,
        0.15,
        0.15
      ],
      "name": "王垒石卫",
      "followerMonsterId": "human.a09.normal.1"
    }
  }
};
export const HUMAN_MONSTER_SPRITES={
  "human.a01.normal.1": 0,
  "human.a01.normal.2": 1,
  "human.a01.normal.3": 2,
  "human.a01.elite": 9,
  "human.a02.normal.1": 0,
  "human.a02.normal.2": 1,
  "human.a02.normal.3": 2,
  "human.a02.elite": 9,
  "human.a03.normal.1": 0,
  "human.a03.normal.2": 5,
  "human.a03.normal.3": 3,
  "human.a03.elite": 5,
  "human.a04.normal.1": 4,
  "human.a04.normal.2": 3,
  "human.a04.normal.3": 5,
  "human.a04.elite": 8,
  "human.a05.normal.1": 4,
  "human.a05.normal.2": 6,
  "human.a05.normal.3": 1,
  "human.a05.elite": 9,
  "human.a06.normal.1": 4,
  "human.a06.normal.2": 6,
  "human.a06.normal.3": 7,
  "human.a06.elite": 9,
  "human.a07.normal.1": 6,
  "human.a07.normal.2": 1,
  "human.a07.normal.3": 7,
  "human.a07.elite": 9,
  "human.a08.normal.1": 7,
  "human.a08.normal.2": 8,
  "human.a08.normal.3": 5,
  "human.a08.elite": 9,
  "human.a09.normal.1": 8,
  "human.a09.normal.2": 2,
  "human.a09.normal.3": 5,
  "human.a09.elite": 11,
  "human.a10.normal.1": 8,
  "human.a10.normal.2": 2,
  "human.a10.normal.3": 6,
  "human.a10.elite": 11,
  "human.a03.boss": 10,
  "human.a06.boss": 9,
  "human.a09.boss": 11
};
export const HUMAN_PARAMETERS={
  "id": "human-initial-calibration-v1",
  "reviewed": true,
  "testOnly": false,
  "status": "initial-budget-reviewed-matched-host-evidence",
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
  ],
  "fieldGroupChance": 0.04,
  "monsters": {
    "human.a01.normal.1": {
      "hp": 600,
      "atk": 3,
      "armor": 12,
      "elementalPower": 2,
      "basicIntervalMs": 2300,
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
    "human.a01.normal.2": {
      "hp": 450,
      "atk": 2,
      "armor": 8,
      "elementalPower": 2,
      "basicIntervalMs": 2100,
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
    "human.a01.normal.3": {
      "hp": 780,
      "atk": 4,
      "armor": 16,
      "elementalPower": 2,
      "basicIntervalMs": 2500,
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
    "human.a01.elite": {
      "hp": 1287,
      "atk": 5,
      "armor": 16,
      "elementalPower": 2,
      "basicIntervalMs": 2500,
      "rewardGold": 4,
      "rewardXp": 26,
      "elementResistance": {
        "earth": 12,
        "water": 3,
        "fire": 3,
        "wind": 3,
        "light": 3,
        "dark": 3
      }
    },
    "human.a02.normal.1": {
      "hp": 1100,
      "atk": 3,
      "armor": 19,
      "elementalPower": 2,
      "basicIntervalMs": 2300,
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
    "human.a02.normal.2": {
      "hp": 850,
      "atk": 2,
      "armor": 13,
      "elementalPower": 2,
      "basicIntervalMs": 2100,
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
    "human.a02.normal.3": {
      "hp": 1430,
      "atk": 4,
      "armor": 26,
      "elementalPower": 2,
      "basicIntervalMs": 2500,
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
    "human.a02.elite": {
      "hp": 2360,
      "atk": 5,
      "armor": 26,
      "elementalPower": 2,
      "basicIntervalMs": 2500,
      "rewardGold": 5,
      "rewardXp": 32,
      "elementResistance": {
        "earth": 15,
        "water": 4,
        "fire": 4,
        "wind": 4,
        "light": 4,
        "dark": 4
      }
    },
    "human.a03.normal.1": {
      "hp": 1800,
      "atk": 5,
      "armor": 26,
      "elementalPower": 3,
      "basicIntervalMs": 2300,
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
    "human.a03.normal.2": {
      "hp": 1440,
      "atk": 4,
      "armor": 18,
      "elementalPower": 3,
      "basicIntervalMs": 2100,
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
    "human.a03.normal.3": {
      "hp": 2340,
      "atk": 6,
      "armor": 36,
      "elementalPower": 3,
      "basicIntervalMs": 2500,
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
    "human.a03.elite": {
      "hp": 3861,
      "atk": 8,
      "armor": 36,
      "elementalPower": 3,
      "basicIntervalMs": 2500,
      "rewardGold": 5,
      "rewardXp": 38,
      "elementResistance": {
        "earth": 18,
        "water": 5,
        "fire": 5,
        "wind": 5,
        "light": 18,
        "dark": 5
      }
    },
    "human.a04.normal.1": {
      "hp": 2380,
      "atk": 4,
      "armor": 28,
      "elementalPower": 2,
      "basicIntervalMs": 2300,
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
    "human.a04.normal.2": {
      "hp": 1918,
      "atk": 4,
      "armor": 19,
      "elementalPower": 2,
      "basicIntervalMs": 2100,
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
    "human.a04.normal.3": {
      "hp": 3076,
      "atk": 5,
      "armor": 39,
      "elementalPower": 2,
      "basicIntervalMs": 2500,
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
    "human.a04.elite": {
      "hp": 5075,
      "atk": 6,
      "armor": 39,
      "elementalPower": 2,
      "basicIntervalMs": 2500,
      "rewardGold": 6,
      "rewardXp": 45,
      "elementResistance": {
        "earth": 20,
        "water": 6,
        "fire": 20,
        "wind": 6,
        "light": 6,
        "dark": 6
      }
    },
    "human.a05.normal.1": {
      "hp": 2989,
      "atk": 7,
      "armor": 30,
      "elementalPower": 3,
      "basicIntervalMs": 2300,
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
    "human.a05.normal.2": {
      "hp": 2406,
      "atk": 5,
      "armor": 21,
      "elementalPower": 3,
      "basicIntervalMs": 2100,
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
    "human.a05.normal.3": {
      "hp": 3839,
      "atk": 8,
      "armor": 42,
      "elementalPower": 3,
      "basicIntervalMs": 2500,
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
    "human.a05.elite": {
      "hp": 6334,
      "atk": 10,
      "armor": 42,
      "elementalPower": 3,
      "basicIntervalMs": 2500,
      "rewardGold": 6,
      "rewardXp": 51,
      "elementResistance": {
        "earth": 21,
        "water": 7,
        "fire": 7,
        "wind": 7,
        "light": 7,
        "dark": 7
      }
    },
    "human.a06.normal.1": {
      "hp": 3740,
      "atk": 9,
      "armor": 32,
      "elementalPower": 4,
      "basicIntervalMs": 2300,
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
    "human.a06.normal.2": {
      "hp": 3031,
      "atk": 7,
      "armor": 22,
      "elementalPower": 4,
      "basicIntervalMs": 2100,
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
    "human.a06.normal.3": {
      "hp": 4777,
      "atk": 11,
      "armor": 45,
      "elementalPower": 4,
      "basicIntervalMs": 2500,
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
    "human.a06.elite": {
      "hp": 7882,
      "atk": 14,
      "armor": 45,
      "elementalPower": 4,
      "basicIntervalMs": 2500,
      "rewardGold": 7,
      "rewardXp": 58,
      "elementResistance": {
        "earth": 22,
        "water": 8,
        "fire": 22,
        "wind": 8,
        "light": 8,
        "dark": 8
      }
    },
    "human.a07.normal.1": {
      "hp": 4609,
      "atk": 15,
      "armor": 34,
      "elementalPower": 5,
      "basicIntervalMs": 2300,
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
    "human.a07.normal.2": {
      "hp": 3732,
      "atk": 12,
      "armor": 24,
      "elementalPower": 5,
      "basicIntervalMs": 2100,
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
    "human.a07.normal.3": {
      "hp": 5856,
      "atk": 18,
      "armor": 48,
      "elementalPower": 5,
      "basicIntervalMs": 2500,
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
    "human.a07.elite": {
      "hp": 9662,
      "atk": 23,
      "armor": 48,
      "elementalPower": 5,
      "basicIntervalMs": 2500,
      "rewardGold": 7,
      "rewardXp": 64,
      "elementResistance": {
        "earth": 24,
        "water": 9,
        "fire": 9,
        "wind": 9,
        "light": 24,
        "dark": 9
      }
    },
    "human.a08.normal.1": {
      "hp": 4558,
      "atk": 17,
      "armor": 25,
      "elementalPower": 6,
      "basicIntervalMs": 2300,
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
    "human.a08.normal.2": {
      "hp": 5591,
      "atk": 21,
      "armor": 36,
      "elementalPower": 6,
      "basicIntervalMs": 2100,
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
    "human.a08.normal.3": {
      "hp": 7114,
      "atk": 25,
      "armor": 50,
      "elementalPower": 6,
      "basicIntervalMs": 2500,
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
    "human.a08.elite": {
      "hp": 11738,
      "atk": 31,
      "armor": 50,
      "elementalPower": 6,
      "basicIntervalMs": 2500,
      "rewardGold": 8,
      "rewardXp": 70,
      "elementResistance": {
        "earth": 25,
        "water": 10,
        "fire": 10,
        "wind": 10,
        "light": 10,
        "dark": 10
      }
    },
    "human.a09.normal.1": {
      "hp": 6809,
      "atk": 29,
      "armor": 38,
      "elementalPower": 7,
      "basicIntervalMs": 2300,
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
    "human.a09.normal.2": {
      "hp": 5544,
      "atk": 24,
      "armor": 27,
      "elementalPower": 7,
      "basicIntervalMs": 2100,
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
    "human.a09.normal.3": {
      "hp": 8618,
      "atk": 36,
      "armor": 53,
      "elementalPower": 7,
      "basicIntervalMs": 2500,
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
    "human.a09.elite": {
      "hp": 14220,
      "atk": 45,
      "armor": 53,
      "elementalPower": 7,
      "basicIntervalMs": 2500,
      "rewardGold": 8,
      "rewardXp": 77,
      "elementResistance": {
        "earth": 26,
        "water": 10,
        "fire": 10,
        "wind": 10,
        "light": 26,
        "dark": 10
      }
    },
    "human.a10.normal.1": {
      "hp": 8182,
      "atk": 43,
      "armor": 41,
      "elementalPower": 9,
      "basicIntervalMs": 2300,
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
    "human.a10.normal.2": {
      "hp": 6753,
      "atk": 34,
      "armor": 28,
      "elementalPower": 9,
      "basicIntervalMs": 2100,
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
    "human.a10.normal.3": {
      "hp": 10377,
      "atk": 51,
      "armor": 56,
      "elementalPower": 9,
      "basicIntervalMs": 2500,
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
    "human.a10.elite": {
      "hp": 17122,
      "atk": 64,
      "armor": 56,
      "elementalPower": 9,
      "basicIntervalMs": 2500,
      "rewardGold": 9,
      "rewardXp": 83,
      "elementResistance": {
        "earth": 27,
        "water": 27,
        "fire": 11,
        "wind": 11,
        "light": 11,
        "dark": 11
      }
    },
    "human.a03.boss": {
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
    "human.a06.boss": {
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
    "human.a09.boss": {
      "hp": 52711,
      "atk": 921,
      "armor": 71,
      "elementalPower": 152,
      "basicIntervalMs": 2200,
      "rewardGold": 90,
      "rewardXp": 624,
      "elementResistance": {
        "earth": 11,
        "water": 27,
        "fire": 11,
        "wind": 11,
        "light": 27,
        "dark": 11
      }
    }
  },
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
  "controlReduction": {
    "normal": 0,
    "elite": 0.2,
    "boss": 0.4
  },
  "interruptStopMs": 1100
};