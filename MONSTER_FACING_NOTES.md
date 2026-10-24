# Monster facing correction

- Source PNG pixels unchanged. Audited all 44 dwarf monster identities and 3 actual follower variants (47 mapped sprites) across A01–A10, including every idle/attack/hurt/death/fire-strike frame. The legacy lizard was also inspected.
- Most source art is left-facing or front/left-biased. `tablet-executioner` alone needs explicit `right` source-facing overrides for idle, anticipation, recovery and death. Its strike/hurt remain left-facing. Shield placement alone is not a reason to flip other sprites.
- The shared production canvas renderer now reads frame-facing, falling back to sprite-facing, and reflects enemy images only when source orientation differs from their current displayed position relative to the hero. Both actor and hero melee offsets are considered. Equal X or unavailable hero retains source orientation; heroes/portraits remain unchanged.
- Reflection is around the existing foot anchor, scoped to save/restore, with no image substitutions or mutation of positions, bars, targeting, float anchors, gameplay, RNG, drops or saves. Reduced motion and explicit authoritative death frames use the same rule. Cast's existing idle fallback and all animation selection are unchanged.

## Verification

`node monster-facing-tests.mjs`: 1,132 native draws, every mapped source frame, both hero sides, reduced/normal motion, image identity, fixed world anchors, canvas-transform isolation, state/RNG immutability; additional unforced idle/attack/cast/hurt lifecycle and moving-hero crossing tests.

Passed: battle-slice-tests, live-battle-lifecycle-tests, live-battle-a02-tests, live-battle-a03-tests, live-battle-a04-tests, live-battle-a05-a06-tests, live-battle-a07-a10-tests.

`node monster-facing-native-proof.mjs [output directory]` produces native actual production-renderer before/after contact sheets against baseline 0b2a28d. This is **not browser verification**. Native proof under qa/facing (QA outputs ignored by repository): executioner-before-after.png, relative-position-before-after.png, all-actors-{0,10,20,30,40}.png. Source inspection sheets are also there. Root visually agreed with the per-frame executioner classifications.

Full aggregate suite has a known missing external M3 source fixture; focused results must not be reported as a full suite pass. No browser launch, workaround, push or deployment was performed in this task.
