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
(async()=>{
 const E=await import('./dist/engine.js'),{renderMaterialFusionPreview}=await import('./dist/material-fusion-ui.js'),s=E.fresh();s.materialStacks['铁屑|0']=10;s.materialStacks['灰根草|0']=10;
 const gear=Array.from({length:15},()=>E.item('weapon',8,null,1));s.inventory.push(...gear);store.set(SAVE_KEY,JSON.stringify(s));await import('./dist/app.js?forge-selection-scroll');click({view:'forge'});
 const root=el('view'),setPosition=()=>{root.nodes['.pixelForgeInputs'].scrollTop=317;root.nodes['.pixelForgeInputs'].scrollLeft=9;root.scrollTop=27;document.scrollingElement.scrollTop=611;root.nodes['.fusionRules'].open=true;},checkPosition=()=>{assert.equal(root.nodes['.pixelForgeInputs'].scrollTop,317);assert.equal(root.nodes['.pixelForgeInputs'].scrollLeft,9);assert.equal(root.scrollTop,27);assert.equal(document.scrollingElement.scrollTop,611);assert.equal(root.nodes['.fusionRules'].open,true);};
 for(let count=1;count<=5;count++){setPosition();click({material:'铁屑|0'});checkPosition();assert.equal(document.activeElement.dataset.material,'铁屑|0');assert.deepEqual(document.activeElement.focusOptions,{preventScroll:true});assert(root.innerHTML.includes(renderMaterialFusionPreview(E.previewMaterialFusion(s,Array(count).fill('铁屑|0')))),'preview matches current inputs');assert(root.innerHTML.includes('已放 '+count));assert(root.innerHTML.includes('已投入 '+count+' / 5'));assert.equal((root.innerHTML.match(/orbitSlot filled/g)??[]).length,count);}
 const full=root.innerHTML;click({material:'铁屑|0'});assert.equal(root.innerHTML,full,'sixth selection leaves DOM/selection alone');
 setPosition();click({remove:'3'});checkPosition();assert.equal(document.activeElement.dataset.remove,'3');assert(root.innerHTML.includes('已放 4'));assert(root.innerHTML.includes('已投入 4 / 5'));
 for(let i=0;i<4;i++){setPosition();click({remove:'0'});checkPosition();}
 assert(!root.innerHTML.includes('materialFusionPreview'),'empty input clears preview');assert(!root.innerHTML.includes('已放 '));assert(root.innerHTML.includes('已投入 0 / 5'));
 click({fusionInputTab:'equipment'});assert.equal(root.nodes['.pixelForgeInputs'].scrollTop,0,'tab change is intentional, not restored');click({fusionFamily:'weapon'});click({fusionPage:'1'});assert(root.innerHTML.includes('<span>2 / 2</span>'));
 setPosition();click({fusionGear:gear[12].id});checkPosition();assert(root.innerHTML.includes('<span>2 / 2</span>'));assert(root.innerHTML.includes('data-fusion-family="weapon" aria-pressed="true"'));assert(root.innerHTML.includes('data-fusion-input-tab="equipment" aria-pressed="true"'));assert(!root.innerHTML.includes('materialFusionPreview'),'gear input removes pure-material preview');assert.equal(document.activeElement,root.nodes['.fusionInputPicker'],'disabled selected gear falls back to picker');
 setPosition();click({remove:'0'});checkPosition();assert(root.innerHTML.includes('<span>2 / 2</span>'));assert(!root.innerHTML.includes('fusionSelectedMark'));
 click({fusionPage:'0'});assert(root.innerHTML.includes('<span>1 / 2</span>'));assert.equal(root.nodes['.pixelForgeInputs'].scrollTop,0);
 assert.deepEqual(JSON.parse(store.get(SAVE_KEY)).materialStacks,s.materialStacks,'selection does not spend materials');
 console.log('PASS forge selection DOM: replacement shelf/document scroll, five repeated inputs, limit, removal to empty, focus without scrolling, expanded rules, gear page/category, intentional tab/page reset; browser geometry delegated to managed preview.');
})().catch(error=>{console.error(error);process.exitCode=1;});
