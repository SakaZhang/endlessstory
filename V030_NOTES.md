# v0.30 — live ordinary and special affix expansion

This release enables the new affixes in ordinary production equipment generation, free fusion, full reforge, donor inheritance, normal single-enemy combat and offline combat. The existing multi-enemy developer adapter uses the same effect definitions. It does not enable new monster locations or legendary drops.

- Ordinary pool: 20 identities. Lifesteal rating 3–8 and luck rating 1–3; flat ratings, not item percentage affixes. Divine applies once to their raw values.
- Seven special identities: knowledge, scavenger, shelter (renamed 护佑), momentum, nirvana, multicast, reaper. Random generation uses the actual enabled pool length. Identical special IDs are boolean, never additive.
- 护佑: each new encounter/sub-battle refreshes its own shield to floor(15% maximum HP) plus the existing shield talent bonus. Skill barrier, cooldowns and normal carried statuses remain independent. Reload/resume/revival does not recreate the opening shield. Already-running legacy encounters do not receive a free new shield on load.
- 涅槃: one full-HP revival per encounter/sub-battle, without resetting cooldowns, shields or counters. All lethal sources use this rule. Revival occurs before an otherwise retained player guard reaction in both adapters.
- 死神: 2% per eligible landed hit/target, including bosses; dead targets do not receive another roll. Execute is not damage and does not grant lifesteal. Current 14 skills have no new multi-hit coefficients added; hit identity interfaces support independently processed segments.
- 多重施法: 15% after an original active skill, one real extra cast, no recursive proc and no extra cooldown. Appropriate active-cast counters increase. Live target is reselected when needed; no cast or free buff after all targets die.
- Lifesteal initial tuning: `0.12*r/(100+r)`, actual direct basic/active HP damage, maximum 8% max HP per cast and missing-HP bound. Shields and execute amounts are excluded; dead players cannot be healed by it. This is provisional balancing, not a claim of settled potion economy.
- Luck uses equipped ratings plus talent through `effectiveLuck` for combat snapshots, offline snapshots, fusion and value rerolls. Finite snapshot range 0–1000 accepts divine fractions. Transaction saves also refresh the snapshot. The pure interface supports an effective timed potion contribution, but the live game still has only its three existing potion types: no luck-potion source is falsely enabled.
- Replacement rule4 now permits the selected affix type, excludes types in other retained slots, and inherits the donor raw value. Changing the selected slot invalidates the donor selection. Already-paid rules2/3 preserve their historical candidates and validation.
- Visible v0.30 in header/footer and help summary; entry module URL versioned. No service worker exists. Owner-private publishing remains unchanged.

## Verification

Production single/multi effect tests, seven-way forced generation and reforge, actual-app UI, per-stage lifecycle, same-type replacement and old paid candidate tests. Seeded actual four-hour online/offline comparison: 7,053 rounds / 3,690 kills, equal HP/XP/gold/materials/cooldowns/casts and valid saves; this strong build had no deaths, so revival additionally uses forced lethal fixtures. Full npm and all CJS mocks are release-gated separately. Browser visual testing is unavailable; no browser pass is claimed.

No v0.31 divine-on-reforge or external legendary-fusion foundation is included here.
