// v0.82: reduce only Goblin racial level growth, never the whole character.
// Fixed base HP/armor and all equipment, affix, talent and passive effects stay full.
// This replaces (does not stack with) both earlier equipment-only and total cuts.
export const DEFAULT_SURVIVAL_GROWTH=Object.freeze({hp:14,armor:1});
export const GOBLIN_SURVIVAL_GROWTH=Object.freeze({hp:11.2,armor:.7});
export function racialSurvivalGrowth(race){return race==='goblin'?GOBLIN_SURVIVAL_GROWTH:DEFAULT_SURVIVAL_GROWTH;}
