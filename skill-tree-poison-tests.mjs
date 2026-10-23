import assert from 'node:assert/strict';
import {createSkillPoison,validSkillPoison,applySkillPoison,advanceSkillPoison} from './dist/skill-tree-poison.js';
// TEST-ONLY candidate 3s/9s timing values: user has not yet finalized tick/duration/expiry-edge policy.
const config={tickIntervalMs:3000,layerDurationMs:9000,maxLayers:5,refreshPolicy:'earliest-expiry',schedule:'per-layer',expiryTick:'inclusive'};
assert.equal(createSkillPoison('boss',undefined,0),null);assert.equal(createSkillPoison('boss',{...config,layerDurationMs:undefined},0),null);
let s=createSkillPoison('boss',config,0);const add=()=>{s=applySkillPoison(s,{enemyId:'boss',sourceId:'scatter_ash',combatClock:s.clock});};
const advance=(time,patch={})=>advanceSkillPoison(s,{enemyId:'boss',combatClock:time,targetMaxHp:10000,...patch});
add();let r=advance(3300);assert.deepEqual(r.ticks.map(t=>[t.at,t.damage]),[[3000,200]]);s=r.state;assert.equal(s.clock,3300);
const snapshot=JSON.stringify(s);r=advance(3300);assert.equal(r.ticks.length,0);assert.equal(JSON.stringify(r.state),snapshot,'pause/reload same clock cannot tick twice');
add();r=advance(6600);assert.deepEqual(r.ticks.map(t=>t.at),[6000,6300]);s=r.state;
r=advance(9900);assert.deepEqual(r.ticks.map(t=>t.at),[9000,9300]);assert.equal(r.state.layers.length,1,'independent expiry');s=r.state;
r=advance(15000);assert.deepEqual(r.ticks.map(t=>t.at),[12300]);assert.equal(r.state.layers.length,0);assert.equal(r.ticks[0].element,null);assert.equal(r.ticks[0].canCrit,false);
s=createSkillPoison('boss',config,0);for(let i=0;i<5;i++)add();const oldest=s.layers[0].serial;add();assert.equal(s.layers.length,5);assert(!s.layers.some(l=>l.serial===oldest));r=advance(3000);assert.equal(r.ticks[0].damage,1000,'boss receives same maxHP fraction');
const clone=JSON.parse(JSON.stringify(s));assert(validSkillPoison(clone));assert.deepEqual(advanceSkillPoison(clone,{enemyId:'boss',combatClock:12000,targetMaxHp:10000}),advance(12000));
let one=advance(12000),chunked=advance(12000,{maxTickGroups:1}),all=[...chunked.ticks];assert(!chunked.caughtUp);while(!chunked.caughtUp){chunked=advanceSkillPoison(chunked.state,{enemyId:'boss',combatClock:12000,targetMaxHp:10000,maxTickGroups:1});all.push(...chunked.ticks);}assert.deepEqual(all,one.ticks);assert.deepEqual(chunked.state,one.state);
const before=JSON.stringify(s);for(const patch of [{combatClock:-1},{targetMaxHp:Infinity},{enemyId:'other'},{maxTickGroups:0}])assert.equal(advance(3000,patch),null);assert.equal(JSON.stringify(s),before);
s=createSkillPoison('e',{...config,expiryTick:'exclusive'},0);s=applySkillPoison(s,{enemyId:'e',sourceId:'scatter',combatClock:0});r=advanceSkillPoison(s,{enemyId:'e',combatClock:9000,targetMaxHp:100});assert.deepEqual(r.ticks.map(t=>t.at),[3000,6000],'expiry boundary explicit, not guessed');assert.equal(r.state.layers.length,0);
assert(!validSkillPoison({version:1,enemyId:'e',stepSerial:0,layers:[]}), 'withdrawn action ledger not accepted as current semantics');
console.log('PASS combat-time poison scheduler: required timing config, due timestamp catchup/chunks, JSON/no duplicate, independent expiry, explicit edge policy, no pause/travel clock or combat RNG');

assert.equal(r.ticks[0].globalDamageMultiplierApplies,false);assert.equal(r.ticks[0].shieldPolicy,'absorb-shield-before-hp');
