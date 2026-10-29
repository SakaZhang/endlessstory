import {PERSONAL_STORY_SCENES} from './personal-story-registry.js';
// Canon source: rpg-script-v1/screenplay-v1.md (C01–C08). No world-secret knowledge is inferred for absent POVs.
import {FINALE_SCENES} from './story-finale-scenes.js';
const freeze=o=>{if(o&&typeof o==='object'){Object.values(o).forEach(freeze);Object.freeze(o);}return o;};
export const STORY_SCENES=freeze({
 ...FINALE_SCENES,
 ...PERSONAL_STORY_SCENES,
 "C01.H01.human": {
  "id": "C01.H01.human",
  "sourceScene": "C01.H01",
  "chapter": 1,
  "pov": "human",
  "siteId": "goblin.a01",
  "title": "追回粮袋",
  "npc": "边境斥候",
  "lines": [
   "[路旁的粮粒断断续续，拖拽的印子一直伸向窄口。罗什福尔勒住脚步，先看了一眼被斥候扶回去的车夫，才循着地上的痕迹追去。]",
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
  "objective": "追上奇克，截住去路，设法追回粮袋。",
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
   "[家里的粮袋已经瘪了，袋底几粒碎粮被米芮拨到同一处。咔洛把背带偷偷套上肩，豆布蹲在碗边等着；奇克挨个看过他们，没去碰自己的空碗。]",
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
   "[追逐的脚步在低顶下骤然放大。窄道尽头不是寻常土壁，而是一面嵌着刻纹的旧石；奇克借着罗什福尔停步的空当，先往侧口挪了半步。]",
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
   "[追逐的脚步在低顶下骤然放大。窄道尽头不是寻常土壁，而是一面嵌着刻纹的旧石；奇克借着罗什福尔停步的空当，先往侧口挪了半步。]",
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
   "[满载的矿车压过接缝，支架发出一声短促的裂响。布洛克伸手拦住下一辆车，掌心贴上撑木，感觉到细小的震动还没有停。]",
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
   "[旧结构卡在树根旁，越用力扳，内侧的木片就扣得越紧。莱姆斯试了几次，终于松开手，蹲下来听守林者指出力道怎样传过去。]",
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
   "[修护者刚填上的裂口仍透着微光，砾恩却已把行囊移到脚边。门外的路暗下去，屋里缺着的物件一件件摆在台上，谁都看得见。]",
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
   "[旧矿图沾着撑木落下的碎屑。布洛克还想再看一遍刚加固的位置，矿班长却把另一封口信压到了图上。]",
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
   "[收回的粮袋和货单摆在一处，缺少的几项仍空着。罗什福尔拿起笔，没有把那些空白划掉。]",
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
   "[回来的粮已经分进几只碗里。奇克坐下时才发现，自己的那份也摆好了，三个家人都在等他先拿。]",
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
   "[砾恩沿门边收紧行囊，修护者却没有马上让路。两人都知道要换东西，就得走出熟悉的路段。]",
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
   "[空桶碰在石沿上，声音比流水响。村民守着见底的水槽，守林者拦在被挖开的树根前；莱姆斯站到两人中间，先低头找旧水痕。]",
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
   "[水痕在根下突然消失，石缝里却传来更低的流声。莱姆斯拨开泥层，顺着旧渠的边缘看见一处向下漏水的空隙。]",
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
   "[起先只是一线细水，接着水槽里慢慢积起了亮光。村民把空桶移过来，守林者仍扶着那段不能再挖的根，谁也没急着说先前是谁的错。]",
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
   "[库里的空位比货箱更显眼。保管人把出库页摊开，印记完整，经手人的名字也清楚；布洛克却在那枚印前停了很久。]",
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
   "[货单被压在案上，旁边只有那只箱子的封记。莱姆斯先看了路线，目光又落回没有列出的人名一栏。]",
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
   "[带来的消息里夹着一片烧黑的木屑。罗什福尔听见前车起火，便把目光从货单移向伤者暂歇的方向。]",
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
   "[前车的火还没灭，后方有人正把粮袋往阴处拖。奇克本想绕开火光，车底伸出的一只手却让他停住了。]",
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
   "[车轮歪在路边，烧断的绳子还冒着烟。砾恩走到裂开的封箱前，熟悉又陌生的微光映上胸口，他伸出的手停了一瞬。]",
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
   "[车夫的袖口熏黑了，说到起火时仍盯着来路。你让他先坐稳，再把最初的袭击、后来翻粮的人和抱走箱内物件的身影分开问清。]",
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
   "[车夫的袖口熏黑了，说到起火时仍盯着来路。你让他先坐稳，再把最初的袭击、后来翻粮的人和抱走箱内物件的身影分开问清。]",
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
   "[车夫的袖口熏黑了，说到起火时仍盯着来路。你让他先坐稳，再把最初的袭击、后来翻粮的人和抱走箱内物件的身影分开问清。]",
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
   "[奇克先看见路口的人，退了半步，又发现身后也不好绕。他把手从粮袋上挪开，摆出一副早知道会被问到的样子。]",
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
   "[奇克先看见路口的人，退了半步，又发现身后也不好绕。他把手从粮袋上挪开，摆出一副早知道会被问到的样子。]",
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
   "[奇克先看见路口的人，退了半步，又发现身后也不好绕。他把手从粮袋上挪开，摆出一副早知道会被问到的样子。]",
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
   "[脚步声沿着石道追了上来。砾恩停在岔口，手还护着从封箱里取出的东西；莱姆斯认出那一点光，挡住了另一侧出口。]",
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
   "[脚步声沿着石道追了上来。砾恩停在岔口，手还护着从封箱里取出的东西；莱姆斯认出那一点光，挡住了另一侧出口。]",
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
   "[旧座的刻纹逐渐亮起，砾恩离它只剩几步。莱姆斯追到近前，却说不出那东西为何会回应这里，只能先伸手拦住他。]",
   "莱姆斯：停下。你不知道会发生什么。",
   "砾恩：你知道？",
   "莱姆斯：我知道这东西不属于你。",
   "砾恩：箱子上的印，能替它说话？",
   "莱姆斯：我不能空手让你离开。",
   "砾恩：那就让开手里的路。"
  ],
  "objective": "尝试挡住砾恩，观察遗物与旧座之间的变化。",
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
   "[莱姆斯撑着地面坐起，等待的最后一下却没有落下来。砾恩站在几步外，确认他还能动，才把垂在身侧的手收回。]",
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
   "[旧座的刻纹逐渐亮起，砾恩离它只剩几步。莱姆斯追到近前，却说不出那东西为何会回应这里，只能先伸手拦住他。]",
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
   "[莱姆斯撑着地面坐起，等待的最后一下却没有落下来。砾恩站在几步外，确认他还能动，才把垂在身侧的手收回。]",
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
   "[莱姆斯回到案前，手里只剩那张仍完好的货单。来时必须带回的箱内遗物，如今已与砾恩结合；他找不到一句能把亲眼所见说得更轻的话。]",
   "大祭司：遗物呢？",
   "莱姆斯：那件遗物已经和他的核心结合了。我亲眼看见它在旧座前改变，没办法再装回箱子带走。",
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
   "[留底纸张的边缘已经起毛，调走原账的位置却很新。布洛克把手指按在空出来的栏边，要求书记把知道的那几项写全。]",
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
   "[找回的货物逐样装车，车夫却还捏着一张没勾完的单子。罗什福尔接过来，把能运走的和仍要追查的分在两边。]",
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
   "[粮袋进了门，奇克却没有像往常那样立刻解背带。家人看出他在想别的路，便把最想问的那一句留到了饭前。]",
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
   "[尘土从矿口一阵阵涌出，点名的人报到一半就被里面的敲击声打断。布洛克夺过一根撑木，把即将往里挤的人拦在身后。]",
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
   "[旧图到这里便没有了线，塌落的岩层后却漏出一缕风。矿工屏住呼吸，等远处那几下微弱的敲击再响起来。]",
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
   "[运药工手上的粉末还没擦净，一看见引火处就停住了。布洛克把他带离松动的顶板，等他能完整说出那道命令。]",
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
   "[等候的车队把山口前的空地挤满，有人仍盼着塌方很快就能清开。布洛克的口信送到时，罗什福尔先让最前面的车留下掉头的余地。]",
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
   "[药包已经按沿途村落分好，征调的人却把它们一并搬向军车。莱姆斯按住其中一包，上头写着村子的名字，还没有被划去。]",
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
   "[货已经背到约好的地方，换粮的车却在往回转。奇克放下袋子，肩上被背带勒出的痕还没松开，先朝封住的路看了一眼。]",
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
   "[族里的哨声比离开时密了，砾恩一路走到族长面前才停下。胸前的核心明明白白，他没有用行囊去遮。]",
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
   "[旧图样的折角已经薄得透光，工匠另拿一张纸，把几处连接慢慢描清。图上画的都不是显眼的宝物，更像路上随手就会错过的旧东西。]",
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
   "[旧图样的折角已经薄得透光，工匠另拿一张纸，把几处连接慢慢描清。图上画的都不是显眼的宝物，更像路上随手就会错过的旧东西。]",
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
   "[旧图样的折角已经薄得透光，工匠另拿一张纸，把几处连接慢慢描清。图上画的都不是显眼的宝物，更像路上随手就会错过的旧东西。]",
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
   "[旧图样的折角已经薄得透光，工匠另拿一张纸，把几处连接慢慢描清。图上画的都不是显眼的宝物，更像路上随手就会错过的旧东西。]",
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
   "[旧图样的折角已经薄得透光，工匠另拿一张纸，把几处连接慢慢描清。图上画的都不是显眼的宝物，更像路上随手就会错过的旧东西。]",
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
 },
 "C07.E01.elf": {
  "id": "C07.E01.elf",
  "sourceScene": "C07.E01",
  "chapter": 7,
  "pov": "elf",
  "siteId": "elf.a05",
  "title": "出发的命令",
  "npc": "大祭司与救护队",
  "lines": [
   "[命令传到之前，队伍已经在外面集结。莱姆斯听见行军的脚步，仍把商队遇袭时尚未查清的那一段重新说出来。]",
   "大祭司：遗物被夺，追索者遭到攻击。烬裔必须付出代价。",
   "莱姆斯：我们还没有查清最先袭击商队的人。",
   "大祭司：核心在他们手里。你自己带回的消息。",
   "莱姆斯：是一个人拿走的。",
   "大祭司：队伍已经出发。去你该去的位置。"
  ],
  "objective": "跟随部队通过首段险路，护住救护队；质疑命令不会取消已发起的战争。",
  "flags": [
   "WAR_DECLARED",
   "E_MARCH_JOINED",
   "C07_OPENING_COMPLETE"
  ],
  "knowledge": [
   {
    "id": "C07.E01.elf.k0",
    "text": "大祭司以遗物被夺为由出兵烬裔；最初袭车者仍未查清。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "protect",
    "label": "护住救护队，通过首段险路",
    "flags": []
   }
  ],
  "requires": [
   "C06.RR01.elf"
  ],
  "optional": false,
  "encounter": {
   "kind": "victory",
   "nodeId": "elf.a05.field",
   "count": 1
  }
 },
 "C07.A01.ashen": {
  "id": "C07.A01.ashen",
  "sourceScene": "C07.A01",
  "chapter": 7,
  "pov": "ashen",
  "siteId": "ashen.a05",
  "title": "哨口的第一夜",
  "npc": "族长与哨卫",
  "lines": [
   "[哨口前的火光一处接一处地退近，最后一班的应答还没有回来。砾恩朝外走了一步，族长先叫住了准备散开的守卫。]",
   "哨卫：他们没有停。前面的路已经封了。",
   "族长：让守不住的人退回来。别散在外面。",
   "砾恩：他们是来找我。",
   "族长：现在冲着我们的路来。你一个人出去，他们就会停？",
   "砾恩：我去接最后一班。"
  ],
  "objective": "守住撤退通道，接回哨卫；不能靠交出核心取消战争。",
  "flags": [
   "WAR_DECLARED",
   "A_FIRST_DEFENSE_DONE",
   "C07_OPENING_COMPLETE"
  ],
  "knowledge": [
   {
    "id": "C07.A01.ashen.k0",
    "text": "精灵部队进攻，前路封锁；族长仍持自己的核心，砾恩的王室遗物未转移。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "protect",
    "label": "接回最后一班哨卫",
    "flags": []
   }
  ],
  "requires": [
   "C06.RR01.ashen"
  ],
  "optional": false,
  "encounter": {
   "kind": "victory",
   "nodeId": "ashen.a05.field",
   "count": 1
  }
 },
 "C07.O01.dwarf": {
  "id": "C07.O01.dwarf",
  "sourceScene": "C07.O01",
  "chapter": 7,
  "pov": "dwarf",
  "siteId": "dwarf.a05",
  "title": "远处的战争",
  "npc": "矿班长与商路信使",
  "lines": [
   "[矿工刚从地下出来，行囊还没收好，新的封路消息便追到了这里。布洛克把证词交给两个人各收一份，又转身去看后面的退路。]",
   "信使：精灵和烬裔打起来了。两边都在收路。",
   "布洛克：矿里救出来的人先别往外送。",
   "矿班长：这里也不安全。",
   "布洛克：我去清后面的道。人挪到能撤的地方，证词带两份。"
  ],
  "objective": "保护矿工证人转移，保住炸矿与运输留底。",
  "flags": [
   "WAR_DECLARED",
   "D_WAR_EVACUATION_DONE",
   "C07_OPENING_COMPLETE"
  ],
  "knowledge": [
   {
    "id": "C07.O01.dwarf.k0",
    "text": "信使报告精灵与烬裔开战；货检棚口信链传来莱姆斯救护营的联络地点。",
    "mode": "heard"
   }
  ],
  "choices": [
   {
    "id": "protect",
    "label": "保护证人，携两份证词转移",
    "flags": []
   }
  ],
  "requires": [
   "C06.RR01.dwarf"
  ],
  "optional": false,
  "encounter": {
   "kind": "victory",
   "nodeId": "dwarf.a05.field",
   "count": 1
  }
 },
 "C07.O01.human": {
  "id": "C07.O01.human",
  "sourceScene": "C07.O01",
  "chapter": 7,
  "pov": "human",
  "siteId": "human.a05",
  "title": "远处的战争",
  "npc": "边境斥候与车夫",
  "lines": [
   "[封路的消息传开，车夫们争着往前挤，越急越把回头的地方堵死。罗什福尔先分开人和车，再听他们说哪些货等不起。]",
   "边境斥候：军队把商路封了。车夫要硬闯。",
   "罗什福尔：把他们拦在路口外，不要拦在箭底下。",
   "车夫：货再拖下去就坏了。",
   "罗什福尔：我找绕路。你把不能再等的列出来，别把人押在货上。"
  ],
  "objective": "救助被战线切断的商旅，分流到当前可进入的安全路。",
  "flags": [
   "WAR_DECLARED",
   "H_WAR_CORRIDOR_DONE",
   "C07_OPENING_COMPLETE"
  ],
  "knowledge": [
   {
    "id": "C07.O01.human.k0",
    "text": "商路被军队封锁；莱姆斯救护队来信说明前线伤员困境，没有提及大祭司隐秘动机。",
    "mode": "heard"
   }
  ],
  "choices": [
   {
    "id": "protect",
    "label": "分流商旅，先护住路口外的人",
    "flags": []
   }
  ],
  "requires": [
   "C06.RR01.human"
  ],
  "optional": false,
  "encounter": {
   "kind": "victory",
   "nodeId": "human.a05.field",
   "count": 1
  }
 },
 "C07.O01.goblin": {
  "id": "C07.O01.goblin",
  "sourceScene": "C07.O01",
  "chapter": 7,
  "pov": "goblin",
  "siteId": "goblin.a05",
  "title": "远处的战争",
  "npc": "换粮者与家人",
  "lines": [
   "[换粮摊开始收篷，奇克忙着问去向，直到背后响起熟悉的喘气声才转过头。咔洛已经跟到了这里，正伸手去够最重的那条背带。]",
   "换粮者：今天要走，明天这摊就不在了。",
   "奇克：换去哪？",
   "换粮者：能活着停车的地方。",
   "奇克：谁让你来的？",
   "快长大的那个：你一个人背不完。",
   "奇克：背不完还能回来。你跑进战线，我上哪儿找？"
  ],
  "objective": "护送家人返安全处，再完成这次换粮；奇克不是族群代表。",
  "flags": [
   "WAR_DECLARED",
   "G_WAR_FOOD_RUN_DONE",
   "C07_OPENING_COMPLETE"
  ],
  "knowledge": [
   {
    "id": "C07.O01.goblin.k0",
    "text": "换粮点受战线威胁；已与罗什福尔的人约好交换安全路情报。",
    "mode": "heard"
   }
  ],
  "choices": [
   {
    "id": "protect",
    "label": "先送家人回去，再走换粮路",
    "flags": []
   }
  ],
  "requires": [
   "C06.RR01.goblin"
  ],
  "optional": false,
  "encounter": {
   "kind": "victory",
   "nodeId": "goblin.a05.field",
   "count": 1
  }
 },
 "C07.X01.elf": {
  "id": "C07.X01.elf",
  "sourceScene": "C07.X01",
  "chapter": 7,
  "pov": "elf",
  "siteId": "elf.a06",
  "title": "第二次争夺",
  "npc": "士兵与传令者",
  "lines": [
   "[担架还停在昨天争过的坡口，新的命令又沿队伍传下来。莱姆斯弯腰扶起伤兵的一侧，没有立刻去接那面催进的旗。]",
   "士兵：又是这里？昨天的人还没抬完。",
   "莱姆斯：先把能动的带到坡后。",
   "传令者：大祭司要通路。立刻向前。",
   "莱姆斯：路上躺着自己人。",
   "传令者：命令没有改。"
  ],
  "objective": "再次开辟掩护路线，送走伤员后抵达部队集合点；不跳过持续战事。",
  "flags": [
   "E_WAR_ATTRITION_SEEN"
  ],
  "knowledge": [
   {
    "id": "C07.X01.elf.k0",
    "text": "同一段通道再次被争夺；大祭司的前进命令未因伤员而改变。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "protect",
    "label": "先把伤员送到坡后，再抵达集合点",
    "flags": []
   }
  ],
  "requires": [
   "C07.E01.elf"
  ],
  "optional": false,
  "encounter": {
   "kind": "victory",
   "nodeId": "elf.a06.field",
   "count": 1
  }
 },
 "C07.X01.ashen": {
  "id": "C07.X01.ashen",
  "sourceScene": "C07.X01",
  "chapter": 7,
  "pov": "ashen",
  "siteId": "ashen.a06",
  "title": "第二次争夺",
  "npc": "修护者与哨卫",
  "lines": [
   "[刚填好的裂口再次崩开，修护者掌下的碎屑落了一地。砾恩望过后方仍能通行的窄道，开始催人放下搬不走的东西。]",
   "修护者：这里补不住了。",
   "砾恩：人走，东西别搬。",
   "哨卫：再退，里面就是族地。",
   "砾恩：留在这儿，谁也守不了。"
  ],
  "objective": "哨墙再度坍塌；清开掩护路线后撤到内线。",
  "flags": [
   "A_WAR_ATTRITION_SEEN"
  ],
  "knowledge": [
   {
    "id": "C07.X01.ashen.k0",
    "text": "补过的哨墙再度坍塌，守军被迫向族地内线撤退。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "protect",
    "label": "掩护伤者，撤到内线",
    "flags": []
   }
  ],
  "requires": [
   "C07.A01.ashen"
  ],
  "optional": false,
  "encounter": {
   "kind": "victory",
   "nodeId": "ashen.a06.field",
   "count": 1
  }
 },
 "C07.EA02.elf": {
  "id": "C07.EA02.elf",
  "sourceScene": "C07.EA02",
  "chapter": 7,
  "pov": "elf",
  "siteId": "ashen.a06",
  "title": "直取族长",
  "npc": "前线混战",
  "lines": [
   "[精灵部队被困在侧翼。大祭司越过伤者，直向族长所在处前进。]",
   "莱姆斯：左翼还没有撤出来！",
   "大祭司：继续前进。",
   "族长：想进来，就从这里过。"
  ],
  "objective": "清开去左翼的路，赶到族长所在处；本场不是击杀大祭司。",
  "flags": [
   "CHIEFTAIN_KILLED",
   "PRIEST_HAS_CHIEFTAIN_CORE"
  ],
  "knowledge": [
   {
    "id": "C07.EA02.elf.k0",
    "text": "大祭司杀死族长、取走族长自身核心后离开战阵；砾恩的升级王室遗物核心没有转移。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "照现场情况行动",
    "flags": []
   }
  ],
  "requires": [
   "C07.X01.elf"
  ],
  "optional": false,
  "encounter": {
   "kind": "scenario",
   "scenarioId": "story.c07-ea02-elf",
   "nodeId": "ashen.a06.field",
   "count": 1
  }
 },
 "C07.EA03.elf": {
  "id": "C07.EA03.elf",
  "sourceScene": "C07.EA03",
  "chapter": 7,
  "pov": "elf",
  "siteId": "ashen.a06",
  "title": "留在后面的人",
  "npc": "大祭司与砾恩",
  "lines": [
   "[大祭司带着族长核心离开战阵，仍被包围的精灵兵没有接应。]",
   "莱姆斯：您往哪里去？部队还在里面！",
   "大祭司：他们会退出来。",
   "莱姆斯：没有人接应，他们怎么退？",
   "大祭司：让开。",
   "莱姆斯：把人带回去。现在。",
   "大祭司：你在命令我？",
   "莱姆斯：是您把他们带来的。"
  ],
  "objective": "挡住大祭司，为伤员争取撤离；对方力量远胜，抵抗后莱姆斯将被封印。",
  "flags": [
   "E_SEALED",
   "A_WITNESSED_E_REBELLION"
  ],
  "knowledge": [
   {
    "id": "C07.EA03.elf.k0",
    "text": "莱姆斯为被抛下的兵阻挡大祭司，败北被封；砾恩亲眼见到，仍不知道惧死动机。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "resist",
    "label": "挡住大祭司，给伤员争取撤离",
    "flags": []
   }
  ],
  "requires": [
   "C07.EA02.elf"
  ],
  "optional": false,
  "encounter": {
   "kind": "scenario",
   "scenarioId": "story.c07-ea03-elf",
   "nodeId": "ashen.a06.field",
   "count": 1
  }
 },
 "C07.EA02.ashen": {
  "id": "C07.EA02.ashen",
  "sourceScene": "C07.EA02",
  "chapter": 7,
  "pov": "ashen",
  "siteId": "ashen.a06",
  "title": "直取族长",
  "npc": "前线混战",
  "lines": [
   "[精灵部队被困在侧翼。大祭司越过伤者，直向族长所在处前进。]",
   "莱姆斯：左翼还没有撤出来！",
   "大祭司：继续前进。",
   "族长：想进来，就从这里过。"
  ],
  "objective": "突破阻拦，赶往族长；本场不是击杀大祭司。",
  "flags": [
   "CHIEFTAIN_KILLED",
   "PRIEST_HAS_CHIEFTAIN_CORE"
  ],
  "knowledge": [
   {
    "id": "C07.EA02.ashen.k0",
    "text": "大祭司杀死族长、取走族长自身核心后离开战阵；砾恩的升级王室遗物核心没有转移。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "照现场情况行动",
    "flags": []
   }
  ],
  "requires": [
   "C07.X01.ashen"
  ],
  "optional": false,
  "encounter": {
   "kind": "scenario",
   "scenarioId": "story.c07-ea02-ashen",
   "nodeId": "ashen.a06.field",
   "count": 1
  }
 },
 "C07.EA03.ashen": {
  "id": "C07.EA03.ashen",
  "sourceScene": "C07.EA03",
  "chapter": 7,
  "pov": "ashen",
  "siteId": "ashen.a06",
  "title": "留在后面的人",
  "npc": "大祭司与砾恩",
  "lines": [
   "[大祭司带着族长核心离开战阵，仍被包围的精灵兵没有接应。]",
   "莱姆斯：您往哪里去？部队还在里面！",
   "大祭司：他们会退出来。",
   "莱姆斯：没有人接应，他们怎么退？",
   "大祭司：让开。",
   "莱姆斯：把人带回去。现在。",
   "大祭司：你在命令我？",
   "莱姆斯：是您把他们带来的。",
   "[莱姆斯举起武器阻挡大祭司，随后败退。砾恩在断墙后亲眼看着。]",
   "大祭司：你就在这里，想清自己的位置。",
   "[封印合拢。砾恩靠近，却被外涌的力量逼退。]",
   "砾恩：莱姆斯。",
   "[通向大祭司的近路崩断了。砾恩试着往前一步，碎石便落入裂隙；他转回封印旁，向仍在撤离的人呼喊，寻找能帮忙开路的人。]"
  ],
  "objective": "目击莱姆斯因保护弃军反抗而被封；确定从外侧营救的起点。",
  "flags": [
   "E_SEALED",
   "A_WITNESSED_E_REBELLION"
  ],
  "knowledge": [
   {
    "id": "C07.EA03.ashen.k0",
    "text": "莱姆斯为被抛下的兵阻挡大祭司，败北被封；砾恩亲眼见到，仍不知道惧死动机。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "seal",
    "label": "先查看封印",
    "flags": []
   },
   {
    "id": "pursue",
    "label": "先追到断路，再回封印求援",
    "flags": [
     "A_PURSUIT_BLOCKED"
    ]
   }
  ],
  "requires": [
   "C07.EA02.ashen"
  ],
  "optional": false
 },
 "C07.O02.dwarf": {
  "id": "C07.O02.dwarf",
  "sourceScene": "C07.O02",
  "chapter": 7,
  "pov": "dwarf",
  "siteId": "dwarf.a05",
  "title": "从战场送出的口信",
  "npc": "幸存救护者",
  "lines": [
   "[口信送来时，布洛克正替撤出来的人整理去路。听见莱姆斯被封在前线，他没有立刻动身，而是先让信使指出伤员真正走过的那一条线。]",
   "信使：莱姆斯拦住了大祭司。他没跟着走。他被封在前线了。",
   "布洛克：谁在那儿？",
   "信使：一个叫砾恩的烬裔。他没走，说需要能开路的人。",
   "布洛克：把伤员的退路画给我。别让我走进你们进军的路。"
  ],
  "objective": "接下有来源的撤离路线，沿路线前往前线救护点；不假装亲见异地交手。",
  "flags": [
   "SELECTED_HERO_SEAL_ROUTE_KNOWN",
   "E_SEALED"
  ],
  "knowledge": [
   {
    "id": "C07.O02.dwarf.k0",
    "text": "幸存救护者报告莱姆斯阻止大祭司弃军，被封在前线；砾恩留在封印外求援。",
    "mode": "heard"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "照现场情况行动",
    "flags": []
   }
  ],
  "requires": [
   "C07.O01.dwarf"
  ],
  "optional": false
 },
 "C07.O02.human": {
  "id": "C07.O02.human",
  "sourceScene": "C07.O02",
  "chapter": 7,
  "pov": "human",
  "siteId": "human.a05",
  "title": "从战场送出的口信",
  "npc": "幸存救护者",
  "lines": [
   "[信使还穿着撤离时的脏衣，手里紧攥着路图。罗什福尔先问清消息从何处来，再让他坐下喘匀气。]",
   "信使：莱姆斯拦住了大祭司。他被封在前线了。",
   "罗什福尔：这消息是谁交给你的？",
   "信使：救护队。我从那边撤出来的。布洛克留过你的名字。",
   "罗什福尔：带我到安全接应点。你不必再进战场。"
  ],
  "objective": "接下有来源的撤离路线，沿路线前往前线救护点；不假装亲见异地交手。",
  "flags": [
   "SELECTED_HERO_SEAL_ROUTE_KNOWN",
   "E_SEALED"
  ],
  "knowledge": [
   {
    "id": "C07.O02.human.k0",
    "text": "幸存救护者报告莱姆斯阻止大祭司弃军，被封在前线；砾恩留在封印外求援。",
    "mode": "heard"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "照现场情况行动",
    "flags": []
   }
  ],
  "requires": [
   "C07.O01.human"
  ],
  "optional": false
 },
 "C07.O02.goblin": {
  "id": "C07.O02.goblin",
  "sourceScene": "C07.O02",
  "chapter": 7,
  "pov": "goblin",
  "siteId": "goblin.a05",
  "title": "从战场送出的口信",
  "npc": "幸存救护者",
  "lines": [
   "[奇克把图摊到光下，指尖沿着一段没有大路标记的边缘挪动。他嘴上仍在抱怨，手却已经停在可能绕开的窄处。]",
   "信使：莱姆斯拦住了大祭司。他被封在前线了。",
   "信使：罗什福尔说，你能找不走大路的办法。",
   "奇克：他说得倒轻巧。那边可都是兵。",
   "信使：有伤员，还有个被封住的人。路图在这。",
   "奇克：路开了，你们把沿路的人一起带出来。别让我只赚一条死路。"
  ],
  "objective": "接下有来源的撤离路线，沿路线前往前线救护点；不假装亲见异地交手。",
  "flags": [
   "SELECTED_HERO_SEAL_ROUTE_KNOWN",
   "E_SEALED"
  ],
  "knowledge": [
   {
    "id": "C07.O02.goblin.k0",
    "text": "幸存救护者报告莱姆斯阻止大祭司弃军，被封在前线；砾恩留在封印外求援。",
    "mode": "heard"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "照现场情况行动",
    "flags": []
   }
  ],
  "requires": [
   "C07.O01.goblin"
  ],
  "optional": false
 },
 "C08.E01.elf": {
  "id": "C08.E01.elf",
  "sourceScene": "C08.E01",
  "chapter": 8,
  "pov": "elf",
  "siteId": "ashen.a06",
  "title": "封印里面 · 第一层",
  "npc": "封印内侧",
  "lines": [
   "[封印里的声音像隔着厚石。莱姆斯沿边缘摸索，每次伸手都被推回原处；他停下来敲了两下，等外面有没有回应。]",
   "莱姆斯：能听见吗？外面还有人吗？",
   "[远处传来一次闷响，随后停下。]",
   "莱姆斯：不是全封死的。"
  ],
  "objective": "击退第一层显现的阻拦，抵达下一层；这是可胜的真实战斗。",
  "flags": [
   "E_SEAL_FIRST_CLEARED"
  ],
  "knowledge": [],
  "choices": [
   {
    "id": "proceed",
    "label": "照现场情况行动",
    "flags": []
   }
  ],
  "requires": [
   "C07.EA03.elf"
  ],
  "optional": false,
  "encounter": {
   "kind": "scenario",
   "scenarioId": "story.c08-e01-elf",
   "nodeId": "ashen.a06.field",
   "count": 1
  }
 },
 "C08.E02.elf": {
  "id": "C08.E02.elf",
  "sourceScene": "C08.E02",
  "chapter": 8,
  "pov": "elf",
  "siteId": "ashen.a06",
  "title": "封印里面 · 第二层",
  "npc": "封印内侧",
  "lines": [
   "[退回原处的力道一次比一次清楚。莱姆斯不再硬往前撞，而是想起守林者教他拆旧结构时，先卡住回弹的那一步。]",
   "莱姆斯：它在把我往回推。那就别顺着它走。"
  ],
  "objective": "解除通向中心的第二层阻拦；已完成的第一层不重打。",
  "flags": [
   "E_SEAL_SECOND_CLEARED"
  ],
  "knowledge": [],
  "choices": [
   {
    "id": "proceed",
    "label": "照现场情况行动",
    "flags": []
   }
  ],
  "requires": [
   "C08.E01.elf"
  ],
  "optional": false,
  "encounter": {
   "kind": "scenario",
   "scenarioId": "story.c08-e02-elf",
   "nodeId": "ashen.a06.field",
   "count": 1
  }
 },
 "C08.E03.elf": {
  "id": "C08.E03.elf",
  "sourceScene": "C08.E03",
  "chapter": 8,
  "pov": "elf",
  "siteId": "ashen.a06",
  "title": "封印核心",
  "npc": "回弹闭合的核心",
  "lines": [
   "[第三层封印核心显露；普通攻击无法解除它。]",
   "莱姆斯：卡住回弹……就是这里。击破它！",
   "砾恩在外：往左。那里松了。",
   "莱姆斯：你是谁？",
   "砾恩：先出来。"
  ],
  "objective": "进入封印核心战，使用先前取得的旧制楔钉一击解除；道具会消耗一次。",
  "flags": [
   "E_WEDGE_USED",
   "E_SEAL_CORE_OPENED",
   "E_UNSEALED"
  ],
  "knowledge": [
   {
    "id": "C08.E03.elf.k0",
    "text": "旧制楔钉在解除封印核心时耗尽；砾恩从外侧帮助打开通道。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "use",
    "label": "锁定封印核心，准备使用旧制楔钉",
    "flags": []
   }
  ],
  "requires": [
   "C08.E02.elf"
  ],
  "optional": false,
  "encounter": {
   "kind": "scenario",
   "scenarioId": "story.c08-e03-elf",
   "nodeId": "ashen.a06.field",
   "count": 1
  },
  "questTool": "old-wedge",
  "requiresFlags": [
   "E_WEDGE_AVAILABLE",
   "E_WEDGE_LEARNED"
  ]
 },
 "C08.O01.dwarf": {
  "id": "C08.O01.dwarf",
  "sourceScene": "C08.O01",
  "chapter": 8,
  "pov": "dwarf",
  "siteId": "ashen.a06",
  "title": "封印外面",
  "npc": "砾恩与救护者",
  "lines": [
   "[封印表面的光时紧时松，散落的石屑碰上去便弹回来。砾恩站在刚才被逼退的位置，给赶来的援手指出莱姆斯消失的那一侧。]",
   "砾恩：他挡过那个人。就在这儿。",
   "布洛克：你看见他被封进去？",
   "砾恩：看见了。",
   "布洛克：那就先找不受力的边。别冲着最硬的打。"
  ],
  "objective": "清除外围威胁，循内部敲击打开外侧约束；莱姆斯自行处理内部层次。",
  "flags": [
   "E_SEAL_OUTER_OPENED",
   "E_UNSEALED"
  ],
  "knowledge": [
   {
    "id": "C08.O01.dwarf.k0",
    "text": "内部传来两次战斗声，最后传来任务道具解除核心的声响；莱姆斯从内部打开通道。",
    "mode": "heard"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "照现场情况行动",
    "flags": []
   }
  ],
  "requires": [
   "C07.O02.dwarf"
  ],
  "optional": false,
  "encounter": {
   "kind": "scenario",
   "scenarioId": "story.c08-o01-dwarf",
   "nodeId": "ashen.a06.field",
   "count": 1
  }
 },
 "C08.O01.human": {
  "id": "C08.O01.human",
  "sourceScene": "C08.O01",
  "chapter": 8,
  "pov": "human",
  "siteId": "ashen.a06",
  "title": "封印外面",
  "npc": "砾恩与救护者",
  "lines": [
   "[封印表面的光时紧时松，散落的石屑碰上去便弹回来。砾恩站在刚才被逼退的位置，给赶来的援手指出莱姆斯消失的那一侧。]",
   "砾恩：他挡过那个人。就在这儿。",
   "罗什福尔：他为什么拦大祭司？",
   "砾恩：为了被丢下的兵。",
   "罗什福尔：我清开外围。你认得刚才封起来的位置，带路。"
  ],
  "objective": "清除外围威胁，循内部敲击打开外侧约束；莱姆斯自行处理内部层次。",
  "flags": [
   "E_SEAL_OUTER_OPENED",
   "E_UNSEALED"
  ],
  "knowledge": [
   {
    "id": "C08.O01.human.k0",
    "text": "内部传来两次战斗声，最后传来任务道具解除核心的声响；莱姆斯从内部打开通道。",
    "mode": "heard"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "照现场情况行动",
    "flags": []
   }
  ],
  "requires": [
   "C07.O02.human"
  ],
  "optional": false,
  "encounter": {
   "kind": "scenario",
   "scenarioId": "story.c08-o01-human",
   "nodeId": "ashen.a06.field",
   "count": 1
  }
 },
 "C08.O01.goblin": {
  "id": "C08.O01.goblin",
  "sourceScene": "C08.O01",
  "chapter": 8,
  "pov": "goblin",
  "siteId": "ashen.a06",
  "title": "封印外面",
  "npc": "砾恩与救护者",
  "lines": [
   "[封印表面的光时紧时松，散落的石屑碰上去便弹回来。砾恩站在刚才被逼退的位置，给赶来的援手指出莱姆斯消失的那一侧。]",
   "砾恩：他挡过那个人。就在这儿。",
   "奇克：这东西会把人弹回来？",
   "砾恩：会。",
   "奇克：那别催我。我要找能伸手进去的缝。"
  ],
  "objective": "清除外围威胁，循内部敲击打开外侧约束；莱姆斯自行处理内部层次。",
  "flags": [
   "E_SEAL_OUTER_OPENED",
   "E_UNSEALED"
  ],
  "knowledge": [
   {
    "id": "C08.O01.goblin.k0",
    "text": "内部传来两次战斗声，最后传来任务道具解除核心的声响；莱姆斯从内部打开通道。",
    "mode": "heard"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "照现场情况行动",
    "flags": []
   }
  ],
  "requires": [
   "C07.O02.goblin"
  ],
  "optional": false,
  "encounter": {
   "kind": "scenario",
   "scenarioId": "story.c08-o01-goblin",
   "nodeId": "ashen.a06.field",
   "count": 1
  }
 },
 "C08.O01.ashen": {
  "id": "C08.O01.ashen",
  "sourceScene": "C08.O01",
  "chapter": 8,
  "pov": "ashen",
  "siteId": "ashen.a06",
  "title": "封印外面",
  "npc": "砾恩与救护者",
  "lines": [
   "[封印表面的光时紧时松，散落的石屑碰上去便弹回来。砾恩站在刚才被逼退的位置，给赶来的援手指出莱姆斯消失的那一侧。]",
   "砾恩：他挡过那个人。就在这儿。",
   "救护者：你还会帮我们？",
   "砾恩：我帮里面那个。其他的，以后说。"
  ],
  "objective": "清除外围威胁，循内部敲击打开外侧约束；莱姆斯自行处理内部层次。",
  "flags": [
   "E_SEAL_OUTER_OPENED",
   "E_UNSEALED"
  ],
  "knowledge": [
   {
    "id": "C08.O01.ashen.k0",
    "text": "内部传来两次战斗声，最后传来任务道具解除核心的声响；莱姆斯从内部打开通道。",
    "mode": "heard"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "照现场情况行动",
    "flags": []
   }
  ],
  "requires": [
   "C07.EA03.ashen"
  ],
  "optional": false,
  "encounter": {
   "kind": "scenario",
   "scenarioId": "story.c08-o01-ashen",
   "nodeId": "ashen.a06.field",
   "count": 1
  }
 },
 "C08.X01.human": {
  "id": "C08.X01.human",
  "sourceScene": "C08.X01",
  "chapter": 8,
  "pov": "human",
  "siteId": "ashen.a06",
  "title": "出来之后",
  "npc": "莱姆斯与砾恩",
  "lines": [
   "[封印松开的尘灰还没有落尽，莱姆斯便转头去看大祭司离开的方向。砾恩挡在他的视线里，两人都知道有些话必须当面说清。]",
   "莱姆斯：是你。",
   "砾恩：你看见他拿走了什么。",
   "莱姆斯：族长的核心。我看见了。",
   "砾恩：我要找到他。",
   "莱姆斯：我也是。",
   "砾恩：别挡我的路。",
   "莱姆斯：你也别挡我救人。",
   "罗什福尔：伤员有人接应。先把追踪方向说清。"
  ],
  "objective": "带着保留共同追踪；不是五人提前结盟。",
  "flags": [
   "E_UNSEALED"
  ],
  "knowledge": [
   {
    "id": "C08.X01.human.k0",
    "text": "莱姆斯已经解封，与砾恩带着戒心同行；大祭司夺走的是族长自身核心。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "照现场情况行动",
    "flags": []
   }
  ],
  "requires": [
   "C08.O01.human"
  ],
  "optional": false
 },
 "C08.X02.human": {
  "id": "C08.X02.human",
  "sourceScene": "C08.X02",
  "chapter": 8,
  "pov": "human",
  "siteId": "ashen.a07",
  "title": "留下的痕迹",
  "npc": "莱姆斯与砾恩",
  "lines": [
   "[石屑被同一方向的光照亮，前方的门刚被强行打开。]",
   "莱姆斯：他没再带人。",
   "砾恩：拿到核心就走。军队只替他开了路。",
   "莱姆斯：我当时没有看出来。",
   "砾恩：现在看路。"
  ],
  "objective": "追查痕迹，清开守路威胁，找到中央主祭坛入口。",
  "flags": [
   "MAIN_ALTAR_ROUTE_FOUND"
  ],
  "knowledge": [
   {
    "id": "C08.X02.human.k0",
    "text": "大祭司取得族长核心后独自赶往主祭坛；仍不知道他的惧死动机。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "照现场情况行动",
    "flags": []
   }
  ],
  "requires": [
   "C08.X01.human"
  ],
  "optional": false,
  "encounter": {
   "kind": "scenario",
   "scenarioId": "story.c08-x02-human",
   "nodeId": "ashen.a07.field",
   "count": 1
  }
 },
 "C08.X03.human": {
  "id": "C08.X03.human",
  "sourceScene": "C08.X03",
  "chapter": 8,
  "pov": "human",
  "siteId": "ashen.a07",
  "title": "主祭坛",
  "npc": "大祭司",
  "lines": [
   "[族长核心置入中央结构，已亮起。砾恩胸前仍是升级后的王室遗物核心。]",
   "莱姆斯：停下。你把他们留在战场，就是为了这个？",
   "大祭司：我等不到下一次了。",
   "莱姆斯：等什么？",
   "大祭司：等这具身体慢慢死掉。你还年轻，当然觉得时间很多。",
   "砾恩：把他的核心拿出来。",
   "大祭司：原本该用的是你拿走的那一枚。如今，只能用这枚强行开坛。",
   "莱姆斯：这会打开什么？",
   "大祭司：我知道门外有什么。我曾把它们挡在外面。",
   "砾恩：你凭什么知道？",
   "大祭司：当年的矮人王、人族国王，还有我。是我们造出了烬裔。",
   "大祭司：你们就是为挡住外来的东西而生的。",
   "砾恩：那也不是你拿走他的理由。",
   "莱姆斯：如果你知道，就更该停下！"
  ],
  "objective": "记录大祭司当场宣称的古代身份和惧死动机；尚未得到独立遗迹印证。",
  "flags": [
   "PRIEST_MORTALITY_MOTIVE_HEARD",
   "ASHEN_ORIGIN_CLAIM_HEARD"
  ],
  "knowledge": [
   {
    "id": "C08.X03.human.k0",
    "text": "大祭司在主祭坛承认自己惧死，宣称曾与古代两位国王创造烬裔；古代身份与起源仍待独立记录印证。",
    "mode": "heard"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "照现场情况行动",
    "flags": []
   }
  ],
  "requires": [
   "C08.X02.human"
  ],
  "optional": false
 },
 "C08.X04A.human": {
  "id": "C08.X04A.human",
  "sourceScene": "C08.X04A",
  "chapter": 8,
  "pov": "human",
  "siteId": "ashen.a07",
  "title": "打断施法",
  "npc": "仪式外围",
  "lines": [
   "[祭坛外缘的光一层层收紧，族长的核心悬在中央。你们沿空隙逼近，想先打断大祭司的施法，再设法取回它。]",
   "[脚下的纹路仍在向中央汇流，没人能断定停下施法后它是否也会停。莱姆斯沿着石沿寻找落脚处，砾恩紧盯着那枚核心。]"
  ],
  "objective": "突破仪式外围，尝试切断施法、救出核心；这不是保证关闭门户。",
  "flags": [
   "RITUAL_CAST_INTERRUPTED"
  ],
  "knowledge": [
   {
    "id": "C08.X04A.human.k0",
    "text": "持续施法已被打断，核心仍自行运转；仅让大祭司停手已经无用。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "照现场情况行动",
    "flags": []
   }
  ],
  "requires": [
   "C08.X03.human"
  ],
  "optional": false,
  "encounter": {
   "kind": "scenario",
   "scenarioId": "story.c08-x04a-human",
   "nodeId": "ashen.a07.field",
   "count": 1
  }
 },
 "C08.X04.human": {
  "id": "C08.X04.human",
  "sourceScene": "C08.X04",
  "chapter": 8,
  "pov": "human",
  "siteId": "ashen.a07",
  "title": "没能关上的门",
  "npc": "涌出的界外力量",
  "lines": [
   "莱姆斯：他已经停手了。",
   "砾恩：下面还在动。",
   "[失控的力量沿石面骤然外涌，刚才还能落脚的地方已经裂开。你们不得不放弃接近核心，转身寻找退路。]",
   "[核心已激活，门户打开，恶魔涌入。]",
   "大祭司：不……不该这样。",
   "[反噬蔓延，大祭司退不出去，倒在中央结构旁。]",
   "大祭司：我还不能……",
   "莱姆斯：后退！门已经开了！",
   "砾恩：我看见了。",
   "罗什福尔：靠着退路，别被冲散！"
  ],
  "objective": "抵挡首波冲击并撤出中心；成功撤离不等于阻止仪式或关闭门户。",
  "flags": [
   "RITUAL_SUCCEEDED",
   "PRIEST_DIED_BACKLASH",
   "INVASION_BEGAN"
  ],
  "knowledge": [
   {
    "id": "C08.X04.human.k0",
    "text": "仪式成功，恶魔入侵，大祭司死于反噬；门户仍运转。精灵与烬裔转向抵抗入侵，全境敌对封锁解除，并不代表和解。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "照现场情况行动",
    "flags": []
   }
  ],
  "requires": [
   "C08.X04A.human"
  ],
  "optional": false,
  "encounter": {
   "kind": "scenario",
   "scenarioId": "story.c08-x04-human",
   "nodeId": "ashen.a07.field",
   "count": 1
  }
 },
 "C08.X05.human": {
  "id": "C08.X05.human",
  "sourceScene": "C08.X05",
  "chapter": 8,
  "pov": "human",
  "siteId": "ashen.a07",
  "title": "只守住这里不够",
  "npc": "莱姆斯与砾恩",
  "lines": [
   "[你们退到能站稳的地方，身后的门户仍在发亮。传信的人已经往外跑，砾恩却一直看着墙上几道转折的刻纹，像是在回想另一条走过的路。]",
   "莱姆斯：先把消息送出去。让沿路的人撤开。",
   "砾恩：它还在往外来。",
   "莱姆斯：我知道。只守这条路，挡不住。",
   "砾恩：这几道转折，我见过。",
   "莱姆斯：在哪里？",
   "砾恩：那座神庙。我得回去。"
  ],
  "objective": "记录激活刻纹，发出撤离消息，准备返回古神庙核实；暂不确认支撑数量。",
  "flags": [
   "ACTIVE_MARKS_RECORDED",
   "TEMPLE_RETURN_PLANNED",
   "C08_COMPLETE"
  ],
  "knowledge": [
   {
    "id": "C08.X05.human.k0",
    "text": "砾恩认为激活刻纹与古神庙相似，需要返查；尚不能确认四座支撑祭坛。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "照现场情况行动",
    "flags": []
   }
  ],
  "requires": [
   "C08.X04.human"
  ],
  "optional": false
 },
 "C08.X01.dwarf": {
  "id": "C08.X01.dwarf",
  "sourceScene": "C08.X01",
  "chapter": 8,
  "pov": "dwarf",
  "siteId": "ashen.a06",
  "title": "出来之后",
  "npc": "莱姆斯与砾恩",
  "lines": [
   "[封印松开的尘灰还没有落尽，莱姆斯便转头去看大祭司离开的方向。砾恩挡在他的视线里，两人都知道有些话必须当面说清。]",
   "莱姆斯：是你。",
   "砾恩：你看见他拿走了什么。",
   "莱姆斯：族长的核心。我看见了。",
   "砾恩：我要找到他。",
   "莱姆斯：我也是。",
   "砾恩：别挡我的路。",
   "莱姆斯：你也别挡我救人。",
   "布洛克：路上再吵。他带着核心走多久了？"
  ],
  "objective": "带着保留共同追踪；不是五人提前结盟。",
  "flags": [
   "E_UNSEALED"
  ],
  "knowledge": [
   {
    "id": "C08.X01.dwarf.k0",
    "text": "莱姆斯已经解封，与砾恩带着戒心同行；大祭司夺走的是族长自身核心。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "照现场情况行动",
    "flags": []
   }
  ],
  "requires": [
   "C08.O01.dwarf"
  ],
  "optional": false
 },
 "C08.X02.dwarf": {
  "id": "C08.X02.dwarf",
  "sourceScene": "C08.X02",
  "chapter": 8,
  "pov": "dwarf",
  "siteId": "ashen.a07",
  "title": "留下的痕迹",
  "npc": "莱姆斯与砾恩",
  "lines": [
   "[石屑被同一方向的光照亮，前方的门刚被强行打开。]",
   "莱姆斯：他没再带人。",
   "砾恩：拿到核心就走。军队只替他开了路。",
   "莱姆斯：我当时没有看出来。",
   "砾恩：现在看路。"
  ],
  "objective": "追查痕迹，清开守路威胁，找到中央主祭坛入口。",
  "flags": [
   "MAIN_ALTAR_ROUTE_FOUND"
  ],
  "knowledge": [
   {
    "id": "C08.X02.dwarf.k0",
    "text": "大祭司取得族长核心后独自赶往主祭坛；仍不知道他的惧死动机。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "照现场情况行动",
    "flags": []
   }
  ],
  "requires": [
   "C08.X01.dwarf"
  ],
  "optional": false,
  "encounter": {
   "kind": "scenario",
   "scenarioId": "story.c08-x02-dwarf",
   "nodeId": "ashen.a07.field",
   "count": 1
  }
 },
 "C08.X03.dwarf": {
  "id": "C08.X03.dwarf",
  "sourceScene": "C08.X03",
  "chapter": 8,
  "pov": "dwarf",
  "siteId": "ashen.a07",
  "title": "主祭坛",
  "npc": "大祭司",
  "lines": [
   "[族长核心置入中央结构，已亮起。砾恩胸前仍是升级后的王室遗物核心。]",
   "莱姆斯：停下。你把他们留在战场，就是为了这个？",
   "大祭司：我等不到下一次了。",
   "莱姆斯：等什么？",
   "大祭司：等这具身体慢慢死掉。你还年轻，当然觉得时间很多。",
   "砾恩：把他的核心拿出来。",
   "大祭司：原本该用的是你拿走的那一枚。如今，只能用这枚强行开坛。",
   "莱姆斯：这会打开什么？",
   "大祭司：我知道门外有什么。我曾把它们挡在外面。",
   "砾恩：你凭什么知道？",
   "大祭司：当年的矮人王、人族国王，还有我。是我们造出了烬裔。",
   "大祭司：你们就是为挡住外来的东西而生的。",
   "砾恩：那也不是你拿走他的理由。",
   "莱姆斯：如果你知道，就更该停下！"
  ],
  "objective": "记录大祭司当场宣称的古代身份和惧死动机；尚未得到独立遗迹印证。",
  "flags": [
   "PRIEST_MORTALITY_MOTIVE_HEARD",
   "ASHEN_ORIGIN_CLAIM_HEARD"
  ],
  "knowledge": [
   {
    "id": "C08.X03.dwarf.k0",
    "text": "大祭司在主祭坛承认自己惧死，宣称曾与古代两位国王创造烬裔；古代身份与起源仍待独立记录印证。",
    "mode": "heard"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "照现场情况行动",
    "flags": []
   }
  ],
  "requires": [
   "C08.X02.dwarf"
  ],
  "optional": false
 },
 "C08.X04A.dwarf": {
  "id": "C08.X04A.dwarf",
  "sourceScene": "C08.X04A",
  "chapter": 8,
  "pov": "dwarf",
  "siteId": "ashen.a07",
  "title": "打断施法",
  "npc": "仪式外围",
  "lines": [
   "[祭坛外缘的光一层层收紧，族长的核心悬在中央。你们沿空隙逼近，想先打断大祭司的施法，再设法取回它。]",
   "[脚下的纹路仍在向中央汇流，没人能断定停下施法后它是否也会停。莱姆斯沿着石沿寻找落脚处，砾恩紧盯着那枚核心。]"
  ],
  "objective": "突破仪式外围，尝试切断施法、救出核心；这不是保证关闭门户。",
  "flags": [
   "RITUAL_CAST_INTERRUPTED"
  ],
  "knowledge": [
   {
    "id": "C08.X04A.dwarf.k0",
    "text": "持续施法已被打断，核心仍自行运转；仅让大祭司停手已经无用。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "照现场情况行动",
    "flags": []
   }
  ],
  "requires": [
   "C08.X03.dwarf"
  ],
  "optional": false,
  "encounter": {
   "kind": "scenario",
   "scenarioId": "story.c08-x04a-dwarf",
   "nodeId": "ashen.a07.field",
   "count": 1
  }
 },
 "C08.X04.dwarf": {
  "id": "C08.X04.dwarf",
  "sourceScene": "C08.X04",
  "chapter": 8,
  "pov": "dwarf",
  "siteId": "ashen.a07",
  "title": "没能关上的门",
  "npc": "涌出的界外力量",
  "lines": [
   "莱姆斯：他已经停手了。",
   "砾恩：下面还在动。",
   "[失控的力量沿石面骤然外涌，刚才还能落脚的地方已经裂开。你们不得不放弃接近核心，转身寻找退路。]",
   "[核心已激活，门户打开，恶魔涌入。]",
   "大祭司：不……不该这样。",
   "[反噬蔓延，大祭司退不出去，倒在中央结构旁。]",
   "大祭司：我还不能……",
   "莱姆斯：后退！门已经开了！",
   "砾恩：我看见了。",
   "布洛克：出口还能走，快！"
  ],
  "objective": "抵挡首波冲击并撤出中心；成功撤离不等于阻止仪式或关闭门户。",
  "flags": [
   "RITUAL_SUCCEEDED",
   "PRIEST_DIED_BACKLASH",
   "INVASION_BEGAN"
  ],
  "knowledge": [
   {
    "id": "C08.X04.dwarf.k0",
    "text": "仪式成功，恶魔入侵，大祭司死于反噬；门户仍运转。精灵与烬裔转向抵抗入侵，全境敌对封锁解除，并不代表和解。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "照现场情况行动",
    "flags": []
   }
  ],
  "requires": [
   "C08.X04A.dwarf"
  ],
  "optional": false,
  "encounter": {
   "kind": "scenario",
   "scenarioId": "story.c08-x04-dwarf",
   "nodeId": "ashen.a07.field",
   "count": 1
  }
 },
 "C08.X05.dwarf": {
  "id": "C08.X05.dwarf",
  "sourceScene": "C08.X05",
  "chapter": 8,
  "pov": "dwarf",
  "siteId": "ashen.a07",
  "title": "只守住这里不够",
  "npc": "莱姆斯与砾恩",
  "lines": [
   "[你们退到能站稳的地方，身后的门户仍在发亮。传信的人已经往外跑，砾恩却一直看着墙上几道转折的刻纹，像是在回想另一条走过的路。]",
   "莱姆斯：先把消息送出去。让沿路的人撤开。",
   "砾恩：它还在往外来。",
   "莱姆斯：我知道。只守这条路，挡不住。",
   "砾恩：这几道转折，我见过。",
   "莱姆斯：在哪里？",
   "砾恩：那座神庙。我得回去。"
  ],
  "objective": "记录激活刻纹，发出撤离消息，准备返回古神庙核实；暂不确认支撑数量。",
  "flags": [
   "ACTIVE_MARKS_RECORDED",
   "TEMPLE_RETURN_PLANNED",
   "C08_COMPLETE"
  ],
  "knowledge": [
   {
    "id": "C08.X05.dwarf.k0",
    "text": "砾恩认为激活刻纹与古神庙相似，需要返查；尚不能确认四座支撑祭坛。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "照现场情况行动",
    "flags": []
   }
  ],
  "requires": [
   "C08.X04.dwarf"
  ],
  "optional": false
 },
 "C08.X01.elf": {
  "id": "C08.X01.elf",
  "sourceScene": "C08.X01",
  "chapter": 8,
  "pov": "elf",
  "siteId": "ashen.a06",
  "title": "出来之后",
  "npc": "莱姆斯与砾恩",
  "lines": [
   "[封印松开的尘灰还没有落尽，莱姆斯便转头去看大祭司离开的方向。砾恩挡在他的视线里，两人都知道有些话必须当面说清。]",
   "莱姆斯：是你。",
   "砾恩：你看见他拿走了什么。",
   "莱姆斯：族长的核心。我看见了。",
   "砾恩：我要找到他。",
   "莱姆斯：我也是。",
   "砾恩：别挡我的路。",
   "莱姆斯：你也别挡我救人。"
  ],
  "objective": "带着保留共同追踪；不是五人提前结盟。",
  "flags": [
   "E_UNSEALED"
  ],
  "knowledge": [
   {
    "id": "C08.X01.elf.k0",
    "text": "莱姆斯已经解封，与砾恩带着戒心同行；大祭司夺走的是族长自身核心。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "照现场情况行动",
    "flags": []
   }
  ],
  "requires": [
   "C08.E03.elf"
  ],
  "optional": false
 },
 "C08.X02.elf": {
  "id": "C08.X02.elf",
  "sourceScene": "C08.X02",
  "chapter": 8,
  "pov": "elf",
  "siteId": "ashen.a07",
  "title": "留下的痕迹",
  "npc": "莱姆斯与砾恩",
  "lines": [
   "[石屑被同一方向的光照亮，前方的门刚被强行打开。]",
   "莱姆斯：他没再带人。",
   "砾恩：拿到核心就走。军队只替他开了路。",
   "莱姆斯：我当时没有看出来。",
   "砾恩：现在看路。"
  ],
  "objective": "追查痕迹，清开守路威胁，找到中央主祭坛入口。",
  "flags": [
   "MAIN_ALTAR_ROUTE_FOUND"
  ],
  "knowledge": [
   {
    "id": "C08.X02.elf.k0",
    "text": "大祭司取得族长核心后独自赶往主祭坛；仍不知道他的惧死动机。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "照现场情况行动",
    "flags": []
   }
  ],
  "requires": [
   "C08.X01.elf"
  ],
  "optional": false,
  "encounter": {
   "kind": "scenario",
   "scenarioId": "story.c08-x02-elf",
   "nodeId": "ashen.a07.field",
   "count": 1
  }
 },
 "C08.X03.elf": {
  "id": "C08.X03.elf",
  "sourceScene": "C08.X03",
  "chapter": 8,
  "pov": "elf",
  "siteId": "ashen.a07",
  "title": "主祭坛",
  "npc": "大祭司",
  "lines": [
   "[族长核心置入中央结构，已亮起。砾恩胸前仍是升级后的王室遗物核心。]",
   "莱姆斯：停下。你把他们留在战场，就是为了这个？",
   "大祭司：我等不到下一次了。",
   "莱姆斯：等什么？",
   "大祭司：等这具身体慢慢死掉。你还年轻，当然觉得时间很多。",
   "砾恩：把他的核心拿出来。",
   "大祭司：原本该用的是你拿走的那一枚。如今，只能用这枚强行开坛。",
   "莱姆斯：这会打开什么？",
   "大祭司：我知道门外有什么。我曾把它们挡在外面。",
   "砾恩：你凭什么知道？",
   "大祭司：当年的矮人王、人族国王，还有我。是我们造出了烬裔。",
   "大祭司：你们就是为挡住外来的东西而生的。",
   "砾恩：那也不是你拿走他的理由。",
   "莱姆斯：如果你知道，就更该停下！"
  ],
  "objective": "记录大祭司当场宣称的古代身份和惧死动机；尚未得到独立遗迹印证。",
  "flags": [
   "PRIEST_MORTALITY_MOTIVE_HEARD",
   "ASHEN_ORIGIN_CLAIM_HEARD"
  ],
  "knowledge": [
   {
    "id": "C08.X03.elf.k0",
    "text": "大祭司在主祭坛承认自己惧死，宣称曾与古代两位国王创造烬裔；古代身份与起源仍待独立记录印证。",
    "mode": "heard"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "照现场情况行动",
    "flags": []
   }
  ],
  "requires": [
   "C08.X02.elf"
  ],
  "optional": false
 },
 "C08.X04A.elf": {
  "id": "C08.X04A.elf",
  "sourceScene": "C08.X04A",
  "chapter": 8,
  "pov": "elf",
  "siteId": "ashen.a07",
  "title": "打断施法",
  "npc": "仪式外围",
  "lines": [
   "[祭坛外缘的光一层层收紧，族长的核心悬在中央。你们沿空隙逼近，想先打断大祭司的施法，再设法取回它。]",
   "[脚下的纹路仍在向中央汇流，没人能断定停下施法后它是否也会停。莱姆斯沿着石沿寻找落脚处，砾恩紧盯着那枚核心。]"
  ],
  "objective": "突破仪式外围，尝试切断施法、救出核心；这不是保证关闭门户。",
  "flags": [
   "RITUAL_CAST_INTERRUPTED"
  ],
  "knowledge": [
   {
    "id": "C08.X04A.elf.k0",
    "text": "持续施法已被打断，核心仍自行运转；仅让大祭司停手已经无用。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "照现场情况行动",
    "flags": []
   }
  ],
  "requires": [
   "C08.X03.elf"
  ],
  "optional": false,
  "encounter": {
   "kind": "scenario",
   "scenarioId": "story.c08-x04a-elf",
   "nodeId": "ashen.a07.field",
   "count": 1
  }
 },
 "C08.X04.elf": {
  "id": "C08.X04.elf",
  "sourceScene": "C08.X04",
  "chapter": 8,
  "pov": "elf",
  "siteId": "ashen.a07",
  "title": "没能关上的门",
  "npc": "涌出的界外力量",
  "lines": [
   "莱姆斯：他已经停手了。",
   "砾恩：下面还在动。",
   "[失控的力量沿石面骤然外涌，刚才还能落脚的地方已经裂开。你们不得不放弃接近核心，转身寻找退路。]",
   "[核心已激活，门户打开，恶魔涌入。]",
   "大祭司：不……不该这样。",
   "[反噬蔓延，大祭司退不出去，倒在中央结构旁。]",
   "大祭司：我还不能……",
   "莱姆斯：后退！门已经开了！",
   "砾恩：我看见了。"
  ],
  "objective": "抵挡首波冲击并撤出中心；成功撤离不等于阻止仪式或关闭门户。",
  "flags": [
   "RITUAL_SUCCEEDED",
   "PRIEST_DIED_BACKLASH",
   "INVASION_BEGAN"
  ],
  "knowledge": [
   {
    "id": "C08.X04.elf.k0",
    "text": "仪式成功，恶魔入侵，大祭司死于反噬；门户仍运转。精灵与烬裔转向抵抗入侵，全境敌对封锁解除，并不代表和解。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "照现场情况行动",
    "flags": []
   }
  ],
  "requires": [
   "C08.X04A.elf"
  ],
  "optional": false,
  "encounter": {
   "kind": "scenario",
   "scenarioId": "story.c08-x04-elf",
   "nodeId": "ashen.a07.field",
   "count": 1
  }
 },
 "C08.X05.elf": {
  "id": "C08.X05.elf",
  "sourceScene": "C08.X05",
  "chapter": 8,
  "pov": "elf",
  "siteId": "ashen.a07",
  "title": "只守住这里不够",
  "npc": "莱姆斯与砾恩",
  "lines": [
   "[你们退到能站稳的地方，身后的门户仍在发亮。传信的人已经往外跑，砾恩却一直看着墙上几道转折的刻纹，像是在回想另一条走过的路。]",
   "莱姆斯：先把消息送出去。让沿路的人撤开。",
   "砾恩：它还在往外来。",
   "莱姆斯：我知道。只守这条路，挡不住。",
   "砾恩：这几道转折，我见过。",
   "莱姆斯：在哪里？",
   "砾恩：那座神庙。我得回去。"
  ],
  "objective": "记录激活刻纹，发出撤离消息，准备返回古神庙核实；暂不确认支撑数量。",
  "flags": [
   "ACTIVE_MARKS_RECORDED",
   "TEMPLE_RETURN_PLANNED",
   "C08_COMPLETE"
  ],
  "knowledge": [
   {
    "id": "C08.X05.elf.k0",
    "text": "砾恩认为激活刻纹与古神庙相似，需要返查；尚不能确认四座支撑祭坛。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "照现场情况行动",
    "flags": []
   }
  ],
  "requires": [
   "C08.X04.elf"
  ],
  "optional": false
 },
 "C08.X01.goblin": {
  "id": "C08.X01.goblin",
  "sourceScene": "C08.X01",
  "chapter": 8,
  "pov": "goblin",
  "siteId": "ashen.a06",
  "title": "出来之后",
  "npc": "莱姆斯与砾恩",
  "lines": [
   "[封印松开的尘灰还没有落尽，莱姆斯便转头去看大祭司离开的方向。砾恩挡在他的视线里，两人都知道有些话必须当面说清。]",
   "莱姆斯：是你。",
   "砾恩：你看见他拿走了什么。",
   "莱姆斯：族长的核心。我看见了。",
   "砾恩：我要找到他。",
   "莱姆斯：我也是。",
   "砾恩：别挡我的路。",
   "莱姆斯：你也别挡我救人。",
   "奇克：我只问一件事。跟过去，还有回来的路吗？",
   "莱姆斯：不知道。我会先看退路。"
  ],
  "objective": "带着保留共同追踪；不是五人提前结盟。",
  "flags": [
   "E_UNSEALED"
  ],
  "knowledge": [
   {
    "id": "C08.X01.goblin.k0",
    "text": "莱姆斯已经解封，与砾恩带着戒心同行；大祭司夺走的是族长自身核心。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "照现场情况行动",
    "flags": []
   }
  ],
  "requires": [
   "C08.O01.goblin"
  ],
  "optional": false
 },
 "C08.X02.goblin": {
  "id": "C08.X02.goblin",
  "sourceScene": "C08.X02",
  "chapter": 8,
  "pov": "goblin",
  "siteId": "ashen.a07",
  "title": "留下的痕迹",
  "npc": "莱姆斯与砾恩",
  "lines": [
   "[石屑被同一方向的光照亮，前方的门刚被强行打开。]",
   "莱姆斯：他没再带人。",
   "砾恩：拿到核心就走。军队只替他开了路。",
   "莱姆斯：我当时没有看出来。",
   "砾恩：现在看路。"
  ],
  "objective": "追查痕迹，清开守路威胁，找到中央主祭坛入口。",
  "flags": [
   "MAIN_ALTAR_ROUTE_FOUND"
  ],
  "knowledge": [
   {
    "id": "C08.X02.goblin.k0",
    "text": "大祭司取得族长核心后独自赶往主祭坛；仍不知道他的惧死动机。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "照现场情况行动",
    "flags": []
   }
  ],
  "requires": [
   "C08.X01.goblin"
  ],
  "optional": false,
  "encounter": {
   "kind": "scenario",
   "scenarioId": "story.c08-x02-goblin",
   "nodeId": "ashen.a07.field",
   "count": 1
  }
 },
 "C08.X03.goblin": {
  "id": "C08.X03.goblin",
  "sourceScene": "C08.X03",
  "chapter": 8,
  "pov": "goblin",
  "siteId": "ashen.a07",
  "title": "主祭坛",
  "npc": "大祭司",
  "lines": [
   "[族长核心置入中央结构，已亮起。砾恩胸前仍是升级后的王室遗物核心。]",
   "莱姆斯：停下。你把他们留在战场，就是为了这个？",
   "大祭司：我等不到下一次了。",
   "莱姆斯：等什么？",
   "大祭司：等这具身体慢慢死掉。你还年轻，当然觉得时间很多。",
   "砾恩：把他的核心拿出来。",
   "大祭司：原本该用的是你拿走的那一枚。如今，只能用这枚强行开坛。",
   "莱姆斯：这会打开什么？",
   "大祭司：我知道门外有什么。我曾把它们挡在外面。",
   "砾恩：你凭什么知道？",
   "大祭司：当年的矮人王、人族国王，还有我。是我们造出了烬裔。",
   "大祭司：你们就是为挡住外来的东西而生的。",
   "砾恩：那也不是你拿走他的理由。",
   "莱姆斯：如果你知道，就更该停下！"
  ],
  "objective": "记录大祭司当场宣称的古代身份和惧死动机；尚未得到独立遗迹印证。",
  "flags": [
   "PRIEST_MORTALITY_MOTIVE_HEARD",
   "ASHEN_ORIGIN_CLAIM_HEARD"
  ],
  "knowledge": [
   {
    "id": "C08.X03.goblin.k0",
    "text": "大祭司在主祭坛承认自己惧死，宣称曾与古代两位国王创造烬裔；古代身份与起源仍待独立记录印证。",
    "mode": "heard"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "照现场情况行动",
    "flags": []
   }
  ],
  "requires": [
   "C08.X02.goblin"
  ],
  "optional": false
 },
 "C08.X04A.goblin": {
  "id": "C08.X04A.goblin",
  "sourceScene": "C08.X04A",
  "chapter": 8,
  "pov": "goblin",
  "siteId": "ashen.a07",
  "title": "打断施法",
  "npc": "仪式外围",
  "lines": [
   "[祭坛外缘的光一层层收紧，族长的核心悬在中央。你们沿空隙逼近，想先打断大祭司的施法，再设法取回它。]",
   "[脚下的纹路仍在向中央汇流，没人能断定停下施法后它是否也会停。莱姆斯沿着石沿寻找落脚处，砾恩紧盯着那枚核心。]"
  ],
  "objective": "突破仪式外围，尝试切断施法、救出核心；这不是保证关闭门户。",
  "flags": [
   "RITUAL_CAST_INTERRUPTED"
  ],
  "knowledge": [
   {
    "id": "C08.X04A.goblin.k0",
    "text": "持续施法已被打断，核心仍自行运转；仅让大祭司停手已经无用。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "照现场情况行动",
    "flags": []
   }
  ],
  "requires": [
   "C08.X03.goblin"
  ],
  "optional": false,
  "encounter": {
   "kind": "scenario",
   "scenarioId": "story.c08-x04a-goblin",
   "nodeId": "ashen.a07.field",
   "count": 1
  }
 },
 "C08.X04.goblin": {
  "id": "C08.X04.goblin",
  "sourceScene": "C08.X04",
  "chapter": 8,
  "pov": "goblin",
  "siteId": "ashen.a07",
  "title": "没能关上的门",
  "npc": "涌出的界外力量",
  "lines": [
   "莱姆斯：他已经停手了。",
   "砾恩：下面还在动。",
   "[失控的力量沿石面骤然外涌，刚才还能落脚的地方已经裂开。你们不得不放弃接近核心，转身寻找退路。]",
   "[核心已激活，门户打开，恶魔涌入。]",
   "大祭司：不……不该这样。",
   "[反噬蔓延，大祭司退不出去，倒在中央结构旁。]",
   "大祭司：我还不能……",
   "莱姆斯：后退！门已经开了！",
   "砾恩：我看见了。",
   "奇克：这边！刚才的缝还在！"
  ],
  "objective": "抵挡首波冲击并撤出中心；成功撤离不等于阻止仪式或关闭门户。",
  "flags": [
   "RITUAL_SUCCEEDED",
   "PRIEST_DIED_BACKLASH",
   "INVASION_BEGAN"
  ],
  "knowledge": [
   {
    "id": "C08.X04.goblin.k0",
    "text": "仪式成功，恶魔入侵，大祭司死于反噬；门户仍运转。精灵与烬裔转向抵抗入侵，全境敌对封锁解除，并不代表和解。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "照现场情况行动",
    "flags": []
   }
  ],
  "requires": [
   "C08.X04A.goblin"
  ],
  "optional": false,
  "encounter": {
   "kind": "scenario",
   "scenarioId": "story.c08-x04-goblin",
   "nodeId": "ashen.a07.field",
   "count": 1
  }
 },
 "C08.X05.goblin": {
  "id": "C08.X05.goblin",
  "sourceScene": "C08.X05",
  "chapter": 8,
  "pov": "goblin",
  "siteId": "ashen.a07",
  "title": "只守住这里不够",
  "npc": "莱姆斯与砾恩",
  "lines": [
   "[你们退到能站稳的地方，身后的门户仍在发亮。传信的人已经往外跑，砾恩却一直看着墙上几道转折的刻纹，像是在回想另一条走过的路。]",
   "莱姆斯：先把消息送出去。让沿路的人撤开。",
   "砾恩：它还在往外来。",
   "莱姆斯：我知道。只守这条路，挡不住。",
   "砾恩：这几道转折，我见过。",
   "莱姆斯：在哪里？",
   "砾恩：那座神庙。我得回去。"
  ],
  "objective": "记录激活刻纹，发出撤离消息，准备返回古神庙核实；暂不确认支撑数量。",
  "flags": [
   "ACTIVE_MARKS_RECORDED",
   "TEMPLE_RETURN_PLANNED",
   "C08_COMPLETE"
  ],
  "knowledge": [
   {
    "id": "C08.X05.goblin.k0",
    "text": "砾恩认为激活刻纹与古神庙相似，需要返查；尚不能确认四座支撑祭坛。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "照现场情况行动",
    "flags": []
   }
  ],
  "requires": [
   "C08.X04.goblin"
  ],
  "optional": false
 },
 "C08.X01.ashen": {
  "id": "C08.X01.ashen",
  "sourceScene": "C08.X01",
  "chapter": 8,
  "pov": "ashen",
  "siteId": "ashen.a06",
  "title": "出来之后",
  "npc": "莱姆斯与砾恩",
  "lines": [
   "[封印松开的尘灰还没有落尽，莱姆斯便转头去看大祭司离开的方向。砾恩挡在他的视线里，两人都知道有些话必须当面说清。]",
   "莱姆斯：是你。",
   "砾恩：你看见他拿走了什么。",
   "莱姆斯：族长的核心。我看见了。",
   "砾恩：我要找到他。",
   "莱姆斯：我也是。",
   "砾恩：别挡我的路。",
   "莱姆斯：你也别挡我救人。"
  ],
  "objective": "带着保留共同追踪；不是五人提前结盟。",
  "flags": [
   "E_UNSEALED"
  ],
  "knowledge": [
   {
    "id": "C08.X01.ashen.k0",
    "text": "莱姆斯已经解封，与砾恩带着戒心同行；大祭司夺走的是族长自身核心。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "照现场情况行动",
    "flags": []
   }
  ],
  "requires": [
   "C08.O01.ashen"
  ],
  "optional": false
 },
 "C08.X02.ashen": {
  "id": "C08.X02.ashen",
  "sourceScene": "C08.X02",
  "chapter": 8,
  "pov": "ashen",
  "siteId": "ashen.a07",
  "title": "留下的痕迹",
  "npc": "莱姆斯与砾恩",
  "lines": [
   "[石屑被同一方向的光照亮，前方的门刚被强行打开。]",
   "莱姆斯：他没再带人。",
   "砾恩：拿到核心就走。军队只替他开了路。",
   "莱姆斯：我当时没有看出来。",
   "砾恩：现在看路。"
  ],
  "objective": "追查痕迹，清开守路威胁，找到中央主祭坛入口。",
  "flags": [
   "MAIN_ALTAR_ROUTE_FOUND"
  ],
  "knowledge": [
   {
    "id": "C08.X02.ashen.k0",
    "text": "大祭司取得族长核心后独自赶往主祭坛；仍不知道他的惧死动机。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "照现场情况行动",
    "flags": []
   }
  ],
  "requires": [
   "C08.X01.ashen"
  ],
  "optional": false,
  "encounter": {
   "kind": "scenario",
   "scenarioId": "story.c08-x02-ashen",
   "nodeId": "ashen.a07.field",
   "count": 1
  }
 },
 "C08.X03.ashen": {
  "id": "C08.X03.ashen",
  "sourceScene": "C08.X03",
  "chapter": 8,
  "pov": "ashen",
  "siteId": "ashen.a07",
  "title": "主祭坛",
  "npc": "大祭司",
  "lines": [
   "[族长核心置入中央结构，已亮起。砾恩胸前仍是升级后的王室遗物核心。]",
   "莱姆斯：停下。你把他们留在战场，就是为了这个？",
   "大祭司：我等不到下一次了。",
   "莱姆斯：等什么？",
   "大祭司：等这具身体慢慢死掉。你还年轻，当然觉得时间很多。",
   "砾恩：把他的核心拿出来。",
   "大祭司：原本该用的是你拿走的那一枚。如今，只能用这枚强行开坛。",
   "莱姆斯：这会打开什么？",
   "大祭司：我知道门外有什么。我曾把它们挡在外面。",
   "砾恩：你凭什么知道？",
   "大祭司：当年的矮人王、人族国王，还有我。是我们造出了烬裔。",
   "大祭司：你们就是为挡住外来的东西而生的。",
   "砾恩：那也不是你拿走他的理由。",
   "莱姆斯：如果你知道，就更该停下！"
  ],
  "objective": "记录大祭司当场宣称的古代身份和惧死动机；尚未得到独立遗迹印证。",
  "flags": [
   "PRIEST_MORTALITY_MOTIVE_HEARD",
   "ASHEN_ORIGIN_CLAIM_HEARD"
  ],
  "knowledge": [
   {
    "id": "C08.X03.ashen.k0",
    "text": "大祭司在主祭坛承认自己惧死，宣称曾与古代两位国王创造烬裔；古代身份与起源仍待独立记录印证。",
    "mode": "heard"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "照现场情况行动",
    "flags": []
   }
  ],
  "requires": [
   "C08.X02.ashen"
  ],
  "optional": false
 },
 "C08.X04A.ashen": {
  "id": "C08.X04A.ashen",
  "sourceScene": "C08.X04A",
  "chapter": 8,
  "pov": "ashen",
  "siteId": "ashen.a07",
  "title": "打断施法",
  "npc": "仪式外围",
  "lines": [
   "[祭坛外缘的光一层层收紧，族长的核心悬在中央。你们沿空隙逼近，想先打断大祭司的施法，再设法取回它。]",
   "[脚下的纹路仍在向中央汇流，没人能断定停下施法后它是否也会停。莱姆斯沿着石沿寻找落脚处，砾恩紧盯着那枚核心。]"
  ],
  "objective": "突破仪式外围，尝试切断施法、救出核心；这不是保证关闭门户。",
  "flags": [
   "RITUAL_CAST_INTERRUPTED"
  ],
  "knowledge": [
   {
    "id": "C08.X04A.ashen.k0",
    "text": "持续施法已被打断，核心仍自行运转；仅让大祭司停手已经无用。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "照现场情况行动",
    "flags": []
   }
  ],
  "requires": [
   "C08.X03.ashen"
  ],
  "optional": false,
  "encounter": {
   "kind": "scenario",
   "scenarioId": "story.c08-x04a-ashen",
   "nodeId": "ashen.a07.field",
   "count": 1
  }
 },
 "C08.X04.ashen": {
  "id": "C08.X04.ashen",
  "sourceScene": "C08.X04",
  "chapter": 8,
  "pov": "ashen",
  "siteId": "ashen.a07",
  "title": "没能关上的门",
  "npc": "涌出的界外力量",
  "lines": [
   "莱姆斯：他已经停手了。",
   "砾恩：下面还在动。",
   "[失控的力量沿石面骤然外涌，刚才还能落脚的地方已经裂开。你们不得不放弃接近核心，转身寻找退路。]",
   "[核心已激活，门户打开，恶魔涌入。]",
   "大祭司：不……不该这样。",
   "[反噬蔓延，大祭司退不出去，倒在中央结构旁。]",
   "大祭司：我还不能……",
   "莱姆斯：后退！门已经开了！",
   "砾恩：我看见了。"
  ],
  "objective": "抵挡首波冲击并撤出中心；成功撤离不等于阻止仪式或关闭门户。",
  "flags": [
   "RITUAL_SUCCEEDED",
   "PRIEST_DIED_BACKLASH",
   "INVASION_BEGAN"
  ],
  "knowledge": [
   {
    "id": "C08.X04.ashen.k0",
    "text": "仪式成功，恶魔入侵，大祭司死于反噬；门户仍运转。精灵与烬裔转向抵抗入侵，全境敌对封锁解除，并不代表和解。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "照现场情况行动",
    "flags": []
   }
  ],
  "requires": [
   "C08.X04A.ashen"
  ],
  "optional": false,
  "encounter": {
   "kind": "scenario",
   "scenarioId": "story.c08-x04-ashen",
   "nodeId": "ashen.a07.field",
   "count": 1
  }
 },
 "C08.X05.ashen": {
  "id": "C08.X05.ashen",
  "sourceScene": "C08.X05",
  "chapter": 8,
  "pov": "ashen",
  "siteId": "ashen.a07",
  "title": "只守住这里不够",
  "npc": "莱姆斯与砾恩",
  "lines": [
   "[你们退到能站稳的地方，身后的门户仍在发亮。传信的人已经往外跑，砾恩却一直看着墙上几道转折的刻纹，像是在回想另一条走过的路。]",
   "莱姆斯：先把消息送出去。让沿路的人撤开。",
   "砾恩：它还在往外来。",
   "莱姆斯：我知道。只守这条路，挡不住。",
   "砾恩：这几道转折，我见过。",
   "莱姆斯：在哪里？",
   "砾恩：那座神庙。我得回去。"
  ],
  "objective": "记录激活刻纹，发出撤离消息，准备返回古神庙核实；暂不确认支撑数量。",
  "flags": [
   "ACTIVE_MARKS_RECORDED",
   "TEMPLE_RETURN_PLANNED",
   "C08_COMPLETE"
  ],
  "knowledge": [
   {
    "id": "C08.X05.ashen.k0",
    "text": "砾恩认为激活刻纹与古神庙相似，需要返查；尚不能确认四座支撑祭坛。",
    "mode": "seen"
   }
  ],
  "choices": [
   {
    "id": "proceed",
    "label": "照现场情况行动",
    "flags": []
   }
  ],
  "requires": [
   "C08.X04.ashen"
  ],
  "optional": false
 }
});
export const STORY_POVS=Object.freeze(["human","dwarf","elf","goblin","ashen"]);
export const STORY_CONTENT_VERSION=1;
