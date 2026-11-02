import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
import {SAVE_KEY,loadProgress} from './dist/storage.js';
import {INFINITY_GAUNTLET_MATERIALS as gems,isInfinityGauntletFusion,hasInfinityGauntletMaterial} from './dist/infinity-gauntlet-content.js';
import {createInfinityGauntletCraftService,quoteInfinityGauntletCraft} from './dist/infinity-gauntlet-crafting.js';
import {redeemCode} from './dist/redeem-codes.js';
import {renderMaterialFusionPreview} from './dist/material-fusion-ui.js';
import {renderInfinityGauntletRecipe} from './dist/infinity-gauntlet-ui.js';
const keys=gems.map(x=>x.material+'|3'),races=['dwarf','human','elf','goblin','ashen'];
function ready(race='dwarf',known=false){const s=E.fresh(race);s.gold=1000;for(const k of keys)s.materialStacks[k]=1;if(known)s.infinityGauntlet={version:1,recipeLearned:true,crafted:false,craftedItemId:null};assert(E.validSave(s));return s;}
function storage(s){let raw=JSON.stringify(s);return {fail:false,getItem:k=>k===SAVE_KEY?raw:null,setItem(k,v){if(this.fail)throw Error('quota');assert.equal(k,SAVE_KEY);raw=v},get length(){return 1},key:()=>SAVE_KEY,removeItem(){}};}
function count(s){return s.inventory.filter(x=>x.legendaryId==='infinity-gauntlet').length+(s.pendingForgeClaim?.item?.legendaryId==='infinity-gauntlet'?1:0);}
const originalRandom=Math.random;
try{
 // Matching depends on all five distinct canonical gems, not recipe visibility, selection order or race.
 assert(isInfinityGauntletFusion(keys));assert(isInfinityGauntletFusion([...keys].reverse()));
 for(const race of races)for(const known of [false,true]){
  const s=ready(race,known),gold=s.gold;assert(quoteInfinityGauntletCraft(s,keys).ok);
  let out=E.forge(s,[...keys].reverse());assert.equal(out?.legendaryId,'infinity-gauntlet');assert.equal(out.slot,'gloves');assert.equal(out.rarity,3);assert.equal(out.affixes.length,4);
  assert.equal(s.gold,gold-E.racialGoldCost(s,40));assert(keys.every(k=>s.materialStacks[k]===0));assert.equal(s.infinityGauntlet.craftedItemId,out.id);assert(E.validSave(s));assert.equal(count(s),1);
  for(const k of keys)s.materialStacks[k]=1;const before=JSON.stringify(s);assert.equal(E.forge(s,keys),null);assert.equal(JSON.stringify(s),before);
 }
 // Wrong, partial, repeated, excess, mixed gear, and lower-quality infinity inputs never become random gear.
 const cases=[[],keys.slice(0,4),[...keys.slice(0,4),keys[0]],[...keys,'铁屑|0'],[...keys.slice(0,4),'铁屑|0'],keys.map((k,i)=>i?k:k.replace('|3','|2')),[keys[0]],null];
 for(const selection of cases){const s=ready();s.materialStacks[keys[0]]=2;const before=JSON.stringify(s);let draws=0;Math.random=()=>{draws++;return .5};assert(!isInfinityGauntletFusion(selection));assert.equal(E.forge(s,selection),null);assert.equal(draws,0);assert.equal(JSON.stringify(s),before);}
 const mixed=ready(),gear=E.item('gloves',1,null,0);mixed.inventory.push(gear);const mixedInputs=[...keys.slice(0,4),{kind:'equipment',id:gear.id}],mixedBefore=JSON.stringify(mixed);assert(hasInfinityGauntletMaterial(mixedInputs));assert.equal(E.forge(mixed,mixedInputs),null);assert.equal(JSON.stringify(mixed),mixedBefore);
 Math.random=originalRandom;
 // Preview explicitly communicates deterministic output, and no old recipe panel remains.
 const previewState=ready(),preview=E.previewMaterialFusion(previewState,keys);assert.equal(preview.kind,'infinity-gauntlet');assert.equal(preview.complete,true);assert.equal(preview.blocked,false);assert.match(renderMaterialFusionPreview(preview),/固定产出 · 无限手套/);assert.match(renderMaterialFusionPreview(preview),/100%/);assert.equal(renderInfinityGauntletRecipe(previewState),'');assert.equal(renderInfinityGauntletRecipe(ready('dwarf',true)),'');
 const partial=E.previewMaterialFusion(previewState,keys.slice(0,4));assert.equal(partial.blocked,true);assert.match(renderMaterialFusionPreview(partial),/不会消耗宝石/);
 for(const mutate of [s=>{s.running=true},s=>{s.activeEncounter={done:false}}]){const busy=ready();mutate(busy);const before=JSON.stringify(busy);assert.equal(E.forge(busy,keys),null);assert.equal(JSON.stringify(busy),before);assert(!quoteInfinityGauntletCraft(busy,keys).ok);}
 // Resource/inventory failures and malformed state cannot manufacture or consume anything.
 for(const mutate of [s=>{delete s.materialStacks[keys[2]]},s=>{s.gold=0},s=>{s.infinityGauntlet={version:1,recipeLearned:true,crafted:false,craftedItemId:'bad'}}]){
  const s=ready();mutate(s);const before=JSON.stringify(s);assert.equal(E.forge(s,keys),null);assert.equal(JSON.stringify(s),before);assert(!quoteInfinityGauntletCraft(s,keys).ok);
 }
 // Transaction path, as used by app, preserves exact prepared output and input on failed saves.
 const s=ready(),store=storage(s),craft=createInfinityGauntletCraftService(),before=JSON.stringify(s),raw=store.getItem(SAVE_KEY);let draws=0;Math.random=()=>{draws++;return .42};store.fail=true;assert.equal(craft(store,s,keys).reason,'storage');const firstDraws=draws;assert(firstDraws>0);assert.equal(JSON.stringify(s),before);assert.equal(store.getItem(SAVE_KEY),raw);store.fail=false;let tx=craft(store,s,keys);assert(tx.ok);assert.equal(draws,firstDraws);assert(E.validSave(tx.game));assert.equal(count(tx.game),1);assert.equal(craft(store,tx.game,keys).reason,'already-crafted');assert.equal(craft(store,s,keys).reason,'already-crafted');
 Math.random=originalRandom;
 // Ledger persists after disposal and fresh INFINITY5 bundles cannot reset it or limit test redemption.
 let done=tx.game;done.inventory=done.inventory.filter(i=>i.id!==tx.value.id);assert(redeemCode(done,'INFINITY5'));assert(redeemCode(done,'INFINITY5'));assert.equal(done.infinityGauntlet.crafted,true);assert.equal(E.forge(done,keys),null);assert.equal(count(done),0);assert(E.validSave(done));
 const fresh=E.fresh();assert(redeemCode(fresh,'INFINITY5'));assert(redeemCode(fresh,'INFINITY5'));assert(keys.every(k=>fresh.materialStacks[k]===2));assert(E.validSave(fresh));assert(E.forge(fresh,keys)?.legendaryId==='infinity-gauntlet');
 // Full glove bag keeps one paid result, survives reload, and claims once with all loot filters enabled.
 const full=ready();while(full.inventory.filter(i=>i.slot==='gloves').length<50)full.inventory.push(E.item('gloves',1,null,0));full.lootFilters={equipment:[0,1,2,3],materials:[0,1,2,3],items:[0,1,2,3]};assert(E.validSave(full));const fullStore=storage(full),fullTx=createInfinityGauntletCraftService()(fullStore,full,keys);assert(fullTx.ok);assert.equal(fullTx.game.pendingForgeClaim.item.legendaryId,'infinity-gauntlet');let loaded=loadProgress(fullStore);assert(!loaded.blocked);assert.equal(count(loaded.game),1);assert.equal(E.forge(loaded.game,keys),null);assert.equal(E.claimForgeResult(loaded.game),null);const removed=loaded.game.inventory.find(x=>x.slot==='gloves'&&!Object.values(loaded.game.equip).includes(x.id));loaded.game.inventory=loaded.game.inventory.filter(x=>x.id!==removed.id);const claim=E.claimForgeResult(loaded.game);assert.equal(claim.id,fullTx.value.id);assert.equal(E.claimForgeResult(loaded.game),null);assert(E.validSave(loaded.game));assert.equal(count(loaded.game),1);
 // Ordinary material fusion still uses its normal route and never initializes a special craft ledger.
 const generic=E.fresh();generic.gold=1000;generic.materialStacks['铁屑|0']=5;assert(!hasInfinityGauntletMaterial(['铁屑|0']));const ordinary=E.forge(generic,['铁屑|0']);assert(ordinary);assert.notEqual(ordinary.legendaryId,'infinity-gauntlet');assert.equal(generic.infinityGauntlet,undefined);assert.equal(generic.gold,1000-E.racialGoldCost(generic,40));assert(E.validSave(generic));
 console.log('PASS v085 infinity fusion: five-race recipe-independent fixed output; protected invalid combinations; atomic retry/stale calls; permanent ledger; unlimited test bundles; full-bag reload/claim and ordinary fusion.');
}finally{Math.random=originalRandom;}
