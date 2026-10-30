const assert=require('assert/strict');const {createCanvas}=require('@napi-rs/canvas');let elements=new Map(),events={},store=new Map(),timers=new Map(),timerId=0,reduced=false,windowEvents={},failPrimary=false,failRemove=false,failRead=false,confirmAnswer=true,confirmCalls=0;
function el(id){if(elements.has(id))return elements.get(id);const canvas=createCanvas(960,540);const obj={id,style:{},classList:{add(){},remove(){}},open:false,showModal(){this.open=true},close(){this.open=false},addEventListener(){},click(){this.onclick?.()},getContext(...a){return canvas.getContext(...a)}};let html='';Object.defineProperty(obj,'innerHTML',{get:()=>html,set:v=>{html=v;for(let m of v.matchAll(/id="([^"]+)"/g))el(m[1]);}});elements.set(id,obj);return obj;}
global.document={hidden:false,getElementById:el,querySelector:selector=>selector==='.heroIdentity'?{querySelector:tag=>el('heroIdentity-'+tag)}:null,addEventListener:(k,f)=>(events[k]??=[]).push(f),createElement:()=>({click(){}})};global.window={addEventListener:(k,f)=>(windowEvents[k]??=[]).push(f),matchMedia:()=>({matches:reduced})};global.localStorage={getItem:k=>{if(failRead)throw Error('read denied');return store.get(k)||null},setItem:(k,v)=>{if(failPrimary&&k==='ashencrown-v6')throw new Error('QuotaExceededError');store.set(k,v)},removeItem:k=>{if(failRemove&&k==='ashencrown-v1'){failRemove=false,failRead=false;throw Error('denied remove')}store.delete(k)},get length(){return store.size},key:i=>[...store.keys()][i]};global.requestAnimationFrame=()=>{};global.setInterval=()=>0;global.setTimeout=(fn,ms)=>{let id=++timerId;timers.set(id,{fn,ms});return id};global.clearTimeout=id=>timers.delete(id);global.confirm=()=>{confirmCalls++;return confirmAnswer;};

(async()=>{
 const E=await import('./dist/engine.js'),{reachStoryScene}=await import('./story-event-test-fixture.mjs');
 const current=E.fresh('dwarf');current.gold=147;store.set('ashencrown-v6',JSON.stringify(current));
 await import('./dist/app.js?healing-stone-import');
 const saved=()=>JSON.parse(store.get('ashencrown-v6')),flush=()=>{for(const f of windowEvents.pagehide||[])f();};
 const incoming=reachStoryScene('human','END.H01.human',{spring:'skip',finishTarget:true});
 delete incoming.otherworld;delete incoming.learnedRecipes;incoming.gold=391;
 assert(E.validSave(incoming));const input=JSON.stringify(incoming);
 el('settingsBtn').onclick();const original=store.get('ashencrown-v6');
 failPrimary=true;await el('importFile').onchange({target:{files:[{text:async()=>input}]}});
 assert.equal(store.get('ashencrown-v6'),original);assert.match(el('toast').textContent,/导入未完成/);
 failPrimary=false;flush();assert.equal(saved().race,'dwarf');assert.equal(saved().gold,147);assert(!saved().otherworld?.stoneGranted);
 let writes=0;const write=localStorage.setItem;localStorage.setItem=(k,v)=>{writes++;write(k,v)};
 await el('importFile').onchange({target:{files:[{text:async()=>input}]}});
 assert.equal(writes,1,'both defaults persist together before adoption');
 assert.equal(saved().race,'human');assert.equal(saved().gold,391);assert(saved().otherworld.stoneGranted);assert(!saved().otherworld.stoneUsed);assert(E.recipeKnown(saved(),'potion-healing'));assert.deepEqual(saved().inventory,incoming.inventory);assert.deepEqual(saved().materialStacks,incoming.materialStacks);assert.equal(saved().xp,incoming.xp);assert(E.validSave(saved()));
 assert.match(el('toast').textContent,/存档已导入/);assert.match(el('view').innerHTML,/data-otherworld="open"/);const button={dataset:{view:'inventory'}};for(const f of events.click||[])f({target:{closest:()=>button}});assert.match(el('view').innerHTML,/异界之石 ×1/,'stone is visible immediately, without reload');
 localStorage.setItem=write;const imported=saved();flush();assert(saved().otherworld.stoneGranted);assert(E.recipeKnown(saved(),'potion-healing'));assert.equal(saved().gold,imported.gold);
 assert.equal(JSON.stringify(incoming),input,'source fixture is not mutated');
 console.log('PASS actual App import: canonical ending + missing healing/stone reconciled in one write, immediate stone UI, quota retains current game/storage, no economy grants, no reload required.');
})().catch(e=>{console.error(e);process.exitCode=1});
