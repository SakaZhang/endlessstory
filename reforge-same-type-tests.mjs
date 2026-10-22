import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
const s=E.fresh(),it=E.item('gloves',2,null,1),d=E.item('boots',2,null,0);it.affixes=[{stat:'atk',value:3},{stat:'hp',value:15}];d.affixes=[{stat:'atk',value:8}];s.inventory.push(it,d);
assert.deepEqual(E.eligibleReforgeDonors(s,it.id).find(x=>x.item.id===d.id).affixes,d.affixes);
assert(!E.eligibleReforgeDonors(s,it.id,1).some(x=>x.item.id===d.id));
assert(E.reforge(s,it.id,'replace',0,d.id));assert.equal(s.pendingReforge.ruleVersion,4);assert(E.validSave(s));assert.deepEqual(s.pendingReforge.newAffixes,[{stat:'atk',value:8},{stat:'hp',value:15}]);
for(const version of [2,3]){const old=structuredClone(s);old.pendingReforge.ruleVersion=version;assert(!E.validSave(old),'legacy same-type was never legal');old.pendingReforge.newAffixes[0]={stat:'armor',value:6};old.pendingReforge.donor.eligibleStats=['armor'];old.pendingReforge.donor.eligibleAffixes=[{stat:'armor',value:6}];old.pendingReforge.donor.selectedAffix={stat:'armor',value:6};assert(E.validSave(old));assert(E.resolveReforge(old,true));assert.deepEqual(old.inventory.find(x=>x.id===it.id).affixes,[{stat:'armor',value:6},{stat:'hp',value:15}]);}
assert(E.resolveReforge(s,true));assert.deepEqual(it.affixes,[{stat:'atk',value:8},{stat:'hp',value:15}]);
console.log('PASS same-type rule4: selected slot allowed, retained slot excluded, default index0, raw inheritance; legacy2/3 candidates keep historical semantics.');
