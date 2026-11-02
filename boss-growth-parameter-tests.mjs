import assert from 'node:assert/strict';
import fs from 'node:fs';
import {WORLD_MONSTERS,monsterParameters} from './dist/world-content.js';
import {BOSS_DPS_REFERENCE_FRACTION} from './dist/monster-balance.js';
const rows=JSON.parse(fs.readFileSync(new URL('./fixtures/boss-growth/parameter-contract.json',import.meta.url)));
assert.equal(BOSS_DPS_REFERENCE_FRACTION,.024);
const added={...JSON.parse(fs.readFileSync(new URL('./fixtures/boss-growth/human-a10-v080.json',import.meta.url))),...JSON.parse(fs.readFileSync(new URL('./fixtures/boss-growth/goblin-a10-v087.json',import.meta.url)))};
assert.deepEqual(Object.keys(WORLD_MONSTERS).sort(),[...rows.map(r=>r.id),...Object.keys(added)].sort());
for(const [id,parameters] of Object.entries(added))assert.deepEqual(monsterParameters(id),parameters,id+' exact v080 addition');
for(const r of rows){
 assert.deepEqual(monsterParameters(r.id),r.after,r.id+' fixed exact production contract');
 // XP is the sole authorized exception to the earlier damage-only contract.
 assert(r.after.rewardXp>=r.before.rewardXp,r.id+' XP never reduced');
 for(const k of Object.keys(r.before).filter(k=>!['rewardXp',...(r.rank==='boss'?['atk','elementalPower']:[])].includes(k)))assert.deepEqual(r.after[k],r.before[k],r.id+' '+k+' unchanged');
 assert.equal(r.after.hp,r.before.hp);
 if(r.rank==='boss')for(const k of ['atk','elementalPower'])assert(Math.abs(r.after[k]-r.before[k]*2)<=.0011);
}
console.log('PASS exact fixed parameters: XP-only reward exception; boss power x2; all other threat, gold, authored mechanics and reward sources preserved.');
