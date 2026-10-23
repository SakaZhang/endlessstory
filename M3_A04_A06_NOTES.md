# M3 first batch: A04–A06 (release candidate)

This batch adds the original roster's 13 monsters and seven nodes, not all ten areas. A01–A03 definitions, source pools, owned items, progress, cooldowns and active saves remain preserved. A07–A10 remain unavailable; clearing A06 records A07 unlocked without making its content playable.

## Scope
- A04 废炉外坡, A05 冷泉与炉区交界, A06 地下炉池; field and three-stage normal dungeon each; manual A06 boss.
- 26 registered monsters total, 14 content nodes, 18 existing material definitions (11 currently eligible through real battle source pools, including the unique gem); 44 per-monster/node material rows. New 22 rows retain source probability/quality weights; recovery-channel quantity is one unit in this approved initial candidate. Existing 22 rows are unchanged.
- Local 寒泉苔 recoveryBase substitutes at the same quality in the existing learned healing recipe, without automatic high-quality spending. Three existing potion types remain; this batch does not claim the full fifteen-potion catalog is implemented.
- New typed attacks preserve physical-vs-elemental power. DOT application requires its direct attack to hit. A05 lifesteal uses actual HP loss only, 12%, capped at 2% monster max HP per action and 15% over the encounter.
- A05 next-basic slow schedules one selected basic 165ms later, without delaying active skills or enemy turns. It is not a new main combat cadence. A basic-only event does not decrement turn statuses/CDs or grant an enemy action; timer clocks split 165+935ms. The following regular opportunity remains on the original grid. Offline safety allows at most one extra basic event per regular tick (26,200-event bound within the unchanged four-hour cap).
- Existing frontend 250ms polling can display the 165ms appointment late. Engine scheduled online/offline equality is not a claim of exact browser wall-clock cadence. Delayed delivery and pause/reload tests cover safe once-only execution.
- New regions connect through normal local map previews, independent progress, favorites/explored travel, monster codex and discovered material navigation. Preview remains read-only; actual travel uses clone/save/adopt and checks capacity/cooldown/state again.

## Visual limits
The thirteen original-renderer silhouettes and three backgrounds are recognizable content placeholders, not completion of the newly approved sprite art direction. Root reviewed species/count distinction only. Native production-render exports and mocked DOM tests are not browser whole-page QA. The isolated battle preview patch is retained separately; no default UI replacement.

## Parameter gate
Default production parameters now include A01–A06 using the root-approved final-provider.json. Actual 13-monster/44-point-build/dungeon/boss checks and final-provider four-hour equality passed; final independent release gate remains pending. Nine new ordinary monsters use the selected reduced attack/elemental-power values everywhere, including dungeon stages; existing thirteen monsters, elites and boss values remain unchanged. Controlled no-sustain four-hour samples consumed 65/65/73 potions with no defeats; these are not a whole-game economy guarantee. No placeholder fallback statistics are used when an area's parameter set is unavailable. No new storyline or quest triggers are added.
