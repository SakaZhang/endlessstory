# Natural progression and economy verification (v0.69 preparation)

## Scope and verdict

Base: exact published v0.68 `a5a77d4b888b998d7fb54349d258fb639d2ef11f`.
This is production-engine QA, not human playtesting. No runtime coefficients,
XP curve, prices, equipment budgets, access gates or save generation changed.
The original “about one week” target means a first-run play experience, not a
shipping deadline. Level 100 / area 10 do **not** independently prove story clear.

## Reproducible tools

- `progression-economy-simulation.mjs`: genuine fresh saves; actual combat,
  rewards, level gains, dungeon clears, gear purchases/equipping, sales, skill
  transactions, recovery-material consumption and healing potion use.
- `natural-area-access.mjs`: earns foreign area access through ordinary dungeon
  clears. Optional `engine` parameter permits the integrated release engine.
  Never edits unlock flags; returns a reason when war or admission blocks travel.
- `progression-parity-tests.mjs`: separate online/offline processes, identical
  seed, four hours of actual fresh field combat, complete final state comparison
  including active combat, inventory and world clocks/diplomacy. Only descriptive
  `chronicle` differs by mode and is excluded. A seeded war actually occurs.
- `natural-field-supply-probe.mjs`: a four-hour **field-only** follow-on from an
  actually earned save. Pays for up to ten merchant refreshes, learns the real
  healing recipe if offered, consumes owned recovery materials to stock at most
  300 potions. Does not grant anything.
- `economy-boundary-audit.mjs`: exact equipment base-budget and bought-material
  forge/resale expectation checks; explicitly not a progression simulation.
- `progression-economy-summarize.mjs`: summarizes the saved observations.

### Policies and seeds

LCG seeds: `1917`, `8675309`; supply probe seed `739`. Character starts level 1
with only `fresh(race)` resources. Four-hour check-ins add a real five-minute
camp rest. At each check-in the agent spends earned talents in a repeating
2 power / 1 heart / 1 steel ratio; unlocks the first authored skill branch plus
available root healing/support; equips four actives and two passives. It scores
owned gear by `ATK + HP/15 + .65*armor`, with small hit/crit/lifesteal bonuses,
not by a combat optimizer. It sells unused ordinary gear through batch-sale
transactions; buys >15% score upgrades only below 25% held gold; buys the healing
recipe only when actually offered; crafts up to 200 healing potions from owned
materials at camp. No paid refreshes in the main simulation, no legendary or Q3
grants, no free recipe, no XP/area grants, no forge generation, no story rewards,
no offline crafting. Thus this is a reproducible conservative equipment policy,
not the best possible player or every viable build.

The initial stress policy attempts the level-appropriate unlocked dungeon first,
then farms the real cooldown fallback field. The cautious policy farms the field
until the area's minimum level +4, then attempts the dungeon. Thirty-minute
check-ins measure policy sensitivity, not a different balance configuration.

**RNG isolation:** equipment template selection hashes generated IDs, including
module-local serials. Default multi-case execution now isolates each race/seed
in a new process. The initial 48-hour baseline deliberately preserves its
original ordered shared-serial experiment via `--single=1` (races in
human,dwarf,elf,goblin,ashen order). Do not compare a later race's starting gear
from that experiment with a single-race invocation as if identical.

## Commands and evidence

Run from this repository; evidence under ignored `qa/progression-economy/`.

```sh
mkdir -p qa/progression-economy
# Original ordered stress runs; these exact flags reproduce their RNG context.
node progression-economy-simulation.mjs --single=1 --hours=48 --seeds=1917 \
  --save=/tmp/natural48 --out=qa/progression-economy/natural48.json
node progression-economy-simulation.mjs --single=1 --hours=48 --seeds=8675309 \
  --out=qa/progression-economy/natural48-seed2.json
# Isolated policy-sensitivity and cautious runs.
node progression-economy-simulation.mjs --hours=4 --interval=.5 \
  --seeds=1917,8675309 --out=qa/progression-economy/isolated-frequent4.json
node progression-economy-simulation.mjs --route=cautious --hours=48 --seeds=1917 \
  --save=/tmp/cautious48 --out=qa/progression-economy/cautious48.json
node progression-parity-tests.mjs
node economy-boundary-audit.mjs qa/progression-economy/boundary.json
node natural-field-supply-probe.mjs /tmp/natural48-dwarf-1917.json \
  qa/progression-economy/field-dwarf.json
node progression-economy-summarize.mjs qa/progression-economy/natural48.json \
  qa/progression-economy/natural48-seed2.json
```

