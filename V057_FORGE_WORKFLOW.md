# v0.57 forge repair slice

- Fusion slots, converge animation and result now live inside the upper pixel workshop scene. The material/equipment picker stays below as inventory, not a second forge. Mobile crops the scenery using cover, preserving all five controls and the output within the scene. No old oversized gray anvil placeholder.
- Successful persisted pending claim clears the output, input presentation and claim actions. Full bags and failed storage keep the paid pending result. Ordinary auto-stored results explicitly say 已入装备背包 / 已入药剂背包 and offer 收好 · 继续融合.
- Fixed recipes already had correct atomic batch support in the engine. The UI now makes it discoverable: +/−, editable quantity, capacity-aware maximum, and healing shortcuts for 1 / 10 / 50 bottles with same-quality material allocation. Each batch is still one quote and one persisted transaction. No quality RNG or blessing added.
- Maximum quantities consider both roles sharing one material stack (two units per bottle), gold, 999 cap and the item-stack capacity. Manual quantities retain the existing all-or-pending overflow behavior. No partial charging or partial batch claim.
- Strengthening costs are deterministic, not random: ceil((2 + equipment level / 20) * (1 + 0.2 * quality index)) times [1,2,3,5,8] for target +1..+5. Quality index is 0..4. A level20 supreme item costs 5,10,15,25,40 by tier. Failure lowers level, so the next target tier and fee can decrease. UI shows current → target and explains this without a large table.

## Evidence
- recipe-batch-limits-tests.mjs: exact shared-role quantity, selected quality, gold/material/capacity boundaries, all four healing qualities and fee schedule.
- forge-workflow-app-ui-tests.cjs: actual production App click/change handlers for batch controls, upper-scene containment, exact spending, quota failure rollback, double-click/no-RNG, maximum stack capacity.
- pending-forge-ui-tests.cjs: strengthened successful claim assertions: no result icon, no has-result style, no claim action. Existing full-bag, save-failure and exact-once tests retained.
- Existing recovery-recipe-ui, potion-expansion-ui, potion-forge-ui, formal-enhancement-ui, forge-animation and pixel-services-live-app-ui suites passed.
- forge-workflow-native-proof.mjs generates actual scene renderer + production icon native compositions with the CSS geometry, including 960px and320px input/converge/result/claimed states. These are NOT browser screenshots. Browser/mobile layout QA remains a separate gate.

## Additional approved slot and transplant repairs
- Equipped socket labels are 戒指左 / 戒指右 throughout SLOTNAME consumers and equip actions. Stored IDs stay ring1 / ring2. Items, drops, inventory family and donor matching stay the one generic ring slot.
- Modification and formal enhancement now start with a shared seven-slot selector, then only that slot's candidates. Direct enhancement from an item detail selects its known slot. Worn targets sort before other candidates, with the backpack E corner badge; both worn rings lead the one ring category. Existing within-group order is stable and physical item IDs are de-duplicated.
- 替换一条 is now 词条移植. Donor admission is enforced in engine eligibleReforgeDonors by item.slot === target.slot, not just hidden in UI. Wrong-slot attempts return before RNG or spending. Equipped/locked/preset-protected donors remain excluded.
- Ordinary affix raw value and sourceRange are inherited exactly. Existing paid candidate receipts still resolve without a new charge or reroll; the new admission rule does not invalidate already-paid pending receipts.
- Existing donor test fixtures were changed to the target's matching slot so their original raw/range/divine/cost/protection tests remain meaningful. New reforge-same-slot-tests and forge-slot-picker-app-ui-tests cover forbidden wrong slots, rings, selector order and E markers explicitly.
