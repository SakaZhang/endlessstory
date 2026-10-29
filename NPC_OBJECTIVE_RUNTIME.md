# NPC objective runtime

Ordinary NPC errands now have authored kill, collection, or investigation contracts. The existing mainline, personal/family narrative decisions and five Return Ring errands are not rewritten.

## Lifecycle

1. The player accepts at the actual giver's unlocked, accessible area while not fighting, running an expedition or resting.
2. The active journal exposes the authored objective and live progress away from the giver.
3. **Kill / clearing:** only matching initial non-follower, non-summoned monster actors from the exact authored source nodes count. The engine captures actual alive-to-dead transitions, and grants credit only when that field encounter or dungeon stage successfully settles. Losses, retreats, historical `kills`, encounter entry, reward-roll multiplicity and mock `done/win` objects do not count.
4. **Collection:** use the existing real material inventory, including already-owned stock. Progress is the current exact-quality quantity; there is no invisible pickup-counter grind. Nothing is reserved or consumed until explicit turn-in. Higher quality is never silently substituted.
5. **Investigation:** perform each authored checkpoint action in its actual unlocked area while safe. Checkpoint IDs are distinct and once-only. Map preview, historical exploration and simply entering a combat node do not investigate anything. Present-time war access applies, even if a caller supplies an old timestamp.
6. Return to the giver. Eligibility, current inventory, capacity, costs, fixed rewards, resolved state and claim ledger commit atomically through the existing task transaction. Failed writes, capacity errors and stale snapshots leave the caller and stored state unchanged. Already-paid claims cannot repeat.

## Compatibility: no reset, schema/save key unchanged

`npcEvents.version = 1` and the exact seven-key legacy entry format remain. Existing old active contracts retain their original response, count, costs and rewards; old resolved/declined/paid entries stay untouched. A repeatable old contract upgrades only when the player accepts its next cycle.

A fresh modern entry reserves `lastEncounterId: "npc-objective-contract:v2"` as a structural marker; it never records a binary `choiceId`. Its objective progress is separate:

```js
npcObjectiveProgress: {
  version: 1,
  entries: {
    [eventId]: {version: 2, cycle, count, checkpoints: [], receipts: []}
  }
}
```

The marker and objective record must agree in both directions and match the cycle. Missing/corrupt progress cannot silently downgrade a modern task into an old response-only task. No migrations clear or rewrite existing progress.

The content overlay preserves legacy fields and adds `objectiveVersion`, `taskObjective`, and modern-only description/dialogue/completion/rewards. Effective display accessors choose the correct contract; sealed transaction selectors independently choose the same costs, rewards and narrative-only policy.

## Combat receipts

Only the genuine production encounter start creates `npcObjectiveReceipt`. It captures start time, accepted event/cycle identities, and initial actor IDs. `engine.step` appends IDs only on an actual alive-to-dead transition. Private successful settlement matches definition IDs and source nodes and appends a bounded per-task settlement receipt. Serialized receipts resume through the same online/offline combat engine; no estimated offline kill multiplier exists. Successful settlement detaches `activeEncounter` normally, so later delivery does not retain an active receipt.

## Public UI APIs

- `npcEventDefinition(save, id)`: effective fresh/active/history definition.
- `npcEventObjectiveProgress(save, id)`: independent-of-location progress and completion, material stock and checkpoint evidence status.
- `npcEventCosts(def, save)` / `npcEventRewards(def, save)`: effective exact transaction records.
- `beginNpcEvent(save, id, now)` / `investigateNpcEvent(save, id, checkpointId, now)`: candidate mutations; UI persists through its existing transaction path.
- `npcInvestigationAccess(...)`: current actual-location, unlock, safety and war blockers.
- `npcEventReady(save, id)`: final return-and-deliver readiness, including actual giver location.

## Verification

`npc-objective-runtime-tests.mjs` exercises all sixty new contracts, actual battle steps, return/claim, exact quality, duplicate attempts, failed writes, provenance validation, reloaded receipts, offline parity and repeat cycles. `npc-event-host-tests.mjs` now uses explicitly historical fixtures for the sixty old active contracts and verifies next-cycle upgrade. Independent compatibility, App flow, content, Ring, family, mainline and transaction suites remain separate release gates.
