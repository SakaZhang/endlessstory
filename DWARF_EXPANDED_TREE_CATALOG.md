# Dwarf expanded tree catalog

Candidate values, not publication approval. 30 nodes = 21 active / 9 passive, total 99. Level45 earns44 points. Each complete27-point branch plus common anvil/forge/mark9 points costs36: 9 unlocked active choices for4slots, 2branch passives for2slots. Adding mountain and resilience costs5; adding patient instead costs4. Three presets independent; no point grants, no ranks, no level scaling.

## 破阵战技

|Node|Kind|Cost|Required nodes (all)|Set link|Effect / weapon differences|
|---|---|---:|---|---|---|
|裂岩击 (fracture_strike)|active|2|—|anvil|对单个目标造成物理伤害。 斧：连续两击，第二击更重；各段分别判定命中与暴击。 锤：单次重击并短暂破甲。|
|断层横扫 (fault_sweep)|active|3|fracture_strike|anvil|横扫所有存活敌人，造成物理伤害。 斧：命中后附加短暂流血。 锤：命中后短暂降低敌人攻击，不附带眩晕。|
|截势 (breaking_intercept)|active|3|fracture_strike|anvil|单体物理攻击；命中正在蓄力的敌人时打断。未蓄力只造成基础伤害。 斧：成功打断后短暂提高自身攻击。 锤：成功打断后附加短暂眩晕；首领控制时间较短。|
|狂斧 (axe_fervor)|passive|3|fault_sweep|anvil|仅持斧生效：提高伤害，但降低自身防御；换用其他武器时收益和代价都不生效。毒伤不受加成。|
|重锤穿甲 (hammer_penetration)|passive|3|breaking_intercept|anvil|仅持锤生效：提高物理穿甲，不修改敌人实际护甲，也不影响火抗或毒伤。|
|破隙追击 (breach_followup)|active|4|fault_sweep|anvil|对单个目标强力追击，无前置状态也可造成伤害。 斧：目标正在流血时追加一击。 锤：目标已被破甲时伤害提高。|
|矿脉战意 (ore_rally)|active|4|breaking_intercept|anvil|短暂提高穿甲，不造成直接伤害；效果存在时不重复施放。 斧：同时提高命中后的吸血能力。 锤：同时提高防御。|
|断崖裁决 (crag_verdict)|active|5|breach_followup, ore_rally|anvil|单体物理重击；流血或破甲目标受到额外伤害。 斧：流血目标追加较轻一击。 锤：命中后降低目标攻击。|
## 熔火战技

|Node|Kind|Cost|Required nodes (all)|Set link|Effect / weapon differences|
|---|---|---:|---|---|---|
|熔火烙印 (ember_brand)|active|2|—|rune|单体火焰攻击并施加灼烧；重复施加刷新，不无限叠层。 斧：灼烧持续更久。 锤：灼烧期间降低目标火焰抗性。|
|熔蚀刻印 (furnace_etch)|active|3|ember_brand|rune|降低单体护甲与火焰抗性，不直接造成伤害。同属性减益取最强，各来源独立到期。 斧：效果持续更久。 锤：削弱更强，但持续更短。|
|撒灰 (scatter_ash)|active|3|ember_brand|rune|降低所有存活敌人的命中能力，无直接伤害。 斧：有机会施毒。每层每次毒伤为目标最大生命的2%，最多5层；先扣护盾，再扣生命。毒不受增伤、元素抗性影响，不触发死神或主动施法计数。 锤：同时降低护甲，同类破甲取最强。|
|炉火亲和 (fire_affinity)|passive|3|furnace_etch|rune|不限武器：提高火焰伤害和火焰抗性，包含灼烧及反应炉火伤；不提高流血或毒伤。|
|余火淬体 (ember_temper)|passive|3|scatter_ash|rune|仅装槽生效：提高火抗与所受治疗；不增加火伤或护盾。|
|炉焰迸发 (furnace_wave)|active|4|furnace_etch|rune|火焰冲击所有存活敌人。 斧：命中各目标时有机会附加灼烧。 锤：对灼烧目标增伤并消耗灼烧；未灼烧仍造成基础伤害。|
|余烬连击 (cinder_barrage)|active|4|scatter_ash|rune|对单个目标连续两段火焰攻击，每段独立判定。 斧：改为三段攻击。 锤：目标灼烧时第二段增强，不消耗灼烧。|
|风箱护焰 (bellows_ward)|active|5|furnace_wave, cinder_barrage|rune|获得短暂护盾和持续恢复，不直接攻击。 斧：同时提高暴击能力。 锤：护盾更厚。|
## 守御战技

