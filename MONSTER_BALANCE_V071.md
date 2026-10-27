# v0.71 empty-start and fixed regional threat calibration

## Scope

User-authorized empty new characters and overall low-consumption stable-idle balance.
New `fresh` states have no equipment or owned starter inventory (including Ashen core),
all sockets null, base Lv1 134 HP / 17 ATK / 6 armor. Starting 100 gold and other
resources remain. No owned-save migration or deletion. Empty UI paths and isolated
visual preview are separately tested; the preview explicitly creates its own demo
loadout and uses A02, never grants anything to real new characters.

## Numerical policy

`dist/monster-balance.js` is the final fixed actor-budget layer, routed through
`world-content.monsterParameters`. Original providers remain source content and
availability/skill metadata, **not final HP/ATK/armor/reward tables**. Consumers and
tests should use `monsterParameters`, not `pack.parameters.monsters` when inspecting
new live actor numbers. No hidden test-provider bypass is added.

- A01 ordinary actors: HP 61/71/80, armor 0/1/3, a naked-Lv1 reference and ~5 seconds
  basic-attack lifetime. Actual authored cadence sets physical and elemental power.
  A01 regular XP is 4 and gold 1 for all five regions: the much shorter starting
  fight must not retain the old long-fight 16/24/32 XP and race-specific gold.
- A01 elite: an early **acquired**, not granted, equipment reference: 330 HP,
  28 armor, 43 ATK. The first dungeon remains ordinary/ordinary/elite, not a hard
  weapon or level gate. Regional access remains unchanged.
- A02–A10: a published static table of ordinary equipment at each level-band
  midpoint. Normal basic lifetime target 13–17 seconds, elite 19–23 seconds,
  boss 37–45 seconds; per-actor HP shape and opening shield/lifesteal allowances
  preserve different mechanisms and follower shares.
- Damage budgets use 0.2% (normal), 0.9% (elite), 1.2% (boss) of **that static
  reference HP per second**, converted to fixed raw ATK/elementalPower. This is
  an offline design unit, **not percent-player-health damage and not player
  scaling**. Real equipped HP/armor never enter actor generation.
- Physical raw power accounts for reference armor, elemental power does not:
  authored damage types retain the real distinct resolver. Skill coefficients,
  elemental types, thresholds, duration, control, and story-specific multipliers
  are unchanged. A3→A4 ordinary ATK and HP no longer go backward.
- Same-region/rank base XP and gold are aligned across five races. Existing clear
  rewards, materials, drop chance (field 18%), quality, cooldown, story and boss
  availability are unchanged. No starter giveaway, pity system or weapon lock.

## Cadence model and explicit limitations

The threat model samples 66 seconds at the host's 1100ms step. Basic `nextAt`
uses real raw-interval catch-up, and cast cooldown begins at the raw completion
instant. Scripted below-50% triggers use an explicit 33-second/49%-HP proxy;
this is a calibration assumption, not a claim that actual battles reach half HP
at that time. DOT ticks and follower shares consume the same threat budget.

`monster-cadence-budget-tests.mjs` compares **all 217 actors** with production
`initializeDwarfActor`, `advanceControlClock`, `nextDwarfAction`, and DOT settlement.
Their scheduled coefficient sums match to <1e-9 after removing the separate
trait-reflection allowance. Random trait reflection is deliberately approximated
by chance × coefficient / cooldown. Skill-based timed reflect is not included
in that equality and needs real combat/burst coverage. Healing, shields, status,
misses, player interruption, enemy death and target order also require actual
host measurements; the static target alone does not certify actual DPS parity.

## Save compatibility

`old-active-balance-compat-tests.mjs` freezes 25 exact-v0.70 active encounter saves:
five races × field / dungeon stages 1,2,3 / first authored boss. The capture tool
requires git HEAD `9f56c77996038f929d390a35ac48167250f1475d`; fixture actors are
created by the old production host, and previous dungeon stages are actually
won/rewarded. Hero gear/XP/access are explicitly synthetic diagnostics, not user
saves or naturally acquired builds.

The new host accepts these saves, preserves every old actor field on hydration
and paused actions, resumes and settles all battles, then uses the new budget
only for the next newly created actor. Actor validators still validate snapshot
shape/content references rather than demanding equality with the new table.
Separate integrated story-active compatibility coverage is owned by the story
reviewer; no story snapshot rewrite is introduced here.

## Tests and reproducible probes

- `node empty-starter-engine-tests.mjs`
- `node empty-starter-app-ui-tests.cjs`
- `node battle-slice-tests.mjs`
- `node monster-balance-tests.mjs`
- `node monster-cadence-budget-tests.mjs`
- `node old-active-balance-compat-tests.mjs`
- `node tools/monster-onramp-gate-probe.mjs [engine-root] > gate.json`
- `node tools/monster-tier-probe.mjs [engine-root] > tier.json`

Gate/tier probes are **legal factory-generated equipment**, diagnostic XP and
access, not naturally farmed saves. They execute the actual three-stage host
without potions and separate basic/no-point builds from legitimate allocated
point builds. Tier output separates direct-hit 1-point events from DOT counts
and records peak actual HP loss. Strong equipment revisiting old regions may
still take 1, and weak multi-tick DOT may legitimately show 1; the patch does
not raise a global floor to cosmetically hide that.

Full integrated natural acquisition/check-ins/shopping/long-run progress and
online/offline parity are run on a frozen integrated runtime by the natural
progression reviewer. Intermediate single-module curves or mixed runtime hashes
must not be represented as final release acceptance.
