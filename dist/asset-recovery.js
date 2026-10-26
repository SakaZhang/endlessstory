// Presentation-only recovery. Never changes a save, switches asset versions, or reloads automatically.
const failureListeners=new Set(),retryListeners=new Set(),failedUrls=new Set();
export function reportAssetFailure(url,error='Image failed'){failedUrls.add(String(url??''));for(const listener of failureListeners)try{listener({url:String(url??''),error:String(error?.message??error)});}catch{}}
export function reportAssetSuccess(url){if(!failedUrls.delete(String(url??'')))return;for(const listener of failureListeners)try{listener({recovered:true,outstanding:failedUrls.size});}catch{}}
export function retryFailedImages(){for(const retry of retryListeners)retry();}
export function assetRetryUrl(url,count){const [raw,hash]=String(url).split('#'),path=raw.replace(/([?&])asset_retry=\d+(&|$)/,'$1').replace(/[?&]$/,'');return path+(path.includes('?')?'&':'?')+'asset_retry='+count+(hash?'#'+hash:'');}

// Capturing listeners are installed before render. Reconcile cached completions too:
// an error may have happened before a newly inserted subtree was observed.
export function bindRecoverableImages(host,{imageSelector,datasetKey,wrapperSelector,errorSelector,label='图像',decorative=false}={}){
 let disposed=false;const states=new WeakMap(),pending=new Set();
 const connected=img=>!disposed&&img.isConnected!==false&&(typeof host.contains!=='function'||host.contains(img));
 const identify=img=>img?.matches?img.matches(imageSelector)?img.closest(wrapperSelector):null:img?.dataset?.[datasetKey]==='true'?img.closest?.(wrapperSelector):null;
 const stateFor=img=>{let state=states.get(img);if(!state){state={original:img.getAttribute('src'),count:0,automatic:0,timer:null,failed:false};states.set(img,state);}return state;};
 const cancel=state=>{if(state.timer!==null)clearTimeout(state.timer);state.timer=null;};
 const update=(img,failed)=>{const wrapper=identify(img);if(!wrapper)return;const message=wrapper.querySelector?.(errorSelector);wrapper.classList.toggle('isImageError',failed);img.hidden=failed;if(message)message.hidden=!failed;
  if(failed){if(!decorative){wrapper.setAttribute('tabindex','0');wrapper.setAttribute('role','button');wrapper.setAttribute('aria-label',(img.alt||label)+'：图像载入失败，点击重试');}wrapper.setAttribute('title','图像载入失败，点击重试；不执行游戏操作');}
  else{wrapper.removeAttribute('title');if(!decorative){wrapper.removeAttribute('tabindex');wrapper.setAttribute('role','img');wrapper.setAttribute('aria-label',img.alt||label);}}
 };
 const retry=img=>{const state=states.get(img);if(!state||!state.failed||!connected(img))return;cancel(state);img.src=assetRetryUrl(state.original,++state.count);};
 const error=event=>{const img=event.target;if(!identify(img)||!connected(img))return;const state=stateFor(img);state.failed=true;pending.add(img);update(img,true);reportAssetFailure(state.original);if(state.timer!==null||state.automatic>=2)return;const delay=[250,1000][state.automatic++];state.timer=setTimeout(()=>{state.timer=null;if(connected(img))retry(img);else{pending.delete(img);reportAssetSuccess(state.original);}},delay);};
 const load=event=>{const img=event.target;if(!identify(img))return;const state=states.get(img);if(state){cancel(state);state.failed=false;state.automatic=0;reportAssetSuccess(state.original);}pending.delete(img);update(img,false);};
 const click=event=>{if(event.type==='keydown'&&!['Enter',' '].includes(event.key))return;const wrapper=event.target?.closest?.(wrapperSelector);if(!wrapper?.classList?.contains('isImageError'))return;const img=wrapper.querySelector?.(imageSelector);if(!img)return;event.preventDefault?.();event.stopPropagation?.();retry(img);};
 const scan=node=>{if(!node)return;const rows=[...(node.matches?.(imageSelector)?[node]:[]),...(node.querySelectorAll?.(imageSelector)??[])];for(const img of rows)if(img.complete&&img.getAttribute('src'))(img.naturalWidth>0?load:error)({target:img});};
 const retryAll=()=>{for(const img of pending)if(connected(img))retry(img);else{cancel(states.get(img));reportAssetSuccess(states.get(img).original);pending.delete(img);}};
 host.addEventListener('error',error,true);host.addEventListener('load',load,true);host.addEventListener('click',click,true);host.addEventListener('keydown',click,true);retryListeners.add(retryAll);scan(host);
 const Observer=host.ownerDocument?.defaultView?.MutationObserver??globalThis.MutationObserver;
 const observer=typeof Observer==='function'?new Observer(records=>{for(const record of records)for(const node of record.addedNodes??[])scan(node);for(const img of pending)if(!connected(img)){cancel(states.get(img));reportAssetSuccess(states.get(img).original);pending.delete(img);}}):null;
 if(observer)observer.observe(host,{childList:true,subtree:true});
 return()=>{disposed=true;observer?.disconnect();for(const img of pending){cancel(states.get(img));reportAssetSuccess(states.get(img).original);}pending.clear();retryListeners.delete(retryAll);host.removeEventListener('error',error,true);host.removeEventListener('load',load,true);host.removeEventListener('click',click,true);host.removeEventListener('keydown',click,true);};
}

