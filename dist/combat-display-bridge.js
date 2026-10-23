// Ephemeral presentation observer. No save fields, RNG, clocks or gameplay callbacks.
const observers=new WeakMap(),sequences=new WeakMap();
export function setCombatDisplayObserver(encounter,sink){
 if(!encounter||typeof encounter!=='object'||typeof sink!=='function')return ()=>{};
 const previous=observers.get(encounter),binding={sink,sequence:previous?.sequence??0};observers.set(encounter,binding);
 return ()=>{if(observers.get(encounter)===binding){if(previous){previous.sequence=binding.sequence;observers.set(encounter,previous);}else observers.delete(encounter);}};
}
export function emitCombatDisplay(e,data){
 const binding=observers.get(e);if(!binding)return false;
 try{const sequence=(sequences.get(e)??0)+1;sequences.set(e,sequence);const castId=data.castId??`${e.id}:display:${e.round??0}`,record={eventId:`${e.id}:display-event:${e.round??0}:${sequence}`,battleId:e.id,castId,sourceId:'hero',targetId:'hero',kind:'hit',hitId:null,skillId:null,element:null,crit:false,outcome:'hit',segmentIndex:0,hpDelta:0,shieldDelta:0,combatAt:e.treeCombatClock??(e.round??0)*1100,...Object.fromEntries(Object.entries(data).filter(([,value])=>value!==undefined))};binding.sink(Object.freeze(record));return true;}catch{return false;}
}
export function captureCombatDisplay(e,fn){const events=[],detach=setCombatDisplayObserver(e,event=>events.push(event));try{return {result:fn(),events};}finally{detach();}}
export function combatDisplayHealthSnapshot(e){return {hp:e.heroHp,shield:e.playerShieldLayers?e.playerShieldLayers.layers.filter(l=>!['shelter','barrier'].includes(l.source)).reduce((n,l)=>n+l.remaining,0)+(e.shield??e.playerShieldLayers.layers.find(l=>l.source==='shelter')?.remaining??0)+(e.barrierShield??e.playerShieldLayers.layers.find(l=>l.source==='barrier')?.remaining??0):(e.shield??0)+(e.barrierShield??0)+(e.legendaryShield??0)};}
export function emitCombatDisplayRecovery(e,before,data={}){const after=combatDisplayHealthSnapshot(e);if(after.hp>before.hp)emitCombatDisplay(e,{kind:'heal',hpDelta:after.hp-before.hp,...data});if(after.shield>before.shield)emitCombatDisplay(e,{kind:'shield',shieldDelta:after.shield-before.shield,...data});}
