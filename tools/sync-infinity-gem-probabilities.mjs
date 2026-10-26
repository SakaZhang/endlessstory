// Four expansion races build pools from material-loot-profile.js at import time.
// Dwarf retains a serialized catalogue. Update only existing populated gem rates;
// never regenerate associations, non-gem channels, quality weights, or roll code.
import {readFile,writeFile} from 'node:fs/promises';
import {materialChannelProbability} from '../dist/material-loot-profile.js';
const path=new URL('../dist/dwarf-material-catalog.js',import.meta.url);
const source=await readFile(path,'utf8');
const prefix='export const DWARF_MATERIAL_SOURCE_POOLS=freeze(Object.fromEntries(';
const start=source.indexOf(prefix)+prefix.length,end=source.indexOf('.map(x=>[x.monsterId+"|"+x.nodeId,x])))',start);
if(start<prefix.length||end<start)throw Error('Dwarf catalogue serialization changed; review generator');
const json=source.slice(start,end),pools=JSON.parse(json),gemChannels=[];
for(const pool of pools)for(const channel of pool.channels)if(channel.channel==='gem'){
 const match=/^dwarf\.a(\d{2})\.(field|dungeon|boss)$/.exec(pool.nodeId);
 if(!match)throw Error('Invalid gem source '+pool.nodeId);
 gemChannels.push(channel.entries.length?materialChannelProbability('gem',Number(match[1]),match[2]):0);
}
let index=0;
const updated=json.replace(/("channel":"gem","hitProbability":)[^,]+/g,(_,label)=>label+JSON.stringify(gemChannels[index++]));
if(index!==gemChannels.length)throw Error('Gem channel serialization changed; review generator');
const next=source.slice(0,start)+updated+source.slice(end);
if(process.argv.includes('--check')){
 if(next!==source)throw Error('Stale Dwarf gem rates; run npm run sync:infinity-gems');
}else if(next!==source)await writeFile(path,next);
console.log(`PASS Dwarf serialized Infinity gem rates ${process.argv.includes('--check')?'checked':'synced'}: ${index}; all other source bytes preserved.`);
