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
      "file": "races/human/assets/hero-neutral-idle.png",
      "durationMs": 160,
      "alphaBBox": [
        59,
        89,
        132,
        176
      ],
      "solidBBox": [
        59,
        89,
        132,
        176
      ]
    },
    {
      "id": "strike",
      "file": "races/human/assets/hero-neutral-strike.png",
      "durationMs": 160,
      "alphaBBox": [
        47,
        92,
        145,
        176
      ],
      "solidBBox": [
        47,
        92,
        145,
        176
      ]
    },
    {
      "id": "hurt",
      "file": "races/human/assets/hero-neutral-hurt.png",
      "durationMs": 160,
      "alphaBBox": [
        55,
        93,
        136,
        176
      ],
      "solidBBox": [
        55,
        93,
        136,
        176
      ]
    },
    {
      "id": "death",
      "file": "races/human/assets/hero-neutral-death.png",
      "durationMs": 650,
      "alphaBBox": [
        39,
        142,
        153,
        176
      ],
      "solidBBox": [
        39,
        142,
        153,
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
  "headY": 101,
  "healthBarAnchor": [
    96,
    81
  ]
};
