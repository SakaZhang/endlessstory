import {legacyFresh as fresh} from './legacy-skill-test-fixture.mjs';
import assert from 'node:assert/strict';
import {item,reforge,resolveReforge,eligibleReforgeDonors,validSave,getReforgeCost,AFFIX_DEFS,SPECIALS,ensureMerchant,purchaseConsumable,encounter,reward,normalizeTalents,saveLoadout,equipItem} from './dist/engine.js';
const original=Math.random;let seed=11432;const rng=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/2**32;};Math.random=rng;
const target=(s,q=2,set=null)=>{const it=item(set?'gloves':'weapon',1,set,q);if(!it.affixes.length)it.affixes=[{stat:'atk',value:3}];s.inventory.push(it);return it;};
try{
 const legacy=fresh();delete legacy.consumables.reforgeToken;assert(validSave(legacy));normalizeTalents(legacy);assert.equal(legacy.consumables.reforgeToken,0);
 for(const q of [0,1,2,3])for(const set of [null,...(q===3?['anvil']:[])]){
  const s=fresh(),it=target(s,q,set);s.consumables.reforgeToken=1;const before=JSON.stringify(it),gold=s.gold,materials=JSON.stringify(s.materialStacks);
  const r=reforge(s,it.id,'all');assert(r);assert.equal(s.consumables.reforgeToken,0);assert.equal(s.gold,gold);assert.equal(JSON.stringify(s.materialStacks),materials);assert.equal(JSON.stringify(it),before);
  assert.equal(!!r.newSpecial,!set&&q>=2);assert(validSave(s));assert(resolveReforge(s,true,r.operationId));assert.equal(!!it.special,!set&&q>=2);assert(validSave(s));
 }
 const seen=new Set();for(let i=0;i<100;i++){const s=fresh(),it=target(s);s.consumables.reforgeToken=1;const r=reforge(s,it.id,'all');seen.add(r.newSpecial.id);assert(resolveReforge(s,false));assert.equal(s.consumables.reforgeToken,0);}assert.equal(seen.size,Object.keys(SPECIALS).length);
 const legacyAffix=a=>({stat:a.stat,value:Math.min(AFFIX_DEFS[a.stat].max,Math.max(AFFIX_DEFS[a.stat].min,a.value))});
 // Old v0.12 pending quotes resolve under their original rules, with no token.
 for(const mode of ['all','replace']){
  const s=fresh(),it=target(s);it.affixes=it.affixes.map(legacyAffix);it.special={id:'knowledge'};s.consumables.reforgeToken=1;
  let donor;if(mode==='replace'){donor=item('ring',1,null,0);const stat=Object.keys(AFFIX_DEFS).find(k=>!it.affixes.some(a=>a.stat===k));donor.affixes=[{stat,value:AFFIX_DEFS[stat].min}];s.inventory.push(donor);}
  assert(reforge(s,it.id,mode,0,donor?.id));const p=s.pendingReforge;p.newAffixes=p.newAffixes.map(legacyAffix);delete p.ruleVersion;delete p.oldDivine;delete p.newDivine;delete p.oldSpecial;delete p.newSpecial;delete p.donor;p.cost=mode==='all'?{gold:90,materials:{'铁屑':3,'炉火晶':2}}:{gold:45,materials:{'铁屑':2,'炉火晶':1}};
  assert(validSave(s));const oldGold=s.gold;assert(resolveReforge(s,true));assert.equal(it.special.id,'knowledge');assert.equal(s.gold,oldGold);
 }
 // Donors contribute an eligible ordinary stat and its original raw value (v0.29).
 const s=fresh(),it=target(s);it.affixes=[{stat:'atk',value:3},{stat:'hp',value:15},{stat:'crit',value:5}];const donor=item('ring',1,null,1);donor.affixes=[{stat:'armor',value:6},{stat:'atk',value:8}];donor.special={id:'knowledge'};s.inventory.push(donor);const oldGold=s.gold;
 assert.deepEqual(eligibleReforgeDonors(s,it.id,0).find(x=>x.item.id===donor.id).affixes,[{stat:'armor',value:6},{stat:'atk',value:8}]);
 for(const flag of ['locked','legendaryId']){donor[flag]=flag==='locked'?true:'fake';assert(!eligibleReforgeDonors(s,it.id,0).some(x=>x.item.id===donor.id));donor[flag]=flag==='locked'?false:null;}
 equipItem(s,donor.id,'ring1');assert(!eligibleReforgeDonors(s,it.id,0).some(x=>x.item.id===donor.id));saveLoadout(s,0,'protected');equipItem(s,s.inventory[5].id,'ring1');assert(!eligibleReforgeDonors(s,it.id,0).some(x=>x.item.id===donor.id));s.loadouts[0]=null;
 Math.random=()=>0;const r=reforge(s,it.id,'replace',0,donor.id);assert(r);assert.equal(r.after[0].stat,'armor');assert.equal(r.after[0].value,6);assert(!s.inventory.some(x=>x.id===donor.id));assert.equal(s.gold,oldGold);assert.deepEqual(r.newSpecial,it.special??null);assert(resolveReforge(s,false));assert(!s.inventory.some(x=>x.id===donor.id));
 // A donor matching another retained slot is invalid and consumes nothing.
 const d=item('ring',1,null,0);d.affixes=[{stat:'hp',value:20}];s.inventory.push(d);let calls=0;Math.random=()=>{calls++;return 0;};let before=JSON.stringify(s);assert.equal(reforge(s,it.id,'replace',0,d.id),null);assert.equal(reforge(s,it.id,'replace',0,it.id),null);assert.equal(calls,0);assert.equal(JSON.stringify(s),before);
 // Boss reward: real finished encounter, cooldown, and reward-once guards.
 Math.random=()=>0;const b=fresh(),e=encounter(b,true);e.done=true;e.win=true;const simultaneous=reward(b,e,Date.now());assert(simultaneous);assert(e.materialLoot.reduce((n,x)=>n+x.count,0)>=4);assert.equal(b.consumables.reforgeToken,1);assert(e.rewardNotes.includes('重铸印记 ×1'));reward(b,e,Date.now());assert.equal(b.consumables.reforgeToken,1);
 const full=fresh();for(const slot of ['weapon','helm','armor','gloves','boots','ring','amulet'])while(full.inventory.filter(it=>it.slot===slot).length<50)full.inventory.push(item(slot,1,null,0));const fe=encounter(full,true);fe.done=true;fe.win=true;assert.equal(reward(full,fe,Date.now()),null);assert.equal(full.consumables.reforgeToken,1);assert(fe.materialLoot.length>0);assert.equal(full.consumables.memoryFruit,0);
 const failed=fresh(),failure=encounter(failed,true);failure.done=true;failure.win=false;reward(failed,failure,Date.now());assert.equal(failed.consumables.reforgeToken,0);
 const blocked=fresh();blocked.bossReady[0]=Date.now()+60000;const be=encounter(blocked,true);assert.equal(be,null);assert.equal(blocked.consumables.reforgeToken,0);
 Math.random=()=>.99;const miss=fresh(),me=encounter(miss,true);me.done=true;me.win=true;reward(miss,me,Date.now());assert.equal(miss.consumables.reforgeToken,0);
 Math.random=()=>0;const normal=fresh(),ne=encounter(normal);ne.done=true;ne.win=true;reward(normal,ne,Date.now());assert.equal(normal.consumables.reforgeToken,0);
 const shopState=fresh();shopState.gold=1000;const m=ensureMerchant(shopState,1000);assert.equal(m.offers.length,8);assert(m.offers.some(o=>o.consumable==='memoryFruit'));const offer=m.offers.find(o=>o.consumable==='reforgeToken');assert(offer);assert(purchaseConsumable(shopState,offer.offerId,0,1001));assert.equal(shopState.gold,880);assert.equal(shopState.consumables.reforgeToken,1);assert(!purchaseConsumable(shopState,offer.offerId,0,1002));assert(validSave(shopState));
 Math.random=rng;let fruit=0,token=0,both=0;for(let i=0;i<10000;i++){const p=fresh(),m=ensureMerchant(p,1000),f=m.offers.some(o=>o.consumable==='memoryFruit'),t=m.offers.some(o=>o.consumable==='reforgeToken');fruit+=f;token+=t;both+=f&&t;assert.equal(m.offers.length,8);}assert(fruit>230&&fruit<370);assert(token>850&&token<1150);assert(both>10);console.log({fruit,token,both});
 console.log('v0.13 token/full-special/donor costs, exclusions, legacy pending and merchant/boss reward guards: PASS');
}finally{Math.random=original;}
