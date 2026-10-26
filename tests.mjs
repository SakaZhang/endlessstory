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
for(const file of ['potion-catalog-tests.mjs','potion-expansion-tests.mjs','potion-expiry-parity-tests.mjs'])runAffixSourceTest(process.execPath,[new URL('./'+file,import.meta.url).pathname],{stdio:'inherit'});

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
