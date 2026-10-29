# 长路未尽 v0.77

## Automatic idle actions

Real task, travel, equipment and loadout actions can be queued while idle combat runs. The current field battle or complete dungeon run settles normally before the action. Existing HP, consumables, RNG, cooldowns and reward receipts are preserved. Successful one-step actions retain the original running intent, with the normal preparation delay. Ordinary travel from a stopped state never starts combat. Multi-step story conversations remain paused until completion, and explicit Stop wins over automatic continuation. Session-only requests do not replay after reload.

Actions use the existing persistence transactions and eligibility gates. Failures retain their specific reason and remain paused. If an action was saved but continuation failed, feedback distinguishes those outcomes. Stopped characters may still equip during rest under the original rules without shortening rest or gaining health.

## Elf visual fixes

Five monster identities had eight incorrectly labelled facing frames. The fix changes only facing metadata, not raw sprites or global mirroring. All 220 elf monster images remain byte-identical. See ELF_MONSTER_FACING_V077.md.

Elf backgrounds 03–08 contain adjacent-scene pixels in their original bottom edges. This release uses explicit safe source rectangles, uniform cover framing and corresponding display baselines in both normal and notice rendering. It does not repaint or alter the source PNGs. Other backgrounds retain their previous drawing behavior. See ELF_BACKGROUND_VIEWPORT_V077.md.

## Release boundaries

No save schema, starter equipment, combat balance, rewards, map unlocks, story prerequisites or site audience changes. The separately reported pending map-manifest timeout and irreversible Ring-event decline issues are not fixed by this release.

Docker Hub publication must be verified separately from the Site deployment. Container launch and ARM64 execution have not been tested in this environment because no Docker daemon is available. The portable package retains its native HTTP, format and integrity checks.
