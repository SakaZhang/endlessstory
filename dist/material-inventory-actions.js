import {parseMaterialKey,normalizeMaterials,validSave} from './engine.js';
// Ordinary explicit discard applies to every material equally. Story materials
// receive no extra warning, protection, replacement or completion-ledger reset.
export function discardMaterial(s,key,quantity=1){
 if(!validSave(s)||parseMaterialKey(key)?.key!==key||!Number.isSafeInteger(quantity)||quantity<1||!normalizeMaterials(s)||(s.materialStacks[key]??0)<quantity)return false;
 s.materialStacks[key]-=quantity;return true;
}
