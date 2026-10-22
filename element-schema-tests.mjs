import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import * as engine from './dist/engine.js';
import {ELEMENT_KEYS,ELEMENTS,ELEMENT_AFFIX_DEFS} from './dist/element-schema.js';

// Fingerprint excludes generated identity/time/template cosmetics only; all rolled values and RNG
// consumption are covered by the subsequent output sequence.
export function sequenceFingerprint(api){
 const random=Math.random;let seed=81732;Math.random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/2**32;};
 try{
  const outputs=[];
  for(let i=0;i<400;i++){const {id,name,templateId,baseVariant,weaponType,originRace,visualKey,visualVariant,iconKey,...it}=api.item(api.SLOTS[i%api.SLOTS.length],1+i%9,null,i%4);outputs.push(it);}
  const s=api.fresh();s.consumables.reforgeToken=10000;s.gold=1e7;s.materialStacks['铁屑|0']=1e6;s.materialStacks['炉火晶|0']=1e6;
  const it=api.item('gloves',5,null,3);s.inventory.push(it);
  for(let i=0;i<300;i++){const mode=['value','replace','all'][i%3];let donor;if(mode==='replace'){donor=api.item('ring',1,null,0);const stat=api.ACTIVE_AFFIX_KEYS.find(k=>!it.affixes.some(a=>a.stat===k));donor.affixes=[{stat,value:api.AFFIX_DEFS[stat].min}];s.inventory.push(donor);}const result=api.reforge(s,it.id,mode,i%4,donor?.id);assert(result);outputs.push(result.after);assert(api.resolveReforge(s,true));}
  return createHash('sha256').update(JSON.stringify(outputs)).digest('hex');
 }finally{Math.random=random;}
}

assert.deepEqual(engine.ACTIVE_AFFIX_KEYS,['atk','hp','armor','hit','crit','critDamage',...Object.keys(ELEMENT_AFFIX_DEFS)]);
assert.equal(Object.keys(ELEMENT_AFFIX_DEFS).length,12);
assert.deepEqual(ELEMENT_KEYS.map(k=>ELEMENTS[k].name),['地','水','火','风','光','暗']);
for(const [key,def] of Object.entries(ELEMENT_AFFIX_DEFS)){
 assert(engine.ACTIVE_AFFIX_KEYS.includes(key));assert(Object.hasOwn(engine.AFFIX_DEFS,key));
 assert.equal(def.enabled,true);assert.equal(def.unit,'flat');
}
assert(!engine.ACTIVE_AFFIX_KEYS.includes('element'));
assert(Object.hasOwn(engine.AFFIX_DEFS,'element')); // Legacy equipment remains valid.
const fingerprint=sequenceFingerprint(engine);
try{
 engine.AFFIX_DEFS.unreleasedTestOnly={name:'test',min:1,max:2};
 assert.equal(sequenceFingerprint(engine),fingerprint);
}finally{delete engine.AFFIX_DEFS.unreleasedTestOnly;}
console.log('Element schema isolation and active seeded item/reforge sequence:',fingerprint);
