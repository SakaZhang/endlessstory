# Automatic preparation actions

`dist/idle-action-controller.js` owns a single browser-session intent, never serialized into schema-6 saves. The host pumps it before the next encounter can start. A live encounter settles normally; a dungeon completes all three stages. No encounter, RNG, reward receipt, HP, cooldown or carry is reconstructed or erased to make an operation possible.

The controller accepts `action(candidate, now)` for an atomic existing clone/save/adopt mutation, or synchronous `execute()` for a pre-existing sealed transaction with its own stale-snapshot checks. The latter commits safe suspension, runs the unchanged transaction, then restores continuation; failed operations remain stopped. If an operation succeeds but continuation cannot be saved, its result remains `applied` with `resumeReason`, not a failed operation to retry.

Only an initially running route grants continuation. An unfinished paused fight is not silently resumed. Existing explicit stop intent wins. Ordinary travel while idle remains noncombat travel; explicit battle-start actions retain their meaning. A running travel action resumes the destination route. Equipment retains the current route. Normal 1.8-second recovery remains intact; `waitForReady` delays explicit encounter-start operations until that clock expires.

Multi-step conversations hold a session token. Active story scenes additionally block continuation even when other equipment actions occur. `release()` cannot bypass an unfinished story scene. Manual Stop, stop-after, camp withdrawal, import/reset, and page leave invalidate pending actions and continuation. Reload cannot replay a callback or a reward.

Pure module coverage: `node idle-action-controller-tests.mjs`. Independent behavioral coverage: `node auto-idle-safety-tests.mjs`. App integration tests are separate. No schema change or engine routing guard relaxation is needed.
