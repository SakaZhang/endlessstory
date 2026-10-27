import {INFINITY_GAUNTLET_ID} from './infinity-gauntlet-content.js';
// Called once after an ORIGINAL player active skill has successfully committed
// its cooldown. Passive multicast and automatic equipment skills are excluded.
// The existing equipped-ID runtime owns persistence and clears on real removal.
export function countInfinityCast(s,e,event,{activeSkill=false}={}){
 if(!activeSkill||event?.extra||e.heroHp<=0)return null;
 const item=s.inventory?.find(i=>i.id===s.equip?.gloves&&i.legendaryId===INFINITY_GAUNTLET_ID&&i.exclusive?.id==='infinity-snap');if(!item)return null;
 s.equipmentRuntime??={version:1,byId:{}};
 if(!Object.hasOwn(s.equipmentRuntime.byId,item.id))Object.defineProperty(s.equipmentRuntime.byId,item.id,{value:{combatMs:0,attackCount:0,castCount:0},writable:true,enumerable:true,configurable:true});
 const row=s.equipmentRuntime.byId[item.id];row.castCount=(row.castCount+1)%5;
 if(row.castCount!==0)return null;
 // Bind to this cast's selected target, never seek another after killing it.
 return {itemId:item.id,targetId:e.targetId,castId:event.castId,skillId:'infinity-snap'};
}
export function infinityProcTarget(s,e,proc){
 if(!proc||e.heroHp<=0||s.equip?.gloves!==proc.itemId)return null;
 return e.enemies?.find(u=>u.id===proc.targetId&&u.hp>0)??null;
}
