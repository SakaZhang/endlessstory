# Goblin racial growth only — v0.82 latest policy

## Scope and formula

Latest instruction: “我觉得还是不要削装备数值，只削种族成长好了。削装备有点不平衡。” This replaces both the discarded equipment-base nerf and the released v0.81.2 total-character multipliers; neither is stacked.

- Goblin **HP level growth 14 → 11.2** and **armor level growth 1 → 0.7**.
- Fixed base **120 HP / 5 armor stays unchanged**.
- Equipment, ordinary affixes, enhancement/divine effects, talents and passive coefficients receive no racial cut. Same item adds the same HP/armor/ATK to all five races. The separate later enhancement instruction changes the shared enhancement rate to +5% per level; it does not reintroduce a Goblin-only equipment penalty.
- ATK formula and Goblin poison mechanics remain unchanged. Other races retain growth 14 HP / 1 armor.
- No new save schema, item rewrite, compatibility migration or validator relaxation.

`dist/race-survival-balance.js` owns immutable default/Goblin per-level coefficients. `engine.baseStats` rounds the unchanged non-level equipment/affix aggregate as before, then adds level growth without rounding away its fractional component. No final HP/armor multiplier remains. Passives then use the normal production chain.

Naked Goblin values (internal precision; UI displays rounded integers):

| Level | HP | Armor | ATK |
|---:|---:|---:|---:|
| 1 | 131.2 | 5.7 | 17 |
| 20 | 344 | 19 | 74 |
| 60 | 792 | 47 | 194 |
| 100 | 1240 | 75 | 314 |
| 101 | 1251.2 | 75.7 | 317 |
| 1000 | 11320 | 705 | 3014 |

Holding the shared enhancement policy constant, relative to the exact pre-nerf v0.81.1 baseline, before passives the racial change is **−2.8 × level HP / −0.3 × level armor**, independent of equipment or talents. It is not a 20%/30% cut to the final character. Frozen enhanced fixtures additionally receive the separately authorized 4% → 5% enhancement-policy correction described below.

## Focused verification

Primary regression: `node goblin-racial-growth-v082-tests.mjs`. The historical `goblin-equipment-v0812-tests.mjs` entrypoint now imports it so old test commands cannot silently enforce the superseded total multiplier.

Passed:

- 208 immutable exact-v0.81.1 inputs: 80 Goblin cases and 128 other-race controls across Lv1/20/60/100/101/150/250/1000. Naked, ordinary, sets, legends, talents, mixed-origin, passives and divine/enhanced profiles.
- 92 combinations covering every Goblin/common passive alone and all legal two-slot pairs; coefficients are applied in full to the corrected base.
- 480 cross-race same-item delta checks across Lv1/20/60/100/101/1000, ordinary and +5 divine gear: full HP/armor/ATK for every wearer.
- 50 explicit cross-race heart/steel talent delta checks: +20 HP / +3 armor, not scaled down.
- Raw equipment budgets, identities, enhancement success/failure, strict invalid-item rejection, unchanged racial ATK formula and pinned poison/skill/passive source remain covered. The old legendary-catalog byte hash is intentionally excluded because Lucky Dice extends that catalog. The equipment-budget byte hash is also excluded for the explicitly authorized enhancement formula change; all original raw items, unchanged metadata and exact old/new totals are still checked independently, with no fixture skipped.
- Real production healing reads the same max HP as the panel; real physical attacks use the exact panel armor. Actual App empty-inventory/new-journey, merchant purchase/equip/reload and unarmed-combat flows pass for all races.
- `empty-starter-engine-tests.mjs`, `empty-starter-app-ui-tests.cjs` and `goblin-poison-v081-tests.mjs` pass. Logs: `qa/goblin-growth-v082/tests/`.

## Orthogonal enhancement update: retain every historical case

The later instruction sets +1/+2/+3/+4/+5 to **+5%/+10%/+15%/+20%/+25%**, computed independently per raw base stat as `Math.round(raw × (1 + 0.05 × enhancementLevel))`. Ordinary affixes are not enhanced; divine multiplication remains full. The former forced +1 fallback is removed.

The immutable baseline remains byte-for-byte unchanged (SHA256 `b5e063ab84ab0b4f06dd77d5fad7a15a0e31e3af7743ff7231931c54c4da8f4a`). All 208 cases still run, including all eight +5 divine loadouts. Their old 4%-per-level formula and forced +1 fallback are reconstructed solely from the frozen item data and checked exactly against the frozen aggregate. A separate new-5% oracle then applies per-item rounding, divine ×1.1, unchanged affixes and final aggregate rounding. Only after adding that known shared enhancement delta does the expectation subtract the racial level-growth difference.

Enhancement-only aggregate deltas versus the historical fixture (before the Goblin racial-growth reduction):

| Level | ATK delta | Armor delta | HP delta |
|---:|---:|---:|---:|
| 1 | +3 | +4 | +21 |
| 20 | +9 | +4 | +33 |
| 60 | +15 | +15 | +92 |
| 100 | +43 | +34 | +252 |
| 101 | +33 | +36 | +296 |
| 150 | +43 | +34 | +252 |
| 250 | +36 | +43 | +238 |
| 1000 | +44 | +32 | +256 |

Differences across high-level rows reflect their different frozen item loadouts, not a new level cap. The 480 cross-race gear-delta assertions also use the independent 5% oracle. Non-enhanced inputs and the browser fixture remain unchanged: **6500 HP / 601 armor / 1090 ATK** for the exported Lv100 Q2 loadout.

## Paired combat measurement

`node goblin-racial-growth-v082-audit.mjs` preserves the existing paired methodology, writes only the new evidence directory, and exports the Lv100 Q2 state for actual-browser verification. Comparison reuses immutable `qa/goblin-total-v0812/before.json`, generated from exact release `812e4e35`, and verifies identical equipment hashes and attack.

- 12 lawful loadouts at Lv20/60/100: ordinary Q2 or four pieces of each Goblin set plus four Q2 slots.
- Same prerequisite-complete poison/heal configuration, no talents/passives/specials/enhancement/divine/potions.
- 10 paired seeds against same-level Human field, first dungeon stage and boss (Lv20 has no boss): **320/320 wins before, 320/320 after**.
- All 32 aggregate rows retain identical gear, attack and fight duration.

| Level | Ordinary Q2 HP, pre-nerf → current | Ordinary Q2 armor, pre-nerf → current |
|---:|---:|---:|
| 20 | 1132 → 1076 | 121 → 115 |
| 60 | 3298 → 3130 | 289 → 271 |
| 100 | 6780 → 6500 | 631 → 601 |

**Naked Lv1, seed7919:** the real first-dungeon opening wins in 4 rounds with 111.6637 HP left, from 131.2 HP / 5.7 armor. Continuing without equipment, skills or potions wins stage 2 in 4 rounds (90.6637 HP), then loses stage 3 in 8 rounds. This is a narrowly defined regression control, not a claim that a fresh unbuilt character clears the full dungeon.

Evidence: `qa/goblin-growth-v082/{after,comparison}.json`. Historical `qa/goblin-total-v0812/` and `fixtures/goblin-total-survival-v0812-baseline.json` remain unchanged. Historical total-nerf reports describe the old release, not this latest policy.

Limits: paired audit covers fresh-full-health single encounters, not multi-hour sustainability, optimized endgame, whole-dungeon or all-boss proof. App tests use the actual module with a DOM/canvas harness, not a browser screenshot/layout claim. This change does not itself perform a full release build or publication.
