// Approved passive directions; numeric policy is explicitly injected, not a live default.
import {playerShieldTotal} from './player-shield-layers.js';
export const TREE_PASSIVE_IDS=Object.freeze(['axe_fervor','hammer_penetration','fire_affinity','shield_reserve','mountain_vitality','forged_resilience']);
const plain=x=>!!x&&typeof x==='object'&&!Array.isArray(x),num=x=>Number.isFinite(x)&&x>=0;
const fields={axe_fervor:['damageMultiplier','armorMultiplier'],hammer_penetration:['physicalPenetrationPerBaseAtk'],fire_affinity:['firePowerRating','fireResistanceRating'],shield_reserve:['armorMultiplier'],mountain_vitality:['maxHpMultiplier','receivedHealingMultiplier'],forged_resilience:['negativeDurationMultiplier']};
const freeze=x=>{if(x&&typeof x==='object'){Object.values(x).forEach(freeze);Object.freeze(x);}return x;};
export function resolveTreePassives({passive,unlocked,weaponType,config}={}){
 if(!Array.isArray(passive)||passive.length!==2||!Array.isArray(unlocked)||!Array.from(unlocked).every(x=>typeof x==='string')||new Set(unlocked).size!==unlocked.length||typeof weaponType!=='string'||!plain(config))return null;
 const selected=Array.from(passive).filter(x=>x!==null);if(selected.some(id=>!TREE_PASSIVE_IDS.includes(id)||!unlocked.includes(id))||new Set(selected).size!==selected.length)return null;
 for(const id of selected){const c=config[id];if(!plain(c)||fields[id].some(key=>!Object.hasOwn(c,key)||!num(c[key])))return null;
  if(id==='axe_fervor'&&c.armorMultiplier>1||id==='forged_resilience'&&(c.negativeDurationMultiplier>1||c.negativeDurationMultiplier<=0))return null;
 }
 return freeze({version:1,selected:[...selected],weaponType,config:Object.fromEntries(selected.map(id=>[id,structuredClone(config[id])]))});
}
const active=(c,id)=>c?.selected?.includes(id)?c.config[id]:null;
export function derivePassiveStats(base,context,{shieldLayers=null,combatClock=0,currentHp}={}){
 if(!plain(base)||!context||![base.hp,base.armor,base.atk,base.penetration??0,currentHp].every(num)||base.hp<=0||!num(combatClock))return null;
 const stats=structuredClone(base),axe=active(context,'axe_fervor'),hammer=active(context,'hammer_penetration'),fire=active(context,'fire_affinity'),shield=active(context,'shield_reserve'),vitality=active(context,'mountain_vitality');
 if(axe&&context.weaponType==='axe')stats.armor*=axe.armorMultiplier;
 if(hammer&&context.weaponType==='hammer')stats.penetration=(stats.penetration??0)+base.atk*hammer.physicalPenetrationPerBaseAtk;
 if(fire){if(!plain(stats.elementResistance)||!num(stats.elementResistance.fire)||!plain(stats.elementAttack)||!num(stats.elementAttack.fire))return null;stats.elementAttack.fire+=fire.firePowerRating;stats.elementResistance.fire+=fire.fireResistanceRating;stats.elementResist=.5*stats.elementResistance.fire/(100+stats.elementResistance.fire);}
 let shieldTotal=0;if(shieldLayers!==null){shieldTotal=playerShieldTotal(shieldLayers,combatClock);if(shieldTotal===null)return null;}
 if(shield&&shieldTotal>0)stats.armor*=shield.armorMultiplier;
 if(vitality)stats.hp*=vitality.maxHpMultiplier;
 if(![stats.hp,stats.armor,stats.penetration??0].every(num))return null;
 return {stats,currentHp:Math.min(currentHp,stats.hp),hasShield:shieldTotal>0};
}
export function passiveDamageMultiplier(context,{damageType,source}={}){
 if(!context||!plain(source))return null;
 // Percentage poison is neither a seventh element nor eligible for global bonuses.
 if(source.kind==='poison'||source.kind==='poison-percent-max-hp'||damageType==='poison')return 1;
 if(!['physical','earth','water','fire','wind','light','dark'].includes(damageType))return null;
 let result=1;const axe=active(context,'axe_fervor');
 if(axe&&context.weaponType==='axe')result*=axe.damageMultiplier;
 return Number.isFinite(result)?result:null;
}
export function passiveReceivedHeal(context,{amount,currentHp,maxHp}={}){
 if(!context||![amount,currentHp,maxHp].every(num)||maxHp<=0)return null;
 if(currentHp===0)return 0;const c=active(context,'mountain_vitality');return Math.min(Math.max(0,maxHp-currentHp),amount*(c?.receivedHealingMultiplier??1));
}
export function passiveNegativeDuration(context,durationMs){
 if(!context||!num(durationMs))return null;if(durationMs===0)return 0;
 const c=active(context,'forged_resilience');return c?Math.max(Number.MIN_VALUE,durationMs*c.negativeDurationMultiplier):durationMs;
}
