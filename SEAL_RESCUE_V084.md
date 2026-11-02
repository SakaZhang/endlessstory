# C08 seal rescue correction

## Current route

- For human, dwarf, goblin and ashen protagonists, the new route is C08.O11 → O12 → O13 → X01. The first two battles target **被封印的莱姆斯**, use his elf/staff appearance with visible binding marks, preserve his life and suppress execution/kill-growth rewards. Each stage has its own receipt and retry point.
- The final core does not open through ordinary damage. The explicit **协助莱姆斯使用旧制楔钉（消耗1件）** action represents the protagonist holding the seal from outside while Lemus consumes the wedge he received from the forest keeper. It does not invent prior ownership by another protagonist. Only this successful saved action sets E_UNSEALED and E_RESCUE_WEDGE_USED.
- Elf retains E01 → E02 → E03 self-liberation and its existing protected old-wedge ownership/consumption contract. First/second layer presentation now uses seal art, not ordinary local fauna. The renderer adapter is read-only so historical active save payloads remain valid.
- Story fights have no gold, XP, field loot or monster-detail link. Failed second stage does not reset first stage. Wrong targets, stale actions, failed storage and repeated use cannot consume the wedge twice.

## Compatibility boundary

The old O01 scene and receipt contracts remain historical. Completed O01/X01 saves are not rolled back. A save already active in old O01 may finish that old encounter and advance normally; it is not migrated mid-battle. All not-yet-started rescues use O11/O12/O13. Legacy O01 is neither offered nor launchable for new progression. X01 accepts either the historical completed O01 or new completed O13 ledger.

## Verification

Passed locally:
- story-seal-rescue-tests.mjs (four complete new routes; nonlethal identity; explicit tool; quota/wrong-target/duplicate/reload/retry guards; historical pending/completed O01 preservation; elf read-only visual override).
- story-seal-rescue-native-proof.mjs (real production renderer; actor key and screenshot checks, not browser screenshots).
- story-c08-runtime-tests.mjs and story-c08-app-ui-tests.cjs (all five POVs through C07/C08 with real controller/App event handlers).
- story-scenario-combat-tests.mjs, story-event-controller-tests.mjs.
- story-cancellation-app-ui-tests.cjs, story-portrait-recovery-tests.mjs.
- war-story-access-tests.mjs, random-war-story-access-tests.mjs.
- live-battle-lifecycle-tests.mjs, live-battle-scoped-loading-tests.mjs.
- tools/build-story-copy-compatibility.mjs --check.

Native evidence and importable synthetic fixtures are generated under qa/seal-rescue. They contain no user save data. Real browser QA and aggregate final release verification belong to integration and are not claimed by this note.

Additional verification: story-c08-native-proof.mjs passed. v067-cross-system-tests.mjs fails at its historical NPC response assertion (line 20); the identical failure was reproduced on untouched casino baseline 12bb0b8. It is not counted as passing or as introduced by this change.

Browser-follow-up correction: authored scenarios now display the story-scene title and “剧情战斗/剧情交手”, not the underlying field node's idle labels. The core uses a disabled “请使用剧情道具” control beside its explicit one-use action. Ordinary boss/rest/stop-after controls are hidden only during authored scenarios; underlying locations and battle rules are unchanged. Five-POV App UI assertions, cancellation and live-renderer regressions passed again after this change.

Lemus art identity was checked: elf RACE_PACK.heroName is 莱姆斯; the encounter uses the same art.hero.staff → hero-elf-staff asset as the playable elf with a staff. It does not use a generic fallback. Existing cross-race art proportions were not globally changed.
