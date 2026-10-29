"""Reproducible v2 content. v1 immutable snapshot preserves all existing identities and events."""
import json, pathlib
OUT = pathlib.Path(__file__).parent
BASE = json.loads((OUT/'v1-preserved.json').read_text())
NPCS = BASE['npcs']; EVENTS = BASE['events']

def npc(slug, name, race, role, area, appearance, voice, relation):
    n=dict(id=f'npc.{race}.{slug}',name=name,race=race,role=role,areaId=f'{race}.{area}',homeAreaId=f'{race}.{area}',appearance=appearance,voice=voice,plotRelation=relation,authorship='本轮授权扩充创作；姓名、年龄与外观不冒称此前逐项固定的正史。')
    NPCS.append(n); return n

def event(n,slug,title,description,dialogue,choices,*,kind='choice',cost=None,reward=None):
    id=f'local.{n["race"]}.{slug}'; repeat=kind in ('materials','victory')
    objective={'kind':kind}
    if kind in ('victory','exploration'):
        objective.update(nodeIds=[n['areaId']+'.field'],count=1,tracking='接取后在真实节点发生的新'+('胜利结算' if kind=='victory' else '探索进入')+'；历史探索、预览地图、主线演出不计。')
    if cost: objective['materials']=[dict(key=cost[0]+'|0',materialId=cost[1],quantity=2)]; objective['inventoryPolicy']='仅消耗明示的两份普通品质；不会替用高品质。'
    cs=[dict(id=f'option_{i+1}',label=c[0],dialogue=c[1],outcome=c[2],effects=[dict(kind='narrative',flag=id+f'.{i+1}',value=True)]) for i,c in enumerate(choices)]
    rewards=[dict(kind='material',key=reward[0]+'|0',materialId=reward[1],quantity=1)] if reward else []
    if reward:
        dialogue=dialogue+[f'办妥后给你一份普通{reward[2]}，我从自己的存料里留。']
        for c in cs: c['outcome']+=f'；领取一份普通{reward[2]}。'
    e=dict(id=id,npcId=n['id'],npcName=n['name'],race=n['race'],areaId=n['areaId'],title=title,description=description,dialogue=dialogue,completion=['已记录你的选择，这件地方事务已经办妥。'],objective=objective,choices=cs,rewards=rewards,narrativeOnly=not rewards,repeatable=repeat,conditions=dict(areaUnlocked=n['areaId'],atArea=n['areaId'],accessPolicy='territoryAccess(save, race).allowed',notInCombat=True,notAlreadyCompleted=not repeat,noRaceRestriction=True,requiredEventIds=[],requiredStoryFlags=[]),decline=dict(label='以后再来',permanent=False,dialogue={'dwarf':'先留着，等你有空。','human':'好，我把这事记着。','elf':'等你愿意再说。','goblin':'行，回来再商量。','ashen':'可以，我继续照管这里。'}[n['race']]),failurePolicy='材料不足、满包或保存失败不扣料不完成；战败、离开与封锁不清已接进度；回来继续。',economy=dict(extraGold=False,extraXp=False,extraItems=bool(rewards),ordinaryCombatRewards='实际战斗奖励只结算一次。'),provenance='authored-v2',availability='当前区域已开放且可进入；无主线前置，不按等级猜剧情。')
    if cost:e['materials']=objective['materials']
    if kind in ('victory','exploration'): e['actionLabel']=('接取后赢得此地野外战斗' if kind=='victory' else '接取后亲自进入此地野外探索；结束远征后回报')
    if repeat:
        e.update(cooldownMs=300000,recurrence=dict(cooldownMs=300000,startsAt='成功原子提交本轮完成时',requiresFreshObjective=True,requiresManualReaccept=True,noOfflineAutoAccept=True,sameCycleClaimIdempotent=True,refreshDoesNotReset=True),rewardTuning=dict(model='common-q0-lossy-exchange-2-to-1' if cost else 'common-q0-single-unit-fresh-victory',maxExtraMaterialPerCycle=1,quality=0,rarity='常见',cooldownMs=300000,source='既有普通材料，由NPC存料支付；不增加稀有掉落或新材料身份。'))
    EVENTS.append(e);return e

