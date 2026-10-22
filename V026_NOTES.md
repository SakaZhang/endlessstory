# v0.26 — dwarf equipment identities and isolated enhancement trial

## Normal gameplay
- Newly generated dwarf gear uses 36 ordinary templates and 12 set-piece names with stable template/type/baseVariant/visual provenance IDs. Set IDs, slots, source restrictions, numeric budgets, affixes, quality, divine chance and RNG calls are unchanged.
- Existing inventory, merchant stock and paid pending outputs keep their original name and stats. Legacy items are not retroactively assigned a random type.
- Axe and hammer have distinct pixel silhouettes; other templates retain existing slot artwork. This is not 48 unique rendered illustrations.

## Developer equipment workshop
- Forge opens a cloned, memory-only character. Costs, inventory, upgrades and results do not affect the official save. Exit or reload restores the official character; importing a marked equipment sandbox is rejected.
- Uses the actual integrated enhancement transaction and stat derivation. Targets +1 through +5 have 90/80/60/40/20% success. A failed attempt spends its cost and reduces current enhancement by one, floored at zero. No equipment destruction and no retain-old-result bypass.
- Costs and magnitude are explicitly candidate parameters, not new formal balance. Original atk/armor/hp are immutable; candidate base totals derive once. Zero raw attributes remain zero. Ordinary/special affixes, set identity, divine proportion and old bless behavior remain unchanged.
- Business snapshot rejects changed targets/resources, but clock or unrelated loot updates do not invalidate the quote. A storage-failure retry preserves the same roll while retaining current clocks/HP/other items. A successful attempt requires an explicit Continue action before another attempt.
- Raw enhancement gains retain fractions; the character panel follows existing aggregate rounding. A small improvement may not yet change its displayed integer.

## Verification
- Template, enhancement, storage, actual-app mock DOM, inventory/gear-layout and pixel-icon tests. Full aggregate evidence: /workspace/shared/v026-review/final-tests.txt.
- Independent v0.25 comparison: 2,000 seeded material fusion results retain all numeric outputs, quality, affixes, specials, divine and RNG progression; only approved name/identity metadata differ.
- Native icon raster: /workspace/shared/equipment-workshop-review/axe-hammer.png.
- Browser visual QA remains unavailable; mock DOM and native renders are not a browser pass.

## Excluded
No new growth-budget coefficients, formal enhancement migration, legendary drops/effects, additional materials, monster parameters or random multi-enemy production encounters. Reactor timing remains a separate external tested foundation.
