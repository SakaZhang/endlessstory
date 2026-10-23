import {fresh} from './dist/engine.js';
import assert from 'node:assert/strict';
import {forge,materialKey,materialCount,potionEntries,POTIONS,validSave,normalizePotions,ensureMerchant} from './dist/engine.js';
const original=Math.random;let seed=7245;Math.random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/2**32;};
try{
 const s=fresh();s.gold=1e9;s.materialStacks={'灰根草|0':100000,'铁屑|0':100000};const kinds={healing:0,strength:0,fireResist:0},qualities=[0,0,0,0];let potions=0,gear=0;
 for(let i=0;i<10000;i++){const gold=s.gold,herbs=materialCount(s,'灰根草'),iron=materialCount(s,'铁屑'),it=forge(s,['灰根草|0','铁屑|0']);assert.equal(s.gold,gold-40);assert.equal(materialCount(s,'灰根草'),herbs-1);assert.equal(materialCount(s,'铁屑'),iron-1);if(it.kind==='potion'){potions++;kinds[it.potionType]++;qualities[it.quality]++;assert(!it.divine);assert(!it.set);assert(Object.hasOwn(POTIONS,it.potionType));}else{gear++;s.inventory.pop();}}
 assert(potions>5700&&potions<6300);assert.equal(gear+potions,10000);assert(qualities.every(n=>n>0));assert(kinds.healing>kinds.strength&&kinds.strength>kinds.fireResist);assert.equal(potionEntries(s).reduce((n,x)=>n+x.count,0),potions);assert(validSave(s));
 Math.random=()=>0;const full=fresh();full.gold=1000;full.materialStacks['灰根草|0']=1;normalizePotions(full);full.potionStacks['healing|0']=1e9;const before=JSON.stringify(full);assert(forge(full,['灰根草|0']));assert(full.pendingForgeClaim);assert.equal(full.gold,960);assert.equal(full.materialStacks['灰根草|0'],0);assert.equal(full.potionStacks['healing|0'],1e9);
 // Imports extend the material pool; a fixed random fraction no longer identifies grayroot.
 let herbFound=false;Math.random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/2**32;};const merchant=fresh();for(let visit=0;visit<100&&!herbFound;visit++){const shop=ensureMerchant(merchant,visit*4*3600*1000);assert.equal(shop.offers.length,8);herbFound=shop.offers.some(o=>o.material==='灰根草');}assert(herbFound);
 console.log('Potion fusion: 10k mixed recipes', {potions,gear,kinds,qualities},'PASS');
}finally{Math.random=original;}
