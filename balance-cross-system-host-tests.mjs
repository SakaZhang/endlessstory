// Isolated production-host regression: no starter equipment, no minted production rewards.
// BALANCE_ENGINE_ROOT may point to another checkout for independent pre-integration review.
import assert from 'node:assert/strict';
import path from 'node:path';import {pathToFileURL} from 'node:url';
const root=process.env.BALANCE_ENGINE_ROOT?pathToFileURL(path.resolve(process.env.BALANCE_ENGINE_ROOT,'dist')+'/'):new URL('./dist/',import.meta.url);
const load=name=>import(new URL(name,root));
const E=await load('engine.js'),R=await load('race-registry.js'),C=await load('skill-tree-consumer.js'),T=await load('skill-tree-state.js'),D=await load('combat-display-bridge.js'),A=await load('affix-expansion.js');
const near=(a,b,msg)=>assert(Math.abs(a-b)<1e-7,`${msg}: ${a} != ${b}`);
function naked(race,level=40){const s=E.fresh(race);s.inventory=[];for(const slot of Object.keys(s.equip))s.equip[slot]=null;s.level=level;s.heroHp=100;s.lastSeen=s.lastHealthClock=10000;s.nextBattleAt=0;s.restUntil=0;return s;}
function learn(s,ids,active=ids,passive=[]){const config=R.getSkillTreeDefinition(s.race),seen=new Set();function visit(id){if(seen.has(id))return;const n=config.nodes.find(n=>n.id===id);assert(n,id);n.requires.forEach(visit);seen.add(id);}ids.forEach(visit);const p=s.skillTree.presets[0];p.unlocked=[...seen];p.active=[...active,...Array(4-active.length).fill(null)];p.passive=[...passive,...Array(2-passive.length).fill(null)];assert(T.validSkillTree(s,config));}
function quietEncounter(s){const e=E.startRoutedEncounter(s,10000);assert(e);e.rngState=123;for(const u of e.enemies){u.hp=u.max=1e8;u.atk=u.elementalPower=0;u.nextBasicAt=1e9;for(const key in u.control.cooldowns)u.control.cooldowns[key]=1e9;}return e;}
// This is an isolated balance fixture, not an assertion that every learned skill is available at Lv1.
let genericCount=0;
for(const race of R.PLAYABLE_RACES){
 const s=naked(race,100),stats=E.stats(s),tuning=R.getRaceTuning(race),configs=typeof tuning.configs==='function'?tuning.configs(stats):tuning.configs;
 for(const node of R.getSkillTreeDefinition(race).nodes.filter(n=>n.kind==='active')){
  const plan=C.planTreeSkill({stats,snapshotStats:stats,skillId:node.id,castId:'audit-'+node.id,weaponType:'generic',config:configs[node.id],selectedTargetId:'target',targets:[{id:'target',alive:true,hp:100,maxHp:200,baseAtk:20,atk:20,baseArmor:10,preparing:true,poisonLayers:2,burning:true,bleeding:true,armorBroken:true}],hero:{hp:100,maxHp:stats.hp,defense:stats.armor,shield:20,activeBuffIds:[],eligibleDebuffIds:['fixture-dot']}});
  assert(plan,`${node.id}: generic plan must remain available when state prerequisites hold`);genericCount++;
 }
 const first=R.getSkillTreeDefinition(race).nodes.find(n=>n.kind==='active'&&!n.requires.length),early=naked(race,first.cost+1);learn(early,[first.id]);early.heroHp=E.stats(early).hp;
 const e=E.startRoutedEncounter(early,10000);assert(e);e.rngState=123;E.step(early,e,11100);assert.equal(e.activeCastCount,1,`${race}: unarmed root really casts`);assert(E.validSave(early),`${race}: unarmed progressed save is valid`);
 // Actual draft transaction protection, independent of equipment presence.
 const fresh=naked(race,100),config=R.getSkillTreeDefinition(race),q=T.quoteSkillTreeChange(fresh,config,{type:'unlock',skillId:first.id});assert(q);const before=JSON.stringify(fresh);
 assert.equal(T.commitSkillTreeChange({setItem(){throw Error('quota');}},fresh,q,config).ok,false);assert.equal(JSON.stringify(fresh),before);
 const committed=T.commitSkillTreeChange({setItem(){}},fresh,q,config);assert(committed.ok);assert.equal(T.prepareSkillTreeChange(committed.game,q,config),null,'stale quote rejected');assert.equal(T.prepareSkillTreeChange({...fresh,running:true},q,config),null,'combat-started quote rejected');
}
assert.equal(genericCount,105);
// Max HP, received-heal passives and cast/tick boundaries are observed through E.step, not inferred from descriptions.
const healingSkill={dwarf:'forge_breath',human:'human.field_dressing',elf:'elf.dew_mending',goblin:'goblin.patch_ration',ashen:'ashen.salve'};
const pureGeneric={dwarf:[.14,0],human:[.11,.012],elf:[.13,.018],goblin:[.12,0],ashen:[.10,0]};
for(const race of R.PLAYABLE_RACES){
 const s=naked(race),id=healingSkill[race];learn(s,[id]);const e=quietEncounter(s),hp=E.stats(s).hp,events=[];D.setCombatDisplayObserver(e,event=>events.push(event));
 for(let i=1;i<=7;i++)E.step(s,e,10000+i*1100);
 const heals=events.filter(x=>x.kind==='heal'&&x.targetId==='hero'),[direct,tick]=pureGeneric[race];
 near(heals.reduce((n,x)=>n+x.hpDelta,0),hp*(direct+3*tick),`${race} no talent baseline, exactly three HOT ticks`);assert.equal(e.activeCastCount,1);
 assert.equal(heals.filter(x=>x.hpDelta>0).length,tick?4:1);
}
// Approved interactions: shield and execute must never enter the lifesteal basis; each hit stays independent.
near(A.calculateLifesteal({rating:100,maxHp:1000,currentHp:100,hits:[{hitId:'hit',source:'active',hpBefore:400,hpAfter:300}]}).heal,10,'10% actual direct HP loss');
near(A.calculateLifesteal({rating:100,maxHp:1000,currentHp:100,hits:[{hitId:'shielded',source:'active',hpBefore:400,hpAfter:400}]}).heal,0,'shield does not lifesteal');
assert.equal(A.SPECIAL_AFFIX_EXPANSION.reaper.chance,.01);
assert.equal(A.SPECIAL_AFFIX_EXPANSION.multicast.chance,.15);
const poison=R.getRacePack('goblin').planSkill({skillId:'goblin.venom_cut',castId:'poison-invariant',weaponType:'dagger',selectedTargetId:'target',targets:[{id:'target',alive:true,hp:100,maxHp:100,baseAtk:20}],hero:{hp:100,maxHp:1000},stats:{atk:100,hp:1000,armor:100}}).actions.flatMap(x=>x.effects??[]).find(x=>x.type==='poison');
assert.equal(poison.fractionPerLayer,.03);assert.equal(poison.timing.maxLayers,5);assert.equal(poison.globalDamageMultiplierApplies,false);
console.log(`PASS balance cross-system: ${genericCount} unarmed plans; five earliest-root real casts/valid saves; quota/stale/combat draft protection; five real heal/HOT baselines; poison/reaper/multicast/lifesteal invariants. Engine root ${root}`);
