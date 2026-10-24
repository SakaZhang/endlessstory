# Ashen legendary cores

Three repeatable regional boss core drops share the existing aggregate 5% legendary roll (equal conditional choice). All use the Ashen-only ninth core socket; other races may loot/store them. Retired hammer/amulet registrations and icons are removed, with no old-save migration.

- Molten: ATK/DEF base; cumulative 30 spent heat adds one 20% attack layer (max 3) and six seconds to shared remaining combat duration. At cap, duration still extends. Subthreshold spending remains. Actual unequip clears everything; expired attack does not compound into future snapshots.
- Stone: DEF/HP base; enemy direct damage that depletes a shield grants two shards and heals 4% max HP, once per eight combat seconds. Shield expiry is excluded.
- Crystal: HP/ATK base; first beam after 30 combat seconds, then each 30 seconds. Automatic extra equipment ACTIVE, outside four active slots. Single-target light, 200% ATK, target armor/resistance bypass, shield-first. Standard hit/crit/lifesteal/Reaper/multicast and compatible equipped-weapon modifiers apply. Multicast is one extra full cast, no extra cooldown. Cooldown commits only when the original cast succeeds; actual unequip resets. Distinct three-stripe beam renderer.
- Original core: unique future main-story identity, balanced ATK/DEF/HP allocation within the same legendary core base budget, zero random ordinary affixes. All four active and both passive slots empty doubles attack only; basic attacks remain. Story grant seam fails closed: no invented quest, no free grant, no boss/trader/fusion acquisition. Factory exists for registered-item/test infrastructure only.

## Evidence

`ashen-legend-core-tests.mjs`: definitions, pool boundaries/equal split, metadata, cross-race equip rejection, primal slots, molten stacks/remainder/expiry, rock ICD.
`tests/races/ashen/legendary-host.test.mjs`: real equipped casts/resources, beam timing/bypass/basic retention, JSON continuation, shield break, charged Elf staff + critical multicast, original-only cooldown, lifesteal, Reaper, re-equip, failed target.
`tests/races/ashen/legendary-offline.test.mjs`: each core exact 60-second online/offline state parity.
`ashen-core-beam-native-proof.mjs`: real live canvas render, `qa/ashen-cores/beam-native.png` and event JSON (native, not browser screenshot).

Four new core PNGs were generated via built-in imagegen, visually inspected, and nearest-neighbor sized to 48px preserving alpha. Prompt family: isolated mineral core, crisp low-resolution pixel-art, dark outline, transparent, no text/border/chain/handle; molten obsidian/orange fissures, stone gray basalt/gold seams, cyan/violet quartz, primal dark stone/white-gold center. Source generated images retained in parent workspace `generated_images`; production assets live in `dist/races/ashen/art/equipment-ashen-*-core.png`.
