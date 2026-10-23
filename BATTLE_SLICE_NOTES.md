# Isolated pixel battle slice — review candidate

Entry: `dist/battle-preview.html` (optional `?scenario=poison`). The normal `index.html`, App entry, game version and user storage are unchanged. Do not publish without root review.

The preview creates a separate seeded fixture using the real production engine: level20 fire scenario with an actual axe, four active and two passive slots, an explicitly injured start and a real three-enemy encounter. The poison variant uses level30. These are demonstration fixtures, not normal new-player balance or advertised drop probabilities. No localStorage is read or written. Restart discards only the isolated model.

## Shared implementation
- `combat-display-bridge.js` observes actual mutation-site receipts in an external WeakMap. The queue is ephemeral, never stored or reconstructed from logs/lastCast. Multiple casts and hit segments survive separately. Disabled/throwing observers cannot change gameplay or RNG.
- Real HP/shield damage, miss, critical, burn, poison, legendary pulse, counters, HOT, lifesteal and potion healing drive presentation. Reaper execution is a separate event. Historical non-multi resolver damage remains outside this prototype; current normal encounters are multi.
- `createBattleSlicePresentation` schedules only visual delays; it does not schedule combat. Physical actors approach the actual target, strike and return. Elemental shots travel to target anchors. Damage uses negative numbers, heals green plus signs, shields blue labels and crit larger type retaining elemental color.
- `drawBattleSliceCanvas` is shared by browser and native QA export. Sprite frames and two separate background layers come from `battle-assets/manifest.json`, not a screenshot pasted as an entire UI. Current lizard/golem sprites are explicitly labeled prototype stand-ins rather than a complete monster-art library.
- The compact DOM HUD has four active/two passive icons, real tree cooldowns, target/HP/status/cast/shield readouts and read-only skill details. Canvas recording includes scene and floating numbers, not surrounding DOM HUD.

## Evidence / limits
`battle-slice-render.mjs` exports actual fixture steps through the same presentation/draw functions; every frame asserts drawing did not mutate gameplay. Native sequence output is **not browser footage or full HTML layout validation**.

Browser recheck found supported cloud Chromium, but localhost/terminal preview was unreachable. Authorized outside-sandbox server launch failed in environment setup; file URL preview was policy-blocked and not bypassed. Sites currently has no non-production preview URL. A future approved private version may expose only this isolated route for actual browser review; no new public site or access changes are authorized.

The broader visual redesign, default-screen replacement and all game numerical changes are outside this slice.
