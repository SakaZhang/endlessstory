// Existing material identities/descriptions remain authoritative in world-materials.
// Scene staging below is newly authored, not a change to the ten-stage mainline.
export const RETURN_RING_ID='return-ring';
export const RETURN_RING_RECIPE_FLAG='return-ring.recipe-revealed';
export const RETURN_RING_MATERIALS=Object.freeze([
 Object.freeze({race:'dwarf',material:'dwarf.return_token_dwarf',catalogId:'dwarf.return_token_dwarf'}),
 Object.freeze({race:'human',material:'human.mat.18',catalogId:'human.mat.18'}),
 Object.freeze({race:'elf',material:'elf.return_token_elf',catalogId:'elf.return_token_elf'}),
 Object.freeze({race:'goblin',material:'goblin.return_token_goblin',catalogId:'goblin.return_token_goblin'}),
 Object.freeze({race:'ashen',material:'ashen.silent_crystal',catalogId:'ashen.silent_crystal'})
]);
// User approved +3 percentage points for rare drops including gems and rare
// materials. It never changes a source whitelist, unique ownership or quality roll.
export const RETURN_RING_DROP_POLICY=Object.freeze({approved:true,bonusPP:.03,pools:Object.freeze(['boss-legendary','material-special','material-gem'])});
export const RETURN_RING_DEFINITION=Object.freeze({id:RETURN_RING_ID,ready:true,name:'归途之环',slot:'ring',baseVariant:'ring_survival',originRace:null,exclusiveId:'return-home',questOnly:true,ordinaryAffixCount:4});
const scenes=[
 {race:'dwarf',npcId:'npc.dwarf.hepo',npcName:'赫珀',areaId:'dwarf.a05',title:'留在冷泉边的工具',description:'救援队要带伤员离开冷泉，赫珀却还在水边找一只落下的工具袋。',dialogue:['赫珀：药料已经分好了。那只袋子不是药，是我师傅留下的旧模具。','赫珀：人先走，我知道。可他醒来总会问工具在哪。你若还能替我走一段，就清出泉边那条路。'],completion:['你把工具袋带回担架旁。赫珀把里面的碎片一件件擦干。','赫珀：完整的模具归他。这一片我留了多年，早已配不上现在的炉子。你拿着吧，别让它再硌着伤员。'],actionLabel:'清出泉边的路'},
 {race:'human',npcId:'npc.human.aoden',npcName:'奥登',areaId:'human.a04',title:'货单之外的名字',description:'追货途中，奥登正在盐泉旁核对伤员和失物。货单上的货物都有编号，失散的人却没有。',dialogue:['奥登：我记货记得快，记人反倒慢。刚才那个伤员，只问有没有人见过他的同伴。','奥登：劳你沿泉桥再找一遍。别只盯着箱子，看看路旁有没有落下的随身包。'],completion:['你带回随身包与沿路见闻，奥登在货单背面补上失散者的记号。','奥登：这枚银扣是空包里掉出来的，找不到认领的人。我记下去向，你替我收着。以后若有人来问，至少知道它没有丢进盐水里。'],actionLabel:'沿泉桥查找'},
 {race:'elf',npcId:'npc.elf.yiluo',npcName:'伊萝',areaId:'elf.a04',title:'湿滑的回程',description:'伊萝暂时离开根桥，在月井溪谷替救援队寻找稳妥的回程。',dialogue:['伊萝：抬担架不能走我平时攀的根。我要的是一条走得慢也不会滑下去的路。','伊萝：你先清开溪边的野物，我把绳结向低处挪。别惊动后面的伤员。'],completion:['担架沿低处溪径缓缓通过。伊萝收起最后一段绳，翻出夹在旧路记里的叶脉。','伊萝：我第一次独自认路时留下的。如今闭着眼也找得回根桥。给你吧，薄归薄，不会给行囊添多少重量。'],actionLabel:'清开溪边道路'},
 {race:'goblin',npcId:'npc.goblin.disuo',npcName:'滴索',areaId:'goblin.a06',title:'渡口最后一趟',description:'追货的人拥在暗河渡口，滴索的渡运货架翻在岸边，最后一趟船还不能开。',dialogue:['滴索：再催也没用。货架拖不回来，伤员躺哪儿？总不能让他们抱着箱子浮过去。','滴索：你去赶开河岸那群东西，我把船拴稳。找回货架后，这一趟先载人。'],completion:['货架重新绑牢，船上腾出足够的平地。滴索剪下几段反复打结的旧铜丝。','滴索：这个结我拆过三回，每回还是绕回原样。留着也派不上用场，你替我拿走。我得去招呼下一位了。'],actionLabel:'找回渡运货架'},
 {race:'ashen',npcId:'npc.ashen.lilu',npcName:'砾露',areaId:'ashen.a06',title:'没有回声的旧包',description:'救援队经过鸣晶断层时，砾露发现一只旧包落在来路。包里的矿露已经分完，仍有人回头看它。',dialogue:['砾露：矿露不在包里了。可那人一路抱着它，不该因为受伤就连空包也失去。','砾露：断层的回声会把脚步引偏。你替我清开来路，我跟着留下的记号找。'],completion:['旧包回到主人身边。砾露取出卡在包角、没有鸣动的一片晶石。','砾露：他示意留下包就好。这片东西一路没有响过，我也辨不出它的声音。你拿着，别让搬担架的人再踩着。'],actionLabel:'沿记号清开来路'}
];
export const RETURN_RING_EVENTS=Object.freeze(scenes.map(scene=>Object.freeze({...scene,id:'npc.return-ring.'+scene.race,requiresStoryFlag:'return-ring.'+scene.race+'.scene-open',repeatable:false,narrativeOnly:false,objective:Object.freeze({kind:'victory',nodeIds:Object.freeze([scene.areaId+'.field']),count:1}),materials:Object.freeze([]),rewards:Object.freeze([Object.freeze({kind:'material',key:RETURN_RING_MATERIALS.find(m=>m.race===scene.race).material+'|3',quantity:1})])})));
