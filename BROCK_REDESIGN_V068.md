# Brock visual redesign — art-only working notes

## Approved direction

Replace the simplified legacy orange-bearded dwarf with the same recognizable
short, stout copper-bearded protagonist in the handcrafted pixel-art quality of
the approved NPC portraits. User-approved twin bull-horned iron battle helmet with worn copper rim;
unobstructed expressive face; paired short beard braids; slate-blue wool, dark
leather and practical iron guards. No NPC identity reuse, magical armour,
equipment/stat/story/name/save changes, or vertical stretching.

The root reviewed the first master sheet and its mechanical 60 px comparison
and approved the direction. The user rejected the initial miner-like round helmet;
the revised horned master was explicitly approved with “没问题”. User-facing Library preview:
`libfile_5f39c1891c0c819181bf3dea58204d67` / version 1 /
`布洛克新版形象草案.png`.

## Current asset contract

- Isolated branch `art/brock-redesign-v068`, based on v066 `ddfcc19`.
- Native frame size 192 × 192; foot anchor [96,176]; authored facing right.
- Axe: idle-0, idle-1, anticipation, windup, strike, followthrough, recovery,
  hurt, death (9 files).
- Hammer: idle, anticipation, windup, strike, followthrough, recovery, hurt,
  death (8 files).
- Original neutral: idle only. New neutral lifecycle has 8 authored frames and uses empty hands,
  without residual axe or hammer in any frame.
- Preserve animation state names and existing native timings. Same scale per
  sequence, never independently normalize each frame. Idle body targets remain
  60 px axe / 63 px hammer / 60 px neutral (helmet crown to boot sole,
  excluding the horns; explicit `bodyReferenceBounds`); no change to Goblin 62 / Elf 98 calibration.
- Root explicitly approved a narrow manifest-driven presentation compatibility
  gate to let authored neutral attack/hurt/death play. Preserve legacy idle-only
  fallback when an asset has no corresponding animation. No engine changes.

## Production approach

Use the built-in image generation tool (not CLI, code-drawn stand-ins or
algorithmic figure compositing). Author one coherent animation atlas per weapon
family referencing the approved master. Mechanical atlas slicing, uniform
nearest-neighbor resizing and placement onto the registered canvas only.
Retain original generated sources and exact prompts. Measure alpha and solid
bounds from exported pixels and keep foot anchors stable.

## Evidence labels

`/workspace/shared/brock-redesign-v068/native-readability-compare.png` is a
mechanically resized asset comparison, **not a browser screenshot**. Actual
production renderer captures and regression results will be recorded separately.
No publication is performed by this branch.

## Final verification

- Root visually reviewed and approved all 25 exported runtime frames, their
  common anchor, horned identity, empty-hand neutral set and attack stages.
- `brock-redesign-tests.mjs`: 25 exact measured alpha/solid bounds, no 192px edge
  clipping, no duplicate/jitter-only frames, fixed per-family scale, no changes
  to other sprites or routing, and 25 actual production canvas captures.
- Real E.step events rendered for axe, hammer, unarmed and foreign staff.
  Separately labelled display probes verify all five attack phases, hurt and
  death for each variant. Historical idle-only neutral fallback remains valid.
- Actual 160×150 and 192×220 portrait pixels verified: horns and feet do not
  touch/cross canvas edges. Selection still consumes the current native idle PNG.
- Passed: hero-proportions-tests, live-battle-lifecycle-tests,
  race-neutral-hero-tests, race-art-routing-tests, goblin-hero-facing-tests,
  named-hero-selection-app-ui-tests, live-battle-scoped-loading-tests,
  race-art-alpha-bounds-tests, racial-camp-scenes-tests, hero-proportions-native-proof,
  named-hero-native-proof, build and release-cache (2702 content hashes).
- `live-battle-lifecycle-app-ui-tests.cjs` fails with `TypeError: raf is not a
  function` at line 9. The identical failure was reproduced in unmodified
  `goblin-next-integration` at v066 `ddfcc19`; not introduced by this branch.
- Sites helper stage was unavailable. No browser screenshots are claimed;
  renderer exports are genuine native canvas evidence, not fabricated browser QA.
- No publish/deployment. Integrator owns v068 versioning, v067 cherry-pick and
  current-release packaging checks. This standalone branch was based on v066.

## Evidence paths

- `qa/brock-redesign/all-25-runtime-192.png`: complete 192×192 exported frames
  with their registered [96,176] anchor; no per-frame normalization.
- `qa/brock-redesign/all-25-frames-3x.png`: mechanical nearest-neighbor reading aid.
- `qa/brock-redesign/all-25-production-renderer.png`: actual camp renderer captures.
- `qa/brock-redesign/evidence.json`: real events vs labelled pose probes.
- `qa/brock-redesign/packaging-evidence.json`: original source crop/scale/anchors.
- `qa/hero-proportions/`: all five races, native/neutral camp/battle/portrait proof.
- `art/brock-redesign/source-manifest.json`: generated sources/prompts and hashes;
  round-helmet stages are explicitly rejected provenance, never runtime inputs.

Aggregate `npm test` reached a terminal failure after the gameplay/statistical
suites: `equipment-armor-art-tests.mjs:8` expects 28 armour entries, while the
current catalog has 36 (`36 !== 28`). The same focused failure was reproduced in
unmodified v066 `goblin-next-integration`; this patch does not change that test,
armor catalog, or equipment rules. Full aggregate is therefore **not passed**.
Final build and release-cache were rerun after the portraitCrop metadata change
and passed: release `965605c677cef950693612ce3ef51c40ca32a0242256a4bd40ff101969f02d4e`,
2702 hashes / 8210 dependency edges. No runtime source changed after the approved
implementation commit; this note only closes the test-status record.

## Dedicated dialogue bust addition

Root additionally approved the native 96px bust on Oct 26 after observing that a
crop from the 60px battle body was too sparse beside detailed NPC portraits.
`dist/hero-portraits/brock-96.png` is mechanically cropped/resized from the already
user-approved horned master (not a new generated design). Its runtime manifest
exposes only the consumed 96px asset. The 192px inspection/source export stays at
`art/brock-redesign/horned-bust-192.png`, outside production. Full provenance is in
`art/brock-redesign/portrait-manifest.json`; `node brock-portrait-tests.mjs` checks
source/output hashes, exact nearest-neighbor export, RGBA bounds and transparent
horn safety borders. Integrator owns the dialogue-only direct-bust descriptor;
selection, HUD, equipment paperdoll and all 25 battle frames remain unchanged.
