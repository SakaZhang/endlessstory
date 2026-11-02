# v0.90 — sets, divine special affixes, and first-clear divine stones

This release retains v0.89 single-border presentation and all earlier runtime features.

## Approved scope
- A3–A10 ordinary field wins gain an independent 3% set roll. Whole normal dungeons increase to 15% and bosses to 25%; otherworld remains 20%.
- All fifteen sets receive one numerical strengthening pass. The previously approved total caps remain seven poison stacks, eight rock fragments and 125 heat.
- Divine items multiply the primary numerical effects of random special affixes by two. Reaper is 2%, shelter is 60%, multispell is 30%, knowledge is 100%, momentum is +200% (threefold total), and Nirvana allows two revivals per encounter / entire normal dungeon. Same-name effects take the strongest equipped multiplier, not additive stacking. Growth effects retain stored kill counts and multiply derived benefits and maxima. Legendary exclusive effects are excluded.
- New first clears at otherworld floors 50, 100, 150, … award one divine stone each. There is no retroactive grant for a legacy highest floor. Replays do not grant stones.
- One divine stone grants permanent divine status to a selected eligible owned item in the furnace, with no additional gold charge. Already-divine equipment is rejected without consuming a stone. Neither ordinary nor special affixes are rerolled by this operation.

The fifteen-set tuning coefficients are implementation decisions under the user's explicit request to strengthen all sets, not a claim that the user individually authored every coefficient.

## Verification
- Engine/App suites cover first-clear stone grants, legacy highest baselines without compensation, already-won legacy pending floors, unfinished migrated fights, replay/reload/offline idempotence, all eight full equipment bags and quality filtering, storage failure/retry, and furnace repeated use.
- Divine special tests cover strongest-source aggregation, independent growth counters, two-use revival carry through a normal dungeon, and nonlethal story combat preservation.
- Acquisition tests include 2,000 real field settlements across all five races and deterministic source/luck boundaries. Exact fifteen-set coefficients and 35 same-seed old/new tower comparisons are recorded under `fixtures/set-v090/`.
- Normal-browser furnace grant, reload persistence and original-save restoration are recorded in `fixtures/v090/BROWSER_QA.md`.
- Container packaging metadata tests: 7 passed. No Docker image has been built or pushed in this release preparation.

Final integrated regression and publication receipt remain pending; this document is not yet a deployment claim.
