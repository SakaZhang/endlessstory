# 全部属性面板

- 侧栏在折叠详情外保留「全部属性」按钮；复用原属性弹窗，不新增页面或存档字段。
- 常驻参考明确按当前装备、天赋、所选被动、满血、无盾、无药剂计算。并非拆分各装备贡献，也不声称条件被动恒定生效。
- 当前列沿用生产 `baseStats` → `skillTreeHeroStats` → `derivePassiveStats`（无战斗时 `stats`），取已保存战斗时钟、生命和盾层；不模拟战斗、不推进时间、不消耗 RNG。
- 展示全部独立数值字段：生命/攻防/穿甲、命中/暴击/暴伤/闪避的原始数值及换算、格挡、吸血、护盾加成、主动直疗、韧性、幸运、通用及六系增幅/抗性。`lifesteal` 为 `lifestealRating` 别名；`elementResist` 为旧火抗换算缓存，不作为六系通用减伤率展示；`legend` 是历史标志。`count`、`specials`、`bonus` 由套装、特殊效果和完整词条合计覆盖。
- 被动、套装、传说和特殊词条显示现有文案/条件，不伪造 DPS、全局伤害比例、固定掉落率或固定元素减伤率。
- 250ms 现有 HUD 更新期间刷新打开的面板；关闭后无渲染，其他弹窗会清除本面板状态。无保存/暂停/恢复调用。
- 新模块由 app.js 静态 import；新 CSS 由 index.html 引用，进入既有发布依赖图；未改版本、引擎公式、发布或提交。

验证：
- `node character-stats-tests.mjs`：五族、schema字段覆盖、药剂到期、纯读取/RNG、暂停战斗buff与HP。
- `node character-stats-app-ui-tests.cjs`：重复打开关闭、运行和暂停不改变、受伤生命保持、打开不触发保存。
- `health-ui-tests.cjs`、`stat-label-tests.mjs`、`skill-tree-attributes-tests.mjs`、`skill-tree-passives-tests.mjs`、`element-schema-tests.mjs`、`element-ui-tests.cjs`、`auto-idle-safety-tests.mjs` 通过。
- 真实浏览器桌面/390px/320px验收交由父任务的 Sites managed preview + 云浏览器 QA；本子任务不声称视觉验收已通过。
- `release-cache-tests.mjs` 第二次在源码冻结后完成（exit 0）；第一次并发修改中的快照差异已排除。本子任务不再运行全局发布测试。

## 归途之环经验加成补齐

- 经验获取单独一组，直接调用 `returnRingExperienceBonus(s)`，同一装备条件用于两列，不扩展基础 stats schema、不重算经验。
- 图鉴 effect 与 `RETURN_RING_DEFINITION.exclusiveDescription` 补充装备 +20%、卸下失效及双槽不叠加说明；旧环无需新增字段或迁移。
- `character-stats-experience-tests.mjs` 覆盖旧环装备/任一戒指槽/双槽去重/卸下、纯读取与文案；原面板测试、经验结算测试及归途回复/掉落回归通过。
