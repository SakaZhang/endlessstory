# v0.34 production integration — release candidate

Based on deployed v0.33 / 44c13d0, branch feature/v034-legendary-drop. No M3 content or new skill tree is included.

## Actual runtime paths
- `engine.rewardDwarf` invokes the independent local boss legendary pool and the registered q4 factory. Ordinary/set rewards coexist. The encounter receipt, rewarded guard and persisted combat RNG retain once-only settlement semantics.
- `multi-combat` executes the hammer and reactor consumers with actual damage, crit, elemental resistance and HP-based lifesteal. Explicit combat proc probabilities are not modified or recursively invoked by legendary damage.
- `equipment-runtime` is wired into real equip/loadout entry points, save validation and shield carry. UI equipment changes clone, persist, then adopt.
- `player-shield-layers` tracks separate sources on combat time. Enemy expired shields are removed before automatic pulses. A clearing pulse grants its paired shield to a living hero, then carries it across encounters; dead heroes cannot be healed or shield-resurrected.
- `legendary-equipment` and affix-range validation support canonical source q4; full reforge rebuilds q4 on legendary targets, while transfer and wash preserve the donor source. No source metadata is inferred for old unknown-source affixes.
- Equipment auto-discard and batch sale expose an explicit legendary category, default off. Old supreme selections do not select legendary items. Materials/items retain only four quality categories.

## Unified luck
Existing quality/value better-of-two opportunity remains `.06*r/(r+5)` exactly once. Newly eligible loot occurrence channels use `base*(1+.10*r/(r+5))`; divine uses `base*(1+.20*r/(r+5))`. Legendary total probability is `.05+.02*r/(r+5)+explicitRarePP`, bounded by one. Ratings must be finite and within the validated 0–1000 envelope. Zero-probability sources remain zero.

Shop, fixed recipes, exact raw inheritance, unique ownership, enhancement success and explicitly stated special/combat probabilities remain unchanged. Knowledge and scavenger trigger rates stay fixed; material quality after scavenger uses the ordinary single luck path. Current obtainable luck sources are talent/equipment; no new luck potion source is claimed.

## Numeric evidence and limits
Root approved one first-pass set after the real 45-case comparison in `/workspace/shared/legendary-balance-v034/CONSUMER-REPORT.md`: hammer 5 actions / 1.4 ATK / 30% penetration; reactor 12 combat seconds / .75 ATK fire / 8% max HP plus shieldBonus once / 3 combat seconds. The matrix measures equipment plus exclusive effects, not isolated proc power. It covers current levels20/25/30 and three builds, not whole-world balance. Subsequent shield-boundary regressions cover expiry ordering and clearing-pulse carry.

Actual App mocked DOM and production icon exports are tested. No authenticated whole-page browser visual QA is claimed. Deployment requires final frozen regression and independent review.
