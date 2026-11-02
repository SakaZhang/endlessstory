// Derive effects from the item flag; never mutate owned rolls or earned kill counts.
export function specialDivineMultiplier(item){return item?.divine?.id==='forge-favor'&&['raw-v1','raw-v2'].includes(item.divine.model)?2:1;}
export function specialEffectPower(specials,key){return specials?.[key]===2?2:specials?.[key]?1:0;}
export function nirvanaUseCount(state){return state?.nirvanaCount??(state?.nirvanaUsed?1:0);}
const descriptions={
 knowledge:'常规战斗胜利时100%额外获得一次基础战斗经验，不重复触发；异界除外。',
 momentum:'直接攻击击杀后，下一次命中的普攻或主动伤害技能伤害 +200%（整次施放含多段；多重追加独立消耗新余势）。不叠加，败退清除，持续伤害和反击不触发。',
 shelter:'开战获得60%最大生命护盾；普通副本整轮只触发一次，剩余护盾可跨阶段保留。',
 nirvana:'每场战斗两次（普通副本整轮共两次），死亡时满血复活；不重置冷却、护盾或其他计数。',
 reaper:'每个命中段对每个仍存活目标独立进行2%判定，成功时直接处决目标；首领同样有效。',
 multicast:'主动技能后30%概率追加一次，不递归、不重复计算技能冷却，资源仍按技能规则消耗；算一次真实主动施法，无存活敌人则不追加。',
 harvester:'装备时每击杀一个单位永久积累2点攻击力，每件最多800点；多件可叠加，卸下保留进度但不提供加成。',
 blesser:'装备时每击杀一个单位永久积累0.2点幸运，每件最多40点；多件可叠加，卸下保留进度但不提供加成。',
 glutton:'装备时每击杀一个单位永久积累2点吸血，每件最多400点；多件可叠加，卸下保留进度但不提供加成。'
};
export function specialEffectDescription(item,fallback=''){return specialDivineMultiplier(item)===2?descriptions[item?.special?.id]??fallback:fallback;}
