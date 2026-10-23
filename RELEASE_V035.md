# v0.35 release candidate — not deployed

## Normal UI
- Dwarf map displays the selected actual area and adjacent edge entrances, not all ten planned areas. A01–A03 remain the only playable content.
- Node clicks open a preview without changing the running encounter, route, cooldowns or RNG. Only the explicit 前往 action performs an authoritative, persisted navigation/start transaction.
- Collapsed 旅行 lists actually explored available areas. Browsing is not an action and never auto-starts field/dungeon/boss combat. Favorites store stable node IDs, show live cooldowns and also open preview first.
- Preview shows encountered monsters (otherwise silhouettes) and discovered materials only. Unknown material names/IDs/icons are not rendered. Equipment/set/legend details remain in their existing codex; this is not a new complete drop encyclopedia.
- Old set-based skill preset buttons are replaced with three named custom equipment/skill snapshots and an edit button. Existing four-slot skill ordering/conditions remain. No new skill tree or passive slots are displayed.

## Persistence and compatibility
- Optional versioned regionNavigation stores explored nodes, discovered canonical materials and favorite IDs. Existing positive held material quantities can be backfilled once; already-consumed historical materials are not guessed. Unlocking an area does not imply exploring it.
- Actual successful encounter creation records exploration. Successful accepted material acquisition records discovery; filtered/full-bag misses do not.
- Invalid/stale favorites never silently redirect. Safe historical IDs can remain visible as unavailable and can be removed.
- Node confirmation revalidates actual source, unlock, parameter availability, cooldown, rest, battle, dungeon and legacy state. A failed action leaves the old route intact. Recommended levels are not hard entry gates.
- Save, delete and apply loadout actions use clone-save-adopt. Storage failure does not later leak the failed change through periodic saving. No inventory, old loadout or equipment counters are deleted by rendering or preview.
- All v0.34 legendary effects and probability rules remain unchanged. No skill-tree/racial-forge trait, M3 region, story or event data is included.

## Verification boundary
Actual App tests use DOM mocks, not an authenticated browser. Three scene PNGs use the real production single-area canvas painter. HTML/CSS evidence checks declared layout and controls; it is not a browser screenshot or measured browser layout. Final aggregate and independent gate are required before release.
