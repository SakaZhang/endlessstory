import assert from 'node:assert/strict';
import {materialAssociations,materialPools} from './dist/races/goblin/material-pools.js';
import {materials} from './dist/races/goblin/materials.js';
import {monsters} from './dist/races/goblin/monsters.js';
import {materialChannelProbability,materialQualityWeights} from './dist/material-loot-profile.js';
assert.equal(Object.keys(materialAssociations).length,74);let channels=0;
for(const [key,a] of Object.entries(materialAssociations)){
 const p=materialPools[key],area=+a.nodeId.split('.')[1].slice(1),kind=a.nodeId.split('.')[2];
 for(const c of a.channels){assert.deepEqual(Object.keys(c).sort(),['channel','entries']);for(const e of c.entries){assert.deepEqual(Object.keys(e).sort(),['materialId','weight']);assert(materials[e.materialId].sources.includes(a.nodeId));assert(!materials[e.materialId].storyOnly);}}
 for(const c of p.channels){assert.equal(c.quantity,1);assert.equal(c.hitProbability,c.entries.length?materialChannelProbability(c.channel,area,kind,monsters[a.monsterId].rank):0);if(c.entries.length){channels++;assert(Math.abs(c.entries.reduce((n,e)=>n+e.weight,0)-1)<1e-10);}
  for(const e of c.entries){const m=materials[e.materialId],fixed=c.channel==='gem'||m.qualityRange?.length===1&&m.qualityRange[0]===3;assert.deepEqual(e.qualityWeights,fixed?[0,0,0,1]:materialQualityWeights(area,kind));}
 }
}
console.log(`PASS Goblin74 associations, ${channels} nonempty shared-profile channels; canonical source/quantity1/area quality/node-rank probability/no story drops.`);
