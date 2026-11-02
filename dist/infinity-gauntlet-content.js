export const INFINITY_GAUNTLET_ID='infinity-gauntlet';
export const INFINITY_RECIPE_DROP_CHANCE=.02;
export const INFINITY_GAUNTLET_MATERIALS=Object.freeze([
 {race:'dwarf',material:'dwarf.infinity_gem_dwarf'}, {race:'human',material:'human.mat.17'},
 {race:'elf',material:'elf.infinity_gem_elf'}, {race:'goblin',material:'goblin.infinity_gem_goblin'},
 {race:'ashen',material:'ashen.infinity_gem_ashen'}
].map(Object.freeze));
export const INFINITY_GAUNTLET_DEFINITION=Object.freeze({id:INFINITY_GAUNTLET_ID,ready:true,name:'无限手套',slot:'gloves',baseVariant:'gloves_armor',originRace:null,exclusiveId:'infinity-snap',questOnly:true,ordinaryAffixCount:4});

export const INFINITY_GAUNTLET_KEYS=Object.freeze(INFINITY_GAUNTLET_MATERIALS.map(m=>m.material+'|3'));
export function isInfinityGauntletFusion(selection){return Array.isArray(selection)&&selection.length===5&&new Set(selection).size===5&&INFINITY_GAUNTLET_KEYS.every(key=>selection.includes(key));}
export function hasInfinityGauntletMaterial(selection){return Array.isArray(selection)&&selection.some(key=>typeof key==='string'&&INFINITY_GAUNTLET_MATERIALS.some(m=>key.split('|')[0]===m.material));}
