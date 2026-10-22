import assert from 'node:assert/strict';
import {fresh,item,saveLoadout,deleteLoadout,applyLoadout,wardrobeIds,bagItems,bagCounts,claimForgeResult,isProtected,validSave,equipItem,forge,reforge,resolveReforge,SOCKETS,SOCKET_TYPE,encounter,reward,preset} from './dist/engine.js';
const original=Math.random;let seed=382;Math.random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/2**32;};
try{
 const s=fresh();assert.deepEqual(s.loadouts,[null,null,null]);assert(validSave(s));const old=structuredClone(s);delete old.loadouts;assert(validSave(old));assert(saveLoadout(old,0,'旧存档方案'));assert(validSave(old));
 assert(saveLoadout(s,0,'碎砧'));assert.equal(wardrobeIds(s).size,8);assert.equal(bagItems(s).length,0);const originalIds=[...wardrobeIds(s)];assert(originalIds.every(id=>isProtected(s,id)));
 assert(saveLoadout(s,1,'共用装备'));assert.equal(wardrobeIds(s).size,8);assert.equal(s.inventory.length,8);
 let gear=s.inventory.find(i=>i.id===s.equip.weapon);gear.rarity=1;gear.affixes=[{stat:'atk',value:3},{stat:'hp',value:15}];s.gold=1000;s.materialStacks['铁屑|0']=100;assert(reforge(s,gear.id,'value',0));assert(resolveReforge(s,true));assert.equal(s.loadouts[0].equip.weapon,s.loadouts[1].equip.weapon);assert.equal(s.inventory.filter(i=>i.id===gear.id).length,1);
 s.skills=['guard','mark','ignite'];s.conditions=['low','burn','charge'];const talents=structuredClone(s.talents);assert(saveLoadout(s,2,'守卫'));assert(applyLoadout(s,0));assert.deepEqual(s.skills,['break','heavy','interrupt',null]);assert(applyLoadout(s,2));assert.deepEqual(s.conditions,['low','burn','charge','always']);assert.deepEqual(s.talents,talents);
 s.running=true;let before=JSON.stringify(s);assert(!applyLoadout(s,0));assert.equal(JSON.stringify(s),before);s.running=false;before=JSON.stringify(s);assert(!applyLoadout(s,0,true));assert.equal(JSON.stringify(s),before);
 assert(validSave(JSON.parse(JSON.stringify(s))));let invalid=structuredClone(s);invalid.loadouts[0].equip.ring1=invalid.loadouts[0].equip.ring2;assert(!validSave(invalid));assert(!applyLoadout(invalid,0));invalid=structuredClone(s);invalid.loadouts[0].equip.weapon='missing';assert(!validSave(invalid));invalid=structuredClone(s);invalid.loadouts[0].equip.ring1=s.equip.weapon;assert(!validSave(invalid));invalid=structuredClone(s);invalid.loadouts[0].skills[1]=invalid.loadouts[0].skills[0];assert(!validSave(invalid));invalid=structuredClone(s);invalid.loadouts[0].conditions[0]='bad';assert(!validSave(invalid));
 // Existing overcapacity and returned wardrobe items are retained, never deleted.
 while(bagItems(s).length<100)s.inventory.push(item('ring',1,null,0));assert.equal(s.inventory.length,108);assert(validSave(s));
 assert(deleteLoadout(s,0));assert(deleteLoadout(s,1));assert(deleteLoadout(s,2));assert.equal(bagItems(s).length,108);assert(validSave(s));
 for(const socket of SOCKETS){const replacement=item(SOCKET_TYPE[socket],1,null,0);s.inventory.push(replacement);equipItem(s,replacement.id,socket);}
 assert(saveLoadout(s,2,'覆盖'));assert.equal(bagItems(s).length,108);assert.equal(s.inventory.length,116);assert(originalIds.every(id=>!isProtected(s,id)));assert(validSave(s));
 // Actual output determines its bag; a full destination holds the paid result.
 while(bagCounts(s).equipment.helm<50)s.inventory.push(item('helm',1,null,0));
 s.gold=1000;s.materialStacks['铁屑|0']=10;Math.random=()=>0;const result=forge(s,['铁屑']);assert(result);assert.equal(s.gold,960);assert(s.pendingForgeClaim);assert.equal(claimForgeResult(s),null);
 const remove=bagItems(s).find(it=>it.slot===result.slot).id;s.inventory=s.inventory.filter(it=>it.id!==remove);assert.equal(claimForgeResult(s).id,result.id);assert(validSave(s));
 const t=fresh();saveLoadout(t,0,'掉落柜');while(bagCounts(t).equipment.helm<49)t.inventory.push(item('helm',1,null,0));let e=encounter(t);e.done=true;e.win=true;assert(reward(t,e));assert.equal(bagCounts(t).equipment.helm,50);const count=t.inventory.length;t.nextBattleAt=0;e=encounter(t);e.done=true;e.win=true;assert.equal(reward(t,e),null);assert.equal(t.inventory.length,count);
 for(const index of [-1,3,1.5]){before=JSON.stringify(s);assert(!saveLoadout(s,index,'无效'));assert(!deleteLoadout(s,index));assert(!applyLoadout(s,index));assert.equal(JSON.stringify(s),before);}
 const equippedBefore=JSON.stringify(s.equip);s.inventory.push(item('gloves',10,'anvil',3));preset(s,'anvil');assert.equal(JSON.stringify(s.equip),equippedBefore);
 console.log('Loadouts: old-save compatibility, 3 snapshots, shared wardrobe, atomic capacity, protected references, battle lock, rings, skill order, forge/drop capacity: PASS');
}finally{Math.random=original;}
