import {formatAttribute as num,formatAttributePercent as pct} from './attribute-format.js';
import {renderSetEffects} from './set-effects.js';
import {returnRingExperienceBonus} from './return-ring-state.js';
import {baseStats,stats,treePassiveContext,AFFIX_DEFS,SPECIALS,LEGENDARY_CODEX,SET_CODEX,POTIONS,combatStatuses} from './engine.js';
import {getRaceTuning,getSkillMetadata,heroName} from './race-registry.js';
import {skillTreeHeroStats} from './skill-tree-attributes.js';
import {derivePassiveStats} from './skill-tree-passives.js';
import {playerShieldTotal} from './player-shield-layers.js';
import {potionDescription} from './potion-ui.js';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const elements={earth:'地',water:'水',fire:'火',wind:'风',light:'光',dark:'暗'};
// Reads the production derivation chain only; no simulation, clocks, random draws or writes.
export function characterStatsSnapshot(s,encounter=s.activeEncounter){
 const e=encounter&&!encounter.done?encounter:null,reference={...s,potionBuffs:{},activeEncounter:null};
 reference.heroHp=baseStats(reference).hp;
 const permanent=stats(reference),context=treePassiveContext(s);
 let current=stats(s);
 if(e&&s.skillTree?.mode==='active'){
  const base=baseStats(s),enhanced=e.treeEffects?skillTreeHeroStats(base,e.treeEffects,getRaceTuning(s.race)?.attributeConfig):base;
  const clock=e.playerShieldLayers?.clock??0;
  const layers=e.playerShieldLayers??{version:1,clock,layers:[['shelter',e.shield??0],['barrier',e.barrierShield??0],['legacy-reactor',e.legendaryShield??0]].filter(([,remaining])=>remaining>0).map(([source,remaining])=>({source,capacity:remaining,remaining,expiresAt:null}))};
  if(enhanced)current=context?(derivePassiveStats(enhanced,context,{shieldLayers:layers,combatClock:clock,currentHp:e.heroHp})?.stats??current):enhanced;
 }
 return {permanent,current,e,hp:e?.heroHp??s.heroHp??current.hp,shield:e?.playerShieldLayers?playerShieldTotal(e.playerShieldLayers,e.playerShieldLayers.clock):e?(e.shield??0)+(e.barrierShield??0)+(e.legendaryShield??0):0};
}
export const CHARACTER_STAT_GROUPS=[
 ['生存与攻防',[['hp','最大生命'],['atk','攻击'],['armor','护甲'],['penetration','物理穿甲']]],
 ['命中、暴击与闪避',[['hitRating','命中'],['hit','命中判定率','percent'],['critRating','暴击'],['crit','暴击率','percent'],['critDamageRating','暴伤'],['critDamage','暴击伤害倍率','multiplier'],['dodgeRating','闪避'],['dodge','闪避率','percent'],['block','格挡率','percent']]],
 ['回复与防护',[['lifestealRating','吸血'],['lifestealRate','实际吸血率','percent'],['shieldBonus','护盾加成'],['healingBonus','主动直疗加成','pointsPercent'],['resolveReduction','韧性减时','percent']]],
 ['元素与幸运',[['element','通用元素技能增幅'],['luck','有效幸运']]]
];
export function renderCharacterStats(s,encounter){
 const {permanent:base,current:st,e,hp,shield}=characterStatsSnapshot(s,encounter);
 const row=(name,a,b,format=num)=>`<div class="attributeRow"><span>${esc(name)}</span><span>${format(a)}</span><b class="${Math.abs(a-b)>1e-8?'attributeChanged':''}">${format(b)}</b></div>`;
 const experienceBonus=returnRingExperienceBonus(s);
 const rows=CHARACTER_STAT_GROUPS.map(([title,fields])=>`<section><h3>${title}</h3>${fields.map(([key,name,type])=>row(name,base[key],st[key],type==='percent'?pct:type==='multiplier'?pct:type==='pointsPercent'?v=>num(v)+'%':num)).join('')}</section>`).join('');
 const potionRows=Object.entries(s.potionBuffs??{}).filter(([,b])=>b.endAt>(s.lastHealthClock??0)).map(([key,b])=>`<li><b>${esc(POTIONS[key]?.name??key)}</b> · 剩余${Math.ceil((b.endAt-(s.lastHealthClock??0))/1000)}秒<br>${esc(potionDescription(key,b.quality))}</li>`);
 const context=treePassiveContext(s),passives=(context?.selected??[]).map(id=>{const m=getSkillMetadata(id);return `<li><b>${esc(m?.name??id)}</b> · ${esc(typeof m?.description==='string'?m.description:m?.description?.base??'按技能说明生效。')}</li>`;});
 const gear=[...new Set(Object.values(s.equip??{}).filter(Boolean))].map(id=>s.inventory.find(it=>it.id===id)).filter(Boolean);
 const effects=gear.flatMap(it=>{const special=SPECIALS[it.special?.id],legend=LEGENDARY_CODEX.find(x=>x.id===it.legendaryId);return [special?`<li><b>${esc(special.name)}</b> · ${esc(special.desc)}</li>`:'',legend?`<li><b>${esc(legend.name)}</b> · ${esc(legend.effect)}</li>`:''].filter(Boolean);});
 const sets=Object.entries(st.count??{}).map(([id,count])=>{const def=SET_CODEX.find(x=>x.id===id);return `<li><b>${esc(def?.name??id)}</b> · 已穿戴${count}件${renderSetEffects(s,def)}</li>`;});
 const effectNames={attackUp:'攻击增强',defenseUp:'护甲增强',critUp:'暴击增强',penetrationUp:'穿甲增强',dodgeUp:'闪避增强',lifestealUp:'吸血增强',healOverTime:'持续回复'};
 const temporary=(e?.treeEffects?.hero?.sources??[]).filter(x=>x.endAt>e.treeEffects.clock).map(x=>`<li>${esc(effectNames[x.type]??getSkillMetadata(x.sourceId)?.name??'战技效果')} · ${num(x.amount)} · 剩余${Math.ceil((x.endAt-e.treeEffects.clock)/1000)}秒</li>`);
 const statuses=e?combatStatuses(e).filter(x=>x.side==='hero').map(x=>`<li>${esc(x.name)} · ${Number.isFinite(x.remainingSeconds)?Math.ceil(x.remainingSeconds)+'秒':num(x.turns)+'回合'}</li>`):[];
 return `<article class="fullCharacterStats"><div class="eyebrow">冒险者档案</div><h2>${esc(heroName(s))} · 全部属性</h2><p class="attributeVitals">当前生命 <b>${num(hp)} / ${num(st.hp)}</b>　护盾 <b>${num(shield)}</b></p><p class="subtleText">常驻参考：当前装备、天赋与被动，按满血、无护盾、无药剂计算。当前：计入药剂与此刻的战斗增益。低血量、持盾等效果依条件变化。</p><div class="attributeRow attributeColumns"><span>属性</span><span>常驻参考</span><b>当前</b></div>${rows}<section><h3>经验获取</h3>${row('经验获取加成',experienceBonus,experienceBonus,pct)}<p class="subtleText">归途之环装备时经验获取 +20%，卸下后失效；双戒指槽不重复叠加。</p></section><section><h3>六系元素</h3>${Object.entries(elements).map(([key,name])=>row(name+'技能增幅',base.elementAttack[key],st.elementAttack[key])+row(name+'抗性',base.elementResistance[key],st.elementResistance[key])).join('')}</section><p class="subtleText">属性显示四舍五入为整数，非零且小于1%的比例显示“不足1%”，内部计算保留精度。暴击伤害倍率以百分比表示（150% 即一点五倍）。命中、暴击、闪避、暴伤与吸血的原始数值和换算结果分列展示。判定率仅用于会进行该判定的攻击，不代表每个技能的最终结果。护甲与穿甲影响物理伤害；格挡触发时减轻伤害。</p><p class="subtleText">元素增幅与抗性是数值，不是固定百分比；实际伤害取决于双方差值、技能和目标。元素增幅不为物理攻击附魔。吸血按实际生命伤害回复，不含护盾和溢出伤害。幸运影响掉落品质，不代表固定掉落率。</p><section><h3>药剂与战斗状态</h3><ul>${potionRows.join('')+temporary.join('')+statuses.join('')||'<li>当前没有药剂或战斗状态。</li>'}</ul></section><section><h3>被动与条件效果</h3><ul>${passives.join('')+effects.join('')+sets.join('')||'<li>尚未装备条件效果。</li>'}</ul></section><section><h3>装备与通用天赋词条合计</h3><p class="subtleText">以下为词条原始数值，已计入上方对应属性，不要重复相加。</p>${Object.entries(st.bonus??{}).map(([key,value])=>`<div class="attributeRaw"><span>${esc(AFFIX_DEFS[key]?.name??key)}</span><b>${num(value)}</b></div>`).join('')}</section></article>`;
}
