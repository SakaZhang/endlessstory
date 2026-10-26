# Random war clock and invasion ceasefire boundary

Base: verified live v0.66 `ddfcc1993a38574a2631916519d94e861c674b9f`; isolated `feature/random-war-expiry`. User explicitly capped random map locks at one hour and approved a story-timeline ending when the C08 outside invasion turns both sides toward resisting demons. Story wars are not put on a one-hour timer.

## Actual random producer, not only an API

`random-world-events.js` is called by the real App's visible tick and before click actions using the existing guarded clone-save-adopt transaction. It also runs in `Engine.offline` before combat replay. Initial authorized balance is one 1% trial per eligible ten-real-minute checkpoint, a uniform allowed race pair, and an integer 20–60 minute duration. One random war globally; no duplicate active story pair. An exact check at a prior random war's end is ineligible, providing a real gap instead of extending a continuous lock. These are initial tuning constants, not immutable narrative canon. Luck, potions, gear and combat/drop RNG do not alter this stream.

The event RNG, next checkpoint, last processed timestamp and sequence are persisted. Initial RNG state is a stable hash of existing save identity and its initial timestamp, not a draw from loot RNG. A failed save never adopts the declaration or advances its RNG; retry produces the same event. Events use scheduled timestamps, not the login instant. The actual App's newer-save/read-only-block guards remain in the write path.

## One-hour hard bound

New records store `kind:'random'|'story'`. Random records require an explicit `expiresAt > startedAt` and `expiresAt-startedAt <= 3,600,000`; malformed imports, invalid duration and duplicate/global overlaps fail. `startRandomWar` is a strict explicit-duration API. Existing valid schema-6 scripted records lacking `kind` retain their scripted meaning without a reset or migration routine; new story starts explicitly write `kind:'story'`.

All ordinary entry/field/dungeon/boss/route previews check the requested time against the random interval, including before an expiry is persisted. Online tick and resume settle expiry. Clock rollback ends random locks immediately, with zero grace, never extends them and never runs negative elapsed checks or a reroll burst. It does not end a story war. This is a local-clock safety policy, not an anti-cheat claim or trusted network-clock guarantee.

An admitted battle, including a paused one, is preserved. If its territory remains locked at settlement, enemy auto-farming stops; if the random war already expired, normal access is restored. No forced teleport, healing, extra rest, loot loss or cooldown reset. Existing explicit withdrawal and exact registered story entrances remain.

## Online/offline timeline

Resume processes the same independent schedule from its own oldest pending checkpoint, at most 24 ten-minute checks (four hours of checks). Autosave/pagehide/health timestamps cannot erase a pending checkpoint just because their timestamp passed its deadline. It does not draw for months or years of absence. Expired incidents from that window are summarized rather than appearing as new login-time locks. The scheduler skips unprocessed time beyond the cap and schedules the next eligible check ten minutes after return.

Timestamped random intervals remain available while the real combat router replays that window; only afterwards are ended random records older than four hours pruned. `prunedTransitions` preserves the ledger revision invariant without retaining every historical event. Story records are retained. This preserves both bounded save size and the evidence needed to deny farming during an earlier part of the replay, even if the war is over when the player returns.

## Story boundary integration

`story-war-bridge.js` now seals the full Elf–Ashen lock end to genuine `C08.X04.<race>` completion, requiring the canonical flags `INVASION_BEGAN`, `RITUAL_SUCCEEDED`, `PRIEST_DIED_BACKLASH`. Confession `C08.X03`, first interruption `C08.X04A`, elapsed time and arbitrary UI flags cannot end it. The required late Elf entrances are individually listed for Ashen A06/A07. A random Elf–Ashen incident is superseded when canonical C07 declaration starts the story war, so it cannot block main-story completion or convert the narrative war to a one-hour event.

The story worker owns actual later C07/C08 scene/encounter content; this bridge must be tested with that commit before claiming the end is playable. Root owns integration and publication.

## Verification

- `random-war-world-tests.mjs`: strict duration/import validation; five-player identity matrix; kind separation and story supersession; independent RNG; online/offline world-history equality; <=24 checks after years away; expiry on exact entry boundary; paused battle preservation; zero-grace rollback; exact-end gap; storage retry; real combat online/offline parity.
- `random-war-app-ui-tests.cjs`: actual App declaration tick, deterministic quota retry, same-instant replay, ordinary entry rejection, visibility resume expiry and summary, newer-save protection. This is a DOM event fixture, not full browser visual QA.
- Existing NPC App and asset-recovery App suites also passed after scheduler wiring. Final combined C08 and aggregate results are reported separately; no publication is performed by this worker.

The actual-App regression also forces autosave at checkpoint +1ms before the 250ms world tick, then verifies quota retry still declares at the original checkpoint. A corresponding hidden-resume engine test preserves both due checks across newer save/health timestamps.

## Final C08/random overlap check

Combined with actual story host `c3710fb` and assertion update `1e4a68e`, all-five C08 engine and actual-App suites passed. The late human/dwarf/goblin C08 Ashen entrances are explicitly bound too, because those normally neutral POVs can become opponents in a random war. `random-war-story-access-tests.mjs` checks every current canonical cross-border binding and traverses real C07 same-pair supersession plus neutral C08 retreat/re-entry/combat/invasion completion. Ordinary field/dungeon/boss/auto and NPC access remain blocked; invasion ends only the story war, an unrelated active random war keeps its own <=1h expiry. Quota rollback and replay do not mint another outcome or reward.
