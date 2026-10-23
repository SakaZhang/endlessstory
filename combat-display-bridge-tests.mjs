import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
import {captureCombatDisplay,setCombatDisplayObserver} from './dist/combat-display-bridge.js';
import {validDisplayEvent,createCombatDisplayQueue} from './dist/combat-display-queue.js';
const s=E.fresh();s.level=100;s.skillTree.presets[0].unlocked=E.SKILL_TREE_DEFINITION.nodes.map(n=>n.id);s.skillTree.presets[0].active=['cinder_barrage','ember_brand',null,null];s.heroHp=E.stats(s).hp;s.lastSeen=s.lastHealthClock=10000;s.nextBattleAt=0;s.restUntil=0;const e=E.startRoutedEncounter(s,10000);assert(e);for(const u of e.enemies){u.hp=u.max=100000;u.atk=0;u.shield=20;}e.rngState=1;
const plain=structuredClone(s),all=[];for(let i=0;i<15&&!e.done;i++){const now=s.nextActionAt,result=captureCombatDisplay(e,()=>E.step(s,e,now));assert.deepEqual(result.result,E.step(plain,plain.activeEncounter,now));assert.deepEqual(s,plain,'display observation must not change any gameplay or RNG state');all.push(...result.events);}
assert(all.length>10);for(const event of all)assert(validDisplayEvent(event),JSON.stringify(event));assert.equal(new Set(all.map(x=>x.eventId)).size,all.length);assert(all.some(x=>x.kind==='cast'));assert(all.some(x=>x.kind==='hit'&&x.skillId==='cinder_barrage'&&x.segmentIndex===1));assert(all.some(x=>x.shieldDelta<0));assert(all.some(x=>x.kind==='dot'));assert(all.some(x=>x.element==='fire'));assert.equal(JSON.stringify(s).includes('display-event'),false);
const queue=createCombatDisplayQueue();queue.beginBattle(e.id);assert(queue.emitBatch(all).ok);assert.equal(queue.consume().length,all.length);assert.equal(queue.consume().length,0);assert.equal(queue.emitBatch(all).accepted,0);
const throwing=structuredClone(s),control=structuredClone(s);const detach=setCombatDisplayObserver(throwing.activeEncounter,()=>{throw Error('display unavailable');});E.step(throwing,throwing.activeEncounter,throwing.nextActionAt);E.step(control,control.activeEncounter,control.nextActionAt);detach();assert.deepEqual(throwing,control);
console.log('PASS actual multi emitter: per-segment fire/crit/miss/HP/shield/DOT events, unique append-only captures, queue once, no saved events, enabled/disabled full state+RNG equality and throwing observer isolation');
const {executeTreePlayerAction,withMultiRng}=await import('./dist/multi-combat.js');
let gotExtra=false;
for(let seed=1;seed<100&&!gotExtra;seed++){
 const game=E.fresh();game.heroHp=E.stats(game).hp;game.lastHealthClock=game.lastSeen=10000;game.restUntil=0;game.nextBattleAt=0;const fight=E.startDeveloperGroup(game,{count:2,seed},10000);for(const u of fight.enemies){u.hp=u.max=100000;u.armor=0;}fight.rngState=seed;
 const base=structuredClone(game),config={genericCoefficient:1,axeCoefficients:[.6,.9],hammerCoefficient:1.2,cooldownMs:4400,armorBreak:{amount:7,durationMs:2200,timing:'after-hit'}};
 const context={stats:g=>({...E.stats(g),hit:1,crit:1,lifesteal:0,specials:{multicast:true}}),resolveElementDamage:E.resolveElementDamage,now:11100,input:{skillId:'fracture_strike',castId:fight.id+':fixture',weaponType:'axe',config},effects:{apply(){},applyArmorBreak(){}},onDamageAction(){},onHeroDeath(){}};
 const emitted=captureCombatDisplay(fight,()=>withMultiRng(fight,()=>executeTreePlayerAction(game,fight,context)));
 withMultiRng(base.activeEncounter,()=>executeTreePlayerAction(base,base.activeEncounter,context));assert.deepEqual(game,base);
 if(emitted.result.extra){gotExtra=true;const casts=emitted.events.filter(x=>x.kind==='cast'),hits=emitted.events.filter(x=>x.kind==='hit');assert.equal(casts.length,2);assert.equal(hits.length,4);assert.equal(new Set(casts.map(x=>x.castId)).size,2);assert(hits.every(x=>x.crit));assert.deepEqual(hits.map(x=>x.segmentIndex),[0,1,0,1]);assert(emitted.events.every(validDisplayEvent));}
}
assert(gotExtra,'forced seeded multicast fixture must exercise both real casts');
console.log('PASS actual axe multicast: two casts/four independent crit segments retained, original/extra cast IDs separate, observer-disabled state and RNG identical');

