import assert from 'node:assert/strict';
import fs from 'node:fs';
import {assertMonsterCatalogIds,assertPlannedNodeIds} from './monster-catalog-test-fixture.mjs';
import {MONSTER_CATALOG} from './dist/monster-codex-schema.js';
import * as E from './dist/engine.js';
import {WORLD_MONSTERS,monsterParameters} from './dist/world-content.js';
import {LEGENDARY_DROP_CANDIDATES} from './dist/legendary-drop.js';
import {materialPools} from './dist/races/goblin/material-pools.js';
import {art} from './dist/races/goblin/art.js';
import {setup} from './boss-growth-test-fixture.mjs';
import {earnAreaAccess} from './natural-area-access.mjs';
const T=1700000000000,clock=Date.now;Date.now=()=>T;
try{
 const proof=[];
 assertMonsterCatalogIds(MONSTER_CATALOG);const nodes=E.plannedNodes(E.fresh());assertPlannedNodeIds(nodes);
 const missing={...MONSTER_CATALOG};delete missing['goblin.a10.boss'];assert.throws(()=>assertMonsterCatalogIds(missing));
 assert.throws(()=>assertMonsterCatalogIds({...MONSTER_CATALOG,'invented.boss':{}}));
 assert.throws(()=>assertPlannedNodeIds(nodes.filter(n=>n.id!=='goblin.a10.boss')));assert.throws(()=>assertPlannedNodeIds([...nodes,{id:'invented.boss'}]));
 for(const race of E.RACE_KEYS){
  const id=race+'.a10.boss',s=setup(race,100,0,1);s.lastSeen=T;E.normalizeHealth(s,T);assert(E.travelToArea(s,race+'.a10',T));
  assert(E.INSTANCES[id]?.enabled);assert(E.plannedNodes(s).find(n=>n.id===id)?.unlocked);assert.equal(E.instanceCooldownMs(id),1800000);
  const e=E.startInstanceEncounter(s,id,T);assert(e);assert.equal(e.enemies[0].definitionId,id);assert.equal(e.enemies.reduce((n,u)=>n+u.max,0),monsterParameters(id).hp);
  for(let t=0;t<2500&&!e.done;t++)E.step(s,e,s.nextActionAt);assert(e.done&&e.win,race+' real Lv100 sustained combat');
  const legends=new Set(),levels=new Set();
  for(let seed=1;seed<=600;seed++){const a=structuredClone(s),won=a.activeEncounter;won.rngState=Math.imul(seed,2654435761)>>>0;E.reward(a,won,a.lastHealthClock);const r=won.legendaryDropReceipt;assert(r);assert.equal(r.probability,.05);if(r.item){assert.equal(r.item.originRace,race);assert(r.item.level>=90);assert(LEGENDARY_DROP_CANDIDATES[race].some(d=>d.id===r.item.legendaryId));legends.add(r.item.legendaryId);levels.add(r.item.level);assert(a.inventory.some(i=>i.id===r.item.id));}const before=JSON.stringify(a);E.reward(a,won,a.lastHealthClock);assert.equal(JSON.stringify(a),before,'no repeated settlement');assert(E.validSave(a));}
  assert.deepEqual([...legends].sort(),LEGENDARY_DROP_CANDIDATES[race].map(x=>x.id).sort());assert.deepEqual([...levels].sort(),race==='human'?[100,98,99]:[93,94,95,96,97]);
  E.reward(s,e,s.lastHealthClock);const now=Math.max(s.lastHealthClock,s.nextBattleAt??0),cd=s.instanceCooldowns[id];assert.equal(cd,s.lastHealthClock+1800000);assert.equal(E.startInstanceEncounter(s,id,now),null);assert(E.setExpeditionAutomation(s,'boss',true));assert.equal(E.nextEncounterRoute(s,now).kind,'field');assert.equal(E.nextEncounterRoute(s,cd).id,id);
  s.gold+=1000;assert(E.buyBossChallengeToken(s));assert(E.useBossChallengeToken(s));assert.equal(E.nextEncounterRoute(s,now).id,id);const next=E.startRoutedEncounter(s,now);assert(next.automaticBoss);assert.equal(s.extraBossChallenges,0);assert.equal(s.instanceCooldowns[id],cd);assert(E.validSave(JSON.parse(JSON.stringify(s))));proof.push({race,boss:WORLD_MONSTERS[id].name,levels:[...levels].sort((a,b)=>a-b),legends:[...legends]});
 }
 const old=setup('goblin',100,0,2);old.lastSeen=T;E.normalizeHealth(old,T);old.areaProgress.goblin={unlocked:[1,2,3,4,5,6,7,8,9],cleared:[1,2,3,4,5,6,7,8]};assert(E.travelToArea(old,'goblin.a09',T));assert.equal(E.startInstanceEncounter(old,'goblin.a10.boss',T),null);const story=structuredClone(old.storyEvents);const access=earnAreaAccess(old,'goblin',10,{now:T});assert(access.ok,JSON.stringify(access));assert(E.plannedNodes(old).find(n=>n.id==='goblin.a10.boss').unlocked);assert.deepEqual(old.storyEvents,story);assert(E.validSave(old));
 assert(materialPools['goblin.a10.boss|goblin.a10.boss']);for(const f of art.monsters['goblin.a10.boss'].frames)assert(fs.existsSync('dist/'+f.file));for(const name of ['idle','attack','hurt','death'])assert(art.monsters['goblin.a10.boss'].animations[name].length);
 assert.equal(E.areaGearLevel('goblin.a10.boss'),95);assert.equal(E.areaGearLevel('goblin.a10.field'),95);assert.equal(E.areaGearLevel('goblin.a09.boss'),85);
 console.log('PASS final-region bosses: five real Lv100 victories, 3000 deterministic real rewards, all legendary candidates at90+, auto/cooldown/token/replay, A9 dungeon unlock, unchanged story, full sprite lifecycle.');console.log(JSON.stringify(proof));
}finally{Date.now=clock;}
