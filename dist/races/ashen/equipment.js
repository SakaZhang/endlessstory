const pieces=['helm','armor','gloves','boots'],labels={helm:'冠',armor:'甲',gloves:'握',boots:'履',ring:'环',amulet:'坠',core:'核'};
export const sets=[
{id:'ashen.caldera',name:'赤脉泄压',branch:'heat',description:'四片矿甲沿热脉留出泄压孔。',two:{description:'热量积蓄技能额外获得5热量。'},four:{description:'消耗热量的伤害技能提高15%伤害；退火壳提高20%护盾。'}},
{id:'ashen.strata',name:'断层重构',branch:'shell',description:'交错岩层将碎裂变成下一次重构的材料。',two:{description:'凝岩披甲额外获得1岩片。'},four:{description:'裂壳横击与岩壳裂变提高15%伤害；碎壳重构提高20%治疗。'}},
{id:'ashen.prism',name:'三相晶格',branch:'crystal',description:'明暗晶面以细银纹相连，回应有序的敲击。',two:{description:'叩晶、折光脉与沉影脉提高8%伤害。'},four:{description:'同频护幕与晶脉接续提高20%效果；三相回响提高15%伤害。'}}
];
const scatter=[
['weapon','盐纹护臂','armguard_balanced','armguard'],['weapon','赤脉护臂','armguard_attack','armguard'],['weapon','鸣晶护臂','armguard_balanced','armguard'],['weapon','玄壳护臂','armguard_defensive','armguard'],['weapon','沉岩锤','hammer_defensive','hammer'],['weapon','琉心短锤','hammer_balanced','hammer'],
['helm','风蚀护额','helm_armor'],['helm','凝露石冠','helm_vitality'],['helm','黑曜面盔','helm_armor'],['helm','白盐头环','helm_vitality'],
['armor','孔岩护身','armor_armor'],['armor','盐层软甲','armor_vitality'],['armor','赤纹胸甲','armor_armor'],['armor','沉辉晶衣','armor_vitality'],
['gloves','陶石掌套','gloves_armor'],['gloves','琉砂指护','gloves_vitality'],['gloves','黑玻战握','gloves_armor'],['gloves','活脉护手','gloves_vitality'],
['boots','云母短靴','boots_vitality'],['boots','玄岩重履','boots_armor'],['boots','盐风足甲','boots_armor'],['boots','晶砂轻履','boots_vitality'],
['ring','余炭戒','ring_attack'],['ring','鸣晶指环','ring_element'],['ring','白盐骨环','ring_survival'],['ring','折辉指轮','ring_element'],['ring','孔纹石戒','ring_survival'],
['amulet','赤矿吊坠','amulet_attack'],['amulet','沉辉晶坠','amulet_element'],['amulet','凝露盐符','amulet_survival'],['amulet','逆风盐结坠','amulet_element'],['amulet','陶石护符','amulet_survival'],['amulet','琉砂双晶坠','amulet_attack'],
['core','熔核','core_molten'],['core','岩核','core_stone'],['core','晶核','core_crystal']];
export const equipment=scatter.map(([slot,name,baseVariant,weaponType],i)=>{const id=`ashen.scatter.${String(i+1).padStart(2,'0')}`;return {id,name,slot,baseVariant,weaponType:weaponType??null,originRace:'ashen',kind:'scatter',setId:null,description:`${name}保留了荒原矿层的天然纹路，磨亮的边缘与暗色石面相衬。`,pixelAppearance:`细密矿纹、清晰${slot}轮廓、黑曜与琥珀晶面`,visualVariant:id,visualKey:id,iconKey:slot,...(slot==='core'?{raceRestriction:'ashen'}:{})};});
for(const set of sets)for(const slot of pieces){const id=set.id+'.'+slot;equipment.push({id,name:set.name+'·'+labels[slot],slot,weaponType:null,baseVariant:slot+'_'+(set.branch==='crystal'?'vitality':'armor'),originRace:'ashen',kind:'set',setId:set.id,description:set.description,visualVariant:id,visualKey:id,iconKey:slot,minimumArea:3,quality:3,special:null});}
// Boss cores share the single regional legendary pool. Story core is never a pool candidate.
export const legendaries=[
{id:'ashen-molten-core',ready:true,name:'余烬·不灭薪',slot:'core',baseVariant:'core_molten',originRace:'ashen',raceRestriction:'ashen',exclusiveId:'ashen-ember-fuel',exclusiveName:'不灭薪',source:'own-race-boss',fixedEffect:{type:'moltenAttackStacks'},description:'黑曜矿壳包裹着不曾冷却的赤色矿心。',exclusive:{description:'累计消耗30热量获得1层攻击增益，每层20%，最多3层（60%）。每次触发延长6秒；满层继续延长时长，未满30的消耗保留。卸下清空。'}},
{id:'ashen-stone-core',ready:true,name:'负山·长眠垒',slot:'core',baseVariant:'core_stone',originRace:'ashen',raceRestriction:'ashen',exclusiveId:'ashen-mountain-rest',exclusiveName:'长眠垒',source:'own-race-boss',description:'沉重岩层合拢成核，金色脉络隐于层间。',exclusive:{description:'敌方直接攻击击破护盾时，获得2岩片并恢复4%最大生命；8秒战斗冷却。护盾自然到期不触发。'}},
{id:'ashen-crystal-core',ready:true,name:'折曦·三声遗响',slot:'core',baseVariant:'core_crystal',originRace:'ashen',raceRestriction:'ashen',exclusiveId:'ashen-prism-beam',exclusiveName:'三声遗响',source:'own-race-boss',equipmentSkill:{id:'ashen-prism-beam',cooldownMs:30000,ignoresArmor:true,ignoresElementResistance:true,enabled:true,coefficient:2,scope:'single',automatic:true,usesActiveSlot:false},description:'明暗晶面折射出交织的三束微光。',exclusive:{description:'装备后每30秒战斗时间自动向当前目标释放200%攻击力光线，无视护甲和元素抗性，仍先扣护盾。不占主动技能槽；卸下重置计时。'}},
{id:'ashen-primal-core',ready:true,name:'原初核心',slot:'core',baseVariant:'core_primal',originRace:'ashen',raceRestriction:'ashen',exclusiveId:'ashen-primal-power',exclusiveName:'原初之力',source:'main-story',questOnly:true,unique:true,ordinaryAffixCount:0,fixedEffect:{type:'unskilledAttackMultiplier',multiplier:2},description:'尚未留下任何刻痕的原初矿心。',exclusive:{description:'不装备任何主动或被动技能时，攻击力翻倍。只提供基础属性，不附带随机普通词条。主线获取尚未开放。'}}
];
export const coreVariants={core_primal:{slot:'core',atk:1/3,armor:1/3,hp:1/3},core_molten:{slot:'core',atk:.5,armor:.5,hp:0},core_stone:{slot:'core',atk:0,armor:.5,hp:.5},core_crystal:{slot:'core',atk:.5,armor:0,hp:.5}};
export const weaponVariants={armguard_balanced:{slot:'weapon',atk:.75,armor:.15,hp:.10},armguard_attack:{slot:'weapon',atk:.85,armor:.10,hp:.05},armguard_defensive:{slot:'weapon',atk:.65,armor:.25,hp:.10}};
// Historical planner hook is intentionally a no-op: live mechanics use item-scoped event reducers.
export function modifyLegendaryPlan(plan){return structuredClone(plan);}

// Ordinary rings share one item family; sockets are equip destinations, not drop types.
equipment.push(...[
  {
    "id": "ashen.scatter.37",
    "name": "熔纹曜环",
    "slot": "ring",
    "weaponType": null,
    "baseVariant": "ring_attack",
    "originRace": "ashen",
    "kind": "scatter",
    "setId": null,
    "description": "迁行者从冷却的黑曜脉中磨出戒圈，一道橙红矿纹仍指向昔日火山的方向。",
    "pixelAppearance": "黑曜棱面、橙红熔纹、三角琥珀晶",
    "visualVariant": "ashen.scatter.37",
    "visualKey": "ashen.scatter.37",
    "iconKey": "ring"
  }
]);
