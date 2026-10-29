import fs from 'node:fs';
// Preserve historical identity snapshots while accepting only the reviewed copy
// amendments. Arbitrary future text changes still fail the historical snapshots.
const amendments=JSON.parse(fs.readFileSync(new URL('./fixtures/racial-equipment-copy-amendments.json',import.meta.url)));
export function beforeEquipmentCopy(value){
 if(typeof value==='string')return amendments[value]??value;
 if(Array.isArray(value))return value.map(beforeEquipmentCopy);
 if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,beforeEquipmentCopy(v)]));
 return value;
}
