const assert=require('assert/strict');const {createCanvas}=require('@napi-rs/canvas');
let SAVE_KEY;let elements=new Map(),events={},windowEvents={},intervals=[],store=new Map(),failWrite=false,now=Date.now(),serial=0;
function el(id){if(elements.has(id))return elements.get(id);const canvas=createCanvas(960,540),listeners={};const obj={id,width:960,height:540,style:{},listeners,classList:{add(){},remove(){}},open:false,showModal(){this.open=true},close(){this.open=false},addEventListener(k,f){(listeners[k]??=[]).push(f);},removeEventListener(k,f){listeners[k]=(listeners[k]??[]).filter(x=>x!==f);},contains:n=>n?.owner===id,click(){this.onclick?.()},getContext:(...a)=>canvas.getContext(...a),getBoundingClientRect:()=>({left:0,top:0,width:960,height:420}),querySelector(selector){return selector.includes('canvas')?el('adjacentCanvas'):null;},querySelectorAll(selector){if(selector!=='.skillSlot')return [];return this.slots??[];}};let html='';Object.defineProperty(obj,'innerHTML',{get:()=>html,set:v=>{html=String(v);for(const m of html.matchAll(/id="([^"]+)"/g))el(m[1]);if(id==='view')obj.slots=Array.from({length:(html.match(/class="skillSlot /g)||[]).length},(_,i)=>({owner:id,dataset:{},index:i}));}});elements.set(id,obj);return obj;}
function install(){global.document={hidden:false,getElementById:el,querySelector:selector=>selector==='.heroIdentity'?{querySelector:tag=>el('heroIdentity-'+tag)}:null,addEventListener:(k,f)=>(events[k]??=[]).push(f),createElement:()=>({click(){}})};global.window={addEventListener:(k,f)=>(windowEvents[k]??=[]).push(f),matchMedia:()=>({matches:true})};global.localStorage={getItem:k=>store.get(k)||null,setItem(k,v){if(failWrite)throw Error('quota');store.set(k,String(v));},get length(){return store.size},key:i=>[...store.keys()][i]};global.requestAnimationFrame=()=>{};global.setInterval=(fn,ms)=>{intervals.push({fn,ms});return intervals.length};global.setTimeout=()=>++serial;global.clearTimeout=()=>{};global.confirm=()=>true;}
const click=(dataset={},id='')=>{const b={dataset,id};for(const fn of events.click??[])fn({target:{id,closest:()=>b}});};const saved=()=>JSON.parse(store.get(SAVE_KEY));const tick=()=>{now+=1100;for(const x of intervals.filter(x=>x.ms===250))x.fn();};const periodic=()=>{for(const x of intervals.filter(x=>x.ms===10000))x.fn();};const refresh=async label=>{elements=new Map();events={};windowEvents={};intervals=[];install();await import('./dist/app.js?multi-app-'+label);};
const enterFamilyArea=async area=>{
 click({race:'goblin'});
 // Use the production adjacent-region edge handler, not a test-set stage/location.
 for(let n=2;n<=Number(area.slice(-2));n++){
  const b={owner:'adjacentRegionHost',dataset:{regionAction:'edge',regionId:'goblin.a'+String(n).padStart(2,'0')}};
  for(const f of el('adjacentRegionHost').listeners.click??[])await f({target:{closest:()=>b}});
 }
 return Number(area.slice(-2))>1?el('npcEventHost').innerHTML:el('view').innerHTML;
};
(async()=>{
 ({SAVE_KEY}=await import('./dist/save-generation.js'));
 const E=await import('./dist/engine.js'),C=await import('./dist/story-event-controller.js'),{PERSONAL_ARC_REWARDS}=await import('./dist/personal-arc-rewards.js'),{completePersonalArc}=await import('./personal-arc-test-fixture.mjs');
 const originalNow=Date.now;Date.now=()=>now;
 for(const race of ['dwarf','human','elf','goblin','ashen'])for(const branch of [0,1]){
  const arc=Object.values(PERSONAL_ARC_REWARDS).find(a=>a.race===race),id=arc.id+'.01';let game=completePersonalArc(race,{branch,stopAt:id});
  now=Math.max(game.lastSeen,game.lastHealthClock)+1000;store.set(SAVE_KEY,JSON.stringify(game));await refresh('personal-'+race+'-'+branch);click({race});
  assert(el('view').innerHTML.includes('个人线行动目标'));const d=C.storyEventView(game).active,actions=d.personalActions;
  const action=step=>click({storyAction:'personal-step',storyScene:id,storyStep:String(step),storyOption:actions[step].options[0].id});
  failWrite=true;action(0);failWrite=false;assert.equal(saved().personalStoryProgress.steps[id],0);
  action(0);assert.equal(saved().personalStoryProgress.steps[id],1);action(0);assert.equal(saved().personalStoryProgress.steps[id],1);
  click({storyAction:'personal-pause',storyScene:id});assert.equal(saved().story.activeScene,null);assert(saved().personalStoryProgress.paused[id]);
  await refresh('personal-resume-'+race+'-'+branch);click({race});click({storyAction:'begin',storyScene:id});assert.equal(saved().personalStoryProgress.steps[id],1);
  action(1);assert.equal(saved().personalStoryProgress.steps[id],2);click({storyAction:'finish',storyScene:id});assert(saved().story.completedScenes.includes(id));
  const before=saved().potionStacks?.['healing|0']??0;click({personalEventReward:id});assert.equal(saved().potionStacks['healing|0'],before+2);const raw=store.get(SAVE_KEY);click({personalEventReward:id});assert.equal(store.get(SAVE_KEY),raw);assert(E.validSave(saved()));
 }
 for(const race of ['dwarf','human','elf','goblin','ashen']){
  const arc=Object.values(PERSONAL_ARC_REWARDS).find(a=>a.race===race),game=completePersonalArc(race);now=Math.max(game.lastSeen,game.lastHealthClock)+1000;store.set(SAVE_KEY,JSON.stringify(game));await refresh('arc-reward-'+race);click({view:'journal'});
  assert(el('view').innerHTML.includes('首次明确确认部位'));assert(!saved().personalArcRewards);assert(el('view').innerHTML.includes('手套'));
  failWrite=true;click({personalArcReward:arc.id,personalRewardSlot:'weapon'});failWrite=false;assert(!saved().personalArcRewards);
  click({personalArcReward:arc.id,personalRewardSlot:'weapon'});assert(saved().taskRewardClaims.includes(arc.claimId));assert(!saved().personalArcRewards[arc.id]);assert.equal(saved().inventory.find(i=>!game.inventory.some(old=>old.id===i.id)).slot,'weapon');const raw=store.get(SAVE_KEY);click({personalArcReward:arc.id,personalRewardSlot:'ring'});assert.equal(store.get(SAVE_KEY),raw);assert(E.validSave(saved()));
 }
 // A newer tab cannot be overwritten by personal action, periodic save or tick.
 let game=completePersonalArc('dwarf',{stopAt:'personal.dwarf.coup.01'});now=Math.max(game.lastSeen,game.lastHealthClock)+1000;store.set(SAVE_KEY,JSON.stringify(game));await refresh('personal-stale');click({race:'dwarf'});game=saved();game.gold+=17;store.set(SAVE_KEY,JSON.stringify(game));const raw=store.get(SAVE_KEY);click({storyAction:'personal-step',storyScene:'personal.dwarf.coup.01',storyStep:'0',storyOption:'inspect'});periodic();tick();assert.equal(store.get(SAVE_KEY),raw);
 Date.now=originalNow;console.log('PASS actual App five races×two action branches, quota rollback, duplicate cursor, pause/reload/resume, event claim once, five Q3 slot UIs/claims, no browsing RNG, newer-tab action/save safety. Fake DOM, not browser layout.');
})().catch(e=>{console.error(e);process.exitCode=1});
