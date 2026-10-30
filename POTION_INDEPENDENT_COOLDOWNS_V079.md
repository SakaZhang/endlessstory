# v0.79 药剂冷却分离

- 生命药剂保留独立 10 秒冷却（`potionReadyAt`）；幸运、力量、元素等功能药剂不再占用生命药剂冷却，反之亦然。
- 功能药剂在未结束的战斗中共享 10 秒冷却，包括暂停战斗；非战斗状态按药剂类型冷却，可立即连续使用不同功能药剂。同类不同品质仍共享该类型的 10 秒冷却。
- 新 `potionFunctionCooldowns` 保存各功能类型截止时间；战斗内取所有类型的最大值。旧存档缺少该字段时，以旧共享截止时间保守初始化所有类型，不清除现有等待、不重置存档。已有字段严格验证。
- 同品质仅延长时间，高品质替换强度和时间，低品质不消耗；增益强度、持续时长、自动生命药剂阈值/品质策略均不变。
- 背包每张药剂卡根据对应类型显示冷却；生命药剂战斗按钮只显示生命冷却。保持原有 `potionAction` / `commitGameTransaction` 保存事务。

## 验证

新增 `node potion-independent-cooldown-tests.mjs`：生命/功能互不阻挡、非战斗多种准备、同类冷却/强度/品质、活动与暂停战斗、显式战斗对象、旧存档迁移、无效字段、UI 每卡/选中计时、保存失败回滚，以及幸运冷却期间线上/离线自动治疗一致。

相关回归通过：`potion-tests.mjs`、`potion-expansion-tests.mjs`、`battle-potion-owned-tests.mjs`、`potion-ui-tests.cjs`、`potion-expansion-ui-tests.cjs`、`potion-expiry-parity-tests.mjs`、`combat-display-potion-tests.mjs`、`transaction-tests.mjs`、`luck-potion-early-material-tests.mjs`、`recovery-tests.mjs`、`recovery-recipe-ui-tests.cjs`、`consumable-pixel-app-ui-tests.cjs`、`potion-catalog-tests.mjs`、`potion-forge-tests.mjs`、`hp-rest-tests.mjs`。

UI 验证为 DOM/mock 集成测试，未运行真实浏览器。未发布或提交。
