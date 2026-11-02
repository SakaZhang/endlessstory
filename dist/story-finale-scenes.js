// Canon: content/story-finale-approved-source.md; existing map hosts are not new geography.
export const FINALE_SCENES={
 "C09.A01.human": {
  "id": "C09.A01.human",
  "sourceScene": "C09.A01",
  "chapter": 9,
  "pov": "human",
  "siteId": "ashen.a04",
  "title": "变了的旧座",
  "npc": "莱姆斯与砾恩",
  "lines": [
   "[旧座上曾经灰暗的刻纹正在发光。外廊朝向与主祭坛记下的光路相合。砾恩把记录放到同一处折角旁。]",
   "砾恩：那时没亮。现在连这里也在动。",
   "莱姆斯：和主祭坛外延的纹路一致。",
   "砾恩：我的核心在这里升级过。却没看见下面这一层。",
   "[旧座下的威胁被清开后，你们沿着露出的石阶下探。四壁的光纹越过脚边，汇入通向远方的结构；每一次明灭，都与外面的门户遥相呼应。]",
   "砾恩：它在支撑外面的门。",
   "莱姆斯：先记清连接。动错地方，可能把自己困在这里。"
  ],
  "objective": "随砾恩返查古神庙；清除威胁，比对激活刻纹、连接与撤路。",
  "flags": [
   "R4_TEMPLE_CONFIRMED"
  ],
  "knowledge": [
   {
    "id": "C09.A01.human.k0",
    "text": "亲自随砾恩返查：旧座下的连接支撑中央门户，古神庙是第四处支撑祭坛，不是另一座中央祭坛。",
    "mode": "confirmed"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "确认现场结果，继续",
    "flags": []
   }
  ],
  "requires": [
   "C08.X05.human"
  ],
  "optional": false,
  "encounter": {
   "kind": "scenario",
   "scenarioId": "story.c09-a01-human",
   "nodeId": "ashen.a04.field",
   "count": 1
  }
 },
 "C09.X01.human": {
  "id": "C09.X01.human",
  "sourceScene": "C09.X01",
  "chapter": 9,
  "pov": "human",
  "siteId": "ashen.a04",
  "title": "留下的旧记录",
  "npc": "莱姆斯与砾恩",
  "lines": [
   "[剥落的石皮堆在脚边，旧字从灰下露出来。莱姆斯先抄下能辨认的几行，又把残缺处留空；砾恩站在旁边，一直没有催促。]",
   "[莱姆斯沿字迹慢慢读下去。听到熟悉的名字，砾恩抬起头，看向他刚抄好的那一行。]",
   "莱姆斯：这几行用的还是祭司旧制记法。我能辨出参与者。",
   "砾恩：人族国王。矮人王。还有他。",
   "莱姆斯：和他刚才说的一样。",
   "砾恩：我们从来不知道。",
   "莱姆斯：我也不知道他做过这些。",
   "砾恩：记下来。别再只留在他一个人嘴里。"
  ],
  "objective": "核对古代铭记与大祭司的供述，查明烬裔来历。",
  "flags": [
   "ASHEN_ORIGIN_CORROBORATED"
  ],
  "knowledge": [
   {
    "id": "C09.X01.human.k0",
    "text": "旧记录与主祭坛当场承认相互印证：古代人族国王、矮人王及这位大祭司共同创造烬裔以抵抗外界入侵。",
    "mode": "confirmed"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "确认现场结果，继续",
    "flags": []
   }
  ],
  "requires": [
   "C09.A01.human"
  ],
  "optional": false
 },
 "C09.X02.human": {
  "id": "C09.X02.human",
  "sourceScene": "C09.X02",
  "chapter": 9,
  "pov": "human",
  "siteId": "ashen.a06",
  "title": "各处传来的消息",
  "npc": "莱姆斯与砾恩",
  "lines": [
   "[送来的记录沾着不同地方的尘土。有的折在布里，有的只写在窄木片上；你们把它们按位置铺开，几条原本分散的光路渐渐接到了一起。]",
   "守林者口信：旧水道下面亮了。泉水还在，可那块石台一直震。我们已把人撤到外面。",
   "矿班长口信：矿道里那座旧台亮了。新露出的通道还能走，人已经退出来。",
   "递送者：这是矿班长封口前记的位置。布洛克叫我们留了撤退路。",
   "边境斥候口信：粮路旁的旧石室有光往外冒。我们只守外口，没有进去。",
   "罗什福尔：那是追奇克时掉下去的地方。",
   "[众人把送来的路线一一铺开，在图上接起断开的标记，圈出还能撤退的岔口。]",
   "砾恩：这边是第四处。它们都在给同一个地方送力。",
   "莱姆斯：中央那座还在开门。四处支撑要一起处理。"
  ],
  "objective": "比对各地送来的记录，确认四座支撑的位置和撤路。",
  "flags": [
   "FOUR_SUPPORTS_IDENTIFIED"
  ],
  "knowledge": [
   {
    "id": "C09.X02.human.k0",
    "text": "守林者、矿班长、边境斥候与砾恩的现场记录共同确认四座既存支撑：粮路石室、枯泉遗址、矿道遗址、古神庙；中央主祭坛另计。",
    "mode": "confirmed"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "确认现场结果，继续",
    "flags": []
   }
  ],
  "requires": [
   "C09.X01.human"
  ],
  "optional": false
 },
 "C09.X03.human": {
  "id": "C09.X03.human",
  "sourceScene": "C09.X03",
  "chapter": 9,
  "pov": "human",
  "siteId": "human.a03",
  "title": "把人联起来",
  "npc": "莱姆斯与砾恩",
  "lines": [
   "莱姆斯：布洛克认得罗什福尔。我留过联络的地方。",
   "砾恩：要等他们的军队？",
   "莱姆斯：先找他们本人。我们需要能到那四处的人。",
   "[布洛克回信确认收到，再联罗什福尔；罗什福尔通过已有联络找到奇克。]"
  ],
  "objective": "保护传信路线，送达位置与会合点并确认回信。",
  "flags": [
   "FIVE_HERO_CONTACTS_REACHED",
   "C09_COMPLETE"
  ],
  "knowledge": [
   {
    "id": "C09.X03.human.k0",
    "text": "传信路线已经打通。五人的回信陆续送到，会合地点、支撑位置与撤离方向都已核对。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "确认现场结果，继续",
    "flags": []
   }
  ],
  "requires": [
   "C09.X02.human"
  ],
  "optional": false,
  "encounter": {
   "kind": "scenario",
   "scenarioId": "story.c09-x03-human",
   "nodeId": "human.a03.field",
   "count": 1
  }
 },
 "C10.H01.human": {
  "id": "C10.H01.human",
  "sourceScene": "C10.H01",
  "chapter": 10,
  "pov": "human",
  "siteId": "human.a02",
  "title": "城门外的车",
  "npc": "守门兵与车夫",
  "lines": [
   "守门兵：车堵住了门。再放，就关不上了。",
   "罗什福尔：先卸挡路的货，让车往侧面靠。人不能留在门缝里。",
   "车夫：这些是好不容易找回来的！",
   "罗什福尔：我知道。搬到墙根，记上位置。我来守这段。",
   "罗什福尔：城门有人接替，我去会合。外面还有门没关。"
  ],
  "objective": "清出入城通路，护住避难者与已追回货物。",
  "flags": [
   "H_INVASION_RESISTED"
  ],
  "knowledge": [
   {
    "id": "C10.H01.human.k0",
    "text": "避难者已穿过清出的通路，追回的货物也移到了城门内。",
    "mode": "confirmed"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "确认现场结果，继续",
    "flags": []
   }
  ],
  "requires": [
   "C09.X03.human"
  ],
  "optional": false,
  "encounter": {
   "kind": "scenario",
   "scenarioId": "story.c10-h01-human",
   "nodeId": "human.a02.field",
   "count": 1
  }
 },
 "C10.X01.human": {
  "id": "C10.X01.human",
  "sourceScene": "C10.X01",
  "chapter": 10,
  "pov": "human",
  "siteId": "human.a03",
  "title": "五张图放在一起",
  "npc": "五位主角",
  "lines": [
   "[地图铺好后，五人一时都没有说话。每个人带来的路都通向一个刚刚安置下来的地方；现在，他们要决定怎样让那些地方不再换一次逃路。]",
   "[布洛克先压住矿道图。罗什福尔把商路与城外路线放旁边。莱姆斯摊开水道记录。砾恩放下古神庙拓记。奇克没有坐，站在最近的出口边。]",
   "布洛克：这张是新露的路。别用旧矿图。",
   "罗什福尔：边境石室有两处出入口。我们清过外面。",
   "奇克：第二个口子不是给你这身铁走的。",
   "罗什福尔：所以你来讲。",
   "莱姆斯：泉下面这处已经亮了。中央停了施法，也没有停。",
   "砾恩：四处都连着它。神庙也是。",
   "布洛克：拆支撑，门才能关。",
   "莱姆斯：还得有人留在中央。那里的首领会挡住我们。",
   "奇克：四个地方，一个中间。正好没人闲着。",
   "砾恩：不是。是族长自己的核心。",
   "莱姆斯：王室那枚已经和砾恩结合。他没有追回，就另取了一枚。",
   "[布洛克报告已合拢的出库、运费与夺权军资证据。]",
   "布洛克：有人卖王室的东西，拿钱去炸自己人的矿。账还没完。",
   "罗什福尔：先关门。证人和账，我安排人继续护着。",
   "[莱姆斯把拓记推到众人面前，指向其中一行，说起祭坛前听到的话。]",
   "莱姆斯：古代和两族国王一起创造烬裔的人，就是这位大祭司。记录能对应。",
   "砾恩：这件事，活下来以后，我们自己也要查。",
   "奇克：查可以。先别让明天没人吃饭。",
   "[其他四人当面报告各自抵抗与撤离结果。奇克确认三个家人已到安全营地；布洛克与记录者署名的证据摘要留供查阅。]",
   "[各自报告：城门避难通路已清，矿工证人与账证已保全，泉边村民已撤离，奇克家人已到营地，烬裔伤者已通过内线。你把自己的经历接上，其余四人也逐一说明了各自留下的人手。]"
  ],
  "objective": "会合并交换各地撤离消息，核实支撑祭坛与核心的线索。",
  "flags": [
   "FIVE_HEROES_BRIEFED"
  ],
  "knowledge": [
   {
    "id": "C10.X01.human.k0",
    "text": "布洛克与记录者的账证、证词证实重臣盗卖王室遗物资助夺权。五人核实四座支撑、两枚不同核心与古代记录；并未因此使各族和解。",
    "mode": "confirmed"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "确认现场结果，继续",
    "flags": []
   }
  ],
  "requires": [
   "C10.H01.human"
  ],
  "optional": false
 },
 "C10.X03.human": {
  "id": "C10.X03.human",
  "sourceScene": "C10.X03",
  "chapter": 10,
  "pov": "human",
  "siteId": "human.a03",
  "title": "去中央的人",
  "npc": "五位主角",
  "lines": [
   "罗什福尔：我守中央。你们抵达后按约定动手，不必等我再下令。",
   "[第1支撑 · 粮路石室：奇克；地图、带路人与撤路已确认。]",
   "[第2支撑 · 枯泉遗址：莱姆斯；地图、带路人与撤路已确认。]",
   "[第3支撑 · 矿道遗址：布洛克；地图、带路人与撤路已确认。]",
   "[第4支撑 · 古神庙：砾恩；地图、带路人与撤路已确认。]",
   "[四位同伴各自收起地图，约好抵达入口后再相互报信。你要独自守住中央；动身之前，仍可返回补齐行装。]"
  ],
  "objective": "确认各自的路线与分工；出发前可返回整备。",
  "flags": [
   "FINAL_ROLES_ASSIGNED"
  ],
  "knowledge": [
   {
    "id": "C10.X03.human.k0",
    "text": "中央由罗什福尔独自承担；第1支撑 · 粮路石室：奇克；地图、带路人与撤路已确认。；第2支撑 · 枯泉遗址：莱姆斯；地图、带路人与撤路已确认。；第3支撑 · 矿道遗址：布洛克；地图、带路人与撤路已确认。；第4支撑 · 古神庙：砾恩；地图、带路人与撤路已确认。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "确认现场结果，继续",
    "flags": []
   }
  ],
  "requires": [
   "C10.X01.human"
  ],
  "optional": false
 },
 "C10.X04.human": {
  "id": "C10.X04.human",
  "sourceScene": "C10.X04",
  "chapter": 10,
  "pov": "human",
  "siteId": "ashen.a07",
  "title": "四条路的开头",
  "npc": "五位主角",
  "lines": [
   "奇克：我认路。不代表我喜欢这条路。",
   "莱姆斯：把入口留空。有人退出来，别堵住。",
   "布洛克：下去以后少碰。标出来的地方才动手。",
   "砾恩：我会回到约定的地方。"
  ],
  "objective": "清出最后通道，保护递送撤路标记的人员。",
  "flags": [
   "FINAL_APPROACH_CLEARED",
   "SUPPORT_TEAMS_READY"
  ],
  "knowledge": [
   {
    "id": "C10.X04.human.k0",
    "text": "中央通路已清，其他四人确认到达各自支撑入口。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "确认现场结果，继续",
    "flags": []
   }
  ],
  "requires": [
   "C10.X03.human"
  ],
  "optional": false,
  "encounter": {
   "kind": "scenario",
   "scenarioId": "story.c10-x04-human",
   "nodeId": "ashen.a07.field",
   "count": 1
  }
 },
 "C10.X05.human": {
  "id": "C10.X05.human",
  "sourceScene": "C10.X05",
  "chapter": 10,
  "pov": "human",
  "siteId": "ashen.a07",
  "title": "门前的首领",
  "npc": "五位主角",
  "lines": [
   "[中央门户的光压得人几乎睁不开眼。四道纹路仍在向它输送力量，入侵首领挡在门前；身后的同伴已分赴各处，这一段只能由你守住。]",
   "[首领借着支撑的力量步步逼近。此刻要做的不是急于决胜，而是拖住它，为另外四条路争取时间。]"
  ],
  "objective": "独自牵制首领，完成六个战斗行动或提前打破防守，为同伴争取断开支撑的机会。",
  "flags": [
   "FINAL_BOSS_CHECKPOINT"
  ],
  "knowledge": [
   {
    "id": "C10.X05.human.k0",
    "text": "首领被迫退开，但四道支撑仍在向门户输送力量，战斗尚未结束。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "确认现场结果，继续",
    "flags": []
   }
  ],
  "requires": [
   "C10.X04.human"
  ],
  "optional": false,
  "encounter": {
   "kind": "scenario",
   "scenarioId": "story.c10-x05-human",
   "nodeId": "ashen.a07.field",
   "count": 1
  }
 },
 "C10.X061.human": {
  "id": "C10.X061.human",
  "sourceScene": "C10.X061",
  "chapter": 10,
  "pov": "human",
  "siteId": "ashen.a07",
  "title": "断开的支撑 · 1",
  "npc": "五位主角",
  "lines": [
   "[远景：奇克按会合时确认的路线破坏支撑节点。]",
   "[中央可见：第一道纹路熄灭，首领失去额外伤害支撑。]",
   "[第一道光纹熄灭，门户边缘短暂地暗了一瞬。首领偏过头，你抓紧这片刻重新站稳。]"
  ],
  "objective": "观察中央光路的变化，继续守住首领。",
  "flags": [
   "SUPPORT_1_DOWN"
  ],
  "knowledge": [
   {
    "id": "C10.X061.human.k0",
    "text": "第一道纹路熄灭，首领失去额外伤害支撑。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "确认现场结果，继续",
    "flags": []
   }
  ],
  "requires": [
   "C10.X05.human"
  ],
  "optional": false
 },
 "C10.X062.human": {
  "id": "C10.X062.human",
  "sourceScene": "C10.X062",
  "chapter": 10,
  "pov": "human",
  "siteId": "ashen.a07",
  "title": "断开的支撑 · 2",
  "npc": "五位主角",
  "lines": [
   "[远景：莱姆斯按会合时确认的路线破坏支撑节点。]",
   "[中央可见：第二道纹路熄灭，水道仍完好，首领失去额外防护。]",
   "[第二道光纹暗下，脚边的震动弱了一层。你听见远处碎石落地，随后只剩首领逼近的脚步。]"
  ],
  "objective": "观察中央光路的变化，继续守住首领。",
  "flags": [
   "SUPPORT_2_DOWN"
  ],
  "knowledge": [
   {
    "id": "C10.X062.human.k0",
    "text": "第二道纹路熄灭，水道仍完好，首领失去额外防护。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "确认现场结果，继续",
    "flags": []
   }
  ],
  "requires": [
   "C10.X061.human"
  ],
  "optional": false
 },
 "C10.X063.human": {
  "id": "C10.X063.human",
  "sourceScene": "C10.X063",
  "chapter": 10,
  "pov": "human",
  "siteId": "ashen.a07",
  "title": "断开的支撑 · 3",
  "npc": "五位主角",
  "lines": [
   "[远景：布洛克按会合时确认的路线破坏支撑节点。]",
   "[中央可见：第三道纹路熄灭，首领失去恢复支撑；矿工已撤出，矿区未被炸塌。]",
   "[第三道光纹断开，门户上方的亮光开始摇晃。首领仍挡在面前，你没有让它离开中央。]"
  ],
  "objective": "观察中央光路的变化，继续守住首领。",
  "flags": [
   "SUPPORT_3_DOWN"
  ],
  "knowledge": [
   {
    "id": "C10.X063.human.k0",
    "text": "第三道纹路熄灭，首领失去恢复支撑；矿工已撤出，矿区未被炸塌。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "确认现场结果，继续",
    "flags": []
   }
  ],
  "requires": [
   "C10.X062.human"
  ],
  "optional": false
 },
 "C10.X064.human": {
  "id": "C10.X064.human",
  "sourceScene": "C10.X064",
  "chapter": 10,
  "pov": "human",
  "siteId": "ashen.a07",
  "title": "断开的支撑 · 4",
  "npc": "五位主角",
  "lines": [
   "[远景：砾恩按会合时确认的路线破坏支撑节点。]",
   "[最后一道纹路熄灭，门户在轰鸣中合拢，再没有援军跨出来。眼前的首领却仍站着，沉重的脚步压过碎石。]",
   "[最后一道光纹终于熄灭。压在中央的力量骤然退去，门户还未合拢，决胜的机会就在眼前。]"
  ],
  "objective": "观察中央光路的变化，继续守住首领。",
  "flags": [
   "SUPPORT_4_DOWN",
   "PORTAL_CLOSED"
  ],
  "knowledge": [
   {
    "id": "C10.X064.human.k0",
    "text": "第四道纹路熄灭，援军来源切断，门户关闭；砾恩的核心仍在，已入侵的首领仍须击败。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "确认现场结果，继续",
    "flags": []
   }
  ],
  "requires": [
   "C10.X063.human"
  ],
  "optional": false
 },
 "C10.X07.human": {
  "id": "C10.X07.human",
  "sourceScene": "C10.X07",
  "chapter": 10,
  "pov": "human",
  "siteId": "ashen.a07",
  "title": "门关以后",
  "npc": "五位主角",
  "lines": [
   "[门户闭合的风卷过中央，入侵首领已失去四处外部支撑。]",
   "[同伴们仍在四处祭坛。你握紧武器，独自迎向门前的首领；它身后的光路已经彻底暗下去了。]"
  ],
  "objective": "击败失去支撑、已经进入世界的入侵首领。",
  "flags": [
   "MAIN_STORY_CLEAR"
  ],
  "knowledge": [
   {
    "id": "C10.X07.human.k0",
    "text": "四座支撑全部断开，你击败了守在中央的入侵首领。门户终于关闭，但已经闯入各地的敌人仍需清理。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "确认现场结果，继续",
    "flags": []
   }
  ],
  "requires": [
   "C10.X064.human"
  ],
  "optional": false,
  "encounter": {
   "kind": "scenario",
   "scenarioId": "story.c10-x07-human",
   "nodeId": "ashen.a07.field",
   "count": 1
  }
 },
 "END.X01.human": {
  "id": "END.X01.human",
  "sourceScene": "END.X01",
  "chapter": 10,
  "pov": "human",
  "siteId": "human.a03",
  "title": "再见面",
  "npc": "五位主角",
  "lines": [
   "[你从中央退回约定处，背后的光已经暗了。四位同伴陆续沿各自的归路赶来，有人先看人数，有人仍握着卷起的地图。直到最后一人应声，大家才终于放下戒备。]",
   "布洛克：都回来了？",
   "罗什福尔：人齐。路上还得再清一遍。",
   "莱姆斯：门关了，已经进来的东西还在。",
   "砾恩：那就接着找。",
   "奇克：你们找。我得先回去一趟。",
   "罗什福尔：去吧。回来的路留着。",
   "[奇克停一下，点头离开。]"
  ],
  "objective": "与分赴四座祭坛的同伴会合，确认平安，并约定今后的联络。",
  "flags": [
   "FINAL_REUNION"
  ],
  "knowledge": [
   {
    "id": "END.X01.human.k0",
    "text": "其他四人已从支撑路线返回。门已关闭，但残留敌人、失货与修复尚待继续，各族未立即和解。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "确认现场结果，继续",
    "flags": []
   }
  ],
  "requires": [
   "C10.X07.human"
  ],
  "optional": false
 },
 "END.H01.human": {
  "id": "END.H01.human",
  "sourceScene": "END.H01",
  "chapter": 10,
  "pov": "human",
  "siteId": "human.a01",
  "title": "罗什福尔 · 回去还有事",
  "npc": "斥候与车夫",
  "lines": [
   "[货检棚重新放平一张破桌。罗什福尔把旧货单压在桌上。]",
   "车夫：最大的事都完了，还查这些？",
   "罗什福尔：找回来多少，就记多少。没回家的，也还在这张单上。",
   "斥候：新路能走了。",
   "罗什福尔：好。先把等着回去的人送过去。"
  ],
  "objective": "回家，继续已开放的探索与支线。",
  "flags": [
   "EPILOGUE_COMPLETE"
  ],
  "knowledge": [
   {
    "id": "END.H01.human.k0",
    "text": "门户已经关闭，各人的归路却还没有走完。你可以继续探索、清理残敌，或回去探望仍在等消息的人。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "确认现场结果，继续",
    "flags": []
   }
  ],
  "requires": [
   "END.X01.human"
  ],
  "optional": false
 },
 "C09.A01.dwarf": {
  "id": "C09.A01.dwarf",
  "sourceScene": "C09.A01",
  "chapter": 9,
  "pov": "dwarf",
  "siteId": "ashen.a04",
  "title": "变了的旧座",
  "npc": "莱姆斯与砾恩",
  "lines": [
   "[旧座上曾经灰暗的刻纹正在发光。外廊朝向与主祭坛记下的光路相合。砾恩把记录放到同一处折角旁。]",
   "砾恩：那时没亮。现在连这里也在动。",
   "莱姆斯：和主祭坛外延的纹路一致。",
   "砾恩：我的核心在这里升级过。却没看见下面这一层。",
   "[旧座下的威胁被清开后，你们沿着露出的石阶下探。四壁的光纹越过脚边，汇入通向远方的结构；每一次明灭，都与外面的门户遥相呼应。]",
   "砾恩：它在支撑外面的门。",
   "莱姆斯：先记清连接。动错地方，可能把自己困在这里。"
  ],
  "objective": "随砾恩返查古神庙；清除威胁，比对激活刻纹、连接与撤路。",
  "flags": [
   "R4_TEMPLE_CONFIRMED"
  ],
  "knowledge": [
   {
    "id": "C09.A01.dwarf.k0",
    "text": "亲自随砾恩返查：旧座下的连接支撑中央门户，古神庙是第四处支撑祭坛，不是另一座中央祭坛。",
    "mode": "confirmed"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "确认现场结果，继续",
    "flags": []
   }
  ],
  "requires": [
   "C08.X05.dwarf"
  ],
  "optional": false,
  "encounter": {
   "kind": "scenario",
   "scenarioId": "story.c09-a01-dwarf",
   "nodeId": "ashen.a04.field",
   "count": 1
  }
 },
 "C09.X01.dwarf": {
  "id": "C09.X01.dwarf",
  "sourceScene": "C09.X01",
  "chapter": 9,
  "pov": "dwarf",
  "siteId": "ashen.a04",
  "title": "留下的旧记录",
  "npc": "莱姆斯与砾恩",
  "lines": [
   "[剥落的石皮堆在脚边，旧字从灰下露出来。莱姆斯先抄下能辨认的几行，又把残缺处留空；砾恩站在旁边，一直没有催促。]",
   "[莱姆斯沿字迹慢慢读下去。听到熟悉的名字，砾恩抬起头，看向他刚抄好的那一行。]",
   "莱姆斯：这几行用的还是祭司旧制记法。我能辨出参与者。",
   "砾恩：人族国王。矮人王。还有他。",
   "莱姆斯：和他刚才说的一样。",
   "砾恩：我们从来不知道。",
   "莱姆斯：我也不知道他做过这些。",
   "砾恩：记下来。别再只留在他一个人嘴里。"
  ],
  "objective": "核对古代铭记与大祭司的供述，查明烬裔来历。",
  "flags": [
   "ASHEN_ORIGIN_CORROBORATED"
  ],
  "knowledge": [
   {
    "id": "C09.X01.dwarf.k0",
    "text": "旧记录与主祭坛当场承认相互印证：古代人族国王、矮人王及这位大祭司共同创造烬裔以抵抗外界入侵。",
    "mode": "confirmed"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "确认现场结果，继续",
    "flags": []
   }
  ],
  "requires": [
   "C09.A01.dwarf"
  ],
  "optional": false
 },
 "C09.X02.dwarf": {
  "id": "C09.X02.dwarf",
  "sourceScene": "C09.X02",
  "chapter": 9,
  "pov": "dwarf",
  "siteId": "ashen.a06",
  "title": "各处传来的消息",
  "npc": "莱姆斯与砾恩",
  "lines": [
   "[送来的记录沾着不同地方的尘土。有的折在布里，有的只写在窄木片上；你们把它们按位置铺开，几条原本分散的光路渐渐接到了一起。]",
   "守林者口信：旧水道下面亮了。泉水还在，可那块石台一直震。我们已把人撤到外面。",
   "矿班长口信：矿道里那座旧台亮了。新露出的通道还能走，人已经退出来。",
   "递送者：这是矿班长封口前记的位置。布洛克叫我们留了撤退路。",
   "边境斥候口信：粮路旁的旧石室有光往外冒。我们只守外口，没有进去。",
   "布洛克：入口和出口按新记录走，别照旧矿图硬走。",
   "[众人把送来的路线一一铺开，在图上接起断开的标记，圈出还能撤退的岔口。]",
   "砾恩：这边是第四处。它们都在给同一个地方送力。",
   "莱姆斯：中央那座还在开门。四处支撑要一起处理。"
  ],
  "objective": "比对各地送来的记录，确认四座支撑的位置和撤路。",
  "flags": [
   "FOUR_SUPPORTS_IDENTIFIED"
  ],
  "knowledge": [
   {
    "id": "C09.X02.dwarf.k0",
    "text": "守林者、矿班长、边境斥候与砾恩的现场记录共同确认四座既存支撑：粮路石室、枯泉遗址、矿道遗址、古神庙；中央主祭坛另计。",
    "mode": "confirmed"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "确认现场结果，继续",
    "flags": []
   }
  ],
  "requires": [
   "C09.X01.dwarf"
  ],
  "optional": false
 },
 "C09.X03.dwarf": {
  "id": "C09.X03.dwarf",
  "sourceScene": "C09.X03",
  "chapter": 9,
  "pov": "dwarf",
  "siteId": "human.a03",
  "title": "把人联起来",
  "npc": "莱姆斯与砾恩",
  "lines": [
   "莱姆斯：布洛克认得罗什福尔。我留过联络的地方。",
   "砾恩：要等他们的军队？",
   "莱姆斯：先找他们本人。我们需要能到那四处的人。",
   "[布洛克回信确认收到，再联罗什福尔；罗什福尔通过已有联络找到奇克。]"
  ],
  "objective": "保护传信路线，送达位置与会合点并确认回信。",
  "flags": [
   "FIVE_HERO_CONTACTS_REACHED",
   "C09_COMPLETE"
  ],
  "knowledge": [
   {
    "id": "C09.X03.dwarf.k0",
    "text": "传信路线已经打通。五人的回信陆续送到，会合地点、支撑位置与撤离方向都已核对。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "确认现场结果，继续",
    "flags": []
   }
  ],
  "requires": [
   "C09.X02.dwarf"
  ],
  "optional": false,
  "encounter": {
   "kind": "scenario",
   "scenarioId": "story.c09-x03-dwarf",
   "nodeId": "human.a03.field",
   "count": 1
  }
 },
 "C10.D01.dwarf": {
  "id": "C10.D01.dwarf",
  "sourceScene": "C10.D01",
  "chapter": 10,
  "pov": "dwarf",
  "siteId": "dwarf.a02",
  "title": "让矿口再开一次",
  "npc": "矿班长与记录者",
  "lines": [
   "矿班长：这回从地里出来的，不是我们的人。",
   "布洛克：人往上走。矿车横过来，堵住窄口。",
   "王室记录者：证人和账都在这里。要不要先送王城？",
   "布洛克：先送到能守住的地方。活人和证据都不能再丢。",
   "记录者：这笔出库所得，进了重臣控制的支出账。后面的军资，正从这里付。",
   "布洛克：连上了？",
   "记录者：能对应。原件和证词都在。",
   "布洛克：封好。先挡住外面的东西，回头让他们当着人认账。"
  ],
  "objective": "清开撤离道，保护矿工证人与账证，完成后核对资金链。",
  "flags": [
   "D_INVASION_RESISTED",
   "D_RELIC_SALE_COUP_PROVEN"
  ],
  "knowledge": [
   {
    "id": "C10.D01.dwarf.k0",
    "text": "矿工证人与账证已安全撤出。交接记录和证词彼此印证，重臣盗卖遗物、用所得资助夺权的资金链终于接上；案件仍在追查。",
    "mode": "confirmed"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "确认现场结果，继续",
    "flags": []
   }
  ],
  "requires": [
   "C09.X03.dwarf"
  ],
  "optional": false,
  "encounter": {
   "kind": "scenario",
   "scenarioId": "story.c10-d01-dwarf",
   "nodeId": "dwarf.a02.field",
   "count": 1
  }
 },
 "C10.X01.dwarf": {
  "id": "C10.X01.dwarf",
  "sourceScene": "C10.X01",
  "chapter": 10,
  "pov": "dwarf",
  "siteId": "human.a03",
  "title": "五张图放在一起",
  "npc": "五位主角",
  "lines": [
   "[地图铺好后，五人一时都没有说话。每个人带来的路都通向一个刚刚安置下来的地方；现在，他们要决定怎样让那些地方不再换一次逃路。]",
   "[布洛克先压住矿道图。罗什福尔把商路与城外路线放旁边。莱姆斯摊开水道记录。砾恩放下古神庙拓记。奇克没有坐，站在最近的出口边。]",
   "布洛克：这张是新露的路。别用旧矿图。",
   "罗什福尔：边境石室有两处出入口。我们清过外面。",
   "奇克：第二个口子不是给你这身铁走的。",
   "罗什福尔：所以你来讲。",
   "莱姆斯：泉下面这处已经亮了。中央停了施法，也没有停。",
   "砾恩：四处都连着它。神庙也是。",
   "布洛克：拆支撑，门才能关。",
   "莱姆斯：还得有人留在中央。那里的首领会挡住我们。",
   "奇克：四个地方，一个中间。正好没人闲着。",
   "砾恩：不是。是族长自己的核心。",
   "莱姆斯：王室那枚已经和砾恩结合。他没有追回，就另取了一枚。",
   "[布洛克报告已合拢的出库、运费与夺权军资证据。]",
   "布洛克：有人卖王室的东西，拿钱去炸自己人的矿。账还没完。",
   "罗什福尔：先关门。证人和账，我安排人继续护着。",
   "[莱姆斯把拓记推到众人面前，指向其中一行，说起祭坛前听到的话。]",
   "莱姆斯：古代和两族国王一起创造烬裔的人，就是这位大祭司。记录能对应。",
   "砾恩：这件事，活下来以后，我们自己也要查。",
   "奇克：查可以。先别让明天没人吃饭。",
   "[其他四人当面报告各自抵抗与撤离结果。奇克确认三个家人已到安全营地；布洛克与记录者署名的证据摘要留供查阅。]",
   "[各自报告：城门避难通路已清，矿工证人与账证已保全，泉边村民已撤离，奇克家人已到营地，烬裔伤者已通过内线。你把自己的经历接上，其余四人也逐一说明了各自留下的人手。]"
  ],
  "objective": "会合并交换各地撤离消息，核实支撑祭坛与核心的线索。",
  "flags": [
   "FIVE_HEROES_BRIEFED"
  ],
  "knowledge": [
   {
    "id": "C10.X01.dwarf.k0",
    "text": "布洛克与记录者的账证、证词证实重臣盗卖王室遗物资助夺权。五人核实四座支撑、两枚不同核心与古代记录；并未因此使各族和解。",
    "mode": "confirmed"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "确认现场结果，继续",
    "flags": []
   }
  ],
  "requires": [
   "C10.D01.dwarf"
  ],
  "optional": false
 },
 "C10.X03.dwarf": {
  "id": "C10.X03.dwarf",
  "sourceScene": "C10.X03",
  "chapter": 10,
  "pov": "dwarf",
  "siteId": "human.a03",
  "title": "去中央的人",
  "npc": "五位主角",
  "lines": [
   "布洛克：中央给我。你们把能拆的地方说准，别让人白跑。",
   "[第1支撑 · 粮路石室：奇克；地图、带路人与撤路已确认。]",
   "[第2支撑 · 枯泉遗址：莱姆斯；地图、带路人与撤路已确认。]",
   "[第3支撑 · 矿道遗址：罗什福尔；地图、带路人与撤路已确认。]",
   "[第4支撑 · 古神庙：砾恩；地图、带路人与撤路已确认。]",
   "[四位同伴各自收起地图，约好抵达入口后再相互报信。你要独自守住中央；动身之前，仍可返回补齐行装。]"
  ],
  "objective": "确认各自的路线与分工；出发前可返回整备。",
  "flags": [
   "FINAL_ROLES_ASSIGNED"
  ],
  "knowledge": [
   {
    "id": "C10.X03.dwarf.k0",
    "text": "中央由布洛克独自承担；第1支撑 · 粮路石室：奇克；地图、带路人与撤路已确认。；第2支撑 · 枯泉遗址：莱姆斯；地图、带路人与撤路已确认。；第3支撑 · 矿道遗址：罗什福尔；地图、带路人与撤路已确认。；第4支撑 · 古神庙：砾恩；地图、带路人与撤路已确认。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "确认现场结果，继续",
    "flags": []
   }
  ],
  "requires": [
   "C10.X01.dwarf"
  ],
  "optional": false
 },
 "C10.X04.dwarf": {
  "id": "C10.X04.dwarf",
  "sourceScene": "C10.X04",
  "chapter": 10,
  "pov": "dwarf",
  "siteId": "ashen.a07",
  "title": "四条路的开头",
  "npc": "五位主角",
  "lines": [
   "奇克：我认路。不代表我喜欢这条路。",
   "莱姆斯：把入口留空。有人退出来，别堵住。",
   "罗什福尔：撤路的人先回。剩下这段我自己走。",
   "砾恩：我会回到约定的地方。"
  ],
  "objective": "清出最后通道，保护递送撤路标记的人员。",
  "flags": [
   "FINAL_APPROACH_CLEARED",
   "SUPPORT_TEAMS_READY"
  ],
  "knowledge": [
   {
    "id": "C10.X04.dwarf.k0",
    "text": "中央通路已清，其他四人确认到达各自支撑入口。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "确认现场结果，继续",
    "flags": []
   }
  ],
  "requires": [
   "C10.X03.dwarf"
  ],
  "optional": false,
  "encounter": {
   "kind": "scenario",
   "scenarioId": "story.c10-x04-dwarf",
   "nodeId": "ashen.a07.field",
   "count": 1
  }
 },
 "C10.X05.dwarf": {
  "id": "C10.X05.dwarf",
  "sourceScene": "C10.X05",
  "chapter": 10,
  "pov": "dwarf",
  "siteId": "ashen.a07",
  "title": "门前的首领",
  "npc": "五位主角",
  "lines": [
   "[中央门户的光压得人几乎睁不开眼。四道纹路仍在向它输送力量，入侵首领挡在门前；身后的同伴已分赴各处，这一段只能由你守住。]",
   "[首领借着支撑的力量步步逼近。此刻要做的不是急于决胜，而是拖住它，为另外四条路争取时间。]"
  ],
  "objective": "独自牵制首领，完成六个战斗行动或提前打破防守，为同伴争取断开支撑的机会。",
  "flags": [
   "FINAL_BOSS_CHECKPOINT"
  ],
  "knowledge": [
   {
    "id": "C10.X05.dwarf.k0",
    "text": "首领被迫退开，但四道支撑仍在向门户输送力量，战斗尚未结束。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "确认现场结果，继续",
    "flags": []
   }
  ],
  "requires": [
   "C10.X04.dwarf"
  ],
  "optional": false,
  "encounter": {
   "kind": "scenario",
   "scenarioId": "story.c10-x05-dwarf",
   "nodeId": "ashen.a07.field",
   "count": 1
  }
 },
 "C10.X061.dwarf": {
  "id": "C10.X061.dwarf",
  "sourceScene": "C10.X061",
  "chapter": 10,
  "pov": "dwarf",
  "siteId": "ashen.a07",
  "title": "断开的支撑 · 1",
  "npc": "五位主角",
  "lines": [
   "[远景：奇克按会合时确认的路线破坏支撑节点。]",
   "[中央可见：第一道纹路熄灭，首领失去额外伤害支撑。]",
   "[第一道光纹熄灭，门户边缘短暂地暗了一瞬。首领偏过头，你抓紧这片刻重新站稳。]"
  ],
  "objective": "观察中央光路的变化，继续守住首领。",
  "flags": [
   "SUPPORT_1_DOWN"
  ],
  "knowledge": [
   {
    "id": "C10.X061.dwarf.k0",
    "text": "第一道纹路熄灭，首领失去额外伤害支撑。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "确认现场结果，继续",
    "flags": []
   }
  ],
  "requires": [
   "C10.X05.dwarf"
  ],
  "optional": false
 },
 "C10.X062.dwarf": {
  "id": "C10.X062.dwarf",
  "sourceScene": "C10.X062",
  "chapter": 10,
  "pov": "dwarf",
  "siteId": "ashen.a07",
  "title": "断开的支撑 · 2",
  "npc": "五位主角",
  "lines": [
   "[远景：莱姆斯按会合时确认的路线破坏支撑节点。]",
   "[中央可见：第二道纹路熄灭，水道仍完好，首领失去额外防护。]",
   "[第二道光纹暗下，脚边的震动弱了一层。你听见远处碎石落地，随后只剩首领逼近的脚步。]"
  ],
  "objective": "观察中央光路的变化，继续守住首领。",
  "flags": [
   "SUPPORT_2_DOWN"
  ],
  "knowledge": [
   {
    "id": "C10.X062.dwarf.k0",
    "text": "第二道纹路熄灭，水道仍完好，首领失去额外防护。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "确认现场结果，继续",
    "flags": []
   }
  ],
  "requires": [
   "C10.X061.dwarf"
  ],
  "optional": false
 },
 "C10.X063.dwarf": {
  "id": "C10.X063.dwarf",
  "sourceScene": "C10.X063",
  "chapter": 10,
  "pov": "dwarf",
  "siteId": "ashen.a07",
  "title": "断开的支撑 · 3",
  "npc": "五位主角",
  "lines": [
   "[远景：罗什福尔按会合时确认的路线破坏支撑节点。]",
   "[中央可见：第三道纹路熄灭，首领失去恢复支撑；矿工已撤出，矿区未被炸塌。]",
   "[第三道光纹断开，门户上方的亮光开始摇晃。首领仍挡在面前，你没有让它离开中央。]"
  ],
  "objective": "观察中央光路的变化，继续守住首领。",
  "flags": [
   "SUPPORT_3_DOWN"
  ],
  "knowledge": [
   {
    "id": "C10.X063.dwarf.k0",
    "text": "第三道纹路熄灭，首领失去恢复支撑；矿工已撤出，矿区未被炸塌。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "确认现场结果，继续",
    "flags": []
   }
  ],
  "requires": [
   "C10.X062.dwarf"
  ],
  "optional": false
 },
 "C10.X064.dwarf": {
  "id": "C10.X064.dwarf",
  "sourceScene": "C10.X064",
  "chapter": 10,
  "pov": "dwarf",
  "siteId": "ashen.a07",
  "title": "断开的支撑 · 4",
  "npc": "五位主角",
  "lines": [
   "[远景：砾恩按会合时确认的路线破坏支撑节点。]",
   "[最后一道纹路熄灭，门户在轰鸣中合拢，再没有援军跨出来。眼前的首领却仍站着，沉重的脚步压过碎石。]",
   "[最后一道光纹终于熄灭。压在中央的力量骤然退去，门户还未合拢，决胜的机会就在眼前。]"
  ],
  "objective": "观察中央光路的变化，继续守住首领。",
  "flags": [
   "SUPPORT_4_DOWN",
   "PORTAL_CLOSED"
  ],
  "knowledge": [
   {
    "id": "C10.X064.dwarf.k0",
    "text": "第四道纹路熄灭，援军来源切断，门户关闭；砾恩的核心仍在，已入侵的首领仍须击败。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "确认现场结果，继续",
    "flags": []
   }
  ],
  "requires": [
   "C10.X063.dwarf"
  ],
  "optional": false
 },
 "C10.X07.dwarf": {
  "id": "C10.X07.dwarf",
  "sourceScene": "C10.X07",
  "chapter": 10,
  "pov": "dwarf",
  "siteId": "ashen.a07",
  "title": "门关以后",
  "npc": "五位主角",
  "lines": [
   "[门户闭合的风卷过中央，入侵首领已失去四处外部支撑。]",
   "[同伴们仍在四处祭坛。你握紧武器，独自迎向门前的首领；它身后的光路已经彻底暗下去了。]"
  ],
  "objective": "击败失去支撑、已经进入世界的入侵首领。",
  "flags": [
   "MAIN_STORY_CLEAR"
  ],
  "knowledge": [
   {
    "id": "C10.X07.dwarf.k0",
    "text": "四座支撑全部断开，你击败了守在中央的入侵首领。门户终于关闭，但已经闯入各地的敌人仍需清理。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "确认现场结果，继续",
    "flags": []
   }
  ],
  "requires": [
   "C10.X064.dwarf"
  ],
  "optional": false,
  "encounter": {
   "kind": "scenario",
   "scenarioId": "story.c10-x07-dwarf",
   "nodeId": "ashen.a07.field",
   "count": 1
  }
 },
 "END.X01.dwarf": {
  "id": "END.X01.dwarf",
  "sourceScene": "END.X01",
  "chapter": 10,
  "pov": "dwarf",
  "siteId": "human.a03",
  "title": "再见面",
  "npc": "五位主角",
  "lines": [
   "[你从中央退回约定处，背后的光已经暗了。四位同伴陆续沿各自的归路赶来，有人先看人数，有人仍握着卷起的地图。直到最后一人应声，大家才终于放下戒备。]",
   "布洛克：都回来了？",
   "罗什福尔：人齐。路上还得再清一遍。",
   "莱姆斯：门关了，已经进来的东西还在。",
   "砾恩：那就接着找。",
   "奇克：你们找。我得先回去一趟。",
   "罗什福尔：去吧。回来的路留着。",
   "[奇克停一下，点头离开。]"
  ],
  "objective": "与分赴四座祭坛的同伴会合，确认平安，并约定今后的联络。",
  "flags": [
   "FINAL_REUNION"
  ],
  "knowledge": [
   {
    "id": "END.X01.dwarf.k0",
    "text": "其他四人已从支撑路线返回。门已关闭，但残留敌人、失货与修复尚待继续，各族未立即和解。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "确认现场结果，继续",
    "flags": []
   }
  ],
  "requires": [
   "C10.X07.dwarf"
  ],
  "optional": false
 },
 "END.D01.dwarf": {
  "id": "END.D01.dwarf",
  "sourceScene": "END.D01",
  "chapter": 10,
  "pov": "dwarf",
  "siteId": "dwarf.a01",
  "title": "布洛克 · 回去还有事",
  "npc": "矿班长与记录者",
  "lines": [
   "[矿口重新点名。布洛克把保全的账证交给记录者，自己走到新支架旁。]",
   "矿班长：今天还下去？",
   "布洛克：先看梁。少一根都不下。",
   "记录者：重臣那边的案子，会继续查。",
   "布洛克：名字都留全。死的、活的，谁也别从账上抹掉。"
  ],
  "objective": "回家，继续已开放的探索与支线。",
  "flags": [
   "EPILOGUE_COMPLETE"
  ],
  "knowledge": [
   {
    "id": "END.D01.dwarf.k0",
    "text": "门户已经关闭，各人的归路却还没有走完。你可以继续探索、清理残敌，或回去探望仍在等消息的人。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "确认现场结果，继续",
    "flags": []
   }
  ],
  "requires": [
   "END.X01.dwarf"
  ],
  "optional": false
 },
 "C09.A01.elf": {
  "id": "C09.A01.elf",
  "sourceScene": "C09.A01",
  "chapter": 9,
  "pov": "elf",
  "siteId": "ashen.a04",
  "title": "变了的旧座",
  "npc": "莱姆斯与砾恩",
  "lines": [
   "[旧座上曾经灰暗的刻纹正在发光。外廊朝向与主祭坛记下的光路相合。砾恩把记录放到同一处折角旁。]",
   "砾恩：那时没亮。现在连这里也在动。",
   "莱姆斯：和主祭坛外延的纹路一致。",
   "砾恩：我的核心在这里升级过。却没看见下面这一层。",
   "[旧座下的威胁被清开后，你们沿着露出的石阶下探。四壁的光纹越过脚边，汇入通向远方的结构；每一次明灭，都与外面的门户遥相呼应。]",
   "砾恩：它在支撑外面的门。",
   "莱姆斯：先记清连接。动错地方，可能把自己困在这里。"
  ],
  "objective": "随砾恩返查古神庙；清除威胁，比对激活刻纹、连接与撤路。",
  "flags": [
   "R4_TEMPLE_CONFIRMED"
  ],
  "knowledge": [
   {
    "id": "C09.A01.elf.k0",
    "text": "亲自随砾恩返查：旧座下的连接支撑中央门户，古神庙是第四处支撑祭坛，不是另一座中央祭坛。",
    "mode": "confirmed"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "确认现场结果，继续",
    "flags": []
   }
  ],
  "requires": [
   "C08.X05.elf"
  ],
  "optional": false,
  "encounter": {
   "kind": "scenario",
   "scenarioId": "story.c09-a01-elf",
   "nodeId": "ashen.a04.field",
   "count": 1
  }
 },
 "C09.X01.elf": {
  "id": "C09.X01.elf",
  "sourceScene": "C09.X01",
  "chapter": 9,
  "pov": "elf",
  "siteId": "ashen.a04",
  "title": "留下的旧记录",
  "npc": "莱姆斯与砾恩",
  "lines": [
   "[剥落的石皮堆在脚边，旧字从灰下露出来。莱姆斯先抄下能辨认的几行，又把残缺处留空；砾恩站在旁边，一直没有催促。]",
   "[莱姆斯沿字迹慢慢读下去。听到熟悉的名字，砾恩抬起头，看向他刚抄好的那一行。]",
   "莱姆斯：这几行用的还是祭司旧制记法。我能辨出参与者。",
   "砾恩：人族国王。矮人王。还有他。",
   "莱姆斯：和他刚才说的一样。",
   "砾恩：我们从来不知道。",
   "莱姆斯：我也不知道他做过这些。",
   "砾恩：记下来。别再只留在他一个人嘴里。"
  ],
  "objective": "核对古代铭记与大祭司的供述，查明烬裔来历。",
  "flags": [
   "ASHEN_ORIGIN_CORROBORATED"
  ],
  "knowledge": [
   {
    "id": "C09.X01.elf.k0",
    "text": "旧记录与主祭坛当场承认相互印证：古代人族国王、矮人王及这位大祭司共同创造烬裔以抵抗外界入侵。",
    "mode": "confirmed"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "确认现场结果，继续",
    "flags": []
   }
  ],
  "requires": [
   "C09.A01.elf"
  ],
  "optional": false
 },
 "C09.X02.elf": {
  "id": "C09.X02.elf",
  "sourceScene": "C09.X02",
  "chapter": 9,
  "pov": "elf",
  "siteId": "ashen.a06",
  "title": "各处传来的消息",
  "npc": "莱姆斯与砾恩",
  "lines": [
   "[送来的记录沾着不同地方的尘土。有的折在布里，有的只写在窄木片上；你们把它们按位置铺开，几条原本分散的光路渐渐接到了一起。]",
   "守林者口信：旧水道下面亮了。泉水还在，可那块石台一直震。我们已把人撤到外面。",
   "矿班长口信：矿道里那座旧台亮了。新露出的通道还能走，人已经退出来。",
   "递送者：这是矿班长封口前记的位置。布洛克叫我们留了撤退路。",
   "边境斥候口信：粮路旁的旧石室有光往外冒。我们只守外口，没有进去。",
   "莱姆斯：我见过旧台。把守林者补上的记录一起核对。",
   "[众人把送来的路线一一铺开，在图上接起断开的标记，圈出还能撤退的岔口。]",
   "砾恩：这边是第四处。它们都在给同一个地方送力。",
   "莱姆斯：中央那座还在开门。四处支撑要一起处理。"
  ],
  "objective": "比对各地送来的记录，确认四座支撑的位置和撤路。",
  "flags": [
   "FOUR_SUPPORTS_IDENTIFIED"
  ],
  "knowledge": [
   {
    "id": "C09.X02.elf.k0",
    "text": "守林者、矿班长、边境斥候与砾恩的现场记录共同确认四座既存支撑：粮路石室、枯泉遗址、矿道遗址、古神庙；中央主祭坛另计。",
    "mode": "confirmed"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "确认现场结果，继续",
    "flags": []
   }
  ],
  "requires": [
   "C09.X01.elf"
  ],
  "optional": false
 },
 "C09.X03.elf": {
  "id": "C09.X03.elf",
  "sourceScene": "C09.X03",
  "chapter": 9,
  "pov": "elf",
  "siteId": "human.a03",
  "title": "把人联起来",
  "npc": "莱姆斯与砾恩",
  "lines": [
   "莱姆斯：布洛克认得罗什福尔。我留过联络的地方。",
   "砾恩：要等他们的军队？",
   "莱姆斯：先找他们本人。我们需要能到那四处的人。",
   "[布洛克回信确认收到，再联罗什福尔；罗什福尔通过已有联络找到奇克。]"
  ],
  "objective": "保护传信路线，送达位置与会合点并确认回信。",
  "flags": [
   "FIVE_HERO_CONTACTS_REACHED",
   "C09_COMPLETE"
  ],
  "knowledge": [
   {
    "id": "C09.X03.elf.k0",
    "text": "传信路线已经打通。五人的回信陆续送到，会合地点、支撑位置与撤离方向都已核对。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "确认现场结果，继续",
    "flags": []
   }
  ],
  "requires": [
   "C09.X02.elf"
  ],
  "optional": false,
  "encounter": {
   "kind": "scenario",
   "scenarioId": "story.c09-x03-elf",
   "nodeId": "human.a03.field",
   "count": 1
  }
 },
 "C10.E01.elf": {
  "id": "C10.E01.elf",
  "sourceScene": "C10.E01",
  "chapter": 10,
  "pov": "elf",
  "siteId": "elf.a02",
  "title": "泉边的撤离",
  "npc": "村民与守林者",
  "lines": [
   "村民：水没停。可下面的声音越来越大。",
   "莱姆斯：别下去。先让孩子和走不快的人过桥。",
   "守林者：我留在泉口看着。",
   "莱姆斯：远一点。你知道路，我们还需要你带别人出去。",
   "守林者：当时把水引回来了，没想到下面还有这个。",
   "莱姆斯：当时该救的水，没有白救。现在把人带走。"
  ],
  "objective": "击退追到水道外的恶魔，守住已修复的泉水，保护村民撤离。",
  "flags": [
   "E_INVASION_RESISTED"
  ],
  "knowledge": [
   {
    "id": "C10.E01.elf.k0",
    "text": "追到水道外的恶魔已经退去，村民沿撤路离开，修复的泉水仍在流淌。",
    "mode": "confirmed"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "确认现场结果，继续",
    "flags": []
   }
  ],
  "requires": [
   "C09.X03.elf"
  ],
  "optional": false,
  "encounter": {
   "kind": "scenario",
   "scenarioId": "story.c10-e01-elf",
   "nodeId": "elf.a02.field",
   "count": 1
  }
 },
 "C10.X01.elf": {
  "id": "C10.X01.elf",
  "sourceScene": "C10.X01",
  "chapter": 10,
  "pov": "elf",
  "siteId": "human.a03",
  "title": "五张图放在一起",
  "npc": "五位主角",
  "lines": [
   "[地图铺好后，五人一时都没有说话。每个人带来的路都通向一个刚刚安置下来的地方；现在，他们要决定怎样让那些地方不再换一次逃路。]",
   "[布洛克先压住矿道图。罗什福尔把商路与城外路线放旁边。莱姆斯摊开水道记录。砾恩放下古神庙拓记。奇克没有坐，站在最近的出口边。]",
   "布洛克：这张是新露的路。别用旧矿图。",
   "罗什福尔：边境石室有两处出入口。我们清过外面。",
   "奇克：第二个口子不是给你这身铁走的。",
   "罗什福尔：所以你来讲。",
   "莱姆斯：泉下面这处已经亮了。中央停了施法，也没有停。",
   "砾恩：四处都连着它。神庙也是。",
   "布洛克：拆支撑，门才能关。",
   "莱姆斯：还得有人留在中央。那里的首领会挡住我们。",
   "奇克：四个地方，一个中间。正好没人闲着。",
   "砾恩：不是。是族长自己的核心。",
   "莱姆斯：王室那枚已经和砾恩结合。他没有追回，就另取了一枚。",
   "[布洛克报告已合拢的出库、运费与夺权军资证据。]",
   "布洛克：有人卖王室的东西，拿钱去炸自己人的矿。账还没完。",
   "罗什福尔：先关门。证人和账，我安排人继续护着。",
   "[莱姆斯把拓记推到众人面前，指向其中一行，说起祭坛前听到的话。]",
   "莱姆斯：古代和两族国王一起创造烬裔的人，就是这位大祭司。记录能对应。",
   "砾恩：这件事，活下来以后，我们自己也要查。",
   "奇克：查可以。先别让明天没人吃饭。",
   "[其他四人当面报告各自抵抗与撤离结果。奇克确认三个家人已到安全营地；布洛克与记录者署名的证据摘要留供查阅。]",
   "[各自报告：城门避难通路已清，矿工证人与账证已保全，泉边村民已撤离，奇克家人已到营地，烬裔伤者已通过内线。你把自己的经历接上，其余四人也逐一说明了各自留下的人手。]"
  ],
  "objective": "会合并交换各地撤离消息，核实支撑祭坛与核心的线索。",
  "flags": [
   "FIVE_HEROES_BRIEFED"
  ],
  "knowledge": [
   {
    "id": "C10.X01.elf.k0",
    "text": "布洛克与记录者的账证、证词证实重臣盗卖王室遗物资助夺权。五人核实四座支撑、两枚不同核心与古代记录；并未因此使各族和解。",
    "mode": "confirmed"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "确认现场结果，继续",
    "flags": []
   }
  ],
  "requires": [
   "C10.E01.elf"
  ],
  "optional": false
 },
 "C10.X03.elf": {
  "id": "C10.X03.elf",
  "sourceScene": "C10.X03",
  "chapter": 10,
  "pov": "elf",
  "siteId": "human.a03",
  "title": "去中央的人",
  "npc": "五位主角",
  "lines": [
   "莱姆斯：我去中央。这次我知道要阻止的是什么。",
   "[第1支撑 · 粮路石室：奇克；地图、带路人与撤路已确认。]",
   "[第2支撑 · 枯泉遗址：罗什福尔；地图、带路人与撤路已确认。]",
   "[第3支撑 · 矿道遗址：布洛克；地图、带路人与撤路已确认。]",
   "[第4支撑 · 古神庙：砾恩；地图、带路人与撤路已确认。]",
   "[四位同伴各自收起地图，约好抵达入口后再相互报信。你要独自守住中央；动身之前，仍可返回补齐行装。]"
  ],
  "objective": "确认各自的路线与分工；出发前可返回整备。",
  "flags": [
   "FINAL_ROLES_ASSIGNED"
  ],
  "knowledge": [
   {
    "id": "C10.X03.elf.k0",
    "text": "中央由莱姆斯独自承担；第1支撑 · 粮路石室：奇克；地图、带路人与撤路已确认。；第2支撑 · 枯泉遗址：罗什福尔；地图、带路人与撤路已确认。；第3支撑 · 矿道遗址：布洛克；地图、带路人与撤路已确认。；第4支撑 · 古神庙：砾恩；地图、带路人与撤路已确认。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "确认现场结果，继续",
    "flags": []
   }
  ],
  "requires": [
   "C10.X01.elf"
  ],
  "optional": false
 },
 "C10.X04.elf": {
  "id": "C10.X04.elf",
  "sourceScene": "C10.X04",
  "chapter": 10,
  "pov": "elf",
  "siteId": "ashen.a07",
  "title": "四条路的开头",
  "npc": "五位主角",
  "lines": [
   "奇克：我认路。不代表我喜欢这条路。",
   "罗什福尔：撤路的人先回。剩下这段我自己走。",
   "布洛克：下去以后少碰。标出来的地方才动手。",
   "砾恩：我会回到约定的地方。"
  ],
  "objective": "清出最后通道，保护递送撤路标记的人员。",
  "flags": [
   "FINAL_APPROACH_CLEARED",
   "SUPPORT_TEAMS_READY"
  ],
  "knowledge": [
   {
    "id": "C10.X04.elf.k0",
    "text": "中央通路已清，其他四人确认到达各自支撑入口。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "确认现场结果，继续",
    "flags": []
   }
  ],
  "requires": [
   "C10.X03.elf"
  ],
  "optional": false,
  "encounter": {
   "kind": "scenario",
   "scenarioId": "story.c10-x04-elf",
   "nodeId": "ashen.a07.field",
   "count": 1
  }
 },
 "C10.X05.elf": {
  "id": "C10.X05.elf",
  "sourceScene": "C10.X05",
  "chapter": 10,
  "pov": "elf",
  "siteId": "ashen.a07",
  "title": "门前的首领",
  "npc": "五位主角",
  "lines": [
   "[中央门户的光压得人几乎睁不开眼。四道纹路仍在向它输送力量，入侵首领挡在门前；身后的同伴已分赴各处，这一段只能由你守住。]",
   "[首领借着支撑的力量步步逼近。此刻要做的不是急于决胜，而是拖住它，为另外四条路争取时间。]"
  ],
  "objective": "独自牵制首领，完成六个战斗行动或提前打破防守，为同伴争取断开支撑的机会。",
  "flags": [
   "FINAL_BOSS_CHECKPOINT"
  ],
  "knowledge": [
   {
    "id": "C10.X05.elf.k0",
    "text": "首领被迫退开，但四道支撑仍在向门户输送力量，战斗尚未结束。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "确认现场结果，继续",
    "flags": []
   }
  ],
  "requires": [
   "C10.X04.elf"
  ],
  "optional": false,
  "encounter": {
   "kind": "scenario",
   "scenarioId": "story.c10-x05-elf",
   "nodeId": "ashen.a07.field",
   "count": 1
  }
 },
 "C10.X061.elf": {
  "id": "C10.X061.elf",
  "sourceScene": "C10.X061",
  "chapter": 10,
  "pov": "elf",
  "siteId": "ashen.a07",
  "title": "断开的支撑 · 1",
  "npc": "五位主角",
  "lines": [
   "[远景：奇克按会合时确认的路线破坏支撑节点。]",
   "[中央可见：第一道纹路熄灭，首领失去额外伤害支撑。]",
   "[第一道光纹熄灭，门户边缘短暂地暗了一瞬。首领偏过头，你抓紧这片刻重新站稳。]"
  ],
  "objective": "观察中央光路的变化，继续守住首领。",
  "flags": [
   "SUPPORT_1_DOWN"
  ],
  "knowledge": [
   {
    "id": "C10.X061.elf.k0",
    "text": "第一道纹路熄灭，首领失去额外伤害支撑。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "确认现场结果，继续",
    "flags": []
   }
  ],
  "requires": [
   "C10.X05.elf"
  ],
  "optional": false
 },
 "C10.X062.elf": {
  "id": "C10.X062.elf",
  "sourceScene": "C10.X062",
  "chapter": 10,
  "pov": "elf",
  "siteId": "ashen.a07",
  "title": "断开的支撑 · 2",
  "npc": "五位主角",
  "lines": [
   "[远景：罗什福尔按会合时确认的路线破坏支撑节点。]",
   "[中央可见：第二道纹路熄灭，水道仍完好，首领失去额外防护。]",
   "[第二道光纹暗下，脚边的震动弱了一层。你听见远处碎石落地，随后只剩首领逼近的脚步。]"
  ],
  "objective": "观察中央光路的变化，继续守住首领。",
  "flags": [
   "SUPPORT_2_DOWN"
  ],
  "knowledge": [
   {
    "id": "C10.X062.elf.k0",
    "text": "第二道纹路熄灭，水道仍完好，首领失去额外防护。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "确认现场结果，继续",
    "flags": []
   }
  ],
  "requires": [
   "C10.X061.elf"
  ],
  "optional": false
 },
 "C10.X063.elf": {
  "id": "C10.X063.elf",
  "sourceScene": "C10.X063",
  "chapter": 10,
  "pov": "elf",
  "siteId": "ashen.a07",
  "title": "断开的支撑 · 3",
  "npc": "五位主角",
  "lines": [
   "[远景：布洛克按会合时确认的路线破坏支撑节点。]",
   "[中央可见：第三道纹路熄灭，首领失去恢复支撑；矿工已撤出，矿区未被炸塌。]",
   "[第三道光纹断开，门户上方的亮光开始摇晃。首领仍挡在面前，你没有让它离开中央。]"
  ],
  "objective": "观察中央光路的变化，继续守住首领。",
  "flags": [
   "SUPPORT_3_DOWN"
  ],
  "knowledge": [
   {
    "id": "C10.X063.elf.k0",
    "text": "第三道纹路熄灭，首领失去恢复支撑；矿工已撤出，矿区未被炸塌。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "确认现场结果，继续",
    "flags": []
   }
  ],
  "requires": [
   "C10.X062.elf"
  ],
  "optional": false
 },
 "C10.X064.elf": {
  "id": "C10.X064.elf",
  "sourceScene": "C10.X064",
  "chapter": 10,
  "pov": "elf",
  "siteId": "ashen.a07",
  "title": "断开的支撑 · 4",
  "npc": "五位主角",
  "lines": [
   "[远景：砾恩按会合时确认的路线破坏支撑节点。]",
   "[最后一道纹路熄灭，门户在轰鸣中合拢，再没有援军跨出来。眼前的首领却仍站着，沉重的脚步压过碎石。]",
   "[最后一道光纹终于熄灭。压在中央的力量骤然退去，门户还未合拢，决胜的机会就在眼前。]"
  ],
  "objective": "观察中央光路的变化，继续守住首领。",
  "flags": [
   "SUPPORT_4_DOWN",
   "PORTAL_CLOSED"
  ],
  "knowledge": [
   {
    "id": "C10.X064.elf.k0",
    "text": "第四道纹路熄灭，援军来源切断，门户关闭；砾恩的核心仍在，已入侵的首领仍须击败。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "确认现场结果，继续",
    "flags": []
   }
  ],
  "requires": [
   "C10.X063.elf"
  ],
  "optional": false
 },
 "C10.X07.elf": {
  "id": "C10.X07.elf",
  "sourceScene": "C10.X07",
  "chapter": 10,
  "pov": "elf",
  "siteId": "ashen.a07",
  "title": "门关以后",
  "npc": "五位主角",
  "lines": [
   "[门户闭合的风卷过中央，入侵首领已失去四处外部支撑。]",
   "[同伴们仍在四处祭坛。你握紧武器，独自迎向门前的首领；它身后的光路已经彻底暗下去了。]"
  ],
  "objective": "击败失去支撑、已经进入世界的入侵首领。",
  "flags": [
   "MAIN_STORY_CLEAR"
  ],
  "knowledge": [
   {
    "id": "C10.X07.elf.k0",
    "text": "四座支撑全部断开，你击败了守在中央的入侵首领。门户终于关闭，但已经闯入各地的敌人仍需清理。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "确认现场结果，继续",
    "flags": []
   }
  ],
  "requires": [
   "C10.X064.elf"
  ],
  "optional": false,
  "encounter": {
   "kind": "scenario",
   "scenarioId": "story.c10-x07-elf",
   "nodeId": "ashen.a07.field",
   "count": 1
  }
 },
 "END.X01.elf": {
  "id": "END.X01.elf",
  "sourceScene": "END.X01",
  "chapter": 10,
  "pov": "elf",
  "siteId": "human.a03",
  "title": "再见面",
  "npc": "五位主角",
  "lines": [
   "[你从中央退回约定处，背后的光已经暗了。四位同伴陆续沿各自的归路赶来，有人先看人数，有人仍握着卷起的地图。直到最后一人应声，大家才终于放下戒备。]",
   "布洛克：都回来了？",
   "罗什福尔：人齐。路上还得再清一遍。",
   "莱姆斯：门关了，已经进来的东西还在。",
   "砾恩：那就接着找。",
   "奇克：你们找。我得先回去一趟。",
   "罗什福尔：去吧。回来的路留着。",
   "[奇克停一下，点头离开。]"
  ],
  "objective": "与分赴四座祭坛的同伴会合，确认平安，并约定今后的联络。",
  "flags": [
   "FINAL_REUNION"
  ],
  "knowledge": [
   {
    "id": "END.X01.elf.k0",
    "text": "其他四人已从支撑路线返回。门已关闭，但残留敌人、失货与修复尚待继续，各族未立即和解。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "确认现场结果，继续",
    "flags": []
   }
  ],
  "requires": [
   "C10.X07.elf"
  ],
  "optional": false
 },
 "END.E01.elf": {
  "id": "END.E01.elf",
  "sourceScene": "END.E01",
  "chapter": 10,
  "pov": "elf",
  "siteId": "elf.a01",
  "title": "莱姆斯 · 回去还有事",
  "npc": "村民与守林者",
  "lines": [
   "[泉边。村民提起水桶，守林者给旧裂口添上新支撑。]",
   "村民：你以后还回来吗？",
   "莱姆斯：会。下面还有要检查的地方。",
   "守林者：祭司的事呢？",
   "莱姆斯：我会把我看见的说清。先别替我取新的称呼。",
   "[莱姆斯把袖口挽起，俯身摸了摸旧裂口。泉水从他手边流过，他将松动的小石重新压稳，又沿水道往前走了一段。]"
  ],
  "objective": "回家，继续已开放的探索与支线。",
  "flags": [
   "EPILOGUE_COMPLETE"
  ],
  "knowledge": [
   {
    "id": "END.E01.elf.k0",
    "text": "门户已经关闭，各人的归路却还没有走完。你可以继续探索、清理残敌，或回去探望仍在等消息的人。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "确认现场结果，继续",
    "flags": []
   }
  ],
  "requires": [
   "END.X01.elf"
  ],
  "optional": false
 },
 "C09.A01.goblin": {
  "id": "C09.A01.goblin",
  "sourceScene": "C09.A01",
  "chapter": 9,
  "pov": "goblin",
  "siteId": "ashen.a04",
  "title": "变了的旧座",
  "npc": "莱姆斯与砾恩",
  "lines": [
   "[旧座上曾经灰暗的刻纹正在发光。外廊朝向与主祭坛记下的光路相合。砾恩把记录放到同一处折角旁。]",
   "砾恩：那时没亮。现在连这里也在动。",
   "莱姆斯：和主祭坛外延的纹路一致。",
   "砾恩：我的核心在这里升级过。却没看见下面这一层。",
   "[旧座下的威胁被清开后，你们沿着露出的石阶下探。四壁的光纹越过脚边，汇入通向远方的结构；每一次明灭，都与外面的门户遥相呼应。]",
   "砾恩：它在支撑外面的门。",
   "莱姆斯：先记清连接。动错地方，可能把自己困在这里。"
  ],
  "objective": "随砾恩返查古神庙；清除威胁，比对激活刻纹、连接与撤路。",
  "flags": [
   "R4_TEMPLE_CONFIRMED"
  ],
  "knowledge": [
   {
    "id": "C09.A01.goblin.k0",
    "text": "亲自随砾恩返查：旧座下的连接支撑中央门户，古神庙是第四处支撑祭坛，不是另一座中央祭坛。",
    "mode": "confirmed"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "确认现场结果，继续",
    "flags": []
   }
  ],
  "requires": [
   "C08.X05.goblin"
  ],
  "optional": false,
  "encounter": {
   "kind": "scenario",
   "scenarioId": "story.c09-a01-goblin",
   "nodeId": "ashen.a04.field",
   "count": 1
  }
 },
 "C09.X01.goblin": {
  "id": "C09.X01.goblin",
  "sourceScene": "C09.X01",
  "chapter": 9,
  "pov": "goblin",
  "siteId": "ashen.a04",
  "title": "留下的旧记录",
  "npc": "莱姆斯与砾恩",
  "lines": [
   "[剥落的石皮堆在脚边，旧字从灰下露出来。莱姆斯先抄下能辨认的几行，又把残缺处留空；砾恩站在旁边，一直没有催促。]",
   "[莱姆斯沿字迹慢慢读下去。听到熟悉的名字，砾恩抬起头，看向他刚抄好的那一行。]",
   "莱姆斯：这几行用的还是祭司旧制记法。我能辨出参与者。",
   "砾恩：人族国王。矮人王。还有他。",
   "莱姆斯：和他刚才说的一样。",
   "砾恩：我们从来不知道。",
   "莱姆斯：我也不知道他做过这些。",
   "砾恩：记下来。别再只留在他一个人嘴里。"
  ],
  "objective": "核对古代铭记与大祭司的供述，查明烬裔来历。",
  "flags": [
   "ASHEN_ORIGIN_CORROBORATED"
  ],
  "knowledge": [
   {
    "id": "C09.X01.goblin.k0",
    "text": "旧记录与主祭坛当场承认相互印证：古代人族国王、矮人王及这位大祭司共同创造烬裔以抵抗外界入侵。",
    "mode": "confirmed"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "确认现场结果，继续",
    "flags": []
   }
  ],
  "requires": [
   "C09.A01.goblin"
  ],
  "optional": false
 },
 "C09.X02.goblin": {
  "id": "C09.X02.goblin",
  "sourceScene": "C09.X02",
  "chapter": 9,
  "pov": "goblin",
  "siteId": "ashen.a06",
  "title": "各处传来的消息",
  "npc": "莱姆斯与砾恩",
  "lines": [
   "[送来的记录沾着不同地方的尘土。有的折在布里，有的只写在窄木片上；你们把它们按位置铺开，几条原本分散的光路渐渐接到了一起。]",
   "守林者口信：旧水道下面亮了。泉水还在，可那块石台一直震。我们已把人撤到外面。",
   "矿班长口信：矿道里那座旧台亮了。新露出的通道还能走，人已经退出来。",
   "递送者：这是矿班长封口前记的位置。布洛克叫我们留了撤退路。",
   "边境斥候口信：粮路旁的旧石室有光往外冒。我们只守外口，没有进去。",
   "奇克：侧面有个能爬出去的口子。我就是从那儿走的。",
   "[众人把送来的路线一一铺开，在图上接起断开的标记，圈出还能撤退的岔口。]",
   "砾恩：这边是第四处。它们都在给同一个地方送力。",
   "莱姆斯：中央那座还在开门。四处支撑要一起处理。"
  ],
  "objective": "比对各地送来的记录，确认四座支撑的位置和撤路。",
  "flags": [
   "FOUR_SUPPORTS_IDENTIFIED"
  ],
  "knowledge": [
   {
    "id": "C09.X02.goblin.k0",
    "text": "守林者、矿班长、边境斥候与砾恩的现场记录共同确认四座既存支撑：粮路石室、枯泉遗址、矿道遗址、古神庙；中央主祭坛另计。",
    "mode": "confirmed"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "确认现场结果，继续",
    "flags": []
   }
  ],
  "requires": [
   "C09.X01.goblin"
  ],
  "optional": false
 },
 "C09.X03.goblin": {
  "id": "C09.X03.goblin",
  "sourceScene": "C09.X03",
  "chapter": 9,
  "pov": "goblin",
  "siteId": "human.a03",
  "title": "把人联起来",
  "npc": "莱姆斯与砾恩",
  "lines": [
   "莱姆斯：布洛克认得罗什福尔。我留过联络的地方。",
   "砾恩：要等他们的军队？",
   "莱姆斯：先找他们本人。我们需要能到那四处的人。",
   "[布洛克回信确认收到，再联罗什福尔；罗什福尔通过已有联络找到奇克。]"
  ],
  "objective": "保护传信路线，送达位置与会合点并确认回信。",
  "flags": [
   "FIVE_HERO_CONTACTS_REACHED",
   "C09_COMPLETE"
  ],
  "knowledge": [
   {
    "id": "C09.X03.goblin.k0",
    "text": "传信路线已经打通。五人的回信陆续送到，会合地点、支撑位置与撤离方向都已核对。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "确认现场结果，继续",
    "flags": []
   }
  ],
  "requires": [
   "C09.X02.goblin"
  ],
  "optional": false,
  "encounter": {
   "kind": "scenario",
   "scenarioId": "story.c09-x03-goblin",
   "nodeId": "human.a03.field",
   "count": 1
  }
 },
 "C10.G01.goblin": {
  "id": "C10.G01.goblin",
  "sourceScene": "C10.G01",
  "chapter": 10,
  "pov": "goblin",
  "siteId": "goblin.a02",
  "title": "粮路没有了",
  "npc": "家人",
  "lines": [
   "[曾在 C05／C06 走通的路塌毁，换粮车被弃在路边。奇克找到空粮袋，没有找到能继续交易的人。]",
   "奇克：这条也断了。",
   "[回家。米芮没有把粮分成几小堆，只把袋口握在手里。]",
   "米芮：你还能再找到路吗？",
   "奇克：我先带你们走。",
   "咔洛：这次我能背东西。",
   "奇克：能。你背这个。跟着，不许跑前面。",
   "豆布：回来还住这里吗？",
   "[奇克看了一眼门。]",
   "奇克：先把今天过完。门我记得。"
  ],
  "objective": "护送米芮、咔洛、豆布穿过威胁，确认三人实际到达安全营地。",
  "flags": [
   "G_INVASION_RESISTED",
   "G_FAMILY_SAFE"
  ],
  "knowledge": [
   {
    "id": "C10.G01.goblin.k0",
    "text": "已穿过撤离路威胁，亲自确认米芮、咔洛、豆布三人实际到达安全营地。",
    "mode": "confirmed"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "确认米芮、咔洛、豆布全部到达安全营地",
    "flags": []
   }
  ],
  "requires": [
   "C09.X03.goblin"
  ],
  "optional": false,
  "encounter": {
   "kind": "scenario",
   "scenarioId": "story.c10-g01-goblin",
   "nodeId": "goblin.a02.field",
   "count": 1
  }
 },
 "C10.X01.goblin": {
  "id": "C10.X01.goblin",
  "sourceScene": "C10.X01",
  "chapter": 10,
  "pov": "goblin",
  "siteId": "human.a03",
  "title": "五张图放在一起",
  "npc": "五位主角",
  "lines": [
   "[地图铺好后，五人一时都没有说话。每个人带来的路都通向一个刚刚安置下来的地方；现在，他们要决定怎样让那些地方不再换一次逃路。]",
   "[布洛克先压住矿道图。罗什福尔把商路与城外路线放旁边。莱姆斯摊开水道记录。砾恩放下古神庙拓记。奇克没有坐，站在最近的出口边。]",
   "布洛克：这张是新露的路。别用旧矿图。",
   "罗什福尔：边境石室有两处出入口。我们清过外面。",
   "奇克：第二个口子不是给你这身铁走的。",
   "罗什福尔：所以你来讲。",
   "莱姆斯：泉下面这处已经亮了。中央停了施法，也没有停。",
   "砾恩：四处都连着它。神庙也是。",
   "布洛克：拆支撑，门才能关。",
   "莱姆斯：还得有人留在中央。那里的首领会挡住我们。",
   "奇克：四个地方，一个中间。正好没人闲着。",
   "砾恩：不是。是族长自己的核心。",
   "莱姆斯：王室那枚已经和砾恩结合。他没有追回，就另取了一枚。",
   "[布洛克报告已合拢的出库、运费与夺权军资证据。]",
   "布洛克：有人卖王室的东西，拿钱去炸自己人的矿。账还没完。",
   "罗什福尔：先关门。证人和账，我安排人继续护着。",
   "[莱姆斯把拓记推到众人面前，指向其中一行，说起祭坛前听到的话。]",
   "莱姆斯：古代和两族国王一起创造烬裔的人，就是这位大祭司。记录能对应。",
   "砾恩：这件事，活下来以后，我们自己也要查。",
   "奇克：查可以。先别让明天没人吃饭。",
   "[其他四人当面报告各自抵抗与撤离结果。奇克确认三个家人已到安全营地；布洛克与记录者署名的证据摘要留供查阅。]",
   "[各自报告：城门避难通路已清，矿工证人与账证已保全，泉边村民已撤离，奇克家人已到营地，烬裔伤者已通过内线。你把自己的经历接上，其余四人也逐一说明了各自留下的人手。]"
  ],
  "objective": "会合并交换各地撤离消息，核实支撑祭坛与核心的线索。",
  "flags": [
   "FIVE_HEROES_BRIEFED"
  ],
  "knowledge": [
   {
    "id": "C10.X01.goblin.k0",
    "text": "布洛克与记录者的账证、证词证实重臣盗卖王室遗物资助夺权。五人核实四座支撑、两枚不同核心与古代记录；并未因此使各族和解。",
    "mode": "confirmed"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "确认现场结果，继续",
    "flags": []
   }
  ],
  "requires": [
   "C10.G02.goblin"
  ],
  "optional": false
 },
 "C10.X03.goblin": {
  "id": "C10.X03.goblin",
  "sourceScene": "C10.X03",
  "chapter": 10,
  "pov": "goblin",
  "siteId": "human.a03",
  "title": "去中央的人",
  "npc": "五位主角",
  "lines": [
   "奇克：我留在最难跑的地方。你们可别把别人的活也留给我。",
   "[第1支撑 · 粮路石室：罗什福尔；地图、带路人与撤路已确认。]",
   "[第2支撑 · 枯泉遗址：莱姆斯；地图、带路人与撤路已确认。]",
   "[第3支撑 · 矿道遗址：布洛克；地图、带路人与撤路已确认。]",
   "[第4支撑 · 古神庙：砾恩；地图、带路人与撤路已确认。]",
   "[四位同伴各自收起地图，约好抵达入口后再相互报信。你要独自守住中央；动身之前，仍可返回补齐行装。]"
  ],
  "objective": "确认各自的路线与分工；出发前可返回整备。",
  "flags": [
   "FINAL_ROLES_ASSIGNED"
  ],
  "knowledge": [
   {
    "id": "C10.X03.goblin.k0",
    "text": "中央由奇克独自承担；第1支撑 · 粮路石室：罗什福尔；地图、带路人与撤路已确认。；第2支撑 · 枯泉遗址：莱姆斯；地图、带路人与撤路已确认。；第3支撑 · 矿道遗址：布洛克；地图、带路人与撤路已确认。；第4支撑 · 古神庙：砾恩；地图、带路人与撤路已确认。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "确认现场结果，继续",
    "flags": []
   }
  ],
  "requires": [
   "C10.X01.goblin"
  ],
  "optional": false
 },
 "C10.X04.goblin": {
  "id": "C10.X04.goblin",
  "sourceScene": "C10.X04",
  "chapter": 10,
  "pov": "goblin",
  "siteId": "ashen.a07",
  "title": "四条路的开头",
  "npc": "五位主角",
  "lines": [
   "罗什福尔：撤路的人先回。剩下这段我自己走。",
   "莱姆斯：把入口留空。有人退出来，别堵住。",
   "布洛克：下去以后少碰。标出来的地方才动手。",
   "砾恩：我会回到约定的地方。"
  ],
  "objective": "清出最后通道，保护递送撤路标记的人员。",
  "flags": [
   "FINAL_APPROACH_CLEARED",
   "SUPPORT_TEAMS_READY"
  ],
  "knowledge": [
   {
    "id": "C10.X04.goblin.k0",
    "text": "中央通路已清，其他四人确认到达各自支撑入口。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "确认现场结果，继续",
    "flags": []
   }
  ],
  "requires": [
   "C10.X03.goblin"
  ],
  "optional": false,
  "encounter": {
   "kind": "scenario",
   "scenarioId": "story.c10-x04-goblin",
   "nodeId": "ashen.a07.field",
   "count": 1
  }
 },
 "C10.X05.goblin": {
  "id": "C10.X05.goblin",
  "sourceScene": "C10.X05",
  "chapter": 10,
  "pov": "goblin",
  "siteId": "ashen.a07",
  "title": "门前的首领",
  "npc": "五位主角",
  "lines": [
   "[中央门户的光压得人几乎睁不开眼。四道纹路仍在向它输送力量，入侵首领挡在门前；身后的同伴已分赴各处，这一段只能由你守住。]",
   "[首领借着支撑的力量步步逼近。此刻要做的不是急于决胜，而是拖住它，为另外四条路争取时间。]"
  ],
  "objective": "独自牵制首领，完成六个战斗行动或提前打破防守，为同伴争取断开支撑的机会。",
  "flags": [
   "FINAL_BOSS_CHECKPOINT"
  ],
  "knowledge": [
   {
    "id": "C10.X05.goblin.k0",
    "text": "首领被迫退开，但四道支撑仍在向门户输送力量，战斗尚未结束。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "确认现场结果，继续",
    "flags": []
   }
  ],
  "requires": [
   "C10.X04.goblin"
  ],
  "optional": false,
  "encounter": {
   "kind": "scenario",
   "scenarioId": "story.c10-x05-goblin",
   "nodeId": "ashen.a07.field",
   "count": 1
  }
 },
 "C10.X061.goblin": {
  "id": "C10.X061.goblin",
  "sourceScene": "C10.X061",
  "chapter": 10,
  "pov": "goblin",
  "siteId": "ashen.a07",
  "title": "断开的支撑 · 1",
  "npc": "五位主角",
  "lines": [
   "[远景：罗什福尔按会合时确认的路线破坏支撑节点。]",
   "[中央可见：第一道纹路熄灭，首领失去额外伤害支撑。]",
   "[第一道光纹熄灭，门户边缘短暂地暗了一瞬。首领偏过头，你抓紧这片刻重新站稳。]"
  ],
  "objective": "观察中央光路的变化，继续守住首领。",
  "flags": [
   "SUPPORT_1_DOWN"
  ],
  "knowledge": [
   {
    "id": "C10.X061.goblin.k0",
    "text": "第一道纹路熄灭，首领失去额外伤害支撑。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "确认现场结果，继续",
    "flags": []
   }
  ],
  "requires": [
   "C10.X05.goblin"
  ],
  "optional": false
 },
 "C10.X062.goblin": {
  "id": "C10.X062.goblin",
  "sourceScene": "C10.X062",
  "chapter": 10,
  "pov": "goblin",
  "siteId": "ashen.a07",
  "title": "断开的支撑 · 2",
  "npc": "五位主角",
  "lines": [
   "[远景：莱姆斯按会合时确认的路线破坏支撑节点。]",
   "[中央可见：第二道纹路熄灭，水道仍完好，首领失去额外防护。]",
   "[第二道光纹暗下，脚边的震动弱了一层。你听见远处碎石落地，随后只剩首领逼近的脚步。]"
  ],
  "objective": "观察中央光路的变化，继续守住首领。",
  "flags": [
   "SUPPORT_2_DOWN"
  ],
  "knowledge": [
   {
    "id": "C10.X062.goblin.k0",
    "text": "第二道纹路熄灭，水道仍完好，首领失去额外防护。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "确认现场结果，继续",
    "flags": []
   }
  ],
  "requires": [
   "C10.X061.goblin"
  ],
  "optional": false
 },
 "C10.X063.goblin": {
  "id": "C10.X063.goblin",
  "sourceScene": "C10.X063",
  "chapter": 10,
  "pov": "goblin",
  "siteId": "ashen.a07",
  "title": "断开的支撑 · 3",
  "npc": "五位主角",
  "lines": [
   "[远景：布洛克按会合时确认的路线破坏支撑节点。]",
   "[中央可见：第三道纹路熄灭，首领失去恢复支撑；矿工已撤出，矿区未被炸塌。]",
   "[第三道光纹断开，门户上方的亮光开始摇晃。首领仍挡在面前，你没有让它离开中央。]"
  ],
  "objective": "观察中央光路的变化，继续守住首领。",
  "flags": [
   "SUPPORT_3_DOWN"
  ],
  "knowledge": [
   {
    "id": "C10.X063.goblin.k0",
    "text": "第三道纹路熄灭，首领失去恢复支撑；矿工已撤出，矿区未被炸塌。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "确认现场结果，继续",
    "flags": []
   }
  ],
  "requires": [
   "C10.X062.goblin"
  ],
  "optional": false
 },
 "C10.X064.goblin": {
  "id": "C10.X064.goblin",
  "sourceScene": "C10.X064",
  "chapter": 10,
  "pov": "goblin",
  "siteId": "ashen.a07",
  "title": "断开的支撑 · 4",
  "npc": "五位主角",
  "lines": [
   "[远景：砾恩按会合时确认的路线破坏支撑节点。]",
   "[最后一道纹路熄灭，门户在轰鸣中合拢，再没有援军跨出来。眼前的首领却仍站着，沉重的脚步压过碎石。]",
   "[最后一道光纹终于熄灭。压在中央的力量骤然退去，门户还未合拢，决胜的机会就在眼前。]"
  ],
  "objective": "观察中央光路的变化，继续守住首领。",
  "flags": [
   "SUPPORT_4_DOWN",
   "PORTAL_CLOSED"
  ],
  "knowledge": [
   {
    "id": "C10.X064.goblin.k0",
    "text": "第四道纹路熄灭，援军来源切断，门户关闭；砾恩的核心仍在，已入侵的首领仍须击败。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "确认现场结果，继续",
    "flags": []
   }
  ],
  "requires": [
   "C10.X063.goblin"
  ],
  "optional": false
 },
 "C10.X07.goblin": {
  "id": "C10.X07.goblin",
  "sourceScene": "C10.X07",
  "chapter": 10,
  "pov": "goblin",
  "siteId": "ashen.a07",
  "title": "门关以后",
  "npc": "五位主角",
  "lines": [
   "[门户闭合的风卷过中央，入侵首领已失去四处外部支撑。]",
   "[同伴们仍在四处祭坛。你握紧武器，独自迎向门前的首领；它身后的光路已经彻底暗下去了。]"
  ],
  "objective": "击败失去支撑、已经进入世界的入侵首领。",
  "flags": [
   "MAIN_STORY_CLEAR"
  ],
  "knowledge": [
   {
    "id": "C10.X07.goblin.k0",
    "text": "四座支撑全部断开，你击败了守在中央的入侵首领。门户终于关闭，但已经闯入各地的敌人仍需清理。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "确认现场结果，继续",
    "flags": []
   }
  ],
  "requires": [
   "C10.X064.goblin"
  ],
  "optional": false,
  "encounter": {
   "kind": "scenario",
   "scenarioId": "story.c10-x07-goblin",
   "nodeId": "ashen.a07.field",
   "count": 1
  }
 },
 "END.X01.goblin": {
  "id": "END.X01.goblin",
  "sourceScene": "END.X01",
  "chapter": 10,
  "pov": "goblin",
  "siteId": "human.a03",
  "title": "再见面",
  "npc": "五位主角",
  "lines": [
   "[你从中央退回约定处，背后的光已经暗了。四位同伴陆续沿各自的归路赶来，有人先看人数，有人仍握着卷起的地图。直到最后一人应声，大家才终于放下戒备。]",
   "布洛克：都回来了？",
   "罗什福尔：人齐。路上还得再清一遍。",
   "莱姆斯：门关了，已经进来的东西还在。",
   "砾恩：那就接着找。",
   "奇克：你们找。我得先回去一趟。",
   "罗什福尔：去吧。回来的路留着。",
   "[奇克停一下，点头离开。]"
  ],
  "objective": "与分赴四座祭坛的同伴会合，确认平安，并约定今后的联络。",
  "flags": [
   "FINAL_REUNION"
  ],
  "knowledge": [
   {
    "id": "END.X01.goblin.k0",
    "text": "其他四人已从支撑路线返回。门已关闭，但残留敌人、失货与修复尚待继续，各族未立即和解。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "确认现场结果，继续",
    "flags": []
   }
  ],
  "requires": [
   "C10.X07.goblin"
  ],
  "optional": false
 },
 "END.G01.goblin": {
  "id": "END.G01.goblin",
  "sourceScene": "END.G01",
  "chapter": 10,
  "pov": "goblin",
  "siteId": "goblin.a01",
  "title": "奇克 · 回去还有事",
  "npc": "家人",
  "lines": [
   "[安全营地分给一家人的临时住处。奇克推门，三个弟弟妹妹抬起头。米芮先看他的手有没有受伤。]",
   "豆布：今天能吃满吗？",
   "奇克：今天先给你盛。",
   "咔洛：下次能带我了吧？",
   "奇克：先把背带改短。你那条会绊死人。",
   "米芮：粮从哪儿来的？",
   "奇克：这回有人付我干活的钱。",
   "米芮：那明天也这么干？",
   "奇克：明天再看。先吃。"
  ],
  "objective": "回家，继续已开放的探索与支线。",
  "flags": [
   "EPILOGUE_COMPLETE"
  ],
  "knowledge": [
   {
    "id": "END.G01.goblin.k0",
    "text": "门户已经关闭，各人的归路却还没有走完。你可以继续探索、清理残敌，或回去探望仍在等消息的人。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "确认现场结果，继续",
    "flags": []
   }
  ],
  "requires": [
   "END.X01.goblin"
  ],
  "optional": false
 },
 "C09.A01.ashen": {
  "id": "C09.A01.ashen",
  "sourceScene": "C09.A01",
  "chapter": 9,
  "pov": "ashen",
  "siteId": "ashen.a04",
  "title": "变了的旧座",
  "npc": "莱姆斯与砾恩",
  "lines": [
   "[旧座上曾经灰暗的刻纹正在发光。外廊朝向与主祭坛记下的光路相合。砾恩把记录放到同一处折角旁。]",
   "砾恩：那时没亮。现在连这里也在动。",
   "莱姆斯：和主祭坛外延的纹路一致。",
   "砾恩：我的核心在这里升级过。却没看见下面这一层。",
   "[旧座下的威胁被清开后，你们沿着露出的石阶下探。四壁的光纹越过脚边，汇入通向远方的结构；每一次明灭，都与外面的门户遥相呼应。]",
   "砾恩：它在支撑外面的门。",
   "莱姆斯：先记清连接。动错地方，可能把自己困在这里。"
  ],
  "objective": "随砾恩返查古神庙；清除威胁，比对激活刻纹、连接与撤路。",
  "flags": [
   "R4_TEMPLE_CONFIRMED"
  ],
  "knowledge": [
   {
    "id": "C09.A01.ashen.k0",
    "text": "亲自随砾恩返查：旧座下的连接支撑中央门户，古神庙是第四处支撑祭坛，不是另一座中央祭坛。",
    "mode": "confirmed"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "确认现场结果，继续",
    "flags": []
   }
  ],
  "requires": [
   "C08.X05.ashen"
  ],
  "optional": false,
  "encounter": {
   "kind": "scenario",
   "scenarioId": "story.c09-a01-ashen",
   "nodeId": "ashen.a04.field",
   "count": 1
  }
 },
 "C09.X01.ashen": {
  "id": "C09.X01.ashen",
  "sourceScene": "C09.X01",
  "chapter": 9,
  "pov": "ashen",
  "siteId": "ashen.a04",
  "title": "留下的旧记录",
  "npc": "莱姆斯与砾恩",
  "lines": [
   "[剥落的石皮堆在脚边，旧字从灰下露出来。莱姆斯先抄下能辨认的几行，又把残缺处留空；砾恩站在旁边，一直没有催促。]",
   "[莱姆斯沿字迹慢慢读下去。听到熟悉的名字，砾恩抬起头，看向他刚抄好的那一行。]",
   "莱姆斯：这几行用的还是祭司旧制记法。我能辨出参与者。",
   "砾恩：人族国王。矮人王。还有他。",
   "莱姆斯：和他刚才说的一样。",
   "砾恩：我们从来不知道。",
   "莱姆斯：我也不知道他做过这些。",
   "砾恩：记下来。别再只留在他一个人嘴里。"
  ],
  "objective": "核对古代铭记与大祭司的供述，查明烬裔来历。",
  "flags": [
   "ASHEN_ORIGIN_CORROBORATED"
  ],
  "knowledge": [
   {
    "id": "C09.X01.ashen.k0",
    "text": "旧记录与主祭坛当场承认相互印证：古代人族国王、矮人王及这位大祭司共同创造烬裔以抵抗外界入侵。",
    "mode": "confirmed"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "确认现场结果，继续",
    "flags": []
   }
  ],
  "requires": [
   "C09.A01.ashen"
  ],
  "optional": false
 },
 "C09.X02.ashen": {
  "id": "C09.X02.ashen",
  "sourceScene": "C09.X02",
  "chapter": 9,
  "pov": "ashen",
  "siteId": "ashen.a06",
  "title": "各处传来的消息",
  "npc": "莱姆斯与砾恩",
  "lines": [
   "[送来的记录沾着不同地方的尘土。有的折在布里，有的只写在窄木片上；你们把它们按位置铺开，几条原本分散的光路渐渐接到了一起。]",
   "守林者口信：旧水道下面亮了。泉水还在，可那块石台一直震。我们已把人撤到外面。",
   "矿班长口信：矿道里那座旧台亮了。新露出的通道还能走，人已经退出来。",
   "递送者：这是矿班长封口前记的位置。布洛克叫我们留了撤退路。",
   "边境斥候口信：粮路旁的旧石室有光往外冒。我们只守外口，没有进去。",
   "[众人把送来的路线一一铺开，在图上接起断开的标记，圈出还能撤退的岔口。]",
   "砾恩：这边是第四处。它们都在给同一个地方送力。",
   "莱姆斯：中央那座还在开门。四处支撑要一起处理。"
  ],
  "objective": "比对各地送来的记录，确认四座支撑的位置和撤路。",
  "flags": [
   "FOUR_SUPPORTS_IDENTIFIED"
  ],
  "knowledge": [
   {
    "id": "C09.X02.ashen.k0",
    "text": "守林者、矿班长、边境斥候与砾恩的现场记录共同确认四座既存支撑：粮路石室、枯泉遗址、矿道遗址、古神庙；中央主祭坛另计。",
    "mode": "confirmed"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "确认现场结果，继续",
    "flags": []
   }
  ],
  "requires": [
   "C09.X01.ashen"
  ],
  "optional": false
 },
 "C09.X03.ashen": {
  "id": "C09.X03.ashen",
  "sourceScene": "C09.X03",
  "chapter": 9,
  "pov": "ashen",
  "siteId": "human.a03",
  "title": "把人联起来",
  "npc": "莱姆斯与砾恩",
  "lines": [
   "莱姆斯：布洛克认得罗什福尔。我留过联络的地方。",
   "砾恩：要等他们的军队？",
   "莱姆斯：先找他们本人。我们需要能到那四处的人。",
   "[布洛克回信确认收到，再联罗什福尔；罗什福尔通过已有联络找到奇克。]"
  ],
  "objective": "保护传信路线，送达位置与会合点并确认回信。",
  "flags": [
   "FIVE_HERO_CONTACTS_REACHED",
   "C09_COMPLETE"
  ],
  "knowledge": [
   {
    "id": "C09.X03.ashen.k0",
    "text": "传信路线已经打通。五人的回信陆续送到，会合地点、支撑位置与撤离方向都已核对。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "确认现场结果，继续",
    "flags": []
   }
  ],
  "requires": [
   "C09.X02.ashen"
  ],
  "optional": false,
  "encounter": {
   "kind": "scenario",
   "scenarioId": "story.c09-x03-ashen",
   "nodeId": "human.a03.field",
   "count": 1
  }
 },
 "C10.A01.ashen": {
  "id": "C10.A01.ashen",
  "sourceScene": "C10.A01",
  "chapter": 10,
  "pov": "ashen",
  "siteId": "ashen.a02",
  "title": "没有族长的哨口",
  "npc": "哨卫与修护者",
  "lines": [
   "哨卫：族长没回来。谁下命令？",
   "砾恩：先让伤的人过来。",
   "哨卫：外头还守吗？",
   "砾恩：守能让他们退的地方。别守空地。",
   "修护者：你也得回来。",
   "砾恩：我还要去把门关上。",
   "砾恩：我找到了一些旧记录。我们不是一直以为的那样。",
   "修护者：等人都回来，再一起看。",
   "砾恩：好。"
  ],
  "objective": "打通伤者撤离路，击退封住出口的入侵者。",
  "flags": [
   "A_INVASION_RESISTED"
  ],
  "knowledge": [
   {
    "id": "C10.A01.ashen.k0",
    "text": "堵住出口的入侵者已被击退，伤者穿过内线撤离。砾恩把接应交给哨卫，继续赶往中央。",
    "mode": "confirmed"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "确认现场结果，继续",
    "flags": []
   }
  ],
  "requires": [
   "C09.X03.ashen"
  ],
  "optional": false,
  "encounter": {
   "kind": "scenario",
   "scenarioId": "story.c10-a01-ashen",
   "nodeId": "ashen.a02.field",
   "count": 1
  }
 },
 "C10.X01.ashen": {
  "id": "C10.X01.ashen",
  "sourceScene": "C10.X01",
  "chapter": 10,
  "pov": "ashen",
  "siteId": "human.a03",
  "title": "五张图放在一起",
  "npc": "五位主角",
  "lines": [
   "[地图铺好后，五人一时都没有说话。每个人带来的路都通向一个刚刚安置下来的地方；现在，他们要决定怎样让那些地方不再换一次逃路。]",
   "[布洛克先压住矿道图。罗什福尔把商路与城外路线放旁边。莱姆斯摊开水道记录。砾恩放下古神庙拓记。奇克没有坐，站在最近的出口边。]",
   "布洛克：这张是新露的路。别用旧矿图。",
   "罗什福尔：边境石室有两处出入口。我们清过外面。",
   "奇克：第二个口子不是给你这身铁走的。",
   "罗什福尔：所以你来讲。",
   "莱姆斯：泉下面这处已经亮了。中央停了施法，也没有停。",
   "砾恩：四处都连着它。神庙也是。",
   "布洛克：拆支撑，门才能关。",
   "莱姆斯：还得有人留在中央。那里的首领会挡住我们。",
   "奇克：四个地方，一个中间。正好没人闲着。",
   "砾恩：不是。是族长自己的核心。",
   "莱姆斯：王室那枚已经和砾恩结合。他没有追回，就另取了一枚。",
   "[布洛克报告已合拢的出库、运费与夺权军资证据。]",
   "布洛克：有人卖王室的东西，拿钱去炸自己人的矿。账还没完。",
   "罗什福尔：先关门。证人和账，我安排人继续护着。",
   "[莱姆斯把拓记推到众人面前，指向其中一行，说起祭坛前听到的话。]",
   "莱姆斯：古代和两族国王一起创造烬裔的人，就是这位大祭司。记录能对应。",
   "砾恩：这件事，活下来以后，我们自己也要查。",
   "奇克：查可以。先别让明天没人吃饭。",
   "[其他四人当面报告各自抵抗与撤离结果。奇克确认三个家人已到安全营地；布洛克与记录者署名的证据摘要留供查阅。]",
   "[各自报告：城门避难通路已清，矿工证人与账证已保全，泉边村民已撤离，奇克家人已到营地，烬裔伤者已通过内线。你把自己的经历接上，其余四人也逐一说明了各自留下的人手。]"
  ],
  "objective": "会合并交换各地撤离消息，核实支撑祭坛与核心的线索。",
  "flags": [
   "FIVE_HEROES_BRIEFED"
  ],
  "knowledge": [
   {
    "id": "C10.X01.ashen.k0",
    "text": "布洛克与记录者的账证、证词证实重臣盗卖王室遗物资助夺权。五人核实四座支撑、两枚不同核心与古代记录；并未因此使各族和解。",
    "mode": "confirmed"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "确认现场结果，继续",
    "flags": []
   }
  ],
  "requires": [
   "C10.A01.ashen"
  ],
  "optional": false
 },
 "C10.X03.ashen": {
  "id": "C10.X03.ashen",
  "sourceScene": "C10.X03",
  "chapter": 10,
  "pov": "ashen",
  "siteId": "human.a03",
  "title": "去中央的人",
  "npc": "五位主角",
  "lines": [
   "砾恩：中央我去。你们关门。",
   "[第1支撑 · 粮路石室：奇克；地图、带路人与撤路已确认。]",
   "[第2支撑 · 枯泉遗址：莱姆斯；地图、带路人与撤路已确认。]",
   "[第3支撑 · 矿道遗址：布洛克；地图、带路人与撤路已确认。]",
   "[第4支撑 · 古神庙：罗什福尔；地图、带路人与撤路已确认。]",
   "[四位同伴各自收起地图，约好抵达入口后再相互报信。你要独自守住中央；动身之前，仍可返回补齐行装。]"
  ],
  "objective": "确认各自的路线与分工；出发前可返回整备。",
  "flags": [
   "FINAL_ROLES_ASSIGNED"
  ],
  "knowledge": [
   {
    "id": "C10.X03.ashen.k0",
    "text": "中央由砾恩独自承担；第1支撑 · 粮路石室：奇克；地图、带路人与撤路已确认。；第2支撑 · 枯泉遗址：莱姆斯；地图、带路人与撤路已确认。；第3支撑 · 矿道遗址：布洛克；地图、带路人与撤路已确认。；第4支撑 · 古神庙：罗什福尔；地图、带路人与撤路已确认。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "确认现场结果，继续",
    "flags": []
   }
  ],
  "requires": [
   "C10.X01.ashen"
  ],
  "optional": false
 },
 "C10.X04.ashen": {
  "id": "C10.X04.ashen",
  "sourceScene": "C10.X04",
  "chapter": 10,
  "pov": "ashen",
  "siteId": "ashen.a07",
  "title": "四条路的开头",
  "npc": "五位主角",
  "lines": [
   "奇克：我认路。不代表我喜欢这条路。",
   "莱姆斯：把入口留空。有人退出来，别堵住。",
   "布洛克：下去以后少碰。标出来的地方才动手。",
   "罗什福尔：撤路的人先回。剩下这段我自己走。"
  ],
  "objective": "清出最后通道，保护递送撤路标记的人员。",
  "flags": [
   "FINAL_APPROACH_CLEARED",
   "SUPPORT_TEAMS_READY"
  ],
  "knowledge": [
   {
    "id": "C10.X04.ashen.k0",
    "text": "中央通路已清，其他四人确认到达各自支撑入口。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "确认现场结果，继续",
    "flags": []
   }
  ],
  "requires": [
   "C10.X03.ashen"
  ],
  "optional": false,
  "encounter": {
   "kind": "scenario",
   "scenarioId": "story.c10-x04-ashen",
   "nodeId": "ashen.a07.field",
   "count": 1
  }
 },
 "C10.X05.ashen": {
  "id": "C10.X05.ashen",
  "sourceScene": "C10.X05",
  "chapter": 10,
  "pov": "ashen",
  "siteId": "ashen.a07",
  "title": "门前的首领",
  "npc": "五位主角",
  "lines": [
   "[中央门户的光压得人几乎睁不开眼。四道纹路仍在向它输送力量，入侵首领挡在门前；身后的同伴已分赴各处，这一段只能由你守住。]",
   "[首领借着支撑的力量步步逼近。此刻要做的不是急于决胜，而是拖住它，为另外四条路争取时间。]"
  ],
  "objective": "独自牵制首领，完成六个战斗行动或提前打破防守，为同伴争取断开支撑的机会。",
  "flags": [
   "FINAL_BOSS_CHECKPOINT"
  ],
  "knowledge": [
   {
    "id": "C10.X05.ashen.k0",
    "text": "首领被迫退开，但四道支撑仍在向门户输送力量，战斗尚未结束。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "确认现场结果，继续",
    "flags": []
   }
  ],
  "requires": [
   "C10.X04.ashen"
  ],
  "optional": false,
  "encounter": {
   "kind": "scenario",
   "scenarioId": "story.c10-x05-ashen",
   "nodeId": "ashen.a07.field",
   "count": 1
  }
 },
 "C10.X061.ashen": {
  "id": "C10.X061.ashen",
  "sourceScene": "C10.X061",
  "chapter": 10,
  "pov": "ashen",
  "siteId": "ashen.a07",
  "title": "断开的支撑 · 1",
  "npc": "五位主角",
  "lines": [
   "[远景：奇克按会合时确认的路线破坏支撑节点。]",
   "[中央可见：第一道纹路熄灭，首领失去额外伤害支撑。]",
   "[第一道光纹熄灭，门户边缘短暂地暗了一瞬。首领偏过头，你抓紧这片刻重新站稳。]"
  ],
  "objective": "观察中央光路的变化，继续守住首领。",
  "flags": [
   "SUPPORT_1_DOWN"
  ],
  "knowledge": [
   {
    "id": "C10.X061.ashen.k0",
    "text": "第一道纹路熄灭，首领失去额外伤害支撑。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "确认现场结果，继续",
    "flags": []
   }
  ],
  "requires": [
   "C10.X05.ashen"
  ],
  "optional": false
 },
 "C10.X062.ashen": {
  "id": "C10.X062.ashen",
  "sourceScene": "C10.X062",
  "chapter": 10,
  "pov": "ashen",
  "siteId": "ashen.a07",
  "title": "断开的支撑 · 2",
  "npc": "五位主角",
  "lines": [
   "[远景：莱姆斯按会合时确认的路线破坏支撑节点。]",
   "[中央可见：第二道纹路熄灭，水道仍完好，首领失去额外防护。]",
   "[第二道光纹暗下，脚边的震动弱了一层。你听见远处碎石落地，随后只剩首领逼近的脚步。]"
  ],
  "objective": "观察中央光路的变化，继续守住首领。",
  "flags": [
   "SUPPORT_2_DOWN"
  ],
  "knowledge": [
   {
    "id": "C10.X062.ashen.k0",
    "text": "第二道纹路熄灭，水道仍完好，首领失去额外防护。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "确认现场结果，继续",
    "flags": []
   }
  ],
  "requires": [
   "C10.X061.ashen"
  ],
  "optional": false
 },
 "C10.X063.ashen": {
  "id": "C10.X063.ashen",
  "sourceScene": "C10.X063",
  "chapter": 10,
  "pov": "ashen",
  "siteId": "ashen.a07",
  "title": "断开的支撑 · 3",
  "npc": "五位主角",
  "lines": [
   "[远景：布洛克按会合时确认的路线破坏支撑节点。]",
   "[中央可见：第三道纹路熄灭，首领失去恢复支撑；矿工已撤出，矿区未被炸塌。]",
   "[第三道光纹断开，门户上方的亮光开始摇晃。首领仍挡在面前，你没有让它离开中央。]"
  ],
  "objective": "观察中央光路的变化，继续守住首领。",
  "flags": [
   "SUPPORT_3_DOWN"
  ],
  "knowledge": [
   {
    "id": "C10.X063.ashen.k0",
    "text": "第三道纹路熄灭，首领失去恢复支撑；矿工已撤出，矿区未被炸塌。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "确认现场结果，继续",
    "flags": []
   }
  ],
  "requires": [
   "C10.X062.ashen"
  ],
  "optional": false
 },
 "C10.X064.ashen": {
  "id": "C10.X064.ashen",
  "sourceScene": "C10.X064",
  "chapter": 10,
  "pov": "ashen",
  "siteId": "ashen.a07",
  "title": "断开的支撑 · 4",
  "npc": "五位主角",
  "lines": [
   "[远景：罗什福尔按会合时确认的路线破坏支撑节点。]",
   "[最后一道纹路熄灭，门户在轰鸣中合拢，再没有援军跨出来。眼前的首领却仍站着，沉重的脚步压过碎石。]",
   "[最后一道光纹终于熄灭。压在中央的力量骤然退去，门户还未合拢，决胜的机会就在眼前。]"
  ],
  "objective": "观察中央光路的变化，继续守住首领。",
  "flags": [
   "SUPPORT_4_DOWN",
   "PORTAL_CLOSED"
  ],
  "knowledge": [
   {
    "id": "C10.X064.ashen.k0",
    "text": "第四道纹路熄灭，援军来源切断，门户关闭；砾恩的核心仍在，已入侵的首领仍须击败。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "确认现场结果，继续",
    "flags": []
   }
  ],
  "requires": [
   "C10.X063.ashen"
  ],
  "optional": false
 },
 "C10.X07.ashen": {
  "id": "C10.X07.ashen",
  "sourceScene": "C10.X07",
  "chapter": 10,
  "pov": "ashen",
  "siteId": "ashen.a07",
  "title": "门关以后",
  "npc": "五位主角",
  "lines": [
   "[门户闭合的风卷过中央，入侵首领已失去四处外部支撑。]",
   "[同伴们仍在四处祭坛。你握紧武器，独自迎向门前的首领；它身后的光路已经彻底暗下去了。]"
  ],
  "objective": "击败失去支撑、已经进入世界的入侵首领。",
  "flags": [
   "MAIN_STORY_CLEAR"
  ],
  "knowledge": [
   {
    "id": "C10.X07.ashen.k0",
    "text": "四座支撑全部断开，你击败了守在中央的入侵首领。门户终于关闭，但已经闯入各地的敌人仍需清理。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "确认现场结果，继续",
    "flags": []
   }
  ],
  "requires": [
   "C10.X064.ashen"
  ],
  "optional": false,
  "encounter": {
   "kind": "scenario",
   "scenarioId": "story.c10-x07-ashen",
   "nodeId": "ashen.a07.field",
   "count": 1
  }
 },
 "END.X01.ashen": {
  "id": "END.X01.ashen",
  "sourceScene": "END.X01",
  "chapter": 10,
  "pov": "ashen",
  "siteId": "human.a03",
  "title": "再见面",
  "npc": "五位主角",
  "lines": [
   "[你从中央退回约定处，背后的光已经暗了。四位同伴陆续沿各自的归路赶来，有人先看人数，有人仍握着卷起的地图。直到最后一人应声，大家才终于放下戒备。]",
   "布洛克：都回来了？",
   "罗什福尔：人齐。路上还得再清一遍。",
   "莱姆斯：门关了，已经进来的东西还在。",
   "砾恩：那就接着找。",
   "奇克：你们找。我得先回去一趟。",
   "罗什福尔：去吧。回来的路留着。",
   "[奇克停一下，点头离开。]"
  ],
  "objective": "与分赴四座祭坛的同伴会合，确认平安，并约定今后的联络。",
  "flags": [
   "FINAL_REUNION"
  ],
  "knowledge": [
   {
    "id": "END.X01.ashen.k0",
    "text": "其他四人已从支撑路线返回。门已关闭，但残留敌人、失货与修复尚待继续，各族未立即和解。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "确认现场结果，继续",
    "flags": []
   }
  ],
  "requires": [
   "C10.X07.ashen"
  ],
  "optional": false
 },
 "END.A01.ashen": {
  "id": "END.A01.ashen",
  "sourceScene": "END.A01",
  "chapter": 10,
  "pov": "ashen",
  "siteId": "ashen.a01",
  "title": "砾恩 · 回去还有事",
  "npc": "哨卫与修护者",
  "lines": [
   "[烬裔幸存者围着带回的记录。族长留下的位置仍空着。砾恩把拓记摊平。]",
   "修护者：这是我们的来历？",
   "砾恩：是我们找到的部分。还有别的，要再查。",
   "哨卫：那以后怎么办？",
   "砾恩：先让外面的人回来。然后一起看。",
   "[砾恩走到哨口，停下，等后面的人跟上。]"
  ],
  "objective": "回家，继续已开放的探索与支线。",
  "flags": [
   "EPILOGUE_COMPLETE"
  ],
  "knowledge": [
   {
    "id": "END.A01.ashen.k0",
    "text": "门户已经关闭，各人的归路却还没有走完。你可以继续探索、清理残敌，或回去探望仍在等消息的人。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "确认现场结果，继续",
    "flags": []
   }
  ],
  "requires": [
   "END.X01.ashen"
  ],
  "optional": false
 },
 "C10.G02.goblin": {
  "id": "C10.G02.goblin",
  "sourceScene": "C10.G01",
  "chapter": 10,
  "pov": "goblin",
  "siteId": "goblin.a02",
  "title": "安全营地的口信",
  "npc": "家人",
  "lines": [
   "[米芮、咔洛、豆布三人已经到达安全营地。会合口信送来。]",
   "米芮：你又要出去？",
   "奇克：再换路没用了。得让外面那些东西别再进来。",
   "咔洛：我跟你。",
   "奇克：你在这儿看住他们。这回我真得借别人的手了。"
  ],
  "objective": "确认家人留下，赴五人会合。",
  "flags": [],
  "knowledge": [],
  "choices": [
   {
    "id": "proceed",
    "label": "收到口信，前往会合",
    "flags": []
   }
  ],
  "requires": [
   "C10.G01.goblin"
  ],
  "optional": false
 },
 "END.VISIT.dwarf.human": {
  "id": "END.VISIT.dwarf.human",
  "sourceScene": "END.VISIT.dwarf",
  "chapter": 10,
  "pov": "human",
  "siteId": "dwarf.a01",
  "title": "再访布洛克",
  "npc": "布洛克",
  "lines": [
   "[布洛克从支架下直起身，把手上的木屑拍掉。听见你的脚步，他先看一眼来路，才把工具搁下。]",
   "布洛克：路上还顺？我这边还差几根撑木。",
   "布洛克：账都收好了，该问的人也得接着问。门关上了，不等于之前的账就能抹掉。",
   "布洛克：下回来，先在矿口喊一声。别自己往刚修的那段钻。"
  ],
  "objective": "听听同伴的近况，问清下次可以在哪里找到彼此。",
  "flags": [],
  "knowledge": [
   {
    "id": "END.VISIT.dwarf.human.k0",
    "text": "布洛克把账证妥善留下，重臣案仍在追查。矿道的支架也要一段段检查，他暂时还走不开。",
    "mode": "heard"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "记下近况，继续旅程",
    "flags": []
   }
  ],
  "requires": [
   "END.H01.human"
  ],
  "optional": true
 },
 "END.VISIT.elf.human": {
  "id": "END.VISIT.elf.human",
  "sourceScene": "END.VISIT.elf",
  "chapter": 10,
  "pov": "human",
  "siteId": "elf.a01",
  "title": "再访莱姆斯",
  "npc": "莱姆斯",
  "lines": [
   "[莱姆斯蹲在泉边，指尖沾着检查石缝留下的湿泥。他看见你，挪开旁边的记录册，腾出一处能坐的位置。]",
   "莱姆斯：水还在流。每次来，我总要先听一会儿。",
   "莱姆斯：关于那个人，关于我们看到的那些事，我会慢慢说清。有人不愿听，也不能因此不说。",
   "莱姆斯：要找我，就沿水道来。眼下这里更需要人。"
  ],
  "objective": "听听同伴的近况，问清下次可以在哪里找到彼此。",
  "flags": [],
  "knowledge": [
   {
    "id": "END.VISIT.elf.human.k0",
    "text": "莱姆斯仍在检查泉水和旧裂口，也准备把亲眼见到的事情告诉愿意听的人。祭司的高位暂且空着，他先把眼前的水道看好。",
    "mode": "heard"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "记下近况，继续旅程",
    "flags": []
   }
  ],
  "requires": [
   "END.H01.human"
  ],
  "optional": true
 },
 "END.VISIT.goblin.human": {
  "id": "END.VISIT.goblin.human",
  "sourceScene": "END.VISIT.goblin",
  "chapter": 10,
  "pov": "human",
  "siteId": "goblin.a01",
  "title": "再访奇克",
  "npc": "奇克",
  "lines": [
   "[奇克正把行囊里剩下的东西一件件倒出来。家人催他吃饭，他抬头看见你，便把门边那只碗往里推了推。]",
   "奇克：来得巧。再晚一点，他们就当我把你的那份也吃了。",
   "奇克：明天还得找换粮的路。今天先坐下，路不会因为咱们吃顿饭就长腿跑了。",
   "奇克：下次别只带坏消息来。没事也能敲门。"
  ],
  "objective": "听听同伴的近况，问清下次可以在哪里找到彼此。",
  "flags": [],
  "knowledge": [
   {
    "id": "END.VISIT.goblin.human.k0",
    "text": "奇克已回到三个家人所在的安全营地。今天先吃饭，明天的换粮路仍要寻找。",
    "mode": "heard"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "记下近况，继续旅程",
    "flags": []
   }
  ],
  "requires": [
   "END.H01.human"
  ],
  "optional": true
 },
 "END.VISIT.ashen.human": {
  "id": "END.VISIT.ashen.human",
  "sourceScene": "END.VISIT.ashen",
  "chapter": 10,
  "pov": "human",
  "siteId": "ashen.a01",
  "title": "再访砾恩",
  "npc": "砾恩",
  "lines": [
   "[砾恩把几张拓记铺在石面上，空处压着小石。他没有独自读下去，而是把仍认不清的地方留给后来的人一起看。]",
   "砾恩：他们问了很多。我能回答的，还不够。",
   "砾恩：族长的位置空着。我们的来历也缺了许多页。先把找到的放在这里，谁记得什么，就来添。",
   "砾恩：你若听到别的，带回来。我们一起辨。"
  ],
  "objective": "听听同伴的近况，问清下次可以在哪里找到彼此。",
  "flags": [],
  "knowledge": [
   {
    "id": "END.VISIT.ashen.human.k0",
    "text": "砾恩把找到的部分来历记录交给幸存者一起看；族长的位置仍空着，后续由他们共同查明与决定。",
    "mode": "heard"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "记下近况，继续旅程",
    "flags": []
   }
  ],
  "requires": [
   "END.H01.human"
  ],
  "optional": true
 },
 "END.VISIT.human.dwarf": {
  "id": "END.VISIT.human.dwarf",
  "sourceScene": "END.VISIT.human",
  "chapter": 10,
  "pov": "dwarf",
  "siteId": "human.a01",
  "title": "再访罗什福尔",
  "npc": "罗什福尔",
  "lines": [
   "[罗什福尔刚核完一批交接记录，护手还放在桌边。他听见你到来，把未写完的那页压好，起身迎了两步。]",
   "罗什福尔：回来的路上，可还有车队受阻？",
   "罗什福尔：城门能开了，路上的人却还没都回家。我得把接应一段段安排下去。",
   "罗什福尔：有事仍让人捎信。不是只有打仗时，才能互相借一只手。"
  ],
  "objective": "听听同伴的近况，问清下次可以在哪里找到彼此。",
  "flags": [],
  "knowledge": [
   {
    "id": "END.VISIT.human.dwarf.k0",
    "text": "罗什福尔仍按原货单追查余货与没回家的人。关闭门户没有让商队损失归零。",
    "mode": "heard"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "记下近况，继续旅程",
    "flags": []
   }
  ],
  "requires": [
   "END.D01.dwarf"
  ],
  "optional": true
 },
 "END.VISIT.elf.dwarf": {
  "id": "END.VISIT.elf.dwarf",
  "sourceScene": "END.VISIT.elf",
  "chapter": 10,
  "pov": "dwarf",
  "siteId": "elf.a01",
  "title": "再访莱姆斯",
  "npc": "莱姆斯",
  "lines": [
   "[莱姆斯蹲在泉边，指尖沾着检查石缝留下的湿泥。他看见你，挪开旁边的记录册，腾出一处能坐的位置。]",
   "莱姆斯：水还在流。每次来，我总要先听一会儿。",
   "莱姆斯：关于那个人，关于我们看到的那些事，我会慢慢说清。有人不愿听，也不能因此不说。",
   "莱姆斯：要找我，就沿水道来。眼下这里更需要人。"
  ],
  "objective": "听听同伴的近况，问清下次可以在哪里找到彼此。",
  "flags": [],
  "knowledge": [
   {
    "id": "END.VISIT.elf.dwarf.k0",
    "text": "莱姆斯仍在检查泉水和旧裂口，也准备把亲眼见到的事情告诉愿意听的人。祭司的高位暂且空着，他先把眼前的水道看好。",
    "mode": "heard"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "记下近况，继续旅程",
    "flags": []
   }
  ],
  "requires": [
   "END.D01.dwarf"
  ],
  "optional": true
 },
 "END.VISIT.goblin.dwarf": {
  "id": "END.VISIT.goblin.dwarf",
  "sourceScene": "END.VISIT.goblin",
  "chapter": 10,
  "pov": "dwarf",
  "siteId": "goblin.a01",
  "title": "再访奇克",
  "npc": "奇克",
  "lines": [
   "[奇克正把行囊里剩下的东西一件件倒出来。家人催他吃饭，他抬头看见你，便把门边那只碗往里推了推。]",
   "奇克：来得巧。再晚一点，他们就当我把你的那份也吃了。",
   "奇克：明天还得找换粮的路。今天先坐下，路不会因为咱们吃顿饭就长腿跑了。",
   "奇克：下次别只带坏消息来。没事也能敲门。"
  ],
  "objective": "听听同伴的近况，问清下次可以在哪里找到彼此。",
  "flags": [],
  "knowledge": [
   {
    "id": "END.VISIT.goblin.dwarf.k0",
    "text": "奇克已回到三个家人所在的安全营地。今天先吃饭，明天的换粮路仍要寻找。",
    "mode": "heard"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "记下近况，继续旅程",
    "flags": []
   }
  ],
  "requires": [
   "END.D01.dwarf"
  ],
  "optional": true
 },
 "END.VISIT.ashen.dwarf": {
  "id": "END.VISIT.ashen.dwarf",
  "sourceScene": "END.VISIT.ashen",
  "chapter": 10,
  "pov": "dwarf",
  "siteId": "ashen.a01",
  "title": "再访砾恩",
  "npc": "砾恩",
  "lines": [
   "[砾恩把几张拓记铺在石面上，空处压着小石。他没有独自读下去，而是把仍认不清的地方留给后来的人一起看。]",
   "砾恩：他们问了很多。我能回答的，还不够。",
   "砾恩：族长的位置空着。我们的来历也缺了许多页。先把找到的放在这里，谁记得什么，就来添。",
   "砾恩：你若听到别的，带回来。我们一起辨。"
  ],
  "objective": "听听同伴的近况，问清下次可以在哪里找到彼此。",
  "flags": [],
  "knowledge": [
   {
    "id": "END.VISIT.ashen.dwarf.k0",
    "text": "砾恩把找到的部分来历记录交给幸存者一起看；族长的位置仍空着，后续由他们共同查明与决定。",
    "mode": "heard"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "记下近况，继续旅程",
    "flags": []
   }
  ],
  "requires": [
   "END.D01.dwarf"
  ],
  "optional": true
 },
 "END.VISIT.human.elf": {
  "id": "END.VISIT.human.elf",
  "sourceScene": "END.VISIT.human",
  "chapter": 10,
  "pov": "elf",
  "siteId": "human.a01",
  "title": "再访罗什福尔",
  "npc": "罗什福尔",
  "lines": [
   "[罗什福尔刚核完一批交接记录，护手还放在桌边。他听见你到来，把未写完的那页压好，起身迎了两步。]",
   "罗什福尔：回来的路上，可还有车队受阻？",
   "罗什福尔：城门能开了，路上的人却还没都回家。我得把接应一段段安排下去。",
   "罗什福尔：有事仍让人捎信。不是只有打仗时，才能互相借一只手。"
  ],
  "objective": "听听同伴的近况，问清下次可以在哪里找到彼此。",
  "flags": [],
  "knowledge": [
   {
    "id": "END.VISIT.human.elf.k0",
    "text": "罗什福尔仍按原货单追查余货与没回家的人。关闭门户没有让商队损失归零。",
    "mode": "heard"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "记下近况，继续旅程",
    "flags": []
   }
  ],
  "requires": [
   "END.E01.elf"
  ],
  "optional": true
 },
 "END.VISIT.dwarf.elf": {
  "id": "END.VISIT.dwarf.elf",
  "sourceScene": "END.VISIT.dwarf",
  "chapter": 10,
  "pov": "elf",
  "siteId": "dwarf.a01",
  "title": "再访布洛克",
  "npc": "布洛克",
  "lines": [
   "[布洛克从支架下直起身，把手上的木屑拍掉。听见你的脚步，他先看一眼来路，才把工具搁下。]",
   "布洛克：路上还顺？我这边还差几根撑木。",
   "布洛克：账都收好了，该问的人也得接着问。门关上了，不等于之前的账就能抹掉。",
   "布洛克：下回来，先在矿口喊一声。别自己往刚修的那段钻。"
  ],
  "objective": "听听同伴的近况，问清下次可以在哪里找到彼此。",
  "flags": [],
  "knowledge": [
   {
    "id": "END.VISIT.dwarf.elf.k0",
    "text": "布洛克把账证妥善留下，重臣案仍在追查。矿道的支架也要一段段检查，他暂时还走不开。",
    "mode": "heard"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "记下近况，继续旅程",
    "flags": []
   }
  ],
  "requires": [
   "END.E01.elf"
  ],
  "optional": true
 },
 "END.VISIT.goblin.elf": {
  "id": "END.VISIT.goblin.elf",
  "sourceScene": "END.VISIT.goblin",
  "chapter": 10,
  "pov": "elf",
  "siteId": "goblin.a01",
  "title": "再访奇克",
  "npc": "奇克",
  "lines": [
   "[奇克正把行囊里剩下的东西一件件倒出来。家人催他吃饭，他抬头看见你，便把门边那只碗往里推了推。]",
   "奇克：来得巧。再晚一点，他们就当我把你的那份也吃了。",
   "奇克：明天还得找换粮的路。今天先坐下，路不会因为咱们吃顿饭就长腿跑了。",
   "奇克：下次别只带坏消息来。没事也能敲门。"
  ],
  "objective": "听听同伴的近况，问清下次可以在哪里找到彼此。",
  "flags": [],
  "knowledge": [
   {
    "id": "END.VISIT.goblin.elf.k0",
    "text": "奇克已回到三个家人所在的安全营地。今天先吃饭，明天的换粮路仍要寻找。",
    "mode": "heard"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "记下近况，继续旅程",
    "flags": []
   }
  ],
  "requires": [
   "END.E01.elf"
  ],
  "optional": true
 },
 "END.VISIT.ashen.elf": {
  "id": "END.VISIT.ashen.elf",
  "sourceScene": "END.VISIT.ashen",
  "chapter": 10,
  "pov": "elf",
  "siteId": "ashen.a01",
  "title": "再访砾恩",
  "npc": "砾恩",
  "lines": [
   "[砾恩把几张拓记铺在石面上，空处压着小石。他没有独自读下去，而是把仍认不清的地方留给后来的人一起看。]",
   "砾恩：他们问了很多。我能回答的，还不够。",
   "砾恩：族长的位置空着。我们的来历也缺了许多页。先把找到的放在这里，谁记得什么，就来添。",
   "砾恩：你若听到别的，带回来。我们一起辨。"
  ],
  "objective": "听听同伴的近况，问清下次可以在哪里找到彼此。",
  "flags": [],
  "knowledge": [
   {
    "id": "END.VISIT.ashen.elf.k0",
    "text": "砾恩把找到的部分来历记录交给幸存者一起看；族长的位置仍空着，后续由他们共同查明与决定。",
    "mode": "heard"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "记下近况，继续旅程",
    "flags": []
   }
  ],
  "requires": [
   "END.E01.elf"
  ],
  "optional": true
 },
 "END.VISIT.human.goblin": {
  "id": "END.VISIT.human.goblin",
  "sourceScene": "END.VISIT.human",
  "chapter": 10,
  "pov": "goblin",
  "siteId": "human.a01",
  "title": "再访罗什福尔",
  "npc": "罗什福尔",
  "lines": [
   "[罗什福尔刚核完一批交接记录，护手还放在桌边。他听见你到来，把未写完的那页压好，起身迎了两步。]",
   "罗什福尔：回来的路上，可还有车队受阻？",
   "罗什福尔：城门能开了，路上的人却还没都回家。我得把接应一段段安排下去。",
   "罗什福尔：有事仍让人捎信。不是只有打仗时，才能互相借一只手。"
  ],
  "objective": "听听同伴的近况，问清下次可以在哪里找到彼此。",
  "flags": [],
  "knowledge": [
   {
    "id": "END.VISIT.human.goblin.k0",
    "text": "罗什福尔仍按原货单追查余货与没回家的人。关闭门户没有让商队损失归零。",
    "mode": "heard"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "记下近况，继续旅程",
    "flags": []
   }
  ],
  "requires": [
   "END.G01.goblin"
  ],
  "optional": true
 },
 "END.VISIT.dwarf.goblin": {
  "id": "END.VISIT.dwarf.goblin",
  "sourceScene": "END.VISIT.dwarf",
  "chapter": 10,
  "pov": "goblin",
  "siteId": "dwarf.a01",
  "title": "再访布洛克",
  "npc": "布洛克",
  "lines": [
   "[布洛克从支架下直起身，把手上的木屑拍掉。听见你的脚步，他先看一眼来路，才把工具搁下。]",
   "布洛克：路上还顺？我这边还差几根撑木。",
   "布洛克：账都收好了，该问的人也得接着问。门关上了，不等于之前的账就能抹掉。",
   "布洛克：下回来，先在矿口喊一声。别自己往刚修的那段钻。"
  ],
  "objective": "听听同伴的近况，问清下次可以在哪里找到彼此。",
  "flags": [],
  "knowledge": [
   {
    "id": "END.VISIT.dwarf.goblin.k0",
    "text": "布洛克把账证妥善留下，重臣案仍在追查。矿道的支架也要一段段检查，他暂时还走不开。",
    "mode": "heard"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "记下近况，继续旅程",
    "flags": []
   }
  ],
  "requires": [
   "END.G01.goblin"
  ],
  "optional": true
 },
 "END.VISIT.elf.goblin": {
  "id": "END.VISIT.elf.goblin",
  "sourceScene": "END.VISIT.elf",
  "chapter": 10,
  "pov": "goblin",
  "siteId": "elf.a01",
  "title": "再访莱姆斯",
  "npc": "莱姆斯",
  "lines": [
   "[莱姆斯蹲在泉边，指尖沾着检查石缝留下的湿泥。他看见你，挪开旁边的记录册，腾出一处能坐的位置。]",
   "莱姆斯：水还在流。每次来，我总要先听一会儿。",
   "莱姆斯：关于那个人，关于我们看到的那些事，我会慢慢说清。有人不愿听，也不能因此不说。",
   "莱姆斯：要找我，就沿水道来。眼下这里更需要人。"
  ],
  "objective": "听听同伴的近况，问清下次可以在哪里找到彼此。",
  "flags": [],
  "knowledge": [
   {
    "id": "END.VISIT.elf.goblin.k0",
    "text": "莱姆斯仍在检查泉水和旧裂口，也准备把亲眼见到的事情告诉愿意听的人。祭司的高位暂且空着，他先把眼前的水道看好。",
    "mode": "heard"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "记下近况，继续旅程",
    "flags": []
   }
  ],
  "requires": [
   "END.G01.goblin"
  ],
  "optional": true
 },
 "END.VISIT.ashen.goblin": {
  "id": "END.VISIT.ashen.goblin",
  "sourceScene": "END.VISIT.ashen",
  "chapter": 10,
  "pov": "goblin",
  "siteId": "ashen.a01",
  "title": "再访砾恩",
  "npc": "砾恩",
  "lines": [
   "[砾恩把几张拓记铺在石面上，空处压着小石。他没有独自读下去，而是把仍认不清的地方留给后来的人一起看。]",
   "砾恩：他们问了很多。我能回答的，还不够。",
   "砾恩：族长的位置空着。我们的来历也缺了许多页。先把找到的放在这里，谁记得什么，就来添。",
   "砾恩：你若听到别的，带回来。我们一起辨。"
  ],
  "objective": "听听同伴的近况，问清下次可以在哪里找到彼此。",
  "flags": [],
  "knowledge": [
   {
    "id": "END.VISIT.ashen.goblin.k0",
    "text": "砾恩把找到的部分来历记录交给幸存者一起看；族长的位置仍空着，后续由他们共同查明与决定。",
    "mode": "heard"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "记下近况，继续旅程",
    "flags": []
   }
  ],
  "requires": [
   "END.G01.goblin"
  ],
  "optional": true
 },
 "END.VISIT.human.ashen": {
  "id": "END.VISIT.human.ashen",
  "sourceScene": "END.VISIT.human",
  "chapter": 10,
  "pov": "ashen",
  "siteId": "human.a01",
  "title": "再访罗什福尔",
  "npc": "罗什福尔",
  "lines": [
   "[罗什福尔刚核完一批交接记录，护手还放在桌边。他听见你到来，把未写完的那页压好，起身迎了两步。]",
   "罗什福尔：回来的路上，可还有车队受阻？",
   "罗什福尔：城门能开了，路上的人却还没都回家。我得把接应一段段安排下去。",
   "罗什福尔：有事仍让人捎信。不是只有打仗时，才能互相借一只手。"
  ],
  "objective": "听听同伴的近况，问清下次可以在哪里找到彼此。",
  "flags": [],
  "knowledge": [
   {
    "id": "END.VISIT.human.ashen.k0",
    "text": "罗什福尔仍按原货单追查余货与没回家的人。关闭门户没有让商队损失归零。",
    "mode": "heard"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "记下近况，继续旅程",
    "flags": []
   }
  ],
  "requires": [
   "END.A01.ashen"
  ],
  "optional": true
 },
 "END.VISIT.dwarf.ashen": {
  "id": "END.VISIT.dwarf.ashen",
  "sourceScene": "END.VISIT.dwarf",
  "chapter": 10,
  "pov": "ashen",
  "siteId": "dwarf.a01",
  "title": "再访布洛克",
  "npc": "布洛克",
  "lines": [
   "[布洛克从支架下直起身，把手上的木屑拍掉。听见你的脚步，他先看一眼来路，才把工具搁下。]",
   "布洛克：路上还顺？我这边还差几根撑木。",
   "布洛克：账都收好了，该问的人也得接着问。门关上了，不等于之前的账就能抹掉。",
   "布洛克：下回来，先在矿口喊一声。别自己往刚修的那段钻。"
  ],
  "objective": "听听同伴的近况，问清下次可以在哪里找到彼此。",
  "flags": [],
  "knowledge": [
   {
    "id": "END.VISIT.dwarf.ashen.k0",
    "text": "布洛克把账证妥善留下，重臣案仍在追查。矿道的支架也要一段段检查，他暂时还走不开。",
    "mode": "heard"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "记下近况，继续旅程",
    "flags": []
   }
  ],
  "requires": [
   "END.A01.ashen"
  ],
  "optional": true
 },
 "END.VISIT.elf.ashen": {
  "id": "END.VISIT.elf.ashen",
  "sourceScene": "END.VISIT.elf",
  "chapter": 10,
  "pov": "ashen",
  "siteId": "elf.a01",
  "title": "再访莱姆斯",
  "npc": "莱姆斯",
  "lines": [
   "[莱姆斯蹲在泉边，指尖沾着检查石缝留下的湿泥。他看见你，挪开旁边的记录册，腾出一处能坐的位置。]",
   "莱姆斯：水还在流。每次来，我总要先听一会儿。",
   "莱姆斯：关于那个人，关于我们看到的那些事，我会慢慢说清。有人不愿听，也不能因此不说。",
   "莱姆斯：要找我，就沿水道来。眼下这里更需要人。"
  ],
  "objective": "听听同伴的近况，问清下次可以在哪里找到彼此。",
  "flags": [],
  "knowledge": [
   {
    "id": "END.VISIT.elf.ashen.k0",
    "text": "莱姆斯仍在检查泉水和旧裂口，也准备把亲眼见到的事情告诉愿意听的人。祭司的高位暂且空着，他先把眼前的水道看好。",
    "mode": "heard"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "记下近况，继续旅程",
    "flags": []
   }
  ],
  "requires": [
   "END.A01.ashen"
  ],
  "optional": true
 },
 "END.VISIT.goblin.ashen": {
  "id": "END.VISIT.goblin.ashen",
  "sourceScene": "END.VISIT.goblin",
  "chapter": 10,
  "pov": "ashen",
  "siteId": "goblin.a01",
  "title": "再访奇克",
  "npc": "奇克",
  "lines": [
   "[奇克正把行囊里剩下的东西一件件倒出来。家人催他吃饭，他抬头看见你，便把门边那只碗往里推了推。]",
   "奇克：来得巧。再晚一点，他们就当我把你的那份也吃了。",
   "奇克：明天还得找换粮的路。今天先坐下，路不会因为咱们吃顿饭就长腿跑了。",
   "奇克：下次别只带坏消息来。没事也能敲门。"
  ],
  "objective": "听听同伴的近况，问清下次可以在哪里找到彼此。",
  "flags": [],
  "knowledge": [
   {
    "id": "END.VISIT.goblin.ashen.k0",
    "text": "奇克已回到三个家人所在的安全营地。今天先吃饭，明天的换粮路仍要寻找。",
    "mode": "heard"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "记下近况，继续旅程",
    "flags": []
   }
  ],
  "requires": [
   "END.A01.ashen"
  ],
  "optional": true
 }
};
export const FINALE_ASSIGNMENTS={"human": ["goblin", "elf", "dwarf", "ashen"], "dwarf": ["goblin", "elf", "human", "ashen"], "elf": ["goblin", "human", "dwarf", "ashen"], "goblin": ["human", "elf", "dwarf", "ashen"], "ashen": ["goblin", "elf", "dwarf", "human"]};
