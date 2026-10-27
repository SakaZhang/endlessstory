import {PERSONAL_ARC_CONTENT} from './personal-story-content.js';
const names={dwarf:'布洛克 · 矿班',human:'罗什福尔 · 接应队',elf:'莱姆斯 · 照护者',goblin:'奇克 · 家人',ashen:'砾恩 · 族人'};
export const PERSONAL_STORY_SCENES=Object.fromEntries(PERSONAL_ARC_CONTENT.map(d=>[d.id,{
 id:d.id,sourceScene:d.id,pov:d.race,chapter:d.chapter,siteId:d.siteId,title:d.title,npc:names[d.race],lines:d.intro,lateIntro:d.lateIntro,
 objective:'亲自完成所选方案的两项现场目标；可暂存个人线，继续主线。',flags:[],knowledge:[],optional:true,personal:true,arcId:d.arcId,
 requires:[d.gate,...(d.number>1&&d.id!=='personal.dwarf.coup.03'?[`${d.arcId}.${String(d.number-1).padStart(2,'0')}`]:[])],
 ...(d.id==='personal.dwarf.coup.03'?{requiresAny:[['personal.dwarf.coup.02'],['flag:INVASION_BEGAN']]}:{}),
 choices:d.choices.map(c=>({...c,flags:[],knowledge:[]})),
 ...(d.combat?{encounter:{kind:'victory',nodeId:d.siteId+'.field'}}:{})
}]));
// Late participation has an authored current task, not a replay of a rescue.
export function personalActions(d,choiceId,late=false){
 const c=d?.choices.find(c=>c.id===choiceId);if(!d?.personal||!c)return [];
 return late?(c.lateActions??c.actions):c.actions;
}
export function personalSceneIsLate(s,d){return !!d?.personal&&d.chapter<9&&(s.story?.completedScenes??[]).some(id=>/^C\d\d\./.test(id)&&Number(id.slice(1,3))>d.chapter);}
