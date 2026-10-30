# v081: 默认生命药剂配方

- Canonical recipe ID: `potion-healing`; output type `healing`. “Recovery” names the existing crafting API, not another persisted recipe ID.
- All five fresh races know this recipe. No gold, XP, ingredients, potions, or equipment are granted.
- Valid current-generation saves receive the missing recipe during the same cloned, validated, persist-before-adopt restore transaction as the otherworld-stone entitlement. Storage failure retains the original state and blocks gameplay; startup skips recipe normalization when restore is blocked.
- Existing ownership receives no refund and is idempotent. Unknown/duplicate recipe IDs remain invalid.
- New merchant stock excludes the healing recipe. Stored healing offers retain their slot, ID and price with stock zero; all eight slots and other stored goods remain. Even a forged/stale purchase attempt cannot charge for this recipe.
- Other recipes retain their learning/purchase gates and crafting rules. Historical fruit retirement remains unchanged.

## Verification

Passed:
- `default-healing-recipe-v081-tests.mjs`: five races; old-save quota/retry/reload; economy unchanged; stored-slot retirement; forged/stale-price rejection; actual first-region material crafting; 1,000 refreshes with eight slots and no healing book/fruit; combined healing/stone one-write rollback.
- `recipe-tests.mjs`, `recovery-tests.mjs`, `inventory-bags-tests.mjs`, `recovery-recipe-ui-tests.cjs`
- `recipe-batch-limits-tests.mjs`, `material-recipe-expansion-tests.mjs`, `luck-potion-early-material-tests.mjs`
- `merchant-tests.mjs`, `transaction-tests.mjs`, `development-save-reset-tests.mjs`, `otherworld-progression-tests.mjs`

Specific legacy tests for purchasable healing switched to purchasable strength to retain purchase atomicity coverage. Healing UI now verifies free initial knowledge instead of searching for a retired book.

Aggregate `tests.mjs` reached an unrelated stale expectation in `reforge-v13-tests.mjs:42` requiring merchant fruit; `current-save-generation-tests.mjs:14` expects reforge version 8 while runtime is 9. These were reported to integration owner, not disabled here.

No browser/server, commit, publishing, or frozen-v080 changes.
