import {EXPANSION_PACKS} from './race-packs.js';
import {lootOccurrenceProbability} from './luck-policy.js';
// Policy only: no future playable areas or set content are created here.
export const RACIAL_SET_POOLS=Object.freeze({dwarf:Object.freeze(['anvil','rune','guard']),human:Object.freeze([]),elf:Object.freeze([]),goblin:Object.freeze([]),ashen:Object.freeze([]),...Object.fromEntries(EXPANSION_PACKS.map(p=>[p.id,Object.freeze(p.sets.map(s=>s.id))]))});
const slots=Object.freeze(['helm','armor','gloves','boots']);
export function rollSourceSet({source,kind,areaNumber,race,luck=0},random=Math.random){
 const pool=RACIAL_SET_POOLS[race];
 if(source!=='drop'||!['dungeon','boss'].includes(kind)||!Number.isInteger(areaNumber)||areaNumber<3||areaNumber>10||!Array.isArray(pool)||!pool.length)return null;
 if(random()>=lootOccurrenceProbability(kind==='boss'?.05:.03,luck))return null;
 return {set:pool[Math.floor(random()*pool.length)],slot:slots[Math.floor(random()*slots.length)],rarity:3};
}
export function isMerchantEquipmentSellable(offer){return offer?.type==='equipment'&&!!offer.item&&!offer.item.set;}
