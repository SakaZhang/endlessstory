# Named hero selection

- Central registry proper names: 布洛克 / 罗什福尔 / 莱姆斯 / 奇克 / 砾恩. Titles and short identities are separate.
- Selection cards use the actual current native weapon idle PNGs (including slim Elf bow), not generated alternate art. Shared live `heroPresentationScale` with body-reference calibration (Elf 98 / Goblin 62) and a consistent foot baseline; responsive 5/3/2/1-column rules, visible focus/hover/active, native keyboard buttons, image alt text.
- HUD, combat status, preview HUD and exported-save filename resolve the registry name.
- Original immediate card selection + existing destructive confirmation, cancel, atomic write failure, reload and stale pagehide protection are preserved.
- No balance, save migration, legacy name alias or schema change. Strict existing validator remains unchanged. Integrator owns development generation reset.

## Verification

`node named-hero-selection-app-ui-tests.cjs` exercises actual App-produced modal HTML/event flow in the established DOM shim, image paths, five names, strict invalid-name rejection, CSS contracts, confirmation/cancel, write/remove failures, each race persistence/reload and stale-save prevention. It imports current SAVE_KEY rather than hardcoding a generation.

`node named-hero-native-proof.mjs` decodes the five actual PNGs and renders `qa/named-heroes/native-assets.png`, with HTML and JSON beside it. This is native asset proof, **not browser layout proof**. Chromium launch failed with `socket() failed: Operation not permitted`; no bypass/retry. Native image was visually inspected.

Existing hardcoded Elf identity assertion in `racial-legendary-ui-tests.mjs` now expects 莱姆斯; priest title remains separately present.
