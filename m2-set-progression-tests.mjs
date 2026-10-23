import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
import {enableM2TestBudget} from './m2-test-budget-fixture.mjs';
import {configureDwarfParameters} from './dist/dwarf-content.js';
enableM2TestBudget();let s=E.fresh();s.lastSeen=0;E.normalizeHealth(s,0);E.normalizeExpedition(s);E.normalizeContentMigration(s);for(const it of s.inventory){it.atk=10000;for(const key of ['baseBudgetModel','budgetLevel','budgetSourceLevel','budgetCompatibility'])delete it[key];}
const start=(state,id)=>{state.running=false;state.nextBattleAt=0;const now=Math.max(state.lastHealthClock??0,state.instanceCooldowns?.[id]??0);const e=E.startInstanceEncounter(state,id,now);assert(e,id);for(let i=0;i<10&&!e.done;i++)E.step(state,e,state.nextActionAt);assert(e.win,id+' actual combat win');return e;};
for(const area of [1,2]){const id=`dwarf.a0${area}.dungeon`;for(let stage=1;stage<=3;stage++){const e=start(s,id);assert.equal(e.dungeonStage,stage);for(let seed=0;seed<128;seed++){const c=structuredClone(s);c.activeEncounter.rngState=seed;assert(!E.reward(c,c.activeEncounter,c.lastHealthClock)?.set,'A01/A02 actual source never sets');}const reward=E.reward(s,e,s.lastHealthClock);assert(!reward?.set);}assert(E.getAreaProgress(s).unlocked.includes(area+1));}
assert.deepEqual(E.getAreaProgress(s).unlocked,[1,2,3]);
// Actual A03 normal rewards, not source-policy-only synthetic calls. Replay the
// completed victory with explicit deterministic RNG boundaries until each part.
for(const area of [1,2,3]){const c=structuredClone(s);c.dungeonRun=null;c.activeEncounter=null;start(c,`dwarf.a0${area}.field`);for(let seed=0;seed<128;seed++){const trial=structuredClone(c);trial.activeEncounter.rngState=seed;assert(!E.reward(trial,trial.activeEncounter,trial.lastHealthClock)?.set,'actual fields never sets');}}
const acquired=[];
for(const slot of ['helm','armor','gloves','boots']){
 const e=start(s,'dwarf.a03.dungeon');let selected=null;
 for(let seed=0;seed<40000&&!selected;seed++){const candidate=structuredClone(s),battle=candidate.activeEncounter;battle.rngState=seed;const drop=E.reward(candidate,battle,candidate.lastHealthClock);if(drop?.set==='anvil'&&drop.slot===slot){selected=candidate;acquired.push(drop.id);}}
 assert(selected,'A03 actual set reward '+slot);s=selected;
 if(s.dungeonRun){while(s.dungeonRun){const next=start(s,'dwarf.a03.dungeon');E.reward(s,next,s.lastHealthClock);}}
}
assert.equal(acquired.length,4);for(const id of acquired){const it=s.inventory.find(i=>i.id===id);assert.equal(it.rarity,3);assert.equal(it.set,'anvil');assert(E.equipItem(s,id));}
assert.equal(E.stats(s).count.anvil,4);assert(E.validSave(s));
// Boss actual source also yields supreme sets; all-clear requires every unit.
const boss=start(s,'dwarf.a03.boss');let bossDrop=null;for(let seed=0;seed<20000&&!bossDrop;seed++){const c=structuredClone(s);c.activeEncounter.rngState=seed;const d=E.reward(c,c.activeEncounter,c.lastHealthClock);if(d?.set){bossDrop=d;assert.equal(d.rarity,3);assert.equal(c.instanceCooldowns['dwarf.a03.boss'],c.lastHealthClock+1800000);}}assert(bossDrop);
// Two/four-piece effects affect actual damage with identical raw equipment stats.
function damageAt(parts,skill){const historical=E.fresh({legacySkillModel:true}),c=structuredClone(s);delete c.skillTree;c.skillRulesVersion=historical.skillRulesVersion;c.skillAccess=structuredClone(historical.skillAccess);c.activeEncounter=null;c.running=false;c.dungeonRun=null;c.nextBattleAt=0;c.skills=[skill,null,null,null];c.skillAccess.legacyAll=true;c.skillAccess.notified=Object.keys(E.SKILLS);c.conditions=['always','always','always','always'];for(const [i,id] of acquired.entries())if(i>=parts){const it=c.inventory.find(x=>x.id===id);it.set=null;for(const k of ['baseBudgetModel','budgetLevel','budgetSourceLevel','budgetCompatibility','templateId','baseVariant','weaponType','originRace','visualKey','visualVariant','iconKey'])delete it[k];}const e=E.startInstanceEncounter(c,'dwarf.a03.field',c.lastHealthClock);for(const u of e.enemies){u.hp=u.max=1e9;u.armor=0;}e.rngState=1;E.step(c,e,c.nextActionAt);return e.lastCast.hits[0].actualHpLost;}
assert(damageAt(2,'break')>damageAt(0,'break'));assert(damageAt(4,'heavy')>damageAt(2,'heavy'));
console.log('PASS M2 actual A01→A02→A03 unlocks, A03 dungeon/boss supreme sets received/equipped, real2/4 combat multipliers');configureDwarfParameters(null);
