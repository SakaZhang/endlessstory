# Named story combat host (integration candidate)

Four authorized, nonlethal scenarios only: C01 human chase/goblin escape; C05 elf defeat/ashen victory. These are **not published**.

- `startStoryScenario` uses the real current-generation engine and creates one named opponent using the existing `goblin.a01.normal.1` or `ashen.a04.normal.1` numeric budget. No new damage formula or inflated loss stats.
- Four real rounds (or an earlier decisive engine hit) trigger the authored nonlethal transition. Premature player defeat retries the same scene. Exact objective and fixed outcome are disclosed; this is not an ordinary kill quest.
- Named hero art in live scene and roster; numeric-budget creature is neither shown nor recorded in the monster codex. Creature spells are not assigned to heroes.
- No gold, XP, items, ordinary kills, dungeon progression or cooldowns. Story duels do not enter the ordinary five-minute rest. Entry HP is restored, not upgraded. Existing potion use remains real.
- Reaper remains unchanged in ordinary encounters and bosses. Only explicitly marked nonlethal story duels suppress execution; UI notice states this distinction.
- Metadata validates scene, POV, location, one actor, source budget, zero reward amounts, exact field shape and bound encounter identity. Pause, save/reload, offline completion and retry use the real engine.

## Required integration (owned by shared story/NPC host)

1. Controller owns complete scene prerequisites, dialogue/choice gate and once-only receipt. Add its `canStartStoryScenario(s,id)` predicate to the engine launch guard (before any cloning or start).
2. Replace `STORY_RESULT_HOOK` in engine with `if(scenario.completed) recordStoryScenarioResult(s,e);` **before** `finalizeStoryScenario`; failure to record must not be silently treated as successful progression. Recorder receives the actual `s.activeEncounter` and checks its bound ID.
3. Parent registry maps these scene IDs and locations (pending canonical map confirmation): `C01.H01.human` / `C01.G01.goblin` at `goblin.a01`; `C05.EA01.elf` / `C05.EA01.ashen` at `ashen.a04`.
4. App invokes Engine.startStoryScenario via its persistent clone-save-adopt path. Add `renderStoryScenarioNotice(e)` to battle view. On `e.done`, branch on `e.storyScenario` **before** ordinary win/loss messaging, avoiding a false death/rest toast. Progression continues through NPC scene completion, not battle UI stage buttons.
5. Generic NPC/story ordinary-victory hooks must exclude `e.storyScenario`; these encounters use only the dedicated scenario-result recorder.

Metadata: `e.storyScenario = {version:1,id,sceneId,pov,initialHeroHp,returnAtCamp,result,resolvedRound}`. Result is null while active, then `chase-transition`, `elf-defeated`, `ashen-victory`, or `retry`. At completion `e.done=true`, `e.win=false`, `e.rewarded=true`; never interpret that as ordinary defeat. `storyScenarioObjective(e)` exposes read-only explanatory UI.

## Verified

`node story-scenario-combat-tests.mjs`: all four genuine combat turn loops; fixed numeric budgets; named asset mappings; no creature codex; strict wrong location/POV/scene/replay/malformed gates; pause and JSON save/reload; early defeat retry; no rewards/cooldowns; offline stops after scene; start transaction quota rollback.

`m2-reaper-shield-tests.mjs`, `current-save-generation-tests.mjs`, `live-battle-view-tests.mjs`, `multi-battle-ui-tests.cjs`, `monster-pixel-portrait-tests.mjs` passed. These are model/native/mock-DOM tests, not browser end-to-end proof. Controller receipt and App launch/notification remain integration requirements until the combined checkout is tested.
