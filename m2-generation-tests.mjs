import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
import {deriveNewItemBudget,validItemBudgetMetadata} from './dist/equipment-budget-adapter.js';
import {legacyFresh} from './legacy-skill-test-fixture.mjs';
const keys=['baseBudgetModel','budgetLevel','budgetSourceLevel','budgetCompatibility'];
for(const level of [1,10,30,100,137])for(const rarity of [0,1,2,3])for(const slot of E.SLOTS){const it=E.item(slot,level,null,rarity),expected=deriveNewItemBudget({slot,baseVariant:it.baseVariant,level,quality:rarity});for(const key of ['atk','armor','hp',...keys])assert.deepEqual(it[key],expected[key]);assert(validItemBudgetMetadata(it));}
const old=Math.random;let calls=0;Math.random=()=>{calls++;return .9;};try{const it=E.item('weapon',10,null,3);assert.equal(calls,10,'ID + 8 affix rolls + special eligibility, no discarded spread RNG');assert(validItemBudgetMetadata(it));}finally{Math.random=old;}
const fresh=E.fresh();assert(E.validSave(fresh));assert.equal(fresh.siteId,'dwarf.a01');assert(!fresh.contentMigration.reselectRequired);assert(fresh.inventory.every(validItemBudgetMetadata));assert(fresh.inventory.every(it=>it.affixes.length===0));
const legacy=legacyFresh(),raw=structuredClone(legacy.inventory);E.normalizeEquipmentLevels(legacy);assert.deepEqual(legacy.inventory,raw);assert(E.validSave(legacy));
const hero=E.fresh();hero.level=137;hero.gold=10000;const result=E.forge(hero,['铁屑|0']);assert(result);assert.equal(result.level,137);assert.equal(result.budgetLevel,100);assert(E.validSave(hero));
const merchant=E.ensureMerchant(hero,hero.lastSeen);assert(merchant.offers.filter(o=>o.type==='equipment').every(o=>validItemBudgetMetadata(o.item)));
const bad=structuredClone(hero);bad.inventory[0].atk++;assert(!E.validSave(bad),'new raw metadata validates exact deterministic budget');
const divine=E.item('weapon',10,null,3);const before=structuredClone(divine);E.applyForgeFavor(divine);for(const k of ['atk','armor','hp'])assert.equal(divine[k],before[k]);assert(validItemBudgetMetadata(divine));
console.log('PASS M2 new item/fresh/forge/shop deterministic raw, allqualities/levels/provenance cap, no spread RNG, old raw unchanged, raw tamper rejected, divine nonmutation');
