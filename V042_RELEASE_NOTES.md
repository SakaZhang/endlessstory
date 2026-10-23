# v0.42 — normal A01 pixel battle (release candidate)

## Actual entry and scope
Normal battle page uses the live pixel adapter for dwarf area A01 when all actors and the hero weapon have matching loaded assets. Exact monster IDs: dwarf.a01.normal.1 (raider), normal.2 (pit rat), normal.3 (mining golem), elite (shield captain). Hero axe and hammer each have their own animation frames. The asset manifest is the frozen 2.2-a01-axe-hammer bundle.

The remaining 40 monsters, other-area backgrounds and unsupported weapon appearances retain the existing whole-scene renderer with an explicit coverage notice. They are not reskinned as an unrelated rat/lizard/golem. A01's actual elite has no followers and all four actual A01 definitions have zero cast windup: this release does not invent those mechanics to demonstrate art. Actual A02 follower encounters remain an explicit fallback.

## Live integration
- Same normal engine, target transaction, active four/passive two slots, potion transactions, pause/reload and save. No new balance or simulation schedule.
- Display events come from the existing real observer, not combat log parsing. Draft potion events publish only after successful commit. View/session IDs are memory-only; hidden/offline/history events are not replayed.
- Short actor-following health bars, same-track capped pale-blue shield overlay, small element-colored actual damage numbers and larger critical numbers without a critical-text label.
- Actual targets, enemy status details, hero status controls and shield details remain available. Dead actors cannot be targeted. Death frames derive from actual HP and events; loading a completed encounter does not replay historical attacks.
- Preview remains a separate fixture route. Its auto-mount moved into battle-preview-entry.js so importing its pure canvas drawing functions from the real app cannot instantiate the fixture.

## Evidence and limitations
Native production canvas outputs are under qa/live-battle-v042; actual App DOM/canvas integration uses live-battle-app-ui-tests.cjs. These are not full-page browser screenshots or an end-to-end browser recording. The existing foreground 250 ms polling cadence and deferred whole-site visual redesign are unchanged. Skills use the representative typed FX from the approved preview; this does not claim all 15 skills have individually finished bespoke art.

The release candidate requires own and independent final gates and root publication authorization. No story/other-race gameplay or subsequent A02 asset batch is included.
