import {currentAffix} from './current-equipment-test-fixture.mjs';
import {fresh} from './dist/engine.js';
import assert from 'node:assert/strict';
import {item,stats,preset,encounter,step,reward,offline,forge,applyForgeFavor,validSave,SOCKETS,SOCKET_TYPE,SLOTS,SET_SLOTS,RARITY,BUILD,AFFIX_DEFS,equipItem,LEGENDARY_CODEX,codexState,affixRollInfo,divineMultiplier,itemTotals} from './dist/engine.js';
const originalRandom=Math.random;let seed=93812;const rng=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};Math.random=rng;
try{
 const s=fresh();assert(validSave(s));assert.equal(s.version,3);assert.equal(SOCKETS.length,8);assert.equal(s.inventory.length,8);assert.deepEqual(RARITY,['普通','稀有','优良','至臻']);assert(s.inventory.every(i=>!i.set&&i.rarity===0&&!i.special&&i.affixes.length===0));assert.equal(new Set(Object.values(s.equip)).size,8);
 const ring1=s.equip.ring1,ring2=s.equip.ring2;assert(equipItem(s,ring1,'ring2'));assert.equal(s.equip.ring1,ring2);assert.equal(s.equip.ring2,ring1);assert(validSave(s));let bad=structuredClone(s);bad.equip.ring1=bad.equip.ring2;assert(!validSave(bad));bad=structuredClone(s);bad.version=1;assert(!validSave(bad));assert(!equipItem(s,ring1,'weapon'));
 for(let quality=0;quality<4;quality++)for(let j=0;j<300;j++){const it=item(SLOTS[j%SLOTS.length],5,null,quality);assert(quality===0?it.affixes.length<=1:it.affixes.length===quality+1);assert.equal(new Set(it.affixes.map(a=>a.stat)).size,it.affixes.length);assert(it.affixes.every(a=>AFFIX_DEFS[a.stat]));if(quality<2)assert(!it.special);}
 for(const slot of SLOTS)for(const b of BUILD){const it=item(slot,4,b.id,0);if(SET_SLOTS.includes(slot)){assert.equal(it.rarity,3);assert.equal(it.set,b.id);assert.equal(it.affixes.length,4);assert(!it.special);}else assert.equal(it.set,null);}
 // Affixes really modify stats, with explicit caps.
 let p=fresh(),base=stats(p);p.inventory[0].affixes=[{stat:'atk',value:10}];assert(stats(p).atk>base.atk);p.inventory[0].affixes=[{stat:'hp',value:10}];assert(stats(p).hp>base.hp);p.inventory[0].affixes=[{stat:'armor',value:10}];assert(stats(p).armor>base.armor);
 for(const [stat,out,max] of [['hit','hit',1],['crit','crit',.6],['critDamage','critDamage',2.5],['element','element',1000]]){p.inventory[0].affixes=[{stat,value:1000}];assert(stats(p)[out]>base[out]);assert(stats(p)[out]<= max);}
 p=fresh();let unmodified=stats(p);p.inventory.push({...item('ring',3,null,2),id:'extra-ring',affixes:[currentAffix('crit',5),currentAffix('atk',5),currentAffix('hp',15)]});equipItem(p,'extra-ring','ring2');assert(stats(p).crit>unmodified.crit);assert(validSave(p));
 // Set counts are exactly three pieces, no phantom fourth threshold.
 for(const b of BUILD){let x=fresh();for(const slot of SET_SLOTS){let it=item(slot,5,b.id,3);x.inventory.push(it);equipItem(x,it.id,slot);}preset(x,b.id);assert.equal(stats(x).count[b.id],4);assert(validSave(x));}
 // Retired v0.4 single-enemy/old-three-site combat assertions are covered by current M2 and active-tree suites.
 let x,snapshot;
 // Fusion types, quality affix counts, costs once, god once and persistent.
 let types=new Set(),sets=0,gods=0;x=fresh();x.gold=1e8;for(const k in x.materialStacks)x.materialStacks[k]=1e6;for(let i=0;i<10000;i++){let before=x.gold,it=forge(x,['铁屑','炉火晶']);assert.equal(x.gold,before-40);types.add(it.slot);if(it.set){sets++;assert(SET_SLOTS.includes(it.slot));assert.equal(it.rarity,3);assert(!it.special);}if(it.divine){gods++;let copy=JSON.stringify(it);assert.equal(applyForgeFavor(it),false);assert.equal(JSON.stringify(it),copy);}assert(it.rarity===0?it.affixes.length<=1:it.affixes.length===it.rarity+1);x.inventory.pop();}assert.equal(types.size,7);assert.equal(sets,0);assert(gods>200&&gods<450);console.log('10k fusions:',{types:[...types],sets,gods});
 x=fresh();let it=item('gloves',3,null,2);applyForgeFavor(it);x.inventory.push(it);let roundtrip=JSON.parse(JSON.stringify(x));assert(validSave(roundtrip));assert.deepEqual(roundtrip.inventory.at(-1).divine,it.divine);snapshot=JSON.stringify(x);assert.equal(forge(x,[]),null);assert.equal(forge(x,Array(6).fill('铁屑')),null);assert.equal(forge(x,['__proto__']),null);assert.equal(JSON.stringify(x),snapshot);
 assert.equal(codexState(x,LEGENDARY_CODEX[0].id).collected,false);assert(LEGENDARY_CODEX[0].implemented);
 // Divine gains apply to raw bases and every ordinary numeric affix once.
 for(const [key,def] of Object.entries(AFFIX_DEFS)){
  assert.equal(affixRollInfo({stat:key,value:def.min}).tier,0);
  assert.equal(affixRollInfo({stat:key,value:def.max}).tier,3);
  const tiers=new Set();for(let value=def.min;value<=def.max;value++)tiers.add(affixRollInfo({stat:key,value}).tier);
  assert.equal(tiers.size,Math.min(4,def.max-def.min+1));
 }
 p=fresh();const divineItem=item('weapon',1,null,3);p.inventory[0]=divineItem;p.equip.weapon=divineItem.id;divineItem.affixes=[currentAffix('atk',3),currentAffix('hp',15),currentAffix('crit',5),currentAffix('element',2)];divineItem.bless=0;
 const raw=structuredClone(divineItem),pre=stats(p);assert(applyForgeFavor(divineItem));
 assert.equal(divineMultiplier(divineItem),1.1);for(const key of ['atk','armor','hp','name','bless'])assert.equal(divineItem[key],raw[key]);assert.deepEqual(divineItem.affixes,raw.affixes);
 assert.equal(itemTotals(divineItem).atk,raw.atk*1.1);
 let post=stats(p);assert.equal(post.atk,Math.round(pre.atk+(raw.atk+3)/10));assert.equal(post.hp,Math.round(pre.hp+(raw.hp+15)/10));assert.equal(post.bonus.crit,5.5);assert.equal(post.element,2.2);
 assert.equal(post.specials.knowledge,pre.specials.knowledge);assert.deepEqual(post.count,pre.count);
 const stored=JSON.stringify(p);assert(validSave(JSON.parse(stored)));assert.deepEqual(stats(JSON.parse(stored)),post);assert(!applyForgeFavor(divineItem));assert.equal(JSON.stringify(p),stored);
 for(const a of divineItem.affixes)assert.deepEqual(affixRollInfo(a),affixRollInfo(raw.affixes.find(x=>x.stat===a.stat)));
 // Tiny gains accumulate before rounding instead of every tiny roll rounding up.
 p=fresh();for(const gear of p.inventory){gear.atk=1;gear.armor=1;gear.hp=1;gear.affixes=[{stat:'atk',value:3}];applyForgeFavor(gear);}
 assert.equal(stats(p).atk,Math.round(17+8*4.4));
 console.log('Current equipment/quality/affix/raw stats/fusion/divine/schema tests passed; retired old combat matrix lives outside the current generation.');
}finally{Math.random=originalRandom;}
