# Human reflection armor revision

- Replaces the development-only `human-last-banner` amulet with `human-banner-armor` (遗旗 · 不坠之誓), armor/armor_armor. The oathblade is unchanged. No old-item compatibility or migration was added; integration owns the development-save generation reset.
- Existing registered factory remains four random ordinary q4 affixes plus one fixed exclusive; higher-than-Supreme bases, own-race repeatable boss pool, one aggregate base 5% roll unchanged.
- Each enemy damage segment returns 50% of its **actual mitigated HP loss + actual absorbed shield**, without a second armor/resistance calculation. Enemy shields can absorb the returned amount. No crit, lifesteal, execute, cast count, chance roll or recursive reflection hook.
- Direct attacks use existing shield-first settlement. Existing incoming burn/bleed retain HP-only settlement and therefore reflect actual HP loss only. Approved percentage poison retains its separate shield-first path; no global DOT redesign was introduced.
- Incoming DOT records its actor ID. Same skill from distinct actors no longer conflates sources; missing/dead sources do not redirect reflection to a selected target. Legacy fixture burn also captures the source actor.
- Lethal damage returns its capped amount before death/Nirvana resolution. Reflection cannot revive either participant; legacy enemy lifesteal now explicitly requires the attacker still living after reflection.

## Verification

- `node tests/races/human/legendary-tests.mjs`
- `node tests/races/human/legendary-host-tests.mjs` (imports reflection host + catalog gates; repeated 3 times)
- `node tests/races/human/legendary-offline-tests.mjs` (33s exact online/offline state/event parity, equipped sword and armor, source-bearing DOT)
- `node tests/races/human/banner-comparison.mjs` (diagnostic comparison, no tuning claim)
- Ordinary counter/Nirvana/multicast, enemy timed reflection, production skill host, poison shield-first, legendary factory/drop/production suites pass.
- `npm run test:races` passed all 45 suites twice, including the final code.
- `npm test` on requested baseline 7726e28 is blocked at stale engine-v4-tests.mjs assertion `version === 3` against current version 4. Existing parent fixture repair is outside this patch.

The 3-hit test calls the exact production segment adapter with an equipped factory item and one cast ID: current registered enemies have no multi-damage-effect skill. Real basic, typed skill, DOT, boss and enemy-counter flows are tested via E.step. No claim of an existing 3-hit enemy skill is made.

Armor raster/icon is a separate coordinated art commit; this patch does not reuse an amulet silhouette. Integration must include that commit and verify actual item/codex art routing before delivery. Nothing was published.
