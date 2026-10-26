# Material-only equipment level variance

Based on v0.63 Sites72 / `752cdf4578ee9af95e1531cefd53aeee352d132f`.

- Material-only equipment uses the existing shared integer ±2 level roll, baseline = current hero level, minimum 1. Equipment-input fusion keeps its highest preserved input baseline.
- At hero level 100 the output range is 98–102. Existing equipment-budget adaptation still caps numerical budgets at 100 while preserving level/source metadata; this patch does not change that policy or character leveling.
- Potions return before this level draw. No quality, racial, legendary-floor, hidden-recipe, material-consumption, cost, inventory, save-schema, migration or reset policy changes.
- The item factory receives the rolled level; provenance retains the baseline. Existing equip rules have no level requirement. Fusion rule copy now describes the material variance.

## Deterministic RNG and statistical validation

One new independent draw is required for material equipment. It follows origin/slot/quality selection and precedes item generation. Later draws and later forge calls therefore change their seeded categorical traces; the four exact material-trace SHA fixtures are refreshed, not the probability tables. Equipment-input and successful potion paths add no draw.

The old talent assertion required a single 20,000-result luck5 sample to exceed luck0. With seed17653, baseline mean qualities were 0.71005 / 0.71725 / 0.72020 at luck0/5/10; the new independent level draw gives 0.71065 / 0.71010 / 0.71200. An independent analytic oracle uses weights `[46,42,10.6,1.4]`, dwarf favorable chance `.08`, luck chances `0/.03/.04`, combined as `1-(1-.08)*(1-luck)`, and best-of-two CDF `F²`.

Expected means are 0.70342432 / 0.7135757104 / 0.7169595072, with 20,000-sample SE approximately 0.005128 / 0.005143 / 0.005148. The old strict sample ordering is not statistically reliable for the approximately 0.01015 mean improvement.

Paired production runs use seeds 17653, 613, 92171, 312042, 79421 at all three luck levels, 20,000 outcomes each (300,000 per revision):

| Revision | Pooled luck0 | Pooled luck5 | Pooled luck10 | Largest absolute single-sample mean z |
|---|---:|---:|---:|---:|
| Original baseline | .70443 | .71221 | .71677 | 1.582 |
| Material variance | .70581 | .71272 | .71553 | 1.611 |

The narrowly corrected talent test retains all original seed coverage and checks each seed and pooled sample against independent expected mean and per-quality probabilities within 4 standard errors. It retains pooled observed improvement assertions and adds exact expected monotonicity. Negative-control distributions (actual zero-luck counts treated as luck10, and reversed quality counts) must fail the same distribution checker. No gameplay probability code is edited.

`material-forge-variance-tests.mjs` covers deterministic range endpoints and all bins, integer levels, 1/100 boundaries, existing budget cap, actual raw stats, hero/base provenance, saved/reloaded identity, no equip-level restriction, equipment-only/mixed input baselines and potion branch draw count. Existing forge and provenance tests now assert the intended variance rather than exact hero level.
