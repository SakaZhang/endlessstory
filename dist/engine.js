import {selectEquipmentTemplate,applyEquipmentTemplate,validEquipmentTemplateMetadata} from './equipment-templates.js';
export {EQUIPMENT_TEMPLATES,EQUIPMENT_TEMPLATE_BY_ID,RACE_WEAPON_POOLS,equipmentTemplateDisplay} from './equipment-templates.js';
import {validEnhancementMetadata,enhancedItemBase} from './equipment-enhancement.js';
export {DEVELOPMENT_ENHANCEMENT_CONFIG,enhancementLevel,enhancedItemBase,quoteDeveloperEnhancement,prepareDeveloperEnhancement,attemptDeveloperEnhancement} from './equipment-enhancement.js';
import {pauseMulti,makeMultiUnit,validMultiProfile,validMultiEncounter,validFixtureAction,syncMultiTarget,selectMultiTarget,multiTargetRows,stepMulti,withMultiRng,multiItemId} from './multi-combat.js';
import {validMonsterLedger,recordEncounteredMonsters} from './monster-codex-schema.js';
import {RECOVERY_RECIPE_CONFIG,recoveryInputPlan,rollRecoverySupply} from './recovery-recipe-schema.js';
export {RECOVERY_RECIPE_CONFIG,recoveryInputPlan,recoverySourceEligible} from './recovery-recipe-schema.js';
import {rollEquipmentInputQuality,fusionDivineChance} from './fusion-input-schema.js';
export {equipmentFusionQualityDistribution,rollEquipmentInputQuality,fusionDivineChance} from './fusion-input-schema.js';
import {equipmentFingerprint,validBatchSelection,validBatchQuote} from './batch-sale-schema.js';
import {validCollectionLedger,addOwnedCollection,normalizeCollectionLedger} from './codex-collection-schema.js';
import {rollSourceSet,isMerchantEquipmentSellable} from './set-source-schema.js';
export {rollSourceSet,isMerchantEquipmentSellable};
import {SKILL_UNLOCK_LEVELS,validSkillProgression,normalizeSkillProgression,skillUnlocked,collectSkillUnlockKeys} from './skill-progression-schema.js';
export {SKILL_UNLOCK_LEVELS,normalizeSkillProgression,skillUnlocked};
import {BAG_LIMITS,INVENTORY_SAVE_LIMIT,bagCounts,canReceiveEquipment,canReceiveMaterial,canReceiveItem,validLootFilters,normalizeInventoryState,setLootFilter,shouldDiscardLoot,emptyLootSummary,validLootSummary,mergeLootSummary} from './inventory-schema.js';
export {BAG_LIMITS,bagCounts,canReceiveEquipment,canReceiveMaterial,canReceiveItem,normalizeInventoryState,setLootFilter,shouldDiscardLoot} from './inventory-schema.js';
import {validDungeonCarry,captureDungeonPlayerState,applyDungeonPlayerState} from './dungeon-player-state.js';
import {validEquipmentLevelMetadata,normalizeEquipmentLevels,rollDropEquipmentLevel,rollEquipmentFusionLevel} from './equipment-level-schema.js';
export {normalizeEquipmentLevels,rollDropEquipmentLevel,rollEquipmentFusionLevel,EQUIPMENT_LEVEL_SOURCES} from './equipment-level-schema.js';
import {AREAS,SITES,INSTANCES,RACE_KEYS,areaLevelRange,resolveLegacySite,instanceCooldownMs,pickRoute,areaGearLevel} from './location-schema.js';
export {AREAS,SITES,INSTANCES,RACE_KEYS,areaLevelRange,resolveLegacySite,instanceCooldownMs,pickRoute,areaGearLevel} from './location-schema.js';
import {ELEMENT_KEYS,ELEMENT_AFFIX_DEFS,resolveElementDamage} from './element-schema.js';
export {ELEMENT_KEYS,resolveElementDamage} from './element-schema.js';
// v0.4 equipment foundation. Item families and equipment sockets are intentionally separate.
export const SCHEMA_VERSION = 2;
export const SLOTS = ['weapon','helm','armor','gloves','boots','ring','amulet'];
export const SOCKETS = ['weapon','helm','armor','gloves','boots','ring1','ring2','amulet'];
export const SOCKET_TYPE = Object.fromEntries(SOCKETS.map(k=>[k,k.startsWith('ring')?'ring':k]));
export const CORE_SOCKET = {socket:'core',type:'core',race:'ashen',playable:false};
export const SLOTNAME = {weapon:'武器',helm:'头盔',armor:'护甲',gloves:'手套',boots:'靴子',ring:'戒指',ring1:'戒指Ⅰ',ring2:'戒指Ⅱ',amulet:'项链',core:'核心'};
export const RARITY = ['普通','稀有','优良','至臻'];
export const SET_SLOTS = ['helm','armor','gloves','boots'];
export const BUILD = [
 {id:'anvil',name:'碎砧',sub:'裂甲 · 重击',skills:['break','heavy','interrupt',null],bonus:'2件：裂甲锤伤害 +25%；战吼延长1回合；4件：重锻击伤害 +35%。'},
 {id:'rune',name:'炉纹',sub:'铭火 · 引燃',skills:['mark','ignite','interrupt',null],bonus:'2件：铭火灼烧 +30%；炉蚀延长1回合；4件：引燃伤害 +35%。'},
 {id:'guard',name:'守冢',sub:'坚守 · 反击',skills:['guard','break','interrupt',null],bonus:'2件：坚守主动伤害 +30%；铁衣延长1回合；4件：坚守反击提高到100%攻击，铸壁获得2回合坚守。'}
];
export const SKILLS={break:{name:'裂甲锤',icon:'⌁',cd:4,desc:'120%攻击伤害，削减目标25%护甲，持续6回合。'},heavy:{name:'重锻击',icon:'✦',cd:5,desc:'220%攻击伤害，破甲目标再提高25%。'},interrupt:{name:'断势',icon:'ϟ',cd:6,desc:'115%攻击伤害，打断本回合蓄力重击。'},mark:{name:'铭火',icon:'♨',cd:4,desc:'90%攻击的火元素伤害，附加5回合火焰灼烧；不受护甲影响。'},ignite:{name:'引燃',icon:'✧',cd:5,desc:'160%攻击的火元素伤害，灼烧目标额外80%攻击；不受护甲影响。'},guard:{name:'坚守',icon:'▣',cd:5,desc:'100%攻击伤害，3回合减伤40%并反击。'}};
Object.assign(SKILLS,{
 warcry:{name:'砧誓战吼',icon:'⚒',cd:7,desc:'攻击提高25%，持续3回合。碎砧2件延长1回合。'},
 ironcoat:{name:'铁衣铭文',icon:'▣',cd:7,desc:'护甲提高40%，持续3回合。守冢2件延长1回合。'},
 blunt:{name:'挫锋打击',icon:'⌁',cd:7,desc:'60%攻击伤害；敌方攻击降低20%，持续3回合。'},
 scorch:{name:'炉蚀刻印',icon:'♨',cd:7,desc:'50%攻击伤害；目标受到铭火、引燃与灼烧伤害提高25%，持续4回合。炉纹2件延长1回合。'},
 delay:{name:'迟滞符',icon:'⌛',cd:8,desc:'重击将至时使用：将本次重击延后1回合，敌人仍普通攻击。同一次重击最多延后一次。'},
 barrier:{name:'铸壁',icon:'▥',cd:8,desc:'获得20%最大生命护盾，持续3回合，不叠加。守冢4件同时获得2回合坚守反击。'},
 mend:{name:'回炉息',icon:'✚',cd:10,desc:'生命低于60%时恢复70%攻击+15生命，基础最多20%最大生命；复苏天赋追加恢复后，总量不超过35%最大生命。'},
 cleanse:{name:'净炉',icon:'✧',cd:7,desc:'仅在有灼烧或虚弱时释放，移除自身灼烧和虚弱。'}
});
export const LOCS=[
 {name:'失落驿道',en:'THE FORSAKEN ROAD',desc:'沿着车辙，追查消失的黑炉商队。',enemy:'灰旗劫掠者',boss:'灰旗首领 · 沃恩',hp:100,atk:9,armor:7,mat:'铁屑',tag:'金属',reward:3,bossGold:20},
 {name:'熄火矿井',en:'THE HOLLOW FORGE',desc:'熔炉已经冷却，矿井深处仍有锤声。',enemy:'失控矿傀',boss:'炉心守卫 · 断铸',hp:170,atk:14,armor:20,mat:'炉火晶',tag:'火焰',reward:5,bossGold:35},
 {name:'旧誓墓园',en:'THE OATHBOUND GRAVES',desc:'破碎盟约的见证者，沉睡于灰冠之下。',enemy:'失誓卫兵',boss:'守誓者 · 莫尔',hp:250,atk:20,armor:12,mat:'誓约残片',tag:'灵魂',reward:8,bossGold:55}
];
export const TALENTS={
 power:{name:'力量',desc:'每点攻击 +3。',icon:'heavy',cap:null},heart:{name:'体魄',desc:'每点生命 +20。',icon:'mend',cap:null},steel:{name:'坚韧',desc:'每点护甲 +3。',icon:'ironcoat',cap:null},
 precision:{name:'精准',desc:'每点命中值 +5。',icon:'mark',cap:10},crit:{name:'锐意',desc:'每点暴击值 +5。',icon:'interrupt',cap:10},critDamage:{name:'重创',desc:'每点暴伤值 +8。',icon:'heavy',cap:null},
 penetration:{name:'破壁',desc:'每点物理穿甲 +2。',icon:'break',cap:null},element:{name:'元素亲和',desc:'每点元素技能增幅 +2；只增强元素伤害，不为物理攻击追加附伤。',icon:'fire',cap:null},elementResist:{name:'元素抗性',desc:'每点六系元素抗性值各 +5；按对应元素降低伤害。',icon:'cleanse',cap:null},
 block:{name:'格挡训练',desc:'每点格挡值 +4，概率减轻30%直接攻击伤害。',icon:'barrier',cap:10},shield:{name:'护盾塑形',desc:'已有技能或词条生成护盾时，每点额外 +4；不自动生成。',icon:'shield',cap:null},healing:{name:'复苏',desc:'每点回炉息在基础恢复后额外 +3，总恢复上限为最大生命35%。',icon:'mend',cap:null},
 resolve:{name:'抗扰',desc:'每5点缩短新受到的灼烧、虚弱1回合，最低1回合。',icon:'ironcoat',cap:10},luck:{name:'幸运',desc:'小幅提高非套装掉落、融合品质及改造普通词条数值；不改变套装与神赐概率，不直接提高特殊词条判定率。',icon:'ring',cap:10}
};
export const DEVELOPMENT_GRANT_ID='v081support';
export function talentPointBudget(s){return s.level-1+(s.bonusTalentPoints??0);}
function validTalents(s){
 if(s.bonusTalentPoints!==undefined&&(!Number.isSafeInteger(s.bonusTalentPoints)||s.bonusTalentPoints<0||s.bonusTalentPoints>1000000))return false;
 if(s.testGrants!==undefined&&(!s.testGrants||typeof s.testGrants!=='object'||Array.isArray(s.testGrants)||!Object.values(s.testGrants).every(x=>x===true)))return false;
 if(s.testGrants?.[DEVELOPMENT_GRANT_ID]&&(s.bonusTalentPoints??0)<30)return false;
 if(!s.talents||typeof s.talents!=='object'||Array.isArray(s.talents))return false;
 if(!['power','heart','steel'].every(k=>Number.isInteger(s.talents[k])&&s.talents[k]>=0))return false;
 return Object.entries(s.talents).every(([key,n])=>Object.hasOwn(TALENTS,key)&&Number.isSafeInteger(n)&&n>=0&&n<=(TALENTS[key].cap??talentPointBudget(s)))&&Object.values(s.talents).reduce((a,b)=>a+b,0)<=talentPointBudget(s);
}
export const CONSUMABLES={memoryFruit:{name:'回忆之果',icon:'memoryfruit',description:'确认洗点时每枚提供10点返还额度。',price:200},reforgeToken:{name:'重铸印记',icon:'reforgeToken',description:'完整重铸消耗1枚；保留旧结果也不返还。',price:120}};
function validConsumables(s){return s.consumables===undefined||(s.consumables&&Number.isSafeInteger(s.consumables.memoryFruit)&&s.consumables.memoryFruit>=0&&s.consumables.memoryFruit<=1e9&&(s.consumables.reforgeToken===undefined||(Number.isSafeInteger(s.consumables.reforgeToken)&&s.consumables.reforgeToken>=0&&s.consumables.reforgeToken<=1e9))&&(s.consumables.refundCredits===undefined||(Number.isSafeInteger(s.consumables.refundCredits)&&s.consumables.refundCredits>=0&&s.consumables.refundCredits<=1e10)));}
export function normalizeTalents(s){
 if(!validTalents(s)||!validConsumables(s))return false;
 for(const key of Object.keys(TALENTS))s.talents[key]??=0;
 s.consumables??={memoryFruit:0};s.consumables.refundCredits??=0;s.consumables.reforgeToken??=0;return true;
}
export function availableTalentPoints(s){return talentPointBudget(s)-Object.values(s.talents).reduce((a,b)=>a+b,0);}
export function spendTalent(s,key,battleActive=false){
 if(s.running||battleActive||!Object.hasOwn(TALENTS,key)||!validTalents(s)||!validConsumables(s)||availableTalentPoints(s)<=0||(TALENTS[key].cap!==null&&(s.talents[key]??0)>=TALENTS[key].cap))return false;
 normalizeTalents(s);s.talents[key]++;capHealth(s);return true;
}
export function getTalentRefundQuote(s,draft){
 if(!validTalents(s)||!validConsumables(s)||!draft||typeof draft!=='object'||Array.isArray(draft))return null;
 const rows=Object.entries(draft);if(!rows.length||!rows.every(([key,n])=>Object.hasOwn(TALENTS,key)&&Number.isSafeInteger(n)&&n>0&&n<=(s.talents[key]??0)))return null;
 const points=rows.reduce((n,[,v])=>n+v,0),creditsBefore=s.consumables?.refundCredits??0,fruitCost=Math.ceil(Math.max(0,points-creditsBefore)/10);
 return {points,fruitCost,creditsBefore,creditsAfter:creditsBefore+fruitCost*10-points};
}
export function commitTalentRefund(s,draft,battleActive=false){
 if(s.running||battleActive)return false;const quote=getTalentRefundQuote(s,draft);
 if(!quote||(s.consumables?.memoryFruit??0)<quote.fruitCost)return false;
 normalizeTalents(s);s.consumables.memoryFruit-=quote.fruitCost;s.consumables.refundCredits=quote.creditsAfter;
 for(const [key,n] of Object.entries(draft))s.talents[key]-=n;capHealth(s);return true;
}
export const AFFIX_DEFS={
 atk:{name:'攻击',suffix:'',min:3,max:8},hp:{name:'生命',suffix:'',min:15,max:40},armor:{name:'护甲',suffix:'',min:2,max:6},
 hit:{name:'命中值',suffix:'',min:5,max:12},crit:{name:'暴击值',suffix:'',min:5,max:15},critDamage:{name:'暴伤值',suffix:'',min:8,max:20},element:{name:'元素技能增幅',suffix:'',min:2,max:7},...ELEMENT_AFFIX_DEFS
};
export const ACTIVE_AFFIX_KEYS=Object.freeze(['atk','hp','armor','hit','crit','critDamage',...Object.keys(ELEMENT_AFFIX_DEFS)]);
// Roll color is derived from the original roll, never from divine gains.
export function affixRollInfo(a){
 const def=AFFIX_DEFS[a?.stat];if(!def)return null;
 const ratio=Math.max(0,Math.min(1,(a.value-def.min)/(def.max-def.min)));
 const tier=Math.min(3,Math.floor(ratio*4));
 return {min:def.min,max:def.max,raw:a.value,tier,color:['#e4e5e7','#69b9f0','#bc8cf2','#f07878'][tier]};
}
export function divineMultiplier(it){return it.divine?.id==='forge-favor'&&it.divine.model==='raw-v1'?1.1:1;}
export const SPECIALS={
 knowledge:{name:'求知',desc:'胜利时5%概率额外获得一次基础战斗经验，不重复触发。'},
 scavenger:{name:'拾荒者',desc:'胜利时10%概率额外获得当前区域材料1份，不重复触发。'},
 shelter:{name:'绝境庇护',desc:'每战一次：来袭伤害将使生命降至30%以下时，生成20%最大生命护盾。'},
 momentum:{name:'余势',desc:'主动攻击击杀后，下一次普攻伤害 +35%。不叠加，败退清除，灼烧和反击不触发。'}
};
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
let serial=0;
const uid=()=>multiItemId()??`${Date.now().toString(36)}-${(++serial).toString(36)}-${Math.random().toString(36).slice(2,7)}`;
const rand=(a,b)=>Math.floor(a+Math.random()*(b-a+1));
const names={weapon:'战锤',helm:'铁盔',armor:'板甲',gloves:'护手',boots:'战靴',ring:'指环',amulet:'护符'};
const bases={weapon:{atk:12,armor:1,hp:5},helm:{atk:1,armor:4,hp:18},armor:{atk:1,armor:8,hp:18},gloves:{atk:3,armor:3,hp:8},boots:{atk:1,armor:4,hp:10},ring:{atk:3,armor:1,hp:8},amulet:{atk:2,armor:1,hp:14}};
function weighted(entries){let roll=Math.random()*entries.reduce((n,[,w])=>n+w,0);for(const [key,w] of entries){roll-=w;if(roll<0)return key;}return entries.at(-1)[0];}
function rollAffixes(quality){const pool=[...ACTIVE_AFFIX_KEYS];const count=quality===0?rand(0,1):quality+1,affixes=[];for(let i=0;i<count;i++){const key=pool.splice(rand(0,pool.length-1),1)[0],def=AFFIX_DEFS[key];affixes.push({stat:key,value:rand(def.min,def.max)});}return affixes;}
export function item(slot,level=1,set=null,rarity=0,levelMetadata={}){
 if(!SLOTS.includes(slot))throw new Error('Unsupported item family');
 rarity=clamp(Math.floor(rarity),0,3);level=Math.max(1,Math.floor(level));
 if(set&&(!SET_SLOTS.includes(slot)||!BUILD.some(b=>b.id===set)))set=null;
 if(set)rarity=3;
 const b=bases[slot],scale=(1+rarity*.1)*(0.92+Math.random()*.16),name=(set?BUILD.find(x=>x.id===set).name+'·':'旅铸·')+names[slot];
 const baseLevel=levelMetadata.baseLevel??level,levelSource=levelMetadata.levelSource??'generated';
 if(!validEquipmentLevelMetadata({baseLevel,levelSource}))throw new RangeError('Invalid equipment level provenance');
 const out={id:uid(),slot,set,rarity,level,baseLevel,levelSource,name,atk:Math.max(1,Math.round(b.atk*scale+level*.7)),armor:Math.max(1,Math.round(b.armor*scale+level*.45)),hp:Math.round(b.hp*scale+level*1.8),affixes:rollAffixes(rarity),special:null,legendaryId:null,locked:false,bless:0};
 if(!set&&rarity>=2&&Math.random()<(rarity===2?.1:.2)){out.special={id:Object.keys(SPECIALS)[rand(0,3)]};}
 let hash=2166136261;for(const ch of out.id){hash^=ch.charCodeAt(0);hash=Math.imul(hash,16777619)>>>0;}
 const template=selectEquipmentTemplate({slot,setId:set,originRace:'dwarf'},()=>hash/2**32);return template?applyEquipmentTemplate(out,template.id):out;
}
export function itemTotals(it,{development=false}={}){const m=divineMultiplier(it),base=enhancedItemBase(it,{development})??it;return {atk:base.atk*m+(it.bless||0)*2,armor:base.armor*m,hp:base.hp*m};}
export function sellValue(it){return [2,4,8,16][it.rarity]+Math.floor(it.level/3);}
// Cost previews are deterministic and never consume random rolls.
function legacyReforgeCost(it,mode){
 if(!it||!Number.isInteger(it.rarity)||it.rarity<0||it.rarity>3||!Array.isArray(it.affixes)||it.affixes.length===0)return null;
 const q=it.rarity;
 if(mode==='value')return {gold:10+5*q,materials:{'铁屑':1}};
 if(mode==='replace')return {gold:25+10*q,materials:{'铁屑':2,'炉火晶':1}};
 if(mode==='all')return {gold:50+20*q,materials:{'铁屑':3,'炉火晶':2}};
 return null;
}
export function getReforgeCost(it,mode){
 const cost=legacyReforgeCost(it,mode);if(!cost)return null;
 return mode==='all'?{gold:0,materials:{},consumables:{reforgeToken:1}}:mode==='replace'?{gold:0,materials:{},equipment:1}:cost;
}
export function eligibleReforgeDonors(s,targetId,index){
 const target=s?.inventory?.find(it=>it.id===targetId);
 if(!target||!Number.isInteger(index)||index<0||index>=target.affixes.length||s.pendingReforge)return [];
 const occupied=new Set(target.affixes.map(a=>a.stat));
 return s.inventory.filter(it=>it.id!==targetId&&!it.locked&&!it.legendaryId&&!Object.values(s.equip).includes(it.id)&&!isProtected(s,it.id)).map(it=>({item:it,affixes:it.affixes.filter(a=>Object.hasOwn(AFFIX_DEFS,a.stat)&&!occupied.has(a.stat))})).filter(x=>x.affixes.length);
}
export function reforge(s,itemId,mode,index,donorId){
 if(!s||!Array.isArray(s.inventory)||s.pendingReforge)return null;
 const it=s.inventory.find(i=>i.id===itemId),cost=getReforgeCost(it,mode);
 if(!cost||!SLOTS.includes(it.slot)||it.affixes.length>Object.keys(AFFIX_DEFS).length||it.affixes.some(a=>!a||typeof a!=='object'))return null;
 if(divineMultiplier(it)>1&&(!it.divine.bonus||typeof it.divine.bonus!=='object'))return null;
 if(new Set(it.affixes.map(a=>a.stat)).size!==it.affixes.length||!it.affixes.every(a=>Object.hasOwn(AFFIX_DEFS,a.stat)&&Number.isInteger(a.value)&&a.value>=AFFIX_DEFS[a.stat].min&&a.value<=AFFIX_DEFS[a.stat].max))return null;
 if(mode!=='all'&&(!Number.isInteger(index)||index<0||index>=it.affixes.length))return null;
 if(mode==='replace'&&!ACTIVE_AFFIX_KEYS.some(stat=>!it.affixes.some(a=>a.stat===stat)))return null;
 if(mode==='all'&&it.affixes.length>ACTIVE_AFFIX_KEYS.length)return null;
 if(!Number.isFinite(s.gold)||s.gold<cost.gold||!validMaterials(s)||!validConsumables(s)||Object.entries(cost.materials).some(([key,n])=>materialCount(s,key,0)<n)||Object.entries(cost.consumables??{}).some(([key,n])=>(s.consumables?.[key]??0)<n))return null;
 const donor=mode==='replace'?eligibleReforgeDonors(s,itemId,index).find(x=>x.item.id===donorId):null;
 if(mode==='replace'&&!donor)return null;
 if(!validCodexCollection(s))return null;
 const before=it.affixes.map(a=>({...a})),after=before.map(a=>({...a}));
 const roll=stat=>({stat,value:luckyRoll(()=>rand(AFFIX_DEFS[stat].min,AFFIX_DEFS[stat].max),s.talents.luck??0)});
 if(mode==='value')after[index]=roll(after[index].stat);
 else if(mode==='replace'){
  const occupied=new Set(after.map(a=>a.stat));
  const pool=[...new Set(donor.affixes.map(a=>a.stat))];
  after[index]=roll(pool[rand(0,pool.length-1)]);
 }else{
  const pool=[...ACTIVE_AFFIX_KEYS];
  for(let i=0;i<after.length;i++)after[i]=roll(pool.splice(rand(0,pool.length-1),1)[0]);
 }
 const oldSpecial=it.special?{...it.special}:null;
 const newSpecial=mode==='all'&&!it.set&&it.rarity>=2&&!it.legendaryId?{id:Object.keys(SPECIALS)[rand(0,Object.keys(SPECIALS).length-1)]}:oldSpecial?{...oldSpecial}:null;
 // Charge once, then persist the choice without modifying the target.
 normalizeMaterials(s);normalizeTalents(s);s.gold-=cost.gold;for(const [key,n] of Object.entries(cost.materials))s.materialStacks[materialKey(key)]-=n;for(const [key,n] of Object.entries(cost.consumables??{}))s.consumables[key]-=n;
 if(donor)normalizeCodexCollection(s);
 if(donor)s.inventory.splice(s.inventory.findIndex(x=>x.id===donor.item.id),1);
 const operationId='reforge-'+Date.now().toString(36)+'-'+(++serial).toString(36);
 s.pendingReforge={ruleVersion:2,operationId,itemId:it.id,mode,index:mode==='all'?null:index,oldAffixes:before,newAffixes:after,oldSpecial,newSpecial,cost,...(donor?{donor:{id:donor.item.id,name:donor.item.name,slot:donor.item.slot,eligibleStats:[...new Set(donor.affixes.map(a=>a.stat))]}}:{})};
 return {item:it,operationId,mode,index:mode==='all'?null:index,cost,before:before.map(a=>({...a})),after:after.map(a=>({...a})),oldSpecial,newSpecial,pending:true};
}
export function validPendingReforge(s){
 const p=s.pendingReforge;if(p===undefined||p===null)return true;
 if(!p||typeof p!=='object'||Array.isArray(p)||typeof p.operationId!=='string'||p.operationId.length<1||p.operationId.length>160)return false;
 if(p.ruleVersion!==undefined&&p.ruleVersion!==2)return false;
 const it=s.inventory?.find(i=>i.id===p.itemId),cost=p.ruleVersion===2?getReforgeCost(it,p.mode):legacyReforgeCost(it,p.mode);
 if(!it||!cost||!p.cost||p.cost.gold!==cost.gold||!p.cost.materials||Object.keys(p.cost.materials).length!==Object.keys(cost.materials).length||!Object.entries(cost.materials).every(([k,v])=>p.cost.materials[k]===v))return false;
 if((p.cost.equipment??0)!==(cost.equipment??0))return false;
 const expectedConsumables=cost.consumables??{},actualConsumables=p.cost.consumables??{};
 if(Object.keys(actualConsumables).length!==Object.keys(expectedConsumables).length||!Object.entries(expectedConsumables).every(([k,v])=>actualConsumables[k]===v))return false;
 if(p.ruleVersion===2){
  if(p.mode==='replace'){
   const d=p.donor;
   if(!d||typeof d.id!=='string'||!d.id||d.id===p.itemId||s.inventory.some(it=>it.id===d.id)||typeof d.name!=='string'||d.name.length>200||!SLOTS.includes(d.slot)||!Array.isArray(d.eligibleStats)||!d.eligibleStats.length||d.eligibleStats.length>4||new Set(d.eligibleStats).size!==d.eligibleStats.length||!d.eligibleStats.every(k=>Object.hasOwn(AFFIX_DEFS,k)&&!it.affixes.some(a=>a.stat===k))||!d.eligibleStats.includes(p.newAffixes?.[p.index]?.stat))return false;
  }else if(p.donor!==undefined)return false;
  const legalSpecial=x=>x===null||(x&&typeof x==='object'&&!Array.isArray(x)&&Object.keys(x).length===1&&Object.hasOwn(SPECIALS,x.id));
  if(!legalSpecial(p.oldSpecial)||!legalSpecial(p.newSpecial)||(p.oldSpecial?.id??null)!==(it.special?.id??null))return false;
  if(p.mode==='all'&&!it.set&&it.rarity>=2&&!it.legendaryId){if(!p.newSpecial)return false;}
  else if((p.oldSpecial?.id??null)!==(p.newSpecial?.id??null))return false;
 }
 const legal=list=>Array.isArray(list)&&list.length===it.affixes.length&&new Set(list.map(a=>a?.stat)).size===list.length&&list.every(a=>a&&Object.hasOwn(AFFIX_DEFS,a.stat)&&Number.isInteger(a.value)&&a.value>=AFFIX_DEFS[a.stat].min&&a.value<=AFFIX_DEFS[a.stat].max);
 const equal=(a,b)=>a.stat===b.stat&&a.value===b.value;
 if(!legal(p.oldAffixes)||!legal(p.newAffixes)||!p.oldAffixes.every((a,i)=>equal(a,it.affixes[i])))return false;
 if(p.mode==='all')return p.index===null&&p.newAffixes.every(a=>ACTIVE_AFFIX_KEYS.includes(a.stat));
 if(!Number.isInteger(p.index)||p.index<0||p.index>=it.affixes.length||!p.newAffixes.every((a,i)=>i===p.index||equal(a,p.oldAffixes[i])))return false;
 return p.mode==='value'?p.newAffixes[p.index].stat===p.oldAffixes[p.index].stat:p.newAffixes[p.index].stat!==p.oldAffixes[p.index].stat&&(p.ruleVersion===2?p.donor.eligibleStats.includes(p.newAffixes[p.index].stat):ACTIVE_AFFIX_KEYS.includes(p.newAffixes[p.index].stat));
}
export function resolveReforge(s,accept,expectedOperationId){
 const p=s?.pendingReforge;
 if(!p||typeof accept!=='boolean'||(expectedOperationId!==undefined&&expectedOperationId!==p.operationId)||!validPendingReforge(s))return null;
 const it=s.inventory.find(i=>i.id===p.itemId);
 if(accept&&Object.values(s.equip).includes(it.id)&&(s.running||(s.activeEncounter&&!s.activeEncounter.done)))return null;
 if(accept){
  it.affixes=p.newAffixes.map(a=>({...a}));
  if(p.ruleVersion===2)it.special=p.newSpecial?{...p.newSpecial}:null;
  if(divineMultiplier(it)>1)it.divine.bonus.affixes=it.affixes.map(a=>({stat:a.stat,value:a.value/10}));
 }
 s.pendingReforge=null;capHealth(s);
 return {item:it,accepted:accept,operationId:p.operationId};
}
export function wardrobeIds(s){
 const ids=new Set();for(const loadout of Array.isArray(s.loadouts)?s.loadouts:[])if(loadout?.equip)for(const id of Object.values(loadout.equip))if(typeof id==='string')ids.add(id);return ids;
}
export function bagItems(s){const ids=wardrobeIds(s);return s.inventory.filter(it=>!ids.has(it.id));}
export function isProtected(s,id){return wardrobeIds(s).has(id)||s.pendingReforge?.itemId===id;}
function validSkillSlots(skills,conditions){
 if(!Array.isArray(skills)||![3,4].includes(skills.length)||!Array.isArray(conditions)||conditions.length!==skills.length)return false;
 const active=skills.filter(k=>k!==null);
 return new Set(active).size===active.length&&skills.every(k=>(skills.length===4&&k===null)||Object.hasOwn(SKILLS,k))&&conditions.every(k=>['always','low','charge','burn'].includes(k));
}
export function normalizeSkillSlots(s){
 const targets=[s,...(Array.isArray(s.loadouts)?s.loadouts.filter(Boolean):[])];
 if(!targets.every(t=>validSkillSlots(t.skills,t.conditions)))return false;
 for(const t of targets)if(t.skills.length===3){t.skills=[...t.skills,null];t.conditions=[...t.conditions,'always'];}
 return true;
}
function validLoadout(s,loadout){
 if(!loadout||typeof loadout.name!=='string'||loadout.name.length<1||loadout.name.length>20||!loadout.equip||Object.keys(loadout.equip).length!==SOCKETS.length)return false;
 if(!SOCKETS.every(k=>loadout.equip[k]===null||s.inventory.some(it=>it.id===loadout.equip[k]&&it.slot===SOCKET_TYPE[k])))return false;
 const ids=Object.values(loadout.equip).filter(Boolean);if(new Set(ids).size!==ids.length)return false;
 return validSkillSlots(loadout.skills,loadout.conditions)&&loadout.skills.every(k=>k===null||skillUnlocked(s,k));
}
function validLoadoutSlots(s){return s.loadouts===undefined||(Array.isArray(s.loadouts)&&s.loadouts.length===3&&s.loadouts.every(l=>l===null||validLoadout(s,l)));}
function projectedLoadouts(s,index,next){
 if(!Number.isInteger(index)||index<0||index>2||!validLoadoutSlots(s))return null;
 const slots=s.loadouts?[...s.loadouts]:[null,null,null];slots[index]=next;
 return slots;
}
export function saveLoadout(s,index,name=''){
 if(typeof name!=='string')return false;
 const snapshot={name:name.trim().slice(0,20)||`方案${index+1}`,equip:{...s.equip},skills:[...s.skills],conditions:[...s.conditions]};
 if(!validLoadout(s,snapshot))return false;
 if(snapshot.skills.length===3){snapshot.skills.push(null);snapshot.conditions.push('always');}
 const slots=projectedLoadouts(s,index,snapshot);if(!slots)return false;s.loadouts=slots;return true;
}
export function deleteLoadout(s,index){const slots=projectedLoadouts(s,index,null);if(!slots)return false;s.loadouts=slots;return true;}
export function applyLoadout(s,index,battleActive=false){
 if(s.running||battleActive||!Number.isInteger(index)||index<0||index>2||!validLoadoutSlots(s))return false;
 const loadout=s.loadouts?.[index];if(!validLoadout(s,loadout))return false;
 s.equip={...loadout.equip};s.skills=[...loadout.skills];s.conditions=[...loadout.conditions];normalizeSkillSlots(s);capHealth(s);return true;
}
export function fresh(){
 const inventory=SOCKETS.map(socket=>{let type=SOCKET_TYPE[socket],it=item(type,1,null,0,{levelSource:'starter'});it.atk=bases[type].atk+1;it.armor=bases[type].armor+1;it.hp=bases[type].hp+2;it.affixes=[];return it;});
 return {version:SCHEMA_VERSION,race:'dwarf',hero:'布洛克',level:1,xp:0,gold:100,location:0,build:'custom',skillRulesVersion:1,skillAccess:{legacyAll:false,notified:['break','mark','guard','interrupt']},inventory,equip:Object.fromEntries(SOCKETS.map((socket,i)=>[socket,inventory[i].id])),skills:['break','mark','guard','interrupt'],conditions:['always','always','always','charge'],materialStacks:{'铁屑|0':5,'炉火晶|0':2,'誓约残片|0':1},offlineLuck:0,talents:Object.fromEntries(Object.keys(TALENTS).map(k=>[k,0])),consumables:{memoryFruit:0,refundCredits:0,reforgeToken:0},potionSlot:{key:null,auto:false,priority:'low',priorityVersion:1},kills:0,normalWins:[0,0,0],bossWins:[0,0,0],bossReady:[0,0,0],stock:3,loadouts:[null,null,null],chapters:[],chronicle:['灰冠历317年：你带着旧炉装备，离开黑炉堡寻找失踪商队。'],momentum:0,lastSeen:Date.now(),running:false};
}
export function equipItem(s,id,socket){
 const it=s.inventory.find(i=>i.id===id);if(!it)return false;
 if(!socket){if(it.slot==='ring'){socket=!s.equip.ring1?'ring1':!s.equip.ring2?'ring2':'ring1';}else socket=it.slot;}
 if(!SOCKETS.includes(socket)||SOCKET_TYPE[socket]!==it.slot)return false;
 for(const k of SOCKETS)if(k!==socket&&s.equip[k]===id){if(it.slot==='ring')s.equip[k]=s.equip[socket]??null;else return false;}
 s.equip[socket]=id;capHealth(s);return true;
}
export function stats(s){
 const ids=[...new Set(Object.values(s.equip).filter(Boolean))],gear=ids.map(id=>s.inventory.find(i=>i.id===id)).filter(Boolean),count={},specials={};
 let atk=14+s.level*3+s.talents.power*3+potionBuffStrength(s,'strength'),armor=5+s.level+s.talents.steel*3,hp=120+s.level*14+s.talents.heart*20;
 const bonus=Object.fromEntries(Object.keys(AFFIX_DEFS).map(k=>[k,0]));
 for(const it of gear){const totals=itemTotals(it,{development:s.developmentEquipmentSandbox===true});atk+=totals.atk;armor+=totals.armor;hp+=totals.hp;if(it.set)count[it.set]=(count[it.set]||0)+1;if(it.special)specials[it.special.id]=true;for(const a of it.affixes)bonus[a.stat]+=a.value*divineMultiplier(it);}
 bonus.hit+=(s.talents.precision??0)*5;bonus.crit+=(s.talents.crit??0)*5;bonus.critDamage+=(s.talents.critDamage??0)*8;bonus.element+=(s.talents.element??0)*2;
 atk=Math.round(atk+bonus.atk);armor=Math.round(armor+bonus.armor);hp=Math.round(hp+bonus.hp);
 const ratingFactor=r=>Math.max(0,r)/(100+Math.max(0,r));
 const elementAttack=Object.fromEntries(ELEMENT_KEYS.map(k=>[k,bonus.element+(bonus[k+'Atk']??0)]));
 const elementResistance=Object.fromEntries(ELEMENT_KEYS.map(k=>[k,(s.talents.elementResist??0)*5+(bonus[k+'Resist']??0)+(k==='fire'?potionBuffStrength(s,'fireResist'):0)]));
 return {atk,armor,hp,penetration:(s.talents.penetration??0)*2,elementAttack,elementResistance,elementResist:.5*ratingFactor(elementResistance.fire),block:.35*ratingFactor((s.talents.block??0)*4),shieldBonus:(s.talents.shield??0)*4,healingBonus:(s.talents.healing??0)*3,resolveReduction:Math.floor((s.talents.resolve??0)/5),luck:s.talents.luck??0,hit:clamp(.9+.1*ratingFactor(bonus.hit),.5,.995),crit:clamp(.05+.55*ratingFactor(bonus.crit),0,.6),critDamage:clamp(1.5+ratingFactor(bonus.critDamage),1.5,2.5),element:bonus.element,hitRating:bonus.hit,critRating:bonus.crit,critDamageRating:bonus.critDamage,count,specials,legend:false,bonus};
}
export function preset(s,id){const b=BUILD.find(x=>x.id===id);if(!b||!b.skills.every(k=>k===null||skillUnlocked(s,k)))return null;s.build=id;s.skills=[...b.skills];s.conditions=['always','always','charge','always'];return b;}
export const POTIONS={
 healing:{name:'治疗药剂',icon:'potionHeal',desc:'按品质恢复10% / 15% / 20% / 25%最大生命。'},
 strength:{name:'力量药剂',icon:'potionPower',desc:'按品质攻击 +10 / +15 / +20 / +25，持续5分钟。同品质续时，高品质替换强度与时间，低品质不可覆盖。'},
 fireResist:{name:'火抗药剂',icon:'potionFireResist',desc:'按品质火焰抗性值 +30 / +40 / +50 / +60，持续5分钟。同品质续时，高品质替换强度与时间，低品质不可覆盖。'}
};
// Only the fixed-quality healing recipe is approved; other identities stay reserved.
export const RECIPES={
 'potion-healing':{id:'potion-healing',name:'治疗药剂配方',potionType:'healing',icon:'potionHeal',ingredients:[{functionalTag:'recoveryBase',count:1}],functionalTag:'recoveryBase',price:45,craftGoldByQuality:RECOVERY_RECIPE_CONFIG.coinCosts,craftGold:null,enabled:true},
 'potion-strength':{id:'potion-strength',name:'力量药剂配方',potionType:'strength',icon:'potionPower',ingredients:[],price:null,craftGold:null,enabled:false},
 'potion-fireResist':{id:'potion-fireResist',name:'火抗药剂配方',potionType:'fireResist',icon:'potionFireResist',ingredients:[],price:null,craftGold:null,enabled:false}
};
function validRecipes(s){return s.learnedRecipes===undefined||(Array.isArray(s.learnedRecipes)&&s.learnedRecipes.length<=Object.keys(RECIPES).length&&new Set(s.learnedRecipes).size===s.learnedRecipes.length&&s.learnedRecipes.every(id=>Object.hasOwn(RECIPES,id)));}
export function recipeKnown(s,id){return Object.hasOwn(RECIPES,id)&&Array.isArray(s.learnedRecipes)&&s.learnedRecipes.includes(id);}
export function normalizeRecipes(s){
 if(!validRecipes(s))return false;s.learnedRecipes??=[];
 for(const offer of s.merchant?.offers??[])if(offer.type==='recipe'&&recipeKnown(s,offer.recipeId))offer.stock=0;
 return true;
}
export function learnRecipe(s,id){
 if(!Object.hasOwn(RECIPES,id)||!RECIPES[id].enabled||!validRecipes(s)||recipeKnown(s,id))return false;
 normalizeRecipes(s);s.learnedRecipes.push(id);for(const offer of s.merchant?.offers??[])if(offer.type==='recipe'&&offer.recipeId===id)offer.stock=0;return true;
}
export function eligibleRecoveryMaterials(s,quality){return materialEntries(s).filter(row=>row.quality===quality&&MATERIALS[row.material]?.functionalTags?.includes('recoveryBase'));}
export function quoteRecoveryRecipe(s,quality,inputs){
 if(s.pendingForgeClaim||!RECIPES['potion-healing'].enabled||!recipeKnown(s,'potion-healing')||!validRecipes(s)||!validMaterials(s)||!validPotions(s))return null;
 const quote=recoveryInputPlan(quality,inputs,MATERIALS);if(!quote||!Number.isFinite(s.gold)||s.gold<quote.gold)return null;
 for(const row of quote.inputs){const p=parseMaterialKey(row.key);if(!p||materialCount(s,p.material,p.quality)<row.quantity)return null;}
 return quote;
}
export function craftRecoveryRecipe(s,quote){
 if(!quote||typeof quote!=='object'||Array.isArray(quote)||Object.keys(quote).length!==5)return null;
 const actual=quoteRecoveryRecipe(s,quote.quality,quote.inputs);
 if(!actual||quote.recipeId!==actual.recipeId||quote.quantity!==actual.quantity||quote.gold!==actual.gold)return null;
 normalizeMaterials(s);normalizePotions(s);for(const row of actual.inputs)s.materialStacks[row.key]-=row.quantity;s.gold-=actual.gold;
 const key=potionKey('healing',actual.quality),result={kind:'potion',potionType:'healing',quality:actual.quality,name:POTIONS.healing.name,quantity:actual.quantity,key,recipeId:actual.recipeId};
 if(canReceiveItem(s,key,result.quantity))s.potionStacks[key]=(s.potionStacks[key]??0)+result.quantity;else s.pendingForgeClaim={kind:'potion',potion:result};
 return result;
}
export function craftRecipe(s,id,selection,targetQuality=0){
 if(id==='potion-healing'&&RECIPES[id].functionalTag==='recoveryBase')return craftRecoveryRecipe(s,quoteRecoveryRecipe(s,targetQuality,selection));
 if(s.pendingForgeClaim||!Object.hasOwn(RECIPES,id)||!RECIPES[id].enabled||!recipeKnown(s,id)||!validRecipes(s)||!validMaterials(s)||!validPotions(s)||!Array.isArray(selection)||selection.length<1||selection.length>5)return null;
 const recipe=RECIPES[id];if(!Number.isSafeInteger(recipe.craftGold)||recipe.craftGold<0||!Number.isFinite(s.gold)||s.gold<recipe.craftGold)return null;
 const selected={},stacks={},parsed=[];for(const key of selection){const row=parseMaterialKey(key);if(!row)return null;parsed.push(row);selected[row.material]=(selected[row.material]??0)+1;stacks[row.key]=(stacks[row.key]??0)+1;}
 if(Object.keys(selected).length!==recipe.ingredients.length||!recipe.ingredients.every(r=>selected[r.material]===r.count)||parsed.some(r=>materialCount(s,r.material,r.quality)<stacks[r.key]))return null;
 const quality=luckyRoll(()=>rollQuality(fusionQualityWeights(selection)),s.talents.luck??0),type=recipe.potionType,key=potionKey(type,quality);
 normalizeMaterials(s);normalizePotions(s);for(const [key,n] of Object.entries(stacks))s.materialStacks[key]-=n;s.gold-=recipe.craftGold;
 const result={kind:'potion',potionType:type,quality,name:POTIONS[type].name,quantity:1,key,recipeId:id};if(canReceiveItem(s,key))s.potionStacks[key]=(s.potionStacks[key]??0)+1;else s.pendingForgeClaim={kind:'potion',potion:result};return result;
}
export const POTION_DURATION_MS=300000,POTION_COOLDOWN_MS=10000;
// Same-quality doses extend time; stronger doses replace both potency and time.
export const POTION_QUALITY_EFFECTS=[0,1,2,3].map(quality=>({heal:[.10,.15,.20,.25][quality],durationMs:300000,attack:10+5*quality,resistance:30+10*quality}));
function potionBuff(s,type){const b=s.potionBuffs?.[type];return typeof b==='number'?{quality:0,endAt:b}:b??{quality:0,endAt:0};}
function potionBuffStrength(s,type){const b=potionBuff(s,type);if(b.endAt<=(s.lastHealthClock??0))return 0;return type==='strength'?POTION_QUALITY_EFFECTS[b.quality].attack:POTION_QUALITY_EFFECTS[b.quality].resistance;}
export function potionEffect(type,quality=0){if(!Number.isInteger(quality)||quality<0||quality>3)return null;const effect=POTION_QUALITY_EFFECTS[quality];return Object.hasOwn(POTIONS,type)&&effect?{healFraction:type==='healing'?effect.heal:0,durationMs:type==='healing'?0:effect.durationMs,attack:type==='strength'?effect.attack:0,resistance:type==='fireResist'?effect.resistance:0}:null;}
export function potionKey(type,quality=0){return Object.hasOwn(POTIONS,type)&&Number.isInteger(quality)&&quality>=0&&quality<=3?`${type}|${quality}`:null;}
export function parsePotionKey(value){
 if(typeof value!=='string')return null;if(Object.hasOwn(POTIONS,value))return {type:value,quality:0,key:potionKey(value)};
 const parts=value.split('|');if(parts.length!==2||!['0','1','2','3'].includes(parts[1]))return null;const key=potionKey(parts[0],Number(parts[1]));return key?{type:parts[0],quality:Number(parts[1]),key}:null;
}
function validPotions(s){
 const count=n=>Number.isSafeInteger(n)&&n>=0&&n<=1e9,time=n=>Number.isFinite(n)&&n>=0&&n<=1e15;
 const stacks=s.potionStacks===undefined?(s.potions===undefined||(s.potions&&typeof s.potions==='object'&&!Array.isArray(s.potions)&&Object.keys(s.potions).every(k=>Object.hasOwn(POTIONS,k)&&count(s.potions[k])))):(s.potions===undefined&&s.potionStacks&&typeof s.potionStacks==='object'&&!Array.isArray(s.potionStacks)&&Object.entries(s.potionStacks).every(([k,n])=>parsePotionKey(k)?.key===k&&count(n)));
 const selected=s.potionSlot?.key??s.potionSlot?.type??null;
 return stacks&&(s.potionSlot===undefined||(s.potionSlot&&(selected===null||parsePotionKey(selected))&&typeof s.potionSlot.auto==='boolean'&&(s.potionSlot.priorityVersion===undefined?s.potionSlot.priority===undefined:s.potionSlot.priorityVersion===1&&['low','high'].includes(s.potionSlot.priority))))&&(s.potionReadyAt===undefined||time(s.potionReadyAt))&&(s.potionBuffs===undefined||(s.potionBuffs&&typeof s.potionBuffs==='object'&&!Array.isArray(s.potionBuffs)&&['strength','fireResist'].every(type=>{const b=s.potionBuffs[type];return b===undefined||time(b)||(b&&Number.isInteger(b.quality)&&b.quality>=0&&b.quality<=3&&time(b.endAt));})));
}
export function normalizePotions(s){
 if(!validPotions(s))return false;if(s.potionStacks===undefined){s.potionStacks=Object.fromEntries(Object.entries(s.potions??{}).map(([type,n])=>[potionKey(type),n]));delete s.potions;}
 const selected=s.potionSlot?.key??s.potionSlot?.type??null;const priority=s.potionSlot?.priorityVersion===1?s.potionSlot.priority:(parsePotionKey(selected)?.quality??0)>=2?'high':'low';s.potionSlot={key:selected===null?null:parsePotionKey(selected).key,auto:s.potionSlot?.auto??false,priority,priorityVersion:1};s.potionReadyAt??=0;s.potionBuffs??={};for(const type of ['strength','fireResist']){const b=s.potionBuffs[type];if(typeof b==='number'||b===undefined)s.potionBuffs[type]={quality:0,endAt:b??0};}return true;
}
export function potionCount(s,type,quality=0){return s.potionStacks?.[potionKey(type,quality)]??(quality===0?s.potions?.[type]??0:0);}
export function potionEntries(s){return Object.keys(POTIONS).flatMap(type=>[0,1,2,3].map(quality=>({key:potionKey(type,quality),type,quality,count:potionCount(s,type,quality)}))).filter(x=>x.count>0);}
export function equipPotion(s,key){const parsed=key===null?null:parsePotionKey(key);if((key!==null&&!parsed)||!normalizePotions(s))return false;s.potionSlot.key=parsed?.key??null;return true;}
export function setPotionAuto(s,enabled){if(typeof enabled!=='boolean'||!normalizePotions(s))return false;s.potionSlot.auto=enabled;return true;}
export function resolvePotionKey(s,now=Date.now(),priority=s.potionSlot?.priority??((parsePotionKey(s.potionSlot?.key)?.quality??0)>=2?'high':'low')){
 if(!['low','high'].includes(priority))return null;const selected=parsePotionKey(s.potionSlot?.key??s.potionSlot?.type);if(!selected)return null;
 const clock=Math.max(now,s.lastHealthClock??0),buff=potionBuff(s,selected.type);
 const qualities=priority==='high'?[3,2,1,0]:[0,1,2,3];
 const quality=qualities.find(q=>potionCount(s,selected.type,q)>0&&(selected.type==='healing'||buff.endAt<=clock||q>=buff.quality));
 return quality===undefined?null:potionKey(selected.type,quality);
}
export function setPotionPriority(s,priority){if(!['low','high'].includes(priority)||!normalizePotions(s))return false;s.potionSlot.priority=priority;return true;}
export function drinkPotion(s,key=undefined,now=Date.now(),battle=s.activeEncounter??null){
 if(key===undefined)key=resolvePotionKey(s,now);

 const parsed=parsePotionKey(key);if(!parsed||!POTION_QUALITY_EFFECTS[parsed.quality]||!validPotions(s)||!normalizeHealth(s,now))return false;settleRest(s,now);
 const {type,quality}=parsed,effect=POTION_QUALITY_EFFECTS[quality],clock=s.lastHealthClock;if(s.restUntil>0||s.heroHp<=0||(s.potionReadyAt??0)>clock||potionCount(s,type,quality)<1)return false;
 const max=stats(s).hp;if(type==='healing'&&s.heroHp>=max)return false;
 const current=potionBuff(s,type),active=current.endAt>clock;if(type!=='healing'&&active&&quality<current.quality)return false;
 const end=type==='healing'?0:(active&&quality===current.quality?current.endAt:clock)+effect.durationMs;if(end>1e15||clock+POTION_COOLDOWN_MS>1e15)return false;
 normalizePotions(s);s.potionStacks[parsed.key]--;s.potionReadyAt=clock+POTION_COOLDOWN_MS;
 if(type==='healing'){s.heroHp=Math.min(max,s.heroHp+max*effect.heal);if(battle&&!battle.done)battle.heroHp=s.heroHp;}
 else s.potionBuffs[type]={quality,endAt:end};
 return true;
}
export function autoDrinkPotion(s,battle=s.activeEncounter??null,now=Date.now()){
 if(!s.potionSlot?.auto||!s.potionSlot.key)return false;const parsed=parsePotionKey(s.potionSlot.key);if(!parsed)return false;const {type}=parsed,clock=Math.max(now,s.lastHealthClock??0);
 if(type==='healing'&&s.heroHp>stats(s).hp*.4)return false;
 if(type!=='healing'&&potionBuff(s,type).endAt>clock)return false;
 return drinkPotion(s,undefined,now,battle);
}
function capHealth(s){if(s.heroHp!==undefined){s.heroHp=Math.min(s.heroHp,stats(s).hp);if(s.activeEncounter&&!s.activeEncounter.done)s.activeEncounter.heroHp=Math.min(s.activeEncounter.heroHp,s.heroHp);}}
export const REST_DURATION_MS=5*60*1000;
export function validAreaProgress(s){
 if(s.areaProgress===undefined)return true;
 const progress=s.areaProgress;
 if(!progress||typeof progress!=='object'||Array.isArray(progress)||Object.keys(progress).length!==RACE_KEYS.length)return false;
 return RACE_KEYS.every(race=>{
  const p=progress[race];if(!p||!Array.isArray(p.unlocked)||!Array.isArray(p.cleared)||p.unlocked.length>10||p.cleared.length>10)return false;
  if(!p.unlocked.every((n,i)=>Number.isInteger(n)&&n===i+1)||!p.cleared.every((n,i)=>Number.isInteger(n)&&n===i+1))return false;
  if(p.cleared.some(n=>!p.unlocked.includes(n)))return false;
  if(race==='dwarf'&&!p.unlocked.length)return false;
  // No unreleased race has an entry point yet. Opening one requires actual content.
  if(p.unlocked.length&&!Object.values(AREAS).some(a=>a.race===race))return false;
  return !p.unlocked.length?p.cleared.length===0:p.unlocked.length===Math.min(p.cleared.length+1,10);
 });
}
export function normalizeAreaProgress(s){
 if(!validAreaProgress(s))return false;
 s.areaProgress??=Object.fromEntries(RACE_KEYS.map(race=>[race,{unlocked:race==='dwarf'?[1]:[],cleared:[]}]));
 return true;
}
export function getAreaProgress(s,race='dwarf'){
 if(!RACE_KEYS.includes(race)||!validAreaProgress(s))return null;
 const p=s.areaProgress?.[race]??{unlocked:race==='dwarf'?[1]:[],cleared:[]};
 return {unlocked:[...p.unlocked],cleared:[...p.cleared]};
}
export function getMerchantEquipmentLevelRange(s){
 if(!validAreaProgress(s))return null;
 const highest=Math.max(1,...RACE_KEYS.flatMap(r=>getAreaProgress(s,r).unlocked));
 return areaLevelRange(highest);
}
function recordDungeonAreaClear(s,e){
 const instance=INSTANCES[e.instanceId],area=AREAS[instance?.areaId],run=s.dungeonRun;
 if(!instance?.enabled||instance.kind!=='dungeon'||!area||e.areaId!==area.id||e.kind!=='dungeon'||e.dungeonStage!==3||!e.done||!e.win||s.activeEncounter!==e||run?.instanceId!==e.instanceId||run?.runId!==e.runId||run?.stage!==3||!normalizeAreaProgress(s))return false;
 const p=s.areaProgress[area.race],number=area.number;
 if(!p.unlocked.includes(number)||p.cleared.includes(number))return false;
 p.cleared.push(number);p.cleared.sort((a,b)=>a-b);
 if(number<10&&!p.unlocked.includes(number+1))p.unlocked.push(number+1);
 return true;
}
export function validExpeditionState(s){
 const ex=s.expedition,cd=s.instanceCooldowns;
 if(s.dungeonRun?.carry!==undefined&&(!validDungeonCarry(s.dungeonRun.carry,SKILLS)||s.dungeonRun.stage===1||s.activeEncounter))return false;
 if(cd!==undefined&&(!cd||typeof cd!=='object'||Array.isArray(cd)||!Object.entries(cd).every(([id,t])=>Object.hasOwn(INSTANCES,id)&&INSTANCES[id].kind!=='field'&&Number.isFinite(t)&&t>=0&&t<=1e15+1800000)))return false;
 if(s.dungeonRun!==undefined&&s.dungeonRun!==null&&(!s.dungeonRun||INSTANCES[s.dungeonRun.instanceId]?.kind!=='dungeon'||typeof s.dungeonRun.runId!=='string'||s.dungeonRun.runId.length>160||!Number.isInteger(s.dungeonRun.stage)||s.dungeonRun.stage<1||s.dungeonRun.stage>3))return false;
 if(ex!==undefined&&(!ex||typeof ex!=='object'||!['field','dungeon'].includes(ex.mode)||typeof ex.loop!=='boolean'||INSTANCES[ex.fieldId]?.kind!=='field'||(ex.targetInstanceId!==null&&INSTANCES[ex.targetInstanceId]?.kind!=='dungeon')))return false;
 return s.siteId===undefined||!!resolveLegacySite(s.siteId);
}
export function normalizeExpedition(s){
 if(!validExpeditionState(s)||!normalizeAreaProgress(s))return false;
 const site=resolveLegacySite(s.siteId??s.location);if(!site)return false;
 s.siteId??=site.id;
 s.expedition??={mode:'field',targetInstanceId:null,fieldId:site.id+'-field',loop:false};
 s.instanceCooldowns??={};
 for(const site of SITES){const ready=s.bossReady?.[site.legacyIndex]??0;if(ready>0)s.instanceCooldowns[site.id+'-boss']=Math.max(s.instanceCooldowns[site.id+'-boss']??0,ready);}
 const e=s.activeEncounter;
 if(e){const oldSite=resolveLegacySite(e.location);if(!oldSite)return false;e.siteId??=oldSite.id;e.areaId??=oldSite.areaId;e.kind??=e.boss?'boss':'field';e.instanceId??=oldSite.id+(e.boss?'-boss':'-field');}
 return true;
}
export function nextEncounterRoute(s,now=Date.now()){
 return pickRoute(s.expedition??{mode:'field',fieldId:resolveLegacySite(s.location)?.id+'-field',targetInstanceId:null,loop:false},s.instanceCooldowns??{},now);
}
export function configureExpedition(s,config){
 if(s.running||(s.activeEncounter&&!s.activeEncounter.rewarded)||s.dungeonRun||!config)return false;
 const candidate={mode:config.mode,targetInstanceId:config.targetInstanceId??null,fieldId:config.fieldId,loop:config.loop};
 if(!validExpeditionState({...s,expedition:candidate})||(candidate.mode==='dungeon'&&!INSTANCES[candidate.targetInstanceId]?.enabled))return false;
 if(!normalizeExpedition(s))return false;s.expedition=candidate;return true;
}
export function setExpeditionLoop(s,enabled){
 if(typeof enabled!=='boolean'||!normalizeExpedition(s))return false;
 s.expedition.loop=enabled;
 if(!enabled&&s.restUntil>0&&s.expedition.mode==='dungeon'){s.restResume=false;s.running=false;}
 return true;
}
export function startRoutedEncounter(s,now=Date.now()){
 if(!normalizeExpedition(s))return null;
 if(s.activeEncounter&&!s.activeEncounter.rewarded)return normalizeEncounterElements(s.activeEncounter);
 if(s.dungeonRun)return startInstanceEncounter(s,s.dungeonRun.instanceId,now);
 const route=nextEncounterRoute(s,now);return route?startInstanceEncounter(s,route.id,now):null;
}
export function normalizeEncounterElements(e){
 if(!e)return e;
 const tags=e.location===1?['earth','fire']:e.location===2?['dark']:[];
 if(e.heroBurnPower===undefined)e.heroBurnPower=e.heroBurn>0?Math.max(2,Math.round(e.atk*.05)):0;
 e.elementTags??=tags;
 e.elementResistance??=Object.fromEntries(ELEMENT_KEYS.map(k=>[k,tags.includes(k)?(e.boss?12:8):0]));
 return e;
}
function validEncounter(e){
 if(e===undefined||e===null)return true;
 if(!validMultiEncounter(e,INSTANCES))return false;
 const number=(n,max=1e12)=>Number.isFinite(n)&&n>=0&&n<=max;
 if(e.kind==='dungeon'&&(!Number.isInteger(e.dungeonStage)||e.dungeonStage<1||e.dungeonStage>3||typeof e.runId!=='string'||!e.runId||e.runId.length>160||e.boss))return false;
 if(e.lootSummary!==undefined&&!validLootSummary(e.lootSummary))return false;
 if(e.instanceId!==undefined&&(!Object.hasOwn(INSTANCES,e.instanceId)||e.kind!==INSTANCES[e.instanceId].kind||e.siteId!==INSTANCES[e.instanceId].siteId||e.areaId!==INSTANCES[e.instanceId].areaId||resolveLegacySite(e.location)?.id!==e.siteId))return false;
 if(e.instanceId===undefined&&['siteId','areaId','kind'].some(k=>e[k]!==undefined))return false;
 if(e.elementTags!==undefined&&(!Array.isArray(e.elementTags)||e.elementTags.length>6||new Set(e.elementTags).size!==e.elementTags.length||!e.elementTags.every(k=>ELEMENT_KEYS.includes(k))))return false;
 if(e.elementResistance!==undefined&&(!e.elementResistance||typeof e.elementResistance!=='object'||Array.isArray(e.elementResistance)||Object.keys(e.elementResistance).length!==6||!ELEMENT_KEYS.every(k=>number(e.elementResistance[k]))))return false;
 if(!e||typeof e!=='object'||Array.isArray(e)||![0,1,2].includes(e.location)||typeof e.name!=='string'||e.name.length>100||typeof e.boss!=='boolean'||typeof e.done!=='boolean'||typeof e.rewarded!=='boolean')return false;
 if(!['hp','max','atk','armor','heroHp','round','burn','broken','guard','stun','shield'].every(k=>number(e[k])))return false;
 if(!e.cd||typeof e.cd!=='object'||Array.isArray(e.cd)||!Object.entries(e.cd).every(([k,n])=>Object.hasOwn(SKILLS,k)&&number(n,100)))return false;
 if(!['warcry','ironcoat','blunt','scorch','barrier','barrierShield','heroBurn','heroBurnPower','weakness','nextHeavy','luck'].every(k=>e[k]===undefined||number(e[k])))return false;
 if((e.win!==undefined&&typeof e.win!=='boolean')||(e.heavyDelayed!==undefined&&typeof e.heavyDelayed!=='boolean')||typeof e.shelterUsed!=='boolean')return false;
 if(![null,'active','burn','counter'].includes(e.killSource))return false;
 return (e.rewardNotes===undefined||(Array.isArray(e.rewardNotes)&&e.rewardNotes.length<=20&&e.rewardNotes.every(t=>typeof t==='string'&&t.length<=300)))&&(e.materialLoot===undefined||(Array.isArray(e.materialLoot)&&e.materialLoot.length<=12&&e.materialLoot.every(l=>parseMaterialKey(l.key)?.key===l.key&&number(l.count,100))));
}
function validHealth(s){
 const keys=['heroHp','restUntil','lastHealthClock'];if(keys.every(k=>s[k]===undefined))return true;
 return Number.isFinite(s.heroHp)&&s.heroHp>=0&&s.heroHp<=1e12&&Number.isFinite(s.restUntil)&&s.restUntil>=0&&s.restUntil<=1e15+REST_DURATION_MS&&Number.isFinite(s.lastHealthClock)&&s.lastHealthClock>=0&&s.lastHealthClock<=1e15;
}
export function normalizeHealth(s,now=Date.now()){
 if(!Number.isFinite(now)||now<0||now>1e15||!validHealth(s))return false;
 const max=stats(s).hp;
 if(s.heroHp===undefined){s.heroHp=max;s.restUntil=0;s.lastHealthClock=now;}
 else{capHealth(s);s.lastHealthClock=Math.max(s.lastHealthClock,now);}
 return true;
}
export function settleRest(s,now=Date.now()){
 if(!normalizeHealth(s,now))return false;
 if(s.restUntil>0&&s.lastHealthClock>=s.restUntil){s.heroHp=stats(s).hp;s.restUntil=0;s.running=!!s.running&&!!s.restResume;s.restResume=false;s.nextActionAt=s.lastHealthClock;return true;}
 return false;
}
export function startRest(s,now=Date.now(),resume=false){
 if(!normalizeHealth(s,now))return false;
 if(s.restUntil>0)return false;
 s.restUntil=s.lastHealthClock+REST_DURATION_MS;s.activeEncounter=null;s.dungeonRun=null;s.restResume=!!resume;s.running=!!resume;s.nextActionAt=s.restUntil;return true;
}
export function canStartEncounter(s,now=Date.now()){
 if(!normalizeHealth(s,now))return false;settleRest(s,now);
 if(s.heroHp<=0&&s.restUntil===0)startRest(s,now);
 return s.restUntil===0&&s.heroHp>0&&s.lastHealthClock>=(s.nextBattleAt??0);
}
export function encounter(s,boss=false,now=Date.now()){
 if(s.activeEncounter&&!s.activeEncounter.rewarded)return normalizeEncounterElements(s.activeEncounter);
 const site=resolveLegacySite(s.location);
 return boss?startInstanceEncounter(s,site.id+'-boss',now):startRoutedEncounter(s,now);
}
export function startInstanceEncounter(s,instanceId,now=Date.now()){
 const instance=INSTANCES[instanceId];if(!instance?.enabled||!canStartEncounter(s,now)||!normalizeExpedition(s))return null;
 if(s.activeEncounter&&!s.activeEncounter.rewarded)return s.activeEncounter.instanceId===instanceId?s.activeEncounter:null;
 if(s.dungeonRun&&s.dungeonRun.instanceId!==instanceId)return null;
 if(instance.kind!=='field'&&!s.dungeonRun&&s.lastHealthClock<(s.instanceCooldowns[instanceId]??0))return null;
 const site=resolveLegacySite(instance.siteId);s.location=site.legacyIndex;s.siteId=site.id;
 if(instance.kind==='dungeon'&&!s.dungeonRun){s.dungeonRun={instanceId,runId:'run-'+Date.now().toString(36)+'-'+(++serial).toString(36),stage:1};s.expedition={...s.expedition,mode:'dungeon',targetInstanceId:instanceId};s.running=true;}
 const boss=instance.kind==='boss',stage=s.dungeonRun?.stage,elite=instance.kind==='dungeon'&&stage===3,l=LOCS[s.location],st=stats(s);
 const e={location:s.location,siteId:site.id,areaId:site.areaId,instanceId,kind:instance.kind,...(instance.kind==='dungeon'?{dungeonStage:stage,runId:s.dungeonRun.runId}:{}),luck:st.luck,boss,name:boss?l.boss:elite?l.enemy+' · 精英':l.enemy,hp:l.hp*(boss?4:elite?1.8:1),max:l.hp*(boss?4:elite?1.8:1),atk:l.atk*(boss?1.65:elite?1.25:1),armor:l.armor*(boss?1.3:1),heroHp:s.heroHp,round:0,nextHeavy:4,heavyDelayed:false,warcry:0,ironcoat:0,blunt:0,scorch:0,barrier:0,barrierShield:0,heroBurn:0,heroBurnPower:0,weakness:0,burn:0,broken:0,guard:0,stun:0,cd:{},shelterUsed:false,shield:0,done:false,rewarded:false,killSource:null};
 if(instance.kind==='dungeon'&&s.dungeonRun.carry){applyDungeonPlayerState(e,s.dungeonRun.carry);delete s.dungeonRun.carry;}
 normalizeEncounterElements(e);s.activeEncounter=e;s.nextActionAt=s.lastHealthClock+1100;recordEncounteredMonsters(s,e);return e;
}

