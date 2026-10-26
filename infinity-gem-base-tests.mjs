import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {EXPANSION_PACKS} from './dist/race-packs.js';
import {DWARF_MATERIAL_SOURCE_POOLS} from './dist/dwarf-material-catalog.js';
import {WORLD_MATERIALS,rollWorldMaterials,validWorldMaterialPool} from './dist/world-materials.js';
import {materialChannelProbability,buildMaterialPools} from './dist/material-loot-profile.js';
import {lootOccurrenceProbability,legendaryPoolProbability} from './dist/luck-policy.js';

const baseline=JSON.parse(readFileSync(new URL('./fixtures/infinity-gem-base-before-v065.json',import.meta.url)));
const races=[['dwarf',DWARF_MATERIAL_SOURCE_POOLS],...EXPANSION_PACKS.map(p=>[p.id,p.materialPools])];
const sha=v=>createHash('sha256').update(JSON.stringify(v)).digest('hex');
const coordinates=p=>{const [,a,kind]=/\.a(\d{2})\.(field|dungeon|boss)$/.exec(p.nodeId);return {area:Number(a),kind};};
const expected=(a,k)=>k==='boss'?.02+.03*(a-1)/9:k==='field'?.0002*a:.001*a;
const context=p=>[{instanceId:p.nodeId,contentVersion:'dwarf-m2-v1'},{definitionId:p.monsterId,sourceInstanceId:p.nodeId,origin:'initial'}];
const gemOf=p=>p.channels.find(c=>c.channel==='gem');
const options={rollQuality:()=>0,owned:(s,id)=>!!s[id],receive:(s,row)=>{s[row.materialId]=(s[row.materialId]??0)+1;return true;},luck:0};
let total=0;const summary=[];
assert.equal(sha(WORLD_MATERIALS),baseline.materialsSha256,'all original material identities, source whitelists, quality ranges and uniqueness unchanged');
for(const [race,pools] of races){
 const old=baseline.races[race],rest=structuredClone(pools),counts={race,field:0,dungeon:0,boss:0};
 assert.equal(Object.keys(pools).length,old.gemChannels.length);
 for(const p of Object.values(rest))for(const c of p.channels)if(c.channel==='gem'&&c.entries.length)delete c.hitProbability;
 assert.equal(sha(rest),old.unchangedPoolDataSha256,race+' exact old JSON unchanged except populated gem hitProbability');
 for(const oldGem of old.gemChannels){
  const p=pools[oldGem.monsterId+'|'+oldGem.nodeId],gem=gemOf(p),{area,kind}=coordinates(p);counts[kind]++;total++;
  assert(validWorldMaterialPool(p));assert.equal(gem.hitProbability,expected(area,kind));assert(gem.hitProbability>oldGem.oldHitProbability);
  assert.equal(gem.quantity,1);assert.equal(gem.entries.length,1);assert.equal(gem.entries[0].weight,1);assert.deepEqual(gem.entries[0].qualityWeights,[0,0,0,1]);
  assert.equal(WORLD_MATERIALS[gem.entries[0].materialId].uniqueHeld,true);
  // Suppress other channels and test the actual roller just below/at the threshold.
  for(const luck of [0,50])for(const hit of [true,false]){
   const probability=lootOccurrenceProbability(gem.hitProbability,luck),draws=p.channels.filter(c=>c.entries.length&&c.channel!=='gem').map(()=>.999999);
   draws.push(hit?probability-Number.EPSILON:probability);if(hit)draws.push(0);
   const s={},result=rollWorldMaterials(s,...context(p),{...options,luck,random:()=>{assert(draws.length,'unexpected extra RNG '+p.nodeId);return draws.shift();},rollQuality:()=>assert.fail('gem must not roll quality')});
   assert(result.ok);assert.equal(result.drops.length,hit?1:0);assert.equal(draws.length,0);if(hit)assert.equal(result.drops[0].quality,3);
  }
  // Every eligible channel remains independent, never a shared gem/non-gem lottery.
  const forced=rollWorldMaterials({},...context(p),{...options,random:()=>0});
  assert.deepEqual(forced.drops.map(d=>d.channel),p.channels.filter(c=>c.entries.length).map(c=>c.channel));
  for(const exclusion of [{origin:'summoned'},{independentRewards:false}]){
   const [e,u]=context(p),result=rollWorldMaterials({},e,{...u,...exclusion},{...options,random:()=>assert.fail('ineligible unit consumed RNG')});assert(!result.ok);assert.deepEqual(result.drops,[]);
  }
 }
 // Sequential judgments: first monster misses, second may win; later monsters
 // cannot duplicate a held racial gem. Consuming it restores eligibility.
 const [first,second]=Object.values(pools).filter(p=>p.nodeId===race+'.a01.field'),s={};
 assert(!rollWorldMaterials(s,...context(first),{...options,random:()=>.999999}).drops.some(d=>d.channel==='gem'));
 assert(rollWorldMaterials(s,...context(second),{...options,random:()=>0}).drops.some(d=>d.channel==='gem'));
 assert(!rollWorldMaterials(s,...context(first),{...options,random:()=>0}).drops.some(d=>d.channel==='gem'));
 const id=gemOf(first).entries[0].materialId;assert.equal(s[id],1);delete s[id];
 assert(rollWorldMaterials(s,...context(first),{...options,random:()=>0}).drops.some(d=>d.channel==='gem'));
 for(const badNode of [race+'.a01.boss',race+'.a00.field']){const [e,u]=context(first);const rejected=rollWorldMaterials({}, {...e,instanceId:badNode},{...u,sourceInstanceId:badNode},{...options,random:()=>assert.fail('invalid source consumed RNG')});assert(!rejected.ok);assert.deepEqual(rejected.drops,[]);}
 summary.push(counts);
}
assert.equal(total,387);assert.deepEqual(summary,[{race:'dwarf',field:30,dungeon:40,boss:4},{race:'human',field:40,dungeon:40,boss:3},{race:'elf',field:40,dungeon:40,boss:4},{race:'goblin',field:30,dungeon:40,boss:3},{race:'ashen',field:30,dungeon:40,boss:3}]);
for(const kind of ['field','dungeon','boss'])for(let a=1;a<=10;a++){assert.equal(materialChannelProbability('gem',a,kind,'normal'),expected(a,kind));if(a>1)assert(expected(a,kind)>expected(a-1,kind));}
assert.equal(legendaryPoolProbability(0),.05,'base boss legendary probability unaffected');
// An association without a gem stays empty: the policy never creates new eligibility.
const source={monsterId:'test.a01.normal.1',nodeId:'test.a01.field',channels:[]},empty=buildMaterialPools({materials:{},monsters:[{id:source.monsterId,sources:[source.nodeId],rank:'normal'}],associations:{[source.monsterId+'|'+source.nodeId]:source}});
assert.equal(gemOf(Object.values(empty)[0]).entries.length,0);assert.equal(gemOf(Object.values(empty)[0]).hitProbability,0);
const shared={};for(const [,pools] of races){const p=Object.values(pools)[0];rollWorldMaterials(shared,...context(p),{...options,random:()=>0});}assert.equal(Object.keys(shared).filter(id=>WORLD_MATERIALS[id].uniqueHeld).length,5,'different racial gems coexist');
console.log('PASS Infinity base rates: exact 387 original pools/non-gem JSON, 1548 threshold checks, fixed Q3/held-one/reacquire, independent channels/monsters, all source and summon guards.',JSON.stringify(summary));

