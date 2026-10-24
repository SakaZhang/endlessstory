# Race expansion — local integration, not deployed

Baseline is published v0.59 / Sites68, exact `627a39d3d21502709b980ada6dd53f38e1accc59`. This subsequent Dwarf30 development-reset change is not yet published. Root owns exact-SHA release approval; this worktree must not be published merely because assets exist or isolated pack tests pass.

## Integrated executable paths
- Five selectable single-hero new saves. Schema4 intentionally starts fresh for all five races; development generations1–3 and game-owned backups are removed without migration. New journeys start at area1.
- Four complete10-area packs, field/normal nodes everywhere, canonical boss locations only.72 canonical materials preserve source whitelists, quality/rarity and potion aliases.
- Three sets/race,36 ordinary templates/race, two boss-pool legends/race; equipment origin and weapon families, Ashen core slot, cross-race equipment permitted except core socket.
- Actual skill planners, passive/effect host, six-element resistance reductions, persistent Ashen resources, finite Goblin reactions, typed per-item legendary clocks/state and approved distinct trigger mechanics. Shared8-hit cap supports Elf six-element attacks; poison probes are not damage records.
- Actual human candidate10% gold discount; Goblin candidate10% extra ordinary material unit only; Elf initial+12 six-element attack/resist. Dwarf existing forge favor unchanged. Numeric effects remain subject to comparative balance review.
- Race art/weapon routes, frame references/facing, skill FX, inventory/forge/map/camp/portrait/catalog mappings. Current-scene-only image loading, six concurrent decodes, obsolete-scene cache eviction and disposal are tested.
- Twelve budget-split retinue encounters: two five-target elite encounters and one four-target boss per new race. Explicit ordinary follower identities, parent-only rewards, and kill-all completion are verified; native formation was accepted after readable hero/leader/follower revision.

## Verified evidence
- `race-expansion-integration-tests.mjs`: five saves/JSON, all40areas/node starts,72 material pools,8 legend equips, aliases, innate, retained existing progress and native file references.
- `tests/races/elf/actual-host.test.mjs`:63 actual equipped bow/staff/axe casts and24 nodes; JSON valid.
- `tests/races/ashen/host.test.mjs`:63 actual casts,23nodes, deterministic JSON continuation, dungeon resource carry, non-Ashen core ownership/equip restriction.
- `goblin-production-tests.mjs`:21skills/23nodes and equipped2/4-set scenarios. Strict comparative legendary-effect and triggered online/offline assertions pass.
- `race-retinue-host-tests.mjs`: all12 actual encounter budgets, independent reward exclusions, JSON and leader-only defeat rejection.
- `live-battle-scoped-loading-tests.mjs`: scoped asset readiness, navigation, bounded concurrency, retry and disposal (mock loader).
- `racial-economy-tests.mjs`: actual five-race merchant/enhancement/fusion transactions, no gear resale arbitrage, fixed material costs, extra-material exclusions.
- `racial-tree-geometry-tests.mjs`: all registered trees have unique cells and downward prerequisite edges.
- `race-art-routing-tests.mjs`: frame IDs/images resolve through actual canvas adapter; this is not screenshot/art-quality acceptance.
- Existing active skill/offline/dungeon/effects/passives/poison/healing/editor regressions passed focused checks. Broad historical suite being rerun; old fixtures below remain unavailable.

## Open gates
- Dwarf expanded30-node definition is staged; activating v2/free skill-only reset awaits user approval. Do not auto-reset any saved allocation.
- Human63 real equipped-weapon skill scenarios and new Human/Elf/Ashen legendary host tests are integrated. All four race legendary host suites pass, including Goblin actual steal/critical/lifesteal/clock behavior and Elf support/missed-echo boundaries. Matched four-hour balance and innate impact at levels1/40/70/100 remain candidate review gates.
- Native art approval: clean extraction, correct scale/facing, real lifecycle poses, both native weapon variants, meaningful skill FX. All race lifecycle/weapon assets are integrated; root visual review remains pending; actual12-retinue and five-race4–7-target native proofs are recorded, with readable-scale refinement under review.
- Browser UI QA unavailable in current environment; do not label native/mock-canvas evidence as browser screenshots.
- `node race-expansion-release-gate.mjs` intentionally fails until numeric/art/actual equipment review records exist.

## Historical fixture blockers (do not fabricate)
- `/workspace/shared/dwarf-m3-a04-a06/provider-candidate.json`
- `/workspace/shared/dwarf-m3-a04-a06/final-provider.json` expected SHA8889b7f4f9087825d3e99e168e95b43bcb7c9120eb097c173a8acf6f4195644d
- `/workspace/shared/dwarf-m3-a07-a10/final-provider.json` expected SHA9975fd7379d2b3d6212edc5c7f9ab7980276d989a6a5b295edbb2da97a4cb9ff

