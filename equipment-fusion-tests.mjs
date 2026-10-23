import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {fresh,item,forge,eligibleFusionEquipment,equipmentFusionQualityDistribution,rollEquipmentInputQuality,fusionDivineChance,validSave,applyForgeFavor,saveLoadout,equipItem,reforge,codexSetState,claimForgeResult,bagCounts,SLOTS} from './dist/engine.js';
import {commitGameTransaction} from './dist/storage.js';
const original=Math.random;let seed=92171;const rng=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/2**32;};Math.random=rng;
const gear=(s,q=1,slot='ring',level=10)=>{const it=item(slot,level,null,q);s.inventory.push(it);return it;},input=it=>({kind:'equipment',id:it.id});
try{
 const choices=['equipment','material'].flatMap(kind=>[0,1,2,3].map(quality=>({kind,quality})));let checked=0;
 const check=inputs=>{if(!inputs.some(x=>x.kind==='equipment'))return;checked++;const dist=equipmentFusionQualityDistribution(inputs);assert(Math.abs(dist.reduce((a,b)=>a+b,0)-1)<1e-12);assert(dist.every(p=>p>=-1e-12&&p<=1));const god=fusionDivineChance(inputs);assert(god>=.03&&god<=.06);for(let i=0;i<inputs.length;i++)if(inputs[i].quality<3){const higher=inputs.map((x,j)=>({...x,quality:x.quality+(i===j?1:0)})),next=equipmentFusionQualityDistribution(higher);for(let q=1;q<4;q++)assert(next.slice(q).reduce((a,b)=>a+b,0)+1e-12>=dist.slice(q).reduce((a,b)=>a+b,0));}};
 const walk=(arr,start)=>{if(arr.length)check(arr);if(arr.length===5)return;for(let i=start;i<choices.length;i++)walk([...arr,choices[i]],i);};walk([],0);assert.equal(checked,1161);
 for(let q=0;q<4;q++){let previous=null;for(let n=1;n<=5;n++){const inputs=Array.from({length:n},()=>({kind:'equipment',quality:q})),dist=equipmentFusionQualityDistribution(inputs);if(previous)for(let tier=1;tier<4;tier++)assert(dist.slice(tier).reduce((a,b)=>a+b,0)+1e-12>=previous.slice(tier).reduce((a,b)=>a+b,0));previous=dist;}const inputs=Array.from({length:5},()=>({kind:'equipment',quality:q})),expected=[0,0,0,0];for(const d of [-1,0,1])expected[Math.max(0,Math.min(3,q+d))]+=1/3;const actual=[0,0,0,0];for(let n=0;n<20000;n++)actual[rollEquipmentInputQuality(inputs,rng)]++;for(let tier=0;tier<4;tier++)assert(Math.abs(actual[tier]/20000-expected[tier])<.015);}
 assert.equal(fusionDivineChance(Array(5).fill({kind:'equipment',quality:3})),.06);assert(Math.abs(fusionDivineChance(Array(5).fill({kind:'material',quality:3}))-.055)<1e-12);
 // Invalid/protected/duplicate selections consume neither RNG nor state.
 for(const setup of [
 s=>[input(s.inventory[0])],
 s=>{const it=gear(s);it.locked=true;return[input(it)];},
 s=>{const it=gear(s);return[input(it),input(it)];},
 s=>[{kind:'equipment',id:'missing'}],
 s=>{const it=gear(s);return[input(it),'未知材料'];},
 s=>{const it=gear(s);equipItem(s,it.id,'ring1');saveLoadout(s,0,'柜');equipItem(s,s.inventory.find(x=>x.slot==='ring'&&x.id!==it.id).id,'ring1');return[input(it)];},
 s=>{const it=gear(s);reforge(s,it.id,'value',0);return[input(it)];},
 s=>Array(6).fill('铁屑|0')
 ]){const s=fresh();s.gold=1000;const selection=setup(s),before=JSON.stringify(s);let draws=0;Math.random=()=>{draws++;return .5;};assert.equal(forge(s,selection),null);assert.equal(draws,0);assert.equal(JSON.stringify(s),before);Math.random=rng;}
 for(let n=1;n<=5;n++){const s=fresh(),items=Array.from({length:n},()=>gear(s,1)),before=s.gold,result=forge(s,items.map(input));assert(result&&!result.kind);assert(!result.set);assert.equal(s.gold,before-40);assert(items.every(it=>!s.inventory.some(x=>x.id===it.id)));assert.equal(result.baseLevel,10);assert(result.level>=8&&result.level<=12);assert.equal(result.levelSource,'equipment');assert(validSave(s));}
 const mixed=fresh(),oldSet=item('gloves',17,'rune',3);applyForgeFavor(oldSet);mixed.inventory.push(oldSet);mixed.materialStacks['灰根草|3']=4;Math.random=()=>.9;const result=forge(mixed,[input(oldSet),...Array(4).fill('灰根草|3')]);assert(!result.kind&&!result.set&&!result.divine);assert.notEqual(result.id,oldSet.id);assert.equal(result.baseLevel,17);assert.equal(mixed.materialStacks['灰根草|3'],0);assert.deepEqual(codexSetState(mixed,'rune').parts,['gloves']);assert(validSave(mixed));
 // Legacy missing provenance uses actual old level once; highest base, not highest quality or hero, wins.
 const provenance=fresh();provenance.level=137;const old=gear(provenance,0,'ring',40),premium=gear(provenance,3,'amulet',5);delete old.baseLevel;delete old.levelSource;assert(validSave(provenance));Math.random=()=>.5;const migrated=forge(provenance,[input(old),input(premium)]);assert.equal(migrated.baseLevel,40);assert.equal(migrated.level,40);assert.equal(migrated.levelSource,'equipment');assert(validSave(provenance));
 // Actual five-identical gear fusion preserves equal zero-luck baseline, with independent blessing.
 Math.random=rng;const qstate=fresh();qstate.gold=1e9;const observed=[0,0,0,0],gods=[0,0,0,0];for(let n=0;n<20000;n++){const parts=Array.from({length:5},()=>gear(qstate,1));const out=forge(qstate,parts.map(input));observed[out.rarity]++;gods[out.rarity]+=!!out.divine;qstate.inventory.pop();}for(let q=0;q<3;q++){assert(Math.abs(observed[q]/20000-1/3)<.02);assert(Math.abs(gods[q]/observed[q]-.03)<.012);}assert.equal(observed[3],0);
 // Quality uses one best-of-two benefit; divine gets its separate approved probability multiplier.
 const luckMeans=[];for(const luck of [0,10]){seed=79421;Math.random=rng;const p=fresh();p.level=20;p.talents.luck=luck;p.gold=1e9;let sum=0,blessed=0;for(let n=0;n<20000;n++){const parts=Array.from({length:5},()=>gear(p,1));const out=forge(p,parts.map(input));sum+=out.rarity;blessed+=!!out.divine;p.inventory.pop();}luckMeans.push(sum/20000);assert(Math.abs(blessed/20000-(.03*(1+.20*luck/(luck+5))))<.008);}assert(luckMeans[1]>luckMeans[0]);assert(luckMeans[1]-luckMeans[0]<.05);
 Math.random=()=>.04;const low=fresh(),high=fresh();high.materialStacks['铁屑|3']=5;const lowOut=forge(low,Array(5).fill('铁屑|0')),highOut=forge(high,Array(5).fill('铁屑|3'));assert(!lowOut.divine);assert(highOut.divine);assert.equal(highOut.rarity,0);assert.equal(highOut.level,high.level);
 // Reusing the rolled output never ratchets its preserved baseline.
 const chain=fresh();chain.gold=100000;let current=gear(chain,0,'ring',10);Math.random=()=>.99;for(let n=0;n<1000;n++){current=forge(chain,[input(current)]);assert.equal(current.baseLevel,10);assert.equal(current.level,12);}assert(validSave(chain));
 // Consuming one glove frees only that family; a rolled full weapon bag keeps one paid result.
 const full=fresh();full.gold=1000;for(const slot of SLOTS)while(bagCounts(full).equipment[slot]<50)full.inventory.push(item(slot,1,null,0));const consume=full.inventory.find(it=>it.slot==='gloves'&&!Object.values(full.equip).includes(it.id));Math.random=()=>0;const pending=forge(full,[input(consume)]);assert.equal(pending.slot,'weapon');assert(full.pendingForgeClaim);assert.equal(full.gold,960);assert(!full.inventory.some(it=>it.id===consume.id));assert(validSave(full));const loaded=JSON.parse(JSON.stringify(full)),same=JSON.stringify(loaded);assert.equal(forge(loaded,['铁屑|0']),null);assert.equal(JSON.stringify(loaded),same);assert.equal(claimForgeResult(loaded),null);const remove=loaded.inventory.find(it=>it.slot==='weapon'&&!Object.values(loaded.equip).includes(it.id));loaded.inventory=loaded.inventory.filter(it=>it.id!==remove.id);assert.equal(claimForgeResult(loaded).id,pending.id);assert(validSave(loaded));
 // Failed persistence adopts neither consumed inputs, collection history nor generated output.
 const atomic=fresh(),piece=item('boots',1,'guard',3);atomic.inventory.push(piece);const before=JSON.stringify(atomic);let fail=true;const store={setItem(){if(fail)throw Error('quota');}};let tx=commitGameTransaction(store,atomic,p=>forge(p,[input(piece)]),{now:100});assert(!tx.ok);assert.equal(JSON.stringify(atomic),before);assert(!codexSetState(atomic,'guard').discovered);fail=false;tx=commitGameTransaction(store,atomic,p=>forge(p,[input(piece)]),{now:100});assert(tx.ok);assert(!tx.game.inventory.some(it=>it.id===piece.id));assert.deepEqual(codexSetState(tx.game,'guard').parts,['boots']);
 // Exact 2,000-result M2 sequences after approved removal of the legacy raw-spread RNG draw; material quality formula remains unchanged.
 // v0.34 explicitly changes nonzero luck RNG (new values/divine benefits).
 // Zero-luck hashes independently captured from deployed v0.33 HEAD 44c13d0.
 const legacySequences=[
 [['铁屑|0'],'e61b7922994f8307ee298058e1b6c16e01513ab7df0c8484780b3bfcc947ad84'],
 [Array(5).fill('铁屑|3'),'ea71b6c3388fdefe1c30872150307c3a2bac5f1c0b7072f60087e277549f2dad'],
 [['灰根草|0','铁屑|0'],'a21fe083fc751d72c9609272d750ec9e30e6ef39e2f4d6f25bf68e6c581a3333'],
 [['灰根草|3','炉火晶|2','灰根草|1'],'a36353915ce033a33b3d2cc76727977a228a17a2368ae1eb98ea16a79bed6788']];
 for(const [selection,expected] of legacySequences){seed=91731;Math.random=rng;const p=fresh();p.level=20;p.talents.luck=0;p.gold=1e9;for(const k of selection)p.materialStacks[k]=10000;const rows=[];for(let n=0;n<2000;n++){const out=forge(p,selection);rows.push([out.kind??'equipment',out.rarity??out.quality,out.slot??out.potionType]);if(!out.kind)p.inventory.pop();}assert.equal(createHash('sha256').update(JSON.stringify(rows)).digest('hex'),expected);}
 console.log('Equipment-input fusion:1161 exact dominance cases;5same20k baseline',observed,'divine',gods,'; protected/duplicate no-RNG,1–5 mixed gear, independent blessing, level no-ratchet1000, pending/codex/storage atomics: PASS');
}finally{Math.random=original;}
