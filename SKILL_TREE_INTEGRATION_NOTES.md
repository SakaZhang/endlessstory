# Skill tree integration — work in progress, not released

Branch: `feature/v036-skill-tree`; deployed v0.35 remains unchanged.

## Confirmed architecture
- Level 1 has zero skill points; one independent point per gained level, at most 99 in the level-100 model. No talent points or memory-fruit costs are moved.
- Three presets each allocate independently up to the same earned budget. Four active slots and two passive slots; reset is free and skill-only.
- New basic attack is independent of active slots. Axe/hammer 110% versus other weapons 100% is enabled for active-tree encounters; prepared legacy saves keep their current resolver.
- Fifteen active effect directions and three set-link directions are approved. The parent reviewed and approved the 99-point costs/prerequisites and single tuning set for this first release candidate on 2026-10-23. All six passive directions are approved and wired; only the equipped two apply. The axe all-damage passive applies to direct damage, DOT, counters and legendary procs, with its defense cost; numeric magnitudes are reviewed initial tuning, not a claim of final balance.
- Poison is separate percentage damage, not an equipment element: 2% target maximum HP per layer, maximum five. The user withdrew enemy-action-step ticking in favor of time-based ticks. The three-second tick and nine-combat-second layer duration were accepted as initial numerical tuning after actual-host tests; they are not immutable user-specified constants. Scheduled combat timestamps must catch up due ticks without using player rounds, browser timer frequency, or paused/travel wall-clock time. Poison does not bypass shields: damage first consumes shield, then HP. The user explicitly excludes poison from the axe/global damage multiplier too: its base percentage remains fixed; elemental bonuses/resistance do not apply.

## Code in this branch
- `skill-tree-state.js`: versioned prepared/active pure state, immutable quote/prepare/commit, independent preset budgets, bounded legacy snapshot and free reset.
- `skill-tree-definition.js`: immutable, versioned reviewed initial configuration snapshot. The identifier must change if costs/prerequisites change; it is not fetched from mutable shared files at runtime.
- Engine validation accepts only the fixed, versioned 99-point definition. New fresh saves use active mode with zero points and empty 4+2 slots. Existing saves remain legacy until explicit confirmed conversion; ongoing/unsettled fights and dungeon runs block conversion. New encounters record tree-v1; normal step and offline use the same selector. Preparation wrappers remain preparation-only, while the reviewed draft transaction performs explicit activation.
- `skill-tree-consumer.js`: approved plans and parameterized host execution. It does not implement an alternative damage formula or grant skills. Damage, crit, reaper, reflection, lifesteal and legendary bookkeeping must use the existing production pipeline.
- `skill-tree-poison.js`: explicit scheduled combat-time ledger; timing/expiry policy must be supplied. Prior enemy-action implementation is archived as withdrawn.
- `executeTreePlayerAction` in actual multi-combat shares production mitigation, HP/shield, reaper, reflection and lifesteal helpers. Real encounter/JSON tests cover two segments, corpse stopping, multicast, per-cast count and one counter. The active-tree normal selector invokes this same host; legacy encounters retain the old resolver.
- Actual multi-combat save validation now supports bounded version-2 multihit records, unique hit IDs and target/segment pairs. Legacy records retain the old bound.

## Migration / authoritative state
1. Preserve old skills, conditions, equipment presets, assets and source-range metadata. Preparing a tree does not change combat skills or give nodes.
2. Existing encounter completes with its old resolver. Activation is not allowed during an unfinished encounter, unclaimed settlement or dungeon run.
3. Show explicit conversion/configuration review; confirmation is one transaction. Recommendations never spend points automatically.
4. Once activated, the tree preset is the single authority for skills/conditions/passives. Do not dual-write independent authoritative old/new slot arrays.
5. Equipment and tree preset selection must share one transaction and the existing actual-ID equipment lifecycle. Same item IDs do not reset legendary counters; changed items do.
6. A failed save must not adopt any changed state. At commit, clone the latest game and apply the validated intent; do not restore stale gold, health or clocks from a quote.

