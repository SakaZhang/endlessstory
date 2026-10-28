// Compatibility registry for old saves; current-tree menus use skillConditionChoices.
// Legacy fireResistDown is a hidden alias of the unified resistance condition.
// Conditions observe state, never apply effects.
export const SKILL_CONDITION_CHOICES=Object.freeze([
 ['always','可用即施放'],['low','生命低于60%'],['charge','敌人将重击'],['burn','目标已灼烧'],
 ['bleed','目标已流血'],['poison','目标已中毒'],['poison5','目标已有5层毒'],['armorDown','目标已破甲'],
 ['attackDown','目标攻击削弱'],['hitDown','目标命中削弱'],['elementResistDown','目标元素抗性削弱'],
 ['scorch','目标已炉蚀'],['stun','目标被眩晕'],['targetShield','目标有护盾'],
 ['selfBurn','自身已灼烧'],['selfBleed','自身已流血'],['selfDot','自身受到持续伤害'],['selfWeakness','自身攻击削弱'],['selfDebuff','自身有可净化负面状态'],['selfSlow','自身下次普攻减速'],
 ['selfShield','自身有护盾'],['selfNoShield','自身无护盾'],
 ...[['attackUp','攻击增强'],['critUp','暴击增强'],['penetrationUp','穿甲增强'],['defenseUp','防御增强'],['dodgeUp','闪避增强'],['lifestealUp','吸血增强'],['healOverTime','持续恢复']].map(([id,label])=>['self_'+id,'自身'+label])
].map(Object.freeze));
export const SKILL_CONDITION_LABELS=Object.freeze({...Object.fromEntries(SKILL_CONDITION_CHOICES),fireResistDown:'目标元素抗性削弱'});
export const canonicalSkillCondition=id=>id==='fireResistDown'?'elementResistDown':id;
export const validSkillCondition=id=>typeof id==='string'&&Object.hasOwn(SKILL_CONDITION_LABELS,id);
// Contextual choices are explicit mechanic mappings, not inferred from names or branches.
// Old IDs remain valid and saved unchanged; an inapplicable saved rule is temporarily
// treated as always, with the same explanation in the editor and loadout summary.
const contextualRules={
 low:{all:['iron_vigil','forge_breath','purifying_bulwark','bellows_ward','stone_anchor','human.red_recovery','human.oath_guard','human.hold_line','human.rally','human.field_dressing','human.cleanse','elf.resonant_guard','elf.dew_mending','elf.leaf_ward','elf.clear_moon','goblin.toxic_feint','goblin.seam_step','goblin.ration_rush','goblin.braced_lure','goblin.patch_ration','goblin.dust_escape','goblin.shed_binding','ashen.anneal','ashen.mantle','ashen.rebuild','ashen.chorus','ashen.mend','ashen.salve','ashen.purify']},
 charge:{all:['breaking_intercept','human.intercept','goblin.stolen_moment','goblin.jam_joint','ashen.interrupt']},
 bleed:{all:['crag_verdict','human.open_wound','human.sever'],axe:['breach_followup']},
 armorDown:{all:['crag_verdict','human.decisive'],hammer:['breach_followup']},
 burn:{hammer:['furnace_wave','cinder_barrage']},
 poison:{all:['goblin.bitter_wound','goblin.spore_transfer']},
 poison5:{all:['goblin.mire_seal']},
 selfDebuff:{all:['purifying_bulwark','human.rally','human.cleanse','elf.clear_moon','goblin.shed_binding','ashen.purify']},
 selfShield:{all:['shield_relay','human.return_cut'],hammer:['bastion_blow'],sword_shield:['human.shield_bash']},
 selfNoShield:{all:['iron_vigil','purifying_bulwark','bellows_ward','human.oath_guard','human.rally','elf.resonant_guard','elf.leaf_ward','elf.clear_moon','goblin.braced_lure','goblin.shed_binding','ashen.anneal','ashen.mantle','ashen.chorus','ashen.purify'],hammer:['stone_anchor','shield_relay'],sword_shield:['human.red_recovery','human.return_cut','human.sever'],sword:['goblin.patch_ration']}
};
const damageElements=Object.freeze({
 ember_brand:['fire'],furnace_wave:['fire'],cinder_barrage:['fire'],
 'elf.sixfold_shift':['rotating'],'elf.ember_bloom':['fire'],'elf.moon_tide':['water'],'elf.wind_prism':['wind','light'],'elf.root_eclipse':['earth','dark'],'elf.sixfold_chorus':['earth','water','fire','wind','light','dark'],
 'elf.root_strike':['earth'],'elf.moon_sweep':['water'],'elf.prism_impact':['light'],'elf.dusk_reversal':['dark'],'elf.heartwood_release':['rotating'],
 'ashen.vent':['fire'],'ashen.surge':['fire'],'ashen.quarry':['earth'],'ashen.dawn':['light'],'ashen.dusk':['dark'],'ashen.resound':['light','dark']
});
// Anvil two-piece boosts every direct physical skill hit against bleed/break.
const physicalSkills=new Set([
 ...'fracture_strike fault_sweep breach_followup breaking_intercept bastion_blow repelling_wave crag_verdict shield_relay'.split(' '),
 ...'cut red_sweep open_wound sever precise_cut cross_cut decisive flash_arc shield_bash repulse return_cut intercept'.split(' ').map(id=>'human.'+id),
 ...'twin_arrow thread_volley hunter_mark pursuit moon_finisher root_strike moon_sweep prism_impact dusk_reversal heartwood_release'.split(' ').map(id=>'elf.'+id),
 ...'venom_cut spore_fan bitter_wound spore_transfer mire_seal opening_cut finish_cut stolen_moment crossing_blade tangle_cut jam_joint'.split(' ').map(id=>'goblin.'+id),
 ...'kindle overload cleave fault fracture tap interrupt'.split(' ').map(id=>'ashen.'+id)
]);
export function skillConditionChoices(skillId,weaponType='generic',setCounts={}){
 const ids=new Set(['always']);
 if((setCounts.anvil??0)>=2&&physicalSkills.has(skillId)){ids.add('bleed');ids.add('armorDown');}
 for(const [condition,rules] of Object.entries(contextualRules))if(rules.all?.includes(skillId)||rules[weaponType]?.includes(skillId))ids.add(condition);
 if(Object.hasOwn(damageElements,skillId??''))ids.add('elementResistDown');
 return SKILL_CONDITION_CHOICES.filter(([id])=>ids.has(id));
}
export function effectiveSkillCondition(id,skillId,weaponType='generic',setCounts={}){
 const canonical=canonicalSkillCondition(id);
 return skillConditionChoices(skillId,weaponType,setCounts).some(([key])=>key===canonical)?canonical:'always';
}
export function skillConditionNotice(id,skillId,weaponType='generic',setCounts={}){
 return effectiveSkillCondition(id,skillId,weaponType,setCounts)===canonicalSkillCondition(id)?'':`旧条件“${SKILL_CONDITION_LABELS[id]??id}”不适用于当前技能/武器，暂按可用即施放；选择新条件后替换。`;
}
export function skillConditionSetCounts(s){const ids=new Set(Object.values(s?.equip??{}));const counts={};for(const it of s?.inventory??[])if(ids.has(it.id)&&it.set)counts[it.set]=(counts[it.set]??0)+1;return counts;}
export const skillConditionWeapon=s=>s?.inventory?.find(it=>it.id===s.equip?.weapon)?.weaponType??'generic';
function conditionDamageElements(skillId,e){
 return (damageElements[skillId]??[]).map(el=>el==='rotating'?['earth','water','fire','wind','light','dark'][e.raceRuntime?.state?.elementIndex??0]:el);
}

