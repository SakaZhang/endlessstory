// v0.71 contract assertions through E.step; synthetic actors isolate amount and timing, not progression difficulty.
import assert from 'node:assert/strict';import path from 'node:path';import {pathToFileURL} from 'node:url';
const root=process.env.BALANCE_ENGINE_ROOT?pathToFileURL(path.resolve(process.env.BALANCE_ENGINE_ROOT,'dist')+'/'):new URL('./dist/',import.meta.url),load=name=>import(new URL(name,root));
const E=await load('engine.js'),R=await load('race-registry.js'),D=await load('combat-display-bridge.js'),W=await load('world-content.js'),F=await load('dwarf-effects.js'),H=await load('skill-tree-effect-host.js'),P=await load('talent-policy.js');
const near=(a,b,msg)=>assert(Math.abs(a-b)<1e-7,`${msg}: ${a} != ${b}`);
function state(race){const s=E.fresh(race);s.inventory=[];for(const slot of Object.keys(s.equip))s.equip[slot]=null;s.level=100;s.heroHp=10;s.lastSeen=s.lastHealthClock=10000;s.nextBattleAt=0;s.restUntil=0;return s;}
function learn(s,ids,passive=[]){const nodes=R.getSkillTreeDefinition(s.race).nodes,seen=new Set();function visit(id){if(seen.has(id))return;nodes.find(n=>n.id===id).requires.forEach(visit);seen.add(id);} [...ids,...passive].forEach(visit);Object.assign(s.skillTree.presets[0],{unlocked:[...seen],active:[...ids,...Array(4-ids.length).fill(null)],passive:[...passive,...Array(2-passive.length).fill(null)]});}
const skill={dwarf:'forge_breath',human:'human.field_dressing',elf:'elf.dew_mending',goblin:'goblin.patch_ration',ashen:'ashen.salve'},ratios={dwarf:[.14,0],human:[.11,.012],elf:[.13,.018],goblin:[.12,0],ashen:[.1,0]};
for(const race of R.PLAYABLE_RACES)for(const points of [0,1,5,10,30,99]){
 const s=state(race);s.talents.healing=points;learn(s,[skill[race]]);const e=E.startRoutedEncounter(s,10000);assert(e);for(const u of e.enemies){u.hp=u.max=1e8;u.atk=u.elementalPower=0;u.nextBasicAt=1e9;for(const id in u.control.cooldowns)u.control.cooldowns[id]=1e9;}
 const events=[];D.setCombatDisplayObserver(e,x=>events.push(x));const hp=E.stats(s).hp;for(let i=1;i<=7;i++)E.step(s,e,10000+i*1100);const heals=events.filter(x=>x.kind==='heal'&&x.targetId==='hero');
 near(heals[0].hpDelta,hp*ratios[race][0]*P.activeHealingMultiplier(points),`${race} ${points} direct scales once`);
 for(const tick of heals.slice(1))near(tick.hpDelta,hp*ratios[race][1],`${race} HOT excluded from talent`);
 assert.equal(heals.length,ratios[race][1]?4:1);assert.equal(e.activeCastCount,1);
}
// A received-healing passive must multiply AFTER the one direct-healing talent application.
{
 const s=state('dwarf');s.talents.healing=10;learn(s,['forge_breath'],['mountain_vitality']);const e=E.startRoutedEncounter(s,10000);for(const u of e.enemies){u.hp=u.max=1e8;u.nextBasicAt=1e9;for(const key in u.control.cooldowns)u.control.cooldowns[key]=1e9;}const events=[];D.setCombatDisplayObserver(e,x=>events.push(x));E.step(s,e,11100);const heal=events.find(x=>x.kind==='heal');near(heal.hpDelta,E.stats(s).hp*.14*1.4*1.12,'received multiplier exactly once');
}
const monster=Object.values(W.WORLD_MONSTERS).find(m=>m.skills.some(s=>s.effects.some(e=>e.type==='dot'))),skillDef=monster.skills.find(s=>s.effects.some(e=>e.type==='dot')),dot=skillDef.effects.find(e=>e.type==='dot');
for(const points of [0,1,5,10])for(const passive of [false,true]){
 const s=state('dwarf');s.talents.resolve=points;if(passive)learn(s,[],['forged_resilience']);const e=E.startRoutedEncounter(s,10000),u=e.enemies[0];e.enemies=[u];F.initializeDwarfActor(u,monster,{...W.monsterParameters(monster.id),hp:1e8,atk:1,elementalPower:1},10000);u.skillOverrides={[skillDef.id]:{castMs:0}};for(const skill of monster.skills)u.control.cooldowns[skill.id]=skill.id===skillDef.id?0:1e9;
 e.heroHp=s.heroHp=E.stats(s).hp;E.step(s,e,11100);assert(e.typedDots?.length);near(e.typedDots[0].endAt-11100,Math.max(1000,Math.round(dot.seconds*1000*(1-.02*points)*(passive?.8:1))),'typed DOT talent/passive duration exactly once');
}
// Host healing overflow does not change shield/HoT capacity or refill on max-HP changes.
{
 const s=state('elf');s.talents.healing=99;const e=E.startRoutedEncounter(s,10000),st=E.stats(s);e.heroHp=s.heroHp=st.hp-1;const host=H.createTreeEffectHost(s,e,{stats:()=>st,combatClock:0,tickIntervalMs:2000});assert(host);
 host.applyEffect('self',{type:'heal',amount:100,durationMs:0,sourceId:'regression-heal'});near(e.heroHp,st.hp,'overheal clamps');
 host.applyEffect('self',{type:'shield',amount:100,durationMs:4000,sourceId:'regression-shield'});near(e.playerShieldLayers.layers.find(x=>x.source==='skill:regression-shield').capacity,100,'talent excludes shield');
}
const human=await load('races/human/skills.js');assert(human.HUMAN_CORE_BUILDS.crit.active.includes('human.expose'));assert(!human.HUMAN_CORE_BUILDS.crit.active.includes('human.opening'));
console.log(`PASS v0.71 talent host contracts: 5 races × 6 healing allocations, exact HOT exclusion, passive single multiplication, 8 typed DOT timing cases, clamp/shield exclusion, crit recommended armor break. Engine root ${root}`);
