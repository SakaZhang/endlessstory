import {legacyFresh as fresh} from './legacy-skill-test-fixture.mjs';
import assert from 'node:assert/strict';
import {item,getReforgeCost,reforge,resolveReforge,applyForgeFavor,affixRollInfo,AFFIX_DEFS,stats,equipItem,validSave} from './dist/engine.js';
const original=Math.random;let seed=51481,calls=0;Math.random=()=>{calls++;seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/2**32;};
try{
 const s=fresh();s.consumables.reforgeToken=10000;s.gold=1e7;s.materialStacks['铁屑|0']=1e6;s.materialStacks['炉火晶|0']=1e6;
 const it=item('gloves',5,null,3);it.locked=true;it.bless=2;it.special={id:'knowledge'};applyForgeFavor(it);s.inventory.push(it);equipItem(s,it.id);
 let c=calls;for(let i=0;i<100;i++)for(const mode of ['value','replace','all'])assert(getReforgeCost(it,mode));assert.equal(calls,c);
 assert.deepEqual(getReforgeCost(it,'value'),{gold:25,materials:{'铁屑':1}});assert.deepEqual(getReforgeCost(it,'replace'),{gold:0,materials:{},equipment:1});assert.deepEqual(getReforgeCost(it,'all'),{gold:0,materials:{},consumables:{reforgeToken:1}});
 for(const [id,mode,index] of [['missing','value',0],[it.id,'bad',0],[it.id,'value',-1],[it.id,'replace',4],[it.id,'value',.5],[s.inventory[0].id,'all',0]]){const before=JSON.stringify(s),n=calls;assert.equal(reforge(s,id,mode,index),null);assert.equal(JSON.stringify(s),before);assert.equal(calls,n);}
 const fixed=({affixes,divine,special,...rest})=>({...rest,divine:{...divine,bonus:{...divine.bonus,affixes:undefined}}});const identity=fixed(structuredClone(it));
 for(let i=0;i<3000;i++){
  const mode=['value','replace','all'][i%3],index=i%4,before=structuredClone(it.affixes),gold=s.gold,iron=s.materialStacks['铁屑|0'],crystal=s.materialStacks['炉火晶|0'],cost=getReforgeCost(it,mode);
  let donor;if(mode==='replace'){donor=item('ring',1,null,1);donor.affixes=[{stat:Object.keys(AFFIX_DEFS).find(k=>!it.affixes.some(a=>a.stat===k)),value:3}];s.inventory.push(donor);}
  const result=reforge(s,it.id,mode,index,donor?.id);assert(result);assert.equal(result.item,it);assert.deepEqual(it.affixes,before);assert(resolveReforge(s,true));assert.equal(s.gold,gold-cost.gold);assert.equal(s.materialStacks['铁屑|0'],iron-(cost.materials['铁屑']||0));assert.equal(s.materialStacks['炉火晶|0'],crystal-(cost.materials['炉火晶']||0));
  assert.equal(it.affixes.length,4);assert.equal(new Set(it.affixes.map(a=>a.stat)).size,4);assert.deepEqual(fixed(it),identity);assert.deepEqual(result.before,before);
  if(mode==='value')assert.equal(it.affixes[index].stat,before[index].stat);
  if(mode==='replace')assert.notEqual(it.affixes[index].stat,before[index].stat);
  if(mode!=='all')it.affixes.forEach((a,j)=>{if(j!==index)assert.deepEqual(a,before[j]);});
  for(const a of it.affixes){const d=AFFIX_DEFS[a.stat];assert(a.value>=d.min&&a.value<=d.max);assert.equal(affixRollInfo(a).raw,a.value);assert.equal(it.divine.bonus.affixes.find(b=>b.stat===a.stat).value,a.value/10);}
 }
 assert(validSave(s));assert.deepEqual(stats(JSON.parse(JSON.stringify(s))),stats(s));
 let snapshot=JSON.stringify(s);s.gold=0;s.consumables.reforgeToken=0;let noMoney=JSON.stringify(s);c=calls;assert.equal(reforge(s,it.id,'all'),null);assert.equal(JSON.stringify(s),noMoney);assert.equal(calls,c);Object.assign(s,JSON.parse(snapshot));
 s.materialStacks['炉火晶|0']=0;noMoney=JSON.stringify(s);assert.equal(reforge(s,it.id,'replace',0),null);assert.equal(JSON.stringify(s),noMoney);
 // Values change actual equipped combat stats, not only labels; divine color remains raw.
 const p=fresh(),gear=item('weapon',1,null,0);gear.affixes=[{stat:'atk',value:3}];applyForgeFavor(gear);p.inventory.push(gear);equipItem(p,gear.id);const low=stats(p).atk;Math.random=()=>.999999;
 const result=reforge(p,gear.id,'value',0);assert(resolveReforge(p,true));assert.equal(result.item.affixes[0].value,8);assert(stats(p).atk>low);assert.equal(affixRollInfo(gear.affixes[0]).tier,3);assert.equal(gear.divine.bonus.affixes[0].value,.8);assert(validSave(p));
 // Sets retain their four-piece identities and no-special invariant.
 const set=item('gloves',2,'anvil',3);p.inventory.push(set);p.gold=1000;p.consumables.reforgeToken=1;p.materialStacks={'铁屑|0':10,'炉火晶|0':10,'誓约残片|0':1};assert(reforge(p,set.id,'all'));assert.equal(set.set,'anvil');assert.equal(set.special,null);assert(validSave(p));
 console.log('v0.5 reforge: 3,000 operations, atomic costs, invalid/no-RNG previews, legal rolls, identity/divine persistence, real stats: PASS');
}finally{Math.random=original;}