# Each new character has one ordinary conversation plus one concrete action.
taolan=npc('taolan','陶兰','dwarf','矿车木作匠','a02','铜色卷发别在耳后，短壮肩膀搭着半只木轮；褐围裙上插木楔。','讲尺寸时干脆，愿意先听推车人的手感。','只修普通矿车，不掌握炸矿命令或遗物贸易。')
event(taolan,'cart_handle_height','把手高一截','两位推车人的身高不同，陶兰想给公用矿车留两种握位。',['不是谁推得差，是把手只照着一个人的个头做了。','你帮我试试：加低握位，还是做能拆换的横杆？'],[('增设低握位','好，上面留着，矮个子不用踮脚。','公用矿车保留高低两处握位。'),('改成可换横杆','拆装扣朝外，戴着手套也找得到。','横杆增加拆换记号，交班时按需调整。')])
event(taolan,'wheel_pin_batch','轮销别晃','交两份普通铁屑修一批轮销，换一份普通灰根草。',['轮缘还好，松的是这里，不必把整只轮子扔掉。','两份普通铁屑就够。你想先修哪辆？'],[('先修载人的空车','先让走不动的人坐稳，货可以等。','本批空车轮销固定。'),('先修共用货车','先卸货再动销，别让谁顶着车干活。','共用货车卸载后修好轮销。')],kind='materials',cost=('铁屑','dwarf.iron_filings'),reward=('灰根草','dwarf.ashroot','灰根草'))
kelin=npc('kelin','科霖','dwarf','轮值盾卫','a04','灰胡子压在旧皮领上，短盾边缘有三块补片；眉毛粗而平。','不夸自己打过多少仗，常问同伴有没有退路。','看守当地工作队，不是军官，不改变战争结果或矿难生死。')
event(kelin,'shield_rotation','谁来歇这一班','一位新盾卫不肯离岗休息，科霖请你一起调整轮班。',['盾能补，人累得握不住了，补盾也没用。','先换他下来，还是先把每个人的时段写清？'],[('先替他安排换班','我接这一段，让他喝口水再说。','疲惫的盾卫先休息，科霖补上这一班。'),('把每人的时段写清','连我的也写，规矩不能只管新人。','轮班表包含所有人，休息不再靠争抢。')])
event(kelin,'slope_guard_round','坡下这一班','接取后在废炉外坡野外赢一场战斗，回报本轮守望情况。',['只巡视坡下这段，不要追到看不见同伴的地方。','回来时告诉我，哪里该站人。'],[('补在视线受阻处','两个人互相看得见，别各站各的。','本轮守望安排在视线受阻处加岗。'),('先留撤回通道','对，盾墙后面也得留得出脚。','本轮明确撤回通道与让行次序。')],kind='victory',reward=('dwarf.furnace_ash_salt','dwarf.furnace_ash_salt','炉灰盐'))
shajia=npc('shajia','莎嘉','dwarf','矿队炊事员','a08','红头巾裹着黑色鬓发，壮实手臂挎短柄锅勺；围裙口袋装布包。','嗓音爽利，不许拿饥饿和手抖当玩笑。','照顾普通矿队用餐，不替主线救援或粮食政策作决定。')
event(shajia,'quiet_meal_bench','留一张安静桌','用餐的人挤在炉边说笑，一位头疼的矿工找不到安静位置。',['热饭要吃，安静也得有地方找。','挪一张桌，还是把吵闹的那边分开？'],[('留一张安静桌','靠墙但别堵门，谁需要都能坐。','食棚留出不必解释原因的安静桌。'),('把交班讨论移开','吃饭和争进度分两处，大家都省嗓子。','交班讨论移到食桌之外。')])
event(shajia,'meal_route','热饭走哪边','接取后亲自进入深脉裂谷野外，结束远征再报告送饭路面的情况。',['我不想让挑饭的人一只手扶墙，一只手护锅。','走过再说哪里难落脚，别替没看见的地方打包票。'],[('标出需要慢走的窄段','窄段分两趟，不让人硬挤。','送饭记录标出亲历窄段并安排分批。'),('标出可停锅的位置','有平处就停一停，饭凉一点总比洒了好。','送饭记录留下可临时放锅的平处。')],kind='exploration')

