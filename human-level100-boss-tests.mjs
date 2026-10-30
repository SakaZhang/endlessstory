import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
import {WORLD_MONSTERS,monsterParameters} from './dist/world-content.js';
import {LEGENDARY_DROP_CANDIDATES} from './dist/legendary-drop.js';
import {HUMAN_MATERIAL_POOLS,HUMAN_AREAS} from './dist/races/human/content.js';
import {HUMAN_LEGENDARIES} from './dist/races/human/equipment.js';
import {setup} from './boss-growth-test-fixture.mjs';
import {earnAreaAccess} from './natural-area-access.mjs';
const id='human.a10.boss',T=1700000000000,random=Math.random,clock=Date.now;
Date.now=()=>T;
function game(seed=1){const s=setup('human',100,0,seed);s.lastSeen=T;E.normalizeHealth(s,T);assert(E.travelToArea(s,'human.a10',T));return s;}
function fight(s){const e=E.startInstanceEncounter(s,id,Math.max(s.lastHealthClock,s.nextBattleAt??0));assert(e);assert.equal(e.enemies[0].definitionId,id);assert.equal(e.enemies[0].max,monsterParameters(id).hp);for(let i=0;i<2000&&!e.done;i++)E.step(s,e,s.nextActionAt);assert(e.done&&e.win,'ordinary Lv100 sustain loadout wins actual full-budget combat');return e;}
try{
 assert.equal(E.INSTANCES[id].enabled,true);assert.equal(HUMAN_AREAS[9].name,'荒冠内境');assert.equal(WORLD_MONSTERS[id].area*10,100);assert.equal(E.instanceCooldownMs(id),1800000);
 assert.equal(E.areaGearLevel(id),100);assert.equal(E.areaGearLevel('human.a10.field'),95);assert.equal(E.areaGearLevel('human.a10.dungeon'),95);assert.equal(E.areaGearLevel('human.a09.boss'),85);
 const pool=LEGENDARY_DROP_CANDIDATES.human.map(x=>x.id);assert.deepEqual(pool,['human-oathblade','human-banner-armor']);for(const d of HUMAN_LEGENDARIES)assert(d.bossPool.includes(id));assert(!pool.includes('return-ring')&&!pool.includes('infinity-gauntlet'));
 assert(HUMAN_MATERIAL_POOLS[id+'|'+id]);assert(HUMAN_MATERIAL_POOLS[id+'|'+id].channels.flatMap(c=>c.entries).every(x=>x.materialId.startsWith('human.')));
 // Old save has no new boss fields: clearing A9 through the real three-stage dungeon unlocks A10.
 const old=game();old.areaProgress.human={unlocked:[1,2,3,4,5,6,7,8,9],cleared:[1,2,3,4,5,6,7,8]};assert(E.travelToArea(old,'human.a09',T));assert.equal(E.startInstanceEncounter(old,id,T),null);assert(!E.plannedNodes(old).find(x=>x.id===id).unlocked);
 const access=earnAreaAccess(old,'human',10,{now:T});assert(access.ok,JSON.stringify(access));assert(E.plannedNodes(old).find(x=>x.id===id).unlocked);assert(E.validSave(JSON.parse(JSON.stringify(old))));assert(E.travelToArea(old,'human.a10',access.now));fight(old);
 // Repeatable actual victories, not forced enemy HP or a predeclared outcome.
 for(let seed=1;seed<=20;seed++){const s=game(seed),e=fight(s);E.reward(s,e,s.lastHealthClock);assert.equal(s.instanceCooldowns[id],s.lastHealthClock+1800000);assert(E.validSave(s));}
 const s=game(),e=fight(s),victory=structuredClone(s),seen=new Set(),levels=new Set();
 // Deterministic reward RNG coverage over the same genuine victory; no probability changes.
 for(let seed=1;seed<=2000&&seen.size<2;seed++){const x=structuredClone(victory),won=x.activeEncounter;won.rngState=Math.imul(seed,2654435761)>>>0;E.reward(x,won,x.lastHealthClock);const receipt=won.legendaryDropReceipt;assert(receipt&&receipt.event.regionRace==='human');if(receipt.item){const it=receipt.item;assert(pool.includes(it.legendaryId));assert.equal(it.originRace,'human');assert(it.level>=98&&it.level<=100);levels.add(it.level);if(it.level===100)seen.add(it.legendaryId);assert(x.inventory.some(i=>i.id===it.id));}const inventory=JSON.stringify(x.inventory),gold=x.gold;E.reward(x,won,x.lastHealthClock);assert.equal(JSON.stringify(x.inventory),inventory);assert.equal(x.gold,gold);assert(E.validSave(x));}
 assert.deepEqual([...seen].sort(),[...pool].sort(),'both repeatable human legends actually generated at Lv100');
 E.reward(s,e,s.lastHealthClock);const now=Math.max(s.lastHealthClock,s.nextBattleAt??0),cd=s.instanceCooldowns[id];assert.equal(E.startInstanceEncounter(s,id,now),null);assert(E.setExpeditionAutomation(s,'boss',true));assert.equal(E.nextEncounterRoute(s,now).kind,'field');assert.equal(E.nextEncounterRoute(s,cd).id,id);
 s.gold+=1000;assert(E.buyBossChallengeToken(s));assert(E.useBossChallengeToken(s));assert.equal(E.nextEncounterRoute(s,now).id,id);const next=E.startRoutedEncounter(s,now);assert(next.automaticBoss);assert.equal(s.extraBossChallenges,0);assert.equal(s.instanceCooldowns[id],cd);assert.equal(E.startRoutedEncounter(s,now).id,next.id);const loaded=JSON.parse(JSON.stringify(s));assert(E.validSave(loaded));assert.equal(E.startRoutedEncounter(loaded,now).id,next.id);
 console.log('PASS human Lv100 boss: real A9 unlock, 21 full-budget victories, exact human Lv100 legendary receipts, replay protection, unchanged field/dungeon bands, 30m cooldown, auto routing, extra attempt debit, active/old saves');
}finally{Math.random=random;Date.now=clock;}
