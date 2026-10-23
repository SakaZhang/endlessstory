# v0.48 — Production UI unification, first visible pass

## Scope
- Real index/app entry: slate-and-amber pixel shell, compact icon navigation and responsive native hero disclosure. Desktop detail rail remains open; mobile starts collapsed with actual HP available.
- Inventory: fixed row-major eight equipment sockets (weapon/helm, armor/gloves, ring1/ring2, boots/amulet), icon bag and selected-item detail, accessible filters and set descriptions. Existing quality backgrounds / green set borders, legendary identity, protection and capacity rules remain.
- Forge: four labeled pixel-icon process tabs, five-input workbench, side material picker and visible costs/risks. Merchant eight-item stock and skill tree use matching components; no new transaction or skill rules.
- Original 24px integer-grid SVG icons from shared/pixel-ui-icons-v048, embedded as source to preserve immutable release graph. No emoji or platform icon fonts.

## Unchanged
Strict schema3; current saves are NOT reset. Engine, storage, combat, skill tree allocations, paid candidates, merchant quotes and all44 monster sprites remain unchanged. Pixel suffix damage glyphs and content-hash resource namespaces remain.

## Validation and limits
New pure layout/icon tests and actual App DOM tests supplement existing functional regression. Native responsive details has explicit desktop/mobile tests. Actual browser screenshots are unavailable: official cloud browser could not reach the workspace server; local Chromium was denied socket creation and the approved escalation attempt was blocked by its sandbox. We did not bypass restrictions, change site access, or manufacture a whole-page screenshot. DOM/CSS geometry checks are not a browser visual audit. The user can review the real private production entry after release authorization.

This is the first functional interface pass, not a claim that every secondary dialog or all UI artwork has received browser-level visual QA. Main-story content is unchanged.
