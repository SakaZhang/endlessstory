# Legendary drop interface — v0.34 production integration

`dist/legendary-drop.js` is imported by the engine. The actual dwarf boss reward adapter prepares a receipt with the registered item factory; normal encounter reward state and persisted RNG prevent repeated settlement. The standalone commit helper provides clone/persist/adopt semantics for explicit transaction hosts.

- `prepareLegendaryDrop(event, {probability, random, previous?, generateItem?, validateItem?})` produces a deeply frozen receipt, or `null` on invalid input/error. Event fields: `settlementId`, `nodeId`, `regionRace`, `kind`, `won`. The host must derive these from the actual settlement, not UI/player race. Eligible boss victory makes one total-pool check; a hit makes one equal-weight conditional choice. `probability` is already calculated/approved externally; this module does not guess luck.
- Candidate IDs: `first-forge-oathhammer`, `everburning-reactor`. Both now have registered production factories and combat consumers. Recipe-only uniques are absent.
- `materializeLegendaryDrop(receipt, {generateItem, validateItem})` invokes an approved item adapter for a successful descriptor. Keep the returned materialized receipt; it contains the exact generated item. Never regenerate a materialized receipt. An unmaterialized hit cannot be delivered.
- `commitLegendaryDrop(current, receipt, {isCurrentSettlement, receive, persist, validateItem})` clones current state, delegates inventory/pending delivery, stores a delivered receipt in `legendaryDropLedger[settlementId]`, and calls synchronous `persist(next)`. Adopt `result.game` **only** when `result.ok`. A failure returns the same receipt for retry; do not call the RNG again. Retry clones the latest current state, preserving updated clocks and unrelated inventory. Already-delivered same events are no-ops. A conflicting or no-longer-current event is rejected.
- `receive` must implement the game's approved full-bag contract and return `true` only for accepted delivery. No discard/overflow compensation is invented here. Ordinary/set rewards remain untouched and coexist.
- Reload: pass the saved receipt as `previous`; no probability or item reroll occurs. The host must retain ledger identity for its settlement lifecycle; never delete history while that settlement can be replayed. There is no guarantee for an unsaved receipt lost by a browser crash; no save means no adopted reward.

Production integration is covered by legendary-production-tests.mjs, equipment-runtime-production-tests.mjs and luck-production-tests.mjs. Release still requires the frozen aggregate and independent gate; this document is not a deployment claim.

Verification: `node legendary-drop-tests.mjs`.
