// Latest user target supersedes the discarded equipment-only candidate.
import assert from 'node:assert/strict';
import fs from 'node:fs';import vm from 'node:vm';import {createHash} from 'node:crypto';
import * as E from './dist/engine.js';
import {GOBLIN_SURVIVAL_MULTIPLIERS} from './dist/race-survival-balance.js';
import {derivePassiveStats} from './dist/skill-tree-passives.js';
import {getRacePack} from './dist/race-registry.js';
import {WORLD_MONSTERS} from './dist/world-content.js';
import {captureCombatDisplay} from './dist/combat-display-bridge.js';
import {characterStatsSnapshot,renderCharacterStats} from './dist/character-stats-ui.js';
import {enhanceRawBase} from './dist/equipment-budget.js';
import {validItemBudgetMetadata,equipmentBudgetNotice} from './dist/equipment-budget-adapter.js';
import {renderFormalEnhancement} from './dist/equipment-enhancement-ui.js';
import * as EquipmentDisplay from './dist/equipment-display.js';
import {equipmentIcon} from './dist/equipment-art.js';import {renderSetEffects} from './dist/set-effects.js';
import {formatAttribute} from './dist/attribute-format.js';
const path='fixtures/goblin-total-survival-v0812-baseline.json',bytes=fs.readFileSync(path),fixture=JSON.parse(bytes),clone=x=>structuredClone(x);
assert.equal(createHash('sha256').update(bytes).digest('hex'),'b5e063ab84ab0b4f06dd77d5fad7a15a0e31e3af7743ff7231931c54c4da8f4a','frozen exact v0.81.1 inputs/outputs, not regenerated from candidate');
assert.equal(fixture.sourceCommit,'812e4e35');assert.equal(fixture.rows.length,208);assert.deepEqual(GOBLIN_SURVIVAL_MULTIPLIERS,{hp:.8,armor:.7});
for(const [name,digest]of Object.entries(fixture.sourceHashes))assert.equal(createHash('sha256').update(fs.readFileSync(name)).digest('hex'),digest,'unchanged gear/attack/poison/passives '+name);
assert(!fs.existsSync('dist/equipment-base-balance.js'),'discarded gear-only policy removed, never stacked');
const near=(actual,expected,label)=>assert(Math.abs(actual-expected)<1e-8,`${label}: ${actual} != ${expected}`);
function compare(actual,before,race,label){
 near(actual.hp,before.hp*(race==='goblin'?.8:1),label+' HP');near(actual.armor,before.armor*(race==='goblin'?.7:1),label+' armor');
 const a={...actual},b={...before};delete a.hp;delete a.armor;delete b.hp;delete b.armor;assert.deepEqual(a,b,label+' every other stat unchanged');
}
let affected=0,controls=0;
for(const row of fixture.rows){
 const s=clone(row.state),before=JSON.stringify(s);assert(E.validSave(s),'current valid before read');
 compare(E.baseStats(s),row.base,row.race,`${row.race}/${row.level}/${row.profile} base`);compare(E.stats(s),row.stats,row.race,`${row.race}/${row.level}/${row.profile} final`);
 const panel=characterStatsSnapshot(s);assert.deepEqual(panel.current,E.stats(s));assert.deepEqual(panel.permanent,E.stats(s));
 assert(renderCharacterStats(s).includes(formatAttribute(E.stats(s).hp)));assert.equal(JSON.stringify(s),before,'stat reads and UI do not rewrite equipment');
 for(const it of s.inventory){assert(validItemBudgetMetadata(it));const raw={atk:it.atk,armor:it.armor,hp:it.hp},base=it.enhancement?.model==='equipment-budget-m2-v1'?enhanceRawBase(raw,it.enhancement.level):raw;assert.deepEqual(E.itemTotals(it),Object.fromEntries(Object.entries(base).map(([k,v])=>[k,v*(it.divine?1.1:1)])),'item has NO racial cut');}
 const expected=clone(s);expected.heroHp=Math.min(expected.heroHp,E.stats(s).hp);assert(E.normalizeHealth(s,s.lastHealthClock));assert.deepEqual(s,expected,'only existing health cap, no save migration');assert(E.validSave(s));
 row.race==='goblin'?affected++:controls++;
}
assert.equal(affected,80);assert.equal(controls,128);
// Level gain remains reduced forever, including beyond the existing item-budget cap.
for(const level of [1,20,60,100,101,150,250,1000]){const s=E.fresh('goblin');s.level=level;const a=E.stats(s);s.level++;const b=E.stats(s);near(b.hp-a.hp,11.2,'naked HP per level');near(b.armor-a.armor,.7,'naked armor per level');assert.equal(b.atk-a.atk,3,'attack growth unchanged');}
// Every available Goblin/common passive alone and every legal two-slot pair.
const ids=Object.keys(getRacePack('goblin').passives),selections=[[],...ids.map(id=>[id]),...ids.flatMap((id,i)=>ids.slice(i+1).map(other=>[id,other]))];let passiveCases=0;
for(const level of [60,150])for(const selected of selections){
 const row=fixture.rows.find(r=>r.race==='goblin'&&r.level===level&&r.profile==='q2'),s=clone(row.state),p=s.skillTree.presets[0];p.unlocked=[...selected];p.passive=[...selected,...Array(2-selected.length).fill(null)];assert(E.validSave(s));
 const context=E.treePassiveContext(s),before=derivePassiveStats(row.base,context,{currentHp:row.base.hp}).stats;compare(E.stats(s),before,'goblin','passives '+selected.join(','));passiveCases++;
}
assert.equal(passiveCases,92);
// All wearers share unchanged item numbers; actor-only adjustment follows the wearer.
const own=fixture.rows.find(r=>r.race==='goblin'&&r.level===60&&r.profile==='q2').state.inventory.find(i=>i.slot==='armor');
for(const race of E.RACE_KEYS){const s=E.fresh(race);s.level=60;const a=E.baseStats(s);s.inventory=[clone(own)];assert(E.equipItem(s,own.id));const b=E.baseStats(s),bonus=k=>own.affixes.filter(x=>x.stat===k).reduce((n,x)=>n+x.value,0);near(b.hp-a.hp,(own.hp+bonus('hp'))*(race==='goblin'?.8:1),'cross-wear HP');near(b.armor-a.armor,(own.armor+bonus('armor'))*(race==='goblin'?.7:1),'cross-wear armor');assert(E.validSave(s));}
// Strict raw/identity rejection survives the policy change.
for(const bad of [{...own,hp:own.hp-1},{...own,armor:own.armor-1},{...own,originRace:'human'}]){const s=E.fresh();s.inventory=[bad];const before=JSON.stringify(s);assert(!E.validSave(s));assert.equal(JSON.stringify(s),before);}
// Paid enhancement quotes use the unchanged item base, not the actor multiplier.
for(const race of ['goblin','human']){const s=E.fresh(race);s.gold=1e6;s.inventory=[clone(own)];E.applyForgeFavor(s.inventory[0]);const original=clone(s.inventory[0]);for(const roll of [0,0,.999]){const it=s.inventory[0],level=E.enhancementLevel(it),q=E.quoteEnhancement(s,it.id);assert(q.ok);for(const [key,n]of [['current',level],['success',level+1],['failure',Math.max(0,level-1)]])assert.deepEqual(q.bases[key],enhanceRawBase({atk:it.atk,hp:it.hp,armor:it.armor},n));assert(renderFormalEnhancement(s,{itemId:it.id,quote:q}).includes(String(q.bases.current.hp)));assert(E.enhanceEquipment(s,q,()=>roll));for(const k of ['atk','armor','hp','affixes','divine'])assert.deepEqual(s.inventory[0][k],original[k]);assert(E.validSave(s));}}
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
 const report=captureCombatDisplay(e,()=>E.step(s,e,s.nextActionAt)),heal=report.events.find(x=>x.targetId==='hero'&&x.skillId==='goblin.patch_ration'&&x.hpDelta>0);assert(heal,'real heal executed');near(heal.hpDelta,max*.12,'actual combat consumes reduced max HP');near(e.heroHp,max*.62,'actual combat HP');near(characterStatsSnapshot(s).current.hp,max,'combat panel max HP');assert(E.validSave(s));
 // Real physical basic hit: only actor HP/armor are read from the canonical chain.
 const row=fixture.rows.find(r=>r.race==='goblin'&&r.level===60&&r.profile==='q2'),g=clone(row.state);E.normalizeHealth(g,g.lastSeen);const fight=E.startInstanceEncounter(g,'goblin.a01.field',g.lastSeen);assert(fight);const armor=characterStatsSnapshot(g).current.armor;
 for(const u of fight.enemies){assert.equal(WORLD_MONSTERS[u.definitionId].basicAttackType??'physical','physical');u.hp=u.max=1e8;u.atk=1000;u.nextBasicAt=g.nextActionAt;for(const skill of WORLD_MONSTERS[u.definitionId].skills)u.control.cooldowns[skill.id]=g.nextActionAt+100000;}
 const hits=captureCombatDisplay(fight,()=>E.step(g,fight,g.nextActionAt)).events.filter(x=>x.targetId==='hero'&&x.hpDelta<0&&x.skillId==='basic');assert(hits.length>0);for(const hit of hits)near(-hit.hpDelta,Math.max(1,Math.round(1000*100/(100+armor))),'actual physical mitigation equals panel armor');assert(E.validSave(g));
}finally{Date.now=originalNow;Math.random=originalRandom;}
console.log(`PASS latest Goblin TOTAL HP×0.8/armor×0.7: ${affected} exact-release Goblin fixtures,${controls} other-race controls,Lv1..1000,${passiveCases} all-passive combinations,unchanged gear/ATK/poison,strict saves/HP cap,enhancement/detail and real combat HP/armor=panel.`);
