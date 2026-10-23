# v0.34 release candidate — not yet deployed

## Normal playable changes
- A03 dwarf boss settlement rolls an independent extra local-race legendary. Base total 5%, equal hammer/reactor choice after success; repeats allowed. It does not replace ordinary/set gear, and at most one legendary is attempted per settlement.
- Two real items, not preview-only: 王统·初炉誓锤 (fifth basic/active-damage outgoing action -> single current-target 1.4 ATK, 30% armor penetration); 不熄之炉 (12 seconds simulated combat -> all-target .75 ATK fire pulse plus 8% max HP + generic shield bonus, 3 combat seconds). Coefficients are first-pass tuning.
- Legendary procs can crit and lifesteal on actual HP damage with the existing per-proc cap. They do not trigger execute/multicast or cumulative active counters. No lifesteal from absorbed shields or execute damage, no resurrection by lifesteal.
- Four ordinary source-q4 affixes plus fixed golden exclusive; no random scatter special. Stronger same-level budget/ranges than supreme. Reforge ordinary portions only, donor transfer preserves raw/source and never transfers exclusive. Legendary fusion input guarantees supreme non-set/non-legend output, enhancement +0; historical unique ledgers untouched.
- Actual unequip clears that item's accumulated time/count and removes its shield. Unchanged IDs/ring swaps, save/load, and normal battle transitions preserve accumulation. Once-per-battle nirvana is not reinitialized by equipment actions.
- Luck existing quality/value better-of-two stays once. New eligible occurrence channels multiply base by at most 1.10 asymptotically; divine by at most 1.20. Legendary chance uses 5% + asymptotic 2 percentage points. No source, fixed recipe, raw inheritance or uniqueness override. Shop rolls, explicit combat proc chances, knowledge/scavenger trigger chances and enhancement rates unchanged. No obtainable luck potion was added.

## Data / compatibility
- Still only current A01–03 dwarf content and seven nodes. No M3, new recipes, maps, quests, other races or recipe-only legendary items.
- Old items and paid candidates preserve values. No reset or new test grant.
- Ordinary rarity remains 0–3. Legendary identity and budgetQuality 4 are separate; source-q4 ordinary affixes can legitimately transfer to other gear.
- Full equipment bags follow existing missed-loot semantics, no new hidden legendary mailbox.
- Auto-discard and batch sale distinguish explicit 传说 from 至臻. The new legendary selection defaults off; an old supreme selection never silently selects legendary gear. Manual sale/fusion/donor use remains allowed with existing locks/equipment/loadout protection.
- Equipment and loadout changes now clone-save-adopt; failed persistence cannot clear runtime or leak later via periodic save.

## Evidence
- Real engine 45-case Lv20/25/30 three-build numerical comparison: `/workspace/shared/legendary-balance-v034/CONSUMER-REPORT.md` and manifest. 45 victories/45 legal saves; includes total equipment+effect changes, not isolated proc amplification.
- Live consumer tests cover boss -> reward -> inventory -> equip -> effect; source-q4 donor/wash/reforge; fusion/enhancement; shield carry and unequip; existing scopes and luck exclusions.
- DOM tests are mocked actual App execution. No authenticated whole-page browser QA is claimed.
- Aggregate and independent review remain required before deployment.
