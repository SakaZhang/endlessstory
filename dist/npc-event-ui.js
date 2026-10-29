import {RACIAL_NPC_BY_ID} from './racial-npc-event-content.js';
import {renderNpcPortrait} from './npc-portraits.js';
import {renderChikFamilyEventBoard} from './chik-family-event-ui.js';
import {NPC_EVENTS,npcEventDefinition,npcEventObjectiveProgress,npcInvestigationAccess,npcEventAccess,npcEventReady,npcClaimKey,hasStoryFlag,npcEventCosts} from './npc-events.js';
import {MATERIALS,RARITY,POTIONS,CONSUMABLES} from './engine.js';
import {MONSTER_CATALOG} from './monster-codex-schema.js';
import {AREAS,INSTANCES} from './location-schema.js';
import {territoryAccess} from './war-diplomacy.js';
const esc=t=>String(t??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const areaName=id=>AREAS[id]?.name??id;
const nodeName=id=>INSTANCES[id]?.name??id;
const pointArea=point=>point.areaId??INSTANCES[point.nodeId]?.areaId;
const button=(action,id,label,disabled=false,extra='')=>`<button type="button" data-npc-action="${action}" data-npc-event="${esc(id)}"${disabled?' disabled':''}${extra}>${esc(label)}</button>`;
const mapButton=(areaId,label='查看地点')=>AREAS[areaId]?`<button type="button" data-npc-map-area="${esc(areaId)}">${esc(label)} · ${esc(areaName(areaId))}</button>`:'';
const materialName=key=>{const [id,q]=key.split('|');return `${RARITY[Number(q)]??'指定品质'} ${MATERIALS[id]?.name??id}`;};
const materialsText=rows=>rows.map(row=>`${materialName(row.key)} ×${row.quantity}`).join('、');
const rewardText=rows=>rows.map(row=>{const [id,q]=String(row.key??'').split('|');return row.kind==='material'?`${materialName(row.key)} ×${row.quantity}`:row.kind==='potion'?`${RARITY[Number(q)]??''} ${POTIONS[id]?.name??id} ×${row.quantity}`:row.kind==='item'?`${CONSUMABLES[id]?.name??id} ×${row.quantity}`:row.kind==='gold'?`金币 ×${row.quantity??row.amount}`:`${row.name??id??'物品'} ×${row.quantity??1}`;}).join('、');
const objectiveNodes=o=>[...new Set(o.nodeIds??o.sourceNodeIds??(o.materials??[]).flatMap(row=>row.sourceNodeIds??[]))];
const taskAreas=o=>[...new Set(o.kind==='investigate'?(o.checkpoints??[]).map(pointArea):objectiveNodes(o).map(id=>INSTANCES[id]?.areaId))].filter(Boolean);
function locationBlocker(s,areaId){
 const area=AREAS[areaId];if(!area)return '目标地点尚未开放';
 const access=territoryAccess(s,area.race);if(!access.allowed)return access.reason;
 if(!(s.areaProgress?.[area.race]?.unlocked??[1]).includes(area.number))return '目标区域尚未开放';
 if(s.siteId!==areaId)return '当前所在地：'+areaName(s.siteId)+'；需前往'+area.name;
 return '';
}
function objectiveRequirements(s,def,{active=false,compact=false}={}){
 const p=npcEventObjectiveProgress(s,def.id),o=def.objective;
 if(!p.modern)return '';
 let body='';
 if(o.kind==='kill'){
  const names=(o.monsterIds??[]).map(id=>MONSTER_CATALOG[id]?.name??id).join('、');
  body=`<p><strong>击杀目标：</strong>${esc(names||o.targetName||'指定怪物')} · ${active?`${p.count} / ${p.target}`:`${p.target} 只`}</p><p>目标地点：${esc(objectiveNodes(o).map(nodeName).join('、'))}</p><p class="subtleText">接取后击败目标怪物，真实胜利结算后计数；历史战绩、召唤物和预览不计。</p>`;
 }else if(o.kind==='collect'){
  body=`<p><strong>收集并交付：</strong></p><ul>${p.materials.map(row=>`<li>${esc(materialName(row.key))} · ${active?`${row.owned} / ${row.quantity}`:`${row.quantity} 份`}${active&&row.owned>=row.quantity?' · 已备齐':''}</li>`).join('')}</ul>${objectiveNodes(o).length?`<p>材料来源：${esc(objectiveNodes(o).map(nodeName).join('、'))}</p>`:''}<p class="subtleText">只交付上述精确品质；更高品质不会替代。接取不扣料，成功交付时才消耗。</p>`;
 }else if(o.kind==='investigate'){
  body=`<p><strong>实地调查：</strong>${active?`${p.count} / ${p.target}`:`${p.target} 处证据`}</p><ul>${p.checkpoints.map(point=>`<li>${esc(point.label??point.name??point.id)} · ${esc(areaName(pointArea(point)))}${active?point.complete?' · 已调查':' · 未调查':''}${active&&point.complete?`<p class="npcEvidence">${esc(point.evidence??point.result??'证据已记录')}</p>`:''}</li>`).join('')}</ul><p class="subtleText">旅行抵达后，在区域地图下方的“实地调查点”逐处调查；仅查看地图不会推进。</p>`;
 }
 const blocked=[...new Set(taskAreas(o).map(id=>locationBlocker(s,id)).filter(Boolean))];
 return `<section class="npcTaskObjective" aria-label="委托目标">${body}${!compact&&taskAreas(o).length?`<div class="npcTaskMapLinks">${taskAreas(o).map(id=>mapButton(id)).join('')}</div>`:''}${active&&!p.complete&&blocked.length?`<p class="npcTaskBlocker">${esc(blocked.join('；'))}</p>`:''}</section>`;
}
function taskStatus(s,def,row,done=false){
 if(done||row?.status==='resolved')return '已交付 · 委托完成';
 if(row?.status!=='active')return '尚未接取';
 const p=npcEventObjectiveProgress(s,def.id);
 return p.complete?'目标已完成 · 待交付':'进行中';
}
function taskReward(def){return `<p class="npcTaskReward"><strong>完成报酬：</strong>${esc(def.rewards?.length?rewardText(def.rewards):'无物资报酬 · 记录这段地方见闻')}${def.repeatable?' · 可重复，交付后冷却5分钟':' · 一次性委托'}</p>`;}
function renderModernCard(s,def,{now=Date.now(),journal=false}={}){
 const row=s.npcEvents?.entries?.[def.id],npc=RACIAL_NPC_BY_ID[def.npcId],active=row?.status==='active',done=row?.status==='resolved'||s.taskRewardClaims?.includes(npcClaimKey(s,def.id)),access=npcEventAccess(s,def.id),p=npcEventObjectiveProgress(s,def.id),cooldown=done&&def.repeatable?Math.max(0,Math.ceil(((row?.readyAt??0)-now)/1000)):0;
 const description=def.taskDescription??def.description,dialogue=done?(def.taskCompletion??def.completion):(def.taskDialogue??def.dialogue);
 let actions='';
 if(active)actions=`${button('claim',def.id,'交付委托'+(def.rewards?.length?'并领取报酬':''),!npcEventReady(s,def.id))}${mapButton(def.areaId,'查看交付地点')}`;
 else if(!done||def.repeatable&&!cooldown)actions=button('accept',def.id,done?'再次接取委托':'接取委托',!access.allowed);
 return `<article class="npcEventCard npcTaskCard" data-npc-event-card="${esc(def.id)}" data-task-kind="${esc(p.kind)}"><header class="npcEventIdentity">${journal?'':renderNpcPortrait(def.npcId)}<div><strong>${esc(def.npcName??def.npcId)}</strong>${npc?`<small>${esc(npc.role)}</small>`:''}<h3>${esc(def.title)}</h3></div><span class="npcTaskType">${esc({kill:'击杀',collect:'收集',investigate:'调查'}[p.kind])}</span></header><p class="npcTaskStatus" role="status">${esc(taskStatus(s,def,row,done))}${cooldown?' · '+cooldown+' 秒后可再次接取':''}</p>${journal?'':`<p>${esc(description)}</p>${(dialogue??[]).map(t=>`<p class="npcDialogue">${esc(t)}</p>`).join('')}`}${!done||def.repeatable?objectiveRequirements(s,def,{active}):''}${taskReward(def)}<p class="npcTaskReturn">交付给 ${esc(def.npcName??def.npcId)} · ${esc(areaName(def.areaId))}</p>${active&&p.complete?'<p class="subtleText">目标达成不等于领取；请亲自返回委托人处交付。行囊满时保留待交付状态。</p>':''}<div class="npcEventActions">${actions}</div>${!access.allowed&&!done?`<p class="npcTaskBlocker">${esc(access.reason)}</p>`:''}</article>`;
}
function renderLegacyCard(s,def,{now=Date.now(),journal=false}={}){
 const row=s.npcEvents?.entries?.[def.id],claimed=s.taskRewardClaims?.includes(npcClaimKey(s,def.id)),access=npcEventAccess(s,def.id),done=row?.status==='resolved'||claimed,declined=row?.status==='declined',cooldown=done&&def.repeatable?Math.max(0,Math.ceil(((row?.readyAt??0)-now)/1000)):0,ready=npcEventReady(s,def.id),costs=npcEventCosts(def,s),npc=RACIAL_NPC_BY_ID[def.npcId];
 const active=row?.status==='active',choice=def.choices?.find(c=>c.id===row?.choiceId),dialogue=done&&choice?[choice.dialogue,choice.outcome]:done?def.completion:def.dialogue;
 // Completed pre-update cycles keep their old outcome, but never conceal the
 // new objective contract that the next explicit acceptance will create.
 const modernRenewal=done&&def.repeatable&&def.objectiveVersion===2;
 let renewal='';
 if(modernRenewal){const preview={...s,npcEvents:{...s.npcEvents,entries:{...s.npcEvents.entries}}};delete preview.npcEvents.entries[def.id];const next=npcEventDefinition(preview,def.id);renewal=`<section class="npcTaskRenewal" aria-label="下一轮委托"><h4>下一轮委托 · 接取前查看目标</h4><p>${esc(next.taskDescription??next.description)}</p>${objectiveRequirements(preview,next)}${taskReward(next)}${button('accept',def.id,'接取下一轮委托',!access.allowed||!!cooldown)}${cooldown?`<p>还需 ${cooldown} 秒</p>`:''}${!access.allowed?`<p class="npcTaskBlocker">${esc(access.reason)}</p>`:''}</section>`;}
 return `<article class="npcEventCard" data-npc-event-card="${esc(def.id)}"><header class="npcEventIdentity">${journal?'':renderNpcPortrait(def.npcId)}<div><strong>${esc(def.npcName??def.npcId)}</strong>${npc?`<small>${esc(npc.role)}</small>`:''}<h3>${esc(def.title)}</h3></div></header>${def.objectiveVersion===2?'<p class="subtleText">历史委托 · 保留接取时的约定、回应与报酬</p>':''}<p>${esc(def.description)}</p>${(dialogue??[]).map(t=>`<p class="npcDialogue">${esc(t)}</p>`).join('')}${active&&def.choices?.length?`<div class="npcEventChoices">${def.choices.map(c=>button('choose',def.id,c.label,!access.allowed,` data-npc-choice="${esc(c.id)}" aria-pressed="${row.choiceId===c.id}"`)).join('')}</div>${choice?`<p>${esc(choice.dialogue)}</p>`:''}`:''}${active&&['victory','exploration'].includes(def.objective.kind)?`<p class="npcObjective">${esc(def.actionLabel??'完成委托地点的战斗')} · ${row.count} / ${def.objective.count}</p>`:''}${costs.length?`<p class="subtleText">交付：${esc(materialsText(costs))}；不会自动扣除更高品质。</p>`:''}${done?`<p role="status">已办妥${cooldown?' · 还需 '+cooldown+' 秒':''}</p>`:declined?'<p>你选择了继续赶路。</p>':''}<div class="npcEventActions">${!modernRenewal&&!declined&&(!done||def.repeatable&&!cooldown)?active?`${button('claim',def.id,'回到'+(def.npcName??'对方')+'身边',!ready)}${button('decline',def.id,def.decline?.label??'继续赶路',!access.allowed)}`:`${button('accept',def.id,done?'再问问近况':'停下来帮忙',!access.allowed)}${button('decline',def.id,def.decline?.label??'继续赶路',!access.allowed)}`:''}${journal?mapButton(def.areaId,'查看交付地点'):''}</div>${renewal}${!access.allowed&&!done&&!declined?`<p class="subtleText">${esc(access.reason)}</p>`:''}</article>`;
}
export function renderNpcEventBoard(s,{race,areaId,now=Date.now()}={}){
 const family=renderChikFamilyEventBoard(s,{race,areaId});
 const defs=Object.values(NPC_EVENTS).filter(d=>d.category!=='chik-family'&&d.race===race&&d.areaId===areaId&&(!d.requiresStoryFlag||hasStoryFlag(s,d.requiresStoryFlag))).map(d=>npcEventDefinition(s,d.id));
 if(!defs.length)return family;
 return `<section class="npcEventBoard" aria-label="当地人物与委托"><h2>${esc(areaName(areaId)??'当地')} · 旅途中遇到的人</h2><div class="npcEventCards">${defs.map(def=>(def.modern?renderModernCard:renderLegacyCard)(s,def,{now})).join('')}</div></section>`+family;
}
// A global ledger, not a giver-local board: leaving an area never hides accepted work.
export function renderNpcTaskJournal(s,{now=Date.now()}={}){
 const entries=Object.entries(s.npcEvents?.entries??{}).filter(([id])=>NPC_EVENTS[id]?.category!=='chik-family');
 const defs=entries.filter(([,row])=>row.status==='active').map(([id])=>npcEventDefinition(s,id));
 const completed=entries.filter(([,row])=>row.status==='resolved').map(([id,row])=>{const def=npcEventDefinition(s,id),choice=def.choices?.find(c=>c.id===row.choiceId),lines=choice?[choice.dialogue,choice.outcome]:(def.modern?def.taskCompletion??def.completion:def.completion)??[],p=npcEventObjectiveProgress(s,id);return `<article class="npcTaskHistory" data-npc-task-history="${esc(id)}"><h3>${esc(def.title)} · ${esc(def.npcName)}</h3>${!def.modern&&def.objectiveVersion===2?'<p class="subtleText">历史委托 · 保留接取时的约定、回应与报酬</p>':''}${lines.map(line=>`<p>${esc(line)}</p>`).join('')}${p.modern&&p.kind==='investigate'?`<ul>${p.checkpoints.filter(point=>point.complete).map(point=>`<li>${esc(point.label)}：${esc(point.evidence)}</li>`).join('')}</ul>`:''}${taskReward(def)}${mapButton(def.areaId,'查看委托人地点')}</article>`;});
 return `<section class="npcEventBoard npcTaskJournal" aria-label="已接委托"><h2>已接委托 · ${defs.length}</h2><p class="subtleText">目标进度随身记录。查看地点只打开地图；抵达、调查和交付都需亲自操作。</p>${defs.length?`<div class="npcEventCards">${defs.map(def=>(def.modern?renderModernCard:renderLegacyCard)(s,def,{now,journal:true})).join('')}</div>`:'<p>暂无进行中的地方委托。到当地人物身边查看目标与报酬，再决定是否接取。</p>'}${completed.length?`<details class="npcTaskHistoryList"><summary>已完成委托 · ${completed.length}</summary>${completed.join('')}</details>`:''}</section>`;
}
// Registered evidence points are area actions, deliberately separate from NPC dialogue.
export function renderNpcAreaObjectives(s,{areaId,now=Date.now()}={}){
 const rows=Object.entries(s.npcEvents?.entries??{}).filter(([,row])=>row.status==='active').map(([id])=>({def:npcEventDefinition(s,id),progress:npcEventObjectiveProgress(s,id)})).filter(({def,progress})=>progress.modern&&taskAreas(def.objective).includes(areaId));
 if(!rows.length)return '';
 const points=rows.flatMap(({def,progress})=>progress.checkpoints.filter(point=>pointArea(point)===areaId).map(point=>({def,point}))),other=rows.filter(({progress})=>progress.kind!=='investigate');
 return `<section class="npcAreaObjectives" aria-label="本地委托目标"><h2>${esc(areaName(areaId))} · 本地委托目标</h2>${s.siteId!==areaId?`<p class="npcTaskBlocker">地图预览 · 当前所在地：${esc(areaName(s.siteId))}。请点击地图的“旅行”抵达后再行动。</p>`:''}${other.map(({def,progress})=>`<article class="npcLocalGoal"><h3>${esc(def.title)} · ${esc(def.npcName)}</h3>${objectiveRequirements(s,def,{active:true,compact:true})}<p class="npcTaskStatus">${esc(progress.complete?'目标已完成 · 返回委托人交付':'进行中')}</p></article>`).join('')}${points.length?`<h3>实地调查点</h3><p class="subtleText">每处只记录一次；调查取得实物或现场证据，不需要选择答案。</p><div class="npcEvidencePoints">${points.map(({def,point})=>{const access=npcInvestigationAccess(s,def.id,point.id,now);return `<article class="npcEvidencePoint${point.complete?' isComplete':''}" data-npc-evidence-point="${esc(point.id)}"><h4>${esc(point.label??point.name??point.id)}</h4><p>${esc(def.title)} · ${esc(areaName(pointArea(point)))}${point.nodeId?' / '+esc(nodeName(point.nodeId)):''}</p>${point.description?`<p>${esc(point.description)}</p>`:''}${point.complete?`<p class="npcEvidence" role="status">已调查 · ${esc(point.evidence??point.result??'证据已记录')}</p>`:button('investigate',def.id,point.actionLabel??('调查 · '+(point.label??point.name??point.id)),!access.allowed,` data-npc-checkpoint="${esc(point.id)}"`)}${!point.complete&&!access.allowed?`<p class="npcTaskBlocker">${esc(access.reason)}</p>`:''}</article>`;}).join('')}</div>`:''}</section>`;
}
