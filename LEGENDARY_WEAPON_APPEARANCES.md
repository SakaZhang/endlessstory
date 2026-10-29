# Legendary weapon appearances — v0.78

## Corrected production design

All five races have eight body-only animation frames for each of five legendary weapons (25 combinations, 200 frames). Each legendary ID uses one immutable original equipment PNG from the catalog. Race data may set a grip, rotation and one uniform whole-weapon scale per group; it cannot replace the weapon file, change its color, reshape individual parts or invent a different crown/guard. The foreground hands are re-rendered from the real body pixels inside small reviewed clip areas.

The canonical bow retains its original limbs, leaves and grip. A common runtime clip removes its baked string and isolated red speck; one shared string definition supplies fixed nocks and the draw point. Living right-facing poses have the string behind the grip and draw toward the body; a whole-actor mirror reverses the relationship correctly. Release/recovery do not retain a drawn string. There is currently no added arrow-image layer, rather than substituting a backward arrow.

Battle, camp and portrait use the same layer renderer and union bounds. Scoped loading includes the original weapon; unequipping and switching clear stale body/weapon references. Ordinary weapons do not borrow these legendary-specific poses. This does not implement ring/amulet/core/armor full-body equipment overlays.

## Review corrections retained

The initial baked-weapon atlases were rejected after the user identified cross-race weapon identity drift. Geometry/loading tests alone did not establish that the same object was held. Their first contact sheet and acceptance were withdrawn.

A second review missed seven reversed human/elf bow idle, recovery and hurt poses. Those were rotated around the real grip, not fixed by moving hands away from the weapon. A dedicated bow-direction test and five large directional review sheets were added. The earlier freeze was revoked. Neither rejected appearance version was published.

## Focused verification

- `shared-legendary-weapon-tests.mjs`: all 200 production draws use the exact canonical image/hash once, no per-frame scale or replacement file; bow clipping preserves limb/leaf/grip pixels; obsolete baked runtime assets are absent.
- `legendary-race-art-tests.mjs --require-shared --render`: all25 groups, native rendering, portrait, camp/field, equip/unequip, hidden/loading scopes, dimensions and facing.
- `bow-direction-tests.mjs`: five races, seven living states, right-facing and mirrored geometry. Death is reviewed separately as a non-firing pose.
- Hero proportions, race routes, neutral fallbacks, scoped loading and gold-vs-supreme presentation remain covered by existing tests.

The parent visually inspected both the corrected full-race contact sheets and all five dedicated bow-direction sheets. Final full-suite, browser and publication results are recorded separately; source completion is not a deployment claim. Generated sources, prompts, extraction settings and review contact sheets remain in the local QA directory; production uses only body assets plus original catalog weapons.
