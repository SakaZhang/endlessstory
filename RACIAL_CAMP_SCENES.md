# Racial camps

User feedback item 2: returning to camp must show a real camp, with different racial territories having different scenes.

## State
- `atCamp` is an optional boolean in current schema 3, no save generation change, no clearing.
- New game starts in camp; accepted `startRest` enters camp; successful real encounter entry leaves camp.
- Pause/stop in the field does not silently return to camp. Rest completion alone remains in camp; automatic next encounter leaves it.
- Existing current saves with absent flag remain field unless actually resting. Existing active rest resolves to camp from `restUntil` without rewriting the save.
- Territory is read from current `siteId`, not selected hero race; retained site/route is not replaced by homeland.
- Five terrain assets are available, while only the existing dwarf gameplay is enabled. Other territory renders are presentation fixtures, not fake playable content.

## Art
Built-in image generation, five separate images, normalized by Canvas nearest-neighbor to 480 × 270. No old primitive scene fallback. Five unique detailed environments: dwarven stone/copper refuge, human canvas border camp, elven ancient-root shelter, goblin patchwork ravine camp, Ashen basalt/crystal refuge. No baked characters or text. Existing live character sprite and compact head HP bar are drawn separately. Per-territory foot baseline is calibrated to actual floor.

Prompt common specification: production horizontal 16:9 Japanese pixel RPG backdrop, fine crisp pixel clusters, dark blue/slate and warm amber light, side-on slight elevated camera, layered depth, unoccupied left character ground, no characters/creatures/UI/text/borders/watermarks. Racial setting descriptions match the five environments above. Built-in image generation was used, not a third-party asset pack.

## Tests
- `racial-camp-scenes-tests.mjs`: current save acceptance, no absent-flag teleport, rejected start does not leave, pause stays field, accepted rest enters, rest completion and auto resume, five read-only actual renderer frames, missing art honest notice.
- Existing real App lifecycle test additionally asserts correct camp background at fresh/rest and field at paused battle.
- `qa/racial-camp-scenes/*.png`: actual production renderer via native Canvas, not browser screenshots.
