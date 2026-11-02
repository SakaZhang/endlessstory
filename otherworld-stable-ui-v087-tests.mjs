import assert from 'node:assert/strict';
import fs from 'node:fs';
import {reachStoryScene} from './story-event-test-fixture.mjs';
import {enterOtherworld,item} from './dist/engine.js';
import {renderOtherworldPanel,updateOtherworldPanel} from './dist/otherworld-ui.js';
const s=reachStoryScene('human','END.H01.human',{spring:'skip',finishTarget:true,level:100});
s.running=false;assert(enterOtherworld(s));
class Node {constructor(text=''){this.textContent=text;this.attrs={};this.value='';}getAttribute(k){return this.attrs[k]??null;}setAttribute(k,v){this.attrs[k]=String(v);}}
const nodes=new Map();for(const field of ['floor','highest','hp','atk','armor','scale','action','range','pending','storage'])nodes.set(`[data-ow-text="${field}"]`,new Node());
for(const action of ['auto','floor','exit','claim'])nodes.set(`[data-otherworld="${action}"]`,new Node());
const input=new Node();input.value='1';input.attrs['data-last-floor']='1';nodes.set('#otherworldFloor',input);
const panel={getAttribute:k=>k==='data-otherworld-active'?'true':null,querySelector:k=>nodes.get(k)};
let writes=0;const doc={activeElement:null},host={ownerDocument:doc,querySelector:()=>panel,get innerHTML(){return 'mounted'},set innerHTML(v){writes++;}};
const before=JSON.stringify(s),refs=[...nodes.values()];
for(let i=0;i<40;i++){s.activeEncounter={rewarded:i%2===0};updateOtherworldPanel(host,s);assert.equal(writes,0,'ticks must not replace controls');assert.deepEqual([...nodes.values()],refs);}
s.activeEncounter=null;assert.equal(nodes.get('[data-otherworld="claim"]').disabled,true);
// Floor progression updates all live data, but never overwrites a typed draft.
s.otherworld.highestCleared=9;s.otherworld.floor=10;updateOtherworldPanel(host,s);assert.equal(input.value,'10');assert.equal(input.max,'10');assert.equal(nodes.get('[data-ow-text="range"]').textContent,'可选择第1–10层');
input.value='2';doc.activeElement=input;s.otherworld.highestCleared=10;s.otherworld.floor=11;updateOtherworldPanel(host,s);assert.equal(input.value,'2');assert.equal(doc.activeElement,input);assert.equal(input.max,'11');
doc.activeElement=null;updateOtherworldPanel(host,s);assert.equal(input.value,'2','blur does not erase unsubmitted floor draft');
s.otherworld.floor=2;updateOtherworldPanel(host,s);s.otherworld.floor=3;updateOtherworldPanel(host,s);assert.equal(input.value,'2','automatic progression through the draft number cannot make it clean');
s.otherworld.pendingEquipment=[item('weapon',100,null,1,{originRace:'human'})];updateOtherworldPanel(host,s);assert.equal(nodes.get('[data-ow-text="pending"]').textContent,'1');assert.equal(nodes.get('[data-otherworld="claim"]').disabled,false);
s.otherworld.autoAdvance=false;updateOtherworldPanel(host,s);assert.equal(nodes.get('[data-otherworld="auto"]').attrs['aria-pressed'],'false');
const stable=JSON.stringify(s);updateOtherworldPanel(host,s);assert.equal(JSON.stringify(s),stable,'DOM update never mutates game state');assert.equal(writes,0);
const html=renderOtherworldPanel(s);assert.match(html,/data-otherworld="floor">切换层数/);assert.match(html,/data-otherworld="exit">退出异界/);assert.match(html,/otherworldStorageHint/);assert.doesNotMatch(html,/本场结束后换层|本场结束后退出/);
s.otherworld.active=false;updateOtherworldPanel(host,s);assert.equal(writes,1,'exit clears control host');
const app=fs.readFileSync('dist/app.js','utf8');assert.match(app,/updateOtherworldPanel\(\$\('otherworldPanelHost'\),s\)/);assert.doesNotMatch(app,/host\.innerHTML!==html&&document\.activeElement\?\.id!=='otherworldFloor'/);
console.log('PASS stable otherworld: 40 busy/victory ticks retain button/input identities, live stats/floor/range/pending, focus+draft preservation, no state mutation, fixed action copy and reserved status rows.');