wenna=npc('wenna','温娜','human','采药师','a03','银发编成长辫，苔色披巾扣着木别针；肩袋露出整齐的草药包。','有分寸地问症状，不把普通草叶说成神药。','帮助当地旅人，不治愈主线必然伤亡，不参与王室密信。')
event(wenna,'blank_herb_tag','空着的药签','一包草叶的标签被雨水冲淡，温娜不愿靠香味猜名字。',['我认得气味，不代表能替这张空签作证。','先封存，还是把送来的人请回来核对？'],[('封存并写明待核对','写清今天的日期，别让下一班以为能用。','未明草包单独封存并注明待核对。'),('先核对采集记录','地点和样叶都对上了，才重写标签。','草包在来源核对完成前保持停用。')])
event(wenna,'hillside_drying','找一块背风地','接取后亲自进入礼钟丘陵野外，结束远征后回报晾草处的风与遮挡。',['我缺的是晾架的位置，不是让你多摘一袋。','看看哪里背风，哪里又会积湿。'],[('先留背风的空位','架子离地一点，叶下才能走风。','晾草记录标出背风处并留出通风间隙。'),('先避开积湿的低处','低洼那块划掉，不能只图搬得近。','晾草记录优先排除亲见的积湿处。')],kind='exploration')
luoen=npc('luoen','洛恩','human','桥栏木匠','a07','深棕卷发蓬在旧工帽下，靛蓝工装缝着木尺袋；左肩挂一把短刨。','手上不停但会停下来听人说，讨厌把临时修补说成永久稳固。','修桥栏不等于重夺关隘；不发军方通行或改变领土。')
event(luoen,'low_rail_window','看得见水的缺口','桥栏的观察口太高，矮个旅人只能踩在横木上看下方。',['栏杆是防人掉下去，不是教人往上爬。','开个低观察口，还是在旁边留一段低矮挡栏？'],[('加带护网的低观察口','边上磨圆，手伸过去也别被刺到。','低观察口加护网，旅人无需踩高。'),('做一段独立低挡栏','站位先画清，别挤到过路的人。','侧边留出带低挡栏的观察位。')])
event(luoen,'rail_seal_brush','封缝的小刷子','交两份普通夜鸦羽制作封缝刷，换一份普通余烬椒。',['大刷子进不去的缝，羽梗正好够到。','两份普通夜鸦羽，先补迎风面还是背水面？'],[('先封迎风面','等这一层收住再补下一层，不往缝里硬塞。','本批迎风面细缝刷过封料。'),('先封背水面','把旧湿料挑净，免得外面干、里面闷。','本批背水面清理后重新封缝。')],kind='materials',cost=('human.mat.10','human.mat.10'),reward=('human.mat.09','human.mat.09','余烬椒'))
beila=npc('beila','贝菈','human','高地巡守','a08','雀斑横过鼻梁，蜂蜜色短披巾压在皮肩带下；短矛绑着白布结。','语气明亮，发现不确定处会直接承认。','普通高地巡守，不是王族、密使或战争胜负关键人物。')
event(beila,'mist_whistle','雾里别乱吹哨','巡守的试哨声被旅人误当警报，贝菈要把练习和告警分开。',['刚才那声是我试的，吓得人把包都丢下了。','定个试哨时段，还是先把练习点挪远些？'],[('固定试哨时段','把时间写在入口，我自己也照着来。','试哨时段公开，警报与练习不再混用。'),('把练习点挪开','先告诉过路人，再换地方。','练习点离开通行处，并补上说明。')])
event(beila,'highland_patrol','沿着旧篱巡一圈','接取后在夜鸦高地野外赢一场战斗，再回报本轮旧篱巡查。',['旧篱挡不了什么，可有人会拿它当路边界。','别追远。你回来，我才好把下一班排下去。'],[('标明旧篱的断处','给人留看得见的提醒，不假装篱还完整。','本轮巡查注明断篱位置。'),('优先照看绕行的人','这一班守在转弯处，别催人跑。','本轮巡查安排守望绕行处。')],kind='victory',reward=('human.mat.10','human.mat.10','夜鸦羽'))

