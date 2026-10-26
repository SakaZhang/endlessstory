# v0.64 — Confirmed forging rule and task-transaction foundation

Base: live v0.63, `752cdf4578ee9af95e1531cefd53aeee352d132f`.

## Player-visible fix

Pure-material equipment fusion now uses the already-confirmed shared integer ±2 level roll around the hero's current level, with minimum level1. Equipment-input fusion retains its highest-input baseline. Potion results return before the new level draw. Fusion-rule text reflects this rule.

At hero level100, equipment levels98–102 are possible; the existing numerical-budget cap100 is preserved. This release does not change leveling, equip restrictions, quality tables, costs, material consumption, divine/legendary policy, or hidden recipes.

The added independent RNG draw changes deterministic later sample traces, not probability tables. Seeded fixture updates and the independent analytic/multi-seed talent-distribution oracle are documented in `MATERIAL_FORGE_LEVEL_VARIANCE.md`.

## Transaction foundation only — no playable quests

`task-reward-transaction.js` supplies atomic material-submission/reward/completion handling on real storage/inventory paths. Full bags and failed persistence leave submissions and completion unchanged. Forge pending results remain independent. Stale submissions cannot overwrite the persisted current snapshot; this is not cross-tab compare-and-swap.

Engine integration is deliberately minimal:
- `validSave` rejects malformed optional `taskRewardClaims`, including sparse arrays.
- Engine exposes only the sealed `claimTaskReward`; it does not expose the trusted content registration factory.
- The production registry is frozen and empty. Every production claim is unavailable, without storage reads/writes or gameplay mutation.

There are **no quest definitions, quest rewards, activation/ready-state UI, dialogue, kill tracking, hidden recipe acquisition, or story changes** in this release. This is infrastructure, not a delivered quest system.

## Compatibility and assets

Schema6 and `ashencrown-v6` remain unchanged. Existing current saves need no ledger conversion; no migration/reset is introduced. The v0.63 forty dedicated exploration maps, battle/camp art, adjacent-only navigation and release-asset exclusion policy remain unchanged. Footer version is v0.64; the existing content-hashed build supplies the cache namespace.

## Verification

- `npm run test:confirmed-rules`: engine ledger/sealed-claim boundary, transaction atomicity, material variance, forge/equipment levels, provenance, equipment-input fusion and five-seed talent oracle.
- `npm run test:exploration`: all40 dedicated maps plus10 retained Dwarf map routes, actual App navigation and80 native composites (not browser screenshots).
- Current-save-generation, transaction and camp-scene regressions.
- Build and full release cache graph, including the engine-imported task service (no unreachable-module whitelist exception).
- The pre-existing aggregate-suite armor-art count expectation is36 actual vs28 expected at `equipment-armor-art-tests.mjs:8`. It is unrelated to these changes and remains unfixed; do not describe the aggregate gate as green.

No deployment is performed by this integration task. Browser screenshot evidence is not claimed.
