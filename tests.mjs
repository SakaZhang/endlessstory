import './infinity-gauntlet-tests.mjs';
import './infinity-gauntlet-combat-tests.mjs';
import './infinity-gauntlet-recipe-tests.mjs';
import './unique-crafted-disposal-tests.mjs';
import './return-ring-drop-tests.mjs';
import './npc-event-host-tests.mjs';
import './return-ring-events-tests.mjs';
import './task-reward-engine-integration-tests.mjs';
import './task-reward-transaction-tests.mjs';
// Current schema regression entrypoint. Prior schema tests are superseded.
import './engine-v4-tests.mjs';

import './reforge-tests.mjs';
import './loadout-tests.mjs';

import './merchant-tests.mjs';


import './talent-tests.mjs';


import './material-quality-tests.mjs';

import './hp-rest-tests.mjs';
import './potion-tests.mjs';
import './potion-forge-tests.mjs';

import './recipe-tests.mjs';

import './element-schema-tests.mjs';
import './elemental-combat-tests.mjs';
import './pending-reforge-tests.mjs';
import './reforge-v13-tests.mjs';

import './transaction-tests.mjs';

import './forge-level-tests.mjs';
import './material-forge-variance-tests.mjs';
import './area-progress-tests.mjs';
import './equipment-level-tests.mjs';
import './inventory-bags-tests.mjs';
import './set-source-tests.mjs';
import './rare-idle-rewards-tests.mjs';
import './codex-collection-tests.mjs';
import './batch-sale-tests.mjs';
import './equipment-fusion-tests.mjs';

await import('./recovery-tests.mjs');

import './multi-combat-tests.mjs';

import './development-sandbox-tests.mjs';

import './equipment-template-tests.mjs';
import './equipment-enhancement-tests.mjs';

import './equipment-armor-art-tests.mjs';
import './equipment-art-tests.mjs';
import './equipment-art-ui-tests.mjs';

import './equipment-presentation-tests.mjs';

import './equipment-presentation-css-tests.mjs';

import './reforge-inheritance-tests.mjs';

import './affix-expansion-tests.mjs';
import './lifesteal-linear-tests.mjs';
import './multi-affix-tests.mjs';

import './affix-production-tests.mjs';
import './reforge-same-type-tests.mjs';

import './reforge-divine-tests.mjs';
import './fusion-origin-tests.mjs';

import './fusion-origin-production-tests.mjs';

import './character-progression-tests.mjs';
import './equipment-budget-adapter-tests.mjs';
import './formal-enhancement-tests.mjs';
import './formal-enhancement-integration-tests.mjs';
import './m2-generation-tests.mjs';
import './m2-engine-tests.mjs';
import './m2-set-progression-tests.mjs';
import './m2-progression-combat-tests.mjs';

import './m2-delay-lifecycle-tests.mjs';

import './m2-reaper-shield-tests.mjs';

import './m2-support-eligibility-tests.mjs';

import "./dwarf-monster-portrait-ui-tests.mjs";
// Native pixel export regression: node dwarf-art-tests.mjs (requires optional QA canvas renderer).

import "./m2-production-activation-tests.mjs";

// Earlier boundary tests deliberately clear the global monster provider; verify
// normal affix acquisition in a fresh production realm, not that poisoned fixture.
import {execFileSync as runAffixSourceTest} from 'node:child_process';
runAffixSourceTest(process.execPath,[new URL('./affix-source-tests.mjs',import.meta.url).pathname],{stdio:'inherit'});

// v0.34 tests require the default production provider, isolated from old boundary fixtures.
for(const file of ['luck-policy-tests.mjs','luck-production-tests.mjs','legendary-drop-tests.mjs','player-shield-layers-tests.mjs','equipment-runtime-tests.mjs','equipment-runtime-production-tests.mjs','legendary-equipment-tests.mjs','legendary-combat-tests.mjs','legendary-production-tests.mjs','legendary-filter-tests.mjs'])runAffixSourceTest(process.execPath,[new URL('./'+file,import.meta.url).pathname],{stdio:'inherit'});

