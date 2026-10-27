import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as E from './dist/engine.js';
import {currentAffix} from './current-equipment-test-fixture.mjs';
import {activeHealingMultiplier,talentNegativeDuration} from './dist/talent-policy.js';
import {createTreeEffectHost} from './dist/skill-tree-effect-host.js';
import {setCombatDisplayObserver} from './dist/combat-display-bridge.js';
import {WORLD_MONSTERS,monsterParameters} from './dist/world-content.js';
import {initializeDwarfActor} from './dist/dwarf-effects.js';
import {getSkillTreeDefinition} from './dist/race-registry.js';
import {HUMAN_CORE_BUILDS,planSkill} from './dist/races/human/skills.js';
const near=(a,b,msg='')=>assert(Math.abs(a-b)<1e-7,`${msg}: ${a} != ${b}`),heal={dwarf:'forge_breath',human:'human.field_dressing',elf:'elf.dew_mending',goblin:'goblin.patch_ration',ashen:'ashen.salve'};
let seed=71;Math.random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/2**32);
function state(race='dwarf',level=100){const s=E.fresh(race);s.level=level;s.inventory=[];s.equip=Object.fromEntries(Object.keys(s.equip).map(k=>[k,null]));s.lastHealthClock=s.lastSeen=10000;s.nextBattleAt=0;s.restUntil=0;s.heroHp=1;return s;}
function encounter(s){const e=E.startRoutedEncounter(s,10000);assert(e);e.rngState=123;for(const u of e.enemies){u.hp=u.max=1e8;u.atk=u.elementalPower=0;u.nextBasicAt=1e9;for(const k in u.control.cooldowns)u.control.cooldowns[k]=1e9;}return e;}
const results=[],gearCache=new Map();
function cast(race,points,{level=100,talent='healing',gear=false}={}){const s=state(race,level);s.talents[talent]=points;
 if(gear==='natural'){const natural=JSON.parse(fs.readFileSync(new URL('./fixtures/natural-progression-v068/'+race+'.json',import.meta.url)));s.inventory=structuredClone(natural.inventory);s.equip={...natural.equip};}else if(gear){const key=race+':'+level;if(gearCache.has(key)){const cached=structuredClone(gearCache.get(key));s.inventory=cached.inventory;s.equip=cached.equip;}else{for(const socket of Object.keys(s.equip)){const type=socket.startsWith('ring')?'ring':socket;const it=E.item(type,level,null,1,{levelSource:'generated',originRace:race});it.affixes=[];it.special=null;s.inventory.push(it);s.equip[socket]=it.id;}gearCache.set(key,structuredClone({inventory:s.inventory,equip:s.equip}));}}
 const p=s.skillTree.presets[0];p.unlocked=[heal[race]];p.active=[heal[race],null,null,null];const e=encounter(s),events=[];setCombatDisplayObserver(e,x=>events.push(x));for(let i=1;i<=7;i++)E.step(s,e,10000+i*1100);
 const heals=events.filter(x=>x.kind==='heal'&&x.targetId==='hero'&&x.skillId===heal[race]),row={race,level,gear,points,talent,hp:E.stats(s).hp,direct:heals[0]?.hpDelta??0,hot:heals.slice(1).reduce((n,x)=>n+x.hpDelta,0),shield:events.filter(x=>x.kind==='shield'&&x.targetId==='hero').reduce((n,x)=>n+x.shieldDelta,0)};return row;}
for(const race of Object.keys(heal)){const base=cast(race,0);for(const points of [0,1,5,10,20,99]){const row=cast(race,points);near(row.direct,base.direct*activeHealingMultiplier(points),race+' direct');near(row.hot,base.hot,race+' HOT excluded');near(row.shield,base.shield,race+' shield excluded');results.push(row);}
 for(const points of [0,1,5,10]){const s=state(race);s.talents.healing=points;E.normalizePotions(s);s.potionStacks['healing|0']=1;const before=s.heroHp;assert(E.drinkPotion(s,'healing|0',10000,null));near(s.heroHp-before,E.stats(s).hp*E.potionEffect('healing',0).healFraction,'potion excluded');}}
