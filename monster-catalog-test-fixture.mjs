import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
// Preserve the exact historical 217 regional actors and seven legacy identities.
const original=JSON.parse(readFileSync(new URL('./fixtures/boss-growth/parameter-contract.json',import.meta.url))).map(row=>row.id);
const legacy=['grayflag-raider','grayflag-vorn','rogue-mine-golem','furnace-warden','oathless-soldier','oathkeeper-morl','rogue-mine-golem-elite'];
export function assertMonsterCatalogIds(catalog){
 assert.equal(original.length,217);
 const expected=[...original,...legacy,'human.a10.boss','goblin.a10.boss'];
 assert.equal(new Set(expected).size,226);
 assert.deepEqual(Object.keys(catalog).sort(),expected.sort(),'exact original 224 codex identities plus the authorized human and goblin A10 bosses');
}

export function assertPlannedNodeIds(nodes){
 const standard=['human','dwarf','elf','goblin','ashen'].flatMap(race=>Array.from({length:10},(_,i)=>race+'.a'+String(i+1).padStart(2,'0')).flatMap(area=>[area+'.field',area+'.dungeon']));
 const oldBosses=original.filter(id=>id.endsWith('.boss'));
 assert.equal(oldBosses.length,17);
 const expected=[...standard,...oldBosses,'human.a10.boss','goblin.a10.boss'];
 assert.equal(expected.length,119);
 assert.deepEqual(nodes.map(n=>n.id).sort(),expected.sort(),'exact original 117 nodes plus human and goblin A10 bosses');
}
