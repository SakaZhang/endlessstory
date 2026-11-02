# Otherworld control stability (v0.87)

## Root cause
The 250 ms battle HUD refreshed the entire portal control host with `innerHTML` whenever rendered HTML differed. Browser serialization could also differ from the source string. A battle starting/finishing changed the long switch/exit button labels; flex wrapping then moved controls. Replacing the host during a held click removed the original target. Conditional reward and storage-warning rows changed the height above the battle viewport.

## Fix
- The active panel now updates existing text nodes/attributes; it does not replace action buttons or the floor input during combat, rewards, or automatic floor changes.
- Only entering/leaving the portal mounts/unmounts its structure. Auto-toggle and reward claim inside the active battle now also use local updates. The normal explicit page-navigation lifecycle is unchanged.
- Floor input keeps focus and an unsubmitted draft across refresh, including blur. Focus/input marks a draft explicitly, so automatic progression through the same number cannot erase it later. An untouched value follows automatic floor progression; the maximum always updates.
- Switch/exit labels are fixed. Busy information has a dedicated reserved row; the equipment claim and storage-warning rows remain mounted. Empty claim is disabled.
- Controls use a stable responsive grid and no pressed/hover transform. Numeric stats are tabular and cannot expand the grid.
- No engine, reward, offline, action transaction, or save data changes.

## Verification
Ten focused commands all exited 0: `otherworld-stable-ui-v087-tests.mjs`, `otherworld-ui-display-tests.mjs`, `otherworld-core-tests.mjs`, `otherworld-routing-tests.mjs`, `otherworld-progression-tests.mjs`, `otherworld-loot-offline-tests.mjs`, `otherworld-offline-rejection-tests.mjs`, `otherworld-balance-tests.mjs`, `otherworld-app-ui-tests.cjs`, `live-battle-lifecycle-tests.mjs`.

New stable-node regression covers 40 alternating busy/rewarded updates, unchanged button/input identity, typed draft and focus, changing maximum/current floor, pending count/disabled state, auto flag and pure state preservation. The existing integer display assertions were updated only for the added named DOM targets.

Managed browser preview used the actual production render/update functions and CSS in an isolated test page, with 250 ms transitions between busy/won, floor 9/10, and pending reward 0/1. A real 390 px iframe ran 233 transitions with zero node replacements, zero control coordinate/size change and no horizontal overflow. A 1.2-second held click across several transitions was received once. A typed floor `2` remained intact across subsequent ticks. Desktop was also inspected. This is production-component browser QA, not a claim of a complete real-game playthrough or physical mobile-device testing. The full App's fake-DOM entry/pause/reload/queued exit/claim tests passed separately.

Evidence: local ignored `qa/otherworld-stable/` (screenshot, temporary harness, regression log). Temporary preview files are not source or shipped assets; the managed preview was stopped, browser tab closed, and build recreated from source.
