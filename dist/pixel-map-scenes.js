// Read-only map pixels. No combat, travel, save writes, clocks or RNG.
const supported=id=>id==='world'||/^dwarf\.a(?:0[1-9]|10)$/.test(id);
function layersFor(manifest,scene){
 if(scene==='world')return manifest?.image&&manifest.size?.[0]===960&&manifest.size?.[1]===540?[{file:manifest.image}]:null;
 const ids=manifest?.areaBackgrounds?.[scene];if(!Array.isArray(ids)||!ids.length)return null;
 const layers=ids.map(id=>manifest.backgrounds?.find(b=>b.id===id));
 if(layers.some(b=>!b?.file||b.size?.[0]!==480||b.size?.[1]!==270))return null;
 return layers.sort((a,b)=>(a.z??0)-(b.z??0));
}
function notice(canvas,label){const c=canvas?.getContext?.('2d');if(!c)return false;canvas.width=960;canvas.height=540;c.imageSmoothingEnabled=false;c.fillStyle='#122232';c.fillRect(0,0,960,540);c.fillStyle='#c6b88c';c.textAlign='center';c.font='20px sans-serif';c.fillText(label,480,270,880);return false;}
export function drawPixelMapScene(canvas,scene,{manifest,images}={}){
 const layers=layersFor(manifest,scene),c=canvas?.getContext?.('2d');if(!c||!layers||layers.some(b=>!images?.has(b.file)))return false;
 if(canvas.width!==960)canvas.width=960;if(canvas.height!==540)canvas.height=540;
 c.save();try{c.setTransform(1,0,0,1,0,0);c.imageSmoothingEnabled=false;c.clearRect(0,0,960,540);for(const b of layers)c.drawImage(images.get(b.file),0,0,960,540);}finally{c.restore();}return true;
}
export function createPixelMapScenes({assetRoot='./map-assets/',battleAssetRoot='./battle-assets/',onStatus,manifest:worldManifest=null,battleManifest=null,images:providedImages=null}={}){
 let disposed=false;const manifests={world:worldManifest,battle:battleManifest},manifestPending={},images=providedImages??new Map(),states=new Map(),pending=new Map();
 const family=scene=>scene==='world'?'world':'battle';const root=scene=>scene==='world'?assetRoot:battleAssetRoot;
 function status(scene){if(disposed)return {mode:'disposed',label:'地图已释放'};if(!supported(scene))return {mode:'unavailable',label:'地图暂不可用'};const state=states.get(scene);if(state)return state;return {mode:'idle',label:'地图素材准备中'};}
 function publish(scene,value){states.set(scene,value);try{onStatus?.(scene,status(scene));}catch{}}
 async function getManifest(scene){const key=family(scene);if(manifests[key])return manifests[key];if(!manifestPending[key])manifestPending[key]=(async()=>{let response;if(scene==='world')response=await fetch(assetRoot+'manifest.json');else response=await fetch(battleAssetRoot+'manifest.json');if(!response.ok)throw Error('Manifest HTTP '+response.status);return manifests[key]=await response.json();})().finally(()=>{delete manifestPending[key]});return manifestPending[key];}
 async function load(scene,{retry=false}={}){
  if(disposed||!supported(scene))return false;if(pending.has(scene))return pending.get(scene);if(status(scene).mode==='ready')return true;if(status(scene).mode==='failed'&&!retry)return false;
  publish(scene,{mode:'loading',label:'地图素材加载中'});
  const promise=(async()=>{await Promise.resolve();try{const manifest=await getManifest(scene),layers=layersFor(manifest,scene);if(!layers)throw Error('Map mapping missing');await Promise.all(layers.map(async layer=>{if(images.has(layer.file))return;const image=new Image();image.src=root(scene)+layer.file;await image.decode();const expected=scene==='world'?[960,540]:[480,270];if(image.naturalWidth!==expected[0]||image.naturalHeight!==expected[1])throw Error('Invalid map dimensions');if(!disposed)images.set(layer.file,image);}));if(disposed)return false;publish(scene,{mode:'ready',label:'地图已就绪'});return true;}catch(error){if(!disposed)publish(scene,{mode:'failed',reason:'asset-load-failed',label:'地图加载失败 · 请重试',error:String(error?.message??error)});return false;}finally{pending.delete(scene);}})();pending.set(scene,promise);return promise;
 }
 function draw(canvas,scene){const state=status(scene);if(state.mode!=='ready')return notice(canvas,state.label);try{if(drawPixelMapScene(canvas,scene,{manifest:manifests[family(scene)],images}))return true;throw Error('Incomplete map assets');}catch(error){publish(scene,{mode:'failed',reason:'draw-failed',label:'地图绘制失败 · 请重试',error:String(error?.message??error)});return notice(canvas,'地图绘制失败 · 请重试');}}
 return Object.freeze({load,draw,status,dispose(){disposed=true;states.clear();}});
}
