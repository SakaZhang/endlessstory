import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
import {configureDwarfParameters,dwarfParameterSet,DWARF_MONSTERS} from './dist/dwarf-content.js';
const original=dwarfParameterSet(),budget={...structuredClone(original),id:'m3-slow-test-only',reviewed:false,testOnly:true,areas:[1,2,3,4,5,6],fieldGroupChance:0};
for(const d of Object.values(DWARF_MONSTERS))budget.monsters[d.id]={hp:100000,atk:1,armor:100000,elementalPower:1,basicIntervalMs:2200,rewardGold:1,rewardXp:1};
for(const a of [4,5,6])budget.clearRewards[a]=structuredClone(budget.clearRewards[3]);
function setup(options){
 const s=E.fresh(options);E.normalizeHealth(s,s.lastSeen);E.normalizeExpedition(s);E.normalizeContentMigration(s);
 s.areaProgress.dwarf.unlocked=[1,2,3,4,5,6];s.areaProgress.dwarf.cleared=[1,2,3,4,5];s.contentMigration.reselectRequired=false;s.skills=[null,null,null,null];
 const e=E.startInstanceEncounter(s,'dwarf.a05.field',s.lastSeen);assert(e);return {s,e};
}
try{
 assert(configureDwarfParameters(budget));
 const {s,e}=setup(),t=s.nextActionAt;
 for(const u of e.enemies){u.nextBasicAt=t;for(const k of Object.keys(u.control.cooldowns))u.control.cooldowns[k]=t+60000;}
 e.nextBasicSlow=1.15;e.cd.break=4;e.treeSkillCooldowns={};
 const hp=e.enemies.map(u=>u.hp);
 E.step(s,e,t);
 assert.equal(e.pendingBasicAt,t+165);assert.equal(s.nextActionAt,t+165);assert.equal(e.nextBasicSlow,undefined);assert.deepEqual(e.enemies.map(u=>u.hp),hp);
 assert.equal(e.cd.break,3);assert.equal(e.round,1);const enemyRound=e.enemies.map(u=>u.round),enemyNext=e.enemies.map(u=>u.nextBasicAt),hero=e.heroHp;
 const clone=JSON.parse(JSON.stringify(s));assert(E.validSave(clone),'pending snapshot');
 E.step(s,e,t+165);
 assert.equal(e.pendingBasicAt,undefined);assert.equal(s.nextActionAt,t+1100);assert.equal(e.round,1);assert.equal(e.cd.break,3);
 assert.deepEqual(e.enemies.map(u=>u.round),enemyRound);assert.deepEqual(e.enemies.map(u=>u.nextBasicAt),enemyNext);assert.equal(e.heroHp,hero);
 assert.equal(e.treeCombatClock,1265);assert.equal(e.lastCast.skillId,'basic');assert(E.validSave(s));
 E.step(clone,clone.activeEncounter,t+165);assert.deepEqual(clone,s,'JSON restore identical microevent');
 E.step(s,e,t+1100);assert.equal(e.round,2);assert.equal(e.treeCombatClock,2200);assert.equal(e.cd.break,2);
 // An eligible active action is never delayed or consumed by the basic-only slow.
 const active=setup({legacySkillModel:true});active.s.skills=['break',null,null,null];active.e.nextBasicSlow=1.15;
 E.step(active.s,active.e,active.s.nextActionAt);assert.equal(active.e.lastCast.skillId,'break');assert.equal(active.e.pendingBasicAt,undefined);assert.equal(active.e.nextBasicSlow,1.15);
 // Legacy timers/procs also retain one regular action opportunity, not a second full turn.
 const legacy=setup({legacySkillModel:true});legacy.e.nextBasicSlow=1.15;const lt=legacy.s.nextActionAt;
 E.step(legacy.s,legacy.e,lt);const lr=legacy.e.enemies.map(u=>u.round);E.step(legacy.s,legacy.e,lt+165);assert.equal(legacy.e.round,1);assert.deepEqual(legacy.e.enemies.map(u=>u.round),lr);assert.equal(legacy.e.lastCast.skillId,'basic');assert(E.validSave(legacy.s));
 // Pausing a pending hit shifts all event clocks, without losing the 165ms delay.
 const p=setup(),at=p.s.nextActionAt;p.e.nextBasicSlow=1.15;E.step(p.s,p.e,at);
 const scheduled=p.e.pendingBasicAt,regular=p.e.nextRegularAt,last=p.e.lastCombatEventAt;
 assert(E.setMultiPaused(p.s,true,at));assert(E.setMultiPaused(p.s,false,at+30000));
 assert.equal(p.e.pendingBasicAt,scheduled+30000);assert.equal(p.e.nextRegularAt,regular+30000);assert.equal(p.e.lastCombatEventAt,last+30000);assert(E.validSave(p.s));
 E.step(p.s,p.e,p.s.nextActionAt);assert.equal(p.e.pendingBasicAt,undefined);assert.equal(p.e.round,1);
 // Real front-end polls can arrive late: execute a queued basic once, never an enemy turn,
 // then preserve the regular opportunity. Timer precision is engine-scheduled, not browser wall-time.
 const late=setup(),due=late.s.nextActionAt;late.e.nextBasicSlow=1.15;E.step(late.s,late.e,due);
 const er=late.e.enemies.map(u=>u.round);E.step(late.s,late.e,due+250);assert.equal(late.e.round,1);assert.deepEqual(late.e.enemies.map(u=>u.round),er);assert.equal(late.e.treeCombatClock,1265);assert.equal(late.s.nextActionAt,due+1100);assert(E.validSave(late.s));
 E.step(late.s,late.e,due+1250);assert.equal(late.e.treeCombatClock,2200);assert.equal(late.e.round,2);
 const overdue=setup(),ot=overdue.s.nextActionAt;overdue.e.nextBasicSlow=1.15;E.step(overdue.s,overdue.e,ot);E.step(overdue.s,overdue.e,ot+1500);assert.equal(overdue.e.round,1);assert.equal(overdue.e.pendingBasicAt,undefined);assert.equal(overdue.s.nextActionAt,ot+1100);E.step(overdue.s,overdue.e,ot+1500);assert.equal(overdue.e.round,2);assert(E.validSave(overdue.s));
 const bad=structuredClone(p.s);bad.activeEncounter.pendingBasicAt=bad.activeEncounter.nextRegularAt;assert(!E.validSave(bad));
 console.log('PASS M3 slow: exact165ms basic-only event, enemy cadence/CD/round unchanged, 165+935 clocks, JSON restore, pause shift');
}finally{configureDwarfParameters(original);}