// v0.35 navigation ledgers and preview modules run in their own production realm.
for(const file of ['region-navigation-state-tests.mjs','adjacent-region-tests.mjs'])runAffixSourceTest(process.execPath,[new URL('./'+file,import.meta.url).pathname],{stdio:'inherit'});

// Current-tree state, shared production host and strict-generation regressions use isolated realms.
for(const file of ['skill-tree-state-tests.mjs','skill-tree-preparation-tests.mjs','skill-tree-consumer-tests.mjs','skill-tree-poison-tests.mjs','skill-tree-effects-tests.mjs','skill-tree-effect-host-tests.mjs','skill-tree-poison-host-tests.mjs','skill-tree-combat-schema-tests.mjs','skill-tree-production-host-tests.mjs','skill-tree-attributes-tests.mjs','skill-tree-passives-tests.mjs','skill-tree-passive-host-tests.mjs','skill-tree-selector-tests.mjs','skill-tree-dungeon-carry-tests.mjs','skill-tree-active-integration-tests.mjs','skill-tree-fresh-migration-tests.mjs','skill-tree-healing-compat-tests.mjs'])runAffixSourceTest(process.execPath,[new URL('./'+file,import.meta.url).pathname],{stdio:'inherit'});

// v0.37 constant racial forge policy and actual transactions use isolated realms.
for(const file of ['dwarf-forge-favor-tests.mjs','dwarf-forge-production-tests.mjs','dwarf-forge-enhancement-tests.mjs'])runAffixSourceTest(process.execPath,[new URL('./'+file,import.meta.url).pathname],{stdio:'inherit'});

// Presentation observers must leave real simulation/RNG untouched.
for(const file of ['combat-display-bridge-tests.mjs','combat-display-potion-tests.mjs','battle-slice-tests.mjs'])runAffixSourceTest(process.execPath,[new URL('./'+file,import.meta.url).pathname],{stdio:'inherit'});

// M3 staged content, source routing and isolated delayed basic scheduling.
for(const file of ['m3-content-tests.mjs','m3-material-tests.mjs','m3-slow-tests.mjs','m3-rewards-tests.mjs','m3-production-activation-tests.mjs'])runAffixSourceTest(process.execPath,[new URL('./'+file,import.meta.url).pathname],{stdio:'inherit'});

// Final dwarf area batch: staged data/typed effects preserve existing production sources.
for(const file of ['m4-content-tests.mjs','m4-material-tests.mjs','m4-runtime-tests.mjs','m4-production-activation-tests.mjs','m4-rewards-tests.mjs'])runAffixSourceTest(process.execPath,[new URL('./'+file,import.meta.url).pathname],{stdio:'inherit'});

// v0.41 fixed recipes and real buff-expiry parity require isolated production realms.
for(const file of ['potion-catalog-tests.mjs','potion-expansion-tests.mjs','potion-expiry-parity-tests.mjs','luck-potion-early-material-tests.mjs'])runAffixSourceTest(process.execPath,[new URL('./'+file,import.meta.url).pathname],{stdio:'inherit'});

// v0.42 normal battle presentation observes committed live events only.
for(const file of ['live-combat-events-tests.mjs','live-battle-view-tests.mjs'])runAffixSourceTest(process.execPath,[new URL('./'+file,import.meta.url).pathname],{stdio:'inherit'});

// v0.43 actual A02 identities, follower visual variants and area-only background layers.
runAffixSourceTest(process.execPath,[new URL('./live-battle-a02-tests.mjs',import.meta.url).pathname],{stdio:'inherit'});

// v0.44 actual A03 elite/boss identities and shield-only non-damaging presentation.
runAffixSourceTest(process.execPath,[new URL('./live-battle-a03-tests.mjs',import.meta.url).pathname],{stdio:'inherit'});

