# Ordinary dungeon loot investigation (unpublished)

## Confirmed findings

- Rewards are applied immediately at each of three stages, not only at the clear. `e.materialLoot` lists accepted materials, while `e.lootSummary` counts quality-filtered and overflow-rejected drops. These are not a promise of guaranteed drops.
- All 50 racial area dungeon nodes were exercised through real `step`/`reward` three-stage combat with in-memory level-100 fixtures. Each accepted receipt equals the actual inventory/material/item increment. No missing-delivery bug was found in these fixtures.
- A real all-empty clear **was reproduced**: `setup('dwarf',100,3,181,false)`, dwarf A1, empty material bag/no filters, ordinary equipped fixture. Three wins yielded equipment/materials/items all zero, rejected counts all zero, gold +18. XP is zero because the fixture is max-level. This is allowed by the existing probability tables; it is not fixed by silently adding a guarantee.
- At zero luck, without extra scavenging or rare bonuses and assuming no already-owned unique material suppression, A1's approximate all-item-empty probability is 0.333621% for dwarf, 0.079101% for elf, and 0.083405% for human/goblin/ashen. For dwarf, average per-normal-stage no-material probability is .24975 and final elite .124875; multiply `.24975² × .124875 × .82² × .65 × .98`. Normal-monster choice is averaged; final gear 35%, mark 2%. These probabilities describe fresh table conditions, not the user's unknown save.
- UI had only a transient leading log line and a short combat log. The last stage could obscure earlier rewards; automatic next combat and reload lose the context. Materials can also merge into existing stacks without adding bag slots.
- Story encounters deliberately give no combat loot and are outside ordinary-dungeon receipts. Filtering and full bags are independent reasons generated loot may not enter inventory.

## Implemented visibility fix

`dist/dungeon-loot-receipts.js` stores optional version-1 read-only receipts, capped at 30 stages. Each record uses inventory deltas around the existing successful reward call plus the existing rejection summary. It performs no RNG calls and grants nothing. Duplicate settlement remains guarded by the existing reward transaction and receipt identity guard.

The battle page keeps a recent ordinary-dungeon receipt outside the transient combat message. “战报 / 掉落” opens history. The UI distinguishes accepted counts, quality-filtered drops, full-bag rejection, and a genuinely zero-generated-item record. Only a same-run group containing all three stages is labeled a complete round; old/mid-run and evicted history is partial. Offline uses the same settlement hook; JSON reload preserves receipts. No old stage is fabricated or replayed. Boss, field, and story encounters do not create these receipts. Existing saves without the optional field remain valid.

## Verification

Passed:
- `node dungeon-loot-receipts-tests.mjs`: all 50 nodes, real combat, exact received inventory deltas, natural empty seed181, full-bag and filter distinction, offline completion, reload, duplicate settlement, malformed optional record rejection, partial-history grouping.
- `node dungeon-ui-tests.cjs`: existing routing/reload/cooldown/loop/failure flows plus visible complete-round receipt and history modal.
- `node expedition-automation-tests.mjs`: online/offline parity and normal automatic routing.
- `node inventory-bags-tests.mjs`.
Aggregate `node tests.mjs` reached `release-cache-tests.mjs:155` and failed its isolated source snapshot comparison because concurrent edits changed `potion-catalog.js` (hashes `6a94bc…` / `1aab20…`). Earlier checks passed; checks after this point were not reached. Root must rerun the aggregate after all parallel writers finish. This is not an aggregate pass.
- `node --check dist/app.js` and `dist/engine.js`.

No production server, user save, release version, commit, or deployment changed. The user's specific occurrence is not established without its region/settings/save; this change must not be described as proof that their report was merely UI confusion.
