// Adapter only: the caller owns combat formulas, activation gating and transaction clones.
import {createSkillEffectState,validSkillEffectState,applySkillEffect,advanceSkillEffectState,skillEffectValue} from './skill-tree-effects.js';
import {createPlayerShieldLayers,validPlayerShieldLayers,grantPlayerShieldLayer,expirePlayerShieldLayers} from './player-shield-layers.js';
const negative=new Set(['armorDown','fireResistDown','attackDown','hitDown','dot']);
const copy=x=>structuredClone(x);
export function createTreeEffectHost(s,e,{stats,combatClock=0,resolveDot,applyStun,interrupt,shieldBonus=0,tickIntervalMs,receivedHeal,negativeDuration}={}){
 const st=()=>typeof stats==='function'?stats(s,e):stats;
 if(!s||!e||!Array.isArray(e.enemies)||!Number.isFinite(combatClock)||combatClock<0||!Number.isFinite(st()?.hp)||st().hp<=0||!Number.isFinite(e.heroHp)||e.heroHp<0||!Number.isFinite(shieldBonus)||shieldBonus<0)return null;
 const initial=e.treeEffects??createSkillEffectState(e.enemies.map(u=>u.id),combatClock);
 if(!validSkillEffectState(initial)||initial.clock!==combatClock||e.playerShieldLayers&&!validPlayerShieldLayers(e.playerShieldLayers))return null;
 e.treeEffects=copy(initial);
 const alive=id=>id==='self'?e.heroHp>0:e.enemies.some(u=>u.id===id&&u.hp>0);
 const syncHp=()=>{s.heroHp=e.heroHp;};
 const heal=amount=>{if(e.heroHp<=0)return false;const before=e.heroHp;const gain=typeof receivedHeal==='function'?receivedHeal(amount):amount;if(!Number.isFinite(gain)||gain<0)return false;e.heroHp=Math.min(st().hp,e.heroHp+gain);syncHp();return e.heroHp-before;};
 const target=id=>id==='self'?e.treeEffects.hero:e.treeEffects.enemies[id];
 const eligibleDebuffIds=()=>[
 ...(e.heroBurn>0?['legacy:heroBurn']:[]),...(e.weakness>0?['legacy:weakness']:[]),
 ...(e.typedDots??[]).map(d=>'typed:'+d.key),
 ...e.treeEffects.hero.sources.filter(x=>negative.has(x.type)&&x.endAt>e.treeEffects.clock).map(x=>'tree:'+x.source.kind+':'+x.source.id+':'+x.sourceId+':'+x.type)
 ];
 const cleanse=(ids,count)=>{
  if(!Array.isArray(ids)||!Number.isInteger(count)||count<1||count>2)return 0;
  const available=new Set(eligibleDebuffIds());let removed=0;
  for(const id of new Set(ids)){if(removed>=count)break;if(!available.has(id))continue;
   if(id==='legacy:heroBurn'){e.heroBurn=0;e.heroBurnPower=0;}
   else if(id==='legacy:weakness')e.weakness=0;
   else if(id.startsWith('typed:'))e.typedDots=e.typedDots.filter(d=>'typed:'+d.key!==id);
   else e.treeEffects.hero.sources=e.treeEffects.hero.sources.filter(x=>'tree:'+x.source.kind+':'+x.source.id+':'+x.sourceId+':'+x.type!==id);
   removed++;
  }return removed;
 };
 const callbacks={heal:(_id,ef)=>heal(ef.amount),cleanse:(_id,ef)=>cleanse(ef.eligibleIds,ef.count),stun:(id,ef)=>typeof applyStun==='function'?applyStun(id,ef):false,interrupt:(id,ef)=>typeof interrupt==='function'?interrupt(id,ef):false,
 shield:(id,source)=>{
  if(id!=='self'||source.source.kind!=='skill')return false;
  const layers=e.playerShieldLayers??createPlayerShieldLayers(e.treeEffects.clock);
  const grant=grantPlayerShieldLayer(layers,{source:'skill:'+source.sourceId,capacity:source.amount+shieldBonus,durationMs:source.endAt-e.treeEffects.clock,clock:e.treeEffects.clock,hp:e.heroHp});
  if(!grant?.applied)return false;e.playerShieldLayers=grant.state;return true;
 }};
 const applyEffect=(id,effect)=>{
  if(!alive(id))return false;
  let ef=effect;if(id==='self'&&negative.has(ef.type)&&typeof negativeDuration==='function'&&Number.isFinite(ef.durationMs))ef={...ef,durationMs:negativeDuration(ef.durationMs)};
  if(['dot','healOverTime'].includes(ef.type)&&ef.tickIntervalMs===undefined)ef={...ef,tickIntervalMs:typeof tickIntervalMs==='function'?tickIntervalMs(ef):tickIntervalMs};
  // cleanse mutates the same ledger; bypass generic clone adoption which would overwrite it.
  if(ef.type==='cleanse')return cleanse(ef.eligibleIds,ef.count);
  const result=applySkillEffect(e.treeEffects,id,ef,{callbacks});if(!result)return false;e.treeEffects=result.state;return true;
 };
 const advance=clock=>{
  if(typeof resolveDot!=='function'&&[e.treeEffects.hero,...Object.values(e.treeEffects.enemies)].some(t=>t.sources.some(x=>x.type==='dot'&&x.nextTickAt<=Math.min(clock,x.endAt))))return null;
  const result=advanceSkillEffectState(e.treeEffects,clock,{onTick(id,source,at,tickId){
   if(!alive(id))return false;
   if(source.type==='healOverTime'){if(id==='self')heal(source.amount);}
   else {if(typeof resolveDot!=='function')throw Error('resolveDot callback required');resolveDot({targetId:id,source,clock:at,tickId,s,e});syncHp();}
   return e.heroHp>0&&alive(id);
  },onExpire(){}});
  if(!result)return null;e.treeEffects=result.state;
  if(e.playerShieldLayers){const layers=expirePlayerShieldLayers(e.playerShieldLayers,result.state.clock);if(layers)e.playerShieldLayers=layers;}
  return result;
 };
 const has=(id,type)=>!!target(id)?.sources.some(x=>(x.type===type||x.status===type||x.sourceId===type)&&x.endAt>e.treeEffects.clock);
 return {applyEffect,advance,cleanse,eligibleDebuffIds,interrupt:(id,ef)=>callbacks.interrupt(id,ef),get:(id,type)=>skillEffectValue(e.treeEffects,id,type,{hasStatus:has}),has,
 removeDeadTargets(){for(const id of Object.keys(e.treeEffects.enemies))if(!alive(id))delete e.treeEffects.enemies[id];},
 activeBuffIds:()=>[...new Set(e.treeEffects.hero.sources.filter(x=>!negative.has(x.type)&&x.endAt>e.treeEffects.clock&&(x.type!=='shield'||e.playerShieldLayers?.layers.some(l=>l.source==='skill:'+x.sourceId&&l.remaining>0&&(l.expiresAt===null||l.expiresAt>e.playerShieldLayers.clock)))).map(x=>x.sourceId))],
 consumeStatus(id,status){const t=target(id);if(!t)return false;const old=t.sources.length;t.sources=t.sources.filter(x=>x.status!==status);return old!==t.sources.length;}
 };
}
