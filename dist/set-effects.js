// Descriptions mirror the active racial modifySkillPlan hooks (called by planTreeSkill).
// Damage bonuses modify skill coefficients; additive attack coefficients are not multipliers.
export const RACIAL_SET_EFFECTS = {
 human_blood_oath: ['人族技能施加的流血伤害提高20%。', '断脉对流血目标额外增加55%攻击的直伤；人族技能施加的流血持续时间延长2秒。'],
 human_royal_edge: ['人族技能提供的暴击等级额外增加6。', '决胜锋对破甲目标额外增加60%攻击的直伤；破绽步的各项增益持续时间延长2.2秒。'],
 human_last_bastion: ['人族技能产生的护盾量提高20%。', '返刃额外增加50%攻击的直伤；人族技能的直接治疗与持续治疗量提高15%。'],
 elf_arrow: ['弓箭连击分支技能的直接伤害提高10%（不要求持弓，不强化增益效果）。', '弓箭连击分支技能对每个目标的第2击及后续各击直接伤害额外提高18%，与2件效果乘算叠加（合计提高29.8%）；不强化普通攻击。'],
 elf_prism: ['全元素攻击分支技能的直接伤害提高10%。', '已记录上次元素时，全元素攻击分支中伤害元素与上次元素不同的各段直接伤害额外提高15%，与2件效果乘算叠加；首次元素施法不触发。'],
 elf_root: ['法杖物理＋元素分支技能的物理段与元素段直接伤害提高10%（不要求持杖）。', '法杖物理＋元素分支技能的元素段直接伤害额外提高20%，与2件效果乘算叠加；该分支技能产生的护盾量提高20%，不强化共修分支护盾。'],
 goblin_spore: ['涂菌刺、苦鳃破口、苦菌封势施加的削甲与减攻持续时间延长2秒。', '涂菌刺命中时额外施加1层毒；仍最多5层，每层每3秒造成目标最大生命2%的毒伤。'],
 goblin_ambush: ['伏径首击、收尾割、夺隙与过路刃的直接伤害提高8%。', '伏径首击对生命高于75%的目标、收尾割对生命低于30%的目标，直接伤害额外提高25%（与2件效果乘算叠加）；穿隙步效果延长2秒。'],
 goblin_snare: ['机关造成的命中等级削弱与攻击削弱数值提高15%。', '伏索的可触发次数增加1次，但每次反击伤害降低15%；反击不会再次触发机关。'],
 'ashen.caldera': ['技能每次积蓄热量时额外获得5热量（仍受热量上限限制）。', '泄压冲与熔核过载的伤害提高15%；退火壳的护盾量提高20%。'],
 'ashen.strata': ['凝岩披甲额外获得1岩片（仍受岩片上限限制）。', '裂壳横击与岩壳裂变的伤害提高15%；碎壳重构的治疗量提高20%。'],
 'ashen.prism': ['叩晶、折光脉与沉影脉的伤害提高8%。', '同频护幕的护盾量与晶脉接续的治疗量提高20%；三相回响的伤害提高15%。']
};
export function withSetEffects(def) {
 const descriptions=RACIAL_SET_EFFECTS[def.id]??def.bonus.split(/4件：/).map((text,i)=>i?text:text.replace(/^2件：/,''));
 const effects=descriptions.map((description,i)=>({pieces:i?4:2,description}));
 return {...def,effects,bonus:effects.map(row=>`${row.pieces}件：${row.description}`).join('')};
}
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// Match combat's unique equipped-item counting; inventory/collection ownership alone does not activate sets.
export function equippedSetCount(state,id) {
 const ids=new Set(Object.values(state.equip??{}).filter(Boolean));
 return [...ids].filter(itemId=>state.inventory?.find(item=>item.id===itemId)?.set===id).length;
}
export function renderSetEffects(state,definition) {
 if(!definition)return '';
 const count=equippedSetCount(state,definition.id);
 return `<div class="setEffectRows"><p class="subtleText">当前已穿戴 ${count} / 4 件</p>${definition.effects.map(({pieces,description})=>`<p class="setEffectRow" data-set-pieces="${pieces}" data-set-active="${count>=pieces}"><strong>${pieces}件 · ${count>=pieces?'已激活':'未激活'}</strong>：${esc(description)}</p>`).join('')}</div>`;
}
