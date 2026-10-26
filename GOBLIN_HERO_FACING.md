# Goblin hero facing correction

Baseline: live v0.64, `2a77f9eceee8f77a0e39429d6c40513f7c230395`.

## Cause and bounded fix

- The user's supplied selection-screen screenshot was materialized through the current Library workflow and visually inspected. It shows 奇克 facing left while the other four selectable heroes face right.
- All 22 original Goblin hero PNGs were inspected: dagger 9, sword 9, neutral 4. They are genuinely left-facing; their existing facing metadata is correct.
- Battle and camp already apply the correct orientation through `battleSpriteFlipX`. That renderer, its targeting, per-frame rules, anchors, and monster behavior are unchanged. A hero appropriately still faces left when its opponent is on the left.
- The missing paths were the selection card's raw `<img>` and `drawLiveHeroPortrait`, used by the HUD and equipment doll. Both now read the same authored frame/sprite facing rule and display the hero toward the right. The selection transform touches only the image, not text or the card. Canvas reflection is scoped by save/restore.
- No PNG, asset identity, hero name, scale, proportions, weapon choice, combat rule, RNG, save key, schema, or development generation was changed. Generation 6 saves are preserved; no reset/migration was introduced.

## Verification

- `node goblin-hero-facing-tests.mjs`: 44 actual native portrait renders across all five races at HUD/equipment sizes, exact expected pixels, same source images and aspect ratio, selection markup/CSS, all 22 Goblin frames in camp and both battle directions with normal/reduced motion (132 draws), fixed anchors, transform isolation, state/manifest immutability. Added to `tests.mjs`.
- `node named-hero-selection-app-ui-tests.cjs`: actual App-produced selection markup, five identities, accessible controls, existing restart confirmation/cancel and storage failure behavior, reload/persistence.
- `node hero-proportions-tests.mjs`: all native/neutral proportions and anchors preserved.
- `node monster-facing-tests.mjs`: 1,132 native draws, all 44 monster identities and three follower variants; unchanged frame orientation, target side, fixed anchors, RNG/state behavior.
- `node racial-camp-scenes-tests.mjs`, `node race-neutral-hero-tests.mjs`: actual routing of camp/battle/portrait variants, including foreign/empty weapon fallback.

## Visual evidence

`node goblin-hero-facing-native-proof.mjs` writes reproducible evidence under ignored `qa/goblin-facing/`:

- `source-22-frames.png`: unchanged originals, left-facing.
- `selection-before-after.png`: actual selected asset/scale/facing helper outputs; only 奇克 changes orientation.
- `hud-before-after.png`, `equipment-before-after.png`: actual production portrait renderer against baseline for dagger, sword and neutral.
- `camp-facing-22-frames.png`: unchanged production battle/camp renderer, all 22 frames facing right.
- `selection-markup.html`, `evidence.json`: corresponding markup and evidence scope.

All five PNG proofs were visually inspected and independently reviewed. These are native Canvas proofs, **not browser screenshots or browser layout verification**. Prior Chromium launch was blocked by socket `EPERM`; no browser workaround/retry was attempted. No push or publication was performed by this task.
