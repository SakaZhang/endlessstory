# Final-region boss coverage

The v0.86 audit found goblin A10 (群穴腹地) had no boss; A09's 83–87 equipment band could not satisfy 90+ drops. Other races already qualify.

This patch adds 群穴菌王 · 古根 as a distinct goblin A10 boss encounter. It uses the inspected local fungal-shell species' complete nine-frame native sprite lifecycle, existing earth attacks, and shared fixed A10 boss threat budgets. No new mainline lore, enemy scaling to player, or changes to existing bosses.

The unchanged goblin legendary pool (留一口 · 无声刃 / 溜影 · 无声足) is rolled once at the standard 5% total base chance, with existing luck/ring modifiers. Drop levels are 95±2 = 93–97. Local salvage, recovery, special material and infinity gem use shared boss-channel rules, without changing prior node pools.

A9 dungeon completion unlocks A10 normally; existing A10 saves get the new node without migration. Same 30-minute success cooldown, automatic boss preference, and challenge-token bypass. No story quest/progression changes.

## Verified
- `final-region-boss-v087-tests.mjs`: actual Lv100 sustained-loadout victory for each of five A10 bosses; 3,000 deterministic production rewards cover all existing legendary candidates and level endpoints; no double settlement; 30-minute cooldown, auto challenge, token debit, valid JSON saves, real A9 dungeon unlock, unchanged story state, existing full art lifecycle.
- Boss challenge App UI tests enumerate all five races' real local boss nodes, including new goblin A10, testing free/cooling/foreign preview cases. The former goblin A10 “no boss” negative case now uses still-bossless A08.
- Goblin pack/material profile, regional routing, dungeon damage, material contract, original material hash with exact four-source append projection and negative controls, equipment JSON parity, infinity gem threshold/statistical suite, portrait/lifecycle and legendary-combat regressions pass.
- Historical material hash/pool fixtures remain unchanged. Only the exact new source/node is projected out with checked contents; arbitrary extra sources still fail.

True browser page review and aggregate full-suite release verification remain the v0.87 integrator's responsibility. `qa/v087-boss/goblin-a10-ready.json` is a synthetic valid test save for that review, not a user's save.
