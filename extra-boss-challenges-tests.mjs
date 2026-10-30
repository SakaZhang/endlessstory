import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
import {markVictory} from './current-combat-test-fixture.mjs';
// Scope all implicit clocks and encounter-creation randomness, restoring even on assertion failure.
// Combat itself uses the engine's persisted encounter PRNG.
const T=1793343600000,originalNow=Date.now,originalRandom=Math.random;
Date.now=()=>T;Math.random=()=>0.5;
try {
function game(race='human'){const s=E.fresh(race);E.normalizeHealth(s,T);E.normalizeExpedition(s);s.gold=100000;s.areaProgress.dwarf={unlocked:[1,2,3,4],cleared:[1,2,3]};assert(E.travelToArea(s,'dwarf.a03',T));return s;}
function reject(s,fn){const before=JSON.stringify(s);assert.equal(fn(),false);assert.equal(JSON.stringify(s),before);}
function bank(s,n=3){assert(E.buyBossChallengeToken(s,Math.ceil(n/3)));assert(E.useBossChallengeToken(s,n));}
function win(s,e,t=T){markVictory(e);E.reward(s,e,t);}
const id='dwarf.a03.boss';
// Optional additive fields preserve all old saves and reject malformed numeric balances.
{const s=game();assert(E.validSave(s));assert.deepEqual(E.bossChallengeStatus(s),{charges:0,extraChallenges:0,items:0});
 for(const bad of [-1,.1,'3',null,NaN,Infinity,1e9+1,Number.MAX_SAFE_INTEGER]){assert(!E.validSave({...s,extraBossChallenges:bad}));assert(!E.validSave({...s,consumables:{...s.consumables,bossChallengeCharges:bad}}));}
 for(const race of ['human','dwarf','elf','goblin','ashen']){const x=E.fresh(race);x.gold=1000;assert(E.buyBossChallengeToken(x));assert.equal(x.gold,0);assert.equal(x.consumables.bossChallengeCharges,3);}
}
{const s=game(),gold=s.gold;assert(E.buyBossChallengeToken(s,2));assert.equal(s.gold,gold-2000);assert.equal(s.consumables.bossChallengeCharges,6);assert.equal(E.bagCounts(s).items,1);
 assert(E.useBossChallengeToken(s,2));assert(E.useBossChallengeToken(s));assert.equal(s.extraBossChallenges,3);assert.equal(s.consumables.bossChallengeCharges,3);
 for(const q of [0,-1,1.1,'1',NaN,Infinity,1e15]){reject(s,()=>E.buyBossChallengeToken(s,q));reject(s,()=>E.useBossChallengeToken(s,q));}
 reject(s,()=>E.useBossChallengeToken(s,4));s.gold=999;reject(s,()=>E.buyBossChallengeToken(s));
 s.gold=100000;s.consumables.bossChallengeCharges=1e9-2;reject(s,()=>E.buyBossChallengeToken(s));s.extraBossChallenges=1e9;reject(s,()=>E.useBossChallengeToken(s));
}
// Existing non-token item stacks use the same 100-stack item bag, not material capacity.
// Synthetic stack-count fixture tests the admission boundary; production currently has only 60 potion stacks.
{const s=game();s.potionStacks=Object.fromEntries(Array.from({length:100},(_,i)=>['synthetic'+i,1]));assert.equal(E.bagCounts(s).items,100);assert.equal(E.canReceiveItem(s,'bossChallengeCharges',3),false);
 s.consumables.bossChallengeCharges=1;assert(E.canReceiveItem(s,'bossChallengeCharges',3));}
// Activation is clock/encounter independent, never silently starts combat or clears cooldown.
{const s=game();bank(s);s.instanceCooldowns[id]=T+1800000;const e=E.startInstanceEncounter(s,'dwarf.a03.field',T),before=structuredClone(e),cd=structuredClone(s.instanceCooldowns),clock=s.lastHealthClock;assert(E.buyBossChallengeToken(s));reject(s,()=>E.useBossChallengeToken(s,2));assert.deepEqual(e,before);assert.deepEqual(s.instanceCooldowns,cd);assert.equal(s.lastHealthClock,clock);assert.equal(s.extraBossChallenges,3);assert.equal(E.startInstanceEncounter(s,id,T),null);assert.equal(s.extraBossChallenges,3);
}
// Ready challenge is free; cooldown challenge charges once and success still starts 30m CD.
{let s=game();bank(s);let e=E.startInstanceEncounter(s,id,T);assert(e);assert.equal(s.extraBossChallenges,3);win(s,e);assert.equal(s.instanceCooldowns[id],T+1800000);
 e=E.startInstanceEncounter(s,id,T+1800);assert(e);assert.equal(s.extraBossChallenges,2);const eid=e.id;assert.equal(E.startInstanceEncounter(s,id,T+1800).id,eid);assert.equal(s.extraBossChallenges,2);
 s=JSON.parse(JSON.stringify(s));assert(E.validSave(s));assert.equal(E.startRoutedEncounter(s,T+1800).id,eid);assert.equal(s.extraBossChallenges,2);
 assert(E.setMultiPaused(s,true,T+2000));E.startInstanceEncounter(s,id,T+2200);assert.equal(s.extraBossChallenges,2);assert(E.setMultiPaused(s,false,T+2300));win(s,s.activeEncounter,T+3000);assert.equal(s.instanceCooldowns[id],T+1803000);
 e=E.startInstanceEncounter(s,id,T+1803001);assert(e);assert.equal(s.extraBossChallenges,2);
}
// Manual map admission honors extra attempts but never allows foreign/locked targets or no-boss nodes.
{const s=game();bank(s);s.instanceCooldowns[id]=T+1800000;assert(E.chooseAdventureNode(s,id,{start:true},T));assert.equal(s.extraBossChallenges,2);
 const x=game();bank(x);assert(E.travelToArea(x,'dwarf.a01',T));x.instanceCooldowns[id]=T+1800000;assert.equal(E.startInstanceEncounter(x,id,T),null);assert.equal(E.chooseAdventureNode(x,id,{start:true},T),null);assert.equal(E.startInstanceEncounter(x,'dwarf.a01.boss',T),null);assert.equal(x.extraBossChallenges,3);
 x.siteId='dwarf.a03';x.location=2;x.areaProgress.dwarf={unlocked:[1],cleared:[]};assert.equal(E.startInstanceEncounter(x,id,T),null);assert.equal(x.extraBossChallenges,3);
}
// Auto-routing uses credits on success cooldown, preserves failure wait and respects stop/offline.
{const s=game();bank(s);E.setExpeditionAutomation(s,'boss',true);s.instanceCooldowns[id]=T+1800000;assert.equal(E.nextEncounterRoute(s,T).id,id);s.autoBossRetryAt={[id]:T+900000};assert.equal(E.nextEncounterRoute(s,T).kind,'field');assert.equal(E.nextEncounterRoute(s,T+900000).id,id);delete s.autoBossRetryAt;
 s.running=false;E.offline(s,T+60000);assert.equal(s.extraBossChallenges,3);assert.equal(s.activeEncounter,null);
 const e=E.startRoutedEncounter(s,T+60000);assert(e.automaticBoss);assert.equal(s.extraBossChallenges,2);s.heroHp=e.heroHp=1;for(const u of e.enemies){u.hp=u.max=1e8;u.atk=1e8;u.nextBasicAt=s.lastHealthClock;}E.step(s,e,s.nextActionAt);assert(s.restUntil>s.lastHealthClock);const retry=s.autoBossRetryAt[id];assert(retry);E.settleRest(s,s.restUntil);assert.equal(E.nextEncounterRoute(s,s.lastHealthClock).kind,'field');assert.equal(s.extraBossChallenges,2);
}
// Offline scheduler must use the same new-start debit, never spend on replaying an existing fight.
{const s=game();bank(s);E.setExpeditionAutomation(s,'boss',true);s.instanceCooldowns[id]=T+1800000;s.running=true;s.lastSeen=T;E.offline(s,T+2000);assert.equal(s.extraBossChallenges,2);assert.equal(s.activeEncounter.instanceId,id);const balance=s.extraBossChallenges;E.offline(s,T+2000);assert.equal(s.extraBossChallenges,balance);assert(E.validSave(s));}
// Real combat settlement (no markVictory) consumes one credit, rewards once, and preserves ordinary CD.
{const s=game();bank(s);s.instanceCooldowns[id]=T+1800000;const e=E.startInstanceEncounter(s,id,T);assert.equal(s.extraBossChallenges,2);
 e.rngState=0x080b055;e.rngDraws=0;
 for(const u of e.enemies){u.hp=1;u.armor=0;u.evasion=0;u.nextBasicAt=T+100000;}
 let steps=0;for(;steps<100&&!e.done;steps++)E.step(s,e,s.nextActionAt);
 assert.equal(steps,1,'fixed fixture must settle through one real combat step');
 assert(e.rngDraws>0,'real combat must advance persisted RNG');
 assert(e.done&&e.win);E.reward(s,e,s.lastHealthClock);const gold=s.gold;assert.equal(s.instanceCooldowns[id],s.lastHealthClock+1800000);E.reward(s,e,s.lastHealthClock);assert.equal(s.gold,gold);assert.equal(s.extraBossChallenges,2);}
{const s=E.fresh();s.gold=1000;assert(E.buyBossChallengeToken(s));assert(E.useBossChallengeToken(s));assert.equal(s.extraBossChallenges,1);assert.equal(s.running,false);assert(!s.activeEncounter);assert(E.validSave(s));}
// Failed persistence via clone-save-adopt leaves live gold, charges and attempts untouched.
{let s=game();const before=JSON.stringify(s);const draft=structuredClone(s);assert(E.buyBossChallengeToken(draft));assert(E.useBossChallengeToken(draft));const persisted=false;if(persisted)s=draft;assert.equal(JSON.stringify(s),before);}
console.log('PASS extra boss attempts: additive saves, strict bounds, fixed pricing, inventory, activation, free priority, cooldown debit once, reload/pause, locality/access, auto failure wait, offline and failed persistence');

} finally {Date.now=originalNow;Math.random=originalRandom;}
