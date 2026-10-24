import assert from 'node:assert/strict';
import {createLegendaryState as create,validLegendaryState as valid,reduceLegendaryEvent as reduce} from '../../../dist/races/ashen/legendary.js';
for(const id of ['ashen-molten-core','ashen-stone-core','ashen-crystal-core','ashen-primal-core']){
 const state=create(id),before=structuredClone(state);assert(valid(id,state));assert(!valid(id,{...state,unexpected:1}));assert.equal(reduce({legendaryId:id,state,event:{type:'combatTick'},context:{clock:-1}}),null);
 const result=reduce({legendaryId:id,state,event:{type:'unknown'},context:{clock:0}});assert.deepEqual(state,before);assert.deepEqual(result.commands,[]);assert(valid(id,JSON.parse(JSON.stringify(result.state))));
}
assert.equal(create('ashen-veinbreaker'),null);assert.equal(create('ashen-dusk-prism'),null);
await import('../../../ashen-legend-core-tests.mjs');
console.log('PASS pure core reducers reject malformed ledgers and preserve input state.');
