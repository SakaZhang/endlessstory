// Fixed regional budgets, not player scaling. Evaluated only for newly created actors.
// Existing save actors retain their stored hp/atk/armor and parameterSetId.
export const MONSTER_BALANCE_ID='regional-threat-v071';
// Ordinary Q0 equipment at each area's midpoint, no talents/skills/enhancement.
// A1 is deliberately a naked Lv1 on-ramp; A1 elite uses an early acquired loadout.
const REFERENCES=Object.freeze([
 {hp:134,armor:6,atk:17},{hp:800,armor:90,atk:130},
 {hp:1080,armor:120,atk:180},{hp:1400,armor:155,atk:240},
 {hp:1760,armor:200,atk:305},{hp:2160,armor:260,atk:380},
 {hp:2680,armor:320,atk:465},{hp:3300,armor:400,atk:565},
 {hp:4050,armor:480,atk:680},{hp:4900,armor:600,atk:820}
].map(Object.freeze));
export const MONSTER_BALANCE_REFERENCES=REFERENCES;
const ELITE_XP=[55,66,79,92,106,119,132,145,158,172];
const ELITE_GOLD=[10,12,14,18,18,23,23,27,27,32];
const quantized=ms=>Math.ceil(ms/1100)*1100;
// A transparent static cadence budget. It does not execute combat or consume RNG.
// Mirrors authored first-use/cooldown/cast occupation; actual host is regression-tested.
function coefficientRate(def,p){
 const horizon=66000,skills=def.skills.map(s=>({...s,...p.skillOverrides?.[s.id]}));
 const ready=Object.fromEntries(skills.map(s=>[s.id,s.firstAtMs])),uses={},dots=new Map();let nextBasic=quantized(p.basicIntervalMs),cast=null,total=0;
 const effectValue=fx=>fx.type==='damage'?fx.coefficient:0;
 const consume=(skill,now)=>{uses[skill.id]=(uses[skill.id]??0)+1;nextBasic=now+quantized(p.basicIntervalMs);for(const fx of skill.effects){total+=effectValue(fx);if(fx.type==='dot')dots.set(skill.id,{coefficient:fx.coefficientPerSecond,end:now+fx.seconds*1000,next:now+1000});}};
 for(let now=1100;now<=horizon;now+=1100){
  for(const dot of dots.values())while(dot.next<=now&&dot.next<=dot.end){total+=dot.coefficient;dot.next+=1000;}
  if(cast){if(now>=cast.until){consume(cast.skill,now);cast=null;}continue;}
  const available=s=>(uses[s.id]??0)<(s.maxCasts??Infinity)&&(s.trigger==='hp_below_50_once'?now>=horizon/2:(ready[s.id]??0)<=now);
  const skill=skills.find(s=>s.trigger==='hp_below_50_once'&&available(s))??skills.find(available);
  if(skill){ready[skill.id]=now+skill.cooldownMs;if(skill.castMs>0)cast={skill,until:now+quantized(skill.castMs)};else consume(skill,now);}
  else if(now>=nextBasic){total++;nextBasic=now+quantized(p.basicIntervalMs);}
 }
 let rate=total/(horizon/1000);
 if(def.trait?.type==='followers'){const shares=def.trait.shares;rate=rate*shares[0]+shares.slice(1).reduce((n,x)=>n+x,0)/(quantized(p.basicIntervalMs)/1000);}
 if(def.trait?.type==='reflect')rate+=def.trait.chance*def.trait.coefficient/(def.trait.cooldownMs/1000);
 return Math.max(.15,rate);
}
export function balanceMonsterParameters(def,parameters){
 if(!def||!parameters)return null;
 const p={...parameters},area=def.area,rank=def.rank,base=REFERENCES[area-1];if(!base)return p;
 const ref=area===1&&rank!=='normal'?{hp:330,armor:28,atk:43}:base;
 const variant=rank==='normal'?Number(def.id.split('.').at(-1))-1:0;
 const shape=rank==='normal'?[1,.85,1.15][variant]??1:1;
 const armor=area===1?(rank==='normal'?[1,0,3][variant]??1:12):Math.round(8+area*3+(rank==='elite'?8:rank==='boss'?14:variant*2));
 const seconds=rank==='normal'?(area===1?5:12+area*.5):rank==='elite'?18+area*.5:35+area;
 let hp=ref.atk*.9*1.025/1.1/(1+armor/100)*seconds*shape;
 const opening=def.trait?.type==='openingShield'?def.trait:def.trait?.openingShield;
 if(opening)hp/=1+opening.fraction*.7;
 if(def.trait?.type==='lifesteal')hp/=1+def.trait.encounterCap*.5;
 const dps=rank==='normal'?(area===1?.9:ref.hp*.002):rank==='elite'?ref.hp*.009:ref.hp*.012;
 // Physical and elemental raw powers buy the same reference post-mitigation DPS.
 // Authored coefficients, DOT and follower shares consume that common threat budget.
 const unit=dps/coefficientRate(def,p);
 const rewardXp=rank==='normal'?(area===1?4:12+4*area):rank==='elite'?ELITE_XP[area-1]:156+52*area;
 const rewardGold=rank==='normal'?(area===1?1:Math.ceil(1.5+area*.5)):rank==='elite'?ELITE_GOLD[area-1]:Math.round(15+area*9);
 return {...p,rewardXp,rewardGold,hp:Math.max(1,Math.round(hp)),armor,atk:Number((unit*(1+ref.armor/100)).toFixed(3)),elementalPower:Number(unit.toFixed(3)),parameterSetId:MONSTER_BALANCE_ID};
}
