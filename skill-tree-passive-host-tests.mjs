import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
import {stepMulti,executeTreePlayerAction,withMultiRng} from './dist/multi-combat.js';
import {createPlayerShieldLayers,grantPlayerShieldLayer} from './dist/player-shield-layers.js';
const P={axe_fervor:{damageMultiplier:1.12,armorMultiplier:.9},hammer_penetration:{physicalPenetrationPerBaseAtk:.15},fire_affinity:{firePowerRating:16,fireResistanceRating:16},shield_reserve:{armorMultiplier:1.15},mountain_vitality:{maxHpMultiplier:1.12,receivedHealingMultiplier:1.12},forged_resilience:{negativeDurationMultiplier:.8}};
function setup(passive=[],weaponType='axe'){
 const s=E.fresh();s.heroHp=E.stats(s).hp;s.lastHealthClock=s.lastSeen=10000;s.nextBattleAt=0;s.restUntil=0;const e=E.startDeveloperGroup(s,{count:2,seed:99},10000);e.heroHp=200;for(const u of e.enemies){u.hp=u.max=100000;u.armor=100;u.atk=0;u.nextHeavy=1000;u.location=0;}
 const raw={...E.stats(s),atk:100,hp:1000,armor:100,penetration:0,hit:1,crit:0,block:0,specials:{},count:{},lifesteal:0,lifestealRating:0};
 const treeSkills={passive:[...passive,...Array(2-passive.length).fill(null)],unlocked:passive,weaponType,passiveConfig:P,active:[null,null,null,null],conditions:['always','always','always','always'],attributeConfig:{dodgeCap:.5},configs:{},periodic:{burnTickMs:2000,bleedTickMs:2000,healingTickMs:2000}};
 const ctx={stats:()=>structuredClone(raw),SKILLS:E.SKILLS,skillUnlocked:()=>false,resolveElementDamage:E.resolveElementDamage,now:11100,treeSkills,makeSummon:()=>null};return {s,e,raw,ctx};
}
function basic(f){const before=f.e.enemies[0].hp;withMultiRng(f.e,()=>stepMulti(f.s,f.e,{burnAtStart:0,burnTicked:false},f.ctx));return before-f.e.enemies[0].hp;}
assert.equal(basic(setup()),55);assert.equal(basic(setup(['axe_fervor'])),62);assert.equal(basic(setup(['axe_fervor'],'hammer')),55);assert.equal(basic(setup(['hammer_penetration'],'hammer')),59);
// Fire affinity modifies the same actual elemental resolver; axe global applies once.
function fire(passive){const f=setup(passive);const {s,e,ctx}=f;const input={skillId:'ember_brand',castId:e.id+':fire',weaponType:'axe',config:{coefficient:1,burnPower:10,durationMs:6000,axeDurationBonus:2000,fireResistDown:5,cooldownMs:5500}};const result=withMultiRng(e,()=>executeTreePlayerAction(s,e,{...ctx,input,effects:{apply:()=>true},onDamageAction:()=>{},onHeroDeath:()=>{}}));assert(result);return e.lastCast.hits[0].actualHpLost;}
assert.equal(fire([]),100);assert(fire(['fire_affinity'])>100);assert(Math.abs(fire(['axe_fervor'])-112)<1e-8);
// Any actual skill shield grants defense, once, and last layer depletion removes it before next enemy hit.
function shieldDamage(twoLayers){const f=setup(['shield_reserve'],'generic');f.e.playerShieldLayers=createPlayerShieldLayers();for(let i=0;i<(twoLayers?2:1);i++)f.e.playerShieldLayers=grantPlayerShieldLayer(f.e.playerShieldLayers,{source:'skill:fixture'+i,capacity:1,durationMs:10000,clock:0,hp:f.e.heroHp}).state;f.e.enemies.forEach(u=>u.atk=100);const before=f.e.heroHp;basic(f);return before-f.e.heroHp;}
assert.equal(shieldDamage(false),96,'first 47 damage -1 shield, second 50 without shield DEF');assert.equal(shieldDamage(true),95,'multiple layers do not stack shield DEF');
// Received healing and maxHP derive from unmodified base; casting heal is real host path.
function healing(passive){const f=setup(passive);f.ctx.treeSkills.active=['forge_breath',null,null,null];f.ctx.treeSkills.unlocked=[...passive,'forge_breath'];f.ctx.treeSkills.configs={forge_breath:{cooldownMs:16500,heal:100,healingPower:10,durationMs:6000,lifestealUp:8}};const before=f.e.heroHp;basic(f);return f.e.heroHp-before+2;/* two minimum enemy damage */}
assert.equal(healing([]),100);assert.equal(healing(['mountain_vitality']),112);
// Percentage poison remains outside this multiplier; separate actual poison-host suite verifies HP/shield result.
console.log('PASS actual passive host: axe basic/fire once, weapon gates, hammer penetration, fire rating resolver, real skill shields dynamic DEF once, real heal received multiplier');
function reactor(passive){const f=setup(passive);const item=E.legendaryItem('everburning-reactor',1);f.s.inventory.push(item);f.s.equip.amulet=item.id;E.normalizeEquipmentRuntime(f.s);f.s.equipmentRuntime.byId[item.id].combatMs=10900;const logs=withMultiRng(f.e,()=>stepMulti(f.s,f.e,{burnAtStart:0,burnTicked:false},f.ctx));return Number(logs.find(x=>x.startsWith('余热循环')).split(' · ')[1]);}
assert.equal(reactor([]),75);assert.equal(reactor(['axe_fervor']),84);assert(reactor(['fire_affinity'])>75);
function life(passive,shield=false){const f=setup(passive);f.raw.lifesteal=f.raw.lifestealRating=100;if(shield)f.e.enemies[0].shield=1e5;basic(f);return f.e.lastCast.lifesteal??0;}
assert(Math.abs(life(['mountain_vitality'])/life([])-1.12)<1e-8);assert.equal(life(['mountain_vitality'],true),0);
function oldDot(passive){const f=setup(passive);f.e.enemies[1].burn=1;const before=f.e.enemies[1].hp;basic(f);return before-f.e.enemies[1].hp;}
assert.equal(oldDot([]),32);assert(Math.abs(oldDot(['axe_fervor'])-35.84)<1e-8);assert(oldDot(['fire_affinity'])>32);
// Typed negative duration is shortened at application, not damage magnitude.
import {DWARF_MONSTERS} from './dist/dwarf-content.js';
import {initializeDwarfActor} from './dist/dwarf-effects.js';
const dotDef=Object.values(DWARF_MONSTERS).find(d=>d.skills.some(s=>s.effects.some(e=>e.type==='dot')));
function dotDuration(passive){const f=setup(passive);const u=f.e.enemies[0],skill=dotDef.skills.find(s=>s.effects.some(e=>e.type==='dot'));
 initializeDwarfActor(u,dotDef,{hp:100000,atk:0,armor:100,elementalPower:10,parameterSetId:'fixture',basicIntervalMs:1100},10000);
 for(const s of dotDef.skills)u.control.cooldowns[s.id]=1e9;u.control.cooldowns[skill.id]=0;u.skillOverrides={[skill.id]:{castMs:0}};u.shield=0;basic(f);const d=f.e.typedDots.find(d=>d.key===skill.id);assert(d);return d.endAt-f.ctx.now;
}
assert(Math.abs(dotDuration(['forged_resilience'])/dotDuration([])-.8)<1e-8);
console.log('PASS actual passive host: legendary pulse global/fire rating, lifesteal received heal once and shield exclusion, legacy DOT global/fire, typed enemy DOT duration reduction');
