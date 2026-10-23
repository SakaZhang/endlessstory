// Pure approved policy functions. No production imports, source selection, or RNG.
export const LUCK_POLICY=Object.freeze({maxRating:1000,legendaryBase:.05,legendaryBonusLimit:.02,ordinarySecondRollLimit:.06,scale:5});
function validRating(r){return Number.isFinite(r)&&r>=0&&r<=LUCK_POLICY.maxRating;}
function validPP(p){return Number.isFinite(p)&&p>=0&&p<=1;}
export function legendaryPoolProbability(r,explicitRarePP=0){
 if(!validRating(r)||!validPP(explicitRarePP))return null;
 return Math.min(1,LUCK_POLICY.legendaryBase+LUCK_POLICY.legendaryBonusLimit*r/(r+LUCK_POLICY.scale)+explicitRarePP);
}
// This is the probability of the existing extra roll, not an additive rarity rate.
// Caller rolls the same quality/value distribution twice and takes the better once.
export function ordinarySecondRollProbability(r){
 if(!validRating(r))return null;
 return LUCK_POLICY.ordinarySecondRollLimit*r/(r+LUCK_POLICY.scale);
}
// Policy availability only; this module never activates production channels.
export const RESERVED_LUCK_CHANNELS=Object.freeze({divine:Object.freeze({enabled:true}),specialAffix:Object.freeze({enabled:true})});
export function reservedLuckChannelPolicy(channel){return typeof channel==='string'&&Object.hasOwn(RESERVED_LUCK_CHANNELS,channel)?RESERVED_LUCK_CHANNELS[channel]:null;}
// Eligible occurrence only: callers retain their existing source/condition gates.
export function lootOccurrenceProbability(base,r){
 if(!validPP(base)||!validRating(r))return null;
 return Math.min(1,base*(1+.10*r/(r+LUCK_POLICY.scale)));
}
// Fresh divine rolls only; never re-roll an already blessed item.
export function divineProbability(base,r){
 if(!validPP(base)||!validRating(r))return null;
 return Math.min(1,base*(1+.20*r/(r+LUCK_POLICY.scale)));
}
