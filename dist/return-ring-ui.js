import {RETURN_RING_MATERIALS} from './return-ring-content.js';
import {returnRingRecipeKnown} from './return-ring-state.js';
import {quoteReturnRingCraft} from './return-ring-crafting.js';
import {MATERIALS,materialCount} from './engine.js';
const esc=t=>String(t??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function renderReturnRingRecipe(s){
 if(!returnRingRecipeKnown(s))return '';
 const quote=quoteReturnRingCraft(s),crafted=s.returnRing.crafted;
 const notices={'balance-unconfirmed':'归途之环已确定增加3个百分点，适用掉落池尚待确认；此配方暂不能制造。','materials':'五件旧物尚未齐备。','gold':'金币不足。','pending-forge':'先领取已保存的熔炉成品。','in-battle':'结束远征后再制造。'};
 return `<section class="returnRingRecipe" aria-label="归途之环配方"><h2>归途之环</h2><p>已永久掌握 · 五件至臻旧物，各一份</p><ul>${RETURN_RING_MATERIALS.map(m=>`<li>${esc(MATERIALS[m.material]?.name??m.material)} · 持有 ${materialCount(s,m.material,3)}</li>`).join('')}</ul><p>战斗胜利后回复满生命，包含普通副本的阶段胜利。首领传说、稀有材料与无限宝石的有效掉落率增加3个百分点。</p>${crafted?'<p>本次旅程已经制造过归途之环。</p>':`<p>${esc(notices[quote.reason]??'将五件旧物接成完整的环。')}</p><button data-return-ring-craft="1" ${quote.ok?'':'disabled'}>制造 · ${quote.gold} 金币</button>`}</section>`;
}
