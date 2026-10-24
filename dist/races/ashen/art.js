export const art={
  "hero": {
    "frameSize": [
      192,
      192
    ],
    "anchor": [
      96,
      176
    ],
    "facing": "right",
    "frames": [
      {
        "id": "idle-0",
        "file": "races/ashen/art/hero-idle-0.png",
        "durationMs": 160,
        "alphaBBox": [
          44,
          54,
          147,
          191
        ]
      },
      {
        "id": "strike",
        "file": "races/ashen/art/hero-strike.png",
        "durationMs": 160,
        "alphaBBox": [
          10,
          74,
          182,
          176
        ]
      },
      {
        "id": "hurt",
        "file": "races/ashen/art/hero-hurt.png",
        "durationMs": 160,
        "alphaBBox": [
          44,
          40,
          147,
          191
        ]
      },
      {
        "id": "channel",
        "file": "races/ashen/art/hero-channel.png",
        "durationMs": 160,
        "alphaBBox": [
          51,
          52,
          141,
          177
        ]
      },
      {
        "id": "death",
        "file": "races/ashen/art/hero-hammer-death.png",
        "durationMs": 650,
        "alphaBBox": [
          15,
          128,
          176,
          176
        ]
      }
    ],
    "animations": {
      "idle": [
        "idle-0"
      ],
      "attack": [
        "idle-0",
        "strike",
        "strike",
        "idle-0"
      ],
      "hurt": [
        "hurt",
        "idle-0"
      ],
      "death": [
        "death"
      ]
    },
    "headY": 55,
    "healthBarAnchor": [
      96,
      43
    ],
    "weaponFamily": "hammer"
  },
  "monsters": {
    "ashen.a01.normal.1": {
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
          "file": "races/ashen/art/ashen.a01.normal.1.png",
          "durationMs": 160,
          "alphaBBox": [
            32,
            78,
            159,
            176
          ],
          "sourceCrop": [
            0,
            0,
            247,
            272
          ]
        },
        {
          "id": "strike",
          "file": "races/ashen/art/ashen.a01.normal.1-strike.png",
          "durationMs": 160,
          "alphaBBox": [
            22,
            64,
            170,
            176
          ],
          "sourceCrop": [
            247,
            0,
            522,
            272
          ]
        },
        {
          "id": "hurt",
          "file": "races/ashen/art/ashen.a01.normal.1-hurt.png",
          "durationMs": 160,
          "alphaBBox": [
            36,
            79,
            156,
            176
          ],
          "sourceCrop": [
            522,
            0,
            760,
            272
          ]
        },
        {
          "id": "death",
          "file": "races/ashen/art/ashen.a01.normal.1-death.png",
          "durationMs": 650,
          "alphaBBox": [
            26,
            107,
            165,
            176
          ],
          "sourceCrop": [
            760,
            0,
            1024,
            272
          ]
        }
      ],
      "animations": {
        "idle": [
          "idle-0"
        ],
        "attack": [
          "idle-0",
          "strike",
          "strike",
          "idle-0"
        ],
        "hurt": [
          "hurt",
          "idle-0"
        ],
        "death": [
          "death"
        ]
      },
      "headY": 55,
      "healthBarAnchor": [
        96,
        43
      ]
    },
    "ashen.a01.normal.2": {
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
          "file": "races/ashen/art/ashen.a01.normal.2.png",
          "durationMs": 160,
          "alphaBBox": [
            32,
            85,
            160,
            176
          ],
          "sourceCrop": [
            0,
            272,
            247,
            517
          ]
        },
        {
          "id": "strike",
          "file": "races/ashen/art/ashen.a01.normal.2-strike.png",
          "durationMs": 160,
          "alphaBBox": [
            22,
            80,
            170,
            176
          ],
          "sourceCrop": [
            247,
            272,
            524,
            517
          ]
        },
        {
          "id": "hurt",
          "file": "races/ashen/art/ashen.a01.normal.2-hurt.png",
          "durationMs": 160,
          "alphaBBox": [
            33,
            73,
            158,
            176
          ],
          "sourceCrop": [
            524,
            272,
            766,
            517
          ]
        },
        {
          "id": "death",
          "file": "races/ashen/art/ashen.a01.normal.2-death.png",
          "durationMs": 650,
          "alphaBBox": [
            25,
            99,
            167,
            176
          ],
          "sourceCrop": [
            766,
            272,
            1024,
            517
          ]
        }
      ],
      "animations": {
        "idle": [
          "idle-0"
        ],
        "attack": [
          "idle-0",
          "strike",
          "strike",
          "idle-0"
        ],
        "hurt": [
          "hurt",
          "idle-0"
        ],
        "death": [
          "death"
        ]
      },
      "headY": 55,
      "healthBarAnchor": [
        96,
        43
      ]
    },
    "ashen.a01.normal.3": {
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
          "file": "races/ashen/art/ashen.a01.normal.3.png",
          "durationMs": 160,
          "alphaBBox": [
            32,
            90,
            160,
            176
          ],
          "sourceCrop": [
            0,
            517,
            251,
            760
          ]
        },
        {
          "id": "strike",
          "file": "races/ashen/art/ashen.a01.normal.3-strike.png",
          "durationMs": 160,
          "alphaBBox": [
            23,
            86,
            170,
            176
          ],
          "sourceCrop": [
            251,
            517,
            531,
            760
          ]
        },
        {
          "id": "hurt",
          "file": "races/ashen/art/ashen.a01.normal.3-hurt.png",
          "durationMs": 160,
          "alphaBBox": [
            35,
            67,
            157,
            176
          ],
          "sourceCrop": [
            531,
            517,
            776,
            760
          ]
        },
        {
          "id": "death",
          "file": "races/ashen/art/ashen.a01.normal.3-death.png",
          "durationMs": 650,
          "alphaBBox": [
            34,
            120,
            156,
            176
          ],
          "sourceCrop": [
            776,
            517,
            1024,
            760
          ]
        }
      ],
      "animations": {
        "idle": [
          "idle-0"
        ],
        "attack": [
          "idle-0",
          "strike",
          "strike",
          "idle-0"
        ],
        "hurt": [
          "hurt",
          "idle-0"
        ],
        "death": [
          "death"
        ]
      },
      "headY": 55,
      "healthBarAnchor": [
        96,
        43
      ]
    },
    "ashen.a01.elite": {
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
          "file": "races/ashen/art/ashen.a01.elite.png",
          "durationMs": 160,
          "alphaBBox": [
            43,
            38,
            148,
            176
          ],
          "sourceCrop": [
            0,
            760,
            241,
            1049
          ]
        },
        {
          "id": "strike",
          "file": "races/ashen/art/ashen.a01.elite-strike.png",
          "durationMs": 160,
          "alphaBBox": [
            27,
            70,
            164,
            176
          ],
          "sourceCrop": [
            241,
            760,
            533,
            1049
          ]
        },
        {
          "id": "hurt",
          "file": "races/ashen/art/ashen.a01.elite-hurt.png",
          "durationMs": 160,
          "alphaBBox": [
            50,
            44,
            142,
            176
          ],
          "sourceCrop": [
            533,
            760,
            758,
            1049
          ]
        },
        {
          "id": "death",
          "file": "races/ashen/art/ashen.a01.elite-death.png",
          "durationMs": 650,
          "alphaBBox": [
            32,
            100,
            160,
            176
          ],
          "sourceCrop": [
            758,
            760,
            1024,
            1049
          ]
        }
      ],
      "animations": {
        "idle": [
          "idle-0"
        ],
        "attack": [
          "idle-0",
          "strike",
          "strike",
          "idle-0"
        ],
        "hurt": [
          "hurt",
          "idle-0"
        ],
        "death": [
          "death"
        ]
      },
      "headY": 55,
      "healthBarAnchor": [
        96,
        43
      ]
    },
    "ashen.a02.normal.1": {
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
          "file": "races/ashen/art/ashen.a02.normal.1.png",
          "durationMs": 160,
          "alphaBBox": [
            31,
            77,
            160,
            176
          ],
          "sourceCrop": [
            0,
            1049,
            251,
            1302
          ]
        },
        {
          "id": "strike",
          "file": "races/ashen/art/ashen.a02.normal.1-strike.png",
          "durationMs": 160,
          "alphaBBox": [
            22,
            53,
            170,
            176
          ],
          "sourceCrop": [
            251,
            1049,
            531,
            1302
          ]
        },
        {
          "id": "hurt",
          "file": "races/ashen/art/ashen.a02.normal.1-hurt.png",
          "durationMs": 160,
          "alphaBBox": [
            35,
            61,
            157,
            176
          ],
          "sourceCrop": [
            531,
            1049,
            769,
            1302
          ]
        },
        {
          "id": "death",
          "file": "races/ashen/art/ashen.a02.normal.1-death.png",
          "durationMs": 650,
          "alphaBBox": [
            28,
            130,
            164,
            176
          ],
          "sourceCrop": [
            769,
            1049,
            1024,
            1302
          ]
        }
      ],
      "animations": {
        "idle": [
          "idle-0"
        ],
        "attack": [
          "idle-0",
          "strike",
          "strike",
          "idle-0"
        ],
        "hurt": [
          "hurt",
          "idle-0"
        ],
        "death": [
          "death"
        ]
      },
      "headY": 55,
      "healthBarAnchor": [
        96,
        43
      ]
    },
    "ashen.a02.normal.2": {
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
          "file": "races/ashen/art/ashen.a02.normal.2.png",
          "durationMs": 160,
          "alphaBBox": [
            28,
            113,
            163,
            176
          ],
          "sourceCrop": [
            0,
            1302,
            258,
            1536
          ]
        },
        {
          "id": "strike",
          "file": "races/ashen/art/ashen.a02.normal.2-strike.png",
          "durationMs": 160,
          "alphaBBox": [
            22,
            98,
            170,
            176
          ],
          "sourceCrop": [
            258,
            1302,
            534,
            1536
          ]
        },
        {
          "id": "hurt",
          "file": "races/ashen/art/ashen.a02.normal.2-hurt.png",
          "durationMs": 160,
          "alphaBBox": [
            33,
            79,
            159,
            176
          ],
          "sourceCrop": [
            534,
            1302,
            770,
            1536
          ]
        },
        {
          "id": "death",
          "file": "races/ashen/art/ashen.a02.normal.2-death.png",
          "durationMs": 650,
          "alphaBBox": [
            29,
            124,
            162,
            176
          ],
          "sourceCrop": [
            770,
            1302,
            1024,
            1536
          ]
        }
      ],
      "animations": {
        "idle": [
          "idle-0"
        ],
        "attack": [
          "idle-0",
          "strike",
          "strike",
          "idle-0"
        ],
        "hurt": [
          "hurt",
          "idle-0"
        ],
        "death": [
          "death"
        ]
      },
      "headY": 55,
      "healthBarAnchor": [
        96,
        43
      ]
    },
    "ashen.a02.normal.3": {
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
          "file": "races/ashen/art/ashen.a02.normal.3.png",
          "durationMs": 160,
          "alphaBBox": [
            61,
            50,
            130,
            176
          ],
          "sourceCrop": [
            0,
            0,
            232,
            279
          ]
        },
        {
          "id": "strike",
          "file": "races/ashen/art/ashen.a02.normal.3-strike.png",
          "durationMs": 160,
          "alphaBBox": [
            22,
            48,
            170,
            176
          ],
          "sourceCrop": [
            232,
            0,
            524,
            279
          ]
        },
        {
          "id": "hurt",
          "file": "races/ashen/art/ashen.a02.normal.3-hurt.png",
          "durationMs": 160,
          "alphaBBox": [
            43,
            61,
            149,
            176
          ],
          "sourceCrop": [
            524,
            0,
            757,
            279
          ]
        },
        {
          "id": "death",
          "file": "races/ashen/art/ashen.a02.normal.3-death.png",
          "durationMs": 650,
          "alphaBBox": [
            27,
            124,
            165,
            176
          ],
          "sourceCrop": [
            757,
            0,
            1024,
            279
          ]
        }
      ],
      "animations": {
        "idle": [
          "idle-0"
        ],
        "attack": [
          "idle-0",
          "strike",
          "strike",
          "idle-0"
        ],
        "hurt": [
          "hurt",
          "idle-0"
        ],
        "death": [
          "death"
        ]
      },
      "headY": 55,
      "healthBarAnchor": [
        96,
        43
      ]
    },
    "ashen.a02.elite": {
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
          "file": "races/ashen/art/ashen.a02.elite.png",
          "durationMs": 160,
          "alphaBBox": [
            44,
            65,
            148,
            176
          ],
          "sourceCrop": [
            0,
            279,
            244,
            533
          ]
        },
        {
          "id": "strike",
          "file": "races/ashen/art/ashen.a02.elite-strike.png",
          "durationMs": 160,
          "alphaBBox": [
            22,
            86,
            170,
            176
          ],
          "sourceCrop": [
            244,
            279,
            538,
            533
          ]
        },
        {
          "id": "hurt",
          "file": "races/ashen/art/ashen.a02.elite-hurt.png",
          "durationMs": 160,
          "alphaBBox": [
            45,
            72,
            146,
            176
          ],
          "sourceCrop": [
            538,
            279,
            753,
            533
          ]
        },
        {
          "id": "death",
          "file": "races/ashen/art/ashen.a02.elite-death.png",
          "durationMs": 650,
          "alphaBBox": [
            35,
            124,
            156,
            176
          ],
          "sourceCrop": [
            753,
            279,
            1024,
            533
          ]
        }
      ],
      "animations": {
        "idle": [
          "idle-0"
        ],
        "attack": [
          "idle-0",
          "strike",
          "strike",
          "idle-0"
        ],
        "hurt": [
          "hurt",
          "idle-0"
        ],
        "death": [
          "death"
        ]
      },
      "headY": 55,
      "healthBarAnchor": [
        96,
        43
      ]
    },
    "ashen.a03.normal.1": {
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
          "file": "races/ashen/art/ashen.a03.normal.1.png",
          "durationMs": 160,
          "alphaBBox": [
            37,
            77,
            154,
            176
          ],
          "sourceCrop": [
            0,
            533,
            244,
            780
          ]
        },
        {
          "id": "strike",
          "file": "races/ashen/art/ashen.a03.normal.1-strike.png",
          "durationMs": 160,
          "alphaBBox": [
            22,
            71,
            170,
            176
          ],
          "sourceCrop": [
            244,
            533,
            526,
            780
          ]
        },
        {
          "id": "hurt",
          "file": "races/ashen/art/ashen.a03.normal.1-hurt.png",
          "durationMs": 160,
          "alphaBBox": [
            36,
            75,
            155,
            175
          ],
          "sourceCrop": [
            526,
            533,
            765,
            780
          ]
        },
        {
          "id": "death",
          "file": "races/ashen/art/ashen.a03.normal.1-death.png",
          "durationMs": 650,
          "alphaBBox": [
            31,
            132,
            159,
            176
          ],
          "sourceCrop": [
            765,
            533,
            1024,
            780
          ]
        }
      ],
      "animations": {
        "idle": [
          "idle-0"
        ],
        "attack": [
          "idle-0",
          "strike",
          "strike",
          "idle-0"
        ],
        "hurt": [
          "hurt",
          "idle-0"
        ],
        "death": [
          "death"
        ]
      },
      "headY": 55,
      "healthBarAnchor": [
        96,
        43
      ]
    },
    "ashen.a03.normal.2": {
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
          "file": "races/ashen/art/ashen.a03.normal.2.png",
          "durationMs": 160,
          "alphaBBox": [
            43,
            86,
            149,
            176
          ],
          "sourceCrop": [
            0,
            780,
            228,
            1011
          ]
        },
        {
          "id": "strike",
          "file": "races/ashen/art/ashen.a03.normal.2-strike.png",
          "durationMs": 160,
          "alphaBBox": [
            22,
            87,
            170,
            176
          ],
          "sourceCrop": [
            228,
            780,
            532,
            1011
          ]
        },
        {
          "id": "hurt",
          "file": "races/ashen/art/ashen.a03.normal.2-hurt.png",
          "durationMs": 160,
          "alphaBBox": [
            43,
            88,
            148,
            176
          ],
          "sourceCrop": [
            532,
            780,
            764,
            1011
          ]
        },
        {
          "id": "death",
          "file": "races/ashen/art/ashen.a03.normal.2-death.png",
          "durationMs": 650,
          "alphaBBox": [
            36,
            111,
            157,
            176
          ],
          "sourceCrop": [
            764,
            780,
            1024,
            1011
          ]
        }
      ],
      "animations": {
        "idle": [
          "idle-0"
        ],
        "attack": [
          "idle-0",
          "strike",
          "strike",
          "idle-0"
        ],
        "hurt": [
          "hurt",
          "idle-0"
        ],
        "death": [
          "death"
        ]
      },
      "headY": 55,
      "healthBarAnchor": [
        96,
        43
      ]
    },
    "ashen.a03.normal.3": {
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
          "file": "races/ashen/art/ashen.a03.normal.3.png",
          "durationMs": 160,
          "alphaBBox": [
            40,
            44,
            151,
            176
          ],
          "sourceCrop": [
            0,
            1011,
            252,
            1270
          ]
        },
        {
          "id": "strike",
          "file": "races/ashen/art/ashen.a03.normal.3-strike.png",
          "durationMs": 160,
          "alphaBBox": [
            22,
            44,
            170,
            176
          ],
          "sourceCrop": [
            252,
            1011,
            536,
            1270
          ]
        },
        {
          "id": "hurt",
          "file": "races/ashen/art/ashen.a03.normal.3-hurt.png",
          "durationMs": 160,
          "alphaBBox": [
            39,
            51,
            152,
            176
          ],
          "sourceCrop": [
            536,
            1011,
            759,
            1270
          ]
        },
        {
          "id": "death",
          "file": "races/ashen/art/ashen.a03.normal.3-death.png",
          "durationMs": 650,
          "alphaBBox": [
            25,
            97,
            166,
            176
          ],
          "sourceCrop": [
            759,
            1011,
            1024,
            1270
          ]
        }
      ],
      "animations": {
        "idle": [
          "idle-0"
        ],
        "attack": [
          "idle-0",
          "strike",
          "strike",
          "idle-0"
        ],
        "hurt": [
          "hurt",
          "idle-0"
        ],
        "death": [
          "death"
        ]
      },
      "headY": 55,
      "healthBarAnchor": [
        96,
        43
      ]
    },
    "ashen.a03.elite": {
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
          "file": "races/ashen/art/ashen.a03.elite.png",
          "durationMs": 160,
          "alphaBBox": [
            34,
            56,
            158,
            176
          ],
          "sourceCrop": [
            0,
            1270,
            249,
            1536
          ]
        },
        {
          "id": "strike",
          "file": "races/ashen/art/ashen.a03.elite-strike.png",
          "durationMs": 160,
          "alphaBBox": [
            22,
            52,
            170,
            176
          ],
          "sourceCrop": [
            249,
            1270,
            528,
            1536
          ]
        },
        {
          "id": "hurt",
          "file": "races/ashen/art/ashen.a03.elite-hurt.png",
          "durationMs": 160,
          "alphaBBox": [
            37,
            56,
            154,
            176
          ],
          "sourceCrop": [
            528,
            1270,
            757,
            1536
          ]
        },
        {
          "id": "death",
          "file": "races/ashen/art/ashen.a03.elite-death.png",
          "durationMs": 650,
          "alphaBBox": [
            26,
            104,
            165,
            176
          ],
          "sourceCrop": [
            757,
            1270,
            1024,
            1536
          ]
        }
      ],
      "animations": {
        "idle": [
          "idle-0"
        ],
        "attack": [
          "idle-0",
          "strike",
          "strike",
          "idle-0"
        ],
        "hurt": [
          "hurt",
          "idle-0"
        ],
        "death": [
          "death"
        ]
      },
      "headY": 55,
      "healthBarAnchor": [
        96,
        43
      ]
    },
    "ashen.a04.normal.1": {
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
          "file": "races/ashen/art/ashen.a04.normal.1.png",
          "durationMs": 160,
          "alphaBBox": [
            26,
            100,
            166,
            176
          ],
          "sourceCrop": [
            0,
            0,
            264,
            244
          ]
        },
        {
          "id": "strike",
          "file": "races/ashen/art/ashen.a04.normal.1-strike.png",
          "durationMs": 160,
          "alphaBBox": [
            26,
            98,
            166,
            176
          ],
          "sourceCrop": [
            264,
            0,
            527,
            244
          ]
        },
        {
          "id": "hurt",
          "file": "races/ashen/art/ashen.a04.normal.1-hurt.png",
          "durationMs": 160,
          "alphaBBox": [
            33,
            104,
            158,
            176
          ],
          "sourceCrop": [
            527,
            0,
            763,
            244
          ]
        },
        {
          "id": "death",
          "file": "races/ashen/art/ashen.a04.normal.1-death.png",
          "durationMs": 650,
          "alphaBBox": [
            22,
            120,
            170,
            176
          ],
          "sourceCrop": [
            763,
            0,
            1024,
            244
          ]
        }
      ],
      "animations": {
        "idle": [
          "idle-0"
        ],
        "attack": [
          "idle-0",
          "strike",
          "strike",
          "idle-0"
        ],
        "hurt": [
          "hurt",
          "idle-0"
        ],
        "death": [
          "death"
        ]
      },
      "headY": 55,
      "healthBarAnchor": [
        96,
        43
      ]
    },
    "ashen.a04.normal.2": {
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
          "file": "races/ashen/art/ashen.a04.normal.2.png",
          "durationMs": 160,
          "alphaBBox": [
            28,
            55,
            164,
            176
          ],
          "sourceCrop": [
            0,
            244,
            256,
            500
          ]
        },
        {
          "id": "strike",
          "file": "races/ashen/art/ashen.a04.normal.2-strike.png",
          "durationMs": 160,
          "alphaBBox": [
            22,
            47,
            170,
            176
          ],
          "sourceCrop": [
            256,
            244,
            531,
            500
          ]
        },
        {
          "id": "hurt",
          "file": "races/ashen/art/ashen.a04.normal.2-hurt.png",
          "durationMs": 160,
          "alphaBBox": [
            34,
            53,
            157,
            176
          ],
          "sourceCrop": [
            531,
            244,
            774,
            500
          ]
        },
        {
          "id": "death",
          "file": "races/ashen/art/ashen.a04.normal.2-death.png",
          "durationMs": 650,
          "alphaBBox": [
            22,
            100,
            169,
            176
          ],
          "sourceCrop": [
            774,
            244,
            1024,
            500
          ]
        }
      ],
      "animations": {
        "idle": [
          "idle-0"
        ],
        "attack": [
          "idle-0",
          "strike",
          "strike",
          "idle-0"
        ],
        "hurt": [
          "hurt",
          "idle-0"
        ],
        "death": [
          "death"
        ]
      },
      "headY": 55,
      "healthBarAnchor": [
        96,
        43
      ]
    },
    "ashen.a04.normal.3": {
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
          "file": "races/ashen/art/ashen.a04.normal.3.png",
          "durationMs": 160,
          "alphaBBox": [
            40,
            65,
            152,
            176
          ],
          "sourceCrop": [
            0,
            500,
            246,
            742
          ]
        },
        {
          "id": "strike",
          "file": "races/ashen/art/ashen.a04.normal.3-strike.png",
          "durationMs": 160,
          "alphaBBox": [
            22,
            63,
            170,
            176
          ],
          "sourceCrop": [
            246,
            500,
            538,
            742
          ]
        },
        {
          "id": "hurt",
          "file": "races/ashen/art/ashen.a04.normal.3-hurt.png",
          "durationMs": 160,
          "alphaBBox": [
            51,
            63,
            141,
            176
          ],
          "sourceCrop": [
            538,
            500,
            753,
            742
          ]
        },
        {
          "id": "death",
          "file": "races/ashen/art/ashen.a04.normal.3-death.png",
          "durationMs": 650,
          "alphaBBox": [
            26,
            116,
            166,
            176
          ],
          "sourceCrop": [
            753,
            500,
            1024,
            742
          ]
        }
      ],
      "animations": {
        "idle": [
          "idle-0"
        ],
        "attack": [
          "idle-0",
          "strike",
          "strike",
          "idle-0"
        ],
        "hurt": [
          "hurt",
          "idle-0"
        ],
        "death": [
          "death"
        ]
      },
      "headY": 55,
      "healthBarAnchor": [
        96,
        43
      ]
    },
    "ashen.a04.elite": {
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
          "file": "races/ashen/art/ashen.a04.elite.png",
          "durationMs": 160,
          "alphaBBox": [
            59,
            54,
            132,
            176
          ],
          "sourceCrop": [
            0,
            742,
            226,
            1001
          ]
        },
        {
          "id": "strike",
          "file": "races/ashen/art/ashen.a04.elite-strike.png",
          "durationMs": 160,
          "alphaBBox": [
            23,
            71,
            170,
            176
          ],
          "sourceCrop": [
            226,
            742,
            534,
            1001
          ]
        },
        {
          "id": "hurt",
          "file": "races/ashen/art/ashen.a04.elite-hurt.png",
          "durationMs": 160,
          "alphaBBox": [
            53,
            66,
            138,
            176
          ],
          "sourceCrop": [
            534,
            742,
            738,
            1001
          ]
        },
        {
          "id": "death",
          "file": "races/ashen/art/ashen.a04.elite-death.png",
          "durationMs": 650,
          "alphaBBox": [
            30,
            98,
            163,
            176
          ],
          "sourceCrop": [
            738,
            742,
            1024,
            1001
          ]
        }
      ],
      "animations": {
        "idle": [
          "idle-0"
        ],
        "attack": [
          "idle-0",
          "strike",
          "strike",
          "idle-0"
        ],
        "hurt": [
          "hurt",
          "idle-0"
        ],
        "death": [
          "death"
        ]
      },
      "headY": 55,
      "healthBarAnchor": [
        96,
        43
      ]
    },
    "ashen.a05.normal.1": {
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
          "file": "races/ashen/art/ashen.a05.normal.1.png",
          "durationMs": 160,
          "alphaBBox": [
            24,
            80,
            168,
            176
          ],
          "sourceCrop": [
            0,
            1001,
            271,
            1235
          ]
        },
        {
          "id": "strike",
          "file": "races/ashen/art/ashen.a05.normal.1-strike.png",
          "durationMs": 160,
          "alphaBBox": [
            22,
            74,
            170,
            176
          ],
          "sourceCrop": [
            271,
            1001,
            538,
            1235
          ]
        },
        {
          "id": "hurt",
          "file": "races/ashen/art/ashen.a05.normal.1-hurt.png",
          "durationMs": 160,
          "alphaBBox": [
            34,
            90,
            157,
            176
          ],
          "sourceCrop": [
            538,
            1001,
            763,
            1235
          ]
        },
        {
          "id": "death",
          "file": "races/ashen/art/ashen.a05.normal.1-death.png",
          "durationMs": 650,
          "alphaBBox": [
            22,
            126,
            170,
            176
          ],
          "sourceCrop": [
            763,
            1001,
            1024,
            1235
          ]
        }
      ],
      "animations": {
        "idle": [
          "idle-0"
        ],
        "attack": [
          "idle-0",
          "strike",
          "strike",
          "idle-0"
        ],
        "hurt": [
          "hurt",
          "idle-0"
        ],
        "death": [
          "death"
        ]
      },
      "headY": 55,
      "healthBarAnchor": [
        96,
        43
      ]
    },
    "ashen.a05.normal.2": {
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
          "file": "races/ashen/art/ashen.a05.normal.2.png",
          "durationMs": 160,
          "alphaBBox": [
            28,
            56,
            164,
            176
          ],
          "sourceCrop": [
            0,
            1235,
            261,
            1536
          ]
        },
        {
          "id": "strike",
          "file": "races/ashen/art/ashen.a05.normal.2-strike.png",
          "durationMs": 160,
          "alphaBBox": [
            27,
            38,
            164,
            176
          ],
          "sourceCrop": [
            261,
            1235,
            531,
            1536
          ]
        },
        {
          "id": "hurt",
          "file": "races/ashen/art/ashen.a05.normal.2-hurt.png",
          "durationMs": 160,
          "alphaBBox": [
            41,
            70,
            150,
            176
          ],
          "sourceCrop": [
            531,
            1235,
            754,
            1536
          ]
        },
        {
          "id": "death",
          "file": "races/ashen/art/ashen.a05.normal.2-death.png",
          "durationMs": 650,
          "alphaBBox": [
            25,
            101,
            167,
            176
          ],
          "sourceCrop": [
            754,
            1235,
            1024,
            1536
          ]
        }
      ],
      "animations": {
        "idle": [
          "idle-0"
        ],
        "attack": [
          "idle-0",
          "strike",
          "strike",
          "idle-0"
        ],
        "hurt": [
          "hurt",
          "idle-0"
        ],
        "death": [
          "death"
        ]
      },
      "headY": 55,
      "healthBarAnchor": [
        96,
        43
      ]
    },
    "ashen.a05.normal.3": {
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
          "file": "races/ashen/art/ashen.a05.normal.3.png",
          "durationMs": 160,
          "alphaBBox": [
            29,
            91,
            163,
            176
          ],
          "sourceCrop": [
            0,
            0,
            252,
            249
          ]
        },
        {
          "id": "strike",
          "file": "races/ashen/art/ashen.a05.normal.3-strike.png",
          "durationMs": 160,
          "alphaBBox": [
            27,
            55,
            164,
            176
          ],
          "sourceCrop": [
            252,
            0,
            521,
            249
          ]
        },
        {
          "id": "hurt",
          "file": "races/ashen/art/ashen.a05.normal.3-hurt.png",
          "durationMs": 160,
          "alphaBBox": [
            40,
            78,
            152,
            176
          ],
          "sourceCrop": [
            521,
            0,
            758,
            249
          ]
        },
        {
          "id": "death",
          "file": "races/ashen/art/ashen.a05.normal.3-death.png",
          "durationMs": 650,
          "alphaBBox": [
            22,
            113,
            170,
            176
          ],
          "sourceCrop": [
            758,
            0,
            1024,
            249
          ]
        }
      ],
      "animations": {
        "idle": [
          "idle-0"
        ],
        "attack": [
          "idle-0",
          "strike",
          "strike",
          "idle-0"
        ],
        "hurt": [
          "hurt",
          "idle-0"
        ],
        "death": [
          "death"
        ]
      },
      "headY": 55,
      "healthBarAnchor": [
        96,
        43
      ]
    },
    "ashen.a05.elite": {
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
          "file": "races/ashen/art/ashen.a05.elite.png",
          "durationMs": 160,
          "alphaBBox": [
            33,
            39,
            159,
            176
          ],
          "sourceCrop": [
            0,
            249,
            249,
            517
          ]
        },
        {
          "id": "strike",
          "file": "races/ashen/art/ashen.a05.elite-strike.png",
          "durationMs": 160,
          "alphaBBox": [
            25,
            41,
            167,
            176
          ],
          "sourceCrop": [
            249,
            249,
            524,
            517
          ]
        },
        {
          "id": "hurt",
          "file": "races/ashen/art/ashen.a05.elite-hurt.png",
          "durationMs": 160,
          "alphaBBox": [
            33,
            38,
            158,
            176
          ],
          "sourceCrop": [
            524,
            249,
            764,
            517
          ]
        },
        {
          "id": "death",
          "file": "races/ashen/art/ashen.a05.elite-death.png",
          "durationMs": 650,
          "alphaBBox": [
            26,
            95,
            165,
            176
          ],
          "sourceCrop": [
            764,
            249,
            1024,
            517
          ]
        }
      ],
      "animations": {
        "idle": [
          "idle-0"
        ],
        "attack": [
          "idle-0",
          "strike",
          "strike",
          "idle-0"
        ],
        "hurt": [
          "hurt",
          "idle-0"
        ],
        "death": [
          "death"
        ]
      },
      "headY": 55,
      "healthBarAnchor": [
        96,
        43
      ]
    },
    "ashen.a06.normal.1": {
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
          "file": "races/ashen/art/ashen.a06.normal.1.png",
          "durationMs": 160,
          "alphaBBox": [
            31,
            39,
            160,
            176
          ],
          "sourceCrop": [
            0,
            517,
            258,
            764
          ]
        },
        {
          "id": "strike",
          "file": "races/ashen/art/ashen.a06.normal.1-strike.png",
          "durationMs": 160,
          "alphaBBox": [
            29,
            38,
            162,
            176
          ],
          "sourceCrop": [
            258,
            517,
            528,
            764
          ]
        },
        {
          "id": "hurt",
          "file": "races/ashen/art/ashen.a06.normal.1-hurt.png",
          "durationMs": 160,
          "alphaBBox": [
            37,
            39,
            153,
            176
          ],
          "sourceCrop": [
            528,
            517,
            763,
            764
          ]
        },
        {
          "id": "death",
          "file": "races/ashen/art/ashen.a06.normal.1-death.png",
          "durationMs": 650,
          "alphaBBox": [
            24,
            109,
            168,
            176
          ],
          "sourceCrop": [
            763,
            517,
            1024,
            764
          ]
        }
      ],
      "animations": {
        "idle": [
          "idle-0"
        ],
        "attack": [
          "idle-0",
          "strike",
          "strike",
          "idle-0"
        ],
        "hurt": [
          "hurt",
          "idle-0"
        ],
        "death": [
          "death"
        ]
      },
      "headY": 55,
      "healthBarAnchor": [
        96,
        43
      ]
    },
    "ashen.a06.normal.2": {
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
          "file": "races/ashen/art/ashen.a06.normal.2.png",
          "durationMs": 160,
          "alphaBBox": [
            32,
            44,
            159,
            176
          ],
          "sourceCrop": [
            0,
            764,
            256,
            1024
          ]
        },
        {
          "id": "strike",
          "file": "races/ashen/art/ashen.a06.normal.2-strike.png",
          "durationMs": 160,
          "alphaBBox": [
            26,
            38,
            166,
            176
          ],
          "sourceCrop": [
            256,
            764,
            523,
            1024
          ]
        },
        {
          "id": "hurt",
          "file": "races/ashen/art/ashen.a06.normal.2-hurt.png",
          "durationMs": 160,
          "alphaBBox": [
            34,
            48,
            158,
            176
          ],
          "sourceCrop": [
            523,
            764,
            765,
            1024
          ]
        },
        {
          "id": "death",
          "file": "races/ashen/art/ashen.a06.normal.2-death.png",
          "durationMs": 650,
          "alphaBBox": [
            29,
            108,
            164,
            176
          ],
          "sourceCrop": [
            765,
            764,
            1024,
            1024
          ]
        }
      ],
      "animations": {
        "idle": [
          "idle-0"
        ],
        "attack": [
          "idle-0",
          "strike",
          "strike",
          "idle-0"
        ],
        "hurt": [
          "hurt",
          "idle-0"
        ],
        "death": [
          "death"
        ]
      },
      "headY": 55,
      "healthBarAnchor": [
        96,
        43
      ]
    },
    "ashen.a06.normal.3": {
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
          "file": "races/ashen/art/ashen.a06.normal.3.png",
          "durationMs": 160,
          "alphaBBox": [
            27,
            47,
            164,
            176
          ],
          "sourceCrop": [
            0,
            1024,
            256,
            1267
          ]
        },
        {
          "id": "strike",
          "file": "races/ashen/art/ashen.a06.normal.3-strike.png",
          "durationMs": 160,
          "alphaBBox": [
            23,
            38,
            168,
            176
          ],
          "sourceCrop": [
            256,
            1024,
            522,
            1267
          ]
        },
        {
          "id": "hurt",
          "file": "races/ashen/art/ashen.a06.normal.3-hurt.png",
          "durationMs": 160,
          "alphaBBox": [
            32,
            54,
            160,
            176
          ],
          "sourceCrop": [
            522,
            1024,
            762,
            1267
          ]
        },
        {
          "id": "death",
          "file": "races/ashen/art/ashen.a06.normal.3-death.png",
          "durationMs": 650,
          "alphaBBox": [
            25,
            93,
            167,
            176
          ],
          "sourceCrop": [
            762,
            1024,
            1024,
            1267
          ]
        }
      ],
      "animations": {
        "idle": [
          "idle-0"
        ],
        "attack": [
          "idle-0",
          "strike",
          "strike",
          "idle-0"
        ],
        "hurt": [
          "hurt",
          "idle-0"
        ],
        "death": [
          "death"
        ]
      },
      "headY": 55,
      "healthBarAnchor": [
        96,
        43
      ]
    },
    "ashen.a06.elite": {
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
          "file": "races/ashen/art/ashen.a06.elite.png",
          "durationMs": 160,
          "alphaBBox": [
            29,
            69,
            163,
            176
          ],
          "sourceCrop": [
            0,
            1267,
            253,
            1536
          ]
        },
        {
          "id": "strike",
          "file": "races/ashen/art/ashen.a06.elite-strike.png",
          "durationMs": 160,
          "alphaBBox": [
            22,
            45,
            170,
            176
          ],
          "sourceCrop": [
            253,
            1267,
            531,
            1536
          ]
        },
        {
          "id": "hurt",
          "file": "races/ashen/art/ashen.a06.elite-hurt.png",
          "durationMs": 160,
          "alphaBBox": [
            32,
            64,
            159,
            176
          ],
          "sourceCrop": [
            531,
            1267,
            768,
            1536
          ]
        },
        {
          "id": "death",
          "file": "races/ashen/art/ashen.a06.elite-death.png",
          "durationMs": 650,
          "alphaBBox": [
            25,
            94,
            166,
            176
          ],
          "sourceCrop": [
            768,
            1267,
            1024,
            1536
          ]
        }
      ],
      "animations": {
        "idle": [
          "idle-0"
        ],
        "attack": [
          "idle-0",
          "strike",
          "strike",
          "idle-0"
        ],
        "hurt": [
          "hurt",
          "idle-0"
        ],
        "death": [
          "death"
        ]
      },
      "headY": 55,
      "healthBarAnchor": [
        96,
        43
      ]
    },
    "ashen.a07.normal.1": {
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
          "file": "races/ashen/art/ashen.a07.normal.1.png",
          "durationMs": 160,
          "alphaBBox": [
            40,
            85,
            151,
            176
          ],
          "sourceCrop": [
            0,
            0,
            239,
            261
          ]
        },
        {
          "id": "strike",
          "file": "races/ashen/art/ashen.a07.normal.1-strike.png",
          "durationMs": 160,
          "alphaBBox": [
            22,
            88,
            170,
            176
          ],
          "sourceCrop": [
            239,
            0,
            532,
            261
          ]
        },
        {
          "id": "hurt",
          "file": "races/ashen/art/ashen.a07.normal.1-hurt.png",
          "durationMs": 160,
          "alphaBBox": [
            44,
            92,
            148,
            176
          ],
          "sourceCrop": [
            532,
            0,
            742,
            261
          ]
        },
        {
          "id": "death",
          "file": "races/ashen/art/ashen.a07.normal.1-death.png",
          "durationMs": 650,
          "alphaBBox": [
            30,
            133,
            163,
            176
          ],
          "sourceCrop": [
            742,
            0,
            1024,
            261
          ]
        }
      ],
      "animations": {
        "idle": [
          "idle-0"
        ],
        "attack": [
          "idle-0",
          "strike",
          "strike",
          "idle-0"
        ],
        "hurt": [
          "hurt",
          "idle-0"
        ],
        "death": [
          "death"
        ]
      },
      "headY": 55,
      "healthBarAnchor": [
        96,
        43
      ]
    },
    "ashen.a07.normal.2": {
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
          "file": "races/ashen/art/ashen.a07.normal.2.png",
          "durationMs": 160,
          "alphaBBox": [
            41,
            64,
            150,
            176
          ],
          "sourceCrop": [
            0,
            261,
            242,
            495
          ]
        },
        {
          "id": "strike",
          "file": "races/ashen/art/ashen.a07.normal.2-strike.png",
          "durationMs": 160,
          "alphaBBox": [
            22,
            60,
            170,
            176
          ],
          "sourceCrop": [
            242,
            261,
            536,
            495
          ]
        },
        {
          "id": "hurt",
          "file": "races/ashen/art/ashen.a07.normal.2-hurt.png",
          "durationMs": 160,
          "alphaBBox": [
            40,
            87,
            151,
            176
          ],
          "sourceCrop": [
            536,
            261,
            763,
            495
          ]
        },
        {
          "id": "death",
          "file": "races/ashen/art/ashen.a07.normal.2-death.png",
          "durationMs": 650,
          "alphaBBox": [
            28,
            126,
            164,
            176
          ],
          "sourceCrop": [
            763,
            261,
            1024,
            495
          ]
        }
      ],
      "animations": {
        "idle": [
          "idle-0"
        ],
        "attack": [
          "idle-0",
          "strike",
          "strike",
          "idle-0"
        ],
        "hurt": [
          "hurt",
          "idle-0"
        ],
        "death": [
          "death"
        ]
      },
      "headY": 55,
      "healthBarAnchor": [
        96,
        43
      ]
    },
    "ashen.a07.normal.3": {
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
          "file": "races/ashen/art/ashen.a07.normal.3.png",
          "durationMs": 160,
          "alphaBBox": [
            39,
            81,
            153,
            176
          ],
          "sourceCrop": [
            0,
            495,
            249,
            746
          ]
        },
        {
          "id": "strike",
          "file": "races/ashen/art/ashen.a07.normal.3-strike.png",
          "durationMs": 160,
          "alphaBBox": [
            22,
            66,
            169,
            176
          ],
          "sourceCrop": [
            249,
            495,
            546,
            746
          ]
        },
        {
          "id": "hurt",
          "file": "races/ashen/art/ashen.a07.normal.3-hurt.png",
          "durationMs": 160,
          "alphaBBox": [
            40,
            82,
            151,
            176
          ],
          "sourceCrop": [
            546,
            495,
            773,
            746
          ]
        },
        {
          "id": "death",
          "file": "races/ashen/art/ashen.a07.normal.3-death.png",
          "durationMs": 650,
          "alphaBBox": [
            37,
            114,
            155,
            176
          ],
          "sourceCrop": [
            773,
            495,
            1024,
            746
          ]
        }
      ],
      "animations": {
        "idle": [
          "idle-0"
        ],
        "attack": [
          "idle-0",
          "strike",
          "strike",
          "idle-0"
        ],
        "hurt": [
          "hurt",
          "idle-0"
        ],
        "death": [
          "death"
        ]
      },
      "headY": 55,
      "healthBarAnchor": [
        96,
        43
      ]
    },
    "ashen.a07.elite": {
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
          "file": "races/ashen/art/ashen.a07.elite.png",
          "durationMs": 160,
          "alphaBBox": [
            47,
            76,
            145,
            176
          ],
          "sourceCrop": [
            0,
            746,
            237,
            1005
          ]
        },
        {
          "id": "strike",
          "file": "races/ashen/art/ashen.a07.elite-strike.png",
          "durationMs": 160,
          "alphaBBox": [
            22,
            55,
            170,
            176
          ],
          "sourceCrop": [
            237,
            746,
            541,
            1005
          ]
        },
        {
          "id": "hurt",
          "file": "races/ashen/art/ashen.a07.elite-hurt.png",
          "durationMs": 160,
          "alphaBBox": [
            44,
            71,
            148,
            176
          ],
          "sourceCrop": [
            541,
            746,
            760,
            1005
          ]
        },
        {
          "id": "death",
          "file": "races/ashen/art/ashen.a07.elite-death.png",
          "durationMs": 650,
          "alphaBBox": [
            31,
            129,
            162,
            176
          ],
          "sourceCrop": [
            760,
            746,
            1024,
            1005
          ]
        }
      ],
      "animations": {
        "idle": [
          "idle-0"
        ],
        "attack": [
          "idle-0",
          "strike",
          "strike",
          "idle-0"
        ],
        "hurt": [
          "hurt",
          "idle-0"
        ],
        "death": [
          "death"
        ]
      },
      "headY": 55,
      "healthBarAnchor": [
        96,
        43
      ]
    },
    "ashen.a08.normal.1": {
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
          "file": "races/ashen/art/ashen.a08.normal.1.png",
          "durationMs": 160,
          "alphaBBox": [
            27,
            69,
            164,
            176
          ],
          "sourceCrop": [
            0,
            1005,
            260,
            1241
          ]
        },
        {
          "id": "strike",
          "file": "races/ashen/art/ashen.a08.normal.1-strike.png",
          "durationMs": 160,
          "alphaBBox": [
            22,
            56,
            170,
            176
          ],
          "sourceCrop": [
            260,
            1005,
            527,
            1241
          ]
        },
        {
          "id": "hurt",
          "file": "races/ashen/art/ashen.a08.normal.1-hurt.png",
          "durationMs": 160,
          "alphaBBox": [
            34,
            78,
            157,
            176
          ],
          "sourceCrop": [
            527,
            1005,
            753,
            1241
          ]
        },
        {
          "id": "death",
          "file": "races/ashen/art/ashen.a08.normal.1-death.png",
          "durationMs": 650,
          "alphaBBox": [
            22,
            117,
            170,
            176
          ],
          "sourceCrop": [
            753,
            1005,
            1024,
            1241
          ]
        }
      ],
      "animations": {
        "idle": [
          "idle-0"
        ],
        "attack": [
          "idle-0",
          "strike",
          "strike",
          "idle-0"
        ],
        "hurt": [
          "hurt",
          "idle-0"
        ],
        "death": [
          "death"
        ]
      },
      "headY": 55,
      "healthBarAnchor": [
        96,
        43
      ]
    },
    "ashen.a08.normal.2": {
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
          "file": "races/ashen/art/ashen.a08.normal.2.png",
          "durationMs": 160,
          "alphaBBox": [
            46,
            50,
            146,
            176
          ],
          "sourceCrop": [
            0,
            1241,
            236,
            1536
          ]
        },
        {
          "id": "strike",
          "file": "races/ashen/art/ashen.a08.normal.2-strike.png",
          "durationMs": 160,
          "alphaBBox": [
            22,
            47,
            170,
            176
          ],
          "sourceCrop": [
            236,
            1241,
            537,
            1536
          ]
        },
        {
          "id": "hurt",
          "file": "races/ashen/art/ashen.a08.normal.2-hurt.png",
          "durationMs": 160,
          "alphaBBox": [
            43,
            49,
            148,
            176
          ],
          "sourceCrop": [
            537,
            1241,
            751,
            1536
          ]
        },
        {
          "id": "death",
          "file": "races/ashen/art/ashen.a08.normal.2-death.png",
          "durationMs": 650,
          "alphaBBox": [
            28,
            103,
            164,
            176
          ],
          "sourceCrop": [
            751,
            1241,
            1024,
            1536
          ]
        }
      ],
      "animations": {
        "idle": [
          "idle-0"
        ],
        "attack": [
          "idle-0",
          "strike",
          "strike",
          "idle-0"
        ],
        "hurt": [
          "hurt",
          "idle-0"
        ],
        "death": [
          "death"
        ]
      },
      "headY": 55,
      "healthBarAnchor": [
        96,
        43
      ]
    },
    "ashen.a08.normal.3": {
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
          "file": "races/ashen/art/ashen.a08.normal.3.png",
          "durationMs": 160,
          "alphaBBox": [
            32,
            78,
            159,
            176
          ],
          "sourceCrop": [
            0,
            0,
            245,
            280
          ]
        },
        {
          "id": "strike",
          "file": "races/ashen/art/ashen.a08.normal.3-strike.png",
          "durationMs": 160,
          "alphaBBox": [
            22,
            89,
            170,
            176
          ],
          "sourceCrop": [
            245,
            0,
            528,
            280
          ]
        },
        {
          "id": "hurt",
          "file": "races/ashen/art/ashen.a08.normal.3-hurt.png",
          "durationMs": 160,
          "alphaBBox": [
            35,
            83,
            157,
            176
          ],
          "sourceCrop": [
            528,
            0,
            772,
            280
          ]
        },
        {
          "id": "death",
          "file": "races/ashen/art/ashen.a08.normal.3-death.png",
          "durationMs": 650,
          "alphaBBox": [
            33,
            114,
            159,
            176
          ],
          "sourceCrop": [
            772,
            0,
            1024,
            280
          ]
        }
      ],
      "animations": {
        "idle": [
          "idle-0"
        ],
        "attack": [
          "idle-0",
          "strike",
          "strike",
          "idle-0"
        ],
        "hurt": [
          "hurt",
          "idle-0"
        ],
        "death": [
          "death"
        ]
      },
      "headY": 55,
      "healthBarAnchor": [
        96,
        43
      ]
    },
    "ashen.a08.elite": {
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
          "file": "races/ashen/art/ashen.a08.elite.png",
          "durationMs": 160,
          "alphaBBox": [
            34,
            62,
            157,
            176
          ],
          "sourceCrop": [
            0,
            280,
            255,
            528
          ]
        },
        {
          "id": "strike",
          "file": "races/ashen/art/ashen.a08.elite-strike.png",
          "durationMs": 160,
          "alphaBBox": [
            22,
            70,
            170,
            176
          ],
          "sourceCrop": [
            255,
            280,
            530,
            528
          ]
        },
        {
          "id": "hurt",
          "file": "races/ashen/art/ashen.a08.elite-hurt.png",
          "durationMs": 160,
          "alphaBBox": [
            32,
            69,
            159,
            176
          ],
          "sourceCrop": [
            530,
            280,
            781,
            528
          ]
        },
        {
          "id": "death",
          "file": "races/ashen/art/ashen.a08.elite-death.png",
          "durationMs": 650,
          "alphaBBox": [
            33,
            98,
            159,
            176
          ],
          "sourceCrop": [
            781,
            280,
            1024,
            528
          ]
        }
      ],
      "animations": {
        "idle": [
          "idle-0"
        ],
        "attack": [
          "idle-0",
          "strike",
          "strike",
          "idle-0"
        ],
        "hurt": [
          "hurt",
          "idle-0"
        ],
        "death": [
          "death"
        ]
      },
      "headY": 55,
      "healthBarAnchor": [
        96,
        43
      ]
    },
    "ashen.a09.normal.1": {
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
          "file": "races/ashen/art/ashen.a09.normal.1.png",
          "durationMs": 160,
          "alphaBBox": [
            44,
            57,
            147,
            176
          ],
          "sourceCrop": [
            0,
            528,
            243,
            774
          ]
        },
        {
          "id": "strike",
          "file": "races/ashen/art/ashen.a09.normal.1-strike.png",
          "durationMs": 160,
          "alphaBBox": [
            22,
            66,
            170,
            176
          ],
          "sourceCrop": [
            243,
            528,
            537,
            774
          ]
        },
        {
          "id": "hurt",
          "file": "races/ashen/art/ashen.a09.normal.1-hurt.png",
          "durationMs": 160,
          "alphaBBox": [
            43,
            55,
            148,
            176
          ],
          "sourceCrop": [
            537,
            528,
            769,
            774
          ]
        },
        {
          "id": "death",
          "file": "races/ashen/art/ashen.a09.normal.1-death.png",
          "durationMs": 650,
          "alphaBBox": [
            33,
            117,
            158,
            176
          ],
          "sourceCrop": [
            769,
            528,
            1024,
            774
          ]
        }
      ],
      "animations": {
        "idle": [
          "idle-0"
        ],
        "attack": [
          "idle-0",
          "strike",
          "strike",
          "idle-0"
        ],
        "hurt": [
          "hurt",
          "idle-0"
        ],
        "death": [
          "death"
        ]
      },
      "headY": 55,
      "healthBarAnchor": [
        96,
        43
      ]
    },
    "ashen.a09.normal.2": {
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
          "file": "races/ashen/art/ashen.a09.normal.2.png",
          "durationMs": 160,
          "alphaBBox": [
            40,
            56,
            152,
            176
          ],
          "sourceCrop": [
            0,
            774,
            240,
            1031
          ]
        },
        {
          "id": "strike",
          "file": "races/ashen/art/ashen.a09.normal.2-strike.png",
          "durationMs": 160,
          "alphaBBox": [
            22,
            65,
            170,
            176
          ],
          "sourceCrop": [
            240,
            774,
            531,
            1031
          ]
        },
        {
          "id": "hurt",
          "file": "races/ashen/art/ashen.a09.normal.2-hurt.png",
          "durationMs": 160,
          "alphaBBox": [
            40,
            63,
            152,
            176
          ],
          "sourceCrop": [
            531,
            774,
            765,
            1031
          ]
        },
        {
          "id": "death",
          "file": "races/ashen/art/ashen.a09.normal.2-death.png",
          "durationMs": 650,
          "alphaBBox": [
            32,
            111,
            159,
            176
          ],
          "sourceCrop": [
            765,
            774,
            1024,
            1031
          ]
        }
      ],
      "animations": {
        "idle": [
          "idle-0"
        ],
        "attack": [
          "idle-0",
          "strike",
          "strike",
          "idle-0"
        ],
        "hurt": [
          "hurt",
          "idle-0"
        ],
        "death": [
          "death"
        ]
      },
      "headY": 55,
      "healthBarAnchor": [
        96,
        43
      ]
    },
    "ashen.a09.normal.3": {
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
          "file": "races/ashen/art/ashen.a09.normal.3.png",
          "durationMs": 160,
          "alphaBBox": [
            37,
            96,
            155,
            176
          ],
          "sourceCrop": [
            0,
            1031,
            246,
            1252
          ]
        },
        {
          "id": "strike",
          "file": "races/ashen/art/ashen.a09.normal.3-strike.png",
          "durationMs": 160,
          "alphaBBox": [
            22,
            83,
            170,
            176
          ],
          "sourceCrop": [
            246,
            1031,
            534,
            1252
          ]
        },
        {
          "id": "hurt",
          "file": "races/ashen/art/ashen.a09.normal.3-hurt.png",
          "durationMs": 160,
          "alphaBBox": [
            39,
            90,
            153,
            176
          ],
          "sourceCrop": [
            534,
            1031,
            766,
            1252
          ]
        },
        {
          "id": "death",
          "file": "races/ashen/art/ashen.a09.normal.3-death.png",
          "durationMs": 650,
          "alphaBBox": [
            33,
            127,
            159,
            176
          ],
          "sourceCrop": [
            766,
            1031,
            1024,
            1252
          ]
        }
      ],
      "animations": {
        "idle": [
          "idle-0"
        ],
        "attack": [
          "idle-0",
          "strike",
          "strike",
          "idle-0"
        ],
        "hurt": [
          "hurt",
          "idle-0"
        ],
        "death": [
          "death"
        ]
      },
      "headY": 55,
      "healthBarAnchor": [
        96,
        43
      ]
    },
    "ashen.a09.elite": {
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
          "file": "races/ashen/art/ashen.a09.elite.png",
          "durationMs": 160,
          "alphaBBox": [
            36,
            67,
            157,
            176
          ],
          "sourceCrop": [
            0,
            1252,
            248,
            1536
          ]
        },
        {
          "id": "strike",
          "file": "races/ashen/art/ashen.a09.elite-strike.png",
          "durationMs": 160,
          "alphaBBox": [
            22,
            93,
            170,
            176
          ],
          "sourceCrop": [
            248,
            1252,
            541,
            1536
          ]
        },
        {
          "id": "hurt",
          "file": "races/ashen/art/ashen.a09.elite-hurt.png",
          "durationMs": 160,
          "alphaBBox": [
            41,
            70,
            150,
            176
          ],
          "sourceCrop": [
            541,
            1252,
            764,
            1536
          ]
        },
        {
          "id": "death",
          "file": "races/ashen/art/ashen.a09.elite-death.png",
          "durationMs": 650,
          "alphaBBox": [
            33,
            113,
            159,
            176
          ],
          "sourceCrop": [
            764,
            1252,
            1024,
            1536
          ]
        }
      ],
      "animations": {
        "idle": [
          "idle-0"
        ],
        "attack": [
          "idle-0",
          "strike",
          "strike",
          "idle-0"
        ],
        "hurt": [
          "hurt",
          "idle-0"
        ],
        "death": [
          "death"
        ]
      },
      "headY": 55,
      "healthBarAnchor": [
        96,
        43
      ]
    },
    "ashen.a10.normal.1": {
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
          "file": "races/ashen/art/ashen.a10.normal.1.png",
          "durationMs": 160,
          "alphaBBox": [
            36,
            107,
            155,
            176
          ],
          "sourceCrop": [
            0,
            0,
            239,
            251
          ]
        },
        {
          "id": "strike",
          "file": "races/ashen/art/ashen.a10.normal.1-strike.png",
          "durationMs": 160,
          "alphaBBox": [
            22,
            101,
            170,
            176
          ],
          "sourceCrop": [
            239,
            0,
            527,
            251
          ]
        },
        {
          "id": "hurt",
          "file": "races/ashen/art/ashen.a10.normal.1-hurt.png",
          "durationMs": 160,
          "alphaBBox": [
            43,
            82,
            149,
            176
          ],
          "sourceCrop": [
            527,
            0,
            763,
            251
          ]
        },
        {
          "id": "death",
          "file": "races/ashen/art/ashen.a10.normal.1-death.png",
          "durationMs": 650,
          "alphaBBox": [
            35,
            130,
            157,
            176
          ],
          "sourceCrop": [
            763,
            0,
            1024,
            251
          ]
        }
      ],
      "animations": {
        "idle": [
          "idle-0"
        ],
        "attack": [
          "idle-0",
          "strike",
          "strike",
          "idle-0"
        ],
        "hurt": [
          "hurt",
          "idle-0"
        ],
        "death": [
          "death"
        ]
      },
      "headY": 55,
      "healthBarAnchor": [
        96,
        43
      ]
    },
    "ashen.a10.normal.2": {
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
          "file": "races/ashen/art/ashen.a10.normal.2.png",
          "durationMs": 160,
          "alphaBBox": [
            31,
            73,
            161,
            176
          ],
          "sourceCrop": [
            0,
            251,
            247,
            472
          ]
        },
        {
          "id": "strike",
          "file": "races/ashen/art/ashen.a10.normal.2-strike.png",
          "durationMs": 160,
          "alphaBBox": [
            22,
            89,
            170,
            176
          ],
          "sourceCrop": [
            247,
            251,
            523,
            472
          ]
        },
        {
          "id": "hurt",
          "file": "races/ashen/art/ashen.a10.normal.2-hurt.png",
          "durationMs": 160,
          "alphaBBox": [
            32,
            73,
            160,
            176
          ],
          "sourceCrop": [
            523,
            251,
            766,
            472
          ]
        },
        {
          "id": "death",
          "file": "races/ashen/art/ashen.a10.normal.2-death.png",
          "durationMs": 650,
          "alphaBBox": [
            25,
            105,
            166,
            176
          ],
          "sourceCrop": [
            766,
            251,
            1024,
            472
          ]
        }
      ],
      "animations": {
        "idle": [
          "idle-0"
        ],
        "attack": [
          "idle-0",
          "strike",
          "strike",
          "idle-0"
        ],
        "hurt": [
          "hurt",
          "idle-0"
        ],
        "death": [
          "death"
        ]
      },
      "headY": 55,
      "healthBarAnchor": [
        96,
        43
      ]
    },
    "ashen.a10.normal.3": {
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
          "file": "races/ashen/art/ashen.a10.normal.3.png",
          "durationMs": 160,
          "alphaBBox": [
            58,
            69,
            133,
            176
          ],
          "sourceCrop": [
            0,
            472,
            218,
            731
          ]
        },
        {
          "id": "strike",
          "file": "races/ashen/art/ashen.a10.normal.3-strike.png",
          "durationMs": 160,
          "alphaBBox": [
            23,
            97,
            170,
            176
          ],
          "sourceCrop": [
            218,
            472,
            526,
            731
          ]
        },
        {
          "id": "hurt",
          "file": "races/ashen/art/ashen.a10.normal.3-hurt.png",
          "durationMs": 160,
          "alphaBBox": [
            41,
            80,
            151,
            176
          ],
          "sourceCrop": [
            526,
            472,
            753,
            731
          ]
        },
        {
          "id": "death",
          "file": "races/ashen/art/ashen.a10.normal.3-death.png",
          "durationMs": 650,
          "alphaBBox": [
            30,
            130,
            161,
            176
          ],
          "sourceCrop": [
            753,
            472,
            1024,
            731
          ]
        }
      ],
      "animations": {
        "idle": [
          "idle-0"
        ],
        "attack": [
          "idle-0",
          "strike",
          "strike",
          "idle-0"
        ],
        "hurt": [
          "hurt",
          "idle-0"
        ],
        "death": [
          "death"
        ]
      },
      "headY": 55,
      "healthBarAnchor": [
        96,
        43
      ]
    },
    "ashen.a10.elite": {
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
          "file": "races/ashen/art/ashen.a10.elite.png",
          "durationMs": 160,
          "alphaBBox": [
            41,
            63,
            150,
            176
          ],
          "sourceCrop": [
            0,
            731,
            232,
            993
          ]
        },
        {
          "id": "strike",
          "file": "races/ashen/art/ashen.a10.elite-strike.png",
          "durationMs": 160,
          "alphaBBox": [
            23,
            61,
            170,
            176
          ],
          "sourceCrop": [
            232,
            731,
            539,
            993
          ]
        },
        {
          "id": "hurt",
          "file": "races/ashen/art/ashen.a10.elite-hurt.png",
          "durationMs": 160,
          "alphaBBox": [
            47,
            72,
            144,
            176
          ],
          "sourceCrop": [
            539,
            731,
            752,
            993
          ]
        },
        {
          "id": "death",
          "file": "races/ashen/art/ashen.a10.elite-death.png",
          "durationMs": 650,
          "alphaBBox": [
            32,
            110,
            160,
            176
          ],
          "sourceCrop": [
            752,
            731,
            1024,
            993
          ]
        }
      ],
      "animations": {
        "idle": [
          "idle-0"
        ],
        "attack": [
          "idle-0",
          "strike",
          "strike",
          "idle-0"
        ],
        "hurt": [
          "hurt",
          "idle-0"
        ],
        "death": [
          "death"
        ]
      },
      "headY": 55,
      "healthBarAnchor": [
        96,
        43
      ]
    },
    "ashen.a04.boss": {
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
          "file": "races/ashen/art/ashen.a04.boss.png",
          "durationMs": 160,
          "alphaBBox": [
            25,
            43,
            167,
            176
          ],
          "sourceCrop": [
            0,
            993,
            246,
            1255
          ]
        },
        {
          "id": "strike",
          "file": "races/ashen/art/ashen.a04.boss-strike.png",
          "durationMs": 160,
          "alphaBBox": [
            11,
            46,
            181,
            176
          ],
          "sourceCrop": [
            246,
            993,
            540,
            1255
          ]
        },
        {
          "id": "hurt",
          "file": "races/ashen/art/ashen.a04.boss-hurt.png",
          "durationMs": 160,
          "alphaBBox": [
            37,
            45,
            155,
            176
          ],
          "sourceCrop": [
            540,
            993,
            752,
            1255
          ]
        },
        {
          "id": "death",
          "file": "races/ashen/art/ashen.a04.boss-death.png",
          "durationMs": 650,
          "alphaBBox": [
            18,
            75,
            174,
            176
          ],
          "sourceCrop": [
            752,
            993,
            1024,
            1255
          ]
        }
      ],
      "animations": {
        "idle": [
          "idle-0"
        ],
        "attack": [
          "idle-0",
          "strike",
          "strike",
          "idle-0"
        ],
        "hurt": [
          "hurt",
          "idle-0"
        ],
        "death": [
          "death"
        ]
      },
      "headY": 32,
      "healthBarAnchor": [
        96,
        24
      ]
    },
    "ashen.a07.boss": {
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
          "file": "races/ashen/art/ashen.a07.boss.png",
          "durationMs": 160,
          "alphaBBox": [
            26,
            31,
            165,
            176
          ],
          "sourceCrop": [
            0,
            0,
            590,
            644
          ]
        },
        {
          "id": "strike",
          "file": "races/ashen/art/ashen.a07.boss-strike.png",
          "durationMs": 160,
          "alphaBBox": [
            11,
            38,
            181,
            176
          ],
          "sourceCrop": [
            590,
            0,
            1264,
            644
          ]
        },
        {
          "id": "hurt",
          "file": "races/ashen/art/ashen.a07.boss-hurt.png",
          "durationMs": 160,
          "alphaBBox": [
            26,
            55,
            166,
            176
          ],
          "sourceCrop": [
            0,
            644,
            633,
            1244
          ]
        },
        {
          "id": "death",
          "file": "races/ashen/art/ashen.a07.boss-death.png",
          "durationMs": 650,
          "alphaBBox": [
            20,
            99,
            172,
            176
          ],
          "sourceCrop": [
            633,
            644,
            1264,
            1244
          ]
        }
      ],
      "animations": {
        "idle": [
          "idle-0"
        ],
        "attack": [
          "idle-0",
          "strike",
          "strike",
          "idle-0"
        ],
        "hurt": [
          "hurt",
          "idle-0"
        ],
        "death": [
          "death"
        ]
      },
      "headY": 32,
      "healthBarAnchor": [
        96,
        24
      ]
    },
    "ashen.a10.boss": {
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
          "file": "races/ashen/art/ashen.a10.boss.png",
          "durationMs": 160,
          "alphaBBox": [
            16,
            44,
            175,
            176
          ],
          "sourceCrop": [
            0,
            0,
            623,
            632
          ]
        },
        {
          "id": "strike",
          "file": "races/ashen/art/ashen.a10.boss-strike.png",
          "durationMs": 160,
          "alphaBBox": [
            11,
            43,
            181,
            176
          ],
          "sourceCrop": [
            623,
            0,
            1254,
            632
          ]
        },
        {
          "id": "hurt",
          "file": "races/ashen/art/ashen.a10.boss-hurt.png",
          "durationMs": 160,
          "alphaBBox": [
            20,
            55,
            171,
            176
          ],
          "sourceCrop": [
            0,
            632,
            618,
            1254
          ]
        },
        {
          "id": "death",
          "file": "races/ashen/art/ashen.a10.boss-death.png",
          "durationMs": 650,
          "alphaBBox": [
            12,
            97,
            180,
            176
          ],
          "sourceCrop": [
            618,
            632,
            1254,
            1254
          ]
        }
      ],
      "animations": {
        "idle": [
          "idle-0"
        ],
        "attack": [
          "idle-0",
          "strike",
          "strike",
          "idle-0"
        ],
        "hurt": [
          "hurt",
          "idle-0"
        ],
        "death": [
          "death"
        ]
      },
      "headY": 32,
      "healthBarAnchor": [
        96,
        24
      ]
    }
  },
  "areas": {
    "ashen.a01": {
      "file": "races/ashen/art/ashen.a01-scene.png",
      "logicalSize": [
        480,
        270
      ],
      "baselineY": 203
    },
    "ashen.a02": {
      "file": "races/ashen/art/ashen.a02-scene.png",
      "logicalSize": [
        480,
        270
      ],
      "baselineY": 203
    },
    "ashen.a03": {
      "file": "races/ashen/art/ashen.a03-scene.png",
      "logicalSize": [
        480,
        270
      ],
      "baselineY": 203
    },
    "ashen.a04": {
      "file": "races/ashen/art/ashen.a04-scene.png",
      "logicalSize": [
        480,
        270
      ],
      "baselineY": 203
    },
    "ashen.a05": {
      "file": "races/ashen/art/ashen.a05-scene.png",
      "logicalSize": [
        480,
        270
      ],
      "baselineY": 203
    },
    "ashen.a06": {
      "file": "races/ashen/art/ashen.a06-scene.png",
      "logicalSize": [
        480,
        270
      ],
      "baselineY": 203
    },
    "ashen.a07": {
      "file": "races/ashen/art/ashen.a07-scene.png",
      "logicalSize": [
        480,
        270
      ],
      "baselineY": 203
    },
    "ashen.a08": {
      "file": "races/ashen/art/ashen.a08-scene.png",
      "logicalSize": [
        480,
        270
      ],
      "baselineY": 203
    },
    "ashen.a09": {
      "file": "races/ashen/art/ashen.a09-scene.png",
      "logicalSize": [
        480,
        270
      ],
      "baselineY": 203
    },
    "ashen.a10": {
      "file": "races/ashen/art/ashen.a10-scene.png",
      "logicalSize": [
        480,
        270
      ],
      "baselineY": 203
    }
  },
  "camp": "battle-assets/backgrounds/camp-ashen.png",
  "equipment": {
    "ashen.scatter.01": {
      "file": "races/ashen/art/equipment-ashen.scatter.01.png",
      "width": 48,
      "height": 48
    },
    "ashen.scatter.02": {
      "file": "races/ashen/art/equipment-ashen.scatter.02.png",
      "width": 48,
      "height": 48
    },
    "ashen.scatter.03": {
      "file": "races/ashen/art/equipment-ashen.scatter.03.png",
      "width": 48,
      "height": 48
    },
    "ashen.scatter.04": {
      "file": "races/ashen/art/equipment-ashen.scatter.04.png",
      "width": 48,
      "height": 48
    },
    "ashen.scatter.05": {
      "file": "races/ashen/art/equipment-ashen.scatter.05.png",
      "width": 48,
      "height": 48
    },
    "ashen.scatter.06": {
      "file": "races/ashen/art/equipment-ashen.scatter.06.png",
      "width": 48,
      "height": 48
    },
    "ashen.scatter.07": {
      "file": "races/ashen/art/equipment-ashen.scatter.07.png",
      "width": 48,
      "height": 48
    },
    "ashen.scatter.08": {
      "file": "races/ashen/art/equipment-ashen.scatter.08.png",
      "width": 48,
      "height": 48
    },
    "ashen.scatter.09": {
      "file": "races/ashen/art/equipment-ashen.scatter.09.png",
      "width": 48,
      "height": 48
    },
    "ashen.scatter.10": {
      "file": "races/ashen/art/equipment-ashen.scatter.10.png",
      "width": 48,
      "height": 48
    },
    "ashen.scatter.11": {
      "file": "races/ashen/art/equipment-ashen.scatter.11.png",
      "width": 48,
      "height": 48
    },
    "ashen.scatter.12": {
      "file": "races/ashen/art/equipment-ashen.scatter.12.png",
      "width": 48,
      "height": 48
    },
    "ashen.scatter.13": {
      "file": "races/ashen/art/equipment-ashen.scatter.13.png",
      "width": 48,
      "height": 48
    },
    "ashen.scatter.14": {
      "file": "races/ashen/art/equipment-ashen.scatter.14.png",
      "width": 48,
      "height": 48
    },
    "ashen.scatter.15": {
      "file": "races/ashen/art/equipment-ashen.scatter.15.png",
      "width": 48,
      "height": 48
    },
    "ashen.scatter.16": {
      "file": "races/ashen/art/equipment-ashen.scatter.16.png",
      "width": 48,
      "height": 48
    },
    "ashen.scatter.17": {
      "file": "races/ashen/art/equipment-ashen.scatter.17.png",
      "width": 48,
      "height": 48
    },
    "ashen.scatter.18": {
      "file": "races/ashen/art/equipment-ashen.scatter.18.png",
      "width": 48,
      "height": 48
    },
    "ashen.scatter.19": {
      "file": "races/ashen/art/equipment-ashen.scatter.19.png",
      "width": 48,
      "height": 48
    },
    "ashen.scatter.20": {
      "file": "races/ashen/art/equipment-ashen.scatter.20.png",
      "width": 48,
      "height": 48
    },
    "ashen.scatter.21": {
      "file": "races/ashen/art/equipment-ashen.scatter.21.png",
      "width": 48,
      "height": 48
    },
    "ashen.scatter.22": {
      "file": "races/ashen/art/equipment-ashen.scatter.22.png",
      "width": 48,
      "height": 48
    },
    "ashen.scatter.23": {
      "file": "races/ashen/art/equipment-ashen.scatter.23.png",
      "width": 48,
      "height": 48
    },
    "ashen.scatter.24": {
      "file": "races/ashen/art/equipment-ashen.scatter.24.png",
      "width": 48,
      "height": 48
    },
    "ashen.scatter.25": {
      "file": "races/ashen/art/equipment-ashen.scatter.25.png",
      "width": 48,
      "height": 48
    },
    "ashen.scatter.26": {
      "file": "races/ashen/art/equipment-ashen.scatter.26.png",
      "width": 48,
      "height": 48
    },
    "ashen.scatter.27": {
      "file": "races/ashen/art/equipment-ashen.scatter.27.png",
      "width": 48,
      "height": 48
    },
    "ashen.scatter.28": {
      "file": "races/ashen/art/equipment-ashen.scatter.28.png",
      "width": 48,
      "height": 48
    },
    "ashen.scatter.29": {
      "file": "races/ashen/art/equipment-ashen.scatter.29.png",
      "width": 48,
      "height": 48
    },
    "ashen.scatter.30": {
      "file": "races/ashen/art/equipment-ashen.scatter.30.png",
      "width": 48,
      "height": 48
    },
    "ashen.scatter.31": {
      "file": "races/ashen/art/equipment-ashen.scatter.31.png",
      "width": 48,
      "height": 48
    },
    "ashen.scatter.32": {
      "file": "races/ashen/art/equipment-ashen.scatter.32.png",
      "width": 48,
      "height": 48
    },
    "ashen.scatter.33": {
      "file": "races/ashen/art/equipment-ashen.scatter.33.png",
      "width": 48,
      "height": 48
    },
    "ashen.scatter.34": {
      "file": "races/ashen/art/equipment-ashen.scatter.34.png",
      "width": 48,
      "height": 48
    },
    "ashen.scatter.35": {
      "file": "races/ashen/art/equipment-ashen.scatter.35.png",
      "width": 48,
      "height": 48
    },
    "ashen.scatter.36": {
      "file": "races/ashen/art/equipment-ashen.scatter.36.png",
      "width": 48,
      "height": 48
    },
    "ashen.caldera.helm": {
      "file": "races/ashen/art/equipment-ashen.caldera.helm.png",
      "width": 48,
      "height": 48
    },
    "ashen.caldera.armor": {
      "file": "races/ashen/art/equipment-ashen.caldera.armor.png",
      "width": 48,
      "height": 48
    },
    "ashen.caldera.gloves": {
      "file": "races/ashen/art/equipment-ashen.caldera.gloves.png",
      "width": 48,
      "height": 48
    },
    "ashen.caldera.boots": {
      "file": "races/ashen/art/equipment-ashen.caldera.boots.png",
      "width": 48,
      "height": 48
    },
    "ashen.strata.helm": {
      "file": "races/ashen/art/equipment-ashen.strata.helm.png",
      "width": 48,
      "height": 48
    },
    "ashen.strata.armor": {
      "file": "races/ashen/art/equipment-ashen.strata.armor.png",
      "width": 48,
      "height": 48
    },
    "ashen.strata.gloves": {
      "file": "races/ashen/art/equipment-ashen.strata.gloves.png",
      "width": 48,
      "height": 48
    },
    "ashen.strata.boots": {
      "file": "races/ashen/art/equipment-ashen.strata.boots.png",
      "width": 48,
      "height": 48
    },
    "ashen.prism.helm": {
      "file": "races/ashen/art/equipment-ashen.prism.helm.png",
      "width": 48,
      "height": 48
    },
    "ashen.prism.armor": {
      "file": "races/ashen/art/equipment-ashen.prism.armor.png",
      "width": 48,
      "height": 48
    },
    "ashen.prism.gloves": {
      "file": "races/ashen/art/equipment-ashen.prism.gloves.png",
      "width": 48,
      "height": 48
    },
    "ashen.prism.boots": {
      "file": "races/ashen/art/equipment-ashen.prism.boots.png",
      "width": 48,
      "height": 48
    },
    "ashen-molten-core": {
      "file": "races/ashen/art/equipment-ashen-molten-core.png",
      "frameSize": [
        48,
        48
      ],
      "pixelArt": true
    },
    "ashen-stone-core": {
      "file": "races/ashen/art/equipment-ashen-stone-core.png",
      "frameSize": [
        48,
        48
      ],
      "pixelArt": true
    },
    "ashen-crystal-core": {
      "file": "races/ashen/art/equipment-ashen-crystal-core.png",
      "frameSize": [
        48,
        48
      ],
      "pixelArt": true
    },
    "ashen-primal-core": {
      "file": "races/ashen/art/equipment-ashen-primal-core.png",
      "frameSize": [
        48,
        48
      ],
      "pixelArt": true
    }
  },
  "skills": {
    "ashen.kindle": {
      "file": "races/ashen/art/skills-ashen.kindle.png",
      "width": 48,
      "height": 48
    },
    "ashen.vent": {
      "file": "races/ashen/art/skills-ashen.vent.png",
      "width": 48,
      "height": 48
    },
    "ashen.anneal": {
      "file": "races/ashen/art/skills-ashen.anneal.png",
      "width": 48,
      "height": 48
    },
    "ashen.surge": {
      "file": "races/ashen/art/skills-ashen.surge.png",
      "width": 48,
      "height": 48
    },
    "ashen.temper": {
      "file": "races/ashen/art/skills-ashen.temper.png",
      "width": 48,
      "height": 48
    },
    "ashen.overload": {
      "file": "races/ashen/art/skills-ashen.overload.png",
      "width": 48,
      "height": 48
    },
    "ashen.mantle": {
      "file": "races/ashen/art/skills-ashen.mantle.png",
      "width": 48,
      "height": 48
    },
    "ashen.cleave": {
      "file": "races/ashen/art/skills-ashen.cleave.png",
      "width": 48,
      "height": 48
    },
    "ashen.fault": {
      "file": "races/ashen/art/skills-ashen.fault.png",
      "width": 48,
      "height": 48
    },
    "ashen.rebuild": {
      "file": "races/ashen/art/skills-ashen.rebuild.png",
      "width": 48,
      "height": 48
    },
    "ashen.quarry": {
      "file": "races/ashen/art/skills-ashen.quarry.png",
      "width": 48,
      "height": 48
    },
    "ashen.fracture": {
      "file": "races/ashen/art/skills-ashen.fracture.png",
      "width": 48,
      "height": 48
    },
    "ashen.tap": {
      "file": "races/ashen/art/skills-ashen.tap.png",
      "width": 48,
      "height": 48
    },
    "ashen.dawn": {
      "file": "races/ashen/art/skills-ashen.dawn.png",
      "width": 48,
      "height": 48
    },
    "ashen.dusk": {
      "file": "races/ashen/art/skills-ashen.dusk.png",
      "width": 48,
      "height": 48
    },
    "ashen.chorus": {
      "file": "races/ashen/art/skills-ashen.chorus.png",
      "width": 48,
      "height": 48
    },
    "ashen.mend": {
      "file": "races/ashen/art/skills-ashen.mend.png",
      "width": 48,
      "height": 48
    },
    "ashen.resound": {
      "file": "races/ashen/art/skills-ashen.resound.png",
      "width": 48,
      "height": 48
    },
    "ashen.salve": {
      "file": "races/ashen/art/skills-ashen.salve.png",
      "width": 48,
      "height": 48
    },
    "ashen.interrupt": {
      "file": "races/ashen/art/skills-ashen.interrupt.png",
      "width": 48,
      "height": 48
    },
    "ashen.purify": {
      "file": "races/ashen/art/skills-ashen.purify.png",
      "width": 48,
      "height": 48
    },
    "ashen.thermal": {
      "file": "races/ashen/art/skills-ashen.thermal.png",
      "width": 48,
      "height": 48
    },
    "ashen.insulation": {
      "file": "races/ashen/art/skills-ashen.insulation.png",
      "width": 48,
      "height": 48
    },
    "ashen.laminate": {
      "file": "races/ashen/art/skills-ashen.laminate.png",
      "width": 48,
      "height": 48
    },
    "ashen.matrix": {
      "file": "races/ashen/art/skills-ashen.matrix.png",
      "width": 48,
      "height": 48
    },
    "ashen.lattice": {
      "file": "races/ashen/art/skills-ashen.lattice.png",
      "width": 48,
      "height": 48
    },
    "ashen.clarity": {
      "file": "races/ashen/art/skills-ashen.clarity.png",
      "width": 48,
      "height": 48
    },
    "ashen.endurance": {
      "file": "races/ashen/art/skills-ashen.endurance.png",
      "width": 48,
      "height": 48
    },
    "ashen.vitality": {
      "file": "races/ashen/art/skills-ashen.vitality.png",
      "width": 48,
      "height": 48
    },
    "ashen.precision": {
      "file": "races/ashen/art/skills-ashen.precision.png",
      "width": 48,
      "height": 48
    }
  },
  "materials": {
    "ashen.cold_ash_sand": {
      "file": "races/ashen/art/materials-ashen.cold_ash_sand.png",
      "width": 48,
      "height": 48
    },
    "ashen.salt_shell": {
      "file": "races/ashen/art/materials-ashen.salt_shell.png",
      "width": 48,
      "height": 48
    },
    "ashen.porous_basalt": {
      "file": "races/ashen/art/materials-ashen.porous_basalt.png",
      "width": 48,
      "height": 48
    },
    "ashen.weathered_mica": {
      "file": "races/ashen/art/materials-ashen.weathered_mica.png",
      "width": 48,
      "height": 48
    },
    "ashen.dew_salt": {
      "file": "races/ashen/art/materials-ashen.dew_salt.png",
      "width": 48,
      "height": 48
    },
    "ashen.glass_grain": {
      "file": "races/ashen/art/materials-ashen.glass_grain.png",
      "width": 48,
      "height": 48
    },
    "ashen.red_vein_ore": {
      "file": "races/ashen/art/materials-ashen.red_vein_ore.png",
      "width": 48,
      "height": 48
    },
    "ashen.singing_crystal": {
      "file": "races/ashen/art/materials-ashen.singing_crystal.png",
      "width": 48,
      "height": 48
    },
    "ashen.obsidian_glass": {
      "file": "races/ashen/art/materials-ashen.obsidian_glass.png",
      "width": 48,
      "height": 48
    },
    "ashen.white_salt_marrow": {
      "file": "races/ashen/art/materials-ashen.white_salt_marrow.png",
      "width": 48,
      "height": 48
    },
    "ashen.dim_crystal_sand": {
      "file": "races/ashen/art/materials-ashen.dim_crystal_sand.png",
      "width": 48,
      "height": 48
    },
    "ashen.refractory_stone": {
      "file": "races/ashen/art/materials-ashen.refractory_stone.png",
      "width": 48,
      "height": 48
    },
    "ashen.living_vein_bud": {
      "file": "races/ashen/art/materials-ashen.living_vein_bud.png",
      "width": 48,
      "height": 48
    },
    "ashen.upwind_salt": {
      "file": "races/ashen/art/materials-ashen.upwind_salt.png",
      "width": 48,
      "height": 48
    },
    "ashen.refracted_glassheart": {
      "file": "races/ashen/art/materials-ashen.refracted_glassheart.png",
      "width": 48,
      "height": 48
    },
    "ashen.undying_ember": {
      "file": "races/ashen/art/materials-ashen.undying_ember.png",
      "width": 48,
      "height": 48
    },
    "ashen.infinity_gem_ashen": {
      "file": "races/ashen/art/materials-ashen.infinity_gem_ashen.png",
      "width": 48,
      "height": 48
    },
    "ashen.silent_crystal": {
      "file": "races/ashen/art/materials-ashen.silent_crystal.png",
      "width": 48,
      "height": 48
    }
  },
  "provenance": "Original built-in image_gen raster art. Native pixel crops; nearest-neighbor processing only.",
  "heroWeapons": {
    "armguard": {
      "frameSize": [
        192,
        192
      ],
      "anchor": [
        96,
        176
      ],
      "facing": "right",
      "frames": [
        {
          "id": "idle",
          "file": "races/ashen/art/hero-armguard-idle.png",
          "durationMs": 160,
          "alphaBBox": [
            45,
            54,
            146,
            176
          ]
        },
        {
          "id": "strike",
          "file": "races/ashen/art/hero-armguard-strike.png",
          "durationMs": 160,
          "alphaBBox": [
            23,
            70,
            168,
            176
          ]
        },
        {
          "id": "hurt",
          "file": "races/ashen/art/hero-armguard-hurt.png",
          "durationMs": 160,
          "alphaBBox": [
            48,
            69,
            144,
            176
          ]
        },
        {
          "id": "death",
          "file": "races/ashen/art/hero-armguard-death.png",
          "durationMs": 650,
          "alphaBBox": [
            35,
            107,
            156,
            176
          ]
        }
      ],
      "animations": {
        "idle": [
          "idle"
        ],
        "attack": [
          "idle",
          "strike",
          "strike",
          "idle"
        ],
        "hurt": [
          "hurt",
          "idle"
        ],
        "death": [
          "death"
        ]
      },
      "headY": 51,
      "healthBarAnchor": [
        96,
        40
      ],
      "weaponFamily": "armguard"
    },
    "hammer": {
      "frameSize": [
        192,
        192
      ],
      "anchor": [
        96,
        176
      ],
      "facing": "right",
      "frames": [
        {
          "id": "idle-0",
          "file": "races/ashen/art/hero-idle-0.png",
          "durationMs": 160,
          "alphaBBox": [
            44,
            54,
            147,
            191
          ]
        },
        {
          "id": "strike",
          "file": "races/ashen/art/hero-strike.png",
          "durationMs": 160,
          "alphaBBox": [
            10,
            74,
            182,
            176
          ]
        },
        {
          "id": "hurt",
          "file": "races/ashen/art/hero-hurt.png",
          "durationMs": 160,
          "alphaBBox": [
            44,
            40,
            147,
            191
          ]
        },
        {
          "id": "channel",
          "file": "races/ashen/art/hero-channel.png",
          "durationMs": 160,
          "alphaBBox": [
            51,
            52,
            141,
            177
          ]
        },
        {
          "id": "death",
          "file": "races/ashen/art/hero-hammer-death.png",
          "durationMs": 650,
          "alphaBBox": [
            15,
            128,
            176,
            176
          ]
        }
      ],
      "animations": {
        "idle": [
          "idle-0"
        ],
        "attack": [
          "idle-0",
          "strike",
          "strike",
          "idle-0"
        ],
        "hurt": [
          "hurt",
          "idle-0"
        ],
        "death": [
          "death"
        ]
      },
      "headY": 55,
      "healthBarAnchor": [
        96,
        43
      ],
      "weaponFamily": "hammer"
    }
  }
};

