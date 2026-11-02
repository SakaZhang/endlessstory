import {CHIK_FAMILY_EVENTS} from './chik-family-events.js';
import {CHIK_FAMILY_REWARD_POLICY,CHIK_FAMILY_MILESTONE} from './chik-family-event-rewards.js';
import {CHIK_FAMILY_CHARACTERS} from './chik-family-registry.js';
import {renderChikFamilyPortrait} from './chik-family-ui.js';
import {npcEventAccess,npcEventReady,hasStoryFlag,validNpcEventState,completedFamilyEventCount,familyMilestoneAccess} from './npc-events.js';
import {POTIONS,CONSUMABLES,RARITY} from './engine.js';
const esc=t=>String(t??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const button=(action,id,text,disabled=false,extra='')=>`<button type="button" data-npc-action="${action}" data-npc-event="${esc(id)}"${disabled?' disabled':''}${extra}>${esc(text)}</button>`;
const rewardText=rows=>rows.map(r=>r.kind==='potion'?`${RARITY[Number(r.key.split('|')[1])]}${POTIONS[r.key.split('|')[0]].name} ×${r.quantity}`:`${CONSUMABLES[r.key].name} ×${r.quantity}`).join('、');
export function renderChikFamilyEventBoard(s,{race,areaId}={}){
 // These are personal home conversations, not public cross-POV errands or map previews.
 if(s.race!=='goblin'||race!=='goblin'||s.siteId!==areaId||!validNpcEventState(s))return '';
 const paused=hasStoryFlag(s,'INVASION_BEGAN');
 const defs=CHIK_FAMILY_EVENTS.filter(d=>d.areaId===areaId&&hasStoryFlag(s,d.requiresStoryFlag)&&d.conditions.requiredStorySceneIds.every(id=>s.story?.completedScenes?.includes(id)));
 if(!defs.length)return '';
 const count=completedFamilyEventCount(s),milestone=CHIK_FAMILY_MILESTONE,stageClaimed=s.taskRewardClaims?.includes(milestone.id),stageAccess=familyMilestoneAccess(s);
 return `<section class="npcEventBoard familyEventBoard" aria-label="奇克与家人"><h2>奇克与家人 · 一次性小事</h2><p class="subtleText">家人小事 ${count} / 6 · 不计入地方委托。</p>${!CHIK_FAMILY_REWARD_POLICY.approved?'<p role="status">奖励方案待确认，当前为事件预览，暂不开放接取与结算。</p>':''}${paused?'<p role="status">入侵迫使家人离开旧住处。先找到他们，再继续处理家里的事；此前的记录会保留。</p>':''}<div class="npcEventCards">${defs.map(d=>{
  const c=CHIK_FAMILY_CHARACTERS[d.npcId],row=s.npcEvents?.entries?.[d.id],done=row?.status==='resolved',active=row?.status==='active',choice=d.choices.find(x=>x.id===row?.choiceId),access=npcEventAccess(s,d.id);
  let body=done&&choice?`<p class="npcDialogue">${esc(choice.dialogue)}</p><p>${esc(choice.outcome)}</p><p>${esc(d.rewardContext)}</p><p role="status">已记录 · ${esc(choice.label)} · 已领取${esc(rewardText(d.rewards))}</p>`:paused?`${choice?`<p class="npcDialogue">已选择：${esc(choice.label)}</p>`:''}<p>${active?'这件小事尚未办完，已有选择保留。':'这件早期小事尚未开始。'}此阶段暂不开放，不会自动完成。</p>`:`<p>${esc(d.description)}</p>${d.dialogue.map(t=>`<p class="npcDialogue">${esc(t)}</p>`).join('')}`;
  if(!done)body+=`<p class="subtleText">完成补给：${esc(rewardText(d.rewards))} · 两种回应奖励相同 · 不消耗物品</p>`;
  if(!done&&!paused){
   body+=active?`<div class="npcEventChoices">${d.choices.map(x=>button('choose',d.id,x.label,!access.allowed,` data-npc-choice="${esc(x.id)}" aria-pressed="${row.choiceId===x.id}"`)).join('')}</div>${choice?`<p class="npcDialogue">${esc(choice.dialogue)}</p>`:'<p class="subtleText">先选择怎样回应；不会替你默认决定。</p>'}<div class="npcEventActions">${button('claim',d.id,'记住这件事，收好补给',!npcEventReady(s,d.id))}${button('decline',d.id,'晚些再聊',!access.allowed)}</div>`:`<div class="npcEventActions">${button('accept',d.id,'坐下来听'+c.name+'说',!access.allowed)}${button('decline',d.id,'晚些再聊',!access.allowed)}</div>`;
   if(!access.allowed)body+=`<p class="subtleText">${esc(access.reason)}</p>`;
  }
  return `<article class="npcEventCard familyEventCard" data-family-event-card="${esc(d.id)}"><header class="npcEventIdentity">${renderChikFamilyPortrait(c.id)}<div><strong>${esc(c.name)}</strong><small>${esc(c.role)}</small><h3>${esc(d.title)}</h3></div></header>${body}</article>`;
 }).join('')}</div><section class="familyMilestone" data-family-milestone="${esc(milestone.id)}"><h3>${esc(milestone.title)}</h3><p>六件小事完成后：${esc(rewardText(milestone.rewards))} · 仅领取一次</p>${stageClaimed?'<p role="status">6 / 6 · 已领取阶段补给；使用或丢弃后不会补发。</p>':count===6?`<p role="status">6 / 6 · 已备好的补给待领取</p><p>${esc(milestone.description)}</p><p class="subtleText">${esc(milestone.pendingDescription)}</p>${button('claim',milestone.id,'领取已备好的补给 · '+rewardText(milestone.rewards),!stageAccess.allowed)}${!stageAccess.allowed?`<p>${esc(stageAccess.reason)}</p>`:''}`:`<p class="subtleText">已完成 ${count} / 6。</p>`}</section></section>`;
}
