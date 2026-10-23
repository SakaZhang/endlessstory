# v0.41 — Fixed potion recipes and imported ingredients

## Normal play
- All 15 potion books can appear in subsequent merchant stock. Purchased recipes are permanently learned and excluded from future stock; existing offers/prices/stocks/timestamps are not rerolled.
- Healing retains the same-quality, multi-stack recovery-material planner. Fourteen buff recipes use approved same-quality main/auxiliary substitutes and batch crafting (1–999). A material serving both roles costs two units per bottle.
- Ten existing foreign materials are imported through the merchant only. This does not open foreign maps or add those materials to dwarf monster pools. Material discovery/navigation explains imported sources.
- All potions share the existing 10-second drink cooldown. Buffs last five minutes: same quality extends duration, higher quality replaces, lower quality cannot overwrite. Expiry uses simulation time online and offline.
- Strength, six elemental attack bonuses, six resistances and luck consume real production stat paths. Luck contributes to the existing unified loot/forge policy, not fixed combat proc chances or enhancement success.
- Free random fusion remains the original healing/strength/fire-resistance pool. The full fifteen-type pool is accessed through learned fixed recipes, not a silently expanded random pool.

## Conservation and compatibility
- Fixed crafting is deterministic and atomic: cost/materials/result or pending claim commit together. Full capacity uses the existing single pending forge slot; batch claiming is all-or-none.
- Legacy inventory, buffs, paid pending results and existing merchant stock remain valid. Old completed rolls are never rerolled. Normalization adds empty slots for newly supported buff types only.
- New encounters snapshot effective luck at their actual start time. An already-running encounter retains its original snapshot; expired potion luck does not get copied into subsequent offline encounters.
- The current ten dwarf areas, 44 monsters, 24 nodes, source pools, unique/story material restrictions and private battle preview are unchanged.

## Verification and limits
- New tests cover all 15 types × 4 qualities, real purchase/learn/craft/drink/save, same-stack double consumption, stale quotes, save failure, maximum batches, shared cooldown, replacement and exact expiry.
- Three independently initialized processes compare 600 seconds of normal online, offline and mid-run JSON recovery; full state matches except the offline chronicle summary.
- Limited actual consumer comparisons include A03/A10 fire skill battles, six actual enemy elemental skills, luck expiry/forge thresholds, and a real merchant-only ingredient procurement chain. They are not a full economic balance claim.
- Merchant quality weights remain unchanged; high-quality dual-import recipes can require many visits. No promise of uninterrupted high-grade buff supply.
- UI tests use DOM mocks; no browser whole-page QA is claimed. Default geometric combat remains temporary; the approved isolated pixel preview is preserved.
