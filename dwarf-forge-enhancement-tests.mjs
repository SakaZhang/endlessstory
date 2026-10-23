import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
import {quoteEnhancement,prepareEnhancement,attemptEnhancement,FORMAL_ENHANCEMENT_CONFIG,quoteDeveloperEnhancement} from './dist/equipment-enhancement.js';
const make=()=>{const s=E.fresh();s.gold=100000;return s;};
for(let level=0;level<5;level++){
 const dwarf=make(),it=dwarf.inventory[0];it.enhancement={version:2,model:FORMAL_ENHANCEMENT_CONFIG.id,level};const human=structuredClone(dwarf);human.race='human';
 const dq=quoteEnhancement(dwarf,it.id),hq=quoteEnhancement(human,it.id);assert(dq.ok&&hq.ok);assert.equal(dq.baseSuccessRate,FORMAL_ENHANCEMENT_CONFIG.successRates[level]);assert.equal(dq.finalSuccessRate,dq.baseSuccessRate+.02);assert.equal(dq.successRate,dq.finalSuccessRate);assert.equal(hq.successRate,hq.baseSuccessRate);assert.deepEqual(dq.cost,hq.cost);assert.deepEqual(dq.bases,hq.bases);
 const roll=dq.baseSuccessRate+.01;assert(prepareEnhancement(dwarf,dq,()=>roll).receipt.success);assert.equal(prepareEnhancement(human,hq,()=>roll).receipt.success,false);
 const failQuote=quoteEnhancement(dwarf,it.id),failed=prepareEnhancement(dwarf,failQuote,()=>.999);assert.equal(failed.receipt.toLevel,Math.max(0,level-1));assert.equal(failed.state.gold,dwarf.gold-dq.cost.gold);
 dwarf.talents.luck=999;const lucky=quoteEnhancement(dwarf,it.id);assert.equal(lucky.successRate,dq.successRate,'luck does not affect enhancement');
}
const s=make(),id=s.inventory[0].id,q=quoteEnhancement(s,id),before=JSON.stringify(s);let draws=0;const first=prepareEnhancement(s,q,()=>{draws++;return .91;});assert(first.ok);try{({setItem(){throw Error('quota');}}).setItem('key',JSON.stringify(first.state));}catch{}assert.equal(JSON.stringify(s),before);
s.heroHp=1;s.lastHealthClock+=1000;const retry=prepareEnhancement(s,q,()=>{throw Error('must reuse prepared roll');});assert.equal(draws,1);assert.deepEqual(retry.receipt,first.receipt);assert.equal(retry.state.heroHp,1);assert.equal(retry.state.lastHealthClock,s.lastHealthClock);
const paid=attemptEnhancement(s,q,()=>{throw Error('must reuse receipt');});assert(paid?.success);assert.equal(s.gold,first.state.gold);assert.equal(attemptEnhancement(s,q,()=>{throw Error('double spend');}),null);
const changed=make(),cq=quoteEnhancement(changed,changed.inventory[0].id);changed.race='elf';assert.equal(prepareEnhancement(changed,cq,()=>{throw Error('stale must not roll');}).ok,false);
const dev=make();dev.developmentEquipmentSandbox=true;const devq=quoteDeveloperEnhancement(dev,dev.inventory[0].id);assert(devq.ok);assert.equal(devq.successRate,.9);assert.equal(devq.baseSuccessRate,undefined,'old lab remains unchanged');
console.log('PASS real formal enhancement: dwarf +2pp boundary all5 levels, non-dwarf old curve, luck ignored, same costs/base/failure downgrade, stale race, quota cached retry and no duplicate charge; developer lab unchanged');
