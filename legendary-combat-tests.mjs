import assert from 'node:assert/strict';
import {advanceLegendaryCombat} from './dist/legendary-combat.js';
import {stepMulti,makeMultiUnit,syncMultiTarget} from './dist/multi-combat.js';
import {LIFESTEAL_CANDIDATE_CONFIG} from './dist/affix-expansion.js';
const s={equip:{weapon:'hammer',amulet:'reactor'},inventory:[{id:'hammer',legendaryId:'first-forge-oathhammer'},{id:'reactor',legendaryId:'everburning-reactor'}]};let procs=[];const resolve=p=>{procs.push(p);return {};};
for(let i=0;i<5;i++)advanceLegendaryCombat(s,{damageAction:true,resolve});assert.equal(procs.length,1);assert.equal(procs[0].kind,'hammer');
advanceLegendaryCombat(s,{combatDeltaMs:11999,resolve});assert.equal(procs.length,1);advanceLegendaryCombat(s,{combatDeltaMs:1,resolve});assert.equal(procs[1].kind,'reactor');assert.equal(s.equipmentRuntime.byId.reactor.combatMs,0);
const saved=JSON.parse(JSON.stringify(s));advanceLegendaryCombat(saved,{combatDeltaMs:5000,alive:false,resolve});assert.deepEqual(saved,s);
function fixture(){const enemies=[0,1].map(i=>{const u=makeMultiUnit('u'+i,0,'field',{enemy:'enemy',hp:1000,atk:0,armor:100},0);u.elementTags=[];u.elementResistance={fire:0};u.control.stunUntil=999999;return u;});const e={id:'battle',developmentFixture:true,enemies,targetId:'u0',round:0,cd:{},heroHp:50,shield:15,barrierShield:20,barrier:3,warcry:0,weakness:0,ironcoat:0,guard:0,heroBurn:0,heroBurnPower:0,activeCastCount:0,summonSerial:0,done:false};syncMultiTarget(e);const state={...structuredClone(s),skills:[null,null,null,null],conditions:['always','always','always','always'],momentum:0};state.equipmentRuntime.byId.hammer.attackCount=4;state.equipmentRuntime.byId.reactor.combatMs=11000;const st={hp:100,atk:100,armor:0,hit:1,crit:0,critDamage:2,count:{},specials:{reaper:true,multicast:true},lifesteal:100,penetration:0,block:0,resolveReduction:0,shieldBonus:0,elementAttack:{fire:0},elementResistance:{fire:0}};return {state,e,st,ctx:{stats:()=>st,SKILLS:{},skillUnlocked:()=>true,resolveElementDamage:x=>x,now:1100,combatDeltaMs:1100,makeSummon:()=>{throw Error('summon')},lifestealConfig:{...LIFESTEAL_CANDIDATE_CONFIG,enabled:true}}};}
const old=Math.random;Math.random=()=>.5;try{
 const f=fixture();const logs=stepMulti(f.state,f.e,{},f.ctx);assert(logs.some(x=>x.includes('祖王回响')));assert.equal(logs.filter(x=>x.includes('余热循环')).length,2);assert.equal(f.e.enemies[1].hp,925,'reactor resolves all alive once');assert.equal(f.e.activeCastCount,0,'legendary proc does not count as active or multicast');assert.equal(f.state.equipmentRuntime.byId.hammer.attackCount,0);assert.equal(f.e.legendaryShield,8);assert.equal(f.e.shield,15);assert.equal(f.e.barrierShield,20);assert(f.e.heroHp>50);
 const resumed=JSON.parse(JSON.stringify(f));resumed.ctx=f.ctx;stepMulti(resumed.state,resumed.e,{},resumed.ctx);assert.equal(resumed.state.equipmentRuntime.byId.hammer.attackCount,1);assert.equal(resumed.e.playerShieldLayers.clock,2200);
 const aoe=fixture();aoe.e.fixtureAction={scope:'all',kind:'damage',amount:1};stepMulti(aoe.state,aoe.e,{},aoe.ctx);assert.equal(aoe.state.equipmentRuntime.byId.hammer.attackCount,0,'AOE is one outgoing action');
 const dead=fixture();dead.e.heroHp=0;stepMulti(dead.state,dead.e,{},dead.ctx);assert.equal(dead.e.heroHp,0);assert.equal(dead.state.equipmentRuntime.byId.reactor.combatMs,11000);
 const shield=fixture();shield.state.equipmentRuntime.byId.hammer.attackCount=0;shield.e.enemies[0].control.stunUntil=0;shield.e.enemies[0].atk=5;stepMulti(shield.state,shield.e,{},shield.ctx);assert.equal(shield.e.barrierShield,15,'barrier expires earlier than newly granted reactor');assert.equal(shield.e.legendaryShield,8);assert.equal(shield.e.shield,15);
}finally{Math.random=old;}
console.log('PASS legendary counters + actual multi adapter: fifth outgoing hit, timed all-target fire, independent shields, earliest expiry absorption, serialization, AoE once, no proc recursion/reaper, actual lifesteal, dead-player safety.');
{
 const f=fixture();f.state.equipmentRuntime.byId.reactor.combatMs=0;f.state.equipmentRuntime.byId.hammer.attackCount=3;f.state.skills=['break',null,null,null];f.ctx.SKILLS.break={name:'裂甲锤',cd:5};f.st.specials.reaper=false;
 let n=0;const prior=Math.random;Math.random=()=>[0,.9,0,0,.9,.9][Math.min(n++,5)];try{const logs=stepMulti(f.state,f.e,{},f.ctx);assert.equal(f.e.activeCastCount,2);assert.equal(f.state.equipmentRuntime.byId.hammer.attackCount,0);assert.equal(logs.filter(x=>x.includes('祖王回响')).length,1);assert.equal(f.e.cd.break,5);}finally{Math.random=prior;}
}
{
 const f=fixture();f.e.enemies.forEach(u=>u.hp=1);f.st.crit=1;let draws=0;const prior=Math.random;Math.random=()=>{draws++;return 0;};try{const logs=stepMulti(f.state,f.e,{},f.ctx);assert(f.e.done&&f.e.win);assert.equal(draws,2,'each reactor target crit only: no reaper/multicast/ordinary action');assert.equal(f.e.activeCastCount,0);assert.equal(f.e.legendaryShield,8,'living hero keeps the shield bound to a clearing pulse');assert.equal(f.state.equipmentRuntime.byId.hammer.attackCount,4);assert.equal(logs.filter(x=>x.includes('余热循环')).length,2);}finally{Math.random=prior;}
}
{
 const copy=structuredClone(s);copy.equipmentRuntime.byId.hammer.attackCount=4;let proc=0;advanceLegendaryCombat(copy,{damageAction:true,hasTargets:false,resolve:()=>proc++});assert.equal(proc,0);assert.equal(copy.equipmentRuntime.byId.hammer.attackCount,0,'real killing action counts, no delayed proc after clear');
}
console.log('PASS multicast true extra outgoing action, reactor crit without extra effect draws, final-clear shield but no extra action, killing-action counter boundary.');
// Prototype-like owned IDs must receive own numeric runtime records, not built-ins.
{const s={equip:{weapon:'constructor'},inventory:[{id:'constructor',legendaryId:'first-forge-oathhammer'}]};advanceLegendaryCombat(s,{damageAction:true,resolve:()=>null});assert(Object.hasOwn(s.equipmentRuntime.byId,'constructor'));assert.equal(s.equipmentRuntime.byId.constructor.attackCount,1);}
{const f=fixture(),old=Math.random;Math.random=()=>.5;try{f.st.shieldBonus=20;stepMulti(f.state,f.e,{},f.ctx);assert.equal(f.e.legendaryShield,28);f.state.equipmentRuntime.byId.reactor.combatMs=11900;stepMulti(f.state,f.e,{},f.ctx);assert.equal(f.e.legendaryShield,28,'refresh uses 8% + one bonus, not old remainder');assert.equal(f.e.playerShieldLayers.layers.filter(l=>l.source==='reactor:reactor').length,1);}finally{Math.random=old;}}
// Tree timed damage can finish an encounter before the equipment pulse phase.
// Elapsed combat time is still earned; no proc is spent on corpses or during travel.
{
 const state={equip:{amulet:'r'},inventory:[{id:'r',legendaryId:'everburning-reactor'}],equipmentRuntime:{version:1,byId:{r:{combatMs:11500,attackCount:0,castCount:0}}}};
 let count=0;const resolve=()=>{count++;return {};};
 advanceLegendaryCombat(state,{combatDeltaMs:1100,hasTargets:false,deferProcs:true,resolve});
 assert.equal(count,0);assert.equal(state.equipmentRuntime.byId.r.combatMs,12600);
 const resumed=JSON.parse(JSON.stringify(state));
 advanceLegendaryCombat(resumed,{combatDeltaMs:0,hasTargets:false,resolve});
 assert.equal(count,0);assert.equal(resumed.equipmentRuntime.byId.r.combatMs,12600);
 advanceLegendaryCombat(resumed,{combatDeltaMs:1100,hasTargets:true,resolve});
 assert.equal(count,1);assert.equal(resumed.equipmentRuntime.byId.r.combatMs,1700);
 const dead=JSON.parse(JSON.stringify(state));advanceLegendaryCombat(dead,{combatDeltaMs:1100,alive:false,hasTargets:false,deferProcs:true,resolve});assert.deepEqual(dead,state);
}
console.log('PASS timer-clear charge conservation, no corpse pulse/travel advancement, JSON next-target release once.');
