# Authorized development-save reset and active Dwarf30

Baseline: published v0.59 / Sites68, commit `627a39d3d21502709b980ada6dd53f38e1accc59`.

The user's latest instruction explicitly permits deleting development saves instead of preserving or migrating them. This change activates the existing Dwarf30 catalog (21 active / 9 passive, 99 total points), with three independent presets and four active / two passive slots. No combat balance, other-race pack, world-content, or mainline progression changes are intended. Dwarf set2/4 descriptions now match existing executed mechanics; no set mechanics changed.

## Save boundary
- Shared schema4 / `ashencrown-v4` governs engine validation, storage, skill draft commits, imports and export labels.
- On first successful load, a valid fresh current save is written before retiring exact `ashencrown-v1`, `ashencrown-v2`, `ashencrown-v3` and established game-owned `ashencrown-backup-*` keys.
- No `localStorage.clear`, broad `ashencrown-*` deletion, unrelated settings removal, old save import, refund, or migration.
- Read/write/cleanup failures block gameplay transactions until retry succeeds. Existing current-generation bytes are retained on reload; invalid current data requires explicit repair rather than silently resetting each visit.
- Removed the unused skill-only Dwarf migration proposal. The old node-definition file remains solely as metadata input for the expanded catalog and historical isolated test fixtures, not a second playable tree.

## Reproducible checks
`node development-save-reset-tests.mjs` includes an actual v0.59 schema3 save, cleanup canaries, repeat module reload, all five fresh races, preset/slot/prerequisite validation, storage failure/retry, explicit restart/repair, and atomic draft current-key writes.

Additional checks: `node dwarf-set-description-tests.mjs`, `node storage-generation-v3-tests.mjs` (historical filename, current generation4 assertions), `node storage-real-retired-tests.mjs`, `node current-save-generation-tests.mjs`, `node save-generation-app-ui-tests.cjs`, `node clear-restart-ui-tests.cjs`, `node dwarf-expanded-tree-tests.mjs`, `node dwarf-expanded-host-tests.mjs`, `node dwarf-expanded-feedback-tests.mjs`, `npm run test:races` (44 suites), `node release-asset-policy-tests.mjs`, `npm run test:release`, `npm run build`.

Browser proof is not claimed: Chromium failed before page execution on a sandbox local-socket permission error. One approved escalation also failed before execution in the launcher on a read-only filesystem. No sandbox disabling or forbidden-path read was attempted. Mocked App/module reload and actual combat host tests are not browser QA. Root owns publication.
