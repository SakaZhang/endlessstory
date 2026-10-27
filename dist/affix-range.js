import {affixRange} from './equipment-budget.js';
import {LEVEL_AFFIX_MODEL,levelAffixRange} from './affix-level-budget.js';
const plain=x=>{if(!x||typeof x!=='object'||Array.isArray(x))return false;const proto=Object.getPrototypeOf(x);return proto===null||Object.getPrototypeOf(proto)===null;};
// The two-argument form deliberately remains the historical range constructor.
// quality is SOURCE quality (not recipient rarity); sourceLevel is immutable.
export function makeAffixSourceRange(def,quality,source=null){
 if(!Number.isInteger(quality)||quality<0||quality>4)return null;
 try{return source===null?{model:'quality-v1',quality,...affixRange(def,quality)}:{model:LEVEL_AFFIX_MODEL,quality,sourceLevel:source.sourceLevel,...levelAffixRange(def,source.stat,source.sourceLevel,quality)};}catch{return null;}
}
export function affixOwnRange(a,defs){
 if(typeof a?.stat!=='string'||!defs||!Object.hasOwn(defs,a.stat))return null;const def=defs[a.stat];if(!def)return null;
 if(!Object.hasOwn(a,'sourceRange'))return {min:def.min,max:def.max};
 const r=a.sourceRange;if(!plain(r))return null;
 const keys=r.model==='quality-v1'?['model','quality','min','max']:r.model===LEVEL_AFFIX_MODEL?['model','quality','sourceLevel','min','max']:null;
 if(!keys||Object.keys(r).length!==keys.length||!keys.every(k=>Object.hasOwn(r,k)))return null;
 const expected=makeAffixSourceRange(def,r.quality,r.model===LEVEL_AFFIX_MODEL?{stat:a.stat,sourceLevel:r.sourceLevel}:null);
 if(!expected||r.min!==expected.min||r.max!==expected.max)return null;
 return {min:r.min,max:r.max};
}
export function validAffixSource(a,defs,{legacyWide=false}={}){
 if(!plain(a)||typeof a.stat!=='string'||!Object.hasOwn(defs,a.stat)||!Number.isSafeInteger(a.value))return false;
 const range=affixOwnRange(a,defs);if(!range)return false;
 if(Object.hasOwn(a,'sourceRange'))return Object.keys(a).length===3&&a.value>=range.min&&a.value<=range.max;
 return legacyWide?a.value>=0&&a.value<=50:a.value>=range.min&&a.value<=range.max;
}
export function affixSourceLabel(a){const r=a?.sourceRange;return r?.model===LEVEL_AFFIX_MODEL?`来源装备 Lv.${r.sourceLevel} · ${r.quality===4?'传说':`品质${r.quality}`} · 数值固定`:'旧版来源 · 保留原始区间';}
