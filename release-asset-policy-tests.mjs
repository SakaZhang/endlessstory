import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {RELEASE_QA_EXCLUSIONS,releaseAssetRows} from './release-asset-policy.mjs';
import {readTree} from './build-release.mjs';
import {EXPANSION_PACKS} from './dist/race-packs.js';
const rows=await readTree('dist'),selected=releaseAssetRows(rows),paths=new Set(selected.map(x=>x.path));
assert.equal(RELEASE_QA_EXCLUSIONS.length,27);assert.equal(new Set(RELEASE_QA_EXCLUSIONS).size,27);
for(const excluded of RELEASE_QA_EXCLUSIONS){assert(rows.some(r=>r.path===excluded));assert(!paths.has(excluded));}
for(const file of ['battle-assets/manifest.json','map-assets/manifest.json','map-assets/exploration-manifest.json','service-assets/manifest.json'])assert(paths.has(file),'runtime manifest retained: '+file);
for(const row of rows)if(!RELEASE_QA_EXCLUSIONS.includes(row.path))assert(paths.has(row.path),'no broad filename filter');
function verify(value){if(typeof value==='string'&&/\.(png|webp)$/.test(value))assert(paths.has(value.replace(/^\.\.?\//,'')),value+' live art missing');else if(value&&typeof value==='object')Object.values(value).forEach(verify);}
for(const pack of EXPANSION_PACKS)verify(pack.art);
for(const file of ['story-assets/high-priest.png','story-assets/seal-core.png','story-assets/outsider-vanguard.png'])assert(paths.has(file),'story actor pixels remain in release');
const proof=rows.find(r=>r.path.endsWith('.png')&&RELEASE_QA_EXCLUSIONS.includes(r.path));
assert.throws(()=>verify('./'+proof.path),/live art missing/,'dot-prefixed excluded proof must still be rejected');
for(const excluded of RELEASE_QA_EXCLUSIONS)assert.throws(()=>releaseAssetRows([...rows,{path:'runtime-proof-consumer.js',bytes:Buffer.from('const resource="'+excluded+'";')}]),/referenced by runtime-proof-consumer/,'every reviewed exclusion is protected against later runtime use');
const bytes=rows.filter(r=>RELEASE_QA_EXCLUSIONS.includes(r.path)).reduce((n,r)=>n+r.bytes.length,0);
console.log('PASS explicit 14 QA PNG + 13 authoring/QA/provenance record exclusions, '+bytes+' bytes; every pack.art image retained; synthetic runtime dependency rejected; all other files retained.');
// Real emitted inventory must account for both included and deliberately omitted source bytes.
const {buildRelease}=await import('./build-release.mjs');
const {mkdtemp,rm}=await import('node:fs/promises');const {tmpdir}=await import('node:os');const {join}=await import('node:path');
const parent=await mkdtemp(join(tmpdir(),'race-package-policy-'));
try{const report=await buildRelease({source:'dist',output:join(parent,'output')});assert.equal(report.excludedQa.length,27);assert.equal(report.excludedQa.reduce((n,r)=>n+r.bytes,0),bytes);for(const row of report.files.filter(row=>!report.optimization.generated.includes(row.path))){assert(paths.has(row.path));assert.equal(row.sha256,rows.find(r=>r.path===row.path).sha256);}assert.equal(report.files.length,paths.size+report.optimization.generated.length);assert.equal(report.optimization.generated.length,4);for(const file of report.optimization.generated)assert(report.files.some(row=>row.path===file));for(const row of report.excludedQa){assert(RELEASE_QA_EXCLUSIONS.includes(row.path));assert.equal(row.sha256,rows.find(r=>r.path===row.path).sha256);}console.log('PASS emitted inventory + SHA256 hashes cover all retained files and 27 omitted QA/authoring/provenance files.');}finally{await rm(parent,{recursive:true,force:true});}
