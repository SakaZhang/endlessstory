// C08 rescue route. Historical O01 scenes remain readable for existing saves only.
export const SEAL_RESCUE_RACES=['human','dwarf','goblin','ashen'];
const names={human:'罗什福尔',dwarf:'布洛克',goblin:'奇克',ashen:'砾恩'};
export const SEAL_RESCUE_SCENARIOS={};
export function extendSealRescueScenes(scenes){
 for(const race of SEAL_RESCUE_RACES){
  const who=names[race],previous=race==='ashen'?'C07.EA03.ashen':'C07.O02.'+race;
  const rows=[
   {step:'11',title:'封印中的莱姆斯 · 外层',lines:['[光纹将莱姆斯困在原地。他抬起手，封印却牵动他的手臂，将靠近的人推开。]','莱姆斯：别靠太近……它会反击。',who+'：我看见了。我们破开它，不伤你。'],objective:'压住被封印的莱姆斯，击破外层束缚；不要伤他性命。',flags:['E_RESCUE_FIRST_CLEARED'],requires:[previous],mode:'clear',result:'seal-rescue-first',outcome:'外层光纹裂开，莱姆斯稳住了脚步。缠住双臂的束缚仍在。'},
   {step:'12',title:'封印中的莱姆斯 · 内层',lines:['[断开的光纹向里收紧。莱姆斯护住胸口，另一只手仍被牵着向外挥动。]',who+'：还有一层。我来挡住反击，你找它收紧的位置。','莱姆斯：我带着旧制楔钉。等核心露出来，就能卡住回弹。'],objective:'击破第二层束缚，让莱姆斯露出封印核心。',flags:['E_RESCUE_SECOND_CLEARED'],requires:['C08.O11.'+race],mode:'clear',result:'seal-rescue-second',outcome:'最后一圈束缚松动，莱姆斯取出了守林者给他的旧制楔钉。核心仍在回弹，尚未解封。'},
   {step:'13',title:'合力破开封印',lines:['[核心在裂口中一开一合。莱姆斯将旧制楔钉对准缝隙，等外侧的人替他压住回弹。]','莱姆斯：这是守林者教我的。替我稳住这里。',who+'：稳住了。动手！'],objective:'从外侧稳住封印，让莱姆斯消耗旧制楔钉击破核心。',flags:['E_RESCUE_WEDGE_USED','E_SEAL_OUTER_OPENED','E_UNSEALED'],requires:['C08.O12.'+race],mode:'tool',result:'seal-rescue-opened',outcome:'旧制楔钉在核心中碎裂，光纹彻底散去。莱姆斯走出封印。'}
  ];
  for(const row of rows){
   const id='C08.O'+row.step+'.'+race,scenarioId='story.c08-o'+row.step+'-'+race,tool=row.mode==='tool';
   scenes[id]={id,sourceScene:'C08.O'+row.step,chapter:8,pov:race,siteId:'ashen.a06',title:row.title,npc:tool?'莱姆斯与'+who:'被封印的莱姆斯',lines:row.lines,objective:row.objective,flags:row.flags,knowledge:tool?[{id:id+'.k0',text:'从外侧稳住封印，配合莱姆斯使用他持有的旧制楔钉解开核心；楔钉已耗尽。',mode:'seen'}]:[],choices:[{id:'proceed',label:tool?'与莱姆斯一起破开核心':'靠近封印，开始解救',flags:[]}],requires:row.requires,optional:false,encounter:{kind:'scenario',scenarioId,nodeId:'ashen.a06.field',count:1},...(tool?{questTool:'lemus-old-wedge'}:{})};
  }
  const follow=scenes['C08.X01.'+race];follow.requires=[];follow.requiresAny=[['C08.O01.'+race],['C08.O13.'+race]];
 }
 return scenes;
}
for(const race of SEAL_RESCUE_RACES)for(const step of ['11','12','13']){
 const tool=step==='13',id='story.c08-o'+step+'-'+race;
 SEAL_RESCUE_SCENARIOS[id]={sceneId:'C08.O'+step+'.'+race,race,siteId:'ashen.a06',budgetId:'ashen.a06.normal.'+(step==='11'?1:step==='12'?2:3),actorName:tool?'封印核心':'被封印的莱姆斯',mode:tool?'tool':'clear',result:step==='11'?'seal-rescue-first':step==='12'?'seal-rescue-second':'seal-rescue-opened',objective:tool?'稳住外侧封印，与莱姆斯合力击破核心。':step==='11'?'击破外层束缚，不伤莱姆斯性命。':'击破内层束缚，露出封印核心。',outcome:tool?'莱姆斯消耗旧制楔钉击破核心，走出封印。':step==='11'?'外层束缚已破，莱姆斯仍被内层光纹困住。':'内层束缚已破，莱姆斯取出旧制楔钉；核心尚待合力解除。',...(tool?{actorId:'seal-core',cooperativeTool:true}:{actorRace:'elf',actorWeapon:'staff',keepAlive:true,sealRescue:true})};
}
export function sealRouteAvailable(st,d){
 const race=d.pov,legacy='C08.O01.'+race,visited=st.completedScenes.includes(legacy)||st.activeScene?.id===legacy;
 if(d.id===legacy)return visited;
 if(/^C08\.O1[123]\./.test(d.id))return !visited;
 return true;
}
// Presentation-only override keeps historical active encounters byte-compatible.
export function sealActorPresentation(encounter,unit){
 const id=encounter?.storyScenario?.id;if(!unit?.main)return {};
 if(id==='story.c08-e01-elf'||id==='story.c08-e02-elf')return {storyActorId:'seal-core',sealBound:true};
 if(/^story\.c08-o1[12]-/.test(id??''))return {sealBound:true};
 return {};
}
