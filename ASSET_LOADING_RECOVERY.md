# Image loading recovery (based on v0.65 / 3117c06)

## Evidence and scope

- Materialized Library screenshot `libfile_16474e79c9448191b7ce5c020096b784`, version 0, to this consuming workspace and viewed the actual pixels. It shows the human tree with blank skill-art slots. Every canonical human skill path exists; the 150 skill PNGs across all five races decode successfully.
- The user subsequently identified full-tree scrolling as their browser issue. **No tree layout, height, overflow, touch, branch-switch, or scrolling code was changed.** The new regression gate asserts all three tree layout files are byte-identical to `3117c06`.
- Verified packaging behavior: `build-release.mjs` namespaces all runtime files by a whole-site SHA256 and replaces the prior output. An already-open page keeps its prior `<base>` and can request an asset absent from the next deployment. This is a demonstrated build/lifecycle failure mechanism, **not a captured HTTP diagnosis of this user's exact failure**. No evidence says hosting retains prior namespaces.
- Additional concrete gaps: CSS-background skill art had no load/error lifecycle; image wrappers did not reconcile cached errors predating their listeners; scene images had no bounded automatic retry. No blame is assigned to the user's network.

## Changes

- Event-backed native-pixel skill images; no new artwork or asset substitutions.
- Shared icon recovery for skills, equipment, materials, consumables and monster portraits: two automatic retries (250 ms, then 1 s), cache-busting retry URL, explicit click/keyboard/global retry, completed-error reconciliation, and detached-node/listener/timer cleanup. Retrying artwork cannot execute the containing gameplay action.
- Map, service and battle image loaders use the same bounded retry schedule with a per-attempt timeout and cancellation. Current-scene battle concurrency remains at most six; obsolete work is cancelled and cannot repopulate the live cache.
- A failure triggers one coalesced, no-store `release-integrity.json` probe, limited to once per 30 seconds while a version mismatch is not yet known. Offline/failed version probes preserve manual recovery. A newer release presents an explicit refresh notice, **never silently mixing new images with old JS**.
- Reload is never automatic. The actual App asks confirmation about uncommitted drafts, blocks during active UI operations, attempts a normal save, and blocks reload if saving fails. Declining leaves the live draft and save untouched. No storage keys are deleted or reset.
- Existing v0.65 tabs need one deliberate refresh after deployment to obtain this recovery code; it cannot retrofit itself into already-running older JS.

## Validation

`npm run test:asset-recovery` covers bounded transient/permanent failures, explicit retry, abort/stale async, already-completed DOM errors, removal/disposal, version probe deduplication and offline failure, explicit accepted/declined reload, current-schema actual-App draft/save guards, current maps, scoped battle images, all 150 skill PNGs and existing artwork identity/immutability gates. These are synthetic DOM + native pixel tests, **not browser QA**.

Additional gates: tree layout/geometry (unchanged), current-save generation, actual-App hero selection and adjacent-region navigation, release dependency/cache graph and asset-retention policy, production build.

Final command output: `qa/asset-recovery/gate.log` (ignored local QA output).

Known baseline limits, independently reproduced in untouched v0.65:

- `tests.mjs` passes its preceding engine/economy/transaction suites, then fails `equipment-armor-art-tests.mjs:8` with `36 !== 28` (stale artwork-count expectation).
- Five older App artwork suites fail unchanged: equipment/material/consumable/monster gallery fixtures and pixel-services fixture. They are not represented as passing and were not rewritten to hide their failures.
- The current map App suite passes after updating its local filesystem image stub to strip retry query strings (real HTTP URLs already support these).
- Local preview servers were not reachable from another shell or the supported cloud-browser surface (`ERR_CONNECTION_REFUSED`). No sandbox bypass or unauthenticated private-site workaround was attempted. User browser/network behavior is not claimed verified.

No engine, save schema, story/NPC content, publication audience, or hosting retention policy changed. Publication is left to the owning agent.
