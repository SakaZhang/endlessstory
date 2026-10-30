// Casino-exclusive authored legendary. Fixed attributes and odds never use luck,
// equipment level, quality rolls or the ordinary special-affix registry.
export const LUCKY_DICE_ID='lucky-dice';
export const LUCKY_DICE_EXCLUSIVE_ID='lucky-dice-roll';
export const LUCKY_DICE_FIXED_BASE=Object.freeze({atk:33,armor:0,hp:333});
export const LUCKY_DICE_FIXED_BONUSES=Object.freeze({luck:33,crit:33});
export const LUCKY_DICE_DEFINITION=Object.freeze({id:LUCKY_DICE_ID,ready:true,name:'幸运骰子',slot:'amulet',baseVariant:'amulet_survival',originRace:null,exclusiveId:LUCKY_DICE_EXCLUSIVE_ID,ordinaryAffixCount:0,casinoOnly:true,fixedBase:LUCKY_DICE_FIXED_BASE});
export const LUCKY_DICE_CODEX=Object.freeze({id:LUCKY_DICE_ID,name:'幸运骰子',slot:'amulet',icon:'amulet',implemented:true,lore:'磨圆的象牙骰子被金链系在胸前，三枚深红圆点在灯下隐约发亮。赌桌的喧闹远去后，耳边偶尔仍会响起骰子落定的轻响。',affix:'幸运一掷',effect:'每次命中的普通攻击独立掷骰：33%造成75%伤害，33%造成125%伤害，33%造成100%伤害，1%造成固定3333伤害。技能、持续伤害、反击与追加伤害不掷骰。',acquisition:'仅赌场抽奖1%获得；不进入首领、试炼塔或随机传说奖励池。',attributes:'固定属性：幸运 +33、攻击 +33、生命 +333、暴击等级 +33；无随机普通词条。基础攻击与生命可照常强化。',tuning:'前三档照常计算暴击和减伤；3333档不受护甲、暴击与伤害倍率影响，护盾照常吸收。吸血仅按实际扣除的生命计算。'});
const emptyBonuses=Object.freeze({luck:0,crit:0});
export function isLuckyDice(item){return item?.legendaryId===LUCKY_DICE_ID&&item.slot==='amulet'&&item.exclusive?.id===LUCKY_DICE_EXCLUSIVE_ID;}
export function luckyDiceStatBonuses(item){return isLuckyDice(item)?LUCKY_DICE_FIXED_BONUSES:emptyBonuses;}
export function equippedLuckyDice(s){return (s?.inventory??[]).find(item=>item.id===s?.equip?.amulet&&isLuckyDice(item))??null;}
const outcomes=Object.freeze([
 Object.freeze({outcome:'low',multiplier:.75,fixedDamage:null}),
 Object.freeze({outcome:'high',multiplier:1.25,fixedDamage:null}),
 Object.freeze({outcome:'normal',multiplier:1,fixedDamage:null}),
 Object.freeze({outcome:'jackpot',multiplier:1,fixedDamage:3333})
]);
export function validLuckyDiceOutcome(value){return !!value&&typeof value==='object'&&!Array.isArray(value)&&Object.keys(value).length===3&&['outcome','multiplier','fixedDamage'].every(key=>Object.hasOwn(value,key))&&outcomes.some(row=>row.outcome===value.outcome&&row.multiplier===value.multiplier&&row.fixedDamage===value.fixedDamage);}
// The combat host calls this exactly once AFTER a basic attack lands. This
// selector cannot deal damage, dispatch procs, alter runtime state or recurse.
export function rollLuckyDice(random=Math.random){
 const roll=random();
 if(!Number.isFinite(roll)||roll<0||roll>=1)throw new RangeError('Lucky Dice RNG must be finite in [0,1)');
 return outcomes[roll<.33?0:roll<.66?1:roll<.99?2:3];
}