export function skillConditionMatches(id,{encounter:e,target:t,maxHp,now=0,charging,legacy=false,skillId,weaponType='generic',eligibleDebuffIds,setCounts={}}={}){
 if(!validSkillCondition(id)||!e||!t||t.hp<=0)return false;
 if(!legacy&&skillId!==undefined)id=effectiveSkillCondition(id,skillId,weaponType,setCounts);
 const clock=e.treeEffects?.clock??e.treeCombatClock??0;
 const sources=who=>(who==='self'?e.treeEffects?.hero:e.treeEffects?.enemies?.[who])?.sources??[];
 const has=(who,type)=>sources(who).some(x=>x.endAt>clock&&(x.type===type||x.status===type)&&(!x.requiresStatus||sources(who).some(y=>y.status===x.requiresStatus&&y.endAt>clock)));
 const dots=(e.typedDots??[]).filter(d=>d.endAt>now);
 const shield=e.playerShieldLayers?e.playerShieldLayers.layers.some(l=>l.remaining>0&&(l.expiresAt===null||l.expiresAt>e.playerShieldLayers.clock)):(e.shield??0)+(e.barrierShield??0)+(e.legendaryShield??0)>0;
 const selfBurn=e.heroBurn>0||has('self','burn');
 const selfBleed=has('self','bleed');
 switch(id=canonicalSkillCondition(id)){
 case 'always':return true;
 case 'low':return e.heroHp<maxHp*.6;
 case 'charge':return charging===undefined?!!t.control?.preparing:!!charging;
 case 'burn':return t.burn>0||!legacy&&has(t.id,'burn');
 case 'bleed':return has(t.id,'bleed');
 case 'poison':return (e.treePoison?.[t.id]?.layers??[]).some(l=>l.expiresAt>clock);
 case 'poison5':return (e.treePoison?.[t.id]?.layers??[]).filter(l=>l.expiresAt>clock).length>=5;
 case 'armorDown':return t.broken>0||sources(t.id).some(x=>x.type==='armorDown'&&x.amount>0&&x.endAt>clock&&(!x.requiresStatus||has(t.id,x.requiresStatus)));
 case 'attackDown':return t.blunt>0||has(t.id,id);
 case 'scorch':return t.scorch>0;
 case 'elementResistDown':return sources(t.id).some(x=>['fireResistDown','elementResistDown'].includes(x.type)&&x.amount>0&&x.endAt>clock&&(!skillId||conditionDamageElements(skillId,e).includes(x.type==='fireResistDown'?'fire':x.damageType))&&(!x.requiresStatus||has(t.id,x.requiresStatus)));
 case 'hitDown':return has(t.id,id);
 case 'stun':return t.stun>0||(t.control?.stunUntil??0)>now;
 case 'targetShield':return t.shield>0&&(!t.typedProfile||!t.shieldUntil||t.shieldUntil>now);
 case 'selfBurn':return selfBurn;
 case 'selfBleed':return selfBleed;
 case 'selfDot':return selfBurn||selfBleed||dots.length>0||has('self','dot');
 case 'selfWeakness':return e.weakness>0||has('self','attackDown');
 case 'selfDebuff':return eligibleDebuffIds!==undefined?eligibleDebuffIds.length>0:selfBurn||e.weakness>0||dots.length>0||['armorDown','elementResistDown','fireResistDown','attackDown','hitDown','dot'].some(type=>has('self',type));
 case 'selfSlow':return (e.nextBasicSlow??1)>1;
 case 'selfShield':return shield;
 case 'selfNoShield':return !shield;
 default:return id.startsWith('self_')&&(has('self',id.slice(5))||id==='self_attackUp'&&e.warcry>0||id==='self_defenseUp'&&(e.guard>0||e.ironcoat>0));
 }
}
