import {safeRestPreparation} from './noncombat-policy.js';
import {hasCanonicalEpilogue} from './otherworld-gate.js';
export {hasCanonicalEpilogue} from './otherworld-gate.js';
import {storySafeToInteract} from './story-event-controller.js';
import {normalizeOtherworldState} from './otherworld-state.js';
import {validSave} from './engine.js';
import {commitGameTransaction,SAVE_KEY} from './storage.js';
// Protected entitlement, never an inventory item: cannot be sold, filtered or fused.
export function reconcileOtherworldStone(s){
 if(!hasCanonicalEpilogue(s)||s.otherworld?.stoneGranted===true)return false;
 if(!normalizeOtherworldState(s))return false;s.otherworld.stoneGranted=true;
 return {stoneGranted:true};
}
export function useOtherworldStone(s){
 if(!validSave(s)||!hasCanonicalEpilogue(s)||!(storySafeToInteract(s)||safeRestPreparation(s)&&!s.story?.activeScene&&!s.developmentEquipmentSandbox)||s.otherworld?.stoneGranted!==true||s.otherworld.stoneUsed)return false;
 s.otherworld.stoneUsed=true;
 return {stoneUsed:true};
}
export function transactOtherworldStone(storage,s,{now=Date.now()}={}){
 const failure=reason=>({ok:false,game:s,value:null,reason});
 if(!Number.isFinite(now)||now<0||now>1e15)return failure('invalid-clock');
 if(!validSave(s)||s.developmentEquipmentSandbox)return failure('invalid-state');
 try{const saved=JSON.parse(storage.getItem(SAVE_KEY));if(!validSave(saved))return failure('invalid-saved-state');if(JSON.stringify(saved)!==JSON.stringify(s))return failure('stale-state');}catch{return failure('storage-read');}
 return commitGameTransaction(storage,s,next=>{const result=useOtherworldStone(next);return result&&validSave(next)?result:false;},{now});
}
