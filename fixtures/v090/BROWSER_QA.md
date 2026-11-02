# Integrated browser QA — v0.90

2026-11-02, official managed Sites preview at localhost:4173, Chrome tab 11.

- Exported the pre-existing stopped Chik level-60 QA save using Settings → Export before loading a fixture. No storage internals or deletion used.
- Imported `qa/v090-stones/stone-furnace-ready.json` through the regular file picker and confirmation.
- Furnace → Divine showed one stone and first-clear 50/100/150 rules. Selected weapon 王蓝剑盾. Preview attack216→432, armor43→86, HP144→288.
- Used the normal confirmation button. Stone balance1→0; gold171 unchanged. Hero attack986→1202 and armor628→671. Selected weapon marked 神赐; repeated-use button disabled with 已获得神赐.
- Reloaded, re-entered furnace: stone balance0 and derived hero attributes persisted.
- Imported the exported original save through the regular picker and confirmation. Verified Chik level60/chapter9, gold142, XP548/4800, attack449, armor238, HP1799/2077, stopped expedition — identical to initial visible state.

Special-affix numerical effects, failure/double-click atomicity and milestone/offline/old-save cases are covered by the actual App DOM and engine regression tests; this browser pass did not claim those actions were manually simulated.
