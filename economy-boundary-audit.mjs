import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as E from './dist/engine.js';
import {VARIANTS,deriveEquipmentBase,budgetAt} from './dist/equipment-budget.js';
import {combinedFavorableRollChance} from './dist/dwarf-forge-favor.js';
import {DWARF_FORGE_FAVOR_CONFIG} from './dist/dwarf-forge-favor-config.js';
import {WORLD_MONSTERS,monsterParameters} from './dist/world-content.js';
const output={scope:'Exact budget/expected-currency boundary audit, not natural progression or a human playtime model.',equipment:[],forge:[],a01:[]};
// Every registered base variant, equal enhancement. Rounding and differing
// affixes can change an actual item's desirability; this is only base budget.
let cases=0;for(const [variant,v] of Object.entries(VARIANTS))for(const level of [1,10,20,30,50,80,100])for(const enhancement of [0,1,3,5])for(let quality=0;quality<4;quality++){
 const raw=deriveEquipmentBase({slot:v.slot,baseVariant:variant,level,quality,enhancement});assert(Object.values(raw).every(Number.isFinite));cases++;
 if(level<=80&&quality===3){for(const [replacementQuality,delta] of [[0,14],[1,11],[2,7]]){assert(Math.abs(budgetAt({slot:v.slot,level,quality,enhancement})-budgetAt({slot:v.slot,level:level+delta,quality:replacementQuality,enhancement}))<1e-8);const later=deriveEquipmentBase({slot:v.slot,baseVariant:variant,level:level+delta,quality:replacementQuality,enhancement});assert.deepEqual(raw,later);} }
}
output.equipment={cases,variants:Object.keys(VARIANTS).length,slots:[...new Set(Object.values(VARIANTS).map(v=>v.slot))],equalBaseBudgetQ3:{Q0:14,Q1:11,Q2:7},caveat:'Equal enhancement and same base variant; randomized affix utility, special effects, set/weapon synergies and capped level100 change replacement decisions. 10–20 level changes are a distribution target, not guaranteed lifetime.'};
// Bought-material -> forge -> sale expected return. Enumerate every homogeneous
// quality/count, cheapest eligible merchant material, and maximal legal luck.
for(const race of E.RACE_KEYS)for(const level of [1,20,50,80,100])for(let quality=0;quality<4;quality++)for(let count=1;count<=5;count++){
 const entries=E.merchantMaterialKeys().filter(m=>E.materialKey(m,quality));const cheapest=entries.sort((a,b)=>E.materialPrice(a,quality)-E.materialPrice(b,quality))[0];const material=E.materialKey(cheapest,quality),weights=E.fusionQualityWeights(Array(count).fill(material)),sum=weights.reduce((a,b)=>a+b,0),p=weights.map(x=>x/sum);let cumulative=0,prior=0;const second=combinedFavorableRollChance(E.luckChance(1000),race,DWARF_FORGE_FAVOR_CONFIG),distribution=p.map(prob=>{cumulative+=prob;const cdf=(1-second)*cumulative+second*cumulative*cumulative;const mass=cdf-prior;prior=cdf;return mass;});
 const levels=Array.from({length:level+2-Math.max(1,level-2)+1},(_,i)=>Math.max(1,level-2)+i),expectedLevelSale=levels.reduce((n,lv)=>n+Math.floor(lv/3)/levels.length,0),expectedSale=expectedLevelSale+distribution.reduce((n,p,q)=>n+p*[2,4,8,16][q],0),cost=E.racialGoldCost({race},40)+count*E.racialGoldCost({race},E.materialPrice(cheapest,quality));
 assert(expectedSale<cost,`positive expected bought-material forge sale ${race}/${level}/${quality}/${count}`);output.forge.push({race,level,quality,count,cheapest,cost,expectedSale,expectedLoss:cost-expectedSale});
}
// Reroll/upgrade loops always consume gear/materials or currency. They are not
// riskless currency creation; a lucky Q3 sale may exceed just the forge fee.
for(const race of E.RACE_KEYS){const elite=Object.values(WORLD_MONSTERS).find(m=>m.id.startsWith(race+'.')&&m.area===1&&m.rank==='elite');output.a01.push({race,elite:elite.id,...monsterParameters(elite.id)});}
output.forgeSummary={cases:output.forge.length,minimumExpectedLoss:Math.min(...output.forge.map(r=>r.expectedLoss)),maximumExpectedLoss:Math.max(...output.forge.map(r=>r.expectedLoss)),scope:'Level1–100, bought homogeneous material batches1–5, maximum legal luck, full racial best-of-two. Ignores herb potion conversions (no sale), so bounds sale income upward. Not exhaustive mixed gear/material conversion or a proof over legacy levels above100.'};
if(process.argv[2])fs.writeFileSync(process.argv[2],JSON.stringify(output,null,2)+'\n');console.log(JSON.stringify({equipment:output.equipment,forge:output.forgeSummary,a01:output.a01.map(({race,hp,atk,elementalPower,rewardXp})=>({race,hp,atk,elementalPower,rewardXp}))},null,2));
