// Verified empty-gauntlet artwork reused unchanged, no external held weapon.
export const HERO_NEUTRAL={
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
      ],
      "solidBBox": [
        45,
        54,
        145,
        175
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
      ],
      "solidBBox": [
        23,
        70,
        167,
        175
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
      ],
      "solidBBox": [
        48,
        69,
        143,
        175
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
      ],
      "solidBBox": [
        35,
        107,
        155,
        175
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
  "appearance": "neutral"
};
