import assert from 'node:assert/strict';
import {fresh,stats,encounter,step,validSave,normalizeEncounterElements,applyForgeFavor,resolveElementDamage,ACTIVE_AFFIX_KEYS,item,reforge} from './dist/engine.js';
import {ELEMENT_KEYS,ELEMENT_COUNTERS} from './dist/element-schema.js';
for(const type of ELEMENT_KEYS){
 assert.equal(resolveElementDamage(100,type,0,0,[]),100);
 assert(Math.abs(resolveElementDamage(100,type,0,0,[ELEMENT_COUNTERS[type]])-110)<1e-10);
 assert.equal(resolveElementDamage(100,type,0,0,ELEMENT_KEYS),resolveElementDamage(100,type,0,0,[ELEMENT_COUNTERS[type]]));
 assert(resolveElementDamage(100,type,0,1e12,[])>=50);
 assert(resolveElementDamage(100,type,1e12,0,[])<=150);
 assert.equal(resolveElementDamage(100,type,20,20,[]),100);
}
assert.throws(()=>resolveElementDamage(100,'physical',0,0));
const oldRandom=Math.random;Math.random=()=>.5;
try{
 const run=(skill,affix=null,armor=0,tags=[],res=0)=>{
  const s=fresh();s.skills=[skill,null,null,null];s.conditions=['always','always','always','always'];
  if(affix)s.inventory[0].affixes=[affix];
  const e=encounter(s);e.hp=e.max=1e6;e.armor=armor;e.elementTags=tags;e.elementResistance=Object.fromEntries(ELEMENT_KEYS.map(k=>[k,res]));e.atk=0;
  step(s,e);return {dealt:1e6-e.hp,s,e};
 };
 for(const skill of [null,'break','guard','scorch']){
  assert.equal(run(skill).dealt,run(skill,{stat:'element',value:7}).dealt);
  assert.equal(run(skill).dealt,run(skill,{stat:'fireAtk',value:7}).dealt);
 }
 for(const skill of ['mark','ignite']){
  assert.equal(run(skill,null,0).dealt,run(skill,null,100000).dealt);
  assert(run(skill,{stat:'element',value:7}).dealt>run(skill).dealt);
  assert(run(skill,{stat:'fireAtk',value:7}).dealt>run(skill).dealt);
  assert(run(skill,null,0,[],100).dealt<run(skill).dealt);
  assert(Math.abs(run(skill,null,0,['wind','earth','dark']).dealt/run(skill).dealt-1.1)<1e-9);
 }
 const s=fresh();s.inventory[0].affixes=[{stat:'element',value:2}];const raw=structuredClone(s.inventory[0]);applyForgeFavor(s.inventory[0]);assert.equal(stats(s).elementAttack.fire,2.2);assert.equal(stats(s).elementAttack.water,2.2);assert.deepEqual(s.inventory[0].affixes,raw.affixes);
 s.talents.elementResist=2;s.potionBuffs={fireResist:{quality:0,endAt:1e15}};assert.equal(stats(s).elementResistance.fire,40);assert.equal(stats(s).elementResistance.water,10);
 for(const type of ELEMENT_KEYS){
  const x=fresh();x.inventory[0].affixes=[{stat:type+'Atk',value:7},{stat:type+'Resist',value:12}];
  applyForgeFavor(x.inventory[0]);
  assert(Math.abs(stats(x).elementAttack[type]-7.7)<1e-10);
  assert(Math.abs(stats(x).elementResistance[type]-13.2)<1e-10);
  assert(resolveElementDamage(100,type,stats(x).elementAttack[type],0)>100);
  assert(resolveElementDamage(100,type,0,stats(x).elementResistance[type])<100);
 }
 const a=fresh();a.location=1;const e=encounter(a);e.hp-=3;e.cd.mark=4;delete e.elementTags;delete e.elementResistance;const hp=e.hp;
 assert(validSave(a));normalizeEncounterElements(e);assert.equal(e.hp,hp);assert.equal(e.cd.mark,4);assert.deepEqual(e.elementTags,['earth','fire']);assert.equal(e.elementResistance.fire,8);assert(validSave(JSON.parse(JSON.stringify(a))));
 e.elementTags=['fire','fire'];assert(!validSave(a));e.elementTags=['earth','fire'];e.elementResistance.fire=NaN;assert(!validSave(a));
 let seed=571;Math.random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/2**32;};
 const all=new Set();for(let i=0;i<20000;i++){const it=item('gloves',3,null,3);assert.equal(it.affixes.length,4);assert.equal(new Set(it.affixes.map(a=>a.stat)).size,4);it.affixes.forEach(a=>all.add(a.stat));}
 for(const k of ELEMENT_KEYS){assert(all.has(k+'Atk'));assert(all.has(k+'Resist'));}
 assert(!all.has('element'));assert([...all].every(k=>ACTIVE_AFFIX_KEYS.includes(k)));
}finally{Math.random=oldRandom;}
console.log('Typed six-element resolver, physical isolation, fire armor bypass, divine once, potion resistance, old encounter validation: PASS');
