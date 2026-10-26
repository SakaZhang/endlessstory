import {RACE_KEYS} from './location-schema.js';
import {validDiplomacy,applyWarStart,settleRandomWars,warKind,warActiveAt} from './war-diplomacy.js';
// Initial authorized balance, not immutable story canon. Independent of luck/loot RNG.
export const RANDOM_WAR_RULES=Object.freeze({checkIntervalMs:600000,chance:.01,minDurationMinutes:20,maxDurationMinutes:60,maxOfflineChecks:24,maxOfflineMs:4*3600000});
const clock=n=>Number.isSafeInteger(n)&&n>=0&&n<=1e15;
export function validWorldEventState(s){const w=s?.worldEvents;if(w===undefined)return true;return !!w&&typeof w==='object'&&!Array.isArray(w)&&Object.keys(w).length===5&&w.version===1&&clock(w.lastProcessedAt)&&clock(w.nextWarCheckAt)&&w.nextWarCheckAt>w.lastProcessedAt&&Number.isInteger(w.rngState)&&w.rngState>0&&w.rngState<=0xffffffff&&Number.isSafeInteger(w.serial)&&w.serial>=0;}
function initialState(s,now){let seed=2166136261;for(const c of `${s.race}|${s.inventory?.[0]?.id??''}|${s.lastSeen??now}`)seed=Math.imul(seed^c.charCodeAt(0),16777619)>>>0;const at=Math.min(now,s.lastSeen??now,1e15-RANDOM_WAR_RULES.checkIntervalMs);return {version:1,lastProcessedAt:at,nextWarCheckAt:at+RANDOM_WAR_RULES.checkIntervalMs,rngState:seed||1,serial:0};}
function random(w){let x=w.rngState;x^=x<<13;x^=x>>>17;x^=x<<5;w.rngState=x>>>0;return w.rngState/4294967296;}
export function worldEventsDue(s,now=Date.now()){
 if(!clock(now)||!validWorldEventState(s))return false;
 if(!s.worldEvents)return true;
 const active=(s.diplomacy?.wars??[]).filter(w=>warKind(w)==='random'&&w.status==='active');
 if(now<Math.max(s.worldEvents.lastProcessedAt,s.lastSeen??0,s.lastHealthClock??0))return active.length>0;
 return now>=s.worldEvents.nextWarCheckAt||active.some(w=>now>=w.expiresAt);
}
// Builds timestamped history before combat replay. Engine prunes only after the
// relevant offline window has consumed it; no new events outside the four-hour cap.
export function advanceRandomWorldEvents(s,now=Date.now()){
 if(!clock(now)||now>1e15-RANDOM_WAR_RULES.checkIntervalMs||!validWorldEventState(s)||!validDiplomacy(s)||s.developmentEquipmentSandbox)return null;
 const prior=s.worldEvents,reference=Math.max(prior?.lastProcessedAt??0,s.lastSeen??0,s.lastHealthClock??0);
 if(now<reference){s.worldEvents??=initialState(s,reference);const result=settleRandomWars(s,now,{clockRollback:true});return {ok:true,changed:!prior||result.changed,declared:[],ended:result.ended,checks:0,clockRollback:true};}
 s.worldEvents??=initialState(s,now);const w=s.worldEvents,r=RANDOM_WAR_RULES,from=Math.max(w.lastProcessedAt,s.lastSeen??0,s.lastHealthClock??0),horizon=Math.min(now,from+r.maxOfflineMs),declared=[],ended=[];let checks=0;
 // Skip unobserved time before the actual retained save/reward window in O(1).
 if(w.nextWarCheckAt<from)w.nextWarCheckAt+=Math.ceil((from-w.nextWarCheckAt)/r.checkIntervalMs)*r.checkIntervalMs;
 while(w.nextWarCheckAt<=horizon&&checks<r.maxOfflineChecks){
  const at=w.nextWarCheckAt;w.nextWarCheckAt+=r.checkIntervalMs;checks++;ended.push(...settleRandomWars(s,at).ended);
  const wars=s.diplomacy?.wars??[],activeRandom=wars.some(x=>warKind(x)==='random'&&warActiveAt(x,at)),justEnded=wars.some(x=>warKind(x)==='random'&&x.status==='ended'&&x.endedAt===at);
  if(activeRandom||justEnded)continue;
  const pairs=RACE_KEYS.flatMap((a,i)=>RACE_KEYS.slice(i+1).map(b=>[a,b])).filter(pair=>!wars.some(x=>warActiveAt(x,at)&&pair.every(race=>x.races.includes(race))));
  if(!pairs.length||w.serial>=Number.MAX_SAFE_INTEGER||random(w)>=r.chance)continue;
  const pair=pairs[Math.floor(random(w)*pairs.length)],durationMs=(r.minDurationMinutes+Math.floor(random(w)*(r.maxDurationMinutes-r.minDurationMinutes+1)))*60000,id='random.war.'+at+'.'+(++w.serial);
  const out=applyWarStart(s,{id,races:pair,kind:'random',durationMs},at);if(out?.changed)declared.push({id,races:pair,startedAt:at,expiresAt:at+durationMs});
 }
 ended.push(...settleRandomWars(s,now).ended);w.lastProcessedAt=now;
 if(w.nextWarCheckAt<=now)w.nextWarCheckAt=now+r.checkIntervalMs;
 return {ok:true,changed:true,declared,ended:[...new Set(ended)],checks,clockRollback:false,skippedMs:Math.max(0,now-horizon)};
}