// Immutable release resource graph; retired save factories are tested only for deletion.
runAffixSourceTest(process.execPath,[new URL('./release-cache-tests.mjs',import.meta.url).pathname],{stdio:'inherit'});
runAffixSourceTest(process.execPath,[new URL('./battle-preview-entry-tests.mjs',import.meta.url).pathname],{stdio:'inherit'});

for(const file of ['current-save-generation-tests.mjs','storage-generation-v3-tests.mjs','storage-real-retired-tests.mjs','combat-float-icons-tests.mjs'])runAffixSourceTest(process.execPath,[new URL('./'+file,import.meta.url).pathname],{stdio:'inherit'});

// v0.45 exact A04 skill presentation on the current save generation.
runAffixSourceTest(process.execPath,[new URL('./live-battle-a04-tests.mjs',import.meta.url).pathname],{stdio:'inherit'});

// v0.46 A05–06 exact art, region baselines and real follower/shield events.
runAffixSourceTest(process.execPath,[new URL('./live-battle-a05-a06-tests.mjs',import.meta.url).pathname],{stdio:'inherit'});

// v0.47 remaining18 canonical enemy identities, actual follower and boss events.
runAffixSourceTest(process.execPath,[new URL('./live-battle-a07-a10-tests.mjs',import.meta.url).pathname],{stdio:'inherit'});

// v0.48 production UI layouts and original integer-grid icons.
for(const file of ['pixel-shell-tests.mjs','pixel-inventory-tests.mjs','pixel-services-tests.mjs','pixel-ui-icons-tests.mjs'])runAffixSourceTest(process.execPath,[new URL('./'+file,import.meta.url).pathname],{stdio:'inherit'});

// v0.49 all-lifecycle presentation: actual fresh idle, errors, neutral and portraits.
runAffixSourceTest(process.execPath,[new URL('./live-battle-lifecycle-tests.mjs',import.meta.url).pathname],{stdio:'inherit'});

// v0.50 real service scenes, isolated resource errors and exact layered art.
runAffixSourceTest(process.execPath,[new URL('./pixel-service-scenes-tests.mjs',import.meta.url).pathname],{stdio:'inherit'});

// v0.51 exact world/area pixel maps and current equipment alcove, no gameplay changes.
for(const file of ['test-pixel-map-scenes.mjs','test-map-pin-geometry.mjs','equipment-stage-tests.mjs'])runAffixSourceTest(process.execPath,[new URL('./'+file,import.meta.url).pathname],{stdio:'inherit'});

// v0.52 original canonical artwork across every skill consumer.
for(const file of ['skill-pixel-icons-tests.mjs','skill-pixel-consumers-tests.mjs','skill-pixel-hud-tests.mjs'])runAffixSourceTest(process.execPath,[new URL('./'+file,import.meta.url).pathname],{stdio:'inherit'});

// v0.53 direct equipment PNGs, canonical identity/frame and explicit image failure.
for(const file of ['equipment-raster-adapter-tests.mjs','legendary-art-tests.mjs'])runAffixSourceTest(process.execPath,[new URL('./'+file,import.meta.url).pathname],{stdio:'inherit'});

// v0.54 exact material art; acquisition and story flags are not changed by visuals.
runAffixSourceTest(process.execPath,[new URL('./material-pixel-art-tests.mjs',import.meta.url).pathname],{stdio:'inherit'});

// v0.55 exact potion / utility art without modifying effects or costs.
runAffixSourceTest(process.execPath,[new URL('./consumable-pixel-art-tests.mjs',import.meta.url).pathname],{stdio:'inherit'});

// v0.56 reuse exact battle idle artwork in codex/source/unit portraits.
runAffixSourceTest(process.execPath,[new URL('./monster-pixel-portrait-tests.mjs',import.meta.url).pathname],{stdio:'inherit'});

