# v0.57 · 战斗与操作修复

This release is the user's eleven-item repair list plus the subsequently approved six equipment/forge refinements. It does not add mainline story or open other races' gameplay. Existing schema-3 saves remain on the same origin and key, without clearing or migrating retired test generations.

## Battle and exploration
- Physical damage uses the signed value without a redundant down arrow. Element, poison and shield pixel suffixes remain. Real fractional healing displays a small decimal rather than +0; zero actual recovery is silent. 吸血 is the equipment/attribute label. No lifesteal coefficient or cap was increased.
- Actual camp/return state selects one of five distinct territorial pixel camps. Fresh dwarf games start at camp, successful departure leaves it, defeat/manual rest returns to it. Pausing in the field is not a false return. Other-race camp assets are prepared, not evidence of playable other-race content.
- The selected map area offers start-idle/start-battle actions. Advanced, opt-in current-area dungeon/boss repeats honor independent success cooldowns (5/30 minutes); complete the current encounter or three-stage dungeon before selecting the next ready destination. Boss priority, then normal dungeon, otherwise current-area field. Offline uses the same router. Explicit stop-after-dungeon waits for the full run.
- Only owned life-potion qualities appear in the upper-right battle settings, with high/low-quality preference and the existing 40% threshold. Functional potions can be used directly from the bag. All still share the existing 10-second cooldown.

## Skills
- Three branches and shared nodes use a clearer grouped layout; four active/two passive choices align with release-condition controls.
- Draft edits may be prepared during battle, but applying remains blocked until safe. Actual level gains refresh earned points without recreating the editor or dropping edits. External configuration changes remain conflicts. Lv1 has 0 points; costs and the 99-point tree remain unchanged.

## Forge and equipment
- Five input positions, convergence and output live inside the upper workshop scene. The lower region is the item/material picker, not a second forge.
- A successful persisted pending claim clears the output and action; full bags or failed storage preserve it. Already-stored ordinary results explicitly say so and can be dismissed without duplicate rewards.
- Fixed potion recipes expose quantity, +/- and maximum controls; healing offers shortcuts. Exact material quality, shared-input quantities, gold, stack capacity and existing atomic/pending rules are retained.
- Enhancement quotes show the current and target tier. Fees remain deterministic by item level, quality and target tier; failure lowers the tier and therefore may lower the next fee.
- Display worn rings as 戒指左 / 戒指右. Item families, drops and bag remain generic ring.
- Modification and enhancement pickers filter by slot first, sort equipped targets first and mark them with a small E. Selecting worn targets does not waive the existing combat guard.
- 替换一条 becomes 词条移植. Donor item.slot must equal target item.slot, so left/right ring sockets remain compatible. Locked, worn and loadout-protected donor exclusions remain. Donor raw value/sourceRange are preserved exactly; no value reroll or quality-range clamp. Already-paid pending receipts are not discarded by the new admission rule.

## Verification scope
Focused module and actual-App handler tests cover atomic saves, rollback, cooldown, repeated clicks, online/offline automation, live skill drafts, same-slot donors and current save validity. Full exact-SHA npm and every CJS test are required before release. Native camp renderer images and native workshop compositions are visual evidence, not browser screenshots. The live site is owner-private; no permission changes or authentication bypass were attempted. Whole-page browser/mobile rendering remains unverified.

A pre-existing stochastic set-damage comparison was reproduced with a natural Reaper weapon (seed 6): the warm-up killed its target before the requested comparison cast. The test now isolates the set effect from unrelated random special procs and asserts a new actual cast and surviving warm-up target. Game Reaper behavior is unchanged; failure and fixed-seed evidence are retained separately.
