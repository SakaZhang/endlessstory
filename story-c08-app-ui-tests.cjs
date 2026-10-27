const assert=require('assert/strict');const {createCanvas}=require('@napi-rs/canvas');
let SAVE_KEY;let elements=new Map(),events={},windowEvents={},intervals=[],store=new Map(),failWrite=false,now=Date.now(),serial=0;
function el(id){if(elements.has(id))return elements.get(id);const canvas=createCanvas(960,540),listeners={};const obj={id,width:960,height:540,style:{},listeners,classList:{add(){},remove(){}},open:false,showModal(){this.open=true},close(){this.open=false},addEventListener(k,f){(listeners[k]??=[]).push(f);},removeEventListener(k,f){listeners[k]=(listeners[k]??[]).filter(x=>x!==f);},contains:n=>n?.owner===id,click(){this.onclick?.()},getContext:(...a)=>canvas.getContext(...a),getBoundingClientRect:()=>({left:0,top:0,width:960,height:420}),querySelector(selector){return selector.includes('canvas')?el('adjacentCanvas'):null;},querySelectorAll(selector){if(selector!=='.skillSlot')return [];return this.slots??[];}};let html='';Object.defineProperty(obj,'innerHTML',{get:()=>html,set:v=>{html=String(v);for(const m of html.matchAll(/id="([^"]+)"/g))el(m[1]);if(id==='view')obj.slots=Array.from({length:(html.match(/class="skillSlot /g)||[]).length},(_,i)=>({owner:id,dataset:{},index:i}));}});elements.set(id,obj);return obj;}
function install(){global.document={hidden:false,getElementById:el,querySelector:selector=>selector==='.heroIdentity'?{querySelector:tag=>el('heroIdentity-'+tag)}:null,addEventListener:(k,f)=>(events[k]??=[]).push(f),createElement:()=>({click(){}})};global.window={addEventListener:(k,f)=>(windowEvents[k]??=[]).push(f),matchMedia:()=>({matches:true})};global.localStorage={getItem:k=>store.get(k)||null,setItem(k,v){if(failWrite)throw Error('quota');store.set(k,String(v));},get length(){return store.size},key:i=>[...store.keys()][i]};global.requestAnimationFrame=()=>{};global.setInterval=(fn,ms)=>{intervals.push({fn,ms});return intervals.length};global.setTimeout=()=>++serial;global.clearTimeout=()=>{};global.confirm=()=>true;}
const click=(dataset={},id='')=>{const b={dataset,id};for(const fn of events.click??[])fn({target:{id,closest:()=>b}});};const saved=()=>JSON.parse(store.get(SAVE_KEY));const tick=()=>{now+=1100;for(const x of intervals.filter(x=>x.ms===250))x.fn();};const periodic=()=>{for(const x of intervals.filter(x=>x.ms===10000))x.fn();};const refresh=async label=>{elements=new Map();events={};windowEvents={};intervals=[];install();await import('./dist/app.js?multi-app-'+label);};
(async()=>{
 ({SAVE_KEY}=await import('./dist/save-generation.js'));const E=await import('./dist/engine.js'),C=await import('./dist/story-event-controller.js'),{STORY_SCENES}=await import('./dist/story-event-registry.js'),{reachStoryScene}=await import('./story-event-test-fixture.mjs');const originalNow=Date.now;Date.now=()=>now;
 for(const race of ['human','dwarf','elf','goblin','ashen']){
  const first=['elf','ashen'].includes(race)?'C07.EA02.'+race:'C07.O02.'+race;
  let game=reachStoryScene(race,first);now=Math.max(game.lastSeen,game.lastHealthClock)+3000;store=new Map([[SAVE_KEY,JSON.stringify(game)]]);await refresh('c08-'+race);click({race:game.siteId.split('.')[0]});
  const hero=game.hero;let scenes=0;
  while(!saved().story.flags.includes('C08_COMPLETE')&&scenes++<30){
   let cur=saved(),active=cur.story.activeScene;
   if(!active){const offer=C.availableStoryScenes(cur).find(x=>!x.optional);assert(offer,'available scene '+race);click({race:offer.siteId.split('.')[0]});
    if(offer.entryAvailable){click({storyAction:'enter',storyScene:offer.id});}
    else {if(cur.siteId!==offer.siteId){now=Math.max(now,saved().nextBattleAt??0,saved().lastHealthClock??0)+2000;click({plannedNode:offer.siteId+'.field',plannedStart:'1'});assert(saved().activeEncounter,'actual map travel '+offer.id);click({stopafter:'1'});for(let n=0;n<1000&&saved().activeEncounter;n++)tick();assert(!saved().activeEncounter);assert.equal(saved().siteId,offer.siteId);click({race:offer.siteId.split('.')[0]});}click({storyAction:'begin',storyScene:offer.id});}
    active=saved().story.activeScene;assert.equal(active.id,offer.id);
   }
   const id=active.id,d=STORY_SCENES[id];console.log('APP scene',race,id);click({race:d.siteId.split('.')[0]});
   for(let line=0;saved().story.activeScene.cursor<d.lines.length&&line<50;line++)click({storyAction:'next',storyScene:id,storyCursor:String(saved().story.activeScene.cursor)});assert.equal(saved().story.activeScene.cursor,d.lines.length,'dialogue '+id+' '+el('toast').textContent);
   if(saved().story.activeScene.choiceId===null)click({storyAction:'choice',storyScene:id,storyChoice:d.choices[0].id});
   if(d.encounter&&!C.storyEventView(saved()).active.receipt){
    now=Math.max(now,saved().nextBattleAt??0,saved().lastHealthClock??0)+2000;const before=saved(),economy=JSON.stringify({gold:before.gold,xp:before.xp,kills:before.kills,inventory:before.inventory,materials:before.materialStacks});
    click({storyAction:'scenario',storyScene:id,storyScenario:d.encounter.scenarioId});assert(saved().activeEncounter,'scenario start '+id+' toast='+el('toast').textContent+' active='+JSON.stringify(saved().story.activeScene));assert.equal(saved().activeEncounter.storyScenario.sceneId,id);
    if(d.questTool){
     const e=saved().activeEncounter,tool={storyAction:'use-tool',storyScene:id,storyEncounter:e.id,storyTarget:e.enemies[0].id};assert(el('storyScenarioNoticeHost').innerHTML.includes('data-story-action="use-tool"'));assert(el('storyScenarioNoticeHost').innerHTML.includes('消耗1件'));
     const snap=JSON.stringify(saved().story);tick();assert.equal(JSON.stringify(saved().story),snap);failWrite=true;click(tool);failWrite=false;assert(C.storyQuestToolAvailable(saved(),'old-wedge'));assert(saved().activeEncounter);assert(!saved().story.flags.includes('E_UNSEALED'));
     // Real App reload preserves the exact target and still-owned one-use tool.
     await refresh('c08-tool-reload-'+race);click({view:'battle'});assert.equal(saved().activeEncounter.id,e.id);click(tool);assert.equal(saved().activeEncounter,null);assert(saved().story.flags.includes('E_WEDGE_USED'));assert(saved().story.flags.includes('E_UNSEALED'));assert(!C.storyQuestToolAvailable(saved(),'old-wedge'));const once=JSON.stringify(saved().story);click(tool);assert.equal(JSON.stringify(saved().story),once);
    }else{
     for(let n=0;n<1500&&!saved().story.encounters.some(x=>x.sceneId===id);n++)tick();assert(saved().story.encounters.some(x=>x.sceneId===id),'actual scenario '+id);assert.equal(saved().restUntil,0);assert.equal(saved().running,false);assert(!el('toast').textContent.includes('战斗失败'));click({storyReturn:'1'});
    }
    const after=saved();assert.equal(JSON.stringify({gold:after.gold,xp:after.xp,kills:after.kills,inventory:after.inventory,materials:after.materialStacks}),economy,'no scenario farm '+id);
   }
   if(!saved().story.completedScenes.includes(id)){
    if(id.startsWith('C08.X04.')){assert.equal(saved().diplomacy.wars.find(w=>w.id==='story.c07.elf-ashen').status,'active');failWrite=true;click({storyAction:'finish',storyScene:id});failWrite=false;assert.equal(saved().diplomacy.wars.find(w=>w.id==='story.c07.elf-ashen').status,'active');assert(!saved().story.flags.includes('INVASION_BEGAN'));}
    click({storyAction:'finish',storyScene:id});assert(saved().story.completedScenes.includes(id),'finish '+id);const once=JSON.stringify(saved().story);click({storyAction:'finish',storyScene:id});assert.equal(JSON.stringify(saved().story),once);
   }
   assert.equal(saved().race,race);assert.equal(saved().hero,hero);assert(E.validSave(saved()));
  }
  assert(saved().story.flags.includes('C08_COMPLETE'));assert.equal(saved().diplomacy.wars.find(w=>w.id==='story.c07.elf-ashen').status,'ended');assert(!saved().story.flags.includes('R4_TEMPLE_CONFIRMED'));click({race:saved().siteId.split('.')[0]});assert(el('view').innerHTML.includes('变了的旧座'));
  const state=JSON.stringify(saved().story);await refresh('c08-complete-reload-'+race);assert.equal(JSON.stringify(saved().story),state);if(race==='ashen')assert.equal(saved().inventory.filter(i=>i.legendaryId==='ashen-primal-core').length,1);
 }
 Date.now=originalNow;console.log('PASS actual App five POVs C07 remainder–C08: registered war entrances/actual travel, genuine scenario loops, own hero, no rewards/rest, three seal encounters, protected one-use tool target/quota/reload/duplicate, atomic invasion+war end, truthful post-C08 boundary.');
})().catch(e=>{console.error(e);process.exitCode=1});
