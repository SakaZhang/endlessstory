# v0.66 — Local events, playable early story, Return Ring and image recovery

Base: live v0.65 source `3117c0691986ce14054c8b858ce72eaf57853107`.

## Delivered runtime scope

- Fifteen local NPCs host thirty racial events, alongside five optional Return Ring material scenes. Choices are explicit and remembered. The ten repeatable events use either two ordinary Q0 materials for one other ordinary Q0 material, or one new victory for one ordinary Q0 material; each successful cycle has a five-minute cooldown and requires manual reacceptance. They do not add rare-material or gold inflation.
- The canonical first six chapters run through actual dialogue, source-gated knowledge, navigation and combat. Four named nonlethal encounters use real engine turns and the named heroes' existing artwork, not kill/loot substitutes. C05's Ashen core grant, equipment replacement and story receipt are one validated transaction, with capacity and failed-write retry.
- Mandatory C06 completion permanently teaches the Return Ring recipe even if none of the optional materials was collected. All five exact Q3 materials are needed once. Crafting records a permanent once-per-journey ledger; a full ring bag creates the existing pending forge claim instead of losing the result. Losing or fusing the Ring does not permit another craft.
- An equipped Return Ring restores full HP after each successful settlement, including individual dungeon stages. It adds **three percentage points after the existing luck term** to eligible boss-legendary, rare-material and Infinity-gem channels. Source eligibility, zero/empty channels, held-unique restrictions and Q3 gem quality remain authoritative. Bag ownership alone does not activate it.
- Infinity-gem base rates are `0.0002 × area` for fields, `0.001 × area` for dungeons, and `0.02 + 0.03 × (area − 1) / 9` at existing boss nodes only. No new boss/source node was invented; other channels and quantities are unchanged.
- C07 has each POV's real first-front encounter/declaration, plus the Elf/Ashen follow-on attrition encounters. War is started by canonical completion, not a timer or random scheduler. Existing combat can finish and settle once; no new ordinary enemy-territory field/dungeon/boss/farm run can start. Home and neutral regions remain available. Exact registered story entrances are not general NPC/travel exemptions. Manual withdrawal retains gains, HP, cooldowns and story progress without an automatic teleport or rest penalty.
- Failed skill/equipment/material/consumable/portrait/background loads now have bounded retry and explicit recovery controls. A stale-release notice requires explicit refresh confirmation, protects active operations, and does not silently discard drafts or reallocate skills. Skill-tree scroll/layout geometry was not changed. The v0.65 Goblin facing fix remains included.

## Important playable-story boundary

**This is not the complete ten-stage mainline.** The full written screenplay is separate from runtime implementation. C07's later assassination/seal/rescue/ritual/ending scenes and C08–C10 are not playable here, and no completion flags are fabricated for them.

**The story ceasefire is not implemented yet.** Once an Elf/Ashen player explicitly confirms the C07 declaration, the opposing territory's ordinary activities, including local optional commissions, stay locked in this version. Home/neutral exploration and registered story access continue. Before declaration, the UI states:

> 当前版本剧情推进至战争初期，剧情停战尚未开放；开战后敌对地区普通活动将封锁。本族/中立地区可继续探索。

The player can choose “暂不推进，继续探索”. The canonical choice and final completion are explicit; merely reading, leaving the screen or winning the encounter does not activate war. The warning reveals no hidden material identity.

## Persistence and build

Schema 6 and `ashencrown-v6` are unchanged. Valid current saves without the new optional fields load without a reset or migration; malformed populated story/NPC/Ring/diplomacy ledgers are rejected, not normalized away. Existing equipment/loadouts, health, inventory, pending forge work and current progress are retained. App save/transaction paths re-read the last committed raw snapshot before writes. Asset refresh also rechecks after confirmation (including Cancel), preserves a newer save, pauses stale pagehide/autosave and only reloads it explicitly; read failure writes nothing. This is not cross-tab compare-and-swap.

Content release: `30ccd4246b793b8e257bb830440072be62bae7fe20ab33416b70d10f25a35696`.
Build/cache verification: 2,695 hash-verified files, 2,693 actual resource URLs and 8,196 dependency edges. New runtime modules are reached through actual imports/UI, not an unreachable-file whitelist. The optional Sites helper probe was unavailable; no publication was attempted by this integration task.

## Verification and limits

The focused `npm run test:events-release` entrypoint covers NPC/story/war/Ring/gem/asset-recovery systems, actual App event handlers, and the native scenario renderer. `story-ring-integration-tests.mjs` traverses canonical C06 for all five POVs, then one character earns all five materials via actual region unlocks/combat, crafts once, reloads, swaps loadouts and compares online/offline settlement. The App regression also proves story-only war entry cannot enable ordinary NPC/Ring/farming actions and tests withdrawal/re-entry, storage rollback, and the pre-declaration notice/later path.

Aggregate gates are **not claimed green**. Exact v0.65 reproduces the historical armor count mismatch (36 vs 28) the old equipment-parity whole-engine hash assertion, and the historical M2 forge assertion expecting exactly level 137 despite the earlier approved ±2 material-fusion roll (reproduced 135 vs 137). These unrelated assertions were not relaxed. Additional independently run historical activation tests require external provider fixture files absent from this workspace; they are not reconstructed from current production data to manufacture a pass. Final terminal results are recorded in the integration handoff.

Native production-renderer images were inspected. App handler tests use DOM fixtures and native canvas; they are not a real-browser layout/scroll test. Browser launch remained unverified after the known socket `EPERM`; no escalation or `--no-sandbox` workaround was attempted.

Only the root release owner may publish this candidate after independent review.

### Terminal verification record

- `npm run test:events-release` passes on the integrated content; the final save-guard revision is rechecked by the same entrypoint and independent actual-App newer-save/confirm-race/read-failure probes.
- `npm test` reaches only the known armor fixture mismatch; `npm run test:races` completes with only the historical equipment whole-engine hash mismatch.
- Isolated legacy scripts expose the reproduced M2 level expectation above and missing `/workspace/shared/dwarf-m3-a04-a06/provider-candidate.json`, `/workspace/shared/dwarf-m3-a04-a06/final-provider.json`, `/workspace/shared/dwarf-m3-a07-a10/final-provider.json`. No current runtime inputs are missing.
- The M2/M3/M4 and Human material test expectations were reconciled only for the newly approved gem rates; all nongem/source/quantity/quality assertions remain. The core catalog test replaces only its formerly-unmodified story-core seam with exact C05 behavior checks.
- A concurrent pre-fix broad cache run was superseded after runtime edits; the final frozen build and full cache graph pass at the content release above.
