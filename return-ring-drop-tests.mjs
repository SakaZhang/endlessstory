import assert from 'node:assert/strict';
import {rareMaterialOccurrenceProbability as probability} from './dist/rare-material-policy.js';
import {lootOccurrenceProbability,legendaryPoolProbability} from './dist/luck-policy.js';
import {rollWorldMaterials,getWorldMaterialPool,WORLD_MATERIALS} from './dist/world-materials.js';
import {WORLD_MONSTERS} from './dist/world-content.js';
import {returnRingRareBonus} from './dist/return-ring-state.js';
import {fresh,legendaryItem,equipItem,validSave,stats,startInstanceEncounter,step,reward,bagCounts,claimForgeResult,materialKey,MATERIALS} from './dist/engine.js';
import {createReturnRingCraftService} from './dist/return-ring-crafting.js';
import {RETURN_RING_MATERIALS} from './dist/return-ring-content.js';
import {SAVE_KEY} from './dist/storage.js';
for(const luck of [0,5,10,1000])for(const base of [.00005,.005,.05,.2,.99])for(const channel of ['regular','recovery','special','gem'])assert.equal(probability(channel,base,luck,{special:.03,gem:.03}),Math.min(1,lootOccurrenceProbability(base,luck)+(['special','gem'].includes(channel)?.03:0)));
assert.equal(probability('gem',0,1000,{gem:.03}),0);assert.equal(probability('special',0,0,{special:.03}),0);assert.equal(probability('gem',.99,1000,{gem:.03}),1);
for(const race of ['dwarf','human','elf','goblin','ashen']){
 const monster=Object.values(WORLD_MONSTERS).filter(m=>m.id.startsWith(race+'.')&&m.rank==='boss'&&getWorldMaterialPool(m.id,m.id)?.channels.some(c=>c.channel==='gem')).sort((a,b)=>b.area-a.area)[0];assert(monster,race);const nodeId=monster.id;
 const pool=getWorldMaterialPool(monster.id,nodeId),gem=pool.channels.find(c=>c.channel==='gem'),roll=Math.min(.999999,gem.hitProbability+.015),e={instanceId:nodeId,contentVersion:'dwarf-m2-v1'},unit={definitionId:monster.id,sourceInstanceId:nodeId,origin:'initial'},options={random:()=>roll,rollQuality:()=>0,owned:()=>false,receive:()=>true,luck:0};
 const without=rollWorldMaterials({},e,unit,options),withRing=rollWorldMaterials({},e,unit,{...options,rareBonuses:{special:.03,gem:.03}});assert(without.ok&&withRing.ok);assert(!without.drops.some(d=>d.channel==='gem'));assert(withRing.drops.some(d=>d.channel==='gem'&&d.quality===3));
 const held=rollWorldMaterials({},e,unit,{...options,rareBonuses:{special:.03,gem:.03},owned:(_s,id)=>WORLD_MATERIALS[id]?.uniqueHeld===true});assert(!held.drops.some(d=>d.channel==='gem'));
 assert(!rollWorldMaterials({},e,{...unit,origin:'summoned'},{...options,rareBonuses:{special:.03,gem:.03}}).ok);
}
// Equipped identity, not bag ownership, controls all supported bonus channels.
const s=fresh();const ring=legendaryItem('return-ring',1);s.inventory.push(ring);s.returnRing={version:1,recipeLearned:true,crafted:true,craftedItemId:ring.id};assert(validSave(s));assert.equal(returnRingRareBonus(s,'material-gem'),0);equipItem(s,ring.id,'ring1');for(const channel of ['boss-legendary','material-special','material-gem'])assert.equal(returnRingRareBonus(s,channel),.03);for(const channel of ['regular','recovery','quality','affix','divine','reforgeToken','fruit'])assert.equal(returnRingRareBonus(s,channel),0);assert.equal(legendaryPoolProbability(0,returnRingRareBonus(s,'boss-legendary')),.08);
// Full ring bag creates one persistent forge claim and a once-only manufacturing ledger.
let game=fresh();game.returnRing={version:1,recipeLearned:true,crafted:false,craftedItemId:null};game.gold=1000;for(const m of RETURN_RING_MATERIALS)game.materialStacks[materialKey(m.material,3)]=1;
const {item}=await import('./dist/engine.js');while(bagCounts(game).equipment.ring<50)game.inventory.push(item('ring',1,null,0));let raw=JSON.stringify(game);const store={getItem:()=>raw,setItem(k,v){assert.equal(k,SAVE_KEY);raw=v}};const craft=createReturnRingCraftService();const tx=craft(store,game);assert(tx.ok);game=tx.game;assert(game.pendingForgeClaim?.item.legendaryId==='return-ring');assert(game.returnRing.crafted);assert(!game.inventory.some(i=>i.legendaryId==='return-ring'));assert(validSave(game));assert.equal(craft(store,game).reason,'already-crafted');game.inventory.splice(game.inventory.findIndex(i=>i.slot==='ring'&&!Object.values(game.equip).includes(i.id)),1);assert(claimForgeResult(game));assert.equal(game.inventory.filter(i=>i.legendaryId==='return-ring').length,1);assert(!claimForgeResult(game));assert(validSave(game));
console.log('PASS Return Ring drops: approved +3pp after luck, five-race real special/gem pools, source/unique gates first, zero-channel no resurrection, ordinary/quality/affix/divine/consumable exclusions, equipped-only, 5%→8%, capped100%, full-ring-bag one pending unique craft.');
