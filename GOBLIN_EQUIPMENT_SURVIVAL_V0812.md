# Goblin equipment survivability — v0.81.2

## Approved change and implementation

Goblin-origin equipment effective **base HP and armor ×0.80**, integer-rounded with existing zero values preserved and positive values at least1. Applies to52 ordinary identities,12 set pieces (all3 sets), and both legends: **66 of337 total catalog identities**. Weapon, head, chest, gloves, boots, ring and amulet families are covered. Catalog `templateId`/`legendaryId`, canonical origin, slot and variant choose the policy; wearer race does not.

`dist/equipment-base-balance.js` is the single authored runtime policy, consumed by `enhancedItemBase`, formal enhancement quotes, App equipment detail and developer workshop base preview. There is no separately generated data copy to synchronize. Existing race source/catalog data and its generation paths are unchanged.

Order: immutable level/quality-derived raw budget → effective racial +0 base → existing enhancement → existing divine multiplier. Attack, all ordinary affixes, special/legend/set effects, enhancement price/chance, equipment identities and provenance stay unchanged. The raw M2 budget remains strictly validated; no save migration, new compatibility schema, inventory rewrite or forgiving validator is added. Existing owned gear and newly dropped/forged/purchased gear get the same effective base. Existing `normalizeHealth` caps previously full health to the lower maximum without invalidating the save.

Level growth remains the same1.025-per-level M2 formula and original quality/slot allocations (including the existing100-level budget cap); the20% factor does not flatten it. Same Goblin equipment gives identical contributions to every wearer race. Goblin characters wearing other-origin equipment do **not** receive this penalty.

Poison source files, all poison timings/damage and approved cooldowns remain byte-identical:2s /3% per layer /5 cap /12s all-Goblin-layer refresh. No skill or set-offense changes. Naked first-dungeon baseline is unaffected.

## Calibration

Runner: `goblin-equipment-v0812-audit.mjs`. Local evidence: `qa/goblin-equipment-v0812/{before,candidate-15,after-20,comparison}.json`.

12 lawful loadouts: level20/60/100, eight ordinary Q2 slots or four Q3 pieces of each Goblin set plus four Q2 slots.13-point prerequisite-complete poison/heal skills, no talents/passives/specials/enhancement/divine/potions.10 paired combat seeds against real same-level Human fields, dungeon **first stages**, and bosses. Area2 has no boss, so Lv20 boss is omitted rather than replaced with an invented target.320 actual encounters per candidate;960 across baseline/15%/20%, plus naked Lv1 controls. Every fight starts at full health. Inventory hashes match across candidates.

15% base reduction produced14.5–21.5% physical-EHP reduction;20% produced19.2–27.9%.20% was selected because it gives measurable extra incoming damage without breaking these encounters. It is **not20% off total character stats**: full-character HP falls10.7–15.9%; armor14.4–17.1%.

Physical EHP = `HP × (1 + armor/100)` from the actual physical mitigation formula, before rounding individual hits. It excludes dodge, shields, elemental mitigation and healing.

| Level | Gear profile | Character HP before → after | Armor before → after | Physical EHP before → after | EHP decrease |
|---:|---|---:|---:|---:|---:|
| 20 | Ordinary Q2 | 1132 → 991 | 121 → 102 | 2502 → 2002 | 20.0% |
| 20 | 苦菌行者4pc | 1245 → 1087 | 100 → 85 | 2490 → 2011 | 19.2% |
| 20 | 余粮斥候4pc | 1272 → 1108 | 114 → 96 | 2722 → 2172 | 20.2% |
| 20 | 旧索匠4pc | 979 → 874 | 146 → 122 | 2408 → 1940 | 19.4% |
| 60 | Ordinary Q2 | 3298 → 2895 | 289 → 245 | 12829 → 9988 | 22.1% |
| 60 | 苦菌行者4pc | 3245 → 2808 | 292 → 250 | 12720 → 9828 | 22.7% |
| 60 | 余粮斥候4pc | 3210 → 2780 | 329 → 280 | 13771 → 10564 | 23.3% |
| 60 | 旧索匠4pc | 2583 → 2277 | 475 → 396 | 14852 → 11294 | 24.0% |
| 100 | Ordinary Q2 | 6780 → 5771 | 631 → 533 | 49562 → 36530 | 26.3% |
| 100 | 苦菌行者4pc | 7247 → 6102 | 600 → 510 | 50729 → 37222 | 26.6% |
| 100 | 余粮斥候4pc | 7384 → 6212 | 696 → 587 | 58777 → 42676 | 27.4% |
| 100 | 旧索匠4pc | 5563 → 4755 | 1068 → 885 | 64976 → 46837 | 27.9% |