## Measured baseline results

All ten ordered dungeon-first runs completed 48 simulated expedition hours, with
12 real five-minute camp rests additionally charged. Reported level-100 times
are four-hour-checkpoint upper bounds, not exact level-up timestamps; expedition
time includes in-engine death/rest/cooldown time. Every race/seed reached
level 100 and genuinely cleared its own A01–A10.

| Race | Level 100 by simulated hours (two seeds) | Four-hour mixed-route potion use | Gold after 48h | Median positive gear-held levels |
|---|---:|---:|---:|---:|
| Human | 40 / 40 | 0 | 123,068–129,882 | 9 / 9 |
| Dwarf | 36 / 36 | 0–143 | 146,168–148,236 | 10 / 11 |
| Elf | 32 / 32 | 0 | 209,409–221,484 | 9 / 11 |
| Goblin | 44 / 44 | 0–68 | 115,516–115,955 | 10 / 9 |
| Ashen | 40 / 36 | 0–52 | 128,029–134,722 | 9 / 9 |

Crafted healing supplies range 0–413 bottles per run, costing 0–1,345 gold;
remaining materials exceed 11,000 in all final baseline saves. Coin cost was not a late-game potion bottleneck. One human run
never saw the recipe at its twelve check-ins: its zero consumption is not a
supply-demand estimate. Other runs with owned healing supplies also used zero
for long stretches because of healing/lifesteal and chosen equipment.

Observed Q3 held-level medians are 8–10, with individual intervals 1–21. The
simple scoring/check-in sample therefore does **not certify** a universal
10–15-level practical retention goal or 10–20-level replacement interval.
Comparisons must separate replacement by another Q3 from replacement by common
gear, and account for omitted build-specific affix utility. No budget change was
made to force those observations into the target interval.

At an assumed two four-hour sessions/day, the measured 32–44 expedition hours to
level 100 translate to 4–5.5 calendar days **before** story/navigation/decision
time. At a different login cadence the calendar outcome differs. This is a
scenario calculation consistent with investigating a roughly one-week first
run, not evidence that real players finish in a week.

**Pass:** natural home-area access for all ten cases; real finite resource
transactions; five-race four-hour full-state online/offline parity (including
world clocks); five-race eight-hour absence capped to equivalent four-hour
combat outcomes; bounded luck/source and reward-replay tests.

**Not certified:** human playtime; all possible builds; strict potion-demand
band; universal equipment lifetime; natural-level personal-arc pacing. Final
story acceptance is separately checked on the integrated release, below.

### Isolated cautious policy sensitivity

The completed field-first run (seed 1917, one fresh process per race) also clears
all ten own areas for all five races within 48 expedition hours. Level 100 occurs
at human 40h, dwarf 32h, elf 32h, goblin 40h, Ashen 36h. Four-hour mixed-route
potion maxima are respectively 0 / 59 / 0 / 81 / 0; some zero-use runs lack a
recipe and are supply-censored. These results are a policy sensitivity check,
not a tuned second build. Combined with the two-seed half-hour checks they
support startup guidance rather than a racial-stat change.

Machine-readable measured summaries are committed at
`tests/economy/v068-measurements.json`. Full intermediate logs and evolved saves
remain in the QA workspace and can be regenerated with the commands above.

## Interpretation and actionable findings

### Early difficulty is route/check-in sensitive, not evidence for a racial XP buff

At A01 the dwarf/goblin/Ashen dungeon elite has HP 2000, ATK 48, elemental power
14 and XP 55. Human's has HP 1287, ATK 5, elemental power 2 and XP 26; elf's has
HP 1140, ATK 4, elemental power 6 and XP 40. Ordinary human and dwarf enemy #1
both have HP 600, ATK 3, XP 16. The common XP curve is unchanged.

Blindly repeating the dungeon immediately at level 1 can spend most of the first
four hours resting before any new talents, skills or drops are applied. This
is not representative of field-first play. An isolated fresh four-hour field run
reaches dwarf level 22 with 1,213 wins. Thirty-minute check-ins (two isolated
seeds, still dungeon-first) reach human 25–26, dwarf 23, elf 29–30, goblin 17–20,
Ashen 22–23. This sharply reduces the initial dwarf/human difference.

