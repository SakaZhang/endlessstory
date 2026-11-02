# v0.91 — 赌场唯一入口

- 删除世界地图标题栏残留的赌场快捷按钮，仅保留主导航「赌场」入口。
- v0.90 的行商页面已经不包含赌场入口；本次不修改行商商品、购买或刷新逻辑。
- 保留 v0.90 的套装、神赐、天神之石与异界精英数值；赌场规则、队列、保护和原子保存逻辑未改动。
- 页面位置未持久化到存档，无需存档迁移。

## 验证

- `npm run test:v091`：赌场 App UI、五族导航/切页/刷新唯一入口、独立场景和赌场规则通过。
- `npm run test:v090`：6项 v0.90 回归通过。
- 独立复核运行 merchant-tests、merchant-ui-tests、merchant-quality-pricing-ui-tests、casino-app-ui-tests、casino-tests、v082-casino-independent-tests：通过。
- `python deploy/container/package_test.py`：7项通过。
- `npm run build`、`npm run test:release`：3059文件哈希、3057资源URL和8877依赖边通过；并非全量 npm 测试。
- 真实浏览器：行商内容、独立赌场大厅、返回世界和刷新均正常；唯一赌场按钮；未下注、购买或推进战斗，金币保持142。行商正常自动刷新库存。

本次更新私有 Site；容器版本元数据准备为0.91，但未登录或推送 DockerHub，也未更新用户服务器。
