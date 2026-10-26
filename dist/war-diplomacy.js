import {AREAS,INSTANCES,RACE_KEYS} from './location-schema.js';

// Explicit event transitions only. This module never rolls for war, invents a
// duration, advances story flags, or grants a blanket quest/travel exemption.
const record=v=>!!v&&typeof v==='object'&&!Array.isArray(v);
const keys=(v,allowed)=>record(v)&&Object.keys(v).length===allowed.length&&allowed.every(k=>Object.hasOwn(v,k));
const clock=n=>Number.isSafeInteger(n)&&n>=0&&n<=1e15;
const eventId=id=>typeof id==='string'&&/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,127}$/.test(id)&&!['constructor','prototype','__proto__'].includes(id);
const races=v=>Array.isArray(v)&&v.length===2&&Array.from(v).every(r=>RACE_KEYS.includes(r))&&v[0]!==v[1];
const raceNames={human:'人族',dwarf:'矮人',elf:'精灵',goblin:'哥布林',ashen:'烬裔'};
export const freshDiplomacy=()=>({version:1,revision:0,wars:[]});
export function validDiplomacy(s){
 if(!record(s))return false;
 const d=s.diplomacy;if(d===undefined)return true;
 if(!keys(d,['version','revision','wars'])||d.version!==1||!Number.isSafeInteger(d.revision)||d.revision<0||!Array.isArray(d.wars)||d.wars.length>10000)return false;
 const ids=new Set(),activePairs=new Set();let transitions=0;
 for(const w of Array.from(d.wars)){
  if(!record(w)||!['active','ended'].includes(w.status)||!keys(w,w.status==='active'?['id','races','status','startedAt']:['id','races','status','startedAt','endedAt'])||!eventId(w.id)||ids.has(w.id)||!races(w.races)||w.races.join('|')!==[...w.races].sort().join('|')||!clock(w.startedAt))return false;
  ids.add(w.id);transitions++;
  if(w.status==='ended'){if(!clock(w.endedAt)||w.endedAt<w.startedAt)return false;transitions++;}
  else {const pair=w.races.join('|');if(activePairs.has(pair))return false;activePairs.add(pair);}
 }
 return d.revision===transitions;
}
export function normalizeDiplomacy(s){if(!validDiplomacy(s))return false;s.diplomacy??=freshDiplomacy();return true;}
export function territoryAccess(s,race){
 if(!record(s)||!RACE_KEYS.includes(s.race)||!RACE_KEYS.includes(race)||!validDiplomacy(s))return {allowed:false,reason:'战争状态无效',code:'invalid-diplomacy'};
 const war=s.diplomacy?.wars.find(w=>w.status==='active'&&w.races.includes(s.race)&&w.races.includes(race)&&race!==s.race);
 return war?{allowed:false,code:'war',reason:'战争封锁：'+raceNames[race]+'领地暂不可进入，停战后恢复。',opposingRace:race,warId:war.id}:{allowed:true,code:null,reason:''};
}
export function nodeAccess(s,nodeId){
 const node=Object.hasOwn(INSTANCES,nodeId??'')?INSTANCES[nodeId]:null,area=node?AREAS[node.areaId]:null;
 return area?territoryAccess(s,area.race):{allowed:false,code:'unknown-node',reason:'地点尚未开放'};
}
// Engine calls on a clone, then validates/adopts it. The transition itself does
// not decide retreat, battle interruption, rewards or persistence policy.
export function applyWarStart(s,event,now){
 if(!record(s)||!RACE_KEYS.includes(s.race)||!validDiplomacy(s)||!keys(event,['id','races'])||!eventId(event.id)||!races(event.races)||!clock(now))return null;
 const pair=[...event.races].sort(),existing=s.diplomacy?.wars.find(w=>w.id===event.id);
 if(existing)return existing.races.join('|')===pair.join('|')?{ok:true,changed:false,warId:existing.id,status:existing.status}:null;
 if((s.diplomacy?.wars.length??0)>=10000||s.diplomacy?.wars.some(w=>w.status==='active'&&w.races.join('|')===pair.join('|')))return null;
 normalizeDiplomacy(s);s.diplomacy.wars.push({id:event.id,races:pair,status:'active',startedAt:now});s.diplomacy.revision++;
 return {ok:true,changed:true,warId:event.id,status:'active'};
}
export function applyWarEnd(s,id,now){
 if(!record(s)||!RACE_KEYS.includes(s.race)||!validDiplomacy(s)||!eventId(id)||!clock(now))return null;
 const war=s.diplomacy?.wars.find(w=>w.id===id);if(!war||now<war.startedAt)return null;
 if(war.status==='ended')return {ok:true,changed:false,warId:id,status:'ended'};
 war.status='ended';war.endedAt=now;s.diplomacy.revision++;return {ok:true,changed:true,warId:id,status:'ended'};
}
