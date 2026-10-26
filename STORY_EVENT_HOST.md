# Canonical story event host — C01–C06 integration milestone

Not published. Base live v0.64 (`2a77f9e`); named-scenario commit `7b35ed5` integrated as `3ad7632`.

52 scene definitions map the reviewed C01–C06 script to the selected hero's POV. Existing map nodes are implementation hosts, not new canonical geography. No dialogue teleports the player; actual `siteId`, unlocked area, safe stopped state and prerequisites gate every action. The five routes end with mandatory `C06.RR01.<race>` recipe learning, independent of materials. A deferred full spring investigation still requires the authored C02 E00B repair before C03 and may be revisited later.

`story` is an optional strict schema-6 ledger. Scene completion order, choices, knowledge provenance, exact derived flags and encounter receipts are validated on real `Engine.validSave`; no current save conversion, old-generation migration or public set-stage/set-flag action exists. Every dialogue frame is saved, and next-frame cursor quotes reject duplicate/stale DOM clicks. World Ring opportunities do not give absent POVs secret knowledge or remotely award materials.

The four named duels use real combat. Other clearance/escort objectives require a new real local field victory after accepting the scene; arbitrary UI completion cannot satisfy them. No named duel gives farm rewards or ordinary death rest. C05 Ashen core is a closed authored receipt, generated deterministically at the level snapshotted when accepting the duel, then received/equipped/completed in one transaction. Full core bag and failed persistence preserve the scene for retry. Existing core swaps and loadouts remain valid: the upgraded original cannot be returned as the transported relic, not a permanent equipment-slot lock.

## Shared App integration

- Import `renderStoryEventBoard`, `renderStoryKnowledge`, `storyActionFromDataset` from `story-event-ui.js`.
- All parsed actions, including `scenario` and `encounter`, use `transactStoryEvent(storage,current,action,{now,afterCommitCandidate})` after flushing outstanding gameplay state. Adopt only a successful returned game. The exact stored snapshot is checked; this synchronous localStorage boundary is not cross-tab CAS.
- `afterCommitCandidate` is an imported trusted callback, never a user dataset function. Ring integration should call `syncReturnRingRecipe(next)` there, before validation and write, so permanent recipe knowledge commits with the canonical scene flag.
- Successful encounter/scenario actions adopt `s.activeEncounter` and show battle view. Render `renderStoryScenarioNotice(e)` there. Branch on `e.storyScenario` before normal loss/reward text on completion; the engine already records outcomes and ends the scenario without normal loot/rest.
- Ordinary `rewardDwarf` records the actual victory after its rewarded guard, before clearing the active encounter. Named scenarios have their own guarded receipt before finalization. Unexpected recorder rejection becomes a safe retry, not successful story completion.
- Journal knowledge is read-only evidence, not the progression interface. The functional interaction host belongs in the actual region/NPC panel.

## Verified

`story-event-controller-tests.mjs`: five complete POV routes with real engine combat and save/reload; source-gated knowledge; optional repair fallback; current map/race/safe-state gates; strict malformed ledgers; once-only/stale cursor/snapshot; quota/read rollback; guaranteed material-independent recipe; full-bag and quota-safe deterministic story core, core swaps and pending-forge independence.

`story-scenario-combat-tests.mjs`: all four real scenarios through the strict controller, pause/reload, retry, offline, named hero art/roster, ordinary Reaper unaffected, no reward/codex farm.

Also passed task transaction/engine boundary, current save generation, Ashen core, M2 Reaper shield, region navigation, live battle adapter and multi-battle UI tests. These are model/mock-DOM/native tests, not yet an integrated App browser proof. Shared NPC worker owns App hooks and that remaining verification.

## Remaining

C07–C10 reviewed script is not yet hosted by this milestone. No war start, seal, ritual, ending, random-war schedule or endgame unlock is silently simulated. C07 declaration is the next separate integration patch. Ring material awards, recipe fabrication and approved probability rules remain owned by the Ring worker.
