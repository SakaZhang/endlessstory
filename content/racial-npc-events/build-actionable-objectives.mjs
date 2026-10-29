// Keeps the shipped base event definitions immutable. Only new acceptances use this overlay.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {RACIAL_NPC_EVENTS,RACIAL_NPC_BY_ID} from '../../dist/racial-npc-event-content.js';
import {WORLD_MATERIALS,worldInventoryKey,getWorldMaterialPool} from '../../dist/world-materials.js';
import {WORLD_MONSTERS} from '../../dist/world-content.js';
import {AREAS,INSTANCES} from '../../dist/location-schema.js';
const dir=path.dirname(fileURLToPath(import.meta.url));
const source=JSON.parse(fs.readFileSync(path.join(dir,'actionable-objectives.json'),'utf8'));
const modern={};
const materialRow=(materialId,quantity=1)=>({kind:'material',materialId,key:worldInventoryKey(materialId)+'|0',quantity});
const collectedRow=(d,row)=>{
 const materialId=row.materialId,m=WORLD_MATERIALS[materialId];assert(m&&!m.storyOnly&&!m.uniqueHeld&&m.rarity==='常见',d.id+' renewable common input');
 const realSources=m.sources.filter(id=>['field','dungeon'].includes(INSTANCES[id]?.kind)&&AREAS[INSTANCES[id].areaId].number<=AREAS[d.areaId].number&&Object.values(WORLD_MONSTERS).filter(x=>x.nodes.includes(id)).some(x=>getWorldMaterialPool(x.id,id)?.channels.some(c=>c.hitProbability>0&&c.entries.some(v=>v.materialId===materialId&&v.weight>0&&v.qualityWeights[0]>0))));
 const nearestAreaNumber=Math.max(...realSources.map(id=>AREAS[INSTANCES[id].areaId].number));
 const sourceNodeIds=realSources.filter(id=>AREAS[INSTANCES[id].areaId].number===nearestAreaNumber);
 assert(sourceNodeIds.length,d.id+' existing obtainable renewable source');
 return {materialId,key:worldInventoryKey(materialId)+'|0',quantity:row.quantity,sourceNodeIds};
};
for(const d of RACIAL_NPC_EVENTS){
 const npc=RACIAL_NPC_BY_ID[d.npcId],i=source.investigations[d.id],k=source.kills[d.id],c=source.collections[d.id];
 let taskObjective,brief,completion,taskRewards=d.rewards.map(row=>({...row}));
 if(i){
  assert(i.points.length===2&&new Set(i.points.map(p=>p.id)).size===2,d.id+' distinct evidence');
  taskObjective={kind:'investigate',count:i.points.length,checkpoints:i.points.map(p=>({id:p.id,areaId:p.areaId,label:p.label,description:p.actionLabel,evidence:p.text,actionLabel:p.actionLabel}))};
  brief=i.brief;completion=i.completion;
 }else if(k){
  assert(k.monsterIds.every(id=>WORLD_MONSTERS[id]?.nodes.includes(d.areaId+'.field')),d.id+' real matching field monsters');
  taskObjective={kind:'kill',nodeIds:[d.areaId+'.field'],monsterIds:k.monsterIds,count:k.count,description:'在'+AREAS[d.areaId].name+'野外击杀'+k.monsterIds.map(id=>WORLD_MONSTERS[id].name).join('／')+'，合计'+k.count+'个。接取后开始计数。'};
  brief=k.brief;completion=k.completion;
  if(k.rewardMaterialId)taskRewards=[materialRow(k.rewardMaterialId)];
 }else if(c||d.objective.kind==='materials'){
  const costs=c?[{materialId:c.materialId,quantity:c.quantity}]:d.materials;
  const materials=costs.map(row=>collectedRow(d,row));
  taskObjective={kind:'collect',materials,sourceNodeIds:[...new Set(materials.flatMap(row=>row.sourceNodeIds))],ownedAllowed:true,description:'收集并交付'+materials.map(row=>`普通品质${WORLD_MATERIALS[row.materialId].name}×${row.quantity}`).join('、')+'。可交付已有的普通品质库存。'};
  brief=c?.brief??d.dialogue[0];completion=c?.completion??source.collectionCompletion[d.id];
  if(c)taskRewards=[materialRow(c.rewardMaterialId)];
 }else throw Error('Unmapped ordinary event: '+d.id);
 const supplement=source.oneTimeRewardSupplements?.[d.id];
 if(supplement){
  assert(!d.repeatable&&d.rewards.length===0,d.id+' supplement only changes unpaid modern one-off');
  assert(supplement.sourceNodeIds.length&&supplement.sourceNodeIds.every(nodeId=>WORLD_MATERIALS[supplement.materialId].sources.includes(nodeId)&&Object.values(WORLD_MONSTERS).filter(x=>x.nodes.includes(nodeId)).some(x=>getWorldMaterialPool(x.id,nodeId)?.channels.some(c=>c.hitProbability>0&&c.entries.some(v=>v.materialId===supplement.materialId&&v.weight>0&&v.qualityWeights[0]>0)))),d.id+' supplemented reward has actual nonzero Q0 source');
  taskRewards=[materialRow(supplement.materialId)];completion+=' '+supplement.completion;
 }
 assert(completion,d.id+' explicit authored completion');
 const prose=i??k??c??source.collectionScenes[d.id];
 modern[d.id]={objectiveVersion:2,taskObjective,taskDescription:prose.scene,taskDialogue:[npc.name+'：'+brief],taskCompletion:[completion,prose.closing],taskRewards:taskRewards.map(row=>({...row,key:worldInventoryKey(row.materialId??row.key.split('|')[0])+'|'+row.key.split('|')[1]}))};
}
assert.equal(Object.keys(modern).length,60);
assert.equal(Object.keys(source.oneTimeRewardSupplements).length,22);
assert(Object.values(modern).every(row=>row.taskRewards.length===1),'all60 modern tasks have a visible tangible reward');
for(const kind of ['kill','collect','investigate'])assert.equal(Object.values(modern).filter(d=>d.taskObjective.kind===kind).length,20);
for(const [id,row]of Object.entries(modern))for(const reward of row.taskRewards){const m=WORLD_MATERIALS[reward.materialId];assert(m&&!m.storyOnly&&!m.uniqueHeld&&m.rarity==='常见'&&reward.quantity===1&&reward.key.endsWith('|0'),id+' bounded existing common reward');}
const header='// Generated by content/racial-npc-events/build-actionable-objectives.mjs.\n// Base IDs, legacy choices, original objectives and historical rewards remain unchanged.\nconst freeze=o=>{if(o&&typeof o===\'object\'&&!Object.isFrozen(o)){Object.values(o).forEach(freeze);Object.freeze(o);}return o;};\n';
const js=header+'export const NPC_OBJECTIVE_CONTENT=freeze('+JSON.stringify(modern,null,2)+');\n';
const target=path.join(dir,'../../dist/npc-objective-content.js');
const md=['# NPC 实际目标转换清单','', '60 件普通地方委托：20 击杀、20 收集、20 调查；30 名 NPC 每人两件，类型各不相同。40 件一次性，20 件重复任务仍手动接取、5 分钟冷却。','', '基础 60 件定义完全保留：旧接取沿用旧目标、已选择回应、原奖励和已完成记录；未接取或已冷却后新接取使用本表。不重置、不重发、不回填历史击杀。','', '调查点是地点交互，不是答题选项；每件两处不同证据点，必须亲自到场调查。起始区调查的两点均在起始区，其余跨区调查只去本区及前一区，遵守实际解锁、战争与远征门禁。','', '|任务 ID|NPC / 任务|类型|实际目标|交付奖励|','|---|---|---|---|---|'];
for(const d of RACIAL_NPC_EVENTS){const x=modern[d.id],o=x.taskObjective;const objective=o.kind==='kill'?`${AREAS[d.areaId].name}野外：${o.monsterIds.map(id=>WORLD_MONSTERS[id].name).join('／')}，合计${o.count}名`:o.kind==='collect'?o.materials.map(row=>`${WORLD_MATERIALS[row.materialId].name} Q0 ×${row.quantity}（${row.sourceNodeIds.map(id=>INSTANCES[id].name).join('；')}）`).join('、'):o.checkpoints.map(p=>`${AREAS[p.areaId].name}·${p.label}`).join(' → ');md.push(`|${d.id}|${RACIAL_NPC_BY_ID[d.npcId].name} / ${d.title}|${({kill:'击杀',collect:'收集',investigate:'调查'})[o.kind]}|${objective}|${x.taskRewards.map(r=>WORLD_MATERIALS[r.materialId].name+' Q0 ×'+r.quantity).join('、')||'地方记录，无物品奖励'}|`);}
md.push('','## 经济与历史保护','','- 原 12 件材料任务的品类、数量、Q0 不变；20 件重复任务的奖励不变。原有接取、已完成记录与奖励逐件保持原约定。','- 收集来源逐个核对非零怪物掉落池，而不是只相信材料图鉴的地区名单。赛芙所需烛脂树胶在圣烛林缘没有实际掉落条目，来源提示使用前一区盐泉的野外／普通副本；不改既有掉落表。','- 新 8 件收集每件交 1 份现有本地常见 Q0 材料，得 1 份不同常见 Q0 材料；新 10 件击杀各清理 3 名现有普通敌人，给 1 份常见 Q0 材料，仅一次。','- 墨库修盾的一份旧铆铁来自他的修护存料；其既有野外来源仍为苔口坡地、碎铁旧道、地下货道，不改怪物掉落池。','- 20 件调查的新接取版本各奖励 1 份现有常见 Q0 材料；原「别把灯绑在腕上」「一小份留种」的新接取版本各获得 1 份不同的常见 Q0 材料。至此 60 件新委托均在接取前明示实物报酬；旧版已接或已完成的无奖励约定不补发、不重置。','- 新补的 22 份一次性报酬均逐项验证非零 Q0 野外／副本来源。纳铎所在银纹矿廊没有常见材料掉落，他以调查同时涉及的地下炉池存料——普通炉灰盐答谢；其他 21 份均有委托人本区真实来源。','- 不新增属性、金币、经验奖励、材料身份、怪物来源或每日配额。','', '## 保护范围','','5 件归途事件本来就要求真实胜利且没有二选一，继续保持独立：赫珀（dwarf.a05）旧铸模片；奥登（human.a04）磨损的银扣；伊萝（elf.a04）褪色的叶脉；滴索（goblin.a06）打结的铜丝；砾露（ashen.a06）沉默的晶片。其故事开放旗标、一次性 Q3 奖励、永久婉拒语义、已领取记录与永久配方账本均不得被此叠层替换。','', '奇克 6 件家人小事属于私人叙事情境，不列入普通委托；主线、个人篇章的关系与剧情选择不改成打怪或交物。');
const doc=path.join(dir,'actionable-objectives.md');
if(process.argv.includes('--check')){assert.equal(fs.readFileSync(target,'utf8'),js,'runtime overlay up to date');assert.equal(fs.readFileSync(doc,'utf8'),md.join('\n')+'\n','inventory up to date');console.log('NPC actionable content generated files are current.');}else{fs.writeFileSync(target,js);fs.writeFileSync(doc,md.join('\n')+'\n');console.log('Generated 60 actionable NPC objectives: 20 kill / 20 collect / 20 investigate.');}
