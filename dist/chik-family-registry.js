// Presentation-only identities. These are Chik's three family members, NOT
// additional regional task-givers. Never serialize these aliases into story history.
const freeze=o=>{if(o&&typeof o==='object'){Object.values(o).forEach(freeze);Object.freeze(o);}return o;};
export const CHIK_FAMILY_CHARACTERS=freeze({
 'family.goblin.kalo':{id:'family.goblin.kalo',name:'咔洛',race:'goblin',gender:'male',role:'快长大的弟弟',alias:'快长大的那个',file:'story-family-portraits/family.goblin.kalo.png',width:96,height:96,facing:'right',appearance:'橄榄绿皮肤、乱翘短发、赭红围巾；攥着一条还嫌长的背带。',personality:'急着证明自己，也想替哥哥分担。'},
 'family.goblin.mirei':{id:'family.goblin.mirei',name:'米芮',race:'goblin',gender:'female',role:'帮忙分粮的妹妹',alias:'谨慎的那个',file:'story-family-portraits/family.goblin.mirei.png',width:96,height:96,facing:'right',appearance:'青绿皮肤、低双辫、靛蓝补丁围裙；手里总理着粮袋的结绳。',personality:'把余粮数清楚，也把哥哥那份留好。'},
 'family.goblin.dobu':{id:'family.goblin.dobu',name:'豆布',race:'goblin',gender:'male',role:'最小的弟弟',alias:'最小的那个',file:'story-family-portraits/family.goblin.dobu.png',width:96,height:96,facing:'right',appearance:'浅绿圆脸、大长耳、芥黄色宽袖上衣；抱着一只旧木碗。',personality:'还不懂粮从哪里来，总盼着今天能吃满。'}
});
// Script source IDs, not new playable scene definitions. C10/END presentation is
// ready for its future host; this table does not unlock or simulate those scenes.
export const CHIK_FAMILY_SCENE_CAST=freeze({
 ...Object.fromEntries([1,2,4].map(n=>['personal.goblin.family.'+String(n).padStart(2,'0'),['family.goblin.kalo','family.goblin.mirei','family.goblin.dobu']])),
 'C01.G01':['family.goblin.kalo','family.goblin.mirei','family.goblin.dobu'],
 'C02.O01':['family.goblin.kalo','family.goblin.mirei'],
 'C05.O01':['family.goblin.kalo','family.goblin.mirei'],
 'C07.O01':['family.goblin.kalo'],
 'C10.G01':['family.goblin.kalo','family.goblin.mirei','family.goblin.dobu'],
 'END.G01':['family.goblin.kalo','family.goblin.mirei','family.goblin.dobu']
});
export function chikFamilyCast(scene){
 if(scene?.pov!=='goblin'||!Object.hasOwn(CHIK_FAMILY_SCENE_CAST,scene.sourceScene))return [];
 return CHIK_FAMILY_SCENE_CAST[scene.sourceScene].map(id=>CHIK_FAMILY_CHARACTERS[id]);
}
export function chikFamilySpeaker(scene,line){
 if(typeof line!=='string')return null;
 return chikFamilyCast(scene).find(c=>line.startsWith(c.alias+'：')||line.startsWith(c.name+'：'))??null;
}
export function chikFamilyDisplayText(scene,text){
 if(typeof text!=='string')return text;
 const cast=chikFamilyCast(scene);if(!cast.length)return text;
 for(const c of cast)text=text.replaceAll(c.alias,c.name);
 const names=cast.map(c=>c.name).join('、');
 // Only the exact existing cast labels are expanded. Ordinary phrases such as
 // “一家人” or “护送三个家人” must never undergo a global substring replacement.
 if(text==='三个弟弟妹妹'||text==='家人')return names;
 if(text==='换粮者与家人')return '换粮者与'+names;
 return text;
}
