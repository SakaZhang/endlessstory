import {PERSONAL_STORY_SCENES} from './personal-story-registry.js';
import {PERSONAL_ARC_REWARDS,PERSONAL_EVENT_REWARDS,personalArcRewardSlots,personalArcRewardStatus} from './personal-arc-rewards.js';
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const slotNames={weapon:'武器',gloves:'手套',helm:'头盔',armor:'护甲',boots:'靴子',ring:'戒指',amulet:'护符',offhand:'副手',core:'核心'};
export function renderPersonalArcRecords(s,arcId){
 const completed=(s.story?.completedScenes??[]).map(id=>PERSONAL_STORY_SCENES[id]).filter(d=>d&&(!arcId||d.arcId===arcId));
 if(!completed.length)return '';
 return '<details class="personalArcRecord"><summary>个人线已保存的选择 · '+completed.length+' 段</summary>'+completed.map(d=>{const c=d.choices.find(c=>c.id===s.story.choices[d.id]),late=s.personalStoryProgress?.lateIds.includes(d.id);return '<p><b>'+esc(d.title)+'</b> · '+(late?'事后接续：':'')+esc(c.label)+'<br>'+esc(late?(c.lateActions??c.actions).map(a=>a.result).join(' '):c.outcome)+'</p>';}).join('')+'</details>';
}
export function renderPersonalRewards(s){
 const arc=Object.values(PERSONAL_ARC_REWARDS).find(d=>d.race===s.race);if(!arc)return '';
 const done=s.story?.completedScenes??[],claims=s.taskRewardClaims??[];
 const events=Object.values(PERSONAL_EVENT_REWARDS).filter(d=>d.race===s.race&&done.includes(d.id)&&!claims.includes(d.claimId));
 const status=personalArcRewardStatus(s,arc.id);
 let html=events.map(d=>`<p>${esc(PERSONAL_STORY_SCENES[d.id]?.title)} · ${d.tier==='stage'?'阶段补给：重铸印记 × 1':'补给：普通治疗药剂 × 2'} <button data-personal-event-reward="${esc(d.id)}">领取已挣得补给</button></p>`).join('');
 if(done.includes(arc.finalSceneId)){
  if(claims.includes(arc.claimId))html+='<p>整条个人线奖励已领取 · 不会重复发放。</p>';
  else if(status.slot)html+=`<p>已固定 ${esc(slotNames[status.slot]??status.slot)} · 等级基准 ${status.baseLevel}，重试不会改部位或重掷。</p><button data-personal-arc-reward="${esc(arc.id)}" data-personal-reward-slot="${esc(status.slot)}">领取已选定的至臻装备</button>`;
  else html+=`<p>这段旅程的谢礼已经备好。选择部位后，将获得一件与你等级相近（±2级）的至臻散件。可以晚些领取，确认后部位与属性不再改变。</p><div class="personalRewardSlots">${personalArcRewardSlots(s).map(slot=>`<button data-personal-arc-reward="${esc(arc.id)}" data-personal-reward-slot="${esc(slot)}">确认领取 · ${esc(slotNames[slot]??slot)}</button>`).join('')}</div>`;
 }
 return html?'<section class="personalRewardBoard" aria-label="个人线待领取奖励"><h4>个人线补给与谢礼</h4>'+html+'</section>':'';
}

export function personalSceneCallback(s,d){
 const choices=s.story?.choices??{};
 if(d.id==='personal.dwarf.coup.07')return choices['personal.dwarf.coup.06']==='crew-present'?'杜铎亲自发问：下面那班，也是人。布洛克在旁补充证据来源。':'布洛克代读矿班确认的问题：下面那班，也是人。杜铎仍在安置处；答复必须逐项带回。';
 if(d.id==='personal.dwarf.coup.06')return choices['personal.dwarf.coup.05']==='supplies-first'?'记录者：循着矿仓副页上的索引，对应的原件已经找齐了。':'记录者：这份支出记录，正好能接上我们收拢的原账。';
 if(d.id==='personal.dwarf.coup.04')return choices['personal.dwarf.coup.01']==='crew-voiced'?'矿班自己拿出点名记录，主动核问还有谁未交接。':'杜铎先向布洛克报数，请他和矿班一起核实。';
 if(d.id==='personal.goblin.family.04')return '团聚之后，奇克还要和家人商量往后的生活。';
 return '';
}
