// Shared established material-drop policy, extracted from the production Dwarf
// catalogue. Associations belong to each creature; this helper never broadens a
// material's source whitelist or introduces an item into an unrelated creature.
export function materialQualityWeights(area,kind){
 if(!Number.isInteger(area)||area<1||area>10||!['field','dungeon','boss'].includes(kind))throw Error('Invalid material profile');
 const t=(area-1)/9,start=[.85,.12,.028,.002],end=[.35,.35,.24,.06],multipliers=kind==='boss'?[.45,1.2,1.6,2.5]:kind==='dungeon'?[.8,1.1,1.25,1.5]:[1,1,1,1];
 const weights=start.map((v,i)=>(v+(end[i]-v)*t)*multipliers[i]),sum=weights.reduce((a,b)=>a+b,0);return weights.map(v=>v/sum);
}
export function materialChannelProbability(channel,area,kind,rank){
 materialQualityWeights(area,kind);
 if(channel==='regular')return {field:.35,dungeon:.5,boss:.75}[kind];
 if(channel==='recovery')return {field:.6,dungeon:.75,boss:.9}[kind];
 if(channel==='special')return {field:.005,dungeon:.015,boss:.08}[kind]*(1+.08*(area-1))*(kind!=='boss'&&rank==='elite'?1.5:1);
 if(channel==='gem')return .00005*area*({field:1,dungeon:2.5,boss:10}[kind]);
 throw Error('Unknown material channel');
}
export function buildMaterialPools({materials,monsters,associations}){
 const monsterMap=Array.isArray(monsters)?Object.fromEntries(monsters.map(m=>[m.id,m])):monsters,out={};
 for(const [key,source]of Object.entries(associations)){
  const {monsterId,nodeId}=source,match=/^[^.]+\.a(\d{2})\.(field|dungeon|boss)$/.exec(nodeId),monster=monsterMap[monsterId];
  if(!match||!monster||key!==monsterId+'|'+nodeId||!(monster.sources??monster.nodes??[]).includes(nodeId))throw Error('Invalid material association '+key);
  const area=Number(match[1]),kind=match[2],rank=monster.rank,by={regular:new Map(),recovery:new Map(),special:new Map(),gem:new Map()},explicitRecovery=new Map();
  for(const channel of source.channels){
   if('hitProbability'in channel||'quantity'in channel)throw Error('Associations must not contain independent probability policy');
   for(const entry of channel.entries){
    if('qualityWeights'in entry)throw Error('Associations must not contain independent quality policy');
    const m=materials[entry.materialId];if(!m||m.storyOnly||!m.sources.includes(nodeId)||!Number.isFinite(entry.weight)||entry.weight<=0)throw Error('Invalid material eligibility '+key+' '+entry.materialId);
    const gem=m.kind==='宝石'&&m.uniqueHeld||m.id.includes('infinity_gem'),category=gem?'gem':m.category==='特殊'?'special':'regular';
    const target=channel.channel==='recovery'?explicitRecovery:by[category];
    if(channel.channel==='recovery'&&!m.functionalTags?.includes('recoveryBase'))throw Error('Invalid recovery material '+m.id);
    if(!target.has(m.id))target.set(m.id,entry.weight);
   }
  }
  for(const [id,weight]of by.regular)if(materials[id].functionalTags?.includes('recoveryBase'))by.recovery.set(id,weight);
  if(explicitRecovery.size)by.recovery=explicitRecovery;
  const quality=materialQualityWeights(area,kind),channels=Object.entries(by).map(([channel,entries])=>{
   const sum=[...entries.values()].reduce((a,b)=>a+b,0);return {channel,id:channel,hitProbability:entries.size?materialChannelProbability(channel,area,kind,rank):0,quantity:1,entries:[...entries].map(([materialId,weight])=>{const m=materials[materialId],fixed=channel==='gem'||m.qualityRange?.length===1&&m.qualityRange[0]===3;return {materialId,weight:weight/sum,qualityWeights:fixed?[0,0,0,1]:[...quality]};})};
  });out[key]={monsterId,nodeId,channels};
 }return out;
}
