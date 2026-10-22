import assert from 'node:assert/strict';
import {stepMulti,makeMultiUnit,syncMultiTarget} from './dist/multi-combat.js';
import {LIFESTEAL_CANDIDATE_CONFIG} from './dist/affix-expansion.js';
const clone=structuredClone;
function fixture(){const enemies=[0,1].map(i=>{const u=makeMultiUnit('u'+i,0,'field',{enemy:'测试敌',hp:1000,atk:0,armor:0},0);u.elementTags=[];u.elementResistance={fire:0};u.control.stunUntil=999999;return u;});const e={id:'battle',developmentFixture:true,enemies,targetId:'u0',round:0,cd:{},heroHp:50,shield:0,barrierShield:0,warcry:0,weakness:0,ironcoat:0,guard:0,heroBurn:0,heroBurnPower:0,activeCastCount:0,summonSerial:0,done:false};syncMultiTarget(e);const s={skills:[null,null,null,null],conditions:['always','always','always','always'],momentum:0};const st={hp:100,atk:10,armor:0,hit:1,crit:0,critDamage:2,count:{},specials:{},lifesteal:100,penetration:0,block:0,resolveReduction:0,shieldBonus:0,elementAttack:{fire:0},elementResistance:{fire:0}};const ctx={stats:()=>st,SKILLS:{},skillUnlocked:()=>true,resolveElementDamage:x=>x,now:1100,makeSummon:()=>{throw Error('unexpected summon')},lifestealConfig:{...LIFESTEAL_CANDIDATE_CONFIG,enabled:true}};return{s,e,st,ctx};}
function run(f,rolls=[.5]){let draws=0;const old=Math.random;Math.random=()=>rolls[Math.min(draws++,rolls.length-1)];try{const logs=stepMulti(f.s,f.e,{},f.ctx);return{logs,draws};}finally{Math.random=old;}}
{
 const f=fixture();f.st.specials.reaper=true;f.e.fixtureAction={scope:'all',kind:'damage',amount:10};run(f,[0,.9,.01,0,.9,.5]);assert.equal(f.e.enemies[0].hp,0);assert.equal(f.e.enemies[1].hp,990);assert.equal(f.e.lastCast.hits.length,2);assert.equal(f.e.lastCast.hits[0].hitIndex,0);assert.equal(f.e.lastCast.hits[0].actualHpLost,10);assert.equal(f.e.lastCast.hits[0].killProcHpLost,990);assert.equal(f.e.lastCast.hits[1].targetId,'u1');assert.equal(f.e.lastCast.lifesteal,1.2);assert.equal(f.e.activeCastCount,1);assert(!f.e.done);assert.equal(f.e.targetId,'u1');
}
{
 const f=fixture();f.st.specials.reaper=true;f.e.fixtureAction={scope:'all',kind:'damage',amount:1e6};const r=run(f,[0,.9]);assert.equal(r.draws,4,'already dead targets never roll reaper');assert(f.e.win);assert.equal(f.e.lastCast.lifesteal,8,'actual total damage capped once per cast');
}
{
 const f=fixture();f.e.enemies[0].shield=1000;f.st.specials.reaper=true;run(f,[0,.9,.01]);assert.equal(f.e.lastCast.hits[0].actualHpLost,0);assert.equal(f.e.lastCast.hits[0].killProcHpLost,1000);assert.equal(f.e.heroHp,50,'execute is not lifesteal damage');assert(!f.e.lastCast.lifesteal);
}
{
 const f=fixture();f.e.heroHp=1;f.e.heroBurn=1;f.e.heroBurnPower=1000;f.st.specials.nirvana=true;f.e.cd.test=7;f.e.shield=33;f.e.barrierShield=22;run(f);assert.equal(f.e.heroHp,100);assert(f.e.affixState.nirvanaUsed);assert.equal(f.e.cd.test,6);assert.equal(f.e.shield,33);assert.equal(f.e.barrierShield,22);const resumed={s:clone(f.s),e:clone(f.e),st:f.st,ctx:f.ctx};resumed.e.heroBurn=1;resumed.e.heroBurnPower=1000;run(resumed);assert(resumed.e.done&&!resumed.e.win);assert(resumed.e.affixState.nirvanaUsed);
}
{
 const f=fixture();f.st.specials.nirvana=true;f.st.lifesteal=0;f.e.heroHp=1;f.e.enemies.forEach(u=>{u.control.stunUntil=0;u.atk=1e6;});const r=run(f);assert.equal(r.logs.filter(x=>x.includes('涅槃')).length,1);assert(f.e.done&&!f.e.win,'second lethal source in same turn cannot revive again');
}
{
 const f=fixture();f.st.specials.shelter=true;f.st.lifesteal=0;f.e.heroHp=20;f.e.enemies[0].control.stunUntil=0;f.e.enemies[0].atk=5;run(f);assert.equal(f.e.shield,0,'no obsolete low-health shield trigger');assert.equal(f.e.heroHp,15);
}
{
 const f=fixture();f.e.heroHp=1;f.e.enemies[0].profile.counterRatio=1;f.e.fixtureAction={scope:'single',kind:'damage',amount:10};run(f);assert(f.e.done&&!f.e.win);assert(!f.e.lastCast.lifesteal,'dead player cannot lifesteal revive');
}
{
 const f=fixture();f.st.hit=0;f.st.specials.reaper=true;const r=run(f);assert.equal(r.draws,1);assert.equal(f.e.enemies[0].hp,1000);assert.equal(f.e.lastCast.hits[0].actualHpLost,0);
}
console.log('PASS multi actual pipeline: per-target hit metadata/reaper independent rolls, execute excluded from lifesteal, per-cast cap, full-shield behavior, nirvana all lethal sources/once/save preservation, removed low-health shelter.');
{
 const f=fixture();f.s.skills=['break',null,null,null];f.ctx.SKILLS.break={cd:5,name:'裂甲锤'};f.st.specials.multicast=true;f.e.enemies[0].hp=1;const r=run(f,[0,.9,0,0,.9]);assert.equal(f.e.enemies[0].hp,0);assert(f.e.enemies[1].hp<1000);assert.equal(f.e.lastCast.hits[0].targetId,'u1');assert.equal(f.e.cd.break,5);assert.equal(f.e.activeCastCount,2);assert(f.e.lastCast.id.endsWith(':extra'));assert.equal(r.draws,5,'one multicast roll and two casts only');
}
{
 const f=fixture();f.s.skills=['warcry',null,null,null];f.ctx.SKILLS.warcry={cd:5,name:'战吼'};f.st.specials.multicast=true;const r=run(f,[0]);assert.equal(f.e.activeCastCount,2);assert.equal(f.e.warcry,3,'same-source buff refreshed not additive');assert.equal(f.e.cd.warcry,5);assert.equal(r.draws,1,'utility multicast does not recurse');
}
{
 const f=fixture();f.s.skills=['break',null,null,null];f.ctx.SKILLS.break={cd:5,name:'裂甲锤'};f.st.specials.multicast=true;f.e.enemies[0].hp=1;f.e.enemies[1].hp=0;const r=run(f,[0,.9]);assert(f.e.win);assert.equal(f.e.activeCastCount,1);assert.equal(r.draws,2,'all-clear prevents extra proc roll or cast count');
}
{
 const f=fixture();f.s.skills=['break',null,null,null];f.ctx.SKILLS.break={cd:5,name:'裂甲锤'};f.st.specials.multicast=true;f.st.atk=10000;f.e.enemies.forEach(u=>u.hp=u.max=1e6);f.e.heroHp=1;run(f,[0,.9,0,0,.9]);assert.equal(f.e.activeCastCount,2);assert.equal(f.e.heroHp,17,'two distinct casts each have separate8HP lifesteal cap');
}
console.log('PASS multicast actual pipeline: target replacement, preserved cooldown, two cast counts, utility refresh, no recursion, no post-clear roll, separate lifesteal caps.');

{const f=fixture();f.st.specials.nirvana=true;f.st.lifesteal=0;f.e.guard=2;f.e.heroHp=1;f.e.enemies[1].hp=0;f.e.enemies[0].control.stunUntil=0;f.e.enemies[0].atk=20;const r=run(f,[.5]);assert(f.e.affixState.nirvanaUsed);assert(r.logs.some(x=>x.includes('坚守反击')),'revival resolves before preserved guard reaction just like single combat');assert(f.e.heroHp>0);}
