import {RETURN_RING_MATERIALS,RETURN_RING_EVENTS} from './return-ring-content.js';
import {returnRingRecipeKnown} from './return-ring-state.js';
import {quoteReturnRingCraft} from './return-ring-crafting.js';
import {MATERIALS,materialCount} from './engine.js';
import {materialIcon} from './material-pixel-art.js';
import {equipmentIcon} from './equipment-art.js';
import {AREAS} from './location-schema.js';
import {npcEventAccess,npcEventDefinition,npcEventObjectiveProgress} from './npc-events.js';
const esc=t=>String(t??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function materialCard(s,m,index,crafted){
 const count=materialCount(s,m.material,3),base=RETURN_RING_EVENTS.find(d=>d.race===m.race),def=npcEventDefinition(s,base.id)??base,row=s.npcEvents?.entries?.[def.id],progress=npcEventObjectiveProgress(s,def.id);
 const known=!!row||s.story?.flags?.includes(def.requiresStoryFlag),done=row?.status==='resolved'||s.taskRewardClaims?.includes(def.id),declined=row?.status==='declined';
 let status='来源尚未发现',detail='继续旅程，留意沿途人物的托付。',link='';
 if(known){
  status=done?'委托已完成':declined?'已选择继续赶路':row?.status==='active'?'委托进行中':'尚未接取';
  detail=done?(count?'旧物已领取。':'旧物已领取，但当前未持有；一次性奖励不能补领。'):declined?'这次委托已拒绝，当前无法重新接取。':row?.status==='active'?`${progress.modern?'调查与挑战':'历史委托 · '+def.actionLabel} · ${progress.count} / ${progress.target}${progress.complete?' · 目标完成，需返回交付。':progress.modern?' · 按顺序完成下列步骤。':' · 接取后的真实胜利才计数。'}`:'亲自抵达委托人身边，查看并接取委托。';
  if(!done&&!declined){const access=npcEventAccess(s,def.id);if(!access.allowed)detail+=' '+access.reason+'。';link=`<button type="button" data-npc-map-area="${esc(def.areaId)}">查看地点</button>`;}
 }
 return `<article class="returnRingMaterial ${crafted||count?'isOwned':'isMissing'}" data-return-ring-material="${esc(m.material)}"><div class="returnRingMaterialTop"><span class="returnRingOrdinal">0${index+1}</span><span class="returnRingStock">${crafted?'已用于制造':(count?'已持有':'缺少')+' · '+count+' / 1'}</span></div><div class="returnRingMaterialIdentity">${materialIcon(m.material,{quality:3,size:48})}<div><h3>${esc(MATERIALS[m.material]?.name??m.material)}</h3><small>至臻 · ${crafted?'已消耗':'需要'} 1 份</small></div></div><div class="returnRingSource"><strong>${esc(status)}</strong>${known?`<span>${esc(def.npcName)} · ${esc(AREAS[def.areaId]?.name??def.areaId)}</span>`:''}<p>${esc(crafted?'本次旅程已制成归途之环；旧物无需再次收集。':detail)}</p>${!crafted&&known&&!done&&!declined&&progress.modern&&progress.checkpoints.length?`<ol class="returnRingSteps">${progress.checkpoints.map(point=>`<li class="${point.complete?'isDone':''}"><span>${point.complete?'已完成':'待完成'}</span> ${esc(point.label??point.name??point.id)}${point.challenge==='dungeon-clear'?'<small>通关普通副本后自动完成</small>':''}</li>`).join('')}</ol>`:''}${crafted?'':link}</div></article>`;
}
export function renderReturnRingRecipe(s){
 // A hidden recipe must not reveal the ring, its effects or the old objects' use.
 if(!returnRingRecipeKnown(s))return '';
 const quote=quoteReturnRingCraft(s),crafted=s.returnRing.crafted,collected=RETURN_RING_MATERIALS.filter(m=>materialCount(s,m.material,3)>=1).length;
 const pending=s.pendingForgeClaim?.item?.legendaryId==='return-ring';
 const notices={'balance-unconfirmed':'配方参数尚待确认，暂不能制造。','materials':'五件旧物尚未齐备。','gold':'金币不足。','pending-forge':'先到自由融合页领取已保存的熔炉成品。','in-battle':'结束远征后再制造。','invalid-state':'当前存档状态不支持制造。','ingredients':'请备齐配方指定的五件旧物。'};
 const status=crafted?(pending?'已制成 · 成品待领取':'已制成 · 本次旅程仅此一枚'):quote.ok?'条件已齐备 · 可以制造':notices[quote.reason]??'当前不能制造。';
 return `<section class="returnRingRecipe" aria-label="归途之环配方"><header class="returnRingHeader"><div class="returnRingHero" aria-label="归途之环成品图样">${equipmentIcon({legendaryId:'return-ring',slot:'ring',rarity:3},{size:64})}</div><div class="returnRingTitle"><span class="eyebrow">五件旧物 · 一枚归途</span><h2>归途之环</h2><p>已永久掌握 · 一次性传说配方</p></div><span class="returnRingBadge">${crafted?'本次旅程已制成':collected+' / 5 件备齐'}</span></header><div class="returnRingCollection"><div><strong>${crafted?'旧物收集记录':'旧物收集进度'}</strong><span>${crafted?'已用于制造 5 / 5 · 无需再次收集':'当前持有 '+collected+' / 5'}</span></div><div class="returnRingProgress" aria-label="${crafted?'已用于制造 5 / 5 件旧物':'当前持有 '+collected+' / 5 件旧物'}">${RETURN_RING_MATERIALS.map(m=>`<i class="${crafted||materialCount(s,m.material,3)?'filled':''}"></i>`).join('')}</div></div><div class="returnRingMaterials">${RETURN_RING_MATERIALS.map((m,i)=>materialCard(s,m,i,crafted)).join('')}</div><p class="returnRingMapNote">来源只显示已经开启或亲历的委托；查看地点仅打开地图，不会旅行或自动交付。</p><div class="returnRingFinish"><div class="returnRingEffects"><strong>成品效果 · 装备后生效</strong><p>经验获取 +20%：包含实际战斗、副本与离线结算；仅装备后生效，不叠加。</p><p>战斗胜利后恢复15%最大生命，最高恢复至生命上限，包含普通副本的阶段胜利。</p><p>首领传说、稀有材料与无限宝石的有效掉落率增加3个百分点。</p></div><div class="returnRingCraft"><strong>合成条件</strong><p>至臻旧物各 1 份 · 共 5 份<br>金币 ${quote.gold} · 当前 ${Math.floor(s.gold)}</p><p class="returnRingCraftStatus" role="status">${esc(status)}</p>${crafted?(pending?'<button type="button" data-forgetab="fusion">前往领取成品</button>':'<span class="returnRingComplete">制造记录已保存 · 不可重复制造</span>'):`<button type="button" class="primary" data-return-ring-craft="1" ${quote.ok?'':'disabled'}>制造归途之环 · ${quote.gold} 金币</button>`}</div></div><p class="returnRingFootnote">制造成功消耗上述五件旧物与金币；每次旅程只能制造一次。一次性旧物丢弃或消耗后无法补领。背包满时，成品保存在熔炉中等待领取。</p></section>`;
}
