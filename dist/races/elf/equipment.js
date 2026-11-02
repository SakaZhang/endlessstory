// Item-specific flavor text; mechanics remain in the catalog fields below.
const scatterDescriptions={
  "weapon": [
    "短弓两端刻着露冠花纹，细弦便于在枝叶间收放。",
    "长藤盘住弓臂，握把处只留下一层柔韧的藤皮。",
    "银白弓背留有一弯浅痕，像被林梢截住的月亮。",
    "薄叶形饰片贴合弓臂，弯弓时也不会碰到弓弦。",
    "青色根须沿杖身盘结，握持处被磨得光滑。",
    "杖端嵌着淡蓝井晶，晶体深处封着一线水纹。",
    "花蕊状枝饰托住杖端的弯月，枝缝里留着几片新叶。",
    "中空枝杖敲在石上，会带出一声悠长的低鸣。"
  ],
  "helm": [
    "细枝托住几朵干露花，额前的小坠留下清亮水痕。",
    "自然脱落的鹿角被削薄，沿两侧枝冠向后舒展。",
    "叶片形的银饰层层相叠，内圈衬着柔软藤革。",
    "翠枝弯成轻冠，枝端以细线固定，没有多余的尖刺。",
    "深色兜帽用根纤维织成，帽沿垂下时遮住半边面孔。",
    "星斑蕨叶压入冠圈，银点沿着叶脉散开。"
  ],
  "armor": [
    "柔韧皮甲贴身裁短，肩口留足抬臂拉弓的余地。",
    "银线织进浅色衫布，衣摆沾水后会显出井波般的纹路。",
    "猎衣的深色补片顺着枝纹缝合，远看难辨新旧。",
    "薄叶形甲片彼此搭接，转身时沿腰侧轻轻错开。",
    "战衣领口绣着火后新芽，焦色外层下衬着柔软织布。",
    "空心细枝穿入织甲的边沿，轻叩时有微弱回声。"
  ],
  "gloves": [
    "叶形护片盖住手背，指根留出细缝，方便搭箭。",
    "银藤绕过指节，弯指时顺着细小的环扣滑动。",
    "掌面缝有粗纹皮革，拇指处留下了拉弦的磨痕。",
    "浅色花瓣纹覆住手背，掌心则用耐磨的藤革补强。"
  ],
  "boots": [
    "靴沿压着干露花，鞋面覆了一层挡晨露的薄蜡。",
    "银扣收住轻靴的侧边，鞋底仍用柔软的树皮缝成。",
    "细根绕紧靴筒，系带藏在内侧，不易钩住荆棘。",
    "深色长靴的银边已被擦暗，只有翻起的靴口仍泛着光。"
  ],
  "ring": [
    "细枝沿戒圈托住一枚翠石，两旁的小叶已被磨得圆润。",
    "井蓝小石嵌在银环中，石面透着一圈圈浅淡水纹。",
    "两朵细银花相扣成环，花柄在指腹处交缠。",
    "根银被拉成细丝，沿木戒的天然纹理绕了三周。"
  ],
  "amulet": [
    "新月悬在细链中央，两侧垂下叶形翠饰，叶脉刻得很细。",
    "几块棱晶围着木心扣合，转动时映出深浅不一的光。",
    "细链串起几枚翠叶形饰片，中央的长叶垂在胸前。",
    "两枚月形银片垂在细链上，中间嵌着露珠般的透石。"
  ]
};
const slots=['weapon','helm','armor','gloves','boots','ring','amulet'];
const names={weapon:['露冠短弓','盘藤长弓','月痕猎弓','镜叶复弓','青根法杖','月井晶杖','炭蕊灵杖','回声枝杖'],helm:['露花额冠','鹿角林冠','月银叶冠','翠枝轻冠','暮根兜帽','星蕨环冠'],armor:['林行皮甲','月井银衫','暮枝猎衣','镜叶轻铠','炭芽战衣','回声织甲'],gloves:['露叶护手','银藤指套','逐影猎手','月瓣手套'],boots:['露花行靴','月银轻靴','根缚猎靴','镜夜长靴'],ring:['翠芽戒','月井环','花誓指环','根银戒'],amulet:['新月叶坠','棱晶心坠','翠叶挂饰','双月露链']};
const artStarts={weapon:0,helm:8,armor:12,gloves:16,boots:20,ring:24,amulet:28};
export const equipment=[];export const equipmentArt={};
for(const slot of slots)names[slot].forEach((name,i)=>{const id=`elf_scatter_${slot}_${i+1}`,weaponType=slot==='weapon'?(i<4?'bow':'staff'):null;const baseVariant=slot==='weapon'?(weaponType==='bow'?(i%2?'bow_attack':'bow_balanced'):(i%2?'staff_element':'staff_balanced')):slot==='ring'||slot==='amulet'?`${slot}_${['attack','element','survival'][i%3]}`:`${slot}_${i%2?'vitality':'armor'}`;equipment.push({id,name,slot,...(weaponType?{weaponType}:{}),baseVariant,originRace:'elf',kind:'scatter',setId:null,description:scatterDescriptions[slot][i],pixelAppearance:'精灵根木与月银工艺，独立像素图标',visualVariant:id,visualKey:id,iconKey:slot});equipmentArt[id]=`races/elf/assets/icon-${String(artStarts[slot]+(i%4)+(slot==='weapon'&&i>=4?4:0)).padStart(2,'0')}.png`;});
export const sets=[{id:'elf_arrow',name:'逐叶弦歌',branch:'bow',description:'连击箭序套装；两件强化弓系技能，四件强化后续箭。',two:{skillBranch:'bow',damageMultiplier:1.2},four:{followupHitMultiplier:1.25}},{id:'elf_prism',name:'六相月庭',branch:'elements',description:'元素轮转套装；两件强化元素技能，四件奖励不同元素的接续。',two:{skillBranch:'elements',damageMultiplier:1.2},four:{switchedElementMultiplier:1.25}},{id:'elf_root',name:'心木共鸣',branch:'staff',description:'物理与元素分段套装；两件强化杖系，四件强化元素段与护盾。',two:{skillBranch:'staff',damageMultiplier:1.2},four:{elementalSegmentMultiplier:1.3,shieldMultiplier:1.3}}];
for(const [sidx,set] of sets.entries())for(const [i,slot] of ['helm','armor','gloves','boots'].entries()){const id=`${set.id}_${slot}`;equipment.push({id,name:set.name+['额冠','长衣','护手','行靴'][i],slot,baseVariant:`${slot}_${sidx===2?'vitality':'armor'}`,originRace:'elf',kind:'set',setId:set.id,description:set.description+'仅第三区起普通/首领随机掉落，至臻品质，无特殊词条。',pixelAppearance:'林庭四件套叶纹图腾',visualVariant:id,visualKey:id,iconKey:slot});equipmentArt[id]=`races/elf/assets/icon-${String(artStarts[slot]+sidx).padStart(2,'0')}.png`;}
export const legendaries=[{id:'elf-sixfold-heartwood',ready:true,name:'六相·心木初鸣',slot:'weapon',baseVariant:'staff_balanced',weaponType:'staff',originRace:'elf',exclusiveId:'elf-sixfold-charge',exclusiveName:'六相蓄鸣',description:'第一位守林者将六种光留在杖端。每一种真实的元素回应，都为下一次攻击积蓄力量。',lore:'历代守林者将这柄杖视作交接守护职责的凭证。',exclusiveDescription:'持杖时六种元素伤害提高30%（不含毒素）。实际造成四种不同元素伤害后，下一次成功施放的攻击技能全部直接伤害翻倍（物理与元素段，不含毒素）；辅助、治疗与自身增益不消耗。触发蓄满的当次不翻倍；翻倍攻击可重新积累元素，跨战斗保留，卸下清空。'},{id:'elf-last-string',ready:true,name:'归林·最后一弦',slot:'weapon',baseVariant:'bow_attack',weaponType:'bow',originRace:'elf',exclusiveId:'elf-last-string-pierce',exclusiveName:'归林贯弦',description:'归途中的最后一箭穿过密林，只留下一线月银的弦声。',lore:'守林者将最后一弦留给阻挡归途的敌人。',exclusiveDescription:'持弓释放攻击技能时，物理伤害无视目标30%护甲；多段技能对每个目标的最后一段物理伤害再提高50%。不增加攻击次数，不触发额外反击；普通攻击和其他武器不生效。'}];
equipmentArt['elf-sixfold-heartwood']='races/elf/assets/icon-04.png';equipmentArt['elf-last-string']='races/elf/assets/icon-02.png';
export const legendaryPolicy={totalBossPoolProbability:.05,ownRaceOnly:true,repeatsAllowed:true,crossRaceEquipAllowed:true,randomAffixes:4,fixedExclusiveAffixes:1};

