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

## Frozen acceptance evidence

- Final aggregate: **64/64 race gates passed**, including strict all-slot matrix, all five production reward-settlement paths, named-character App DOM flows, and generation-six failure/reload handling.
- All **263 ordinary identities** reached actual generator, fusion and trader paths. All 323 ordinary/set entries rendered without truncation in the tested production consumers; all 335 definition art identities have per-race unique decoded 64px hashes.
- **75 new ordinary identities + 18 existing Elf art corrections = 93 changed art sources**. Eight Goblin/Ashen outputs received whole-image nearest-neighbor fitting inside a transparent 2px border; originals are retained, output hashes reproduce exactly, and root reapproved the native contact.
- Build: **2644 files**, content hash `538452b92bcaac1f089faa5694987d5ce9dc75c7c40c9a7bcd8b2a6567b2d5fd`.
- Strict release-cache verification passed: 2642 resource URLs, 8051 dependency edges, four cache-mutation classes. The exact fourteen QA-only exclusions are unchanged; their total is 10,999,236 bytes. Independent emitted inventory/hash checks passed.
- Source/test evidence: `qa/equipment-parity/audit.json`, `qa/race-expansion-tests/results.json`, `qa/named-heroes/`, and `tests/art/goblin-ashen-parity/padded-contact.png`.
- Native canvas/DOM-shim proofs are not browser-layout screenshots. Browser launch and Sites helper were unavailable in this executor; publication is owned by the parent task. No full `npm test` rerun is claimed.
