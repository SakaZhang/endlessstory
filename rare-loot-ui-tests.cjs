if(!process.argv[2]){const {execFileSync}=require('node:child_process');for(const mode of ['normal','full','failure','old','running'])execFileSync(process.execPath,[__filename,mode],{stdio:'inherit'});process.exit(0);}
// Use the current production save key; retired-generation behavior has dedicated tests.
const {SAVE_KEY}=require('./dist/save-generation.js');
const assert=require('assert/strict');const {createCanvas}=require('@napi-rs/canvas');let elements=new Map(),events={},store=new Map(),timers=new Map(),timerId=0,reduced=false,failPrimary=false;
function el(id){if(elements.has(id))return elements.get(id);const canvas=createCanvas(960,540);const obj={id,style:{},classList:{add(){},remove(){}},open:false,showModal(){this.open=true},close(){this.open=false},addEventListener(){},click(){this.onclick?.()},getContext(...a){return canvas.getContext(...a)}};let html='';Object.defineProperty(obj,'innerHTML',{get:()=>html,set:v=>{html=v;for(let m of v.matchAll(/id="([^"]+)"/g))el(m[1]);}});elements.set(id,obj);return obj;}
global.document={hidden:false,getElementById:el,querySelector:selector=>selector==='.heroIdentity'?{querySelector:tag=>el('heroIdentity-'+tag)}:null,addEventListener:(k,f)=>(events[k]??=[]).push(f),createElement:()=>({click(){}})};global.window={addEventListener(){},matchMedia:()=>({matches:reduced})};global.localStorage={getItem:k=>store.get(k)||null,setItem:(k,v)=>{if(failPrimary&&k===SAVE_KEY)throw Error("QuotaExceededError");store.set(k,v)},get length(){return store.size},key:i=>[...store.keys()][i]};global.requestAnimationFrame=()=>{};global.setInterval=()=>0;global.setTimeout=(fn,ms)=>{let id=++timerId;timers.set(id,{fn,ms});return id};global.clearTimeout=id=>timers.delete(id);global.confirm=()=>true;
(async()=>{
 require('./m2-ui-test-fixture.cjs').installM2UiFixture();
 const E=await import('./dist/engine.js'),UI=await import('./dist/rare-loot-ui.js');
 const base=E.fresh(),mode=process.argv[2];base.running=mode==='running';base.nextBattleAt=Date.now()+1000000;
 const reward=E.item('gloves',10,E.BUILD[0].id,3);
 if(mode!=='old')base.rareRewardProgress={version:1,dungeonDryStreak:19,fruitProgress:17,pendingSets:[reward],pendingFruit:2};
 if(mode==='full')while(base.inventory.filter(x=>x.slot==='gloves').length<50)base.inventory.push(E.item('gloves',1,null,0));
 E.setLootFilter(base,"equipment",[3]);
 assert(E.validSave(base),'test save must be valid');
 const pure=structuredClone(base);pure.talents.luck=21;const snap=JSON.stringify(pure),oldRandom=Math.random;Math.random=()=>{throw Error('UI must not roll')};
 const html=UI.renderLuckRates(pure)+UI.renderRareLootProgress(pure);Math.random=oldRandom;
 assert.equal(JSON.stringify(pure),snap);assert.match(html,/9.2923%/);assert.match(html,/13.9385%/);assert.match(html,/不是掉率增加 21%/);
 store.set(SAVE_KEY,JSON.stringify(base));await import('./dist/app.js');
 const saved=()=>JSON.parse(store.get(SAVE_KEY)),click=(dataset={})=>{const b={dataset,id:''};for(const f of events.click||[])f({target:{id:'',closest:()=>b}})};
 click({view:'inventory'});assert.match(el('view').innerHTML,/珍稀战利品/);assert.match(el('view').innerHTML,/幸运与实际概率/);const inventoryHtml=el('view').innerHTML,strip=inventoryHtml.split('<details>')[0];assert(!/套装未出|果实进度|回忆之果|19\s*\/\s*20|17\s*\/\s*20/.test(inventoryHtml));assert.match(strip,/灵慧之果/);assert.match(strip,/待领：/);assert.match(inventoryHtml,/<details><summary>掉落规则与幸运实际概率<\/summary>/);assert(!/<details[^>]*\bopen\b/.test(inventoryHtml));if(mode!=='old')assert.match(strip,/data-rare-loot-claim/);
 el('talentBtn').click();assert.match(el('modalBody').innerHTML,/灵慧之果/);assert(!/果实进度|连续.*未获套装|再通关|必得套装/.test(el('modalBody').innerHTML));el('modal').close();
 el('helpBtn').click();assert.match(el('modalBody').innerHTML,/最多结算4小时/);assert.match(el('modalBody').innerHTML,/独立掉落/);assert(!/果实进度|连续20|每20点/.test(el('modalBody').innerHTML));el('modal').close();
 const before=saved();
 if(mode==='old'){assert.equal(before.rareRewardProgress,undefined);click({rareLootClaim:'1'});assert.equal(saved().rareRewardProgress,undefined);}
 else{
  assert.match(el('view').innerHTML,/data-rare-loot-claim/);
  if(mode==='failure'){failPrimary=true;click({rareLootClaim:'1'});failPrimary=false;assert.deepEqual(saved().rareRewardProgress,before.rareRewardProgress);assert.deepEqual(saved().inventory,before.inventory);assert.match(el('saveStatus').textContent,/保存失败/);}
  click({rareLootClaim:'1'});const once=saved();assert.equal(once.running,before.running);if(mode==='running')assert.equal(once.running,true);assert.equal(once.consumables.memoryFruit,(before.consumables.memoryFruit||0)+2);assert.equal(once.rareRewardProgress.pendingFruit,0);
  if(mode==='full'){assert.deepEqual(once.rareRewardProgress.pendingSets,[reward]);assert(!once.inventory.some(x=>x.id===reward.id));}
  else{assert.equal(once.rareRewardProgress.pendingSets.length,0);assert.deepEqual(once.inventory.find(x=>x.id===reward.id),reward);}
  click({rareLootClaim:'1'});assert.deepEqual(saved().inventory,once.inventory);assert.deepEqual(saved().consumables,once.consumables);assert.deepEqual(saved().rareRewardProgress,once.rareRewardProgress);assert(E.validSave(saved()));
 }
 console.log('PASS rare loot UI '+mode+': hidden counters, visible pending claims, read-only probability, protected transactional claim and repeat safety');
})().catch(e=>{console.error(e);process.exitCode=1});
