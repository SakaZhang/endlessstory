import {effectiveLuck,setDropProbability} from './engine.js';
import {ordinarySecondRollProbability} from './luck-policy.js';
const pct=n=>(n*100).toFixed(4).replace(/0+$/,'').replace(/\.$/,'')+'%';
// Presentation only: absent old-save progress stays absent; no rolls or writes.
export function rareLootSnapshot(s){
 const p=s.rareRewardProgress, luck=effectiveLuck(s);
 return {luck,fieldRate:setDropProbability('field',luck),dungeonRate:setDropProbability('dungeon',luck),bossRate:setDropProbability('boss',luck),pendingSets:p?.pendingSets?.length??0,pendingFruit:p?.pendingFruit??0};
}
export function renderLuckRates(s){
 const r=rareLootSnapshot(s),extra=ordinarySecondRollProbability(r.luck);
 return `<section class="chronicle" aria-label="幸运实际概率"><h3>幸运与实际概率</h3><p>有效幸运 <b>${Math.round(r.luck)}</b> 点</p><p>套装掉率：野外 <b>${pct(r.fieldRate)}</b> · 普通副本 <b>${pct(r.dungeonRate)}</b> · 首领 <b>${pct(r.bossRate)}</b></p><p class="subtleText">品质与普通词条择优触发率 <b>${pct(extra)}</b></p></section>`;
}
export function renderRareLootProgress(s){
 const r=rareLootSnapshot(s),pending=r.pendingSets+r.pendingFruit;
 return `<section class="chronicle rareLootProgress" aria-label="珍稀战利品"><h3>珍稀战利品</h3><p>第3—10区域：野外每场胜利、整轮普通副本通关与首领胜利时独立判定套装。</p><p>灵慧之果产自精灵地区战斗；每枚永久增加3点可分配天赋点。</p><p>待领取：套装 <b>${r.pendingSets}</b> 件 · 灵慧之果 <b>${r.pendingFruit}</b> 枚。背包满时保留原奖励。</p>${pending?'<button class="primary" data-rare-loot-claim="1">领取可放入背包的奖励</button><p class="subtleText">套装需对应部位空位；灵慧之果需道具空间。</p>':'<p class="subtleText">暂无待领奖励。</p>'}</section>`;
}
export function renderRareLootInventory(s){
 const r=rareLootSnapshot(s),pending=r.pendingSets+r.pendingFruit;
 return `<section class="chronicle rareLootInventory" aria-label="珍稀战利品状态"><div style="display:flex;align-items:center;flex-wrap:wrap;gap:6px 16px"><strong>珍稀战利品</strong><span>待领：套装 ${r.pendingSets} 件 · 灵慧之果 ${r.pendingFruit} 枚</span>${pending?'<button class="primary" data-rare-loot-claim="1">领取奖励</button>':''}</div><details><summary>掉落规则与幸运实际概率</summary>${renderRareLootProgress(s)}${renderLuckRates(s)}</details></section>`;
}
