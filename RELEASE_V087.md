# 长路未尽 v0.87

## Delivered scope
- All ten dwarf area landscapes are newly generated coherent pixel environments, replacing the legacy floating-platform presentation. Camp and gameplay remain unchanged.
- Elf hero identity redrawn across 20 native and 40 legendary-weapon body frames, with exact alpha bounds, feet, body scale, and weapon hand anchors. Existing canonical weapon images and stats are preserved.
- Goblin A10 now has its missing final-region boss, 群穴菌王 · 古根. The existing goblin legendary pool drops at item levels 93–97 and the existing total base probability of 5%. Other races' final boss tables are unchanged.
- Otherworld controls use stable DOM nodes and layout across battle updates, retain user floor drafts, and support normal queued floor/exit/claim behavior.
- All 60 set pieces display their canonical set prefix consistently. Stored item identity, paid transaction fingerprints, stats, effects, and save schema are unchanged.

## Verification
See component reports DWARF_SCENES_V087.md, ELF_REDESIGN_V087.md, GOBLIN_FINAL_BOSS_V087.md, OTHERWORLD_STABLE_UI_V087.md, and SET_NAMES_V087.md. Integrated verification covers all 315 registered test files in stages (initial run, 249-file continuation, and exact failed-fixture reruns), plus the eight focused v0.87 suites. Stale catalog/art/version snapshots and isolated VM helper injection were corrected without weakening gameplay invariants. A real legendary bow hand-anchor metadata mismatch was fixed under the original strict test. Final release verification checks 3,054 file hashes, 3,052 resource URLs, 8,852 graph edges, 11 byte mutations and 12 invalid-reference mutations. This is staged complete coverage, not a claim of a single npm test exit 0.

Actual full-app browser QA verified dwarf map/battle, elf bow/staff/legendary and sealed Lemus, goblin A10 boss appearance, legacy set-name inventory, and Otherworld claim/start/victory/auto-advance/farming/queued exit. The prior local QA save was restored via normal import, the test tab closed, and managed preview stopped. Evidence remains under ignored qa/v087.

The Site remains owner-private. Docker inputs are prepared for v0.87 but this release document does not claim a registry push or user-server update.
