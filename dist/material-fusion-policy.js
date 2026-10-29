// Material-only quality policy. Equipment-input fusion intentionally uses its own formula.
export const FULL_MATERIAL_QUALITY_ANCHORS=Object.freeze([[30,50,17,3],[27,49,20,4],[0,35,55,10],[0,0,70,30]].map(Object.freeze));
export function materialFusionQualityWeights(qualities){
 if(!Array.isArray(qualities)||qualities.length<1||qualities.length>5||qualities.some(q=>!Number.isInteger(q)||q<0||q>3))return null;
 const n=qualities.length,a=qualities.reduce((s,q)=>s+q,0)/n;
 if(n<5)return [50-4*n-3*a,40+2*n-a,9+1.6*n+3*a,1+.4*n+a];
 const lo=Math.floor(a),hi=Math.min(3,lo+1),fraction=a-lo;
 return FULL_MATERIAL_QUALITY_ANCHORS[lo].map((value,i)=>value+(FULL_MATERIAL_QUALITY_ANCHORS[hi][i]-value)*fraction);
}
const METAL=Object.freeze({weapon:2,helm:1,armor:2,gloves:1,boots:1});
const SOFT=Object.freeze({weapon:1,helm:0,armor:1,gloves:2,boots:2,ring:0,amulet:1});
const CRYSTAL=Object.freeze({weapon:1,helm:0,armor:0,gloves:1,boots:0,ring:2,amulet:2});
const BOTANICAL=Object.freeze({weapon:0,helm:1,armor:0,gloves:1,boots:1,ring:1,amulet:2});
export function materialFusionSlotBias(meta){
 if(!meta||meta.storyOnly||meta.uniqueHeld||meta.kind==='宝石')return null;
 if(['金属','矿石','矿物'].includes(meta.kind))return METAL;
 if(['生物','兽材','纤维'].includes(meta.kind))return SOFT;
 if(['晶矿','晶核','遗物','盐类'].includes(meta.kind))return CRYSTAL;
 if(['植物','菌植'].includes(meta.kind))return BOTANICAL;
 return null;
}
// Exact marginal probabilities of the same optional best-of-two used by forgeLuckyRoll.
export function favorableQualityProbabilities(weights,chance){
 if(!weights||!Number.isFinite(chance)||chance<0||chance>1)return null;
 const total=weights.reduce((s,w)=>s+w,0);let cdf=0,previous=0;
 return weights.map(w=>{cdf+=w/total;const next=(1-chance)*cdf+chance*cdf*cdf,result=Math.max(0,next-previous);previous=next;return result;});
}
