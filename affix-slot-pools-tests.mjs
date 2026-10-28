import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
import {ordinaryAffixKeys} from './dist/affix-slot-pools.js';
import {LEGENDARY_EQUIPMENT_DEFINITIONS,createLegendaryEquipment} from './dist/legendary-equipment.js';
import {makeAffixSourceRange,validAffixSource} from './dist/affix-range.js';
const oldRandom=Math.random;let seed=730031;Math.random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/2**32);
const state=()=>{const s=E.fresh();s.gold=1e8;s.materialStacks['铁屑|0']=10000;s.consumables.reforgeToken=1000;return s;};
const affix=(stat,quality,sourceLevel)=>{const sourceRange=makeAffixSourceRange(E.AFFIX_DEFS[stat],quality,{stat,sourceLevel});return {stat,value:sourceRange.max,sourceRange};};
const check=it=>{assert(it);assert(it.affixes.length<=4);assert.equal(new Set(it.affixes.map(a=>a.stat)).size,it.affixes.length);for(const a of it.affixes){assert(ordinaryAffixKeys(it.slot).includes(a.stat),`${it.slot}: ${a.stat}`);assert(validAffixSource(a,E.AFFIX_DEFS));assert.equal(a.sourceRange.sourceLevel,it.level);assert.equal(a.sourceRange.quality,it.legendaryId?4:it.rarity);}};
try{
 assert.deepEqual(Object.keys(E.SLOT_AFFIX_POOLS),E.SLOTS);
 assert.equal(new Set(Object.values(E.SLOT_AFFIX_POOLS).map(x=>JSON.stringify(x))).size,8);
 assert.equal(new Set(Object.values(E.SLOT_AFFIX_POOLS).flat()).size,20);
 assert(!ordinaryAffixKeys('weapon').some(k=>k.endsWith('Resist')||['hp','armor','luck'].includes(k)));
 for(const slot of E.SLOTS){const pool=ordinaryAffixKeys(slot);assert(Object.isFrozen(pool));assert(pool.length>=4);assert.equal(new Set(pool).size,pool.length);assert(pool.every(k=>E.ACTIVE_AFFIX_KEYS.includes(k)));const seen=new Set();for(let q=0;q<=3;q++)for(const level of [1,20,100])for(let n=0;n<80;n++){const it=E.item(slot,level,null,q);check(it);assert(q===0?it.affixes.length<=1:it.affixes.length===q+1);it.affixes.forEach(a=>seen.add(a.stat));}assert.deepEqual([...seen].sort(),[...pool].sort());}
 // Set generation and every canonical legendary share the slot policy, excluding
 // authored zero-affix relics whose factory must consume no randomness.
 for(const set of E.BUILD)for(const slot of E.SET_SLOTS){const it=E.item(slot,70,set.id,3);check(it);assert.equal(it.set,set.id);assert.equal(it.special,null);}
 for(const [id,d] of Object.entries(LEGENDARY_EQUIPMENT_DEFINITIONS)){const it=E.legendaryItem(id,77);check(it);assert.equal(it.affixes.length,d.ordinaryAffixCount??4);assert.equal(it.special,null);if(d.ordinaryAffixCount===0)assert(createLegendaryEquipment({id:'no-roll',legendaryId:id,level:77,affixDefs:E.AFFIX_DEFS,random:()=>{throw Error('authored relic rolled');}}));}
 for(let n=0;n<30;n++){const s=state();s.level=100;check(E.forge(s,['铁屑|0']));for(const o of E.ensureMerchant(s,1000).offers)if(o.type==='equipment')check(o.item);}
 for(const slot of E.SLOTS){const s=state(),it=E.item(slot,60,null,3);s.inventory.push(it);const identity={...it,affixes:null,special:null,divine:null};for(let n=0;n<20;n++){assert(E.reforge(s,it.id,'all'));assert.equal(s.pendingReforge.ruleVersion,8);assert(E.validSave(JSON.parse(JSON.stringify(s))));assert(E.resolveReforge(s,true));check(it);assert.deepEqual({...it,affixes:null,special:null,divine:null},identity);}}
 // Off-pool owned gear remains legal. Value wash retains immutable source; same
 // slot inheritance transfers exact raw+source, even though new rolls forbid it.
 const s=state(),it=E.item('weapon',1,null,0),donor=E.item('weapon',100,null,0);it.affixes=[affix('fireResist',3,20)];donor.affixes=[affix('waterResist',4,100)];s.inventory.push(it,donor);assert(E.validSave(s));assert(E.reforge(s,it.id,'value',0));assert.equal(s.pendingReforge.newAffixes[0].stat,'fireResist');assert.deepEqual(s.pendingReforge.newAffixes[0].sourceRange,it.affixes[0].sourceRange);assert(E.resolveReforge(s,true));assert(E.reforge(s,it.id,'replace',0,donor.id));assert.deepEqual(s.pendingReforge.newAffixes[0],donor.affixes[0]);assert(E.resolveReforge(s,true));assert(E.validSave(s));
 // Persisted v7 paid all-mode candidate can contain resists on a weapon. v8
 // rejects the same candidate without spending/re-rolling; v7 resolves verbatim.
 assert(E.reforge(s,it.id,'all'));s.pendingReforge.newAffixes=[affix('earthResist',0,1)];s.pendingReforge.newDivine=null;assert(!E.validPendingReforge(s));s.pendingReforge.ruleVersion=7;assert(E.validSave(s));const pending=JSON.parse(JSON.stringify(s));const gold=pending.gold;Math.random=()=>{throw Error('paid replay consumed RNG');};assert(E.resolveReforge(pending,true));assert.equal(pending.gold,gold);assert.deepEqual(pending.inventory.find(x=>x.id===it.id).affixes,[affix('earthResist',0,1)]);assert(E.validSave(pending));
 console.log('PASS slot pools: 7,680 generated ordinary items, sets, canonical legends, merchant/forge, v8 rerolls, legacy v7/value/inheritance, immutable sources');
}finally{Math.random=oldRandom;}