qiwei=npc('qiwei','栖苇','elf','鸟栖照护者','a02','身形纤细，短绿发夹着褐羽；青布肩袋装空巢垫而非捕鸟笼。','轻声但不神秘，愿意让不亲人的鸟保持距离。','照管普通林鸟，不传神谕，不知道大祭司与遗址秘密。')
event(qiwei,'fallen_nest_rest','暂借一根横枝','掉落的空巢占住休息横枝，栖苇想留空间又不惊扰附近的鸟。',['空巢也可能还会回来住，别急着拆。','先支一根新横枝，还是给这段留个绕行标？'],[('另支休息横枝','离巢远一点，让路人歇脚也不必凑过去。','另设休息横枝，旧巢保持原状。'),('暂留绕行标','标记别晃得太厉害，会惊到它们。','旧巢附近暂留安静绕行提示。')])
event(qiwei,'echo_bird_roost','回声里的一处栖枝','接取后亲自进入回声树庭野外，结束远征后回报沿路栖枝受扰的情况。',['听见两声，不一定是两只鸟，树庭会把声音送回来。','只说你确实看见的，不必替我找个漂亮答案。'],[('记录真正看见的栖枝','看不见的先空着，空白比瞎画一只鸟强。','照护记录只标出亲眼见到的栖枝。'),('记录人经过的扰动','等人走开再听，别追着声音找。','照护记录注明行人扰动与静候位置。')],kind='exploration')
luyin=npc('luyin','露茵','elf','苇布织工','a06','纤细长臂托着木织梭，紫灰长辫用苇绳扎住；灰绿工作袍磨白了袖口。','说话像收线一样有条理，但愿意让补丁保留旧颜色。','织普通苇布，不把焚林新芽解释为主线仪式成败。')
event(luyin,'visible_mending','补丁也能认路','几块相似的披布被人拿混，露茵想把补丁做成容易认出的样子。',['人人都补成一个颜色，放下就分不清了。','留各自的旧色，还是各缝一个不同角？'],[('保留各自旧色','旧布不丢，认得它的人也认得回来。','披布保留各自旧色作为认领特征。'),('缝不同的补丁角','三角在这件，方角在那件，别偷偷换。','披布以不同补丁角区分。')])
event(luyin,'loom_padding','梭边垫一层','交两份普通萤绒苔垫护织架，换一份普通旋叶藤。',['这里磨的是线，不是你力气不够。','我带了些旧存旋叶藤，换两份普通萤绒苔作软垫。'],[('先垫送线口','让线走顺，不必把整架拉紧。','本批送线口加了软垫。'),('先垫收梭处','梭子收住了，边线才不被带偏。','本批收梭处加了软垫。')],kind='materials',cost=('elf.glow_moss','elf.glow_moss'),reward=('elf.spiral_vine','elf.spiral_vine','旋叶藤'))
EVENTS[-1]['rewardTuning']['inventorySourceException']='旋叶藤是露茵从既有林缘供给带来的普通存料；不新增焚林新芽野外掉落。'
yasen=npc('yasen','雅森','elf','泽地守望者','a09','瘦高身形裹着苇色短斗篷，青灰长发束得很低；弓弦包在防潮布里。','先问脚下稳不稳，再谈箭准不准，不拿年长压人。','只巡本地泽路，不拥有祭坛知识，不替莱姆斯完成主线抉择。')
event(yasen,'reed_lane_space','一条能错身的路','临时苇垫铺得太窄，挑担和空手的人互相堵住。',['窄路上谁都急，退让也得有地方退。','留一处错身位，还是先定哪端等一等？'],[('加一处错身位','垫子先试稳，别只看着比原先宽。','苇垫边试稳后留出错身位。'),('标明两端等候位','让先走的人看得见后面有人等。','两端增设互相可见的等候提示。')])
event(yasen,'marsh_watch_round','低苇后的动静','接取后在落潮泽地野外赢一场战斗，回报本轮沿路动静。',['低苇挡住视线，别只盯着远处。','走过回来，我们再决定下一班照看哪段。'],[('标出近处的遮挡','把眼前这段补上，别画一个虚的远圈。','本轮守望记录优先注明近处遮挡。'),('标出可停步的硬地','脚下站稳了，才谈看得远。','本轮守望记录标出亲历的硬地。')],kind='victory',reward=('elf.dry_tide_scale','elf.dry_tide_scale','枯潮鳞'))

