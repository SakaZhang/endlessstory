import assert from 'node:assert/strict';
import {createLegendaryState as create,validLegendaryState as valid,reduceLegendaryEvent as reduce} from '../../../dist/races/elf/legendary.js';
const staff='elf-sixfold-heartwood';let state=create(staff);let cast=0;
const context={clock:0,castId:'c0',weaponType:'staff',committed:true,damageActionCount:2,targetId:'enemy'};
function event(e,c={}){const r=reduce({legendaryId:staff,state,event:e,context:{...context,...c}});assert(r);assert.deepEqual(r.commands,[]);state=r.state;assert(valid(staff,JSON.parse(JSON.stringify(state))));}
for(const damageType of ['earth','earth','fire','water'])event({type:'directHit',sourceKind:'skill',damageType,hpLost:1,shieldLost:0});assert(!state.ready);assert.equal(state.seenElements.length,3);
event({type:'directHit',sourceKind:'skill',damageType:'light',hpLost:0,shieldLost:0});assert(!state.ready);
event({type:'directHit',sourceKind:'equipmentProc',damageType:'light',hpLost:1,shieldLost:0});assert(!state.ready);
event({type:'directHit',sourceKind:'skill',damageType:'light',hpLost:0,shieldLost:1});assert(state.ready);assert.equal(state.pendingCastId,null);
event({type:'beforeCast'},{committed:false});assert(state.ready);
event({type:'beforeCast'},{castId:'support',damageActionCount:0});assert(state.ready);
event({type:'beforeCast'},{castId:'attack'});assert(!state.ready);assert.equal(state.pendingCastId,'attack');
for(const damageType of ['earth','water','fire','wind'])event({type:'directHit',sourceKind:'skill',damageType,hpLost:1,shieldLost:0});assert(state.ready);
event({type:'beforeCast'},{castId:'attack'});assert(state.ready,'duplicate commit cannot consume second charge');
event({type:'castEnd'},{castId:'attack'});assert(state.ready);assert.equal(state.pendingCastId,null);
assert(valid('elf-last-string',create('elf-last-string')));assert.equal(create('elf-dew-covenant'),null);
console.log('PASS Elf four-distinct positive damage, shield, failed/support casts, next cast only, no synthetic recursion, one charge per cast');
