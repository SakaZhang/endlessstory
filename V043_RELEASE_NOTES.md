# v0.43 — A02 pixel battle extension (candidate)

Adds the actual A02 brown rock lizard, rift bat, iron-throat crab and brood rock lizard, with separate A02 cavern/platform layers. The elite's real follower units retain the elite monster ID in simulation; the renderer matches the explicit follower flag first and uses a juvenile lizard sprite. It does not alter encounter definitions, budgets, IDs, target selection, drops or RNG.

A01 sprite files and source definitions are retained. A01 and A02 scenes select only their declared background layers. The standalone preview remains an A01 fixture and must not acquire A02 backgrounds accidentally. A03 and later areas (36 remaining monster definitions) keep the explicit whole-scene legacy fallback. A03 artwork in preparation is not included.

Actual A02 elite casting uses the approved production provider (1100 ms in the native fixture); tests advance the real encounter to its actual preparation state, never inject a cast duration. Existing status, head-following short health bars, capped same-track shield overlay, critical font sizing, per-event damage and potion transactions remain the established behavior. All six equipment skill slots, source state and storage behavior remain unchanged.

Native canvas and actual App DOM/canvas tests are not full-page browser QA. Publication awaits final independent gate and root authorization.
