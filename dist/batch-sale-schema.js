// Canonical full JSON item snapshot; property ordering is not a gameplay change.
export function equipmentFingerprint(item){
 const seen=new Set();
 const canonical=value=>{
  if(value===null||typeof value==='string'||typeof value==='boolean')return value;
  if(typeof value==='number'){if(!Number.isFinite(value))throw new Error('nonfinite');return value;}
  if(typeof value!=='object'||seen.has(value))throw new Error('nonjson');
  seen.add(value);let out;
  if(Array.isArray(value))out=value.map(v=>v===undefined?null:canonical(v));
  else{if(Object.prototype.toString.call(value)!=='[object Object]')throw new Error('nonplain');out=Object.fromEntries(Object.keys(value).filter(key=>value[key]!==undefined).sort().map(key=>[key,canonical(value[key])]));}
  seen.delete(value);return out;
 };
 try{return JSON.stringify(canonical(item));}catch{return null;}
}
export function validBatchSelection(slot,qualities,slots){
 return slots.includes(slot)&&Array.isArray(qualities)&&qualities.length<=5&&new Set(qualities).size===qualities.length&&Array.from(qualities).every(q=>Number.isInteger(q)&&q>=0&&q<=4);
}
export function validBatchQuote(quote,slots){
 if(!quote||typeof quote!=='object'||Array.isArray(quote)||Object.keys(quote).length!==6||quote.version!==1||!validBatchSelection(quote.slot,quote.qualities,slots)||!quote.qualities.every((q,i)=>i===0||q>quote.qualities[i-1])||!Array.isArray(quote.entries)||quote.entries.length>10000||quote.count!==quote.entries.length||!Number.isSafeInteger(quote.total)||quote.total<0)return false;
 if(new Set(quote.entries.map(e=>e?.id)).size!==quote.entries.length)return false;
 return Array.from(quote.entries).every(e=>e&&typeof e==='object'&&!Array.isArray(e)&&Object.keys(e).length===3&&typeof e.id==='string'&&e.id.length>0&&typeof e.fingerprint==='string'&&e.fingerprint.length>0&&Number.isSafeInteger(e.value)&&e.value>=0)&&quote.entries.reduce((n,e)=>n+e.value,0)===quote.total;
}
