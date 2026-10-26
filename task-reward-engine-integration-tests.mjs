import assert from 'node:assert/strict';
import * as Engine from './dist/engine.js';
import {TASK_REWARD_REGISTRY,claimTaskReward} from './dist/task-reward-transaction.js';
import {SAVE_KEY} from './dist/save-generation.js';
assert.equal(Engine.claimTaskReward,claimTaskReward);
assert.equal(Object.hasOwn(Engine,'createTaskRewardService'),false,'no public arbitrary-reward factory on Engine');
assert(Object.isFrozen(TASK_REWARD_REGISTRY));assert.deepEqual(TASK_REWARD_REGISTRY,{});
for(const ledger of [null,{},'x',[null],[undefined],[1],[''],['bad id'],['x','x'],Array(1),['x',...Array(2)],Array.from({length:10001},(_,i)=>'claim.'+i)]){
 const s=Engine.fresh();s.taskRewardClaims=ledger;const before=structuredClone(s);assert.equal(Engine.validSave(s),false,'malformed ledger must fail real import/save validation');assert.deepEqual(s,before);
}
for(const race of ['dwarf','human','elf','goblin','ashen']){
 const s=Engine.fresh(race);assert(Engine.validSave(s));assert.equal(s.taskRewardClaims,undefined,'existing schema6 fresh state unchanged');
 for(const ledger of [undefined,[],['approved.saved.id']]){const game=structuredClone(s);if(ledger!==undefined)game.taskRewardClaims=ledger;assert(Engine.validSave(game));const before=structuredClone(game),raw=JSON.stringify(game);let reads=0,writes=0;const storage={getItem(key){assert.equal(key,SAVE_KEY);reads++;return raw},setItem(){writes++;throw Error('unexpected write')}};for(const id of ['not.registered','approved.saved.id','test.claim','__proto__','']){const result=Engine.claimTaskReward(storage,game,id);assert.equal(result.ok,false);assert.equal(result.reason,'not-available');assert.equal(result.game,game);assert.deepEqual(game,before);}assert.equal(reads,0);assert.equal(writes,0);}
}
console.log('PASS engine task boundary: malformed/sparse ledger rejected, current schema6 unchanged, five races, sealed empty-registry claim unavailable with no reads/writes/mutation; no quest activation or factory API.');
