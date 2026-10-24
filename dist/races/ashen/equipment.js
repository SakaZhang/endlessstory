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
export const legendaries=[
{id:'ashen-veinbreaker',ready:true,name:'断脉者 · 岩潮',slot:'weapon',baseVariant:'hammer_balanced',weaponType:'hammer',originRace:'ashen',exclusiveId:'ashen-pressure-return',description:'旧锤柄刻着沿荒原迁行者留下的短线；每一条都停在完整的矿脉之前。',lore:'锤面凹陷处积着不会轻易抖落的金色晶砂。',source:'own-race-boss',exclusive:{description:'熔核过载、裂壳横击和岩壳裂变的直接伤害提高12%；不产生额外施法。'}},
{id:'ashen-dusk-prism',ready:true,name:'暮辉之棱',slot:'amulet',baseVariant:'amulet_element',originRace:'ashen',exclusiveId:'ashen-ordered-light',description:'三层晶片并不同时发亮；敲击其中一层，光会在另外两层缓慢移行。',lore:'荒原行者把它当作寻找同伴的无声信号。',source:'own-race-boss',exclusive:{description:'同频护幕、晶脉接续与退火壳的护盾或治疗提高15%。'}}
];
export const coreVariants={core_molten:{slot:'core',atk:.5,armor:.5,hp:0},core_stone:{slot:'core',atk:0,armor:.5,hp:.5},core_crystal:{slot:'core',atk:.5,armor:0,hp:.5}};
export const weaponVariants={armguard_balanced:{slot:'weapon',atk:.75,armor:.15,hp:.10},armguard_attack:{slot:'weapon',atk:.85,armor:.10,hp:.05},armguard_defensive:{slot:'weapon',atk:.65,armor:.25,hp:.10}};
export function modifyLegendaryPlan(plan,{exclusiveIds=[]}={}){const p=structuredClone(plan);if(exclusiveIds.includes('ashen-pressure-return')&&['ashen.overload','ashen.cleave','ashen.fracture'].includes(p.skillId))for(const a of p.actions)if(a.kind==='hit')a.coefficient*=1.12;if(exclusiveIds.includes('ashen-ordered-light')&&['ashen.chorus','ashen.mend','ashen.anneal'].includes(p.skillId))for(const a of p.actions)for(const e of a.effects??[])if(['shield','heal'].includes(e.type))e.amount*=1.15;return p;}
