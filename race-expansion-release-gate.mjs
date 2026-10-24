import {EXPANSION_PACKS} from './dist/race-packs.js';
const blockers=[];
for(const p of EXPANSION_PACKS){if(p.parameters?.reviewed!==true||p.parameters?.testOnly!==false)blockers.push(p.id+': numeric provider remains candidate');if(p.releaseReview?.artApproved!==true)blockers.push(p.id+': native art/frame/scale approval not recorded');if(p.releaseReview?.actualSetAndLegendTests!==true)blockers.push(p.id+': complete equipped set/legend behavior evidence not recorded');}
console.log(JSON.stringify({ready:blockers.length===0,blockers},null,2));if(blockers.length)process.exitCode=1;
