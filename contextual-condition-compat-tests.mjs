import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
import {SKILL_CONDITION_CHOICES,validSkillCondition,skillConditionChoices,effectiveSkillCondition,skillConditionNotice,skillConditionMatches} from './dist/skill-conditions.js';
import {renderSkillTree} from './dist/skill-tree-ui.js';
import {getSkillTreeDefinition} from './dist/race-registry.js';
const ids=['always','low','charge','burn','bleed','poison','armorDown','attackDown','hitDown','fireResistDown','elementResistDown','scorch','stun','targetShield','selfBurn','selfBleed','selfDot','selfWeakness','selfDebuff','selfSlow','selfShield','selfNoShield',...['attackUp','critUp','penetrationUp','defenseUp','dodgeUp','lifestealUp','healOverTime'].map(x=>'self_'+x)];
for(const race of ['dwarf','human','elf','goblin','ashen'])for(const id of ids){
 assert(validSkillCondition(id));const s=E.fresh(race);s.skillTree.presets[0].conditions[0]=id;s.conditions[0]=id;
 assert(E.validSave(s),race+':'+id);assert(E.saveLoadout(s,0,'兼容'));const copy=JSON.parse(JSON.stringify(s));assert(E.validSave(copy));assert(E.applyLoadout(copy,0));assert.equal(copy.conditions[0],id);assert.equal(copy.skillTree.presets[0].conditions[0],id);
 const before=JSON.stringify(copy),html=renderSkillTree({draft:copy,index:0,definition:getSkillTreeDefinition(copy)});assert.equal(JSON.stringify(copy),before,'render never rewrites save');
 if(id!=='always')assert(html.includes('暂按可用即施放'),'unsupported empty slot explained');
}
const choices=(id,w='generic',sets={})=>skillConditionChoices(id,w,sets).map(x=>x[0]);
for(const [id,w,yes,no] of [['breach_followup','axe','bleed','armorDown'],['breach_followup','hammer','armorDown','bleed'],['bastion_blow','hammer','selfShield','burn'],['human.shield_bash','sword_shield','selfShield','bleed']]){assert(choices(id,w).includes(yes));assert(!choices(id,w).includes(no));}
for(const id of ['crag_verdict'])for(const w of ['generic','axe','hammer'])for(const condition of ['bleed','armorDown'])assert(choices(id,w).includes(condition));
for(const id of ['shield_relay','human.return_cut'])for(const w of ['generic','axe','hammer','sword_shield','greatsword'])assert(choices(id,w).includes('selfShield'));
for(const id of ['fracture_strike','fault_sweep','ember_brand','scatter_ash','human.cut','human.blood_mark','elf.hunter_mark','goblin.venom_cut','goblin.spore_fan','ashen.fault'])for(const condition of ['bleed','burn','poison','armorDown'])assert(!choices(id,'axe').includes(condition),id+': producer not gated');
for(const id of ['forge_breath','human.field_dressing','elf.dew_mending','goblin.patch_ration','ashen.mend']){assert(choices(id).includes('low'));assert(!choices(id).includes('self_healOverTime'));}
for(const id of ['purifying_bulwark','human.cleanse','elf.clear_moon','goblin.shed_binding','ashen.purify']){assert(choices(id).includes('selfDebuff'));assert(!choices(id).includes('selfSlow'));}
assert.equal(effectiveSkillCondition('self_attackUp','anvil_cry'),'always');assert(skillConditionNotice('self_attackUp','anvil_cry').includes('暂按可用即施放'));
assert.equal(effectiveSkillCondition('fireResistDown','ember_brand'),'elementResistDown');assert.equal(skillConditionNotice('fireResistDown','ember_brand'),'');
const e={heroHp:100,treeEffects:{clock:1000,hero:{sources:[]},enemies:{a:{sources:[]},b:{sources:[]}}},enemies:[{id:'a',hp:100,control:{}},{id:'b',hp:100,control:{}}],raceRuntime:{state:{elementIndex:0}}};
const check=(condition,skillId,target=e.enemies[0],extra={})=>skillConditionMatches(condition,{encounter:e,target,maxHp:100,now:1000,skillId,...extra});
e.treeEffects.enemies.b.sources=[{type:'elementResistDown',damageType:'earth',amount:10,endAt:2000}];assert(!check('elementResistDown','elf.sixfold_shift'));assert(check('elementResistDown','elf.sixfold_shift',e.enemies[1]));e.raceRuntime.state.elementIndex=1;assert(!check('elementResistDown','elf.sixfold_shift',e.enemies[1]));
e.treeEffects.enemies.a.sources=[{type:'fireResistDown',amount:10,endAt:2000,requiresStatus:'burn'}];e.treeEffects.enemies.b.sources.push({type:'dot',status:'burn',endAt:2000});assert(!check('elementResistDown','ember_brand'));e.treeEffects.enemies.a.sources.push({type:'dot',status:'burn',endAt:1500});assert(check('elementResistDown','ember_brand'));e.treeEffects.clock=1500;assert(!check('elementResistDown','ember_brand'));
e.treePoison={a:{layers:Array.from({length:5},()=>({expiresAt:1600}))}};assert(check('poison5','goblin.mire_seal'));e.treePoison.a.layers[0].expiresAt=1500;assert(!check('poison5','goblin.mire_seal'));assert(!check('poison5','goblin.mire_seal',e.enemies[1]));
assert(!check('selfDebuff','human.cleanse',e.enemies[0],{eligibleDebuffIds:[]}));assert(check('selfDebuff','human.cleanse',e.enemies[0],{eligibleDebuffIds:['host-approved']}));
console.log('PASS independent contextual compatibility: all 29 historical IDs × five races, save/load/render nonmutation, branch consumers, no producer self-gates, target/element/expiry/cleanse parity');
// Equipped set unlocks real physical-hit synergy, never elemental-only or utility rules.
for(const condition of ['bleed','armorDown']){
 assert(!choices('fracture_strike','hammer',{anvil:1}).includes(condition));
 assert(choices('fracture_strike','hammer',{anvil:2}).includes(condition));
 assert(!choices('ember_brand','hammer',{anvil:4}).includes(condition));
 assert(!choices('forge_breath','hammer',{anvil:4}).includes(condition));
}
// Non-current saved preset is edited against its saved weapon, not current gear.
{
 const s=E.fresh('dwarf'),D=getSkillTreeDefinition(s);s.level=100;s.inventory.push({id:'audit-axe',weaponType:'axe'},{id:'audit-hammer',weaponType:'hammer'});s.equip.weapon='audit-axe';s.loadouts[1]={equip:{...s.equip,weapon:'audit-hammer'}};
 for(const p of s.skillTree.presets){p.unlocked=D.nodes.map(n=>n.id);p.active=['breach_followup',null,null,null];p.conditions=['armorDown','always','always','always'];}
 const select=index=>renderSkillTree({draft:s,index,definition:D}).match(/data-tree-condition="0"[^>]*>(.*?)<\/select>/s)[1];
 assert(select(0).includes('value="bleed"'));assert(!select(0).includes('value="armorDown"'));
 assert(select(1).includes('value="armorDown" selected'));assert(!select(1).includes('value="bleed"'));
}
console.log('PASS independent physical-only set gating and noncurrent saved-weapon preset isolation');
e.treeEffects.enemies.a.sources=[{type:'armorDown',amount:0,endAt:2000}];assert(!check('armorDown','crag_verdict'),'zero reduction cannot satisfy actual break bonus');e.treeEffects.enemies.a.sources[0].amount=1;assert(check('armorDown','crag_verdict'));e.treeEffects.clock=2000;assert(!check('armorDown','crag_verdict'));console.log('PASS zero/positive/expired armor reduction matches actual damage bonus eligibility');
