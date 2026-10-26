# Return Ring + shared local NPC host (candidate; not published)

Base verified: `2a77f9eceee8f77a0e39429d6c40513f7c230395` (v0.64).

## Canon and authorization

The five material identities, exact names/descriptions and Q3 are unchanged from live `world-materials` and material Page `page_bd600958080c8191b3f2b61a6ee2be08`:

- `dwarf.return_token_dwarf` — 旧铸模片
- `human.mat.18` — 磨损的银扣
- `elf.return_token_elf` — 褪色的叶脉
- `goblin.return_token_goblin` — 打结的铜丝
- `ashen.silent_crystal` — 沉默的晶片

Five new optional scenes use existing areas and the shared NPC cast: 赫珀/dwarf.a05, 奥登/human.a04, 伊萝/elf.a04, 滴索/goblin.a06, 砾露/ashen.a06. Scene staging is this authorized draft, not a claim that every line was previously canon. No new major plot. No Library fallback: blocked story Library was not accessed.

The user confirmed +3 **percentage points**, including gems/rare materials, on October 26. Explicit supported pools: independent boss legendary; eligible nonzero `special` and `gem` material channels. Apply after existing luck, cap 100%; source eligibility and unique-held filtering precede the roll. No resurrection of zero/empty sources, no story-material farming. Excluded: regular/recovery material channels, ordinary equipment occurrence/quality, affix/divine, conditional set selection, fruit/reforge-token consumables. Gem **base rate** adjustment is a separate worker/change, not this bonus.

## Actual runtime

- Sealed authored production task registry: 5 Ring scenes + 30 local NPC events/15 NPCs.
- Choice responses are explicit (never preselected), persisted and displayed with the selected outcome.
- 20 ordinary one-offs; 10 repeats with real Q0 costs or a fresh actual victory, meaningful fixed common-material rewards, manual reacceptance and existing 300000ms cooldown. No retroactive kills, no duplicate loot rounds, no extra rewards from story duels/summons.
- Current-area presence, actual area unlock, no active expedition, and shared war gate are checked again at submission. Ordinary “later” retains opportunity/progress; Ring “continue on” can permanently decline.
- Fixed rewards, consumption, outcome and completion ledger persist atomically. Full bags keep the task ready; freeing a final material stack can allow its reward. Filters never silently discard NPC rewards. Failure/reload/repeated submission cannot duplicate rewards.
- Recipe is permanent and independent of holding/completing the five optional materials. Craft uses exactly five Q3 inputs, existing fusion cost40/racial adjustment and current material-level ±2 rule. Once-per-run ledger survives sale, random fusion and loss. Full ring bag uses existing one pending forge slot; failed-storage retry retains one prepared result.
- Ring has four standard legendary ordinary affixes compatible with existing refining. Equipped-only victory full heal includes every ordinary-dungeon stage, before next-stage HP. +3pp applies to the explicit pools above in real settlement.
- Material descriptions remain unchanged. Hidden usage appears only after recipe learning. Generic explicit discard applies to all materials, no special warning, replacement or ledger reset.
- Optional current-generation fields; schema6 preserved. No old-save compatibility or migration added.

## Story-host dependency and exact hooks

This change does **not** fake mainline progress or turn exploration into chapter completion. `s.story.flags` must come from the genuine story host. Closed-default opportunities:

|Flag|Real world event|
|---|---|
|`return-ring.elf.scene-open`|C02 E03 spring/village-route recovery|
|`return-ring.human.scene-open`|C04 G01 rescue/cargo branch outcome|
|`return-ring.dwarf.scene-open`|C06 D01/D02 miners evacuated|
|`return-ring.goblin.scene-open`|C06 G01 backup supply path|
|`return-ring.ashen.scene-open`|C06 A01 outpost support|
|`return-ring.recipe-revealed`|C06.RR01.<POV> mandatory old-object joining scene, before C07|

Each POV receives world opportunity flags at the genuine chapter outcome, not knowledge of secret events. `syncReturnRingRecipe(candidate)` runs within the story completion transaction. It checks the real recipe flag and requires neither material possession nor optional completion. Shared local NPC host is real/playable without story flags; Ring story availability still requires the actual mainline integration.

## Verification

New commands: `npm run test:npc-events` covers model and real App handler flow. Extra regression runs: task service/boundary, dwarf materials, goblin/ashen drop settlements, legendary drop/production, adjacent-region actual App.

The full `npm test` reaches a **pre-existing** `equipment-armor-art-tests.mjs` mismatch (`36 !== 28`) also reproduced in untouched integration baseline. Do not describe this as an all-green aggregate. No browser pixel screenshot audit claimed by the fake-DOM App tests; source-aware rendered/browser QA remains separate.