|Node|Kind|Cost|Required nodes (all)|Set link|Effect / weapon differences|
|---|---|---:|---|---|---|
|铁幕守势 (iron_vigil)|active|2|—|guard|获得护盾；同来源刷新，不同来源独立。 斧：敌方直接命中前有盾，且本次实际损失生命、仍存活时反击；全被盾吸收不反击。 锤：获得更厚的护盾。|
|震退波 (repelling_wave)|active|3|iron_vigil|guard|攻击所有存活敌人并短暂眩晕；眩晕暂停蓄力而非取消，结束后继续。首领控制更短，非完全免疫。 斧：命中后短暂提高自身闪避，一次施放只获得一次。 锤：眩晕持续更久。|
|净炉壁垒 (purifying_bulwark)|active|3|iron_vigil|guard|清除一个可净化负面状态并获得短暂护盾；没有负面状态时不自动使用。不能解除剧情限制。 斧：成功净化后短暂提高攻击。 锤：额外清除一个负面状态。|
|铁壁余力 (shield_reserve)|passive|3|repelling_wave|guard|不限武器：有任意有效护盾时提高防御，多来源不叠加；最后一层盾耗尽或到期后立即失效。技能盾、庇护盾与反应炉盾均可触发。|
|砧台平衡 (anvil_balance)|passive|3|purifying_bulwark|guard|仅装槽生效：持斧提高防御；持锤提高最大生命；其他武器提高少量防御。不会凭空恢复生命。|
|守势重击 (bastion_blow)|active|4|repelling_wave|guard|单体物理攻击，攻击与防御共同贡献伤害；无盾也能使用。 斧：攻击后短暂提高自身防御。 锤：自身有盾时伤害提高，不消耗护盾。|
|山岩定势 (stone_anchor)|active|4|purifying_bulwark|guard|短暂提高防御；效果存在时不重复施放。 斧：同时提高闪避能力。 锤：同时获得少量护盾。|
|接盾回锋 (shield_relay)|active|5|bastion_blow, stone_anchor|guard|单体物理攻击，自身有护盾时更强；不消耗护盾。 斧：命中后降低目标命中。 锤：命中后补充一个独立短盾。|
## 共通匠艺

|Node|Kind|Cost|Required nodes (all)|Set link|Effect / weapon differences|
|---|---|---:|---|---|---|
|山岩体魄 (mountain_vitality)|passive|2|—|—|不限武器：提高最大生命与所受治疗，包含技能、持续恢复、吸血和药剂；不提高护盾，不会治疗溢出最大生命。|
|战炉怒吼 (anvil_cry)|active|3|—|—|短暂提高自身攻击；不直接造成伤害，效果存在时不重复施放叠加。 斧：同时提高暴击能力。 锤：同时提高穿甲能力。|
|回炉息 (forge_breath)|active|3|—|—|立即恢复自身生命；满血不自动使用。与药剂冷却独立。 斧：短暂获得吸血效果。 锤：额外获得持续恢复。|
|百锻韧性 (forged_resilience)|passive|3|forge_breath|—|不限武器：缩短负面状态持续时间，包含眩晕与减速；不是免疫。|
|匠心耐性 (patient_craft)|passive|4|anvil_cry|—|仅装槽生效：生命不高于一半时，提高防御与物理穿甲；生命恢复后立即失效。|
|探矿刻痕 (prospectors_mark)|active|3|anvil_cry, forge_breath|—|标记单体弱点，降低攻击与护甲，不造成直接伤害。 斧：削弱持续更久。 锤：降攻更强。|

## Evidence scope
Native PNGs use production skillTreeGeometry and actual32px PNGs (nearest2x icon atlas); not browser screenshots. Shared UI uses horizontal/vertical scroll and branch filtering, maintains scroll on budget refresh. DOM/actual App regression tests cover battle-editable drafts and safe-stop apply. Added active plans require integrator registry routing through existing production host; actual combat verification recorded separately. Migration helper is pure, explicit-approved only, not attached to save load.
