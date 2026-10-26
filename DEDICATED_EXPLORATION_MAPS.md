# v0.63 — Dedicated racial exploration maps

## Scope
- Human A01–A10: wire the ten pre-existing `maps-01.png`–`maps-10.png` geography assets, unchanged. All ten reviewed together; elevated paths/landmarks match actual area progression.
- Elf, Goblin and Ashen A01–A10: thirty individually authored Japanese-style pixel exploration maps. The area names/descriptions/material geography are the input; no story or economy changes.
- `map-assets/exploration-manifest.json` is now the independent exploration scene registry. `pixel-map-scenes.js` no longer imports battle-art routing or fetches the battle manifest. Only selected scene images load; registry load does not preload all areas.
- Dwarf's existing two-layer map presentation is explicitly retained in this manifest; this change targets the four expansion races requested, not a Dwarf art redesign.
- Mobile map canvas uses centered aspect-preserving `object-fit: cover` within the existing tall touch layout, avoiding vertical stretching. Hotspot geometry remains unchanged.
- Battle scenes, camp scenes, navigation/hotspot positions, travel selection/commit logic and saved-game schema are unchanged. No old-save migration.

## Verification
`npm run test:exploration` checks forty unique PNGs at 480×270, no battle aliases or duplicated combat pixels, real decoding and independent fetch graph, failed dimensions/retry, old async/detached map safety, current+adjacent model/travel/state guards, actual App DOM actions, and native map/UI composites.

`exploration-maps-browser-tests.cjs` is a reproducible Chromium component test for desktop/mobile. In this execution environment Chromium with its sandbox enabled is blocked at launch (`socket() failed: Operation not permitted`, SIGABRT). No sandbox bypass was attempted. Browser layout/click coverage is therefore NOT claimed.

`qa/exploration/native/` is actual map pixels and actual production renderer text composited with measured CJK wrapping and **CSS-estimated** target positions. It is not a browser screenshot. The proof checks all forty scenes at 960px and 375px, target bounds, at most three local nodes/two adjacent edges, and estimated non-overlap.

The historical adjacent/App map tests used retired `ashencrown-v3` fixtures and failed unchanged at cba72e3. They now import current `SAVE_KEY` and use current `Engine.fresh()` fixtures; this is a test repair only, not a production migration.

## Art provenance
Each newly authored race has a root `*-exploration-art-source.json` with per-area prompts/source information. Contact sheets and individual composites live outside `dist`, so QA proof images do not enter the release asset graph. New runtime map PNGs are included by the existing release builder without packaging exceptions.

### Aggregate-suite baseline
`npm test` was executed and reaches existing `equipment-armor-art-tests.mjs:8`, then fails `36 !== 28`. Running that exact test on untouched cba72e3 reproduces the failure. This unrelated armor-count expectation was not changed; focused exploration/routing/camp/release checks are reported separately.

Location buttons remain the existing generic fixed-position controls. The new terrain art does not claim pixel-exact alignment between those controls and illustrated landmarks.

## Version/cache
Displayed release is v0.63. The release builder derives an immutable SHA256 namespace from all dist asset contents, so the new independent manifest, loader, CSS and thirty PNGs share a fresh cache namespace. There is no separate service-worker cache key. Save schema remains6 and SAVE_KEY remainsashencrown-v6; no reset/migration.

## Completed focused checks
- `npm run test:exploration`: PASS, forty dedicated map identities, lazy load/dedupe/retry, 29 adjacent-region model tests, navigation ledger guards, actual App DOM/layer checks across all40 expansion areas plus10 Dwarf areas, and80 native composites.
- Race-art routing, racial camp scenes, race expansion integration and release asset policy: PASS.
- `npm run build`: PASS,2675 emitted files; release namespace `cf31507b3ead588550a0c9dba058431b8dd8f3f0552a8837030bd5a905aec43c`.
- Release cache traversal now treats the independent exploration manifest and its images as real dynamic runtime edges; no auxiliary whitelist expansion or release exclusions were added.