## Fresh-player evidence (no grants)
The shared fixture uses actual fresh gear, earned loot/skill points, paid merchant refreshes, recipe purchase, craft/use, dungeon completion and real A02 entry. These are fixed-seed observations, not promised universal progression times.
- Human after shared loot correction:578.865s, Lv4,0 deaths,4 paid refreshes126gold.
- Elf with installed per-area curve and +12 innate: ~407s, Lv5,0 deaths; actual recipe purchase/craft/use and A02 entry verified.
- Goblin after shared loot correction:2223.8s, Lv8,2 deaths,8 paid refreshes.
- Ashen:2427s, Lv8,2 deaths,9 paid refreshes360gold.
- Dwarf:2569s, Lv9,2 deaths,10 paid refreshes410gold.
Random early healing-recipe access is a shared onboarding friction point; starting100gold/0potions/0skillpoints were unchanged. Ashen route-only diagnostic reaches A02 in620s but explicitly does not replace the full craft/use gate.

## Regression status
Historical suites were advanced in segments, retaining exact numerical/source assertions while updating obsolete single-race catalog assumptions. A complete available-suite rerun excludes only the three externally missing fixture tests listed above; this is not a claim that unmodified npm test passes. Native/mock evidence is not browser QA. Release cache/hash graph independently passed with2396 retained files and audited14-proof exclusions; Sites helper was unavailable.

## Initial numeric review
Root accepted Human/Goblin/Ashen initial content budgets after matched controls and actual source-specific host regressions on2026-10-24. These three providers are reviewed for initial production use, not declared globally final-balanced. Intentional shielding/control/lifesteal and Ashen core advantages may reduce potion usage below40 per4h. Elf per-area curve was accepted as initial baseline; +12 innate exact effect is +4.720–5.843% elemental output and -5.357% incoming elemental damage, with fifteen installed four-hour profiles complete (all zero rests) and initial numeric review accepted. Artwork, exact release approval and Dwarf30 publication stay independent gates.

## Latest review and regression closure
- Full historical available-suite run completed exit0, excluding only the three missing external-fixture imports. Unmodified `npm test` remains blocked by those missing files.
- Root accepted all four native art directions for initial release; this is not browser QA or a claim of finished visual polish. Decoded per-frame bounds are checked against actual PNG alpha with a documented 2px inclusive-edge tolerance.
- Actual equipment detail and discovered codex text for all eight new legends match current reducer mechanics, numeric descriptions and gold exclusive styling.
- User explicitly authorized discarding development saves. Dwarf30 is active; all five trees have30 nodes/99 points and three independent presets. No old configuration preservation/refund/migration is performed.
- Direct App restart regression found and fixed pagehide overwriting a newly selected character: successful restart now adopts the durable fresh state and freezes prior lifecycle writes before reload. Failed writes preserve current journey.
- Independent reviewer found nondeterministic Ashen legend test due to random extra field enemies; fixture now selects a naturally single-actor encounter with seeded equipment; fifteen independent reruns pass with exact storage/shield/save assertions.
- All-eight equipped legendary basic online/offline parity passes; deliberately triggered per-race proc continuation tests also pass for all eight new legends, including exact ledger/ICD/shield/HP and applicable event parity.

## Material contract correction before release
Independent documentation review exposed race-local material-rate/quality drift. The new common `material-loot-profile.js` exactly reproduces all237 populated original Dwarf channels and297 quality vectors (1e-12 tolerance). New packs are regenerated from creature associations only (IDs and relative weights), preserving canonical source whitelists and story exclusions. Regular35/50/75%, eligible recovery60/75/90%, one item per channel; special/gem area-and-rank formulas and area×node quality curves are shared. Human special materials are separated from its ordinary channel. Goblin extra ordinary-unit innate remains a separately tested exception. Final313-pool/1,857-entry audit and120,000 actual settlements pass exact occurrence, quantity, quality, category and source checks.

## v0.59 phase scope and final handoff
Production data frozen at `b9a040e`; later changes only add tests, evidence and this handoff. Initial release-review gates pass for all four new races (numeric, native art and actual equipped set/legend effects). Four new selectable heroes and their ten-area content shipped in v0.59. The subsequent authorized change activates Dwarf30 and schema4 / ashencrown-v4, retires exact game-owned v1/v2/v3 keys and ashencrown-backup-* keys, and leaves other site data untouched. No push or publication by the implementation worker.

After common-loot correction all four genuine fresh-player craft/use/dungeon/A02 journeys were rerun; Human/Elf refreshed evidence, Goblin/Ashen results remain reproducible. The shared early healing-recipe merchant RNG friction remains disclosed, not silently replaced by a grant.

## Final presentation corrections
The economics/content freeze above was followed by two reviewed presentation fixes: skill cooldown HUDs convert internal1100ms ticks to displayed seconds (zero hidden; no gameplay timer change), and foreign/empty weapons use explicit same-race empty-handed neutral art. Native weapon variants are unchanged. Forty valid-save/native-render routing cases cover portrait/camp/field, actual combat and native→neutral→native cache changes. All1,108 racial frame bounds pass decoded-PNG checks. These deltas require a new final SHA and independent presentation/cache review before publication; the earlier freeze is a reference, not deployment authorization.
