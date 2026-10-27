// v0.71: one shared policy for all races. Old allocations remain valid.
export const TALENT_BALANCE_VERSION=1;
export function activeHealingMultiplier(points=0){
 const p=Math.max(0,Number.isFinite(points)?points:0),early=Math.min(10,p),late=Math.max(0,p-10);
 // +4 percentage points per point through 10; diminishing thereafter, <80% total.
 return 1+.04*early+.4*late/(20+late);
}
export function talentNegativeDuration(durationMs,points=0,{minimumMs=1,durationMultiplier=1}={}){
 if(!Number.isFinite(durationMs)||durationMs<0)throw new RangeError('Invalid status duration');
 if(durationMs===0)return 0;
 const p=Math.min(10,Math.max(0,Number.isFinite(points)?points:0));
 return Math.min(durationMs,Math.max(minimumMs,Math.round(durationMs*durationMultiplier*(1-.02*p))));
}
export function talentRefundCost(s,points){
 const creditsBefore=s.consumables?.refundCredits??0;
 const correction=(s.talentBalanceVersion??0)<TALENT_BALANCE_VERSION;
 if(s.level<=20||correction)return {points,fruitCost:0,creditsBefore,creditsAfter:creditsBefore,goldCost:0,freeReason:correction?'balance-correction':'early-level'};
 // Existing credits/fruits retain value; missing credits can always be bought at
 // the old fruit unit price (200/10), without a random merchant bottleneck.
 const needed=Math.max(0,points-creditsBefore),fruitCost=Math.min(s.consumables?.memoryFruit??0,Math.ceil(needed/10));
 const goldCost=Math.max(0,needed-fruitCost*10)*20;
 return {points,fruitCost,creditsBefore,creditsAfter:Math.max(0,creditsBefore+fruitCost*10-points),goldCost,freeReason:null};
}
