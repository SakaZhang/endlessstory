import {normalizeDivineStones} from './dist/divine-stone-state.js';
import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
import {SAVE_KEY,loadProgress} from './dist/storage.js';
import {claimTaskReward,createTaskRewardService,validTaskRewardState,TASK_REWARD_REGISTRY} from './dist/task-reward-transaction.js';
const clone=structuredClone;
function store(game){const data=new Map([[SAVE_KEY,JSON.stringify(game)]]);return {fail:false,writes:0,get length(){return data.size},key:i=>[...data.keys()][i],getItem:k=>data.get(k)??null,removeItem:k=>data.delete(k),setItem(k,v){if(this.fail)throw Error('quota');this.writes++;data.set(k,v);}};}
function fixture(s,{costs=[],rewards=[{kind:'material',key:'铁屑|0',quantity:2}],eligible=()=>true}={}){
 normalizeDivineStones(s); // Current-version fixture: reload must not need a historical ledger migration.
 const definitions={'test.claim':{isEligible:eligible,materials:costs,rewards}};
 return {storage:store(s),claim:createTaskRewardService(definitions),definitions};
}
function unchanged(s,storage,before,raw){assert.deepEqual(s,before);assert.equal(storage.getItem(SAVE_KEY),raw);}
assert(Object.keys(TASK_REWARD_REGISTRY).length>=5,'authored NPC definitions are sealed in production');
let s=E.fresh(),f=fixture(s),before=clone(s),raw=f.storage.getItem(SAVE_KEY);
assert.equal(claimTaskReward(f.storage,s,'test.claim').reason,'not-available');unchanged(s,f.storage,before,raw);assert.equal(f.storage.writes,0);
// Actual inventory submission, successful save, immutable caller and idempotent reload.
f=fixture(s,{costs:[{key:'铁屑|0',quantity:2},{key:'铁屑|0',quantity:1}]});
let result=f.claim(f.storage,s,'test.claim',{now:1000});assert(result.ok);assert.equal(result.game.materialStacks['铁屑|0'],4);assert.equal(result.game.taskRewardClaims[0],'test.claim');assert.equal(f.storage.writes,1);assert.deepEqual(s,before);
let reloaded=loadProgress(f.storage);assert(!reloaded.blocked);assert(E.validSave(reloaded.game));assert(validTaskRewardState(reloaded.game));assert.equal(f.claim(f.storage,reloaded.game,'test.claim').reason,'already-claimed');assert.equal(f.storage.writes,1);
// A stale original snapshot cannot replay a committed claim or overwrite a newer save.
assert.equal(f.claim(f.storage,s,'test.claim').reason,'already-claimed');
s=E.fresh();f=fixture(s);const newer=clone(s);newer.gold++;f.storage.setItem(SAVE_KEY,JSON.stringify(newer));assert.equal(f.claim(f.storage,s,'test.claim').reason,'stale-state');assert.equal(JSON.parse(f.storage.getItem(SAVE_KEY)).gold,newer.gold);
// Insufficient current stock after an item was spent/discarded never consumes partial costs.
s=E.fresh();f=fixture(s,{costs:[{key:'铁屑|0',quantity:3},{key:'炉火晶|0',quantity:3}]});before=clone(s);raw=f.storage.getItem(SAVE_KEY);assert.equal(f.claim(f.storage,s,'test.claim').reason,'materials');unchanged(s,f.storage,before,raw);
// Per-stack quantity limit: whole reward batch rolls back, remains eligible, and retries.
// All canonical stacks now fit; do not invent invalid material names to fill the bag.
const keys=Object.keys(E.MATERIALS).flatMap(m=>[0,1,2,3].map(q=>E.materialKey(m,q)).filter(Boolean));
s=E.fresh();s.materialStacks=Object.fromEntries(keys.slice(0,100).map(k=>[k,2]));const newKey=keys.find(k=>!Object.hasOwn(s.materialStacks,k));assert(newKey);s.materialStacks[newKey]=1e12;assert(E.validSave(s));
f=fixture(s,{costs:[{key:keys[0],quantity:1}],rewards:[{kind:'material',key:keys[1],quantity:1},{kind:'material',key:newKey,quantity:1}]});before=clone(s);raw=f.storage.getItem(SAVE_KEY);assert.equal(f.claim(f.storage,s,'test.claim').reason,'reward-unavailable');unchanged(s,f.storage,before,raw);assert(!s.taskRewardClaims);
delete s.materialStacks[newKey];f.storage.setItem(SAVE_KEY,JSON.stringify(s));result=f.claim(f.storage,s,'test.claim');assert(result.ok);assert.equal(result.game.materialStacks[keys[0]],1);assert.equal(result.game.materialStacks[keys[1]],3);assert.equal(result.game.materialStacks[newKey],1);
// Consuming the last unit frees a stack for the reward; merging an existing stack also works.
s=E.fresh();s.materialStacks=Object.fromEntries(keys.slice(0,100).map(k=>[k,1]));f=fixture(s,{costs:[{key:keys[0],quantity:1}],rewards:[{kind:'material',key:newKey,quantity:1}]});assert(f.claim(f.storage,s,'test.claim').ok);
f=fixture(s,{rewards:[{kind:'material',key:keys[1],quantity:1}]});assert(f.claim(f.storage,s,'test.claim').ok);
// Equipment capacity and forge pending slot are independent; task claim never consumes it.
s=E.fresh();while(E.bagCounts(s).equipment.weapon<50)s.inventory.push(E.item('weapon',1,null,0));const gear=E.item('weapon',1,null,0);s.pendingForgeClaim={kind:'equipment',item:E.item('ring',1,null,0)};assert(E.validSave(s));f=fixture(s,{rewards:[{kind:'equipment',item:gear}]});before=clone(s);raw=f.storage.getItem(SAVE_KEY);assert.equal(f.claim(f.storage,s,'test.claim').reason,'reward-unavailable');unchanged(s,f.storage,before,raw);s.inventory.pop();f.storage.setItem(SAVE_KEY,JSON.stringify(s));result=f.claim(f.storage,s,'test.claim');assert(result.ok);assert.deepEqual(result.game.pendingForgeClaim,s.pendingForgeClaim);assert(result.game.inventory.some(it=>it.id===gear.id));
// Battle filters do not discard task rewards, and are preserved exactly.
s=E.fresh();E.setLootFilter(s,'materials',[0]);f=fixture(s);result=f.claim(f.storage,s,'test.claim');assert(result.ok);assert.equal(result.game.materialStacks['铁屑|0'],7);assert.deepEqual(result.game.lootFilters,s.lootFilters);
// Persistence failure cannot leak materials/completion; retries use the same fixed output.
s=E.fresh();f=fixture(s,{costs:[{key:'铁屑|0',quantity:1}],rewards:[{kind:'equipment',item:gear}]});before=clone(s);raw=f.storage.getItem(SAVE_KEY);f.storage.fail=true;assert.equal(f.claim(f.storage,s,'test.claim').reason,'storage');unchanged(s,f.storage,before,raw);f.storage.fail=false;result=f.claim(f.storage,s,'test.claim');assert(result.ok);assert.deepEqual(result.game.inventory.at(-1),gear);
// Eligibility is checked again and cannot mutate the candidate. Registry edits cannot reroll outputs.
s=E.fresh();f=fixture(s,{eligible:state=>{state.gold=0;return state.level>=2;}});assert.equal(f.claim(f.storage,s,'test.claim').reason,'not-ready');s.level=2;f.storage.setItem(SAVE_KEY,JSON.stringify(s));f.definitions['test.claim'].rewards[0].quantity=99;result=f.claim(f.storage,s,'test.claim');assert(result.ok);assert.equal(result.game.gold,s.gold);assert.equal(result.game.materialStacks['铁屑|0'],7);
// Malformed current ledger, invalid cost/reward, duplicate gem rewards are all atomic rejects.
for(const ledger of [null,{},['x','x'],[''],[1]]){s=E.fresh();s.taskRewardClaims=ledger;assert(!validTaskRewardState(s));f=fixture(s);assert.equal(f.claim(f.storage,s,'test.claim').reason,'invalid-state');assert.equal(f.storage.writes,0);}
for(const options of [{costs:[{key:'unknown|0',quantity:1}]},{rewards:[{kind:'material',key:'铁屑|0',quantity:-1}]},{rewards:[{kind:'equipment',item:{id:'bad'}}]}]){s=E.fresh();f=fixture(s,options);before=clone(s);raw=f.storage.getItem(SAVE_KEY);assert(!f.claim(f.storage,s,'test.claim').ok);unchanged(s,f.storage,before,raw);}
const gem=Object.keys(E.MATERIALS).find(k=>E.MATERIALS[k].uniqueHeld);assert(gem);s=E.fresh();f=fixture(s,{rewards:[{kind:'material',key:E.materialKey(gem,3)},{kind:'material',key:E.materialKey(gem,3)}]});assert.equal(f.claim(f.storage,s,'test.claim').reason,'unique-held');assert.equal(f.storage.writes,0);
// The storage helper stamps lastSeen after operation validation; bound it here.
for(const now of [NaN,Infinity,-1,1e16]){s=E.fresh();f=fixture(s);before=clone(s);raw=f.storage.getItem(SAVE_KEY);assert.equal(f.claim(f.storage,s,'test.claim',{now}).reason,'invalid-clock');unchanged(s,f.storage,before,raw);assert.equal(f.storage.writes,0);}
s=E.fresh();f=fixture(s);result=f.claim(f.storage,s,'test.claim',{now:1e15});assert(result.ok);assert(E.validSave(result.game));
// Present current states remain valid without any migration or added ledger.
assert(validTaskRewardState(E.fresh()));assert(E.validSave(E.fresh()));
console.log('PASS task reward service: sealed authored registry, real current save/reload, quantity-limit retry, aggregate costs, atomic batch rewards/completion, forge independence, filters, fixed outputs, save rollback, idempotency, current-stock and gem checks. Authored NPC quest tests are separate.');
