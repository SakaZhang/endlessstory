const sid=x=>'goblin.'+x;
const branches={poison:'叠毒',ambush:'伏击连杀',contraption:'诡械牵制',common:'穴途生存'};
const rows=[
['venom_cut','涂菌刺','poison','single',5500,'命中施加一层毒；匕首补一记轻刺，单手剑削弱攻击。'],
['spore_fan','散孢扇','poison','all',11000,'对全体施加一层毒并降低命中；不放大毒伤。'],
['bitter_wound','苦鳃破口','poison','single',8500,'物理刺击；目标中毒时削弱护甲。'],
['spore_transfer','移孢','poison','all',13000,'当主目标中毒时向其他活目标施加一层毒，主目标获得一次补层。'],
['toxic_feint','毒刃佯攻','poison','self',15000,'提升闪避与穿透，争取叠层时间。'],
['mire_seal','苦菌封势','poison','single',14000,'施加毒并削弱攻击；满五层时额外降低命中，不增幅毒伤。'],
['opening_cut','伏径首击','ambush','single',6000,'目标生命高于75%时增强直伤；匕首两击，单手剑重斩。'],
['seam_step','穿隙步','ambush','self',13000,'短时提升闪避与穿透，不提供隐身或无敌。'],
['finish_cut','收尾割','ambush','single',9000,'目标生命低于30%时增强直伤，非斩杀即死。'],
['stolen_moment','夺隙','ambush','single',11000,'打断目标蓄势；成功后提高自身攻击。'],
['crossing_blade','过路刃','ambush','all',12000,'匕首集中于主目标；单手剑横扫，低生命目标受额外直伤。'],
['ration_rush','余粮急行','ambush','self',17000,'小量恢复生命并提升攻击，维持清敌节奏。'],
['snare_wire','伏索','contraption','self',10000,'布下一次伏索，敌方直接行动后反击并削弱攻击，8秒失效。'],
['rattle_decoy','响壳诱饵','contraption','self',14000,'诱饵响应两次敌方直接行动，施加命中降低，10秒失效。'],
['tangle_cut','缠索割','contraption','single',7500,'造成物理伤害并降低命中，单手剑同时削弱护甲。'],
['spring_scatter','簧片散射','contraption','self',16000,'下一次敌方直接行动后触发全体物理散射；不递归触发机关。'],
['jam_joint','卡节','contraption','single',12000,'打断蓄势并造成短促眩晕；首领按控制折减规则。'],
['braced_lure','护板诱阵','contraption','self',18000,'获得小护盾并布置一次减攻诱饵；不免疫伤害。'],
['patch_ration','分粮包扎','common','self',18000,'恢复生命，单手剑附带小护盾。'],
['dust_escape','扬尘脱身','common','all',16000,'全体命中降低并提高自身闪避。'],
['shed_binding','脱结','common','self',18000,'清除一个负面状态并获得护盾。']
];
export const skills=Object.fromEntries(rows.map(([key,name,branch,scope,cooldownMs,description])=>[sid(key),{id:sid(key),name,branch,scope,cooldownMs,description,weaponVariants:{dagger:'短刃连刺与机动',sword:'单手剑稳击与破势',generic:'保留基础效果；不限种族装备'}}]));
const passiveRows=[['spore_lore','菌途识药','poison',{negativeDurationMultiplier:.88}],['bitter_edge','苦刃辨隙','poison',{physicalPenetrationPerBaseAtk:.08}],['light_pack','轻装伏行','ambush',{attackMultiplier:1.07}],['scout_breath','斥候续息','ambush',{receivedHealingMultiplier:1.12}],['copper_brace','旧铜护架','contraption',{armorMultiplier:1.12}],['tendon_knots','兽筋紧结','contraption',{maxHpMultiplier:1.08}],['tunnel_survivor','穴途韧命','common',{maxHpMultiplier:1.06}],['ration_sense','余粮嗅觉','common',{receivedHealingMultiplier:1.1}],['quiet_step','无声踏点','common',{negativeDurationMultiplier:.9}]];
export const passives=Object.fromEntries(passiveRows.map(([key,name,branch,modifiers])=>[sid(key),{id:sid(key),name,branch,description:'以生存经验强化基础属性，不改变毒伤规则。',modifiers}]));
export const tree={id:'goblin-tree-v1',status:'candidate',branches,activeSlots:4,passiveSlots:2,presets:3,resetCost:0,nodes:[]};
for(const branch of ['poison','ambush','contraption','common']){
 const active=Object.values(skills).filter(s=>s.branch===branch);
 active.forEach((s,i)=>tree.nodes.push({...s,kind:'active',cost:branch==='common'?4:[2,3,3,4,4,4][i],requires:i&&branch!=='common'?[active[0].id]:[],row:Math.floor(i/2),column:i%2}));
 Object.values(passives).filter(s=>s.branch===branch).forEach((s,i)=>tree.nodes.push({...s,kind:'passive',cost:3,requires:[],row:3,column:i}));
}
export const poisonTiming={tickIntervalMs:3000,layerDurationMs:9000,maxLayers:5,refreshPolicy:'earliest-expiry',schedule:'per-layer',expiryTick:'inclusive'};
export function planSkill({skillId,castId,weaponType,selectedTargetId,targets=[],hero={},stats={}}={}){
 const m=skills[skillId];if(!m||!castId)return null;
 const live=targets.filter(t=>t.alive),chosen=m.scope==='all'?live:m.scope==='single'?live.filter(t=>t.id===selectedTargetId):[];if(m.scope!=='self'&&!chosen.length)return null;
 const key=skillId.split('.')[1],dagger=weaponType==='dagger',sword=weaponType==='sword',atk=Math.max(0,stats.atk??1),hp=Math.max(1,stats.hp??hero.maxHp??1),actions=[];
 const ef=(type,amount,durationMs=6000,extra={})=>({type,amount,durationMs,sourceId:skillId,...extra});
 const effect=(targetId,effects)=>actions.push({kind:'effects',targetId,effects});
 const hit=(t,coefficient,effects=[],index=0)=>actions.push({kind:'hit',castId,hitId:`${castId}:${t.id}:${index}`,targetId:t.id,hitIndex:index,damageType:'physical',coefficient,independentHit:true,independentCrit:true,reaperEligible:true,effects});
 const poison=()=>({type:'poison',status:'poison',sourceId:skillId,damageKind:'percent-max-hp',fractionPerLayer:.02,element:null,mechanicsReady:true,requiresHit:true,timing:{...poisonTiming},shieldPolicy:'absorb-shield-before-hp',globalDamageMultiplierApplies:false,chance:1,reaperEligible:false,activeCastCount:0});
 const reactive=(charges,coefficient,hitDown,attackDown,splash=false,durationMs=8000)=>ef('raceReactive',0,durationMs,{charges,coefficient,hitDown,attackDown,splash,trigger:'enemy-direct-action',nonRecursive:true,damageType:'physical'});
 for(const t of chosen){
  const ratio=Number.isFinite(t.hp)&&t.maxHp>0?t.hp/t.maxHp:1,layers=t.poisonLayers??0;
  if(key==='venom_cut'){hit(t,.65,[poison(),...(sword?[ef('attackDown',atk*.08)]:[])]);if(dagger)hit(t,.25,[],1);}
  if(key==='spore_fan')hit(t,.25,[poison(),ef('hitDown',12)]);
  if(key==='bitter_wound')hit(t,1.05,layers?[ef('armorDown',atk*.15)]:[]);
  if(key==='spore_transfer'){const origin=live.find(x=>x.id===selectedTargetId);if((origin?.poisonLayers??0)>0)hit(t,.2,[poison()]);}
  if(key==='mire_seal')hit(t,.5,[poison(),ef('attackDown',atk*.14),...(layers>=5?[ef('hitDown',22)]:[])]);
  if(key==='opening_cut'){const bonus=ratio>.75?.5:0;hit(t,(dagger?.65:1.05)+bonus);if(dagger)hit(t,.3,[],1);}
  if(key==='finish_cut')hit(t,(sword?1.15:.95)+(ratio<.3?.85:0));
  if(key==='stolen_moment')hit(t,.75,[{type:'interrupt',sourceId:skillId,requiresPreparing:true,onSuccess:[ef('attackUp',atk*.14,5000,{target:'self'})]}]);
  if(key==='crossing_blade'&&(!dagger||t.id===selectedTargetId))hit(t,(dagger?1.3:.7)+(ratio<.3?.25:0));
  if(key==='tangle_cut')hit(t,.95,[ef('hitDown',18),...(sword?[ef('armorDown',atk*.1)]:[])]);
  if(key==='jam_joint')hit(t,.6,[{type:'interrupt',sourceId:skillId,requiresPreparing:true},ef('stun',0,650,{bossScale:'host-control-policy',minimumPositive:true})]);
  if(key==='dust_escape')effect(t.id,[ef('hitDown',20,6000)]);
 }
 if(key==='toxic_feint')effect('self',[ef('dodgeUp',20),ef('penetrationUp',atk*.12)]);
 if(key==='seam_step')effect('self',[ef('dodgeUp',26),ef('penetrationUp',atk*.16)]);
 if(key==='ration_rush')effect('self',[ef('heal',hp*.06,0),ef('attackUp',atk*.12)]);
 if(key==='snare_wire')effect('self',[reactive(1,.7,0,atk*.12)]);
 if(key==='rattle_decoy')effect('self',[reactive(2,.15,24,0,false,10000)]);
 if(key==='spring_scatter')effect('self',[reactive(1,.5,10,0,true)]);
 if(key==='braced_lure')effect('self',[ef('shield',hp*.07,8000),reactive(1,.25,0,atk*.16)]);
 if(key==='patch_ration')effect('self',[ef('heal',hp*.12,0),...(sword?[ef('shield',hp*.04)]:[])]);
 if(key==='dust_escape')effect('self',[ef('dodgeUp',18)]);
 if(key==='shed_binding')effect('self',[...(hero.eligibleDebuffIds?.length?[{type:'cleanse',count:1,eligibleIds:hero.eligibleDebuffIds,sourceId:skillId}]:[]),ef('shield',hp*.09,7000)]);
 if(!actions.length)return null;
 return {skillId,castId,scope:m.scope,branch:weaponType??'generic',cooldownMs:m.cooldownMs,activeCastCount:1,damageActionCount:actions.some(a=>a.kind==='hit')?1:0,actions};
}
tree.groups=Object.entries(branches).map(([branch,name])=>({id:branch==='common'?'shared':branch,name,ids:tree.nodes.filter(n=>n.branch===branch).map(n=>n.id)}));

const passiveText={spore_lore:'自身负面状态持续时间缩短12%。',bitter_edge:'获得基础攻击8%的物理穿透。',light_pack:'基础攻击提高7%。',scout_breath:'受到的治疗提高12%。',copper_brace:'基础护甲提高12%。',tendon_knots:'最大生命提高8%。',tunnel_survivor:'最大生命提高6%。',ration_sense:'受到的治疗提高10%。',quiet_step:'自身负面状态持续时间缩短10%。'};
for(const [key,description]of Object.entries(passiveText)){passives[sid(key)].description=description;tree.nodes.find(n=>n.id===sid(key)).description=description;}
