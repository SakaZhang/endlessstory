# 当前所在地自动首领挑战

- 沿用 `expedition.autoBoss`；旧档缺失字段默认关闭，已有 true 原样保留。开关在区域页高级设置常驻，不依赖打开地点预览；文案指向实际所在地，无首领地区明确待命，不自动旅行或爬层。
- 普通战斗结算、完整三场副本结算后才选择首领。原 `expedition` 的模式、目标与循环不被自动首领覆盖；首领冷却时恢复原普通副本/野外路线。
- 路由仍经过原有解锁、内容预算、战争、休息与奖励冷却校验。浏览其他区域不改变执行地区。v0.77 待执行旅行/任务/装备先于下一遭遇执行，手动停止和停止后不续战仍优先。
- 自动首领遭遇有可保存的 `automaticBoss: true`，重载使用同一遭遇/随机状态/奖励收据；战斗中关闭开关只关闭未来自动挑战，不取消本场后原路线续战。
- 失败不设置成功奖励冷却。独立可选 `autoBossRetryAt[nodeId]` 保存30分钟自动重试等待（从失败起算），正常5分钟休息后恢复原目标，不连续撞首领；不限制玩家手动挑战。开启自动挑战时，手动挑战失败也会推迟下一次自动尝试，避免自动挂机立即重复同一败局；手动再次挑战仍可用。设置面板显示等待时间，失败提示解释等待和是否续战。

验证：`node auto-current-boss-tests.mjs`，`node expedition-automation-tests.mjs`，`node expedition-controls-app-ui-tests.cjs`，v0.77 四项 auto-idle 测试，`node adjacent-region-tests.mjs`，`node war-travel-lock-tests.mjs`，`node selected-area-travel-tests.mjs`。新专项已纳入 tests.mjs。
