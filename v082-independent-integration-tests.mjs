import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
const clone=structuredClone;
const previousRandom=Math.random;let factorySeed=820241;Math.random=()=>{factorySeed=(Math.imul(factorySeed,1664525)+1013904223)>>>0;return factorySeed/2**32;};
const close=(a,b,label)=>assert(Math.abs(a-b)<1e-8,`${label}: ${a} != ${b}`);
function fresh(){const s=E.fresh();s.level=100;s.skills=[null,null,null,null];s.conditions=['always','always','always','always'];s.skillTree.presets[0].active=[null,null,null,null];s.skillTree.presets[0].passive=[null,null];s.lastSeen=s.lastHealthClock=10000;s.nextBattleAt=0;s.restUntil=0;s.heroHp=E.stats(s).hp;return s;}
function special(s,id,slot='ring',socket){const item=E.item(slot,1,null,3);item.special={id};s.inventory.push(item);assert(E.equipItem(s,item.id,socket));s.heroHp=E.stats(s).hp;return item;}
function frozenEnemies(e){for(const u of e.enemies){u.hp=u.max=1000000;u.armor=0;u.atk=0;u.shield=0;u.control.stunUntil=1e12;}return e;}
function group(s){const e=E.startDeveloperGroup(s,{count:2,seed:1},Math.max(s.lastHealthClock,s.nextBattleAt));assert(e);return frozenEnemies(e);}
function production(s,node='dwarf.a01.field'){const e=E.startInstanceEncounter(s,node,Math.max(s.lastHealthClock,s.nextBattleAt));assert(e,node);return frozenEnemies(e);}
function step(s,seed=1){const e=s.activeEncounter;e.rngState=seed;return E.step(s,e,s.nextActionAt);}
function killAll(s){const e=s.activeEncounter;for(const u of e.enemies)if(u.hp>0)u.hp=1;for(let n=0;n<10&&!e.done;n++)step(s);assert(e.win,'actual direct actions complete encounter');E.reward(s,e,s.lastHealthClock);assert(e.rewarded);assert(E.validSave(s));return e;}
function growth(item){return item.special.growthKills??0;}

