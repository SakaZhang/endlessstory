import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRequire} from 'node:module';
import * as E from './dist/engine.js';
import {createLegendaryEquipment,validLegendaryEquipmentMetadata,LEGENDARY_EQUIPMENT_DEFINITIONS} from './dist/legendary-equipment.js';
import {LUCKY_DICE_ID,LUCKY_DICE_FIXED_BASE,LUCKY_DICE_CODEX,rollLuckyDice,equippedLuckyDice,luckyDiceStatBonuses,validLuckyDiceOutcome} from './dist/lucky-dice.js';
import {LEGENDARY_DROP_CANDIDATES,prepareLegendaryDrop} from './dist/legendary-drop.js';
import {equipmentIcon} from './dist/equipment-art.js';
import {equipmentDisplayQuality} from './dist/equipment-display.js';
import {renderCodex} from './dist/codex-ui.js';
import {auditEquipmentCatalog,PARITY_RACES} from './equipment-catalog-audit.mjs';
const clone=structuredClone;
const factory=level=>createLegendaryEquipment({id:'dice-'+level,legendaryId:LUCKY_DICE_ID,level,random:()=>{throw Error('Fixed necklace must not roll attributes');}});
for(const level of [1,33,100,1000,1e12]){
 const it=factory(level);assert(it);assert(validLegendaryEquipmentMetadata(it,E.AFFIX_DEFS));
 assert.deepEqual(Object.fromEntries(['atk','armor','hp'].map(k=>[k,it[k]])),LUCKY_DICE_FIXED_BASE);
 assert.deepEqual(it.affixes,[]);assert.equal(it.special,null);assert.equal(it.set,null);assert.equal(it.originRace,null);assert.equal(it.slot,'amulet');assert.equal(it.rarity,3);assert.equal(equipmentDisplayQuality(it),4);
 assert.deepEqual(luckyDiceStatBonuses(it),{luck:33,crit:33});
 for(const mutate of [x=>x.atk++,x=>x.hp++,x=>x.armor++,x=>x.exclusive.id='multicast',x=>x.special={id:'combo'},x=>x.affixes=[{stat:'luck',value:33}],x=>x.slot='ring',x=>x.originRace='goblin',x=>x.rarity=2]){const bad=clone(it);mutate(bad);assert(!validLegendaryEquipmentMetadata(bad,E.AFFIX_DEFS));}
}
assert.deepEqual(luckyDiceStatBonuses({legendaryId:'return-ring'}),{luck:0,crit:0});
assert.equal(factory(0),null);assert.equal(factory(Infinity),null);
// Thresholds are half-open: [0,.33), [.33,.66), [.66,.99), [.99,1).
for(const [roll,outcome,multiplier,fixedDamage] of [[0,'low',.75,null],[.32999999999999996,'low',.75,null],[.33,'high',1.25,null],[.6599999999999999,'high',1.25,null],[.66,'normal',1,null],[.9899999999999999,'normal',1,null],[.99,'jackpot',1,3333],[1-Number.EPSILON,'jackpot',1,3333]]){
 let draws=0;const result=rollLuckyDice(()=>{draws++;return roll;});assert.deepEqual(result,{outcome,multiplier,fixedDamage});assert.equal(draws,1);assert(validLuckyDiceOutcome(result));for(const patch of [{multiplier:999},{fixedDamage:111},{outcome:'fake'},{extra:1}])assert(!validLuckyDiceOutcome({...result,...patch}));
}
for(const value of [null,undefined,[],{},true,0,'jackpot'])assert(!validLuckyDiceOutcome(value));
for(const n of [-1,1,Infinity,-Infinity,NaN,undefined,'0.3'])assert.throws(()=>rollLuckyDice(()=>n),RangeError);
const counts=()=>({low:0,high:0,normal:0,jackpot:0}),stratified=counts();for(let i=0;i<10000;i++)stratified[rollLuckyDice(()=>(i+.5)/10000).outcome]++;assert.deepEqual(stratified,{low:3300,high:3300,normal:3300,jackpot:100});
let seed=0x5eedcafe;const seeded=counts();for(let i=0;i<10000;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;seeded[rollLuckyDice(()=>seed/4294967296).outcome]++;}assert.deepEqual(seeded,{low:3287,high:3327,normal:3278,jackpot:108});
// All races use the normal amulet socket, collection ledger, save and stats path.
for(const race of PARITY_RACES){
 const s=E.fresh(race),before=E.baseStats(s),it=E.legendaryItem(LUCKY_DICE_ID,33,{levelSource:'generated'});assert(it);s.inventory.push(it);assert(E.validSave(s));assert.equal(equippedLuckyDice(s),null);assert(E.equipItem(s,it.id));assert.equal(equippedLuckyDice(s),it);
 const after=E.baseStats(s);assert.equal(after.atk-before.atk,33);assert(Math.abs(after.hp-before.hp-333)<1e-9);assert.equal(after.luck-before.luck,33);assert.equal(after.critRating-before.critRating,33);assert.equal(after.armor,before.armor);assert.deepEqual(after.specials,before.specials);
 assert(E.recordCollectedEquipment(s,it));assert(E.codexState(s,LUCKY_DICE_ID).collected);assert(E.validSave(JSON.parse(JSON.stringify(s))));
 const html=renderCodex(s,{tab:'legends',selectedLegend:LUCKY_DICE_ID});for(const text of ['幸运骰子','幸运 +33','攻击 +33','生命 +333','暴击等级 +33','33%造成75%','33%造成125%','33%造成100%','1%造成固定3333','仅赌场抽奖1%'])assert(html.includes(text),text);
 assert.equal(E.getReforgeCost(it,'all',s),null);assert.equal(E.getReforgeCost(it,'value',s),null);assert.equal(E.reforge(s,it.id,'all'),null);
 const naked=clone(s);naked.equip.amulet=null;assert.equal(equippedLuckyDice(naked),null);assert.equal(E.baseStats(naked).luck,before.luck);
}
// Existing enhancement remains available; fixed luck/crit never grow with it.
{const s=E.fresh(),it=E.legendaryItem(LUCKY_DICE_ID,33);s.inventory.push(it);s.gold=1e9;const q=E.quoteEnhancement(s,it.id);assert(q.ok);assert(E.enhanceEquipment(s,q,()=>0).success);const owned=s.inventory.find(x=>x.id===it.id);assert.deepEqual(luckyDiceStatBonuses(owned),{luck:33,crit:33});assert.equal(owned.atk,33);assert.equal(owned.hp,333);assert(E.itemTotals(owned).atk>33);assert(E.validSave(s));}
const oldIds=['infinity-gauntlet','return-ring','human-oathblade','human-banner-armor','elf-sixfold-heartwood','elf-last-string','goblin-silent-ration','goblin-silent-steps','ashen-molten-core','ashen-stone-core','ashen-crystal-core','ashen-primal-core','first-forge-oathhammer','everburning-reactor'];
assert.deepEqual(Object.keys(LEGENDARY_EQUIPMENT_DEFINITIONS).filter(id=>id!==LUCKY_DICE_ID),oldIds);assert.equal(E.LEGENDARY_CODEX.length,15);assert.deepEqual(E.LEGENDARY_CODEX.at(-1),LUCKY_DICE_CODEX);
const report=auditEquipmentCatalog();assert(report.passed,report.errors.join('\n'));assert.deepEqual(report.totals,{common:260,ordinary:263,sets:60,legends:15,definitions:338});assert.deepEqual(report.casinoOnly,[LUCKY_DICE_ID]);assert.equal(report.matrix.goblin.common,52);assert.equal(report.matrix.goblin.setParts,12);assert.equal(report.matrix.goblin.legends,2);
// Successful normal legendary rolls can select every existing boss candidate,
// never the casino identity. All non-boss source descriptors stay ineligible.
for(const [race,pool] of Object.entries(LEGENDARY_DROP_CANDIDATES)){
 assert(!pool.some(x=>x.id===LUCKY_DICE_ID));
 for(let i=0;i<pool.length;i++){let n=0;const r=prepareLegendaryDrop({settlementId:'test',nodeId:race+'.a03.boss',regionRace:race,kind:'boss',won:true},{probability:1,random:()=>n++===0?0:(i+.5)/pool.length});assert.equal(r.legendaryId,pool[i].id);assert.equal(n,2);}
 for(const kind of ['field','dungeon','merchant','forge']){const r=prepareLegendaryDrop({settlementId:'test',nodeId:race+'.a03.boss',regionRace:race,kind,won:true},{probability:1,random:()=>{throw Error('Ineligible source rolled');}});assert.equal(r.outcome,'ineligible');}
}
assert(!Object.hasOwn(E.SPECIALS,'lucky-dice-roll'));assert(!Object.hasOwn(E.SPECIALS,LUCKY_DICE_ID));
// Production artwork is native vector like the existing Return Ring fallback.
const it=factory(33);for(const size of [32,48,64]){const svg=equipmentIcon(it,{size});assert.match(svg,/data-equipment-art="lucky-dice"/);assert.match(svg,/data-equipment-quality="4"/);assert.match(svg,/aria-label="幸运骰子"/);assert(svg.includes(`width="${size}" height="${size}"`));assert(!svg.includes('data-equipment-template='));assert.notEqual(svg,equipmentIcon({slot:'amulet',rarity:3},{size}));}
// Decode the actual production SVG for viewable QA; this does not author art.
const {createCanvas,loadImage}=createRequire(import.meta.url)('@napi-rs/canvas');const canvas=createCanvas(280,110),ctx=canvas.getContext('2d');ctx.fillStyle='#17232b';ctx.fillRect(0,0,280,110);ctx.imageSmoothingEnabled=false;for(const [i,size] of [32,48,64].entries()){const svg=equipmentIcon(it,{size}),image=await loadImage(Buffer.from(svg));ctx.drawImage(image,12+i*86,18,size,size);}fs.mkdirSync('qa/lucky-dice',{recursive:true});fs.writeFileSync('qa/lucky-dice/icon-proof.png',canvas.toBuffer('image/png'));
console.log('PASS Lucky Dice: fixed level-independent stats/no random affixes, exact RNG edges, 10000 stratified + seeded draws, all five race stats/equip/save/codex, standard enhancement, unchanged 14 legends and Goblin matrix, boss-source isolation, distinct native SVG32/48/64. Seed distribution:',seeded);
