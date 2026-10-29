import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
// Historical source stays pinned; visible prose can evolve without weakening gates.
const source=execFileSync('git',['show','8d08d0b73f6e765749526b51785880d2a46132a6:dist/story-event-registry.js'],{encoding:'utf8'});
const start=source.indexOf(' "C01.H01.human"'),end=source.indexOf('\n});',start);
const baseline=JSON.parse('{'+source.slice(start,end)+'\n}');
const contract=scene=>{const {title,npc,lines,objective,...rest}=scene;return {...rest,choices:scene.choices.map(({label,...c})=>c),knowledge:scene.knowledge.map(({text,...k})=>k)};};
export function assertOriginalStoryContracts(scenes,ids=Object.keys(baseline)){
 assert.equal(Object.keys(baseline).length,103);
 for(const id of ids)assert.deepEqual(contract(scenes[id]),contract(baseline[id]),'unchanged story mechanics '+id);
}
