// Imagegen slender empty-hand Elf lifecycle; 192px canvases and existing anchors preserved.
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
        68,
        95,
        124,
        176
      ],
      "solidBBox": [
        68,
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
        60,
        100,
        132,
        176
      ],
      "solidBBox": [
        60,
        100,
        132,
        176
      ]
    },
    {
      "id": "hurt",
      "file": "races/elf/assets/hero-neutral-hurt.png",
      "durationMs": 160,
      "alphaBBox": [
        59,
        98,
        133,
        176
      ],
      "solidBBox": [
        59,
        98,
        133,
        176
      ]
    },
    {
      "id": "death",
      "file": "races/elf/assets/hero-neutral-death.png",
      "durationMs": 650,
      "alphaBBox": [
        44,
        143,
        148,
        176
      ],
      "solidBBox": [
        44,
        143,
        148,
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
