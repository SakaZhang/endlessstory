# Natural balance QA tools (candidate, not balance approval)

No runtime tuning is included in this change. `natural-onramp-simulation.mjs`
uses actual fresh saves and real reward, merchant, skill/talent, equipment,
sale and potion-crafting transactions. It never supplies equipment, XP, gold,
materials, recipe unlocks or free healing. Initial resources remain whatever
`fresh` supplies; `--require-naked=1` asserts no starter equipment.

Each race/seed is spawned in a separate process. External randomness is
xorshift32 with a mixed seed, not the encounter's LCG. Runtime JS SHA-256 and
Git revision/dirty status are recorded per case; do not combine changing
candidate versions into release acceptance.

## Policies

- Useful dropped gear is inspected immediately after field encounters or an
  entire dungeon run; skill/talent/shop reviews occur at safe boundaries,
  every 2 minutes in the first 30 minutes, then every 15 minutes.
- No health refill accompanies a review or equipping higher-max-HP items.
  Actual 5-minute death/rest time is charged. The policy pauses between fights,
  not mid-encounter or mid-dungeon, using the production transaction APIs.
- `--shopping=1` allows the existing initial100 gold to buy real offered gear
  and a healing recipe only when offered. It never pays to refresh. The early
  gear purchase ceiling is80% of remaining gold; later25%. This is a test
  heuristic, not a runtime rule. `--shopping=0` is the pure-drop comparison.
- `--develop=0` disables skill/talent spending. With development on, balanced
  uses a2 power/1 heart/1 steel talent cycle and legal authored skill purchases;
  support saves points for its first root heal; defense has a different talent
  and equipment heuristic. These are not optimized or exhaustive builds.
- Default cautious route attempts the level-appropriate unlocked dungeon at
  area minimum+4. `--route=field` forbids dungeon attempts. `--dungeon-level`
  changes this test policy, not access gates. Complete three-stage run receipts
  distinguish a first-room win from a full clear.

## Examples

```sh
node natural-onramp-tests.mjs
node natural-onramp-simulation.mjs --hours=.5 --seeds=1917,8675309,739 \
  --require-naked=1 --out=/tmp/onramp-shopping.json
node natural-onramp-simulation.mjs --hours=.5 --shopping=0 --develop=0 \
  --route=field --require-naked=1 --out=/tmp/onramp-field.json
node natural-onramp-summarize.mjs /tmp/onramp-shopping.json /tmp/onramp-field.json
# Load a candidate without copying runtime files into this tool checkout:
TEST_ENGINE_ROOT=/absolute/candidate node natural-onramp-tests.mjs
node natural-onramp-simulation.mjs --engine-root=/absolute/candidate --hours=4 \
  --out=/tmp/natural4h.json
PARITY_ENGINE_ROOT=/absolute/candidate node progression-parity-tests.mjs
```

The old `progression-economy-simulation.mjs` now supports empty sockets and
`--engine-root`. Its older4-hour check-in/camp-rest policy is deliberately
retained for policy comparison; it is not a new-player onramp model. Its external
RNG is now independent xorshift32, so old LCG evidence cannot be reproduced
bit-for-bit without checking out the original producer revision.
`progression-parity-tests.mjs` now accepts `PARITY_ENGINE_ROOT` and
`PARITY_SEED`, with independent xorshift external RNG. It compares complete
online/offline state (excluding descriptive chronicle) and the8h absence cap.

## Acceptance reporting

Report first fight time/net HP loss, observer-recorded gross HP damage/effective healing, first naturally received and first
useful equipped gear (including purchases), first three drops, complete first
clear, unsuccessful attempts, actual rest fraction, recipe availability,
owned/crafted/consumed potions, and reconciled gold. Report missed milestones
as censored, not zero. A low potion count without a recipe is supply-censored.
No technical pass certifies all builds, human playtime, or a fixed potion band.

For earned-save parity, set `PARITY_SAVE_PATTERN=/path/save-{race}-1917.json`.
The save's own clock and world state are preserved, and both modes start from
identical serialized input. No levels, equipment or unlocks are added.
