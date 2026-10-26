# v0.65 — 奇克选人卡与肖像朝向修正

Base: live v0.64, `2a77f9eceee8f77a0e39429d6c40513f7c230395`.

- 奇克在选择旅人、左侧角色头像、装备页人偶中统一朝右。读取原有素材朝向并仅在展示时水平镜像；不改原始 PNG。
- 保留已正确的战斗/营地朝向与全部22帧。敌人在左侧时，战斗角色仍按既有逻辑朝左，不强行锁死方向。
- 其他四位英雄的图像、身份、比例和朝向保持不变。怪物朝向、战斗、数值、奖励、存档均未修改。
- 页面版本为 v0.65，内容哈希构建负责缓存隔离。继续使用 schema6 / `ashencrown-v6`，不清档、不迁移。
- 此次仅修正朝向；不包含 NPC、回响戒事件、战争旅行锁、剧情内容或后续功能。

## Verification and limits

See `GOBLIN_HERO_FACING.md`: actual user screenshot inspected, all22 original frames inspected, 44 all-race native portrait cases with repeated-draw checks, 132 Goblin frame/direction draws, 1,132 monster orientation draws, actual App selection/save regressions and live battle A01–A10 checks pass. Native before/after proof was independently reviewed; it is not browser verification.

The full aggregate terminates at the pre-existing `equipment-armor-art-tests.mjs:8` mismatch (36 actual vs28 expected), also recorded in v0.64. Do not call the aggregate green. Browser launch remains unverified after the earlier socket `EPERM`; no workaround was attempted.

The integration owner handles official packaging and publication. This worktree does not deploy.
