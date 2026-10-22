# v0.27 — 48 distinct dwarf pixel equipment icons

- Original integer-grid SVG artwork for all 36 ordinary dwarf templates and 12 set pieces. Each identity has a different shape/structural decoration, not merely a name or tint change.
- Uses existing stable visualVariant/template IDs. Legacy items keep prior generic icon fallback; no random visual reassignment, gear renaming, new stats or RNG consumption.
- Shared production renderer now serves equipped slots, inventory/detail, forge inputs/results/animation, modification donors, merchant stock, fixed batch-sale snapshots, the workshop gallery, set codex and loadout cabinet. Two ring sockets correctly reuse one item's artwork.
- Quality and set borders remain UI framing rather than embedded item color. Three set families preserve coherent iron/copper, rune/fire and guardian/stone motifs.

## Evidence
- Production-function sheets, all 48 labeled and ordered by family: /workspace/shared/equipment-art-v027/equipment-32px.png, equipment-48px.png and equipment-128px.png.
- Automated checks: all48 color-stripped geometries differ, SVG coordinates are bounded integer pixels, unknown and legacy identities are safe, rendering is pure. Actual-app mock-DOM flows exercise all48 inventory/detail/gallery identities and merchant stock.
- Full regression log: /workspace/shared/v027-review/final-tests.txt.
- Native icon sheets were visually inspected. This is not an actual-browser whole-page visual pass.

No engine, save schema, numerical balance, probability, enhancement policy or legendary acquisition changes.
