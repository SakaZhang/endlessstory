// Expanded dwarf catalog. Original fifteen active mechanics remain in the legacy
// consumer; only these six additions use this adapter, through the same host.
import {SKILL_TREE_DEFINITION as LEGACY} from './skill-tree-definition.js';
import {SKILL_TREE_DESCRIPTIONS as OLD_DESCRIPTIONS} from './skill-tree-descriptions.js';
const freeze=x=>{if(x&&typeof x==='object'){Object.values(x).forEach(freeze);Object.freeze(x);}return x;};
export const DWARF_NEW_ACTIVE_IDS=['ore_rally','crag_verdict','bellows_ward','stone_anchor','shield_relay','prospectors_mark'];
export const DWARF_NEW_PASSIVE_IDS=['ember_temper','anvil_balance','patient_craft'];
const added={ore_rally:['矿脉战意','active'],crag_verdict:['断崖裁决','active'],bellows_ward:['风箱护焰','active'],stone_anchor:['山岩定势','active'],shield_relay:['接盾回锋','active'],prospectors_mark:['探矿刻痕','active'],ember_temper:['余火淬体','passive'],anvil_balance:['砧台平衡','passive'],patient_craft:['匠心耐性','passive']};
const source=Object.fromEntries(LEGACY.nodes.map(n=>[n.id,n]));for(const [id,[name,kind]]of Object.entries(added))source[id]={id,name,kind};
// Eight nodes: root -> two forks -> optional passive leaves / deeper actives -> convergence.
const rows=[
 ['steel','破阵战技',['fracture_strike','fault_sweep','breaking_intercept','axe_fervor','hammer_penetration','breach_followup','ore_rally','crag_verdict']],
 ['fire','熔火战技',['ember_brand','furnace_etch','scatter_ash','fire_affinity','ember_temper','furnace_wave','cinder_barrage','bellows_ward']],
 ['guard','守御战技',['iron_vigil','repelling_wave','purifying_bulwark','shield_reserve','anvil_balance','bastion_blow','stone_anchor','shield_relay']]
];
const nodes=[],groups=[];
for(const [branch,name,ids]of rows){groups.push({id:branch,name,ids});const costs=[2,3,3,3,3,4,4,5],parents=[[],[0],[0],[1],[2],[1],[2],[5,6]],positions=[[1,0],[0,1],[2,1],[0,2],[2,2],[0,3],[2,3],[1,4]];ids.forEach((id,i)=>nodes.push({...source[id],cost:costs[i],requires:parents[i].map(j=>ids[j]),branch,column:positions[i][0],row:positions[i][1],setLink:branch==='steel'?'anvil':branch==='fire'?'rune':'guard'}));}
const common=['mountain_vitality','anvil_cry','forge_breath','forged_resilience','patient_craft','prospectors_mark'];groups.push({id:'shared',name:'共通匠艺',ids:common});
common.forEach((id,i)=>nodes.push({...source[id],cost:[2,3,3,3,4,3][i],requires:[[],[],[],['forge_breath'],['anvil_cry'],['anvil_cry','forge_breath']][i],branch:'shared',column:[1,0,2,2,0,1][i],row:[0,1,1,2,2,3][i],setLink:null}));
export const DWARF_EXPANDED_DEFINITION=freeze({id:'dwarf-skill-tree-99-expanded-v2',status:'active-development-v4',race:'dwarf',groups,nodes});
export const DWARF_EXPANDED_DESCRIPTIONS=freeze({...OLD_DESCRIPTIONS,
 ore_rally:{base:'短暂提高穿甲，不造成直接伤害；效果存在时不重复施放。',axe:'斧：同时提高命中后的吸血能力。',hammer:'锤：同时提高防御。'},
 crag_verdict:{base:'单体物理重击；流血或破甲目标受到额外伤害。',axe:'斧：流血目标追加较轻一击。',hammer:'锤：命中后降低目标攻击。'},
 bellows_ward:{base:'获得短暂护盾和持续恢复，不直接攻击。',axe:'斧：同时提高暴击能力。',hammer:'锤：护盾更厚。'},
 stone_anchor:{base:'短暂提高防御；效果存在时不重复施放。',axe:'斧：同时提高闪避能力。',hammer:'锤：同时获得少量护盾。'},
 shield_relay:{base:'单体物理攻击，自身有护盾时更强；不消耗护盾。',axe:'斧：命中后降低目标命中。',hammer:'锤：命中后补充一个独立短盾。'},
 prospectors_mark:{base:'标记单体弱点，降低攻击与护甲，不造成直接伤害。',axe:'斧：削弱持续更久。',hammer:'锤：降攻更强。'},
 ember_temper:{base:'仅装槽生效：提高火抗与所受治疗；不增加火伤或护盾。'},
 anvil_balance:{base:'仅装槽生效：持斧提高防御；持锤提高最大生命；其他武器提高少量防御。不会凭空恢复生命。'},
 patient_craft:{base:'仅装槽生效：生命不高于一半时，提高防御与物理穿甲；生命恢复后立即失效。'}
});
export function dwarfExpansionConfigs(st){const A=st.atk,H=st.hp,D=st.armor;return {
 ore_rally:{cooldownMs:12100,durationMs:5500,penetrationUp:.20*A,lifestealUp:10,defenseUp:.18*D},
 crag_verdict:{cooldownMs:9900,coefficient:1.25,conditionBonus:.55,extraCoefficient:.40,attackDown:.16*A,durationMs:4400},
 bellows_ward:{cooldownMs:14300,shield:.12*H,hammerMultiplier:1.4,healingPower:.015*H,critUp:7,durationMs:6600},
 stone_anchor:{cooldownMs:12100,defenseUp:.35*D,dodgeUp:10,shield:.07*H,durationMs:5500},
 shield_relay:{cooldownMs:8800,coefficient:.95,shieldBonus:.5,hitDown:12,shield:.06*H,durationMs:4400},
 prospectors_mark:{cooldownMs:11000,armorDown:.12*A,attackDown:.14*A,hammerMultiplier:1.4,durationMs:5500,axeDurationBonus:2200}
};}
export const DWARF_EXPANSION_PASSIVES=freeze({ember_temper:{fireResistanceRating:20,receivedHealingMultiplier:1.08},anvil_balance:{axeArmorMultiplier:1.16,hammerHpMultiplier:1.08,genericArmorMultiplier:1.08},patient_craft:{threshold:.5,armorMultiplier:1.20,physicalPenetrationPerBaseAtk:.10}});
export function planDwarfExpansion(input){
 const {skillId,castId,weaponType,selectedTargetId,targets=[],hero={},config:c}=input??{};if(!DWARF_NEW_ACTIVE_IDS.includes(skillId)||!c||!Number.isFinite(c.cooldownMs))return null;
 const branch=['axe','hammer'].includes(weaponType)?weaponType:'generic',self=['ore_rally','bellows_ward','stone_anchor'].includes(skillId),actions=[];
 if(self&&hero.activeBuffIds?.includes(skillId))return null;
 const effect=(type,amount,durationMs=c.durationMs,extra={})=>({type,amount,durationMs,sourceId:skillId,stacking:'refresh-source',...extra});
 const target=targets.find(t=>t.id===selectedTargetId&&t.alive);if(!self&&!target)return null;
 const hit=(coefficient,effects=[],i=0)=>actions.push({kind:'hit',castId,hitId:`${castId}:${target.id}:${i}`,targetId:target.id,hitIndex:i,damageType:'physical',coefficient,independentHit:true,independentCrit:true,reaperEligible:true,effects});
 if(skillId==='ore_rally')actions.push({kind:'effects',targetId:'self',effects:[effect('penetrationUp',c.penetrationUp),...(branch==='axe'?[effect('lifestealUp',c.lifestealUp)]:branch==='hammer'?[effect('defenseUp',c.defenseUp)]:[])]});
 if(skillId==='crag_verdict'){hit(c.coefficient+(target.bleeding||target.armorBroken?c.conditionBonus:0),branch==='hammer'?[effect('attackDown',c.attackDown)]:[]);if(branch==='axe'&&target.bleeding)hit(c.extraCoefficient,[],1);}
 if(skillId==='bellows_ward')actions.push({kind:'effects',targetId:'self',effects:[effect('shield',c.shield*(branch==='hammer'?c.hammerMultiplier:1)),effect('healOverTime',c.healingPower),...(branch==='axe'?[effect('critUp',c.critUp)]:[])]});
 if(skillId==='stone_anchor')actions.push({kind:'effects',targetId:'self',effects:[effect('defenseUp',c.defenseUp),...(branch==='axe'?[effect('dodgeUp',c.dodgeUp)]:branch==='hammer'?[effect('shield',c.shield)]:[])]});
 if(skillId==='shield_relay')hit(c.coefficient+(hero.shield>0?c.shieldBonus:0),branch==='axe'?[effect('hitDown',c.hitDown)]:branch==='hammer'?[effect('shield',c.shield,c.durationMs,{target:'self'})]:[]);
 if(skillId==='prospectors_mark')actions.push({kind:'effects',targetId:target.id,effects:[effect('armorDown',c.armorDown,c.durationMs+(branch==='axe'?c.axeDurationBonus:0),{aggregation:'strongest'}),effect('attackDown',c.attackDown*(branch==='hammer'?c.hammerMultiplier:1),c.durationMs+(branch==='axe'?c.axeDurationBonus:0),{aggregation:'strongest'})]});
 return {skillId,castId,scope:self?'self':'single',branch,cooldownMs:c.cooldownMs,activeCastCount:1,damageActionCount:actions.some(a=>a.kind==='hit')?1:0,actions};
}
if(nodes.length!==30||nodes.filter(n=>n.kind==='active').length!==21||nodes.reduce((s,n)=>s+n.cost,0)!==99)throw Error('Invalid expanded dwarf tree');
// Metadata is complete for shared menus/icons and the race registry.
export const DWARF_EXPANDED_SKILLS=freeze(Object.fromEntries(nodes.map(n=>[n.id,{id:n.id,name:n.name,kind:n.kind,branch:n.branch,description:DWARF_EXPANDED_DESCRIPTIONS[n.id],icon:`skill-assets/${n.id}.png`,scope:['ore_rally','bellows_ward','stone_anchor','anvil_cry','forge_breath','iron_vigil','purifying_bulwark'].includes(n.id)?'self':['fault_sweep','furnace_wave','scatter_ash','repelling_wave'].includes(n.id)?'all':'single'}])));
export const DWARF_ADDED_PASSIVE_METADATA=freeze({
 ember_temper:{id:'ember_temper',name:'余火淬体',description:DWARF_EXPANDED_DESCRIPTIONS.ember_temper.base,modifiers:{elementResistance:{fire:20},receivedHealingMultiplier:1.08}},
 anvil_balance:{id:'anvil_balance',name:'砧台平衡',description:DWARF_EXPANDED_DESCRIPTIONS.anvil_balance.base,variants:[{when:{weaponType:'axe'},modifiers:{armorMultiplier:1.16}},{when:{weaponType:'hammer'},modifiers:{maxHpMultiplier:1.08}},{when:{excludeWeaponTypes:['axe','hammer']},modifiers:{armorMultiplier:1.08}}]},
 patient_craft:{id:'patient_craft',name:'匠心耐性',description:DWARF_EXPANDED_DESCRIPTIONS.patient_craft.base,variants:[{when:{maxHpFraction:.5},modifiers:{armorMultiplier:1.20,physicalPenetrationPerBaseAtk:.10}}]}
});
