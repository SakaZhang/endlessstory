import assert from 'node:assert/strict';
import {BUILD,SET_CODEX} from './dist/engine.js';
import {SETS} from './dist/skill-tree-tuning.js';
import {resolveSetLinkedHit,resolveSetLinkedEffect} from './dist/skill-tree-consumer.js';

const pct=n=>Math.round(n*100);
const expected={
 anvil:`2件：对流血或破甲目标的物理技能直伤提高${pct(SETS.anvilTwoBonus)}%。4件：破隙追击持斧时，对流血目标的第二击伤害提高${pct(SETS.anvilAxeExtraBonus)}%；持锤时，对破甲目标的条件追加伤害提高${pct(SETS.anvilHammerConditionBonus)}%；其他武器对流血或破甲目标的基础伤害提高${pct(SETS.anvilGenericBonus)}%。`,
 rune:`2件：灼烧持续伤害提高${pct(SETS.runeBurnBonus)}%。4件：炉焰迸发持斧时，灼烧施加概率增加${pct(SETS.runeBurnChanceBonus)}个百分点（最高100%）；持锤时，对灼烧目标的条件追加伤害提高${pct(SETS.runeConsumeBonus)}%；其他武器基础伤害提高${pct(SETS.runeGenericBonus)}%。`,
 guard:`2件：技能产生的护盾量提高${pct(SETS.guardSkillShieldBonus)}%。4件：守势重击持斧时，防御提升效果提高${pct(SETS.guardAxeDefenseBonus)}%；持锤且自身有护盾时，条件追加伤害提高${pct(SETS.guardShieldedBonus)}%；其他武器基础伤害提高${pct(SETS.guardGenericBonus)}%。`
};
for(const [id,description] of Object.entries(expected)){
 assert.equal(BUILD.find(x=>x.id===id).bonus,description);
 assert.equal(SET_CODEX.find(x=>x.id===id).bonus,description);
 assert(!/回合|裂甲锤|重锻击|铸壁|铁衣/.test(description));
}
// The conditional bonus is not a multiplier on the entire skill.
const hit={baseDamage:100,conditionalBonus:20,source:{kind:'skill'},direct:true,damageType:'physical',weaponType:'hammer'};
const anvil=resolveSetLinkedHit({...hit,skillId:'breach_followup',targetBroken:true},{anvil:4},SETS);
assert.equal(anvil.baseDamage,130);assert.equal(anvil.conditionalBonus,52);
const rune=resolveSetLinkedHit({...hit,skillId:'furnace_wave',targetBurning:true},{rune:4},SETS);
assert.equal(rune.baseDamage,100);assert.equal(rune.conditionalBonus,40);
const guard=resolveSetLinkedHit({...hit,skillId:'bastion_blow',heroShielded:true},{guard:4},SETS);
assert.equal(guard.baseDamage,100);assert.equal(guard.conditionalBonus,38);
assert.equal(resolveSetLinkedEffect({type:'shield',amount:100,source:{kind:'skill'}},{guard:2},SETS).amount,135);
assert.equal(resolveSetLinkedEffect({type:'shield',amount:100,source:{kind:'equipment'}},{guard:2},SETS).amount,100);
assert.equal(resolveSetLinkedEffect({type:'dot',status:'burn',amount:100,skillId:'furnace_wave',weaponType:'axe',chance:.9},{rune:4},SETS).chance,1);
console.log('PASS dwarf set descriptions: current names, tuning-derived 2/4-piece values, conditional-only bonuses, skill shield scope and capped probability.');
