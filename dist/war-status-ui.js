import {RACE_KEYS,AREAS} from './location-schema.js';
import {validDiplomacy,territoryAccess,warActiveAt,warKind} from './war-diplomacy.js';

const names={human:'人族',dwarf:'矮人',elf:'精灵',goblin:'哥布林',ashen:'烬裔'};
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clockLabel=seconds=>Math.floor(seconds/60)+':'+String(seconds%60).padStart(2,'0');

// Presentation only: never settle wars, normalize saves, consume RNG, or grant access.
export function buildWarStatus(s,now=Date.now()){
 const valid=validDiplomacy(s)&&RACE_KEYS.includes(s?.race)&&Number.isSafeInteger(now)&&now>=0&&now<=1e15;
 if(!valid)return {valid:false,wars:[],factions:[],currentRace:null};
 const rollback=now<Math.max(s.worldEvents?.lastProcessedAt??0,s.lastSeen??0,s.lastHealthClock??0);
 const wars=(s.diplomacy?.wars??[]).filter(w=>!(rollback&&warKind(w)==='random')&&warActiveAt(w,now)).map(w=>{
  const kind=warKind(w),participating=w.races.includes(s.race),blockedRace=participating?w.races.find(r=>r!==s.race):null;
  return {id:w.id,races:[...w.races],title:w.races.map(r=>names[r]).join(' ↔ '),kind,participating,blockedRace,remainingSeconds:kind==='random'?Math.max(0,Math.ceil((w.expiresAt-now)/1000)):null};
 });
 const factions=RACE_KEYS.map(race=>{
  const involved=wars.filter(w=>w.races.includes(race)),blocked=territoryAccess(s,race,now).code==='war';
  const label=blocked?'交战中 · 对你封锁':involved.length?race===s.race?'交战中 · 本族领地':'交战中 · 未对你封锁':'可探索';
  const pinLabel=blocked?'交战中\n封锁':involved.length?race===s.race?'交战中\n本族':'交战中\n可入':'可探索';
  return {race,name:names[race],wars:involved,blocked,label,pinLabel,state:blocked?'blocked':involved.length?'active':'peace'};
 });
 return {valid:true,wars,factions,currentRace:AREAS[s.siteId]?.race??null};
}
export function warPinStatus(model,race){return model.factions.find(f=>f.race===race)??{race,name:names[race]??race,label:'战况暂不可读取',pinLabel:'待确认',state:'unknown',wars:[],blocked:false};}
const duration=war=>war.kind==='random'?`随机战争 · 剩余 ${clockLabel(war.remainingSeconds)}`:'剧情战争 · 解除需推进相关主线';
function warRow(war){
 const impact=war.participating?`对你封锁：${names[war.blockedRace]}全部区域；普通野外、副本、首领与挂机不可进入。`:'你未参与这场战争；双方领地不因本场战争对你封锁。';
 return `<li class="warStatusRow"><div><strong>${esc(war.title)}</strong><span class="warDuration">${esc(duration(war))}</span></div><p>${esc(impact)}</p></li>`;
}
export function renderWorldWarStatus(model){
 return `<section class="warStatusPanel" aria-label="世界战况"><h2>世界战况</h2>${!model.valid?'<p>战况暂不可读取</p>':model.wars.length?`<ul>${model.wars.map(warRow).join('')}</ul><p class="warStatusHint">战争按种族领地生效；地图仍可浏览，实际出发受封锁限制。</p>`:'<p class="warPeace">当前无战争</p>'}</section>`;
}
export function renderRegionWarStatus(model,race){
 const faction=warPinStatus(model,race);
 if(!model.valid)return '<section class="warStatusPanel" aria-label="领地战况"><p>战况暂不可读取</p></section>';
 const state=faction.blocked?'战争封锁':faction.wars.length?'交战中':model.wars.length?'本领地当前无战争':'当前无战争';
 const notice=faction.blocked?`${model.currentRace===race?'你当前身处封锁领地。':''}${faction.name}全部区域对你封锁；普通野外、副本、首领与挂机不可进入。已入场战斗可正常结算。`:faction.wars.length?'本领地未因战争对你封锁；区域解锁、冷却等条件仍照常生效。':'';
 return `<section class="warStatusPanel ${faction.blocked?'warStatusBlocked':''}" aria-label="领地战况"><h2>${esc(faction.name)}领地战况 <span class="warStateBadge">${esc(state)}</span></h2>${notice?`<p class="warRegionNotice">${esc(notice)}</p>`:''}${faction.wars.length?`<ul>${faction.wars.map(warRow).join('')}</ul>`:''}</section>`;
}
// Update only dedicated text/status hosts. Never replace the map, region controls,
// active checkbox, or canvas; safe to call from the existing UI clock.
export function refreshWarStatus(root,s,now,{view,race}={}){
 if(!['world','region'].includes(view))return false;
 const model=buildWarStatus(s,now),host=root.getElementById(view==='world'?'worldWarStatus':'regionWarStatus');
 const html=view==='world'?renderWorldWarStatus(model):renderRegionWarStatus(model,race);
 if(host&&host.innerHTML!==html)host.innerHTML=html;
 if(view==='world')for(const faction of model.factions){
  const pin=root.getElementById('warPin-'+faction.race),label=root.getElementById('warPinStatus-'+faction.race);
  if(label&&label.textContent!==faction.pinLabel)label.textContent=faction.pinLabel;
  if(pin){if(pin.dataset&&pin.dataset.warState!==faction.state)pin.dataset.warState=faction.state;const label=faction.name+'领地 · '+faction.label;if(pin.getAttribute?.('aria-label')!==label)pin.setAttribute?.('aria-label',label);}
 }
 return true;
}
