const assert=require('node:assert/strict');
const {createCanvas}=require('@napi-rs/canvas');
let elements=new Map(),events={},windowEvents={},store=new Map(),failPrimary=false,serial=0;
function el(id){
 if(elements.has(id))return elements.get(id);
 const canvas=createCanvas(960,540),obj={id,style:{},classList:{add(){},remove(){}},open:false,showModal(){this.open=true},close(){this.open=false},addEventListener(){},click(){this.onclick?.()},getContext(...args){return canvas.getContext(...args)}};
 let html='';Object.defineProperty(obj,'innerHTML',{get:()=>html,set:value=>{html=value;for(const m of value.matchAll(/id="([^"]+)"/g))el(m[1]);}});elements.set(id,obj);return obj;
}
global.document={hidden:false,getElementById:el,addEventListener:(k,f)=>(events[k]??=[]).push(f),createElement:()=>({click(){}})};
global.window={addEventListener:(k,f)=>(windowEvents[k]??=[]).push(f),matchMedia:()=>({matches:true})};
global.localStorage={getItem:k=>store.get(k)||null,setItem:(k,v)=>{if(failPrimary&&k==='ashencrown-v2')throw Error('QuotaExceededError');store.set(k,v)},get length(){return store.size},key:i=>[...store.keys()][i]};
global.requestAnimationFrame=()=>{};global.setInterval=()=>0;global.setTimeout=()=>0;global.clearTimeout=()=>{};global.confirm=()=>true;
const click=(dataset={},id='')=>{const b={dataset,id};for(const f of events.click||[])f({target:{id,closest:()=>b}});};
const saved=()=>JSON.parse(store.get('ashencrown-v2'));
const economic=s=>({gold:s.gold,inventory:s.inventory,materials:s.materialStacks,potions:s.potionStacks,consumables:s.consumables,pending:s.pendingForgeClaim});
const flush=()=>{for(const f of windowEvents.pagehide||[])f();};
async function reload(){elements=new Map();events={};windowEvents={};await import('./dist/app.js?pending-forge-'+(++serial));}
(async()=>{
 const E=await import('./dist/engine.js'),originalRandom=Math.random;
 try{
 for(const inputs of [1,5]){
  store.clear();failPrimary=false;
  const fixture=E.fresh();fixture.bonusTalentPoints=30;fixture.testGrants={v081support:true};fixture.gold=1000;fixture.materialStacks['铁屑|0']=20;
  E.normalizeInventoryState(fixture);
  for(const category of ['equipment','items','materials'])assert(E.setLootFilter(fixture,category,[0,1,2,3]));
  for(const slot of E.SLOTS){while(E.bagCounts(fixture).equipment[slot]<50)fixture.inventory.push(E.item(slot,1,null,0));assert.equal(E.bagCounts(fixture).equipment[slot],50);}
  assert.equal(fixture.inventory.length,350,'equipped items count toward each bag; both rings share one bag');assert(E.validSave(fixture));
  store.set('ashencrown-v2',JSON.stringify(fixture));await reload();
  click({view:'forge'});for(let i=0;i<inputs;i++)click({material:'铁屑|0'});
  assert.equal((el('view').innerHTML.match(/orbitSlot filled/g)||[]).length,inputs);
  Math.random=()=>0;click({},'forgeBtn');
  const pending=saved(),candidate=pending.pendingForgeClaim?.item;
  assert(candidate,'full bag retains the actual crafted equipment');assert(candidate.divine);assert.equal(candidate.set,null);assert(candidate.id);assert(E.validSave(pending));
  assert.equal(pending.gold,960);assert.equal(pending.materialStacks['铁屑|0'],20-inputs);assert.deepEqual(pending.inventory,fixture.inventory);
  assert.equal(pending.pendingForgeClaim.kind,'equipment');assert(!pending.inventory.some(i=>i.id===candidate.id));
  assert.match(el('view').innerHTML,/data-forgeclaim="1"/);assert.match(el('view').innerHTML,/data-forgeresult=/);assert(!el('view').innerHTML.includes('is-forging'));
  click({forgeresult:candidate.id});assert(el('modal').open);assert.match(el('modalBody').innerHTML,/data-forgeclaim="1"/);assert.match(el('modalBody').innerHTML,/divineBadge/);assert(!/data-equip=/.test(el('modalBody').innerHTML),'unclaimed detail must not offer equip');
  el('closeModal').click();
  let rngCalls=0;Math.random=()=>{rngCalls++;return .99;};
  click({},'forgeBtn');click({forgecontinue:'1'});click({material:'铁屑|0'});click({},'forgeBtn');click({forgeclaim:'1'});
  assert.deepEqual(economic(saved()),economic(pending),'repeat forge and full claim neither charge nor discard candidate');assert.equal(rngCalls,0);
  await reload();click({view:'forge'});assert.equal(rngCalls,0,'refresh restores candidate without RNG');assert.deepEqual(saved().pendingForgeClaim.item,candidate);assert.deepEqual(economic(saved()),economic(pending));assert(el('view').innerHTML.includes(candidate.id));
  // Free exactly one appropriate space through the existing sell UI.
  const removable=saved().inventory.find(i=>i.slot===candidate.slot&&!Object.values(saved().equip).includes(i.id)&&!i.locked&&!E.isProtected(saved(),i.id));assert(removable);
  click({view:'inventory'});click({bagSlot:candidate.slot});click({sell:removable.id});
  const space=saved();assert.equal(E.bagCounts(space).equipment[candidate.slot],49);assert.equal(space.gold,960+E.sellValue(removable));assert.deepEqual(space.pendingForgeClaim.item,candidate);
  click({view:'forge'});click({forgeresult:candidate.id});
  failPrimary=true;click({forgeclaim:'1'});assert.deepEqual(economic(saved()),economic(space),'failed claim must leave stored pending/inventory untouched');assert(el('modal').open);
  failPrimary=false;flush();assert.deepEqual(economic(saved()),economic(space),'failed claim must not adopt its clone into live state');
  click({forgeclaim:'1'});const claimed=saved();assert(!claimed.pendingForgeClaim);assert.equal(claimed.gold,space.gold);assert.deepEqual(claimed.materialStacks,space.materialStacks);assert.equal(claimed.inventory.length,space.inventory.length+1);assert.deepEqual(claimed.inventory.find(i=>i.id===candidate.id),candidate,'claim preserves complete ID, stats, divine and set data');assert.equal(claimed.inventory.filter(i=>i.id===candidate.id).length,1);assert.equal(rngCalls,0);assert(E.validSave(claimed));assert(!el('modal').open);
  click({forgeclaim:'1'});assert.deepEqual(economic(saved()),economic(claimed),'double claim is a no-op');await reload();assert.deepEqual(economic(saved()),economic(claimed));assert.equal(rngCalls,0);
  Math.random=originalRandom;
 }
 // Supported potion types cannot currently fill 100 distinct stacks; use the valid per-stack cap.
 store.clear();const potionFixture=E.fresh();potionFixture.bonusTalentPoints=30;potionFixture.testGrants={v081support:true};potionFixture.gold=1000;potionFixture.materialStacks['灰根草|0']=20;E.normalizePotions(potionFixture);potionFixture.potionStacks['healing|0']=1e9;assert(E.setLootFilter(potionFixture,'items',[0,1,2,3]));assert(E.validSave(potionFixture));store.set('ashencrown-v2',JSON.stringify(potionFixture));await reload();click({view:'forge'});click({material:'灰根草|0'});Math.random=()=>0;click({},'forgeBtn');
 const brewed=saved(),potion=brewed.pendingForgeClaim?.potion;assert.equal(brewed.pendingForgeClaim?.kind,'potion');assert.equal(brewed.gold,960);assert.equal(brewed.materialStacks['灰根草|0'],19);assert.equal(brewed.potionStacks['healing|0'],1e9);assert(E.validSave(brewed));click({forgeresult:'potion'});assert.match(el('modalBody').innerHTML,/data-forgeclaim=/);assert(!/data-potionselect=/.test(el('modalBody').innerHTML));
 let potionRng=0;Math.random=()=>{potionRng++;return .9;};click({forgeclaim:'1'});click({},'forgeBtn');assert.deepEqual(economic(saved()),economic(brewed));await reload();click({view:'forge'});assert.deepEqual(saved().pendingForgeClaim.potion,potion);assert.equal(potionRng,0);
 const potionSpace=saved();potionSpace.potionStacks[potion.key]--;assert(E.validSave(potionSpace));store.set('ashencrown-v2',JSON.stringify(potionSpace));await reload();click({view:'forge'});failPrimary=true;click({forgeclaim:'1'});assert.deepEqual(economic(saved()),economic(potionSpace));failPrimary=false;flush();assert.deepEqual(economic(saved()),economic(potionSpace));click({forgeclaim:'1'});const potionClaimed=saved();assert(!potionClaimed.pendingForgeClaim);assert.equal(potionClaimed.potionStacks[potion.key],1e9);assert.equal(potionClaimed.gold,potionSpace.gold);assert.deepEqual(potionClaimed.materialStacks,potionSpace.materialStacks);assert(E.validSave(potionClaimed));click({forgeclaim:'1'});assert.deepEqual(economic(saved()),economic(potionClaimed));assert.equal(potionRng,0);
 console.log('Pending forge UI: 1/5 inputs, seven full bags, all loot filters bypassed, actual divine/nonset outcome preserved, single spend, blocked reforge/full claim, no-RNG reload, no premature equip, sell space, failed-save non-adoption, retry and exact-once claim; potion capacity/pending/reload/rollback/claim: PASS');
 }finally{Math.random=originalRandom;}
})().catch(error=>{console.error(error);process.exitCode=1;});
