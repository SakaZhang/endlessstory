import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
import {executeTreePlayerAction,withMultiRng} from './dist/multi-combat.js';
// Explicit consumer wiring fixture, NOT approved live skill tuning.
const config={genericCoefficient:1,axeCoefficients:[.6,.9],hammerCoefficient:1.2,cooldownMs:4400,armorBreak:{amount:7,durationMs:2200,timing:'after-hit'}};
function fixture(){const s=E.fresh();s.heroHp=E.stats(s).hp;s.lastHealthClock=s.lastSeen=10000;s.nextBattleAt=0;s.restUntil=0;const e=E.startDeveloperGroup(s,{count:2,seed:987},10000);for(const u of e.enemies){u.hp=u.max=10000;u.armor=0;}return {s,e};}
function run(s,e,extra={}){let actions=0;const buffs=[];const ctx={stats:g=>({...E.stats(g),hit:1,crit:0}),resolveElementDamage:E.resolveElementDamage,now:11100,input:{skillId:'fracture_strike',castId:e.id+':newtree:1',weaponType:'axe',config},effects:{apply:(id,ef)=>buffs.push([id,ef]),applyArmorBreak:ef=>{e.enemies.find(u=>u.id===ef.targetId).broken=2;}},onDamageAction:()=>actions++,onHeroDeath:()=>{},...extra};const result=withMultiRng(e,()=>executeTreePlayerAction(s,e,ctx));s.heroHp=e.heroHp;return {result,actions,buffs};}
{
 const {s,e}=fixture(),before=e.enemies[0].hp,st=E.stats(s);const r=run(s,e);assert(r.result?.original.cast);assert.equal(r.result.original.hits.length,2);assert.equal(before-e.enemies[0].hp,Math.round(st.atk*.6)+Math.round(st.atk*.9));assert.equal(e.enemies[1].hp,e.enemies[1].max);assert.equal(e.activeCastCount,1);assert.equal(r.actions,1);assert.equal(e.treeSkillCooldowns.fracture_strike,4);assert.equal(e.lastCast.recordVersion,2);assert(E.validSave(s));assert(E.validSave(JSON.parse(JSON.stringify(s))));
}
{
 const {s,e}=fixture();e.enemies[0].hp=1;const r=run(s,e);assert.equal(r.result.original.hits.length,1);assert.equal(e.enemies[0].hp,0);assert.equal(e.enemies[1].hp,e.enemies[1].max,'remaining axe segment never retargets');assert(!e.done);assert.equal(e.targetId,e.enemies[1].id);assert(E.validSave(s));
}
{
 const {s,e}=fixture();const stats=g=>({...E.stats(g),hit:1,crit:0,specials:{multicast:true}});let found;
 for(let seed=1;seed<100;seed++){const candidate=structuredClone(s),enc=candidate.activeEncounter;enc.rngState=seed;const r=run(candidate,enc,{stats});if(r.result.extra?.cast){found={candidate,enc,r};break;}}
 assert(found);assert.equal(found.enc.activeCastCount,2);assert.equal(found.r.actions,2);assert.equal(found.enc.treeSkillCooldowns.fracture_strike,4);assert.equal(found.enc.lastCast.hits.length,2);assert(E.validSave(found.candidate));
}
{
 const {s,e}=fixture();e.enemies.forEach(u=>u.profile.counterRatio=.5);const before=e.heroHp;const r=run(s,e);assert.equal(r.result.logs.filter(x=>x.includes('反伤')).length,1,'two segments do not cause two enemy counter procs');assert(e.heroHp<before);assert(E.validSave(s));
}
{
 const {s,e}=fixture();const old=JSON.stringify(s),r=run(s,e,{input:{skillId:'fracture_strike',castId:'bad',weaponType:'axe',config:{}}});assert.equal(r.result,null);assert.equal(JSON.stringify(s),old,'bad config cannot consume CD, RNG or mutate state');
}
console.log('PASS real multi host: same production physical/HP/shield helpers, two independent axe segments, death stop, retarget boundary, real multicast and once/cast counts, one counter, save/JSON, invalid config no mutation');
// Hit eligibility is separate from HP damage: shielded hits may execute, but cannot lifesteal.
{
 let found=false;
 for(let seed=1;seed<800&&!found;seed++){const {s,e}=fixture();e.rngState=seed;e.heroHp=Math.floor(E.stats(s).hp/2);s.heroHp=e.heroHp;e.enemies[0].shield=1e6;const hp=e.heroHp;
  const r=run(s,e,{stats:g=>({...E.stats(g),hit:1,crit:0,lifesteal:100,specials:{reaper:true}})});
  if(r.result.original.hits.some(h=>h.killProcHpLost>0)){found=true;assert.equal(r.result.original.hits[0].actualHpLost,0);assert.equal(e.heroHp,hp);assert.equal(e.lastCast.lifesteal,undefined);assert(r.result.original.hits.length<=2);assert(r.result.original.hits.at(-1).killProcHpLost>0);assert(E.validSave(s));}
 }
 assert(found,'bounded saved-RNG scan hits real 2% reaper under full shield');
}
console.log('PASS tree host: shield hit reaper works; shield/execute never inflate lifesteal');
// All-target shape resolves the actual HP of every living target, without multiplying counters.
{
 const {s,e}=fixture();while(e.enemies.length<5){const u=structuredClone(e.enemies[0]);u.id=e.id+'-fixture-summon-'+e.enemies.length;u.origin='summoned';u.main=false;u.control.unitId=u.id;e.enemies.push(u);}
 e.enemies.forEach(u=>u.profile.counterRatio=.1);
 const r=run(s,e,{input:{skillId:'fault_sweep',castId:e.id+':sweep',weaponType:'staff',config:{coefficient:1,cooldownMs:4400}}});
 assert.equal(r.result.original.hits.length,5);assert(e.enemies.every(u=>u.hp<u.max));assert.equal(r.result.logs.filter(x=>x.includes('反伤')).length,1);assert.equal(e.activeCastCount,1);assert.equal(r.actions,1);assert(E.validSave(s));
}
console.log('PASS tree host: actual all-target five-actor HP resolution, one cast/legend action/counter');
// Reflection must still come from a living enemy when the queued reaction resolves.
for(const life of ['first','second','alive']){
 const {s,e}=fixture(),atk=E.stats(s).atk;const u=e.enemies[0];u.profile.counterRatio=.5;
 u.hp=life==='first'?1:life==='second'?Math.round(atk*.6)+1:10000;
 const hp=e.heroHp,r=run(s,e),reflections=r.result.logs.filter(x=>x.includes('反伤'));
 assert.equal(reflections.length,life==='alive'?1:0,life);assert.equal(e.heroHp<hp,life==='alive');assert(E.validSave(s));
}
console.log('PASS tree host: no corpse counter after first/second-segment kill; living source still reacts once');
