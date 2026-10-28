// Use the current production save key; retired-generation behavior has dedicated tests.
const {SAVE_KEY}=require('./dist/save-generation.js');
const assert=require('assert/strict');const {createCanvas}=require('@napi-rs/canvas');let elements=new Map(),events={},store=new Map(),timers=new Map(),timerId=0,reduced=false,failStorage=false;
function el(id){if(elements.has(id))return elements.get(id);const canvas=createCanvas(960,540);const obj={id,style:{},classList:{add(){},remove(){}},open:false,showModal(){this.open=true},close(){this.open=false},addEventListener(){},click(){this.onclick?.()},getContext(...a){return canvas.getContext(...a)}};let html='';Object.defineProperty(obj,'innerHTML',{get:()=>html,set:v=>{html=v;for(let m of v.matchAll(/id="([^"]+)"/g))el(m[1]);}});elements.set(id,obj);return obj;}
global.document={hidden:false,getElementById:el,querySelector:selector=>selector==='.heroIdentity'?{querySelector:tag=>el('heroIdentity-'+tag)}:null,addEventListener:(k,f)=>(events[k]??=[]).push(f),createElement:()=>({click(){}})};global.window={addEventListener(){},matchMedia:()=>({matches:reduced})};global.localStorage={getItem:k=>store.get(k)||null,setItem:(k,v)=>{if(failStorage)throw Error("storage blocked");store.set(k,v)},get length(){return store.size},key:i=>[...store.keys()][i]};global.requestAnimationFrame=()=>{};global.setInterval=()=>0;global.setTimeout=(fn,ms)=>{let id=++timerId;timers.set(id,{fn,ms});return id};global.clearTimeout=id=>timers.delete(id);global.confirm=()=>true;
(async()=>{
 const E=await import('./dist/engine.js');let now=Date.now();const realNow=Date.now;Date.now=()=>now;
 const base=E.fresh();base.gold=100000;const m=E.ensureMerchant(base,now);delete m.pricingVersion;
 for(const o of m.offers)if(o.type==='equipment')o.price=E.racialGoldCost(base,15+E.sellValue(o.item)*4+o.item.level*3);
 const before=structuredClone(base);assert(E.validSave(base));store.set(SAVE_KEY,JSON.stringify(base));
 await import('./dist/app.js');
 const click=(dataset={})=>{const b={dataset,id:''};for(const f of events.click||[])f({target:{id:'',closest:()=>b}});},saved=()=>JSON.parse(store.get(SAVE_KEY));
 failStorage=true;click({view:'merchant'});assert.equal(saved().merchant.pricingVersion,undefined);assert.equal(saved().gold,before.gold);assert.deepEqual(saved().merchant,before.merchant);
 failStorage=false;now+=6000;click({shopretry:'1'});let shop=saved().merchant;assert.equal(shop.pricingVersion,E.MERCHANT_PRICING_VERSION);assert.equal(shop.revision,before.merchant.revision+1);
 assert.deepEqual(shop.offers.map(({price,...o})=>o),before.merchant.offers.map(({price,...o})=>o));assert.match(el('view').innerHTML,/普通×1、稀有×1.5、优良×2.5、至臻×4/);
 const gear=shop.offers.find(o=>o.type==='equipment');assert.equal(gear.price,E.merchantEquipmentPrice(gear.item));assert(el('view').innerHTML.includes(gear.price+' ◈'));
 click({buyEquipment:gear.offerId,shopQuote:String(before.merchant.revision)});assert.equal(saved().gold,before.gold);
 click({shopDetail:gear.offerId,shopQuote:String(shop.revision)});assert(el('modalBody').innerHTML.includes('购买 · '+gear.price+'◈'));
 click({buyEquipment:gear.offerId,shopQuote:String(shop.revision)});assert.equal(saved().gold,before.gold-gear.price);assert.deepEqual(saved().inventory.at(-1),gear.item);
 const after=structuredClone(saved());click({buyEquipment:gear.offerId,shopQuote:String(shop.revision)});assert.deepEqual(saved(),after);
 elements=new Map();events={};await import('./dist/app.js?quality-reload');click({view:'merchant'});assert.deepEqual(saved().merchant,after.merchant);
 Date.now=realNow;console.log('PASS merchant UI legacy reprice persist failure/retry, displayed tiers and exact debit, stale/double click rejection, reload idempotence');
})();
