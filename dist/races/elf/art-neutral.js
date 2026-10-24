// Imagegen empty-hand neutral lifecycle; native weapon variants are untouched.
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
        125,
        176
      ],
      "solidBBox": [
        67,
        95,
        125,
        176
      ]
    },
    {
      "id": "strike",
      "file": "races/elf/assets/hero-neutral-strike.png",
      "durationMs": 160,
      "alphaBBox": [
        58,
        100,
        133,
        176
      ],
      "solidBBox": [
        58,
        100,
        133,
        176
      ]
    },
    {
      "id": "hurt",
      "file": "races/elf/assets/hero-neutral-hurt.png",
      "durationMs": 160,
      "alphaBBox": [
        59,
        99,
        133,
        176
      ],
      "solidBBox": [
        59,
        99,
        133,
        176
      ]
    },
    {
      "id": "death",
      "file": "races/elf/assets/hero-neutral-death.png",
      "durationMs": 650,
      "alphaBBox": [
        46,
        145,
        146,
        176
      ],
      "solidBBox": [
        46,
        145,
        146,
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
