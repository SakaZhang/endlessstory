// Use the current production save key; retired-generation behavior has dedicated tests.
const {SAVE_KEY}=require('./dist/save-generation.js');
const assert=require('assert/strict');const {createCanvas}=require('@napi-rs/canvas');let elements=new Map(),events={},store=new Map(),timers=new Map(),timerId=0,reduced=false,windowEvents={},failPrimary=false;
function el(id){if(elements.has(id))return elements.get(id);const canvas=createCanvas(960,540);const obj={id,style:{},classList:{add(){},remove(){}},open:false,showModal(){this.open=true},close(){this.open=false},addEventListener(){},click(){this.onclick?.()},getContext(...a){return canvas.getContext(...a)}};let html='';Object.defineProperty(obj,'innerHTML',{get:()=>html,set:v=>{html=v;if(id==='view')rebuildView(obj,v);for(let m of v.matchAll(/id="([^"]+)"/g))el(m[1]);}});elements.set(id,obj);return obj;}
global.document={scrollingElement:{scrollTop:0,scrollLeft:0},activeElement:null,hidden:false,getElementById:el,querySelector:selector=>selector==='.heroIdentity'?{querySelector:tag=>el('heroIdentity-'+tag)}:null,addEventListener:(k,f)=>(events[k]??=[]).push(f),createElement:()=>({click(){}})};global.window={addEventListener:(k,f)=>(windowEvents[k]??=[]).push(f),matchMedia:()=>({matches:reduced})};global.localStorage={getItem:k=>store.get(k)||null,setItem:(k,v)=>{if(failPrimary&&k===SAVE_KEY)throw new Error('QuotaExceededError');store.set(k,v)},get length(){return store.size},key:i=>[...store.keys()][i]};global.requestAnimationFrame=()=>{};global.setInterval=()=>0;global.setTimeout=(fn,ms)=>{let id=++timerId;timers.set(id,{fn,ms});return id};global.clearTimeout=id=>timers.delete(id);global.confirm=()=>true;

// Minimal DOM with replacement semantics: each render destroys the old shelf
// and buttons. Layout scrolling itself is verified in the managed preview.
function rebuildView(root,html){
 root.nodes={};root.buttons=[];root.scrollTop=0;root.scrollLeft=0;
 for(const name of ['pixelForgeInputs','fusionInputPicker','materialStackGrid','fusionGearGrid','fusionRules'])if(html.includes('class="'+name))root.nodes['.'+name]={scrollTop:0,scrollLeft:0,open:false,focus(options){this.focusOptions=options;document.activeElement=this;}};
 for(const match of html.matchAll(/<button\b([^>]*)>/g)){
  const attrs=match[1],dataset={};for(const m of attrs.matchAll(/data-([a-z-]+)="([^"]*)"/g))dataset[m[1].replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]=m[2];
  root.buttons.push({dataset,disabled:/\bdisabled\b/.test(attrs),focus(options){this.focusOptions=options;document.activeElement=this;}});
 }
 root.querySelector=selector=>root.nodes[selector]??null;root.querySelectorAll=selector=>selector==='button'?root.buttons:[];root.contains=node=>root.buttons.includes(node);
 document.activeElement=null;document.scrollingElement.scrollTop=0;
}
const click=dataset=>{const root=el('view'),button=root.buttons?.find(b=>Object.entries(dataset).every(([k,v])=>b.dataset[k]===v))??{dataset};document.activeElement=button;for(const f of events.click??[])f({target:{closest:()=>button}});};

const originalRebuild=rebuildView;
rebuildView=function(root,html){originalRebuild(root,html);for(const scope of ['bag','forge']){if(!html.includes('data-material-browser-scope="'+scope+'"'))continue;
 const controls=['search','quality','tag','sort'].map(field=>({dataset:{materialBrowser:scope,materialField:field},value:'',selectionStart:0,selectionEnd:0,focus(){document.activeElement=this;}}));
 const host={innerHTML:html.split('data-material-browser-results="'+scope+'">')[1]?.split('</section>')[0]??''};
 root.nodes['[data-material-browser-results="'+scope+'"]']=host;
 root.nodes['[data-material-browser-scope="'+scope+'"]']={querySelectorAll:()=>controls};root.nodes[scope+'Controls']=controls;
 }};
const edit=(scope,field,value,composing=false)=>{const node=el('view').nodes[scope+'Controls'].find(n=>n.dataset.materialField===field);node.value=value;node.selectionStart=node.selectionEnd=value.length;node.focus();for(const f of events[field==='search'?'input':'change']??[])f({target:node,isComposing:composing});assert.equal(document.activeElement,node,'control not replaced');assert.equal(node.selectionStart,value.length,'caret preserved');return node;};
const result=scope=>el('view').nodes['[data-material-browser-results="'+scope+'"]'].innerHTML;
(async()=>{
 const E=await import('./dist/engine.js'),{renderMaterialFusionPreview}=await import('./dist/material-fusion-ui.js'),s=E.fresh();for(const [i,material] of Object.keys(E.MATERIALS).entries())for(let quality=0;quality<4;quality++){const key=E.materialKey(material,quality);if(key)s.materialStacks[key]=i+6;}
 assert(Object.keys(s.materialStacks).length>100);store.set(SAVE_KEY,JSON.stringify(s));await import('./dist/app.js?material-browser-flow');const saved=store.get(SAVE_KEY);
 click({view:'inventory'});click({bagTab:'materials'});assert(result('bag').includes('显示 366 / 366'));
 edit('bag','search','铁',true);edit('bag','search','铁屑');assert.equal((result('bag').match(/data-materialinfo=/g)||[]).length,4);
 edit('bag','quality','2');assert(result('bag').includes('data-materialinfo="铁屑|2"'));assert.equal((result('bag').match(/data-materialinfo=/g)||[]).length,1);
 edit('bag','search','不存在');assert(result('bag').includes('没有符合条件'));click({materialBrowserReset:'bag'});assert.equal((result('bag').match(/data-materialinfo=/g)||[]).length,366);
 edit('bag','search','铁');edit('bag','quality','3');edit('bag','tag','use:aux');assert(result('bag').includes('data-materialinfo="goblin.mat.02|3"'),'旧铆铁 auxiliary matches actual earth resistance recipe');click({materialBrowserReset:'bag'});
 edit('bag','search','灰根草');click({view:'forge'});assert.equal((result('forge').match(/data-material=/g)||[]).length,366,'bag filters independent');
 click({material:'铁屑|0'});const root=el('view'),preview=renderMaterialFusionPreview(E.previewMaterialFusion(s,['铁屑|0']));assert(preview&&root.innerHTML.includes(preview));edit('forge','search','灰根草',true);assert(!result('forge').includes('data-material="铁屑|0"'));assert(root.innerHTML.includes('已投入 1 / 5'));assert(root.innerHTML.includes('orbitSlot filled'));assert(root.innerHTML.includes(preview),'filter leaves probabilities unchanged');
 edit('forge','quality','3');assert.equal((result('forge').match(/data-material=/g)||[]).length,1);click({material:'灰根草|3'});assert(root.innerHTML.includes('已投入 2 / 5'));assert(result('forge').includes('已放 1'));assert(!result('forge').includes('data-material="铁屑|0"'));
 click({remove:'0'});assert(root.innerHTML.includes('已投入 1 / 5'));assert(result('forge').includes('已放 1'));
 edit('forge','search','"<>&');assert(result('forge').includes('没有符合条件'));click({materialBrowserReset:'forge'});assert.equal((result('forge').match(/data-material=/g)||[]).length,366);
 edit('forge','tag','tag:金属');assert(result('forge').includes('data-material="铁屑|0"'));edit('forge','sort','count-desc');
 click({view:'inventory'});click({bagTab:'materials'});assert.equal((result('bag').match(/data-materialinfo=/g)||[]).length,4,'bag query survives navigation');assert(result('bag').includes('灰根草'));
 assert.equal(store.get(SAVE_KEY),saved,'browsing/selections never save or consume');
 console.log('PASS material browser app: 366 stacks in bag+forge, independent persistent queries, IME/caret identity, quality/category/sort, empty/reset, hidden selected inputs + preview retained, accurate counts/removal, unchanged saved state.');
})().catch(error=>{console.error(error);process.exitCode=1;});
