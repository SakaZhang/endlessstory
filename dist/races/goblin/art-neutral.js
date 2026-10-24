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
  "facing": "left",
  "appearance": "neutral",
  "frames": [
    {
      "id": "idle",
      "file": "races/goblin/assets/hero-neutral-idle.png",
      "durationMs": 160,
      "alphaBBox": [
        47,
        39,
        144,
        176
      ],
      "solidBBox": [
        47,
        39,
        144,
        176
      ]
    },
    {
      "id": "strike",
      "file": "races/goblin/assets/hero-neutral-strike.png",
      "durationMs": 160,
      "alphaBBox": [
        32,
        43,
        159,
        176
      ],
      "solidBBox": [
        32,
        43,
        159,
        176
      ]
    },
    {
      "id": "hurt",
      "file": "races/goblin/assets/hero-neutral-hurt.png",
      "durationMs": 160,
      "alphaBBox": [
        28,
        49,
        163,
        176
      ],
      "solidBBox": [
        28,
        49,
        163,
        176
      ]
    },
    {
      "id": "death",
      "file": "races/goblin/assets/hero-neutral-death.png",
      "durationMs": 650,
      "alphaBBox": [
        21,
        99,
        170,
        176
      ],
      "solidBBox": [
        21,
        99,
        170,
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
    31
  ]
};
