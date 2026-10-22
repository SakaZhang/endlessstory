import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
import {legacyFresh} from './legacy-skill-test-fixture.mjs';
import {applySupportGrant} from './dist/storage.js';
const fresh=E.fresh(),original=structuredClone(fresh);let writes=0;const storage={setItem(){writes++;}};
assert.equal(fresh.gold,100);assert.equal(fresh.bonusTalentPoints??0,0);assert.equal(fresh.consumables.memoryFruit,0);assert.equal(fresh.supportGrantEligible,false);assert(E.validSave(fresh));
for(const s of [fresh,JSON.parse(JSON.stringify(fresh))]){assert.equal(E.grantDevelopmentSupport(s),false);assert.deepEqual(s,original);assert(!applySupportGrant(storage,s).granted);}assert.equal(writes,0);
for(const value of [null,0,'false',[],{}]){const s=structuredClone(fresh);s.supportGrantEligible=value;assert(!E.validSave(s));}
const old=legacyFresh();assert.equal(old.supportGrantEligible,undefined);const inventory=JSON.stringify(old.inventory);assert(E.grantDevelopmentSupport(old));assert.equal(old.gold,5100);assert.equal(old.bonusTalentPoints,30);assert.equal(old.consumables.memoryFruit,3);assert.equal(JSON.stringify(old.inventory),inventory);assert(E.validSave(old));const once=structuredClone(old);assert(!E.grantDevelopmentSupport(old));assert.deepEqual(old,once);const imported=JSON.parse(JSON.stringify(old));assert(!applySupportGrant(storage,imported).granted);assert.deepEqual(imported,once);
const explicit=legacyFresh();explicit.supportGrantEligible=true;assert(E.validSave(explicit));assert(E.grantDevelopmentSupport(explicit));assert.equal(explicit.gold,5100);
console.log('PASS M2 support eligibility: fresh100gold/no30points/no3fruit, explicitfalse survivesJSON/no writes, legacy missing retains once-only grant and all existing assets');