All320/320 encounters win at both baseline and20%; all32 aggregate fight-time and ATK rows are identical. At Lv100, ordinary-Q2 boss mean incoming HP damage rises819.3→1008.3, end-health fraction91.9%→88.2%; poison-set boss incoming966.3→1109.0, end-health90.7%→87.2%. At Lv20 ordinary dungeon first stage, incoming45.0→48.9, end-health97.5%→96.8%.

Actual poison HP-loss sums are identical in30/32 rows. The two Lv60 boss/set rows increase by0.66 and0.62 mean damage (<0.011%); captured enemy-healing increases by exactly the same amounts. Lower player armor allows slightly more enemy lifesteal, hence slightly more enemy HP must be removed. Poison formula/timing/offense is unchanged; do not claim every post-mitigation outcome is numerically identical.

The single-seed Lv1 naked Goblin first dungeon has byte-identical stats and identical outcome/rounds/remaining HP across all three candidates. This is an isolation regression, not a general difficulty claim.

Limitations: this is not a multi-hour sustain test, whole-dungeon completion test, all boss-mechanics audit, cross-race balance ranking or optimized ceiling. The set comparisons retain the same poison/heal skill profile to isolate gear-base survivability; they do not claim optimal ambush/contraption builds.

## Verification and boundaries

`goblin-equipment-v0812-tests.mjs` passes337 identities at Lv1/20/60/100, all ordinary qualities, all66 Goblin identities, other-origin numerical controls, cross-race wear, every+0..+5 enhancement and divine once, paid success/failure quotes, reforge, strict raw tamper/identity rejection, old-current/full-health owned saves, and all five earned current-save fixtures. Actual App itemDetail plus formal/developer enhancement renderers show effective base values. The existing integer-display source assertion now requires the effective-base helper rather than the immutable raw field; integer rounding assertions are retained.

Initial focused result:34 of35 suites passed. `goblin-ashen-catalog-parity-tests.mjs` stopped at an inherited pre-v081 poison-skill hash pin (`86769b18…`), while both released HEAD and current `dist/races/goblin/skills.js` hash to `7ff45f8f…`. No skill file changed here and no fixture bypass was added; integration owns reconciliation of that old milestone assertion. All source-equipment budget/identity validators and `equipment-slot-parity-tests` pass. Full aggregate/build/publication were not run by this worker.

Passing focused suites (all suffixes shown):

- `attribute-integer-display-tests.mjs`
- `balance-talent-integration-tests.mjs`
- `character-stats-tests.mjs`
- `current-save-generation-tests.mjs`
- `equipment-budget-adapter-tests.mjs`
- `equipment-enhancement-tests.mjs`
- `equipment-level-tests.mjs`
- `equipment-runtime-production-tests.mjs`
- `equipment-runtime-tests.mjs`
- `equipment-slot-parity-tests.mjs`
- `equipment-template-tests.mjs`
- `equipment-workshop-ui-tests.cjs`
- `formal-enhancement-integration-tests.mjs`
- `formal-enhancement-tests.mjs`
- `formal-enhancement-ui-tests.cjs`
- `goblin-ashen-drop-settlement-tests.mjs`
- `goblin-equipment-v0812-tests.mjs`
- `goblin-evasion-boots-tests.mjs`
- `goblin-legend-offline-parity-tests.mjs`
- `goblin-legend-production-tests.mjs`
- `goblin-pack-tests.mjs`
- `goblin-poison-v081-tests.mjs`
- `goblin-production-tests.mjs`
- `integrated-equipment-workshop-ui-tests.cjs`
- `legendary-equipment-tests.mjs`
- `m2-generation-tests.mjs`
- `natural-balance-fixture-tests.mjs`
- `racial-legendary-ui-tests.mjs`
- `reforge-divine-tests.mjs`
- `reforge-inheritance-tests.mjs`
- `skill-tree-poison-host-tests.mjs`
- `skill-tree-poison-tests.mjs`
- `talent-balance-v071-tests.mjs`
- `talent-tests.mjs`
