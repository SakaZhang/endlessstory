import {idleActionPreview,idleActionQueueHint} from './idle-action-ui.js';
import {renderPersonalArcRecords,renderPersonalRewards,personalSceneCallback} from './personal-story-ui.js';
import {renderStoryDialogue,renderKnownStoryEvidence} from './story-cast-ui.js';
import {storyCastDisplayLabel} from './story-cast-registry.js';
import {chikFamilyDisplayText} from './chik-family-registry.js';
import {renderChikFamilyCast} from './chik-family-ui.js';
import {STORY_WAR_ID,STORY_WAR_DECLARATIONS} from './story-war-bridge.js';
import {storyEventView,canStartStoryScenario,canStartStoryFieldEncounter,warWithdrawalAvailable,storyQuestToolAvailable} from './story-event-controller.js';
import {AREAS} from './location-schema.js';
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const button=(action,id,text,disabled=false,extra='')=>`<button type="button" data-story-action="${action}" data-story-scene="${esc(id)}" ${disabled?'disabled':''} ${extra}>${esc(text)}</button>`;
// Release scope, not story canon or a promise of an implemented ceasefire.
export const STORY_WAR_RELEASE_NOTICE='开战后敌对地区普通活动封锁；必需主线可通过登记入口继续。推进至界外入侵后，双方转向抵抗恶魔，全境封锁解除，但并不因此和解。';
const warNotice=id=>STORY_WAR_DECLARATIONS.includes(id)?`<aside class="storyWarBoundary" role="note"><p>${STORY_WAR_RELEASE_NOTICE}</p><p>只有继续完成并确认本段剧情才会记录宣战；可暂缓推进。</p><button type="button" data-view="world">暂不推进，继续探索</button></aside>`:'';
function storyTravelHint(s,d){
 const area=AREAS[d.siteId],unlocked=s.areaProgress?.[area?.race]?.unlocked??[1];
 if(area&&!unlocked.includes(area.number)){const frontier=Math.max(...unlocked.filter(n=>n<area.number),1),site=area.race+'.a'+String(frontier).padStart(2,'0');return '<p><small>此剧情地点尚未解锁。请先通关'+esc(AREAS[site]?.name??site)+'的普通副本，再逐区前进至'+esc(area.name)+'。可继续普通探索与整备，不会丢失主线记录。</small></p>';}
 return '<p><small>请通过地图前往上述地点；不自动传送。可继续探索与整备，不会丢失主线记录。</small></p>';
}
export function renderStoryEventBoard(s,{coordinateIdle=false}={}){
 const queueHint=idleActionQueueHint(s,coordinateIdle);s=idleActionPreview(s,coordinateIdle);
 const v=storyEventView(s);if(!v.valid)return '<section class="panel storyEventBoard"><h3>主线记录不可用</h3><p>剧情状态未通过验证；不会推进或发放奖励。</p></section>';
 let content='';const a=v.active;
 if(a){
  const blocked=!a.safe||!a.atLocation;
  content=`<h4>${esc(a.title)}</h4><p>${esc(storyCastDisplayLabel(a,chikFamilyDisplayText(a,a.npc)))} · ${esc(AREAS[a.siteId]?.name)} · 第${a.chapter}章</p><p>${esc(a.objective)}</p>`+warNotice(a.id)+renderChikFamilyCast(a,a.line);
  if(!a.atLocation)content+=a.entryAvailable?button('enter',a.id,'通过本场剧情入口前往')+'<p>仅本场剧情通行；普通刷怪入口仍封锁。</p>':storyTravelHint(s,a);
  if(a.personalDeferred)content+='<p role="status">入侵切断了旧粮路。先沿主线找到米芮、咔洛和豆布，护送他们到安全营地后，再继续家里的事。</p>';
  if(!a.safe)content+='<p>请先结束当前战斗、停止远征并完成休息，再继续对话。</p>';
  if(a.personal)content+='<p><strong>个人长线 · 可暂缓，不阻塞主线</strong></p>'+button('personal-pause',a.id,'保存这段进度，暂缓个人线',!a.safe||!!s.activeEncounter?.storyScenario)+renderPersonalArcRecords(s,a.arcId)+(personalSceneCallback(s,a)?'<p>'+esc(personalSceneCallback(s,a))+'</p>':'');
  if(a.line!==null){const line=a.personalLate?(a.cursor===0?a.lateIntro:'眼前的修护和交接还在等人处理。先问清大家如今需要什么。'):a.line;content+=renderStoryDialogue(a,line,chikFamilyDisplayText(a,line))+button('next',a.id,'继续对话',blocked,`data-story-cursor="${a.cursor}"`);}
  else if(a.choiceId===null){content+='<div class="storyChoices">'+a.choices.map(c=>button('choice',a.id,(STORY_WAR_DECLARATIONS.includes(a.id)?'继续战争剧情 · ':'')+c.label,blocked,`data-story-choice="${esc(c.id)}"`)).join('')+'</div>';}
  else if(a.personal&&a.personalStep<a.personalActions.length){
   const step=a.personalActions[a.personalStep];content+='<section class="personalActionObjective" aria-label="个人线行动目标"><h4>行动 '+(a.personalStep+1)+' / '+a.personalActions.length+'</h4><p>'+esc(step.prompt)+'</p>'+step.options.map(o=>button('personal-step',a.id,o.label,blocked,`data-story-step="${a.personalStep}" data-story-option="${esc(o.id)}"`)).join('')+'</section>';
   for(const done of a.personalActions.slice(0,a.personalStep))content+='<p>✓ '+esc(done.result)+'</p>';
  }else if(a.encounter&&a.needsEncounter!==false&&!a.receipt){
   const scenario=a.encounter.kind==='scenario';content+='<p>尚未完成：'+esc(a.objective)+'</p>';
   content+=scenario?button('scenario',a.id,a.questTool?'进入封印核心战':'进入剧情遭遇',!canStartStoryScenario(s,a.encounter.scenarioId),`data-story-scenario="${esc(a.encounter.scenarioId)}"`):button('encounter',a.id,a.personal?'实地清除当前路线的野外威胁':'进入当地野外，清除阻碍',!canStartStoryFieldEncounter(s,a.encounter.nodeId),`data-story-node="${esc(a.encounter.nodeId)}"`);
   if(scenario)content+='<p><small>剧情遭遇无金币、经验或掉落。按现场目标战斗；失败可从本层安全点重试，已经完成的层次不会重打。</small></p>';
  }else{
   const selected=a.choices.find(c=>c.id===a.choiceId);if(a.receipt)content+='<p>遭遇结果已保存；继续处理现场。</p>';
   content+=button('finish',a.id,STORY_WAR_DECLARATIONS.includes(a.id)?'确认推进战争剧情':a.grant==='ashen-primal-core'?'收好升级核心并离开':a.id.startsWith('C06.RR01.')?'确认学习归途之环图样':a.personal?'确认完成当前交接':selected?.label??'继续处理现场',!a.ready);
   if(a.grant==='ashen-primal-core')content+='<p><small>核心装备背包需有空位。领取、装备与剧情完成一次保存；空间不足不会前进或丢弃原核心。</small></p>';
  }
 }else if(v.available.length){content=v.available.map(d=>`<article class="storySceneOffer"><h4>${esc(d.title)}${d.personal?' · 个人长线':d.optional?' · 可选':''}</h4><p>${esc(storyCastDisplayLabel(d,chikFamilyDisplayText(d,d.npc)))} · ${esc(AREAS[d.siteId]?.name)} · 第${d.chapter}章</p><p>${esc(d.objective)}</p>${warNotice(d.id)}${renderChikFamilyCast(d)}${button('begin',d.id,d.personal?(s.personalStoryProgress?.paused?.[d.id]?'继续已保存的个人线':'开始个人线 · '+d.title):'与'+storyCastDisplayLabel(d,chikFamilyDisplayText(d,d.npc))+'交谈',!d.available)}${d.entryAvailable?button('enter',d.id,'通过本场剧情入口前往')+'<p><small>仅本场剧情通行；普通刷怪入口仍封锁。</small></p>':!d.atLocation?storyTravelHint(s,d):''}</article>`).join('');}
 else content=s.story?.flags.includes('EPILOGUE_COMPLETE')?'<p>主线与尾声已完成。门户已关闭，残留敌人与已开放支线仍可继续。五人保留联络，各族并未因此和解。</p>':v.chapter8Complete?'<p>界外入侵已经开始，双方转向抵抗恶魔。全境战争封锁已解除，但门户仍在运转。请继续返回神庙核实四处支撑，再与同伴会合。</p>':v.warOpeningComplete?'<p>前线任务已记录，请继续可用的救援与追踪场景。</p>':v.complete?'<p>前六章与归途之环图样已完成。</p>':'<p>当前没有可开始的主线场景。</p>';
 if(s.story?.flags.includes('EPILOGUE_COMPLETE')&&v.available.length)content='<p role="status">主线与尾声已完成。可继续同一存档探索或再访其他四位主角；当前地图与随机战争门禁仍生效。</p>'+content;
 if(s.diplomacy?.wars?.some(w=>w.id===STORY_WAR_ID&&w.status==='active'))content+='<p role="status">精灵与烬裔的战事仍在持续。参战主角的敌境普通入口已封锁；本族、非敌对地区与已登记的剧情入口不受此封锁。继续主线至界外入侵后解除本次全境封锁。</p>';
 if(warWithdrawalAvailable(s))content+=button('retreat','','撤回本族起始营地',false,`data-story-return-site="${esc(s.race+'.a01')}"`)+'<p><small>撤回已解锁的本族营地；不额外休息、不恢复生命、不丢失战利品，当前剧情记录保留。</small></p>';
 return `<section class="panel storyEventBoard" aria-label="主线人物与事件"><h3>主线与个人长线</h3>${queueHint}${content}${renderPersonalRewards(s)}</section>`;
}
export function storyActionFromDataset(data){
 if(!data||typeof data.storyAction!=='string')return null;
 if(data.storyAction==='retreat'&&typeof data.storyReturnSite==='string')return {type:'retreat',returnSiteId:data.storyReturnSite};
 if(typeof data.storyScene!=='string')return null;
 if(data.storyAction==='use-tool'&&typeof data.storyEncounter==='string'&&typeof data.storyTarget==='string')return {type:'use-tool',sceneId:data.storyScene,encounterId:data.storyEncounter,targetId:data.storyTarget};
 if(data.storyAction==='next'&&/^\d+$/.test(data.storyCursor??''))return {type:'next',sceneId:data.storyScene,cursor:Number(data.storyCursor)};
 if(data.storyAction==='personal-step'&&/^\d+$/.test(data.storyStep??'')&&typeof data.storyOption==='string')return {type:'personal-step',sceneId:data.storyScene,step:Number(data.storyStep),optionId:data.storyOption};
 if(['begin','finish','enter','personal-pause'].includes(data.storyAction))return {type:data.storyAction,sceneId:data.storyScene};
 if(data.storyAction==='choice'&&typeof data.storyChoice==='string')return {type:'choice',sceneId:data.storyScene,choiceId:data.storyChoice};
 if(data.storyAction==='scenario'&&typeof data.storyScenario==='string')return {type:'scenario',sceneId:data.storyScene,scenarioId:data.storyScenario};
 if(data.storyAction==='encounter'&&typeof data.storyNode==='string')return {type:'encounter',sceneId:data.storyScene,nodeId:data.storyNode};
 return null;
}
export function renderStoryKnowledge(s){const v=storyEventView(s);if(!v.valid||!v.knowledge.length)return '';return '<section class="panel"><h3>我的见闻</h3>'+ (s.race==='elf'&&s.story?.flags.includes('E_WEDGE_AVAILABLE')?'<p><strong>任务道具 · 旧制楔钉</strong> · '+(storyQuestToolAvailable(s,'old-wedge')?'持有1件 · 不可出售或丢弃；解封核心时消耗':'已在解除封印核心时消耗')+'</p>':'')+v.knowledge.map(k=>`<p><strong>${{seen:'见到',heard:'听闻',confirmed:'已证实'}[k.mode]}</strong> · ${esc(k.id==='C01.E01.elf.k0'?'已学习旧制楔钉的用法；道具受任务保护，只在解除封印核心时消耗。':k.text)}</p>`).join('')+renderKnownStoryEvidence(s)+'</section>';}
