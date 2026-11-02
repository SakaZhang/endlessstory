// Use the current production save key; retired-generation behavior has dedicated tests.
const {SAVE_KEY}=require('./dist/save-generation.js');
const assert=require('assert/strict');const {createCanvas}=require('@napi-rs/canvas');let elements=new Map(),events={},store=new Map(),timers=new Map(),timerId=0,reduced=false,windowEvents={};
function el(id){if(elements.has(id))return elements.get(id);const canvas=createCanvas(960,540);const obj={id,style:{},classList:{add(){},remove(){}},open:false,showModal(){this.open=true},close(){this.open=false},addEventListener(){},click(){this.onclick?.()},getContext(...a){return canvas.getContext(...a)}};let html='';Object.defineProperty(obj,'innerHTML',{get:()=>html,set:v=>{html=v;for(let m of v.matchAll(/id="([^"]+)"/g))el(m[1]);}});elements.set(id,obj);return obj;}
global.document={hidden:false,getElementById:el,querySelector:selector=>selector==='.heroIdentity'?{querySelector:tag=>el('heroIdentity-'+tag)}:null,addEventListener:(k,f)=>(events[k]??=[]).push(f),createElement:()=>({click(){}})};global.window={addEventListener:(k,f)=>(windowEvents[k]??=[]).push(f),matchMedia:()=>({matches:reduced})};global.localStorage={getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v),get length(){return store.size},key:i=>[...store.keys()][i]};global.requestAnimationFrame=()=>{};global.setInterval=()=>0;global.setTimeout=(fn,ms)=>{let id=++timerId;timers.set(id,{fn,ms});return id};global.clearTimeout=id=>timers.delete(id);global.confirm=()=>true;
(async()=>{
 const E=await import('./dist/engine.js');const T=await import('./dist/equipment-templates.js');
 const expected=JSON.parse(require('fs').readFileSync('fixtures/set-names-approved-v093.json','utf8'));
 let checked=0;
 for(const race of ['dwarf','human','elf','goblin','ashen']){
  elements=new Map();events={};store=new Map();timers=new Map();windowEvents={};
  const s=E.fresh(race);s.gold=1000;s.consumables.reforgeToken=2;
  const templates=T.EQUIPMENT_TEMPLATES.filter(t=>t.kind==='set'&&t.originRace===race);
  for(const t of templates){const it=T.applyEquipmentTemplate({...E.item(t.slot,90,t.setId,3,{originRace:race}),templateId:undefined},t.id);s.inventory.push(it);}
  for(const slot of ['helm','armor','gloves','boots'])s.equip[slot]=s.inventory.find(it=>it.slot===slot).id;
  assert(E.validSave(s),race+' legal legacy template fixtures');const frozen=JSON.stringify(s);
  store.set(SAVE_KEY,frozen);await import('./dist/app.js?set-complete-v093-'+race);
  const click=(dataset={},id='')=>{const b={dataset,id};for(const f of events.click||[])f({target:{id,closest:()=>b}});};
  for(const it of s.inventory){const label=expected[it.templateId];assert(label);click({view:'inventory'});click({bagSlot:it.slot});click({item:it.id});assert(el('view').innerHTML.includes(label),race+' '+label);checked++;}
  const targets={dwarf:'dwarf_set_guard_armor',human:'human_blood_oath_gloves',elf:'elf_root_gloves',goblin:'goblin_spore_gloves',ashen:'ashen.prism.gloves'};
  const it=s.inventory.find(x=>x.templateId===targets[race]),label=expected[it.templateId];
  click({view:'forge'});click({forgetab:'modify'});click({modifyitem:it.id});click({modifymode:'all'});click({modifycommit:'1'});
  assert(el('view').innerHTML.split(label).length>=4,race+' paid preview title and both candidate sides');
  const state=JSON.parse(store.get(SAVE_KEY));assert(state.pendingReforge);assert(E.validSave(state));
  for(const original of s.inventory)assert.deepEqual(state.inventory.find(x=>x.id===original.id),original,'reforge preview does not rewrite historical equipment');
  elements=new Map();events={};windowEvents={};await import('./dist/app.js?set-complete-v093-reload-'+race);
  click({view:'forge'});click({forgetab:'modify'});assert(el('view').innerHTML.includes(label));
  const reloaded=JSON.parse(store.get(SAVE_KEY));assert.deepEqual(reloaded.pendingReforge,state.pendingReforge);assert(E.validSave(reloaded));
 }
 assert.equal(checked,60);
 console.log('PASS v093 actual App all 60 equipment names across five races, equipped/backpack/detail, five legacy paid reforge previews and reload identity preservation.');
})();
