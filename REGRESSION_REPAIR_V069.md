# Current-mechanics regression repair

Base: `a5a77d4b888b998d7fb54349d258fb639d2ef11f`. This repair changes tests,
fixtures, the catalog audit, and the inventory runner only—not gameplay or art.
It does not authorize publication or imply browser-layout verification.

## What was stale

- The retired armor SVG renderer still intentionally owns 28 historical dwarf
  drawings. The catalog now contains 36 dwarf armor identities. Keep all 28
  primitive/uniqueness/safety assertions, prove appended IDs are unsupported by
  the old renderer, and retain the separate complete current raster gate.
- The retired dwarf SVG renderer covers A01–06 (26 identities), not the A07–10
  raster lifecycle. All 26 are checked, and later IDs explicitly return no SVG;
  current A07–10 native battle/render tests still exercise all 18 identities.
- Current codex contains 224 monsters (44 dwarf, 173 expansion, seven legacy),
  not the pre-expansion 51. Ordinary equipment remains **52 per race**, plus
  three Ashen cores and 60 set parts. The separately approved Return Ring adds
  one race-neutral story legend: **336 definitions, 13 legends**. Both story-only
  legends are explicitly checked; none is added to ordinary random sources.
- Whole-engine v0.61 hashing predates approved story/war/quest features. The
  historical v0.62 engine boundary is still verified from Git; unchanged focused
  equipment budget/rate modules remain hash-pinned, and current generators,
  fusion, trader, equip and settlement behavior retain their executable checks.
- Only the explicitly approved Brock/neutral sprite lifecycle paths use the
  v0.68 approved revision for preservation hashes. Other historical PNGs retain
  their original byte comparisons.
- M2 material forge expects hero level **±2**, including levels above100, with
  raw budget capped100 and source level equal to the actual roll—not exact137.
- The potion parity hand-written online driver now advances the world-event
  clock just as the App/offline host does. Full-state equality remains strict;
  no fields are discarded to hide discrepancies.
- Three Goblin suites resolve the current checkout rather than a vanished
  sibling worktree. Map art QA loads exact raster assets asynchronously. The
  equipment contact sheet allocates enough rows for all64 dwarf entries.
- Historical M3/M4 providers are archived from exact published Git commits,
  with independent hashes and provenance. Missing prepublication JSON bytes
  are **not** claimed recovered. See `fixtures/dwarf-providers/README.md`.

## Inventory and reproduction

`node tools/run-regression-inventory.mjs` discovers all317 root regressions,
including the two `test-*.mjs` map suites, and runs each in a fresh process. It
continues after failures, writes separate logs and a final JSON report under
`/tmp/rpg-regressions-*`, and exits nonzero for any failed suite. Optional filename
arguments select explicit suites; unknown names fail rather than silently skip.
`TEST_CONCURRENCY=1..8` controls concurrency (default2). The original `npm test`
release aggregate remains unchanged. Root race gates also invoke nested suites.

The initial isolated scan found232 passes and83 failures among315 named
`*-tests` root suites:15 MJS and68 CJS failures. All15 MJS failures were stale
fixtures/boundaries above; no production bug was needed to fix them. The two
additional map tests pass. Repaired MJS verification totals229/229. The independent
UI-repair branch reports87/87 non-browser CJS suites passing; its commit is
`7a24348`. The remaining browser-only exploration suite is environment-blocked,
not passed, and must not be bypassed or called verified.

- Race aggregate: **64/64 PASS**, process exit0.
- Fourteen formerly failing MJS suites: **14/14 PASS** in one isolated rerun;
  the fifteenth is the64-gate race aggregate above.
- All10 M3/M4 content/material/runtime/activation/reward suites: PASS.
- Inventory runner: positive result, real failing-suite exit1, and unknown-name
  rejection verified; syntax check passes.
- Full `npm test`: **PASS, process exit0**, completed 2026-10-27 02:46 UTC.
  All173 referenced suites completed;183 PASS-prefixed output lines plus
  additional successful summaries. The original shared-realm/import order was
  retained, so this is not merely a collection of isolated focused passes.

Terminal logs are held by the task executor at `/tmp/regression-npm-repaired.log`,
`/tmp/races-repaired.log`, `/tmp/repaired-regression-logs/results.json`,
`/tmp/full-regression-logs/results.json`, `/tmp/ui-all-final-inventory.jsonl`, and
`/tmp/ui-all-final-logs/`. These are actual test results, not browser screenshots.
