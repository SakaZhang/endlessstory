# Task reward transaction boundary — not a quest release

Base: `752cdf4578ee9af95e1531cefd53aeee352d132f` (v0.63).
Approved Roadmap revision 98, block `71636589-b007-4acc-8298-6e28c0d86156`: a full reward bag leaves a task claim available; submitted materials and completion commit atomically once capacity permits; task claims are independent of the forge pending result.

## Included

- A separate callable service, `dist/task-reward-transaction.js`, using the real inventory/capacity/collection/discovery and transactional storage paths.
- An explicitly empty production registry: every production task claim currently returns `not-available` without a write. No quest definitions, sources, dialogue, UI, economics, reward rolls, or hidden-legend effects have been invented.
- An optional `taskRewardClaims` completion ledger; existing current-generation saves need no conversion. No old-save migration.
- Submission rechecks eligibility and aggregate required materials; reward batches and the claim ledger all commit together. Full capacity, unavailable unique materials, invalid definitions and failed writes leave the caller and storage unchanged.
- Task rewards ignore battle auto-discard and never use or clear `pendingForgeClaim`.
- A persisted-current-snapshot precondition rejects a snapshot already stale at submission. This synchronous localStorage service does not provide cross-tab compare-and-swap or multi-writer serialization. Future UI integration must persist any outstanding gameplay changes first. A claim already recorded in storage remains rejected even if the caller holds an old unclaimed snapshot.

## Minimal engine integration (applied in v0.64)

`dist/engine.js` imports the validator and exposes only the sealed production claim:

```js
import {validTaskRewardState} from './task-reward-transaction.js';
export {claimTaskReward} from './task-reward-transaction.js';
```

At the start of `validSave(s)`, inside its `try`:

```js
if (!validTaskRewardState(s)) return false;
```

The module's engine references are used only inside callable functions, not during module initialization. Its default service captures only an empty registry. Keep the production registry empty until approved story definitions arrive. Only trusted content may use the registration factory; test fixtures are not production content.

Both transaction and engine boundary tests are in the aggregate gate. No App hook exists before real quest specifications are approved. Sparse ledgers are rejected as malformed, just like explicit undefined IDs.

## Scope limits

This is transaction infrastructure, not a completed task system. There is no task activation or ready-state UI, no kill tracking, no content unlock, no event scheduling, and no hidden recipe acquisition. Hidden unique manufacturing remains separate pending work; existing standalone historical test claims do not establish production implementation.

## Audit notes

- Production gem ownership is checked per material unit in `world-materials.js` and `dwarf-material-catalog.js`; the actual engine settlement supplies an ownership check across qualities.
- Three equipment/skill plans are present in engine and App transaction handlers. Focused model tests pass.
- Existing `quick-loadout-ui-tests.cjs` fails before its first button assertion because its harness uses retired `ashencrown-v3`, not current `SAVE_KEY` (`ashencrown-v6`). This is not evidence of a production loadout regression, and that unrelated harness was not edited.
