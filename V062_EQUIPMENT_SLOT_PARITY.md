# v062 — complete equipment slot parity

Approved scope: append ordinary identities only, correct Elf repeated artwork, and verify every shared slot independently. Existing equipment IDs, names, stat families, rates and quality rules remain unchanged. Equipment append/icon corrections alone require no reset. The separately authorized named-character selection change requires strict generation 6: old development saves are retired, including the exact game-owned v5 key, with no aliases or migration.

## Permanent release contract

| Race | Weapon | Head | Chest | Gloves | Boots | Ring | Amulet | Common ordinary | Extra ordinary core | Set parts | Legends |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Dwarf | 16 | 6 | 6 | 6 | 6 | 6 | 6 | 52 | 0 | 12 | 2 |
| Human | 16 | 6 | 6 | 6 | 6 | 6 | 6 | 52 | 0 | 12 | 2 |
| Elf | 16 | 6 | 6 | 6 | 6 | 6 | 6 | 52 | 0 | 12 | 2 |
| Goblin | 16 | 6 | 6 | 6 | 6 | 6 | 6 | 52 | 0 | 12 | 2 |
| Ashen | 16 | 6 | 6 | 6 | 6 | 6 | 6 | 52 | 3 | 12 | 4 |

Each race has eight weapons in each of its two native families. Each has three sets, with exactly one head/chest/glove/boot per set. The extra Ashen ordinary cores do not count toward common-slot parity. Of the twelve legendary definitions, the existing Ashen primal core remains story-reserved and unobtainable through ordinary random channels.

Total: 260 common ordinary + 3 extra ordinary cores + 60 set parts + 12 legendary definitions = 335. Thus 263 ordinary, not 260, when including cores.

## Named character selection

The same release shows native hero images at the start of a new journey, with canonical names 布洛克 / 罗什福尔 / 莱姆斯 / 奇克 / 砾恩. Role titles remain secondary labels. Generation 6 retires the old development saves once; equipment quantities themselves did not require a reset.

## Reproducible checks

- `npm run audit:equipment`: actual catalog-derived slot matrix and invariant errors; a total alone is insufficient.
- `npm run test:equipment-parity`: matrix, deliberately incorrect slot/family negative controls, existing identity/name/stat hashes, unchanged equipment gameplay-source hashes, actual item/fusion/trader coverage, and real production-renderer coverage.
- `npm run test:races`: existing 56 race gates plus strict equipment, real reward-settlement, worker art/catalog and named-character gates.
- `npm run test:release`: immutable asset/cache graph and unchanged explicit fourteen QA exclusions.

The equipment art gate hashes decoded, nearest-neighbor 64px pixels across every identity within each race, including legends. Reusing the same identity source at 32/48/64 display sizes is valid; sharing artwork across different identities is not. New ordinary source art must be 64×64, nonblank and clear of clipped alpha edges.

Workshop counts and full catalog entries derive from the actual registry. Inventory and forge render the owned family dynamically, including the last item; they are scroll grids, not truncated fixed-count pages. Set/legend codex renders those collections only, not ordinary equipment. Existing per-family bag capacity is unchanged.

Verification status and exact release hash are recorded in the integration report, not implied by this contract. Native contact sheets require root visual approval before release freeze/publication.
