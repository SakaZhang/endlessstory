import * as Control from './dist/multi-control.js';
import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
import {DWARF_MONSTERS,configureDwarfParameters} from './dist/dwarf-content.js';
export const FIXTURE_BUDGET={id:'explicit-test-only',reviewed:false,testOnly:true,fieldGroupChance:.04,clearRewards:{1:{gold:20,xp:40,materialRounds:1,gearChance:.35,markChance:.02},2:{gold:30,xp:50,materialRounds:1,gearChance:.35,markChance:.02},3:{gold:40,xp:60,materialRounds:1,gearChance:.35,markChance:.02}},monsters:Object.fromEntries(Object.keys(DWARF_MONSTERS).map(id=>[id,{hp:150,atk:5,armor:10,elementalPower:7,basicIntervalMs:2200,rewardGold:4,rewardXp:20}]))};
assert(configureDwarfParameters(FIXTURE_BUDGET));
const setup=(options)=>{const s=E.fresh(options);E.normalizeHealth(s,s.lastSeen);E.normalizeExpedition(s);s.areaProgress.dwarf.unlocked=[1,2,3];s.areaProgress.dwarf.cleared=[1,2];s.expedition={mode:'field',fieldId:'dwarf.a01.field',targetInstanceId:null,loop:false};return s;};
for(const row of E.plannedNodes(setup()).filter(row=>row.areaNumber<=3)){
 const s=setup(),e=E.startInstanceEncounter(s,row.id,s.lastSeen);assert(e,row.id);assert.equal(e.contentVersion,'dwarf-m2-v1');assert(E.validSave(s),'save '+row.id);for(let i=0;i<300&&!e.done;i++)E.step(s,e,s.nextActionAt);assert(e.done);if(e.win)E.reward(s,e,s.lastHealthClock);assert(E.validSave(s),'after '+row.id);
}
console.log('PASS M2 actual 7-node spawn/step/save/settlement with explicit test budget');
// Retired routes cannot be reintroduced into current schema.
{const s=setup();assert.equal(E.startInstanceEncounter(s,'dwarf-blackforge-1-dungeon',s.lastSeen),null);assert.equal(E.startInstanceEncounter(s,'blackforge-road-boss',s.lastSeen),null);}
// Real typed actor execution: no Chinese parsing, independent elemental power,
// non-damaging shields, one-shot boss shield, source-snapshotted DOT.
import {initializeDwarfActor} from './dist/dwarf-effects.js';
function actorFixture(defId){const s=setup();s.skills=[null,null,null,null];const e=E.startInstanceEncounter(s,DWARF_MONSTERS[defId].nodes.at(-1),s.lastSeen);const u=e.enemies[0],d=DWARF_MONSTERS[defId],p={...FIXTURE_BUDGET.monsters[defId],hp:100000,atk:1,armor:100000,elementalPower:100,parameterSetId:'typed-test'};initializeDwarfActor(u,d,p,s.lastSeen);e.enemies=[u];e.targetId=u.id;e.rewardDefinitionId=defId;e.fieldGroup=false;return {s,e,u};}
{
 const {s,e,u}=actorFixture('dwarf.a03.normal.3');const t=s.lastSeen;u.control.cooldowns[DWARF_MONSTERS[u.definitionId].skills[0].id]=t;u.nextBasicAt=t+60000;const hp=e.heroHp;E.step(s,e,t+1100);assert.equal(e.heroHp,hp,'shield skill must not deal damage');assert(u.shield>0);assert.equal(u.shieldUntil,t+7100);
}
{
 const {s,e,u}=actorFixture('dwarf.a03.boss');const skill=DWARF_MONSTERS[u.definitionId].skills[2];u.hp=u.max*.49;u.nextBasicAt=s.lastSeen+60000;E.step(s,e,s.nextActionAt);assert.equal(u.skillUses[skill.id],1);u.shield=0;E.step(s,e,s.nextActionAt);assert.equal(u.skillUses[skill.id],1);assert.equal(u.shield,0,'half-HP shield cannot refresh repeatedly');
}
{
 const {s,e,u}=actorFixture('dwarf.a03.boss');const dotSkill=DWARF_MONSTERS[u.definitionId].skills[1];u.control.cooldowns[dotSkill.id]=s.lastSeen;u.control.cooldowns[DWARF_MONSTERS[u.definitionId].skills[0].id]=s.lastSeen+60000;E.step(s,e,s.nextActionAt);assert.equal(e.typedDots.length,1);assert.equal(e.typedDots[0].raw,10);const dot=structuredClone(e.typedDots[0]);u.elementalPower=1000;const hp=e.heroHp;E.step(s,e,s.nextActionAt);assert(e.heroHp<hp);assert.equal(e.typedDots[0].raw,dot.raw,'DOT source remains cast-time elementalPower');
 const snapshot=JSON.parse(JSON.stringify(s));assert(E.validSave(snapshot));const started=s.lastHealthClock;E.setMultiPaused(s,true,started);const ends=e.typedDots[0].endAt;E.setMultiPaused(s,false,started+30000);assert.equal(e.typedDots[0].endAt,ends+30000);
}
console.log('PASS M2 retired route rejection, actual shield/boss trigger/DOT source and paused DOT clock');
// Actual 4h scheduler parity with persistent battle RNG and JSON mid-fight restore.
{
 const seed=s=>{let n=s;return()=>{n=(Math.imul(n,1664525)+1013904223)>>>0;return n/2**32;};};
 const initial=setup();initial.running=true;initial.lastSeen=initial.lastHealthClock;E.normalizePotions(initial);const start=initial.lastSeen,end=start+14400000;
 const old=Math.random;let online=structuredClone(initial),batch=structuredClone(initial),rounds=0;
 try{
  Math.random=seed(331);let time=start;
  while(time<end&&online.running){
   if(online.restUntil>0){if(online.restUntil>end)break;time=Math.max(time,online.restUntil);E.settleRest(online,time);if(!online.running)break;continue;}
   if(online.nextBattleAt>time){time=Math.min(end,online.nextBattleAt);if(time>=end)break;}
   let e=online.activeEncounter;if(e?.done){if(e.win&&!e.rewarded)E.reward(online,e,time);else online.activeEncounter=null;continue;}
   if(!e){e=E.startRoutedEncounter(online,time);if(!e)break;e.luck=online.offlineLuck??0;}
   const at=Math.max(time,online.nextActionAt??time+1100);if(at>end)break;time=at;E.step(online,e,time);rounds++;
   if(e.done&&e.win)E.reward(online,e,time);
   if(rounds===10)online=JSON.parse(JSON.stringify(online));
  }
  E.settleRest(online,end);online.lastSeen=end;Math.random=seed(331);const result=E.offline(batch,end);
  for(const key of ['gold','xp','level','heroHp','kills','materialStacks','potionStacks','restUntil'])assert.deepEqual(online[key],batch[key],key);
  assert(E.validSave(online));assert(E.validSave(batch));console.log('M2_4H_PARITY',JSON.stringify({rounds,kills:batch.kills,rests:result.rests,hp:batch.heroHp,valid:true}));
 }finally{Math.random=old;}
}

