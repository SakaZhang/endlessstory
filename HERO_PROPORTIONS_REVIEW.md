# Goblin / Elf presentation size correction

Scope: presentation calibration, **not a sprite/body redraw**. Original PNG pixels,
gear identities, anchors, animation sequences and gameplay data are untouched.

The independently generated source sprites use inconsistent pixel densities.
Previously the live renderer only capped all heroes at 94 pixels: Goblin stood at
94 px versus Dwarf 60–63, Human 90–91 and Elf 82–84. The raw-source 2× overview
exaggerates this mismatch further and is not a truthful live-scale comparison.

`heroPresentationScale` now uses one fixed idle-reference height per sprite:

| Race | Raw native idle height | Live native idle height |
|---|---:|---:|
| Dwarf | 60 / 63 | 60 / 63 unchanged |
| Human | 90 / 91 | 90 / 91 unchanged |
| Elf body (excluding staff tip) | 82 / 75 | 98 / 98 |
| Goblin | 138 / 125 | 62 / 62 |
| Ashen | 123 / 138 | 94 / 94 unchanged |

Elf and Goblin neutral sprites use the same 98 / 62 reference heights. Scale is
uniform, aspect-preserving and shared across idle/attack/hurt/death frames; no
per-frame bounding-box normalization, so no new animation size popping. Rendering
remains nearest-neighbor. All draws remain anchored to the same foot origin.
Health-bar positioning already consumes the actor scale. Enemy target hitboxes and
gameplay hit calculations are untouched; heroes are not clickable enemy targets.

Camp and battle use the same size function. The two adjusted races' full-body
portraits use a common 112px reference display envelope instead of making both
fill the entire height, preserving the new relative stature in portraits too.
Other race portrait sizing is untouched.

## Verification

Passed: hero-proportions-tests, live-battle-lifecycle-tests,
race-art-routing-tests, race-neutral-hero-tests, racial-camp-scenes-tests,
retinue-formation-native-tests, large-formation-native-tests, build-release.

`live-battle-view-tests` passes its initial read-only adapter, event, input,
hit-test and lifecycle checks, then fails its legacy level-12 `scatter_ash`
unlock fixture at line49 (`assert(q)`). Reproduced with the unmodified base
`36268e6` renderer in this same checkout; not introduced by this patch.

Local review only. No publication authorized or performed by this change.

Additional passes: release-cache-tests (2416 file hashes / 7799 dependency edges;
Sites helper stage unavailable), live-battle-scoped-loading-tests,
race-art-alpha-bounds-tests (1108 frame bounds).

`node hero-proportions-native-proof.mjs` reproducibly writes 45 native canvas
captures (all 15 native/neutral race variants × camp, real battle, portrait) and
`qa/hero-proportions/evidence.json`. These are actual live renderer images, not
resized raw asset comparisons. Proof PNGs are local QA outputs, not runtime assets.

Body bounds are explicit inclusive idle head/hood-to-foot Y ranges in manifest
metadata. Elf staff uses101–175 (75px), excluding staff-tip92–100, so both
native Elf bodies reach98px. Its gear extends to~110px. A112px portrait envelope
keeps this tip visible without shrinking the staff body relative to bow.
