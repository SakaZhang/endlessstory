# v0.91 — 赌场唯一入口与异界入口悬停稳定

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

## 异界入口悬停修复

- 地图传送门原先被全局按钮 hover transform 覆盖居中定位，鼠标静止在边缘也会反复进出命中区域。本次将 hover、active、focus-visible、disabled 状态固定为原有居中变换，不改异界数值或战斗逻辑。
- 新增 otherworld-portal-hover-v091-tests，并运行原有稳定 UI、App UI、显示和路由四项回归，全部通过。
- 真实浏览器使用生产传送门组件与完整生产 CSS：修前约10秒出现86次 enter/leave，横纵漂移35.8/38.4px；修后960与390宽地图容器各约40秒悬停均无位移、无 leave，点击各准确触发一次。390为窄容器，不是移动设备视口；未进行全游戏战斗浏览器测试。
