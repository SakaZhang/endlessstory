# Five personal long arcs — v0.69

## Delivered scope

- 30 new own-POV optional story events: dwarf 8, human 6, elf 6, Ashen 6, Goblin 4 continuation events. 60 persisted branch outcomes and 120 authored site-local action checkpoints.
- Existing 3 siblings / 6 early household events, their 12 potion rewards and independent one-token milestone remain unchanged. They are not prerequisites for the complete Goblin arc. Regional 30 NPCs / 60 errands and five Return Ring events remain separate.
- Dwarf: mine inspection, night-car traces, blast-route/witness records, C07 arrival verification, warehouse priorities, C10 funds proof, temporary confrontation, reopening/escape-route work. No king replacement, punishment, arrest or political coup resolution is invented.
- Human: ownership and consent, transport allocation, named posts, delivered route information, sourced missing-person records and two separate unfinished ledgers.
- Elf: spring-care duties, questions with sources, actual delivery, survivor questions, incomplete history, voluntary daily responsibility. No automatic high-priest succession or universal forgiveness.
- Ashen: personal consent, body/property distinction, missing posts after the chief's death, independent C09 corroboration, voluntary duty, amendable shared records. No automatic chieftain succession or ancient mandate compelling present obedience.
- Goblin: safe household preparation, C10-confirmed family safety, bounded cooperative survival and shared daily planning. Children are never assigned to the battlefield or made political leaders.

## Actions and late entry

Each event offers two viable approaches, then concrete inspect/repair/record/handoff operations at its actual registered location. Actions are saved individually and require the selected branch, exact next cursor, correct POV, actual current area and safe stopped state. There are no moral right/wrong quiz options. Eight segments additionally require an exact newly started registered local field battle; ordinary monster art/budgets and once-only battle settlement are reused, not a renamed hero sprite or invented boss. Those battles clear present local threats rather than claim to decide a war. Dwarf event 04 requires the existing completed C07 escort and verifies arrival; it never duplicates that battle.

Seventeen earlier events have individually authored present-day late work. No common canned questionnaire, no retroactive rescue command, and no waived battle receipt. Dwarf may enter event 03 directly after invasion; skipped 01/02 remain unexperienced and unrewarded, can be completed separately, and do not block 03–08's final resolution.

An optional `personalStoryProgress` save object holds exact per-scene action cursors, late-entry IDs and suspended scenes. It does not replace the current generation 6 save or alter the original 103 scene definitions. Suspended personal scenes retain choices and receipts and allow normal mainline progression. If the mainline moves past an unfinished early incident, resume converts uncompleted work into that event's current-work alternative; a completed battle receipt is never discarded. Nonpersonal mainline behavior stays unchanged.

Goblin preparation uses the existing a04 household area before invasion. Once invasion begins, unfinished preparation is deferred until mainline `G_FAMILY_SAFE`; it then resumes at the actual C10 a02 safe camp. C10/postclear family conversations also use a02. Cooperation outside camp does not display children as present. Original household events are still governed by their original early-stage availability and preserve earned supplies.

## Reward and presentation contracts

Completion saves eligibility only. The 25 nonfinal event claims use the reward module's equal branch budgets: ordinary healing x2, except dwarf 04 / human 03 / elf 03 / Ashen 03 grant one reforge token instead. Five final scenes qualify for one Q3 ordinary chosen-slot item, first-claim current level ±2 and durable reservation before bag handling; see `PERSONAL_ARC_REWARDS.md`.

App region and journal expose earned claims, final slot confirmation and fixed pending retry. Failed reward transactions adopt only their durable returned snapshot; newer/claimed external snapshots pause the stale App. Recorded branch consequences remain visible in the journal and later personal scenes. Dwarf 06/07 source/representative callbacks differ, and the minister portrait is allowed only in the actual postclear confrontation. Existing family portraits appear only in the relevant own-POV safe household scenes.

## Verification

- `npm run test:personal-arcs`: all 30 events, both branches, early and late full five-POV routes via genuine engine travel/battles; exact checkpoints, quota/reload/stale/cross-POV/remote guards; direct P03 entry; delayed paused resume; strict malformed activeScene rejection.
- Actual App fake-DOM coverage: all five races × two first-event paths, checkpoint save failures, duplicate click, pause/reload/resume, event claims, five final reward UIs, browse-without-generation and stale-tab periodic/tick protection. This is not browser visual acceptance.
- Reward matrix: 36 legal race/slot combinations at levels 1/100; all three write failures, full bag, fixed slots/seeds/items, no retry RNG, 25 event budgets/full stacks, forge independence and filters.
- Original family event/reward suites, main-cast/source checks and v0.68 historical 103-scene/30+60+6 boundaries pass. Historical tests now assert unchanged original data rather than forbid authorized additive App/engine changes.
- Build and cache-integrity verification run locally; no push or publication. Integration should rerun aggregate tests with the separate baseline-regression repair commit.
