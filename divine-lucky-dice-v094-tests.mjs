import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
import {luckyDiceStatBonuses,rollLuckyDice,validLuckyDiceOutcome} from './dist/lucky-dice.js';
const clone=structuredClone;
const originalRandom=Math.random;let factorySeed=940033;
Math.random=()=>{factorySeed=(Math.imul(factorySeed,1664525)+1013904223)>>>0;return factorySeed/2**32;};
function item(model){
 const it=E.legendaryItem('lucky-dice',33);assert(it);
 if(model){assert(E.applyForgeFavor(it));if(model==='raw-v1'){it.divine.model=model;for(const key of ['atk','armor','hp'])it.divine.bonus[key]=it[key]/10;}}
 return it;
}
function state(it){
 const s=E.fresh();s.level=100;s.skills=[null,null,null,null];s.conditions=['always','always','always','always'];s.skillTree.presets[0].active=[null,null,null,null];s.skillTree.presets[0].passive=[null,null];s.lastSeen=s.lastHealthClock=10000;s.nextBattleAt=0;s.restUntil=0;s.inventory.push(it);assert(E.equipItem(s,it.id));s.heroHp=E.stats(s).hp;return s;
}
function battle(s){const e=E.startInstanceEncounter(s,'dwarf.a01.field',10000);assert(e);for(const u of e.enemies){u.hp=u.max=1000000;u.armor=u.atk=u.shield=0;u.control.stunUntil=1e12;}return e;}
function step(s,seed){const e=s.activeEncounter;if(seed!==undefined)e.rngState=seed;return E.step(s,e,s.nextActionAt);}
try{
 for(const model of [null,'raw-v1','raw-v2']){
  const it=item(model),before=JSON.stringify(it),power=model?2:1;
  assert.deepEqual(luckyDiceStatBonuses(it),{luck:33*power,crit:33*power});
  const s=state(it),naked=clone(s);naked.equip.amulet=null;
  assert.equal(E.baseStats(s).luck-E.baseStats(naked).luck,33*power);
  assert.equal(E.baseStats(s).critRating-E.baseStats(naked).critRating,33*power);
  assert.equal(E.baseStats(s).atk-E.baseStats(naked).atk,33*power);
  assert.equal(E.baseStats(s).hp-E.baseStats(naked).hp,333*power);
  const edges=[[0,'low',.75,null],[.33-Number.EPSILON,'low',.75,null],[.33,'high',model?1.5:1.25,null],[.66-Number.EPSILON,'high',model?1.5:1.25,null],[.66,'normal',1,null],[.99-Number.EPSILON,'normal',1,null],[.99,'jackpot',1,3333*power],[1-Number.EPSILON,'jackpot',1,3333*power]];
  for(const [roll,outcome,multiplier,fixedDamage] of edges){let draws=0;const result=rollLuckyDice(()=>{draws++;return roll;},it);assert.equal(draws,1);assert.deepEqual(result,{outcome,multiplier,fixedDamage});assert(validLuckyDiceOutcome(JSON.parse(JSON.stringify(result))));assert.deepEqual(Object.keys(result),['outcome','multiplier','fixedDamage']);}
  const counts={low:0,high:0,normal:0,jackpot:0};for(let n=0;n<10000;n++)counts[rollLuckyDice(()=>(n+.5)/10000,it).outcome]++;assert.deepEqual(counts,{low:3300,high:3300,normal:3300,jackpot:100});
  assert(E.validSave(s));battle(s);const st=E.stats(s),seen=new Map();
  // Reconstruct encounter RNG only to select deterministic noncritical hit seeds;
  // all damage, outcome receipts and save checks use the actual production host.
  for(let seed=0;seed<20000&&seen.size<4;seed++){
   let rng=seed;const draw=()=>{rng=(Math.imul(rng,1664525)+1013904223)>>>0;return rng/2**32;};const hit=draw(),roll=draw(),crit=draw();if(hit>=st.hit||crit<st.crit)continue;
   const expected=rollLuckyDice(()=>roll,it);if(seen.has(expected.outcome))continue;
   const trial=clone(s),logs=step(trial,seed),cast=trial.activeEncounter.lastCast;
   assert.deepEqual(cast.luckyDice,expected);assert.equal(cast.hits[0].actualHpLost,expected.fixedDamage??Math.max(1,Math.round(st.atk*expected.multiplier)));
   if(expected.outcome==='high')assert(logs.some(x=>x.includes(`伤害 +${model?50:25}%`)));
   if(expected.outcome==='jackpot')assert(logs.some(x=>x.includes(`固定伤害 ${3333*power}`)));
   assert(E.validSave(trial));const restored=JSON.parse(JSON.stringify(trial));assert(E.validSave(restored));assert.deepEqual(step(restored),step(trial));assert.deepEqual(restored,trial);seen.set(expected.outcome,seed);
  }
  assert.equal(seen.size,4);
  for(const shield of [1000,10000]){const trial=clone(s),e=trial.activeEncounter;e.enemies[0].armor=1000000;e.enemies[0].shield=shield;e.enemies[0].shieldUntil=1e12;e.warcry=e.weakness=3;step(trial,seen.get('jackpot'));assert.equal(e.enemies[0].shield,Math.max(0,shield-3333*power));assert.equal(e.lastCast.hits[0].actualHpLost,Math.max(0,3333*power-shield));assert(E.validSave(trial));}
  const active=clone(s);active.skillTree.presets[0].unlocked=E.SKILL_TREE_DEFINITION.nodes.map(n=>n.id);active.skillTree.presets[0].active=['fracture_strike',null,null,null];step(active,1);assert.equal(active.activeEncounter.lastCast.skillId,'fracture_strike');assert.equal(active.activeEncounter.lastCast.luckyDice,undefined);assert(E.validSave(active));
  assert.equal(JSON.stringify(it),before,'runtime and saves never rewrite authored bases or divine receipt');
 }
 for(const bad of [null,[],{}, {outcome:'high',multiplier:2.5,fixedDamage:null},{outcome:'low',multiplier:.5,fixedDamage:null},{outcome:'normal',multiplier:2,fixedDamage:null},{outcome:'high',multiplier:1.5,fixedDamage:6666},{outcome:'jackpot',multiplier:1.5,fixedDamage:6666},{outcome:'jackpot',multiplier:1,fixedDamage:6666,divine:true}])assert(!validLuckyDiceOutcome(bad));
 for(const model of ['bad',undefined]){const it=item(null);it.divine={id:'forge-favor',model};assert.deepEqual(luckyDiceStatBonuses(it),{luck:33,crit:33});assert.equal(rollLuckyDice(()=>.99,it).fixedDamage,3333);}
 for(const n of [-1,1,Infinity,NaN,'0.3'])assert.throws(()=>rollLuckyDice(()=>n,item('raw-v2')),RangeError);
 console.log('PASS v094 Lucky Dice: normal/raw-v1/raw-v2 real factory + forge, fixed stat aggregation, exact 33/33/33/1 edges, strict receipts, production all4 damage/logs, shield and armor bypass, skills excluded, JSON replay and raw metadata unchanged');
}finally{Math.random=originalRandom;}
