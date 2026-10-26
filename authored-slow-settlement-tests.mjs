import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
import {WORLD_MONSTERS} from './dist/world-content.js';
import {preparedStoryGame} from './story-event-test-fixture.mjs';
import {SAVE_KEY,loadProgress} from './dist/storage.js';
const clone=structuredClone;
const near=(a,b)=>assert(Math.abs(a-b)<1e-8,`${a} != ${b}`);
function fixture(seedValue=68){
 const original=Math.random;let seed=seedValue;Math.random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/2**32;};
 try{
  const s=preparedStoryGame('human');for(const [socket,id] of Object.entries(s.equip)){const old=s.inventory.find(it=>it.id===id),gear=E.item(old.slot,s.level,null,2,{originRace:s.race});s.inventory.push(gear);assert(E.equipItem(s,gear.id,socket));}
  const ring=E.legendaryItem('return-ring',1);s.inventory.push(ring);s.returnRing={version:1,recipeLearned:true,crafted:true,craftedItemId:ring.id};assert(E.equipItem(s,ring.id,'ring1'));s.heroHp=E.stats(s).hp*.6;E.normalizePotions(s);
  assert(E.startInstanceEncounter(s,'human.a03.boss',s.lastHealthClock+2000));s.lastSeen=s.lastHealthClock;s.stopAfterBattle=true;return s;
 }finally{Math.random=original;}
}
function stored(s){const raw=JSON.stringify(s);return {get length(){return 1},key:()=>SAVE_KEY,getItem:k=>k===SAVE_KEY?raw:null};}
const authored=[...new Set(Object.values(WORLD_MONSTERS).flatMap(d=>(d.skills??[]).flatMap(sk=>(sk.effects??[]).filter(f=>f.type==='next_basic_slow').map(f=>f.multiplier))))].sort();assert.deepEqual(authored,[1.15,1.2]);
const initial=fixture(),batch=clone(initial);let online=clone(initial),turns=0,slow=null,pending=null,micro=null,reloaded=false,slowApplications=0;
while(!online.activeEncounter.done&&turns++<3000){
 const e=online.activeEncounter,beforeRound=e.round,beforeEnemyRounds=e.enemies.map(u=>u.round),wasPending=e.pendingBasicAt!==undefined,oldSlow=e.nextBasicSlow;
 E.step(online,e,online.nextActionAt);assert(E.validSave(online),'legitimate boss state valid at turn '+turns);
 if(e.nextBasicSlow===1.2){slow??=clone(online);if(oldSlow!==1.2)slowApplications++;}
 if(e.pendingBasicDelayMs===220){pending??=clone(online);assert(e.pendingBasicAt<e.nextRegularAt);}
 if(e.basicMicroElapsed===220){micro??=clone(online);if(wasPending){assert.equal(e.round,beforeRound,'micro hit is not a second regular turn');assert.deepEqual(e.enemies.map(u=>u.round),beforeEnemyRounds,'micro hit is not an extra enemy turn');}}
 if(e.pendingBasicDelayMs===220&&!reloaded){const result=loadProgress(stored(online));assert(!result.blocked);online=result.game;reloaded=true;}
}
assert(slow&&pending&&micro&&reloaded,'real authored 20% boss slow traverses each saved state');assert(slowApplications>1,'repeated real slow applications stay valid');
// A completed micro duration is consumed once, not a stale permanent lag.
{const s=clone(micro),e=s.activeEncounter,clock=e.treeCombatClock,round=e.round;assert(!e.done);E.step(s,e,s.nextActionAt);assert.equal(e.treeCombatClock,clock+880);assert.equal(e.round,round+1);assert.equal(e.basicMicroElapsed,undefined);assert(E.validSave(s));}
// Pause/reload shifts deadlines, never the authored 220ms duration.
{const s=clone(pending),e=s.activeEncounter,at=s.lastHealthClock,due=e.pendingBasicAt,regular=e.nextRegularAt;assert(E.setMultiPaused(s,true,at));assert(E.setMultiPaused(s,false,at+30000));assert.equal(e.pendingBasicAt,due+30000);assert.equal(e.nextRegularAt,regular+30000);assert.equal(e.pendingBasicDelayMs,220);assert(E.validSave(s));const restored=loadProgress(stored(s));assert(!restored.blocked);E.step(restored.game,restored.game.activeEncounter,restored.game.nextActionAt);assert.equal(restored.game.activeEncounter.basicMicroElapsed,220);assert(E.validSave(restored.game));}

