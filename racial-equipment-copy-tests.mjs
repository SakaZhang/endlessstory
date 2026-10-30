import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {materials as elfMaterials} from './dist/races/elf/content.js';
import {materials as goblinMaterials} from './dist/races/goblin/materials.js';
import {materials as ashenMaterials} from './dist/races/ashen/world.js';
import {RETURN_RING_EVENTS} from './dist/return-ring-content.js';

const baseline=JSON.parse(fs.readFileSync(new URL('./fixtures/racial-equipment-mechanics-copy-baseline.json',import.meta.url)));
function mechanics(o){
 if(Array.isArray(o))return o.map(mechanics);
 if(o&&typeof o==='object'&&['human-oathblade','human-banner-armor'].includes(o.id)&&o.bossPool){assert.deepEqual(o.bossPool,['human.a03.boss','human.a06.boss','human.a09.boss','human.a10.boss'],'exact authorized human A10 source append');o={...o,bossPool:o.bossPool.slice(0,3)};}
 if(o&&typeof o==='object')return Object.fromEntries(Object.entries(o).filter(([k])=>!['description','exclusiveDescription'].includes(k)).map(([k,v])=>[k,mechanics(v)]));
 return o;
}
for(const id of ['human-oathblade','human-banner-armor'])assert.throws(()=>mechanics({id,bossPool:['human.a03.boss','human.a06.boss','human.a09.boss','human.a10.boss','elf.a10.boss']}));
const forbidden=/不限制其他种族穿戴|剧情占位|政策待定|具体配方后续确定|获取配方前不展示|主线获取尚未开放|王冠领旅人常用的/;
let inspected=0;
for(const race of ['human','elf','goblin','ashen']){
 const module=await import(`./dist/races/${race}/equipment.js`);
 const serializable=JSON.parse(JSON.stringify(module));
 assert.equal(crypto.createHash('sha256').update(JSON.stringify(mechanics(serializable))).digest('hex'),baseline[race],`${race}: IDs, stats, restrictions, artwork and effects unchanged`);
 const equipment=module.HUMAN_EQUIPMENT??module.equipment;
 const scatter=equipment.filter(x=>x.kind==='scatter');
 assert.equal(new Set(scatter.map(x=>x.description)).size,scatter.length,`${race}: each scatter item has its own description`);
 for(const item of equipment){assert(item.description?.trim(),item.id);assert(!forbidden.test(item.description),item.id);inspected++;}
 assert(!forbidden.test(JSON.stringify(serializable)),`${race}: no authoring instructions in equipment catalog`);
}
for(const [race,materials] of Object.entries({elf:elfMaterials,goblin:goblinMaterials,ashen:ashenMaterials})){
 assert(!forbidden.test(JSON.stringify(materials)),`${race}: no placeholder policies or authoring notes`);
 const event=RETURN_RING_EVENTS.find(x=>x.race===race);
 const material=Object.values(materials).find(x=>x.id===event.rewards[0].key.split('|')[0]);
 assert(material?.storyOnly);assert.equal(event.repeatable,false);
 if(race!=='goblin')assert((material.sourceNote??material.sourcePolicy).includes(event.npcName));
}
assert.deepEqual(JSON.parse(fs.readFileSync(new URL('./dist/races/goblin/materials.json',import.meta.url))),goblinMaterials,'goblin JSON and runtime source stay in sync');
console.log(`PASS racial equipment copy: ${inspected} items, unique scatter descriptions, unchanged mechanics/art, material policies and JSON parity.`);
