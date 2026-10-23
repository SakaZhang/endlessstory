// Current schema regression entrypoint. Prior schema tests are superseded.
import './engine-v4-tests.mjs';
import './storage-tests.mjs';

import './reforge-tests.mjs';
import './loadout-tests.mjs';

import './merchant-tests.mjs';

import './skill-slot-tests.mjs';
import './skill-expansion-tests.mjs';

import './talent-tests.mjs';

import './support-grant-tests.mjs';

import './material-quality-tests.mjs';

import './hp-rest-tests.mjs';
import './potion-tests.mjs';
import './potion-forge-tests.mjs';
import './offline-combat-tests.mjs';

import './recipe-tests.mjs';

import './element-schema-tests.mjs';
import './elemental-combat-tests.mjs';
import './pending-reforge-tests.mjs';
import './reforge-v13-tests.mjs';
import './location-foundation-tests.mjs';
import './dungeon-routing-tests.mjs';

import './transaction-tests.mjs';

import './forge-level-tests.mjs';
import './area-progress-tests.mjs';
import './equipment-level-tests.mjs';
import './dungeon-carry-tests.mjs';
import './inventory-bags-tests.mjs';
import './skill-progression-tests.mjs';
import './set-source-tests.mjs';
import './codex-collection-tests.mjs';
import './batch-sale-tests.mjs';
import './equipment-fusion-tests.mjs';

await import('./recovery-tests.mjs');

import './multi-combat-tests.mjs';

import './monster-codex-tests.mjs';
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

// New-tree state, shared production host and migration regressions use isolated realms.
for(const file of ['skill-tree-state-tests.mjs','skill-tree-preparation-tests.mjs','skill-tree-consumer-tests.mjs','skill-tree-poison-tests.mjs','skill-tree-effects-tests.mjs','skill-tree-effect-host-tests.mjs','skill-tree-poison-host-tests.mjs','skill-tree-combat-schema-tests.mjs','skill-tree-production-host-tests.mjs','skill-tree-attributes-tests.mjs','skill-tree-passives-tests.mjs','skill-tree-passive-host-tests.mjs','skill-tree-selector-tests.mjs','skill-tree-dungeon-carry-tests.mjs','skill-tree-active-integration-tests.mjs','skill-tree-fresh-migration-tests.mjs','skill-tree-healing-compat-tests.mjs'])runAffixSourceTest(process.execPath,[new URL('./'+file,import.meta.url).pathname],{stdio:'inherit'});

// v0.37 constant racial forge policy and actual transactions use isolated realms.
for(const file of ['dwarf-forge-favor-tests.mjs','dwarf-forge-production-tests.mjs','dwarf-forge-enhancement-tests.mjs'])runAffixSourceTest(process.execPath,[new URL('./'+file,import.meta.url).pathname],{stdio:'inherit'});
