const slots=['weapon','helm','armor','gloves','boots','ring','amulet'];
const names={weapon:['钩牙短刃','旧铆单剑','沉铜刺匕','断响细剑','赤筋短刀','黏晶护手剑'],helm:['苔绳兜帽','旧铆护额','冷孢灯帽','盲膜罩帽','渡河铜冠'],armor:['补粮短甲','旧道软胄','沉影夹衣','苦鳃围甲','绞索护衣'],gloves:['钩牙指套','韧苔手绑','砂铜护腕','赤筋扣手','黏晶掌套'],boots:['盲膜软履','渡河绑靴','轻苔短靴','影隙踏靴','旧道铆靴'],ring:['钩骨指环','回声铜环','冷光孢环','赤须结环','黏晶戒托'],amulet:['余粮护符','沉砂坠','灰帽小囊','断响佩石','蜕影结牌']};
export const equipment=[];
for(const slot of slots)for(const [i,name]of names[slot].entries()){
 const id=`goblin_scatter_${slot}_${i+1}`,weaponType=slot==='weapon'?(i%2?'sword':'dagger'):null;
 const baseVariant=weaponType?weaponType+'_balanced':slot==='ring'||slot==='amulet'?slot+'_'+['attack','survival','element'][i%3]:slot+'_'+(i%2?'armor':'vitality');
 equipment.push({id,name,slot,weaponType,baseVariant,originRace:'goblin',kind:'scatter',setId:null,description:`裂穴斥候修补使用的${name}；磨圆的扣件避免行动时碰响，不限制其他种族穿戴。`,pixelAppearance:'苔绿、旧铜与暗紫菌光；旧皮绳结和实用修补纹理',visualVariant:id,visualKey:id,iconKey:slot});
}
export const sets=[
{id:'goblin_spore',name:'苦菌行者',branch:'poison',description:'把菌浆留在该留的伤口上，而非追求更猛烈的毒。',two:{description:'叠毒技能的削甲/减攻持续时间增加2秒。'},four:{description:'涂菌刺命中额外补一层毒；仍上限5层、每层2%每3秒。'}},
{id:'goblin_ambush',name:'余粮斥候',branch:'ambush',description:'轻装先手，留粮续行，抓住敌阵最薄的一瞬。',two:{description:'伏击分支直接伤害提高8%。'},four:{description:'首击与收尾割条件成立时额外提高25%直伤，穿隙步延长2秒。'}},
{id:'goblin_snare',name:'旧索匠',branch:'contraption',description:'把废弃铜簧和兽筋绳变成活路。',two:{description:'机关的命中/攻击削弱提高15%。'},four:{description:'伏索多一次触发次数；每次反击伤害降低15%，有限次数不递归。'}}
];
for(const set of sets)for(const [i,slot]of ['helm','armor','gloves','boots'].entries()){
 const id=`${set.id}_${slot}`;equipment.push({id,name:set.name+['兜帽','轻甲','手套','软靴'][i],slot,weaponType:null,baseVariant:slot+'_'+(set.branch==='contraption'?'armor':'vitality'),originRace:'goblin',kind:'set',setId:set.id,description:set.description,pixelAppearance:'菌紫、旧铜、苔绿的套装工艺',visualVariant:id,visualKey:id,iconKey:slot});
}
export const legendaries=[
{id:'goblin-silent-ration',ready:true,name:'留一口 · 无声刃',slot:'weapon',baseVariant:'dagger_balanced',weaponType:'dagger',originRace:'goblin',exclusiveId:'goblin-ration-opening',description:'刃背刻着分粮刻度；旧斥候用它切过食物，也割断过困住同伴的绳。留在刃背的刻度提醒持有者为同伴留一口。',exclusiveName:'先借一口',exclusiveDescription:'对每名敌人的首次成功直接命中，先窃取当前护盾40%（至多自身最大生命8%）转为6秒护盾；敌人无盾时追加70%攻击的物理刺击。追加可暴击、吸血，不触发死神、连施或其他传说追击。',fixedEffect:{type:'firstTargetShieldTheft',shieldFraction:.4,maxHpCap:.08,durationMs:6000,fallbackCoefficient:.7}},
{id:'goblin-silent-steps',ready:true,name:'溜影 · 无声足',slot:'boots',baseVariant:'boots_vitality',originRace:'goblin',exclusiveId:'goblin-thief-evasion',description:'哥布林盗贼把软苔缝进靴底，偷走守卫腰间的钥匙后，贴着墙根悄然脱身。追来的刀锋只割下了一缕鞋带。',exclusiveName:'溜影',exclusiveDescription:'装备时固定提供闪避+100；与其他闪避数值共同按现有递减公式计算，并非100%闪避。卸下即失效，同名传说效果不叠加。',fixedEffect:{type:'statBonus',stats:{dodgeRating:100}}}
];
export function modifySkillPlan(plan,{setCounts={},targets=[]}={}){
 if(!plan)return null;const p=structuredClone(plan),branch=p.skillId.split('.')[1],spore=setCounts.goblin_spore??0,ambush=setCounts.goblin_ambush??0,snare=setCounts.goblin_snare??0;
 for(const a of p.actions){
  if(ambush>=2&&['opening_cut','finish_cut','stolen_moment','crossing_blade'].includes(branch)&&a.kind==='hit')a.coefficient*=1.08;
  const t=targets.find(t=>t.id===a.targetId),ratio=t?.maxHp>0?t.hp/t.maxHp:1;
  if(ambush>=4&&a.kind==='hit'&&((branch==='opening_cut'&&ratio>.75)||(branch==='finish_cut'&&ratio<.3)))a.coefficient*=1.25;
  if(spore>=4&&branch==='venom_cut'&&a.effects?.some(e=>e.type==='poison'))a.effects.push(structuredClone(a.effects.find(e=>e.type==='poison')));
  for(const ef of a.effects??[]){
   if(spore>=2&&['venom_cut','bitter_wound','mire_seal'].includes(branch)&&['armorDown','attackDown'].includes(ef.type))ef.durationMs+=2000;
   if(ambush>=4&&branch==='seam_step')ef.durationMs+=2000;
   if(ef.type==='raceReactive'){if(snare>=2){ef.hitDown*=1.15;ef.attackDown*=1.15;}if(snare>=4&&branch==='snare_wire'){ef.charges++;ef.coefficient*=.85;}}
  }
 }return p;
}

