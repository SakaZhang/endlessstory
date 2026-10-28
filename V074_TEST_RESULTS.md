# v0.74 验证结果

## 专项：全部通过（退出 0）
- `node branding-v074-tests.mjs`
- `node ui-tests.cjs`
- `node routing-ui-tests.cjs`
- `node current-save-generation-tests.mjs`
- `node save-generation-app-ui-tests.cjs`
- `node pixel-shell-tests.mjs`
- `node gear-layout-ui-tests.cjs`

覆盖实际 App 的 mock 流程、运行/停止与路由边界、schema6 当前存档导入和原子性、存储失败/重试、响应式结构与装备槽位。不是原生浏览器视觉验收。

## 构建
`npm run build` 通过；预构建 Infinity gem 与剧情肖像校验通过。2790 个发布文件。

Release hash: `b0539f6666891ecf2a3dfd89669307eb8d78c97f726794001b0213ecb7b986c0`

## 发布缓存：通过（退出 0）
`npm run test:release`：2790 文件哈希、2788 资源 URL、8651 依赖边；8 项字节变异和 9 项断引用负向检查通过，页面导航、origin 与存档 key 保持不变。可选 Sites prepare helper 检查未运行（此环境没有该 helper），不声称已完成打包部署。

## 更名范围：通过
一次性对比基线确认只有 3 个 dist 文件变化，app 仅导出文件名前缀不同；其余运行时 JS、数据、样式、美术逐字节不变。持续回归不冻结整个 app，版本页脚允许后续版本号。

## 最终完整聚合：通过（退出 0）
`npm test` 最终完整运行通过，包含最后的 v0.74 品牌专项子进程。不是仅专项通过；未另行宣称全仓独立测试清单全部运行。

本地完整日志位于 `qa/v074/`（该目录按仓库规则忽略）。

## 桌面浏览器预览（父任务验收）
实际预览确认 document title、页眉、页脚均为“长路未尽”，无副标题，桌面布局正常。环境重置后出现旧开发存档提示，未建立浏览器当前存档连续性；没有导入或注入存档，生产环境未动。存档兼容性证据来自上述当前 schema 自动测试及本次 app 差异审计。

首次完整聚合在旧 CSS 展示测试的“黑炉余烬”页脚断言处失败；仅将该测试期望名称改为“长路未尽”，保持版本号匹配灵活，重新运行完整聚合并最终通过（退出 0）。