No hard gate is proposed or implemented. Truthful dungeon threat information or
field-first guidance may be useful; a blanket racial buff is not justified by
these samples.

### Potion target requires comparable builds, gear, route and available supply

The 40–80 healing potions / four-hour **field** target is not a universal lower
bound. Healing skills, lifesteal and overgearing can legitimately reduce demand.
Mixed dungeon/cooldown-field observations are labeled as such and are not used
as field-target acceptance. A zero-use run without a known recipe or available
potions is supply-censored, not evidence of zero demand. Field probes separately
record recipe acquisition, paid supply cost, actual gear, skills and lifesteal.

The five earned A10 endpoint field probes each started with 300 legitimately
crafted potions and consumed **zero** in four hours, with zero rests and
1,153–1,525 victories. Actual lifesteal rates were 0.6–3.0%; human/elf also used
healing skills, while dwarf/goblin used damage-oriented active slots. Gear was
ordinary Q0–Q3 at levels 86–97, not granted legendary equipment. Stock-up cost
was 400 gold for four runs and 1,517 for the human run including eight paid shop
refreshes. These are sustainable endpoint loadouts, not equivalent non-healing
control builds; low potion demand is expected for some of them. Therefore the
40–80 target remains **not established**, rather than a justification to nerf
healing or impose a minimum potion drain. A reviewed non-healing, matched-power
control matrix would be needed before proposing pressure changes.

The healing recipe is a random merchant offer (45 base gold, 41 for human), not
a guaranteed starter unlock or ordinary drop. Recovery materials alone cannot
be consumed as healing potions. Skipping shop visits or missing offers can leave
large recovery stocks unusable. The test never silently learns the recipe.

### Equipment retention is a distribution, not a timer

3,920 exact base-budget cases cover 35 registered variants, eight item families
(including Ashen core), levels 1/10/20/30/50/80/100, Q0–Q3 and enhancement
0/1/3/5. At equal enhancement and variant, Q3 base budget exactly matches Q0
14 levels later, Q1 11 levels later, or Q2 7 levels later (including rounded raw
base stats). This supports a base-budget advantage, **not** guaranteed practical
10–15-level retention against any random higher-level item.

Observed replacement intervals are constrained by when the agent checks its
bag. Same-camp immediate replacements and zero-level-duration changes are
excluded from held-level summaries; no arbitrary hard expiry is inferred.
Ordinary-affix utility, set/weapon synergy and the level-100 base-budget cap
remain important limitations of a simple scoring agent.

### Currency, repeated rewards and material costs

500 bought-material forge/resale expectation cases (five races, levels
1/20/50/80/100, homogeneous quality Q0–Q3, batch size 1–5, maximal legal luck,
full dwarf favorable reroll) all have negative expected return. Smallest expected
loss: **2.267 gold**; largest: **94.228 gold**. Herb potion conversion has no sale
path and is ignored to conservatively overestimate resale income. This does not
prove all mixed equipment/material paths or legacy levels above 100. A lucky
Q3 sale exceeding just the forge fee is not a riskless loop: input materials
were consumed and have acquisition cost.

Actual merchant equipment offers exceed resale prices; paid purchases charge
real gold. Batch sales cannot replay. Real battle settlement replay leaves the
whole state unchanged. Normal dungeon farming is intentionally repeatable with
time/cooldown cost; it is not a zero-time rewarded loop. Recipe and task reward
transaction tests cover exact input costs, stale/tampered quotes, full bags,
pending claims and idempotency. Rare/gem/luck checks cover eligible sources,
held-one restrictions and online/offline settlement, not just probability text.

## Integration handoff

Earned QA saves under `/tmp/natural48-<race>-1917.json` are synthetic simulations,
not user saves. They contain naturally earned level/gear/gold/materials and own
area clears but no fabricated story flags. Finale reviewers must traverse the
actual story and earn foreign area access using `earnAreaAccess`, respecting
war locks. C09–10/finale acceptance belongs to the final integrated commit;
this v0.68 baseline alone cannot certify unreleased scenes.

### Integrated story evidence (independent reviewer)

