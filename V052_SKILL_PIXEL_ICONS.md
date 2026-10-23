# v0.52 — 21 canonical skill icons

## Normal production coverage
- All 15 active + 6 passive node IDs map one-to-one to original 32px transparent PNGs; 64px detail rendering is exact 2x nearest-neighbour.
- Tree nodes and its four active/two passive editor slots, quick plans (first equipped active), saved-plan four active/two passive summaries, normal live battle HUD, isolated preview HUD and selected preview details share the same registry.
- Unknown/empty IDs render a neutral empty slot. Unsaved quick plans do not borrow draft skills. Unlearned tree nodes keep full-color art with a small pixel lock and visible 未学习 state; disabled actions remain disabled.
- Names, cooldown numbers, conditions, point costs, requirements, editing/confirmation/reset/loadout transactions are unchanged. No new skills, effects or slots.
- Dark scatter-ash and resilience icons use approved #1b2e40 backing, no full-image opacity dimming. 32px native art, no 48px interpolation.

## Scope / evidence
- Source artwork: `/workspace/shared/pixel-ui-skills-complete/manifest.json`, SHA256 a4909aee5731627c448541fb311f6db1288eee7a70ab2842f42943eded8ae661.
- `skill-pixel-icons-tests.mjs`: exact 21 IDs/unique art, source CSS graph, native32/nearest64, safe unknown IDs, no RNG/state effects; native contact sheet at `qa/skill-pixel-icons-v052/all-21-native-slots.png` is static production-art QA, not browser/App screenshot.
- `skill-pixel-consumers-tests.mjs` and `skill-pixel-hud-tests.mjs`: every consumer identity, empty/locked state, names/CD and state/RNG immutability.
- `skill-tree-app-ui-tests.cjs` extends actual App transactions with all21 and saved-plan/quick icon assertions; existing draft/cancel/failed-save/reload/refund coverage retained.
- Resource namespace release graph now 473 files / 471 URLs / 936 edges, preserving normal save origin and key.
- Browser whole-page/mobile visual QA remains unavailable; native art, actual App DOM and static CSS sizing assertions are not presented as browser screenshots.
- Equipment48 refinement is a separate later package. Schema3, 44 battle creatures, maps, service scenes, combat events and number-first pixel type glyphs are unchanged.
