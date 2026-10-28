// One registry for editor choices, save validation, loadouts and the real selector.
// Existing IDs retain their meaning; conditions observe state, never apply effects.
export const SKILL_CONDITION_CHOICES=Object.freeze([
 ['always','可用即施放'],['low','生命低于60%'],['charge','敌人将重击'],['burn','目标已灼烧'],
 ['bleed','目标已流血'],['poison','目标已中毒'],['armorDown','目标已破甲'],
 ['attackDown','目标攻击削弱'],['hitDown','目标命中削弱'],['fireResistDown','目标火抗削弱'],['elementResistDown','目标元素抗性削弱'],
 ['scorch','目标已炉蚀'],['stun','目标被眩晕'],['targetShield','目标有护盾'],
 ['selfBurn','自身已灼烧'],['selfBleed','自身已流血'],['selfDot','自身受到持续伤害'],['selfWeakness','自身攻击削弱'],['selfDebuff','自身有可净化负面状态'],['selfSlow','自身下次普攻减速'],
 ['selfShield','自身有护盾'],['selfNoShield','自身无护盾'],
 ...[['attackUp','攻击增强'],['critUp','暴击增强'],['penetrationUp','穿甲增强'],['defenseUp','防御增强'],['dodgeUp','闪避增强'],['lifestealUp','吸血增强'],['healOverTime','持续恢复']].map(([id,label])=>['self_'+id,'自身'+label])
].map(Object.freeze));
export const SKILL_CONDITION_LABELS=Object.freeze(Object.fromEntries(SKILL_CONDITION_CHOICES));
export const validSkillCondition=id=>typeof id==='string'&&Object.hasOwn(SKILL_CONDITION_LABELS,id);
export function skillConditionMatches(id,{encounter:e,target:t,maxHp,now=0,charging,legacy=false}={}){
 if(!validSkillCondition(id)||!e||!t||t.hp<=0)return false;
 const clock=e.treeEffects?.clock??e.treeCombatClock??0;
 const sources=who=>(who==='self'?e.treeEffects?.hero:e.treeEffects?.enemies?.[who])?.sources??[];
 const has=(who,type)=>sources(who).some(x=>x.endAt>clock&&(x.type===type||x.status===type)&&(!x.requiresStatus||sources(who).some(y=>y.status===x.requiresStatus&&y.endAt>clock)));
 const dots=(e.typedDots??[]).filter(d=>d.endAt>now);
 const shield=e.playerShieldLayers?e.playerShieldLayers.layers.some(l=>l.remaining>0&&(l.expiresAt===null||l.expiresAt>e.playerShieldLayers.clock)):(e.shield??0)+(e.barrierShield??0)+(e.legendaryShield??0)>0;
 const selfBurn=e.heroBurn>0||has('self','burn');
 const selfBleed=has('self','bleed');
 switch(id){
 case 'always':return true;
 case 'low':return e.heroHp<maxHp*.6;
 case 'charge':return charging===undefined?!!t.control?.preparing:!!charging;
 case 'burn':return t.burn>0||!legacy&&has(t.id,'burn');
 case 'bleed':return has(t.id,'bleed');
 case 'poison':return (e.treePoison?.[t.id]?.layers??[]).some(l=>l.expiresAt>clock);
 case 'armorDown':return t.broken>0||has(t.id,id);
 case 'attackDown':return t.blunt>0||has(t.id,id);
 case 'scorch':return t.scorch>0;
 case 'fireResistDown':return has(t.id,id);
 case 'hitDown':case 'elementResistDown':return has(t.id,id);
 case 'stun':return t.stun>0||(t.control?.stunUntil??0)>now;
 case 'targetShield':return t.shield>0&&(!t.typedProfile||!t.shieldUntil||t.shieldUntil>now);
 case 'selfBurn':return selfBurn;
 case 'selfBleed':return selfBleed;
 case 'selfDot':return selfBurn||selfBleed||dots.length>0||has('self','dot');
 case 'selfWeakness':return e.weakness>0||has('self','attackDown');
 case 'selfDebuff':return selfBurn||e.weakness>0||dots.length>0||['armorDown','elementResistDown','fireResistDown','attackDown','hitDown','dot'].some(type=>has('self',type));
 case 'selfSlow':return (e.nextBasicSlow??1)>1;
 case 'selfShield':return shield;
 case 'selfNoShield':return !shield;
 default:return id.startsWith('self_')&&(has('self',id.slice(5))||id==='self_attackUp'&&e.warcry>0||id==='self_defenseUp'&&(e.guard>0||e.ironcoat>0));
 }
}
