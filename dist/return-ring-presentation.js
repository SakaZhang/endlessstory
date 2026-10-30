import {equipmentIcon} from './equipment-art.js';
import {materialIcon} from './material-pixel-art.js';
import {RETURN_RING_MATERIALS} from './return-ring-content.js';
import {MATERIALS} from './engine.js';
const esc=t=>String(t??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// Presentation only: collection never equips the ring or changes its mechanics.
export function renderReturnRingEffects(){
 return '<section class="returnRingPowers" aria-label="归途专属效果"><div><b>+20%</b><strong>旅途经验</strong><p>装备时经验获取 +20%；包含实际战斗、副本与离线结算。</p></div><div><b>15%</b><strong>胜利归息</strong><p>战斗胜利恢复15%最大生命，最高恢复至生命上限；包含普通副本阶段胜利。</p></div><div><b>+3<span>个百分点</span></b><strong>稀有机缘</strong><p>首领传说、稀有材料与无限宝石的有效掉落率增加3个百分点。</p></div></section><p class="returnRingRules">仅装备后生效 · 双戒指槽不重复叠加 · 卸下后失效<br>不改变掉落来源、持有上限或材料品质。</p>';
}
export function renderReturnRingCodex(entry){
 return `<article class="collectionDetail legendaryDetail returnRingCodex" data-return-ring-codex="true"><header class="returnRingHeader"><div class="returnRingHero">${equipmentIcon({legendaryId:'return-ring',slot:'ring',rarity:3},{size:64})}</div><div class="returnRingTitle"><span class="eyebrow">五件旧物 · 一枚归途</span><h2>${esc(entry.name)}</h2><span class="collectionBadge">已收集 · 传说戒指</span></div></header><p class="returnRingStory">${esc(entry.lore)}</p><h3 class="returnRingSectionTitle">固定专属 · 归途</h3>${renderReturnRingEffects()}<section class="returnRingKeepsakes" aria-label="五族旧物"><h3 class="returnRingSectionTitle">五族旧物，合为一环</h3><div>${RETURN_RING_MATERIALS.map((m,i)=>`<div class="returnRingKeepsake"><span>0${i+1}</span>${materialIcon(m.material,{quality:3,size:48})}<strong>${esc(MATERIALS[m.material]?.name??m.material)}</strong></div>`).join('')}</div></section><footer class="returnRingCodexNotes"><p><strong>获取</strong> ${esc(entry.acquisition)}</p><p><strong>词条</strong> ${esc(entry.attributes)}</p><p>每次旅程仅能制造一次；出售、丢弃或拆解后无法重造。图鉴保留收集记录。</p></footer></article>`;
}
