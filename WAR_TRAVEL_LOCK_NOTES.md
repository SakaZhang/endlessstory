# War territory locks — implementation boundary

Base: live v0.64 source `2a77f9eceee8f77a0e39429d6c40513f7c230395`, schema 6, isolated `feature/war-travel-lock`.

## Evidence and decisions

- User explicitly requested implementation of war map locks. Earlier approved discussion: wars are low-probability random world events, with rates/timing/duration/story coupling to be discussed, not invented here.
- Roadmap `page_689bf5df34dc81918303b00b1f74fad2`, revision 112 read on 2026-10-26. Block `207e5629-36b2-472b-8ce4-5ef620328887` says enemy territory locks preserve exploration; finish the current battle, retreat safely with earned gains, then use accessible territory for later idle routes.
- Ten-stage contract `/workspace/shared/rpg-script-v1/canon-and-knowledge.md` read. C07 has mandatory Elf–Ashen war; C08 rescue and C09 temple return must not be soft-locked by a blanket map condition.
- No quest/story flags, precise triggers, random chance, duration, first-border unlock, scheduled war or story exemption are invented. **There is no production war-start caller yet.** The primitive is ready for approved world/story event owners.
- Latest exact safe-return destination and special-story-entry policy are pending the parent/user decision. `retreatFromWar(save, returnSiteId)` is a separately tested candidate service with an explicit validated own-race camp; it is not called by production yet. Own a01 is tested, not silently wired as a final policy.

## Implemented

- `diplomacy={version:1,revision,wars:[...]}` is validated and persisted by the existing schema-6 transaction. Fresh has no wars; a valid schema-6 save without this optional field means no wars. No reset/migration.
- `Engine.startWar(save,{id,races:[a,b]},now)` / `endWar(save,id,now)` are explicit, idempotent mutations. Callers use the existing clone-save-adopt storage transaction. A replay cannot reopen an ended event. Reusing one id with different races fails. Active duplicate pairs fail.
- `territoryAccess(save,race)` and `nodeAccess(save,instanceId)` return `{allowed,code,reason,warId?,opposingRace?}`. Enemy race is relative to the selected player's identity, not current location. Home territory and third parties remain accessible.
- Engine gates cover selected travel, route configuration, direct fields/dungeons/bosses, automatic priority/fallback, developer group admission and the shared offline router. No UI-only security assumption.
- An already admitted battle is preserved, including paused fights and unclaimed victory. After settlement no next dungeon stage/new battle starts in enemy land. Auto resume after defeat is stopped; standard defeat rest and all earned rewards remain.
- Stops blocked ongoing auto intent without auto-restarting after peace. Peace reopens entry but does not reset dungeon/boss cooldowns, exploration, favorites, unlocks or rewards.
- Map browsing and known favorites stay visible, while preview shows the war reason and disables ordinary entry/automation. No blanket quest bypass option exists.

## Tests and outstanding gate

`node war-travel-lock-tests.mjs` covers five-player identity matrix, neutral wars, invalid/sparse state, idempotency, saving and failed-write rollback, direct/indirect entry, all encounter kinds, offline zero-loot rejection, existing-fight online/offline settlement parity, paused/dead players, stale reward replay, preserved exploration/cooldowns and explicit camp candidate.

Existing route/automation/model/actual-app suites passed. Race aggregate has a historical engine-file hash assertion in `equipment-slot-parity-tests.mjs:21`: that earlier equipment-only test freezes the whole engine to an old authorized scope. This change necessarily changes the engine; the assertion was not weakened or silently rebaselined. Parent integration must explicitly reconcile that scope and rerun final aggregate tests.

Do not describe this as naturally triggered gameplay until a permitted event/story caller and the safe-return/story-access choices are connected and tested. Parent owns release/publication.

Final aggregate observations (2026-10-26):

- `npm test` terminated at `equipment-armor-art-tests.mjs:8`, 36 actual versus 28 expected armor templates.
- `node race-expansion-tests.mjs` terminated nonzero for only the historical whole-engine hash assertion; all other listed cases passed.
- Both exact failures were reproduced by running their individual tests on the untouched live `2a77f9e` checkout, not only this worktree. The base engine hash is already `6e377e55…`, different from that fixture's expected `fe7d58d3…`. Neither assertion was changed in this patch.
- Focused final checks passed: war gate; task reward engine boundary and transaction; HP/rest; current save generation; adjacent-region actual app. Earlier automation, 29 region-model cases and navigation ledger checks passed too. No browser visual or full-green aggregate claim.
