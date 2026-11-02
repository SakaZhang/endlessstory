import {equipmentNameFromReceipt} from './equipment-display-name.js';
// Settlement-only observational receipts. No RNG, inventory writes, or claim replay.
export const LOOT_HISTORY_LIMIT=100;
const captures=new WeakMap();
const text=x=>typeof x==='string'&&x.length>0&&x.length<=180;
const count=x=>Number.isSafeInteger(x)&&x>=0&&x<=1e12;
const keys=(x,ks)=>x&&typeof x==='object'&&!Array.isArray(x)&&Object.keys(x).length===ks.length&&ks.every(k=>Object.hasOwn(x,k));
const validRow=r=>keys(r,['kind','name','quality','quantity','level','outcome'])&&['equipment','material','consumable','potion'].includes(r.kind)&&text(r.name)&&Number.isInteger(r.quality)&&r.quality>=0&&r.quality<=4&&count(r.quantity)&&r.quantity>0&&count(r.level)&&['received','filtered','pending','overflow'].includes(r.outcome);
export function validLootHistory(s){const h=s.lootHistory;if(h===undefined)return true;return keys(h,['version','records'])&&h.version===1&&Array.isArray(h.records)&&h.records.length<=LOOT_HISTORY_LIMIT&&new Set(h.records.map(r=>r?.id)).size===h.records.length&&h.records.every(r=>keys(r,['id','at','mode','node','region','floor','stage','gold','xp','drops'])&&text(r.id)&&Number.isSafeInteger(r.at)&&r.at>=0&&r.at<=1e15&&['field','dungeon','boss','otherworld'].includes(r.mode)&&text(r.node)&&text(r.region)&&count(r.floor)&&Number.isInteger(r.stage)&&r.stage>=0&&r.stage<=3&&count(r.gold)&&count(r.xp)&&Array.isArray(r.drops)&&r.drops.length<=256&&r.drops.every(validRow));}
export function beginLootReceipt(s){captures.set(s,[]);}
export function captureLoot(s,row){const rows=captures.get(s);if(!rows||!validRow(row))return;const found=rows.find(r=>['kind','name','quality','level','outcome'].every(k=>r[k]===row[k]));if(found)found.quantity+=row.quantity;else rows.push({...row});}
export function finishLootReceipt(s,metadata,committed){const drops=captures.get(s);captures.delete(s);if(!committed||!drops)return;const receipt={...metadata,drops};if(!validLootHistory({lootHistory:{version:1,records:[receipt]}}))return;const h=s.lootHistory??={version:1,records:[]};if(h.records.some(r=>r.id===receipt.id))return;h.records.unshift(receipt);h.records.length=Math.min(h.records.length,LOOT_HISTORY_LIMIT);}
const esc=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function renderLootHistory(s){
 if(!validLootHistory(s))return '<p>掉落记录格式无效。</p>';
 const records=s.lootHistory?.records??[],outcomes={received:'已入包',filtered:'品质过滤丢弃',pending:'结算时待领取（已保留）',overflow:'背包已满未收取'},modes={field:'野外',dungeon:'普通副本',boss:'首领',otherworld:'异界高塔'};
 return '<p class="subtleText">最近100场实际结算；仅记录结算时结果，后来领取不会重复记掉落。旧存档不补造历史物品。</p><div class="logList">'+(records.length?records.map(r=>'<section class="chronicle"><h3>'+esc(modes[r.mode]+' · '+r.region+' · '+r.node+(r.floor?' · 第'+r.floor+'层':'')+(r.stage?' · 阶段'+r.stage+'/3':''))+'</h3><time>'+esc(new Date(r.at).toLocaleString('zh-CN',{year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}))+'</time><ul>'+r.drops.map(d=>'<li>'+esc((d.kind==='consumable'?'':(d.kind==='equipment'?['普通','稀有','优良','至臻','传说']:['普通','稀有','优良','至臻'])[d.quality]+' ')+(d.kind==='equipment'?equipmentNameFromReceipt(d.name):d.name)+(d.level?' · Lv.'+d.level:'')+' ×'+d.quantity+' — '+outcomes[d.outcome])+'</li>').join('')+'</ul>'+(r.drops.length?'':'<p>本场未掉落物品。</p>')+'<p>结算收益（非物品）：金币 +'+r.gold+' / 经验 +'+r.xp+'</p></section>').join(''):'<p>尚无实际掉落结算记录。</p>')+'</div>';
}
