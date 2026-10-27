// Authored optional personal arcs; separate from regional NPC events.
export const PERSONAL_ARC_CONTENT = [
 {
  "id": "personal.dwarf.coup.01",
  "race": "dwarf",
  "arcId": "personal.dwarf.coup",
  "number": 1,
  "title": "谁准这一班停工",
  "chapter": 1,
  "gate": "C01.D01.dwarf",
  "siteId": "dwarf.a01",
  "intro": [
   "杜铎：撑木换过了，旧轨还在侧移。",
   "布洛克：先把空车推回线内。停不停，得看它压在哪里。"
  ],
  "choices": [
   {
    "id": "brock-led",
    "label": "我来说明停工的原因",
    "actions": [
     {
      "prompt": "旧轨下方有空隙，第一步怎样检查？",
      "options": [
       {
        "id": "inspect",
        "label": "卸下松枕木，检查受力面",
        "correct": true
       }
      ],
      "result": "空隙已经标出，承重点被重新垫实。"
     },
     {
      "prompt": "如何证明修护后的轨道可用？",
      "options": [
       {
        "id": "verify",
        "label": "空车试载，再记下侧移量",
        "correct": true
       }
      ],
      "result": "布洛克把试载记录交给杜铎。"
     }
    ],
    "outcome": "矿班遇到争执会先请布洛克说明；停工责任不转嫁给工人。",
    "lateActions": [
     {
      "prompt": "旧轨如今仍在使用，重新检查上次修护留下的受力记号。",
      "options": [
       {
        "id": "inspect-current",
        "label": "卸下松动枕木，按现有载荷重垫并空车试载。",
        "correct": true
       }
      ],
      "result": "卸下松动枕木，按现有载荷重垫并空车试载。 已完成并记录当前状态。"
     },
     {
      "prompt": "接续所选方案：我来说明停工的原因",
      "options": [
       {
        "id": "handover-current",
        "label": "由布洛克向接班者演示如何读侧移记号。",
        "correct": true
       }
      ],
      "result": "由布洛克向接班者演示如何读侧移记号。 本次交接已记录。"
     }
    ]
   },
   {
    "id": "crew-voiced",
    "label": "让这一班说出亲眼见到的问题",
    "actions": [
     {
      "prompt": "两位矿工各指一处裂口，如何处理？",
      "options": [
       {
        "id": "inspect",
        "label": "分别做标记，核对车轮压痕",
        "correct": true
       }
      ],
      "result": "两处缺陷都有自己的现场记录。"
     },
     {
      "prompt": "矿班准备复工，下一步？",
      "options": [
       {
        "id": "verify",
        "label": "一起空车试载，并约定异常就停",
        "correct": true
       }
      ],
      "result": "矿班练习了自己的检查与停工程序。"
     }
    ],
    "outcome": "愿意发问的矿工今后直接报告异常；不要求所有人出面。",
    "lateActions": [
     {
      "prompt": "旧轨如今仍在使用，重新检查上次修护留下的受力记号。",
      "options": [
       {
        "id": "inspect-current",
        "label": "卸下松动枕木，按现有载荷重垫并空车试载。",
        "correct": true
       }
      ],
      "result": "卸下松动枕木，按现有载荷重垫并空车试载。 已完成并记录当前状态。"
     },
     {
      "prompt": "接续所选方案：让这一班说出亲眼见到的问题",
      "options": [
       {
        "id": "handover-current",
        "label": "请矿班当场标出新裂口，演练自行停工。",
        "correct": true
       }
      ],
      "result": "请矿班当场标出新裂口，演练自行停工。 本次交接已记录。"
     }
    ]
   }
  ],
  "combat": false,
  "lateIntro": "旧轨如今仍在使用，重新检查上次修护留下的受力记号。"
 },
 {
  "id": "personal.dwarf.coup.02",
  "race": "dwarf",
  "arcId": "personal.dwarf.coup",
  "number": 2,
  "title": "夜车走旧道",
  "chapter": 5,
  "gate": "C05.O01.dwarf",
  "siteId": "dwarf.a04",
  "intro": [
   "运务书记：旧卸料口换了车轮，矿班却说收不到撑木。",
   "布洛克：先查这趟车，不替不知道的事下结论。"
  ],
  "choices": [
   {
    "id": "hidden-access",
    "label": "熄信号灯，从检修沟绕入",
    "actions": [
     {
      "prompt": "两条轨道，一条锈蚀，一条新磨亮。",
      "options": [
       {
        "id": "inspect",
        "label": "沿新磨损查灯温与轮印",
        "correct": true
       }
      ],
      "result": "仍温热的矿灯确认了这次转运。"
     },
     {
      "prompt": "巡灯扫过主轨，下一段怎么走？",
      "options": [
       {
        "id": "verify",
        "label": "等灯转开，从维护沟接近交接包",
        "correct": true
       }
      ],
      "result": "后门位置被记下；交接包的封记可核对。"
     }
    ],
    "outcome": "保留隐蔽回访入口；包内只有改道标记与清单，没有完整军资链。",
    "lateActions": [
     {
      "prompt": "夜车早已离开，旧卸料口尚有可核对的转运痕迹。",
      "options": [
       {
        "id": "inspect-current",
        "label": "比对遗留车轮磨痕与封记，找到现存交接包存放处。",
        "correct": true
       }
      ],
      "result": "比对遗留车轮磨痕与封记，找到现存交接包存放处。 已完成并记录当前状态。"
     },
     {
      "prompt": "接续所选方案：熄信号灯，从检修沟绕入",
      "options": [
       {
        "id": "handover-current",
        "label": "从维护沟复查后门，给记录者留下仅限查验的通路。",
        "correct": true
       }
      ],
      "result": "从维护沟复查后门，给记录者留下仅限查验的通路。 本次交接已记录。"
     }
    ]
   },
   {
    "id": "driver-account",
    "label": "落挡车器，在卸料口拦车",
    "actions": [
     {
      "prompt": "货车将到旧岔口，如何截停？",
      "options": [
       {
        "id": "inspect",
        "label": "先卡空轨，再落挡车器",
        "correct": true
       }
      ],
      "result": "车辆停在卸料口，不会滚向矿班。"
     },
     {
      "prompt": "车夫困在货架之间，如何保护来源？",
      "options": [
       {
        "id": "verify",
        "label": "清开侧口，让他自愿留下见闻",
        "correct": true
       }
      ],
      "result": "车夫只确认亲见的装车与改道。"
     }
    ],
    "outcome": "后门被封，留下有来源的车夫说明；最初袭击者仍未知。",
    "lateActions": [
     {
      "prompt": "夜车早已离开，旧卸料口尚有可核对的转运痕迹。",
      "options": [
       {
        "id": "inspect-current",
        "label": "比对遗留车轮磨痕与封记，找到现存交接包存放处。",
        "correct": true
       }
      ],
      "result": "比对遗留车轮磨痕与封记，找到现存交接包存放处。 已完成并记录当前状态。"
     },
     {
      "prompt": "接续所选方案：落挡车器，在卸料口拦车",
      "options": [
       {
        "id": "handover-current",
        "label": "找到当班车夫，自愿核对旧留底与本人可公开的目击范围。",
        "correct": true
       }
      ],
      "result": "找到当班车夫，自愿核对旧留底与本人可公开的目击范围。 本次交接已记录。"
     }
    ]
   }
  ],
  "combat": true,
  "lateIntro": "夜车早已离开，旧卸料口尚有可核对的转运痕迹。"
 },
 {
  "id": "personal.dwarf.coup.03",
  "race": "dwarf",
  "arcId": "personal.dwarf.coup",
  "number": 3,
  "title": "爆痕后的悬车",
  "chapter": 6,
  "gate": "C06.D03.dwarf",
  "siteId": "dwarf.a05",
  "intro": [
   "杜铎：爆后的便道还悬着一辆车。先看锚点。",
   "布洛克：人和封签分开算；不能为纸把人留在下面。"
  ],
  "choices": [
   {
    "id": "rescued-witness-route",
    "label": "先保住伤者与可走的路",
    "actions": [
     {
      "prompt": "绳索磨损，哪个位置可承重？",
      "options": [
       {
        "id": "inspect",
        "label": "选择完整岩柱，绕开裂开的栏杆",
        "correct": true
       }
      ],
      "result": "撤离绳固定在独立锚点。"
     },
     {
      "prompt": "安全点该怎样记录来路？",
      "options": [
       {
        "id": "verify",
        "label": "请卷绳工标出亲见路线与警告位置",
        "correct": true
       }
      ],
      "result": "本人同意范围内的路线说明已收好。"
     }
    ],
    "outcome": "保留证人路线；不因辅助封签缺失而丢掉主线必要证据。",
    "lateActions": [
     {
      "prompt": "卷绳工已经安全，不让他重新困在悬车上。如今检查爆后便道的遗留危险。",
      "options": [
       {
        "id": "inspect-current",
        "label": "用独立岩柱固定检查绳，卸下悬在便道上的松脱旧车件。",
        "correct": true
       }
      ],
      "result": "用独立岩柱固定检查绳，卸下悬在便道上的松脱旧车件。 已完成并记录当前状态。"
     },
     {
      "prompt": "接续所选方案：先保住伤者与可走的路",
      "options": [
       {
        "id": "handover-current",
        "label": "请安全处的卷绳工在路图标出亲见的运药段，登记其愿意公开的部分。",
        "correct": true
       }
      ],
      "result": "请安全处的卷绳工在路图标出亲见的运药段，登记其愿意公开的部分。 本次交接已记录。"
     }
    ]
   },
   {
    "id": "sealed-crate-route",
    "label": "与杜铎合作固定车架",
    "actions": [
     {
      "prompt": "车架与侧台怎样分工？",
      "options": [
       {
        "id": "inspect",
        "label": "布洛克固定绳链，杜铎守侧台接应",
        "correct": true
       }
      ],
      "result": "接应点与固定点各有人负责。"
     },
     {
      "prompt": "封签残片与证言不一致怎么办？",
      "options": [
       {
        "id": "verify",
        "label": "分别登记，保留未核实部分",
        "correct": true
       }
      ],
      "result": "封签作为辅助物证封存，不替代其他证词。"
     }
    ],
    "outcome": "保留封签核验路线；不凭一张封签提前证明军资链。",
    "lateActions": [
     {
      "prompt": "卷绳工已经安全，不让他重新困在悬车上。如今检查爆后便道的遗留危险。",
      "options": [
       {
        "id": "inspect-current",
        "label": "用独立岩柱固定检查绳，卸下悬在便道上的松脱旧车件。",
        "correct": true
       }
      ],
      "result": "用独立岩柱固定检查绳，卸下悬在便道上的松脱旧车件。 已完成并记录当前状态。"
     },
     {
      "prompt": "接续所选方案：与杜铎合作固定车架",
      "options": [
       {
        "id": "handover-current",
        "label": "与杜铎核对存放的封签残片和调拨副本，把缺项留给记录者。",
        "correct": true
       }
      ],
      "result": "与杜铎核对存放的封签残片和调拨副本，把缺项留给记录者。 本次交接已记录。"
     }
    ]
   }
  ],
  "combat": true,
  "lateIntro": "卷绳工已经安全，不让他重新困在悬车上。如今检查爆后便道的遗留危险。"
 },
 {
  "id": "personal.dwarf.coup.04",
  "race": "dwarf",
  "arcId": "personal.dwarf.coup",
  "number": 4,
  "title": "证人不能走大路",
  "chapter": 7,
  "gate": "C07.O01.dwarf",
  "siteId": "dwarf.a05",
  "intro": [
   "杜铎：主线转移的人已经到安全点。现在核实每一段接应，别叫他们再走一遍。",
   "布洛克：不只数车，让人自己应一声。"
  ],
  "choices": [
   {
    "id": "stretcher-route",
    "label": "核实宽路担架接应",
    "actions": [
     {
      "prompt": "名单比车数多，先核对什么？",
      "options": [
       {
        "id": "inspect",
        "label": "逐一核对抵达者与担架交接",
        "correct": true
       }
      ],
      "result": "抵达者逐一确认，没有用车辆代替人数。"
     },
     {
      "prompt": "宽路下一趟怎么接？",
      "options": [
       {
        "id": "verify",
        "label": "标出担架能通过的转角和接应岗位",
        "correct": true
       }
      ],
      "result": "担架接应表交给愿意值守的人。"
     }
    ],
    "outcome": "宽路的担架接应方法可继续使用；只消费已经完成的C07主线护送，不重打、不重发战利品。",
    "lateActions": [
     {
      "prompt": "撤离者已经抵达，旧护送不再重打一场。核对实际到达的交接记录。",
      "options": [
       {
        "id": "inspect-current",
        "label": "逐人核对安全点应答与担架、步行者的到达记录。",
        "correct": true
       }
      ],
      "result": "逐人核对安全点应答与担架、步行者的到达记录。 已完成并记录当前状态。"
     },
     {
      "prompt": "接续所选方案：核实宽路担架接应",
      "options": [
       {
        "id": "handover-current",
        "label": "实地复查担架转角，把当前宽路接应表交给值守者。",
        "correct": true
       }
      ],
      "result": "实地复查担架转角，把当前宽路接应表交给值守者。 本次交接已记录。"
     }
    ]
   },
   {
    "id": "walking-route",
    "label": "核实窄道的隐蔽步行接应",
    "actions": [
     {
      "prompt": "巡灯照到支架，核验哪处？",
      "options": [
       {
        "id": "inspect",
        "label": "查看遮光位与两个步行接应点",
        "correct": true
       }
      ],
      "result": "两个接应点完成互认。"
     },
     {
      "prompt": "路线说明给谁怎样写？",
      "options": [
       {
        "id": "verify",
        "label": "只给接应者，注明不能走重车",
        "correct": true
       }
      ],
      "result": "受保护身份不进入公开说明。"
     }
    ],
    "outcome": "保存隐蔽步行路，重车不能走；已安全的人不重复受险。",
    "lateActions": [
     {
      "prompt": "撤离者已经抵达，旧护送不再重打一场。核对实际到达的交接记录。",
      "options": [
       {
        "id": "inspect-current",
        "label": "逐人核对安全点应答与担架、步行者的到达记录。",
        "correct": true
       }
      ],
      "result": "逐人核对安全点应答与担架、步行者的到达记录。 已完成并记录当前状态。"
     },
     {
      "prompt": "接续所选方案：核实窄道的隐蔽步行接应",
      "options": [
       {
        "id": "handover-current",
        "label": "检查遮光支架与两处步行接应点，修正禁止重车的标记。",
        "correct": true
       }
      ],
      "result": "检查遮光支架与两处步行接应点，修正禁止重车的标记。 本次交接已记录。"
     }
    ]
   }
  ],
  "combat": false,
  "lateIntro": "撤离者已经抵达，旧护送不再重打一场。核对实际到达的交接记录。"
 },
 {
  "id": "personal.dwarf.coup.05",
  "race": "dwarf",
  "arcId": "personal.dwarf.coup",
  "number": 5,
  "title": "矿仓的最后一车",
  "chapter": 7,
  "gate": "C07.O01.dwarf",
  "siteId": "dwarf.a05",
  "intro": [
   "杜铎：矿仓还缺一份交接。纸匣和撑木，得分清先保哪项。",
   "布洛克：没留下的也记清，后面继续找。"
  ],
  "choices": [
   {
    "id": "expense-index",
    "label": "优先核实头车的纸匣线索",
    "actions": [
     {
      "prompt": "车辙有分叉，哪条与头车相符？",
      "options": [
       {
        "id": "inspect",
        "label": "比对轮距和纸匣装车签",
        "correct": true
       }
      ],
      "result": "装车签对应头车去向。"
     },
     {
      "prompt": "支出页只写运费，怎样归档？",
      "options": [
       {
        "id": "verify",
        "label": "留出处与缺页，交记录者接续",
        "correct": true
       }
      ],
      "result": "取得一段局部支出记录，缺页仍待追索。"
     }
    ],
    "outcome": "纸匣线索优先，矿班先加固最危险处；完整合证仍须C10。",
    "lateActions": [
     {
      "prompt": "原车队不再停在矿仓。当前仍要整理缺料与可追索的账页，不倒放截车。",
      "options": [
       {
        "id": "inspect-current",
        "label": "打开仓房的现存交接箱，按封记将支出副页和撑木缺额分开。",
        "correct": true
       }
      ],
      "result": "打开仓房的现存交接箱，按封记将支出副页和撑木缺额分开。 已完成并记录当前状态。"
     },
     {
      "prompt": "接续所选方案：优先核实头车的纸匣线索",
      "options": [
       {
        "id": "handover-current",
        "label": "循纸匣索引查到现存账页，带回出处与仍缺原件的名单。",
        "correct": true
       }
      ],
      "result": "循纸匣索引查到现存账页，带回出处与仍缺原件的名单。 本次交接已记录。"
     }
    ]
   },
   {
    "id": "supplies-first",
    "label": "先守物资交接，让矿班取撑木",
    "actions": [
     {
      "prompt": "搬运要经过双侧入口，怎样安排？",
      "options": [
       {
        "id": "inspect",
        "label": "两端互报，逐批接力搬出",
        "correct": true
       }
      ],
      "result": "搬运接力有清楚的进出次序。"
     },
     {
      "prompt": "原账已不在，怎样接续证据？",
      "options": [
       {
        "id": "verify",
        "label": "保存装车副页索引与经手来源",
        "correct": true
       }
      ],
      "result": "副页交给记录者，原件继续追索。"
     }
    ],
    "outcome": "安置处较早补稳支撑，原账由主线后续合证；矿班物资不变玩家战利品。",
    "lateActions": [
     {
      "prompt": "原车队不再停在矿仓。当前仍要整理缺料与可追索的账页，不倒放截车。",
      "options": [
       {
        "id": "inspect-current",
        "label": "打开仓房的现存交接箱，按封记将支出副页和撑木缺额分开。",
        "correct": true
       }
      ],
      "result": "打开仓房的现存交接箱，按封记将支出副页和撑木缺额分开。 已完成并记录当前状态。"
     },
     {
      "prompt": "接续所选方案：先守物资交接，让矿班取撑木",
      "options": [
       {
        "id": "handover-current",
        "label": "帮助矿班把已追回撑木运到现存薄弱支点，再交出缺料与副页索引。",
        "correct": true
       }
      ],
      "result": "帮助矿班把已追回撑木运到现存薄弱支点，再交出缺料与副页索引。 本次交接已记录。"
     }
    ]
   }
  ],
  "combat": true,
  "lateIntro": "原车队不再停在矿仓。当前仍要整理缺料与可追索的账页，不倒放截车。"
 },
 {
  "id": "personal.dwarf.coup.06",
  "race": "dwarf",
  "arcId": "personal.dwarf.coup",
  "number": 6,
  "title": "钱到了谁手里",
  "chapter": 10,
  "gate": "flag:D_RELIC_SALE_COUP_PROVEN",
  "siteId": "dwarf.a05",
  "intro": [
   "记录者：运输留底与支出账已经接上，完整证明来自这次主线合证。",
   "杜铎：我想问，知道下面有人，为什么不等？"
  ],
  "choices": [
   {
    "id": "crew-present",
    "label": "愿意的人自己问，我陪同",
    "actions": [
     {
      "prompt": "对质名单怎么定？",
      "options": [
       {
        "id": "inspect",
        "label": "分别询问是否愿意出面",
        "correct": true
       }
      ],
      "result": "杜铎愿意发问；其余身份按本人意愿保护。"
     },
     {
      "prompt": "如何整理问题？",
      "options": [
       {
        "id": "verify",
        "label": "区分已证实事实、亲见与待答项",
        "correct": true
       }
      ],
      "result": "矿班自愿提出的问题逐项保留。"
     }
    ],
    "outcome": "对质由杜铎先问，布洛克补充来源；不以出席人数换奖励。"
   },
   {
    "id": "brock-reports",
    "label": "由我去，把原话带回来",
    "actions": [
     {
      "prompt": "矿班留守修护，如何授权发问？",
      "options": [
       {
        "id": "inspect",
        "label": "逐项确认可代读的内容",
        "correct": true
       }
      ],
      "result": "代读范围得到确认。"
     },
     {
      "prompt": "怎样保证真的回报？",
      "options": [
       {
        "id": "verify",
        "label": "为每个问题留已答与未答栏",
        "correct": true
       }
      ],
      "result": "回报表保留没有答案的位置。"
     }
    ],
    "outcome": "布洛克带问题出席并负责逐项带回答复；杜铎留守修护。"
   }
  ],
  "combat": false
 },
 {
  "id": "personal.dwarf.coup.07",
  "race": "dwarf",
  "arcId": "personal.dwarf.coup",
  "number": 7,
  "title": "当面认账",
  "chapter": 11,
  "gate": "flag:MAIN_STORY_CLEAR",
  "siteId": "dwarf.a05",
  "intro": [
   "记录者安排了临时对质，不是宣判。维尔铎仍带着随从。",
   "维尔铎：门关了，矿还得开。下一车补给，你们要不要？",
   "布洛克：物资是矿班的，不能拿来换他们闭嘴。"
  ],
  "choices": [
   {
    "id": "unconditional-return",
    "label": "先还无附加条件的物资，证据不撤",
    "actions": [
     {
      "prompt": "交接单夹着撤回证词条款，怎么办？",
      "options": [
       {
        "id": "inspect",
        "label": "剔除附加条件，仅收可当场点交部分",
        "correct": true
       }
      ],
      "result": "证词保留，未实际归还的仍列追索。"
     },
     {
      "prompt": "有人催你宣布案子结束，如何回报？",
      "options": [
       {
        "id": "verify",
        "label": "把已答、未答与仍待查逐项带回",
        "correct": true
       }
      ],
      "result": "矿班看见原话与尚未回答的问题。"
     }
    ],
    "outcome": "可先修缺料部分，事实核验通路仍在；未宣判、未逮捕、未换王。"
   },
   {
    "id": "joint-handover",
    "label": "双方先确认交接，再让车进矿班",
    "actions": [
     {
      "prompt": "物资车数量与清单不一致，怎么办？",
      "options": [
       {
        "id": "inspect",
        "label": "矿班与记录者共同点验差额",
        "correct": true
       }
      ],
      "result": "归还范围与缺额都留下来源。"
     },
     {
      "prompt": "怎样交还追问权？",
      "options": [
       {
        "id": "verify",
        "label": "交给矿班交接副本与后续问询项",
        "correct": true
       }
      ],
      "result": "矿班可以自行追问未还部分。"
     }
    ],
    "outcome": "修护等待本次点交完成，范围更可追索；政权与刑罚不在此定案。"
   }
  ],
  "combat": false
 },
 {
  "id": "personal.dwarf.coup.08",
  "race": "dwarf",
  "arcId": "personal.dwarf.coup",
  "number": 8,
  "title": "再下矿以前",
  "chapter": 11,
  "gate": "flag:MAIN_STORY_CLEAR",
  "siteId": "dwarf.a05",
  "intro": [
   "杜铎把班牌挂在入口。未归还的物资、没答的问题都还记着。",
   "矿工：先修运车口，还是后面的撤路？",
   "布洛克：你们每天走，先说哪边。"
  ],
  "choices": [
   {
    "id": "working-mouth",
    "label": "先修稳主作业口",
    "actions": [
     {
      "prompt": "旧标记已经失效，先做什么？",
      "options": [
       {
        "id": "inspect",
        "label": "替换标记并空车试载",
        "correct": true
       }
      ],
      "result": "主口恢复小车稳定搬运。"
     },
     {
      "prompt": "以后谁能叫停？",
      "options": [
       {
        "id": "verify",
        "label": "当班发现异常就停并复查",
        "correct": true
       }
      ],
      "result": "矿班独立完成一轮检查。"
     }
    ],
    "outcome": "主作业口更稳，杜铎接续备用撤路；案件尚未结束，矿班已有自己的判断程序。"
   },
   {
    "id": "escape-route",
    "label": "先打通备用撤路",
    "actions": [
     {
      "prompt": "狭口有碎石，如何清理？",
      "options": [
       {
        "id": "inspect",
        "label": "由出口向内核实落脚与接应",
        "correct": true
       }
      ],
      "result": "撤路落脚点与出口接应可用。"
     },
     {
      "prompt": "主口尚未全面修好，怎样安排？",
      "options": [
       {
        "id": "verify",
        "label": "维持小车慢运并由当班复查",
        "correct": true
       }
      ],
      "result": "矿班确认当前限制并自行排班。"
     }
    ],
    "outcome": "备用撤路先通，主口保持慢运；布洛克不再替矿班包办每一次判断。"
   }
  ],
  "combat": false
 },
 {
  "id": "personal.human.duty.01",
  "race": "human",
  "arcId": "personal.human.duty",
  "number": 1,
  "title": "谁的那一袋",
  "chapter": 2,
  "gate": "C02.O01.human",
  "siteId": "human.a01",
  "intro": [
   "货主：少的那袋，我还得交账。",
   "伤者需要粮，货物却不能一句话变成军需。罗什福尔摊开两份登记。"
  ],
  "choices": [
   {
    "id": "sealed-owner",
    "label": "按所有权封存，另接救济",
    "actions": [
     {
      "prompt": "先核对哪份记录？",
      "options": [
       {
        "id": "inspect",
        "label": "货主封记与实际袋数",
        "correct": true
       }
      ],
      "result": "争议粮按来源封存。"
     },
     {
      "prompt": "救济交接要记什么？",
      "options": [
       {
        "id": "verify",
        "label": "自愿出粮者、数量与接收者",
        "correct": true
       }
      ],
      "result": "另一份救济明确送到伤者手里。"
     }
    ],
    "outcome": "货主可按原货单追索，伤者获得另有来源的救济。",
    "lateActions": [
     {
      "prompt": "原粮袋已经有去向。如今清理货主与接收者仍未对上的账目。",
      "options": [
       {
        "id": "inspect-current",
        "label": "请双方核对当前袋数、已交数量与原始封记。",
        "correct": true
       }
      ],
      "result": "请双方核对当前袋数、已交数量与原始封记。 已完成并记录当前状态。"
     },
     {
      "prompt": "接续所选方案：按所有权封存，另接救济",
      "options": [
       {
        "id": "handover-current",
        "label": "分出仍属货主的争议部分，向自愿救济方交出实际接收表。",
        "correct": true
       }
      ],
      "result": "分出仍属货主的争议部分，向自愿救济方交出实际接收表。 本次交接已记录。"
     }
    ]
   },
   {
    "id": "consented-loan",
    "label": "登记双方同意的临时借用",
    "actions": [
     {
      "prompt": "借用前要确认什么？",
      "options": [
       {
        "id": "inspect",
        "label": "货主和接收者都同意范围",
        "correct": true
       }
      ],
      "result": "借用范围由双方确认。"
     },
     {
      "prompt": "怎么避免借粮凭空消失？",
      "options": [
       {
        "id": "verify",
        "label": "写明数量、接收与后续归还联系人",
        "correct": true
       }
      ],
      "result": "双方各留一份借用记录。"
     }
    ],
    "outcome": "货主以后按借用表催还，不能把伤者当免费奖励。",
    "lateActions": [
     {
      "prompt": "原粮袋已经有去向。如今清理货主与接收者仍未对上的账目。",
      "options": [
       {
        "id": "inspect-current",
        "label": "请双方核对当前袋数、已交数量与原始封记。",
        "correct": true
       }
      ],
      "result": "请双方核对当前袋数、已交数量与原始封记。 已完成并记录当前状态。"
     },
     {
      "prompt": "接续所选方案：登记双方同意的临时借用",
      "options": [
       {
        "id": "handover-current",
        "label": "核对双方同意的借用数量，将尚未归还的部分交给追索联系人。",
        "correct": true
       }
      ],
      "result": "核对双方同意的借用数量，将尚未归还的部分交给追索联系人。 本次交接已记录。"
     }
    ]
   }
  ],
  "combat": false,
  "lateIntro": "原粮袋已经有去向。如今清理货主与接收者仍未对上的账目。"
 },
 {
  "id": "personal.human.duty.02",
  "race": "human",
  "arcId": "personal.human.duty",
  "number": 2,
  "title": "一趟车装不下",
  "chapter": 4,
  "gate": "C04.HD01.human",
  "siteId": "human.a03",
  "intro": [
   "鲁托：车只有一趟。伤者和药械，先送哪边？",
   "罗什福尔：没先走的那一边，也得有人接。"
  ],
  "choices": [
   {
    "id": "patients-first",
    "label": "先护送伤者，交接药械给鲁托",
    "actions": [
     {
      "prompt": "担架短路的哪点必须核实？",
      "options": [
       {
        "id": "inspect",
        "label": "转角宽度和落脚点",
        "correct": true
       }
      ],
      "result": "担架短路可供实际通行。"
     },
     {
      "prompt": "留后的药械如何处理？",
      "options": [
       {
        "id": "verify",
        "label": "鲁托点收并明确下一趟接货处",
        "correct": true
       }
      ],
      "result": "鲁托接受载重车交接。"
     }
    ],
    "outcome": "伤者先到，药械有具名接应；未声称所有失货已追回。",
    "lateActions": [
     {
      "prompt": "原来那趟车已经走过，不让伤者重走险路。现在接续剩余运送。",
      "options": [
       {
        "id": "inspect-current",
        "label": "到交接点清点仍待送达的药械，并核实未完成的担架接应。",
        "correct": true
       }
      ],
      "result": "到交接点清点仍待送达的药械，并核实未完成的担架接应。 已完成并记录当前状态。"
     },
     {
      "prompt": "接续所选方案：先护送伤者，交接药械给鲁托",
      "options": [
       {
        "id": "handover-current",
        "label": "试走现存担架转角，向鲁托交代下一趟药械清单。",
        "correct": true
       }
      ],
      "result": "试走现存担架转角，向鲁托交代下一趟药械清单。 本次交接已记录。"
     }
    ]
   },
   {
    "id": "medicine-first",
    "label": "先送急需药械，安排担架接应",
    "actions": [
     {
      "prompt": "载重车该走哪里？",
      "options": [
       {
        "id": "inspect",
        "label": "检查桥面后走绕路",
        "correct": true
       }
      ],
      "result": "载重车采用已核实的绕路。"
     },
     {
      "prompt": "未同车的伤者怎么办？",
      "options": [
       {
        "id": "verify",
        "label": "由自愿担架组确认接应与到达",
        "correct": true
       }
      ],
      "result": "担架组接下伤者，留回报节点。"
     }
    ],
    "outcome": "药械先到，伤者有接应；不存在被选项悄悄牺牲的人。",
    "lateActions": [
     {
      "prompt": "原来那趟车已经走过，不让伤者重走险路。现在接续剩余运送。",
      "options": [
       {
        "id": "inspect-current",
        "label": "到交接点清点仍待送达的药械，并核实未完成的担架接应。",
        "correct": true
       }
      ],
      "result": "到交接点清点仍待送达的药械，并核实未完成的担架接应。 已完成并记录当前状态。"
     },
     {
      "prompt": "接续所选方案：先送急需药械，安排担架接应",
      "options": [
       {
        "id": "handover-current",
        "label": "检查现存载重绕路，将担架接续名单交给自愿接应组。",
        "correct": true
       }
      ],
      "result": "检查现存载重绕路，将担架接续名单交给自愿接应组。 本次交接已记录。"
     }
    ]
   }
  ],
  "combat": true,
  "lateIntro": "原来那趟车已经走过，不让伤者重走险路。现在接续剩余运送。"
 },
 {
  "id": "personal.human.duty.03",
  "race": "human",
  "arcId": "personal.human.duty",
  "number": 3,
  "title": "军令背面的名单",
  "chapter": 6,
  "gate": "C06.H01.human",
  "siteId": "human.a05",
  "intro": [
   "巡路补给必须交接，已登记的平民队伍也还在路上。",
   "罗什福尔：谁接哪个岗，先讲清楚。"
  ],
  "choices": [
   {
    "id": "split-team",
    "label": "分队接应，保留军需交接",
    "actions": [
     {
      "prompt": "两个岗位同时缺人，怎么排？",
      "options": [
       {
        "id": "inspect",
        "label": "让自愿接应组报数，留原岗交接人",
        "correct": true
       }
      ],
      "result": "两个岗位分别有人承担。"
     },
     {
      "prompt": "接应开始前核实什么？",
      "options": [
       {
        "id": "verify",
        "label": "集合口令与未归名单",
        "correct": true
       }
      ],
      "result": "缺席者仍留在待查名单。"
     }
    ],
    "outcome": "守路后补给与平民两份交接分别留名；不是自动完成所有追回。",
    "lateActions": [
     {
      "prompt": "当年的军需岗不重新撤空。如今核对仍在使用的巡路交接。",
      "options": [
       {
        "id": "inspect-current",
        "label": "走到现存交班点，分开核对军需与平民接应的责任表。",
        "correct": true
       }
      ],
      "result": "走到现存交班点，分开核对军需与平民接应的责任表。 已完成并记录当前状态。"
     },
     {
      "prompt": "接续所选方案：分队接应，保留军需交接",
      "options": [
       {
        "id": "handover-current",
        "label": "让两名自愿接应者分别核对各自路线，补齐回报时间。",
        "correct": true
       }
      ],
      "result": "让两名自愿接应者分别核对各自路线，补齐回报时间。 本次交接已记录。"
     }
    ]
   },
   {
    "id": "relief-post",
    "label": "请求接岗后亲自护送",
    "actions": [
     {
      "prompt": "离开原岗前要等什么？",
      "options": [
       {
        "id": "inspect",
        "label": "接替者到岗并确认交接",
        "correct": true
       }
      ],
      "result": "现岗有人正式接替。"
     },
     {
      "prompt": "护送在岔路遇到货队怎么办？",
      "options": [
       {
        "id": "verify",
        "label": "核对人员名单，标明货队另行接应",
        "correct": true
       }
      ],
      "result": "人货优先级和接应地点明确。"
     }
    ],
    "outcome": "罗什福尔护送平民，军需仍由实际接岗者承担；不新增军法定罪。",
    "lateActions": [
     {
      "prompt": "当年的军需岗不重新撤空。如今核对仍在使用的巡路交接。",
      "options": [
       {
        "id": "inspect-current",
        "label": "走到现存交班点，分开核对军需与平民接应的责任表。",
        "correct": true
       }
      ],
      "result": "走到现存交班点，分开核对军需与平民接应的责任表。 已完成并记录当前状态。"
     },
     {
      "prompt": "接续所选方案：请求接岗后亲自护送",
      "options": [
       {
        "id": "handover-current",
        "label": "等待实际接替者到场，再亲自把待交名单送到平民集合点。",
        "correct": true
       }
      ],
      "result": "等待实际接替者到场，再亲自把待交名单送到平民集合点。 本次交接已记录。"
     }
    ]
   }
  ],
  "combat": true,
  "lateIntro": "当年的军需岗不重新撤空。如今核对仍在使用的巡路交接。"
 },
 {
  "id": "personal.human.duty.04",
  "race": "human",
  "arcId": "personal.human.duty",
  "number": 4,
  "title": "让谁先知道路",
  "chapter": 7,
  "gate": "C07.O01.human",
  "siteId": "human.a05",
  "intro": [
   "封路后，有一条可步行的短路。信息若没送到，就还不是援路。"
  ],
  "choices": [
   {
    "id": "patients-informed",
    "label": "先把已确认的短路送给伤者队伍",
    "actions": [
     {
      "prompt": "路线图上必须留下哪个限制？",
      "options": [
       {
        "id": "inspect",
        "label": "仅步行与担架，重车禁入",
        "correct": true
       }
      ],
      "result": "短路限制清楚标出。"
     },
     {
      "prompt": "怎样确认信息送达？",
      "options": [
       {
        "id": "verify",
        "label": "由接应者复述转角和集合点",
        "correct": true
       }
      ],
      "result": "伤者队伍确认收到路线。"
     }
    ],
    "outcome": "下一次交接按人员通行，货车继续等待载重核验。",
    "lateActions": [
     {
      "prompt": "安全路的旧消息已经过期，重新确认今天能走哪一段。",
      "options": [
       {
        "id": "inspect-current",
        "label": "沿现存短路检查窄桥与转角，将失效标记撤下。",
        "correct": true
       }
      ],
      "result": "沿现存短路检查窄桥与转角，将失效标记撤下。 已完成并记录当前状态。"
     },
     {
      "prompt": "接续所选方案：先把已确认的短路送给伤者队伍",
      "options": [
       {
        "id": "handover-current",
        "label": "把新核实的担架路线亲自交给伤者队伍的接应者。",
        "correct": true
       }
      ],
      "result": "把新核实的担架路线亲自交给伤者队伍的接应者。 本次交接已记录。"
     }
    ]
   },
   {
    "id": "scout-check",
    "label": "先派可返程的斥候核实载重",
    "actions": [
     {
      "prompt": "斥候出发前约好什么？",
      "options": [
       {
        "id": "inspect",
        "label": "返回时限与未返接应点",
        "correct": true
       }
      ],
      "result": "侦查有明确的返程约定。"
     },
     {
      "prompt": "窄桥承重未知，怎样标注？",
      "options": [
       {
        "id": "verify",
        "label": "标未知，回报实际可走段",
        "correct": true
       }
      ],
      "result": "已知与未知分开交给后队。"
     }
    ],
    "outcome": "后续货队只走已核实载重的路；信息不会一句话结束战争。",
    "lateActions": [
     {
      "prompt": "安全路的旧消息已经过期，重新确认今天能走哪一段。",
      "options": [
       {
        "id": "inspect-current",
        "label": "沿现存短路检查窄桥与转角，将失效标记撤下。",
        "correct": true
       }
      ],
      "result": "沿现存短路检查窄桥与转角，将失效标记撤下。 已完成并记录当前状态。"
     },
     {
      "prompt": "接续所选方案：先派可返程的斥候核实载重",
      "options": [
       {
        "id": "handover-current",
        "label": "请可返程斥候复核载重段，收到返回报告后交给货队。",
        "correct": true
       }
      ],
      "result": "请可返程斥候复核载重段，收到返回报告后交给货队。 本次交接已记录。"
     }
    ]
   }
  ],
  "combat": false,
  "lateIntro": "安全路的旧消息已经过期，重新确认今天能走哪一段。"
 },
 {
  "id": "personal.human.duty.05",
  "race": "human",
  "arcId": "personal.human.duty",
  "number": 5,
  "title": "还在门外的名字",
  "chapter": 10,
  "gate": "flag:H_INVASION_RESISTED",
  "siteId": "human.a05",
  "intro": [
   "城门抵抗之后，入城实数与登记仍对不上。",
   "罗什福尔：没找到，不等于死了。先找来源。"
  ],
  "choices": [
   {
    "id": "return-search",
    "label": "走一段返查路线",
    "actions": [
     {
      "prompt": "哪一段最值得先查？",
      "options": [
       {
        "id": "inspect",
        "label": "有最后目击时间和地点的岔口",
        "correct": true
       }
      ],
      "result": "最后目击地点被核实。"
     },
     {
      "prompt": "发现遗留包裹说明什么？",
      "options": [
       {
        "id": "verify",
        "label": "只记物证地点，继续找人证",
        "correct": true
       }
      ],
      "result": "失联名单保留来源与不确定性。"
     }
    ],
    "outcome": "返查路留下可继续追查的线索，不把失联全部算成死亡。"
   },
   {
    "id": "assembly-ledger",
    "label": "守集合点，核对已入城队伍",
    "actions": [
     {
      "prompt": "两队提到同一个名字，怎样计数？",
      "options": [
       {
        "id": "inspect",
        "label": "按本人特征与最后同行者去重",
        "correct": true
       }
      ],
      "result": "入城实数重新核定。"
     },
     {
      "prompt": "证言相互冲突怎么办？",
      "options": [
       {
        "id": "verify",
        "label": "分别记录来源和时间",
        "correct": true
       }
      ],
      "result": "待核实差异留给下一组返查。"
     }
    ],
    "outcome": "集合点建立有来源的失联清单；不虚报全员归来。"
   }
  ],
  "combat": false
 },
 {
  "id": "personal.human.duty.06",
  "race": "human",
  "arcId": "personal.human.duty",
  "number": 6,
  "title": "没结的账",
  "chapter": 11,
  "gate": "flag:MAIN_STORY_CLEAR",
  "siteId": "human.a05",
  "intro": [
   "剩余失货与失联人员是两份不同的责任。",
   "罗什福尔：我不可能每一条路都亲自走，但不能没人接。"
  ],
  "choices": [
   {
    "id": "cargo-lead",
    "label": "先开启追货线",
    "actions": [
     {
      "prompt": "追货人愿意接哪份材料？",
      "options": [
       {
        "id": "inspect",
        "label": "有货主与封记的失货表",
        "correct": true
       }
      ],
      "result": "自愿追货者接下有来源的货单。"
     },
     {
      "prompt": "寻人线如何继续？",
      "options": [
       {
        "id": "verify",
        "label": "另留具名联系人与待查节点",
        "correct": true
       }
      ],
      "result": "寻人职责仍有交接。"
     }
    ],
    "outcome": "优先追货，寻人继续；交接不许诺全部找回。"
   },
   {
    "id": "people-lead",
    "label": "先开启寻人线",
    "actions": [
     {
      "prompt": "寻人交接的关键是什么？",
      "options": [
       {
        "id": "inspect",
        "label": "最后目击、同伴和核验方式",
        "correct": true
       }
      ],
      "result": "自愿寻人者接下可核查线索。"
     },
     {
      "prompt": "失货表如何处理？",
      "options": [
       {
        "id": "verify",
        "label": "交给愿承担追索的人，保留货主联络",
        "correct": true
       }
      ],
      "result": "追货仍有责任人。"
     }
    ],
    "outcome": "优先寻人，追货继续；罗什福尔学会交接而非独自包办。"
   }
  ],
  "combat": false
 },
 {
  "id": "personal.elf.heir.01",
  "race": "elf",
  "arcId": "personal.elf.heir",
  "number": 1,
  "title": "谁留下来看泉",
  "chapter": 2,
  "gate": "flag:E_DRYSPRING_REPAIRED",
  "siteId": "elf.a02",
  "intro": [
   "泉水恢复，根系和供水仍需照看。",
   "莱姆斯：不是修完这一次，就再也没人问。"
  ],
  "choices": [
   {
    "id": "joint-patrol",
    "label": "共同巡查",
    "actions": [
     {
      "prompt": "出现新渗水，先看哪里？",
      "options": [
       {
        "id": "inspect",
        "label": "比对水位和根边裂口",
        "correct": true
       }
      ],
      "result": "两方确认同一处渗漏。"
     },
     {
      "prompt": "报告如何演练？",
      "options": [
       {
        "id": "verify",
        "label": "双方在报信点复述位置",
        "correct": true
       }
      ],
      "result": "共同巡查队完成一次故障报信。"
     }
    ],
    "outcome": "撤离时双方能提供相同入口消息；断水仍是根系破坏旧结构。",
    "lateActions": [
     {
      "prompt": "泉水仍在流，今天的水位和根边裂口需要重新检查。",
      "options": [
       {
        "id": "inspect-current",
        "label": "与村民比对现存水位记号，清开报信点前被杂物挡住的路。",
        "correct": true
       }
      ],
      "result": "与村民比对现存水位记号，清开报信点前被杂物挡住的路。 已完成并记录当前状态。"
     },
     {
      "prompt": "接续所选方案：共同巡查",
      "options": [
       {
        "id": "handover-current",
        "label": "带双方完成一次共同巡查与实际报信。",
        "correct": true
       }
      ],
      "result": "带双方完成一次共同巡查与实际报信。 本次交接已记录。"
     }
    ]
   },
   {
    "id": "shared-signal",
    "label": "分段照看，共用报信点",
    "actions": [
     {
      "prompt": "分段边界怎么定？",
      "options": [
       {
        "id": "inspect",
        "label": "按水道节点标清交界",
        "correct": true
       }
      ],
      "result": "交界有明确接应。"
     },
     {
      "prompt": "如何验证信号？",
      "options": [
       {
        "id": "verify",
        "label": "互相发出并确认一次故障报告",
        "correct": true
       }
      ],
      "result": "两段确认同一个报信方式。"
     }
    ],
    "outcome": "村民与守林者各有职责，也保留共同报信点。",
    "lateActions": [
     {
      "prompt": "泉水仍在流，今天的水位和根边裂口需要重新检查。",
      "options": [
       {
        "id": "inspect-current",
        "label": "与村民比对现存水位记号，清开报信点前被杂物挡住的路。",
        "correct": true
       }
      ],
      "result": "与村民比对现存水位记号，清开报信点前被杂物挡住的路。 已完成并记录当前状态。"
     },
     {
      "prompt": "接续所选方案：分段照看，共用报信点",
      "options": [
       {
        "id": "handover-current",
        "label": "分别走完两段交界，再让两方在共同报信点互认。",
        "correct": true
       }
      ],
      "result": "分别走完两段交界，再让两方在共同报信点互认。 本次交接已记录。"
     }
    ]
   }
  ],
  "combat": false,
  "lateIntro": "泉水仍在流，今天的水位和根边裂口需要重新检查。"
 },
 {
  "id": "personal.elf.heir.02",
  "race": "elf",
  "arcId": "personal.elf.heir",
  "number": 2,
  "title": "允许问的问题",
  "chapter": 4,
  "gate": "C04.DE01.elf",
  "siteId": "elf.a01",
  "intro": [
   "凭据有疑点，不代表莱姆斯已经知道动机。",
   "莱姆斯：先问这笔记录是谁写的，知道多少写多少。"
  ],
  "choices": [
   {
    "id": "formal-query",
    "label": "把疑点写进正式追索",
    "actions": [
     {
      "prompt": "两份凭据日期不同，如何写？",
      "options": [
       {
        "id": "inspect",
        "label": "分别列出日期与来源，提出核问",
        "correct": true
       }
      ],
      "result": "追索回报留下真实问题。"
     },
     {
      "prompt": "缺失的经手人说明怎么办？",
      "options": [
       {
        "id": "verify",
        "label": "明确尚未取得答复",
        "correct": true
       }
      ],
      "result": "回报区分事实与空缺。"
     }
    ],
    "outcome": "败北回报时仍有这份提问记录，不提前知道夺核心计划。",
    "lateActions": [
     {
      "prompt": "旧追索已有后续，今天仍要核对原问题有没有得到有来源的回答。",
      "options": [
       {
        "id": "inspect-current",
        "label": "将当初出库疑点、现存凭据和已取得答复逐项对照。",
        "correct": true
       }
      ],
      "result": "将当初出库疑点、现存凭据和已取得答复逐项对照。 已完成并记录当前状态。"
     },
     {
      "prompt": "接续所选方案：把疑点写进正式追索",
      "options": [
       {
        "id": "handover-current",
        "label": "补写一份注明原出处与未答项的正式追索回报。",
        "correct": true
       }
      ],
      "result": "补写一份注明原出处与未答项的正式追索回报。 本次交接已记录。"
     }
    ]
   },
   {
    "id": "verbatim-answer",
    "label": "先问经手者，逐句留原答",
    "actions": [
     {
      "prompt": "答复只覆盖出库，能推断什么？",
      "options": [
       {
        "id": "inspect",
        "label": "只记录亲手经办的范围",
        "correct": true
       }
      ],
      "result": "亲历与传闻分开。"
     },
     {
      "prompt": "回报给谁看？",
      "options": [
       {
        "id": "verify",
        "label": "把疑点与原答一并提交",
        "correct": true
       }
      ],
      "result": "问题没有被隐瞒，原话可核查。"
     }
    ],
    "outcome": "保留逐句原答，不让职位代替证据。",
    "lateActions": [
     {
      "prompt": "旧追索已有后续，今天仍要核对原问题有没有得到有来源的回答。",
      "options": [
       {
        "id": "inspect-current",
        "label": "将当初出库疑点、现存凭据和已取得答复逐项对照。",
        "correct": true
       }
      ],
      "result": "将当初出库疑点、现存凭据和已取得答复逐项对照。 已完成并记录当前状态。"
     },
     {
      "prompt": "接续所选方案：先问经手者，逐句留原答",
      "options": [
       {
        "id": "handover-current",
        "label": "邀请愿意核对的经手者确认本人原答，把新补充另行标注。",
        "correct": true
       }
      ],
      "result": "邀请愿意核对的经手者确认本人原答，把新补充另行标注。 本次交接已记录。"
     }
    ]
   }
  ],
  "combat": false,
  "lateIntro": "旧追索已有后续，今天仍要核对原问题有没有得到有来源的回答。"
 },
 {
  "id": "personal.elf.heir.03",
  "race": "elf",
  "arcId": "personal.elf.heir",
  "number": 3,
  "title": "把名字写在这里",
  "chapter": 6,
  "gate": "C06.E01.elf",
  "siteId": "elf.a05",
  "intro": [
   "伊瑟：留下的药已经分好了，缺的是后半程送达。",
   "莱姆斯：写谁负责，就让人找得到谁。"
  ],
  "choices": [
   {
    "id": "named-delivery",
    "label": "安排可承担的送达者",
    "actions": [
     {
      "prompt": "谁适合负责这段路？",
      "options": [
       {
        "id": "inspect",
        "label": "愿意且知道接应点的送达者",
        "correct": true
       }
      ],
      "result": "送达者明确同意负责。"
     },
     {
      "prompt": "收药点怎样确认？",
      "options": [
       {
        "id": "verify",
        "label": "核对接收者与已经分配的份额",
        "correct": true
       }
      ],
      "result": "药份不重复扣取，交接有姓名。"
     }
    ],
    "outcome": "受助者知道该找谁，莱姆斯负责复核送达。",
    "lateActions": [
     {
      "prompt": "原来的药份已经送过，不再次扣取。现在接续尚未归档的送达责任。",
      "options": [
       {
        "id": "inspect-current",
        "label": "前往村中接收点，核对已送药份与缺失的签收。",
        "correct": true
       }
      ],
      "result": "前往村中接收点，核对已送药份与缺失的签收。 已完成并记录当前状态。"
     },
     {
      "prompt": "接续所选方案：安排可承担的送达者",
      "options": [
       {
        "id": "handover-current",
        "label": "请实际送达者补足本人经历，并向接收者交出可联系名单。",
        "correct": true
       }
      ],
      "result": "请实际送达者补足本人经历，并向接收者交出可联系名单。 本次交接已记录。"
     }
    ]
   },
   {
    "id": "personal-escort",
    "label": "亲自护送后半程",
    "actions": [
     {
      "prompt": "离开前先交接什么？",
      "options": [
       {
        "id": "inspect",
        "label": "前半程药份与后段接应点",
        "correct": true
       }
      ],
      "result": "已有份额连贯转交。"
     },
     {
      "prompt": "抵达后怎样结单？",
      "options": [
       {
        "id": "verify",
        "label": "请接收者核对后署名",
        "correct": true
       }
      ],
      "result": "实际送达才完成记录。"
     }
    ],
    "outcome": "莱姆斯留下可核查的送达责任，不只是抗议台词。",
    "lateActions": [
     {
      "prompt": "原来的药份已经送过，不再次扣取。现在接续尚未归档的送达责任。",
      "options": [
       {
        "id": "inspect-current",
        "label": "前往村中接收点，核对已送药份与缺失的签收。",
        "correct": true
       }
      ],
      "result": "前往村中接收点，核对已送药份与缺失的签收。 已完成并记录当前状态。"
     },
     {
      "prompt": "接续所选方案：亲自护送后半程",
      "options": [
       {
        "id": "handover-current",
        "label": "亲自走完今天的安全后半程，将已核对签收送回照护处。",
        "correct": true
       }
      ],
      "result": "亲自走完今天的安全后半程，将已核对签收送回照护处。 本次交接已记录。"
     }
    ]
   }
  ],
  "combat": true,
  "lateIntro": "原来的药份已经送过，不再次扣取。现在接续尚未归档的送达责任。"
 },
 {
  "id": "personal.elf.heir.04",
  "race": "elf",
  "arcId": "personal.elf.heir",
  "number": 4,
  "title": "没跟他走的人",
  "chapter": 8,
  "gate": "flag:C08_COMPLETE",
  "siteId": "elf.a05",
  "intro": [
   "安全点的幸存者问他，反抗时到底发生了什么。",
   "莱姆斯：我可以说亲见的事，但不能要求你们因此原谅我。"
  ],
  "choices": [
   {
    "id": "listen-loss",
    "label": "先听幸存者的损失",
    "actions": [
     {
      "prompt": "几个人给出不同感受，怎样记？",
      "options": [
       {
        "id": "inspect",
        "label": "分别保留，不要求一致评价",
        "correct": true
       }
      ],
      "result": "不同损失各有自己的记录。"
     },
     {
      "prompt": "没有亲见的经过如何回答？",
      "options": [
       {
        "id": "verify",
        "label": "承认不知道，列出可核问的人",
        "correct": true
       }
      ],
      "result": "回答只到自己的见闻边界。"
     }
    ],
    "outcome": "部分幸存者愿意下次当面交谈，并非全体宽恕。",
    "lateActions": [
     {
      "prompt": "幸存者对反抗仍有问题；迟来的交谈不预设他们已经原谅。",
      "options": [
       {
        "id": "inspect-current",
        "label": "把现存亲历记录带到安全处，邀请愿意谈的人选定公开范围。",
        "correct": true
       }
      ],
      "result": "把现存亲历记录带到安全处，邀请愿意谈的人选定公开范围。 已完成并记录当前状态。"
     },
     {
      "prompt": "接续所选方案：先听幸存者的损失",
      "options": [
       {
        "id": "handover-current",
        "label": "先听今天仍未被回应的损失，逐项记下本人要求保留的原话。",
        "correct": true
       }
      ],
      "result": "先听今天仍未被回应的损失，逐项记下本人要求保留的原话。 本次交接已记录。"
     }
    ]
   },
   {
    "id": "written-account",
    "label": "先写亲见经过，再逐项回答",
    "actions": [
     {
      "prompt": "亲见与推断混在一句中，怎样拆？",
      "options": [
       {
        "id": "inspect",
        "label": "把亲见与待核实推断分栏",
        "correct": true
       }
      ],
      "result": "亲历记录标明边界。"
     },
     {
      "prompt": "有人不愿当面问，怎么办？",
      "options": [
       {
        "id": "verify",
        "label": "留下可递交书面问题的地方",
        "correct": true
       }
      ],
      "result": "书面提问也得到接续。"
     }
    ],
    "outcome": "有人选择书面往来；反抗没有自动换来认可或职位。",
    "lateActions": [
     {
      "prompt": "幸存者对反抗仍有问题；迟来的交谈不预设他们已经原谅。",
      "options": [
       {
        "id": "inspect-current",
        "label": "把现存亲历记录带到安全处，邀请愿意谈的人选定公开范围。",
        "correct": true
       }
      ],
      "result": "把现存亲历记录带到安全处，邀请愿意谈的人选定公开范围。 已完成并记录当前状态。"
     },
     {
      "prompt": "接续所选方案：先写亲见经过，再逐项回答",
      "options": [
       {
        "id": "handover-current",
        "label": "整理亲见与推断分栏的文本，再把未答问题交还提问者核对。",
        "correct": true
       }
      ],
      "result": "整理亲见与推断分栏的文本，再把未答问题交还提问者核对。 本次交接已记录。"
     }
    ]
   }
  ],
  "combat": false,
  "lateIntro": "幸存者对反抗仍有问题；迟来的交谈不预设他们已经原谅。"
 },
 {
  "id": "personal.elf.heir.05",
  "race": "elf",
  "arcId": "personal.elf.heir",
  "number": 5,
  "title": "不是完整的旧史",
  "chapter": 9,
  "gate": "flag:ASHEN_ORIGIN_CORROBORATED",
  "siteId": "elf.a05",
  "intro": [
   "旧记录已有独立印证，也仍有缺字。",
   "莱姆斯：不能因为找到了几行，就把空白都替别人填完。"
  ],
  "choices": [
   {
    "id": "marked-publication",
    "label": "公开已证实部分并标缺字",
    "actions": [
     {
      "prompt": "残缺铭文怎么抄？",
      "options": [
       {
        "id": "inspect",
        "label": "保留缺字标记与来源",
        "correct": true
       }
      ],
      "result": "读者能看见证据缺口。"
     },
     {
      "prompt": "涉及烬裔今天的选择，怎么写？",
      "options": [
       {
        "id": "verify",
        "label": "只陈述旧记录，不代族人表态",
        "correct": true
       }
      ],
      "result": "公开文本不把历史当服从义务。"
     }
    ],
    "outcome": "已证实内容可查，空白仍是空白。"
   },
   {
    "id": "joint-review",
    "label": "请砾恩与修护者共同校对",
    "actions": [
     {
      "prompt": "几份拓记不一致，怎么校？",
      "options": [
       {
        "id": "inspect",
        "label": "逐处标出处与不同读法",
        "correct": true
       }
      ],
      "result": "异读被保留。"
     },
     {
      "prompt": "校对者能代谁决定立场？",
      "options": [
       {
        "id": "verify",
        "label": "只为自己的意见署名",
        "correct": true
       }
      ],
      "result": "校对公开，不制造全族共识。"
     }
    ],
    "outcome": "记录可继续质疑；莱姆斯不凭空通晓古文。"
   }
  ],
  "combat": false
 },
 {
  "id": "personal.elf.heir.06",
  "race": "elf",
  "arcId": "personal.elf.heir",
  "number": 6,
  "title": "明天谁来",
  "chapter": 11,
  "gate": "flag:MAIN_STORY_CLEAR",
  "siteId": "elf.a02",
  "intro": [
   "泉边有人问，明天的照护由谁接着做。",
   "莱姆斯：先说这一天要做什么，不先给我一个头衔。"
  ],
  "choices": [
   {
    "id": "fixed-duty",
    "label": "固定承担一段照护",
    "actions": [
     {
      "prompt": "承诺怎样写才可兑现？",
      "options": [
       {
        "id": "inspect",
        "label": "具体日期、路段与接替办法",
        "correct": true
       }
      ],
      "result": "职责有可执行边界。"
     },
     {
      "prompt": "怎样核实照护不是一句话？",
      "options": [
       {
        "id": "verify",
        "label": "走完巡查并交接下一班",
        "correct": true
       }
      ],
      "result": "莱姆斯完成首轮日常工作。"
     }
    ],
    "outcome": "以具体职责接续继承，不自动继任大祭司。"
   },
   {
    "id": "voluntary-rota",
    "label": "组织自愿轮值并负责复查",
    "actions": [
     {
      "prompt": "轮值如何安排？",
      "options": [
       {
        "id": "inspect",
        "label": "逐个确认自愿与能值守的时间",
        "correct": true
       }
      ],
      "result": "各人只承担自己同意的时段。"
     },
     {
      "prompt": "空岗出现怎么办？",
      "options": [
       {
        "id": "verify",
        "label": "复查并找同意接替的人",
        "correct": true
       }
      ],
      "result": "轮值表留下真实待补项。"
     }
    ],
    "outcome": "有可复查的自愿轮值，不宣告新的宗教制度。"
   }
  ],
  "combat": false
 },
 {
  "id": "personal.ashen.agency.01",
  "race": "ashen",
  "arcId": "personal.ashen.agency",
  "number": 1,
  "title": "修好以后去哪",
  "chapter": 1,
  "gate": "C01.A01.ashen",
  "siteId": "ashen.a01",
  "intro": [
   "修护后的族人想自己决定去处。",
   "砾恩：我带你回来，不是替你把以后都答应下来。"
  ],
  "choices": [
   {
    "id": "chosen-companion",
    "label": "请同伴陪走，本人决定终点",
    "actions": [
     {
      "prompt": "同行前先问什么？",
      "options": [
       {
        "id": "inspect",
        "label": "伤者希望去哪里、是否接受陪同",
        "correct": true
       }
      ],
      "result": "本人同意了这次同行范围。"
     },
     {
      "prompt": "交接给同伴时怎样说？",
      "options": [
       {
        "id": "verify",
        "label": "转述已同意的路线与可中止点",
        "correct": true
       }
      ],
      "result": "临时照护有明确边界。"
     }
    ],
    "outcome": "受助者仍决定后续生活，不被救助变成债务。",
    "lateActions": [
     {
      "prompt": "受助者早已有自己的生活。这次只补修他本人仍希望改善的路。",
      "options": [
       {
        "id": "inspect-current",
        "label": "询问当前需要，清开现存短路的一处落脚障碍。",
        "correct": true
       }
      ],
      "result": "询问当前需要，清开现存短路的一处落脚障碍。 已完成并记录当前状态。"
     },
     {
      "prompt": "接续所选方案：请同伴陪走，本人决定终点",
      "options": [
       {
        "id": "handover-current",
        "label": "由本人邀请愿意同行的伙伴，实际试走其同意的一小段。",
        "correct": true
       }
      ],
      "result": "由本人邀请愿意同行的伙伴，实际试走其同意的一小段。 本次交接已记录。"
     }
    ]
   },
   {
    "id": "independent-path",
    "label": "修通可独行的短路",
    "actions": [
     {
      "prompt": "短路的障碍先查哪项？",
      "options": [
       {
        "id": "inspect",
        "label": "落脚点与能休息的转角",
        "correct": true
       }
      ],
      "result": "短路适合其当前行动状况。"
     },
     {
      "prompt": "路修好后谁决定启程？",
      "options": [
       {
        "id": "verify",
        "label": "由本人试走并决定",
        "correct": true
       }
      ],
      "result": "族人选择自己的启程时间。"
     }
    ],
    "outcome": "修护帮助独立，不代替本人意愿；没有起源泄露。",
    "lateActions": [
     {
      "prompt": "受助者早已有自己的生活。这次只补修他本人仍希望改善的路。",
      "options": [
       {
        "id": "inspect-current",
        "label": "询问当前需要，清开现存短路的一处落脚障碍。",
        "correct": true
       }
      ],
      "result": "询问当前需要，清开现存短路的一处落脚障碍。 已完成并记录当前状态。"
     },
     {
      "prompt": "接续所选方案：修通可独行的短路",
      "options": [
       {
        "id": "handover-current",
        "label": "请本人独立试走修好的短段，按他的反馈再调整休息点。",
        "correct": true
       }
      ],
      "result": "请本人独立试走修好的短段，按他的反馈再调整休息点。 本次交接已记录。"
     }
    ]
   }
  ],
  "combat": false,
  "lateIntro": "受助者早已有自己的生活。这次只补修他本人仍希望改善的路。"
 },
 {
  "id": "personal.ashen.agency.02",
  "race": "ashen",
  "arcId": "personal.ashen.agency",
  "number": 2,
  "title": "箱上的印",
  "chapter": 5,
  "gate": "C05.EA02.ashen",
  "siteId": "ashen.a04",
  "intro": [
   "修护者只问身体稳定不稳定，追索口信却还称它为箱里的遗物。",
   "砾恩：封记可以核对，我的感受也要记。"
  ],
  "choices": [
   {
    "id": "self-account",
    "label": "先由本人陈述变化",
    "actions": [
     {
      "prompt": "核心变化先记哪种信息？",
      "options": [
       {
        "id": "inspect",
        "label": "本人感受与出现时间",
        "correct": true
       }
      ],
      "result": "变化有当事人陈述。"
     },
     {
      "prompt": "追索口信要求归还，怎样答复？",
      "options": [
       {
        "id": "verify",
        "label": "承认归属争议，不把身体重新装箱",
        "correct": true
       }
      ],
      "result": "身体与物品的界限明确。"
     }
    ],
    "outcome": "承认争议，不强摘核心，不新编融合工艺。",
    "lateActions": [
     {
      "prompt": "核心的旧变化已有记录，今天仍须区分身体感受与物件追索。",
      "options": [
       {
        "id": "inspect-current",
        "label": "请修护者取出现存观察表，与本人今日感受分别登记。",
        "correct": true
       }
      ],
      "result": "请修护者取出现存观察表，与本人今日感受分别登记。 已完成并记录当前状态。"
     },
     {
      "prompt": "接续所选方案：先由本人陈述变化",
      "options": [
       {
        "id": "handover-current",
        "label": "由本人确认可公开的身体变化，将归属争议另列。",
        "correct": true
       }
      ],
      "result": "由本人确认可公开的身体变化，将归属争议另列。 本次交接已记录。"
     }
    ]
   },
   {
    "id": "observed-record",
    "label": "请修护者记录可观察部分",
    "actions": [
     {
      "prompt": "修护者无法解释的光纹怎么记？",
      "options": [
       {
        "id": "inspect",
        "label": "记录可见变化，原因留空",
        "correct": true
       }
      ],
      "result": "未知部分保持未知。"
     },
     {
      "prompt": "核对封记能决定什么？",
      "options": [
       {
        "id": "verify",
        "label": "只能核对物件来源，不决定身体归属",
        "correct": true
       }
      ],
      "result": "来源核验不变成处置族人的授权。"
     }
    ],
    "outcome": "修护记录可供以后核对，来历仍待主线印证。",
    "lateActions": [
     {
      "prompt": "核心的旧变化已有记录，今天仍须区分身体感受与物件追索。",
      "options": [
       {
        "id": "inspect-current",
        "label": "请修护者取出现存观察表，与本人今日感受分别登记。",
        "correct": true
       }
      ],
      "result": "请修护者取出现存观察表，与本人今日感受分别登记。 已完成并记录当前状态。"
     },
     {
      "prompt": "接续所选方案：请修护者记录可观察部分",
      "options": [
       {
        "id": "handover-current",
        "label": "核对封记来源与今日可见变化，原因不明之处继续留空。",
        "correct": true
       }
      ],
      "result": "核对封记来源与今日可见变化，原因不明之处继续留空。 本次交接已记录。"
     }
    ]
   }
  ],
  "combat": false,
  "lateIntro": "核心的旧变化已有记录，今天仍须区分身体感受与物件追索。"
 },
 {
  "id": "personal.ashen.agency.03",
  "race": "ashen",
  "arcId": "personal.ashen.agency",
  "number": 3,
  "title": "族长留下的岗位",
  "chapter": 7,
  "gate": "C07.EA03.ashen",
  "siteId": "ashen.a05",
  "intro": [
   "撤到安全点的人带着残缺的岗位记录。族长已经不在。",
   "砾恩：先别把谁推上那个位置。看看谁还没接到人。"
  ],
  "choices": [
   {
    "id": "lost-partner",
    "label": "先照顾失去搭档的人",
    "actions": [
     {
      "prompt": "搭档失联，先核对什么？",
      "options": [
       {
        "id": "inspect",
        "label": "最后交接的时间与地点",
        "correct": true
       }
      ],
      "result": "有来源的失联信息被保留。"
     },
     {
      "prompt": "临时岗位怎样接续？",
      "options": [
       {
        "id": "verify",
        "label": "征得同意后配新的报信伙伴",
        "correct": true
       }
      ],
      "result": "眼前撤路有人互相确认。"
     }
    ],
    "outcome": "照护失去搭档的人，不自动继任族长。",
    "lateActions": [
     {
      "prompt": "族长死亡不会再演一遍。现在接续仍缺交班的岗位与失联核问。",
      "options": [
       {
        "id": "inspect-current",
        "label": "到现存报信点整理岗位缺口和仍未确认的同伴名单。",
        "correct": true
       }
      ],
      "result": "到现存报信点整理岗位缺口和仍未确认的同伴名单。 已完成并记录当前状态。"
     },
     {
      "prompt": "接续所选方案：先照顾失去搭档的人",
      "options": [
       {
        "id": "handover-current",
        "label": "陪失去搭档的人核查最后交接，再为愿意接岗者安排伙伴。",
        "correct": true
       }
      ],
      "result": "陪失去搭档的人核查最后交接，再为愿意接岗者安排伙伴。 本次交接已记录。"
     }
    ]
   },
   {
    "id": "signal-gap",
    "label": "先补上无人交接的报信点",
    "actions": [
     {
      "prompt": "无人回应的报信点怎么处理？",
      "options": [
       {
        "id": "inspect",
        "label": "先核实退路，再派自愿接应",
        "correct": true
       }
      ],
      "result": "接应先确认可撤路线。"
     },
     {
      "prompt": "交接清单该留什么？",
      "options": [
       {
        "id": "verify",
        "label": "岗位、同意者与下次核验时间",
        "correct": true
       }
      ],
      "result": "空缺与已接岗位分开记录。"
     }
    ],
    "outcome": "不让别人失联，战斗只护眼前撤路，不决定战争胜负。",
    "lateActions": [
     {
      "prompt": "族长死亡不会再演一遍。现在接续仍缺交班的岗位与失联核问。",
      "options": [
       {
        "id": "inspect-current",
        "label": "到现存报信点整理岗位缺口和仍未确认的同伴名单。",
        "correct": true
       }
      ],
      "result": "到现存报信点整理岗位缺口和仍未确认的同伴名单。 已完成并记录当前状态。"
     },
     {
      "prompt": "接续所选方案：先补上无人交接的报信点",
      "options": [
       {
        "id": "handover-current",
        "label": "修复失效报信标记，实际确认下一班自愿接应者到达。",
        "correct": true
       }
      ],
      "result": "修复失效报信标记，实际确认下一班自愿接应者到达。 本次交接已记录。"
     }
    ]
   }
  ],
  "combat": true,
  "lateIntro": "族长死亡不会再演一遍。现在接续仍缺交班的岗位与失联核问。"
 },
 {
  "id": "personal.ashen.agency.04",
  "race": "ashen",
  "arcId": "personal.ashen.agency",
  "number": 4,
  "title": "先给谁看",
  "chapter": 9,
  "gate": "flag:ASHEN_ORIGIN_CORROBORATED",
  "siteId": "ashen.a05",
  "intro": [
   "起源记录已经有独立印证，但谁先知道，不等于谁能替所有人决定。"
  ],
  "choices": [
   {
    "id": "affected-first",
    "label": "先给最受影响的族人阅读",
    "actions": [
     {
      "prompt": "阅读邀请如何发出？",
      "options": [
       {
        "id": "inspect",
        "label": "说明来源，允许拒绝或提问",
        "correct": true
       }
      ],
      "result": "族人可以自愿读并留下疑问。"
     },
     {
      "prompt": "不同意见怎么保存？",
      "options": [
       {
        "id": "verify",
        "label": "保留署名意愿与不同看法",
        "correct": true
       }
      ],
      "result": "问题与不同意见一起留存。"
     }
    ],
    "outcome": "先读的人没有替全族作决定，仍有公开讨论机会。"
   },
   {
    "id": "repair-archive",
    "label": "先把可核对拓记送修护处",
    "actions": [
     {
      "prompt": "副本应该带什么？",
      "options": [
       {
        "id": "inspect",
        "label": "原出处、缺字与核对方式",
        "correct": true
       }
      ],
      "result": "修护处收到可校对的拓记。"
     },
     {
      "prompt": "保存之后如何保证别人可问？",
      "options": [
       {
        "id": "verify",
        "label": "留下访问和补充问题的途径",
        "correct": true
       }
      ],
      "result": "存放点接受后续核问。"
     }
    ],
    "outcome": "共同核对仍开放，不把记录变成少数人的命令。"
   }
  ],
  "combat": false
 },
 {
  "id": "personal.ashen.agency.05",
  "race": "ashen",
  "arcId": "personal.ashen.agency",
  "number": 5,
  "title": "那不是下一道命令",
  "chapter": 10,
  "gate": "flag:A_INVASION_RESISTED",
  "siteId": "ashen.a05",
  "intro": [
   "有人说，被创造来抵抗，就必须一直守最危险的地方。",
   "砾恩：那是过去的目的，不是你今天不能走的理由。"
  ],
  "choices": [
   {
    "id": "voluntary-relief",
    "label": "组织自愿换岗",
    "actions": [
     {
      "prompt": "换岗前需要谁同意？",
      "options": [
       {
        "id": "inspect",
        "label": "原岗与接岗的人分别确认",
        "correct": true
       }
      ],
      "result": "换岗由实际承担者同意。"
     },
     {
      "prompt": "不愿留下的人怎样安排？",
      "options": [
       {
        "id": "verify",
        "label": "告知退路，不取消其族人身份",
        "correct": true
       }
      ],
      "result": "拒绝守岗也保留选择权。"
     }
    ],
    "outcome": "岗位有明确同意，古代创造目的不等于永久服从。"
   },
   {
    "id": "verify-exit",
    "label": "先核实退路，再由本人决定",
    "actions": [
     {
      "prompt": "路线标记指向废口，怎样走？",
      "options": [
       {
        "id": "inspect",
        "label": "核对现存出口与接应点",
        "correct": true
       }
      ],
      "result": "退路按当前实地条件核实。"
     },
     {
      "prompt": "回到岗位后如何决定留下者？",
      "options": [
       {
        "id": "verify",
        "label": "说明风险与退路，让本人答复",
        "correct": true
       }
      ],
      "result": "自愿者留下，其余人按核实退路离开。"
     }
    ],
    "outcome": "留下与离开都有选择，不宣布举族一致。"
   }
  ],
  "combat": false
 },
 {
  "id": "personal.ashen.agency.06",
  "race": "ashen",
  "arcId": "personal.ashen.agency",
  "number": 6,
  "title": "我们自己的记录",
  "chapter": 11,
  "gate": "flag:MAIN_STORY_CLEAR",
  "siteId": "ashen.a05",
  "intro": [
   "古代记录旁还有空白，那里可以写今天的人。",
   "砾恩：不要只留一句我们应该是什么。也写我们怎么想。"
  ],
  "choices": [
   {
    "id": "oral-visits",
    "label": "巡访收集口述",
    "actions": [
     {
      "prompt": "口述者改了上一句话，如何记？",
      "options": [
       {
        "id": "inspect",
        "label": "让本人确认修改与公开范围",
        "correct": true
       }
      ],
      "result": "记录尊重本人解释。"
     },
     {
      "prompt": "相互矛盾的意见怎么并列？",
      "options": [
       {
        "id": "verify",
        "label": "保留来源，不强行合成共识",
        "correct": true
       }
      ],
      "result": "今日姓名与分歧都被留存。"
     }
    ],
    "outcome": "口述可继续补充，砾恩自己选择继续巡访，不继任族长。"
   },
   {
    "id": "shared-copies",
    "label": "建立可补充的存放点并送副本",
    "actions": [
     {
      "prompt": "存放点需要什么？",
      "options": [
       {
        "id": "inspect",
        "label": "出处索引和补充意见的位置",
        "correct": true
       }
      ],
      "result": "新问题能加入而不覆盖旧记录。"
     },
     {
      "prompt": "第一份副本如何交出？",
      "options": [
       {
        "id": "verify",
        "label": "请接收者核对缺页并保留提问方式",
        "correct": true
       }
      ],
      "result": "第一份副本完成实际交接。"
     }
    ],
    "outcome": "共同记录可以继续质疑，砾恩接下保存责任而非替全族发令。"
   }
  ],
  "combat": false
 },
 {
  "id": "personal.goblin.family.01",
  "race": "goblin",
  "arcId": "personal.goblin.family",
  "number": 1,
  "title": "越来越窄的粮路",
  "chapter": 6,
  "gate": "C06.G01.goblin",
  "siteId": "goblin.a04",
  "intro": [
   "奇克：不能再只算我一个人能不能钻过去。",
   "咔洛想帮忙，米芮拿出分粮记号，豆布把碗护在怀里。"
  ],
  "choices": [
   {
    "id": "short-load",
    "label": "让家人参与安全处的轻装整理",
    "actions": [
     {
      "prompt": "咔洛想背整袋粮，怎么试？",
      "options": [
       {
        "id": "inspect",
        "label": "在安全处试轻袋，不进危险粮路",
        "correct": true
       }
      ],
      "result": "咔洛自己试出了能稳拿的份量。"
     },
     {
      "prompt": "谁的那份可以省掉？",
      "options": [
       {
        "id": "verify",
        "label": "每个人都登记，不默认米芮少吃",
        "correct": true
       }
      ],
      "result": "米芮把自己也列进分配。"
     }
    ],
    "outcome": "家人参与的是安全准备，不被派去危险路段。",
    "lateActions": [
     {
      "prompt": "旧粮路已经改变，家人如今需要核对现有安全处的生活安排。",
      "options": [
       {
        "id": "inspect-current",
        "label": "和咔洛、米芮、豆布各自确认现有物件与每日需要。",
        "correct": true
       }
      ],
      "result": "和咔洛、米芮、豆布各自确认现有物件与每日需要。 已完成并记录当前状态。"
     },
     {
      "prompt": "接续所选方案：让家人参与安全处的轻装整理",
      "options": [
       {
        "id": "handover-current",
        "label": "在安全处重新试轻袋，把每个人的粮份都算进来。",
        "correct": true
       }
      ],
      "result": "在安全处重新试轻袋，把每个人的粮份都算进来。 本次交接已记录。"
     }
    ]
   },
   {
    "id": "route-signals",
    "label": "一起约定返程与等候信号",
    "actions": [
     {
      "prompt": "等候点设在哪里？",
      "options": [
       {
        "id": "inspect",
        "label": "能辨认且不越出安全范围的位置",
        "correct": true
       }
      ],
      "result": "豆布知道在哪里等，不承担侦察。"
     },
     {
      "prompt": "奇克晚归怎么处理？",
      "options": [
       {
        "id": "verify",
        "label": "按约定联系接应，不让咔洛独自追",
        "correct": true
       }
      ],
      "result": "家人知道晚归不等于追进险地。"
     }
    ],
    "outcome": "奇克不再把所有安排都藏在自己心里，孩子仍留在安全范围。",
    "lateActions": [
     {
      "prompt": "旧粮路已经改变，家人如今需要核对现有安全处的生活安排。",
      "options": [
       {
        "id": "inspect-current",
        "label": "和咔洛、米芮、豆布各自确认现有物件与每日需要。",
        "correct": true
       }
      ],
      "result": "和咔洛、米芮、豆布各自确认现有物件与每日需要。 已完成并记录当前状态。"
     },
     {
      "prompt": "接续所选方案：一起约定返程与等候信号",
      "options": [
       {
        "id": "handover-current",
        "label": "与三人实际走到能看见的报到点，演练晚归时如何联系。",
        "correct": true
       }
      ],
      "result": "与三人实际走到能看见的报到点，演练晚归时如何联系。 本次交接已记录。"
     }
    ]
   }
  ],
  "combat": false,
  "lateIntro": "旧粮路已经改变，家人如今需要核对现有安全处的生活安排。"
 },
 {
  "id": "personal.goblin.family.02",
  "race": "goblin",
  "arcId": "personal.goblin.family",
  "number": 2,
  "title": "一家人的路",
  "chapter": 10,
  "gate": "flag:G_FAMILY_SAFE",
  "siteId": "goblin.a02",
  "intro": [
   "主线已确认咔洛、米芮与豆布真实抵达安全点。奇克再把名字逐个叫一遍。",
   "奇克：现在说谁还缺什么，不用只说没事。"
  ],
  "choices": [
   {
    "id": "check-belongings",
    "label": "逐人核对安全点的需要",
    "actions": [
     {
      "prompt": "三份行李不等于三个人，先做什么？",
      "options": [
       {
        "id": "inspect",
        "label": "请三人分别应声并说自己的需要",
        "correct": true
       }
      ],
      "result": "咔洛、米芮、豆布各自回应。"
     },
     {
      "prompt": "缺的碗与粮怎样安排？",
      "options": [
       {
        "id": "verify",
        "label": "分别记下补给需求，保留豆布旧物",
        "correct": true
       }
      ],
      "result": "当前缺额有接应，不拿旧物当垃圾。"
     }
    ],
    "outcome": "抵达不是取消需要；团聚由主线唯一发生，这里处理抵达后的生活。"
   },
   {
    "id": "safe-routine",
    "label": "和家人确认营地内的活动边界",
    "actions": [
     {
      "prompt": "咔洛想帮送东西，去哪里？",
      "options": [
       {
        "id": "inspect",
        "label": "仅走已经核实的营地内短段",
        "correct": true
       }
      ],
      "result": "咔洛试走安全短段并知道停在哪。"
     },
     {
      "prompt": "豆布和米芮怎么知道你回来？",
      "options": [
       {
        "id": "verify",
        "label": "约定可看见的报到点与每人份额",
        "correct": true
       }
      ],
      "result": "一家人有可实行的营地作息。"
     }
    ],
    "outcome": "家人能参与营地生活，不由日常小事替代C10真实安置。"
   }
  ],
  "combat": false
 },
 {
  "id": "personal.goblin.family.03",
  "race": "goblin",
  "arcId": "personal.goblin.family",
  "number": 3,
  "title": "不能只靠一个人的袋子",
  "chapter": 10,
  "gate": "flag:G_FAMILY_SAFE",
  "siteId": "goblin.a05",
  "intro": [
   "偷粮与换粮的路都被入侵截断。奇克需要找愿意合作的人。",
   "奇克：我也要活。我的那份和该做的事，都先说清。"
  ],
  "choices": [
   {
    "id": "supply-handover",
    "label": "先接安全补给的交接差事",
    "actions": [
     {
      "prompt": "合作的粮份如何约定？",
      "options": [
       {
        "id": "inspect",
        "label": "记下各自贡献与实际可交数量",
        "correct": true
       }
      ],
      "result": "双方知道能交什么，不能交什么。"
     },
     {
      "prompt": "家人能承担哪部分？",
      "options": [
       {
        "id": "verify",
        "label": "只在安全处整理，不接前线岗",
        "correct": true
       }
      ],
      "result": "合作不靠让孩子冒险兑现。"
     }
    ],
    "outcome": "奇克因家人与生路参与共同抵抗，不变成政治领袖。"
   },
   {
    "id": "return-contact",
    "label": "先建立能返程的联络",
    "actions": [
     {
      "prompt": "联络人没有回来，如何接续？",
      "options": [
       {
        "id": "inspect",
        "label": "按约定核查，不让家人独追",
        "correct": true
       }
      ],
      "result": "联络有回报时限与接应。"
     },
     {
      "prompt": "收来的信息怎样给家人？",
      "options": [
       {
        "id": "verify",
        "label": "说清可确认的路与仍未知处",
        "correct": true
       }
      ],
      "result": "家人了解真实边界。"
     }
    ],
    "outcome": "合作有明确责任，也保留奇克谨慎的自利，不突然无私领政。"
   }
  ],
  "combat": true
 },
 {
  "id": "personal.goblin.family.04",
  "race": "goblin",
  "arcId": "personal.goblin.family",
  "number": 4,
  "title": "明天一起分",
  "chapter": 11,
  "gate": "flag:MAIN_STORY_CLEAR",
  "siteId": "goblin.a02",
  "intro": [
   "奇克放下袋子，没有立刻替每个人分好。",
   "米芮：今天也把你算进去。",
   "豆布把碗放在大家中间，咔洛等着试自己的那份。"
  ],
  "choices": [
   {
    "id": "shared-planning",
    "label": "一家人一起安排明天的份额",
    "actions": [
     {
      "prompt": "怎么开始分？",
      "options": [
       {
        "id": "inspect",
        "label": "四个人都说需要，再核对现有粮",
        "correct": true
       }
      ],
      "result": "每个人的份额都被算到。"
     },
     {
      "prompt": "能分担意味着什么？",
      "options": [
       {
        "id": "verify",
        "label": "咔洛试轻活、米芮核账、豆布保管自己的物件",
        "correct": true
       }
      ],
      "result": "分担有年龄与安全边界。"
     }
    ],
    "outcome": "奇克不再独自扛下所有生活，家人不是给他发号施令的附属。"
   },
   {
    "id": "shared-checkin",
    "label": "保留晚归份额，共同约定报到",
    "actions": [
     {
      "prompt": "晚归份额从哪里留？",
      "options": [
       {
        "id": "inspect",
        "label": "共同计算，不能只扣忍让者",
        "correct": true
       }
      ],
      "result": "晚归份额不靠一个人挨饿。"
     },
     {
      "prompt": "出门前由谁确认计划？",
      "options": [
       {
        "id": "verify",
        "label": "每个人知道等候和接应约定",
        "correct": true
       }
      ],
      "result": "家人可以提问，也知道怎样接续。"
     }
    ],
    "outcome": "一家人有共同生活的计划；余粮仍有限，但不再只有奇克能开口。"
   }
  ],
  "combat": false
 }
];