// Isolate actual combat fixtures from older suites' provider overrides.
runAffixSourceTest(process.execPath,[new URL('./battle-feedback-regression-tests.mjs',import.meta.url).pathname],{stdio:'inherit'});
// Camp scenes are real persisted location transitions, not a field skin.
runAffixSourceTest(process.execPath,[new URL('./racial-camp-scenes-tests.mjs',import.meta.url).pathname],{stdio:'inherit'});
// v0.57 earned skill points stay live while local drafts survive combat.
for(const file of ['skill-tree-live-budget-tests.mjs','skill-tree-layout-v057-tests.mjs'])runAffixSourceTest(process.execPath,[new URL('./'+file,import.meta.url).pathname],{stdio:'inherit'});
// v0.57 fixed-recipe batch controls respect quantities and inventory limits.
runAffixSourceTest(process.execPath,[new URL('./recipe-batch-limits-tests.mjs',import.meta.url).pathname],{stdio:'inherit'});
// v0.57 current-area opt-in automation and owned-only life-potion controls.
for(const file of ['expedition-automation-tests.mjs','battle-potion-owned-tests.mjs'])runAffixSourceTest(process.execPath,[new URL('./'+file,import.meta.url).pathname],{stdio:'inherit'});
// v0.57 same-slot affix transplant, exact source inheritance and ring socket names.
runAffixSourceTest(process.execPath,[new URL('./reforge-same-slot-tests.mjs',import.meta.url).pathname],{stdio:'inherit'});
// Stat-label consistency is presentation-only; retain rating/rate distinctions.
runAffixSourceTest(process.execPath,[new URL('./stat-label-tests.mjs',import.meta.url).pathname],{stdio:'inherit'});
// v0.58 native frame-facing and renderer lifecycle regression.
runAffixSourceTest(process.execPath,[new URL('./monster-facing-tests.mjs',import.meta.url).pathname],{stdio:'inherit'});

// Goblin selection and portrait facing, plus unchanged battle/camp orientation.
runAffixSourceTest(process.execPath,[new URL('./goblin-hero-facing-tests.mjs',import.meta.url).pathname],{stdio:'inherit'});
// Explicit war state and the shared entry/offline access gate.
runAffixSourceTest(process.execPath,[new URL('./war-travel-lock-tests.mjs',import.meta.url).pathname],{stdio:'inherit'});

// Approved Infinity gem base rates: source invariants, real settlement and offline parity.
for(const file of ['tools/sync-infinity-gem-probabilities.mjs','infinity-gem-base-tests.mjs','infinity-gem-settlement-tests.mjs'])runAffixSourceTest(process.execPath,[new URL('./'+file,import.meta.url).pathname,...(file.startsWith('tools/')?['--check']:[])],{stdio:'inherit'});
// Exact story-only war entrances and real C07 declaration transaction.
for(const file of ['war-story-access-tests.mjs','story-war-opening-tests.mjs'])runAffixSourceTest(process.execPath,[new URL('./'+file,import.meta.url).pathname],{stdio:'inherit'});

// Real canonical story/UI, cross-system Ring and image-recovery boundaries.
for(const file of ['story-event-controller-tests.mjs','story-scenario-combat-tests.mjs','story-ring-integration-tests.mjs','story-event-app-ui-tests.cjs','npc-event-app-ui-tests.cjs','asset-recovery-tests.mjs','asset-recovery-app-ui-tests.cjs'])runAffixSourceTest(process.execPath,[new URL('./'+file,import.meta.url).pathname],{stdio:'inherit'});

// Random world clock and the actual App tick/resume/storage boundary.
for(const file of ['random-war-world-tests.mjs','random-war-story-access-tests.mjs','random-war-app-ui-tests.cjs'])runAffixSourceTest(process.execPath,[new URL('./'+file,import.meta.url).pathname],{stdio:'inherit'});

// Presentation-only family identities preserve all canonical story records.
for(const file of ['chik-family-tests.mjs','chik-family-app-ui-tests.cjs'])runAffixSourceTest(process.execPath,[new URL('./'+file,import.meta.url).pathname],{stdio:'inherit'});

