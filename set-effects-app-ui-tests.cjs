// Use the current production save key; retired-generation behavior has dedicated tests.
const {SAVE_KEY}=require('./dist/save-generation.js');
const assert=require('assert/strict');const {createCanvas}=require('@napi-rs/canvas');let intervals=[],elements=new Map(),events={},store=new Map(),timers=new Map(),timerId=0,reduced=false;
function el(id){if(elements.has(id))return elements.get(id);const canvas=createCanvas(960,540);const obj={id,style:{},classList:{add(){},remove(){}},open:false,showModal(){this.open=true},close(){this.open=false},addEventListener(){},click(){this.onclick?.()},getContext(...a){return canvas.getContext(...a)}};let html='';Object.defineProperty(obj,'innerHTML',{get:()=>html,set:v=>{html=v;for(let m of v.matchAll(/id="([^"]+)"/g))el(m[1]);}});elements.set(id,obj);return obj;}
global.document={hidden:false,getElementById:el,querySelector:selector=>selector==='.heroIdentity'?{querySelector:tag=>el('heroIdentity-'+tag)}:null,addEventListener:(k,f)=>(events[k]??=[]).push(f),createElement:()=>({click(){}})};global.window={addEventListener(){},matchMedia:()=>({matches:reduced})};global.localStorage={getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v),get length(){return store.size},key:i=>[...store.keys()][i]};global.requestAnimationFrame=()=>{};global.setInterval=(fn,ms)=>{if(ms===250)intervals.push(fn);return 0};global.setTimeout=(fn,ms)=>{let id=++timerId;timers.set(id,{fn,ms});return id};global.clearTimeout=id=>timers.delete(id);global.confirm=()=>true;
(async()=>{
 const E=await import('./dist/engine.js');const base=E.fresh('elf');
 const parts=['helm','armor','gloves','boots'].map(slot=>E.item(slot,20,'elf_arrow',3));base.inventory.push(...parts);E.normalizeCodexCollection(base);store.set(SAVE_KEY,JSON.stringify(base));
 await import('./dist/app.js?set-effects-ui');
 const click=(dataset={},id='')=>{const b={dataset,id};for(const f of events.click||[])f({target:{id,closest:()=>b}});};
 const saved=()=>JSON.parse(store.get(SAVE_KEY));
 click({view:'inventory'});click({item:parts[0].id});
 const verify=(html,n)=>{assert.match(html,new RegExp(`当前已穿戴 ${n} / 4 件`));assert.match(html,/直接伤害提高20%/);assert.match(html,/额外提高25%/);assert.match(html,/50%/);for(const threshold of [2,4])assert(html.includes(`data-set-pieces="${threshold}" data-set-active="${n>=threshold}"`));};
 verify(el('view').innerHTML,0);
 for(let n=1;n<=4;n++){click({equip:parts[n-1].id});verify(el('view').innerHTML,n);}
 click({view:'codex'});click({codexSet:'elf_arrow'});verify(el('view').innerHTML,4);
 const before=JSON.stringify(saved());click({codexSet:'elf_arrow'});click({codexSet:'elf_prism'});assert(!el('view').innerHTML.includes('穿戴套装效果'));click({codexSet:'elf_arrow'});verify(el('view').innerHTML,4);assert.equal(JSON.stringify(saved()),before);
 click({view:'inventory'});click({item:parts[0].id});verify(el('view').innerHTML,4);
 console.log('PASS set item/codex UI: real equip transitions 0–4, repeated navigation, hidden undiscovered effects, read-only view.');
})();
