# v0.70 — Infinity Gauntlet and unique crafted-product disposal

Release gates verified; publication receipt is recorded by the owning conversation.
Based on verified v0.69 source `5f5e1c268550a2bc13f354ace2a460af9097fb76`.
Save generation remains 6; no clearing or migration.

## Runtime

- All five races' existing ordinary dungeon final-stage victories independently
  offer a permanently learned Infinity Gauntlet recipe. No field, boss or story
  source was added; no guaranteed story reward. The 2% rate is provisional
  authored tuning, not a user-specified probability: mean 50 clears, median 35,
  95% within 149. Existing 5-minute same-dungeon cooldown gives ~4h10m mean
  cooldown time plus combat; route switching can be faster. This is not a proof
  of whole-game one-week pacing. Recipe learning needs no free inventory slot.
- Craft uses exactly the five canonical Q3 racial gems, one each, and the existing
  40-gold forge fee/racial modifier. Level uses current hero ±2, minimum1, with
  four ordinary affixes and immutable exclusive identity. Ledger and exact result
  persist with cost in one transaction. Full gloves bag uses the existing fixed
  pending-forge claim. Same live service retries a rejected storage write without
  reroll; a failed write cannot itself promise durability across process restart.
- Each successful ORIGINAL active skill release counts once, including support
  skills. Basic attacks, passives, passive multicast repeats, hit segments and
  automatic equipment-core beams do not add counts. Every fifth release deals
  50% of that cast's selected enemy's maximum HP, identically for bosses/normal
  enemies. If the skill has already killed that target, the trigger is consumed
  without seeking another target. It ignores armor/resistance/crit multipliers,
  uses the existing damage path (shield absorbs), and adds no lifesteal/reaper
  or recursive proc. Unequipping the Gauntlet resets; the same equipped item
  preserves partial counts through pause, reload, dungeon stages and offline play.
- Only Return Ring and Infinity Gauntlet receive unique crafted-product handling.
  Manual sale/discard execute without secondary confirmation. “拆解重炼” selects
  the item in the EXISTING forge; normal ignition consumes it for the existing
  fee/result, not a new material-return economy. Bulk sale excludes both; locked,
  equipped, loadout-protected and pending-reforge protections remain. Description
  explicitly warns that loss cannot enable another craft; permanent ledger stays.
- Existing gem source whitelists, probabilities, one-held rule and lost-gem
  reacquisition remain unchanged, including after crafting. No new cutoff.
- New generated five-gem gold Gauntlet artwork is wired through the actual item
  raster adapter at32/48/64. Source master/provenance is outside dist. Cache graph
  now follows dynamic raster registry edges and negatively tests missing assets;
  no unreachable-asset allowlist exception.

## Counts and verification

`tests/v070-equipment-catalog.json` exports the exact matrix: 260 ordinary common
pieces +3 ordinary Ashen cores +60 set parts +14 legendary definitions =337.
Race-neutral legends are the two hidden-recipe products. Raster adapter reports
336 identities; Return Ring retains its existing non-raster presentation, so that
figure is deliberately distinct from the337 equipment definitions.

Passed targeted tests: Infinity manufacturing/state, actual five-race final-win
recipe settlement, actual combat (field/boss/support/multihit/targets/swap/dungeon/
JSON/online-offline), actual App manufacturing including full bag and quota retry,
unique disposal engine + six actual-App action/identity combinations, existing gem
387-pool/3M-judgment/15 real source suite, Return Ring events, equipment raster
adapter, skill-tree active integration, strict337-definition parity audit.
The App tests use simulated DOM + native canvas, not browser/mobile screenshots.
Final integrated verification: npm test exited 0. All 336 non-browser root
suites passed (242 MJS / 94 CJS) out of 337 discovered. Initial inventory was
334/335; the codex fixture omitted the new item's required manufacture ledger.
The fixture was corrected without weakening validSave, rerun successfully, and
an additional second-storage-write failure test passed in normal/full-bag paths.
Independent adversarial audit passed, including automatic-core exclusion.
Final build/cache: 2785 files, 2783 URLs, 8634 dependency edges,
8 byte-mutation and 9 broken-reference probes. Build fingerprint:
`f96c65b1885e8f3f91c4b2574191a2b69bbf8aab3e4e18269738c5847941bd1a`.
See tests/v070-final-verification.json for the evidence inventory.

Actual browser/mobile visual acceptance remains unverified. The official managed
preview was retried in the restored environment and timed out, then stopped.
The existing live-page authentication handoff remains pending. Fake-DOM/native
canvas tests are not substituted for browser acceptance. Owner-only audience and
schema6/save preservation are retained.