// Finite branch fixtures use the real step/reaction pipeline, never a display-only simulation.
const {createSkillPoison,applySkillPoison}=await import('./dist/skill-tree-poison.js');
const {createTreeEffectHost}=await import('./dist/skill-tree-effect-host.js');
function branchFixture(){const game=E.fresh();game.level=100;game.heroHp=E.stats(game).hp;game.lastHealthClock=game.lastSeen=10000;game.restUntil=0;game.nextBattleAt=0;const fight=E.startDeveloperGroup(game,{count:2,seed:11},10000);fight.skillResolver='tree-v1';for(const u of fight.enemies){u.hp=u.max=100000;u.atk=10;u.armor=0;u.nextHeavy=100;}return {game,fight};}
function observedStep(game){const before=structuredClone(game),fight=game.activeEncounter,now=game.nextActionAt;const out=captureCombatDisplay(fight,()=>E.step(game,fight,now));assert.deepEqual(out.result,E.step(before,before.activeEncounter,now));assert.deepEqual(game,before,'each branch preserves entire state and RNG');assert(out.events.every(validDisplayEvent));return out.events;}
{
 const {game,fight}=branchFixture();const events=observedStep(game);
 for(const u of fight.enemies){const cast=events.find(x=>x.kind==='cast'&&x.sourceId===u.id),hit=events.find(x=>x.kind==='hit'&&x.sourceId===u.id);assert(cast&&hit);assert.equal(hit.castId,cast.castId);assert.equal(hit.targetId,'hero');assert.equal(hit.crit,false);assert(hit.hpDelta<0);}
 assert.equal(new Set(events.filter(x=>x.kind==='cast'&&x.sourceId!=='hero').map(x=>x.castId)).size,2);
}
{
 const {game,fight}=branchFixture(),u=fight.enemies[1];
 fight.treePoison={[u.id]:applySkillPoison(createSkillPoison(u.id,{tickIntervalMs:1000,layerDurationMs:3000,maxLayers:5,refreshPolicy:'earliest-expiry',schedule:'per-layer',expiryTick:'inclusive'},0),{enemyId:u.id,sourceId:'scatter_ash',combatClock:0})};
 const events=observedStep(game),p=events.filter(x=>x.kind==='poison');assert.equal(p.length,1);assert.equal(p[0].targetId,u.id);assert.equal(p[0].hpDelta,-2000);assert.equal(p[0].crit,false);assert.equal(p[0].element,null);assert.equal(p[0].skillId,'scatter_ash');
}
{
 const {game,fight}=branchFixture();game.heroHp=fight.heroHp=E.stats(game).hp-100;
 const host=createTreeEffectHost(game,fight,{stats:E.stats(game),combatClock:0,tickIntervalMs:1000});assert(host.applyEffect('self',{sourceId:'forge_breath',type:'healOverTime',amount:7,durationMs:3000}));
 const events=observedStep(game),hot=events.filter(x=>x.kind==='heal'&&x.skillId==='forge_breath');assert.equal(hot.length,1);assert.equal(hot[0].hpDelta,7);assert.equal(hot[0].crit,false);assert.equal(hot[0].sourceId,'hero');assert.equal(hot[0].targetId,'hero');assert.equal(hot[0].combatAt,1000);
}
{
 const {game,fight}=branchFixture();fight.enemies[0].profile.counterRatio=.5;const events=observedStep(game),counter=events.find(x=>x.kind==='counter');assert(counter);assert.equal(counter.sourceId,fight.enemies[0].id);assert.equal(counter.targetId,'hero');assert(counter.hpDelta<0);assert.equal(counter.crit,false);
}
{
 const {game,fight}=branchFixture();const reactor=E.legendaryItem('everburning-reactor',10);game.inventory.push(reactor);game.equip.amulet=reactor.id;game.equipmentRuntime={version:1,byId:{[reactor.id]:{combatMs:11000,attackCount:0,castCount:0}}};
 const hpBefore=Object.fromEntries(fight.enemies.map(u=>[u.id,u.hp]));const events=observedStep(game),pulse=events.filter(x=>x.kind==='legend');assert.equal(pulse.length,2);assert.deepEqual(new Set(pulse.map(x=>x.targetId)),new Set(fight.enemies.map(u=>u.id)));assert(pulse.every(x=>x.sourceId===reactor.id&&x.skillId==='reactor'&&x.element==='fire'&&x.hpDelta<0));for(const u of fight.enemies){const damage=events.filter(x=>x.targetId===u.id).reduce((n,x)=>n-x.hpDelta,0);assert.equal(hpBefore[u.id]-u.hp,damage);}
 assert(events.some(x=>x.kind==='shield'&&x.sourceId===reactor.id&&x.shieldDelta>0));
}
console.log('PASS finite actual-step branches: two enemies bind cast/hit IDs; poison exact 2% noncrit/non-element; HOT actual tick; enemy counter; reactor all-target pulse+shield; each observer on/off full-state and RNG identical');
{
 let found=false;
 for(let seed=1;seed<800&&!found;seed++){
  const {game,fight}=branchFixture();fight.rngState=seed;fight.enemies[0].shield=1e6;game.heroHp=fight.heroHp=Math.floor(E.stats(game).hp/2);
  const plain=structuredClone(game),ctx={stats:g=>({...E.stats(g),hit:1,crit:0,lifesteal:100,specials:{reaper:true}}),resolveElementDamage:E.resolveElementDamage,now:11100,input:{skillId:'fracture_strike',castId:fight.id+':execute-fixture',weaponType:'axe',config:{genericCoefficient:1,axeCoefficients:[.6,.9],hammerCoefficient:1.2,cooldownMs:4400,armorBreak:{amount:7,durationMs:2200,timing:'after-hit'}}},effects:{apply(){},applyArmorBreak(){}},onDamageAction(){},onHeroDeath(){}};
  const out=captureCombatDisplay(fight,()=>withMultiRng(fight,()=>executeTreePlayerAction(game,fight,ctx)));withMultiRng(plain.activeEncounter,()=>executeTreePlayerAction(plain,plain.activeEncounter,ctx));assert.deepEqual(game,plain);
  const execute=out.events.find(x=>x.skillId==='reaper');if(execute){found=true;assert.equal(execute.hpDelta,-100000);assert.equal(execute.shieldDelta,0);assert.equal(execute.element,null);assert.equal(execute.crit,false);const direct=out.events.filter(x=>x.kind==='hit'&&x.skillId==='fracture_strike');assert(direct.length>0);assert(direct.every(x=>x.hpDelta===0&&x.shieldDelta<0));assert(out.events.every(validDisplayEvent));assert(!out.events.some(x=>x.kind==='heal'));}
 }
 assert(found);
}
console.log('PASS execute remains separate from shielded direct-hit events; no false lifesteal, no crit/element on execute, enabled/disabled state and RNG identical');
