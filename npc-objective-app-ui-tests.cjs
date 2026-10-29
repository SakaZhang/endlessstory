const assert=require('assert/strict');const {createCanvas}=require('@napi-rs/canvas');
let SAVE_KEY;let elements=new Map(),events={},windowEvents={},intervals=[],store=new Map(),failWrite=false,now=Date.now(),serial=0;
function el(id){if(elements.has(id))return elements.get(id);const canvas=createCanvas(960,540),listeners={};const obj={id,width:960,height:540,style:{},listeners,classList:{add(){},remove(){}},open:false,showModal(){this.open=true},close(){this.open=false},addEventListener(k,f){(listeners[k]??=[]).push(f);},removeEventListener(k,f){listeners[k]=(listeners[k]??[]).filter(x=>x!==f);},contains:n=>n?.owner===id,click(){this.onclick?.()},getContext:(...a)=>canvas.getContext(...a),getBoundingClientRect:()=>({left:0,top:0,width:960,height:420}),querySelector(selector){return selector.includes('canvas')?el('adjacentCanvas'):null;},querySelectorAll(selector){if(selector!=='.skillSlot')return [];return this.slots??[];}};let html='';Object.defineProperty(obj,'innerHTML',{get:()=>html,set:v=>{html=String(v);for(const m of html.matchAll(/id="([^"]+)"/g))el(m[1]);if(id==='view')obj.slots=Array.from({length:(html.match(/class="skillSlot /g)||[]).length},(_,i)=>({owner:id,dataset:{},index:i}));}});elements.set(id,obj);return obj;}
function install(){global.document={hidden:false,getElementById:el,querySelector:selector=>selector==='.heroIdentity'?{querySelector:tag=>el('heroIdentity-'+tag)}:null,addEventListener:(k,f)=>(events[k]??=[]).push(f),createElement:()=>({click(){}})};global.window={addEventListener:(k,f)=>(windowEvents[k]??=[]).push(f),matchMedia:()=>({matches:true})};global.localStorage={getItem:k=>store.get(k)||null,setItem(k,v){if(failWrite)throw Error('quota');store.set(k,String(v));},get length(){return store.size},key:i=>[...store.keys()][i]};global.requestAnimationFrame=()=>{};global.setInterval=(fn,ms)=>{intervals.push({fn,ms});return intervals.length};global.setTimeout=()=>++serial;global.clearTimeout=()=>{};global.confirm=()=>true;}
const click=(dataset={},id='')=>{const b={dataset,id};for(const fn of events.click??[])fn({target:{id,closest:()=>b}});};const saved=()=>JSON.parse(store.get(SAVE_KEY));const tick=()=>{now+=1100;for(const x of intervals.filter(x=>x.ms===250))x.fn();};const periodic=()=>{for(const x of intervals.filter(x=>x.ms===10000))x.fn();};const refresh=async label=>{elements=new Map();events={};windowEvents={};intervals=[];install();await import('./dist/app.js?multi-app-'+label);};

