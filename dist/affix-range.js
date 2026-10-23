import {affixRange} from './equipment-budget.js';
const plain=x=>{if(!x||typeof x!=='object'||Array.isArray(x))return false;const proto=Object.getPrototypeOf(x);return proto===null||Object.getPrototypeOf(proto)===null;};
export function makeAffixSourceRange(def,quality){if(!Number.isInteger(quality)||quality<0||quality>3)return null;try{return {model:'quality-v1',quality,...affixRange(def,quality)};}catch{return null;}}
export function affixOwnRange(a,defs){
 if(typeof a?.stat!=='string'||!defs||!Object.hasOwn(defs,a.stat))return null;const def=defs[a.stat];if(!def)return null;
 if(!Object.hasOwn(a,'sourceRange'))return {min:def.min,max:def.max};
 const r=a.sourceRange;if(!plain(r)||Object.keys(r).length!==4||!['model','quality','min','max'].every(k=>Object.hasOwn(r,k))||r.model!=='quality-v1')return null;
 const expected=makeAffixSourceRange(def,r.quality);if(!expected||r.min!==expected.min||r.max!==expected.max)return null;
 return {min:r.min,max:r.max};
}
export function validAffixSource(a,defs,{legacyWide=false}={}){
 if(!plain(a)||typeof a.stat!=='string'||!Object.hasOwn(defs,a.stat)||!Number.isSafeInteger(a.value))return false;
 const range=affixOwnRange(a,defs);if(!range)return false;
 if(Object.hasOwn(a,'sourceRange'))return Object.keys(a).length===3&&a.value>=range.min&&a.value<=range.max;
 return legacyWide?a.value>=0&&a.value<=50:a.value>=range.min&&a.value<=range.max;
}
