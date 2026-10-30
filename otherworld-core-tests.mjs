import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
import {freshOtherworldState,validOtherworldState,OTHERWORLD_PENDING_LIMIT} from './dist/otherworld-state.js';
import {reachStoryScene} from './story-event-test-fixture.mjs';
import {normalizeMonsterLedger,inferEncounterMonsterIds} from './dist/monster-codex-schema.js';
import {commitGameTransaction} from './dist/storage.js';
const codes={human:'H',dwarf:'D',elf:'E',goblin:'G',ashen:'A'},at=s=>Math.max(s.lastSeen,s.lastHealthClock??0,s.nextBattleAt??0)+2000;
export function endgame(race='human'){const s=reachStoryScene(race,`END.${codes[race]}01.${race}`,{finishTarget:true,level:100,spring:'skip'});s.running=false;s.heroHp=E.stats(s).hp;return s;}
export function win(s,{seed=12345}={}){let e=E.startRoutedEncounter(s,at(s));assert(e);e.rngState=seed;let n=0;while(!e.done&&n++<3000){E.step(s,e,s.nextActionAt);assert(E.validSave(s),'valid tower turn');}assert(e.done);if(e.win)assert(E.reward(s,e,s.lastHealthClock));return {e,rounds:n};}
const old=E.fresh();assert(E.validSave(old));assert(!E.enterOtherworld(old,at(old)));for(const bad of [null,{}, {...freshOtherworldState(),pendingEquipment:null},{...freshOtherworldState(),floor:0},{...freshOtherworldState(),floor:2}]){const s=structuredClone(old);s.otherworld=bad;assert(!E.validSave(s));}
const p1=E.otherworldFloorStats(1),p2=E.otherworldFloorStats(2);for(const key of ['hp','atk','armor'])assert.equal(p2[key],p1[key]*1.01);assert(E.otherworldFloorStats(E.OTHERWORLD_MAX_FLOOR).hp<=1e12);assert.equal(E.otherworldFloorStats(E.OTHERWORLD_MAX_FLOOR+1),null);
for(const race of Object.keys(codes)){
 const s=endgame(race),original={site:s.siteId,location:s.location,route:structuredClone(s.expedition)},protectedFields=()=>JSON.stringify({gold:s.gold,materials:s.materialStacks,consumables:s.consumables,area:s.areaProgress,story:s.story,npc:s.npcEvents,npcProgress:s.npcObjectiveProgress,rare:s.rareRewardProgress,ring:s.returnRing,infinity:s.infinityGauntlet,cooldowns:s.instanceCooldowns,exploration:s.regionNavigation,monsters:s.monsterLedger,extra:s.extraBossChallenges});
 // Normalize before snapshot; normalizers are not tower discoveries.
 E.normalizeRegionNavigation(s);const before=protectedFields();assert(E.enterOtherworld(s,at(s)));assert.equal(E.nextEncounterRoute(s,at(s)).kind,'otherworld');
 const e=E.startRoutedEncounter(s,at(s));assert(e);assert(E.validSave(JSON.parse(JSON.stringify(s))));assert(!E.exitOtherworld(s));const probe=structuredClone(s);delete probe.monsterLedger;delete probe.regionNavigation;normalizeMonsterLedger(probe);E.normalizeRegionNavigation(probe);assert.deepEqual(probe.monsterLedger.encountered,{});assert.deepEqual(probe.regionNavigation.exploredNodeIds,[]);assert.deepEqual(inferEncounterMonsterIds(e),[]);assert.equal(E.startInstanceEncounter(s,race+'.a01.field',at(s)),null);assert(!E.configureExpedition(s,s.expedition));
 for(const mutate of [x=>delete x.otherworld,x=>x.otherworld.active=false,x=>x.activeEncounter.otherworld.floor=2,x=>x.activeEncounter.enemies[0].max++,x=>delete x.activeEncounter.otherworld,x=>x.activeEncounter.enemies[0].otherworldActor=false,x=>x.activeEncounter.rewardGold=1,x=>x.story.flags.push('FAKE')]){const bad=structuredClone(s);mutate(bad);assert(!E.validSave(bad),'forged marker rejected');}
 const detached=structuredClone(e);assert.equal(E.reward(s,detached,at(s)),null);assert(!E.setOtherworldFloor(s,1));
 let n=0;while(!e.done&&n++<3000)E.step(s,e,s.nextActionAt);assert(e.win);const inv=new Set(s.inventory.map(x=>x.id));assert(E.reward(s,e,s.lastHealthClock));assert.equal(E.reward(s,e,s.lastHealthClock),null);assert.equal(s.otherworld.floor,2);assert.equal(s.otherworld.highestCleared,1);assert.equal(protectedFields(),before);assert.deepEqual({site:s.siteId,location:s.location,route:s.expedition},original);
 const drops=s.inventory.filter(x=>!inv.has(x.id));assert(drops.length>=1&&drops.length<=2);assert(drops.every(x=>[1,2,3].includes(x.rarity)&&x.level===100&&!x.legendaryId));
 assert(E.setOtherworldFloor(s,1));assert(E.setOtherworldAutoAdvance(s,false));s.heroHp=E.stats(s).hp;assert(win(s).e.win);assert.equal(s.otherworld.floor,1);assert(E.exitOtherworld(s));assert.equal(s.running,false);assert.deepEqual(s.expedition,original.route);
 assert(E.enterOtherworld(s,at(s)));const fight=E.startRoutedEncounter(s,at(s));s.heroHp=fight.heroHp=1;let turns=0;while(!fight.done&&turns++<100)E.step(s,fight,s.nextActionAt);assert(!fight.win);assert(s.restUntil>0);assert.equal(s.otherworld.floor,1);assert(s.restResume);const wake=s.restUntil;E.settleRest(s,wake);assert(s.running);assert(E.startRoutedEncounter(s,wake+2000));assert(E.validSave(s));
}
// Pending storage: blocked full bag retains exact identities, then claim once.
{
 const s=endgame();assert(E.enterOtherworld(s,at(s)));E.setOtherworldAutoAdvance(s,false);
 for(const slot of E.SLOTS.filter(k=>k!=='core'))while(E.canReceiveEquipment(s,slot))s.inventory.push(E.item(slot,100,null,1));
 const {e}=win(s);assert(e.win);assert(s.otherworld.pendingEquipment.length>0);const ids=s.otherworld.pendingEquipment.map(x=>x.id);assert.deepEqual(E.claimPendingOtherworldEquipment(s),{claimed:0,pending:ids.length});
 s.inventory=s.inventory.filter(x=>Object.values(s.equip).includes(x.id)||x.legendaryId==='ashen-primal-core');const claim=E.claimPendingOtherworldEquipment(s);assert.equal(claim.claimed,ids.length);assert(ids.every(id=>s.inventory.some(x=>x.id===id)));assert.equal(E.claimPendingOtherworldEquipment(s).claimed,0);assert(E.validSave(s));
 // Existing stockpiled consumables remain untouched by tower settlement.
 const copy=structuredClone(s);copy.otherworld.pendingEquipment=Array.from({length:OTHERWORLD_PENDING_LIMIT-1},()=>E.item('weapon',100,null,1,{baseLevel:100,levelSource:'drop',originRace:'human'}));assert(E.validSave(copy));assert.equal(E.startRoutedEncounter(copy,at(copy)),null);assert.equal(copy.running,false);
}
// Persistence rejection leaves the caller's state unchanged.
{const s=endgame(),before=JSON.stringify(s),tx=commitGameTransaction({setItem(){throw Error('quota');}},s,n=>E.enterOtherworld(n,at(n)));assert.equal(tx.reason,'storage');assert.equal(JSON.stringify(s),before);}
console.log('PASS otherworld canonical five endings, exact growth, strict marker/save, dedicated loot, no ordinary hooks, once settlement, safe exit/farming, defeat-rest-retry, pending queue and quota rollback.');
