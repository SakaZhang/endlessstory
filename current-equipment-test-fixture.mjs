// Explicit current-schema affix fixtures; no raw-budget bypass or save repair.
import {AFFIX_DEFS} from './dist/engine.js';
import {makeAffixSourceRange} from './dist/affix-range.js';
export function currentAffix(stat,value,quality=0){const sourceRange=makeAffixSourceRange(AFFIX_DEFS[stat],quality);if(!sourceRange||!Number.isInteger(value)||value<sourceRange.min||value>sourceRange.max)throw Error('Invalid explicit affix fixture '+stat+':'+value);return {stat,value,sourceRange};}
