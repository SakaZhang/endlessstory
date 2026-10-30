// Use the current production save key; retired-generation behavior has dedicated tests.
const {SAVE_KEY}=require('./dist/save-generation.js');
const assert=require('assert/strict');const {createCanvas}=require('@napi-rs/canvas');let elements=new Map(),events={},store=new Map(),timers=new Map(),timerId=0,reduced=false,failPrimary=false;
function el(id){if(elements.has(id))return elements.get(id);const canvas=createCanvas(960,540);const obj={id,style:{},classList:{add(){},remove(){}},open:false,showModal(){this.open=true},close(){this.open=false},addEventListener(){},click(){this.onclick?.()},getContext(...a){return canvas.getContext(...a)}};let html='';Object.defineProperty(obj,'innerHTML',{get:()=>html,set:v=>{html=v;for(let m of v.matchAll(/id="([^"]+)"/g))el(m[1]);}});elements.set(id,obj);return obj;}
global.document={hidden:false,getElementById:el,querySelector:selector=>selector==='.heroIdentity'?{querySelector:tag=>el('heroIdentity-'+tag)}:null,addEventListener:(k,f)=>(events[k]??=[]).push(f),createElement:()=>({click(){}})};global.window={addEventListener(){},matchMedia:()=>({matches:reduced})};global.localStorage={getItem:k=>store.get(k)||null,setItem:(k,v)=>{if(failPrimary&&k===SAVE_KEY)throw Error("QuotaExceededError");store.set(k,v)},get length(){return store.size},key:i=>[...store.keys()][i]};global.requestAnimationFrame=()=>{};global.setInterval=()=>0;global.setTimeout=(fn,ms)=>{let id=++timerId;timers.set(id,{fn,ms});return id};global.clearTimeout=id=>timers.delete(id);global.confirm=()=>true;
(async()=>{
 require('./m2-ui-test-fixture.cjs').installM2UiFixture();
 const E=await import('./dist/engine.js');const base=E.fresh();base.level=100;base.consumables.memoryFruit=5000;base.talents.power=99;
 store.set(SAVE_KEY,JSON.stringify(base));await import('./dist/app.js');
 const saved=()=>JSON.parse(store.get(SAVE_KEY)),click=(dataset={})=>{const b={dataset,id:''};for(const f of events.click||[])f({target:{id:'',closest:()=>b}})};
 click({view:'inventory'});click({bagTab:'items'});assert.match(el('view').innerHTML,/灵慧之果/);assert.match(el('view').innerHTML,/data-wisdom-fruit="5000"/);assert(!el('view').innerHTML.includes('回忆之果'));
 failPrimary=true;click({wisdomFruit:'5000'});failPrimary=false;assert.equal(saved().consumables.memoryFruit,5000);assert.equal(saved().earnedFruitTalentPoints,undefined);assert.match(el('saveStatus').textContent,/保存失败/);
 click({wisdomFruit:'5000'});const once=saved();assert.equal(once.consumables.memoryFruit,4999);assert.equal(once.earnedFruitTalentPoints,3);assert.equal(once.talents.power,99);click({wisdomFruit:'5000'});assert.deepEqual(saved(),once);
 el('talentBtn').click();assert.match(el('modalBody').innerHTML,/可分配 3 点/);assert.match(el('modalBody').innerHTML,/使用1枚 · 天赋点＋3/);assert(!/果实进度|套装未出|再通关|每枚可抵10点/.test(el('modalBody').innerHTML));
 console.log('PASS wisdom fruit actual app DOM: renamed inventory/use, 5000 migration, quota rollback, one action one fruit, no autoallocation, talent budget+3, hidden progress.');
})().catch(e=>{console.error(e);process.exitCode=1});
