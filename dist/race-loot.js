// Candidate rate; only a second ordinary material unit, never a quality reroll.
export const GOBLIN_EXTRA_MATERIAL_CHANCE=.10;
export function goblinExtraMaterialEligible(race,row,material){return race==='goblin'&&row?.channel==='regular'&&material?.category==='常规'&&!material.uniqueHeld&&!material.storyOnly;}
export function rollGoblinExtraMaterial(race,row,material,random=Math.random){return goblinExtraMaterialEligible(race,row,material)&&random()<GOBLIN_EXTRA_MATERIAL_CHANCE;}
