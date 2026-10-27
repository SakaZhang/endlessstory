# Final invasion leader source

Generated with the built-in image generation tool for the authorized unfinished mainline, 2026-10-27. This is an authored visual identity, not a new named plot character.

Prompt: A single whole-body dark medieval 16-bit pixel-art demon invasion leader facing left. Broad obsidian carapace, swept horns, asymmetrical armored shoulders, clawed hands/feet, restrained violet fissures, segmented tail, no wings. Combat-ready neutral stance, transparent alpha background, no ground or text. Distinct boss, not a priest or ordinary fauna.

Master: invasion-leader-master.png. Runtime: dist/story-assets/invasion-leader.png, mechanical nearest-neighbor import to 176 × 176 inside a 192 × 192 transparent canvas. Actual alpha bounds [17,11,181,182], solid bounds [17,12,181,181]. Faces left; do not use the old right-facing actor metadata. Parent inspected master and runtime pixels. Browser appearance remains separately unverified.

## Central ritual arena (2026-10-27)

Generated with built-in `image_gen`, opaque backgrounds, then inspected at source and in the actual native production battle renderer. No web/third-party source.

- Open master: generated image `exec-0c735b2d-9421-4c87-9900-6f2b82615ac4.png`, 1774×887. Prompt: “dark medieval16-bit pixel RPG central ritual altar wide2:1; single central dais/broken concentric arch, dim violet rift, four engraved conduits from distant directions; flat lower stone combat platform, no characters/UI/text; slate+violet.” Stored as `central-ritual-open-master.png`.
- Closed master: built-in imagegen edit of the open master, image `exec-59dc6c1a-8bd0-46bd-941a-95a64316c157.png`, 1774×887. Prompt: preserve exact composition/architecture/pixel art, remove upper center swirling rift/vertical beam, extinguish four conduits/floor energy, central dais inert no orb, ambient purple twilight retained. Stored as `central-ritual-closed-master.png`.
- Runtime transform: crop `[120,80,1534,767]`, nearest-neighbor resize to the established logical 480×270 canvas. The crop positions the stone platform under existing feet baseline203 rather than on its front fascia. Character positions, facing and target geometry are unchanged. Reproduce/check with `node tools/build-story-finale-backgrounds.mjs [--check]`.
- Exact scenario-only mapping: C10.X05 open; C10.X07 closed, across all five POVs. Camps, ordinary A07, prior C08 and all other encounters retain their existing background. The final stage cannot visually reopen the canonically closed portal.
- Hashes and dimensions: `central-ritual-manifest.json`. Actual native two-phase/five-POV composite: `qa/story-finale/five-povs.png`; inspected for actor feet, hero identity, boss facing, open vs closed portal, and no clipped actors. This is not browser evidence.
