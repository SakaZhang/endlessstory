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
   "空车才推过半截，轮缘就擦出一声尖响。杜铎用靴尖抵住车轮，把工人招到轨道外侧。",
   "杜铎：撑木换过了，旧轨还在侧移。",
   "布洛克：先把空车推回线内。停不停，得看它压在哪里。",
   "杜铎：上头只看见车停了。你得让他们看见，不停会怎样。"
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
    "outcome": "布洛克把停工缘由讲给接班者听。下次轨道再响，矿工可以先停车，再来找他。",
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
      "result": "松动的枕木换稳了，空车来回走过一趟，轮缘没有再向外挪。"
     },
     {
      "prompt": "接班者看不懂新添的侧移记号，布洛克得当面教他辨认。",
      "options": [
       {
        "id": "handover-current",
        "label": "由布洛克向接班者演示如何读侧移记号。",
        "correct": true
       }
      ],
      "result": "布洛克指着侧移记号演示了一遍，接班者蹲下来，又自己认了一次。"
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
    "outcome": "矿工们各自认下了要留意的裂口。谁发现异常，谁就能叫停这一班。",
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
      "result": "松动的枕木换稳了，空车来回走过一趟，轮缘没有再向外挪。"
     },
     {
      "prompt": "新裂口已经找出，矿班还需要试一次叫停和复查。",
      "options": [
       {
        "id": "handover-current",
        "label": "请矿班当场标出新裂口，演练自行停工。",
        "correct": true
       }
      ],
      "result": "矿班标出了新裂口，试着按约定叫停空车，入口很快传回应声。"
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
   "卸料口的尘土上压着一道新辙，旁边却堆着没有拆封的空绑绳。夜班的灯还亮着，车夫已经开始收工具。",
   "运务书记：旧卸料口换了车轮，矿班却说收不到撑木。",
   "布洛克：先查这趟车，不替不知道的事下结论。",
   "运务书记：账上写的是送进矿里。可这条岔道，根本不往矿班去。"
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
    "outcome": "检修沟的入口被记了下来。交接包里有改道标记和货单，钱款的去向还得往下查。",
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
      "result": "车轮磨痕对上了旧封记，交接包的存放处也找到了。"
     },
     {
      "prompt": "交接包的位置找到了，记录者需要一条能安全进去查验的路。",
      "options": [
       {
        "id": "handover-current",
        "label": "从维护沟复查后门，给记录者留下仅限查验的通路。",
        "correct": true
       }
      ],
      "result": "维护沟的后门仍能通行。记录者收下路图，记清了查验时的入口。"
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
    "outcome": "卸料口的后门封住了，车夫留下装车经过。至于最初是谁动的手，他也没看见。",
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
      "result": "车轮磨痕对上了旧封记，交接包的存放处也找到了。"
     },
     {
      "prompt": "旧留底还有几处说不清，找到当班车夫，听他亲口核对。",
      "options": [
       {
        "id": "handover-current",
        "label": "找到当班车夫，自愿核对旧留底与本人可公开的目击范围。",
        "correct": true
       }
      ],
      "result": "当班车夫对过旧留底，把愿意公开的目击经过说给记录者听。"
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
   "半截车架卡在便道上方，绳皮每受一次力就落下细屑。卷绳工靠着岩壁喘气，目光却还追着车底的封签。",
   "杜铎：爆后的便道还悬着一辆车。先看锚点。",
   "布洛克：人和封签分开算；不能为纸把人留在下面。",
   "杜铎：别伸手够了。先抓住绳子，剩下的我们来想。"
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
    "outcome": "伤者到了安全处，愿意说出自己见过的运输路线。没取回的封签，还能循其他账目追查。",
    "lateActions": [
     {
      "prompt": "卷绳工已经脱险，爆后的便道却还悬着松脱的车件。先清掉这些隐患。",
      "options": [
       {
        "id": "inspect-current",
        "label": "用独立岩柱固定检查绳，卸下悬在便道上的松脱旧车件。",
        "correct": true
       }
      ],
      "result": "检查绳牢牢系在岩柱上，悬在便道上方的旧车件逐一卸了下来。"
     },
     {
      "prompt": "卷绳工在安全处歇下了。趁他愿意说话，把见过的运输路线问清。",
      "options": [
       {
        "id": "handover-current",
        "label": "请安全处的卷绳工在路图标出亲见的运药段，登记其愿意公开的部分。",
        "correct": true
       }
      ],
      "result": "卷绳工在路图上画出见过的运药段，并圈出了可以公开的部分。"
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
    "outcome": "封签残片收进了证物袋。它能对上一趟转运，却还解释不了整笔军资的去向。",
    "lateActions": [
     {
      "prompt": "卷绳工已经脱险，爆后的便道却还悬着松脱的车件。先清掉这些隐患。",
      "options": [
       {
        "id": "inspect-current",
        "label": "用独立岩柱固定检查绳，卸下悬在便道上的松脱旧车件。",
        "correct": true
       }
      ],
      "result": "检查绳牢牢系在岩柱上，悬在便道上方的旧车件逐一卸了下来。"
     },
     {
      "prompt": "封签残片已收好，杜铎拿来了调拨副本，正等着逐项比对。",
      "options": [
       {
        "id": "handover-current",
        "label": "与杜铎核对存放的封签残片和调拨副本，把缺项留给记录者。",
        "correct": true
       }
      ],
      "result": "杜铎把封签残片摆在调拨副本旁，记录者接过尚缺的几项线索。"
     }
    ]
   }
  ],
  "combat": true,
  "lateIntro": "卷绳工已经脱险，爆后的便道却还悬着松脱的车件。先清掉这些隐患。"
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
   "接应表被折得发软，几处只写了“已到”，没留下人名。旁边有人举着空水壶，问下一队该往哪边送。",
   "杜铎：撤下来的都到了安全点。再对一遍名单，看看哪段接应还缺回信。",
   "布洛克：不只数车，让人自己应一声。",
   "杜铎：宽路能抬担架，窄路能避巡灯。两边的值守不能只靠猜。"
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
      "result": "抵达的人逐一应声，接应表补齐了名字。"
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
    "outcome": "值守者收下担架接应表，在转角处留出位置，等下一批需要照护的人。",
    "lateActions": [
     {
      "prompt": "撤离者已经抵达，接应点的记录却还没对齐。有人来问下一趟该在哪里等。",
      "options": [
       {
        "id": "inspect-current",
        "label": "逐人核对安全点应答与担架、步行者的到达记录。",
        "correct": true
       }
      ],
      "result": "安全点的人逐个应了声，担架与步行者的到达记录终于对齐。"
     },
     {
      "prompt": "名单对齐了，下一班还要抬担架经过转角。把接应位置交代给值守者。",
      "options": [
       {
        "id": "handover-current",
        "label": "实地复查担架转角，把当前宽路接应表交给值守者。",
        "correct": true
       }
      ],
      "result": "担架转角查过了，值守者接过接应表，认下下一趟该站的位置。"
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
      "result": "公开的路条只留接应位置，姓名另交值守者收好。"
     }
    ],
    "outcome": "窄道的接应点重新对上了信号，入口挂起禁行重车的牌子。",
    "lateActions": [
     {
      "prompt": "撤离者已经抵达，接应点的记录却还没对齐。有人来问下一趟该在哪里等。",
      "options": [
       {
        "id": "inspect-current",
        "label": "逐人核对安全点应答与担架、步行者的到达记录。",
        "correct": true
       }
      ],
      "result": "安全点的人逐个应了声，担架与步行者的到达记录终于对齐。"
     },
     {
      "prompt": "步行队伍还会经过窄道，先确认遮光支架和两处接应点仍能用。",
      "options": [
       {
        "id": "handover-current",
        "label": "检查遮光支架与两处步行接应点，修正禁止重车的标记。",
        "correct": true
       }
      ],
      "result": "遮光支架修稳了，两处接应点重新对上信号，重车禁行牌也挂回入口。"
     }
    ]
   }
  ],
  "combat": false,
  "lateIntro": "撤离者已经抵达，接应点的记录却还没对齐。有人来问下一趟该在哪里等。"
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
   "矿仓门边还有被车轮压碎的木屑。矿工等着补撑木，记录者却说，头车带走的纸匣可能就有这一批货的账。",
   "杜铎：矿仓还缺一份交接。纸匣和撑木，得分清先保哪项。",
   "布洛克：没留下的也记清，后面继续找。",
   "杜铎：两边都缺人。先赶哪一边，你给个话，我把另一边稳住。"
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
    "outcome": "纸匣的去向有了线索。矿班先用手头的撑木顶住险处，等缺失的账页送来核对。",
    "lateActions": [
     {
      "prompt": "车队早已离开矿仓，交接箱还在。缺了多少撑木，账页流向哪里，都得从这里接着查。",
      "options": [
       {
        "id": "inspect-current",
        "label": "打开仓房的现存交接箱，按封记将支出副页和撑木缺额分开。",
        "correct": true
       }
      ],
      "result": "交接箱打开了，支出副页放在一边，欠缺的撑木另列一张单。"
     },
     {
      "prompt": "交接箱里留下纸匣的索引，沿着它找找尚存的账页。",
      "options": [
       {
        "id": "handover-current",
        "label": "循纸匣索引查到现存账页，带回出处与仍缺原件的名单。",
        "correct": true
       }
      ],
      "result": "纸匣索引指向的账页找到了，原件仍缺的几项连同出处一并带回。"
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
    "outcome": "撑木送到了安置处，摇晃的支点终于稳住。布洛克把账页线索交给记录者，继续追查原账。",
    "lateActions": [
     {
      "prompt": "车队早已离开矿仓，交接箱还在。缺了多少撑木，账页流向哪里，都得从这里接着查。",
      "options": [
       {
        "id": "inspect-current",
        "label": "打开仓房的现存交接箱，按封记将支出副页和撑木缺额分开。",
        "correct": true
       }
      ],
      "result": "交接箱打开了，支出副页放在一边，欠缺的撑木另列一张单。"
     },
     {
      "prompt": "撑木已经追回一批，矿班在薄弱支点等人搭手搬运。",
      "options": [
       {
        "id": "handover-current",
        "label": "帮助矿班把已追回撑木运到现存薄弱支点，再交出缺料与副页索引。",
        "correct": true
       }
      ],
      "result": "追回的撑木顶住了薄弱支点，剩下的缺料单和账页索引交到记录者手里。"
     }
    ]
   }
  ],
  "combat": true,
  "lateIntro": "车队早已离开矿仓，交接箱还在。缺了多少撑木，账页流向哪里，都得从这里接着查。"
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
   "记录者把两页纸压在同一盏灯下，沿着日期划出一条线。杜铎盯了很久，手里的旧班牌被握得发热。",
   "记录者：运输留底和支出账对上了。钱到了谁手里，现在能顺着这几页查清。",
   "杜铎：我想问，知道下面有人，为什么不等？",
   "布洛克：你想当面问，我就陪你去。不想去的人，把话留给我也行。"
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
    "outcome": "杜铎把问题问了出来，布洛克在一旁递上出处。留下修护的人也会收到这次答复。"
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
    "outcome": "布洛克带走矿班的问题，约好逐项带回答复。杜铎留在矿里，把未修完的支点接着补好。"
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
   "物资清单摆上桌时，一角还压着要求撤回证词的附页。门外等着的矿车没有卸货，矿工也没有散。",
   "记录者安排了临时对质，不是宣判。维尔铎仍带着随从。",
   "维尔铎：门关了，矿还得开。下一车补给，你们要不要？",
   "布洛克：物资是矿班的，不能拿来换他们闭嘴。",
   "杜铎：少了多少，我们记得。还回来多少，也会一件件数。"
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
    "outcome": "归还的物资先送去修护，证词和缺额单仍留在桌上。维尔铎还欠矿班一个交代。"
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
    "outcome": "双方点清了这一车物资。缺额写在交接单旁，车轮终于朝矿班的方向转动。"
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
   "入口的碎石扫成一堆，两条路仍各缺一段修护。矿工把常走的位置圈在图上，留出中间的位置给后来的人补记。",
   "杜铎把班牌挂在入口。未归还的物资、没答的问题都还记着。",
   "矿工：先修运车口，还是后面的撤路？",
   "布洛克：你们每天走，先说哪边。",
   "杜铎：先修哪边都得留人照看另一边。班怎么排，咱们今天一起定。"
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
    "outcome": "主作业口能稳稳走车了，杜铎接着查看备用撤路。未结的账还在，矿班也有了自己的停工规矩。"
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
    "outcome": "备用撤路先通了，主口暂且慢运。矿工自己排好下一班，布洛克听完，只补了一处漏看的裂口。"
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
   "粮袋靠着墙，袋口的旧封记还没拆。另一边，照护伤者的人已经来问过两次，今晚还能分多少。",
   "货主：少的那袋，我还得交账。",
   "伤者需要粮，货物却不能一句话变成军需。罗什福尔摊开两份登记。",
   "罗什福尔：先把是谁的、借多少说清。不能今天吃上了，明天又让两边为这袋粮吵起来。"
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
    "outcome": "货主留着原货单，伤者领到了另筹的救济粮。两笔账分别写清，再不用争同一只粮袋。",
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
      "result": "粮袋数、已交数量和旧封记逐项对过，未对上的部分留在单旁。"
     },
     {
      "prompt": "领粮数已核清，争议粮和另筹的救济该分别交给谁？",
      "options": [
       {
        "id": "handover-current",
        "label": "分出仍属货主的争议部分，向自愿救济方交出实际接收表。",
        "correct": true
       }
      ],
      "result": "争议粮另放一处，救济方收下了实际领粮的人数表。"
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
    "outcome": "双方各收好借粮单。伤者先有饭吃，货主也知道该向谁询问归还。",
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
      "result": "粮袋数、已交数量和旧封记逐项对过，未对上的部分留在单旁。"
     },
     {
      "prompt": "借粮单上的数量对上了，尚未归还的部分还需要有人继续联络。",
      "options": [
       {
        "id": "handover-current",
        "label": "核对双方同意的借用数量，将尚未归还的部分交给追索联系人。",
        "correct": true
       }
      ],
      "result": "双方对清借用数量，追索联系人收下尚未归还的清单。"
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
   "车夫试了试轴，摇头卸下一只箱子。担架放在车边，药械的领用条还夹在箱盖下，两边都有人等。",
   "鲁托：车只有一趟。伤者和药械，先送哪边？",
   "罗什福尔：没先走的那一边，也得有人接。",
   "鲁托：你先带走哪边，另一边就给我留个准话。我得知道该到哪个路口等。"
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
    "outcome": "伤者先到了照护处，鲁托接下药械清单。还有几件失货没有下落，另留在待查栏里。",
    "lateActions": [
     {
      "prompt": "上一趟车已经送到，交接点却还堆着药械，几副担架也在等下一班接应。",
      "options": [
       {
        "id": "inspect-current",
        "label": "到交接点清点仍待送达的药械，并核实未完成的担架接应。",
        "correct": true
       }
      ],
      "result": "交接点剩下的药械清点过了，还没接上的担架也有了名单。"
     },
     {
      "prompt": "剩余药械点清了。先试过担架转角，再把下一趟车的清单交给鲁托。",
      "options": [
       {
        "id": "handover-current",
        "label": "试走现存担架转角，向鲁托交代下一趟药械清单。",
        "correct": true
       }
      ],
      "result": "担架能稳稳通过转角，鲁托也接过了下一趟药械的清单。"
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
    "outcome": "急用的药械先上了车，担架组留下接应伤者，约好在下一处路口报平安。",
    "lateActions": [
     {
      "prompt": "上一趟车已经送到，交接点却还堆着药械，几副担架也在等下一班接应。",
      "options": [
       {
        "id": "inspect-current",
        "label": "到交接点清点仍待送达的药械，并核实未完成的担架接应。",
        "correct": true
       }
      ],
      "result": "交接点剩下的药械清点过了，还没接上的担架也有了名单。"
     },
     {
      "prompt": "担架组已经有人接手，载重车的绕路也该再查一遍。",
      "options": [
       {
        "id": "handover-current",
        "label": "检查现存载重绕路，将担架接续名单交给自愿接应组。",
        "correct": true
       }
      ],
      "result": "载重绕路查过了，愿意接应的人各自认下需要照护的伤者。"
     }
    ]
   }
  ],
  "combat": true,
  "lateIntro": "上一趟车已经送到，交接点却还堆着药械，几副担架也在等下一班接应。"
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
   "补给单和平民名册摊在同一张矮桌上。守岗的人看看天色，接应队已经开始收起铺盖，谁都怕错过出发的时辰。",
   "巡路补给必须交接，已登记的平民队伍也还在路上。",
   "罗什福尔：谁接哪个岗，先讲清楚。",
   "罗什福尔：不是把名字写上就算有人。接岗的人到了，我们才动。"
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
    "outcome": "补给和平民队伍各有接应者签名。尚未找到的货物，仍记在另一份待查单上。",
    "lateActions": [
     {
      "prompt": "巡路交班还沿用那张旧表。路况变了，军需和平民接应的安排也该重新核对。",
      "options": [
       {
        "id": "inspect-current",
        "label": "走到现存交班点，分开核对军需与平民接应的责任表。",
        "correct": true
       }
      ],
      "result": "交班点的两张责任表重新对过，军需和平民接应各有着落。"
     },
     {
      "prompt": "两条接应路线已经分开，出发前让负责的人各自认清回报地点。",
      "options": [
       {
        "id": "handover-current",
        "label": "让两名自愿接应者分别核对各自路线，补齐回报时间。",
        "correct": true
       }
      ],
      "result": "两名接应者分别认清路线，约好了各自回报的时辰。"
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
    "outcome": "接岗者站稳了原来的哨位，罗什福尔这才转身，带平民队伍走向集合点。",
    "lateActions": [
     {
      "prompt": "巡路交班还沿用那张旧表。路况变了，军需和平民接应的安排也该重新核对。",
      "options": [
       {
        "id": "inspect-current",
        "label": "走到现存交班点，分开核对军需与平民接应的责任表。",
        "correct": true
       }
      ],
      "result": "交班点的两张责任表重新对过，军需和平民接应各有着落。"
     },
     {
      "prompt": "名单准备好了。等接替者到岗，再送去平民集合点。",
      "options": [
       {
        "id": "handover-current",
        "label": "等待实际接替者到场，再亲自把待交名单送到平民集合点。",
        "correct": true
       }
      ],
      "result": "接替者到了岗，罗什福尔把待交名单带到平民集合点。"
     }
    ]
   }
  ],
  "combat": true,
  "lateIntro": "巡路交班还沿用那张旧表。路况变了，军需和平民接应的安排也该重新核对。"
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
   "报路人鞋上还沾着湿泥，图上那条近路只画到一座窄桥。伤者队伍问能不能抬担架，货队问车轮能不能过。",
   "封路后，有一条可步行的短路。信息若没送到，就还不是援路。",
   "罗什福尔：先把确实走得通的告诉他们。没试过的地方，别为了让人安心就画成通路。"
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
    "outcome": "伤者队伍收到了步行路线。货车暂时留下，等窄桥的承重查清再走。",
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
      "result": "窄桥和转角都查过了，指向险处的旧标记被撤下来。"
     },
     {
      "prompt": "担架能走的路已经确认，伤者队伍还在等这份新消息。",
      "options": [
       {
        "id": "handover-current",
        "label": "把新核实的担架路线亲自交给伤者队伍的接应者。",
        "correct": true
       }
      ],
      "result": "接应者收下新路图，指着窄桥复述了一遍担架该怎样通过。"
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
    "outcome": "斥候带回载重记录，后续货队照着标记绕行。余下的路，还得一段段查。",
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
      "result": "窄桥和转角都查过了，指向险处的旧标记被撤下来。"
     },
     {
      "prompt": "货队暂时不能过桥。请斥候查清承重，把回报带回来。",
      "options": [
       {
        "id": "handover-current",
        "label": "请可返程斥候复核载重段，收到返回报告后交给货队。",
        "correct": true
       }
      ],
      "result": "斥候按约定回来，把载重段的情况交给等候的货队。"
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
   "集合点一次次有人报出熟悉的名字，也一次次发现叫的是同名的人。罗什福尔把已经对上的纸条挪开，剩下的仍铺在面前。",
   "城门抵抗之后，入城实数与登记仍对不上。",
   "罗什福尔：没找到，不等于死了。先找来源。",
   "值守者：有人只留下行李，人没见着。要再出去找，还是等下一队进来对名册？"
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
    "outcome": "最后目击处有了新的线索。罗什福尔把去向不明的人另列出来，交给下一组接着找。"
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
    "outcome": "入城的人数重新对上了，仍未找到的名字留在集合点，等新的消息。"
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
   "桌上两份清单都磨破了边：一份写货物，一份写人名。罗什福尔把它们分开放，叫来愿意继续追查的人。",
   "剩余失货与失联人员是两份不同的责任。",
   "罗什福尔：我不可能每一条路都亲自走，但不能没人接。",
   "接应者：你把最后见到的地方交给我。回来以后，我到哪里找你？"
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
    "outcome": "追货的人带走货单，寻人者接过最后目击记录。罗什福尔留好两个会合时间，等他们回来。"
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
    "outcome": "寻人者先出发了，追货的事也有人接手。罗什福尔把各人的路线记在同一张图上。"
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
   "水口重新有了细细的水声，村民却仍把水桶留在旧取水处。守林者蹲下摸了摸根边的湿土，指给莱姆斯看一道新缝。",
   "泉水恢复，根系和供水仍需照看。",
   "莱姆斯：不是修完这一次，就再也没人问。",
   "村民：这次有人修。下次夜里再渗水，我们该去叫谁？"
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
    "outcome": "村民和守林者认清了同一处入口。根边若再有裂口，两边都知道该把消息送到哪里。",
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
      "result": "今天的水位记号补在旧痕旁，报信点前的杂物也清开了。"
     },
     {
      "prompt": "报信点前的路清开了，带村民和守林者一起走一次巡查路。",
      "options": [
       {
        "id": "handover-current",
        "label": "带双方完成一次共同巡查与实际报信。",
        "correct": true
       }
      ],
      "result": "村民和守林者一起走完巡查路，报信点很快收到了两边的回应。"
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
    "outcome": "村民照看水口，守林者巡查根边，两边在同一处留下报信记号。",
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
      "result": "今天的水位记号补在旧痕旁，报信点前的杂物也清开了。"
     },
     {
      "prompt": "两段巡查路在根边交汇，让两边认清彼此的交接位置。",
      "options": [
       {
        "id": "handover-current",
        "label": "分别走完两段交界，再让两方在共同报信点互认。",
        "correct": true
       }
      ],
      "result": "两边各自走到分段交界，在报信点认清了下一次该找的人。"
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
   "两份凭据放在一起，日期隔了数日，货物一栏却写得相同。经手人的签字只剩半边，谁也不肯先替缺失的部分作答。",
   "凭据有疑点，不代表莱姆斯已经知道动机。",
   "莱姆斯：先问这笔记录是谁写的，知道多少写多少。",
   "莱姆斯：我不是要你猜一个人。你记得哪一步，就从哪一步说。"
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
      "result": "两份凭据的日期并排写在回报里，差异没有被抹平。"
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
    "outcome": "日期的差异写进了追索回报。莱姆斯收好副本，等经手者说明其中的缘故。",
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
      "result": "出库疑点和现有答复一一对上，仍没得到回答的几项圈了出来。"
     },
     {
      "prompt": "未答的问题已经圈出，把原出处写清，再递一份追索回报。",
      "options": [
       {
        "id": "handover-current",
        "label": "补写一份注明原出处与未答项的正式追索回报。",
        "correct": true
       }
      ],
      "result": "新的追索回报写好了，原出处和未答的问题分列在旁。"
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
    "outcome": "经手者的原答逐句留了下来。哪一句亲眼见过，哪一句只是听说，都能重新核对。",
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
      "result": "出库疑点和现有答复一一对上，仍没得到回答的几项圈了出来。"
     },
     {
      "prompt": "旧答复还在，给经手者看一遍；这次新说的话要另留位置。",
      "options": [
       {
        "id": "handover-current",
        "label": "邀请愿意核对的经手者确认本人原答，把新补充另行标注。",
        "correct": true
       }
      ],
      "result": "经手者确认了自己的原答，新添的话另记一栏，没有盖掉旧记录。"
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
   "药包按去向分好，最远那一份还压着空白签收。伊瑟把系绳拉紧，指向村子后半程的路。",
   "伊瑟：留下的药已经分好了，缺的是后半程送达。",
   "莱姆斯：写谁负责，就让人找得到谁。",
   "伊瑟：药能送到门口还不够。有人不会再出来问，你得确认他真的收到了。"
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
      "result": "收药人点清了原先送来的份额，在交接单上留下姓名。"
     }
    ],
    "outcome": "送药的人留下姓名和下次到访的时间。莱姆斯答应再来一趟，看看药有没有送到。",
    "lateActions": [
     {
      "prompt": "药已经送了出去，几处签收却还空着。莱姆斯要去问清，是漏了记录，还是有人还在等。",
      "options": [
       {
        "id": "inspect-current",
        "label": "前往村中接收点，核对已送药份与缺失的签收。",
        "correct": true
       }
      ],
      "result": "村里的收药记录查过一遍，缺少签收的几份单独挑了出来。"
     },
     {
      "prompt": "签收空缺已经找出，请实际送药的人补上那一趟的经过。",
      "options": [
       {
        "id": "handover-current",
        "label": "请实际送达者补足本人经历，并向接收者交出可联系名单。",
        "correct": true
       }
      ],
      "result": "送药的人补上亲历经过，收药处也留下了能找到他们的名单。"
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
      "result": "伊瑟把分好的药包逐份点给莱姆斯，系紧了最后一根绳。"
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
      "result": "收药人点清药包后签了字，莱姆斯收好回执。"
     }
    ],
    "outcome": "莱姆斯走完了后半程，带回收药人的签名。下次有人问起，这趟路终于不只是一句承诺。",
    "lateActions": [
     {
      "prompt": "药已经送了出去，几处签收却还空着。莱姆斯要去问清，是漏了记录，还是有人还在等。",
      "options": [
       {
        "id": "inspect-current",
        "label": "前往村中接收点，核对已送药份与缺失的签收。",
        "correct": true
       }
      ],
      "result": "村里的收药记录查过一遍，缺少签收的几份单独挑了出来。"
     },
     {
      "prompt": "签收核对好了，莱姆斯还要沿后半程亲自走一趟，带回照护处。",
      "options": [
       {
        "id": "handover-current",
        "label": "亲自走完今天的安全后半程，将已核对签收送回照护处。",
        "correct": true
       }
      ],
      "result": "莱姆斯走完安全的后半程，把核对好的签收带回照护处。"
     }
    ]
   }
  ],
  "combat": true,
  "lateIntro": "药已经送了出去，几处签收却还空着。莱姆斯要去问清，是漏了记录，还是有人还在等。"
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
   "几个人坐在安全点的背风处，没有招呼他坐下。莱姆斯停在桌边，把带来的记录放低，等他们先开口。",
   "安全点的幸存者问他，反抗时到底发生了什么。",
   "莱姆斯：我可以说亲见的事，但不能要求你们因此原谅我。",
   "一位幸存者：你说你有理由。可我们失去的那些，你知道多少？"
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
    "outcome": "有人约他下次再来，有人仍不愿说话。莱姆斯收好记下的损失，没有催他们回答。",
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
      "result": "亲历记录摊在安全处的桌上，愿意交谈的人各自说清哪些话可以留下。"
     },
     {
      "prompt": "有人愿意开口了。先听他仍没得到回应的损失，不急着解释。",
      "options": [
       {
        "id": "handover-current",
        "label": "先听今天仍未被回应的损失，逐项记下本人要求保留的原话。",
        "correct": true
       }
      ],
      "result": "没得到回应的损失逐条记了下来，讲述者看过原话，才点头让它留下。"
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
    "outcome": "几个人留下了书面问题。莱姆斯答应逐条回信，没把沉默当成谅解。",
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
      "result": "亲历记录摊在安全处的桌上，愿意交谈的人各自说清哪些话可以留下。"
     },
     {
      "prompt": "桌上的记录混着亲见与猜测，分清之后，再请提问者核对。",
      "options": [
       {
        "id": "handover-current",
        "label": "整理亲见与推断分栏的文本，再把未答问题交还提问者核对。",
        "correct": true
       }
      ],
      "result": "亲见与推断分开写清，提问者收回了仍待回答的那一页。"
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
   "拓记上有一行被裂痕截断，旁边摆着后来找到的另一份抄本。能相互印证的字不多，围观的人已经开始接着猜下半句。",
   "旧记录已有独立印证，也仍有缺字。",
   "莱姆斯：不能因为找到了几行，就把空白都替别人填完。",
   "莱姆斯：这一段先别补。把看见的留下，也让后来的人知道哪里是我们猜的。"
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
      "result": "抄本记下了古人的目的，也留下今天的族人各自提出的问题。"
     }
    ],
    "outcome": "抄本摆出来了，缺字处仍留着空格。读到这里的人，也能看见他们尚不知道的部分。"
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
      "result": "不同读法和各人的意见都留在抄本旁，等其他人来核对。"
     }
    ],
    "outcome": "几份不同的读法并排留着，旁边写明了各自的出处。莱姆斯把仍读不懂的字圈了起来。"
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
   "照护用的桶和工具靠在墙边，今天的活已经做完，明天的名单却还是空的。有人顺口叫了一声尊称，莱姆斯先伸手去收水桶。",
   "泉边有人问，明天的照护由谁接着做。",
   "莱姆斯：先说这一天要做什么，不先给我一个头衔。",
   "照护者：名字怎么叫可以以后谈。明天早上，你还来不来？"
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
      "result": "莱姆斯认下了照护的时段和要做的事，旁人也知道该何时来找他。"
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
    "outcome": "莱姆斯把自己的照护时段写进值班表。第二天，他会按这个时辰再来。"
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
      "result": "空着的时段圈了出来，莱姆斯记下还要去找谁商量。"
     }
    ],
    "outcome": "轮值的人各自认下时段，空岗也清楚列着。莱姆斯答应回来复查，而不是把表一挂就走。"
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
   "修护处的门开着，族人望了望门外，又把手从搀扶者的臂弯里抽回来。那条短路上仍横着一块不好迈过的石头。",
   "修护后的族人想自己决定去处。",
   "砾恩：我带你回来，不是替你把以后都答应下来。",
   "族人：我想试试自己走。有人陪也好，但别替我选终点。"
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
      "result": "同伴记住了约好的终点，答应到了那里先问他的意思。"
     }
    ],
    "outcome": "同伴陪他走到约好的地方便停下。再往哪儿去，由他自己慢慢想。",
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
      "result": "族人指出最难走的一段，路上的障碍清掉后，那里已经能落脚。"
     },
     {
      "prompt": "路障清掉了，问问他愿意请哪位伙伴陪走这一段。",
      "options": [
       {
        "id": "handover-current",
        "label": "由本人邀请愿意同行的伙伴，实际试走其同意的一小段。",
        "correct": true
       }
      ],
      "result": "族人叫来愿意陪走的伙伴，两人走到他选定的地方，停下来歇脚。"
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
    "outcome": "短路上的障碍清开了，休息处也挪到了合适的位置。他试着独自走了一遍，决定何时再出门。",
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
      "result": "族人指出最难走的一段，路上的障碍清掉后，那里已经能落脚。"
     },
     {
      "prompt": "短路已经能走，请他自己试试，看看休息处放得是否合适。",
      "options": [
       {
        "id": "handover-current",
        "label": "请本人独立试走修好的短段，按他的反馈再调整休息点。",
        "correct": true
       }
      ],
      "result": "他独自试走了修好的短段，又指了一个更顺脚的位置作休息处。"
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
   "旧箱上的封记拓在纸上，放在修护记录旁边。送来口信的人说起“归还”二字，砾恩下意识按住了胸前的核心。",
   "修护者只问身体稳定不稳定，追索口信却还称它为箱里的遗物。",
   "砾恩：封记可以核对，我的感受也要记。",
   "修护者：先说你今天有什么不一样。纸上怎么写，不能替你回答疼不疼。"
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
      "result": "砾恩在回信中写明：核心已经与他的身体相连，不能照着货单取走。"
     }
    ],
    "outcome": "修护者记下了砾恩的感受，把追索口信放到另一边。核心仍留在他身上，归属的争执没有因此消失。",
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
      "result": "旧观察表翻了出来，修护者在旁边记下砾恩今天的感受。"
     },
     {
      "prompt": "修护记录已经写下，还要请砾恩确认哪些身体变化可以告诉别人。",
      "options": [
       {
        "id": "handover-current",
        "label": "由本人确认可公开的身体变化，将归属争议另列。",
        "correct": true
       }
      ],
      "result": "砾恩确认了愿意公开的身体变化，归属争议另放在一页。"
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
      "result": "封记的出处查清了。修护者收好拓记，转身继续听砾恩说明自己的感受。"
     }
    ],
    "outcome": "封记与光纹都留了记录，无法解释的地方暂时空着。来历究竟如何，还要找别的线索。",
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
      "result": "旧观察表翻了出来，修护者在旁边记下砾恩今天的感受。"
     },
     {
      "prompt": "旧封记和今天的光纹都在眼前，把能核对的部分分开记清。",
      "options": [
       {
        "id": "handover-current",
        "label": "核对封记来源与今日可见变化，原因不明之处继续留空。",
        "correct": true
       }
      ],
      "result": "封记的出处与今天的光纹并排记下，尚无法解释的地方仍留着空。"
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
   "报信牌一块块挂回去，族长常站的位置却空着。几名族人迟迟不肯领新牌，还在等原来的搭档回来。",
   "撤到安全点的人带着残缺的岗位记录。族长已经不在。",
   "砾恩：先别把谁推上那个位置。看看谁还没接到人。",
   "砾恩：先把最后在哪儿见过、谁还没接到回信说清。别让一个空名字把人催上岗。"
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
      "result": "撤路两端都传回应声，新搭档认清了彼此的报信位置。"
     }
    ],
    "outcome": "失去搭档的人有了同行者。砾恩陪他们对完最后一次交班，再去看下一处缺岗。",
    "lateActions": [
     {
      "prompt": "族长留下的岗位仍有空缺，报信点也还在等几位同伴的消息。",
      "options": [
       {
        "id": "inspect-current",
        "label": "到现存报信点整理岗位缺口和仍未确认的同伴名单。",
        "correct": true
       }
      ],
      "result": "报信点的名册重新理过，空岗和仍未联系上的同伴分别列明。"
     },
     {
      "prompt": "失联名单理好了，先陪那些失去搭档的人核实最后一次交班。",
      "options": [
       {
        "id": "handover-current",
        "label": "陪失去搭档的人核查最后交接，再为愿意接岗者安排伙伴。",
        "correct": true
       }
      ],
      "result": "最后一次交班的经过核对清楚了，愿意接岗的人找到了新的同行伙伴。"
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
    "outcome": "报信点重新有人回应，眼前的撤路通了。砾恩确认接应者到齐，才放下手里的名册。",
    "lateActions": [
     {
      "prompt": "族长留下的岗位仍有空缺，报信点也还在等几位同伴的消息。",
      "options": [
       {
        "id": "inspect-current",
        "label": "到现存报信点整理岗位缺口和仍未确认的同伴名单。",
        "correct": true
       }
      ],
      "result": "报信点的名册重新理过，空岗和仍未联系上的同伴分别列明。"
     },
     {
      "prompt": "报信点仍有几处没有回应，检查标记，再等下一班亲自到场。",
      "options": [
       {
        "id": "handover-current",
        "label": "修复失效报信标记，实际确认下一班自愿接应者到达。",
        "correct": true
       }
      ],
      "result": "失效的报信标记换好了，下一班接应者到达时，远处传回应声。"
     }
    ]
   }
  ],
  "combat": true,
  "lateIntro": "族长留下的岗位仍有空缺，报信点也还在等几位同伴的消息。"
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
   "拓记卷好又展开，桌边的人都在问下一份该送去哪儿。有人想先给修护处，有人说，那些因此被安排去处的族人应该先看。",
   "起源记录已经有独立印证，但谁先知道，不等于谁能替所有人决定。",
   "砾恩：先送谁，得说清为什么。留下的那份，也别收进只有几个人能开的箱子。"
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
    "outcome": "最受影响的族人先读到了记录。他们的问题和意见一同留下，等下一次大家再谈。"
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
    "outcome": "修护处收下拓记，把出处和疑点放在一起。想来核对的人，都能找到这份副本。"
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
   "守岗者把旧记录折回原处，行囊已经收好，却迟迟没有背上。替班的人站在旁边，等他自己开口。",
   "有人说，被创造来抵抗，就必须一直守最危险的地方。",
   "砾恩：那是过去的目的，不是你今天不能走的理由。",
   "守岗者：若我今天走了，他们会不会说，我连自己为什么被造出来都忘了？"
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
      "result": "离岗的人收好行囊，拿到了已经核实的撤离路线。"
     }
    ],
    "outcome": "愿意接岗的人报了名字，要离开的人也领到了路线。旧记录留在桌上，没有代谁作答。"
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
    "outcome": "退路查清了。有人留下换岗，有人收拾行李，沿刚确认的路走出去。"
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
   "砾恩在古代记录旁铺开一张新纸。有人说这一天没什么值得记，有人却想留下死去搭档的名字，还有一句一直没能问出口的话。",
   "古代记录旁还有空白，那里可以写今天的人。",
   "砾恩：不要只留一句我们应该是什么。也写我们怎么想。",
   "砾恩：就从这些开始。说错了可以改，意见不同也可以一起放着。"
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
    "outcome": "砾恩收好这次的口述，约好下一处巡访。记录里有争论，也有每个人想怎样生活的打算。"
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
    "outcome": "第一份副本送了出去，存放处留出补写的位置。砾恩接下保管的活，等更多人把自己的话带来。"
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
   "粮袋在地上铺开，袋底的补丁比上一次更多。咔洛伸手想把整袋提起，奇克先按住袋口，让他把背带放松。",
   "奇克：不能再只算我一个人能不能钻过去。",
   "咔洛想帮忙，米芮拿出分粮记号，豆布把碗护在怀里。",
   "米芮：你每次只说等你回来。要是比说好的晚，我们到底该等在哪儿？"
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
    "outcome": "咔洛挑了背得稳的小袋，米芮点好粮份，豆布守着碗。他们在安全处等奇克回来。",
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
      "result": "咔洛、米芮和豆布各自点过手边的东西，缺少的日用品摆到了一起。"
     },
     {
      "prompt": "日用品点清了，再试一遍轻袋，把三个人和奇克的粮份一起算进去。",
      "options": [
       {
        "id": "handover-current",
        "label": "在安全处重新试轻袋，把每个人的粮份都算进来。",
        "correct": true
       }
      ],
      "result": "轻袋试过了，每个人的粮份也算进总数。咔洛把自己那只袋口系紧。"
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
    "outcome": "奇克把返程和等候的办法说给三人听。咔洛复述了一遍，豆布记住了不能越过的路口。",
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
      "result": "咔洛、米芮和豆布各自点过手边的东西，缺少的日用品摆到了一起。"
     },
     {
      "prompt": "东西收拾好了，带三人走到报到点，试一遍晚归时怎么联络。",
      "options": [
       {
        "id": "handover-current",
        "label": "与三人实际走到能看见的报到点，演练晚归时如何联系。",
        "correct": true
       }
      ],
      "result": "三人走到看得见的报到点，各试了一次晚归联络的办法，才一起折返。"
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
   "安全点的铺位挤得很近，三人的行李却都还抱在怀里。豆布不肯把碗放下，米芮说自己什么也不缺，咔洛一直看着营地出口。",
   "咔洛、米芮和豆布都到了安全点。奇克还是把名字逐个叫了一遍，听见回答才松开袋口。",
   "奇克：现在说谁还缺什么，不用只说没事。",
   "奇克：都先别抢着帮忙。今天先把咱们怎么吃饭、在哪儿等人弄清楚。"
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
    "outcome": "咔洛、米芮和豆布都说出了还缺什么。奇克一项项记下，先去找今晚要用的碗和粮。"
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
    "outcome": "营地里的短路走过一遍，哪里能去、哪里要等，都说清了。咔洛终于有了一件能放心帮忙的事。"
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
   "熟悉的岔道堵住了，过去能换粮的摊位也空着。有人来找奇克接一段补给，摊开的路线图旁放着有限的口粮。",
   "偷粮与换粮的路都被入侵截断。奇克需要找愿意合作的人。",
   "奇克：我也要活。我的那份和该做的事，都先说清。",
   "奇克：我可以跑这段。但送到哪里算完、晚了找谁，都得现在说好。"
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
      "result": "补给数量与交付地点写清了，奇克把自己的粮份也核了一遍。"
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
      "result": "家人留在安全处整理轻装，危险路段由奇克去跑。"
     }
    ],
    "outcome": "奇克接下补给交接，先把家人和自己的粮份说清。这条路能让他们活下去，他愿意出力守住。"
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
      "result": "家人认清了安全的路口，也知道越过哪处就必须回来。"
     }
    ],
    "outcome": "联络的时限和回程都约好了。奇克记住该找谁，也把家里等他的三个人算进安排里。"
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
   "袋里剩下的粮倒进浅盆，分不出满满的四碗。奇克习惯性地伸手拨向旁边，米芮先把他的碗拿了过来。",
   "奇克放下袋子，没有立刻替每个人分好。",
   "米芮：今天也把你算进去。",
   "豆布把碗放在大家中间，咔洛等着试自己的那份。",
   "奇克：行，今天你们也看着分。哪份要留，谁明早先走，咱们一起说。"
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
      "prompt": "咔洛还想多背一点，哪些活适合交给他？",
      "options": [
       {
        "id": "verify",
        "label": "咔洛试轻活、米芮核账、豆布保管自己的物件",
        "correct": true
       }
      ],
      "result": "咔洛接下轻袋，重物仍由奇克来搬，谁也不用逞强。"
     }
    ],
    "outcome": "明天的份额由一家人一起定。奇克刚想把自己的那份拨出去，米芮便把碗推了回来。"
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
    "outcome": "晚归的饭有了留处，报到也有了约定。余粮还是不多，但这回每个人都说上了话。"
   }
  ],
  "combat": false
 }
];
