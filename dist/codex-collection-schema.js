export function validCollectionLedger(s,sets,legends){
 const ledger=s.codexCollection;if(ledger===undefined)return true;
 if(!ledger||typeof ledger!=='object'||Array.isArray(ledger)||Object.keys(ledger).length!==3||ledger.version!==1||!ledger.sets||typeof ledger.sets!=='object'||Array.isArray(ledger.sets)||Object.keys(ledger.sets).length!==sets.length||!Array.isArray(ledger.legendaries)||new Set(ledger.legendaries).size!==ledger.legendaries.length)return false;
 return sets.every(def=>Array.isArray(ledger.sets[def.id])&&new Set(ledger.sets[def.id]).size===ledger.sets[def.id].length&&ledger.sets[def.id].every(part=>def.parts.includes(part)))&&ledger.legendaries.every(id=>legends.some(def=>def.id===id&&def.implemented));
}
export function addOwnedCollection(ledger,it,sets,legends){
 const set=sets.find(def=>def.id===it.set);let eligible=false;
 if(set&&set.parts.includes(it.slot)){eligible=true;if(!ledger.sets[set.id].includes(it.slot))ledger.sets[set.id].push(it.slot);ledger.sets[set.id].sort((a,b)=>set.parts.indexOf(a)-set.parts.indexOf(b));}
 if(legends.some(def=>def.id===it.legendaryId&&def.implemented)){eligible=true;if(!ledger.legendaries.includes(it.legendaryId))ledger.legendaries.push(it.legendaryId);}
 return eligible;
}
export function normalizeCollectionLedger(s,sets,legends,validItem){
 if(!validCollectionLedger(s,sets,legends)||!Array.isArray(s.inventory))return false;
 s.codexCollection??={version:1,sets:Object.fromEntries(sets.map(def=>[def.id,[]])),legendaries:[]};
 for(const it of s.inventory)if(validItem(it))addOwnedCollection(s.codexCollection,it,sets,legends);
 return true;
}
