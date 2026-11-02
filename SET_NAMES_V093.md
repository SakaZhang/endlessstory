# v0.93 — approved complete set-piece names

The exact 2026-11-02 approved list is frozen in `fixtures/set-names-approved-v093.json`: 15 sets, 60 pieces, five races. `dist/equipment-display-name.js` uses an explicit template-ID map rather than generated single-word suffixes. 44 labels change from v0.87 presentation; 53 labels differ from the frozen underlying catalog.

Examples: 三相晶格·共振护手, 苦菌行者·菌纹护手, 心木共鸣·心木护手, 守冢·镇石甲 (retained), 余粮斥候·藏粮轻甲, 断层重构·叠岩护甲.

This is presentation-only. The frozen catalog, item IDs, set IDs, slot identities, stats, special/legendary effects, saved names and transaction fingerprints are not rewritten. New drops and existing items share canonical display labels. Exact raw/v087/current name aliases also display correctly for old structured loot and casino receipts; arbitrary prose is not replaced. Unknown/custom names retain the prior fallback. Legendary and non-set names remain unchanged.

`npm run test:v093` checks every exact approved label and negative aliases, production renderers, all five races' actual App inventory/details and paid legacy reforge previews/reloads. App tests use a simulated DOM, not a browser. Separate targeted enhancement, reforge, casino and potion tests verify mechanics and save-failure behavior. No full-repository test pass is claimed.

The historical `SET_NAMES_V087.md` remains a record of that release, not the current naming specification. This release preserves v0.91 portal/casino and v0.92 bulk-potion changes. Container metadata is prepared only; no Docker build, login, push or remote-server update is included.

Release integrity verification passed: 3,059 files, 3,057 resource URLs, 8,877 dependency edges, eleven byte-mutation and twelve missing/reference negative cases, old-cache isolation. The release test's optional legacy Sites helper check was unavailable; actual publication packaging uses the current official Sites workflow separately.

Independent Chromium preview QA passed all five races: 60 new and 60 no-template legacy pieces, all twenty race/slot legacy backpack views, production icon and pixel-inventory accessible names, selected equipment labels and all six reported examples. This used an isolated in-memory component page, not the user's save; detail cards used the display helper. Temporary QA HTML was removed and preview stopped before packaging. Full-App transaction checks are separately covered by the simulated-DOM tests above. v0.91 and v0.92 complete targeted scripts passed.
