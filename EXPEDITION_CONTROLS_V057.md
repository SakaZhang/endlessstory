# Map expedition controls and owned life potions

User-approved correction replaces prior manual-only boss rule. The selected map node preview has Start Idle / Start Battle and a persistent advanced section. Opt-in current-area dungeon and boss checks are stored in expedition.autoDungeon / autoBoss. Absent fields mean off. Ready boss precedes ready normal dungeon, otherwise the same area's field; no new area hopping. An active encounter or three-stage run is never interrupted. Independent success cooldowns remain 5 / 30 minutes. Defeat has no reward cooldown and resumes only after the 5-minute rest when enabled. Offline uses the same authoritative router.

Explicit stop from the skill editor uses stopAfterDungeon for a running three-stage run, not a single stage; reward stops after final clear, defeat cancels resume. Both app click-handler paths preserve a mounted skill-tree draft. Camp headings recognize atCamp or active rest and current territory; camp art/lifecycle belong to the separate camp patch.

Battle no longer renders the lower route and potion panels. The top-right potion popover shows only owned healing qualities, high/low priority and the 40% auto trigger. Empty inventory says no life potions and has no inert drink action. Automatic potions now always select healing, independent of a prior buff carry choice. All owned functional potions have direct Use buttons in inventory. Shared 10-second cooldown, effects, duration/replacement and actual stock accounting are unchanged.

Validation:
- expedition-automation-tests.mjs: real engine, synthetic weak test-only provider for deterministic 31-minute online/offline comparison (2 bosses, 7 ordinary runs, 619 field encounters; exact kills, gold, cooldowns); live dungeon carry, explicit stop, failure/rest and save validation.
- expedition-controls-app-ui-tests.cjs: actual app mocked DOM controls, atomic checkbox save failure, preview vs commit, top-right owned-only, direct bag use and doubleclick cooldown.
- battle-potion-owned-tests.mjs: empty state, owned-only, direct buffs, high/low and independent auto-healing.
- Existing adjacent-region-tests + actual app, potion-catalog, potion-expansion, potion-expiry-parity, potion-tests and stop-after pass.
- Full npm gate started separately; do not treat it as passed until integration runner exits 0.

Old UI assertions expecting every buff inside renderPotionSettings or the lower potionPanelHost are superseded: verify renderPotionInventory for buff cards and top-right life settings for auto. Existing generic renderPotionPanel remains a pure legacy export, not used by the live battle. No full browser screenshot claim is made by these DOM tests.
