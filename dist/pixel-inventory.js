import {legendaryPresentation} from './equipment-presentation.js';
import {uiPixelIcon} from './ui-pixel-icons.js';
import {renderInventory} from './inventory-ui.js';
import {equipmentIcon} from './equipment-art.js';
import {icon} from './icons.js';
import {LEGENDARY_CODEX,SLOTS,SOCKET_TYPE,SLOTNAME,RARITY,BUILD,stats,bagCounts,BAG_LIMITS} from './engine.js';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const PIXEL_SOCKET_COLUMNS=Object.freeze({left:Object.freeze(['weapon','armor','ring1','boots']),right:Object.freeze(['helm','gloves','ring2','amulet'])});
// Empty sockets are monochrome outlines, never owned-item artwork.
const EMPTY_SLOT_OUTLINES=Object.freeze({
 weapon:'M4 2H11V4H13V8H11V10H8V14H6V10H3V8H1V4H4Z M6 4V8H9V4Z',
 helm:'M4 2H12V4H14V12H11V14H10V10H6V14H5V12H2V4H4Z M4 6V9H12V6Z',
 armor:'M4 2H6V4H10V2H12V4H14V8H12V14H4V8H2V4H4Z M6 6V12H10V6Z',
 gloves:'M6 2H8V6H10V4H12V6H14V10H12V14H4V12H2V8H4V4H6Z M6 8V12H10V8Z',
 boots:'M5 2H11V8H13V10H15V14H3V12H1V8H3V2Z M5 4V10H3V12H13V11H9V4Z',
 ring:'M5 2H11V4H13V6H15V10H13V12H11V14H5V12H3V10H1V6H3V4H5Z M5 6V10H11V6Z',
 amulet:'M3 1H5V5H7V7H9V5H11V1H13V5H11V7H10V9H12V13H10V15H6V13H4V9H6V7H5V5H3Z M7 10V12H9V10Z'
});
export function emptySlotIcon(type){return `<svg class="emptySlotWatermark" data-empty-slot-icon="${esc(type)}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="48" height="48" shape-rendering="crispEdges" aria-hidden="true"><path fill="currentColor" fill-rule="evenodd" d="${EMPTY_SLOT_OUTLINES[type]??EMPTY_SLOT_OUTLINES.armor}"/></svg>`;}
// A pure view adapter: original selectors, item actions and inventory ownership stay authoritative.
export function renderPixelInventory(s,ctx){
 if(ctx.bagTab!=='equipment'&&ctx.bagTab!==undefined)return renderInventory(s,ctx).replace('inventoryPage','inventoryPage pixelInventory');
 const slot=SLOTS.includes(ctx.bagSlot)?ctx.bagSlot:'weapon',counts=bagCounts(s),st=stats(s),owned=new Map(s.inventory.map(it=>[it.id,it])),equipped=new Set(Object.values(s.equip));
 const marker=(kind)=>kind==='lock'?uiPixelIcon('action-lock'):`<svg viewBox="0 0 9 9" width="12" height="12" shape-rendering="crispEdges" aria-hidden="true"><path fill="currentColor" d="${kind==='lock'?'M2 4V1H7V4H8V9H1V4ZM3 4H6V2H3ZM4 6V8H5V6Z':'M4 0H5V2H7V3H9V4H7V6H5V9H4V6H2V4H0V3H2V2H4Z'}" fill-rule="evenodd"/></svg>`;
 const socket=(key,side)=>{const it=owned.get(s.equip[key]);return `<button class="equipSlot ${it?'r'+it.rarity:'emptySlot'} ${it?.set?'setFrame':''}" data-equip-socket="${key}" data-socket-side="${side}" ${it?`data-item="${esc(it.id)}"`:''} title="${esc(SLOTNAME[key]+' · '+(it?.name||'空栏位'))}" aria-label="${esc(SLOTNAME[key]+' · '+(it?.name||'空栏位'))}">${it?equipmentIcon(it):emptySlotIcon(SOCKET_TYPE[key])}<small>${SLOTNAME[key]}</small>${it?.divine?`<span class="divineDot" title="神赐" aria-label="神赐">${marker('divine')}</span>`:''}</button>`;};
 const qualityLabel=it=>legendaryPresentation(it,LEGENDARY_CODEX).isLegendary?'传说':RARITY[it.rarity];
 const cells=ctx.sortedGear().filter(it=>it.slot===slot).map(it=>`<button class="itemCell r${it.rarity} ${it.set?'setFrame':''} ${ctx.selected===it.id?'selected':''}" data-item="${esc(it.id)}" aria-pressed="${ctx.selected===it.id}" aria-label="${esc(it.name+' · '+qualityLabel(it)+(it.locked?' · 锁定':'')+(equipped.has(it.id)?' · 已装备':''))}" title="${esc(it.name)} · ${qualityLabel(it)}">${equipmentIcon(it,{size:32})}${equipped.has(it.id)?'<span class="equippedDot">E</span>':''}${it.locked?`<span class="lockedDot" title="锁定" aria-label="锁定">${marker('lock')}</span>`:''}${it.divine?`<span class="divineDot" title="神赐" aria-label="神赐">${marker('divine')}</span>`:''}</button>`).join('');
 return `<div class="panelPage inventoryPage pixelInventory"><nav class="inventoryTabs" aria-label="行囊分类">${[['equipment','weapon','装备'],['items','potionHeal','道具 / 药剂'],['materials','iron','材料']].map(([key,img,label])=>`<button data-bag-tab="${key}" aria-pressed="${key==='equipment'}">${icon(img)}<span>${label}</span></button>`).join('')}</nav><div class="inventoryLayout pixelInventoryLayout"><section class="pixelEquipmentStage" aria-label="当前装备"><div class="pixelSectionTitle"><span>装备</span><button data-stats="1" title="查看角色属性">${icon('book')}<span>属性</span></button></div><div class="equipmentDoll eightSlots pixelEquipmentDoll"><div class="equipmentAlcoveCrop" aria-hidden="true"><img id="equipmentAlcoveImage" class="equipmentAlcove" src="./ui-art/equipment-alcove.png" alt="装备台环境图未能显示；装备操作仍可用" width="360" height="348" decoding="async"></div><canvas id="doll" width="160" height="150" aria-label="当前角色"></canvas>${PIXEL_SOCKET_COLUMNS.left.flatMap((key,i)=>[socket(key,'left'),socket(PIXEL_SOCKET_COLUMNS.right[i],'right')]).join('')}</div><div class="equipmentAlcoveStatus" id="equipmentAlcoveStatus" role="status"><span>装备台载入中</span><button type="button" data-retry-equipment-alcove="1" hidden>重试背景</button></div><div class="pixelSetSummary">${BUILD.map(b=>`<span class="${st.count[b.id]>=2?'setActive':''}" >${esc(b.name)} <b>${st.count[b.id]||0}/4</b></span>`).join('')}</div><details class="pixelSetEffects"><summary>套装效果</summary>${BUILD.map(b=>`<div><strong>${esc(b.name)} · ${st.count[b.id]||0}/4</strong><p>${esc(b.bonus)}</p></div>`).join('')}</details><button class="pixelWardrobeLink" data-view="loadouts">${icon('armor')}<span>装备柜 / 方案</span></button></section><section class="bagSection" aria-label="装备行囊"><div class="equipmentFamilies">${SLOTS.map(k=>`<button data-bag-slot="${k}" aria-pressed="${slot===k}" title="${SLOTNAME[k]} · ${counts.equipment[k]}/${BAG_LIMITS.equipment}" aria-label="${SLOTNAME[k]}背包">${icon(k)}<small>${SLOTNAME[k]}</small></button>`).join('')}</div><div class="bagHeader"><span>${SLOTNAME[slot]}行囊</span><b class="${counts.equipment[slot]>BAG_LIMITS.equipment?'bagOverCapacity':''}">${counts.equipment[slot]} / ${BAG_LIMITS.equipment}</b><select id="bagSort" aria-label="装备排序">${[['quality','品质'],['slot','部位'],['level','等级']].map(([k,n])=>`<option value="${k}" ${ctx.bagSort===k?'selected':''}>${n}</option>`).join('')}</select></div><div class="bagGrid">${cells||'<span class="emptyFamily">暂无装备</span>'}</div><div class="pixelBagFooter"><span>E 已装备 · ${marker('lock')} 锁定</span><button data-sellall="1">批量出售</button></div><details class="pixelBagRules"><summary>拾取过滤与容量</summary><div class="lootFilter">${[...RARITY.slice(0,4),'传说'].map((name,q)=>`<button class="filterQuality r${q}text" data-loot-filter-group="equipment" data-loot-filter-quality="${q}" aria-pressed="${s.lootFilters?.equipment?.includes(q)===true}">${name}</button>`).join('')}<small>仅过滤新战斗与离线战利品；不影响已有、购买与锻造物品。</small></div><p>每类独立50格，戒指共用一袋；方案装备入柜不占格。超容量物品保留，仅阻止新增。</p></details></section><section class="itemDetail pixelItemDetail" aria-label="选中装备详情">${ctx.itemDetail(owned.get(ctx.selected))}</section></div></div>`;
}

// View-only lifecycle. A failed environment never removes or disables real slots.
export function bindEquipmentAlcove(host){
 const img=host?.querySelector?.('#equipmentAlcoveImage'),status=host?.querySelector?.('#equipmentAlcoveStatus'),retry=status?.querySelector?.('[data-retry-equipment-alcove]'),label=status?.querySelector?.('span');
 if(!img||!status||!retry||!label)return ()=>{};
 let disposed=false;
 const set=mode=>{if(disposed)return;status.hidden=mode==='ready';retry.hidden=mode!=='failed';label.textContent=mode==='failed'?'背景未载入，装备可用':'装备台载入中';};
 const loaded=()=>set('ready'),failed=()=>set('failed'),reload=()=>{set('loading');img.src=img.getAttribute('src')||'./ui-art/equipment-alcove.png';};
 img.addEventListener('load',loaded);img.addEventListener('error',failed);retry.addEventListener('click',reload);
 if(img.complete)set(img.naturalWidth>0?'ready':'failed');else set('loading');
 return ()=>{disposed=true;img.removeEventListener('load',loaded);img.removeEventListener('error',failed);retry.removeEventListener('click',reload);};
}
