# Combat display bridge coverage (v0.38)

Display observers are external WeakMap bindings. They do not write encounters or saves, consume RNG, advance clocks, or drive combat. `captureCombatDisplay(encounter, () => step(...))` collects actual mutation-site events. Offline execution does not attach observers. Observer exceptions are isolated.

Covered real multi-combat paths: player basic/active hit and miss, individual tree hit segments, additional multicast casts, enemy action cast/hit association using stable enemy IDs, physical/fire damage, actual HP/shield deltas, burn and typed DOT, percentage poison, counters, lifesteal, direct healing/HOT, shields, nirvana, legendary hammer/reactor, and separate reaper execute events. Potion healing is emitted once by engine.js rather than duplicated in the multi adapter.

Focused deterministic tests compare observer-enabled and disabled complete game state (including RNG state/draw count): 15 fire-skill turns; axe multicast four segments; two enemy attacks; exact poison tick; HOT; enemy counter; reactor pulse over every living target; full-shield direct hits followed by a separate execute. Host callback tests also cover capped HOT recovery and harmless observer exceptions. All emitted fixture events pass the repository queue validator.

Limits: historical non-multi `combatStep` damage is not instrumented by this bridge. The standalone battle slice exercises current multi encounters, not every historical save path. Status application/expiry and enemy preparation are read from authoritative state for HUDs rather than represented as damage events. This event stream is ephemeral presentation, not an authoritative replay or reward ledger. No gameplay skill targeting, damage formula, cooldown, reward, RNG, or scheduling is changed.