// Credit goes through the production step wrapper, never direct growth helpers.
{
 const s=fresh(),a=special(s,'harvester','ring','ring1'),b=special(s,'harvester','ring','ring2'),luck=special(s,'blesser','amulet'),leech=special(s,'glutton','helm'),bag=E.item('boots',1,null,3);bag.special={id:'harvester'};s.inventory.push(bag);
 const before=E.stats(s),e=group(s);e.enemies[0].hp=1;step(s);for(const item of [a,b,luck,leech])assert.equal(growth(item),1,'all equipped growth items credit once');assert.equal(growth(bag),0,'bag item never grows');close(E.stats(s).atk-before.atk,2,'independent attack stacks');close(E.stats(s).luck-before.luck,.1,'blesser tenths');close(E.stats(s).lifestealRating-before.lifestealRating,1,'rating not percent');
 const reloaded=JSON.parse(JSON.stringify(s));assert(E.validSave(reloaded));step(reloaded);for(const item of reloaded.inventory.filter(i=>[a.id,b.id,luck.id,leech.id].includes(i.id)))assert.equal(growth(item),1,'dead enemy not recounted after reload');
 e.enemies[1].hp=1;step(s);assert(e.win);for(const item of [a,b,luck,leech])assert.equal(growth(item),2);E.reward(s,e,s.lastHealthClock);const once=JSON.stringify(s);E.reward(s,e,s.lastHealthClock);assert.equal(JSON.stringify(s),once,'reward does not double-credit growth');
 const armed=E.stats(s).atk;const withoutGrowth=clone(s);withoutGrowth.inventory.find(i=>i.id===a.id).special.growthKills=0;close(armed-E.stats(withoutGrowth).atk,2,'equipped earned attack is active');const replacement=E.item('ring',1,null,0);replacement.special=null;s.inventory.push(replacement);assert(E.equipItem(s,replacement.id,'ring1'));assert.equal(growth(a),2);const absent=E.stats(s).atk,withoutUnequippedGrowth=clone(s);withoutUnequippedGrowth.inventory.find(i=>i.id===a.id).special.growthKills=0;close(absent,E.stats(withoutUnequippedGrowth).atk,'unequipped earned attack is absent');assert(E.equipItem(s,a.id,'ring1'));close(E.stats(s).atk,armed,'re-equipped bonus restored');assert(E.validSave(s));
}
for(const mode of ['burn','counter']){
 const s=fresh(),item=special(s,'harvester');special(s,'momentum','boots');const e=group(s),u=e.enemies[1];u.hp=1;
 if(mode==='burn')u.burn=1;
 else {e.guard=2;u.control.stunUntil=0;u.atk=1;}
 const logs=step(s);assert.equal(u.hp,0,mode+' actual enemy phase kill');assert.equal(growth(item),1,mode+' growth');assert.equal(s.momentum,0,mode+' must not arm direct-kill momentum');assert(logs.some(x=>x.includes(mode==='burn'?'灼烧':'反击')));assert(E.validSave(s));
}
{
 const s=fresh(),a=special(s,'harvester','ring','ring1'),b=special(s,'blesser','amulet'),c=special(s,'glutton','helm');a.special.growthKills=399;b.special.growthKills=199;c.special.growthKills=199;const e=group(s);for(const u of e.enemies)u.hp=1;step(s);step(s);assert.deepEqual([growth(a),growth(b),growth(c)],[400,200,200]);assert(E.validSave(s));for(const item of [a,b,c]){const bad=clone(s);bad.inventory.find(i=>i.id===item.id).special.growthKills++;assert(!E.validSave(bad),'over-cap saved growth rejected');}
}
console.log('PASS independent actual E.step growth: direct/DOT/counter, independent stack, bag exclusion, reload and reward idempotency, equip persistence, per-item caps');

// Momentum is charged by a direct kill, survives utility/miss, applies to the
// next landed damaging skill as a whole, and is not inherited by the next action.
{
 const s=fresh();special(s,'momentum');const e=group(s);e.enemies[0].hp=1;step(s);assert.equal(s.momentum,1);
 s.skills=['warcry',null,null,null];step(s);assert.equal(e.lastCast.skillId,'warcry');assert.equal(s.momentum,1,'utility preserves charge');
 s.skills=['break',null,null,null];const uncharged=clone(s);uncharged.momentum=0;step(s);step(uncharged);assert.equal(e.lastCast.skillId,'break');assert.equal(s.momentum,0);const boosted=e.lastCast.hits[0].actualHpLost,normal=uncharged.activeEncounter.lastCast.hits[0].actualHpLost;assert(Math.abs(boosted-2*normal)<=1,'next damaging skill doubles before rounding');
 s.skills=[null,null,null,null];uncharged.skills=[null,null,null,null];step(s);step(uncharged);assert.equal(e.lastCast.hits[0].actualHpLost,uncharged.activeEncounter.lastCast.hits[0].actualHpLost,'following action no multiplier');
 const waiting=clone(s);waiting.momentum=1;let miss=null;for(let seed=0;seed<10000&&!miss;seed++){const trial=clone(waiting);step(trial,seed);if(trial.activeEncounter.lastCast.hits[0].hit===false)miss=trial;}assert(miss);assert.equal(miss.momentum,1,'miss preserves next landed action');assert(E.validSave(miss));
}
console.log('PASS independent momentum actual engine: direct kill, utility preservation, skill x2, single consumption, miss preservation');

