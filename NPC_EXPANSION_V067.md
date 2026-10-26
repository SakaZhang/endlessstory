# Expanded local cast: 30 named people, 60 events

Candidate based on `ddfcc1993a38574a2631916519d94e861c674b9f`; no publication performed by this worker.

## Scope and stable identity

- Five races, six named minor NPCs per race, two local events per person.
- The original 15 NPC IDs/names/appearance/role/home/voice/plot boundary and all original 30 event objects are preserved. New presentation metadata does not change their identity. `v1-preserved.json` is the exact source snapshot and the preservation test compares every original event, not just counts.
- 60 local events total: 33 conversations, 12 material actions (2 existing one-offs, 10 repeatable exchanges), 10 repeatable actual-victory actions, 5 one-off genuine exploration actions. Thus 40 one-offs / 20 repeatables.
- The five separate Return Ring scenes continue to use the same existing NPC IDs and now reuse the exact same portrait URLs. No new major character, war, mainline prerequisite, core lore, rare reward, recipe or material identity.
- New minor names, gender/age design and local scenes are authorized creative additions, not a claim about older canon. The 69-scene mainline document is untouched.

## Content authoring

`content/racial-npc-events/build-content.py` loads immutable v1 data, appends authored v2 content, and produces the JSON, module, readable draft, and `dist/racial-npc-event-content.js`. Run:

```
python3 content/racial-npc-events/build-content.py
node content/racial-npc-events/validate-content.mjs .
npm run test:npc-expansion
```

The copied authoring package can replace the shared `/workspace/shared/rpg-script-v1/racial-npc-events/` design outputs only after parent integration; this worker did not edit that shared source in place.

All choices are explicit and retain local outcomes on reload. Cost + bounded fixed reward + chosen response + completion remain one sealed task transaction. Repeats require a fresh payment or actual victory, manual reacceptance, and the existing 300000 ms cooldown. Exchanges are 2 Q0 -> 1 different common Q0; victory awards at most 1 common Q0. Existing combat rewards are not duplicated. Every reward event has full-bag failure/no-partial-cost and freed-capacity retry coverage.

## Genuine exploration, not preview clicks

The five exploration actions use existing `count` / `lastEncounterId` fields; current schema6 and optional NPC state version1 are unchanged. A receipt is recorded only by normal `startDwarfEncounter` after actual node construction and `recordNodeExplored`, in the same candidate snapshot as route start. Preview, historical map knowledge, prior encounters, repeated receipt and failed route save do not count. The player must finish/stop the expedition and return to the real NPC area before reporting.

Important merge seam: registered mainline field/scenario starts share `startDwarfEncounter` before `storyScenario` is attached. Its private optional argument is therefore `recordLocalExploration=true`; `startRegisteredStoryEncounter` passes `false`. Both real mainline field and actual scenario starts are regression tested for zero local exploration credit. Do not remove this exclusion when merging the mainline extension.

## Actual art and runtime loading

- 30 independently generated original bitmap portraits using builtin `image_gen`, no emoji / generic glyph substitutions / procedural semantic drawing.
- `npc-portrait-source-manifest.json` has each prompt, canonical name/race/role, original file/hash/dimensions, and runtime file/hash. Original full images and mechanically resized 64/192 previews stay under `source-art/npc-portraits/`, outside `dist`.
- `dist/npc-portrait-registry.js` exports `NPC_PORTRAIT_REGISTRY`: `{[npcId]: {file,width:96,height:96,name,role,race}}`. 30 unique 96px PNGs total **567,113 bytes** in `dist/npc-portraits/`.
- The existing regional event card displays the corresponding portrait, name and role. Fixed 96px square, 64px on narrow screens; no new feature panel. Only the rendered area's cast appears in markup. `loading=lazy`, async decode, no all-cast fetch/preload.
- `bindNpcPortraitErrors(document)` uses v0.66 `bindRecoverableImages`, preserving two bounded automatic retry opportunities, explicit same-asset retry, detached-node cleanup, and central release notice behavior. Retry interaction cannot submit a task.
- Mainline's three additional assets (high priest, seal core, outsider vanguard) are delivered directly to the mainline worker and intentionally are not owned by this NPC commit.

## Evidence and limits

Passed focused checks: 863 content assertions; all60 model lifecycle/choices/costs/reward/save-failure/repeat/cooldown flows; all20 reward full-bag rollback/retry flows; original record preservation; five genuine exploration receipts; real App failed-travel and reload-return exploration flow; registered story exclusions; actual30 PNG decode/source hashes/unique bytes/lazy markup/retry binding; Return Ring scenes + five-POV story/Ring integration; story scenario regression; war suites; navigation; task transaction boundary; App asset recovery.

Actual 64/96 contact sheets were visually inspected, all30 Chinese-name contact reviewed by root. `source-art/npc-portraits/all-30-named-contact.png` is the user review image, not a screenshot. No browser screenshot / browser layout QA is claimed. The local `npc-event-app-ui-tests.cjs` is a fake-DOM actual-App handler test. Final release graph inclusion of dynamic portrait registry paths is owned by integration.

Full aggregate `npm test` is tracked separately in the final handoff; focused checks are not an assertion that all unrelated legacy tests pass.
