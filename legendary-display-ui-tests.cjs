// Explicit previously acquired gear; production fresh() remains empty.
const {addTestEquipment}=require('./equipped-test-fixture.mjs');
// Use the current production save key; retired-generation behavior has dedicated tests.
const {SAVE_KEY}=require('./dist/save-generation.js');
const assert=require('assert/strict');const {createCanvas}=require('@napi-rs/canvas');let elements=new Map(),events={},store=new Map(),timers=new Map(),timerId=0,reduced=false,windowEvents={},failPrimary=false;
function el(id){if(elements.has(id))return elements.get(id);const canvas=createCanvas(960,540);const obj={id,style:{},classList:{add(){},remove(){}},open:false,showModal(){this.open=true},close(){this.open=false},addEventListener(){},click(){this.onclick?.()},getContext(...a){return canvas.getContext(...a)}};let html='';Object.defineProperty(obj,'innerHTML',{get:()=>html,set:v=>{html=v;for(let m of v.matchAll(/id="([^"]+)"/g))el(m[1]);}});elements.set(id,obj);return obj;}
global.document={hidden:false,getElementById:el,querySelector:selector=>selector==='.heroIdentity'?{querySelector:tag=>el('heroIdentity-'+tag)}:null,addEventListener:(k,f)=>(events[k]??=[]).push(f),createElement:()=>({click(){}})};global.window={addEventListener:(k,f)=>(windowEvents[k]??=[]).push(f),matchMedia:()=>({matches:reduced})};global.localStorage={getItem:k=>store.get(k)||null,setItem:(k,v)=>{if(failPrimary&&k===SAVE_KEY)throw new Error('QuotaExceededError');store.set(k,v)},get length(){return store.size},key:i=>[...store.keys()][i]};global.requestAnimationFrame=()=>{};global.setInterval=()=>0;global.setTimeout=(fn,ms)=>{let id=++timerId;timers.set(id,{fn,ms});return id};global.clearTimeout=id=>timers.delete(id);global.confirm=()=>true;
(async()=>{
const E=await import('./dist/engine.js');
const D=await import('./dist/equipment-display.js');
const base=E.fresh();base.gold=10000;
const legend=E.legendaryItem('first-forge-oathhammer',30),normal=E.item('weapon',30,null,3);
assert.equal(legend.rarity,3);assert.equal(normal.rarity,3);
base.inventory.push(legend,normal);E.equipItem(base,legend.id);assert(E.saveLoadout(base,0,'金色传说'));
assert(E.validSave(base));store.set(SAVE_KEY,JSON.stringify(base));
await import('./dist/app.js?legendary-display');
const click=(dataset={},id='')=>{const b={dataset,id};for(const f of events.click||[])f({target:{id,closest:()=>b}});};
const saved=()=>JSON.parse(store.get(SAVE_KEY));
const heading=(html,item,q)=>assert(html.includes('class="r'+q+'text">'+item.name),item.name+' uses display tier '+q);
click({view:'inventory'});click({item:legend.id});heading(el('view').innerHTML,legend,4);assert(el('view').innerHTML.includes('传说 / 武器'));
click({item:normal.id});heading(el('view').innerHTML,normal,3);assert(el('view').innerHTML.includes('至臻 / 武器'));
click({view:'loadouts'});assert.match(el('view').innerHTML,/loadoutGearSlot r4/);
click({view:'forge'});click({forgetab:'modify'});click({modifySlot:'weapon'});click({modifyitem:legend.id});heading(el('view').innerHTML,legend,4);assert(el('view').innerHTML.includes('传说 · 武器'));
click({enhanceItem:legend.id});heading(el('view').innerHTML,legend,4);
const before=JSON.stringify(base.inventory);
for(const item of [legend,normal]){assert.equal(D.equipmentDisplayQuality(item),item===legend?4:3);assert.equal(D.equipmentDisplayRarity(item),item===legend?'传说':'至臻');}
const {renderForgeInputPicker}=await import('./dist/forge-input-ui.js');
const picker=renderForgeInputPicker(base,{tab:'equipment',eligibleEquipment:[legend,normal]});
assert(picker.includes('fusionGearCard r4'));assert(picker.includes('fusionGearCard r3'));assert(picker.includes(legend.name+' · 传说'));assert(picker.includes(normal.name+' · 至臻'));
const {renderEquipmentWorkshop}=await import('./dist/equipment-workshop-ui.js');
heading(renderEquipmentWorkshop(base,{selectedId:legend.id}),legend,4);
heading(renderEquipmentWorkshop(base,{selectedId:normal.id}),normal,3);
assert.equal(JSON.stringify(base.inventory),before,'display helper/renderers never mutate stored items');
assert.deepEqual(saved().inventory,base.inventory,'actual app display/navigation preserves rarity, IDs and stats');
assert(E.validSave(saved()));
const pending=saved();pending.pendingForgeClaim={kind:'equipment',item:E.legendaryItem('first-forge-oathhammer',30)};
assert(E.validSave(pending));store.set(SAVE_KEY,JSON.stringify(pending));elements=new Map();events={};windowEvents={};
await import('./dist/app.js?legendary-display-pending');click({view:'forge'});
heading(el('view').innerHTML,pending.pendingForgeClaim.item,4);assert.match(el('view').innerHTML,/forgeResult r4/);
assert.equal(saved().pendingForgeClaim.item.rarity,3,'pending result presentation leaves stored rarity unchanged');
console.log('PASS legendary display UI: stored rarity3 legendary gold/r4, supreme red/r3; actual inventory/details/loadout/reforge/enhancement, forge picker/workshop labels, no gameplay/save mutation.');
})().catch(e=>{console.error(e);process.exitCode=1});
