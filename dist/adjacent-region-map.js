import {createPixelMapScenes} from './pixel-map-scenes.js';
const maps=createPixelMapScenes();
const active=new WeakMap();
function currentCanvas(host,current){return active.get(host)===current&&host.isConnected!==false&&current.canvas.isConnected!==false&&host.querySelector('[data-region-canvas]')===current.canvas;}
function syncRetry(host,current){
 const previous=host.querySelector?.('[data-map-scene-retry]');previous?.remove?.();
 if(maps.status(current.areaId).mode!=='failed'||!currentCanvas(host,current))return;
 const doc=host.ownerDocument;if(!doc?.createElement)return;
 const button=doc.createElement('button');button.type='button';button.dataset.mapSceneRetry='';button.textContent='重新加载地图';button.className='mapSceneRetry';
 button.addEventListener('click',()=>{if(currentCanvas(host,current))retryAdjacentRegion(host,{id:current.areaId});});
 const stage=current.canvas.parentElement;if(stage)stage.appendChild(button);
}
// Keep the synchronous mountRegion draw contract. Only the current live canvas
// may receive a completed load; navigation and combat state are never touched.
export function drawAdjacentRegion(host,area){
 const canvas=host?.querySelector?.('[data-region-canvas]');if(!canvas||!area?.id)return false;
 const current={canvas,areaId:area.id};active.set(host,current);
 const ready=maps.draw(canvas,area.id);syncRetry(host,current);
 if(maps.status(area.id).mode==='idle'||maps.status(area.id).mode==='loading')maps.load(area.id).then(()=>{
  if(!currentCanvas(host,current))return;
  maps.draw(canvas,current.areaId);syncRetry(host,current);
 });
 return ready;
}
export function retryAdjacentRegion(host,area){
 const canvas=host?.querySelector?.('[data-region-canvas]');if(!canvas||!area?.id)return Promise.resolve(false);
 const current={canvas,areaId:area.id};active.set(host,current);
 const request=maps.load(area.id,{retry:true});maps.draw(canvas,area.id);syncRetry(host,current);
 return request.then(ok=>{if(currentCanvas(host,current)){maps.draw(canvas,area.id);syncRetry(host,current);}return ok;});
}
