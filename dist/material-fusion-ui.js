const QUALITY=['普通','稀有','优良','至臻'];
const SLOT={weapon:'武器',helm:'头盔',armor:'护甲',gloves:'手套',boots:'靴子',ring:'戒指',amulet:'项链',core:'核心'};
const percent=n=>(100*n).toFixed(2).replace(/\.00$/,'').replace(/(\.\d)0$/,'$1')+'%';
export function renderMaterialFusionPreview(preview){
 if(!preview)return '';
 const probabilities=preview.qualityProbabilities.map((p,i)=>QUALITY[i]+' '+percent(p)).join(' · ');
 const slots=Object.entries(preview.slotProbabilities).sort((a,b)=>b[1]-a[1]).map(([slot,p])=>SLOT[slot]+' '+percent(p)).join(' · ');
 return `<section class="pixelServiceNotice materialFusionPreview" aria-label="当前纯材料融合预览"><strong>当前投入预览 · ${preview.gold}金币</strong><p>成品品质：${probabilities}</p><p>${preview.minimumQuality>0?'本次最低'+QUALITY[preview.minimumQuality]+'。':'本次无品质保底。'} 已计入当前幸运与种族眷顾；概率四舍五入。</p><p>装备 ${percent(preview.equipmentChance)} · 药剂 ${percent(preview.potionChance)}；品质概率适用于两类成品。</p><p>若产出装备，部位概率：${slots}</p><small>满5份纯材料按平均品质提高收益；平均品质达到优良时不出普通，全至臻时最低优良。材料种类影响部位，不锁定词条、套装或传说。</small></section>`;
}
