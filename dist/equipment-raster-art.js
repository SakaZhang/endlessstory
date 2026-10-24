import {EXPANSION_PACKS} from './race-packs.js';
import {raceIconAsset} from './race-art.js';
// Direct PNG display, never an external image nested in SVG image mode.
import {EQUIPMENT_TEMPLATE_BY_ID} from './equipment-templates.js';
import {equipmentPresentation} from './equipment-presentation.js';
import {EQUIPMENT_RASTER_ASSETS} from './equipment-raster-registry.js';
export const LEGENDARY_RASTER_IDENTITIES=Object.freeze({...Object.fromEntries(EXPANSION_PACKS.flatMap(p=>p.legendaries.map(d=>[d.id,{id:d.id,name:d.name}]))),'first-forge-oathhammer':{id:'first-forge-oathhammer',name:'王统·初炉誓锤'},'everburning-reactor':{id:'everburning-reactor',name:'不熄之炉'}});
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function equipmentRasterSize(size=48){return size===32?32:size===64?64:48;}
export function equipmentRasterSource(template,size=48){const id=template?.id;const racial=raceIconAsset('equipment',id,equipmentRasterSize(size));if(racial)return racial;return typeof id==='string'&&(Object.hasOwn(EQUIPMENT_TEMPLATE_BY_ID,id)||Object.hasOwn(LEGENDARY_RASTER_IDENTITIES,id))&&Object.hasOwn(EQUIPMENT_RASTER_ASSETS,id)?EQUIPMENT_RASTER_ASSETS[id][equipmentRasterSize(size)]:null;}
export function renderEquipmentRaster(item,template,{size=48}={}){
 if(item?.legendaryId&&item.legendaryId!==template?.id)return null;
 const px=equipmentRasterSize(size),src=equipmentRasterSource(template,px);if(!src)return null;
 const id=template.id,p=equipmentPresentation({...item,set:item?.set||template.setId}),label=esc(template.name);
 return `<span class="equipmentRaster" data-equipment-raster="true" data-equipment-raster-size="${px}" data-equipment-art="${id}" data-equipment-visual="${id}" ${item?.legendaryId?'':`data-equipment-template="${id}"`} data-equipment-quality="${p.quality}" data-equipment-set="${p.isSet}" role="img" aria-label="${label}" style="--equipment-size:${px}px;--equipment-bg:${p.background};--equipment-frame:${p.border}"><img class="equipmentRasterImage" data-equipment-raster-image="true" src="${src}" width="${px}" height="${px}" alt="${label}" draggable="false"><span class="equipmentRasterError" hidden>图像失败</span></span>`;
}
export function bindEquipmentRasterErrors(host){
 const identify=img=>img?.dataset?.equipmentRasterImage==='true'?img.closest?.('[data-equipment-raster="true"]'):null;
 const update=(event,failed)=>{const img=event.target,wrapper=identify(img);if(!wrapper)return;const message=wrapper.querySelector?.('.equipmentRasterError');wrapper.classList.toggle('isImageError',failed);img.hidden=failed;if(message)message.hidden=!failed;if(failed){wrapper.setAttribute('tabindex','0');wrapper.setAttribute('role','button');wrapper.setAttribute('aria-label',(img.alt||'装备')+'：图像载入失败，点击重试');wrapper.setAttribute('title','图像载入失败，点击重试；不执行装备操作');}else{wrapper.removeAttribute('tabindex');wrapper.setAttribute('role','img');wrapper.setAttribute('aria-label',img.alt||'装备');wrapper.removeAttribute('title');}};
 const retry=event=>{if(event.type==='keydown'&&!['Enter',' '].includes(event.key))return;const wrapper=event.target?.closest?.('[data-equipment-raster="true"]');if(!wrapper?.classList?.contains('isImageError'))return;const img=wrapper.querySelector?.('.equipmentRasterImage');if(!img)return;event.preventDefault?.();event.stopPropagation?.();const original=img.dataset.equipmentOriginalSrc??img.getAttribute('src');img.dataset.equipmentOriginalSrc=original;const count=Number(img.dataset.equipmentRetry||0)+1;img.dataset.equipmentRetry=String(count);img.src=original+(original.includes('?')?'&':'?')+'asset_retry='+count;};
 const error=e=>update(e,true),load=e=>update(e,false);host.addEventListener('error',error,true);host.addEventListener('load',load,true);host.addEventListener('click',retry,true);host.addEventListener('keydown',retry,true);
 return()=>{host.removeEventListener('error',error,true);host.removeEventListener('load',load,true);host.removeEventListener('click',retry,true);host.removeEventListener('keydown',retry,true);};
}
/** Native QA/presentation helper: same PNG and frame, not an HTML/browser screenshot. */
export function drawEquipmentRaster(ctx,image,item,template,{x=0,y=0,size=48}={}){const px=equipmentRasterSize(size),p=equipmentPresentation({...item,set:item?.set||template?.setId});ctx.save();ctx.imageSmoothingEnabled=false;ctx.fillStyle=p.background;ctx.fillRect(x,y,px,px);ctx.drawImage(image,x,y,px,px);ctx.strokeStyle=p.border;ctx.lineWidth=1;ctx.strokeRect(x+.5,y+.5,px-1,px-1);ctx.restore();}
