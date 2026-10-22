// Existing mechanics regressions model the pre-v0.19 save/starter unchanged.
// New level-gating tests import real fresh() directly.
import {fresh,normalizeSkillProgression} from './dist/engine.js';
export function legacyFresh(){
 const s=fresh();delete s.supportGrantEligible;const bases={weapon:[13,2,7],helm:[2,5,20],armor:[2,9,20],gloves:[4,4,10],boots:[2,5,12],ring:[4,2,10],amulet:[3,2,16]};for(const it of s.inventory){[it.atk,it.armor,it.hp]=bases[it.slot];for(const key of ['baseBudgetModel','budgetLevel','budgetSourceLevel','budgetCompatibility'])delete it[key];}delete s.siteId;delete s.expedition;delete s.contentMigration;delete s.skillRulesVersion;delete s.skillAccess;
 s.build='anvil';s.skills=['break','heavy','interrupt',null];s.conditions=['always','always','charge','always'];
 if(!normalizeSkillProgression(s))throw new Error('Legacy test fixture migration failed');
 return s;
}
