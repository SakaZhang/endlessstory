const assert=require('node:assert/strict'),{execFileSync}=require('node:child_process');
const races=['human','dwarf','elf','goblin','ashen'];
if(!process.argv[2]){for(const race of races)execFileSync(process.execPath,[__filename,race],{stdio:'inherit'});process.exit(0);}
const {SAVE_KEY}=require('./dist/save-generation.js'),{createCanvas}=require('@napi-rs/canvas');
const elements=new Map(),events={},store=new Map();
function el(id){if(elements.has(id))return elements.get(id);const canvas=createCanvas(960,540),obj={id,style:{},classList:{add(){},remove(){}},open:false,showModal(){this.open=true},close(){this.open=false},addEventListener(){},click(){this.onclick?.()},getContext(...args){return canvas.getContext(...args)}};let html='';Object.defineProperty(obj,'innerHTML',{get:()=>html,set:value=>{html=value;for(const match of value.matchAll(/id="([^"]+)"/g))el(match[1]);}});elements.set(id,obj);return obj;}
global.document={hidden:false,getElementById:el,querySelector:selector=>selector==='.heroIdentity'?{querySelector:tag=>el('heroIdentity-'+tag)}:null,addEventListener:(key,fn)=>(events[key]??=[]).push(fn),createElement:()=>({click(){}})};
global.window={addEventListener(){},matchMedia:()=>({matches:false})};
global.localStorage={getItem:key=>store.get(key)||null,setItem:(key,value)=>store.set(key,value),get length(){return store.size},key:index=>[...store.keys()][index]};
global.requestAnimationFrame=()=>{};global.setInterval=()=>0;global.setTimeout=()=>0;global.clearTimeout=()=>{};global.confirm=()=>true;
(async()=>{
 await require('./m2-ui-test-fixture.cjs').installM2UiFixture();
 const E=await import('./dist/engine.js'),{specialAffixProgress}=await import('./dist/special-affix-growth.js'),{rareLootSnapshot,renderLuckRates}=await import('./dist/rare-loot-ui.js'),race=process.argv[2];assert(races.includes(race));
 const s=E.fresh(race);s.level=53;s.gold=1e6;const add=(it,level=0,divine=false)=>{it.enhancement={version:2,model:'equipment-budget-m2-v1',level};if(divine)E.applyForgeFavor(it);s.inventory.push(it);return it;};
 const basic=Array.from({length:6},(_,n)=>add(E.item('ring',53,null,0,{originRace:race}),n,n%2===1));
 const blade=add(E.legendaryItem('goblin-silent-ration',53),3),blessedBlade=add(E.legendaryItem('goblin-silent-ration',53),3,true),dice=add(E.legendaryItem('lucky-dice',33),5);
 const growths=[['blesser',199,19,20,'helm'],['blesser',200,20,20,'helm'],['harvester',399,399,400,'boots'],['glutton',199,199,200,'gloves']].map(([id,kills,value,max,slot])=>{const it=E.item(slot,53,null,2,{originRace:race});it.special={id,growthKills:kills};add(it);return {it,kills,value,max,id};});
 assert(E.equipItem(s,basic[3].id));E.normalizeHealth(s,s.lastSeen);assert(E.validSave(s));const rawInventory=JSON.stringify(s.inventory);store.set(SAVE_KEY,JSON.stringify(s));await import('./dist/app.js');
 const click=(dataset={})=>{const button={dataset,id:''};for(const fn of events.click||[])fn({target:{id:'',closest:()=>button}});};
 const statsHtml=html=>{const result=html.match(/<div class="itemStats">([\s\S]*?)<\/div><div class="affixBlock">/);assert(result,'item stat section');return result[1];};
 const expectedRow=(it,key,label)=>{const base=Math.round(it[key]*(1+.05*it.enhancement.level)),delta=base-it[key],god=Math.round(base*(it.divine?1.1:1))-base;return `<b>${it[key]}${delta?` <small class="enhancementIncrease" title="强化" aria-label="强化 +${delta}">+${delta}</small>`:''}</b><small>${label}${it.divine&&base?`<br><span class="divineIncrease">神赐 +${god}</span>`:''}</small>`;};
 for(const it of [...basic,blade,blessedBlade,dice]){
  click({view:'inventory'});click({item:it.id});const html=el('view').innerHTML,base=statsHtml(html);assert.doesNotMatch(base,/实际|原始数值/);for(const [key,label]of [['atk','攻击'],['armor','护甲'],['hp','生命']])assert(base.includes(expectedRow(it,key,label)),`${race}/${it.id}/${key} expected ${expectedRow(it,key,label)}; got ${base}`);
  const affixes=html.match(/<div class="affixBlock">([\s\S]*?)<\/div>(?:<div class="legendaryExclusive"|<div class="specialAffix"|<div class="detailActions"|<p class="subtleText")/)?.[1]??'';assert.doesNotMatch(affixes,/实际/);
 }
 // Exact reported Lv53 blade: +3 is now15%, not the obsolete12%/+14.
 click({item:blade.id});let html=statsHtml(el('view').innerHTML);assert.match(html,/aria-label="强化 \+18">\+18/);assert.match(html,/aria-label="强化 \+16">\+16/);assert.doesNotMatch(html,/\+14|134/);
 click({item:blessedBlade.id});html=statsHtml(el('view').innerHTML);assert.match(html,/强化 \+18/);assert.match(html,/神赐 \+14/);assert.match(html,/强化 \+16/);assert.match(html,/神赐 \+12/);
 // Same reusable detail renderer opens/closes in a modal without changing raw save.
 for(let i=0;i<2;i++){click({wardrobeitem:blessedBlade.id});assert(el('modal').open);assert.equal(statsHtml(el('modalBody').innerHTML),html);el('closeModal').click();assert.equal(el('modal').open,false);}
 click({enhanceItem:blade.id});assert.match(el('view').innerHTML,/\+5% \/ \+10% \/ \+15% \/ \+20% \/ \+25%/);assert.match(el('view').innerHTML,/当前 \+3/);assert.match(el('view').innerHTML,/>138<\/td>/);assert.match(el('view').innerHTML,/>122<\/td>/);
 for(const {it,kills,value,max,id} of growths){click({view:'inventory'});click({item:it.id});const progress=el('view').innerHTML.match(/<div class="specialGrowthProgress">([\s\S]*?)<\/div>/)[1];assert(progress.includes(`击杀进度 ${kills} / ${id==='harvester'?400:200}`));if(id==='blesser'&&kills%10){assert(progress.includes('满层：幸运 +20'));assert.doesNotMatch(progress,/已获得|\+20 \/ \+20|\+19/);}else assert(progress.includes(`+${value} / +${max}`));assert.equal(progress.includes('已达上限'),kills===(id==='harvester'?400:200));assert.doesNotMatch(progress,/\d\.\d/);if(id==='blesser')assert.equal(specialAffixProgress(it).value,kills/10);}
 // Fractional Blesser progress shows kills/cap only, never a rounded current bonus.
 const blesser=growths[0].it,withBlesser=structuredClone(s);assert(E.equipItem(withBlesser,blesser.id));const noGrowth=structuredClone(withBlesser);noGrowth.inventory.find(x=>x.id===blesser.id).special.growthKills=0;assert(Math.abs(E.stats(withBlesser).luck-E.stats(noGrowth).luck-19.9)<1e-8);assert.equal(specialAffixProgress(blesser).value,19.9);const lootSnapshot=rareLootSnapshot(withBlesser),lootHtml=renderLuckRates(withBlesser),exactLuck=E.stats(withBlesser).luck;assert.equal(lootSnapshot.luck,exactLuck);assert.equal(lootSnapshot.dungeonRate,E.setDropProbability('dungeon',exactLuck));assert.equal(lootSnapshot.bossRate,E.setDropProbability('boss',exactLuck));assert(lootHtml.includes(`有效幸运 <b>${Math.round(exactLuck)}</b>`));assert.doesNotMatch(lootHtml,/有效幸运 <b>\d+\.\d/);
 click({stats:'1'});assert.match(el('modalBody').innerHTML,/全部属性/);el('closeModal').click();assert.equal(JSON.stringify(JSON.parse(store.get(SAVE_KEY)).inventory),rawInventory);assert(E.validSave(JSON.parse(store.get(SAVE_KEY))));
 console.log(`PASS v082 actual App ${race}: levels0..5/raw+enhancement+divine, Lv53 blade120+18/106+16, dice+5, repeat modal/dismiss/navigation, workshop preview, Blesser199=>kills+cap/200=>20 with true19.9 + probability precision untouched, raw save unchanged.`);
})().catch(error=>{console.error(error);process.exitCode=1});
