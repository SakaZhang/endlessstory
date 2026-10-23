# v0.37 — 祖炉眷顾

A constant dwarf racial trait, not a skill node, passive slot or loadout option. First tuning approved by root after `/workspace/shared/dwarf-forge-favor-balance/REPORT.md`; not a global-balance claim.

## Live operation scope
- Random fusion quality and newly generated ordinary affix values; value wash and full-reforge ordinary values: merge the existing luck best-of-two opportunity with 8% racial opportunity as `1-(1-L)*(1-.08)`. Exactly one opportunity check and at most one extra draw, never a third roll. Zero-luck dwarves still benefit.
- Fusion fresh special occurrence and fusion/full-reforge fresh divine occurrence: their existing luck-adjusted chance times 1.10, once, clamped to one. Source/quality eligibility remains unchanged. Existing divine is not rerolled or stacked. Guaranteed full-reforge special remains one, with no additional roll/count.
- Donor ordinary trait choice: weight `1+.30*sourcePercentile`, using original source bounds, not raw magnitude, target quality, divine displayed values or item enhancement. All legal traits remain possible; selected type/raw/source move unchanged. Existing duplicate/protected-item rules remain.
- Formal enhancement: base 90/80/60/40/20% plus 2 percentage points for dwarves, yielding 92/82/62/42/22%. Luck does not affect this. Costs, +4% raw base per level, failure minus one and maximum +5 are unchanged. Reduced expected total cost is a consequence of fewer failures, not a per-attempt discount.
- Ordinary drops, merchants, combat proc chances, development enhancement lab and deterministic learned recipes do not receive this forge trait. Fixed recipes make zero random draws.

## Transaction boundaries
Paid pending reforge outcomes retain exact values and provenance through acceptance/keep/reload, regardless of later luck; this version does not regenerate historical pending results. Keeping the old result still spends the existing cost/donor.
Formal enhancement commits cost and result together. An in-page write-failure retry reuses the cached roll and preserves current unrelated resources. If all persistence fails and the page reloads, the unpaid old save remains; an unpersisted in-memory roll cannot survive reload. No false completion or secret paid queue is introduced.

## Evidence and regression updates
- `dwarf-forge-favor-tests.mjs`: pure policy finite/clamp/zero/monotone/source-percentile and one-selection contracts.
- `dwarf-forge-production-tests.mjs`: real value wash/transfer/full reforge, RAW/source preservation, candidate divine acceptance, old pending and non-forge factory isolation.
- `dwarf-forge-enhancement-tests.mjs`: real formal quotes/preparation, +2pp boundaries, unchanged costs/base/failure, luck exclusion, stale race and cached storage-failure retry.
- `forge-favor-ui-tests.cjs`: authoritative base/final quote rendering, legacy quote compatibility and qualitative trait explanation. Divine precise probability is not displayed.
- 400 ordinary factory outputs plus 50 merchant stocks and final RNG/state compared byte-for-byte with deployed v0.36 `db79502`: SHA256 `ac9b27fe6dafb1e7939de231b30c15897ff9a44f79c4477d84998dea9ece1737` on both.
- Fusion zero-luck dwarves intentionally consume new racial RNG. Four 2,000-result trace hashes are updated explicitly for this approved behavior; base quality weights and the independent five-identical-input three-way law remain tested separately. The final no-luck dwarf distribution for five same-quality inputs (away from quality bounds) is approximately 31.556% down, 33.333% same, 35.111% up, not strict final thirds.

No new race, region, recipe, material or combat visual changes are bundled. Whole-browser visual QA remains unavailable; UI regression uses DOM mocks.
