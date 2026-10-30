import {POTION_RECIPE_CATALOG,potionRecipeAllows} from './potion-catalog.js';
// Presentation-only browsing: never normalize inventory, consume RNG or modify rows.
const esc=t=>String(t??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const compare=(a,b)=>String(a).localeCompare(String(b),'zh-CN');
export const freshMaterialBrowser=()=>({search:'',quality:'all',tag:'all',sort:'name-asc'});
// Use the production role whitelist (including alias resolution), not descriptive
// functionalTags: recipe expansions need not change a material's legacy tags.
const purposeCache=new WeakMap();
export function materialBrowserPurposes(catalog){
 if(purposeCache.has(catalog))return purposeCache.get(catalog);
 const base=new Set(),aux=new Set(),recipes=Object.values(POTION_RECIPE_CATALOG).filter(r=>r.enabled&&r.id!=='potion-healing');
 for(const [key,meta] of Object.entries(catalog)){
  // Healing uses recoveryInputPlan's recoveryBase rule rather than role arrays.
  if(POTION_RECIPE_CATALOG['potion-healing']?.enabled&&meta.functionalTags?.includes('recoveryBase')||recipes.some(r=>potionRecipeAllows(r.id,'main',key)))base.add(key);
  if(recipes.some(r=>potionRecipeAllows(r.id,'aux',key)))aux.add(key);
 }
 const result={base,aux};purposeCache.set(catalog,result);return result;
}
export function materialBrowserTags(catalog){
 const tags=[...new Set(Object.values(catalog).flatMap(m=>m.tags??[]))].sort(compare).map(tag=>['tag:'+tag,tag]);
 if(materialBrowserPurposes(catalog).base.size)tags.push(['use:base','药剂主材']);
 if(materialBrowserPurposes(catalog).aux.size)tags.push(['use:aux','药剂辅材']);
 return tags;
}
export function browseMaterials(entries,catalog,options={}){
 const o={...freshMaterialBrowser(),...options},query=o.search.trim().toLocaleLowerCase('zh-CN'),[field,direction]=o.sort.split('-'),sign=direction==='desc'?-1:1;
 const name=m=>catalog[m.material]?.name??m.material;
 return entries.filter(m=>{const meta=catalog[m.material]??{};return (!query||name(m).toLocaleLowerCase('zh-CN').includes(query))&&(o.quality==='all'||m.quality===Number(o.quality))&&(o.tag==='all'||o.tag.startsWith('tag:')&&meta.tags?.includes(o.tag.slice(4))||o.tag==='use:base'&&materialBrowserPurposes(catalog).base.has(m.material)||o.tag==='use:aux'&&materialBrowserPurposes(catalog).aux.has(m.material));}).sort((a,b)=>sign*(field==='quality'?a.quality-b.quality:field==='count'?a.count-b.count:compare(name(a),name(b)))||compare(name(a),name(b))||a.quality-b.quality||compare(a.key,b.key));
}
export function renderMaterialBrowserControls(scope,options,catalog,qualities){
 const o={...freshMaterialBrowser(),...options},select=(field,label,choices)=>`<label>${label}<select data-material-browser="${scope}" data-material-field="${field}" aria-label="${label}">${choices.map(([value,text])=>`<option value="${esc(value)}" ${o[field]===value?'selected':''}>${esc(text)}</option>`).join('')}</select></label>`;
 return `<div class="materialBrowserControls"><label class="materialSearch">搜索材料<input type="search" data-material-browser="${scope}" data-material-field="search" aria-label="搜索材料名称" placeholder="输入材料名称" value="${esc(o.search)}" autocomplete="off"></label>${select('quality','品质',[['all','全部品质'],...qualities.map((name,q)=>[String(q),name])])}${select('tag','类别 / 用途',[['all','全部类别 / 用途'],...materialBrowserTags(catalog)])}${select('sort','排序',[['name-asc','名称 ↑'],['name-desc','名称 ↓'],['quality-desc','品质 ↓'],['quality-asc','品质 ↑'],['count-desc','数量 ↓'],['count-asc','数量 ↑']])}<button data-material-browser-reset="${scope}">重置筛选</button></div>`;
}
