# v0.81 otherworld core

Optional schema-6 `otherworld` extension; no new save generation or reset. Full protagonist-specific canonical epilogue gates portal and stone, through the shared `hasCanonicalEpilogue` validator. Optional personal/NPC content does not gate entry. Stone grant/use and XP helpers are owned by the progression module.

## State and lifecycle

`{version:1,stoneGranted,stoneUsed,active,floor,highestCleared,autoAdvance,pendingEquipment}`. Default current floor1, highest cleared0, auto-advance true. World `siteId`, `location`, `expedition` are never overwritten by tower play; they remain the return destination/route. Active tower routing supersedes ordinary auto-boss/dungeon. Entry, exit and floor selection use safe encounter boundaries; exit leaves ordinary routing stopped, including war-blocked returns. Explicit voluntary rest may abandon the current attempt under existing rest rules but never changes floor. Defeat automatically rests/retries current floor. UI queued gear actions resume tower rather than ordinary content.

Every encounter has exact `{version:1,floor}` marker and one `otherworldActor` typed enemy. Its registered own-race A01 definition is only an internal compatibility substrate; strict marker/attribute validation, dedicated name/art and exclusions from codex/node inference prevent ordinary identity/progression leakage. It never uses developer-fixture exceptions. Shared combat still resolves player equipment/racial effects, skills, potions and damage normally.

## Tuning and numerical boundary

Floor1 HP12000, attack240, armor60, physical basic attack every2200ms. HP/attack/armor scale exactly from unrounded base by `1.01 ** (floor - 1)`; no rounded-per-floor accumulation. No attack-speed/probability/reward escalation. Zero elemental power/resistance remains zero. At floor1833 HP is still <=1e12; floor1834 would violate the existing combat numeric validator. A frontier win at1833 stops auto-advance with an explicit note, never silently clamps attributes. Cleared-floor farming remains available.

`qa/otherworld/balance.json`: 50 synthetic level100 configurations across five races, Q0/Q2 complete ordinary gear, no talent investment, existing selected skills, identical gear within each race/quality across floors1/25/100/250/500. All10 floor1 configurations won10 times without rest (first victory17–26 turns in the retained run). At100 they can win but eventually rest; all250/500 samples lose honestly. These are candidate measurements, not a promise every build wins. No tuning change was needed for stable initial idle in the sample.

## Rewards

`OTHERWORLD_LOOT_POLICY` is the implementation/UI source: guaranteed one ordinary Lv100 item, quality weights55/35/10 for rare/good/pristine (indices1/2/3), plus an independent20% additional pristine set piece from all15 racial sets. Ordinary pieces use the player's racial template pool; sets use their own race's legal armor slots. No legendary/Q0/material/consumable/gold reward. XP108, with equipped existing return-ring XP bonus applied exactly once by shared progression. Ordinary reward hooks, rare-fruit/pity, NPC objectives, world-area progression, infinity recipe and boss counters/cooldowns/charges are not invoked. Generic kill count still increases per victory.

Ordinary equipment respects current quality filters; sets retain existing protected-set behavior. Full-family bags do not lose generated items: exact identities enter a bounded32-equipment queue, with two free slots reserved before launching each next battle. Claiming is explicit, once-only, and does not change already-decided filtering. Capacity blocks further tower battles safely. Failed storage is handled by existing caller clone-save-adopt transaction.

## Verification

- `node otherworld-core-tests.mjs`: all five canonical endings; malformed/forged state/markers; per-turn strict save validity; exact scaling; unchanged ordinary economy/story/NPC/area/rare/cooldowns; once-only rewards; current/cleared floors; exit; actual defeat/rest/retry; pending capacity/claim; quota rollback; reload codex/node inference exclusions.
- `node otherworld-loot-offline-tests.mjs`: actual online/offline100→101 parity, exact108XP and no gold/material;600 seeded settlement samples reach every15 set, every ordinary human slot and all3 qualities; same samples preserve set protection under every quality filter; offline death/rest keeps farming floor.
- `node otherworld-routing-tests.mjs`: existing idle-action equip continuation, auto-boss/dungeon overridden, random war involving retained return region does not interrupt tower, explicit exit remains stopped, saturated active queue paused before offline looping, preserving a pending victory for claim/resume.
- `node otherworld-offline-rejection-tests.mjs`: valid JSON pending31/32 plus unclaimed victory pauses with zero false kills; exact pending/victory retained; claim/resume settles once; post-step rejection also pauses without counting.
- `node otherworld-balance-tests.mjs`: actual50 configurations and saved measurements.
- Progression worker's suite plus existing experience progression passed.
- Existing auto-idle-safety22 cases, idle-action-controller, auto-current-boss, rare-idle-rewards and random-war-boundary passed.
- Full `tests.mjs` run progressed through combat/progression/loot/live regressions but hit in-progress new-art release-cache reachability; final integrated art/cache/build rerun is required. No browser verification claimed here.
