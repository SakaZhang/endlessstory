import assert from 'node:assert/strict';
import {fresh,item,stats,preset,encounter,step,reward,offline,forge,applyForgeFavor,validSave,SOCKETS,SOCKET_TYPE,SLOTS,SET_SLOTS,RARITY,BUILD,AFFIX_DEFS,equipItem,LEGENDARY_CODEX,codexState,affixRollInfo,divineMultiplier,itemTotals} from './dist/engine.js';
const originalRandom=Math.random;let seed=93812;const rng=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};Math.random=rng;
try{
 const s=fresh();assert(validSave(s));assert.equal(s.version,2);assert.equal(SOCKETS.length,8);assert.equal(s.inventory.length,8);assert.deepEqual(RARITY,['普通','稀有','优良','至臻']);assert(s.inventory.every(i=>!i.set&&i.rarity===0&&!i.special&&i.affixes.length===0));assert.equal(new Set(Object.values(s.equip)).size,8);
 const ring1=s.equip.ring1,ring2=s.equip.ring2;assert(equipItem(s,ring1,'ring2'));assert.equal(s.equip.ring1,ring2);assert.equal(s.equip.ring2,ring1);assert(validSave(s));let bad=structuredClone(s);bad.equip.ring1=bad.equip.ring2;assert(!validSave(bad));bad=structuredClone(s);bad.version=1;assert(!validSave(bad));assert(!equipItem(s,ring1,'weapon'));
 for(let quality=0;quality<4;quality++)for(let j=0;j<300;j++){const it=item(SLOTS[j%SLOTS.length],5,null,quality);assert(quality===0?it.affixes.length<=1:it.affixes.length===quality+1);assert.equal(new Set(it.affixes.map(a=>a.stat)).size,it.affixes.length);assert(it.affixes.every(a=>AFFIX_DEFS[a.stat]));if(quality<2)assert(!it.special);}
 for(const slot of SLOTS)for(const b of BUILD){const it=item(slot,4,b.id,0);if(SET_SLOTS.includes(slot)){assert.equal(it.rarity,3);assert.equal(it.set,b.id);assert.equal(it.affixes.length,4);assert(!it.special);}else assert.equal(it.set,null);}
 // Affixes really modify stats, with explicit caps.
 let p=fresh(),base=stats(p);p.inventory[0].affixes=[{stat:'atk',value:10}];assert(stats(p).atk>base.atk);p.inventory[0].affixes=[{stat:'hp',value:10}];assert(stats(p).hp>base.hp);p.inventory[0].affixes=[{stat:'armor',value:10}];assert(stats(p).armor>base.armor);
 for(const [stat,out,max] of [['hit','hit',1],['crit','crit',.6],['critDamage','critDamage',2.5],['element','element',.6]]){p.inventory[0].affixes=[{stat,value:1000}];assert(stats(p)[out]>base[out]);assert(stats(p)[out]<= (stat==='element'?Math.floor(stats(p).atk*.6):max));}
 p=fresh();let unmodified=stats(p);p.inventory.push({...item('ring',3,null,2),id:'extra-ring',affixes:[{stat:'crit',value:3},{stat:'atk',value:5},{stat:'hp',value:7}]});equipItem(p,'extra-ring','ring2');assert(stats(p).crit>unmodified.crit);assert(validSave(p));
 // Set counts are exactly three pieces, no phantom fourth threshold.
 for(const b of BUILD){let x=fresh();for(const slot of SET_SLOTS){let it=item(slot,5,b.id,3);x.inventory.push(it);equipItem(x,it.id,slot);}preset(x,b.id);assert.equal(stats(x).count[b.id],4);assert(validSave(x));}
 // All three builds beat all bosses with sufficient ordinary progression, not forced counter swaps.
 for(const b of BUILD)for(let location=0;location<3;location++){let x=fresh();x.level=15;for(let i=0;i<x.inventory.length;i++){let old=x.inventory[i],it=item(old.slot,15,null,2);x.inventory[i]=it;const socket=SOCKETS[i];x.equip[socket]=it.id;}preset(x,b.id);x.location=location;let e=encounter(x,true);for(let t=0;t<200&&!e.done;t++)step(x,e);assert(e.win,`${b.id} boss${location} viable`);}
 // Direct combat responds to flat attack, elemental damage and rating-derived crits.
 let probe=fresh();probe.skills=['break','heavy','interrupt'];probe.conditions=['low','low','charge'];
 const dealt=(state,roll=.4)=>{let battle=encounter(state);battle.hp=battle.max=100000;battle.atk=0;Math.random=()=>roll;step(state,battle);Math.random=rng;return 100000-battle.hp;};
 const plainDamage=dealt(probe);probe.inventory[0].affixes=[{stat:'atk',value:8}];assert(dealt(probe)>plainDamage);probe.inventory[0].affixes=[{stat:'element',value:7}];assert(dealt(probe)>plainDamage);probe.inventory[0].affixes=[{stat:'crit',value:50}];assert(dealt(probe,.1)>plainDamage);
 // Two-piece core enhancement and four-piece follow-up bonuses are active, never a three-piece threshold.
 for(const build of BUILD){let t=fresh();for(const socket of SET_SLOTS){const gear=item(socket,1,build.id,3);gear.affixes=[{stat:'hp',value:15},{stat:'armor',value:2},{stat:'hit',value:5},{stat:'critDamage',value:8}];t.inventory.push(gear);equipItem(t,gear.id,socket);}assert.equal(stats(t).count[build.id],4);let first=encounter(t);first.hp=first.max=100000;preset(t,build.id);Math.random=()=>.5;step(t,first);Math.random=rng;assert(first.round===1);}
 // Shield once only; special effects cannot recursively reward.
 let x=fresh();x.inventory[0].rarity=2;x.inventory[0].affixes=[{stat:'hit',value:3},{stat:'crit',value:1},{stat:'hp',value:4}];x.inventory[0].special={id:'shelter'};let e=encounter(x,true);e.heroHp=stats(x).hp*.3;e.atk=50;step(x,e);assert(e.shelterUsed);let oldShield=e.shield;step(x,e);assert(e.shield<=oldShield);
 x=fresh();x.inventory[0].special={id:'knowledge'};x.inventory[1].special={id:'scavenger'};e=encounter(x);e.win=true;e.done=true;Math.random=()=>0;let gold=x.gold,mat=x.materialStacks['铁屑|0'];reward(x,e,1000);assert.equal(x.gold,gold+3);assert.equal(x.xp,40);assert.equal(x.materialStacks['铁屑|0'],mat+2);let snapshot=JSON.stringify(x);reward(x,e,1000);assert.equal(JSON.stringify(x),snapshot);Math.random=rng;
 // Momentum from active kill only, consumed once on next basic, removed on defeat.
 x=fresh();x.inventory[0].special={id:'momentum'};e=encounter(x);e.hp=1;Math.random=()=>0;step(x,e);assert.equal(e.killSource,'active');assert.equal(x.momentum,1);e=encounter(x);e.hp=e.max=100000;e.atk=1;for(const k of x.skills)e.cd[k]=99;step(x,e);assert.equal(x.momentum,0);x.momentum=1;e.heroHp=1;e.atk=100000;step(x,e);assert.equal(x.momentum,0);Math.random=rng;
 // Gold progression and no rewards/fail cooldown.
 let gains=[];for(let i=0;i<3;i++){x=fresh();x.location=i;e=encounter(x);e.win=true;let g=x.gold;reward(x,e);gains.push(x.gold-g);}assert.deepEqual(gains,[3,5,8]);x=fresh();e=encounter(x,true);e.win=false;assert.equal(reward(x,e),null);assert.equal(x.bossReady[0],0);
 x=fresh();x.running=true;x.lastSeen=0;x.location=2;assert.equal(offline(x,3600000),null);x.normalWins[2]=1;x.lastSeen=0;let o=offline(x,10*3600000);assert.equal(o.minutes,240);assert.equal(o.gold,240*8);assert.equal(offline(x,10*3600000),null);
 // Seeded drop distribution: no hour quotas, ordinary nonsets dominate, no fake legends.
 let drops=0,setDrops=0,qualities=[0,0,0,0];x=fresh();for(let i=0;i<20000;i++){e=encounter(x);e.win=true;let it=reward(x,e);if(it){drops++;if(it.set)setDrops++;qualities[it.rarity]++;assert(!it.legendaryId);assert(!it.set||SET_SLOTS.includes(it.slot));x.inventory.pop();}}assert(drops/20000>.16&&drops/20000<.20);assert(setDrops/drops<.025);assert(qualities[3]/drops<.04);console.log('20k normal kills:',{drops,setDrops,qualities});
 // Fusion types, quality affix counts, costs once, god once and persistent.
 let types=new Set(),sets=0,gods=0;x=fresh();x.gold=1e8;for(const k in x.materialStacks)x.materialStacks[k]=1e6;for(let i=0;i<10000;i++){let before=x.gold,it=forge(x,['铁屑','炉火晶']);assert.equal(x.gold,before-40);types.add(it.slot);if(it.set){sets++;assert(SET_SLOTS.includes(it.slot));assert.equal(it.rarity,3);assert(!it.special);}if(it.divine){gods++;let copy=JSON.stringify(it);assert.equal(applyForgeFavor(it),false);assert.equal(JSON.stringify(it),copy);}assert(it.rarity===0?it.affixes.length<=1:it.affixes.length===it.rarity+1);x.inventory.pop();}assert.equal(types.size,7);assert(sets>350&&sets<650);assert(gods>200&&gods<400);console.log('10k fusions:',{types:[...types],sets,gods});
 x=fresh();let it=item('gloves',3,null,2);applyForgeFavor(it);x.inventory.push(it);let roundtrip=JSON.parse(JSON.stringify(x));assert(validSave(roundtrip));assert.deepEqual(roundtrip.inventory.at(-1).divine,it.divine);snapshot=JSON.stringify(x);assert.equal(forge(x,[]),null);assert.equal(forge(x,Array(6).fill('铁屑')),null);assert.equal(forge(x,['__proto__']),null);assert.equal(JSON.stringify(x),snapshot);
 assert.equal(codexState(x,LEGENDARY_CODEX[0].id).collected,false);assert(!LEGENDARY_CODEX[0].implemented);
 // Divine gains apply to raw bases and every ordinary numeric affix once.
 for(const [key,def] of Object.entries(AFFIX_DEFS)){
  assert.equal(affixRollInfo({stat:key,value:def.min}).tier,0);
  assert.equal(affixRollInfo({stat:key,value:def.max}).tier,3);
  const tiers=new Set();for(let value=def.min;value<=def.max;value++)tiers.add(affixRollInfo({stat:key,value}).tier);
  assert.equal(tiers.size,4);
 }
 p=fresh();const divineItem=p.inventory[0];divineItem.rarity=3;divineItem.affixes=[{stat:'atk',value:3},{stat:'hp',value:15},{stat:'crit',value:5},{stat:'element',value:2}];divineItem.bless=2;
 const raw=structuredClone(divineItem),pre=stats(p);assert(applyForgeFavor(divineItem));
 assert.equal(divineMultiplier(divineItem),1.1);for(const key of ['atk','armor','hp','name','bless'])assert.equal(divineItem[key],raw[key]);assert.deepEqual(divineItem.affixes,raw.affixes);
 assert.equal(itemTotals(divineItem).atk,raw.atk*1.1+4);
 let post=stats(p);assert.equal(post.atk,Math.round(pre.atk+(raw.atk+3)/10));assert.equal(post.hp,Math.round(pre.hp+(raw.hp+15)/10));assert.equal(post.bonus.crit,5.5);assert.equal(post.element,2.2);
 assert.equal(post.specials.knowledge,pre.specials.knowledge);assert.deepEqual(post.count,pre.count);
 const stored=JSON.stringify(p);assert(validSave(JSON.parse(stored)));assert.deepEqual(stats(JSON.parse(stored)),post);assert(!applyForgeFavor(divineItem));assert.equal(JSON.stringify(p),stored);
 for(const a of divineItem.affixes)assert.deepEqual(affixRollInfo(a),affixRollInfo(raw.affixes.find(x=>x.stat===a.stat)));
 // Tiny gains accumulate before rounding instead of every tiny roll rounding up.
 p=fresh();for(const gear of p.inventory){gear.atk=1;gear.armor=1;gear.hp=1;gear.affixes=[{stat:'atk',value:3}];applyForgeFavor(gear);}
 assert.equal(stats(p).atk,Math.round(17+8*4.4));
 console.log('All v0.4 equipment/quality/affix/special/combat/drop/fusion/offline/schema tests passed.');
}finally{Math.random=originalRandom;}
