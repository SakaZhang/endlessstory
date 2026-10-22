// Existing mechanics regressions model the pre-v0.19 save/starter unchanged.
// New level-gating tests import real fresh() directly.
import {fresh,normalizeSkillProgression} from './dist/engine.js';
export function legacyFresh(){
 const s=fresh();delete s.skillRulesVersion;delete s.skillAccess;
 s.build='anvil';s.skills=['break','heavy','interrupt',null];s.conditions=['always','always','charge','always'];
 if(!normalizeSkillProgression(s))throw new Error('Legacy test fixture migration failed');
 return s;
}
