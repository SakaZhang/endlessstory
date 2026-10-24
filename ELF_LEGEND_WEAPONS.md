# Elf legendary weapons redesign

- `elf-sixfold-heartwood` / 六相·心木初鸣: wielded staff gives six-element damage ×1.3, poison excluded. Four distinct actual positive HP/shield damage types charge the next successfully committed attack skill. That entire cast's direct physical/elemental segments receive ×2 (elemental total ×2.6). Support, heal, self-buff, failed selection/cooldown, basics and poison do not consume it. No echo or added attacks.
- `elf-last-string` / 归林·最后一弦 replaces the old amulet definition: wielded bow physical attack-skill segments use 70% target armor before flat penetration. For a multi-segment attack, the final planned physical segment per target receives ×1.5. Miss/death does not move the bonus to an earlier segment. Basics, counters and other weapons receive neither bonus. Cross-race wear remains allowed.
- A charge is snapshotted at committed `beforeCast`, stored by item/pending cast ID and cleared at cast end. The fourth distinct hit cannot enhance its own cast. As with the old marks, a boosted cast can earn the next charge from its own actual distinct hits; synthetic equipment procs never charge it. Actual elemental DoTs receive the constant elemental bonus and can earn a distinct mark, but never receive the cast double.
- Existing cross-encounter persistence is retained. Actual unequip discards the per-item ledger and clock; re-equip starts fresh. No legacy development-save migration. Root integration owns the generation reset.
- Item details and collected codex use the same truthful effect text. Art uses verified bow `icon-02.png` and staff `icon-04.png`; no amulet asset is routed to a legendary.

## Verification

Passed: Elf reducer, real-item host, 30-round full online/offline JSON state+display parity, item-detail/codex text, multi-combat, elemental-combat, Human and Ashen legend host regressions. `node race-expansion-tests.mjs`: all 45 gates pass (not numerical approval or publishing). Host assertions cover mixed physical/elemental ×2/×2.6, all six segments, fourth-hit nonretroactivity, recharge, shield-only damage, support/cooldown failure, exact armor substitution, final bow segment, ordinary attacks, cross-race equip, re-equip reset and dungeon carry. Physical damage comparisons allow the engine's integer rounding (up to two HP across segments).

No release built, pushed, or published. Existing art was rerouted, not newly generated.
