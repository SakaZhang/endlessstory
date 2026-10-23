// Combat-time poison schedule. Numeric timing and expiry-edge policy have NO defaults.
// The withdrawn own-action implementation is archived outside the production directory.
const id=x=>typeof x==='string'&&x.length>0&&x.length<=250;
const stamp=x=>Number.isSafeInteger(x)&&x>=0&&x<=1e15;
export const POISON_FRACTION_PER_LAYER=.02;
export function validPoisonTiming(c){return !!c&&typeof c==='object'&&!Array.isArray(c)&&stamp(c.tickIntervalMs)&&c.tickIntervalMs>0&&stamp(c.layerDurationMs)&&c.layerDurationMs>0&&Number.isSafeInteger(c.maxLayers)&&c.maxLayers>=1&&c.maxLayers<=5&&c.refreshPolicy==='earliest-expiry'&&c.schedule==='per-layer'&&['inclusive','exclusive'].includes(c.expiryTick);}
export function createSkillPoison(enemyId,config,combatClock){return id(enemyId)&&validPoisonTiming(config)&&stamp(combatClock)?{version:2,enemyId,clock:combatClock,layerSerial:0,config:structuredClone(config),layers:[]}:null;}
export function validSkillPoison(s){
 if(!s||typeof s!=='object'||Array.isArray(s)||s.version!==2||!id(s.enemyId)||!stamp(s.clock)||!Number.isSafeInteger(s.layerSerial)||s.layerSerial<0||!validPoisonTiming(s.config)||!Array.isArray(s.layers)||s.layers.length>s.config.maxLayers||new Set(s.layers.map(x=>x?.serial)).size!==s.layers.length)return false;
 return s.layers.every(l=>l&&Number.isSafeInteger(l.serial)&&l.serial>0&&l.serial<=s.layerSerial&&id(l.sourceId)&&stamp(l.appliedAt)&&l.appliedAt<=s.clock&&stamp(l.expiresAt)&&l.expiresAt===l.appliedAt+s.config.layerDurationMs&&l.expiresAt>=s.clock&&stamp(l.nextTickAt)&&l.nextTickAt>l.appliedAt&&(l.nextTickAt-l.appliedAt)%s.config.tickIntervalMs===0&&l.nextTickAt>s.clock);
}
export function applySkillPoison(s,{enemyId,sourceId,combatClock}={}){
 if(!validSkillPoison(s)||enemyId!==s.enemyId||!id(sourceId)||combatClock!==s.clock||s.layerSerial===Number.MAX_SAFE_INTEGER||!stamp(s.clock+s.config.layerDurationMs)||!stamp(s.clock+s.config.tickIntervalMs))return null;
 const next=structuredClone(s),layer={serial:++next.layerSerial,sourceId,appliedAt:s.clock,expiresAt:s.clock+s.config.layerDurationMs,nextTickAt:s.clock+s.config.tickIntervalMs};
 if(next.layers.length<next.config.maxLayers)next.layers.push(layer);
 else{let earliest=0;for(let i=1;i<next.layers.length;i++){const a=next.layers[i],b=next.layers[earliest];if(a.expiresAt<b.expiresAt||a.expiresAt===b.expiresAt&&a.serial<b.serial)earliest=i;}next.layers[earliest]=layer;}
 return next;
}
const eligible=(l,c)=>c.expiryTick==='inclusive'?l.nextTickAt<=l.expiresAt:l.nextTickAt<l.expiresAt;
/** Pass the SAME persisted actual-combat clock used by other combat-time equipment.
 * Pause/travel/rest do not move it. A 1.1s outer step may return several due timestamp groups;
 * the host must resolve each in time order, stop at death, and atomically save the resulting ledger.
 * This pure function emits percentage damage descriptors, not HP/shield mutations or RNG calls.
 */
export function advanceSkillPoison(s,{enemyId,combatClock,targetMaxHp,maxTickGroups=1000}={}){
 if(!validSkillPoison(s)||enemyId!==s.enemyId||!stamp(combatClock)||combatClock<s.clock||!Number.isFinite(targetMaxHp)||targetMaxHp<=0||targetMaxHp>1e12||!Number.isSafeInteger(maxTickGroups)||maxTickGroups<1||maxTickGroups>10000)return null;
 const next=structuredClone(s),ticks=[];
 while(ticks.length<maxTickGroups){
  const due=next.layers.filter(l=>eligible(l,next.config)&&l.nextTickAt<=combatClock);if(!due.length)break;
  const at=Math.min(...due.map(l=>l.nextTickAt)),layers=due.filter(l=>l.nextTickAt===at);
  ticks.push({tickId:`${next.enemyId}:poison:${at}:${layers.map(l=>l.serial).join(',')}`,at,enemyId:next.enemyId,layerSerials:layers.map(l=>l.serial),layers:layers.length,damage:targetMaxHp*POISON_FRACTION_PER_LAYER*layers.length,damageKind:'percent-max-hp',immutablePercent:true,globalDamageMultiplierApplies:false,shieldPolicy:'absorb-shield-before-hp',element:null,canCrit:false,reaperEligible:false,activeCastCount:0,source:'skill-dot'});
  for(const l of layers)l.nextTickAt+=next.config.tickIntervalMs;
 }
 const caughtUp=!next.layers.some(l=>eligible(l,next.config)&&l.nextTickAt<=combatClock);
 next.clock=caughtUp?combatClock:ticks.at(-1).at;
 next.layers=next.layers.filter(l=>l.expiresAt>next.clock||l.expiresAt===next.clock&&eligible(l,next.config)&&l.nextTickAt>next.clock);
 if(!validSkillPoison(next))return null;
 return {state:next,ticks,caughtUp,requestedCombatClock:combatClock};
}
