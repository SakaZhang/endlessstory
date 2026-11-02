import {divineStoneBalance} from './divine-stone-state.js';
import {noncombatRunning} from './noncombat-policy.js';
import {hasCanonicalEpilogue} from './otherworld-entitlement.js';
import {otherworldStatus,OTHERWORLD_LOOT_POLICY as LOOT,RARITY} from './engine.js';
import {formatAttribute as n,formatAttributePercent} from './attribute-format.js';
export function renderOtherworldPortal(s){return hasCanonicalEpilogue(s)?'<button class="otherworldPortal" data-otherworld="open" aria-label="异界通道 · 尾声已完成"><span class="otherworldPortalRing" aria-hidden="true">◇</span><strong>异界通道</strong><small>尾声之后 · 逐层深入</small></button>':'';}
export function renderOtherworldStone(s){if(!hasCanonicalEpilogue(s)||!s.otherworld?.stoneGranted)return '';const used=s.otherworld.stoneUsed,busy=noncombatRunning(s)||!!(s.activeEncounter&&!s.activeEncounter.rewarded)||!!s.story?.activeScene;return `<section class="panel otherworldStone" aria-label="异界之石"><span class="otherworldStoneIcon" aria-hidden="true">◆</span><div><h3>异界之石${used?' · 已使用':' ×1'}</h3><p>${used?'100级上限已解除。100级后每级7920经验，升级继续获得天赋点。':'尾声完成奖励。使用后永久解除100级上限；不补发经验，不自动升级。'}</p><small>专属保护道具 · 不可出售、丢弃或熔炼${!used&&busy?' · 请先结束战斗并停止挂机':''}</small></div>${used?'<b class="otherworldUsed">突破已生效</b>':`<button class="primary" data-otherworld="use-stone" ${busy?'disabled':''}>使用异界之石</button>`}</section>`;}
function panelModel(s){const o=otherworldStatus(s);return {o,max:Math.min(o.highestCleared+1,o.maxFloor),busy:!!(s.activeEncounter&&!s.activeEncounter.rewarded)};}
const actionHint=busy=>busy?'本场结束后执行换层或退出。':'可切换层数或退出异界。';
export function renderOtherworldPanel(s){if(!hasCanonicalEpilogue(s))return '';const {o,max,busy}=panelModel(s);return `<section class="panel otherworldPanel" data-otherworld-active="${o.active}" aria-label="异界爬层控制"><div class="otherworldPanelTitle"><div><div class="eyebrow">尾声之后 · 独立挑战</div><h2>异界通道 <span data-ow-text="floor">第 ${o.floor} 层${o.stats.elite?' · 精英':''}</span></h2></div><strong data-ow-text="highest">最高通关 ${o.highestCleared} 层</strong></div><p>异界守卫拥有较高基础属性；基础生命、攻击与护甲每层提升 <b>1%</b>。每50层为精英关：生命额外+25%、攻击+100%、护甲+10%。</p><div class="otherworldStats"><span>生命 <b data-ow-text="hp">${n(o.stats.hp)}</b></span><span>攻击 <b data-ow-text="atk">${n(o.stats.atk)}</b></span><span>护甲 <b data-ow-text="armor">${n(o.stats.armor)}</b></span><span>基础成长 <b data-ow-text="scale">${formatAttributePercent(o.stats.scale)}</b></span></div><p class="otherworldLoot">每胜利必得${LOOT.gearPerWin}件${LOOT.equipmentLevel}级装备：${LOOT.rarities.map((q,i)=>RARITY[q]+' '+LOOT.qualityWeights[i]+'%').join(' / ')}；另有${LOOT.setChance*100}%概率获得全部种族池中的套装。经验${LOOT.xp}，金币${LOOT.gold}；不掉落传说或普通材料。首次通过每50层奖励1颗天神之石，可在熔炉施加神赐；重复通关不再获得。</p><p class="subtleText">天神之石 <b data-ow-text="divine-stones">${divineStoneBalance(s)}</b> 颗 · 熔炉的神赐工序可使用</p><div class="otherworldControls">${o.active?`<button data-otherworld="auto" aria-pressed="${o.autoAdvance}">${o.autoAdvance?'✓ 自动推进下一层':'固定本层刷取'}</button><label>选择层数 <input id="otherworldFloor" type="number" min="1" max="${max}" step="1" value="${o.floor}" data-last-floor="${o.floor}" aria-label="选择已解锁异界层数"></label><button data-otherworld="floor">切换层数</button><button data-otherworld="exit">退出异界</button>`:'<button class="primary" data-otherworld="enter">进入异界 · 开始爬层</button>'}</div><p class="otherworldActionHint" data-ow-text="action">${o.active?actionHint(busy):'进入后保留普通世界路线。'}</p><p class="subtleText"><span class="otherworldRange" data-ow-text="range">可选择第1–${max}层</span>；关闭自动推进即可反复刷取。本场结束后安全切换，不丢弃战斗奖励。退出后停止挂机，不会自动进入普通世界。</p><div class="otherworldPending" role="status"><span>待领取装备 <b data-ow-text="pending">${o.pendingEquipment}</b> 件 · 背包满时安全保留</span><button data-otherworld="claim" ${o.pendingEquipment?'':'disabled'}>领取可容纳装备</button></div><p class="otherworldStorageHint" data-ow-text="storage" role="status">${o.storageBlocked?'待领取装备已满，请整理背包后领取，再继续挑战。':''}</p></section>`;}
// Tick updates must not replace buttons between pointerdown and click. Only a real
// portal enter/exit mounts another structure; busy/floor/reward changes patch text.
export function updateOtherworldPanel(host,s){
 if(!host)return;
 if(!s.otherworld?.active||!hasCanonicalEpilogue(s)){if(host.innerHTML)host.innerHTML='';return;}
 const panel=host.querySelector?.('.otherworldPanel');
 const stoneCounter=host.querySelector?.('[data-ow-text="divine-stones"]');if(stoneCounter)stoneCounter.textContent=String(divineStoneBalance(s));
 if(!panel||panel.getAttribute('data-otherworld-active')!=='true'){const html=renderOtherworldPanel(s);if(host.innerHTML!==html)host.innerHTML=html;return;}
 const {o,max,busy}=panelModel(s);
 const fields={floor:`第 ${o.floor} 层${o.stats.elite?' · 精英':''}`,highest:`最高通关 ${o.highestCleared} 层`,hp:n(o.stats.hp),atk:n(o.stats.atk),armor:n(o.stats.armor),scale:formatAttributePercent(o.stats.scale),action:actionHint(busy),range:`可选择第1–${max}层`,pending:String(o.pendingEquipment),storage:o.storageBlocked?'待领取装备已满，请整理背包后领取，再继续挑战。':''};
 for(const [key,value] of Object.entries(fields)){const node=panel.querySelector(`[data-ow-text="${key}"]`);if(node&&node.textContent!==value)node.textContent=value;}
 const auto=panel.querySelector('[data-otherworld="auto"]');if(auto){const label=o.autoAdvance?'✓ 自动推进下一层':'固定本层刷取';if(auto.textContent!==label)auto.textContent=label;auto.setAttribute('aria-pressed',String(o.autoAdvance));}
 const input=panel.querySelector('#otherworldFloor');if(input){
  input.max=String(max);
  if(!input.getAttribute('data-ow-bound')){const keepDraft=()=>input.setAttribute('data-ow-draft','true');input.addEventListener?.('focus',keepDraft);input.addEventListener?.('input',keepDraft);input.setAttribute('data-ow-bound','true');}
  // A deliberate draft stays a draft even when automatic progression passes
  // through that exact number. Explicit switch/navigation mounts a fresh input.
  const focused=host.ownerDocument?.activeElement===input;
  if(focused||input.value!==input.getAttribute('data-last-floor'))input.setAttribute('data-ow-draft','true');
  if(input.getAttribute('data-ow-draft')!=='true'){input.value=String(o.floor);input.setAttribute('data-last-floor',String(o.floor));}
 }
 const claim=panel.querySelector('[data-otherworld="claim"]');if(claim)claim.disabled=!o.pendingEquipment;
}
