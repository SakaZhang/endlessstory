# Asset loading optimization

## What was actually slow in the loading graph

The v0.75 baseline (`7a32712`) starts with **204 JavaScript modules plus 34 blocking stylesheets**. The entry graph is 3,053,314 bytes of JavaScript and 240,243 bytes of CSS before HTTP compression. Maps, services and battle artwork were already largely scene-scoped; there was no evidence that every PNG was downloaded on startup.

Two concrete remaining costs were addressed:

1. **Production entry bundling.** Pinned `esbuild@0.28.2` (lockfile included) bundles/minifies each top-level HTML entry to one ESM script and one stylesheet. CSS follows the original link/cascade order, with the same relative image URLs. Both `index.html` and `battle-preview.html` are covered. Original modules/styles and all retained runtime images/manifests remain byte-identical in the namespaced release for audit and the original unbundled HTML entry.
2. **Invisible battle artwork.** Outside the visible battle page, only the hero's idle portrait frames are loaded. Invisible camp/area backgrounds and enemy/attack/hurt/death frames wait until the battle is actually viewed. Entering battle restores complete animation coverage before drawing. Existing six-load concurrency, cancellation, stale-scene rejection, current-scope decoded cache, automatic/manual retry and explicit fallbacks remain intact.

There is no lossy PNG conversion, palette reduction, resized sprite, removed animation, changed save schema, implicit reload, or mandatory Sites-hosted asset. An exploratory image-compression reduction was rejected after decoded-sample validation revealed palette conversion; those bytes were not used.

## Reproducible measurements

Commands: `npm ci`, `npm run build`, `npm run audit:asset-loading`.

The following are **static dependency/file measurements and offline gzip estimates**, not browser/network timing or claimed user-perceived speedups. The updated source includes the concurrent NPC task implementation, so both the historical baseline and same-feature unbundled comparison are shown.

| Homepage entry resources | v0.75 baseline | Updated source, unbundled | Optimized production |
|---|---:|---:|---:|
| JS requests | 204 | 205 | **1** |
| JS bytes | 3,053,314 | 3,171,305 | **2,095,164** |
| JS gzip bytes | 645,704 | 668,773 | **482,013** |
| CSS requests | 34 | 34 | **1** |
| CSS bytes | 240,243 | 242,779 | **234,417** |
| CSS gzip bytes | 54,673 | 55,287 | **39,922** |

Compared with v0.75, the initial JS/CSS request graph drops **238 → 2** and estimated gzipped JS+CSS drops **700,377 → 521,935 bytes (25.5%)**, despite the added NPC functionality. Against the same updated source, JavaScript alone is 33.9% smaller raw and 27.9% smaller gzipped. The isolated battle preview also drops from 149 JS + 5 CSS requests to 1 + 1.

For a saved character resting at camp while viewing the world page, the following battle-renderer requests are avoided. These counts exclude the still-needed world map and UI icons; hero portraits remain fully animated where their registered idle animation has multiple frames.

| Race | Before: requests / PNG bytes | After: requests / PNG bytes |
|---|---:|---:|
| Dwarf | 9 / 360,324 | **1 / 8,092** |
| Human | 5 / 342,663 | **1 / 13,216** |
| Elf | 5 / 390,345 | **1 / 11,061** |
| Goblin | 5 / 446,623 | **1 / 30,242** |
| Ashen | 5 / 390,837 | **1 / 24,874** |

The deliverable still includes the game's full art inventory. This is a first-use/request-waterfall optimization, **not a claim that the entire distribution became smaller**: preserving source modules alongside new bundles adds package bytes. The standalone packer can gzip text for transfer without changing the canonical release bytes.

## Release and portability guarantees

- `npm run build` still outputs `build/`; stable root pages use a relative `<base href="./releases/<sha256>/">`.
- The release fingerprint covers **final generated bundle bytes and transformed root-entry content**, not just original source. Repeated builds are deterministic.
- Runtime artwork is unchanged byte-for-byte and all CSS/dynamic manifest paths remain within the same immutable release, including deployment under a subpath.
- Explicit release exclusions now total **27 files: 14 nonruntime proof PNGs + 13 audited authoring/QA/provenance records**. The literal paths are maintained in `release-asset-policy.mjs`: four integration/canon/QA documents, three story generation records, and six extraction/alpha/provenance records. All were verified unreferenced by runtime files. Originals remain in source; there is no wildcard deletion. Every exclusion fails the build if a runtime consumer later references it. Actual PNGs, actor metadata in runtime modules, and runtime scene manifests remain present and byte-identical.
- Root HTML must revalidate and `release-integrity.json` must be fresh; `/releases/<sha256>/...` is safe to cache immutable. The container handles these headers and optional gzip. Old tabs retain the existing explicit-save/refresh recovery; no new service worker or mixed-release loading was introduced.

## Verification

Passed:

- `npm run test:asset-performance`: five-race offscreen deferral, repeat-load reuse, complete visible lifecycle, interrupted loading; actual minified production App through world/region/combat/inventory/forge/merchant/journal/codex flow; source parity, CSS URL/cascade order, no remaining static-import waterfall; exact exclusions and future-reference rejection.
- `npm run test:asset-recovery`: existing automatic/manual retry, disposal, version mismatch, save/draft/newer-tab protection, actual pixel identity, maps/services, and scoped battle loading.
- `npm run test:release`: deterministic builds, complete retained-source dynamic dependency graph, immutable URL/cache model, byte-mutation and missing-asset negatives; source save key unchanged.
- `npm run build`: current generator consistency checks and final source snapshot guard.

DOM/native-canvas gates are not browser QA. The old optional Sites helper path was unavailable in the release suite; no publication or authentication bypass was attempted. Browser/standalone HTTP checks belong to the final deployment verification and must be reported separately.