configureDwarfParameters(null);
// Real planned boss cast/interrupt/stun clocks; no debug attack override.
{
 const control=Control;
 const tuned=structuredClone(FIXTURE_BUDGET);tuned.skillOverrides={'dwarf.a03.boss:0':{castMs:3300}};tuned.controlReduction={boss:.5,elite:.25,normal:0};tuned.interruptStopMs=550;assert(configureDwarfParameters(tuned));
 const s=setup();s.skills=[null,null,null,null];const e=E.startInstanceEncounter(s,'dwarf.a03.boss',s.lastSeen),u=e.enemies[0],skill='dwarf.a03.boss:0';u.hp=u.max=100000;u.control.cooldowns[skill]=s.lastSeen;const old=Math.random;
 E.step(s,e,s.nextActionAt);assert(u.control.preparing);const begun=u.control.preparing.completesAt,unstunned=structuredClone(s);
 const stun=control.applyStun(u.control,{now:s.lastHealthClock,baseDuration:1100,reduction:u.profile.controlReduction,diminishingFactors:[1,.5,.25],recoveryWindow:6600,minDuration:550,refreshMode:'max'});assert(stun);assert.equal(stun.duration,550);u.control=stun.state;E.step(s,e,s.nextActionAt);assert.equal(u.control.preparing.completesAt,begun+550,'stun pauses rather than completes cast');
 const delayed=structuredClone(s);for(const c of [unstunned,delayed])while(c.nextActionAt<=begun)E.step(c,c.activeEncounter,c.nextActionAt);assert.equal(unstunned.activeEncounter.enemies[0].skillUses[skill],1);assert.equal(delayed.activeEncounter.enemies[0].skillUses[skill]??0,0,'sub-turn550ms stun actually postpones the completed heavy attack');E.step(delayed,delayed.activeEncounter,delayed.nextActionAt);assert.equal(delayed.activeEncounter.enemies[0].skillUses[skill],1);
 s.level=30;s.skillTree.presets[0].unlocked=['breaking_intercept'];s.skillTree.presets[0].active=['breaking_intercept',null,null,null];s.skillTree.presets[0].conditions=['charge','always','always','always'];e.rngState=1;const at=s.nextActionAt;E.step(s,e,at);assert.equal(u.control.preparing,null);assert.equal(u.control.cooldowns[skill],at+12000);assert.equal(u.skillUses[skill]??0,0);assert(E.validSave(s));
 s.skillTree.presets[0].active=[null,null,null,null];const hp=e.heroHp;E.step(s,e,s.nextActionAt);assert(e.heroHp<hp,'normal basic allowed after interrupted brief stop');
 assert.equal(E.queueDeveloperAction(s,{kind:'damage',scope:'all',amount:10000}),false);const bad=structuredClone(s);bad.activeEncounter.fixtureAction={kind:'damage',scope:'all',amount:10000};assert(!E.validSave(bad));
 console.log('PASS M2 actual boss cast starts, positive shortened stun pauses/resumes, interrupt normal CD/basic recovery, formal no debug AoE');
}
configureDwarfParameters(null);
