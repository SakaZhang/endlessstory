// Derived exclusive-effect power only. Never alter base stats, affix rolls or saves.
const excluded=new Set(['infinity-gauntlet','return-ring','ashen-primal-core']);
export function legendaryDivineMultiplier(item){return typeof item?.legendaryId==='string'&&item.legendaryId.length>0&&!excluded.has(item.legendaryId)&&item.divine?.id==='forge-favor'&&['raw-v1','raw-v2'].includes(item.divine.model)?2:1;}
