const QUALITY=['普通','稀有','优良','至臻'];
const SLOT={weapon:'武器',helm:'头盔',armor:'护甲',gloves:'手套',boots:'靴子',ring:'戒指',amulet:'项链',core:'核心'};
const percent=n=>(100*n).toFixed(2).replace(/\.00$/,'').replace(/(\.\d)0$/,'$1')+'%';
export function renderMaterialFusionPreview(preview){
 if(!preview)return '';
 if(preview.kind==='infinity-gauntlet')return `<section class="pixelServiceNotice materialFusionPreview" aria-label="无限手套融合预览"><strong>${preview.complete?'固定产出 · 无限手套':'无限宝石融合'} · ${preview.gold}金币</strong><p>${preview.crafted?'本次旅程已制造过无限手套，不能再次制造；宝石不会消耗。':preview.complete?'五族至臻宝石齐备，必定获得无限手套（成功率100%）；无需配方。':'请放入五族至臻宝石各1颗。未凑齐或混入其他物品时不会融合，也不会消耗宝石。'}</p><small>每档仅一次，出售、拆解重炼或丢弃后无法重造。背包满时保留成品待领取。</small></section>`;
 const probabilities=preview.qualityProbabilities.map((p,i)=>QUALITY[i]+' '+percent(p)).join(' · ');
 const slots=Object.entries(preview.slotProbabilities).sort((a,b)=>b[1]-a[1]).map(([slot,p])=>SLOT[slot]+' '+percent(p)).join(' · ');
 return `<section class="pixelServiceNotice materialFusionPreview" aria-label="当前纯材料融合预览"><strong>当前投入预览 · ${preview.gold}金币</strong><p>成品品质：${probabilities}</p><p>${preview.minimumQuality>0?'本次最低'+QUALITY[preview.minimumQuality]+'。':'本次无品质保底。'} 已计入当前幸运与种族眷顾；概率四舍五入。</p><p>装备 ${percent(preview.equipmentChance)} · 药剂 ${percent(preview.potionChance)}；品质概率适用于两类成品。</p><p>若产出装备，部位概率：${slots}</p><small>满5份纯材料按平均品质提高收益；平均品质达到优良时不出普通，全至臻时最低优良。材料种类影响部位，不锁定词条、套装或传说。</small></section>`;
}
