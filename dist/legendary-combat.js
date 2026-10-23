/** Equipment-ID counters and proc scheduling. Damage is resolved by the combat
 * adapter, never duplicated here. Only executed combat deltas advance time. */
export const LEGENDARY_COMBAT_CONFIG=Object.freeze({hammerEvery:5,hammerCoefficient:1.4,hammerPenetration:.3,reactorEveryMs:12000,reactorCoefficient:.75,reactorShieldFraction:.08,reactorShieldMs:3000});
export function equippedCombatLegends(s){const ids=new Set(Object.values(s.equip??{}).filter(Boolean));return (s.inventory??[]).filter(it=>ids.has(it.id)&&['first-forge-oathhammer','everburning-reactor'].includes(it.legendaryId));}
export function advanceLegendaryCombat(s,{damageAction=false,combatDeltaMs=0,alive=true,hasTargets=true,config=LEGENDARY_COMBAT_CONFIG,resolve}={}){
 if(!alive)return [];
 if(!Number.isFinite(combatDeltaMs)||combatDeltaMs<0||combatDeltaMs>14400000||!Number.isSafeInteger(config.hammerEvery)||config.hammerEvery<1||!Number.isFinite(config.reactorEveryMs)||config.reactorEveryMs<=0||typeof resolve!=='function')throw Error('Invalid legendary combat adapter');
 const results=[];
 for(const item of equippedCombatLegends(s)){
  s.equipmentRuntime??={version:1,byId:{}};if(!Object.hasOwn(s.equipmentRuntime.byId,item.id))Object.defineProperty(s.equipmentRuntime.byId,item.id,{value:{combatMs:0,attackCount:0,castCount:0},writable:true,enumerable:true,configurable:true});const r=s.equipmentRuntime.byId[item.id];
  if(item.legendaryId==='first-forge-oathhammer'&&damageAction){r.attackCount++;if(r.attackCount>=config.hammerEvery){r.attackCount%=config.hammerEvery;if(hasTargets)results.push(resolve({kind:'hammer',itemId:item.id,coefficient:config.hammerCoefficient,penetration:config.hammerPenetration}));}}
  if(item.legendaryId==='everburning-reactor'&&combatDeltaMs>0&&hasTargets){r.combatMs+=combatDeltaMs;while(r.combatMs>=config.reactorEveryMs){r.combatMs-=config.reactorEveryMs;const result=resolve({kind:'reactor',itemId:item.id,coefficient:config.reactorCoefficient,shieldFraction:config.reactorShieldFraction,shieldMs:config.reactorShieldMs});results.push(result);if(result?.stop)break;}}
 }
 return results;
}
