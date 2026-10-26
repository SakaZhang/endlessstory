# Chik's named family — bounded presentation/art patch

Base: `7c07cbe` in isolated worktree `chik-family-v068`. No publishing, shared canonical script edit or native Page mutation.

## Deliverables

- 咔洛 / `family.goblin.kalo`: older younger brother, nearly grown, eager to carry his share.
- 米芮 / `family.goblin.mirei`: middle sister, cautious food divider who asks direct practical questions.
- 豆布 / `family.goblin.dobu`: youngest brother, innocent about the source of food, keeps his wooden bowl close.
- Three independently generated goblin pixel busts, inspected against canonical 奇克 and the existing 30 portrait sheet. Full 1254px originals + 192px + 64px remain outside `dist`; runtime uses 3 unique 96px PNGs, 59,925 bytes total. Root approved the Chinese-name contact sheet.
- Prompts and original/reference/runtime hashes: `chik-family-prompts.json`, `chik-family-source-manifest.json`.
- Authoring notes and name-only screenplay patch: `content/chik-family/`. Shared copy of patch and contact sheet: `/workspace/shared/chik-family-v068/`.
- Library contact sheet: `libfile_086ec6656ae88191a7e4548d17db6b84`, `奇克家人形象总览.png`, version 0; local identity persisted with official helper.

## Runtime seam and safety

`chik-family-registry.js` contains three frozen presentation identities and a POV/source-scene cast table. `chik-family-ui.js` renders the appropriate cast in the existing story board, highlighting the current speaker. `story-event-ui.js` applies the scoped display alias and exact cast-label substitutions only. No global replacement of generic “家人” phrases.

Present scenes: C01.G01 all3; C02.O01/C05.O01 Kalo + Mirei; C07.O01 Kalo only. C10.G01/END.G01 are mapping entries only, **not newly playable scene definitions**. Their screenplay substitutions are delivered for later authoritative-document integration.

The complete 103 pre-existing scene definitions retain identical hashes. The controller, knowledge derivation, saved cursor counts, old scene/choice/flag IDs, save generation, schema and keys are unchanged. The pre-presentation completed Goblin save remains valid. Other four POVs do not see this private family dialogue or images.

Family characters are not inserted into `RACIAL_NPCS`, `NPC_EVENTS`, rewards or the 30-entry ordinary portrait registry. They cannot be accepted/claimed as regional tasks. No reward, farm loop, new story gate, family tragedy or new motivation was authored.

All portraits use `.npcPortraitImage` and the existing `bindNpcPortraitErrors(document)` recovery contract: lazy current-scene-only loading, 250/1000ms bounded automatic attempts, explicit same-image keyboard/click retry, success reset and detached-node cleanup. Retrying art cannot submit or advance a story action. Runtime facing is baked rightward; no hero mirroring/anchor changes.

## Verification

Passed:

- `npm run test:chik-family`: real PNG/source/192px hash decode, distinct art, exact 103 canonical definition hashes, correct scene/speaker cast, old save continuity, non-Goblin privacy, future C10/END mapping-only, shared image recovery.
- Actual App fake-DOM test: named C01 cast/active speaker, leave/reopen, reload, failed-save rollback, repeated/stale cursor rejection, forged family task reject/no rewards, C07 only present sibling, four non-Goblin routes.
- `npm run test:story-host`, `node npc-portrait-tests.mjs`, `node story-war-opening-tests.mjs`.
- Production `renderStoryEventBoard` HTML evidence at ignored `qa/chik-family-ui/`. This is not a browser screenshot or browser layout claim.

Release build/cache passed: 2,747 files, 2,745 resource URLs, 8,271 dependency edges, six byte mutations and six missing-reference negative probes. Official Sites helper subcheck was not run because the historical helper is unavailable. The aggregate suite is still running at this portrait-commit handoff; do not describe it as all green. `release-cache-tests.mjs` now traverses all three family images through the actual imported registry, and has a missing-family-image negative probe. `test:chik-family` is also appended to the aggregate suite.

No deployment. Integrator should cherry-pick after v067 rather than hold the current feature release for this art patch. Re-run family/release gates after integrating alongside other v068 art or future story extensions.
