import {buildMaterialPools} from '../../material-loot-profile.js';
import {materials} from './materials.js';
import {monsters} from './monsters.js';

// Creature eligibility and relative weights only. Probability, quantity and quality
// are the shared established area/node/rank policy; innate bonus is separate.
export const materialAssociations = {
  "goblin.a01.normal.1|goblin.a01.field": {
    "monsterId": "goblin.a01.normal.1",
    "nodeId": "goblin.a01.field",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "goblin.mat.01",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.02",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "goblin.mat.01",
            "weight": 1
          }
        ]
      },
      {
        "channel": "special",
        "entries": []
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "goblin.infinity_gem_goblin",
            "weight": 1
          }
        ]
      }
    ]
  },
  "goblin.a01.normal.1|goblin.a01.dungeon": {
    "monsterId": "goblin.a01.normal.1",
    "nodeId": "goblin.a01.dungeon",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "goblin.mat.01",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.02",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "goblin.mat.01",
            "weight": 1
          }
        ]
      },
      {
        "channel": "special",
        "entries": []
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "goblin.infinity_gem_goblin",
            "weight": 1
          }
        ]
      }
    ]
  },
  "goblin.a01.normal.2|goblin.a01.field": {
    "monsterId": "goblin.a01.normal.2",
    "nodeId": "goblin.a01.field",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "goblin.mat.02",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.03",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "goblin.mat.01",
            "weight": 1
          }
        ]
      },
      {
        "channel": "special",
        "entries": []
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "goblin.infinity_gem_goblin",
            "weight": 1
          }
        ]
      }
    ]
  },
  "goblin.a01.normal.2|goblin.a01.dungeon": {
    "monsterId": "goblin.a01.normal.2",
    "nodeId": "goblin.a01.dungeon",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "goblin.mat.02",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.03",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "goblin.mat.01",
            "weight": 1
          }
        ]
      },
      {
        "channel": "special",
        "entries": []
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "goblin.infinity_gem_goblin",
            "weight": 1
          }
        ]
      }
    ]
  },
  "goblin.a01.normal.3|goblin.a01.field": {
    "monsterId": "goblin.a01.normal.3",
    "nodeId": "goblin.a01.field",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "goblin.mat.03",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.01",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "goblin.mat.01",
            "weight": 1
          }
        ]
      },
      {
        "channel": "special",
        "entries": []
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "goblin.infinity_gem_goblin",
            "weight": 1
          }
        ]
      }
    ]
  },
  "goblin.a01.normal.3|goblin.a01.dungeon": {
    "monsterId": "goblin.a01.normal.3",
    "nodeId": "goblin.a01.dungeon",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "goblin.mat.03",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.01",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "goblin.mat.01",
            "weight": 1
          }
        ]
      },
      {
        "channel": "special",
        "entries": []
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "goblin.infinity_gem_goblin",
            "weight": 1
          }
        ]
      }
    ]
  },
  "goblin.a01.elite|goblin.a01.dungeon": {
    "monsterId": "goblin.a01.elite",
    "nodeId": "goblin.a01.dungeon",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "goblin.mat.01",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.02",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "goblin.mat.01",
            "weight": 1
          }
        ]
      },
      {
        "channel": "special",
        "entries": []
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "goblin.infinity_gem_goblin",
            "weight": 1
          }
        ]
      }
    ]
  },
  "goblin.a02.normal.1|goblin.a02.field": {
    "monsterId": "goblin.a02.normal.1",
    "nodeId": "goblin.a02.field",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "goblin.mat.02",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.04",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "goblin.mat.01",
            "weight": 1
          }
        ]
      },
      {
        "channel": "special",
        "entries": []
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "goblin.infinity_gem_goblin",
            "weight": 1
          }
        ]
      }
    ]
  },
  "goblin.a02.normal.1|goblin.a02.dungeon": {
    "monsterId": "goblin.a02.normal.1",
    "nodeId": "goblin.a02.dungeon",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "goblin.mat.02",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.04",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "goblin.mat.01",
            "weight": 1
          }
        ]
      },
      {
        "channel": "special",
        "entries": []
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "goblin.infinity_gem_goblin",
            "weight": 1
          }
        ]
      }
    ]
  },
  "goblin.a02.normal.2|goblin.a02.field": {
    "monsterId": "goblin.a02.normal.2",
    "nodeId": "goblin.a02.field",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "goblin.mat.04",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.01",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "goblin.mat.01",
            "weight": 1
          }
        ]
      },
      {
        "channel": "special",
        "entries": []
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "goblin.infinity_gem_goblin",
            "weight": 1
          }
        ]
      }
    ]
  },
  "goblin.a02.normal.2|goblin.a02.dungeon": {
    "monsterId": "goblin.a02.normal.2",
    "nodeId": "goblin.a02.dungeon",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "goblin.mat.04",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.01",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "goblin.mat.01",
            "weight": 1
          }
        ]
      },
      {
        "channel": "special",
        "entries": []
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "goblin.infinity_gem_goblin",
            "weight": 1
          }
        ]
      }
    ]
  },
  "goblin.a02.normal.3|goblin.a02.field": {
    "monsterId": "goblin.a02.normal.3",
    "nodeId": "goblin.a02.field",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "goblin.mat.01",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.02",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "goblin.mat.01",
            "weight": 1
          }
        ]
      },
      {
        "channel": "special",
        "entries": []
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "goblin.infinity_gem_goblin",
            "weight": 1
          }
        ]
      }
    ]
  },
  "goblin.a02.normal.3|goblin.a02.dungeon": {
    "monsterId": "goblin.a02.normal.3",
    "nodeId": "goblin.a02.dungeon",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "goblin.mat.01",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.02",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "goblin.mat.01",
            "weight": 1
          }
        ]
      },
      {
        "channel": "special",
        "entries": []
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "goblin.infinity_gem_goblin",
            "weight": 1
          }
        ]
      }
    ]
  },
  "goblin.a02.elite|goblin.a02.dungeon": {
    "monsterId": "goblin.a02.elite",
    "nodeId": "goblin.a02.dungeon",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "goblin.mat.02",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.04",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "goblin.mat.01",
            "weight": 1
          }
        ]
      },
      {
        "channel": "special",
        "entries": []
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "goblin.infinity_gem_goblin",
            "weight": 1
          }
        ]
      }
    ]
  },
  "goblin.a03.normal.1|goblin.a03.field": {
    "monsterId": "goblin.a03.normal.1",
    "nodeId": "goblin.a03.field",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "goblin.mat.05",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.01",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "goblin.mat.01",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.05",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "goblin.mat.13",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "goblin.infinity_gem_goblin",
            "weight": 1
          }
        ]
      }
    ]
  },
  "goblin.a03.normal.1|goblin.a03.dungeon": {
    "monsterId": "goblin.a03.normal.1",
    "nodeId": "goblin.a03.dungeon",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "goblin.mat.05",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.01",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "goblin.mat.01",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.05",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "goblin.mat.13",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "goblin.infinity_gem_goblin",
            "weight": 1
          }
        ]
      }
    ]
  },
  "goblin.a03.normal.2|goblin.a03.field": {
    "monsterId": "goblin.a03.normal.2",
    "nodeId": "goblin.a03.field",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "goblin.mat.01",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.03",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "goblin.mat.01",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.05",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "goblin.mat.13",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "goblin.infinity_gem_goblin",
            "weight": 1
          }
        ]
      }
    ]
  },
  "goblin.a03.normal.2|goblin.a03.dungeon": {
    "monsterId": "goblin.a03.normal.2",
    "nodeId": "goblin.a03.dungeon",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "goblin.mat.01",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.03",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "goblin.mat.01",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.05",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "goblin.mat.13",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "goblin.infinity_gem_goblin",
            "weight": 1
          }
        ]
      }
    ]
  },
  "goblin.a03.normal.3|goblin.a03.field": {
    "monsterId": "goblin.a03.normal.3",
    "nodeId": "goblin.a03.field",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "goblin.mat.03",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.04",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "goblin.mat.01",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.05",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "goblin.mat.13",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "goblin.infinity_gem_goblin",
            "weight": 1
          }
        ]
      }
    ]
  },
  "goblin.a03.normal.3|goblin.a03.dungeon": {
    "monsterId": "goblin.a03.normal.3",
    "nodeId": "goblin.a03.dungeon",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "goblin.mat.03",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.04",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "goblin.mat.01",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.05",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "goblin.mat.13",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "goblin.infinity_gem_goblin",
            "weight": 1
          }
        ]
      }
    ]
  },
  "goblin.a03.elite|goblin.a03.dungeon": {
    "monsterId": "goblin.a03.elite",
    "nodeId": "goblin.a03.dungeon",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "goblin.mat.04",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.05",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "goblin.mat.01",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.05",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "goblin.mat.13",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "goblin.infinity_gem_goblin",
            "weight": 1
          }
        ]
      }
    ]
  },
  "goblin.a03.boss|goblin.a03.boss": {
    "monsterId": "goblin.a03.boss",
    "nodeId": "goblin.a03.boss",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "goblin.mat.03",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.04",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "goblin.mat.01",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.05",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "goblin.mat.13",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "goblin.infinity_gem_goblin",
            "weight": 1
          }
        ]
      }
    ]
  },
  "goblin.a04.normal.1|goblin.a04.field": {
    "monsterId": "goblin.a04.normal.1",
    "nodeId": "goblin.a04.field",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "goblin.mat.06",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.07",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "goblin.mat.05",
            "weight": 1
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "goblin.mat.13",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "goblin.infinity_gem_goblin",
            "weight": 1
          }
        ]
      }
    ]
  },
  "goblin.a04.normal.1|goblin.a04.dungeon": {
    "monsterId": "goblin.a04.normal.1",
    "nodeId": "goblin.a04.dungeon",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "goblin.mat.06",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.07",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "goblin.mat.05",
            "weight": 1
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "goblin.mat.13",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "goblin.infinity_gem_goblin",
            "weight": 1
          }
        ]
      }
    ]
  },
  "goblin.a04.normal.2|goblin.a04.field": {
    "monsterId": "goblin.a04.normal.2",
    "nodeId": "goblin.a04.field",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "goblin.mat.07",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.02",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "goblin.mat.05",
            "weight": 1
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "goblin.mat.13",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "goblin.infinity_gem_goblin",
            "weight": 1
          }
        ]
      }
    ]
  },
  "goblin.a04.normal.2|goblin.a04.dungeon": {
    "monsterId": "goblin.a04.normal.2",
    "nodeId": "goblin.a04.dungeon",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "goblin.mat.07",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.02",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "goblin.mat.05",
            "weight": 1
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "goblin.mat.13",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "goblin.infinity_gem_goblin",
            "weight": 1
          }
        ]
      }
    ]
  },
  "goblin.a04.normal.3|goblin.a04.field": {
    "monsterId": "goblin.a04.normal.3",
    "nodeId": "goblin.a04.field",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "goblin.mat.02",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.03",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "goblin.mat.05",
            "weight": 1
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "goblin.mat.13",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "goblin.infinity_gem_goblin",
            "weight": 1
          }
        ]
      }
    ]
  },
  "goblin.a04.normal.3|goblin.a04.dungeon": {
    "monsterId": "goblin.a04.normal.3",
    "nodeId": "goblin.a04.dungeon",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "goblin.mat.02",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.03",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "goblin.mat.05",
            "weight": 1
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "goblin.mat.13",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "goblin.infinity_gem_goblin",
            "weight": 1
          }
        ]
      }
    ]
  },
  "goblin.a04.elite|goblin.a04.dungeon": {
    "monsterId": "goblin.a04.elite",
    "nodeId": "goblin.a04.dungeon",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "goblin.mat.02",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.03",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "goblin.mat.05",
            "weight": 1
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "goblin.mat.13",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "goblin.infinity_gem_goblin",
            "weight": 1
          }
        ]
      }
    ]
  },
  "goblin.a05.normal.1|goblin.a05.field": {
    "monsterId": "goblin.a05.normal.1",
    "nodeId": "goblin.a05.field",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "goblin.mat.05",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.06",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "goblin.mat.05",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.08",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "goblin.mat.14",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "goblin.infinity_gem_goblin",
            "weight": 1
          }
        ]
      }
    ]
  },
  "goblin.a05.normal.1|goblin.a05.dungeon": {
    "monsterId": "goblin.a05.normal.1",
    "nodeId": "goblin.a05.dungeon",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "goblin.mat.05",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.06",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "goblin.mat.05",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.08",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "goblin.mat.14",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "goblin.infinity_gem_goblin",
            "weight": 1
          }
        ]
      }
    ]
  },
  "goblin.a05.normal.2|goblin.a05.field": {
    "monsterId": "goblin.a05.normal.2",
    "nodeId": "goblin.a05.field",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "goblin.mat.06",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.08",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "goblin.mat.05",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.08",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "goblin.mat.14",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "goblin.infinity_gem_goblin",
            "weight": 1
          }
        ]
      }
    ]
  },
  "goblin.a05.normal.2|goblin.a05.dungeon": {
    "monsterId": "goblin.a05.normal.2",
    "nodeId": "goblin.a05.dungeon",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "goblin.mat.06",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.08",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "goblin.mat.05",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.08",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "goblin.mat.14",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "goblin.infinity_gem_goblin",
            "weight": 1
          }
        ]
      }
    ]
  },
  "goblin.a05.normal.3|goblin.a05.field": {
    "monsterId": "goblin.a05.normal.3",
    "nodeId": "goblin.a05.field",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "goblin.mat.08",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.04",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "goblin.mat.05",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.08",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "goblin.mat.14",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "goblin.infinity_gem_goblin",
            "weight": 1
          }
        ]
      }
    ]
  },
  "goblin.a05.normal.3|goblin.a05.dungeon": {
    "monsterId": "goblin.a05.normal.3",
    "nodeId": "goblin.a05.dungeon",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "goblin.mat.08",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.04",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "goblin.mat.05",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.08",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "goblin.mat.14",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "goblin.infinity_gem_goblin",
            "weight": 1
          }
        ]
      }
    ]
  },
  "goblin.a05.elite|goblin.a05.dungeon": {
    "monsterId": "goblin.a05.elite",
    "nodeId": "goblin.a05.dungeon",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "goblin.mat.04",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.05",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "goblin.mat.05",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.08",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "goblin.mat.14",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "goblin.infinity_gem_goblin",
            "weight": 1
          }
        ]
      }
    ]
  },
  "goblin.a06.normal.1|goblin.a06.field": {
    "monsterId": "goblin.a06.normal.1",
    "nodeId": "goblin.a06.field",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "goblin.mat.08",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.09",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "goblin.mat.08",
            "weight": 1
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "goblin.mat.14",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "goblin.infinity_gem_goblin",
            "weight": 1
          }
        ]
      }
    ]
  },
  "goblin.a06.normal.1|goblin.a06.dungeon": {
    "monsterId": "goblin.a06.normal.1",
    "nodeId": "goblin.a06.dungeon",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "goblin.mat.08",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.09",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "goblin.mat.08",
            "weight": 1
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "goblin.mat.14",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "goblin.infinity_gem_goblin",
            "weight": 1
          }
        ]
      }
    ]
  },
  "goblin.a06.normal.2|goblin.a06.field": {
    "monsterId": "goblin.a06.normal.2",
    "nodeId": "goblin.a06.field",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "goblin.mat.09",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.06",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "goblin.mat.08",
            "weight": 1
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "goblin.mat.14",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "goblin.infinity_gem_goblin",
            "weight": 1
          }
        ]
      }
    ]
  },
  "goblin.a06.normal.2|goblin.a06.dungeon": {
    "monsterId": "goblin.a06.normal.2",
    "nodeId": "goblin.a06.dungeon",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "goblin.mat.09",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.06",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "goblin.mat.08",
            "weight": 1
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "goblin.mat.14",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "goblin.infinity_gem_goblin",
            "weight": 1
          }
        ]
      }
    ]
  },
  "goblin.a06.normal.3|goblin.a06.field": {
    "monsterId": "goblin.a06.normal.3",
    "nodeId": "goblin.a06.field",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "goblin.mat.06",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.07",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "goblin.mat.08",
            "weight": 1
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "goblin.mat.14",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "goblin.infinity_gem_goblin",
            "weight": 1
          }
        ]
      }
    ]
  },
  "goblin.a06.normal.3|goblin.a06.dungeon": {
    "monsterId": "goblin.a06.normal.3",
    "nodeId": "goblin.a06.dungeon",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "goblin.mat.06",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.07",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "goblin.mat.08",
            "weight": 1
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "goblin.mat.14",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "goblin.infinity_gem_goblin",
            "weight": 1
          }
        ]
      }
    ]
  },
  "goblin.a06.elite|goblin.a06.dungeon": {
    "monsterId": "goblin.a06.elite",
    "nodeId": "goblin.a06.dungeon",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "goblin.mat.07",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.08",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "goblin.mat.08",
            "weight": 1
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "goblin.mat.14",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "goblin.infinity_gem_goblin",
            "weight": 1
          }
        ]
      }
    ]
  },
  "goblin.a06.boss|goblin.a06.boss": {
    "monsterId": "goblin.a06.boss",
    "nodeId": "goblin.a06.boss",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "goblin.mat.07",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.08",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "goblin.mat.08",
            "weight": 1
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "goblin.mat.14",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "goblin.infinity_gem_goblin",
            "weight": 1
          }
        ]
      }
    ]
  },
  "goblin.a07.normal.1|goblin.a07.field": {
    "monsterId": "goblin.a07.normal.1",
    "nodeId": "goblin.a07.field",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "goblin.mat.07",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.09",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "goblin.mat.10",
            "weight": 1
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "goblin.mat.15",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "goblin.infinity_gem_goblin",
            "weight": 1
          }
        ]
      }
    ]
  },
  "goblin.a07.normal.1|goblin.a07.dungeon": {
    "monsterId": "goblin.a07.normal.1",
    "nodeId": "goblin.a07.dungeon",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "goblin.mat.07",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.09",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "goblin.mat.10",
            "weight": 1
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "goblin.mat.15",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "goblin.infinity_gem_goblin",
            "weight": 1
          }
        ]
      }
    ]
  },
  "goblin.a07.normal.2|goblin.a07.field": {
    "monsterId": "goblin.a07.normal.2",
    "nodeId": "goblin.a07.field",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "goblin.mat.09",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.10",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "goblin.mat.10",
            "weight": 1
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "goblin.mat.15",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "goblin.infinity_gem_goblin",
            "weight": 1
          }
        ]
      }
    ]
  },
  "goblin.a07.normal.2|goblin.a07.dungeon": {
    "monsterId": "goblin.a07.normal.2",
    "nodeId": "goblin.a07.dungeon",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "goblin.mat.09",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.10",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "goblin.mat.10",
            "weight": 1
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "goblin.mat.15",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "goblin.infinity_gem_goblin",
            "weight": 1
          }
        ]
      }
    ]
  },
  "goblin.a07.normal.3|goblin.a07.field": {
    "monsterId": "goblin.a07.normal.3",
    "nodeId": "goblin.a07.field",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "goblin.mat.10",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.07",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "goblin.mat.10",
            "weight": 1
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "goblin.mat.15",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "goblin.infinity_gem_goblin",
            "weight": 1
          }
        ]
      }
    ]
  },
  "goblin.a07.normal.3|goblin.a07.dungeon": {
    "monsterId": "goblin.a07.normal.3",
    "nodeId": "goblin.a07.dungeon",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "goblin.mat.10",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.07",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "goblin.mat.10",
            "weight": 1
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "goblin.mat.15",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "goblin.infinity_gem_goblin",
            "weight": 1
          }
        ]
      }
    ]
  },
  "goblin.a07.elite|goblin.a07.dungeon": {
    "monsterId": "goblin.a07.elite",
    "nodeId": "goblin.a07.dungeon",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "goblin.mat.07",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.09",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "goblin.mat.10",
            "weight": 1
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "goblin.mat.15",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "goblin.infinity_gem_goblin",
            "weight": 1
          }
        ]
      }
    ]
  },
  "goblin.a08.normal.1|goblin.a08.field": {
    "monsterId": "goblin.a08.normal.1",
    "nodeId": "goblin.a08.field",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "goblin.mat.08",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.10",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "goblin.mat.08",
            "weight": 0.3333333333333333
          },
          {
            "materialId": "goblin.mat.10",
            "weight": 0.3333333333333333
          },
          {
            "materialId": "goblin.mat.12",
            "weight": 0.3333333333333333
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "goblin.mat.16",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "goblin.infinity_gem_goblin",
            "weight": 1
          }
        ]
      }
    ]
  },
  "goblin.a08.normal.1|goblin.a08.dungeon": {
    "monsterId": "goblin.a08.normal.1",
    "nodeId": "goblin.a08.dungeon",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "goblin.mat.08",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.10",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "goblin.mat.08",
            "weight": 0.3333333333333333
          },
          {
            "materialId": "goblin.mat.10",
            "weight": 0.3333333333333333
          },
          {
            "materialId": "goblin.mat.12",
            "weight": 0.3333333333333333
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "goblin.mat.16",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "goblin.infinity_gem_goblin",
            "weight": 1
          }
        ]
      }
    ]
  },
  "goblin.a08.normal.2|goblin.a08.field": {
    "monsterId": "goblin.a08.normal.2",
    "nodeId": "goblin.a08.field",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "goblin.mat.10",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.11",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "goblin.mat.08",
            "weight": 0.3333333333333333
          },
          {
            "materialId": "goblin.mat.10",
            "weight": 0.3333333333333333
          },
          {
            "materialId": "goblin.mat.12",
            "weight": 0.3333333333333333
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "goblin.mat.16",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "goblin.infinity_gem_goblin",
            "weight": 1
          }
        ]
      }
    ]
  },
  "goblin.a08.normal.2|goblin.a08.dungeon": {
    "monsterId": "goblin.a08.normal.2",
    "nodeId": "goblin.a08.dungeon",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "goblin.mat.10",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.11",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "goblin.mat.08",
            "weight": 0.3333333333333333
          },
          {
            "materialId": "goblin.mat.10",
            "weight": 0.3333333333333333
          },
          {
            "materialId": "goblin.mat.12",
            "weight": 0.3333333333333333
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "goblin.mat.16",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "goblin.infinity_gem_goblin",
            "weight": 1
          }
        ]
      }
    ]
  },
  "goblin.a08.normal.3|goblin.a08.field": {
    "monsterId": "goblin.a08.normal.3",
    "nodeId": "goblin.a08.field",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "goblin.mat.11",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.12",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "goblin.mat.08",
            "weight": 0.3333333333333333
          },
          {
            "materialId": "goblin.mat.10",
            "weight": 0.3333333333333333
          },
          {
            "materialId": "goblin.mat.12",
            "weight": 0.3333333333333333
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "goblin.mat.16",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "goblin.infinity_gem_goblin",
            "weight": 1
          }
        ]
      }
    ]
  },
  "goblin.a08.normal.3|goblin.a08.dungeon": {
    "monsterId": "goblin.a08.normal.3",
    "nodeId": "goblin.a08.dungeon",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "goblin.mat.11",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.12",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "goblin.mat.08",
            "weight": 0.3333333333333333
          },
          {
            "materialId": "goblin.mat.10",
            "weight": 0.3333333333333333
          },
          {
            "materialId": "goblin.mat.12",
            "weight": 0.3333333333333333
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "goblin.mat.16",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "goblin.infinity_gem_goblin",
            "weight": 1
          }
        ]
      }
    ]
  },
  "goblin.a08.elite|goblin.a08.dungeon": {
    "monsterId": "goblin.a08.elite",
    "nodeId": "goblin.a08.dungeon",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "goblin.mat.12",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.08",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "goblin.mat.08",
            "weight": 0.3333333333333333
          },
          {
            "materialId": "goblin.mat.10",
            "weight": 0.3333333333333333
          },
          {
            "materialId": "goblin.mat.12",
            "weight": 0.3333333333333333
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "goblin.mat.16",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "goblin.infinity_gem_goblin",
            "weight": 1
          }
        ]
      }
    ]
  },
  "goblin.a09.normal.1|goblin.a09.field": {
    "monsterId": "goblin.a09.normal.1",
    "nodeId": "goblin.a09.field",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "goblin.mat.10",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.11",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "goblin.mat.10",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.12",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "goblin.mat.15",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "goblin.infinity_gem_goblin",
            "weight": 1
          }
        ]
      }
    ]
  },
  "goblin.a09.normal.1|goblin.a09.dungeon": {
    "monsterId": "goblin.a09.normal.1",
    "nodeId": "goblin.a09.dungeon",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "goblin.mat.10",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.11",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "goblin.mat.10",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.12",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "goblin.mat.15",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "goblin.infinity_gem_goblin",
            "weight": 1
          }
        ]
      }
    ]
  },
  "goblin.a09.normal.2|goblin.a09.field": {
    "monsterId": "goblin.a09.normal.2",
    "nodeId": "goblin.a09.field",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "goblin.mat.11",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.12",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "goblin.mat.10",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.12",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "goblin.mat.15",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "goblin.infinity_gem_goblin",
            "weight": 1
          }
        ]
      }
    ]
  },
  "goblin.a09.normal.2|goblin.a09.dungeon": {
    "monsterId": "goblin.a09.normal.2",
    "nodeId": "goblin.a09.dungeon",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "goblin.mat.11",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.12",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "goblin.mat.10",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.12",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "goblin.mat.15",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "goblin.infinity_gem_goblin",
            "weight": 1
          }
        ]
      }
    ]
  },
  "goblin.a09.normal.3|goblin.a09.field": {
    "monsterId": "goblin.a09.normal.3",
    "nodeId": "goblin.a09.field",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "goblin.mat.12",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.09",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "goblin.mat.10",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.12",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "goblin.mat.15",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "goblin.infinity_gem_goblin",
            "weight": 1
          }
        ]
      }
    ]
  },
  "goblin.a09.normal.3|goblin.a09.dungeon": {
    "monsterId": "goblin.a09.normal.3",
    "nodeId": "goblin.a09.dungeon",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "goblin.mat.12",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.09",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "goblin.mat.10",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.12",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "goblin.mat.15",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "goblin.infinity_gem_goblin",
            "weight": 1
          }
        ]
      }
    ]
  },
  "goblin.a09.elite|goblin.a09.dungeon": {
    "monsterId": "goblin.a09.elite",
    "nodeId": "goblin.a09.dungeon",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "goblin.mat.09",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.10",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "goblin.mat.10",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.12",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "goblin.mat.15",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "goblin.infinity_gem_goblin",
            "weight": 1
          }
        ]
      }
    ]
  },
  "goblin.a09.boss|goblin.a09.boss": {
    "monsterId": "goblin.a09.boss",
    "nodeId": "goblin.a09.boss",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "goblin.mat.09",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.10",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "goblin.mat.10",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.12",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "goblin.mat.15",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.16",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "goblin.infinity_gem_goblin",
            "weight": 1
          }
        ]
      }
    ]
  },
  "goblin.a10.normal.1|goblin.a10.field": {
    "monsterId": "goblin.a10.normal.1",
    "nodeId": "goblin.a10.field",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "goblin.mat.11",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.12",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "goblin.mat.12",
            "weight": 1
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "goblin.mat.16",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "goblin.infinity_gem_goblin",
            "weight": 1
          }
        ]
      }
    ]
  },
  "goblin.a10.normal.1|goblin.a10.dungeon": {
    "monsterId": "goblin.a10.normal.1",
    "nodeId": "goblin.a10.dungeon",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "goblin.mat.11",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.12",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "goblin.mat.12",
            "weight": 1
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "goblin.mat.16",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "goblin.infinity_gem_goblin",
            "weight": 1
          }
        ]
      }
    ]
  },
  "goblin.a10.normal.2|goblin.a10.field": {
    "monsterId": "goblin.a10.normal.2",
    "nodeId": "goblin.a10.field",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "goblin.mat.11",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.12",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "goblin.mat.12",
            "weight": 1
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "goblin.mat.16",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "goblin.infinity_gem_goblin",
            "weight": 1
          }
        ]
      }
    ]
  },
  "goblin.a10.normal.2|goblin.a10.dungeon": {
    "monsterId": "goblin.a10.normal.2",
    "nodeId": "goblin.a10.dungeon",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "goblin.mat.11",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.12",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "goblin.mat.12",
            "weight": 1
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "goblin.mat.16",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "goblin.infinity_gem_goblin",
            "weight": 1
          }
        ]
      }
    ]
  },
  "goblin.a10.normal.3|goblin.a10.field": {
    "monsterId": "goblin.a10.normal.3",
    "nodeId": "goblin.a10.field",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "goblin.mat.11",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.12",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "goblin.mat.12",
            "weight": 1
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "goblin.mat.16",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "goblin.infinity_gem_goblin",
            "weight": 1
          }
        ]
      }
    ]
  },
  "goblin.a10.normal.3|goblin.a10.dungeon": {
    "monsterId": "goblin.a10.normal.3",
    "nodeId": "goblin.a10.dungeon",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "goblin.mat.11",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.12",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "goblin.mat.12",
            "weight": 1
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "goblin.mat.16",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "goblin.infinity_gem_goblin",
            "weight": 1
          }
        ]
      }
    ]
  },
  "goblin.a10.elite|goblin.a10.dungeon": {
    "monsterId": "goblin.a10.elite",
    "nodeId": "goblin.a10.dungeon",
    "channels": [
      {
        "channel": "regular",
        "entries": [
          {
            "materialId": "goblin.mat.11",
            "weight": 0.5
          },
          {
            "materialId": "goblin.mat.12",
            "weight": 0.5
          }
        ]
      },
      {
        "channel": "recovery",
        "entries": [
          {
            "materialId": "goblin.mat.12",
            "weight": 1
          }
        ]
      },
      {
        "channel": "special",
        "entries": [
          {
            "materialId": "goblin.mat.16",
            "weight": 1
          }
        ]
      },
      {
        "channel": "gem",
        "entries": [
          {
            "materialId": "goblin.infinity_gem_goblin",
            "weight": 1
          }
        ]
      }
    ]
  }
};
const finalBoss=structuredClone(materialAssociations['goblin.a10.elite|goblin.a10.dungeon']);
finalBoss.monsterId=finalBoss.nodeId='goblin.a10.boss';
materialAssociations['goblin.a10.boss|goblin.a10.boss']=finalBoss;
export const materialPools = buildMaterialPools({materials,monsters,associations:materialAssociations});
