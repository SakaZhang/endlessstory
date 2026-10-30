import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
import * as P from './dist/character-progression.js';
import * as O from './dist/otherworld-entitlement.js';
import {freshOtherworldState} from './dist/otherworld-state.js';
import {loadProgress,SAVE_KEY} from './dist/storage.js';
import {reachStoryScene} from './story-event-test-fixture.mjs';
function store(s,{quota=false,stale=false}={}){let raw=JSON.stringify(s),writes=0,reads=0;return {length:1,key:()=>SAVE_KEY,get raw(){return raw},get writes(){return writes},getItem(k){if(k!==SAVE_KEY)return null;reads++;return stale&&reads>1?JSON.stringify({...s,gold:s.gold+1}):raw},setItem(k,v){if(quota)throw Error('quota');assert.equal(k,SAVE_KEY);writes++;raw=v},removeItem(){}};}
let completed;
for(const [race,code] of Object.entries({human:'H',dwarf:'D',elf:'E',goblin:'G',ashen:'A'})){
 const before=reachStoryScene(race,'END.'+code+'01.'+race,{spring:'skip'});assert(!O.hasCanonicalEpilogue(before));assert(!before.otherworld?.stoneGranted);assert(!O.reconcileOtherworldStone(before));
 const s=reachStoryScene(race,'END.'+code+'01.'+race,{spring:'skip',finishTarget:true});assert(O.hasCanonicalEpilogue(s));assert(s.otherworld.stoneGranted);assert(!s.otherworld.stoneUsed);assert(!O.reconcileOtherworldStone(s));assert(E.validSave(s));
 const old=structuredClone(s);delete old.otherworld;const storage=store(old),loaded=loadProgress(storage);assert(!loaded.blocked);assert(loaded.game.otherworld.stoneGranted);assert.equal(storage.writes,1);assert(!loadProgress(storage).blocked);assert.equal(storage.writes,1);
 const quota=store(old,{quota:true}),blocked=loadProgress(quota);assert(blocked.blocked);assert.equal(blocked.game.otherworld,undefined);assert.deepEqual(JSON.parse(quota.raw),old);
 assert.equal(loadProgress(store(old,{stale:true})).reason,'stale-state');
 const forgery=structuredClone(old);forgery.story.completedScenes.pop();assert(!O.hasCanonicalEpilogue(forgery));assert(loadProgress(store(forgery)).blocked);
 if(race==='human')completed=s;
}
const fresh=E.fresh(),unchanged=store(fresh);assert(!loadProgress(unchanged).blocked);assert.equal(unchanged.writes,0);assert.equal(fresh.otherworld,undefined);
const s=completed;s.level=100;s.xp=8000;const storage=store(s),before=JSON.stringify(s);assert.equal(O.transactOtherworldStone(store(s,{quota:true}),s).reason,'storage');assert.equal(JSON.stringify(s),before);
assert.equal(O.transactOtherworldStone(storage,s,{now:1e16}).reason,'invalid-clock');
const used=O.transactOtherworldStone(storage,s,{now:s.lastSeen});assert(used.ok);assert.equal(used.game.level,100);assert.equal(used.game.xp,8000);assert(used.game.otherworld.stoneUsed);assert(!O.useOtherworldStone(used.game));assert.equal(O.transactOtherworldStone(storage,s).reason,'stale-state');assert(!loadProgress(storage).blocked);assert.equal(storage.writes,1);
let p={level:99,xp:0,otherworld:freshOtherworldState()};P.applyExperience(p,7920);assert.equal(p.level,100);assert.equal(P.applyExperience(p,9999).acceptedXp,0);p.otherworld.stoneGranted=p.otherworld.stoneUsed=true;const oldTotal=P.totalEarnedXp(p);P.applyExperience(p,7920*3+42);assert.equal(p.level,103);assert.equal(p.xp,42);assert.equal(P.totalEarnedXp(p)-oldTotal,7920*3+42);assert.equal(P.getXpRequirement(p),7920);assert(!P.isLevelCapped(p));
const base=E.talentPointBudget(used.game);P.applyExperience(used.game,7920*4);assert.equal(E.talentPointBudget(used.game)-base,5);assert(E.validSave(used.game));
const ring={level:100,xp:0,otherworld:{stoneUsed:true},inventory:[{id:'ring',legendaryId:'return-ring',exclusive:{id:'return-home'}}],equip:{ring1:'ring'}};const ringResult=P.applyExperience(ring,6600);assert.equal(ringResult.acceptedXp,7920);assert.equal(ring.level,101);
const single={level:100,xp:0,otherworld:{stoneUsed:true}},split=structuredClone(single);P.applyExperience(single,7920*4+100);for(let i=0;i<4;i++)P.applyExperience(split,7920);P.applyExperience(split,100);assert.deepEqual(single,split);assert.equal(P.totalEarnedXp(single)-396000,31780);
const replay=structuredClone(used.game);replay.level=100;replay.xp=7919;const replayNow=Math.max(replay.lastSeen,replay.lastHealthClock??0)+2000;assert(E.chooseAdventureNode(replay,'human.a01.field',{start:true},replayNow));replay.lastSeen=replayNow;const replayBefore=P.totalEarnedXp(replay),receipt=E.offline(replay,replayNow+60000);assert(receipt?.kills>0);assert(replay.level>100);assert.equal(receipt.xp,P.totalEarnedXp(replay)-replayBefore);assert(E.validSave(replay));
const guard={level:99998,xp:0,otherworld:{stoneUsed:true}};P.applyExperience(guard,1e12);assert.equal(guard.level,99999);assert(P.isLevelCapped(guard));assert.equal(P.applyExperience(guard,10).acceptedXp,0);
console.log('PASS five canonical endings, protected once-only stone, old-save persisted reconciliation, quota/stale/reload safety, forged gates, explicit idempotent use, preserved XP, 7920 constant post100, multilevel/receipt parity, ring20%, talent budget and 99999 numeric guard');
