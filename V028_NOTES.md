# v0.28 — correct quality/background and set/frame semantics

- Equipment quality now fills its icon background: neutral white-grey, blue, purple, red. Ordinary equipment frames remain neutral grey. Set membership alone adds a green frame while retaining a supreme-red quality background.
- The shared production equipment renderer owns the real SVG fill/frame, including legacy generic-art fallback. Original 48 pixel drawings remain unchanged. Scoped final CSS clears old quality-coloured container frames across inventory, equipped slots, details, forge inputs/results/modification, merchant, codex, loadouts, sale snapshots and workshop. Selection is a separate outline.
- Material/potion presentation, per-affix text colours and divine marks are outside this correction; no engine, RNG, save, numerical or inventory changes.
- Direct production-rendered comparison and all48 small/large sheets: /workspace/shared/equipment-art-v0271/. The comparison includes the same item at four qualities, supreme ordinary vs set items, and legacy set artwork.
- Pure rendering/static CSS and actual-app mock-DOM regressions, plus complete aggregate suite. Native raster visual review is not a browser whole-page pass.
