import {prepareM2TestRoute} from './m2-test-budget-fixture.mjs';
import {legacyFresh as fresh} from './legacy-skill-test-fixture.mjs';
import assert from 'node:assert/strict';
import {normalizeHealth,normalizePotions,configureExpedition,setExpeditionLoop,startRoutedEncounter,startInstanceEncounter,step,reward,settleRest,startRest,offline,validSave,stats,INSTANCES} from './dist/engine.js';
import {pickRoute} from './dist/location-schema.js';
const dungeon='dwarf-blackforge-1-dungeon',field='blackforge-road-field';
const prepare=(loop=false)=>{const s=fresh();s.lastSeen=0;normalizeHealth(s,0);normalizePotions(s);assert(configureExpedition(s,{mode:'dungeon',targetInstanceId:dungeon,fieldId:field,loop}));return s;};
const win=(s,e,now)=>{e.done=true;e.win=true;return reward(s,e,now);};
const original=Math.random;let seed=19;const rng=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/2**32;};Math.random=rng;
try{
 const s=prepare();s.heroHp=50;s.potionBuffs.strength={quality:0,endAt:300000};let e=startInstanceEncounter(s,dungeon,0);assert.equal(e.dungeonStage,1);assert.equal(e.heroHp,50);const round=structuredClone(s);assert(validSave(round));assert.equal(startRoutedEncounter(round,1).hp,e.hp);assert.equal(round.dungeonRun.stage,1);
 const firstGold=s.gold;win(s,e,100);assert.equal(s.gold,firstGold+5);assert.equal(s.dungeonRun.stage,2);let snap=JSON.stringify(s);reward(s,e,100);assert.equal(JSON.stringify(s),snap);assert(!s.instanceCooldowns[dungeon]);assert.equal(startRoutedEncounter(s,1899),null);
 e=startRoutedEncounter(s,1900);assert.equal(e.dungeonStage,2);assert.equal(e.heroHp,50);assert.equal(s.potionBuffs.strength.endAt,300000);win(s,e,2000);
 e=startRoutedEncounter(s,3800);assert.equal(e.dungeonStage,3);assert.equal(e.kind,'dungeon');assert(!e.boss);assert(e.name.endsWith('精英'));win(s,e,4000);assert.equal(s.instanceCooldowns[dungeon],304000);assert.equal(s.dungeonRun,null);assert(!s.running);assert(e.rewardNotes.some(n=>n.includes('通关')));assert.equal(startInstanceEncounter(s,dungeon,303999),null);assert(validSave(s));
 assert.equal(startInstanceEncounter(s,dungeon,304000).dungeonStage,1);
 // Failed run preserves intermediate loot but clears progress; enabled loop resumes stage one.
 const failed=prepare(true);let f=startRoutedEncounter(failed,0);win(failed,f,100);const kept=failed.gold;f=startRoutedEncounter(failed,1900);failed.heroHp=f.heroHp=1;f.hp=1e8;f.atk=1e8;step(failed,f,3000);assert.equal(failed.gold,kept);assert.equal(failed.dungeonRun,null);assert.equal(failed.instanceCooldowns[dungeon]??0,0);assert(failed.restResume);assert.equal(startRoutedEncounter(failed,302999),null);settleRest(failed,303000);assert.equal(startRoutedEncounter(failed,303000).dungeonStage,1);
 const cancelled=prepare(true);f=startRoutedEncounter(cancelled,0);cancelled.heroHp=f.heroHp=1;f.hp=f.atk=1e8;step(cancelled,f,1100);assert(setExpeditionLoop(cancelled,false));assert(!cancelled.running&&!cancelled.restResume);
 const manual=prepare(false);f=startRoutedEncounter(manual,0);manual.heroHp=f.heroHp=1;f.hp=f.atk=1e8;step(manual,f,1100);assert(!manual.running&&!manual.restResume);
 // Pausing preserves progression; explicit camp abandons the run without cooldown or loot loss.
 const pause=prepare(true);let pe=startRoutedEncounter(pause,0);pause.stopAfterBattle=true;win(pause,pe,100);assert(!pause.running);assert.equal(pause.dungeonRun.stage,2);const saved=JSON.parse(JSON.stringify(pause));assert(validSave(saved));assert.equal(startRoutedEncounter(saved,1900).dungeonStage,2);
 const retainedGold=saved.gold;assert(startRest(saved,2000));assert.equal(saved.dungeonRun,null);assert(!saved.running&&!saved.restResume);assert.equal(saved.gold,retainedGold);assert.equal(saved.instanceCooldowns[dungeon]??0,0);
 // Loop fallback and exact ready boundary; manual bosses remain independent and never route automatically.
 const looper=prepare(true);looper.instanceCooldowns[dungeon]=5000;looper.running=true;assert.equal(startRoutedEncounter(looper,0).instanceId,field);
 const b=fresh();normalizeHealth(b,0);let boss=startInstanceEncounter(b,'blackforge-road-boss',0);win(b,boss,100);assert.equal(b.instanceCooldowns['blackforge-road-boss'],1800100);assert.equal(startInstanceEncounter(b,'blackforge-road-boss',2000),null);assert(startInstanceEncounter(b,'blackforge-mine-boss',2000));assert(!b.running);
 const crossField={id:'other-field',kind:'field',enabled:true,areaId:'other'};assert.equal(pickRoute({mode:'dungeon',targetInstanceId:dungeon,fieldId:crossField.id,loop:true},{[dungeon]:200},100,{...INSTANCES,[crossField.id]:crossField}),crossField);
 // Full offline and online routing share stages, cooldown fallback, rest and rewards.
 const template=prepare(true);prepareM2TestRoute(template,0);template.expedition={mode:'dungeon',fieldId:'dwarf.a01.field',targetInstanceId:'dwarf.a01.dungeon',loop:true};template.level=25;template.heroHp=stats(template).hp;template.running=true;
 const batch=structuredClone(template),online=structuredClone(template),end=720000;
 seed=927;offline(batch,end);seed=927;let time=0;
 while(time<end&&online.running){
  if(online.restUntil>0){if(online.restUntil>end)break;time=online.restUntil;settleRest(online,time);continue;}
  time=Math.max(time,online.nextBattleAt??0);if(time>=end)break;
  const battle=online.activeEncounter??startRoutedEncounter(online,time);if(!battle)break;
  time=online.nextActionAt;if(time>end)break;step(online,battle,time);if(battle.done&&battle.win)reward(online,battle,time);
 }
 settleRest(online,end);
 for(const key of ['gold','xp','level','heroHp','kills'])assert.equal(batch[key],online[key],key);
 assert.deepEqual(batch.materialStacks,online.materialStacks);assert.deepEqual(batch.instanceCooldowns,online.instanceCooldowns);assert.equal(batch.dungeonRun?.stage,online.dungeonRun?.stage);assert.equal(batch.activeEncounter?.hp,online.activeEncounter?.hp);assert(validSave(batch));
 // Material and equipment quality improve in ordinary dungeon stages (not just drop chance).
 const means={};for(const mode of ['field','dungeon','boss']){seed=818;let gearSum=0,gearN=0,matSum=0,matN=0;
  for(let i=0;i<10000;i++){const t=prepare();const fight=mode==='field'?startInstanceEncounter(t,'blackforge-mine-field',0):mode==='boss'?startInstanceEncounter(t,'blackforge-mine-boss',0):startInstanceEncounter(t,dungeon,0);const gear=win(t,fight,100);if(gear){gearSum+=gear.rarity;gearN++;}for(const m of fight.materialLoot){matSum+=m.quality*m.count;matN+=m.count;}}
  means[mode]={gear:gearSum/gearN,material:matSum/matN};
 }assert(means.dungeon.gear>means.field.gear);assert(means.dungeon.material>means.field.material);assert(means.boss.gear>means.dungeon.gear);assert(means.boss.material>means.dungeon.material);console.log(means);
 console.log('Three-stage dungeon: persistent HP/buffs, immediate loot, failure restart/rest, once-only clear, independent cooldowns, fallback, online/offline parity and improved quality: PASS');
}finally{Math.random=original;}
