import assert from 'node:assert/strict';import{createLegendaryState,validLegendaryState,reduceLegendaryEvent as reduce}from './dist/races/goblin/legends.js';
const blade='goblin-silent-ration',boots='goblin-silent-steps';let state=createLegendaryState(blade);const context={clock:0,maxHp:1000,targetId:'a'};
let r=reduce({legendaryId:blade,state,event:{type:'beforeDirectHit',hit:true,sourceKind:'skill',shieldBefore:1000},context});assert.equal(r.commands[0].amount,80);assert.equal(r.commands[0].durationMs,6000);state=r.state;
assert.equal(reduce({legendaryId:blade,state,event:{type:'beforeDirectHit',hit:true,sourceKind:'basic',shieldBefore:1000},context}).commands.length,0);
r=reduce({legendaryId:blade,state,event:{type:'beforeDirectHit',hit:true,sourceKind:'basic',shieldBefore:0},context:{...context,targetId:'b'}});assert.equal(r.commands[0].coefficient,.7);assert(r.commands[0].crit&&r.commands[0].lifesteal);assert.equal(r.commands[0].reaperEligible,false);
assert.equal(reduce({legendaryId:blade,state:r.state,event:{type:'directHit',shieldBefore:0},context:{...context,targetId:'c'}}).commands.length,0);
assert.deepEqual(reduce({legendaryId:blade,state:r.state,event:{type:'encounterStart'},context}).state.seenTargetIds,[]);
state=createLegendaryState(boots);r=reduce({legendaryId:boots,state,event:{type:'enemyMiss'},context:{clock:1100,activeSkillIds:['a'],cooldowns:{a:9}}});assert.deepEqual(r,{state:{version:1,passive:true},commands:[]});assert(validLegendaryState(boots,JSON.parse(JSON.stringify(r.state))));assert.equal(createLegendaryState('goblin-returning-spring'),null);
console.log('PASS Goblin dagger unchanged; boots passive state/JSON, no cooldown rewind, old amulet retired.');
