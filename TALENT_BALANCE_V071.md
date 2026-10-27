# v0.71 talent correctness and opportunity-cost calibration

Base: 9f56c779. No base ATK/HP/armor growth, equipment budgets, race themes, potion strength, lifesteal, or next-basic-slow changes in this branch.

## Policy

- Direct active skill healing, all races: multiplier = `1 + .04*min(p,10) + .4*max(p-10,0)/(20+max(p-10,0))`. 0/1/5/10/20/99 points = 1/1.04/1.20/1.40/1.533333/1.726606. Existing >10 allocations remain legal and unchanged; no hard cap or silent deletion. Apply once in shared effect host, after the skill/set plan and before received-heal multipliers. HoT, potions, lifesteal, equipment recovery and shields excluded. Retired mend alone retains its existing 35%-HP cap; the live tree did not have that cap in v070. Live healing numbers themselves are not globally reduced.
- Resolve: each point reduces **new duration-based negative effects** by 2%, up to 20%; compounds multiplicatively with passive duration reductions. Authored typed DOT keeps at least its 1-second tick; tree DOT uses its resolved tick interval (including 2-second defaults) as floor; non-periodic effects minimum 1 ms. Existing shorter-than-one-tick authored effects are never lengthened. No effect on next-basic-slow, which is a one-action delay rather than a status duration; the UI says so explicitly. No source power/tick coefficient changes.
- Reallocation: <=Lv20 free. Old saves (no `talentBalanceVersion`) have one explicit, selectable free correction; cancel/normalization never consumes it. New characters carry version1. The first correction confirmation consumes that entitlement, with the UI asking players to select their entire desired correction at once. Nothing automatically resets old points/items. Later refunds consume existing credits/fruits and buy any shortfall at 20 gold/point (the previous 200/10 fruit price), eliminating the random-merchant bottleneck. Existing credit balances remain valuable and unused balances persist. Busy/unfinished encounters block both spend and refund.
- Human crit recommendation swaps opening for already-learned expose, giving decisive its armor-break prerequisite without new points or changing mechanics.

## Why 4%, not 2%

Early low-HP characters should retain the option to invest in HP for both survival and percent-based recovery. 2% direct-heal scaling remained dominated by HP too far into gear progression. At 4%, early low-HP/HoT-heavy builds can still prefer HP; geared direct-heal builds gain a distinct sustained-recovery advantage, sacrificing +200HP per 10-point comparison. This is a tradeoff, not a claim that healing should win every panel.

`talent-balance-v071-tests.mjs` measures actual E.step events for five races and identical cached Q1 equipment at levels10/20/40/100. These panels are controlled generated equipment, **not proof of natural acquisition timing**. It also reuses the repository's synthetic-production natural-progression-v068 earned equipment snapshots at Lv100, changing only the compared talent allocation and the isolated heal loadout; no user save is used. The separate parent/skill-worker pressure suite owns long-duration/potion-economy validation.

## Verification

Passed owner runs:
- talent-balance-v071-tests.mjs: 0/1/5/10/20/99 points × five races × generic/native gear, actual direct-heal scaling, unchanged HoT/shield; 0/1/5/10 real potion and actual fixed-damage lifesteal exclusions; real authored typed DOT per available damage type and passive combination; tree negative kinds/floors; saved99 allocation; old correction/new early/free/fruit/gold/busy transactions.
- talent-balance-ui-tests.cjs and existing talent-ui-tests.cjs: correction selection/cancel/confirmation, exact gold quote/payment, unselected points preserved, reload, all prior fruit-credit paths.
- talent-balance-parity-tests.mjs: five races15-minute online/offline full state equality, healing10+resolve10. This is the first field, not a claim to cover every boss status; typed DOT is separately checked through production E.step and the shared policy/host.
- skill-tree-healing-compat-tests.mjs (updated intentional old-flat assumptions), skill-tree-effect-host-tests.mjs, skill-tree-passive-host-tests.mjs, skill-tree-state-tests.mjs, return-ring-healing-tests.mjs, lifesteal-linear-tests.mjs, authored-slow-settlement-tests.mjs, human-dwarf-parity-tests.mjs.
- talent-tests.mjs including its full 300k forge /60k reforge /60k drop statistical loops: PASS.

New tests have optional `TALENT_REPORT=/path/report.json` for measured calibration output. Tests assert real numbers, not just stat labels; removing the shared multiplier or reverting the typed-DOT duration path fails them. This branch does not represent a final integrated balance sign-off or deployment.

## Integration

`engine.fresh()` only adds `talentBalanceVersion:1`; retain it when merging no-starter-equipment changes. New module `dist/talent-policy.js` must be included in release packaging. No save-schema bump: absent marker is intentionally accepted for old-save correction. `healingBonus` is now a display percent (not flat points); planners no longer consume it. `resolveReduction` now reports a fraction; live duration consumers use the policy directly. No other owner should restore old flat consumers.
