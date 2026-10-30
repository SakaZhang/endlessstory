// Read-only receipts: never roll, grant, or replay rewards. Optional for old saves.
const categories=['equipment','materials','items'];
const zero=()=>Object.fromEntries(categories.map(k=>[k,0]));
const total=o=>Object.values(o??{}).reduce((a,b)=>a+b,0);
export function dungeonLootSnapshot(s){return {equipment:s.inventory.length,materials:total(s.materialStacks),items:total(s.potionStacks)+(s.consumables?.memoryFruit??0)+(s.consumables?.reforgeToken??0),gold:s.gold,pending:{equipment:s.rareRewardProgress?.pendingSets.length??0,materials:0,items:s.rareRewardProgress?.pendingFruit??0}};}
export function validDungeonLootReceipts(s){
 const h=s.dungeonLootReceipts;if(h===undefined)return true;
 const counts=o=>o&&Object.keys(o).length===3&&categories.every(k=>Number.isSafeInteger(o[k])&&o[k]>=0&&o[k]<=1e12);
 return h?.version===1&&Array.isArray(h.records)&&h.records.length<=30&&h.records.every(r=>r&&typeof r.runId==='string'&&r.runId.length<=160&&typeof r.nodeId==='string'&&r.nodeId.length<=100&&[1,2,3].includes(r.stage)&&Number.isSafeInteger(r.at)&&r.at>=0&&Number.isFinite(r.gold)&&r.gold>=0&&r.gold<=1e12&&Number.isFinite(r.xp)&&r.xp>=0&&r.xp<=1e12&&counts(r.received)&&counts(r.discarded)&&counts(r.overflow)&&(r.pending===undefined||counts(r.pending)));
}
export function recordDungeonLootReceipt(s,e,before,now){
 if(e.kind!=='dungeon'||e.storyScenario||!e.rewarded||!e.win)return;
 const h=s.dungeonLootReceipts??={version:1,records:[]};
 if(h.records.some(r=>r.runId===e.runId&&r.stage===e.dungeonStage))return;
 const after=dungeonLootSnapshot(s),received=Object.fromEntries(categories.map(k=>[k,Math.max(0,after[k]-before[k])])),pending=Object.fromEntries(categories.map(k=>[k,Math.max(0,after.pending[k]-(before.pending?.[k]??0))]));
 h.records.unshift({runId:e.runId,nodeId:e.instanceId,stage:e.dungeonStage,at:now,gold:after.gold-before.gold,xp:e.acceptedXp??0,received,pending,discarded:{...e.lootSummary.discarded},overflow:{...e.lootSummary.overflow}});h.records=h.records.slice(0,30);
}
export function dungeonLootGroups(s){
 const groups=[];for(const row of s.dungeonLootReceipts?.records??[]){let g=groups.find(g=>g.runId===row.runId);if(!g){g={runId:row.runId,nodeId:row.nodeId,stages:[],received:zero(),discarded:zero(),overflow:zero(),pending:zero(),gold:0,xp:0};groups.push(g);}g.stages.push(row.stage);g.gold+=row.gold;g.xp+=row.xp;for(const action of ['received','discarded','overflow','pending'])for(const k of categories)g[action][k]+=row[action]?.[k]??0;}
 return groups.map(g=>({...g,complete:g.stages.length===3&&[1,2,3].every(n=>g.stages.includes(n))}));
}
export function dungeonLootText(g){
 const counts=o=>'装备 '+o.equipment+' / 材料 '+o.materials+' / 物品 '+o.items;
 const parts=['已入包：'+counts(g.received)];
 if(total(g.discarded))parts.push('品质过滤丢弃：'+counts(g.discarded));
 if(total(g.overflow))parts.push('背包已满未收取：'+counts(g.overflow));
 if(total(g.pending))parts.push('结算时待领取（已保留）：'+counts(g.pending));
 if(!total(g.received)&&!total(g.discarded)&&!total(g.overflow)&&!total(g.pending))parts.push('本记录范围内随机未掉落物品');
 parts.push('金币 +'+g.gold+' / 经验 +'+g.xp);return parts.join('；');
}
