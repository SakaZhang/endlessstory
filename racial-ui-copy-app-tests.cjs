// Exercise actual App UI for every race, not just static source strings.
const assert=require('node:assert/strict');
const {execFileSync}=require('node:child_process');
const races=['human','dwarf','elf','goblin','ashen'];
if(!process.argv[2]){for(const race of races)execFileSync(process.execPath,[__filename,race],{stdio:'inherit'});process.exit(0);}
const {SAVE_KEY}=require('./dist/save-generation.js');
const {createCanvas}=require('@napi-rs/canvas');
const elements=new Map(),events={},store=new Map();
function el(id){
 if(elements.has(id))return elements.get(id);
 const canvas=createCanvas(960,540),obj={id,style:{},classList:{add(){},remove(){}},open:false,showModal(){this.open=true},close(){this.open=false},addEventListener(){},click(){this.onclick?.()},getContext(...args){return canvas.getContext(...args)}};
 let html='';Object.defineProperty(obj,'innerHTML',{get:()=>html,set:value=>{html=value;for(const match of value.matchAll(/id="([^"]+)"/g))el(match[1]);}});elements.set(id,obj);return obj;
}
global.document={hidden:false,getElementById:el,querySelector:selector=>selector==='.heroIdentity'?{querySelector:tag=>el('heroIdentity-'+tag)}:null,addEventListener:(key,fn)=>(events[key]??=[]).push(fn),createElement:()=>({click(){}})};
global.window={addEventListener(){},matchMedia:()=>({matches:false})};
global.localStorage={getItem:key=>store.get(key)||null,setItem:(key,value)=>store.set(key,value),get length(){return store.size},key:index=>[...store.keys()][index]};
global.requestAnimationFrame=()=>{};global.setInterval=()=>0;global.setTimeout=()=>0;global.clearTimeout=()=>{};global.confirm=()=>true;
(async()=>{
 await require('./m2-ui-test-fixture.cjs').installM2UiFixture();
 const E=await import('./dist/engine.js'),R=await import('./dist/race-registry.js');
 const race=process.argv[2];assert(races.includes(race));const s=E.fresh(race);s.level=30;s.talents.luck=10;assert(E.validSave(s));store.set(SAVE_KEY,JSON.stringify(s));
 await import('./dist/app.js');
 const click=(dataset={})=>{const button={dataset,id:''};for(const fn of events.click||[])fn({target:{id:'',closest:()=>button}});};
 assert.equal(el('heroIdentity-small').textContent,R.getRacePack(race).name);
 for(let repeat=0;repeat<2;repeat++){
  el('talentBtn').click();let html=el('modalBody').innerHTML;
  assert.match(html,/<h2>天赋<\/h2>/);assert.match(html,/TALENTS/);assert.doesNotMatch(html,/黑炉|DWARVEN|血脉|不是掉率增加/);
  for(const kind of ['dungeon','boss'])assert(html.includes((E.setDropProbability(kind,10)*100).toFixed(4).replace(/0+$/,'').replace(/\.$/,'')+'%')); assert.match(html,/品质与普通词条择优触发率/);assert.doesNotMatch(html,/掉率示例|以上用于新战斗|天赋、装备与药剂合计/);
  assert.match(html,/不足每点20金币/);assert.match(html,/免费机会将在确认后消耗/);
  el('closeModal').click();assert.equal(el('modal').open,false);
 }
 click({view:'forge'});assert.equal(el('viewTitle').textContent,'熔炉');assert.match(el('view').innerHTML,/点燃消耗所选投入/);assert.match(el('view').innerHTML,/背包满则保存成品/);
 click({stats:'1'});const statsHtml=el('modalBody').innerHTML;assert.match(statsHtml,/常驻参考/);assert.match(statsHtml,/满血、无护盾、无药剂/);assert.match(statsHtml,/计入药剂、战斗增益与条件效果/);assert.doesNotMatch(statsHtml,/不是固定百分比|不代表固定掉落率/);el('closeModal').click();
 assert.equal(JSON.parse(store.get(SAVE_KEY)).race,race);
 console.log('PASS concise shared UI '+race+': neutral talent/forge headings, identity, actual luck rates, repeated dismissal, reference/current stats and essential cost/capacity warnings');
})().catch(error=>{console.error(error);process.exitCode=1});
