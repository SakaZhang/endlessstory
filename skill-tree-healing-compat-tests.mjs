import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
import {skillConfigs,PASSIVES,PERIODIC} from './dist/skill-tree-tuning.js';
import {executeTreePlayerAction,withMultiRng} from './dist/multi-combat.js';
import {createTreeEffectHost} from './dist/skill-tree-effect-host.js';
import {resolveTreePassives,derivePassiveStats,passiveReceivedHeal} from './dist/skill-tree-passives.js';
const near=(a,b)=>assert(Math.abs(a-b)<1e-8,`${a} != ${b}`);
function fixture({flat=300,hp=20,multicast=false,seed=123}={}){
 const s=E.fresh();s.level=40;s.talents.healing=10;s.lastHealthClock=s.lastSeen=10000;s.nextBattleAt=0;s.restUntil=0;s.heroHp=E.stats(s).hp;
 const e=E.startDeveloperGroup(s,{count:2,seed},10000);assert(e);e.heroHp=hp;s.heroHp=hp;
 const base={...E.baseStats(s),atk:100,armor:100,hp:1000,healingBonus:flat,hit:1,crit:0,specials:multicast?{multicast:true}:{},count:{}};
 const passive=['mountain_vitality',null],unlocked=['mountain_vitality','forge_breath'],treeSkills={passive,unlocked,weaponType:'hammer',passiveConfig:PASSIVES};
 const context=resolveTreePassives({...treeSkills,config:PASSIVES}),derived=derivePassiveStats(base,context,{currentHp:hp}).stats,config=skillConfigs(derived).forge_breath;
 const effects=createTreeEffectHost(s,e,{stats:()=>derived,combatClock:0,receivedHeal:amount=>passiveReceivedHeal(context,{amount,currentHp:e.heroHp,maxHp:derived.hp}),tickIntervalMs:PERIODIC.healingTickMs});assert(effects);
 const cast=()=>withMultiRng(e,()=>executeTreePlayerAction(s,e,{stats:()=>base,resolveElementDamage:E.resolveElementDamage,now:11100,treeSkills,attributeConfig:{dodgeCap:.5},input:{skillId:'forge_breath',castId:e.id+':heal',weaponType:'hammer',config},effects:{apply:effects.applyEffect,has:effects.has,get:effects.get,activeBuffIds:effects.activeBuffIds,eligibleDebuffIds:effects.eligibleDebuffIds},onDamageAction:()=>{},onHeroDeath:()=>{}}));
 return {s,e,base,derived,config,effects,cast};
}
{
 const f=fixture(),before=f.e.heroHp;near(f.derived.hp,1120);near(f.config.heal,.14*1120);assert(f.cast()?.original.cast);near(f.e.heroHp-before,(.14*1120)*1.4*1.12);assert.equal(f.e.treeSkillCooldowns.forge_breath,15);
 // HOT is 2% of derived max HP and receives healing multiplier, not the flat legacy bonus.
 const beforeTick=f.e.heroHp;assert(f.effects.advance(2000));near(f.e.heroHp-beforeTick,.02*1120*1.12);
}
{
 const f=fixture({hp:1110});assert(f.cast()?.original.cast);near(f.e.heroHp,1120);assert(f.effects.advance(2000));near(f.e.heroHp,1120,'HOT never overheals');
 const full=fixture({hp:1120}),before=JSON.stringify(full.e);assert.equal(full.cast(),null);assert.equal(JSON.stringify(full.e),before,'full health refuses cast without CD/RNG');
}
{
 let found=false;
 for(let seed=1900;seed<=2100&&!found;seed++){
  const f=fixture({multicast:true,seed});const before=f.e.heroHp,r=f.cast();assert(r?.original.cast);
  if(r.extra?.cast){found=true;near(f.e.heroHp-before,2*(.14*1120)*1.4*1.12);assert.equal(f.e.activeCastCount,2);assert.equal(f.e.treeSkillCooldowns.forge_breath,15,'multicast pays one normal CD');assert.equal(f.e.treeEffects.hero.sources.filter(x=>x.type==='healOverTime').length,1,'same-source HOT refreshes, no duplicated stacks');}
 }
 assert(found,'bounded persisted RNG seeds exercise real multicast');
}
// Retired healingBonus flat no longer enters planners; the real host applies the talent exactly once.
const a=skillConfigs({atk:100,armor:50,hp:1000}),b=skillConfigs({atk:100,armor:50,hp:1000,healingBonus:999});near(a.forge_breath.heal,140);near(b.forge_breath.heal,140);assert.equal(a.forge_breath.healingPower,b.forge_breath.healingPower);assert.deepEqual(a.iron_vigil,b.iron_vigil);
console.log('PASS forge breath direct healing: .14 passive-adjusted maxHP × talent × receivedHeal once; actual host high flat/clamp/HOT/no-full-health-cast/multicast single CD');
