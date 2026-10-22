const UP=[0,.08,.14,.20,.27,1/3],DOWN=[0,.52,.48,.43,.38,1/3];
function valid(inputs){return Array.isArray(inputs)&&inputs.length>=1&&inputs.length<=5&&Array.from(inputs).every(x=>x&&['equipment','material'].includes(x.kind)&&Number.isInteger(x.quality)&&x.quality>=0&&x.quality<=3);}
function model(inputs){
 if(!valid(inputs)||!inputs.some(x=>x.kind==='equipment'))return null;
 const weight=inputs.reduce((n,x)=>n+(x.kind==='equipment'?1:.5),0),mean=inputs.reduce((n,x)=>n+x.quality*(x.kind==='equipment'?1:.5),0)/weight;
 const low=Math.floor(weight),f=weight-low,interp=table=>table[low]*(1-f)+table[Math.min(5,low+1)]*f;
 return {mean,up:interp(UP),down:interp(DOWN)};
}
export function equipmentFusionQualityDistribution(inputs){
 const m=model(inputs);if(!m)return null;const result=[0,0,0,0],low=Math.floor(m.mean),f=m.mean-low;
 for(const [anchor,p] of [[low,1-f],[Math.min(3,low+1),f]])for(const [delta,q] of [[1,m.up],[0,1-m.up-m.down],[-1,m.down]])result[Math.max(0,Math.min(3,anchor+delta))]+=p*q;
 return result;
}
export function rollEquipmentInputQuality(inputs,random=Math.random){
 const m=model(inputs);if(!m)return null;const low=Math.floor(m.mean),fraction=m.mean-low;
 const anchor=low+(random()<fraction?1:0),branch=random();return Math.max(0,Math.min(3,anchor+(branch<m.up?1:branch<1-m.down?0:-1)));
}
export function fusionDivineChance(inputs){
 if(!valid(inputs))return null;
 return Math.min(.06,.03+inputs.reduce((n,x)=>n+(x.kind==='equipment'?(x.quality===3?.006:0):[0,.001,.003,.005][x.quality]),0));
}
