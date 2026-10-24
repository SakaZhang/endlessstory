import {RACE_RELEASE_REVIEW} from './race-release-review.js';
import {RACE_PACK as HUMAN} from './races/human/index.js';
import {RACE_PACK as GOBLIN} from './races/goblin/index.js';
import {RACE_PACK as ELF} from './races/elf/index.js';
import {RACE_PACK as ASHEN} from './races/ashen/index.js';
// Integration candidates; release review must check numeric and visual gates.
export const EXPANSION_PACKS = Object.freeze([HUMAN,ELF,GOBLIN,ASHEN].map(pack=>({...pack,releaseReview:RACE_RELEASE_REVIEW[pack.id]})));
