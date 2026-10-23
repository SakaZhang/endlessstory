/* v0.36 state/legacy-App integration tests; no new-tree rendering claim.
 * Candidate costs/prerequisites must never be treated as approved production data.
 * Actual engine/API and migration gate must be supplied before enabling tree tests.
 */
const {test}=require('node:test');
const assert=require('node:assert/strict');
const {spawnSync}=require('node:child_process');
const path=require('node:path');

test('actual App baseline: explicit legacy migration plus fresh active zero-point tree and ID-diff lifecycle',()=>{
 const result=spawnSync(process.execPath,[path.join(__dirname,'skill-tree-app-ui-tests.cjs')],{cwd:__dirname,encoding:'utf8'});
 assert.equal(result.status,0,result.stdout+'\n'+result.stderr);
});
const fs=require('node:fs');
const fixture={id:'ui-contract-fixture-not-production',nodes:[
 {id:'test_active',kind:'active',cost:2,requires:[]},
 {id:'test_passive',kind:'passive',cost:2,requires:['test_active']}
]};
test('pure state transactions: independent budgets, null slots, free reset and stale/quota protection',async()=>{
 const T=await import('./dist/skill-tree-state.js'),E=await import('./dist/engine.js');let s=E.fresh({legacySkillModel:true});s.level=5;
 const legacy=structuredClone({skills:s.skills,conditions:s.conditions,loadouts:s.loadouts}),talents=structuredClone(s.talents),equipment=structuredClone(s.equip),gold=s.gold;
 const store=new Map(),storage={setItem:(k,v)=>store.set(k,v)};
 function apply(change){const q=T.quoteSkillTreeChange(s,fixture,change);assert(q);const tx=T.commitSkillTreeChange(storage,s,q,fixture);assert(tx.ok);s=tx.game;}
 for(let index=0;index<3;index++){apply({type:'unlock',index,skillId:'test_active'});apply({type:'unlock',index,skillId:'test_passive'});apply({type:'slots',index,active:['test_active',null,null,null],passive:['test_passive',null]});}
 assert.deepEqual(s.skillTree.presets.map(p=>T.skillPresetCost(p,fixture)),[4,4,4]);assert.equal(T.skillPointBudget(s),4);
 assert.deepEqual(s.skillTree.legacy,legacy);assert.deepEqual(s.skills,legacy.skills);assert.equal(s.skillTree.mode,'prepared');
 const before=structuredClone(s),q=T.quoteSkillTreeChange(s,fixture,{type:'reset',index:1});
 const failed=T.commitSkillTreeChange({setItem(){throw Error('quota');}},s,q,fixture);assert(!failed.ok);assert.deepEqual(s,before);assert.strictEqual(failed.game,s);
 const reset=T.commitSkillTreeChange(storage,s,q,fixture);assert(reset.ok);s=reset.game;assert.deepEqual(s.skillTree.presets[1].active,[null,null,null,null]);assert.deepEqual(s.skillTree.presets[1].passive,[null,null]);assert.deepEqual(s.skillTree.presets[0],before.skillTree.presets[0]);assert.deepEqual(s.skillTree.presets[2],before.skillTree.presets[2]);assert.deepEqual(s.talents,talents);assert.deepEqual(s.equip,equipment);assert.equal(s.gold,gold);assert(!T.commitSkillTreeChange(storage,s,q,fixture).ok);
 assert.equal(T.quoteSkillTreeChange(s,fixture,{type:'activate'}),null);apply({type:'activate',confirm:true});assert.equal(s.skillTree.mode,'active');assert.deepEqual(s.skills,legacy.skills,'pure state does not silently change combat resolver');assert(T.validSkillTree(JSON.parse(JSON.stringify(s)),fixture));
 const busy=structuredClone(s);busy.activeEncounter={done:false};assert.equal(T.quoteSkillTreeChange(busy,fixture,{type:'reset'}),null);
});
test('actual App import/reload preserves prepared tree and legacy resolver without rendering unimplemented passive controls',()=>{
 const baseline=fs.readFileSync(path.join(__dirname,'quick-loadout-ui-tests.cjs'),'utf8');
 const harness=baseline.slice(0,baseline.indexOf('(async()=>'));
 const body=`(async()=>{const E=await import('./dist/engine.js'),T=await import('./dist/skill-tree-state.js');Date.now=()=>now;const config=E.SKILL_TREE_DEFINITION;const base=E.fresh({legacySkillModel:true});base.level=5;store.set('ashencrown-v2',JSON.stringify(base));await refresh('tree-prepared-before');const draft=saved(),legacy=structuredClone(draft.skills);const q=E.quoteSkillTreePreparation(draft,{type:'prepare'});assert(q);const out=E.prepareSkillTreePreparation(draft,q);assert(out);const incoming=out.game;assert.equal(incoming.skillTree.mode,'prepared');assert(incoming.skillTree.presets.every(p=>p.unlocked.length===0));assert(E.validSave(incoming));el('settingsBtn').onclick();await el('importFile').onchange({target:{files:[{text:async()=>JSON.stringify(incoming)}]}});assert.deepEqual(saved().skillTree,incoming.skillTree);assert.deepEqual(saved().skills,legacy);await refresh('tree-prepared-after');assert.deepEqual(saved().skillTree,incoming.skillTree);assert.deepEqual(saved().skills,legacy);const stable=structuredClone(saved());for(const invalid of ['foreign']){const bad=structuredClone(stable);if(invalid==='foreign')bad.skillTree.configId='unapproved-fixture';else bad.skillTree.mode='active';assert(!E.validSave(bad));el('settingsBtn').onclick();await el('importFile').onchange({target:{files:[{text:async()=>JSON.stringify(bad)}]}});assert.deepEqual(saved(),stable,'invalid tree import cannot alter live/save state');periodic();assert.deepEqual(saved(),stable);}assert.equal(E.quoteSkillTreePreparation(stable,{type:'activate',confirm:true}),null);click({view:'skills'});assert.equal((el('view').innerHTML.match(/class="skillSlot /g)||[]).length,4);assert(!el('view').innerHTML.includes('data-skill-tree-passive'));})().catch(e=>{console.error(e);process.exit(1)});`;
 const result=spawnSync(process.execPath,['-e',harness+body],{cwd:__dirname,encoding:'utf8'});assert.equal(result.status,0,result.stdout+'\n'+result.stderr);
});
