# Slot-specific ordinary affixes

Only newly generated ordinary random affixes change. All 20 existing active
attributes and their budgets are reused; no new combat attributes, effects,
weights or stat scaling are introduced.

| Slot | Non-elemental candidates | Elemental candidates | Total |
|---|---|---|---:|
| Weapon | Attack, hit, crit, crit damage, lifesteal | Six attacks | 11 |
| Helm | HP, armor, hit, crit | Six resistances | 10 |
| Armor | HP, armor | Six resistances | 8 |
| Gloves | Attack, armor, hit, crit, crit damage, lifesteal | None | 6 |
| Boots | HP, armor, hit, luck | Six resistances | 10 |
| Ring | Attack, hit, crit, crit damage, lifesteal, luck | Six attacks | 12 |
| Amulet | HP, armor, lifesteal, luck | Six resistances | 10 |
| Core | HP, armor | Six attacks and six resistances | 14 |

Elements remain earth/water/fire/wind/light/dark. Weapon identity is offense;
body armor is pure defense; gloves are precision/offense with armor; boots keep
hit/luck utility, helm hit/crit, rings offensive utility, amulets survival and
sustain, cores mixed elemental identity. No ordinary weapon resistance rolls.
The minimum pool size is six, enough for four distinct ordinary affixes without
replacement. Quality 0/1/2/3 counts stay 0–1/2/3/4; legendary quality budget 4 keeps
four ordinary affixes, except explicitly authored zero-affix relics.

## Source routing

- `item()` covers ordinary drops, merchant offers, material and equipment forge,
  set drops, and ordinary story rewards.
- `createLegendaryEquipment()` filters its injected definitions by slot too;
  this covers drop and recipe paths, including Return Ring/Infinity Gauntlet.
  Zero-affix story cores do not consume RNG.
- Full reforge generates from the same slot pool, retaining the existing count.
- Special affixes, set effects, legendary exclusives, base budget, source-level
  growth, quality budget, enhancement, divine chances/multipliers are unchanged.

## Compatibility contracts

- Item/save and legendary identity validation intentionally do NOT enforce
  current roll pools. Owned equipment, merchant stock, overflow and saved forge
  candidates remain valid, including historical weapon resistances.
- Value reroll keeps the original stat and immutable source range.
- Same-slot inheritance preserves the exact donor stat/raw value/source range,
  even when that historical stat is absent from today's generation pool. It
  still excludes duplicates and preserves all prior donor eligibility rules.
- Newly paid reforge previews use rule version 8. Only v8 full-reroll candidates
  require slot eligibility. Paid v6/v7 previews retain historical global pool
  acceptance and exact source models; accepting never rerolls or charges again.
- Personal-arc reward reservation version 2 uses slot pools. Version 1 replays
  the frozen historical global pool through the explicit legacy generation
  seam, preserving both seed-only and already-materialized reservations. New
  reservations never opt into that seam. This is necessary because reservation
  validation recomputes and compares the exact item from the saved seed.

## Verification

`affix-slot-pools-tests.mjs` runs as a fresh subprocess in `tests.mjs`: all eight
slots × four qualities × three levels × 80 rolls, every pool candidate observed,
sets, all registered legends, material forge, merchant, full reroll, source
provenance and legacy off-pool owned/value/inheritance/v7 pending cases.
`affix-slot-story-compat-tests.mjs` independently uses frozen baseline personal
reward fixtures to check deterministic legacy reservations and v2 retries.
Existing source/growth, legendary, personal reward, inheritance and reforge
suites retain their original rules; only new-preview version assertions and
obsolete single-slot global-pool coverage assumptions are updated.
