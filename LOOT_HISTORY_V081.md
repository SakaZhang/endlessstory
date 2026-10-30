# v0.81 separate battle and loot histories

- Battle button/view retains attacks, skills, statuses and outcomes; settlement reward notes no longer flood it.
- Loot button/view reads optional `lootHistory.version=1`, newest 100 actual successful encounter settlements. Each includes encounter ID, timestamp, source/region, dungeon stage/tower floor, XP/gold separately, and named/quality/quantity/level item outcomes (`received`, `filtered`, `pending`, `overflow`).
- Capture observes the actual generated loot before filtering/capacity loss; no RNG or granting occurs in receipt capture/rendering. Rare protected set/fruit and tower direct paths have explicit observation hooks. Pending claims do not create new drop events; outcomes describe original settlement time.
- WeakMap capture is ephemeral; only finished receipts persist in the existing save transaction. Duplicate rewarded encounters are inert. Offline uses the same settlement wrapper. Old saves remain valid and historical names are never reconstructed; old dungeon-only aggregate display is retained when no new history exists.
- Schema validates exact keys, bounded strings/numbers/arrays, unique IDs and enum outcomes. UI escapes names and is read-only even when localStorage writes fail.

Verification: `node loot-history-tests.mjs`, `node loot-history-app-ui-tests.cjs`, existing `dungeon-loot-receipts-tests.mjs`, `otherworld-core-tests.mjs`, `otherworld-loot-offline-tests.mjs`, `otherworld-offline-rejection-tests.mjs`.
Own tests cover actual normal field/dungeon/boss/offline and tower rewards, exact generated filtered name, full material bags and tower pending equipment, claim without duplicate, JSON roundtrip, malformed schema rejection, no RNG/read-only UI, repeated modal/close/reload under quota failure, and 105 real encounters retaining 100 records. No browser/server/publish performed.
