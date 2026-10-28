# Contextual skill release conditions

Current-tree choices now come from explicit skill/weapon mappings, not the historical 28-state menu. All 105 active skills were audited. Empty slots and unrelated attacks offer only “可用即施放”. No new combat effects or bonuses were introduced.

- Healing/defense: low HP; shields: no shield; cleanse: actual host-cleanse eligibility; interrupts: enemy preparing.
- Bleed/break/burn/poison/shield gates only where the skill has the corresponding pre-existing bonus or requirement, including weapon variants.
- Mire seal alone exposes five poison layers for its actual additional effect.
- A single elemental-resistance option matches the skill's actual damage element(s), including pure reads of the elf's current rotating element.
- Equipped Anvil two-piece adds bleed/break options to direct physical skills, matching the existing set multiplier; bag items do not count.

## Compatibility and editing

All historical IDs remain valid in saves and presets. Unsupported rules are preserved verbatim but resolved to “always” in current-tree combat. Both editor and loadout tooltip disclose the retained old rule and fallback; the editor offers an explicit draft-only replacement button. No save migration, build reset, point reset or progress reset occurs. Historical combat retains its evaluator.

Changes of skill, weapon, equipped set or viewed preset recalculate choices. Noncurrent saved presets use their saved equipment; the current preset uses live equipment. Existing confirmation, cancel, storage-error retry and atomic persistence paths remain unchanged.

## Verification

Focused suites: contextual-skill-condition-tests.mjs, contextual-condition-compat-tests.mjs, contextual-condition-selector-tests.mjs, skill-condition-tests.mjs; existing tree state/UI/selector/live-budget/decrement/production-host/active-integration/app-UI suites. Tests include exact 105×10 skill/weapon options, actual planner comparisons, equipped-set matrix, legacy roundtrips across five races, wrong/expired element and selected-target isolation, production selector/JSON replay, draft-only edits and cancel/retry.
