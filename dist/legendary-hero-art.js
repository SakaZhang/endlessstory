import {HUMAN_LEGENDARY_HERO_ART} from './legendary-hero-art/human.js';
import {DWARF_LEGENDARY_HERO_ART} from './legendary-hero-art/dwarf.js';
import {ELF_LEGENDARY_HERO_ART} from './legendary-hero-art/elf.js';
import {GOBLIN_LEGENDARY_HERO_ART} from './legendary-hero-art/goblin.js';
import {ASHEN_LEGENDARY_HERO_ART} from './legendary-hero-art/ashen.js';
export const LEGENDARY_HERO_ART=Object.freeze({human:HUMAN_LEGENDARY_HERO_ART,dwarf:DWARF_LEGENDARY_HERO_ART,elf:ELF_LEGENDARY_HERO_ART,goblin:GOBLIN_LEGENDARY_HERO_ART,ashen:ASHEN_LEGENDARY_HERO_ART});
export function extendLegendaryHeroManifest(manifest){
 manifest.legendaryHeroSprites??={};
 for(const [race,entries] of Object.entries(LEGENDARY_HERO_ART)){
  manifest.legendaryHeroSprites[race]??={};
  for(const [id,row] of Object.entries(entries)){const key=`legendary-${race}-${id}`;manifest.sprites[key]=structuredClone(row);manifest.legendaryHeroSprites[race][id]=key;}
 }
 return manifest;
}
