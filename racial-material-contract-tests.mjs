import assert from 'node:assert/strict';
import {EXPANSION_PACKS} from './dist/race-packs.js';
import {materialChannelProbability,materialQualityWeights,buildMaterialPools} from './dist/material-loot-profile.js';
import {validWorldMaterialPool,rollWorldMaterials,WORLD_MATERIALS} from './dist/world-materials.js';
let pools=0,entries=0;const summary=[];
for(const pack of EXPANSION_PACKS){
 const counts={race:pack.id,pools:0,channels:0,entries:0};
 for(const pool of Object.values(pack.materialPools)){
  assert(validWorldMaterialPool(pool),pool.monsterId+' '+pool.nodeId);pools++;counts.pools++;
  const area=Number(pool.nodeId.split('.')[1].slice(1)),kind=pool.nodeId.split('.').at(-1),monster=Object.values(pack.monsters).find(m=>m.id===pool.monsterId);
  assert.deepEqual(pool.channels.map(c=>c.channel),['regular','recovery','special','gem']);
  for(const c of pool.channels){assert.equal(c.quantity,1);assert.equal(c.hitProbability,c.entries.length?materialChannelProbability(c.channel,area,kind,monster.rank):0);counts.channels++;
   for(const e of c.entries){entries++;counts.entries++;const m=pack.materials[e.materialId];assert(m.sources.includes(pool.nodeId));assert(!m.storyOnly);const gem=m.kind==='宝石'&&m.uniqueHeld||m.id.includes('infinity_gem');
    if(c.channel==='regular')assert(m.category!=='特殊'&&!gem,'ordinary pool cannot hide a rare special');
    if(c.channel==='special')assert(m.category==='特殊'&&!gem);
    if(c.channel==='gem')assert(gem);
    if(c.channel==='recovery')assert(m.functionalTags.includes('recoveryBase'));
    const q=c.channel==='gem'||m.qualityRange?.length===1&&m.qualityRange[0]===3?[0,0,0,1]:materialQualityWeights(area,kind);assert.deepEqual(e.qualityWeights,q);
   }
  }
 }
 // Every area has genuine native recovery access; not every creature is forced
 // to drop a herb, and material source whitelists remain authoritative.
 for(let area=1;area<=10;area++)for(const kind of ['field','dungeon'])assert(Object.values(pack.materialPools).some(p=>p.nodeId===`${pack.id}.a${String(area).padStart(2,'0')}.${kind}`&&p.channels.some(c=>c.channel==='recovery'&&c.entries.length)),pack.id+' missing recovery '+area+' '+kind);
 summary.push(counts);
}
// Exercise the actual world roller, not only generated declarative data.
let seed=98123;const random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/2**32),rollQuality=w=>{let r=random();for(let i=0;i<w.length;i++){r-=w[i];if(r<0)return i;}return 3;};let settlements=0,drops=0;
for(const pack of EXPANSION_PACKS)for(const kind of ['field','dungeon','boss']){
 const pool=Object.values(pack.materialPools).find(p=>p.nodeId.endsWith('.'+kind)&&p.channels.every(c=>c.entries.length)),seen={regular:0,recovery:0,special:0,gem:0};assert(pool);
 for(let i=0;i<10000;i++){const r=rollWorldMaterials({race:pack.id},{instanceId:pool.nodeId},{definitionId:pool.monsterId},{random,rollQuality,owned:()=>false,receive:(_,row)=>{assert(WORLD_MATERIALS[row.materialId].sources.includes(row.nodeId));assert.equal(row.quantity,1);assert(row.quality>=0&&row.quality<=3);return true;},luck:0});assert(r.ok);assert(new Set(r.drops.map(d=>d.channel)).size===r.drops.length,'one item per independent channel');for(const d of r.drops){seen[d.channel]++;drops++;}settlements++;}
 for(const c of pool.channels){const mean=10000*c.hitProbability,sigma=Math.sqrt(10000*c.hitProbability*(1-c.hitProbability));assert(Math.abs(seen[c.channel]-mean)<=6*sigma+3,`${pack.id} ${kind} ${c.channel} observed ${seen[c.channel]} expected ${mean}`);}
}
assert.throws(()=>buildMaterialPools({materials:{},monsters:[],associations:{x:{monsterId:'x',nodeId:'x',channels:[]}}}));
console.log('PASS shared material contract',JSON.stringify({pools,entries,settlements,drops,summary}));
