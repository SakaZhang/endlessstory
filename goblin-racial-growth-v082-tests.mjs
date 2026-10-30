// Latest v0.82 user target: only Goblin racial level growth is reduced.
// Exact v0.81.1 inputs remain immutable historical evidence, not migrated saves.
import assert from 'node:assert/strict';
import fs from 'node:fs';import vm from 'node:vm';import {createHash} from 'node:crypto';
import * as E from './dist/engine.js';
import {DEFAULT_SURVIVAL_GROWTH,GOBLIN_SURVIVAL_GROWTH,racialSurvivalGrowth} from './dist/race-survival-balance.js';
import {derivePassiveStats} from './dist/skill-tree-passives.js';
import {getRacePack} from './dist/race-registry.js';
import {WORLD_MONSTERS} from './dist/world-content.js';
import {captureCombatDisplay} from './dist/combat-display-bridge.js';
import {characterStatsSnapshot,renderCharacterStats} from './dist/character-stats-ui.js';
import {CONFIG as EQUIPMENT_BUDGET_CONFIG,enhanceRawBase} from './dist/equipment-budget.js';
import {validItemBudgetMetadata,equipmentBudgetNotice} from './dist/equipment-budget-adapter.js';
import {renderFormalEnhancement} from './dist/equipment-enhancement-ui.js';
import * as EquipmentDisplay from './dist/equipment-display.js';
import {equipmentIcon} from './dist/equipment-art.js';import {renderSetEffects} from './dist/set-effects.js';
import {formatAttribute} from './dist/attribute-format.js';
const path='fixtures/goblin-total-survival-v0812-baseline.json',bytes=fs.readFileSync(path),fixture=JSON.parse(bytes),clone=x=>structuredClone(x);
assert.equal(createHash('sha256').update(bytes).digest('hex'),'b5e063ab84ab0b4f06dd77d5fad7a15a0e31e3af7743ff7231931c54c4da8f4a','frozen exact v0.81.1 inputs/outputs, not regenerated from candidate');
assert.equal(fixture.sourceCommit,'812e4e35');assert.equal(fixture.rows.length,208);assert.deepEqual(GOBLIN_SURVIVAL_GROWTH,{hp:11.2,armor:.7});assert.deepEqual(DEFAULT_SURVIVAL_GROWTH,{hp:14,armor:1});
for(const race of E.RACE_KEYS)assert.equal(racialSurvivalGrowth(race),race==='goblin'?GOBLIN_SURVIVAL_GROWTH:DEFAULT_SURVIVAL_GROWTH);
// Orthogonal v0.82 policies extend legends and change enhancement4%→5%.
// Keep all208 inputs; independently reconcile every enhanced contribution below.
for(const [name,digest]of Object.entries(fixture.sourceHashes).filter(([name])=>!['dist/legendary-equipment.js','dist/equipment-budget.js'].includes(name)))assert.equal(createHash('sha256').update(fs.readFileSync(name)).digest('hex'),digest,'unchanged gear/attack/poison/passives '+name);
assert(!fs.existsSync('dist/equipment-base-balance.js'),'discarded gear-only policy removed, never stacked');
const near=(actual,expected,label)=>assert(Math.abs(actual-expected)<1e-8,`${label}: ${actual} != ${expected}`);
const statKeys=['atk','armor','hp'];
assert.equal(EQUIPMENT_BUDGET_CONFIG.enhancementPerLevel,.05);
// Independent new-policy oracle: no compound growth and no forced +1 fallback.
const expectedEnhancedBase=(raw,level)=>Object.fromEntries(statKeys.map(k=>[k,Math.round(raw[k]*(1+.05*level))]));
// Exact released4% policy including its old small-stat fallback, NOT production code.
function historicalEnhancedBase(raw,level){let prev={...raw};for(let n=1;n<=level;n++){const next=Object.fromEntries(statKeys.map(k=>[k,raw[k]===0?0:Math.max(prev[k],Math.round(raw[k]*(1+.04*n)))]));if(statKeys.every(k=>next[k]===prev[k])){const k=['hp','armor','atk'].find(k=>raw[k]>0);if(k)next[k]++;}prev=next;}return prev;}
for(const raw of [{atk:0,armor:1,hp:1},{atk:3,armor:2,hp:17},{atk:100,armor:60,hp:1000}])for(let level=0;level<=5;level++)assert.deepEqual(enhanceRawBase(raw,level),expectedEnhancedBase(raw,level),'independent exact5% enhancement');
const enhancementAdjustments=[];
function expectedBase(row){
 const expected=clone(row.base),s=row.state,gear=[...new Set(Object.values(s.equip).filter(Boolean))].map(id=>s.inventory.find(it=>it.id===id));
 if(gear.some(it=>it.enhancement?.level)){
  assert.equal(row.profile,'divine','all frozen enhanced cases remain covered');assert(gear.every(it=>!it.legendaryId),'no legendary attack multiplier hidden in enhanced fixtures');
  const levelBase={atk:0,armor:s.level,hp:s.level*14},newTotal={atk:14+s.level*3+s.talents.power*3,armor:5+s.talents.steel*3,hp:120+s.talents.heart*20},oldTotal=Object.fromEntries(statKeys.map(k=>[k,newTotal[k]+levelBase[k]])),bonus={atk:0,armor:0,hp:0};
  for(const it of gear){
   const raw=Object.fromEntries(statKeys.map(k=>[k,it[k]])),level=it.enhancement?.model==='equipment-budget-m2-v1'?it.enhancement.level:0,multiplier=it.divine?1.1:1,old=historicalEnhancedBase(raw,level),next=expectedEnhancedBase(raw,level);
   for(const k of statKeys){oldTotal[k]+=old[k]*multiplier;newTotal[k]+=next[k]*multiplier;}
   for(const a of it.affixes)if(statKeys.includes(a.stat))bonus[a.stat]+=a.value*multiplier;
  }
  const delta={};for(const k of statKeys){assert.equal(Math.round(oldTotal[k]+bonus[k]),row.base[k],`immutable old4% ${row.level}/${k} reconstructed exactly`);const current=Math.round(newTotal[k]+bonus[k])+levelBase[k];delta[k]=current-row.base[k];expected[k]+=delta[k];}
  enhancementAdjustments.push({level:row.level,profile:row.profile,delta});
 }
 if(row.race==='goblin'){expected.hp-=row.level*2.8;expected.armor-=row.level*.3;}return expected;
}
function expectedStats(s,base){const context=E.treePassiveContext(s);return context?derivePassiveStats(base,context,{currentHp:s.heroHp??base.hp}).stats:base;}
function compare(actual,expected,label){
 near(actual.hp,expected.hp,label+' HP');near(actual.armor,expected.armor,label+' armor');
 const a={...actual},b={...expected};delete a.hp;delete a.armor;delete b.hp;delete b.armor;assert.deepEqual(a,b,label+' every other stat unchanged');
}
let affected=0,controls=0;
for(const row of fixture.rows){
 const s=clone(row.state),before=JSON.stringify(s);assert(E.validSave(s),'current valid before read');
 const expected=expectedBase(row);compare(E.baseStats(s),expected,`${row.race}/${row.level}/${row.profile} base`);compare(E.stats(s),expectedStats(s,expected),`${row.race}/${row.level}/${row.profile} final`);
 const panel=characterStatsSnapshot(s);assert.deepEqual(panel.current,E.stats(s));assert.deepEqual(panel.permanent,E.stats(s));
 assert(renderCharacterStats(s).includes(formatAttribute(E.stats(s).hp)));assert.equal(JSON.stringify(s),before,'stat reads and UI do not rewrite equipment');
 for(const it of s.inventory){assert(validItemBudgetMetadata(it));const raw={atk:it.atk,armor:it.armor,hp:it.hp},base=it.enhancement?.model==='equipment-budget-m2-v1'?expectedEnhancedBase(raw,it.enhancement.level):raw;assert.deepEqual(E.itemTotals(it),Object.fromEntries(Object.entries(base).map(([k,v])=>[k,v*(it.divine?1.1:1)])),'item has NO racial cut');}
 const normalized=clone(s);normalized.heroHp=Math.min(normalized.heroHp,E.stats(s).hp);assert(E.normalizeHealth(s,s.lastHealthClock));assert.deepEqual(s,normalized,'only existing health cap, no save migration');assert(E.validSave(s));
 row.race==='goblin'?affected++:controls++;
}
assert.equal(affected,80);assert.equal(controls,128);assert.equal(enhancementAdjustments.length,8,'every frozen+5divinecase retained');console.log('Exact old4%→new5% enhancement adjustments:',JSON.stringify(enhancementAdjustments));
// Level gain remains reduced forever, including beyond the existing item-budget cap.
for(const level of [1,20,60,100,101,150,250,1000]){const s=E.fresh('goblin');s.level=level;const a=E.stats(s);near(a.hp,120+level*11.2,'fixed120HP plus reduced growth');near(a.armor,5+level*.7,'fixed5armor plus reduced growth');assert.equal(a.atk,14+level*3);s.level++;const b=E.stats(s);near(b.hp-a.hp,11.2,'naked HP per level');near(b.armor-a.armor,.7,'naked armor per level');assert.equal(b.atk-a.atk,3,'attack growth unchanged');}
// Every available Goblin/common passive alone and every legal two-slot pair.
const ids=Object.keys(getRacePack('goblin').passives),selections=[[],...ids.map(id=>[id]),...ids.flatMap((id,i)=>ids.slice(i+1).map(other=>[id,other]))];let passiveCases=0;
for(const level of [60,150])for(const selected of selections){
 const row=fixture.rows.find(r=>r.race==='goblin'&&r.level===level&&r.profile==='q2'),s=clone(row.state),p=s.skillTree.presets[0];p.unlocked=[...selected];p.passive=[...selected,...Array(2-selected.length).fill(null)];assert(E.validSave(s));
 const base=expectedBase(row);compare(E.stats(s),expectedStats(s,base),'full passive coefficients '+selected.join(','));passiveCases++;
}
assert.equal(passiveCases,92);
// All wearers receive the full identical equipment/affix delta, regardless of origin.
const own=fixture.rows.find(r=>r.race==='goblin'&&r.level===60&&r.profile==='q2').state.inventory.find(i=>i.slot==='armor');
let gearCases=0,talentCases=0;
for(const level of [1,20,60,100,101,1000])for(const profile of ['q2','divine']){
 const equipment=fixture.rows.find(r=>r.race==='goblin'&&r.level===level&&r.profile===profile).state.inventory;
 for(const item of equipment)for(const race of E.RACE_KEYS){
  const s=E.fresh(race);s.level=level;const a=E.baseStats(s);s.inventory=[clone(item)];assert(E.equipItem(s,item.id));const b=E.baseStats(s),base=expectedEnhancedBase(item,item.enhancement?.model==='equipment-budget-m2-v1'?item.enhancement.level:0),raw=Object.fromEntries(statKeys.map(k=>[k,base[k]*(item.divine?1.1:1)])),bonus=k=>item.affixes.filter(x=>x.stat===k).reduce((n,x)=>n+x.value*(item.divine?1.1:1),0);
  for(const k of ['hp','armor','atk'])near(b[k]-a[k],Math.round(raw[k]+bonus(k)),`${race}/Lv${level}/${profile}/${item.slot} full gear ${k}`);
  assert(E.validSave(s));gearCases++;
 }
 if(level>1)for(const race of E.RACE_KEYS){
  const s=E.fresh(race);s.level=level;const a=E.baseStats(s);s.talents.heart=1;s.talents.steel=1;const b=E.baseStats(s);near(b.hp-a.hp,20,'full HP talent');near(b.armor-a.armor,3,'full armor talent');assert(E.validSave(s));talentCases++;
 }
}
// Strict raw/identity rejection survives the policy change.
for(const bad of [{...own,hp:own.hp-1},{...own,armor:own.armor-1},{...own,originRace:'human'}]){const s=E.fresh();s.inventory=[bad];const before=JSON.stringify(s);assert(!E.validSave(s));assert.equal(JSON.stringify(s),before);}
// Paid enhancement quotes use the unchanged item base, not the actor multiplier.
for(const race of ['goblin','human']){const s=E.fresh(race);s.gold=1e6;s.inventory=[clone(own)];E.applyForgeFavor(s.inventory[0]);const original=clone(s.inventory[0]);for(const roll of [0,0,.999]){const it=s.inventory[0],level=E.enhancementLevel(it),q=E.quoteEnhancement(s,it.id);assert(q.ok);for(const [key,n]of [['current',level],['success',level+1],['failure',Math.max(0,level-1)]])assert.deepEqual(q.bases[key],expectedEnhancedBase({atk:it.atk,hp:it.hp,armor:it.armor},n));assert(renderFormalEnhancement(s,{itemId:it.id,quote:q}).includes(String(q.bases.current.hp)));assert(E.enhanceEquipment(s,q,()=>roll));for(const k of ['atk','armor','hp','affixes','divine'])assert.deepEqual(s.inventory[0][k],original[k]);assert(E.validSave(s));}}
// Actual App gear detail displays unchanged raw item stats, independent of wearer.
const app=fs.readFileSync('dist/app.js','utf8'),line=name=>app.split('\n').find(l=>l.startsWith('function '+name+'('));
const context=vm.createContext({...E,...EquipmentDisplay,MultiEngine:E,getRacePack,equipmentIcon,equipmentBudgetNotice,renderSetEffects,esc:x=>String(x??''),fmt:formatAttribute,divineBadge:()=>''});
for(const name of ['equipmentLevelTitle','affixHtml','itemDetail'])vm.runInContext(line(name),context);
for(const race of ['goblin','human']){context.s={...E.fresh(race),inventory:[clone(own)]};context.item=own;const html=vm.runInContext('itemDetail(item)',context);for(const [k,name]of [['hp','生命'],['armor','护甲']])assert(html.includes(`<b>${formatAttribute(own[k])}</b><small>${name}</small>`));}
const originalNow=Date.now,originalRandom=Math.random;Date.now=()=>1700000000000;Math.random=()=>.5;
try{
 // Real host max-HP consumer: healing scales from the same max HP shown on panel.
 const s=E.fresh('goblin');s.level=60;s.skillTree.presets[0].unlocked=['goblin.patch_ration'];s.skillTree.presets[0].active=['goblin.patch_ration',null,null,null];E.normalizeHealth(s,s.lastSeen);const max=E.stats(s).hp;s.heroHp=max/2;
 const e=E.startInstanceEncounter(s,'goblin.a01.field',s.lastSeen);assert(e);for(const u of e.enemies){u.nextBasicAt=s.nextActionAt+100000;for(const skill of WORLD_MONSTERS[u.definitionId].skills)u.control.cooldowns[skill.id]=s.nextActionAt+100000;}
 const report=captureCombatDisplay(e,()=>E.step(s,e,s.nextActionAt)),heal=report.events.find(x=>x.targetId==='hero'&&x.skillId==='goblin.patch_ration'&&x.hpDelta>0);assert(heal,'real heal executed');near(heal.hpDelta,max*.12,'actual combat consumes growth-only max HP');near(e.heroHp,max*.62,'actual combat HP');near(characterStatsSnapshot(s).current.hp,max,'combat panel max HP');assert(E.validSave(s));
 // Real physical basic hit: only actor HP/armor are read from the canonical chain.
 const row=fixture.rows.find(r=>r.race==='goblin'&&r.level===60&&r.profile==='q2'),g=clone(row.state);E.normalizeHealth(g,g.lastSeen);const fight=E.startInstanceEncounter(g,'goblin.a01.field',g.lastSeen);assert(fight);const armor=characterStatsSnapshot(g).current.armor;
 for(const u of fight.enemies){assert.equal(WORLD_MONSTERS[u.definitionId].basicAttackType??'physical','physical');u.hp=u.max=1e8;u.atk=1000;u.nextBasicAt=g.nextActionAt;for(const skill of WORLD_MONSTERS[u.definitionId].skills)u.control.cooldowns[skill.id]=g.nextActionAt+100000;}
 const hits=captureCombatDisplay(fight,()=>E.step(g,fight,g.nextActionAt)).events.filter(x=>x.targetId==='hero'&&x.hpDelta<0&&x.skillId==='basic');assert(hits.length>0);for(const hit of hits)near(-hit.hpDelta,Math.max(1,Math.round(1000*100/(100+armor))),'actual physical mitigation equals panel armor');assert(E.validSave(g));
 // Naked level-one real first dungeon; no free equipment, talents, skills or healing.
 let rng=7919;Math.random=()=>((rng=Math.imul(rng,1664525)+1013904223>>>0)/2**32);
 const naked=E.fresh('goblin');E.normalizeHealth(naked,naked.lastSeen);assert.equal(naked.inventory.length,0);const stages=[];
 for(let stage=1;stage<=3;stage++){
  const e=E.startInstanceEncounter(naked,'goblin.a01.dungeon',Math.max(naked.lastHealthClock,naked.nextBattleAt??0));assert(e);assert.equal(e.dungeonStage,stage);
  while(!e.done&&e.round<1500)E.step(naked,e,naked.nextActionAt);assert(e.done);assert(E.validSave(naked));stages.push({stage,win:e.win,rounds:e.round,heroHp:e.heroHp});
  if(stage===1){assert(e.win,'naked first dungeon opening still winnable');assert.equal(e.round,4);near(e.heroHp,111.6637,'naked first-stage surviving HP');}
  if(!e.win)break;E.reward(naked,e,naked.lastHealthClock);assert(Object.values(naked.equip).every(x=>x===null),'loot never auto-equips');assert(E.validSave(naked));
 }
 // This one-seed no-skills/no-potions control is not a full-dungeon clear claim.
 assert.deepEqual(stages.map(x=>x.win),[true,true,false]);console.log('Naked Lv1 first dungeon, seed7919:',JSON.stringify(stages));
}finally{Date.now=originalNow;Math.random=originalRandom;}
console.log(`PASS latest Goblin growth-only HP11.2/armor0.7 per level; fixed120HP/5armor: ${affected} exact-release Goblin fixtures,${controls} other-race controls,Lv1..1000,${passiveCases} all-passive combinations,${gearCases} cross-race full-gear deltas,${talentCases} full-talent deltas,unchanged rawgear/racialATK/poison,8 exact4%→5%enhancement reconciliations,strict saves/HP cap,enhancement/detail and real combat HP/armor=panel.`);
