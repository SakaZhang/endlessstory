import {lootOccurrenceProbability} from './luck-policy.js';
// Existing source eligibility and held-unique filtering are owned by the caller.
// Add AFTER the existing luck term. A zero/empty channel is never resurrected.
export function rareMaterialOccurrenceProbability(channel,base,luck,bonuses={}){
 const chance=lootOccurrenceProbability(base,luck);if(chance===null)return 0;
 if(base<=0||!['special','gem'].includes(channel))return chance;
 const bonus=bonuses?.[channel];return Math.min(1,chance+(Number.isFinite(bonus)&&bonus>=0&&bonus<=1?bonus:0));
}
