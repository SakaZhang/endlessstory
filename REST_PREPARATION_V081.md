# 战败休息：仅限制战斗

## Root cause
`running` stays true during automatic defeat recovery because it records the user's continuation intent. Noncombat UI and APIs incorrectly treated it as live combat. The idle-action controller also rejected rest and canceled this continuation when a queued operation encountered defeat. App-local `e` still references the completed defeat even though the engine clears `activeEncounter`.

## Changes
- Shared `noncombat-policy.js` separates recovery continuation from live running. It exempts only a positive recovery deadline with no unfinished encounter or dungeon run.
- Equipment/loadouts during rest use their existing atomic transactions without the idle controller's pause/resume/hold machinery. Completed local defeat encounters do not block preparation.
- Rest-aware gates cover talent allocation/refund, wisdom fruit, equipped reforge acceptance, skill-tree drafts/commit and canonical-ending stone use. Stone eligibility remains canonical and once-only; story actions themselves are not unlocked.
- Defeat cancels queued work, not the player's recovery continuation. Explicit stop still clears both running and restResume.
- Travel, new battles, consumable healing and story combat retain their existing gates. Maps and tabs remain browsable; changing actual location waits for recovery. No war gate changed.
- Preparing equipment can cap HP downward when maximum HP falls, but cannot restore HP. Recovery restores full HP only at its original deadline.

## Verification (Node, no browser/server)
- `rest-preparation-v081-tests.mjs`: real defeat then equip/save/switch builds, fruit, talent, refund, merchant purchase, equipped reforge preview/accept/reload, crafting, ending stone; quota rollback, stale quantity rejection, unchanged timer/HP/route/cooldowns, no early combat or travel, explicit stop, paused battle and original tower-floor retry.
- `rest-skill-tree-v081-tests.mjs`: real defeat; reset/cancel/commit drafts; budget integrity; stale/failed save/reload; live recovery expiry retains draft and disables editing if automatic combat resumes; explicit stop re-enables same draft.
- All 20 existing `skill-tree-*tests.mjs` suites passed.
- Existing idle-action-controller, auto-idle-safety (22), wisdom-fruit-v081, reforge-material-tiers-v081 (115), recovery, loadout, talent, transaction, war-travel-lock, otherworld-progression and otherworld-core suites passed. `node --check dist/app.js` passed.
- Two existing controller expectations intentionally updated: defeat while work is queued now preserves auto recovery intent instead of silently disabling it.