kaba=npc('kaba','咔巴','goblin','菌汤厨手','a03','矮小圆脸，浅绿皮肤，白布厨帽歪在长耳间；短勺柄用布缠厚。','动作快，盛汤时反而数得慢，给晚来的人留底。','不是奇克亲属或首领，经营小锅汤，不根治族群粮荒。')
event(kaba,'last_ladle','最后一勺给谁留','锅边的人以为汤已经分完，咔巴还为晚班留着一小份。',['不是藏起来自己喝，是下面那班还没上来。','把留份写在锅边，还是单独盛到盖碗里？'],[('写清晚班留份','字别太小，谁伸勺都看得见。','锅边明确标出晚班留份。'),('先盛进有盖的碗','盖碗放高点，别又被当成洗锅水。','晚班留份装进有盖的碗。')])
event(kaba,'soup_straining','菌汤要过细筛','交两份普通灰帽菌补本批锅料，换一份普通韧苔纤维。',['这批先过筛，别让小碎梗全挤到最后一碗。','两份普通灰帽菌，我用一份存好的韧苔纤维换。'],[('先筛本批汤底','汤勺慢一点，不把底渣又搅上来。','本批汤底细筛后分盛。'),('先分开新旧锅料','旧签留在旧篮，不靠鼻子猜日期。','本批锅料分开后再下锅。')],kind='materials',cost=('goblin.mat.01','goblin.mat.01'),reward=('goblin.mat.03','goblin.mat.03','韧苔纤维'))
zhiqi=npc('zhiqi','枝契','goblin','货篓编工','a04','小个长耳，橙色背带挎着半编的货篓；深绿短发沾一缕苔纤。','善于估轻重，讨厌把身材小等同于可以多塞一篓。','编运普通货篓，不判定商队袭击者，不为抢粮补造证词。')
event(zhiqi,'basket_name_knot','记得谁背过','公用货篓没有清楚的借用记号，背带磨坏后大家互相推托。',['不是叫谁赔钱，先知道哪根带子用了多久。','结绳记日期，还是把借还牌分两面？'],[('用结绳记使用日','一日一结，拆结得当着借的人。','货篓以结绳记录使用日。'),('用双面的借还牌','红面是外借，素面是归还，都挂在同一处。','货篓借还牌使用两面状态。')])
event(zhiqi,'basket_clearance','背篓过得去吗','接取后亲自进入地下货道野外，结束远征后回报低矮路段。',['人低头能过，背上的篓可不会自己弯。','走一趟再说，别把地图上宽的线当真空地。'],[('标出要卸篓的地方','到那里先卸，不让背的人自己猜。','货道记录标出需卸篓通过的位置。'),('标出能转身的空处','掉头也得留地方，别只顾往里塞。','货道记录保留可转身的空处。')],kind='exploration')
moku=npc('moku','墨库','goblin','洞口护卫','a08','矮小结实，深绿皮肤，稀疏灰鬓贴着耳根；圆盾缀着交错的浅色皮补片。','话不多，会把新人的退路放在自己的面子前。','普通洞口轮值者，不是哥布林首领，不替奇克承担族群结局。')
event(moku,'shield_not_a_stool','盾不是凳子','洞口休息的人把圆盾当凳子，墨库发现背带被压歪。',['坐一下不丢人，把背带坐坏才麻烦。','做一处坐垫，还是给盾架挪个醒目的位置？'],[('另铺一处坐垫','就在背风处，谁累了都能坐。','洞口铺出休息坐垫，盾不再代替凳子。'),('把盾架移到手边','靠手边，不挡脚，起身就能拿。','盾架重新摆放，背带保持展开。')])
event(moku,'entrance_watch','洞口外的脚步','接取后在深窟集地野外赢一场战斗，回报本轮洞口巡看。',['我守入口，你走外边那一段。','听着像很多，也可能是回声；回来再讲。'],[('标出脚步靠近的方向','写方向，不编对方来了多少。','本轮巡看记录亲历的靠近方向。'),('整理回撤的手势','让新人也能看懂，不只我们两个懂。','本轮把回撤手势向轮值者说明。')],kind='victory',reward=('goblin.mat.11','goblin.mat.11','赤须兽筋'))

