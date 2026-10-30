import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
import {dungeonLootGroups,dungeonLootText} from './dist/dungeon-loot-receipts.js';
import {freshRareRewardProgress} from './dist/rare-reward-progress.js';
import {rollSourceSet,setDropProbability} from './dist/set-source-schema.js';
const originalRandom=Math.random;
let fixtureSeed=Number(process.env.RARE_IDLE_FIXTURE_SEED??7);assert(Number.isSafeInteger(fixtureSeed)&&fixtureSeed>=0&&fixtureSeed<=0xffffffff);
Math.random=()=>((fixtureSeed=(Math.imul(fixtureSeed,1664525)+1013904223)>>>0)/2**32);
try {
const clone=structuredClone;
function state(area=10){const s=E.fresh('elf');s.level=100;E.normalizeAreaProgress(s);s.areaProgress.elf={unlocked:Array.from({length:10},(_,i)=>i+1),cleared:Array.from({length:9},(_,i)=>i+1)};s.siteId=`elf.a${String(area).padStart(2,'0')}`;s.location=area-1;E.normalizeHealth(s,s.lastSeen);s.heroHp=E.stats(s).hp;return s;}
function won(s,kind='dungeon'){
 const id=s.siteId+'.'+kind,now=Math.max(s.lastHealthClock+3000,(s.instanceCooldowns?.[id]??0)+1);
 const e=E.startInstanceEncounter(s,id,now);assert(e,'actual registered encounter starts');
 // Reduce encounter-local enemy pressure, then resolve victory using production turns.
 for(const u of e.enemies){u.hp=1;u.shield=0;u.shieldUntil=0;u.armor=0;u.atk=0;u.elementalPower=0;}
 for(let n=0;n<100&&!e.done;n++)E.step(s,e,s.nextActionAt);
 assert(e.done&&e.win);assert(E.validSave(s));return e;
}
function finish(s,e){E.reward(s,e,s.lastHealthClock);assert(e.rewarded);assert(E.validSave(s));const after=JSON.stringify(s);E.reward(s,e,s.lastHealthClock);assert.equal(JSON.stringify(s),after,'repeat settlement no-op');}
function clearFixture(area=10){const s=state(area);for(let i=0;i<2;i++){finish(s,won(s));assert.equal(s.rareRewardProgress,undefined,'partial clears do not advance');}won(s);return s;}
const eligible={source:'drop',kind:'dungeon',areaNumber:10,race:'elf',clear:true,luck:21};
assert.equal(setDropProbability('dungeon',0),.08);assert.equal(setDropProbability('boss',0),.12);
assert(Math.abs(setDropProbability('dungeon',21)-.09292307692307693)<1e-14);
assert(Math.abs(setDropProbability('boss',21)-.13938461538461538)<1e-14);
for(const override of [{clear:false},{kind:'field'},{source:'forge'},{areaNumber:2},{race:'unknown'}])assert.equal(rollSourceSet({...eligible,...override},()=>0),null);
assert(rollSourceSet({...eligible,guaranteed:true},()=>.999));
// Natural clear result, save reload and exactly once, without historical retroactive grants.
const template=clearFixture();assert.equal(template.rareRewardProgress,undefined);const reloaded=JSON.parse(JSON.stringify(template));finish(reloaded,reloaded.activeEncounter);assert.equal(reloaded.rareRewardProgress.fruitProgress,1);
const settled=JSON.parse(JSON.stringify(reloaded));const snapshot=JSON.stringify(settled);E.reward(settled,settled.activeEncounter,settled.lastHealthClock);assert.equal(JSON.stringify(settled),snapshot);
const failure=clone(template);failure.activeEncounter.win=false;const failBefore=JSON.stringify(failure);assert.equal(E.reward(failure,failure.activeEncounter,failure.lastHealthClock),null);assert.equal(JSON.stringify(failure),failBefore);
// Find real RNG dry and hit paths; no settlement RNG mocking or forced win flags.
let drySeed,hitSeed;
for(let seed=1;seed<1000&&(drySeed===undefined||hitSeed===undefined);seed++){const s=clone(template);s.activeEncounter.rngState=seed;finish(s,s.activeEncounter);if(s.rareRewardProgress.dungeonDryStreak===1)drySeed=seed;else hitSeed=seed;}
assert(drySeed!==undefined&&hitSeed!==undefined);
const pity=clone(template);pity.rareRewardProgress=freshRareRewardProgress();pity.rareRewardProgress.dungeonDryStreak=19;pity.activeEncounter.rngState=drySeed;finish(pity,pity.activeEncounter);assert.equal(pity.rareRewardProgress.dungeonDryStreak,0);assert.equal(pity.inventory.filter(it=>it.set).length,1,'twentieth drought clear guarantees exactly one');
const nineteenth=clone(template);nineteenth.rareRewardProgress=freshRareRewardProgress();nineteenth.rareRewardProgress.dungeonDryStreak=18;nineteenth.activeEncounter.rngState=drySeed;finish(nineteenth,nineteenth.activeEncounter);assert.equal(nineteenth.rareRewardProgress.dungeonDryStreak,19);
// Full equipment slots + filter cannot eat pity; claim exact item later without reroll.
const full=clone(template);full.rareRewardProgress=freshRareRewardProgress();full.rareRewardProgress.dungeonDryStreak=19;E.setLootFilter(full,'equipment',[0,1,2,3,4]);
// The first two real stages may already have dropped ordinary gear: fill TO 50, not +50.
for(const slot of ['helm','armor','gloves','boots']){while(E.bagCounts(full).equipment[slot]<50)full.inventory.push(E.item(slot,91,null,0,{originRace:'elf'}));assert.equal(E.bagCounts(full).equipment[slot],50);}
finish(full,full.activeEncounter);assert.equal(full.rareRewardProgress.pendingSets.length,1);assert.equal(dungeonLootGroups(full)[0].pending.equipment,1);assert.match(dungeonLootText(dungeonLootGroups(full)[0]),/待领取（已保留）/);assert(!dungeonLootText(dungeonLootGroups(full)[0]).includes('随机未掉落'));const pending=clone(full.rareRewardProgress.pendingSets[0]);assert.equal(full.rareRewardProgress.dungeonDryStreak,0);assert.deepEqual(E.claimPendingRareRewards(full),{sets:0,fruit:0});
full.inventory.splice(full.inventory.findIndex(it=>it.slot===pending.slot),1);assert.equal(E.bagCounts(full).equipment[pending.slot],49);assert(E.canReceiveEquipment(full,pending));assert.deepEqual(E.claimPendingRareRewards(full),{sets:1,fruit:0});assert.deepEqual(full.inventory.find(it=>it.id===pending.id),pending);assert(E.validSave(full));
assert.deepEqual(E.claimPendingRareRewards(full),{sets:0,fruit:0});
// Fruit progress counts full dungeons in early areas; overflow keeps exact earned quantity.
const early=clearFixture(1);early.rareRewardProgress=freshRareRewardProgress();early.rareRewardProgress.fruitProgress=19;early.consumables.memoryFruit=1e9;finish(early,early.activeEncounter);assert.equal(early.rareRewardProgress.fruitProgress,0);assert.equal(early.rareRewardProgress.pendingFruit,1);assert.equal(dungeonLootGroups(early)[0].pending.items,1);assert.equal(early.rareRewardProgress.dungeonDryStreak,0);early.consumables.memoryFruit--;assert.deepEqual(E.claimPendingRareRewards(early),{sets:0,fruit:1});assert(E.validSave(early));
// Actual boss victory adds 3, preserves remainder and never resets dungeon streak.
const boss=state();boss.rareRewardProgress=freshRareRewardProgress();boss.rareRewardProgress.dungeonDryStreak=19;boss.rareRewardProgress.fruitProgress=19;finish(boss,won(boss,'boss'));assert.equal(boss.rareRewardProgress.dungeonDryStreak,19);assert.equal(boss.rareRewardProgress.fruitProgress,2);assert.equal(boss.consumables.memoryFruit,1);
// Offline uses identical central completed-encounter reward; starts stopped after one clear.
const online=clone(template),offline=clone(template);for(const s of [online,offline]){s.running=true;s.expedition.autoDungeon=false;s.expedition.autoBoss=false;s.expedition.loop=false;s.activeEncounter.rngState=drySeed;s.rareRewardProgress=freshRareRewardProgress();s.rareRewardProgress.dungeonDryStreak=19;s.rareRewardProgress.fruitProgress=19;}
finish(online,online.activeEncounter);E.offline(offline,Math.max(offline.lastSeen,offline.lastHealthClock)+3000);assert.deepEqual(offline.rareRewardProgress,online.rareRewardProgress);assert.deepEqual(offline.inventory,online.inventory);assert.deepEqual(offline.consumables,online.consumables);assert(E.validSave(offline));
// Optional-state strict validation and identity collision rejection.
for(const mutate of [p=>p.dungeonDryStreak=20,p=>p.fruitProgress=-1,p=>p.pendingFruit=1.5,p=>p.extra=true]){const s=clone(reloaded);mutate(s.rareRewardProgress);assert(!E.validSave(s));}
const dup=clone(full);dup.rareRewardProgress.pendingSets=[clone(pending)];assert(!E.validSave(dup));
// Independent reward exists even when ordinary equipment roll yields no item.
let independent=false;for(let seed=1;seed<300&&!independent;seed++){const s=clone(template);s.rareRewardProgress=freshRareRewardProgress();s.rareRewardProgress.dungeonDryStreak=19;s.activeEncounter.rngState=seed;finish(s,s.activeEncounter);const added=s.inventory.filter(it=>!template.inventory.some(old=>old.id===it.id));independent=added.length===1&&!!added[0].set;}assert(independent);
// Old receipts remain valid, and claiming prior rewards is not a new stage drop.
const oldReceipts=clone(full);for(const r of oldReceipts.dungeonLootReceipts.records)delete r.pending;assert(E.validSave(oldReceipts));assert.equal(dungeonLootGroups(oldReceipts)[0].pending.equipment,0);
const badReceipt=clone(full);badReceipt.dungeonLootReceipts.records[0].pending.equipment=-1;assert(!E.validSave(badReceipt));
const priorClaim=clone(template);priorClaim.rareRewardProgress=freshRareRewardProgress();priorClaim.rareRewardProgress.pendingSets.push(E.item('helm',91,'elf_arrow',3,{originRace:'elf'}));priorClaim.activeEncounter.rngState=drySeed;finish(priorClaim,priorClaim.activeEncounter);assert.equal(priorClaim.dungeonLootReceipts.records[0].stage,3);assert.equal(priorClaim.dungeonLootReceipts.records[0].received.equipment,priorClaim.inventory.length-template.inventory.length-1);
// Bounded pending storage pauses safely at the cap and resumes after an explicit claim.
const capped=clone(template);capped.rareRewardProgress=freshRareRewardProgress();capped.rareRewardProgress.dungeonDryStreak=19;capped.running=true;
for(const slot of ['helm','armor','gloves','boots']){while(E.bagCounts(capped).equipment[slot]<50)capped.inventory.push(E.item(slot,91,null,0,{originRace:'elf'}));assert.equal(E.bagCounts(capped).equipment[slot],50);}
for(let i=0;i<999;i++)capped.rareRewardProgress.pendingSets.push(E.item('helm',91,'elf_arrow',3,{originRace:'elf'}));
finish(capped,capped.activeEncounter);assert.equal(capped.rareRewardProgress.pendingSets.length,1000);assert.equal(capped.running,false);assert.equal(E.startInstanceEncounter(capped,'elf.a10.field',capped.lastHealthClock+3000),null);
const blockedDone=clone(template);blockedDone.rareRewardProgress=clone(capped.rareRewardProgress);blockedDone.inventory=clone(capped.inventory);blockedDone.running=true;assert(E.validSave(blockedDone));const blockedResult=E.offline(blockedDone,blockedDone.lastHealthClock+4000);assert.equal(blockedResult.kills,0);assert.equal(blockedDone.activeEncounter.rewarded,false);assert.equal(blockedDone.running,false);
const fruitCap=clone(template);fruitCap.rareRewardProgress=freshRareRewardProgress();fruitCap.rareRewardProgress.pendingFruit=1e9-1;fruitCap.rareRewardProgress.fruitProgress=19;fruitCap.consumables.memoryFruit=1e9;fruitCap.running=true;finish(fruitCap,fruitCap.activeEncounter);assert.equal(fruitCap.rareRewardProgress.pendingFruit,1e9);assert.equal(fruitCap.running,false);fruitCap.consumables.memoryFruit--;assert.equal(E.claimPendingRareRewards(fruitCap).fruit,1);assert(E.validSave(fruitCap));
const cappedReload=clone(capped);cappedReload.running=true;assert(E.offline(cappedReload,cappedReload.lastHealthClock+4000));assert.equal(cappedReload.running,false);
capped.inventory.splice(capped.inventory.findIndex(it=>it.slot==='helm'),1);assert.equal(E.claimPendingRareRewards(capped).sets,1);assert(E.validSave(capped));assert(E.startInstanceEncounter(capped,'elf.a10.field',capped.lastHealthClock+3000));
console.log('PASS rare idle rewards: actual three-stage combat, once-only/reload/offline, independent rates, twentieth-clear pity, early-area fruit, boss remainder, filter/overflow pending claims, old saves and invalid state.');

} finally {Math.random=originalRandom;}