// Full ordinary dungeon boundary, including mid-run JSON reload and a real
// second lethal hit. A new run, not a new stage, resets both one-shot affixes.
{
 const s=fresh();special(s,'shelter','ring','ring1');special(s,'nirvana','ring','ring2');let e=production(s,'dwarf.a01.dungeon');assert.equal(e.shield,Math.floor(E.stats(s).hp*.3)+E.stats(s).shieldBonus);
 e.shield=0;e.heroBurn=1;e.heroBurnPower=1e9;step(s);assert(e.affixState.nirvanaUsed);assert(e.heroHp>0);assert(s.dungeonRun.affixUsage.nirvanaUsed);assert(E.validSave(s));killAll(s);
 const continued=JSON.parse(JSON.stringify(s));assert(E.validSave(continued));e=production(continued,'dwarf.a01.dungeon');assert.equal(e.dungeonStage,2);assert.equal(e.shield,0,'stage two does not reacquire opening shelter');assert(e.affixState.nirvanaUsed);
 const lethal=clone(continued);lethal.activeEncounter.heroBurn=1;lethal.activeEncounter.heroBurnPower=1e9;step(lethal);assert.equal(lethal.heroHp,0,'second stage lethal hit cannot revive');assert(lethal.restUntil>0);assert(E.validSave(lethal));
 killAll(continued);e=production(continued,'dwarf.a01.dungeon');assert.equal(e.dungeonStage,3);assert.equal(e.shield,0);assert(e.affixState.nirvanaUsed);killAll(continued);assert.equal(continued.dungeonRun,null);
 continued.nextBattleAt=continued.instanceCooldowns['dwarf.a01.dungeon'];E.settleRest(continued,continued.nextBattleAt);e=production(continued,'dwarf.a01.dungeon');assert.equal(e.dungeonStage,1);assert(!e.affixState.nirvanaUsed);assert.equal(e.shield,Math.floor(E.stats(continued).hp*.3)+E.stats(continued).shieldBonus);assert(E.validSave(continued));
}
console.log('PASS independent full dungeon: shelter30%, no stage refresh, nirvana once/run after JSON, actual second lethal loss, new-run reset');

// Seek actual seeded factory/host outcomes, not a direct dice helper. A shield
// receives the 3333 amount first even with huge armor and charged multipliers.
{
 const s=fresh(),dice=E.legendaryItem('lucky-dice',1);s.inventory.push(dice);assert(E.equipItem(s,dice.id));special(s,'momentum','ring');s.heroHp=E.stats(s).hp;const e=production(s);e.enemies[0].armor=1000000;e.enemies[0].shield=1000;e.enemies[0].shieldUntil=1e12;e.warcry=3;e.weakness=3;s.momentum=1;
 let jackpot=null;for(let seed=0;seed<20000&&!jackpot;seed++){const trial=clone(s);step(trial,seed);if(trial.activeEncounter.lastCast?.hits?.[0]?.actualHpLost===2333)jackpot={trial,seed};}assert(jackpot,'actual E.step reaches fixed3333 branch');assert.equal(jackpot.trial.activeEncounter.enemies[0].shield,0);assert(E.validSave(jackpot.trial));
 const shielded=clone(s);shielded.activeEncounter.enemies[0].shield=5000;step(shielded,jackpot.seed);assert.equal(shielded.activeEncounter.enemies[0].shield,1667);assert.equal(shielded.activeEncounter.lastCast.hits[0].actualHpLost,0);
 const plain=clone(s);plain.momentum=0;plain.activeEncounter.warcry=plain.activeEncounter.weakness=0;step(plain,jackpot.seed);assert.equal(plain.activeEncounter.lastCast.hits[0].actualHpLost,2333,'jackpot excludes ordinary multipliers');
 const resumed=JSON.parse(JSON.stringify(jackpot.trial));assert.deepEqual(step(resumed),step(jackpot.trial));assert.deepEqual(resumed,jackpot.trial,'dice/RNG/save continuation identical');
}
console.log('PASS independent lucky-dice actual production E.step: jackpot3333, armor/normal multiplier bypass, shield first, JSON/RNG continuation');