shayan=npc('shayan','砂砚','ashen','矿粉研配者','a01','砂岩矿壳带天然层线，方颌没有人类皮肉；宽手托着陶研钵与短杵。','分清粉与颗粒再说用途，态度温厚而不机械。','普通矿物生命，只调护具用粉，不研磨、替换或医治生命核心。')
event(shayan,'powder_lid_shapes','摸得到的罐盖','细粉罐外壁沾灰看不清，砂砚想让取料者凭罐盖也能区分。',['擦干净很快，下一阵风又会糊上。','刻不同边角，还是给盖顶留凸点？'],[('刻不同边角','圆角留给细粉，缺角留给粗粒。','粉罐盖以不同边角区分。'),('增加可摸的凸点','凸点别尖，手套碰过去也认得出。','粉罐盖增加安全的触摸凸点。')])
event(shayan,'grinding_batch','磨平护具边','交两份普通冷烬砂研磨护具毛边，换一份普通盐壳碎片。',['磨的是护具边，不是谁的矿壳。','两份普通冷烬砂，先处理朝里的边还是外侧扣口？'],[('先磨朝里的毛边','试过不挂布，再让人穿上。','本批护具朝内毛边磨平并试布。'),('先磨外侧扣口','扣口顺了，也不必用力扯带子。','本批护具扣口磨平。')],kind='materials',cost=('ashen.cold_ash_sand','ashen.cold_ash_sand'),reward=('ashen.salt_shell','ashen.salt_shell','盐壳碎片'))
huileng=npc('huileng','灰棱','ashen','通风口照管者','a04','灰蓝矿壳有整齐的斜面棱线，头侧嵌淡色片晶；胸前挂轻薄风叶片。','听见异响先核对风向，不把每种回声解释成古代召唤。','只维护普通风口，不解释先祖起源、神庙或核心奥秘。')
event(huileng,'wind_vane_spacing','别把风口塞满','避风的货包堵住风口一半，灰棱想兼顾存货和通风。',['风不能因为箱子先来，就自己换条路。','给货包划线，还是另搭一个小挡风板？'],[('留出不可堆货的线','线画得宽些，最外面的绳头也别伸进来。','风口前划出通风空线。'),('另搭存货挡风板','挡货那边的风，不挡通风口的风。','货包获得独立挡风板，风口恢复空畅。')])
event(huileng,'airflow_walk','走出去听风','接取后亲自进入琉砂洼地野外，结束远征后回报沿路风声与扬砂。',['站在口里听，哪里都像从前面来。','走出去看看砂往哪边落，再回来讲。'],[('记录扬砂落向','写看见的方向，下一阵再另记。','通风记录保留本次亲见的扬砂落向。'),('记录风声被遮的位置','声小不等于风停，这处先做提醒。','通风记录注明受遮挡的听风位置。')],kind='exploration')
pucheng=npc('pucheng','璞承','ashen','石道护行者','a07','黑曜矿壳透出温暗琥珀晶纹，头颅是整块有棱的矿石；陶护肩与短石盾错层相扣。','沉稳而有耐心，先让同行者停稳再作判断。','只护送普通石道行人，不是族长，不改变主线战争与族长死亡。')
event(pucheng,'stoneway_pace','慢一些也能同行','护行队步子越走越快，一位负重者被落在后面。',['最前面没停，最后面的已经看不见手势。','让领路者回看，还是在中段安排传手势的人？'],[('领路者定点回看','走到转角就回看，别等有人喊。','护行队约定转角回看后再动身。'),('中段补上手势传递','传到最后一个再起步，我等得住。','护行队增加中段手势传递。')])
event(pucheng,'obsidian_escort_round','风口的一次护行','接取后在黑曜风口野外赢一场战斗，回报本轮护行观察。',['这次照看风口这一段，不把远处也写成安全。','回来选一处让下一队留心。'],[('提醒碎石松动处','松动还在，就写还在，不画一个完成的勾。','本轮护行记录明确松石提醒。'),('提醒停步避风处','留给人站稳，不再往那里堆货。','本轮护行记录保留停步避风位。')],kind='victory',reward=('ashen.obsidian_glass','ashen.obsidian_glass','黑曜玻璃'))