// Six approved personal family scenes: fixed supplies and one earned stage claim.
for(const file of ['chik-family-event-tests.mjs','chik-family-event-app-ui-tests.cjs','chik-family-reward-tests.mjs','chik-family-reward-app-ui-tests.cjs'])runAffixSourceTest(process.execPath,[new URL('./'+file,import.meta.url).pathname],{stdio:'inherit'});

// Five optional long arcs, actual site actions, resumed routes and durable rewards.
for(const file of ['personal-arc-runtime-tests.mjs','personal-arc-app-ui-tests.cjs','personal-arc-reward-tests.mjs'])runAffixSourceTest(process.execPath,[new URL('./'+file,import.meta.url).pathname],{stdio:'inherit'});

// Completed mainline: real five-POV gates, combat checkpoints, interruption and exact arena routing.
for(const file of ['story-finale-runtime-tests.mjs','story-finale-balance-tests.mjs','story-finale-background-tests.mjs','story-finale-app-ui-tests.cjs','story-finale-cancellation-app-ui-tests.cjs'])runAffixSourceTest(process.execPath,[new URL('./'+file,import.meta.url).pathname],{stdio:'inherit'});

// Mandatory story corridors must not softlock just-in-time exploration.
for(const file of ['story-war-locked-progression-tests.mjs','story-war-locked-progression-app-ui-tests.cjs'])runAffixSourceTest(process.execPath,[new URL('./'+file,import.meta.url).pathname],{stdio:'inherit'});

// Integrated v0.71 contracts: no starter grants, immutable affix origins, talent effects,
// fixed regional budgets, existing active saves and bounded offline world deadlines.
for(const file of ["affix-level-growth-tests.mjs", "empty-starter-engine-tests.mjs", "empty-starter-app-ui-tests.cjs", "talent-balance-v071-tests.mjs", "talent-balance-ui-tests.cjs", "balance-cross-system-host-tests.mjs", "balance-talent-integration-tests.mjs", "monster-balance-tests.mjs", "monster-cadence-budget-tests.mjs", "old-active-balance-compat-tests.mjs", "balance-old-story-save-tests.mjs", "balance-old-finale-save-tests.mjs", "natural-balance-fixture-tests.mjs", "random-war-boundary-tests.mjs"])runAffixSourceTest(process.execPath,[new URL('./'+file,import.meta.url).pathname],{stdio:'inherit'});

runAffixSourceTest(process.execPath,[new URL('./skill-tree-decrement-tests.mjs',import.meta.url).pathname],{stdio:'inherit'});

runAffixSourceTest(process.execPath,[new URL('./skill-condition-tests.mjs',import.meta.url).pathname],{stdio:'inherit'});

runAffixSourceTest(process.execPath,[new URL('./merchant-quality-pricing-tests.mjs',import.meta.url).pathname],{stdio:'inherit'});
runAffixSourceTest(process.execPath,[new URL('./merchant-quality-pricing-ui-tests.cjs',import.meta.url).pathname],{stdio:'inherit'});

// Explicit selected-area travel is a persisted noncombat action.
for(const file of ['selected-area-travel-tests.mjs','selected-area-travel-app-ui-tests.cjs'])runAffixSourceTest(process.execPath,[new URL('./'+file,import.meta.url).pathname],{stdio:'inherit'});

// Slot-aware generation and paid legacy compatibility need an isolated production realm.
runAffixSourceTest(process.execPath,[new URL('./affix-slot-pools-tests.mjs',import.meta.url).pathname],{stdio:'inherit'});

runAffixSourceTest(process.execPath,[new URL('./affix-slot-story-compat-tests.mjs',import.meta.url).pathname],{stdio:'inherit'});

