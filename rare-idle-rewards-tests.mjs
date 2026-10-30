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
function state(area=10,race='elf'){const s=E.fresh(race);s.level=100;E.normalizeAreaProgress(s);s.areaProgress[race]={unlocked:Array.from({length:10},(_,i)=>i+1),cleared:Array.from({length:9},(_,i)=>i+1)};s.siteId=`${race}.a${String(area).padStart(2,'0')}`;s.location=area-1;E.normalizeHealth(s,s.lastSeen);s.heroHp=E.stats(s).hp;return s;}
function won(s,kind='dungeon'){
 const id=s.siteId+'.'+kind,now=Math.max(s.lastHealthClock+3000,(s.instanceCooldowns?.[id]??0)+1),e=E.startInstanceEncounter(s,id,now);assert(e,'actual registered encounter starts '+id);
 for(const u of e.enemies){u.hp=1;u.shield=0;u.shieldUntil=0;u.armor=0;u.atk=0;u.elementalPower=0;}
 for(let n=0;n<100&&!e.done;n++)E.step(s,e,s.nextActionAt);
 assert(e.done&&e.win);assert(E.validSave(s));return e;
}
function finish(s,e=s.activeEncounter){E.reward(s,e,s.lastHealthClock);assert(e.rewarded);assert(E.validSave(s));const after=JSON.stringify(s);E.reward(s,e,s.lastHealthClock);assert.equal(JSON.stringify(s),after,'repeat settlement no-op');return s;}
function fixture(stage=1,area=10,race='elf',kind='dungeon'){const s=state(area,race);for(let i=1;i<stage;i++)finish(s,won(s,kind));won(s,kind);return s;}
function seeded(template,seed,streak=0){const s=clone(template);s.rareRewardProgress=freshRareRewardProgress();s.rareRewardProgress.dungeonDryStreak=streak;s.activeEncounter.rngState=seed;return finish(s);}
const added=(s,t)=>s.inventory.filter(it=>!t.inventory.some(old=>old.id===it.id));
function find(template,predicate,streak=0,max=3000){for(let seed=1;seed<=max;seed++){const s=seeded(template,seed,streak);if(predicate(s))return {seed,s};}assert.fail('seeded production path not found');}
const eligible={source:'drop',kind:'dungeon',areaNumber:10,race:'elf',clear:true,luck:21};
assert.equal(setDropProbability('dungeon',0),.08);assert.equal(setDropProbability('boss',0),.12);assert(Math.abs(setDropProbability('dungeon',21)-.09292307692307693)<1e-14);assert(Math.abs(setDropProbability('boss',21)-.13938461538461538)<1e-14);
for(const override of [{clear:false},{kind:'field'},{source:'forge'},{areaNumber:2},{race:'unknown'}])assert.equal(rollSourceSet({...eligible,...override},()=>0),null);
assert(rollSourceSet({...eligible,guaranteed:true},()=>.999));
const stage1=fixture(),stage2=fixture(2),clear=fixture(3);
const gear=find(stage1,s=>s.rareRewardProgress.dungeonDryStreak===1),empty=find(stage1,s=>s.rareRewardProgress.dungeonDryStreak===0&&added(s,stage1).length===0);
assert.equal(added(gear.s,stage1).length,1);assert(!added(gear.s,stage1)[0].set);
assert.equal(seeded(stage1,empty.seed,19).rareRewardProgress.dungeonDryStreak,19,'empty partial stage cannot advance pity');
const nineteenth=seeded(stage1,gear.seed,18);assert.equal(nineteenth.rareRewardProgress.dungeonDryStreak,19);assert.equal(added(nineteenth,stage1).length,1);assert(!added(nineteenth,stage1)[0].set);
const twentieth=seeded(stage1,gear.seed,19);assert.equal(twentieth.rareRewardProgress.dungeonDryStreak,0);assert.equal(added(twentieth,stage1).length,1,'replace, do not add');assert(added(twentieth,stage1)[0].set);
for(const t of [stage2,clear]){const result=find(t,s=>s.rareRewardProgress.dungeonDryStreak===1);assert(added(result.s,t).some(it=>!it.set),'all stages count actual generated gear');}
const dryClear=find(clear,s=>added(s,clear).length===0&&s.rareRewardProgress.dungeonDryStreak===19,19);assert.equal(dryClear.s.rareRewardProgress.dungeonDryStreak,19,'empty clear cannot force pity');
const natural=find(clear,s=>added(s,clear).length===1&&!!added(s,clear)[0].set);assert.equal(natural.s.rareRewardProgress.dungeonDryStreak,0,'independent natural set can occur without ordinary gear');
const naturalReset=find(clear,s=>added(s,clear).some(it=>it.set),7);assert.equal(naturalReset.s.rareRewardProgress.dungeonDryStreak,0);
// Count generation before filters and capacity, but protect the replacement itself.
const filtered=clone(stage1);E.setLootFilter(filtered,'equipment',[0,1,2,3,4]);filtered.activeEncounter.rngState=gear.seed;finish(filtered);assert.equal(filtered.rareRewardProgress.dungeonDryStreak,1);assert.equal(added(filtered,stage1).length,0);assert.equal(filtered.dungeonLootReceipts.records[0].discarded.equipment,1);
const full=clone(stage1);for(const slot of E.SLOTS)while(E.bagCounts(full).equipment[slot]<50)full.inventory.push(E.item(slot,91,null,0,{originRace:slot==='core'?'ashen':'elf'}));full.rareRewardProgress=freshRareRewardProgress();full.activeEncounter.rngState=gear.seed;finish(full);assert.equal(full.rareRewardProgress.dungeonDryStreak,1);assert.equal(full.dungeonLootReceipts.records[0].overflow.equipment,1);
const protectedFull=clone(stage1);for(const slot of ['helm','armor','gloves','boots'])while(E.bagCounts(protectedFull).equipment[slot]<50)protectedFull.inventory.push(E.item(slot,91,null,0,{originRace:'elf'}));E.setLootFilter(protectedFull,'equipment',[0,1,2,3,4]);protectedFull.rareRewardProgress=freshRareRewardProgress();protectedFull.rareRewardProgress.dungeonDryStreak=19;protectedFull.activeEncounter.rngState=gear.seed;finish(protectedFull);assert.equal(protectedFull.rareRewardProgress.pendingSets.length,1);assert.equal(dungeonLootGroups(protectedFull)[0].pending.equipment,1);assert.match(dungeonLootText(dungeonLootGroups(protectedFull)[0]),/待领取（已保留）/);const pending=clone(protectedFull.rareRewardProgress.pendingSets[0]);assert.deepEqual(E.claimPendingRareRewards(protectedFull),{sets:0,fruit:0});protectedFull.inventory.splice(protectedFull.inventory.findIndex(it=>it.slot===pending.slot),1);assert.equal(E.claimPendingRareRewards(protectedFull).sets,1);assert.deepEqual(protectedFull.inventory.find(it=>it.id===pending.id),pending);assert.equal(E.claimPendingRareRewards(protectedFull).sets,0);
// Legacy progress is not gear count, nor a retroactive fruit award. Pending identities survive.
const legacy=clone(stage1);legacy.consumables.memoryFruit=5000;legacy.rareRewardProgress={version:1,dungeonDryStreak:19,fruitProgress:19,pendingSets:[E.item('helm',91,'elf_arrow',3,{originRace:'elf'})],pendingFruit:7};const oldSet=clone(legacy.rareRewardProgress.pendingSets[0]);legacy.activeEncounter.rngState=empty.seed;finish(legacy);assert.equal(legacy.rareRewardProgress.version,2);assert.equal(legacy.rareRewardProgress.dungeonDryStreak,0);assert(!Object.hasOwn(legacy.rareRewardProgress,'fruitProgress'));assert.equal(legacy.consumables.memoryFruit,5007);assert.deepEqual(legacy.inventory.find(it=>it.id===oldSet.id),oldSet);
const legacyGear=clone(stage1);legacyGear.rareRewardProgress={version:1,dungeonDryStreak:19,fruitProgress:19,pendingSets:[],pendingFruit:0};legacyGear.activeEncounter.rngState=gear.seed;finish(legacyGear);assert.equal(legacyGear.rareRewardProgress.dungeonDryStreak,1);assert.equal(added(legacyGear,stage1).filter(it=>it.set).length,0,'old clear count is never reinterpreted as equipment count');
const failed=clone(clear);failed.activeEncounter.win=false;const failBefore=JSON.stringify(failed);assert.equal(E.reward(failed,failed.activeEncounter,failed.lastHealthClock),null);assert.equal(JSON.stringify(failed),failBefore);
// Elf specialty actual battles: all three source kinds, early region too; boss never touches dungeon count.
for(const kind of ['field','dungeon','boss']){const t=fixture(1,kind==='dungeon'?1:10,'elf',kind),fruit=find(t,s=>s.consumables.memoryFruit>t.consumables.memoryFruit,19);assert.equal(fruit.s.consumables.memoryFruit-t.consumables.memoryFruit,1);assert.equal(fruit.s.rareRewardProgress.dungeonDryStreak,19);assert(!fruit.s.activeEncounter);}
const boss=fixture(1,10,'elf','boss'),bossSet=find(boss,s=>added(s,boss).some(it=>it.set),19);assert.equal(bossSet.s.rareRewardProgress.dungeonDryStreak,19);
for(const race of ['dwarf','human','goblin','ashen'])for(const kind of ['field','dungeon','boss']){const t=fixture(1,race==='ashen'?4:9,race,kind);for(let seed=1;seed<=40;seed++){const s=seeded(t,seed,19);assert.equal(s.consumables.memoryFruit,t.consumables.memoryFruit);if(kind!=='dungeon')assert.equal(s.rareRewardProgress.dungeonDryStreak,19);}}
// Region, not hero identity, determines the specialty.
function visiting(hero,region){const s=state(9,hero);s.areaProgress[region]={unlocked:Array.from({length:10},(_,i)=>i+1),cleared:Array.from({length:9},(_,i)=>i+1)};s.siteId=region+'.a09';s.location=8;s.expedition={mode:'field',fieldId:region+'.a09.field',targetInstanceId:null,loop:false};won(s,'field');return s;}
const humanVisitor=visiting('human','elf');assert.equal(find(humanVisitor,s=>s.consumables.memoryFruit>0).s.consumables.memoryFruit,1);
const elfVisitor=visiting('elf','human');for(let seed=1;seed<=100;seed++)assert.equal(seeded(elfVisitor,seed).consumables.memoryFruit,0);
// Seeded completed encounter replay matches online, without replaying drops twice.
const online=clone(clear),offline=clone(clear);for(const s of [online,offline]){s.running=true;s.expedition.autoDungeon=false;s.expedition.autoBoss=false;s.expedition.loop=false;s.activeEncounter.rngState=dryClear.seed;s.rareRewardProgress=freshRareRewardProgress();s.rareRewardProgress.dungeonDryStreak=19;}
finish(online);E.offline(offline,Math.max(offline.lastSeen,offline.lastHealthClock)+3000);assert.deepEqual(offline.rareRewardProgress,online.rareRewardProgress);assert.deepEqual(offline.inventory,online.inventory);assert.deepEqual(offline.consumables,online.consumables);assert(E.validSave(offline));
// Optional state strictness, old receipt compatibility and no identity collisions.
for(const mutate of [p=>p.dungeonDryStreak=20,p=>p.fruitProgress=0,p=>p.pendingFruit=1.5,p=>p.extra=true]){const s=clone(twentieth);mutate(s.rareRewardProgress);assert(!E.validSave(s));}
const dup=clone(protectedFull);dup.rareRewardProgress.pendingSets=[clone(pending)];assert(!E.validSave(dup));const oldReceipts=clone(protectedFull);for(const r of oldReceipts.dungeonLootReceipts.records)delete r.pending;assert(E.validSave(oldReceipts));
// Two slots are reserved for final-stage replacement + natural independent reward.
const doubleSet=find(clear,s=>added(s,clear).filter(it=>it.set).length===2,19);assert.equal(doubleSet.s.rareRewardProgress.dungeonDryStreak,0);
const twoSlots=clone(clear);twoSlots.rareRewardProgress=freshRareRewardProgress();twoSlots.rareRewardProgress.dungeonDryStreak=19;for(const slot of ['helm','armor','gloves','boots'])while(E.bagCounts(twoSlots).equipment[slot]<50)twoSlots.inventory.push(E.item(slot,91,null,0,{originRace:'elf'}));for(let i=0;i<998;i++)twoSlots.rareRewardProgress.pendingSets.push(E.item('helm',91,'elf_arrow',3,{originRace:'elf'}));twoSlots.activeEncounter.rngState=doubleSet.seed;twoSlots.running=true;finish(twoSlots);assert.equal(twoSlots.rareRewardProgress.pendingSets.length,1000);assert.equal(twoSlots.running,false);assert(E.validSave(twoSlots));
const capped=clone(stage1);capped.rareRewardProgress=freshRareRewardProgress();for(const slot of ['helm','armor','gloves','boots'])while(E.bagCounts(capped).equipment[slot]<50)capped.inventory.push(E.item(slot,91,null,0,{originRace:'elf'}));for(let i=0;i<999;i++)capped.rareRewardProgress.pendingSets.push(E.item('helm',91,'elf_arrow',3,{originRace:'elf'}));capped.running=true;const result=E.offline(capped,capped.lastHealthClock+4000);assert.equal(result.kills,0);assert.equal(capped.activeEncounter.rewarded,false);assert.equal(capped.running,false);assert.equal(capped.rareRewardProgress.pendingSets.length,999);assert(E.validSave(capped));
const fruitTemplate=fixture(1,1),fruitSeed=find(fruitTemplate,s=>s.consumables.memoryFruit>fruitTemplate.consumables.memoryFruit).seed;const fruitCap=clone(fruitTemplate);fruitCap.rareRewardProgress=freshRareRewardProgress();fruitCap.rareRewardProgress.pendingFruit=1e9-1;fruitCap.consumables.memoryFruit=1e9;fruitCap.running=true;fruitCap.activeEncounter.rngState=fruitSeed;finish(fruitCap);assert.equal(fruitCap.rareRewardProgress.pendingFruit,1e9);assert.equal(fruitCap.running,false);fruitCap.consumables.memoryFruit--;assert.equal(E.claimPendingRareRewards(fruitCap).fruit,1);assert(E.validSave(fruitCap));
console.log('PASS v081 rare rewards: real stage victories, generated-gear hidden twentieth replacement, empty/no pity, filters/overflow, natural independent/reset, boss isolation, elf specialty all sources, legacy migration/pending identity, once-only/offline/caps.');
} finally {Math.random=originalRandom;}
