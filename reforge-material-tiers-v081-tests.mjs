import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
import {reforgeMaterialForLevel,REFORGE_MATERIAL_IDS} from './dist/reforge-materials.js';
import {DWARF_MATERIAL_SOURCE_POOLS,DWARF_MATERIALS} from './dist/dwarf-material-catalog.js';
import {commitGameTransaction} from './dist/storage.js';
const races=['human','dwarf','elf','goblin','ashen'];
for(let tier=1;tier<=10;tier++){
 const m=reforgeMaterialForLevel(tier*10),meta=DWARF_MATERIALS[m.id];
 assert.equal(meta.category,'常规');assert(!meta.uniqueHeld&&!meta.storyOnly);assert(meta.qualityRange.includes(0));
 const sources=Object.values(DWARF_MATERIAL_SOURCE_POOLS).filter(p=>p.nodeId===m.sourceNodeId&&p.channels.some(c=>c.channel==='regular'&&c.hitProbability>0&&c.entries.some(e=>e.materialId===m.id&&e.weight>0&&e.qualityWeights[0]>0)));
 assert(sources.length,`actual repeatable q0 regular pool for A${tier}`);
 console.log(`A${tier}: ${m.name} · ${m.sourceAreaName} · ${sources.map(p=>p.monsterId).join(', ')}`);
}
let cases=0;
for(const race of races)for(const level of [...Array.from({length:10},(_,i)=>[i*10+1,i*10+10]).flat(),101,120,1000]){
 const s=E.fresh(race),it=E.item('weapon',level,null,2,{originRace:race});s.inventory.push(it);s.gold=10000;
 const m=reforgeMaterialForLevel(level);s.materialStacks[m.key+'|0']=3;s.materialStacks[m.key+'|3']=7;
 const original=structuredClone(it),state=JSON.stringify(s),random=Math.random;let rolls=0;Math.random=()=>{rolls++;return .6};
 const quote=E.getReforgeQuote(s,it.id,'value',0);assert.equal(rolls,0);assert.equal(JSON.stringify(s),state);assert.equal(quote.materials[0].owned,3);assert.equal(quote.materials[0].quality,0);assert.equal(quote.materials[0].tier,Math.min(10,Math.ceil(level/10)));
 const r=E.reforge(s,it.id,'value',0,undefined,quote);Math.random=random;assert(r);assert.deepEqual(it,original);assert.equal(s.materialStacks[m.key+'|0'],2);assert.equal(s.materialStacks[m.key+'|3'],7);assert.equal(s.gold,10000-quote.cost.gold);assert(E.validSave(s));
 const saved=JSON.stringify(s),paid=s.gold;
 for(const accept of [false,true]){const restored=JSON.parse(saved);assert(E.resolveReforge(restored,accept));assert.equal(restored.gold,paid);assert.equal(restored.materialStacks[m.key+'|0'],2);assert(E.validSave(restored));if(!accept)assert.deepEqual(restored.inventory.at(-1),original);}
 // Legacy already-paid candidates remain valid even when their old iron cost differs.
 if(level>20)for(const version of [6,7,8]){const legacy=JSON.parse(saved);legacy.pendingReforge.ruleVersion=version;delete legacy.pendingReforge.targetLevel;legacy.pendingReforge.cost.materials={'铁屑':1};const stock=JSON.stringify(legacy.materialStacks);assert(E.validSave(legacy));assert(E.resolveReforge(legacy,true));assert.equal(JSON.stringify(legacy.materialStacks),stock);assert.equal(legacy.gold,paid);}
 // Full reroll and donor inheritance retain their non-material prices at every level.
 for(const mode of ['all','replace']){
  const c=JSON.parse(saved);E.resolveReforge(c,false);c.consumables.reforgeToken=1;
  const donor={...structuredClone(original),id:original.id+'-donor',locked:false};c.inventory.push(donor);
  const stock=JSON.stringify(c.materialStacks),gold=c.gold,q=E.getReforgeQuote(c,it.id,mode,0,donor.id);
  assert(E.reforge(c,it.id,mode,0,donor.id,q));assert.equal(JSON.stringify(c.materialStacks),stock);assert.equal(c.gold,gold);assert(E.validSave(c));assert(E.resolveReforge(c,true));assert(E.validSave(c));
  assert.equal(c.inventory.find(x=>x.id===it.id).level,level);
 }
 cases++;
}
for(const mutate of [s=>s.inventory[0].level++,s=>s.materialStacks['dwarf.blackvein_ore|0']=0,s=>s.gold=0]){
 const s=E.fresh(),it=E.item('weapon',30,null,1);s.inventory.push(it);s.materialStacks['dwarf.blackvein_ore|0']=1;s.materialStacks['dwarf.blackvein_ore|3']=99;
 const quote=E.getReforgeQuote(s,it.id,'value');mutate(s);const before=JSON.stringify(s);assert.equal(E.reforge(s,it.id,'value',0,undefined,quote),null);assert.equal(JSON.stringify(s),before);
}
{
 const s=E.fresh(),it=E.item('weapon',80,null,1);s.inventory.push(it);s.materialStacks['dwarf.obsidian_flake|0']=1;
 const before=JSON.stringify(s),q=E.getReforgeQuote(s,it.id,'value');const tx=commitGameTransaction({setItem(){throw Error('quota')}},s,next=>E.reforge(next,it.id,'value',0,undefined,q));assert.equal(tx.reason,'storage');assert.equal(JSON.stringify(s),before);
 // q3-only stock must not substitute for ordinary material, with or without a quote.
 s.materialStacks['dwarf.obsidian_flake|0']=0;s.materialStacks['dwarf.obsidian_flake|3']=10;const missing=JSON.stringify(s);assert.equal(E.reforge(s,it.id,'value'),null);assert.equal(JSON.stringify(s),missing);
}
console.log(`PASS ${cases} all-race tier/boundary/>100 cases; read-only quotes, exact q0, stale/no debit, pending reload/accept/discard, legacy cost and storage rollback.`);
