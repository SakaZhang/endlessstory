# Elf equipment parity and independent pixel art

Based on `7f6d9417`. No publishing or changes to the live worktree.

- Exactly 52 ordinary templates: 8 bows + 8 staves; 6 each helm, armor, gloves, boots, ring, amulet.
- 12 set parts and two legendaries remain separate.
- Added 14 templates without replacing any old ID, name, stat budget family, set effect, legend effect, or source policy.
- Replaced the duplicate helm 5/6 and armor 5/6 artwork; gave all 12 set parts independent matching artwork. The two legends also previously reused ordinary icons, and now have independent artwork.
- 32 newly generated raster icons, each extracted at 32/48/64 with alpha bounds and nearest-neighbor scaling. Existing unique art remains untouched.

## Art provenance and inspection

Built-in `image_gen.imagegen` (not API/CLI or procedural raster painting), transparent output. Three requested contact atlases are preserved in `qa/elf-equipment-parity/sources/`. Extraction coordinates are preserved in `extraction.json`; reproducible integration script: `node tools/extract-elf-equipment.mjs`.

Prompt set: transparent pixel RPG contact atlases, complete isolated equipment with generous margins and no labels, grid, panels, ground shadows, or text; crisp hand-pixelated dark silhouettes readable at 64px; elegant young Elf forest-priest culture using root wood, moon silver, jade leaves and ivory cloth.

- Weapons: 5 columns × 2 rows. First row willow/dew bow, gold fern ritual bow, dark vine/white feather bow, crescent birch/purple bud bow, legendary homecoming sweeping moon-silver/emerald bow. Second row jade fern branch staff, suspended blue dew orb staff, amber flower staff, forked-root violet seed staff, legendary sixfold crystal heartwood sun-crown staff.
- Ordinary: 5 columns × 2 rows. Deep-green root hood, silver star-fern circlet, charcoal copper-sprout tunic, cream/silver echo coat, silver teal-leaf gloves; violet root-leather crescent gloves, ivory fern-laced boots, purple-petal dark root boots, jade-seed willow pendant, amber-flower ivory-crescent pendant.
- Sets: 4 columns × 3 rows, circlet/coat/gloves/boots. Leafstring: emerald/sage/ivory, silver arrow-feather motifs and sweeping leaves. Mooncourt: lavender/silver, six-color crystal prisms and crescent motifs. Heartwood: warm living roots, moss, amber seed cores, growth-ring motifs.

Reviewed all source atlases and the native full 66-item contact `qa/elf-equipment-parity/all-66-native.png`. It uses the actual production raster/frame helper, not a browser screenshot.

## Verification

`node elf-equipment-parity-tests.mjs`: exact counts; all previous template objects and set/legend definitions preserved byte-for-value; 66 distinct decoded 64px pixel hashes and distinct source paths; alpha/visible pixels at every native size; all 14 additions observed in real drop, fusion and trader outputs; unchanged stat budgets.

Also passed six-rings catalog, equipment-template, equipment-budget-adapter, set-source (20k fusion +20k trader batches, no sets), Elf actual set host, Elf actual legend host, and race-art-routing tests. Full race gate passed all 56 tests, recorded separately in `qa/elf-equipment-parity/race-gate.log`.
