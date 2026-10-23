/** Pure player shield ledger used by the live multi-combat adapter.
 * All clocks are elapsed COMBAT time supplied by the caller (never wall time).
 * Preserve this state across encounters/stages and JSON saves. Pausing/camping
 * means not advancing its clock. Equipment lifecycle policy belongs to callers.
 *
 * create/restore/expire return a fresh state or null for invalid input.
 * grant returns {state,applied}; absorb returns {state,absorbed,bySource,
 * unabsorbedDamage,hpDamage,hpAfter}. Invalid calls return null without mutation.
 * expiresAt=null means no expiry. Same-expiry ties use source code-unit order,
 * independent of insertion order. capacity is the source's full refreshed amount;
 * ownerItemId is optional (null for non-equipment shields); it is an identity,
 * not a slot. removePlayerShieldLayersByOwner removes only that exact owner,
 * without advancing time or modifying unrelated sources.
 * remaining is its current absorbable amount. No damage/HP increase is generated
 * by expiration. Grant requires a living player's HP, preventing postdeath shields.
 */
const copy=x=>structuredClone(x);
const amount=x=>Number.isFinite(x)&&x>=0;
const clockValue=x=>amount(x)&&x<=Number.MAX_SAFE_INTEGER;
const sourceKey=x=>typeof x==='string'&&x.length>0&&x.length<=256&&x.trim()===x;
const exactKeys=(x,keys)=>x&&typeof x==='object'&&!Array.isArray(x)&&Object.keys(x).length===keys.length&&keys.every(k=>Object.hasOwn(x,k));
export function validPlayerShieldLayers(state){
 if(!exactKeys(state,['version','clock','layers'])||state.version!==1||!clockValue(state.clock)||!Array.isArray(state.layers))return false;
 const seen=new Set();let total=0;
 for(const layer of state.layers){
  if(!exactKeys(layer,['source','capacity','remaining','expiresAt',...(Object.hasOwn(layer,'ownerItemId')?['ownerItemId']:[])])||!(layer.ownerItemId===undefined||layer.ownerItemId===null||sourceKey(layer.ownerItemId))||!sourceKey(layer.source)||seen.has(layer.source)||!amount(layer.capacity)||!amount(layer.remaining)||layer.remaining>layer.capacity||!(layer.expiresAt===null||clockValue(layer.expiresAt)))return false;
  seen.add(layer.source);total+=layer.remaining;if(!Number.isFinite(total))return false;
 }
 return true;
}
export function createPlayerShieldLayers(clock=0){return clockValue(clock)?{version:1,clock,layers:[]}:null;}
export function restorePlayerShieldLayers(value){return validPlayerShieldLayers(value)?copy(value):null;}
export function expirePlayerShieldLayers(state,clock){
 if(!validPlayerShieldLayers(state)||!clockValue(clock)||clock<state.clock)return null;
 const next=copy(state);next.clock=clock;next.layers=next.layers.filter(layer=>layer.remaining>0&&(layer.expiresAt===null||layer.expiresAt>clock));return next;
}
export function grantPlayerShieldLayer(state,{source,capacity,durationMs=null,clock,hp,ownerItemId=null}={}){
 if(!(ownerItemId===null||sourceKey(ownerItemId))||!sourceKey(source)||!amount(capacity)||!amount(hp)||!(durationMs===null||clockValue(durationMs)))return null;
 const next=expirePlayerShieldLayers(state,clock);if(!next)return null;
 const expiresAt=durationMs===null?null:clock+durationMs;if(expiresAt!==null&&!clockValue(expiresAt))return null;
 if(hp===0)return {state:next,applied:false};
 // Refresh replaces this source only, including a smaller replacement capacity.
 next.layers=next.layers.filter(layer=>layer.source!==source);
 const applied=capacity>0&&(expiresAt===null||expiresAt>clock);
 if(applied)next.layers.push({source,capacity,remaining:capacity,expiresAt,ownerItemId});
 return validPlayerShieldLayers(next)?{state:next,applied}:null;
}
const absorptionOrder=(a,b)=>{
 if(a.expiresAt===null&&b.expiresAt!==null)return 1;
 if(a.expiresAt!==null&&b.expiresAt===null)return -1;
 const time=(a.expiresAt??0)-(b.expiresAt??0);
 return time|| (a.source<b.source?-1:a.source>b.source?1:0);
};
export function absorbPlayerShieldDamage(state,{damage,hp,clock}={}){
 if(!amount(damage)||!amount(hp))return null;
 const next=expirePlayerShieldLayers(state,clock);if(!next)return null;
 let left=damage,absorbed=0;const bySource=[];
 // A dead player cannot be revived or keep spending shield resources on hits.
 if(hp>0)for(const layer of [...next.layers].sort(absorptionOrder)){
  if(left===0)break;const used=Math.min(layer.remaining,left);if(!used)continue;
  layer.remaining-=used;left-=used;absorbed+=used;bySource.push({source:layer.source,amount:used});
 }
 next.layers=next.layers.filter(layer=>layer.remaining>0);
 const hpDamage=Math.min(hp,left),hpAfter=hp-hpDamage;
 return {state:next,absorbed,bySource,unabsorbedDamage:left,hpDamage,hpAfter};
}
export function playerShieldTotal(state,clock=state?.clock){
 const active=expirePlayerShieldLayers(state,clock);return active?active.layers.reduce((sum,layer)=>sum+layer.remaining,0):null;
}

/** Remove one unequipped item's layers only. No combat clock advancement. */
export function removePlayerShieldLayersByOwner(state,ownerItemId){
 if(!validPlayerShieldLayers(state)||!sourceKey(ownerItemId))return null;
 const next=copy(state);next.layers=next.layers.filter(layer=>layer.ownerItemId!==ownerItemId);return next;
}
