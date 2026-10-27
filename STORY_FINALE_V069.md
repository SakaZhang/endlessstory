# C09–C10 and ending implementation

Canonical source: the approved Page `page_4102129c95388191b797fcdd8ff8b878`, read through the supported Pages full read on 2026-10-27; exact late-chapter source snapshot is `content/story-finale-approved-source.md`. Existing sites are implementation hosts, not newly invented geography. No publication performed.

## Playable scope

All five fixed protagonists traverse the actual App scene host from C08 to C09 temple investigation and corroboration, sourced four-ruin reports, protected message route, their own racial resistance, five-person briefing, fixed four-NPC assignments, central approach, first boss checkpoint, four separately confirmed support cuts, final boss defeat, reunion and own home ending. Goblin escort requires real combat and confirmation of all three arrivals before the camp follow-up dialogue. Other four heroes' home summaries can be heard through optional local revisits after the ending; these do not complete personal quests.

The central ritual succeeded and the priest died from backlash in C08; nothing rewrites that. C09 first confirms the ancient temple's support identity. Four support altars are distinct from the central ritual. The protagonist alone fights the boss; the other four assignments follow the exact approved five-row table. The Ashen story core is not reclaimed or destroyed. The king remains design-only. Known cast use exact scene-specific existing portraits; unnamed recorders/villagers/couriers remain role-only rather than falsely impersonating existing NPCs.

All progression uses the existing strict derived ledger and clone-save-adopt transactions, not UI-set flags. No generic quest-stage API added. Every altar has its own scene/flag and persists independently. No battle receipt alone declares main-story clear; final scene confirmation needs the final combat receipt and all four prerequisite cuts. Quota failures, duplicate clicks and stale/newer saves do not advance. Returning to camp or loadouts cancels only the current attempt; actual defeat retries the current checkpoint with no ordinary death rest/reward. The existing voluntary five-minute rest remains available. The same generation-6 save continues ordinary exploration, NPC events and random-war rules after ending.

## Intentional candidate combat tuning

A07's validated stat substrate is reused, **not** its fauna identity. The dedicated `invasion-leader` asset is used for the boss; `invasion-wave` represents its one finite reinforcement. Boss tuning is HP×1.6 / attack×6 / armor×1.5 (currently 7374 / 90 / 51), with ordinary basic cadence and no unrelated creature spells. This is candidate gameplay tuning, not a claimed approved numeric table.

The first phase is an explicitly disclosed six-action holdout or earlier decisive strike, never a mandatory HP-pool depletion or hidden minimum timer. The boss can take damage immediately; a decisive strike reaches the tactical checkpoint, keeps the named boss alive, and does not clear the story. Actual player defeat still retries. While all supports operate: +20% damage, +20% armor, 2% healing on each non-decisive action and one finite 35%-normal-budget reinforcement. The bounded phase cannot be locked by an insufficient-DPS/healing equilibrium. The four saved cuts remove these four pressures; then the player must win the separately disclosed final checkpoint. Camp preparation is allowed between checkpoints. There is no fake ordinary victory or repeated altar reward/debuff stacking.

No main-story item/amount was specified in the approved script, so no arbitrary unique reward is fabricated. Personal-arc reward completion is owned by its separate controller, not `MAIN_STORY_CLEAR` alone.

## Verification

- `node story-finale-runtime-tests.mjs`: five real routes, source/POV gates, high-power checkpoint (no premature clear), ordinary death/retry preserving all cuts, quota/reload/stale/duplicate validation, no farm/core duplication, optional-spring fallback, same-save ordinary play.
- `node story-finale-app-ui-tests.cjs`: actual App handler/engine loops with mock DOM, all five C09→END paths, actual map travel, real camp rest, per-cut quota and reload, final once-only completion, external-newer-save protection.
- `node story-finale-cancellation-app-ui-tests.cjs`: App camp/loadout abort, failed persistence rollback, pause/reload, new encounter ID retry, preserved prior progress.
- `node story-finale-balance-tests.mjs`: 40 actual battles over five races, both phases, levels 20/40/60/100, initial equipment/default selected skills; Ashen uses original starter core instead of the story core. All sampled level60/100 final fights pass; some level20/40 fights fail honestly. Candidate balance evidence in `qa/story-finale/balance.json`, not exhaustive build certification.
- `node story-finale-native-proof.mjs`: real production renderer across all five final encounters; dedicated left-facing boss, correct selected hero, no fauna codex identity, saved altar flags. `qa/story-finale/five-povs.png` inspected visually. This is native renderer evidence, **not** a browser screenshot.

Prior C01–C08 controller/scenario/war/random-war/current-generation/family/cast suites remain required. Historical tests that asserted C09/ending did not exist now assert the correct new boundary while retaining byte-identical old scene checks. Final integrator must re-run combined personal-arc/reward changes and release/cache/build checks. No browser claim or blanket final-balance acceptance.

## Natural-save first-through proof

`node story-finale-natural-save-tests.mjs /tmp/natural48-{human,dwarf,elf,goblin,ashen}-1917.json` consumes independent production-economy simulation saves, not a story fixture. It encounters the first actual foreign-map story lock and asserts clear prerequisite-dungeon guidance. It then earns all missing foreign A01–A06 dungeon clears through real entry/combat/reward (24 dungeons per POV) before completing every remaining mainline scene and own ending. No levels, gold, materials, equipment, area unlocks or story flags are injected; camp rest remains real. Inputs are synthetic QA saves, never user saves. Evidence is `qa/story-finale/natural-save-proof.json`; the producer is `progression-economy-simulation.mjs` in the economy worktree.

The two central boss checkpoints now use dedicated generated open/closed ritual backgrounds through an exact scenario-only renderer override. Ordinary A07 and prior C08 backgrounds are unchanged. Runtime is 480×270, existing baseline203 and hit-test positions unchanged. `node story-finale-background-tests.mjs`, `node tools/build-story-finale-backgrounds.mjs --check`, existing scoped-loading/live-view/recovery tests, and the expanded native two-phase/five-POV proof validate routing, opaque assets and geometry. Source, prompts, crop recipe and hashes are retained under `source-art/finale/`.
