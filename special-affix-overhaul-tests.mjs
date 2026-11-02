import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
import {beginMomentumAction,momentumHitMultiplier,finishMomentumAction,tryReaperHit,createBattleAffixState} from './dist/affix-expansion.js';
import {currentAffix} from './current-equipment-test-fixture.mjs';
import {loadProgress,SAVE_KEY} from './dist/storage.js';
const clone=structuredClone;
function fresh(){const s=E.fresh();s.level=100;s.gold=100000;s.lastSeen=s.lastHealthClock=10000;s.heroHp=E.stats(s).hp;s.restUntil=0;s.nextBattleAt=0;s.skills=[null,null,null,null];s.skillTree.presets[0].active=[null,null,null,null];s.skillTree.presets[0].passive=[null,null];return s;}
function gear(s,id,slot='ring',socket){const it=E.item(slot,1,null,3);it.special={id};it.affixes=[currentAffix('atk',3),currentAffix('armor',2),currentAffix('hp',15),currentAffix('hit',5)];s.inventory.push(it);assert(E.equipItem(s,it.id,socket));s.heroHp=E.stats(s).hp;return it;}
function start(s,node='dwarf.a01.field'){const e=E.startInstanceEncounter(s,node,Math.max(s.nextBattleAt,s.lastHealthClock));assert(e);for(const u of e.enemies){u.hp=u.max=100000;u.armor=0;u.atk=0;u.shield=0;u.control.stunUntil=1e12;}return e;}
function step(s,seed=1){s.activeEncounter.rngState=seed;return E.step(s,s.activeEncounter,s.nextActionAt);}
function finish(s){const e=s.activeEncounter;for(const u of e.enemies)u.hp=1;for(let i=0;!e.done&&i<10;i++)step(s);assert(e.win);E.reward(s,e,s.lastHealthClock);assert(e.rewarded);return e;}
function constantRandom(value,fn){const old=Math.random;Math.random=()=>value;try{return fn();}finally{Math.random=old;}}

assert.deepEqual(E.ACTIVE_SPECIAL_KEYS,['knowledge','momentum','shelter','nirvana','reaper','multicast','harvester','blesser','glutton']);
assert(!Object.keys(E.SPECIALS).includes('scavenger'));
{
 const s=fresh(),old=gear(s,'scavenger');assert(E.validSave(s));assert(!E.stats(s).specials.scavenger);assert(E.SPECIALS.scavenger.retired);assert.equal(old.special.id,'scavenger');
 const store=new Map([[SAVE_KEY,JSON.stringify(s)]]),loaded=loadProgress({getItem:k=>store.get(k)??null,setItem:(k,v)=>store.set(k,v),removeItem:k=>store.delete(k)});assert(!loaded.blocked);assert(loaded.game.inventory.some(x=>x.id===old.id),'retirement never deletes owned gear');
 const e=start(s);const without=clone(s);without.inventory.find(i=>i.id===old.id).special=null;for(const u of e.enemies)u.hp=1;for(const u of without.activeEncounter.enemies)u.hp=1;
 finish(s);finish(without);assert.deepEqual(s.materialStacks,without.materialStacks,'retired affix has no material effect');assert.equal(s.gold,without.gold);assert.equal(s.xp,without.xp);
}

// Exact 50% knowledge boundary through a real won production encounter.
// Only base battle XP doubles; this does not change progression cap policy.
{
 const s=fresh();s.level=50;gear(s,'knowledge');const e=start(s);for(const u of e.enemies)u.hp=1;for(let i=0;!e.done&&i<10;i++)step(s);assert(e.win);
 const mod=1n<<32n,inverse=4276115653n,seedFor=draw=>Number(((BigInt(draw)-1013904223n)*inverse%mod+mod)%mod);
 const base=e.rewardXp*(e.fieldGroup?2:1);
 for(const [draw,multiplier]of [[0x7fffffff,2],[0x80000000,1]]){const trial=clone(s),battle=trial.activeEncounter;battle.rngState=seedFor(draw);E.reward(trial,battle,trial.lastHealthClock);assert(battle.rewarded);assert.equal(battle.acceptedXp,base*multiplier);assert.equal(battle.rewardNotes.some(x=>x.startsWith('求知')),multiplier===2);assert(E.validSave(trial));}
}