On integration `218153f`, the independent story reviewer traversed actual
C01→END for all five earned endpoint saves. Foreign-area access was earned
through the helper (72 actual victories, about 126–128 simulated minutes per
route before traversal), not pre-unlocked. All five passed. Reviewer evidence:
`/tmp/review-natural-integration.log`; resulting synthetic saves
`/tmp/review-natural-ended-{race}.json`. This establishes reachability and an
ordinary-earned endpoint combat budget, not low-level scene pacing or optional
arc/story-choice timing. The integrated engine was subsequently rechecked as described below.

### Focused regression commands passed

```sh
node racial-economy-tests.mjs
node merchant-tests.mjs
node transaction-tests.mjs
node recipe-tests.mjs
node recipe-batch-limits-tests.mjs
node potion-forge-tests.mjs
node equipment-fusion-tests.mjs
node material-forge-variance-tests.mjs
node task-reward-transaction-tests.mjs
node task-reward-engine-integration-tests.mjs
node luck-policy-tests.mjs
node luck-production-tests.mjs
node infinity-gem-settlement-tests.mjs
node return-ring-drop-tests.mjs
node random-war-world-tests.mjs
```

No full historical aggregate-suite pass or browser acceptance is claimed here.

### Integrated-engine rerun

Detached exact integration `15fa03d` passes all-five-race four-hour full-state
parity again, plus the eight focused racial economy, production luck, batch
recipe, reward transaction, actual gem, Return Ring, forge-variance and world
clock regression suites. No combat/XP/equipment coefficient files differ from
the baseline. The additional automated eight-hour-cap checks are included in
`progression-parity-tests.mjs`; final execution receipt is recorded below.

Receipt: intermediate integration `09fb5d0` passed all five full-state 4h
online/offline comparisons **and** all five automated 8h-absence/4h-reward-cap
checks. The 500 expected-currency cases, 3,920 budget cases and eight focused
contracts passed there too; it accepts all five genuine earned baseline saves.
This is explicitly an intermediate receipt, not approval of a newer release
head. Stable integration `27c65a3` and later story-entry repairs require the
separate final receipt requested by the release owner.

### Reusable synthetic endpoint fixtures

The five baseline earned saves are now bundled outside runtime assets at
`fixtures/natural-progression-v068/{human,dwarf,elf,goblin,ashen}.json`.
`provenance.json` records their SHA-256 hashes, byte sizes, exact baseline and
producer commits, Node version, seed, clock origin, ordered shared-serial
contract and regeneration command. They contain **no user data**, no completed
story and no granted foreign-area access. Run
`node natural-progression-fixture-tests.mjs` to verify hashes and compatibility.
Story QA can read these source fixtures instead of depending on `/tmp` paths.
The nondeterministically produced just-in-time war-block snapshot is deliberately
not bundled into this deterministic producer fixture set.

## Final runtime receipt — 254ca2b

Exact source `254ca2b3a810fd5707dc046eb08674631f485e3f`, including the private
registered story-corridor/JIT-war repair, passed:

- All five actual 4h online/offline full-state comparisons, including world
  events, diplomacy, inventory, resources and active encounter state.
- All five 8h-absence probes: exactly the same earned resources as 4h, with
  `lastSeen` correctly advanced to 8h. Expiry/rest clocks are not incorrectly
  required to equal the 4h return clock.
- All five bundled earned-save SHA-256/current-schema compatibility checks.
- 500 expected bought-material forge/resale cases and 3,920 base-budget cases.
- The eight focused racial-economy, production-luck, recipe-batch, task-reward,
  actual-gem-settlement, Return-Ring-drop, material-forge-variance and random-war
  regression suites.

Reproduction on that checkout:
`node progression-parity-tests.mjs`, `node natural-progression-fixture-tests.mjs`,
`node economy-boundary-audit.mjs`, and the eight named focused scripts above.
QA logs are `/tmp/economy-254ca2b-{human,dwarf,elf,goblin,ashen}.log`,
`/tmp/economy-254ca2b-contracts.log` and
`/tmp/economy-254ca2b-boundary.log`.
No balance coefficients, ordinary access gates, prices or rewards were changed
by this verification branch. The measured-policy and human-playtime limitations
in this report remain; a technical pass does not turn them into balance claims.
