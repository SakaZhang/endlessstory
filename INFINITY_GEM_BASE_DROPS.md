# Infinity gem base-drop rebalance

## Scope and authoritative sources

Approved base probability change only, based on live v0.65 source commit
`3117c0691986ce14054c8b858ce72eaf57853107`. No Return Ring bonus, legendary
probability, source whitelist, material identity, quantity or quality change is
part of this patch. In particular, the existing 5% boss legendary base and any
7.5% special-affix policy are untouched.

`dist/material-loot-profile.js` is the authoritative shared area/node policy.
Human (`content.js`), Elf (`index.js`), Goblin (`material-pools.js`) and Ashen
(`world.js`) generate their pools from existing creature associations through
`buildMaterialPools`; those associations remain unchanged. Dwarf retains its
serialized catalogue in `dist/dwarf-material-catalog.js`.

- `npm run sync:infinity-gems` syncs only existing Dwarf gem probability tokens
  from the shared policy; all other file bytes, including roll functions, remain
  unchanged.
- `node tools/sync-infinity-gem-probabilities.mjs --check` rejects stale serialized
  rates. This check is part of `npm run test:infinity-gems`, the aggregate test
  entrypoint and `npm run build` (via `prebuild`).
- `npm run build` packages `dist` into content-hashed release assets; it does not
  regenerate or overwrite catalogues from an older source. Do not edit `build`
  as the source of truth.

## Exact rates

For existing eligible source pools in area `a`, where `1 <= a <= 10`:

| Source | Base probability per eligible judgment | A01 → A10 |
| --- | --- | --- |
| Field | `0.0002 * a` | 0.02% → 0.2% |
| Normal dungeon (including its elite) | `0.001 * a` | 0.1% → 1% |
| Boss | `0.02 + 0.03 * (a - 1) / 9` | conceptual curve 2% → 5% |

The formula's A01 boss endpoint does **not** create an A01 boss. Existing boss
locations alone are eligible. Human and Goblin have no A10 boss source, so their
highest existing boss rate is A09's **4.6666667%**, not 5%.

| Race | Field pools | Dungeon pools | Boss pools | Existing boss areas and base rates |
| --- | ---: | ---: | ---: | --- |
| Dwarf | 30 | 40 | 4 | A03 2.6666667%; A06 3.6666667%; A09 4.6666667%; A10 5% |
| Human | 40 | 40 | 3 | A03 2.6666667%; A06 3.6666667%; A09 4.6666667% |
| Elf | 40 | 40 | 4 | A02 2.3333333%; A05 3.3333333%; A08 4.3333333%; A10 5% |
| Goblin | 30 | 40 | 3 | A03 2.6666667%; A06 3.6666667%; A09 4.6666667% |
| Ashen | 30 | 40 | 3 | A04 3%; A07 4%; A10 5% |
| **Total** | **170** | **200** | **17** | **387 existing gem channels** |

These are **per eligible material judgment**, not per hour or necessarily per
battle. With no luck/ring bonus and while not holding that racial gem, the
geometric mean number of independent eligible judgments until a success is
`1/p`: field `5000/a`, normal dungeon `1000/a`, boss
`1/(0.02 + 0.03*(a-1)/9)`. Thus A01/A10 field means are 5,000/500 judgments,
A01/A10 dungeon means are 1,000/100, and A09/A10 boss means are approximately
21.43/20. These are means, not guarantees. No time-to-drop claim is made.

If an encounter performs `m` otherwise eligible judgments at rate `p`, its
chance of at least one success is `1-(1-p)^m`, before accepting and holding the
first gem. Existing encounter reward-round counts are unchanged. Channels and
reward rounds remain independent; the held-one rule prevents later judgments
from awarding a duplicate of the same racial gem. Different races' gems can
coexist. Consuming a gem permits reacquisition. Gems remain quantity 1 and Q3.

Existing source/ownership eligibility is authoritative; only then may occurrence
luck and the separately implemented equipped Return Ring bonus apply. Empty
channels remain empty, unknown sources have no fallback, and summoned units or
units without independent rewards cannot produce materials. Regular, recovery,
special, Goblin innate extra materials, and all non-material reward policies are
unchanged here.

## Verification

`fixtures/infinity-gem-base-before-v065.json` was captured before edits. Its
SHA-256 checks compare the exact JSON representation of every original pool
with only populated gem `hitProbability` removed. This pins source membership,
all non-gem probabilities, channel order, material weights, quantities and
quality distributions; material metadata is independently hashed.

- `infinity-gem-base-tests.mjs`: all 387 pools; 1,548 below/at threshold checks
  with zero and nonzero luck; all 10 areas and three source curves; higher-area
  monotonicity; independent channels; sequential different-monster judgments;
  held-one/reacquisition; distinct-race coexistence; Q3; summon and non-independent
  reward exclusions; no empty-channel eligibility creation.
- Fixed LCG seed `0x65c0ffee`: 100,000 actual-roller judgments at the lowest and
  highest **existing** pool per source kind and race, 3,000,000 total. Ownership
  is reset for each judgment so held-one does not censor the occurrence sample.
  Each of all four channels must fall within `6 * sigma + 3` of its binomial
  expectation. This is not a wall-clock estimate.
- `infinity-gem-settlement-tests.mjs`: 15 positive real-production gem awards
  (five races × field/dungeon/existing boss), online versus persisted offline
  continuation, exact reward receipts/RNG/material inventories, fixed Q3,
  acceptance, held-one and idempotent settlement replay. Each field case uses
  an actual multi-monster encounter with two independent material rounds.
- Existing material profile, racial material contract, Dwarf catalog, Goblin
  material profile, material quality and luck regressions are checked separately.

The pre-change aggregate `npm test` already fails at
`equipment-armor-art-tests.mjs:8` (`36 !== 28`). Do not describe focused passes
as a full-suite green result.
