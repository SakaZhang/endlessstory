import {createLegendaryEquipment} from './dist/legendary-equipment.js';
import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
import {reachStoryScene} from './story-event-test-fixture.mjs';
import {freshOtherworldState} from './dist/otherworld-state.js';
import {normalizeDivineStones,validDivineStones,awardDivineStone,divineStoneBalance} from './dist/divine-stone-state.js';
import {quoteDivineStone,applyDivineStone,transactDivineStone} from './dist/divine-stone.js';
import {loadProgress,SAVE_KEY,commitGameTransaction} from './dist/storage.js';
import {renderDivineStoneForge} from './dist/divine-stone-ui.js';
const make=(highest=0)=>{const s=reachStoryScene('human','END.H01.human',{finishTarget:true,level:100,spring:'skip'});s.running=false;s.activeEncounter=null;delete s.divineStones;s.otherworld={...freshOtherworldState(),highestCleared:highest,floor:highest+1};assert(E.validSave(s));return s;};
const memory=s=>{let raw=JSON.stringify(s);return {getItem:k=>k===SAVE_KEY?raw:null,setItem(k,v){if(k===SAVE_KEY)raw=v;},removeItem(){},key(){return null;},get length(){return 0;}};};
// Historical clear baseline never turns into awards, even after migration and reload.
for(const highest of [0,49,50,99,100,123,1800]){const s=make(highest),store=memory(s),loaded=loadProgress(store);assert(!loaded.blocked,highest);assert.equal(loaded.game.divineStones.baseline,Math.floor(highest/50));assert.equal(divineStoneBalance(loaded.game),0);assert.equal(divineStoneBalance(loadProgress(store).game),0);assert(!awardDivineStone(loaded.game,Math.floor(highest/50)*50));}
// New exact milestones, duplicate and malformed awards; original unrelated world stone untouched.
{
 const s=make(49),before=structuredClone(s.otherworld);assert(awardDivineStone(s,50));s.otherworld.highestCleared=50;s.otherworld.floor=51;assert(E.validSave(s));assert.equal(divineStoneBalance(s),1);assert(!awardDivineStone(s,50));assert(!awardDivineStone(s,51));s.otherworld.highestCleared=99;s.otherworld.floor=100;assert(awardDivineStone(s,100));s.otherworld.highestCleared=100;s.otherworld.floor=101;assert.equal(divineStoneBalance(s),2);assert(E.validSave(s));assert.equal(s.otherworld.stoneUsed,before.stoneUsed);assert.equal(s.otherworld.stoneGranted,before.stoneGranted);
 for(const mutate of [d=>d.spent=3,d=>d.claimed.push(100),d=>d.claimed[0]=49,d=>d.baseline=3,d=>d.extra=1]){const bad=structuredClone(s);mutate(bad.divineStones);assert(!validDivineStones(bad));assert(!E.validSave(bad));}
}
// Production win settlement awards once before highest update, works for migrated old saves.
for(const [highest,floor,expected]of [[49,50,1],[50,50,0],[99,100,1],[123,100,0]]){
 const s=make(highest);s.otherworld.floor=floor;assert(E.enterOtherworld(s,s.lastSeen+5000));const e=E.startRoutedEncounter(s,s.lastSeen+10000);assert(e);let turns=0;while(!e.done&&turns++<5000)E.step(s,e,s.nextActionAt);assert(e.win,'win floor '+floor);assert(E.validSave(s));assert(E.reward(s,e,s.lastSeen+12000));assert.equal(divineStoneBalance(s),expected);assert.equal(E.reward(s,e,s.lastSeen+13000),null);assert(E.validSave(s));assert.equal(divineStoneBalance(JSON.parse(JSON.stringify(s))),expected);
}
// Full equipment bags and every loot quality filter never suppress the milestone ledger.
{
 const s=make(49);for(const slot of E.SLOTS)for(let n=0;n<E.BAG_LIMITS.equipment;n++)s.inventory.push(E.item(slot,1,null,0,{baseLevel:1,levelSource:'drop',originRace:slot==='core'?'ashen':'human'}));
 E.setLootFilter(s,'equipment',[0,1,2,3,4]);assert(E.validSave(s));assert(E.enterOtherworld(s,s.lastSeen+5000));const e=E.startRoutedEncounter(s,s.lastSeen+10000);let turns=0;while(!e.done&&turns++<5000)E.step(s,e,s.nextActionAt);assert(e.win);assert(E.reward(s,e,s.lastHealthClock));assert.equal(divineStoneBalance(s),1);assert(E.validSave(s));
}
// Old already-won pending milestones are historical, while in-progress battles may earn after upgrade.
for(const doneBeforeUpgrade of [false,true]){
 const s=make(49);assert(E.enterOtherworld(s,s.lastSeen+5000));const e=E.startRoutedEncounter(s,s.lastSeen+10000);assert(e);
 if(doneBeforeUpgrade){let turns=0;while(!e.done&&turns++<5000)E.step(s,e,s.nextActionAt);assert(e.win);}
 delete s.divineStones;const store=memory(s),loaded=loadProgress(store);assert(!loaded.blocked);assert.equal(loaded.game.divineStones.baseline,doneBeforeUpgrade?1:0);assert(E.validSave(loaded.game));
 const until=Math.max(loaded.game.lastSeen,loaded.game.lastHealthClock??0)+120000;const out=E.offline(loaded.game,until);assert(out);assert(loaded.game.otherworld.highestCleared>=50);assert.equal(divineStoneBalance(loaded.game),doneBeforeUpgrade?0:1);assert(E.validSave(loaded.game));
 const tampered=structuredClone(loaded.game);tampered.divineStones.baseline+=2;assert(!E.validSave(tampered));
}
// One stone, no gold, no reroll; equipped, set, legendary and pre-existing growth all supported.
for(const mode of ['ordinary','set','legendary','growth']){
 const s=make(49);awardDivineStone(s,50);s.otherworld.highestCleared=50;s.otherworld.floor=51;
 let it=mode==='legendary'?createLegendaryEquipment({id:'stone-test-legend',legendaryId:'everburning-reactor',level:100,affixDefs:E.AFFIX_DEFS,random:()=>.4}):E.item('gloves',100,mode==='set'?'human_blood_oath':null,3,{baseLevel:100,levelSource:'drop',originRace:'human'});assert(it,mode);if(!s.inventory.includes(it))s.inventory.push(it);if(mode==='growth')it.special={id:'harvester',growthKills:123};assert(E.validSave(s),mode);
 const before=structuredClone(it),gold=s.gold,store=memory(s);const quote=quoteDivineStone(s,it.id);assert(quote.ok,quote.reason);const tx=transactDivineStone(store,s,it.id);assert(tx.ok,tx.reason);const after=tx.game.inventory.find(i=>i.id===it.id);assert(after.divine);assert.equal(tx.game.gold,gold);assert.deepEqual(after.affixes,before.affixes);assert.deepEqual(after.special,before.special);assert.deepEqual(Object.fromEntries(Object.entries(after).filter(([k])=>k!=='divine')),before);assert.equal(divineStoneBalance(tx.game),0);assert(!transactDivineStone(store,tx.game,it.id).ok);assert.equal(quoteDivineStone(tx.game,it.id).reason,'already-divine');assert(!transactDivineStone(store,s,it.id).ok,'stale duplicate snapshot');assert(E.validSave(tx.game));
}
// Quota failure leaves exact original state and resources; pending target and ongoing combat reject.
{
 const s=make(49);awardDivineStone(s,50);s.otherworld.highestCleared=50;s.otherworld.floor=51;const it=E.item('weapon',100,null,3,{baseLevel:100,levelSource:'drop',originRace:'human'});s.inventory.push(it);const original=JSON.stringify(s);const store={getItem:()=>original,setItem(){throw Error('quota');}};const tx=transactDivineStone(store,s,it.id);assert.equal(tx.reason,'storage');assert.equal(JSON.stringify(s),original);s.running=true;assert.equal(quoteDivineStone(s,it.id).reason,'busy');s.running=false;assert.match(renderDivineStoneForge(s,{slot:'weapon',itemId:it.id}),/天神之石 ×1/);assert.match(renderDivineStoneForge(s,{slot:'weapon',itemId:it.id}),/消耗1颗天神之石/);assert.match(renderDivineStoneForge(s,{slot:'weapon',itemId:it.id}),/不消耗金币/);
}
console.log('PASS v090 divine stone no-retro milestone migration, exact first-clear production awards, repeat/reload/old clears, validation, atomic furnace, special preservation, legendary/set, no gold, quota and stale rejection.');
