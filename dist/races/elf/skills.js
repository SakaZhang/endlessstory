export const ELEMENTS=['earth','water','fire','wind','light','dark'];
const definitions={
 bow:[['twin_arrow','双叶连矢','single',4400,'连续射出两箭，第二箭倍率更高；弓武器追加追尾箭。'],['thread_volley','穿林箭雨','all',8200,'向所有敌人发射两轮箭雨。'],['hunter_mark','猎径刻痕','single',6600,'命中后削弱护甲；为后续箭序创造窗口。'],['swift_draw','疾弦续势','self',11000,'提高攻击和暴击等级，并延续箭序。'],['pursuit','逐影追矢','single',7000,'连击序列越深，追击威力越高。'],['moon_finisher','月弦终奏','single',10500,'三段蓄势箭；消耗箭序强化最后一箭。']],
 elements:[['sixfold_shift','六相流转','single',5000,'按地水火风光暗轮转，每次施法改变元素并施加对应抗性暴露。'],['ember_bloom','炭蕊绽放','all',8500,'火焰花蕊扫过敌群，降低火抗。'],['moon_tide','月井潮汐','all',8800,'水系潮汐削弱敌人攻击。'],['wind_prism','旋叶棱光','single',6600,'风与光依次击中目标，轮转后获得额外威力。'],['root_eclipse','地根蚀影','single',7600,'地与暗双段攻击，降低目标暗抗。'],['sixfold_chorus','六相合鸣','all',14000,'六种元素分别命中；每段独立判定，不附带毒素增幅。']],
 staff:[['root_strike','根杖叩击','single',5000,'先物理杖击，再地系共鸣；法杖提高物理段比重。'],['moon_sweep','月杖回旋','all',8200,'物理横扫后释放水波，积累共鸣。'],['resonant_guard','共鸣守势','self',12000,'以法杖凝聚护盾并提高防御。'],['prism_impact','棱晶重击','single',7700,'物理重击和光系震荡各自计算。'],['dusk_reversal','暮杖返击','single',9000,'物理敲击接暗系回响，削弱目标攻击。'],['heartwood_release','心木释鸣','single',12000,'消耗最多三层共鸣，强化物理与元素分段伤害。']],
 shared:[['dew_mending','花露回生','self',16000,'恢复生命并持续治疗；不需改变攻击流派。'],['leaf_ward','叶脉庇护','self',12500,'获得独立护盾并提高闪避等级。'],['clear_moon','清月洗尘','self',13500,'清除最多两项负面状态，并提供短时护盾。']]
};
export const skills={}; export const passives={}; const nodes=[],groups=[];
const passiveDefs={bow:[['steady_string','稳弦','弓武器攻击提高8%，暴击等级提高6。',{attackMultiplier:1.08,critRating:6},'bow'],['forest_pursuer','林间追猎','物理穿透提高基础攻击的10%。',{physicalPenetrationPerBaseAtk:.1}]],elements:[['sixfold_affinity','六相亲和','六种元素攻击等级均提高8。',{elementAttack:Object.fromEntries(ELEMENTS.map(e=>[e,8]))}],['prism_skin','棱叶护身','六种元素抗性等级均提高8。',{elementResistance:Object.fromEntries(ELEMENTS.map(e=>[e,8]))}]],staff:[['root_balance','根杖平衡','持法杖时攻击提高8%，护甲提高8%。',{attackMultiplier:1.08,armorMultiplier:1.08},'staff'],['living_resonance','生息共鸣','最大生命提高8%，受到的治疗提高10%。',{maxHpMultiplier:1.08,receivedHealingMultiplier:1.1}]],shared:[['forest_vitality','林庭生机','最大生命提高10%。',{maxHpMultiplier:1.1}],['clear_mind','澄净心识','负面状态持续时间降低15%。',{negativeDurationMultiplier:.85}],['dew_blessing','花露祝福','受到的治疗提高12%。',{receivedHealingMultiplier:1.12}]]};
for(const [branch,rows] of Object.entries(definitions)){
 const ids=[];rows.forEach(([key,name,scope,cooldownMs,description],i)=>{const id='elf.'+key;skills[id]={id,name,description,scope,branch,cooldownMs,weaponVariants:['bow','staff','generic']};ids.push(id);nodes.push({id,name,description,kind:'active',branch,cost:branch==='shared'?3:[2,3,3,3,4,4][i],requires:i===0||branch==='shared'?[]:['elf.'+rows[Math.max(0,i-2)][0]],row:Math.floor(i/2),column:i%2});});
 passiveDefs[branch].forEach(([key,name,description,modifiers,weaponType],i)=>{const id='elf.'+key;passives[id]={id,name,description,modifiers,...(weaponType?{weaponType}:{})};ids.push(id);nodes.push({id,name,description,kind:'passive',branch,cost:branch==='shared'?3:4,requires:branch==='shared'?[]:['elf.'+rows[i+1][0]],row:3,column:i});});groups.push({id:branch,name:({bow:'弓箭连击',elements:'全元素攻击',staff:'法杖物理＋元素',shared:'林庭共修'})[branch],ids});
}
export const tree={id:'elf-tree-v1',nodes,groups,activeSlots:4,passiveSlots:2,presetCount:3,freeReset:true};
export const createRuntime=()=>({bowSequence:0,elementIndex:0,lastElement:null,resonance:0,lastBranch:null});
export function validRuntime(r){return !!r&&Object.keys(r).every(k=>['bowSequence','elementIndex','lastElement','resonance','lastBranch'].includes(k))&&Number.isInteger(r.bowSequence)&&r.bowSequence>=0&&r.bowSequence<=3&&Number.isInteger(r.elementIndex)&&r.elementIndex>=0&&r.elementIndex<6&&Number.isInteger(r.resonance)&&r.resonance>=0&&r.resonance<=3&&(r.lastElement===null||ELEMENTS.includes(r.lastElement))&&(r.lastBranch===null||['bow','elements','staff','shared'].includes(r.lastBranch));}
export function planSkill({skillId,castId,weaponType,selectedTargetId,targets=[],hero={},stats={},context={}}={}){
 const meta=skills[skillId];if(!meta||typeof castId!=='string'||!castId||!['atk','hp','armor'].every(k=>Number.isFinite(stats[k])&&stats[k]>=0))return null;
 const live=targets.filter(t=>t.alive===true),chosen=meta.scope==='all'?live:meta.scope==='self'?[]:live.filter(t=>t.id===selectedTargetId);if(meta.scope!=='self'&&!chosen.length)return null;
 const rt=context.runtime??context.elf??context.raceRuntime?.elf??createRuntime();if(!validRuntime(rt))return null;const next={...rt,lastBranch:meta.branch},actions=[];let idx=0;
 const effect=(type,amount,durationMs=6000,extra={})=>({type,amount,durationMs,sourceId:skillId,...extra});
 const hit=(t,c,damageType='physical',effects=[])=>actions.push({kind:'hit',targetId:t.id,hitId:`${castId}:${idx}:${t.id}`,hitIndex:idx++,damageType,coefficient:c,independentHit:true,independentCrit:true,reaperEligible:true,effects});
 const self=effects=>actions.push({kind:'effects',targetId:'self',effects}); const key=skillId.slice(4);const el=ELEMENTS[rt.elementIndex];
 if(meta.branch==='bow'){
  next.bowSequence=key==='moon_finisher'?0:Math.min(3,rt.lastBranch==='bow'?rt.bowSequence+1:1);
  for(const t of chosen){if(key==='twin_arrow'){hit(t,.55);hit(t,.8);if(weaponType==='bow')hit(t,.35);}
   if(key==='thread_volley'){hit(t,.42);hit(t,.55);}
   if(key==='hunter_mark')hit(t,1.1,'physical',[effect('armorDown',.15*stats.atk)]);
   if(key==='pursuit'){hit(t,1.2);hit(t,.25+.15*rt.bowSequence);}
   if(key==='moon_finisher'){hit(t,.45);hit(t,.6);hit(t,.8+.18*rt.bowSequence);}}
  if(key==='swift_draw')self([effect('attackUp',stats.atk*.12),effect('critUp',8)]);
 }
 if(meta.branch==='elements'){
  const selected={sixfold_shift:el,ember_bloom:'fire',moon_tide:'water',wind_prism:'wind',root_eclipse:'earth',sixfold_chorus:el}[key];next.lastElement=selected;next.elementIndex=(rt.elementIndex+1)%6;const shift=rt.lastElement&&rt.lastElement!==selected?1.1:1;
  for(const t of chosen){if(key==='sixfold_shift')hit(t,1.45*shift,selected,[effect('elementResistDown',10,6000,{damageType:selected})]);
   if(key==='ember_bloom')hit(t,.95*shift,'fire',[effect('elementResistDown',8,6000,{damageType:'fire'})]);
   if(key==='moon_tide')hit(t,shift,'water',[effect('attackDown',stats.atk*.1)]);
   if(key==='wind_prism'){hit(t,.8*shift,'wind');hit(t,.65*shift,'light');}
   if(key==='root_eclipse'){hit(t,.75*shift,'earth');hit(t,.85*shift,'dark',[effect('elementResistDown',10,6000,{damageType:'dark'})]);}
   if(key==='sixfold_chorus')for(const e of ELEMENTS)hit(t,.24*shift,e);}
 }
 if(meta.branch==='staff'){
  next.resonance=key==='heartwood_release'?0:Math.min(3,rt.resonance+1);let ratio=weaponType==='staff'?.6:.5;const coeff={root_strike:1.65,moon_sweep:1.1,prism_impact:1.9,dusk_reversal:1.7,heartwood_release:2+.2*rt.resonance}[key];const element={root_strike:'earth',moon_sweep:'water',prism_impact:'light',dusk_reversal:'dark',heartwood_release:el}[key];
  if(coeff)for(const t of chosen){hit(t,coeff*ratio);hit(t,coeff*(1-ratio),element,key==='dusk_reversal'?[effect('attackDown',stats.atk*.12)]:[]);}
  if(key==='resonant_guard')self([effect('shield',stats.hp*.16,7000),effect('defenseUp',stats.armor*.18,7000)]);
 }
 if(key==='dew_mending'){if(hero.hp>=hero.maxHp)return null;self([effect('heal',stats.hp*.13,0),effect('healOverTime',stats.hp*.018,6000,{tickIntervalMs:2000})]);}
 if(key==='leaf_ward')self([effect('shield',stats.hp*.12),effect('dodgeUp',8)]);
 if(key==='clear_moon'){if(!hero.eligibleDebuffIds?.length)return null;self([{type:'cleanse',sourceId:skillId,count:2,eligibleIds:[...hero.eligibleDebuffIds]},effect('shield',stats.hp*.08,4000)]);}
 return {skillId,castId,scope:meta.scope,branch:meta.branch,cooldownMs:meta.cooldownMs,activeCastCount:1,damageActionCount:actions.some(a=>a.kind==='hit')?1:0,actions,runtimePatch:next};
}
export function modifySkillPlan(plan,{setCounts={},weaponType,context={}}={}){
 const out=structuredClone(plan),counts={arrow:setCounts.elf_arrow??0,prism:setCounts.elf_prism??0,root:setCounts.elf_root??0};
 for(const a of out.actions){if(a.kind==='hit'){
  if(out.branch==='bow'&&counts.arrow>=2)a.coefficient*=1.1;
  if(out.branch==='bow'&&counts.arrow>=4&&a.hitIndex>=1)a.coefficient*=1.18;
  if(out.branch==='elements'&&counts.prism>=2)a.coefficient*=1.1;
  if(out.branch==='elements'&&counts.prism>=4&&context.runtime?.lastElement&&a.damageType!==context.runtime.lastElement)a.coefficient*=1.15;
  if(out.branch==='staff'&&counts.root>=2)a.coefficient*=1.1;
  if(out.branch==='staff'&&counts.root>=4&&a.damageType!=='physical')a.coefficient*=1.2;
 }
 for(const e of a.effects??[])if(counts.root>=4&&out.branch==='staff'&&e.type==='shield')e.amount*=1.2;
 }return out;
}