// Explicit developer entry: callers isolate the supplied save; no production random trigger.
export function startDeveloperGroup(s,options={},now=Date.now()){
 const {count=2,seed=1,profiles=[]}=options;
 if(!Number.isSafeInteger(now)||now<0||!Number.isSafeInteger(s.lastHealthClock??now)||![2,3].includes(count)||!Number.isInteger(seed)||seed<0||seed>0xffffffff||!Array.isArray(profiles)||profiles.length>count||!profiles.every(validMultiProfile)||options.scopeOverrides||s.activeEncounter&&!s.activeEncounter.rewarded||s.dungeonRun)return null;
 if(!canStartEncounter(s,now)||!normalizeExpedition(s))return null;
 const site=resolveLegacySite(s.location),instance=INSTANCES[site.id+'-field'],l=LOCS[s.location],st=stats(s),id='dev-'+Math.floor(now)+'-'+seed;
 const e={location:s.location,siteId:site.id,areaId:site.areaId,instanceId:instance.id,kind:'field',luck:st.luck,boss:false,heroHp:s.heroHp,round:0,warcry:0,ironcoat:0,barrier:0,barrierShield:0,heroBurn:0,heroBurnPower:0,weakness:0,guard:0,cd:{},shelterUsed:false,shield:0,done:false,rewarded:false,killSource:null,multiVersion:1,developmentFixture:true,id,rngState:seed,rngDraws:0,itemSerial:0,summonSerial:0,activeCastCount:0,enemies:[]};
 for(let i=0;i<count;i++){const u=normalizeEncounterElements(makeMultiUnit(id+'-enemy-'+i,s.location,instance.id,l,s.lastHealthClock,profiles[i]??{}));u.main=i===0;e.enemies.push(u);}
 e.targetId=e.enemies[0].id;syncMultiTarget(e);s.activeEncounter=e;s.running=true;s.nextActionAt=s.lastHealthClock+1100;return e;
}
export function setMultiPaused(s,paused,now=Date.now()){return pauseMulti(s,paused,now);}
export function setCombatTarget(s,id){return s.activeEncounter?.multiVersion===1?selectMultiTarget(s.activeEncounter,id):false;}
export function combatTargets(e,now){return e?.multiVersion===1?multiTargetRows(e,now):[];}
export function queueDeveloperAction(s,action){const e=s.activeEncounter;if(e?.multiVersion!==1||!e.developmentFixture||e.done||e.fixtureAction||!validFixtureAction(action))return false;e.fixtureAction=structuredClone(action);return true;}
function rewardMulti(s,e,now){
 if(s.activeEncounter!==e||!e.done||!e.win||e.rewarded||!e.enemies.every(u=>u.hp===0)||!validMultiEncounter(e,INSTANCES))return null;
 return withMultiRng(e,()=>{
  e.rewarded=true;e.lootSummary=emptyLootSummary();e.materialLoot=[];e.rewardNotes=[];e.rewardRoundSources=[];
  const l=LOCS[e.location],st=stats(s),baseXp=(20+e.location*8)*2,knowledge=st.specials.knowledge&&Math.random()<.05;
  s.kills++;s.normalWins[e.location]++;s.gold+=l.reward*2;gainXp(s,baseXp*(knowledge?2:1));if(knowledge)e.rewardNotes.push('求知：额外基础经验 +'+baseXp);
  let first=null;const initial=e.enemies.filter(u=>u.origin==='initial');
  for(let round=0;round<2;round++){
   const u=initial[Math.floor(Math.random()*initial.length)],source=INSTANCES[u.sourceInstanceId],loc=LOCS[u.location];e.rewardRoundSources.push(u.id);
   e.materialLoot.push(...earnedMaterials(s,loc.mat,1,false,e.luck??0,null,e.lootSummary));
   if(st.specials.scavenger&&Math.random()<.1)e.materialLoot.push(...earnedMaterials(s,loc.mat,1,false,e.luck??0,null,e.lootSummary));
   const count=rollRecoverySupply(source,AREAS[source.areaId],false);if(count)e.materialLoot.push(...earnedMaterials(s,'灰根草',count,false,e.luck??0,null,e.lootSummary));
   const drop=rollDrop(s,false,e.luck??0,u.sourceInstanceId,false,e.lootSummary);if(drop){first??=drop;e.rewardNotes.push('群怪战利品：'+drop.name);}
  }
  const merged=new Map();for(const row of e.materialLoot){const old=merged.get(row.key);if(old)old.count+=row.count;else merged.set(row.key,{...row});}e.materialLoot=[...merged.values()];
  for(const row of e.materialLoot)e.rewardNotes.push(MATERIAL_QUALITIES[row.quality]+' '+row.material+' ×'+row.count);
  for(const action of ['discarded','overflow'])if(Object.values(e.lootSummary[action]).some(Boolean))e.rewardNotes.push((action==='discarded'?'品质过滤丢弃':'背包已满')+'：'+JSON.stringify(e.lootSummary[action]));
  s.running=false;s.stopAfterBattle=false;s.nextBattleAt=Math.max(now,s.lastHealthClock??0)+1800;s.nextActionAt=s.nextBattleAt;s.activeEncounter=null;return first;
 });
}

