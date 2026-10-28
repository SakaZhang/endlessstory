import assert from 'node:assert/strict';
import {fresh} from './dist/engine.js';
import {RACE_PACKS} from './dist/race-registry.js';
import {mountSkillTree} from './dist/skill-tree-ui.js';
import {skillPresetCost,validSkillTree} from './dist/skill-tree-state.js';

for(const pack of Object.values(RACE_PACKS)){
 const D=pack.tree;
 let live=fresh();live.race=pack.id;live.skillTree.configId=D.id;live.level=100;
 const p=live.skillTree.presets[0];p.unlocked=D.nodes.map(n=>n.id);
 const leaves=D.nodes.filter(n=>!D.nodes.some(other=>other.requires.includes(n.id)));
 const active=leaves.find(n=>n.kind==='active'),passive=leaves.find(n=>n.kind==='passive');
 assert(active&&passive,`${pack.id}: active and passive leaves`);
 p.active=[active.id,null,null,null];p.conditions=['low','always','always','always'];p.passive=[passive.id,null];
 assert(validSkillTree(live,D));
 const original=structuredClone(live),listeners={};let focusCount=0,scrollCount=0,commits=0,reject=true;
 const review={focus(){focusCount++;},scrollIntoView(){scrollCount++;}};
 const host={innerHTML:'',contains:b=>b.owner===host,querySelector:selector=>selector==='.treeReview'&&host.innerHTML.includes('class="treeReview"')?review:null,addEventListener(k,f){listeners[k]=f;},removeEventListener(k){delete listeners[k];}};
 const ui=mountSkillTree(host,{getState:()=>live,getDefinition:()=>D,commit:async payload=>{commits++;if(reject)return {ok:false,reason:'保存失败'};live.skillTree.presets=structuredClone(payload.presets);return {ok:true};}});
 const click=async(action,id='')=>listeners.click({target:{closest:()=>({owner:host,dataset:{treeAction:action,treeId:id}})}});
 const draft=()=>ui.getDraft().skillTree.presets[0];
 for(const leaf of [active,passive]){
  const cost=skillPresetCost(draft(),D);
  await click('node',leaf.id);
  assert(!draft().unlocked.includes(leaf.id),`${pack.id}: minus refunds immediately`);
  assert.equal(skillPresetCost(draft(),D),cost-leaf.cost);
  assert(!host.innerHTML.includes('class="treeReview"'),'leaf needs no second confirmation');
  assert.equal(draft()[leaf.kind][0],null,'refunded skill leaves slot');
  if(leaf.kind==='active')assert.equal(draft().conditions[0],'always');
  assert.deepEqual(live,original,'minus never changes live state');
  await click('node',leaf.id);assert(draft().unlocked.includes(leaf.id),'plus restores allocation');
  await click('node',leaf.id);assert(!draft().unlocked.includes(leaf.id),'repeated plus/minus works');
 }
 await click('cancel');assert.deepEqual(ui.getDraft(),original,'cancel restores allocations and slots');
 const root=D.nodes.find(n=>D.nodes.some(other=>other.requires.includes(n.id)));
 await click('node',root.id);
 assert(draft().unlocked.includes(root.id),'cascade waits for confirmation');
 assert(host.innerHTML.indexOf('class="treeReview"')<host.innerHTML.indexOf('class="treeGraphToolbar"'),'review precedes long graph and slots');
 assert.equal(focusCount,1);assert.equal(scrollCount,1,'cascade review brought into view');
 await click('commit');assert.equal(commits,0,'pending cascade cannot be applied');
 await click('refund-cancel');assert.deepEqual(ui.getDraft(),original);
 await click('node',root.id);await click('refund-confirm');
 assert(!draft().unlocked.includes(root.id));assert(validSkillTree(ui.getDraft(),D));assert.deepEqual(live,original);
 await click('cancel');await click('node',active.id);
 await click('commit');assert.equal(commits,1);assert.deepEqual(live,original);assert(!draft().unlocked.includes(active.id),'save failure retains refund draft');
 reject=false;await click('commit');assert.equal(commits,2);assert(!live.skillTree.presets[0].unlocked.includes(active.id));
 live.running=true;ui.refresh();await click('node',passive.id);await click('commit');assert.equal(commits,2,'combat still blocks application');assert(live.skillTree.presets[0].unlocked.includes(passive.id));
 await click('cancel');await click('reset');assert(host.innerHTML.includes('class="treeReview"'),'reset always retains confirmation');await click('refund-cancel');
 live.running=false;ui.refresh();await click('reset');await click('refund-confirm');
 const bareRoot=D.nodes.find(n=>n.requires.length===0&&D.nodes.some(other=>other.requires.includes(n.id)));
 await click('node',bareRoot.id);await click('node',bareRoot.id);assert.equal(draft().unlocked.length,0,'root without learned dependents refunds immediately');assert(!host.innerHTML.includes('class="treeReview"'));
 await click('node',bareRoot.id);await click('reset');assert(host.innerHTML.includes('class="treeReview"'),'single-node full reset still confirms');await click('refund-confirm');assert.equal(draft().unlocked.length,0);
 ui.dispose();assert.deepEqual(listeners,{});
 console.log(`PASS ${pack.id}: immediate leaf minus, points/slots, repeat/cancel, visible cascade, save failure/retry, combat guard`);
}
