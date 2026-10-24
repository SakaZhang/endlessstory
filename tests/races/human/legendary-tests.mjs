import assert from 'node:assert/strict';
import {createLegendaryState as create,validLegendaryState as valid,reduceLegendaryEvent as reduce} from '../../../dist/races/human/legendary.js';
const sword='human-oathblade',banner='human-banner-armor',ctx={clock:0,maxHp:1000,stats:{atk:100},targetId:'enemy'};
const hit=(castId,extra={})=>({type:'directHit',castId,sourceKind:'skill',hit:true,hpBefore:1000,hpAfter:900,damageType:'physical',...extra});
let s=create(sword);assert(valid(sword,s));let r=reduce({legendaryId:sword,state:s,event:hit('one'),context:ctx});assert.equal(r.commands.length,0);assert.equal(r.state.targetId,'enemy');s=r.state;
for(const [clock,event] of [[3300,hit('one')],[1100,hit('two')],[3300,hit('two',{hit:false})],[3300,hit('two',{sourceKind:'basic'})],[3300,hit('two',{damageType:'fire'})]]){r=reduce({legendaryId:sword,state:s,event,context:{...ctx,clock}});assert.equal(r.commands.length,0);}
r=reduce({legendaryId:sword,state:s,event:hit('two'),context:{...ctx,clock:3300}});assert.equal(r.commands.length,2);assert.equal(r.commands[0].coefficient,.8);assert.equal(r.commands[1].amount,8);assert.equal(r.state.nextReadyAt,13300);assert.equal(r.state.targetId,null);s=r.state;
r=reduce({legendaryId:sword,state:s,event:{type:'encounterStart'},context:{...ctx,clock:4400}});assert.equal(r.state.nextReadyAt,13300);assert.equal(r.state.targetId,null);
r=reduce({legendaryId:sword,state:s,event:hit('three'),context:{...ctx,clock:5500}});assert.equal(r.state.targetId,null,'ICD carries fields');
s=create(sword);s=reduce({legendaryId:sword,state:s,event:hit('one'),context:ctx}).state;r=reduce({legendaryId:sword,state:s,event:hit('two'),context:{...ctx,clock:6100}});assert.equal(r.commands.length,0,'expiredmark never detonates');assert.equal(r.state.markedAt,6100);
const event={type:'enemyDamageSegment',sourceKind:'enemy-direct',attackerId:'enemy',actualHpLost:150,actualShieldAbsorbed:50};
for(const type of ['enemy-direct','enemy-dot']){const r=reduce({legendaryId:banner,state:create(banner),event:{...event,sourceKind:type},context:ctx});assert.equal(r.commands[0].amount,100);assert.equal(r.commands[0].type,'reflectDamage');assert.equal(r.commands[0].activeCastCount,0);}
for(const bad of [{...event,recursive:true},{...event,sourceKind:'reflection'},{...event,attackerId:null},{...event,actualHpLost:-1},{...event,actualShieldAbsorbed:NaN},{...event,actualHpLost:0,actualShieldAbsorbed:0}])assert.equal(reduce({legendaryId:banner,state:create(banner),event:bad,context:ctx}).commands.length,0);
assert.equal(create('human-last-banner'),null);assert.deepEqual(create(banner),{version:1});assert(!valid(banner,{version:1,nextReadyAt:0}));
console.log('PASS preserved oathblade reducer; 50% actual HP + shields, DOT, recursion/invalid-source guards, retired amulet absent.');
