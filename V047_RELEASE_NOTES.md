# v0.47 — Full dwarf-region battle pixel coverage

Adds the remaining eighteen canonical monster IDs across A07–A10 to normal battle rendering: 44 / 44 dwarf monster definitions, plus the explicitly registered juvenile/apprentice/drill-beast followers. This means battle sprites, not a redesign of the entire game interface or completion of the story.

Uses per-area baselines 210 / 207 / 220 / 193, including cold and warm asset loading. A08 follower identity selects a distinct rift-drill-beast before its overseer parent. A09's pure shield remains idle; its damaging reflection action is not suppressed. All three A10 boss skills remain damaging actions. Timing, damage numbers, target IDs and statuses continue to come from committed production events.

No numerical, combat-resolution, random-generation or save-schema changes. Existing schema-3 saves persist. The small pixel type glyph remains after each number; shield overlay, death priority and immutable resource namespace remain. Missing/unknown visual identities fail closed instead of substituting the wrong species.

The release-cache test runs the unchanged production CLI and official prepare helper in an isolated copy of current source, so parallel independent gates cannot race on shared build/build.tmp. This is test-only isolation, not a new deployment algorithm.

Known visual limits: some generated frames have documented tiny edge cropping; close simultaneous melee still overlaps at times. Native canvas and actual-App DOM fixtures do not constitute full browser-session QA. No new story triggers or other races are introduced.
