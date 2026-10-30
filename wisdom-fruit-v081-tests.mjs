import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
import {commitGameTransaction} from './dist/storage.js';
import {normalizeRareRewardProgress,freshRareRewardProgress} from './dist/rare-reward-progress.js';
import {lootOccurrenceProbability} from './dist/luck-policy.js';
const clone=structuredClone;
const s=E.fresh('elf');s.level=100;s.talents.power=99;s.consumables.memoryFruit=5000;
const allocated=clone(s.talents),before=clone(s);assert(E.validSave(s));
const fail=commitGameTransaction({setItem(){throw Error('quota');}},s,x=>E.useWisdomFruit(x,5000));assert(!fail.ok);assert.deepEqual(s,before);
let raw;const tx=commitGameTransaction({setItem(k,v){raw=v;}},s,x=>E.useWisdomFruit(x,5000));assert(tx.ok);const used=JSON.parse(raw);assert.equal(used.consumables.memoryFruit,4999);assert.equal(used.earnedFruitTalentPoints,3);assert.equal(E.availableTalentPoints(used),3);assert.deepEqual(used.talents,allocated);assert(E.validSave(used));
const once=clone(used);assert(!E.useWisdomFruit(used,5000));assert.deepEqual(used,once);assert(E.useWisdomFruit(used,4999));assert.equal(E.talentPointBudget(used),105);used.level=101;assert.equal(E.talentPointBudget(used),106); // level growth and permanent points stack
for(const mutate of [x=>x.running=true,x=>x.activeEncounter={done:false},x=>x.consumables.memoryFruit=0,x=>x.earnedFruitTalentPoints=E.MAX_FRUIT_TALENT_POINTS]){const x=clone(once);mutate(x);const b=clone(x);assert(!E.useWisdomFruit(x,x.consumables.memoryFruit));assert.deepEqual(x,b);}
for(const n of [-3,1,1.5,Infinity,'3',3e9+3]){const x=clone(once);x.earnedFruitTalentPoints=n;assert(!E.validSave(x));}
const retired=clone(once);retired.bonusTalentPoints=3;assert(!E.validSave(retired));
const capped=clone(once);capped.talents.power=89;capped.talents.luck=10;assert(!E.spendTalent(capped,'luck'));assert(E.spendTalent(capped,'power'));
const refund=clone(once);refund.gold=100;refund.consumables.refundCredits=2;assert.deepEqual(E.getTalentRefundQuote(refund,{power:4}),{points:4,fruitCost:0,creditsBefore:2,creditsAfter:0,goldCost:40,freeReason:null});assert(E.commitTalentRefund(refund,{power:4}));assert.equal(refund.gold,60);assert.equal(refund.consumables.memoryFruit,4999);assert.equal(refund.earnedFruitTalentPoints,3);
const pending=E.item('helm',20,'elf_arrow',3,{originRace:'elf'}),legacy=E.fresh('elf');legacy.consumables.memoryFruit=5000;legacy.rareRewardProgress={version:1,dungeonDryStreak:19,fruitProgress:19,pendingSets:[pending],pendingFruit:7};assert(E.validSave(legacy));normalizeRareRewardProgress(legacy);assert.deepEqual(legacy.rareRewardProgress,{version:2,dungeonDryStreak:0,pendingSets:[pending],pendingFruit:7});normalizeRareRewardProgress(legacy);assert.equal(legacy.consumables.memoryFruit,5000);assert.deepEqual(E.claimPendingRareRewards(legacy),{sets:1,fruit:7});assert.equal(legacy.consumables.memoryFruit,5007);assert(E.validSave(legacy));
for(const [kind,rate] of Object.entries({field:.005,dungeon:.01,boss:.02})){assert.equal(E.wisdomFruitDropProbability('elf',kind),rate);assert.equal(E.wisdomFruitDropProbability('elf',kind,10),lootOccurrenceProbability(rate,10));for(const race of ['dwarf','human','goblin','ashen'])assert.equal(E.wisdomFruitDropProbability(race,kind,10),0);}assert.equal(E.wisdomFruitDropProbability('elf','otherworld',10),0);
const merchant=E.fresh();merchant.gold=1000;const shop=E.ensureMerchant(merchant,merchant.lastSeen);const offer=shop.offers.find(o=>o.type==='equipment');Object.assign(offer,{type:'consumable',consumable:'memoryFruit',price:200,stock:1});delete offer.item;assert(E.validSave(merchant));const mb=clone(merchant);assert(!E.purchaseConsumable(merchant,offer.offerId,shop.revision,merchant.lastSeen));assert.deepEqual(merchant,mb);
for(let i=0;i<100;i++){const m=E.fresh();assert(!E.ensureMerchant(m,m.lastSeen).offers.some(o=>o.consumable==='memoryFruit'));}
console.log('PASS wisdom fruit: old5000 preserved, +3 explicit atomic use, quota/stale/busy/cap, strict earned budget, refund credits/gold no fruit, v1 migration and pending identity, regional rates, retired merchant.');
