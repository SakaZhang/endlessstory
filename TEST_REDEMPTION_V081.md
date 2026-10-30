# v0.81 local test redemption

Settings → 兑换码（测试） → `INFINITY5` (case-insensitive, surrounding whitespace ignored).
Each successful redemption grants one of each canonical `INFINITY_GAUNTLET_MATERIALS`, at recipe quality 3: 山心赤晶、王誓琥珀、长生翠核、诡影紫石、初醒金髓. Redemption is unlimited/repeatable; no used-code ledger, account authentication, or server is introduced. This is an explicit local test convenience, not a secure or paid-code mechanism.

It does not grant gold, unlock the recipe, manufacture equipment, or change the existing once-per-save manufactured flag. Normal loot's held-gem gate remains unchanged; test materials can stack. Rest and active encounter state are not restarted or regenerated. Only normal transaction save metadata is updated.

`dist/redeem-codes.js`: immutable catalog; pure `quoteRedeemCode` and `checkRedeemCapacity`; preflight-all `redeemCode` reducer. The settings action uses the existing stale-storage guard and clone/save/adopt transaction. A failed write retains original memory and storage; retry grants the full bundle. Capacity and the 1e12 per-stack ceiling are checked for all five before writing any material.

Verification:
- `node redeem-codes-tests.mjs`: canonical identity/quality, trimmed case, unknown codes/no RNG, repeat, limits, rest, storage rollback/reload.
- `node redeem-codes-app-ui-tests.cjs`: actual App settings/modal handlers, injection-safe errors, quota/retry, repeat, rest state preservation, reload, close/reopen, stale storage.
- Current catalog has fewer than 1000 canonical stacks, so future mixed-capacity boundary is exercised through the same pure capacity checker using generic stacks, not fabricated valid saves.