area_names={'dwarf.a02':'岩蜥支洞','dwarf.a04':'废炉外坡','dwarf.a08':'深脉裂谷','human.a03':'礼钟丘陵','human.a07':'失守关隘','human.a08':'夜鸦高地','elf.a02':'回声树庭','elf.a06':'焚林新芽','elf.a09':'落潮泽地','goblin.a03':'菌灯洞群','goblin.a04':'地下货道','goblin.a08':'深窟集地','ashen.a01':'醒石边地','ashen.a04':'琉砂洼地','ashen.a07':'黑曜风口'}
for n in NPCS:
    n['areaName']=n.get('areaName') or area_names[n['areaId']]
    n['portraitId']=n['id']; n['portraitStatus']='独立像素肖像已注册；原始生成图与缩略图见npc-portrait-source-manifest.json；浏览器验收另记。'
for e in EVENTS: e['areaName']=e.get('areaName') or area_names[e['areaId']]
META=BASE['metadata'];META.update(contentId='racial-npc-events-v2',sourceCommit='ddfcc1993a38574a2631916519d94e861c674b9f',status='production candidate; not published',authorship='保留15名NPC与30件已上线事件，授权新增15名NPC与30件地方事件；30人均有独立像素肖像。',repeatableContract='20件可重复：10件真实普通材料消耗、10件接取后新胜利；每轮手动接取，成功后冷却300000ms；5件一次性探索须接受后真实节点进入。',ringPostingPolicy='归途临时驻点沿用同一NPC身份与肖像；五件归途事件独立于60件地方事务，不复制人物。',visualStatus='30张独立像素肖像，按当前地区惰性载入；图像失败复用有限自动重试与手动恢复。')
# Copy changes are separate from the archived v1 contracts; never modify their mechanics.
POLISH=json.loads((OUT/'narrative-polish.json').read_text())
for e in EVENTS:
    prose=POLISH[e['id']]
    e['description']=prose['scene']+' '+e['description'].replace('补充玩家的基础配料。','补足行路所需。').replace('按玩家选择','按你的安排').replace('一次真实胜利','一次胜利').replace('，不自动投入高品质','')
    e['completion']=[line.replace('已记录你的选择，这件地方事务已经办妥。','这件事已经办妥。').replace('已记录你的选择；与约定相符的交付和回报已经结清。','约定的交付和报酬已经结清。') for line in e['completion']]
    for c in e['choices']:
        c['outcome']=c['outcome'].replace('；后续问候承认玩家选择','，朵菈闭着眼摸了一遍，点头把灯挂回去').replace('；争执结束，不改玩家物资','，拿错料的人各自领回那袋，争执也停了').replace('，记录玩家偏重核对','，米蕾把两种袋子分到木架两侧')
