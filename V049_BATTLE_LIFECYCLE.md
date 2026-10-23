# v0.49: one visual lifecycle, without a new save generation

User evidence: a real fresh Lv1 stopped expedition showed the old geometric cave, old hero/unknown enemy and long bottom bars. Active-only testing had missed this. Fixed routes:
1. App animation no longer calls the old drawScene after any false live draw result.
2. Fresh/no-encounter produces a detached hero-only presentation snapshot, not a generated game battle or dummy enemy.
3. Loading, missing coverage and failed assets draw an honest pixel-frame notice, never the old actor or scene. Retry is inside the running app scope and does not save, advance or reset game state.
4. Asset failures use allSettled and coverage checks only the current area/actors. Current usable images can display independently of unrelated failures.
5. Old portrait and equipment doll geometric drawing is removed; both use current weapon sprite, or the explicitly neutral idle for no/unsupported weapon.
6. Old bottom hpCards and old HP-bar writers are removed. Current head bars retain actual HP/shield. Shield-source details, hero statuses, potions, target choice and actual enemy resistance details remain.
7. Old canvas hit-map fallback is removed: only actual pixel positions can select targets; explicit roster details remain available if assets fail.
8. Stopped, paused, dead/resting and post-offline states use the same renderer. Done/idle HP comes from current state rather than stale concluded encounter. Hidden/disposed cannot invoke the old art.

No engine, battle schedules, damage, source rules, schema3, storage keys or save resets changed. Hero neutral is an original generated single idle, not a claim to have weapon-specific unsupported animations. Normal ready state no longer shows developer coverage banners.

Evidence is actual App DOM/mock lifecycle tests and native production-renderer images in qa/live-lifecycle-v049. Root reviewed the exact fresh/stopped image and portrait. These are not whole-page browser screenshots. Full UI art unification remains a separate following stage; forge/merchant art does not ship in this P0.
