const slots=['weapon','helm','armor','gloves','boots','ring','amulet'];
const names={weapon:['露冠短弓','盘藤长弓','月痕猎弓','镜叶复弓','青根法杖','月井晶杖','炭蕊灵杖','回声枝杖'],helm:['露花额冠','鹿角林冠','月银叶冠','翠枝轻冠','暮根兜帽','星蕨环冠'],armor:['林行皮甲','月井银衫','暮枝猎衣','镜叶轻铠','炭芽战衣','回声织甲'],gloves:['露叶护手','银藤指套','逐影猎手','月瓣手套'],boots:['露花行靴','月银轻靴','根缚猎靴','镜夜长靴'],ring:['翠芽戒','月井环','花誓指环','根银戒'],amulet:['新月叶坠','棱晶心坠','翠叶挂饰','双月露链']};
const artStarts={weapon:0,helm:8,armor:12,gloves:16,boots:20,ring:24,amulet:28};
export const equipment=[];export const equipmentArt={};
for(const slot of slots)names[slot].forEach((name,i)=>{const id=`elf_scatter_${slot}_${i+1}`,weaponType=slot==='weapon'?(i<4?'bow':'staff'):null;const baseVariant=slot==='weapon'?(weaponType==='bow'?(i%2?'bow_attack':'bow_balanced'):(i%2?'staff_element':'staff_balanced')):slot==='ring'||slot==='amulet'?`${slot}_${['attack','element','survival'][i%3]}`:`${slot}_${i%2?'vitality':'armor'}`;equipment.push({id,name,slot,...(weaponType?{weaponType}:{}),baseVariant,originRace:'elf',kind:'scatter',setId:null,description:`${name}以暮枝林庭的根银、藤革和叶纹工艺制成，适合长期巡林。`,pixelAppearance:'精灵根木与月银工艺，独立像素图标',visualVariant:id,visualKey:id,iconKey:slot});equipmentArt[id]=`races/elf/assets/icon-${String(artStarts[slot]+(i%4)+(slot==='weapon'&&i>=4?4:0)).padStart(2,'0')}.png`;});
export const sets=[{id:'elf_arrow',name:'逐叶弦歌',branch:'bow',description:'连击箭序套装；两件强化弓系技能，四件强化后续箭。',two:{skillBranch:'bow',damageMultiplier:1.1},four:{followupHitMultiplier:1.18}},{id:'elf_prism',name:'六相月庭',branch:'elements',description:'元素轮转套装；两件强化元素技能，四件奖励不同元素的接续。',two:{skillBranch:'elements',damageMultiplier:1.1},four:{switchedElementMultiplier:1.15}},{id:'elf_root',name:'心木共鸣',branch:'staff',description:'物理与元素分段套装；两件强化杖系，四件强化元素段与护盾。',two:{skillBranch:'staff',damageMultiplier:1.1},four:{elementalSegmentMultiplier:1.2,shieldMultiplier:1.2}}];
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