DATA={'metadata':META,'npcs':NPCS,'events':EVENTS}
(OUT/'racial-npc-events.json').write_text(json.dumps(DATA,ensure_ascii=False,indent=2)+'\n')
js='// Authored NPC content v2. Stable v1 identities and progress are preserved.\nconst freeze = x => { if (x && typeof x === "object" && !Object.isFrozen(x)) { for (const v of Object.values(x)) freeze(v); Object.freeze(x); } return x; };\n'
for key,value in [('RACIAL_NPC_EVENT_META',META),('RACIAL_NPCS',NPCS),('RACIAL_NPC_EVENTS',EVENTS)]:js+=f'export const {key} = freeze('+json.dumps(value,ensure_ascii=False,indent=2)+');\n'
js+='export const RACIAL_NPC_BY_ID = freeze(Object.fromEntries(RACIAL_NPCS.map(n => [n.id, n])));\nexport const RACIAL_EVENT_BY_ID = freeze(Object.fromEntries(RACIAL_NPC_EVENTS.map(e => [e.id, e])));\n'
(OUT/'racial-npc-events.mjs').write_text(js)
(OUT.parent.parent/'dist/racial-npc-event-content.js').write_text(js)
md=['# 五族地方人物与事件 v2','', '30名人物；60件地方事务（40一次性、20可重复）。保留原15人/30事与全部稳定ID；另有5件独立归途场景。','', '新创作的姓名、年龄、外貌与小事件不是此前固定的主线正史。每族6人，每人2事；无新大战、核心人物或稀有奖励。','', '|种族|姓名与职责|驻地|两件事务|','|---|---|---|---|']
for n in NPCS:md.append('|'+n['race']+'|'+n['name']+' / '+n['role']+'|'+n['areaName']+'|'+ '；'.join(e['title']+'（'+e['objective']['kind']+'）' for e in EVENTS if e['npcId']==n['id'])+'|')
for n in NPCS:
    md+=['','## '+n['name']+' · '+n['role'],'',n['appearance'],'', '声线：'+n['voice'],'','边界：'+n['plotRelation']]
    for e in EVENTS:
        if e['npcId']!=n['id']:continue
        md+=['','### '+e['title']+' `'+e['id']+'`','',e['description'],'']+[ '> '+line for line in e['dialogue']]+['']+[ '- '+c['label']+' → '+c['dialogue']+' → '+c['outcome'] for c in e['choices']]
md+=['','## 运行时与验收','', '探索仅由接取后真实节点进入事件记录，不认预览、旧探索或主线演出；尚在战斗或远征不可交付。材料、奖励、所选回应与完成同一原子事务。重复要求重新付出材料或新胜利，5分钟冷却，手动再接。','', '画像源图、提示词、SHA256及缩放链见npc-portrait-source-manifest.json。原始生成图在项目 source-art，运行时只加载当前地区所需96像素PNG。原始15人身份与事件正文的保持由v1-preserved.json测试。']
(OUT/'racial-npc-events-draft.md').write_text('\n'.join(md)+'\n')
print('Generated',len(NPCS),'NPCs',len(EVENTS),'events',sum(e['repeatable'] for e in EVENTS),'repeatable')
