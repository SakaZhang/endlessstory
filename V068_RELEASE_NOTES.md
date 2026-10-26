# v0.68 — Character presentation and six approved family moments

Base: exact live v0.67 `706c2687a448635d75088977abf61c3000eeccfe`.

## Character art and dialogue

- Brock now uses the approved horned, copper-bearded design across all 25 native axe, hammer and empty-hand frames. Anchors, per-family scale and actual body-height calibration are retained. Authored neutral attack/hurt/death animations play only when the manifest contains their frames; old idle-only manifests retain their fallback. The other four races' existing art is unchanged.
- Story dialogue uses a separate detailed Brock 96px bust mechanically cropped from the already-approved horned master. Its 192px review image and full provenance remain outside the release directory. Character selection, battle, HUD and equipment-paperdoll contexts still use the native full-body art, not the bust.
- Chik's siblings are 咔洛、米芮、豆布, with three distinct pixel portraits. Canonical family scenes reveal only the siblings actually present in that Goblin POV. Family speakers use their highlighted cast card, not a duplicated second avatar. A Chik line adds his own portrait without falsely highlighting a sibling.
- Main-story speakers have exact scene/POV/line-bound portraits and presentation names: five new live supporting portraits, five explicitly reused regional identities, the existing priest and current hero assets. The five hero professions come from the existing race registry: Chik is **盗贼**, and 砾恩 is **矿石行者**. No anonymous courier or narrator line is globally reassigned to a named person.
- The minister portrait appears only after the Dwarf character has completed the exact evidence scene and holds its flag and knowledge receipt. It is clearly a person identified by incomplete evidence, not a speaking actor or newly invented boss. The current Dwarf king remains a design draft: his image exists only in source/QA, has no runtime URL, and is absent from the published asset graph. He is never substituted for the ancient king mentioned in C08.
- Portraits are lazy current-view images using the existing bounded recovery contract. Original generated pixels, prompts, hashes and review derivatives remain in source-art/art directories, not the publication directory. Shared native proofs are labelled as native compositions, not browser screenshots.

## Approved small family-event reward scope

The three siblings have six optional Goblin-only one-off family moments, separate from the unchanged **30 regional NPCs / 60 regional events** and five Return Ring material events. The early/later groups follow their existing C02/C05 story gates. Once the invasion begins, old family moments no longer newly advance. A choice that has not completed its supply transaction remains paused, not silently completed. Finished event records and their already-granted potions remain intact; an earned but unclaimed six-event stage reward can still be collected in an eligible home area.

Each event grants exactly **two Q0 healing potions**, for a maximum of twelve across all six. Completing all six genuine resolved choices and claims unlocks **one stage-one reforge mark**, claimed once through the sealed reward transaction. No repeat farming, gold or rare-material payout is added. This is not the full personal-arc reward: the future complete-arc Q3 choice and the other four personal story arcs are not implemented here.

Capacity, failed storage, stale snapshots, reloads and duplicate submissions must preserve the same reward/receipt outcome rather than consume a payout or grant it twice. Existing mainline completion is not fabricated to unlock the family events.

## Preserved boundaries

The existing 103 canonical mainline scene definitions, choices, flags, saved cursor counts and knowledge derivation are unchanged. Presentation names are not serialized back into old story history. Schema6 / `ashencrown-v6` remain unchanged, with no reset or migration of valid current progress. Combat, equipment, drop probabilities, Ring15 healing, random/story war semantics, v0.67 newer-save protection and v0.65 facing are retained. Skill-tree scrolling/layout is not changed.

**C09–C10 and the final battle remain unavailable.** Neither the portraits nor these six family events imply that the complete ten-chapter mainline or all five personal arcs are implemented.

## Verification record

Runtime freeze: `37e4366` (approved family implementation through `8e9353f`; final follow-up changes only this report and a test-console clarification). Build release: `82e780f227b5084aa218003569dc088cc8da88a2652b2ea407ffd706d1169707`, **2767 files**. Final dependency/cache probe passed **2765 resource URLs / 8316 dependency edges**, six byte-mutation checks and eight deliberately broken-reference checks. The Sites packaging helper was unavailable to this integration process; official packaging/publishing belongs to the release owner. The release dependency probe follows real imports, portrait registries and the production battle manifest, including deliberate missing-family/main-cast/Brock-image negatives. It does not whitelist unused new runtime modules or the unimplemented king image.

Integrated focused verification passed: all four family model/App suites (12 choice branches, capacity, failed writes, newer snapshots, reload/repeat and earned milestone); the original 30/60 NPC expansion and offline exploration tests; sealed task reward engine/service tests; 103-scene / 751-state / 15-speaker actual-App coverage; 25 Brock battle frames and dedicated source-derived bust; all-five native hero presentation/facing/neutral fallback; family privacy and no duplicate portrait; shared image recovery and existing C08 App route checks. An independent reviewer also followed the same genuine C05 save through C08 for both the pending-sixth-event and already-earned-six-event cases, rather than transplanting a ledger.

Actual App checks execute the real handlers with DOM fixtures. Native image checks use actual decoded assets and production transforms. Full browser layout/interaction QA is unavailable in this environment (`EPERM`); no bypass was attempted. The established aggregate armor-art assertion `36 !== 28` remains a disclosed baseline failure, not an all-green aggregate claim.
