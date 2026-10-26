// Canon source: rpg-script-v1/chapters-01-06.md. No world-secret knowledge is inferred for absent POVs.
const freeze=o=>{if(o&&typeof o==='object'){Object.values(o).forEach(freeze);Object.freeze(o);}return o;};
export const STORY_SCENES=freeze({
 "C01.H01.human": {
  "id": "C01.H01.human",
  "sourceScene": "C01.H01",
  "chapter": 1,
  "pov": "human",
  "siteId": "goblin.a01",
  "title": "追回粮袋",
  "npc": "边境斥候",
  "lines": [
   "斥候：车夫回去了。丢的粮，还在这条路上。",
   "罗什福尔：有人受伤吗？",
   "斥候：一个。能走。对面至少还有人接应。",
   "罗什福尔：你送他回去。我追到前面的窄口。",
   "奇克：别追了。你这身铁，过不去。",
   "罗什福尔：放下粮。",
   "奇克：放下了，你会让我走？",
   "罗什福尔：先把刀收起来。",
   "奇克：听着可不像会。"
  ],
  "objective": "追击奇克；这是非致命剧情交手，不以击杀为目标。",
  "flags": [
   "H_MET_G"
  ],
  "knowledge": [],
  "choices": [
   {
    "id": "pursue",
    "label": "追到前面的窄口",
    "flags": [],
    "knowledge": []
   }
  ],
  "requires": [],
  "optional": false,
  "encounter": {
   "kind": "scenario",
   "scenarioId": "story.c01.human-chase",
   "nodeId": "goblin.a01.field",
   "count": 1
  }
 },
 "C01.G01.goblin": {
  "id": "C01.G01.goblin",
  "sourceScene": "C01.G01",
  "chapter": 1,
  "pov": "goblin",
  "siteId": "goblin.a01",
  "title": "家里剩下的粮",
  "npc": "三个弟弟妹妹",
  "lines": [
   "快长大的那个：今天带我去。我背得动。",
   "奇克：背得动，不等于跑得动。放下。",
   "谨慎的那个：你昨晚说还剩一袋。",
   "奇克：我说的是能再弄到一袋。",
   "谨慎的那个：那就还没拿到。",
   "最小的那个：今天也能吃满吗？",
   "奇克：先在家等着。门别给不认识的人开。",
   "运粮者：人族追过来了。袋子怎么办？",
   "奇克：你拖袋子，我把他引开。别把我的那份弄丢。"
  ],
  "objective": "撑过拦截，找到撤离口；不要求杀死罗什福尔。",
  "flags": [
   "G_MET_H"
  ],
  "knowledge": [],
  "choices": [
   {
    "id": "escape",
    "label": "把追兵引向石道",
    "flags": [],
    "knowledge": []
   }
  ],
  "requires": [],
  "optional": false,
  "encounter": {
   "kind": "scenario",
   "scenarioId": "story.c01.goblin-escape",
   "nodeId": "goblin.a01.field",
   "count": 1
  }
 },
 "C01.X01.human": {
  "id": "C01.X01.human",
  "sourceScene": "C01.X01",
  "chapter": 1,
  "pov": "human",
  "siteId": "goblin.a01",
  "title": "地下的刻纹",
  "npc": "旧石室",
  "lines": [
   "罗什福尔：这不是你们垒的。",
   "奇克：你看我像有这工夫？",
   "罗什福尔：这些线……",
   "奇克：慢慢看！别等我！"
  ],
  "objective": "记录眼前所见或先离开；调查不是通关钥匙。",
  "flags": [],
  "knowledge": [
   {
    "id": "C01.X01.human.k0",
    "text": "旧石室有陌生、未发光的刻纹；用途不明。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "survey",
    "label": "先记下刻纹",
    "flags": [
     "R1_SURVEYED_H"
    ],
    "knowledge": []
   },
   {
    "id": "leave",
    "label": "先回去找粮",
    "flags": [
     "R1_SITE_SEEN_H"
    ],
    "knowledge": []
   }
  ],
  "requires": [
   "C01.H01.human"
  ],
  "optional": false
 },
 "C01.X01.goblin": {
  "id": "C01.X01.goblin",
  "sourceScene": "C01.X01",
  "chapter": 1,
  "pov": "goblin",
  "siteId": "goblin.a01",
  "title": "地下的刻纹",
  "npc": "旧石室",
  "lines": [
   "罗什福尔：这不是你们垒的。",
   "奇克：你看我像有这工夫？",
   "罗什福尔：这些线……",
   "奇克：慢慢看！别等我！"
  ],
  "objective": "记录眼前所见或先离开；调查不是通关钥匙。",
  "flags": [],
  "knowledge": [
   {
    "id": "C01.X01.goblin.k0",
    "text": "旧石室有陌生、未发光的刻纹；用途不明。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "survey",
    "label": "回头认路",
    "flags": [
     "R1_ROUTE_KNOWN_G"
    ],
    "knowledge": []
   },
   {
    "id": "leave",
    "label": "立刻离开",
    "flags": [
     "R1_SITE_SEEN_G"
    ],
    "knowledge": []
   }
  ],
  "requires": [
   "C01.G01.goblin"
  ],
  "optional": false
 },
 "C01.D01.dwarf": {
  "id": "C01.D01.dwarf",
  "sourceScene": "C01.D01",
  "chapter": 1,
  "pov": "dwarf",
  "siteId": "dwarf.a01",
  "title": "受损的支架",
  "npc": "矿班长",
  "lines": [
   "矿班长：再拖一车，今天的量就够了。",
   "布洛克：这根再压一次，今天就有人回不去了。",
   "矿班长：人手不够。",
   "布洛克：那就停着。给我找根能用的撑木。"
  ],
  "objective": "清开作业区后固定支架、确认矿工通过。",
  "flags": [
   "D_MINE_HELPED"
  ],
  "knowledge": [],
  "choices": [
   {
    "id": "brace",
    "label": "固定支架，确认矿工通过",
    "flags": [],
    "knowledge": []
   }
  ],
  "requires": [],
  "optional": false,
  "encounter": {
   "kind": "victory",
   "nodeId": "dwarf.a01.field",
   "count": 1
  }
 },
 "C01.E01.elf": {
  "id": "C01.E01.elf",
  "sourceScene": "C01.E01",
  "chapter": 1,
  "pov": "elf",
  "siteId": "elf.a01",
  "title": "祭司的工夫",
  "npc": "守林者",
  "lines": [
   "守林者：别硬扳。越扳越紧。",
   "莱姆斯：那怎么让它松开？",
   "守林者：先把回弹卡住，再退这块。",
   "莱姆斯：这个留给我吧。我还得再试。",
   "守林者：带着。遇见旧结构，先看它怎么受力。"
  ],
  "objective": "用旧制楔钉卡住回弹片，再退出嵌件。",
  "flags": [
   "E_WEDGE_LEARNED",
   "E_WEDGE_AVAILABLE"
  ],
  "knowledge": [
   {
    "id": "C01.E01.elf.k0",
    "text": "已学习旧制楔钉的用法；此任务工具不能出售或消耗。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "wedge",
    "label": "卡住回弹片，退出嵌件",
    "flags": [],
    "knowledge": []
   }
  ],
  "requires": [],
  "optional": false
 },
 "C01.A01.ashen": {
  "id": "C01.A01.ashen",
  "sourceScene": "C01.A01",
  "chapter": 1,
  "pov": "ashen",
  "siteId": "ashen.a01",
  "title": "不肯熄的火",
  "npc": "烬裔修护者",
  "lines": [
   "修护者：别动。裂口还没合上。",
   "砾恩：外面的路还能走。",
   "修护者：能走，未必能回来。你又要出去？",
   "砾恩：这里缺的东西，不会自己送来。",
   "修护者：至少等到天亮。",
   "砾恩：我认得路。"
  ],
  "objective": "排除居处外的威胁，带伤者回安全处。",
  "flags": [
   "A_HOME_ROUTE_KNOWN"
  ],
  "knowledge": [],
  "choices": [
   {
    "id": "escort",
    "label": "带伤者回安全处",
    "flags": [],
    "knowledge": []
   }
  ],
  "requires": [],
  "optional": false,
  "encounter": {
   "kind": "victory",
   "nodeId": "ashen.a01.field",
   "count": 1
  }
 },
 "C02.O01.dwarf": {
  "id": "C02.O01.dwarf",
  "sourceScene": "C02.O01",
  "chapter": 2,
  "pov": "dwarf",
  "siteId": "dwarf.a01",
  "title": "各自的去处",
  "npc": "矿班长",
  "lines": [
   "矿班长：旧图你先拿着。上头有人找你。",
   "布洛克：哪一处又坏了？",
   "矿班长：这回不是矿。是王室的东西。"
  ],
  "objective": "确认下一段本地行程；没有收到异地刻纹报告。",
  "flags": [
   "return-ring.elf.scene-open"
  ],
  "knowledge": [],
  "choices": [
   {
    "id": "continue",
    "label": "照此办理",
    "flags": []
   }
  ],
  "requires": [
   "C01.D01.dwarf"
  ],
  "optional": false
 },
 "C02.O01.human": {
  "id": "C02.O01.human",
  "sourceScene": "C02.O01",
  "chapter": 2,
  "pov": "human",
  "siteId": "human.a01",
  "title": "各自的去处",
  "npc": "边境斥候",
  "lines": [
   "斥候：粮袋收回一批，人也送回了。商路还有别的差事。",
   "罗什福尔：把没找回的记清。不能换张单子就算没丢过。"
  ],
  "objective": "确认下一段本地行程；没有收到异地刻纹报告。",
  "flags": [
   "return-ring.elf.scene-open"
  ],
  "knowledge": [],
  "choices": [
   {
    "id": "continue",
    "label": "照此办理",
    "flags": []
   }
  ],
  "requires": [
   "C01.X01.human"
  ],
  "optional": false
 },
 "C02.O01.goblin": {
  "id": "C02.O01.goblin",
  "sourceScene": "C02.O01",
  "chapter": 2,
  "pov": "goblin",
  "siteId": "goblin.a01",
  "title": "各自的去处",
  "npc": "家人",
  "lines": [
   "谨慎的那个：这袋我分好了。你那份也在里面。",
   "奇克：别把我的分太少。",
   "快长大的那个：你先前不是说不饿？",
   "奇克：我说过的话多着呢。"
  ],
  "objective": "确认下一段本地行程；没有收到异地刻纹报告。",
  "flags": [
   "return-ring.elf.scene-open"
  ],
  "knowledge": [],
  "choices": [
   {
    "id": "continue",
    "label": "照此办理",
    "flags": []
   }
  ],
  "requires": [
   "C01.X01.goblin"
  ],
  "optional": false
 },
 "C02.O01.ashen": {
  "id": "C02.O01.ashen",
  "sourceScene": "C02.O01",
  "chapter": 2,
  "pov": "ashen",
  "siteId": "ashen.a01",
  "title": "各自的去处",
  "npc": "修护者",
  "lines": [
   "修护者：你往商道走？",
   "砾恩：那边有东西可换。",
   "修护者：看清再拿。别替别人背上债。"
  ],
  "objective": "确认下一段本地行程；没有收到异地刻纹报告。",
  "flags": [
   "return-ring.elf.scene-open"
  ],
  "knowledge": [],
  "choices": [
   {
    "id": "continue",
    "label": "照此办理",
    "flags": []
   }
  ],
  "requires": [
   "C01.A01.ashen"
  ],
  "optional": false
 },
 "C02.E01.elf": {
  "id": "C02.E01.elf",
  "sourceScene": "C02.E01",
  "chapter": 2,
  "pov": "elf",
  "siteId": "elf.a02",
  "title": "谁动了水",
  "npc": "村民与守林者",
  "lines": [
   "村民：上面不许砍，下面不许挖。现在连水都没了。",
   "守林者：你们把根都截了，下一场雨拿什么挡？",
   "村民：那你叫树给我孩子倒一碗水。",
   "莱姆斯：先别动树。我沿旧水道看一遍。",
   "守林者：那条道早就不用了。",
   "莱姆斯：水总得去了什么地方。"
  ],
  "objective": "可亲自调查修水；暂缓完整调查时仍需在接令前安排简略处置。",
  "flags": [],
  "knowledge": [],
  "choices": [
   {
    "id": "help",
    "label": "现在去看",
    "flags": [
     "E_DRYSPRING_ACCEPTED"
    ],
    "knowledge": []
   },
   {
    "id": "later",
    "label": "先办手头的事",
    "flags": [
     "E_DRYSPRING_DEFERRED"
    ],
    "knowledge": []
   }
  ],
  "requires": [
   "C01.E01.elf"
  ],
  "optional": false
 },
 "C02.E02.elf": {
  "id": "C02.E02.elf",
  "sourceScene": "C02.E02",
  "chapter": 2,
  "pov": "elf",
  "siteId": "elf.a02",
  "title": "根下的空处",
  "npc": "守林者",
  "lines": [
   "莱姆斯：不是有人把水截走了。下面有个空处。",
   "守林者：能堵住吗？",
   "莱姆斯：先得让积水出去。这里还有旧渠。"
  ],
  "objective": "清除地下怪物后疏通旧渠；仅看石台不能恢复泉水。",
  "flags": [
   "E_DRYSPRING_REPAIRED"
  ],
  "knowledge": [
   {
    "id": "C02.E02.elf.k0",
    "text": "树根撑裂旧结构，泉水漏入地下；疏通旧渠后恢复引流。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "survey",
    "label": "疏通旧渠，并记录石台",
    "flags": [
     "R2_SURVEYED_E"
    ],
    "knowledge": []
   },
   {
    "id": "channel",
    "label": "先疏通旧渠",
    "flags": [],
    "knowledge": []
   }
  ],
  "requires": [
   "C02.E01.elf"
  ],
  "optional": true,
  "encounter": {
   "kind": "victory",
   "nodeId": "elf.a02.field",
   "count": 1
  }
 },
 "C02.E03.elf": {
  "id": "C02.E03.elf",
  "sourceScene": "C02.E03",
  "chapter": 2,
  "pov": "elf",
  "siteId": "elf.a02",
  "title": "回来的水",
  "npc": "村民",
  "lines": [
   "村民：有了。真有了。",
   "守林者：破的是下面的旧石头。根也不能全砍。",
   "莱姆斯：把裂口加固。过几天再看一次，别只等它断水。",
   "村民：你们要看树，我要看水。一起看吧。",
   "莱姆斯：好。下面那块旧石台先别动。"
  ],
  "objective": "约好共同修护泉水与树根。",
  "flags": [
   "return-ring.elf.scene-open"
  ],
  "knowledge": [],
  "choices": [
   {
    "id": "continue",
    "label": "照此办理",
    "flags": []
   }
  ],
  "requires": [
   "C02.E02.elf"
  ],
  "optional": true
 },
 "C03.D01.dwarf": {
  "id": "C03.D01.dwarf",
  "sourceScene": "C03.D01",
  "chapter": 3,
  "pov": "dwarf",
  "siteId": "dwarf.a01",
  "title": "王室的封记",
  "npc": "王室保管人",
  "lines": [
   "保管人：这件东西不该离库。出库记录却已经盖了印。",
   "布洛克：谁准的？",
   "保管人：记录上有经手人。是不是冒用了印，还不能说。",
   "布洛克：车走哪条路？",
   "保管人：矮人委托的那支商队。这是货箱封记和路线。",
   "布洛克：我先把东西找回来。库里的账别再让人碰。"
  ],
  "objective": "带货箱封记与指定商队路线前往商道。",
  "flags": [
   "D_RELIC_PURSUIT",
   "D_CARAVAN_IDENTIFIED"
  ],
  "knowledge": [
   {
    "id": "C03.D01.dwarf.k0",
    "text": "王室遗物异常出库；指定商队由矮人委托，尚无私卖全案证据。",
    "mode": "heard"
   }
  ],
  "choices": [
   {
    "id": "continue",
    "label": "照此办理",
    "flags": []
   }
  ],
  "requires": [
   "C02.O01.dwarf"
  ],
  "optional": false
 },
 "C03.E01.elf": {
  "id": "C03.E01.elf",
  "sourceScene": "C03.E01",
  "chapter": 3,
  "pov": "elf",
  "siteId": "elf.a01",
  "title": "大祭司的命令",
  "npc": "大祭司",
  "lines": [
   "大祭司：送来的东西，路上出了差错。",
   "莱姆斯：需要护送商队吗？",
   "大祭司：找到货单上这只箱子。里面的遗物必须带回来。",
   "莱姆斯：商队的人呢？",
   "大祭司：该救的人，你可以救。不要耽误正事。",
   "莱姆斯：我会核对封记。"
  ],
  "objective": "带收货凭据前往指定商队路线。",
  "flags": [
   "E_RELIC_PURSUIT",
   "E_CARAVAN_IDENTIFIED"
  ],
  "knowledge": [
   {
    "id": "C03.E01.elf.k0",
    "text": "大祭司要求追回尚未送达的指定遗物。",
    "mode": "heard"
   }
  ],
  "choices": [
   {
    "id": "continue",
    "label": "照此办理",
    "flags": []
   }
  ],
  "requires": [
   "C02.E01.elf"
  ],
  "optional": false,
  "requiresAny": [
   [
    "C02.E03.elf"
   ],
   [
    "C02.E00B.elf"
   ]
  ],
  "requiresFlags": [
   "E_WEDGE_AVAILABLE"
  ]
 },
 "C03.H01.human": {
  "id": "C03.H01.human",
  "sourceScene": "C03.H01",
  "chapter": 3,
  "pov": "human",
  "siteId": "human.a01",
  "title": "起火的车辙",
  "npc": "传令兵",
  "lines": [
   "传令兵：那支矮人委托的商队遇袭。前车烧了，后车还没消息。",
   "罗什福尔：伤者往哪里撤？",
   "传令兵：路边的货检棚。",
   "罗什福尔：通知棚里腾地方。货单留一份，我去找还没回来的人。"
  ],
  "objective": "救人、清路并追回失货；不是只追王室箱子。",
  "flags": [
   "H_CARAVAN_RESCUE",
   "H_CARAVAN_IDENTIFIED"
  ],
  "knowledge": [
   {
    "id": "C03.H01.human.k0",
    "text": "指定矮人商队遇袭，人员与所有货物都需要追查。",
    "mode": "heard"
   }
  ],
  "choices": [
   {
    "id": "continue",
    "label": "照此办理",
    "flags": []
   }
  ],
  "requires": [
   "C02.O01.human"
  ],
  "optional": false
 },
 "C03.G01.goblin": {
  "id": "C03.G01.goblin",
  "sourceScene": "C03.G01",
  "chapter": 3,
  "pov": "goblin",
  "siteId": "human.a02",
  "title": "不是来送粮的",
  "npc": "运粮者与车夫",
  "lines": [
   "运粮者：有人先动手了。咱们还去？",
   "奇克：他们砸前车。粮在后头。",
   "运粮者：万一把我们也算进去？",
   "奇克：所以别站在火边上。",
   "车夫：帮我抬一下……拿粮也行，先抬一下！"
  ],
  "objective": "清开后车周围的阻碍，救出车夫后带走可携带的粮。",
  "flags": [
   "G_CARAVAN_GRAIN"
  ],
  "knowledge": [
   {
    "id": "C03.G01.goblin.k0",
    "text": "商队的袭击者没有可辨认阵营标识。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "rescue",
    "label": "先撬开车板",
    "flags": [
     "G_CARAVAN_RESCUED_FIRST"
    ],
    "knowledge": []
   },
   {
    "id": "grain",
    "label": "先拖开粮袋再找支点",
    "flags": [
     "G_CARAVAN_GRAIN_FIRST"
    ],
    "knowledge": []
   }
  ],
  "requires": [
   "C02.O01.goblin"
  ],
  "optional": false,
  "encounter": {
   "kind": "victory",
   "nodeId": "human.a02.field",
   "count": 1
  }
 },
 "C03.A01.ashen": {
  "id": "C03.A01.ashen",
  "sourceScene": "C03.A01",
  "chapter": 3,
  "pov": "ashen",
  "siteId": "human.a02",
  "title": "箱子里的光",
  "npc": "翻倒的封箱车",
  "lines": [
   "砾恩：这里怎么会有这个？",
   "[裂开的王室箱里透出微光。袭击已经发生，砾恩独自接近。]",
   "砾恩：先离开。"
  ],
  "objective": "清除阻碍，带遗物核心离开；只记任务持有，不复制装备。",
  "flags": [
   "A_HAS_ROYAL_RELIC"
  ],
  "knowledge": [
   {
    "id": "C03.A01.ashen.k0",
    "text": "独自在商队遇袭后取走王室遗物核心，尚不知道其来历。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "take",
    "label": "取出核心，从侧面离开",
    "flags": [],
    "knowledge": []
   }
  ],
  "requires": [
   "C02.O01.ashen"
  ],
  "optional": false,
  "encounter": {
   "kind": "victory",
   "nodeId": "human.a02.field",
   "count": 1
  }
 },
 "C03.X01.human": {
  "id": "C03.X01.human",
  "sourceScene": "C03.X01",
  "chapter": 3,
  "pov": "human",
  "siteId": "human.a02",
  "title": "余火",
  "npc": "幸存车夫",
  "lines": [
   "车夫：最先来的那伙，脸都遮着。后来又有人翻粮车。",
   "车夫：箱裂了。我看见一个烬裔抱着里面的东西走了。只有他一个。",
   "罗什福尔：别把后来出现的人全算成一伙。先画你看清的路线。",
   "罗什福尔：伤者先抬出来。货物照单找，不认得的也别扔。"
  ],
  "objective": "清路、救出被困人员并登记可信目击。",
  "flags": [
   "CARAVAN_ROUTES_RECORDED"
  ],
  "knowledge": [
   {
    "id": "C03.X01.human.k0",
    "text": "车夫目击一个烬裔独自带走核心；最初袭击者身份仍未知。",
    "mode": "heard"
   }
  ],
  "choices": [
   {
    "id": "register",
    "label": "照实登记目击与分流路线",
    "flags": [],
    "knowledge": []
   }
  ],
  "requires": [
   "C03.H01.human"
  ],
  "optional": false,
  "encounter": {
   "kind": "victory",
   "nodeId": "human.a02.field",
   "count": 1
  }
 },
 "C03.X01.dwarf": {
  "id": "C03.X01.dwarf",
  "sourceScene": "C03.X01",
  "chapter": 3,
  "pov": "dwarf",
  "siteId": "human.a02",
  "title": "余火",
  "npc": "幸存车夫",
  "lines": [
   "车夫：最先来的那伙，脸都遮着。后来又有人翻粮车。",
   "车夫：箱裂了。我看见一个烬裔抱着里面的东西走了。只有他一个。",
   "布洛克：一个人拿的，就追这个人。袭车的账另算。",
   "布洛克：封箱碎片给我。其余的交给管货的人。"
  ],
  "objective": "清路、救出被困人员并登记可信目击。",
  "flags": [
   "CARAVAN_ROUTES_RECORDED"
  ],
  "knowledge": [
   {
    "id": "C03.X01.dwarf.k0",
    "text": "车夫目击一个烬裔独自带走核心；最初袭击者身份仍未知。",
    "mode": "heard"
   }
  ],
  "choices": [
   {
    "id": "register",
    "label": "照实登记目击与分流路线",
    "flags": [],
    "knowledge": []
   }
  ],
  "requires": [
   "C03.D01.dwarf"
  ],
  "optional": false,
  "encounter": {
   "kind": "victory",
   "nodeId": "human.a02.field",
   "count": 1
  }
 },
 "C03.X01.elf": {
  "id": "C03.X01.elf",
  "sourceScene": "C03.X01",
  "chapter": 3,
  "pov": "elf",
  "siteId": "human.a02",
  "title": "余火",
  "npc": "幸存车夫",
  "lines": [
   "车夫：最先来的那伙，脸都遮着。后来又有人翻粮车。",
   "车夫：箱裂了。我看见一个烬裔抱着里面的东西走了。只有他一个。",
   "莱姆斯：往哪边？你能记住多少，就说多少。",
   "莱姆斯：我留一条安全路。能走的，扶着不能走的。"
  ],
  "objective": "清路、救出被困人员并登记可信目击。",
  "flags": [
   "CARAVAN_ROUTES_RECORDED"
  ],
  "knowledge": [
   {
    "id": "C03.X01.elf.k0",
    "text": "车夫目击一个烬裔独自带走核心；最初袭击者身份仍未知。",
    "mode": "heard"
   }
  ],
  "choices": [
   {
    "id": "register",
    "label": "照实登记目击与分流路线",
    "flags": [],
    "knowledge": []
   }
  ],
  "requires": [
   "C03.E01.elf"
  ],
  "optional": false,
  "encounter": {
   "kind": "victory",
   "nodeId": "human.a02.field",
   "count": 1
  }
 },
 "C04.HD01.human": {
  "id": "C04.HD01.human",
  "sourceScene": "C04.HD01",
  "chapter": 4,
  "pov": "human",
  "siteId": "human.a03",
  "title": "货检棚",
  "npc": "布洛克与罗什福尔",
  "lines": [
   "罗什福尔：你只找这一箱？",
   "布洛克：王室遗物。箱子已经空了。",
   "罗什福尔：这张单上还有药、工具和粮。人也没全回来。",
   "布洛克：我不占你的人手。把拿箱子的那条路给我。",
   "罗什福尔：你熟悉矮人封记。替我认认哪几张单被换过。",
   "布洛克：可以。但现在只能说对不上，不能说是谁干的。",
   "罗什福尔：那就写“对不上”。证据有多少，写多少。"
  ],
  "objective": "对照货单、箱角和路线；留下彼此的联络口信。",
  "flags": [
   "CONTACT_H_D",
   "CARGO_ROUTE_SPLIT"
  ],
  "knowledge": [
   {
    "id": "C04.HD01.human.k0",
    "text": "罗什福尔追人员及所有失货，布洛克追王室遗物；运输单据有疑点而非完整罪证。",
    "mode": "confirmed"
   }
  ],
  "choices": [
   {
    "id": "compare",
    "label": "核对封记与分流路线",
    "flags": [],
    "knowledge": []
   }
  ],
  "requires": [
   "C03.X01.human"
  ],
  "optional": false
 },
 "C04.HD01.dwarf": {
  "id": "C04.HD01.dwarf",
  "sourceScene": "C04.HD01",
  "chapter": 4,
  "pov": "dwarf",
  "siteId": "human.a03",
  "title": "货检棚",
  "npc": "布洛克与罗什福尔",
  "lines": [
   "罗什福尔：你只找这一箱？",
   "布洛克：王室遗物。箱子已经空了。",
   "罗什福尔：这张单上还有药、工具和粮。人也没全回来。",
   "布洛克：我不占你的人手。把拿箱子的那条路给我。",
   "罗什福尔：你熟悉矮人封记。替我认认哪几张单被换过。",
   "布洛克：可以。但现在只能说对不上，不能说是谁干的。",
   "罗什福尔：那就写“对不上”。证据有多少，写多少。"
  ],
  "objective": "对照货单、箱角和路线；留下彼此的联络口信。",
  "flags": [
   "CONTACT_H_D",
   "CARGO_ROUTE_SPLIT"
  ],
  "knowledge": [
   {
    "id": "C04.HD01.dwarf.k0",
    "text": "罗什福尔追人员及所有失货，布洛克追王室遗物；运输单据有疑点而非完整罪证。",
    "mode": "confirmed"
   }
  ],
  "choices": [
   {
    "id": "compare",
    "label": "核对封记与分流路线",
    "flags": [],
    "knowledge": []
   }
  ],
  "requires": [
   "C03.X01.dwarf"
  ],
  "optional": false
 },
 "C04.G01.human": {
  "id": "C04.G01.human",
  "sourceScene": "C04.G01",
  "chapter": 4,
  "pov": "human",
  "siteId": "human.a03",
  "title": "老对手",
  "npc": "奇克与罗什福尔",
  "lines": [
   "罗什福尔：又是你。",
   "奇克：这回你先看见我的。我可没追着你跑。",
   "罗什福尔：商队的粮呢？",
   "奇克：有的在别人背上。你要我替你全背回来？",
   "奇克：带你们去粮车被拖走的地方。到地方，你别拿我家里的那袋凑账。"
  ],
  "objective": "清理失货支路，救回残留伤者；不记作全部货物追回。",
  "flags": [
   "CONTACT_H_G",
   "G_GRAIN_ROUTE_SHARED",
   "return-ring.human.scene-open"
  ],
  "knowledge": [
   {
    "id": "C04.G01.human.k0",
    "text": "奇克指出藏货点后离开，并未加入永久队伍。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "cargo",
    "label": "先核对可辨认的货物",
    "flags": [],
    "knowledge": []
   },
   {
    "id": "people",
    "label": "先找人再核货",
    "flags": [],
    "knowledge": []
   }
  ],
  "requires": [
   "C04.HD01.human"
  ],
  "optional": false,
  "encounter": {
   "kind": "victory",
   "nodeId": "human.a03.field",
   "count": 1
  }
 },
 "C04.G01.dwarf": {
  "id": "C04.G01.dwarf",
  "sourceScene": "C04.G01",
  "chapter": 4,
  "pov": "dwarf",
  "siteId": "human.a03",
  "title": "老对手",
  "npc": "奇克与罗什福尔",
  "lines": [
   "罗什福尔：又是你。",
   "奇克：这回你先看见我的。我可没追着你跑。",
   "罗什福尔：商队的粮呢？",
   "奇克：有的在别人背上。你要我替你全背回来？",
   "奇克：带你们去粮车被拖走的地方。到地方，你别拿我家里的那袋凑账。"
  ],
  "objective": "清理失货支路，救回残留伤者；不记作全部货物追回。",
  "flags": [
   "CONTACT_H_G",
   "G_GRAIN_ROUTE_SHARED",
   "return-ring.human.scene-open"
  ],
  "knowledge": [
   {
    "id": "C04.G01.dwarf.k0",
    "text": "奇克指出藏货点后离开，并未加入永久队伍。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "cargo",
    "label": "先核对可辨认的货物",
    "flags": [],
    "knowledge": []
   },
   {
    "id": "people",
    "label": "先找人再核货",
    "flags": [],
    "knowledge": []
   }
  ],
  "requires": [
   "C04.HD01.dwarf"
  ],
  "optional": false,
  "encounter": {
   "kind": "victory",
   "nodeId": "human.a03.field",
   "count": 1
  }
 },
 "C04.G01.goblin": {
  "id": "C04.G01.goblin",
  "sourceScene": "C04.G01",
  "chapter": 4,
  "pov": "goblin",
  "siteId": "human.a03",
  "title": "老对手",
  "npc": "奇克与罗什福尔",
  "lines": [
   "罗什福尔：又是你。",
   "奇克：这回你先看见我的。我可没追着你跑。",
   "罗什福尔：商队的粮呢？",
   "奇克：有的在别人背上。你要我替你全背回来？",
   "奇克：带你们去粮车被拖走的地方。到地方，你别拿我家里的那袋凑账。"
  ],
  "objective": "清理失货支路，救回残留伤者；不记作全部货物追回。",
  "flags": [
   "CONTACT_H_G",
   "G_GRAIN_ROUTE_SHARED",
   "return-ring.human.scene-open"
  ],
  "knowledge": [
   {
    "id": "C04.G01.goblin.k0",
    "text": "奇克指出藏货点后离开，并未加入永久队伍。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "cargo",
    "label": "先交出认得出的货",
    "flags": [],
    "knowledge": []
   },
   {
    "id": "people",
    "label": "先带路再核货",
    "flags": [],
    "knowledge": []
   }
  ],
  "requires": [
   "C03.G01.goblin"
  ],
  "optional": false,
  "encounter": {
   "kind": "victory",
   "nodeId": "human.a03.field",
   "count": 1
  }
 },
 "C04.DE01.dwarf": {
  "id": "C04.DE01.dwarf",
  "sourceScene": "C04.DE01",
  "chapter": 4,
  "pov": "dwarf",
  "siteId": "human.a03",
  "title": "收货凭据",
  "npc": "布洛克与莱姆斯",
  "lines": [
   "莱姆斯：你拿着那个箱子的封记。",
   "布洛克：你又拿着它的收货凭据。",
   "莱姆斯：大祭司让我带遗物回去。",
   "布洛克：王室没认过这笔出库。",
   "莱姆斯：这张凭据是真的。",
   "布洛克：真的印，也能盖在不该盖的地方。",
   "莱姆斯：我会回去核问。先找到东西。",
   "布洛克：我查经手的账。你追拿箱子的人。有消息，留给货检棚。"
  ],
  "objective": "核验封记和收货凭据，保持联络。",
  "flags": [
   "CONTACT_D_E",
   "return-ring.human.scene-open"
  ],
  "knowledge": [
   {
    "id": "C04.DE01.dwarf.k0",
    "text": "大祭司是指定收货方，但尚无其明知盗卖或政变资金的完整证据。",
    "mode": "confirmed"
   }
  ],
  "choices": [
   {
    "id": "verify",
    "label": "核验凭据后分头追查",
    "flags": [],
    "knowledge": []
   }
  ],
  "requires": [
   "C04.G01.dwarf"
  ],
  "optional": false
 },
 "C04.DE01.elf": {
  "id": "C04.DE01.elf",
  "sourceScene": "C04.DE01",
  "chapter": 4,
  "pov": "elf",
  "siteId": "human.a03",
  "title": "收货凭据",
  "npc": "布洛克与莱姆斯",
  "lines": [
   "莱姆斯：你拿着那个箱子的封记。",
   "布洛克：你又拿着它的收货凭据。",
   "莱姆斯：大祭司让我带遗物回去。",
   "布洛克：王室没认过这笔出库。",
   "莱姆斯：这张凭据是真的。",
   "布洛克：真的印，也能盖在不该盖的地方。",
   "莱姆斯：我会回去核问。先找到东西。",
   "布洛克：我查经手的账。你追拿箱子的人。有消息，留给货检棚。"
  ],
  "objective": "核验封记和收货凭据，保持联络。",
  "flags": [
   "CONTACT_D_E",
   "return-ring.human.scene-open"
  ],
  "knowledge": [
   {
    "id": "C04.DE01.elf.k0",
    "text": "大祭司是指定收货方，但尚无其明知盗卖或政变资金的完整证据。",
    "mode": "confirmed"
   }
  ],
  "choices": [
   {
    "id": "verify",
    "label": "核验凭据后分头追查",
    "flags": [],
    "knowledge": []
   }
  ],
  "requires": [
   "C03.X01.elf"
  ],
  "optional": false
 },
 "C04.A01.elf": {
  "id": "C04.A01.elf",
  "sourceScene": "C04.A01",
  "chapter": 4,
  "pov": "elf",
  "siteId": "ashen.a04",
  "title": "跟来的脚步",
  "npc": "莱姆斯与砾恩",
  "lines": [
   "砾恩：这里有路。",
   "莱姆斯：把箱里的东西放下。",
   "砾恩：你追的是东西，还是我？",
   "莱姆斯：先把它还来。",
   "砾恩：你连它是什么都没问。",
   "莱姆斯：那你说。",
   "砾恩：我也在找。"
  ],
  "objective": "沿旧石阶进入神庙外层；尚不知神庙用途。",
  "flags": [
   "return-ring.human.scene-open"
  ],
  "knowledge": [
   {
    "id": "C04.A01.elf.k0",
    "text": "遗物对古神庙旧结构有反应，尚未确认用途。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "enter",
    "label": "进入古神庙外层",
    "flags": [],
    "knowledge": []
   }
  ],
  "requires": [
   "C04.DE01.elf"
  ],
  "optional": false
 },
 "C04.A01.ashen": {
  "id": "C04.A01.ashen",
  "sourceScene": "C04.A01",
  "chapter": 4,
  "pov": "ashen",
  "siteId": "ashen.a04",
  "title": "跟来的脚步",
  "npc": "莱姆斯与砾恩",
  "lines": [
   "砾恩：这里有路。",
   "莱姆斯：把箱里的东西放下。",
   "砾恩：你追的是东西，还是我？",
   "莱姆斯：先把它还来。",
   "砾恩：你连它是什么都没问。",
   "莱姆斯：那你说。",
   "砾恩：我也在找。"
  ],
  "objective": "沿旧石阶进入神庙外层；尚不知神庙用途。",
  "flags": [
   "return-ring.human.scene-open"
  ],
  "knowledge": [
   {
    "id": "C04.A01.ashen.k0",
    "text": "遗物对古神庙旧结构有反应，尚未确认用途。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "enter",
    "label": "进入古神庙外层",
    "flags": [],
    "knowledge": []
   }
  ],
  "requires": [
   "C03.A01.ashen"
  ],
  "optional": false
 },
 "C05.EA01.elf": {
  "id": "C05.EA01.elf",
  "sourceScene": "C05.EA01",
  "chapter": 5,
  "pov": "elf",
  "siteId": "ashen.a04",
  "title": "旧座前",
  "npc": "莱姆斯与砾恩",
  "lines": [
   "莱姆斯：停下。你不知道会发生什么。",
   "砾恩：你知道？",
   "莱姆斯：我知道这东西不属于你。",
   "砾恩：箱子上的印，能替它说话？",
   "莱姆斯：我不能空手让你离开。",
   "砾恩：那就让开手里的路。"
  ],
  "objective": "挡住砾恩，确认遗物变化；完成观察后会进入既定败北演出。",
  "flags": [],
  "knowledge": [],
  "choices": [
   {
    "id": "duel",
    "label": "挡住出口，观察核心变化",
    "flags": [],
    "knowledge": []
   }
  ],
  "requires": [
   "C04.A01.elf"
  ],
  "optional": false,
  "encounter": {
   "kind": "scenario",
   "scenarioId": "story.c05.elf-duel",
   "nodeId": "ashen.a04.field",
   "count": 1
  }
 },
 "C05.EA02.elf": {
  "id": "C05.EA02.elf",
  "sourceScene": "C05.EA02",
  "chapter": 5,
  "pov": "elf",
  "siteId": "ashen.a04",
  "title": "没有落下的手",
  "npc": "莱姆斯与砾恩",
  "lines": [
   "莱姆斯：你要杀我？",
   "砾恩：你还能走。",
   "莱姆斯：我回去后，还会有人来。",
   "砾恩：那就告诉他们，你见过什么。别添。",
   "莱姆斯：我会再来。",
   "砾恩：下回，先想清你替谁拿东西。"
  ],
  "objective": "离开或记录神庙；王室遗物核心始终留在砾恩身上。",
  "flags": [
   "A_RELIC_CORE_UPGRADED",
   "E_TEMPLE_DEFEATED",
   "E_SPARED_BY_A",
   "CONTACT_E_A"
  ],
  "knowledge": [
   {
    "id": "C05.EA02.elf.k0",
    "text": "砾恩升级并装备王室遗物核心，无法再作为原遗物归还；他主动放莱姆斯离开，神庙身份仍未确认。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "survey",
    "label": "记录旧座、通道与刻纹",
    "flags": [
     "TEMPLE_SURVEYED"
    ],
    "knowledge": []
   },
   {
    "id": "leave",
    "label": "先离开神庙",
    "flags": [],
    "knowledge": []
   }
  ],
  "requires": [
   "C05.EA01.elf"
  ],
  "optional": false
 },
 "C05.EA01.ashen": {
  "id": "C05.EA01.ashen",
  "sourceScene": "C05.EA01",
  "chapter": 5,
  "pov": "ashen",
  "siteId": "ashen.a04",
  "title": "旧座前",
  "npc": "莱姆斯与砾恩",
  "lines": [
   "莱姆斯：停下。你不知道会发生什么。",
   "砾恩：你知道？",
   "莱姆斯：我知道这东西不属于你。",
   "砾恩：箱子上的印，能替它说话？",
   "莱姆斯：我不能空手让你离开。",
   "砾恩：那就让开手里的路。"
  ],
  "objective": "稳住核心，突破拦截；这是非致命剧情交手。",
  "flags": [],
  "knowledge": [],
  "choices": [
   {
    "id": "duel",
    "label": "稳住核心，突破拦截",
    "flags": [],
    "knowledge": []
   }
  ],
  "requires": [
   "C04.A01.ashen"
  ],
  "optional": false,
  "encounter": {
   "kind": "scenario",
   "scenarioId": "story.c05.ashen-duel",
   "nodeId": "ashen.a04.field",
   "count": 1
  }
 },
 "C05.EA02.ashen": {
  "id": "C05.EA02.ashen",
  "sourceScene": "C05.EA02",
  "chapter": 5,
  "pov": "ashen",
  "siteId": "ashen.a04",
  "title": "没有落下的手",
  "npc": "莱姆斯与砾恩",
  "lines": [
   "莱姆斯：你要杀我？",
   "砾恩：你还能走。",
   "莱姆斯：我回去后，还会有人来。",
   "砾恩：那就告诉他们，你见过什么。别添。",
   "莱姆斯：我会再来。",
   "砾恩：下回，先想清你替谁拿东西。"
  ],
  "objective": "离开或记录神庙；王室遗物核心始终留在砾恩身上。",
  "flags": [
   "A_RELIC_CORE_UPGRADED",
   "E_TEMPLE_DEFEATED",
   "E_SPARED_BY_A",
   "CONTACT_E_A"
  ],
  "knowledge": [
   {
    "id": "C05.EA02.ashen.k0",
    "text": "砾恩升级并装备王室遗物核心，无法再作为原遗物归还；他主动放莱姆斯离开，神庙身份仍未确认。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "survey",
    "label": "记录旧座、通道与刻纹",
    "flags": [
     "TEMPLE_SURVEYED"
    ],
    "knowledge": []
   },
   {
    "id": "leave",
    "label": "先离开神庙",
    "flags": [],
    "knowledge": []
   }
  ],
  "requires": [
   "C05.EA01.ashen"
  ],
  "optional": false,
  "grant": "ashen-primal-core"
 },
 "C05.E03.elf": {
  "id": "C05.E03.elf",
  "sourceScene": "C05.E03",
  "chapter": 5,
  "pov": "elf",
  "siteId": "elf.a01",
  "title": "回报",
  "npc": "大祭司",
  "lines": [
   "大祭司：遗物呢？",
   "莱姆斯：遗物已经升级成他的核心装备，无法再作为原来的遗物带回。",
   "大祭司：你看着他做了？",
   "莱姆斯：我试过阻止。他放我离开了。",
   "大祭司：放你离开，就能把夺走的东西算清？",
   "莱姆斯：我没有这么说。商队最初的袭击者，也还没查明。",
   "大祭司：你只需要记住，核心在烬裔手里。"
  ],
  "objective": "如实回报，不把未明袭击者等同烬裔。",
  "flags": [
   "E_RELIC_FAILURE_REPORTED"
  ],
  "knowledge": [],
  "choices": [
   {
    "id": "continue",
    "label": "照此办理",
    "flags": []
   }
  ],
  "requires": [
   "C05.EA02.elf"
  ],
  "optional": false
 },
 "C05.O01.dwarf": {
  "id": "C05.O01.dwarf",
  "sourceScene": "C05.O01",
  "chapter": 5,
  "pov": "dwarf",
  "siteId": "dwarf.a04",
  "title": "运输留底",
  "npc": "运务书记",
  "lines": [
   "运务书记：出库有印，交货有签。再往前的账在库里。",
   "布洛克：我问的是谁付了这趟车钱。",
   "运务书记：记录被调走了。我只能给你留底。",
   "布洛克：把调走的时刻和经手人记上。别只剩一句“不见了”。"
  ],
  "objective": "保全运输留底。",
  "flags": [
   "D_SHIPMENT_COPY_HELD"
  ],
  "knowledge": [
   {
    "id": "C05.O01.dwarf.k0",
    "text": "货检棚传来口信：遗物仍未追回。",
    "mode": "heard"
   }
  ],
  "choices": [
   {
    "id": "continue",
    "label": "照此办理",
    "flags": []
   }
  ],
  "requires": [
   "C04.DE01.dwarf"
  ],
  "optional": false
 },
 "C05.O01.human": {
  "id": "C05.O01.human",
  "sourceScene": "C05.O01",
  "chapter": 5,
  "pov": "human",
  "siteId": "human.a04",
  "title": "未完的货单",
  "npc": "车夫",
  "lines": [
   "车夫：这些能运回去了。少的，我重新点过。",
   "罗什福尔：缺项保留。那只封箱有人在追，我等他的消息。"
  ],
  "objective": "护送已找到的人员货物。",
  "flags": [
   "H_CARGO_RESCUED_PART"
  ],
  "knowledge": [
   {
    "id": "C05.O01.human.k0",
    "text": "货检棚传来口信：遗物仍未追回。",
    "mode": "heard"
   }
  ],
  "choices": [
   {
    "id": "continue",
    "label": "照此办理",
    "flags": []
   }
  ],
  "requires": [
   "C04.G01.human"
  ],
  "optional": false,
  "encounter": {
   "kind": "victory",
   "nodeId": "human.a04.field",
   "count": 1
  }
 },
 "C05.O01.goblin": {
  "id": "C05.O01.goblin",
  "sourceScene": "C05.O01",
  "chapter": 5,
  "pov": "goblin",
  "siteId": "goblin.a04",
  "title": "另一条粮路",
  "npc": "家人",
  "lines": [
   "快长大的那个：你是不是认识那个穿铁的人？",
   "奇克：认识他的剑。没想认识人。",
   "谨慎的那个：以后那条粮路还能走吗？",
   "奇克：先别走。我换一条。"
  ],
  "objective": "检查备用换粮路，清开小范围阻碍。",
  "flags": [
   "G_ALT_FOOD_ROUTE"
  ],
  "knowledge": [
   {
    "id": "C05.O01.goblin.k0",
    "text": "货检棚传来口信：遗物仍未追回。",
    "mode": "heard"
   }
  ],
  "choices": [
   {
    "id": "continue",
    "label": "照此办理",
    "flags": []
   }
  ],
  "requires": [
   "C04.G01.goblin"
  ],
  "optional": false,
  "encounter": {
   "kind": "victory",
   "nodeId": "goblin.a04.field",
   "count": 1
  }
 },
 "C06.D01.dwarf": {
  "id": "C06.D01.dwarf",
  "sourceScene": "C06.D01",
  "chapter": 6,
  "pov": "dwarf",
  "siteId": "dwarf.a05",
  "title": "还有人没出来",
  "npc": "矿班长",
  "lines": [
   "矿班长：里面那班还没出来！",
   "布洛克：人数。",
   "矿班长：点名册在我这。可刚才又进去救人了……",
   "布洛克：照名册找。出口撑住，活人一个个点。",
   "王室守军：这条道不通，我们赶不上增援。",
   "布洛克：我知道。先别让它再塌一次。"
  ],
  "objective": "先救人；固定危险段、清理阻碍并护送被困矿工。",
  "flags": [
   "D_MINERS_EVACUATED",
   "return-ring.dwarf.scene-open"
  ],
  "knowledge": [],
  "choices": [
   {
    "id": "rescue",
    "label": "先救人，照名册撤离",
    "flags": [],
    "knowledge": []
   }
  ],
  "requires": [
   "C05.O01.dwarf"
  ],
  "optional": false,
  "encounter": {
   "kind": "victory",
   "nodeId": "dwarf.a05.field",
   "count": 1
  }
 },
 "C06.D02.dwarf": {
  "id": "C06.D02.dwarf",
  "sourceScene": "C06.D02",
  "chapter": 6,
  "pov": "dwarf",
  "siteId": "dwarf.a05",
  "title": "没画在图上的路",
  "npc": "矿工",
  "lines": [
   "矿工：风从那边来。我听见后面还有人在敲。",
   "布洛克：图上没有这条。",
   "矿工：塌之前也没有口子。",
   "布洛克：那就先探一段。听见我敲，照着回。",
   "布洛克：这里不是矿层。",
   "矿工：这些沟槽是做什么的？",
   "布洛克：看不出来。别踩松边，先回去。"
  ],
  "objective": "救出新露通道另一侧的人，再决定是否调查。",
  "flags": [
   "R3_SITE_FOUND"
  ],
  "knowledge": [
   {
    "id": "C06.D02.dwarf.k0",
    "text": "矿难露出未记载通道与休眠旧石台；用途未知。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "survey",
    "label": "记录石台与通道",
    "flags": [
     "R3_SURVEYED_D"
    ],
    "knowledge": []
   },
   {
    "id": "leave",
    "label": "先带人离开",
    "flags": [],
    "knowledge": []
   }
  ],
  "requires": [
   "C06.D01.dwarf"
  ],
  "optional": false
 },
 "C06.D03.dwarf": {
  "id": "C06.D03.dwarf",
  "sourceScene": "C06.D03",
  "chapter": 6,
  "pov": "dwarf",
  "siteId": "dwarf.a05",
  "title": "点火的命令",
  "npc": "幸存运药工与执行者",
  "lines": [
   "运药工：我说过里面还有人。他们让我照旧搬药。",
   "布洛克：谁说的？",
   "运药工：来传令的军官。我认得他的印。",
   "执行者：要断王室的援军，不炸这段来不及。",
   "布洛克：你们等过撤人吗？",
   "执行者：命令没让等。",
   "布洛克：人还在下面，你们就点火。",
   "执行者：我只负责这一段。",
   "布洛克：那就把你这一段说清。上面的，我会接着找。"
  ],
  "objective": "保存证词与调拨记录，交王室记录者留副本。",
  "flags": [
   "D_SABOTAGE_WITNESS_SECURED",
   "D_COUP_LINK_PARTIAL"
  ],
  "knowledge": [
   {
    "id": "C06.D03.dwarf.k0",
    "text": "重臣一方为断王室援军，明知矿工未撤仍炸矿；尚无私卖资金闭环。",
    "mode": "confirmed"
   }
  ],
  "choices": [
   {
    "id": "record",
    "label": "保存证词和带印调拨单",
    "flags": [],
    "knowledge": []
   }
  ],
  "requires": [
   "C06.D02.dwarf"
  ],
  "optional": false
 },
 "C06.H01.human": {
  "id": "C06.H01.human",
  "sourceScene": "C06.H01",
  "chapter": 6,
  "pov": "human",
  "siteId": "human.a05",
  "title": "过不了的山口",
  "npc": "商路斥候",
  "lines": [
   "商路斥候：矮人那边打起来了。矿道也塌了。",
   "罗什福尔：商队还有人滞在那里？",
   "商路斥候：有。有人带了布洛克的口信。",
   "布洛克的口信：我在救矿里的人。别把车往这边送。封箱的账没断，等我。",
   "罗什福尔：把等候的车撤到能回头的地方。伤者留下，我给他们找路。"
  ],
  "objective": "护送滞留商旅到能进入的安全地区。",
  "flags": [
   "H_DWARF_WAR_REPORT"
  ],
  "knowledge": [
   {
    "id": "C06.H01.human.k0",
    "text": "布洛克正在救矿里的人，矮人内乱导致矿道受阻；尚未收到地下石台记录。",
    "mode": "heard"
   }
  ],
  "choices": [
   {
    "id": "escort",
    "label": "先护送伤者和滞留商旅",
    "flags": [],
    "knowledge": []
   }
  ],
  "requires": [
   "C05.O01.human"
  ],
  "optional": false,
  "encounter": {
   "kind": "victory",
   "nodeId": "human.a05.field",
   "count": 1
  }
 },
 "C06.E01.elf": {
  "id": "C06.E01.elf",
  "sourceScene": "C06.E01",
  "chapter": 6,
  "pov": "elf",
  "siteId": "elf.a05",
  "title": "被催走的担架",
  "npc": "救护者与征调者",
  "lines": [
   "救护者：这些药还要分给沿途村子。",
   "征调者：前线催着要。命令是先送军队。",
   "莱姆斯：留下村里的那份。我送这一批。",
   "征调者：你要替他们担责？",
   "莱姆斯：把我的名字写上。"
  ],
  "objective": "运送救护物资，安排不能随军的伤者。",
  "flags": [
   "E_FIELD_CARE_PREPARED"
  ],
  "knowledge": [],
  "choices": [
   {
    "id": "care",
    "label": "留下村里的份，运送救护物资",
    "flags": [],
    "knowledge": []
   }
  ],
  "requires": [
   "C05.E03.elf"
  ],
  "optional": false,
  "encounter": {
   "kind": "victory",
   "nodeId": "elf.a05.field",
   "count": 1
  }
 },
 "C06.G01.goblin": {
  "id": "C06.G01.goblin",
  "sourceScene": "C06.G01",
  "chapter": 6,
  "pov": "goblin",
  "siteId": "goblin.a05",
  "title": "被封的换粮路",
  "npc": "换粮者",
  "lines": [
   "换粮者：矮人打起来，路也卡了。这批换不成。",
   "奇克：粮已经带来了，你现在说？",
   "换粮者：我还想把车带回去。你能替我开路？",
   "奇克：不能。先挪开，我看看旁边。"
  ],
  "objective": "寻找还能通行的小路，避开正面战线。",
  "flags": [
   "G_FOOD_ROUTE_STRESSED",
   "return-ring.goblin.scene-open"
  ],
  "knowledge": [],
  "choices": [
   {
    "id": "detour",
    "label": "清开旁边的小路，先走这一趟",
    "flags": [],
    "knowledge": []
   }
  ],
  "requires": [
   "C05.O01.goblin"
  ],
  "optional": false,
  "encounter": {
   "kind": "victory",
   "nodeId": "goblin.a05.field",
   "count": 1
  }
 },
 "C06.A01.ashen": {
  "id": "C06.A01.ashen",
  "sourceScene": "C06.A01",
  "chapter": 6,
  "pov": "ashen",
  "siteId": "ashen.a05",
  "title": "回到族里",
  "npc": "族长",
  "lines": [
   "族长：你从外面带回了麻烦。",
   "砾恩：他们已经追到了神庙。",
   "族长：还会再来。",
   "砾恩：来的是个年轻祭司。我让他走了。",
   "族长：那他带回去的话，未必由他决定。",
   "砾恩：我没把这东西交给他。",
   "族长：我看见了。去看看外面的哨口。"
  ],
  "objective": "支援边哨，确认精灵部队集结；两件核心不交换。",
  "flags": [
   "A_CLAN_ALERTED",
   "return-ring.ashen.scene-open"
  ],
  "knowledge": [
   {
    "id": "C06.A01.ashen.k0",
    "text": "族长有自己的核心，王室遗物核心仍由砾恩持有。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "outpost",
    "label": "去支援外侧边哨",
    "flags": [],
    "knowledge": []
   }
  ],
  "requires": [
   "C05.EA02.ashen"
  ],
  "optional": false,
  "encounter": {
   "kind": "victory",
   "nodeId": "ashen.a05.field",
   "count": 1
  }
 },
 "C06.RR01.human": {
  "id": "C06.RR01.human",
  "sourceScene": "C06.RR01",
  "chapter": 6,
  "pov": "human",
  "siteId": "human.a05",
  "title": "归途之环的旧图样",
  "npc": "本族补给联系人",
  "lines": [
   "工匠：这份旧图样认得几种不起眼的东西。我把接法抄下来了。",
   "主角：哪几件？",
   "工匠：旧铸模片、磨损的银扣、褪色的叶脉、打结的铜丝，还有沉默的晶片。",
   "工匠：图样在这里。叫归途之环。",
   "主角：东西不齐呢？",
   "工匠：先把图样收好。东西还在，就还有机会。已经丢掉的，我补不出来。"
  ],
  "objective": "学习归途之环图样；不要求先持有任何材料。",
  "flags": [
   "return-ring.recipe-revealed",
   "return-ring.dwarf.scene-open",
   "return-ring.goblin.scene-open",
   "return-ring.ashen.scene-open",
   "C06_COMPLETE"
  ],
  "knowledge": [
   {
    "id": "C06.RR01.human.k0",
    "text": "学会归途之环图样；五件一次性旧物丢失后无法补领。",
    "mode": "heard"
   }
  ],
  "choices": [
   {
    "id": "learn",
    "label": "收好图样，确认学习",
    "flags": [],
    "knowledge": []
   }
  ],
  "requires": [
   "C06.H01.human"
  ],
  "optional": false
 },
 "C06.RR01.dwarf": {
  "id": "C06.RR01.dwarf",
  "sourceScene": "C06.RR01",
  "chapter": 6,
  "pov": "dwarf",
  "siteId": "dwarf.a05",
  "title": "归途之环的旧图样",
  "npc": "本族补给联系人",
  "lines": [
   "工匠：这份旧图样认得几种不起眼的东西。我把接法抄下来了。",
   "主角：哪几件？",
   "工匠：旧铸模片、磨损的银扣、褪色的叶脉、打结的铜丝，还有沉默的晶片。",
   "工匠：图样在这里。叫归途之环。",
   "主角：东西不齐呢？",
   "工匠：先把图样收好。东西还在，就还有机会。已经丢掉的，我补不出来。"
  ],
  "objective": "学习归途之环图样；不要求先持有任何材料。",
  "flags": [
   "return-ring.recipe-revealed",
   "return-ring.dwarf.scene-open",
   "return-ring.goblin.scene-open",
   "return-ring.ashen.scene-open",
   "C06_COMPLETE"
  ],
  "knowledge": [
   {
    "id": "C06.RR01.dwarf.k0",
    "text": "学会归途之环图样；五件一次性旧物丢失后无法补领。",
    "mode": "heard"
   }
  ],
  "choices": [
   {
    "id": "learn",
    "label": "收好图样，确认学习",
    "flags": [],
    "knowledge": []
   }
  ],
  "requires": [
   "C06.D03.dwarf"
  ],
  "optional": false
 },
 "C06.RR01.elf": {
  "id": "C06.RR01.elf",
  "sourceScene": "C06.RR01",
  "chapter": 6,
  "pov": "elf",
  "siteId": "elf.a05",
  "title": "归途之环的旧图样",
  "npc": "本族补给联系人",
  "lines": [
   "工匠：这份旧图样认得几种不起眼的东西。我把接法抄下来了。",
   "主角：哪几件？",
   "工匠：旧铸模片、磨损的银扣、褪色的叶脉、打结的铜丝，还有沉默的晶片。",
   "工匠：图样在这里。叫归途之环。",
   "主角：东西不齐呢？",
   "工匠：先把图样收好。东西还在，就还有机会。已经丢掉的，我补不出来。"
  ],
  "objective": "学习归途之环图样；不要求先持有任何材料。",
  "flags": [
   "return-ring.recipe-revealed",
   "return-ring.dwarf.scene-open",
   "return-ring.goblin.scene-open",
   "return-ring.ashen.scene-open",
   "C06_COMPLETE"
  ],
  "knowledge": [
   {
    "id": "C06.RR01.elf.k0",
    "text": "学会归途之环图样；五件一次性旧物丢失后无法补领。",
    "mode": "heard"
   }
  ],
  "choices": [
   {
    "id": "learn",
    "label": "收好图样，确认学习",
    "flags": [],
    "knowledge": []
   }
  ],
  "requires": [
   "C06.E01.elf"
  ],
  "optional": false
 },
 "C06.RR01.goblin": {
  "id": "C06.RR01.goblin",
  "sourceScene": "C06.RR01",
  "chapter": 6,
  "pov": "goblin",
  "siteId": "goblin.a05",
  "title": "归途之环的旧图样",
  "npc": "本族补给联系人",
  "lines": [
   "工匠：这份旧图样认得几种不起眼的东西。我把接法抄下来了。",
   "主角：哪几件？",
   "工匠：旧铸模片、磨损的银扣、褪色的叶脉、打结的铜丝，还有沉默的晶片。",
   "工匠：图样在这里。叫归途之环。",
   "主角：东西不齐呢？",
   "工匠：先把图样收好。东西还在，就还有机会。已经丢掉的，我补不出来。"
  ],
  "objective": "学习归途之环图样；不要求先持有任何材料。",
  "flags": [
   "return-ring.recipe-revealed",
   "return-ring.dwarf.scene-open",
   "return-ring.goblin.scene-open",
   "return-ring.ashen.scene-open",
   "C06_COMPLETE"
  ],
  "knowledge": [
   {
    "id": "C06.RR01.goblin.k0",
    "text": "学会归途之环图样；五件一次性旧物丢失后无法补领。",
    "mode": "heard"
   }
  ],
  "choices": [
   {
    "id": "learn",
    "label": "收好图样，确认学习",
    "flags": [],
    "knowledge": []
   }
  ],
  "requires": [
   "C06.G01.goblin"
  ],
  "optional": false
 },
 "C06.RR01.ashen": {
  "id": "C06.RR01.ashen",
  "sourceScene": "C06.RR01",
  "chapter": 6,
  "pov": "ashen",
  "siteId": "ashen.a05",
  "title": "归途之环的旧图样",
  "npc": "本族补给联系人",
  "lines": [
   "工匠：这份旧图样认得几种不起眼的东西。我把接法抄下来了。",
   "主角：哪几件？",
   "工匠：旧铸模片、磨损的银扣、褪色的叶脉、打结的铜丝，还有沉默的晶片。",
   "工匠：图样在这里。叫归途之环。",
   "主角：东西不齐呢？",
   "工匠：先把图样收好。东西还在，就还有机会。已经丢掉的，我补不出来。"
  ],
  "objective": "学习归途之环图样；不要求先持有任何材料。",
  "flags": [
   "return-ring.recipe-revealed",
   "return-ring.dwarf.scene-open",
   "return-ring.goblin.scene-open",
   "return-ring.ashen.scene-open",
   "C06_COMPLETE"
  ],
  "knowledge": [
   {
    "id": "C06.RR01.ashen.k0",
    "text": "学会归途之环图样；五件一次性旧物丢失后无法补领。",
    "mode": "heard"
   }
  ],
  "choices": [
   {
    "id": "learn",
    "label": "收好图样，确认学习",
    "flags": [],
    "knowledge": []
   }
  ],
  "requires": [
   "C06.A01.ashen"
  ],
  "optional": false
 },
 "C02.E00B.elf": {
  "id": "C02.E00B.elf",
  "sourceScene": "C02.E00B",
  "chapter": 2,
  "pov": "elf",
  "siteId": "elf.a02",
  "title": "简略处置",
  "npc": "守林者",
  "lines": [
   "[莱姆斯沿水痕来到根裂处，看见下方旧台和漏水口。]",
   "莱姆斯：水漏到下面了。先疏开旧渠，再把裂口加固。",
   "守林者：我带人做。下面的石台要动吗？",
   "莱姆斯：先不动。把位置和纹路记下来。",
   "守林者：水通了。旧台还是暗的，没人动过。",
   "莱姆斯：留人复查。有变化就送消息。"
  ],
  "objective": "确认修水安排并在泉口核实恢复出水；详细地下探索仍可选。",
  "flags": [
   "E_DRYSPRING_REPAIRED",
   "R2_SITE_SEEN_E",
   "return-ring.elf.scene-open"
  ],
  "knowledge": [
   {
    "id": "C02.E00B.elf.k0",
    "text": "看见漏水口下的休眠旧台，安排疏渠后核实泉水恢复；没有完整刻纹记录。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "arrange",
    "label": "确认疏渠加固，核实泉水恢复",
    "flags": []
   }
  ],
  "requires": [
   "C02.E01.elf"
  ],
  "requiresFlags": [
   "E_DRYSPRING_DEFERRED"
  ],
  "optional": false
 }
});
export const STORY_POVS=Object.freeze(["human","dwarf","elf","goblin","ashen"]);
export const STORY_CONTENT_VERSION=1;
