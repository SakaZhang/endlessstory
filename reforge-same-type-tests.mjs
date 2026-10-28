import {currentAffix} from './current-equipment-test-fixture.mjs';
import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
const s=E.fresh(),it=E.item('gloves',2,null,1),d=E.item('gloves',2,null,0);it.affixes=[currentAffix('atk',3),currentAffix('hp',15)];d.affixes=[currentAffix('atk',8)];s.inventory.push(it,d);
assert.deepEqual(E.eligibleReforgeDonors(s,it.id).find(x=>x.item.id===d.id).affixes,d.affixes);
assert(!E.eligibleReforgeDonors(s,it.id,1).some(x=>x.item.id===d.id));
assert(E.reforge(s,it.id,'replace',0,d.id));assert.equal(s.pendingReforge.ruleVersion,8);assert(E.validSave(s));assert.deepEqual(s.pendingReforge.newAffixes,[currentAffix('atk',8),currentAffix('hp',15)]);
for(const version of [2,3]){const old=structuredClone(s);old.pendingReforge.ruleVersion=version;assert(!E.validSave(old),'legacy same-type was never legal');old.pendingReforge.newAffixes[0]=currentAffix('armor',6);old.pendingReforge.donor.eligibleStats=['armor'];old.pendingReforge.donor.eligibleAffixes=[currentAffix('armor',6)];old.pendingReforge.donor.selectedAffix=currentAffix('armor',6);assert(!E.validSave(old));const before=JSON.stringify(old);assert.equal(E.resolveReforge(old,true),null);assert.equal(JSON.stringify(old),before);}
assert(E.resolveReforge(s,true));assert.deepEqual(it.affixes,[currentAffix('atk',8),currentAffix('hp',15)]);
console.log('PASS same-type rule4: selected slot allowed, retained slot excluded, default index0, raw inheritance; legacy2/3 candidates rejected without mutation.');