const damage=(raw,armor)=>Math.max(1,Math.round(raw*100/(100+Math.max(0,armor))));
function finish(e,win,source){e.done=true;e.win=win;e.hp=Math.max(0,e.hp);e.heroHp=Math.max(0,e.heroHp);e.killSource=source;}
export function combatStatuses(e){
 if(!e)return[];
 const defs=[['warcry','warcry','砧誓战吼','hero'],['ironcoat','ironcoat','铁衣铭文','hero'],['guard','guard','坚守','hero'],['barrier','barrier','铸壁','hero'],['heroBurn','mark','灼烧','hero'],['weakness','blunt','虚弱','hero'],['broken','break','破甲','enemy'],['burn','mark','铭火','enemy'],['blunt','blunt','挫锋','enemy'],['scorch','scorch','炉蚀','enemy']];
 const out=defs.filter(([id])=>e[id]>0).map(([id,key,name,side])=>({key,name,turns:e[id],side}));
 if(e.heavyDelayed)out.push({key:'delay',name:'重击延后',turns:Math.max(1,e.nextHeavy-e.round),side:'enemy'});return out;
}
export function step(s,e,now=Date.now()){
 if(!e||e!==s.activeEncounter||e.done||e.pauseAt!==undefined||!normalizeHealth(s,now)||s.restUntil>0)return[];
 e.heroHp=Math.min(e.heroHp,stats(s).hp);s.heroHp=e.heroHp;const drank=autoDrinkPotion(s,e,now);
 const turn={burnAtStart:e.heroBurn??0,burnTicked:false},logs=e.multiVersion===1?withMultiRng(e,()=>stepMulti(s,e,turn,{stats,SKILLS,skillUnlocked,resolveElementDamage,now:s.lastHealthClock,makeSummon:(u,n)=>normalizeEncounterElements(makeMultiUnit(e.id+'-summon-'+n,u.location,u.sourceInstanceId,LOCS[u.location],s.lastHealthClock))})):combatStep(s,e,turn);
 // Every executed player round consumes one turn of temporary player statuses,
 // including an early lethal hit. Do not run skipped damage phases.
 for(const field of ['guard','warcry','ironcoat','barrier','weakness'])e[field]=Math.max(0,(e[field]??0)-1);
 if(turn.burnAtStart>0&&!turn.burnTicked&&e.heroBurn>0)e.heroBurn--;
 if(!e.heroBurn)e.heroBurnPower=0;
 if(!e.barrier)e.barrierShield=0;
 s.nextActionAt=s.lastHealthClock+1100;if(drank)logs.unshift('自动饮用 · '+POTIONS[parsePotionKey(s.potionSlot.key).type].name);s.heroHp=Math.max(0,Math.min(stats(s).hp,e.heroHp));
 if(s.heroHp<=0){const resume=!e.developmentFixture&&!!s.running&&!e.boss&&!s.stopAfterBattle&&(e.kind!=='dungeon'||!!s.expedition?.loop);startRest(s,now,resume);s.stopAfterBattle=false;}return logs;
}
function combatStep(s,e,turn){
 if(e.done)return[];normalizeEncounterElements(e);const st=stats(s),logs=[];e.round++;
 for(const field of ['warcry','ironcoat','blunt','scorch','barrier','barrierShield','heroBurn','weakness'])e[field]??=0;
 e.nextHeavy??=4;e.heavyDelayed??=false;for(const k in e.cd)e.cd[k]=Math.max(0,e.cd[k]-1);
 let charge=e.round>=e.nextHeavy;
 const usable=k=>!(k==='warcry'&&e.warcry>0)&&!(k==='ironcoat'&&e.ironcoat>0)&&!(k==='blunt'&&e.blunt>0)&&!(k==='scorch'&&e.scorch>0)&&!(k==='guard'&&e.guard>0)&&!(k==='barrier'&&(e.barrier>0||e.barrierShield>0))&&!(k==='mend'&&e.heroHp>=st.hp)&&!(k==='cleanse'&&!e.heroBurn&&!e.weakness)&&!(k==='delay'&&(!charge||e.heavyDelayed));
 const ix=s.skills.findIndex((k,i)=>k!==null&&Object.hasOwn(SKILLS,k)&&skillUnlocked(s,k)&&!e.cd[k]&&usable(k)&&(s.conditions[i]!=='low'||e.heroHp<st.hp*.6)&&(s.conditions[i]!=='charge'||charge)&&(s.conditions[i]!=='burn'||e.burn>0)),k=ix<0?null:s.skills[ix];
 if(k)e.cd[k]=SKILLS[k].cd;
 const utility=['warcry','ironcoat','delay','barrier','mend','cleanse'].includes(k);
 if(utility){
  if(k==='warcry')e.warcry=3+(st.count.anvil>=2?1:0);
  if(k==='ironcoat')e.ironcoat=3+(st.count.guard>=2?1:0);
  if(k==='delay'){e.nextHeavy++;e.heavyDelayed=true;charge=false;}
  if(k==='barrier'){e.barrier=3;e.barrierShield=Math.floor(st.hp*.2)+st.shieldBonus;if(st.count.guard>=4)e.guard=Math.max(e.guard,2);}
  if(k==='mend'){const heal=Math.min(st.hp-e.heroHp,Math.floor(st.hp*.35),Math.min(Math.floor(st.hp*.2),Math.round(st.atk*.7+15))+st.healingBonus);e.heroHp+=heal;logs.push('回炉息 · 恢复 '+heal);}
  if(k==='cleanse'){e.heroBurn=0;e.heroBurnPower=0;e.weakness=0;}
  if(k!=='mend')logs.push(SKILLS[k].name+' · 生效');
 }else{
  let raw=st.atk*(e.warcry>0?1.25:1)*(e.weakness>0?.8:1);
  if(Math.random()<st.hit){
   if(k==='break'){raw*=1.2*(st.count.anvil>=2?1.25:1);e.broken=6;}
   if(k==='heavy')raw*=2.2*(e.broken?1.25:1)*(st.count.anvil>=4?1.35:1);
   if(k==='mark'){raw*=.9;e.burn=5;}
   if(k==='ignite')raw*=(e.burn?2.4:1.6)*(st.count.rune>=4?1.35:1);
   if(k==='guard'){raw*=st.count.guard>=2?1.3:1;e.guard=3;}
   if(k==='interrupt'){raw*=1.15;if(charge)e.stun=1;}
   if(k==='blunt'){raw*=.6;e.blunt=3;}
   if(k==='scorch'){raw*=.5;e.scorch=4+(st.count.rune>=2?1:0);}
   if((k==='mark'||k==='ignite')&&e.scorch>0)raw*=1.25;
   if(!k&&s.momentum){raw*=1.35;s.momentum=0;logs.push('余势：普攻增强');}
   const crit=Math.random()<st.crit,armor=e.armor*(e.broken?.75:1),isFire=k==='mark'||k==='ignite',base=raw*(crit?st.critDamage:1);
   const dealt=isFire?resolveElementDamage(base,'fire',st.elementAttack.fire,e.elementResistance.fire,e.elementTags):damage(base,Math.max(0,armor-st.penetration));
   e.hp-=dealt;logs.push((k?SKILLS[k].name:'普通攻击')+(crit?' 暴击':'')+' · '+Number(dealt.toFixed(1))+' 伤害'+(isFire?'（火）':''));
   if(e.hp<=0){if(st.specials.momentum)s.momentum=1;finish(e,true,'active');return logs;}
  }else logs.push((k?SKILLS[k].name:'普通攻击')+' · 未命中');
 }
 if(e.burn>0){const dot=resolveElementDamage(st.atk*(e.warcry>0?1.25:1)*(e.weakness>0?.8:1)*.32*(st.count.rune>=2?1.3:1)*(e.scorch>0?1.25:1),'fire',st.elementAttack.fire,e.elementResistance.fire,e.elementTags);e.hp-=dot;e.burn--;logs.push('炉火灼烧 · '+Number(dot.toFixed(1)));if(e.hp<=0){finish(e,true,'burn');return logs;}}
 if(e.heroBurn>0){const dot=resolveElementDamage(e.heroBurnPower,'fire',0,st.elementResistance.fire,[]);e.heroHp-=dot;e.heroBurn--;turn.burnTicked=true;logs.push('灼烧侵蚀 · -'+Number(dot.toFixed(1)));if(e.heroHp<=0){s.momentum=0;finish(e,false,null);return logs;}}
 if(e.stun){logs.push('敌人蓄力被打断');e.stun=0;}else{
  let hurt=Math.max(1,Math.round(damage(e.atk*(e.blunt>0?.8:1)*(charge?2:1),st.armor*(e.ironcoat>0?1.4:1))*(e.guard>0?.6:1)));
  if(st.block>0&&Math.random()<st.block){hurt=Math.max(1,Math.round(hurt*.7));logs.push('格挡 · 减轻30%直接伤害');}
  if(st.specials.shelter&&!e.shelterUsed&&e.heroHp-hurt<=st.hp*.3){e.shelterUsed=true;e.shield=Math.ceil(st.hp*.2)+st.shieldBonus;logs.push('绝境庇护 · 护盾 '+e.shield);}
  const wallAbsorbed=Math.min(e.barrierShield,hurt);e.barrierShield-=wallAbsorbed;hurt-=wallAbsorbed;
  const absorbed=Math.min(e.shield,hurt);e.shield-=absorbed;hurt-=absorbed;e.heroHp-=hurt;logs.push((charge?'敌人重击':'敌人攻击')+' · -'+hurt+(absorbed+wallAbsorbed?'（护盾吸收'+(absorbed+wallAbsorbed)+'）':''));
  if(e.heroHp>0&&e.guard>0){const counter=damage(st.atk*(e.warcry>0?1.25:1)*(e.weakness>0?.8:1)*(st.count.guard>=4?1:.6),Math.max(0,e.armor-st.penetration));e.hp-=counter;logs.push('坚守反击 · '+counter);}
  if(e.location===1&&e.round%5===0){e.heroBurn=Math.max(1,3-st.resolveReduction);e.heroBurnPower=Math.max(2,Math.round(e.atk*.05));logs.push('矿炉余火 · 受到'+e.heroBurn+'回合灼烧');}
  if(e.location===2&&e.round%6===0){const duration=Math.max(1,2-st.resolveReduction);e.weakness=duration+1;logs.push('失誓诅咒 · 受到'+duration+'回合虚弱');}
 }
 if(charge){e.nextHeavy=e.round+4;e.heavyDelayed=false;}
 for(const field of ['broken','blunt','scorch'])e[field]=Math.max(0,e[field]-1);
 if(e.heroHp<=0){s.momentum=0;finish(e,false,null);}else if(e.hp<=0)finish(e,true,'counter');return logs;
}
export function gainXp(s,n){s.xp+=n;while(s.xp>=s.level*80){s.xp-=s.level*80;s.level++;}}
export function luckChance(points){return .06*Math.max(0,points)/(Math.max(0,points)+5);}
function luckyRoll(draw,points){const first=draw();if(points>0&&Math.random()<luckChance(points))return Math.max(first,draw());return first;}
function rollQuality(weights=[65,28,6.5,.5]){return Number(weighted(weights.map((w,i)=>[i,w])));}
function rollDrop(s,boss,luck=0,instanceId=resolveLegacySite(s.location).id+'-field',clear=false,lootSummary=emptyLootSummary()){
 const instance=INSTANCES[instanceId],area=AREAS[instance?.areaId];if(!instance||!area)return null;
 const dungeon=instance.kind==='dungeon';if(Math.random()>=(boss?.65:clear?.35:.18))return null;
 const setRoll=rollSourceSet({source:'drop',kind:instance.kind,areaNumber:area.number,race:area.race});
 const slot=setRoll?.slot??SLOTS[rand(0,SLOTS.length-1)],set=setRoll?.set??null,quality=setRoll?.rarity??luckyRoll(()=>rollQuality(boss?[50,35,13,2]:dungeon?[55,34,10,1]:[65,28,6.5,.5]),luck);
 const rolled=rollDropEquipmentLevel(areaGearLevel(instanceId),area.levelRange),it=item(slot,rolled.level,set,quality,rolled);
 return receiveBattleLoot(s,{kind:'equipment',item:it},lootSummary)?it:null;
}
export function reward(s,e,now=Date.now()){
 if(e.multiVersion===1)return rewardMulti(s,e,now);
 if(!e.win||e.rewarded)return null;
 const dungeon=e.kind==='dungeon',run=s.dungeonRun;
 if(dungeon&&(!e.done||s.activeEncounter!==e||!run||run.runId!==e.runId||run.stage!==e.dungeonStage||run.instanceId!==e.instanceId||INSTANCES[e.instanceId]?.kind!=='dungeon'||!INSTANCES[e.instanceId]?.enabled))return null;
 normalizeExpedition(s);const clear=dungeon&&e.dungeonStage===3,instanceId=e.instanceId;
 const tokenEligible=(e.boss||clear)&&e.done&&s.activeEncounter===e&&now>=(s.instanceCooldowns[instanceId]??0);
 e.rewarded=true;e.lootSummary=emptyLootSummary();const index=e.location??s.location,l=LOCS[index],st=stats(s);s.kills++;s.gold+=(e.boss?l.bossGold:l.reward)+(clear?20:0);
 const materialWeights=e.boss?[55,34,10,1]:dungeon?(clear?[65,28,6.5,.5]:[70,24,5.5,.5]):null;
 const baseXp=e.boss?100:20+index*8,knowledge=st.specials.knowledge&&Math.random()<.05;gainXp(s,baseXp*(knowledge?2:1)+(clear?40:0));e.materialLoot=earnedMaterials(s,l.mat,e.boss?4:clear?3:1,e.boss,e.luck??0,materialWeights,e.lootSummary);
 if(st.specials.scavenger&&Math.random()<.1){e.materialLoot.push(...earnedMaterials(s,l.mat,1,e.boss,e.luck??0,materialWeights,e.lootSummary));e.rewardNotes=['拾荒者：额外材料 +1'];}if(knowledge)(e.rewardNotes??=[]).push('求知：额外基础经验 +'+baseXp);
 const recoveryInstance=e.instanceId===undefined?INSTANCES[resolveLegacySite(index)?.id+(e.boss?'-boss':'-field')]:INSTANCES[e.instanceId];
 const recoveryCount=recoveryInstance?.kind===(e.boss?'boss':e.kind??'field')?rollRecoverySupply(recoveryInstance,AREAS[recoveryInstance.areaId],clear):0;
 if(recoveryCount){const herbLoot=earnedMaterials(s,'灰根草',recoveryCount,e.boss,e.luck??0,materialWeights,e.lootSummary);e.materialLoot.push(...herbLoot);for(const row of herbLoot.filter(x=>x.quality===0))(e.rewardNotes??=[]).push('普通 灰根草 ×'+row.count);}
 for(const loot of e.materialLoot.filter(x=>x.quality>0))(e.rewardNotes??=[]).push(MATERIAL_QUALITIES[loot.quality]+' '+loot.material+' ×'+loot.count);

 let drop=rollDrop(s,e.boss,e.luck??0,e.instanceId??resolveLegacySite(index).id+(e.boss?'-boss':'-field'),clear,e.lootSummary);
 if(tokenEligible&&Math.random()<(clear?.02:.08)){normalizeTalents(s);if(receiveBattleLoot(s,{kind:'consumable',key:'reforgeToken',quantity:1},e.lootSummary))(e.rewardNotes??=[]).push('重铸印记 ×1');}
 if(e.boss){s.bossWins[index]++;s.bossReady[index]=Math.max(now,s.lastHealthClock??0)+1800000;s.instanceCooldowns[instanceId]=s.bossReady[index];if(!s.chapters.includes(index)){s.chapters.push(index);s.chronicle.unshift(['沃恩交出了商队货单：货物并非被抢，而是被人改道。','哥布林技师「尼克」从炉芯发现了烬裔封印。','精灵信使「瑟拉」证实：旧盟约的碎片，正在被五族争夺。'][index]);}}else s.normalWins[index]++;
 if(dungeon){
  if(clear){const newlyCleared=recordDungeonAreaClear(s,e);if(newlyCleared)(e.rewardNotes??=[]).push('区域1已通关：解锁区域2进度，商人下次补货采用11–20级装备；区域2地图尚未开放。');s.instanceCooldowns[instanceId]=Math.max(now,s.lastHealthClock??0)+300000;s.dungeonRun=null;(e.rewardNotes??=[]).push('普通副本通关：额外20金币、40经验、2份材料；冷却5分钟。');if(!s.expedition.loop)s.running=false;}
  else{run.carry=captureDungeonPlayerState(e);run.stage++;(e.rewardNotes??=[]).push('副本进度 '+e.dungeonStage+'/3：本阶段战利品已收取。');}
 }
 for(const action of ['discarded','overflow']){const n=Object.values(e.lootSummary[action]).reduce((a,b)=>a+b,0);if(n)(e.rewardNotes??=[]).push((action==='discarded'?'品质过滤丢弃':'对应背包已满未收取')+'：装备'+e.lootSummary[action].equipment+'／材料'+e.lootSummary[action].materials+'／物品'+e.lootSummary[action].items);}
 s.nextBattleAt=Math.max(now,s.lastHealthClock??0)+1800;s.nextActionAt=s.nextBattleAt;if(e.boss||s.stopAfterBattle){s.running=false;s.stopAfterBattle=false;}if(s.activeEncounter===e)s.activeEncounter=null;return drop;
}
export function offline(s,now=Date.now()){
 if(!Number.isFinite(now)||now<0||now>1e15)return null;
 const start=Math.max(s.lastSeen,s.lastHealthClock??s.lastSeen),end=Math.min(now,start+4*3600000),beforeGold=s.gold,beforeXp=s.xp,beforeLevel=s.level;
 if(!normalizeHealth(s,start)||!normalizeMaterials(s)||!normalizePotions(s))return null;
 const beforeMaterials=new Map(materialEntries(s).map(x=>[x.key,x.count]));let time=start,kills=0,rests=0,rounds=0;const lootSummary=emptyLootSummary();
 // Real combat turns, bounded to four hours. Camp waits jump to their deadline.
 while(time<end&&s.running){
  if(s.restUntil>0){if(s.restUntil>end)break;time=Math.max(time,s.restUntil);settleRest(s,time);if(!s.running)break;continue;}
  if(s.nextBattleAt>time){time=Math.min(end,s.nextBattleAt);if(time>=end)break;}
  let e=s.activeEncounter;
  if(e?.done){if(e.win&&!e.rewarded){reward(s,e,time);mergeLootSummary(lootSummary,e.lootSummary);kills++;}else s.activeEncounter=null;continue;}
  if(!e){e=startRoutedEncounter(s,time);if(!e){if(s.restUntil>0){rests++;continue;}break;}e.luck=s.offlineLuck??0;}
  const turnAt=Math.max(time,s.nextActionAt??(time+1100));if(turnAt>end)break;time=turnAt;
  const wasResting=s.restUntil>0;step(s,e,time);rounds++;if(!wasResting&&s.restUntil>0)rests++;
  if(e.done&&e.win){reward(s,e,time);mergeLootSummary(lootSummary,e.lootSummary);kills++;}
  if(rounds>13100)break;
 }
 // Time beyond the reward cap may finish rest/expire buffs, never grants extra kills.
 settleRest(s,Math.max(now,start));s.lastSeen=Math.max(now,start);
 const materialLoot=materialEntries(s).map(x=>({...x,count:x.count-(beforeMaterials.get(x.key)??0)})).filter(x=>x.count>0),mat=materialLoot.reduce((n,x)=>n+x.count,0);
 const xp=(s.level-beforeLevel)*(beforeLevel+s.level-1)*40+s.xp-beforeXp,gold=s.gold-beforeGold;
 if(now<=start)return null;
 s.chronicle.unshift('离线实战：完成'+kills+'场胜利，休息'+rests+'次，获得'+gold+'金币与'+mat+'份材料。');for(const action of ['discarded','overflow']){const n=Object.values(lootSummary[action]).reduce((a,b)=>a+b,0);if(n)s.chronicle.unshift((action==='discarded'?'离线品质过滤丢弃':'离线背包已满未收取')+'：装备'+lootSummary[action].equipment+'／材料'+lootSummary[action].materials+'／物品'+lootSummary[action].items);}s.chronicle=s.chronicle.slice(0,20);
 return {minutes:Math.floor(Math.max(0,end-start)/60000),gold,xp,mat,materialLoot,lootSummary,kills,rests,rounds,capped:now-start>4*3600000};
}
export const MATERIALS={
 '铁屑':{icon:'iron',tags:['金属'],description:'旧驿道散落的铁料，融合时偏向厚重装备；不产出套装。',origin:'失落驿道',price:4},
 '炉火晶':{icon:'fire',tags:['火焰'],description:'矿炉余热凝成的晶体，融合时偏向饰品；不产出套装。',origin:'熄火矿井',price:7},
 '灰根草':{icon:'herb',tags:['草药'],functionalTags:['recoveryBase'],description:'黑炉荒野生长的耐寒草药，使随机融合更容易产出药剂。',origin:'黑炉诸地',price:5},
 '誓约残片':{icon:'soul',tags:['灵魂'],description:'旧誓遗物的碎片，融合时偏向饰品；不产出套装。',origin:'旧誓墓园',price:10}
};
export const MATERIAL_QUALITIES=['普通','稀有','优良','至臻'];
export function materialKey(material,quality=0){return Object.hasOwn(MATERIALS,material)&&Number.isInteger(quality)&&quality>=0&&quality<=3?`${material}|${quality}`:null;}
export function parseMaterialKey(value){
 if(typeof value!=='string')return null;
 if(Object.hasOwn(MATERIALS,value))return {material:value,quality:0,key:materialKey(value,0)};
 const parts=value.split('|');if(parts.length!==2||!['0','1','2','3'].includes(parts[1]))return null;
 const key=materialKey(parts[0],Number(parts[1]));return key?{material:parts[0],quality:Number(parts[1]),key}:null;
}
function validMaterials(s){
 const count=n=>Number.isSafeInteger(n)&&n>=0&&n<=1e12;
 if(s.materialStacks!==undefined)return s.materials===undefined&&s.materialStacks&&typeof s.materialStacks==='object'&&!Array.isArray(s.materialStacks)&&Object.entries(s.materialStacks).every(([k,n])=>parseMaterialKey(k)?.key===k&&count(n));
 return s.materials&&typeof s.materials==='object'&&!Array.isArray(s.materials)&&Object.keys(s.materials).every(k=>Object.hasOwn(MATERIALS,k))&&['铁屑','炉火晶','誓约残片'].every(k=>count(s.materials[k]))&&count(s.materials['灰根草']??0);
}
export function normalizeMaterials(s){
 if(!validMaterials(s))return false;
 if(s.materialStacks===undefined){s.materialStacks=Object.fromEntries(Object.entries(s.materials).map(([kind,n])=>[materialKey(kind),n]));delete s.materials;}
 return true;
}
export function materialCount(s,material,quality=0){const key=materialKey(material,quality);if(!key)return 0;return s.materialStacks!==undefined?(s.materialStacks[key]??0):(quality===0?s.materials?.[material]??0:0);}
export function materialEntries(s){return Object.keys(MATERIALS).flatMap(material=>[0,1,2,3].map(quality=>({key:materialKey(material,quality),material,quality,count:materialCount(s,material,quality)}))).filter(row=>row.count>0);}
export function materialPrice(material,quality=0){return materialKey(material,quality)?Math.ceil(MATERIALS[material].price*[1,1.5,2.5,4][quality]):null;}
function addMaterial(s,material,quality,count){const key=materialKey(material,quality),before=s.materialStacks[key]??0,added=Math.max(0,Math.min(count,1e12-before));s.materialStacks[key]=before+added;return added;}
export function receiveBattleLoot(s,loot,summary=emptyLootSummary()){
 if(!validMonsterLedger(s)||!validCodexCollection(s)||!loot||!['equipment','material','consumable','potion'].includes(loot.kind))return false;
 const qty=loot.quantity??1;if(!Number.isSafeInteger(qty)||qty<1)return false;
 const category=loot.kind==='equipment'?'equipment':loot.kind==='material'?'materials':'items';
 const quality=loot.kind==='equipment'?loot.item?.rarity:loot.kind==='material'?parseMaterialKey(loot.key)?.quality:loot.kind==='potion'?parsePotionKey(loot.key)?.quality:undefined;
 if(!(loot.kind==='equipment'&&(loot.item?.locked||isProtected(s,loot.item?.id)))&&shouldDiscardLoot(s,category,quality)){summary.discarded[category]+=qty;return false;}
 if(loot.kind==='equipment'){if(!validEquipment(loot.item)||s.inventory.some(it=>it.id===loot.item.id))return false;if(qty!==1||!canReceiveEquipment(s,loot.item)){summary.overflow.equipment+=qty;return false;}s.inventory.push(loot.item);recordCollectedEquipment(s,loot.item);return true;}
 if(loot.kind==='material'){const parsed=parseMaterialKey(loot.key);if(!parsed)return false;normalizeMaterials(s);if(!canReceiveMaterial(s,parsed.key,qty)){summary.overflow.materials+=qty;return false;}addMaterial(s,parsed.material,parsed.quality,qty);return true;}
 if(loot.kind==='consumable'){if(!Object.hasOwn(CONSUMABLES,loot.key))return false;normalizeTalents(s);if(!canReceiveItem(s,loot.key,qty)){summary.overflow.items+=qty;return false;}s.consumables[loot.key]=(s.consumables[loot.key]??0)+qty;return true;}
 if(loot.kind==='potion'){const parsed=parsePotionKey(loot.key);if(!parsed||!normalizePotions(s))return false;if(!canReceiveItem(s,parsed.key,qty)){summary.overflow.items+=qty;return false;}s.potionStacks[parsed.key]=(s.potionStacks[parsed.key]??0)+qty;return true;}
 return false;
}
function validPendingForgeClaim(s){
 const p=s.pendingForgeClaim;if(p===undefined||p===null)return true;
 if(!p||typeof p!=='object'||Array.isArray(p))return false;
 if(p.kind==='equipment')return validEquipment(p.item)&&!s.inventory?.some(it=>it.id===p.item.id)&&!s.merchant?.offers?.some(o=>o.type==='equipment'&&o.stock===1&&o.item?.id===p.item.id);
 if(p.kind==='potion'){const r=p.potion,parsed=parsePotionKey(r?.key);return !!parsed&&r?.kind==='potion'&&(r.quantity===undefined||(Number.isInteger(r.quantity)&&r.quantity>=1&&r.quantity<=999))&&parsed.type===r.potionType&&parsed.quality===r.quality&&r.name===POTIONS[r.potionType]?.name;}
 return false;
}
export function claimForgeResult(s){
 const p=s.pendingForgeClaim;if(!p||!validCodexCollection(s)||!validPendingForgeClaim(s))return null;
 if(p.kind==='equipment'){if(!canReceiveEquipment(s,p.item))return null;s.inventory.push(p.item);recordCollectedEquipment(s,p.item);s.pendingForgeClaim=null;return p.item;}
 const r=p.potion,quantity=r.quantity??1;if(!validPotions(s)||!canReceiveItem(s,r.key,quantity))return null;normalizePotions(s);s.potionStacks[r.key]=(s.potionStacks[r.key]??0)+quantity;s.pendingForgeClaim=null;return {...r,quantity};
}
function earnedMaterials(s,material,count,boss=false,luck=0,weights=null,summary=emptyLootSummary()){
 normalizeMaterials(s);const loot=[];
 for(let i=0;i<count;i++){const quality=luckyRoll(()=>rollQuality(weights??(boss?[65,28,6.5,.5]:[80,17,2.8,.2])),luck);const added=receiveBattleLoot(s,{kind:'material',key:materialKey(material,quality),quality,quantity:1},summary);if(!added)continue;const entry=loot.find(x=>x.quality===quality);if(entry)entry.count++;else loot.push({key:materialKey(material,quality),material,quality,count:1});}
 return loot;
}
const MERCHANT_STOCK={'铁屑':[6,12],'炉火晶':[3,7],'誓约残片':[2,5],'灰根草':[4,8]};
export const MERCHANT_CYCLE_MS=30*60*1000;
function validEquipment(i){try{const num=(n,max=1e12)=>Number.isFinite(n)&&n>=0&&n<=max;return validEquipmentTemplateMetadata(i)&&validEnhancementMetadata(i)&&validEquipmentLevelMetadata(i)&&typeof i.id==='string'&&typeof i.name==='string'&&SLOTS.includes(i.slot)&&Number.isInteger(i.rarity)&&i.rarity>=0&&i.rarity<=3&&(!i.set||(BUILD.some(b=>b.id===i.set)&&SET_SLOTS.includes(i.slot)&&i.rarity===3))&&num(i.atk)&&num(i.hp)&&num(i.armor)&&num(i.level)&&num(i.bless,5)&&Array.isArray(i.affixes)&&(i.rarity===0?i.affixes.length<=1:i.affixes.length===i.rarity+1)&&new Set(i.affixes.map(a=>a.stat)).size===i.affixes.length&&i.affixes.every(a=>Object.hasOwn(AFFIX_DEFS,a.stat)&&Number.isInteger(a.value)&&num(a.value,50))&&(!i.special||(!i.set&&i.rarity>=2&&Object.hasOwn(SPECIALS,i.special.id)))&&(i.legendaryId===null||LEGENDARY_CODEX.some(def=>def.id===i.legendaryId&&def.implemented&&def.slot===i.slot&&!i.set))&&(i.divine===undefined||(i.divine?.id==='forge-favor'&&i.divine.name==='神赐·炉火眷顾'&&i.divine.model==='raw-v1'&&['atk','armor','hp'].every(k=>num(i.divine.bonus?.[k]))));}catch{return false;}}
function validMerchant(merchant){
 if(!merchant||merchant.version!==1||!Number.isFinite(merchant.generatedAt)||merchant.generatedAt<0||merchant.generatedAt>1e15||!Array.isArray(merchant.offers))return false;
 const rows=merchant.offers,legacy=rows.length>=2&&rows.length<=3&&rows.every(o=>o&&!o.type);
 const materialValid=o=>Object.hasOwn(MATERIALS,o.material)&&Number.isInteger(o.quality??0)&&(o.quality??0)>=0&&(o.quality??0)<=3&&o.price===materialPrice(o.material,o.quality??0)&&Number.isInteger(o.stock)&&o.stock>=0&&o.stock<=MERCHANT_STOCK[o.material][1];
 if(legacy){if(!rows.every(materialValid)||new Set(rows.map(o=>o.material)).size!==rows.length)return false;}
 else{
  if(rows.length!==8||new Set(rows.map(o=>o?.offerId)).size!==8||!rows.every(o=>o&&typeof o.offerId==='string'))return false;
  const mats=rows.filter(o=>o.type==='material'),gear=rows.filter(o=>o.type==='equipment'),consumables=rows.filter(o=>o.type==='consumable'),recipes=rows.filter(o=>o.type==='recipe');
  if(mats.length<2||mats.length>3||mats.length+gear.length+consumables.length+recipes.length!==8||recipes.length>3||new Set(recipes.map(o=>o.recipeId)).size!==recipes.length||!recipes.every(o=>Object.hasOwn(RECIPES,o.recipeId)&&RECIPES[o.recipeId].enabled&&o.price===RECIPES[o.recipeId].price&&Number.isSafeInteger(o.price)&&o.price>0&&[0,1].includes(o.stock))||consumables.length>2||new Set(consumables.map(o=>o.consumable)).size!==consumables.length||!consumables.every(o=>Object.hasOwn({memoryFruit:200,reforgeToken:120},o.consumable)&&o.price===({memoryFruit:200,reforgeToken:120})[o.consumable]&&[0,1].includes(o.stock))||new Set(mats.map(o=>o.material)).size!==mats.length||!mats.every(materialValid))return false;
  if(!gear.every(o=>validEquipment(o.item)&&!o.item.divine&&o.item.legendaryId===null&&[0,1].includes(o.stock)&&o.price===15+sellValue(o.item)*4+o.item.level*3)||new Set(gear.map(o=>o.item.id)).size!==gear.length)return false;
 }
 if(['cycleStart','nextRefreshAt','paidRefreshes','revision'].every(k=>merchant[k]===undefined))return legacy;
 return Number.isFinite(merchant.cycleStart)&&merchant.cycleStart>=0&&merchant.cycleStart<=1e15&&merchant.nextRefreshAt===merchant.cycleStart+MERCHANT_CYCLE_MS&&Number.isSafeInteger(merchant.paidRefreshes)&&merchant.paidRefreshes>=0&&merchant.paidRefreshes<=1e9&&Number.isSafeInteger(merchant.revision)&&merchant.revision>=0;
}
function rollMerchantOffers(s,revision,preservedMaterials=null){
 const [minGearLevel,maxGearLevel]=getMerchantEquipmentLevelRange(s);
 const pool=Object.keys(MATERIALS),offers=preservedMaterials?preservedMaterials.map(o=>({...o,type:'material',quality:o.quality??0})):[],count=preservedMaterials?offers.length:rand(2,3);
 if(!preservedMaterials)for(let i=0;i<count;i++){const material=pool.splice(rand(0,pool.length-1),1)[0],[min,max]=MERCHANT_STOCK[material];const quality=rollQuality([75,20,4.5,.5]);offers.push({type:'material',material,quality,price:materialPrice(material,quality),stock:rand(min,max)});}
 while(offers.length<8){const slot=SLOTS[rand(0,SLOTS.length-1)],it=item(slot,rand(minGearLevel,maxGearLevel),null,rollQuality(),{levelSource:'merchant'});offers.push({type:'equipment',item:it,price:15+sellValue(it)*4+it.level*3,stock:1});}
 if(Math.random()<.03)offers[7]={type:'consumable',consumable:'memoryFruit',price:200,stock:1};
 if(Math.random()<.10){const index=offers.findLastIndex(o=>o.type==='equipment');offers[index]={type:'consumable',consumable:'reforgeToken',price:120,stock:1};}
 const unknown=Object.keys(RECIPES).filter(id=>RECIPES[id].enabled&&!recipeKnown(s,id));
 if(unknown.length){const count=Math.min(unknown.length,rand(1,2));for(let i=0;i<count;i++){const id=unknown.splice(rand(0,unknown.length-1),1)[0],index=offers.findLastIndex(o=>o.type==='equipment');if(index>=0)offers[index]={type:'recipe',recipeId:id,price:RECIPES[id].price,stock:1};}}
 return offers.map((offer,index)=>({...offer,offerId:`merchant-${revision}-${index}`}));
}
export function ensureMerchant(s,now=Date.now()){
 if(!validRecipes(s)||!normalizeAreaProgress(s))return null;
 if(!Number.isFinite(now)||now<0||now>1e15)return null;
 if(s.merchant===undefined){normalizeRecipes(s);s.merchant={version:1,offers:rollMerchantOffers(s,0),generatedAt:now,cycleStart:now,nextRefreshAt:now+MERCHANT_CYCLE_MS,paidRefreshes:0,revision:0};return s.merchant;}
 if(!validMerchant(s.merchant))return null;
 normalizeRecipes(s);const m=s.merchant;for(const offer of m.offers)if(offer.type==='material'||!offer.type)offer.quality??=0;
 // Upgrade the initial merchant schema without replacing purchased stock.
 if(m.cycleStart===undefined){m.cycleStart=m.generatedAt;m.nextRefreshAt=m.cycleStart+MERCHANT_CYCLE_MS;m.paidRefreshes=0;m.revision=0;}
 if(now>=m.nextRefreshAt){
  const skipped=Math.floor((now-m.cycleStart)/MERCHANT_CYCLE_MS);
  m.cycleStart+=skipped*MERCHANT_CYCLE_MS;m.nextRefreshAt=m.cycleStart+MERCHANT_CYCLE_MS;
  m.revision++;m.offers=rollMerchantOffers(s,m.revision);m.generatedAt=now;m.paidRefreshes=0;
 }
 if(m.offers.length!==8)m.offers=rollMerchantOffers(s,m.revision,m.offers);
 return m;
}
export function getMerchantRefreshCost(s){const n=s.merchant?.paidRefreshes??0;return 20+10*n;}
export function paidRefreshMerchant(s,now=Date.now(),expectedRevision){
 const m=ensureMerchant(s,now);
 if(!m||!Number.isSafeInteger(expectedRevision)||m.revision!==expectedRevision||m.paidRefreshes>=1e9)return false;
 const cost=getMerchantRefreshCost(s);if(!Number.isFinite(s.gold)||s.gold<cost)return false;
 const offers=rollMerchantOffers(s,m.revision+1);s.gold-=cost;m.offers=offers;m.paidRefreshes++;m.revision++;m.generatedAt=now;return true;
}
export function buyMaterial(s,stackKey,qty,expectedRevision,now=Date.now()){
 const parsed=parseMaterialKey(stackKey);if(!Number.isSafeInteger(qty)||qty<=0||!parsed||!validMaterials(s))return false;
 const {material,quality}=parsed,m=ensureMerchant(s,now);if(!m||(expectedRevision!==undefined&&m.revision!==expectedRevision))return false;
 const offer=m.offers.find(o=>o.type==='material'&&o.material===material&&(o.quality??0)===quality);
 if(!offer||qty>offer.stock||!Number.isFinite(s.gold)||s.gold<offer.price*qty||!canReceiveMaterial(s,parsed.key,qty))return false;
 normalizeMaterials(s);s.gold-=offer.price*qty;addMaterial(s,material,quality,qty);offer.stock-=qty;return true;
}
export function purchaseEquipment(s,offerId,expectedRevision,now=Date.now()){
 const m=ensureMerchant(s,now);if(!m||!Number.isSafeInteger(expectedRevision)||m.revision!==expectedRevision)return false;
 const offer=m.offers.find(o=>o.type==='equipment'&&o.offerId===offerId);
 if(!validCodexCollection(s)||!isMerchantEquipmentSellable(offer)||offer.stock!==1||!canReceiveEquipment(s,offer.item)||!Number.isFinite(s.gold)||s.gold<offer.price||s.inventory.some(it=>it.id===offer.item.id))return false;
 s.gold-=offer.price;offer.stock=0;s.inventory.push(offer.item);recordCollectedEquipment(s,offer.item);return true;
}
export function purchaseConsumable(s,offerId,expectedRevision,now=Date.now()){
 const m=ensureMerchant(s,now);if(!m||!Number.isSafeInteger(expectedRevision)||m.revision!==expectedRevision)return false;
 const offer=m.offers.find(o=>o.type==='consumable'&&o.offerId===offerId);
 if(!offer||offer.stock!==1||!['memoryFruit','reforgeToken'].includes(offer.consumable)||!validTalents(s)||!validConsumables(s)||!Number.isFinite(s.gold)||s.gold<offer.price||!canReceiveItem(s,offer.consumable,1))return false;
 normalizeTalents(s);s.gold-=offer.price;offer.stock=0;s.consumables[offer.consumable]++;return true;
}
export function purchaseRecipe(s,offerId,expectedRevision,now=Date.now()){
 if(!validRecipes(s))return false;const merchant=ensureMerchant(s,now);if(!merchant||!Number.isSafeInteger(expectedRevision)||merchant.revision!==expectedRevision)return false;
 const offer=merchant.offers.find(o=>o.type==='recipe'&&o.offerId===offerId);
 if(!offer||offer.stock!==1||recipeKnown(s,offer.recipeId)||!Number.isFinite(s.gold)||s.gold<offer.price)return false;
 if(!learnRecipe(s,offer.recipeId))return false;s.gold-=offer.price;offer.stock=0;return true;
}
export function fusionQualityWeights(selection){
 if(!Array.isArray(selection)||selection.length<1||selection.length>5)return null;const parsed=selection.map(parseMaterialKey);if(parsed.some(x=>!x))return null;
 const n=selection.length,a=parsed.reduce((sum,x)=>sum+x.quality,0)/n;return [50-4*n-3*a,40+2*n-a,9+1.6*n+3*a,1+.4*n+a];
}
export const FUSION_TAGS={
 '铁屑':{slots:{weapon:2,helm:1,armor:2,gloves:1,boots:1,ring:0,amulet:0}},
 '炉火晶':{slots:{weapon:1,helm:0,armor:0,gloves:1,boots:0,ring:2,amulet:2}},
 '灰根草':{slots:{weapon:0,helm:0,armor:0,gloves:0,boots:0,ring:0,amulet:0}},
 '誓约残片':{slots:{weapon:0,helm:1,armor:0,gloves:0,boots:1,ring:2,amulet:2}}
};
export function fusionWeights(selection){const slots=Object.fromEntries(SLOTS.map(k=>[k,2]));for(const key of selection){const parsed=parseMaterialKey(key),tag=parsed?FUSION_TAGS[parsed.material]:null;if(!tag)continue;for(const slot of SLOTS)slots[slot]+=tag.slots[slot];}return {slots};}
export function eligibleFusionEquipment(s){
 return s.inventory.filter(it=>validEquipment(it)&&!it.legendaryId&&!it.locked&&!Object.values(s.equip).includes(it.id)&&!isProtected(s,it.id));
}
export function forge(s,selection){
 if(!validCodexCollection(s)||!Array.isArray(selection)||selection.length<1||selection.length>5||!Number.isFinite(s.gold)||s.gold<40||s.pendingForgeClaim||!validMaterials(s))return null;
 const counts={},parsed=[],gear=[],ids=new Set(),inputs=[],materials=[],eligible=new Map(eligibleFusionEquipment(s).map(it=>[it.id,it]));
 for(const input of selection){
  if(typeof input==='string'){const entry=parseMaterialKey(input);if(!entry)return null;parsed.push(entry);materials.push(entry.key);inputs.push({kind:'material',quality:entry.quality});counts[entry.key]=(counts[entry.key]||0)+1;}
  else{if(!input||typeof input!=='object'||Array.isArray(input)||Object.keys(input).length!==2||input.kind!=='equipment'||typeof input.id!=='string'||ids.has(input.id)||!eligible.has(input.id))return null;const it=eligible.get(input.id);ids.add(it.id);gear.push(it);inputs.push({kind:'equipment',quality:it.rarity});}
 }
 if(parsed.some(({material,quality,key})=>materialCount(s,material,quality)<counts[key]))return null;
 const n=selection.length,qualityWeights=gear.length?null:fusionQualityWeights(materials),herbs=parsed.filter(p=>p.material==='灰根草').length;
 if(!gear.length&&herbs&&!validPotions(s))return null;
 if(!gear.length&&herbs&&Math.random()<.35+.5*herbs/n){
  const quality=luckyRoll(()=>rollQuality(qualityWeights),s.talents.luck??0),type=weighted([['healing',60],['strength',25],['fireResist',15]]),key=potionKey(type,quality);
  normalizeMaterials(s);normalizePotions(s);Object.entries(counts).forEach(([key,v])=>s.materialStacks[key]-=v);s.gold-=40;
  const result={kind:'potion',potionType:type,quality,name:POTIONS[type].name,quantity:1,key};
  if(canReceiveItem(s,key))s.potionStacks[key]=(s.potionStacks[key]??0)+1;else s.pendingForgeClaim={kind:'potion',potion:result};return result;
 }
 const weights=fusionWeights(materials),slot=weighted(Object.entries(weights.slots)),quality=luckyRoll(()=>gear.length?rollEquipmentInputQuality(inputs):rollQuality(qualityWeights),s.talents.luck??0);
 const level=gear.length?rollEquipmentFusionLevel(gear):{level:s.level,baseLevel:s.level,levelSource:'material'};
 const it=item(slot,level.level,null,quality,level);if(Math.random()<fusionDivineChance(inputs))applyForgeFavor(it);
 // Record actual owned inputs before their one-time consumption.
 if(gear.length)normalizeCodexCollection(s);
 normalizeMaterials(s);Object.entries(counts).forEach(([key,v])=>s.materialStacks[key]-=v);s.inventory=s.inventory.filter(it=>!ids.has(it.id));s.gold-=40;
 if(canReceiveEquipment(s,it)){s.inventory.push(it);recordCollectedEquipment(s,it);}else s.pendingForgeClaim={kind:'equipment',item:it};return it;
}
export function applyForgeFavor(it){
 if(it.divine)return false;
 // Raw bases and raw rolls stay unchanged. Bonus is presentation metadata only;
 // aggregation uses the marker once, with fractional gains preserved until totals.
 const bonus={};for(const key of ['atk','armor','hp'])bonus[key]=it[key]/10;
 bonus.affixes=it.affixes.map(a=>({stat:a.stat,value:a.value/10}));
 it.divine={id:'forge-favor',name:'神赐·炉火眷顾',model:'raw-v1',bonus};return true;
}
export const LEGENDARY_CODEX=[{id:'first-forge-oathhammer',name:'王统·初炉誓锤',slot:'weapon',icon:'firstforge',implemented:false,lore:'每一代矮人王继承此锤时，都会重新锻造它，并刻下自己的名字。旧王的誓言留在锤身，新王的名字融入炉火。',affix:'祖王回响',effect:'累计主动攻击后，触发一次强力、部分穿甲的额外重击。回响不会累积自身触发次数，也不会递归触发。',acquisition:'获取途径待定',attributes:'常规属性随机范围待定',tuning:'触发次数、伤害和穿甲数值待调'}];
export const SET_CODEX=BUILD.map(b=>({id:b.id,name:b.name,icon:b.id,parts:[...SET_SLOTS],bonus:b.bonus}));
function validCodexCollection(s){return validCollectionLedger(s,SET_CODEX,LEGENDARY_CODEX);}
export function normalizeCodexCollection(s){return normalizeCollectionLedger(s,SET_CODEX,LEGENDARY_CODEX,validEquipment);}
export function recordCollectedEquipment(s,it){
 const owned=s.inventory?.find(candidate=>candidate.id===it?.id);if(!owned||!validEquipment(owned)||!normalizeCodexCollection(s))return false;
 return addOwnedCollection(s.codexCollection,owned,SET_CODEX,LEGENDARY_CODEX);
}
export function codexSetState(s,id){
 const entry=SET_CODEX.find(x=>x.id===id);if(!entry)return null;
 const parts=validCodexCollection(s)?[...(s.codexCollection?.sets[id]??[])]:[];
 return {discovered:parts.length>0,parts,complete:parts.length===entry.parts.length};
}
export function codexState(s,id){
 const entry=LEGENDARY_CODEX.find(x=>x.id===id);if(!entry)return null;
 if(!entry.implemented)return {collected:false,status:'设计预览 · 未收集'};
 const collected=validCodexCollection(s)&&s.codexCollection?.legendaries.includes(id)===true;
 return {collected,status:collected?'已收集':'未收集'};
}
export function validSave(s){
 try{const num=(n,max=1e12)=>Number.isFinite(n)&&n>=0&&n<=max;
 if(s.developmentEquipmentSandbox!==undefined&&s.developmentEquipmentSandbox!==true)return false;
 if(s.version!==SCHEMA_VERSION||s.race!=='dwarf'||s.hero!=='布洛克'||!Number.isInteger(s.level)||s.level<1||s.level>=100000||!num(s.xp)||!num(s.gold)||!Number.isInteger(s.location)||s.location<0||s.location>2)return false;
 if(s.activeEncounter?.pauseAt!==undefined&&s.running)return false;
 if(s.activeEncounter?.kind==='dungeon'&&(!s.dungeonRun||s.activeEncounter.runId!==s.dungeonRun.runId||s.activeEncounter.dungeonStage!==s.dungeonRun.stage))return false;
 if(!validMonsterLedger(s)||!validCodexCollection(s)||!validLootFilters(s)||!validPendingForgeClaim(s)||!validAreaProgress(s)||!validExpeditionState(s)||!Array.isArray(s.inventory)||s.inventory.length>INVENTORY_SAVE_LIMIT||!s.inventory.every(validEquipment)||!validPendingReforge(s))return false;
 if(s.merchant?.offers?.some(o=>o.type==='equipment'&&o.stock===1&&s.inventory.some(it=>it.id===o.item?.id)))return false;
 if((s.nextActionAt!==undefined&&(!Number.isFinite(s.nextActionAt)||s.nextActionAt<0||s.nextActionAt>1e15))||(s.restResume!==undefined&&typeof s.restResume!=='boolean')||(s.nextBattleAt!==undefined&&(!Number.isFinite(s.nextBattleAt)||s.nextBattleAt<0||s.nextBattleAt>1e15))||!validRecipes(s)||!validEncounter(s.activeEncounter)||!validPotions(s)||!validHealth(s)||!validLoadoutSlots(s)||(s.merchant!==undefined&&!validMerchant(s.merchant)))return false;
 if(new Set(s.inventory.map(i=>i.id)).size!==s.inventory.length||!s.equip||Object.keys(s.equip).length!==SOCKETS.length||!SOCKETS.every(k=>s.equip[k]===null||s.inventory.some(i=>i.id===s.equip[k]&&i.slot===SOCKET_TYPE[k])))return false;
 const equipped=Object.values(s.equip).filter(Boolean);if(new Set(equipped).size!==equipped.length)return false;
 return validSkillProgression(s)&&validSkillSlots(s.skills,s.conditions)&&s.skills.every(k=>k===null||skillUnlocked(s,k))&&validMaterials(s)&&(s.offlineLuck===undefined||(Number.isInteger(s.offlineLuck)&&num(s.offlineLuck,10)))&&validTalents(s)&&validConsumables(s)&&['bossWins','bossReady','normalWins'].every(k=>Array.isArray(s[k])&&s[k].length===3&&s[k].every(n=>num(n,1e15)))&&Array.isArray(s.chapters)&&s.chapters.every(n=>Number.isInteger(n)&&n>=0&&n<3)&&Array.isArray(s.chronicle)&&s.chronicle.length<=100&&s.chronicle.every(t=>typeof t==='string'&&t.length<2000)&&num(s.kills)&&num(s.stock,3)&&num(s.lastSeen,1e15)&&[0,1].includes(s.momentum)&&typeof s.running==='boolean';
 }catch{return false;}
}

