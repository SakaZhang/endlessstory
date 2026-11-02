import {EXPANSION_PACKS} from './race-packs.js';
// One independent roll per eligible clear/victory, never behind ordinary gear RNG.
export const RACIAL_SET_POOLS=Object.freeze({dwarf:Object.freeze(['anvil','rune','guard']),human:Object.freeze([]),elf:Object.freeze([]),goblin:Object.freeze([]),ashen:Object.freeze([]),...Object.fromEntries(EXPANSION_PACKS.map(p=>[p.id,Object.freeze(p.sets.map(s=>s.id))]))});
const slots=Object.freeze(['helm','armor','gloves','boots']);
export function setDropProbability(kind,luck=0){
 if(!['field','dungeon','boss'].includes(kind)||!Number.isFinite(luck)||luck<0||luck>1000)return null;
 return ({field:.03,dungeon:.15,boss:.25}[kind])*(1+.20*luck/(luck+5));
}
export function eligibleSetSource({source,kind,areaNumber,race,clear=false}){
 return source==='drop'&&(kind==='field'||kind==='boss'||kind==='dungeon'&&clear===true)&&Number.isInteger(areaNumber)&&areaNumber>=3&&areaNumber<=10&&!!RACIAL_SET_POOLS[race]?.length;
}
export function rollSourceSet(args,random=Math.random){
 if(!eligibleSetSource(args))return null;
 const chance=setDropProbability(args.kind,args.luck??0);if(chance===null)return null;
 if(args.guaranteed!==true&&random()>=chance)return null;
 const pool=RACIAL_SET_POOLS[args.race];
 return {set:pool[Math.floor(random()*pool.length)],slot:slots[Math.floor(random()*slots.length)],rarity:3};
}
export function isMerchantEquipmentSellable(offer){return offer?.type==='equipment'&&!!offer.item&&!offer.item.set;}
