// Imagegen refined youthful Elf, empty-hand lifecycle.
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
  "appearance": "neutral",
  "frames": [
    {
      "id": "idle",
      "file": "races/elf/assets/hero-neutral-idle.png",
      "durationMs": 160,
      "alphaBBox": [
        67,
        95,
        124,
        176
      ],
      "solidBBox": [
        67,
        95,
        124,
        176
      ]
    },
    {
      "id": "strike",
      "file": "races/elf/assets/hero-neutral-strike.png",
      "durationMs": 160,
      "alphaBBox": [
        54,
        103,
        138,
        176
      ],
      "solidBBox": [
        54,
        103,
        138,
        176
      ]
    },
    {
      "id": "hurt",
      "file": "races/elf/assets/hero-neutral-hurt.png",
      "durationMs": 160,
      "alphaBBox": [
        60,
        104,
        132,
        176
      ],
      "solidBBox": [
        60,
        104,
        132,
        176
      ]
    },
    {
      "id": "death",
      "file": "races/elf/assets/hero-neutral-death.png",
      "durationMs": 650,
      "alphaBBox": [
        41,
        151,
        151,
        176
      ],
      "solidBBox": [
        41,
        151,
        151,
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
  "headY": 107,
  "healthBarAnchor": [
    96,
    87
  ]
};
