import {AREAS,INSTANCES,RACE_KEYS} from './location-schema.js';
export const RANDOM_WAR_MAX_MS=60*60*1000;
const record=v=>!!v&&typeof v==='object'&&!Array.isArray(v);
const keys=(v,allowed)=>record(v)&&Object.keys(v).length===allowed.length&&allowed.every(k=>Object.hasOwn(v,k));
const clock=n=>Number.isSafeInteger(n)&&n>=0&&n<=1e15;
const eventId=id=>typeof id==='string'&&/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,127}$/.test(id)&&!['constructor','prototype','__proto__'].includes(id);
const races=v=>Array.isArray(v)&&v.length===2&&Array.from(v).every(r=>RACE_KEYS.includes(r))&&v[0]!==v[1];
const raceNames={human:'人族',dwarf:'矮人',elf:'精灵',goblin:'哥布林',ashen:'烬裔'};
// Existing valid schema-6 records are scripted wars. There was no random-war
// producer before this release; no reset or mutation of those records is needed.
export const warKind=w=>w?.kind??'story';
const historicalReplays=new WeakSet();
export function withWarReplay(s,run){historicalReplays.add(s);try{return run();}finally{historicalReplays.delete(s);}}
export const freshDiplomacy=()=>({version:1,revision:0,wars:[]});
export function validDiplomacy(s){
 if(!record(s))return false;const d=s.diplomacy;if(d===undefined)return true;if(!record(d))return false;
 if(!keys(d,['version','revision','wars',...(d.prunedTransitions===undefined?[]:['prunedTransitions'])])||d.version!==1||!Number.isSafeInteger(d.revision)||d.revision<0||!Number.isSafeInteger(d.prunedTransitions??0)||(d.prunedTransitions??0)<0||(d.prunedTransitions??0)%2!==0||!Array.isArray(d.wars)||d.wars.length>10000)return false;
 const ids=new Set(),activePairs=new Set();let transitions=d.prunedTransitions??0,activeRandom=0;
 for(const w of Array.from(d.wars)){
  const kind=warKind(w),fields=['id','races','status','startedAt',...(w?.kind===undefined?[]:['kind']),...(kind==='random'?['expiresAt']:[]),...(w?.status==='ended'?['endedAt',...(kind==='random'?['endReason']:[])]:[])];
  if(!record(w)||!['story','random'].includes(kind)||!['active','ended'].includes(w.status)||!keys(w,fields)||!eventId(w.id)||ids.has(w.id)||!races(w.races)||w.races.join('|')!==[...w.races].sort().join('|')||!clock(w.startedAt))return false;
  if(kind==='random'&&(!clock(w.expiresAt)||w.expiresAt<=w.startedAt||w.expiresAt-w.startedAt>RANDOM_WAR_MAX_MS))return false;
  ids.add(w.id);transitions++;
  if(w.status==='ended'){
   if(!clock(w.endedAt)||w.endedAt<w.startedAt)return false;transitions++;
   if(kind==='random'&&(w.endedAt>w.expiresAt||!['expired','manual','clock-rollback','story-superseded'].includes(w.endReason)))return false;
  }else{const pair=w.races.join('|');if(activePairs.has(pair))return false;activePairs.add(pair);if(kind==='random')activeRandom++;}
 }
 return d.revision===transitions&&activeRandom<=1;
}
export function normalizeDiplomacy(s){if(!validDiplomacy(s))return false;s.diplomacy??=freshDiplomacy();return true;}
export function warActiveAt(w,now){
 if(warKind(w)!=='random')return w.status==='active';
 return w.endReason!=='clock-rollback'&&now>=w.startedAt&&now<Math.min(w.expiresAt,w.status==='ended'?w.endedAt:Infinity);
}
export function territoryAccess(s,race,at){
 const now=at??Date.now();if(!record(s)||!clock(now)||!RACE_KEYS.includes(s.race)||!RACE_KEYS.includes(race)||!validDiplomacy(s))return {allowed:false,reason:'战争状态无效',code:'invalid-diplomacy'};
 const rollback=!historicalReplays.has(s)&&now<Math.max(s.worldEvents?.lastProcessedAt??0,s.lastSeen??0,s.lastHealthClock??0);
 const candidates=s.diplomacy?.wars.filter(w=>!(rollback&&warKind(w)==='random')&&warActiveAt(w,now)&&w.races.includes(s.race)&&w.races.includes(race)&&race!==s.race)??[];
 const war=candidates.find(w=>warKind(w)==='story')??candidates[0];
 return war?{allowed:false,code:'war',reason:warKind(war)==='random'?'随机战争封锁：'+raceNames[race]+'领地暂不可进入，剩余最多 '+Math.ceil((war.expiresAt-now)/60000)+' 分钟。':'剧情战争封锁：'+raceNames[race]+'领地暂不可进入，随剧情战线结束恢复。',opposingRace:race,warId:war.id,warKind:warKind(war),...(warKind(war)==='random'?{expiresAt:war.expiresAt}:{} )}:{allowed:true,code:null,reason:''};
}
export function nodeAccess(s,nodeId,now){const node=Object.hasOwn(INSTANCES,nodeId??'')?INSTANCES[nodeId]:null,area=node?AREAS[node.areaId]:null;return area?territoryAccess(s,area.race,now):{allowed:false,code:'unknown-node',reason:'地点尚未开放'};}
function endRandom(s,w,at,reason){w.status='ended';w.endedAt=Math.min(w.expiresAt,Math.max(w.startedAt,at));w.endReason=reason;s.diplomacy.revision++;}
export function settleRandomWars(s,now,{clockRollback=false}={}){
 if(!validDiplomacy(s)||!clock(now))return null;const ended=[];
 for(const w of s.diplomacy?.wars??[])if(warKind(w)==='random'&&w.status==='active'&&(clockRollback||now>=w.expiresAt)){endRandom(s,w,clockRollback?Math.max(w.startedAt,s.worldEvents?.lastProcessedAt??now):w.expiresAt,clockRollback?'clock-rollback':'expired');ended.push(w.id);}
 return {ok:true,changed:ended.length>0,ended};
}
export function pruneRandomWarHistory(s,now){
 if(!validDiplomacy(s)||!clock(now)||!s.diplomacy)return false;const before=s.diplomacy.wars.length;
 s.diplomacy.wars=s.diplomacy.wars.filter(w=>warKind(w)!=='random'||w.status!=='ended'||w.endedAt>=now-4*3600000);
 const removed=before-s.diplomacy.wars.length;if(removed)s.diplomacy.prunedTransitions=(s.diplomacy.prunedTransitions??0)+removed*2;return removed>0;
}
export function applyWarStart(s,event,now){
 const kind=event?.kind??'story',fields=['id','races',...(event?.kind===undefined?[]:['kind']),...(kind==='random'?['durationMs']:[])];
 if(!record(s)||!RACE_KEYS.includes(s.race)||!validDiplomacy(s)||!keys(event,fields)||!['story','random'].includes(kind)||!eventId(event.id)||!races(event.races)||!clock(now)||(kind==='random'&&(!Number.isSafeInteger(event.durationMs)||event.durationMs<=0||event.durationMs>RANDOM_WAR_MAX_MS||!clock(now+event.durationMs))))return null;
 const pair=[...event.races].sort(),existing=s.diplomacy?.wars.find(w=>w.id===event.id);
 if(existing)return warKind(existing)===kind&&existing.races.join('|')===pair.join('|')?{ok:true,changed:false,warId:existing.id,status:existing.status}:null;
 const draft={...s,diplomacy:structuredClone(s.diplomacy??freshDiplomacy())};settleRandomWars(draft,now);
 const same=draft.diplomacy.wars.find(w=>w.status==='active'&&w.races.join('|')===pair.join('|'));
 if(same&&kind==='story'&&warKind(same)==='random')endRandom(draft,same,now,'story-superseded');
 else if(same)return null;
 if(draft.diplomacy.wars.length>=10000||(kind==='random'&&draft.diplomacy.wars.some(w=>warKind(w)==='random'&&w.status==='active')))return null;
 draft.diplomacy.wars.push({id:event.id,races:pair,kind,status:'active',startedAt:now,...(kind==='random'?{expiresAt:now+event.durationMs}:{})});draft.diplomacy.revision++;s.diplomacy=draft.diplomacy;
 return {ok:true,changed:true,warId:event.id,status:'active'};
}
export function applyWarEnd(s,id,now){
 if(!record(s)||!RACE_KEYS.includes(s.race)||!validDiplomacy(s)||!eventId(id)||!clock(now))return null;const war=s.diplomacy?.wars.find(w=>w.id===id);if(!war||now<war.startedAt)return null;
 if(war.status==='ended')return {ok:true,changed:false,warId:id,status:'ended'};
 if(warKind(war)==='random')endRandom(s,war,now,now>=war.expiresAt?'expired':'manual');else{war.status='ended';war.endedAt=now;s.diplomacy.revision++;}return {ok:true,changed:true,warId:id,status:'ended'};
}
