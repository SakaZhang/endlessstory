export const HUMAN_LEGENDARY_HERO_ART={
  "first-forge-oathhammer": {
    "frameSize": [
      320,
      256
    ],
    "anchor": [
      96,
      176
    ],
    "facing": "right",
    "bodyReferenceBounds": [
      86,
      176
    ],
    "frames": [
      {
        "id": "idle-0",
        "file": "../legendary-hero-body/human-first-forge-oathhammer/idle-0.png",
        "durationMs": 180,
        "alphaBBox": [
          37,
          31,
          188,
          182
        ],
        "solidBBox": [
          52,
          84,
          130,
          176
        ],
        "weaponPose": {
          "hand": [
            118,
            140
          ],
          "grip": [
            42,
            44
          ],
          "angle": 145,
          "front": [
            [
              112,
              134,
              13,
              13
            ],
            [
              100,
              128,
              13,
              13
            ]
          ]
        }
      },
      {
        "id": "idle-1",
        "file": "../legendary-hero-body/human-first-forge-oathhammer/idle-1.png",
        "durationMs": 180,
        "alphaBBox": [
          25,
          26,
          187,
          184
        ],
        "solidBBox": [
          53,
          84,
          131,
          176
        ],
        "weaponPose": {
          "hand": [
            118,
            140
          ],
          "grip": [
            42,
            44
          ],
          "angle": 145,
          "front": [
            [
              112,
              134,
              13,
              13
            ],
            [
              100,
              128,
              13,
              13
            ]
          ]
        }
      },
      {
        "id": "anticipation",
        "file": "../legendary-hero-body/human-first-forge-oathhammer/anticipation.png",
        "durationMs": 180,
        "alphaBBox": [
          25,
          30,
          187,
          186
        ],
        "solidBBox": [
          60,
          70,
          139,
          176
        ],
        "weaponPose": {
          "hand": [
            102,
            79
          ],
          "grip": [
            36,
            34
          ],
          "angle": -33,
          "front": [
            [
              96,
              73,
              13,
              13
            ]
          ]
        }
      },
      {
        "id": "attack",
        "file": "../legendary-hero-body/human-first-forge-oathhammer/attack.png",
        "durationMs": 180,
        "alphaBBox": [
          27,
          37,
          175,
          186
        ],
        "solidBBox": [
          28,
          95,
          136,
          176
        ],
        "weaponPose": {
          "hand": [
            130,
            132
          ],
          "grip": [
            42,
            44
          ],
          "angle": 117,
          "front": [
            [
              124,
              126,
              13,
              13
            ],
            [
              109,
              126,
              13,
              13
            ]
          ]
        }
      },
      {
        "id": "recovery",
        "file": "../legendary-hero-body/human-first-forge-oathhammer/recovery.png",
        "durationMs": 180,
        "alphaBBox": [
          34,
          33,
          188,
          189
        ],
        "solidBBox": [
          48,
          84,
          130,
          176
        ],
        "weaponPose": {
          "hand": [
            118,
            142
          ],
          "grip": [
            42,
            44
          ],
          "angle": 145,
          "front": [
            [
              112,
              136,
              13,
              13
            ],
            [
              101,
              131,
              13,
              13
            ]
          ]
        }
      },
      {
        "id": "hurt",
        "file": "../legendary-hero-body/human-first-forge-oathhammer/hurt.png",
        "durationMs": 180,
        "alphaBBox": [
          25,
          38,
          187,
          179
        ],
        "solidBBox": [
          50,
          84,
          145,
          177
        ],
        "weaponPose": {
          "hand": [
            117,
            127
          ],
          "grip": [
            42,
            44
          ],
          "angle": 97,
          "front": [
            [
              111,
              121,
              13,
              13
            ],
            [
              92,
              128,
              13,
              13
            ]
          ]
        }
      },
      {
        "id": "guard",
        "file": "../legendary-hero-body/human-first-forge-oathhammer/guard.png",
        "durationMs": 180,
        "alphaBBox": [
          25,
          33,
          188,
          178
        ],
        "solidBBox": [
          43,
          84,
          134,
          177
        ],
        "weaponPose": {
          "hand": [
            118,
            120
          ],
          "grip": [
            42,
            44
          ],
          "angle": 67,
          "front": [
            [
              112,
              114,
              13,
              13
            ],
            [
              99,
              126,
              13,
              13
            ]
          ]
        }
      },
      {
        "id": "death",
        "file": "../legendary-hero-body/human-first-forge-oathhammer/death.png",
        "durationMs": 180,
        "alphaBBox": [
          25,
          33,
          183,
          179
        ],
        "solidBBox": [
          25,
          139,
          136,
          179
        ],
        "weaponPose": {
          "hand": [
            129,
            170
          ],
          "grip": [
            42,
            44
          ],
          "angle": 117,
          "front": [
            [
              123,
              164,
              13,
              13
            ],
            [
              103,
              167,
              13,
              13
            ]
          ]
        }
      }
    ],
    "animations": {
      "idle": [
        "idle-0",
        "idle-1"
      ],
      "anticipation": [
        "anticipation"
      ],
      "attack": [
        "anticipation",
        "attack",
        "recovery",
        "idle-0"
      ],
      "recovery": [
        "recovery"
      ],
      "hurt": [
        "hurt",
        "idle-0"
      ],
      "guard": [
        "guard"
      ],
      "death": [
        "death"
      ]
    },
    "legendaryWeapon": {
      "id": "first-forge-oathhammer",
      "scale": 1.4
    }
  },
  "human-oathblade": {
    "frameSize": [
      320,
      256
    ],
    "anchor": [
      96,
      176
    ],
    "facing": "right",
    "bodyReferenceBounds": [
      86,
      176
    ],
    "frames": [
      {
        "id": "idle-0",
        "file": "../legendary-hero-body/human-human-oathblade/idle-0.png",
        "durationMs": 180,
        "alphaBBox": [
          45,
          81,
          136,
          180
        ],
        "solidBBox": [
          48,
          83,
          135,
          177
        ],
        "weaponPose": {
          "hand": [
            115,
            137
          ],
          "grip": [
            50,
            10
          ],
          "angle": -105,
          "front": [
            [
              109,
              131,
              13,
              13
            ],
            [
              103,
              126,
              13,
              13
            ]
          ]
        }
      },
      {
        "id": "idle-1",
        "file": "../legendary-hero-body/human-human-oathblade/idle-1.png",
        "durationMs": 180,
        "alphaBBox": [
          44,
          40,
          135,
          180
        ],
        "solidBBox": [
          47,
          83,
          134,
          177
        ],
        "weaponPose": {
          "hand": [
            115,
            137
          ],
          "grip": [
            50,
            10
          ],
          "angle": -105,
          "front": [
            [
              109,
              131,
              13,
              13
            ],
            [
              103,
              126,
              13,
              13
            ]
          ]
        }
      },
      {
        "id": "anticipation",
        "file": "../legendary-hero-body/human-human-oathblade/anticipation.png",
        "durationMs": 180,
        "alphaBBox": [
          45,
          59,
          144,
          181
        ],
        "solidBBox": [
          47,
          62,
          143,
          177
        ],
        "weaponPose": {
          "hand": [
            106,
            70
          ],
          "grip": [
            50,
            10
          ],
          "angle": 80,
          "front": [
            [
              100,
              64,
              13,
              13
            ]
          ]
        }
      },
      {
        "id": "attack",
        "file": "../legendary-hero-body/human-human-oathblade/attack.png",
        "durationMs": 180,
        "alphaBBox": [
          30,
          90,
          159,
          180
        ],
        "solidBBox": [
          32,
          91,
          156,
          177
        ],
        "weaponPose": {
          "hand": [
            148,
            130
          ],
          "grip": [
            50,
            10
          ],
          "angle": -135,
          "front": [
            [
              142,
              124,
              13,
              13
            ],
            [
              126,
              124,
              13,
              13
            ]
          ]
        }
      },
      {
        "id": "recovery",
        "file": "../legendary-hero-body/human-human-oathblade/recovery.png",
        "durationMs": 180,
        "alphaBBox": [
          47,
          83,
          139,
          182
        ],
        "solidBBox": [
          48,
          87,
          138,
          179
        ],
        "weaponPose": {
          "hand": [
            118,
            138
          ],
          "grip": [
            50,
            10
          ],
          "angle": -105,
          "front": [
            [
              112,
              132,
              13,
              13
            ],
            [
              103,
              128,
              13,
              13
            ]
          ]
        }
      },
      {
        "id": "hurt",
        "file": "../legendary-hero-body/human-human-oathblade/hurt.png",
        "durationMs": 180,
        "alphaBBox": [
          48,
          41,
          188,
          182
        ],
        "solidBBox": [
          49,
          88,
          138,
          179
        ],
        "weaponPose": {
          "hand": [
            120,
            138
          ],
          "grip": [
            50,
            10
          ],
          "angle": -105,
          "front": [
            [
              114,
              132,
              13,
              13
            ],
            [
              104,
              128,
              13,
              13
            ]
          ]
        }
      },
      {
        "id": "guard",
        "file": "../legendary-hero-body/human-human-oathblade/guard.png",
        "durationMs": 180,
        "alphaBBox": [
          35,
          86,
          135,
          182
        ],
        "solidBBox": [
          36,
          87,
          134,
          179
        ],
        "weaponPose": {
          "hand": [
            116,
            118
          ],
          "grip": [
            50,
            10
          ],
          "angle": 135,
          "front": [
            [
              110,
              112,
              13,
              13
            ],
            [
              105,
              122,
              13,
              13
            ]
          ]
        }
      },
      {
        "id": "death",
        "file": "../legendary-hero-body/human-human-oathblade/death.png",
        "durationMs": 180,
        "alphaBBox": [
          15,
          72,
          174,
          181
        ],
        "solidBBox": [
          29,
          134,
          172,
          180
        ],
        "weaponPose": {
          "hand": [
            137,
            168
          ],
          "grip": [
            50,
            10
          ],
          "angle": -135,
          "front": [
            [
              131,
              162,
              13,
              13
            ],
            [
              120,
              168,
              13,
              13
            ]
          ]
        }
      }
    ],
    "animations": {
      "idle": [
        "idle-0",
        "idle-1"
      ],
      "anticipation": [
        "anticipation"
      ],
      "attack": [
        "anticipation",
        "attack",
        "recovery",
        "idle-0"
      ],
      "recovery": [
        "recovery"
      ],
      "hurt": [
        "hurt",
        "idle-0"
      ],
      "guard": [
        "guard"
      ],
      "death": [
        "death"
      ]
    },
    "legendaryWeapon": {
      "id": "human-oathblade",
      "scale": 1.4
    }
  },
  "goblin-silent-ration": {
    "frameSize": [
      320,
      256
    ],
    "anchor": [
      96,
      176
    ],
    "facing": "right",
    "bodyReferenceBounds": [
      86,
      176
    ],
    "frames": [
      {
        "id": "idle-0",
        "file": "../legendary-hero-body/human-goblin-silent-ration/idle-0.png",
        "durationMs": 180,
        "alphaBBox": [
          46,
          48,
          166,
          177
        ],
        "solidBBox": [
          48,
          84,
          135,
          175
        ],
        "weaponPose": {
          "hand": [
            117,
            139
          ],
          "grip": [
            35,
            10
          ],
          "angle": -105,
          "front": [
            [
              111,
              133,
              13,
              13
            ]
          ]
        }
      },
      {
        "id": "idle-1",
        "file": "../legendary-hero-body/human-goblin-silent-ration/idle-1.png",
        "durationMs": 180,
        "alphaBBox": [
          27,
          45,
          135,
          177
        ],
        "solidBBox": [
          44,
          84,
          133,
          175
        ],
        "weaponPose": {
          "hand": [
            117,
            139
          ],
          "grip": [
            35,
            10
          ],
          "angle": -105,
          "front": [
            [
              111,
              133,
              13,
              13
            ]
          ]
        }
      },
      {
        "id": "anticipation",
        "file": "../legendary-hero-body/human-goblin-silent-ration/anticipation.png",
        "durationMs": 180,
        "alphaBBox": [
          41,
          51,
          144,
          177
        ],
        "solidBBox": [
          44,
          87,
          143,
          175
        ],
        "weaponPose": {
          "hand": [
            77,
            132
          ],
          "grip": [
            35,
            10
          ],
          "angle": -105,
          "front": [
            [
              71,
              126,
              13,
              13
            ]
          ]
        }
      },
      {
        "id": "attack",
        "file": "../legendary-hero-body/human-goblin-silent-ration/attack.png",
        "durationMs": 180,
        "alphaBBox": [
          39,
          61,
          162,
          177
        ],
        "solidBBox": [
          41,
          86,
          159,
          175
        ],
        "weaponPose": {
          "hand": [
            153,
            122
          ],
          "grip": [
            35,
            10
          ],
          "angle": -135,
          "front": [
            [
              147,
              116,
              13,
              13
            ]
          ]
        }
      },
      {
        "id": "recovery",
        "file": "../legendary-hero-body/human-goblin-silent-ration/recovery.png",
        "durationMs": 180,
        "alphaBBox": [
          48,
          56,
          170,
          178
        ],
        "solidBBox": [
          54,
          85,
          143,
          177
        ],
        "weaponPose": {
          "hand": [
            127,
            138
          ],
          "grip": [
            35,
            10
          ],
          "angle": -105,
          "front": [
            [
              121,
              132,
              13,
              13
            ]
          ]
        }
      },
      {
        "id": "hurt",
        "file": "../legendary-hero-body/human-goblin-silent-ration/hurt.png",
        "durationMs": 180,
        "alphaBBox": [
          36,
          70,
          169,
          178
        ],
        "solidBBox": [
          54,
          90,
          147,
          177
        ],
        "weaponPose": {
          "hand": [
            113,
            132
          ],
          "grip": [
            35,
            10
          ],
          "angle": -100,
          "front": [
            [
              107,
              126,
              13,
              13
            ]
          ]
        }
      },
      {
        "id": "guard",
        "file": "../legendary-hero-body/human-goblin-silent-ration/guard.png",
        "durationMs": 180,
        "alphaBBox": [
          28,
          59,
          134,
          178
        ],
        "solidBBox": [
          47,
          86,
          133,
          177
        ],
        "weaponPose": {
          "hand": [
            120,
            122
          ],
          "grip": [
            35,
            10
          ],
          "angle": 135,
          "front": [
            [
              114,
              116,
              13,
              13
            ]
          ]
        }
      },
      {
        "id": "death",
        "file": "../legendary-hero-body/human-goblin-silent-ration/death.png",
        "durationMs": 180,
        "alphaBBox": [
          30,
          75,
          172,
          182
        ],
        "solidBBox": [
          33,
          140,
          170,
          181
        ],
        "weaponPose": {
          "hand": [
            147,
            176
          ],
          "grip": [
            35,
            10
          ],
          "angle": -135,
          "front": [
            [
              141,
              170,
              13,
              13
            ]
          ]
        }
      }
    ],
    "animations": {
      "idle": [
        "idle-0",
        "idle-1"
      ],
      "anticipation": [
        "anticipation"
      ],
      "attack": [
        "anticipation",
        "attack",
        "recovery",
        "idle-0"
      ],
      "recovery": [
        "recovery"
      ],
      "hurt": [
        "hurt",
        "idle-0"
      ],
      "guard": [
        "guard"
      ],
      "death": [
        "death"
      ]
    },
    "legendaryWeapon": {
      "id": "goblin-silent-ration",
      "scale": 1
    }
  },
  "elf-sixfold-heartwood": {
    "frameSize": [
      320,
      256
    ],
    "anchor": [
      96,
      176
    ],
    "facing": "right",
    "bodyReferenceBounds": [
      86,
      176
    ],
    "frames": [
      {
        "id": "idle-0",
        "file": "../legendary-hero-body/human-elf-sixfold-heartwood/idle-0.png",
        "durationMs": 180,
        "alphaBBox": [
          55,
          54,
          146,
          177
        ],
        "solidBBox": [
          56,
          86,
          129,
          176
        ],
        "weaponPose": {
          "hand": [
            125,
            115
          ],
          "angle": 0,
          "grip": [
            31,
            31
          ],
          "front": [
            [
              119,
              109,
              13,
              14
            ]
          ]
        }
      },
      {
        "id": "idle-1",
        "file": "../legendary-hero-body/human-elf-sixfold-heartwood/idle-1.png",
        "durationMs": 180,
        "alphaBBox": [
          40,
          54,
          158,
          177
        ],
        "solidBBox": [
          54,
          86,
          127,
          176
        ],
        "weaponPose": {
          "hand": [
            124,
            116
          ],
          "angle": 0,
          "grip": [
            31,
            31
          ],
          "front": [
            [
              118,
              110,
              13,
              14
            ]
          ]
        }
      },
      {
        "id": "anticipation",
        "file": "../legendary-hero-body/human-elf-sixfold-heartwood/anticipation.png",
        "durationMs": 180,
        "alphaBBox": [
          59,
          53,
          145,
          177
        ],
        "solidBBox": [
          61,
          98,
          137,
          176
        ],
        "weaponPose": {
          "hand": [
            82,
            109
          ],
          "angle": 10,
          "grip": [
            31,
            33
          ],
          "front": [
            [
              76,
              102,
              13,
              13
            ],
            [
              77,
              111,
              13,
              12
            ]
          ]
        }
      },
      {
        "id": "attack",
        "file": "../legendary-hero-body/human-elf-sixfold-heartwood/attack.png",
        "durationMs": 180,
        "alphaBBox": [
          44,
          55,
          193,
          177
        ],
        "solidBBox": [
          51,
          99,
          151,
          176
        ],
        "weaponPose": {
          "hand": [
            146,
            121
          ],
          "angle": 79,
          "grip": [
            31,
            31
          ],
          "front": [
            [
              139,
              115,
              15,
              14
            ],
            [
              93,
              124,
              14,
              13
            ]
          ]
        }
      },
      {
        "id": "recovery",
        "file": "../legendary-hero-body/human-elf-sixfold-heartwood/recovery.png",
        "durationMs": 180,
        "alphaBBox": [
          55,
          68,
          153,
          179
        ],
        "solidBBox": [
          56,
          97,
          136,
          176
        ],
        "weaponPose": {
          "hand": [
            123,
            130
          ],
          "angle": 52,
          "grip": [
            31,
            34
          ],
          "front": [
            [
              117,
              124,
              13,
              13
            ],
            [
              109,
              131,
              14,
              13
            ]
          ]
        }
      },
      {
        "id": "hurt",
        "file": "../legendary-hero-body/human-elf-sixfold-heartwood/hurt.png",
        "durationMs": 180,
        "alphaBBox": [
          34,
          68,
          142,
          178
        ],
        "solidBBox": [
          58,
          102,
          141,
          176
        ],
        "weaponPose": {
          "hand": [
            65,
            127
          ],
          "angle": -10,
          "grip": [
            31,
            34
          ],
          "front": [
            [
              58,
              120,
              15,
              15
            ]
          ]
        }
      },
      {
        "id": "guard",
        "file": "../legendary-hero-body/human-elf-sixfold-heartwood/guard.png",
        "durationMs": 180,
        "alphaBBox": [
          57,
          68,
          134,
          179
        ],
        "solidBBox": [
          58,
          97,
          133,
          176
        ],
        "weaponPose": {
          "hand": [
            120,
            122
          ],
          "angle": 11,
          "grip": [
            31,
            34
          ],
          "front": [
            [
              114,
              115,
              13,
              15
            ],
            [
              111,
              126,
              15,
              13
            ]
          ]
        }
      },
      {
        "id": "death",
        "file": "../legendary-hero-body/human-elf-sixfold-heartwood/death.png",
        "durationMs": 180,
        "alphaBBox": [
          20,
          68,
          177,
          178
        ],
        "solidBBox": [
          23,
          138,
          134,
          175
        ],
        "weaponPose": {
          "hand": [
            128,
            164
          ],
          "angle": 83,
          "grip": [
            31,
            31
          ],
          "front": [
            [
              121,
              157,
              15,
              13
            ],
            [
              90,
              160,
              15,
              13
            ]
          ]
        }
      }
    ],
    "animations": {
      "idle": [
        "idle-0",
        "idle-1"
      ],
      "anticipation": [
        "anticipation"
      ],
      "attack": [
        "anticipation",
        "attack",
        "recovery",
        "idle-0"
      ],
      "recovery": [
        "recovery"
      ],
      "hurt": [
        "hurt",
        "idle-0"
      ],
      "guard": [
        "guard"
      ],
      "death": [
        "death"
      ]
    },
    "legendaryWeapon": {
      "id": "elf-sixfold-heartwood",
      "scale": 2
    }
  },
  "elf-last-string": {
    "frameSize": [
      320,
      256
    ],
    "anchor": [
      96,
      176
    ],
    "facing": "right",
    "bodyReferenceBounds": [
      86,
      176
    ],
    "frames": [
      {
        "id": "idle-0",
        "file": "../legendary-hero-body/human-elf-last-string/idle-0.png",
        "durationMs": 180,
        "alphaBBox": [
          53,
          84,
          126,
          176
        ],
        "solidBBox": [
          53,
          85,
          125,
          176
        ],
        "weaponPose": {
          "hand": [
            118,
            145
          ],
          "grip": [
            18,
            30
          ],
          "angle": 180,
          "front": [
            [
              112,
              139,
              13,
              13
            ]
          ]
        }
      },
      {
        "id": "idle-1",
        "file": "../legendary-hero-body/human-elf-last-string/idle-1.png",
        "durationMs": 180,
        "alphaBBox": [
          53,
          52,
          163,
          176
        ],
        "solidBBox": [
          55,
          85,
          127,
          176
        ],
        "weaponPose": {
          "hand": [
            118,
            145
          ],
          "grip": [
            18,
            30
          ],
          "angle": 180,
          "front": [
            [
              112,
              139,
              13,
              13
            ]
          ]
        }
      },
      {
        "id": "anticipation",
        "file": "../legendary-hero-body/human-elf-last-string/anticipation.png",
        "durationMs": 180,
        "alphaBBox": [
          48,
          62,
          146,
          177
        ],
        "solidBBox": [
          49,
          85,
          145,
          176
        ],
        "weaponPose": {
          "hand": [
            141,
            119
          ],
          "grip": [
            18,
            30
          ],
          "angle": 180,
          "front": [
            [
              135,
              113,
              13,
              13
            ],
            [
              83,
              107,
              13,
              13
            ]
          ],
          "bowPull": [
            50.5,
            33.75
          ],
          "drawHand": [
            89,
            113
          ]
        }
      },
      {
        "id": "attack",
        "file": "../legendary-hero-body/human-elf-last-string/attack.png",
        "durationMs": 180,
        "alphaBBox": [
          39,
          63,
          158,
          176
        ],
        "solidBBox": [
          52,
          92,
          157,
          176
        ],
        "weaponPose": {
          "hand": [
            154,
            123
          ],
          "grip": [
            18,
            30
          ],
          "angle": 180,
          "front": [
            [
              148,
              117,
              13,
              13
            ]
          ]
        }
      },
      {
        "id": "recovery",
        "file": "../legendary-hero-body/human-elf-last-string/recovery.png",
        "durationMs": 180,
        "alphaBBox": [
          46,
          66,
          165,
          179
        ],
        "solidBBox": [
          52,
          88,
          130,
          176
        ],
        "weaponPose": {
          "hand": [
            118,
            146
          ],
          "grip": [
            18,
            30
          ],
          "angle": 180,
          "front": [
            [
              112,
              140,
              13,
              13
            ]
          ]
        }
      },
      {
        "id": "hurt",
        "file": "../legendary-hero-body/human-elf-last-string/hurt.png",
        "durationMs": 180,
        "alphaBBox": [
          37,
          67,
          167,
          179
        ],
        "solidBBox": [
          52,
          92,
          146,
          176
        ],
        "weaponPose": {
          "hand": [
            131,
            131
          ],
          "grip": [
            18,
            30
          ],
          "angle": 160,
          "front": [
            [
              125,
              125,
              13,
              13
            ]
          ]
        }
      },
      {
        "id": "guard",
        "file": "../legendary-hero-body/human-elf-last-string/guard.png",
        "durationMs": 180,
        "alphaBBox": [
          43,
          98,
          130,
          179
        ],
        "solidBBox": [
          49,
          100,
          129,
          176
        ],
        "weaponPose": {
          "hand": [
            124,
            134
          ],
          "grip": [
            18,
            30
          ],
          "angle": 180,
          "front": [
            [
              118,
              128,
              13,
              13
            ]
          ]
        }
      },
      {
        "id": "death",
        "file": "../legendary-hero-body/human-elf-last-string/death.png",
        "durationMs": 180,
        "alphaBBox": [
          35,
          62,
          141,
          179
        ],
        "solidBBox": [
          35,
          138,
          140,
          176
        ],
        "weaponPose": {
          "hand": [
            135,
            168
          ],
          "grip": [
            38,
            50
          ],
          "angle": 90,
          "front": [
            [
              129,
              162,
              13,
              13
            ]
          ]
        }
      }
    ],
    "animations": {
      "idle": [
        "idle-0",
        "idle-1"
      ],
      "anticipation": [
        "anticipation"
      ],
      "attack": [
        "anticipation",
        "attack",
        "recovery",
        "idle-0"
      ],
      "recovery": [
        "recovery"
      ],
      "hurt": [
        "hurt",
        "idle-0"
      ],
      "guard": [
        "guard"
      ],
      "death": [
        "death"
      ]
    },
    "legendaryWeapon": {
      "id": "elf-last-string",
      "scale": 1.6
    }
  }
};
