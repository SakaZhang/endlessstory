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
 {id:'anvil',name:'碎砧',sub:'裂甲 · 重击',skills:['break','heavy','interrupt'],bonus:'2件：裂甲锤伤害 +25%；4件：重锻击伤害 +35%。'},
 {id:'rune',name:'炉纹',sub:'铭火 · 引燃',skills:['mark','ignite','interrupt'],bonus:'2件：铭火灼烧 +30%；4件：引燃伤害 +35%。'},
 {id:'guard',name:'守冢',sub:'坚守 · 反击',skills:['guard','break','interrupt'],bonus:'2件：坚守主动伤害 +30%；4件：坚守反击提高到100%攻击。'}
];
export const SKILLS={break:{name:'裂甲锤',icon:'⌁',cd:4,desc:'120%攻击伤害，削减目标25%护甲，持续6回合。'},heavy:{name:'重锻击',icon:'✦',cd:5,desc:'220%攻击伤害，破甲目标再提高25%。'},interrupt:{name:'断势',icon:'ϟ',cd:6,desc:'115%攻击伤害，打断本回合蓄力重击。'},mark:{name:'铭火',icon:'♨',cd:4,desc:'90%攻击伤害，附加5回合灼烧。'},ignite:{name:'引燃',icon:'✧',cd:5,desc:'160%攻击伤害，灼烧目标额外80%攻击伤害。'},guard:{name:'坚守',icon:'▣',cd:5,desc:'100%攻击伤害，3回合减伤40%并反击。'}};
export const LOCS=[
 {name:'失落驿道',en:'THE FORSAKEN ROAD',desc:'沿着车辙，追查消失的黑炉商队。',enemy:'灰旗劫掠者',boss:'灰旗首领 · 沃恩',hp:100,atk:9,armor:7,mat:'铁屑',tag:'金属',reward:3,bossGold:20},
 {name:'熄火矿井',en:'THE HOLLOW FORGE',desc:'熔炉已经冷却，矿井深处仍有锤声。',enemy:'失控矿傀',boss:'炉心守卫 · 断铸',hp:170,atk:14,armor:20,mat:'炉火晶',tag:'火焰',reward:5,bossGold:35},
 {name:'旧誓墓园',en:'THE OATHBOUND GRAVES',desc:'破碎盟约的见证者，沉睡于灰冠之下。',enemy:'失誓卫兵',boss:'守誓者 · 莫尔',hp:250,atk:20,armor:12,mat:'誓约残片',tag:'灵魂',reward:8,bossGold:55}
];
export const AFFIX_DEFS={
 atk:{name:'攻击',suffix:'',min:3,max:8},hp:{name:'生命',suffix:'',min:15,max:40},armor:{name:'护甲',suffix:'',min:2,max:6},
 hit:{name:'命中值',suffix:'',min:5,max:12},crit:{name:'暴击值',suffix:'',min:5,max:15},critDamage:{name:'暴伤值',suffix:'',min:8,max:20},element:{name:'元素附伤',suffix:'',min:2,max:7}
};
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
const uid=()=>`${Date.now().toString(36)}-${(++serial).toString(36)}-${Math.random().toString(36).slice(2,7)}`;
const rand=(a,b)=>Math.floor(a+Math.random()*(b-a+1));
const names={weapon:'战锤',helm:'铁盔',armor:'板甲',gloves:'护手',boots:'战靴',ring:'指环',amulet:'护符'};
const bases={weapon:{atk:12,armor:1,hp:5},helm:{atk:1,armor:4,hp:18},armor:{atk:1,armor:8,hp:18},gloves:{atk:3,armor:3,hp:8},boots:{atk:1,armor:4,hp:10},ring:{atk:3,armor:1,hp:8},amulet:{atk:2,armor:1,hp:14}};
function weighted(entries){let roll=Math.random()*entries.reduce((n,[,w])=>n+w,0);for(const [key,w] of entries){roll-=w;if(roll<0)return key;}return entries.at(-1)[0];}
function rollAffixes(quality){const pool=Object.keys(AFFIX_DEFS);const count=quality===0?rand(0,1):quality+1,affixes=[];for(let i=0;i<count;i++){const key=pool.splice(rand(0,pool.length-1),1)[0],def=AFFIX_DEFS[key];affixes.push({stat:key,value:rand(def.min,def.max)});}return affixes;}
export function item(slot,level=1,set=null,rarity=0){
 if(!SLOTS.includes(slot))throw new Error('Unsupported item family');
 rarity=clamp(Math.floor(rarity),0,3);level=Math.max(1,Math.floor(level));
 if(set&&(!SET_SLOTS.includes(slot)||!BUILD.some(b=>b.id===set)))set=null;
 if(set)rarity=3;
 const b=bases[slot],scale=(1+rarity*.1)*(0.92+Math.random()*.16),name=(set?BUILD.find(x=>x.id===set).name+'·':'旅铸·')+names[slot];
 const out={id:uid(),slot,set,rarity,level,name,atk:Math.max(1,Math.round(b.atk*scale+level*.7)),armor:Math.max(1,Math.round(b.armor*scale+level*.45)),hp:Math.round(b.hp*scale+level*1.8),affixes:rollAffixes(rarity),special:null,legendaryId:null,locked:false,bless:0};
 if(!set&&rarity>=2&&Math.random()<(rarity===2?.1:.2)){out.special={id:Object.keys(SPECIALS)[rand(0,3)]};}
 return out;
}
export function itemTotals(it){const m=divineMultiplier(it);return {atk:it.atk*m+(it.bless||0)*2,armor:it.armor*m,hp:it.hp*m};}
export function sellValue(it){return [2,4,8,16][it.rarity]+Math.floor(it.level/3);}
// Cost previews are deterministic and never consume random rolls.
export function getReforgeCost(it,mode){
 if(!it||!Number.isInteger(it.rarity)||it.rarity<0||it.rarity>3||!Array.isArray(it.affixes)||it.affixes.length===0)return null;
 const q=it.rarity;
 if(mode==='value')return {gold:10+5*q,materials:{'铁屑':1}};
 if(mode==='replace')return {gold:25+10*q,materials:{'铁屑':2,'炉火晶':1}};
 if(mode==='all')return {gold:50+20*q,materials:{'铁屑':3,'炉火晶':2}};
 return null;
}
export function reforge(s,itemId,mode,index){
 if(!s||!Array.isArray(s.inventory))return null;
 const it=s.inventory.find(i=>i.id===itemId),cost=getReforgeCost(it,mode);
 if(!cost||!SLOTS.includes(it.slot)||it.affixes.length>Object.keys(AFFIX_DEFS).length||it.affixes.some(a=>!a||typeof a!=='object'))return null;
 if(divineMultiplier(it)>1&&(!it.divine.bonus||typeof it.divine.bonus!=='object'))return null;
 if(new Set(it.affixes.map(a=>a.stat)).size!==it.affixes.length||!it.affixes.every(a=>Object.hasOwn(AFFIX_DEFS,a.stat)&&Number.isInteger(a.value)&&a.value>=AFFIX_DEFS[a.stat].min&&a.value<=AFFIX_DEFS[a.stat].max))return null;
 if(mode!=='all'&&(!Number.isInteger(index)||index<0||index>=it.affixes.length))return null;
 if(mode==='replace'&&it.affixes.length===Object.keys(AFFIX_DEFS).length)return null;
 if(!Number.isFinite(s.gold)||s.gold<cost.gold||!s.materials||Object.entries(cost.materials).some(([key,n])=>!Number.isFinite(s.materials[key])||s.materials[key]<n))return null;
 const before=it.affixes.map(a=>({...a})),after=before.map(a=>({...a}));
 const roll=stat=>({stat,value:rand(AFFIX_DEFS[stat].min,AFFIX_DEFS[stat].max)});
 if(mode==='value')after[index]=roll(after[index].stat);
 else if(mode==='replace'){
  const occupied=new Set(after.map(a=>a.stat));
  const pool=Object.keys(AFFIX_DEFS).filter(stat=>!occupied.has(stat));
  after[index]=roll(pool[rand(0,pool.length-1)]);
 }else{
  const pool=Object.keys(AFFIX_DEFS);
  for(let i=0;i<after.length;i++)after[i]=roll(pool.splice(rand(0,pool.length-1),1)[0]);
 }
 // Commit after all validation and rolls. Identity, base stats and unique effects stay intact.
 s.gold-=cost.gold;for(const [key,n] of Object.entries(cost.materials))s.materials[key]-=n;
 it.affixes=after;
 if(divineMultiplier(it)>1)it.divine.bonus.affixes=after.map(a=>({stat:a.stat,value:a.value/10}));
 return {item:it,mode,index:mode==='all'?null:index,cost,before,after:after.map(a=>({...a}))};
}
export function wardrobeIds(s){
 const ids=new Set();for(const loadout of Array.isArray(s.loadouts)?s.loadouts:[])if(loadout?.equip)for(const id of Object.values(loadout.equip))if(typeof id==='string')ids.add(id);return ids;
}
export function bagItems(s){const ids=wardrobeIds(s);return s.inventory.filter(it=>!ids.has(it.id));}
export function isProtected(s,id){return wardrobeIds(s).has(id);}
function validLoadout(s,loadout){
 if(!loadout||typeof loadout.name!=='string'||loadout.name.length<1||loadout.name.length>20||!loadout.equip||Object.keys(loadout.equip).length!==SOCKETS.length)return false;
 if(!SOCKETS.every(k=>loadout.equip[k]===null||s.inventory.some(it=>it.id===loadout.equip[k]&&it.slot===SOCKET_TYPE[k])))return false;
 const ids=Object.values(loadout.equip).filter(Boolean);if(new Set(ids).size!==ids.length)return false;
 return Array.isArray(loadout.skills)&&loadout.skills.length===3&&new Set(loadout.skills).size===3&&loadout.skills.every(k=>Object.hasOwn(SKILLS,k))&&Array.isArray(loadout.conditions)&&loadout.conditions.length===3&&loadout.conditions.every(k=>['always','low','charge','burn'].includes(k));
}
function validLoadoutSlots(s){return s.loadouts===undefined||(Array.isArray(s.loadouts)&&s.loadouts.length===3&&s.loadouts.every(l=>l===null||validLoadout(s,l)));}
function projectedLoadouts(s,index,next){
 if(!Number.isInteger(index)||index<0||index>2||!validLoadoutSlots(s))return null;
 const slots=s.loadouts?[...s.loadouts]:[null,null,null];slots[index]=next;
 return bagItems({...s,loadouts:slots}).length<=100?slots:null;
}
export function saveLoadout(s,index,name=''){
 if(typeof name!=='string')return false;
 const snapshot={name:name.trim().slice(0,20)||`方案${index+1}`,equip:{...s.equip},skills:[...s.skills],conditions:[...s.conditions]};
 if(!validLoadout(s,snapshot))return false;
 const slots=projectedLoadouts(s,index,snapshot);if(!slots)return false;s.loadouts=slots;return true;
}
export function deleteLoadout(s,index){const slots=projectedLoadouts(s,index,null);if(!slots)return false;s.loadouts=slots;return true;}
export function applyLoadout(s,index,battleActive=false){
 if(s.running||battleActive||!Number.isInteger(index)||index<0||index>2||!validLoadoutSlots(s))return false;
 const loadout=s.loadouts?.[index];if(!validLoadout(s,loadout))return false;
 s.equip={...loadout.equip};s.skills=[...loadout.skills];s.conditions=[...loadout.conditions];return true;
}
export function fresh(){
 const inventory=SOCKETS.map(socket=>{let type=SOCKET_TYPE[socket],it=item(type,1,null,0);it.name='旧炉·'+names[type];it.atk=bases[type].atk+1;it.armor=bases[type].armor+1;it.hp=bases[type].hp+2;it.affixes=[];return it;});
 return {version:SCHEMA_VERSION,race:'dwarf',hero:'布洛克',level:1,xp:0,gold:100,location:0,build:'anvil',inventory,equip:Object.fromEntries(SOCKETS.map((socket,i)=>[socket,inventory[i].id])),skills:['break','heavy','interrupt'],conditions:['always','always','charge'],materials:{'铁屑':5,'炉火晶':2,'誓约残片':1},talents:{power:0,heart:0,steel:0},kills:0,normalWins:[0,0,0],bossWins:[0,0,0],bossReady:[0,0,0],stock:3,loadouts:[null,null,null],chapters:[],chronicle:['灰冠历317年：你带着旧炉装备，离开黑炉堡寻找失踪商队。'],momentum:0,lastSeen:Date.now(),running:false};
}
export function equipItem(s,id,socket){
 const it=s.inventory.find(i=>i.id===id);if(!it)return false;
 if(!socket){if(it.slot==='ring'){socket=!s.equip.ring1?'ring1':!s.equip.ring2?'ring2':'ring1';}else socket=it.slot;}
 if(!SOCKETS.includes(socket)||SOCKET_TYPE[socket]!==it.slot)return false;
 for(const k of SOCKETS)if(k!==socket&&s.equip[k]===id){if(it.slot==='ring')s.equip[k]=s.equip[socket]??null;else return false;}
 s.equip[socket]=id;return true;
}
export function stats(s){
 const ids=[...new Set(Object.values(s.equip).filter(Boolean))],gear=ids.map(id=>s.inventory.find(i=>i.id===id)).filter(Boolean),count={},specials={};
 let atk=14+s.level*3+s.talents.power*3,armor=5+s.level+s.talents.steel*3,hp=120+s.level*14+s.talents.heart*20;
 const bonus=Object.fromEntries(Object.keys(AFFIX_DEFS).map(k=>[k,0]));
 for(const it of gear){const totals=itemTotals(it);atk+=totals.atk;armor+=totals.armor;hp+=totals.hp;if(it.set)count[it.set]=(count[it.set]||0)+1;if(it.special)specials[it.special.id]=true;for(const a of it.affixes)bonus[a.stat]+=a.value*divineMultiplier(it);}
 atk=Math.round(atk+bonus.atk);armor=Math.round(armor+bonus.armor);hp=Math.round(hp+bonus.hp);
 const ratingFactor=r=>Math.max(0,r)/(100+Math.max(0,r));
 return {atk,armor,hp,hit:clamp(.9+.1*ratingFactor(bonus.hit),.5,.995),crit:clamp(.05+.55*ratingFactor(bonus.crit),0,.6),critDamage:clamp(1.5+ratingFactor(bonus.critDamage),1.5,2.5),element:Math.min(bonus.element,Math.floor(atk*.6)),hitRating:bonus.hit,critRating:bonus.crit,critDamageRating:bonus.critDamage,count,specials,legend:false,bonus};
}
export function preset(s,id){const b=BUILD.find(x=>x.id===id);if(!b)return null;s.build=id;s.skills=[...b.skills];s.conditions=['always','always','charge'];return b;}
export function encounter(s,boss=false){const l=LOCS[s.location],st=stats(s);return {location:s.location,boss,name:boss?l.boss:l.enemy,hp:l.hp*(boss?4:1),max:l.hp*(boss?4:1),atk:l.atk*(boss?1.65:1),armor:l.armor*(boss?1.3:1),heroHp:st.hp,round:0,burn:0,broken:0,guard:0,stun:0,cd:{},shelterUsed:false,shield:0,done:false,rewarded:false,killSource:null};}
const damage=(raw,armor)=>Math.max(1,Math.round(raw*100/(100+Math.max(0,armor))));
function finish(e,win,source){e.done=true;e.win=win;e.hp=Math.max(0,e.hp);e.heroHp=Math.max(0,e.heroHp);e.killSource=source;}
export function step(s,e){
 if(e.done)return[];const st=stats(s),logs=[];e.round++;for(const k in e.cd)e.cd[k]=Math.max(0,e.cd[k]-1);
 const charge=e.round%4===0,ix=s.skills.findIndex((k,i)=>!e.cd[k]&&(s.conditions[i]!=='low'||e.heroHp<st.hp*.6)&&(s.conditions[i]!=='charge'||charge)&&(s.conditions[i]!=='burn'||e.burn>0)),k=ix<0?null:s.skills[ix];
 let raw=st.atk;
 if(k)e.cd[k]=SKILLS[k].cd;
 if(Math.random()<st.hit){
  if(k==='break'){raw*=1.2*(st.count.anvil>=2?1.25:1);e.broken=6;}
  if(k==='heavy')raw*=2.2*(e.broken?1.25:1)*(st.count.anvil>=4?1.35:1);
  if(k==='mark'){raw*=.9;e.burn=5;}
  if(k==='ignite')raw*=(e.burn?2.4:1.6)*(st.count.rune>=4?1.35:1);
  if(k==='guard'){raw*=st.count.guard>=2?1.3:1;e.guard=3;}
  if(k==='interrupt'){raw*=1.15;if(charge)e.stun=1;}
  if(!k&&s.momentum){raw*=1.35;s.momentum=0;logs.push('余势：普攻增强');}
  const crit=Math.random()<st.crit,armor=e.armor*(e.broken?.75:1),physical=damage(raw*(crit?st.critDamage:1),armor),element=st.element>0?damage(st.element,armor*.5):0;
  e.hp-=physical+element;logs.push((k?SKILLS[k].name:'普通攻击')+(crit?' 暴击':'')+' · '+(physical+element)+' 伤害'+(element?'（元素'+element+'）':''));
  if(e.hp<=0){if(st.specials.momentum)s.momentum=1;finish(e,true,'active');return logs;}
 }else logs.push((k?SKILLS[k].name:'普通攻击')+' · 未命中');
 if(e.burn>0){const dot=damage(st.atk*.32*(st.count.rune>=2?1.3:1),e.armor*.5);e.hp-=dot;e.burn--;logs.push('炉火灼烧 · '+dot);if(e.hp<=0){finish(e,true,'burn');return logs;}}
 if(e.stun){logs.push('敌人蓄力被打断');e.stun=0;}else{
  let hurt=Math.max(1,Math.round(damage(e.atk*(charge?2:1),st.armor)*(e.guard>0?.6:1)));
  if(st.specials.shelter&&!e.shelterUsed&&e.heroHp-hurt<=st.hp*.3){e.shelterUsed=true;e.shield=Math.ceil(st.hp*.2);logs.push('绝境庇护 · 护盾 '+e.shield);}
  const absorbed=Math.min(e.shield,hurt);e.shield-=absorbed;hurt-=absorbed;e.heroHp-=hurt;logs.push((charge?'敌人重击':'敌人攻击')+' · -'+hurt+(absorbed?'（护盾吸收'+absorbed+'）':''));
  if(e.heroHp>0&&e.guard>0){const counter=damage(st.atk*(st.count.guard>=4?1:.6),e.armor);e.hp-=counter;logs.push('坚守反击 · '+counter);}
 }
 e.guard=Math.max(0,e.guard-1);e.broken=Math.max(0,e.broken-1);
 if(e.heroHp<=0){s.momentum=0;finish(e,false,null);}else if(e.hp<=0)finish(e,true,'counter');return logs;
}
export function gainXp(s,n){s.xp+=n;while(s.xp>=s.level*80){s.xp-=s.level*80;s.level++;}}
function rollQuality(weights=[65,28,6.5,.5]){return Number(weighted(weights.map((w,i)=>[i,w])));}
function rollDrop(s,boss){if(Math.random()>=(boss?.65:.18)||bagItems(s).length>=100)return null;const isSet=Math.random()<(boss?.05:.01),slot=isSet?SET_SLOTS[rand(0,SET_SLOTS.length-1)]:SLOTS[rand(0,SLOTS.length-1)],set=isSet?BUILD[rand(0,2)].id:null,quality=isSet?3:rollQuality();const it=item(slot,s.level,set,quality);s.inventory.push(it);return it;}
export function reward(s,e,now=Date.now()){
 if(!e.win||e.rewarded)return null;e.rewarded=true;const index=e.location??s.location,l=LOCS[index],st=stats(s);s.kills++;s.gold+=e.boss?l.bossGold:l.reward;
 const baseXp=e.boss?100:20+index*8,knowledge=st.specials.knowledge&&Math.random()<.05;gainXp(s,baseXp*(knowledge?2:1));s.materials[l.mat]+=e.boss?4:1;
 if(st.specials.scavenger&&Math.random()<.1){s.materials[l.mat]++;e.rewardNotes=['拾荒者：额外材料 +1'];}if(knowledge)(e.rewardNotes??=[]).push('求知：额外基础经验 +'+baseXp);
 let drop=rollDrop(s,e.boss);
 if(e.boss){s.bossWins[index]++;s.bossReady[index]=now+60000;if(!s.chapters.includes(index)){s.chapters.push(index);s.chronicle.unshift(['沃恩交出了商队货单：货物并非被抢，而是被人改道。','哥布林技师「尼克」从炉芯发现了烬裔封印。','精灵信使「瑟拉」证实：旧盟约的碎片，正在被五族争夺。'][index]);}}else s.normalWins[index]++;
 return drop;
}
export function offline(s,now=Date.now()){
 const elapsed=Math.min(4*3600000,Math.max(0,now-s.lastSeen));s.lastSeen=now;
 if(!s.running||elapsed<60000||!s.normalWins[s.location])return null;
 const cycles=Math.floor(elapsed/60000),l=LOCS[s.location],gold=cycles*l.reward,xp=cycles*8,mat=Math.floor(cycles/3);s.gold+=gold;gainXp(s,xp);s.materials[l.mat]+=mat;s.chronicle.unshift('离线驻扎：侦察员带回'+gold+'金币与'+mat+'份'+l.mat+'。');s.chronicle=s.chronicle.slice(0,20);return {minutes:Math.floor(elapsed/60000),gold,xp,mat};
}
export const FUSION_TAGS={
 '铁屑':{set:'anvil',slots:{weapon:2,helm:1,armor:2,gloves:1,boots:1,ring:0,amulet:0}},
 '炉火晶':{set:'rune',slots:{weapon:1,helm:0,armor:0,gloves:1,boots:0,ring:2,amulet:2}},
 '誓约残片':{set:'guard',slots:{weapon:0,helm:1,armor:0,gloves:0,boots:1,ring:2,amulet:2}}
};
export function fusionWeights(selection){const slots=Object.fromEntries(SLOTS.map(k=>[k,2])),sets=Object.fromEntries(BUILD.map(b=>[b.id,1]));for(const key of selection){const tag=FUSION_TAGS[key];if(!tag)continue;sets[tag.set]+=2;for(const slot of SLOTS)slots[slot]+=tag.slots[slot];}return {slots,sets};}
export function forge(s,selection){
 if(!Array.isArray(selection)||selection.length<1||selection.length>5||s.gold<40||bagItems(s).length>=100)return null;
 const counts={};for(const key of selection){if(!Object.hasOwn(FUSION_TAGS,key))return null;counts[key]=(counts[key]||0)+1;}if(Object.entries(counts).some(([k,v])=>s.materials[k]<v))return null;
 const weights=fusionWeights(selection),isSet=Math.random()<.05,slot=weighted(Object.entries(weights.slots).filter(([k])=>!isSet||SET_SLOTS.includes(k))),set=isSet?weighted(Object.entries(weights.sets)):null,n=selection.length,quality=isSet?3:rollQuality([50-4*n,40+2*n,9+1.6*n,1+.4*n]);
 const it=item(slot,s.level+rand(0,2),set,quality);if(Math.random()<.03)applyForgeFavor(it);Object.entries(counts).forEach(([k,v])=>s.materials[k]-=v);s.gold-=40;s.inventory.push(it);return it;
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
export function codexState(s,id){const entry=LEGENDARY_CODEX.find(x=>x.id===id);if(!entry)return null;if(!entry.implemented)return {collected:false,status:'设计预览 · 未收集'};const collected=s.inventory.some(i=>i.legendaryId===id);return {collected,status:collected?'已收集':'未收集'};}
export function validSave(s){
 try{const num=(n,max=1e12)=>Number.isFinite(n)&&n>=0&&n<=max;
 if(s.version!==SCHEMA_VERSION||s.race!=='dwarf'||s.hero!=='布洛克'||!Number.isInteger(s.level)||s.level<1||s.level>=100000||!num(s.xp)||!num(s.gold)||!Number.isInteger(s.location)||s.location<0||s.location>2)return false;
 if(!Array.isArray(s.inventory)||s.inventory.length>124||!s.inventory.every(i=>typeof i.id==='string'&&typeof i.name==='string'&&SLOTS.includes(i.slot)&&Number.isInteger(i.rarity)&&i.rarity>=0&&i.rarity<=3&&(!i.set||(BUILD.some(b=>b.id===i.set)&&SET_SLOTS.includes(i.slot)&&i.rarity===3))&&num(i.atk)&&num(i.hp)&&num(i.armor)&&num(i.level)&&num(i.bless,5)&&Array.isArray(i.affixes)&&(i.rarity===0?i.affixes.length<=1:i.affixes.length===i.rarity+1)&&new Set(i.affixes.map(a=>a.stat)).size===i.affixes.length&&i.affixes.every(a=>Object.hasOwn(AFFIX_DEFS,a.stat)&&Number.isInteger(a.value)&&num(a.value,50))&&(!i.special||(!i.set&&i.rarity>=2&&Object.hasOwn(SPECIALS,i.special.id)))&&i.legendaryId===null&&(i.divine===undefined||(i.divine?.id==='forge-favor'&&i.divine.name==='神赐·炉火眷顾'&&i.divine.model==='raw-v1'&&['atk','armor','hp'].every(k=>num(i.divine.bonus?.[k]))))))return false;
 if(!validLoadoutSlots(s)||bagItems(s).length>100)return false;
 if(new Set(s.inventory.map(i=>i.id)).size!==s.inventory.length||!s.equip||Object.keys(s.equip).length!==SOCKETS.length||!SOCKETS.every(k=>s.equip[k]===null||s.inventory.some(i=>i.id===s.equip[k]&&i.slot===SOCKET_TYPE[k])))return false;
 const equipped=Object.values(s.equip).filter(Boolean);if(new Set(equipped).size!==equipped.length)return false;
 return Array.isArray(s.skills)&&s.skills.length===3&&new Set(s.skills).size===3&&s.skills.every(k=>Object.hasOwn(SKILLS,k))&&Array.isArray(s.conditions)&&s.conditions.length===3&&s.conditions.every(k=>['always','low','charge','burn'].includes(k))&&LOCS.every(l=>num(s.materials[l.mat]))&&['power','heart','steel'].every(k=>Number.isInteger(s.talents[k])&&num(s.talents[k],s.level))&&Object.values(s.talents).reduce((a,b)=>a+b,0)<=s.level-1&&['bossWins','bossReady','normalWins'].every(k=>Array.isArray(s[k])&&s[k].length===3&&s[k].every(n=>num(n,1e15)))&&Array.isArray(s.chapters)&&s.chapters.every(n=>Number.isInteger(n)&&n>=0&&n<3)&&Array.isArray(s.chronicle)&&s.chronicle.length<=100&&s.chronicle.every(t=>typeof t==='string'&&t.length<2000)&&num(s.kills)&&num(s.stock,3)&&num(s.lastSeen,1e15)&&[0,1].includes(s.momentum)&&typeof s.running==='boolean';
 }catch{return false;}
}
