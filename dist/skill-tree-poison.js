// Combat-time poison schedule. Numeric timing and expiry-edge policy have NO defaults.
// The withdrawn own-action implementation is archived outside the production directory.
const id=x=>typeof x==='string'&&x.length>0&&x.length<=250;
const stamp=x=>Number.isSafeInteger(x)&&x>=0&&x<=1e15;
export const POISON_FRACTION_PER_LAYER=.02;
export const GOBLIN_SET_POISON_SLOTS=2;
export const GOBLIN_POISON_RULE='goblin-poison-v081';
export const GOBLIN_POISON_TIMING=Object.freeze({tickIntervalMs:2000,layerDurationMs:12000,maxLayers:5,refreshPolicy:'refresh-goblin-layers',schedule:'per-layer',expiryTick:'inclusive',rule:GOBLIN_POISON_RULE});
const goblinSources=new Set(['goblin.venom_cut','goblin.spore_fan','goblin.spore_transfer','goblin.mire_seal']);
export const isGoblinPoisonSource=id=>goblinSources.has(id);
export const isGoblinPoisonTiming=c=>!!c&&typeof c==='object'&&!Array.isArray(c)&&Object.keys(GOBLIN_POISON_TIMING).every(k=>c[k]===GOBLIN_POISON_TIMING[k]);
const timingFor=(s,l)=>l.rule===GOBLIN_POISON_RULE?GOBLIN_POISON_TIMING:s.config;
export function poisonTickFraction(tick){
 if(tick.layerRules===undefined)return tick.layers<=5?tick.layers*POISON_FRACTION_PER_LAYER:null;
 if(!Array.isArray(tick.layerRules)||tick.layerRules.length!==tick.layers||!tick.layerRules.every(l=>l&&id(l.sourceId)&&(l.rule===null||l.rule===GOBLIN_POISON_RULE&&isGoblinPoisonSource(l.sourceId))))return null;
 if(tick.layerRules.some(l=>l.setBonus!==undefined&&(l.setBonus!==true||l.rule!==GOBLIN_POISON_RULE||l.sourceId!=='goblin.venom_cut'))||tick.layerRules.filter(l=>!l.setBonus).length>5||tick.layerRules.filter(l=>l.setBonus===true).length>GOBLIN_SET_POISON_SLOTS)return null;
 return tick.layerRules.reduce((sum,l)=>sum+(l.rule===GOBLIN_POISON_RULE?.03:POISON_FRACTION_PER_LAYER),0);
}
export function validPoisonTiming(c){if(isGoblinPoisonTiming(c))return true;return !!c&&typeof c==='object'&&!Array.isArray(c)&&stamp(c.tickIntervalMs)&&c.tickIntervalMs>0&&stamp(c.layerDurationMs)&&c.layerDurationMs>0&&Number.isSafeInteger(c.maxLayers)&&c.maxLayers>=1&&c.maxLayers<=5&&c.rule===undefined&&c.refreshPolicy==='earliest-expiry'&&c.schedule==='per-layer'&&['inclusive','exclusive'].includes(c.expiryTick);}
export function createSkillPoison(enemyId,config,combatClock){return id(enemyId)&&validPoisonTiming(config)&&stamp(combatClock)?{version:2,enemyId,clock:combatClock,layerSerial:0,config:structuredClone(config),layers:[]}:null;}
export function validSkillPoison(s){
 if(!s||typeof s!=='object'||Array.isArray(s)||s.version!==2||!id(s.enemyId)||!stamp(s.clock)||!Number.isSafeInteger(s.layerSerial)||s.layerSerial<0||!validPoisonTiming(s.config)||!Array.isArray(s.layers)||s.layers.filter(l=>!l?.setBonus).length>s.config.maxLayers||s.layers.filter(l=>l?.setBonus===true).length>GOBLIN_SET_POISON_SLOTS||new Set(s.layers.map(x=>x?.serial)).size!==s.layers.length)return false;
 return s.layers.every(l=>{if(!l)return false;const upgraded=l.rule===GOBLIN_POISON_RULE,c=timingFor(s,l);return (l.setBonus===undefined||l.setBonus===true&&upgraded&&l.sourceId==='goblin.venom_cut')&&(l.rule===undefined||upgraded&&isGoblinPoisonSource(l.sourceId))&&(!isGoblinPoisonTiming(s.config)||upgraded)&&Number.isSafeInteger(l.serial)&&l.serial>0&&l.serial<=s.layerSerial&&id(l.sourceId)&&stamp(l.appliedAt)&&l.appliedAt<=s.clock&&stamp(l.expiresAt)&&(upgraded?l.expiresAt>=l.appliedAt+c.layerDurationMs&&l.expiresAt<=s.clock+c.layerDurationMs:l.expiresAt===l.appliedAt+c.layerDurationMs)&&l.expiresAt>=s.clock&&stamp(l.nextTickAt)&&l.nextTickAt>l.appliedAt&&(upgraded?l.nextTickAt<=s.clock+c.tickIntervalMs:(l.nextTickAt-l.appliedAt)%c.tickIntervalMs===0)&&l.nextTickAt>s.clock;});
}
export function applySkillPoison(s,{enemyId,sourceId,combatClock,timing,setBonus=false}={}){
 if(!validSkillPoison(s)||enemyId!==s.enemyId||!id(sourceId)||combatClock!==s.clock||s.layerSerial===Number.MAX_SAFE_INTEGER)return null;
 const config=timing??s.config;if(!validPoisonTiming(config))return null;
 const goblin=isGoblinPoisonTiming(config);if(typeof setBonus!=='boolean'||setBonus&&(!goblin||sourceId!=='goblin.venom_cut'))return null;if(goblin&&!isGoblinPoisonSource(sourceId))return null;
 if(!goblin&&isGoblinPoisonTiming(s.config))return null;
 if(!stamp(s.clock+config.layerDurationMs)||!stamp(s.clock+config.tickIntervalMs))return null;
 const next=structuredClone(s);
 if(goblin){
  // Upgrade only this player's goblin poison sources. Saved legacy layers otherwise stay untouched.
  for(const l of next.layers)if(isGoblinPoisonSource(l.sourceId)){
   l.rule=GOBLIN_POISON_RULE;l.expiresAt=s.clock+config.layerDurationMs;
   // A due tick is settled before application. Refresh never pushes a pending tick later.
   l.nextTickAt=Math.min(l.nextTickAt,s.clock+config.tickIntervalMs);
  }
  // At cap, refresh existing layers without replacing serials or resetting their tick phases.
  if(next.layers.filter(l=>!!l.setBonus===setBonus).length>=(setBonus?GOBLIN_SET_POISON_SLOTS:next.config.maxLayers))return validSkillPoison(next)?next:null;
 }
 const layer={serial:++next.layerSerial,sourceId,appliedAt:s.clock,expiresAt:s.clock+config.layerDurationMs,nextTickAt:s.clock+config.tickIntervalMs,...(goblin?{rule:GOBLIN_POISON_RULE}:{}),...(setBonus?{setBonus:true}:{})};
 if(next.layers.filter(l=>!!l.setBonus===setBonus).length<(setBonus?GOBLIN_SET_POISON_SLOTS:next.config.maxLayers))next.layers.push(layer);
 else{let earliest=next.layers.findIndex(l=>!l.setBonus);for(let i=earliest+1;i<next.layers.length;i++){if(next.layers[i].setBonus)continue;const a=next.layers[i],b=next.layers[earliest];if(a.expiresAt<b.expiresAt||a.expiresAt===b.expiresAt&&a.serial<b.serial)earliest=i;}next.layers[earliest]=layer;}
 return validSkillPoison(next)?next:null;
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
  const due=next.layers.filter(l=>eligible(l,timingFor(next,l))&&l.nextTickAt<=combatClock);if(!due.length)break;
  const at=Math.min(...due.map(l=>l.nextTickAt)),layers=due.filter(l=>l.nextTickAt===at);
  ticks.push({tickId:`${next.enemyId}:poison:${at}:${layers.map(l=>l.serial).join(',')}`,at,enemyId:next.enemyId,layerSerials:layers.map(l=>l.serial),layers:layers.length,damage:targetMaxHp*layers.reduce((sum,l)=>sum+(l.rule===GOBLIN_POISON_RULE?.03:POISON_FRACTION_PER_LAYER),0),...(layers.some(l=>l.rule===GOBLIN_POISON_RULE)?{layerRules:layers.map(l=>({sourceId:l.sourceId,rule:l.rule??null,...(l.setBonus?{setBonus:true}:{})}))}:{}),damageKind:'percent-max-hp',immutablePercent:true,globalDamageMultiplierApplies:false,shieldPolicy:'absorb-shield-before-hp',element:null,canCrit:false,reaperEligible:false,activeCastCount:0,source:'skill-dot'});
  for(const l of layers)l.nextTickAt+=timingFor(next,l).tickIntervalMs;
 }
 const caughtUp=!next.layers.some(l=>eligible(l,timingFor(next,l))&&l.nextTickAt<=combatClock);
 next.clock=caughtUp?combatClock:ticks.at(-1).at;
 next.layers=next.layers.filter(l=>l.expiresAt>next.clock||l.expiresAt===next.clock&&eligible(l,timingFor(next,l))&&l.nextTickAt>next.clock);
 if(!validSkillPoison(next))return null;
 return {state:next,ticks,caughtUp,requestedCombatClock:combatClock};
}

/** Only equipped four-piece set grants bonus slots; swapping never grants layers. */
export function hasGoblinPoisonSet(s,equip=s?.equip){const ids=new Set(Object.values(equip??{}).filter(Boolean));return s?.race==='goblin'&&[...ids].filter(id=>s.inventory?.find(it=>it.id===id)?.set==='goblin_spore').length>=4;}
export function clearUnequippedSetPoison(s,equip=s?.equip){if(hasGoblinPoisonSet(s,equip))return;for(const ledger of Object.values(s?.activeEncounter?.treePoison??{})){if(validSkillPoison(ledger))ledger.layers=ledger.layers.filter(l=>!l.setBonus);}}
export function validEquippedSetPoison(s,equip=s?.equip){const enabled=hasGoblinPoisonSet(s,equip);return Object.values(s?.activeEncounter?.treePoison??{}).every(ledger=>!ledger?.layers?.some(l=>l?.setBonus)||enabled&&validSkillPoison(ledger));}
