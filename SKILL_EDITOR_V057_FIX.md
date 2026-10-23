# Skill editor repairs (user items 6–7)

## Corrected behavior
- The previous UI disabled every tree interaction during an expedition. Draft editing is now available while combat continues, but committing to the real skill tree remains blocked until the expedition and current encounter/dungeon have ended. No live skill or equipment switches occur from draft edits.
- Skill budgets no longer stay at the level captured when opening the editor. Level gains update the earned budget without clearing allocated draft nodes or equipped draft slots. External allocation/loadout changes still produce a stale-configuration warning and block overwriting.
- The App no longer recreates the editor after each battle reward, a rest settlement, or a stop request. These paths refresh the live budget/blocked status while preserving the same editor instance and pending draft.
- The tree is grouped into three named branches and shared skills. Every node shows its real cost, prerequisite and unlock/point-shortage action. Top/bottom application actions and an immediately visible status replace the formerly buried explanation.
- Four active slots have fixed icon / skill / release-condition columns. Two passive slots use aligned icon / skill columns. Narrow layouts stack sections instead of wrapping individual form controls unpredictably.
- Root skill costs remain unchanged (minimum 3). Level 1 has 0 points; level 2 has 1; the first 3-point skill can be unlocked at level 4. No test/dev points are granted. Entire tree remains 99 points, three independent presets, four active/two passive slots, free skill reset.
- The top stop button uses the existing `data-stopafter` integration. The expedition worker owns normal-dungeon completion stop semantics and `stopAfterDungeon`; the skill renderer already recognizes its pending state.

## Verification
- `node skill-tree-editor-regression-tests.cjs`: actual App handlers and 250 ms interval harness; fresh Lv1, Lv2, Lv4; no live draft mutation; 200 actual combat ticks; stop preserves mount/draft; successful post-stop atomic save.
- `node skill-tree-live-budget-tests.mjs`: mounted live-level growth, draft preservation, combat commit rejection, no unchanged-poll DOM replacement, external config conflicts.
- `node skill-tree-app-ui-tests.cjs`: existing actual App quota/save rollback, cancel, reload, slots, preset switching, health reconciliation.
- `node skill-tree-ui-tests.cjs`: existing combat assertion intentionally updated to permit local draft changes while asserting unchanged real tree and zero extra commit calls.
- `node skill-tree-layout-v057-tests.mjs`: static exact 21-node identity, branch assignment, 4/2 slot/condition structure, desktop/narrow CSS constraints.
- `node skill-pixel-consumers-tests.mjs`: canonical pixel icon consumers, no renderer RNG or state mutations.

These are actual App/module handler tests and static layout checks. They are not full browser/mobile visual QA or screenshots.
