# Goblin poison — v081, latest explicit user rule

## Scope and production path

Only the isolated v081 workspace was modified; no publish, commit, server or browser operation. The earlier modest 12s/4.4s proposal and its measurement are superseded, not presented as final evidence.

Production routing is `getRaceSkillPlanner → races/goblin/skills.planSkill → planTreeSkill → executeTreeSkill → executeTreePlayerAction.applyPoison → skill-tree-poison → applyTreePoisonTick`. The dwarf `scatter_ash` tuning is NOT the goblin producer.

The old bottleneck was 9s independent expiry with 5.5s main application CD (5 host rounds), plus a separate poison-effect hit roll after direct-hit success. In the original measured build, none of180 goblin encounters reached5 layers, despite having three poison skills and one healing skill. The shared hit/effect-roll policy is unchanged.

## Implemented user-directed rules

- Goblin poison: each layer3% target maximum HP every2 combat seconds; maximum5 layers.
- Duration12 seconds. A successful goblin poison application refreshes all existing goblin poison layers on that target to12s, including at cap.
- At cap, preserve serials and pending tick times instead of replacing/resetting a layer. Frequent reapplication cannot postpone ticks indefinitely.
- Cooldowns, aligned to actual1.1s host rounds: venom_cut5.5→4.4s, spore_fan11→8.8s, spore_transfer13→11s, mire_seal14→11s. No costs/prerequisites changed.
- Removed the draft mire_seal direct-damage buff; its coefficient remains50% ATK, with only its existing5-stack hit-reduction benefit.
- Poison remains shield-first, non-elemental, non-critical, not amplified by general damage bonuses, and does not trigger lifesteal/execute/extra active casts. No monster HP or boss exceptions changed.

## Snapshots, migration and isolation

`goblin-poison-v081` is an explicit immutable per-layer rule ID validated against the four goblin poison source IDs. Legacy2%/3s/9s ledgers remain valid and unchanged on load/advance. On a new goblin application, only existing goblin-source layers are upgraded; their pending tick is never moved later (legacy pending delay is capped at2s), and expiry refreshes. Non-goblin layers in a mixed ledger keep their original source, interval, damage, expiry and serial. No parallel old/new ledger is created, so no duplicate old/new damage stream.

Tick receipts remain timestamp-deduplicated. New damage descriptors carry validated per-layer rule/source snapshots; the host recomputes total fraction rather than accepting arbitrary tick.damage. Dwarf and enemy poison do not opt into the goblin rule. Rest/pause/travel still do not advance this combat clock.

UI shows actual layer sources, per-layer2%/3% and3s/2s interval, pending tick time and persisted remaining duration. Thus old and mixed snapshots are displayed accurately. Skill text, cooldown suffixes and goblin4-piece set text reflect the new numbers; five-layer condition remains five.

## Measured results (latest final code)

Artifacts: `qa/goblin-poison-v081/{before,after,comparison}.json`; runner `goblin-poison-v081-audit.mjs`.

90 scenarios ×10 deterministic paired seeds before and after: all5 races, Lv30/60/100, Q0/Q2, same-level human field, dungeon first stage, boss. Identical generated gear per level/quality across races; no sets, no specials, no potions,20 lawful talent points. Goblin uses13 lawful prerequisite skill points and retains patch_ration; all saves validated. All72 non-goblin aggregate rows are exactly unchanged.

| Level / quality | Boss seconds before → after | Poison share after | Five-stack sampled uptime |
|---|---:|---:|---:|
|30 / Q0|29.37 →16.06|69.1%|32.7%|
|30 / Q2|24.42 →14.85|62.1%|27.4%|
|60 / Q0|33.11 →16.94|74.7%|36.3%|
|60 / Q2|27.83 →15.40|67.3%|30.4%|
|100 / Q0|33.11 →16.94|74.2%|36.3%|
|100 / Q2|32.56 →16.50|73.2%|35.3%|

- Boss time decreases39.2–49.3%; all60 boss trials now reach5 layers (previously zero), all win. All180 goblin encounters still win.
- Field clears improve8.0–18.9%, dungeon first-stage7.9–24.0% in these samples.
- Nominal full-stack damage is15% maxHP per2 seconds, not necessarily one synchronized15% packet: independent layers retain their phases. Actual measured damage includes host shielding and loss caps.
- `combatEquivalentClearsPerHour` is only3600/mean fight duration, NOT a measured sustained-idle farming rate.

This is a **large explicit user-directed increase**, not a modest tuning or proof of cross-race balance. Cross-race controls use the same gear/base stats but their established reference loadouts spend8–9 points versus goblin13, use different skill counts, and are not optimized. Do not rank classes from this comparison. Every fight starts healthy; this does not establish multi-hour no-rest sustainability, entire dungeon-run throughput, every weapon/set/condition build, all racial boss mechanics, or an optimized endgame ceiling. No potion-spam solution was added.

## Verification

Passed: `goblin-poison-v081-tests` (actual production cast, old-layer upgrade, mixed-source isolation,5cap/refresh phase,2s ticks across1.1s turns, JSON/chunk catchup, real online/offline reducer parity, shield-first receipt once, actual UI text), `goblin-pack`, `goblin-production`, `goblin-legend-production`, `goblin-legend-offline-parity`, `skill-tree-poison`, `skill-tree-poison-host`, `skill-tree-active-integration`, `skill-tree-consumer`, `skill-tree-combat-schema`, `contextual-skill-condition`, `contextual-condition-compat`, `typed-status-ui` (mocked actual App), `old-active-balance-compat`, `racial-equipment-copy`.

The copy-mechanics pinned baseline now permits only the exact authorized goblin timing/CD/planner fraction changes, with negative mutation tests. Its next failure was unrelated new memoryFruit catalog copy; that remains root/fruit-worker integration responsibility. No browser visual QA or release publication performed.
