# Dwarf scene redesign v0.87

User requested the original dwarf landscapes to match the newer races' visual quality. All ten current battle/exploration areas now use complete atmospheric landscapes instead of the historical two-layer floating foreground stage. Routes, geography themes, actor baseline positions, combat and saves are unchanged. Existing dwarf camp already had detailed coherent architecture and is preserved.

## Scene direction
A01 working mine halls and ore hoists; A02 natural fissure and rope crossings; A03 ruined oath memorials; A04 ash furnace district; A05 mineral springs; A06 flooded forge; A07 silver gallery; A08 obsidian chasm; A09 runebone archive; A10 deepcore royal forge. All have a broad continuous grounded foreground, clear actor standing space, distinct middle-distance silhouettes, cold rock light and restrained warm lantern/forge light where appropriate.

## Generation and packaging
Ten separate built-in image_gen calls, no external art or API fallback. A01 used the existing ashen A03 landscape as style-only reference; remaining images used A01 for coherent pixel texture and depth, with different geography prompts. Exact generator output identities, original dimensions, uniform center crop, final hashes and files are in dwarf-scenes-v087-source.json. Source images remain under the workspace generated_images directory; all production images are persisted in dist/battle-assets/backgrounds/dwarf-v087/.

Common prompt: Production full-screen 16:9 pixel-art RPG landscape, refined crisp pixel texture and atmospheric depth; 480x270 logical composition; no characters, text, UI, border, or floating platform. Broad solid foreground fills lower 30%, clear level standing space across central 80% at 75% height. Near-ground detail subdued for actors; distinctive scenery recedes above. Scene-specific architectural/theme details are listed above.

Packaging uses uniform aspect-preserving center crop and nearest-neighbor resampling only. No procedural repainting, alpha extraction, color alteration or shape replacement. tools/package-dwarf-scenes-v087.mjs reproduces generation-output packaging. Existing legacy assets remain unchanged and declared in the runtime manifest for backward visual/test references, while live dwarf routes reference the new complete scenes.

## Validation
Passed dwarf-scenes-v087-tests.mjs (all ten dimensions/opacity/unique hashes, route equivalence, unchanged ground anchors/camps/non-dwarf routes), test-pixel-map-scenes.mjs (precise single-layer assertion updated, async cancellation and stale-navigation protections retained), adjacent-region-art-tests.mjs, racial-camp-scenes-tests.mjs and live-battle-a07-a10-tests.mjs. These native renderer/contact sheet checks are not real-browser evidence. Final release graph/build and browser QA belong to the integration task.

Before/after native 480x270 contact sheets: qa/dwarf-v087/before.png and after.png. Parent visually reviewed A01 direction before the remaining nine generation calls. No claim that the user personally approved a preview.
