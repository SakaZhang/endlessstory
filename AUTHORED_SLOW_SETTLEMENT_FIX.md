# Authored next-basic slowdown settlement correction

Base: live v0.66 `ddfcc1993a38574a2631916519d94e861c674b9f`. This is a separate correctness change after the Return Ring 15%-max-HP balance adjustment.

## Reproduction and impact

Human A03 boss 裂钟司祭 · 赫伦 has an authored `next_basic_slow` multiplier of **1.2**. The regular player action interval is 1100ms, so its next basic hit is delayed by `round(1100 * (1.2 - 1)) = 220ms`. The unchanged live combat runtime already produced this delay. The old save validator, however, accepted only `nextBasicSlow === 1.15` and `pendingBasicDelayMs/basicMicroElapsed === 165`.

A generated, real-combat fixture (seed68) on untouched v0.66 won with `basicMicroElapsed:220`, but both encounter/save validation failed and `reward()` refused all settlement before the Ring hook. Replacing only that marker with165 restored validation on the same diagnostic snapshot, confirming the mismatch. Intermediate next-slow/pending states were also incorrectly rejected. This was not caused by the Ring balance change.

## Narrow fix

`multi-combat.js` derives the exact permitted multipliers and rounded delays from the current authored monster effects. The current catalog contains1.15/165ms and1.2/220ms. Validation and scheduling use the same rounded-delay helper; arbitrary fractional/overflow/unsupported values remain invalid, as do uncoupled pending timers and out-of-order deadlines.

`basicMicroElapsed` is a completed micro-event duration, not an incrementing progress counter. It therefore accepts only an exact authored duration, not an arbitrary0–220 range. The next regular action consumes this elapsed duration once (220+880ms), and the field is then removed. There is no schema/generation change or old-save migration.

Player cadence, enemy cadence, skill cooldowns, authored slow strength, loot/source probabilities, luck and potion rules are unchanged. The ordinary reward pipeline now accepts legitimate20% slow states; Ring healing remains15% of maximum HP and its rare-drop bonus remains+3 percentage points.

## Verification

`npm run test:authored-slows` runs:
- Actual Human A03 boss with all next-slow/pending/completed micro states validated, saved and reloaded; multiple real slow applications, pause/resume, and removal of stale elapsed duration.
- Real delayed-basic terminal wins and exactly-once normal/Ring settlement;100 seeded full boss combats checked at every step, with equal online/offline HP, gold, XP, items/materials and cooldown outcomes.
- Unsupported multipliers, noninteger/negative/overflow durations, forged clocks, missing pending pair and wrong event ordering rejected.
- Existing15%/165ms lifecycle suite, including late browser polls and pause shifts, unchanged.

Focused Ring/NPC/App, story-ring, and Infinity gem tests are also run. The aggregate `npm test` still stops at the known pre-existing armor art assertion `36 !== 28`; it is not reported as all-green. Native browser launch remains unavailable; no browser retries or pixel-proof claim are included.
