// Qualitative player descriptions from approved skill-tree-candidate specs/passiveConfirmations.
// Costs/prerequisites stay in the versioned definition; tuning coefficients are not duplicated here.
export const SKILL_TREE_DESCRIPTIONS=Object.freeze({
 fracture_strike:{base:'对单个目标造成物理伤害。',axe:'斧：连续两击，第二击更重；各段分别判定命中与暴击。',hammer:'锤：单次重击并短暂破甲。'},
 fault_sweep:{base:'横扫所有存活敌人，造成物理伤害。',axe:'斧：命中后附加短暂流血。',hammer:'锤：命中后短暂降低敌人攻击，不附带眩晕。'},
 breach_followup:{base:'对单个目标强力追击，无前置状态也可造成伤害。',axe:'斧：目标正在流血时追加一击。',hammer:'锤：目标已被破甲时伤害提高。'},
 ember_brand:{base:'单体火焰攻击并施加灼烧；重复施加刷新，不无限叠层。',axe:'斧：灼烧持续更久。',hammer:'锤：灼烧期间降低目标火焰抗性。'},
 furnace_wave:{base:'火焰冲击所有存活敌人。',axe:'斧：命中各目标时有机会附加灼烧。',hammer:'锤：对灼烧目标增伤并消耗灼烧；未灼烧仍造成基础伤害。'},
 cinder_barrage:{base:'对单个目标连续两段火焰攻击，每段独立判定。',axe:'斧：改为三段攻击。',hammer:'锤：目标灼烧时第二段增强，不消耗灼烧。'},
 iron_vigil:{base:'获得护盾；同来源刷新，不同来源独立。',axe:'斧：敌方直接命中前有盾，且本次实际损失生命、仍存活时反击；全被盾吸收不反击。',hammer:'锤：获得更厚的护盾。'},
 bastion_blow:{base:'单体物理攻击，攻击与防御共同贡献伤害；无盾也能使用。',axe:'斧：攻击后短暂提高自身防御。',hammer:'锤：自身有盾时伤害提高，不消耗护盾。'},
 repelling_wave:{base:'攻击所有存活敌人并短暂眩晕；眩晕暂停蓄力而非取消，结束后继续。首领控制更短，非完全免疫。',axe:'斧：命中后短暂提高自身闪避，一次施放只获得一次。',hammer:'锤：眩晕持续更久。'},
 anvil_cry:{base:'短暂提高自身攻击；不直接造成伤害，效果存在时不重复施放叠加。',axe:'斧：同时提高暴击能力。',hammer:'锤：同时提高穿甲能力。'},
 breaking_intercept:{base:'单体物理攻击；命中正在蓄力的敌人时打断。未蓄力只造成基础伤害。',axe:'斧：成功打断后短暂提高自身攻击。',hammer:'锤：成功打断后附加短暂眩晕；首领控制时间较短。'},
 furnace_etch:{base:'降低单体护甲与火焰抗性，不直接造成伤害。同属性减益取最强，各来源独立到期。',axe:'斧：效果持续更久。',hammer:'锤：削弱更强，但持续更短。'},
 scatter_ash:{base:'降低所有存活敌人的命中能力，无直接伤害。',axe:'斧：有机会施毒。每层每次毒伤为目标最大生命的2%，最多5层；先扣护盾，再扣生命。毒不受增伤、元素抗性影响，不触发死神或主动施法计数。',hammer:'锤：同时降低护甲，同类破甲取最强。'},
 forge_breath:{base:'立即恢复自身生命；满血不自动使用。与药剂冷却独立。',axe:'斧：短暂获得吸血效果。',hammer:'锤：额外获得持续恢复。'},
 purifying_bulwark:{base:'清除一个可净化负面状态并获得短暂护盾；没有负面状态时不自动使用。',axe:'斧：成功净化后短暂提高攻击。',hammer:'锤：额外清除一个负面状态。'},
 axe_fervor:{base:'仅持斧生效：提高伤害，但降低自身防御；换用其他武器时收益和代价都不生效。毒伤不受加成。'},
 hammer_penetration:{base:'仅持锤生效：提高物理穿甲，不修改敌人实际护甲，也不影响火抗或毒伤。'},
 fire_affinity:{base:'不限武器：提高火焰伤害和火焰抗性，包含灼烧及反应炉火伤；不提高流血或毒伤。'},
 shield_reserve:{base:'不限武器：有任意有效护盾时提高防御，多来源不叠加；最后一层盾耗尽或到期后立即失效。技能盾、庇护盾与反应炉盾均可触发。'},
 mountain_vitality:{base:'不限武器：提高最大生命与所受治疗，包含技能、持续恢复、吸血和药剂；不提高护盾，不会治疗溢出最大生命。'},
 forged_resilience:{base:'不限武器：缩短负面状态持续时间，包含眩晕与减速；不是免疫。'}
});
