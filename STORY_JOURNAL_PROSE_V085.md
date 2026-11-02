# Player journal and story display cleanup

The journal previously rendered its stored ledger text directly. Ledger text participates in strict save validation, so this patch does not rewrite historical records or progress. `story-journal-copy.js` resolves verified knowledge IDs to current player-facing text. All 189 catalog entries are covered; 129 received newly written prose, while the remaining entries resolve to the current canonical text rather than stale historical wording. Seen/heard/confirmed labels and source provenance are unchanged. Unknown IDs fall back, but the actual journal is rendered only for validated story state.

Legacy C08.O01 remains a report of sounds from inside the seal, not participation in the new rescue. New C08.O13 describes the protagonist outside and Lemus with the wedge inside. Ring knowledge lists required old objects without implying they are owned. High-priest creator history and motive remain attributed to his speech.

Also cleaned actual display paths for evidence人物 cards, personal callbacks/reward labels, family relocation notices, scenario objectives/results and live combat log text. Scenario/save ledgers stay unchanged; exact presentation replacements are applied to text shown to the player. War warnings preserve access restrictions without revealing future invasion/unlock scenes. Necessary no-loot, cost, retry, saving and item-consumption warnings remain.

Validation passed:
- `story-journal-prose-v085-tests.mjs`: 189 knowledge entries, all scenario labels, 38 immutable historical saves, five real-controller C08 completions, unchanged state/provenance, corrupt-record rejection, legacy heard vs new participant distinction.
- `story-player-prose-v084-tests.mjs`
- `story-copy-compatibility-tests.mjs`
- `story-c08-runtime-tests.mjs`
- `story-finale-runtime-tests.mjs`
- `personal-arc-runtime-tests.mjs`
- `story-war-opening-tests.mjs`
- Independent review and rerun of the new journal test passed. Two initial wording risks were corrected: ring objects not necessarily owned; wedge held internally by Lemus.

Extra standalone `main-cast-tests.mjs` fails its existing actor-count snapshot at line 27 on the unchanged story baseline too (v0.84 added rescue dialogue). This test is not imported by the aggregate tests.mjs. Its unrelated counts were not weakened. Only its later obsolete expectation of developer prose was updated. Baseline evidence /tmp/main-cast-baseline.log.

Browser integration fixture: `qa/journal-v085/old-ledger-goblin.json`; it is a synthetic legal C08-complete save with old developer text still in its immutable ledger. Import in an isolated QA profile, open the journal, and verify natural text with heard/seen labels. This fixture is not a user save. Browser/final build/full-suite verification is owned by the integrating agent.