// Rename-only v0.74: public branding without persisted identifier or mechanics changes.
runAffixSourceTest(process.execPath,[new URL('./branding-v074-tests.mjs',import.meta.url).pathname],{stdio:'inherit'});
// Contextual skill/weapon/set release rules and nondestructive historical-save fallback.
for(const file of ['contextual-skill-condition-tests.mjs','contextual-condition-compat-tests.mjs','contextual-condition-selector-tests.mjs'])runAffixSourceTest(process.execPath,[new URL('./'+file,import.meta.url).pathname],{stdio:'inherit'});

// Actionable NPC objectives and verified loading optimizations.
runAffixSourceTest(process.execPath,[new URL('./npc-objective-runtime-tests.mjs',import.meta.url).pathname],{stdio:'inherit'});
runAffixSourceTest(process.execPath,[new URL('./npc-objective-ui-tests.mjs',import.meta.url).pathname],{stdio:'inherit'});
runAffixSourceTest(process.execPath,[new URL('./npc-objective-app-ui-tests.cjs',import.meta.url).pathname],{stdio:'inherit'});
runAffixSourceTest(process.execPath,[new URL('./npc-objective-compatibility-audit-tests.mjs',import.meta.url).pathname],{stdio:'inherit'});
runAffixSourceTest(process.execPath,[new URL('./asset-loading-performance-tests.mjs',import.meta.url).pathname],{stdio:'inherit'});
runAffixSourceTest(process.execPath,[new URL('./release-entry-bundle-tests.mjs',import.meta.url).pathname],{stdio:'inherit'});

// v0.77 safe-boundary automatic idle actions: no lost combat or duplicate rewards.
for(const file of ['idle-action-controller-tests.mjs','auto-idle-safety-tests.mjs','idle-action-ui-tests.mjs','idle-action-app-ui-tests.cjs'])runAffixSourceTest(process.execPath,[new URL('./'+file,import.meta.url).pathname],{stdio:'inherit'});
// Visually audited per-frame elf facing; raw art remains byte-identical.
runAffixSourceTest(process.execPath,[new URL('./elf-monster-facing-regression-tests.mjs',import.meta.url).pathname],{stdio:'inherit'});
// Runtime-only safe framing removes adjacent scene strips without touching source PNGs.
runAffixSourceTest(process.execPath,[new URL('./elf-background-viewport-tests.mjs',import.meta.url).pathname],{stdio:'inherit'});

// Editorial refresh preserves gameplay contracts and legendary display identity.
for(const file of ['interface-copy-tests.mjs','racial-equipment-copy-tests.mjs','copy-mechanics-invariants-tests.mjs','legendary-display-ui-tests.cjs','legendary-race-art-tests.mjs'])runAffixSourceTest(process.execPath,[new URL('./'+file,import.meta.url).pathname],{stdio:'inherit'});
runAffixSourceTest(process.execPath,[new URL('./narrative-copy-tests.mjs',import.meta.url).pathname],{stdio:'inherit'});
runAffixSourceTest(process.execPath,[new URL('./racial-material-copy-tests.mjs',import.meta.url).pathname],{stdio:'inherit'});

// Current-location automatic boss UI, safe boundaries and independent failure retry wait.
runAffixSourceTest(process.execPath,[new URL('./auto-current-boss-tests.mjs',import.meta.url).pathname],{stdio:'inherit'});
// Independently authorized boss damage calibration: no HP inflation or player nerfs.
for(const file of ['boss-growth-parameter-tests.mjs','boss-special-boundary-tests.mjs'])runAffixSourceTest(process.execPath,[new URL('./'+file,import.meta.url).pathname],{stdio:'inherit'});
runAffixSourceTest(process.execPath,[new URL('./dungeon-damage-tests.mjs',import.meta.url).pathname],{stdio:'inherit'});
// Complete read-only attributes and redesigned hidden recipe presentation.
for(const file of ['character-stats-tests.mjs','character-stats-app-ui-tests.cjs','return-ring-ui-tests.mjs','return-ring-app-ui-tests.cjs','story-copy-compatibility-tests.mjs','story-copy-compatibility-app-ui-tests.cjs'])runAffixSourceTest(process.execPath,[new URL('./'+file,import.meta.url).pathname],{stdio:'inherit'});

