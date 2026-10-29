# Elf monster facing pixel audit (v0.77)

Read all 44 monster identities / 220 shipped PNG frames (idle, anticipation,
strike, hurt, death) as contact sheets, then enlarged suspected mismatches.
The correction changes metadata only; no PNG or rendering code changes.

## Confirmed corrections

| Monster | Frame | Before | Actual pixels / after |
| --- | --- | --- | --- |
| elf.a02.normal.2 (回声枭) | death | left | right: head/eye/beak at right of fallen body |
| elf.a03.normal.2 (青岩甲虫) | anticipation | left | right: eye/head to right of shell |
| elf.a04.elite (月井守卫) | death | left | right: head/muzzle/antlers right of body |
| elf.a05.normal.2 (灰粉蝠) | idle | left | right: white face/muzzle points right |
| elf.a05.normal.2 | anticipation | left | right |
| elf.a05.normal.2 | strike | left | right |
| elf.a05.normal.2 | death | left | right |
| elf.a09.normal.3 (潮壳龟) | hurt | right | left: head/neck emerges to left of shell |

Bat hurt remains LEFT: its nose genuinely points left. This is not a whole-set
flip. The A05 elite uses four bat followers, amplifying the visible mistake.
Other follower routes A08 elite -> A08 normal 2 and A10 boss -> A10 normal 2
were inspected and unchanged. All four boss identities were inspected; no clear
source-facing contradiction was found.

Front-facing/biased art is not treated as a proven error: especially A01 elite
idle and A07 normal 2 crab frames. These remain unchanged pending second review.
A08 elite and A10 normal 1 intentionally have differing frame directions.

## Production rules

`battleSpriteFlipX` in `dist/battle-slice.js` reads frame facing before sprite
facing and compares the actor's displayed X with the hero's displayed X.
Enemy right of hero must face left; enemy left of hero must face right.
Live death overrides use this same renderer. `liveActorSprite` uses the explicit
follower child identity, not the parent elite sprite.

## Evidence and regression

Audit-session temporary evidence (not product assets):
- `/tmp/elf-raw-{0,8,16,24,32,40}.png`: all original 220 frames, no mirror.
- `/tmp/elf-detail.png`: five-frame rows for enlarged suspects.
- `/tmp/elf-suspects.png`: beetle anticipation, bat hurt, crab frames, turtle hurt.
- `/tmp/elf-suspects2.png`: frontal moths, A01 elite idle, A04 elite death.
- `/tmp/elf-audit-frames.json`: pre-change frame metadata.

`node elf-monster-facing-regression-tests.mjs` pins the five affected identities'
per-action source facing independently of runtime metadata. It performs 135
native production-canvas draws, both hero sides, normal/reduced motion,
melee presentation positions, death overrides, unforced attack/hurt/cast/idle
selection, anchored placement, transform restoration, and state/RNG invariance.
It also verifies all three follower routes and pins the pre-change aggregate
SHA256 of all 220 sorted monster PNG paths + NUL + original bytes:
`fa4b4cb25763f6bdba5ded56fe02452f9935d1da588af051a100abd0b33b01d4`.
This is native canvas verification, not browser video verification.
