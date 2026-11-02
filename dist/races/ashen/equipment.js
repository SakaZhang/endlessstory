// Item-specific flavor text; mechanics remain in the catalog fields below.
const scatterDescriptions=[
  "护臂外缘磨去尖角，浅白盐纹顺着肘侧延伸。",
  "赤色矿脉贯穿护臂，关节处的岩片错开，留出活动的间隙。",
  "细晶嵌在护臂内层，轻叩外壳时能听见清脆的回声。",
  "玄色岩壳层层包住前臂，最外层留着几处崩口。",
  "锤头取自沉重的整块岩石，柄端缠着防滑的粗绳。",
  "半透明锤头包着一团深色矿心，短柄握处已经磨亮。",
  "护额表面的浅坑仍带着风蚀的痕迹，内缘却已磨平。",
  "石冠凹处积着细小水珠，清晨才容易看见。",
  "黑曜薄片遮住面颊，眼前留出两道狭长开口。",
  "白盐晶簇沿头环向上伸展，衬带隔开了粗糙的内壁。",
  "多孔岩板以皮绳串联，孔隙间残着深色矿砂。",
  "薄盐层夹在软衬之间，弯腰时沿着缝线分开。",
  "赤纹岩板贴合胸腹，边角以小铆扣连在一起。",
  "细碎晶片缝进暗色衣料，只有转身时才闪出微光。",
  "陶石护片覆盖掌根，指节处仍用柔韧的织带连接。",
  "琉砂烧成薄片护住手指，边缘磨得像旧玻璃一样圆滑。",
  "黑色玻璃护住手背，掌面衬垫留下长年握柄的纹路。",
  "矿脉沿护手的裂隙伸展，新生的一段颜色稍浅。",
  "云母薄片压在靴筒外层，弯折处露出细细的银线。",
  "厚岩护片包住脚背，落地时会带出低沉的磕响。",
  "足甲向上收拢，挡住贴地刮来的碎盐与砂粒。",
  "晶砂嵌在柔软鞋底，磨平的边缘又补过一层。",
  "暗红矿炭嵌入戒圈，晶面中央透出余火般的亮色。",
  "指环内嵌一圈细晶，碰到石面时会轻轻作响。",
  "白盐覆住骨环的旧纹，内侧仍能摸到细密的孔隙。",
  "棱面绕指轮交错排列，一束光会被分成几道细线。",
  "石戒表面保留天然小孔，孔口都已仔细磨圆。",
  "赤矿切面朝外，背面磨平，贴着衣襟也不硌人。",
  "暗色晶坠悬在细绳上，深处的光比表面更清晰。",
  "盐符中央刻有浅槽，凝出的水珠沿槽聚在尖端。",
  "羽状盐晶逆向交叠，细绳绕过根部，避免折断晶尖。",
  "陶石小片刻着简朴的护纹，边角被手指摩挲得发亮。",
  "两块琉砂晶隔着短结悬垂，走动时只会轻轻相触。",
  "厚壳包着缓缓涌动的熔流，壳缝透出暗红的光。",
  "层叠岩片收拢成核，外壳的旧裂隙已被矿质填满。",
  "透明晶簇向内聚合，深处留着数道交错的光纹。"
];
const pieces=['helm','armor','gloves','boots'],labels={helm:'冠',armor:'甲',gloves:'握',boots:'履',ring:'环',amulet:'坠',core:'核'};
export const sets=[
{id:'ashen.caldera',name:'赤脉泄压',branch:'heat',description:'四片矿甲沿热脉留出泄压孔。',two:{description:'热量积蓄技能额外获得5热量，套装可额外储存25热量，总上限125。'},four:{description:'消耗热量的伤害技能提高15%伤害；退火壳提高20%护盾。'}},
{id:'ashen.strata',name:'断层重构',branch:'shell',description:'交错岩层将碎裂变成下一次重构的材料。',two:{description:'凝岩披甲额外获得1岩片，套装可额外储存2岩片，总上限8。'},four:{description:'裂壳横击与岩壳裂变提高15%伤害，岩壳裂变可消耗至多8岩片；碎壳重构提高20%治疗。'}},
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
export const equipment=scatter.map(([slot,name,baseVariant,weaponType],i)=>{const id=`ashen.scatter.${String(i+1).padStart(2,'0')}`;return {id,name,slot,baseVariant,weaponType:weaponType??null,originRace:'ashen',kind:'scatter',setId:null,description:scatterDescriptions[i],pixelAppearance:`细密矿纹、清晰${slot}轮廓、黑曜与琥珀晶面`,visualVariant:id,visualKey:id,iconKey:slot,...(slot==='core'?{raceRestriction:'ashen'}:{})};});
for(const set of sets)for(const slot of pieces){const id=set.id+'.'+slot;equipment.push({id,name:set.name+'·'+labels[slot],slot,weaponType:null,baseVariant:slot+'_'+(set.branch==='crystal'?'vitality':'armor'),originRace:'ashen',kind:'set',setId:set.id,description:set.description,visualVariant:id,visualKey:id,iconKey:slot,minimumArea:3,quality:3,special:null});}
// Boss cores share the single regional legendary pool. Story core is never a pool candidate.
export const legendaries=[
{id:'ashen-molten-core',ready:true,name:'余烬·不灭薪',slot:'core',baseVariant:'core_molten',originRace:'ashen',raceRestriction:'ashen',exclusiveId:'ashen-ember-fuel',exclusiveName:'不灭薪',source:'own-race-boss',fixedEffect:{type:'moltenAttackStacks'},description:'黑曜矿壳包裹着不曾冷却的赤色矿心。',exclusive:{description:'累计消耗30热量获得1层攻击增益，每层20%，最多3层（60%）。每次触发延长6秒；满层继续延长时长，未满30的消耗保留。卸下清空。'}},
{id:'ashen-stone-core',ready:true,name:'负山·长眠垒',slot:'core',baseVariant:'core_stone',originRace:'ashen',raceRestriction:'ashen',exclusiveId:'ashen-mountain-rest',exclusiveName:'长眠垒',source:'own-race-boss',description:'沉重岩层合拢成核，金色脉络隐于层间。',exclusive:{description:'敌方直接攻击击破护盾时，获得2岩片并恢复4%最大生命；8秒战斗冷却。护盾自然到期不触发。'}},
{id:'ashen-crystal-core',ready:true,name:'折曦·三声遗响',slot:'core',baseVariant:'core_crystal',originRace:'ashen',raceRestriction:'ashen',exclusiveId:'ashen-prism-beam',exclusiveName:'三声遗响',source:'own-race-boss',equipmentSkill:{id:'ashen-prism-beam',cooldownMs:30000,ignoresArmor:true,ignoresElementResistance:true,enabled:true,coefficient:2,scope:'single',automatic:true,usesActiveSlot:false},description:'明暗晶面折射出交织的三束微光。',exclusive:{description:'装备后每30秒战斗时间自动向当前目标释放200%攻击力光线，无视护甲和元素抗性，仍先扣护盾。不占主动技能槽；卸下重置计时。'}},
{id:'ashen-primal-core',ready:true,name:'原初核心',slot:'core',baseVariant:'core_primal',originRace:'ashen',raceRestriction:'ashen',exclusiveId:'ashen-primal-power',exclusiveName:'原初之力',source:'main-story',questOnly:true,unique:true,ordinaryAffixCount:0,fixedEffect:{type:'unskilledAttackMultiplier',multiplier:2},description:'尚未留下任何刻痕的原初矿心。',exclusive:{description:'不装备任何主动或被动技能时，攻击力翻倍。只提供基础属性，不附带随机普通词条。通过主线剧情获取。'}}
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

// Append after the historical indexed catalog (including cores and the sixth ring).
// Explicit IDs prevent additions from renumbering saved Ashen equipment.
for (const [id,name,slot,baseVariant,weaponType,description,pixelAppearance] of [
 ['ashen.scatter.38','呼岩护臂','weapon','armguard_balanced','armguard','细孔沿护臂起伏，像冷却岩层缓慢的呼吸；迁行者只磨去会刮伤同伴的外缘。','多孔灰岩臂壳、橙色细脉、开口腕环'],
 ['ashen.scatter.39','层蜕臂甲','weapon','armguard_defensive','armguard','旧矿壳从臂甲边缘逐层剥落，新生石面在下面显出淡色；脱落的薄片被留在来路作记号。','层叠片岩臂甲、翘起薄壳、深色腕口'],
 ['ashen.scatter.40','晶芽腕壳','weapon','armguard_attack','armguard','细小晶芽从腕壳接缝中长出，朝着指节弯曲；每次休息，持有者都会拂去芽间的砂。','簇生短晶尖、琥珀芽点、黑曜腕壳'],
 ['ashen.scatter.41','潮脉环臂','weapon','armguard_balanced','armguard','盐色矿脉环绕前臂，深浅交替如荒原早已退去的潮；石环之间留着可以屈伸的缝隙。','分节矿石臂环、波纹盐脉、青灰棱面'],
 ['ashen.scatter.42','苔晶方锤','weapon','hammer_balanced','hammer','方晶表面的薄苔只在阴面生长，持有者用它辨认归路；锤柄上的矿纹与掌心缓缓相合。','方形晶石锤头、单面苔斑、短岩柄'],
 ['ashen.scatter.43','蜂孔岩槌','weapon','hammer_defensive','hammer','石槌内部留着相连的气孔，挥动时发出低低的风声；那些孔洞曾是熔岩里最后逃出的气泡。','蜂孔圆柱槌头、粗矿柄、暗红孔心'],
 ['ashen.scatter.44','断层双棱锤','weapon','hammer_defensive','hammer','两片断层沿锤头错开，夹缝里仍有新晶缓慢填补；迁行者不催促它，只定期拂去碎屑。','错位双棱锤头、中缝晶芽、扁石柄'],
 ['ashen.scatter.45','泪盐垂锤','weapon','hammer_balanced','hammer','盐水沿锤头沉成一枚下垂的白滴，干裂后又被晨露接续；一路迁行的湿痕就这样留在石中。','泪滴白盐锤头、环状盐纹、细暗柄'],
 ['ashen.scatter.46','赤髓节锤','weapon','hammer_balanced','hammer','红色矿髓把数节石块连成锤头，外壳冷却时会发出轻响；每一道节缝都给生长留了余地。','分节横向岩锤、红色髓线、粗短柄'],
 ['ashen.scatter.47','空鸣晶锤','weapon','hammer_defensive','hammer','中空晶腔保留着矿层的回音，敲击后余声比脚步更久；持有者以掌心贴住它，等声音慢慢平息。','空心环晶锤头、紫灰内腔、晶棱柄'],
 ['ashen.scatter.48','褶岩颅冠','helm','helm_armor',null,'薄岩沿额顶折出一道道缓坡，裂缝中透出新生的浅纹；它随持有者的矿壳缓慢改变形状。','褶皱片岩冠、层状额沿、浅金矿缝'],
 ['ashen.scatter.49','芽晶额甲','helm','helm_vitality',null,'额甲两侧的晶芽长得并不对称，靠近晨光的一侧总先明亮；磨损的旧晶仍被留在中央。','不对称晶芽额甲、中央旧晶、低石眉脊'],
 ['ashen.scatter.50','层生胸壳','armor','armor_armor',null,'胸壳一层层包住旧裂痕，像矿层记住每次受压的方向；侧面的薄壳尚未长齐，露出温暗的内纹。','叠层胸壳、斜向岩板、侧面暗橙缝'],
 ['ashen.scatter.51','脉孔岩衣','armor','armor_vitality',null,'相连的孔洞贯穿岩衣，盐脉在孔边结成细网；荒原的风穿过时，矿壳不必承受所有重量。','网脉多孔胸甲、圆孔肩片、灰白盐边'],
 ['ashen.scatter.52','盐芽掌甲','gloves','gloves_armor',null,'掌甲背面结着细小盐芽，指缝处仍柔软可动；持有者将过长的芽轻轻掰下，撒回走过的盐地。','白盐芽掌甲、短簇晶背、深灰分指'],
 ['ashen.scatter.53','叠晶护指','gloves','gloves_vitality',null,'薄晶沿指节交叠，弯曲时露出下面尚未磨亮的晶面；每根手指都留下了不同的生长纹。','层叠晶片手套、阶梯指节、琥珀缝线'],
 ['ashen.scatter.54','熔脉石履','boots','boots_armor',null,'鞋侧的暗红矿脉停在脚踝处，外壳早已冷却；每次落脚，细砂都会从旧熔沟中抖落。','厚底黑岩靴、红色侧脉、裂缝脚踝'],
 ['ashen.scatter.55','浮孔岩靴','boots','boots_vitality',null,'轻岩里的细孔把脚步声留在靴壳中，盐尘渐渐填满最旧的几个孔；新生石缘仍保持着浅灰色。','浅灰浮石靴、多孔脚面、浅色新生靴沿']
]) equipment.push({id,name,slot,baseVariant,weaponType,originRace:'ashen',kind:'scatter',setId:null,description,pixelAppearance,visualVariant:id,visualKey:id,iconKey:slot});
