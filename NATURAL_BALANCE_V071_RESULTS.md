# v0.71 natural-balance evidence

## Exact measured runtime

`2bb69fa010a264c1add8ff336f4e1480af9e2924`, flat runtime-JS SHA-256
`9369cd3bfae4d75e5d6828f38f2c83eb3801079c977e994ccb7856651b0f4ca5`.
This is a candidate-runtime receipt, not publication authorization. Detailed
statistics are in `tests/economy/v071-natural-acceptance.json`.

## Results

- **150 no-purchase/no-development onramps:** 30 independent seeds per race,
  30 minutes each, useful naturally dropped gear equipped. First useful gear
  medians20–28 seconds; race-specific P95 about90–115 seconds. Third-drop P95
  about159–215 seconds.147/150 cases had no deaths; dwarf seeds9/16 and Ashen
  seed26 each had one death. No equipment, HP recovery or recipe was granted.
- **15 natural four-hour runs:** three seeds per race, real initial100 gold,
  optional merchant purchases, real skill/talent budgets and finite potions.
  All had zero deaths/rests, reached levels25–28, and used0–17 potions. Every
  case cleared its first full dungeon; the test policy first attempts it at
  level5, so this is not an inferred hard level gate. First clear was about
  12.3–14.6 minutes. Lack of recipe/supply is recorded, not called zero demand.
- **Five natural48-hour endpoints:** all genuinely cleared home A01–A10 and
  reached level100, without starter equipment or fabricated unlocks. Endpoints
  are bundled in `fixtures/natural-progression-v071` with SHA-256 provenance.
- **Story is separate:** the actual earned endpoint saves subsequently
  traversed the complete mainline, earning required foreign-area access through
  real dungeon clears. Scene totals: human35, dwarf37, elf41, goblin34, Ashen35.
  The elf case covers the locked war corridor and peaceful withdrawal too.
- **Fresh online/offline:** all five4-hour full-state comparisons and five
  8-hour absence/4-hour reward caps pass, including world state.
- **Observation is non-mutating:** independent observer-on/off cases have
  identical complete saves, external RNG state and resource ledger.

| Race | Actual level100 time (engine hours) |48h victories | Healing potions | End gold | End materials |
|---|---:|---:|---:|---:|---:|
| Human |33.650|14,720|5|156,147|15,289|
| Dwarf |29.395|17,487|9|198,382|16,561|
| Elf |27.563|18,867|5|214,072|19,333|
| Goblin |30.774|15,579|54|172,135|16,974|
| Ashen |32.984|14,660|4|156,443|15,789|

These endpoint runs had zero deaths/rests under the selected mixed builds.
That supports low-consumption progression, not a claim that all builds, bosses,
optional loot pursuits or undergeared routes are equally easy. No crafting or
reinforcement optimization was attempted. High residual gold alone does not
prove an economic exploit; stronger sinks must not be invented by forcing potions.

## Preserved historical boundary and verified repair

The first earned-state parity attempt failed on a **valid** natural checkpoint:
`worldEvents.nextWarCheckAt === lastSeen`. Online processes the due starting
check plus24 following checks; the offline scheduler's24-check bound skips one.
The recursive diff contains only `worldEvents.rngState`, but this is still a
full-state correctness failure, not an ignorable presentation field.

The original five endpoint fixtures retain this boundary. The human fixture's
online/offline RNG values were1605216752/449670227. No world field was dropped
and no end-of-test flush was used to hide the failing input. The defect was repaired by the scheduler owner and independently closed on
`d8fbc0f621f5db07264247ae850f582047231ed5`:

- All five original, unflushed endpoint saves pass complete4-hour online/offline
  state equality and8-hour absence/4-hour resource caps. No world field is omitted.
- Fresh five-race full-state parity and caps pass again on that exact runtime.
- All five original earned endpoint saves again traverse the complete mainline
  on the repaired runtime, with real foreign unlocks and no grants.
- Five natural4-hour runs were genuinely repeated on the repaired runtime;
  each complete saved state equals its2bb69fa counterpart. Instrumented world
  calls process at most one due deadline, have maximum forward reference gap
  1100ms, and never roll back. The runtime diff is only random-world-events.js.

The online event loop checks world events before each at-most1100ms combat
step; inter-battle wait is1800ms and actual rest300000ms, below the600000ms
world interval. Thus its per-call24/25-check limit and four-hour cutoff are
inactive. This unchanged online-loop invariant plus full-state comparisons
supports carrying the existing balance observations across this isolated repair.
**The150/15/48-hour measurements remain attributed to2bb69fa; they are not
relabeled as full reruns on d8fbc0f.** The repair-specific evidence is stored
separately in `postRepairVerification` and
`/workspace/shared/balance-final-d8fbc0f/`.

The measured natural paths are suitable for user playtesting. This receipt
is not an assertion that every build is optimally balanced, nor publication
or merge authorization.

## Reproduction

```sh
TEST_ENGINE_ROOT=/absolute/candidate node natural-balance-fixture-tests.mjs
node natural-onramp-simulation.mjs --engine-root=/absolute/candidate \
  --hours=.5 --seeds=1,2,3 --shopping=0 --develop=0 --route=field \
  --require-naked=1 --out=/tmp/onramp.json
node natural-onramp-simulation.mjs --engine-root=/absolute/candidate \
  --hours=48 --seeds=1917 --jobs=5 --require-naked=1 \
  --save=/tmp/earned --out=/tmp/natural48h.json
PARITY_ENGINE_ROOT=/absolute/candidate \
PARITY_SAVE_PATTERN=/absolute/fixtures/natural-progression-v071/{race}.json \
node progression-parity-tests.mjs
```

Full transient logs and observations for this receipt are under
`/workspace/shared/balance-final-2bb69fa/`. The earlier90418e2 observations are
kept separately and are not substituted for this runtime's results.
