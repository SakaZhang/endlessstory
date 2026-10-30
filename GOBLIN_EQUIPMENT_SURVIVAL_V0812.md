> Historical v0.81.2 release evidence only. The latest v0.82 instruction supersedes the total multipliers with racial level-growth-only reductions. See `GOBLIN_RACIAL_GROWTH_V082.md`. Original numbers below and `qa/goblin-total-v0812/` are preserved as history.

# Goblin TOTAL survivability — final v0.81.2 policy

## Latest user instruction supersedes the earlier equipment-only candidate

Latest target: same level, loadout and talents versus released **812e4e35**, **Goblin-character total maximum HP ×0.80 and total armor ×0.70**, including level growth. The earlier equipment-base-only20% reduction is discarded, not stacked. Its measurements under `qa/goblin-equipment-v0812/` are superseded and must not be presented as final release evidence.

Implementation: `dist/race-survival-balance.js` supplies the two multipliers. `baseStats` in `dist/engine.js` applies them once, after level, equipment, ordinary-affix and talent aggregation. Internal precision is retained; the existing UI rounds displayed attributes. All Goblin/common HP/armor passives are multiplicative, so their final totals retain the same ratios. This is the same shared production chain used by combat and character panels, not a cosmetic panel adjustment.

Naked growth changes from `HP=120+14×level` to `HP=96+11.2×level`, and from `armor=5+level` to `armor=3.5+0.7×level`. Attack remains `14+3×level`. Every future level, talent and gear contribution remains inside the survival multiplier, including levels101/150/250/1000: no high-level rebound. The existing item-budget level cap is not altered.

All item raw budgets, provenance, catalog identities, affixes, enhancement/divine calculations and equipment displays return to the original812e4e35 behavior. `equipment-base-balance.js` and its hooks are removed. An item has the same numbers on every wearer; only a **Goblin actor's total** is reduced. Other-race characters remain unchanged even when wearing Goblin equipment. Goblins wearing mixed/foreign-origin gear still receive the exact actor total adjustment. Item details correctly show item attributes, while the hero panel shows the racial total.

Attack, poison, skill/set offensive coefficients and cooldowns are unchanged. Goblin poison remains2s /3% per layer /5 cap /12s refresh. Immutable source hashes for gear budgets/factories, Goblin equipment/skills, poison and passive derivation are pinned against812e4e35 in the regression. No raw save mutation, schema expansion, compatibility migration or relaxed validator is introduced. Existing health normalization safely caps current HP to the lower maximum.

## Exact released-baseline regression

`fixtures/goblin-total-survival-v0812-baseline.json` contains208 valid states and base/final outputs generated from the exact812e4e35 runtime:

-80 Goblin cases: Lv1/20/60/100/101/150/250/1000 × naked, ordinaryQ2, each of3 sets, both Goblin legends, HP/armor talents, mixed-origin gear, survival passives and+5 divine gear.
-128 other-race controls: all4 other races × those8 levels × naked/Q2/legends/mixed.
-Additional92 runtime checks cover every one of the9 available Goblin/common passives alone and every two-slot pair at Lv60 and150.

`goblin-equipment-v0812-tests.mjs` passes all exact ratio checks (floating tolerance1e-8), unchanged other stat objects including ATK, untouched item totals, strict invalid-budget/identity rejection, owned/full-health save acceptance and ordinary HP capping. Paid enhancement success/failure and actual App itemDetail/formal previews preserve the original item values. A real production heal reads the reduced maximum HP; controlled physical basic hits use precisely the armor displayed by the combat character panel.

The fixture is byte-reproducible with `BASELINE_ENGINE_ROOT=/path/to/extracted-812e4e35 node tools/generate-goblin-total-baseline.mjs /tmp/baseline.json`. The generator refuses any engine other than SHA256 `051cc2c890a303af267c2f94c2cf1b3b3e675d951d5c1d83d7338d9558c00b5d`. The checked fixture SHA256 is `b5e063ab84ab0b4f06dd77d5fad7a15a0e31e3af7743ff7231931c54c4da8f4a`.

