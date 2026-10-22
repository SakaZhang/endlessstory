# v0.25 — multi-enemy integration and monster records

## Normal game enabled
- Monster codex records actual encounters (not previews), retains known records, reuses details from battle, links material sources to map views without starting combat.
- Existing seven prototype monster definitions only. No new 44-monster balance or 90-material live drops.
- Skill priority drag and arrows keep saved slot conditions, use atomic save, and preserve loadout order. Intrinsic healing usefulness is any missing HP, intersected with the user's explicit condition.
- Gear display left: weapon/armor/ring1/boots; right: helm/gloves/ring2/amulet. Stable socket IDs unchanged.

## Explicit developer sandbox only
Battle page's development section clones the current stopped character into isolated memory storage. All HP, potions, drops and discoveries stay in the clone. Exit or page reload returns to official progress. The SAME integrated engine step/reward/offline code handles two/three enemies, targeting, independent status/cast controls, summons and one encounter settlement. There is no randomly enabled group event or production monster parameter update.

A separate queued all-target test attack exercises target handling without changing any of the fourteen actual skill scopes/coefficients. The casting/control scenario uses visibly development-only fixture parameters; stun pauses preparation and resumes remaining time, interrupt cancels preparation into that skill's normal cooldown plus a separate brief action stop. Boss reduction/diminishing controls are configurable, not accepted final numerical balance.

Group win gives base XP/gold twice and exactly two normal loot rounds, selecting an initial individual with replacement each time; summoned units never change the reward sample. This prototype source adapter uses the existing actual field/node pools. Unique future gem/legend drop content is not enabled. Player guardian counter remains compatible with full shield absorption; optional monster counter requires positive actual HP damage and surviving defender.

## Validation and limits
- Persisted encounter RNG and loot-ID sequence; old single-enemy saves preserved, multi arrays validated. Actual 14-skill comparison tests and online/offline cases included.
- Four-hour offline cap remains unchanged; no new automatic potion crafting, no new recipes or enhancement economy.
- UI tests use the actual app with mocked DOM and native Canvas. Native stage render exists; authenticated browser visual QA is still unavailable and is not claimed.
- Recovery supply remains a separate tuning issue from v0.24.
