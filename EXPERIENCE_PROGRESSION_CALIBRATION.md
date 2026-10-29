# Experience progression calibration

## Scope and assumptions
Newly created monster rewards only. No retroactive XP conversion, level requirement/cap change, gear rescaling, monster threat, gold or drop change. Normal XP A1–A10: 6/28/38/48/58/68/78/88/98/108. Elite: max(old XP, normal ×4); boss: max(old XP, normal ×12). A1 elite/boss keep 55/208. Dungeon clear bonus remains 32–104.

Level L requires 80L XP; cumulative L→100 = 40×[9900−L(L−1)]. This is independent of story.

## Measured controlled field combat
Five races ×20 deterministic seeds per row, Q0 same-level owned gear without affixes/enhancement, basic single-target/AOE/heal skills and modest earned-budget talents; Lv1 is naked. This is a controlled acquired-loadout experiment, NOT a naturally earned full progression save. Gear/area are changed between rows, not during a row. Every row won 100/100 without potions; cycle includes the real 1.8s inter-battle delay. Field group rewards use ×2 regardless of two/three visible enemies; sampled group frequency was 6%. All combat/XP rates exclude Return Ring and knowledge.

Areas use actual ranges: A1=1–10, A2=11–20, … A10=91–100. Therefore Lv10 is A1 and Lv90 is A9 in this table.

|Level|Area|Cycle sec|Old XP/h|New XP/h|XP next|Old min/level|New min/level|Remaining XP to100|
|---:|---:|---:|---:|---:|---:|---:|---:|---:|
|1|1|7.55|2021|3031|80|2.38|1.58|396000|
|10|1|3.11|4910|7364|800|9.78|6.52|392400|
|30|3|12.62|7255|11487|2400|19.85|12.54|361200|
|50|5|14.58|8374|15178|4000|28.66|15.81|298000|
|70|7|15.66|9747|19007|5600|34.47|17.68|202800|
|90|9|16.3|11239|22946|7200|38.44|18.83|75600|
|99|10|17.06|11633|24162|7920|40.85|19.67|7920|

The gradual target is approximately 2 minutes initially, 6–13 minutes early/midgame, then 16–20 minutes per level for this basic sustainable control build. Better/worse builds and entering a new area alter this. Summed full-game playtime is not claimed as a naturally simulated result.

A separate controlled Lv90 entering A10 one level below its displayed range measured 19.42s/cycle, old 10,217 versus new 21,220 XP/hour. Holding this rate fixed makes the remaining 75,600 XP about 7.4h old versus 3.56h new (not a full dynamic simulation).

## Actual offline integration
A valid controlled dwarf Lv90 save with level90 Q0 gear, same three base skills, no potion consumption or ring was replayed for 4h in A10, without equipping drops or supplying resources. Result: Lv100, 75,600 accepted XP, 899 wins, zero rest stops, 11,619 actual turns. Overflow after the cap was ignored as before. An identical seeded 8h elapsed replay produced the same XP/kills/level: only 4h is rewarded. This proves this build's actual final ten-level segment fits in one full offline window; it does not claim every race/build or an entire natural Lv1→100 route does.

## Compatibility and settlement
Stored encounter rewardXp and clearRewards remain untouched. New next-stage monsters use the new table. Group ×2, knowledge 5% ×2 on base XP only, clear XP added once, then equipped Return Ring ×1.2 floored once through applyExperience. Forced knowledge+ring tests cover all three dungeon stages, including clear bonus. Repeated rewards remain idempotent. Existing level100 and overcap saves retain prior handling.

Parameter-contract fixtures preserve every before field and alter only after.rewardXp; their assertions explicitly retain HP/armor/cadence/gold/skill/source protection, nonboss ATK unchanged, boss ATK/elementalPower ×2. Dungeon damage tests still require normal ×6 / elite ×3 and unchanged HP.

## Validation
Passed: experience-progression-tests, monster-balance-tests, boss-growth-parameter-tests, dungeon-damage-tests, return-ring-experience-tests, old-active-balance-compat-tests, character-progression-tests. Full aggregate is reserved for parent after source freeze.

Reproduce: node experience-progression-audit.mjs; node experience-challenge-audit.mjs; node experience-progression-tests.mjs. Raw evidence: qa/experience-progression/.

## Challenge cross-check
One deterministic no-potion control run per case (15 three-stage dungeon runs across five races at A1/A5/A10, plus all 17 enabled bosses) won all cases. A10 dungeon nominal XP is 108+108+432+104=752, combat+stage delays 50.5–59.3s, plus unchanged 300s cooldown: about 7,535–7,724 nominal XP/h if waiting through cooldown. Enabled A10 bosses pay nominal 1,296 XP in 28.2–42.5s plus 1,800s cooldown, about 2,532–2,552 nominal XP/h. These Lv100 runs measure nominal rewards; actual accepted XP at the cap is zero. A5 dungeon is 412 XP/run, 43.9–58.2s plus cooldown; A1 is 99 XP/run. Challenge-only cooldown farming does not replace sustained field XP; auto-routing back to field during cooldown adds the appropriate field rewards instead. HP/attack and reward sources were not edited for this XP work.
