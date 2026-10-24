import {raceArt} from './race-art.js';
// Read-only portraits from exact current battle idle assets, never procedural monster fallback.
import {MONSTER_PIXEL_REGISTRY as registry} from './monster-pixel-registry.js';
import {MONSTER_CATALOG} from './monster-codex-schema.js';
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function monsterPixelDescriptor(id,{follower=false}={}){const native=raceArt(String(id).split('.')[0])?.monsters?.[id];if(native&&!follower){const frame=native.frames.find(f=>f.id===native.animations.idle[0]),box=frame.solidBBox??frame.alphaBBox??[16,16,176,176];return {id,spriteKey:'race-'+id,follower:false,file:frame.file,frameSize:native.frameSize??[192,192],crop:box};}
 if(typeof id!=='string'||!Object.hasOwn(registry.monsters,id))return null;
 const variant=follower?registry.variants.find(v=>v.match.definitionId===id&&v.match.follower===true):null;
 if(follower&&!variant)return null;const spriteKey=variant?.spriteKey??registry.monsters[id],sprite=registry.sprites[spriteKey];return sprite?{...sprite,spriteKey,id,follower:!!follower}:null;
}
export function monsterPortraitGeometry(d){const [x,y,right,bottom]=d.crop,w=right-x,h=bottom-y,scale=88/Math.max(w,h);return {left:(100-w*scale)/2-x*scale,top:(100-h*scale)/2-y*scale,width:d.frameSize[0]*scale,height:d.frameSize[1]*scale};}
// Generic undiscovered stamp does not request or encode the real actor sprite.
const unknownGlyph='<svg viewBox="0 0 16 16" aria-hidden="true" shape-rendering="crispEdges"><path fill="#56616b" d="M5 2h6v2h2v4h-2v2H9v2H7V8h2V6h2V4H5v2H3V4h2zM7 13h2v2H7z"/></svg>';
export function renderMonsterPixelPortrait(id,{known=true,follower=false}={}){
 if(!known)return `<span class="monsterPortrait monsterPixelUnknown monsterSilhouette" role="img" aria-label="未知怪物">${unknownGlyph}</span>`;
 const d=monsterPixelDescriptor(id,{follower});if(!d)return '<span class="monsterPortrait monsterPixelUnavailable" role="img" aria-label="怪物图像未提供">暂无图像</span>';
 const g=monsterPortraitGeometry(d),name=esc(follower?'随从':MONSTER_CATALOG[id]?.name??'怪物');
 return `<span class="monsterPortrait monsterPixelPortrait" data-monster-pixel="true" data-monster-id="${d.id}" data-monster-sprite="${d.spriteKey}" data-monster-follower="${d.follower}" role="img" aria-label="${name}"><img class="monsterPixelImage" data-monster-pixel-image="true" src="${d.file}" alt="${name}" draggable="false" style="left:${g.left}%;top:${g.top}%;width:${g.width}%;height:${g.height}%"><span class="monsterPixelError" hidden>图像失败</span></span>`;
}
export function bindMonsterPortraitErrors(host){
 const identify=img=>img?.dataset?.monsterPixelImage==='true'?img.closest?.('[data-monster-pixel="true"]'):null;
 const update=(event,failed)=>{const img=event.target,wrapper=identify(img);if(!wrapper)return;const message=wrapper.querySelector?.('.monsterPixelError');wrapper.classList.toggle('isImageError',failed);img.hidden=failed;if(message)message.hidden=!failed;if(failed){wrapper.setAttribute('tabindex','0');wrapper.setAttribute('role','button');wrapper.setAttribute('aria-label',(img.alt||'怪物画像')+'：图像载入失败，点击重试');wrapper.setAttribute('title','图像载入失败，点击重试；不执行怪物画像操作');}else{wrapper.removeAttribute('tabindex');wrapper.setAttribute('role','img');wrapper.setAttribute('aria-label',img.alt||'怪物画像');wrapper.removeAttribute('title');}};
 const retry=event=>{if(event.type==='keydown'&&!['Enter',' '].includes(event.key))return;const wrapper=event.target?.closest?.('[data-monster-pixel="true"]');if(!wrapper?.classList?.contains('isImageError'))return;const img=wrapper.querySelector?.('.monsterPixelImage');if(!img)return;event.preventDefault?.();event.stopPropagation?.();const original=img.dataset.monsterOriginalSrc??img.getAttribute('src');img.dataset.monsterOriginalSrc=original;const count=Number(img.dataset.monsterRetry||0)+1;img.dataset.monsterRetry=String(count);img.src=original+(original.includes('?')?'&':'?')+'asset_retry='+count;};
 const error=e=>update(e,true),load=e=>update(e,false);host.addEventListener('error',error,true);host.addEventListener('load',load,true);host.addEventListener('click',retry,true);host.addEventListener('keydown',retry,true);
 return()=>{host.removeEventListener('error',error,true);host.removeEventListener('load',load,true);host.removeEventListener('click',retry,true);host.removeEventListener('keydown',retry,true);};
}



/** Native same-source/crop contact, not browser rendering. */
export function drawMonsterPixelPortrait(ctx,image,d,{x=0,y=0,size=72}={}){const [sx,sy,r,b]=d.crop,w=r-sx,h=b-sy,scale=size*.88/Math.max(w,h);ctx.save();ctx.imageSmoothingEnabled=false;ctx.drawImage(image,sx,sy,w,h,x+(size-w*scale)/2,y+(size-h*scale)/2,w*scale,h*scale);ctx.restore();}