runAffixSourceTest(process.execPath,[new URL('./material-fusion-economy-tests.mjs',import.meta.url).pathname],{stdio:'inherit'});
runAffixSourceTest(process.execPath,[new URL('./material-recipe-expansion-tests.mjs',import.meta.url).pathname],{stdio:'inherit'});

runAffixSourceTest(process.execPath,[new URL('./shared-legendary-weapon-tests.mjs',import.meta.url).pathname],{stdio:'inherit'});
runAffixSourceTest(process.execPath,[new URL('./return-ring-contract-tests.mjs',import.meta.url).pathname],{stdio:'inherit'});
runAffixSourceTest(process.execPath,[new URL('./return-ring-experience-tests.mjs',import.meta.url).pathname],{stdio:'inherit'});
runAffixSourceTest(process.execPath,[new URL('./character-stats-experience-tests.mjs',import.meta.url).pathname],{stdio:'inherit'});
runAffixSourceTest(process.execPath,[new URL('./dungeon-loot-receipts-tests.mjs',import.meta.url).pathname],{stdio:'inherit'});

runAffixSourceTest(process.execPath,[new URL('./experience-progression-tests.mjs',import.meta.url).pathname],{stdio:'inherit'});
runAffixSourceTest(process.execPath,[new URL('./bow-direction-tests.mjs',import.meta.url).pathname],{stdio:'inherit'});
runAffixSourceTest(process.execPath,[new URL('./map-manifest-timeout-tests.mjs',import.meta.url).pathname],{stdio:'inherit'});

runAffixSourceTest(process.execPath,[new URL('./set-effects-display-tests.mjs',import.meta.url).pathname],{stdio:'inherit'});
runAffixSourceTest(process.execPath,[new URL('./set-effects-app-ui-tests.cjs',import.meta.url).pathname],{stdio:'inherit'});

runAffixSourceTest(process.execPath,[new URL('./rare-loot-ui-tests.cjs',import.meta.url).pathname],{stdio:'inherit'});

runAffixSourceTest(process.execPath,[new URL('./return-ring-presentation-tests.mjs',import.meta.url).pathname],{stdio:'inherit'});

runAffixSourceTest(process.execPath,[new URL('./forge-selection-scroll-app-ui-tests.cjs',import.meta.url).pathname],{stdio:'inherit'});

runAffixSourceTest(process.execPath,[new URL('./attribute-integer-display-tests.mjs',import.meta.url).pathname],{stdio:'inherit'});

runAffixSourceTest(process.execPath,[new URL('./potion-independent-cooldown-tests.mjs',import.meta.url).pathname],{stdio:'inherit'});

runAffixSourceTest(process.execPath,[new URL('./material-capacity-tests.mjs',import.meta.url).pathname],{stdio:'inherit'});

runAffixSourceTest(process.execPath,[new URL('./material-browser-tests.mjs',import.meta.url).pathname],{stdio:'inherit'});

runAffixSourceTest(process.execPath,[new URL('./material-browser-app-ui-tests.cjs',import.meta.url).pathname],{stdio:'inherit'});

runAffixSourceTest(process.execPath,[new URL('./extra-boss-challenges-tests.mjs',import.meta.url).pathname],{stdio:'inherit'});

runAffixSourceTest(process.execPath,[new URL('./boss-challenge-app-ui-tests.cjs',import.meta.url).pathname],{stdio:'inherit'});

runAffixSourceTest(process.execPath,[new URL('./human-level100-boss-tests.mjs',import.meta.url).pathname],{stdio:'inherit'});

runAffixSourceTest(process.execPath,[new URL('./human-level100-boss-art-tests.mjs',import.meta.url).pathname],{stdio:'inherit'});
