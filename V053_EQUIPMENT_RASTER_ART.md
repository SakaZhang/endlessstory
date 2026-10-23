# v0.53 — 48 equipment templates + two legendary identities

## Visible scope
All 48 exact current template IDs plus `first-forge-oathhammer` and `everburning-reactor` use 150 approved transparent PNGs (32/48/64 each). The shared `equipmentIcon` keeps true instance identity; legendaryId takes priority over ordinary template metadata. Names, rarity background, green set-only frame, divine/lock/selection badges, stats, price, costs and transaction actions are unchanged.

Consumers: normal inventory/doll/details, saved loadouts/wardrobe, forge inputs/orbits/result, reforge donors/pending comparisons, formal enhancement and inspection gallery, merchant equipment, batch sale quote snapshots and known equipment/legend codex. Unknown legend lore/identity display remains gated by actual discovery. Empty equipment sockets stay the approved low-contrast outlines, not owned art.

Native sizes: compact bags/plans/input/donor/owned-selection/collected-parts32; equipment doll/details/merchant/template-gallery48; forge result/large enhancement/codex hero64. The renderer selects the exact source PNG, never silently shrinks a 48px bitmap via CSS.

## Implementation and failures
- Production is a DOM span wrapper with direct IMG, not raster nested inside SVG. Wrapper draws the established quality background and frame; original PNGs contain neither.
- Early self-contained PNG-in-SVG prototype **failed** native strict body-pixel checks (only frame rendered), including xlink attempt. It was rejected rather than calling string assertions a rendering pass.
- Native QA now loads the same PNG directly and uses production `drawEquipmentRaster` for quality/frame composition. This is explicitly not a browser/whole-page screenshot.
- Captured image errors show visible `图像失败`, keyboard/click retry, accessible item-specific explanation. Retry stops parent equipment/transaction action and never changes game state, RNG or save. Success restores the image. No unrelated item or old SVG replacement is used on asset failure.
- Existing procedural SVG support remains only for identities outside this authored registry, not for failed authored assets.
- CSS URL declarations include all 150 native-size paths in the verified hash-release dependency graph; same-origin/origin key unchanged.

## Evidence
- `equipment-art-source-manifest.json`: frozen approved package hashes and all150 PNG hashes.
- `equipment-raster-adapter-tests.mjs`: exact50 identity/150 original bytes, real PNG body rendering all3 sizes, legend precedence, quality/set frames, immutable render, image error/click/keyboard retry/noRNG.
- `equipment-raster-live-app-ui-tests.cjs`: actual App all48 inventory/detail/gallery and merchant, two actual legal legend items and known codex, capture error/retry without equip/payment/save.
- Four former SVG-native art tests adapted to the actual PNG+frame path; original identity/quality/set/8slots/quote snapshot/readonly coverage retained. Existing mechanism and transaction suites remain required.
- `qa/equipment-stage-v053/` real current hero + eight actual generated equipment at production coordinates, root visually reviewed 216px composition. `shared/legendary-art-v053/contact-sheet.png` two production identities32/48.

No schema/gameplay changes or reset. Battle44, skill21, maps and service scenes unchanged. Other utility/material/potion art audit is separate; this is not a claim that all UI artwork is final. Browser whole-page/mobile visual QA remains unavailable.
