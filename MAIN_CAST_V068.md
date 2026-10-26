# 主线人物画像与显示姓名（v0.68 集成候选）

## 本次完成

基于线上 `706c2687a448635d75088977abf61c3000eeccfe`，不改原103个分视角剧情定义（SHA256 `9d236c8bfa71c213248c696caec315de2b5a500dc44f9b9a4bd8a8a5426d7dc7`）、选择、旗标、知情账本、奖励、战斗、存档代次或游戏版本。

- 6个独立 imagegen 像素半身像：维尔铎（矮人重臣）、索兰姆（现任矮人王）、玄珀（烬裔族长）、鲁托（车夫）、杜铎（矿班长）、伊瑟（精灵救护者）。这些是本次创作姓名/形象，不冒充台本原有姓名。
- 原图、192px源衍生、96px运行图及完整提示词/哈希：`main-cast-source-manifest.json`、`source-art/main-cast/{original,192}/`、`dist/story-portraits/`。
- 5位兼容既有人物仅按明确场次复用：赛林→守林者，陶褶→烬裔修护者，贝菈→边境斥候，科霖→C06.D01王室守军，璞承→烬裔哨卫。**不是**把所有斥候/军人/信使都合并。
- 大祭司沿用既有独立战斗资源，不另起名字、不重画。其余四英雄沿用当前live idle资源URL；布洛克对白使用用户批准牛角母版的专用96px半身像，选人/HUD/装备仍保留25帧全身资源。五位英雄的职业文字直接复用现有种族注册表（奇克=盗贼，砾恩=矿石行者），不新增泛化职业。
- 对白逐句解析只接受真实注册`id/sourceScene/pov`及真实原台词，493句匹配15个发言者身份。舞台说明和其余匿名工作角色不借错头像。书面布洛克口信不装作本人现场发言；封印外砾恩声音明确标注来源。

## 严格边界

- **现任矮人王仅待审设定稿。**没有任何可玩出场/对白，`designOnly`阻止画像renderer展示；不作为C08古代创造者矮人王，不赋予不朽身份。
- **重臣不是现场说话者或boss。**只有矮人档确实完成C06.D03、写入`D_COUP_LINK_PARTIAL`、持有该场知情记录三项同时满足，纪事才显示“已知线索中的人物”。卡片明确说明证词指向其一方、完整资金链仍待查清；不提前剧透C10闭环。
- 新矿物族长是玄武岩/石英矿物生命及自己的琥珀核心，不是烧伤人类；不更改砾恩核心归属。
- C09–C10/END仅属于全台本审计，未宣称已接入。全审计见`MAIN_CAST_AUDIT_V068.md`。
- 家人画像/事件由独立任务实现；本表不映射三个兄妹，不建立新家庭支线。

## 集成接口

- `storyCastSpeaker(scene, originalLine)`：返回精确本句身份或null。
- `storyCastDisplayLabel(scene, scene.npc)`：场景抬头的精确已授权姓名；不全局替换台词/笔记。
- `renderStoryDialogue(scene, originalLine, optionalDisplayLine)`：保留原line做识别，第三参数允许家人renderer的显示姓名；未知者只输出文字，不冒用头像。
- `renderKnownStoryEvidence(game)`：受真实知情门槛限制的重臣卡。
- 复用`npcPortrait`图片错误委托：两次有限自动重试、手动/键盘重试阻止误触对话，不写存档。

与家人commit `576f573`合并时保留其`renderChikFamilyCast`和姓名映射。对白调用组合为：

```js
renderStoryDialogue(a, a.line,
  chikFamilySpeaker(a, a.line) ? chikFamilyDisplayText(a, a.line) : undefined)
```

抬头可以组合`storyCastDisplayLabel(a, chikFamilyDisplayText(a, a.npc))`。家人卡已经给兄妹肖像，本模块不会再生成第二个兄妹头像。

## 英雄上身裁切

不能固定裁192画布上半部：旧人/矮/精灵的身体均在画布下方。现在通过实际idle的body/alpha/solid bounds算正方形上身窗口，以百分比CSS适配96/64px，保留右朝向。大祭司单独校准上身窗口。没有编辑现有角色PNG。

矮人的基础atlas只有JSON元数据，提供窄元数据桥：

```sh
node tools/sync-story-portrait-crops.mjs
node tools/sync-story-portrait-crops.mjs --check
```

**合并牛角布洛克后必须运行sync。**新布洛克worker在`manifest.sprites.dwarf.portraitCrop`提供 `[68,110,126,158]`（右/下exclusive），桥会读取它；没有该字段的旧基线才按solidBBox推导。测试将拒绝与实际manifest不一致的旧桥。原图URL自动跟随新idle。

## 验证

- `node main-cast-tests.mjs`：103场原定义SHA、6图全来源SHA/尺寸、493逐句映射、匿名负例、古代/现任王分离、重臣知情门槛、图片重试与无RNG/账本变化。
- `node main-cast-app-ui-tests.cjs`：实际`app.js`/委托点击/存储，遍历103场、751个对白状态（包含精灵完整/简略修泉两分支）、15发言者；保存失败/旧cursor重复/纪事往返不丢状态。
- `node main-cast-native-proof.mjs`：实际资源96像素展示与裁切联系图；`qa/main-cast/native-portraits.png`。这是原生像素验证，**不是浏览器截图**。
- 既有`story-event-app-ui-tests.cjs`、`story-c08-app-ui-tests.cjs`、`npc-portrait-tests.mjs`通过。
- 构建/缓存图纳入新主线registry动态资源边，国王96px设计图仅保留于source-art，运行registry无图片URL，发布目录和运行依赖均不包含此未出场草稿；新增破损主线图URL负例。
- Chromium启动在本沙箱不可用；没有声称浏览器布局QA。没有发布或改线上状态。

中文审阅图：`/workspace/shared/maincast-v068/six-maincast-chinese-contact.png`。Library：`libfile_89087ca03d1881918b3bb23b7d24cf8f`（主线人物形象补充.png，v0）。
