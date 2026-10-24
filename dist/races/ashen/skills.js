// Pure plans; the host commits raceResource only after a successful cast.
export const createRuntime=()=>({version:1,heat:0,shards:0,resonance:0,lastPulse:null});
export function validRuntime(r){return !!r&&typeof r==='object'&&!Array.isArray(r)&&Object.keys(r).length===5&&r.version===1&&Number.isInteger(r.heat)&&r.heat>=0&&r.heat<=100&&Number.isInteger(r.shards)&&r.shards>=0&&r.shards<=6&&Number.isInteger(r.resonance)&&r.resonance>=0&&r.resonance<=3&&[null,'physical','light','dark'].includes(r.lastPulse);}
export function applyRaceEffects(runtime,effects){if(!validRuntime(runtime)||!Array.isArray(effects))return null;const r=structuredClone(runtime);for(const e of effects){if(e.type!=='raceResource')continue;if(e.operation==='pulse'){if(!['physical','light','dark'].includes(e.pulse))return null;if(r.lastPulse!==null&&r.lastPulse!==e.pulse)r.resonance=Math.min(3,r.resonance+1);r.lastPulse=e.pulse;continue;}const cap={heat:100,shards:6,resonance:3}[e.resource];if(!cap||!Number.isInteger(e.amount)||e.amount<0||!['add','spend'].includes(e.operation))return null;if(e.operation==='spend'){if(r[e.resource]<e.amount)return null;r[e.resource]-=e.amount;}else r[e.resource]=Math.min(cap,r[e.resource]+e.amount);}return r;}
const defs=[
['heat','kindle','引脉拳','single',6500,'物理打击并积蓄20热量；护臂额外积蓄5。'],
['heat','vent','泄压冲','all',10000,'消耗至多40热量强化火焰冲击；无热量仍有基础伤害。'],
['heat','anneal','退火壳','self',16000,'消耗至多30热量，将矿脉余热转为护盾；不是消耗敌人灼烧。'],
['heat','surge','赤脉连震','single',11500,'连续两次火焰打击，积蓄15热量。'],
['heat','temper','稳核增压','self',18000,'积蓄25热量并短时提升攻击。'],
['heat','overload','熔核过载','single',18000,'消耗至多70热量打出高压物理重击；锤强化转换效率。'],
['shell','mantle','凝岩披甲','self',14000,'生成独立护盾与2枚岩片；不通过反伤叠加。'],
['shell','cleave','裂壳横击','all',10000,'消耗至多3枚岩片增加群体物理压力。'],
['shell','fault','断纹钉','single',9000,'物理刺击与短时破甲，获得1枚岩片。'],
['shell','rebuild','碎壳重构','self',18000,'消耗至多3枚岩片修复生命并获得防御。'],
['shell','quarry','沉岩震踏','all',15000,'地元素震击并削弱攻击，获得1枚岩片。'],
['shell','fracture','岩壳裂变','all',20000,'消耗至多6枚岩片形成一次性群体碎晶冲击，绝不触发自身连锁。'],
['crystal','tap','叩晶','single',6000,'物理脉冲；与上一次不同相位时获得1晶鸣。'],
['crystal','dawn','折光脉','single',8000,'光脉冲；异相序列获得1晶鸣。'],
['crystal','dusk','沉影脉','single',8000,'暗脉冲；异相序列获得1晶鸣。'],
['crystal','chorus','同频护幕','self',16000,'消耗至多3晶鸣转为护盾；无晶鸣仍可保护。'],
['crystal','mend','晶脉接续','self',18000,'消耗至多2晶鸣恢复生命，保留上一相位供下一轮衔接。'],
['crystal','resound','三相回响','all',19000,'消耗至多3晶鸣产生光与暗双脉冲；消费不继续积蓄。'],
['common','salve','矿液润脉','self',20000,'以矿液恢复生命，任意武器均可使用。'],
['common','interrupt','断鸣掌','single',15000,'物理打击并打断当前蓄力；首领控制按通用衰减。'],
['common','purify','澄晶净息','self',20000,'解除一个可净化减益并生成小型护盾。']
];
export const skills=Object.fromEntries(defs.map(([branch,key,name,scope,cooldownMs,description])=>{const id='ashen.'+key;return [id,{id,name,kind:'active',scope,branch,cooldownMs,description,weaponVariants:{armguard:'护臂强化积蓄与晶鸣脉冲。',hammer:'锤强化裂解与资源转换。',generic:'保留全部基础技能和资源循环。'}}];}));
const passiveDefs=[['heat','thermal','内热导流',{attackMultiplier:1.06,elementAttack:{fire:8}}],['heat','insulation','隔热矿壁',{armorMultiplier:1.08,elementResistance:{fire:12}}],['shell','laminate','层理承压',{armorMultiplier:1.12}],['shell','matrix','岩基结构',{maxHpMultiplier:1.10}],['crystal','lattice','晶格调律',{elementAttack:{light:8,dark:8}}],['crystal','clarity','澄明矿脉',{receivedHealingMultiplier:1.12}],['common','endurance','矿躯韧性',{negativeDurationMultiplier:.9}],['common','vitality','活脉延伸',{maxHpMultiplier:1.06}],['common','precision','晶面校准',{critRating:10}]];
export const passives=Object.fromEntries(passiveDefs.map(([branch,key,name,modifiers])=>['ashen.'+key,{id:'ashen.'+key,name,kind:'passive',branch,description:({thermal:'攻击提高6%，火元素增幅增加8。',insulation:'防御提高8%，火元素抗性增加12。',laminate:'防御提高12%。',matrix:'最大生命提高10%；提高上限不会直接回复生命。',lattice:'光与暗元素增幅各增加8。',clarity:'受到的治疗提高12%。',endurance:'受到的负面状态持续时间缩短10%。',vitality:'最大生命提高6%；提高上限不会直接回复生命。',precision:'暴击等级增加10。'})[key],modifiers}]));
const nodes=[];for(const branch of ['heat','shell','crystal']){const ds=defs.filter(d=>d[0]===branch);ds.forEach((d,i)=>nodes.push({id:'ashen.'+d[1],name:d[2],kind:'active',cost:[2,3,3,4,4,5][i],requires:i===5?['ashen.'+ds[3][1],'ashen.'+ds[4][1]]:i?[`ashen.${ds[Math.max(0,i-2)][1]}`]:[],branch,row:[0,1,1,2,2,3][i],column:[1,0,2,0,2,1][i],description:d[5]}));passiveDefs.filter(d=>d[0]===branch).forEach((d,i)=>nodes.push({id:'ashen.'+d[1],name:d[2],kind:'passive',cost:3,requires:['ashen.'+ds[i][1]],branch,row:4,column:i*2,description:passives['ashen.'+d[1]].description}));}defs.filter(d=>d[0]==='common').forEach((d,i)=>nodes.push({id:'ashen.'+d[1],name:d[2],kind:'active',cost:3,requires:[],branch:'common',row:0,column:i,description:d[5]}));passiveDefs.filter(d=>d[0]==='common').forEach((d,i)=>nodes.push({id:'ashen.'+d[1],name:d[2],kind:'passive',cost:3,requires:[],branch:'common',row:1,column:i,description:passives['ashen.'+d[1]].description}));
export const tree={id:'ashen-tree-v1',nodes,groups:[{id:'heat',name:'熔核过载',ids:nodes.filter(n=>n.branch==='heat').map(n=>n.id)},{id:'shell',name:'岩壳裂变',ids:nodes.filter(n=>n.branch==='shell').map(n=>n.id)},{id:'crystal',name:'晶脉共振',ids:nodes.filter(n=>n.branch==='crystal').map(n=>n.id)},{id:'shared',name:'矿躯共通',ids:nodes.filter(n=>n.branch==='common').map(n=>n.id)}]};
export function planSkill({skillId,castId,weaponType,selectedTargetId,targets=[],hero={},stats={},context={}}={}){
const meta=skills[skillId],r=context.runtime??context.ashen??createRuntime();if(!meta||typeof castId!=='string'||!castId||!validRuntime(r)||!Array.isArray(targets))return null;
const chosen=meta.scope==='all'?targets.filter(t=>t.alive):meta.scope==='single'?targets.filter(t=>t.alive&&t.id===selectedTargetId):[];if(meta.scope!=='self'&&!chosen.length)return null;
const atk=Number.isFinite(stats.atk)?Math.max(0,stats.atk):0,hp=Number.isFinite(stats.hp)?Math.max(0,stats.hp):(hero.maxHp??0),armor=Number.isFinite(stats.armor)?Math.max(0,stats.armor):(hero.defense??0),key=skillId.slice(6),actions=[],bonus=weaponType==='hammer'?1.10:1;
const eff=(type,amount,durationMs=6000,extra={})=>({type,amount,durationMs,sourceId:skillId,source:{kind:'skill',id:skillId},...extra});
const self=(effects)=>actions.push({kind:'effects',targetId:'self',effects});
const resource=(resource,operation,amount)=>self([{type:'raceResource',resource,operation,amount,sourceId:skillId}]);
const spend=(res,max)=>{const n=Math.min(r[res],max);resource(res,'spend',n);return n;};
const hit=(type,coefficient,effects=[],index=0)=>chosen.forEach(t=>actions.push({kind:'hit',castId,targetId:t.id,hitId:`${castId}:${t.id}:${index}`,hitIndex:index,damageType:type,coefficient,independentHit:true,independentCrit:true,reaperEligible:true,effects:structuredClone(effects)}));
if(key==='kindle'){hit('physical',1.05);resource('heat','add',weaponType==='armguard'?25:20);}
if(key==='vent'){const n=spend('heat',40);hit('fire',.65+n*.018);}
if(key==='anneal'){const n=spend('heat',30);self([eff('shield',(hp*.07+armor*.5+n*atk*.009)*bonus,8000)]);}
if(key==='surge'){hit('fire',.58,[],0);hit('fire',.58,[],1);resource('heat','add',15);}
if(key==='temper'){resource('heat','add',25);self([eff('attackUp',.12,6500)]);}
if(key==='overload'){const n=spend('heat',70);hit('physical',1.1+n*.023*bonus);}
if(key==='mantle'){self([eff('shield',hp*.09+armor*.65,8000)]);resource('shards','add',2);}
if(key==='cleave'){const n=spend('shards',3);hit('physical',.75+n*.23*bonus);}
if(key==='fault'){hit('physical',.95,[eff('armorDown',.12,6000)]);resource('shards','add',1);}
if(key==='rebuild'){const n=spend('shards',3);self([eff('heal',hp*(.04+n*.022),0),eff('defenseUp',.12+n*.025,6000)]);}
if(key==='quarry'){hit('earth',.85,[eff('attackDown',.10,5000)]);resource('shards','add',1);}
if(key==='fracture'){const n=spend('shards',6);hit('physical',.8+n*.22*bonus);}
if(['tap','dawn','dusk'].includes(key)){const pulse={tap:'physical',dawn:'light',dusk:'dark'}[key];hit(pulse,1.05+(weaponType==='armguard'?.08:0));self([{type:'raceResource',operation:'pulse',pulse,sourceId:skillId}]);}
if(key==='chorus'){const n=spend('resonance',3);self([eff('shield',hp*(.06+n*.035),8500)]);}
if(key==='mend'){const n=spend('resonance',2);self([eff('heal',hp*(.045+n*.035),0)]);}
if(key==='resound'){const n=spend('resonance',3);hit('light',.45+n*.16,[],0);hit('dark',.45+n*.16,[],1);}
if(key==='salve')self([eff('heal',hp*.10,0)]);
if(key==='interrupt')hit('physical',.9,[{type:'interrupt',sourceId:skillId,requiresPreparing:true}]);
if(key==='purify')self([...(hero.eligibleDebuffIds?.length?[{type:'cleanse',count:1,eligibleIds:[...hero.eligibleDebuffIds],sourceId:skillId}]:[]),eff('shield',hp*.055,6000)]);
return {skillId,castId,scope:meta.scope,branch:meta.branch,cooldownMs:meta.cooldownMs,activeCastCount:1,damageActionCount:actions.some(a=>a.kind==='hit')?1:0,actions};
}
export function modifySkillPlan(plan,{setCounts={}}={}){
const p=structuredClone(plan),key=p.skillId.slice(6),count=id=>setCounts['ashen.'+id]??0;
for(const a of p.actions){if(a.kind==='hit'){
if(count('caldera')>=4&&['vent','overload'].includes(key))a.coefficient*=1.15;
if(count('strata')>=4&&['cleave','fracture'].includes(key))a.coefficient*=1.15;
if(count('prism')>=2&&['tap','dawn','dusk'].includes(key))a.coefficient*=1.08;
if(count('prism')>=4&&key==='resound')a.coefficient*=1.15;
}for(const e of a.effects??[]){
if(count('caldera')>=2&&e.type==='raceResource'&&e.resource==='heat'&&e.operation==='add')e.amount+=5;
if(count('caldera')>=4&&key==='anneal'&&e.type==='shield')e.amount*=1.2;
if(count('strata')>=2&&key==='mantle'&&e.type==='raceResource'&&e.resource==='shards')e.amount+=1;
if(count('strata')>=4&&key==='rebuild'&&e.type==='heal')e.amount*=1.2;
if(count('prism')>=4&&['chorus','mend'].includes(key)&&['heal','shield'].includes(e.type))e.amount*=1.2;
}}return p;}
