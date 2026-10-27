import {INFINITY_GAUNTLET_MATERIALS} from './infinity-gauntlet-content.js';
import {infinityRecipeKnown} from './infinity-gauntlet-state.js';
import {quoteInfinityGauntletCraft} from './infinity-gauntlet-crafting.js';
import {MATERIALS,materialCount} from './engine.js';
const esc=t=>String(t??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function renderInfinityGauntletRecipe(s){
 if(!infinityRecipeKnown(s))return '';
 const quote=quoteInfinityGauntletCraft(s),crafted=s.infinityGauntlet.crafted;
 const notices={'materials':'五颗宝石尚未齐备。','gold':'金币不足。','pending-forge':'先领取已保存的熔炉成品。','in-battle':'结束远征后再制造。'};
 return `<section class="returnRingRecipe" aria-label="无限手套配方"><h2>无限手套</h2><p>已永久掌握 · 五族至臻宝石，各一份</p><ul>${INFINITY_GAUNTLET_MATERIALS.map(m=>`<li>${esc(MATERIALS[m.material]?.name??m.material)} · 持有 ${materialCount(s,m.material,3)}</li>`).join('')}</ul><p>每成功释放5次主动技能，对当前目标造成其最大生命50%的伤害；普通敌人与首领比例相同。普攻、被动和多段命中不额外计数，卸下清零。每档只能制造一次，出售、拆解重炼或丢弃后无法重造。</p>${crafted?'<p>本次旅程已经制造过无限手套。</p>':`<p>${esc(notices[quote.reason]??'将五颗宝石嵌入手套。')}</p><button data-infinity-gauntlet-craft="1" ${quote.ok?'':'disabled'}>制造 · ${quote.gold} 金币</button>`}</section>`;
}
