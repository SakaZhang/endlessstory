const assert=require('assert/strict');const {createCanvas}=require('@napi-rs/canvas');
let SAVE_KEY;let elements=new Map(),events={},windowEvents={},intervals=[],store=new Map(),failWrite=false,now=Date.now(),serial=0;
function el(id){if(elements.has(id))return elements.get(id);const canvas=createCanvas(960,540),listeners={};const obj={id,width:960,height:540,style:{},listeners,classList:{add(){},remove(){}},open:false,showModal(){this.open=true},close(){this.open=false},addEventListener(k,f){(listeners[k]??=[]).push(f);},removeEventListener(k,f){listeners[k]=(listeners[k]??[]).filter(x=>x!==f);},contains:n=>n?.owner===id,click(){this.onclick?.()},getContext:(...a)=>canvas.getContext(...a),getBoundingClientRect:()=>({left:0,top:0,width:960,height:420}),querySelector(selector){return selector.includes('canvas')?el('adjacentCanvas'):null;},querySelectorAll(selector){if(selector!=='.skillSlot')return [];return this.slots??[];}};let html='';Object.defineProperty(obj,'innerHTML',{get:()=>html,set:v=>{html=String(v);for(const m of html.matchAll(/id="([^"]+)"/g))el(m[1]);if(id==='view')obj.slots=Array.from({length:(html.match(/class="skillSlot /g)||[]).length},(_,i)=>({owner:id,dataset:{},index:i}));}});elements.set(id,obj);return obj;}
function install(){global.document={hidden:false,getElementById:el,querySelector:selector=>selector==='.heroIdentity'?{querySelector:tag=>el('heroIdentity-'+tag)}:null,addEventListener:(k,f)=>(events[k]??=[]).push(f),createElement:()=>({click(){}})};global.window={addEventListener:(k,f)=>(windowEvents[k]??=[]).push(f),matchMedia:()=>({matches:true})};global.localStorage={getItem:k=>store.get(k)||null,setItem(k,v){if(failWrite)throw Error('quota');store.set(k,String(v));},get length(){return store.size},key:i=>[...store.keys()][i]};global.requestAnimationFrame=()=>{};global.setInterval=(fn,ms)=>{intervals.push({fn,ms});return intervals.length};global.setTimeout=()=>++serial;global.clearTimeout=()=>{};global.confirm=()=>true;}
const click=(dataset={},id='')=>{const b={dataset,id};for(const fn of events.click??[])fn({target:{id,closest:()=>b}});};const saved=()=>JSON.parse(store.get(SAVE_KEY));const tick=()=>{now+=1100;for(const x of intervals.filter(x=>x.ms===250))x.fn();};const periodic=()=>{for(const x of intervals.filter(x=>x.ms===10000))x.fn();};const refresh=async label=>{elements=new Map();events={};windowEvents={};intervals=[];install();await import('./dist/app.js?multi-app-'+label);};
function assertBalanceOnly(before,{gold=0,charges=0,extra=0}={}){
 const expected=structuredClone(before);expected.lastSeen=now;expected.gold+=gold;
 if(charges)expected.consumables.bossChallengeCharges=(expected.consumables.bossChallengeCharges??0)+charges;
 if(extra)expected.extraBossChallenges=(expected.extraBossChallenges??0)+extra;
 assert.deepEqual(saved(),expected,'purchase/use preserves combat, HP, timers, cooldowns, retry wait, route, location and pause state');
}
function assertUseEnabled(){assert.match(el('view').innerHTML,/data-use-boss-challenge="1"/);assert.doesNotMatch(el('view').innerHTML,/data-use-boss-challenge="1"[^>]*disabled/);assert.doesNotMatch(el('view').innerHTML,/本场战斗结束后可使用挑战令|暂停战斗仍需等待结束/);}
(async()=>{({SAVE_KEY}=await import('./dist/save-generation.js'));const E=await import('./dist/engine.js'),origNow=Date.now;Date.now=()=>now;
const base=E.fresh('human');base.gold=3000;store.set(SAVE_KEY,JSON.stringify(base));await refresh('boss-item');click({view:'merchant'});
assert.match(el('view').innerHTML,/常驻补给 · 不占随机8个货位/);assert.match(el('view').innerHTML,/购买1件 · 1000金币/);assert.equal(saved().merchant.offers.length,8);const merchant=structuredClone(saved().merchant),before=saved();
failWrite=true;click({buyBossChallenge:'1'});failWrite=false;assert.deepEqual(saved(),before,'failed save never spends gold or grants charges');
click({buyBossChallenge:'1'});assert.equal(saved().gold,2000,'human pays exact flat 1000');assert.equal(saved().consumables.bossChallengeCharges,3);assert.deepEqual(saved().merchant,merchant);assert(!saved().activeEncounter);click({buyBossChallenge:'1'});assert.equal(saved().gold,2000,'double click guarded');
now+=500;click({view:'inventory'});click({bagTab:'items'});assert.match(el('view').innerHTML,/剩余可用 3 次/);const preUse=saved();failWrite=true;click({useBossChallenge:'1'});failWrite=false;assert.deepEqual(saved(),preUse);click({useBossChallenge:'1'});assert.equal(saved().consumables.bossChallengeCharges,2);assert.equal(saved().extraBossChallenges,1);assert(!saved().activeEncounter);click({useBossChallenge:'1'});assert.equal(saved().extraBossChallenges,1);assert.match(el('view').innerHTML,/剩余可用 2 次/);assert.match(el('view').innerHTML,/额外挑战 1 次/);
now+=500;await refresh('boss-item-reload');click({view:'inventory'});click({bagTab:'items'});assert.match(el('view').innerHTML,/剩余可用 2 次/);assert.equal(saved().extraBossChallenges,1);click({useBossChallenge:'1'});assert.equal(saved().extraBossChallenges,2);assert.equal(saved().consumables.bossChallengeCharges,1);
// Buy and use directly at the merchant without traveling or stopping a real fight.
for(const paused of [false,true]){
 now+=500;const combat=E.fresh('human');combat.gold=3000;E.normalizeExpedition(combat);E.normalizeHealth(combat,now);
 const encounter=E.startInstanceEncounter(combat,'human.a01.field',now);assert(encounter&&!encounter.done);
 combat.instanceCooldowns['dwarf.a03.boss']=now+1800000;combat.autoBossRetryAt={'dwarf.a03.boss':now+900000};combat.stopAfterBattle=true;
 if(paused)assert(E.setMultiPaused(combat,true,now));assert(E.validSave(combat));
 store.set(SAVE_KEY,JSON.stringify(combat));await refresh('boss-item-merchant-'+(paused?'paused':'running'));click({view:'merchant'});
 assert.equal(saved().activeEncounter.id,encounter.id);assert.equal(saved().running,!paused);assert.equal(saved().activeEncounter.pauseAt!==undefined,paused);
 assert.match(el('view').innerHTML,/可在游商处直接使用/);assert.match(el('view').innerHTML,/data-use-boss-challenge="1"[^>]*disabled/);
 const beforeBuy=saved();failWrite=true;click({buyBossChallenge:'1'});failWrite=false;assert.deepEqual(saved(),beforeBuy,'quota failure cannot stop or alter the fight or charge gold');
 click({buyBossChallenge:'1'});assertBalanceOnly(beforeBuy,{gold:-1000,charges:3});const afterBuy=saved();
 click({buyBossChallenge:'1'});click({useBossChallenge:'1'});assert.deepEqual(saved(),afterBuy,'same 400ms guard covers purchase and immediate duplicate use');
 now+=399;click({useBossChallenge:'1'});assert.deepEqual(saved(),afterBuy);now+=1;click({view:'merchant'});assertUseEnabled();
 // Rendering settles the general health clock; persist that pre-action baseline separately.
 periodic();
 const beforeUse=saved();failWrite=true;click({useBossChallenge:'1'});failWrite=false;assert.deepEqual(saved(),beforeUse,'quota failure cannot consume charges or bank attempts');
 click({useBossChallenge:'1'});assertBalanceOnly(beforeUse,{charges:-1,extra:1});const afterUse=saved();
 click({useBossChallenge:'1'});assert.deepEqual(saved(),afterUse,'duplicate activation is guarded during both running and paused combat');
 now+=400;click({view:'inventory'});click({bagTab:'items'});assertUseEnabled();assert.equal(saved().siteId,'human.a01','banked attempt stays global, no travel to a boss region');
 const {renderBossChallengeItem}=await import('./dist/boss-challenge-ui.js');
 assert.match(renderBossChallengeItem(saved(),{shop:true,locked:true}),/data-use-boss-challenge="1"[^>]*disabled/);
 assert.match(renderBossChallengeItem({...saved(),extraBossChallenges:E.MAX_BOSS_CHALLENGES},{shop:true}),/data-use-boss-challenge="1"[^>]*disabled/);
}
// The HUD challenge target and its free/cooling label both use actual location,
// never the first race sharing its area number, a browsed map or a fallback dropdown.
const races=['human','dwarf','elf','goblin','ashen'];
for(const race of races){
 const prototype=E.fresh(race);E.normalizeExpedition(prototype);
 const bosses=E.plannedNodes(prototype,now).filter(n=>n.kind==='boss'&&n.enabled&&n.siteId.startsWith(race+'.'));
 assert(bosses.length>0,'cover boss-bearing areas for every race');if(race==='human')assert(bosses.some(n=>n.siteId==='human.a10'),'cover the reported area-10 HUD bug');
 for(const boss of bosses)for(const cooling of [false,true]){
  now+=500;const local=E.fresh(race);E.normalizeExpedition(local);E.normalizeHealth(local,now);
  for(const r of races)local.areaProgress[r]={unlocked:[1,2,3,4,5,6,7,8,9,10],cleared:[1,2,3,4,5,6,7,8,9]};
  assert(E.travelToArea(local,boss.siteId,now));local.extraBossChallenges=3;
  // Foreign cooldowns deliberately disagree with the real site's status.
  for(const n of E.plannedNodes(local,now).filter(n=>n.kind==='boss'))local.instanceCooldowns[n.id]=n.id===boss.id?(cooling?now+1800000:0):(cooling?0:now+1800000);
  store.set(SAVE_KEY,JSON.stringify(local));await refresh('boss-hud-'+boss.id+'-'+cooling);
  const foreignRace=races.find(r=>r!==race),foreignSite=foreignRace+(boss.areaNumber===10?'.a06':'.a10');
  click({monsterSource:foreignSite+'.field'});assert.equal(saved().siteId,boss.siteId,'foreign map preview does not travel');click({view:'battle'});
  if(boss.areaNumber===10){
   for(const handler of events.change??[])handler({target:{id:'fallbackField',value:foreignSite+'.field',dataset:{}}});
   assert.equal(saved().siteId,boss.siteId,'fallback dropdown changes a route, not actual location');
   assert.equal(saved().expedition.fieldId,foreignSite+'.field','exercise a genuinely foreign configured route');
  }
  assert.equal(el('bossBtn').hidden,false);assert.equal(el('bossBtn').disabled,false);
  assert.equal(el('bossBtn').textContent,cooling?'挑战首领 · 消耗1次额外挑战':'挑战首领 · 免费');
  const beforeHud=saved();click({},'bossBtn');const started=saved();
  assert.equal(started.activeEncounter?.instanceId,boss.id,'HUD starts only the actual current site boss');
  assert.equal(started.siteId,boss.siteId,'HUD challenge never teleports across races or areas');assert.equal(started.location,beforeHud.location);
  assert.equal(started.extraBossChallenges,cooling?2:3,'only a new cooling local challenge spends one attempt');assert.deepEqual(started.instanceCooldowns,beforeHud.instanceCooldowns);
  click({},'bossBtn');assert.equal(saved().activeEncounter.id,started.activeEncounter.id);assert.equal(saved().extraBossChallenges,started.extraBossChallenges,'repeated HUD challenge does not create/debit another fight');
 }
}
for(const [kind,race,site] of [['no-boss','human','human.a01'],['no-boss','goblin','goblin.a10'],['locked','human','human.a10']]){
 now+=500;const rejected=E.fresh(race);E.normalizeExpedition(rejected);E.normalizeHealth(rejected,now);rejected.restResume=false;rejected.extraBossChallenges=3;
 rejected.siteId=site;rejected.location=Number(site.slice(-2))-1;rejected.expedition.fieldId=site+'.field';
 if(race==='goblin')rejected.areaProgress.goblin={unlocked:[1,2,3,4,5,6,7,8,9,10],cleared:[1,2,3,4,5,6,7,8,9]};
 assert(E.validSave(rejected));store.set(SAVE_KEY,JSON.stringify(rejected));await refresh('boss-hud-'+kind+'-'+site);
 click({monsterSource:'dwarf.a10.boss'});click({view:'battle'});
 assert.equal(el('bossBtn').hidden,kind==='no-boss');assert.equal(el('bossBtn').disabled,true);
 const blocked=saved();click({},'bossBtn');assert.deepEqual(saved(),blocked,'forged '+kind+' HUD click cannot travel, create combat or spend attempts');
}
// Local cooling boss is selectable with credit; foreign preview cannot spend it.
let regionBase=E.fresh();E.normalizeExpedition(regionBase);E.normalizeHealth(regionBase,now);regionBase.areaProgress.dwarf={unlocked:[1,2,3],cleared:[1,2]};assert(E.travelToArea(regionBase,'dwarf.a03',now));regionBase.extraBossChallenges=2;regionBase.consumables.bossChallengeCharges=2;regionBase.instanceCooldowns['dwarf.a03.boss']=now+30000;regionBase.autoBossRetryAt={'dwarf.a03.boss':now+1800000};store.set(SAVE_KEY,JSON.stringify(regionBase));await refresh('boss-item-region');click({race:'dwarf'});
const region=async(action,id='')=>{const b={owner:'adjacentRegionHost',dataset:{regionAction:action,regionId:id},disabled:false,focus(){}};for(const f of [...el('adjacentRegionHost').listeners.click??[]])await f({target:{closest:()=>b}});};
await region('node','dwarf.a03.boss');let html=el('adjacentRegionHost').innerHTML;assert.match(html,/挑战首领 · 消耗1次额外挑战/);assert.doesNotMatch(html,/data-region-action="confirm" data-region-id="dwarf.a03.boss" disabled/);assert.match(html,/额外挑战不能跳过这段战败重试等待/);assert.match(html,/本地首领重试等待：30分钟/);const preStart=saved();failWrite=true;await region('confirm','dwarf.a03.boss');failWrite=false;assert.deepEqual(saved(),preStart);await region('confirm','dwarf.a03.boss');assert.equal(saved().extraBossChallenges,1);assert.equal(saved().activeEncounter?.instanceId,'dwarf.a03.boss');
click({view:'inventory'});click({bagTab:'items'});assertUseEnabled();const inBattle=saved();click({useBossChallenge:'1'});assertBalanceOnly(inBattle,{charges:-1,extra:1});
const {buildRegionSnapshot,buildRegionModel,renderRegion}=await import('./dist/adjacent-region.js');regionBase.siteId='dwarf.a01';regionBase.expedition.fieldId='dwarf.a01.field';let snapshot=buildRegionSnapshot(regionBase,now),model=buildRegionModel(snapshot,{viewAreaId:'dwarf.a03',previewNodeId:'dwarf.a03.boss'});assert.match(model.preview.blocked,/先旅行至该区域/);regionBase.siteId='dwarf.a03';regionBase.instanceCooldowns['dwarf.a03.boss']=now;model=buildRegionModel(buildRegionSnapshot(regionBase,now),{viewAreaId:'dwarf.a03',previewNodeId:'dwarf.a03.boss'});assert.equal(model.preview.cooldownSeconds,0);assert.match(renderRegion(model),/自然冷却已结束，本次免费，不扣额外挑战/);Date.now=origNow;console.log('Boss item app UI PASS: flat human price, persisted charges/credits, save failures, exact 400ms click guards, reload, no autostart, unchanged 8-slot shop, local/foreign CD gating, real start deduction, running/paused merchant purchase and balance-only activation, quota recovery, five-race local HUD targets/free-cooling debit, foreign previews/dropdowns and locked/no-boss rejection, auto retry copy.');})();