const win=online.activeEncounter;assert(win.done&&win.win);const beforeHp=online.heroHp,beforeGold=online.gold;E.reward(online,win,online.lastHealthClock);assert(win.rewarded);assert(online.gold>beforeGold);assert.equal(online.kills,1);near(online.heroHp,Math.min(E.stats(online).hp,beforeHp+.15*E.stats(online).hp));assert(E.validSave(online));
const settled=clone(online);E.reward(online,win,online.lastHealthClock+2000);assert.deepEqual(online,settled,'settlement remains exactly once');
const report=E.offline(batch,initial.lastSeen+180000);assert.equal(report.kills,1);assert.equal(report.rests,0);assert(E.validSave(batch));
for(const key of ['gold','xp','level','kills','heroHp','materialStacks','inventory','potionStacks','potionReadyAt','instanceCooldowns','returnRing'])assert.deepEqual(batch[key],online[key],'online/offline '+key);
// No broad numeric acceptance: only delays derived from exact authored effects.
for(const [key,source,values] of [
 ['nextBasicSlow',slow,[0,1,1.150001,1.19,1.200001,1.5,2,NaN,Infinity,'1.2']],
 ['pendingBasicDelayMs',pending,[-1,0,164,165.1,166,219,220.1,221,1100,Number.MAX_SAFE_INTEGER,Infinity,'220']],
 ['basicMicroElapsed',micro,[-1,0,164,165.1,166,219,220.1,221,1100,Number.MAX_SAFE_INTEGER,Infinity,'220']]
])for(const value of values){const bad=clone(source);bad.activeEncounter[key]=value;assert(!E.validSave(bad),key+' rejects '+String(value));}
for(const key of ['pendingBasicAt','nextRegularAt','lastCombatEventAt'])for(const value of [-1,.5,1e15+1,Infinity]){const bad=clone(pending);bad.activeEncounter[key]=value;assert(!E.validSave(bad),key+' rejects forged clock');}
for(const key of ['pendingBasicAt','pendingBasicDelayMs']){const bad=clone(pending);delete bad.activeEncounter[key];assert(!E.validSave(bad),'pending pair must remain coupled');}
{const bad=clone(pending);bad.activeEncounter.pendingBasicAt=bad.activeEncounter.nextRegularAt;assert(!E.validSave(bad),'pending hit precedes regular action');}
// Seed coverage exercises ordinary/drop settlement as-is, not just a handpicked
// valid heal case; every actual intermediate state must remain serializable.
let delayedWins=0;
for(let seed=1;seed<=100;seed++){
 const s=fixture(seed),offline=clone(s);let n=0;while(!s.activeEncounter.done&&n++<3000){E.step(s,s.activeEncounter,s.nextActionAt);assert(E.validSave(s),'seed '+seed+' turn '+n);}
 const e=s.activeEncounter;assert(e.done&&e.win,'seed '+seed+' victory');if(e.basicMicroElapsed===220)delayedWins++;E.reward(s,e,s.lastHealthClock);assert(e.rewarded,'seed '+seed+' reward');assert(E.validSave(s));const report=E.offline(offline,offline.lastSeen+180000);assert.equal(report.kills,1);assert(E.validSave(offline));for(const key of ['gold','xp','level','kills','heroHp','materialStacks','inventory','potionStacks','potionReadyAt','instanceCooldowns'])assert.deepEqual(offline[key],s[key],'seed '+seed+' online/offline '+key);
}
assert(delayedWins>0,'terminal delayed-basic wins are actually exercised');
console.log('PASS authored slows: real Human A03 seed68 1.2/220ms states, save/reload and terminal win, exact-once Ring/normal rewards, online/offline parity, strict forged-value/clock negatives, 100 seeded actual boss online/offline loops; no source/drop/luck changes.');
