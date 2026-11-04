if(!process.argv[2]){const {execFileSync}=require('node:child_process');for(const mode of ['rest','battle','full','goldcap'])execFileSync(process.execPath,[__filename,mode],{stdio:'inherit'});process.exit(0);}
const {SAVE_KEY}=require('./dist/save-generation.js');
const assert=require('assert/strict'),{createCanvas}=require('@napi-rs/canvas');
const elements=new Map(),events={},store=new Map(),timers=new Map();let timerId=0,failPrimary=false,failWrites=0,failedCandidate=null,reenter=false,reentered=false;
function el(id){if(elements.has(id))return elements.get(id);const canvas=createCanvas(960,540),obj={id,style:{},classList:{add(){},remove(){}},open:false,showModal(){this.open=true;},close(){this.open=false;},addEventListener(){},click(){this.onclick?.();},getContext(...a){return canvas.getContext(...a);}};let html='';Object.defineProperty(obj,'innerHTML',{get:()=>html,set:v=>{html=v;for(const m of v.matchAll(/id="([^"]+)"/g))el(m[1]);}});elements.set(id,obj);return obj;}
global.document={hidden:false,getElementById:el,querySelector:s=>s==='.heroIdentity'?{querySelector:t=>el('heroIdentity-'+t)}:null,addEventListener:(k,f)=>(events[k]??=[]).push(f),createElement:()=>({click(){}})};
global.window={addEventListener(){},matchMedia:()=>({matches:true})};
global.localStorage={getItem:k=>store.get(k)??null,setItem:(k,v)=>{if(k===SAVE_KEY){if(failPrimary&&++failWrites===1){failedCandidate=JSON.parse(v);throw Error('QuotaExceededError');}if(reenter&&!reentered){reentered=true;el('redeemCodeSubmit').click();}}store.set(k,v);},removeItem:k=>store.delete(k),get length(){return store.size;},key:i=>[...store.keys()][i]};
global.requestAnimationFrame=()=>{};global.setInterval=()=>0;global.setTimeout=(fn,ms)=>{const id=++timerId;timers.set(id,{fn,ms});return id;};global.clearTimeout=id=>timers.delete(id);global.confirm=()=>true;
(async()=>{
 const E=await import('./dist/engine.js'),{createLegendaryEquipment}=await import('./dist/legendary-equipment.js');
 const mode=process.argv[2],now=Date.now();Date.now=()=>now;
 const base=E.fresh();delete base.codexCollection;delete base.casino;E.ensureMerchant(base,now);
 if(mode==='full')base.inventory=Array.from({length:50},(_,i)=>createLegendaryEquipment({id:'filled-'+i,legendaryId:'lucky-dice',level:1,baseLevel:1,levelSource:'generated'}));
 if(mode==='goldcap')base.gold=1e12-100000;
 if(mode==='battle')assert(E.startRoutedEncounter(base,now));else E.startRest(base,now);
 assert(E.validSave(base));store.set(SAVE_KEY,JSON.stringify(base));await import('./dist/app.js?redeem-extra-'+mode);
 const saved=()=>JSON.parse(store.get(SAVE_KEY)),open=()=>{el('settingsBtn').click();el('redeemCodeOpen').click();},submit=code=>{el('redeemCodeInput').value=code;el('redeemCodeSubmit').click();};
 open();const html=el('modalBody').innerHTML;for(const code of ['GOLD100K','LUCKYDICE','INFINITY5'])assert(html.includes(code));assert.match(html,/可重复领取，不限次数/);assert.match(html,/等级与当前角色等级相同/);
 const unchanged=saved();submit('<img src=x onerror=alert(1)>');assert.match(el('redeemCodeResult').textContent,/无效/);assert.deepEqual(saved(),unchanged);
 if(mode==='goldcap'){
  submit('GOLD100K');assert.equal(saved().gold,1e12);assert.match(el('redeemCodeResult').textContent,/兑换成功.*100000金币/);const full=saved();submit('GOLD100K');assert.match(el('redeemCodeResult').textContent,/金币将超过上限/);assert.deepEqual(saved(),full);
 }else{
  for(const code of mode==='full'?['GOLD100K']:['GOLD100K','LUCKYDICE']){
   const before=saved(),gold=code==='GOLD100K'?100000:0,equipment=code==='LUCKYDICE'?1:0;
   failPrimary=true;failWrites=0;submit('  '+code.toLowerCase()+'\n');failPrimary=false;
   assert.equal(failWrites,1);assert.match(el('redeemCodeResult').textContent,/保存失败.*奖励未发放/);assert.deepEqual(saved(),before);assert(E.validSave(failedCandidate));assert.equal(el('redeemCodeSubmit').disabled,false);
   el('closeModal').click();open();submit(code);assert.match(el('redeemCodeResult').textContent,/兑换成功/);
   assert.equal(saved().gold,before.gold+gold);assert.equal(saved().inventory.length,before.inventory.length+equipment,'failed write did not leak into retry');
   reenter=true;reentered=false;submit(code);reenter=false;assert(reentered,'forced nested click exercised');
   assert.equal(saved().gold,before.gold+2*gold);assert.equal(saved().inventory.length,before.inventory.length+2*equipment,'busy guard prevents nested grant');
   for(let n=0;n<5;n++)submit(code);
   const after=saved();assert.equal(after.gold,before.gold+7*gold);assert.equal(after.inventory.length,before.inventory.length+7*equipment);assert.equal(new Set(after.inventory.map(it=>it.id)).size,after.inventory.length);
   assert.equal(el('gold').textContent,after.gold.toLocaleString(),'gold HUD refreshes immediately');assert.equal(el('redeemCodeSubmit').disabled,false);assert(E.validSave(after));
   for(const key of ['restUntil','restResume','running','heroHp','lastHealthClock','activeEncounter','equip','infinityGauntlet'])assert.deepEqual(after[key],before[key],key+' unchanged');
   if(equipment){assert(after.inventory.filter(it=>it.legendaryId==='lucky-dice').every(it=>it.level===after.level&&it.levelSource==='generated'));assert(after.codexCollection.legendaries.includes('lucky-dice'));assert.match(el('redeemCodeResult').textContent,/幸运骰子（传说项链，Lv.1）×1/);}
  }
 }
 if(mode==='full'){const before=saved();submit('LUCKYDICE');assert.match(el('redeemCodeResult').textContent,/项链背包或装备总容量已满/);assert.deepEqual(saved(),before);}
 const beforeReload=saved(),{loadProgress}=await import('./dist/storage.js'),reload=loadProgress(localStorage);assert(!reload.blocked);assert.equal(reload.game.gold,beforeReload.gold);assert.deepEqual(reload.game.inventory,beforeReload.inventory);
 el('closeModal').click();open();el('redeemCodeInput').value=mode==='goldcap'?'LUCKYDICE':'GOLD100K';
 const external=saved();external.gold+=mode==='goldcap'?-1:1;store.set(SAVE_KEY,JSON.stringify(external));el('redeemCodeSubmit').click();assert.deepEqual(saved(),external,'stale browser tab cannot issue either reward');
 console.log('PASS '+mode+' real App extra codes: clear repeatable copy, normalization, quota failure and reopened retry, nested/rapid clicks, canonical Dice, immediate gold HUD, caps, state preservation, reload and stale storage.');
})().catch(e=>{console.error(e);process.exitCode=1;});
