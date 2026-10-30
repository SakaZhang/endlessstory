import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
import * as T from './dist/skill-tree-state.js';
import {mountSkillTree} from './dist/skill-tree-ui.js';
const now=Date.now(),config=E.SKILL_TREE_DEFINITION,root=config.nodes.find(n=>n.id==='fracture_strike');
function defeated(){const s=E.fresh();s.level=root.cost+1;E.normalizeHealth(s,now);E.normalizeExpedition(s);const e=E.startRoutedEncounter(s,now);assert(e);s.heroHp=e.heroHp=1;for(const u of e.enemies){u.hp=u.max=1e8;u.atk=1e8;u.nextBasicAt=now;}E.step(s,e,s.nextActionAt);assert(e.done&&!e.win);assert(s.restResume&&s.running&&s.restUntil>now);return s;}
const guard=s=>JSON.stringify([s.restUntil,s.heroHp,s.running,s.restResume,s.siteId,s.expedition,s.otherworld,s.nextActionAt]);
let s=defeated(),before=guard(s),draft=T.beginSkillTreeDraft(s,config);assert(draft);draft=T.editSkillTreeDraft(draft,config,{type:'unlock',skillId:root.id});assert(draft);assert.equal(T.skillPresetCost(draft.preview.presets[0],config),root.cost);assert.equal(T.editSkillTreeDraft(draft,config,{type:'unlock',skillId:root.id}),null,'duplicate points not free');
let quote=T.quoteSkillTreeDraft(s,draft,config,{confirm:true});assert(quote);const original=JSON.stringify(s);const quota=T.commitSkillTreeDraft({setItem(){throw Error('quota')}},s,quote,config);assert.equal(quota.ok,false);assert.equal(JSON.stringify(s),original);
const storage={setItem(k,v){this.raw=v;}};let tx=T.commitSkillTreeDraft(storage,s,quote,config);assert(tx.ok);s=JSON.parse(storage.raw);assert(E.validSave(s));assert.equal(guard(s),before);assert.equal(T.prepareSkillTreeDraft(s,quote,config),null,'stale draft is rejected after reload');assert.equal(E.startRoutedEncounter(s,s.restUntil-1),null);assert.equal(s.heroHp,0);
const deadline=s.restUntil;assert.equal(E.settleRest(s,deadline-1),false);assert.equal(s.restUntil,deadline);
// Real editor must enable application while retaining the auto-resume flags.
const events={},host={innerHTML:'',contains:x=>x.host===host,addEventListener:(k,f)=>events[k]=f,removeEventListener:k=>delete events[k]};let commits=0;
const ui=mountSkillTree(host,{getState:()=>s,commit:async payload=>{const draft=T.draftSkillTreePresetPayload(s,config,payload),quote=T.quoteSkillTreeDraft(s,draft,config,{confirm:true}),tx=T.commitSkillTreeDraft(storage,s,quote,config);if(tx.ok){s=tx.game;commits++;}return tx;}});
const click=async(action,id)=>events.click({target:{closest:()=>({host,dataset:{treeAction:action,treeId:id}})}});
assert(!host.innerHTML.includes('结束当前战斗并停止远征后确认应用'));
await click('reset');await click('refund-confirm');assert.equal(s.skillTree.presets[0].unlocked.length,1,'draft reset does not erase saved points');assert.equal(T.skillPresetCost(ui.getDraft().skillTree.presets[0],config),0);await click('cancel');assert.equal(T.skillPresetCost(ui.getDraft().skillTree.presets[0],config),root.cost);
await click('reset');await click('refund-confirm');await click('commit');assert.equal(commits,1);assert.equal(s.skillTree.presets[0].unlocked.length,0);assert.equal(s.restUntil,deadline);assert(s.running&&s.restResume);assert.equal(s.heroHp,0);
await click('node',root.id);s.running=false;s.restResume=false;ui.refresh();await click('commit');assert.equal(commits,2);assert(!s.running&&!s.restResume,'explicit stop wins over an open draft');assert.equal(s.restUntil,deadline);assert(E.settleRest(s,deadline));assert(!s.running);assert.equal(s.heroHp,E.stats(s).hp);ui.dispose();
// Rest expiry changes edit eligibility, not the earned budget or local draft.
s=defeated();let expiryCommits=0;const expiryUi=mountSkillTree(host,{getState:()=>s,commit:async payload=>{expiryCommits++;const draft=T.draftSkillTreePresetPayload(s,config,payload),q=T.quoteSkillTreeDraft(s,draft,config,{confirm:true}),tx=T.commitSkillTreeDraft(storage,s,q,config);if(tx.ok)s=tx.game;return tx;}});
await click('node',root.id);const duringRestDraft=T.editSkillTreeDraft(T.beginSkillTreeDraft(s,config),config,{type:'unlock',skillId:root.id}),duringRestQuote=T.quoteSkillTreeDraft(s,duringRestDraft,config,{confirm:true});
E.settleRest(s,s.restUntil);expiryUi.refresh();assert(s.running);assert(host.innerHTML.includes('结束当前战斗并停止远征后确认应用'));assert.equal(T.skillPresetCost(expiryUi.getDraft().skillTree.presets[0],config),root.cost);assert.equal(T.prepareSkillTreeDraft(s,duringRestQuote,config),null);await click('commit');assert.equal(expiryCommits,0);
s.running=false;expiryUi.refresh();await click('commit');assert.equal(expiryCommits,1);assert.equal(T.skillPresetCost(s.skillTree.presets[0],config),root.cost);expiryUi.dispose();
// A paused unfinished battle is never a rest permission loophole.
for(const running of [true,false]){const blocked=defeated();blocked.running=running;blocked.activeEncounter={done:false};assert.equal(T.beginSkillTreeDraft(blocked,config),null);assert.equal(T.quoteSkillTreeChange(blocked,config,{type:'reset'}),null);}
console.log('PASS rest skill tree: real defeat, editor apply/reset/cancel, unchanged timer/HP/route, earned budget, quota/reload/stale, no early combat, explicit stop and paused battle guards');
