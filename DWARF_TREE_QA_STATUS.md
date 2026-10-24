# Expanded dwarf tree QA status

- PASS `dwarf-expanded-tree-tests.mjs`: 30 nodes, 21 active/9 passive, 99 points, dependency DAG, reachable nodes and non-overlapping geometry, gated pure migration and no unrelated state changes.
- PASS `skill-tree-editor-regression-tests.cjs`: actual App DOM harness, zero-point starter, inspect does not spend, draft updates during battle, repeated rewards preserve draft, safe-stop permits atomic apply. Assertions updated for compact selection-first UI, not removed.
- PASS `skill-tree-layout-v057-tests.mjs`: legacy fixture layout coverage retained.
- PASS `dwarf-expanded-host-tests.mjs` against integrator main (TREE_HOST_ROOT): 18 new active casts through production multi-combat, 3 weapon branches, actual effects/HP/cooldowns/cast counts/HOT/JSON continuation, all three passive hooks and threshold/exclusion behavior.
- PASS native visual inspection: compact DAG proof, side-lane edges skip optional passive cards, detailed generated32px skill sprites. Files `/workspace/shared/dwarf-expanded-tree-proof/steel-native.png`, `new-icons-2x.png`; these are **not browser screenshots**.
- BLOCKED actual browser rendering: installed Chromium launch aborts in `process_singleton_posix.cc` with `socket() failed: Operation not permitted`. No browser screenshots were produced; no escalation/path workaround attempted. Repro script is `dwarf-tree-browser-proof.cjs`, configured for normal Chromium sandbox. Successful browser QA remains required in an authorized usable environment.
- PASS representative29/44/50pt allocation and actual-host utility review in DWARF_BUILD_POINT_REVIEW.md. Early usable focused4A2P costs20–24; practical flexible44pt hybrid has11A3P choices. No claim of globally optimal build or mandatoryLv45 minimum.
- PENDING user migration approval: pure skill-only conversion helper exists; not connected to player loading, no save reset performed, no publication.
