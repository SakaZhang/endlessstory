// Read-only material art: exact catalogue identity, never generic icon category.
import {MATERIAL_CATALOG,resolveMaterialId} from './material-catalog.js';
import {MATERIAL_PIXEL_ASSETS} from './material-pixel-registry.js';
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function materialPixelSize(size=48){return size===32?32:size===64?64:48;}
export function materialPixelSource(key,size=48){const id=resolveMaterialId(key);return id&&Object.hasOwn(MATERIAL_PIXEL_ASSETS,id)?MATERIAL_PIXEL_ASSETS[id][materialPixelSize(size)]:null;}
export function materialIcon(key,{quality=0,size=48}={}){
 const id=resolveMaterialId(key),px=materialPixelSize(size),src=materialPixelSource(id,px),q=Number.isInteger(quality)&&quality>=0&&quality<=3?quality:0;
 if(!src)return '<span class="materialPixelUnknown" role="img" aria-label="材料图像未提供">暂无图像</span>';
 const name=esc(MATERIAL_CATALOG[id].name);
 return `<span class="materialPixel" data-material-pixel="true" data-material-id="${id}" data-material-size="${px}" data-material-quality="${q}" role="img" aria-label="${name}" style="--material-size:${px}px"><img class="materialPixelImage" data-material-pixel-image="true" src="${src}" width="${px}" height="${px}" alt="${name}" draggable="false"><span class="materialPixelError" hidden>图像失败</span></span>`;
}
export function bindMaterialPixelErrors(host){
 const identify=img=>img?.dataset?.materialPixelImage==='true'?img.closest?.('[data-material-pixel="true"]'):null;
 const update=(event,failed)=>{const img=event.target,wrapper=identify(img);if(!wrapper)return;const message=wrapper.querySelector?.('.materialPixelError');wrapper.classList.toggle('isImageError',failed);img.hidden=failed;if(message)message.hidden=!failed;if(failed){wrapper.setAttribute('tabindex','0');wrapper.setAttribute('role','button');wrapper.setAttribute('aria-label',(img.alt||'材料')+'：图像载入失败，点击重试');wrapper.setAttribute('title','图像载入失败，点击重试；不执行材料操作');}else{wrapper.removeAttribute('tabindex');wrapper.setAttribute('role','img');wrapper.setAttribute('aria-label',img.alt||'材料');wrapper.removeAttribute('title');}};
 const retry=event=>{if(event.type==='keydown'&&!['Enter',' '].includes(event.key))return;const wrapper=event.target?.closest?.('[data-material-pixel="true"]');if(!wrapper?.classList?.contains('isImageError'))return;const img=wrapper.querySelector?.('.materialPixelImage');if(!img)return;event.preventDefault?.();event.stopPropagation?.();const original=img.dataset.materialOriginalSrc??img.getAttribute('src');img.dataset.materialOriginalSrc=original;const count=Number(img.dataset.materialRetry||0)+1;img.dataset.materialRetry=String(count);img.src=original+(original.includes('?')?'&':'?')+'asset_retry='+count;};
 const error=e=>update(e,true),load=e=>update(e,false);host.addEventListener('error',error,true);host.addEventListener('load',load,true);host.addEventListener('click',retry,true);host.addEventListener('keydown',retry,true);
 return()=>{host.removeEventListener('error',error,true);host.removeEventListener('load',load,true);host.removeEventListener('click',retry,true);host.removeEventListener('keydown',retry,true);};
}

/** Native direct-PNG inspection helper, not a browser screenshot. Quality belongs to parent UI. */
export function drawMaterialPixel(ctx,image,{x=0,y=0,size=48}={}){const px=materialPixelSize(size);ctx.save();ctx.imageSmoothingEnabled=false;ctx.drawImage(image,x,y,px,px);ctx.restore();}
