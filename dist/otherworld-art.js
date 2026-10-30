// Original generated art; exact marker-only routing. No world identity overrides.
export const OTHERWORLD_SPRITE_KEY="otherworld-rift-sentinel";
export const OTHERWORLD_SPRITE={
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
      "id": "idle",
      "file": "../otherworld-assets/sentinel-idle.png",
      "durationMs": 180,
      "sourceCrop": [
        0,
        0,
        512,
        512
      ],
      "sourceAnchor": [
        290,
        482
      ],
      "alphaBBox": [
        33,
        78,
        131,
        176
      ],
      "solidBBox": [
        33,
        78,
        131,
        176
      ]
    },
    {
      "id": "anticipation",
      "file": "../otherworld-assets/sentinel-anticipation.png",
      "durationMs": 180,
      "sourceCrop": [
        512,
        0,
        1000,
        512
      ],
      "sourceAnchor": [
        724,
        482
      ],
      "alphaBBox": [
        61,
        82,
        154,
        176
      ],
      "solidBBox": [
        61,
        82,
        154,
        176
      ]
    },
    {
      "id": "attack",
      "file": "../otherworld-assets/sentinel-attack.png",
      "durationMs": 180,
      "sourceCrop": [
        910,
        170,
        1536,
        512
      ],
      "sourceAnchor": [
        1280,
        482
      ],
      "alphaBBox": [
        4,
        98,
        149,
        176
      ],
      "solidBBox": [
        4,
        98,
        149,
        176
      ]
    },
    {
      "id": "recovery",
      "file": "../otherworld-assets/sentinel-recovery.png",
      "durationMs": 180,
      "sourceCrop": [
        0,
        512,
        512,
        1024
      ],
      "sourceAnchor": [
        300,
        943
      ],
      "alphaBBox": [
        29,
        94,
        143,
        176
      ],
      "solidBBox": [
        29,
        94,
        143,
        176
      ]
    },
    {
      "id": "hurt",
      "file": "../otherworld-assets/sentinel-hurt.png",
      "durationMs": 180,
      "sourceCrop": [
        512,
        512,
        1000,
        1024
      ],
      "sourceAnchor": [
        790,
        956
      ],
      "alphaBBox": [
        35,
        83,
        136,
        175
      ],
      "solidBBox": [
        35,
        83,
        136,
        175
      ]
    },
    {
      "id": "death",
      "file": "../otherworld-assets/sentinel-death.png",
      "durationMs": 180,
      "sourceCrop": [
        1000,
        700,
        1536,
        1024
      ],
      "sourceAnchor": [
        1300,
        975
      ],
      "alphaBBox": [
        25,
        132,
        146,
        175
      ],
      "solidBBox": [
        25,
        132,
        146,
        175
      ]
    }
  ],
  "animations": {
    "idle": [
      "idle"
    ],
    "anticipation": [
      "anticipation"
    ],
    "attack": [
      "attack"
    ],
    "recovery": [
      "recovery"
    ],
    "hurt": [
      "hurt"
    ],
    "death": [
      "death"
    ]
  }
};
export const OTHERWORLD_BACKGROUND=Object.freeze({id:"otherworld-rift-arena",file:"../otherworld-assets/rift-arena.png",size:[480,270],baseline:203,z:0});
export function extendOtherworldArt(manifest){manifest.sprites[OTHERWORLD_SPRITE_KEY]=structuredClone(OTHERWORLD_SPRITE);manifest.otherworldSprite=OTHERWORLD_SPRITE_KEY;manifest.otherworldBackground=OTHERWORLD_BACKGROUND;return manifest;}
