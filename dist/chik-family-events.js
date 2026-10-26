// Six optional, one-off family moments. Separate from 60 regional errands.
// All use the existing explicit-choice + sealed narrative transaction service;
// No new inventory identities, stats, world flags or mainline gates. Reward
// records are a separate approval-gated fixed-data policy, not authored here.
import {CHIK_FAMILY_REWARD_POLICY,CHIK_FAMILY_EVENT_REWARDS} from './chik-family-event-rewards.js';
const freeze=o=>{if(o&&typeof o==='object'){Object.values(o).forEach(freeze);Object.freeze(o);}return o;};
const rows=[
 {id:'family.kalo.footsteps',npcId:'family.goblin.kalo',npcName:'咔洛',areaId:'goblin.a01',title:'偷偷跟来的脚步',stage:'early',description:'奇克还没走出住处旁的短坡，就听见背后多了一串急忙停下的脚步。咔洛缩在转角，背带拖进泥里。',dialogue:['咔洛：我没出声。你怎么知道？','奇克：你停下来那一下，比走路还响。','咔洛捡起拖地的背带，等着奇克决定这次怎么办。'],choices:[
  {id:'listen-first',label:'先停下来，一起分辨坡上的声音',dialogue:'奇克按住他的肩，让他先别迈步。咔洛听了一会儿，才分清布料擦墙和自己的喘气声。',outcome:'咔洛：原来我还没走，背上的东西就先走了。奇克让他把背带收进手里，送他回到门口。这次没有带他进入粮路。'},
  {id:'walk-in-sight',label:'陪他走到看得见家门的转角，再一起回来',dialogue:'奇克没有答应带他出门，只让咔洛走在自己看得见的位置。到转角时，咔洛先停了下来。',outcome:'咔洛：再往前就看不见门了。奇克点头，带他折返。咔洛记住了这个界限，回到门边却还是盯着哥哥的背袋。'}
 ]},
 {id:'family.mirei.missing-grain',npcId:'family.goblin.mirei',npcName:'米芮',areaId:'goblin.a01',title:'少了一把粮',stage:'early',description:'米芮把同一袋余粮数了两遍，仍少了一小把。她没有吵醒别人，把袋底摊在奇克面前。',dialogue:['米芮：昨天是这些。今天不是。','奇克：先别算到谁嘴里。','米芮：所以我等你一起看。'],choices:[
  {id:'check-seam',label:'翻过粮袋，沿着底缝慢慢摸一遍',dialogue:'奇克托住袋底，米芮摸到一段松开的缝。布折里夹着碎粮，袋子一提就往外漏。',outcome:'两人把能收起的粮放回去，把沾了泥的挑开。米芮重新扎紧袋底，又在松线处打了个醒目的结：明早先查这里，不先查谁的碗。'},
  {id:'count-together',label:'先和她重新分堆，再查粮袋落过的地方',dialogue:'奇克一堆堆念数，米芮跟着移动碗。搬开粮袋后，地上露出一条细小的漏粮痕。',outcome:'他们顺着痕迹找到松开的袋缝。米芮把落地不能吃的另放一边，承认少掉的已经找全了。奇克陪她把袋底扎好，没有把亏空算给任何一个家人。'}
 ]},
 {id:'family.dobu.cracked-bowl',npcId:'family.goblin.dobu',npcName:'豆布',areaId:'goblin.a01',title:'裂开的木碗',stage:'early',description:'豆布用双手捧着空木碗，一直用拇指挡住碗沿那条新裂缝。奇克伸手，他反而抱得更紧。',dialogue:['豆布：换了新的，还是我的碗吗？','奇克：先让我看看。','豆布：不能把这块扔掉。'],choices:[
  {id:'bind-together',label:'用家里的旧布条箍住裂口，让他按着打结',dialogue:'奇克先压平毛刺，再把旧布条绕过碗外。豆布按住结头，几次想松手，都等到奇克说好了才放。',outcome:'碗被留下来盛干粮，不再拿来盛汤。豆布摸着外面的结，说这是两个人修的；奇克让他别用牙去扯。'},
  {id:'keep-mark',label:'保留裂口的记号，陪他把碗磨成装小东西的浅碗',dialogue:'奇克顺着裂口削去松动的小边，磨平剩下的木刺。豆布选了裂纹旁那块旧印子，要求一定留着。',outcome:'吃饭改用家里的另一只碗，旧碗仍归豆布，用来放他捡来的小东西。豆布把两只摆开：这个吃饭，这个不借。'}
 ]},
 {id:'family.kalo.first-load',npcId:'family.goblin.kalo',npcName:'咔洛',areaId:'goblin.a04',title:'能背多少',stage:'later',description:'刚到家的粮袋还在门内。咔洛主动抓起背带，想替奇克把它搬到储粮角，却走两步就屏住了呼吸。',dialogue:['咔洛：我能背。就是……带子不对。','奇克：先放下。粮不会因为你憋气就变轻。','咔洛看看还剩的几步，不肯空着手过去。'],choices:[
  {id:'split-load',label:'分成两份，让他挑自己能稳稳走完的那份',dialogue:'奇克把粮袋分开，不替他挑。咔洛试过重的，又把它放下，自己换了小袋。',outcome:'小袋被稳稳放到储粮角。咔洛承认刚才那袋太重，却要求下一次仍留一份给他。奇克答应先让他试重量，不答应带他进危险粮路。'},
  {id:'short-test',label:'改短背带，先约定只试到门内的木凳',dialogue:'奇克收短背带，把最沉的那部分拿走。咔洛背到木凳旁，手指已经发抖；这回他自己先说停。',outcome:'剩下的几步由两人合抬。咔洛学会了把“能抬起来”和“能背到地方”分开算。奇克把改短的背带交还给他：先从家门里这几步学。'}
 ]},
 {id:'family.mirei.saved-share',npcId:'family.goblin.mirei',npcName:'米芮',areaId:'goblin.a04',title:'留下的那一份',stage:'later',description:'米芮把一只盖好的碗挪到最里面。她说大家都分好了，却避开奇克伸向碗盖的手。',dialogue:['米芮：那份给晚回来的人。','奇克：你自己的呢？','米芮：我知道该留多少。你别又说你不饿。'],choices:[
  {id:'share-now',label:'让她把自己的碗也拿来，一起重新分匀',dialogue:'奇克没有把藏着的那碗独自端走，而是让米芮把所有人的碗摆到一起。她看了半天，终于也拿出自己的小碗。',outcome:'每只碗仍没有堆满。米芮不再把自己的份藏在算法外，奇克也没有用一句“不饿”把自己的份推回去。'},
  {id:'keep-covered',label:'保留这份晚饭，但先和她约好每人都要有一份',dialogue:'奇克把碗盖好，陪米芮挨个确认别人的份。到她自己的碗时，他没有让开目光。',outcome:'米芮把留饭的记号系在碗边：谁晚回来就给谁，但不是从最小或最会忍的那个人碗里扣。奇克也答应晚回来时先看这个记号。'}
 ]},
 {id:'family.dobu.trophy',npcId:'family.goblin.dobu',npcName:'豆布',areaId:'goblin.a04',title:'哥哥的战利品',stage:'later',description:'豆布在门边等着，把一块洗过的普通小石头塞进奇克手心。石面有一条浅色纹，在灯下显得亮一点。',dialogue:['豆布：这个给你。战利品。','奇克：你打赢了谁？','豆布：泥。洗了好久。'],choices:[
  {id:'keep-by-door',label:'收下，和他一起放到家门内的固定位置',dialogue:'奇克把小石头放在门内不会被脚踢到的地方，让豆布再看一遍位置。豆布认真地把浅色纹朝外转好。',outcome:'灯挪开后，石头就不亮了。豆布仍能指着它说哥哥收下了。奇克出门前，顺手又把那条浅色石纹拨正。'},
  {id:'name-together',label:'和他给石纹起个小名字，再请他代为保管',dialogue:'两人看了半天，豆布说像一条不会漏粮的小路。奇克说那就叫“平路”，让他先替自己守好。',outcome:'豆布把石头放回自己的小东西旁，反复念它的名字。石头一点也不发光，但这个名字让豆布很满意。这回是他替哥哥看住一样东西。'}
 ]}
];
export const CHIK_FAMILY_EVENTS=freeze(rows.map(({stage,...d})=>({...d,category:'chik-family',playerRace:'goblin',race:'goblin',requiresStoryFlag:'G_MET_H',conditions:{requiredStorySceneIds:[stage==='early'?'C02.O01.goblin':'C05.O01.goblin'],forbiddenStoryFlags:['INVASION_BEGAN']},repeatable:false,narrativeOnly:false,objective:{kind:'conversation'},materials:[],rewardPolicyId:CHIK_FAMILY_REWARD_POLICY.id,rewardPolicyApproved:CHIK_FAMILY_REWARD_POLICY.approved,rewards:CHIK_FAMILY_EVENT_REWARDS[d.id]??[],decline:{label:'晚些再聊',permanent:false}})));
