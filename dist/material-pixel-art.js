import {bindRecoverableImages} from './asset-recovery.js';
import {raceIconAsset} from './race-art.js';
// Read-only material art: exact catalogue identity, never generic icon category.
import {MATERIAL_CATALOG,resolveMaterialId} from './material-catalog.js';
import {MATERIAL_PIXEL_ASSETS} from './material-pixel-registry.js';
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function materialPixelSize(size=48){return size===32?32:size===64?64:48;}
export function materialPixelSource(key,size=48){const id=resolveMaterialId(key);const racial=raceIconAsset('materials',id,materialPixelSize(size));if(racial)return racial;return id&&Object.hasOwn(MATERIAL_PIXEL_ASSETS,id)?MATERIAL_PIXEL_ASSETS[id][materialPixelSize(size)]:null;}
export function materialIcon(key,{quality=0,size=48}={}){
 const id=resolveMaterialId(key),px=materialPixelSize(size),src=materialPixelSource(id,px),q=Number.isInteger(quality)&&quality>=0&&quality<=3?quality:0;
 if(!src)return '<span class="materialPixelUnknown" role="img" aria-label="材料图像未提供">暂无图像</span>';
 const name=esc(MATERIAL_CATALOG[id].name);
 return `<span class="materialPixel" data-material-pixel="true" data-material-id="${id}" data-material-size="${px}" data-material-quality="${q}" role="img" aria-label="${name}" style="--material-size:${px}px"><img class="materialPixelImage" data-material-pixel-image="true" src="${src}" width="${px}" height="${px}" alt="${name}" draggable="false"><span class="materialPixelError" hidden>图像失败</span></span>`;
}
export function bindMaterialPixelErrors(host){return bindRecoverableImages(host,{imageSelector:'.materialPixelImage',datasetKey:'materialPixelImage',wrapperSelector:'[data-material-pixel="true"]',errorSelector:'.materialPixelError',label:'材料'});}

/** Native direct-PNG inspection helper, not a browser screenshot. Quality belongs to parent UI. */
export function drawMaterialPixel(ctx,image,{x=0,y=0,size=48}={}){const px=materialPixelSize(size);ctx.save();ctx.imageSmoothingEnabled=false;ctx.drawImage(image,x,y,px,px);ctx.restore();}
