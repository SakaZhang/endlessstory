// Human plans use the existing effect host. ATK/HP/armor are immutable cast snapshots.
const prefix='human.',sid=x=>prefix+x;
const definitions=[
 ['cut','割裂斩','bleed','single',4400,3,[],0,'斩击并造成攻击力快照流血；双手剑延长流血，剑盾削弱敌方攻击。'],
 ['red_sweep','赤线横扫','bleed','all',7700,3,['cut'],1,'横扫所有敌人并施加流血，剑盾同时压低命中。'],
 ['open_wound','剖伤','bleed','single',6600,4,['cut'],1,'攻击流血目标追加伤害；双手剑追加一次独立命中。'],
 ['blood_mark','血痕标记','bleed','single',11000,4,['red_sweep'],2,'刻下伤痕并破甲；剑盾削弱攻击，双手剑提高流血强度。'],
 ['sever','断脉','bleed','single',9900,4,['open_wound','blood_mark'],3,'消耗已存在流血换取强力斩击；没有流血仍可正常攻击。'],
 ['red_recovery','止血整备','bleed','self',16500,3,['red_sweep'],2,'小量治疗并持续恢复；剑盾获得短护盾，双手剑短时吸血。'],
 ['serrated_edge','锯齿刃','bleed','passive',0,3,['cut'],2,'双手剑伤害提高8%，护甲降低5%。'],
 ['steady_blood','稳固血气','bleed','passive',0,3,['red_recovery'],3,'最大生命提高10%，受到治疗提高8%。'],
 ['precise_cut','精确斩','crit','single',4400,3,[],0,'准确斩击并提高短时暴击评级；双手剑伤害较高。'],
 ['opening','破绽步','crit','self',11000,3,['precise_cut'],1,'提升暴击评级和穿甲；剑盾还提高闪避评级。'],
 ['cross_cut','交错双斩','crit','single',6600,4,['precise_cut'],1,'连续两次独立命中；剑盾第二击降低护甲。'],
 ['expose','识破','crit','single',9900,4,['opening'],2,'破甲并降低命中；双手剑破甲更强，剑盾持续更久。'],
 ['decisive','决胜锋','crit','single',9900,4,['cross_cut','expose'],3,'对已破甲目标重斩；双手剑强化条件伤害。'],
 ['flash_arc','闪光弧','crit','all',12100,3,['cross_cut'],2,'迅速横扫并降低命中；剑盾短暂提高自身暴击评级。'],
 ['keen_eye','锐眼','crit','passive',0,3,['precise_cut'],2,'暴击评级提高12。'],
 ['long_edge','长锋专精','crit','passive',0,3,['expose'],3,'双手剑获得相当于基础攻击12%的物理穿透。'],
 ['oath_guard','誓约守势','guard','self',13200,3,[],0,'获得护盾；剑盾允许盾尚存时承受穿盾直伤后反击，双手剑提高护甲。'],
 ['shield_bash','盾锋击','guard','single',6600,3,['oath_guard'],1,'护甲贡献的重击；剑盾有盾时更强，双手剑削弱攻击。'],
 ['hold_line','固守阵线','guard','self',11000,4,['oath_guard'],1,'提高防御并持续治疗；剑盾强化防御，双手剑获得穿甲。'],
 ['repulse','退敌震','guard','all',14300,4,['shield_bash'],2,'低伤冲击并短暂眩晕；剑盾延长控制，首领按统一韧性缩短。'],
 ['return_cut','返刃','guard','single',8800,4,['shield_bash','hold_line'],3,'守势重斩；有护盾时强化，剑盾获得新的反击护盾。'],
 ['rally','护誓振作','guard','self',16500,3,['hold_line'],2,'清除一项负面并获得护盾；剑盾清两项，双手剑增加攻击。'],
 ['shield_drill','盾列训练','guard','passive',0,3,['oath_guard'],2,'剑盾护甲提高15%。'],
 ['enduring_oath','坚誓','guard','passive',0,3,['hold_line'],3,'负面状态持续时间缩短20%。'],
 ['field_dressing','战地包扎','shared','self',17600,3,[],0,'立即恢复生命并持续治疗；剑盾治疗更稳，双手剑提升短时吸血。'],
 ['intercept','截击','shared','single',9900,3,[],1,'打断正在准备的动作；剑盾短暂眩晕，双手剑短时提高攻击。'],
 ['cleanse','净誓','shared','self',14300,3,[],2,'清除负面并提高防御；无负面时也能获得防御。'],
 ['march','行军耐力','shared','passive',0,3,[],0,'最大生命提高8%。'],
 ['discipline','武备纪律','shared','passive',0,3,[],1,'攻击与护甲各提高5%。'],
 ['renewal','复苏训练','shared','passive',0,3,[],2,'受到治疗提高12%，包含药剂与吸血，不提高护盾。']
];
export const HUMAN_TREE={id:'human-tree-99-v1',status:'candidate-integration',groups:['bleed','crit','guard','shared'].map((id,i)=>({id,name:['流血','暴击','防御反击','共同训练'][i],ids:definitions.filter(d=>d[2]===id).map(d=>sid(d[0]))})),nodes:definitions.map(([id,name,branch,scope,cooldownMs,cost,requires,row,description],i)=>({id:sid(id),name,kind:scope==='passive'?'passive':'active',cost,requires:requires.map(sid),branch,row,column:branch==='shared'?(scope==='passive'?2:0):[0,0,1,0,1,1,2,2][i%8],description}))};
export const HUMAN_SKILLS=Object.fromEntries(definitions.filter(d=>d[3]!=='passive').map(([id,name,branch,scope,cooldownMs,,,,description])=>[sid(id),{id:sid(id),name,description,scope,branch,cooldownMs,weaponVariants:{sword_shield:'剑盾：守势、减攻或控制联动',greatsword:'双手剑：攻击、流血或穿甲联动',generic:'保留技能基础效果；没有专精武器加成'}}]));
const passiveMods={serrated_edge:{damageMultiplier:1.08,armorMultiplier:.95},steady_blood:{maxHpMultiplier:1.10,receivedHealingMultiplier:1.08},keen_eye:{critRating:12},long_edge:{physicalPenetrationPerBaseAtk:.12},shield_drill:{armorMultiplier:1.15},enduring_oath:{negativeDurationMultiplier:.8},march:{maxHpMultiplier:1.08},discipline:{attackMultiplier:1.05,armorMultiplier:1.05},renewal:{receivedHealingMultiplier:1.12}};
export const HUMAN_PASSIVES=Object.fromEntries(definitions.filter(d=>d[3]==='passive').map(([id,name,,,,,,,,description])=>[sid(id),{id:sid(id),name,description:definitions.find(d=>d[0]===id)[8],modifiers:passiveMods[id],...(['serrated_edge','long_edge'].includes(id)?{weaponType:'greatsword'}:id==='shield_drill'?{weaponType:'sword_shield'}:{})}]));
export function planSkill({skillId,castId,weaponType,selectedTargetId,targets=[],hero={},stats={}}={}){
 const meta=HUMAN_SKILLS[skillId];if(!meta||typeof castId!=='string'||!castId||!['atk','hp','armor'].every(k=>Number.isFinite(stats[k])&&stats[k]>=0)||!Array.isArray(targets))return null;
 const id=skillId.slice(prefix.length),A=stats.atk,H=stats.hp,D=stats.armor,S=weaponType==='sword_shield',G=weaponType==='greatsword',branch=S?'sword_shield':G?'greatsword':'generic',actions=[];
 const live=targets.filter(t=>t.alive===true),chosen=meta.scope==='all'?live:meta.scope==='single'?live.filter(t=>t.id===selectedTargetId):[];if(meta.scope!=='self'&&!chosen.length)return null;
 const e=(type,amount,durationMs=6000,extra={})=>({type,amount,durationMs,sourceId:skillId,stacking:'refresh-source',...extra});
 const weaken=(t,ratio=.12)=>Math.min(A*ratio,Math.max(0,t.baseAtk??t.atk??0)*.20); // cap from immutable enemy base ATK, not already-debuffed value
 const bleed=(mult=.11,duration=6000)=>e('dot',A*mult,duration,{status:'bleed',damageType:'physical',tickIntervalMs:2000,reaperEligible:false,activeCastCount:0});
 const fx=(targetId,effects)=>actions.push({kind:'effects',targetId,effects});
 const hit=(t,c,effects=[],extra={})=>{let hitIndex=actions.filter(a=>a.targetId===t.id&&a.kind==='hit').length;actions.push({kind:'hit',castId,hitId:`${castId}:${t.id}:${hitIndex}`,targetId:t.id,hitIndex,damageType:'physical',coefficient:c,independentHit:true,independentCrit:true,reaperEligible:true,effects,...extra});};
 for(const t of chosen){
 if(id==='cut')hit(t,1.1,[bleed(.11,G?8000:6000),...(S?[e('attackDown',weaken(t,.1))]:[])]);
 if(id==='red_sweep')hit(t,.7,[bleed(.08,G?8000:6000),...(S?[e('hitDown',8,4000)]:[])]);
 if(id==='open_wound'){hit(t,1.3+(t.bleeding?.35:0),S?[e('attackDown',weaken(t),4000)]:[]);if(G&&t.bleeding)hit(t,.45);}
 if(id==='blood_mark')fx(t.id,[bleed(G?.16:.12,8000),e('armorDown',A*.18,6000),...(S?[e('attackDown',weaken(t),6000)]:[])]);
 if(id==='sever')hit(t,1.65+(t.bleeding?(G?.95:.65):0),S?[e('shield',H*.06,4000,{target:'self',oncePerCast:true})]:[],{consumeStatusOnHit:t.bleeding?'bleed':null});
 if(id==='precise_cut')hit(t,G?1.45:1.2,[e('critUp',S?10:8,3300,{target:'self'})]);
 if(id==='cross_cut'){hit(t,G?.75:.65);hit(t,G?.95:.8,S?[e('armorDown',A*.14,5000)]:[]);}
 if(id==='expose')fx(t.id,[e('armorDown',A*(G?.26:.2),S?8000:6000),e('hitDown',10,S?8000:6000)]);
 if(id==='decisive')hit(t,1.5+(t.armorBroken?(G?1:.65):0),S?[e('defenseUp',D*.12,4400,{target:'self'})]:[]);
 if(id==='flash_arc')hit(t,G?1:.8,[e('hitDown',10,4000),...(S?[e('critUp',12,4000,{target:'self',oncePerCast:true})]:[])]);
 if(id==='shield_bash')hit(t,1+(S&&hero.shield>0?.45:0),G?[e('attackDown',weaken(t),4400)]:[],{flatDefenseContribution:Math.min(D*.5,A*.45)});
 if(id==='repulse')hit(t,.5,[e('stun',0,S?1650:1100,{pausePreparing:true,bossScale:'host-control-policy',minimumPositive:true}),...(G?[e('armorDown',A*.12,4000)]:[])]);
 if(id==='return_cut')hit(t,1.15+(hero.shield>0?.6:0),S?[e('shield',H*.06,4400,{target:'self',counterEligible:true})]:G?[e('penetrationUp',A*.12,4400,{target:'self'})]:[]);
 if(id==='intercept')hit(t,1.05,[{type:'interrupt',sourceId:skillId,requiresPreparing:true,onSuccess:S?[e('stun',0,1100,{bossScale:'host-control-policy',minimumPositive:true})]:G?[e('attackUp',A*.12,3300,{target:'self'})]:[]}]);
 }
 if(id==='red_recovery')fx('self',[e('heal',H*.07,0),e('healOverTime',H*.018,6000,{tickIntervalMs:2000}),...(S?[e('shield',H*.05,4000)]:G?[e('lifestealUp',12,6000)]:[])]);
 if(id==='opening')fx('self',[e('critUp',16,6600),e('penetrationUp',A*(G?.2:.12),6600),...(S?[e('dodgeUp',8,6600)]:[])]);
 if(id==='oath_guard')fx('self',[e('shield',H*(S?.21:.16),6600,{counterEligible:S}),...(G?[e('defenseUp',D*.15,6600)]:[])]);
 if(id==='hold_line')fx('self',[e('defenseUp',D*(S?.28:.2),6600),e('healOverTime',H*.015,6000,{tickIntervalMs:2000}),...(G?[e('penetrationUp',A*.12,6600)]:[])]);
 if(id==='rally'){let f=[e('shield',H*.1,5500,{counterEligible:S})];if(hero.eligibleDebuffIds?.length)f.unshift({type:'cleanse',count:S?2:1,eligibleIds:[...hero.eligibleDebuffIds],sourceId:skillId});if(G)f.push(e('attackUp',A*.12,5500));fx('self',f);}
 if(id==='field_dressing')fx('self',[e('heal',H*(S?.13:.11),0),e('healOverTime',H*.012,6000,{tickIntervalMs:2000}),...(G?[e('lifestealUp',10,6000)]:[])]);
 if(id==='cleanse'){let f=[e('defenseUp',D*.16,5500)];if(hero.eligibleDebuffIds?.length)f.unshift({type:'cleanse',count:S?2:1,eligibleIds:[...hero.eligibleDebuffIds],sourceId:skillId});if(G)f.push(e('attackUp',A*.08,5500));fx('self',f);}
 return {skillId,castId,scope:meta.scope,branch,cooldownMs:meta.cooldownMs,activeCastCount:1,damageActionCount:actions.some(a=>a.kind==='hit')?1:0,actions};
}
export const HUMAN_SETS=[{id:'human_blood_oath',name:'赤痕誓约',branch:'bleed',description:'伤痕、割裂与断脉联动。',two:{bleedMultiplier:1.2},four:{severBleedingCoefficient:.55,bleedDurationMs:2000}},{id:'human_royal_edge',name:'王领锐锋',branch:'crit',description:'精确斩、破绽步与决胜锋联动。',two:{critRatingBonus:6},four:{decisiveBrokenCoefficient:.6,openingDurationMs:2200}},{id:'human_last_bastion',name:'最后壁垒',branch:'guard',description:'誓约守势、治疗与返刃联动。',two:{skillShieldMultiplier:1.2},four:{returnCutCoefficient:.5,guardHealingMultiplier:1.15}}];
export function modifySkillPlan(plan,{setCounts={},targets=[]}={}){if(!plan)return null;const p=structuredClone(plan),c=id=>setCounts[id]??0;for(const a of p.actions){const t=targets.find(t=>t.id===a.targetId);if(a.kind==='hit'&&p.skillId===sid('sever')&&t?.bleeding&&c('human_blood_oath')>=4)a.coefficient+=.55;if(a.kind==='hit'&&p.skillId===sid('decisive')&&t?.armorBroken&&c('human_royal_edge')>=4)a.coefficient+=.6;if(a.kind==='hit'&&p.skillId===sid('return_cut')&&c('human_last_bastion')>=4)a.coefficient+=.5;for(const e of a.effects??[]){if(e.type==='dot'&&e.status==='bleed'&&c('human_blood_oath')>=2){e.amount*=1.2;if(c('human_blood_oath')>=4)e.durationMs+=2000;}if(e.type==='critUp'&&c('human_royal_edge')>=2)e.amount+=6;if(p.skillId===sid('opening')&&c('human_royal_edge')>=4)e.durationMs+=2200;if(e.type==='shield'&&c('human_last_bastion')>=2)e.amount*=1.2;if(['heal','healOverTime'].includes(e.type)&&c('human_last_bastion')>=4)e.amount*=1.15;}}return p;}
export const HUMAN_CORE_BUILDS={bleed:{active:['cut','open_wound','sever','field_dressing'].map(sid),passive:['serrated_edge','steady_blood'].map(sid),learned:[...definitions.filter(d=>d[2]==='bleed').map(d=>sid(d[0])),sid('field_dressing')],cost:30},crit:{active:['precise_cut','expose','decisive','field_dressing'].map(sid),passive:['keen_eye','long_edge'].map(sid),learned:[...definitions.filter(d=>d[2]==='crit').map(d=>sid(d[0])),sid('field_dressing')],cost:30},guard:{active:['oath_guard','shield_bash','return_cut','field_dressing'].map(sid),passive:['shield_drill','enduring_oath'].map(sid),learned:[...definitions.filter(d=>d[2]==='guard').map(d=>sid(d[0])),sid('field_dressing')],cost:30}};
