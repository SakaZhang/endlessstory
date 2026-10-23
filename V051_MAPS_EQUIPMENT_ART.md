# v0.51 map and equipment environment art

## Scope
Normal world view uses the approved world-terrain raster; five TERRITORIES anchors and existing unopened-race preview behavior remain. Unopened races show their world location and explicit unavailable notice, not a fabricated playable regional map. Dwarf current-area view uses its exact existing A01–A10 background layers with unchanged node/neighbor/preview/travel/favorite actions. Map loading/failure never restores the old geometric scenery.
World canvas and pin overlay share one 16:9 stage. The hint is outside that stage. Mobile pin labels remain readable, with concise availability plus full accessible names. Current area/boss counts are derived from the real registered ready nodes instead of stale 1–6 copy.

Equipment uses a 360×348 original empty alcove, centered/cropped at narrower widths. Existing live hero and eight row-major sockets remain; no character, item or control is baked into the environment. Old mismatched pseudo-platform is removed. The image loads independently, with local failure/retry that never blocks equip controls or replaces the hero.

## Unchanged
No engine, travel transaction, region unlock, map selection, RNG, combat event, inventory rule, schema3/save-key or probability change. No other race opens. v050 forge/merchant and v049 full battle lifecycle remain. No new story.

## Evidence boundary
Production native canvas images plus actual App DOM transactions and static geometry checks are used. Equipment preview is explicitly a native composition using actual hero/equipment artwork at CSS coordinates, not a browser screenshot. The environment does not provide successful whole-page browser QA; no permissions bypass or public exposure is authorized.
