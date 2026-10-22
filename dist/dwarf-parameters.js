// Approved source copied verbatim numerically; shared calibration originals remain unchanged.
const freeze=x=>{for(const v of Object.values(x))if(v&&typeof v==='object')freeze(v);return Object.freeze(x);};
export const DWARF_PARAMETER_PROVENANCE=freeze({
  "sourceId": "m2-dwarf-a01-a03-final-candidate-20261022",
  "providerSha256": "cd05ed7ad2204862f8978c55489305904b6b3f32c230d4585f474a5dfae126bc",
  "recoveryPatchSha256": "a437b5f647a760c70192bec686a7a3a9c7e106689866257a78423ce96022d419",
  "authorization": "Root approved after independent narrow review",
  "authorizedOn": "2026-10-22",
  "unpatchedMaterialRowsSha256": "ece5872085b772008728fa8500c02e5250f8bd24184e074e4503c71fd130f058"
});
export const PRODUCTION_DWARF_PARAMETERS=freeze({
  "id": "m2-dwarf-a01-a03-final-candidate-20261022",
  "reviewed": true,
  "status": "root-approved-production-2026-10-22",
  "fieldGroupChance": 0.04,
  "clearRewards": {
    "1": {
      "gold": 6,
      "xp": 32,
      "materialRounds": 0,
      "gearChance": 0.35,
      "markChance": 0.02
    },
    "2": {
      "gold": 8,
      "xp": 40,
      "materialRounds": 0,
      "gearChance": 0.35,
      "markChance": 0.02
    },
    "3": {
      "gold": 8,
      "xp": 48,
      "materialRounds": 0,
      "gearChance": 0.35,
      "markChance": 0.02
    }
  },
  "monsters": {
    "dwarf.a01.normal.1": {
      "hp": 600,
      "atk": 3,
      "armor": 12,
      "elementalPower": 2,
      "basicIntervalMs": 2200,
      "rewardGold": 2,
      "rewardXp": 16,
      "elementResistance": {
        "earth": 3,
        "water": 3,
        "fire": 3,
        "wind": 3,
        "light": 3,
        "dark": 3
      }
    },
    "dwarf.a01.normal.2": {
      "hp": 450,
      "atk": 2,
      "armor": 8,
      "elementalPower": 2,
      "basicIntervalMs": 1800,
      "rewardGold": 2,
      "rewardXp": 16,
      "elementResistance": {
        "earth": 12,
        "water": 3,
        "fire": 3,
        "wind": 3,
        "light": 3,
        "dark": 3
      }
    },
    "dwarf.a01.normal.3": {
      "hp": 780,
      "atk": 4,
      "armor": 16,
      "elementalPower": 2,
      "basicIntervalMs": 2800,
      "rewardGold": 2,
      "rewardXp": 16,
      "elementResistance": {
        "earth": 12,
        "water": 3,
        "fire": 3,
        "wind": 3,
        "light": 3,
        "dark": 3
      }
    },
    "dwarf.a01.elite": {
      "hp": 2000,
      "atk": 48,
      "armor": 22,
      "elementalPower": 14,
      "basicIntervalMs": 2200,
      "rewardGold": 10,
      "rewardXp": 55,
      "elementResistance": {
        "earth": 13,
        "water": 3,
        "fire": 3,
        "wind": 3,
        "light": 3,
        "dark": 3
      }
    },
    "dwarf.a02.normal.1": {
      "hp": 1100,
      "atk": 3,
      "armor": 19,
      "elementalPower": 2,
      "basicIntervalMs": 2200,
      "rewardGold": 3,
      "rewardXp": 20,
      "elementResistance": {
        "earth": 15,
        "water": 4,
        "fire": 4,
        "wind": 4,
        "light": 4,
        "dark": 4
      }
    },
    "dwarf.a02.normal.2": {
      "hp": 850,
      "atk": 2,
      "armor": 13,
      "elementalPower": 2,
      "basicIntervalMs": 1800,
      "rewardGold": 3,
      "rewardXp": 20,
      "elementResistance": {
        "earth": 4,
        "water": 4,
        "fire": 4,
        "wind": 15,
        "light": 4,
        "dark": 4
      }
    },
    "dwarf.a02.normal.3": {
      "hp": 1430,
      "atk": 4,
      "armor": 26,
      "elementalPower": 2,
      "basicIntervalMs": 2800,
      "rewardGold": 3,
      "rewardXp": 20,
      "elementResistance": {
        "earth": 15,
        "water": 4,
        "fire": 4,
        "wind": 4,
        "light": 4,
        "dark": 4
      }
    },
    "dwarf.a02.elite": {
      "hp": 4200,
      "atk": 80,
      "armor": 32,
      "elementalPower": 22,
      "basicIntervalMs": 2200,
      "rewardGold": 12,
      "rewardXp": 66,
      "elementResistance": {
        "earth": 16,
        "water": 4,
        "fire": 4,
        "wind": 4,
        "light": 4,
        "dark": 4
      }
    },
    "dwarf.a03.normal.1": {
      "hp": 1800,
      "atk": 5,
      "armor": 26,
      "elementalPower": 3,
      "basicIntervalMs": 2200,
      "rewardGold": 3,
      "rewardXp": 24,
      "elementResistance": {
        "earth": 5,
        "water": 5,
        "fire": 5,
        "wind": 5,
        "light": 5,
        "dark": 18
      }
    },
    "dwarf.a03.normal.2": {
      "hp": 1440,
      "atk": 4,
      "armor": 18,
      "elementalPower": 3,
      "basicIntervalMs": 1800,
      "rewardGold": 3,
      "rewardXp": 24,
      "elementResistance": {
        "earth": 18,
        "water": 5,
        "fire": 5,
        "wind": 5,
        "light": 5,
        "dark": 5
      }
    },
    "dwarf.a03.normal.3": {
      "hp": 2340,
      "atk": 6,
      "armor": 36,
      "elementalPower": 3,
      "basicIntervalMs": 2800,
      "rewardGold": 3,
      "rewardXp": 24,
      "elementResistance": {
        "earth": 18,
        "water": 5,
        "fire": 5,
        "wind": 5,
        "light": 18,
        "dark": 5
      }
    },
    "dwarf.a03.elite": {
      "hp": 7200,
      "atk": 110,
      "armor": 42,
      "elementalPower": 32,
      "basicIntervalMs": 2200,
      "rewardGold": 14,
      "rewardXp": 79,
      "elementResistance": {
        "earth": 19,
        "water": 6,
        "fire": 6,
        "wind": 6,
        "light": 6,
        "dark": 19
      }
    },
    "dwarf.a03.boss": {
      "hp": 15000,
      "atk": 110,
      "armor": 48,
      "elementalPower": 45,
      "basicIntervalMs": 2200,
      "rewardGold": 45,
      "rewardXp": 312,
      "elementResistance": {
        "earth": 19,
        "water": 6,
        "fire": 6,
        "wind": 6,
        "light": 6,
        "dark": 19
      }
    }
  },
  "skillOverrides": {
    "dwarf.a02.elite:0": {
      "castMs": 1100
    },
    "dwarf.a03.elite:0": {
      "castMs": 1600
    },
    "dwarf.a03.boss:0": {
      "castMs": 2200
    },
    "dwarf.a03.boss:1": {
      "castMs": 1600
    }
  },
  "controlReduction": {
    "normal": 0,
    "elite": 0.2,
    "boss": 0.4
  },
  "interruptStopMs": 1100
});
