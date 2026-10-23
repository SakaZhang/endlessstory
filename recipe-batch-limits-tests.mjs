import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
import {maxPotionRecipeBatch,maxRecoveryBatch,recoveryBatchQuantities,receivablePotionQuantity} from './dist/recipe-batch-ui.js';
import {enhancementFee} from './dist/equipment-budget.js';
const s=E.fresh();E.normalizePotions(s);s.gold=10000;E.learnRecipe(s,'potion-luck');E.learnRecipe(s,'potion-healing');s.materialStacks['human.mat.12|1']=21;s.materialStacks['灰根草|1']=17;
assert.equal(maxPotionRecipeBatch(s,'potion-luck',1,{mainKey:'human.mat.12|1',auxKey:'human.mat.12|1'}),10,'same main and auxiliary share stock at two per potion');
assert.equal(maxPotionRecipeBatch(s,'potion-luck',0,{mainKey:'human.mat.12|1',auxKey:'human.mat.12|1'}),0,'no cross-quality substitution');
assert.equal(maxRecoveryBatch(s,1),38);assert.deepEqual(recoveryBatchQuantities(s,1,10,{'灰根草|1':1}),{'灰根草|1':10});assert.equal(recoveryBatchQuantities(s,1,39),null);
s.gold=5;assert.equal(maxRecoveryBatch(s,1),2);s.gold=10000;s.potionStacks['healing|1']=1e9-3;assert.equal(maxRecoveryBatch(s,1),3);assert.equal(receivablePotionQuantity(s,'healing',1,17),3);s.potionStacks['healing|1']=1e9;assert.equal(maxRecoveryBatch(s,1),0);
s.potionStacks['luck|1']=1e9-2;assert.equal(maxPotionRecipeBatch(s,'potion-luck',1,{mainKey:'human.mat.12|1',auxKey:'human.mat.12|1'}),2);
for(let quality=0;quality<4;quality++){const t=E.fresh();t.gold=999999;E.learnRecipe(t,'potion-healing');t.materialStacks['灰根草|'+quality]=10;const q=E.quoteRecoveryRecipe(t,quality,[{key:'灰根草|'+quality,quantity:10}]);const before=t.gold;const out=E.craftRecoveryRecipe(t,q);assert.equal(out.quantity,10);assert.equal(t.potionStacks['healing|'+quality],10);assert.equal(t.gold,before-10*(quality+1));assert.equal(t.materialStacks['灰根草|'+quality],0);}
assert.deepEqual([1,2,3,4,5].map(target=>enhancementFee({level:20,quality:3,target})),[5,10,15,25,40]);
console.log('PASS batch limits: same-stack double cost, selected recipe/quality, gold/material/stack capacity, exact quality batches and deterministic enhancement fee schedule.');
