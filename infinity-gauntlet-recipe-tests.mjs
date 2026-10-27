import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
import {commitGameTransaction,SAVE_KEY} from './dist/storage.js';
import {storage} from './infinity-gauntlet-tests.mjs';
for(const race of ['dwarf','human','elf','goblin','ashen']){
 const s=E.fresh(race);s.level=100;E.normalizeHealth(s,1000);E.normalizeAreaProgress(s);E.normalizeExpedition(s);s.areaProgress[race]={unlocked:[1,2,3,4,5,6,7,8,9,10],cleared:[1,2,3,4,5,6,7,8,9]};s.lastSeen=s.lastHealthClock=1000;s.restUntil=0;s.nextBattleAt=0;s.heroHp=E.stats(s).hp;E.normalizePotions(s);s.lootFilters={equipment:[0,1,2,3],materials:[0,1,2,3],items:[]};
 let e;for(let stage=1;stage<=3;stage++){
  e=E.startInstanceEncounter(s,race+'.a01.dungeon',s.nextBattleAt||1000);assert(e);assert.equal(e.dungeonStage,stage);for(const u of e.enemies){u.hp=1;u.shield=0;u.armor=0;u.atk=0;u.control.stunUntil=1e9;}for(let n=0;n<100&&!e.done;n++)E.step(s,e,s.nextActionAt);assert(e.win);assert(E.validSave(s));if(stage<3){E.reward(s,e,s.lastHealthClock);assert.equal(s.infinityGauntlet,undefined);assert.equal(e.infinityRecipeRolled,undefined);}
 }
 let seed;for(let n=1;n<1000;n++){const trial=structuredClone(s);trial.activeEncounter.rngState=n*7919;E.reward(trial,trial.activeEncounter,trial.lastHealthClock);if(trial.infinityGauntlet?.recipeLearned){seed=n*7919;break;}}assert(seed,'real recipe positive seed '+race);e.rngState=seed;s.lastSeen=s.lastHealthClock;s.stopAfterBattle=true;
 const store=storage(s),raw=store.getItem(SAVE_KEY);store.fail=true;const failed=commitGameTransaction(store,s,next=>{E.reward(next,next.activeEncounter,next.lastHealthClock);return E.validSave(next);},{now:s.lastHealthClock});assert.equal(failed.reason,'storage');assert.equal(store.getItem(SAVE_KEY),raw);assert(!s.infinityGauntlet);
 store.fail=false;const tx=commitGameTransaction(store,s,next=>{E.reward(next,next.activeEncounter,next.lastHealthClock);return E.validSave(next);},{now:s.lastHealthClock});assert(tx.ok);assert(tx.game.infinityGauntlet.recipeLearned);assert.deepEqual(tx.game.lootFilters,s.lootFilters);
 const offline=JSON.parse(raw),report=E.offline(offline,offline.lastSeen+1);assert(report);assert.deepEqual(offline.infinityGauntlet,tx.game.infinityGauntlet);assert(E.validSave(offline));
 const snapshot=JSON.stringify(tx.game);E.reward(tx.game,e,tx.game.lastHealthClock);assert.equal(JSON.stringify(tx.game),snapshot,'no replay');
}
console.log('PASS Infinity recipe: real five-race stages1/2 exclude, final win seeded grant, filters unchanged, save-failure atomic retry and online/offline learned-state parity.');
