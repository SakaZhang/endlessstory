# 幸运骰子 — casino-exclusive legendary necklace

- Canonical identity: `lucky-dice`; exclusive: `lucky-dice-roll`; production factory: `legendaryItem('lucky-dice', level, metadata)`.
- Shared `amulet` socket, no race restriction. Stored rarity 3 / display legendary quality 4 follows existing standards.
- Fixed raw attack 33, armor 0, HP 333 at every level. Fixed luck +33 and critical rating +33 are authored bonuses, not ordinary affixes or percentages. No random ordinary affixes or random special; refines are unavailable because there are no ordinary affixes. Standard enhancement still changes effective attack/HP, not raw values or luck/crit.
- Casino is its only acquisition source. It is not registered in any racial boss drop pool, ordinary equipment template pool, forge output pool or otherworld/tower reward pool. Acquisition odds are owned by the casino transaction, never modified by necklace luck.
- On a landed basic action, one independent draw selects `[0,.33)` → 75%, `[.33,.66)` → 125%, `[.66,.99)` → 100%, `[.99,1)` → fixed 3333. The first three branches retain normal crit/mitigation. Fixed 3333 bypasses armor, crit and damage multipliers; shields still absorb it. Lifesteal uses actual HP loss, excluding shield absorption and overkill. Skills, DOT, counters and equipment follow-up damage do not roll or recursively trigger dice.
- `lastCast.luckyDice` uses a strict three-field canonical outcome record. No counters or custom migration are required. Unequipped inventory copies do not contribute stats or trigger effects.
- Artwork uses a distinct repo-native 32px vector die pendant and gold chain via the ordinary legendary presentation adapter. Native SVG decoding at 32/48/64 was visually inspected; `qa/lucky-dice/icon-proof.png` is a local QA artifact, not browser screenshot evidence.

## Verification

`node lucky-dice-tests.mjs` checks factories, level independence, malformed data, exact RNG boundaries, 10,000 stratified draws (3300/3300/3300/100), seeded distribution (3287/3327/3278/108), all five races' stats/equip/save/codex, standard enhancement, source isolation and art adapters.

Also passed: `legendary-equipment-tests.mjs`, `legendary-production-tests.mjs`, `equipment-slot-parity-tests.mjs`, `legendary-race-art-tests.mjs`, `goblin-ashen-catalog-parity-tests.mjs`.

The existing 14 legendary definitions remain; Lucky Dice makes 15. Catalog total is 338, with unchanged ordinary/set counts and Goblin 52 ordinary + 12 set parts + 2 racial legends. Actual combat and casino/App tests belong to their integration suites; the focused necklace suite is not a full-release gate or deployment claim.
