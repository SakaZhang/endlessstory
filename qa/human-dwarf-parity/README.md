# Human + dwarf ordinary equipment parity

Base: `7f6d9417a437551054e3d95ca43bd9a8204e8498`. Additive scope only: dwarf +16, human +12. Each now has 52 ordinary identities: 16 native weapons (8 per family), and 6 each helm, armor, gloves, boots, ring, amulet. Each keeps 12 set pieces separately; legendary content unchanged.

## Art provenance

Generated with the built-in `image_gen` tool, transparent background. Source is `source-atlas.png` (948 × 1659 RGBA); prompt requested a coherent 4-column, 7-row ordinary fantasy equipment atlas with chunky pixel-art silhouettes, metal/leather shading, no frame/glow/text, exactly 28 icons. Individual subjects and palettes are recorded in `catalog.json` in row-major order:

- Rows 1–4: dwarf copper/iron axes4, hammers4, helms2 + armor2, gloves2 + boots2.
- Rows 5–7: human silver/blue/leather helms2 + armor2, gloves2 + boots2, wheat/compass/bell/shield amulets4.

`tools/package-human-dwarf-equipment.cjs` mechanically crops visually checked cell boundaries, trims transparent margins and performs nearest-neighbor contain resize with 2px transparent padding. No repainting, color alteration or procedural replacement. Generated row spacing was not perfectly even; crop boundaries were visually corrected before final native32/64 contact review. `source-manifest.json` records source hash, crop rectangles and all 84 delivered PNG hashes. `contact-32.png` and `contact-64.png` show the actual delivered PNGs, not enlarged source crops.

## Preservation and source eligibility

`baseline.json` snapshots all 100 original human/dwarf templates and original 32/48/64 asset hashes. The focused test verifies byte-for-byte preservation of names, identity fields, base allocation keys and artwork. New templates only use existing budget variants; human's existing sword_shield/greatsword identities are unchanged despite historical shared budget keys.

Normal selection and fusion use the existing shared template pools. All additions are ordinary `scatter`, `setId:null`; merchant sellability passes. Existing set-source gate still rejects fusion/forge/merchant set generation. No gameplay rules, prices, budget allocations or legendary mechanics changed.

Native PNG verification covers dimensions, actual alpha, fully transparent outside edges, body coverage, distinct64 hashes against all old templates and each other. This is native asset QA, not a claim of browser whole-page review.
