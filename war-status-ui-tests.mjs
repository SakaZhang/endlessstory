import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
import {buildWarStatus,warPinStatus,renderWorldWarStatus,renderRegionWarStatus,refreshWarStatus} from './dist/war-status-ui.js';
const at=Date.now();
function game(race='human'){const s=E.fresh(race);E.normalizeExpedition(s);E.normalizeHealth(s,at);s.lastSeen=at;return s;}
function random(s,races=['human','dwarf']){assert(E.startRandomWar(s,{id:'test.visibility',races,durationMs:20*60000},at));return s;}
const peace=game();assert.match(renderWorldWarStatus(buildWarStatus(peace,at)),/当前无战争/);
assert.match(renderRegionWarStatus(buildWarStatus(peace,at),'dwarf'),/当前无战争/);
for(const player of ['human','dwarf','elf','goblin','ashen']){
 const s=random(game(player)),before=JSON.stringify(s),m=buildWarStatus(s,at),participating=['human','dwarf'].includes(player);
 assert.equal(m.wars[0].participating,participating);assert.match(renderWorldWarStatus(m),/矮人 ↔ 人族/);assert.match(renderWorldWarStatus(m),/剩余 20:00/);
 for(const r of ['human','dwarf','elf','goblin','ashen'])assert.equal(warPinStatus(m,r).blocked,participating&&r!==player&&['human','dwarf'].includes(r));
 if(!participating)assert.match(renderRegionWarStatus(m,'dwarf'),/未因战争对你封锁/);
 assert.equal(JSON.stringify(s),before,'all presentation queries leave complete save untouched');
}
const blocked=random(game());blocked.siteId='dwarf.a01';blocked.location=0;blocked.expedition.fieldId='dwarf.a01.field';assert(E.validSave(blocked));
assert.match(renderRegionWarStatus(buildWarStatus(blocked,at),'dwarf'),/你当前身处封锁领地/);
assert.match(renderRegionWarStatus(buildWarStatus(blocked,at),'dwarf'),/矮人全部区域对你封锁/);
assert.match(renderWorldWarStatus(buildWarStatus(blocked,at+1001)),/剩余 19:59/);
assert.match(renderWorldWarStatus(buildWarStatus(blocked,at+20*60000)),/当前无战争/);
assert.equal(warPinStatus(buildWarStatus(blocked,at+20*60000),'dwarf').state,'peace','exact expiry does not require a state mutation');
assert.match(renderWorldWarStatus(buildWarStatus(blocked,at-1)),/当前无战争/);
const story=game('elf');assert(E.startWar(story,{id:'test.story.visibility',races:['elf','ashen']},at));
assert.match(renderWorldWarStatus(buildWarStatus(story,at)),/剧情战争 · 解除需推进相关主线/);assert(!renderWorldWarStatus(buildWarStatus(story,at)).includes('剩余'));
assert.equal(warPinStatus(buildWarStatus(story,at),'ashen').state,'blocked');
assert.match(renderWorldWarStatus(buildWarStatus({...peace,diplomacy:{broken:true}},at)),/暂不可读取/);
// Only dedicated status hosts/pin labels can change; no map or control access.
const nodes=new Map(),writes=[];for(const id of ['worldWarStatus','regionWarStatus',...['human','dwarf','elf','goblin','ashen'].flatMap(r=>['warPin-'+r,'warPinStatus-'+r])]){
 const node={dataset:{},textContent:'',attrs:{},setAttribute(k,v){this.attrs[k]=v;},getAttribute(k){return this.attrs[k]}};let html='';Object.defineProperty(node,'innerHTML',{get:()=>html,set:v=>{writes.push(id);html=v;}});nodes.set(id,node);
}
const root={getElementById:id=>{assert(nodes.has(id),'cannot touch map/region controls: '+id);return nodes.get(id)}};
const before=JSON.stringify(blocked);refreshWarStatus(root,blocked,at,{view:'world'});const count=writes.length;refreshWarStatus(root,blocked,at,{view:'world'});assert.equal(writes.length,count,'unchanged tick has no status replacement');
refreshWarStatus(root,blocked,at+1001,{view:'world'});assert.match(nodes.get('worldWarStatus').innerHTML,/19:59/);assert.equal(nodes.get('warPin-dwarf').dataset.warState,'blocked');
refreshWarStatus(root,blocked,at+20*60000,{view:'world'});assert.equal(nodes.get('warPin-dwarf').dataset.warState,'peace');assert.equal(nodes.get('warPinStatus-dwarf').textContent,'可探索');
refreshWarStatus(root,blocked,at,{view:'region',race:'dwarf'});assert.match(nodes.get('regionWarStatus').innerHTML,/你当前身处封锁领地/);assert.equal(JSON.stringify(blocked),before);
console.log('PASS read-only war visibility: five-player matrix, neutral/participant labels, current-site warning, story/no fake countdown, exact expiry/rollback, no mutation and status-only idempotent refresh.');
