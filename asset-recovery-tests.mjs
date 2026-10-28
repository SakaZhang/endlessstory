import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {createRequire} from 'node:module';
import {loadImageAsset} from './dist/asset-loader.js';
import {assetRetryUrl,bindRecoverableImages,bindAssetReleaseNotice,releaseContext,reportAssetFailure,reportAssetSuccess,retryFailedImages} from './dist/asset-recovery.js';
import {EXPANSION_PACKS} from './dist/race-packs.js';
import {DWARF_EXPANDED_DEFINITION} from './dist/dwarf-skill-expansion.js';
import {renderSkillPixelIcon} from './dist/skill-pixel-icons.js';
const flush=()=>new Promise(r=>setImmediate(r)),sleep=ms=>new Promise(r=>setTimeout(r,ms));
const old={Image:globalThis.Image,location:globalThis.location,MutationObserver:globalThis.MutationObserver};
try{
 assert.equal(assetRetryUrl('./a.png?x=1#crop',2),'./a.png?x=1&asset_retry=2#crop');
 assert.equal(assetRetryUrl('./a.png?asset_retry=1',2),'./a.png?asset_retry=2');
 let requests=[],failures=1;
 globalThis.Image=class{set src(v){this.url=v;if(v)requests.push(v);}async decode(){if(failures-->0)throw Error('temporary offline');}};
 assert(await loadImageAsset('./transient.png'));assert.deepEqual(requests,['./transient.png','./transient.png?asset_retry=1']);
 requests=[];failures=10;await assert.rejects(loadImageAsset('./permanent.png'),/temporary offline/);assert.equal(requests.length,3,'initial + exactly two bounded retries');
 failures=0;assert(await loadImageAsset('./permanent.png',{retry:3}));assert.equal(requests.at(-1),'./permanent.png?asset_retry=3');
 let finishDecode;requests=[];globalThis.Image=class{set src(v){this.url=v;if(v)requests.push(v);}decode(){return new Promise(r=>finishDecode=r);}};
 const abort=new AbortController(),late=loadImageAsset('./stale.png',{signal:abort.signal});abort.abort();await assert.rejects(late,{name:'AbortError'});finishDecode();await flush();assert.equal(requests.length,1,'abort never retries obsolete scene');
 // Completed cached errors, insertions, bounded retries, click isolation, removal and cleanup.
 let observerCallback,disconnected=false;globalThis.MutationObserver=class{constructor(fn){observerCallback=fn;}observe(){}disconnect(){disconnected=true;}};
 const listeners={},rows=[],classes=new Set(),attrs={},message={hidden:true},writes=[];
 const wrapper={classList:{toggle:(k,on)=>on?classes.add(k):classes.delete(k),contains:k=>classes.has(k)},querySelector:q=>q==='.error'?message:img,setAttribute:(k,v)=>attrs[k]=v,removeAttribute:k=>delete attrs[k]};
 const img={dataset:{testImage:'true'},alt:'Real art',complete:true,naturalWidth:0,isConnected:true,matches:q=>q==='.image',closest:()=>wrapper,getAttribute:()=> './cached.png',set src(v){writes.push(v);},hidden:false};rows.push(img);
 const host={contains:n=>rows.includes(n)&&n.isConnected,querySelectorAll:()=>rows,addEventListener:(k,f)=>listeners[k]=f,removeEventListener:k=>delete listeners[k]};
 const dispose=bindRecoverableImages(host,{imageSelector:'.image',datasetKey:'testImage',wrapperSelector:'.wrapper',errorSelector:'.error'});
 assert(img.hidden&&!message.hidden,'already-failed cached image is reconciled');await sleep(275);assert.equal(writes.length,1);listeners.error({target:img});await sleep(1025);assert.equal(writes.length,2);listeners.error({target:img});await sleep(30);assert.equal(writes.length,2,'no automatic retry loop');
 let stopped=0;listeners.click({type:'click',target:{closest:()=>wrapper},preventDefault(){stopped++},stopPropagation(){stopped++}});assert.equal(stopped,2);assert.equal(writes.length,3);
 listeners.load({target:img});assert(!img.hidden&&message.hidden);assert.equal(attrs.role,'img');
 listeners.error({target:img});img.isConnected=false;observerCallback([{addedNodes:[],removedNodes:[img]}]);await sleep(275);assert.equal(writes.length,3,'detached image gets no delayed retry');dispose();assert(disconnected);assert.deepEqual(listeners,{});retryFailedImages();assert.equal(writes.length,3);
 // Version detection never switches individual asset URLs or reloads automatically.
 const oldHash='a'.repeat(64),newHash='b'.repeat(64),base=`https://game.example/root/releases/${oldHash}/`;
 assert.equal(releaseContext(base,'https://game.example/root/').url,'https://game.example/root/release-integrity.json');assert.equal(releaseContext('https://game.example/root/','https://game.example/root/'),null);
 function doc(){const children=[];return {baseURI:base,body:{prepend:n=>children.unshift(n)},children,createElement(tag){return {tag,hidden:false,listeners:{},children:[],setAttribute(){},addEventListener(k,f){this.listeners[k]=f;},append(...xs){this.children.push(...xs);},remove(){const i=children.indexOf(this);if(i>=0)children.splice(i,1);}};}};}
 let reloads=0,checks=0,allow=false,retries=0,seenOptions;globalThis.location={href:'https://game.example/root/',reload(){reloads++;}};
 const document=doc(),stop=bindAssetReleaseNotice(document,{fetcher:async(url,options)=>{checks++;assert(url.endsWith('/root/release-integrity.json'));seenOptions=options;return {ok:true,json:async()=>({release:newHash})};},beforeReload:()=>allow,onRetry:()=>retries++});
 reportAssetFailure('./old-image.png');reportAssetFailure('./old-image2.png');await flush();assert.equal(checks,1,'concurrent failures share one fresh version probe');assert.equal(seenOptions.cache,'no-store');assert.equal(reloads,0);assert.equal(document.children.length,1);const notice=document.children[0];assert.match(notice.parts.text.textContent,/新版本/);assert(notice.parts.retry.hidden&&!notice.parts.reload.hidden);notice.parts.reload.listeners.click();assert.equal(reloads,0,'declined reload preserves draft');allow=true;notice.parts.reload.listeners.click();assert.equal(reloads,1,'only explicit accepted reload');stop();assert.equal(document.children.length,0);
 const offline=doc();let offlineChecks=0;const off=bindAssetReleaseNotice(offline,{fetcher:async()=>{offlineChecks++;throw Error('offline');}});reportAssetFailure('./offline.png');await flush();reportAssetFailure('./offline2.png');await flush();assert.equal(offlineChecks,1,'offline version probes are rate limited');assert(!offline.children[0].parts.retry.hidden);assert(offline.children[0].parts.reload.hidden);assert.equal(reloads,1);off();
 const staleDoc=doc();let releaseVersion;const stale=bindAssetReleaseNotice(staleDoc,{fetcher:()=>new Promise(r=>releaseVersion=r)});reportAssetFailure('./late.png');await flush();stale();releaseVersion({ok:true,json:async()=>({release:newHash})});await flush();assert.equal(staleDoc.children.length,0,'disposed async result never recreates notice');
 // Exact canonical paths, actual decoded pixels for all 150 skill identities.
 const {loadImage}=createRequire(import.meta.url)('@napi-rs/canvas');let skills=0;for(const tree of [DWARF_EXPANDED_DEFINITION,...EXPANSION_PACKS.map(p=>p.skillTree??p.tree).filter(Boolean)])for(const n of tree.nodes){const html=renderSkillPixelIcon(n.id),src=html.match(/src="([^"]+)"/)?.[1];assert(src,n.id);assert(existsSync('dist/'+src),src);const png=await loadImage(readFileSync('dist/'+src));assert(png.width>0&&png.height>0);skills++;}
 // Keep the browser-scroll layout invariant; v0.72 explicitly changes refund controls
 // and condition choices, which have dedicated UI/runtime regressions.
 const {execFileSync}=await import('node:child_process');for(const file of ['dist/skill-tree-ui.css','dist/skill-pixel-consumers.css'])assert.equal(readFileSync(file,'utf8'),execFileSync('git',['show','3117c0691986ce14054c8b858ce72eaf57853107:'+file],{encoding:'utf8'}));
 const layoutFunctions=text=>text.slice(text.indexOf('export function skillTreeGroups'),text.indexOf('const treeFingerprint='));
 assert.equal(layoutFunctions(readFileSync('dist/skill-tree-ui.js','utf8')),layoutFunctions(execFileSync('git',['show','3117c0691986ce14054c8b858ce72eaf57853107:dist/skill-tree-ui.js'],{encoding:'utf8'})));
 console.log(`PASS recovery: bounded backoff/manual retry/abort; cached errors/listeners/removal; offline/stale no-store version checks; explicit confirmed reload only; ${skills} actual skill PNGs; tree layout untouched. DOM mocks + native pixels, NOT browser QA.`);
}finally{Object.assign(globalThis,old);}
