import assert from 'node:assert/strict';
import {fresh,normalizeHealth,normalizePotions,configureExpedition,startRoutedEncounter,startRest,settleRest,step,reward,validSave,offline,stats} from './dist/engine.js';
import {DUNGEON_PLAYER_FIELDS} from './dist/dungeon-player-state.js';
const original=Math.random;let seed=8841;const rng=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/2**32;};Math.random=rng;
const prepare=()=>{const s=fresh();s.lastSeen=0;normalizeHealth(s,0);normalizePotions(s);configureExpedition(s,{mode:'dungeon',targetInstanceId:'dwarf-blackforge-1-dungeon',fieldId:'blackforge-road-field',loop:true});return s;};
const win=(s,e,at)=>{e.done=true;e.win=true;reward(s,e,at);};
try{
 const s=prepare();let e=startRoutedEncounter(s,0);
 Object.assign(e,{shield:17,guard:2,warcry:3,ironcoat:2,barrier:3,barrierShield:31,heroBurn:2,heroBurnPower:2,weakness:2,shelterUsed:true,cd:{mark:5,mend:7},burn:4,broken:6,blunt:3,scorch:4,stun:1,round:8,nextHeavy:10,heavyDelayed:true});
 s.stopAfterBattle=true;win(s,e,100);assert(!s.running);assert(s.dungeonRun.carry);const before=JSON.stringify(s);reward(s,e,100);assert.equal(JSON.stringify(s),before);assert(validSave(s));
 const loaded=JSON.parse(before);assert(validSave(loaded));const carry=structuredClone(loaded.dungeonRun.carry);
 e=startRoutedEncounter(loaded,100000);assert.equal(e.dungeonStage,2);assert.equal(loaded.dungeonRun.carry,undefined);
 for(const key of DUNGEON_PLAYER_FIELDS)assert.equal(e[key],carry[key]);assert.deepEqual(e.cd,carry.cd);assert(e.shelterUsed);
 for(const key of ['burn','broken','blunt','scorch','stun','round'])assert.equal(e[key],0);
 assert.equal(e.nextHeavy,4);assert(!e.heavyDelayed);assert.equal(startRoutedEncounter(loaded,100001),e);assert(validSave(loaded));
 loaded.skills=[null,null,null,null];e.atk=0;e.hp=1e8;step(loaded,e,101100);assert.equal(e.cd.mark,4);assert.equal(e.warcry,2);assert.equal(e.heroBurn,1);assert(e.barrierShield<=31);assert(e.shelterUsed);
 win(loaded,e,102000);e=startRoutedEncounter(loaded,103800);assert.equal(e.dungeonStage,3);assert(e.shelterUsed);assert.equal(e.cd.mark,4);
 loaded.momentum=1;win(loaded,e,104000);assert.equal(loaded.dungeonRun,null);assert.equal(loaded.momentum,1);loaded.running=true;const field=startRoutedEncounter(loaded,105800);assert.equal(field.kind,'field');assert.equal(field.shield,0);assert.equal(field.warcry,0);assert(!field.shelterUsed);assert.deepEqual(field.cd,{});
 // The actual once-only shelter special cannot refill on each new dungeon enemy.
 const guarded=prepare();const gear=guarded.inventory[0];gear.rarity=2;gear.affixes=[{stat:'atk',value:3},{stat:'hp',value:15},{stat:'armor',value:2}];gear.special={id:'shelter'};guarded.skills=[null,null,null,null];let g=startRoutedEncounter(guarded,0);guarded.heroHp=g.heroHp=stats(guarded).hp*.3+1;g.atk=20;g.hp=1e8;Math.random=()=>.5;
 assert(step(guarded,g,1100).some(l=>l.includes('绝境庇护')));assert(g.shelterUsed);win(guarded,g,1200);
 for(const at of [3000,6000]){g=startRoutedEncounter(guarded,at);assert(g.shelterUsed);g.shield=g.barrierShield=0;guarded.heroHp=g.heroHp=stats(guarded).hp*.3+1;g.atk=10;g.hp=1e8;assert(!step(guarded,g,at+1100).some(l=>l.includes('绝境庇护')));win(guarded,g,at+1200);}
 // Lethal rounds tick durations once without executing a skipped burn damage phase.
 const lethal=prepare();lethal.skills=[null,null,null,null];let hit=startRoutedEncounter(lethal,0);
 Object.assign(hit,{hp:1,guard:1,warcry:1,ironcoat:1,barrier:1,barrierShield:17,shield:9,weakness:1,heroBurn:2,heroBurnPower:10});
 const hpBefore=hit.heroHp;step(lethal,hit,1100);assert(hit.win);assert.equal(hit.heroHp,hpBefore);
 for(const key of ['guard','warcry','ironcoat','barrier','weakness'])assert.equal(hit[key],0);
 assert.equal(hit.barrierShield,0);assert.equal(hit.shield,9);assert.equal(hit.heroBurn,1);assert.equal(hit.heroBurnPower,10);
 win(lethal,hit,1200);hit=startRoutedEncounter(lethal,3000);hit.hp=1e8;hit.atk=1000;
 assert.equal(hit.heroBurnPower,10);assert(step(lethal,hit,4100).some(line=>line==='灼烧侵蚀 · -10'));
 assert.equal(hit.heroBurn,0);assert.equal(hit.heroBurnPower,0);
 const ordinary=prepare();ordinary.skills=[null,null,null,null];const oe=startRoutedEncounter(ordinary,0);oe.hp=1e8;oe.atk=0;oe.warcry=2;step(ordinary,oe,1100);assert.equal(oe.warcry,1);
 const cleanse=prepare();cleanse.skills=['cleanse',null,null,null];const ce=startRoutedEncounter(cleanse,0);ce.heroBurn=3;ce.heroBurnPower=12;ce.weakness=2;step(cleanse,ce,1100);assert.equal(ce.heroBurn,0);assert.equal(ce.heroBurnPower,0);assert.equal(ce.weakness,0);win(cleanse,ce,1200);assert.equal(cleanse.dungeonRun.carry.heroBurnPower,0);
 const burnLegacy=prepare();const ble=startRoutedEncounter(burnLegacy,0);ble.heroBurn=2;ble.atk=200;delete ble.heroBurnPower;startRoutedEncounter(burnLegacy,1);assert.equal(ble.heroBurnPower,10);
 // Invalid carry fields / replay duplication are rejected, not silently reset.
 for(const mutate of [
  x=>x.dungeonRun.carry.burn=2,x=>x.dungeonRun.carry.cd.bad=1,x=>x.dungeonRun.carry.cd.mark=101,
  x=>x.dungeonRun.carry.shield=-1,x=>x.dungeonRun.carry.warcry=Infinity,x=>x.dungeonRun.carry.shelterUsed=1,
  x=>x.dungeonRun.stage=1
 ]){const bad=JSON.parse(before);mutate(bad);assert(!validSave(bad));}
 const legacy=prepare();const le=startRoutedEncounter(legacy,0);le.cd.mark=4;le.warcry=2;assert(!legacy.dungeonRun.carry);assert(validSave(legacy));assert.equal(startRoutedEncounter(legacy,100).cd.mark,4);
 const camp=JSON.parse(before);assert(startRest(camp,200));assert.equal(camp.dungeonRun,null);settleRest(camp,300200);assert.equal(startRoutedEncounter(camp,300200).warcry,0);
 const failure=prepare();let f=startRoutedEncounter(failure,0);f.shelterUsed=true;failure.heroHp=f.heroHp=1;f.hp=f.atk=1e8;step(failure,f,1100);assert.equal(failure.dungeonRun,null);settleRest(failure,301100);f=startRoutedEncounter(failure,301100);assert.equal(f.dungeonStage,1);assert(!f.shelterUsed);assert.deepEqual(f.cd,{});
 // Legacy completed victory can be rewarded by offline before any step/normalizer.
 const legacyDone=prepare();const doneEnemy=startRoutedEncounter(legacyDone,0);
 doneEnemy.done=true;doneEnemy.win=true;doneEnemy.heroBurn=2;doneEnemy.atk=200;delete doneEnemy.heroBurnPower;
 legacyDone.lastSeen=0;assert(validSave(legacyDone));offline(legacyDone,1000);
 assert.equal(legacyDone.dungeonRun.stage,2);assert.equal(legacyDone.dungeonRun.carry.heroBurn,2);assert.equal(legacyDone.dungeonRun.carry.heroBurnPower,10);
 const nextLegacy=startRoutedEncounter(legacyDone,1800);assert.equal(nextLegacy.heroBurnPower,10);assert.equal(nextLegacy.heroBurn,2);
 // Saved carry on a paused boundary can be replayed offline with identical results.
 const template=JSON.parse(before);template.running=true;template.lastSeen=100;template.level=30;template.heroHp=stats(template).hp;
 const batch=structuredClone(template),online=structuredClone(template),end=180000;Math.random=rng;seed=819;offline(batch,end);seed=819;let time=100;
 while(time<end&&online.running){if(online.restUntil>0){if(online.restUntil>end)break;time=online.restUntil;settleRest(online,time);continue;}time=Math.max(time,online.nextBattleAt??0);if(time>=end)break;const battle=online.activeEncounter??startRoutedEncounter(online,time);if(!battle)break;time=online.nextActionAt;if(time>end)break;step(online,battle,time);if(battle.done&&battle.win)reward(online,battle,time);}
 settleRest(online,end);for(const key of ['gold','xp','heroHp','kills'])assert.equal(batch[key],online[key]);assert.deepEqual(batch.materialStacks,online.materialStacks);assert.deepEqual(batch.activeEncounter?.cd,online.activeEncounter?.cd);assert.equal(batch.activeEncounter?.shelterUsed,online.activeEncounter?.shelterUsed);assert(validSave(batch));
 console.log('Dungeon player carry: exact once-only shields/CD/buffs/debuffs/shelter, enemy reset, pause/reload/camp/death/clear boundaries, validation and offline parity: PASS');
}finally{Math.random=original;}
