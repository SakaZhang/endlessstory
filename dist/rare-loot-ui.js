import {effectiveLuck,setDropProbability} from './engine.js';
import {ordinarySecondRollProbability,lootOccurrenceProbability} from './luck-policy.js';
const pct=n=>(n*100).toFixed(4).replace(/0+$/,'').replace(/\.$/,'')+'%';
// Presentation only: absent old-save progress stays absent; no rolls or writes.
export function rareLootSnapshot(s){
 const p=s.rareRewardProgress, luck=effectiveLuck(s);
 return {luck,dungeonRate:setDropProbability('dungeon',luck),bossRate:setDropProbability('boss',luck),pendingSets:p?.pendingSets?.length??0,pendingFruit:p?.pendingFruit??0};
}
export function renderLuckRates(s){
 const r=rareLootSnapshot(s),extra=ordinarySecondRollProbability(r.luck),ordinary=lootOccurrenceProbability(.1,r.luck);
 return `<section class="chronicle" aria-label="幸运实际概率"><h3>幸运与实际概率</h3><p>当前有效幸运 <b>${r.luck}</b> 点（天赋、装备与有效药剂合计），不是掉率增加 ${r.luck}%。</p><p>套装独立掉率：普通副本 <b>${pct(r.dungeonRate)}</b>（基础8%）；首领 <b>${pct(r.bossRate)}</b>（基础12%）。套装概率相对增幅 <b>${pct(r.dungeonRate/.08-1)}</b>，只计算一次。</p><p class="subtleText">普通战利品机会另算：例如基础10% → ${pct(ordinary)}；品质与普通词条有 ${pct(extra)} 机会再掷一次取较好结果，并非直接增加同等品质概率。幸运不决定装备类型，不提高强化成功率，也不是所有奖励的统一加成。进行中的战斗使用开战时记录的幸运，当前数值用于新战斗。</p></section>`;
}
export function renderRareLootProgress(s){
 const r=rareLootSnapshot(s),pending=r.pendingSets+r.pendingFruit;
 return `<section class="chronicle rareLootProgress" aria-label="珍稀战利品"><h3>珍稀战利品</h3><p>第3—10区域：整轮普通副本通关独立判定套装（基础8%），首领胜利独立判定（基础12%）。</p><p>灵慧之果是精灵地区战斗特产；使用1枚永久增加3点可分配天赋点，不自动加点。</p><p>待领取：套装 <b>${r.pendingSets}</b> 件 · 灵慧之果 <b>${r.pendingFruit}</b> 枚。套装不受品质丢弃设置影响；背包满时奖励原样保留，不会重新随机。</p>${pending?'<button class="primary" data-rare-loot-claim="1">领取可放入背包的奖励</button><p class="subtleText">套装需对应部位空位；灵慧之果需道具空间。未能放入的奖励继续保留。</p>':'<p class="subtleText">暂无待领奖励。</p>'}</section>`;
}
export function renderRareLootInventory(s){
 const r=rareLootSnapshot(s),pending=r.pendingSets+r.pendingFruit;
 return `<section class="chronicle rareLootInventory" aria-label="珍稀战利品状态"><div style="display:flex;align-items:center;flex-wrap:wrap;gap:6px 16px"><strong>珍稀战利品</strong><span>待领：套装 ${r.pendingSets} 件 · 灵慧之果 ${r.pendingFruit} 枚</span>${pending?'<button class="primary" data-rare-loot-claim="1">领取奖励</button>':''}</div><details><summary>掉落规则与幸运实际概率</summary>${renderRareLootProgress(s)}${renderLuckRates(s)}</details></section>`;
}
