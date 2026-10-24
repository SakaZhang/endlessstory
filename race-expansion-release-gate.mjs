import {validWorldMaterialPool} from './dist/world-materials.js';
import {materialChannelProbability,materialQualityWeights} from './dist/material-loot-profile.js';
import {EXPANSION_PACKS} from './dist/race-packs.js';
const blockers=[];
for(const p of EXPANSION_PACKS){if(p.parameters?.reviewed!==true||p.parameters?.testOnly!==false)blockers.push(p.id+': numeric provider remains candidate');if(p.releaseReview?.artApproved!==true)blockers.push(p.id+': native art/frame/scale approval not recorded');if(p.releaseReview?.actualSetAndLegendTests!==true)blockers.push(p.id+': complete equipped set/legend behavior evidence not recorded');}
for(const p of EXPANSION_PACKS)for(const pool of Object.values(p.materialPools)){const area=Number(pool.nodeId.split('.')[1].slice(1)),kind=pool.nodeId.split('.').at(-1),rank=Object.values(p.monsters).find(m=>m.id===pool.monsterId)?.rank;if(!validWorldMaterialPool(pool)||pool.channels.some(c=>c.quantity!==1||c.hitProbability!==(c.entries.length?materialChannelProbability(c.channel,area,kind,rank):0)))blockers.push(p.id+': material profile mismatch '+pool.monsterId+' '+pool.nodeId);}
console.log(JSON.stringify({ready:blockers.length===0,blockers},null,2));if(blockers.length)process.exitCode=1;
