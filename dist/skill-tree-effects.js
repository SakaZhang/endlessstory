// New-tree-only typed effects. Clock is explicit elapsed combat time, never Date.now().
const clone=x=>structuredClone(x),plain=x=>!!x&&typeof x==='object'&&!Array.isArray(x);
const safeId=x=>typeof x==='string'&&x.length>0&&x.length<=200&&!['__proto__','constructor','prototype','self'].includes(x);
const time=x=>Number.isFinite(x)&&x>=0&&x<=1e15,num=x=>Number.isFinite(x)&&x>=0&&x<=1e12;
const types=['armorDown','elementResistDown','fireResistDown','attackDown','hitDown','attackUp','critUp','setSkillCrit','penetrationUp','defenseUp','dodgeUp','lifestealUp','dot','healOverTime','shield'];
const sourceKey=s=>s.source.kind+'|'+s.source.id+'|'+s.sourceId+'|'+s.type+'|'+(s.status??'')+'|'+(s.type==='elementResistDown'?s.damageType??'':'');
function normalizeSourceDescriptor(source){
 if(!plain(source)||Object.keys(source).length!==2||!Object.hasOwn(source,'kind'))return null;
 if(source.kind==='skill'&&Object.hasOwn(source,'skillId')&&safeId(source.skillId))return {kind:'skill',id:source.skillId};
 if(['skill','equipment'].includes(source.kind)&&Object.hasOwn(source,'id')&&safeId(source.id))return {kind:source.kind,id:source.id};
 return null;
}
function validSource(s){
 if(!plain(s)||!safeId(s.sourceId)||!types.includes(s.type)||!num(s.amount)||!time(s.endAt)||!plain(s.source)||!['skill','equipment'].includes(s.source.kind)||!safeId(s.source.id)||Object.keys(s.source).length!==2)return false;
 if(s.type==='setSkillCrit'&&(s.amount!==.03||s.source.kind!=='skill'||s.source.id!==s.sourceId||!['human.precise_cut','human.flash_arc','human.opening'].includes(s.sourceId)))return false;
 const allowed=['sourceId','type','amount','endAt','source','status','damageType','nextTickAt','tickIntervalMs','requiresStatus','counterEligible'];if(Object.keys(s).some(k=>!allowed.includes(k)))return false;
 if(s.requiresStatus!==undefined&&!['burn','bleed'].includes(s.requiresStatus))return false;
 if(s.counterEligible!==undefined&&typeof s.counterEligible!=='boolean')return false;
 if(s.type==='dot'&&( !['burn','bleed'].includes(s.status)||!['physical','earth','water','fire','wind','light','dark'].includes(s.damageType)))return false;
 if(['dot','healOverTime'].includes(s.type))return time(s.nextTickAt)&&num(s.tickIntervalMs)&&s.tickIntervalMs>0;
 return s.nextTickAt===undefined&&s.tickIntervalMs===undefined&&s.status===undefined&&(s.type==='elementResistDown'?['earth','water','fire','wind','light','dark'].includes(s.damageType):s.damageType===undefined);
}
const validTarget=t=>plain(t)&&Object.keys(t).length===1&&Array.isArray(t.sources)&&t.sources.length<=200&&Array.from(t.sources).every(validSource)&&new Set(t.sources.map(sourceKey)).size===t.sources.length;
export function createSkillEffectState(enemyIds=[],clock=0){if(!Array.isArray(enemyIds)||enemyIds.length>100||new Set(enemyIds).size!==enemyIds.length||!Array.from(enemyIds).every(safeId)||!time(clock))return null;return {version:1,clock,hero:{sources:[]},enemies:Object.fromEntries(enemyIds.map(id=>[id,{sources:[]}]))};}
export function validSkillEffectState(s){return plain(s)&&Object.keys(s).length===4&&s.version===1&&time(s.clock)&&validTarget(s.hero)&&plain(s.enemies)&&Object.keys(s.enemies).length<=100&&Object.entries(s.enemies).every(([id,t])=>safeId(id)&&validTarget(t));}
const target=(s,id)=>id==='self'?s.hero:Object.hasOwn(s.enemies,id)?s.enemies[id]:null;
export function applySkillEffect(state,targetId,effect,{clock=state?.clock,callbacks={}}={}){
 if(!validSkillEffectState(state)||!time(clock)||clock!==state.clock||!plain(effect)||!target(state,targetId))return null;
 // Only the consumer's explicit skillId alias is accepted; persisted sources remain canonical.
 if(effect.source!==undefined){const source=normalizeSourceDescriptor(effect.source);if(!source)return null;effect={...effect,source};}
 // The host advances periodic effects first. Application cannot silently skip pending ticks.
 if(['heal','cleanse','stun','interrupt'].includes(effect.type)){
  if(typeof callbacks[effect.type]!=='function')return null;
  if(effect.type==='heal'&&!num(effect.amount))return null;
  if(effect.type==='cleanse'&&(!Number.isInteger(effect.count)||effect.count<1||effect.count>2||!Array.isArray(effect.eligibleIds)||effect.eligibleIds.length>200||!Array.from(effect.eligibleIds).every(safeId)))return null;
  if(effect.type==='stun'&&(!num(effect.durationMs)||effect.durationMs<=0))return null;
  const result=callbacks[effect.type](targetId,clone(effect));return result===false?null:{state:clone(state),result};
 }
 if(!types.includes(effect.type)||effect.status==='poison'||!num(effect.amount)||!num(effect.durationMs)||effect.durationMs<=0||clock+effect.durationMs>1e15)return null;
 const source={sourceId:effect.sourceId,type:effect.type,amount:effect.amount,endAt:clock+effect.durationMs,source:clone(effect.source??{kind:'skill',id:effect.sourceId})};
 for(const key of ['status','damageType','requiresStatus','counterEligible'])if(effect[key]!==undefined)source[key]=effect[key];
 if(['dot','healOverTime'].includes(effect.type)){source.tickIntervalMs=effect.tickIntervalMs;source.nextTickAt=clock+effect.tickIntervalMs;}
 if(!validSource(source))return null;
 const next=clone(state),dest=target(next,targetId),key=sourceKey(source),existing=dest.sources.findIndex(x=>sourceKey(x)===key);if(existing<0&&dest.sources.length>=200)return null;
 // On the first new set window, retire only identifiable legacy +6 rating payloads.
 // Their original skill bonus and expiry survive; the old cast gains no new chance.
 if(source.type==='setSkillCrit'&&targetId==='self')for(const old of dest.sources){
  const legacy={'human.precise_cut':[14,16],'human.flash_arc':[18],'human.opening':[22]};
  if(old.type==='critUp'&&old.source.kind==='skill'&&old.source.id===old.sourceId&&legacy[old.sourceId]?.includes(old.amount))old.amount-=6;
 }
 if(effect.type==='shield'&&(typeof callbacks.shield!=='function'||callbacks.shield(targetId,clone(source))===false))return null;
 if(existing>=0)dest.sources[existing]=source;else dest.sources.push(source);
 return {state:next,result:clone(source)};
}
export function advanceSkillEffectState(state,clock,{onTick,onExpire}={}){
 if(!validSkillEffectState(state)||!time(clock)||clock<state.clock)return null;
 const next=clone(state),events=[];
 for(const [id,t] of [['self',next.hero],...Object.entries(next.enemies)])for(const source of t.sources){
  const key=sourceKey(source);
  if(source.nextTickAt!==undefined){const until=Math.min(clock,source.endAt);const count=source.nextTickAt<=until?Math.floor((until-source.nextTickAt)/source.tickIntervalMs)+1:0;if(count>20000)return null;for(let i=0;i<count;i++){const at=source.nextTickAt+i*source.tickIntervalMs;events.push({kind:'tick',targetId:id,clock:at,key,tickId:JSON.stringify([id,key,at]),source:clone(source)});}}
  if(source.endAt<=clock)events.push({kind:'expire',targetId:id,clock:source.endAt,key,source:clone(source)});
 }
 if(events.length>100000||events.some(e=>e.kind==='tick'&&typeof onTick!=='function'))return null;
 const compare=(a,b)=>a<b?-1:a>b?1:0;
 events.sort((a,b)=>a.clock-b.clock||compare(a.kind==='tick'?0:1,b.kind==='tick'?0:1)||compare(a.targetId,b.targetId)||compare(a.key,b.key));
 const processed=[];
 // false means this tick WAS applied. Persist its cursor, but never consume later events.
 for(const event of events){
  const dest=target(next,event.targetId),source=dest.sources.find(s=>sourceKey(s)===event.key);
  next.clock=event.clock;processed.push(event);
  if(event.kind==='tick'){
   source.nextTickAt=event.clock+source.tickIntervalMs;
   if(onTick(event.targetId,clone(event.source),event.clock,event.tickId)===false)return {state:next,events:processed,stopped:true,caughtUp:false};
  }else{
   dest.sources=dest.sources.filter(s=>sourceKey(s)!==event.key);
   onExpire?.(event.targetId,clone(event.source),event.clock);
  }
 }
 next.clock=clock;return {state:next,events:processed,stopped:false,caughtUp:true};
}
export function skillEffectValue(state,targetId,type,{hasStatus}={}){if(!validSkillEffectState(state))return null;const t=target(state,targetId);if(!t)return null;return Math.max(0,...t.sources.filter(s=>s.type===type&&s.endAt>state.clock&&(!s.requiresStatus||hasStatus?.(targetId,s.requiresStatus)===true)).map(s=>s.amount));}
export function removeSkillEffectTarget(state,id){if(!validSkillEffectState(state)||!safeId(id))return null;const next=clone(state);delete next.enemies[id];return next;}
export function carryHeroSkillEffects(state){return validSkillEffectState(state)?{version:1,clock:state.clock,hero:clone(state.hero)}:null;}
export function restoreHeroSkillEffects(carry,enemyIds=[]){if(!plain(carry)||Object.keys(carry).length!==3||carry.version!==1||!time(carry.clock)||!validTarget(carry.hero))return null;const next=createSkillEffectState(enemyIds,carry.clock);if(!next)return null;next.hero=clone(carry.hero);return next;}
