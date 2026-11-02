# Elf character redesign — v0.87

The user requested a redesign because the Elf looked awkward and childlike. All 60 playable Elf body frames now share a slender youthful silhouette, smaller balanced head, defined alert face, silver hair, pointed ears, and the established ivory/gold/green priest costume. This is newly generated artwork, not a renderer squeeze of the old body.

## Scope and provenance

Built-in `image_gen__imagegen` authored the raster edits with transparent backgrounds. Existing repository Elf sheets supplied pose and identity references. No external artwork, new third-party license claim, or API fallback was used. Final source PNGs are preserved under `qa/elf-redesign-v087/`; selected source IDs and the production prompt set are in `generation-provenance.json`. Rejected anatomy/layout candidates were not shipped.

- Native: bow 8, staff 8, neutral/empty-hand 4.
- Shared canonical legendary weapons: five Elf-only body sets × 8 frames (hammer, sword, staff, bow, dagger).
- Legendary weapon PNGs, hashes, scales, identities and effects remain unchanged. New body hand coordinates, hand foreground masks and bow pull coordinates keep these weapons correctly attached.
- Ordinary cross-race unsupported weapons continue the existing empty-hand fallback. The story actor for sealed 莱姆斯 uses the native staff sprite and therefore receives the new body automatically.

## Packaging and compatibility

`tools/package-elf-redesign-v087.mjs` and `tools/package-elf-legendary-v087.mjs` perform only crop, low-alpha fringe cleanup, a single nearest-neighbor scale per source sheet, and placement at the existing foot anchor. They do not redraw anatomy, warp individual frames, or paint replacement weapons. Nonuniform source grid padding is explicitly cropped where needed; no complete figure or effect is cut at a cell edge.

Native canvases remain 192 × 192, anchor [96,176]. All native idle anatomy is 82 px before the existing 98 px display calibration. Only the staff anatomy calibration changed, from [101,175] to [94,175], measured from actual new pixels. Bow [94,175] and neutral [95,176] remain. Legendary canvases remain 256 × 240, anchor [96,176], idle anatomy [79,176] (98 px); each lifecycle uses the same scale. Durations, animation IDs, gameplay, saves, other races, NPC portraits and canonical weapon art are untouched.

## Verification

Passed locally against final frozen artwork:
- `node elf-redesign-v087-tests.mjs`: 60 unique final PNGs; exact decoded alpha boxes, transparency, 98 px body calibration, foot anchors, full body/weapon bounds, canonical weapon hashes.
- `node elf-slim-art-tests.mjs`: updated art satisfies existing 20-native-frame exact metadata/calibration checks.
- `node tests/races/elf/hero-metadata.test.mjs`.
- `node hero-proportions-tests.mjs` (staff expected calibration precisely updated).
- `node race-art-alpha-bounds-tests.mjs`.
- `node race-neutral-hero-tests.mjs`.
- `node race-art-routing-tests.mjs`.
- `node live-battle-lifecycle-tests.mjs`.
- `node legendary-race-art-tests.mjs --require-shared`.
- `node tools/review-elf-shared.mjs`: 5 canonical hashes and 40 composite pose bounds.

Independent visual review examined the 20 native frames and five legendary composite contact sheets, finding consistent identity, plausible grips, no obvious truncation or variant mix-up. Review is visual evidence, not a claim that all possible animations are perfectly drawn. Final whole-project tests, actual browser check and publication belong to the integrating parent.

## Review images

- `qa/elf-redesign-v087/before-after-actual98.png`: old/new at actual 98 px anatomy display size.
- `qa/elf-redesign-v087/all20-final.png`: native action contact sheet.
- `qa/elf-redesign-v087/legend-*-final.png`: actual body + canonical weapon composition for all 40 legendary frames.
- `packaging-proof.json` and `legendary-packaging-proof.json`: precise source rectangles, scales, boxes and hand anchors.
