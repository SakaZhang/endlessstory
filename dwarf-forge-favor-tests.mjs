import assert from 'node:assert/strict';
import * as P from './dist/dwarf-forge-favor.js';
import {makeAffixSourceRange} from './dist/affix-range.js';
// Fixture tuning only; no defaults exported or production integration enabled.
const c={secondRollChance:.1,divineRelativeBonus:.2,enhancementBonus:.05,donorTilt:2};
assert(Math.abs(P.combinedFavorableRollChance(.06,'dwarf',c)-.154)<1e-12);assert(Math.abs(P.combinedFavorableRollChance(0,'dwarf',c)-.1)<1e-12);assert.equal(P.combinedFavorableRollChance(.06,'human',c),.06);assert.equal(P.combinedFavorableRollChance(1,'dwarf',c),1);assert.equal(P.combinedFavorableRollChance(.06,'dwarf',c,{eligible:false}),0);
assert.equal(P.dwarfDivineChance(0,'dwarf',c),0);assert.equal(P.dwarfDivineChance(.05,'dwarf',c),.06);assert.equal(P.dwarfDivineChance(.99,'dwarf',c),1);assert.equal(P.dwarfEnhancementChance(0,'dwarf',c),0);assert.equal(P.dwarfEnhancementChance(.99,'dwarf',c),1);assert.equal(P.dwarfEnhancementChance(.2,'elf',c),.2);
for(const value of [NaN,Infinity,-.1,1.1])for(const fn of [P.combinedFavorableRollChance,P.dwarfDivineChance,P.dwarfEnhancementChance])assert.equal(fn(value,'dwarf',c),null);
let previous=0;for(let i=0;i<=100;i++){const p=P.combinedFavorableRollChance(i/100,'dwarf',c);assert(p>=previous&&p<=1);previous=p;}
const defs={hp:{min:10,max:40},atk:{min:1,max:10},fixed:{min:3,max:3}};
assert.equal(P.donorSourcePercentile({stat:'hp',value:10},defs),0);assert.equal(P.donorSourcePercentile({stat:'atk',value:10},defs),1,'same raw number is not the same source percentile');assert.equal(P.donorSourcePercentile({stat:'fixed',value:3},defs),.5);
const sourceRange=makeAffixSourceRange(defs.hp,3),a={stat:'hp',value:sourceRange.max,sourceRange};const raw=JSON.stringify(a);assert.equal(P.donorSourcePercentile(a,defs),1);assert.equal(P.donorFavorWeight(a,defs,'dwarf',c),3);assert.equal(JSON.stringify(a),raw);
for(const bad of [{stat:['hp'],value:40},{stat:'unknown',value:1e9},{stat:'hp',value:NaN},{stat:'hp',value:40,sourceRange:{...sourceRange,max:999}}])assert.equal(P.donorSourcePercentile(bad,defs),.5);
const affixes=[{stat:'hp',value:10},{stat:'atk',value:10}];assert.equal(P.weightedDonorIndex(affixes,defs,'dwarf',c,0),0);assert.equal(P.weightedDonorIndex(affixes,defs,'dwarf',c,.2499),0);assert.equal(P.weightedDonorIndex(affixes,defs,'dwarf',c,.25),1);assert.equal(P.weightedDonorIndex(affixes,defs,'dwarf',c,.999),1);assert.equal(P.weightedDonorIndex([a],defs,'dwarf',c),0);assert.equal(P.weightedDonorIndex(affixes,defs,'dwarf',c,1),null);
for(let value=10;value<=40;value++)assert(P.donorFavorWeight({stat:'hp',value},defs,'dwarf',c)>0);
const rand=Math.random;Math.random=()=>{throw Error('pure policy must not roll');};try{P.weightedDonorIndex(affixes,defs,'dwarf',c,.4);P.combinedFavorableRollChance(.06,'dwarf',c);}finally{Math.random=rand;}
console.log('PASS forge favor pure policy: one merged second-roll opportunity, eligibility zero, bounds/monotonic finite, independent divine/enhance, source percentile not raw comparison, positive donor weights/no mutation/no RNG');
const occurrenceConfig={...c,occurrenceRelativeBonus:.3};
assert.equal(P.dwarfForgeOccurrenceChance(.2,'dwarf',occurrenceConfig),.26);
assert.equal(P.dwarfForgeOccurrenceChance(0,'dwarf',occurrenceConfig),0);
assert.equal(P.dwarfForgeOccurrenceChance(1,'dwarf',occurrenceConfig),1);
assert.equal(P.dwarfForgeOccurrenceChance(.9,'dwarf',occurrenceConfig),1);
assert.equal(P.dwarfForgeOccurrenceChance(.2,'human',{}),.2,'non-dwarf never needs or applies racial policy');
assert.equal(P.dwarfForgeOccurrenceChance(.2,'dwarf',{...occurrenceConfig,divineRelativeBonus:999}),.26,'special and divine fields are independent');
for(const bonus of [-1,NaN,Infinity,1000001])assert.equal(P.dwarfForgeOccurrenceChance(.2,'dwarf',{occurrenceRelativeBonus:bonus}),null);
for(const value of [-1,NaN,Infinity,1.1])assert.equal(P.dwarfForgeOccurrenceChance(value,'dwarf',occurrenceConfig),null);
assert.equal(P.dwarfForgeOccurrenceChance(.2,'dwarf',{occurrenceRelativeBonus:0}),.2);
console.log('PASS eligible forge-special occurrence: separate racial field, zero/guaranteed/non-dwarf unchanged, bounded finite policy');