// A multicast is a distinct skill action: it cannot reuse an already-consumed
// charge, but a kill by the original can arm a fresh charge for the extra cast.
for(const firstKills of [true,false]){
 const s=fresh();special(s,'momentum','ring','ring1');special(s,'multicast','ring','ring2');const e=group(s);s.skills=['break',null,null,null];if(firstKills)e.enemies[0].hp=1;else s.momentum=1;
 const control=clone(s);control.inventory.find(i=>i.special?.id==='momentum').special=null;control.momentum=0;
 step(s,12);step(control,12);assert.equal(e.activeCastCount,2);assert(e.lastCast.id.endsWith(':extra'));assert(e.lastCast.hits[0].hit);const actual=e.lastCast.hits[0].actualHpLost,normal=control.activeEncounter.lastCast.hits[0].actualHpLost;
 if(firstKills)assert(Math.abs(actual-2*normal)<=1,'new charge from original kill applies to next multicast action');else assert.equal(actual,normal,'consumed original charge not duplicated into multicast');assert.equal(s.momentum,0,'extra consumes only a fresh pending charge');assert(E.validSave(s));
}
console.log('PASS independent multicast/momentum actual engine: fresh direct-kill charge consumed by extra, old consumed charge never shared');

// Force the internal encounter RNG exactly below and at 50%, through genuine
// production reward settlement; loot can consume later draws without changing XP.
{
 const inverse=target=>Number(((BigInt(target)-1013904223n)*4276115653n)&0xffffffffn);
 for(const [target,boost] of [[2147483647,2],[2147483648,1]]){
  const s=fresh();s.level=1;special(s,'knowledge');const e=production(s);for(const u of e.enemies)u.hp=1;for(let n=0;n<10&&!e.done;n++)step(s);assert(e.win);e.rngState=inverse(target);E.reward(s,e,s.lastHealthClock);assert.equal(e.acceptedXp,e.rewardXp*(e.fieldGroup?2:1)*boost);assert(E.validSave(s));
 }
}
console.log('PASS independent knowledge actual reward pipeline: exact 50% boundary, double base XP only on winning branch');

// Inspect all four actual basic outcomes and a real skill-tree cast. Their RNG
// positions are asserted by the host result, not mocked by a selector helper.
{
 const s=fresh(),dice=E.legendaryItem('lucky-dice',1);s.inventory.push(dice);assert(E.equipItem(s,dice.id));s.heroHp=E.stats(s).hp;production(s);const st=E.stats(s),seen=new Set();
 for(let seed=0;seed<20000&&seen.size<4;seed++){
  let state=seed;const draw=()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state/2**32;};const hit=draw(),roll=draw(),crit=draw();if(hit>=st.hit||crit<st.crit)continue;
  const outcome=roll<.33?'low':roll<.66?'high':roll<.99?'normal':'jackpot';if(seen.has(outcome))continue;const t=clone(s);step(t,seed);assert.equal(t.activeEncounter.lastCast.luckyDice.outcome,outcome);const expected=outcome==='jackpot'?3333:Math.max(1,Math.round(st.atk*({low:.75,high:1.25,normal:1})[outcome]));assert.equal(t.activeEncounter.lastCast.hits[0].actualHpLost,expected);seen.add(outcome);assert(E.validSave(t));
 }
 assert.equal(seen.size,4);
 const active=clone(s);active.skillTree.presets[0].unlocked=E.SKILL_TREE_DEFINITION.nodes.map(n=>n.id);active.skillTree.presets[0].active=['fracture_strike',null,null,null];step(active);assert.equal(active.activeEncounter.lastCast.skillId,'fracture_strike');assert.equal(active.activeEncounter.lastCast.luckyDice,undefined,'active skill must not roll necklace');assert(E.validSave(active));
}
console.log('PASS independent lucky-dice all4 actual basic damage branches and real skill-tree cast exclusion');

Math.random=previousRandom;
