import assert from 'node:assert/strict';
import fs from 'node:fs';import os from 'node:os';import path from 'node:path';import {execFileSync} from 'node:child_process';
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'onramp-contract-')),root=process.env.TEST_ENGINE_ROOT??new URL('.',import.meta.url).pathname;
for(const shopping of [0,1]){
 const out=path.join(dir,`${shopping}.json`);
 execFileSync(process.execPath,[new URL('natural-onramp-simulation.mjs',import.meta.url).pathname,`--engine-root=${root}`,'--races=human','--seeds=1917','--single=1','--hours=.3',`--shopping=${shopping}`,`--out=${out}`],{stdio:'inherit'});
 const r=JSON.parse(fs.readFileSync(out));assert(r.runtimeSha256?.length===64);assert(r.counts.wins>0);assert(r.firstBattle);assert(r.restFraction>=0&&r.restFraction<=1);assert(r.policy.noGrants);assert.equal(r.ledger.initialGold,100);
 assert.equal(r.final.gold,r.ledger.initialGold+r.ledger.rewardGold+r.ledger.saleGold-r.ledger.equipmentGold-r.ledger.recipeGold-r.ledger.potionCraftGold);
 if(!shopping){assert.equal(r.ledger.equipmentGold,0);assert.equal(r.ledger.recipeGold,0);}
 if(r.firstDungeonClear){assert.equal(r.firstDungeonClear.stages.length,3);assert.deepEqual(r.firstDungeonClear.stages.map(x=>x.stage),[1,2,3]);assert(r.firstDungeonClear.fullDurationSeconds>=r.firstDungeonClear.durationSeconds);}
 assert.equal(r.counts.dungeonClears,r.dungeons.filter(x=>x.win&&x.stage===3).length);
}
execFileSync(process.execPath,[new URL('progression-economy-simulation.mjs',import.meta.url).pathname,`--engine-root=${root}`,'--single=1','--races=human','--seeds=1917','--hours=.01','--interval=.01',`--out=${path.join(dir,'legacy.json')}`],{stdio:'inherit'});
console.log('PASS natural onramp policy/ledger/dungeon receipts and legacy simulation smoke; root='+root);

const observations=[];for(const observe of [0,1]){const save=path.join(dir,`observer-${observe}-save.json`),out=path.join(dir,`observer-${observe}.json`);execFileSync(process.execPath,[new URL('natural-onramp-simulation.mjs',import.meta.url).pathname,`--engine-root=${root}`,'--single=1','--races=human','--seeds=1917','--hours=.1',`--observe=${observe}`,`--save=${save}`,`--out=${out}`],{stdio:'inherit'});observations.push({state:JSON.parse(fs.readFileSync(save)),result:JSON.parse(fs.readFileSync(out))});}assert.deepEqual(observations[0].state,observations[1].state,'observer cannot alter saved game state');assert.equal(observations[0].result.externalRngState,observations[1].result.externalRngState,'observer cannot consume external RNG');assert.deepEqual(observations[0].result.ledger,observations[1].result.ledger);console.log('PASS display observer leaves entire game state and external RNG unchanged');