(async()=>{
 ({SAVE_KEY}=await import('./dist/save-generation.js'));
 const E=await import('./dist/engine.js'),N=await import('./dist/npc-events.js');
 const {AREAS}=await import('./dist/location-schema.js');
 const {equipTestLoadout}=await import('./equipped-test-fixture.mjs');
 const realNow=Date.now;Date.now=()=>now;
 const empty={npcEvents:{version:1,entries:{}}};const defs=Object.values(N.NPC_EVENTS).filter(d=>d.id.startsWith('local.')).map(d=>N.npcEventDefinition(empty,d.id));
 const objective=d=>N.npcEventObjective(empty,d.id);
 const task=(kind,predicate=()=>true)=>{const d=defs.find(d=>objective(d)?.kind===kind&&predicate(d,objective(d)));assert(d,'authored '+kind+' fixture');return d;};
 const base=(d,{gear=false,playerRace=d.race}={})=>{const g=E.fresh(playerRace);E.normalizeAreaProgress(g);E.normalizeExpedition(g);for(const race of E.RACE_KEYS)g.areaProgress[race]={unlocked:Array.from({length:10},(_,i)=>i+1),cleared:Array.from({length:9},(_,i)=>i+1)};g.siteId=d.areaId;g.location=AREAS[d.areaId].number-1;g.expedition.fieldId=d.areaId+'.field';if(gear){g.level=100;g.xp=0;equipTestLoadout(g,{level:100});}E.normalizeHealth(g,now);g.heroHp=E.stats(g).hp;assert(E.validSave(g));return g;};
 const boot=async(g,label)=>{store.set(SAVE_KEY,JSON.stringify(g));await refresh('objectives-'+label);click({race:AREAS[g.siteId].race});click({plannedArea:String(AREAS[g.siteId].number)});};
 const row=id=>saved().npcEvents?.entries?.[id];
 const progress=id=>N.npcEventObjectiveProgress(saved(),id);
 const html=()=>el('view').innerHTML+' '+el('npcEventHost').innerHTML;
 const region=async(action,id='')=>{const b={owner:'adjacentRegionHost',dataset:{regionAction:action,regionId:id},disabled:false,focus(){}};for(const f of [...el('adjacentRegionHost').listeners.click??[]])await f({target:{closest:()=>b}});};
 const preview=areaId=>click({npcMapArea:areaId});
 const arrive=async areaId=>{preview(areaId);await region('arrive',areaId);assert.equal(saved().siteId,areaId,'normal map travel reaches '+areaId);};
 const accept=id=>click({npcAction:'accept',npcEvent:id});
 const investigate=(id,p)=>click({npcAction:'investigate',npcEvent:id,npcCheckpoint:p.id});
 const claim=id=>click({npcAction:'claim',npcEvent:id});
 const checkpoints=d=>objective(d).checkpoints;

 // Investigation has distinct registered physical evidence points, never a
 // response quiz. Viewing another map is not arrival or evidence collection.
 const research=task('investigate',(d,o)=>o.checkpoints.some(p=>p.areaId!==d.areaId));
 await boot(base(research),'research');assert(html().includes(research.title));for(const p of checkpoints(research)){assert(html().includes(p.label));assert(html().includes(AREAS[p.areaId].name));}assert.match(html(),/完成报酬/,'requirements and reward preview are visible before accepting');
 const initial=store.get(SAVE_KEY);failWrite=true;accept(research.id);failWrite=false;assert.equal(store.get(SAVE_KEY),initial,'failed acceptance does not create a task');
 accept(research.id);assert.equal(row(research.id).status,'active');assert(N.npcEventIsModern(saved(),research.id));assert(!html().includes('data-npc-action="choose"'),'new ordinary task cards offer no response choices');
 const accepted=structuredClone(row(research.id));accept(research.id);assert.deepEqual(row(research.id),accepted,'repeated accept is idempotent');
 const point=checkpoints(research).find(p=>p.areaId!==research.areaId);
 preview(point.areaId);assert.equal(saved().siteId,research.areaId);assert.equal(progress(research.id).count,0,'map preview has no progress');assert(html().includes(point.label));
 investigate(research.id,point);assert.equal(progress(research.id).count,0,'forged investigation from another area is rejected');
 const beforeTravel=store.get(SAVE_KEY);failWrite=true;await region('arrive',point.areaId);failWrite=false;assert.equal(store.get(SAVE_KEY),beforeTravel,'failed travel preserves origin and evidence');
 await region('arrive',point.areaId);assert.equal(saved().siteId,point.areaId);assert.equal(progress(research.id).count,0,'travel alone does not investigate');
 click({view:'journal'});assert(el('view').innerHTML.includes('aria-label="已接委托"'));assert(el('view').innerHTML.includes(research.title),'active task remains in journal away from its giver');assert(el('view').innerHTML.includes(research.npcName));assert(el('view').innerHTML.includes(AREAS[research.areaId].name));
 preview(point.areaId);const beforeEvidence=store.get(SAVE_KEY);failWrite=true;investigate(research.id,point);failWrite=false;assert.equal(store.get(SAVE_KEY),beforeEvidence,'failed evidence save records nothing');
 investigate(research.id,point);assert.equal(progress(research.id).count,1);assert(progress(research.id).checkpoints.find(p=>p.id===point.id).complete);assert(html().includes(point.evidence));
 const onePoint=structuredClone(row(research.id));investigate(research.id,point);assert.deepEqual(row(research.id),onePoint,'same checkpoint leaves its contract unchanged');assert.equal(progress(research.id).count,1,'same checkpoint counts once');
 await refresh('objectives-research-reload');click({view:'journal'});assert.equal(progress(research.id).count,1);assert(el('view').innerHTML.includes(research.title));
 for(const p of checkpoints(research).filter(p=>p.id!==point.id)){await arrive(p.areaId);investigate(research.id,p);}
 assert(progress(research.id).complete);assert.equal(row(research.id).status,'active','completed goals await a deliberate return and delivery');
 // Ensure the player is away, even when the final clue happens to be at home.
 await arrive(point.areaId);claim(research.id);assert.equal(row(research.id).status,'active','remote claim cannot award');
 await arrive(research.areaId);const beforeClaim=store.get(SAVE_KEY);failWrite=true;claim(research.id);failWrite=false;assert.equal(store.get(SAVE_KEY),beforeClaim,'failed delivery does not spend materials or award');claim(research.id);assert.equal(row(research.id).status,'resolved');const claimed=structuredClone(saved().taskRewardClaims);claim(research.id);assert.deepEqual(saved().taskRewardClaims,claimed,'repeated delivery cannot duplicate reward');
 await refresh('objectives-research-done');click({view:'journal'});assert.equal(row(research.id).status,'resolved');assert(E.validSave(saved()));

 // Kill progress comes from normal App battle ticks and successful settlement,
 // not an injected count, a selected answer, or an encounter preview.
 const hunt=task('kill',d=>AREAS[d.areaId].number===1),huntObj=objective(hunt);await boot(base(hunt,{gear:true}),'hunt');accept(hunt.id);const huntBefore=structuredClone(row(hunt.id));
 click({monsterSource:huntObj.nodeIds[0]});assert.deepEqual(row(hunt.id),huntBefore,'monster-source map preview gives no kill credit');
 const targetNode=huntObj.nodeIds[0];
 for(let battles=0;battles<80&&!progress(hunt.id).complete;battles++){now+=5000;click({plannedNode:targetNode,plannedStart:'1'});assert(saved().activeEncounter&&!saved().activeEncounter.done,'normal App starts a real target encounter');const beforeKills=saved().kills;click({stopafter:'1'});for(let steps=0;steps<400&&saved().running;steps++)tick();assert(saved().kills>beforeKills,'legal acquired gear wins through real App simulation');assert.equal(saved().running,false,'stop-after handler allows returning to giver');}
 assert(progress(hunt.id).complete,'actual successful combat reaches the authored kill target');assert.equal(row(hunt.id).status,'active');click({view:'journal'});assert(el('view').innerHTML.includes(hunt.title));if(saved().siteId!==hunt.areaId)await arrive(hunt.areaId);else preview(hunt.areaId);claim(hunt.id);assert.equal(row(hunt.id).status,'resolved');assert(E.validSave(saved()));

 // Collect goals use exact-quality live inventory and consume it only together
 // with successful delivery. Higher-quality materials are not substituted.
 const collect=task('collect'),collectObj=objective(collect),costs=N.npcEventCosts(collect,empty);assert(costs.length);let g=base(collect);for(const c of costs){delete g.materialStacks[c.key];const [material,quality]=c.key.split('|');g.materialStacks[material+'|'+((Number(quality)+1)%4)]=c.quantity+2;}
 await boot(g,'collect-missing');accept(collect.id);assert(!progress(collect.id).complete);claim(collect.id);assert.equal(row(collect.id).status,'active');
 g=saved();for(const c of costs)g.materialStacks[c.key]=c.quantity;await boot(g,'collect-ready');assert(progress(collect.id).complete);const materialBefore=structuredClone(saved().materialStacks);failWrite=true;claim(collect.id);failWrite=false;assert.deepEqual(saved().materialStacks,materialBefore);assert.equal(row(collect.id).status,'active');claim(collect.id);assert.equal(row(collect.id).status,'resolved');for(const c of costs){const reward=(collect.rewards??[]).filter(r=>r.kind==='material'&&r.key===c.key).reduce((n,r)=>n+r.quantity,0);assert.equal(saved().materialStacks[c.key],reward,'exact-quality cost consumed at delivery');}assert(E.validSave(saved()));

 // A full material bag leaves the finished contract pending. The normal
 // inventory discard action frees a slot, after which the same fixed payout
 // can be delivered exactly once; failed claims never consume its costs.
 const exchange=task('collect',d=>d.rewards.some(r=>r.kind==='material')),exchangeCosts=N.npcEventCosts(exchange,empty),rewardKeys=exchange.rewards.filter(r=>r.kind==='material').map(r=>r.key),costKeys=exchangeCosts.map(r=>r.key);g=base(exchange);const fill=Object.keys(E.MATERIALS).filter(k=>!E.MATERIALS[k].storyOnly).flatMap(k=>[0,1,2,3].map(q=>E.materialKey(k,q)).filter(Boolean)).filter(k=>!rewardKeys.includes(k)&&!costKeys.includes(k)).slice(0,100-costKeys.length);g.materialStacks=Object.fromEntries(fill.map(k=>[k,1]));for(const c of exchangeCosts)g.materialStacks[c.key]=c.quantity+1;assert.equal(E.bagCounts(g).materials,100);await boot(g,'full-bag');accept(exchange.id);assert(progress(exchange.id).complete);const fullBefore=structuredClone(saved());claim(exchange.id);assert.equal(row(exchange.id).status,'active');assert.deepEqual(saved().materialStacks,fullBefore.materialStacks);assert.deepEqual(saved().taskRewardClaims,fullBefore.taskRewardClaims);assert.match(el('toast').textContent,/行囊放不下|背包/);click({materialinfo:fill[0]});click({materialDiscard:fill[0]});assert.equal(E.bagCounts(saved()).materials,99);claim(exchange.id);assert.equal(row(exchange.id).status,'resolved');for(const r of exchange.rewards.filter(r=>r.kind==='material'))assert.equal(saved().materialStacks[r.key],r.quantity);assert(E.validSave(saved()));

 // Goal controls expose authoritative territory, region-lock and combat
 // blockers; an enabled-looking forged click cannot bypass any of them.
 const foreignRace=research.race==='human'?'dwarf':'human';await boot(base(research,{playerRace:foreignRace}),'war-accept');accept(research.id);g=saved();assert(E.startWar(g,{id:'test.npc-objective.war',races:[foreignRace,research.race]},now));await boot(g,'war-blocked');preview(point.areaId);assert.match(html(),/战争封锁/);investigate(research.id,point);assert.equal(progress(research.id).count,0);
 g=E.fresh(research.race);E.normalizeHealth(g,now);E.normalizeAreaProgress(g);E.normalizeExpedition(g);await boot(g,'lock-blocked');preview(research.areaId);assert.match(html(),/尚未开放|尚未解锁/);accept(research.id);assert(!row(research.id),'locked giver cannot accept a new contract');investigate(research.id,point);assert.equal(progress(research.id).count,0);
 await boot(base(research,{gear:true}),'combat-accept');accept(research.id);await arrive(point.areaId);click({plannedNode:point.areaId+'.field',plannedStart:'1'});assert(saved().activeEncounter&&!saved().activeEncounter.done);preview(point.areaId);assert.match(html(),/结束远征|结束当前/);investigate(research.id,point);assert.equal(progress(research.id).count,0);

 // A stale tab may neither investigate nor overwrite a newer saved record.
 await boot(base(research),'stale');accept(research.id);await arrive(point.areaId);g=saved();g.gold+=3;store.set(SAVE_KEY,JSON.stringify(g));const newer=store.get(SAVE_KEY);investigate(research.id,point);periodic();assert.equal(store.get(SAVE_KEY),newer,'stale action and periodic save preserve newer bytes');assert.equal(progress(research.id).count,0);assert.match(el('saveStatus').textContent,/已变化|暂停/);
 Date.now=realNow;console.log('PASS actual App actionable NPC tasks: explicit accept, persistent away journal, preview versus real travel, distinct once-only investigation evidence, actual combat tick kill credit, exact-quality collection, return-only atomic delivery, full-bag pending/discard retry, war/locked/combat guards, failed writes, reload, repeated clicks, stale-tab protection.');
})().catch(e=>{console.error(e);process.exitCode=1});
