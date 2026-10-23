// Derived from the current frozen battle manifest. No copied or regenerated sprites.
export const MONSTER_PIXEL_REGISTRY=Object.freeze({
  "monsters": {
    "dwarf.a01.normal.1": "raider",
    "dwarf.a01.normal.2": "pit-rat",
    "dwarf.a01.normal.3": "golem",
    "dwarf.a01.elite": "shield-captain",
    "dwarf.a02.normal.1": "brown-rock-lizard",
    "dwarf.a02.normal.2": "rift-bat",
    "dwarf.a02.normal.3": "iron-throat-crab",
    "dwarf.a02.elite": "brood-rock-lizard",
    "dwarf.a03.normal.1": "oathless-guard",
    "dwarf.a03.normal.2": "inscription-lizard",
    "dwarf.a03.normal.3": "broken-tablet-idol",
    "dwarf.a03.elite": "tablet-executioner",
    "dwarf.a03.boss": "morl-oathkeeper",
    "dwarf.a04.normal.1": "slag-fire-lizard",
    "dwarf.a04.normal.2": "chimney-ash-bat",
    "dwarf.a04.normal.3": "salt-furnace-shell",
    "dwarf.a04.elite": "bellows-warden",
    "dwarf.a05.normal.1": "spring-moss-beast",
    "dwarf.a05.normal.2": "cold-mist-moth",
    "dwarf.a05.normal.3": "fungus-iron-beetle",
    "dwarf.a05.elite": "pale-spring-drainer",
    "dwarf.a06.normal.1": "cast-slag-soldier",
    "dwarf.a06.normal.2": "pressure-steam-wisp",
    "dwarf.a06.normal.3": "sunken-pot-carrier",
    "dwarf.a06.elite": "four-arm-foreman",
    "dwarf.a06.boss": "broken-furnace-guardian",
    "dwarf.a07.normal.1": "silver-whisker-borer",
    "dwarf.a07.normal.2": "frost-crystal-spider",
    "dwarf.a07.normal.3": "unclaimed-inscription-idol",
    "dwarf.a07.elite": "silver-rebound-idol",
    "dwarf.a08.normal.1": "obsidian-blade-lizard",
    "dwarf.a08.normal.2": "rock-resin-prowler",
    "dwarf.a08.normal.3": "broken-lift-automaton",
    "dwarf.a08.elite": "rift-chain-overseer",
    "dwarf.a09.normal.1": "crystal-marrow-feeder",
    "dwarf.a09.normal.2": "refracting-crystal-moth",
    "dwarf.a09.normal.3": "runebone-scroll-statue",
    "dwarf.a09.elite": "runebone-hidden-blade",
    "dwarf.a09.boss": "hedor-archive-keeper",
    "dwarf.a10.normal.1": "deepforge-cast-guard",
    "dwarf.a10.normal.2": "dark-vein-riftshade",
    "dwarf.a10.normal.3": "rock-resin-greatshell",
    "dwarf.a10.elite": "evercast-prototype",
    "dwarf.a10.boss": "uldor-forge-controller"
  },
  "variants": [
    {
      "match": {
        "definitionId": "dwarf.a02.elite",
        "follower": true
      },
      "spriteKey": "rock-lizard-young",
      "priority": 100,
      "reason": "Production followers retain elite definitionId; name \u8910\u80cc\u5e7c\u8725. Visual-only juvenile derivation from brown-rock-lizard, 65% size."
    },
    {
      "match": {
        "definitionId": "dwarf.a06.elite",
        "follower": true
      },
      "spriteKey": "slag-apprentice",
      "priority": 100,
      "name": "\u94f8\u6e23\u5c0f\u5de5"
    },
    {
      "match": {
        "definitionId": "dwarf.a08.elite",
        "follower": true
      },
      "spriteKey": "rift-drill-beast",
      "priority": 100,
      "reason": "Actual \u88c2\u8c37\u94bb\u517d followers are independent burrowing beasts, not small overseers."
    }
  ],
  "sprites": {
    "bellows-warden": {
      "file": "./battle-assets/sprites/bellows-warden-idle.png",
      "frameId": "idle",
      "frameSize": [
        192,
        192
      ],
      "crop": [
        42,
        107,
        140,
        182
      ]
    },
    "broken-furnace-guardian": {
      "file": "./battle-assets/sprites/broken-furnace-guardian-idle.png",
      "frameId": "idle",
      "frameSize": [
        192,
        192
      ],
      "crop": [
        34,
        92,
        142,
        179
      ]
    },
    "broken-lift-automaton": {
      "file": "./battle-assets/sprites/broken-lift-automaton-idle.png",
      "frameId": "idle",
      "frameSize": [
        192,
        192
      ],
      "crop": [
        50,
        112,
        129,
        182
      ]
    },
    "broken-tablet-idol": {
      "file": "./battle-assets/sprites/broken-tablet-idol-idle.png",
      "frameId": "idle",
      "frameSize": [
        192,
        192
      ],
      "crop": [
        63,
        112,
        126,
        179
      ]
    },
    "brood-rock-lizard": {
      "file": "./battle-assets/sprites/brood-rock-lizard-idle.png",
      "frameId": "idle",
      "frameSize": [
        192,
        192
      ],
      "crop": [
        39,
        84,
        162,
        181
      ]
    },
    "brown-rock-lizard": {
      "file": "./battle-assets/sprites/brown-rock-lizard-idle.png",
      "frameId": "idle",
      "frameSize": [
        192,
        192
      ],
      "crop": [
        51,
        105,
        144,
        190
      ]
    },
    "cast-slag-soldier": {
      "file": "./battle-assets/sprites/cast-slag-soldier-idle.png",
      "frameId": "idle",
      "frameSize": [
        192,
        192
      ],
      "crop": [
        55,
        111,
        127,
        178
      ]
    },
    "chimney-ash-bat": {
      "file": "./battle-assets/sprites/chimney-ash-bat-idle.png",
      "frameId": "idle",
      "frameSize": [
        192,
        192
      ],
      "crop": [
        52,
        92,
        143,
        154
      ]
    },
    "cold-mist-moth": {
      "file": "./battle-assets/sprites/cold-mist-moth-idle.png",
      "frameId": "idle",
      "frameSize": [
        192,
        192
      ],
      "crop": [
        60,
        89,
        135,
        157
      ]
    },
    "crystal-marrow-feeder": {
      "file": "./battle-assets/sprites/crystal-marrow-feeder-idle.png",
      "frameId": "idle",
      "frameSize": [
        192,
        192
      ],
      "crop": [
        52,
        124,
        131,
        181
      ]
    },
    "dark-vein-riftshade": {
      "file": "./battle-assets/sprites/dark-vein-riftshade-idle.png",
      "frameId": "idle",
      "frameSize": [
        192,
        192
      ],
      "crop": [
        54,
        107,
        132,
        180
      ]
    },
    "deepforge-cast-guard": {
      "file": "./battle-assets/sprites/deepforge-cast-guard-idle.png",
      "frameId": "idle",
      "frameSize": [
        192,
        192
      ],
      "crop": [
        40,
        110,
        132,
        179
      ]
    },
    "evercast-prototype": {
      "file": "./battle-assets/sprites/evercast-prototype-idle.png",
      "frameId": "idle",
      "frameSize": [
        192,
        192
      ],
      "crop": [
        49,
        102,
        141,
        179
      ]
    },
    "four-arm-foreman": {
      "file": "./battle-assets/sprites/four-arm-foreman-idle.png",
      "frameId": "idle",
      "frameSize": [
        192,
        192
      ],
      "crop": [
        50,
        101,
        131,
        179
      ]
    },
    "frost-crystal-spider": {
      "file": "./battle-assets/sprites/frost-crystal-spider-idle.png",
      "frameId": "idle",
      "frameSize": [
        192,
        192
      ],
      "crop": [
        54,
        125,
        132,
        181
      ]
    },
    "fungus-iron-beetle": {
      "file": "./battle-assets/sprites/fungus-iron-beetle-idle.png",
      "frameId": "idle",
      "frameSize": [
        192,
        192
      ],
      "crop": [
        48,
        125,
        129,
        180
      ]
    },
    "golem": {
      "file": "./battle-assets/sprites/golem-idle.png",
      "frameId": "idle",
      "frameSize": [
        192,
        192
      ],
      "crop": [
        22,
        76,
        145,
        183
      ]
    },
    "hedor-archive-keeper": {
      "file": "./battle-assets/sprites/hedor-archive-keeper-idle.png",
      "frameId": "idle",
      "frameSize": [
        192,
        192
      ],
      "crop": [
        39,
        94,
        138,
        179
      ]
    },
    "inscription-lizard": {
      "file": "./battle-assets/sprites/inscription-lizard-idle.png",
      "frameId": "idle",
      "frameSize": [
        192,
        192
      ],
      "crop": [
        51,
        130,
        139,
        180
      ]
    },
    "iron-throat-crab": {
      "file": "./battle-assets/sprites/iron-throat-crab-idle.png",
      "frameId": "idle",
      "frameSize": [
        192,
        192
      ],
      "crop": [
        30,
        129,
        133,
        181
      ]
    },
    "morl-oathkeeper": {
      "file": "./battle-assets/sprites/morl-oathkeeper-idle.png",
      "frameId": "idle",
      "frameSize": [
        192,
        192
      ],
      "crop": [
        20,
        104,
        138,
        180
      ]
    },
    "oathless-guard": {
      "file": "./battle-assets/sprites/oathless-guard-idle.png",
      "frameId": "idle",
      "frameSize": [
        192,
        192
      ],
      "crop": [
        44,
        114,
        128,
        181
      ]
    },
    "obsidian-blade-lizard": {
      "file": "./battle-assets/sprites/obsidian-blade-lizard-idle.png",
      "frameId": "idle",
      "frameSize": [
        192,
        192
      ],
      "crop": [
        50,
        136,
        143,
        180
      ]
    },
    "pale-spring-drainer": {
      "file": "./battle-assets/sprites/pale-spring-drainer-idle.png",
      "frameId": "idle",
      "frameSize": [
        192,
        192
      ],
      "crop": [
        35,
        118,
        154,
        181
      ]
    },
    "pit-rat": {
      "file": "./battle-assets/sprites/pit-rat-idle.png",
      "frameId": "idle",
      "frameSize": [
        192,
        192
      ],
      "crop": [
        53,
        103,
        146,
        186
      ]
    },
    "pressure-steam-wisp": {
      "file": "./battle-assets/sprites/pressure-steam-wisp-idle.png",
      "frameId": "idle",
      "frameSize": [
        192,
        192
      ],
      "crop": [
        63,
        96,
        130,
        162
      ]
    },
    "raider": {
      "file": "./battle-assets/sprites/raider-idle.png",
      "frameId": "idle",
      "frameSize": [
        192,
        192
      ],
      "crop": [
        33,
        102,
        130,
        179
      ]
    },
    "refracting-crystal-moth": {
      "file": "./battle-assets/sprites/refracting-crystal-moth-idle.png",
      "frameId": "idle",
      "frameSize": [
        192,
        192
      ],
      "crop": [
        65,
        100,
        130,
        159
      ]
    },
    "rift-bat": {
      "file": "./battle-assets/sprites/rift-bat-idle.png",
      "frameId": "idle",
      "frameSize": [
        192,
        192
      ],
      "crop": [
        55,
        73,
        148,
        168
      ]
    },
    "rift-chain-overseer": {
      "file": "./battle-assets/sprites/rift-chain-overseer-idle.png",
      "frameId": "idle",
      "frameSize": [
        192,
        192
      ],
      "crop": [
        32,
        111,
        135,
        180
      ]
    },
    "rift-drill-beast": {
      "file": "./battle-assets/sprites/rift-drill-beast-idle.png",
      "frameId": "idle",
      "frameSize": [
        192,
        192
      ],
      "crop": [
        62,
        134,
        126,
        179
      ]
    },
    "rock-lizard-young": {
      "file": "./battle-assets/sprites/rock-lizard-young-idle.png",
      "frameId": "idle",
      "frameSize": [
        192,
        192
      ],
      "crop": [
        66,
        127,
        128,
        185
      ]
    },
    "rock-resin-greatshell": {
      "file": "./battle-assets/sprites/rock-resin-greatshell-idle.png",
      "frameId": "idle",
      "frameSize": [
        192,
        192
      ],
      "crop": [
        53,
        115,
        140,
        179
      ]
    },
    "rock-resin-prowler": {
      "file": "./battle-assets/sprites/rock-resin-prowler-idle.png",
      "frameId": "idle",
      "frameSize": [
        192,
        192
      ],
      "crop": [
        49,
        123,
        137,
        180
      ]
    },
    "runebone-hidden-blade": {
      "file": "./battle-assets/sprites/runebone-hidden-blade-idle.png",
      "frameId": "idle",
      "frameSize": [
        192,
        192
      ],
      "crop": [
        65,
        101,
        126,
        179
      ]
    },
    "runebone-scroll-statue": {
      "file": "./battle-assets/sprites/runebone-scroll-statue-idle.png",
      "frameId": "idle",
      "frameSize": [
        192,
        192
      ],
      "crop": [
        61,
        106,
        126,
        179
      ]
    },
    "salt-furnace-shell": {
      "file": "./battle-assets/sprites/salt-furnace-shell-idle.png",
      "frameId": "idle",
      "frameSize": [
        192,
        192
      ],
      "crop": [
        59,
        114,
        134,
        180
      ]
    },
    "shield-captain": {
      "file": "./battle-assets/sprites/shield-captain-idle.png",
      "frameId": "idle",
      "frameSize": [
        192,
        192
      ],
      "crop": [
        42,
        81,
        142,
        192
      ]
    },
    "silver-rebound-idol": {
      "file": "./battle-assets/sprites/silver-rebound-idol-idle.png",
      "frameId": "idle",
      "frameSize": [
        192,
        192
      ],
      "crop": [
        54,
        101,
        128,
        179
      ]
    },
    "silver-whisker-borer": {
      "file": "./battle-assets/sprites/silver-whisker-borer-idle.png",
      "frameId": "idle",
      "frameSize": [
        192,
        192
      ],
      "crop": [
        41,
        121,
        130,
        179
      ]
    },
    "slag-apprentice": {
      "file": "./battle-assets/sprites/slag-apprentice-idle.png",
      "frameId": "idle",
      "frameSize": [
        192,
        192
      ],
      "crop": [
        69,
        133,
        117,
        178
      ]
    },
    "slag-fire-lizard": {
      "file": "./battle-assets/sprites/slag-fire-lizard-idle.png",
      "frameId": "idle",
      "frameSize": [
        192,
        192
      ],
      "crop": [
        48,
        131,
        146,
        181
      ]
    },
    "spring-moss-beast": {
      "file": "./battle-assets/sprites/spring-moss-beast-idle.png",
      "frameId": "idle",
      "frameSize": [
        192,
        192
      ],
      "crop": [
        50,
        122,
        138,
        179
      ]
    },
    "sunken-pot-carrier": {
      "file": "./battle-assets/sprites/sunken-pot-carrier-idle.png",
      "frameId": "idle",
      "frameSize": [
        192,
        192
      ],
      "crop": [
        55,
        99,
        135,
        180
      ]
    },
    "tablet-executioner": {
      "file": "./battle-assets/sprites/tablet-executioner-idle.png",
      "frameId": "idle",
      "frameSize": [
        192,
        192
      ],
      "crop": [
        40,
        101,
        155,
        181
      ]
    },
    "uldor-forge-controller": {
      "file": "./battle-assets/sprites/uldor-forge-controller-idle.png",
      "frameId": "idle",
      "frameSize": [
        192,
        192
      ],
      "crop": [
        29,
        90,
        150,
        183
      ]
    },
    "unclaimed-inscription-idol": {
      "file": "./battle-assets/sprites/unclaimed-inscription-idol-idle.png",
      "frameId": "idle",
      "frameSize": [
        192,
        192
      ],
      "crop": [
        63,
        112,
        123,
        180
      ]
    }
  }
});
