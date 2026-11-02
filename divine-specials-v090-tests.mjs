import assert from 'node:assert/strict';
import {reachStoryScene} from './story-event-test-fixture.mjs';
import {applyStoryEvent} from './dist/story-event-controller.js';
import {STORY_SCENES} from './dist/story-event-registry.js';
import * as E from './dist/engine.js';
import {createBattleAffixState,validBattleAffixState,tryNirvana,tryReaperHit,tryMulticast,openingShelterShield,beginMomentumAction,momentumHitMultiplier,validDungeonAffixUsage} from './dist/affix-expansion.js';
import {specialDivineMultiplier,specialEffectPower,specialEffectDescription,nirvanaUseCount} from './dist/special-divine.js';
import {stepMulti,makeMultiUnit,syncMultiTarget} from './dist/multi-combat.js';
import {recordGrowthKills} from './dist/special-affix-growth.js';
import {currentAffix} from './current-equipment-test-fixture.mjs';
const clone=structuredClone;
function fresh(){const s=E.fresh();s.level=100;s.gold=1e5;s.lastSeen=s.lastHealthClock=10000;s.heroHp=E.stats(s).hp;s.restUntil=0;s.nextBattleAt=0;s.skills=[null,null,null,null];s.skillTree.presets[0].active=[null,null,null,null];s.skillTree.presets[0].passive=[null,null];return s;}
function gear(s,id,divine=true,socket='ring1'){const it=E.item('ring',1,null,3);it.special={id};it.affixes=[currentAffix('atk',3),currentAffix('armor',2),currentAffix('hp',15),currentAffix('hit',5)];if(divine)assert(E.applyForgeFavor(it));s.inventory.push(it);assert(E.equipItem(s,it.id,socket));s.heroHp=E.stats(s).hp;return it;}
function start(s,node='dwarf.a01.field'){const e=E.startInstanceEncounter(s,node,Math.max(s.nextBattleAt,s.lastHealthClock));assert(e);for(const u of e.enemies){u.hp=u.max=100000;u.armor=0;u.atk=0;u.shield=0;u.control.stunUntil=1e12;}return e;}
function step(s,seed=1){s.activeEncounter.rngState=seed;return E.step(s,s.activeEncounter,s.nextActionAt);}
function finish(s){const e=s.activeEncounter;for(const u of e.enemies)u.hp=1;for(let i=0;!e.done&&i<10;i++)step(s);assert(e.win);E.reward(s,e,s.lastHealthClock);assert(e.rewarded);return e;}
for(const key of E.ACTIVE_SPECIAL_KEYS){const s=fresh(),it=gear(s,key),plain=gear(s,key,false,'ring2');assert.equal(specialEffectPower(E.stats(s).specials,key),2);assert(specialEffectDescription(it,E.SPECIALS[key].desc)!==E.SPECIALS[key].desc);E.applyForgeFavor(plain);assert.equal(specialEffectPower(E.stats(s).specials,key),2);assert(E.validSave(s));assert.equal(specialDivineMultiplier({...it,divine:{...it.divine,model:'raw-v1'}}),2);}
assert.equal(openingShelterShield({hasShelter:true,maxHp:1000,power:2}),600);assert.equal(openingShelterShield({hasShelter:true,maxHp:1000,power:1}),300);assert.equal(openingShelterShield({hasShelter:true,maxHp:1000,power:2,alreadyApplied:true}),0);
for(const [roll,yes]of [[.019999,true],[.02,false]]){const s=createBattleAffixState('b'),args={battleId:'b',castId:'c',hitIndex:0,targetId:'u',hit:true,targetHp:100,hasReaper:true,power:2},out=tryReaperHit(s,args,()=>roll);assert.equal(out.triggered,yes);assert.equal(tryReaperHit(out.state,args,()=>0).triggered,false);}
for(const [roll,yes]of [[.29999,true],[.3,false]])assert.equal(tryMulticast({source:'active',triggered:false,hasLivingEnemies:true,power:2},{},()=>roll).triggered,yes);
assert.equal(tryMulticast({source:'active',triggered:true,hasLivingEnemies:true,power:2},{},()=>0).triggered,false);
assert.equal(momentumHitMultiplier(beginMomentumAction({momentum:1},{equipped:true,power:2})),3);
// Ledger survives round trips and equipment power changes, without replenishing spent uses.
let state=createBattleAffixState('b');for(let n=0;n<3;n++){const out=tryNirvana(state,{battleId:'b',hasNirvana:true,hp:0,maxHp:100,power:2});assert.equal(out.revived,n<2);state=JSON.parse(JSON.stringify(out.state));assert(validBattleAffixState(state));}assert.equal(state.nirvanaCount,2);
assert(!tryNirvana(state,{battleId:'b',hasNirvana:true,hp:0,maxHp:100,power:1}).revived);assert(!tryNirvana(state,{battleId:'b',hasNirvana:true,hp:0,maxHp:100,power:2}).revived);
assert.equal(tryNirvana({...createBattleAffixState('b'),nirvanaUsed:true},{battleId:'b',hasNirvana:true,hp:0,maxHp:100,power:2}).state.nirvanaCount,2);
for(const count of [-1,3,.5])assert(!validBattleAffixState({...state,nirvanaCount:count}));assert(!validDungeonAffixUsage({shelterUsed:true,nirvanaUsed:false,nirvanaCount:1}));
for(const [id,kills,max,stat,divisor]of [['harvester',123,400,'atk',1],['blesser',123,200,'luck',10],['glutton',123,200,'lifesteal',1]]){const s=fresh(),it=gear(s,id);it.special.growthKills=kills;const before=clone(it.special);assert.equal(E.specialAffixProgress(it).value,2*kills/divisor);assert.equal(E.specialAffixProgress(it).maxValue,2*max/divisor);assert.deepEqual(it.special,before);const e={enemies:[{id:'u',hp:0}]};assert.equal(recordGrowthKills(s,e,['u']),1);assert.equal(it.special.growthKills,kills+1);assert.equal(recordGrowthKills(s,e,['u']),0);assert(E.validSave(s));}
// Actual production shelter, knowledge, momentum and revival/dungeon scope.
{const s=fresh();gear(s,'shelter');const e=start(s);assert.equal(e.shield,Math.floor(E.stats(s).hp*.6)+E.stats(s).shieldBonus);}
{const s=fresh();s.level=50;gear(s,'knowledge');const e=start(s);for(const u of e.enemies)u.hp=1;for(let i=0;!e.done&&i<10;i++)step(s);const base=e.rewardXp*(e.fieldGroup?2:1);for(const seed of [1,999,0xffffffff]){const t=clone(s);const battle=t.activeEncounter;battle.rngState=seed;E.reward(t,battle,t.lastHealthClock);assert.equal(battle.acceptedXp,base*2);}}
{const s=fresh();gear(s,'momentum');start(s);s.momentum=1;const plain=clone(s);plain.momentum=0;step(s);step(plain);assert(Math.abs(s.activeEncounter.lastCast.hits[0].actualHpLost-3*plain.activeEncounter.lastCast.hits[0].actualHpLost)<=1);}
{let s=fresh();const it=gear(s,'nirvana');start(s,'dwarf.a01.dungeon');s.activeEncounter.heroBurn=1;s.activeEncounter.heroBurnPower=1e9;step(s);assert.equal(s.activeEncounter.affixState.nirvanaCount,1);assert.equal(s.dungeonRun.affixUsage.nirvanaCount,1);assert(E.validSave(s));s=clone(s);finish(s);start(s,'dwarf.a01.dungeon');assert.equal(s.activeEncounter.affixState.nirvanaCount,1);s.activeEncounter.heroBurn=1;s.activeEncounter.heroBurnPower=1e9;step(s);assert.equal(s.activeEncounter.affixState.nirvanaCount,2);assert(E.validSave(s));finish(s);start(s,'dwarf.a01.dungeon');assert.equal(s.activeEncounter.affixState.nirvanaCount,2);s.activeEncounter.heroBurn=1;s.activeEncounter.heroBurnPower=1e9;const last=s.activeEncounter;step(s);assert.equal(s.heroHp,0);assert.equal(last.win,false);}

