import assert from 'node:assert/strict';
import {fresh,legendaryItem,LEGENDARY_CODEX} from './dist/engine.js';
import {renderCharacterStats} from './dist/character-stats-ui.js';
import {returnRingExperienceBonus} from './dist/return-ring-state.js';
import {RETURN_RING_DEFINITION} from './dist/return-ring-content.js';
const s=fresh(),ring=legendaryItem('return-ring',1);s.inventory.push(ring);
// JSON roundtrip represents an existing saved ring; no new XP field/migration.
const old=JSON.parse(JSON.stringify(s));
function check(expected){const before=JSON.stringify(old),html=renderCharacterStats(old);assert.equal(returnRingExperienceBonus(old),expected/100);assert.match(html,new RegExp(`<span>经验获取加成</span><span>${expected}%</span><b class="">${expected}%</b>`));assert.equal(JSON.stringify(old),before);return html;}
check(0);old.equip.ring1=ring.id;assert(check(20).includes('装备时经验获取 +20%'));old.equip.ring2=ring.id;check(20);old.equip.ring1=null;check(20);old.equip.ring2=null;check(0);
assert.match(LEGENDARY_CODEX.find(x=>x.id==='return-ring').effect,/经验获取 \+20%/);assert.match(RETURN_RING_DEFINITION.exclusiveDescription,/经验获取 \+20%/);
console.log('PASS XP panel: old ring equip/unequip, either socket, duplicate sockets stay 20%, read-only, codex/definition copy');
