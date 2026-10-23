# v0.44.1 — existing-save pixel entry compatibility

Scope remains A01–A03 (13 canonical monster IDs plus A02 juvenile variant). No A04 assets or gameplay changes are included.

- Display-only legacy weapon resolution restores the historically generated exact weapons to their documented hammer appearance. No inventory field, raw value, skill weapon branch, ID, or storage key is rewritten.
- The publication build places the entire resource graph (ESM modules, CSS, manifest and images) under a deterministic content-hash namespace. Root index and preview URLs remain unchanged and same-origin. A refreshed new entry cannot combine its dependencies with cached unversioned v0.35 modules.
- This does not erase browser data or require a fresh character. Unknown weapon identity and uncovered areas still use honest fallback.
- Native rendering and actual App test evidence are not full-page browser QA. The reported user's exact region/weapon/cache remains unknown until confirmed; old v0.25 weapons independently reproduce a genuine compatibility failure.
