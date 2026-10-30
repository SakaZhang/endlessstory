# v0.81 local test redemption

Settings → 兑换码（测试） → `INFINITY5` (case-insensitive, surrounding whitespace ignored).
Each successful redemption permanently learns the Infinity Gauntlet recipe and grants one of each canonical `INFINITY_GAUNTLET_MATERIALS`, at recipe quality 3: 山心赤晶、王誓琥珀、长生翠核、诡影紫石、初醒金髓. Redemption is unlimited/repeatable; no used-code ledger, account authentication, or server is introduced. This is an explicit local test convenience, not a secure or paid-code mechanism.

The v0.81.1 hotfix adds the permanent recipe unlock to the same transaction as the five gems. When no Infinity Gauntlet state exists, it creates exactly `{version:1,recipeLearned:true,crafted:false,craftedItemId:null}`. Existing `crafted` and `craftedItemId` values are preserved, including after disposal; redemption never resets the once-per-save manufacture record. The recipe appears in the forge recipe book after success. It does not grant gold or manufacture equipment. Normal loot's held-gem gate remains unchanged; test materials can stack. Rest and active encounter state are not restarted or regenerated. Only normal transaction save metadata is updated.

`dist/redeem-codes.js`: immutable catalog; pure `quoteRedeemCode` and `checkRedeemCapacity`; preflight-all `redeemCode` reducer. The settings action uses the existing stale-storage guard and clone/save/adopt transaction. A failed write retains original memory and storage: neither gems nor the recipe unlock are adopted. Retry grants the full bundle and unlock together. Capacity and the 1e12 per-stack ceiling are checked for all five before writing any material or learning the recipe. The Infinity Gauntlet craft service is unchanged.

Verification:
- `node redeem-codes-tests.mjs`: canonical identity/quality, trimmed case, unknown codes/no RNG, permanent recipe/panel, existing learned/crafted ledger preservation, repeat, limits, rest, atomic recipe+gems storage rollback/reload.
- `node redeem-codes-app-ui-tests.cjs`: actual App settings/modal handlers, injection-safe errors, quota/retry without an in-memory recipe leak, visible recipe panel after success, repeat, crafted/disposed ledger preservation, rest and active battle state preservation, reload, close/reopen, stale storage.
- Current catalog has fewer than 1000 canonical stacks, so future mixed-capacity boundary is exercised through the same pure capacity checker using generic stacks, not fabricated valid saves.