// Exact 1% threshold, independently per hit/target; 1% is excluded.
for(const [roll,expected] of [[.009999,true],[.01,false],[.019,false]]){
 const result=tryReaperHit(createBattleAffixState('b'),{battleId:'b',castId:'c',hitIndex:0,targetId:'u',hit:true,targetHp:100,hasReaper:true},()=>roll);assert.equal(result.triggered,expected);
}
// A boost is shared by all landed segments in ONE cast, not automatically by
// multicast; a direct kill can rearm a new charge for that next real cast.
{
 const s={momentum:1},a=beginMomentumAction(s,{equipped:true});assert.equal(momentumHitMultiplier(a),2);assert.equal(momentumHitMultiplier(a),2);finishMomentumAction(s,a,{equipped:true});assert.equal(s.momentum,0);
 const extra=beginMomentumAction(s,{equipped:true,extra:true});assert.equal(momentumHitMultiplier(extra),1);finishMomentumAction(s,extra,{equipped:true});
 s.momentum=1;const kill=beginMomentumAction(s,{equipped:true});momentumHitMultiplier(kill);kill.directKill=true;finishMomentumAction(s,kill,{equipped:true});assert.equal(s.momentum,1);assert.equal(momentumHitMultiplier(beginMomentumAction(s,{equipped:true,extra:true})),2);
 s.momentum=1;finishMomentumAction(s,beginMomentumAction(s,{equipped:true}),{equipped:true});assert.equal(s.momentum,1,'all misses preserve pending charge');
}
// Real two-segment tree skill uses the same x2 snapshot on both axe hits.
{
 const s=fresh();gear(s,'momentum');let axe;for(let i=0;i<100&&!axe;i++){const it=E.item('weapon',1,null,0);if(it.weaponType==='axe')axe=it;}assert(axe);s.inventory.push(axe);assert(E.equipItem(s,axe.id));s.skillTree.presets[0].unlocked=E.SKILL_TREE_DEFINITION.nodes.map(n=>n.id);s.skillTree.presets[0].active=['fracture_strike',null,null,null];start(s);s.momentum=1;
 const normal=clone(s);normal.momentum=0;step(s);step(normal);const boost=s.activeEncounter.lastCast.hits,plain=normal.activeEncounter.lastCast.hits;assert.equal(boost.length,2);assert.equal(plain.length,2);for(let i=0;i<2;i++){assert(boost[i].hit&&plain[i].hit);assert(Math.abs(boost[i].actualHpLost-2*plain[i].actualHpLost)<=1);}assert.equal(s.momentum,0);assert(E.validSave(s));
}
// Unequip only suspends growth; earned values are not ordinary affixes, and
// divine does not multiply those earned counters.
{
 const s=fresh(),it=gear(s,'blesser');it.special.growthKills=7;const a=E.stats(s);assert.equal(E.specialAffixProgress(it).value,.7);assert(E.applyForgeFavor(it));const b=E.stats(s);assert.equal(b.luck,a.luck,'growth is not divine-scaled');const blank=E.item('ring',1,null,0);blank.special=null;s.inventory.push(blank);assert(E.equipItem(s,blank.id,'ring1'));assert.equal(it.special.growthKills,7);assert.equal(E.specialAffixProgress(it).value,.7);assert(E.equipItem(s,it.id,'ring1'));assert.equal(E.stats(s).luck,a.luck);
 for(const value of [-1,.1,201,NaN,Infinity]){const bad=clone(s);bad.inventory.find(x=>x.id===it.id).special.growthKills=value;assert(!E.validSave(bad));}
 const wrong=clone(s);wrong.inventory.find(x=>x.id===it.id).special.id='knowledge';assert(!E.validSave(wrong),'non-growth affix cannot carry growth');
}
// Pending reforge never rerolls specials; newly earned progress survives every ordinary roll.
for(const [newId,expected] of [['harvester',124],['glutton',124]]){
 const s=fresh(),it=gear(s,'harvester');it.special.growthKills=123;s.consumables.reforgeToken=1;const index=E.ACTIVE_SPECIAL_KEYS.indexOf(newId);const result=constantRandom((index+.1)/E.ACTIVE_SPECIAL_KEYS.length,()=>E.reforge(s,it.id,'all'));assert(result);assert.equal(s.pendingReforge.newSpecial.id,'harvester');assert(E.validSave(s));it.special.growthKills=124;assert(E.validSave(s),'progress earned after paid preview remains valid');const candidate=E.getPendingReforgeCandidate(s);assert.equal(E.specialAffixProgress(candidate).value,expected);assert(E.resolveReforge(s,true));assert.equal(E.specialAffixProgress(it).value,expected);assert(E.validSave(s));
}
// Missing old run ledgers are narrowly inferred without deleting saves/items;
// after the first stage, unknown prior proc usage is conservatively spent.
{
 const s=fresh();gear(s,'shelter','ring','ring1');gear(s,'nirvana','ring','ring2');let e=start(s,'dwarf.a01.dungeon');e.shield=17;finish(s);delete s.dungeonRun.affixUsage;assert(E.validSave(s));assert(E.normalizeExpedition(s));assert.deepEqual(s.dungeonRun.affixUsage,{shelterUsed:true,nirvanaUsed:true});e=start(s,'dwarf.a01.dungeon');assert.equal(e.shield,17,'remaining shield carries, no fresh shield');assert(e.affixState.nirvanaUsed);
 delete s.dungeonRun.affixUsage;e.affixState.nirvanaUsed=false;e.shelterUsed=false;assert(E.validSave(s));const resumed=JSON.parse(JSON.stringify(s));assert(E.normalizeExpedition(resumed));assert(resumed.activeEncounter.affixState.nirvanaUsed);assert(resumed.activeEncounter.shelterUsed);assert(E.validSave(resumed));const again=JSON.parse(JSON.stringify(resumed));assert(E.normalizeExpedition(again));assert.deepEqual(again.dungeonRun.affixUsage,resumed.dungeonRun.affixUsage);again.activeEncounter.heroBurn=1;again.activeEncounter.heroBurnPower=1e9;step(again);assert.equal(again.heroHp,0,'legacy resume cannot renew revival');
 for(const bad of [null,{}, {shelterUsed:true,nirvanaUsed:1},{shelterUsed:true,nirvanaUsed:true,extra:true}]){const broken=clone(resumed);broken.dungeonRun.affixUsage=bad;assert(!E.validSave(broken),'malformed present scope is not normalized');}
 const mismatch=clone(resumed);mismatch.activeEncounter.affixState.nirvanaUsed=false;assert(!E.validSave(mismatch));
}
console.log('PASS special-affix overhaul: retired-save preservation, exact rates, multi-segment momentum, growth stats/validation/reforge, conservative dungeon resume and bounded scope validation');
