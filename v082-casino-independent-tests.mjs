import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
import {casinoInputs,quoteCasino,wagerCasino} from './dist/casino.js';
const clone=structuredClone;
const previousRandom=Math.random;let factorySeed=820241;Math.random=()=>{factorySeed=(Math.imul(factorySeed,1664525)+1013904223)>>>0;return factorySeed/2**32;};
const inverse=target=>Number(((BigInt(target)-1013904223n)*4276115653n)&0xffffffffn);
function game(ticket=0,race='dwarf'){const s=E.fresh(race);s.level=100;s.gold=1000;s.lastSeen=s.lastHealthClock=10000;s.nextBattleAt=0;s.restUntil=0;s.heroHp=E.stats(s).hp;s.casino={version:1,rng:inverse(ticket),revision:0,lastReceipt:null};return s;}
function wager(s,selection){const q=quoteCasino(s,selection);assert(q.ok,JSON.stringify(q));const r=wagerCasino(s,q,{now:10000});assert(r,'successful real transaction');return {q,r,item:s.inventory.find(i=>i.id===r.rewardId)};}
for(const kind of ['material','equipment'])for(const quality of [0,1,2,3])for(const ticket of [0,32,33,65,66,98,99]){
 const s=game(ticket),original=kind==='equipment'?E.item('weapon',29,null,quality):null;if(original){s.inventory.push(original);if(quality===3)original.special={id:'harvester',growthKills:77};}else s.materialStacks={['铁屑|'+quality]:1};
 const selection={kind,id:original?.id??'铁屑|'+quality},before=clone(s),{q,r,item}=wager(s,selection),expected=ticket<33?'downgrade':ticket<66?'upgrade':ticket<99?'same':'legendary';
 assert.equal(r.outcome,expected);assert.equal(s.gold,900);assert(item,'every input/output branch returns equipment');assert.notEqual(item.id,selection.id,'same quality also generates a new equipment identity');assert.equal(s.casino.revision,1);assert(E.validSave(s));assert(E.validSave(JSON.parse(JSON.stringify(s))));
 if(kind==='material')assert.equal(s.materialStacks[selection.id],0);else assert(!s.inventory.some(i=>i.id===original.id));
 if(ticket===99)assert.equal(item.legendaryId,'lucky-dice');else {assert.equal(item.legendaryId,null);assert.equal(item.set,null);assert.equal(item.rarity,Math.min(3,Math.max(0,quality+(ticket<33?-1:ticket<66?1:0))));assert.equal(item.special?.growthKills??0,0,'old growth must not transfer');if(kind==='equipment')assert.equal(item.level,29);else assert.equal(item.levelSource,'material');}
 const once=JSON.stringify(s);assert.equal(wagerCasino(s,q,{now:10001}),null,'repeat click cannot charge twice');assert.equal(JSON.stringify(s),once);
 const replay=clone(before);assert.deepEqual(wager(replay,selection).r,r,'same saved RNG resumes to same reward receipt');assert.deepEqual(replay,s,'reloaded transaction exact state');
}
console.log('PASS independent real casino 56 branch/quality/input transactions: fixed thresholds, Q0/Q3 floor/cap, all-new gear, no inheritance, 100 gold, JSON/replay/exact-once');

// Luck and the goblin price discount cannot modify fixed wager cost/outcome.
for(const ticket of [0,32,33,65,66,98,99]){
 const a=game(ticket),b=clone(a);a.materialStacks=b.materialStacks={'铁屑|1':1};b.talents.luck=10;const selection={kind:'material',id:'铁屑|1'},ra=wager(a,selection),rb=wager(b,selection);assert.deepEqual(ra.r,rb.r);assert.deepEqual(ra.item,rb.item);assert.equal(a.casino.rng,b.casino.rng);
 const goblin=game(ticket,'goblin');goblin.materialStacks={'铁屑|1':1};wager(goblin,selection);assert.equal(goblin.gold,900,'fictional casino cost never racial-discounted');
}
console.log('PASS independent casino luck/RNG independence and unmodified 100-gold price for goblin');

// Capacity is checked for every possible new slot before RNG or spending. A
// sacrificed amulet legitimately releases its own full-bag slot for the output.
{
 const s=game();s.materialStacks={'铁屑|0':1};for(let i=0;i<50;i++)s.inventory.push(E.item('gloves',1,null,0));const before=JSON.stringify(s);assert.equal(quoteCasino(s,{kind:'material',id:'铁屑|0'}).ok,false);assert.equal(JSON.stringify(s),before);
 const t=game(99);for(let i=0;i<50;i++)t.inventory.push(E.item('amulet',1,null,0));const input=t.inventory[0];wager(t,{kind:'equipment',id:input.id});assert.equal(t.inventory.length,50);assert.equal(t.inventory.filter(i=>i.slot==='amulet').length,50);assert(E.validSave(t));
}
{
 const s=game(),locked=E.item('boots',1,null,3),equipped=E.item('ring',1,null,3),protectedItem=E.item('gloves',1,null,3),legend=E.legendaryItem('lucky-dice',1),set=E.item('armor',29,E.BUILD[0].id,3);locked.locked=true;protectedItem.unique=true;s.inventory.push(locked,equipped,protectedItem,legend,set);assert(E.equipItem(s,equipped.id));const ids=casinoInputs(s).filter(r=>r.kind==='equipment').map(r=>r.id);for(const item of [locked,equipped,protectedItem,legend])assert(!ids.includes(item.id));assert(ids.includes(set.id),'ordinary unlocked unequipped set is eligible');wager(s,{kind:'equipment',id:set.id});assert(E.validSave(s));
}
{
 const s=game(99);s.materialStacks={'铁屑|0':1};const selection={kind:'material',id:'铁屑|0'},q=quoteCasino(s,selection);s.gold--;const before=JSON.stringify(s);assert.equal(wagerCasino(s,q,{now:10000}),null,'stale quote rejected atomically');assert.equal(JSON.stringify(s),before);
 const noGold=game();noGold.gold=99;const raw=JSON.stringify(noGold);assert(!quoteCasino(noGold,selection).ok);assert.equal(JSON.stringify(noGold),raw);
 const forged=game();forged.materialStacks={'铁屑|0':1};const quote=quoteCasino(forged,selection);quote.quality=3;const stable=JSON.stringify(forged);assert.equal(wagerCasino(forged,quote,{now:10000}),null);assert.equal(JSON.stringify(forged),stable);
}
console.log('PASS independent casino full-capacity safety, released sacrifice slot, locked/equipped/unique/legend exclusion, set eligibility, stale/tampered/insufficient rejection atomicity');

Math.random=previousRandom;