// Ordinary rings share one item family; sockets are equip destinations, not drop types.
equipment.push(...[
  {
    "id": "elf_scatter_ring_5",
    "name": "弦月藤戒",
    "slot": "ring",
    "weaponType": null,
    "baseVariant": "ring_element",
    "originRace": "elf",
    "kind": "scatter",
    "setId": null,
    "description": "月庭工匠让细藤沿根银弯月攀生，将夜巡时听见的风声封在淡紫晶中。",
    "pixelAppearance": "根银弯月、淡紫晶面、叶形戒爪",
    "visualVariant": "elf_scatter_ring_5",
    "visualKey": "elf_scatter_ring_5",
    "iconKey": "ring"
  },
  {
    "id": "elf_scatter_ring_6",
    "name": "露根守环",
    "slot": "ring",
    "weaponType": null,
    "baseVariant": "ring_survival",
    "originRace": "elf",
    "kind": "scatter",
    "setId": null,
    "description": "巡林者把折下的老根盘成指环，青露石旁的两片新叶记着归林的季节。",
    "pixelAppearance": "深色盘根、青露石、双嫩叶",
    "visualVariant": "elf_scatter_ring_6",
    "visualKey": "elf_scatter_ring_6",
    "iconKey": "ring"
  }
]);

equipmentArt['elf_scatter_ring_5']='races/elf/assets/elf_scatter_ring_5.png';
equipmentArt['elf_scatter_ring_6']='races/elf/assets/elf_scatter_ring_6.png';