export function grantDevelopmentSupport(s){if(!validSave(s)||s.testGrants?.[DEVELOPMENT_GRANT_ID]||s.gold>1e12-5000||(s.bonusTalentPoints??0)>1000000-30||(s.consumables?.memoryFruit??0)>1e9-3)return false;normalizeTalents(s);s.gold+=5000;s.bonusTalentPoints=(s.bonusTalentPoints??0)+30;s.consumables.memoryFruit+=3;s.testGrants={...s.testGrants,[DEVELOPMENT_GRANT_ID]:true};return true;}

export function skillUnlockLevelForBuild(id){const b=BUILD.find(x=>x.id===id);return b?Math.max(...b.skills.filter(Boolean).map(k=>SKILL_UNLOCK_LEVELS[k])):null;}
export function collectSkillUnlockNotices(s){return collectSkillUnlockKeys(s).map(key=>({key,name:SKILLS[key].name,level:SKILL_UNLOCK_LEVELS[key]}));}

function batchSaleEligible(s,it,slot,qualities){
 return it.slot===slot&&qualities.includes(it.rarity)&&!it.locked&&!Object.values(s.equip).includes(it.id)&&!isProtected(s,it.id);
}
export function quoteBatchSale(s,slot,qualities){
 if(!validBatchSelection(slot,qualities,SLOTS)||!validSave(s))return null;
 const entries=s.inventory.filter(it=>batchSaleEligible(s,it,slot,qualities)).map(it=>({id:it.id,fingerprint:equipmentFingerprint(it),value:sellValue(it)}));
 const quote={version:1,slot,qualities:[...qualities].sort((a,b)=>a-b),entries,count:entries.length,total:entries.reduce((n,e)=>n+e.value,0)};
 return validBatchQuote(quote,SLOTS)?quote:null;
}
export function executeBatchSale(s,quote){
 if(!validBatchQuote(quote,SLOTS)||quote.count===0||!validSave(s)||s.gold+quote.total>1e12||!Number.isFinite(s.gold+quote.total))return null;
 for(const entry of quote.entries){const it=s.inventory.find(x=>x.id===entry.id);if(!it||!batchSaleEligible(s,it,quote.slot,quote.qualities)||sellValue(it)!==entry.value||equipmentFingerprint(it)!==entry.fingerprint)return null;}
 // Capture current-held legacy history only after the entire quote passes.
 if(!normalizeCodexCollection(s))return null;
 const ids=quote.entries.map(e=>e.id),sold=new Set(ids);s.inventory=s.inventory.filter(it=>!sold.has(it.id));s.gold+=quote.total;
 return {ok:true,ids,count:quote.count,total:quote.total,gold:quote.total};
}
