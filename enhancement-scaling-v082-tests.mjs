import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
import {CONFIG,VARIANTS,budgetAt,deriveEquipmentBase,enhanceRawBase,enhancementFee} from './dist/equipment-budget.js';
import {enhancedItemBase} from './dist/equipment-enhancement.js';
import {LEGENDARY_EQUIPMENT_DEFINITIONS} from './dist/legendary-equipment.js';
import {luckyDiceStatBonuses} from './dist/lucky-dice.js';
import {characterStatsSnapshot,renderCharacterStats} from './dist/character-stats-ui.js';
import {renderFormalEnhancement} from './dist/equipment-enhancement-ui.js';
const clone=structuredClone,keys=['atk','armor','hp'],raw=it=>Object.fromEntries(keys.map(k=>[k,it[k]]));
const expected=(base,level)=>Object.fromEntries(keys.map(k=>[k,Math.round(base[k]*(1+level*.05))]));
const near=(a,b,label='numeric equality')=>assert(Math.abs(a-b)<1e-8,`${label}: ${a} != ${b}`);
const levels=[0,1,2,3,4,5],stamp=(it,level)=>({...clone(it),enhancement:{version:2,model:CONFIG.id,level}});
assert.equal(CONFIG.enhancementPerLevel,.05);assert.equal(CONFIG.enhancementMax,5);
assert.deepEqual(CONFIG.successRates,[.9,.8,.6,.4,.2]);assert.deepEqual(CONFIG.feeWeights,[1,2,3,5,8]);
let scalarCases=0,itemCases=0,combatCases=0;
// Independent direct formula: never compound or force +1 on a small rounded stat.
for(const base of [{atk:0,armor:0,hp:0},{atk:1,armor:1,hp:1},{atk:2,armor:3,hp:4},{atk:9,armor:10,hp:11},{atk:120,armor:0,hp:106},{atk:33,armor:0,hp:333},{atk:1e12,armor:999999999999,hp:987654321098}])for(const level of levels){const before=JSON.stringify(base);assert.deepEqual(enhanceRawBase(base,level),expected(base,level));assert.equal(JSON.stringify(base),before);scalarCases++;}
assert.deepEqual(enhanceRawBase({atk:1,armor:0,hp:0},5),{atk:1,armor:0,hp:0});
assert.deepEqual(enhanceRawBase({atk:120,armor:0,hp:106},3),{atk:138,armor:0,hp:122});
assert.deepEqual(levels.map(n=>enhanceRawBase({atk:120,armor:0,hp:0},n).atk),[120,126,132,138,144,150]);
for(const [baseVariant,v] of Object.entries(VARIANTS))for(const level of [1,20,100])for(let quality=0;quality<=4;quality++)for(const enhancement of levels){const base=deriveEquipmentBase({slot:v.slot,baseVariant,level,quality});assert.deepEqual(deriveEquipmentBase({slot:v.slot,baseVariant,level,quality,enhancement}),expected(base,enhancement));near(budgetAt({slot:v.slot,level,quality,enhancement})/budgetAt({slot:v.slot,level,quality}),1+enhancement*.05);scalarCases++;}
// Actual generated ordinary/set/all legendary identities; raw budgets/affixes never migrate.
const sets={human:'human_blood_oath',dwarf:'anvil',elf:'elf_arrow',goblin:'goblin_spore',ashen:'ashen.caldera'};
for(const race of E.RACE_KEYS){
 const candidates=[...Array.from({length:4},(_,quality)=>E.item('ring',60,null,quality,{originRace:race})),E.item('armor',60,sets[race],3,{originRace:race}),...Object.entries(LEGENDARY_EQUIPMENT_DEFINITIONS).filter(([,d])=>!d.originRace||d.originRace===race).map(([id])=>E.legendaryItem(id,60))];
 for(const original of candidates)for(const divine of [false,true])for(const level of levels){
  assert(original);const it=stamp(original,level);if(divine)E.applyForgeFavor(it);const s=E.fresh(race);s.level=60;s.gold=1e9;s.inventory=[it];const ledger={'infinity-gauntlet':'infinityGauntlet','return-ring':'returnRing'}[it.legendaryId];if(ledger)s[ledger]={version:1,recipeLearned:true,crafted:true,craftedItemId:it.id};assert(E.equipItem(s,it.id));E.normalizeHealth(s,s.lastSeen);const before=JSON.stringify(s),base=expected(raw(it),level),totals=E.itemTotals(it);
  assert.deepEqual(enhancedItemBase(it),base);for(const k of keys)near(totals[k],base[k]*(divine?1.1:1));assert.deepEqual(raw(it),raw(original));assert.deepEqual(it.affixes,original.affixes);assert(E.validSave(s),`${race}/${it.legendaryId??it.set??'ordinary'}/${level}/${divine}`);
  const panel=characterStatsSnapshot(s);assert.deepEqual(panel.current,E.stats(s));assert.deepEqual(panel.permanent,E.stats(s));assert(renderCharacterStats(s).includes(String(Math.round(E.stats(s).hp))));assert.equal(JSON.stringify(s),before,'panel reads do not rewrite raw stats or save');
  const restored=JSON.parse(before);assert(E.validSave(restored));assert.deepEqual(E.itemTotals(restored.inventory[0]),totals);assert.deepEqual(E.stats(restored),E.stats(s));
  const q=E.quoteEnhancement(s,it.id);if(level===5)assert.equal(q.reason,'at-maximum');else{assert(q.ok);assert.equal(q.baseSuccessRate,CONFIG.successRates[level]);assert.equal(q.cost.gold,E.racialGoldCost(s,enhancementFee({level:it.level,quality:it.legendaryId?4:it.rarity,target:level+1})));for(const [label,n]of [['current',level],['success',level+1],['failure',Math.max(0,level-1)]])assert.deepEqual(q.bases[label],expected(raw(it),n));assert(renderFormalEnhancement(s,{itemId:it.id,quote:q}).includes('+5% / +10% / +15% / +20% / +25%'));const state=clone(s),receipt=E.enhanceEquipment(state,E.quoteEnhancement(state,it.id),()=>0);assert(receipt.success);assert.deepEqual(raw(state.inventory[0]),raw(it));assert.deepEqual(state.inventory[0].affixes,it.affixes);assert.deepEqual(E.itemTotals(state.inventory[0]),Object.fromEntries(keys.map(k=>[k,expected(raw(it),level+1)[k]*(divine?1.1:1)])));assert(E.validSave(state));}
  if(it.legendaryId==='lucky-dice'){assert.deepEqual(raw(it),{atk:33,armor:0,hp:333});assert.deepEqual(luckyDiceStatBonuses(it),{luck:33,crit:33});const naked=clone(s);naked.equip.amulet=null;assert.equal(E.stats(s).luck-E.stats(naked).luck,33);assert.equal(E.stats(s).critRating-E.stats(naked).critRating,33);}
  itemCases++;
 }
}
// Real production combat consumes the same enhanced ATK/maxHP as the panel.
// Each race runs +0..+5, with/without divine, ordinary and fixed Lucky Dice.
for(const race of E.RACE_KEYS)for(const level of levels)for(const divine of [false,true])for(const dice of [false,true]){
 const s=E.fresh(race);s.level=60;s.skills=[null,null,null,null];s.skillTree.presets[0].active=[null,null,null,null];s.skillTree.presets[0].passive=[null,null];const it=stamp(dice?E.legendaryItem('lucky-dice',33):E.item('ring',60,null,0,{originRace:race}),level);if(divine)E.applyForgeFavor(it);s.inventory=[it];assert(E.equipItem(s,it.id));E.normalizeHealth(s,s.lastSeen);const before=JSON.stringify(it),panel=characterStatsSnapshot(s).current,e=E.startInstanceEncounter(s,race+'.a01.field',s.lastSeen);assert(e);near(e.heroHp,panel.hp,'starting combat HP equals panel');
 for(const u of e.enemies){u.hp=u.max=1000000;u.armor=u.atk=u.shield=0;u.control.stunUntil=1e12;}e.rngState=1;E.step(s,e,s.nextActionAt);assert.equal(e.lastCast.skillId,'basic');assert(e.lastCast.hits[0].hit);const diceMultiplier=dice?1.25:1;if(dice)assert.equal(e.lastCast.luckyDice.outcome,'high');near(e.lastCast.hits[0].actualHpLost,Math.max(1,Math.round(panel.atk*diceMultiplier)),'actual basic hit reads enhanced panel attack');assert.equal(JSON.stringify(s.inventory[0]),before);assert.deepEqual(characterStatsSnapshot(s).current,E.stats(s));assert(E.validSave(s));combatCases++;
}
console.log(`PASS v082 enhancement: ${scalarCases} independent exact5% scalar/budget cases; ${itemCases} five-race ordinary/set/all-legend level0..5 +/-divine, raw-save and quote/transaction cases; ${combatCases} real panel/basic-combat cases; Lucky Dice33/333 scales, luck/crit33 fixed.`);
