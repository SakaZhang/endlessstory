// Pure presentation by real potion type / utility key; no effects or catalogue mutation.
import {POTION_CATALOG} from './potion-catalog.js';
import {CONSUMABLE_PIXEL_ASSETS} from './consumable-pixel-registry.js';
export const UTILITY_PIXEL_NAMES=Object.freeze({recipeScroll:'配方卷轴',recipeBook:'配方册',memoryfruit:'回忆果',reforgeToken:'重铸印记'});
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function consumablePixelSize(size=48){return size===32?32:size===64?64:48;}
export function consumablePixelSource(key,size=48){return typeof key==='string'&&Object.hasOwn(CONSUMABLE_PIXEL_ASSETS,key)?CONSUMABLE_PIXEL_ASSETS[key][consumablePixelSize(size)]:null;}
function render(key,name,{size=48}={}){const px=consumablePixelSize(size),src=consumablePixelSource(key,px);if(!src)return '<span class="consumablePixelUnknown" role="img" aria-label="物品图像未提供">暂无图像</span>';const label=esc(name);return `<span class="consumablePixel" data-consumable-pixel="true" data-consumable-key="${key}" data-consumable-size="${px}" role="img" aria-label="${label}" style="--consumable-size:${px}px"><img class="consumablePixelImage" data-consumable-pixel-image="true" src="${src}" width="${px}" height="${px}" alt="${label}" draggable="false"><span class="consumablePixelError" hidden>图像失败</span></span>`;}
export function potionIcon(type,options={}){return typeof type==='string'&&Object.hasOwn(POTION_CATALOG,type)?render(type,POTION_CATALOG[type].name,options):render(null,'药剂',options);}
export function utilityIcon(key,options={}){return typeof key==='string'&&Object.hasOwn(UTILITY_PIXEL_NAMES,key)?render(key,UTILITY_PIXEL_NAMES[key],options):render(null,'物品',options);}
export function bindConsumablePixelErrors(host){
 const identify=img=>img?.dataset?.consumablePixelImage==='true'?img.closest?.('[data-consumable-pixel="true"]'):null;
 const update=(event,failed)=>{const img=event.target,wrapper=identify(img);if(!wrapper)return;const message=wrapper.querySelector?.('.consumablePixelError');wrapper.classList.toggle('isImageError',failed);img.hidden=failed;if(message)message.hidden=!failed;if(failed){wrapper.setAttribute('tabindex','0');wrapper.setAttribute('role','button');wrapper.setAttribute('aria-label',(img.alt||'物品')+'：图像载入失败，点击重试');wrapper.setAttribute('title','图像载入失败，点击重试；不执行物品操作');}else{wrapper.removeAttribute('tabindex');wrapper.setAttribute('role','img');wrapper.setAttribute('aria-label',img.alt||'物品');wrapper.removeAttribute('title');}};
 const retry=event=>{if(event.type==='keydown'&&!['Enter',' '].includes(event.key))return;const wrapper=event.target?.closest?.('[data-consumable-pixel="true"]');if(!wrapper?.classList?.contains('isImageError'))return;const img=wrapper.querySelector?.('.consumablePixelImage');if(!img)return;event.preventDefault?.();event.stopPropagation?.();const original=img.dataset.consumableOriginalSrc??img.getAttribute('src');img.dataset.consumableOriginalSrc=original;const count=Number(img.dataset.consumableRetry||0)+1;img.dataset.consumableRetry=String(count);img.src=original+(original.includes('?')?'&':'?')+'asset_retry='+count;};
 const error=e=>update(e,true),load=e=>update(e,false);host.addEventListener('error',error,true);host.addEventListener('load',load,true);host.addEventListener('click',retry,true);host.addEventListener('keydown',retry,true);
 return()=>{host.removeEventListener('error',error,true);host.removeEventListener('load',load,true);host.removeEventListener('click',retry,true);host.removeEventListener('keydown',retry,true);};
}


/** Native original PNG rendering, not browser HTML QA. Quality belongs to parent. */
export function drawConsumablePixel(ctx,image,{x=0,y=0,size=48}={}){const px=consumablePixelSize(size);ctx.save();ctx.imageSmoothingEnabled=false;ctx.drawImage(image,x,y,px,px);ctx.restore();}
