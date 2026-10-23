# M2 set comparison fixture stability

The intermittent `fault_sweep` versus expected `fracture_strike` assertion was a fixture isolation error, not a camp or combat regression.

The test generated an uncontrolled supreme weapon. It could legally carry Reaper. Raising target HP to one billion did not prevent the approved instant-kill proc: a priming sweep killed the target, and the next real engine step correctly did nothing in an ended encounter. The test then read the previous cast.

Reproduction: start the original test with Date.now = 1770000000000 and LCG seed 6 (`1664525 * state + 1013904223`, unsigned 32-bit divided by 2^32). The normal factory creates an axe with Reaper, without forcing its special. During `damageAt(2, 'fracture_strike')`, the second round's sweep deals 579 ordinary damage and 999997913 Reaper damage; `done=true`, `lastCast.skillId='fault_sweep'`. The third step is a legitimate no-op.

Fix is test-only:
- Seed factory/drop/encounter randomness and item-identity clock. Optional `M2_SET_FIXTURE_SEED` allows explicit additional coverage.
- Remove the comparison weapon's unrelated random special, leaving ordinary attributes and valid current metadata intact.
- Assert every equipped item in the comparison has no unrelated special.
- Assert priming has not ended the fight and the measured action produces a new actual cast ID.
- Preserve all real acquisition, source, gear numeric-equality, 2-piece damage and 4-piece damage assertions.

Seeds 1–4 cover both axe and hammer; seed 6 is the exact naturally failing regression seed. No engine, balance, proc probabilities, or production item generation changed.
