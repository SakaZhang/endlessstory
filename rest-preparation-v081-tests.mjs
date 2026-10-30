import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
import {commitGameTransaction} from './dist/storage.js';
import {createIdleActionController} from './dist/idle-action-controller.js';
import {safeRestPreparation,noncombatRunning} from './dist/noncombat-policy.js';
import {reachStoryScene} from './story-event-test-fixture.mjs';
import {reconcileOtherworldStone,useOtherworldStone} from './dist/otherworld-entitlement.js';
const T=Date.now();let now=T,s,raw,fail=false;
const storage={setItem(k,v){if(fail)throw Error('quota');raw=v;}};
function tx(action){const r=commitGameTransaction(storage,s,action,{now});if(r.ok)s=r.game;return r;}
function lose(){const e=E.startRoutedEncounter(s,now);assert(e);s.heroHp=e.heroHp=1;if(!e.otherworld)for(const u of e.enemies){u.hp=u.max=1e8;u.atk=1e8;u.nextBasicAt=now;}let turns=0;while(!e.done&&turns++<100)E.step(s,e,s.nextActionAt);assert(e.done&&!e.win);assert(s.restUntil>0);assert(s.restResume);now=s.lastHealthClock;return e;}
function snapshot(){return JSON.stringify({rest:s.restUntil,hp:s.heroHp,running:s.running,resume:s.restResume,route:s.expedition,site:s.siteId,tower:s.otherworld?.active,floor:s.otherworld?.floor,cooldowns:s.instanceCooldowns,kills:s.kills});}
function unchanged(action,label){const before=snapshot();assert(tx(action).ok,label);assert.equal(snapshot(),before,label+' preserves recovery and route');assert(E.validSave(s));assert.equal(E.startRoutedEncounter(s,s.restUntil-1),null);}
s=E.fresh('dwarf');E.normalizeHealth(s,T);E.normalizeExpedition(s);s.level=10;s.gold=10000;s.consumables.memoryFruit=3;s.consumables.refundCredits=10;s.materialStacks['铁屑|0']=100;
const it=E.item('weapon',10,null,2);s.inventory.push(it);assert(E.saveLoadout(s,0,'before defeat'));lose();const deadline=s.restUntil;
assert(safeRestPreparation(s));assert(!noncombatRunning(s));
unchanged(n=>E.equipItem(n,it.id),'equip');unchanged(n=>E.saveLoadout(n,1,'during rest'),'save build');unchanged(n=>E.applyLoadout(n,0),'switch build');unchanged(n=>E.applyLoadout(n,1),'restore build');
unchanged(n=>E.useWisdomFruit(n,3),'wisdom fruit');const before=structuredClone(s);assert(!tx(n=>E.useWisdomFruit(n,3)).ok);assert.deepEqual(s,before);
unchanged(n=>E.spendTalent(n,'power'),'talent');unchanged(n=>E.commitTalentRefund(n,{power:1}),'respec');
const shop=E.ensureMerchant(s,now),offer=shop.offers.find(o=>o.type==='equipment');assert(offer);unchanged(n=>E.purchaseEquipment(n,offer.offerId,shop.revision,now),'shop buy');
const quote=E.getReforgeQuote(s,it.id,'value',0);unchanged(n=>E.reforge(n,it.id,'value',0,undefined,quote),'reforge preview');s=JSON.parse(raw);assert(E.validSave(s));unchanged(n=>E.resolveReforge(n,true),'reforge equipped accept');
unchanged(n=>E.forge(n,['铁屑|0']),'craft');
const c=createIdleActionController({read:()=>s,commit:tx,now:()=>now});const blocked=structuredClone(s);assert.equal(c.request({action:n=>E.travelToArea(n,'human.a01',now)}).reason,'rest');assert.deepEqual(s,blocked);assert(!E.chooseAdventureNode(s,'dwarf.a01.field',{start:true},now));assert(!E.travelToArea(s,'human.a01',now));
fail=true;const quota=structuredClone(s);assert.equal(tx(n=>E.useWisdomFruit(n,2)).reason,'storage');assert.deepEqual(s,quota);fail=false;
s=JSON.parse(JSON.stringify(s));assert.equal(s.restUntil,deadline);assert.equal(s.heroHp,0);assert.equal(E.settleRest(s,deadline-1),false);assert(E.settleRest(s,deadline));assert(s.running);assert.equal(E.startRoutedEncounter(s,deadline).kind,'field');
// Explicit stop wins, and an unfinished paused battle never qualifies as preparation.
now=deadline+2000;E.startRest(s,now,true);s.running=false;s.restResume=false;unchanged(n=>E.useWisdomFruit(n,2),'stopped preparation');const end=s.restUntil;E.settleRest(s,end);assert(!s.running);const battle=E.startRoutedEncounter(s,end+2000);assert(battle);assert(E.setMultiPaused(s,true,end+2000));assert(!safeRestPreparation(s));assert(!E.useWisdomFruit(s,1));
// Canonical ending stone use during actual defeat rest, then tower retry keeps its route.
s=reachStoryScene('human','END.H01.human',{finishTarget:true,level:100,spring:'skip'});s.running=false;assert(reconcileOtherworldStone(s)||s.otherworld.stoneGranted);now=Math.max(s.lastSeen,s.lastHealthClock??0,s.nextBattleAt??0)+2000;s.heroHp=E.stats(s).hp;assert(E.enterOtherworld(s,now));lose();unchanged(n=>useOtherworldStone(n),'stone');E.settleRest(s,s.restUntil);s.running=false;now=s.lastHealthClock+2000;lose();const towerDeadline=s.restUntil;s.consumables.memoryFruit=1;unchanged(n=>E.useWisdomFruit(n,1),'tower preparation');s=JSON.parse(raw);assert.equal(s.restUntil,towerDeadline);E.settleRest(s,towerDeadline);assert(s.running);const tower=E.startRoutedEncounter(s,towerDeadline+2000);assert(tower.otherworld);assert.equal(tower.otherworld.floor,1);
console.log('PASS defeat rest preparation: equip/builds/fruit/talents/refund/shop/reforge/craft/ending stone; quota/stale/reload, timer/HP/no early combat or travel, explicit stop, paused combat, original tower retry');