// Fixed-seed actual-roller samples, lowest and highest EXISTING source per kind.
// Reset ownership for each eligible judgment; otherwise held-one would censor rates.
const samples=[],n=100000;let seed=0x65c0ffee;
const random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/2**32);
for(const [race,pools] of races)for(const kind of ['field','dungeon','boss']){
 const ordered=Object.values(pools).filter(p=>coordinates(p).kind===kind).sort((a,b)=>coordinates(a).area-coordinates(b).area);
 for(const p of [ordered[0],ordered.at(-1)]){
  const seen={regular:0,recovery:0,special:0,gem:0};
  for(let i=0;i<n;i++)for(const d of rollWorldMaterials({},...context(p),{...options,random,owned:()=>false,receive:()=>true}).drops)seen[d.channel]++;
  for(const c of p.channels){const mean=n*c.hitProbability,sigma=Math.sqrt(mean*(1-c.hitProbability));assert(Math.abs(seen[c.channel]-mean)<=6*sigma+3,`${race} ${p.nodeId} ${c.channel} ${seen[c.channel]} vs ${mean}`);}
  samples.push({race,node:p.nodeId,judgments:n,gemDrops:seen.gem,expected:n*gemOf(p).hitProbability});
 }
}
console.log('PASS fixed-seed 3,000,000 eligible judgments; all four channel distributions within 6 sigma + 3.',JSON.stringify(samples));