## Implemented contracts and remaining release gate
- Shared current hit resolution is used as callbacks for multihit/all-target execution without changing mitigation or RNG rules.
- Source-specific statuses, skill shields and three set links are integrated into real actor actions and expiry. Distinguish skill shields from equipment shields.
- Actual active skill selection is wired to left-to-right ready/useful/explicit-condition guards, with the basic fallback. Real multicast is a second cast but never recursively rolls itself or pays CD again.
- Preserve per-segment reaper, actual-HP-only lifesteal, at most one enemy counter per cast, and once-per-cast equipment counts.
- Actual App tree editing, 4+2 selection, prerequisite refund preview, atomic confirm/cancel, explicit migration and the three quick presets are wired locally. These changes are not yet released. Numerical review has passed; final full regressions and independent release review are still required.
- Run actual save/load/online-offline and old paid forge/source-range/legendary regressions, independent review, then parent release authorization.

## Current clock fact (not changed)
Production combat is a 1.1-second player-driven discrete step. Each step checks independently timed enemies, but resolves the player, DOT and enemy actions in one batch. App polling is 250ms and canvas redraw roughly 70ms; the hit animation is one 280ms batch marker. This is not yet independently scheduled real-time actor execution. New clock behavior needs the parent's decision, not an incidental poison implementation.

Known timing limitation: 250ms App polling can make a nominal 1100ms action occur around 1250ms in a real tab, while offline processing uses exact scheduled timestamps. Engine fixture parity does not prove browser wall-clock parity. No cadence change is bundled into this release candidate.

## Integration milestone (2026-10-23 06:59 UTC, not frozen/released)
- Fifteen active skill plans now run through the actual multi-enemy production resolver; six equipped passives modify the actual damage/healing/mitigation paths. Axe scatter uses the configured combat-time poison ledger and shield-first percentage path.
- New default fresh is zero-point active tree; historical regression factories explicitly request the old starter. Old user saves are not rewritten or gifted nodes.
- Real App draft editing/conversion and normal start→step are tested. JSON continuation, normal offline/online parity and actual dungeon stage reward→next-stage skill-CD/effect/shield transfer pass focused tests.
- Candidate tuning is snapshotted in skill-tree-tuning.js. 3s/9s poison timing, all coefficients, costs and prerequisites are initial reviewed-test candidates, not user-approved immutable numbers. No skill rank scaling or independent skill XP.
- Current full aggregate exposed historical tests that manually equip old skills on new fresh; those fixtures are being explicitly separated, not silently weakening runtime validation or reverting the new starter.
- Actual browser visual validation is unavailable; App tests use DOM mocks. Canvas output alone is not whole-page layout validation.

## Release scope and finite evidence
- The racial forge trait 祖炉眷顾 is **not implemented** here. The six equipped passives do not include it, and no forge success/cost changes are bundled.
- Enemy status/poison layers and hero source-specific shield details read the authoritative combat ledgers only; opening details does not pause, save, advance timers or draw RNG.
- Removing mountain vitality caps existing HP to the new maximum in the same saved tree transaction; adding it again does not restore HP.
- Numerical evidence: `/workspace/shared/skill-balance-v036/FULL-REPORT.md` covers 40 actual-host trajectories, all 13 current monsters and actual casts of all 15 skills, plus finite six-passive coverage. It does not prove every cross-combination or future regions balanced.
- Two reproducible fresh 15-minute traces fix both RNG and UID clock: unspent basic route 63 wins/one defeat, versus a real first-root purchase/slot transaction at 5m22.5s yielding 70 wins/one defeat. Neither route spends talents, upgrades gear or stocks potions; this is not a prediction that an active player must lose.
- Timer damage that clears the last enemy still earns elapsed reactor combat charge, without firing against a corpse. Travel/pause adds none; saved charge resumes against the next legal encounter.

## Final focused validation updates
- Direct 回炉息 preserves the existing healing talent: `(.14 * currentMaxHP + healingBonus) * receivedHealingMultiplier`, then missing-HP cap. HOT stays `.02 * maxHP` per tick with no repeated flat addition. High-flat/mountain/multicast/CD/full-health cases pass actual host tests.
- The 4h test caught a field-transition clock-origin defect. New tree encounters now rebase the carried equipment shield ledger to their skill clock, preserving each layer's remaining duration and amount. They do not discard or replenish it. Actual spawn/three-action expiry and continued-save validation pass.
- `/workspace/shared/skill-balance-v036/FOUR-HOUR-REPORT.md`: independently initialized normal online, one-shot offline and midpoint JSON trajectories have the same initial hash and equal entire final game state except the offline chronicle summary. 10,633 actions, 1,502 victories, 79 groups; all saves valid. The formed level-30 axe/fire build with reactor and self-healing used zero potions; this is a consistency test, not a potion-economy calibration.