// Catalog parity: additive templates only; existing identities and budget families stay unchanged.
equipment.push(...[
  {
    "id": "elf_scatter_weapon_9",
    "name": "露柳仪弓",
    "slot": "weapon",
    "weaponType": "bow",
    "baseVariant": "bow_balanced",
    "originRace": "elf",
    "kind": "scatter",
    "setId": null,
    "description": "露柳仪弓以暮枝林庭的根银、藤革和叶纹工艺制成，供年轻祭司在巡林和仪式中使用。",
    "pixelAppearance": "林庭根银、叶纹与礼仪工艺，独立像素图标",
    "visualVariant": "elf_scatter_weapon_9",
    "visualKey": "elf_scatter_weapon_9",
    "iconKey": "weapon"
  },
  {
    "id": "elf_scatter_weapon_10",
    "name": "金蕨礼弓",
    "slot": "weapon",
    "weaponType": "bow",
    "baseVariant": "bow_attack",
    "originRace": "elf",
    "kind": "scatter",
    "setId": null,
    "description": "金蕨礼弓以暮枝林庭的根银、藤革和叶纹工艺制成，供年轻祭司在巡林和仪式中使用。",
    "pixelAppearance": "林庭根银、叶纹与礼仪工艺，独立像素图标",
    "visualVariant": "elf_scatter_weapon_10",
    "visualKey": "elf_scatter_weapon_10",
    "iconKey": "weapon"
  },
  {
    "id": "elf_scatter_weapon_11",
    "name": "羽藤巡弓",
    "slot": "weapon",
    "weaponType": "bow",
    "baseVariant": "bow_balanced",
    "originRace": "elf",
    "kind": "scatter",
    "setId": null,
    "description": "羽藤巡弓以暮枝林庭的根银、藤革和叶纹工艺制成，供年轻祭司在巡林和仪式中使用。",
    "pixelAppearance": "林庭根银、叶纹与礼仪工艺，独立像素图标",
    "visualVariant": "elf_scatter_weapon_11",
    "visualKey": "elf_scatter_weapon_11",
    "iconKey": "weapon"
  },
  {
    "id": "elf_scatter_weapon_12",
    "name": "紫芽月弓",
    "slot": "weapon",
    "weaponType": "bow",
    "baseVariant": "bow_attack",
    "originRace": "elf",
    "kind": "scatter",
    "setId": null,
    "description": "紫芽月弓以暮枝林庭的根银、藤革和叶纹工艺制成，供年轻祭司在巡林和仪式中使用。",
    "pixelAppearance": "林庭根银、叶纹与礼仪工艺，独立像素图标",
    "visualVariant": "elf_scatter_weapon_12",
    "visualKey": "elf_scatter_weapon_12",
    "iconKey": "weapon"
  },
  {
    "id": "elf_scatter_weapon_13",
    "name": "青蕨祈杖",
    "slot": "weapon",
    "weaponType": "staff",
    "baseVariant": "staff_balanced",
    "originRace": "elf",
    "kind": "scatter",
    "setId": null,
    "description": "青蕨祈杖以暮枝林庭的根银、藤革和叶纹工艺制成，供年轻祭司在巡林和仪式中使用。",
    "pixelAppearance": "林庭根银、叶纹与礼仪工艺，独立像素图标",
    "visualVariant": "elf_scatter_weapon_13",
    "visualKey": "elf_scatter_weapon_13",
    "iconKey": "weapon"
  },
  {
    "id": "elf_scatter_weapon_14",
    "name": "银露环杖",
    "slot": "weapon",
    "weaponType": "staff",
    "baseVariant": "staff_element",
    "originRace": "elf",
    "kind": "scatter",
    "setId": null,
    "description": "银露环杖以暮枝林庭的根银、藤革和叶纹工艺制成，供年轻祭司在巡林和仪式中使用。",
    "pixelAppearance": "林庭根银、叶纹与礼仪工艺，独立像素图标",
    "visualVariant": "elf_scatter_weapon_14",
    "visualKey": "elf_scatter_weapon_14",
    "iconKey": "weapon"
  },
  {
    "id": "elf_scatter_weapon_15",
    "name": "琥花枝杖",
    "slot": "weapon",
    "weaponType": "staff",
    "baseVariant": "staff_balanced",
    "originRace": "elf",
    "kind": "scatter",
    "setId": null,
    "description": "琥花枝杖以暮枝林庭的根银、藤革和叶纹工艺制成，供年轻祭司在巡林和仪式中使用。",
    "pixelAppearance": "林庭根银、叶纹与礼仪工艺，独立像素图标",
    "visualVariant": "elf_scatter_weapon_15",
    "visualKey": "elf_scatter_weapon_15",
    "iconKey": "weapon"
  },
  {
    "id": "elf_scatter_weapon_16",
    "name": "紫种根杖",
    "slot": "weapon",
    "weaponType": "staff",
    "baseVariant": "staff_element",
    "originRace": "elf",
    "kind": "scatter",
    "setId": null,
    "description": "紫种根杖以暮枝林庭的根银、藤革和叶纹工艺制成，供年轻祭司在巡林和仪式中使用。",
    "pixelAppearance": "林庭根银、叶纹与礼仪工艺，独立像素图标",
    "visualVariant": "elf_scatter_weapon_16",
    "visualKey": "elf_scatter_weapon_16",
    "iconKey": "weapon"
  },
  {
    "id": "elf_scatter_gloves_5",
    "name": "青露祷手",
    "slot": "gloves",
    "baseVariant": "gloves_armor",
    "originRace": "elf",
    "kind": "scatter",
    "setId": null,
    "description": "青露祷手以暮枝林庭的根银、藤革和叶纹工艺制成，供年轻祭司在巡林和仪式中使用。",
    "pixelAppearance": "林庭根银、叶纹与礼仪工艺，独立像素图标",
    "visualVariant": "elf_scatter_gloves_5",
    "visualKey": "elf_scatter_gloves_5",
    "iconKey": "gloves"
  },
  {
    "id": "elf_scatter_gloves_6",
    "name": "紫根月手",
    "slot": "gloves",
    "baseVariant": "gloves_vitality",
    "originRace": "elf",
    "kind": "scatter",
    "setId": null,
    "description": "紫根月手以暮枝林庭的根银、藤革和叶纹工艺制成，供年轻祭司在巡林和仪式中使用。",
    "pixelAppearance": "林庭根银、叶纹与礼仪工艺，独立像素图标",
    "visualVariant": "elf_scatter_gloves_6",
    "visualKey": "elf_scatter_gloves_6",
    "iconKey": "gloves"
  },
  {
    "id": "elf_scatter_boots_5",
    "name": "白蕨礼靴",
    "slot": "boots",
    "baseVariant": "boots_armor",
    "originRace": "elf",
    "kind": "scatter",
    "setId": null,
    "description": "白蕨礼靴以暮枝林庭的根银、藤革和叶纹工艺制成，供年轻祭司在巡林和仪式中使用。",
    "pixelAppearance": "林庭根银、叶纹与礼仪工艺，独立像素图标",
    "visualVariant": "elf_scatter_boots_5",
    "visualKey": "elf_scatter_boots_5",
    "iconKey": "boots"
  },
  {
    "id": "elf_scatter_boots_6",
    "name": "紫瓣根靴",
    "slot": "boots",
    "baseVariant": "boots_vitality",
    "originRace": "elf",
    "kind": "scatter",
    "setId": null,
    "description": "紫瓣根靴以暮枝林庭的根银、藤革和叶纹工艺制成，供年轻祭司在巡林和仪式中使用。",
    "pixelAppearance": "林庭根银、叶纹与礼仪工艺，独立像素图标",
    "visualVariant": "elf_scatter_boots_6",
    "visualKey": "elf_scatter_boots_6",
    "iconKey": "boots"
  },
  {
    "id": "elf_scatter_amulet_5",
    "name": "柳银籽坠",
    "slot": "amulet",
    "baseVariant": "amulet_element",
    "originRace": "elf",
    "kind": "scatter",
    "setId": null,
    "description": "柳银籽坠以暮枝林庭的根银、藤革和叶纹工艺制成，供年轻祭司在巡林和仪式中使用。",
    "pixelAppearance": "林庭根银、叶纹与礼仪工艺，独立像素图标",
    "visualVariant": "elf_scatter_amulet_5",
    "visualKey": "elf_scatter_amulet_5",
    "iconKey": "amulet"
  },
  {
    "id": "elf_scatter_amulet_6",
    "name": "琥花月坠",
    "slot": "amulet",
    "baseVariant": "amulet_survival",
    "originRace": "elf",
    "kind": "scatter",
    "setId": null,
    "description": "琥花月坠以暮枝林庭的根银、藤革和叶纹工艺制成，供年轻祭司在巡林和仪式中使用。",
    "pixelAppearance": "林庭根银、叶纹与礼仪工艺，独立像素图标",
    "visualVariant": "elf_scatter_amulet_6",
    "visualKey": "elf_scatter_amulet_6",
    "iconKey": "amulet"
  }
]);
// Independent generated raster identities, including set pieces and legendaries.
for(const id of ["elf_scatter_weapon_9","elf_scatter_weapon_10","elf_scatter_weapon_11","elf_scatter_weapon_12","elf_scatter_weapon_13","elf_scatter_weapon_14","elf_scatter_weapon_15","elf_scatter_weapon_16","elf_scatter_gloves_5","elf_scatter_gloves_6","elf_scatter_boots_5","elf_scatter_boots_6","elf_scatter_amulet_5","elf_scatter_amulet_6","elf_scatter_helm_5","elf_scatter_helm_6","elf_scatter_armor_5","elf_scatter_armor_6","elf_arrow_helm","elf_arrow_armor","elf_arrow_gloves","elf_arrow_boots","elf_prism_helm","elf_prism_armor","elf_prism_gloves","elf_prism_boots","elf_root_helm","elf_root_armor","elf_root_gloves","elf_root_boots","elf-last-string","elf-sixfold-heartwood"])equipmentArt[id]=Object.fromEntries([32,48,64].map(size=>[size,`races/elf/assets/equipment/${size}/${id}.png`]));
