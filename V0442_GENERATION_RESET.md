# v0.44.2 — Development save generation reset (release candidate)

## Explicit scope
The user explicitly requested discarding all old development saves without backups, and removing their migration-only code. This release starts schema 3 at `ashencrown-v3`. It is not a numerical rebalance or an A04 art release.

On first successful initialization, the game writes a valid new generation and removes only `ashencrown-v1`, `ashencrown-v2` and keys beginning `ashencrown-backup-`. It never calls `localStorage.clear()`. It never restores retired data. Existing valid v3 bytes survive reload. A cleanup/read/write failure blocks gameplay, offline simulation and periodic save; retry preserves an already-written v3 rather than resetting again. Invalid v3 is reported, not silently replaced. Current-generation manual reset/import transactions retain rollback on failure.

Removed: old-save backup creation/list/restore, pre-import backup, developer grant and eligibility, exact historical weapon display whitelist, prepared-tree/legacy snapshots/activation migration, old skill auto-unlocks, old route handoff/drain, old paid-reforge rules, the unreachable single-enemy resolver and old `bless` +2-stat enhancement. Factories retain `bless:0` only; nonzero values are rejected. Current inventory requires the complete factory budget/template/provenance/source-range metadata. Missing fields are rejected rather than backfilled. Current raw values/source ranges, divine once-only derivation, item origin/provenance, formal enhancement and paid result transactions remain current rules, not expendable compatibility.

## Test retirement is explicit, not a skipped failure
| Retired old-entry suite (current assertions transferred) | Current replacement |
|---|---|
| storage-tests, storage-clear-no-backup | storage-generation-v3, storage-real-retired, save-generation-app-ui, clear-restart-ui |
| live-battle-legacy-hero, live-legacy-weapon-app-ui | real retired factories reset test; live-battle-view and A01/A02/A03 real App tests |
| skill-progression, skill-unlock-ui, skill-slot, skill-expansion, skill-ui, skill-tree-loadout-ui | current tree state/selector/active-integration and skill-tree UI/App; 99 points, 4+2, DAG/cascade, draft/three presets |
| support-grant and support-grant-ui | m2-support-eligibility (fresh 100 gold/no grant), talent/current refund tests |
| location-foundation, dungeon-routing, offline-combat, dungeon-carry | current M2–M4 activation/rewards, tree active integration/dungeon carry, current dungeon-carry UI, continuity/rest and real online/JSON/offline tests |
| old monster-codex | dwarf-monster-codex, actual integrated codex UI and 44-monster current registries |

Mixed suites were adapted, not discarded: economic fusion/raw/source/forge pending, merchant, inventory capacity, current rest/continuity, current map progression, transactions, resources, potion expiry and rendering. Final counts/logs will be recorded after the complete final run.

## Combat floats
Numbers precede a smaller, purpose-designed pixel glyph (not emoji or platform font symbols). Fire and shield are suffix glyphs, with existing colours and signed actual deltas. Criticals still differ only by font size. The shared normal/preview renderer is used. Root reviewed `/workspace/shared/combat-float-icons-v0442/after-3x.png`; it is a controlled delta illustration, not a natural-play recording or browser QA.

The explicit isolated developer workshop remains a current opt-in feature; its separate candidate enhancement model does not migrate or admit retired user saves. Normal formal enhancement stays unchanged.

## Unchanged
Content-hashed whole-resource namespace; private site/access; A01–A03 exact sprite coverage (13 monster IDs plus juveniles), other regions honest fallback; all ten gameplay regions; source restrictions; no automatic story/endgame implementation. A04 and later art assets remain outside this release.

## Gates
Pending final source freeze, current full regression, independent review, and explicit root deployment authorization. No deployment yet.
