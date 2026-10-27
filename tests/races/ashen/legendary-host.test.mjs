import assert from 'node:assert/strict';
import * as E from '../../../dist/engine.js';
import {RACE_PACK as P} from '../../../dist/races/ashen/index.js';
import {captureCombatDisplay} from '../../../dist/combat-display-bridge.js';
import {createPlayerShieldLayers,grantPlayerShieldLayer} from '../../../dist/player-shield-layers.js';
import {skillVisualForEvent,createBattleSlicePresentation} from '../../../dist/battle-slice.js';
const originalRandom=Math.random;let seed=Number(process.env.ASHEN_LEGEND_FIXTURE_SEED??73021);assert(Number.isInteger(seed)&&seed>=0&&seed<=0xffffffff);Math.random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/2**32);
export function fixture(id,skill=null){const s=E.fresh('ashen');s.level=100;s.skillTree.presets[0].unlocked=P.tree.nodes.map(x=>x.id);s.skillTree.presets[0].active=[skill,null,null,null];s.skillTree.presets[0].passive=[null,null];const it=E.legendaryItem(id,100);s.inventory.push(it);assert(E.equipItem(s,it.id));s.lastSeen=s.lastHealthClock=1000;E.normalizeHealth(s,1000);s.heroHp=E.stats(s).hp;s.restUntil=0;s.nextBattleAt=0;const e=E.startInstanceEncounter(s,'ashen.a01.field',1000);for(const u of e.enemies){u.hp=u.max=1e8;u.atk=u.elementalPower=0;u.armor=1e8;u.elementResistance.light=1e8;}return{s,e,it};}
export const tick=(s,e)=>{const random=Math.random;Math.random=()=>.5;try{return captureCombatDisplay(e,()=>E.step(s,e,s.nextActionAt)).events;}finally{Math.random=random;}};
try{
const h=fixture('ashen-molten-core','ashen.vent');h.e.raceRuntime={race:'ashen',state:{...P.createRuntime(),heat:40}};const base=E.baseStats(h.s).atk;tick(h.s,h.e);assert.equal(h.e.raceRuntime.state.heat,0);assert.equal(h.s.legendaryRuntime.byId[h.it.id].state.stacks,1);assert.equal(h.s.legendaryRuntime.byId[h.it.id].state.remainder,10);assert.equal(E.baseStats(h.s).atk,base*1.2);assert(E.validSave(h.s));
const c=fixture('ashen-crystal-core');let events=[];for(let i=0;i<27;i++)events.push(...tick(c.s,c.e));assert(!events.some(x=>x.skillId==='ashen-prism-beam'));
// A known persisted hit roll isolates mitigation bypass from ordinary hit/miss RNG.
c.e.rngState=1;events=tick(c.s,c.e);const beam=events.find(x=>x.skillId==='ashen-prism-beam'&&x.kind==='hit');assert(beam,'beam fires after30 combat sec');assert.equal(beam.outcome,'hit');assert(-beam.hpDelta>E.stats(c.s).atk*1.9,'bypasses huge armor/resistance');assert.equal(skillVisualForEvent(beam),'prismBeam');assert.equal(c.e.treeSkillCooldowns?.['ashen-prism-beam'],undefined);assert.deepEqual(c.s.skillTree.presets[0].active,[null,null,null,null]);assert(events.some(x=>x.skillId==='basic'),'basic attack remains available');assert(E.validSave(c.s));
const saved=JSON.parse(JSON.stringify(c.s));assert(E.validSave(saved));assert.deepEqual(tick(c.s,c.e).map(({eventId,...x})=>x),tick(saved,saved.activeEncounter).map(({eventId,...x})=>x));
const r=fixture('ashen-stone-core');r.e.heroHp=E.stats(r.s).hp/2;r.e.playerShieldLayers=createPlayerShieldLayers();r.e.playerShieldLayers=grantPlayerShieldLayer(r.e.playerShieldLayers,{source:'test-shield',capacity:1,durationMs:60000,clock:0,hp:r.e.heroHp}).state;for(const u of r.e.enemies){u.atk=u.elementalPower=100;}let healed=[];for(let i=0;i<8&&!healed.length;i++)healed=tick(r.s,r.e).filter(x=>x.kind==='heal'&&x.skillId==='ashen-stone-core');assert(healed.length);assert.equal(healed[0].hpDelta,E.stats(r.s).hp*.04);assert.equal(r.e.raceRuntime.state.shards,2);assert(E.validSave(r.s));
console.log('PASS real engine molten spend buff, crystal extra active 30s + bypass + distinct beam + basic retained, JSON parity, rock real shield-break heal/resources.');
// Equipment beam is a true active, not an uncounted passive proc.
{
 const x=fixture('ashen-crystal-core'),staff=E.legendaryItem('elf-sixfold-heartwood',100);x.s.inventory.push(staff);assert(E.equipItem(x.s,staff.id));
 const multi=E.item('gloves',100,null,2,{originRace:'ashen'});multi.special={id:'multicast'};x.s.inventory.push(multi);assert(E.equipItem(x.s,multi.id));
 for(let n=0;n<27;n++)tick(x.s,x.e);
 const row=x.s.legendaryRuntime.byId[staff.id];row.state={seenElements:['earth','water','fire','wind'],ready:true,pendingCastId:null,pendingTargetId:null,lastCastId:null};
 const before=x.e.activeCastCount,snapshot=structuredClone(x.s);let events;
 for(let seed=1;seed<10000;seed++){const candidate=structuredClone(snapshot);candidate.activeEncounter.rngState=seed;const batch=captureCombatDisplay(candidate.activeEncounter,()=>E.step(candidate,candidate.activeEncounter,candidate.nextActionAt)).events;const hits=batch.filter(v=>v.skillId==='ashen-prism-beam'&&v.kind==='hit');if(hits.length===2&&hits.every(v=>v.crit)){x.s=candidate;x.e=candidate.activeEncounter;events=batch;break;}}
 assert(events,'persisted RNG seed with two critical beam casts');
 const beams=events.filter(x=>x.skillId==='ashen-prism-beam'&&x.kind==='hit');assert.equal(beams.length,2,'original plus one multicast');assert(beams.every(x=>x.crit));assert(Math.abs((-beams[0].hpDelta)/(-beams[1].hpDelta)-2)<1e-6,'charged staff doubles only original cast; permanent light multiplier applies both');assert.equal(x.e.activeCastCount-before,2);assert.equal(x.s.legendaryRuntime.byId[x.it.id].state.readyAt,x.s.legendaryRuntime.byId[x.it.id].clock+30000);assert.equal(x.s.legendaryRuntime.byId[staff.id].state.ready,false);assert.deepEqual(x.s.legendaryRuntime.byId[staff.id].state.seenElements,['light']);assert(E.validSave(x.s));
 console.log('PASS beam consumes ready Elf staff as active, crits, multicasts once, +2 active casts, original-only cooldown, recharges light once.');
}
{
 const x=fixture('ashen-crystal-core');let ring;for(let n=0;n<200;n++){ring=E.item('ring',100,null,3,{originRace:'ashen'});if(!ring.special&&ring.affixes.some(a=>a.stat==='lifesteal'))break;}assert(ring.affixes.some(a=>a.stat==='lifesteal'));
 // Isolate lifesteal/cooldown from an unrelated random Reaper that can end the 30-second observation.
 // Standard Reaper eligibility is exercised explicitly in the next block.
 assert.equal(ring.special,null,'generated lifesteal ring has no unrelated special');x.s.inventory.push(ring);assert(E.equipItem(x.s,ring.id));
 for(let n=0;n<27;n++)tick(x.s,x.e);x.e.heroHp=E.stats(x.s).hp/2;x.s.heroHp=x.e.heroHp;
 const snapshot=structuredClone(x.s);let found=false;for(let seed=1;seed<100;seed++){const candidate=structuredClone(snapshot);candidate.activeEncounter.rngState=seed;const events=captureCombatDisplay(candidate.activeEncounter,()=>E.step(candidate,candidate.activeEncounter,candidate.nextActionAt)).events;const beam=events.find(v=>v.skillId==='ashen-prism-beam'&&v.kind==='hit'&&v.hpDelta<0);if(!beam)continue;const firstBeamIndex=events.indexOf(beam),nextCastIndex=events.findIndex((v,i)=>i>firstBeamIndex&&v.kind==='cast');assert(events.slice(firstBeamIndex,nextCastIndex<0?events.length:nextCastIndex).some(v=>v.kind==='heal'&&v.skillId==='lifesteal'&&v.hpDelta>0),'beam actual HP damage heals via standard lifesteal');found=true;break;}assert(found);
 const replacement=E.item('core',100,null,0,{originRace:'ashen'});x.s.inventory.push(replacement);assert(E.equipItem(x.s,replacement.id));assert(!x.s.legendaryRuntime.byId[x.it.id]);assert(E.equipItem(x.s,x.it.id));for(let n=0;n<27;n++)assert(!tick(x.s,x.e).some(v=>v.skillId==='ashen-prism-beam'));assert.equal(x.e.done,false,'cooldown measurement requires a still-running real encounter');assert.equal(x.s.legendaryRuntime.byId[x.it.id].clock,29700);
 console.log('PASS beam standard lifesteal from actual HP damage and full30second unequip/re-equip reset.');
}
{
 const {executeTreePlayerAction,withMultiRng}=await import('../../../dist/multi-combat.js'),{dispatchRacialLegendaryEvent,advanceRacialLegendaryClock}=await import('../../../dist/racial-legendary-runtime.js');
 const x=fixture('ashen-crystal-core');dispatchRacialLegendaryEvent(x.s,{type:'combatInit'});advanceRacialLegendaryClock(x.s,30000);
 const context={stats:g=>({...E.stats(g),hit:1,crit:0,specials:{reaper:true}}),resolveElementDamage:E.resolveElementDamage,now:1000,input:{skillId:'ashen-prism-beam',castId:'core-failed',weaponType:'armguard',config:{cooldownMs:30000}},effects:{apply:()=>true},onDamageAction:()=>{},onHeroDeath:()=>{}};
 const noTargets=structuredClone(x.s);noTargets.activeEncounter.enemies.forEach(u=>u.hp=0);const before=structuredClone(noTargets.legendaryRuntime);assert.equal(executeTreePlayerAction(noTargets,noTargets.activeEncounter,context),null);assert.deepEqual(noTargets.legendaryRuntime,before,'no living target does not consume item cooldown');
 const snapshot=structuredClone(x.s);let found=false;for(let seed=1;seed<200;seed++){const candidate=structuredClone(snapshot),enc=candidate.activeEncounter;enc.rngState=seed;const events=captureCombatDisplay(enc,()=>withMultiRng(enc,()=>executeTreePlayerAction(candidate,enc,context))).events;if(events.some(v=>v.skillId==='reaper')){found=true;break;}}assert(found,'real equipment beam eligible for standard Reaper');
 console.log('PASS failed beam with no living targets preserves cooldown; actual equipment active supports standard Reaper.');
}

}finally{Math.random=originalRandom;}