// Native weapons and real shield skills retain the same boundary.
for(const race of Object.keys(heal)){const base=cast(race,0,{gear:true});for(const points of [1,5,10,20,99]){const row=cast(race,points,{gear:true});near(row.direct,base.direct*activeHealingMultiplier(points),race+' native direct');near(row.hot,base.hot,race+' native periodic');near(row.shield,base.shield,race+' native shield');results.push(row);}}
for(const points of [0,1,5,10]){const s=state();s.talents.healing=points;const e={heroHp:1,enemies:[{id:'target',hp:1}]},host=createTreeEffectHost(s,e,{stats:{hp:10000},tickIntervalMs:2000});assert(host.applyEffect('self',{type:'shield',amount:100,durationMs:6000,sourceId:'shield'}));near(e.playerShieldLayers.layers[0].remaining,100);assert(host.applyEffect('self',{type:'healOverTime',amount:10,durationMs:6000,sourceId:'hot'}));assert(host.advance(6000));near(e.heroHp,31,'HOT excludes talent');}
for(const points of [0,1,5,10]){const s=state();s.talents.healing=points;for(const socket of ['ring1','ring2']){const ring=E.item('ring',1,null,0);ring.affixes=[currentAffix('lifesteal',5)];s.inventory.push(ring);assert(E.equipItem(s,ring.id,socket));}const e=E.startDeveloperGroup(s,{count:2,seed:551},10000);for(const u of e.enemies){u.hp=u.max=10000;u.shield=0;u.armor=0;u.atk=0;u.control.stunUntil=999999;}const before=e.heroHp;assert(E.queueDeveloperAction(s,{scope:'single',kind:'damage',amount:100}));E.step(s,e,s.nextActionAt);near(e.heroHp-before,1,'actual lifesteal excludes healing talent');}
// Same point budget and repeatable earned Q1 panels: not a claim of natural acquisition time.
const budget=[];for(const race of Object.keys(heal))for(const level of [10,20,40,100])for(const gear of [false,true])for(const talent of ['heart','healing']){seed=710+level;budget.push(cast(race,Math.min(10,level-1),{level,gear,talent}));}
for(const race of Object.keys(heal))for(const talent of ['heart','healing'])budget.push(cast(race,10,{level:100,gear:'natural',talent}));
// Host boundaries: every negative kind, resolved default DOT tick, equipment direct
// recovery, HOT and shields are not accidentally multiplied by the healing talent.
for(const points of [0,1,5,10])for(const type of ['armorDown','elementResistDown','fireResistDown','attackDown','hitDown','dot']){
 const s=state();s.talents={...s.talents,healing:points,resolve:points};const e={heroHp:1,enemies:[{id:'target',hp:1}]};
 const host=createTreeEffectHost(s,e,{stats:{hp:10000},tickIntervalMs:2000,resolveDot:()=>{},negativeDuration:(ms,fx)=>talentNegativeDuration(ms,points,{minimumMs:fx.type==='dot'?fx.tickIntervalMs:1,durationMultiplier:.8})});
 const effect={type,amount:1,durationMs:2200,sourceId:'test',...(type==='dot'?{status:'burn',damageType:'fire'}:type==='elementResistDown'?{damageType:'fire'}:{})};assert(host.applyEffect('self',effect));near(e.treeEffects.hero.sources[0].endAt,talentNegativeDuration(2200,points,{minimumMs:type==='dot'?2000:1,durationMultiplier:.8}));if(type==='dot')assert(e.treeEffects.hero.sources[0].endAt>=2000);
 const before=e.heroHp;assert(host.applyEffect('self',{type:'heal',amount:10,sourceId:'equipment-test',source:{kind:'equipment',id:'test'}}));near(e.heroHp-before,10,'equipment heal excluded');
}
// Actual production DOT actions: one representative of every authored damage type,
// all races' catalog duration bounds, and passive × talent multiplication.
const monsters=Object.values(WORLD_MONSTERS),representatives=new Map();for(const m of monsters)for(const skill of m.skills)for(const fx of skill.effects)if(fx.type==='dot'&&!representatives.has(fx.damageType))representatives.set(fx.damageType,{m,skill,fx});const dots=[];
for(const {m,skill,fx} of representatives.values())for(const points of [0,1,5,10])for(const passive of [false,true]){const s=state();s.talents.resolve=points;if(passive){s.skillTree.presets[0].unlocked=['forge_breath','forged_resilience'];s.skillTree.presets[0].passive=['forged_resilience',null];}const e=encounter(s),u=e.enemies[0];e.enemies=[u];initializeDwarfActor(u,m,{...monsterParameters(m.id),hp:1e8,atk:1,elementalPower:1},10000);if(skill.trigger==='hp_below_50_once')u.hp=u.max*.4;u.skillOverrides={[skill.id]:{castMs:0}};for(const k of m.skills)u.control.cooldowns[k.id]=k.id===skill.id?0:1e9;s.heroHp=e.heroHp=E.stats(s).hp;E.step(s,e,11100);const dot=e.typedDots.find(d=>d.key===skill.id);assert(dot,skill.id);const expected=talentNegativeDuration(fx.seconds*1000,points,{minimumMs:1000,durationMultiplier:passive?.8:1});near(dot.endAt-11100,expected);assert(dot.nextAt<=dot.endAt);dots.push({type:fx.damageType,points,passive,duration:expected});}
// Refund atomics, explicit one-time old-save correction, no deleted points/items,
// early free path, deterministic paid fallback, unspent fruit credits preserved.
{
 const s=state('dwarf',40);s.talents.healing=20;s.talents.resolve=10;s.gold=0;delete s.talentBalanceVersion;const before=JSON.stringify(s),q=E.getTalentRefundQuote(s,{healing:20,resolve:10});assert.equal(q.freeReason,'balance-correction');assert.equal(JSON.stringify(s),before);assert(E.commitTalentRefund(s,{healing:20,resolve:10}));assert.equal(E.availableTalentPoints(s),39);assert.equal(s.talentBalanceVersion,1);assert.equal(s.gold,0);assert(E.validSave(s));
 s.talents.power=5;assert.equal(E.getTalentRefundQuote(s,{power:5}).goldCost,100);const unchanged=JSON.stringify(s);assert(!E.commitTalentRefund(s,{power:5}));assert.equal(JSON.stringify(s),unchanged);s.gold=100;assert(E.commitTalentRefund(s,{power:5}));assert.equal(s.gold,0);
 s.talents.heart=3;s.consumables.memoryFruit=1;assert(E.commitTalentRefund(s,{heart:3}));assert.equal(s.consumables.refundCredits,7);
 s.talents.power=5;s.running=true;assert(!E.commitTalentRefund(s,{power:5}));s.running=false;s.activeEncounter={done:false};assert(!E.commitTalentRefund(s,{power:5}));assert(!E.spendTalent(s,'power'));delete s.activeEncounter;
 const low=state('elf',20);low.talents.power=19;low.gold=0;assert(E.commitTalentRefund(low,{power:19}));assert.equal(E.availableTalentPoints(low),19);
 const old=state();old.talents.healing=99;delete old.talentBalanceVersion;assert(E.validSave(old));E.normalizeTalents(old);assert.equal(old.talents.healing,99);assert.equal(old.talentBalanceVersion,undefined,'normalization never spends correction entitlement');assert(activeHealingMultiplier(99)<1.8);
}
assert(HUMAN_CORE_BUILDS.crit.active.includes('human.expose'));assert(!HUMAN_CORE_BUILDS.crit.active.includes('human.opening'));const tree=getSkillTreeDefinition('human');for(const id of HUMAN_CORE_BUILDS.crit.active)assert(HUMAN_CORE_BUILDS.crit.learned.includes(id));
if(process.env.TALENT_REPORT)fs.writeFileSync(process.env.TALENT_REPORT,JSON.stringify({formula:[0,1,5,10,20,99].map(points=>({points,multiplier:activeHealingMultiplier(points)})),results,budget,dots},null,2));
console.log('PASS v071 talents: 5-race real step 0/1/5/10/20/99 direct/HOT/shield; actual potion exclusions; six negative tree kinds and authored typed DOT/passive floors; refunds/save/busy guards; recommended human break closure.');
