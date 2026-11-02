import {validSave,applyForgeFavor,itemTotals} from './engine.js';
import {divineStoneBalance,normalizeDivineStones} from './divine-stone-state.js';
import {commitGameTransaction,SAVE_KEY} from './storage.js';
export {divineStoneBalance} from './divine-stone-state.js';
export function quoteDivineStone(s,itemId){
 const fail=reason=>({ok:false,reason,itemId});
 if(!validSave(s)||s.developmentEquipmentSandbox)return fail('invalid-state');
 const it=s.inventory.find(it=>it.id===itemId);if(!it)return fail('missing-item');
 if(it.divine)return fail('already-divine');
 if(s.running||s.activeEncounter&&!s.activeEncounter.rewarded||s.dungeonRun||s.story?.activeScene)return fail('busy');
 if(s.pendingReforge?.itemId===itemId)return fail('pending-reforge');
 if(divineStoneBalance(s)<1)return fail('no-stone');
 const next=structuredClone(it);if(!applyForgeFavor(next))return fail('already-divine');
 return {ok:true,itemId,cost:1,before:itemTotals(it),after:itemTotals(next)};
}
export function applyDivineStone(s,itemId){
 const quote=quoteDivineStone(s,itemId);if(!quote.ok)return false;
 const it=s.inventory.find(it=>it.id===itemId),d=normalizeDivineStones(s);
 if(!d||!applyForgeFavor(it))return false;d.spent++;
 return validSave(s)?{itemId,spent:1,remaining:divineStoneBalance(s)}:false;
}
export function transactDivineStone(storage,s,itemId,{now=Date.now()}={}){
 try{const raw=storage.getItem(SAVE_KEY);if(raw===null||JSON.stringify(JSON.parse(raw))!==JSON.stringify(s))return {ok:false,game:s,value:null,reason:'stale-state'};}catch{return {ok:false,game:s,value:null,reason:'storage-read'};}
 return commitGameTransaction(storage,s,next=>applyDivineStone(next,itemId),{now});
}
