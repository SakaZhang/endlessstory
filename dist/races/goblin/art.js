export const art = {
  "hero": {
    "frameSize": [
      192,
      192
    ],
    "anchor": [
      96,
      176
    ],
    "facing": "left",
    "frames": [
      {
        "id": "idle-0",
        "file": "races/goblin/assets/hero-0.png",
        "durationMs": 120,
        "facing": "left",
        "alphaBBox": [
          31,
          26,
          161,
          176
        ],
        "sourceCrop": [
          0,
          0,
          181,
          194
        ]
      },
      {
        "id": "idle-1",
        "file": "races/goblin/assets/hero-1.png",
        "durationMs": 120,
        "facing": "left",
        "alphaBBox": [
          30,
          26,
          162,
          176
        ],
        "sourceCrop": [
          181,
          0,
          362,
          194
        ]
      },
      {
        "id": "ready",
        "file": "races/goblin/assets/hero-2.png",
        "durationMs": 120,
        "facing": "left",
        "alphaBBox": [
          26,
          29,
          166,
          176
        ],
        "sourceCrop": [
          362,
          0,
          543,
          194
        ]
      },
      {
        "id": "step",
        "file": "races/goblin/assets/hero-3.png",
        "durationMs": 120,
        "facing": "left",
        "alphaBBox": [
          24,
          25,
          169,
          176
        ],
        "sourceCrop": [
          543,
          0,
          724,
          194
        ]
      },
      {
        "id": "anticipation",
        "file": "races/goblin/assets/hero-4.png",
        "durationMs": 120,
        "facing": "left",
        "alphaBBox": [
          21,
          23,
          171,
          176
        ],
        "sourceCrop": [
          724,
          0,
          905,
          194
        ]
      },
      {
        "id": "attack",
        "file": "races/goblin/assets/hero-5.png",
        "durationMs": 120,
        "facing": "left",
        "alphaBBox": [
          14,
          34,
          178,
          176
        ],
        "sourceCrop": [
          905,
          0,
          1086,
          194
        ]
      },
      {
        "id": "hurt",
        "file": "races/goblin/assets/hero-6.png",
        "durationMs": 120,
        "facing": "left",
        "alphaBBox": [
          14,
          34,
          178,
          176
        ],
        "sourceCrop": [
          1086,
          0,
          1267,
          194
        ]
      },
      {
        "id": "recover",
        "file": "races/goblin/assets/hero-7.png",
        "durationMs": 120,
        "facing": "left",
        "alphaBBox": [
          25,
          26,
          168,
          176
        ],
        "sourceCrop": [
          1267,
          0,
          1448,
          194
        ]
      },
      {
        "id": "death",
        "file": "races/goblin/assets/hero-death.png",
        "durationMs": 240,
        "facing": "left",
        "alphaBBox": [
          14,
          102,
          178,
          176
        ]
      }
    ],
    "sourceAtlas": "978b344c-caf7-45f6-982b-f78f878eab61",
    "sourceRow": 0,
    "animations": {
      "idle": [
        "idle-0",
        "idle-1"
      ],
      "attack": [
        "anticipation",
        "attack",
        "recover"
      ],
      "hurt": [
        "hurt"
      ],
      "move": [
        "ready",
        "step"
      ],
      "anticipation": [
        "anticipation"
      ],
      "recovery": [
        "recover"
      ],
      "death": [
        "death"
      ]
    }
  },
  "monsters": {
    "goblin.a01.normal.1": {
      "frameSize": [
        192,
        192
      ],
      "anchor": [
        96,
        176
      ],
      "facing": "left",
      "frames": [
        {
          "id": "idle-0",
          "file": "races/goblin/assets/a01-normal-1-0.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            21,
            64,
            171,
            176
          ],
          "sourceCrop": [
            0,
            194,
            198,
            351
          ]
        },
        {
          "id": "idle-1",
          "file": "races/goblin/assets/a01-normal-1-1.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            30,
            61,
            163,
            176
          ],
          "sourceCrop": [
            198,
            194,
            372,
            351
          ]
        },
        {
          "id": "ready",
          "file": "races/goblin/assets/a01-normal-1-2.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            20,
            70,
            172,
            176
          ],
          "sourceCrop": [
            372,
            194,
            563,
            351
          ]
        },
        {
          "id": "step",
          "file": "races/goblin/assets/a01-normal-1-3.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            31,
            68,
            161,
            176
          ],
          "sourceCrop": [
            563,
            194,
            716,
            351
          ]
        },
        {
          "id": "anticipation",
          "file": "races/goblin/assets/a01-normal-1-4.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            14,
            55,
            178,
            176
          ],
          "sourceCrop": [
            716,
            194,
            909,
            351
          ]
        },
        {
          "id": "attack",
          "file": "races/goblin/assets/a01-normal-1-5.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            16,
            78,
            177,
            176
          ],
          "sourceCrop": [
            909,
            194,
            1098,
            351
          ]
        },
        {
          "id": "hurt",
          "file": "races/goblin/assets/a01-normal-1-6.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            20,
            77,
            173,
            176
          ],
          "sourceCrop": [
            1098,
            194,
            1278,
            351
          ]
        },
        {
          "id": "recover",
          "file": "races/goblin/assets/a01-normal-1-7.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            33,
            69,
            160,
            176
          ],
          "sourceCrop": [
            1278,
            194,
            1448,
            351
          ]
        },
        {
          "id": "death",
          "file": "races/goblin/assets/a01-normal-1-death.png",
          "durationMs": 240,
          "facing": "left",
          "alphaBBox": [
            14,
            107,
            178,
            176
          ]
        }
      ],
      "sourceAtlas": "978b344c-caf7-45f6-982b-f78f878eab61",
      "sourceRow": 1,
      "animations": {
        "idle": [
          "idle-0",
          "idle-1"
        ],
        "attack": [
          "anticipation",
          "attack",
          "recover"
        ],
        "hurt": [
          "hurt"
        ],
        "move": [
          "ready",
          "step"
        ],
        "anticipation": [
          "anticipation"
        ],
        "recovery": [
          "recover"
        ],
        "death": [
          "death"
        ]
      }
    },
    "goblin.a01.normal.2": {
      "frameSize": [
        192,
        192
      ],
      "anchor": [
        96,
        176
      ],
      "facing": "left",
      "frames": [
        {
          "id": "idle-0",
          "file": "races/goblin/assets/a01-normal-2-0.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            22,
            50,
            170,
            176
          ],
          "sourceCrop": [
            0,
            351,
            191,
            515
          ]
        },
        {
          "id": "idle-1",
          "file": "races/goblin/assets/a01-normal-2-1.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            26,
            50,
            166,
            176
          ],
          "sourceCrop": [
            191,
            351,
            373,
            515
          ]
        },
        {
          "id": "ready",
          "file": "races/goblin/assets/a01-normal-2-2.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            22,
            50,
            171,
            176
          ],
          "sourceCrop": [
            373,
            351,
            563,
            515
          ]
        },
        {
          "id": "step",
          "file": "races/goblin/assets/a01-normal-2-3.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            29,
            51,
            163,
            176
          ],
          "sourceCrop": [
            563,
            351,
            734,
            515
          ]
        },
        {
          "id": "anticipation",
          "file": "races/goblin/assets/a01-normal-2-4.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            28,
            46,
            164,
            176
          ],
          "sourceCrop": [
            734,
            351,
            906,
            515
          ]
        },
        {
          "id": "attack",
          "file": "races/goblin/assets/a01-normal-2-5.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            14,
            52,
            178,
            176
          ],
          "sourceCrop": [
            906,
            351,
            1110,
            515
          ]
        },
        {
          "id": "hurt",
          "file": "races/goblin/assets/a01-normal-2-6.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            23,
            62,
            169,
            176
          ],
          "sourceCrop": [
            1110,
            351,
            1277,
            515
          ]
        },
        {
          "id": "recover",
          "file": "races/goblin/assets/a01-normal-2-7.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            32,
            51,
            161,
            176
          ],
          "sourceCrop": [
            1277,
            351,
            1448,
            515
          ]
        },
        {
          "id": "death",
          "file": "races/goblin/assets/a01-normal-2-death.png",
          "durationMs": 240,
          "facing": "left",
          "alphaBBox": [
            14,
            78,
            178,
            176
          ]
        }
      ],
      "sourceAtlas": "978b344c-caf7-45f6-982b-f78f878eab61",
      "sourceRow": 2,
      "animations": {
        "idle": [
          "idle-0",
          "idle-1"
        ],
        "attack": [
          "anticipation",
          "attack",
          "recover"
        ],
        "hurt": [
          "hurt"
        ],
        "move": [
          "ready",
          "step"
        ],
        "anticipation": [
          "anticipation"
        ],
        "recovery": [
          "recover"
        ],
        "death": [
          "death"
        ]
      }
    },
    "goblin.a04.normal.1": {
      "frameSize": [
        192,
        192
      ],
      "anchor": [
        96,
        176
      ],
      "facing": "left",
      "frames": [
        {
          "id": "idle-0",
          "file": "races/goblin/assets/a04-normal-1-0.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            17,
            84,
            175,
            176
          ],
          "sourceCrop": [
            0,
            515,
            191,
            638
          ]
        },
        {
          "id": "idle-1",
          "file": "races/goblin/assets/a04-normal-1-1.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            16,
            85,
            177,
            176
          ],
          "sourceCrop": [
            191,
            515,
            381,
            638
          ]
        },
        {
          "id": "ready",
          "file": "races/goblin/assets/a04-normal-1-2.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            17,
            84,
            176,
            176
          ],
          "sourceCrop": [
            381,
            515,
            567,
            638
          ]
        },
        {
          "id": "step",
          "file": "races/goblin/assets/a04-normal-1-3.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            14,
            84,
            178,
            176
          ],
          "sourceCrop": [
            567,
            515,
            748,
            638
          ]
        },
        {
          "id": "anticipation",
          "file": "races/goblin/assets/a04-normal-1-4.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            20,
            75,
            173,
            176
          ],
          "sourceCrop": [
            748,
            515,
            917,
            638
          ]
        },
        {
          "id": "attack",
          "file": "races/goblin/assets/a04-normal-1-5.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            16,
            71,
            177,
            176
          ],
          "sourceCrop": [
            917,
            515,
            1095,
            638
          ]
        },
        {
          "id": "hurt",
          "file": "races/goblin/assets/a04-normal-1-6.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            21,
            89,
            171,
            176
          ],
          "sourceCrop": [
            1095,
            515,
            1273,
            638
          ]
        },
        {
          "id": "recover",
          "file": "races/goblin/assets/a04-normal-1-7.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            23,
            85,
            169,
            176
          ],
          "sourceCrop": [
            1273,
            515,
            1448,
            638
          ]
        },
        {
          "id": "death",
          "file": "races/goblin/assets/a04-normal-1-death.png",
          "durationMs": 240,
          "facing": "left",
          "alphaBBox": [
            14,
            113,
            178,
            176
          ]
        }
      ],
      "sourceAtlas": "978b344c-caf7-45f6-982b-f78f878eab61",
      "sourceRow": 3,
      "animations": {
        "idle": [
          "idle-0",
          "idle-1"
        ],
        "attack": [
          "anticipation",
          "attack",
          "recover"
        ],
        "hurt": [
          "hurt"
        ],
        "move": [
          "ready",
          "step"
        ],
        "anticipation": [
          "anticipation"
        ],
        "recovery": [
          "recover"
        ],
        "death": [
          "death"
        ]
      }
    },
    "goblin.a01.normal.3": {
      "frameSize": [
        192,
        192
      ],
      "anchor": [
        96,
        176
      ],
      "facing": "left",
      "frames": [
        {
          "id": "idle-0",
          "file": "races/goblin/assets/a01-normal-3-0.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            32,
            22,
            160,
            176
          ],
          "sourceCrop": [
            0,
            638,
            181,
            835
          ]
        },
        {
          "id": "idle-1",
          "file": "races/goblin/assets/a01-normal-3-1.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            34,
            22,
            159,
            176
          ],
          "sourceCrop": [
            181,
            638,
            362,
            835
          ]
        },
        {
          "id": "ready",
          "file": "races/goblin/assets/a01-normal-3-2.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            35,
            40,
            158,
            176
          ],
          "sourceCrop": [
            362,
            638,
            536,
            835
          ]
        },
        {
          "id": "step",
          "file": "races/goblin/assets/a01-normal-3-3.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            33,
            27,
            159,
            176
          ],
          "sourceCrop": [
            536,
            638,
            713,
            835
          ]
        },
        {
          "id": "anticipation",
          "file": "races/goblin/assets/a01-normal-3-4.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            32,
            30,
            161,
            176
          ],
          "sourceCrop": [
            713,
            638,
            889,
            835
          ]
        },
        {
          "id": "attack",
          "file": "races/goblin/assets/a01-normal-3-5.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            14,
            38,
            178,
            176
          ],
          "sourceCrop": [
            889,
            638,
            1108,
            835
          ]
        },
        {
          "id": "hurt",
          "file": "races/goblin/assets/a01-normal-3-6.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            35,
            50,
            158,
            176
          ],
          "sourceCrop": [
            1108,
            638,
            1279,
            835
          ]
        },
        {
          "id": "recover",
          "file": "races/goblin/assets/a01-normal-3-7.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            38,
            34,
            155,
            176
          ],
          "sourceCrop": [
            1279,
            638,
            1448,
            835
          ]
        },
        {
          "id": "death",
          "file": "races/goblin/assets/a01-normal-3-death.png",
          "durationMs": 240,
          "facing": "left",
          "alphaBBox": [
            14,
            95,
            178,
            176
          ]
        }
      ],
      "sourceAtlas": "978b344c-caf7-45f6-982b-f78f878eab61",
      "sourceRow": 4,
      "animations": {
        "idle": [
          "idle-0",
          "idle-1"
        ],
        "attack": [
          "anticipation",
          "attack",
          "recover"
        ],
        "hurt": [
          "hurt"
        ],
        "move": [
          "ready",
          "step"
        ],
        "anticipation": [
          "anticipation"
        ],
        "recovery": [
          "recover"
        ],
        "death": [
          "death"
        ]
      }
    },
    "goblin.a03.normal.2": {
      "frameSize": [
        192,
        192
      ],
      "anchor": [
        96,
        176
      ],
      "facing": "left",
      "frames": [
        {
          "id": "idle-0",
          "file": "races/goblin/assets/a03-normal-2-0.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            41,
            16,
            152,
            176
          ],
          "sourceCrop": [
            0,
            835,
            188,
            1086
          ]
        },
        {
          "id": "idle-1",
          "file": "races/goblin/assets/a03-normal-2-1.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            42,
            16,
            150,
            176
          ],
          "sourceCrop": [
            188,
            835,
            368,
            1086
          ]
        },
        {
          "id": "ready",
          "file": "races/goblin/assets/a03-normal-2-2.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            36,
            28,
            156,
            176
          ],
          "sourceCrop": [
            368,
            835,
            567,
            1086
          ]
        },
        {
          "id": "step",
          "file": "races/goblin/assets/a03-normal-2-3.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            48,
            16,
            144,
            176
          ],
          "sourceCrop": [
            567,
            835,
            722,
            1086
          ]
        },
        {
          "id": "anticipation",
          "file": "races/goblin/assets/a03-normal-2-4.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            33,
            16,
            160,
            176
          ],
          "sourceCrop": [
            722,
            835,
            911,
            1086
          ]
        },
        {
          "id": "attack",
          "file": "races/goblin/assets/a03-normal-2-5.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            34,
            30,
            158,
            176
          ],
          "sourceCrop": [
            911,
            835,
            1095,
            1086
          ]
        },
        {
          "id": "hurt",
          "file": "races/goblin/assets/a03-normal-2-6.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            30,
            46,
            162,
            176
          ],
          "sourceCrop": [
            1095,
            835,
            1291,
            1086
          ]
        },
        {
          "id": "recover",
          "file": "races/goblin/assets/a03-normal-2-7.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            46,
            24,
            147,
            176
          ],
          "sourceCrop": [
            1291,
            835,
            1448,
            1086
          ]
        },
        {
          "id": "death",
          "file": "races/goblin/assets/a03-normal-2-death.png",
          "durationMs": 240,
          "facing": "left",
          "alphaBBox": [
            14,
            107,
            178,
            176
          ]
        }
      ],
      "sourceAtlas": "978b344c-caf7-45f6-982b-f78f878eab61",
      "sourceRow": 5,
      "animations": {
        "idle": [
          "idle-0",
          "idle-1"
        ],
        "attack": [
          "anticipation",
          "attack",
          "recover"
        ],
        "hurt": [
          "hurt"
        ],
        "move": [
          "ready",
          "step"
        ],
        "anticipation": [
          "anticipation"
        ],
        "recovery": [
          "recover"
        ],
        "death": [
          "death"
        ]
      }
    },
    "goblin.a03.boss": {
      "frameSize": [
        192,
        192
      ],
      "anchor": [
        96,
        176
      ],
      "facing": "left",
      "frames": [
        {
          "id": "idle-0",
          "file": "races/goblin/assets/a03-boss-0.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            30,
            16,
            163,
            176
          ],
          "sourceCrop": [
            0,
            0,
            183,
            227
          ]
        },
        {
          "id": "idle-1",
          "file": "races/goblin/assets/a03-boss-1.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            30,
            16,
            162,
            176
          ],
          "sourceCrop": [
            183,
            0,
            364,
            227
          ]
        },
        {
          "id": "ready",
          "file": "races/goblin/assets/a03-boss-2.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            33,
            23,
            160,
            176
          ],
          "sourceCrop": [
            364,
            0,
            546,
            227
          ]
        },
        {
          "id": "step",
          "file": "races/goblin/assets/a03-boss-3.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            31,
            23,
            161,
            176
          ],
          "sourceCrop": [
            546,
            0,
            724,
            227
          ]
        },
        {
          "id": "anticipation",
          "file": "races/goblin/assets/a03-boss-4.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            34,
            23,
            158,
            176
          ],
          "sourceCrop": [
            724,
            0,
            900,
            227
          ]
        },
        {
          "id": "attack",
          "file": "races/goblin/assets/a03-boss-5.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            29,
            18,
            163,
            176
          ],
          "sourceCrop": [
            900,
            0,
            1081,
            227
          ]
        },
        {
          "id": "hurt",
          "file": "races/goblin/assets/a03-boss-6.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            31,
            28,
            161,
            176
          ],
          "sourceCrop": [
            1081,
            0,
            1267,
            227
          ]
        },
        {
          "id": "recover",
          "file": "races/goblin/assets/a03-boss-7.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            31,
            17,
            161,
            176
          ],
          "sourceCrop": [
            1267,
            0,
            1448,
            227
          ]
        },
        {
          "id": "death",
          "file": "races/goblin/assets/a03-boss-death.png",
          "durationMs": 240,
          "facing": "left",
          "alphaBBox": [
            14,
            95,
            178,
            176
          ]
        }
      ],
      "sourceAtlas": "cf6674f7-29c2-4d8e-8abb-def3efac2dda",
      "sourceRow": 0,
      "animations": {
        "idle": [
          "idle-0",
          "idle-1"
        ],
        "attack": [
          "anticipation",
          "attack",
          "recover"
        ],
        "hurt": [
          "hurt"
        ],
        "move": [
          "ready",
          "step"
        ],
        "anticipation": [
          "anticipation"
        ],
        "recovery": [
          "recover"
        ],
        "death": [
          "death"
        ]
      }
    },
    "goblin.a06.boss": {
      "frameSize": [
        192,
        192
      ],
      "anchor": [
        96,
        176
      ],
      "facing": "left",
      "frames": [
        {
          "id": "idle-0",
          "file": "races/goblin/assets/a06-boss-0.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            27,
            41,
            166,
            176
          ],
          "sourceCrop": [
            0,
            227,
            180,
            410
          ]
        },
        {
          "id": "idle-1",
          "file": "races/goblin/assets/a06-boss-1.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            28,
            38,
            165,
            176
          ],
          "sourceCrop": [
            180,
            227,
            361,
            410
          ]
        },
        {
          "id": "ready",
          "file": "races/goblin/assets/a06-boss-2.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            27,
            37,
            166,
            176
          ],
          "sourceCrop": [
            361,
            227,
            539,
            410
          ]
        },
        {
          "id": "step",
          "file": "races/goblin/assets/a06-boss-3.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            27,
            46,
            166,
            176
          ],
          "sourceCrop": [
            539,
            227,
            721,
            410
          ]
        },
        {
          "id": "anticipation",
          "file": "races/goblin/assets/a06-boss-4.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            29,
            37,
            164,
            176
          ],
          "sourceCrop": [
            721,
            227,
            893,
            410
          ]
        },
        {
          "id": "attack",
          "file": "races/goblin/assets/a06-boss-5.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            14,
            53,
            178,
            176
          ],
          "sourceCrop": [
            893,
            227,
            1099,
            410
          ]
        },
        {
          "id": "hurt",
          "file": "races/goblin/assets/a06-boss-6.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            31,
            43,
            162,
            176
          ],
          "sourceCrop": [
            1099,
            227,
            1269,
            410
          ]
        },
        {
          "id": "recover",
          "file": "races/goblin/assets/a06-boss-7.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            31,
            54,
            162,
            176
          ],
          "sourceCrop": [
            1269,
            227,
            1448,
            410
          ]
        },
        {
          "id": "death",
          "file": "races/goblin/assets/a06-boss-death.png",
          "durationMs": 240,
          "facing": "left",
          "alphaBBox": [
            14,
            90,
            178,
            176
          ]
        }
      ],
      "sourceAtlas": "cf6674f7-29c2-4d8e-8abb-def3efac2dda",
      "sourceRow": 1,
      "animations": {
        "idle": [
          "idle-0",
          "idle-1"
        ],
        "attack": [
          "anticipation",
          "attack",
          "recover"
        ],
        "hurt": [
          "hurt"
        ],
        "move": [
          "ready",
          "step"
        ],
        "anticipation": [
          "anticipation"
        ],
        "recovery": [
          "recover"
        ],
        "death": [
          "death"
        ]
      }
    },
    "goblin.a09.boss": {
      "frameSize": [
        192,
        192
      ],
      "anchor": [
        96,
        176
      ],
      "facing": "left",
      "frames": [
        {
          "id": "idle-0",
          "file": "races/goblin/assets/a09-boss-0.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            34,
            22,
            158,
            176
          ],
          "sourceCrop": [
            0,
            410,
            180,
            632
          ]
        },
        {
          "id": "idle-1",
          "file": "races/goblin/assets/a09-boss-1.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            34,
            22,
            159,
            176
          ],
          "sourceCrop": [
            180,
            410,
            361,
            632
          ]
        },
        {
          "id": "ready",
          "file": "races/goblin/assets/a09-boss-2.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            34,
            34,
            159,
            176
          ],
          "sourceCrop": [
            361,
            410,
            546,
            632
          ]
        },
        {
          "id": "step",
          "file": "races/goblin/assets/a09-boss-3.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            34,
            37,
            158,
            176
          ],
          "sourceCrop": [
            546,
            410,
            722,
            632
          ]
        },
        {
          "id": "anticipation",
          "file": "races/goblin/assets/a09-boss-4.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            36,
            27,
            156,
            176
          ],
          "sourceCrop": [
            722,
            410,
            885,
            632
          ]
        },
        {
          "id": "attack",
          "file": "races/goblin/assets/a09-boss-5.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            14,
            28,
            178,
            176
          ],
          "sourceCrop": [
            885,
            410,
            1105,
            632
          ]
        },
        {
          "id": "hurt",
          "file": "races/goblin/assets/a09-boss-6.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            36,
            26,
            156,
            176
          ],
          "sourceCrop": [
            1105,
            410,
            1268,
            632
          ]
        },
        {
          "id": "recover",
          "file": "races/goblin/assets/a09-boss-7.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            36,
            30,
            157,
            176
          ],
          "sourceCrop": [
            1268,
            410,
            1448,
            632
          ]
        },
        {
          "id": "death",
          "file": "races/goblin/assets/a09-boss-death.png",
          "durationMs": 240,
          "facing": "left",
          "alphaBBox": [
            14,
            97,
            178,
            176
          ]
        }
      ],
      "sourceAtlas": "cf6674f7-29c2-4d8e-8abb-def3efac2dda",
      "sourceRow": 2,
      "animations": {
        "idle": [
          "idle-0",
          "idle-1"
        ],
        "attack": [
          "anticipation",
          "attack",
          "recover"
        ],
        "hurt": [
          "hurt"
        ],
        "move": [
          "ready",
          "step"
        ],
        "anticipation": [
          "anticipation"
        ],
        "recovery": [
          "recover"
        ],
        "death": [
          "death"
        ]
      }
    },
    "goblin.a08.normal.1": {
      "frameSize": [
        192,
        192
      ],
      "anchor": [
        96,
        176
      ],
      "facing": "left",
      "frames": [
        {
          "id": "idle-0",
          "file": "races/goblin/assets/a08-normal-1-0.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            17,
            56,
            175,
            176
          ],
          "sourceCrop": [
            0,
            632,
            182,
            802
          ]
        },
        {
          "id": "idle-1",
          "file": "races/goblin/assets/a08-normal-1-1.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            18,
            57,
            175,
            176
          ],
          "sourceCrop": [
            182,
            632,
            364,
            802
          ]
        },
        {
          "id": "ready",
          "file": "races/goblin/assets/a08-normal-1-2.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            17,
            49,
            175,
            176
          ],
          "sourceCrop": [
            364,
            632,
            547,
            802
          ]
        },
        {
          "id": "step",
          "file": "races/goblin/assets/a08-normal-1-3.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            20,
            47,
            172,
            176
          ],
          "sourceCrop": [
            547,
            632,
            730,
            802
          ]
        },
        {
          "id": "anticipation",
          "file": "races/goblin/assets/a08-normal-1-4.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            25,
            34,
            168,
            176
          ],
          "sourceCrop": [
            730,
            632,
            900,
            802
          ]
        },
        {
          "id": "attack",
          "file": "races/goblin/assets/a08-normal-1-5.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            14,
            35,
            178,
            176
          ],
          "sourceCrop": [
            900,
            632,
            1085,
            802
          ]
        },
        {
          "id": "hurt",
          "file": "races/goblin/assets/a08-normal-1-6.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            14,
            32,
            178,
            176
          ],
          "sourceCrop": [
            1085,
            632,
            1270,
            802
          ]
        },
        {
          "id": "recover",
          "file": "races/goblin/assets/a08-normal-1-7.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            22,
            46,
            170,
            176
          ],
          "sourceCrop": [
            1270,
            632,
            1448,
            802
          ]
        },
        {
          "id": "death",
          "file": "races/goblin/assets/a08-normal-1-death.png",
          "durationMs": 240,
          "facing": "left",
          "alphaBBox": [
            14,
            91,
            178,
            176
          ]
        }
      ],
      "sourceAtlas": "cf6674f7-29c2-4d8e-8abb-def3efac2dda",
      "sourceRow": 3,
      "animations": {
        "idle": [
          "idle-0",
          "idle-1"
        ],
        "attack": [
          "anticipation",
          "attack",
          "recover"
        ],
        "hurt": [
          "hurt"
        ],
        "move": [
          "ready",
          "step"
        ],
        "anticipation": [
          "anticipation"
        ],
        "recovery": [
          "recover"
        ],
        "death": [
          "death"
        ]
      }
    },
    "goblin.a09.normal.2": {
      "frameSize": [
        192,
        192
      ],
      "anchor": [
        96,
        176
      ],
      "facing": "left",
      "frames": [
        {
          "id": "idle-0",
          "file": "races/goblin/assets/a09-normal-2-0.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            37,
            67,
            155,
            176
          ],
          "sourceCrop": [
            0,
            802,
            160,
            954
          ]
        },
        {
          "id": "idle-1",
          "file": "races/goblin/assets/a09-normal-2-1.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            37,
            66,
            156,
            176
          ],
          "sourceCrop": [
            160,
            802,
            340,
            954
          ]
        },
        {
          "id": "ready",
          "file": "races/goblin/assets/a09-normal-2-2.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            39,
            67,
            153,
            176
          ],
          "sourceCrop": [
            340,
            802,
            518,
            954
          ]
        },
        {
          "id": "step",
          "file": "races/goblin/assets/a09-normal-2-3.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            42,
            67,
            151,
            176
          ],
          "sourceCrop": [
            518,
            802,
            699,
            954
          ]
        },
        {
          "id": "anticipation",
          "file": "races/goblin/assets/a09-normal-2-4.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            39,
            61,
            154,
            176
          ],
          "sourceCrop": [
            699,
            802,
            880,
            954
          ]
        },
        {
          "id": "attack",
          "file": "races/goblin/assets/a09-normal-2-5.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            14,
            63,
            178,
            176
          ],
          "sourceCrop": [
            880,
            802,
            1090,
            954
          ]
        },
        {
          "id": "hurt",
          "file": "races/goblin/assets/a09-normal-2-6.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            41,
            77,
            151,
            176
          ],
          "sourceCrop": [
            1090,
            802,
            1242,
            954
          ]
        },
        {
          "id": "recover",
          "file": "races/goblin/assets/a09-normal-2-7.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            37,
            67,
            156,
            176
          ],
          "sourceCrop": [
            1242,
            802,
            1448,
            954
          ]
        },
        {
          "id": "death",
          "file": "races/goblin/assets/a09-normal-2-death.png",
          "durationMs": 240,
          "facing": "left",
          "alphaBBox": [
            14,
            100,
            178,
            176
          ]
        }
      ],
      "sourceAtlas": "cf6674f7-29c2-4d8e-8abb-def3efac2dda",
      "sourceRow": 4,
      "animations": {
        "idle": [
          "idle-0",
          "idle-1"
        ],
        "attack": [
          "anticipation",
          "attack",
          "recover"
        ],
        "hurt": [
          "hurt"
        ],
        "move": [
          "ready",
          "step"
        ],
        "anticipation": [
          "anticipation"
        ],
        "recovery": [
          "recover"
        ],
        "death": [
          "death"
        ]
      }
    },
    "goblin.a08.normal.2": {
      "frameSize": [
        192,
        192
      ],
      "anchor": [
        96,
        176
      ],
      "facing": "left",
      "frames": [
        {
          "id": "idle-0",
          "file": "races/goblin/assets/a08-normal-2-0.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            28,
            87,
            165,
            176
          ],
          "sourceCrop": [
            0,
            954,
            175,
            1086
          ]
        },
        {
          "id": "idle-1",
          "file": "races/goblin/assets/a08-normal-2-1.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            28,
            87,
            164,
            176
          ],
          "sourceCrop": [
            175,
            954,
            354,
            1086
          ]
        },
        {
          "id": "ready",
          "file": "races/goblin/assets/a08-normal-2-2.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            27,
            86,
            165,
            176
          ],
          "sourceCrop": [
            354,
            954,
            533,
            1086
          ]
        },
        {
          "id": "step",
          "file": "races/goblin/assets/a08-normal-2-3.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            29,
            87,
            163,
            176
          ],
          "sourceCrop": [
            533,
            954,
            707,
            1086
          ]
        },
        {
          "id": "anticipation",
          "file": "races/goblin/assets/a08-normal-2-4.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            26,
            87,
            166,
            176
          ],
          "sourceCrop": [
            707,
            954,
            889,
            1086
          ]
        },
        {
          "id": "attack",
          "file": "races/goblin/assets/a08-normal-2-5.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            14,
            88,
            178,
            176
          ],
          "sourceCrop": [
            889,
            954,
            1088,
            1086
          ]
        },
        {
          "id": "hurt",
          "file": "races/goblin/assets/a08-normal-2-6.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            27,
            89,
            165,
            176
          ],
          "sourceCrop": [
            1088,
            954,
            1260,
            1086
          ]
        },
        {
          "id": "recover",
          "file": "races/goblin/assets/a08-normal-2-7.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            28,
            90,
            164,
            176
          ],
          "sourceCrop": [
            1260,
            954,
            1448,
            1086
          ]
        },
        {
          "id": "death",
          "file": "races/goblin/assets/a08-normal-2-death.png",
          "durationMs": 240,
          "facing": "left",
          "alphaBBox": [
            14,
            116,
            178,
            176
          ]
        }
      ],
      "sourceAtlas": "cf6674f7-29c2-4d8e-8abb-def3efac2dda",
      "sourceRow": 5,
      "animations": {
        "idle": [
          "idle-0",
          "idle-1"
        ],
        "attack": [
          "anticipation",
          "attack",
          "recover"
        ],
        "hurt": [
          "hurt"
        ],
        "move": [
          "ready",
          "step"
        ],
        "anticipation": [
          "anticipation"
        ],
        "recovery": [
          "recover"
        ],
        "death": [
          "death"
        ]
      }
    },
    "goblin.a01.elite": {
      "frameSize": [
        192,
        192
      ],
      "anchor": [
        96,
        176
      ],
      "facing": "left",
      "frames": [
        {
          "id": "idle-0",
          "file": "races/goblin/assets/a01-elite-0.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            14,
            22,
            178,
            176
          ],
          "sourceCrop": [
            0,
            0,
            192,
            194
          ]
        },
        {
          "id": "idle-1",
          "file": "races/goblin/assets/a01-elite-1.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            20,
            23,
            172,
            176
          ],
          "sourceCrop": [
            192,
            0,
            367,
            194
          ]
        },
        {
          "id": "ready",
          "file": "races/goblin/assets/a01-elite-2.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            21,
            28,
            171,
            176
          ],
          "sourceCrop": [
            367,
            0,
            539,
            194
          ]
        },
        {
          "id": "step",
          "file": "races/goblin/assets/a01-elite-3.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            19,
            26,
            173,
            176
          ],
          "sourceCrop": [
            539,
            0,
            718,
            194
          ]
        },
        {
          "id": "anticipation",
          "file": "races/goblin/assets/a01-elite-4.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            22,
            19,
            171,
            176
          ],
          "sourceCrop": [
            718,
            0,
            901,
            194
          ]
        },
        {
          "id": "attack",
          "file": "races/goblin/assets/a01-elite-5.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            14,
            26,
            178,
            176
          ],
          "sourceCrop": [
            901,
            0,
            1090,
            194
          ]
        },
        {
          "id": "hurt",
          "file": "races/goblin/assets/a01-elite-6.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            23,
            30,
            170,
            176
          ],
          "sourceCrop": [
            1090,
            0,
            1262,
            194
          ]
        },
        {
          "id": "recover",
          "file": "races/goblin/assets/a01-elite-7.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            18,
            26,
            174,
            176
          ],
          "sourceCrop": [
            1262,
            0,
            1448,
            194
          ]
        },
        {
          "id": "death",
          "file": "races/goblin/assets/a01-elite-death.png",
          "durationMs": 240,
          "facing": "left",
          "alphaBBox": [
            14,
            83,
            178,
            176
          ]
        }
      ],
      "sourceAtlas": "6e5636c2-839c-47cf-a430-73a244c13a8f",
      "sourceRow": 0,
      "animations": {
        "idle": [
          "idle-0",
          "idle-1"
        ],
        "attack": [
          "anticipation",
          "attack",
          "recover"
        ],
        "hurt": [
          "hurt"
        ],
        "move": [
          "ready",
          "step"
        ],
        "anticipation": [
          "anticipation"
        ],
        "recovery": [
          "recover"
        ],
        "death": [
          "death"
        ]
      }
    },
    "goblin.a02.normal.1": {
      "frameSize": [
        192,
        192
      ],
      "anchor": [
        96,
        176
      ],
      "facing": "left",
      "frames": [
        {
          "id": "idle-0",
          "file": "races/goblin/assets/a02-normal-1-0.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            30,
            83,
            163,
            176
          ],
          "sourceCrop": [
            0,
            194,
            197,
            339
          ]
        },
        {
          "id": "idle-1",
          "file": "races/goblin/assets/a02-normal-1-1.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            33,
            82,
            160,
            176
          ],
          "sourceCrop": [
            197,
            194,
            379,
            339
          ]
        },
        {
          "id": "ready",
          "file": "races/goblin/assets/a02-normal-1-2.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            31,
            87,
            161,
            176
          ],
          "sourceCrop": [
            379,
            194,
            562,
            339
          ]
        },
        {
          "id": "step",
          "file": "races/goblin/assets/a02-normal-1-3.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            40,
            90,
            152,
            176
          ],
          "sourceCrop": [
            562,
            194,
            723,
            339
          ]
        },
        {
          "id": "anticipation",
          "file": "races/goblin/assets/a02-normal-1-4.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            35,
            73,
            157,
            176
          ],
          "sourceCrop": [
            723,
            194,
            888,
            339
          ]
        },
        {
          "id": "attack",
          "file": "races/goblin/assets/a02-normal-1-5.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            14,
            84,
            178,
            176
          ],
          "sourceCrop": [
            888,
            194,
            1110,
            339
          ]
        },
        {
          "id": "hurt",
          "file": "races/goblin/assets/a02-normal-1-6.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            33,
            93,
            159,
            176
          ],
          "sourceCrop": [
            1110,
            194,
            1281,
            339
          ]
        },
        {
          "id": "recover",
          "file": "races/goblin/assets/a02-normal-1-7.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            39,
            85,
            153,
            176
          ],
          "sourceCrop": [
            1281,
            194,
            1448,
            339
          ]
        },
        {
          "id": "death",
          "file": "races/goblin/assets/a02-normal-1-death.png",
          "durationMs": 240,
          "facing": "left",
          "alphaBBox": [
            14,
            105,
            178,
            176
          ]
        }
      ],
      "sourceAtlas": "6e5636c2-839c-47cf-a430-73a244c13a8f",
      "sourceRow": 1,
      "animations": {
        "idle": [
          "idle-0",
          "idle-1"
        ],
        "attack": [
          "anticipation",
          "attack",
          "recover"
        ],
        "hurt": [
          "hurt"
        ],
        "move": [
          "ready",
          "step"
        ],
        "anticipation": [
          "anticipation"
        ],
        "recovery": [
          "recover"
        ],
        "death": [
          "death"
        ]
      }
    },
    "goblin.a02.normal.2": {
      "frameSize": [
        192,
        192
      ],
      "anchor": [
        96,
        176
      ],
      "facing": "left",
      "frames": [
        {
          "id": "idle-0",
          "file": "races/goblin/assets/a02-normal-2-0.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            24,
            37,
            168,
            176
          ],
          "sourceCrop": [
            0,
            339,
            182,
            521
          ]
        },
        {
          "id": "idle-1",
          "file": "races/goblin/assets/a02-normal-2-1.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            23,
            37,
            170,
            176
          ],
          "sourceCrop": [
            182,
            339,
            368,
            521
          ]
        },
        {
          "id": "ready",
          "file": "races/goblin/assets/a02-normal-2-2.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            24,
            43,
            169,
            176
          ],
          "sourceCrop": [
            368,
            339,
            549,
            521
          ]
        },
        {
          "id": "step",
          "file": "races/goblin/assets/a02-normal-2-3.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            22,
            45,
            171,
            176
          ],
          "sourceCrop": [
            549,
            339,
            733,
            521
          ]
        },
        {
          "id": "anticipation",
          "file": "races/goblin/assets/a02-normal-2-4.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            29,
            21,
            163,
            176
          ],
          "sourceCrop": [
            733,
            339,
            902,
            521
          ]
        },
        {
          "id": "attack",
          "file": "races/goblin/assets/a02-normal-2-5.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            14,
            44,
            178,
            176
          ],
          "sourceCrop": [
            902,
            339,
            1110,
            521
          ]
        },
        {
          "id": "hurt",
          "file": "races/goblin/assets/a02-normal-2-6.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            27,
            56,
            166,
            176
          ],
          "sourceCrop": [
            1110,
            339,
            1273,
            521
          ]
        },
        {
          "id": "recover",
          "file": "races/goblin/assets/a02-normal-2-7.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            30,
            41,
            162,
            176
          ],
          "sourceCrop": [
            1273,
            339,
            1448,
            521
          ]
        },
        {
          "id": "death",
          "file": "races/goblin/assets/a02-normal-2-death.png",
          "durationMs": 240,
          "facing": "left",
          "alphaBBox": [
            22,
            26,
            170,
            176
          ]
        }
      ],
      "sourceAtlas": "6e5636c2-839c-47cf-a430-73a244c13a8f",
      "sourceRow": 2,
      "animations": {
        "idle": [
          "idle-0",
          "idle-1"
        ],
        "attack": [
          "anticipation",
          "attack",
          "recover"
        ],
        "hurt": [
          "hurt"
        ],
        "move": [
          "ready",
          "step"
        ],
        "anticipation": [
          "anticipation"
        ],
        "recovery": [
          "recover"
        ],
        "death": [
          "death"
        ]
      }
    },
    "goblin.a02.normal.3": {
      "frameSize": [
        192,
        192
      ],
      "anchor": [
        96,
        176
      ],
      "facing": "left",
      "frames": [
        {
          "id": "idle-0",
          "file": "races/goblin/assets/a02-normal-3-0.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            17,
            57,
            175,
            176
          ],
          "sourceCrop": [
            0,
            521,
            196,
            689
          ]
        },
        {
          "id": "idle-1",
          "file": "races/goblin/assets/a02-normal-3-1.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            19,
            57,
            174,
            176
          ],
          "sourceCrop": [
            196,
            521,
            379,
            689
          ]
        },
        {
          "id": "ready",
          "file": "races/goblin/assets/a02-normal-3-2.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            25,
            59,
            168,
            176
          ],
          "sourceCrop": [
            379,
            521,
            550,
            689
          ]
        },
        {
          "id": "step",
          "file": "races/goblin/assets/a02-normal-3-3.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            14,
            59,
            178,
            176
          ],
          "sourceCrop": [
            550,
            521,
            744,
            689
          ]
        },
        {
          "id": "anticipation",
          "file": "races/goblin/assets/a02-normal-3-4.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            25,
            34,
            168,
            176
          ],
          "sourceCrop": [
            744,
            521,
            915,
            689
          ]
        },
        {
          "id": "attack",
          "file": "races/goblin/assets/a02-normal-3-5.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            20,
            53,
            172,
            176
          ],
          "sourceCrop": [
            915,
            521,
            1095,
            689
          ]
        },
        {
          "id": "hurt",
          "file": "races/goblin/assets/a02-normal-3-6.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            22,
            73,
            171,
            176
          ],
          "sourceCrop": [
            1095,
            521,
            1281,
            689
          ]
        },
        {
          "id": "recover",
          "file": "races/goblin/assets/a02-normal-3-7.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            28,
            74,
            164,
            176
          ],
          "sourceCrop": [
            1281,
            521,
            1448,
            689
          ]
        },
        {
          "id": "death",
          "file": "races/goblin/assets/a02-normal-3-death.png",
          "durationMs": 240,
          "facing": "left",
          "alphaBBox": [
            26,
            26,
            166,
            176
          ]
        }
      ],
      "sourceAtlas": "6e5636c2-839c-47cf-a430-73a244c13a8f",
      "sourceRow": 3,
      "animations": {
        "idle": [
          "idle-0",
          "idle-1"
        ],
        "attack": [
          "anticipation",
          "attack",
          "recover"
        ],
        "hurt": [
          "hurt"
        ],
        "move": [
          "ready",
          "step"
        ],
        "anticipation": [
          "anticipation"
        ],
        "recovery": [
          "recover"
        ],
        "death": [
          "death"
        ]
      }
    },
    "goblin.a02.elite": {
      "frameSize": [
        192,
        192
      ],
      "anchor": [
        96,
        176
      ],
      "facing": "left",
      "frames": [
        {
          "id": "idle-0",
          "file": "races/goblin/assets/a02-elite-0.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            26,
            32,
            166,
            176
          ],
          "sourceCrop": [
            0,
            689,
            186,
            886
          ]
        },
        {
          "id": "idle-1",
          "file": "races/goblin/assets/a02-elite-1.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            28,
            33,
            165,
            176
          ],
          "sourceCrop": [
            186,
            689,
            369,
            886
          ]
        },
        {
          "id": "ready",
          "file": "races/goblin/assets/a02-elite-2.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            26,
            31,
            167,
            176
          ],
          "sourceCrop": [
            369,
            689,
            556,
            886
          ]
        },
        {
          "id": "step",
          "file": "races/goblin/assets/a02-elite-3.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            28,
            31,
            165,
            176
          ],
          "sourceCrop": [
            556,
            689,
            735,
            886
          ]
        },
        {
          "id": "anticipation",
          "file": "races/goblin/assets/a02-elite-4.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            32,
            17,
            160,
            176
          ],
          "sourceCrop": [
            735,
            689,
            906,
            886
          ]
        },
        {
          "id": "attack",
          "file": "races/goblin/assets/a02-elite-5.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            14,
            39,
            178,
            176
          ],
          "sourceCrop": [
            906,
            689,
            1109,
            886
          ]
        },
        {
          "id": "hurt",
          "file": "races/goblin/assets/a02-elite-6.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            28,
            50,
            165,
            176
          ],
          "sourceCrop": [
            1109,
            689,
            1278,
            886
          ]
        },
        {
          "id": "recover",
          "file": "races/goblin/assets/a02-elite-7.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            36,
            33,
            156,
            176
          ],
          "sourceCrop": [
            1278,
            689,
            1448,
            886
          ]
        },
        {
          "id": "death",
          "file": "races/goblin/assets/a02-elite-death.png",
          "durationMs": 240,
          "facing": "left",
          "alphaBBox": [
            14,
            91,
            178,
            176
          ]
        }
      ],
      "sourceAtlas": "6e5636c2-839c-47cf-a430-73a244c13a8f",
      "sourceRow": 4,
      "animations": {
        "idle": [
          "idle-0",
          "idle-1"
        ],
        "attack": [
          "anticipation",
          "attack",
          "recover"
        ],
        "hurt": [
          "hurt"
        ],
        "move": [
          "ready",
          "step"
        ],
        "anticipation": [
          "anticipation"
        ],
        "recovery": [
          "recover"
        ],
        "death": [
          "death"
        ]
      }
    },
    "goblin.a03.normal.1": {
      "frameSize": [
        192,
        192
      ],
      "anchor": [
        96,
        176
      ],
      "facing": "left",
      "frames": [
        {
          "id": "idle-0",
          "file": "races/goblin/assets/a03-normal-1-0.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            26,
            20,
            167,
            176
          ],
          "sourceCrop": [
            0,
            886,
            175,
            1086
          ]
        },
        {
          "id": "idle-1",
          "file": "races/goblin/assets/a03-normal-1-1.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            25,
            22,
            168,
            176
          ],
          "sourceCrop": [
            175,
            886,
            354,
            1086
          ]
        },
        {
          "id": "ready",
          "file": "races/goblin/assets/a03-normal-1-2.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            22,
            34,
            170,
            176
          ],
          "sourceCrop": [
            354,
            886,
            553,
            1086
          ]
        },
        {
          "id": "step",
          "file": "races/goblin/assets/a03-normal-1-3.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            23,
            35,
            169,
            176
          ],
          "sourceCrop": [
            553,
            886,
            738,
            1086
          ]
        },
        {
          "id": "anticipation",
          "file": "races/goblin/assets/a03-normal-1-4.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            29,
            16,
            164,
            176
          ],
          "sourceCrop": [
            738,
            886,
            894,
            1086
          ]
        },
        {
          "id": "attack",
          "file": "races/goblin/assets/a03-normal-1-5.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            17,
            35,
            176,
            176
          ],
          "sourceCrop": [
            894,
            886,
            1109,
            1086
          ]
        },
        {
          "id": "hurt",
          "file": "races/goblin/assets/a03-normal-1-6.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            21,
            61,
            172,
            176
          ],
          "sourceCrop": [
            1109,
            886,
            1280,
            1086
          ]
        },
        {
          "id": "recover",
          "file": "races/goblin/assets/a03-normal-1-7.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            33,
            26,
            160,
            176
          ],
          "sourceCrop": [
            1280,
            886,
            1448,
            1086
          ]
        },
        {
          "id": "death",
          "file": "races/goblin/assets/a03-normal-1-death.png",
          "durationMs": 240,
          "facing": "left",
          "alphaBBox": [
            28,
            26,
            164,
            176
          ]
        }
      ],
      "sourceAtlas": "6e5636c2-839c-47cf-a430-73a244c13a8f",
      "sourceRow": 5,
      "animations": {
        "idle": [
          "idle-0",
          "idle-1"
        ],
        "attack": [
          "anticipation",
          "attack",
          "recover"
        ],
        "hurt": [
          "hurt"
        ],
        "move": [
          "ready",
          "step"
        ],
        "anticipation": [
          "anticipation"
        ],
        "recovery": [
          "recover"
        ],
        "death": [
          "death"
        ]
      }
    },
    "goblin.a03.normal.3": {
      "frameSize": [
        192,
        192
      ],
      "anchor": [
        96,
        176
      ],
      "facing": "left",
      "frames": [
        {
          "id": "idle-0",
          "file": "races/goblin/assets/a03-normal-3-0.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            24,
            27,
            168,
            176
          ],
          "sourceCrop": [
            0,
            0,
            185,
            181
          ]
        },
        {
          "id": "idle-1",
          "file": "races/goblin/assets/a03-normal-3-1.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            24,
            33,
            168,
            176
          ],
          "sourceCrop": [
            185,
            0,
            370,
            181
          ]
        },
        {
          "id": "ready",
          "file": "races/goblin/assets/a03-normal-3-2.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            25,
            37,
            168,
            176
          ],
          "sourceCrop": [
            370,
            0,
            553,
            181
          ]
        },
        {
          "id": "step",
          "file": "races/goblin/assets/a03-normal-3-3.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            23,
            28,
            169,
            176
          ],
          "sourceCrop": [
            553,
            0,
            738,
            181
          ]
        },
        {
          "id": "anticipation",
          "file": "races/goblin/assets/a03-normal-3-4.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            24,
            24,
            168,
            176
          ],
          "sourceCrop": [
            738,
            0,
            902,
            181
          ]
        },
        {
          "id": "attack",
          "file": "races/goblin/assets/a03-normal-3-5.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            14,
            24,
            178,
            176
          ],
          "sourceCrop": [
            902,
            0,
            1099,
            181
          ]
        },
        {
          "id": "hurt",
          "file": "races/goblin/assets/a03-normal-3-6.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            29,
            80,
            163,
            176
          ],
          "sourceCrop": [
            1099,
            0,
            1274,
            181
          ]
        },
        {
          "id": "recover",
          "file": "races/goblin/assets/a03-normal-3-7.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            31,
            28,
            161,
            176
          ],
          "sourceCrop": [
            1274,
            0,
            1448,
            181
          ]
        },
        {
          "id": "death",
          "file": "races/goblin/assets/a03-normal-3-death.png",
          "durationMs": 240,
          "facing": "left",
          "alphaBBox": [
            14,
            104,
            178,
            176
          ]
        }
      ],
      "sourceAtlas": "46497eb8-dce8-4e22-add5-e409b0b7abc1",
      "sourceRow": 0,
      "animations": {
        "idle": [
          "idle-0",
          "idle-1"
        ],
        "attack": [
          "anticipation",
          "attack",
          "recover"
        ],
        "hurt": [
          "hurt"
        ],
        "move": [
          "ready",
          "step"
        ],
        "anticipation": [
          "anticipation"
        ],
        "recovery": [
          "recover"
        ],
        "death": [
          "death"
        ]
      }
    },
    "goblin.a03.elite": {
      "frameSize": [
        192,
        192
      ],
      "anchor": [
        96,
        176
      ],
      "facing": "left",
      "frames": [
        {
          "id": "idle-0",
          "file": "races/goblin/assets/a03-elite-0.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            20,
            24,
            172,
            176
          ],
          "sourceCrop": [
            0,
            181,
            197,
            365
          ]
        },
        {
          "id": "idle-1",
          "file": "races/goblin/assets/a03-elite-1.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            23,
            24,
            169,
            176
          ],
          "sourceCrop": [
            197,
            181,
            374,
            365
          ]
        },
        {
          "id": "ready",
          "file": "races/goblin/assets/a03-elite-2.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            23,
            32,
            170,
            176
          ],
          "sourceCrop": [
            374,
            181,
            552,
            365
          ]
        },
        {
          "id": "step",
          "file": "races/goblin/assets/a03-elite-3.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            16,
            42,
            176,
            176
          ],
          "sourceCrop": [
            552,
            181,
            744,
            365
          ]
        },
        {
          "id": "anticipation",
          "file": "races/goblin/assets/a03-elite-4.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            19,
            21,
            174,
            176
          ],
          "sourceCrop": [
            744,
            181,
            924,
            365
          ]
        },
        {
          "id": "attack",
          "file": "races/goblin/assets/a03-elite-5.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            14,
            32,
            178,
            176
          ],
          "sourceCrop": [
            924,
            181,
            1108,
            365
          ]
        },
        {
          "id": "hurt",
          "file": "races/goblin/assets/a03-elite-6.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            27,
            43,
            165,
            176
          ],
          "sourceCrop": [
            1108,
            181,
            1281,
            365
          ]
        },
        {
          "id": "recover",
          "file": "races/goblin/assets/a03-elite-7.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            31,
            24,
            162,
            176
          ],
          "sourceCrop": [
            1281,
            181,
            1448,
            365
          ]
        },
        {
          "id": "death",
          "file": "races/goblin/assets/a03-elite-death.png",
          "durationMs": 240,
          "facing": "left",
          "alphaBBox": [
            22,
            26,
            170,
            176
          ]
        }
      ],
      "sourceAtlas": "46497eb8-dce8-4e22-add5-e409b0b7abc1",
      "sourceRow": 1,
      "animations": {
        "idle": [
          "idle-0",
          "idle-1"
        ],
        "attack": [
          "anticipation",
          "attack",
          "recover"
        ],
        "hurt": [
          "hurt"
        ],
        "move": [
          "ready",
          "step"
        ],
        "anticipation": [
          "anticipation"
        ],
        "recovery": [
          "recover"
        ],
        "death": [
          "death"
        ]
      }
    },
    "goblin.a04.normal.2": {
      "frameSize": [
        192,
        192
      ],
      "anchor": [
        96,
        176
      ],
      "facing": "left",
      "frames": [
        {
          "id": "idle-0",
          "file": "races/goblin/assets/a04-normal-2-0.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            28,
            39,
            164,
            176
          ],
          "sourceCrop": [
            0,
            365,
            180,
            558
          ]
        },
        {
          "id": "idle-1",
          "file": "races/goblin/assets/a04-normal-2-1.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            26,
            39,
            167,
            176
          ],
          "sourceCrop": [
            180,
            365,
            369,
            558
          ]
        },
        {
          "id": "ready",
          "file": "races/goblin/assets/a04-normal-2-2.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            30,
            46,
            163,
            176
          ],
          "sourceCrop": [
            369,
            365,
            564,
            558
          ]
        },
        {
          "id": "step",
          "file": "races/goblin/assets/a04-normal-2-3.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            35,
            46,
            158,
            176
          ],
          "sourceCrop": [
            564,
            365,
            728,
            558
          ]
        },
        {
          "id": "anticipation",
          "file": "races/goblin/assets/a04-normal-2-4.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            22,
            37,
            171,
            176
          ],
          "sourceCrop": [
            728,
            365,
            924,
            558
          ]
        },
        {
          "id": "attack",
          "file": "races/goblin/assets/a04-normal-2-5.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            39,
            61,
            154,
            176
          ],
          "sourceCrop": [
            924,
            365,
            1081,
            558
          ]
        },
        {
          "id": "hurt",
          "file": "races/goblin/assets/a04-normal-2-6.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            14,
            46,
            178,
            176
          ],
          "sourceCrop": [
            1081,
            365,
            1291,
            558
          ]
        },
        {
          "id": "recover",
          "file": "races/goblin/assets/a04-normal-2-7.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            38,
            42,
            154,
            176
          ],
          "sourceCrop": [
            1291,
            365,
            1448,
            558
          ]
        },
        {
          "id": "death",
          "file": "races/goblin/assets/a04-normal-2-death.png",
          "durationMs": 240,
          "facing": "left",
          "alphaBBox": [
            23,
            26,
            170,
            176
          ]
        }
      ],
      "sourceAtlas": "46497eb8-dce8-4e22-add5-e409b0b7abc1",
      "sourceRow": 2,
      "animations": {
        "idle": [
          "idle-0",
          "idle-1"
        ],
        "attack": [
          "anticipation",
          "attack",
          "recover"
        ],
        "hurt": [
          "hurt"
        ],
        "move": [
          "ready",
          "step"
        ],
        "anticipation": [
          "anticipation"
        ],
        "recovery": [
          "recover"
        ],
        "death": [
          "death"
        ]
      }
    },
    "goblin.a04.normal.3": {
      "frameSize": [
        192,
        192
      ],
      "anchor": [
        96,
        176
      ],
      "facing": "left",
      "frames": [
        {
          "id": "idle-0",
          "file": "races/goblin/assets/a04-normal-3-0.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            14,
            71,
            178,
            176
          ],
          "sourceCrop": [
            0,
            558,
            205,
            707
          ]
        },
        {
          "id": "idle-1",
          "file": "races/goblin/assets/a04-normal-3-1.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            21,
            75,
            172,
            176
          ],
          "sourceCrop": [
            205,
            558,
            385,
            707
          ]
        },
        {
          "id": "ready",
          "file": "races/goblin/assets/a04-normal-3-2.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            27,
            78,
            166,
            176
          ],
          "sourceCrop": [
            385,
            558,
            567,
            707
          ]
        },
        {
          "id": "step",
          "file": "races/goblin/assets/a04-normal-3-3.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            21,
            77,
            172,
            176
          ],
          "sourceCrop": [
            567,
            558,
            747,
            707
          ]
        },
        {
          "id": "anticipation",
          "file": "races/goblin/assets/a04-normal-3-4.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            20,
            60,
            172,
            176
          ],
          "sourceCrop": [
            747,
            558,
            928,
            707
          ]
        },
        {
          "id": "attack",
          "file": "races/goblin/assets/a04-normal-3-5.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            20,
            68,
            173,
            176
          ],
          "sourceCrop": [
            928,
            558,
            1110,
            707
          ]
        },
        {
          "id": "hurt",
          "file": "races/goblin/assets/a04-normal-3-6.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            22,
            83,
            171,
            176
          ],
          "sourceCrop": [
            1110,
            558,
            1287,
            707
          ]
        },
        {
          "id": "recover",
          "file": "races/goblin/assets/a04-normal-3-7.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            31,
            74,
            161,
            176
          ],
          "sourceCrop": [
            1287,
            558,
            1448,
            707
          ]
        },
        {
          "id": "death",
          "file": "races/goblin/assets/a04-normal-3-death.png",
          "durationMs": 240,
          "facing": "left",
          "alphaBBox": [
            14,
            99,
            178,
            176
          ]
        }
      ],
      "sourceAtlas": "46497eb8-dce8-4e22-add5-e409b0b7abc1",
      "sourceRow": 3,
      "animations": {
        "idle": [
          "idle-0",
          "idle-1"
        ],
        "attack": [
          "anticipation",
          "attack",
          "recover"
        ],
        "hurt": [
          "hurt"
        ],
        "move": [
          "ready",
          "step"
        ],
        "anticipation": [
          "anticipation"
        ],
        "recovery": [
          "recover"
        ],
        "death": [
          "death"
        ]
      }
    },
    "goblin.a04.elite": {
      "frameSize": [
        192,
        192
      ],
      "anchor": [
        96,
        176
      ],
      "facing": "left",
      "frames": [
        {
          "id": "idle-0",
          "file": "races/goblin/assets/a04-elite-0.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            21,
            28,
            171,
            176
          ],
          "sourceCrop": [
            0,
            707,
            205,
            906
          ]
        },
        {
          "id": "idle-1",
          "file": "races/goblin/assets/a04-elite-1.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            24,
            30,
            168,
            176
          ],
          "sourceCrop": [
            205,
            707,
            386,
            906
          ]
        },
        {
          "id": "ready",
          "file": "races/goblin/assets/a04-elite-2.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            31,
            42,
            162,
            176
          ],
          "sourceCrop": [
            386,
            707,
            554,
            906
          ]
        },
        {
          "id": "step",
          "file": "races/goblin/assets/a04-elite-3.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            25,
            37,
            168,
            176
          ],
          "sourceCrop": [
            554,
            707,
            748,
            906
          ]
        },
        {
          "id": "anticipation",
          "file": "races/goblin/assets/a04-elite-4.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            42,
            32,
            151,
            176
          ],
          "sourceCrop": [
            748,
            707,
            885,
            906
          ]
        },
        {
          "id": "attack",
          "file": "races/goblin/assets/a04-elite-5.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            17,
            56,
            176,
            176
          ],
          "sourceCrop": [
            885,
            707,
            1085,
            906
          ]
        },
        {
          "id": "hurt",
          "file": "races/goblin/assets/a04-elite-6.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            14,
            41,
            178,
            176
          ],
          "sourceCrop": [
            1085,
            707,
            1291,
            906
          ]
        },
        {
          "id": "recover",
          "file": "races/goblin/assets/a04-elite-7.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            35,
            41,
            157,
            176
          ],
          "sourceCrop": [
            1291,
            707,
            1448,
            906
          ]
        },
        {
          "id": "death",
          "file": "races/goblin/assets/a04-elite-death.png",
          "durationMs": 240,
          "facing": "left",
          "alphaBBox": [
            23,
            26,
            169,
            176
          ]
        }
      ],
      "sourceAtlas": "46497eb8-dce8-4e22-add5-e409b0b7abc1",
      "sourceRow": 4,
      "animations": {
        "idle": [
          "idle-0",
          "idle-1"
        ],
        "attack": [
          "anticipation",
          "attack",
          "recover"
        ],
        "hurt": [
          "hurt"
        ],
        "move": [
          "ready",
          "step"
        ],
        "anticipation": [
          "anticipation"
        ],
        "recovery": [
          "recover"
        ],
        "death": [
          "death"
        ]
      }
    },
    "goblin.a05.normal.1": {
      "frameSize": [
        192,
        192
      ],
      "anchor": [
        96,
        176
      ],
      "facing": "left",
      "frames": [
        {
          "id": "idle-0",
          "file": "races/goblin/assets/a05-normal-1-0.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            19,
            67,
            174,
            176
          ],
          "sourceCrop": [
            0,
            906,
            195,
            1086
          ]
        },
        {
          "id": "idle-1",
          "file": "races/goblin/assets/a05-normal-1-1.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            24,
            61,
            168,
            176
          ],
          "sourceCrop": [
            195,
            906,
            372,
            1086
          ]
        },
        {
          "id": "ready",
          "file": "races/goblin/assets/a05-normal-1-2.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            26,
            62,
            166,
            176
          ],
          "sourceCrop": [
            372,
            906,
            548,
            1086
          ]
        },
        {
          "id": "step",
          "file": "races/goblin/assets/a05-normal-1-3.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            23,
            59,
            169,
            176
          ],
          "sourceCrop": [
            548,
            906,
            728,
            1086
          ]
        },
        {
          "id": "anticipation",
          "file": "races/goblin/assets/a05-normal-1-4.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            24,
            50,
            168,
            176
          ],
          "sourceCrop": [
            728,
            906,
            900,
            1086
          ]
        },
        {
          "id": "attack",
          "file": "races/goblin/assets/a05-normal-1-5.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            14,
            54,
            178,
            176
          ],
          "sourceCrop": [
            900,
            906,
            1104,
            1086
          ]
        },
        {
          "id": "hurt",
          "file": "races/goblin/assets/a05-normal-1-6.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            30,
            68,
            163,
            176
          ],
          "sourceCrop": [
            1104,
            906,
            1268,
            1086
          ]
        },
        {
          "id": "recover",
          "file": "races/goblin/assets/a05-normal-1-7.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            29,
            62,
            164,
            176
          ],
          "sourceCrop": [
            1268,
            906,
            1448,
            1086
          ]
        },
        {
          "id": "death",
          "file": "races/goblin/assets/a05-normal-1-death.png",
          "durationMs": 240,
          "facing": "left",
          "alphaBBox": [
            14,
            100,
            178,
            176
          ]
        }
      ],
      "sourceAtlas": "46497eb8-dce8-4e22-add5-e409b0b7abc1",
      "sourceRow": 5,
      "animations": {
        "idle": [
          "idle-0",
          "idle-1"
        ],
        "attack": [
          "anticipation",
          "attack",
          "recover"
        ],
        "hurt": [
          "hurt"
        ],
        "move": [
          "ready",
          "step"
        ],
        "anticipation": [
          "anticipation"
        ],
        "recovery": [
          "recover"
        ],
        "death": [
          "death"
        ]
      }
    },
    "goblin.a05.normal.2": {
      "frameSize": [
        192,
        192
      ],
      "anchor": [
        96,
        176
      ],
      "facing": "left",
      "frames": [
        {
          "id": "idle-0",
          "file": "races/goblin/assets/a05-normal-2-0.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            24,
            61,
            168,
            176
          ],
          "sourceCrop": [
            0,
            0,
            183,
            169
          ]
        },
        {
          "id": "idle-1",
          "file": "races/goblin/assets/a05-normal-2-1.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            22,
            64,
            170,
            176
          ],
          "sourceCrop": [
            183,
            0,
            365,
            169
          ]
        },
        {
          "id": "ready",
          "file": "races/goblin/assets/a05-normal-2-2.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            22,
            64,
            170,
            176
          ],
          "sourceCrop": [
            365,
            0,
            546,
            169
          ]
        },
        {
          "id": "step",
          "file": "races/goblin/assets/a05-normal-2-3.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            25,
            67,
            167,
            176
          ],
          "sourceCrop": [
            546,
            0,
            722,
            169
          ]
        },
        {
          "id": "anticipation",
          "file": "races/goblin/assets/a05-normal-2-4.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            18,
            47,
            175,
            176
          ],
          "sourceCrop": [
            722,
            0,
            910,
            169
          ]
        },
        {
          "id": "attack",
          "file": "races/goblin/assets/a05-normal-2-5.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            14,
            64,
            178,
            176
          ],
          "sourceCrop": [
            910,
            0,
            1103,
            169
          ]
        },
        {
          "id": "hurt",
          "file": "races/goblin/assets/a05-normal-2-6.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            22,
            60,
            170,
            176
          ],
          "sourceCrop": [
            1103,
            0,
            1285,
            169
          ]
        },
        {
          "id": "recover",
          "file": "races/goblin/assets/a05-normal-2-7.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            29,
            64,
            163,
            176
          ],
          "sourceCrop": [
            1285,
            0,
            1448,
            169
          ]
        },
        {
          "id": "death",
          "file": "races/goblin/assets/a05-normal-2-death.png",
          "durationMs": 240,
          "facing": "left",
          "alphaBBox": [
            30,
            26,
            163,
            176
          ]
        }
      ],
      "sourceAtlas": "2248bfaa-d2cd-43e7-b783-6cba568e3229",
      "sourceRow": 0,
      "animations": {
        "idle": [
          "idle-0",
          "idle-1"
        ],
        "attack": [
          "anticipation",
          "attack",
          "recover"
        ],
        "hurt": [
          "hurt"
        ],
        "move": [
          "ready",
          "step"
        ],
        "anticipation": [
          "anticipation"
        ],
        "recovery": [
          "recover"
        ],
        "death": [
          "death"
        ]
      }
    },
    "goblin.a05.normal.3": {
      "frameSize": [
        192,
        192
      ],
      "anchor": [
        96,
        176
      ],
      "facing": "left",
      "frames": [
        {
          "id": "idle-0",
          "file": "races/goblin/assets/a05-normal-3-0.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            41,
            26,
            151,
            176
          ],
          "sourceCrop": [
            0,
            169,
            156,
            354
          ]
        },
        {
          "id": "idle-1",
          "file": "races/goblin/assets/a05-normal-3-1.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            41,
            24,
            151,
            176
          ],
          "sourceCrop": [
            156,
            169,
            337,
            354
          ]
        },
        {
          "id": "ready",
          "file": "races/goblin/assets/a05-normal-3-2.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            43,
            29,
            149,
            176
          ],
          "sourceCrop": [
            337,
            169,
            518,
            354
          ]
        },
        {
          "id": "step",
          "file": "races/goblin/assets/a05-normal-3-3.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            44,
            29,
            148,
            176
          ],
          "sourceCrop": [
            518,
            169,
            699,
            354
          ]
        },
        {
          "id": "anticipation",
          "file": "races/goblin/assets/a05-normal-3-4.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            26,
            16,
            166,
            176
          ],
          "sourceCrop": [
            699,
            169,
            901,
            354
          ]
        },
        {
          "id": "attack",
          "file": "races/goblin/assets/a05-normal-3-5.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            22,
            33,
            171,
            176
          ],
          "sourceCrop": [
            901,
            169,
            1083,
            354
          ]
        },
        {
          "id": "hurt",
          "file": "races/goblin/assets/a05-normal-3-6.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            45,
            38,
            148,
            176
          ],
          "sourceCrop": [
            1083,
            169,
            1242,
            354
          ]
        },
        {
          "id": "recover",
          "file": "races/goblin/assets/a05-normal-3-7.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            42,
            26,
            151,
            176
          ],
          "sourceCrop": [
            1242,
            169,
            1448,
            354
          ]
        },
        {
          "id": "death",
          "file": "races/goblin/assets/a05-normal-3-death.png",
          "durationMs": 240,
          "facing": "left",
          "alphaBBox": [
            14,
            92,
            178,
            176
          ]
        }
      ],
      "sourceAtlas": "2248bfaa-d2cd-43e7-b783-6cba568e3229",
      "sourceRow": 1,
      "animations": {
        "idle": [
          "idle-0",
          "idle-1"
        ],
        "attack": [
          "anticipation",
          "attack",
          "recover"
        ],
        "hurt": [
          "hurt"
        ],
        "move": [
          "ready",
          "step"
        ],
        "anticipation": [
          "anticipation"
        ],
        "recovery": [
          "recover"
        ],
        "death": [
          "death"
        ]
      }
    },
    "goblin.a05.elite": {
      "frameSize": [
        192,
        192
      ],
      "anchor": [
        96,
        176
      ],
      "facing": "left",
      "frames": [
        {
          "id": "idle-0",
          "file": "races/goblin/assets/a05-elite-0.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            21,
            37,
            172,
            176
          ],
          "sourceCrop": [
            0,
            354,
            186,
            535
          ]
        },
        {
          "id": "idle-1",
          "file": "races/goblin/assets/a05-elite-1.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            21,
            37,
            172,
            176
          ],
          "sourceCrop": [
            186,
            354,
            367,
            535
          ]
        },
        {
          "id": "ready",
          "file": "races/goblin/assets/a05-elite-2.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            21,
            37,
            172,
            176
          ],
          "sourceCrop": [
            367,
            354,
            557,
            535
          ]
        },
        {
          "id": "step",
          "file": "races/goblin/assets/a05-elite-3.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            26,
            45,
            167,
            176
          ],
          "sourceCrop": [
            557,
            354,
            726,
            535
          ]
        },
        {
          "id": "anticipation",
          "file": "races/goblin/assets/a05-elite-4.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            14,
            34,
            178,
            176
          ],
          "sourceCrop": [
            726,
            354,
            928,
            535
          ]
        },
        {
          "id": "attack",
          "file": "races/goblin/assets/a05-elite-5.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            22,
            47,
            170,
            176
          ],
          "sourceCrop": [
            928,
            354,
            1110,
            535
          ]
        },
        {
          "id": "hurt",
          "file": "races/goblin/assets/a05-elite-6.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            28,
            50,
            165,
            176
          ],
          "sourceCrop": [
            1110,
            354,
            1291,
            535
          ]
        },
        {
          "id": "recover",
          "file": "races/goblin/assets/a05-elite-7.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            33,
            45,
            159,
            176
          ],
          "sourceCrop": [
            1291,
            354,
            1448,
            535
          ]
        },
        {
          "id": "death",
          "file": "races/goblin/assets/a05-elite-death.png",
          "durationMs": 240,
          "facing": "left",
          "alphaBBox": [
            14,
            88,
            178,
            176
          ]
        }
      ],
      "sourceAtlas": "2248bfaa-d2cd-43e7-b783-6cba568e3229",
      "sourceRow": 2,
      "animations": {
        "idle": [
          "idle-0",
          "idle-1"
        ],
        "attack": [
          "anticipation",
          "attack",
          "recover"
        ],
        "hurt": [
          "hurt"
        ],
        "move": [
          "ready",
          "step"
        ],
        "anticipation": [
          "anticipation"
        ],
        "recovery": [
          "recover"
        ],
        "death": [
          "death"
        ]
      }
    },
    "goblin.a06.normal.1": {
      "frameSize": [
        192,
        192
      ],
      "anchor": [
        96,
        176
      ],
      "facing": "left",
      "frames": [
        {
          "id": "idle-0",
          "file": "races/goblin/assets/a06-normal-1-0.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            17,
            50,
            176,
            176
          ],
          "sourceCrop": [
            0,
            535,
            192,
            688
          ]
        },
        {
          "id": "idle-1",
          "file": "races/goblin/assets/a06-normal-1-1.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            21,
            55,
            172,
            176
          ],
          "sourceCrop": [
            192,
            535,
            377,
            688
          ]
        },
        {
          "id": "ready",
          "file": "races/goblin/assets/a06-normal-1-2.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            23,
            56,
            169,
            176
          ],
          "sourceCrop": [
            377,
            535,
            550,
            688
          ]
        },
        {
          "id": "step",
          "file": "races/goblin/assets/a06-normal-1-3.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            17,
            57,
            176,
            176
          ],
          "sourceCrop": [
            550,
            535,
            733,
            688
          ]
        },
        {
          "id": "anticipation",
          "file": "races/goblin/assets/a06-normal-1-4.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            15,
            56,
            178,
            176
          ],
          "sourceCrop": [
            733,
            535,
            921,
            688
          ]
        },
        {
          "id": "attack",
          "file": "races/goblin/assets/a06-normal-1-5.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            14,
            50,
            178,
            176
          ],
          "sourceCrop": [
            921,
            535,
            1110,
            688
          ]
        },
        {
          "id": "hurt",
          "file": "races/goblin/assets/a06-normal-1-6.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            23,
            75,
            170,
            176
          ],
          "sourceCrop": [
            1110,
            535,
            1279,
            688
          ]
        },
        {
          "id": "recover",
          "file": "races/goblin/assets/a06-normal-1-7.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            29,
            70,
            164,
            176
          ],
          "sourceCrop": [
            1279,
            535,
            1448,
            688
          ]
        },
        {
          "id": "death",
          "file": "races/goblin/assets/a06-normal-1-death.png",
          "durationMs": 240,
          "facing": "left",
          "alphaBBox": [
            20,
            26,
            172,
            176
          ]
        }
      ],
      "sourceAtlas": "2248bfaa-d2cd-43e7-b783-6cba568e3229",
      "sourceRow": 3,
      "animations": {
        "idle": [
          "idle-0",
          "idle-1"
        ],
        "attack": [
          "anticipation",
          "attack",
          "recover"
        ],
        "hurt": [
          "hurt"
        ],
        "move": [
          "ready",
          "step"
        ],
        "anticipation": [
          "anticipation"
        ],
        "recovery": [
          "recover"
        ],
        "death": [
          "death"
        ]
      }
    },
    "goblin.a06.normal.2": {
      "frameSize": [
        192,
        192
      ],
      "anchor": [
        96,
        176
      ],
      "facing": "left",
      "frames": [
        {
          "id": "idle-0",
          "file": "races/goblin/assets/a06-normal-2-0.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            23,
            33,
            169,
            176
          ],
          "sourceCrop": [
            0,
            688,
            176,
            869
          ]
        },
        {
          "id": "idle-1",
          "file": "races/goblin/assets/a06-normal-2-1.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            26,
            35,
            166,
            176
          ],
          "sourceCrop": [
            176,
            688,
            362,
            869
          ]
        },
        {
          "id": "ready",
          "file": "races/goblin/assets/a06-normal-2-2.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            34,
            19,
            158,
            176
          ],
          "sourceCrop": [
            362,
            688,
            522,
            869
          ]
        },
        {
          "id": "step",
          "file": "races/goblin/assets/a06-normal-2-3.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            20,
            22,
            172,
            176
          ],
          "sourceCrop": [
            522,
            688,
            732,
            869
          ]
        },
        {
          "id": "anticipation",
          "file": "races/goblin/assets/a06-normal-2-4.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            21,
            20,
            172,
            176
          ],
          "sourceCrop": [
            732,
            688,
            915,
            869
          ]
        },
        {
          "id": "attack",
          "file": "races/goblin/assets/a06-normal-2-5.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            14,
            18,
            178,
            176
          ],
          "sourceCrop": [
            915,
            688,
            1110,
            869
          ]
        },
        {
          "id": "hurt",
          "file": "races/goblin/assets/a06-normal-2-6.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            21,
            24,
            172,
            176
          ],
          "sourceCrop": [
            1110,
            688,
            1283,
            869
          ]
        },
        {
          "id": "recover",
          "file": "races/goblin/assets/a06-normal-2-7.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            32,
            35,
            161,
            176
          ],
          "sourceCrop": [
            1283,
            688,
            1448,
            869
          ]
        },
        {
          "id": "death",
          "file": "races/goblin/assets/a06-normal-2-death.png",
          "durationMs": 240,
          "facing": "left",
          "alphaBBox": [
            23,
            26,
            170,
            176
          ]
        }
      ],
      "sourceAtlas": "2248bfaa-d2cd-43e7-b783-6cba568e3229",
      "sourceRow": 4,
      "animations": {
        "idle": [
          "idle-0",
          "idle-1"
        ],
        "attack": [
          "anticipation",
          "attack",
          "recover"
        ],
        "hurt": [
          "hurt"
        ],
        "move": [
          "ready",
          "step"
        ],
        "anticipation": [
          "anticipation"
        ],
        "recovery": [
          "recover"
        ],
        "death": [
          "death"
        ]
      }
    },
    "goblin.a06.normal.3": {
      "frameSize": [
        192,
        192
      ],
      "anchor": [
        96,
        176
      ],
      "facing": "left",
      "frames": [
        {
          "id": "idle-0",
          "file": "races/goblin/assets/a06-normal-3-0.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            42,
            33,
            150,
            176
          ],
          "sourceCrop": [
            0,
            869,
            159,
            1086
          ]
        },
        {
          "id": "idle-1",
          "file": "races/goblin/assets/a06-normal-3-1.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            42,
            32,
            150,
            176
          ],
          "sourceCrop": [
            159,
            869,
            342,
            1086
          ]
        },
        {
          "id": "ready",
          "file": "races/goblin/assets/a06-normal-3-2.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            47,
            24,
            145,
            176
          ],
          "sourceCrop": [
            342,
            869,
            518,
            1086
          ]
        },
        {
          "id": "step",
          "file": "races/goblin/assets/a06-normal-3-3.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            44,
            23,
            148,
            176
          ],
          "sourceCrop": [
            518,
            869,
            699,
            1086
          ]
        },
        {
          "id": "anticipation",
          "file": "races/goblin/assets/a06-normal-3-4.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            26,
            16,
            166,
            176
          ],
          "sourceCrop": [
            699,
            869,
            908,
            1086
          ]
        },
        {
          "id": "attack",
          "file": "races/goblin/assets/a06-normal-3-5.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            25,
            24,
            168,
            176
          ],
          "sourceCrop": [
            908,
            869,
            1110,
            1086
          ]
        },
        {
          "id": "hurt",
          "file": "races/goblin/assets/a06-normal-3-6.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            36,
            31,
            157,
            176
          ],
          "sourceCrop": [
            1110,
            869,
            1267,
            1086
          ]
        },
        {
          "id": "recover",
          "file": "races/goblin/assets/a06-normal-3-7.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            43,
            36,
            150,
            176
          ],
          "sourceCrop": [
            1267,
            869,
            1448,
            1086
          ]
        },
        {
          "id": "death",
          "file": "races/goblin/assets/a06-normal-3-death.png",
          "durationMs": 240,
          "facing": "left",
          "alphaBBox": [
            14,
            91,
            178,
            176
          ]
        }
      ],
      "sourceAtlas": "2248bfaa-d2cd-43e7-b783-6cba568e3229",
      "sourceRow": 5,
      "animations": {
        "idle": [
          "idle-0",
          "idle-1"
        ],
        "attack": [
          "anticipation",
          "attack",
          "recover"
        ],
        "hurt": [
          "hurt"
        ],
        "move": [
          "ready",
          "step"
        ],
        "anticipation": [
          "anticipation"
        ],
        "recovery": [
          "recover"
        ],
        "death": [
          "death"
        ]
      }
    },
    "goblin.a06.elite": {
      "frameSize": [
        192,
        192
      ],
      "anchor": [
        96,
        176
      ],
      "facing": "left",
      "frames": [
        {
          "id": "idle-0",
          "file": "races/goblin/assets/a06-elite-0.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            22,
            58,
            171,
            176
          ],
          "sourceCrop": [
            0,
            0,
            185,
            170
          ]
        },
        {
          "id": "idle-1",
          "file": "races/goblin/assets/a06-elite-1.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            25,
            58,
            168,
            176
          ],
          "sourceCrop": [
            185,
            0,
            363,
            170
          ]
        },
        {
          "id": "ready",
          "file": "races/goblin/assets/a06-elite-2.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            24,
            58,
            169,
            176
          ],
          "sourceCrop": [
            363,
            0,
            545,
            170
          ]
        },
        {
          "id": "step",
          "file": "races/goblin/assets/a06-elite-3.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            23,
            58,
            170,
            176
          ],
          "sourceCrop": [
            545,
            0,
            727,
            170
          ]
        },
        {
          "id": "anticipation",
          "file": "races/goblin/assets/a06-elite-4.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            25,
            58,
            167,
            176
          ],
          "sourceCrop": [
            727,
            0,
            907,
            170
          ]
        },
        {
          "id": "attack",
          "file": "races/goblin/assets/a06-elite-5.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            14,
            68,
            178,
            176
          ],
          "sourceCrop": [
            907,
            0,
            1105,
            170
          ]
        },
        {
          "id": "hurt",
          "file": "races/goblin/assets/a06-elite-6.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            28,
            60,
            165,
            176
          ],
          "sourceCrop": [
            1105,
            0,
            1269,
            170
          ]
        },
        {
          "id": "recover",
          "file": "races/goblin/assets/a06-elite-7.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            26,
            58,
            166,
            176
          ],
          "sourceCrop": [
            1269,
            0,
            1448,
            170
          ]
        },
        {
          "id": "death",
          "file": "races/goblin/assets/a06-elite-death.png",
          "durationMs": 240,
          "facing": "left",
          "alphaBBox": [
            22,
            26,
            170,
            176
          ]
        }
      ],
      "sourceAtlas": "79be6794-a642-4e28-b3a8-0cc362903235",
      "sourceRow": 0,
      "animations": {
        "idle": [
          "idle-0",
          "idle-1"
        ],
        "attack": [
          "anticipation",
          "attack",
          "recover"
        ],
        "hurt": [
          "hurt"
        ],
        "move": [
          "ready",
          "step"
        ],
        "anticipation": [
          "anticipation"
        ],
        "recovery": [
          "recover"
        ],
        "death": [
          "death"
        ]
      }
    },
    "goblin.a07.normal.1": {
      "frameSize": [
        192,
        192
      ],
      "anchor": [
        96,
        176
      ],
      "facing": "left",
      "frames": [
        {
          "id": "idle-0",
          "file": "races/goblin/assets/a07-normal-1-0.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            34,
            49,
            158,
            176
          ],
          "sourceCrop": [
            0,
            170,
            169,
            345
          ]
        },
        {
          "id": "idle-1",
          "file": "races/goblin/assets/a07-normal-1-1.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            36,
            48,
            156,
            176
          ],
          "sourceCrop": [
            169,
            170,
            347,
            345
          ]
        },
        {
          "id": "ready",
          "file": "races/goblin/assets/a07-normal-1-2.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            32,
            48,
            161,
            176
          ],
          "sourceCrop": [
            347,
            170,
            537,
            345
          ]
        },
        {
          "id": "step",
          "file": "races/goblin/assets/a07-normal-1-3.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            33,
            49,
            159,
            176
          ],
          "sourceCrop": [
            537,
            170,
            710,
            345
          ]
        },
        {
          "id": "anticipation",
          "file": "races/goblin/assets/a07-normal-1-4.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            33,
            48,
            160,
            176
          ],
          "sourceCrop": [
            710,
            170,
            893,
            345
          ]
        },
        {
          "id": "attack",
          "file": "races/goblin/assets/a07-normal-1-5.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            14,
            50,
            178,
            176
          ],
          "sourceCrop": [
            893,
            170,
            1110,
            345
          ]
        },
        {
          "id": "hurt",
          "file": "races/goblin/assets/a07-normal-1-6.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            32,
            50,
            160,
            176
          ],
          "sourceCrop": [
            1110,
            170,
            1273,
            345
          ]
        },
        {
          "id": "recover",
          "file": "races/goblin/assets/a07-normal-1-7.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            40,
            49,
            152,
            176
          ],
          "sourceCrop": [
            1273,
            170,
            1448,
            345
          ]
        },
        {
          "id": "death",
          "file": "races/goblin/assets/a07-normal-1-death.png",
          "durationMs": 240,
          "facing": "left",
          "alphaBBox": [
            27,
            26,
            166,
            176
          ]
        }
      ],
      "sourceAtlas": "79be6794-a642-4e28-b3a8-0cc362903235",
      "sourceRow": 1,
      "animations": {
        "idle": [
          "idle-0",
          "idle-1"
        ],
        "attack": [
          "anticipation",
          "attack",
          "recover"
        ],
        "hurt": [
          "hurt"
        ],
        "move": [
          "ready",
          "step"
        ],
        "anticipation": [
          "anticipation"
        ],
        "recovery": [
          "recover"
        ],
        "death": [
          "death"
        ]
      }
    },
    "goblin.a07.normal.2": {
      "frameSize": [
        192,
        192
      ],
      "anchor": [
        96,
        176
      ],
      "facing": "left",
      "frames": [
        {
          "id": "idle-0",
          "file": "races/goblin/assets/a07-normal-2-0.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            25,
            43,
            168,
            176
          ],
          "sourceCrop": [
            0,
            345,
            183,
            520
          ]
        },
        {
          "id": "idle-1",
          "file": "races/goblin/assets/a07-normal-2-1.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            29,
            43,
            164,
            176
          ],
          "sourceCrop": [
            183,
            345,
            358,
            520
          ]
        },
        {
          "id": "ready",
          "file": "races/goblin/assets/a07-normal-2-2.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            25,
            44,
            167,
            176
          ],
          "sourceCrop": [
            358,
            345,
            540,
            520
          ]
        },
        {
          "id": "step",
          "file": "races/goblin/assets/a07-normal-2-3.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            26,
            43,
            167,
            176
          ],
          "sourceCrop": [
            540,
            345,
            719,
            520
          ]
        },
        {
          "id": "anticipation",
          "file": "races/goblin/assets/a07-normal-2-4.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            23,
            43,
            169,
            176
          ],
          "sourceCrop": [
            719,
            345,
            912,
            520
          ]
        },
        {
          "id": "attack",
          "file": "races/goblin/assets/a07-normal-2-5.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            14,
            47,
            178,
            176
          ],
          "sourceCrop": [
            912,
            345,
            1110,
            520
          ]
        },
        {
          "id": "hurt",
          "file": "races/goblin/assets/a07-normal-2-6.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            26,
            44,
            166,
            176
          ],
          "sourceCrop": [
            1110,
            345,
            1279,
            520
          ]
        },
        {
          "id": "recover",
          "file": "races/goblin/assets/a07-normal-2-7.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            33,
            45,
            160,
            176
          ],
          "sourceCrop": [
            1279,
            345,
            1448,
            520
          ]
        },
        {
          "id": "death",
          "file": "races/goblin/assets/a07-normal-2-death.png",
          "durationMs": 240,
          "facing": "left",
          "alphaBBox": [
            14,
            97,
            178,
            176
          ]
        }
      ],
      "sourceAtlas": "79be6794-a642-4e28-b3a8-0cc362903235",
      "sourceRow": 2,
      "animations": {
        "idle": [
          "idle-0",
          "idle-1"
        ],
        "attack": [
          "anticipation",
          "attack",
          "recover"
        ],
        "hurt": [
          "hurt"
        ],
        "move": [
          "ready",
          "step"
        ],
        "anticipation": [
          "anticipation"
        ],
        "recovery": [
          "recover"
        ],
        "death": [
          "death"
        ]
      }
    },
    "goblin.a07.normal.3": {
      "frameSize": [
        192,
        192
      ],
      "anchor": [
        96,
        176
      ],
      "facing": "left",
      "frames": [
        {
          "id": "idle-0",
          "file": "races/goblin/assets/a07-normal-3-0.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            22,
            57,
            171,
            176
          ],
          "sourceCrop": [
            0,
            520,
            194,
            683
          ]
        },
        {
          "id": "idle-1",
          "file": "races/goblin/assets/a07-normal-3-1.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            28,
            57,
            164,
            176
          ],
          "sourceCrop": [
            194,
            520,
            361,
            683
          ]
        },
        {
          "id": "ready",
          "file": "races/goblin/assets/a07-normal-3-2.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            14,
            57,
            178,
            176
          ],
          "sourceCrop": [
            361,
            520,
            563,
            683
          ]
        },
        {
          "id": "step",
          "file": "races/goblin/assets/a07-normal-3-3.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            24,
            57,
            168,
            176
          ],
          "sourceCrop": [
            563,
            520,
            740,
            683
          ]
        },
        {
          "id": "anticipation",
          "file": "races/goblin/assets/a07-normal-3-4.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            26,
            50,
            167,
            176
          ],
          "sourceCrop": [
            740,
            520,
            926,
            683
          ]
        },
        {
          "id": "attack",
          "file": "races/goblin/assets/a07-normal-3-5.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            22,
            62,
            171,
            176
          ],
          "sourceCrop": [
            926,
            520,
            1110,
            683
          ]
        },
        {
          "id": "hurt",
          "file": "races/goblin/assets/a07-normal-3-6.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            27,
            73,
            166,
            176
          ],
          "sourceCrop": [
            1110,
            520,
            1281,
            683
          ]
        },
        {
          "id": "recover",
          "file": "races/goblin/assets/a07-normal-3-7.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            29,
            60,
            163,
            176
          ],
          "sourceCrop": [
            1281,
            520,
            1448,
            683
          ]
        },
        {
          "id": "death",
          "file": "races/goblin/assets/a07-normal-3-death.png",
          "durationMs": 240,
          "facing": "left",
          "alphaBBox": [
            14,
            98,
            178,
            176
          ]
        }
      ],
      "sourceAtlas": "79be6794-a642-4e28-b3a8-0cc362903235",
      "sourceRow": 3,
      "animations": {
        "idle": [
          "idle-0",
          "idle-1"
        ],
        "attack": [
          "anticipation",
          "attack",
          "recover"
        ],
        "hurt": [
          "hurt"
        ],
        "move": [
          "ready",
          "step"
        ],
        "anticipation": [
          "anticipation"
        ],
        "recovery": [
          "recover"
        ],
        "death": [
          "death"
        ]
      }
    },
    "goblin.a07.elite": {
      "frameSize": [
        192,
        192
      ],
      "anchor": [
        96,
        176
      ],
      "facing": "left",
      "frames": [
        {
          "id": "idle-0",
          "file": "races/goblin/assets/a07-elite-0.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            20,
            17,
            172,
            176
          ],
          "sourceCrop": [
            0,
            683,
            179,
            872
          ]
        },
        {
          "id": "idle-1",
          "file": "races/goblin/assets/a07-elite-1.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            16,
            20,
            176,
            176
          ],
          "sourceCrop": [
            179,
            683,
            365,
            872
          ]
        },
        {
          "id": "ready",
          "file": "races/goblin/assets/a07-elite-2.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            16,
            19,
            177,
            176
          ],
          "sourceCrop": [
            365,
            683,
            556,
            872
          ]
        },
        {
          "id": "step",
          "file": "races/goblin/assets/a07-elite-3.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            22,
            17,
            171,
            176
          ],
          "sourceCrop": [
            556,
            683,
            733,
            872
          ]
        },
        {
          "id": "anticipation",
          "file": "races/goblin/assets/a07-elite-4.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            14,
            21,
            178,
            176
          ],
          "sourceCrop": [
            733,
            683,
            928,
            872
          ]
        },
        {
          "id": "attack",
          "file": "races/goblin/assets/a07-elite-5.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            20,
            23,
            173,
            176
          ],
          "sourceCrop": [
            928,
            683,
            1110,
            872
          ]
        },
        {
          "id": "hurt",
          "file": "races/goblin/assets/a07-elite-6.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            22,
            25,
            170,
            176
          ],
          "sourceCrop": [
            1110,
            683,
            1276,
            872
          ]
        },
        {
          "id": "recover",
          "file": "races/goblin/assets/a07-elite-7.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            26,
            23,
            166,
            176
          ],
          "sourceCrop": [
            1276,
            683,
            1448,
            872
          ]
        },
        {
          "id": "death",
          "file": "races/goblin/assets/a07-elite-death.png",
          "durationMs": 240,
          "facing": "left",
          "alphaBBox": [
            14,
            68,
            178,
            176
          ]
        }
      ],
      "sourceAtlas": "79be6794-a642-4e28-b3a8-0cc362903235",
      "sourceRow": 4,
      "animations": {
        "idle": [
          "idle-0",
          "idle-1"
        ],
        "attack": [
          "anticipation",
          "attack",
          "recover"
        ],
        "hurt": [
          "hurt"
        ],
        "move": [
          "ready",
          "step"
        ],
        "anticipation": [
          "anticipation"
        ],
        "recovery": [
          "recover"
        ],
        "death": [
          "death"
        ]
      }
    },
    "goblin.a08.normal.3": {
      "frameSize": [
        192,
        192
      ],
      "anchor": [
        96,
        176
      ],
      "facing": "left",
      "frames": [
        {
          "id": "idle-0",
          "file": "races/goblin/assets/a08-normal-3-0.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            22,
            23,
            170,
            176
          ],
          "sourceCrop": [
            0,
            872,
            183,
            1086
          ]
        },
        {
          "id": "idle-1",
          "file": "races/goblin/assets/a08-normal-3-1.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            18,
            26,
            174,
            176
          ],
          "sourceCrop": [
            183,
            872,
            379,
            1086
          ]
        },
        {
          "id": "ready",
          "file": "races/goblin/assets/a08-normal-3-2.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            23,
            26,
            170,
            176
          ],
          "sourceCrop": [
            379,
            872,
            563,
            1086
          ]
        },
        {
          "id": "step",
          "file": "races/goblin/assets/a08-normal-3-3.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            33,
            27,
            160,
            176
          ],
          "sourceCrop": [
            563,
            872,
            726,
            1086
          ]
        },
        {
          "id": "anticipation",
          "file": "races/goblin/assets/a08-normal-3-4.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            17,
            26,
            175,
            176
          ],
          "sourceCrop": [
            726,
            872,
            921,
            1086
          ]
        },
        {
          "id": "attack",
          "file": "races/goblin/assets/a08-normal-3-5.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            14,
            36,
            178,
            176
          ],
          "sourceCrop": [
            921,
            872,
            1110,
            1086
          ]
        },
        {
          "id": "hurt",
          "file": "races/goblin/assets/a08-normal-3-6.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            29,
            35,
            164,
            176
          ],
          "sourceCrop": [
            1110,
            872,
            1266,
            1086
          ]
        },
        {
          "id": "recover",
          "file": "races/goblin/assets/a08-normal-3-7.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            31,
            28,
            162,
            176
          ],
          "sourceCrop": [
            1266,
            872,
            1448,
            1086
          ]
        },
        {
          "id": "death",
          "file": "races/goblin/assets/a08-normal-3-death.png",
          "durationMs": 240,
          "facing": "left",
          "alphaBBox": [
            14,
            81,
            178,
            176
          ]
        }
      ],
      "sourceAtlas": "79be6794-a642-4e28-b3a8-0cc362903235",
      "sourceRow": 5,
      "animations": {
        "idle": [
          "idle-0",
          "idle-1"
        ],
        "attack": [
          "anticipation",
          "attack",
          "recover"
        ],
        "hurt": [
          "hurt"
        ],
        "move": [
          "ready",
          "step"
        ],
        "anticipation": [
          "anticipation"
        ],
        "recovery": [
          "recover"
        ],
        "death": [
          "death"
        ]
      }
    },
    "goblin.a08.elite": {
      "frameSize": [
        192,
        192
      ],
      "anchor": [
        96,
        176
      ],
      "facing": "left",
      "frames": [
        {
          "id": "idle-0",
          "file": "races/goblin/assets/a08-elite-0.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            50,
            58,
            143,
            176
          ],
          "sourceCrop": [
            0,
            0,
            150,
            145
          ]
        },
        {
          "id": "idle-1",
          "file": "races/goblin/assets/a08-elite-1.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            46,
            58,
            146,
            176
          ],
          "sourceCrop": [
            150,
            0,
            325,
            145
          ]
        },
        {
          "id": "ready",
          "file": "races/goblin/assets/a08-elite-2.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            47,
            57,
            145,
            176
          ],
          "sourceCrop": [
            325,
            0,
            501,
            145
          ]
        },
        {
          "id": "step",
          "file": "races/goblin/assets/a08-elite-3.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            44,
            58,
            148,
            176
          ],
          "sourceCrop": [
            501,
            0,
            676,
            145
          ]
        },
        {
          "id": "anticipation",
          "file": "races/goblin/assets/a08-elite-4.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            14,
            62,
            178,
            176
          ],
          "sourceCrop": [
            676,
            0,
            900,
            145
          ]
        },
        {
          "id": "attack",
          "file": "races/goblin/assets/a08-elite-5.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            26,
            71,
            167,
            176
          ],
          "sourceCrop": [
            900,
            0,
            1061,
            145
          ]
        },
        {
          "id": "hurt",
          "file": "races/goblin/assets/a08-elite-6.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            48,
            56,
            144,
            176
          ],
          "sourceCrop": [
            1061,
            0,
            1209,
            145
          ]
        },
        {
          "id": "recover",
          "file": "races/goblin/assets/a08-elite-7.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            48,
            56,
            144,
            176
          ],
          "sourceCrop": [
            1209,
            0,
            1402,
            145
          ]
        },
        {
          "id": "death",
          "file": "races/goblin/assets/a08-elite-death.png",
          "durationMs": 240,
          "facing": "left",
          "alphaBBox": [
            14,
            99,
            178,
            176
          ]
        }
      ],
      "sourceAtlas": "372de008-3015-4369-9790-96d999743f37",
      "sourceRow": 0,
      "animations": {
        "idle": [
          "idle-0",
          "idle-1"
        ],
        "attack": [
          "anticipation",
          "attack",
          "recover"
        ],
        "hurt": [
          "hurt"
        ],
        "move": [
          "ready",
          "step"
        ],
        "anticipation": [
          "anticipation"
        ],
        "recovery": [
          "recover"
        ],
        "death": [
          "death"
        ]
      }
    },
    "goblin.a09.normal.1": {
      "frameSize": [
        192,
        192
      ],
      "anchor": [
        96,
        176
      ],
      "facing": "left",
      "frames": [
        {
          "id": "idle-0",
          "file": "races/goblin/assets/a09-normal-1-0.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            33,
            50,
            159,
            176
          ],
          "sourceCrop": [
            0,
            145,
            171,
            291
          ]
        },
        {
          "id": "idle-1",
          "file": "races/goblin/assets/a09-normal-1-1.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            26,
            50,
            167,
            176
          ],
          "sourceCrop": [
            171,
            145,
            362,
            291
          ]
        },
        {
          "id": "ready",
          "file": "races/goblin/assets/a09-normal-1-2.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            40,
            50,
            152,
            176
          ],
          "sourceCrop": [
            362,
            145,
            516,
            291
          ]
        },
        {
          "id": "step",
          "file": "races/goblin/assets/a09-normal-1-3.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            29,
            52,
            163,
            176
          ],
          "sourceCrop": [
            516,
            145,
            695,
            291
          ]
        },
        {
          "id": "anticipation",
          "file": "races/goblin/assets/a09-normal-1-4.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            14,
            53,
            178,
            176
          ],
          "sourceCrop": [
            695,
            145,
            899,
            291
          ]
        },
        {
          "id": "attack",
          "file": "races/goblin/assets/a09-normal-1-5.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            20,
            81,
            172,
            176
          ],
          "sourceCrop": [
            899,
            145,
            1068,
            291
          ]
        },
        {
          "id": "hurt",
          "file": "races/goblin/assets/a09-normal-1-6.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            28,
            52,
            165,
            176
          ],
          "sourceCrop": [
            1068,
            145,
            1226,
            291
          ]
        },
        {
          "id": "recover",
          "file": "races/goblin/assets/a09-normal-1-7.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            31,
            51,
            161,
            176
          ],
          "sourceCrop": [
            1226,
            145,
            1402,
            291
          ]
        },
        {
          "id": "death",
          "file": "races/goblin/assets/a09-normal-1-death.png",
          "durationMs": 240,
          "facing": "left",
          "alphaBBox": [
            14,
            103,
            178,
            176
          ]
        }
      ],
      "sourceAtlas": "372de008-3015-4369-9790-96d999743f37",
      "sourceRow": 1,
      "animations": {
        "idle": [
          "idle-0",
          "idle-1"
        ],
        "attack": [
          "anticipation",
          "attack",
          "recover"
        ],
        "hurt": [
          "hurt"
        ],
        "move": [
          "ready",
          "step"
        ],
        "anticipation": [
          "anticipation"
        ],
        "recovery": [
          "recover"
        ],
        "death": [
          "death"
        ]
      }
    },
    "goblin.a09.normal.3": {
      "frameSize": [
        192,
        192
      ],
      "anchor": [
        96,
        176
      ],
      "facing": "left",
      "frames": [
        {
          "id": "idle-0",
          "file": "races/goblin/assets/a09-normal-3-0.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            31,
            78,
            161,
            176
          ],
          "sourceCrop": [
            0,
            291,
            171,
            418
          ]
        },
        {
          "id": "idle-1",
          "file": "races/goblin/assets/a09-normal-3-1.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            27,
            78,
            165,
            176
          ],
          "sourceCrop": [
            171,
            291,
            356,
            418
          ]
        },
        {
          "id": "ready",
          "file": "races/goblin/assets/a09-normal-3-2.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            34,
            78,
            158,
            176
          ],
          "sourceCrop": [
            356,
            291,
            515,
            418
          ]
        },
        {
          "id": "step",
          "file": "races/goblin/assets/a09-normal-3-3.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            29,
            79,
            164,
            176
          ],
          "sourceCrop": [
            515,
            291,
            700,
            418
          ]
        },
        {
          "id": "anticipation",
          "file": "races/goblin/assets/a09-normal-3-4.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            29,
            77,
            164,
            176
          ],
          "sourceCrop": [
            700,
            291,
            881,
            418
          ]
        },
        {
          "id": "attack",
          "file": "races/goblin/assets/a09-normal-3-5.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            14,
            79,
            178,
            176
          ],
          "sourceCrop": [
            881,
            291,
            1073,
            418
          ]
        },
        {
          "id": "hurt",
          "file": "races/goblin/assets/a09-normal-3-6.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            33,
            80,
            160,
            176
          ],
          "sourceCrop": [
            1073,
            291,
            1222,
            418
          ]
        },
        {
          "id": "recover",
          "file": "races/goblin/assets/a09-normal-3-7.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            33,
            78,
            159,
            176
          ],
          "sourceCrop": [
            1222,
            291,
            1402,
            418
          ]
        },
        {
          "id": "death",
          "file": "races/goblin/assets/a09-normal-3-death.png",
          "durationMs": 240,
          "facing": "left",
          "alphaBBox": [
            14,
            103,
            178,
            176
          ]
        }
      ],
      "sourceAtlas": "372de008-3015-4369-9790-96d999743f37",
      "sourceRow": 2,
      "animations": {
        "idle": [
          "idle-0",
          "idle-1"
        ],
        "attack": [
          "anticipation",
          "attack",
          "recover"
        ],
        "hurt": [
          "hurt"
        ],
        "move": [
          "ready",
          "step"
        ],
        "anticipation": [
          "anticipation"
        ],
        "recovery": [
          "recover"
        ],
        "death": [
          "death"
        ]
      }
    },
    "goblin.a09.elite": {
      "frameSize": [
        192,
        192
      ],
      "anchor": [
        96,
        176
      ],
      "facing": "left",
      "frames": [
        {
          "id": "idle-0",
          "file": "races/goblin/assets/a09-elite-0.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            27,
            72,
            166,
            176
          ],
          "sourceCrop": [
            0,
            418,
            192,
            553
          ]
        },
        {
          "id": "idle-1",
          "file": "races/goblin/assets/a09-elite-1.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            28,
            71,
            164,
            176
          ],
          "sourceCrop": [
            192,
            418,
            360,
            553
          ]
        },
        {
          "id": "ready",
          "file": "races/goblin/assets/a09-elite-2.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            28,
            71,
            165,
            176
          ],
          "sourceCrop": [
            360,
            418,
            536,
            553
          ]
        },
        {
          "id": "step",
          "file": "races/goblin/assets/a09-elite-3.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            32,
            73,
            161,
            176
          ],
          "sourceCrop": [
            536,
            418,
            707,
            553
          ]
        },
        {
          "id": "anticipation",
          "file": "races/goblin/assets/a09-elite-4.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            25,
            73,
            167,
            176
          ],
          "sourceCrop": [
            707,
            418,
            882,
            553
          ]
        },
        {
          "id": "attack",
          "file": "races/goblin/assets/a09-elite-5.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            34,
            78,
            158,
            176
          ],
          "sourceCrop": [
            882,
            418,
            1033,
            553
          ]
        },
        {
          "id": "hurt",
          "file": "races/goblin/assets/a09-elite-6.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            14,
            75,
            178,
            176
          ],
          "sourceCrop": [
            1033,
            418,
            1232,
            553
          ]
        },
        {
          "id": "recover",
          "file": "races/goblin/assets/a09-elite-7.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            35,
            71,
            157,
            176
          ],
          "sourceCrop": [
            1232,
            418,
            1402,
            553
          ]
        },
        {
          "id": "death",
          "file": "races/goblin/assets/a09-elite-death.png",
          "durationMs": 240,
          "facing": "left",
          "alphaBBox": [
            14,
            93,
            178,
            176
          ]
        }
      ],
      "sourceAtlas": "372de008-3015-4369-9790-96d999743f37",
      "sourceRow": 3,
      "animations": {
        "idle": [
          "idle-0",
          "idle-1"
        ],
        "attack": [
          "anticipation",
          "attack",
          "recover"
        ],
        "hurt": [
          "hurt"
        ],
        "move": [
          "ready",
          "step"
        ],
        "anticipation": [
          "anticipation"
        ],
        "recovery": [
          "recover"
        ],
        "death": [
          "death"
        ]
      }
    },
    "goblin.a10.normal.1": {
      "frameSize": [
        192,
        192
      ],
      "anchor": [
        96,
        176
      ],
      "facing": "left",
      "frames": [
        {
          "id": "idle-0",
          "file": "races/goblin/assets/a10-normal-1-0.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            22,
            59,
            170,
            176
          ],
          "sourceCrop": [
            0,
            553,
            165,
            688
          ]
        },
        {
          "id": "idle-1",
          "file": "races/goblin/assets/a10-normal-1-1.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            22,
            58,
            171,
            176
          ],
          "sourceCrop": [
            165,
            553,
            343,
            688
          ]
        },
        {
          "id": "ready",
          "file": "races/goblin/assets/a10-normal-1-2.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            24,
            60,
            169,
            176
          ],
          "sourceCrop": [
            343,
            553,
            523,
            688
          ]
        },
        {
          "id": "step",
          "file": "races/goblin/assets/a10-normal-1-3.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            15,
            61,
            177,
            176
          ],
          "sourceCrop": [
            523,
            553,
            712,
            688
          ]
        },
        {
          "id": "anticipation",
          "file": "races/goblin/assets/a10-normal-1-4.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            14,
            57,
            178,
            176
          ],
          "sourceCrop": [
            712,
            553,
            900,
            688
          ]
        },
        {
          "id": "attack",
          "file": "races/goblin/assets/a10-normal-1-5.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            35,
            58,
            157,
            176
          ],
          "sourceCrop": [
            900,
            553,
            1027,
            688
          ]
        },
        {
          "id": "hurt",
          "file": "races/goblin/assets/a10-normal-1-6.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            19,
            71,
            173,
            176
          ],
          "sourceCrop": [
            1027,
            553,
            1202,
            688
          ]
        },
        {
          "id": "recover",
          "file": "races/goblin/assets/a10-normal-1-7.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            19,
            60,
            173,
            176
          ],
          "sourceCrop": [
            1202,
            553,
            1402,
            688
          ]
        },
        {
          "id": "death",
          "file": "races/goblin/assets/a10-normal-1-death.png",
          "durationMs": 240,
          "facing": "left",
          "alphaBBox": [
            14,
            93,
            178,
            176
          ]
        }
      ],
      "sourceAtlas": "372de008-3015-4369-9790-96d999743f37",
      "sourceRow": 4,
      "animations": {
        "idle": [
          "idle-0",
          "idle-1"
        ],
        "attack": [
          "anticipation",
          "attack",
          "recover"
        ],
        "hurt": [
          "hurt"
        ],
        "move": [
          "ready",
          "step"
        ],
        "anticipation": [
          "anticipation"
        ],
        "recovery": [
          "recover"
        ],
        "death": [
          "death"
        ]
      }
    },
    "goblin.a10.normal.2": {
      "frameSize": [
        192,
        192
      ],
      "anchor": [
        96,
        176
      ],
      "facing": "left",
      "frames": [
        {
          "id": "idle-0",
          "file": "races/goblin/assets/a10-normal-2-0.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            18,
            83,
            175,
            176
          ],
          "sourceCrop": [
            0,
            688,
            188,
            800
          ]
        },
        {
          "id": "idle-1",
          "file": "races/goblin/assets/a10-normal-2-1.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            15,
            86,
            177,
            176
          ],
          "sourceCrop": [
            188,
            688,
            372,
            800
          ]
        },
        {
          "id": "ready",
          "file": "races/goblin/assets/a10-normal-2-2.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            18,
            83,
            174,
            176
          ],
          "sourceCrop": [
            372,
            688,
            549,
            800
          ]
        },
        {
          "id": "step",
          "file": "races/goblin/assets/a10-normal-2-3.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            20,
            82,
            173,
            176
          ],
          "sourceCrop": [
            549,
            688,
            723,
            800
          ]
        },
        {
          "id": "anticipation",
          "file": "races/goblin/assets/a10-normal-2-4.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            23,
            83,
            170,
            176
          ],
          "sourceCrop": [
            723,
            688,
            890,
            800
          ]
        },
        {
          "id": "attack",
          "file": "races/goblin/assets/a10-normal-2-5.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            36,
            113,
            157,
            176
          ],
          "sourceCrop": [
            890,
            688,
            1027,
            800
          ]
        },
        {
          "id": "hurt",
          "file": "races/goblin/assets/a10-normal-2-6.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            16,
            87,
            176,
            176
          ],
          "sourceCrop": [
            1027,
            688,
            1208,
            800
          ]
        },
        {
          "id": "recover",
          "file": "races/goblin/assets/a10-normal-2-7.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            14,
            84,
            178,
            176
          ],
          "sourceCrop": [
            1208,
            688,
            1402,
            800
          ]
        },
        {
          "id": "death",
          "file": "races/goblin/assets/a10-normal-2-death.png",
          "durationMs": 240,
          "facing": "left",
          "alphaBBox": [
            15,
            26,
            177,
            176
          ]
        }
      ],
      "sourceAtlas": "372de008-3015-4369-9790-96d999743f37",
      "sourceRow": 5,
      "animations": {
        "idle": [
          "idle-0",
          "idle-1"
        ],
        "attack": [
          "anticipation",
          "attack",
          "recover"
        ],
        "hurt": [
          "hurt"
        ],
        "move": [
          "ready",
          "step"
        ],
        "anticipation": [
          "anticipation"
        ],
        "recovery": [
          "recover"
        ],
        "death": [
          "death"
        ]
      }
    },
    "goblin.a10.normal.3": {
      "frameSize": [
        192,
        192
      ],
      "anchor": [
        96,
        176
      ],
      "facing": "left",
      "frames": [
        {
          "id": "idle-0",
          "file": "races/goblin/assets/a10-normal-3-0.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            22,
            79,
            171,
            176
          ],
          "sourceCrop": [
            0,
            800,
            198,
            924
          ]
        },
        {
          "id": "idle-1",
          "file": "races/goblin/assets/a10-normal-3-1.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            28,
            81,
            165,
            176
          ],
          "sourceCrop": [
            198,
            800,
            373,
            924
          ]
        },
        {
          "id": "ready",
          "file": "races/goblin/assets/a10-normal-3-2.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            30,
            81,
            163,
            176
          ],
          "sourceCrop": [
            373,
            800,
            540,
            924
          ]
        },
        {
          "id": "step",
          "file": "races/goblin/assets/a10-normal-3-3.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            29,
            81,
            163,
            176
          ],
          "sourceCrop": [
            540,
            800,
            702,
            924
          ]
        },
        {
          "id": "anticipation",
          "file": "races/goblin/assets/a10-normal-3-4.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            14,
            80,
            178,
            176
          ],
          "sourceCrop": [
            702,
            800,
            900,
            924
          ]
        },
        {
          "id": "attack",
          "file": "races/goblin/assets/a10-normal-3-5.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            44,
            106,
            149,
            176
          ],
          "sourceCrop": [
            900,
            800,
            1027,
            924
          ]
        },
        {
          "id": "hurt",
          "file": "races/goblin/assets/a10-normal-3-6.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            26,
            91,
            167,
            176
          ],
          "sourceCrop": [
            1027,
            800,
            1202,
            924
          ]
        },
        {
          "id": "recover",
          "file": "races/goblin/assets/a10-normal-3-7.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            22,
            81,
            171,
            176
          ],
          "sourceCrop": [
            1202,
            800,
            1402,
            924
          ]
        },
        {
          "id": "death",
          "file": "races/goblin/assets/a10-normal-3-death.png",
          "durationMs": 240,
          "facing": "left",
          "alphaBBox": [
            14,
            95,
            178,
            176
          ]
        }
      ],
      "sourceAtlas": "372de008-3015-4369-9790-96d999743f37",
      "sourceRow": 6,
      "animations": {
        "idle": [
          "idle-0",
          "idle-1"
        ],
        "attack": [
          "anticipation",
          "attack",
          "recover"
        ],
        "hurt": [
          "hurt"
        ],
        "move": [
          "ready",
          "step"
        ],
        "anticipation": [
          "anticipation"
        ],
        "recovery": [
          "recover"
        ],
        "death": [
          "death"
        ]
      }
    },
    "goblin.a10.elite": {
      "frameSize": [
        192,
        192
      ],
      "anchor": [
        96,
        176
      ],
      "facing": "left",
      "frames": [
        {
          "id": "idle-0",
          "file": "races/goblin/assets/a10-elite-0.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            16,
            18,
            176,
            176
          ],
          "sourceCrop": [
            0,
            924,
            189,
            1122
          ]
        },
        {
          "id": "idle-1",
          "file": "races/goblin/assets/a10-elite-1.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            18,
            19,
            174,
            176
          ],
          "sourceCrop": [
            189,
            924,
            374,
            1122
          ]
        },
        {
          "id": "ready",
          "file": "races/goblin/assets/a10-elite-2.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            18,
            19,
            174,
            176
          ],
          "sourceCrop": [
            374,
            924,
            550,
            1122
          ]
        },
        {
          "id": "step",
          "file": "races/goblin/assets/a10-elite-3.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            19,
            19,
            174,
            176
          ],
          "sourceCrop": [
            550,
            924,
            725,
            1122
          ]
        },
        {
          "id": "anticipation",
          "file": "races/goblin/assets/a10-elite-4.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            26,
            18,
            167,
            176
          ],
          "sourceCrop": [
            725,
            924,
            885,
            1122
          ]
        },
        {
          "id": "attack",
          "file": "races/goblin/assets/a10-elite-5.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            32,
            21,
            161,
            176
          ],
          "sourceCrop": [
            885,
            924,
            1031,
            1122
          ]
        },
        {
          "id": "hurt",
          "file": "races/goblin/assets/a10-elite-6.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            18,
            16,
            174,
            176
          ],
          "sourceCrop": [
            1031,
            924,
            1207,
            1122
          ]
        },
        {
          "id": "recover",
          "file": "races/goblin/assets/a10-elite-7.png",
          "durationMs": 120,
          "facing": "left",
          "alphaBBox": [
            20,
            18,
            172,
            176
          ],
          "sourceCrop": [
            1207,
            924,
            1402,
            1122
          ]
        },
        {
          "id": "death",
          "file": "races/goblin/assets/a10-elite-death.png",
          "durationMs": 240,
          "facing": "left",
          "alphaBBox": [
            14,
            36,
            178,
            176
          ]
        }
      ],
      "sourceAtlas": "372de008-3015-4369-9790-96d999743f37",
      "sourceRow": 7,
      "animations": {
        "idle": [
          "idle-0",
          "idle-1"
        ],
        "attack": [
          "anticipation",
          "attack",
          "recover"
        ],
        "hurt": [
          "hurt"
        ],
        "move": [
          "ready",
          "step"
        ],
        "anticipation": [
          "anticipation"
        ],
        "recovery": [
          "recover"
        ],
        "death": [
          "death"
        ]
      }
    }
  },
  "areas": {
    "goblin.a01": {
      "file": "races/goblin/assets/area-01.png",
      "width": 480,
      "height": 270,
      "baselineY": 203
    },
    "goblin.a02": {
      "file": "races/goblin/assets/area-02.png",
      "width": 480,
      "height": 270,
      "baselineY": 203
    },
    "goblin.a03": {
      "file": "races/goblin/assets/area-03.png",
      "width": 480,
      "height": 270,
      "baselineY": 203
    },
    "goblin.a04": {
      "file": "races/goblin/assets/area-04.png",
      "width": 480,
      "height": 270,
      "baselineY": 203
    },
    "goblin.a05": {
      "file": "races/goblin/assets/area-05.png",
      "width": 480,
      "height": 270,
      "baselineY": 203
    },
    "goblin.a06": {
      "file": "races/goblin/assets/area-06.png",
      "width": 480,
      "height": 270,
      "baselineY": 203
    },
    "goblin.a07": {
      "file": "races/goblin/assets/area-07.png",
      "width": 480,
      "height": 270,
      "baselineY": 203
    },
    "goblin.a08": {
      "file": "races/goblin/assets/area-08.png",
      "width": 480,
      "height": 270,
      "baselineY": 203
    },
    "goblin.a09": {
      "file": "races/goblin/assets/area-09.png",
      "width": 480,
      "height": 270,
      "baselineY": 203
    },
    "goblin.a10": {
      "file": "races/goblin/assets/area-10.png",
      "width": 480,
      "height": 270,
      "baselineY": 203
    }
  },
  "equipment": {
    "goblin_scatter_weapon_1": {
      "file": "races/goblin/assets/icon-goblin_scatter_weapon_1.png",
      "width": 48,
      "height": 48
    },
    "goblin_scatter_weapon_2": {
      "file": "races/goblin/assets/icon-goblin_scatter_weapon_2.png",
      "width": 48,
      "height": 48
    },
    "goblin_scatter_weapon_3": {
      "file": "races/goblin/assets/icon-goblin_scatter_weapon_3.png",
      "width": 48,
      "height": 48
    },
    "goblin_scatter_weapon_4": {
      "file": "races/goblin/assets/icon-goblin_scatter_weapon_4.png",
      "width": 48,
      "height": 48
    },
    "goblin_scatter_weapon_5": {
      "file": "races/goblin/assets/icon-goblin_scatter_weapon_5.png",
      "width": 48,
      "height": 48
    },
    "goblin_scatter_weapon_6": {
      "file": "races/goblin/assets/icon-goblin_scatter_weapon_6.png",
      "width": 48,
      "height": 48
    },
    "goblin_scatter_helm_1": {
      "file": "races/goblin/assets/icon-goblin_scatter_helm_1.png",
      "width": 48,
      "height": 48
    },
    "goblin_scatter_helm_2": {
      "file": "races/goblin/assets/icon-goblin_scatter_helm_2.png",
      "width": 48,
      "height": 48
    },
    "goblin_scatter_helm_3": {
      "file": "races/goblin/assets/icon-goblin_scatter_helm_3.png",
      "width": 48,
      "height": 48
    },
    "goblin_scatter_helm_4": {
      "file": "races/goblin/assets/icon-goblin_scatter_helm_4.png",
      "width": 48,
      "height": 48
    },
    "goblin_scatter_helm_5": {
      "file": "races/goblin/assets/icon-goblin_scatter_helm_5.png",
      "width": 48,
      "height": 48
    },
    "goblin_scatter_armor_1": {
      "file": "races/goblin/assets/icon-goblin_scatter_armor_1.png",
      "width": 48,
      "height": 48
    },
    "goblin_scatter_armor_2": {
      "file": "races/goblin/assets/icon-goblin_scatter_armor_2.png",
      "width": 48,
      "height": 48
    },
    "goblin_scatter_armor_3": {
      "file": "races/goblin/assets/icon-goblin_scatter_armor_3.png",
      "width": 48,
      "height": 48
    },
    "goblin_scatter_armor_4": {
      "file": "races/goblin/assets/icon-goblin_scatter_armor_4.png",
      "width": 48,
      "height": 48
    },
    "goblin_scatter_armor_5": {
      "file": "races/goblin/assets/icon-goblin_scatter_armor_5.png",
      "width": 48,
      "height": 48
    },
    "goblin_scatter_gloves_1": {
      "file": "races/goblin/assets/icon-goblin_scatter_gloves_1.png",
      "width": 48,
      "height": 48
    },
    "goblin_scatter_gloves_2": {
      "file": "races/goblin/assets/icon-goblin_scatter_gloves_2.png",
      "width": 48,
      "height": 48
    },
    "goblin_scatter_gloves_3": {
      "file": "races/goblin/assets/icon-goblin_scatter_gloves_3.png",
      "width": 48,
      "height": 48
    },
    "goblin_scatter_gloves_4": {
      "file": "races/goblin/assets/icon-goblin_scatter_gloves_4.png",
      "width": 48,
      "height": 48
    },
    "goblin_scatter_gloves_5": {
      "file": "races/goblin/assets/icon-goblin_scatter_gloves_5.png",
      "width": 48,
      "height": 48
    },
    "goblin_scatter_boots_1": {
      "file": "races/goblin/assets/icon-goblin_scatter_boots_1.png",
      "width": 48,
      "height": 48
    },
    "goblin_scatter_boots_2": {
      "file": "races/goblin/assets/icon-goblin_scatter_boots_2.png",
      "width": 48,
      "height": 48
    },
    "goblin_scatter_boots_3": {
      "file": "races/goblin/assets/icon-goblin_scatter_boots_3.png",
      "width": 48,
      "height": 48
    },
    "goblin_scatter_boots_4": {
      "file": "races/goblin/assets/icon-goblin_scatter_boots_4.png",
      "width": 48,
      "height": 48
    },
    "goblin_scatter_boots_5": {
      "file": "races/goblin/assets/icon-goblin_scatter_boots_5.png",
      "width": 48,
      "height": 48
    },
    "goblin_scatter_ring_1": {
      "file": "races/goblin/assets/icon-goblin_scatter_ring_1.png",
      "width": 48,
      "height": 48
    },
    "goblin_scatter_ring_2": {
      "file": "races/goblin/assets/icon-goblin_scatter_ring_2.png",
      "width": 48,
      "height": 48
    },
    "goblin_scatter_ring_3": {
      "file": "races/goblin/assets/icon-goblin_scatter_ring_3.png",
      "width": 48,
      "height": 48
    },
    "goblin_scatter_ring_4": {
      "file": "races/goblin/assets/icon-goblin_scatter_ring_4.png",
      "width": 48,
      "height": 48
    },
    "goblin_scatter_ring_5": {
      "file": "races/goblin/assets/icon-goblin_scatter_ring_5.png",
      "width": 48,
      "height": 48
    },
    "goblin_scatter_amulet_1": {
      "file": "races/goblin/assets/icon-goblin_scatter_amulet_1.png",
      "width": 48,
      "height": 48
    },
    "goblin_scatter_amulet_2": {
      "file": "races/goblin/assets/icon-goblin_scatter_amulet_2.png",
      "width": 48,
      "height": 48
    },
    "goblin_scatter_amulet_3": {
      "file": "races/goblin/assets/icon-goblin_scatter_amulet_3.png",
      "width": 48,
      "height": 48
    },
    "goblin_scatter_amulet_4": {
      "file": "races/goblin/assets/icon-goblin_scatter_amulet_4.png",
      "width": 48,
      "height": 48
    },
    "goblin_scatter_amulet_5": {
      "file": "races/goblin/assets/icon-goblin_scatter_amulet_5.png",
      "width": 48,
      "height": 48
    },
    "goblin_spore_helm": {
      "file": "races/goblin/assets/icon-goblin_spore_helm.png",
      "width": 48,
      "height": 48
    },
    "goblin_spore_armor": {
      "file": "races/goblin/assets/icon-goblin_spore_armor.png",
      "width": 48,
      "height": 48
    },
    "goblin_spore_gloves": {
      "file": "races/goblin/assets/icon-goblin_spore_gloves.png",
      "width": 48,
      "height": 48
    },
    "goblin_spore_boots": {
      "file": "races/goblin/assets/icon-goblin_spore_boots.png",
      "width": 48,
      "height": 48
    },
    "goblin_ambush_helm": {
      "file": "races/goblin/assets/icon-goblin_ambush_helm.png",
      "width": 48,
      "height": 48
    },
    "goblin_ambush_armor": {
      "file": "races/goblin/assets/icon-goblin_ambush_armor.png",
      "width": 48,
      "height": 48
    },
    "goblin_ambush_gloves": {
      "file": "races/goblin/assets/icon-goblin_ambush_gloves.png",
      "width": 48,
      "height": 48
    },
    "goblin_ambush_boots": {
      "file": "races/goblin/assets/icon-goblin_ambush_boots.png",
      "width": 48,
      "height": 48
    },
    "goblin_snare_helm": {
      "file": "races/goblin/assets/icon-goblin_snare_helm.png",
      "width": 48,
      "height": 48
    },
    "goblin_snare_armor": {
      "file": "races/goblin/assets/icon-goblin_snare_armor.png",
      "width": 48,
      "height": 48
    },
    "goblin_snare_gloves": {
      "file": "races/goblin/assets/icon-goblin_snare_gloves.png",
      "width": 48,
      "height": 48
    },
    "goblin_snare_boots": {
      "file": "races/goblin/assets/icon-goblin_snare_boots.png",
      "width": 48,
      "height": 48
    },
    "goblin-silent-ration": {
      "file": "races/goblin/assets/icon-goblin-silent-ration.png",
      "width": 48,
      "height": 48
    },
    "goblin-returning-spring": {
      "file": "races/goblin/assets/icon-goblin-returning-spring.png",
      "width": 48,
      "height": 48
    }
  },
  "skills": {
    "goblin.venom_cut": {
      "file": "races/goblin/assets/icon-goblin-venom_cut.png",
      "width": 48,
      "height": 48
    },
    "goblin.spore_fan": {
      "file": "races/goblin/assets/icon-goblin-spore_fan.png",
      "width": 48,
      "height": 48
    },
    "goblin.bitter_wound": {
      "file": "races/goblin/assets/icon-goblin-bitter_wound.png",
      "width": 48,
      "height": 48
    },
    "goblin.spore_transfer": {
      "file": "races/goblin/assets/icon-goblin-spore_transfer.png",
      "width": 48,
      "height": 48
    },
    "goblin.toxic_feint": {
      "file": "races/goblin/assets/icon-goblin-toxic_feint.png",
      "width": 48,
      "height": 48
    },
    "goblin.mire_seal": {
      "file": "races/goblin/assets/icon-goblin-mire_seal.png",
      "width": 48,
      "height": 48
    },
    "goblin.opening_cut": {
      "file": "races/goblin/assets/icon-goblin-opening_cut.png",
      "width": 48,
      "height": 48
    },
    "goblin.seam_step": {
      "file": "races/goblin/assets/icon-goblin-seam_step.png",
      "width": 48,
      "height": 48
    },
    "goblin.finish_cut": {
      "file": "races/goblin/assets/icon-goblin-finish_cut.png",
      "width": 48,
      "height": 48
    },
    "goblin.stolen_moment": {
      "file": "races/goblin/assets/icon-goblin-stolen_moment.png",
      "width": 48,
      "height": 48
    },
    "goblin.crossing_blade": {
      "file": "races/goblin/assets/icon-goblin-crossing_blade.png",
      "width": 48,
      "height": 48
    },
    "goblin.ration_rush": {
      "file": "races/goblin/assets/icon-goblin-ration_rush.png",
      "width": 48,
      "height": 48
    },
    "goblin.snare_wire": {
      "file": "races/goblin/assets/icon-goblin-snare_wire.png",
      "width": 48,
      "height": 48
    },
    "goblin.rattle_decoy": {
      "file": "races/goblin/assets/icon-goblin-rattle_decoy.png",
      "width": 48,
      "height": 48
    },
    "goblin.tangle_cut": {
      "file": "races/goblin/assets/icon-goblin-tangle_cut.png",
      "width": 48,
      "height": 48
    },
    "goblin.spring_scatter": {
      "file": "races/goblin/assets/icon-goblin-spring_scatter.png",
      "width": 48,
      "height": 48
    },
    "goblin.jam_joint": {
      "file": "races/goblin/assets/icon-goblin-jam_joint.png",
      "width": 48,
      "height": 48
    },
    "goblin.braced_lure": {
      "file": "races/goblin/assets/icon-goblin-braced_lure.png",
      "width": 48,
      "height": 48
    },
    "goblin.patch_ration": {
      "file": "races/goblin/assets/icon-goblin-patch_ration.png",
      "width": 48,
      "height": 48
    },
    "goblin.dust_escape": {
      "file": "races/goblin/assets/icon-goblin-dust_escape.png",
      "width": 48,
      "height": 48
    },
    "goblin.shed_binding": {
      "file": "races/goblin/assets/icon-goblin-shed_binding.png",
      "width": 48,
      "height": 48
    },
    "goblin.spore_lore": {
      "file": "races/goblin/assets/icon-goblin-spore_lore.png",
      "width": 48,
      "height": 48
    },
    "goblin.bitter_edge": {
      "file": "races/goblin/assets/icon-goblin-bitter_edge.png",
      "width": 48,
      "height": 48
    },
    "goblin.light_pack": {
      "file": "races/goblin/assets/icon-goblin-light_pack.png",
      "width": 48,
      "height": 48
    },
    "goblin.scout_breath": {
      "file": "races/goblin/assets/icon-goblin-scout_breath.png",
      "width": 48,
      "height": 48
    },
    "goblin.copper_brace": {
      "file": "races/goblin/assets/icon-goblin-copper_brace.png",
      "width": 48,
      "height": 48
    },
    "goblin.tendon_knots": {
      "file": "races/goblin/assets/icon-goblin-tendon_knots.png",
      "width": 48,
      "height": 48
    },
    "goblin.tunnel_survivor": {
      "file": "races/goblin/assets/icon-goblin-tunnel_survivor.png",
      "width": 48,
      "height": 48
    },
    "goblin.ration_sense": {
      "file": "races/goblin/assets/icon-goblin-ration_sense.png",
      "width": 48,
      "height": 48
    },
    "goblin.quiet_step": {
      "file": "races/goblin/assets/icon-goblin-quiet_step.png",
      "width": 48,
      "height": 48
    }
  },
  "materials": {
    "goblin.mat.01": {
      "file": "races/goblin/assets/icon-goblin-mat-01.png",
      "width": 48,
      "height": 48
    },
    "goblin.mat.02": {
      "file": "races/goblin/assets/icon-goblin-mat-02.png",
      "width": 48,
      "height": 48
    },
    "goblin.mat.03": {
      "file": "races/goblin/assets/icon-goblin-mat-03.png",
      "width": 48,
      "height": 48
    },
    "goblin.mat.04": {
      "file": "races/goblin/assets/icon-goblin-mat-04.png",
      "width": 48,
      "height": 48
    },
    "goblin.mat.05": {
      "file": "races/goblin/assets/icon-goblin-mat-05.png",
      "width": 48,
      "height": 48
    },
    "goblin.mat.06": {
      "file": "races/goblin/assets/icon-goblin-mat-06.png",
      "width": 48,
      "height": 48
    },
    "goblin.mat.07": {
      "file": "races/goblin/assets/icon-goblin-mat-07.png",
      "width": 48,
      "height": 48
    },
    "goblin.mat.08": {
      "file": "races/goblin/assets/icon-goblin-mat-08.png",
      "width": 48,
      "height": 48
    },
    "goblin.mat.09": {
      "file": "races/goblin/assets/icon-goblin-mat-09.png",
      "width": 48,
      "height": 48
    },
    "goblin.mat.10": {
      "file": "races/goblin/assets/icon-goblin-mat-10.png",
      "width": 48,
      "height": 48
    },
    "goblin.mat.11": {
      "file": "races/goblin/assets/icon-goblin-mat-11.png",
      "width": 48,
      "height": 48
    },
    "goblin.mat.12": {
      "file": "races/goblin/assets/icon-goblin-mat-12.png",
      "width": 48,
      "height": 48
    },
    "goblin.mat.13": {
      "file": "races/goblin/assets/icon-goblin-mat-13.png",
      "width": 48,
      "height": 48
    },
    "goblin.mat.14": {
      "file": "races/goblin/assets/icon-goblin-mat-14.png",
      "width": 48,
      "height": 48
    },
    "goblin.mat.15": {
      "file": "races/goblin/assets/icon-goblin-mat-15.png",
      "width": 48,
      "height": 48
    },
    "goblin.mat.16": {
      "file": "races/goblin/assets/icon-goblin-mat-16.png",
      "width": 48,
      "height": 48
    },
    "goblin.infinity_gem_goblin": {
      "file": "races/goblin/assets/icon-goblin-infinity_gem_goblin.png",
      "width": 48,
      "height": 48
    },
    "goblin.return_token_goblin": {
      "file": "races/goblin/assets/icon-goblin-return_token_goblin.png",
      "width": 48,
      "height": 48
    }
  },
  "camp": "battle-assets/backgrounds/camp-goblin.png"
};