export function releaseContext(baseURI,pageUrl){try{const base=new URL(baseURI,pageUrl),match=base.pathname.match(/^(.*\/)releases\/([a-f0-9]{64})\/$/);return match?{release:match[2],url:new URL(match[1]+'release-integrity.json',base).href}:null;}catch{return null;}}
export function bindAssetReleaseNotice(host,{beforeReload=()=>true,onRetry=()=>{},fetcher=(...args)=>fetch(...args),now=()=>Date.now()}={}){
 const doc=host.ownerDocument??host,context=releaseContext(doc.baseURI,globalThis.location?.href);let disposed=false,lastCheck=-Infinity,pending=null,notice=null,newRelease=false,controller=null;
 const show=()=>{if(disposed||!doc.createElement||!doc.body?.prepend)return;if(!notice){notice=doc.createElement('aside');notice.className='assetRecoveryNotice';notice.setAttribute('role','status');const text=doc.createElement('span'),retry=doc.createElement('button'),reload=doc.createElement('button');retry.type=reload.type='button';retry.textContent='重试图像';reload.textContent='刷新到新版本';retry.addEventListener('click',()=>{retryFailedImages();onRetry();});reload.addEventListener('click',()=>{if(beforeReload()!==false)globalThis.location?.reload();});notice.append(text,retry,reload);doc.body.prepend(notice);notice.parts={text,retry,reload};}notice.hidden=false;const {text,retry,reload}=notice.parts;text.textContent=newRelease?'游戏已有新版本，旧页面的图像可能已失效。请先确认未保存的草稿，再刷新。':'部分图像未载入，正在尝试恢复；仍未显示时可重试。';retry.hidden=newRelease;reload.hidden=!newRelease;};
 const check=event=>{if(event?.recovered){if(!event.outstanding&&!newRelease&&notice)notice.hidden=true;return;}if(notice)notice.hidden=false;show();if(disposed||!context||newRelease||pending||now()-lastCheck<30000)return pending;lastCheck=now();controller=new AbortController();const timeout=setTimeout(()=>controller?.abort(),8000);
  pending=(async()=>{await Promise.resolve();try{if(disposed)return;const response=await fetcher(context.url,{cache:'no-store',signal:controller.signal});if(!response.ok)return;const data=await response.json();if(!disposed&&/^[a-f0-9]{64}$/.test(data.release)&&data.release!==context.release){newRelease=true;show();}}catch{/* Keep the useful retry notice when the version probe is itself unavailable. */}finally{clearTimeout(timeout);pending=null;controller=null;}})();return pending;};
 failureListeners.add(check);return()=>{disposed=true;failureListeners.delete(check);controller?.abort();notice?.remove();};
}
