import {legendaryDivineMultiplier} from './legendary-divine.js';
// Keep the registered base description intact; only owned divine equipment uses these amounts.
const changes={
 'first-forge-oathhammer':[['140%','280%'],['30%','60%']],
 'everburning-reactor':[['75%','150%'],['8%','16%']],
 'human-oathblade':[['0.8倍','1.6倍'],['0.08倍','0.16倍']],
 'human-banner-armor':[['50%','100%']],
 'elf-sixfold-heartwood':[['30%','60%'],['全部直接伤害翻倍','全部直接伤害提高200%（总计3倍）'],['当次不翻倍','当次不获得蓄鸣增伤'],['翻倍攻击','蓄鸣攻击']],
 'elf-last-string':[['30%','60%'],['50%','100%']],
 'goblin-silent-ration':[['40%','80%'],['8%','16%'],['70%','140%']],
 'goblin-silent-steps':[['闪避+100','闪避+200']],
 'ashen-molten-core':[['每层20%','每层40%'],['（60%）','（120%）']],
 'ashen-stone-core':[['获得2岩片','获得4岩片'],['4%','8%']],
 'ashen-crystal-core':[['200%','400%']],
 'lucky-dice':[['125%','150%'],['3333','6666']]
};
export function legendaryEffectDescription(item,base=''){
 if(legendaryDivineMultiplier(item)!==2)return base;
 return (changes[item.legendaryId]??[]).reduce((text,[from,to])=>text.replaceAll(from,to),base);
}
export const DIVINE_EFFECT_SUMMARY='神赐使强化后的基础属性、普通数值词条与特殊词条的主要数值翻倍；普通传说专属的正向效果量翻倍，触发条件、冷却和持续时间不变。无限手套、归途之环与原初核心的专属效果保持原样；幸运骰子的概率与减伤档不变。已有神赐装备自动生效，无需再次消耗天神之石。';
