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

Release build/cache passed: 2,747 files, 2,745 resource URLs, 8,271 dependency edges, six byte mutations and six missing-reference negative probes. Official Sites helper subcheck was not run because the historical helper is unavailable. The aggregate suite terminated at the unchanged historical `equipment-armor-art-tests.mjs:8` assertion (actual36/expected28); it is not all green. Final isolated portrait build was `ad23a22e7a82db89a1609949880e557d6c7e47ba7b723c7b2d1e17b10a88128e`. `release-cache-tests.mjs` now traverses all three family images through the actual imported registry, and has a missing-family-image negative probe. `test:chik-family` is also appended to the aggregate suite.

No deployment. Integrator should cherry-pick after v067 rather than hold the current feature release for this art patch. Re-run family/release gates after integrating alongside other v068 art or future story extensions.


## Six approved family events and fixed supplies

The user approved the reward policy (`Sentinel_b133fec785f081918605bf0e95a3c8ff`); root set the exact bounded budget. All six one-offs now grant **2 ordinary healing potions** (`healing|0`), for12 total. Both choices grant identical supplies. No item costs, gold, XP, stats, new item identity, random reroll or mainline flag changes. Each outcome explains family preparation of supplies, not children paying commissions; Dobu's ordinary stone is not exchanged for goods.

`chik-family-event-rewards.js` has `approved:true` and frozen exact reward rows. Six event IDs remain distinct from three character IDs and from60 regional events. The full registry has71 event definitions (60 regional +6 family +5 Return Ring). The separate stage claim is not a seventh family event.

Early three require actual `C02.O01.goblin` completion, physically at `goblin.a01`. Later three require actual `C05.O01.goblin` completion, physically at `goblin.a04`. Goblin-only; foreign POVs and remote previews do not expose personal conversations. An explicit two-way choice precedes confirmation. Choice,2 potions and completion commit in one existing sealed task transaction. Capacity or save failure preserves the active choice without partial reward or completion. Retry/discard/use/reload cannot mint another supply.

### Independent earned stage claim

`family.milestone.six-moments` grants **1 existing reforgeToken**, exactly once. Eligibility requires all six resolved records, their real claim keys and valid selected choices, plus valid story prerequisites. It shares the existing claim service but is a separate transaction by root's explicit approval: if the token stack is full, all six events stay completed and the UI says **6/6 · 已备好的补给待领取**. No scene must be repeated. Clear capacity and retry; storage quota/newer snapshot/reload cannot lose or duplicate the reward. A milestone claim without all six valid source records is rejected by strict save validation.

C08 still pauses unstarted/unfinished house events with an explicit stage notice and preserves their history. An already-earned stage supply remains claimable in the actual unlocked Goblin a01/a04 area, safely stopped and rested. It is labeled already-prepared supplies, not a fictional family relocation. No `G_FAMILY_SAFE` flag is fabricated. The full Goblin personal arc, C10 reunion and future Q3 choice-slot finale reward are **not implemented or claimed complete** here.

### Verification and remaining limits

- `npm run test:family-events`: all6×2 branch model and actual-App paths; accept/choose/claim quota, no-default choice, later/leave/reload, repeated actions, per-event newer-save protection, current-location/safe/war policy, other4 POV privacy, C08 pause; reward cards match exact data.
- All12 branch capacity cases: real1e9 healing stack boundary rejects the entire2-potion grant; after space, exactly2 and completion commit. Battle auto-discard filters are preserved, not applied to task supplies.
- Actual-App all6 earned milestone:1e9 token-full pending, quota, newer-save, leave/reload, once-only claim, use/discard no resupply, C08 safe-area claim. Strict missing/forged/cross-POV/prerequisite source histories rejected.
- The current legal catalog has15×4 potion stacks +2 consumable types, at most62 distinct item stacks under a100-slot bag. Tests do not fabricate invalid100-slot inventories; they verify the actual reachable stack-capacity boundary.
- Production HTML is tested with actual App handlers in a fake DOM; no browser layout/screenshot claim. Aggregate historical armor36/28 issue remains unrelated and unchanged.

Integration order after the portrait commit: `a3d890b` (authored event/service/UI draft) then the approved-reward followup commit. Never publish the old blocked draft alone. Cherry-pick these scoped changes, not the old worktree wholesale, over published706c268. The integrator already reconciled the single C07.EA02.ashen expected hash to final706c268 without changing runtime definitions; preserve that reconciliation.