// Ordinary rings share one item family; sockets are equip destinations, not drop types.
equipment.push(...[
  {
    "id": "goblin_scatter_ring_6",
    "name": "铜簧菌戒",
    "slot": "ring",
    "weaponType": null,
    "baseVariant": "ring_element",
    "originRace": "goblin",
    "kind": "scatter",
    "setId": null,
    "description": "裂穴匠人用废铜簧绕成戒圈，再以苔线绑住一朵冷光菌，照亮最窄的锁孔。",
    "pixelAppearance": "歪铜戒圈、紫菌盖、绿色绳结",
    "visualVariant": "goblin_scatter_ring_6",
    "visualKey": "goblin_scatter_ring_6",
    "iconKey": "ring"
  }
]);

// Append-only catalog parity: stable IDs keep existing saves and art references intact.
// These are ordinary salvage pieces, using the existing shared stat budgets.
for (const [id,name,slot,baseVariant,weaponType,description,pixelAppearance] of [
 ['goblin_scatter_weapon_7','锁舌窄匕','weapon','dagger_balanced','dagger','盗贼把废锁的锁舌磨成窄刃；柄上的旧钥匙孔被苔绳封住，免得逃跑时吹响。','窄锁舌刃、方孔铜柄、苔绳绑带'],
 ['goblin_scatter_weapon_8','断锯短剑','weapon','sword_balanced','sword','拆车场剩下的半截锯条被修成短剑，只有朝外的一侧留齿，贴身藏起时不会割破暗袋。','断锯齿剑身、歪斜护手、旧皮柄'],
 ['goblin_scatter_weapon_9','弯钉刺','weapon','dagger_balanced','dagger','从货箱上起出的弯钉被反复敲直；尾端仍保留一个钩，方便盗贼从袖口迅速抽出。','细长铁钉尖、弯钩尾柄、铜丝束口'],
 ['goblin_scatter_weapon_10','铜尺藏锋','weapon','sword_balanced','sword','货摊上的旧铜尺少了一边刻度，多了一道锋口；持有者总先量门缝，再决定从哪里溜走。','平直铜尺刃、残缺刻线、短横护手'],
 ['goblin_scatter_weapon_11','瓶颈割刀','weapon','dagger_balanced','dagger','裂穴拾荒者将厚瓶颈包入皮套，只让一段玻璃锋露出；剩下的瓶身还在盛着今晚的菌汤。','弧形绿玻璃刃、瓶口环脊、破皮握柄'],
 ['goblin_scatter_weapon_12','门闩单剑','weapon','sword_balanced','sword','失修仓门的铁闩被磨出了刃，铆头留作护手；偷渡者说它终于学会了替人开路。','宽扁门闩剑、突起铆头、铜扣护手'],
 ['goblin_scatter_weapon_13','鼠牙钩匕','weapon','dagger_balanced','dagger','盗贼用废钩托住一枚巨鼠旧牙，既能割绳，也能把掉进砖缝的铜币勾回来。','弯曲骨牙刃、铜钩底座、细皮绳柄'],
 ['goblin_scatter_weapon_14','车辐细剑','weapon','sword_balanced','sword','弯轮中拆下的钢辐条被锤成细剑，轮毂垫圈成了圆护手；它比原来的车跑得更轻。','长细辐条剑、圆垫圈护手、木柄'],
 ['goblin_scatter_weapon_15','钱袋挑刃','weapon','dagger_balanced','dagger','短刃顶端留着挑绳的小钩，钩口裹了一点软铜；靠墙摸过时，钱袋扣也不会发出碰响。','短弯挑钩刃、软铜钩口、黑皮柄'],
 ['goblin_scatter_weapon_16','铲片护手剑','weapon','sword_balanced','sword','破铲的窄边被切成剑身，宽边弯成护手；失主还在找铲子，裂穴里已经多了一名剑客。','斜切铲片剑、宽弧片护手、旧木握柄'],
 ['goblin_scatter_helm_6','罐沿潜帽','helm','helm_vitality',null,'盗贼把废罐的软沿藏进兜帽，遮住眼上的菌灯反光；帽后的小补丁还能塞下一枚备用钥匙。','低垂苔色兜帽、歪锡罐沿、侧面补丁'],
 ['goblin_scatter_armor_6','暗袋补衣','armor','armor_vitality',null,'每块补布下面都藏着一个暗袋，零钱与开锁针被分开收好；胸前看似装饰的旧扣其实没有扣眼。','短身拼补背心、层叠暗袋、错位铜扣'],
 ['goblin_scatter_gloves_6','窃钥指套','gloves','gloves_vitality',null,'两根指尖露在外面摸索锁齿，其余指节缝着软苔；盗贼只在归还钥匙时才摘下它。','露指皮手套、细铜钥匙、苔垫指节'],
 ['goblin_scatter_boots_6','翻墙绳履','boots','boots_vitality',null,'回收麻绳绕过旧靴底，鞋跟留着攀墙的小环；湿砖上留下的绳纹很快就被苔水抹平。','麻绳交叉绑靴、低软鞋底、后跟铜环'],
 ['goblin_scatter_amulet_6','失锁铜牌','amulet','amulet_survival',null,'只剩半边的锁牌挂在细绳上，盗贼把它当作离开牢房的纪念；背面的旧编号已经磨成了浅坑。','破锁形铜吊牌、断开的锁梁、细苔绳']
]) equipment.push({id,name,slot,baseVariant,weaponType,originRace:'goblin',kind:'scatter',setId:null,description,pixelAppearance,visualVariant:id,visualKey:id,iconKey:slot});
