# Elf slimmer raster art — integrated review

Base `1bff5c6`. This is the user's requested slimmer Elf body, implemented in20 actual raster assets (8 bow,8 staff,4 neutral), not renderer squeezing. Root accepted the working visual direction; no claim of explicit user approval of the optional initial preview. No publication by this branch.

## Art generation and packaging
Built-in `image_gen__imagegen` edited the existing native sprite sheets, with the slim bow idle as a body-reference only. Prompts: narrow shoulders/chest/waist/arms/legs about15%; retain head size/identity, silver hair and pointed ears, young priest white/gold/green costume, body height and every original pose. Preserve original small staff orb/crook and gold bow, keep all neutral hands empty. Crisp pixel style, transparent alpha, no extra objects/text.

Sources are preserved in `qa/elf-slim-review/{bow,staff,neutral}-lifecycle-source.png`:
- bow: `exec-81f8cbf6-17a2-470e-95e0-a3043157829f.png`
- staff: `exec-2d9b2ef5-b08c-4420-ba16-b38c438cec82.png`
- neutral: `exec-f9901fdc-2246-4bd5-a49e-ab8a0bbc2052.png`

`node tools/package-slim-elf.mjs` reproduces packaging: low-alpha padding-noise cleanup, cell cropping, one UNIFORM nearest-neighbor scale per variant (all action frames share idle scale),192px transparent canvas and existing foot anchor. No Python artwork edit, selective warping, per-frame scale normalization or head/weapon compositing. Artwork changes come from imagegen.

## Real pixel calibration
The generated PNGs were decoded, not just accepted against old metadata. Actual idle hair-to-foot inclusive ranges are bow94–175, staff101–175 (staff-tip excluded), neutral95–176. These match the existing body-reference calibration and all render at98px body height. No reference metadata change is necessary. All20 exact inclusive alpha boxes were recomputed. Anchors stay96,176, durations and lifecycle sequences unchanged.

All native frames stay above/before canvas edges; effects/arrows and death weapons are contained. Native death is collapsed/kneeling, neutral death is horizontal, matching original animation design. No cross-weapon or armed-neutral reuse. Only Elf asset/metadata content changed; renderer/gameplay/other heroes untouched.

## Verification
Passed:
- `node elf-slim-art-tests.mjs` (all20 exact alpha bounds, native192px canvases, anchor, lifecycle mappings, actual decoded hair-to-foot98px calibration)
- `node tests/races/elf/hero-metadata.test.mjs`
- `node race-art-alpha-bounds-tests.mjs` (1108 racial frames)
- `node hero-proportions-tests.mjs` (Elf98/Goblin62, uniform transform for every lifecycle)
- `node race-neutral-hero-tests.mjs`
- `node race-art-routing-tests.mjs`
- `node live-battle-lifecycle-tests.mjs`
- `node hero-proportions-native-proof.mjs` (45 actual canvas captures)
- `node build-release.mjs`

Actual visual proof: `qa/elf-slim-review/all20-final.png`; `qa/hero-proportions/elf-{bow,staff,neutral}-{camp,battle,portrait}.png`.
- `node release-cache-tests.mjs`: PASS2416 file hashes,7800 dependency edges; Sites helper unavailable (no hosted publication check).