art.equipment['ashen.scatter.37']={file:'races/ashen/assets/ashen.scatter.37.png',width:64,height:64};

// Individually image-generated ordinary slot-parity art; original assets unchanged.
art.equipment['ashen.scatter.38']={file:'races/ashen/assets/ashen.scatter.38.png',width:64,height:64};
art.equipment['ashen.scatter.39']={file:'races/ashen/assets/ashen.scatter.39.png',width:64,height:64};
art.equipment['ashen.scatter.40']={file:'races/ashen/assets/ashen.scatter.40.png',width:64,height:64};
art.equipment['ashen.scatter.41']={file:'races/ashen/assets/ashen.scatter.41.png',width:64,height:64};
art.equipment['ashen.scatter.42']={file:'races/ashen/assets/ashen.scatter.42.png',width:64,height:64};
art.equipment['ashen.scatter.43']={file:'races/ashen/assets/ashen.scatter.43.png',width:64,height:64};
art.equipment['ashen.scatter.44']={file:'races/ashen/assets/ashen.scatter.44.png',width:64,height:64};
art.equipment['ashen.scatter.45']={file:'races/ashen/assets/ashen.scatter.45.png',width:64,height:64};
art.equipment['ashen.scatter.46']={file:'races/ashen/assets/ashen.scatter.46.png',width:64,height:64};
art.equipment['ashen.scatter.47']={file:'races/ashen/assets/ashen.scatter.47.png',width:64,height:64};
art.equipment['ashen.scatter.48']={file:'races/ashen/assets/ashen.scatter.48.png',width:64,height:64};
art.equipment['ashen.scatter.49']={file:'races/ashen/assets/ashen.scatter.49.png',width:64,height:64};
art.equipment['ashen.scatter.50']={file:'races/ashen/assets/ashen.scatter.50.png',width:64,height:64};
art.equipment['ashen.scatter.51']={file:'races/ashen/assets/ashen.scatter.51.png',width:64,height:64};
art.equipment['ashen.scatter.52']={file:'races/ashen/assets/ashen.scatter.52.png',width:64,height:64};
art.equipment['ashen.scatter.53']={file:'races/ashen/assets/ashen.scatter.53.png',width:64,height:64};
art.equipment['ashen.scatter.54']={file:'races/ashen/assets/ashen.scatter.54.png',width:64,height:64};
art.equipment['ashen.scatter.55']={file:'races/ashen/assets/ashen.scatter.55.png',width:64,height:64};
