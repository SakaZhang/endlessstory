// New-tree temporary attributes. Base is the production equipment/talent/potion stats snapshot.
// These are rating additions, never direct +8 probabilities or recursive buff snapshots.
import {skillEffectValue,validSkillEffectState} from './skill-tree-effects.js';
import {lifestealRate} from './affix-expansion.js';
const rating=r=>Math.max(0,r)/(100+Math.max(0,r));
export function skillTreeHeroStats(base,effects,{dodgeCap}={}){
 if(!base||!validSkillEffectState(effects)||!['atk','armor','hp','penetration','hitRating','critRating','critDamageRating'].every(k=>Number.isFinite(base[k])&&base[k]>=0)||!Number.isFinite(dodgeCap)||dodgeCap<0||dodgeCap>1)return null;
 const value=type=>skillEffectValue(effects,'self',type),out={...base,bonus:{...base.bonus},elementAttack:{...base.elementAttack},elementResistance:{...base.elementResistance}};
 out.atk+=value('attackUp');out.armor+=value('defenseUp');out.penetration+=value('penetrationUp');
 out.critRating+=value('critUp');out.crit=Math.min(.6,.05+.55*rating(out.critRating));
 out.lifesteal=out.lifestealRating=(base.lifestealRating??base.lifesteal??0)+value('lifestealUp');out.lifestealRate=lifestealRate(out.lifesteal);
 out.dodgeRating=value('dodgeUp');out.dodge=dodgeCap*rating(out.dodgeRating);
 return out;
}
export function skillTreeEnemyAttributes(unit,effects,{hasStatus}={}){
 if(!unit||!validSkillEffectState(effects)||typeof unit.id!=='string'||!['atk','armor'].every(k=>Number.isFinite(unit[k])&&unit[k]>=0)||!unit.elementResistance)return null;
 const value=type=>skillEffectValue(effects,unit.id,type,{hasStatus});if(value('armorDown')===null)return null;
 return {atk:Math.max(0,unit.atk-value('attackDown')),armor:Math.max(0,unit.armor-value('armorDown')),hitDownRating:value('hitDown'),elementResistance:{...unit.elementResistance,fire:Math.max(0,unit.elementResistance.fire-value('fireResistDown'))}};
}
