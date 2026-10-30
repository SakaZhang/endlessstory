import {equipTestLoadout} from './equipped-test-fixture.mjs';
import assert from 'node:assert/strict';import {historicalDwarfProvider} from './historical-dwarf-provider-fixture.mjs';import * as E from './dist/engine.js';import {dwarfParameterSet} from './dist/dwarf-content.js';
// Reward/cooldown regression, not a balance gate: use legally generated acquired
// Lv60 supreme gear rather than an unskilled ordinary build that can lose against
// the current boss attack budget. Keep all enemies and production combat intact.
// Pin item identities/templates and initial combat RNG; allow stress-test variants.
const originalRandom=Math.random,originalNow=Date.now;
const fixtureSeed=Number(process.env.M3_REWARD_FIXTURE_SEED??1);
const fixtureNow=Number(process.env.M3_REWARD_FIXTURE_NOW??1770000000000);
assert(Number.isInteger(fixtureSeed)&&fixtureSeed>=0&&fixtureSeed<=0xffffffff);
assert(Number.isSafeInteger(fixtureNow)&&fixtureNow>=0);
let fixtureRng=fixtureSeed;
Math.random=()=>((fixtureRng=(Math.imul(fixtureRng,1664525)+1013904223)>>>0)/2**32);
Date.now=()=>fixtureNow;
const original=dwarfParameterSet(),p=historicalDwarfProvider('m3').provider;p.fieldGroupChance=0;/* Historical source/reward gates only; actors use the current regional balance. */assert(E.configureDwarfParameters(p));
try{for(const area of [4,5,6])for(const kind of ['field','dungeon',...(area===6?['boss']:[])]){const s=E.fresh();s.level=60;equipTestLoadout(s,{level:60,quality:3,clean:false});E.normalizeHealth(s,s.lastSeen);E.normalizeExpedition(s);s.heroHp=E.stats(s).hp;s.areaProgress.dwarf.unlocked=[1,2,3,4,5,6];s.areaProgress.dwarf.cleared=[1,2,3,4,5];const id=`dwarf.a0${area}.${kind}`;if(kind==='dungeon')s.dungeonRun={instanceId:id,runId:'m3-reward',stage:3};const e=E.startInstanceEncounter(s,id,s.lastSeen);assert(e);for(let i=0;i<3000&&!e.done;i++)E.step(s,e,s.nextActionAt);assert(e.win);let foundGear=false,foundSet=false,foundLegendWithGear=false;
for(let seed=1;seed<=250;seed++){const x=structuredClone(s),fight=x.activeEncounter;fight.rngState=seed;const before=new Set(x.inventory.map(i=>i.id));E.reward(x,fight,x.lastHealthClock);assert(E.validSave(x),id);const loot=x.inventory.filter(i=>!before.has(i.id));for(const it of loot){assert(it.level>=(area-1)*10+1&&it.level<=area*10);assert.equal(it.originRace,'dwarf');foundGear=true;if(it.set)foundSet=true;}if(kind==='field')assert(!loot.some(i=>i.set||i.legendaryId));if(kind==='boss'){assert(loot.filter(i=>i.legendaryId).length<=1);if(loot.some(i=>i.legendaryId)&&loot.some(i=>!i.legendaryId))foundLegendWithGear=true;assert(x.instanceCooldowns[id]>x.lastHealthClock);}if(kind==='dungeon'){assert(x.areaProgress.dwarf.cleared.includes(area));assert(x.areaProgress.dwarf.unlocked.includes(area+1));}const fingerprint=JSON.stringify(x);E.reward(x,fight,x.lastHealthClock);assert.equal(JSON.stringify(x),fingerprint);if(foundGear&&(kind==='field'||foundSet)&&(kind!=='boss'||foundLegendWithGear))break;}
if(kind==='boss'){
 const x=structuredClone(s);x.activeEncounter.rngState=1;let first=null;
 for(let seed=1;seed<=250&&!first;seed++){const trial=structuredClone(s);trial.activeEncounter.rngState=seed;E.reward(trial,trial.activeEncounter,trial.lastHealthClock);const legend=trial.inventory.find(i=>i.legendaryId);if(legend)first={state:trial,legendaryId:legend.legendaryId};}
 assert(first,'first boss legendary');const owned=first.state;const nextAt=owned.instanceCooldowns[id];assert.equal(E.startInstanceEncounter(structuredClone(owned),id,nextAt-1),null);owned.heroHp=E.stats(owned).hp;owned.nextBattleAt=nextAt;const again=E.startInstanceEncounter(owned,id,nextAt);assert(again,'repeat after independent cooldown');for(let i=0;i<3000&&!again.done;i++)E.step(owned,again,owned.nextActionAt);assert(again.win);let repeated=false;
 for(let seed=1;seed<=250&&!repeated;seed++){const trial=structuredClone(owned);trial.activeEncounter.rngState=seed;E.reward(trial,trial.activeEncounter,trial.lastHealthClock);assert(E.validSave(trial));repeated=trial.inventory.filter(i=>i.legendaryId===first.legendaryId).length>=2;}
 assert(repeated,'same local racial legendary may drop again; no unique ledger');
}
assert(foundGear,id+' gear');if(kind!=='field')assert(foundSet,id+' sets');if(kind==='boss')assert(foundLegendWithGear,'independent boss ordinary+legend reward');}
console.log('PASS M3 actual start/step/victory/reward: area gear bounds, dungeon sets, field exclusion, boss extra legend+ordinary coexistence, once-only reward/cooldown/progress/valid saves');
}finally{E.configureDwarfParameters(original);Math.random=originalRandom;Date.now=originalNow;}
