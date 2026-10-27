import {addTestEquipment} from './equipped-test-fixture.mjs';
import {currentAffix} from './current-equipment-test-fixture.mjs';
import {fresh} from './dist/engine.js';
import assert from 'node:assert/strict';
import {item,reforge,resolveReforge,eligibleReforgeDonors,validSave,getReforgeCost,AFFIX_DEFS,SPECIALS,ensureMerchant,purchaseConsumable,encounter,reward,normalizeTalents,normalizeAreaProgress,startInstanceEncounter,saveLoadout,equipItem} from './dist/engine.js';
const original=Math.random;let seed=11432;const rng=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/2**32;};Math.random=rng;
const target=(s,q=2,set=null)=>{const it=item(set?'gloves':'weapon',1,set,q);if(!it.affixes.length)it.affixes=[currentAffix('atk',3)];s.inventory.push(it);return it;};
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
  const s=fresh(),it=target(s);it.special={id:'knowledge'};s.consumables.reforgeToken=1;
  let donor;if(mode==='replace'){donor=item(it.slot,1,null,0);const stat=Object.keys(AFFIX_DEFS).find(k=>!it.affixes.some(a=>a.stat===k));donor.affixes=[currentAffix(stat,AFFIX_DEFS[stat].min)];s.inventory.push(donor);}
  assert(reforge(s,it.id,mode,0,donor?.id));const p=s.pendingReforge;p.newAffixes=p.newAffixes.map(legacyAffix);delete p.ruleVersion;delete p.oldDivine;delete p.newDivine;delete p.oldSpecial;delete p.newSpecial;delete p.donor;p.cost=mode==='all'?{gold:90,materials:{'铁屑':3,'炉火晶':2}}:{gold:45,materials:{'铁屑':2,'炉火晶':1}};
  assert(!validSave(s));const snapshot=JSON.stringify(s);assert.equal(resolveReforge(s,true),null);assert.equal(JSON.stringify(s),snapshot);
 }
 // Donors contribute an eligible ordinary stat and its original raw value (v0.29).
 const s=fresh(),it=target(s);it.affixes=[currentAffix('atk',3),currentAffix('hp',15),currentAffix('crit',5)];const donor=item(it.slot,1,null,1);donor.affixes=[currentAffix('armor',6),currentAffix('atk',8)];s.inventory.push(donor);const oldGold=s.gold;
 assert.deepEqual(eligibleReforgeDonors(s,it.id,0).find(x=>x.item.id===donor.id).affixes,[currentAffix('armor',6),currentAffix('atk',8)]);
 for(const flag of ['locked','legendaryId']){donor[flag]=flag==='locked'?true:'fake';assert(!eligibleReforgeDonors(s,it.id,0).some(x=>x.item.id===donor.id));donor[flag]=flag==='locked'?false:null;}
 equipItem(s,donor.id,it.slot);assert(!eligibleReforgeDonors(s,it.id,0).some(x=>x.item.id===donor.id));saveLoadout(s,0,'protected');addTestEquipment(s,{socket:it.slot});assert(!eligibleReforgeDonors(s,it.id,0).some(x=>x.item.id===donor.id));s.loadouts[0]=null;
 Math.random=()=>0;const r=reforge(s,it.id,'replace',0,donor.id);assert(r);assert.equal(r.after[0].stat,'armor');assert.equal(r.after[0].value,6);assert(!s.inventory.some(x=>x.id===donor.id));assert.equal(s.gold,oldGold);assert.deepEqual(r.newSpecial,it.special??null);assert(resolveReforge(s,false));assert(!s.inventory.some(x=>x.id===donor.id));
 // A donor matching another retained slot is invalid and consumes nothing.
 const d=item(it.slot,1,null,0);d.affixes=[currentAffix('hp',20)];s.inventory.push(d);let calls=0;Math.random=()=>{calls++;return 0;};let before=JSON.stringify(s);assert.equal(reforge(s,it.id,'replace',0,d.id),null);assert.equal(reforge(s,it.id,'replace',0,it.id),null);assert.equal(calls,0);assert.equal(JSON.stringify(s),before);
 // Current A03 boss reward: independent mark, equipment/material coexistence and once-only guard.
 const bossState=()=>{const s=fresh();normalizeAreaProgress(s);s.areaProgress.dwarf={unlocked:[1,2,3],cleared:[1,2]};const e=startInstanceEncounter(s,'dwarf.a03.boss',s.lastSeen);assert(e);e.done=e.win=true;e.targetId=null;e.hp=0;for(const u of e.enemies)u.hp=0;return s;};
 const template=bossState();let b,e,simultaneous;
 for(let seed=0;seed<2000;seed++){const s=structuredClone(template),enc=s.activeEncounter;enc.rngState=seed;const drop=reward(s,enc,s.lastHealthClock);if(drop&&s.consumables.reforgeToken===1&&enc.materialLoot.length){b=s;e=enc;simultaneous=drop;break;}}
 assert(simultaneous);assert.equal(b.consumables.reforgeToken,1);assert(e.rewardNotes.includes('重铸印记 ×1'));const settled=JSON.stringify(b);reward(b,e,b.lastHealthClock);assert.equal(JSON.stringify(b),settled);
 let fullHit=false;for(let seed=0;seed<2000&&!fullHit;seed++){const full=structuredClone(template);for(const slot of ['weapon','helm','armor','gloves','boots','ring','amulet'])while(full.inventory.filter(it=>it.slot===slot).length<50)full.inventory.push(item(slot,1,null,0));const fe=full.activeEncounter;fe.rngState=seed;reward(full,fe,full.lastHealthClock);if(full.consumables.reforgeToken){fullHit=true;assert.equal(full.consumables.reforgeToken,1);assert.equal(full.consumables.memoryFruit,0);assert(fe.materialLoot.length>0);}}assert(fullHit);
 const failed=bossState(),failure=failed.activeEncounter;failure.win=false;const failedBefore=JSON.stringify(failed);assert.equal(reward(failed,failure,failed.lastSeen),null);assert.equal(JSON.stringify(failed),failedBefore);
 const blocked=structuredClone(template);blocked.activeEncounter=null;blocked.instanceCooldowns['dwarf.a03.boss']=blocked.lastHealthClock+60000;assert.equal(startInstanceEncounter(blocked,'dwarf.a03.boss',blocked.lastHealthClock),null);
 const normal=fresh(),ne=encounter(normal);ne.done=ne.win=true;ne.targetId=null;ne.hp=0;for(const u of ne.enemies)u.hp=0;reward(normal,ne,normal.lastSeen);assert.equal(normal.consumables.reforgeToken,0);
 Math.random=()=>0;
 const shopState=fresh();shopState.gold=1000;const m=ensureMerchant(shopState,1000);assert.equal(m.offers.length,8);assert(m.offers.some(o=>o.consumable==='memoryFruit'));const offer=m.offers.find(o=>o.consumable==='reforgeToken');assert(offer);assert(purchaseConsumable(shopState,offer.offerId,0,1001));assert.equal(shopState.gold,880);assert.equal(shopState.consumables.reforgeToken,1);assert(!purchaseConsumable(shopState,offer.offerId,0,1002));assert(validSave(shopState));
 Math.random=rng;let fruit=0,token=0,both=0;for(let i=0;i<10000;i++){const p=fresh(),m=ensureMerchant(p,1000),f=m.offers.some(o=>o.consumable==='memoryFruit'),t=m.offers.some(o=>o.consumable==='reforgeToken');fruit+=f;token+=t;both+=f&&t;assert.equal(m.offers.length,8);}assert(fruit>230&&fruit<370);assert(token>850&&token<1150);assert(both>10);console.log({fruit,token,both});
 console.log('v0.13 token/full-special/donor costs, exclusions, legacy pending and merchant/boss reward guards: PASS');
}finally{Math.random=original;}