## Paired real combat measurement

Runner: `goblin-equipment-v0812-audit.mjs`; final evidence: `qa/goblin-total-v0812/{before,after,comparison}.json`. Baseline uses the exact812e4e35 extracted runtime; no earlier candidate is used as baseline.

12 lawful loadouts: Lv20/60/100, ordinaryQ2 across8 slots or4 Q3 Goblin set pieces plus4 Q2 slots. Prerequisite-complete13-point poison/heal configuration; no talents/passives/specials/enhancement/divine/potions.10 paired seeds against actual same-level Human field/dungeon-first-stage/boss encounters. Area2 has no boss, so Lv20 omits that encounter.320 encounters before and320 after; all640 win. All32 aggregate ATK and encounter-time rows are identical, and paired inventories hash identically.

| Level | Gear profile | Total HP before → after | Total armor before → after | Physical EHP before → after |
|---:|---|---:|---:|---:|
| 20 | OrdinaryQ2 | 1132 → 905.6 | 121 → 84.7 | 2502 → 1673 |
| 20 | 苦菌行者4pc | 1245 → 996 | 100 → 70 | 2490 → 1693 |
| 20 | 余粮斥候4pc | 1272 → 1017.6 | 114 → 79.8 | 2722 → 1830 |
| 20 | 旧索匠4pc | 979 → 783.2 | 146 → 102.2 | 2408 → 1584 |
| 60 | OrdinaryQ2 | 3298 → 2638.4 | 289 → 202.3 | 12829 → 7976 |
| 60 | 苦菌行者4pc | 3245 → 2596 | 292 → 204.4 | 12720 → 7902 |
| 60 | 余粮斥候4pc | 3210 → 2568 | 329 → 230.3 | 13771 → 8482 |
| 60 | 旧索匠4pc | 2583 → 2066.4 | 475 → 332.5 | 14852 → 8937 |
| 100 | OrdinaryQ2 | 6780 → 5424 | 631 → 441.7 | 49562 → 29382 |
| 100 | 苦菌行者4pc | 7247 → 5797.6 | 600 → 420 | 50729 → 30148 |
| 100 | 余粮斥候4pc | 7384 → 5907.2 | 696 → 487.2 | 58777 → 34687 |
| 100 | 旧索匠4pc | 5563 → 4450.4 | 1068 → 747.6 | 64976 → 37722 |

Physical EHP is `HP×(1+armor/100)`, before individual-hit rounding, excluding dodge/shields/elemental mitigation/healing. The simultaneous HP and armor changes have a larger combined survival impact than either percentage alone.

At Lv100 ordinaryQ2 boss, mean incoming HP damage819.3→1208.5 and finish-health91.9%→84.6%; poison-set boss966.3→1300.4 and90.7%→84.0%. Enemy lifesteal and HP-based healing/shields can change downstream despite unchanged attack/poison formulas; total post-mitigation poison HP loss is not claimed identical.

**Naked Lv1 is now intentionally affected.** Its real first-dungeon single-seed control still wins in4 rounds: HP134→107.2, armor6→4.2, remaining HP114.4637→87.6637. Do not retain the discarded candidate's “naked unchanged” claim.

Actual final-build browser verification used a separate frozen Lv100Q2 fixture from812e4e35: HUD and full attributes show HP6635→5308, armor650→455, ATK1141 unchanged. Exported inventory/equip IDs remained byte-identical. Evidence: `qa/browser-v0812/final-goblin-total-attributes.png` and `final-goblin-after.json`.

Limits: these are fresh-full-health single encounters, not multi-hour sustainability, whole-dungeon completion, optimized endgame or all-boss proof. Set profiles keep the same poison/heal configuration to isolate survival, not to rank optimal builds. Focused logs are in `qa/goblin-total-v0812/tests/`; release-wide regression/build results are owned by the final integration report.