// Direct production multi-combat boundary: divine reaper and multicast use their live power.
function multiFixture(){const enemies=[0,1].map(i=>{const u=makeMultiUnit('u'+i,0,'field',{enemy:'测试敌',hp:1000,atk:0,armor:0},0);u.elementTags=[];u.elementResistance={fire:0};u.control.stunUntil=999999;return u;});const e={id:'battle',developmentFixture:true,enemies,targetId:'u0',round:0,cd:{},heroHp:50,shield:0,barrierShield:0,warcry:0,weakness:0,ironcoat:0,guard:0,heroBurn:0,heroBurnPower:0,activeCastCount:0,summonSerial:0,done:false};syncMultiTarget(e);const s={skills:[null,null,null,null],conditions:['always','always','always','always'],momentum:0};const st={hp:100,atk:10,armor:0,hit:1,crit:0,critDamage:2,count:{},specials:{},lifesteal:0,penetration:0,block:0,resolveReduction:0,shieldBonus:0,elementAttack:{fire:0},elementResistance:{fire:0}};const ctx={stats:()=>st,SKILLS:{},skillUnlocked:()=>true,resolveElementDamage:x=>x,now:1100,makeSummon:()=>{throw Error('summon')}};return{s,e,st,ctx};}
function runMulti(f,rolls){let i=0;const old=Math.random;Math.random=()=>rolls[Math.min(i++,rolls.length-1)];try{return stepMulti(f.s,f.e,{},f.ctx);}finally{Math.random=old;}}
for(const [power,hp]of [[1,990],[2,0]]){const f=multiFixture();f.st.specials.reaper=power===1?true:2;runMulti(f,[0,.9,.015]);assert.equal(f.e.enemies[0].hp,hp);}
for(const [power,casts]of [[1,1],[2,2]]){const f=multiFixture();f.s.skills=['warcry',null,null,null];f.ctx.SKILLS.warcry={cd:5,name:'战吼'};f.st.specials.multicast=power===1?true:2;runMulti(f,[.2]);assert.equal(f.e.activeCastCount,casts);}


// Nonlethal authored rescue still excludes divine execution and growth rewards.
{const id='C08.O11.human',s=reachStoryScene('human',id);gear(s,'reaper');const growth=gear(s,'harvester',true,'ring2');growth.special.growthKills=12;assert(applyStoryEvent(s,{type:'scenario',sceneId:id,scenarioId:STORY_SCENES[id].encounter.scenarioId},{now:Math.max(s.lastSeen,s.lastHealthClock??0,s.nextBattleAt??0)+2000}));const e=s.activeEncounter;let turns=0;while(!e.done&&turns++<3000)E.step(s,e,s.nextActionAt);assert(e.done);assert(e.enemies.every(u=>u.hp>=1));assert.equal(growth.special.growthKills,12);assert(E.validSave(s));}

console.log('PASS v090 nine divine specials, exact effect boundaries, max-only aggregation, item growth/old counters, nonrecursive casts, production rewards and full-dungeon revival ledger.');
